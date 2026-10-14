---
title: イーサリアムブロックにおける優先手数料、ポジション、トランザクション分類の測定：2025年7月から2026年10月
original_title: >-
  Measuring priority fees, positions and transaction classification of Ethereum
  blocks, July 2025 to October 2026
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/measuring-priority-fees-positions-and-transaction-classification-of-ethereum-blocks-july-2025-to-october-2026/26156
author: DanGuo
date: '2026-10-14'
category: Execution Layer Research
tags:
  - execution-layer
  - fee-market
  - mev
  - block-building
  - research
  - data-analysis
  - transaction-classification
topic_id: '26156'
translated_at: '2026-10-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Measuring priority fees, positions and transaction classification of Ethereum blocks, July 2025 to October 2026](https://ethresear.ch/t/measuring-priority-fees-positions-and-transaction-classification-of-ethereum-blocks-july-2025-to-october-2026/26156) — DanGuo (2026-10-14)

# *2026年10月13日*

## 動機

私はイーサリアムL1のブロック内における価格設定ポジションについて研究しています。主に[[glossary/PBS|PBS（プロポーザー・ビルダー分離）]]を介した[[glossary/MEV|MEV（最大抽出可能価値）]]ブーストによるプロトコル外の設計（[[glossary/EIP|EIP（Ethereum 改善提案）]]-1559に基づくプロトコル内の設計とは対照的）が中心です。このような設計には、現在のブロックの先頭がどれだけ支払っているか、どのような種類の[[glossary/transaction|トランザクション]]が存在し、どのように支払っているかを知る必要があります。

## 要約

このデータは、2025年7月1日、2026年7月1日、2026年8月1日から7日、2026年10月3日から9日の16日間にわたる約115,000ブロックをサンプリングしたものです。これは、私が作成したオープンソースのRustツールであるTEMBRIを公開のXatuデータで実行して得られた[[glossary/execution-layer|実行データ]]のみです。

-   ブロックガス使用量の最初の10%に位置するスワップは、毎日、30%から60%に位置するスワップと比較して、平均で8倍から16倍の[[glossary/priority-fee|優先手数料]]を支払っています。この手数料の大部分は20%に達する前に低下します。手数料水準は2025年から2026年にかけて約4分の3に減少しましたが、比率は変わりませんでした。
-   8月上旬には、ガス使用量の最初の5%に位置するスワップの約半分が優先手数料を支払っていませんでした。10月上旬には約10分の1でした。
-   Titanは、ブロックシェアがほぼ変わらないにもかかわらず、先頭のゼロチップトランザクションの減少の多くを占めています。
-   優先手数料を支払うスワップは、両月ともに、全体と比較して先頭で約2倍頻繁に発生しています。
-   [[glossary/Block-Building|ビルダー]]のラベルは、優先手数料とポジションの相関関係に永続的な違いを示しています。

## 測定ツール: TEMBRI

TEMBRI (Transaction, Ethereum, [[glossary/Mempool|メムプール (Mempool)]], Block and Relay Intelligence) は、[[glossary/Mempool|メムプール (Mempool)]]から[[glossary/block|ブロック]]への[[glossary/transaction|トランザクション]]の流れを追跡します。現在のリリースでは、Xatuの[[glossary/execution-layer|実行データ]]を読み込み、以下の日次テーブルを生成します。[[glossary/Mempool|メムプール (Mempool)]]、リレー、直接支払いデータは現在開発中です。

