---
title: 'ERC-8446: CCIP-Read向けクロスチェーンクライアントゲートウェイ'
original_title: 'ERC-8446: Cross-Chain Client Gateway for CCIP-Read'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8446-cross-chain-client-gateway-for-ccip-read/30345
author: nxt3d
date: '2026-11-11'
category: ERCs
tags:
  - ercs
  - eip
  - cross-chain
  - networking
  - applications
  - ux
  - protocol-design
topic_id: '30345'
translated_at: '2026-11-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8446: Cross-Chain Client Gateway for CCIP-Read](https://ethereum-magicians.org/t/erc-8446-cross-chain-client-gateway-for-ccip-read/30345) — nxt3d (2026-11-11)

[[glossary/CCIP-Read|ERC-3668 (CCIP-Read)]]は、コントラクトが読み取りをゲートウェイに委ねることを可能にしますが、そのゲートウェイは信頼できるものであるか、またはコントラクトが検証できる証明を返す必要があります。多くのクロスチェーン読み取りでは、有効な証明を生成できません。これは読み取りを安全でないものにするわけではありません。なぜなら、クライアントは通常、他のチェーンへの自身のRPC接続をすでに信頼しており、単に自身で呼び出しを行うことができるからです。

[[glossary/ERC-8446|ERC-8446]]は、クライアントがゲートウェイとして機能することを可能にします。コントラクトは通常通り`OffchainLookup`でリバートし、読み取るチェーンとコントラクトを指定する`x-chain` URLを含みます。クライアントはそのコントラクトを自身のRPCで呼び出し、`eth_call`が返すのと全く同じように結果をコールバックに渡します。第三者は関与しません。チェーンとアドレスはERC-7930 Interoperable Addressとしてエンコードされます。例えば、Base上のUSDCは以下のようになります。

```
x-chain:0x0001000002210514833589fcd6edb6e08f4c7c32d4f71b54bda02913
```

オプションの`?finalized=true`は、最新のブロックではなく、ファイナライズされたブロックで読み取りを行います。クライアントのみが、特定のチェーンを安全に読み取れるかどうかを決定し、コントラクトからRPCエンドポイントを受け取ることはありません。ネストされた`x-chain`ルックアップは追跡されないため、各呼び出しは最大で1つのクロスチェーンホップを行います。

コントラクトは、クライアントがこの[[glossary/ERC|ERC]]をサポートしていない場合も知ることができます。`x-chain` URLの後に`data:` URLを追加します。これは古いクライアントのみが到達し、単一バイト`0xff`をコールバックに配信します。これは実際のABIエンコードされた結果ではありえない値です。このERCはインターフェースを変更するものではなく、既存の`urls`リストにURLスキームを追加するだけです。

PR: [Add ERC: Cross-Chain Client Gateway for CCIP-Read by nxt3d · Pull Request #2078 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/2078)

特にクライアント側を実装するウォレット開発者やクライアント開発者からのフィードバックを歓迎します。

*3投稿 - 3参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8446-cross-chain-client-gateway-for-ccip-read/30345)
