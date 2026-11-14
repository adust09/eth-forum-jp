---
title: 'EIP-8496: ブロックレベルアクセスリストにおけるコード読み取り'
original_title: 'EIP-8496: Code Reads in Block-Level Access Lists'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8496-code-reads-in-block-level-access-lists/30354
author: LukaszRozmej
date: '2026-11-12'
category: EIPs core
tags:
  - eips-core
  - eip
  - execution-layer
  - state-management
  - cryptography
  - scaling
topic_id: '30354'
translated_at: '2026-11-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8496: Code Reads in Block-Level Access Lists](https://ethereum-magicians.org/t/eip-8496-code-reads-in-block-level-access-lists/30354) — LukaszRozmej (2026-11-12)

[[EIP|EIP]]-7928の`AccountChanges`エントリに`code_hash`要素を追加します。これは、ブロックがアカウントのブロック前バイトコードをロードする際にそのKeccak-256ハッシュを格納し、それ以外の場合は空となります。これにより、[[Runtime-block-level-access-lists|BAL（ランタイムブロックレベルアクセスリスト）]]は、ブロックが読み取るブロック前のすべてのステートを識別するため、ブロックを実行することなく、ブロック、そのBAL、およびステートスナップショットからステートレスまたは証明入力を組み立てることができます。

[github.com/ethereum/EIPs](https://github.com/ethereum/EIPs/pull/12658)

#### [EIPの追加: ブロックレベルアクセスリストにおけるコード読み取り (#12658)](https://github.com/ethereum/EIPs/pull/12658)

`master` ← `LukaszRozmej:eip/bal-code-reads`

opened 12:12AM - 12 Nov 26 UTC

 [![](https://avatars.githubusercontent.com/u/12445221?v=4) ルカシュ・ロズメイ](https://github.com/LukaszRozmej)

[+193 \-0](https://github.com/ethereum/EIPs/pull/12658/files)

[[EIP|EIP]]-7928の`AccountChanges`エントリに`code_hash`要素を追加します。これは、ブロックがアカウントのブロック前バイトコードをロードする際にそのKeccak-256ハッシュを格納し、それ以外の場合は空となります。これにより、[[Runtime-block-level-access-lists|BAL（ランタイムブロックレベルアクセスリスト）]]は、ブロックが読み取るブロック前のすべてのステートを識別するため、ブロックを実行することなく、ブロック、そのBAL、およびステートスナップショットからステートレスまたは証明入力を組み立てることができます。

*1 post - 1 participant*

[Read full topic](https://ethereum-magicians.org/t/eip-8496-code-reads-in-block-level-access-lists/30354)
