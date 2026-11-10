---
title: 'EIP-8487: 実行クレジットと請求クレジットの分離'
original_title: 'EIP-8487: Separate execution credits and billing credits'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8487-separate-execution-credits-and-billing-credits/30320
author: Giulio2002
date: '2026-11-09'
category: EIPs core
tags:
  - eips-core
  - eip
  - gas
  - fee-market
  - protocol-design
  - execution-layer
  - economics
topic_id: '30320'
translated_at: '2026-11-10'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8487: Separate execution credits and billing credits](https://ethereum-magicians.org/t/eip-8487-separate-execution-credits-and-billing-credits/30320) — Giulio2002 (2026-11-09)

これは[[glossary/EIP|EIP]]-8487（PR: [Add EIP: Separate execution credits and billing credits by Giulio2002 · Pull Request #12637 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12637)）に関する議論スレッドです。

この提案は、`tx.gasLimit`から初期化される2つのカウンターを導入します。

-   **クレジット**は従来の[[glossary/gas-schedule|ガススケジュール]]に従い、[[glossary/EVM|EVM (イーサリアム仮想マシン)]]が認識する唯一のガスです（GASオペコード、コール転送、作成）。
-   **請求**は新しいスケジュールに従い、トランザクション手数料を決定します。

請求が尽きると、クレジットが残っていてもトランザクション全体がアボート（捕捉不能）します。目標は、ガスを検査または転送するコントラクトの[[glossary/execution-behavior|実行挙動]]を変更することなく、オペコードを[[glossary/repricing|再価格設定]]できるようにすることです。

未解決の質問：正確なスケジュール、チャージポイント、リベートルール、レシートフィールド、および[[glossary/block-accounting|ブロック会計]]。フィードバックを歓迎します。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8487-separate-execution-credits-and-billing-credits/30320)
