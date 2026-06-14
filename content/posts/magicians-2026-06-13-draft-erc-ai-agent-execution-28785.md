---
title: 'ドラフトERC: AIエージェント実行'
original_title: 'Draft ERC: AI Agent Execution'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/draft-erc-ai-agent-execution/28785'
author: JimmyShi22
date: '2026-06-13'
category: ERCs
tags:
  - ercs
  - applications
  - ai-agents
  - smart-contracts
  - eip
  - protocol-design
  - research
topic_id: '28785'
translated_at: '2026-06-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Draft ERC: AI Agent Execution](https://ethereum-magicians.org/t/draft-erc-ai-agent-execution/28785) — JimmyShi22 (2026-06-13)

皆さん、こんにちは :waving_hand:、

[[glossary/ERC-8274|ERC-8274]]、[[glossary/ERC-8183|ERC-8183]]、そして [[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]] に取り組む中で繰り返し浮上してきたギャップを共有し、他の人も同じ問題に直面していないか確認したいと思います。

[[glossary/On-chain-AI-agent-systems|オンチェーンAIエージェントシステム]]のエコシステムは、エージェントのアイデンティティ ([[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]])、推論証明の検証 ([[glossary/ERC-8274|ERC-8274]])、証明のアンカリング ([[glossary/ERC-8263|ERC-8263 (オンチェーン証明レイヤー)]])、エージェントコマース ([[glossary/ERC-8183|ERC-8183]]) など、いくつかのレイヤーで実際に進歩を遂げてきました。しかし、まだ一つ基礎的なプリミティブが欠けています。それは、スマートコントラクトがAIエージェントを*どのように*呼び出し、その出力を受け取るかという標準です。

現在、AIエージェントを呼び出したいすべてのdAppは独自のタスクフォーマットを定義しており、すべてのエージェントはdAppごとに個別の「アダプター (adapter)」を実装する必要があります。

```
dApp A defines its own task format  →  agent X adapts
dApp B defines a different format   →  agent X adapts again
dApp C defines yet another format   →  agent X adapts again
...
agent Y must do the same for A, B, C  →  N×M integration complexity
```

これは、[[glossary/ERC-8274|ERC-8274]] が検証レイヤーで解決したのと同じ断片化の問題です。タスクレイヤーでは、一つ上のレベルで同じ問題が発生しています。

* * *

### 動機

オンチェーンAIエージェントスタックは、ブロックチェーンの基礎的な特性に類似した6つのベースレイヤープリミティブに自然にマッピングされます。

| プリミティブ | ブロックチェーンのアナログ | ERC |
| --- | --- | --- |
| アイデンティティ | アドレス | [[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]] |
| 実行 | スマートコントラクト（定義 + 呼び出し） | 未実装 |
| 検証 | コンセンサス | [[glossary/ERC-8274|ERC-8274]] |
| アンカー | オンチェーンステート | [[glossary/ERC-8263|ERC-8263 (オンチェーン証明レイヤー)]] |
| 決済 | 価値移転 | ERC-8275 |
| 証明 | ログ / 監査証跡 | ERC-8281 + ERC-8299 |

このベースの上に構築された2つのレイヤーもあります。

```
  ┌── エコシステム層 ──────────────────────────────────────────────────┐
  │                                                                     │
  │  ┌───────────────┐   ┌───────────────┐   ┌───────────────────────┐  │
  │  │   ERC-8183    │   │   ERC-8273    │   │       ERC-8257        │  │
  │  │ 労働市場      │   │ 承認          │   │    スキルレジストリ   │  │
  │  └───────────────┘   └───────────────┘   └───────────────────────┘  │
  │                                                                     │
  └───────────────────────────────┬─────────────────────────────────────┘
                                  │ 全てが依存
  ┌── ベース層 ───────────────────▼─────────────────────────────────────┐
  │                                                                     │
  │  アイデンティティ → 実行 → 検証 → アンカー → 決済 → 証明     │
  │  ERC-8004    [このERC]   ERC-8274  ERC-8263  ERC-8275  8281+8299   │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘
```

実行はベースレイヤーで最後に残された「レンガ」です。これがないと、すべてのエコシステムERCは、共有されたプリミティブ上で構成するのではなく、独自のタスクフォーマットを定義せざるを得ません。例えば、[[glossary/ERC-8183|ERC-8183]] は自由形式の `description` 文字列を使用し、ERC-8001 は不透明な `executionData` バイトを使用し、[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]] は完全にオフチェーンのA2A/MCPに委ねています。

* * *

### 提案

この提案は、3つの最小限のコンポーネントを定義します。この設計は、エージェントルーティング、タスク状態管理、労働市場、およびセマンティックなタスク定義を明示的に除外しています。これはプロトコルレイヤーであり、アプリケーションレイヤーではありません。

**1\. `AgentTask` — タスク定義**

