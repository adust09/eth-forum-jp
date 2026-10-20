---
title: 'RPC標準 #37、2026年10月19日'
original_title: 'RPC Standards # 37, October 19, 2026'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/rpc-standards-37-october-19-2026/30008'
author: system
date: '2026-10-19'
category: Protocol Calls & happenings
tags:
  - protocol-calls-and-happenings
  - rpc
  - execution-layer
  - networking
  - research
  - protocol-design
  - eip
  - client-diversity
topic_id: '30008'
translated_at: '2026-10-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [RPC Standards # 37, October 19, 2026](https://ethereum-magicians.org/t/rpc-standards-37-october-19-2026/30008) — system (2026-10-19)

### 議題

議題

-   [メタ: v1リリース追跡 · Issue #887 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/887)
-   [メソッド間で同一のトランザクション検証 (transaction-validation) 失敗モードに対する[[glossary/Ethereum-JSON-RPC-Specification|JSON-RPC]]エラーコードの不整合 · Issue #817 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/817)
-   [Parity trace_* APIとその出力形式の標準化 · Issue #890 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/890)
-   [機能(トレース): Parityトレースメソッドと出力スキーマ (schemas) by banteg · Pull Request #895 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/895)
-   [デバッグ: オペコードトレーサー (opcode tracer) のステップ状態タイミング (step state timing) と空フィールドの存在を定義 by MysticRyuujin · Pull Request #947 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/947)
-   [デバッグ: フレームがリバート (frame reverts) した後のオペコードトレーサー (opcode tracer) のストレージスナップショット (storage snapshot) · Issue #949 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/issues/949)
-   [テスト: `movePrecompileToAddress`なしでプリコンパイル (precompile) のコードをオーバーライドする[[glossary/ethsimulateV1|eth_simulateV1 (RPCメソッド)]]フィクスチャを追加 by BenWhite713 · Pull Request #931 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/931)
-   [スキーマ (schemas): `BlockOverrides.prevRandao`を`bytes32`として型定義 by Iamsohungrynow · Pull Request #941 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/941)
-   [スキーマ (schemas): `GenericCallTransaction.blobVersionedHashes`を配列にする by Iamsohungrynow · Pull Request #940 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/940)
-   [eth: [[glossary/ethcreateAccessList|eth_createAccessList (アクセスリスト作成RPC)]]の例で入力を使用 by O1ahmad · Pull Request #918 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/918)
-   [[glossary/Engine-API|エンジンAPI]]: ページ内リンクの破損を修正 by mikeua · Pull Request #943 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/943)
-   [[glossary/Engine-API|エンジンAPI]]: `ClientCode`リストに`ethlambda (LA)`を追加 by MegaRedHand · Pull Request #922 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/922)
-   [[glossary/ethgetLogsV2|eth_getLogsV2 (RPCメソッド)]]を追加 by bomanaps · Pull Request #900 · ethereum/execution-apis · GitHub](https://github.com/ethereum/execution-apis/pull/900)

**会議時間:** 2026年10月19日月曜日 15:00 UTC (60分)

[GitHub Issue](https://github.com/ethereum/pm/issues/2277)

*3件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/rpc-standards-37-october-19-2026/30008)
