---
title: storage-to-account cascade
aliases:
  - ストレージからアカウントへのカスケード
tags:
  - glossary
date: '2026-10-05'
---

**ストレージからアカウントへのカスケード**

Merkle Patricia Tree (MPT) の構造に起因する、ストレージスロットへの書き込みが、そのストレージルートを含むアカウントの`last_written_block`も更新する挙動。Partitioned Binary Tree (PBT) では、アカウントヘッダーとストレージが別々のリーフであるため、このカスケードは発生しない。

## 関連用語

- [[glossary/Merkle-Patricia-Tree|Merkle Patricia Tree]]
- [[glossary/Partitioned-Binary-Tree|Partitioned Binary Tree]]

## この用語を使っている記事

(なし)

## 元の表記（英語）

(なし)
