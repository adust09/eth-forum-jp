---
title: >-
  イーサリアムメインネットにおけるPropAMMのフィルとTEMBRI (ツールボックス) のPropAMMサポート:
  同一ブロックのクォート、小さなスプレッド、遅延AMMからのフロー
original_title: >-
  PropAMM fills on Ethereum mainnet and PropAMM support for TEMBRI (toolbox):
  same-block quotes, a small spread, and flow taken from lagging AMMs
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/propamm-fills-on-ethereum-mainnet-and-propamm-support-for-tembri-toolbox-same-block-quotes-a-small-spread-and-flow-taken-from-lagging-amms/26201
author: DanGuo
date: '2026-10-31'
category: Execution Layer Research
tags:
  - execution-layer
  - proprietary-amm
  - defi
  - mev
  - economics
  - smart-contracts
  - research
  - market-microstructure-with-on-chain-data
topic_id: '26201'
translated_at: '2026-11-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [PropAMM fills on Ethereum mainnet and PropAMM support for TEMBRI (toolbox): same-block quotes, a small spread, and flow taken from lagging AMMs](https://ethresear.ch/t/propamm-fills-on-ethereum-mainnet-and-propamm-support-for-tembri-toolbox-same-block-quotes-a-small-spread-and-flow-taken-from-lagging-amms/26201) — DanGuo (2026-10-31)

## 要旨

[[glossary/Proprietary-AMM|プロプライエタリAMM (PropAMM)]]は、単一のメイカーによって価格が設定されるオンチェーン会場です。メイカーはクォート状態をオンチェーンにプッシュし、フィルはその状態を読み取ります。私たちは、2026年9月10日から10月9日までの30日間、9つのイーサリアム[[glossary/Proprietary-AMM|PropAMM]]における92,627件のフィルを実行データからデコードしました。そのうち69,827件のWETH/ステーブルコインのフィルを、Binanceの1秒ごとの取引と比較して価格設定しました。

-   レジストリ会場のうち3つは、現在のブロックのタイムスタンプが押された場合にのみメイカーの状態を受け入れます。これらのフィルは常に同じブロック内の更新に対して実行されます。
-   テイカーは、30日間毎日、フィル時に約0.45[[glossary/bp|ベーシスポイント (bp)]]を支払います。その後の5分間、平均してテイカーのどのクラスにおいても価格が有利に動くことはありません。[[glossary/adverse-selection|逆選択]]の兆候は見られません。
-   直前の12秒間に[[glossary/CEX|中央集権型取引所 (CEX)]]で0.5[[glossary/bp|ベーシスポイント (bp)]]を超える動きがあった後のフィルでは、78.5%がその動きに逆らって取引されます。[[glossary/Proprietary-AMM|PropAMM]]のクォートは同じブロック内で[[glossary/CEX|CEX]]に追従しますが、Uniswapは遅延します。
    [[glossary/arbitrage-contracts|裁定取引コントラクト]]と[[glossary/routers|ルーター]]は、[[glossary/Proprietary-AMM|PropAMM]]を[[glossary/Chen-Fu-Hua-AMM|陳腐化したAMM]]に対する取引の新しい側として使用します。

フィルはブロックのシーリング時までに価格設定され、測定された2日間では[[glossary/slot-start|スロット開始]]から0.1〜3.1秒後に受信されたリレーが中継されます。その範囲全体でマークアウトは0.1[[glossary/bp|ベーシスポイント (bp)]]未満で変化します。

## [[glossary/Proprietary-AMM|PropAMM]]と測定された会場

[1段落: メイカー制御の価格設定; クォート状態の更新は、ブロック内のフィルより前に配置されるトランザクション（または内部呼び出し）です; ビルダーと[[glossary/BuilderNet|BuilderNet]]の役割。RN-40と以前の公開記述を参照。]