コード: [GitHub - TLM-Research/tembri: Rust toolbox for reproducible Ethereum execution and mempool measurement. · GitHub](https://github.com/TLM-Research/tembri) (Apache-2.0)、コミット `e4edc13`。10月の実行は `config/weekly_execution_reports.toml` で設定されています。

## データと方法

-   **ソース:** Xatuの規範的な[[glossary/execution-layer|実行]]Parquet (ethpandaops): [[glossary/block|ブロック]]、[[glossary/transaction|トランザクション]]、およびログ。日付は完全なUTC日付です。コホートあたりの[[glossary/block|ブロック]]数: 7,118 (2025年7月1日)、7,167 (2026年7月1日)、50,239 (8月週)、50,219 (10月週)。
-   **ポジション:** [[glossary/transaction|トランザクション]]を含め、それまでに使用されたガスを[[glossary/block|ブロック]]の総使用ガスで割ったもの。これにより、[[glossary/transaction|トランザクション]]が終了する位置で配置されます。
-   **ポジションバンド（排他的）:** ガス使用量の最初の10%、10%から20%、20%から30%、30%から60%。バンドの手数料は、その[[glossary/transaction|トランザクション]]の単純平均です。
-   **[[glossary/priority-fee|優先手数料]]:** タイプ2以降の[[glossary/transaction|トランザクション]]の場合 `min(max priority fee, max fee - base fee)`。レガシーな[[glossary/transaction|トランザクション]]の場合 `gas price - base fee` で、ゼロに切り下げられます。ゼロチップは1ガスあたり0 weiを意味します。
-   **タイプ:** スワップは、1つのプールからのUniswap V2またはV3スワップイベントを持つものです。マルチプールスワップは、2つ以上のプールからのスワップイベントを持つもので、ルーティングされたスワップと[[glossary/atomic-arbitrage-transaction|アトミック裁定取引]]の両方を含みます。
-   **[[glossary/Block-Building|ビルダー]]:** [[glossary/block|ブロック]]のextraData文字列で、自己申告です。「[[glossary/locally-built-blocks|ローカル構築ブロック]]」とは、[[glossary/Execution-Client|実行クライアント]]のバージョンを示していることを意味します。
-   **週ごとの列:** 7日間の日次値の中央値（比率は日ごとに計算）、括弧内に範囲を示します。

## 1. ブロックの先頭は優先手数料をより多く支払う

ポジションバンド別の平均スワップ[[glossary/priority-fee|優先手数料]] (gwei):

| | 2025-07-01 | 2026-07-01 | 2026年8月週 | 2026年10月週 |
| --- | --- | --- | --- | --- |
| ガス使用量の最初の10% | 15.42 | 4.46 | 3.85 (2.48から4.65) | 4.79 (2.17から6.94) |
| 10%から20% | 5.03 | 1.46 | 1.03 (0.79から1.15) | 1.55 (0.82から2.27) |
| 20%から30% | 2.85 | 0.75 | 0.55 (0.46から0.75) | 0.91 (0.45から1.28) |
| 30%から60% | 1.40 | 0.40 | 0.31 (0.29から0.53) | 0.54 (0.28から0.70) |
| 比率、最初の10% / 30%から60% | 11.0 | 11.1 | 8.7 (7.9から16.0) | 9.1 (7.8から12.0) |

同じ比率は、マルチプールスワップで4.5から13.9、[[glossary/Tokenized-investment-funds|トークン転送]]で約3です。ゼロチップ[[glossary/transaction|トランザクション]]も先頭に到達するため（セクション3）、[[glossary/priority-fee|優先手数料]]だけでは、ブロック先頭配置に対するすべての支払いを捉えることはできません。

## 2. 先頭のトランザクションタイプ

ガス使用量の最初の5%における[[glossary/transaction|トランザクション]]数のタイプ別シェアを、全[[glossary/transaction|トランザクション]]数のタイプ別シェアで割ったもの（両方とも数による）：

| | 2025-07-01 | 2026-07-01 | 2026年8月週 | 2026年10月週 |
| --- | --- | --- | --- | --- |
| スワップ | 3.1 | 3.5 | 3.6 (1.8から4.2) | 2.0 (1.4から2.2) |
| スワップ、正の手数料 | 3.1 | 2.5 | 2.2 (1.2から2.5) | 2.0 (1.3から2.1) |
| スワップ、ゼロ手数料 | 4.2 | 8.9 | 9.5 (4.9から12.4) | 2.9 (1.7から3.6) |
| マルチプールスワップ | 3.0 | 3.2 | 2.6 (1.8から3.4) | 2.5 (1.9から2.8) |
| トークン転送 | 0.6 | 1.2 | 1.7 (1.2から2.2) | 1.1 (1.1から1.2) |
| ネイティブ転送 | 0.6 | 0.5 | 0.5 (0.4から0.8) | 0.8 (0.7から0.9) |

**[[glossary/priority-fee|優先手数料]]を支払うスワップは、両月ともに約2倍過剰に表現されています。** スワップ比率の低下は、ゼロチップスワップに起因します。[[glossary/Tokenized-investment-funds|トークン転送]]は、2025年には5%のガス使用量で完了する[[glossary/transaction|トランザクション]]の5分の1でしたが、2026年には毎日半分を占めています。

## 3. 先頭のゼロチップトランザクション

[[glossary/priority-fee|優先手数料]]がゼロの[[glossary/transaction|トランザクション]]のシェア:

| | 2025-07-01 | 2026-07-01 | 2026年8月週 | 2026年10月週 |
| --- | --- | --- | --- | --- |
| スワップ、すべて | 5.3% | 16.7% | 17.5% (15.7%から19.2%) | 8.3% (7.7%から9.5%) |
| スワップ、最初の5% | 7.2% | 42.0% | 48.5% (41.5%から53.0%) | 11.6% (9.6%から15.9%) |
| マルチプールスワップ、すべて | 9.6% | 14.5% | 12.9% (10.8%から16.0%) | 8.4% (6.9%から13.0%) |
| マルチプールスワップ、最初の5% | 28.0% | 19.0% | 17.4% (15.5%から20.1%) | 6.1% (4.3%から10.7%) |
| トークン転送、最初の5% | 2.9% | 15.2% | 7.7% (4.4%から8.6%) | 11.0% (8.4%から13.6%) |

先頭のゼロチップ[[glossary/transaction|トランザクション]]は、[[glossary/Block-Building|ビルダー]]への直接転送、またはその[[glossary/Bundle|バンドル]]内の他の[[glossary/transaction|トランザクション]]によって支払われるか、[[glossary/Block-Building|ビルダー]]自身の、または排他的なフローである可能性があります。[[glossary/execution-layer|実行データ]]ではこれらを区別できません。

8月から10月にかけて、最初の5%のゼロチップスワップは約34,700から7,300に減少し、すべてのタイプのゼロチップ[[glossary/transaction|トランザクション]]は1ブロックあたり1.41から0.91に減少しました。[[glossary/Block-Building|ビルダー]]別、全タイプ（期間あたり約52,000ブロック）：

| [[glossary/Block-Building|ビルダー]] | ブロックシェア | ブロックあたりの先頭ゼロチップ[[glossary/transaction|トランザクション]]数 | 全先頭ゼロチップ[[glossary/transaction|トランザクション]]に占める割合 | 自身のゼロチップ[[glossary/transaction|トランザクション]]が先頭に配置される割合 |
| --- | --- | --- | --- | --- |
| Titan | 47.0% / 47.9% | 2.12 / 1.06 | 71% / 56% | 24.5% / 18.4% |
| Quasar | 20.0% / 19.5% | 1.52 / 1.26 | 22% / 27% | 14.6% / 9.5% |
| BuilderNet | 11.8% / 14.8% | 0.32 / 0.59 | 3% / 10% | 6.0% / 9.1% |
| Eureka | 8.6% / 4.4% | 0.44 / 0.44 | 3% / 2% | 5.3% / 3.6% |
| bombora | 1.3% / 3.0% | 1.24 / 0.97 | 1% / 3% | 10.4% / 2.3% |
| [[glossary/locally-built-blocks|ローカル構築ブロック]] | 約8% | 0 / 0 | 0 / 0 | 0 / 0 |

各セルは8月/10月です。「先頭」はガス使用量の最初の5%を指します。

**Titanは、ブロックシェアがほぼ変わらないにもかかわらず、ブロックあたりのゼロチップ先頭[[glossary/transaction|トランザクション]]を半減させました。** 各[[glossary/Block-Building|ビルダー]]内でのタイプ別内訳はまだ測定されていません。10月には、bomboraの[[glossary/transaction|トランザクション]]の16.8%が[[glossary/priority-fee|優先手数料]]を支払っていませんが、そのうち先頭に位置するのはわずか2%です。

## 4. ビルダーの順序付け

ブロックシェアと、[[glossary/priority-fee|優先手数料]]とポジションのブロック内ピアソン相関係数の平均:

| [[glossary/Block-Building|ビルダー]] | 2025-07-01 | 2026-07-01 | 2026年8月週 | 2026年10月週 |
| --- | --- | --- | --- | --- |
| Titan | 40.7%, -0.37 | 51.8%, -0.45 | 47.3%, -0.31 (-0.46から-0.29) | 47.9%, -0.38 (-0.46から-0.32) |
| Quasar | 4.7%, -0.44 | 16.5%, -0.56 | 20.0%, -0.54 (-0.56から-0.53) | 19.6%, -0.51 (-0.57から-0.48) |
| BuilderNet | 32.8%, -0.49 | 11.6%, -0.47 | 12.4%, -0.47 (-0.48から-0.45) | 14.9%, -0.44 (-0.49から-0.41) |
| Eureka | | 8.8%, -0.19 | 7.4%, -0.24 (-0.28から-0.22) | 3.9%, -0.15 (-0.17から-0.14) |
| bombora | | 1.5%, -0.56 | 1.2%, -0.58 (-0.61から-0.56) | 2.9%, -0.54 (-0.57から-0.53) |
| [[glossary/locally-built-blocks|ローカル構築ブロック]] | 約6%, -0.70 | 7.4%, -0.66 | 8.4%, -0.65 (-0.67から-0.60) | 8.3%, -0.73 (-0.75から-0.71) |

[[glossary/locally-built-blocks|ローカル構築ブロック]]は最も負の相関を示しており、これは手数料順序付けと一致しますが、そのソースやルールは示していません。相関は[[glossary/transaction|トランザクション]]タイプ、ガス、[[glossary/Bundle|バンドル]]、[[glossary/Async-nonce|非同期Nonce (Async nonce)]]順序も反映しています。各[[glossary/Block-Building|ビルダー]]の値は2週間を通じて持続しますが、Titanが最も大きく動き、-0.31から-0.38になりました。

## 5. 低チップのネイティブ転送が減少

ネイティブ転送は、8月週には1日あたり約140万件（平均[[glossary/priority-fee|優先手数料]]0.22 gwei）から、10月週には約50万件（0.80 gwei）に減少し、2025年の水準に戻りました。総[[glossary/transaction|トランザクション]]数は1日あたり約70万件（1ブロックあたり345から247）しか減少しませんでしたが、他のタイプは約20万件増加しました。この原因は[[glossary/execution-layer|実行データ]]からは分かりません。

## 制限事項

-   スワップはUniswap V2およびV3でのみ検出されます。
-   [[glossary/Public-mempool-gas-sponsorship|パブリックフロー]]と[[glossary/Private-order-flow|プライベートフロー]]はまだ分離されていません。
-   [[glossary/fee-market|手数料受取人]]への直接支払いはまだ測定されていません。これらの日についてはXatuのトレースパーティションは空です。
-   16日間をサンプリングしたもので、連続的な実行はまだありません。
-   10月のブロックの約2%には[[glossary/Block-Building|ビルダー]]ラベルがありません。

## 次のステップ

-   Xatuの[[glossary/Mempool|メムプール (Mempool)]]データとMempool Dumpsterを使用して、[[glossary/Public-mempool-gas-sponsorship|パブリックフロー]]と[[glossary/Private-order-flow|プライベートフロー]]を分離し、[[glossary/locally-built-blocks|ローカル構築ブロック]]で校正します。
-   [[glossary/fee-market|手数料受取人]]の残高変更から、ブロックあたりの直接支払いを測定します。
-   [[glossary/Block-Building|ビルダー]]とタイプ別のゼロチップ先頭[[glossary/transaction|トランザクション]]：Titanのどのフローが減少したか。
-   高ボラティリティの日を含む30日間の実行。
-   Uniswap V4、Curve、Balancer、および主要なアグリゲーター。[[glossary/atomic-arbitrage-transaction|裁定取引]]とルーティングされたスワップを分離するための[[glossary/Tokenized-investment-funds|トークンフロー]]。

コメント、修正、関連する測定への指摘を歓迎します: [danguo01@gmail.com](mailto:danguo01@gmail.com)。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/measuring-priority-fees-positions-and-transaction-classification-of-ethereum-blocks-july-2025-to-october-2026/26156)
