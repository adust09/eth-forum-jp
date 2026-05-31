---
title: Async nonce
aliases:
  - 非同期ナンス (Async nonce)
tags:
  - glossary
date: '2026-05-31'
---

**非同期ナンス (Async nonce)**

EVVMで実装されているナンスモデルの一つで、アカウントごとに(account, nonce_value)のスロットを持ち、使用時に消費済みとマークされます。異なる非同期ナンスはリプレイ攻撃に対して独立しており、並行するインテントや共有送信者パターンに利用されます。

## 関連用語

- [[glossary/Keyed-Nonces|Keyed Nonces]]
- [[glossary/Sync-nonce|Sync nonce]]

## 元の表記（英語）

(なし)
