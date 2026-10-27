---
title: 'EIP-8456: CALLSTATUS命令'
original_title: 'EIP-8456: CALLSTATUS instruction'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8456-callstatus-instruction/30085'
author: svlachakis
date: '2026-10-26'
category: EIPs core
tags:
  - eips-core
  - eip
  - evm
  - execution-layer
  - gas
  - smart-contracts
  - protocol-design
topic_id: '30085'
translated_at: '2026-10-27'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8456: CALLSTATUS instruction](https://ethereum-magicians.org/t/eip-8456-callstatus-instruction/30085) — svlachakis (2026-10-26)

[[glossary/EIP|EIP（Ethereum 改善提案）]]ドラフトCALLSTATUSに関する議論トピック: [Add EIP: CALLSTATUS instruction by svlachakis · Pull Request #12586 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12586)

#### 更新ログ

-   2026-10-25: 初期ドラフト、[Add EIP: CALLSTATUS instruction by svlachakis · Pull Request #12586 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12586)
-   2026-10-25: オペコードを0x4Dから0xA5に移動。0x4Dは#12577で提案済みのため。

#### 外部レビュー

2026-10-26現在なし。

#### 未解決の課題

-   2026-10-26: オペコード番号。0xA5は利用可能と思われる。0x4Bから0x4Fはすべて提案中。
-   2026-10-26: 4（下位で停止を伴う成功）を公開するか、フラグがリバートのみに影響するようにするか。
-   2026-10-26: 記載されている58のテストケースに対するプロトタイプ実装と実行仕様テスト。
-   2026-10-26: コンパイラのインターフェース（例: Solidityのtry/catchで停止ビットを公開）。
-   2026-10-26: [[glossary/Frame-Transactions|EIP-8141フレームトランザクション]]が、完了したフレームに対してFRAMEPARAMを介して同じコードを公開すること。

* * *

#### 概要

新しい命令CALLSTATUS（暫定的に0xA5、2ガス）は、現在のフレームにおける直近の `CALL` / `CALLCODE` / `DELEGATECALL` / `STATICCALL` / `CREATE` / `CREATE2` の完了ステータスを3ビットでプッシュします。

-   ビット0 (1): 操作が[[glossary/Revert|リバート]]された、または開始されずにガスを返した
-   ビット1 (2): 操作が例外的に停止した、または転送するはずだったガスを消費して失敗した
-   ビット2 (4): 下位フレームの操作が例外的に停止した、または衝突した

発生する値: 0 成功、1 リバート、2 停止、4 下位で停止を伴う成功、5 下位で停止を伴うリバート。不変条件: ステータス >= 2 は、呼び出しチェーンのどこかで転送されたガスが例外的な停止またはアドレス衝突によって消費された場合にのみ真です。コード0/1/2はEIP-7069のものです。

#### 目的

失敗した呼び出しの後に継続するコントラクトは、トランザクション送信者がガスを選択することで引き起こせるガス不足 (out-of-gas) の失敗と、最終として記録できる意図的な[[glossary/Revert|リバート]]（ガス不足による妨害行為）を区別できなければなりません。今日、唯一の証拠は呼び出し後の `gasleft()` 算術演算であり、[[glossary/repricing|再価格設定]]の[[glossary/fork|フォーク]]は常にそのような閾値を破壊してきました。[[glossary/EIP-8037|EIP-8037]]の二次元ガスは、GASでは表示されず、クリアや[[glossary/Revert|リバート]]時に補充されるリザーバーを持つため、その証拠をさらに弱めます。[[glossary/EVM|EVM (イーサリアム仮想マシン)]]は、すべてのフレーム境界で結果を正確に把握しています。この命令はそれを公開するため、コントラクトはステータス >= 2 を「最終ではない」とみなし、[[glossary/gas-schedule|ガススケジュール]]に依存するのをやめることができます。

#### 仲介者

ほとんどの呼び出しは仲介者を経由します。プロキシ、理由付きで[[glossary/Revert|リバート]]するラッパー (OpenZeppelin Address.functionCall)、呼び出しを失敗させて継続させるバッチ (Multicall3)、失敗した呼び出しの後にfalseを返すチェック ([[glossary/ERC-1271|ERC-1271]]署名チェッカー) などです。もしステータスが直接の被呼び出し元自身の終了のみを報告した場合、これらすべてが停止を「意図的な[[glossary/Revert|リバート]]」に変えてしまうでしょう。そのため、各フレームはスティッキーな `halt_seen` フラグを保持し、その呼び出しのいずれかがステータス >= 2 で終了した場合に設定され、このフラグはすべてのフレーム完了、[[glossary/Revert|リバート]]、またはリターンを通じて上位に伝播します。したがって、ガスのみを制御する送信者は、呼び出しチェーンに停止を含む失敗に対して、呼び出し元に1を見せることはできません。

代償として、いくつかの意図的な失敗もビットを伝播します（低ガスプローブが停止し、その後無関係な[[glossary/Revert|リバート]]が発生した場合、5と読み取られる）。これは安全な方向であり、[[glossary/Revert|リバート]]データはまだ存在します。

#### この命令がしないこと

-   結果を報告し、原因は報告しません。被呼び出し元は、今日と同様に、`INVALID` を使って意図的に2を生成できます。
-   停止を伴わない `gasleft()` に依存する[[glossary/Revert|リバート]]は、送信者の制御下に留まります。停止として報告されたいガスガードは、`INVALID` を使用すべきであり、[[glossary/Revert|リバート]]すべきではありません。
-   現在の[[glossary/gas-schedule|ガススケジュール]]の下で固定ガス予算が適切であったかどうかは示しません。
-   この命令がデプロイされた後に書かれたコードを保護します。デプロイ済みのコントラクトはこれを読み取りません。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8456-callstatus-instruction/30085)
