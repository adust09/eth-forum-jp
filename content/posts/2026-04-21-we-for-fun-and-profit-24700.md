---
title: 楽しさと利益のために
original_title: We for fun and profit
source_url: 'https://ethresear.ch/t/we-for-fun-and-profit/24700'
author: barryWhiteHat
date: '2026-04-21'
category: Uncategorized
tags:
  - zk
  - cryptography
  - privacy
  - smart-contracts
  - research
topic_id: '24700'
translated_at: '2026-05-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [We for fun and profit](https://ethresear.ch/t/we-for-fun-and-profit/24700) — barryWhiteHat (2026-04-21)

JayとZacとの楽しい議論に感謝します。

## はじめに

私たちは[[glossary/ZKP|ZKPs（ゼロ知識証明）]]で大いに楽しみました。そして、人々はFHE（完全準同型暗号）でも大いに楽しむだろうと考えています。私はそれに楽観的です。しかし、[[glossary/ZKP|ZKPs]]とWE（Witness Encryption）を組み合わせた何かをするのも楽しいだろうとも思っています。

WEはウィットネス暗号 (Witness Encryption) です。これは、一連の制約/プログラムを定義するZKPsのようなものです。しかし、ZKPsとは異なり、証明を生成する代わりに、秘密をあなたに開示します。

以前は、動的なものが出力できないためWEはつまらないと考えていました。しかし、今はそうは思っておらず、楽しいハックを使えば動的なものが出力できると考えています。しかし、その前にZKperpについて話す必要があります。

## ZKperp

パーペチュアル契約 (Perpetual Contracts) は一時期流行しました。しかし、私のトレーディング仲間は、自分のポジションが知られてしまい、破滅するだろうから、それを使って取引したくないと言っていました。ここで言うのは、オンチェーンのパーペチュアル契約のことです。

別の友人は、スラッシュ (slash) が可能だとプライベートな状態が漏洩するため、ZKPsではできないと言っていました。

そして、ここに最初の主要なトリックがあります。

```
So you encrypt what ever leverage position you want to take, place your collateral  all in ZKPs. Then you setup a WE box that if you become under collateralized the WE can be opened an your secret gets revealed and you forget slashed
```

</first trick>

では、私たちのWEプログラムは何をチェックしているのでしょうか？

1.  最近のイーサリアム (Ethereum) ブロックで、xの価格がyであること
2.  そのブロックがコンセンサス (consensus) によってファイナライズ (finalized) されていること
3.  その状況であなたのポジションが担保不足 (under collateralized) であること

これらすべてが真であれば、あなたはスラッシュされるべきです。そして、あなたの秘密があなたのポジションであり、あなたをスラッシュするために何らかのヘルパーが必要となるため、あなたはスラッシュされるでしょう。

## これは可能か

