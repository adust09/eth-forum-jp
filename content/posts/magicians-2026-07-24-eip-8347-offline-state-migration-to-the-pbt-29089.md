---
title: 'EIP-8347: PBTへのオフライン状態移行'
original_title: 'EIP-8347: Offline state migration to the PBT'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8347-offline-state-migration-to-the-pbt/29089
author: misilva73
date: '2026-07-24'
category: EIPs core
tags:
  - eips-core
  - state-management
  - protocol-design
  - execution-layer
  - consensus
  - scaling
  - cryptography
  - research
  - eip-8347
  - pbt
topic_id: '29089'
translated_at: '2026-07-25'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8347: Offline state migration to the PBT](https://ethereum-magicians.org/t/eip-8347-offline-state-migration-to-the-pbt/29089) — misilva73 (2026-07-24)

# EIP-8347: PBTへのオフライン状態移行

EIP-8347に関する議論トピック

#### 概要

この[[EIP|EIP（Ethereum 改善提案）]]は、イーサリアムの状態を[[Merkle-Patricia-Trie|ヘキサリマークルパトリシアトライ (MPT)]]から、EIP-8297（EIP-7864の統合バイナリツリーの後継）で定義されている[[Partitioned-Binary-Tree|パーティション化されたバイナリツリー (PBT)]]へ**オフラインで**移行することを規定します。

ファイナライズされた**[[anchor-block|アンカーブロック]] `ANCHOR_BLOCK`**における完全な状態は、コンセンサスにとってクリティカルなパスから外れて変換されます。その結果は、バイトカノニカルで検証可能な**PBTスナップショット**として配布されます。このPBTスナップショットは、[[Block-Level-Access-Lists|ブロックレベルアクセスリスト]] (EIP-7928) をリプレイすることでチェーンの先端に追いつき、単一のEL+CLハードフォーク**`SWAP_FORK`**でカノニカル化されます。`SWAP_FORK`後のファイナリティまで、両方のツリーは移行期間中維持されます。

この提案は、`ANCHOR_BLOCK`、`SWAP_FORK`、PBTスナップショット成果物、デュアルチェック検証手順、および**シャドウルート**の可視性コンセプトを定義します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8347-offline-state-migration-to-the-pbt/29089)
