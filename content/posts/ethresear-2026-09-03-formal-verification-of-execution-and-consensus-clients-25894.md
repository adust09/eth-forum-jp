---
title: 実行クライアントとコンセンサス層クライアントの形式検証
original_title: Formal Verification of Execution and Consensus Clients
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/formal-verification-of-execution-and-consensus-clients/25894
author: pcaversaccio
date: '2026-09-03'
category: Security
tags:
  - security
  - formal-verification
  - consensus
  - execution-layer
  - research
  - protocol-design
topic_id: '25894'
translated_at: '2026-09-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Formal Verification of Execution and Consensus Clients](https://ethresear.ch/t/formal-verification-of-execution-and-consensus-clients/25894) — pcaversaccio (2026-09-03)

元々、私は[[Eth-RD|イーサリアム研究開発]]のDiscordサーバーで[この](https://discord.com/channels/595666850260713488/1544664467076292709)議論を始めました。

> コア開発者の皆さんに（一般的な）質問があります。形式検証に関して多くの進展があったと思いますし、近い将来、クライアントのハードフォークアップグレードは稼働前に形式検証されるべきだと考えています（これはすべてを遅らせるでしょうが、ネットワークとして保護する価値を考えると、その代償を払う価値は十分にあると思います）。これについてどうお考えですか？（ちなみに、もしこのチャンネルが不適切であれば、他の場所で議論するために移動しても構いません）

このスレッドは、私の意見ではすでに多くの貴重なフィードバックを生み出しています。議論をよりアクセスしやすくし、実行クライアントと[[Consensus-Layer|コンセンサス層]]クライアントを形式検証するために何が必要か、そしてどのように段階的に進めることができるかについて、会話をより良く構造化するために、ここにこのスレッドを作成しました。

個人的には、最近の形式検証において、不変条件 (invariants) を形式的に指定する基礎的な作業を含め、目覚ましい進歩があったと信じています。クライアントチームが形式検証をますます採用し、**ハードフォークに関連するクライアントの変更が稼働前に形式検証される**という目標に長期的に到達することを望んでいます。

これは明らかに野心的な目標であり、一夜にして達成できるものではありません。しかし、ネットワークによって保護される価値を考えると、その目標に向けた現実的で段階的な道筋がどのようなものになり得るかを真剣に検討する価値があると考えています。そこに至るまでのフィードバック、アイデア、過去の経験、考えをぜひ共有してください。

*5件の投稿 - 4人の参加者*

[トピック全体を読む](https://ethresear.ch/t/formal-verification-of-execution-and-consensus-clients/25894)
