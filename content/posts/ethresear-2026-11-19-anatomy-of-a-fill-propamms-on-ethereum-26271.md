---
title: 約定の解剖学：イーサリアム上のPropAMM
original_title: 'Anatomy of a Fill: PropAMMs on Ethereum'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/anatomy-of-a-fill-propamms-on-ethereum/26271'
author: santidipaolo
date: '2026-11-19'
category: Execution Layer Research
tags:
  - execution-layer
  - proprietary-amm
  - mev
  - pbs
  - block-building
  - economics
  - defi
  - research
topic_id: '26271'
translated_at: '2026-11-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Anatomy of a Fill: PropAMMs on Ethereum](https://ethresear.ch/t/anatomy-of-a-fill-propamms-on-ethereum/26271) — santidipaolo (2026-11-19)

*著者: [@santidipaolo](https://ethresear.ch/u/santidipaolo), [@jpinasco](https://ethresear.ch/u/jpinasco), [@agustinpolfinance](https://ethresear.ch/u/agustinpolfinance) ([POL Finance](https://pol.finance))*

Uniswapでは、ブロックの最初の取引は、しばしば最大12秒前の価格を狙う裁定者によるものであり、流動性プロバイダーがその費用を負担しています。イーサリアム上の[[Proprietary-AMM|PropAMM（プロプライエタリAMM）]]は、マーケットメーカーが[[Block-Builder|ブロックビルダー]]に価格をストリームすることでこれを回避しますが、その代償として、ビルダーが順序付けに関する約束を守ることを信頼する必要があります。この投稿では、そのシステムを通じて1つの取引が秒単位でどのように処理されるかを追跡します。

## ハイライト

-   **AMM vs [[Proprietary-AMM|PropAMM]]。** 従来のAMMでは、誰かが取引したときにのみ価格が変動するため、裁定者が古い価格を狙い、流動性プロバイダーがその費用を支払います。[[Proprietary-AMM|PropAMM]]では、1つのマーケットメーカーが[[Block-Building|イーサリアムブロックを構築する]]企業である[[Block-Builder|ビルダー]]に新しい価格をストリームし、ビルダーはあなたの取引の直前に最新の価格をブロックに書き込みます。
-   **あなたの取引は現在の価格で約定します。** あなたが署名するときに表示されるのは見積もりです。あなたが取得する価格は、メーカーの最新の更新であり、ブロックに書き込まれます。私たちが追跡したあるスワップでは、その更新はブロックのスロット開始から0.8秒後に署名されました。遅れた更新でも、ビルダーがスロット開始から1秒以上ブロックに入札し続けるため、ブロックに含まれます。取引はほぼ10秒前に構築されていました。これにはユーザーが署名する時間も含まれるため、メカニズム自体はより高速です。LambdaClassルーターを通じて、取引はブロックが構築された時点で有効な最良のオファーに送られます。直接取引は、最小出力制限によってのみ保護されます。
-   **メーカーは遅れて知る。** メーカーは、価格を署名してから中央集権型取引所（CEX）ではミリ秒であるのに対し、ブロックを見て初めて約定したことを知ります（中央値で1.23秒後）。それまでヘッジ（hedge）できません。このギャップがスプレッド（spread）の対価です。ギャップが短くなるほど、メーカーはよりタイトな価格を提示できます。

## [[Proprietary-AMM|PropAMM]]とは

[[Proprietary-AMM|PropAMM]]（プロプライエタリAMM）は、流動性と価格が単一のマーケットメーカー（maker）に属するオンチェーンプールです。メーカーは、イーサリアムブロックごとに何百回も、好きなときに価格を書き換えます（[LambdaClass](https://blog.lambdaclass.com/propamms-pushing-ethereum-to-the-next-level-of-finance/)）。トレーダー、つまりテイカー（taker）にとっては、どのAMMとも同じように見えます。コントラクトを呼び出してトークンを取得します。メーカーにとっては、オーダーブック（order book）のように機能します。準備金曲線（reserve curve）に沿ってではなく、独自の公正価値の周りに買い気配と売り気配を提示します。

[[Proprietary-AMM|PropAMM]]は2026年5月に[[mainnet|メインネット]]で稼働を開始しました。2026年9月14日から20日の週には、最大の2つであるFermiとMetricがそれぞれ2億8000万ドルと1億7800万ドルを取引しました。これは、同週のUniswapの60億ドルの合計7.6%に相当します。ethresear.chによると、[[Proprietary-AMM|PropAMM]]は[[mainnet|メインネット]]のスワップボリュームの5〜10%を占め、モデルが始まったSolanaの主要な取引所ではボリュームの約40%を占めています（[ethresear.ch](https://ethresear.ch/t/ethereum-propamms-today-and-tomorrow/26129)）。

![週次ボリューム](https://ethresear.ch/uploads/default/optimized/3X/5/4/54456c29120c35d3f0d32bf59ab5685cf388bbcd_2_689x395.png)

*図1. ethresear.ch 26129、2026年9月14日〜20日の週*

混同しやすい2つの設計があります。

-   カーブAMM（Uniswap）はプールの準備金から価格を決定するため、価格は誰かが取引したときにのみ変化します。[[Proprietary-AMM|PropAMM]]の価格は、メーカーが独自のクローズドソースモデルを使用して決定したときに変化します。
-   RFQ（Hashflow、0x RFQ）は、テイカーがAPIで署名済みクォートを要求し、それを自身のトランザクション内に含めます。[[Proprietary-AMM|PropAMM]]では、価格はコントラクト内にあり、テイカーはトランザクションが実行されたときにそれが示すものに対して実行します。

イーサリアムでは、両者の境界線はSolanaよりも曖昧であり、それがこの投稿の主題です。

## Solanaで始まった理由とイーサリアムで問題となる点

[[Proprietary-AMM|PropAMM]]は、メーカーの価格更新が裁定者が古い価格に対して取引する前に実行される場合にのみ機能します。

Solanaでは、チェーンがそれを無料で提供します。ブロックは約400ミリ秒ごと（1スロット）に生成されます。価格更新には約500〜700計算単位（CU、Solanaの実行コストの測定単位）がかかるのに対し、スワップには17,000以上かかります（[arXiv 2609.38056](https://arxiv.org/html/2609.38056)）。リーダーはトランザクションをCUあたりの手数料で順序付けします。メーカーはほとんど費用を支払わず、最初に処理され、1秒間に何度も更新できます。

![Solana CU](https://ethresear.ch/uploads/default/optimized/3X/d/9/d9fcaa86d76eb9741ade1f37ba30a44da6efa9be_2_689x395.png)

*図2. arXiv 2609.38056*

イーサリアムでは、次の3つの理由でそれが機能しません（[ethresear.ch 25543](https://ethresear.ch/t/proprietary-amms-and-ethereum/25543)）。

1.  スロットは12秒です。スロットの終わりまでに、その開始時に設定された価格は古くなります。
2.  誰かが取引したかどうかにかかわらず、すべての更新はネットワークのベース手数料を支払います。
3.  [[Block-Builder|ブロックビルダー]]が順序を選択します。[[Block-Building|イーサリアムブロックは]]、[[MEV-Boost|MEV-Boost]]を通じて各ブロックを構築する権利に入札する専門企業である[[Block-Builder|ビルダー]]によって組み立てられます。ブロックを提案する[[Proposer|プロポーザー]]（提案者）が最高の入札を受け取ります。ビルダーはメーカーの更新を破棄し、古い価格に対する裁定を売却する可能性があります。

この問題の解決策は、保証を[[Block-Builder|ビルダー]]に移すことでした。Titanは[[Proprietary-AMM|PropAMM]] APIを公開し、後にQuasar、BuilderNet、Bomboraが採用しました（[ethresear.ch](https://ethresear.ch/t/ethereum-propamms-today-and-tomorrow/26129)）。メーカーはトランザクションを送信する代わりに、署名された更新をそれらのビルダーにストリームします（[Titan docs](https://docs.titanbuilder.xyz/propamms)）。各ビルダーはプールごとに最新の更新のみを保持し、そのプールに対する最初の取引の直前にそれをブロックに書き込み、誰も取引しない場合はそれをスキップします。この順序付けは、プロトコルで強制されるものではなく、4つの企業による約束です。[[ERC|ERC]]-8324のような標準化の提案は存在しますが、まだ稼働していません。

[[Layer-2|レイヤー2]]は別のケースです。Baseは手数料順に200ミリ秒のサブブロック（Flashblocks）を生成するため（[Base docs](https://docs.base.org/base-chain/network-information/block-building)）、Solanaのアプローチがほぼ機能します。この投稿はイーサリアム[[Layer-1|L1]]に関するものです。

## 1つの取引、ステップバイステップ

5つの関係者が関与します。メーカー、テイカー、テイカーに価格を見つけるアグリゲーター（aggregator）、[[Block-Builder|ビルダー]]、そして[[Proposer|プロポーザー]]です。テイカーが得る価格は、取引前にメーカーが[[Block-Builder|ビルダー]]に送信した最後の更新であり、テイカーが署名したときにオンチェーンにあったものは関係ありません。

![スロットタイムライン](https://ethresear.ch/uploads/default/optimized/3X/9/5/956d3cc0788c4f2decb57cb168ce9e0a8308cc78_2_689x312.png)

*図3. 1つのイーサリアムスロット・イラストレーションのタイミング; ethresear.ch 26129およびTitan docsのルール*

0.  **誰も取引する前。** メーカーは取引所価格を読み取り、価格モデルを実行し、価格更新に署名してTitan、Quasar、BuilderNet、Bomboraにストリームします。これはブロックごとに何百回も、数十ミリ秒ごとに1回行われます（[[PropAMM-Factory|PropAMM Factory]]）。これらはまだチェーンに触れていません。
1.  **クォート。** テイカーのウォレットまたはアグリゲーターが見積もりを要求します。プールのオンチェーン価格は古いので、アグリゲーターは[[Block-Builder|ビルダー]]が公開するプレビューに対して取引をシミュレートします。これは、最新の更新が適用された場合のプールがどのように見えるかを示します（[LambdaClass](https://blog.lambdaclass.com/propamms-pushing-ethereum-to-the-next-level-of-finance/)）。
2.  **署名と送信。** テイカーは、最小出力（minOut）を持つ通常のトランザクションに署名します。取引がそれよりも少ない値を返す場合、リバート（revert）します。トランザクションは[[Block-Builder|ビルダー]]にプライベートに送信され、誰もが見ることができるパブリックメムプール（public mempool）をスキップします（[Bombora docs](https://bombora.build/docs/propamm-takers/)）。
3.  **ブロックを待つ。** 新しいブロックは12秒ごとに生成されるため、次のブロックに含まれる取引は最大12秒、平均で約6秒待ちます。含まれない取引は次のブロックを待ちます。その間、メーカーは価格を更新し続け、[[Block-Builder|ビルダー]]は取引自体よりも少なくとも50ミリ秒新しい更新に対してのみ取引をマッチングします。
4.  **[[Block-Building|ブロック構築]]。** [[Block-Builder|ビルダー]]は、そのプールに対する最初の取引の直前にメーカーの最新の更新を書き込みます。同じブロック内の後続の取引は同じ更新を使用します。LambdaClass [[Proprietary-AMM|PropAMM]]ルーターを通じて送信された取引は、この時点ですべての[[Proprietary-AMM|PropAMM]]に対して再クォートされ、最良のオファーに送られ、minOutを上回るものがなければUniswap v3にフォールバックします。
5.  **包含。** ブロックは次のスロットの開始時に提案され、ネットワークの大部分には1.5〜2秒後に到達します。A. Fullerのメモがカバーする期間において、Titanはブロックの44%を構築し、[[Proprietary-AMM|PropAMM]]取引の69%を処理しました（[データメモ](https://memos.azfuller.com/propamms/)）。
6.  **[[Settlement|決済]]。** トークンはスワップ自体の中で移動します。ブロックは2エポック後に[[Final|ファイナル]]になります。2 × 32スロット × 12秒、約12.8分です。

以下は、Zonda Marketsが運営する[[Proprietary-AMM|PropAMM]]であるEl Zorroに対する実際の取引の1つです。

![1つの取引、3つのタイムスタンプ](https://ethresear.ch/uploads/default/optimized/3X/5/8/583d7b7741fb83ead9c000983e34778b78e07684_2_689x315.png)

*図4. スワップ 0x395370f11681ae554d7308bd93be60ad8530a638727e617e75ac5b73fea04ed7 · El Zorroオンチェーンデータ*

約定は現在の価格で行われます。スワップはUTC 07:50:14に構築されました（付録のメソッドでトランザクションのデッドライン（deadline）から読み取ります）。そのブロックのスロットは9秒後に開始され、それに対して実行された更新はさらに0.8秒後に署名されました。ユーザーはトランザクションが構築された後に署名し、チェーンはいつ署名されたかを記録しないため、その9秒の一部はユーザーがウォレットのポップアップを読み取る時間であり、メカニズム自体の遅延（latency）は9秒未満でした。ユーザーが署名時に見たものは見積もりであり、価格は実行時に署名された更新から来ました。

メーカーが1つの価格を表示し、より悪い価格で約定するのを防ぐものは、ルートによって異なります。LambdaClassルーターを通じて、取引はブロックが構築された時点で有効な最良のオファーに送られます。1つの[[Proprietary-AMM|PropAMM]]への直接取引は、そのminOutによってのみ保護されます。これは、トレーダーのスリッページ許容度（slippage tolerance）で損失を制限しますが、その中で最良の価格を保証するものではありません。

図5は、1日のEl Zorroに対するすべてのスワップについて、ウォレットまたはアプリによって作成されたものとしてラベル付けされた同じ3つのタイムスタンプを示しています。CoWを通じて[[Settlement|決済]]される注文は、そのバッチオークション（batch auction）を待ち、より時間がかかります。各線はトランザクションが構築された時点から始まり、ユーザーが署名する前なので、メカニズム自体にかかる時間を過大評価しています。

![起源別のスワップ](https://ethresear.ch/uploads/default/optimized/3X/a/b/ab9eae411c2b20c2d81dbf8914fd7f55086b8cbd_2_528x500.png)

*図5. El Zorroオンチェーンデータ、2026年10月14日〜15日; 起源はオンチェーンマーカー（インテグレータ文字列、CoW appData、スマートアカウントファクトリ）から*

## メーカーが知るタイミングと、それがスプレッドを設定する理由

ブロックは次のスロットの開始時に提案されますが、その瞬間に誰もそれを見ることはありません。[[Proposer|プロポーザー]]は、最大約1秒間、時にはそれ以上[[Block-Builder|ビルダー]]の入札を収集し続け、中央値のノードはスロット開始から1.5〜2.1秒後にブロックを受信します（[ethPandaOps](http://investigations.ethpandaops.io/2026-05/block-size-vs-propagation/), 50,318ブロック）。[[Block-Builder|ビルダー]]はメーカーに約定通知（fill notification）を送信しないため、メーカーは自身のノードにブロックが到達して初めて取引を知ります。

![スロット境界ズーム](https://ethresear.ch/uploads/default/optimized/3X/d/3/d3a5ab141cecdc9f79a854c44e754c43c586021c_2_689x326.png)

*図6. beaconcha.in（落札カテゴリ、950ミリ秒タイムアウト）、ethPandaOps（50,318ブロック、2026年4月25日〜5月2日）、Bombora docs; メーカーレーン: El Zorro中央値*

El Zorroは、[[mainnet|メインネット]]の24時間（2026年10月14日〜15日、404 WETH取引）でこれを測定しました。そのクォートはスロット開始から中央値で0.76秒後に署名され、そのノードは署名から1.23秒後にブロックを見ました。最も遅い10%の取引では、2.18秒以上かかりました。この約1.2秒間、メーカーは自身が知らないポジションを保有し、取引所でヘッジ（hedge）できません。テイカーも反対側で同じ状況にあります。ブロックが可視になるまで、新しいトークンに対して行動できません。

このウィンドウがスプレッド（spread）の対価です。メーカーは、ヘッジ（hedge）する前に市場がどれだけ動くかをカバーするのに十分な広さで価格を提示します。価格変動は経過時間の平方根にほぼ比例して増加するため、ウィンドウが短いほど、メーカーは同じリスクでよりタイトな価格を提示できます。El Zorroのデータでは、Binanceは取引の16%でウィンドウ中にハーフスプレッド（half-spread）（0.90ベーシスポイント (bps)；1ベーシスポイント (bps)は0.01%）よりも大きく変動しました。2ベーシスポイント (bps)のハーフスプレッドであれば、約5%を除くすべての取引をカバーできたでしょう。ウィンドウからなくなるすべての部分は、トレーダーに戻すことができるスプレッドです。つまり、後の署名、より速いブロック伝播、または[[Proposer|プロポーザー]]がブロックを選択した瞬間に[[Block-Builder|ビルダー]]からの約定通知（fill notification）です。ブロックを[[Proposer|プロポーザー]]に渡すリレーは、ネットワークが知る前に勝者を知っていますが、現在、どの[[Block-Builder|ビルダー]]もそのシグナルを提供していません。

取引が成立するかどうかはそれほど問題ではありません。取引はTitan、Quasar、BuilderNet、Bomboraにプライベートに送信されるため、通常、次のブロックで成立します。残りのリスクは、APIを持たない[[Block-Builder|ビルダー]]がスロットを獲得することです。メモの期間中、Titanだけでブロックの44%を構築しており、4社を合わせた測定はまだ行っていません。

## 古い価格の問題がなくなる理由

Uniswapでの同じ取引を比較してみましょう。ウォレットはプールの現在の準備金に対してスワップをシミュレートし、ユーザーはスリッページ制限（slippage limit）で署名し、スワップはブロックが構築されたときにプールが保持しているものに対して実行されます。出力が制限を下回るとスワップはリバート（revert）し、ユーザーは依然としてガス料金を支払います。

各ブロックの先頭の価格は、最後の取引が残したものです。ETHがBinanceで動くと、裁定者がそれを元に戻すまでプールは古い価格のままになり、その裁定者は最初に処理されるために[[Block-Builder|ビルダー]]に支払います。これらの取引による流動性プロバイダーの損失は、[[Loss-Versus-Rebalancing|LVR（リバランス損失）]]と呼ばれます（[Milionis et al. 2022](https://arxiv.org/abs/2208.06046)）。この設計にはさらに2つのコストが伴います。パブリックメムプール（public mempool）に送信されたスワップは、サーチャー（searcher）がユーザーのスリッページ制限（slippage limit）内で直前に購入し、直後に売却するサンドイッチ攻撃（sandwich attack）を受ける可能性があり、手数料はプールティアごとに固定されています（v3では1、5、30、または100ベーシスポイント (bps)）。

![LVRギャップ](https://ethresear.ch/uploads/default/optimized/3X/c/4/c491633513aa0e6894a4d26cf393c89c341a6096_2_689x395.png)

*図7. イラストレーションのパス、データなし; Milionis et al. (2022)によるLVR*

[[Proprietary-AMM|PropAMM]]では、[[Block-Builder|ビルダー]]は取引自体よりも少なくとも50ミリ秒新しい更新に対してのみ取引をマッチングします（[ethresear.ch](https://ethresear.ch/t/ethereum-propamms-today-and-tomorrow/26129)；Titanはこれを鮮度保護（freshness protection）と呼び、閾値を設定可能にしています）。テイカーはトランザクションを送信した後に計算された価格を取得し、メーカーは前のブロックの価格に縛られることはありません。Uniswapで裁定者が狙う12秒前の価格は存在しません。残るのは前セクションの約1秒のウィンドウです。LambdaClassは直接的にその結果を述べています。「メーカーは古い価格のリスクを負う必要がなくなったため、スプレッド（spread）を狭め、クォートを改善できます」（[LambdaClass](https://blog.lambdaclass.com/propamms-pushing-ethereum-to-the-next-level-of-finance/)）。

新しい価格は両刃の剣です。その間に市場がテイカーに不利に動いた場合、テイカーは取引所の成行注文と同様に悪い価格を受け取ります。それでも、メーカーが注文を見て約定するかどうかを決定する「ラストルック（last look）」ではありません。メーカーは取引を見ることはなく、[[Block-Builder|ビルダー]]がペアリングを行います。

## 中央集権型取引所での同じ取引

中央集権型取引所（CEX）では、取引は内部イベントです。テイカーは成行注文を送信します。取引所はすでにカストディ（custody）している残高を確認し、マイクロ秒から約1ミリ秒で注文をオーダーブック（order book）とマッチングさせ、ミリ秒で確認します。[[Settlement|決済]]はデータベースのエントリであり、ユーザーが数時間または数日後に引き出すまで、オンチェーンで何も移動しません。メーカーの注文はオーダーブック（order book）の既知の場所にキュー（queue）として存在するため、競争はそこに最初に到達し、迅速にキャンセルすることです。取引はマッチングエンジンがそれを書き込んだ瞬間に[[Final|ファイナル]]になり、リスクは取引所自体にあります。

## クロック、並べて

約定までの時間では、イーサリアム[[Proprietary-AMM|PropAMM]]はCEXよりも約4桁（約10,000倍）遅く（12秒対約1ミリ秒）、Solanaよりも30倍遅いです。実行される価格の古さに関しては、ギャップははるかに小さいです。El Zorroのデータでは、更新は[[Block-Builder|ビルダー]]がブロックを確定する約0.6秒前（中央値）に署名されました。

![クロック、並べて](https://ethresear.ch/uploads/default/optimized/3X/0/f/0f5d6ca632e14f9372e52ae3c0b6b39c96d47f8_2_689x324.png)

*図8. ethresear.ch 26129（Solana、イーサリアムスロット）、Base docs（Flashblocks）、イーサリアム[[Final|ファイナリティ]] = 2エポック × 32スロット × 12秒; CEXの範囲は第三者の見積もり*

2つのクロックがあります。スロットクロック（slot clock）は12秒で、取引が[[Settlement|決済]]されるタイミングを設定します。クォートクロック（quote clock）は価格の古さを設定します。ブロックが確定された時点で約0.6秒、メーカーがそれを見た時点で約1.2秒です。Uniswapではこの2つは同じクロックであるため、ブロックが遅いと価格が古くなります。[[Proprietary-AMM|PropAMM]]はこれらを分離し、それがイーサリアムのブロック時間で機能することを可能にします。クォートクロック（quote clock）は、スプレッド（spread）が支払われる対象でもあります。

|  | CEX | Uniswap | [[Proprietary-AMM|PropAMM]] (イーサリアム) |
| --- | --- | --- | --- |
| 価格が存在する場所 | 取引所のオーダーブック（order book） | プール準備金（曲線） | コントラクト、メーカーによって書き換えられる |
| 取引の順序を設定する者 | マッチングエンジン（matching engine）、価格・時間 | [[Block-Builder|ビルダー]]、自身の利益のため | [[Block-Builder|ビルダー]]、取引前の更新 |
| 約定時の価格の古さ | マイクロ秒 | 最大12秒 | 取引到着後に署名 |
| 約定までの時間 | マイクロ秒からミリ秒 | 次のブロック（12秒）以降 | 次のブロック（12秒）以降 |
| メーカーが約定を知るタイミング | ミリ秒 | 該当なし（受動的プール） | クォートから約1.2秒後（中央値） |
| メーカーの逆選択 | キャンセル競争 | 裁定者への[[Loss-Versus-Rebalancing|LVR]] | 更新と約定の間のウィンドウ |
| カストディ（custody） | 取引所 | オンチェーン、テイカー | オンチェーン、テイカー |
| [[Settlement|決済]] | 内部台帳、即時 | アトミックなオンチェーン | アトミックなオンチェーン |
| 信頼仮定 | 取引所の支払い能力 | 順序付けに関する信頼なし | [[Block-Builder|ビルダー]]がルールを尊重すること |

## 数字で見る

ここでの情報源は、単一著者のメモまたは利害関係者です。

| メトリック | 値 | 情報源 |
| --- | --- | --- |
| ETH/USDCフルスプレッド（メーカー自身のミッド周辺の売り気配 − 買い気配、最小サイズ、2026年9月1日の単一スナップショット） | 0.86ベーシスポイント (bps) (Metric) から 4.20ベーシスポイント (bps) (bopAMM); Fermi 2.34ベーシスポイント (bps) | A. Fullerメモ |
| 1日あたりの資本回転率（capital turnover） | Fermiは540万ドルの流動性に対して約23倍; 同じペアのUniswap v3は3億1900万ドルに対して0.6倍。メモの期間: 上記9月のボリュームでは、Fermiは約7倍 | A. Fullerメモ |
| ガス、価格更新 vs スワップ（Baseで測定） | 約27〜33K vs 200〜400K | arXiv |
| LambdaClassルーターフロー | 1日あたり約1,000スワップで約1300万ドル（2026年9月22日） | LambdaClass |

資本回転率（capital turnover）の行はビジネスモデルです。メーカーはプールに流動性を留めておくのではなく、取引所の在庫から補充するため、数百万ドルの資本がUniswapの同じペアのプールと同程度のボリュームを処理します。

## トレードオフ

根本的な違いは、メーカーの価格と取引の間の順序を誰が制御するかです。CEXではマッチングエンジン（matching engine）、Uniswapでは誰も、イーサリアム[[Proprietary-AMM|PropAMM]]では[[Block-Builder|ビルダー]]です。[[Proprietary-AMM|PropAMM]]はメーカーに反応する能力を取り戻させ、そのエクスポージャーを12秒前の価格からブロックを見るまでの約1秒に縮小します。その代償は、順序付けに仲介者（intermediary）が戻ってくることです。プロトコルで強制されることなく、更新を最初に書き込むことを約束する4つのプライベート[[Block-Builder|ビルダー]]です。

## 付録: [[Block-Builder|ビルダー]]とマーケットメーカー向け

### A1. スロット境界、ステップバイステップ

1.  **スロットNの終了: 最後の更新と約定。** 各メーカーの更新は、次の単一ブロックに対して有効です（[Bombora docs](https://bombora.build/docs/propamm-makers/)）。約定は、[[Block-Builder|ビルダー]]自身の受信タイムスタンプのみを使用して、鮮度バッファ（freshness buffer）よりも後に受信されたクォートに対してのみ適格です。`taker_received_at + freshness_buffer < quote_received_at`。
2.  **t = 0: getHeader。** スロットN+1の[[Proposer|プロポーザー]]は、リレーに最適なヘッダーを要求します。[[MEV-Boost|MEV-Boost]]のデフォルトタイムアウトは950ミリ秒で、約1秒のハードリミットがあります（[beaconcha.in](https://docs.beaconcha.in/mev-timing-games/introduction.md)）。落札がコミットされるまで、[[Block-Builder|ビルダー]]は再入札を続け、Titanはすべてのクォート更新で候補を再評価します（[Titan docs](https://docs.titanbuilder.xyz/propamms)）。
3.  **0から3.5秒: 落札がコミットされる。** beaconcha.inは、スロット開始からコミットされた落札までの時間を、オンタイム（≤ 1,200ミリ秒）、タイミングゲーム（timing games）（1,201〜2,600ミリ秒）、またはアグレッシブ（> 2,600ミリ秒）に分類します。待機する[[Proposer|プロポーザー]]はより高い入札を収集します。
4.  **署名、getPayload、ブロードキャスト。** [[Proposer|プロポーザー]]はブラインドヘッダーに署名し、getPayloadを呼び出し、リレーがブロックを公開します。ステップごとの遅延（latency）は公開されていません。リレーは、誰もブロックを見る前にgetPayloadでどの入札が勝ったかを知っています。
5.  **約1.5〜2.1秒: ネットワークがブロックを見る。** 中央値のノードは、最初の視認から104ミリ秒（9KBブロック）から348ミリ秒（238KB）後にそれを見ます（p99は427〜1,248ミリ秒）。スロット開始からの中央値は1,505〜2,122ミリ秒です（[ethPandaOps](http://investigations.ethpandaops.io/2026-05/block-size-vs-propagation/)）。
6.  **t = 4秒: [[attestation-deadline|アテステーション期限]]。** [[attesters|アテスター]]はブロックの有無にかかわらず投票します。約3〜3.5秒での提案は、すでに約10%の誤ったヘッド投票を招きます（[ethresear.ch 20272](https://ethresear.ch/t/on-attestations-block-propagation-and-timing-games/20272), 2024年7月〜8月）。
7.  **メーカーが約定を知る。** TitanもBomboraも約定通知（fill notification）を文書化していません。BomboraのACKは更新が転送されたことを確認するだけであり、古いクォートやリバート（revert）するクォートは黙って破棄されます。[[PropAMM-Factory|PropAMM Factory]]はブロックごとの成立チェックを実行します（[LambdaClass](https://blog.lambdaclass.com/announcing-propamm-factory/)）。El Zorroの24時間サンプルでは、そのノードはスロットN+1開始から中央値で1.99秒後にブロックを見ました（p10は1.62秒、p90は3.41秒）。そのプッシャーはさらに約160ミリ秒後に見ました。ブロックは1.7〜1.8秒と3.2〜3.4秒の2つの体制で到着します。ブロックが遅れて確定された場合、[[Block-Builder|ビルダー]]は後の署名を受け取るため、クォートの古さは同じままです。
8.  **リバランス。** メーカーはCEXでミリ秒単位でヘッジ（hedge）するか、オンチェーン在庫を補充します。メーカーのヘッジ遅延（hedging latency）を測定する公開情報はありません。Baseでは、Tesseraはヘッジ（hedge）なしで反対のオンチェーンフローから補充します（[arXiv](https://arxiv.org/html/2609.38056)）。

### A2. 実際の鮮度

El Zorro、[[mainnet|メインネット]]の24時間、2026年10月14日〜15日、404 WETHの包含。含まれたクォートはスロット開始から中央値で0.76秒後に署名されました。[[Block-Builder|ビルダー]]は署名から約0.61秒後に確定しました（Titanの公開ストリームからの上限）。El Zorroのノードは署名から1.23秒後にブロックを見ました（p10は0.84秒、p90は2.18秒）。Titan、BuilderNet、Quasarは同じ分布を示し、0.5秒よりも新しいものは含まれていません。

このウィンドウ中に、BinanceのETHUSDTは中央値で0.04ベーシスポイント (bps)変動し、p90では1.72ベーシスポイント (bps)変動しました。これは公開されているハーフスプレッド（half-spread）の0.90ベーシスポイント (bps)（中央値）と比較されます。変動がハーフスプレッド（half-spread）を超えたのは包含の16%でした。2ベーシスポイント (bps)のハーフスプレッド（half-spread）であれば、それを約5%に削減できたでしょう。ステーブルコインペア（stablecoin pairs）は別の集団です。価格が動いたときにのみクォートが再署名されるため、中央値で6.9秒の古さでもコストはかかりません。

### A3. メーカーがそれを実装する方法: El Zorro

El ZorroはLambdaClassのオープンソースキットである[[PropAMM-Factory|PropAMM Factory]]で動作します。

-   クォートアップデーター（quote updater）は取引所フィード（exchange feeds）を読み取り、ペアごとに価格モデル（pricing model）を実行し、更新に署名して[[Block-Builder|ビルダー]]にストリームし、「ブロック全体を通じて」価格を更新します。
-   価格モデル（pricing model）は、固定価格から、ボラティリティと在庫に応じてスプレッド（spread）が広がる取引所価格まで多岐にわたります。
-   [[Proprietary-AMM|PropAMM]]コントラクトは、[[Priority-Update-Registry|Priority Update Registry]]から価格を読み取り、取引を約定します。
-   運用: 成立チェック、サーキットブレーカー（circuit breakers）、アラート、および公開されたすべてのクォートのPostgresレコード。

### A4. トランザクションのタイミングを測定する方法

チェーンはトランザクションがいつ構築または署名されたかを記録しません。ウォレットとアグリゲーターは、スワップのデッドライン（deadline）を、構築された時点にラウンドTTL（生存時間）（round time-to-live (TTL)）を加えたものに設定します。600、1,200、1,800、または3,600秒です。デッドライン（deadline）−ブロック時間よりもわずかに大きいラウンド値を取ることでTTLが回復し、デッドライン（deadline）−TTLでトランザクションが構築された時点が得られます。ボットフロー（bot flow）は、ボットがそのようにデッドライン（deadline）を設定しないため、除外されます。これにより、39のWETHスワップが残ります。24の直接取引と15のCoW注文で、その時間にはCoWのバッチオークション（batch auction）も含まれます。デッドライン（deadline）はウォレットがユーザーに署名を要求する前に設定されるため、そこから測定される時間はユーザーの署名時間を含み、メカニズム自体の遅延（latency）の上限となります。

### A5. 完全な比較

|  | CEX | AMM (Uniswap v3/v4) | [[Proprietary-AMM|PropAMM]] (イーサリアム[[Layer-1|L1]]) | RFQ (Hashflow, 0x RFQ) |
| --- | --- | --- | --- | --- |
| 価格が存在する場所 | マッチングエンジン（matching engine）のオーダーブック（order book） | プール準備金（曲線） | コントラクト状態、メーカーによって書き換えられる | オフチェーン署名済みクォート |
| それを動かす者 | メーカー、自由に | 取引のみ | メーカー、[[Block-Builder|ビルダー]]にストリーム | メーカー、要求に応じて |
| 順序を設定する者 | マッチングエンジン（matching engine）、価格・時間 | [[Block-Builder|ビルダー]]、自身の利益のため | [[Block-Builder|ビルダー]]、更新-約定前ルール | テイカーがトランザクションにクォートを保持 |
| 約定時の価格の古さ | マイクロ秒 | 最大12秒（最終取引） | 約定より50ミリ秒以上新しい | クォート期限まで |
| 約定までの時間 | 約1ミリ秒 | 次のスロット（12秒）以降 | 次のスロット（12秒）以降 | 次のスロット（12秒）以降 |
| メーカーが約定を知るタイミング | ミリ秒 | 該当なし（受動的LP） | クォートから約1.2秒後（中央値） | ブロック可視時 |
| メーカーの逆選択 | キャンセル競争 | 裁定者への[[Loss-Versus-Rebalancing|LVR]] | 更新と約定の間のウィンドウ | クォート有効性ウィンドウ |
| カストディ（custody） | 取引所 | オンチェーン、テイカー | オンチェーン、テイカー | オンチェーン、テイカー |
| [[Settlement|決済]] | 内部台帳、即時 | アトミックなオンチェーン | アトミックなオンチェーン | アトミックなオンチェーン |
| 信頼仮定 | 取引所の支払い能力 | 順序付けに関する信頼なし | [[Block-Builder|ビルダー]]がルールを尊重すること | 順序付けに関する信頼なし |

## 情報源

-   [Titan Builder, propAMM docs](https://docs.titanbuilder.xyz/propamms)
-   [ethresear.ch, Ethereum PropAMMs today and tomorrow](https://ethresear.ch/t/ethereum-propamms-today-and-tomorrow/26129)
-   [POL Labs, PropAMMs on Ethereum: Beating the 12-Second Staleness Problem](https://labs.pol.finance/blog/posts/propamms-on-ethereum-beating-the-12-second-staleness-problem)
-   [ethresear.ch, Proprietary AMMs and Ethereum](https://ethresear.ch/t/proprietary-amms-and-ethereum/25543)
-   [LambdaClass, Announcing PropAMM Factory](https://blog.lambdaclass.com/announcing-propamm-factory/)
-   [LambdaClass, propamm-router-contracts](https://github.com/lambdaclass/propamm-router-contracts)
-   [A. Fuller, PropAMMs on Ethereum: a data memo](https://memos.azfuller.com/propamms/)
-   [arXiv 2609.38056](https://arxiv.org/html/2609.38056)
-   Bombora, docs [for takers](https://bombora.build/docs/propamm-takers/) and [for makers](https://bombora.build/docs/propamm-makers/)
-   [Base, block building](https://docs.base.org/base-chain/network-information/block-building)
-   [beaconcha.in, MEV timing games](https://docs.beaconcha.in/mev-timing-games/introduction.md)
-   [ethPandaOps, block size vs propagation (May 2026)](http://investigations.ethpandaops.io/2026-05/block-size-vs-propagation/)
-   [ethresear.ch, On attestations, block propagation and timing games](https://ethresear.ch/t/on-attestations-block-propagation-and-timing-games/20272)
-   [POL Labs, What Are PropAMMs, and Why Do They Matter?](https://labs.pol.finance/blog/posts/what-are-propamms-and-why-do-they-matter)
-   [Milionis, Moallemi, Roughgarden, Zhang (2022), Automated Market Making and Loss-Versus-Rebalancing](https://arxiv.org/abs/2208.06046)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/anatomy-of-a-fill-propamms-on-ethereum/26271)
