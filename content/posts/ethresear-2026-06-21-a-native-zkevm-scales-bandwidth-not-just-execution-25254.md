---
title: ネイティブzkEVMは実行だけでなく帯域幅もスケールする
original_title: 'A native zkEVM scales bandwidth, not just execution'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/a-native-zkevm-scales-bandwidth-not-just-execution/25254
author: mikeneuder
date: '2026-06-21'
category: Miscellaneous
tags:
  - miscellaneous
  - zkevm
  - scaling
  - consensus
  - data-availability
  - validators
  - eip
  - protocol-design
  - research
topic_id: '25254'
translated_at: '2026-06-22'
translator: gemini-2.5-flash
---

> [!note] 原文
> [A native zkEVM scales bandwidth, not just execution](https://ethresear.ch/t/a-native-zkevm-scales-bandwidth-not-just-execution/25254) — mikeneuder (2026-06-21)

## ネイティブzkEVMは実行だけでなく帯域幅もスケールする

[![zkEVMが実行だけでなく帯域幅もスケールすることを示す図](https://ethresear.ch/uploads/default/optimized/3X/9/1/918001f342d8c25c28c99debe3b49d40c1a0e39e_2_373x375.jpeg)](https://ethresear.ch/uploads/default/original/3X/9/1/918001f342d8c25c28c99debe3b49d40c1a0e39e.jpeg "upload_91fe0710d37380f860a6d81837e01df5")

by mike neuder – *sunday, june 21, 2026.*  
\\cdot  
*実りある議論とコメントをくれた[Ignacio](https://x.com/ignaciohagopian)と[Ladislaus](https://x.com/ladislaus0x)に感謝します。*  
\\cdot

**tl;dr;** ネイティブな[[glossary/zkEVM|zkEVM (ゼロ知識イーサリアム仮想マシン)]]をプロトコルに組み込むことは、イーサリアムのスケーリングロードマップの一部です。このアップグレードは主に実行のスケーリングという観点から語られます。つまり、[[glossary/Ethereum-validator|イーサリアムバリデータ]]はブロック内のトランザクションを完全に実行する代わりに、ブロック全体の正しさを示す暗号学的証明をダウンロードして検証するだけになります。理論的には、これによりイーサリアムのガスリミットが大幅に増加する可能性があります。しかし、これを素朴に行うと、ブロックサイズが線形に増加してしまいます。巨大なブロックをダウンロードする際に発生するレイテンシ (latency) は、ZK証明の検証による計算スケーリングの恩恵を打ち消してしまうでしょう。幸いなことに、ブロックの内容は[[glossary/blob|ブロブ]]内に配置できます。[[glossary/blob|ブロブ]]は、[[glossary/Ethereum-validator|イーサリアムバリデータ]]の全セットが内容全体をダウンロードすることなく、大量のデータに対するコンセンサスを可能にします。このようにして、ネイティブ[[glossary/zkEVM|zkEVM]]は実行のスケーリングと連携して、チェーンの**帯域幅 (bandwidth) をスケール**させます。Toniの最近の記事「[Blocks Are Dead. Long Live Blobs](https://ethresear.ch/t/blocks-are-dead-long-live-blobs/24611)」はまさにこの点を指摘しており、[[glossary/EIP|EIP（Ethereum 改善提案）]]-[[EIP-8142|8142]]はこの機能を可能にするための明示的な提案です。この記事では、ネイティブ[[glossary/zkEVM|zkEVM]]のこの重要な利点を強調するために、実装の詳細を避けながらこの点を力説します。

* * *

### 0\. 背景

プロトコルが[[glossary/Ethereum-validator|イーサリアムバリデータ]]にブロックの再実行ではなくZK証明の検証を義務付ける「ネイティブ」[[glossary/zkEVM|zkEVM]]は、イーサリアム[[glossary/Layer-1|レイヤー1]]のスケーリングロードマップの一部です。通常、[[glossary/zkEVM|zkEVM]]は主にネットワーク内の[[glossary/Ethereum-validator|イーサリアムバリデータ]]に必要な**実行時間 (execution time)** を削減するものとして提示されます。ブロック内のすべてのトランザクションを再実行する代わりに、[[glossary/Ethereum-validator|イーサリアムバリデータ]]は単に正しさの暗号学的証明（以下、「証明」）を検証できます。証明の検証時間はブロック内のガス量に対して準線形（O(\\log^2 n)）であるため、実行時間がそれに比例して長くなることなく、ガスリミットの大幅な増加が可能になります。PandaOpsチームが収集した[実行タイミングデータ](https://lab.ethpandaops.io/ethereum/execution/timings)を見ると、平均してブロックの実行には100ms未満（全12秒スロットの1%未満）しかかからないことがわかります。ブロック自体を構成するトランザクションのリストである実行ペイロード（以下、「ブロック」）のダウンロードも、考慮すべきクリティカルパスの一部です。現在のイーサリアムのブロックは約150〜200KBで、[ノード要件](https://ethereum.org/developers/docs/nodes-and-clients/run-a-node/#requirements)に記載されている最低10Mbits/sの接続ではダウンロードに約100msかかります。では、10倍大きいブロックを想像してみてください。現状では、実行とブロックダウンロードのレイテンシ (latency) の両方が線形にスケールし、それぞれ約1秒かかります。ネイティブ[[glossary/zkEVM|zkEVM]]を使用すると、証明検証によるブロック検証ははるかに高速になります（現在の[証明検証](https://eth-act.github.io/zkevm-benchmark-runs/verification/)は50〜200msの範囲で実行され、ポリログスケールにより、大きなガスリミット下でも非常にゆっくりと増加します）。しかし、*完全なブロックのダウンロードは依然としてガスリミットに対して線形に増加します。* これにより、次の結論が導き出されます。**ガスリミットの増加を分析する際には、ブロック検証とダウンロードのレイテンシ (latency) を一緒に考慮する必要があります。**

これは根本的な疑問を提起します。*[[glossary/zkEVM|zkEVM]]をプロトコルに組み込むことの意義は何でしょうか？もし実行のスケーリングの恩恵が、より大きなブロックをダウンロードする際のレイテンシ (latency) の増加によって打ち消されてしまうのであれば？* この記事は、**ネイティブ[[glossary/zkEVM|zkEVM]]の2番目の重要な利点は、ブロックダウンロードのレイテンシ (latency) を増加させることなくガスリミットをスケールできることである**と主張します。つまり、[[glossary/zkEVM|zkEVM]]後の世界では、[[glossary/Ethereum-validator|イーサリアムバリデータ]]はブロックデータのごく一部を*サンプリング*するだけで、トランザクションの内容全体をダウンロードする必要がなくなります。したがって、[[glossary/zkEVM|zkEVM]]は2つのスケーリングの利点を提供します。(1) トランザクションを実行する代わりに証明を検証することによるレイテンシ (latency) の削減、*および* (2) ブロック全体をダウンロードする代わりにブロックをサンプリングすることによる帯域幅 (bandwidth) の削減です。(1) は多くの注目を集めますが、ネイティブ[[glossary/zkEVM|zkEVM]]の真のスケーリングの恩恵を実現するためには (2) も不可欠です。[\[1\]](https://ethresear.ch#footnote-60837-1) [\[2\]](https://ethresear.ch#footnote-60837-2)

Toniの最近の記事「[Blocks Are Dead. Long Live Blobs](https://ethresear.ch/t/blocks-are-dead-long-live-blobs/24611)」はまさにこの点を指摘し、[[glossary/blob|ブロブ]]内にブロックを含めるための技術的要件を詳しく掘り下げています。さらに、[[glossary/EIP|EIP（Ethereum 改善提案）]]-[[EIP-8142|8142]]はこの機能を可能にするための明示的な提案です。

この記事は、[[glossary/zkEVM|zkEVM]]のプロトコル組み込みを正当化し、イーサリアムのスケーリングロードマップの一般的な理解を深める上で不可欠であるため、実装の細部に*意図的に触れず*にこの点を力説します。[セクション1](https://ethresear.ch#p-60837-h-1-current-block-validation-3)では、現在のブロック検証フローについて説明します。[セクション2](https://ethresear.ch#p-60837-h-2-basic-zkevm-block-validation-4)では、完全なブロックのダウンロードを依然として必要とする素朴な[[glossary/zkEVM|zkEVM]]実装でそのプロセスがどのように変化するかを示します。[セクション3](https://ethresear.ch#p-60837-h-3-smarter-zkevm-block-validation-5)では、[[glossary/Ethereum-validator|イーサリアムバリデータ]]にブロック内容のサンプリングのみを要求する「よりスマートな」[[glossary/zkEVM|zkEVM]]実装（つまり、[[EIP-8142|EIP-8142]]を通じて）でのタイムラインを示します。[セクション4](https://ethresear.ch#p-60837-h-4-zkevm-compared-to-other-scaling-technologies-6)では、ネイティブ[[glossary/zkEVM|zkEVM]]が他のスケーリング提案とどのように相互作用するかを議論して締めくくります。

### 1\. 現在のブロック検証

今日のイーサリアムでは、ブロック検証フローはシンプルです。単一スロットのプロポーザー、[[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]][\[3\]](https://ethresear.ch#footnote-60837-3)、およびアグリゲーター[\[4\]](https://ethresear.ch#footnote-60837-4)のみを考慮します。以下の図は、これをシンプルなタイムラインとして示しています。

[![現在のブロック検証フローのタイムライン](https://ethresear.ch/uploads/default/optimized/3X/a/4/a4b4a12fa19a1efe77b2841b0071f9f2606a32ca_2_690x234.png)](https://ethresear.ch/uploads/default/original/3X/a/4/a4b4a12fa19a1efe77b2841b0071f9f2606a32ca.png "upload_c2beb855c74179a44af561fb5500d1ce")

1.  プロポーザーがブロックを公開します。
2.  [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]がブロックをダウンロードします。[\[5\]](https://ethresear.ch#footnote-60837-5)
3.  [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]がブロックを実行します。
4.  [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]が現在のカノニカルヘッドに投票します。
5.  アグリゲーターが[[glossary/Attestation|アテステーション（証明）]]をアグリゲートにマージします。

このタイムラインからいくつかの重要な点を強調します。

-   プロポーザーは、正直な[[glossary/Ethereum-validator|バリデータ]]の仕様に従い、`t=0`でブロックを公開すべきです。しかし、[タイミングゲーム](https://arxiv.org/abs/2305.09032)のため、通常はスロットの後半にプッシュします。
-   [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]の義務を3つの異なる部分に分けました。これらはすべて`t=4`の[[glossary/Attestation|アテステーション（証明）]]期限前に発生します。[\[6\]](https://ethresear.ch#footnote-60837-6)

このプロセスは、ビーコンチェーンのローンチ以来、ブロックが検証されてきた方法です（[[glossary/Data-Availability|データアベイラビリティ]]をブロックの有効性の前提条件として無視した場合）。イーサリアムのスケーリングロードマップの重要な部分である[[glossary/zkEVM|zkEVM]]をプロトコルに組み込むことは、このフローに大きな変化をもたらします。

### 2\. 基本的なzkEVMブロック検証

ネイティブ[[glossary/zkEVM|zkEVM]]では、各ブロックには、トランザクションが有効であることを示す対応するZK証明が必要です。これにより、特定の[[glossary/Consensus-Layer|コンセンサス層]]スロットの証明を生成する*プルーフ生成者 (prover)* と呼ばれる新しい[[glossary/Consensus-Layer|コンセンサス層]]参加者が導入されます。[\[7\]](https://ethresear.ch#footnote-60837-7) 以下の図は、この新しいブロック検証フローをシンプルなタイムラインとして示しています。赤い丸は元のものから変更された部分、黄色い丸は全く同じ部分です（ただし番号は振り直されています）。

[![基本的なzkEVMブロック検証フローのタイムライン](https://ethresear.ch/uploads/default/optimized/3X/b/b/bb9815da587a53b1df057f64995fbd534e07411f_2_690x251.png)](https://ethresear.ch/uploads/default/original/3X/b/b/bb9815da587a53b1df057f64995fbd534e07411f.png "upload_b8fa23eb8898518988b3112a9fd416b0")

1.  プロポーザーがブロックを公開します。これは[現在のブロック検証](https://ethresear.ch#p-60837-h-1-current-block-validation-3)の(1)と同じです。
2.  プルーフ生成者 (prover) がブロックの証明を生成します。
3.  [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]がブロックをダウンロードします。これは[現在のブロック検証](https://ethresear.ch#p-60837-h-1-current-block-validation-3)の(2)と同じです。
4.  [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]がブロックの証明をダウンロードします。
5.  [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]がブロックの*証明*を検証します。
6.  [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]が現在のカノニカルヘッドに投票します。これは[現在のブロック検証](https://ethresear.ch#p-60837-h-1-current-block-validation-3)の(4)と同じです。
7.  アグリゲーターが[[glossary/Attestation|アテステーション（証明）]]をアグリゲートにマージします。これは[現在のブロック検証](https://ethresear.ch#p-60837-h-1-current-block-validation-3)の(5)と同じです。

このタイムラインからいくつかの重要な点を強調します。

-   プルーフ生成者 (prover) は、[[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]が検証できるようになる前に証明を生成する必要があります。実際には、ZKバグが無効な状態遷移につながるのを防ぐために、複数の証明が冗長に検証されることが期待されます。したがって、実際には*複数の*プルーフ生成者 (prover) が行動し、*複数の*証明がダウンロードされ、検証される必要があります。[\[8\]](https://ethresear.ch#footnote-60837-8)
-   この素朴なバージョンでは、[[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]は完全なブロック (3) *と*証明 (4) をダウンロードするため、[[glossary/zkEVM|zkEVM]]なしの検証フローと比較して帯域幅 (bandwidth) 消費が増加します。証明は300 KiBを目標としているため、そのような証明を3つダウンロードすると、各スロットで約1メガバイトの追加データがダウンロードされます（10Mbit/s接続で0.8秒）。
-   [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]は、ブロックを直接実行する代わりに、投票 (6) を行う前に[[glossary/zkEVM|zkEVM]]証明 (5) を検証します。

一見すると、この設定はスケーラビリティにとって悪いです。なぜなら、複数の証明をダウンロードして実行するために必要な追加のレイテンシ (latency) は、ブロックを直接実行するよりも遅くなるからです！さらに、セクション1で議論したように、証明検証がブロック実行よりも大幅な高速化を提供したとしても、ガスリミットの増加に伴いブロック*自体*のダウンロードも大幅にスケールすることを考慮する必要があります。**ガスリミットの高いブロックの帯域幅 (bandwidth) オーバーヘッドを削減しなければ、ネイティブ[[glossary/zkEVM|zkEVM]]は意味のあるスケーリング改善を提供しません。** 幸いなことに、この問題にはイーサリアムが完全に活用できるシンプルな解決策があります。簡単に言えば、[[glossary/Ethereum-validator|イーサリアムバリデータ]]は証明を完全にダウンロードできますが、検証を実行するためにブロックの内容を*サンプリング*するだけで済みます。次のセクションでこれを説明します。

### 3\. よりスマートなzkEVMブロック検証

[[glossary/blob|ブロブ]]により、イーサリアムにはすでに、個々のノードが内容全体をダウンロードすることなく、大量のデータをチェーンに投稿するためのインフラストラクチャが構築されています。[[EIP-8142|EIP-8142]]はこの機能を活用し、ブロック全体を[[glossary/blob|ブロブ]]に入れ、サンプリングされたブロックの正しさの証明を検証することと組み合わせて、[[glossary/Ethereum-validator|イーサリアムバリデータ]]がサンプリングできるようにします。以下の図は、このブロック検証フローを示しています。前のタイムラインと異なるのは青い丸だけです。

[![スマートなzkEVMブロック検証フローのタイムライン](https://ethresear.ch/uploads/default/optimized/3X/b/e/be21f0572ed00a13bcb05d153dd95b7ae90b295a_2_689x221.png)](https://ethresear.ch/uploads/default/original/3X/b/e/be21f0572ed00a13bcb05d153dd95b7ae90b295a.png "upload_99cbc8c7905c49d8a7353a06b0221629")

1.  プロポーザーがブロックを公開します。これは[基本的なzkEVMブロック検証](https://ethresear.ch#p-60837-h-2-basic-zkevm-block-validation-4)の(1)と同じです。
2.  プルーフ生成者 (prover) がブロックの証明を生成します。これは[基本的なzkEVMブロック検証](https://ethresear.ch#p-60837-h-2-basic-zkevm-block-validation-4)の(2)と同じです。
3.  [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]は、内容が[[glossary/blob|ブロブ]]に含まれているブロックを*サンプリング*します。
4.  [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]がブロックの証明をダウンロードします。これは[基本的なzkEVMブロック検証](https://ethresear.ch#p-60837-h-2-basic-zkevm-block-validation-4)の(4)と同じです。
5.  [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]がブロックの証明を検証します。これは[基本的なzkEVMブロック検証](https://ethresear.ch#p-60837-h-2-basic-zkevm-block-validation-4)の(5)と同じです。
6.  [[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]が現在のカノニカルヘッドに投票します。これは[基本的なzkEVMブロック検証](https://ethresear.ch#p-60837-h-2-basic-zkevm-block-validation-4)の(6)と同じです。
7.  アグリゲーターが[[glossary/Attestation|アテステーション（証明）]]をアグリゲートにマージします。これは[基本的なzkEVMブロック検証](https://ethresear.ch#p-60837-h-2-basic-zkevm-block-validation-4)の(7)と同じです。

**[[glossary/zkEVM|zkEVM]]により、[[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]は、ブロック全体をダウンロードする代わりにブロックをサンプリング (3) できます。** 私の意見では、これはブロックの実行時間を短縮することと同じくらい重要です。[[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]は依然としてブロックの証明全体（または複数の証明）をダウンロードする必要がありますが、完全なブロック内容の一部をサンプリングするだけで済むという恩恵を受けます。

これは大きなパラダイムシフトです。ブロックの最大サイズはブロック内のガス量に線形に増加するため、[[glossary/zkEVM|zkEVM]]なしでガスリミットを増やせば、ダウンロードのレイテンシ (latency) が増加します。逆に、証明サイズはブロック内のガス量に対して*準線形*（再びO(\\log^2 n)）にスケールするため、[[glossary/zkEVM|zkEVM]]後の世界では、ガス量の増加が証明のダウンロードレイテンシ (latency) に与える影響は準線形になります。これが、ネイティブ[[glossary/zkEVM|zkEVM]]を私にとって非常に魅力的にする根本的な要因です。

### 4\. zkEVMと他のスケーリング技術の比較

[[glossary/zkEVM|zkEVM]]はイーサリアムのスケーリング計画の重要な部分です。上記で議論したように、[[glossary/zkEVM|zkEVM]]世界の主な利点は、ブロック検証とダウンロードのレイテンシ (latency) を大幅に増加させることなく、ガスリミットを*大幅に増加*させることができる点です。これは素晴らしいことですが、チェーン全体の[[glossary/Rollup|スループット (throughput)]]だけがスケーリングにとって重要な指標ではありません。

-   *[[glossary/zkEVM|zkEVM]] vs. 短いスロット*: [短いスロット](https://consensus.ethereum.foundation/themes/short-slots)（および[「クイック」スロット](https://eips.ethereum.org/EIPS/eip-8198)）は、スロットのエンドツーエンドのレイテンシ (latency) を削減することを目的としています。（特に、[[glossary/Attestation|アテステーション（証明）]]の伝播と集約が行われるスロット時間の後半8秒をターゲットにしています。上記の図を参照してください。）ある意味では、[[glossary/zkEVM|zkEVM]]のスケーリングロードマップは、短いスロットの目標と*相反*します。これは、ブロック生成にプルーフ生成ステップ（[基本的なzkEVMブロック検証](https://ethresear.ch#2-Basic-zkEVM-block-validation)の2）を導入すると、ブロック生成フローに別の参加者が加わり、証明をネットワークの残りの部分と共有するための別の通信ラウンドが追加されるという単純な現実から来ています。さらに、[[glossary/zkEVM|zkEVM]]チェーンは、最速のプルーフ生成者 (prover) が証明を完了できる速度でしか進行できません。[\[9\]](https://ethresear.ch#footnote-60837-9) 12秒スロットの場合、「[リアルタイム証明](https://blog.ethereum.org/2025/07/10/realtime-proving)」は手の届く範囲にありますが、スロット時間を短縮するには、プルーフ生成者 (prover) のレイテンシ (latency) をそれに応じて短縮する必要があります。最後に、短いスロットの現在のビジョンでは、ブロックごとのガスリミットを低く設定し、チェーンの1秒あたりのガスリミットを効果的に維持することが含まれています。しかし、[[glossary/zkEVM|zkEVM]]の世界では、ガスリミットとは無関係に固定の証明コストがあるため、短いスロットはその作業の償却に不利に働きます。全体として、短いスロットと[[glossary/zkEVM|zkEVM]]の間はそれほどゼロサムではありません。[[glossary/zkEVM|zkEVM]]は根本的に帯域幅 (bandwidth) スケーリング技術であり、短いスロットはレイテンシ (latency) の削減に焦点を当てています。プルーフ生成者 (prover) のレイテンシ (latency) を十分に削減でき、証明サイズが十分に小さく迅速にダウンロードできる限り、これらのスケーリング技術は実際には互いにうまく補完し合います。
-   *[[glossary/zkEVM|zkEVM]] vs. [[glossary/ePBS|ePBS (enshrined Proposer-Builder Separation)]]*: [[glossary/ePBS|ePBS (enshrined Proposer-Builder Separation)]]はブロック生成パイプラインを変更します。プロポーザーは、ブロックの内容を見ることなくブロックヘッダーにコミットできるようになります。さらに、主要な[[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]セットは、ブロックの内容と有効性にも盲目的に、そのコミットメントの[[glossary/Data-Availability|データアベイラビリティ]]に投票します（`t=3`で）。ペイロード適時性委員会（ランダムにサンプリングされた512の[[glossary/Ethereum-validator|バリデータ]]のサブセット）のメンバーのみが、ブロック自体のタイミングと有効性に投票し、`t=9`で行います。この6秒の遅延は、プロトコルを[フリーオプション問題](https://arxiv.org/abs/2509.24849)にさらしますが（これは**重大な脆弱性**です[IMO](https://x.com/mikeneuder/status/1948911395028041941)）、ブロックがダウンロードされ実行されるための追加時間を提供します。[[glossary/zkEVM|zkEVM]]の未来では、この時間は証明が生成され検証されるためにも役立ちます。[[glossary/ePBS|ePBS (enshrined Proposer-Builder Separation)]]が[[glossary/Glamsterdam|グラムステルダム]]ハードフォークの主要な[[glossary/EIP|EIP（Ethereum 改善提案）]]であることを考えると、コミュニティはフリーオプション問題によって露呈する経済的リスクよりもこれらのスケーリングの恩恵[\[10\]](https://ethresear.ch#footnote-60837-10)を重視しているようです。
-   *[[glossary/zkEVM|zkEVM]] vs. 高速ファイナリティ*: [高速ファイナリティ](https://consensus.ethereum.foundation/themes/fast-finality)（および[高速確認ルール](https://fastconfirm.it/#faq)）は、ネイティブ[[glossary/zkEVM|zkEVM]]とは完全に直交しています。イーサリアムのファイナリティは現在エポック（32スロット）のスケールで動作しており、高速ファイナリティの目標はこれをより少ないスロット数に削減することです。[[glossary/zkEVM|zkEVM]]はこの目標を助けも妨げもしません。

イーサリアムのスケーリングパズルには多くのピースがあります。この記事は、特に[[glossary/zkEVM|zkEVM]]のスケーリングの恩恵を考慮する際、ブロック実行を証明検証に置き換えることによって生じる**計算スケーリング (compute scaling)** と同等に、[[glossary/blob|ブロブ]]内のブロックによって可能になる**帯域幅 (bandwidth) スケーリング**を考慮すべきであると主張します。

読んでくれてありがとう！

* * *

1.  [[glossary/zkEVM|zkEVM]]を持つことによる潜在的なステートレス性の恩恵は無視していることに注意してください。この記事の目的は、長期的なメモリとディスク消費ではなく、リアルタイムの帯域幅 (bandwidth) とレイテンシ (latency) リソースに焦点を当てることです。それらも重要ですが、短期的にはスロットのタイミングとリソースがスケーリングのボトルネックです。 [↩︎](https://ethresear.ch#footnote-ref-60837-1)
    
2.  帯域幅 (bandwidth) が十分に速くスケールすれば、より大きなブロックを完全にダウンロードすることが可能になり、より帯域幅 (bandwidth) 効率的なブロック検証フローの必要性がなくなる可能性も注目に値します。この世界では、チェーンは計算量に制約され、ネイティブ[[glossary/zkEVM|zkEVM]]の計算スケーリングの恩恵が支配的な要因となるでしょう。直感的には、計算量はグローバルな帯域幅 (bandwidth) よりも速くスケールしているように見えますが、これを検証することは行うべき重要な経験的健全性チェックです。 [↩︎](https://ethresear.ch#footnote-ref-60837-2)
    
3.  完全な[[glossary/Ethereum-validator|バリデータ]]セットは32のグループに分割され、各グループはエポック内で単一のスロットに投票し、各[[glossary/Ethereum-validator|バリデータ]]はエポックごとに正確に1回投票します。 [↩︎](https://ethresear.ch#footnote-ref-60837-3)
    
4.  アグリゲーターは[[glossary/Attestation|アテステーション（証明）]]を単一のより大きな[[glossary/Attestation|アテステーション（証明）]]にマージしますが、これに対して報酬を受け取ることも、行わないことに対して罰せられることもありません。 [↩︎](https://ethresear.ch#footnote-ref-60837-4)
    
5.  このタイムラインは、[[glossary/blob|ブロブ]]トランザクションのサンプリングがブロック検証フローの一部であるという事実を無視していますが、これはこの議論には関係ありません。 [↩︎](https://ethresear.ch#footnote-ref-60837-5)
    
6.  これは、ブロックが[[glossary/Attestation|アテステーション（証明）]]期限*前*にダウンロードされるが、検証と投票が*後*に行われるというエッジケースを無視しています。[正直な仕様](https://github.com/ethereum/consensus-specs/blob/7d5f3348d7b947851861745be9ce0ba30e526531/specs/phase0/validator.md#attesting)によれば、有効なブロックが期限までにダウンロードされる限り、[[glossary/Attestation|アテステーション（証明）]]を行う[[glossary/Ethereum-validator|アテスター]]はそれを[[glossary/fork|フォーク]]選択ビューで考慮すべきです。「[[glossary/Ethereum-validator|バリデータ]]は、(a) 割り当てられたスロットの期待されるブロックプロポーザーから有効なブロックを受信した場合、または (b) スロット開始からget\_attestation\_due\_ms()ミリ秒が経過した場合のいずれか早い方に、関連する[[glossary/Attestation|アテステーション（証明）]]サブネットに[[glossary/Attestation|アテステーション（証明）]]を作成しブロードキャストすべきです。」もちろん、ブロックが有効であることは実行するまでわかりませんが、仕様は期限後に実行が行われることを許容しているように見え、クライアントがこれをどのように実装するかはこの記事にとって重要ではありません。 [↩︎](https://ethresear.ch#footnote-ref-60837-6)
    
7.  プルーフ生成者 (prover) が実際にプロトコルに組み込まれた役割にならず、ビルダーが構築するブロックの証明を提供することが期待される可能性もあります。これは、[[glossary/solo-staker|ソロステーカー]]が（ZK証明を提供できないため）自分でブロックを構築する能力を完全に排除しますが、[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]を通じて「インクルーダー」としてブロックの内容に貢献する可能性があります。このアンバンドリングがどのようなものになるかについては、[こちら](https://ethresear.ch/t/three-tier-staking-3ts-unbundling-attesters-includers-and-execution-proposers/21648)を参照してください。 [↩︎](https://ethresear.ch#footnote-ref-60837-7)
    
8.  複数の証明を検証することは、今日の[[glossary/Ethereum-validator|イーサリアムバリデータ]]が行っている単一の実行層クライアントでブロックを実行するよりも、実際には*より堅牢な*ブロック検証フローであることに注意してください。事実上、複数の証明を検証することは、ノードに複数の実行層バイナリを実行するように要求することなく、より広範な[[glossary/client-diversity|クライアント多様性]]を得るための非常に安価な方法として機能します。 [↩︎](https://ethresear.ch#footnote-ref-60837-8)
    
9.  プルーフ取得に関する[最近の論文](https://arxiv.org/pdf/2605.05559)の宣伝ですが、脚注5がこれをうまく捉えています。「*このパラダイムの下では、[[glossary/zkEVM|zkEVM]]はより速いペースで動作できます。ネットワーク内の誰かがトランザクションを実行し、正しい証明を生成できる限り（トランザクションデータをサンプリングし、生成された証明を検証することが十分に軽量であるため、[[glossary/Ethereum-validator|バリデータ]]ネットワーク全体がそれを行うことができます）。証明システムのプルーフ生成者 (prover) 効率によっては、これは改善になる場合もならない場合もあります。一方では、最も遅い参加者ではなく、最も速い参加者のペースで動作しますが、他方では、その参加者はトランザクションを実行し、正しさのZK証明を作成する必要があります。*」 [↩︎](https://ethresear.ch#footnote-ref-60837-9)
    
10. [EIP-7886](https://eips.ethereum.org/EIPS/eip-7886)は、ブロックの遅延実行を可能にし、フリーオプション問題なしに同様のパイプライニング (pipelining) の恩恵を提供したでしょうが、もはやアクティブな提案ではありません。 [↩︎](https://ethresear.ch#footnote-ref-60837-10)
     

*2 posts - 2 participants*

[Read full topic](https://ethresear.ch/t/a-native-zkevm-scales-bandwidth-not-just-execution/25254)
