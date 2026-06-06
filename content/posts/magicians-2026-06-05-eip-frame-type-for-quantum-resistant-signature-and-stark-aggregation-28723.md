---
title: 'EIP: 量子耐性署名とSTARK集約のためのフレームタイプ'
original_title: 'EIP: Frame type for quantum-resistant Signature and STARK Aggregation'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-frame-type-for-quantum-resistant-signature-and-stark-aggregation/28723
author: vbuterin
date: '2026-06-05'
category: EIPs
tags:
  - eips
  - cryptography
  - post-quantum
  - zk
  - scaling
  - protocol-design
  - signatures
  - mev
topic_id: '28723'
translated_at: '2026-06-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP: Frame type for quantum-resistant Signature and STARK Aggregation](https://ethereum-magicians.org/t/eip-frame-type-for-quantum-resistant-signature-and-stark-aggregation/28723) — vbuterin (2026-06-05)

[github.com/ethereum/EIPs](https://github.com/ethereum/EIPs/pull/11772)

#### [EIPの追加: 量子耐性署名とSTARK集約のためのフレームタイプ](https://github.com/ethereum/EIPs/pull/11772)

`master` ← `vbuterin:patch-3`

2026年6月5日 22:14 UTC 開設

 [![](https://avatars.githubusercontent.com/u/2230894?v=4) vbuterin](https://github.com/vbuterin)

[+496 \-0](https://github.com/ethereum/EIPs/pull/11772/files)

量子耐性署名とSTARK集約のためのフレームタイプを追加します。これは、トランザクションがそれらを「依存関係」として宣言する方法を提供することで、[[Post-Quantum|ポスト量子 (PQ)]]の世界において、署名とSTARK（プライバシーや例えばL2向け）を非常にガス効率的な方法でサポートします。これにより、メムプールと[[glossary/Block-Building|ブロック構築]]者が、それらすべてが存在することを証明する再帰的STARKに置き換えることが可能になります。**注意: [[glossary/ERC|ERC（Ethereum Request for Comments）]]関連のプルリクエストは現在、[ETHEREUM/ERCS](https://github.com/ethereum/ercs)で行われています。** -- 新しい[[glossary/EIP|EIP（Ethereum 改善提案）]]を提出するためにプルリクエストを開く際は、提案されたテンプレートを使用してください: https://github.com/ethereum/EIPs/blob/master/eip-template.md GitHubボットが一部のPRを自動的にマージします。特定の基準が満たされている場合、すぐにマージされます: - PRが既存のドラフトPRのみを編集していること。 - ビルドがパスすること。 - あなたのGitHubユーザー名またはメールアドレスが、影響を受けるすべてのPRの「author」ヘッダーに<三角括弧>内に記載されていること。 - メールアドレスで一致させる場合、そのメールアドレスがあなたのGitHubプロフィールに公開されているものであること。

量子耐性署名とSTARK集約のためのフレームタイプを追加します。

これは、トランザクションがそれらを「依存関係」として宣言する方法を提供することで、[[Post-Quantum|ポスト量子 (PQ)]]の世界において、署名とSTARK（プライバシーや例えばL2向け）を非常にガス効率的な方法でサポートします。これにより、メムプールと[[glossary/Block-Building|ブロック構築]]者が、それらすべてが存在することを証明する再帰的STARKに置き換えることが可能になります。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/eip-frame-type-for-quantum-resistant-signature-and-stark-aggregation/28723)
