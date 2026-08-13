---
title: '[アイデア] ネイティブイーサリアムデリゲーション (NED) - オペレーターファミリーと集中化準備金'
original_title: >-
  [IDEA] Native Ethereum Delegation (NED) - Operator Families and Concentration
  Reserve
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/idea-native-ethereum-delegation-ned-operator-families-and-concentration-reserve/25699
author: squijello
date: '2026-08-13'
category: Proof-of-Stake
tags:
  - proof-of-stake
  - staking
  - delegation
  - economics
  - mechanism-design
  - sybil-resistance
  - protocol-design
  - consensus
  - mev
topic_id: '25699'
translated_at: '2026-08-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [[IDEA] Native Ethereum Delegation (NED) - Operator Families and Concentration Reserve](https://ethresear.ch/t/idea-native-ethereum-delegation-ned-operator-families-and-concentration-reserve/25699) — squijello (2026-08-13)

これはまだアイデア段階の提案であり、[[glossary/EIP|EIP（Ethereum改善提案）]]ではありません。私は[[glossary/Consensus-Layer|コンセンサス層]]の研究者としてではなく、主にステーキングインセンティブと[[glossary/Mechanism-design|経済メカニズム設計]]の側面からアプローチしています。

質問はシンプルです。

> **イーサリアムが経済的に[[glossary/Native-Ethereum-Delegation|デリゲーション]]を持つことになるのであれば、プロトコルは、ハードな市場シェア上限、バリデータ選挙、または実世界のアイデンティティ要件なしに、集中化された[[glossary/Native-Ethereum-Delegation|デリゲートされた制御]]をオペレーターにとって段階的に高価にしながら、中立的なネイティブ[[glossary/Native-Ethereum-Delegation|デリゲーション]]プリミティブを提供できるでしょうか？**

以前のバージョンでは、ドメインごとの報酬を逓減させることでこれを試みました。しかし、匿名分割によって小さなアイデンティティの方が経済的に有利になるため、これは失敗します。現在の構築では、オペレーターファミリー、線形オペレーターボンド、二次関数的な集中化準備金、およびソース属性付きランオフを使用しています。

## ネイティブ[[glossary/Native-Ethereum-Delegation|デリゲーション]]

イーサリアムはすでに経済的に[[glossary/Native-Ethereum-Delegation|デリゲーション]]を持っています。

**ETH保有者 → ステーキング/[[glossary/Native-Ethereum-Delegation|デリゲーション]]層 → バリデータ**

プロトコルは[[glossary/Native-Ethereum-Delegation|デリゲーション]]関係そのものを提供していません。

[[glossary/Native-Ethereum-Delegation|NED]]の下では、ETH保有者は、[[glossary/Native-Ethereum-Delegation|デリゲートされたステーク]]が要求するスラッシング、引き出し、および[[glossary/Consensus-Layer|コンセンサス層]]のルールに従いながら、ETHの所有権を保持したままプロトコルを通じて[[glossary/Native-Ethereum-Delegation|デリゲート]]できます。

概念的には次のようになります。

**ETH保有者 → オペレーターファミリー → バリデータ**

[[glossary/Native-Ethereum-Delegation|デリゲーター]]はオペレーターを選択します。オペレーターは[[glossary/Native-Ethereum-Delegation|デリゲートされた]]ETHを所有したり、他の場所にリダイレクトしたりしません。

既存のプロバイダーは、[[glossary/Liquid-Staking|LST（リキッドステーキングトークン）]]、流動性、[[glossary/DeFi|DeFi]]統合、保険、機関向けサービス、コンプライアンス、分析、UXを通じて、このプリミティブの上に依然として競争できるでしょう。このアイデアは、ベースとなる[[glossary/Native-Ethereum-Delegation|デリゲーション]]関係を標準化することであり、その上に構築される製品を標準化することではありません。

## オペレーターファミリー

経済単位は、個々のバリデータキーではなく、永続的な暗号学的**オペレーターファミリー**になります。

1つのファミリーが1つのバリデータを運用することも、数千のバリデータを運用することも可能です。複数のプールやバリデータクラスターが同じファミリーを認証できます。人間が読めるブランドはオフチェーンでマッピングできますが、[[glossary/Consensus-Layer|コンセンサス層]]が必要とするのは暗号学的ファミリーIDのみです。

