---
title: 'L2の最適な動的手数料: ボールトアプローチ'
original_title: 'Optimal Dynamic Fees for L2s: A Vault Approach'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/optimal-dynamic-fees-for-l2s-a-vault-approach/26293'
author: ulrych8
date: '2026-11-25'
category: Layer 2
tags:
  - layer2
  - scaling
  - economics
  - protocol-design
  - fee-market
  - research
  - arbitrum
  - dynamic-fees
topic_id: '26293'
translated_at: '2026-11-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Optimal Dynamic Fees for L2s: A Vault Approach](https://ethresear.ch/t/optimal-dynamic-fees-for-l2s-a-vault-approach/26293) — ulrych8 (2026-11-25)

[![ボールトの視覚化](https://ethresear.ch/uploads/default/optimized/3X/e/4/e4556758c15ad97a5e00a387a568679fc008c648_2_517x345.jpeg)](https://ethresear.ch/uploads/default/original/3X/e/4/e4556758c15ad97a5e00a387a568679fc008c648.jpeg "ボールトの視覚化")

[Ulysse Pavloff](https://x.com/upavloff) (ベルン大学) および [Lin Oshitani](https://x.com/linoscope) [@linoscope](https://ethresear.ch/u/linoscope) (Nethermind Research)

### TL;DR

私たちは最近、[[glossary/Rollup|L2ロールアップ]]の手数料設定ルールの最適な設計を探求する[論文](https://arxiv.org/abs/2611.20838)を発表しました。主な調査結果は以下の通りです。

-   **最適な手数料ルールは、何を最小化したいかによって異なります。** 手数料変更と[[glossary/vault|ボールト]]誤差の両方にペナルティを課す場合、最適なルールは以前の手数料の一部を保持します。代わりに、[[glossary/break-even-fee|損益分岐手数料]]からの逸脱にペナルティを課す場合、[[glossary/proportional-rule|比例ルール]]が最適です。
-   **1つのパラメータがトレードオフを設定します。** 手数料記憶係数 $\pi$ は、ターゲットに近いボールトとスムーズな手数料の間で選択を行います。
-   **履歴分析は他の懸念事項を追加します。** リプレイされた[[glossary/Layer-1|イーサリアム]]価格では、Arbitrumのルールは、その設定に近い[[glossary/LQR|LQR (線形二次レギュレータ)]]と同程度に良好です。[[glossary/proportional-rule|比例ルール]]は最悪の赤字が最も小さく、[[glossary/fee-cap|手数料上限]]が拘束力を持つ場合、準備金サイズが決定要因となります。

### **ボールトにフィードバックが必要な理由**

[[glossary/Rollup|L2ロールアップ]]は、トランザクションデータを投稿するために[[glossary/Layer-1|イーサリアム]]に支払い、これらのコストを回収するためにユーザーに手数料を請求します。[[glossary/vault|ボールト]]は、これら2つのフロー（[[glossary/fee-revenue|手数料収入]]が流入し、[[glossary/L1-posting-costs|L1投稿コスト]]が流出する）間の累積差を追跡します。[[glossary/L1-costs|L1コスト]]はユーザー手数料が調整されるよりも速く変化する可能性があるため、ボールト残高はターゲットから乖離する可能性があります。

ターゲット残高が10 ETHであると仮定しますが、L1コストの急増により8 ETHに減少しました。たとえL2がそれ以降、手数料を投稿コストに完全に一致させたとしても、残高は無期限に8 ETHのままです。損益分岐点に達することはさらなる損失を防ぎますが、過去の損失を回復するためには何も貢献しません。残高をターゲットに戻すには、[[glossary/fee-setting-rule|手数料設定ルール]]がボールト残高自体に反応する必要があります。

[![ボールトのスキーマ](https://ethresear.ch/uploads/default/optimized/3X/f/e/fe9d5a866e66c6519a8e6edfa4e318d55c89d70d_2_517x316.png)](https://ethresear.ch/uploads/default/original/3X/f/e/fe9d5a866e66c6519a8e6edfa4e318d55c89d70d.png "ボールトのスキーマ")

私たちの[以前の投稿](https://ethresear.ch/t/the-l2-fee-vault-pricing-l1-costs-with-feedback-control/24656)でこの議論を行いました。私たちの[論文](https://arxiv.org/abs/2611.20838)はさらに一歩進んで、手数料はボールト残高にどのように反応すべきか、そしてどのような手数料設定ルールが他のルールよりも優れているのかを問いかけます。この投稿では、私たちの調査結果を要約します。

### **良い手数料ルールの条件とは？**

私たちは[[glossary/Rollup|L2ロールアップ]]の手数料価格設定を制御問題として定式化します。各投稿間隔 $t$ において、[[glossary/fee-setting-rule|手数料設定ルール]]（コントローラー）は手数料 $F_t$ を選択します。これは、データ単位あたりのL2手数料の[[glossary/L1-posting-costs|L1投稿コスト]]コンポーネントを表します。間隔の開始時点でのボールト残高を $V_t$、そのターゲットを $V^*$ と表記します。

ボールト残高は次のように変化します。

$V_{t+1}=V_t+F_t\Lambda_t-C_t,$

ここで、$\Lambda_t$ は間隔中の総請求データ量、 $C_t$ は[[glossary/L1-costs|L1コスト]]です。

固定の請求データ量 $\bar{\Lambda}$ を仮定し、平均L1投稿コストを $\bar{C}$ と表記します。これにより、平均して投稿コストをカバーする[[glossary/break-even-fee|損益分岐手数料]] $F^*=\bar{C}/\bar{\Lambda}$ が得られます。

しかし、私たちの目標は単に投稿コストを回収することではありません。私たちは2つの競合する目的を考慮します。

-   **ボールト追跡:** ボールト残高 $V_t$ をそのターゲット $V^*$ に近づけること。これを平均二乗赤字（[[glossary/ISE|ISE]]）で測定します。
-   **手数料の平滑性:** 手数料の変化 $F_t-F_{t-1}$ を小さく保つこと。これを平均二乗手数料変化（[[glossary/QV|QV]]）で測定します。

これらの目的は相反します。ボールトの赤字を積極的に修正するルールは大きな手数料変化を生み出す可能性があり、スムーズな手数料を優先するルールはボールト残高がターゲットから長く離れたままになることを許容する可能性があります。

これら2つの目的の間で最良のトレードオフを達成する手数料設定ルールはどのようなものでしょうか？

### 手数料を設定する2つの方法

自然な出発点は[[glossary/proportional-rule|比例ルール (P)]]であり、現在のボールト赤字に応じて手数料を調整します。

$F_t=F^*+k_p\epsilon_t,$

ここで、$\epsilon_t=(V^*-V_t)/V^*$ は正規化されたボールト赤字であり、$k_p$ は手数料がそれにどれだけ強く反応するかを決定します。残高がターゲットを下回るほど、手数料は高くなります。

しかし、手数料の変化を最小限に抑えたい場合、現在のボールト赤字だけが関連情報ではありません。手数料がどれだけ変化するかは、以前の手数料にも依存します。

実際、最適なルールは以前の手数料を考慮に入れます。それは以前の手数料の一部を保持し、[[glossary/break-even-fee|損益分岐手数料]] $F^*$ に徐々に戻り、現在の赤字を修正します。

$F_t=\pi F_{t-1}+(1-\pi)F^*+k\,\epsilon_t,\qquad k=\frac{(1-\pi)^2}{\gamma(1+\pi)}.$

ここで $\gamma=\bar\Lambda/V^*$ はボールトに対する手数料のレバレッジです。つまり、手数料の変化が正規化された残高をどれだけ動かすかを示します。このルールは[[glossary/linear-quadratic-regulator|線形二次レギュレータ (LQR)]]問題を解決します。これは、ボールト誤差（[[glossary/ISE|ISE]]）と手数料変動（[[glossary/QV|QV]]）の加重和を最小化します。このベンチマークは理想化されており、固定需要、既知の平均コスト、予測不能なコストショック、および無制限の手数料を仮定しています。

なぜ[[glossary/fee-memory|手数料記憶]]が現れるのでしょうか？目的は手数料の変化にペナルティを課すため、次の手数料を選択する際に以前の手数料が重要になります。代わりに[[glossary/break-even-fee|損益分岐手数料]]からの逸脱にペナルティを課す場合、最適なルールは[[glossary/proportional-rule|P (比例ルール)]]になります。

### $\pi$ の選択

$\pi$ は以前の手数料がどれだけ保持されるかを決定します。$\pi$ が高いと手数料はよりスムーズになり、ボールトターゲットへの回復は遅くなります。$\pi$ が低いと赤字はより速く修正されますが、より大きな手数料変化が生じます。これを選択するには、[[glossary/recovery-time|回復時間]]の観点から考えます。[[glossary/break-even-fee|損益分岐手数料]]から開始し、新たなコストショックがない場合、赤字は約 $2/(1-\pi)$ 間隔で半減します。私たちのシミュレーションでは、10個の[[glossary/Ethereum-blocks|イーサリアムブロック]]ごとに1回のL1投稿（約2分）を仮定しています。$\pi=0.99$ の場合、赤字は約200間隔、つまり約7時間で半減します。許容可能な回復時間を選択し、それに応じて $\pi$ を調整します。

### Arbitrumの立ち位置

Arbitrumのルールはボールト黒字を徐々に修正します。デプロイされたパラメータでは、[[glossary/proportional-rule|P (比例ルール)]]に近い挙動を示します。**理想化されたベンチマーク**では、最適なルールは、同等の[[glossary/QV|QV (平均二乗手数料変化)]]で32%低い[[glossary/ISE|ISE (平均二乗赤字)]]、または同等の[[glossary/ISE|ISE]]で70%低い[[glossary/QV|QV]]を、Arbitrumの参照と比較して達成します。これらは**モデル仮定に基づく二乗メトリクスの比較**であり、本番環境での測定された節約ではありません。履歴価格では、Arbitrumの参照は競争力があり、以下で議論するように[[glossary/LQR|LQR]]曲線に近い位置にあります。これは最適性定理と矛盾しません。履歴リプレイはその理想化された仮定を満たさないためです。

[![図2_ISE_QV_フロンティア](https://ethresear.ch/uploads/default/optimized/3X/2/9/2912b873e55973639d4cdb5a5e29dd3872e84a46_2_517x336.png)](https://ethresear.ch/uploads/default/original/3X/2/9/2912b873e55973639d4cdb5a5e29dd3872e84a46.png "図2_ISE_QV_フロンティア")

理想化されたベンチマーク、閉形式。正規化されたISE対正規化されたQV; 左下がより良い。星印はArbitrumの参照。

### 履歴分析

2025年5月から12月までの7ヶ月間の[[glossary/Layer-1|イーサリアム]]価格を、手数料フロアをゼロにしてリプレイします。ワークロードは固定の請求量でモデル化され、Arbitrumの参照は2026年9月に読み取られたパラメータを使用します。これはArbitrumの実際の2025年の手数料徴収のリプレイではありません。2つの教訓が際立っています。

第一に、最良の平均が必ずしも最悪のケースで最良であるとは限りません。[[glossary/LQR|LQR]]は手数料がスムーズな場合に追跡の優位性を保ちますが、[[glossary/proportional-rule|P (比例ルール)]]は同じ手数料変動で最大不足額が小さくなります。Arbitrumの積極的な設定に近い場合、Arbitrumは競争力があり、[[glossary/LQR|LQR]]曲線に近い位置にあります。これは最適性定理と矛盾しません。履歴リプレイはその理想化された仮定を満たさないためです。

図の各マーカーは異なる目的重み $\rho$ を示しています。$\rho$ が大きいほど、手数料変化よりもボールト誤差に重みが置かれます。ベンチマークでは、$\rho$ が $\pi$ を固定します。$\rho$ が大きいほど、最適な $\pi$ は小さくなり、手数料はより反応的になります。

[![図3_履歴トレードオフ](https://ethresear.ch/uploads/default/optimized/3X/d/2/d21a1c4293c7db2df439e2e43333ede5976f1ea0_2_690x311.png)](https://ethresear.ch/uploads/default/original/3X/d/2/d21a1c4293c7db2df439e2e43333ede5976f1ea0.png "図3_履歴トレードオフ")

履歴リプレイ、2025年5月から12月、手数料上限なし。左: ボールトRMSE; 右: 最大不足額; 両方ともRMS手数料変化に対して。マーカーは目的重み $\rho$ を示し、星印はArbitrumの参照。

第二に、スパイクはどんなルールでも飽和させる可能性があります。2025年10月10日には、実行コストが平均の数百倍に跳ね上がりました。上限がない場合、示されている設定では、ルールは[[glossary/break-even-fee|損益分岐手数料]]の約200倍までの手数料を要求します。手数料が[[glossary/break-even-fee|損益分岐手数料]]の10倍に制限されている場合、示されているすべてのルールが上限に達し、赤字はルールに関係なく約1.5 ETHに達します。上限が拘束力を持つ場合、ルールよりも準備金が重要になります。

[![図4_10月のスパイクと上限](https://ethresear.ch/uploads/default/optimized/3X/a/a/aabbd65df59333843f71bc2131bcd76746e9d827_2_509x500.png)](https://ethresear.ch/uploads/default/original/3X/a/a/aabbd65df59333843f71bc2131bcd76746e9d827.png "図4_10月のスパイクと上限")

履歴リプレイ、2025年10月10日、$\rho = 10^{-6}$。左: 手数料上限なし。右: 手数料は[[glossary/break-even-fee|損益分岐手数料]]の10倍に上限設定。

### 持ち帰りメッセージ

**最適な手数料ルールは、何を最小化したいかによって異なります。** 手数料変更が重要であれば、[[glossary/fee-memory|手数料記憶]]が最適です。[[glossary/break-even-fee|損益分岐手数料]]からの逸脱が重要であれば、[[glossary/proportional-rule|比例ルール]]フィードバックが最適です。理想化されたモデルでは、$\pi$ がボールト追跡と手数料の平滑性の間のトレードオフを設定します。実際には、コストスパイクや[[glossary/fee-cap|手数料上限]]が他の懸念事項（最悪ケースの赤字や準備金サイジング）を追加します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/optimal-dynamic-fees-for-l2s-a-vault-approach/26293)
