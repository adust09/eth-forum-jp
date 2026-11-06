---
title: 'Walraswap: 外部AMM流動性を統合する均衡ベースの分散型取引所'
original_title: >-
  Walraswap: equilibrium-based decentralized exchange integrating external AMM
  liquidity
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/walraswap-equilibrium-based-decentralized-exchange-integrating-external-amm-liquidity/26219
author: sergioyuhjtman
date: '2026-11-05'
category: Decentralized exchanges
tags:
  - decentralized-exchanges
  - defi
  - economics
  - mev
  - mechanism-design
  - protocol-design
  - smart-contracts
  - dex
  - batch-trading
topic_id: '26219'
translated_at: '2026-11-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Walraswap: equilibrium-based decentralized exchange integrating external AMM liquidity](https://ethresear.ch/t/walraswap-equilibrium-based-decentralized-exchange-integrating-external-amm-liquidity/26219) — sergioyuhjtman (2026-11-05)

[![ストリートアート](https://ethresear.ch/uploads/default/optimized/3X/5/f/5fac40b65829e84111ed682e85bdbd01bf4fc204_2_690x413.jpeg)](https://ethresear.ch/uploads/default/original/3X/5/f/5fac40b65829e84111ed682e85bdbd01bf4fc204.jpeg "ストリートアート")

# Walraswap: 外部AMM流動性を統合する均衡ベースの分散型取引所

これは、[同名の研究論文](https://arxiv.org/abs/2310.12255)の発表と、ethresear.ch向けの簡単な非公式な紹介です。

イーサリアム上の分散型取引所 (DEX) における[[glossary/MEV|MEV（最大抽出可能価値）]]に対処する古典的なアプローチは、ブロック間隔中に取引注文を受け取り、公平性基準に従ってすべてのスワップを[[glossary/batch-trading|バッチ取引]]で決済するメカニズムを有効にすることです。

これは古くからの問題です。情報に通じた読者であれば、多少懐疑的に感じるかもしれません。このような考えは、2014年にこの[Reddit投稿](https://www.reddit.com/r/ethereum/comments/2d84yv/miners_frontrunning/)で表明されています。

CoW Swap、UniswapX、1inchのFusion、SorellaのAngstrom、PropellerheadsのTurbineはすべて、何らかの形でバッチ取引を利用してこの問題に取り組んできました。

Walraswapは2023年にFlashbotsで開始されました。これは、Ramseyer、Goyal、Goel、Mazièresによる先行する密接に関連する研究である[Augmenting Batch Exchanges…](https://arxiv.org/abs/2210.04929)および[SPEEDEX](https://arxiv.org/abs/2111.02719)とは独立しています。共通の主要な特徴は、DEXの問題を*n*個のトークンを持つ交換経済の[[glossary/equilibrium|均衡]]理論の観点から扱っている点です。*均衡*を2文で説明すると、有限の取引注文の集合が与えられたとき、穏やかな仮説の下で取引コストを無視すれば、すべての注文がどのトークンも不足なく、また余剰なく実行できるような価格ベクトル（すなわち*均衡*）が存在します。一部の注文は均衡において何も取引しないかもしれません。

### Walraswapの特別な点

まず、上記のイーサリアムDEXのどれも均衡に基づいていないことに注意してください。長年にわたり、類似しているもののより弱い特性である[[glossary/Uniform-clearing-price|均一清算価格]]を採用してきたCoW Swapでさえもです。この違いは次のように視覚化できます。

*均衡 = 均一清算価格 + 利用可能なすべての取引注文の包含*

2番目の条件は、ブロックチェーンシステムにとって厄介です。バッチを提出する責任を負ういかなるエンティティも、結果を操作し、潜在的に利益を得るために、一部の注文を検閲する能力を常に持ちます。Walraswapは、この時点で諦めなかった結果です。この困難はガバナンスを通じて対処できます。すなわち、ソルバーを選出する[[glossary/DAO|DAO（分散型自律組織）]]を導入します。ソルバーが与えることができる唯一の損害が、一部の注文を検閲してMEVを抽出することであるようなスマートコントラクトメカニズムを構築します。ソルバーがそのような行為をした場合に容易に検出できるように、メカニズムを十分に透明にします。これにより、非正統的な選択である公開オーダーフローが導かれます。繰り返しゲーム設定は、[[glossary/Block-Builder|ブロックビルダー]]が即座の利益のためにサーチャーのバンドルをアンバンドルしないのと同様に、ソルバーが検閲しないようにインセンティブを与えます。どちらの場合も、問題の行為者は不正行為によってその立場を危うくすることになります。提案されたメカニズムの詳細については、論文のセクション8を参照してください。

### 定理と数学的フレームワーク

この論文は、[[glossary/supply-function|供給関数]]の概念に基づいた数学的フレームワークを開発し、(大まかに言えば) 存在、一意性、計算に関するいくつかの結果を含んでいます。

主要な定理（セクション6）は、取引注文と外部[[glossary/AMM|AMM（自動マーケットメイカー）]]を扱います。（Walraswapは内部AMMを持つべきですが、これらは通常の取引注文として表現できます。）これは、各トークンに非負の余剰を残すように、取引注文に適した清算価格ベクトルと、適切な外部スワップを見つけるための解決策を規定しています。外部スワップは、バッチの清算価格ではなく、AMM自身の価格設定ルールに従って実行されます。この解決策は、指定された集約供給関数の均衡として表現されます。セクション8では、この特定の解決策がWalraswapに適用可能であると私が期待する理由を説明しています。

この解決策の計算（セクション7）は、[[glossary/convex-optimization|凸最適化]]の問題として記述できます。この定式化は、効率的な計算が実現可能であることを示唆しています。また、[SPEEDEX](https://arxiv.org/abs/2111.02719)の付録Fも参照してください。これに関連して、セクション8ではトークンのグラフに関する微妙な議論があります。

単調性条件を満たす供給関数については、均衡ベクトルの集合は凸です。その構造はセクション4でさらに明確にされています。さらに、均衡における純取引は実際には一意であることが示されています。

#### フィードバックを大変歓迎します！

コメントでご意見をお聞かせください。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/walraswap-equilibrium-based-decentralized-exchange-integrating-external-amm-liquidity/26219)
