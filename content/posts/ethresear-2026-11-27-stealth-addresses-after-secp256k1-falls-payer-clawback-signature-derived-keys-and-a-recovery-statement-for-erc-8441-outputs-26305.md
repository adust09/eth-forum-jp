---
title: secp256k1の破綻後のステルスアドレス：支払い者による取り戻し、署名由来鍵、およびERC-8441出力のリカバリーステートメント
original_title: >-
  Stealth addresses after secp256k1 falls: payer clawback, signature-derived
  keys, and a recovery statement for ERC-8441 outputs
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/stealth-addresses-after-secp256k1-falls-payer-clawback-signature-derived-keys-and-a-recovery-statement-for-erc-8441-outputs/26305
author: siriusthemaster
date: '2026-11-27'
category: Privacy
tags:
  - privacy
  - cryptography
  - post-quantum
  - security
  - account-abstraction
  - eip
  - protocol-design
  - stealth-addresses
  - payer-clawback
topic_id: '26305'
translated_at: '2026-11-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Stealth addresses after secp256k1 falls: payer clawback, signature-derived keys, and a recovery statement for ERC-8441 outputs](https://ethresear.ch/t/stealth-addresses-after-secp256k1-falls-payer-clawback-signature-derived-keys-and-a-recovery-statement-for-erc-8441-outputs/26305) — siriusthemaster (2026-11-27)

*以下の議論をチェックしてくださる皆様に、事前に感謝申し上げます。誤りは私にあります。ここにあるものは完成した仕様ではなく、セクション5のリカバリーステートメントは回路として実装されていません。*

## TL;DR

-   [[glossary/ERC-5564|ERC-5564]] `schemeId` 1の下では、[[glossary/quantum-attack|量子攻撃者]]は公開データのみから**使用されていないすべてのステルス出力をリンクして盗む**ことができます。ステルス出力は、通常の未使用の[[glossary/EOA|EOA (Externally Owned Account)]]よりも悪い状況にあります。
-   [[glossary/ERC-8441|ERC-8441]] (`schemeId` 3) は発見の問題を解決します。この[[glossary/ERC|ERC]]が示唆する副作用として、**未使用の出力は受動的な[[glossary/quantum-attack|攻撃者]]に対して「未使用のEOA」レベルに戻されます**。これは、ワンタイム公開鍵が[[glossary/ML-KEM-768|ML-KEM-768]]の秘密に依存するためです。
-   この保護には、ウォレットが今日閉じることができる2つの穴があります。(1) **[[glossary/Payer-clawback|支払い者による取り戻し (Payer clawback)]]**: 離散対数問題が破られた後、支払い者（および委任されたスキャナー）は、`ss`を知っているすべての未使用の出力を使うことができます。(2) **[[glossary/Signature-derived-keys|署名由来鍵 (Signature-derived keys)]]**: 鍵セットのいずれかの部分がユーザーのメインアカウントの[[glossary/ECDSA-signature|ECDSA署名]]から派生している場合（一般的なUXパターン）、[[glossary/quantum-attack|量子攻撃者]]は[[glossary/ML-KEM|ML-KEM (モジュール格子ベース鍵カプセル化メカニズム)]]のシードを含め、すべてを再導出します。
-   [量子緊急時にほとんどのユーザーの資金を救うためのハードフォーク方法](https://ethresear.ch/t/how-to-hard-fork-to-save-most-users-funds-in-a-quantum-emergency/18901)で提案されている緊急リカバリー[[glossary/fork|フォーク]]は**ステルス出力をカバーしません**。ステルス鍵は `k_spend + t mod n` であり、ハッシュ出力ではありません。私はそれをカバーするステートメント `R_stealth` を提示し、単純なバージョンが見た目よりも弱い理由（約2^85量子クエリのクロー問題）を分析し、[[glossary/ERC-6538|ERC-6538]]レジストリにバインドすることで、受信者を明かすことなく原像計算困難性 (preimage bound) に戻す方法を示します。
-   測定された（方法を提示）、計算された、または引用されたすべての数値を含む、3段階の移行優先計画。

## 1. 設定と表記

[[glossary/ERC-8441|ERC-8441]]と、Rustリファレンスおよび`kohaku-stealth`（私の独立したTypeScript実装、[erc8441-ts](https://github.com/siriusthemaster/erc8441-ts)、MIT、120テスト、29/29公式ベクトル、`kohaku-stealth`フィクスチャと一致、同じ導出を使用）で使用されているHKDF鍵導出に従います。

-   `G`, `n`: secp256k1のジェネレーターと群の位数。`addr(P) = keccak256(P)[12:]`。
-   マスター `m`: 32バイト。`seed = HKDF-SHA256(m, info(j))`、128バイト、`info(j) = "pq-stealth/keygen/v1" || u64(3) || u64(len(name)) || name || u64(j)`、`j`はリジェクションインデックス。
-   `seed = k_spend || k_view || d || z`。登録されたメタアドレス: `K = k_spend G`, `V = k_view G`, `ek = [[glossary/ML-KEM-768|ML-KEM-768]].KeyGen(d, z)`。1,250バイト。
-   トラッキングキー（スキャナーに渡される可能性あり）: `k_view || d || z`、96バイト。
-   支払いごと: `ss = SHA3-256(DS || ss_ec || ss_pq || epk || ct || V || ek)`、`t = SHA256("pq-stealth/offset/v1" || ss)`、`0 < t < n`、ワンタイムキー `k_spend + t mod n`、アドレス `A = addr(K + tG)`。

誰が何を知っているか（破綻前）: 所有者は `m` とその下のすべてを知っています。支払い者は自身の支払いに対する `ss`（したがって `t`）を知っています。スキャナーは所有者へのすべての支払いに対する `ss` を知っています。誰もが `K`, `V`, `ek`, `epk`, `ct`, `A` を
