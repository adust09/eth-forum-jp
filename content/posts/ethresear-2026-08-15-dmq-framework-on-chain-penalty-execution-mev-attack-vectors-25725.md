---
title: 'DMQフレームワーク: オンチェーンペナルティ実行とMEV攻撃ベクトル'
original_title: 'DMQ Framework: On-Chain Penalty Execution & MEV Attack Vectors'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/dmq-framework-on-chain-penalty-execution-mev-attack-vectors/25725
author: chuseo090
date: '2026-08-15'
category: Economics
tags:
  - economics
  - mev
  - mechanism-design
  - smart-contracts
  - security
  - oracle
  - research
  - defi
topic_id: '25725'
translated_at: '2026-08-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [DMQ Framework: On-Chain Penalty Execution & MEV Attack Vectors](https://ethresear.ch/t/dmq-framework-on-chain-penalty-execution-mev-attack-vectors/25725) — chuseo090 (2026-08-15)

理論的なモデリングを超え、潜在的な実行の脆弱性に対処するため、DMQフレームワークをSepolia [[testnet|テストネット]]にデプロイし、経験的な実行データを収集しました。

**1. 実行証明: オンチェーンペナルティの強制**

DMQの核となる命題は、パニック状態が二次市場の流動性に依存することなく、プログラムによって劣後性を強制する必要があるというものです。以下のトランザクションは、この正確な機械的実行を示しています。

-   **状態遷移（パニックレベル3000のトリガー）:**

    `Tx Hash: 0xe0691600dfd119b9dc8d4878f1f57f2b105d2ff1e85d474618a5e1e59ec81420`

-   **ペナルティ実行（ヘアカット）:**

    `Tx Hash: 0x22563198f8946fc7d3125bdf66eca131d5205a4e74ba6eec678a88232704c959`

2番目のトランザクションで検証されたように、最大パニック状態での100ユニットの明示的な引き出しリクエストは、[[T0-settlement|T+0決済]]の流動性制約を回避しました。コントラクトは40%のペナルティ（40ユニットの焼却）を厳格に適用し、正確に60ユニットを返却しました。

**2. インタラクティブなPoCアーキテクチャ**

このシミュレーターを介して、フロントエンドからバックエンドまでのロジックをテストし、パニック状態を直接トリガーできます。

[https://codesandbox.io/p/sandbox/jovial-yalow-9xfx4q?file=%2Fsrc%2FApp.js](https://codesandbox.io/p/sandbox/jovial-yalow-9xfx4q?file=%2Fsrc%2FApp.js)

**3. MEVサーチャーとクオンツへの未解決の質問**

PoCは技術的には機能していますが、私はコミュニティからの批判を歓迎する2つの重要な攻撃ベクトルを分析しています。

-   **連続曲線 vs. ステップ関数:** 現在のPoCは、ペナルティティアに基本的な`if-else`ステップ関数を利用しています。これは明らかに[[MEV|MEV（最大抽出可能価値）]]攻撃面（例: 1499から1500への速度シフトの境界で引き出しを正確に[[Sandwich-attack|サンドイッチ攻撃]]する）を導入します。シグモイド関数 $P(v) = \frac{P\_{max}}{1 + e^{-k(v - v\_0)}}$ のような連続的なペナルティ曲線に移行することで、この抽出ベクトルは数学的に排除されるのでしょうか、それとも単に[[oracle|オラクル]]の遅延に[[MEV|MEV]]がシフトするだけでしょうか？

-   **速度オラクルの分散化:** `mockDepletionVelocity`は、[[trustless|トラストレスな]]オンチェーンメトリックに置き換える必要があります。準備金枯渇のTWAP（時間加重平均価格）に依存する場合、真のマクロパニック時にフラッシュローン操作に対してどの程度脆弱でしょうか？

研究者の皆さんにこのモデルを破ることを呼びかけます。数学はどこで破綻するでしょうか？

*1 post - 1 participant*

[Read full topic](https://ethresear.ch/t/dmq-framework-on-chain-penalty-execution-mev-attack-vectors/25725)
