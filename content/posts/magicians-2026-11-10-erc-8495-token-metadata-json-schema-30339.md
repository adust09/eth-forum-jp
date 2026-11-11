---
title: 'ERC-8495: トークンメタデータJSONスキーマ'
original_title: 'ERC-8495: Token Metadata JSON Schema'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8495-token-metadata-json-schema/30339'
author: ryanio
date: '2026-11-10'
category: ERCs
tags:
  - ercs
  - eip
  - applications
  - ux
  - protocol-design
  - smart-contracts
  - token-metadata
  - json-schema
topic_id: '30339'
translated_at: '2026-11-11'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8495: Token Metadata JSON Schema](https://ethereum-magicians.org/t/erc-8495-token-metadata-json-schema/30339) — ryanio (2026-11-10)

この提案は、[[glossary/ERC-721|ERC-721]]および[[glossary/ERC-6909|ERC-6909]]で`tokenURI`が、[[glossary/ERC-1155|ERC-1155]]で`uri`が返すJSONドキュメントを規定します。

ほとんどのデプロイ済みトークンはすでにこのフォーマットを使用していますが、その一部しかこれまで規定されていませんでした。[[glossary/ERC-721|ERC-721]]と[[glossary/ERC-1155|ERC-1155]]は`name`、`description`、`image`を定義しています。ウォレットやマーケットプレイスが表示するその他のすべて（`animation_url`、`attributes`とその`display_type`値、`external_url`、`background_color`）は、2018年にOpenSeaが公開したページに由来しています。クライアントはこれらのギャップを異なる方法で埋めるため、同じトークンでもアプリケーションによって表示が異なります。

ドラフト: [erc-draft\_token\_metadata\_json.md](https://github.com/ryanio/ERCs/blob/ryan/token-metadata-json/ERCS/erc-draft_token_metadata_json.md) ([ethereum/ERCs#2163](https://github.com/ethereum/ERCs/pull/2163))

このドラフトは以下をカバーしています。

-   すべてのフィールドとその型、使用中のすべての`display_type`値、およびブール値、引用符付き数値、ミリ秒単位の日付など、一致しない値に対してクライアントがどのように処理するか。
-   クライアントが解決しなければならないURIスキーム（`https`、`ipfs`、`ar`、`data`）、解決してもよいURIスキーム（`ipns`、および[[glossary/ERC-4804|ERC-4804]]からの`web3`）、そして決して解決してはならないURIスキーム。
-   フェッチ（取得）ルール：ゲートウェイURLの代わりに`ipfs://`URIを使用すること、`animation_url`内のHTMLをサンドボックス化すること、サーバーサイドのフェッチをプライベートアドレスから遠ざけること。
-   後の提案が古いクライアントを壊すことなくフィールドを追加する方法。

根拠（Rationale）では、2026年10月に行われた708のイーサリアムおよびBaseコントラクトの調査が引用されています。その中の204のIPFSゲートウェイURLのうち113は、記述通りにフェッチされた際に失敗し、`string`よりも多くのコントラクトが`display_type`として`text`を使用しています。このドラフトは両方を受け入れます。

ご意見をいただきたい質問：

1.  データURI。ドラフトはbase64を推奨しています。これは、エンコードされていないデータURLではフェッチが`#`以降をすべて破棄し、`#`を含むJSONを壊してしまうためです。クライアントはbase64を受け入れなければならず、エンコードされていないJSONも受け入れるべきです。これは適切な方針でしょうか？
2.  日付。クライアントは`date`値が`1000000000000`以上の場合、ミリ秒として読み取る可能性があります。これより低いカットオフを設定すると、`253402300800`（西暦10000年）が誤って読み取られることになります。これは一部のコントラクトで「期限なし」を意味するために使用されています。
3.  オンチェーン値。[[glossary/ERC-8048|ERC-8048]]の著者は、`"image": "onchain:image/png"`のように、フィールドを[[glossary/ERC-8048|ERC-8048]]またはERC-8049の下に保存された値を指す[`onchain:` URIスキーム](https://github.com/ethereum/ERCs/pull/2158)を提案しています。これが番号を取得すれば、このドラフトでは`web3`の隣にオプションのスキームとして記載されるでしょう。

付随する拡張機能として、トークンの3Dファイルをフォーマット（glTF、USDZ、VRM、STLなど）別にリストする`model_3d`フィールドが追加されます。この提案が番号を取得次第、別途投稿します。

ウォレット、マーケットプレイス、インデクサーチームからのフィードバックが最も役立ちます。このドラフトによって現在クライアントが行っていることで壊れるものがあれば、何でも教えてください。

著者: Devin Finzer, Alex Atallah, Ryan Ghods

*1 post - 1 participant*

[Read full topic](https://ethereum-magicians.org/t/erc-8495-token-metadata-json-schema/30339)
