---
title: 'ERC-TBA: エージェントデフォルトレジストリ'
original_title: 'ERC-TBA: Agent Default Registry'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-tba-agent-default-registry/30026'
author: priors-agents
date: '2026-10-20'
category: ERCs
tags:
  - ercs
  - erc
  - defi
  - economics
  - smart-contracts
  - security
  - agent-identity
  - account-abstraction
topic_id: '30026'
translated_at: '2026-10-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: Agent Default Registry](https://ethereum-magicians.org/t/erc-tba-agent-default-registry/30026) — priors-agents (2026-10-20)

ある貸し手でのデフォルトは次の貸し手には見えません。エージェント、またはその所有者が別のエージェントを通じて、別の場所で再び借り入れを行います。この草案は、貸し手がエージェントのアイデンティティに対するローンのデフォルトを記録する単一の[[glossary/Smart-Account|スマートコントラクト]]です。これは、アイデンティティと、ローンが記録された所有者アドレスによってキー付けされ、アセット、元本、二重に記録できないローン参照を含み、後には回収された金額を伴う回復（cure）も記録されます。誰でも記録できます。記録は、その報告者を信頼する読者に対してのみ有効です。貸し手のコントラクトは、信用枠を開設するトランザクション内で、このアイデンティティまたはこの所有者が、指定された報告者によると、いくつの未解決および回復済みのデフォルトを抱えているかを問い合わせます。このコストは、他の誰がどれだけ記録を追加しても、そのリストのみに応じて増加します。

-   リポジトリ: [GitHub - priors-agents/ERC-8452: 草案ERC: 貸し手がエージェントのアイデンティティに対するローンのデフォルトを記録する単一のコントラクト。読者が信頼する報告者に対してオンチェーンでカウント可能 · GitHub](https://github.com/priors-agents/ERC-8452)

既存のものとの違い: [[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]のフィードバックは値を平均し、ERC-8419のKYAは発行者ごとに最新のアサーションを1つ保持するため、どちらもデフォルトをカウントできません。これは、すべてのデフォルトを独自のカウント可能な記録として保持し、所有者によってもインデックス付けされます。

質問:

1.  回復（cure）は、貸し手の署名付きでアイデンティティの所有者によって記録可能であるべきか、それとも報告者のみによって記録可能であるべきか？
2.  チェーンごとのシングルトンで十分か、それとも貸し手は初日からクロスチェーン読み取りを必要とするか？

*3件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-tba-agent-default-registry/30026)