なるほど、これは面白いアイデアのようです。ここで基本的に行う必要がある、WE内でZKPsを検証することは、どれくらい実用的でしょうか？それほど高価ではありません [https://eprint.iacr.org/2020/889.pdf](https://eprint.iacr.org/2020/889.pdf) [https://eprint.iacr.org/2026/175.pdf](https://eprint.iacr.org/2026/175.pdf)

要約 (tl;dr)
「338 TBのサイズが得られる」
「全体として、ウィットネス暗号に対するこのアプローチは、非常にコストがかかるものの、現実的に実装可能であると結論付けます。」
「主要なウィットネス暗号プロトコルはO(N^3)でスケールする」
「部分集合和 (sub-set sum)」

## 投票

なるほど、これは面白いトリックのようです。ZKPsパーペチュアル契約ができますね。それはできると便利なことです。しかし、関数のごく一部にしか適用できません。いや、しかし、これ以上のものがあると思います。投票の例を挙げてみましょう。ああ、あなたは「これはうまくいかないだろう」と言うでしょうね。では、古いプログラムを取り上げて再適用してみましょう。

1.  イーサリアム (Ethereum) の状態を検証する
2.  すべての投票がオンチェーン (on-chain) に置かれたことを検証する
3.  それらを合計する。

ああ、3番で失敗します。それらを合計することはできません。なぜなら、それらは大きすぎるか、平文 (plain text) であり、その場合は誰も気にしません。あるいは、それらは暗号化されており、WEでは合計できないからです。

では、WEプログラムに何かを追加してみましょう。どうでしょうか？

1.  イーサリアム (Ethereum) の状態を検証する
2.  オンチェーン (on-chain) に置かれたすべての投票を取得する
3.  各投票を復号 (decrypt) する。それらを合計する
4.  もし「賛成」が「反対」より多ければ、秘密を開示する

この場合、秘密は `true` です。つまり、それは本当の秘密ではなく、単なる真偽フラグです。しかし、スマートコントラクト (smart contract) などによって検証可能にしたいのであれば、署名 (signature) に置き換えることもできます。

しかし、これはうまくいかないかもしれません。なぜなら、WEは、満足するウィットネス (witness) を得るまでは計算的に安全であると述べているからです。しかし、それを満足させるウィットネスを持っている場合、それを出力したプログラムについて遡って学習できる可能性があります。したがって、内部に秘密がある場合、その秘密が明らかになるかもしれません。

```
1. Verify the eth state 
2. Get all the votes that were put on chain
3. Homomorphically add up all the votes
4. The sum of homomorphically added votes where bigger than x
5. It decrypts it and checks x > quorum and if true returns 1 
```

</second trick>

洞察力のある方ならお気づきでしょうが、これは最初のスキームとまったく同じ問題を抱えています。もし私が単一の評価を得て、プログラム内の秘密を取得できるなら、内部で何が起こったかを知ることができます。ZKパーペチュアル契約の例では、出力のみを開示し、その後は何も学ぶことがないため、これは問題ありません。

## ワンタイムプログラム

つまり、これとブロックチェーン (blockchain) を組み合わせることで、一種のワンタイムプログラム (one-time program) を活用できます。大きな制限は、単一の呼び出し (invocation) の後も秘密が隠されていることを保証できないことです。元の論文ではそれができないと述べていますが、AADPの論文では、いくつかの評価を得ても内部で何が起こっているかを知ることはできないと述べています。これは証明を試みるのが楽しいことのように思えます。多くのものを解き放つでしょう。

## プライベートな状態に対する一般的なチェック

プライベートなスマートコントラクト (smart contract) エコシステムを構築しようとしているとしましょう。何かプライベートなものがある場合、それに対してチェックを実行できないという限界にぶつかるでしょう。それがZKパーペチュアル契約が難しい理由です。今では、このウィットネス暗号化 (witness encrypted) を使用して、それが真であれば何らかの秘密を返し、それに応じて何かを行うことでチェックを実行できます。

これは、「もしxならばyを実行する」という種類のスマートコントラクト (smart contract) に適用できます。

それは、「ZKPsだけでプライベートなUniswapは作れない」という私の古くからの敵を打ち破れるでしょうか？ [Why you can't build a private uniswap with ZKPs](https://ethresear.ch/t/why-you-cant-build-a-private-uniswap-with-zkps/7754)

問題は、誰かが預金するたびに、プールの総残高を更新する必要があることです。私たちは、単に秘密を復号 (decrypt) するというトリックを使うことができます。しかし、それはプールの残高を更新することを許しません。投票の例や私の2番目のトリックが失敗したのと同じ問題です。

## 結論

私たちは、ウィットネス暗号 (witness encryption) を使用するプライベートな `if / else` ループのようなものを持っています。これを使ってZKパーペチュアル契約を作ることができ、それは楽しくて有用なようです。様々なWEスキームが、満足するウィットネスが与えられたときに回路に関する情報を漏洩しないことを証明しようとすべきです。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/we-for-fun-and-profit/24700)
