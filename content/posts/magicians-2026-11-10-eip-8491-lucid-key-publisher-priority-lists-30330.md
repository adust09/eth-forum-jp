---
title: 'EIP-8491: LUCID鍵発行者優先リスト'
original_title: 'EIP-8491: LUCID Key Publisher Priority Lists'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8491-lucid-key-publisher-priority-lists/30330
author: jannikluhn
date: '2026-11-10'
category: EIPs core
tags:
  - eips-core
  - eip
  - validators
  - consensus
  - execution-layer
  - security
  - protocol-design
topic_id: '30330'
translated_at: '2026-11-11'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8491: LUCID Key Publisher Priority Lists](https://ethereum-magicians.org/t/eip-8491-lucid-key-publisher-priority-lists/30330) — jannikluhn (2026-11-10)

#### 更新ログ

-   2026-11-10: [初回ドラフト](https://github.com/ethereum/EIPs/pull/12646)

#### 外部レビュー

2026年11月10日現在、なし。

#### 未解決の課題

2026年11月10日現在、なし。

#### 概要

この[[glossary/EIP|EIP（Ethereum 改善提案）]]は、[[glossary/LUCID|LUCID (EIP-8184)]]を、バリデータが管理する鍵発行者の優先リストで拡張します。このリスト上の発行者を使用するトランザクションは、他の封印されたトランザクションよりも先に実行され、鍵発行者の鍵リリースに関する選択性 (optionality) の影響を軽減します。発行者は、アクティブなバリデータの有効残高の過半数によってサポートされた場合にリストに含まれます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8491-lucid-key-publisher-priority-lists/30330)
