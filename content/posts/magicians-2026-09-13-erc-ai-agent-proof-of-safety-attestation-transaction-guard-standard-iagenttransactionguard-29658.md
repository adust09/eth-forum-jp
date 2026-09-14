---
title: 'ERC: AIエージェントの安全証明アテステーションおよびトランザクションガード標準 (IAgentTransactionGuard)'
original_title: >-
  ERC: AI Agent Proof-of-Safety Attestation & Transaction Guard Standard
  (IAgentTransactionGuard)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-ai-agent-proof-of-safety-attestation-transaction-guard-standard-iagenttransactionguard/29658
author: nohosa001-pixel
date: '2026-09-13'
category: EIPs
tags:
  - eips
  - ai-agents
  - smart-contracts
  - security
  - defi
  - account-abstraction
  - eip
  - cryptography
  - protocol-design
topic_id: '29658'
translated_at: '2026-09-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC: AI Agent Proof-of-Safety Attestation & Transaction Guard Standard (IAgentTransactionGuard)](https://ethereum-magicians.org/t/erc-ai-agent-proof-of-safety-attestation-transaction-guard-standard-iagenttransactionguard/29658) — nohosa001-pixel (2026-09-13)

# ERC: AIエージェントの安全証明アテステーションおよびトランザクションガード標準 (IAgentTransactionGuard)に関する議論トピック

## 更新ログ

