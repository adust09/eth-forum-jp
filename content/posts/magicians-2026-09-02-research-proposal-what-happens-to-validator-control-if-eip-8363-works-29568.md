---
title: '研究提案: EIP-8363が機能した場合、バリデータの制御はどうなるか'
original_title: 'Research proposal: What happens to validator control if EIP-8363 works'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/research-proposal-what-happens-to-validator-control-if-eip-8363-works/29568
author: chugarchugarr
date: '2026-09-02'
category: Primordial Soup
tags:
  - primordial-soup
  - research
  - eip
  - staking
  - validators
  - economics
  - decentralization
  - mev
  - security
topic_id: '29568'
translated_at: '2026-09-03'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Research proposal: What happens to validator control if EIP-8363 works](https://ethereum-magicians.org/t/research-proposal-what-happens-to-validator-control-if-eip-8363-works/29568) — chugarchugarr (2026-09-02)

[[glossary/EIP|EIP]]-8363に関する議論や、発行量 (issuance)、ソロステーキング、バリデータ経済学、[[glossary/Maximum-Viable-Security|最大実行可能セキュリティ (Maximum Viable Security)]]、ステーキング市場の形式モデルに関する以前の研究を読み進めてきました。[[glossary/EIP-8363|EIP-8363]]自体はこちらです: [https://eips.ethereum.org/EIPS/eip-8363](https://eips.ethereum.org/EIPS/eip-8363)

この分野にはすでに十分な真剣な研究があり、異なる種類のステーカが利回り（yield）の変化に異なる反応を示すことを示す別の一般的なモデルを構築することは有用ではないと考えています。その問題は研究されてきました。私が参考にしている研究には、『Initial Analysis of Stake Distribution』([https://ethresear.ch/t/initial-analysis-of-stake-distribution/19014](https://ethresear.ch/t/initial-analysis-of-stake-distribution/19014))、『Maximum Viable Security: A New Framing for Ethereum Issuance』([https://ethresear.ch/t/maximum-viable-security-a-new-framing-for-ethereum-issuance/19992](https://ethresear.ch/t/maximum-viable-security-a-new-framing-for-ethereum-issuance/19992))、『Impact of Consensus Issuance Yield Curve Changes on Competitive Dynamics in the Ethereum Validator Ecosystem』([https://ethresear.ch/t/impact-of-consensus-issuance-yield-curve-changes-on-competitive-dynamics-in-the-ethereum-validator-ecosystem/21617](https://ethresear.ch/t/impact-of-consensus-issuance-yield-curve-changes-on-competitive-dynamics-in-the-ethereum-validator-ecosystem/21617))、そして『Key Insights from a Formal Framework of the Ethereum Staking Market』([https://ethresear.ch/t/key-insights-from-a-formal-framework-of-the-ethereum-staking-market/22813](https://ethresear.ch/t/key-insights-from-a-formal-framework-of-the-ethereum-staking-market/22813))などがあります。

まだ解決されていないと考えているのは、[[glossary/EIP-8363|EIP-8363]]が[[glossary/stake|ステーク]]される[[glossary/ETH|ETH]]の量を減らすことに成功した場合に、**実際にイーサリアムのバリデータを誰が制御するのか**、という点です。

これらは同じ質問ではありません。

総[[glossary/stake|ステーク]]を減らすことは、集中度（concentration）を減らす可能性があります。また、コストが最も低いオペレーター、[[glossary/MEV|MEV]]経済学が最も強いオペレーター、最も固定客が多いオペレーター、または低いマージンを吸収する能力が最も高いオペレーターが、残りのより大きなシェアを制御する、より小さなバリデータセットを生み出す可能性もあります。セキュリティの議論が最終的に[[glossary/decentralization|分散化]]と捕捉（capture）への耐性に依存するならば、その違いは直接テストするに値するほど重要だと私は考えます。

コンスタンティン・ロマシュク氏と他の著者らが『**Maximum Viable Security**』([https://ethresear.ch/t/maximum-viable-security-a-new-framing-for-ethereum-issuance/19992](https://ethresear.ch/t/maximum-viable-security-a-new-framing-for-ethereum-issuance/19992))で提示したフレームワークには共感しています。そのフレームワークは、発行量（issuance）の最小化をそれ自体が目的であると見なすよりも、私には理にかなっているように思えます。イーサリアムの[[glossary/decentralization|分散化]]、主権（sovereignty）、中立性（neutrality）、および独立した制御の分散（distribution of independent control）は、保護する価値のある高次の特性であると考えています。

しかし、その好みに結論がすでに決定されている研究プロジェクトを始めることも望んでいません。もし[[glossary/EIP-8363|EIP-8363]]がバリデータ制御の分散を改善するならば、その研究はそれを示すことができるはずです。もし制御をより集中させるならば、それも示すことができるはずです。そして、証拠がそれらの結果を区別するのに十分でない場合でも、それは許容される結論として残るべきです。

私が検討している研究は、この問いがここで始まるかのように振る舞うのではなく、既存の最も近いステーキング市場研究を再現することから始めるでしょう。そこから、実際の[[glossary/EIP-8363|EIP-8363]]提案と、現在のイーサリアムのステーキング環境を中心にモデルを更新したいと考えています。これは、古い仮想的な発行量（issuance）削減を代用するのではなく、移行期間（transition period）を含む正確な[[glossary/EIP-8363|EIP-8363]]発行曲線（issuance curve）を使用することを意味します。また、以前のバリデータ経済からの仮定を単に引き継ぐのではなく、ペクトラ（Pectra）後のステーキング環境に合わせて再キャリブレーションすることも意味します。

最も重要だと私が考える部分は、ステーキングモード間の移動です。バリデータを実行するのをやめたソロステーカ（solo staker）が、必ずしも[[glossary/ETH|ETH]]の[[glossary/stake|ステーク]]をやめるわけではありません。彼らはそれを委任するかもしれません。取引所を利用している人は、[[glossary/Liquid-Staking|LST（リキッドステーキングトークン）]]に移行するかもしれません。機関はプロのオペレーターを選ぶかもしれません。資本はステーキング自体を離れることなく、ある形式のステーキングから別の形式へ移動することができ、その移動こそがバリデータ構成（validator composition）の変化が起こりうる場所です。

また、「ステーキングプロバイダー」がもはや十分に正確な単位であるとも思いません。[[glossary/ETH|ETH]]を所有する個人または機関が、必ずしもどこに[[glossary/stake|ステーク]]されるかを決定するエンティティではなく、どこに[[glossary/stake|ステーク]]されるかを決定するエンティティが、その選択がなされた後にそれを移動できるエンティティであるとは限りません。ステーキングプロダクト、ミドルウェア（middleware）、カストディアン（custodian）、ノードオペレーター（node operator）、そしてバリデータオペレーター（validator operator）はすべて異なる場所に存在しうるため、問題が[[glossary/decentralization|分散化]]であるならば、そのチェーンを最後まで追跡する必要があると考えています。つまり、誰が資本を所有し、誰がその行き先を決定し、誰がそれを移動でき、誰がバリデータを運用し、誰がそれらのバリデータを調整でき、そして最終的にどれだけの真に独立した制御の中心が残るのか、ということです。

また、すべての参加者が利回り（yield）の変化に即座に反応すると仮定することも避けたいです。多くの[[glossary/stake|ステーク]]は、リターンのすべてのベーシスポイント（basis point）を最大化することとはほとんど関係のない理由で、おそらく固定されています（sticky）。カストディ関係、規制、税金、機関の義務、技術的能力、スイッチングコスト（switching costs）、慣れ、そして単純な慣性（inertia）がすべて重要です。

既存の研究は、これらのパラメータを実際よりも正確に知っていると見せかけることがいかに危険であるかをすでに示しています。形式的フレームワーク（Formal Framework）の研究は、観察されるステーキング市場から一意のキャリブレーション（calibration）を特定することの難しさを著者らが明示的に議論しているため、特にここで有用です: [https://ethresear.ch/t/key-insights-from-a-formal-framework-of-the-ethereum-staking-market/22813](https://ethresear.ch/t/key-insights-from-a-formal-framework-of-the-ethereum-staking-market/22813)。

したがって、証拠が弱いところでは、コスト、[[glossary/MEV|MEV]]収入、税金、プロバイダー手数料、代替利回り、最低許容リターン、その他の不確実な入力は、1つの数値を選択して印象的な均衡（equilibrium）を生成するのではなく、範囲として扱うことを望んでいます。

私が関心を持つ結果もまた、「ソロ / [[glossary/Liquid-Staking|LST]] / CEX シェア」の別のグラフではありません。結果として得られるバリデータセットが、実際の制御においてより集中するか、あるいはより分散するかを知りたいのです。これには、オペレーター集中度（operator concentration）、独立したオペレーターのシェア、カストディ集中度（custodial concentration）、またはその他の正当な測定基準が含まれる可能性があります。私はまだ特定の指標に固執していません。プロキシ（proxy）でいっぱいのダッシュボードを構築し、それを理解と誤解するよりも、意味のあるものを実際に捉える少数の測定基準を使用したいと考えています。

最初から完全に許容されるべきだと私が考える結果が1つあります。それは、**質問に答えるのに十分な情報がないかもしれない**ということです。

既存の最も強力な研究の中には、すでにこの問題に直面しているものもあります。複数の仮定のセットが、今日観察されるステーキング市場に似たものを再現できます。もし2つの同等に妥当なモデルが[[glossary/EIP-8363|EIP-8363]]について反対の答えを出すことができるならば、私たちが好む答えのモデルを選択することが責任ある行動だとは思いません。その代わりに、イーサリアムが現在十分に理解していない変数は何か、結論がそれらにどれだけ依存するか、そして誰かがより強い主張をする前に実際に何を測定する必要があるかを特定することになるでしょう。

したがって、私が追求したい研究課題は非常にシンプルです。

**もし[[glossary/EIP-8363|EIP-8363]]が[[glossary/staking|ステーキング率]]を低下させる場合、イーサリアムの制御は実際に分散化されるのか？**

発行量（issuance）が減少するか、集計ステーキング率（aggregate staking ratio）が減少するか、またはあるカテゴリーのステーカの収入が減少するか、というだけではありません。参加者が反応する時間を持った後、誰がまだバリデータセットを制御しているのか、そしてその制御の構造が私たちが始めたものよりも意味のある形で良いのか悪いのかを知りたいのです。

これを構築し始める前に、すでにこの問いに答えている研究を見落としていないか確認したいです。もし異種ステーカの行動、ステーキング方法間の移動、現在およびペクトラ後の経済学、そして結果として生じるバリデータ制御（validator control）の分散を組み合わせた[[glossary/EIP-8363|EIP-8363]]に特化した分析をご存知の方がいらっしゃいましたら、ぜひお知らせください。

既存の優れた研究を再現し、それを一歩先に進めることから始める方が、イーサリアムがすでに知っていることを再発見するのに時間を費やすよりもはるかに良いと考えています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/research-proposal-what-happens-to-validator-control-if-eip-8363-works/29568)
