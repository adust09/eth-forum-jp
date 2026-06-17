---
title: イーサリアムとArbitrumにおけるガス需要の価格弾力性
original_title: Price Elasticity of Gas Demand on Ethereum and Arbitrum
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/price-elasticity-of-gas-demand-on-ethereum-and-arbitrum/25211
author: kakia89
date: '2026-06-16'
category: Economics
tags:
  - economics
  - fee-market
  - scaling
  - research
  - layer2
  - evm
  - price-elasticity
  - gas-demand
topic_id: '25211'
translated_at: '2026-06-17'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Price Elasticity of Gas Demand on Ethereum and Arbitrum](https://ethresear.ch/t/price-elasticity-of-gas-demand-on-ethereum-and-arbitrum/25211) — kakia89 (2026-06-16)

視認性向上のため、こちらからクロス投稿しています: [イーサリアムとArbitrumにおけるガス需要の価格弾力性 - Arbitrum Research](https://research.arbitrum.io/t/price-elasticity-of-gas-demand-on-ethereum-and-arbitrum/9795)

## **問題**

イーサリアムのベースレイヤーとArbitrum One [[glossary/Rollup|ロールアップ]]において、ガス料金の変化がブロック空間の需要にどのように影響するかという問題を研究します。この問題は、ガス料金自体がEIP-1559のようなメカニズムを通じて集計されたブロック空間需要によって決定されるため、内生性 (endogeneity) を生み出し、単純ではありません。回帰分析のような素朴なアプローチでは、誤った結論につながります。例えば、1690万件のArbitrum観測データに対する単純なプール型OLS回帰では、+0.094という正の弾力性が得られましたが、これは負の需要反応という期待に反します。これは、より多くのデータでは克服できない構造的なバイアスです。価格弾力性の真の因果的推定を得るには、より慎重なアプローチが必要です。

## **方法論**

上記の問題に対処するため、3つのステップを組み合わせます。まず、ウォレットアドレスをオンチェーンアクティビティ、トランザクション頻度、リソース消費に基づいて6つの行動クラスターに分類します。これは、プールされた推定値がオラクル更新者、[[glossary/MEV|MEV（最大抽出可能価値）]]サーチャー、一般ユーザーなど、異なるタイプのウォレットを平均化してしまうため重要です。次に、ウォレットと固定時間間隔のペアを各データポイントとし、トランザクション数を制御変数として、双方向固定効果（ウォレットと時間）分析を使用します。第三に、ウォレット自身の遅延ベース料金を操作変数 (instrument variable) として使用し、混雑に起因する内生性から因果的な料金変動を分離します。

集計されたガスに加えて、Arbitrum上の7つのリソース次元（計算、ストレージの読み書き、ストレージの成長、calldata、履歴の成長、払い戻し）にも分析を拡張します。

## **調査結果**

両チェーンとも全体として非弾力的です。プールされた弾力性はイーサリアムで-0.006、Arbitrumで-0.036であり、これは料金が10%増加すると、総ガス需要がそれぞれ約0.06%と0.36%減少することを意味します。レイヤー2 (L2) は、ユーザーがより価格に敏感であること、および確率的バックランナーの存在により、より高い弾力性を示します。

プールされた弾力性推定値は、異質性 (heterogeneity) を隠蔽しています。クラスターレベルの弾力性は、プールされた推定値のほぼ6倍であることがわかりました。さらに、リソースレベルの分解は、弾力性においてさらに広いばらつきがあることを明らかにしています。この分析で得られた洞察は、価格メカニズム、オペコードの再価格設定 (opcode repricing)、使用パターンの説明などの疑問に答えるために使用できます。

詳細については、論文をご覧ください: [https://arxiv.org/pdf/2606.13555](https://arxiv.org/pdf/2606.13555)。フィードバックを歓迎します。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/price-elasticity-of-gas-demand-on-ethereum-and-arbitrum/25211)
