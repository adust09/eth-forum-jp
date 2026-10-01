---
title: 'ERC-8421: フレームトランザクション代替メムプール'
original_title: 'ERC-8421: Frame Transaction Alternative Mempools'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8421-frame-transaction-alternative-mempools/29800
author: alex-forshtat-tbk
date: '2026-09-29'
category: ERCs
tags:
  - ercs
  - account-abstraction
  - mempool
  - eip
  - erc
  - protocol-design
  - research
  - ux
  - scaling
topic_id: '29800'
translated_at: '2026-10-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8421: Frame Transaction Alternative Mempools](https://ethereum-magicians.org/t/erc-8421-frame-transaction-alternative-mempools/29800) — alex-forshtat-tbk (2026-09-29)

# ERC-8421: フレームトランザクション代替メムプール

[[Frame-Transactions|フレームトランザクション]]に特化した代替[[Mempool|メムプール]]ルール定義で、[[ERC-7562]]の[[ERC-4337]] [[validateUserOp|UserOperation]]検証ルールと構造が類似しており、ほとんどが後方互換性があります。

[[EIP-8141]]の文脈では、コアプロトコルの一部として定義された「カノニカルメムプール」と比較して、より寛容な評判ベースのシステムとして機能します。
概念的には、ERC-8421/ERC-7562の「評判」システムは、[[MATCHA (Mempool Account Transaction Capacity from Historical Activity)|「MATCHA」]]として提案されたものと類似していますが、実装の詳細にいくつかの相違点があります。主な相違点は、会計単位（使用されたガス vs. 観測されたトランザクション数）です。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/2028)

#### [ERCの追加: フレームトランザクション代替メムプール (#2028)](https://github.com/ethereum/ERCs/pull/2028)

`master` ← `forshtat:pr-clean`

22年9月26日 07:15PM (UTC) にオープン

 [![](https://avatars.githubusercontent.com/u/40541447?v=4) forshtat](https://github.com/forshtat)

[+370 \-0](https://github.com/ethereum/ERCs/pull/2028/files)

新しい[[EIP|EIP]]を提出するためにプルリクエストを開く際は、提案されたテンプレートを使用してください: https://github.com/ethereum/EIPs/blob/master/eip-template.md GitHubボットが一部のPRを自動的にマージします。特定の基準が満たされている場合、すぐにマージされます: - PRが既存のドラフトPRのみを編集している。 - ビルドがパスする。 - 影響を受けるすべてのPRの「author」ヘッダーに、あなたのGitHubユーザー名またはメールアドレスが<三角括弧>内に記載されている。 - メールアドレスで一致させる場合、そのメールアドレスがGitHubプロフィールに公開されているものである。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8421-frame-transaction-alternative-mempools/29800)
