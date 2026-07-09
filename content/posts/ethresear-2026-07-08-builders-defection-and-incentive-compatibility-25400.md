---
title: ビルダーの逸脱とインセンティブ整合性
original_title: Builders' Defection and Incentive Compatibility
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/builders-defection-and-incentive-compatibility/25400'
author: nuconstruct
date: '2026-07-08'
category: Economics
tags:
  - economics
  - consensus
  - pbs
  - mev
  - security
  - cryptography
  - mechanism-design
  - builder-defection
  - incentive-compatibility
topic_id: '25400'
translated_at: '2026-07-09'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Builders' Defection and Incentive Compatibility](https://ethresear.ch/t/builders-defection-and-incentive-compatibility/25400) — nuconstruct (2026-07-08)

`team@nuconstruct.xyz`

## 要約

-   [[glossary/PBS|PBS（プロポーザー・ビルダー分離）]]の下では、単一の[[glossary/Block-Building|ビルダー]]が、ブロックを組み立てる前にすべてのサーチャーの入札と完全なペイロードを観察し、その情報の使用方法に制約はない。そのため、実行したオークションを尊重する代わりに、利益のあるバンドルを複製することができる。これは不完全なコミットメント問題であり、[[glossary/Block-Building|ビルダー]]はオークションを実行するが、約束した結果に拘束されるものは何もなく、逸脱する機会の割合によって要約される。

-   評判だけで繰り返しの中でコミットメントを維持できるかを問う。なぜなら、逸脱を検出したサーチャーは将来のオーダーフローを別の経路に送ることができ、逸脱者にコストを課すからだ。正直さは、[[glossary/Block-Building|ビルダー]]が十分に将来を見据えており、逸脱による一度限りの利益が継続的な正直な収益に比べて小さく、検出が十分に可能性が高い場合にのみ[[glossary/Incentive-Compatibility-condition|インセンティブ整合的]]となる。そうでなければ、評判はコミットメントを強制できない。

-   `libmev`パネルで一度限りの[[glossary/Builder-Defection|逸脱]]利益を推定し、複製ベースのフロントランニングはクリーンなオンチェーンのフィンガープリントを残さないため検出が困難であることを考慮すると、主要な[[glossary/Trusted-Execution-Environment|非TEEビルダー]]すべてにおいて[[glossary/Incentive-Compatibility-condition|インセンティブ整合性条件]]が満たされない。つまり、[[glossary/Block-Building|ビルダー]]が異常に将来を見据えていない限り、**逸脱が正直さを上回る**。

-   その規模は大きく、パネル期間（2024年9月～2025年8月）において、[[glossary/Trusted-Execution-Environment|非TEEビルダー]]は逸脱によって年間約2600万ドルを獲得できた可能性があり、BuilderNetの[[glossary/Trusted-Execution-Environment|TEE]]によって中和されたエクスポージャーを考慮すると、すべての[[glossary/Block-Building|ビルダー]]で約4900万ドルに上る。

-   したがって、コミットメントの回復は評判によるものではなく、アーキテクチャによるものである。[[glossary/Block-Building|ビルダー]]が観察された入札とペイロードを再利用することを構造的に防ぐ必要がある。例えば、これは[[glossary/Trusted-Execution-Environment|トラステッド実行環境 (TEE)]]の導入、またはゼロ知識証明やコミット・リビール方式のような暗号フレームワークによって対処できる。

## 1. はじめに

