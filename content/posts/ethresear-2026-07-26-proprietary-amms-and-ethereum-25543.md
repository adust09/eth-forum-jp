---
title: プロプライエタリAMMとイーサリアム
original_title: Proprietary AMMs and Ethereum
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/proprietary-amms-and-ethereum/25543'
author: mikeneuder
date: '2026-07-26'
category: Execution Layer Research
tags:
  - execution-layer
  - defi
  - mev
  - pbs
  - scaling
  - protocol-design
  - solana
  - dex
  - propamm
topic_id: '25543'
translated_at: '2026-07-27'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Proprietary AMMs and Ethereum](https://ethresear.ch/t/proprietary-amms-and-ethereum/25543) — mikeneuder (2026-07-26)

# プロプライエタリAMMとイーサリアム

![プロプライエタリAMMとイーサリアム](https://ethresear.ch/uploads/default/optimized/3X/8/d/8d7e0d94651800a04c090eccbf7e65e54a9cdae2_2_499x375.jpeg)

*mike ([@mikeneuder](https://x.com/mikeneuder)) & maryam ([@bahrani_maryam](https://x.com/bahrani_maryam)) 著 – 2026年7月26日*

\\cdot
**要するに;** [[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]は、Solanaのオンチェーン取引量の約[[https://defillama.com/dexs/chain/solana|3分の1]]を占めています。これらのコントラクトは、マーケットメイカーが最新の価格で取引を保証するために行う、安価で高速なオラクル更新の巧妙な設計を通じて、アクティブなマーケットメイキング戦略によるオンチェーンの構成可能性を提供します。一部の[[https://pamm.wtf/volume|チーム]]は、同じメカニズムを活用してイーサリアム上でのオンチェーン取引を改善し始めています（ただし、SolanaのPropAMMが5億USDであるのに対し、合計24時間取引量はまだ1,000万USDと非常に小さいです）。この投稿では、イーサリアム上でのオンチェーン取引がどのように進化してきたかを説明し、Solana上のPropAMMを探求し、イーサリアムへの潜在的な影響について議論することで、PropAMMの簡単な入門書を提供します。

\\cdot
*コメントとレビューをくださったapriori ([@apriori0x](https://x.com/apriori0x)) と Quintus ([@0xQuintus](https://x.com/0xQuintus)) に深く感謝いたします。*

* * *

[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]（略称: PropAMM）は、Solanaのオンチェーン取引環境において重要な役割を果たすようになりました。これらのコントラクトとそれらを支えるインフラストラクチャは、オンチェーン取引における大きな発展であると私たちは考えています。この記事は、イーサリアムの視点からPropAMMを理解するための出発点として機能し、Apriori ([@apriori0x](https://x.com/apriori0x)) が最近Katia ([https://open.spotify.com/episode/1luCkJG00rE2878bobdXHu?si=OPXyMV6kTee1SBM3_nwqg](https://open.spotify.com/episode/1luCkJG00rE2878bobdXHu?si=OPXyMV6kTee1SBM3_nwqg)), Quintus ([https://open.spotify.com/episode/36BxOpe1rs1yyVTXhnU8s8?si=GGb-KN6URgWqL9GRCZN0Qw](https://open.spotify.com/episode/36BxOpe1rs1yyVTXhnU8s8?si=GGb-KN6URgWqL9GRCZN0Qw)), Markus ([https://open.spotify.com/episode/5YMFoSpCjzwDuUsRAahsyS?si=tq9chlLHQ_ys4UXCslmGkQ](https://open.spotify.com/episode/5YMFoSpCjzwDuUsRAahsyS?si=tq9chlLHQ_ys4UXCslmGkQ)) と行ったPropAMMに関するDeeply Intentsポッドキャストシリーズに部分的に触発されました。ぜひお聞きください。

PropAMMを馴染みのある用語で位置づけるために、イーサリアムにおける取引フローの進化を順に見ていきます。[[https://ethresear.ch#p-61539-h-1-traditional-automated-market-makersdexs-2|セクション1]]では、パッシブな流動性供給を伴う従来の[[glossary/AMM|AMM（自動マーケットメイカー）]]取引について説明します。[[https://ethresear.ch#p-61539-h-2-request-for-quotes-rfqs-3|セクション2]]では、マーケットメイカーが取引を促進するために明示的に組み込まれる[[glossary/RFQs|RFQ（見積もりリクエスト）]]を検討します。[[https://ethresear.ch#p-61539-h-3-aggregatorsrouters-4|セクション3]]では、多くのソースから流動性を引き出し、ユーザーに最適な全体価格を提供する[[glossary/aggregators-routers|アグリゲーター/ルーター]]について説明します。[[https://ethresear.ch#p-61539-h-4-propamms-on-solana-5|セクション4]]では、Solana上のPropAMM取引のライフサイクルを説明します。[[https://ethresear.ch#p-61539-h-5-propamms-and-ethereum-6|セクション5]]では、イーサリアム上のPropAMMをSolanaと異なる（そして類似している！）構造的特徴について簡単に議論して締めくくります。*買い手注意*：ここでの説明は、異なる取引経路の主要な特徴を説明するために意図的に簡略化されており、企業が垂直統合して異なる製品を提供すると、ここで説明されている異なるフロー間の境界線は曖昧になり始めます。これは高レベルの説明ですが、役立つ出発点となることを願っています。

### 1. 従来の[[glossary/AMM|AMM（自動マーケットメイカー）]]/[[glossary/DEX|DEX（分散型取引所）]]

最も単純なことから始めましょう。「従来の」[[glossary/AMM|AMM]]を考えます。ここでは、誰でもプールに流動性を提供でき、トレーダーはそのプールに対してスワップを行うことができます。次に、ユーザー、フロントエンド、イーサリアムを含むフローを考えます。

![従来のAMM](https://ethresear.ch/uploads/default/optimized/3X/1/3/13184907fd115b6a60e18f20e4ab8beb9cafe20e_2_382x500.png)

1.  *スワップ詳細を要求 –* ユーザーはフロントエンド（またはウォレット）を通じてリクエストを開始し、行いたい取引の詳細を指定します。
2.  *プールデータを取得 –* フロントエンドはイーサリアムのスマートコントラクトからプールデータを読み取ります。
3.  *プールデータ –* チェーンの状態はプール内の現在の流動性を反映します。
4.  *スワップ詳細を表示 –* フロントエンドは、ユーザーがプールに対して取引することで得られる価格を表示します。
5.  *トランザクションに署名 –* ユーザーはトランザクションに署名します。
6.  *トランザクションを送信 –* フロントエンドは[[glossary/Mempool|メムプール (Mempool)]]またはプライベートチャネルを通じて[[glossary/builder|ビルダー]]にトランザクションを送信します。
7.  *トランザクションのインクルージョンを確認 –* トランザクションはオンチェーンに含まれます。
8.  *トランザクションを確認 –* フロントエンドはユーザーに取引の結果を表示します。

**注記:**

-   取引の実行は、トランザクションが実際にブロック内のどこに配置されるかに依存します。例えば、トランザクションがサンドイッチ攻撃を受け、最悪の価格で実行される可能性があります。ユーザーは、恣意的に悪い実行から保護するためにスリッページ許容度を指定しますが、これはボラティリティが高い期間や流動性の低い資産ではうまく機能しません。
-   ユーザーがやり取りする流動性は、通常、ブロックごとにアクティブではありません。例えば、UniV2プールでは、[[glossary/LPs|流動性プロバイダー (LP)]]は価格曲線によって定義された任意の価格で受動的に流動性を提供します。ユーザーは通常、パッシブなメイカーに対して流動性を取ります。[\[1\]](https://ethresear.ch#footnote-61539-1)
-   複数の[[glossary/LPs|流動性プロバイダー (LP)]]が許可なく資本を*結合*してプールを作成し、その内容が単一の曲線とプール内の資産が売却される価格を完全に定義します。

### 2. [[glossary/RFQs|RFQ（見積もりリクエスト）]]

従来の[[glossary/AMM|AMM]]モデルには深刻な欠陥があります。最も顕著なのは、プール内の取引のメイカーとして機能する[[glossary/LPs|流動性プロバイダー (LP)]]が、価格発見が行われる場所（通常は[[glossary/CEX|CEX（中央集権型取引所）]]）での資産の真の価格に対して常にリバランスされていることです（参照: [[glossary/LVR|LVR（損失ボラティリティ比率）]]）。その結果、[[glossary/AMM|AMM]]に対して単独で取引するユーザーは、より流動性の高い市場から得られる価格よりも悪い価格を受け取ることがよくあります。この現実により、製品開発者は、複数のアクティブなマーケットメイカー間の競争に依存することで、取引を促進し、ユーザーにより良い価格を提供するための他の方法を見つけるようになりました。

[[glossary/RFQs|RFQ（見積もりリクエスト）]]は、マーケットメイカーがユーザーの希望する取引方向を埋めるための見積もりを提出し、最適な見積もりを選択することで、マーケットメイカーを取引フローにより明示的に組み込みます。これは上記の従来の[[glossary/DEX|DEX]]フローとは大きく異なります。なぜなら、取引のロジックは完全にオフチェーンで処理され、決済のみがオンチェーンで行われるからです。さらに、[[glossary/RFQs|RFQ]]で提供される流動性は不透明であり（例えば、見積もりが作成されるまで予測不可能）、DeFiエコシステムの他の部分との相互運用性も低いです（例えば、見積もりが埋められるのを待っているユーザーは、フィル取引がマーケットメイカーによって開始されるまで、そのスワップの出力トークンを別の取引でアトミックに使用することはできません）。[\[2\]](https://ethresear.ch#footnote-61539-2) 以下のシーケンス図はこれを図式化しています。

![見積もりリクエスト (RFQs)](https://ethresear.ch/uploads/default/optimized/3X/6/7/673107a0fed9e921db2b1e0c9f1bf9308da6188b_2_492x500.png)

1.  *スワップ詳細を要求 –* ユーザーはフロントエンド（またはウォレット）を通じてリクエストを開始し、行いたい取引の詳細を指定します。
2.  *見積もりを要求 –* フロントエンドはマーケットメイカーに*この特定の取引*に対する特注の見積もりを求めます。
3.  *見積もり –* マーケットメイカーが見積もりを提供します。
4.  *スワップ詳細を表示 –* フロントエンドは、ユーザーに提示された見積もり価格を表示します。
5.  *トークン転送を承認 –* ユーザーはトークン転送を承認します（例えば、提示された見積もりに基づいてインテントに署名することで）。
6.  *転送詳細を共有 –* フロントエンドはユーザーアドレスの詳細をマーケットメイカーに転送します。
7.  *トークン転送トランザクションを送信 –* 見積もりを埋めるマーケットメイカーは、ユーザーのアドレスへのトークン転送とそこからのトークン転送をアトミックに行うことができます。
8.  *トークン転送トランザクションを監視 –* フロントエンドは転送が行われたことを監視します。
9.  *結果を表示 –* フロントエンドはユーザーに取引の結果を表示します。

**注記:**

-   取引価格はチェーンの状態に*依存しません*。マーケットメイカーからのフィルにのみ依存します。
-   取引の「実行」は実際にはオンチェーンでは発生せず、決済のみが行われます。それは、アトミックにまとめて行われる[[glossary/ERC-20|ERC-20]]トークン転送のように見えます。
-   流動性は不透明です。マーケットメイカーは、何を引用し、どのように埋めるかを決定する必要があり、フロントエンドと協力しています。もし彼らが確固たる「実行可能な見積もり」（例えば、30秒後に期限切れになるもの）を提供する場合、*マーケットメイカー*は価格が彼らに不利に動き、悪い価格で取引を行うリスク（例えば、[[glossary/arbitrage|裁定取引者]]に対して）を負います。もし見積もりが非コミットメント的である場合、フロントエンドは見積もりが埋められず、ユーザーとのやり取りが失敗するリスクを負います。フィルレートや[[glossary/RFQs|RFQ]]に参加できる者に関する様々な合意はオフチェーンで処理され、実際には確固たる見積もりとソフトな見積もりの中間のような状態になります。
-   [[glossary/RFQs|RFQ]]は、マーケットメイカー間の競争を明示的に誘発し、[[glossary/LVR|LVR（損失ボラティリティ比率）]]に悩まされないため、パッシブな[[glossary/LPs|流動性プロバイダー (LP)]]との取引よりもはるかに良い価格を提供することがよくあります。
-   [[glossary/UniswapX|UniswapX]]はオフチェーン[[glossary/RFQs|RFQ]]の一例です。落札したクォーターが最終的に注文を埋めなかった場合（および埋めなかった場合のインセンティブ低下）には[[glossary/Dutch-Auctions|ダッチオークション]]が組み込まれていますが、ハッピーパスはまさに上記のフローです。[\[3\]](https://ethresear.ch#footnote-61539-3)

### 3. [[glossary/aggregators-routers|アグリゲーター/ルーター]]

オンチェーンおよびオフチェーンの流動性の複数のソースの存在は、[[glossary/aggregators-routers|アグリゲーター/ルーター]]に依存する取引の自然な進化につながります。これの例としては、[[https://matcha.xyz/|matcha]]、[[https://1inch.com/|1inch]]、[[https://kyberswap.com/swap/ethereum|Kyber]]などがあります。一般的に、[[glossary/aggregators-routers|アグリゲーター/ルーター]]は、その名前が示すとおり、多数のソースから流動性を集約し、ユーザーに可能な限り最高の価格を提供しようとします。この集約された経路には、複数のプールからのオンチェーン流動性と[[glossary/RFQs|RFQ]]からのオフチェーン流動性が含まれる場合があります。以下の図は、[[glossary/aggregators-routers|アグリゲーター/ルーター]]が取引を部分的にオンチェーンで、部分的に[[glossary/RFQs|RFQ]]を通じて埋める様子を示しています。

![アグリゲーター/ルーター](https://ethresear.ch/uploads/default/optimized/3X/5/3/5385f374db86e1db582c1c96e231e11a06b3a440_2_309x500.png)

1.  *スワップ詳細を要求 –* ユーザーはフロントエンド（またはウォレット）を通じてリクエストを開始し、行いたい取引の詳細を指定します。
2.  *見積もりを要求 –* フロントエンドはマーケットメイカーに取引に対する特注の見積もりを求めます。
3.  *見積もり –* マーケットメイカーが見積もりを提供します。
4.  *プールデータを取得 –* フロントエンドはイーサリアムのスマートコントラクトからプールデータを読み取ります。
5.  *プールデータ –* チェーンの状態はプール内の現在の流動性を反映します。
6.  *スワップ詳細を表示 –* フロントエンドは、ユーザーが得られる集約された価格を表示します。
7.  *承認 –* ユーザーは取引の内容を承認します。
8.  *部分的なフィルを取得 –* [[glossary/aggregators-routers|アグリゲーター/ルーター]]はマーケットメイカーによって取引を部分的に埋めます。
9.  *部分的なフィル –* マーケットメイカーが見積もりを埋めます。
10. *部分的なフィルを取得 (スワップトランザクション) –* [[glossary/aggregators-routers|アグリゲーター/ルーター]]はオンチェーン流動性によって取引を部分的に埋めます。
11. *スワップトランザクションを確認 –* スワップトランザクションが確認されます。
12. *結果を表示 –* フロントエンドはユーザーに取引の結果を表示します。

**注記:**

-   [[glossary/aggregators-routers|アグリゲーター/ルーター]]のフローは、[[glossary/DEX|DEX]]と[[glossary/RFQs|RFQ]]を組み合わせることで、オンチェーンおよびオフチェーンの流動性を使用できます。ここではフロントエンドがはるかに「スマート」であり、ユーザーに代わって可能な限り最高の価格を見つけるためにいくつかの作業を行うことが期待されます。私たちが日常的にやり取りするほとんどの取引アプリ（例: [app.uniswap.com](http://app.uniswap.com)）は、ルーターがユーザーに最適な価格を見つけようとするときに、舞台裏でルーティング/集約を行っており、単独の特定の流動性ソースを使用するよりもはるかに良い価格を提供します。
-   [[glossary/RFQs|RFQ]]と同様に、[[glossary/aggregators-routers|アグリゲーター/ルーター]]は、外部の当事者に取引を埋めることを依存するプラットフォームです。[[glossary/aggregators-routers|アグリゲーター/ルーター]]はエンゲージメントのルールを決定し、各取引所の特異性を抽象化して、[[glossary/UX|UX（ユーザーエクスペリエンス）]]を可能な限りシームレスにする必要があります。

### 4. Solana上の[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]

これらの予備知識を踏まえて、Solana上の[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]をより良く捉えることができます。この取引経路は、これまで見てきたものとは異なります。マーケットメイカーは流動性提供において非常に積極的な役割を果たすことができ、取引の実行ロジックはオンチェーンで発生するため、[[glossary/RFQs|RFQ]]流動性よりもはるかに相互運用性が高いです。Solanaの取引の半分以上は[[glossary/DEX-aggregator|DEXアグリゲーター]]（前のセクションで説明したものと同様）を介して行われますが、通常、集約はオンチェーン流動性で行われます。以下のシーケンス図はこれを示しており、[[glossary/Jupiter|Jupiter]]が[[glossary/DEX-aggregator|DEXアグリゲーター]]の典型的な例です。

![Solana上のPropAMMs](https://ethresear.ch/uploads/default/optimized/3X/e/7/e73a123974b802d6ddc6c1b6d3adfc24103121bc_2_515x500.png)

1.  *スワップ詳細を要求 –* ユーザーはフロントエンド（またはウォレット）を通じてリクエストを開始し、行いたい取引の詳細を指定します。
2.  *DEXデータを取得 –* [[glossary/Jupiter|Jupiter]]は[[https://developers.jup.ag/docs/swap/routing/dex-integration#amm-interface-code-example|AMMインターフェース]]を使用して、ルーターに統合されているすべての[[glossary/DEX|DEX]]から見積もりを読み取ります。
3.  *DEXデータ –* [[glossary/DEX|DEX]]はコントラクトの現在の状態に基づいて価格を見積もります。
4.  *スワップ詳細を表示 –* フロントエンドは、ユーザーが得られる集約された価格を表示します。
5.  *オラクル価格更新トランザクション –* マーケットメイカーは、低コストのオラクル更新を介して定期的に[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]コントラクトを更新します。これらはストリーミングされ、コントラクトが最新の価格で取引されるように機能します。
6.  *トランザクションに署名 –* ユーザーはトランザクションに署名します。
7.  *トランザクションを送信 –* [[glossary/Jupiter|Jupiter]]は署名されたトランザクションを次の[[glossary/proposer|プロポーザー]]に送信します。
8.  *トランザクションのインクルージョンを確認 –* トランザクションはオンチェーンに含まれます。
9.  *結果を表示 –* フロントエンドはユーザーに取引の結果を表示します。

**注記:**

-   このフローは、セクション1の「従来の[[glossary/DEX|DEX]]」フローと**最も類似しています**。特に、フロントエンドはチェーンの状態を読み取り、取引の実際の実行はオンチェーンで発生し、実行はブロックの内容に依存します。
-   このフローに含める主な違いは、マーケットメイカーの存在です。マーケットメイカーは、自身の[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]上のオラクル価格を更新するためにトランザクションを送信します。マーケットメイカーがオラクル更新を頻繁に実行できることが極めて重要です。なぜなら、それが[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]が取引を実行する価格を制御するからです。Solanaでは、オラクル更新トランザクションが使用する[[glossary/compute-units|計算ユニット (CU)]]（イーサリアムの[[glossary/gas|ガス]]に相当）の数は、取引実行に必要な量よりもはるかに少ないです（例えば100倍）。Solanaはデフォルトで、CUあたりの手数料が最も高いトランザクションを優先的に含める貪欲なアルゴリズムを使用します。その結果、PropAMMを運営するマーケットメイカーは、非常に少ないCUしか消費しないがCUあたりの手数料が高いオラクル更新トランザクションを定期的に送信する余裕があります（例: HumidiFiが[[https://app.blockworksresearch.com/unlocked/solana-dex-winners-all-about-order-flow|1日あたり600万件のオラクル更新トランザクション]]を送信）。これにより、彼らのコントラクトが最新の価格で取引されることが保証されます。
-   オラクル更新の純粋な効果は、[[glossary/application-controlled-execution|アプリケーション制御実行 (ACE)]]（略称: ACE）の弱い形式です。ここでは、[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]オペレーターは、各取引の前にトランザクションを実行できます（事実上、古い価格でのフィルを防ぐためのラストルックを持つことになります）。ACEでは、トランザクションの順序付けはプロトコルまたは何らかのコミットメントメカニズムによって*強制*されます。ここでは、オラクル更新は単に、より高いユニットあたりのトランザクション手数料を支払うことができる小さなトランザクションであり、それらのインクルージョンにつながります。これは、ユーザーが見る価格が、マーケットメイカーがその間にオラクル更新を実行する可能性があるため、最終的にトランザクションで受け取る価格と異なる可能性があることを意味します。
-   **決定的に、テイクオーダーに先行するオラクル更新については、プロトコルによって強制されるものはありません。** これが現在の[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]構造の弱点であり、マーケットメイカーが定期的なオラクル更新を成功裏に実行し、[[glossary/proposer|プロポーザー]]の非戦略的行動に依存しています。近視眼的で利益最大化を追求するブロック[[glossary/proposer|プロポーザー]]は、代わりにその権限を利用して、スロットの終わりに[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]コントラクトに対する[[glossary/arbitrage|裁定取引]]の能力をオークションにかけるべきです。特に、合理的な[[glossary/proposer|プロポーザー]]は、おそらく以下の戦略でより多くのお金を稼ぐでしょう。
    -   ブロック[[glossary/proposer|プロポーザー]]である4つのスロット全体（1.6秒）にわたって、すべてのオラクル更新トランザクションを検閲します。
    -   1.6秒の終わりに[\[4\]](https://ethresear.ch#footnote-61539-4)、オープン[[glossary/auction|オークション]]を実行して、[[glossary/Searcher|サーチャー]]がすべてのプールと[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]に対して取引し、価格を[[glossary/CEX|CEX（中央集権型取引所）]]価格にリバランスできるようにします（例えば、CEX-DEX[[glossary/arbitrage|裁定取引]]オークションを実行します）。
    -   この[[glossary/auction|オークション]]の収益は、おそらくオラクル更新トランザクションによって支払われるトランザクション手数料をはるかに超えるでしょう。[\[5\]](https://ethresear.ch#footnote-61539-5)
-   上記の行動は、[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]の価値のほとんどを完全に打ち消すでしょう。なぜなら、[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]コントラクト内の流動性は、[[glossary/arbitrage|裁定取引者]]に対して常に1.6秒古い価格で取引するという、最大限に有害なフローに直面するからです。これは[[glossary/proposer|プロポーザー]]にとって利益最大化戦略ですが、検出可能であり、コミュニティからの大きな反発を招くでしょう（参照: [[glossary/Jito|Jito]]の[[https://ibrl.wtf/|ibrl.wtf]]ダッシュボードと、[[https://x.com/harmonic_gg/article/2009024186451169346|ブロックパッキング]]および[[https://solana.com/podcasts/lightspeed/episodes/solana-s-block-building-battle-jito-bam-vs-harmonic-2026-02-19|トランザクションスケジューリング]]に関する議論）。それでも、Solanaのソーシャルレイヤーがより敵対的な戦略的[[glossary/proposer|プロポーザー]]の行動をどのように処理するかはまだ不明です。
-   また、[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]が比較的タイトなスプレッドを提示しながら、実際にははるかに悪い価格で実行される可能性もあります（実際、これは[[https://0x.org/post/propamm-shenanigans|Base]]で経験的に観測されています）。[\[6\]](https://ethresear.ch#footnote-ref-61539-6) [[glossary/Jupiter|Jupiter]]はこのリスクをルーティング層で処理し、パフォーマンスの悪い[[glossary/AMM|AMM]]にはペナルティを課します。[[https://developers.jup.ag/docs/swap#routing-engines|Jupiterのドキュメント]]からの引用: 「*パフォーマンスの低いソースを自動的に排除する自己学習メカニズム。*」したがって、短期的には不正確な見積もりを出すことは可能ですが、そうすると[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]にルーティングされるフローが減少します。事実上、これは[[glossary/RFQs|RFQ]]の許可制/信頼ベース/評判ベースのセットアップとそれほど変わりません。ルーティングロジックの一部をオンチェーンに引き出すことも可能であり、実行時にスマートコントラクトが正確なチェーンの状態に基づいてどの[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]にルーティングするかを決定することで、スプーフィングのリスクをさらに軽減できます。

### 5. [[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]とイーサリアム

これまでの話は次のとおりです。

1.  イーサリアムでは、従来の[[glossary/DEX|DEX]]が最もトラストレスでオンチェーンネイティブな取引方法ですが、パッシブな流動性供給と資本効率の悪さから、価格設定が悪化するという問題があります。
2.  その結果、歴史的にオンチェーンで行われていた多くのイーサリアム取引が、[[glossary/RFQs|RFQ]]（単独または集約の一部として）を通じてプロのマーケットメイカーによって完全にまたは部分的に処理されるようになりました。これらの取引はより良い実行品質を得られますが、（i）構成可能性がなく、（ii）信頼できるフィルを提供するために[[glossary/aggregators-routers|アグリゲーター/ルーター]]による評判管理を使用し、（iii）従来のスワップよりもオンチェーンロジックの使用が少ないです。
3.  Solanaでは、[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]は、マーケットメイカーが定期的なオラクル更新を通じて、はるかに高い粒度で流動性を管理できるようにすることで、取引活動をオンチェーンに戻します。この流動性のリアルタイム更新は、高速なブロックタイム、非常に低コストなオラクル更新、および[[glossary/proposer|プロポーザー]]が優先手数料順序に従うことの組み合わせによって可能になります。[[glossary/Jupiter|Jupiter]]は、標準化された[[glossary/API|API]]実装を通じて[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]をルーティング層に統合することを可能にします。

イーサリアムに話を戻し、[[glossary/mainnet|メインネット]]が[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]をどのように促進できるかを考えてみましょう。ここでの主な目標は、多くのスワップがオフチェーン/信頼されたチャネルで発生するのではなく、より多くの取引活動をイーサリアム[[glossary/Layer-1|レイヤー1 (L1)]]に戻すことです。[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]の非公式な定義は、パラメータ化された価格曲線を使用して[[glossary/DEX|DEX]]インターフェースを実装するスマートコントラクトであり、その資本はオフチェーンの価格モデルに基づいて頻繁にパラメータを更新するマーケットメイカーによって積極的に管理されます。表面上、これがイーサリアムで構築できない理由はありません。ただし、いくつか具体的なハードルがあり、それらを指摘する価値があります。

1.  **長いスロット:** マーケットメイカーがブロックの先頭に常に新しいパラメータ更新トランザクションを実行できる場合、マーケットメイカーの観点からは長いスロットと短いスロットに違いはありません。彼らは、ブロックが構築されるまさにリアルタイムでパラメータ更新トランザクションが発生することを確認するだけでよいのです。しかし、長いスロットは、特定の[[glossary/slot|スロット]]でコントラクトを更新できない場合にマーケットメイカーが負う*リスク*を増加させます（12秒の古い価格は1.6秒よりもはるかに悪い）。
2.  **[[glossary/PBS|PBS（プロポーザー・ビルダー分離）]]市場構造:** イーサリアムにはすでに成熟したブロック構築パイプラインがあり、ブロックは[[glossary/builder|ビルダー]]にユニットとして販売され、[[glossary/builder|ビルダー]]は[[glossary/auction|オークション]]に勝つために*そのブロックを通じて価値を最大限に抽出する*ことが期待されています。そのため、イーサリアムで[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]コントラクトを素朴に立ち上げると、上記で近視眼的に合理的なSolanaの[[glossary/proposer|プロポーザー]]として説明したような、[[glossary/builder|ビルダー]]レベルでの検閲と[[glossary/arbitrage|裁定取引]]戦略が発生するでしょう。根本的なインセンティブはどちらの場合もまったく同じですが、観測されているように、Solanaの[[glossary/proposer|プロポーザー]]は最大抽出を行っておらず、イーサリアムの[[glossary/PBS|PBS（プロポーザー・ビルダー分離）]][[glossary/auction|オークション]]は、そうする[[glossary/builder|ビルダー]]に明示的に報酬を与えます。

上記の結果として、イーサリアム上の[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]のために現在検討されている設計は、[[glossary/builder|ビルダー]]とマーケットメイカー間の信頼関係を伴います。ブロックの[[https://www.relayscan.io/|50%以上]]を構築する[[glossary/Titan|Titan]]は、マーケットメイカーがブロックに含めるために直接[[glossary/Titan|Titan]]にパラメータ更新トランザクションを送信することで、[[https://docs.titanbuilder.xyz/propamms/makers|PropAMMサービス]]を提供しています。さらに20%のブロックを構築する[[glossary/Quasar-builder|Quasar builder]]も[[https://docs.quasar.win/propamm/makers|同じサービス]]を提供しています。[[https://pamm.wtf/exec|pamm.wtf]]ダッシュボードは、これらの[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]のスプレッドを[[glossary/Binance|Binance]]と比較して表示しています。この構成は合理的な出発点ですが、いくつかの明らかな欠点があります。

1.  **[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]は、信頼された[[glossary/builder|ビルダー]]がブロックを作成する場合にのみ機能します。** 出所不明のブロックでは、マーケットメイカーはオラクル更新トランザクションを実行できるか確信が持てないため、スマートコントラクト自体は取引を許可すべきではない（または、はるかに広いスプレッドで取引すべきである）でしょう。これは、ユーザーとして、実行品質が非常に良い場合と、そうでない場合があるという奇妙な現実につながる可能性があります（これは悪い[[glossary/UX|UX（ユーザーエクスペリエンス）]]のように聞こえます）。
2.  **すでに中央集権化された[[glossary/centralized-builder-market|中央集権型ビルダー市場]]をさらに固定化するリスクがあります。** [[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]が多くの価値を引き付ける場合、それらが支払う手数料とそれぞれのブロックの価値は、[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]オペレーターや他のマーケットメイカーと確立された関係を持つ[[glossary/builder|ビルダー]]の間で集中し続ける可能性があります。

イーサリアム上で[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]を構築するこれらの問題に対処する特効薬はありません。Solanaと同様に、ブロック[[glossary/proposer|プロポーザー]]のインセンティブがマーケットメイカーのインセンティブと一致しないという根本的な問題があります。Solanaは、リアルタイムの[[glossary/Censorship-Resistance|検閲耐性]]に関するプロトコル内保証を提供するために、まさに[[https://constellation.anza.xyz/|複数の同時プロポーザー]]を実装しており、これにより[[glossary/application-controlled-execution|アプリケーション制御実行 (ACE)]]のプロトコル組み込み実装が可能になります（詳細については[[https://constellation.anza.xyz/|こちら]]を参照してください）。**同じ[[glossary/slot|スロット]]内で、ブロックの先頭での[[glossary/Censorship-Resistance|検閲耐性]]があって初めて、マーケットメイカーは、[[glossary/proposer|プロポーザー]]が[[glossary/slot|スロット]]の終わりに[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]に対する取引のオプションを[[glossary/auction|オークション]]にかけるために、自身の入札を検閲するリスクを負うことなく、[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]を運営できます。** イーサリアムの[[glossary/Censorship-Resistance|検閲耐性]][[glossary/EIP|EIP（Ethereum 改善提案）]]である[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]（[[http://eips.ethereum.org/EIPS/eip-7805|EIP-7805]]）は、マーケットメイカーが[[glossary/slot|スロット]]の[[glossary/Inclusion-List|インクルージョンリスト]]期限前にオラクル更新トランザクションをブロードキャストすれば、次のブロックに含まれるという良い保証が得られるため、問題をある程度解決します。しかし、[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]はブロックの先頭でのインクルージョンを強制しません。[[glossary/Inclusion-List|インクルージョンリスト]]がブロードキャストされてからブロックが構築されるまでの間にギャップがあり、その間はオラクル更新トランザクションにそのような保証は適用されず、検閲されるリスクがあります。あるいは、[[glossary/in-protocol-ACE|プロトコル内ACE]]（[[https://ethresear.ch/t/application-controlled-execution-a-case-study-on-cancel-prioritization/23977|こちら]]を参照）は、パラメータ更新トランザクションが常にテイクに先行することを保証するでしょう。

これは、イーサリアムにおける[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]の議論の始まりに過ぎません。イーサリアムコミュニティとして、オンチェーン取引を促進し、より多くの流動性がオフチェーンに移動するのを防ぐために、[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]の改善を継続すべきだと強く信じています。

* * *

1.  もちろん、UniswapV3の集中流動性では、オンチェーン流動性のより積極的な管理が可能ですが、設計の精神は、トランザクション送信の費用を考慮すると、定期的にポジションを更新することではありません。[↩︎](https://ethresear.ch#footnote-ref-61539-1)

2.  引用がユーザーによって「実行可能」である[[glossary/RFQs|RFQ]]システムを持つことも可能であり、その場合、相互運用性は向上しますが、これはマーケットメイカーが価格に織り込む必要があるフリーオプションをユーザーに提供することにもなります。[↩︎](https://ethresear.ch#footnote-ref-61539-2)

3.  [[glossary/UniswapX|UniswapX]]は、[app.uniswap.org](http://app.uniswap.org)で始まる取引からの広範な結果の一部であることに注意してください。人々は実際にUniswapに行って「今日は[[glossary/RFQs|RFQ]]パスを使いたい」とは言わず、代わりにルーターがユーザーに最適な価格を見つけようとするときに行われる集約の一部として利用されます。ここでも、[[glossary/RFQs|RFQ]]、[[glossary/aggregators-routers|ルーター]]、[[glossary/aggregators-routers|アグリゲーター]]の間の境界線が曖昧になり始めます。[↩︎](https://ethresear.ch#footnote-ref-61539-3)

4.  Solanaの[[glossary/slot|スロット]]時間を1.6秒と考えるのは合理的だと考えます。なぜなら、それが単一の[[glossary/proposer|プロポーザー]]がトランザクションを順序付ける権限を持つ期間だからです。彼らがその期間に4つのブロックを公開することになっており、さらに400ミリ秒未満の粒度でシュレッドとして処理しているトランザクションを継続的にストリーミングすることになっているという事実は、プロトコルが強制するものではなく、したがってブロック生成の実際のメカニズムを誤解させるものです。[↩︎](https://ethresear.ch#footnote-ref-61539-4)

5.  さらに、ブロックの先頭をCEX-DEX[[glossary/arbitrage|裁定取引]]のために[[glossary/auction|オークション]]にかけ、その後、プールが取引された後もオラクル更新トランザクションを含めて、それらのトランザクション手数料も徴収することが可能かもしれません。今日これが不可能である技術的な理由があるかもしれませんが、本当の価値はCEX-DEX[[glossary/arbitrage|裁定取引]][[glossary/auction|オークション]]から来るでしょう。[↩︎](https://ethresear.ch#footnote-ref-61539-5)

6.  悪意のある行動の正確なメカニズムは、特定の実行環境のマイクロストラクチャに依存します。例えば、Baseでは、悪意のある[[glossary/PropAMMs|プロプライエタリAMM (PropAMM)]]オペレーターは、見積もりがフラッシュブロックの*終わり*から読み取られ、次のブロックで実行されるという事実を悪用しました。これにより、彼らはブロックの終わりにタイトな見積もりを提示し、次のブロックの初めにスプレッドを広げ、トランザクションのスリッページによって吸収されるはるかに悪い価格で注文を埋めることができました。[↩︎](https://ethresear.ch#footnote-ref-61539-6)

*1件の投稿 - 1人の参加者*

[トピック全文を読む](https://ethresear.ch/t/proprietary-amms-and-ethereum/25543)