これは隠れた実質所有権の問題を解決するものではありません。オペレーターは別のファミリーを作成できます。重要なのは、正直なサブプールが、バリデータごとに集中化経済をリセットするのではなく、1つの永続的な経済的アイデンティティの下に留まることができるという点です。

## 線形オペレーターボンド

以下を定義します。

-   D\_F = ファミリーFに関連付けられた[[glossary/Native-Ethereum-Delegation|デリゲートされた]]ETH
-   B\_F = オペレーターボンド
-   \\lambda = ボンド単位あたりでサポートされる[[glossary/Native-Ethereum-Delegation|デリゲートされた]]ETHの最大値

要件：

D\_F \\leq \\lambda B\_F

または同等に：

B\_F \\geq \\beta D\_F,\\qquad \\beta=\\frac1\\lambda

[[glossary/Native-Ethereum-Delegation|デリゲーション]]とボンドが比例して分割される場合、

D\_j=\\alpha\_jD,\\qquad B\_j=\\alpha\_jB

すると：

\\frac{D\_j}{B\_j}=\\frac{D}{B}

したがって、より多くのアイデンティティを作成しても、追加のボンド担保型容量は生成されません。

このボンドは集中化の解決策ではありません。これは線形レバレッジ/自己資金投入の制約です。

B\_Fと以下の集中化準備金は、**別個の累積的な会計要件**として扱います。同じETHが両方を同時に満たすべきではありません。

ボンドは生産的であるか、プロトコルから何らかのリターンを得る可能性があります。それは別の設計上の選択です。集中化準備金は意図的に不生産的です。

## 二次関数的な集中化準備金

以下を定義します。

-   D\_F = ファミリーFによって制御される[[glossary/Native-Ethereum-Delegation|デリゲートされた]]ETH
-   \\Theta = ゆっくりと変化する参照[[glossary/Native-Ethereum-Delegation|デリゲーション]]質量

不生産的なオペレーター資本を定義します。

Z\_F=\\frac{D\_F^2}{2\\Theta}

「不生産的」とは、通常のステーキング発行益を得ず、[[glossary/Native-Ethereum-Delegation|デリゲーション]]容量を増加させず、[[glossary/Native-Ethereum-Delegation|デリゲートされた]]ETHとしてカウントされないことを意味します。

その限界要件は次のとおりです。

\\frac{\\partial Z\_F}{\\partial D\_F} = \\frac{D\_F}{\\Theta} = s\_F

ここで：

s\_F=\\frac{D\_F}{\\Theta}

したがって、次の[[glossary/Native-Ethereum-Delegation|デリゲーション]]単位には、ファミリーの現在のシェアとほぼ等しい不生産的なオペレーター資本が必要です。

| ファミリーシェア | 平均準備金 / [[glossary/Native-Ethereum-Delegation|デリゲートされた]]ETH | 限界準備金 |
| --- | --- | --- |
| 0.1% | 0.05% | 0.1% |
| 1% | 0.5% | 1% |
| 5% | 2.5% | 5% |
| 10% | 5% | 10% |
| 20% | 10% | 20% |

ハードな集中化上限はありません。追加の集中化は、段階的にオペレーター資本をより多く消費します。

Z\_Fも追加のファーストロス資本としてスラッシュ可能であるべきかどうかは未定です。スラッシュ可能であるとしても、B\_Fとして二重にカウントされるべきではありません。

## オペレーター経済学

仮定します。

-   y = 生産的なETHに対するステーキングリターン
-   \\phi = [[glossary/Native-Ethereum-Delegation|デリゲートされた]]報酬に対するオペレーターの実効手数料率
-   r\_B = ボンド資本1単位の年間維持コスト（ボンドが得るリターンを差し引いたもの）
-   r\_Z = 不生産的な準備金資本1単位の年間維持コスト

[[glossary/Native-Ethereum-Delegation|デリゲーション]]の追加単位は、オペレーター収益を約：

\\phi y

線形ボンドは限界維持コストを追加します。

\\beta r\_B

二次準備金は限界維持コストを追加します。

s\_Fr\_Z

したがって、他の運用コストを考慮する前に：

\\frac{\\partial \\Pi\_F}{\\partial D\_F} \\approx \\phi y-\\beta r\_B-s\_Fr\_Z

したがって、内部限界無差別点は次のとおりです。

s\_F^\* \\approx \\frac{\\phi y-\\beta r\_B}{r\_Z}