以前の[論文](https://arxiv.org/abs/2605.22667)では、外生的な逸脱率 $\\varepsilon \\in \[0, 1\]$ を持つ封印型ファーストプライス[[glossary/MEV|MEV（最大抽出可能価値）]]オークションを実行する[[glossary/Block-Building|ビルダー]]をモデル化し、部分的なコミットメントの下で結果として生じる区分的均衡を特徴付けた。特に、定理3.7の結果は、$\\varepsilon^\* \\in \[0,1\]$ が $\\gamma(\\tau) v$ が競争的なファーストプライス封印入札 $\\beta(v)$ を超えるか下回るかに依存すると述べており、オークションが繰り返される場合にコミットメントがそもそも維持できるかという疑問を残していた。本論文の拡張では、そのギャップを埋める。ここでは、静的オークションを[[glossary/Block-Building|ビルダー]]とサーチャープールの間の繰り返しゲームに組み込み、標準的な評判による罰則の下で[[glossary/Incentive-Compatibility-condition|インセンティブ整合性 (IC) 条件]]を導出し、`libmev`パネル上の[[glossary/Block-Building|ビルダー]]ごとのIC閾値を推定する。

## 2. 繰り返しゲームのインセンティブ整合性

[[glossary/Block-Building|ビルダー]]は期間ごとに一度、封印型オークションを行う。入札とペイロードが観察された後、[[glossary/Block-Building|ビルダー]]は結果を尊重するか、[[glossary/Builder-Defection|逸脱]]するかを選択する。期間tにおける[[glossary/Builder-Defection|逸脱]]は、一度限りのフロントランニングによる余剰をもたらす。

$\\Delta\_t = \\sum\_{i \\in \\ \\text{round} \\ t} \\max \\{\\gamma(\\tau\_i) v\_i - b\_i, 0\\}$

ここで、$\\max$演算子は選択的[[glossary/Builder-Defection|逸脱]]を捉えている。すなわち、[[glossary/Block-Building|ビルダー]]は$\\gamma v\_j > b\_j$となるバンドルに対してのみ[[glossary/Builder-Defection|逸脱]]する。検出確率pで[[glossary/Builder-Defection|逸脱]]が検出され、サーチャープールが離脱すると仮定すると、[[glossary/Block-Building|ビルダー]]は期間t+1以降の継続的な収益ストリームを失う。一方、確率1-pで[[glossary/Builder-Defection|逸脱]]が失敗し、通常通りプレイが続く。サーチャーはpを知っており、[[glossary/Block-Building|ビルダー]]の履歴に基づいて戦略を条件付けると仮定する。罰則の最も単純なバージョンでは、一度検出された[[glossary/Builder-Defection|逸脱]]は永続的な退出を引き起こす。次に、期間ごとの割引率$\\delta$で2つの経路を比較する。

$\\text{NPV}\_h = \\sum\_{i=0}^\\infty \\delta^i \\pi\_h = \\frac{\\pi\_h}{1-\\delta}$

$\\text{NPV}\_d = \\pi\_h + \\Delta + (1-p)\\sum\_{i=1}^\\infty \\delta^i \\pi\_d + p \\cdot 0 = \\pi\_h + \\Delta + (1-p) \\frac{\\delta}{1-\\delta} \\pi\_h + p \\cdot 0$

ここで、添字hは[[glossary/Block-Building|ビルダー]]の正直な行動を意味し、添字dは即時[[glossary/Builder-Defection|逸脱]]を意味する。$\\text{NPV}\_d$の最初の項は、[[glossary/Block-Building|ビルダー]]がフロントランニングしないバンドルに対する現在の正直なチップであり、2番目の項は[[glossary/Builder-Defection|逸脱]]による余剰であり、3番目の項は捕まらなかった場合の継続価値であり、4番目の項は捕まってビジネスを失った場合のゼロ継続である。差し引くと、次のようになる。

$\\text{NPV}\_d - \\text{NPV}\_h = \\Delta - p \\frac{\\delta}{1-\\delta} \\pi\_h$

したがって、正直な行動に対する[[glossary/Incentive-Compatibility-condition|IC制約]]は次のようになる。

$\\Delta \\le p \\frac{\\delta}{1-\\delta} \\pi\_h \\tag{1}$

期間ごとの[[glossary/Builder-Defection|逸脱]]余剰の「月換算」を$m \\equiv \\frac{\\Delta}{\\pi\_h}$と定義すると、(1)は次のようになる。

$\\delta \\ge \\frac{m}{m+p}$

ここでの直感は非常に単純である。正直さは、[[glossary/Block-Building|ビルダー]]が十分に忍耐強く、割引された将来のビジネスストリームが一度限りの誘惑を上回る場合にのみ持続可能である。静的モデルへのマッピングは直接的である。$\\delta \\to 0$（近視眼的な[[glossary/Block-Building|ビルダー]]の場合）の場合、閾値$\\frac{m}{m+p} \\to 0$となり、正の$\\Delta$はすべて[[glossary/Builder-Defection|逸脱]]を引き起こし、定理3.7の高抽出可能性ブランチを回復する。$\\delta \\in (0, 1)$の内部値は、内部の$\\varepsilon^\*$を生成することに注意する。

## 3. 実証的実装

元の論文と同じ`libmev`パネルを使用する。4種類の$\\hat{\\gamma}(\\tau)$推定値は変更なく引き継がれる。`sandwich`: 0.95、`naked arb`: 0.74、`backrun`: 0.70、`liquidation`: 0.88。各[[glossary/Block-Building|ビルダー]]bについて、3つの量を計算する。

1.  **一度限りの[[glossary/Builder-Defection|逸脱]]利益、パネル合計**: $\\Delta^b = \\sum\_i \\max \\{\\hat{\\gamma}(\\tau\_i) v\_i - b\_i, 0\\}$ は、[[glossary/Block-Building|ビルダー]]のバンドルについて合計される。これは、[[glossary/Block-Building|ビルダー]]ごとにスライスされた図3の分解のパネルレベルのアナログである。

2.  **正直な収益率**: $\\pi^b\_h$ は、[[glossary/Block-Building|ビルダー]]がアクティブであった月にのみ平均された、月あたりの平均チップである。これは、罰則の下で[[glossary/Block-Building|ビルダー]]が放棄するであろう将来の継続フローに対応する。

3.  **月換算**: $m^b = \\frac{\\Delta^b}{\\pi^b\_h}$ は、「パネルレベルの誘惑が何ヶ月分の正直な収益に相当するか」を示す単一の要約統計量である。

年間頻度で表される暗黙の[[glossary/Incentive-Compatibility-condition|IC閾値]]

$\\delta^\*\_{yr} = \\biggl(\\frac{m}{m+p}\\biggr)^{12}$

は、[[glossary/Builder-Defection|逸脱]]が正直さを上回る年間割引率（すなわち、正直さのための*最小*年間割引率）である。検出確率pは、直接的な特定が将来の作業に委ねられているため、感度ダイヤルとして扱われる。

## 4. 結果

チップ量別トップ[[glossary/Block-Building|ビルダー]]：

| Builder | $\pi_h$ ($M/mo) | $\Delta_b$ ($M) | m | $\delta^*_{yr}$ (p=1) | $\delta^*_{yr}$ (p=0.1) | $\delta^*_{yr}$ (p=0.01) |
| --- | --- | --- | --- | --- | --- | --- |
| beaverbuild | 3.74 | 10.10 | 2.70 | 0.02 | 0.65 | 0.96 |
| Titan | 2.25 | 9.01 | 4.00 | 0.07 | 0.74 | 0.97 |
| bobTheBuilder | 0.47 | 4.14 | 8.88 | 0.28 | 0.87 | 0.99 |
| rsync-builder | 0.36 | 0.61 | 1.69 | 0.00 | 0.50 | 0.93 |
| BuilderNet | 0.42 | 23.00 | 54.71 | 0.80 | 0.98 | 1.00 |
| BuildAI | 0.15 | 2.06 | 14.00 | 0.44 | 0.92 | 0.99 |
| Ty For The Block | 0.49 | 0.07 | 0.15 | 0.00 | 0.00 | 0.47 |

*表1: [[glossary/Block-Building|ビルダー]]ごとの[[glossary/Incentive-Compatibility-condition|IC閾値]]。*

p = 1、つまり確実な検出の場合、`BuilderNet`のみが妥当な[[glossary/Operator|オペレーター]]割引率の範囲を超える閾値を持っていることがわかる。pが減少すると、バインディング領域が拡大する。p = 0.1の場合、`beaverbuild`と`Titan`の閾値は0.65〜0.74の範囲にあり、p = 0.01の場合、すべての主要な[[glossary/Block-Building|ビルダー]]で$\\delta^\*\_{yr} > 0.95$となり、わずかな不忍耐を持つ[[glossary/Operator|オペレーター]]でも[[glossary/Incentive-Compatibility-condition|IC]]が失敗することを意味する。

複製ベースのフロントランニングは、リバートがサーチャー側から見ると失われたアクションと区別できないため、クリーンなオンチェーンのフィンガープリントを残さない。そのため、妥当なpはこの範囲の下限、おそらく0.01〜0.1である。この範囲内では、パネル内のすべての主要な[[glossary/Trusted-Execution-Environment|非TEEビルダー]]に対して[[glossary/Incentive-Compatibility-condition|IC制約]]が拘束力を持つ。

## 5. タイプ別分解

集計されたmは、[[glossary/Block-Building|ビルダー]]と$\\tau$ごとの貢献$m^{\\text{tot}}\_\\tau = \\frac{\\Delta\_\\tau}{\\pi\_h}$に分解される。分母にはタイプ固有ではない総正直収益が来る。なぜなら、タイプ$\\tau$に対する[[glossary/Builder-Defection|逸脱]]が検出された場合、[[glossary/Block-Building|ビルダー]]はそのタイプのビジネスだけでなく、将来のすべてのビジネスを失うからである。

| Builder | sandwich | naked arb | backrun | liquidation |
| --- | --- | --- | --- | --- |
| beaverbuild | 0.27 | 1.22 | 0.57 | 0.65 |
| Titan | 0.78 | 0.53 | 1.19 | 1.50 |
| bobTheBuilder | 8.65 | 0.00 | 0.23 | - |
| BuilderNet | 0.35 | 38.42 | 0.76 | 15.17 |
| rsync-builder | 0.95 | 0.34 | 0.38 | 0.01 |

*表2: [[glossary/Block-Building|ビルダー]]と$\\tau$ごとの[[glossary/Builder-Defection|逸脱]]エクスポージャー$m^{\\text{tot}}\_\\tau = \\frac{\\Delta\_\\tau}{\\pi\_h}$。エムダッシュは、その[[glossary/Block-Building|ビルダー]]にそのタイプの記録がないことを示す。*

$m^{\\text{tot}}\_\\tau > 1$のセルは、単一タイプの[[glossary/Builder-Defection|逸脱]]だけで1ヶ月分の総正直収益を超えることを示しており、中程度のpであっても、そのタイプに対する[[glossary/Builder-Defection|逸脱]]だけで[[glossary/Incentive-Compatibility-condition|IC不等式]]を破るのに十分であることを意味する。このパターンは、元の論文のタイプ異質性の結果と一致するが、重要な[[glossary/Block-Building|ビルダー]]レベルの側面を追加している。すなわち、タイプごとに最初に[[glossary/Builder-Defection|逸脱]]する[[glossary/Block-Building|ビルダー]]は体系的に異なる。例えば、beaverbuildでは`naked arb`、Titanでは`liquidation`と`backrun`、bobTheBuilderでは`sandwich`、BuilderNetでは`naked arb`と`liquidation`が総反実仮想エクスポージャーの98%を占める。

### BuilderNetの特異性

[[glossary/Trusted-Execution-Environment|TEE]]で動作するrbuilderであるBuilderNetは、評判ではなくアーキテクチャによって$\\varepsilon = 0$を強制する。[[glossary/Operator|オペレーター]]は個々のバンドルペイロードを複製ベースの[[glossary/Builder-Defection|逸脱]]に利用可能な形式で文字通り観察できないため、暗号的に[[glossary/Builder-Defection|逸脱]]が排除され、クリーンな[[glossary/Block-Building|ビルダー]]間比較が可能となる。したがって、ここで3つの観察が生まれる。

1.  BuilderNetは、主要な[[glossary/Block-Building|ビルダー]]の中で最も低い価値加重された賄賂シェア（12.3%）を持つ。我々のフレームワークでは、これは[[glossary/Trusted-Execution-Environment|非TEEビルダー]]で高価値サーチャーがフロントランニングを抑止するために提示する抑止入札プレミアム$\\gamma(\\tau) v$の欠如を反映しており、入札が純粋な競争レベルに近いことを意味する。

2.  BuilderNetは、表1および表2に示されているように、`naked arb`と`liquidation`に集中した、群を抜いて最大の反実仮想[[glossary/Builder-Defection|逸脱]]エクスポージャーを持つ。

3.  [[glossary/Trusted-Execution-Environment|TEE]]アーキテクチャは、[[glossary/Incentive-Compatibility-condition|IC制約]]が評判に要求するであろう仕事を正確に果たしている。サーチャーは、最も複製されやすい機会を、[[glossary/Builder-Defection|逸脱]]できない[[glossary/Operator|オペレーター]]にルーティングする。これは、同じ余剰が[[glossary/Trusted-Execution-Environment|非TEEビルダー]]で露出するからに他ならない。

[[glossary/Trusted-Execution-Environment|TEE]]と[[glossary/Trusted-Execution-Environment|非TEE]]の分割を読み解く上で、タイミングが重要となる。`libmev`パネルは2024年9月～2025年8月に実行されたが、BuilderNetは2024年11月下旬にローンチされ、beaverbuildはその後の数ヶ月でそのフローを[[glossary/Trusted-Execution-Environment|TEE]]で実行されるBuilderNetに移行した（この切り替えは2025年半ばまでに実質的に完了した）。したがって、ここでの分類は*パネル時点での*ものであり、beaverbuildはウィンドウの前半でスタンドアロンの[[glossary/Block-Building|ビルダー]]として運営されていたため、[[glossary/Trusted-Execution-Environment|非TEEビルダー]]としてカウントされている。今日のそのフローはBuilderNetの[[glossary/Trusted-Execution-Environment|TEE]]内で実行されているにもかかわらずである。本稿におけるすべての[[glossary/Builder-Defection|逸脱]]エクスポージャーの数値は、履歴的なパネル期間の量であり、現在の[[glossary/Block-Building|ビルダー]]市場に関する主張ではない。[[glossary/Block-Building|ビルダー]]が移行をまたぐ場合、そのエクスポージャーとBuilderNetのものは、ウィンドウ内の異なる時点での同じフローを部分的に記述している。

[[glossary/Block-Building|ビルダー]]全体で集計すると、その規模が明らかになる。表1の反実仮想余剰$\\Delta\_b$を合計すると、パネル全体で合計約4900万ドルの[[glossary/Builder-Defection|逸脱]]余剰がある。そのうち約2600万ドルは、それを行動に移す可能性のある[[glossary/Trusted-Execution-Environment|非TEEビルダー]]にあり、約2300万ドルは、[[glossary/Trusted-Execution-Environment|TEE]]がそれを中和するBuilderNetにある。この分割は*パネル時点での*ものであり、beaverbuild（約1000万ドル）はその後[[glossary/Trusted-Execution-Environment|TEE]]に移行しているため、今日の構成における実現可能な[[glossary/Trusted-Execution-Environment|非TEE]]の数値は、約1600万ドルに近い。

## 6. 信頼できるコミットメントの回復

[[glossary/PBS|PBS]]アーキテクチャは、不完全なコミットメント問題を機械的に作り出す。[[glossary/Block-Building|ビルダー]]はすべてのバンドルとペイロードを観察し、ブロックの内容に対する一方的な権限を持ち、観察された情報が事後的にどのように使用されるかについて暗号的な制約を受けない。集中化は、競争的な[[glossary/Block-Building|ビルダー]]市場が原則として提供しうる評判による規律をさらに弱める。標準的なオークション汚職チャネルは大規模に機能し、さらに複製ベースのフロントランニングはクリーンなオンチェーンのフィンガープリントを残さないため、検出が困難であるという特徴がある。

したがって、いかなる解決策もインセンティブではなくアーキテクチャに作用しなければならない。モデルの観点から言えば、修正は、評判ではなく構築によって正直さをすべての割引率に対して[[glossary/Incentive-Compatibility-condition|インセンティブ整合的]]にする必要があり、これは$\\varepsilon \\to 0$を強制することを意味する。運用上の要件は、[[glossary/Block-Building|ビルダー]]がサーチャーの入札とペイロードを、事後的に利益を得て再利用できる形式で決して取得しないことである。これが満たされれば、(1)における[[glossary/Builder-Defection|逸脱]]余剰$\\Delta$は恒等的にゼロとなり、検出確率pとは無関係に[[glossary/Incentive-Compatibility-condition|IC制約]]は自明に満たされる。この特性を持つアーキテクチャを*信頼できるコミットメント*と呼び、特定の実現方法ではなく、信頼できるコミットメント自体が関心の対象であることを強調する。いくつかの設計は、異なる技術的手段によってこれを達成する。

1.  **[[glossary/Trusted-Execution-Environment|トラステッド実行 (TEE)]]。** [[glossary/Operator|オペレーター]]は[[glossary/Trusted-Execution-Environment|トラステッド実行環境 (TEE)]]内でrbuilderを実行するため、個々のペイロードは複製に利用可能な形式で決して露出せず、[[glossary/Builder-Defection|逸脱]]は暗号的に排除される。BuilderNetは我々のパネルにおけるその例である。その実証的な特徴、すなわち最も低い価値加重された賄賂シェアと最大の反実仮想[[glossary/Builder-Defection|逸脱]]エクスポージャーの組み合わせは、脅威を排除することで抑止入札プレミアムを排除した[[glossary/Block-Building|ビルダー]]に対してモデルが予測するものを正確に示している。
2.  **コミットメントベースの決済。** オーダーフローは、サーチャーや[[glossary/Block-Building|ビルダー]]がそれに行動する前にコミットメントに変換され、生ペイロードではなくそれらのコミットメントを巡る競争によって価値が追加される。TOOLがその例である。プライベートトランザクションとバンドルは、証明された[[glossary/Trusted-Execution-Environment|TEE]]環境内で処理され、コミットメントビューとしてのみ露出される。そして、[[glossary/Block-Building|ブロック構築]]は単一の[[glossary/Block-Building|ビルダー]]に集中するのではなく、P2P[[glossary/Operator|オペレーター]]セット全体に分散される。生ペイロードはそれを複製できる当事者に決して露出されないため、[[glossary/Builder-Defection|逸脱]]余剰は単に抑止されるのではなく、発生源で除去され、pは無関係になる。この経路は、(1)の[[glossary/Trusted-Execution-Environment|トラステッド実行]]プリミティブとコミットメント抽象化を組み合わせ、単一[[glossary/Operator|オペレーター]]への集中なしに[[glossary/Trusted-Execution-Environment|TEE]]の機密性を継承する。
3.  **暗号的順序保護。** 同じ保証は、入札とペイロードを順序が固定されるまで隠しておくことで、特殊なハードウェアや外部の決済レイヤーなしで得られる。実用的な例としては、インクルージョン後にのみトランザクションを復号する[[glossary/Threshold-Encryption|閾値暗号化メムプール]]（[Shutter](https://blog.shutter.network/applied-mev-protection-via-shutters-threshold-encryption/)によって展開され、スラッシュ可能なコミット・リビール型事前確認と組み合わせてPrimevのmev-commitによって展開されている）、エポックごとのスキームにおける保留中トランザクションのプライバシー漏洩を解消する[バッチ処理された閾値復号](https://www.usenix.org/system/files/conference/usenixsecurity25/sec25cycle1-prepub-995-bormet.pdf)、およびVDFや証人暗号などの時限リリースまたはコミット・リビール型構成がある。それぞれが、追加のレイテンシと復号委員会への信頼仮定を犠牲にして、[[glossary/Block-Building|ビルダー]]の事後的な情報優位性を構築によって除去する。

これら3つの経路は、信頼と実装の仮定が異なる。(1)と(2)は信頼できるハードウェアに依存し、(3)は暗号的仮定に依存するが、我々の目的には同等である。それぞれが[[glossary/Block-Building|ビルダー]]の事後的な情報優位性を除去し、したがって評判だけでは埋められない[[glossary/Incentive-Compatibility-condition|IC]]ギャップを解消する。

このギャップを埋めないものについて明示的に述べる価値がある。なぜなら、この文脈で最も頻繁に言及される2つのロードマップ項目はそうではないからだ。

[[glossary/ePBS|ePBS (EIP-7732)]]は、[[glossary/PBS|プロポーザー・ビルダー分離]]をプロトコルに組み込み、信頼されたリレーをプロトコルネイティブなプロポーザーと[[glossary/Block-Building|ビルダー]]間のコミット・リビールに置き換える。これにより、プロポーザーが支払いを受け、[[glossary/Block-Building|ビルダー]]がコミットされたペイロードを保留したり変更したりできないことが保証される。これはプロポーザーと[[glossary/Block-Building|ビルダー]]間の信頼問題であり、サーチャーと[[glossary/Block-Building|ビルダー]]間の機密性問題ではない。[[glossary/ePBS|ePBS]]の下でも、[[glossary/Block-Building|ビルダー]]はブロックを組み立て、すべてのバンドルとペイロードを依然として観察するため、$\\varepsilon$は我々が残したところと全く同じである。

[[glossary/FOCIL|FOCIL (EIP-7805)]]は、フォーク選択ルールを通じて[[glossary/Inclusion-List|インクルージョンリスト]]を強制し、適格なトランザクションが密かに除外されないことを保証する。これは検閲、すなわちオーダーフローの*除外*に対処するものであり、一度見られた後のその*複製*については何も言及していない。どちらのメカニズムも[[glossary/Block-Building|ビルダー]]の事後的な情報優位性を除去しないため、セクション4の[[glossary/Incentive-Compatibility-condition|IC閾値]]を動かすことはない。

これら2つは包括的な解決策として頻繁に提示されるため、直接言及する価値がある。ここでモデル化された特定のチャネルに関しては、これらは単に直交しており、[[glossary/Encrypted-Mempool|暗号化メムプール]]は実際には[[glossary/FOCIL|FOCIL]]の代替ではなく、*補完*として提案されることが多い。

## 7. 考察

我々のモデルは、[[glossary/PBS|PBS]]の下では正直さが均衡ではないことを示している。現実的な検出確率では、主要な[[glossary/Trusted-Execution-Environment|非TEEビルダー]]すべてが、将来のビジネスの割引損失を差し引いた後でも、[[glossary/Builder-Defection|逸脱]]する厳密に合理的なインセンティブを持つ。したがって、繰り返し関係を確立するためのメカニズムである評判は、拘束するにはあまりにも弱い。

本研究は、実際の[[glossary/PBS|PBS]]参加者の悪意ある行動の兆候を調査したり報告したりするものではないが、アーキテクチャ上の欠陥を露呈する可能性がある。すなわち、[[glossary/Block-Building|ビルダー]]はすべてのペイロードを観察し、暗号的な制約に拘束されず、ユーザーのトランザクション情報の悪用に向けて本質的に偏ったインセンティブ構造を持っている。

我々の研究が、コミュニティが[[glossary/PBS|PBS]]をイーサリアムユーザーの大部分に影響を与えうるサプライチェーンリスクとして対処すべきかどうかの議論を巻き起こすことを願っている。我々は、この方向性の研究にさらに努力を傾け、トランザクション処理パイプラインの他の部分における[[glossary/Incentive-Compatibility-condition|インセンティブ整合性]]の問題に対処するための範囲を広げることが適切であると考えている。

1件の投稿 - 1名の参加者

[トピック全文を読む](https://ethresear.ch/t/builders-defection-and-incentive-compatibility/25400)
