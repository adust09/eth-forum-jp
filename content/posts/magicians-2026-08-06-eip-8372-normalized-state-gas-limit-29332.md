---
title: 'EIP-8372: 正規化されたステートガス制限'
original_title: 'EIP-8372: Normalized state gas limit'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8372-normalized-state-gas-limit/29332'
author: aelowsson
date: '2026-08-06'
category: EIPs core
tags:
  - eips-core
  - eip
  - gas
  - state-management
  - economics
  - protocol-design
topic_id: '29332'
translated_at: '2026-08-07'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8372: Normalized state gas limit](https://ethereum-magicians.org/t/eip-8372-normalized-state-gas-limit/29332) — aelowsson (2026-08-06)

[[glossary/EIP|EIP]]-8372 の議論トピックです。[PR](https://github.com/ethereum/EIPs/pull/12119)はこちら。

#### 説明

ステートガス (state gas) と実行ガス (execution gas) の利用率のバランスを取るため、ステートガス制限をスケーリングし正規化します。

#### これが役立つ場合

この提案は、[[glossary/EIP|EIP]]-8037 が有効化された後の観測で、その固定された `[[glossary/CPSB|CPSB（ステートバイトあたりのコスト）]]` がステートガスと実行ガスのバランスの取れた需要を生み出さないことが示された場合に有用です。ステート需要が予想よりも低く、目標よりも少ないステート作成に終わるか、あるいは予想よりも高く、ステートガスが共通のベース手数料を設定し、実行ガスの消費を抑制する可能性があります。この[[glossary/EIP|EIP]]は最小限の[[glossary/hardfork|ハードフォーク (hardfork)]]キャリブレーションを提供します。`[[glossary/CPSB|CPSB（ステートバイトあたりのコスト）]]`を調整し、生のステートガス制限を比例的にスケーリングし、ブロックレベルの集約前にステートガスを正規化します。これは、イーサリアムが[[glossary/EIP|EIP]]-7999 の長期的な[[glossary/multidimensional-fee-market|多次元手数料市場 (multidimensional fee market)]]へと移行する間における、[[glossary/EIP|EIP]]-8075 の手動版と見なすことができます。

#### 関連リソース

-   [EIP-8037における障害モードとステートガススケーリング](https://ethresear.ch/t/failure-modes-in-eip-8037-and-state-gas-scaling/23975) — 2つの考えられる需要不均衡の障害モードとステートガス正規化ソリューションについて概説しています。
-   [ステート成長シナリオと再価格設定の影響](https://ethresear.ch/t/state-growth-scenarios-and-the-impact-of-repricings/23476) — ステート需要の弾力性と[[glossary/repricing|再価格設定 (repricing)]]に関する背景情報を提供しています。
-   [[glossary/EIP|EIP]]-8075 — この一度限りのキャリブレーションに対する動的な対応策。そして[[glossary/EIP|EIP]]-7999 — 長期的な多次元手数料市場の方向性。

### 要約

この[[glossary/EIP|EIP]]は、ステートガスにスケーリングされた生の制限を割り当て、ブロックレベルの`gas_used`を計算する前にステートガス使用量を正規化することで、[[glossary/EIP|EIP]]-8037 を修正します。有効化時、`[[glossary/CPSB|CPSB（ステートバイトあたりのコスト）]]`と制限スケールは、ステートバイト価格が推定需要を反映できるように設定され、選択されたステート成長目標は引き続き50%の正規化されたステートガス利用率に対応します。新しいトランザクションフィールドやブロックヘッダーフィールドは導入されません。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8372-normalized-state-gas-limit/29332)
