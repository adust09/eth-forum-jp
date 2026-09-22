---
title: 'RPC標準 #35、2026年9月21日'
original_title: 'RPC Standards # 35, September 21, 2026'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/rpc-standards-35-september-21-2026/29742'
author: system
date: '2026-09-21'
category: Protocol Calls & happenings
tags:
  - protocol-calls-and-happenings
  - execution-layer
  - networking
  - research
  - protocol-design
  - verification
  - rpc-standards
  - api-specifications
topic_id: '29742'
translated_at: '2026-09-22'
translator: gemini-2.5-flash
---

> [!note] 原文
> [RPC Standards # 35, September 21, 2026](https://ethereum-magicians.org/t/rpc-standards-35-september-21-2026/29742) — system (2026-09-21)

### 議題

議題

-   [eth\_simulateV1: simulated block identity is undefined after Amsterdam · Issue #868 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/868)
    -   [[glossary/ethsimulateV1|eth_simulateV1]]：[[glossary/Glamsterdam|グラムステルダム]]以降、シミュレートされたブロックIDが未定義である問題
-   [eth\_simulateV1: behavior of blockOverrides.difficulty and unknown override keys is unspecified · Issue #883 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/883)
    -   [[glossary/ethsimulateV1|eth_simulateV1]]：`blockOverrides.difficulty` の挙動と未知のオーバーライドキーが未指定である問題
-   [tests: update test chain to amsterdam, regenerate fixtures by MysticRyuujin · Pull Request #867 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/867)
    -   テスト：テストチェーンを[[glossary/Glamsterdam|グラムステルダム]]に更新し、フィクスチャを再生成 (MysticRyuujinによる)
-   [eth: add eth\_getHeaderByHash and eth\_getHeaderByNumber by MysticRyuujin · Pull Request #877 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/877)
    -   eth：[[glossary/ethgetHeaderByHash|eth_getHeaderByHash]]と`eth_getHeaderByNumber`を追加 (MysticRyuujinによる)
-   [getLogs improvements · Issue #876 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/876)
    -   [[glossary/getLogs|getLogs]]の改善
-   [Simulation methods: fields whose EIP is not active at the target block · Issue #884 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/884)
    -   シミュレーションメソッド：ターゲットブロックで[[glossary/EIP|EIP（Ethereum 改善提案）]]がアクティブでないフィールドに関する問題
-   [eth: accept a block hash in eth\_estimateGas and eth\_createAccessList by MysticRyuujin · Pull Request #889 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/889)
    -   eth：`eth_estimateGas`と`eth_createAccessList`でブロックハッシュを受け入れるように変更 (MysticRyuujinによる)
-   [eth: document block parameter default and post-execution state by MysticRyuujin · Pull Request #888 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/888)
    -   eth：ブロックパラメータのデフォルトと実行後状態を文書化 (MysticRyuujinによる)
-   [engine\_forkchoiceUpdated: evaluation order of the no-reorg shortcut vs -38002 / -38006 is unspecified · Issue #891 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/891)
    -   `engine_forkchoiceUpdated`：リorgなしショートカットと-38002 / -38006のエラーコードの評価順序が未指定である問題
-   [ForkchoiceStateV1: is a zero safeBlockHash legal after finality, and does a zero value overwrite the stored marker? · Issue #892 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/892)
    -   `ForkchoiceStateV1`：[[glossary/finality|ファイナリティ]]後にゼロの`safeBlockHash`が有効か、またゼロ値が保存されたマーカーを上書きするかどうか
-   [Standardizing the Parity trace\_\* APIs and their output formats · Issue #890 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/890)
    -   Parity `trace_*` APIとその出力フォーマットの標準化
-   [meta: tracking v1 release · Issue #887 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/887)
    -   メタ：v1リリースの追跡

#### Hive

-   [simulators/ethereum/rpc-compat: tracer-aware schema selection for speconly tests by MysticRyuujin · Pull Request #1588 · ethereum/hive · GitHub](https://github.com/ethereum/hive/pull/1588)
    -   `simulators/ethereum/rpc-compat`：specのみのテストにおけるトレーサー対応スキーマ選択 (MysticRyuujinによる)
-   [tools: add support for validation scripts in test files by fjl · Pull Request #893 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/893)
    -   ツール：テストファイルでの検証スクリプトのサポートを追加 (fjlによる)

#### Blocked Check-in

-   [debug: specify callTracer output and add debug\_traceCall by MysticRyuujin · Pull Request #855 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/855)
    -   デバッグ：[[glossary/callTracer|callTracer]]の出力を指定し、[[glossary/debugtraceCall|debug_traceCall]]を追加 (MysticRyuujinによる)
-   [fix: add slotNumber and targetGasLimit to testing\_buildBlockV1 by O1ahmad · Pull Request #862 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/862)
    -   修正：`testing_buildBlockV1`に`slotNumber`と`targetGasLimit`を追加 (O1ahmadによる)
-   [eth\_createAccessList: clarify gas-fee affordability when fee fields omitted by MysticRyuujin · Pull Request #854 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/854)
    -   `eth_createAccessList`：料金フィールドが省略された場合のガス料金の支払能力を明確化 (MysticRyuujinによる)
-   [debug: specify callTracer output and add EIP-8037 two-dimensional gas to tracing by qu0b · Pull Request #852 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/852)
    -   デバッグ：[[glossary/callTracer|callTracer]]の出力を指定し、[[glossary/EIP-8037|EIP-8037 (二次元ガス)]]の[[glossary/two-dimensional-gas|二次元ガス]]をトレースに追加 (qu0bによる)
-   [engine: specify bit ordering for the 16-byte custody and cell bitarrays by edg-l · Pull Request #856 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/856)
    -   エンジン：16バイトの[[glossary/custody-and-cell-bitarrays|カストディおよびセルビット配列]]のビット順序を指定 (edg-lによる)
-   [debug: add debug\_executionWitness spec by MysticRyuujin · Pull Request #847 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/847)
    -   デバッグ：[[glossary/debugexecutionWitness|debug_executionWitness]]の仕様を追加 (MysticRyuujinによる)
-   [spec: allow EIP-1898 block objects in BlockNumberOrTagOrHash by MysticRyuujin · Pull Request #859 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/859)
    -   仕様：[[glossary/BlockNumberOrTagOrHash|BlockNumberOrTagOrHash]]で[[glossary/EIP-1898|EIP-1898 (ブロック識別子)]]ブロックオブジェクトを許可 (MysticRyuujinによる)
-   [eth: add eth\_getRawTransactionBy\* methods to spec by manusw7 · Pull Request #836 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/836)
    -   eth：`eth_getRawTransactionBy*`メソッドを仕様に追加 (manusw7による)

**会議時間:** 2026年9月21日月曜日 15:00 UTC (60分)

[GitHub Issue](https://github.com/ethereum/pm/issues/2228)

*3投稿 - 1参加者*

[全トピックを読む](https://ethereum-magicians.org/t/rpc-standards-35-september-21-2026/29742)