9つの会場すべてが同じ `Swapped(sender, tokenIn, tokenOut, amountIn, amountOut, recipient)` イベントを発行します。それぞれのイベントの金額は、約16,000件のサンプルのフィルにおけるトークン転送と一致します。

| 会場 | WETH/ステーブルフィル数 | ID | 更新元 |
| --- | --- | --- | --- |
| FermiSwap | 43,170 | Etherscan検証済みABI; リスティング | 価格エンジンイベント |
| El Zorro | 9,316 | Sourcify完全一致 | PrioUpdateRegistry |
| Tempest | 7,626 | リスティング; 実装未検証 | PrioUpdateRegistry |
| Metric | 2,811 | Sourcify MetricRouterAdapter | オラクル（未デコード） |
| bopAMM (Bebop) | 1,772 | Sourcify完全一致 | PrioUpdateRegistry |
| Park | 1,537 | Sourcifyプロキシ名のみ | 未デコード |
| Goliath | 1,426 | Sourcify完全一致 | 未デコード |
| Kipseli | 1,326 | Sourcify完全一致 | PrioUpdateRegistry |
| bopAMM, 以前のデプロイ | 843 | Sourcify完全一致 | 未デコード |

この9つの会場は、期間中の`Swapped`ログの約96%を占めています。残りは特定できなかったコントラクトからのものです。

## データと手法

