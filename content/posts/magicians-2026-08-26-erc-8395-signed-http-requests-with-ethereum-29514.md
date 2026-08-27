---
title: 'ERC-8395: イーサリアムによる署名付きHTTPリクエスト'
original_title: 'ERC-8395: Signed HTTP Requests with Ethereum'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8395-signed-http-requests-with-ethereum/29514
author: jacopo-eth
date: '2026-08-26'
category: ERCs
tags:
  - ercs
  - protocol-design
  - security
  - account-abstraction
  - ux
  - eip
  - applications
topic_id: '29514'
translated_at: '2026-08-27'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8395: Signed HTTP Requests with Ethereum](https://ethereum-magicians.org/t/erc-8395-signed-http-requests-with-ethereum/29514) — jacopo-eth (2026-08-26)

[[glossary/ERC|ERC]]-8395: 委任された署名付きHTTPリクエストに関する議論 — 認証済みHTTPリクエストのための、再帰的で減衰する[[glossary/EIP-712|EIP-712]]デリゲーショングラントを備えた[[glossary/ERC|ERC]]-8128の拡張です。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1967)

#### [[glossary/ERC|ERC]]の追加: 委任された署名付きHTTPリクエスト

`master` ← `slice-so:erc8128-delegated`

opened 09:18PM - 24 Aug 26 UTC

 [![jacopo-ethのアバター](https://avatars.githubusercontent.com/u/39241410?v=4) jacopo-eth](https://github.com/jacopo-eth)

[+573 \-0](https://github.com/ethereum/ERCs/pull/1967/files)

[[glossary/ERC|ERC]]-8395は、認証済みHTTPリクエストのために、再帰的で減衰する[[glossary/EIP-712|EIP-712]]デリゲーショングラントを用いて[[glossary/ERC|ERC]]-8128を拡張します。ルートのイーサリアムアカウントは、ルートキーを公開することなく、セッションキーや[[glossary/Autonomous-Agent|自動化されたエージェント]]（さらに権限を[[glossary/Delegation-tree|委任]]することも可能）を承認できます。完全な[[glossary/Delegation-tree|委任]]チェーンが各リクエストに付随するため、検証者はグラントを事前に登録したり保存したりする必要がありません。各グラントは、その対象者、有効性、パーミッション、必要な署名コンポーネント、およびリプレイ姿勢を制限し、すべての子は受け取った権限を広げることなく、必ず狭める必要があります。人間が読める承認、リクエストに紐付けられた[[glossary/Delegation-tree|委任]]チェーン、および規範的な[[glossary/On-chain-Anchor|オンチェーン]]での[[glossary/Graceful-Revocation|取り消し]]により、ルートアカウントを認証されたプリンシパルとして維持しつつ、短期間で[[glossary/Graceful-Revocation|取り消し]]可能なアクセスを提供します。

より同期的な議論のために、[Telegramグループ](https://t.me/+oVfVGLx41x45YzE0)に自由にご参加ください。

*2 posts - 2 participants*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8395-signed-http-requests-with-ethereum/29514)
