---
title: 'ERCドラフト: (STVA) 独立シミュレーション結果'
original_title: 'ERC draft: Independent Simulation Result for (STVA)'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/erc-draft-independent-simulation-result-for-stva/26198'
author: MATOBOYCRYPTO65
date: '2026-10-30'
category: Security
tags:
  - security
  - erc
  - simulation
  - account-abstraction
  - cryptography
  - smart-contracts
  - ux
  - verification
topic_id: '26198'
translated_at: '2026-11-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC draft: Independent Simulation Result for (STVA)](https://ethresear.ch/t/erc-draft-independent-simulation-result-for-stva/26198) — MATOBOYCRYPTO65 (2026-10-30)

Description:

独立した当事者（ウォレット、ハードウェアデバイス、セカンドマシン、第三者検証者）が、全く同じ[[glossary/Verification-Payload|検証ペイロード]]とステートスナップショットから生成し、再検証できる、カノニカルでコンテンツアドレス指定可能な構造。

これにより、信頼されたフロントエンドサービスからのシミュレーションが、再現可能で機械検証可能なアーティファクトへと変わり、署名や[[glossary/Scoped-Capability-Token|スコープ付きケイパビリティトークン]]にバインドできるようになります。

ケイパビリティトークン（結果ハッシュをバインドする）および権限ライフサイクル（高権限の権限遷移前にシミュレーションが必要）との自然な継続性があります。

author: [@MATOBOYCRYPTO65](https://ethresear.ch/u/matoboycrypto65)

discussions-to: [ERC draft: Independent Simulation Result for (STVA) - ERCs - Fellowship of Ethereum Magicians](https://ethereum-magicians.org/t/erc-draft-independent-simulation-result-for-stva/30129)

status: Draft

type: Standards Track

category: ERC

created: 2026-10-30

**概要:**

シミュレーション結果のフォーマット、ハッシュ化、検証を標準化し、どの準拠シミュレーターも同じ入力に対して同一のカノニカルな出力を生成できるようにします。「UIが制御しないコンポーネントでの再計算」を可能にします。

**動機:**

侵害されたフロントエンドによって提供されるシミュレーションは無価値です。独立性 + カノニカル性により、[[glossary/UIcalldata-mismatch-attack|UI/calldata不一致攻撃]]のクラスを解消します。

**仕様:**

入力: トランザクションの[[glossary/UserOperation|UserOperation]] SafeTxの完全な原像（ハッシュに含まれるすべてのフィールドを含む）、ブロック/ステートルート、または関連するステートのマークル証明、オプションのオーバーライド。

出力 (SimulationResult):

success (bool)
gasUsed
returnData logs (canonical encoding)
[[glossary/stateDiff|状態差分 (stateDiff)]] (または状態差分のハッシュ)
balanceChanges tokenTransfers (structured)
semanticEffects (オプションの派生サマリー、[[glossary/ERC-7730-Descriptors|ERC-7730記述子]]スタイルで再計算されることが望ましい)
snapshotId (ブロック番号 + ステートルート)
simulatorId version

カノニカルハッシュ: `keccak256(abi.encode(SimulationResult))` またはドメイン分離された[[glossary/EIP-712-attestation-profile|EIP-712アテステーションプロファイル]]ハッシュ。

要件: ハードウェアオフライン検証者は、再実行（または証明の再検証）し、不一致があれば拒否できる**必要があります**。

コンプライアンス: 基本（任意のシミュレーター）、標準（ステートルートに関するマルチノードコンセンサス）、厳格（ローカルのrevm/EVM実行 + プリステートのマークル証明）。

**参照**:

```solidity
struct SimulationResult {
    bool success;
    uint256 gasUsed;
    bytes returnData;
    bytes32 stateDiffHash; // or full stateDiff
    bytes32 logsHash;
    bytes32 snapshotId; // blockHash or stateRoot
    bytes32 resultHash; // self-describing canonical hash
    string derivedSummary; // optional, claimed or recomputed
}
```

**議論点:**

正確な[[glossary/stateDiff|状態差分 (stateDiff)]]エンコーディング（サイズのために完全なものかハッシュのみか）。
必要なプリステート証明 vs. マルチノードコンセンサスを持つ信頼されたRPC。
[[glossary/Verification-Payload|検証ペイロード]]とケイパビリティにどの程度厳密にバインドするか。

フィードバックをお待ちしております。

*2 posts - 2 participants*

[Read full topic](https://ethresear.ch/t/erc-draft-independent-simulation-result-for-stva/26198)
