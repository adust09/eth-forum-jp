---
title: 'RowDAS (EIP-8371): 分散型ブロブ再構築、測定済み'
original_title: 'RowDAS (EIP-8371): Distributed Blob Reconstruction, measured'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/rowdas-eip-8371-distributed-blob-reconstruction-measured/25897
author: cskiraly
date: '2026-09-03'
category: Networking
tags:
  - networking
  - data-availability
  - scaling
  - eip
  - research
  - protocol-design
  - client-diversity
  - performance
  - fulldas
  - peer-discovery
topic_id: '25897'
translated_at: '2026-09-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [RowDAS (EIP-8371): Distributed Blob Reconstruction, measured](https://ethresear.ch/t/rowdas-eip-8371-distributed-blob-reconstruction-measured/25897) — cskiraly (2026-09-03)

*注: このドキュメントは共同作業の成果です。[@MarcoPolo](https://ethresear.ch/u/marcopolo)、[@leobago](https://ethresear.ch/u/leobago)、[@kamilsa](https://ethresear.ch/u/kamilsa)、[@fradamt](https://ethresear.ch/u/fradamt)、そしてEFネットワーキングチーム全体の貢献とアイデアなしには実現できませんでした。*

**TL;DR**

-   [[glossary/RowDAS|RowDAS]] ([[glossary/EIP-8371|EIP-8371]]) は、[[glossary/PeerDAS|PeerDAS]] のスケーリングしない部分、すなわち再構築が分散されていない問題を解決します。再構築は高カストディノード（128カラムのうち少なくとも64カラムを保持する任意のノード）に集中し、各ノードが単独で全作業を繰り返していました。この問題を克服するアイデアは [[glossary/FullDAS|FullDAS]] に根ざしており、現在 [[glossary/Glamsterdam|グラムステルダム]] の次の[[glossary/Hegot|ヘゴタ]] [[glossary/fork|フォーク]]での組み込み提案 (PFI) となっています。
-   [[glossary/RowDAS|RowDAS]] は、高カストディノードの再構築作業を最大128分の1に削減します。128 [[glossary/blob|ブロブ]]の場合、スロットあたり最大20秒だったCPUコア時間が162ミリ秒になります。これらはCPU負荷の数値であり、[[glossary/latency|レイテンシ]]ではありません。リカバリは並列化されます。
-   [[glossary/RowDAS|RowDAS]] の下では、再構築に[[glossary/supernodes|スーパーノード]]は不要となり、64カラムを保持するノードすら必要ありません。通常のノードがカストディをプールし、[[glossary/erasure-coding-threshold|消失訂正符号の閾値]]をクリアする範囲であれば、どこでも集合的に再構築できます。
-   CPU負荷の軽減は新しい[[glossary/row-topics|行トピック]]に依存しません。縮小版（今日の[[glossary/PeerDAS|PeerDAS]]の動作を最終防衛策として、行の*割り当て*のみを保持）でも削減の大部分を達成でき、段階的な導入に利用できます。[[glossary/row-topics|行トピック]]は、[[glossary/supernodes|スーパーノード]]不要のリカバリと[[glossary/blob|ブロブ]]ごとのアクセスという、それらだけが提供できるものをもたらします（詳細は最後に）。
-   カラムパスは測定可能な影響を受けません。6つのネットワーク形状にわたるペア実行では、カラム完了はベースラインのノイズ範囲内（-30〜+6ミリ秒）でした。
-   実装および測定済み: 動作するPrysmプロトタイプが以下に公開されており、対応する[[glossary/row-topics|行サブネット]]数を減らした最大1000ノードの合成負荷の下で測定されています（まだ[[glossary/mainnet|メインネット]]規模ではありません）。

## 問題

[[glossary/PeerDAS|PeerDAS]] ([[glossary/EIP-7594|EIP-7594]]) の下では、[[glossary/reconstruction|再構築]]の義務は*[[glossary/custody|カストディ]]*に付随します。カラムの少なくとも半分を保持するノード（実際には高[[glossary/stake|ステーク]]に裏打ちされた[[glossary/supernodes|スーパーノード]]や[[glossary/blob|ブロブ]]を必要とする[[glossary/L2-nodes|L2ノード]]）は[[glossary/reconstruction|再構築]]でき、そうすることが求められます。そのような各ノードは、不足しているすべての[[glossary/blob|ブロブ]]を[[glossary/reconstruction|再構築]]します。同じ作業がノードごとに繰り返されるのです。[[glossary/blob|ブロブ]]のリカバリあたり測定された**162ミリ秒**（実際の[[glossary/KZG-commitment|KZG]]、Ryzen 9 8945HS）で、32[[glossary/blob|ブロブ]]の場合、すべての[[glossary/blob|ブロブ]]がリカバリを必要とするとき、[[glossary/reconstruction|再構築]]ノードあたりスロットあたり**5.2秒のCPUコア時間**となり、[[glossary/blob|ブロブ]]数に比例して増加します。執筆時点で、ネットワークには2000以上のそのような高[[glossary/custody|カストディ]]ノードが存在すると推定されています。

> *待機による抑制。* [[glossary/PeerDAS|PeerDAS]] [[glossary/consensus|コンセンサス]]仕様が示唆するように、クライアントはランダムな遅延で繰り返しを鈍らせることができます（Prysmのウィンドウではスロット開始から2秒以内に起動し、その間に完了したかどうかを再確認し、完了していれば待機する）。しかし、この節約は、そのウィンドウ内で伝播がどこまで進むかによって制限されます。1000ノードで測定したところ、単純な上限から19〜43%削減されます（図3）。さらに長く待機すれば、リカバリを遅らせるだけで、より多くの抑制が得られます。

> *負荷であり、[[glossary/latency|レイテンシ]]ではない。* リカバリは[[glossary/blob|ブロブ]]ごとに独立しており、Prysmはそれらを並列で実行するため、5.2秒は**12秒のスロット全体で約0.43コアが占有される**か、8コアで約650ミリ秒のバーストに相当します。これは、スロット内の他のすべてと競合するバーストとして発生するため、また、これらの役割（高[[glossary/custody|カストディ]]またはL2）でチェーンを追跡できるハードウェアの最低要件を設定するため、重要です。128[[glossary/blob|ブロブ]]の場合、[[glossary/execution-layer|実行レイヤー]]から`getBlobs`を介してローカルで利用可能な[[glossary/blob|ブロブ]]がないと、**1.7コアが持続的に占有される**ことになります。

[[glossary/RowDAS|RowDAS]] ([[glossary/EIP-8371|EIP-8371]]) は、2番目の軸を追加することで、この負荷のほとんどを取り除きます。128個の`data_row_{subnet_id}` [[glossary/row-topics|行トピック]]がそれぞれ、カラムを*横断して*1つの[[glossary/blob|ブロブ]]のセルを運びます。ノードの[[glossary/row-topics|行サブネット]]はノードIDから派生し、[[glossary/blob|ブロブ]]はスロットごとの順列によってサブネットにマップされます。そして、サブネットのメンバーは、それが運ぶ行の[[glossary/reconstruction|再構築]]義務を負います。高[[glossary/custody|カストディ]]メンバーが優先され、通常のメンバーは遅延されたプールされた[[glossary/fallback|フォールバック]]として機能します。**義務は「できることすべて」から「自分のサブネットの行」へと移行し**、[[glossary/reconstruction|再構築]]されたセルは、失われた[[glossary/column-subnets|カラムサブネット]]に再度アナウンスされ、リクエストに応じて提供されます。

[![The cell matrix: column subnets vertical and authoritative, one row subnet horizontal, cross-fill at the intersections](https://ethresear.ch/uploads/default/optimized/3X/8/4/84e2b8e0e68ccd83b333a151d03f0c1e4b4e112f_2_690x405.png)](https://ethresear.ch/uploads/default/original/3X/8/4/84e2b8e0e68ccd83b333a151d03f0c1e4b4e112f.png "セル行列: カラムサブネットは垂直で権威的、行サブネットは水平、交差部分で相互補完")

*図1: セル行列 — カラムサブネットは垂直（[[glossary/custody|カストディ]]、権威的なパス）、[[glossary/row-topics|行サブネット]]は水平、交差部分で相互補完。*

## 達成されること

**[[glossary/reconstruction|再構築]]負荷が2桁減少します。**

| [[glossary/blob|ブロブ]]数 | [[glossary/PeerDAS|PeerDAS]]、[[glossary/reconstruction|再構築]]ノードあたりスロットあたり | [[glossary/RowDAS|RowDAS]]、[[glossary/reconstruction|再構築]]ノードあたりスロットあたり | ネットワーク全体、2000の[[glossary/reconstruction|再構築]]ノード |
| --- | --- | --- | --- |
| 32 | 5.18秒のCPUコア時間 | 40ミリ秒 | 10,400秒 → 81秒 |
| 128 | 20.7秒（1.7コア持続） | 162ミリ秒 — 1[[glossary/blob|ブロブ]] | 41,400秒 → 324秒 |

> *表の読み方。* 128[[glossary/blob|ブロブ]]の場合、[[glossary/reconstruction|再構築]]ノードは、不足しているすべての[[glossary/blob|ブロブ]]ではなく、スロットあたり正確に1つの[[glossary/blob|ブロブ]]をリカバリします。32[[glossary/blob|ブロブ]]の場合、40ミリ秒は[[glossary/reconstruction|再構築]]ノード全体の平均です。128サブネットのうち4分の1のみが[[glossary/blob|ブロブ]]を運び、義務を負うノードはそれに162ミリ秒を費やします。ネットワーク全体のカラムは、すべてが不足しているケースで、推定2000の高[[glossary/custody|カストディ]]ノードにわたる同じ計算を投影しています。[[glossary/RowDAS|RowDAS]]の数値は、マッピングされた第一段階の義務であり、[[glossary/fallback|フォールバック]]段階は、実際に[[glossary/row-topics|行]]が不足した場合にのみ作業を追加します。[[glossary/PeerDAS|PeerDAS]]のカラムは計算上の上限です。上記のランダム遅延抑制は、その形状を変更することなく、測定された19〜43%を削減しますが、残りの負荷は[[glossary/reconstruction|再構築]]ノードの数に比例して増加します。

**[[glossary/row-topics|行]]はカラムパスを遅延させません。** これは[[glossary/EIP|EIP]]の安全条件です。[[glossary/row-topics|行]]の伝播は最適化であり、カラムパスは権威的なままです。これはまた、自然な障害モードでもあります。[[glossary/row-topics|行]]とカラムは同じリンク上で同じセルを運ぶため、単純な[[glossary/row-topics|行]]軸はカラムパスと競合する可能性があります。設計上の解決策は優先順位とタイミングです。[[glossary/row-topics|行]]のアナウンスはバッチ処理され、[[glossary/row-topics|行]]の*リクエスト*はカラムパスの中央値完了とほぼ同じくらい長く待機します。これは[[glossary/EIP|EIP]]が既に許可している遅延です。[[glossary/row-topics|行]]軸がセルを要求する頃には、ほとんどのセルは既にカラムによって到着しており、[[glossary/row-topics|行]]は不足している部分のみを埋め戻します（図2）。6つのネットワーク形状（ノード数×[[glossary/custody|カストディ]]×[[glossary/blob|ブロブ]]数、24〜1000ノード）にわたるペア実行（同一のトポロジとランダム性、[[glossary/row-topics|行]]軸のオン/オフ）で、形状あたり最大25のシードペアを使用して測定したところ、カラム完了の中央値は**-30〜+6ミリ秒**の範囲で移動し、完了時間は数秒でした。

[![Timing, not volume: announcements go early in batches, requests wait out the column path, then backfill only what is missing](https://ethresear.ch/uploads/default/optimized/3X/0/f/0f0309792b71e069405ddc63514850660d6bfa8e_2_690x336.png)](https://ethresear.ch/uploads/default/original/3X/0/f/0f0309792b71e069405ddc63514850660d6bfa8e.png "タイミングが重要であり、ボリュームではない: アナウンスはバッチで早期に行われ、リクエストはカラムパスを待機し、不足している部分のみを埋め戻す")

*図2: 遅延によって2つの軸が時間的に順序付けられる — アナウンスはバッチで早期に行われ、リクエストはカラムパスの中央値を待機し、[[glossary/row-topics|行]]は不足している部分のみを埋め戻す。*

**リカバリは[[glossary/erasure-coding-threshold|消失訂正符号の閾値]]まで機能します。** 128カラムのうち任意の64カラムで[[glossary/blob|ブロブ]]を[[glossary/reconstruction|再構築]]できますが、[[glossary/PeerDAS|PeerDAS]]の下では、そのマージンは64カラムを*保持する*ノードのみが利用できます。[[glossary/RowDAS|RowDAS]]は、ノードが[[glossary/row-topics|行トピック]]上で[[glossary/custody|カストディ]]をプールし、そのマージンを集合的に利用できるようにします。

[[glossary/supernodes|スーパーノード]]なしでのリカバリは強力な特性ですが、いくつかの制限を述べる価値があります。

-   [[glossary/RowDAS|RowDAS]]は符号化閾値を*下げる*のではなく、利用可能にするものです。
-   閾値*ちょうど*の場合、利用可能性はサブネットメンバーシップに依存します。50メンバーのサブネットでは、集合的な保有量が通常1〜2カラム不足します。250メンバーでは、確実に不足しません。

**攻撃下でもリカバリは安価で高速です。** 図3の背後にあるストレステスト: プロポーザーがソースでカラムを意図的に非公開にする（符号化限界の最大64カラムまで）、そしてネットワークはそれらをリカバリしなければなりません。3つのパネルは、重要な3つの質問に答えます。リカバリがどれだけのCPUを消費するか、非公開データが実際にいつ戻るか、そしてワイヤーが何を運ぶかです。[[glossary/PeerDAS|PeerDAS]]の参照は意図的に安易な対立仮説ではありません。デプロイされたクライアントが行うことをモデル化しています。つまり、すべての[[glossary/supernodes|スーパーノード]]は64カラムを保持すると武装し、ランダムな遅延後に起動し、スリープ中に残りが到着したかどうかを再確認し、到着していない場合にのみ[[glossary/reconstruction|再構築]]します。そのため、そのランダムな遅延は、実際に節約するコストに対して完全に評価されます。

左のパネルが示す核心的な違いは、*投機と責任*です。[[glossary/PeerDAS|PeerDAS]]の[[glossary/reconstruction|再構築]]は投機的です。起動した[[glossary/supernodes|スーパーノード]]は、伝播が完了するまでスロットが正常であるかを知ることができません。そのため、何も非公開にされていないスロットでも、ティアの全労力の約4分の3のコストがかかります。[[glossary/RowDAS|RowDAS]]の下では、すべてのライブ[[glossary/row-topics|行]]には指定された[[glossary/reconstruction|再構築]]ノードがあり、他のすべてのノードは誰が[[glossary/reconstruction|再構築]]ノードであるかを確認し、待機することができます。[[glossary/supernodes|スーパーノード]]の[[glossary/fallback|フォールバック]]が1750ミリ秒の場合、ストレス下のスロットは4つの指定された[[glossary/reconstruction|再構築]]（[[glossary/blob|ブロブ]]あたり1つ）のみを消費し、他には何も消費しません。**カラムの最大3分の1が非公開にされた場合でも、ネットワーク全体で0.65秒のCPU**です。この節約は時間によって得られるものではありません（中央のパネル）。非公開データはスロット開始から**1〜1.7秒**で戻ってきます。

トラフィックは右のパネルで、[[glossary/row-topics|行]]軸はほとんど何も追加しません。ルール: ノードは、必要であることを示せない[[glossary/row-topics|行]]セルを*要求*することはありません。リクエストは、自身の[[glossary/custody|カストディ]]がまだ不完全であり、指定された[[glossary/reconstruction|再構築]]ノードが作業中ではなく、誰も[[glossary/row-topics|行]]全体を主張していない場合にのみ発動します。主張された[[glossary/reconstruction|再構築]]が表示されない場合、リクエストは再武装し、プールされたリカバリが引き継ぎます。その結果、[[glossary/RowDAS|RowDAS]]と[[glossary/PeerDAS|PeerDAS]]のワイヤー総計はほぼ一致します。[[glossary/PeerDAS|PeerDAS]]自身のカラムトラフィックに加えて、スロットあたり**約10MBのシグナリング**です。

[![Recovery under stress at 1000 nodes: reconstruction CPU, rescue completion, and wire bytes against columns withheld](https://ethresear.ch/uploads/default/optimized/3X/4/b/4b89a0e880ed18d89a25dae8779c5b3b0152fc20_2_690x207.png)](https://ethresear.ch/uploads/default/original/3X/4/b/4b89a0e880ed18d89a25dae8779c5b3b0152fc20.png "1000ノードでのストレス下リカバリ: 再構築CPU、リカバリ完了、ワイヤーバイト数（プロポーザーが非公開にするカラム数に対して）")

*図3: 1000ノード、4[[glossary/blob|ブロブ]]でのストレス下リカバリ — [[glossary/reconstruction|再構築]]CPU（左）、非公開データが戻るタイミング（中央）、ワイヤー上のバイト数（右）、プロポーザーが非公開にするカラム数に対して。1[[glossary/blob|ブロブ]]のリカバリは測定された162ミリ秒で価格設定されています。ポイントあたり5シード、薄い点は個々の実行、線は中央値を結んでいます。[[glossary/PeerDAS|PeerDAS]]の線は、デプロイされたクライアントモデル（ランダム遅延、発動時の再チェック）です。*

> *図の読み方。* 2つのモデリング選択が重要です。まず、メンバーシップ: これらのセルは、すべてのノードを[[glossary/blob|ブロブ]]を運ぶ[[glossary/row-topics|行サブネット]]（それぞれ約250メンバー）に配置し、タイミング競合と待機をサブネット割り当ての運から切り離します。[[glossary/mainnet|メインネット]]の比率（サブネットあたり約78メンバー、高[[glossary/custody|カストディ]]ノード約15）では、ライブサブネットはほぼ確実に[[glossary/reconstruction|再構築]]ノードを確保し、これは仮定ではなく測定されています。この比率で[[glossary/EIP|EIP]]の実際のハッシュベース割り当ての下でこれらのセルを再実行すると、結果が再現されます（5シード）。それにもかかわらず[[glossary/row-topics|行]]のサブネットが不足している場合、[[glossary/supernodes|スーパーノード]]の[[glossary/fallback|フォールバック]]が[[glossary/row-topics|行]]を拾い上げます。これは追加の[[glossary/reconstruction|再構築]]作業であり、データが失われることはありません。これは小規模ネットワークでのみ問題となるコストであり、導出可能なスタンドインスケジュールでそのほとんどが取り除かれます。次に、[[glossary/blob|ブロブ]]数: 4[[glossary/blob|ブロブ]]は`getBlobs`時代のストレスケースです。すべてのノードの[[glossary/Mempool|メムプール]]に既に存在する[[glossary/blob|ブロブ]]はリカバリに入らないため、いくつかの非公開またはプライベートな[[glossary/blob|ブロブ]]が、はるかに大きなスロットの現実的な中核となります。

**[[glossary/RowDAS|RowDAS]]自身の障害モードは限定的です。** [[glossary/row-topics|行サブネット]]が機能しない場合、測定されたカラム完了は、悪化するのではなく、[[glossary/row-topics|行]]軸がないベースラインにとどまります。抑制された[[glossary/row-topics|行サブネット]]は現状に劣化し、その利点を失うだけで、それ以上のコストはかかりません。

## ネットワーク層のアップグレード

上記の成果は[[glossary/RowDAS|RowDAS]]ロジック単独によるものではありません。[[glossary/RowDAS|RowDAS]]は[[glossary/gossipsub|ゴシップサブ]]の[[glossary/partial-message-based-row-topics|部分メッセージ拡張]]に乗っており、そこではピアがペイロードを積極的に送信する代わりに、どのセルを保持しているかを*アナウンス*し、そのピアは不足しているものだけを*リクエスト*します。これが上記の表のアナウンスとリクエストです。この拡張機能とそのGo実装（現状）は、2番目の軸を安全にするにはあまりにもおしゃべりで積極的すぎます。提示されたパフォーマンスを達成するには、プロトコル基盤レベルで6つのメカニズムが必要でした。それぞれは小さいですが、[[glossary/row-topics|行]]固有のものではなく、これらがP2Pプロトコルを高性能で適切に動作させる詳細です。ほとんどは新しいアイデアでもありません。以下の表のリンクは、それぞれの提案が以前の投稿にまで遡ることを示しています。新しいのは、それらの詳細がほとんど解決され、実装され、一緒に測定されたことです。

| メカニズム | 動作内容 | 達成されること |
| --- | --- | --- |
| アナウンスポリシー（集約のアイデア: PPPT § IHAVEトラフィックオーバーヘッド） | ピアごとのアナウンスを200ミリ秒のウィンドウで即時先行エッジとともにバッチ処理。制限付きリトライ。追跡される状態の上限。 | 測定された最も困難な形状（128ノード / [[glossary/custody|カストディ]] 8 / 8[[glossary/blob|ブロブ]]: 570k → 45k）で[[glossary/row-topics|行トピック]]メッセージが10倍以上削減。 |
| リクエストの遅延 | [[glossary/row-topics|行]]リクエストをカラムパスの中央値完了とほぼ同じ期間保持。リクエストは選択された瞬間にディスパッチされる。 | 安全性の見出し: カラム完了がノイズ範囲内（-30〜+6ミリ秒）。カラムが競合に勝つ場合、[[glossary/row-topics|行]]はほとんど何も送信しない。 |
| フェーズ認識型転送（ルーツ: PPPT; ピア知識形式: 部分メッセージ § 公開戦略; 抑制の先例: [[glossary/gossipsub|ゴシップサブ]] v1.2 IDONTWANT） | セルペイロードを、それらを保持していると知られていないピアにのみプッシュ。残りのピアにはアナウンス（ここでの「フェーズ」はメッセージのプッシュ/プルライフサイクルであり、以下の[[glossary/reconstruction|再構築]]フェーズとは無関係）。 | 設計により重複ペイロード配信が制限される: 各ピアはバイトを一度だけ受信し、メタデータが残りをカバーする。 |
| リクエスト規律 (IWANT)（ルーツ: 常識、しかし一部の実装には驚くほど存在しない） | 不足しているセルごとに一度に1つのリクエストを、期限付きのクレームとして保持。期限切れのクレームはバックオフを伴って別のアナウンサーに再発動し、繰り返し沈黙するピアには再度要求しない。 | 無駄なプルなし — k個のピアによってアナウンスされたセルは一度だけフェッチされ、k回ではない — そして停止もなし: 保持されたリクエストは常にウェイクアップを所有し、カラムパスが権威的な[[glossary/fallback|フォールバック]]となる。 |
| サブスクライブなしの部分的関心（ルーツ: [[glossary/FullDAS|FullDAS]] § 関心: [[glossary/custody|カストディ]] vs. サンプル; 拡張: 部分メッセージ） | 参加しているがサブスクライブしていない[[glossary/row-topics|トピック]]で部分メッセージの関心をシグナルする。 | [[glossary/EIP|EIP]]のオプションのプルをまったく実装可能にする: [[glossary/reconstruction|再構築]]ノードは、[[glossary/custody|カストディ]]していない[[glossary/column-subnets|カラムサブネット]]からセルを収集できる。 |
| アドバタイズメントのみのクロス転送（ルーツ: [[glossary/FullDAS|FullDAS]] § ネットワーク内修復、[[glossary/FullDASv2|FullDASv2]] § `getBlobs`ベースのカラム[[glossary/reconstruction|再構築]]で詳細） | [[glossary/reconstruction|再構築]]されたセルを、それらを失った[[glossary/column-subnets|カラムサブネット]]にアナウンス。リクエストに応じて提供。 | イーガーなプッシュと同じリカバリ境界 — 64[[glossary/column-subnets|カラムサブネット]]が存続する限りすべてがリカバリされる — トラフィックはごく一部。 |

ここでほとんどが部分メッセージに特有のものではないことに注意してください。バッチ処理を伴うアナウンス/リクエスト分割、フェーズ認識型転送、および規律あるプルは、メタデータとペイロードを分離するあらゆる[[glossary/data-availability|DAS]]または拡散プロトコルに適用されます。そのため、ほとんどの技術は[[glossary/RowDAS|RowDAS]]自体ではなく、[[glossary/FullDAS|FullDAS]]時代の提案にまで遡ります。もちろん、その系譜はさらに古く、これらの技術の多くはBitcoinが発明されるずっと前からP2Pプロトコルに存在していました。

## プロトタイプ

上記のすべてが公開されています。

-   **Prysm**: [`cskiraly/prysm`, branch `rowdas`](https://github.com/cskiraly/prysm/tree/rowdas) — 現在の`develop`に対する11コミットシリーズで、`--row-das`フラグの背後にあります（この投稿の数値はコミット`2cec8fe20a`）。
-   **[[glossary/gossipsub|ゴシップサブ]]**: [`cskiraly/go-libp2p-pubsub`, branch `rowdas-partial-messages`](https://github.com/cskiraly/go-libp2p-pubsub/tree/rowdas-partial-messages) — 上記の表のメカニズムを、v0.17.0の上に10コミットとして（コミット`115d7f6949`）。
-   **測定フレームワーク**: [`cskiraly/eth-networking-lab`](https://github.com/cskiraly/eth-networking-lab) — 実際の[[glossary/gossipsub|ゴシップサブ]]と実際の[[glossary/KZG-commitment|KZG]]を介したN個のインプロセスノード、ワイヤー上のすべてのバイトが計上され、カウントベースの結果のための決定論的スケジューラ（コミット`2167ef4`）。

[[glossary/RowDAS|RowDAS]]が使用する基盤のほとんどは既に存在していました。部分カラム ([[glossary/EIP-8136|EIP-8136]]) は現在Prysmで出荷されており、[[glossary/gossipsub|ゴシップサブ]]の[[glossary/partial-message-based-row-topics|部分メッセージ拡張]]はアップストリームです。そして、[[glossary/RowDAS|RowDAS]]は部分カラム機構の転置であるため、[[glossary/KZG-commitment|KZG]]検証、ヘッダーコンテナ、およびピアごとの公開ステートマシンは共有され、重複していません。新しいのは次のとおりです。

-   **両軸にサービスを提供する1つのブロードキャスターと、クロスフィルブリッジ。** どちらかの軸で検証されたセルはもう一方に提供されるため、[[glossary/row-topics|行トピック]]で学習したセルは、[[glossary/column-subnets|カラムトピック]]トラフィックなしで[[glossary/custody|カストディ]]されたカラムを埋めます。
-   **3段階の[[glossary/reconstruction|再構築]]義務** — 自身の[[glossary/row-topics|行]]、任意の[[glossary/row-topics|行]]、機会主義的 — ブロックルート取得から時間を計られ、[[glossary/row-topics|行]]が他の場所で提供されたときにキャンセルされます。
-   **両方向へのクロス転送** — 上記の表のゲート付きアドバタイズメントと、[[glossary/EIP|EIP]]のオプションのプル。
-   **`ROW_SUBNET_COUNT`が設定値として**、128サブネットでノードあたり1つでは、約1000ノード未満では機能が最大限に発揮されないためです。どの[[glossary/devnet|開発ネットワーク (devnet)]]でもこれが必要です。

## [[glossary/fallback|フォールバック]]計画: デューティ分割型[[glossary/PeerDAS|PeerDAS]]

私たちは分散型[[glossary/reconstruction|再構築]]、より正確にはその2つの側面について議論し、実装してきました。

1.  高[[glossary/custody|カストディ]]ノード間で[[glossary/reconstruction|再構築]]負荷を分散し、どのノードもすべてのリカバリを繰り返さないようにする。
2.  [[glossary/row-topics|行]]軸に沿って[[glossary/custody|カストディ]]をプールすることで、高[[glossary/custody|カストディ]]ノードがない場合でも分散型[[glossary/reconstruction|再構築]]を可能にする。

[[glossary/EIP|EIP]]には両方の目標がありますが、最初の目標のみを保持する縮小版があり、ほとんどの機構を必要としません。[[glossary/row-topics|行]]の割り当てと義務のフェーズ化は引き続き行いますが、[[glossary/row-topics|行トピック]]は使用しません。高[[glossary/custody|カストディ]]ノードは少なくとも64カラム、したがってすべての[[glossary/row-topics|行]]の少なくとも64セルを保持するため、[[glossary/row-topics|行チャネル]]なしで自身の[[glossary/custody|カストディ]]から割り当てられた[[glossary/row-topics|行]]を[[glossary/reconstruction|再構築]]できます。[[glossary/reconstruction|再構築]]されたセルは、同じ部分メッセージ機構（マルチソース統合、これは上記の表のリクエスト規律のために構築されたものです）を介してセル粒度で[[glossary/column-subnets|カラムサブネット]]に戻されます。割り当てられた義務の背後では、今日の[[glossary/PeerDAS|PeerDAS]]の動作が安全性の最終防衛策として残ります。つまり、高[[glossary/custody|カストディ]]ノードは、最終防衛的な遅延の後、まだ不足しているものをすべて[[glossary/reconstruction|再構築]]します。したがって、このバリアントは正確に現状に劣化し、それ以下になることはありません。仕様変更としては、[[glossary/PeerDAS|PeerDAS]]の[[glossary/reconstruction|再構築]]ルールに小さな修正を加えるだけであり、新しいサブシステムではありません。

図3と同じストレステストハーネス（1000ノード、[[glossary/mainnet|メインネット]][[glossary/supernodes|スーパーノード]]対[[glossary/row-topics|行]]比率での[[glossary/EIP|EIP]]のハッシュ割り当て、両側でデプロイされたクライアントモデル）で測定したところ:

-   ネットワーク全体の[[glossary/reconstruction|再構築]]CPUは、[[glossary/supernodes|スーパーノード]]シェア10%で損失ゼロの場合、**48.6秒**から**2.75秒**に減少（20%で**91秒 → 6.6秒**） — グリッド全体で**11〜18倍**の削減。これは、待機が依然として役立つため、÷13の義務分割計算単独よりも大きい — そして、カラムの半分までが非公開にされた場合でも**2.8〜3.4秒**の範囲（10%の場合; 20%で4.7〜6.6秒）にとどまります。デプロイされたクライアントモデルでは**34〜99秒**かかります。
-   非公開データはスロット開始から**1.1〜1.8秒**で戻ってきており、デプロイされた[[glossary/PeerDAS|PeerDAS]]と同じクライアント遅延ウィンドウに乗っています。割り当てられた義務の背後にあるティアの最終防衛策はまったく発動しませんでした。
-   [[glossary/row-topics|行]]軸の約10MBのシグナリングは**ゼロ**に減少します — [[glossary/row-topics|行トピック]]がないため — そしてカラム軸のバイト数は[[glossary/PeerDAS|PeerDAS]]と同等（10%でスロットあたり**381〜394MB**対**372〜414MB**）にとどまります。

この[[glossary/fallback|フォールバック]]が諦めるのは、[[glossary/row-topics|行トピック]]のみが提供するすべてです。[[glossary/reconstruction|再構築]]には依然として高[[glossary/custody|カストディ]]ノードが必要です — 目標2は失われます。[[glossary/custody|カストディ]]をプールするための[[glossary/row-topics|行トピック]]がないため、個別に64カラム未満を保持するノードは集合的に[[glossary/reconstruction|再構築]]できなくなり、リカバリは今日と同じく[[glossary/supernodes|スーパーノード]]ティアに固定されます。データを失った[[glossary/column-subnets|カラムサブネット]]は、[[glossary/row-topics|行]]軸を介してリカバリできなくなります。L2ノードが追跡するための[[glossary/blob|ブロブ]]ごとのチャネルもありません。そして、割り当てられた[[glossary/row-topics|行]]を共有する約8〜16ノード（[[glossary/supernodes|スーパーノード]]シェア10〜20%の場合）間の抑制は、順序付けられたものではなく統計的なものであるため、ストレス下の[[glossary/row-topics|行]]は、[[glossary/RowDAS|RowDAS]]が単一の指定されたリカバリを支払うのに対し、複数のリカバリを要します。同じ深度で[[glossary/RowDAS|RowDAS]]の0.65秒に対し、ネットワーク全体で**3.4秒**です。これがこのバリアントの正直な役割です。CPUの主張は、[[glossary/row-topics|行レイヤー]]がまったく出荷されなくても存続し、[[glossary/row-topics|行レイヤー]]はそれだけが提供するものによって正当化されます。

## ステータス

-   [[glossary/EIP|EIP]]の実装により、いくつかの**具体的な仕様改善**が生まれました。その中には、イーガーなクロス転送プッシュがアドバタイズメントのみになったこと、「[[glossary/row-topics|行]]リクエストを遅延させてもよい」が「遅延させるべき」に強化されたこと、[[glossary/custody|カストディ]]最小ノードが評価できる機会主義的[[glossary/reconstruction|再構築]]の明示的なアクティベーション条件などがあります。
-   上記のすべては、実際の暗号化を用いた16〜1000ノードのシミュレートされたインプロセスネットワークです。**まだ[[glossary/devnet|開発ネットワーク (devnet)]]はありません**。`ROW_SUBNET_COUNT = 128`自体は、より少ないカウントからの外挿です。より大規模なシミュレーションが進行中であり、その後Kurtosisと[[glossary/devnet|開発ネットワーク (devnet)]]での実行が予定されています。
-   [[glossary/Sparse-blobpools|スパースブロブプール]]との互換性は設計目標ですが、まだ測定結果は出ていません。[[glossary/cell-level-deltas|セルレベルメッセージ]]は、[[glossary/FullDASv2|FullDASv2]]の`getBlobs`ベースの[[glossary/reconstruction|再構築]]とそのプライベート[[glossary/blob|ブロブ]]に関する議論が想定するまさにそのレジームですが、専用の分析と[[glossary/EIP|EIP]]のセクションはまだ作成されていません。
-   [[glossary/row-topics|行チャネル]]の導入により、ノードは特定の[[glossary/blob|ブロブ]]を収集できるようになり、[[glossary/L2-nodes|L2ノード]]にとって興味深い機会となります。この側面の探求はまだこれからです。
-   **デューティ分割型[[glossary/PeerDAS|PeerDAS]]**の[[glossary/fallback|フォールバック]]により、提案には**段階的な導入パス**が与えられます。[[glossary/reconstruction|再構築]]負荷の修正は、[[glossary/PeerDAS|PeerDAS]]の[[glossary/reconstruction|再構築]]ルールへの小さな修正として（新しい[[glossary/row-topics|トピック]]も新しいコンテナもなしに）最初に出荷され、[[glossary/row-topics|行レイヤー]]は、それだけが提供するものによって正当化される第二段階として導入できます。この分割を[[glossary/EIP|EIP]]テキストに明示的に組み込むことが、現在のリストにあります。
-   次のステップは、[[glossary/mainnet|メインネット]]規模および実際のネットワークでの評価です。2番目の実装はすでに先行しています。私の2年前のNim [[glossary/FullDAS|FullDAS]]プロトタイプには、いくつかの構成要素が存在していました。

[[glossary/EIP|EIP]]テキスト自体の議論は、[ethereum-magicians](https://ethereum-magicians.org/t/eip-8371-rowdas-distributed-blobspace-reconstruction/29320)で行われています。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/rowdas-eip-8371-distributed-blob-reconstruction-measured/25897)
