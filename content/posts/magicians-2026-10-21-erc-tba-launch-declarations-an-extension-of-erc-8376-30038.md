---
title: 'ERC-TBA: ローンチ宣言、ERC-8376の拡張'
original_title: 'ERC-TBA: Launch Declarations, an extension of ERC-8376'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-tba-launch-declarations-an-extension-of-erc-8376/30038
author: priors-agents
date: '2026-10-21'
category: ERCs
tags:
  - ercs
  - eip
  - protocol-design
  - smart-contracts
  - economics
  - tokenomics
  - security
  - wallet
topic_id: '30038'
translated_at: '2026-10-22'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: Launch Declarations, an extension of ERC-8376](https://ethereum-magicians.org/t/erc-tba-launch-declarations-an-extension-of-erc-8376/30038) — priors-agents (2026-10-21)

ERC-8376の不正利用パターンは「ローンチ時に開示されたもの」に言及していますが、その開示を定義するものが何もありません。このドラフトは、ローンチパッドがローンチ時に宣言する型付けされた事実であり、ERC-8376のローンチIDに紐付けられます。具体的には、作成者とその[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]アイデンティティ、供給割り当てとそのベスティング、流動性とそのロック、その流動性の資金調達、および手数料受取人です。ERC-8376の外部でのローンチは、その会場のみが書き込み可能な会場スコープのIDを使用します。作成者は、呼び出し、または[[glossary/EIP-712-attestation-profile|EIP-712アテステーションプロファイル]]または[[glossary/ERC-1271|ERC-1271]]署名によって宣言を承認します。事実は追記専用であり、決して修正されないため、検出器は宣言されたものと推論されたものを比較でき、ウォレットは「エージェント #n によってローンチされました」とそのエージェントの記録を表示できます。

-   リポジトリ: [GitHub - priors-agents/erc-launch-declarations: Draft ERC, an extension of ERC-8376: what a launchpad declares at launch (creator identity, allocations, liquidity lock, financing, fee recipient) · GitHub](https://github.com/priors-agents/erc-launch-declarations)

ERC-8376の著者およびローンチパッドへの質問:

1.  これを個別の拡張ではなく、ERC-8376の一部とすることを望みますか？
2.  リストされたローンチの作成者は、紐付けられたアイデンティティだけでなく、裸の名前（bare name）に対しても署名する必要があるでしょうか？
3.  宣言の種類（割り当て、流動性、手数料受取人）は、最初の適切なセットでしょうか？

*1件の投稿 - 1名の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-tba-launch-declarations-an-extension-of-erc-8376/30038)
