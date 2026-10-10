---
title: reference count
aliases:
  - 参照カウント
tags:
  - glossary
date: '2026-10-10'
---

**参照カウント**

あるデータ（この文脈ではコントラクトのバイトコード）がいくつのエンティティから参照されているかを追跡する仕組み。Ethereumクライアントは現在、コードハッシュに対して参照カウントを保持していないため、宙吊りバイトコードの削除が困難であり、PBTのような設計では状態の永続的な肥大化につながる可能性がある。

## 関連用語

- [[glossary/dangling-bytecode|dangling bytecode]]
- [[glossary/SETCODEFROM|SETCODEFROM]]
- [[glossary/partitioned-binary-tree|partitioned binary tree]]

## この用語を使っている記事

(なし)

## 元の表記（英語）

(なし)
