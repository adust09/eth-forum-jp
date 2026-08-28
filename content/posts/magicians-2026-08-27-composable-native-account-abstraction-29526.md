---
title: 構成可能なネイティブアカウント抽象化
original_title: Composable Native Account Abstraction
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/composable-native-account-abstraction/29526'
author: pedrouid
date: '2026-08-27'
category: EIPs core
tags:
  - eips-core
  - account-abstraction
  - eip
  - execution-layer
  - smart-contracts
  - gas
  - protocol-design
topic_id: '29526'
translated_at: '2026-08-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Composable Native Account Abstraction](https://ethereum-magicians.org/t/composable-native-account-abstraction/29526) — pedrouid (2026-08-27)

このスレッドでは、3つの構成可能なコア[[EIP|EIP（Ethereum 改善提案）]]について説明します。

-   **EIP-8398:** アクター、認証器、アカウント設定、作成、およびポータビリティを定義するポータブルアカウントキーストア。
-   **EIP-8399:** [[EIP-8398]]の認証モデルを使用する基本的なネイティブ[[アカウント抽象化 (AA)|アカウント抽象化 (AA)]]トランザクションで、バッチ処理、スポンサーシップ、および[[キー付きNonce (Keyed Nonces)|キー付きNonce]]をサポートします。
-   **EIP-8400:** 同じ[[トランザクションエンベロープ|トランザクションエンベロープ]]を使用し、ポリシー、アカウントロック、およびNonceフリーのトランザクションを追加するオプションの高度な制御機能。

この分離により、アカウントの認証はトランザクションの転送から独立しつつ、チェーンがネイティブおよび高度な機能を段階的にサポートできるようになります。EIP-8130は変更されません。

すべてのフィードバックを歓迎します。以下のPRに直接コメントしてください。

[github.com/ethereum/EIPs](https://github.com/ethereum/EIPs/pull/12248)

#### [[EIP|EIP（Ethereum 改善提案）]]: 構成可能なネイティブ[[アカウント抽象化 (AA)|アカウント抽象化 (AA)]]を追加](https://github.com/ethereum/EIPs/pull/12248)

`master` ← `pedrouid:codex/split-eip-8130-keystore-core`

公開日時 05:03AM - 27 Aug 26 UTC

 [![pedrouidのアバター](https://avatars.githubusercontent.com/u/10136079?v=4) pedrouid](https://github.com/pedrouid)

[+1317 \-0](https://github.com/ethereum/EIPs/pull/12248/files)

## 要約 ポータブルなアカウント認証、基本的なネイティブ[[アカウント抽象化 (AA)|アカウント抽象化 (AA)]]、およびオプションの[…](https://github.com/ethereum/EIPs/pull/12248)高度な制御を分離します。 - **EIP-8398:** ポータブルキーストア、アクター、認証器、アカウント作成、および設定。 - **EIP-8399:** [[EIP-8398]]を必要とし、ネイティブな `0x79` トランザクション、[[キー付きNonce (Keyed Nonces)|キー付きNonce]]、バッチ処理、スポンサーシップ、ガス、およびRPCルールを追加します。 - **EIP-8400:** [[EIP-8398]]と[[EIP-8399]]を必要とし、同じ `0x79` [[トランザクションエンベロープ|トランザクションエンベロープ]]を使用して、ポリシー、アカウントロック、およびNonceフリーのトランザクションを追加します。

*2件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/composable-native-account-abstraction/29526)
