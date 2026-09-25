---
title: 新ERC：機密RWAトークン
original_title: 'New ERC: Confidential Real World Asset Token'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/new-erc-confidential-real-world-asset-token/29771
author: arr00
date: '2026-09-25'
category: ERCs
tags:
  - ercs
  - economics
  - defi
  - security
  - privacy
  - tokenomics
  - smart-contracts
  - eip
  - protocol-design
  - real-world-assets
  - confidential-tokens
topic_id: '29771'
translated_at: '2026-09-25'
translator: gemini-2.5-flash
---

> [!note] 原文
> [New ERC: Confidential Real World Asset Token](https://ethereum-magicians.org/t/new-erc-confidential-real-world-asset-token/29771) — arr00 (2026-09-25)

この[[ERC|ERC]]は、[[トークン化投資ファンド|トークン化されたリアルワールドアセット]]を定義するための最小限のインターフェースで、[[EIP-7984|ERC-7984]]を拡張します。これは、一対のプレーンテキスト適格性チェック、特定の転送が許可されているかどうかに答える機密検証関数、現在使用可能な残高の割合を示す機密数値、およびアクセス制限された強制転送を提供します。金額は全体を通して機密ポインターとして維持されます。この標準は、ミント、バーン、停止、凍結の動作を制約しますが、それらのインターフェースを義務付けるものではなく、発行および制限のメカニズムは実装に委ねられています。

フィードバックを歓迎します。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/2034)

#### [ERCの追加：機密リアルワールドアセットトークン (#2034)](https://github.com/ethereum/ERCs/pull/2034)

`master` ← `arr00:feat/add-confidential-rwa`

公開日時 01:51AM - 25 Sep 26 UTC

 [![arr00のアバター](https://avatars.githubusercontent.com/u/13561405?v=4) arr00](https://github.com/arr00)

[+191 \-0](https://github.com/ethereum/ERCs/pull/2034/files)

このPRは、機密[[RWAプラットフォーム (Real World Assetプラットフォーム)|RWAトークン]]向けにERC-[[EIP-7984|7984]]を拡張する新しいERCを追加します。EIP-7984と同様に、機密性は実装固有のポインターベースの機密システムによって維持されます。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/new-erc-confidential-real-world-asset-token/29771)
