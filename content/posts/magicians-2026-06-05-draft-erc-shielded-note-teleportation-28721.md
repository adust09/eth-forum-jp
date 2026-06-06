---
title: 'ドラフトERC: シールドされたノートのテレポート'
original_title: 'Draft ERC: Shielded Note Teleportation'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/draft-erc-shielded-note-teleportation/28721'
author: georgeh
date: '2026-06-05'
category: ERCs
tags:
  - ercs
  - protocol-design
  - privacy
  - eip
  - interoperability
  - zk
topic_id: '28721'
translated_at: '2026-06-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Draft ERC: Shielded Note Teleportation](https://ethereum-magicians.org/t/draft-erc-shielded-note-teleportation/28721) — georgeh (2026-06-05)

皆さん、こんにちは。

この度、新しい[[glossary/ERC|Ethereum Request for Comments (ERC)]]標準を提案します。皆様からのフィードバックを心よりお待ちしております。

[EIP-7503](https://eips.ethereum.org/EIPS/eip-7503)のZKワームホール (zkwormholes) の概念を改善し、他の方法で適用する実験中に、既存のTornado Cash、0xbowのPrivacy Pools、Railgunといったプライバシープロトコル (privacy protocols) 間でも相互運用性を可能にする方法を発見しました。ユーザーは、公開で引き出しや再入金を行うことなく、あるプライバシープロトコル (privacy protocols) から別のプライバシープロトコル (privacy protocols) へ資産を移動できます。これは、ユーザーがソースプール内で使用不可能なアドレスにバインドされた[[glossary/ZK-UTXO-note|ノート]]を作成し、そのバーンコミットメントがソースプールに含まれていることを検証することで、デスティネーションプロトコルにインポートできるようにすることで実現されます。

この[[glossary/ERC|Ethereum Request for Comments (ERC)]]は、アプリケーションレベルで任意のプライバシープロトコル (privacy protocols) がこれを実装し、他のプロトコルと相互運用できるように標準化することを目的としています。

結果として得られる興味深い利点：

-   **正の和のプライバシーセット (privacy set)** - シールドされた[[glossary/ZK-UTXO-note|ノート]]をプライバシープロトコル (privacy protocols) 間でテレポートすることで、デスティネーションプールのプライバシーセット (privacy set) を増加させ、ソースプールのプライバシーセット (privacy set) を減少させることはありません。これを実装する新しいプライバシープロトコル (privacy protocols) は、本質的に、より大規模な既存のプライバシープロトコル (privacy protocols) の匿名性を継承できます。
-   **後方互換性** - 既存のプライバシープロトコル (privacy protocols) から[[glossary/ZK-UTXO-note|ノート]]をテレポートすることが可能であり、それらのプロトコルがアップグレードする必要はありません。ただし、[[glossary/ZK-UTXO-note|ノート]]をバーンし、その[[glossary/ZK-UTXO-note|ノート]]の資産価値をプール内に実質的にロックするため、他の考慮事項が生じます。そのリスクは、プールがインポートをサポートするようにアップグレードするか、資産コントラクトに何らかの他のソリューションが実装されることで軽減できます。
-   **クロスチェーンの可能性** - 使用不可能な「バーン」アドレスは、リプレイ攻撃を防ぐためにデスティネーションプールのERC-20アドレスとチェーンIDにバインドされたハッシュですが、副次的に、デスティネーションプールが依存するカノニカルツリーによっては、クロスチェーンの[[glossary/ZK-UTXO-note|ノート]]テレポートもサポートできます。これにより、ユーザーはブリッジを利用することなく、あるプライバシープロトコル (privacy protocols) （またはプライバシーチェーン）から別のプロトコルへ資産をクロスチェーンで移動できます。

もう一つ言及すべき点は、ほとんどのプライバシープール (privacy pools) はイーサリアムと同じアドレス制限を設けていないため、バーンアドレスが20バイトではなく32バイトになり得るということです。これにより、より安全で衝突耐性が高まりますが、これは保証されず、デスティネーションプールの実装に依存します。これは技術的には、デスティネーションプールが許可すれば、公開トランザクションからの通常のEIP-7503スタイルのZKワームホール (zkwormholes) もサポートできます。そのため、「依存する」と述べています。

最後に、コンプライアンスについて言及したいと思います。希望する場合や義務付けられている場合、プライバシープロトコル (privacy protocols) は、他のプライバシープロトコル (privacy protocols) からテレポートされた[[glossary/ZK-UTXO-note|ノート]]をインポートする際に、コンプライアンス対策を実装できます。例えば、デスティネーションプールは、0xbowのようなAssociation Set Provider (ASP) を使用して、Tornado Cashに元々預け入れられた不正資金のテレポートされた[[glossary/ZK-UTXO-note|ノート]]をスクリーニングするかもしれません。この標準はその詳細には踏み込みませんが、コンプライアンスと相互排他的ではないことを言及したかったのです。しかし、意図しない結果として、ソースプールと同じ強制措置を課さないデスティネーションプールに[[glossary/ZK-UTXO-note|ノート]]をテレポートする場合、既存のコンプライアンス強制の一部を回避できる可能性もあります。ソースプールのコンプライアンス要件を尊重するか、あるいは独自の要件（もしあれば）を要求するかは、デスティネーションプールの選択に委ねられます。

考慮すべきリスクはいくつかありますが、ブリッジと大きく異なるわけではないものもあり、これはすべてのプライバシープロトコル (privacy protocols) に大きな利益をもたらし、すべての人のプライバシーを向上させると考えます。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1800)

#### [ERCの追加: シールドされたノートのテレポート](https://github.com/ethereum/ERCs/pull/1800)

`master` ← `geovgy:add-erc-shielded-note-teleportation`

公開 04:25PM - 06月26日 UTC

 [![](https://avatars.githubusercontent.com/u/54918343?v=4) geovgy](https://github.com/geovgy)

[+351 \-0](https://github.com/ethereum/ERCs/pull/1800/files)

これは、[[glossary/UTXO-based-privacy-protocols|UTXOベースのプライバシープロトコル]]間で、公開で[[glossary/unshielding|アンシールディング]]および[[glossary/re-shielding|リシールディング]]することなく、シールドされた[[glossary/ZK-UTXO-note|ノート]]をエクスポートおよびインポートする方法を標準化する[[glossary/ERC|Ethereum Request for Comments (ERC)]]のドラフト提案です。これにより、Tornado Cash、0xbowのPrivacy Pools、Railgunといった既存のプライバシープロトコル (privacy protocols) 間でも相互運用性が効果的に可能になります。その結果、この標準を実装するプライバシープロトコル (privacy protocols) が、他のプロトコルのプライバシーセット (privacy set) を減らすことなく、他のプライバシープロトコル (privacy protocols) からプライバシーセット (privacy set) を獲得できる、正の和のプライバシープリミティブが生まれます。これは、新しいプライバシープロトコル (privacy protocols) が、より弱いプライバシーを持つ孤立したプールを単独でブートストラップするのではなく、本質的に、より大規模な既存のプライバシープロトコル (privacy protocols) の結合された匿名性を継承できることを意味します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/draft-erc-shielded-note-teleportation/28721)
