---
title: 'EIP-8296: 固定カットオフによるステート階層化'
original_title: 'EIP-8296: Fixed-Cutoff State Tiering'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8296-fixed-cutoff-state-tiering/28772'
author: weiihann
date: '2026-06-11'
category: EIPs
tags:
  - eips
  - state-management
  - fee-market
  - state-expiry
  - protocol-design
topic_id: '28772'
translated_at: '2026-06-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8296: Fixed-Cutoff State Tiering](https://ethereum-magicians.org/t/eip-8296-fixed-cutoff-state-tiering/28772) — weiihann (2026-06-11)

## **要約**

この提案は、長期間変更されていないステートへの書き込みに課金（surcharge）するものです。`CUTOFF_BLOCK` を定義し、[[glossary/EIP|EIP]]-8188の`last_written_block`がこのカットオフを下回るアカウントまたはストレージスロットは、[[glossary/Inactive-state|非アクティブステート]]とみなされ、書き込みコストが増加します。それ以外のすべては[[glossary/Active-state|アクティブステート]]とみなされ、現在の価格設定が適用されます。[[glossary/Inactive-state|非アクティブステート]]はトライ（trie）内に留まるため、削除（eviction）や復活（resurrection）のメカニズムは不要です。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8296-fixed-cutoff-state-tiering/28772)
