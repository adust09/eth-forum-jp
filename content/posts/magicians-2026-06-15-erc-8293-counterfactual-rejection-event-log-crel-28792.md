---
title: 'ERC-8293: 反実仮想拒否イベントログ (CREL)'
original_title: 'ERC-8293: Counterfactual Rejection Event Log (CREL)'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8293-counterfactual-rejection-event-log-crel/28792
author: aartikamat
date: '2026-06-15'
category: ERCs
tags:
  - ercs
  - defi
  - execution-layer
  - mempool
  - research
  - protocol-design
  - applications
topic_id: '28792'
translated_at: '2026-06-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8293: Counterfactual Rejection Event Log (CREL)](https://ethereum-magicians.org/t/erc-8293-counterfactual-rejection-event-log-crel/28792) — aartikamat (2026-06-15)

# ERC-8293: 反実仮想拒否イベントログ (CREL)

PR: [Add ERC: Counterfactual Rejection Event Log (CREL) by aartikamat · Pull Request #1806 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/1806)

## 概要

[[ERC|ERC]]-8293は、[[DEX|DEX]]プロトコルまたはフィルターが実行前に拒否した取引候補のためのオンチェーンイベントログを規定するものです。2つのイベントがあります。拒否時に発生する `RejectionLogged` と、拒否されたトークンが実際に何をしたかを記録するために、その後一定間隔で発生する `OutcomeSampled` です。これらのイベントを発行するプロトコルにより、外部の参加者はフィルターの精度を測定し、[[counterfactual-replay|反実仮想分析]]を実行し、プロトコル間でフィルターの品質を比較できるようになります。

## 動機

[[DEX|DEX]]プロトコルやフィルターミドルウェアは、評価する候補トークンのほとんどを拒否しますが、それらの拒否をログに記録しません。承認された取引は完全なイベントメタデータを受け取ります。拒否された取引はオンチェーンに何も残りません。3つの結果として、以下の点が挙げられます。

1.  独自のオフチェーンキャプチャシステムを構築しない限り、フィルターの精度を測定できません。
2.  拒否理由がオンチェーンに表示されないため、プロトコル間でフィルターの品質を比較できません。
3.  プライベートなリプレイインフラストラクチャがないと、[[counterfactual-replay|反実仮想結果分析]]（拒否されたトークンが取引されていたらどうなっていたか？）を実行できません。

RED-2400データセットは、このギャップの大きさを示しています。Solanaの[[DEX|DEX]]会場で49日間にわたって捕捉された6,660件の拒否イベントは、すべてオフチェーンの計測を通じて得られたものです。CRELは、この捕捉をイーサリアムにネイティブなものにします。

## 未解決の質問

1.  `OutcomeSampled` のサンプリング間隔は仕様で固定すべきか、それとも実装ごとに設定可能とすべきか？
2.  イベントスキーマは現在のドラフトのままでThe GraphやDuneのインデクサーと互換性があるか、それとも調整が必要か？
3.  これは[[DEX|DEX]]に依存しないものとすべきか、それともAMM形式の会場のみにスコープを限定すべきか？

スキーマと、サンプリングスケジュールを仕様に含めるべきか、実装者に任せるべきかについて意見を求めています。

*1件の投稿 - 1名の参加者*

[Read full topic](https://ethereum-magicians.org/t/erc-8293-counterfactual-rejection-event-log-crel/28792)
