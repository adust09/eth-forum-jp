---
title: 'EIP-8479: 量子耐性PeerDASと可変サイズブロブ'
original_title: 'EIP-8479: Post-Quantum PeerDAS and Variable-Size Blobs'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8479-post-quantum-peerdas-and-variable-size-blobs/30167
author: frisitano
date: '2026-11-01'
category: EIPs
tags:
  - eips
  - eip
  - post-quantum
  - peerdas
  - data-availability
  - starks
  - zk
  - rollup
  - scaling
  - cryptography
topic_id: '30167'
translated_at: '2026-11-02'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8479: Post-Quantum PeerDAS and Variable-Size Blobs](https://ethereum-magicians.org/t/eip-8479-post-quantum-peerdas-and-variable-size-blobs/30167) — frisitano (2026-11-01)

[[glossary/EIP|EIP]]-9999に関する議論トピック。

この[[glossary/EIP|EIP]]は、[[glossary/PeerDAS|PeerDAS]]向けの[[glossary/Post-Quantum|ポスト量子 (PQ)]]な[[glossary/Data-Availability|データアベイラビリティ]]構築を導入します。これは、[[glossary/KZG-commitment|KZGコミットメント]]とセル証明をKeccak-256 Merkleコミットメントに置き換え、[[glossary/ReedSolomon-codes|リード・ソロモン符号]]エンコーディング関係と正しいコミットメント導出を証明するLeanDA [[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]を使用します。

既存のPeerDASの列カストディ、サンプリング、サブネット割り当て、およびリカバリーメカニズムは変更されません。サンプリングされたセルは、KZG証明の代わりにMerkle認証パスを使用して認証されます。

この提案はまた、[[glossary/blob|ブロブ]]ごとに128列を維持しつつ、2 KiBから512 KiBの2のべき乗のブロブサイズを許可します。これにより、[[glossary/Rollup|ロールアップ]]は、すべての提出物を固定のブロブサイズにパディングする代わりに、必要な容量を公開し、その分の料金を支払うことができます。

ブロブを運ぶトランザクションは、[[glossary/Frame-Transactions|EIP-8141フレームトランザクション]]として表現されます。それらのLeanDA証明は[[glossary/EIP-8288|EIP-8288]]の依存関係として宣言され、そのブロックレベルの[[glossary/Recursive-STARK|再帰的STARK]]集約に組み込まれます。

EIPドラフト:

[github.com/frisitano/EIPs](https://github.com/frisitano/EIPs/blob/eip-post-quantum-peerdas/EIPS/eip-9999.md)

#### [EIPS/eip-9999.md](https://github.com/frisitano/EIPs/blob/eip-post-quantum-peerdas/EIPS/eip-9999.md)

[`eip-post-quantum-peerdas`](https://github.com/frisitano/EIPs/blob/eip-post-quantum-peerdas/EIPS/eip-9999.md)

```
---
eip: 9999
title: Post-Quantum PeerDAS and Variable-Size Blobs
description: Introduces post-quantum STARK proofs and variable-sized blobs that replace KZG in PeerDAS
author: Francesco Risitano (@frisitano), Thomas Coratger (@tcoratger), Tom Wambsgans (@TomWambsgans)
status: Draft
type: Standards Track
category: Core
created: 2026-10-26
requires: 4844, 7594, 7892, 8070, 8136, 8141, 8288
---

## Abstract

This EIP introduces a post-quantum data-availability construction for PeerDAS. It replaces KZG blob commitments with hash-based Merkle commitments and uses a STARK to prove both the Reed–Solomon encoding relation and the correct derivation of each Merkle commitment. PeerDAS retains its existing column custody and sampling mechanisms, but sampled cells are authenticated using Merkle authentication paths instead of KZG proofs. This EIP also allows blobs to have power-of-two byte lengths. It represents blob-carrying transactions as [EIP-8141](./eip-8141.md) frame transactions and introduces a LeanDA scheme for [EIP-8288](./eip-8288.md) to instantiate data-availability dependency frames. These dependency frames are satisfied using the block-level recursive STARK construction defined in [EIP-8288](./eip-8288.md).

This EIP does not change column custody assignments, sampling, subnet allocation, or recovery thresholds.

## Motivation

```

このファイルは途中で切り詰められています。[オリジナルを表示](https://github.com/frisitano/EIPs/blob/eip-post-quantum-peerdas/EIPS/eip-9999.md)

特に以下の皆様からのフィードバックを歓迎します:

-   [[glossary/Rollup|ロールアップ]]およびその他の[[glossary/blob|ブロブ]]利用者の方々へ：可変サイズブロブが価値があるか、またどのサイズが必要かについて。
-   [[glossary/Consensus-Client|コンセンサスクライアント]]および[[glossary/Execution-Client|実行クライアント]]チームの方々へ：提案された統合について。
-   PeerDASおよび[[glossary/P2P-networking|ネットワーキング]]貢献者の方々へ：Merkleパスの帯域幅と伝播について。
-   暗号学者およびLean Ethereum貢献者の方々へ：LeanDAゲストプログラムとセキュリティ仮定について。

#### 更新ログ

-   2026-11-01: 初版ドラフト。

#### 外部レビュー

2026-11-01現在なし。

#### 未解決の課題

-   LeanDAゲストプログラムと検証鍵ハッシュを確定する。
-   [[glossary/Execution-layer|実行レイヤー]]、[[glossary/Consensus-Layer|コンセンサス層]]、および[[glossary/P2P-networking|ネットワーキング]]の変更をプロトタイプ化する。
-   [[glossary/Ethereum-validator|バリデータ]]、セミ[[glossary/supernodes|スーパーノード]]、およびスーパーノードの役割における証明生成、[[glossary/Recursive-STARK|再帰的STARK]]集約、およびPeerDASの帯域幅をベンチマークする。
-   可変サイズブロブの需要と好ましいサイズ分布を確認する。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8479-post-quantum-peerdas-and-variable-size-blobs/30167)
