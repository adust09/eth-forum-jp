---
title: EIP-7999の多次元手数料市場における均衡：実行-データ手数料フロアのフロンティア
original_title: >-
  Equilibrium in EIP-7999’s Multidimensional Fee Market: The Execution–Data
  Fee-Floor Frontier
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/equilibrium-in-eip-7999-s-multidimensional-fee-market-the-execution-data-fee-floor-frontier/25868
author: M1kuW1ll
date: '2026-08-31'
category: Economics
tags:
  - economics
  - fee-market
  - execution-layer
  - data-availability
  - protocol-design
  - gas
  - research
  - eip
  - state-management
topic_id: '25868'
translated_at: '2026-09-02'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Equilibrium in EIP-7999’s Multidimensional Fee Market: The Execution–Data Fee-Floor Frontier](https://ethresear.ch/t/equilibrium-in-eip-7999-s-multidimensional-fee-market-the-execution-data-fee-floor-frontier/25868) — M1kuW1ll (2026-08-31)

*Fei Wu 著 - この研究はEFでのインターンシップ中に行われました。貴重な議論、フィードバック、コメントをくださったメンターの@misilva73に感謝いたします。*

## 概要

[[glossary/EIP-7999|EIP-7999]]の下では、[[glossary/execution-layer|実行]]、[[glossary/data-availability|データ]]、[[glossary/state-management|ステート]]はそれぞれ異なる[[glossary/gas|ガス]]ターゲット、制限、および[[glossary/fee-market|ベースフィー]]を持ちます。これらのリソース市場は、それにもかかわらず結合しています。[[glossary/Runtime-BAL|ランタイムブロックレベルアクセスリスト (BAL)]]は[[glossary/data-gas|データガス]]を消費しますが、それらは[[glossary/execution-layer|実行]]と[[glossary/state-management|ステート]]のアクティビティによって生成されます。この[以前の分析](https://ethresear.ch/t/data-metering-bal-decomposition-and-bundle-pricing-under-eip-7999/25747)では、より高い[[glossary/data-base-fee|データベースフィー]]が、それらの親アクティビティのBALを含む価格を上昇させ、[[glossary/execution-layer|実行]]と[[glossary/state-management|ステート]]の需要を減少させ、ひいてはそれらが生成するBALを減少させるとモデル化しました。

この分析では、3つのリソース次元における結果として生じる共同均衡を解きます。各リソースについて、均衡は、使用量が少なくとも1 [[glossary/wei|wei]]の[[glossary/base-fee|ベースフィー]]でそのターゲットに達するか、または[[glossary/base-fee|ベースフィー]]が1 [[glossary/wei|wei]]の最小値に達し、リソースが不足するかのいずれかを必要とします。まず、[[glossary/execution-layer|実行]]、[[glossary/data-availability|データ]]、[[glossary/state-management|ステート]]の提案されたターゲットの組み合わせに対して、すべてのターゲットをクリアする均衡が存在するかどうかを検討します。ターゲットを満たす計算が1 [[glossary/wei|wei]]未満の[[glossary/execution-base-fee|実行ベースフィー]]を必要とする場合、そのターゲットの組み合わせは共同でサポートできません。その代わりに、[[glossary/execution-layer|実行]]は[[glossary/fee-floor|手数料フロア]]に拘束され、設定されたターゲットを下回って落ち着きます。

[![各リソースのモデル化方法を示すフローチャート。実行とステートの需要は、ランタイムBALデータ料金を含む親価格に反応します。実現された親アクティビティは、実行ガス、ステートガス、およびランタイムBALを決定します。その後、静的データとランタイムBALが組み合わされて、総データガス使用量となります。3つのリソース市場は、ターゲットクリアリング条件と1weiの最小条件を共同で満たします。](https://ethresear.ch/uploads/default/optimized/3X/b/c/bc90bb24365f38dd8b81d2349c7b58dd678045de_2_690x132.png)](https://ethresear.ch/uploads/default/original/3X/b/c/bc90bb24365f38dd8b81d2349c7b58dd678045de.png "bal_bundle_pricing_mechanism")

> 各リソースのモデル化方法を示すフローチャート。[[glossary/execution-layer|実行]]と[[glossary/state-management|ステート]]の需要は、[[glossary/Runtime-BAL|ランタイムBAL]]データ料金を含む親価格に反応します。実現された親アクティビティは、[[glossary/execution-gas|実行ガス]]、[[glossary/state-gas|ステートガス]]、および[[glossary/Runtime-BAL|ランタイムBAL]]を決定します。その後、静的データと[[glossary/Runtime-BAL|ランタイムBAL]]が組み合わされて、総[[glossary/data-gas|データガス]]使用量となります。3つのリソース市場は、ターゲットクリアリング条件と1[[glossary/wei|wei]]の最小条件を共同で満たします。

この条件は、[[glossary/execution-data-target-space|実行/データターゲット空間]]における[[glossary/execution-clearing-boundary|実行クリアリング境界]]を定義します。この境界は、2つの同等な容量設計の問いに答えます。

-   **特定の[[glossary/data-target|データターゲット]]に対して、[[glossary/execution-base-fee|実行ベースフィー]]が1 [[glossary/wei|wei]]以上を維持しながら完全に利用できる最大の[[glossary/execution-target|実行ターゲット]]は何か？**
-   **特定の[[glossary/execution-target|実行ターゲット]]に対して、3つのリソースすべてがクリアするために必要な最小の[[glossary/data-target|データターゲット]]は何か？**

この分析は、[リソース弾力性とグラムステルダム均衡分析](https://ethresear.ch/VxOPJuk0RCuQ5nu144LQvQ)で確立されたリソース需要[[glossary/elasticity|弾力性]]と[[glossary/metering-multiplier|メータリング乗数]]を、[データメータリングとBAL需要レポート](https://ethresear.ch/_u9MS1v4SXW78xzUT6jDWQ)で確立された静的データメーター、[[glossary/Runtime-BAL|ランタイムBAL]]アンカー、およびBALを含む親価格モデルと組み合わせています。

結果は、最終的なプロトコル推奨事項ではなく、条件付き均衡ベンチマークとして機能します。これらは、モデル化された需要システムの下でどのパラメータの組み合わせが内部的に一貫しているかを特定し、動的分析の次の段階のための均衡動作点を提供します。

この投稿で提示された結果は、[このリポジトリ](https://github.com/M1kuW1ll/eip-7999-research/tree/main/notebooks/7999_equilibrium)から再現できます。特に明記しない限り、レポートは以下の参照パラメータ化を仮定しています。

-   中心的な[[glossary/elasticity|弾力性]]は、[[glossary/gas-limit|ガス制限]]増加イベント前後の35日間ウィンドウから導出されます。すなわち、$\epsilon_{\mathrm{execution}} = 0.121$, $\epsilon_{\mathrm{data}}=0.229$, $\epsilon_{\mathrm{state}} = 0.335$。
-   [[glossary/state-creating-transactions|ステート作成トランザクション]]からの共同生成された[[glossary/state-access|ステートアクセス]]は[[glossary/execution-activity|実行アクティビティ]]に従います。すなわち、$\lambda=0$。
-   [[glossary/execution-scaling|実行スケーリング]]に伴う[[glossary/state-access-intensity|ステートアクセス強度]]は変化しません。すなわち、$\rho_A=1$。
-   [[glossary/data-gas|データガス]]の[[glossary/blob-linked-reserve-price|ブロブリンクされたリザーブ価格]]は考慮されていません。

### 主な結果

1.  **[[glossary/execution-clearing-boundary|実行クリアリング境界]]は中心的な設計オブジェクトです。** 各[[glossary/data-target|データターゲット]]について、[[glossary/execution-base-fee|実行ベースフィー]]が1 [[glossary/wei|wei]]に達する前にクリアできる*最大の[[glossary/execution-target|実行ターゲット]]*を示します。参照パラメータ化では、15M、18M、22.5M、30M、45Mの[[glossary/data-target|データターゲット]]は、それぞれ約116.9M、131.8M、152.2M、182.2M、232.4Mに境界を配置します。
2.  **境界は構造的および[[glossary/elasticity-assumptions|弾力性仮定]]によって移動します。** テストされた36の$\lambda\times\rho_A\times$[[glossary/elasticity-window-specifications|弾力性ウィンドウ仕様]]全体で、最大[[glossary/execution-target|実行ターゲット]]は15Mの[[glossary/data-target|データターゲット]]で84.2Mから145.4M、45Mの[[glossary/data-target|データターゲット]]で135.9Mから288.8Mの範囲です。一般的なフロンティア全体では、[[glossary/elasticity-uncertainty|弾力性の不確実性]]が最大の変動要因です。ただし、300Mの[[glossary/execution-target|実行ターゲット]]が需要的に実現可能であるという条件の下では、残りの範囲は[[glossary/access-scaling-assumption|アクセススケーリング仮定]] $\rho_A$によって支配されます。
3.  **300Mの[[glossary/execution-target|実行ターゲット]]には、参照キャリブレーションの下で約77Mの[[glossary/data-target|データターゲット]]が必要です。** これは、固定された90Mの[[glossary/data-limit|データ制限]]の**85.5%**であり、その上に**13M**の余裕を残します。実現可能な仕様全体では、必要な[[glossary/data-target|データターゲット]]は**55.9Mから94.5M**の範囲であり、主に[[glossary/state-access-scaling-assumption|ステートアクセススケーリング仮定]] $\rho_A$によって駆動されます。
4.  **[[glossary/data-target|データターゲット]]要件は、[[glossary/execution-elasticity|実行弾力性]]に局所的に敏感です。** $\epsilon_{\mathrm{execution}}$の1%の相対的減少は、必要な[[glossary/data-target|データターゲット]]を**7.1%**増加させ、76.97Mから82.44Mになり、**1.98%**の減少で固定された90Mの制限を超えます。この反応は非線形であり、より大きな減少に対して急になります。[[glossary/static-data-elasticity|静的データ弾力性]]は境界を逆方向に、より弱く移動させます。
5.  **境界を超えると、設定された[[glossary/execution-target|実行ターゲット]]は均衡から外れます。** [[glossary/execution-base-fee|実行ベースフィー]]が1 [[glossary/wei|wei]]に達すると、他のターゲットとパラメータを固定したまま、設定された[[glossary/execution-target|実行ターゲット]]をさらに増加させても、実現される[[glossary/execution-layer|実行]]、BAL、および[[glossary/data-base-fee|データベースフィー]]は変化せず、[[glossary/execution-utilization|実行利用率]]が減少します。

## モデル入力とBALを含む需要

以下のすべてのターゲットと[[glossary/gas|ガス]]量はブロックあたりです。[[glossary/base-fee|ベースフィー]]は、対応する[[glossary/EIP-7999-gas|EIP-7999ガス]]単位あたりの[[glossary/wei|wei]]単位価格です。BALを含む親価格とBAL料金は、履歴的な親アクティビティ単位あたりの価格です。すべての式は価格を共通の単位で表現しており、表示される結果はそれらを[[glossary/wei|wei]]に変換しています。

上付き文字0は2026年2月から5月の履歴アンカーを示し、上付き文字*は均衡値を示します。

| 表記 | 意味 |
| --- | --- |
| $q_{\mathrm{execution}}, q_{\mathrm{state}}$ | ブロックあたりの履歴的な[[glossary/gas-equivalent-execution|ガス相当実行]]および[[glossary/state-activity|ステートアクティビティ]] |
| $g_{\mathrm{static}}, g_{\mathrm{BAL}}$ | ブロックあたりの[[glossary/static-data|静的データ]]および[[glossary/Runtime-BAL|ランタイムBAL]]データ[[glossary/gas|ガス]] |
| $b_i, m_i, \epsilon_i$ | リソースiの[[glossary/base-fee|ベースフィー]]、[[glossary/metering-multiplier|メータリング乗数]]、および[[glossary/own-price-elasticity|自己価格弾力性]] |
| $P_{\mathrm{execution}}, P_{\mathrm{state}}$ | 履歴的な親アクティビティ単位あたりのBALを含む親価格 |
| $T_i, u_i, b_{\min}$ | [[glossary/gas-target|ガスターゲット]]、[[glossary/counterfactual-gas-used|反実仮想ガス使用量]]、および1[[glossary/wei|wei]]の[[glossary/fee-minimum|手数料最小値]] |
| $w_{\mathrm{execution}}, w_{\mathrm{state}}$ | 履歴的な親アクティビティ単位あたりに生成されるBALデータ[[glossary/gas|ガス]] |
| $\lambda, \rho_A$ | 維持される[[glossary/co-produced-BAL-routing|共同生成BALルーティング]]および[[glossary/access-scaling-sensitivity|アクセススケーリング感度]] |

履歴的な共通価格アンカーは、$p^0=0.106928$ [[glossary/gwei|gwei]]/履歴[[glossary/gas-equivalent-unit|ガス相当単位]]です。参照入力は以下の通りです。

| リソース | ブロックあたりの履歴量 | ブロックあたりの[[glossary/EIP-7999-gas-anchor|EIP-7999ガスアンカー]] | [[glossary/metering-multiplier|メータリング乗数]] | 35日間の[[glossary/elasticity|弾力性]] |
| --- | --- | --- | --- | --- |
| [[glossary/execution-layer|実行]] | 23.942M | 36.821M | 1.537898 | 0.121160 |
| [[glossary/static-data|静的データ]] | 1.181M | 2.133559M | 1.807251 | 0.229476 |
| [[glossary/state-management|ステート]] | 5.244M | 29.663M | 5.656315 | 0.334864 |
| [[glossary/Runtime-BAL|ランタイムBAL]] | — | 1.919100M | — | — |

個々の[[glossary/cost-equivalent-base-fee-anchors|コスト相当ベースフィーアンカー]] $p^0/m_i$ は会計参照として機能します。これらすべてを同時に適用しても、[[glossary/EIP-7999|EIP-7999]]の均衡は再現されません。正のBAL料金は、[[glossary/execution-layer|実行]]と[[glossary/state-management|ステート]]の親価格を履歴的な共通価格アンカーよりも高くします。

分析で使用される各リソースの中心的な[[glossary/elasticity|弾力性]]は、[[glossary/gas-limit-increase-events|ガス制限増加イベント]]前後の35日間ウィンドウから導出されます。残りのウィンドウは、均衡が[[glossary/elasticity-estimate|弾力性推定値]]によってどのように変化するかを示しています。

| イベントウィンドウ | $\epsilon_{\mathrm{execution}}$ | $\epsilon_{\mathrm{data}}$ | $\epsilon_{\mathrm{state}}$ |
| --- | --- | --- | --- |
| 21日間 | 0.117067 | 0.201790 | 0.478438 |
| 35日間 | 0.121160 | 0.229476 | 0.334864 |
| 60日間 | 0.081668 | 0.204691 | 0.279676 |
| 75日間 | 0.078511 | 0.201391 | 0.253556 |

### ステートガスターゲットとデータガス制限

|  | ターゲット | 制限 | 意味 |
| --- | --- | --- | --- |
| [[glossary/state-management|ステート]] | 75M | — | [[glossary/EIP-8037|EIP-8037]]で指定された[[glossary/CPSB|CPSB]] = 1530で年間120GiBの[[glossary/state-growth|ステート成長]] |
| [[glossary/data-availability|データ]] | 変動 | 90M | 最悪の場合で約3秒で伝播可能な5.364 MiBの[[glossary/metered-data|計測データ]] |
| [[glossary/execution-layer|実行]] | 300Mまで変動 | ターゲット $\times2$ | [[glossary/EIP-7999|EIP-7999]]で現在600Mの制限を目標に、可能な限りスケールアップ |

[[glossary/state-management|ステート]]にはターゲットがありますが、厳密な制限はありません。[[glossary/EIP-8037|EIP-8037]]で指定されているように、ターゲット[[glossary/state-growth|ステート成長]]は年間120 GiBです。`[[glossary/CPSB|CPSB]] = 1530`の場合、これはブロックあたり75Mの[[glossary/state-gas-target|ステートガスターゲット]]に相当します。

この反実仮想的な演習では、[[glossary/data-gas-limit|データガス制限]]は90Mに固定されています。1バイトあたり16[[glossary/data-gas|データガス]]と仮定すると、これは最悪のブロックで5.364 MiBの[[glossary/metered-data|計測データ]]に相当します。[[glossary/Runtime-BAL|ランタイム計測BAL]]を[[glossary/RLP|RLP]]エンコードされたオブジェクトに置き換えると、[以前のデータメータリング分析](https://ethresear.ch/t/data-metering-bal-decomposition-and-bundle-pricing-under-eip-7999/25747)で述べられているように、マッチしたサンプルで約0.0127 MiBが追加されます。@Nero_ethの[伝播分析](https://github.com/nerolation/glamsterdam-worst-case-block-size/blob/dc18ca1d1ee99899a3f832e474ff3504d48600dd/payload_propagation.ipynb)における[[glossary/MEV-Boost|MEV-Boost]]ブロックの経験的p90フィットに基づくと、$\text{propagation time (ms)} \approx 0.443 \frac{\text{ms}}{\text{KiB}} \times \text{payload size} + 569\text{ms}$。したがって、最悪のブロックは約3秒で伝播できます。ペイロードサイズと伝播安全性の関係は、[このコード](https://github.com/M1kuW1ll/eip-7999-research/blob/53d2a8a36427245d54b184b294a46a15385bca22/notebooks/bandwidth-limit-scenarios.ipynb)で再現できます。

### ランタイムBALの生成

[以前のデータメータリング分析](https://ethresear.ch/t/data-metering-bal-decomposition-and-bundle-pricing-under-eip-7999/25747)と同様に、ランタイム分解は3つのシェアを測定します。

$d=0.113937, \qquad c=0.378791, \qquad n=0.507272,$

ここで、$d$は[[glossary/state-creation-linked-BAL|ステート作成に直接リンクされたBAL]]、$c$は[[glossary/state-creating-transactions|ステート作成トランザクション]]によって共同生成される[[glossary/access-related-BAL|アクセス関連BAL]]、$n$は[[glossary/no-observed-state-creation-transactions|ステート作成が観測されないトランザクション]]からのBALです。

ルーティングパラメータ$\lambda$は維持されるモデリング仮定です。参照リソースベースの仕様では、$\lambda=0$です。[[glossary/directly-state-creation-related-BAL|直接ステート作成関連BAL]]は[[glossary/state-activity|ステートアクティビティ]]に従い、その他の[[glossary/access-related-BAL|アクセス関連BAL]]は[[glossary/execution-access-activity|実行/アクセスアクティビティ]]に付随します。値$\lambda\in\{0.5,1\}$は[[glossary/structural-coupling-sensitivities|構造的結合感度]]として機能します。

$R_{\mathrm{execution}} =\frac{q_{\mathrm{execution}}}{q_{\mathrm{execution}}^0}$とします。

[[glossary/execution-linked-BAL|実行リンクされたBAL]]、その平均強度、および総BALは次のとおりです。

$\begin{aligned} g_{\mathrm{BAL,execution}} &=w_{\mathrm{execution}}(\lambda)q_{\mathrm{execution}}^0 R_{\mathrm{execution}}^{\rho_A},\\\\ \bar w_{\mathrm{execution}} &=w_{\mathrm{execution}}(\lambda) R_{\mathrm{execution}}^{\rho_A-1},\\\\ g_{\mathrm{BAL}} &=g_{\mathrm{BAL,execution}} +w_{\mathrm{state}}(\lambda)q_{\mathrm{state}}. \end{aligned}$

$\lambda=0$の場合、$w_{\mathrm{execution}}=0.071023$ [[glossary/data-gas|データガス]]/履歴[[glossary/execution-unit|実行単位]]、$w_{\mathrm{state}}=0.041695$ [[glossary/data-gas|データガス]]/履歴[[glossary/state-unit|ステート単位]]です。参照値$\rho_A=1$は[[glossary/execution-linked-BAL-intensity|実行リンクされたBAL強度]]（[[glossary/state-access-intensity|ステートアクセス強度]]）を一定に保つため、総[[glossary/execution-linked-BAL|実行リンクされたBAL]]は[[glossary/execution-layer|実行]]に比例して増加します。1未満または1を超える値は、[[glossary/execution-layer|実行]]が拡大するにつれて[[glossary/access-intensity|アクセス強度]]が減少または増加することを可能にします。

### 親需要曲線

親価格は次のとおりです。

$P_{\mathrm{execution}} =m_{\mathrm{execution}}b_{\mathrm{execution}} +\bar w_{\mathrm{execution}}b_{\mathrm{data}}, \qquad P_{\mathrm{state}} =m_{\mathrm{state}}b_{\mathrm{state}} +w_{\mathrm{state}}b_{\mathrm{data}}.$

> $\rho_A\neq1$の場合、これは[[glossary/average-cost-reduced-form|平均コスト削減形式]]です。平均BAL強度$\bar w_{\mathrm{execution}}$は実現された[[glossary/execution-layer|実行]]に依存するため、[[glossary/execution-demand-equation|実行需要方程式]]は暗黙的になり、限界BAL強度は$\rho_A\bar w_{\mathrm{execution}}$となります。平均強度と限界強度は$\rho_A=1$の場合に一致します。

各親価格には、アクティビティ自身の[[glossary/metered-charge|計測料金]]と、それに割り当てられた平均[[glossary/Runtime-BAL|ランタイムBAL]]料金が含まれます。[[glossary/static-transaction-data|静的トランザクションデータ]]およびその他の[[glossary/cross-resource-charges|クロスリソース料金]]は親価格の範囲外です。

独立した[[glossary/isoelastic-demand-curves|等弾力性需要曲線]]は、BALを含む親価格で評価されます。

$q_{\mathrm{execution}} =q_{\mathrm{execution}}^0 \left(\frac{P_{\mathrm{execution}}}{p^0}\right)^{-\epsilon_{\mathrm{execution}}}, q_{\mathrm{state}} =q_{\mathrm{state}}^0 \left(\frac{P_{\mathrm{state}}}{p^0}\right)^{-\epsilon_{\mathrm{state}}},\\\\ g_{\mathrm{static}} =g_{\mathrm{static}}^0 \left( \frac{m_{\mathrm{data,static}}b_{\mathrm{data}}}{p^0} \right)^{-\epsilon_{\mathrm{data}}}.$

## 均衡と最小手数料条件

[[glossary/EIP-7999|EIP-7999]]の下での各リソースの反実仮想[[glossary/gas|ガス]]使用量は次のとおりです。

$u_{\mathrm{execution}}=m_{\mathrm{execution}}q_{\mathrm{execution}}, \quad u_{\mathrm{state}}=m_{\mathrm{state}}q_{\mathrm{state}}, \quad u_{\mathrm{data}}=g_{\mathrm{static}}+g_{\mathrm{BAL}}.$

各リソース $i\in\{\mathrm{execution},\mathrm{data},\mathrm{state}\}$ について、均衡は以下を満たします。

$b_i\ge b_{\min}, \quad u_i\le T_i, \quad (b_i-b_{\min})(T_i-u_i)=0, \quad b_{\min}=1\text{ wei}.$

これらの条件は、[[glossary/base-fee|ベースフィー]]が1 [[glossary/wei|wei]]を厳密に上回るリソースはそのターゲットを満たさなければならず、一方、不足しているリソースは正確に1 [[glossary/wei|wei]]の[[glossary/base-fee|ベースフィー]]を持たなければならないことを意味します。境界ケース $b_i=b_{\min}$ および $u_i=T_i$ も実現可能です。

提案されたターゲットベクトルが共同でサポート可能であるかどうかを判断するために、まず3つのリソースすべてがターゲットを満たす候補均衡を構築します。[[glossary/execution-layer|実行]]と[[glossary/state-management|ステート]]のターゲットは、必要なBALを含む親価格を決定します。

$P_{\mathrm{execution}}^\* =p^0\left( \frac{m_{\mathrm{execution}}q_{\mathrm{execution}}^0} {T_{\mathrm{execution}}} \right)^{1/\epsilon_{\mathrm{execution}}}, \quad P_{\mathrm{state}}^\* =p^0\left( \frac{m_{\mathrm{state}}q_{\mathrm{state}}^0} {T_{\mathrm{state}}} \right)^{1/\epsilon_{\mathrm{state}}}.$

この候補では、

$R_{\mathrm{execution}}^\* = \frac{ T_{\mathrm{execution}} }{ m_{\mathrm{execution}}q_{\mathrm{execution}}^0 }, $

そして、[[glossary/full-execution-and-state-utilization|完全な実行とステートの利用]]で生成される[[glossary/Runtime-BAL|ランタイムBAL]]は、

$g_{\mathrm{BAL,full}} = w_{\mathrm{execution}}q_{\mathrm{execution}}^0 \left( R_{\mathrm{execution}}^\* \right)^{\rho_A} + w_{\mathrm{state}} \frac{ T_{\mathrm{state}} }{ m_{\mathrm{state}} }.$

したがって、[[glossary/static-data|静的データ]]に利用可能な残りの[[glossary/data-target-capacity|データターゲット容量]]は、

$T_{\mathrm{data}}-g_{\mathrm{BAL,full}}.$

[[glossary/data-target|データターゲット]]をクリアする有限の[[glossary/data-base-fee|データベースフィー]]には、

$T_{\mathrm{data}}>g_{\mathrm{BAL,full}}$

が必要です。この不等式を条件として、必要なクリアリングフィーは、

$b_{\mathrm{data}}^{\mathrm{clear}} = \frac{p^0}{m_{\mathrm{data,static}}} \left( \frac{ g_{\mathrm{static}}^0 }{ T_{\mathrm{data}}-g_{\mathrm{BAL,full}} } \right)^{1/\epsilon_{\mathrm{data}}}.$

$b_{\mathrm{data}}^\*=b_{\mathrm{data}}^{\mathrm{clear}}$と設定すると、親価格の会計同一性は以下を意味します。

$b_{\mathrm{execution}}^\* = \frac{P_{\mathrm{execution}}^\* - \bar w_{\mathrm{execution}} \! \left(R_{\mathrm{execution}}^\*\right) b_{\mathrm{data}}^{\mathrm{clear}} }{m_{\mathrm{execution}}}, \quad b_{\mathrm{state}}^\* = \frac{P_{\mathrm{state}}^\* - w_{\mathrm{state}} b_{\mathrm{data}}^{\mathrm{clear}} }{ m_{\mathrm{state}} }.$

すべてのターゲットを満たす候補は、以下の条件をすべて満たす場合にのみ実現可能です。

$T_{\mathrm{data}}>g_{\mathrm{BAL,full}}, \quad b_{\mathrm{data}}^{\mathrm{clear}}\ge b_{\min}, \quad b_{\mathrm{execution}}^\* \ge b_{\min}, \quad b_{\mathrm{state}}^\* \ge b_{\min}.$

以下で研究されるパラメータ範囲では、[[glossary/data-and-state-fee-floor-conditions|データとステートの手数料フロア条件]]は満たされたままです。したがって、関連する実現可能性の喪失は、暗示される[[glossary/execution-base-fee|実行ベースフィー]]が1 [[glossary/wei|wei]]の最小値に達したときに発生します。

## 実行クリアリング境界と容量レジーム

固定された[[glossary/data-target|データターゲット]]において、[[glossary/execution-target|実行ターゲット]]を増加させると、2つの相乗効果が生じます。第一に、より多くの[[glossary/execution-demand|実行需要]]をサポートするには、より低いBALを含む[[glossary/execution-price|実行価格]] $P_{\mathrm{execution}}^\*$ が必要です。第二に、より多くの[[glossary/execution-activity|実行アクティビティ]]はより多くの[[glossary/Runtime-BAL|ランタイムBAL]]を生成し、[[glossary/static-data|静的データ]]に利用可能な[[glossary/data-target|データターゲット]]を減らし、それによって[[glossary/data-base-fee|データベースフィー]]を増加させます。より高いBAL料金は、より低い親価格のより大きなシェアを吸収し、両方向から[[glossary/execution-base-fee|実行ベースフィー]]を圧縮します。

**[[glossary/execution-clearing-boundary|実行クリアリング境界]]**は、[[glossary/execution-base-fee|実行ベースフィー]]が1 [[glossary/wei|wei]]以上を維持しながら完全に利用できる最大の[[glossary/execution-target|実行ターゲット]]です。言い換えれば、特定の[[glossary/execution-target|実行ターゲット]]に対して、[[glossary/full-execution-utilization|完全な実行利用]]をサポートするために必要な最小の[[glossary/data-target|データターゲット]]を示します。

少なくとも1 [[glossary/wei|wei]]の[[glossary/execution-base-fee|実行ベースフィー]]と互換性のある最高の[[glossary/data-base-fee|データベースフィー]]は、

$b_{\mathrm{data}}^{\max} =\frac{ P_{\mathrm{execution}}^\*-m_{\mathrm{execution}}b_{\min} }{\bar w_{\mathrm{execution}}(R_{\mathrm{execution}}^\*)}.$

[[glossary/data-and-state-fee|データとステートの手数料]]が1 [[glossary/wei|wei]]の最小値を上回り、かつ

$P_{\mathrm{execution}}^\* > m_{\mathrm{execution}}b_{\min},$

である場合、[[glossary/execution-target|実行ターゲット]]は以下の場合にのみサポート可能です。

$b_{\mathrm{execution}}^\* \ge b_{\min} \quad \Longleftrightarrow \quad b_{\mathrm{data}}^{\mathrm{clear}} \le b_{\mathrm{data}}^{\max}.$

[[glossary/static-data-demand-curve|静的データ需要曲線]]を代入し、[[glossary/data-target|データターゲット]]について解くと、[[glossary/execution-clearing-frontier|実行クリアリングフロンティア]]が得られます。

$b_{\mathrm{execution}}^\* \ge b_{\min} \quad \Longleftrightarrow \quad T_{\mathrm{data}} \ge T_{\mathrm{data}}^{\mathrm{frontier}} \! \left(T_{\mathrm{execution}}\right),$

ここで、

$T_{\mathrm{data}}^{\mathrm{frontier}} = g_{\mathrm{BAL,full}} + g_{\mathrm{static}}^0 \left( \frac{ m_{\mathrm{data,static}}b_{\mathrm{data}}^{\max} }{ p^0 } \right)^{-\epsilon_{\mathrm{data}}}.$

結果として生じる3つのレジームは次のとおりです。

$\begin{aligned} T_{\mathrm{data}} &> T_{\mathrm{data}}^{\mathrm{frontier}} &&\Longrightarrow& b_{\mathrm{execution}}^\* &> 1\text{ wei}, \\\[3pt] T_{\mathrm{data}} &= T_{\mathrm{data}}^{\mathrm{frontier}} &&\Longrightarrow& b_{\mathrm{execution}}^\* &= 1\text{ wei}, \quad u_{\mathrm{execution}}=T_{\mathrm{execution}}, \\\[3pt] T_{\mathrm{data}} &< T_{\mathrm{data}}^{\mathrm{frontier}} &&\Longrightarrow& b_{\mathrm{execution}}^\* &< 1\text{ wei} \quad\text{in the target-filling candidate.} \end{aligned}$

最後のケースは、すべてのターゲットを満たす均衡が実現不可能であることを意味します。なぜなら、それは1 [[glossary/wei|wei]]の最小値を下回る[[glossary/execution-base-fee|実行ベースフィー]]を必要とするからです。ここで研究されたパラメータ値では、[[glossary/execution-base-fee|実行ベースフィー]]は1 [[glossary/wei|wei]]に留まり、均衡ではターゲットが不足します。

[![ソリッドの赤い曲線は、正確な1wei実行クリアリング境界です。緑の点は3つのターゲットすべてをクリアし、赤い十字は実行フロア均衡です。星はペアになった比較可能性シナリオを示します。破線の灰色の線は、実行とステートが両方ともターゲットを満たした場合に生成されるランタイムBALです。星印は、データ/実行の履歴アクティビティが比例してスケーリングされるペアのシナリオを表します。](https://ethresear.ch/uploads/default/optimized/3X/5/1/515ba1ff0e7dac3fb56265c0c2a234d2272d7172_2_690x434.png)](https://ethresear.ch/uploads/default/original/3X/5/1/515ba1ff0e7dac3fb56265c0c2a234d2272d7172.png "bal_bundle_pricing_execution_floor_regime_2026-02-01_2026-06-01")

> ソリッドの赤い曲線は、正確な1[[glossary/wei|wei]][[glossary/execution-clearing-boundary|実行クリアリング境界]]です。緑の点は3つのターゲットすべてをクリアし、赤い十字は[[glossary/execution-floor-equilibria|実行フロア均衡]]です。星はペアになった比較可能性シナリオを示します。破線の灰色の線は、[[glossary/execution-layer|実行]]と[[glossary/state-management|ステート]]が両方ともターゲットを満たした場合に生成される[[glossary/Runtime-BAL|ランタイムBAL]]です。星印は、[[glossary/data-execution-historical-activity|データ/実行の履歴アクティビティ]]が比例してスケーリングされるペアのシナリオを表します。

粗いシナリオグリッドは、5つの[[glossary/data-target|データターゲット]]（15M、18M、22.5M、30M、45M）と、125Mから300Mまで25Mステップの[[glossary/execution-target|実行ターゲット]]を交差させます。

[[glossary/data-availability|データ]]と[[glossary/state-management|ステート]]はすべてのセルでターゲットをクリアします。

| [[glossary/data-target|データターゲット]] | 最大[[glossary/execution-target|実行ターゲット]] | 対応する[[glossary/execution-limit|実行制限]] | 境界での[[glossary/data-fee|データ手数料]] ([[glossary/wei|wei]] / [[glossary/data-gas|データガス]]) |
| --- | --- | --- | --- |
| 15.0M | 116.9M | 233.7M | 109.0k |
| 18.0M | 131.8M | 263.6M | 40.45k |
| 22.5M | 152.2M | 304.3M | 12.34k |
| 30.0M | 182.2M | 364.5M | 2.764k |
| 45.0M | 232.4M | 464.7M | 353.4 |

別の視点から見ると、125M、150M、200M、250M、300Mの[[glossary/execution-target|実行ターゲット]]は、16.6M、22.0M、34.9M、51.3M、77.0Mの[[glossary/data-target|データターゲット]]に1[[glossary/wei|wei]]境界を配置します。77.0Mという値は、表示されている1/2ターゲット比率を超える分析的な外挿です。

### 完全利用BALエンベロープ

$\lambda=0$, $\rho_A=1$、および固定された75Mの[[glossary/state-gas-target|ステートガスターゲット]]の場合、[[glossary/full-utilization-BAL-gas|完全利用BALガス]]は均衡において[[glossary/execution-gas-target|実行ガスターゲット]]に線形にスケールします。

$g_{\mathrm{BAL,full}} \simeq0.55\text{M}+0.046T_{\mathrm{execution}}.$

この線より上では、[[glossary/data-target|データターゲット]]には[[glossary/full-execution-and-state-utilization|完全な実行とステートの利用]]で生成されるBALの余地があります。この線上では、BALだけで[[glossary/data-target|データターゲット]]全体を満たします。この線より下では、[[glossary/full-parent-resource-utilization|完全な親リソース利用]]でのBALが[[glossary/data-target|データターゲット]]を超えます。

[[glossary/data-target|データターゲット]]がこの線より下であっても、[[glossary/data-market-equilibrium-base-fee|データ市場均衡ベースフィー]]は存在し得ます。なぜなら、より高い[[glossary/data-fee|データ手数料]]はBAL生成アクティビティを減少させ、総データ使用量がターゲットに達するまで調整されるからです。研究されたシナリオでは、[[glossary/execution-layer|実行]]は1[[glossary/wei|wei]]の最小[[glossary/base-fee|ベースフィー]]でターゲットを下回ったままとなり、[[glossary/data-availability|データ]]と[[glossary/state-management|ステート]]はターゲットをクリアします。言い換えれば、[[glossary/execution-layer|実行]]が設定されたターゲットを同時にクリアできない場合でも、[[glossary/data-availability|データ]]はターゲットをクリアできます。

1[[glossary/wei|wei]][[glossary/execution-boundary|実行境界]]は、テストされたどのパラメータ仕様においてもBALエンベロープよりも厳格です。なぜなら、正の[[glossary/static-data-demand|静的データ需要]]も、1[[glossary/wei|wei]]を超える[[glossary/execution-base-fee|実行ベースフィー]]の余地を残す[[glossary/data-base-fee|データベースフィー]]に収まる必要があるからです。

### ペアになったシナリオと比較可能性ベンチマーク

ペアになったシナリオは、総反実仮想[[glossary/data-gas|データガス]]と[[glossary/metered-execution-gas|計測実行ガス]]の履歴比率を一定に保つことで、[[glossary/floor-bound-regime|フロアバウンドレジーム]]を示しています。

$\kappa^0 =\frac{g_{\mathrm{static}}^0+g_{\mathrm{BAL}}^0} {m_{\mathrm{execution}}q_{\mathrm{execution}}^0} =0.11, \qquad T_{\mathrm{execution}}=\frac{T_{\mathrm{data}}}{\kappa^0}.$

| [[glossary/execution-target|実行ターゲット]] | [[glossary/data-target|データターゲット]] | レジーム | [[glossary/data-base-fee|データベースフィー]] ([[glossary/wei|wei]] / [[glossary/data-gas|データガス]]) | [[glossary/execution-target-fill|実行ターゲット充足率]] | [[glossary/BAL-share-of-data-target|データターゲットに占めるBALの割合]] |
| --- | --- | --- | --- | --- | --- |
| 136.3M | 15.0M | [[glossary/execution-at-1-wei|実行が1wei]] | 109.0k | 85.8% | 39.7% |
| 163.5M | 18.0M | [[glossary/execution-at-1-wei|実行が1wei]] | 40.5k | 80.6% | 36.9% |
| 204.4M | 22.5M | [[glossary/execution-at-1-wei|実行が1wei]] | 12.3k | 74.4% | 33.7% |
| 272.6M | 30.0M | [[glossary/execution-at-1-wei|実行が1wei]] | 2.76k | 66.9% | 29.9% |

テストされた4つのシナリオすべてが[[glossary/execution-clearing-boundary|実行クリアリング境界]]を下回っているため、それぞれ[[glossary/execution-underfills-at-1-wei|実行が1weiで不足する均衡]]に落ち着くことがわかります。これらのシナリオは、比較可能性ベンチマークとしてのみ機能します。

### 感度と堅牢性

1[[glossary/wei|wei]][[glossary/execution-boundary|実行境界]]は、$\lambda\in\{0,0.5,1\}$、$\rho_A\in\{0.75,1,1.25\}$、および21日、35日、60日、75日の[[glossary/elasticity-estimates|弾力性推定値]]の36の組み合わせすべてについて再計算されます。各計算では、[[glossary/data-and-state-targets|データとステートのターゲット]]を固定し、[[glossary/execution-base-fee|実行ベースフィー]]を1 [[glossary/wei|wei]]に設定し、完全に利用できる最大の[[glossary/execution-target|実行ターゲット]]を解きます。

[![左：300M実行ターゲットに必要な、各実現可能な仕様のデータターゲット（ソート済み）。各バーは21日と35日の弾力性ウィンドウにまたがり、色はρAを示し、各色内の行はλを示します。ひし形は参照仕様を示し、破線は90Mデータ制限を示します。右：参照要件がε_executionのみの減少にどのように反応するか、制限交差と300M均衡が存在しなくなる点を示します。](https://ethresear.ch/uploads/default/optimized/3X/0/a/0acb96cb9d54850e5a1065d5aa141be5819c48b4_2_659x499.png)](https://ethresear.ch/uploads/default/original/3X/0/a/0acb96cb9d54850e5a1065d5aa141be5819c48b4.png "bal_bundle_pricing_execution_frontier_sensitivity_2026-02-01_2026-06-01")

> 36の仕様すべてが75Mの[[glossary/data-target|データターゲット]]を介して有効な境界を持っています。90Mの[[glossary/data-target|データターゲット]]（[[glossary/data-limit|データ制限]]に等しい）では、36の仕様のうち17が1 [[glossary/wei|wei]]未満の[[glossary/data-fee|データ手数料]]を必要とし、代わりに両方の[[glossary/base-fee|ベースフィー]]を1 [[glossary/wei|wei]]に設定し、両方のリソースがターゲットを下回ります。

| [[glossary/data-target|データターゲット]] | 参照最大[[glossary/execution-target-boundary|実行ターゲット境界]] | 仕様全体での最大[[glossary/execution-target-range|実行ターゲット範囲]] |
| --- | --- | --- |
| 15.0M | 116.9M | 84.2M-145.4M |
| 18.0M | 131.8M | 91.8M-167.8M |
| 22.5M | 152.2M | 101.7M-198.2M |
| 30.0M | 182.2M | 115.7M-240.7M |
| 45.0M | 232.4M | 135.9M-288.8M |
| 60.0M | 271.0M | 146.4M-306.2M |
| 75.0M | 297.4M | 150.1M-319.2M |
| 90.0M (制限に等しい) | 312.5M | 159.8M-324.2M |

方向は、研究された拡張範囲で直接的な解釈を持ちます。$\rho_A$が大きいほど、[[glossary/execution-layer|実行]]が拡大するにつれてより多くの[[glossary/execution-linked-BAL|実行リンクされたBAL]]が生成され、サポート可能な[[glossary/execution-target|実行ターゲット]]が低下します。$\lambda$が大きいほど、[[glossary/co-produced-BAL|共同生成されたBAL]]が[[glossary/state-activity|ステートアクティビティ]]にシフトし、これらのシナリオでは[[glossary/execution-layer|実行]]よりも拡大が少ないため、境界が上昇します。

異なるウィンドウにおける[[glossary/elasticity-uncertainty|弾力性の不確実性]]は、パラメータ$\lambda$や$\rho_A$よりも[[glossary/execution-target-boundary|実行ターゲット境界]]に大きな影響を与えます。[[glossary/state-management|ステート]]は固定されたターゲットで内部に留まるため、$\epsilon_{\mathrm{state}}$は[[glossary/state-fee|ステート手数料]]のみを変更し、境界の移動は$\epsilon_{\mathrm{execution}}$と$\epsilon_{\mathrm{data}}$から生じます。

## 300Mの実行ターゲットに必要なデータ容量

[[glossary/execution-clearing-boundary|実行クリアリング境界]]を逆から読むと、次の質問をすることができます。**[[glossary/execution-target|実行ターゲット]]を300Mにスケールアップしたい場合、必要な最小の[[glossary/data-target|データターゲット]]は何か？**

まず、この質問に答えがあるかどうかは、[[glossary/demand-calibration|需要キャリブレーション]]に依存します。60日および75日の[[glossary/elasticity-vectors|弾力性ベクトル]]の下では、[[glossary/execution-demand|実行需要]]は、BALがデータ料金を一切負担しない場合でも、1[[glossary/wei|wei]][[glossary/execution-fee|実行手数料]]で300Mのターゲットに到達できません。対応する[[glossary/execution-target-ceilings|実行ターゲット上限]]はそれぞれ160.9Mと152.0Mです。以下の回答は、21日および35日の[[glossary/elasticity-calibrations|弾力性キャリブレーション]]に適用されます。

[![左：300M実行ターゲットに必要な、各実現可能な仕様のデータターゲット（ソート済み）。各バーは21日と35日の弾力性ウィンドウにまたがり、色はρAを示し、各色内の行はλを示します。ひし形は参照仕様を示し、破線は90Mデータ制限を示します。右：参照要件がε_executionのみの減少にどのように反応するか、制限交差と300M均衡が存在しなくなる点を示します。](https://ethresear.ch/uploads/default/optimized/3X/5/7/57d5a68a71194922ac83248d5b16ebb349a822c8_2_690x294.png)](https://ethresear.ch/uploads/default/original/3X/5/7/57d5a68a71194922ac83248d5b16ebb349a822c8.png "bal_bundle_pricing_300m_inverse_sensitivity_2026-02-01_2026-06-01")

> 左：300M[[glossary/execution-target|実行ターゲット]]に必要な、各実現可能な仕様の[[glossary/data-target|データターゲット]]（ソート済み）。各バーは21日と35日の[[glossary/elasticity-windows|弾力性ウィンドウ]]にまたがり、色は$\rho_A$を示し、各色内の行は$\lambda$を示します。ひし形は参照仕様を示し、破線は90M[[glossary/data-limit|データ制限]]を示します。右：参照要件が$\epsilon_{\mathrm{execution}}$のみの減少にどのように反応するか、[[glossary/limit-crossing|制限交差]]と300M均衡が存在しなくなる点を示します。

| [[glossary/elasticity-window|弾力性ウィンドウ]] | 参照 $\lambda=0, \rho_A=1$ | $\lambda, \rho_A$全体での[[glossary/data-target-range|データターゲット範囲]] |
| --- | --- | --- |
| 21日間 | 76.81M | 57.25M–93.33M |
| 35日間 | 76.97M | 55.89M–94.53M |
| 60日間 | 実現不可能 | — |
| 75日間 | 実現不可能 | — |

参照キャリブレーションの下では、答えは約**77M**です。21日および35日の[[glossary/elasticity-vectors|弾力性ベクトル]]に基づく18の実現可能な仕様全体で、最小[[glossary/data-target|データターゲット]]は**55.89Mから94.53M**の範囲です。

-   **下限の55.89M**は、35日ベクトルで$\lambda=1$かつ$\rho_A=0.75$の場合に得られます。この場合、[[glossary/co-produced-state-access|共同生成されたステートアクセス]]は[[glossary/state-demand|ステート需要]]に従い、[[glossary/state-access|ステートアクセス]]は[[glossary/execution-layer|実行]]に比例してサブプロポーショナルにスケールします。
-   **上限の94.53M**は、35日ベクトルで$\lambda=0$かつ$\rho_A=1.25$の場合に得られます。この場合、[[glossary/co-produced-state-access|共同生成されたステートアクセス]]は[[glossary/execution-demand|実行需要]]に従い、[[glossary/state-access|ステートアクセス]]は[[glossary/execution-layer|実行]]に比例してスーパープロポーショナルにスケールします。

$\rho_A$が大きいほど、[[glossary/execution-layer|実行]]が拡大するにつれてより多くの[[glossary/execution-linked-BAL|実行リンクされたBAL]]が生成され、$\lambda$が小さいほど、[[glossary/co-produced-access|共同生成されたアクセス]]が[[glossary/execution-parent|実行親]]に多く残ります（ここでは[[glossary/state-management|ステート]]よりも速く拡大します）。これら両方が、300Mの[[glossary/execution-layer|実行]]に必要な[[glossary/data-target|データターゲット]]を上昇させます。

90Mの[[glossary/data-gas-limit|データガス制限]]との比較：

$\frac{76.97}{90}=85.5\%, \qquad 90-76.97=13.03\text{M}.$

300Mの[[glossary/execution-target|実行ターゲット]]は、[[glossary/data-limit|データ制限]]の85.5%を*ターゲット*として消費し、その上に13.03Mの余裕を残します。境界は1[[glossary/wei|wei]][[glossary/execution-fee|実行手数料]]で定義されているため、厳密に内部の[[glossary/execution-fee|実行手数料]]には、その値ではなく、それよりも高い[[glossary/data-target|データターゲット]]が必要です。

従来のターゲット比率との比較：

| [[glossary/data-target|データターゲット]] / ターゲット比率 | 最大[[glossary/fully-utilized-execution-target|完全に利用される実行ターゲット]] |
| --- | --- |
| 45M / $\frac{1}{2}$ | 232.4M |
| 60M / $\frac{2}{3}$ | 271.0M |
| 75M / $\frac{5}{6}$ | 297.4M |
| 77M | 300M |
| 90M、フル制限 | 312.5M |

### 需要[[glossary/elasticity|弾力性]]によって境界がどれだけ移動するか

参照ベクトルは、$\epsilon_{\mathrm{execution}}=0.1212$, $\epsilon_{\mathrm{data}}=0.2295$, $\epsilon_{\mathrm{state}}=0.3349$であり、すべて35日間のイベントウィンドウからのものです。以下の各比較では、そのうちの1つを摂動させ、他の2つおよび他のすべての参照入力を固定します。

**[[glossary/execution-elasticity|実行弾力性]]。**

| 変化 | $\epsilon_{\mathrm{execution}}$ | 必要な[[glossary/data-target|データターゲット]] | 移動 |
| --- | --- | --- | --- |
| -3.0% | 0.11752 | 103.95M | +35.1% |
| -2.0% | 0.11874 | 90.24M | +17.2% |
| -1.0% | 0.11995 | 82.44M | +7.1% |
| -0.5% | 0.12055 | 79.51M | +3.3% |
| 参照 | 0.12116 | 76.97M | — |
| +0.5% | 0.12177 | 74.74M | -2.9% |
| +1.0% | 0.12237 | 72.75M | -5.5% |
| +2.0% | 0.12358 | 69.29M | -10.0% |
| +3.0% | 0.12479 | 66.35M | -13.8% |

$\epsilon_{\mathrm{execution}}$を減少させると、300Mの[[glossary/execution-target|実行ターゲット]]が徐々に実現不可能になることを示す3つの閾値があります。

-   1.98%の減少 — [[glossary/data-limit-crossing|データ制限交差]]。必要な[[glossary/data-target|データターゲット]]が想定される90Mの[[glossary/data-limit|データ制限]]を超えます。
-   3.88%の減少 — [[glossary/data-fee-floor|データ手数料フロア]]。90Mの制限がない場合でも、300Mの[[glossary/execution-layer|実行]]をサポートするには1 [[glossary/wei|wei]]未満の[[glossary/data-base-fee|データベースフィー]]が必要になります。したがって、[[glossary/execution-and-data-base-fees|実行とデータベースフィー]]の両方が1 [[glossary/wei|wei]]で下限が設定された、すべてのターゲットを満たす均衡は存在しません。
-   4.12%の減少 — [[glossary/execution-demand-ceiling|実行需要上限]]。この時点では、BALがデータ料金を負担しない場合でも300Mの[[glossary/execution-layer|実行]]はサポートできません。1[[glossary/wei|wei]][[glossary/execution-charge|実行料金]]だけで既に高すぎます。

反応は強く凸型です。参照点では、必要な[[glossary/data-target|データターゲット]]の$\epsilon_{\mathrm{execution}}$に関する局所[[glossary/log-elasticity|対数弾力性]]は-6.18です。この値は有限変化の非対称性を隠しています。$\epsilon_{\mathrm{execution}}$が1%増加すると、必要な[[glossary/data-target|データターゲット]]は5.5%減少し、一方1%減少すると7.1%増加します。
非対称性は参照点から離れるほど顕著になります。0.5%の減少は必要な[[glossary/data-target|データターゲット]]を3.3%増加させますが、3%の減少は35.1%増加させます。容量設計の場合、上記の実現可能性閾値は、単一の局所[[glossary/elasticity|弾力性]]よりも情報量が多いです。

**[[glossary/data-elasticity|データ弾力性]]。**

| 変化 | $\epsilon_{\mathrm{data}}$ | 必要な[[glossary/data-target|データターゲット]] | 移動 |
| --- | --- | --- | --- |
| -3.0% | 0.22259 | 70.94M | -7.8% |
| -2.0% | 0.22489 | 72.88M | -5.3% |
| -1.0% | 0.22718 | 74.89M | -2.7% |
| -0.5% | 0.22833 | 75.92M | -1.4% |
| 参照 | 0.22948 | 76.97M | — |
| +0.5% | 0.23062 | 78.04M | +1.4% |
| +1.0% | 0.23177 | 79.12M | +2.8% |
| +2.0% | 0.23407 | 81.35M | +5.7% |
| +3.0% | 0.23636 | 83.65M | +8.7% |

[[glossary/data-elasticity|データ弾力性]]はフロンティアを逆方向に、約半分の強度で移動させます。$\epsilon_{\mathrm{data}}$が1%増加すると、必要な[[glossary/data-target|データターゲット]]は2.8%増加しますが、$\epsilon_{\mathrm{execution}}$が1%増加すると5.5%減少します。$\epsilon_{\mathrm{data}}$に関する局所[[glossary/log-elasticity|対数弾力性]]は$+2.75$であり、反応はテスト範囲で線形に近いため、局所値は有限変化と密接に一致します。

正の符号には単純な説明があります。フロンティアでは、[[glossary/clearing-data-fee|クリアリングデータ手数料]]は[[glossary/anchor-equivalent-static-data-fee|アンカー相当静的データ手数料]]を下回っているため、[[glossary/static-data-demand|静的データ需要]]は既にそのアンカーに対して拡大しています。$\epsilon_{\mathrm{data}}$が大きいほど、需要はこの低い価格により強く反応し、[[glossary/static-data-usage|静的データ使用量]]が増加するため、300Mの[[glossary/execution-layer|実行]]をサポートするために必要な[[glossary/data-target|データターゲット]]も増加します。

**[[glossary/state-elasticity|ステート弾力性]]は境界をまったく移動させません。** [[glossary/state-management|ステート]]はそのターゲットをクリアしますが、$q_{\mathrm{state}}$は[[glossary/elasticity|弾力性]]に関係なく$T_{\mathrm{state}}/m_{\mathrm{state}}$に固定されているため、それが生成する[[glossary/state-linked-BAL|ステートリンクされたBAL]]も固定されます。[[glossary/state-elasticity|ステート弾力性]]は[[glossary/state-base-fee|ステートベースフィー]] $b_{\mathrm{state}}$のみを移動させます。

## 制限事項

**[[glossary/isoelastic-extrapolation|等弾力性外挿]]。** 計算は、需要曲線を推定に使用されたイベントウィンドウをはるかに超えて外挿します。正確な[[glossary/wei-level-fees|weiレベルの手数料]]と[[glossary/fill-rates|充足率]]は、[[glossary/conditional-functional-form-outputs|条件付き関数形式出力]]です。将来の手数料を予測するには、[[glossary/dynamic-demand-and-shock-model|動的需要とショックモデル]]が必要になります。[[glossary/regime-classification|レジーム分類]]は、テストされた仮定全体でより安定しています。

**平均および限界BAL強度。** $\rho_A\ne1$の場合、[[glossary/execution-parent-price|実行親価格]]は平均BAL強度$\bar w_{\mathrm{execution}}=w_{\mathrm{execution}}R_{\mathrm{execution}}^{\rho_A-1}$を使用します。限界BAL強度は$\rho_A\bar w_{\mathrm{execution}}$です。これら2つは参照値$\rho_A=1$で一致します。オフリファレンスケースは、[[glossary/reduced-form-access-composition-sensitivities|削減形式のアクセス構成感度]]です。

**維持されるBALルーティング。** $\lambda$は、親価格が独立して変動する場合に、[[glossary/state-creating-transactions|ステート作成トランザクション]]における[[glossary/co-produced-access|共同生成されたアクセス]]がどのようにルーティングされるかを決定します。履歴データはこの割り当てを特定しません。値0、0.5、1は、維持される構造的代替案を表します。

## まとめと次のステップ

[[glossary/execution-clearing-boundary|実行クリアリング境界]]が中心的な結果です。これは、[[glossary/execution-data-target-space|実行/データターゲット空間]]において、BALデータ料金が[[glossary/execution-base-fee|実行ベースフィー]]を1[[glossary/wei|wei]]の最小値まで押し下げる場所を示します。参照パラメータ化では、45Mの[[glossary/data-target|データターゲット]]は232.4Mの[[glossary/execution-target|実行ターゲット]]に境界を配置します。境界は、構造的割り当て($\lambda$)、[[glossary/access-scaling|アクセススケーリング]]($\rho_A$)、および[[glossary/elasticity-window-assumptions|弾力性ウィンドウ仮定]]によって移動しますが、テストされたグリッド全体でその定性的な形状を保持します。45Mの[[glossary/data-target|データターゲット]]では、境界はテストされた仕様全体で135.9Mから288.8Mの範囲です。[[glossary/elasticity-uncertainty|弾力性の不確実性]]が最大の単一の変動要因です。

300Mの[[glossary/execution-target|実行ターゲット]]には、約76.97Mの[[glossary/data-target|データターゲット]]、つまり固定された90Mの制限の85.5%が必要です。21日および35日の[[glossary/elasticity-vectors|弾力性ベクトル]]の下での実現可能な仕様の中で、要件は55.9Mから94.5Mの範囲です。参照点の近くでは、[[glossary/execution-elasticity|実行弾力性]]の1%の減少は、必要な[[glossary/data-target|データターゲット]]を7.1%増加させ、1.98%の減少で固定された制限を超えます。したがって、これらは正確な[[glossary/protocol-capacity-estimates|プロトコル容量推定値]]ではなく、条件付きの容量ベンチマークです。

これらの結果は、1[[glossary/wei|wei]][[glossary/fee-floor|手数料フロア]]を超えてクリアできる[[glossary/execution-data-target-combinations|実行/データターゲットの組み合わせ]]を特定することにより、[[glossary/EIP-7999|EIP-7999]]の条件付き設計ガイダンスを提供します。また、シミュレーションに必要な均衡条件も確立します。

*3投稿 - 2参加者*

[トピック全文を読む](https://ethresear.ch/t/equilibrium-in-eip-7999-s-multidimensional-fee-market-the-execution-data-fee-floor-frontier/25868)