```solidity
struct AgentTask {
    bytes32 taskId;            // unique identifier
    bytes32 systemPromptHash;  // keccak256(systemPrompt)
    bytes   systemPrompt;      // optional: full text (omit to save gas)
    bytes32 modelId;           // target model/agent type (abstract bytes32)
    address handler;           // contract implementing IAgentHandler
    address verifier;          // optional: IAgentVerifiable (ERC-8274); address(0) = no proof required
    uint256 deadline;          // expiry timestamp
}
```

`systemPromptHash` は静的なタスクコンテキストにコミットします。動的なユーザープロンプトは呼び出し時に提供されるため、同じ `AgentTask` 定義を複数の呼び出しで再利用できます。

**2\. `IAgentCaller` — タスクディスパッチ**

```solidity
interface IAgentCaller {

    event CallAgent(
        bytes32 indexed taskId,
        address indexed requester,
        bytes32         systemPromptHash,
        bytes           systemPrompt,      // optional
        bytes32         userPromptHash,
        bytes           userPrompt,        // optional
        bytes32         inputHash,         // keccak256(systemPromptHash ‖ userPromptHash), computed on-chain
        bytes32         modelId,
        address         handler,
        address         verifier,          // IAgentVerifiable; address(0) = no proof required
        uint256         deadline
    );

    function callAgent(
        AgentTask calldata task,
        bytes32           userPromptHash,
        bytes    calldata userPrompt
    ) external returns (bytes32 taskId);
}
```

オフチェーンエージェントは `CallAgent` イベントを購読します。`inputHash` は `keccak256(systemPromptHash, userPromptHash)` としてオンチェーンで計算されます。これは [[glossary/ERC-8274|ERC-8274]] が使用するフィールドと同じであり、タスク呼び出しと証明検証の間に改ざん防止リンクを提供します。

**3\. `IAgentHandler` — 返信と証明のコールバック**

単一の `callAgent` は複数の `onAgentReply` 呼び出しをトリガーする可能性があります。これは、ストリーミング出力、多段階推論、およびマルチエージェントのファンアウトをサポートします。`nonce` フィールド（0から始まり単調増加）は各呼び出しを区別し、`isFinal` は最後の返信であることを示します。

`onAgentProve` は `onAgentReply` から意図的に分離されています。結果の提出と証明の提出は独立して行われるため、オプティミスティックなハンドラーは返信にすぐに作用でき、証明は非同期に続きます。

```solidity
interface IAgentHandler {

    // Called by agent — may be invoked multiple times per task
    function onAgentReply(
        bytes32        taskId,
        bytes32        inputHash,
        bytes32        outputHash,   // keccak256(output)
        bytes calldata output,       // optional: raw output
        uint256        agentId,      // ERC-8004 agent identifier
        address        agent,
        uint256        nonce,        // starts at 0, increments per reply
        bool           isFinal       // true = last reply for this task
    ) external;

    // Called by proof provider (agent or third party)
    function onAgentProve(
        bytes32        taskId,
        bytes32        inputHash,
        bytes32        outputHash,   // must match onAgentReply(nonce=N).outputHash
        bytes calldata proof,        // raw proof bytes
        address        verifier,     // IAgentVerifiable address (ERC-8274)
        uint256        nonce         // which onAgentReply this proof covers
    ) external;
}
```

ハンドラーは [[glossary/ERC-8274|ERC-8274]] の検証者チェーンを内部で解決します: `IAgentVerifiable(verifier).getAgentVerifier()` → `IAgentVerifier.verify(proof, inputHash, outputHash)`。

* * *

### 未解決の疑問

1.  **`taskId` の生成**: 呼び出し元が提供すべきか（オンチェーン登録前のオフチェーン調整を可能にする）、それともコントラクトが生成すべきか（`keccak256(requester, nonce)`、衝突を防止する）？どちらにも有効なユースケースがあります。
    
2.  **`modelId` のセマンティクス**: 不透明な `bytes32` のままで完全にオフチェーンで解決されるべきか、それとも軽量なオンチェーンモデルレジストリ（`modelId` → 証明システム、バージョン、機能へのマッピング）が追加の複雑さに見合う価値があるか？
    
3.  **`onAgentProve` の配置**: `IAgentHandler` 内に置くべきか（現在の設計、統一されたインターフェース）、それとも別の `IAgentProveHandler` インターフェースに置くべきか（結果のみを気にするハンドラーをよりシンプルに保つため）？
    

* * *

すべてのフィードバックを歓迎します。v0.1ドラフトは現在進行中です。上記の未解決の疑問は、仕様が固まる前にコミュニティの視点が最も価値のある領域です。設計のあらゆる側面について、ここで議論できることを嬉しく思います。

*6件の投稿 - 4人の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/draft-erc-ai-agent-execution/28785)
