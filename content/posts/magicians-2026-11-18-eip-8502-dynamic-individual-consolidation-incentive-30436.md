---
title: 'EIP-8502: 動的な個別統合インセンティブ'
original_title: 'EIP-8502: Dynamic individual consolidation incentive'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8502-dynamic-individual-consolidation-incentive/30436
author: aelowsson
date: '2026-11-18'
category: EIPs core
tags:
  - eips-core
  - consensus
  - validators
  - staking
  - economics
  - protocol-design
  - eip
topic_id: '30436'
translated_at: '2026-11-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8502: Dynamic individual consolidation incentive](https://ethereum-magicians.org/t/eip-8502-dynamic-individual-consolidation-incentive/30436) — aelowsson (2026-11-18)

[[EIP|EIP（Ethereum 改善提案）]]-8502: 動的な個別統合インセンティブに関する議論トピック ([PR](https://github.com/ethereum/EIPs/pull/12673))。

#### 概要

[[イーサリアムバリデータ|イーサリアムバリデータ]]数が予定された目標を上回っている間は増加する、[[イーサリアムバリデータ|イーサリアムバリデータ]]ごとの残高控除によって統合を奨励する。

#### 関連リソース

TODO

### 要約

この[[EIP|EIP（Ethereum 改善提案）]]は、[[ステーク|ステーク]]保有者が自身の[[ステーク|ステーク]]をより少ない[[イーサリアムバリデータ|イーサリアムバリデータ]]に統合することを奨励し、投票の伝達と集約によるネットワーク負荷を軽減します。各エポックで、個別の統合インセンティブが[[イーサリアムバリデータ|イーサリアムバリデータ]]の残高から差し引かれます。これにより、追加の[[イーサリアムバリデータ|イーサリアムバリデータ]]ごとにプライベートなコストが発生し、[[ステーク|ステーク]]保有者がネットワークに課すパブリックコストを削減する動機を与えます。このインセンティブは32 ETHの[[イーサリアムバリデータ|イーサリアムバリデータ]]で最大となり、完全参加時の[[アテステーション（証明）|アテステーション（証明）]]報酬まで達し、実効残高に応じて線形に減少し、2048 ETHでゼロになります。したがって、統合によって削除される各[[イーサリアムバリデータ|イーサリアムバリデータ]]は、[[ステーク|ステーク]]保有者にとってほぼ同額の節約になります。プロトコルは、所定の期間にわたって目標[[イーサリアムバリデータ|イーサリアムバリデータ]]数を一定の割合で削減し、その後、最終目標値で固定します。インセンティブはゼロから始まり、[[イーサリアムバリデータ|イーサリアムバリデータ]]数が目標を上回っている間は徐々に増加し、下回っている間は10倍の速さで減少します。

*3投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8502-dynamic-individual-consolidation-incentive/30436)
