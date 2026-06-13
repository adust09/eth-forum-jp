---
title: 'EIP-8298: SETCODEFROM コード再利用命令'
original_title: 'EIP-8298: SETCODEFROM Code Reuse Instruction'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8298-setcodefrom-code-reuse-instruction/28779
author: colinlyguo
date: '2026-06-12'
category: EIPs core
tags:
  - eips-core
  - eip
  - evm
  - state-management
  - gas
  - account-abstraction
  - cryptography
  - post-quantum
topic_id: '28779'
translated_at: '2026-06-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8298: SETCODEFROM Code Reuse Instruction](https://ethereum-magicians.org/t/eip-8298-setcodefrom-code-reuse-instruction/28779) — colinlyguo (2026-06-12)

この提案は、ACDEコール中に提起されたアイデアに由来します。それは、[[glossary/EIP|EIP]]-7851と[[glossary/EIP|EIP]]-8058の目標を、より低レベルのコード採用プリミティブに統合するというものです。

[[glossary/EIP|EIP]]-8298は、現在のEVMアカウントが既存のデプロイ済みコントラクトのコードハッシュを採用できるようにするEVM命令である`SETCODEFROM`を導入します。ソースは生のコードハッシュではなく、ライブアカウントアドレスであるため、採用されるコードは現在のコンセンサス状態に紐付けられます。

この提案には主に2つの用途があります。

-   コントラクトのバイトコード再利用とデプロイメント経済性: これは、[[glossary/EIP|EIP]]-8058が対象とするデプロイコストの問題に対処します。同一のランタイムコードを持つコントラクトは、インスタンスごとのストレージを初期化した後、クライアントが既に保存しているバイトコードに対して再度コードデポジットガスを支払うことなく、共有デプロイ済みコードを採用できます。これは、例えば[[glossary/EIP|EIP]]-8037の下で、コントラクトのデプロイがステート成長により密接に[[glossary/repricing|再価格設定]]される場合に特に関連性が高まります。
-   ECDSA権限が無効化されたEOA移行: これは、[[glossary/EIP|EIP]]-7851が対象とするアカウント移行の問題に対処します。移行コードは、[[glossary/Post-Quantum|ポスト量子 (PQ)]]ウォレット状態を含むウォレット固有のステートを初期化し、その後、通常のウォレットコードを採用できます。アカウントが通常のデプロイ済みコードを持つと、[[glossary/EIP|EIP]]-3607の下でプロトコルレベルのECDSAトランザクション生成が無効になり、古いECDSAキーを介した[[glossary/EIP-7702|EIP-7702]]による再委任は利用できなくなります。

#### 更新ログ

-   2026-06-12: [初回ドラフト](https://github.com/ethereum/EIPs/pull/11800)

#### 外部レビュー

2026-06-12現在、なし。

#### 未解決の問題

2026-06-12現在、なし。

*4投稿 - 3参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/eip-8298-setcodefrom-code-reuse-instruction/28779)