-   実行データはXatu (ethPandaOps) から取得しました: 必要に応じてブロック、トランザクション、ログ、トレース。
-   コントラクトIDはSourcifyから取得しました。
-   価格はBinanceスポット1秒Kラインです: ETH/USDT。USDCフィルはUSDC/USDTを介して変換され、確認した日には0.9999から1.0004 USDTの範囲でした。Binanceはスポットクォートをアーカイブしないため、価格は最終取引です。ETH/USDTのティックが0.01の場合、ミッドからの差は約0.04[[glossary/bp|ベーシスポイント (bp)]]です。
-   すべてのデコードルールは、検証済みソースまたはトークン転送に対してレビューされた正確なアドレスとイベントまたはセレクターのペアです。ヒューリスティクスは使用していません。
-   パイプラインは[[glossary/tembri|tembri]] ( [GitHub - TLM-Research/tembri: Rust toolbox for reproducible Ethereum execution intelligence — mempool, builder, and reviewed PropAMM update-to-fill measurements. · GitHub](https://github.com/TLM-Research/tembri) ) です。各ステップには、その証拠を記載した[[glossary/ADR|アーキテクチャ決定記録 (ADR)]]があります。
    `tembri propamm-fetch`と`tembri propamm-report`は、公開データから任意の日付のテーブルを再現します。BinanceファイルはBinanceのSHA-256に対してチェックされ、すべての入力ファイルはハッシュによって固定されています。

マークアウトはテイカー側から[[glossary/bp|ベーシスポイント (bp)]]で符号化されます:
`s * (P(t) - p_fill) / p_fill`、WETH買いの場合は`s = +1`。正の値はテイカーが利益を得たことを意味します。ホライズン0はブロックタイムスタンプです。私たちはその12秒前、および12、60、300秒後を報告します。標準誤差は30日間の日次平均のものです。

## 鮮度はコントラクトによって強制される

PrioUpdateRegistryは、各メイカーの状態をメイカー提供のタイムスタンプとともに保存します。リーダーは`getState(lane, minTimestamp, maxTimestamp)`を呼び出し、リーダーが提供するウィンドウ外ではリバートします。

**トレースは、El Zorro、bopAMM、Kipseliが`minTimestamp = maxTimestamp = block.timestamp`で読み取っていることを示しています。** Tempestは`[block.timestamp - 3, block.timestamp + 12]`で読み取ります。2026年10月5日のすべてのレジストリ書き込み（1,148件）は、自身のブロックのタイムスタンプを保持しています。

これらの会場では、フィルは同じブロック内の更新に対してのみ実行できます。したがって、同一ブロックペアリングはコントラクトルールであり、メイカーが高速であることの証拠ではありません。FermiSwapのエンジンは未検証です。2026年10月5日の1,934件のフィルすべてにおいて、同じブロック内に以前の更新がありましたが、これが強制されていることを示すことはできません。

すべてのクォートは最大で1ブロック前のものなので、メイカー時間でのクォート年齢は設計上ゼロです。重要な陳腐度は、外部価格に対して測定する必要があります。

## テイカーは約0.45[[glossary/bp|ベーシスポイント (bp)]]を支払い、価格は彼らに追従しない

| ホライズン | −12秒 | 0秒 | +12秒 | +60秒 | +300秒 |
| --- | --- | --- | --- | --- | --- |
| 平均マークアウト (SE) | +1.40 (0.16) | −0.45 (0.05) | −0.65 (0.05) | −0.57 (0.08) | −0.74 (0.23) |

**テイカーは毎日フィル時に支払い、マークアウトはその後上昇しません。** ホライズン0の日次平均は−0.99から−0.08[[glossary/bp|ベーシスポイント (bp)]]の範囲です。WETH買いの場合は−0.37[[glossary/bp|ベーシスポイント (bp)]]、売りの場合は−0.53[[glossary/bp|ベーシスポイント (bp)]]です。

会場別では、20日以上フィルがあった会場（FermiSwap −0.51、El Zorro −0.79、Tempest −0.49、bopAMM −0.80、Kipseli −0.72）では、ホライズン0平均は−0.49から−0.80[[glossary/bp|ベーシスポイント (bp)]]の間です。データが少ない2つの会場は異なります。MetricのWETH/USDCフィルは9月の10日間に発生し、テイカーはフィル時に何も支払わず（0.00[[glossary/bp|ベーシスポイント (bp)]]、SE 0.03）、その後12秒までに0.19[[glossary/bp|ベーシスポイント (bp)]]を失いました。過去4日間稼働しているGoliathは、唯一ホライズン0平均が正（+0.40[[glossary/bp|ベーシスポイント (bp)]]）で、12秒までに負になる会場です。

ホライズン0は[[glossary/slot-start|スロット開始]]ですが、フィルはそのブロックが構築されたときに価格設定されます。2026年10月5日と2026年10月9日に、5つのリレーのデータAPIに、フィルを含む各勝利ブロックを最初に受信した日時を尋ねました。両日とも、これらのブロックの98%を、[[glossary/slot-start|スロット開始]]から中央値1.0秒後に受信していました（10パーセンタイルから90パーセンタイルまで0.9〜2.6秒; 範囲0.1〜3.1秒）。時間は2つのグループに分かれます。70%のブロックは1.5秒以内に到着し、22〜23%は2秒後に到着します。代わりに最初の受領時に価格設定された場合、2026年10月5日では[[glossary/slot-start|スロット開始]]時の−0.64[[glossary/bp|ベーシスポイント (bp)]]に対し平均マークアウトは−0.68[[glossary/bp|ベーシスポイント (bp)]]、2026年10月9日では−0.56[[glossary/bp|ベーシスポイント (bp)]]に対し−0.63[[glossary/bp|ベーシスポイント (bp)]]でした。ETH/USDTのリターン標準偏差は1秒あたり0.58[[glossary/bp|ベーシスポイント (bp)]]だったので、数秒のオフセットはフィルあたり約1[[glossary/bp|ベーシスポイント (bp)]]のノイズを追加し、平均を偏らせることなく分布を広げます。

コストはサイズやボラティリティとともに増加しません。1,000ドル未満では0.50[[glossary/bp|ベーシスポイント (bp)]]、1,000ドルから10,000ドルでは0.38[[glossary/bp|ベーシスポイント (bp)]]、10,000ドルから100,000ドルでは0.48[[glossary/bp|ベーシスポイント (bp)]]です。ボラティリティの3分位全体では0.50、0.44、0.40[[glossary/bp|ベーシスポイント (bp)]]です。同じペアのUniswap V3の0.05%プールでは、Binanceに対するコスト（手数料込み）は1,000ドル未満で5.3[[glossary/bp|ベーシスポイント (bp)]]、1,000ドルから10,000ドルで1.6[[glossary/bp|ベーシスポイント (bp)]]です。

FermiSwapはブロック内で頻繁に再クォートします。更新があるブロックの21%では、Titan、BuilderNet、Quasarと同様に、シーケンスは更新、フィル、更新、フィルとなっています。

## オンチェーン参照は誤った符号を与える

フィル前のUniswap V3 USDC/WETH 0.05%プールの最終価格に対して、平均ホライズン0マークアウトは+2.28[[glossary/bp|ベーシスポイント (bp)]]であり、買い手と売り手の両方が利益を得ているように見えます。真のミッドはその結果を与えられません。

プールの価格は、その±5[[glossary/bp|ベーシスポイント (bp)]]の手数料バンド内のどこにでも位置します。Binanceに対する2026年10月5日の10パーセンタイルから90パーセンタイルは−5.5から+4.8[[glossary/bp|ベーシスポイント (bp)]]です。さらに、[[glossary/routers|ルーター]]は、プールを上回る場合にのみ[[glossary/Proprietary-AMM|PropAMM]]に取引を送信します。同じフローを競合するプールに対するマークアウトは、テイカーに有利に偏ります。

## テイカーはAMMがまだ追従していない動きに対して取引する

ブロック前の12秒間において、テイカー署名[[glossary/CEX|CEX]]移動は平均−1.84[[glossary/bp|ベーシスポイント (bp)]]（SE 0.14）でした。0.5[[glossary/bp|ベーシスポイント (bp)]]を超える動きに続いたフィルでは、78.5%がそれに逆らって取引されました。すなわち、下落後に買い、上昇後に売りました。68%を下回る日はありませんでした。

その動きでグループ化すると、フィル時のUniswap価格とBinanceのギャップはそれに伴って拡大しますが、[[glossary/Proprietary-AMM|PropAMM]]のマークアウトは変化しません。

| 12秒の動き | < −4 bp | −4〜−1 | −1〜+1 | > +1 |
| --- | --- | --- | --- | --- |
| フィル数 | 13,243 | 21,577 | 26,882 | 8,125 |
| UniswapはテイカーにとってBinanceより不利 | 4.42 | 3.60 | 2.12 | 0.09 |
| Binanceに対するPropAMMマークアウト | −0.41 | −0.41 | −0.48 | −0.51 |

ETHが[[glossary/CEX|CEX]]で動くとき、[[glossary/Proprietary-AMM|PropAMM]]のクォートは同じブロック内で動き、[[glossary/AMM|自動マーケットメイカー (AMM)]]は動きません。その結果、[[glossary/Proprietary-AMM|PropAMM]]はその動きと逆方向でより良い価格となります。

## テイカーは誰か

クラスは、トランザクション構造とレビュー済みアドレステーブル（Sourcifyで命名されたコントラクトのみ）から来ています。未検証コントラクトは構造によって分類され、推測によって分類されることはありません。

| クラス | フィル数 | 前の12秒間の動き | 動きに逆らって | 0秒 | 60秒 | 300秒 |
| --- | --- | --- | --- | --- | --- | --- |
| 直接呼び出された未検証コントラクト | 37,098 | −2.67 | 86% | −0.33 | −0.45 | −0.59 |
| アグリゲーター（Tycho、KyberSwap、Relay、PropAMMルーターなど） | 17,241 | −1.02 | 69% | −0.43 | −0.51 | −0.66 |
| CoW決済 | 5,301 | −0.18 | 52% | −0.78 | −0.83 | −0.86 |
| 別の方法で到達した未検証コントラクト | 4,914 | −1.51 | 72% | −0.59 | −0.55 | −1.13 |
| ERC-4337エントリーポイント | 2,891 | −0.37 | 77% | −0.95 | −1.25 | −0.37 |
| EIP-7702委任アカウント | 2,242 | −1.96 | 89% | −0.44 | −0.64 | −0.78 |

**どのクラスもどのホライズンでも正の平均マークアウトを持っていません。** 100フィル以上を持つ50の送信者のうち、1つだけが60秒平均でゼロより2標準誤差以上高い（+1.45[[glossary/bp|ベーシスポイント (bp)]]）ですが、その29日間のうち13日間のみ正でした。50の送信者では、偶然にそのような結果が1つ程度期待されます。

[[glossary/CEX|CEX]]の動きに最も反応する2つのクラスは、直接呼び出された未検証コントラクトと委任アカウントです。10月3日から9日の週では、彼らのトランザクションは[[glossary/atomic-arbitrage-transaction|アトミック裁定取引]]のように見えます。

-   直接コントラクトトランザクションの99%は、コントラクト自身のインベントリを取引します（署名者はトークンを移動しません）。
-   74%はトークンを失わず利益を得て終了します（委任アカウントでは87%）。
-   89%（97%）はUniswap、Curve、またはBalancerプールでもスワップします。

彼らの利益は[[glossary/Chen-Fu-Hua-AMM|陳腐化したAMM]]から来ています。[[glossary/Proprietary-AMM|PropAMM]]は取引の新しい側であり、そのスプレッドで利益を得ています。

## フィルはプライベートに到着し、PropAMMレッグはサンドイッチされない

すべての[[glossary/Proprietary-AMM|PropAMM]]トランザクションをFlashbots Mempool Dumpsterアーカイブに結合しました。このアーカイブは、2026年10月5日に含まれた全トランザクションの47%を観測しました。**[[glossary/Proprietary-AMM|PropAMM]]フィル取引の2.9%を観測しました。** そのほとんどすべてが[[glossary/aggregator-flow|アグリゲーターフロー]]です。アグリゲーターフィルの10%はブロック前に公開されていましたが、裁定取引コントラクト、委任アカウント、CoW、ERC-4337では0.1%未満でした。

30日間で、[[glossary/Proprietary-AMM|PropAMM]]プールでサンドイッチされたフィルはありませんでした。公開ルーティングされたトランザクションの[[glossary/AMM|自動マーケットメイカー (AMM)]]レッグは別の問題です。2,195件の公開フィル取引のうち、95件（4.3%）は、取引されたUniswap V2またはV3プールで括られており、ほとんどは直接隣接するトランザクションによるものでした。未観測の76,349件のうち、2件がサンドイッチされました。

10月3日から9日の週のすべてのUniswap V2およびV3スワップにおいて、公開スワップはサイズが大きくなるほどサンドイッチされる頻度が高くなりました。100ドル未満で2.5%、1,000ドルから10,000ドルで8%、10,000ドルから100,000ドルで27%でした。一方、[[glossary/private-swaps|プライベートスワップ]]では最大0.14%でした。スワップの公開シェアはサイズとともに減少し、300ドル未満で12%から15%だったのが、3,000ドルから30,000ドルの間では約2%になりました。中規模取引のテイカーはほとんど[[glossary/public-mempool|パブリックメムプール]]から離れており、そうでないものはしばしばサンドイッチされます。

## 限界

-   価格設定時間はシーリングによって制限され、2日間で5つのリレーで測定されました。他の4つのリレーは応答しませんでした。メイカーの署名時間は観測できません。更新は[[glossary/slot-start|スロット開始]]タイムスタンプのみを保持します。
-   Binance価格は最終取引であり、Binanceは1つの会場です。
-   最大の会場であるFermiSwapは、[[glossary/BuilderNet|BuilderNet]]のエンジン記述からデコードされており、検証済みソースからではありません。TempestとParkの実装も未検証です。
-   `Swapped`ログの約4%は、特定できなかったコントラクトからのものです。
-   [[glossary/atomic-arbitrage-transaction|アトミック裁定取引]]テストは1週間をカバーし、ネイティブETHとビルダーへの支払いを無視しており、まだパイプラインの一部ではありません。
-   ビルダー名はブロックの追加データから来ており、検証済みリレージョインではありません。
-   30日間で、日次ETH最大変動は6.7%でした。より鋭い市場は異なる挙動をする可能性があります。
-   「未観測」とは、1つの公開アーカイブで観測されなかったことを意味します。[[glossary/AMM|自動マーケットメイカー (AMM)]]レッグのサンドイッチテストはUniswap V2とV3のみをカバーしており、まだパイプラインの一部ではありません。

## 次のステップ

-   Metricのフィルは、中央値132秒前の[[glossary/oracle-state|オラクル状態]]に対して実行され、[[glossary/adverse-selection|逆選択]]は確認できません。そのプールは未検証なので、その理由は不明です。
-   [[glossary/Chen-Fu-Hua-AMM|陳腐化したAMM]]の[[glossary/arbitrage|裁定取引]]による損失のうち、現在どれだけが[[glossary/Proprietary-AMM|PropAMM]]のスプレッドを通過しているか。

## 謝辞とデータ

-   実行データ: ethPandaOpsによるXatu、
    [Xatu Data | ethPandaOps](https://ethpandaops.io/data/xatu/) ( [GitHub - ethpandaops/xatu: Ethereum network monitoring with collection clients and a centralized server for data pipelining. · GitHub](https://github.com/ethpandaops/xatu) )。
-   コントラクトID: Sourcify、[https://sourcify.dev](https://sourcify.dev)。
-   [[glossary/CEX|CEX]]価格: Binance公開データ、[https://data.binance.vision](https://data.binance.vision)
    ( [GitHub - binance/binance-public-data: Details on how to get Binance public data · GitHub](https://github.com/binance/binance-public-data) )。
-   [[glossary/public-mempool|パブリックメムプール]]観測: Flashbots Mempool Dumpster、
    [https://mempool-dumpster.flashbots.net](https://mempool-dumpster.flashbots.net)
    ( [GitHub - flashbots/mempool-dumpster: Dump all the mempool transactions 🗑️ ♻️ (in Parquet + CSV) · GitHub](https://github.com/flashbots/mempool-dumpster) )。
-   シーリング時間: Ultrasound、Titan、Aestus、Flashbots、bloXroute（規制対象）リレーのデータAPI、
    [GitHub - flashbots/relay-specs: MEV-Boost Relay API Specs · GitHub](https://github.com/flashbots/relay-specs) 。
-   [[glossary/Proprietary-AMM|PropAMM]]レジストリおよびオラクルアドレス: BuilderNet APIリファレンス、
    [API Reference | BuilderNet](https://buildernet.org/docs/api) 。
-   会場エントリーポイント: Lambda Class [[glossary/Proprietary-AMM|PropAMM]]ルーターデプロイメントテーブル、
    [GitHub - lambdaclass/propamm-router-contracts: Single-hop router that quotes and executes swaps against a proprietary AMM (FermiSwap, Kipseli, or Bebop) or directly against Uniswap V3, and falls back to Uniswap V3 when the chosen proprietary venue cannot fill the swap. · GitHub](https://github.com/lambdaclass/propamm-router-contracts) 。
-   Titan Builderの[[glossary/Proprietary-AMM|PropAMM]]ドキュメント、
    [PropAMMs | Titan Builder Docs](https://docs.titanbuilder.xyz/propamms)。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/propamm-fills-on-ethereum-mainnet-and-propamm-support-for-tembri-toolbox-same-block-quotes-a-small-spread-and-flow-taken-from-lagging-amms/26201)
