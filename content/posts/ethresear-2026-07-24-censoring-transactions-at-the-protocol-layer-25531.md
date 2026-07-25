---
title: プロトコル層でのトランザクション検閲
original_title: Censoring Transactions at the Protocol Layer
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/censoring-transactions-at-the-protocol-layer/25531'
author: Leo_Glisic
date: '2026-07-24'
category: Uncategorized
tags:
  - censorship
  - protocol-design
  - governance
  - security
  - research
  - applications
topic_id: '25531'
translated_at: '2026-07-25'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Censoring Transactions at the Protocol Layer](https://ethresear.ch/t/censoring-transactions-at-the-protocol-layer/25531) — Leo_Glisic (2026-07-24)

イーサリアムには検閲のレバーが必要だ

悪い知らせを伝える役目を引き受けよう。

気に入らなければ私の首を刎ねても構わない。

しかし、イーサリアムがその夢を完全に実現するためには、自らをチェックする手段が必要だ。

それは「大いなる力には…うんぬんかんぬん」という類の話だ。

誰も話したがらない醜い真実、だから私が話すのだが、それは検閲だ。

[[glossary/Consensus-Layer|プロトコル層]]において。

もしイーサリアムに検閲する手段が**全く**なければ、ある国の大統領が死亡した場合に莫大な金銭を支払う[[glossary/Smart-Contract|スマートコントラクト]]を、たった**一人の馬鹿者**が書くだけで済んでしまう。

あるいは、他のどんな変種でもだ。

まだ実行されていないが、遅かれ早かれ、**誰か**がそれを実行するだろう。

そして私は、私たち全員の頭を砂の中から引き出すためにここにいる。

前進する道はある。

まず、イーサリアムプロトコルに対する[[glossary/governance|ガバナンス]]が解決されていると仮定しよう。それはまた別の無限のテーマだ。

しかし、それが解決されたとしよう。

そうすれば、先に挙げたような特定のケースにおいて、プロトコル層で検閲ルールを実装することが**可能になる**。

繰り返すが、[[glossary/governance|ガバナンス]]の部分が解決されていると仮定しての話だ。

私を信用してほしいと言っているのではない。これらは並行して進められる独立した研究分野であることを指摘しているのだ。

[[glossary/governance|ガバナンス]]側が何を決定しようと、その決定が[[glossary/decentralization|分散型]]であるかどうかにかかわらず、単一の合否として伝達されるだろう。そして検閲側は、そのことについて心配する必要はなく、特定の[[glossary/address|アドレス]]を検閲するという決定がなされたことを知るだけでよい。

プロトコル層でこれがどのように見えるかについて研究することは理にかなっている。

なぜなら、悪いニュースだけでなく、良いニュースにも備えることは良いことだからだ。

これはタブー視されてきたため、未開拓の研究分野だと私は考えている。

私は今、ここでそのタブーを破る。

私たちはこれを研究する必要がある。

なぜなら、誰でも1ペニーを寄付でき、それが100万ペニーに達したときに、どこかのドローンが飛んでホワイトハウスに突っ込むような[[glossary/Smart-Contract|スマートコントラクト]]を、どこかの馬鹿者がデプロイするのを許すわけにはいかないからだ。

そうだ。イーサリアムが大規模に採用され始めれば、誰かがそれを思いつくのに時間はかからないだろう。

だから、[[glossary/governance|ガバナンス]]側が[[glossary/decentralization|分散型]]であると仮定して、現実世界のシナリオで検閲が実際にどのように機能すべきかについて、今日から研究を開始してほしい。それは非常に価値のあることだ。

ありがとう

*13件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethresear.ch/t/censoring-transactions-at-the-protocol-layer/25531)
