---
title: Replay-domain separation
aliases:
  - リプレイドメイン分離
  - Replay independence
tags:
  - glossary
date: '2026-06-03'
---

**リプレイドメイン分離**

異なるトランザクションが互いにリプレイ攻撃の影響を受けないように分離すること。Keyed Noncesのようなメカニズムは、nonce_keyごとに独立したnonceシーケンスを持つことで、この分離を実現し、並行トランザクションの安全性を高める。

## 関連用語

- [[glossary/Keyed-Nonces|Keyed Nonces]]
- [[glossary/Async-nonce|Async nonce]]
- [[glossary/Replay-protection|Replay protection]]

## 元の表記（英語）

- Replay independence
