---
title: 'SPREAD: 効率的な匿名伝播でGossipSubを拡張する'
original_title: 'SPREAD: Extending GossipSub with Efficient Anonymous Dissemination'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/spread-extending-gossipsub-with-efficient-anonymous-dissemination/25343
author: MatheusFranco99
date: '2026-07-02'
category: Networking
tags:
  - networking
  - consensus
  - security
  - privacy
  - protocol-design
  - gossipsub
  - dandelion
topic_id: '25343'
translated_at: '2026-07-03'
translator: gemini-2.5-flash
---

> [!note] 原文
> [SPREAD: Extending GossipSub with Efficient Anonymous Dissemination](https://ethresear.ch/t/spread-extending-gossipsub-with-efficient-anonymous-dissemination/25343) — MatheusFranco99 (2026-07-02)

著者: Diogo Cardoso, Matheus Franco, Rodrigo Rodrigues

*謝辞:* この研究は、リスボン大学に授与された **SSV Network DAO** からの[助成金](https://forum.ssv.network/t/ssv-x-university-of-lisbon-grant-proposal-blockchain-research-p2p/1939)によって支援されました。

ドラフト仕様は `libp2p/specs` に提案されました ([PR #726](https://github.com/libp2p/specs/pull/726))。
参照実装は `go-libp2p-pubsub` で公開されています ([PR #717](https://github.com/libp2p/go-libp2p-pubsub/pull/717))。

## 概要

GossipSubは、イーサリアムのようなエコシステムにおける社会的に重要なプロトコルの基盤となる主要な通信インフラです。ゴシッププロトコルのいくつかの特性、すなわち堅牢性、スケーラビリティ、シンプルさは、これを興味深い通信基盤にしています。しかし、匿名性（メッセージの真の送信元を隠すこと）という重要な特性は、送信者に対する標的型攻撃を避けるために望ましいと時々言及されますが、実際にはGossipSubでは達成できないことがよく知られており、標的型サービス拒否（denial-of-service）の道を開いています。Dandelion++のようにランダムウォークで伝播を開始するという自然な防御策は、匿名性を獲得しますが、イーサリアムコミュニティが[[glossary/Consensus-Layer|コンセンサス層]]には実行不可能とすでに判断したレイテンシコストを伴います。スロット時間が12秒から6秒に短縮される予定は、その予算をさらに厳しくするだけです。

私たちは、両方の長所を目指すGossipSubの拡張であるSPREAD（Secure Peer-to-Peer Relay for Efficient Anonymous Dissemination）を提案します。これは、送信者の匿名化解除に対するハードルを上げると同時に、伝播効率を実際に向上させます。SPREADは2つのメカニズムを組み合わせています。1つは、パフォーマンスに大きなペナルティを与えることなくメッセージの送信元を不明瞭にするローカルな[[glossary/Random-Walk|ランダムウォーク]]、もう1つは、コストのかかる長距離ホップを避けるために近くのノードを足がかりとして使用することで、低レイテンシで世界中に到達する地理的に指向された伝播です。私たちはこれをgo-libp2p-pubsubのフォーク上でオプトインで後方互換性のある拡張として実装し、GossipSubおよびDandelion++と比較して、実際の実装を用いて評価しました。私たちの目標は、送信元の区別不能性が敵対者の観測能力に依存する定量的な特性であり、絶対的な保証ではないため、匿名化解除を完全に防ぐことではなく、そのハードルを上げることであることに注意してください。

## 用語と定義

**Curious Nodes (Honest-but-Curious Observers)** - プロトコルを正しく実行するが、観測されたトラフィックパターンから追加情報（例：特定のメッセージの送信元）を推測しようとするノード。

**Fanout** - ノードが伝播ステップ中にメッセージを転送するピアの数。

**Random Walk** - 各ノードがメッセージを単一のランダムに選択されたピアに転送する（確率的な分岐を伴う可能性のある）転送戦略。

**Virtual Coordinates** - 合成幾何学的空間のノードに割り当てられたレイテンシ推定座標で、直接測定せずにネットワーク距離を推定できる。

**Bernoulli Trial** - それぞれの確率値によってパラメータ化された2つの結果（成功/失敗）を持つ確率的決定メカニズム。

**Stretch** - 実際のエンドツーエンド配信レイテンシと、送信者と受信者の間の直接的（通常は最適）な通信レイテンシの比率として定義されるパフォーマンス指標。

**Deanonymization Accuracy** - 敵対者が、攻撃者によって制御されるノード間のタイミング観測に基づいて、メッセージの元の送信者を正しく推測する割合。

**Cluster** - 近くのノードのグループ。つまり、[[glossary/Virtual-Coordinates|仮想座標]]空間で互いに近く、したがって低レイテンシで通信するノード。

**Cobra Walk (Coalescing-Branching Random Walk)** - 各ノードが分岐係数で与えられた数のランダムな隣接ノードにメッセージを転送する[[glossary/Random-Walk|ランダムウォーク]]のバリアントで、常に単一のピアに転送するのではなく、ウォークが時折分岐することを可能にする。

**Voronoi Diagram (Dirichlet Tessellation)** - 参照点（重心）のセットに従って空間を領域に分割するもので、各領域はその重心に他のどの重心よりも近い空間の部分を含む。

## 動機

ゴシッププロトコルが特定のメッセージの元の送信者の匿名性を保護するのに役立つという一般的な理解にもかかわらず、GossipSubの開発者や多くのユーザーは、それがそのような保証を提供するように設計されておらず、また提供できないことを知っています。特に、少数のリスナーノードでメッセージのタイミングを観察することで、GossipSubレイヤーに対する単純な攻撃が可能であり、集中型コーディネーターがタイミングを相関させてゴシップメッセージの真の送信元を推測することができます。この種の受動的、タイミングベースの攻撃は、最初にBitcoinで実証され、少数のスーパーノードから発信されたトランザクションがIPアドレスにリンクされました（[Biryukov et al.](https://doi.org/10.1145/2660267.2660379)、[Fanti and Viswanath](https://proceedings.neurips.cc/paper_files/paper/2017/file/6c3cf77d52820cd0fe646d38bc2145ca-Paper.pdf)）。その後、数エポックにわたる[[glossary/Attestation|アテステーション（証明）]]の伝播を監視することで、[[glossary/Ethereum-validator|イーサリアムバリデータ]]をそのピアIDとIPアドレスにマッピングできることが示されました（Sharma et al.; [Heimbach et al.](https://www.usenix.org/conference/usenixsecurity25/presentation/heimbach); [Rhea](https://ethresear.ch/t/packetology-validator-privacy/7547)）。これは、GossipSubがメッセージパスを不明瞭にするためにランダム化された転送を使用しているにもかかわらず可能です。なぜなら、バリデータの直接のピア（つまり、ゴシップオーバーレイにおけるバリデータの直接のピア）は、他のノードよりも著しく早くメッセージを一貫して受信し伝播するからです。そのため、数十個のリスナーノードを展開することで、数エポック後にはリスナーノードの1つが直接のピアになり（そしてその後数エポックにわたってそうあり続ける）、その可能性が非常に高くなります。したがって、複数の[[glossary/Consensus-Layer|コンセンサス層]]エポックにわたってメッセージを最初に受信したリスナーノード（およびそのメッセージがどのネットワークアドレスから来たか）を追跡することで、コーディネーターは最終的に高い信頼度でバリデータをそのネットワークIDに確実にマッピングできるようになります。一度特定されると、バリデータは選択的に標的とされ（例：[[glossary/Denial-of-service|サービス拒否（DoS）]]を介して）、職務の欠落による[[glossary/Slashing|スラッシング]]や経済的攻撃につながる可能性があります。決定的に重要なのは、この匿名化解除がいかなる特権アクセスにも依存せず、少数の行儀の良い（正直だが好奇心旺盛な）オブザーバーでトラフィックを傍受するだけで実行できることです。

この問題は、ゴシッププロトコルの設計における決定的な緊張関係に根ざしています。ファンアウトを増やし、より一般的に伝播速度を向上させることは匿名性を低下させ、一方、低いファンアウトで露出を制限することは、伝播速度を犠牲にしてプライバシーを向上させます。残念ながら、GossipSubは適切なバランスを取ることができません。匿名化解除を可能にするのに十分な構造情報を漏洩させながら、遅延とオーバーヘッドを増幅するレイテンシに鈍感なパスのために非効率なままです。

この種の攻撃に対する防御策として、これまでの研究では、特に[[glossary/Dandelion|Dandelion]]と[[glossary/Dandelion++|Dandelion++]]が提案されています。これらは、[[glossary/Random-Walk|ランダムウォーク]]ベースの匿名化フェーズで伝播を開始することで、より強力で形式的に分析された送信者匿名性保証を提供します。しかし、これらの保証はかなりのレイテンシコストを伴い、レイテンシに敏感な設定での採用に対する根本的な障壁となっています。実際、イーサリアムコミュニティは、「レイテンシの制約のため[...]この提案[[glossary/Dandelion++|Dandelion++]]はイーサリアムの[[glossary/Consensus-Layer|コンセンサス層]]には実行不可能である（少なくとも強力な匿名性保証のためには）」と結論付けました（[EthResearch discussion](https://ethresear.ch/t/ethereum-consensus-layer-validator-anonymity-using-dandelion-and-rln-conclusion/12698)）。この緊張関係はさらに激化するでしょう。イーサリアムの[[glossary/EIP|EIP]]-7782でスロット時間が12秒から6秒に短縮される計画があるため、ゴシップ層はさらに厳しいパフォーマンス要件に直面し、今日のデプロイメントでは必要なパフォーマンスと望ましい送信者匿名性防御の両方を提供しなければならないという複合的な課題が生じています。

この課題に対処するため、私たちはプロトコル拡張として実装される新しいゴシッププロトコルであるSPREADを提案します。これは、GossipSubと比較して送信者の匿名化解除に対するハードルを上げると同時に、より効率的な伝播を提供します。私たちのアプローチは2つの原則に基づいています。1つは、メッセージの送信元を不明瞭にする[[glossary/Random-Walk|ランダムウォーク]]による匿名性、もう1つは、トポロジー認識型ホップ選択による低レイテンシです。私たちは、低レイテンシを優先する[[glossary/Random-Walk|ランダムウォーク]]ホップと、コストのかかる長距離パスを避けるために、可能な限り近くのノードを足がかりとして通信しようとする広域ホップを分離します。この設計は、ブロックチェーンバリデータメッセージング、匿名通信システム、検閲耐性プラットフォームなど、低レイテンシと送信者プライバシーの両方を必要とするアプリケーションに適しています。

## SPREADの設計：洞察と概要

[Guerraoui et al.](https://arxiv.org/abs/2308.02477)による最近の形式的な研究は、匿名性のために設計されたゴシッププロトコルが強力な[[glossary/Random-Walk|ランダムウォーク]]コンポーネントを含む必要があることを示しました。そこでは、各ノードがメッセージを単一のオーバーレイ隣接ノードに頻繁に転送し、送信元の特定を困難にします。この技術は、例えば[[glossary/Dandelion|Dandelion]]プロトコルファミリーで採用されており、[[glossary/Random-Walk|ランダムウォーク]]ベースの匿名化フェーズから始まり、その後確率的に高いファンアウトを持つ伝播フェーズに切り替わります。

しかし、これにより問題が生じます。[[glossary/Random-Walk|ランダムウォーク]]フェーズでは、メッセージは時間ステップごとに最大1つのピアに送信されるため、個々のステップが不運にも遅いパスや遠いパスを横断する可能性があります。これは、単一の遅いホップが平均的なエンドツーエンドパフォーマンス（[[glossary/Stretch|ストレッチ]]、つまりオーバーレイと直接メッセージ接続の比率で測定）を著しく損なうのに十分であるため問題です。この問題は、イーサリアムのようなブロックチェーンがゴシップ基盤の上に多段階プロトコルを重ねているという事実によってさらに増幅されます。さらに、パフォーマンスを向上させるための対策、すなわちメッセージが複数のピアに並行して送信されるより効率的なモードへの切り替えを早めることは、初期フェーズでの単一の長いホップに対して依然として脆弱であるだけでなく、意図された匿名性保証と直接的な緊張関係にあります。

このトレードオフを効果的に乗り切るため、私たちはノードの地理的分布が、世界の最も人口密度が高く経済的に発展した地域（例：米国東海岸と西海岸、ヨーロッパ、アジアなど）に対応する[[glossary/Cluster|クラスター]]を自然に形成するという洞察を活用します。これにより、SPREADの設計ではノードを[[glossary/Cluster|クラスター]]に編成し、同じ[[glossary/Cluster|クラスター]]内のノード間のネットワークレイテンシが低いという特性を持たせ、[[glossary/Cluster|クラスター]]内での高速なマルチホップ伝播を可能にします。この設計決定がなされると、[[glossary/Cluster|クラスター]]内通信を活用して、パフォーマンスに大きなペナルティを与えることなくプライバシーを構築できる[[glossary/Random-Walk|ランダムウォーク]]を実行し、時折[[glossary/Cluster|クラスター]]間通信に切り替えてグローバルな伝播を行うことができます。

2つ目の課題は、[[glossary/Cluster|クラスター]]間メッセージステップも、慎重に管理しないとエンドツーエンドのパフォーマンスに非常に大きなペナルティを与える可能性があることです。例えば、ヨーロッパから米国東海岸へのメッセージを、アジアや中東を経由するオーバーレイホップで送信することは避けたいでしょう。これを避けるためには、効率的な広域伝播を考案する必要があります。このステップはパフォーマンスにとって非常に重要であり、私たちのプロトコルはすでに[[glossary/Cluster|クラスター]]内通信を通じて匿名性を達成しているからです。この目的のために、SPREADは[[glossary/Cluster|クラスター]]間メッセージホップが隣接する[[glossary/Cluster|クラスター]]内のノードと行われるように試み、それらがより遠い[[glossary/Cluster|クラスター]]に到達するための足がかりとして使用できるようにします。理想的なルーティングシナリオでは、[[glossary/Cluster|クラスター]]とそれらが高レベルのオーバーレイを通じてどのように接続されているかについて、単一のグローバルビューが存在します。これは[[glossary/Dirichlet-Tessellation|ディリクレテッセレーション]]に対応し、空間を[[glossary/Cluster|クラスター]]の重心のセットに従って領域に分割します。これにより、理想的なルーティングは、[[glossary/Dirichlet-Tessellation|ディリクレテッセレーション]]に従って隣接する[[glossary/Cluster|クラスター]]内のオーバーレイピアにのみ[[glossary/Cluster|クラスター]]間メッセージを送信します。

[![dataset_voronoi](https://ethresear.ch/uploads/default/optimized/3X/1/0/10a696db1e667d8f051db792a42be61b4d95d1eb_2_690x422.png)](https://ethresear.ch/uploads/default/original/3X/1/0/10a696db1e667d8f051db792a42be61b4d95d1eb.png "データセットのボロノイ図")

*図1：インターネットホストのデータセットの地理座標。クラスタリング情報とボロノイセルが追加されています。理想的な広域ゴシップステップは隣接するセル間でのみ発生しますが、これにはセル分割のグローバルに調整されたビューが必要となります。*

しかし、私たちの目標は、これらの[[glossary/Cluster|クラスター]]とその高レベルの接続のためのグローバルビューに依存しない、完全に分散化されたプロトコルを持つことです。この目的のために、私たちは代わりに、各ノードが自身の[[glossary/Cluster|クラスター]]のローカルビューを構築することで、理想的なルーティングを近似することにしました。私たちの主な洞察は、各ノードにユークリッド座標のセットを安全に割り当てる[[glossary/Virtual-Coordinates|仮想座標]]スキーム（Vivaldi、Newton）を使用して、理想的なルーティングを近似することです。このような座標が配置されると、各ノードは、[[glossary/Virtual-Coordinates|仮想座標]]空間で最も近いt%のオーバーレイ隣接ノードとして、自身の[[glossary/Cluster|クラスター]]のビューを定義します。これにより、各ノードは、自身の[[glossary/Cluster|クラスター]]の隣接メンバーを構成するピアのサブセットをローカルに決定できます。さらに、[[glossary/Virtual-Coordinates|仮想座標]]を活用して、理想的な[[glossary/Cluster|クラスター]]間ルーティングを完全に分散化された方法で近似することが可能です。このアイデアは、自然なナビゲーションに触発されたもので、遠いノードと合理的にうまく整合している非[[glossary/Cluster|クラスター]]ノードのセット内に、より近い隣接ノードが存在する場合、より遠い隣接ノードへの直接ジャンプを常に避けるというものです（直感的には、足がかりとして機能するより近い目的地があることを意味します）。この場合、「うまく整合している」とは、より近いノードへの角度が、遠いノードへの角度の構成可能な角度間隔内にあることを意味します（この角度はユークリッド空間の[[glossary/Virtual-Coordinates|仮想座標]]によって与えられます）。これにより、各ノードは、非[[glossary/Cluster|クラスター]]オーバーレイピアのセットを2つのグループにローカルに分割できます。1つは、より近い「足がかり」メンバーを持つため、[[glossary/Cluster|クラスター]]間またはあらゆる種類の転送に使用すべきではないもの（occluded_remoteと表記）、もう1つは、そうではないため、[[glossary/Cluster|クラスター]]間ホップに適格なもの（unobstructed_remote）です。

## プロトコルの概要

プロトコルには、並行して実行される2つのコンポーネントがあります。1つはオーバーレイピアとそのセキュアな[[glossary/Virtual-Coordinates|仮想座標]]のセットを維持するためのアルゴリズム、もう1つはゴシップメッセージを送受信するための主要プロトコルです。ノードiのオーバーレイ隣接ノードは、前述の基準に従って、`cluster_i`、`occluded_remote_i`、`unobstructed_remote_i`の3つのサブセットに自動的に分割されます。

このオーバーレイ状態が整ったところで、[[glossary/Cluster|クラスター]]内[[glossary/Random-Walk|ランダムウォーク]]を匿名性確保のために、`unobstructed_remote`隣接ノードを介した[[glossary/Cluster|クラスター]]間効率的伝播と組み合わせるという直感に基づいて、メッセージをブロードキャストするプロトコルを簡単に定義できます。これらの2つの選択肢のいずれかを実行するかどうかの決定は、伝播すべきメッセージを受信した際に、システムパラメータに従ってバイアスされたコインを投げるだけで行われます。プロトコルの擬似コードを次に説明します。[[glossary/Cluster|クラスター]]情報とオーバーレイ隣接ノードの形成が完了した後のメッセージのブロードキャスト方法に焦点を当てます。

```
1: # constants:
2:  ρintra   # Branching probability (intra-cluster)
3:  ρinter   # Inter-cluster dissemination probability
4:  fanoutintra   # Number of intra-cluster peers when branching
5:  fanoutinter   # Number of peers for inter-cluster dissemination

6: # state variables:
7: neighbors_i # Set of overlay neighbors, partitioned into:
8: cluster_i       # Subset of closeby neighbors in Pi’s cluster
9: unobstructed_remote_i  # Subset of remote neighbors that are not efficiently reachable via another neighbor
10: occluded_remote_i      # Subset of remote neighbors that may be reachable via another neighbor

11: upon receiving or publishing message m do
12:  INTRACLUSTERSPREAD(m)
13:  INTERCLUSTERSPREAD(m)

14: procedure INTRACLUSTERSPREAD(m)
15:  if Bernoulli(ρintra) = 0 then
16:      send m to 1 peer in cluster_i selected uniformly at random
17:  else
18:       send m to fanoutintra peers in cluster_i selected uniformly at random

19: procedure INTERCLUSTERSPREAD(m)
20:  if Bernoulli(ρinter) = 1 then
21:      send m to fanoutinter peers in unobstructed_remote_i selected uniformly at random
```

プロトコルのイテレーションには、[[glossary/Cluster|クラスター]]内伝播と[[glossary/Cluster|クラスター]]間伝播の2つのステップが含まれます（10行目から11行目）。[[glossary/Cluster|クラスター]]内伝播は、[[glossary/Cobra-Walk|コブラウォーク（Coalescing-Branching Random Walk）]]アルゴリズム（[Dutta et al.](https://doi.org/10.1145/2817830)）に触発されたもので、ローカルな[[glossary/Bernoulli-Trial|ベルヌーイ試行]]の出力に応じて分岐する可能性のある[[glossary/Random-Walk|ランダムウォーク]]で構成されます（15行目）。分岐する確率は*ρintra*で表されます。出力がゼロの場合（16行目）、ノードは単に[[glossary/Cluster|クラスター]]内のランダムなピアを均一に選択し、[[glossary/Random-Walk|ランダムウォーク]]フェーズを表します。それ以外の場合、出力が1の場合（17行目）、ノードは自身の[[glossary/Cluster|クラスター]]内で均一にランダムに選択された*fanoutintra*個のピアにメッセージを拡散し、より高速な[[glossary/Cluster|クラスター]]内伝播を実現します。[[glossary/Cluster|クラスター]]間伝播はグローバルな伝播を担当し、別のローカルな[[glossary/Bernoulli-Trial|ベルヌーイ試行]]（20行目）に従って時折発生します。この試行のパラメータは*ρinter*です。試行の出力がゼロの場合、ノードは他の[[glossary/Cluster|クラスター]]と相互作用せず、すべての通信を自身の[[glossary/Cluster|クラスター]]内に保ちます。出力が1の場合（21行目）、ノードは遠すぎない（つまり、足がかりとして機能できるより近いノードによって座標空間で「隠されていない」）隣接ノードにメッセージを拡散し、合計で*fanoutinter*個のピアを均一な方法でランダムに選択します。ピアが同じメッセージを複数回伝播することに注意してください。アルゴリズムがこのような重複した動作を停止するロジックを含まない理由は、匿名性を保証するためです。特に、ノードがメッセージを一度だけ伝播するプロトコルでは、[Bellet et al.](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.DISC.2020.8)は、攻撃者が通信タイムスタンプを追跡することで送信元を特定する可能性が高いことを示しています。しかし、新しいメッセージを継続的に生成する実際のアプリケーションでは、ネットワーク輻輳を避けるために終了メカニズムを提供する必要があります。[Kermarrec et al.](https://doi.org/10.1109/TPDS.2003.1189583)が説明しているように、通常、このパラメータはプロトコルの信頼性を制御し、実際のネットワークサイズでは小さな値で十分です。それでも、追加の信頼性メカニズムを追加することができ、実際、GossipSubのようなフレームワークには、既に見られたメッセージのリストをアドバタイズするハートビートメッセージや、欠落したメッセージを取得するための「プル」プロトコルリクエストなどが存在します。

このメッセージプルメカニズムは、さらに2つのシナリオで堅牢性を高めるのに役立ちます。第一に、チャーン（ノードの頻繁な参加・離脱）の下では、ノード障害や離脱の連続が直接伝播を効果的に妨げる可能性があり、ハートビートとプルメカニズムによってノードは失われたメッセージを回復できます。第二に、ビザンチンノードに対する防御に役立ちます。単純な暗号化は、そのようなノードがメッセージの内容を改ざんするのを防ぎますが、彼らは意図的にメッセージを遅延させたり、転送を拒否したりして、進行を危険にさらす可能性がありますが、ハートビートとプルがこれに対抗します。

## プロトコル拡張の使用とGossipSubピアとの共存

SPREADは、GossipSubのオプトインで後方互換性のある拡張です。GossipSubの既存のハンドシェイクフィールドを通じてアドバタイズされ、両方のピアがそれをサポートしている場合にのみ接続でアクティブになります。SPREADメッセージは、標準のRPCエンベロープ内の追加フィールドでフラグ付けされるため、拡張をサポートしないピアはマーカーを単に無視し、標準のGossipSubにフォールバックします。これにより、混在デプロイメントが可能になり、ネットワーク全体がアップグレードされる前に部分的な匿名性とパフォーマンス上の利点が得られる段階的な採用パスが可能になります。[[glossary/Cluster|クラスター]]構築は、Vivaldiプロセス（Newtonチェックで保護）によって維持される[[glossary/Virtual-Coordinates|仮想座標]]に依存しており、これがSPREADがノードの通信プロファイルに加える唯一の追加です。

## 評価

私たちはSPREADを、匿名化解除攻撃に対する耐性と、広域ネットワークでのメッセージ伝播効率という2つの補完的な側面から評価します。イーサリアムにデプロイされているGossipSubと、匿名性向上を目的とした研究提案である[[glossary/Dandelion++|Dandelion++]]と比較します。SPREADは`go-libp2p-pubsub`の拡張として実装されているため、実際のプロダクションコードを評価できます。設定可能なレイテンシと帯域幅を持つ仮想リンクを通じて実際のインプリメンテーションを接続するパケットレベルシミュレーターである[simnet](https://github.com/marcopolo/simnet)上で実行します。現実的なデプロイメントを反映するため、地理的に分散したノード間の実際のラウンドトリップ時間測定値を含む[グローバルインターネットデータセット](https://wonderproxy.com/blog/a-day-in-the-life-of-the-internet/)からネットワークトポロジーを抽出し、複数のトポロジーをサンプリングして結果を集計します。[[glossary/Dandelion++|Dandelion++]]も同じスタック上に実装されているため、3つのプロトコルすべてが同じ実装を共有し、伝播戦略のみが異なります。

公平な比較のため、3つのプロトコルを、各ノードが期待値として同じ数のピアにメッセージを転送するように設定します。つまり、同じノードあたりの帯域幅予算を共有します。GossipSubのデフォルトメッシュサイズである6を目標の期待ファンアウトとして使用し、SPREADの4つのパラメータと[[glossary/Dandelion++|Dandelion++]]のパラメータをそれに合わせて調整します。匿名性は、最初のタイムスタンプ推定器の下での[[glossary/Deanonymization-Accuracy|匿名化解除精度]]メトリックを通じて測定します。特定の割合のCurious Nodesに対して、多くの攻撃者の配置をサンプリングし、各メッセージについて、Curious Nodeに最も早いタイムスタンプで配信したノードを送信者として推測します。精度は、正しい推測の割合です。パフォーマンスは、メッセージの実際のエンドツーエンド配信時間と、その送信者と受信者の間の直接通信レイテンシの比率として定義される、絶対的な配信レイテンシと[[glossary/Stretch|ストレッチ]]メトリックの両方を通じて測定します。

### 匿名性

すべてのプロトコルは、敵対者がネットワークのより大きなシェアを制御するにつれて脆弱になりますが、その程度は著しく異なります。GossipSubが最も露出しています。Curious Nodesがわずか5%の場合でも、攻撃者はすでに35%以上のケースで成功し、20%では54%に上昇します。[[glossary/Dandelion++|Dandelion++]]は最も強力な匿名性を達成し、Curious Nodesが5%の場合で10%未満、20%の場合でも約20%にとどまります。これは、その[[glossary/Random-Walk|ランダムウォーク]]による難読化フェーズによるものです。SPREADはその中間に位置します。Curious Nodesが5%の場合、その精度は20%台前半であり、20%では約45%に達します。したがって、GossipSubと比較して敵対者の成功率を低下させながら、[[glossary/Dandelion++|Dandelion++]]に対するわずかな匿名性ギャップを、著しく優れた伝播効率と引き換えに受け入れています。

[![attack_results_2](https://ethresear.ch/uploads/default/optimized/3X/e/5/e566bf6b2f31dbac64dca304da6c2f25ea094969_2_690x488.png)](https://ethresear.ch/uploads/default/original/3X/e/5/e566bf6b2f31dbac64dca304da6c2f25ea094969.png "攻撃結果2")

*図2: GossipSub、Dandelion++、SPREADにおける、Curious Nodesの割合の関数としての匿名化解除（攻撃）精度。*

### パフォーマンス

SPREADは、3つのプロトコルの中で最も効率的な伝播を達成します。[[glossary/Stretch|ストレッチ]]閾値が3の場合、SPREADでは90%以上の配信が完了しますが、GossipSubでは約83%、[[glossary/Dandelion++|Dandelion++]]ではわずか50%です。このギャップはテール部分にも持続し、SPREADとGossipSubは[[glossary/Dandelion++|Dandelion++]]よりもかなり早く完全なカバレッジに近づきます。全体として、SPREADはGossipSubと比較して平均[[glossary/Stretch|ストレッチ]]を約23%削減し、[[glossary/Dandelion++|Dandelion++]]と比較して約67%削減します。また、重いテールをさらに著しく縮小し、99パーセンタイルの[[glossary/Stretch|ストレッチ]]をそれぞれ約39%と74%削減します。絶対レイテンシについても同じ順序が成り立ちます。SPREADの配信の半分は100ミリ秒未満で完了しますが、GossipSubでは40%、[[glossary/Dandelion++|Dandelion++]]では10%です。このテール挙動は、イーサリアムのように多段階プロトコルがゴシップの上に重ねられている場合、各追加ステップが単一ホップのレイテンシペナルティを増幅するため、特に重要です。

[![stretch_cdf_2](https://ethresear.ch/uploads/default/optimized/3X/7/3/73bfb46b14da383dcf22a7e3e30e3e1443ce2c1a_2_690x487.png)](https://ethresear.ch/uploads/default/original/3X/7/3/73bfb46b14da383dcf22a7e3e30e3e1443ce2c1a.png "ストレッチCDF 2")

*図3: 3つのプロトコルにおける、すべての送信者-受信者ペア間のストレッチの累積分布。*

[![cdf_latency](https://ethresearch.ch/uploads/default/optimized/3X/b/6/b66bb43e89bf2369f847cf576600624b8ae0a5ab_2_690x487.png)](https://ethresear.ch/uploads/default/original/3X/b/6/b66bb43e89bf2369f847cf576600624b8ae0a5ab.png "CDFレイテンシ")

*図4: すべての送信者-受信者ペア間の絶対配信レイテンシの累積分布。*

### チューニング

最後に、SPREADの4つのパラメータが匿名性とパフォーマンスをどのようにトレードオフするかを研究します。すべてのパラメータにおいて、ファンアウトまたは分岐確率を増やすと[[glossary/Stretch|ストレッチ]]は低下しますが、同時に攻撃精度は上昇し、その逆もまた然りです。これは、SPREADが連続的に調整可能であることを確認します。低い値はプライバシーを最大化し、高い値はパフォーマンスにバランスを傾けます。[[glossary/Cluster|クラスター]]内パラメータは[[glossary/Stretch|ストレッチ]]プロファイルを支配し、[[glossary/Cluster|クラスター]]間確率は主に匿名性調整ノブとして機能し、パフォーマンスに対する効果は逓減します。上記の比較で使用された設定は、このスペクトラムの両極端ではなく、意図的にバランスの取れた点を目標としています。

[![tuning_stretch](https://ethresear.ch/uploads/default/optimized/3X/6/2/62b5a5ef654094e9376f3dc0e4b2e302170f8afe_2_690x489.png)](https://ethresear.ch/uploads/default/original/3X/6/2/62b5a5ef654094e9376f3dc0e4b2e302170f8afe.png "チューニングストレッチ")

*図5: SPREADの単一パラメータ変更における平均ストレッチと匿名化解除精度の関係（Curious Nodes 10%の場合）。各線は1つのパラメータの連続する値を結んでいます。*

全体として、これらの結果は、イーサリアムの現在の設計の2つの側面が同時に改善できることを示しています。SPREADに切り替えることで、GossipSubと比較して[[glossary/Deanonymization-Accuracy|匿名化解除精度]]が低下し、平均およびテール[[glossary/Stretch|ストレッチ]]も改善されます。[[glossary/Dandelion++|Dandelion++]]と比較すると、SPREADは匿名性の一部を犠牲にしますが、イーサリアムの[[glossary/Consensus-Layer|コンセンサス層]]のようなレイテンシに敏感な設定では強力な匿名性提案を非実用的にするレイテンシオーバーヘッドを回避します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/spread-extending-gossipsub-with-efficient-anonymous-dissemination/25343)
