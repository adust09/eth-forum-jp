---
title: リーン実行：世界のコンピュータをスケールさせるための、安全で、効率的で、適応性があり、リソース効率の高い実行スループットへの包括的アプローチ
original_title: >-
  Lean Execution: a holistic approach to secure, efficient, adaptive, and
  resourceful execution throughput to scale the world-computer
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374
author: conalloreilly
date: '2026-07-06'
category: Sharding
tags:
  - sharding
  - execution-layer
  - scaling
  - rollup
  - consensus
  - data-availability
  - protocol-design
  - research
topic_id: '25374'
translated_at: '2026-07-07'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Lean Execution: a holistic approach to secure, efficient, adaptive, and resourceful execution throughput to scale the world-computer](https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374) — conalloreilly (2026-07-06)

* * *

## [[glossary/leanSpec|リーン実行]]：

世界のコンピュータをスケールさせるための、安全で、効率的で、適応性があり、リソース効率の高い実行スループットへの包括的アプローチ

1\. はじめに [(詳細はこちら)](https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374/1) 2. ブロックチェーンの歴史: 2.1 ブロックチェーンとは？: 2.2 ネットワーク容量に関する包括的視点: 2.3 実践におけるブロックチェーン: [(詳細はこちら)](https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374/1) 3. 均一 vs 異種容量: 3.1 コンセンサス均一性 3.2 データ均一性 3.3 サブルート実行と[[glossary/attestor-proposer-separation|アテスター・プロポーザー分離]] [(詳細はこちら)](https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374/1) 4. シャーディングの歴史: 4.1 前史 4.2 初期イーサリアムシャーディングの概念 4.3 ステートチャネル 4.4 プラズマとバリディウム 4.5 [[glossary/Data-Availability|データシャーディング]] 4.6 L2と[[glossary/Rollup|ロールアップ]]中心のロードマップ 4.7 [[glossary/based-sequencing|ベースド・シーケンシング]]と[[glossary/Native-rollups|ネイティブロールアップ]] [(詳細はこちら)](https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374/1) 5. メモリ均一性: 5.1 [[glossary/memory-layer|メモリ層]]の簡単な説明 5.2 [[glossary/memory-layer|メモリ層]]で解決すべき問題 5.3 シャード化された/[[glossary/virtual-mempools|仮想メモリプール]] [(詳細はこちら)](https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374/1) 6. 実行均一性: 6.1 一般原則 6.2 深さ優先 vs 幅優先スケーリング 6.3 動的に最適化されたリアルタイム[[glossary/execution-sharding|実行シャーディング]] [(詳細はこちら)](https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374/1) 7. [[glossary/execution-sharding|実行シャーディング]]: 7.1 コンセンサス真のルート 7.2 [[glossary/virtual-mempools|仮想メモリプール]] 7.3 実行シャードの順列 7.4 実行委員会 7.5 ステートと[[glossary/Data-Availability|データアベイラビリティ]] 7.6 実行ツリー 7.7 ユニバーサル協調ツリー 7.8 既存システムとの制限と比較 [(詳細はこちら)](https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374/1) 8. 結論 [(詳細はこちら)](https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374/1)

**参考文献:**

