---
title: 'ERC-TBA: エージェント信用枠'
original_title: 'ERC-TBA: Agent Credit Lines'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-tba-agent-credit-lines/30023'
author: priors-agents
date: '2026-10-20'
category: ERCs
tags:
  - ercs
  - erc
  - account-abstraction
  - defi
  - applications
  - smart-contracts
  - economics
  - agentic-commerce
topic_id: '30023'
translated_at: '2026-10-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: Agent Credit Lines](https://ethereum-magicians.org/t/erc-tba-agent-credit-lines/30023) — priors-agents (2026-10-20)

[[ERC-8004|ERC-8004]]エージェントへの貸し手が現れており、それぞれが独自のABIを持っているため、すべてのウォレット、支払いクライアント、およびMCPサーバーは、各貸し手を個別に統合しています。このドラフトは、エージェントの[[IDENTITY_SENTINEL|アイデンティティ]]に対するリボルビング信用枠のための、貸し手にとらわれない単一のインターフェースです。具体的には、アイデンティティが現在いくら借りられるか（`availableCredit`）、借り入れにかかる費用（`quote`）、手数料上限付きで借り入れる方法（`borrow`）、それを閉じるための金額（`amountDue`）、返済方法（誰でも可能）、および延滞時にデフォルトとマークする方法（誰でも可能）を定義します。`Borrowed`、`Repaid`、`Defaulted`の3つのイベントがすべてのローンを記録するため、信用情報リーダーは、1つのABIを通じて、準拠する任意の貸し手と連携できます。各ローンは、借り入れ時のアイデンティティの所有者を記録し、デフォルト時にはその所有者を指定します。

-   リポジトリ（テキスト、インターフェース、参照貸し手、Foundryテスト、CIでのeipw lint）：[GitHub - priors-agents/ERC-8450: Draft ERC: one interface for revolving credit to agent identities (quote, borrow, repay, default), so any client works with any conforming lender · GitHub](https://github.com/priors-agents/ERC-8450)

既存のものとの違い：[[ERC-7565]]はNFTを担保としてロックし、デフォルト時に貸し手に渡しますが、ここではアイデンティティは担保ではなく、デフォルトはその所有者をマークします。[[EIP-6882]]（クローズ済み）は、ローンID、条件、デフォルトのない担保付きプール債務に対して1つの借り入れABIを持っていました。[[ERC-3156]]のローンは同じトランザクション内でクローズします。

特に、インターフェースを自身のコントラクトと照合するために、エージェントへの2番目の貸し手からの確認を希望しています。質問：

1.  `isController`（所有者または承認されたデリゲート）は、ウォレットやエージェントランタイムにとって適切なフックでしょうか？
2.  信用枠に対する所有者の同意（誰がそれを裏付け、最大でいくら請求できるかを指定する[[EIP-712|EIP-712]]メッセージ）は、コアの一部であるべきか、それともドラフトのように別の拡張機能であるべきか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-tba-agent-credit-lines/30023)
