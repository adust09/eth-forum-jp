---
title: 'EIP-8292: ポスト量子アテステーションアグリゲーター'
original_title: 'EIP-8292: PQ Attestation Aggregators'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8292-pq-attestation-aggregators/28778'
author: anshalshukla
date: '2026-06-12'
category: EIPs core
tags:
  - eips-core
  - eip
  - post-quantum
  - attestations
  - consensus
  - protocol-design
  - signatures
topic_id: '28778'
translated_at: '2026-06-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8292: PQ Attestation Aggregators](https://ethereum-magicians.org/t/eip-8292-pq-attestation-aggregators/28778) — anshalshukla (2026-06-12)

EIP-8292: ポスト量子アテステーションアグリゲーターに関する議論トピック
PR: [EIPの追加: Post-Quantum(PQ) Attestation Aggregators by anshalshukla · Pull Request #11777 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/11777)

**要約**
[[glossary/Post-Quantum|ポスト量子 (PQ)]] Ethereumは、BLS署名を、直接安価に集約できない、より大きな[[glossary/Hash-based-signatures|ハッシュベース署名]]に置き換えます。`L*` ハードフォークでは、新しいオプトインの**アグリゲーター**ロールが導入されます。これは、多数の[[glossary/Attestation|バリデータアテステーション]]を検証する簡潔な証明を生成する高スペックノードであり、この高コストな作業を[[glossary/Block-Building|ブロック構築]]から分離します。この[[glossary/EIP|EIP（Ethereum 改善提案）]]はアグリゲーターのロールを定義し、詳細な暗号学的および[[glossary/Consensus-Layer|コンセンサス層]]ルールは[[glossary/leanSpec|leanSpec]]の[[glossary/Consensus-Layer|コンセンサス層]]で指定されます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8292-pq-attestation-aggregators/28778)
