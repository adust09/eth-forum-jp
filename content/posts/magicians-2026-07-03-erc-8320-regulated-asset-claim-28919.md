---
title: 'ERC-8320: 規制対象アセットのクレーム'
original_title: 'ERC-8320: Regulated Asset Claim'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8320-regulated-asset-claim/28919'
author: thamerdridi
date: '2026-07-03'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - economics
  - governance
  - security
  - regulated-assets
  - claims-registry
topic_id: '28919'
translated_at: '2026-07-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8320: Regulated Asset Claim](https://ethereum-magicians.org/t/erc-8320-regulated-asset-claim/28919) — thamerdridi (2026-07-03)

オンチェーンアセットに関する検証可能なクレームのためのレジストリ標準を提案します。

**現状の課題:**
既存の標準は、アセットがどのように振る舞うかを定義しています。ERC-4626/7540/7575は価値を保持し決済する方法を、ERC-3643/7943は誰がアセットを保有し転送できるかを強制します。しかし、機械が検証できる形式で、アセットが何であるか、その価値はいくらか、何に裏付けられているかを定義する標準は存在しません。そのデータはPDFに存在するため、すべての統合はオーダーメイド (bespoke) となります。自己申告では解決しません。自己申告されたNAV（純資産価値）は、その裏に誰がいるのかを何も証明しないからです。

**プリミティブ:**
クレームとは、アセットに関する署名され、バージョン管理され、ハッシュでアンカーされたステートメントであり、`assetId`をキーとするレジストリに保持されます。クレームタイプは8種類あります: IDENTITY（アイデンティティ）、VALUATION（評価）、MANDATE（委任）、TERMS（条件）、COMPLIANCE（コンプライアンス）、BACKING（裏付け）、EVENT（イベント）、RISK（リスク）。ペイロードはオフチェーンに置かれ、オンチェーンにはアンカー、スキーマ参照とハッシュ、およびコンテンツハッシュが保持されます。

**オンチェーンでのメーカー・チェッカー:**
レジストリの管理者によって付与される、(assetId, claimType) ごとに3つの役割があります: AUTHOR（提案者）が提案し、VALIDATOR（検証者）が検証または取り消し、ACTIVATOR（有効化者）が有効化または一時停止します。VALIDATORはAUTHORとは異なる必要があります。ライフサイクルは、PROPOSED（提案済み）、VALID（有効）、ACTIVE（アクティブ）、EXPIRED（期限切れ、時間経過による）、REVOKED（取り消し済み）です。すべての行為はナンス (nonce) とデッドライン (deadline) を持つ[[EIP-712-attestation-profile|EIP-712]]署名であり、ERC-1271がサポートされているため、オラクル (oracle) や[[Multisig|マルチシグ]]委員会はオフチェーンでアテステーション（証明）を行い、誰でも提出できます。職務分離はコントラクトによって強制されます。

**信頼の方向性:**
1つのタイプに対して複数のクレームがアクティブになることがあり、検証者と有効化者がそのセットをキュレートします。アセットは、クロスリスティング (cross-listing) のように、認識するレジストリを承認するために`IRegistryAnchor`を実装できます。これは、同じ金融商品が複数の取引所に上場され、発行者 (issuer) が選択するのと似ています。承認されていないレジストリは無視されなければなりません。アンカーできないアセットは、レジストリの管理者を信頼することになります。

**未解決の疑問:**

1.  **規範的スキーマ:** すべてのペイロードは、`schemaId`によって参照される規範的スキーマに準拠する必要があります。クレームタイプごとのスキーマ（評価、コンプライアンス、裏付けなど）は、[[ERC|Ethereum Request for Comments (ERC)]]の内部で規範的であるべきでしょうか、それとも[[ERC|Ethereum Request for Comments (ERC)]]が参照する別のバージョン管理された仕様であるべきでしょうか？内部の場合: 安定しており、レビュー可能です。外部の場合: 標準に触れることなく、新しいアセットクラスとともに進化できます。

ドラフト: [Add ERC: Regulated Asset Claim by thamerdridi · Pull Request #1849 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/1849)
参照実装: 進行中。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8320-regulated-asset-claim/28919)
