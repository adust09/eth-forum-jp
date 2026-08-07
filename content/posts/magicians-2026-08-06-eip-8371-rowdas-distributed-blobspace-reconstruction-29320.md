---
title: 'EIP-8371: RowDAS - 分散型ブロブ空間再構築'
original_title: 'EIP-8371: RowDAS - Distributed Blobspace Reconstruction'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8371-rowdas-distributed-blobspace-reconstruction/29320
author: cskiraly
date: '2026-08-06'
category: EIPs
tags:
  - eips
  - scaling
  - data-availability
  - networking
  - protocol-design
  - eip
topic_id: '29320'
translated_at: '2026-08-07'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8371: RowDAS - Distributed Blobspace Reconstruction](https://ethereum-magicians.org/t/eip-8371-rowdas-distributed-blobspace-reconstruction/29320) — cskiraly (2026-08-06)

EIP-8371の議論トピック

PRへのリンク: [EIPの追加: RowDAS - 分散型ブロブ再構築 by cskiraly · Pull Request #12118 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12118)

注: 共同著者からの確認が取れ次第、著者リストは修正されます。

## **要約**

[[glossary/PeerDAS|PeerDAS]]はスーパーノードに再構築の提供を要求し、これは[[glossary/blob|ブロブ]]数に比例してスーパーノードに高い負担をかけます。RowDASは、部分メッセージベースの行トピックを使用して分散型ブロブ空間再構築を可能にし、すべてのノードが再構築に貢献できるようにします。これにより、スーパーノードの負荷が大幅に軽減され、より効率的で回復力のある[[glossary/Data-Availability|データアベイラビリティサンプリング (DAS)]]構造が実現します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8371-rowdas-distributed-blobspace-reconstruction/29320)
