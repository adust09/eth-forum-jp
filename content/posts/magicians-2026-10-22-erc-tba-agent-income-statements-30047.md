---
title: 'ERC-TBA: エージェント損益計算書'
original_title: 'ERC-TBA: Agent Income Statements'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-tba-agent-income-statements/30047'
author: priors-agents
date: '2026-10-22'
category: ERCs
tags:
  - ercs
  - applications
  - ai-agents
  - economics
  - erc
  - account-abstraction
  - identity
  - smart-contracts
topic_id: '30047'
translated_at: '2026-10-23'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: Agent Income Statements](https://ethereum-magicians.org/t/erc-tba-agent-income-statements/30047) — priors-agents (2026-10-22)

[[x402|x402]]を介して販売するエージェントは、その[[ERC-8004|ERC-8004]] `agentWallet` に支払いを受け、貸し手や買い手はそのエージェントが何を稼いでいるかを知りたいと考えます。このドラフトは、ERC-8004のレピュテーションレジストリのプロファイルです。ライターは、エージェントの `agentWallet` がある資産で受け取ったものを連鎖的なステートメントとして投稿します。各入金転送はMerkleルートのリーフであり、ERC-8004の `revenues` タグ（`tag2` `x402.statement`）の下に置かれます（x402の支払いが主な動機ですが、合計は総受領額です）。ウィンドウは、所有者またはウォレットの変更（ERC-721 `Transfer` および `MetadataSet("agentWallet")` のログ）で区切られるため、読者はトークンのログからすべての数値を再構築でき、コントラクトは1つの転送をルートに対して検証できます。これは、読者が信頼しなければならない数値ではなく、読者がチェックできるステートメントとして、選択によって公開されます。

-   リポジトリ（テキスト、検証者、参照ライターとチェッカー、Foundryテスト）：[GitHub - priors-agents/erc-agent-income-statements: Draft ERC: public, chained statements of what an agent's ERC-8004 agentWallet received, one leaf per transfer, rebuildable from token logs · GitHub](https://github.com/priors-agents/erc-agent-income-statements)
-   これは[[ERC-8434|ERC-8434]]の[[Agent-Identity|エージェントID]]スレッドで最初に提起され、その作者は両者がどのように適合するかを確認しました。[[AID-Document|AIDドキュメント]]は、ステートメントを指すオープンネームスペースにファセットをリストでき、累積数値はそのファセットを介してドキュメントに到達し、ライターごとの最新のステートメントとして読み取られ、平均として読み取られることはありません。ドラフトには現在その旨が記載されています。
-   参照実装は監査されておらず、外部監査なしにデプロイしてはなりません。

エージェントビルダー、貸し手、インデクサーへの質問：

1.  ウィンドウごとに資産ごとに1つのステートメントという粒度は適切ですか、それとも1つのステートメントが同じ支払い者セットの複数の資産を保持すべきですか？
2.  このプロファイルでは、レジストリがウォレットの変更ごとに `MetadataSet` を発行することを要求していますが、ERC-8004の参照レジストリはこれを行っており、そのテキストでは登録時のみを記載しています。ERC-8004はすべての変更についてそう述べるべきですか？ERC-8434も同じイベントに依存しています。
3.  誰が書き込みを許可されるべきですか：読者が信頼することを選択する任意のライター（現在のように）、それともドラフトはエージェント自身のファシリテーターなど、デフォルトのセットを指名すべきですか？

*3投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-tba-agent-income-statements/30047)