ただし、分子が正であり、結果が0から1の間にある場合に限ります。

これにより、両方の失敗境界が明らかになります。

もし：

\\beta r\_B\\geq\\phi y

であれば、集中度がゼロであっても[[glossary/Native-Ethereum-Delegation|デリゲーション]]は非収益的です。\\beta=1/\\lambdaなので、大まかな実行可能性条件は、他の運用コストを考慮する前に：

\\lambda>\\frac{r\_B}{\\phi y}

反対の極端な場合、もし：

\\frac{\\phi y-\\beta r\_B}{r\_Z}\\geq1

であれば、市場シェア100%になるまで内部的な経済的停止点はありません。

r\_Z\\rightarrow0

となると、計算された停止点は発散します。

したがって、このメカニズムは、適格な準備金資本が実質的に無料であるオペレーターに対して、[[glossary/Decentralization|分散化]]を保証するものではありません。

以前の直感：

s\_F^\*\\approx\\phi

は、約：

r\_B\\approx0,\\qquad r\_Z\\approx y

の場合の特殊なケースにすぎません。

これは、資本コストが異なるため重要です。オペレーターは、次の最適な用途がステーキングではない戦略的またはその他の遊休適格財務資本を持っている可能性があります。これにより、r\_Z<yとなる可能性があります。オペレーターが法的および契約上使用を許可されていない限り、顧客のカストディETHが利用可能であるとは仮定しません。

したがって、このメカニズムは集中化に価格を付けますが、オペレーター間で同一の停止点を保証するものではありません。

## ファミリー制御の承認

ファミリーは新規[[glossary/Native-Ethereum-Delegation|デリゲーション]]を制限または閉鎖できる必要があります。そうしないと、攻撃者がファミリーに[[glossary/Native-Ethereum-Delegation|デリゲーション]]を強制し、資本要件を増加させることで妨害（grief）する可能性があります。

ファミリーは、どれだけの[[glossary/Native-Ethereum-Delegation|デリゲーション]]を受け入れるかを決定します。容量が満杯になると、新規[[glossary/Native-Ethereum-Delegation|デリゲーター]]は他の場所を選択します。

これが意図された競争圧力です。プロトコルはオペレーターが「大きすぎる」と判断するのではなく、オペレーターが次の単位を受け入れる価値があるかどうかを判断します。

## 分割が正確な量を隠す理由

D=\\sum\_iD\_i

の場合、分割されていない準備金は：

\\frac{D^2}{2\\Theta}

展開すると：

\\frac{\\left(\\sum\_iD\_i\\right)^2}{2\\Theta} = \\sum\_i\\frac{D\_i^2}{2\\Theta} + \\sum\_{i<j}\\frac{D\_iD\_j}{\\Theta}

最初の項は、分割されたアイデンティティが目に見えて支払うものです。

2番目の項は、1つの経済的ポジションが独立したアイデンティティとして表現されるときに正確に消えるものです。

したがって、ここでの[[glossary/Sybil-attacks|シビル問題]]は次のとおりです。

> **アイデンティティ分割はクロス項を隠蔽する。**

プロトコルは一般的に隠れた所有権を発見することはできませんが、[[glossary/Native-Ethereum-Delegation|再デリゲーション]]イベントが瞬時の準備金払い戻しを生み出すのを止めることはできます。

## ソース属性付き準備金ランオフ

ネイティブ[[glossary/Native-Ethereum-Delegation|再デリゲーション]]の場合：

x:A\\rightarrow B

AとBの転送前の[[glossary/Native-Ethereum-Delegation|デリゲーション]]をaとbとします。

転送前：

Q\_{\\text{before}} = \\frac{a^2+b^2}{2\\Theta}

転送後：

Q\_{\\text{after}} = \\frac{(a-x)^2+(b+x)^2}{2\\Theta}

転送が現在の二次準備金を減少させる場合、その減少分をソースファミリーAが所有するランオフ残高に正確に追加します。

G\_{A\\rightarrow B} = \\max \\left( 0, Q\_{\\text{before}}-Q\_{\\text{after}} \\right)

これは次のように簡略化されます。

G\_{A\\rightarrow B} = \\max \\left( 0, \\frac{x(a-b-x)}{\\Theta} \\right)

そして：

R\_A\\leftarrow R\_A+G\_{A\\rightarrow B}

グローバルなランオフ変数も、ペアワイズファミリーグラフもありません。

