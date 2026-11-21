---
title: 'EIP-8288: 再帰的集約のネットワーキング側面'
original_title: 'EIP-8288: the networking side of recursive aggregation'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/eip-8288-the-networking-side-of-recursive-aggregation/26263
author: cskiraly
date: '2026-11-18'
category: Networking
tags:
  - networking
  - eip
  - zk
  - mempool
  - post-quantum
  - privacy
  - scaling
  - research
topic_id: '26263'
translated_at: '2026-11-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8288: the networking side of recursive aggregation](https://ethresear.ch/t/eip-8288-the-networking-side-of-recursive-aggregation/26263) — cskiraly (2026-11-18)

author: Csaba Kiraly [@cskiraly](https://ethresear.ch/u/cskiraly)

Vitalik ButerinとThomas Coratgerによる[[glossary/EIP-8288|EIP-8288]]は、Vitalik Buterinがこのフォーラムの以前の投稿で提案した[[glossary/Recursive-STARK|再帰的STARK]]ベースの帯域幅効率的な[[glossary/Mempool|メムプール]]を規定しています。トランザクションは、それが依存する[[glossary/post-quantum-signatures|量子耐性署名]]と証明を宣言します。トランザクションが拡散するにつれて、[[glossary/Mempool|メムプール]]ノードはそれらの依存関係を[[glossary/Recursive-STARK|再帰的STARK]]に折り込みます。ブロックはそれらすべてに対して1つの証明を運び、[[glossary/EVM|EVM]]はそれぞれを個別にチェックする必要がなくなります。[[glossary/Mempool|メムプール]]は**[[glossary/proving-network|証明ネットワーク]]**になります。それが追いつくかどうかは、**ノードが何を送信するか、どれくらいの頻度で送信するか、そしていくつのピアがそれを受信するか**にかかっています。

**[[glossary/post-quantum-signatures|量子耐性署名]]だけでは、これをネットワークに強制するものではありません。** 私たちのシミュレーションでは、**今日の[[glossary/Mempool|メムプール]]は今日の負荷をそれらで処理できる**ことが示されています。今日のレートをわずかに下回る15署名tx/sでは、ノードは今日の大きなトランザクションと同様に、生トランザクションをアナウンスしてフェッチしました。1つのビルダーがそれらすべてを受信し、ブロックに含めました。他のノードは平均して各トランザクションの約1コピーをアップロードしました。これは、2.5 kBの署名で約0.4 Mbit/s、7,740 Bの署名で1 Mbit/sに相当します。ここで研究するのは、[[glossary/Recursive-STARK|再帰的STARK]]集約がそれをどのように超えるかです。これは、[[glossary/Mempool|メムプール]]で今日のトランザクションのようにゴシップするには[[glossary/STARK|STARK]]の証人が大きすぎる**[[glossary/privacy-transactions|プライバシー取引]]**を運び、**今日の設計とワークロードを超えてスケールする**方法を提供します。

私たちは[[glossary/EIP-8288|EIP-8288]]のネットワーキングの選択肢を探るために**[[glossary/discrete-event-simulator|離散イベントシミュレーター]]**を構築しました。誰が集約するか、何が生のまま、または証明の中に伝わるか、いつノードがフェッチして折り込むか、そしてどれくらいの速さで証明するかを変化させました。**一度に1つの選択肢を変更し**、同じネットワークで同じトランザクションを実行できます。100から10,000ノードのネットワーク全体で、仕様がそれらを固定する前に**これらの選択肢がインクルージョン、遅延、アップロードをどれだけ変更するか**を測定しました。2026年8月以降、[[glossary/EIP-8288|EIP-8288]]の著者と結果を共有し、[Devcon 8のP2Pネットワーキングハブ](https://app.devcon.org/schedule/p2p-networking-s04)で最初の結果を発表しました。

私たちの知る限り、[[glossary/EIP-8288|EIP-8288]]のネットワーキングに並行して取り組んでいる**もう1つの取り組み**があります。[[glossary/EIP-8437|EIP-8437]]は[[glossary/wire-protocol|ワイヤープロトコル]]から始まります。ノードはラッパーをアナウンスし、ピアはハッシュでそれらをフェッチします。**この2つの取り組みは合流するでしょう。** [[glossary/wire-protocol|ワイヤープロトコル]]は、ピアがいつ証明をフェッチするかなどの選択肢を決定する必要があります。[[glossary/EIP-8437|EIP-8437]]自体も「集約間隔内での伝播には測定が必要である」と述べています。

これまでの結果と、**2つの[[glossary/EIP|EIP]]が明記すべきと考える4つの選択肢**を報告します。[First Questions](https://claude.ai/artifact/18s7FFBBddd3YMFz2kcQHv)には、これらの数値の背後にある詳細が記載されています。

### TL;DR

私たちの結果のほとんどは、[[glossary/EIP-8288|EIP-8288]]が未解決のままにしている選択肢に基づいています。これらは、各証明をいくつのピアが受信するか、どのノードが集約するか、[[glossary/raw-transaction|生トランザクション]]がそれらにどのように到達するか、そしてどの[[glossary/prover|プルーバー]]に対して間隔が設定されるかに関係します。私たちの参照ネットワークは1,000ノードで、それぞれに6つのピアと25 Mbit/sの[[glossary/uplink|アップリンク]]があります。

-   **今日の[[glossary/Mempool|メムプール]]は、[[glossary/post-quantum-signatures|量子耐性署
