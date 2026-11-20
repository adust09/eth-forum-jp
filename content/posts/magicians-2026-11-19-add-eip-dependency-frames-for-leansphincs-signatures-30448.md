---
title: 'EIPの追加: leanSPHINCS署名のための依存関係フレーム'
original_title: 'Add EIP: Dependency frames for leanSPHINCS signatures'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/add-eip-dependency-frames-for-leansphincs-signatures/30448
author: ilitteri
date: '2026-11-19'
category: EIPs core
tags:
  - eips-core
  - eip
  - cryptography
  - signatures
  - account-abstraction
  - post-quantum
  - mempool
  - protocol-design
topic_id: '30448'
translated_at: '2026-11-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Add EIP: Dependency frames for leanSPHINCS signatures](https://ethereum-magicians.org/t/add-eip-dependency-frames-for-leansphincs-signatures/30448) — ilitteri (2026-11-19)

このスレッドは、新しい[[glossary/EIP|EIP（Ethereum 改善提案）]]ドラフトに関する議論のためのものです。

[github.com/ethereum/EIPs](https://github.com/ethereum/EIPs/pull/12672)

#### [EIPの追加: leanSPHINCS署名のための依存関係フレーム (#12672)](https://github.com/ethereum/EIPs/pull/12672)

`master` ← `lambdaclass:eip-leansphincs-dependency-frames`

公開 02:14PM - 17 Nov 26 UTC

 [![](https://avatars.githubusercontent.com/u/67517699?v=4) ilitteri](https://github.com/ilitteri)

[+53 \-0](https://github.com/ethereum/EIPs/pull/12672/files)

[[glossary/EIP-8288|EIP-8288]]が集約するインターフェースである依存関係検証フレームを通じて、[[glossary/EIP-8141|EIP-8141]]の[[glossary/Frame-Transactions|フレームトランザクション]]にネイティブな[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]署名を提供する[[glossary/EIP|EIP]]ドラフトを追加します。[…](https://github.com/ethereum/EIPs/pull/12672) - フレームはコードを実行せず、`(scheme, data_hash, verification_key_hash)` の依存関係を宣言します。[[glossary/leanSPHINCS|leanSPHINCS]]が唯一のスキームであり、フレームが署名の唯一の宣言です。 - 署名はトランザクションの一部ではありません。それらは[[glossary/Mempool|メムプール (Mempool)]]およびブロック内でトランザクションと並行して伝送され、すべてのノードが実行前にそれらを検証します。 - 後のアップグレードでは、[[glossary/EIP-8288|EIP-8288]]が行うように、署名ごとの証人を1つの集約証明に置き換えたり、トランザクションやアカウントを変更することなく、証明を依存関係として追加したりすることができます。このバージョンには、抽象と動機が含まれています。ネットワーク上およびブロック内での署名の伝送方法、[[glossary/EIP|EIP]]番号、議論スレッドを含む仕様はまだ作成中です。

## 概要

この[[glossary/EIP|EIP]]は、[[glossary/EIP-8288|EIP-8288]]が集約するインターフェースである依存関係検証フレームを通じて、[[glossary/EIP-8141|EIP-8141]]の[[glossary/Frame-Transactions|フレームトランザクション]]にネイティブな[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]署名を提供します。

- トランザクションは、依存関係検証フレームで依存する署名を宣言します。フレームはコードを実行しません。そのデータは `(scheme, data_hash, verification_key_hash)` のトリプルのリストであり、[[glossary/leanSPHINCS|leanSPHINCS]]が唯一のスキームです。
- 署名はトランザクションの一部ではありません。それは[[glossary/Mempool|メムプール (Mempool)]]およびブロック内でトランザクションと並行して伝送され、すべてのノードが実行前にネイティブに検証します。
- アカウントは `FRAMEPARAM` と `FRAMEDATACOPY` を使用して依存関係を読み取り、それらを承認します。

## 目的

[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]署名は7,740バイトです。このサイズに対する永続的な解決策は集約であり、各署名の代わりにブロックごとに1つの証明を使用することです。証明はまだすべてのブロックに対応できる状態ではありませんが、[[glossary/Post-Quantum|ポスト量子 (PQ)]]アカウントは、集約が最初から維持するインターフェースを必要とします。なぜなら、アカウントの検証コードが署名を探す場所を固定するからです。

この[[glossary/EIP|EIP]]はそのインターフェースを固定します。後のアップグレードでは、[[glossary/EIP-8288|EIP-8288]]が行うように、ブロックの署名を1つの集約証明に置き換えたり、証明などの他の依存関係の種類を、トランザクションやアカウントを変更することなく追加したりすることができます。フレームは署名の唯一の宣言であるため、何も二重に記述されることはありません。

## ステータス

ドラフトには抽象と動機が含まれています。仕様は作成中です。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/add-eip-dependency-frames-for-leansphincs-signatures/30448)