定義：

Q=\\sum\_F\\frac{D\_F^2}{2\\Theta}

そして：

C=Q+\\sum\_FR\_F

固定された\\Thetaにおいて、スケジュールされたランオフリリース前は：

-   [[glossary/Native-Ethereum-Delegation|再デリゲーション]]がQを減少させる場合、正確な減少分がソースランオフに追加されます。
-   [[glossary/Native-Ethereum-Delegation|再デリゲーション]]がQを増加させる場合、ランオフは追加されません。

したがって：

\\boxed{C\_{t+1}\\geq C\_t}

純粋なネイティブ[[glossary/Native-Ethereum-Delegation|再デリゲーション]]遷移の場合。

### 例：正直なリバランス

Aが10%、Bが5%で、1%がAからBに移動します。

共通の正規化を無視すると：

10^2+5^2=125

が：

9^2+6^2=117

になります。正味の減少は8なので、Aはランオフ8を受け取ります。

A自身の項は19減少しましたが、Bの項は11増加しました。したがって、Aは即座に11の準備金リリースを受け取り、8をランオフとして保持します。Bは通常の準備金のみを請求されます。

ランオフがリリースされるにつれて、システムは真に低集中度の状態を認識します。

### 例：新しいファミリーへの分割

Aが10%、Bが空で、4%がAからBに移動します。

転送前：

10^2=100

転送後：

6^2+4^2=52

したがって：

R\_A\\leftarrow R\_A+48

そして：

36+16+48=100

Aは16をリリースします。Bは16をポストする必要があります。もし両者が密かに同じ所有者を持っている場合、分割の瞬間にオペレーター資本は解放されません。

### パスプロパティ

同じ固定\\Thetaの下での[[glossary/Native-Ethereum-Delegation|再デリゲーション]]のシーケンスについて、以下を定義します。

\\Delta\_k=Q\_{k-1}-Q\_k

そして：

g\_k=\\max(0,\\Delta\_k)

すると：

\\sum\_kg\_k \\geq \\sum\_k\\Delta\_k = Q\_0-Q\_n

したがって、細分化や再順序付けによって、エンドポイントによって示される正味の準備金減少を下回る総累積ランオフが減少することはありません。それは等しいか、増加するだけです。

ソースファミリー間の帰属はパスに依存します。

## ランオフが検出しないもの

ランオフは隠れた所有権検出器ではありません。

仮定します。

a=10,\\qquad b=6,\\qquad x=4

すると：

G\_{A\\rightarrow B}=0

なぜなら：

10^2+6^2=6^2+10^2

転送によって現在の準備金は解放されません。

もしAとBが密かに所有者を共有している場合、その盲点は転送前から存在していました。それらを1つの16単位のファミリーとして扱うと、すでに隠されていたクロス項が含まれることになります。

\\frac{10\\cdot6}{\\Theta} = \\frac{60}{\\Theta}

イベントレベルのランオフルールは、イベント発生前にすでに不可視であった共通所有権を再構築することはできません。

したがって：

> **ソースランオフは、準備金を減少させる転送が瞬時の資本洗浄を生み出すのを防ぎます。それは、すでに複数のプロトコルから区別できないファミリーを構築している共通の所有者に遡って価格を付けることはできません。**

これは一般的な[[glossary/Sybil-attacks|シビル]]境界に属し、ランオフ会計には属しません。

## 有界な状態

これは[[glossary/Native-Ethereum-Delegation|デリゲーター]]ごとの系統やペアワイズファミリー状態を必要としません。

各ファミリーには以下が必要です。

-   [[glossary/Native-Ethereum-Delegation|デリゲーション]] D\_F
-   オペレーターボンド/資本状態
-   ソースランオフ R\_F
-   最終ランオフ更新エポック

したがって、追加のランオフ状態は次のようになります。

O(\\text{families})

O([[glossary/Native-Ethereum-Delegation|再デリゲーション]])やO(ファミリーペア)ではありません。

ファミリーレコードは、[[glossary/Native-Ethereum-Delegation|デリゲーション]]、ボンド、ランオフがすべてゼロになった後、アンチステートスパムルールに従って最終的に削除できます。

R\_Fは発生時にETH建てであり、後で\\Thetaが変更されても自動的にリベースされません。

考えられるランオフルールの一つは次のとおりです。

R\_F(t+\\Delta)=\\rho^\\Delta R\_F(t)

