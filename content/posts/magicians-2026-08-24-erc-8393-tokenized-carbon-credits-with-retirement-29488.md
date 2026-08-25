---
title: 'ERC-8393: 償却機能を備えたトークン化カーボンクレジット'
original_title: 'ERC-8393: Tokenized Carbon Credits with Retirement'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8393-tokenized-carbon-credits-with-retirement/29488
author: sehyunkim
date: '2026-08-24'
category: ERCs
tags:
  - ercs
  - erc
  - tokenomics
  - applications
  - defi
  - economics
  - smart-contracts
topic_id: '29488'
translated_at: '2026-08-25'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8393: Tokenized Carbon Credits with Retirement](https://ethereum-magicians.org/t/erc-8393-tokenized-carbon-credits-with-retirement/29488) — sehyunkim (2026-08-24)

完全な[[ERC|ERC]]については、プルリクエストを参照してください: [Add ERC: Tokenized Carbon Credits with Retirement by sehyun-wincl · Pull Request #1965 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/1965)

**概要**

この提案は、[[ERC|ERC]]-1155 ([ERC-1155: Multi Token Standard](https://eips.ethereum.org/EIPS/eip-1155)) の上にカーボンクレジットをセミファンジブルトークンとして表現するためのインターフェースを定義します。各トークンは `(projectId, creditId)` のペアを単一の `uint256` 識別子にエンコードし、カーボンレジストリによって公開される属性（プロジェクト名、方法論、ビンテージ、発行国、総発行量、有効期限）に合わせた固定のメタデータスキーマを保持します。このインターフェースはまた、償却 (retirement) を定義します。これは、排出量を相殺するためにクレジットを使用する行為です。償却は、保有者の譲渡可能な残高から減算し、同額の永続的で譲渡不可能な償却済み残高を記録するため、発行、転送、および償却のすべてを台帳から直接監査できます。

償却モデル、メタデータスキーマ、および既存のレジストリ規則（Verra/Gold Standard）との相互運用性に関するフィードバックを歓迎します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8393-tokenized-carbon-credits-with-retirement/29488)
