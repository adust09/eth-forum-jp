---
title: 'ERC-8475: ERC-20 送金ウィンドウ制限'
original_title: 'ERC-8475: ERC-20 Outgoing Window Limits'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8475-erc-20-outgoing-window-limits/30178'
author: shargon
date: '2026-11-02'
category: ERCs
tags:
  - ercs
  - tokenomics
  - security
  - protocol-design
  - applications
  - spending-limits
  - erc
topic_id: '30178'
translated_at: '2026-11-03'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8475: ERC-20 Outgoing Window Limits](https://ethereum-magicians.org/t/erc-8475-erc-20-outgoing-window-limits/30178) — shargon (2026-11-02)

[[glossary/ERC|ERC-8475]]は、[[glossary/ERC|ERC-20]]のオプトイン拡張であり、1回あたりの転送上限と、固定ブロックウィンドウあたりの総送金上限を組み合わせたものです。これについてフィードバックを募集します。

提案と仕様: [Add ERC: ERC-20 Outgoing Window Limits by shargon · Pull Request #2130 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/2130)

## 動機

侵害された署名または出金ワークフローは、多額の流出を複数のトランザクションや受取人に分散させることができます。1回あたりの転送上限だけでは、その総額を制限することはできません。この提案は、各残高保有者に対して、トークン側の共有会計 (accounting) と発見可能なポリシーを定義します。

## 提案される挙動

-   保有者は、1回あたりの最大転送額、ウィンドウあたりの最大総額、ブロック単位のウィンドウ長、上限変更遅延 (cap-change delay)、および独立した[[glossary/guardian|ガーディアン]]を登録します。
-   エポックは `floor(block.number / windowBlocks)` で計算されます。すべての正の送金は、1回あたりの転送上限と残りの総割当量（クォータ）の両方を満たす必要があります。
-   `transferFrom`、バーン (burns)、自己送金 (self-transfers)、署名承認済み支出 (signature-authorized spending) を含むすべてのデビットパスは、保有者のカウンターを共有します。入金はクォータを補充しません。
-   保有者または[[glossary/guardian|ガーディアン]]は、上限を即座に厳しくしたり、保留中の変更をキャンセルしたりできます。保有者のみが代替上限をスケジュールでき、これは不変の遅延期間後に適用可能になります。
-   ポリシー変更の適用またはキャンセルは、使用量をリセットしません。登録、[[glossary/guardian|ガーディアン]]、ウィンドウ長、変更遅延は不変です。
-   この提案は、特定のインプリメンテーションではなく、インターフェース、イベント、会計セマンティクス (semantics) を標準化します。

## トレードオフとフィードバック募集

これらは固定ウィンドウ (fixed windows) であり、ローリングウィンドウ (rolling windows) ではありません。境界の直前と直後に全クォータを消費することが可能です。保証はトークンと保有者ごとであり、法定通貨価値 (fiat-value) や取引所全体の制限ではありません。[[glossary/guardian|ガーディアン]]は上限をゼロにすることでサービスを拒否できます。また、トークンアップグレード (token upgrades) や保護されていないデビットパス (unprotected debit paths) は保護を損なう可能性があります。

特に、固定ウィンドウの相互運用性 (interoperability)、総送金会計、上限変更セマンティクス、不変設定 (immutable configuration)、ウォレット/カストディアン統合 (wallet/custodian integration) に関するフィードバックを歓迎します。

この提案は、補完的な[[glossary/ERC-8474|ERC-8474 (遅延アンロック提案)]]とは独立しています。トークンは両方のポリシーを実装できます。

著者: Fernando Díaz Toledano ([@shargon](https://ethereum-magicians.org/u/shargon)).

*3件の投稿 - 3名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8475-erc-20-outgoing-window-limits/30178)