ここで：

0<\\rho<1

正確なリリース曲線は未定ですが、その時間スケールは意図的な完全な出口洗浄（full-exit laundering）に対して調整されるべきです。

以下を定義します。

-   L\_{\\text{wash}} = プロトコルで実行可能な最速の完全な出口と新規再参入
-   \\eta = その期間後に残るべきランオフの最小割合

要件：

\\rho^{L\_{\\text{wash}}}\\geq\\eta

Hがランオフの半減期である場合：

H \\geq L\_{\\text{wash}} \\frac{\\ln2}{\\ln(1/\\eta)}

\\eta=1/2の場合：

H\\geq L\_{\\text{wash}}

関連するベンチマークは、プロトコルで実行可能な最速の洗浄サイクルであり、現在の平均キューではありません。

有限のランオフは、隠れた所有権を永久に解決することはできません。それは、代替ポジションが確立される前に、通常の引き出し/再参入がソースのカウンターウェイトのほとんどを消去するのを防ぐだけです。

## 完全な出口

[[glossary/Native-Ethereum-Delegation|デリゲーター]]は、ネイティブ[[glossary/Native-Ethereum-Delegation|再デリゲーション]]と通常の完全な引き出しの両方を保持すべきです。

xがAを完全に離れる場合、代替準備金をポストする宛先ファミリーはありません。

解放される現在の準備金は：

G\_{A\\rightarrow\\varnothing} = \\frac{a^2-(a-x)^2}{2\\Theta} = \\frac{x(2a-x)}{2\\Theta}

であり、その金額がR\_Aに追加されます。

ユーザーは自由に引き出すことができます。以前にコミットされたオペレーター資本が徐々にランオフされます。

> **[[glossary/Native-Ethereum-Delegation|デリゲーター]]のモビリティは、オペレーターの会計上の記憶喪失を必要としません。**

忍耐強い攻撃者は、最終的に有限のランオフを待ち、隠れた関連会社を通じて再参入することができます。これはアイデンティティ情報なしには排除できません。

## [[glossary/Sybil-attacks|シビル]]境界

根本的な限界があります。

Douceurの古典的な**The [[glossary/Sybil-attacks|Sybil Attack]]**の結果は、信頼できる認証局を持たない分散型システムにおける一般的なアイデンティティ問題を記述しています。

[[glossary/Native-Ethereum-Delegation|NED]]は意図的に実世界のアイデンティティを避けているため、2つの世界を考えます。

1.  ファミリーXとYは独立して所有されている。
2.  XとYは密かに同じ所有者を共有している。

プロトコルから見えるすべての事実が同一である場合、それらの観測のみに基づくプロトコルルールは、これらの世界を区別できません。

同じ設計境界の時間的なバージョンもあります。もし隠れた分割が永続的な年間利益c>0を生み出し、ランオフまたはクールダウンが有限のコストKしか生み出さない場合、最終的には：

cT>K

したがって：

> **プロトコルが持たないアイデンティティ情報を永久に代替できる有限の時間ペナルティは存在しない。**

これらは文字通り同じ定理ではありませんが、同じ[[glossary/Mechanism-design|メカニズム設計]]の境界を表現しています。

より広範な[[glossary/Sybil-attacks|シビル]]文献も同じ方向を指しています。Platt、Platt、McBurneyはパーミッションレス性/[[glossary/Sybil-resistance|シビル耐性]]/自由度のトリレンマを形式化し、Chitra、Penna、Schneiderは、リステーキング/スラッシングモデルにおける2種類の分割攻撃に対するより狭い不可能性を証明しています。

したがって、[[glossary/Native-Ethereum-Delegation|NED]]は普遍的な[[glossary/Sybil-resistance|シビル耐性]]を主張すべきではありません。

そのより狭い目標は、経済的に統一された[[glossary/Native-Ethereum-Delegation|デリゲートされた制御]]を、オペレーターが実際に追加の資本を供給するか、別個の[[glossary/Native-Ethereum-Delegation|デリゲーション]]需要を獲得するか、時間/資本の摩擦を受け入れるか、または真に独立した障害ドメインを作成しない限り、独立していると偽装するのをコストがかかるようにすることです。

## 異なる集中化問題

いくつかの事柄は「ステーキング集中化」としてまとめられることが多いですが、同じ問題ではありません。

