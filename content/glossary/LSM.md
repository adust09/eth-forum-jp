---
title: LSM
aliases:
  - LSM（ログ構造化マージツリー）
  - Log-Structured Merge-tree
tags:
  - glossary
date: '2026-10-29'
---

**LSM（ログ構造化マージツリー）**

データベースのストレージエンジンで用いられるデータ構造です。書き込みを最適化するために、データをログのように追記し、バックグラウンドでソートされたラン（SSTable）にマージします。Ethereumクライアントのストレージレイヤーでも採用されています。

## 関連用語

- [[glossary/compaction-amplification|compaction amplification]]
- [[glossary/write-amplification|write amplification]]

## この用語を使っている記事

(なし)

## 元の表記（英語）

- Log-Structured Merge-tree
