---
title: 'RPC標準 #34、2026年9月7日'
original_title: 'RPC Standards # 34, September 7th, 2026'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/rpc-standards-34-september-7th-2026/29605'
author: system
date: '2026-09-06'
category: Protocol Calls & happenings
tags:
  - protocol-calls-and-happenings
  - execution-layer
  - networking
  - protocol-design
  - research
  - testing
topic_id: '29605'
translated_at: '2026-09-07'
translator: gemini-2.5-flash
---

> [!note] 原文
> [RPC Standards # 34, September 7th, 2026](https://ethereum-magicians.org/t/rpc-standards-34-september-7th-2026/29605) — system (2026-09-06)

### 議題

-   [tests: update test chain to amsterdam, regenerate fixtures by MysticRyuujin · Pull Request #867 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/867)
    テスト: テストチェーンを[[glossary/Glamsterdam|グラムステルダム]]に更新、フィクスチャを再生成 by MysticRyuujin
-   [eth\_simulateV1: simulated block identity is undefined after Amsterdam · Issue #868 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/868)
    [[glossary/ethsimulateV1|eth_simulateV1]]: [[glossary/Glamsterdam|グラムステルダム]]以降、シミュレートされたブロックIDが未定義
-   [fix: add slotNumber and targetGasLimit to testing\_buildBlockV1 by O1ahmad · Pull Request #862 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/862)
    修正: `testing_buildBlockV1`に`slotNumber`と`targetGasLimit`を追加 by O1ahmad
-   [debug: specify callTracer output and add debug\_traceCall by MysticRyuujin · Pull Request #855 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/855)
    デバッグ: [[glossary/callTracer|callTracer]]の出力を指定し、`debug_traceCall`を追加 by MysticRyuujin
-   [engine: specify bit ordering for the 16-byte custody and cell bitarrays by edg-l · Pull Request #856 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/856)
    エンジン: 16バイトのカストディおよびセルビット配列のビット順序を指定 by edg-l
-   [eth\_createAccessList: clarify gas-fee affordability when fee fields omitted by MysticRyuujin · Pull Request #854 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/854)
    `eth_createAccessList`: 手数料フィールドが省略された場合のガス料金の支払可能性を明確化 by MysticRyuujin
-   [debug: add debug\_executionWitness spec by MysticRyuujin · Pull Request #847 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/847)
    デバッグ: [[glossary/debugexecutionWitness|debug_executionWitness]]仕様を追加 by MysticRyuujin
-   [Update Amsterdam ToC by jihoonsong · Pull Request #837 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/837)
    [[glossary/Glamsterdam|グラムステルダム]]目次を更新 by jihoonsong
-   [eth: add eth\_getRawTransactionBy\* methods to spec by manusw7 · Pull Request #836 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/836)
    eth: `eth_getRawTransactionBy*`メソッドを仕様に追加 by manusw7
-   [schemas: treat unresolvable safe and finalized tags as unknown blocks by MysticRyuujin · Pull Request #879 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/879)
    スキーマ: 解決不能な`safe`および`finalized`タグを不明なブロックとして扱う by MysticRyuujin
-   [eth: add eth\_getHeaderByHash and eth\_getHeaderByNumber by MysticRyuujin · Pull Request #877 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/877)
    eth: `eth_getHeaderByHash`と`eth_getHeaderByNumber`を追加 by MysticRyuujin
-   [eth: specify getLogs error for block ranges beyond head by MysticRyuujin · Pull Request #875 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/875)
    eth: `getLogs`におけるヘッドを超えるブロック範囲のエラーを指定 by MysticRyuujin
-   [schemas: clarify feeRecipient is not COINBASE by O1ahmad · Pull Request #873 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/873)
    スキーマ: `feeRecipient`が`COINBASE`ではないことを明確化 by O1ahmad
-   [schemas: add data as alias of input on GenericTransaction by O1ahmad · Pull Request #872 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/872)
    スキーマ: `GenericTransaction`の`input`のエイリアスとして`data`を追加 by O1ahmad
-   [getLogs improvements · Issue #876 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/876)
    `getLogs`の改善

Hive

-   [simulators/ethereum/rpc-compat: tracer-aware schema selection for speconly tests by MysticRyuujin · Pull Request #1588 · ethereum/hive · GitHub](https://github.com/ethereum/hive/pull/1588)
    シミュレーター/イーサリアム/RPC互換性: `speconly`テスト用のトレーサー認識型スキーマ選択 by MysticRyuujin

マージが必要な項目

-   [tests: update test chain to amsterdam, regenerate fixtures by MysticRyuujin · Pull Request #867 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/867)
    テスト: テストチェーンを[[glossary/Glamsterdam|グラムステルダム]]に更新、フィクスチャを再生成 by MysticRyuujin
-   [tests: add eth\_gasPrice and eth\_maxPriorityFeePerGas fixtures by magamongo · Pull Request #880 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/880)
    テスト: `eth_gasPrice`と`eth_maxPriorityFeePerGas`フィクスチャを追加 by magamongo

前回会議からの繰り越し項目

-   [spec: allow EIP-1898 block objects in BlockNumberOrTagOrHash by MysticRyuujin · Pull Request #859 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/859)
    仕様: [[glossary/BlockNumberOrTagOrHash|BlockNumberOrTagOrHash]]で[[glossary/EIP-1898|EIP-1898]]ブロックオブジェクトを許可 by MysticRyuujin
-   [debug: specify callTracer output and add EIP-8037 two-dimensional gas to tracing by qu0b · Pull Request #852 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/852)
    デバッグ: [[glossary/callTracer|callTracer]]の出力を指定し、[[glossary/EIP-8037|EIP-8037]]の[[glossary/two-dimensional-gas|二次元ガス]]をトレースに追加 by qu0b
-   [Add testing\_commitBlockV1 RPC Method by marcindsobczak · Pull Request #787 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/787)
    [[glossary/testingcommitBlockV1|testing_commitBlockV1]] RPCメソッドを追加 by marcindsobczak

リリース

-   v1.0.0-beta.8をリリースできますか？前回のリリースは6月10日でした

**会議時間:** 2026年9月7日月曜日 15:00 UTC (60分)

[GitHubイシュー](https://github.com/ethereum/pm/issues/2213)

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/rpc-standards-34-september-7th-2026/29605)
