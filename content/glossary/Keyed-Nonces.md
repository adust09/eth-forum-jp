---
title: Keyed Nonces
aliases:
  - キー付きナンス (Keyed Nonces)
tags:
  - glossary
date: '2026-06-01'
---

**キー付きナンス (Keyed Nonces)**

EIP-8250で提案されている、トランザクションのリプレイ保護を強化するためのナンス管理メカニズムです。単一の線形シーケンスではなく、`nonce_key`と`nonce_seq`のペアを使用することで、異なる目的のトランザクションが独立してリプレイ可能となります。

## 関連用語

- [[glossary/EIP-8250|EIP-8250]]
- [[glossary/Frame-Transactions|Frame Transactions]]
- [[glossary/Async-Nonce|Async Nonce]]

## 元の表記（英語）

(なし)