**[[glossary/Native-Ethereum-Delegation|デリゲートされたコンセンサス集中化]]**は、[[glossary/Native-Ethereum-Delegation|NED]]の主要なターゲットです。同じオペレーターファミリーによってどれだけの[[glossary/Native-Ethereum-Delegation|デリゲートされたコンセンサス]]ウェイトが制御されているかという問題です。

**運用上の相関**は、インフラストラクチャ、クライアント、またはその他の障害ドメインを共有し、したがって一緒に障害が発生するバリデータに関するものです。これは有用な二次シグナルを提供するかもしれませんが、所有権のオラクルとして扱われるべきではありません。

**規制/ポリシーの相関**はまた異なります。独立したアクターが同じインクルージョンまたはフィルタリングの決定を下すのは、同じ制裁体制、法的助言、またはポリシー制約に直面しているためです。これは共通の所有権なしの相関です。

**[[glossary/Block-Building|ブロック構築]]/[[glossary/Censorship-Resistance|検閲]]集中化**は、特殊化されたビルダーとリレーに関するものです。[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]は、その層でのトランザクションインクルージョン/[[glossary/Censorship-Resistance|検閲耐性]]に対処します。[[glossary/Native-Ethereum-Delegation|NED]]はそれを解決すると主張すべきではなく、[[glossary/FOCIL|FOCIL]]は[[glossary/Native-Ethereum-Delegation|デリゲートされたコンセンサス集中化]]を解決しません。

## 二次シグナルとしての運用上の相関

もし、独立しているとされているファミリーが、インフラストラクチャや共通の依存関係を共有しているために繰り返し同時に障害を起こす場合、相関する挙動はアイデンティティを考慮しないリスクシグナルを提供する可能性があります。

これは、一時的な追加資本要件を生み出す可能性があります。

しかし、これは補完的なものであり、主要なものであってはなりません。共通のネットワークイベント、クライアントのバグ、その他の交絡因子は、誤検知を危険なものにします。

もしオペレーターが、独立しているとされているシステムを実際に運用上独立させることで対応するなら、イーサリアムはとにかく[[glossary/Decentralization|分散化]]の恩恵の一部を受けていることになります。

## 参照質量 \\Theta

瞬時の総[[glossary/Native-Ethereum-Delegation|デリゲートされた]]ETHは、市場全体のショックがオペレーターが何もしていない場合でも準備金要件を突然変更する可能性があるため、不適切な分母です。

したがって、\\Thetaは、定義された会計期間にわたってゆっくりと変化する、区分的定数参照であるべきです。

期間内の[[glossary/Native-Ethereum-Delegation|再デリゲーション]]/ランオフ計算は固定された\\Thetaを使用します。\\Thetaの更新は、システム全体の別個の再キャリブレーションです。

既存のR\_Fは、その再キャリブレーション全体でETH建てのままです。

### ブートストラップガード

ゼロからの導入では、明示的なゼロでない分母が必要です。

候補となる形式は次のとおりです。

\\Theta\_t = \\max \\left( \\widehat{T}\_{\\text{NED},t}, \\Theta\_{\\text{boot},t} \\right)

ここで、\\widehat{T}\_{\\text{NED},t}は平滑化されたネイティブ[[glossary/Native-Ethereum-Delegation|デリゲーション]]参照であり、\\Theta\_{\\text{boot},t}>0はブートストラップフロアであり、アクティブ[[glossary/stake|ステーク]]などのより広範なプロトコル規模の量から導出される可能性があります。

これは主に初期化/ショックガードです。

もし\\Thetaが実際のネイティブ[[glossary/Native-Ethereum-Delegation|デリゲートされた]]ETHと等しい場合、D\_F\\leq\\Thetaなので：

\\frac{Z\_F}{D\_F} = \\frac{D\_F}{2\\Theta} \\leq \\frac12

通常の準備金比率は有界です。病的なケースは、ゼロ起動分母、または\\Thetaがライブ[[glossary/Native-Ethereum-Delegation|デリゲーション]]に対して小さくなりすぎる参照ルールです。

もし\\Thetaの更新によってオペレーターが一時的に準備金不足になった場合、既存の[[glossary/Native-Ethereum-Delegation|デリゲーター]]を強制的に排出するのではなく、新規[[glossary/Native-Ethereum-Delegation|デリゲーション]]の承認を凍結します。

## 新規オペレーター

