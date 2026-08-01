---
title: 'EIP-8357: EVM検証鍵レジストリ'
original_title: 'EIP-8357: EVM Verification Key Registry'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8357-evm-verification-key-registry/29222'
author: donnoh
date: '2026-07-31'
category: EIPs
tags:
  - eips
  - eip
  - evm
  - protocol-design
  - scaling
  - rollup
  - cryptography
  - state-management
  - consensus
topic_id: '29222'
translated_at: '2026-08-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8357: EVM Verification Key Registry](https://ethereum-magicians.org/t/eip-8357-evm-verification-key-registry/29222) — donnoh (2026-07-31)

[EIP-8357](https://github.com/ethereum/EIPs/pull/12055)に関する議論トピック。

## **概要**

この[[glossary/EIP|EIP]]は、登録された各L1機能[[glossary/fork|フォーク]]に対する規範的な[[glossary/EVM|EVM]]検証鍵を含む固定アドレスのシステムコントラクトを作成します。各エントリは、1つの正確な検証鍵を、その鍵によってバインドされた[[glossary/fork|フォーク]]固有の[[glossary/EVM|EVM]]プログラムの有効化タイムスタンプにマッピングします。

このコントラクトは1つの `current_verification_key` を格納します。呼び出し元は、現在のエントリまたは正確な過去のエントリを取得できます。これにより、ネイティブ[[glossary/Rollup|ロールアップ]]はL1 [[glossary/EVM|EVM]]のアップグレードに自動的に追従したり、意図的に過去の[[glossary/EVM|EVM]][[glossary/fork|フォーク]]に留まったりすることができます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8357-evm-verification-key-registry/29222)
