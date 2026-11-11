---
title: 'EIP-8488: ガス再価格設定のためのバージョン付きオペコード'
original_title: 'EIP-8488: Versioned Opcodes for Gas Repricing'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8488-versioned-opcodes-for-gas-repricing/30332
author: SamWilsn
date: '2026-11-10'
category: EIPs core
tags:
  - eips-core
  - eip
  - execution-layer
  - evm
  - gas
  - fee-market
  - protocol-design
topic_id: '30332'
translated_at: '2026-11-11'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8488: Versioned Opcodes for Gas Repricing](https://ethereum-magicians.org/t/eip-8488-versioned-opcodes-for-gas-repricing/30332) — SamWilsn (2026-11-10)

[github.com/ethereum/EIPs](https://github.com/ethereum/EIPs/pull/12638)

#### [EIPの追加: ガス再価格設定のためのバージョン付きオペコード (#12638)](https://github.com/ethereum/EIPs/pull/12638)

`master` ← `lglisic60:eip-forward-compatible-gas-repricing`

2026年11月8日 07:40PM (UTC) に公開

 [![](https://avatars.githubusercontent.com/u/66660218?v=4) lglisic60](https://github.com/lglisic60)

[+111 \-0](https://github.com/ethereum/EIPs/pull/12638/files)

前方互換性のある[[glossary/repricing|ガス再価格設定]]をV2オペコードセットを介して提案する[[glossary/Draft|ドラフト]] [[glossary/EIP|EIP（Ethereum 改善提案）]]を追加します。[…](https://github.com/ethereum/EIPs/pull/12638)
- 新しいコントラクトは、[[glossary/EIP-8037|EIP-8037 (二次元ガス)]]/EIP-8038のガススケジュールを適用するV2オペコードを使用する必要があります。
- 既存のコントラクトはレガシーなスケジュールを維持します。
- `DELEGATECALL_V2` は、ターゲットもV2である必要があります。
- [[glossary/GAS-opcode|GASオペコード]]、`GASLIMIT` などのガス内省オペコードはV2から省略されます。
議論: https://x.com/Leo\_Glisic/status/2118884109393215604 (Magiciansスレッドはアクセス不可)

*3投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8488-versioned-opcodes-for-gas-repricing/30332)