新しいオペレーターは低い集中度から始まるため、二次準備金は少なくなります。実際のボンドはすぐにカウントされます。

これは一般的な年齢/成熟度割引よりも好ましいと思われます。

事前に空のアイデンティティを駐車するだけでは、[[glossary/Native-Ethereum-Delegation|デリゲーション]]規模や累積された経済的利益は得られません。これは、複数の真に実質的なファミリーを辛抱強く構築することとは異なります。後者は上記の隠れた所有権の境界に該当します。

## [[glossary/Liquid-Staking|LST]]と既存のプロバイダー

[[glossary/Native-Ethereum-Delegation|NED]]はネイティブ[[glossary/Liquid-Staking|リキッドステーキングトークン]]を作成しません。

既存のプロトコルはネイティブ[[glossary/Native-Ethereum-Delegation|デリゲーション]]をラップし、流動性、[[glossary/DeFi|DeFi]]統合、保険、機関向け製品、UXを提供し続けることができます。

主要な未解決の疑問は、ラッパーが単に別の層で集中化を再構築するかどうかです。

また、[[glossary/Native-Ethereum-Delegation|NED]]はLido、Coinbase、Chorus One、または一般的にプロバイダーに反対するものではないと考えています。

成功したプロバイダーは、[[glossary/Native-Ethereum-Delegation|デリゲーター]]が引き続きそれを選択し、プロバイダーが必要な資本を経済的に正当化できる限り、大規模なままでいることができます。このメカニズムは、規模がオペレーター側のコストを伴うように意図されており、規模を禁止するものではありません。

## 以前の作業との関係

いくつかの部分は明確な先行研究があります。

-   **eODS (Enshrined Operator Delegator Separation)** は、プロトコルネイティブなオペレーター/[[glossary/Native-Ethereum-Delegation|デリゲーター]]分離を探求しており、このアイデアのネイティブ[[glossary/Native-Ethereum-Delegation|デリゲーション]]側にとって最も近い基盤であると思われます。
-   **Optional non-KYC validator metadata** は、暗号学的に自己認証されたバリデータ/オペレーターの提携を探求しています。
-   **[[glossary/EIP|EIP-7716]]および関連する反相関研究**は、相関するバリデータ挙動に対するアイデンティティを考慮しないペナルティを探求しています。
-   他のステーキングシステムは、オペレーターの誓約/ボンドおよびプール飽和のアイデアに関する先行技術を提供しています。
-   **Douceur (2002)、Plattら、Chitraら**は、関連する形式的な[[glossary/Sybil-attacks|シビル]]/不可能性の結果を提供しています。

ネイティブ[[glossary/Native-Ethereum-Delegation|デリゲーション]]、オペレーターボンディング、自己申告による提携、飽和、または反相関インセンティブが個々に斬新であるとは思いません。

私が最も関心を持っている部分は、以下の組み合わせです。

-   二次関数的なファミリーレベルの集中化準備金
-   暗号学的オペレーターファミリー
-   独立した線形ボンドと凸型準備金
-   ソース属性付きイベントレベルのランオフ
-   ファミリーごとの有界なランオフ状態
-   明示的な[[glossary/Sybil-attacks|シビル]]/不可能性の境界

目標は、隠れた所有者を特定することではありません。それは、観測可能な再分割イベントが、累積された集中化コストを瞬時に消滅させるのを防ぐことです。

## この候補モデルで正確なもの

述べられた会計ルールを考慮すると：

**宣言された1つのファミリー内でのバリデータ分割：** 経済学がファミリーレベルで集約されるため、中立的です。

**比例的なボンド分割：** D/Bが変化しないため、中立的です。

**追跡されたネイティブ[[glossary/Native-Ethereum-Delegation|再デリゲーション]]：** 固定された\\Thetaにおいて、ソース属性付きランオフは、ランオフリリース前の準備金を減少させる[[glossary/Native-Ethereum-Delegation|再デリゲーション]]の瞬間に

Q+\\sum\_FR\_F

が減少できないことを保証します。

**細分化/再順序付け：** 累積されたランオフは、エンドポイントの準備金減少によって下限が設定されます。

これらの記述は、既存の隠れた共通所有権が特定されたことを意味するものではありません。

## 未解決の課題

この構築は、分散型オペレーター市場を保証するものではありません。

隠れた実質所有権を特定するものではありません。

以下の点を確立するものではありません。

