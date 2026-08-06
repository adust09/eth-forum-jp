---
title: 'EIP-8368: 新しいガス制限のためのCPSB再較正'
original_title: 'EIP-8368: CPSB Recalibration for New Gas Limit'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8368-cpsb-recalibration-for-new-gas-limit/29293
author: misilva73
date: '2026-08-05'
category: EIPs core
tags:
  - eips-core
  - eip
  - execution-layer
  - fee-market
  - protocol-design
  - state-management
topic_id: '29293'
translated_at: '2026-08-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8368: CPSB Recalibration for New Gas Limit](https://ethereum-magicians.org/t/eip-8368-cpsb-recalibration-for-new-gas-limit/29293) — misilva73 (2026-08-05)

# [[glossary/EIP-8368|EIP-8368]]: 新しいガス制限のためのCPSB再較正に関する議論

[[glossary/EIP-8368|EIP-8368]]に関する議論トピック

#### 概要

この提案は、[[glossary/EIP-8037|EIP-8037]]で導入された新しいステートバイトあたりの単位ガス料金である`CPSB`（ステートバイトあたりのコスト）を、新しい参照ブロックガス制限に合わせて再導出することで更新します。[[glossary/EIP-8037|EIP-8037]]で定義されているその他のすべてのパラメータ、メカニズム、およびセマンティクスは影響を受けず、変更されません。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8368-cpsb-recalibration-for-new-gas-limit/29293)
