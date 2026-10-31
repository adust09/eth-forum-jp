---
title: 'STVA向け[[Scoped-Capability-Token|スコープ付きケイパビリティトークン]]'
original_title: Scoped Capability Tokens for STVA
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/scoped-capability-tokens-for-stva/26195'
author: MATOBOYCRYPTO65
date: '2026-10-30'
category: Security
tags:
  - security
  - account-abstraction
  - smart-contracts
  - eip
  - ux
  - cryptography
  - formal-verification
topic_id: '26195'
translated_at: '2026-10-31'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Scoped Capability Tokens for STVA](https://ethresear.ch/t/scoped-capability-tokens-for-stva/26195) — MATOBOYCRYPTO65 (2026-10-30)

description:

短命で、目的が限定され、取り消し可能な承認トークン（[[EIP|EIP-712]]型データまたは[[ERC-1271|ERC-1271]]互換）で、特定の操作のみを許可します（例：実装を0x...にアップグレード、トークンYのXをZに転送、パーミッションPを持つモジュールをインストール）。

これらは[[ambient-authority|アンビエント権限]]と広範な承認を排除します。

独立したシミュレーション（シミュレーション結果をケイパビリティにバインドできる）や[[Account-Authority-Lifecycle|アカウント権限ライフサイクル]]（ケイパビリティは明示的なライフサイクルルールに基づいて発行、使用、取り消される）とクリーンに構成できるため、最高の相乗効果を発揮します。

ウォレットやハードウェアデバイスは、高リスクのペイロードに署名する前に、一致するケイパビリティを要求できます。

author: [@MATOBOYCRYPTO65](https://ethresear.ch/u/matoboycrypto65)

discussions-to: [https://ethereum-magicians.org/t/scoped-capability-tokens-for-stva/30124](https://ethereum-magicians.org/t/scoped-capability-tokens-for-stva/30124)

status: Draft

type: [[Standards-Track-proposal|Standards Track]]

category: [[ERC|ERC]]

created: 2026-10-29

**概要:**

[[Secure-Transaction-Verification-and-Authorization|STVA（安全なトランザクション検証と認可）]]で使用される、スコープ付き、期限付き、目的限定の[[Scoped-Capability-Token|ケイパビリティトークン]]の標準フォーマットと検証インターフェースを定義します。

ケイパビリティは権限を減衰させ、オフラインで独立して検証可能であり、取り消しをサポートし、シミュレーション結果または[[Intent-Hash|インテントハッシュ]]にバインドされます。

**動機:**

広範で長期間有効な承認やオーナー/モジュールキーは、高額な損失の主要な原因となっています。ケイパビリティは、署名時に[[least-privilege|最小権限]]を強制します。

**仕様:**

ケイパビリティは、[[EIP|EIP-712]]型構造化データオブジェクト（またはそのハッシュに対する[[ERC-1271|ERC-1271]]署名）です。

コアフィールド：

issuer (address)
subject (address またはそれを行使できるアカウント)
scope (構造化されたスコープのbytes32ハッシュ: アクションタイプ、ターゲット、値の範囲、calldataセレクター/マスク、パーミッション)
validAfter validUntil (uint48)
nonce or salt (リプレイ防止)
simulationResultHash (オプションで[[Independent-Simulator|独立シミュレーション結果]]へのバインディング)
intentHash (オプション)
chainId

発行：任意のアドレス（[[EOA|EOA]]、[[Multisig|マルチシグ]]、[[Smart-Account|スマートアカウント]]）がケイパビリティに署名します。

消費：アカウントまたは検証者は、署名、有効期限、提案されたトランザクション/[[UserOperation|UserOperation]]に対するスコープの一致、および（存在する場合）シミュレーションバインディングをチェックします。成功した場合、ケイパビリティは使用済みとしてマークされることがあります（オンチェーン[[nullifier|ナリファイア]]またはオフチェーンの単一使用追跡）。

取り消し：発行者は、ケイパビリティハッシュ[[nonce|ナンス]]をキーとする取り消しリストエントリまたはオンチェーンの取り消しレジストリを公開します。

コンプライアンスレベル：基本（有効期限 + スコープチェック）、標準（+ 独立したハッシュ再計算）、厳格（+ シミュレーションバインディング + ハードウェアでのスコープ表示）。

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

    // Verify a capability against a proposed action
    function verifyCapability(
        Capability calldata cap,
        bytes calldata signature,
        bytes32 txOrUserOpHash,
        bytes calldata actionData
    ) external view returns (bool valid);

    // Optional on-chain spend nullify
    function spendCapability(bytes32 capabilityHash) external;

    event CapabilityRevoked(bytes32 indexed capabilityHash, address indexed issuer);
}
```

**議論のポイント:**

正確なスコープエンコーディング（ABI vs. 人間が読めるJSON + ハッシュ）。
オンチェーンと純粋なオフチェーンの取り消しリスト。
シミュレーション結果へのバインディングの強度。
[[ERC-1271|ERC-1271]]スマートアカウント署名と[[EIP-7702|EIP-7702]]との統合。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/scoped-capability-tokens-for-stva/26195)
