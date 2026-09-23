---
title: ポスト・グラムステルダムの一次元手数料市場とEIP-7999との比較
original_title: Post-Glamsterdam One-dimensional Fee Market and Comparison with EIP-7999
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/post-glamsterdam-one-dimensional-fee-market-and-comparison-with-eip-7999/26062
author: M1kuW1ll
date: '2026-09-21'
category: Economics
tags:
  - economics
  - fee-market
  - protocol-design
  - eip
  - scaling
  - execution-layer
  - state-management
  - glamsterdam
  - eip-7999
topic_id: '26062'
translated_at: '2026-09-23'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Post-Glamsterdam One-dimensional Fee Market and Comparison with EIP-7999](https://ethresear.ch/t/post-glamsterdam-one-dimensional-fee-market-and-comparison-with-eip-7999/26062) — M1kuW1ll (2026-09-21)

*Fei Wu 著 - この研究は、EFでのインターンシップ中に一部実施されました。貴重な議論、フィードバック、コメントをくださったメンターの@misilva73氏に感謝いたします。*

## 概要

前回の分析では、[[glossary/EIP-7999|EIP-7999]]の様々な構成における[[glossary/Multidimensional-fee-market|多次元手数料市場]]を研究しました。すべてのリソースで共有される単一の[[glossary/base-fee|ベースフィー]]を持つ[[glossary/One-dimensional-fee-market|一次元メカニズム]]から、個別のリソース価格を持つ[[glossary/Multidimensional-fee-market|多次元メカニズム]]へ移行することが利益をもたらすかどうかはまだ不明確です。本稿では、3つの一次元ベンチマークの下で、[[glossary/Glamsterdam|グラムステルダム]]後の[[glossary/One-dimensional-fee-market|一次元手数料市場]]を分析します。

まず、[[glossary/EIP-8131|EIP-8131]]/[[glossary/EIP-8279|EIP-8279]]で指定されたバイトあたり64[[glossary/gas|ガス]]の[[glossary/Floor-price|フロア価格]]と、[[glossary/EIP-8037|EIP-8037]]の`[[glossary/CPSB|CPSB（ステートバイトあたりのコスト）]] = 1530`を維持するベースライン構成から始めます。次に、[[glossary/EIP-8368|EIP-8368]]と[[glossary/EIP-8372|EIP-8372]]で検討されている、異なる[[glossary/slot-time-allocations|スロット時間割り当て]]に応じて[[glossary/Floor-price|フロア価格]]を調整し、`[[glossary/CPSB|CPSB]]`を再調整することで、2つの調整済みベンチマークを構築します。これらの一次元ベンチマークを、[[glossary/EIP-7999|EIP-7999]]をシミュレートしたのと同じ構築された需要条件下でシミュレートし、選択された[[glossary/EIP-7999|EIP-7999]]構成と比較します。

本稿で提示される結果は、[このリポジトリ](https://github.com/M1kuW1ll/eip-7999-research/tree/main/notebooks/one_dimensional_simulation)から再現できます。

### 主な結果

1.  **バイトあたり64[[glossary/gas|ガス]]の[[glossary/Floor-price|フロア価格]]と`[[glossary/CPSB|CPSB]] = 1530`を持つベースラインの[[glossary/One-dimensional-fee-market|一次元手数料メカニズム]]は、[[glossary/Execution|実行]]を制限しつつ、かなりの[[glossary/State-growth|ステート成長]]を許容します。** これは、ブロックあたり82.0M～92.6Mの[[glossary/Execution-gas|実行ガス]]と、年間約288～403 GiBの[[glossary/State-growth|ステート成長]]をもたらします。
2.  **[[glossary/EIP-8368|EIP-8368]]スタイルの`[[glossary/CPSB|CPSB]]`再調整は、[[glossary/State-growth|ステート成長]]予算を回復しますが、[[glossary/relative-price-mismatch|相対価格のミスマッチ]]は残ります。** 物理的な[[glossary/State-growth|ステート成長]]は年間約121～122 GiBに減少し、共有[[glossary/base-fee|ベースフィー]]が高くなることで、提供される[[glossary/Execution|実行]]は67.5M～70.2Mに減少します。
3.  **[[glossary/EIP-8372|EIP-8372]]スタイルの調整は、[[glossary/Execution|実行]]不足の多くを回復しますが、両ブランチとも目標を十分に活用できません。** これは151.9M～177.9Mの[[glossary/Execution|実行]]をもたらしますが、通常の[[glossary/block-utilisation|ブロック利用率]]と正規化されたステート利用率は平均して目標を下回り、年間約86～88 GiBの実現された[[glossary/State-growth|ステート成長]]を生み出します。
4.  **[[glossary/EIP-7999|EIP-7999]]は、[[glossary/State-gas|ステートガス]]を個別の目標近くに保ちながら、より多くの[[glossary/Execution|実行]]をサポートします。** [[glossary/Maximum-throughput-configurations|最大スループット構成]]は252.9M～272.6Mの[[glossary/Execution-gas|実行ガス]]を提供し、[[glossary/Historically-anchored-configurations|履歴にアンカーされた構成]]は173.6M～223.0Mを提供します。どちらも年間120 GiBの[[glossary/State-growth|ステート成長]]を維持します。

## メカニズムと表記法

*一次元*とは、**共有手数料、二次元メータリングメカニズム**を意味します。共有[[glossary/base-fee|ベースフィー]]は、通常の[[glossary/gas|ガス]]と[[glossary/State-gas|ステートガス]]の大きい方に応答します。一方、[[glossary/EIP-7999|EIP-7999]]は、個別の[[glossary/Execution|実行]]、[[glossary/data-gas|データガス]]、[[glossary/State-gas|ステートガス]]の[[glossary/base-fee|ベースフィー]]を維持し、そのバンドル価格の[[glossary/demand-model|需要モデル]]には、親の[[glossary/Execution|実行]]および[[glossary/State-gas|ステートガス]]価格における[[glossary/Runtime-block-level-access-lists|BAL]]の[[glossary/data-gas|データガス]]コストが含まれます。

| ベンチマーク | フロア価格 | ステート価格設定 | 手数料更新ルール |
| --- | --- | --- | --- |
| 一次元: ベースライン | カウントされたバイトあたり64[[glossary/gas|ガス]] | [[glossary/CPSB|CPSB]] = 1530 | [[glossary/EIP-1559|EIP-1559]]更新ルールを持つ1つの共有[[glossary/base-fee|ベースフィー]] |
| 一次元: フロア調整済み + [[glossary/EIP-8368|EIP-8368]] | 各[[glossary/slot-time-allocations|スロット時間割り当て]]から導出 | [[glossary/gas-limit|ガス制限]]に合わせた[[glossary/CPSB|CPSB]] | [[glossary/EIP-1559|EIP-1559]]更新ルールを持つ1つの共有[[glossary/base-fee|ベースフィー]] |
| 一次元: フロア調整済み + [[glossary/EIP-8372|EIP-8372]] | 各[[glossary/slot-time-allocations|スロット時間割り当て]]から導出 | 正規化された[[glossary/State-gas|ステートガス制限]]と[[glossary/CPSB|CPSB]] | [[glossary/EIP-1559|EIP-1559]]更新ルールを持つ1つの共有[[glossary/base-fee|ベースフィー]] |
| [[glossary/EIP-7999|EIP-7999]] | フロアなし、個別に価格設定された[[glossary/data-gas|データガス]]リソース | [[glossary/CPSB|CPSB]] = 1530で75Mの[[glossary/State-gas|ステートガス]]目標 | 擬似指数関数的更新ルールを持つ3つの個別の[[glossary/base-fee|ベースフィー]] |

一次元仕様は、[[glossary/EIP-8037|EIP-8037]]の[[glossary/State-gas|ステートガス]]会計、[[glossary/EIP-8038|EIP-8038]]と[[glossary/EIP-2780|EIP-2780]]の[[glossary/repricing|再価格設定]]、および[[glossary/EIP-8131|EIP-8131]]と[[glossary/EIP-8279|EIP-8279]]の[[glossary/transaction-floor|トランザクションフロア]]に[[glossary/Static-data|静的データ]]と[[glossary/Runtime-block-level-access-lists|ランタイムBAL]]を含む[[glossary/data-gas|データガス]]価格設定を組み合わせたものです。

| 表記 | 意味 |
| --- | --- |
| i\in\{E,D,S\} | リソースインデックス: [[glossary/Execution|実行]] (E)、[[glossary/data-gas|データガス]] (D)、または[[glossary/State-growth|ステート成長]] (S) |
| q_i | [[glossary/demand-model|需要モデル]]で使用される履歴[[glossary/gas|ガス]]相当単位でのリソースiのアクティビティ |
| q_i^0 | 2026年2月～5月のブロックあたりのリソースiの履歴平均アクティビティ。その[[glossary/quantity-anchor|数量アンカー]]として使用 |
| m_i | リソースiの[[glossary/Counterfactual-metering-multiplier|反実仮想メータリング乗数]] |
| \epsilon_i | リソースiの[[glossary/effective-price|実効価格]]に対する応答を支配する正の[[glossary/demand-elasticity-magnitude|需要弾力性の大きさ]] |
| F | バイトあたりの[[glossary/gas|ガス]]単位での[[glossary/Floor-price|フロア価格]] |
| \mathrm{CPSB} | [[glossary/EIP-8037|EIP-8037]]の下でステートバイトあたりに課金される[[glossary/State-gas|ステートガス]] |
| p^0 | [[glossary/price-anchor|価格アンカー]]として使用される履歴参照[[glossary/base-fee|ベースフィー]]。bと同じ単位で表現 |
| b | すべてのリソースで共有される[[glossary/base-fee|ベースフィー]] |
| m_i b/p^0 | 履歴[[glossary/price-anchor|価格アンカー]]に対するリソースiの[[glossary/effective-price|実効価格]] |
| g_{\mathrm{regular}} | [[glossary/repricing|再価格設定]]された[[glossary/Execution-gas|実行ガス]]と[[glossary/transaction-floor|トランザクションフロア]]/[[glossary/data-gas|データガス]] |
| g_{\mathrm{state}} | [[glossary/EIP-8037|EIP-8037]][[glossary/State-gas|ステートガス]]、m_Sq_S |
| g_{\mathrm{shared}} | [[glossary/fee-controlled-usage|手数料制御された使用量]]、\max(g_{\mathrm{regular}},g_{\mathrm{state}}) |
| L_G,T_G | 共通の[[glossary/gas-limit|ガス制限]]と[[glossary/gas-target|ガス目標]]、T_G=L_G/2 |
| B_{\max}(t_{\mathrm{prop}}) | 経験的p90[[glossary/propagation-latency|伝播遅延]]フィットによって示されるペイロードバイト容量 |

> 上付き文字0はアンカーを示します。

中心となるベンチマークでは、35日間の独立した弾力性推定値 (\\epsilon\_E,\\epsilon\_D,\\epsilon\_S)=(0.1212,0.2295,0.3349) を使用します。1つの共有[[glossary/base-fee|ベースフィー]]が、その[[glossary/Counterfactual-metering-multiplier|反実仮想実効価格]]を通じて3つのアクティビティ量を制御します。

q\_i(b)=q\_i^0\\left(\\frac{m\_i b}{p^0}\\right)^{-\\epsilon\_i}, \\qquad i\\in\\{E,D,S\\}.

2つの計測された[[glossary/gas|ガス]]ブランチは次のとおりです。

g\_{\\mathrm{regular}}(b)=m\_Eq\_E(b)+m\_Dq\_D(b),

g\_{\\mathrm{state}}(b)=m\_Sq\_S(b),

g\_{\\mathrm{bottleneck}}(b)=\\max\\left\[g\_{\\mathrm{regular}}(b),g\_{\\mathrm{state}}(b)\\right\].

**[[glossary/EIP-1559|EIP-1559]]スタイルの更新ルール。** ブロックtの場合、更新ルールはブロック内の[[glossary/bottleneck-branch|ボトルネックブランチ]]の[[glossary/gas-usage|ガス使用量]]を使用します: g\_{\\mathrm{bottleneck},t}^{\\mathrm{included}}=\\max(g\_{\\mathrm{regular},t}^{\\mathrm{included}},g\_{\\mathrm{state},t}^{\\mathrm{included}})。b\_tが[[glossary/wei|wei]]で測定される場合、次のブロックの[[glossary/base-fee|ベースフィー]]は次のとおりです。

b\_{t+1}= \\begin{cases} b\_t+\\max\\!\\left(1,\\left\\lfloor\\dfrac{b\_t\\left(g\_{\\mathrm{bottleneck},t}^{\\mathrm{included}}-T\_G\\right)}{8T\_G}\\right\\rfloor\\right), & g\_{\\mathrm{bottleneck},t}^{\\mathrm{included}}>T\_G,\\\\\[6pt\] b\_t, & g\_{\\mathrm{bottleneck},t}^{\\mathrm{included}}=T\_G,\\\\\[6pt\] b\_t-\\left\\lfloor\\dfrac{b\_t\\left(T\_G-g\_{\\mathrm{bottleneck},t}^{\\mathrm{included}}\\right)}{8T\_G}\\right\\rfloor, & g\_{\\mathrm{bottleneck},t}^{\\mathrm{included}}<T\_G. \\end{cases}

すべての比較は、2026年4月から5月までの60日間のブロックパネルから構築された32のブートストラップパスと同じ[[glossary/demand-conditions|需要条件]]を使用します。各パスには7,200の[[glossary/burn-in-blocks|バーンインブロック]]とそれに続く50,400の[[glossary/measured-blocks|測定ブロック]]があります。[[glossary/gas-usage|ガス使用量]]と[[glossary/block-limit-frequencies|ブロック制限頻度]]は、[[glossary/measured-blocks|測定ブロック]]で平均され、次にシミュレートされたパスで平均されます。

## ベースライン: バイトあたり64[[glossary/gas|ガス]]のフロアと[[glossary/CPSB|CPSB]]=1530

ベースラインは、[[glossary/EIP-8131|EIP-8131]]と[[glossary/EIP-8279|EIP-8279]]の[[glossary/Floor-price|フロア価格]]をバイトあたり64[[glossary/gas|ガス]]に、`[[glossary/CPSB|CPSB]] = 1530`に維持します。各[[glossary/propagation-time|伝播時間]]t\_{\\mathrm{prop}}について、[[glossary/execution-time-gas-capacity|実行時間ガス容量]]と[[glossary/payload-byte-budget|ペイロードバイト予算]]は次のとおりです。

L\_E(t\_{\\mathrm{prop}})=v\_E(9-t\_{\\mathrm{prop}}), \\quad v\_E=100\\mathrm{M\\ gas/s}

B\_{\\max}(t\_{\\mathrm{prop}})=1024\\left(\\frac{1000t\_{\\mathrm{prop}}-569}{0.443}\\right).

[[glossary/gas-limit|ガス制限]]は、[[glossary/execution-time-gas-capacity|実行時間ガス容量]]と[[glossary/worst-case-payload|最悪ケースのペイロード]]の[[glossary/gas-usage|ガス使用量]]の小さい方です。

L\_G^{64}(t\_{\\mathrm{prop}}) =\\min\\left\[L\_E(t\_{\\mathrm{prop}}),64B\_{\\max}(t\_{\\mathrm{prop}})\\right\].

導出された[[glossary/gas-limit|ガス制限]]は、3秒で359.6M、3.5秒で433.6Mです。これは、[[glossary/data-capacity|データ容量]]が制約となるためです。4秒以降は、[[glossary/Execution-capacity|実行容量]]が[[glossary/gas-limit|ガス制限]]を設定します。[[glossary/EIP-7999|EIP-7999]]構成では、[[glossary/Execution|実行]]/[[glossary/data-gas|データガス]]目標を固定し、[[glossary/gas-limit|ガス制限]]を変更しますが、ここでは目標対制限比を1/2に固定します。

### データ価格設定

[[glossary/One-dimensional-fee-market|一次元手数料メカニズム]]の下では、[[glossary/EIP-8131|EIP-8131]][[glossary/Static-data|静的トランザクションコンテンツバイト]]と[[glossary/EIP-8279|EIP-8279]][[glossary/Runtime-block-level-access-lists|ランタイムBAL]]は[[glossary/transaction-floor|トランザクションフロア]]を通じて価格設定されます。[[https://ethresear.ch/t/data-metering-bal-decomposition-and-bundle-pricing-under-eip-7999/25747|前回の分析]]と同様に、2026年2月から5月までの1,899,748件のトランザクションを含む6,000の決定論的ブロックをサンプリングし、[[glossary/repricing|再価格設定]]された[[glossary/Execution-gas|実行ガス]]、[[glossary/static-content-floor|静的コンテンツフロア]]、および[[glossary/EIP-8279|EIP-8279]][[glossary/Runtime-block-level-access-lists|ランタイムBAL]]バイトを再構築します。

[[glossary/Floor-price|フロア価格]]をF、トランザクションjの[[glossary/repricing|再価格設定]]された通常の[[glossary/Execution-gas|実行ガス]]をE\_j、フロア内の[[glossary/Static-data|静的データバイト]]をC\_j、[[glossary/Runtime-block-level-access-lists|ランタイムBAL]]バイトをM\_jとします。計測された通常のブランチ[[glossary/gas|ガス]]は次のとおりです。

G\_j(F)=\\max\\left\\{E\_j, 21000+F(C\_j+M\_j)\\right\\},

バイトあたり64[[glossary/gas|ガス]]の[[glossary/Floor-price|フロア価格]]では、履歴サンプルにおいて、通常の[[glossary/Execution|実行]]料金が[[glossary/Runtime-block-level-access-lists|ランタイムBAL]]フロア拡張のほとんどを吸収します。[[glossary/Cold-storage-access|コールドストレージアクセス]]は、この[[glossary/Floor-price|フロア価格]]でのカバレッジを示しています。その32バイトのキーは、[[glossary/Runtime-block-level-access-lists|ランタイムBAL]]を通じてフロアで32\\times64=2{,}048[[glossary/gas|ガス]]を貢献しますが、2,100[[glossary/Execution-gas|実行ガス]]を消費します。[[glossary/Runtime-block-level-access-lists|ランタイムBAL]]を追加すると、サンプリングされたトランザクションの2.05%で通常のブランチ[[glossary/gas|ガス]]が増加します。すでに[[glossary/static-floor|静的フロア]]に拘束されているトランザクション、またはその10%以内に収まっているトランザクションが、[[glossary/Runtime-block-level-access-lists|BAL]]に起因する[[glossary/gas-uplift|ガス上昇]]の約75%を占め、[[glossary/deployed-code-driven-floor-exposure|デプロイ済みコード駆動のフロア露出]]は、コードデプロイメントが[[glossary/EIP-8037|EIP-8037]]の下で通常の[[glossary/gas|ガス]]ではなく[[glossary/State-gas|ステートガス]]を消費するため、さらに16%を貢献します。

結果として、この増加はより大きな[[glossary/data-multiplier|データ乗数]]2.1615に調整されます。

### シミュレーション結果

[![動的ベースライン3秒例パス](https://ethresear.ch/uploads/default/optimized/3X/6/6/6674b9e8ef39c94361c47310bcedceb198a8af09_2_690x244.png)](https://ethresear.ch/uploads/default/original/3X/6/6/6674b9e8ef39c94361c47310bcedceb198a8af09.png "動的ベースライン3秒例パス")

> 50,400シミュレートブロックにおける計測された通常ガス、計測されたステートガス、および共有ベースフィー。3秒伝播構成は、179.8Mガス（破線）の共通目標と359.6Mガス（実線）の制限を持ち、バイトあたり64ガス、`CPSB = 1,530`のフロアを持つ。共有フィーは2つの計測ブランチの大きい方に応答し、対数スケールでwei単位で表示される。シミュレーションは35日間の弾力性ベクトルを使用。

| 伝播 | 目標 / 制限 | 均衡ベースフィー | 平均計測実行ガス | 平均データ/フロアガス | 平均ステートガス | ステート成長 (GiB/年) | 制限に達したブロック | 手数料変動 | ボトルネックとしてのステート |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 3.0秒 | 179.8M / 359.6M | 86,981 [[glossary/wei|wei]] | 82.0M | 12.0M | 180.1M | 288.1 | 7.99% | 0.0608 | 92.49% |
| 3.5秒 | 216.8M / 433.6M | 49,756 [[glossary/wei|wei]] | 87.9M | 13.7M | 218.2M | 349.0 | 8.17% | 0.0611 | 95.02% |
| 4.0秒 | 250.0M / 500.0M | 32,513 [[glossary/wei|wei]] | 92.6M | 15.1M | 252.2M | 403.4 | 8.27% | 0.0613 | 96.27% |
| 4.5秒 | 225.0M / 450.0M | 44,535 [[glossary/wei|wei]] | 89.1M | 14.0M | 226.6M | 362.5 | 8.20% | 0.0612 | 95.39% |
| 5.0秒 | 200.0M / 400.0M | 63,308 [[glossary/wei|wei]] | 85.3M | 12.9M | 200.9M | 321.4 | 8.10% | 0.0610 | 94.08% |

[[https://ethresear.ch/t/demand-model-with-elasticities-for-ethereum-state-data-and-execution-and-glamsterdam-fee-market-analysis/25644|グラムステルダム手数料市場の均衡分析]]で観察されたのと同様に、無制限の[[glossary/isoelastic-model|等弾力性モデル]]の下では、**[[glossary/State|ステート]]が均衡において[[glossary/bottleneck-branch|ボトルネックブランチ]]となり、シミュレートされたブロックの90%以上で手数料を決定します。** [[glossary/State|ステート]]アクティビティは、推定弾力性が最も高いため、共有[[glossary/base-fee|ベースフィー]]が低下するとより強く拡大し、[[glossary/EIP-8037|EIP-8037]]の[[glossary/repricing|再価格設定]]は、[[glossary/State-creation-activity|ステート作成アクティビティ]]の各単位に実質的により多くの計測[[glossary/gas|ガス]]を割り当てます。これらの効果が相まって、[[glossary/State|ステート]]ブランチは、通常のブランチ使用量を目標以下に保つ手数料で共通目標に到達します。したがって、[[glossary/State|ステート]]需要に対応するために必要な共有[[glossary/base-fee|ベースフィー]]が[[glossary/Execution|実行]]の拡大を制限します。

`[[glossary/CPSB|CPSB]]`は150Mの[[glossary/gas-limit|ガス制限]]で75Mの[[glossary/State-gas|ステートガス]]目標に調整されたままですが、シミュレートされた目標は179.8Mから250Mの範囲であるため、物理的な[[glossary/State-growth|ステート成長]]は元の年間120 GiBの目標をはるかに上回ります。

## フロア調整済み + [[glossary/EIP-8368|EIP-8368]]再調整された[[glossary/CPSB|CPSB]]

バイトあたり64[[glossary/gas|ガス]]の[[glossary/Floor-price|フロア価格]]と短い[[glossary/propagation-time|伝播時間]]の下では、[[glossary/gas-limit|ガス制限]]は[[glossary/worst-case-payload|最悪ケースのペイロード]]で許容される[[glossary/gas|ガス]]量によって決定されます。[[glossary/Floor-price|フロア価格]]は[[glossary/propagation-time|伝播時間]]に応じて調整できるため、[[glossary/Execution-capacity|実行容量]]が[[glossary/worst-case-payload|最悪ケースのペイロード]][[glossary/gas-usage|ガス使用量]]と等しくなり、許容される[[glossary/gas-limit|ガス制限]]を最大にすることができます。さらに、各[[glossary/propagation-time|伝播時間]]の下で導出された[[glossary/gas-limit|ガス制限]]に応じて`[[glossary/CPSB|CPSB]]`値を調整し、実際の[[glossary/State-growth|ステート成長]]が年間120 GiBの目標に近づくようにします。

### フロア価格の選択

上記のように、[[glossary/gas-limit|ガス制限]]は次のように与えられます。

L\_G(t\_{\\mathrm{prop}}) =\\min\\left\[L\_E(t\_{\\mathrm{prop}}),FB\_{\\max}(t\_{\\mathrm{prop}})\\right\].

L\_E(t\_{\\mathrm{prop}}) = FB\_{\\max}(t\_{\\mathrm{prop}}) の場合、[[glossary/gas-limit|ガス制限]]は最大に達します。

しかし、[[https://ethresear.ch/t/scaling-in-hegota-using-the-eth-transfer-to-anchor-execution-and-bandwidth/25232|この投稿]]で述べられているように、[[glossary/ETH|ETH]]転送でいっぱいのブロックは追加のペイロード制約を課します。[[glossary/ETH|ETH]]転送トランザクションは21,000[[glossary/gas|ガス]]を使用し、221物理ペイロードバイトを貢献するため、整数丸め後バイトあたり96[[glossary/gas|ガス]]になります。したがって、[[glossary/Floor-price|フロア価格]]を96以上にさらに引き上げても、[[glossary/ETH|ETH]]転送でいっぱいのブロックによって定義される[[glossary/worst-case-payload|最悪ケースのペイロード]]によって[[glossary/gas-limit|ガス制限]]が高くなることはありません。したがって、[[glossary/gas-limit|ガス制限]]と[[glossary/Floor-price|フロア価格]]は次のように与えられます。

L\_G(t)=\\min\\left\[L\_E(t),\\frac{21,000}{221}B\_{\\max}(t)\\right\], \\quad F^\*(t)=\\left\\lceil\\frac{L\_G(t)}{B\_{\\max}(t)}\\right\\rceil.

### [[glossary/EIP-8368|EIP-8368]]: 新しいガス制限のための[[glossary/CPSB|CPSB]]再調整

[[glossary/EIP-8037|EIP-8037]]の`[[glossary/CPSB|CPSB]] = 1530`は、75Mの[[glossary/State-gas|ステートガス]]目標と年間120 GiBの[[glossary/Annual-state-growth|年間ステート成長]]から導出されています。[[glossary/EIP-8368|EIP-8368]]では、[[glossary/gas-target|ガス目標]]が変更された場合、同じ物理[[glossary/State|ステート]]予算を維持するには次が必要です。

\\mathrm{CPSB}(T\_G)= \\frac{T\_GN\_{\\mathrm{blocks/year}}}{S\_{\\mathrm{target/year}}}.

T\_G=L\_G/2の場合、これはおおよそ次のようになります。

\\boxed{ \\mathrm{CPSB}(L\_G)=1530\\frac{L\_G}{150\\text{M}}. }

[[glossary/State-multiplier|ステート乗数]]も同じ比率でスケーリングします。

### データ乗数

各[[glossary/Floor-price|フロア価格]]Fについて、同じ履歴サンプルでトランザクションレベルのフロア計算を繰り返し、[[glossary/data-multiplier|データ乗数]]m\_D(F)を再調整します。この乗数は、[[glossary/data-floor-contribution|データ/フロア貢献]]の加重履歴平均を再現します。動的モデルでは、この貢献は集計された[[glossary/Static-data|静的データ]]アクティビティとともにスケーリングし、[[glossary/Runtime-block-level-access-lists|ランタイムBAL]]は独立して要求されるリソースとして扱われません。

履歴構成は、この近似をある程度裏付けています。F=96の場合、[[glossary/Runtime-block-level-access-lists|ランタイムBAL]]を追加すると、サンプリングされたトランザクションの6.79%で計測された通常のブランチ[[glossary/gas|ガス]]が増加します。これには、[[glossary/Static-floor|静的フロア]]がすでに拘束されていたトランザクションも含まれます。結果として生じる[[glossary/gas-uplift|ガス上昇]]は、履歴アンカーにおける合計[[glossary/Counterfactual-regular-gas|反実仮想通常ガス]]の約2.75%であり、追加の計測[[glossary/gas|ガス]]の87.16%は、最も多くの[[glossary/Static-data|静的トランザクションデータ]]を含むサンプリングされたトランザクションの10%に由来します。したがって、追加料金は、すでにかなりの[[glossary/Static-data|静的データコンテンツ]]を運んでいるトランザクションに集中しています。

この集中は、[[glossary/data-multiplier|乗数]]を[[glossary/Structural-demand-model|構造的需要モデル]]にするものではありません。フロアレートが82と96の場合、32バイトの[[glossary/Cold-storage-access|コールドストレージアクセス]]は、[[glossary/Runtime-block-level-access-lists|ランタイムBAL]]を通じてそれぞれ2,624[[glossary/gas|ガス]]と3,072[[glossary/gas|ガス]]のフロア[[glossary/gas|ガス]]を貢献し、その2,100[[glossary/gas|ガス]]の[[glossary/Execution|実行]]料金を超えます。したがって、アクセス集約型トランザクションは、生成する[[glossary/Runtime-block-level-access-lists|BAL]]を通じてフロアに露出する可能性があります。結果として生じる[[glossary/gas-uplift|ガス上昇]]をm\_D(F)を通じて表現することは、価格とトランザクション構成が変化しても、その集計貢献が[[glossary/Static-data|静的データ]]アクティビティに従い続けると仮定しています。

[[glossary/Static-data|静的データ]]の[[glossary/demand-curve|需要曲線]]は、[[glossary/effective-price|実効価格]]m\_D(F)bに応答します。このモデルは、[[glossary/Runtime-block-level-access-lists|BAL]]関連のフロア露出を通じて総費用が変化するトランザクションの[[glossary/Execution|実行]]および[[glossary/State|ステート]]需要応答を省略しています。[[https://ethresear.ch/t/data-metering-bal-decomposition-and-bundle-pricing-under-eip-7999/25747|EIP-7999バンドル価格設定モデル]]とは異なり、これらの料金を親の[[glossary/Execution|実行]]/[[glossary/State|ステート]]アクティビティ価格に明示的にフィードすることはありません。より高いフロアレートの結果は、アンカー調整された縮約形として解釈します。

以下の表は、調整された[[glossary/Floor-price|フロア価格]]と`[[glossary/CPSB|CPSB]]`を持つ一次元構成をまとめたものです。

| 伝播 | 共有ガス制限 | フロア価格 (ガス/バイト) | [[glossary/CPSB|CPSB]] | ステート乗数 m_S | データ乗数 m_D | 制限を設定するボトルネック |
| --- | --- | --- | --- | --- | --- | --- |
| 3.0秒 | 534.0M | 96 | 5,446 | 20.1349 | 4.0325 | [[glossary/ETH|ETH]]転送ペイロード |
| 3.5秒 | 550.0M | 82 | 5,610 | 20.7398 | 3.0875 | 実行時間 |
| 4.0秒 | 500.0M | 64 | 5,100 | 18.8544 | 2.1615 | 実行時間 |
| 4.5秒 | 450.0M | 50 | 4,590 | 16.9689 | 1.7634 | 実行時間 |
| 5.0秒 | 400.0M | 40 | 4,080 | 15.0835 | 1.5887 | 実行時間 |

### シミュレーション結果

| 伝播 | 目標 / 制限 | 均衡手数料 | 平均計測実行ガス | 平均データ/フロアガス | 平均ステートガス | ステート成長 (GiB/年) | 制限に達したブロック | 手数料変動 | ボトルネックとしてのステート |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 3.0秒 | 267.0M / 534.0M | 332,742 [[glossary/wei|wei]] | 70.0M | 14.4M | 270.5M | 121.6 | 8.47% | 0.0618 | 98.51% |
| 3.5秒 | 275.0M / 550.0M | 323,038 [[glossary/wei|wei]] | 70.2M | 11.8M | 278.8M | 121.6 | 8.49% | 0.0618 | 98.73% |
| 4.0秒 | 250.0M / 500.0M | 355,342 [[glossary/wei|wei]] | 69.4M | 8.8M | 253.3M | 121.6 | 8.48% | 0.0618 | 98.57% |
| 4.5秒 | 225.0M / 450.0M | 394,824 [[glossary/wei|wei]] | 68.5M | 7.3M | 227.9M | 121.5 | 8.44% | 0.0617 | 98.25% |
| 5.0秒 | 200.0M / 400.0M | 444,177 [[glossary/wei|wei]] | 67.5M | 6.6M | 202.3M | 121.4 | 8.39% | 0.0616 | 97.73% |

フロア調整された[[glossary/EIP-8368|EIP-8368]]構成では、再調整された`[[glossary/CPSB|CPSB]]`が物理的な[[glossary/State-growth|ステート成長]]を年間120 GiBの目標近くに保ちます。推定[[glossary/demand-curve|需要曲線]]の下では、計測された[[glossary/State-gas|ステートガス]]を目標近くに保つために、より高い[[glossary/base-fee|ベースフィー]]が必要になります。[[glossary/State|ステート]]は、ベースラインよりもさらに多くのブロックで手数料更新を決定します。[[glossary/Execution|実行]]もこの高い共有手数料を支払うため、短い[[glossary/propagation-time|伝播時間]]の下で調整された[[glossary/Floor-price|フロア価格]]で[[glossary/gas-limit|ガス制限]]が高くなっても、[[glossary/Execution-gas|実行ガス]]使用量はベースラインよりもさらに低くなります。

## フロア調整済み + [[glossary/EIP-8372|EIP-8372]]: 相対ステート価格の調整

[[glossary/EIP-8368|EIP-8368]]の下で`[[glossary/CPSB|CPSB]]`を再調整すると、[[glossary/gas-target|ガス目標]]に関連する物理的な[[glossary/State-growth|ステート成長]]は維持されますが、[[glossary/Execution|実行]]/[[glossary/data-gas|データガス]]と[[glossary/State|ステート]]需要が同じ共有[[glossary/base-fee|ベースフィー]]で目標に到達することを保証するものではありません。前のベンチマークでは、[[glossary/State|ステート]]は、通常のブランチ使用量を目標以下に保つ手数料で目標に到達します。

[[glossary/EIP-8372|EIP-8372]]は追加の調整パラメータを導入します。生の[[glossary/State-gas|ステートガス制限]]は`[[glossary/CPSB|CPSB]]`とともにスケーリングでき、[[glossary/State-gas|ステートガス]]使用量は手数料更新に入る前に正規化されます。これにより、[[glossary/State-creation|ステート作成]]の[[glossary/relative-price|相対価格]]と、その目標を満たす[[glossary/State-bytes|ステートバイト]]の数が分離されます。

c\_0を共通目標と年間120 GiBの[[glossary/State-growth|ステート成長]]目標から導出されたベースライン`[[glossary/CPSB|CPSB]]`とし、kを[[glossary/demand-calibration-scale|需要校正スケール]]とします。ベンチマークでは次のように設定します。

\\mathrm{CPSB}=kc\_0, \\qquad L\_{\\mathrm{state}}^{\\mathrm{raw}}=kL\_G.

ブロックがz\_tの計測された[[glossary/State-bytes|ステートバイト]]を作成する場合、その生の[[glossary/State-gas|ステートガス]]と正規化された[[glossary/State-gas|ステートガス]]は次のとおりです。

g\_{\\mathrm{state},t}^{\\mathrm{raw}}=kc\_0z\_t, \\qquad !\[eip8368\_eip8372\_3s\_replication00\_combined|690x235\](upload://44sPvsPsGnOdM9GDokx7jRXdIJM.png) g\_{\\mathrm{state},t}^{\\mathrm{normalized}} =\\frac{g\_{\\mathrm{state},t}^{\\mathrm{raw}}}{k} =c\_0z\_t.

`[[glossary/CPSB|CPSB]]`と生の制限を一緒にスケーリングすることで、物理的な[[glossary/State-bytes|ステートバイト]]容量はほぼ変更されません。スケールは依然として[[glossary/State-creation|ステート作成]]の価格kc\_0b\_tに入りますが、その正規化された容量会計からはキャンセルされます。集計[[glossary/demand-model|需要モデル]]内では、まず通常の[[glossary/gas|ガス]]単独で共通目標に到達する[[glossary/base-fee|ベースフィー]]b\_Rを見つけます。

g\_{\\mathrm{regular}}(b\_R)=T\_G.

通常の[[glossary/gas|ガス]]には[[glossary/Execution|実行]]と[[glossary/transaction-floor|トランザクションフロア]]/[[glossary/data-gas|データガス]]コンポーネントが含まれるため、この条件は[[glossary/Execution|実行]]単独で目標に到達することを意味しません。

スケーリング前、k=1の場合の[[glossary/State-target-clearing-fee|ステート目標クリアリング手数料]]をb\_Sとします。モデル化された[[glossary/State|ステート]]需要はkbに依存するため、k^\*=\\frac{b\_S}{b\_R}を選択すると、両方の正規化されたブランチが同じ均衡手数料b\_Rで揃います。

[[glossary/EIP-8368|EIP-8368]]ベンチマークでは、長い[[glossary/propagation-time|伝播時間]]割り当てでフロアを下げると、通常の[[glossary/gas|ガス]]需要は変化しますが、[[glossary/State|ステート]]が[[glossary/bottleneck-branch|ボトルネックブランチ]]のままであるため、均衡[[glossary/base-fee|ベースフィー]]は変更されません。この不変性は、[[glossary/relative-price|相対価格]]スケールが通常のブランチ目標クリアリング手数料を使用して調整されるこの[[glossary/EIP-8372|EIP-8372]]ベンチマークには一般に当てはまりません。また、この調整は、`[[glossary/CPSB|CPSB]]`を変更しても集計された通常の[[glossary/demand-curve|需要曲線]]は変更されないと仮定していることにも注意してください。以下の表は、各[[glossary/gas-limit|ガス制限]]の下での共有均衡[[glossary/base-fee|ベースフィー]]と調整された`[[glossary/CPSB|CPSB]]`をまとめたものです。

| 伝播 | 共通目標 / 制限 | フロア価格 | ベースライン[[glossary/CPSB|CPSB]] c_0 | 調整済み[[glossary/CPSB|CPSB]] | スケール k | 共有均衡ベースフィー |
| --- | --- | --- | --- | --- | --- | --- |
| 3.0秒 | 267.0M / 534.0M | 96 | 5,446 | 20,538,083 | 3,771.22 | 88.22 [[glossary/wei|wei]] |
| 3.5秒 | 275.0M / 550.0M | 82 | 5,610 | 37,466,671 | 6,678.55 | 48.37 [[glossary/wei|wei]] |
| 4.0秒 | 250.0M / 500.0M | 64 | 5,100 | 32,147,026 | 6,303.33 | 56.37 [[glossary/wei|wei]] |
| 4.5秒 | 225.0M / 450.0M | 50 | 4,590 | 19,653,155 | 4,281.73 | 92.21 [[glossary/wei|wei]] |
| 5.0秒 | 200.0M / 400.0M | 40 | 4,080 | 9,512,074 | 2,331.39 | 190.52 [[glossary/wei|wei]] |

3.5秒の[[glossary/propagation-time|伝播時間]]では、調整によりk\\approx6{,}679が選択され、`[[glossary/CPSB|CPSB]]`は5,610から約37.5Mに増加し、共有均衡手数料は323,038[[glossary/wei|wei]]から48.37[[glossary/wei|wei]]に減少します。大きな`[[glossary/CPSB|CPSB]]`[[glossary/gas-coefficient|ガス係数]]は、はるかに低い手数料を補償するため、均衡における[[glossary/State-bytes|ステートバイト]]の[[glossary/ETH|ETH]]価格の同等の増加を意味するものではありません。

### シミュレーション結果

[![EIP-8368_EIP-8372 3秒レプリケーション00結合](https://ethresear.ch/uploads/default/optimized/3X/1/c/1c89e7dbc53bd74d007c75574973f13aff2151ae_2_690x235.png)](https://ethresear.ch/uploads/default/original/3X/1/c/1c89e7dbc53bd74d007c75574973f13aff2151ae.png "EIP-8368_EIP-8372 3秒レプリケーション00結合")

この調整は、[[glossary/EIP-8368|EIP-8368]]ベンチマークにおける等しい生制限[[glossary/State|ステート]]会計の下で失われた[[glossary/Execution|実行]]の多くを回復します。同じ3.5秒の[[glossary/propagation-time|伝播時間]]で、平均[[glossary/Execution-gas|実行ガス]]はブロックあたり70.2Mから177.9Mに増加します。5つの割り当て全体で、調整されたメカニズムは151.9M～177.9Mの[[glossary/Execution|実行]]を提供します。

| 伝播 | 平均実行ガス | 通常目標利用率 | 正規化ステート目標利用率 | ステート成長 (GiB/年) | ボトルネックとしてのステート | 制限に達したブロック | 手数料変動 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 3.0秒 | 166.9M | 89.2% | 73.4% | 88.1 | 27.89% | 4.05% | 0.0522 |
| 3.5秒 | 177.9M | 88.5% | 71.6% | 86.0 | 26.50% | 3.65% | 0.0502 |
| 4.0秒 | 174.7M | 89.2% | 71.7% | 86.0 | 25.78% | 3.56% | 0.0504 |
| 4.5秒 | 165.3M | 90.0% | 72.5% | 87.0 | 25.82% | 3.67% | 0.0515 |
| 5.0秒 | 151.9M | 90.6% | 73.2% | 87.8 | 25.92% | 3.80% | 0.0528 |

しかし、均衡で2つの目標を一致させても、動的な[[glossary/demand-shocks|需要ショック]]の下で両方のリソースが目標に留まることを保証するものではありません。通常の[[glossary/gas|ガス]]利用率は平均して目標の88.5%～90.6%であり、正規化された[[glossary/State-gas|ステートガス]]利用率は平均して目標の71.6%～73.4%です。実現された[[glossary/State-growth|ステート成長]]は、年間120 GiBの目標ではなく、年間約86～88 GiBです。

その理由は、手数料更新ルールが、[[glossary/State|ステート]]が正規化された後の[[glossary/bottleneck-resource|ボトルネックリソース]]に応答するためです。

g\_{\\mathrm{bottleneck}} = \\max\\left\\{ g\_{\\mathrm{regular}}, \\frac{g\_{\\mathrm{state}}^{\\mathrm{raw}}}{k} \\right\\}.

正の[[glossary/State-demand-shock|ステート需要ショック]]は、通常の利用量が目標を下回っている場合でも、通常のアクティビティが支払う手数料を上昇させる可能性があります。逆に、通常の需要ショックは、[[glossary/State|ステート]]利用量が目標を下回っている間に[[glossary/State-creation|ステート作成]]の価格を上昇させる可能性があります。同じ手数料では、2つのブランチの価格を独立して調整することはできません。例として、次の固定価格会計ケースを考えてみましょう。

-   あるブロックでは、通常の利用量が目標の100%で、[[glossary/State|ステート]]利用量が50%です。メカニズムは100%の目標利用率を認識するため、手数料は変更されません。
-   別のブロックでは、通常の利用量が100%で、[[glossary/State|ステート]]利用量が150%です。メカニズムは150%を認識するため、手数料を上昇させます。

[[glossary/State|ステート]]需要は2つのブロックで平均100%です。しかし、[[glossary/One-dimensional-fee-market|一次元手数料メカニズム]]は平均125%を認識します。これは、各ブロックで[[glossary/bottleneck-resource|ボトルネックリソース]]に個別に反応するためです。言い換えれば、**共有[[glossary/base-fee|ベースフィー]]は、より大きな正規化されたリソースに応答し、十分に活用されていないリソースの価格を独立して引き下げることはできません。**

このベンチマークは均衡に調整されており、シミュレートされたワークロードの下での平均利用率を最大化するために最適化されているわけではないことに注意してください。

## [[glossary/EIP-7999|EIP-7999]]との比較

この表は、5つの[[glossary/slot-time-allocations|スロット時間割り当て]]における各設計ファミリーの設定をまとめたものです。各一次元ベンチマークと[[glossary/EIP-7999|EIP-7999]][[glossary/Maximum-throughput-design|最大スループット設計]]について、テストされた構成の中から平均提供[[glossary/Execution|実行]]が最も高いものを選択します。[[glossary/Historically-anchored-EIP-7999|履歴にアンカーされたEIP-7999]]については、適格な構成の中で最大[[glossary/Execution|実行]]を持つものを選択します。一次元の中心的な選択は、ベースラインでは4秒、フロア調整された両ベンチマークでは3.5秒です。

| 設計 | 構成 | 平均実行ガス | ステート成長 (GiB/年) | 制限に達したブロック | 平均ブロック手数料 (ETH) |
| --- | --- | --- | --- | --- | --- |
| ベースライン | 4.0秒, 500M制限 | 92.6M | 403.4 | 8.27% | 0.00001927 |
| フロア調整済み + [[glossary/EIP-8368|EIP-8368]] | 3.5秒, 550M制限 | 70.2M | 121.6 | 8.49% | 0.00019206 |
| フロア調整済み + [[glossary/EIP-8372|EIP-8372]] | 3.5秒, 550M制限 | 177.9M | 86.0 | 3.65% | 0.00026769 |
| [[glossary/EIP-7999|EIP-7999]]履歴アンカー | 4.0秒, E225/D60 | 223.0M | 120.0 | 4.82% | 0.00023807 |
| [[glossary/EIP-7999|EIP-7999]]最大スループット | 4.5秒, E300/D90 | 272.6M | 120.0 | 19.53% | 0.00022223 |

### 実行ゲイン

[[glossary/EIP-8372|EIP-8372]]の再調整と正規化は、一次元メカニズムにおける等しい生制限[[glossary/State|ステート]]会計の下で失われた[[glossary/Execution|実行]]の多くを回復します。**[[glossary/EIP-7999|EIP-7999]]は、テストされた中心構成でより多くの[[glossary/Execution|実行]]を提供します**が、[[glossary/Maximum-throughput-configuration|最大スループット構成]]ではより頻繁にハードリミットに遭遇します。

選択された[[glossary/propagation-time|伝播時間]]と[[glossary/capacity-vectors|容量ベクトル]]が異なるため、この図は、各共通[[glossary/propagation-time|伝播時間]]における5つの構成すべてを比較しています。

[![共有手数料比較実行ペアードット](https://ethresear.ch/uploads/default/optimized/3X/2/c/2ca727ff312fdc6ab9c2b9598728671dc726f666_2_690x457.png)](https://ethresear.ch/uploads/default/original/3X/2/c/2ca727ff312fdc6ab9c2b9598728671dc726f666.png "共有手数料比較実行ペアードット")

> 各点は、同じ32のシミュレーションワークロードパスにおけるブロックあたりの平均計測実行ガスを示します。オレンジ色のギャップラベルは、フロア調整済み + [[glossary/EIP-8372|EIP-8372]]と[[glossary/Historically-anchored-EIP-7999|履歴にアンカーされたEIP-7999]]を比較しています。青色のラベルは、[[glossary/Maximum-throughput-selection|最大スループット選択]]による追加のゲインを示しています。すべての数値ラベルはブロックあたりの百万ガス単位です。

履歴にアンカーされた制限の許容範囲を20%から25%にわずかに緩和すると、3秒の[[glossary/propagation-time|伝播時間]]の下で実質的に強力な候補が許容されることに注意してください。E200/D45がE175/D36の代わりに選択され、198.1Mの平均[[glossary/Execution-gas|実行ガス]]を提供します。これは、フロア調整済み + [[glossary/EIP-8372|EIP-8372]]構成から31.2Mの増加です。

### ステート成長

ベースラインでは、[[glossary/State|ステート]]が通常、共有[[glossary/base-fee|ベースフィー]]を決定しますが、`[[glossary/CPSB|CPSB]]`は選択された500Mの制限ではなく150Mの制限に調整されたままであり、年間403.4 GiBの[[glossary/State-growth|ステート成長]]を許容します。[[glossary/EIP-8368|EIP-8368]]は`[[glossary/CPSB|CPSB]]`を再調整し、[[glossary/State-growth|ステート成長]]を年間121.6 GiBに抑えます。これは、[[glossary/EIP-1559|EIP-1559]]更新ルールでの年間120 GiBの予算をわずかに上回ります。[[glossary/EIP-8372|EIP-8372]]は均衡で両方のブランチを一致させますが、変動する[[glossary/demand-conditions|需要条件]]の下では、通常の[[glossary/gas|ガス]]が共有[[glossary/base-fee|ベースフィー]]を決定することが多く、通常の[[glossary/block-utilisation|ブロック利用率]]と正規化された[[glossary/State|ステート]]利用率は目標の88.5%と71.6%に留まります。したがって、[[glossary/State-growth|ステート成長]]は年間86.0 GiBに減少します。一方、[[glossary/EIP-7999|EIP-7999]]は、[[glossary/excess-gas-based-fake-exponential-update|超過ガスベースの擬似指数関数的更新]]を通じて[[glossary/State-base-fee|ステートベースフィー]]を独立して調整し、これらのシミュレーションでは[[glossary/State-growth|ステート成長]]を年間120 GiB近くに保ちます。

### 平均手数料バーン / 料金

手数料比較は、各ブロックの[[glossary/gas-usage|ガス使用量]]に適用される[[glossary/base-fee|ベースフィー]]を乗算し、リソース全体で合計した平均値です。一次元メカニズムの場合、[[glossary/transaction-floor|トランザクションフロア]]会計が支払われた[[glossary/gas|ガス]]を過剰にカウントする可能性があるため、通常の[[glossary/gas|ガス]]と[[glossary/State-gas|ステートガス]]の合計が料金の代理となります。

ベースラインは、変更されていない`[[glossary/CPSB|CPSB]]`が比較的低い共有手数料で実質的な[[glossary/State-creation|ステート作成]]を許容するため、ブロックあたりの料金が低くなります。[[glossary/EIP-8368|EIP-8368]]は[[glossary/State-bytes|ステートバイト]]の価格を上昇させ、より高い共有[[glossary/base-fee|ベースフィー]]も通常の[[glossary/gas|ガス]]料金を増加させます。[[glossary/EIP-8372|EIP-8372]]は均衡共有[[glossary/base-fee|ベースフィー]]を低下させますが、はるかに大きな`[[glossary/CPSB|CPSB]]`と組み合わせます。シミュレーション中、[[glossary/State-bytes|ステートバイト]]あたりに支払われる平均価格は7.62[[glossary/gwei|gwei]]に達し、[[glossary/EIP-8368|EIP-8368]]の下での3.17[[glossary/gwei|gwei]]と比較して、[[glossary/State-growth|ステート成長]]が低いにもかかわらず、より高い料金を生み出します。[[glossary/EIP-7999|EIP-7999]]に移行すると、非常に低い[[glossary/Execution-fee|実行手数料]]でより多くの[[glossary/Execution|実行]]をサポートしますが、[[glossary/State-fee|ステート手数料]]は高く維持され、選択された構成ではブロック料金の99%以上を占めます。したがって、安価な[[glossary/Execution|実行]]は、総料金の同様に大きな削減にはつながりません。

## 需要仮定への感度

3つの一次元構成すべてが代替の弾力性推定値にどのように応答するかを、計測された[[glossary/Execution|実行]]と物理的な[[glossary/State-growth|ステート成長]]の両方で調査します。次に、[[glossary/EIP-7999|EIP-7999]]からの追加の[[glossary/Execution-throughput|実行スループット]]が異なる弾力性推定値の下でも存続するかどうかを確認します。[[glossary/EIP-7999|EIP-7999]]構成の場合、[[glossary/Runtime-block-level-access-lists|BAL]]割り当て\\lambda = 0と[[glossary/State-access-intensity|ステートアクセス強度]]\\rho\_A = 1に関する中心的な仮定を維持します。これは、提供される[[glossary/Execution|実行]]を最小限にしか変更しないためです。

| 推定期間 | \epsilon_E | \epsilon_D | \epsilon_S |
| --- | --- | --- | --- |
| 21日 | 0.117067 | 0.201790 | 0.478438 |
| 35日 | 0.121160 | 0.229476 | 0.334864 |
| 60日 | 0.081668 | 0.204691 | 0.279676 |
| 75日 | 0.078511 | 0.201391 | 0.253556 |

### 一次元パフォーマンスの変化

[![共有手数料弾力性実行ステート](https://ethresear.ch/uploads/default/optimized/3X/c/5/c55e18081eba2220e41ac27a96d361e00411a2d4_2_690x354.png)](https://ethresear.ch/uploads/default/original/3X/c/5/c55e18081eba2220e41ac27a96d361e00411a2d4.png "共有手数料弾力性実行ステート")

代替の弾力性ベクトルは、[[glossary/slot-time-allocations|スロット時間割り当て]]全体で大まかなパターンを維持しますが、提供される[[glossary/Execution-gas|実行ガス]]のレベルは変化させます。ベースラインおよびフロア調整された[[glossary/EIP-8368|EIP-8368]]ベンチマークでは、[[glossary/State|ステート]]がほぼすべてのブロックで主要な[[glossary/bottleneck-branch|ボトルネックブランチ]]のままです。共有手数料は[[glossary/State|ステート]]使用量を目標近くに維持するように調整されるため、物理的な[[glossary/State-growth|ステート成長]]は、特定の構成における弾力性ベクトル間でほとんど変化しません。[[glossary/Execution-gas|実行ガス]]は、[[glossary/Execution-elasticity|実行弾力性]]と、[[glossary/base-fee|ベースフィー]]を決定する[[glossary/State-demand-response|ステート需要応答]]の両方に依存します。

[[glossary/EIP-8372|EIP-8372]]スタイルの調整は、すべての弾力性ベクトルで[[glossary/Execution|実行]]を大幅に改善しますが、需要が中心推定値と異なる場合、同じ利用率の組み合わせを維持しません。35日間のベクトルでは、通常の[[glossary/gas|ガス]]がほとんどの更新を駆動し、正規化された[[glossary/State|ステート]]使用量は平均して目標の約72%～73%です。調整された定数kが固定されている場合、代替ベクトルは[[glossary/State|ステート]]をより頻繁に[[glossary/bottleneck-branch|ボトルネックブランチ]]にし、実現された[[glossary/State|ステート]]利用率を増加させますが、一般的に[[glossary/Execution|実行]]を減少させます。これは、不確実な需要の下での一度きりの[[glossary/relative-price-calibration|相対価格調整]]の限界を示しています。

全体として、パターンは異なる弾力性ベクトルでも堅牢です。[[glossary/State|ステート]]はベースラインおよび[[glossary/EIP-8368|EIP-8368]]設計で主要な[[glossary/bottleneck-branch|ボトルネックブランチ]]のままであり、[[glossary/EIP-8372|EIP-8372]]はミスマッチを大幅に緩和します。それにもかかわらず、提供される[[glossary/Execution|実行]]と[[glossary/State|ステート]]利用率は、完全な弾力性ベクトルにおける通常の[[glossary/gas|ガス]]と[[glossary/State|ステート]]需要の相対的なレベルに依存します。

### [[glossary/EIP-7999|EIP-7999]]のスループット優位性の堅牢性

この表は、一次元の**フロア調整済み[[glossary/EIP-8372|EIP-8372]]**構成に対する追加の[[glossary/Execution|実行]]をまとめたもので、すべての制限、目標ペア、調整定数、および一致するワークロードパスは中心値を維持しています。範囲は5つの[[glossary/slot-time-allocations|スロット時間割り当て]]すべてにわたります。

| 弾力性ベクトル | [[glossary/EIP-7999|EIP-7999]]履歴アンカーからの実行ゲイン | [[glossary/EIP-7999|EIP-7999]]最大スループットからの実行ゲイン |
| --- | --- | --- |
| 21日間 | 19.1M–69.8M | 96.3M–124.6M |
| 35日間 | 6.8M–57.7M | 85.9M–119.2M |
| 60日間 | 19.9M–44.5M | 26.5M–45.4M |
| 75日間 | 18.3M–39.3M | 23.1M–39.8M |

[[glossary/EIP-7999|EIP-7999]]構成は、テストされたすべての弾力性推定値において、一次元のフロア調整済み[[glossary/EIP-8372|EIP-8372]]構成よりも正の平均[[glossary/Execution-gain|実行ゲイン]]を維持します。[[glossary/EIP-7999|EIP-7999]][[glossary/Maximum-throughput-configuration|最大スループット構成]]からのゲインは、[[glossary/Execution-elasticity|実行弾力性]]が低い60日/75日ベクトルでは大幅に小さくなり、個別の価格が[[glossary/demand-uncertainty|需要の不確実性]]を排除するわけではないことを示しています。

また、実現された[[glossary/State-growth|ステート成長]]が異なることにも注意してください。[[glossary/EIP-7999|EIP-7999]]は平均して年間120 GiBのままであるのに対し、[[glossary/EIP-8372|EIP-8372]]一次元ベンチマークは[[glossary/State-growth-target|ステート成長目標]]を十分に活用していません。

### ステート需要の裾野への依存性

無制限の[[glossary/isoelastic-demand-model|等弾力性需要モデル]]の下では、ベースライン構成は均衡において[[glossary/Historical-anchor|履歴アンカー]]の**6.06～8.43倍の[[glossary/State|ステート]]アクティビティ**を必要とします。物理的な[[glossary/State-growth-target|ステート成長目標]]に`[[glossary/CPSB|CPSB]]`を合わせるには、両方の調整済みベンチマークで[[glossary/Historical-anchor|アンカー]]の約2.53倍が必要です。これらの量は[[glossary/Historical-anchor|履歴アンカー]]をはるかに超えており、推定された局所弾力性は、[[glossary/State|ステート]]需要がそこまで拡大し続けることを確立するものではありません。[[glossary/State|ステート]]需要が飽和した場合、[[glossary/Execution|実行]]結果がどのように変化するかをテストします。

比較には、35日間のベクトルで3秒の[[glossary/propagation-time|伝播時間]]を使用します。価格駆動の[[glossary/State|ステート]]拡張を[[glossary/Historical-anchor|アンカー]]の1.5倍と2倍に制限し、経験的ショックは維持するため、一部のブロックでは依然としてその量を超える可能性があります。均衡を再計算し、同じシミュレーションパスをリプレイします。

| 一次元ベンチマーク | 無制限実行 | 1.5倍制限実行 | 2倍制限実行 |
| --- | --- | --- | --- |
| ベースライン | 82.0M | 145.9M | 144.9M |
| フロア調整済み + [[glossary/EIP-8368|EIP-8368]] | 70.0M | 168.3M | 152.5M |
| フロア調整済み + [[glossary/EIP-8372|EIP-8372]] | 166.9M | 173.5M | 169.8M |

**[[glossary/State|ステート]]が[[glossary/Execution|実行]]を制約する程度は、特にベースラインと[[glossary/EIP-8368|EIP-8368]]の場合、仮定された[[glossary/State-demand-tail|ステート需要の裾野]]に強く依存します。** 無制限の需要では、[[glossary/State|ステート]]がほとんどのブロックで[[glossary/bottleneck-branch|ボトルネックブランチ]]となり、通常のブランチを抑制する共有手数料を維持します。1.5倍と2倍の制限は、[[glossary/State-controlled-equilibria|ステート制御された均衡]]を排除し、共有[[glossary/base-fee|ベースフィー]]を大幅に引き下げ、実質的により多くの[[glossary/Execution|実行]]を可能にします。したがって、これら2つのベンチマークの低い[[glossary/Execution|実行]]結果は、[[glossary/State-demand-expansion|ステート需要の拡大]]に条件付けられています。

**[[glossary/State|ステート]]需要を制限すると、[[glossary/EIP-8372|EIP-8372]]の下での追加の[[glossary/Execution-gain|実行ゲイン]]は小さくなります。これは、[[glossary/relative-price-calibration|相対価格調整]]がすでに[[glossary/State-constraint|ステート制約]]の多くを緩和しているためです。** 無制限の需要の下では、通常のブランチがすでにブロックの72.1%で手数料を決定しており、[[glossary/State|ステート]]は27.9%です。その均衡手数料は、低い制限がある場合でもない場合でも、約88.22[[glossary/wei|wei]]のままです。最小限の[[glossary/Execution-gain|実行ゲイン]]は、動的な[[glossary/State-pressure|ステート圧]]の減少に由来します。

## 制限事項

**需要の外挿と調整。** 弾力性推定値は履歴[[glossary/gas-limit|ガス制限]]増加イベントから回復されますが、シミュレートされた均衡は[[glossary/demand-curve|需要曲線]]をより低い価格とより高いアクティビティに拡張します。ベースラインは[[glossary/Historical-anchor|履歴アンカー]]の6.06～8.43倍の[[glossary/State|ステート]]アクティビティを必要とし、両方の調整済みベンチマークは約2.53倍を必要とします。これらの結果は、維持された[[glossary/isoelastic-curve|等弾力性曲線]]の含意です。弾力性と[[glossary/State-saturation-sensitivities|ステート飽和感度]]は選択された代替案をテストしますが、[[glossary/demand-tail|需要の裾野]]を特定するものではありません。[[glossary/EIP-8372|EIP-8372]]のスケーリング定数は、35日間の弾力性ベクトル下の均衡に調整されており、確率的ワークロード下の平均利用率のために最適化されているわけではありません。

**集計フロア会計と需要応答。** [[glossary/Floor-price-specific-data-multiplier|フロア価格固有のデータ乗数]]は、[[glossary/data-floor-contribution|データ/フロア貢献]]の加重履歴平均を維持しますが、シミュレーションは、アクティビティと価格が変化するにつれて、各トランザクションのフロア露出を追跡しません。[[glossary/Static-data|静的データ]]需要を通じてフロア調整を組み込みますが、[[glossary/Runtime-block-level-access-lists|BAL]]関連のフロア露出がトランザクションの総費用を変化させる場合の追加の[[glossary/Execution|実行]]および[[glossary/State|ステート]]応答は省略します。これは、[[glossary/EIP-7999|EIP-7999]]の親アクティビティ価格における明示的な[[glossary/Aggregate-BAL-charge|集計BAL料金]]とは異なります。この近似は、より高いフロアレートと、通常の[[glossary/demand-curve|需要曲線]]が[[glossary/relative-price-calibration|相対価格調整]]を決定し、ほとんどの手数料更新を駆動する[[glossary/EIP-8372|EIP-8372]]ベンチマークで特に重要です。履歴的な[[glossary/gas-uplift|ガス上昇]]が[[glossary/Static-data|静的データ]]の多いトランザクションに集中していることは、この近似を裏付けています。しかし、価格と[[glossary/transaction-mix|トランザクション構成]]が変化した場合のその精度は不確実なままです。

## 結論

本分析では、[[glossary/Glamsterdam|グラムステルダム]]後の[[glossary/One-dimensional-fee-market|一次元手数料市場]]を、ベースライン、フロア調整済み[[glossary/EIP-8368|EIP-8368]]、フロア調整済み[[glossary/EIP-8372|EIP-8372]]の3つの構成で研究しました。同じ履歴[[glossary/demand-anchors|需要アンカー]]とシミュレートされた[[glossary/demand-shocks|需要ショック]]を使用して、それらの均衡と動的シミュレーション結果を[[glossary/EIP-7999|EIP-7999]]と比較しました。

ベースラインと[[glossary/EIP-8368|EIP-8368]]の下では、[[glossary/State|ステート]]が主に共有[[glossary/base-fee|ベースフィー]]を決定し、[[glossary/Execution|実行]]アクティビティを制約します。[[glossary/EIP-8368|EIP-8368]]の`[[glossary/CPSB|CPSB]]`調整は、意図された物理的な[[glossary/State-growth|ステート成長]]予算を維持しますが、この価格制約を解決しません。[[glossary/EIP-8372|EIP-8372]]は、[[glossary/State-pricing|ステート価格設定]]を調整し、[[glossary/State-capacity|ステート容量]]を正規化することで、両方のブランチが均衡で目標に到達するようにし、[[glossary/Execution|実行]]を大幅に増加させます。しかし、変動する[[glossary/demand-conditions|需要条件]]の下では、共有[[glossary/base-fee|ベースフィー]]は依然として[[glossary/bottleneck-branch|ボトルネックブランチ]]に応答し、リソース価格を独立して調整することはできません。

選択された[[glossary/EIP-7999|EIP-7999]]構成は、より多くの[[glossary/Execution|実行]]を提供し、[[glossary/State-growth-target|ステート成長目標]]により近い運用を行い、[[glossary/Historically-anchored-configuration|履歴にアンカーされた構成]]と[[glossary/Maximum-throughput-selection|最大スループット選択]]の間で異なるレベルのハードリミット運用を伴います。これらの結果は、[[glossary/cross-resource-pricing-constraints|クロスリソース価格制約]]を軽減するための個別のリソース価格を持つ[[glossary/Multidimensional-fee-market|多次元手数料メカニズム]]を支持します。履歴データに調整された[[glossary/demand-model|需要モデル]]と[[glossary/demand-shocks|ショックパターン]]の下では、テストされた[[glossary/EIP-7999|EIP-7999]]構成は、一次元ベンチマークよりも平均して多くの[[glossary/Execution|実行]]を提供します。

## 付録: [[glossary/EIP-8372|EIP-8372]]ステート価格設定とデプロイ容量

[[glossary/EIP-8372|EIP-8372]]調整済みベンチマークにおける大きな`[[glossary/CPSB|CPSB]]`値は、スケーリングされた[[glossary/Raw-state-gas-limit|生のステートガス制限]]と合わせて解釈する必要があります。これらは[[glossary/State-creation|ステート作成]]の[[glossary/relative-price|相対価格]]を変更しますが、ブロックに収まる[[glossary/State|ステート]]の量を比例的に減らすわけではありません。

#### 正規化下のステート容量

c\_0を[[glossary/State-budget-matched-CPSB|ステート予算に合わせたCPSB]]とし、kを[[glossary/demand-calibration-scale|需要校正スケール]]とします。

c=kc\_0, \\qquad L\_S^{\\mathrm{raw}}=kL\_G.

zの計測された[[glossary/State-bytes|ステートバイト]]量は、[[glossary/State-capacity|ステート容量]]の次の割合を消費します。

\\frac{cz}{L\_S^{\\mathrm{raw}}} = \\frac{kc\_0z}{kL\_G} = \\frac{c\_0z}{L\_G}.

kを増やすと[[glossary/State-pricing|ステート価格設定]]は変化しますが、[[glossary/State-bytes|ステートバイト]]容量は維持されます。

3秒の[[glossary/propagation-time|伝播時間]]を持つ構成では、調整は次のとおりです。

L\_G\\approx534.0\\text{M}, \\qquad c\_0=5{,}446, \\qquad c=20{,}538{,}083, \\qquad k\\approx3{,}771.22.

均衡共有[[glossary/base-fee|ベースフィー]]は88.22[[glossary/wei|wei]]です。

正確な533{,}959{,}303[[glossary/gas|ガス]]の制限と実装された整数パーセンテージスケールを使用すると、[[glossary/Raw-state-gas-limit|生のステートガス制限]]は約2.014\\times10^{12}[[glossary/gas|ガス]]です。結果として得られる最大計測[[glossary/State|ステート]]量は次のとおりです。

z\_{\\max} = \\frac{L\_S^{\\mathrm{raw}}}{c} \\approx98{,}046\\text{ bytes}.

比較のために、200Mの[[glossary/gas-limit|ガス制限]]、`[[glossary/CPSB|CPSB]] = 1,530`、等しい生の制限、および目標対制限比1/2の[[glossary/Glamsterdam|グラムステルダム]]構成を考えてみましょう。

| ステート容量測定 | 200M / [[glossary/CPSB|CPSB]] = 1,530 [[glossary/Glamsterdam|グラムステルダム]] | 3秒伝播下の[[glossary/EIP-8372|EIP-8372]]調整済み構成 |
| --- | --- | --- |
| ブロックあたりの最大計測ステートバイト数 | 130,719 | 98,046 |
| [[glossary/gas-target|ガス目標]]に対応するステートバイト数 | 65,359 | 49,023 |
| 目標における年間成長率 | 約160 GiB/年 | 約120 GiB/年 |

[[glossary/Glamsterdam|グラムステルダム]]参照と比較して、最大[[glossary/State-bytes|ステートバイト]]容量は約25%低いため、各バイトは利用可能な[[glossary/State-capacity|ステート容量]]の約3分の1多くを消費します。**この違いは、意図された年間成長予算を約160 GiBから120 GiBに削減したことに由来し、追加の[[glossary/EIP-8372|EIP-8372]][[glossary/demand-calibration-scale|需要校正スケール]]によるものではありません。** 同じ[[glossary/State-growth-target|ステート成長目標]]を持つ[[glossary/EIP-8368|EIP-8368]]スタイルの構成は、ほぼ同じバイト容量を持ちます。

#### コードデプロイメントチェック

[[glossary/EIP-7954|EIP-7954]]の下での最大デプロイ済み[[glossary/runtime-code|ランタイムコード]]サイズに、仮定された120バイトの[[glossary/account-creation-contribution|アカウント作成貢献]]を加えた64 KiBの[[glossary/runtime-code|ランタイムコード]]を含むデプロイメントを考えます。トランザクションによって追加の[[glossary/State|ステート]]は作成されません。

z\_{\\mathrm{deployment}} = 65{,}536+120 = 65{,}656\\text{ bytes}.

調整された3秒構成でのその[[glossary/State-capacity-requirement|ステート容量要件]]は、おおよそ次のとおりです。

\\frac{65{,}656}{98{,}046} \\approx67.0\\%.

したがって、デプロイメントはモデル化された[[glossary/State-gas-budget|ステートガス予算]]内に収まりますが、約49,023バイトの目標を超過します。

#### 相対価格と実現されたステート成長

集計[[glossary/demand-model|需要モデル]]では、[[glossary/State-bytes|ステートバイト]]のコストはcbであり、通常の[[glossary/Execution-gas|実行ガス]]の1単位のコストはbです。`[[glossary/CPSB|CPSB]]`が大きいほど、[[glossary/State|ステート]]は**[[glossary/Execution|実行]]に対してより高価になります**が、[[glossary/State-bytes|ステートバイト]]あたりの[[glossary/ETH|ETH]]コストにはつながりません。

3秒の[[glossary/propagation-time|伝播時間]]を持つ構成では、

cb = 20{,}538{,}083\\times88.22 \\approx1.812\\times10^9\\text{ wei per byte} = 1.812\\text{ gwei per byte}.

大きな[[glossary/gas-coefficient|ガス係数]]は、低い均衡[[glossary/base-fee|ベースフィー]]と組み合わされています。

シミュレーションでは、この構成は年間約**88.1 GiB**を生成し、**73.4%の正規化された[[glossary/State-target-utilization|ステート目標利用率]]**に対応します。

## 付録: データ料金とブロブ料金

[[glossary/EIP-7999|EIP-7999]]の[[glossary/data-reserve|データリザーブ]]は、とりわけ、[[glossary/Rollup|ロールアップ]]が[[glossary/calldata|コールデータ]]の代わりに[[glossary/blob|ブロブ]]を使用するのを阻止することを目的としています。その[[glossary/activation-threshold|アクティベーション閾値]]は、[[glossary/blob-base-fee|ブロブベースフィー]]の1/12です。バイトあたり16[[glossary/gas|ガス]]で[[glossary/data-metering|データメータリング]]されると、対応する[[glossary/data-price|データ価格]]は、カウントされたバイトあたりの[[glossary/blob-price|ブロブ価格]]の4/3になります。これは、[[glossary/instantaneous-minimum-price-clamp|瞬間的な最低価格クランプ]]ではなく、[[glossary/fee-update-rule|手数料更新ルール]]を通じて機能します。

我々の[[https://ethresear.ch/t/when-data-binds-execution-dynamic-simulation-of-eip-7999-s-multidimensional-fee-market/26018|以前の分析]]では、将来の[[glossary/blob|ブロブ]]需要とその結果として生じる手数料パスが不確実であるため、このリザーブを省略しました。以下の表は、選択された構成の均衡[[glossary/data-charge|データ料金]]を、2025年12月29日の約3.3時間をカバーする1,000の履歴ブロックにおける平均[[glossary/blob-charge|ブロブ料金]]と比較したものです。

| ベンチマーク | 伝播時間 | 構成 | カウントされたバイトあたりのガス | 均衡ベースフィー | バイトあたりのデータ料金 |
| --- | --- | --- | --- | --- | --- |
| ベースライン一次元 | 3.0秒 | 359.6M共通制限 | 64 | 86,981 [[glossary/wei|wei]] | 5,566,770 [[glossary/wei|wei]] |
| フロア調整済み + [[glossary/EIP-8368|EIP-8368]] | 3.0秒 | 534.0M共通制限 | 96 | 332,742 [[glossary/wei|wei]] | 31,943,270 [[glossary/wei|wei]] |
| フロア調整済み + [[glossary/EIP-8372|EIP-8372]] | 3.0秒 | 534.0M共通制限 | 96 | 88.22 [[glossary/wei|wei]] | 8,469 [[glossary/wei|wei]] |
| [[glossary/EIP-7999|EIP-7999]]履歴アンカー | 4.0秒 | E225/D60 | 16 | 73.06 [[glossary/wei|wei]] | 1,169 [[glossary/wei|wei]] |
| [[glossary/EIP-7999|EIP-7999]]最大スループット (3秒) | 3.0秒 | E300/D67.5 | 16 | 46.42 [[glossary/wei|wei]] | 743 [[glossary/wei|wei]] |
| 履歴[[glossary/blob|ブロブ]]: サンプル平均 | — | 1,000履歴ブロック | 1 | — | 3,959,687 [[glossary/wei|wei]] |

表示されているベースラインおよび[[glossary/EIP-8368|EIP-8368]]構成の場合、[[glossary/State-controlled-shared-fees|ステート制御された共有手数料]]により、フロア価格の[[glossary/calldata|コールデータ]]はサンプリングされた平均[[glossary/blob-price|ブロブ価格]]よりも高くなります。[[glossary/EIP-8372|EIP-8372]]の再調整は共有手数料を大幅に引き下げ、[[glossary/calldata|コールデータ]]をこの履歴参照よりもはるかに安価にします。選択された[[glossary/EIP-7999|EIP-7999]]構成は、さらに低い[[glossary/data-charge|データ料金]]を持っています。

今日の[[glossary/blob-fee|ブロブ手数料]]では、[[glossary/EIP-7999|EIP-7999]]のリザーブを有効にすると、閾値以下の[[glossary/data-fee|データ手数料]]は使用量に応じてリザーブ閾値に向かって上昇することになります。[[glossary/calldata|コールデータ]]と[[glossary/Runtime-block-level-access-lists|BAL]]は[[glossary/data-base-fee|データベースフィー]]を共有するため、これにより[[glossary/Runtime-block-level-access-lists|BAL]]料金も増加し、[[glossary/BAL-producing-activity|BAL生成アクティビティ]]を制約する可能性があります。

これは、[[glossary/EIP-8372|EIP-8372]]と[[glossary/EIP-7999|EIP-7999]]にとっての設計上の疑問を提起します。[[glossary/Execution-scaling|実行スケーリング]]は、[[glossary/blob|ブロブ]]、[[glossary/calldata|コールデータ]]、および[[glossary/Runtime-block-level-access-lists|BAL]]の[[glossary/relative-price|相対価格]]とどのように相互作用すべきでしょうか？安価な[[glossary/calldata|コールデータ]]を許可すると、[[glossary/Rollup-demand|ロールアップ需要]]を引き付け、[[glossary/payload-capacity|ペイロード容量]]の競争を激化させる可能性があります。[[glossary/blob-linked-reserve|ブロブリンクされたリザーブ]]を維持すると、その[[glossary/substitution|代替]]は阻止されますが、[[glossary/EIP-7999|EIP-7999]]の下では[[glossary/BAL-producing-activity|BAL生成アクティビティ]]のコストも上昇します。したがって、[[glossary/transaction-content|トランザクションコンテンツ]]と[[glossary/Runtime-block-level-access-lists|BAL]]が同じリザーブ処理を受けるべきかどうかは調査に値します。

*2 posts - 2 participants*

[Read full topic](https://ethresear.ch/t/post-glamsterdam-one-dimensional-fee-market-and-comparison-with-eip-7999/26062)
