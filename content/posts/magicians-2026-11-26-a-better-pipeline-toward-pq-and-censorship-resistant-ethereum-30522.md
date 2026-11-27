---
title: PQと検閲耐性イーサリアムに向けたより良いパイプライン
original_title: A better pipeline toward PQ and censorship resistant Ethereum
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/a-better-pipeline-toward-pq-and-censorship-resistant-ethereum/30522
author: jihoonsong
date: '2026-11-26'
category: Uncategorized
tags:
  - post-quantum
  - consensus
  - censorship-resistance
  - protocol-design
  - research
  - roadmap
  - eips
topic_id: '30522'
translated_at: '2026-11-27'
translator: gemini-2.5-flash
---

> [!note] 原文
> [A better pipeline toward PQ and censorship resistant Ethereum](https://ethereum-magicians.org/t/a-better-pipeline-toward-pq-and-censorship-resistant-ethereum/30522) — jihoonsong (2026-11-26)

イーサリアムは[[glossary/Post-Quantum|ポスト量子 (PQ)]]への移行を加速しています。そのために、私たちは[[glossary/Hegot|ヘゴタ (Hegotá)]]のスコープを見直しています。各機能が研究、開発、テストのパイプラインのどこに位置し、どれだけの作業を並行して進められるかを見て、何を実装すべきかを決定する必要があると思います。

[[glossary/PQ-Decoupled-Consensus|PQデカップルドコンセンサス (Post-Quantum Decoupled Consensus)]]は、[[glossary/Post-Quantum|PQ]]耐性イーサリアムにとって理想的な設計と見なされています。[[glossary/Decoupled-Consensus|デカップルド・コンセンサス]]は4年以上の研究の集大成であり、[[glossary/Consensus-Layer|コンセンサス層 (CL)]]を大幅に改善するでしょう。また、署名集約をクリティカルパスから外すことで、[[glossary/Post-Quantum|PQ]]移行を容易にします。しかし、これはまだ活発な研究段階にあります。その設計空間はまだ探求されており、初期仕様もまだ進行中です。

代替案として、[[glossary/PQ-Gasper|PQ Gasper]]が緊急の[[glossary/Post-Quantum|PQ]]移行[[glossary/fork|フォーク]]として提案されました。[[glossary/PQ-Gasper|PQ Gasper]]の[[glossary/devnet|開発ネットワーク (devnet)]]はすでに稼働しています。この機会を利用して、例えばM個の[[glossary/attestations|アテステーション]]とN個の集約それぞれについて、ブロードキャスト時間と帯域幅消費量を測定するなどのベンチマークを実行すべきです。また、[[glossary/Waggle-protocol|Waggle]]、[[glossary/SEACAST|SEACAST]]、高速な証明ブロードキャストなど、将来のP2P変更のプロトタイプを開発する場も提供します。残念ながら、これは当初のビジョンから逸脱しつつあります。[[glossary/PQ-Gasper|PQ Gasper]]は、ハードウェアと帯域幅の要件を引き上げるべきか、[[glossary/Aggregator|アグリゲーター]]の役割を導入すべきか、どのP2P変更を採用すべきか、[[glossary/Sync-Committee|同期委員会]]を削除すべきかなど、難しい問題を提起しています。これらすべてにより、差し迫ったセキュリティ脅威の明確な証拠がない限り、[[glossary/PQ-Gasper|PQ Gasper]]を実装すべきかどうかは不明確です。

どちらを選択するにしても、[[glossary/PQ-Consensus-Layer|PQコンセンサス層]]は研究段階を卒業するにはまだ遠いです。さらに、どちらの設計も署名集約のために[[glossary/leanVM|leanVM]]に依存していますが、これはまだ未解決です。より多くの人が[[glossary/leanVM|leanVM]]をレビューする必要があり、プロトコル設計と[[glossary/leanVM|leanVM]]は、どの署名スキームを使用するか、署名を集約するかどうかなどの決定において相互に影響し合います。[[glossary/PQ-Decoupled-Consensus|PQデカップルドコンセンサス]]は集約がクリティカルパスから外れているため、より良い位置にありますが、大規模なアーキテクチャ変更であり、研究はまだ進行中です。

研究、開発、テストのパイプラインにおいて、これは[[glossary/PQ-Consensus-Layer|PQコンセンサス層]]を研究段階に位置づけます。

![2026年11月26日午後9時32分39秒のスクリーンショット](https://ethereum-magicians.org/uploads/default/optimized/3X/e/c/ecfe1bb58b644ff9c5509a1bd98a41f5fd205299_2_690x223.png)

[[glossary/Execution-Layer|実行レイヤー (EL)]]で仕様変更がないと仮定すると、1月は[[glossary/Glamsterdam|グラムステルダム]]の現実的な目標です。もし研究段階の機能を選択した場合、開発者のキャパシティが数ヶ月間アイドル状態になるでしょう。

一方で、進められる作業もまだあります。[[glossary/Post-Quantum|PQ]]事前登録は、[[glossary/PQ-Consensus-Layer|PQコンセンサス層]]パイプラインの最初のステップとなり得ます。これは[[glossary/Glamsterdam|グラムステルダム]]後すぐに、例えば4月に[[glossary/Consensus-Layer|CL]]のみの[[glossary/fork|フォーク]]として実装できます。もし[[glossary/Consensus-Layer|CL]]が[[glossary/Glamsterdam|グラムステルダム]]の遅延を避けるために[[glossary/RLP|RLP (Recursive Length Prefix)]]を使用するなら、その[[glossary/fork|フォーク]]には#5820（[[glossary/execution-payload-root|実行ペイロードルート]]へのコミット）も含まれる可能性があります。それでも、クライアントチームが[[glossary/mainnet|メインネット]]向けに[[glossary/PQ-Consensus-Layer|PQコンセンサス層]]の実装を開始するまでには、さらに数ヶ月かかると予想しています。

一つの選択肢は、その時間を[[glossary/client-hardening|クライアント強化]]に充てることです。これは価値のある作業ですが、すでにこの作業を行っており、凍結された機能に焦点を当てることを考えると、数ヶ月間すべてのアイドル状態の開発者キャパシティを[[glossary/client-hardening|クライアント強化]]に投入することが、その時間の最善の利用法であるかどうかは分かりません。

もう一つの方法は、利用可能なエンジニアリングキャパシティを使って機能を実装することです。[[glossary/EIP-8148|EIP-8148]]やいくつかのネットワーク最適化のようなCFI'd機能がその枠を埋めることができますが、偶然にもSFI'dのヘッドライナーが最も成熟した準備状況を示しています。以下の図は、作業がどこに集中しているかを示しています。

![2026年11月26日午後9時38分47秒のスクリーンショット](https://ethereum-magicians.org/uploads/default/optimized/3X/f/7/f7f6f9b2b64ccc44f76bcfa76aeb53d4f0357d70_2_689x225.png)

言うまでもなく、[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]はすでに[[glossary/devnet|開発ネットワーク (devnet)]]があり、研究者やクライアント開発者の間でよく理解されています。間もなく[[glossary/client-hardening|強化]]フェーズに入る可能性があります。[[glossary/FOCIL|FOCIL]] <> [[glossary/Frames|フレーム]]は、開発とテストのサイクルが始まるのを待っています。[[glossary/Hegot|ヘゴタ]]は、[[glossary/PQ-Consensus-Layer|PQコンセンサス層]]がまだ研究段階にある間に、開発とテストを進めることができます。[[glossary/PQ-Consensus-Layer|PQコンセンサス層]]がクライアント開発に移行するまでに[[glossary/FOCIL|FOCIL]]の作業のほとんどが完了すると予想しているため、[[glossary/Hegot|ヘゴタ]]に[[glossary/FOCIL|FOCIL]]を実装することは、[[glossary/Post-Quantum|PQ]]のタイムラインに与える影響は限定的であるはずです。

[[glossary/FOCIL|FOCIL]]は、どちらが先に実装されるにしても、最終的には[[glossary/PQ-Consensus-Layer|PQコンセンサス層]]と連携する必要があります。アイドルリソースなしで実行することは、同じ目的地に到達するためのより速い方法です。したがって、すべての機能を削除して[[glossary/PQ-Consensus-Layer|PQコンセンサス層]]に全力を注ぐことは、最適ではないかもしれません。

[[glossary/PQ-Consensus-Layer|PQコンセンサス層]]に深いプロトコル知識を持つより多くの人々を投入することは、[[glossary/Post-Quantum|PQ]]ロードマップを加速させるでしょう。より多くの人を投入すれば、作業が速くなると仮定したくなるものです。しかし、実際に作業を進めてきたのは、機能を隅々まで知っている一握りの専門家たちでした。私たちは[[glossary/mythical-man-month|神話の男月]]の罠を避けるべきです。さらに、人々は異なるスキルセットを持ち、異なる種類の作業に対する意欲も異なります。一部のプロトコル専門家が[[glossary/PQ-Consensus-Layer|PQコンセンサス層]]の研究に取り組む一方で、開発とテストに特化した人々は他の機能を前進させることができます。

私は、[[glossary/Hegot|ヘゴタ]]に[[glossary/FOCIL|FOCIL]]を維持し、[[glossary/Post-Quantum|PQ]]事前登録を[[glossary/PQ-Consensus-Layer|PQコンセンサス層]]パイプラインの自然な最初のステップとして、[[glossary/PQ-Decoupled-Consensus|PQデカップルドコンセンサス]]を並行して開発することを提案します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/a-better-pipeline-toward-pq-and-censorship-resistant-ethereum/30522)
