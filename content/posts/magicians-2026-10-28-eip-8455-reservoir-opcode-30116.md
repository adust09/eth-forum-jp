---
title: 'EIP-8455: RESERVOIR オペコード'
original_title: 'EIP-8455: RESERVOIR Opcode'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8455-reservoir-opcode/30116'
author: ja7ad
date: '2026-10-28'
category: EIPs core
tags:
  - eips-core
  - eip
  - gas
  - evm
  - execution-layer
  - account-abstraction
  - security
  - protocol-design
  - reservoir-opcode
topic_id: '30116'
translated_at: '2026-10-29'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8455: RESERVOIR Opcode](https://ethereum-magicians.org/t/eip-8455-reservoir-opcode/30116) — ja7ad (2026-10-28)

議論トピック [EIP-8455](https://eips.ethereum.org/EIPS/eip-8455)

## 概要

[[glossary/EIP-8037|EIP-8037]]はガスを[[glossary/Execution-gas|実行ガス]]と[[glossary/State-gas|ステートガス]]に分割し、[[glossary/State-gas|ステートガス]]は`GAS`が報告しないリザーバーから支払われるようにします。[[glossary/EIP-8141|EIP-8141]]の[[glossary/Frame-Transactions|フレームトランザクション]]も同様にフレームごとの`state_gas_left`を持ちます。その結果、コントラクトは残りの予算全体を見ることができなくなり、2つの`gasleft()`読み取り値でサブコールを測定すると、リザーバーが支払った[[glossary/State-gas|ステートガス]]が過小評価されます。

この[[glossary/EIP|EIP]]は、`RESERVOIR` (`0x4d`) という1つのオペコードを追加します。これは、`GAS`に含まれない現在のフレームで利用可能な[[glossary/State-gas|ステートガス]]をスタックにプッシュします。

-   リザーバーモデルのトランザクション（[[glossary/EIP-8037|EIP-8037]]）の場合、フレームの`state_gas_reservoir`
-   [[glossary/EIP-8141|EIP-8141]][[glossary/Frame-Transactions|フレームトランザクション]]内では、フレームの`state_gas_left`

`GAS`と`RESERVOIR`を組み合わせることで、コントラクトは残りの予算全体を読み取り、[[glossary/State-gas|ステートガス]]を含むコード領域またはコールの全コストを測定できるようになります。

## 動機

2つの`gasleft()`読み取り値を減算してサブコールを測定するプロトコル（例: [[glossary/ERC-4337|ERC-4337]]の`EntryPoint`）は、リザーバーが支払うたびに[[glossary/State-gas|ステートガス]]を過小評価します。リザーバーがストレージスロットの資金を供給する場合、1つのストレージスロットを作成するコールは、`gas_left`が資金を供給する場合よりも**97,920ガス安く**見えます。[[glossary/EIP-8037|EIP-8037]]はこの点を指摘し、そのようなプロトコルに[[glossary/State-gas|ステートガス]]を明示的に考慮するよう求めていますが、現在、必要な値を公開する命令はありません。`RESERVOIR`がそれを公開します。

## 設計上の注意点

-   **オペコード `0x4d`。** ブロック/トランザクション環境範囲 (`0x40`–`0x4f`) に位置し、現在未割り当てです。`GAS` (`0x5a`) の隣に空きバイトはありません。
-   **`GAS`は再定義されません。** `GAS`が`gas_left + reservoir`を返すようにすると、`CALL`ガスの引数としての主要な用途が壊れます。これは`gas_left`の63/64に制限されているためです。また、デプロイ済みのコントラクトの挙動も変更されます。
-   **結合された命令ではなく、個別の命令。** 両方のプールを返す単一のオペコードは、`GAS`とのインターフェースの一貫性を保つために却下されました。[[glossary/State-gas|ステートガス]]制限を取る`CALL`のバリアントは、より大きな変更であり、後で`RESERVOIR`に基づいて構築できます。
-   **[[glossary/EIP-7702|EIP-7702]]。** 承認料金は最初のフレームの前に適用され、トップレベルのリバートによって補充されないため、委任されたコードは膨張した値を観測できません。

## セキュリティ上の考慮事項

-   `RESERVOIR`は`GAS`と同様にインクルージョンコンテキストに依存します。[[glossary/ERC-7562|ERC-7562]]の検証ルールは、[[glossary/ERC-4337|ERC-4337]]の検証中に`GAS`を制限し、**`RESERVOIR`も同様に制限すべきです**。
-   `RESERVOIR`に成功が依存するコントラクトは、`GAS`と同様に、十分な`tx.gas`値のセットを非単調にすることができ、ガス見積もりに影響を与えます。
-   [[glossary/State-gas|ステートガス]]の価格と[[glossary/Execution-gas|実行ガス]]/[[glossary/State-gas|ステートガス]]の分割は将来の[[glossary/fork|フォーク]]で変更される可能性があるため、コントラクトは期待される量をハードコードするのではなく、消費量を測定すべきです。

## リファレンス実装とテスト

[アセット](https://github.com/ethereum/EIPs/tree/master/assets/eip-8455)には、go-ethereumとexecution-specsのパッチ、およびリザーバーモデルと[[glossary/Frame-Transactions|フレームトランザクション]]の両方をカバーするテストフィラーが含まれています。

## 更新ログ

-   2026-10-23: 初版ドラフト、[PR #12577](https://github.com/ethereum/EIPs/pull/12577)

## 外部レビュー

2026-10-28現在なし。

## 未解決の課題

2026-10-28現在なし。

特に以下のフィードバックを歓迎します。

-   `0x4c`、`0x4e`、`0x4f`に対する保留中の提案を考慮した、`0x4d`の選択と他の空きバイトとの比較
-   [[glossary/ERC-4337|ERC-4337]] / [[glossary/ERC-7562|ERC-7562]]のメンテナーが検証時の制限について同意するかどうか
-   リザーバーのみを返すことで十分か、または結合されたビューも有用か

*6投稿 - 4参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8455-reservoir-opcode/30116)
