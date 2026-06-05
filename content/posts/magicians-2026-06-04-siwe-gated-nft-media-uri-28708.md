---
title: SIWEで保護されたNFTメディアURIのERCドラフト
original_title: SIWE-Gated NFT Media URI
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/siwe-gated-nft-media-uri/28708'
author: FairNick
date: '2026-06-04'
category: ERCs
tags:
  - ercs
  - erc
  - nft
  - security
  - ux
  - smart-contracts
  - identity
topic_id: '28708'
translated_at: '2026-06-05'
translator: gemini-2.5-flash
---

> [!note] 原文
> [SIWE-Gated NFT Media URI](https://ethereum-magicians.org/t/siwe-gated-nft-media-uri/28708) — FairNick (2026-06-04)

# [[glossary/ERC|ERC（Ethereum Request for Comments）]]ドラフト: [[glossary/Sign-In-With-Ethereum|SIWE]]で保護されたNFTメディアURI

皆さん、こんにちは。

新しい[[glossary/ERC|ERC]]ドラフト「**[[glossary/Sign-In-With-Ethereum|SIWE]]で保護されたNFTメディアURI**」についてフィードバックをいただきたく思います。

コアとなるユースケースはシンプルです。ウォレットが公開NFTメタデータ内の `private_media_uri` を認識し、認可されたアカウントに[[glossary/Sign-In-With-Ethereum|SIWE]]チャレンジへの署名を要求します。その後、返されたプライベートな `image` を公開プレビューの代わりに表示します。この提案を実装していない既存のクライアントは、引き続き公開メタデータをレンダリングできます。

## 概要

提案されているメタデータ追加は、新しい公開メタデータフィールド1つです。

```
{
  "name": "Example NFT",
  "description": "Public description safe for unauthenticated clients.",
  "image": "https://example.com/public-preview.png",
  "private_media_uri": "https://media.example.com/eip-private-nft-media/8453/0xabc0000000000000000000000000000000000000/42"
}
```

ERC-721トークンは `tokenURI(tokenId)` を通じてこのJSONを公開します。ERC-1155トークンは、`uri(id)` によって返される既存のメタデータURIを通じてこれを公開します。

`private_media_uri` は発見のためのポインターに過ぎません。これは絶対HTTPS URIでなければならず、フラグメントや埋め込みユーザー情報を含んではならず、シークレット、ベアラートークン、アカウント固有のシークレット、またはプライベートメディアペイロードを含んではなりません。既存のクライアントはこれを無視し、公開 `image` のレンダリングを続行できます。

## ウォレットのフロー

主要なウォレットのユースケースは次のとおりです。

1.  ウォレットは通常のERC-721/ERC-1155メタデータを読み取り、公開 `image` をレンダリングします。
2.  ウォレットは `private_media_uri` を認識し、それをリクエストします。
3.  リソースサーバーは `WWW-Authenticate: SIWE` と `challenge_uri` を伴う `401 Unauthorized` を返します。
4.  ウォレットは所有者、保有者、またはその他の認可されたアカウントに[[glossary/Sign-In-With-Ethereum|SIWE]]メッセージへの署名を要求します。
5.  ウォレットは署名済み[[glossary/Sign-In-With-Ethereum|SIWE]]証明を付けて保護されたURIを再試行します。
6.  リソースサーバーは署名とトークン認可を検証し、`image` を含むプライベートJSONメタデータを返します。
7.  ウォレットはそのプライベート `image` をアンロックされたNFTメディアとしてレンダリングします。

ウォレットプロバイダーがこれを一度実装すれば、`private_media_uri` を検出し、[[glossary/Sign-In-With-Ethereum|SIWE]]アンロックフローを実行し、公開プレビューをプライベート `image` に置き換えることができるようにすることを意図しています。

## SIWEバインディング

[[glossary/Sign-In-With-Ethereum|SIWE]]チャレンジは、署名をリクエストされている正確なリソースにバインドします。チャレンジメッセージには、リソースサーバーのドメイン、リクエストされたプライベートメディアURI、トークンチェーンID、ナンス、有効期限、およびトークンスコープの[[glossary/Sign-In-With-Ethereum|SIWE]] `resources` エントリを含める必要があります。

```
eip155:{chainId}/{standard}:{contractAddress}/{tokenId}?account={account}&resource={privateMediaUri}
```

例:

```
eip155:8453/erc721:0xabc0000000000000000000000000000000000000/42?account=0x1230000000000000000000000000000000000000&resource=https%3A%2F%2Fmedia.example.com%2Feip-private-nft-media%2F8453%2F0xabc0000000000000000000000000000000000000%2F42
```

リソースサーバーは、コンテンツを提供する前に、[[glossary/Sign-In-With-Ethereum|SIWE]]メッセージ、署名、ナンス、有効期限、ドメイン、URI、チェーン、コントラクト、トークンID、アカウント、および正確なプライベートメディアURIを検証します。コントラクトアカウント署名にはEIP-1271が使用されます。

ERC-721の場合、バインドされたアカウントは現在の `ownerOf(tokenId)` でなければなりません。ERC-1155の場合、バインドされたアカウントは `balanceOf(account, id) > 0` でなければなりません。リソースサーバーは、独自のコンテンツポリシーがこれらの関係を認可として扱う場合、承認されたオペレーターまたはデリゲートもサポートできます。

## 追加リソース

同じ正確なリソースバインディングは、アンロックされたNFT画像以上のものを保護できます。例えば、保有者は、`private-image.png` やトークンの保護されたすべてのリソースへのアクセスを許可することなく、サードパーティサイトが `third-party-view.json` をフェッチすることを認可できます。この提案はグローバルな委任レジストリを定義するものではなく、保護されたURIがどのように発見され、[[glossary/Sign-In-With-Ethereum|SIWE]]認可がその正確なURIにどのようにスコープされるかを定義するだけです。

このドラフトは、既存のERC-721/ERC-1155メタデータ、[[glossary/Sign-In-With-Ethereum|SIWE]]、およびEIP-1271コントラクトアカウント署名に基づいて構築されています。新しいオンチェーンインターフェースは追加しません。

特に、`private_media_uri` が明確であるか、[[glossary/Sign-In-With-Ethereum|SIWE]]チャレンジフローがウォレットとメディアクライアントの期待に合致するか、そしてこれがウォレット、インデクサー、NFTプロジェクト、メディアサーバーが首尾一貫して実装するのに十分小さいかについてフィードバックをいただけると幸いです。

お読みいただきありがとうございます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/siwe-gated-nft-media-uri/28708)
