---
title: Signature-derived keys
aliases:
  - 署名由来鍵
tags:
  - glossary
date: '2026-11-28'
---

**署名由来鍵**

ユーザーのメインアカウントによる確定的なECDSA署名からアプリケーションキーを導出するUXパターン。量子攻撃者がメインアカウントの秘密鍵を回復すると、すべての派生ステルス鍵も再導出され、ML-KEMによる保護が無効になる脆弱性がある。

## 関連用語

- [[glossary/ECDSA|ECDSA]]
- [[glossary/Quantum-adversary|Quantum adversary]]
- [[glossary/ML-KEM|ML-KEM]]

## この用語を使っている記事

- [[posts/ethresear-2026-11-27-stealth-addresses-after-secp256k1-falls-payer-clawback-signature-derived-keys-and-a-recovery-statement-for-erc-8441-outputs-26305|secp256k1の破綻後のステルスアドレス：支払い者による取り戻し、署名由来鍵、およびERC-8441出力のリカバリーステートメント]]（2026-11-27）

## 元の表記（英語）

(なし)
