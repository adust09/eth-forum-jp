---
title: 'ERC-8332: 物理準備金レジストリ'
original_title: 'ERC-8332: Physical Reserve Registry'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8332-physical-reserve-registry/28964'
author: 0xAsef
date: '2026-07-07'
category: ERCs
tags:
  - ercs
  - economics
  - defi
  - applications
  - protocol-design
  - eip
  - smart-contracts
  - tokenomics
  - rwa
topic_id: '28964'
translated_at: '2026-07-10'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8332: Physical Reserve Registry](https://ethereum-magicians.org/t/erc-8332-physical-reserve-registry/28964) — 0xAsef (2026-07-07)

#### 概要

皆さん、こんにちは。物理準備金レジストリのための新しい[[glossary/ERC|ERC（Ethereum Request for Comments）]]を提案したいと思います。これは、物理的な準備金をオンチェーンで表現するための標準インターフェースであり、[[glossary/reserve-backed-token|準備金裏付けトークン]]やその他の[[glossary/RWA-platforms|RWA（Real World Asset）]]商品への裏付けとして割り当てられるようにするものです。

#### 動機

多くの[[glossary/reserve-backed-token|準備金裏付けRWAトークン]]は、銀行記録、監査報告書、または規制上の[[glossary/Attestation|アテステーション（証明）]]に依存しています。しかし、これらの記録は通常、共通のオンチェーンインターフェースを通じて公開されていません。このため、ウォレット、エクスプローラー、およびDeFiプロトコルが、準備金のID、数量、割り当て、および保証を標準化された方法で照会することが困難になっています。

この提案は、銀行、カストディアン、監査人、法的文書、または規制プロセスを置き換えることを意図していません。代わりに、スマートコントラクトで利用可能でありながら、それらのシステムをミラーリングまたは参照できる、規制に依存しない準備金会計インターフェースを定義します。

#### 仕様

核となるアイデアは以下の通りです。

- `reserveId` は物理的な準備金またはカストディ/在庫エントリを識別します。
- `assetId` は物理的な資産タイプを識別します。
- 各準備金は共通の会計ビューを公開します: 総量、利用可能量、消費量、および状態。
- 準備金の状態には `PENDING` (保留中)、`ACTIVE` (アクティブ)、`SUSPENDED` (停止中)、`CONSUMED` (消費済み)、`CANCELLED` (キャンセル済み) が含まれます。
- 準備金の数量は、[[glossary/reserve-backed-token|準備金裏付けERC-20トークン]]などの商品に割り当てることができますが、トークンが既にミントされていることを意味するものではありません。
- 割り当て、解放、消費は個別の会計アクションとして表現されます。
- オプションの拡張機能は、保証記録、メタデータ/文書参照、およびERC-721準備金受領マッピングをサポートします。

主な想定されるユースケースは、[[glossary/reserve-backed-token|準備金裏付けファンジブルトークン]]の発行です。この場合、後のERC-20拡張またはトークンコントラクトは、その未発行供給量が当該トークンコントラクトに割り当てられた準備金の数量を超えないように強制することができます。

この提案は意図的に完全なトークン化ワークフローではありません。準備金がどのように預けられ、監査され、法的に保有され、償還され、または規制されるべきかを定義しません。これらのプロセスは実装固有のものです。この提案は、観測可能な準備金レジストリと割り当てレイヤーのみを標準化します。

#### レビューのための質問

特に以下の点についてフィードバックをいただけると幸いです。

1. 準備金レジストリ、トークン発行、および資産償還の間の分離が明確であるか。
2. オプションの拡張機能はオプションのままであるべきか、それともすべての準拠レジストリに必須とすべきか。
3. 準備金の状態モデル（`PENDING`、`ACTIVE`、`SUSPENDED`、`CONSUMED`、`CANCELLED`）が適切であるか。

#### ステータス

- 正式な[[glossary/ERC|ERC]]ドラフト: [EIP-Physical-Reserve-Registry/erc-physical-reserve-registry.md at main · 0xAsef/EIP-Physical-Reserve-Registry · GitHub](https://github.com/0xAsef/EIP-Physical-Reserve-Registry/blob/main/erc-physical-reserve-registry.md)
- 最小限の参照実装: [EIP-Physical-Reserve-Registry/physical-reserve-registry-ref at main · 0xAsef/EIP-Physical-Reserve-Registry · GitHub](https://github.com/0xAsef/EIP-Physical-Reserve-Registry/tree/main/physical-reserve-registry-ref)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8332-physical-reserve-registry/28964)
