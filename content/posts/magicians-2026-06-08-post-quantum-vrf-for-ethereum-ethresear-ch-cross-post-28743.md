---
title: Ethereum向けポスト量子VRF - ethresear.ch クロスポスト
original_title: Post-Quantum VRF for Ethereum - ethresear.ch cross post
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/post-quantum-vrf-for-ethereum-ethresear-ch-cross-post/28743
author: aryaethn
date: '2026-06-08'
category: Magicians
tags:
  - magicians
  - post-quantum
  - cryptography
  - randao
  - consensus
  - protocol-design
  - vrf
  - hash-based-signatures
topic_id: '28743'
translated_at: '2026-06-15'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Post-Quantum VRF for Ethereum - ethresear.ch cross post](https://ethereum-magicians.org/t/post-quantum-vrf-for-ethereum-ethresear-ch-cross-post/28743) — aryaethn (2026-06-08)

## TL;DR

L\*マイルストーンで、BLSキーは廃止されます。現在の`randao_reveal`メカニズムは完全に機能しなくなります。本稿では、最小限のハッシュベースの修正案を提案します。それは、leanSigシードから導出されたPRFコミットメントVRFであり、`BeaconBlockBody`に含まれるスタンドアロンのWHIR証明によって検証されます。この構成はI\*で有効化されるため、RANDAOはL\*と同時ではなく、それ以前に[[Post-Quantum|ポスト量子 (PQ)]]耐性を獲得します。

リファレンス実装は[GitHub - aryaethn/leanEthereumPostQuantumVRF: "Minimal zkVM, targeting aggregation of hash-based signatures" からフォークされたリポジトリで、その上にPQ VRFを構築。 · GitHub](https://github.com/aryaethn/leanEthereumPostQuantumVRF)にあります。
関連論文は[pq\_vrf\_ethereum.pdf](https://ethresear.ch/uploads/short-url/84UmcdtPbDDAsgyZxM5EG2kd62u.pdf) (657.8 KB)に添付されています。

EFのPQチームにレビューを依頼します: [@JustinDrake](https://ethereum-magicians.org/u/justindrake) @Khovratovich @benedikt-wagner [@will-corcoran](https://ethereum-magicians.org/u/will-corcoran)。

* * *

元の議論は[ethresear.ch](https://ethresear.ch/t/randao-breaks-at-l-a-post-quantum-vrf-for-ethereum/24906)で確認できます。

*1件の投稿 - 1名の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/post-quantum-vrf-for-ethereum-ethresear-ch-cross-post/28743)
