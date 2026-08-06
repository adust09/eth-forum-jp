---
title: EIP-8358 アカウント変更のためのネットガスメータリング
original_title: EIP-8358 Net Gas Metering for Account Changes
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8358-net-gas-metering-for-account-changes/29304
author: rakita
date: '2026-08-05'
category: EIPs
tags:
  - eips
  - eip
  - gas
  - execution-layer
  - fee-market
  - protocol-design
  - state-management
topic_id: '29304'
translated_at: '2026-08-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8358 Net Gas Metering for Account Changes](https://ethereum-magicians.org/t/eip-8358-net-gas-metering-for-account-changes/29304) — rakita (2026-08-05)

# [[glossary/EIP|EIP]]-8358 アカウント変更のためのネットガスメータリングに関する議論トピック

[[glossary/EIP|EIP]] PR: [Add EIP: Net Gas Metering for Account Changes by rakita · Pull Request #12058 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12058)

#### 更新ログ

-   2026-08-05: 初稿

**概要 (Abstraction):**

この[[glossary/EIP|EIP]]は、ストレージに対して[[glossary/EIP|EIP]]-2200が確立したスキームを反映し、アカウント変更のためのネットガスメータリングを導入します。
[[glossary/Account|アカウント]]は、その残高 (balance) またはナンス (nonce) が[[glossary/transaction|トランザクション]]開始時の値と異なる場合に、変更されたとみなされます。
`CALL`および`CALLCODE`の価値転送コストである`CALL_VALUE`（[[glossary/EIP|EIP]]-8038で`ACCOUNT_WRITE + CALL_STIPEND`と定義されている）は、`CALL_VALUE_BASE_GAS`に置き換えられます。これは、奨励金に[[glossary/EIP|EIP]]-7708転送ログを加えたものとして項目化され、課金時に全額消費されます。これに加えて、[[glossary/transaction|トランザクション]]内でまだ残高 (balance) またはナンス (nonce) が変更されていない各変更済み[[glossary/account|アカウント]]に対して`CLEAN_BALANCE_CHANGE_GAS`が加算されます。既に変更済みのアカウントは何も追加しません。
転送によって[[glossary/account|アカウント]]が元の残高 (balance) に戻り、かつナンス (nonce) が変更されていない場合、`BALANCE_RESET_REFUND`が[[glossary/refund-counter|返金カウンター]]に追加され、価値を持つ呼び出しはその[[glossary/callee|呼び出し先]]を少なくとも`CALL_STIPEND`[[glossary/gas|ガス]]で実行します。2つの未変更[[glossary/account|アカウント]]間の転送は`8000`[[glossary/gas|ガス]]かかり、現在の実効コストと一致します。既に変更済みのアカウント間の転送は、ベースの`4000`[[glossary/gas|ガス]]のみかかります。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8358-net-gas-metering-for-account-changes/29304)
