---
title: 'ERC-8340: トランザクションメタデータエンコーディング'
original_title: 'ERC-8340: Transaction Metadata Encoding'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8340-transaction-metadata-encoding/29022'
author: chunter
date: '2026-07-15'
category: ERCs
tags:
  - ercs
  - eip
  - account-abstraction
  - execution-layer
  - smart-contracts
  - privacy
  - protocol-design
  - cryptography
topic_id: '29022'
translated_at: '2026-07-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8340: Transaction Metadata Encoding](https://ethereum-magicians.org/t/erc-8340-transaction-metadata-encoding/29022) — chunter (2026-07-15)

[[EIP|EIP]]-8130と連携するように設計されていますが、あらゆるトランザクションタイプ/トランスポートメソッドと互換性のあるメタデータエンコーディングに関する議論です。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1883)

#### [[ERC|ERC]]の追加: トランザクションメタデータエンコーディング

`master` ← `chunter-cb:erc-8130-metadata-encoding`

公開日 2026年7月15日 22:45 UTC

 [![](https://avatars.githubusercontent.com/u/133686793?v=4) chunter-cb](https://github.com/chunter-cb)

[+465 \-0](https://github.com/ethereum/ERCs/pull/1883/files)

## 概要
[[EIP|EIP]]-8130は、その[[Account-Abstraction|アカウント抽象化]]トランザクションタイプにオプションの不透明な`metadata`フィールドを追加しますが、バイトレイアウトは付随する仕様に委ねています。この[[ERC|ERC]]はそのレイアウトを定義します。`metadata`は単一の決定論的な[[CBOR|CBOR]]値です。具体的には、テキスト文字列（メモ）、バイト文字列（コミットメントダイジェスト）、予約済みキーのマップ（アトリビューション、メモ、コミットメント、スコープ）、またはこれらの配列のいずれかです。マップキーは[[ERC|ERC]]-8021スキーマ2と相互運用可能であり、オフチェーンコミットメント (offchain commitments) およびコールスコープ (call scoping) 用のキーで拡張されています。任意の値は、ソルト付きコミットメントによって再帰的に置き換えられる可能性があり、単一のプリミティブで選択的開示を提供します。この[[ERC|ERC]]はまた、オフチェーンの証明パッケージ、検証、および配信プロトコル、さらに`dataSuffix`に取って代わる[ERC-5792](https://github.com/ethereum/ERCs/blob/master/ERCS/erc-5792.md)の`metadata`機能も指定しています。

## 動機
[[EIP|EIP]]-8130の`metadata`フィールドは不透明なバイト列です。共有された構造がなければ、すべてのプロデューサーが独自のフレーミングを考案し、どのインデクサー (indexer) もそれらを横断して読み取ることができません。この[[ERC|ERC]]は、アトリビューション、メモ、コールごとのスコープ、およびオフチェーンデータへのプライバシーを保護するコミットメントをカバーする、コンパクトで決定論的な[[ERC|ERC]]-8021互換のエンコーディングを提供します。

## 注記
- 新しい[[ERC|ERC]]ドラフトです。`ERCS/`の下に単一のファイルが追加されます。
- [ERC-5792](https://github.com/ethereum/ERCs/blob/master/ERCS/erc-5792.md)および[[EIP|EIP]]-8130に依存します（`requires: 5792, 8130`）。
- 議論: https://ethereum-magicians.org/t/erc-transaction-metadata-encoding-for-eip-8130
[[EIP-Editor|EIPエディター]]が[[ERC|ERC]]番号を割り当てることを理解しています。PR番号に合わせてファイル名を変更します。

*1件の投稿 - 1名の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8340-transaction-metadata-encoding/29022)
