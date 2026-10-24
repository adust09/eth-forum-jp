---
title: 'ERC-TBA: エージェント信用保証者'
original_title: 'ERC-TBA: Agent Credit Backers'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-tba-agent-credit-backers/30062'
author: priors-agents
date: '2026-10-23'
category: ERCs
tags:
  - ercs
  - erc
  - account-abstraction
  - defi
  - smart-contracts
  - protocol-design
  - ai-agents
topic_id: '30062'
translated_at: '2026-10-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: Agent Credit Backers](https://ethereum-magicians.org/t/erc-tba-agent-credit-backers/30062) — priors-agents (2026-10-23)

エージェントへの信用枠は、エージェントを裏で支える者への賭けである。このドラフトは、第三者（[[glossary/stake|ステーク]]保有者、担保ボルト、保険会社）が、貸し手のエージェントIDへの信用枠を保証し、その債務不履行を吸収することを可能にする。これはID所有者の[[glossary/EIP-712-attestation-profile|EIP-712アテステーションプロファイル]]による同意を伴う。貸し手は、各引き出し前に保証者に問い合わせ（`canBorrow`）、各引き出しを通知し（`onBorrow`）、債務不履行時には保証者から元本を回収し、その旨を通知する（`onDefault`、支払われた金額も含む）。信用枠が減額、削除、または置き換えられた場合は、それぞれ一度通知される（`onRelease`）。保証者も貸付資産も、返済、債務不履行、または削除をブロックすることはできない。通知は固定のガス制限で実行され、失敗はログに記録され、資産への呼び出しも制限される。これはエージェント信用枠ドラフト（[ERC-TBA: Agent Credit Lines](https://ethereum-magicians.org/t/erc-tba-agent-credit-lines/30023)）を拡張するものである。

-   リポジトリ（テキスト、参照貸し手および保証者、Foundryテスト）：[GitHub - priors-agents/erc-credit-backer-hooks: Draft ERC (Agent Credit Backers): third parties that stand behind a lender's line to an agent identity and take its loss, through lender hooks · GitHub](https://github.com/priors-agents/erc-credit-backer-hooks)
-   これは[[glossary/ERC|ERC]]-8210のスレッド（[ERC-8210: Agent Assurance - #50 by priors-agents](https://ethereum-magicians.org/t/erc-8210-agent-assurance/28097/50)）で最初に提起されたもので、その「Delegated Funding (Reserved)」セクションでは第三者保証者（Backers）を「別の[[glossary/ERC|ERC]]」に委ねている。これは[[glossary/ERC|ERC]]プロセスが求めるように、独立したスレッドである。もし[[glossary/ERC|ERC]]-8210の著者がこれをそのセクションに含めることを望むなら、そうするだろう。
-   参照実装は監査されておらず、外部監査なしにデプロイしてはならない。

貸し手、保証者、およびERC-8210の著者への質問：

1.  債務不履行時、貸し手は元本を回収し、その後保証者に通知する。通知してから回収する方式では、担保ボルトがフック内で担保を変換できるが、損失が回収される前に呼び出しが失敗する可能性があるというコストがかかる。回収してから通知する方式が適切なデフォルトだろうか？
2.  通知には、貸し手が設定する最低100,000のガス制限が与えられる。これは自身の口座を管理する保証者にとって適切な下限だろうか？
3.  ERC-8210の`depositFor(agent, amount)`はエージェントに直接資金を供給する。ここでは保証者が貸し手の信用枠を保証する。一つの標準で両方をカバーすべきだろうか？

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-tba-agent-credit-backers/30062)
