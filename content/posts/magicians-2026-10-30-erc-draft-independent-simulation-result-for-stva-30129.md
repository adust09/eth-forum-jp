---
title: 'ERCドラフト: (STVA) 独立シミュレーション結果'
original_title: 'ERC draft: Independent Simulation Result for (STVA)'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-draft-independent-simulation-result-for-stva/30129
author: Obaresearch
date: '2026-10-30'
category: ERCs
tags:
  - ercs
  - security
  - smart-contracts
  - account-abstraction
  - verification
  - protocol-design
  - eip
  - simulation
  - transaction-verification
topic_id: '30129'
translated_at: '2026-10-31'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC draft: Independent Simulation Result for (STVA)](https://ethereum-magicians.org/t/erc-draft-independent-simulation-result-for-stva/30129) — Obaresearch (2026-10-30)

# ERCドラフト: (STVA) 独立シミュレーション結果

説明:

これは、独立した主体（ウォレット、ハードウェアデバイス、セカンドマシン、サードパーティ検証者）が、全く同じ[[glossary/Verification-Payload|検証ペイロード]]とステートスナップショットから生成し、再検証できる、カノニカルでコンテンツアドレス指定可能な構造です。

これにより、シミュレーションは、信頼されたフロントエンドサービスから、署名や[[glossary/Scoped-Capability-Token|スコープ付きケイパビリティトークン]]にバインドできる、再現可能で機械検証可能なアーティファクトへと変わります。

ケイパビリティトークン（結果ハッシュのバインド）および権限ライフサイクル（高特権権限の遷移前にシミュレーションが必要）との自然な連続性があります。

**概要:**

シミュレーション結果のフォーマット、ハッシュ化、検証を標準化し、準拠するシミュレーターが同一の入力に対して同一のカノニカルな出力を生成できるようにします。「UIが制御しないコンポーネントで再計算」を可能にします。

**動機:**

侵害されたフロントエンドによって提供されるシミュレーションは無価値です。独立性 + カノニカル性により、UI/コールデータ不一致型の攻撃を排除します。

**仕様:**

入力: トランザクション[[glossary/UserOperation|ユーザーオペレーション]] SafeTxの完全な原像（ハッシュに含まれるすべてのフィールドを含む）、ブロック/ステートルートまたは関連する状態の[[glossary/Merkle-proof|マークル証明]]、オプションのオーバーライド。

出力 (SimulationResult):

成功 (bool)
gasUsed
returnData
ログ (カノニカルエンコーディング)
stateDiff (またはstateDiffのハッシュ)
balanceChanges
トークン転送 (構造化)
セマンティックエフェクト (オプションの派生サマリー、できれば[[glossary/ERC-7730-Descriptors|ERC-7730記述子]]形式の記述子を介して再計算)
snapshotId (ブロック番号 + ステートルート)
simulatorId
バージョン

カノニカルハッシュ: `keccak256(abi.encode(SimulationResult))` またはドメイン分離された[[glossary/EIP-712-attestation-profile|EIP-712ハッシュ]]。

要件: ハードウェアオフライン検証者は、不一致の場合に再実行（または証明を再検証）し、拒否できなければならない。

コンプライアンス: 基本 (任意のシミュレーター)、標準 (ステートルートに関するマルチノードコンセンサス)、厳格 (ローカルrevm/[[glossary/EVM|EVM]]実行 + プリステートのMerkle証明)。

**参照**:

```solidity
struct SimulationResult {
    bool success;
    uint256 gasUsed;
    bytes returnData;
    bytes32 stateDiffHash;
    bytes32 logsHash;
    bytes32 snapshotId; // ブロックハッシュまたはステートルート
    bytes32 resultHash; // 自己記述的なカノニカルハッシュ
    string derivedSummary; // オプション、主張または再計算
}
```

**議論点:**

正確なstateDiffエンコーディング（サイズのための完全なもの vs. ハッシュのみ）。
必要なプリステート証明 vs. マルチノードコンセンサスを持つ信頼されたRPC。
[[glossary/Verification-Payload|検証ペイロード]]とケイパビリティにどれだけ厳密にバインドするか。

(STVA) 提案の独立シミュレーション結果に関する公開ドラフトリポジトリをセットアップし、基本的なCI（Markdownリンティング、リンクチェック、codespell）を設定しました。

現在、すべてのチェックがパスしています。

[github.com](https://github.com/MATOBOYCRYPTO65/ERC-draft-)

![GitHub - MATOBOYCRYPTO65/ERC-draft-: ERCドラフト: 独立シミュレーション結果 for...](https://opengraph.githubassets.com/62e3740f51884d34872ae6c8069c2456/MATOBOYCRYPTO65/ERC-draft-)

### [GitHub - MATOBOYCRYPTO65/ERC-draft-: ERCドラフト: 独立シミュレーション結果 for...](https://github.com/MATOBOYCRYPTO65/ERC-draft-)

ERCドラフト: (STVA) 独立シミュレーション結果

**カノニカル性がコアバリューです**: すべての可変データはハッシュ化されるため、同一のセマンティックな結果を生成する2つの独立したシミュレーターは、同一のresultHashを生成します。

フィードバックをお待ちしております

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-draft-independent-simulation-result-for-stva/30129)
