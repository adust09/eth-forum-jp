---
title: 'EIP-8297: パーティション化されたバイナリツリー'
original_title: 'EIP-8297: Partitioned Binary Tree'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8297-partitioned-binary-tree/28776'
author: weiihann
date: '2026-06-12'
category: EIPs
tags:
  - eips
  - eip
  - state-management
  - protocol-design
  - scaling
  - cryptography
topic_id: '28776'
translated_at: '2026-06-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8297: Partitioned Binary Tree](https://ethereum-magicians.org/t/eip-8297-partitioned-binary-tree/28776) — weiihann (2026-06-12)

## 概要

ヘキサリパトリシアトライ (hexary Patricia tries) を置き換える新しいバイナリステートツリーを導入します。アカウントとストレージのトライは、コントラクトコードも保持する32バイトキーを持つ単一のツリーに統合されます。アカウントデータは256個ごとにグループ化された独立したリーフに分割され、局所性 (locality) を提供します。

ツリーはゾーンにパーティション化されます。すべてのキーの上位4ビットはゾーン識別子 (zone identifier) であり、キーが保持するステートのカテゴリ（アカウントヘッダー、コントラクトコード、ストレージ）を示します。ストレージはゾーン空間の上半分全体（上位ビットがセットされたキー）を占めるため、深さ1にルートされ、ツリーの約半分を占めます。アカウントヘッダーとコードは固定された下位ゾーンを占め、残りの下位ゾーンは将来のカテゴリのために予約されています。

注記: このドラフトで使用されているハッシュ関数は最終決定ではありません。参照実装では、この [[glossary/EIP|EIP（Ethereum 改善提案）]] を試すクライアントの摩擦を減らすためにBLAKE3を使用していますが、選択肢はまだ開かれています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8297-partitioned-binary-tree/28776)
