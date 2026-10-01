---
title: 'EIP-8430: AAトランザクションタイプ（EIP-8130からの分離）'
original_title: 'EIP-8430: AA Transaction Type (Split out from 8130)'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8430-aa-transaction-type-split-out-from-8130/29810
author: chunter
date: '2026-09-30'
category: Uncategorized
tags:
  - eip
  - account-abstraction
  - execution-layer
  - protocol-design
  - smart-contracts
  - wallet
topic_id: '29810'
translated_at: '2026-10-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8430: AA Transaction Type (Split out from 8130)](https://ethereum-magicians.org/t/eip-8430-aa-transaction-type-split-out-from-8130/29810) — chunter (2026-09-30)

[[EIP-8430|EIP-8430]]は、[[EIP-8130|EIP-8130]]からトランザクションタイプを分離し、独自の[[EIP|EIP]]として作成されました。これにより、キーストアへの依存がなくなります。[[EIP-8130|EIP-8130]]はキーストアを保持します。

- [[EIP-8430|EIP-8430]] PR: [Add EIP: AA Transaction Type by chunter-cb · Pull Request #12385 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12385)

- [[EIP-8130|EIP-8130]] 更新 PR: [Update EIP-8130: scope to the Keystore, move the transaction type to a new EIP by chunter-cb · Pull Request #12386 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12386)

- [[EIP-8130|EIP-8130]] スレッド: [EIP-8130: Account Abstraction by Account Configurations](https://ethereum-magicians.org/t/eip-8130-account-abstraction-by-account-configurations/25952)

## なぜ分離するのか

- このトランザクションタイプはそれ自体で有用です。今日の[[EOA|EOA]]（Externally Owned Account）でネイティブなsecp256k1認証と連携するため、先にリリースし、Keystoreは後から提供できます。

- Keystoreは、このトランザクションタイプがなくても有用です。[[ERC-4337|ERC-4337]]、直接的なコントラクト呼び出し、または[[フレームトランザクション (Frame Transactions)|フレームトランザクション]]（[[EIP-8141|EIP-8141]]）のような他のネイティブトランスポートを通じて利用できます。

- どちらの[[EIP|EIP]]も互いを必要としません。

*2件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8430-aa-transaction-type-split-out-from-8130/29810)
