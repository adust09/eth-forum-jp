---
title: 'ERC-8493: オンチェーンURIスキーム'
original_title: 'ERC-8493: Onchain URI Scheme'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8493-onchain-uri-scheme/30344'
author: nxt3d
date: '2026-11-11'
category: ERCs
tags:
  - ercs
  - applications
  - ux
  - eip
  - smart-contracts
  - metadata
topic_id: '30344'
translated_at: '2026-11-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8493: Onchain URI Scheme](https://ethereum-magicians.org/t/erc-8493-onchain-uri-scheme/30344) — nxt3d (2026-11-11)

[[ERC-8048]]と[[ERC-8049]]はメタデータをオンチェーンにキーと値のペアとして保存しますが、JSONドキュメントにはこれらの値を指すコンパクトな方法がありません。コントラクト、チェーン、およびトークンIDを名前で指定するURLは、クライアントがすでに知っていることを繰り返し、トークンごとに異なります。

[[ERC-8493]]は`onchain` URIスキームを定義します。コントラクトとトークンIDはURIに記述されず、ドキュメントを返した関数から取得されます。

```
{
  "image": "onchain:image/png",
  "thumbnail": {
    "small": "onchain:image/png?key=thumb.small"
  }
}
```

`onchain:image/png`は17バイトであり、すべてのトークンで変更なく機能します。URIが`tokenURI`または`uri`から来る場合、クライアントはERC-8048の`metadata(tokenId, key)`でそれを読み取り、`contractURI`から来る場合はERC-8049の`metadata(key)`で読み取ります。トップレベルドキュメントの直接のメンバーは自身の名前をキーとして使用し、それ以外の場所では`key`パラメータがその名前を指定します。

すでにデプロイされているトークンは、JSONに`metadata_contract`プロパティを追加することでこのスキームを使用できます。これはクライアントに別のメタデータコントラクトを指し示します。リンクされたJSONドキュメントは同じコントラクトとトークンを保持するため、全体が1つのデータツリーとして読み取られます。

このスキームはコントラクトのインターフェースを増やしません。既存のERC-8048およびERC-8049コントラクトは変更なしでこれをサポートし、このスキームを知らないクライアントは無視できるURIを見ることになります。

PR: [Add ERC: Onchain URI Scheme by nxt3d · Pull Request #2158 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/2158)

特にウォレット、マーケットプレイス、およびインデクサーからのフィードバックを歓迎します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8493-onchain-uri-scheme/30344)
