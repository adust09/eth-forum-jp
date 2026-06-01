---
title: MEVオークションにおける不完全なコミットメント
original_title: Imperfect Commitment in Maximal Extractable Value Auctions
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/imperfect-commitment-in-maximal-extractable-value-auctions/25001
author: nuconstruct
date: '2026-05-29'
category: Economics
tags:
  - economics
  - mev
  - pbs
  - mechanism-design
  - validators
  - research
  - protocol-design
  - mev-auctions
topic_id: '25001'
translated_at: '2026-05-30'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Imperfect Commitment in Maximal Extractable Value Auctions](https://ethresear.ch/t/imperfect-commitment-in-maximal-extractable-value-auctions/25001) — nuconstruct (2026-05-29)

本稿は「[Open vs. Sealed: Auction Format Choice for MEV](https://ethresear.ch/t/open-vs-sealed-auction-format-choice-for-maximal-extractable-value/24454)」の補足論文であり、関連するものの異なる問題を研究しています。それは、フォーマット上最適なオークションであっても、事後的な[[glossary/Block-Building|ビルダー]]の離反によって損なわれる可能性があるという問題です。本稿では、提出された入札とペイロードを観察した後、確率 \\varepsilon で正直なオークション結果から離反し、勝利した機会のタイプ固有の割合 \\gamma(\\tau) を複製する[[glossary/Block-Building|ビルダー]]をモデル化します。検索者は、リスクのあるファーストプライス入札と安全な抑止入札の間で選択することで対応し、区分的均衡をもたらします。同じ `libmev` データセットを使用して、右裾の賄賂プラトーから \\gamma(\\tau) を推定し、観察されたオークション収益を、離反する[[glossary/Block-Building|ビルダー]]が捕捉しうる余剰に対して分解します。

## TLDR

-   [[glossary/Block-Building|ビルダー]]のコミットメントは \\varepsilon \\in \[0,1\] で要約されます。これは、観察された入札およびペイロード情報を悪用して[[glossary/Block-Building|ビルダー]]が離反する機会の割合です。このチャネルはオークションフォーマットに関係なくアクティブです。
    
-   検索者は、リスクのあるファーストプライス入札と安全な抑止入札 b = \\gamma(\\tau)v の間で選択することで対応し、タイプ固有のカットオフ v^\*(\\varepsilon, \\tau) を伴う区分的均衡をもたらします。
    
-   推定された失われたフロントランの余剰は4,940万ドルであり、これは観察されたチップの48.8%に相当し、ネイキッドアービトラージと清算が最も影響を受けます。
    
-   補足論文で特定された低抽出性レジームに近いサンドイッチ攻撃は、離反にさらされる追加の余剰がほとんどありません。
    
-   信頼できる[[glossary/MEV|MEV]]オークションには、より良いオークションフォーマットだけでなく、事後的に観察された入札およびペイロード情報を使用する[[glossary/Block-Building|ビルダー]]の能力に対する制約が必要です。
    

## 1. コミットメント問題

補足論文では、関連する[[glossary/MEV|MEV]]評価の下では、イングリッシュオークションとSPSBオークションのフォーマットがシールドビットフォーマットを厳密に支配し、中程度の関連性で14〜28%のリンケージギャップがあることを示しています。この分析は、[[glossary/Block-Building|ビルダー]]の正直性を所与としています。本稿では、それが所与でない場合に何が起こるかを問いかけます。

提出されたすべてのバンドルとそのトランザクションペイロードを観察した[[glossary/Block-Building|ビルダー]]は、勝利した検索者の戦略を複製し、そのトランザクションを置き換え、基礎となる機会を直接捕捉することができます。標準的なリバート保護（MEV-Share、Flashbots）は、検索者のトランザクションが実行されず、入札支払いが収集されないことを意味するため、[[glossary/Block-Building|ビルダー]]が離反から得る利益は \\gamma(\\tau) v\_{(1)} であり、\\gamma(\\tau) v\_{(1)} - b\_{(1)} ではありません。[[glossary/Block-Building|ビルダー]]は \\gamma(\\tau) v\_{(1)} > b\_{(1)} の場合に常に離反します。

複製可能性の割合 \\gamma(\\tau) は、[[glossary/MEV|MEV]]のタイプによって大きく異なります。サンドイッチ攻撃は、被害者のトランザクションがあれば機械的に再現可能です（\\gamma \\approx 1）。複雑な清算には独自のインフラストラクチャが必要です（\\gamma \\ll 1）。このタイプ固有性は、操作による利益をフォーマットに依存しないものとして扱うオークション主催者の腐敗に関する文献との主要な構造的違いです。

## 2. データ

データセットは補足論文と同一です。2024年9月から2025年8月までのEthereum上の220万件の`libmev`トランザクションで、合計1億6,850万ドルの抽出価値と1億130万ドルのチップが含まれます。変数定義、対数正規分布の適合（\\hat{\\mu} = 1.102, \\hat{\\sigma} = 2.524）、および[[glossary/MEV|MEV]]タイプ別の要約統計量はそちらに報告されており、ここでは再現しません。

本稿で導入する新しい変数は、*潜在的な離反利益*です。これは、各トランザクションにおける \\hat{\\gamma}(\\tau)v\_i - b\_i の正の部分であり、結果を尊重するのではなくフロントランニングすることによって[[glossary/Block-Building|ビルダー]]が利用できる増分収益を測定します。beaverbuild、Titan、BuilderNet (Beaver)、bobTheBuilder、BuilderNet (Flashbots) の5つの主要な[[glossary/Block-Building|ビルダー]]がトランザクションの93%を占めています。

## 3. モデル

環境とシグナル構造は補足論文に直接従います。n人のリスク中立な検索者、z\_i = \\sqrt{\\rho}Z + \\sqrt{1-\\rho}\\,u\_i を伴う対数正規分布の関連価値評価 v\_i = \\exp(\\mu + \\sigma z\_i)、および (n(\\tau), \\rho(\\tau)) を通じて捕捉される[[glossary/MEV|MEV]]タイプです。

新しい要素は、[[glossary/Block-Building|ビルダー]]の事後的な決定です。すべての入札 (b\_1, \\dots, b\_n) と勝利したペイロードを観察した後、[[glossary/Block-Building|ビルダー]]は確率 \\varepsilon \\in \[0,1\] で離反します。離反すると、[[glossary/Block-Building|ビルダー]]は勝者の機会の \\gamma(\\tau) \\in \[0,1\] を捕捉します。リバート保護により、検索者は何も支払いません。タイミングは次のとおりです。

1.  [[glossary/Block-Building|ビルダー]]の離反率 \\varepsilon が既知になります。
    
2.  検索者は参加するかどうかを決定します。n人の参加者が実現します。
    
3.  各参加者 i はシールド入札 b\_i を提出します。
    
4.  確率 \\varepsilon で、[[glossary/Block-Building|ビルダー]]は勝者をフロントランします。確率 1-\\varepsilon で、結果を尊重します。
    

検索者 i のペイオフは次のとおりです。

\\pi(b\_i, v\_i) = \\begin{cases} (1-\\varepsilon)\\, H(\\beta^{-1}(b\_i)\\mid v\_i)(v\_i - b\_i) & \\text{if } b\_i < \\gamma v\_i \\\\ H(\\beta^{-1}(b\_i)\\mid v\_i)(v\_i - b\_i) & \\text{if } b\_i \\ge \\gamma v\_i \\end{cases}

リスクのあるレジーム (b\_i < \\gamma v\_i) では、離反によって確率 \\varepsilon で余剰がゼロになります。安全なレジーム (b\_i \\ge \\gamma v\_i) では、入札がフロントラン価値を超え、[[glossary/Block-Building|ビルダー]]は入札を収集することを弱く好みます。

## 4. 均衡

### リスクのあるレジーム

リスクのあるレジームでは、(1-\\varepsilon) がペイオフを一様にスケーリングし、一階条件から消えます。したがって、均衡入札関数は \\varepsilon に依存せず、補足論文と同じ関連ファーストプライスODEを満たします。

\\beta'(v\_i) = \\frac{h(v\_i \\mid v\_i)}{H(v\_i \\mid v\_i)}\\bigl(v\_i - \\beta(v\_i)\\bigr), \\quad \\beta(0) = 0

### 区分的ナッシュ均衡

各レジームにおける条件付きペイオフを比較すると、リスクのあるレジームでは \\hat{\\pi}(v\_i) = (1-\\varepsilon)(v\_i - \\beta(v\_i))、安全なレジームでは \\tilde{\\pi}(v\_i) = (1-\\gamma)v\_i となり、無差別閾値が定義されます。

\\bar{\\varepsilon}(v\_i) = \\frac{\\gamma v\_i - \\beta(v\_i)}{v\_i - \\beta(v\_i)}

比例的な値引きは競争とともに減少するため、\\bar{\\varepsilon}(v\_i) は v\_i に対して厳密に減少します。任意の固定された \\varepsilon に対して、\\bar{\\varepsilon}(v^\*) = \\varepsilon によって定義される一意のカットオフ v^\* が存在します。対称的なベイジアンナッシュ均衡は次のとおりです。

b^\*(v\_i, \\varepsilon, \\tau) = \\begin{cases} \\beta(v\_i) & \\text{if } v\_i < v^\*(\\varepsilon, \\tau) \\\\ \\gamma(\\tau)\\, v\_i & \\text{if } v\_i \\ge v^\*(\\varepsilon, \\tau) \\end{cases}

### 最適な[[glossary/Block-Building|ビルダー]]離反率

[[glossary/Block-Building|ビルダー]]の期待収益は次のとおりです。

\\mathbb{E}(R(\\varepsilon)) = \\int\_0^{v^\*} \\bigl\[(1-\\varepsilon)\\beta(v) + \\varepsilon\\gamma(\\tau)v\\bigr\] f\_{(1)}(v)\\,dv + \\int\_{v^\*}^\\infty \\gamma(\\tau)v\\, f\_{(1)}(v)\\,dv

\\varepsilon に関して微分し（ライプニッツの法則を使用）、無差別条件を使用して境界項を簡略化すると次のようになります。

\\frac{d\\,\\mathbb{E}(R)}{d\\varepsilon} = \\int\_0^{v^\*} \\bigl\[\\gamma(\\tau)v - \\beta(v)\\bigr\] f\_{(1)}(v)\\,dv - \\frac{dv^\*}{d\\varepsilon}\\, v^\*\\varepsilon(1-\\gamma(\\tau))\\,f\_{(1)}(v^\*)

\\frac{dv^\*}{d\\varepsilon} < 0 であるため、境界項は常に非負です。したがって、最適な離反率は常にコーナー解となります。

-   **高抽出性** (すべての v に対して \\gamma(\\tau)v > \\beta(v))：被積分関数が厳密に正 \\Rightarrow \\varepsilon^\* = 1。
    
-   **低抽出性** (すべての v に対して \\gamma(\\tau)v < \\beta(v))：フロントランの脅威が拘束されない \\Rightarrow \\varepsilon^\* = 0。
    

内部最適解はありません。[[glossary/Block-Building|ビルダー]]が離反するかどうかは、\\gamma(\\tau) が価値のサポート全体で競争入札 \\beta(v) に対して十分に大きいかどうかに完全に依存します。

## 5. 実証分析

実証分析は3つのステップで進められます。賄賂スケジュールの右裾からタイプ固有の回収可能な割合 \\hat{\\gamma}(\\tau) を推定し、観察された収益を離反する[[glossary/Block-Building|ビルダー]]が捕捉しうる余剰に対して分解し、維持された仮定を検証します。

**賄賂スケジュールと** \\hat{\\gamma}(\\tau)**。** 区分的均衡の下では、低価値の検索者は競争スケジュール \\beta(v\_i) で入札し、カットオフ v^\*(\\varepsilon,\\tau) を超えると抑止入札 \\gamma(\\tau)v\_i に切り替えます。実証的な特徴は、右裾のプラトーに平坦化する上昇する賄賂シェアであり、このプラトーが \\hat{\\gamma}(\\tau) を特定します。

![図1: MEVタイプ別の賄賂割合と抽出価値](https://ethresear.ch/uploads/default/optimized/3X/b/5/b5831a5d830c2e74c14768e82896dc38c056632f_2_673x500.png)

サンドイッチ攻撃は90-95%でほぼ平坦です。競争はすでに回収可能な価値のほぼ全体を吸収しているため、\\gamma(\\tau)v > \\beta(v) が拘束されることはめったになく、検出される構造的変化はありません。ネイキッドアービトラージは最も明確な移行を示し、低価値では約45%から始まり、\\hat{\\gamma} = 0.74 でプラトーに達します。バックランは \\hat{\\gamma} = 0.70 付近でプラトーになり、サンプルが小さいためノイズが多い清算は \\hat{\\gamma} = 0.88 まで上昇します。上昇してから平坦になる形状は、区分的均衡の直接的な実証内容です。カットオフを超えると、高価値の検索者はフロントランの脅威を排除するために抑止レベル \\gamma(\\tau)v まで入札します。

**収益分解。** 各トランザクションについて、潜在的な離反利益は \\hat{\\gamma}(\\tau)v\_i - b\_i の正の部分です。タイプ別に集計すると、これは、結果を尊重するのではなく勝者を置き換えることによって離反する[[glossary/Block-Building|ビルダー]]が捕捉しうる余剰です。

![図2: オークション収益と失われたフロントランの余剰](https://ethresear.ch/uploads/default/optimized/3X/2/1/21416e70af3e2f7e07c3f1b294bc5a2ffb3f9866_2_690x392.png)

失われたフロントランの総余剰は4,940万ドルで、観察されたチップの48.8%に相当します。ネイキッドアービトラージが最も多く、1,830万ドルのチップに対して2,430万ドルの損失が発生しています。これは、\\hat{\\gamma} = 0.74 が分布の大部分で平均賄賂シェア67%を超えているためです。清算は、より小規模でノイズの多いサンプルで同じメカニズムを示し、700万ドルのチップに対して1,240万ドルの損失が発生しています。サンドイッチ攻撃は正反対の極端な位置にあり、5,780万ドルのチップに対して730万ドルの損失が発生しています。これは、競争入札がすでにほぼ全価値を抽出しているためです。バックランは中間で、1,830万ドルに対して550万ドルです。

**関連性と集中。** データでは2つの維持された仮定が成り立っています。各ブロックおよびタイプ内で、最大および2番目に大きい対数抽出価値は正の相関があり、関連価値の仮定を支持します。また、抽出された[[glossary/MEV|MEV]]は検索者レベルで高度に集中しており、タイプ間でジニ係数が0.93〜0.97であり、収益分解の右裾解釈を支持しています。これは、少数の高価値機会が失われた余剰のほとんどを占めていることを意味します。

**正直な開示のベンチマーク。** 参照点として、Bergemann et al. (2022) は、*正直な*売り手の収益最大化開示ポリシーを特徴づけており、実効的な入札者数に依存する閾値 \\varepsilon^{\\text{Berg}}(n) を与えています。市場が厚いほどより多くの情報開示を許容し、市場が薄いほど上部テールをより多くプールする必要があることを示しています。

![図3: 実効入札者数によるBergemann開示ベンチマーク](https://ethresear.ch/uploads/default/optimized/3X/2/a/2a1059c035fa06711e2104bc3705b68a44bf2a24_2_690x293.png)

タイプによって経験的に示唆される \\varepsilon は n(\\tau) を通じてタイプ固有であるため、正直なベンチマーク自体は単一の普遍的な処方箋ではなく、タイプ固有です。\\varepsilon^{\\text{Berg}}(n) は、ユーザーに利益をもたらす開示の*上限*として解釈されるべきであり、[[glossary/Block-Building|ビルダー]]の最適な離反率としてではありません。[[glossary/Block-Building|ビルダー]]が観察された情報に基づいて行動できる場合、離反利益が正である限り、許容されるエクスポージャーは正直な開示のベンチマークを下回る必要があります。

## 6. [[glossary/Block-Building|ビルダー]]間の証拠

5つの主要な[[glossary/Block-Building|ビルダー]]がトランザクションの93%を占めています。賄賂スケジュールを[[glossary/Block-Building|ビルダー]]別に分解すると、タイプ固有のパターンは各[[glossary/Block-Building|ビルダー]]内で保持されますが、[[glossary/Block-Building|ビルダー]]間で意味のあるばらつきがあります。

![図4: ビルダーとMEVタイプ別の賄賂割合分布](https://ethresear.ch/uploads/default/optimized/3X/a/8/a83072830bff57c04c67ab15785f1e454b7c5272_2_669x500.png)

サンドイッチ攻撃の賄賂は、[[glossary/Block-Building|ビルダー]]に関係なく95-100%に集中しており、\\hat{\\gamma} \\approx 1 と飽和した競争と一致しています。ネイキッドアービトラージと清算は、[[glossary/Block-Building|ビルダー]]間でより広いばらつきを示しており、タイプ固有の \\gamma(\\tau) 構造と、[[glossary/Block-Building|ビルダー]]間の異なる検索者プールと一致しています。Titanの賄賂の標準偏差はbeaverbuildの約3倍であり、より異質な検索者ベースと一致しています。同じ異質性は需要側にも現れています。より多くのユニークな検索者を引き付ける[[glossary/Block-Building|ビルダー]]は、コモディティ化されたタイプでより高い平均賄賂シェアと低い賄賂変動性を示しますが、専門化されたタイプでは検索者が少なく、ばらつきが大きくなります。この[[glossary/Block-Building|ビルダー]]間の異質性は、次のセクションで利用されます。同じ名目上の離反利益は、[[glossary/Block-Building|ビルダー]]の収益基盤とオーダーフローに応じて、非常に異なるインセンティブ制約を意味します。

## 7. [[glossary/Block-Building|ビルダー]]の離反とインセンティブ整合性

セクション4の結果、すなわち \\varepsilon^\* が \\gamma(\\tau)v が競争入札 \\beta(v) を超えるか下回るかに依存するという結果は、オークションが繰り返される場合にコミットメントが維持できるかどうかという問題を未解決のままにしています。本稿では、静的オークションを[[glossary/Block-Building|ビルダー]]と検索者プールの間の繰り返しゲームに埋め込むことで、そのギャップを埋めます。

### IC条件

期間 t における離反は、一回限りの余剰 \\Delta\_t = \\sum\_{i \\in \\text{round } t} \\max\\{\\gamma(\\tau\_i)v\_i - b\_i,\\, 0\\} をもたらします。ここで、\\max は選択的離反（[[glossary/Block-Building|ビルダー]]は \\gamma v\_j > b\_j であるバンドルのみをフロントランする）を捉えています。確率 p で離反が検出され、検索者プールが離れていくため、[[glossary/Block-Building|ビルダー]]は t+1 以降の継続収益を失います。確率 1-p でゲームは続行されます。期間ごとの割引率 \\delta で2つのパスを比較します。

\\text{NPV}\_h = \\frac{\\pi\_h}{1-\\delta}, \\qquad \\text{NPV}\_d = \\pi\_h + \\Delta + (1-p)\\,\\frac{\\delta}{1-\\delta}\\,\\pi\_h.

差し引くと \\text{NPV}\_d - \\text{NPV}\_h = \\Delta - p\\frac{\\delta}{1-\\delta}\\pi\_h となるため、正直性は次の条件を満たす場合にのみインセンティブ整合的です。

\\Delta \\le p\\,\\frac{\\delta}{1-\\delta}\\,\\pi\_h \\quad\\Longleftrightarrow\\quad \\delta \\ge \\frac{m}{m+p}, \\qquad m \\equiv \\frac{\\Delta}{\\pi\_h}.

正直性は、[[glossary/Block-Building|ビルダー]]が十分に忍耐強く、将来のビジネスフローの割引現在価値が一回限りの誘惑を超える場合にのみ持続可能です。\\delta \\to 0（近視眼的な[[glossary/Block-Building|ビルダー]]）の場合、閾値 m/(m+p) \\to 0 となり、正の \\Delta は離反を引き起こし、セクション4の高抽出性ブランチを回復します。内部の \\delta は内部の \\varepsilon^\* を生成します。

### [[glossary/Block-Building|ビルダー]]ごとの閾値

各[[glossary/Block-Building|ビルダー]]について、パネル全体の離反利益 \\Delta\_b、アクティブな月における平均月間チップ \\pi\_h、月換算の m = \\Delta\_b/\\pi\_h、および正直性のための最小年間割引率を表す年間IC閾値 \\delta^\*\_{yr} = (m/(m+p))^{12} を計算します。

| Builder | \pi_h ($M/mo) | \Delta_b ($M) | m | \delta^*_{yr} (p=1) | \delta^*_{yr} (p=0.1) | \delta^*_{yr} (p=0.01) |
| --- | --- | --- | --- | --- | --- | --- |
| beaverbuild | 3.74 | 10.10 | 2.70 | 0.02 | 0.65 | 0.96 |
| Titan | 2.25 | 9.01 | 4.00 | 0.07 | 0.74 | 0.97 |
| bobTheBuilder | 0.47 | 4.14 | 8.88 | 0.28 | 0.87 | 0.99 |
| rsync-builder | 0.36 | 0.61 | 1.69 | 0.00 | 0.50 | 0.93 |
| BuilderNet | 0.42 | 23.00 | 54.71 | 0.80 | 0.98 | 1.00 |
| BuildAI | 0.15 | 2.06 | 14.00 | 0.44 | 0.92 | 0.99 |
| Ty For The Block | 0.49 | 0.07 | 0.15 | 0.00 | 0.00 | 0.47 |

p = 1（確実な検出の場合）では、BuilderNetのみが妥当なオペレーター割引率を超える閾値を持っています。p が減少すると、拘束領域が拡大します。p = 0.1 では、beaverbuildとTitanの閾値は0.65-0.74であり、p = 0.01 では、すべての主要な[[glossary/Block-Building|ビルダー]]が \\delta^\*\_{yr} > 0.95 となり、わずかな忍耐力の欠如を持つオペレーターにとってもICが失敗することを意味します。複製ベースのフロントランニングには明確なオンチェーンの痕跡がないため、リバートは検索者側から見ると失われたオークションと区別がつかないため、妥当な p はこの範囲の下部にあります。その範囲内では、パネル内のすべての主要な非[[glossary/Trusted-Execution-Environment|TEE]] [[glossary/Block-Building|ビルダー]]でIC制約が拘束されます。

### タイプレベルの分解

m をタイプ別に分解し、分母に月間総収益を置くと（あるタイプでの検出は、そのタイプだけでなく将来のすべてのビジネスを失うため）、m^{\\text{tot}}\_\\tau = \\Delta\_\\tau / \\pi\_h となります。

| Builder | sandwich | naked arb | backrun | liquidation |
| --- | --- | --- | --- | --- |
| beaverbuild | 0.27 | 1.22 | 0.57 | 0.65 |
| Titan | 0.78 | 0.53 | 1.19 | 1.50 |
| bobTheBuilder | 8.65 | 0.00 | 0.23 | — |
| BuilderNet | 0.35 | 38.42 | 0.76 | 15.17 |
| rsync-builder | 0.95 | 0.34 | 0.38 | 0.01 |

m^{\\text{tot}}\_\\tau > 1 のセルは、単一タイプでの離反のみで1ヶ月の正直な総収益を超えることを示しており、中程度の p であっても、そのタイプでの離反のみでICが破綻します。離反する最初のタイプは、[[glossary/Block-Building|ビルダー]]によって体系的に異なります。beaverbuildではネイキッドアービトラージ、Titanでは清算とバックラン、bobTheBuilderではサンドイッチ攻撃、BuilderNetではネイキッドアービトラージと清算であり、これらがBuilderNetの反実仮想的なエクスポージャーの98%を占めています。

### 自然実験としてのBuilderNet

[[glossary/Trusted-Execution-Environment|TEE]]で動作するrbuilderであるBuilderNetは、評判ではなくアーキテクチャ的に \\varepsilon \\equiv 0 を強制します。オペレーターは個々のバンドルペイロードを複製ベースの離反に利用可能な形式で文字通り観察できません。これにより、[[glossary/Block-Building|ビルダー]]間の明確な比較が可能になります。BuilderNetは、主要な[[glossary/Block-Building|ビルダー]]の中で最も低い価値加重賄賂シェア（12.3%）を持っています。これは、検索者が非[[glossary/Trusted-Execution-Environment|TEE]] [[glossary/Block-Building|ビルダー]]に提示する抑止プレミアム \\gamma(\\tau)v が存在しないことを反映しており、入札は競争レベル \\beta(v) に近くなります。しかし、反実仮想的な離反エクスポージャーは群を抜いて最大（m = 54.7）であり、ネイキッドアービトラージと清算に集中しています。[[glossary/Trusted-Execution-Environment|TEE]]アーキテクチャは、評判がなければIC制約が必要とするであろう役割を正確に果たしています。検索者は、最も複製されやすいフローを、離反できない唯一のオペレーターにルーティングします。これは、同じ余剰が他の場所で露出するであろうという理由からです。

2つのアーキテクチャ的対応策がICギャップを埋めます。どちらも評判ではなく構造的に \\varepsilon \\to 0 を推進します。[[glossary/Trusted-Execution-Environment|TEE]]で保護された実行（ペイロードが利用可能な形式で観察できないため、離反は暗号学的に排除される）と、サブスロット構成可能な決済（バンドルはアップストリームのオークション主催者によって決済され、すでにコミットされた義務として[[glossary/Block-Building|ビルダー]]に配信されるため、[[glossary/Block-Building|ビルダー]]は事後的にペイロードを保持せず、p は無関係になる。つまり、構成可能性は2番目の効率チャネルを追加する）です。

## 8. 設計上の示唆

補足論文の推奨事項である、FPSBからイングリッシュオークションまたはSPSBに切り替えて14-28%多くの収益を捕捉するという提案は有効ですが、不完全です。ブロックを最終化する前に、入札とペイロードを観察できる[[glossary/Block-Building|ビルダー]]は、いかなるフォーマットの正直な結果も損なう可能性があります。コミットメントチャネルは、フォーマット選択チャネルと定量的に同等であり、独立して機能します。

関連するセーフガードは、フォーマットの変更ではなく、割り当ての瞬間に[[glossary/Block-Building|ビルダー]]が利用できる情報優位性に対する制約です。例えば、ブロック最終化後までのペイロード暗号化、暗号コミットメントスキーム、または離反を観察可能かつ罰則可能にするスラッシング条件などです。競争に関する遅延または集約された情報は、補足論文で特定されたリンケージの利点の一部を維持しつつ、事後的な操作面を減らすことができます。

したがって、適切な設計には2つの層があります。まず、関連性を利用するフォーマットを選択すること（薄く、中程度に相関する市場にはイングリッシュオークションまたはSPSB）。次に、[[glossary/Block-Building|ビルダー]]が利用できるペイロードと識別情報を制限し、選択されたフォーマットの正直な結果が実際に実装されるようにすることです。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/imperfect-commitment-in-maximal-extractable-value-auctions/25001)
