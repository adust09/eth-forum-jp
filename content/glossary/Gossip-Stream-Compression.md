---
title: Gossip Stream Compression
aliases:
  - ゴシップストリーム圧縮（コンテキスト付き）
  - Stream Compression (with context)
  - Snappy-stream
tags:
  - glossary
date: '2026-09-25'
---

**ゴシップストリーム圧縮（コンテキスト付き）**

EthereumのP2Pネットワークにおけるゴシップメッセージのトラフィックを削減するため、メッセージ間のコンテキスト（履歴）を保持しながらストリーム全体を圧縮する手法。これにより、メッセージ間の冗長性が排除され、特にアテステーションなどのトラフィックを大幅に削減できる。

## 関連用語

- [[glossary/Gossipsub|Gossipsub]]
- [[glossary/Snappy|Snappy]]
- [[glossary/LZ77|LZ77]]
- [[glossary/zstd|zstd]]

## この用語を使っている記事

(なし)

## 元の表記（英語）

- Stream Compression (with context)
- Snappy-stream
