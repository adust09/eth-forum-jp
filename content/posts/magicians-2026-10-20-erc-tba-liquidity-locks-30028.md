---
title: 'ERC-TBA: リキッドティロック'
original_title: 'ERC-TBA: Liquidity Locks'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-tba-liquidity-locks/30028'
author: priors-agents
date: '2026-10-20'
category: ERCs
tags:
  - ercs
  - erc
  - defi
  - tokenomics
  - smart-contracts
  - security
  - protocol-design
topic_id: '30028'
translated_at: '2026-10-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: Liquidity Locks](https://ethereum-magicians.org/t/erc-tba-liquidity-locks/30028) — priors-agents (2026-10-20)

「流動性はロックされている」は、すべてのローンチにおける安全性の物語であり、2つのロッカーが同じ方法でそれを語ることはありません。そのため、スキャナーやローンチパッドは、統合済みのロッカーの許可リストを保持しています。このドラフトは、プール流動性（v2プールトークン、v3およびv4ポジション）をロックするあらゆるコントラクトのための単一のインターフェースです。どのプールで、どれくらいの量、いつまで、誰のために、ロックされたポジションの手数料を誰が徴収するのか、イベント付きで、そしてロック数に応じてコストが増加しない`lockedLiquidity`（永続的、時間指定、最速アンロック）をプールごとに提供します。リリースは`unlockAt`以降にのみ、受益者に対してのみ行われ、ロックが保持する量を超えることはありません。これは、[[ERC-8376]]検出器が入力として受け取る数値（`lockedLiquidity`、`lockSinks`、`lpLockRemaining`）に名前を付け、検出器がそれらを信頼するのではなく、導出できるようにします。

-   リポジトリ: [GitHub - priors-agents/ERC-8454: Draft ERC: one interface for any contract that locks pool liquidity (v2 pool tokens, v3 and v4 positions), read by scanners, launchpads and lenders · GitHub](https://github.com/priors-agents/ERC-8454)

読者は、ロッカーを信頼する前に、そのロッカーがポジションを保持しており、早期に移動する経路がないことを確認します。このインターフェースは、その確認を統一するものであり、置き換えるものではありません。ロッカーオペレーターとスキャナーへの質問です。

1.  延長（受益者のみ、後日のみ）、リリース（誰でも、受益者へ）、手数料徴収（誰でも、手数料受取人へ）の3つの呼び出しを標準化するのが適切でしょうか？
2.  v4ポジションの場合、(PoolManager, poolId, positionId) でロックを識別するのに十分でしょうか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-tba-liquidity-locks/30028)
