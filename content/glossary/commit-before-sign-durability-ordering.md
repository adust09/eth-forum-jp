---
title: commit-before-sign durability ordering
aliases:
  - 署名前コミット耐久性順序付け
tags:
  - glossary
date: '2026-08-30'
---

**署名前コミット耐久性順序付け**

ステートフルキー（特にXMSS）の安全な運用を保証するためのプロトコル設計パターン。署名が生成される前に、キーの進んだ状態（ハイウォーターマーク）を永続ストレージにコミットすることを義務付ける。これにより、システム障害時でもキー状態の巻き戻しによる再利用を防ぐ。

## 関連用語

- [[glossary/Stateful-Keys|Stateful Keys]]
- [[glossary/high-water-mark|high-water mark]]

## この用語を使っている記事

(なし)

## 元の表記（英語）

(なし)
