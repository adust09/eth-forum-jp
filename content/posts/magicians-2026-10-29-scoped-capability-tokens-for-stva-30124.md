---
title: STVA向けスコープ付きケイパビリティトークン
original_title: Scoped Capability Tokens for STVA
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/scoped-capability-tokens-for-stva/30124'
author: Obaresearch
date: '2026-10-29'
category: ERCs
tags:
  - ercs
  - security
  - smart-contracts
  - account-abstraction
  - eip
  - cryptography
  - ux
topic_id: '30124'
translated_at: '2026-10-30'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Scoped Capability Tokens for STVA](https://ethereum-magicians.org/t/scoped-capability-tokens-for-stva/30124) — Obaresearch (2026-10-29)

ERCドラフト:

**概要:**

[[Secure-Transaction-Verification-and-Authorization|STVA（安全なトランザクション検証と認可）]]で使用される、スコープ付き、期限付き、目的限定の[[glossary/Scoped-Capability|スコープ付きケイパビリティ]]トークンの標準フォーマットと検証インターフェースを定義します。

[[glossary/Scoped-Capability|ケイパビリティ]]は権限を減衰させ、オフラインで独立して検証可能であり、取り消し（revocation）をサポートし、シミュレーション結果またはインテントハッシュにバインドされます。

**動機:**

広範で長期間有効な承認や、オーナー/モジュールキーは、高額な損失の主要な経路となっています。[[glossary/Scoped-Capability|ケイパビリティ]]は、署名時に最小権限を強制します。

**仕様:**

[[glossary/Scoped-Capability|ケイパビリティ]]は、[[EIP-712|EIP-712]]型構造化データオブジェクト（またはそのハッシュに対する[[ERC-1271|ERC-1271]]署名）です。

主要フィールド:

*   `issuer` (アドレス)
*   `subject` (アドレスまたはそれを行使できるアカウント)
*   `scope` (構造化されたスコープのbytes32ハッシュ: アクションタイプ、ターゲット、値の範囲、コールデータセレクター/マスク、パーミッション)
*   `validAfter` `validUntil` (uint48)
*   `nonce` または `salt` (リプレイ防止)
*   `simulationResultHash` (独立したシミュレーション結果へのオプションのバインディング)
*   `intentHash` (オプション)
*   `chainId`

発行: 任意のアドレス（[[EOA|EOA]]、[[Multisig|マルチシグ]]、[[Smart-Account|スマートアカウント]]）が[[glossary/Scoped-Capability|ケイパビリティ]]に署名します。

消費: アカウントまたは検証者は、署名、有効期限、提案されたトランザクション/UserOperationに対するスコープの一致、および（存在する場合）シミュレーションバインディングをチェックします。成功した場合、[[glossary/Scoped-Capability|ケイパビリティ]]は使用済みとしてマークされることがあります（オンチェーンの[[nullifier|ナリファイア]]またはオフチェーンの単一使用追跡）。

取り消し: 発行者は、[[glossary/Scoped-Capability|ケイパビリティ]]ハッシュとナンスをキーとする取り消しリストエントリまたはオンチェーンの取り消しレジストリを公開します。

コンプライアンスレベル: 基本（有効期限 + スコープチェック）、標準（+ 独立したハッシュ再計算）、厳格（+ シミュレーションバインディング + スコープのハードウェア表示）。

**インターフェース:**

```solidity
interface IScopedCapability {
    struct Capability {
        address issuer;
        address subject;
        bytes32 scope; // keccak256 of structured Scope
        uint48 validAfter;
        uint48 validUntil;
        bytes32 salt;
        bytes32 simulationResultHash; // optional
        bytes32 intentHash; // optional
        uint256 chainId;
    }

    struct Scope {
        bytes4 selector; // or bytes32 actionId
        address target;
        uint256 valueMax;
        bytes calldataMask; // optional restriction
        bytes32 permissions; // for modules ownership changes
    }

    // 提案されたアクションに対してケイパビリティを検証する
    function verifyCapability(
        Capability calldata cap,
        bytes calldata signature,
        bytes32 txOrUserOpHash,
        bytes calldata actionData
    ) external view returns (bool valid);

    // オプションのオンチェーン使用済みナリファイ
    function spendCapability(bytes32 capabilityHash) external;

    event CapabilityRevoked(bytes32 indexed capabilityHash, address indexed issuer);
}
```

**議論点:**

*   正確なスコープエンコーディング（ABI vs. 人間が読めるJSON + ハッシュ）。
*   オンチェーンと純粋なオフチェーンの取り消しリスト。
*   シミュレーション結果へのバインディング強度。
*   [[ERC-1271|ERC-1271]]スマートアカウント署名および[[EIP-7702|EIP-7702]]との統合。

[[Secure-Transaction-Verification-and-Authorization|STVA]]向け[[glossary/Scoped-Capability|スコープ付きケイパビリティトークン]]のドラフト提案に関する公開ドラフトリポジトリをセットアップし、基本的なCI（Markdownリンティング、リンクチェック、codespell）を設定しました。

現在、すべてのチェックがパスしています

[github.com](https://github.com/MATOBOYCRYPTO65/ERC-draft-Scoped-Capability)

![](https://opengraph.githubassets.com/f0226d03baf70ac5a975e256af0628f0/MATOBOYCRYPTO65/ERC-draft-Scoped-Capability)

### [GitHub - MATOBOYCRYPTO65/ERC-draft-Scoped-Capability: ERC draft: STVA向けスコープ付きケイパビリティトークン](https://github.com/MATOBOYCRYPTO65/ERC-draft-Scoped-Capability)

ERC draft: STVA向けスコープ付きケイパビリティトークン

ご意見をお待ちしております。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/scoped-capability-tokens-for-stva/30124)