-   ネイティブ[[glossary/Native-Ethereum-Delegation|デリゲーション]]自体が望ましいかどうか
-   正しい\\lambda、r\_Bに関連するボンド設計、またはZ\_Fスラッシング処理
-   正しい\\Thetaの平滑化/ブートストラップルール
-   正しいランオフ半減期/リリース曲線
-   ファミリー作成/ステートスパムルール
-   安全な運用上の相関会計
-   バリデータの有効残高、出口、引き出しとの適切な相互作用
-   [[glossary/Liquid-Staking|LST]]/アプリケーション層の集中化がどのように進化するか

もし準備金資本がほとんど無料である場合、内部的な自己制限がない可能性があります。もし線形ボンドが高すぎる場合、実行可能な[[glossary/Native-Ethereum-Delegation|デリゲーション]]市場がない可能性があります。

これらは明示的な経済的境界であり、メカニズムが回避すると主張するものではありません。

可能な限り、パラメータは理想的には長期的な固定ルールであるか、頻繁な裁量的なオフチェーンガバナンスを必要とせずにプロトコルから観測可能な量から導出されるべきです。

## 特にフィードバックをいただきたい質問

1.  プロトコルレベルでネイティブ[[glossary/Native-Ethereum-Delegation|デリゲーション]]は望ましいでしょうか？
2.  暗号学的オペレーターファミリーは合理的な経済単位でしょうか？
3.  Z\_F=D\_F^2/(2\\Theta)は、オペレーター側の合理的な凸型集中化コストでしょうか？
4.  より良い凸型準備金関数はありますか？
5.  ファミリーごとの1つのソースランオフ残高R\_Fは、[[glossary/Consensus-Layer|コンセンサス層]]効率的な構築でしょうか？
6.  どのランオフルールが、真の非集中化と完全な出口洗浄のバランスを最もよく取りますか？
7.  \\Thetaはどのように初期化され、フロア設定され、更新されるべきでしょうか？
8.  \\beta r\_B<\\phi yを維持する最小線形ボンドはどれくらいで、B\_Fは生産的なままであるべきでしょうか？
9.  ファミリー制御の[[glossary/Native-Ethereum-Delegation|デリゲーション]]承認は、望ましいUXと互換性がありますか？
10. 相関するバリデータ挙動は二次的な役割を果たすべきでしょうか？
11. Z\_Fはスラッシュ可能であるべきでしょうか、また損失の連鎖はどうあるべきでしょうか？
12. [[glossary/Native-Ethereum-Delegation|デリゲーション]]は、有効残高、アクティベーション、出口、引き出し資格情報とどのように相互作用すべきでしょうか？
13. [[glossary/Liquid-Staking|LST]]と[[glossary/DeFi|DeFi]]ラッパーは、ファミリーレベルの会計とどのように相互作用するでしょうか？
14. 二次準備金とソースランオフの構築は、以前の作業にすでに存在しますか？
15. 同じ目的を達成するよりシンプルな構築はありますか？

## 結び

私は完成した実装を規定しようとしているわけではありません。

元の報酬逓減型構築は、匿名分割が直接経済性を向上させたため失敗しました。

現在の候補は、集中化された[[glossary/Native-Ethereum-Delegation|デリゲートされた制御]]がオペレーター資本を増加させるようにし、ソース属性付きランオフを使用することで、準備金を減少させる[[glossary/Native-Ethereum-Delegation|再デリゲーション]]が、単に[[glossary/stake|ステーク]]を複数のアイデンティティに再分割するだけで瞬時に資本の払い戻しを生み出すことを防ぎます。

これは、隠れた実質所有権を明示的に解決するものでは**ありません**。その境界は、信頼できるアイデンティティを追加しない限り、根本的なものと思われます。

もしこの方向性に価値があるならば、アイデア段階のメカニズムを一人で完成したプロトコルにしようとするよりも、すでにイーサリアムのステーキング、[[glossary/Consensus-Layer|コンセンサス層]]、[[glossary/Mechanism-design|メカニズム設計]]に取り組んでいる人々との議論を通じて仕様が発展するのを見たいと思います。

作業名は**[[glossary/Native-Ethereum-Delegation|ネイティブイーサリアムデリゲーション (NED)]]**です。

非公式には、**[[glossary/Flanders-Protocol|フランドルプロトコル]]**です。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/idea-native-ethereum-delegation-ned-operator-families-and-concentration-reserve/25699)
