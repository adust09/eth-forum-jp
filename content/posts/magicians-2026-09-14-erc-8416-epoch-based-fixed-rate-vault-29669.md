---
title: 'ERC-8416: エポックベース固定金利ボルト'
original_title: 'ERC-8416: Epoch-Based Fixed-Rate Vault'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8416-epoch-based-fixed-rate-vault/29669'
author: marcelomorgado
date: '2026-09-14'
category: ERCs
tags:
  - ercs
  - erc
  - defi
  - smart-contracts
  - protocol-design
  - tokenomics
  - economics
topic_id: '29669'
translated_at: '2026-09-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8416: Epoch-Based Fixed-Rate Vault](https://ethereum-magicians.org/t/erc-8416-epoch-based-fixed-rate-vault/29669) — marcelomorgado (2026-09-14)

この標準は、固定期間（エポック）および固定期間ボルトの仕様を定義します。
ボルトは、1つのエポック（すなわち、満期後に利息の発生を停止する）を持つことも、複数の連続した固定金利エポックを持つこともでき、これによりボルトの寿命と構成可能性（composability）が向上します。
ERC4626とERC7540の両方を柔軟に拡張することで、この標準は様々な同期/非同期スキーマをサポートします。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/2009)

#### [[glossary/ERC|ERC]]を追加: エポックベース固定金利ボルト](https://github.com/ethereum/ERCs/pull/2009)

`master` ← `marcelomorgado:fixed-rate-vault`

公開日時: 2026年9月14日 午前11時00分 UTC

 [![](https://avatars.githubusercontent.com/u/29674218?v=4) marcelomorgado](https://github.com/marcelomorgado)

[+600 \-0](https://github.com/ethereum/ERCs/pull/2009/files)

## 要約
- [[glossary/Draft|ドラフト]][[glossary/ERC|ERC]]「**エポックベース固定金利ボルト**」を追加
- 仕様ファイル: `[…](https://github.com/ethereum/ERCs/pull/2009)ERCS/erc-8416.md` ステータス: **ドラフト**。
## 議論
- 専用のMagiciansスレッド: https://ethereum-magicians.org/t/erc-8416-epoch-based-fixed-rate-vault/29669
## 著者
Marcelo Morgado (@marcelomorgado), Manoj Patidar (@patidarmanoj10), Rohit Solia (@rokso)

ご質問やコメントを歓迎します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8416-epoch-based-fixed-rate-vault/29669)
