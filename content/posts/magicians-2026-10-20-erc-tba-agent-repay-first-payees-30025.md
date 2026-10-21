---
title: 'ERC-TBA: エージェントの返済優先受取人'
original_title: 'ERC-TBA: Agent Repay-First Payees'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-tba-agent-repay-first-payees/30025'
author: priors-agents
date: '2026-10-20'
category: ERCs
tags:
  - ercs
  - erc
  - account-abstraction
  - defi
  - smart-contracts
  - tokenomics
  - agent-identity
  - protocol-design
topic_id: '30025'
translated_at: '2026-10-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: Agent Repay-First Payees](https://ethereum-magicians.org/t/erc-tba-agent-repay-first-payees/30025) — priors-agents (2026-10-20)

エージェントの収入に応じて増えるクレジットは、その収入が使われる前に返済されなければなりません。このドラフトは、[[glossary/Agent-Identity|エージェントID (AID)]]（[[glossary/x402|x402 (エックス402)]]の`payTo`、ERC-8183プロバイダー、[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]の支払いウォレット）のための収益アドレスであり、その所有者よりも先にエージェントの登録済み債権者に支払います。誰かがそれをスイープするたびに、各債権者は合意されたスイープの割合まで、最も優先順位の高いものから順に、負っている金額が支払われ、残りは所有者の受益者に支払われます。所有者はまだ負債のある債権者を削除することはできません。これが、その収益を担保として貸し出す価値がある理由です。受益者は、それを設定した所有者がそのIDを保持している間のみ保持されるため、売り手は買い手の収益を保持できません。

オプションのセクション「債権者後のホルダーへの支払い」では、エージェントが債権者が残した資金からERC-7254収益分配トークンのホルダーに支払うことができます。このトークンは受取人の受益者であり、決して債権者ではないため、貸し手は優先され、ホルダーは最後になります。

-   リポジトリ: [GitHub - priors-agents/ERC-8451: Draft ERC (Agent Repay-First Payees): a revenue address for an agent identity that pays its creditors before its owner · GitHub](https://github.com/priors-agents/ERC-8451)

質問:

1.  追加順序による優先順位付けと、各スイープにおける債権者ごとの上限は、リボルビング貸し手にとって十分か、それとも債権者は異なる順序に合意できるべきか？
2.  受取人は、ID（[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]のメタデータキー、またはERC-8278のサービス支払い経路）から発見可能であるべきか？
3.  ホルダーのセクションについて: ERC-7254は`updateReward`を通じてのみ報酬を記録する。`syncFromPayee`アプローチは許容されるか、それともプロファイルは代わりに単一資産配当トークンに基づいて構築されるべきか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-tba-agent-repay-first-payees/30025)
