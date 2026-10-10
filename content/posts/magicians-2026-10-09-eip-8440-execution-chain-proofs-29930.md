---
title: 'EIP-8440: 実行チェーン証明'
original_title: 'EIP-8440: Execution Chain Proofs'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8440-execution-chain-proofs/29930'
author: frisitano
date: '2026-10-09'
category: EIPs
tags:
  - eips
  - eip
  - execution-layer
  - scaling
  - zk
  - cryptography
topic_id: '29930'
translated_at: '2026-10-10'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8440: Execution Chain Proofs](https://ethereum-magicians.org/t/eip-8440-execution-chain-proofs/29930) — frisitano (2026-10-09)

[[glossary/EIP|EIP（Ethereum 改善提案）]]-8440「実行チェーン証明」に関する議論トピックです。コンセンサス層の仕様は[ethereum/consensus-specs#5725](https://github.com/ethereum/consensus-specs/pull/5725)をご覧ください。

実行チェーン証明により、[[glossary/Execution-layer|実行レイヤー]]のチェーン同期が定数時間になります。ノードは1つの再帰的証明を検証することで、ヘッドビーコンブロックから証明の起点までのすべてのペイロードの有効な実行と、それらのビーコンチェーンへのバインディングを確立します。弱い主観性チェックポイントからの同期は、約1.1 x 10^5個のペイロードと21 GBのペイロードデータの再実行を、単一の検証に置き換えます。

#### 更新ログ

-   2026-10-09: 初版ドラフト、[[glossary/EIP|EIP（Ethereum 改善提案）]] PR ([https://github.com/ethereum/EIPs/pull/12464](https://github.com/ethereum/EIPs/pull/12464))

#### 外部レビュー

2026-10-10現在なし。

#### 未解決の問題

2026-10-10現在なし。

*1件の投稿 - 1名の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/eip-8440-execution-chain-proofs/29930)
