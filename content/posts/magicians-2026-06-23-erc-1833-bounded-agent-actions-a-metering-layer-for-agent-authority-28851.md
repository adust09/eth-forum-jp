---
title: 'ERC-1833: 制限付きエージェントアクション - エージェント権限のためのメータリング層'
original_title: 'ERC-1833: Bounded Agent Actions - a metering layer for agent authority'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-1833-bounded-agent-actions-a-metering-layer-for-agent-authority/28851
author: blockbird
date: '2026-06-23'
category: ERCs
tags:
  - ercs
  - erc
  - account-abstraction
  - smart-contracts
  - protocol-design
  - security
  - ux
  - ai-agents
  - agent-authority
  - metering
topic_id: '28851'
translated_at: '2026-06-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-1833: Bounded Agent Actions - a metering layer for agent authority](https://ethereum-magicians.org/t/erc-1833-bounded-agent-actions-a-metering-layer-for-agent-authority/28851) — blockbird (2026-06-23)

**[[glossary/ERC|Ethereum Request for Comments (ERC)]]: 制限付きエージェントアクション - エージェント権限のためのメータリング層**

現在、多くのエージェント関連の[[glossary/ERC|ERC]]が提案されているため、まず、この[[glossary/ERC|ERC]]が何でないかを明確にしておきたい。これは何も強制せず、ワークフローを実行せず、決済もしない。その役割は限定的だ。**エージェントがそのアクション全体で、制限された委任（mandate）のうちどれだけをすでに消費したかを継続的にカウントし、ダウンストリームの[[glossary/contract|コントラクト]]が残りの許容量をルックアップできるようにする。** それが全体像だ。**1つの小さな[[glossary/on-chain|オンチェーン]]オブジェクト、つまりカーソルがあり、それを読み取り、進めるための単一の[[glossary/interface|インターフェース]]を持つ。** より大きなフレームワークの一部としてではなく、単独で提案している。なぜなら、このカウンティングこそが現在実際に欠けている部分だと考えているからだ。

ERC-8301での制限付き[[glossary/execution|実行]]に関する議論も、同じギャップを[[glossary/execution|実行]]側から探っている。私はそこでメータリングの視点を持ち出したが、そのスレッドを乗っ取るよりも、独自の議論に値すると感じたため、ここに投稿する。

注意すべき点が1つある。**この[[glossary/interface|インターフェース]]自体は、[[glossary/principal|プリンシパル]]自身の鍵がバウンドをバイパスすることを不可能にするものではない。カウンティングと強制は2つの異なる役割だ。** その下にある何かが実際に境界を維持する必要がある。アセットを管理する[[glossary/vault|ボールト]]か、[[glossary/account|アカウント]]の唯一の[[glossary/execution|実行]]パス上にある[[glossary/module|モジュール]]だ。この[[glossary/interface|インターフェース]]が暗黙的に仮定するものではなく、その層を実装する者に対する明示的な要件として仕様に書き込んだ。この提案が強制標準を侵害しないようにするために、これを最初に述べている。**この[[glossary/interface|インターフェース]]は会計処理を行い、強制は別の場所で行われる。**

他のすべてが依存する設計上の決定が1つある。**バウンドは2つの方法で表現できる。1) 各アクションで[[glossary/public-state|パブリックステート]]から再計算される[[glossary/predicate|述語]]として、または2) 各アクションが書き込むカウンターとしてだ。** すべてが単一のサーフェスで解決される場合、[[glossary/predicate|述語]]で十分だ。なぜなら、そこでの[[glossary/execution|実行]]はシリアライズされているため、同じ[[glossary/transaction|トランザクション]]内で読み書きするチェックは、それ以前のすべてをすでに認識しているからだ。サーフェスをまたいだ瞬間、それは真実ではなくなる。単一の[[glossary/contract|コントラクト]]が実行中の合計を保持せず、アクション時にそれを再構築するチェックを実行することはできない。これが、アクションが書き込む常駐オブジェクトである必要がある理由であり、呼び出しごとの[[glossary/hook|フック]]として追加するものではない理由だ。

これは既存の標準の上に立つのではなく、その隣に位置するようにしたい。具体的には、ERC-8301では、ステップゲートが`getCursor(id)`を読み取り、同じステップで`advanceCursor`を呼び出す。8301はタスクがそのステージを順序通りに進むことを保証し、カーソルはそれらのステージがどれだけの権限を消費したかを記録し、サブストレートはその合計をコミットされたバウンド内に保つ。同じ形が他の場所でも機能する。7710の[[glossary/caveat-enforcer|ケイブイートエンフォーサー]]、8001の[[glossary/agreement|アグリーメント]]（[[glossary/agreement|アグリーメント]]は承認された内容を記録し、カーソルは残りを記録する）、そして8274の[[glossary/verification|検証]]（アドバンスの[[glossary/witness|証人]]として機能する）と組み合わせることができる。

ベース[[glossary/interface|インターフェース]]は、その下にある特定の強制メカニズムを意図的に想定していない。しかし、「何も想定しない」は「何も固定しない」に静かに変わりかねないため、実装すべき具体的な[[glossary/profile|プロファイル]]も1つ書いた。それは、カーソルが何を意味するか（実行中の支出）、コミットメントが何を保持するか（[[glossary/cap|キャップ]]と[[glossary/asset|アセット]]）、[[glossary/witness|証人]]が何か、そして重要な[[glossary/invariant|不変条件]]である`spent <= cap`を固定する[[glossary/budget-substrate|バジェットサブストレート]]だ。型付きの`IBudgetSubstrate`が付属しているため、コンシューマーは`remaining()`を呼び出して直接数値を取得できる。**最小限のCC0参照[[glossary/registry|レジストリ]]が[ここ](https://github.com/Atlas-Protocol-AI/bounded-agent-actions)にあり、ERC-165のIDは凍結されている。**

この分野では、より複雑なプライベートな実装も持っているため、公開されているものは意図的に最小限に抑えている。それはクリーンで、メータリングはするが強制はせず、[[glossary/asset|アセット]]を保持せず、意図的にバイパス可能だ。この[[glossary/interface|インターフェース]]が実装可能であり、[[glossary/profile|プロファイル]]が[[glossary/interoperates|相互運用する]]ことを示すために作成した。

この[[glossary/draft|ドラフト]]を議論の開始として投稿する。特に以下の3点について、皆様からのご意見を心から歓迎する。1) カーソルを[[glossary/profile|プロファイル]]から分離するのは正しい切り分け方か、それとも間違った場所に線を引いているか？ 2) [[glossary/budget-substrate|バジェットサブストレート]]の[[glossary/profile|プロファイル]]における相互運用性の保証は、実際に価値があるほど厳密か？ 3) これは8301の制限付き[[glossary/execution|実行]][[glossary/guardrails|ガードレール]]とどこで重複し、どこでそれらの邪魔にならないようにすべきか？

皆様のご意見をお待ちしている :folded_hands:

*14件の投稿 - 6名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-1833-bounded-agent-actions-a-metering-layer-for-agent-authority/28851)