-   2026-09-13: 初版仕様と参照実装がGitHubで公開されました: [nohosa001-pixel/security-gate-x402](https://github.com/nohosa001-pixel/security-gate-x402)

## 外部レビュー

-   2026-09-13: Gnosis Safe{Wallet} Polygon [[glossary/mainnet|メインネット]]コントラクトに対してテストおよび検証済み。2026-09-13現在、正式な外部監査はなし。

## 未解決の問題

-   2026-09-13現在なし。（[[glossary/nonce|ノンス]]によるリプレイ保護とバッチ有効期限タイムスタンプのどちらが良いかについて、コミュニティからのフィードバックを求めています。）

* * *

```
eip: <to be assigned>
title: AI Agent Proof-of-Safety Attestation and Transaction Guard Standard
description: Standardized EIP-712 cryptographic safety attestation and execution guard for autonomous AI agent smart contract accounts.
author: Security Gate x402 Architecture Team (@nohosa001-pixel)
discussions-to: https://ethereum-magicians.org/
status: Draft
type: Standards Track
category: ERC
created: 2026-09-13
requires: 712, 1271, 4337
```

### 概要

この標準は、スマートコントラクトアカウント（Gnosis Safeマルチシグや[[glossary/ERC-4337|ERC-4337]]スマートアカウントなど）を介して金融トランザクションを実行する自律型AIエージェントのための、[[glossary/on-chain|オンチェーン]]インターフェースと暗号学的検証フローを規定します。

`IAgentTransactionGuard`と`IAgentCreditOracle`を導入し、トランザクションのファイナリティ前に署名された[[glossary/EIP-712|EIP-712]]安全証明アテステーションを要求することで、不正な資金流出、敵対的プロンプトインジェクション攻撃、および幻覚的なトランザクションコールを防ぎます。

### 動機

自律型AIエージェントが分散型資金を管理し、高頻度アービトラージを実行し、[[glossary/DeFi|DeFi]]プロトコルと対話するにつれて、既存のスマートコントラクトアーキテクチャには、エージェントのトランザクションペイロードが以下の点に対して検証されたかどうかを決定論的に検証するメカニズムが不足しています。

1.  **敵対的プロンプトインジェクション攻撃**（例: DANプロンプト、信頼できない入力による間接的な命令ハイジャック）。
2.  トランザクションコールデータにおける**システム的な幻覚または算術的な不一致**。
3.  **予算と速度の制限**（ガスやスリッページによってエージェントの資金が無限ループで流出するのを防ぐ）。

相互運用可能な標準を定義することで、以下のことが可能になります。

-   あらゆる自律型エージェントランタイム（ElizaOS、LangChain、AutoGen、CrewAI）が、トランザクションを送信する前に標準化された暗号学的安全証明アテステーションを取得できます。
-   あらゆるスマートコントラクトアカウント（Safe、[[glossary/ERC-4337|ERC-4337]]アカウント）が、独自のベンダーロックインなしに、標準トランザクションガードを通じて決定論的検証を強制できます。

### 仕様

この標準は、2つのコアインターフェースで構成されています。

#### 1. `IAgentTransactionGuard`

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAgentTransactionGuard {
    struct SecurityAttestation {
        bytes32 payloadHash;
        uint8 riskScore;
        string verdict;
        uint256 expiresAt;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    event SafeTransactionGuarded(address indexed safe, address indexed to, uint256 value, uint8 riskScore);

    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        uint8 operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures,
        address msgSender
    ) external;

    function checkAfterExecution(bytes32 txHash, bool success) external;
}
```

#### 2. `IAgentCreditOracle`

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAgentCreditOracle {
    struct AgentCreditProfile {
        address agentAddress;
        uint16 creditScore;      // 300 to 850 (Standard FICO Scale)
        uint256 uncollateralizedCreditLimit;
        uint256 totalAuditedVolume;
        uint32 consecutiveSafeTxCount;
        uint256 lastAuditTimestamp;
        bool isBlacklisted;
    }

    event CreditProfileUpdated(address indexed agent, uint16 newScore, uint256 creditLimit);

    function getCreditProfile(address agent) external view returns (AgentCreditProfile memory);
    function verifyProofOfSafety(bytes32 payloadHash, bytes calldata signature) external view returns (bool isValid, uint8 riskScore);
}
```

### 理論的根拠

-   **[[glossary/EIP-712|EIP-712]]互換性**: 構造体ハッシュ化により、[[glossary/off-chain|オフチェーン]]のセキュリティ評価オラクルが、検証可能なドメイン分離を持つ機械可読なペイロードに署名でき、異なるチェーンやスマートアカウント間でのリプレイ攻撃を防ぎます。
-   **[[glossary/ERC-4337|ERC-4337]]およびSafeとの構成可能性**: 既存のSafe `ITransactionGuard`署名と一致し、[[glossary/ERC-4337|ERC-4337]] `IPaymaster`または`IAccount`検証モジュールに拡張できます。
-   **レイテンシーの考慮**: 検証は[[glossary/off-chain|オフチェーン]]（5ミリ秒未満のマイクロオラクル）で行われ、暗号学的署名のみが[[glossary/on-chain|オンチェーン]]で検証されるため、[[glossary/EVM|EVM]]実行ガスは最小限（約25,000ガス）に抑えられます。

### 参照実装とライブデモ

完全に機能し、テスト済みの参照実装とライブインタラクティブデモが利用可能です。

-   :globe_with_meridians: **ライブインタラクティブデモ（シェリフエージェントとセーフガード）**: [https://agent-security-gate-x402-212942243360.asia-northeast3.run.app/dashboard](https://agent-security-gate-x402-212942243360.asia-northeast3.run.app/dashboard)
-   :classical_building: **Gnosis Safe{Wallet}アプリストア認定**: [Safe{Wallet}で開く（Polygonメインネット）](https://app.safe.global/share/safe-app?appUrl=https%3A%2F%2Fagent-security-gate-x402-212942243360.asia-northeast3.run.app&chain=matic)
-   :scroll: **デプロイ済み検証済みコントラクト（Polygonメインネット）**:
    -   `SafeSecurityGateGuard.sol`: [`0x5cC5Afa2a97599d492A3E408Fdd95fD0b520f173`](https://polygonscan.com/address/0x5cC5Afa2a97599d492A3E408Fdd95fD0b520f173)
    -   `AgentCreditRatingOracle.sol`: [`0x6418f408cFf03F862D7691f01fAb00a895E6aB93`](https://polygonscan.com/address/0x6418f408cFf03F862D7691f01fAb00a895E6aB93)
-   :package: **オープンソースリポジトリ**: [https://github.com/nohosa001-pixel/security-gate-x402](https://github.com/nohosa001-pixel/security-gate-x402)

### コミュニティからのフィードバックを歓迎します

イーサリアム標準コミュニティおよびスマートアカウント/Safeビルダーからの意見を求めています。

1.  `SecurityAttestation`に厳密なシーケンシャルトランザクション順序付けのための[[glossary/nonce|ノンス]]フィールドを含めるべきでしょうか、それとも`expiresAt`でマイクロバッチには十分でしょうか？
2.  超高価値の資金移動に対して、マルチオラクルコンセンサス（閾値署名）はどのように構築されるべきでしょうか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-ai-agent-proof-of-safety-attestation-transaction-guard-standard-iagenttransactionguard/29658)
