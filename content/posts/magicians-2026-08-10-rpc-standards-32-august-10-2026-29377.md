---
title: 'RPC標準 #32、2026年8月10日'
original_title: 'RPC Standards # 32, August 10, 2026'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/rpc-standards-32-august-10-2026/29377'
author: system
date: '2026-08-10'
category: Protocol Calls & happenings
tags:
  - protocol-calls-and-happenings
  - rpc
  - execution-apis
  - eip
  - testing
  - protocol-design
  - governance
  - client-diversity
topic_id: '29377'
translated_at: '2026-08-12'
translator: gemini-2.5-flash
---

> [!note] 原文
> [RPC Standards # 32, August 10, 2026](https://ethereum-magicians.org/t/rpc-standards-32-august-10-2026/29377) — system (2026-08-10)

### 議題

### 議題

-   [eth: add example for eth\_simulateV1 by O1ahmad · Pull Request #863 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/863)
    *   eth: `eth_simulateV1` の例を追加
-   [fix: add slotNumber and targetGasLimit to testing\_buildBlockV1 by O1ahmad · Pull Request #862 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/862)
    *   修正: `testing_buildBlockV1` に `slotNumber` と `targetGasLimit` を追加
-   [Add the EIP-8141 frame transaction fields to the receipt by AnkushinDaniil · Pull Request #860 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/860)
    *   [[glossary/EIP-8141|EIP-8141]] [[glossary/Frame-Transactions|フレームトランザクション]]のフィールドをレシートに追加
-   [spec: allow EIP-1898 block objects in BlockNumberOrTagOrHash by MysticRyuujin · Pull Request #859 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/859)
    *   仕様: `BlockNumberOrTagOrHash` で [[glossary/EIP|EIP]]-1898 ブロックオブジェクトを許可
-   [testgen: fix duplicate test names and regenerate fixtures by MysticRyuujin · Pull Request #858 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/858)
    *   テスト生成: 重複するテスト名を修正し、フィクスチャを再生成

### Hive

-   [debug: specify callTracer output and add EIP-8037 two-dimensional gas to tracing by qu0b · Pull Request #852 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/852#issuecomment-5070264973)
    *   デバッグ: [[glossary/callTracer|callTracer (コールトレーサー)]] の出力を指定し、[[glossary/EIP|EIP]]-8037 [[glossary/two-dimensional-gas|二次元ガス]]をトレースに追加

#### これをマージする必要がある

-   [Add testing\_commitBlockV1 RPC Method by marcindsobczak · Pull Request #787 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/787)
    *   [[glossary/testingcommitBlockV1|testing_commitBlockV1 (ブロックコミットテストV1)]] RPCメソッドを追加
-   [testing: add testing\_commitBlockV1 spec, fixtures, and shared gas limit env by MysticRyuujin · Pull Request #801 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/801)
    *   テスト: [[glossary/testingcommitBlockV1|testing_commitBlockV1 (ブロックコミットテストV1)]] の仕様、フィクスチャ、共有ガス制限環境を追加

### 前回会議からの持ち越し

-   [eth/debug: specify block access list getter semantics by nerolation · Pull Request #851 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/851)
    *   eth/debug: ブロックアクセスリストゲッターのセマンティクスを指定
-   [eth: add eth\_subscribe and unsubscribe methods by s1na · Pull Request #797 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/797)
    *   eth: [[glossary/ethsubscribe|eth_subscribe (イーサリアム購読)]] および購読解除メソッドを追加
-   エラーコード: [error-groups: tx validation, execution and txpool error codes by s1na · Pull Request #823 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/823) / [error-groups, tools, tests: add spec-mandated error-code fixtures for methods by simsonraj · Pull Request #784 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/784)
    *   エラーグループ: トランザクション検証、実行、トランザクションプールのエラーコード
    *   エラーグループ、ツール、テスト: メソッドの仕様で義務付けられたエラーコードフィクスチャを追加

### エラーコードとリリース

-   ChaseのPRを現状のまま進め、エラーコードを分離したままにするか（前回のSimsonrajの提案通り）、エラーコードの議論が解決するまで待つか（823 / 784）？
-   v1.0.0-beta.8 をリリースできるか？最終リリースは6月10日だったが、エラーコードがリリースをブロックしているのか、それとも後のリリースで対応するのか？

**会議時間:** 2026年8月10日月曜日 15:00 UTC (60分)

[GitHubイシュー](https://github.com/ethereum/pm/issues/2185)

*3投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/rpc-standards-32-august-10-2026/29377)
