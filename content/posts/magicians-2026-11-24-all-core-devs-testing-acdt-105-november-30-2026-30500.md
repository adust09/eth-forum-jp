---
title: '全コア開発者会議 - テスト (ACDT) #105、2026年11月30日'
original_title: 'All Core Devs - Testing (ACDT) #105, November 30, 2026'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/all-core-devs-testing-acdt-105-november-30-2026/30500
author: system
date: '2026-11-24'
category: Protocol Calls & happenings
tags:
  - protocol-calls-and-happenings
  - research
  - testing
  - protocol-design
  - execution-layer
  - consensus
  - client-diversity
topic_id: '30500'
translated_at: '2026-11-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [All Core Devs - Testing (ACDT) #105, November 30, 2026](https://ethereum-magicians.org/t/all-core-devs-testing-acdt-105-november-30-2026/30500) — system (2026-11-24)

### 議題

### UTC日時

[2026年11月23日 14:00 UTC](https://savvytime.com/converter/utc/nov-23-2026/2pm)

### 議題

#### [[glossary/Glamsterdam|グラムステルダム]]

-   [[glossary/EIP|EIP]]-8037/[[glossary/EIP|EIP]]-8038のステータス
-   …

#### [[glossary/Hegota|ヘゴタ]]

-   [[glossary/Hegota|ヘゴタ]][[glossary/devnet|開発ネットワーク (devnet)]]のステータス: ボゴタ [[glossary/devnet|開発ネットワーク (devnet)]]-2、ヘゼ [[glossary/devnet|開発ネットワーク (devnet)]]-2
    -   …
-   ボゴタ [[glossary/devnet|開発ネットワーク (devnet)]] 3
    -   …

### [[glossary/EL-Breakout|ELブレイクアウト（実行層ブレイクアウト）]]

主導: [@danceratopz](https://ethereum-magicians.org/u/danceratopz)

-   [ethereum/execution-api](https://github.com/ethereum/execution-apis) [[glossary/Engine-API|エンジンAPI]]の仕様に関する質問 [@CPerezz](https://ethereum-magicians.org/u/cperezz) (先週の議題からの繰り越し、[All Core Devs - Testing (ACDT) #104, November 23, 2026 · Issue #2306 · ethereum/pm · GitHub](https://github.com/ethereum/pm/issues/2306#issuecomment-7102872859))。
    -   `consume-reorg` テストシミュレーター、[テストベクター形式](https://specs.ethereum.foundation/docs/execution-specs/running_tests/test_formats/blockchain_test_engine_reorg/)、および[テストスイート](https://specs.ethereum.foundation/docs/execution-specs/tests/reorg/)の実装中に仕様に関する疑問が生じました。
        -   [Issues · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/891):
            -   geth+nimbus VALID no-op
            -   besu+nethermind -38002
            -   reth -38006
        -   [Issues · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/892):
            -   besu -38002
            -   他の6つのクライアントはVALID
        -   [Issues · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/983):
            -   erigon -38006,
            -   nimbus SYNCING
            -   残りは適用される
    -   クライアントチームの皆様へ: さらに、[このgist](https://gist.github.com/danceratopz/74d4b271bcd0d22c817680b98d7cbf63#client-prs-and-issues)に記載されている未解決のPRとIssueを解決してください。

### [[glossary/CL-Breakout|CLブレイクアウト（コンセンサス層ブレイクアウト）]]

-   未定

**会議時間:** 2026年11月30日月曜日 14:00 UTC (90分)

[GitHub Issue](https://github.com/ethereum/pm/issues/2320)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/all-core-devs-testing-acdt-105-november-30-2026/30500)
