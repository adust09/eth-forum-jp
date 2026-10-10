---
title: イーサリアムのPropAMM：現在と未来
original_title: 'Ethereum PropAMMs: today and tomorrow'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/ethereum-propamms-today-and-tomorrow/26129'
author: mikeneuder
date: '2026-10-07'
category: Execution Layer Research
tags:
  - execution-layer
  - proprietary-amm
  - mev
  - block-building
  - defi
  - scaling
  - research
  - protocol-design
topic_id: '26129'
translated_at: '2026-10-10'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Ethereum PropAMMs: today and tomorrow](https://ethresear.ch/t/ethereum-propamms-today-and-tomorrow/26129) — mikeneuder (2026-10-07)

# イーサリアムのPropAMM：現在と未来

![イーサリアムのPropAMM：現在と未来](https://ethresear.ch/uploads/default/optimized/3X/9/e/9ed796bf1a119941a07968f9903238f4ea5a8518_2_450x450.jpeg)

\\cdot
*Mike ([@mikeneuder](https://twitter.com/mikeneuder)) と Maryam ([@bahrani_maryam](https://x.com/bahrani_maryam)) 著* – 2026年10月7日。
\\cdot
この記事の執筆を促し、前回の記事で見落としていたニュアンスを強調し、レビューしてくれたGeorge ([@gd_gattaca](https://x.com/gd_gattaca)) に特に感謝します。誤りはすべて私たち自身のものです。
\\cdot
**関連リンク**

| 説明 | |
| --- | --- |
| TitanのPropAMMテイカーインターフェース | [link](https://docs.titanbuilder.xyz/propamms/takers) |
| TitanのPropAMMメイカーインターフェース | [link](https://docs.titanbuilder.xyz/propamms/makers) |
| BlockworksのSolana DEX勝者記事 | [link](https://app.blockworks.com/report/solana-dex-winners-all-about-order-flow?from=messari) |
| 私たちの最初のPropAMM記事 | [link](https://ethresear.ch/t/proprietary-amms-and-ethereum/25543) |

\\cdot
**関連用語**

| 用語 | 定義 |
| --- | --- |
| Take (テイカー取引) | [[glossary/Proprietary-AMM|PropAMM]]の流動性に対して取引を行うトランザクション。これは、通常のユーザーまたは洗練された裁定者からの「スワップ」または「取引」と考えることができます。 |
| Update (更新) | マーケットメイカーからの、PropAMMコントラクトの状態を変更するトランザクション（例：中間価格の変更）。これらは「オラクル更新」または「クォート」と呼ばれることもあります。 |

\\cdot

### 動機: イーサリアムにおける現在のPropAMM取引量

[[glossary/Proprietary-AMM|PropAMM]]は、その誕生から数ヶ月で着実に成長し、現在ではイーサリアムの[[glossary/mainnet|メインネット]]におけるスワップ取引量の約5〜10%を占めています。参考として、以下の表にはUniswap（[defillama](https://defillama.com/dexs/chain/ethereum?chartView=Breakdown&groupBy=weekly)のデータ）と、イーサリアムで最大の2つのPropAMM（[pamm.wtf](https://pamm.wtf/volume)のデータ）の取引量が含まれています。

| カテゴリ | 取引所 | 2026年9月14日〜20日 |
| --- | --- | --- |
| [[glossary/DEX|DEX]] | Uniswap | 60億米ドル |
| [[glossary/Proprietary-AMM|PropAMM]] | Fermi | 2億8017万米ドル |
| [[glossary/Proprietary-AMM|PropAMM]] | Metric | 1億7789万米ドル |

これはすでにオンチェーン取引量のかなりの部分を占めていますが、Solanaと比較すると、イーサリアムにおける[[glossary/Proprietary-AMM|PropAMM]]取引量の相対的なシェアは今後も増加する可能性があります。以下の表は、比較のためにSolanaで最大の4つの[[glossary/DEX|DEX]]と3つの[[glossary/Proprietary-AMM|PropAMM]]の取引量（[defillama](https://defillama.com/dex-aggregators/chain/solana)のデータ）を示しています。

| カテゴリ | 取引所 | 2026年9月14日〜20日 |
| --- | --- | --- |
| [[glossary/DEX|DEX]] | Pump | 33億米ドル |
| [[glossary/DEX|DEX]] | Raydium | 22億米ドル |
| [[glossary/DEX|DEX]] | Meteora | 14億米ドル |
| [[glossary/DEX|DEX]] | Orca | 16億米ドル |
| [[glossary/Proprietary-AMM|PropAMM]] | BisonFi | 28億米ドル |
| [[glossary/Proprietary-AMM|PropAMM]] | HumidiFi | 18億米ドル |
| [[glossary/Proprietary-AMM|PropAMM]] | Tessera V | 10億米ドル |
| [[glossary/DEX|DEX]]合計取引量 | | 85億米ドル |
| [[glossary/Proprietary-AMM|PropAMM]]合計取引量 | | 56億米ドル |

Solanaの主要取引所の合計取引量の約40%を[[glossary/Proprietary-AMM|PropAMM]]が占めていることがわかります。

私たちの[以前の記事](https://ethresear.ch/t/proprietary-amms-and-ethereum/25543)では、[[glossary/Proprietary-AMM|PropAMM]]を他の取引フローの言葉で
