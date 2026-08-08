---
title: 'EIP-8374: リバート後もウォームアクセスセットを保持'
original_title: 'EIP-8374: Persist Warm Access Sets Across Reverts'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8374-persist-warm-access-sets-across-reverts/29341
author: rakita
date: '2026-08-07'
category: EIPs core
tags:
  - eips-core
  - eip
  - execution-layer
  - gas
  - state-management
  - protocol-design
topic_id: '29341'
translated_at: '2026-08-08'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8374: Persist Warm Access Sets Across Reverts](https://ethereum-magicians.org/t/eip-8374-persist-warm-access-sets-across-reverts/29341) — rakita (2026-08-07)

EIP PR: [Add EIP: Persist Warm Access Sets Across Reverts by rakita · Pull Request #12128 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12128/changes)

概要:

[[glossary/EIP|EIP]]-2929は、アクセスされたアドレスとストレージキーをトランザクションスコープのセット `accessed_addresses` および `accessed_storage_keys` で追跡し、コールフレームがリバートまたは例外的に停止した場合、両セットをコール前の状態にロールバックします。この[[glossary/EIP|EIP]]は、このロールバックを削除します。一度アドレスまたはストレージキーがアクセスセットに追加されると、その後のリバートに関わらず、トランザクションの残りの期間、ウォーム状態を維持します。

*1件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8374-persist-warm-access-sets-across-reverts/29341)
