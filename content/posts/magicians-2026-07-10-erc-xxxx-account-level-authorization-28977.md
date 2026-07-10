---
title: 'ERC-XXXX: アカウントレベル認証'
original_title: 'ERC-XXXX: Account level authorization'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-xxxx-account-level-authorization/28977'
author: rickzha610
date: '2026-07-10'
category: ERCs
tags:
  - ercs
  - eip
  - account-abstraction
  - smart-contracts
  - signatures
  - ux
  - defi
topic_id: '28977'
translated_at: '2026-07-10'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX: Account level authorization](https://ethereum-magicians.org/t/erc-xxxx-account-level-authorization/28977) — rickzha610 (2026-07-10)

スマートコントラクトアカウントに標準インターフェースを追加し、事前のオンチェーン承認なしに任意のリレイヤーが提出可能な、オフチェーン署名された[[glossary/EIP-712|EIP-712]]認証から[[glossary/ERC-20|ERC-20]]およびネイティブアセットの転送を実行します。アカウントは自身の署名検証ロジックで認証を検証するため、アカウントがサポートする任意の署名スキームを使用できます。これは[[glossary/ERC-3009|ERC-3009]]と同様の機能を提供することを意図しており、トークンレベルではなくアカウントレベルで実装されるため、任意の[[glossary/ERC-20|ERC-20]]トークンとネイティブ[[glossary/ETH|ETH]]で機能します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-xxxx-account-level-authorization/28977)