\[1\] Justin Drake, “[[glossary/leanSpec|リーンイーサリアム]]”:
[https://blog.ethereum.org/2025/07/31/lean-ethereum](https://blog.ethereum.org/2025/07/31/lean-ethereum)

\[2\] [[glossary/leanSpec|リーンイーサリアム]]ロードマップ:
[https://leanroadmap.org/](https://leanroadmap.org/)

\[3\] Satoshi Nakamoto, “Bitcoin: a Peer-to-Peer Electronic Cash System”:
[https://bitcoin.org/bitcoin.pdf](https://bitcoin.org/bitcoin.pdf)

\[4\] Scott Stornetta, Stuart Haber, “How to time-stamp a digital document”:
[https://link.springer.com/article/10.1007/BF00196791](https://link.springer.org/article/10.1007/BF00196791)

\[5\] Vitalik Buterin, “Ethereum: a Next-Generation Smart Contract and Decentralized Application Platform”:
[https://ethereum.org/content/whitepaper/whitepaper-pdf/Ethereum\_Whitepaper\_-\_Buterin\_2014.pdf](https://ethereum.org/content/whitepaper/whitepaper-pdf/Ethereum_Whitepaper_-_Buterin_2014.pdf)

\[6\] Justin Drake, "Pragmatic Signature Aggregation with BLS”:
[https://ethresear.ch/t/pragmatic-signature-aggregation-with-bls/2105](https://ethresear.ch/t/pragmatic-signature-aggregation-with-bls/2105)

\[7\] Vitalik Buterin, "An Explanation of the Sharding + [[glossary/Data-Availability|DAS（データアベイラビリティサンプリング）]] Proposal”:
[https://hackmd.io/@vbuterin/sharding\_proposal#Why-not-use-just-committees-and-not-DAS](https://hackmd.io/@vbuterin/sharding_proposal#Why-not-use-just-committees-and-not-DAS)

\[8\] epf.wiki, “[[glossary/attestor-proposer-separation|アテスター・プロポーザー分離]]”:
[https://epf.wiki/#/wiki/research/PBS/ET](https://epf.wiki/#/wiki/research/PBS/ET)

\[9\] epf.wiki, “[[glossary/ePBS|ePBS（enshrined Proposer-Builder Separation）]]”:
[https://epf.wiki/#/wiki/research/PBS/ePBS](https://epf.wiki/#/wiki/research/PBS/ePBS)

\[10\] [wikipedia.org](http://wikipedia.org), “Shard (database architecture)”:
[https://en.wikipedia.org/wiki/Shard\_(database\_architecture)](https://en.wikipedia.org/wiki/Shard_\(database_architecture\))

\[11\] Gang Wang, Zhijie Jerry Shi, Mark Nixon, Song Han, “SoK sharding on blockchain”:
[https://dl.acm.org/doi/abs/10.1145/3318041.3355457](https://dl.acm.org/doi/abs/10.1145/3318041.3355457)

\[12\] Satoshi Nakamoto, “BitDNS and generalizing Bitcoin”:
[https://bitcointalk.org/index.php?topic=1790.msg28715#msg28715](https://bitcointalk.org/index.php?topic=1790.msg28715#msg28715)

\[13\] Vitalik Buterin, “Sharding FAQ”:
[https://vitalik.eth.limo/general/2017/12/31/sharding\_faq.html](https://vitalik.eth.limo/general/2017/12/31/sharding_faq.html)

\[14\] Jeff Coleman, “State channels”:
[https://www.jeffcoleman.ca/state-channels/](https://www.jeffcoleman.ca/state-channels/)

\[15\] [ethereum.org](http://ethereum.org), “State channels”:
[https://ethereum.org/developers/docs/scaling/state-channels/](https://ethereum.org/developers/docs/scaling/state-channels/)

\[16\] Vitalik Buterin, “Exit games for EVM validiums: the return of plasma”:
[https://vitalik.eth.limo/general/2023/11/14/neoplasma.html(https://vitalik.eth.limo/general/2023/11/14/neoplasma.html)](https://vitalik.eth.limo/general/2023/11/14/neoplasma.html\(https://vitalik.eth.limo/general/2023/11/14/neoplasma.html\))

\[17\] Vitalik Buterin, Dankrad Feist, Diederik Loerakker, George Kadianakis, Matt Garnett, Mofi Taiwo, Ansgar Dietrichs, “[[glossary/EIP|EIP]]-4844: Shard [[glossary/blob|ブロブ]] Transactions”:
[https://eips.ethereum.org/EIPS/eip-4844](https://eips.ethereum.org/EIPS/eip-4844)

\[18\] Danny Ryan, Dankrad Feist, Francesco D’Amato, Hsiao-Wei Wang , Alex Stokes, “[[glossary/EIP|EIP]]-7594: [[glossary/PeerDAS|PeerDAS]] - Peer [[glossary/Data-Availability|データアベイラビリティサンプリング]]”:
[https://eips.ethereum.org/EIPS/eip-7594](https://eips.ethereum.org/EIPS/eip-7594)

\[19\] Vitalik Buterin, “An Incomplete Guide to [[glossary/Rollup|ロールアップ]]”:
[https://vitalik.eth.limo/general/2021/01/05/rollup.html(https://vitalik.eth.limo/general/2021/01/05/rollup.html)](https://vitalik.eth.limo/general/2021/01/05/rollup.html\(https://vitalik.eth.limo/general/2021/01/05/rollup.html\))

\[20\] Vitalik Buterin, “A [[glossary/Rollup|ロールアップ]]-centric ethereum roadmap”:
[https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698](https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698)

\[21\] Vitalik Buterin, “Ethereum has [[glossary/blob|ブロブ]]. Where do we go from here?”:
[https://vitalik.eth.limo/general/2024/03/28/blobs.html](https://vitalik.eth.limo/general/2024/03/28/blobs.html)

\[22\] Justin Drake, “[[glossary/Native-rollups|ネイティブロールアップ]] — L1実行からのスーパーパワー”:
[https://ethresear.ch/t/native-rollups-superpowers-from-l1-execution/21517](https://ethresear.ch/t/native-rollups-superpowers-from-l1-execution/21517)

\[23\] Luca Donno, Connor McMenamin, “[[glossary/Native-rollups|ネイティブロールアップ]]：現状と今後の展望”:
[https://medium.com/l2beat/native-rollups-where-they-are-and-where-they-are-going-cb21eb103d46](https://medium.com/l2beat/native-rollups-where-they-are-and-where-they-are-going-cb21eb103d46)

\[24\] Luca Donno, Justin Drake, “[[glossary/EIP|EIP]]-8079: [[glossary/Native-rollups|ネイティブロールアップ]]”:
[https://eips.ethereum.org/EIPS/eip-8079](https://ethresear.ch/t/native-rollups-superpowers-from-l1-execution/21517)

\[25\] Justin Drake, “[[glossary/based-sequencing|ベースド・ロールアップ]] — L1シーケンシングからのスーパーパワー”:
[https://ethresear.ch/t/based-rollups-superpowers-from-l1-sequencing/15016](https://ethresear.ch/t/based-rollups-superpowers-from-l1-sequencing/15016)

\[26\] Thomas Thiery, Francesco D’Amato, Julian Ma, Barnabé Monnot, Terence Tsao, Jacob Kaufmann, Jihoon Song, “[[glossary/EIP|EIP]]-7805: [[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]”:
[https://eips.ethereum.org/EIPS/eip-7805](https://eips.ethereum.org/EIPS/eip-7805)

\[27\] Guillaume Ballet, Wei Han Ng, “[[glossary/EIP|EIP]]-7736: [[glossary/Verkle-Trees|Verkleツリー]]におけるリーフレベルのステート有効期限”:
[https://eips.ethereum.org/EIPS/eip-7736](https://eips.ethereum.org/EIPS/eip-7736)

\[28\] Vitalik Buterin , Eric Conner, Rick Dudley Matthew Slipper, Ian Norden , Abdelhamid Bakhta, “[[glossary/EIP|EIP]]-1559: ETH 1.0チェーンの手数料市場変更”:
[https://eips.ethereum.org/EIPS/eip-1559](https://eips.ethereum.org/EIPS/eip-1559)

*1 post - 1 participant*

[Read full topic](https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374)
