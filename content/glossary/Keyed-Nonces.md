---
title: Keyed Nonces
aliases:
  - キー付きナンス (Keyed Nonces)
tags:
  - glossary
date: '2026-05-31'
---

**キー付きナンス (Keyed Nonces)**

EIP-8250で提案されている、単一の送信者ナンスを(nonce_key, nonce_seq)のペアで置き換える仕組みです。これにより、異なるキーを持つトランザクションはリプレイ攻撃に対して独立し、並行処理やプライバシープロトコルでの利用が可能になります。

## 関連用語

- [[glossary/Async-nonce|Async nonce]]
- [[glossary/Frame-Transactions|Frame Transactions]]
- [[glossary/EIP-8250|EIP-8250]]

## 元の表記（英語）

(なし)
