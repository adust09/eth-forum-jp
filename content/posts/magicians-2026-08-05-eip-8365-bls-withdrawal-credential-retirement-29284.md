---
title: 'EIP-8365: BLS引き出しクレデンシャルの廃止'
original_title: 'EIP-8365: BLS withdrawal credential retirement'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8365-bls-withdrawal-credential-retirement/29284
author: ensi321
date: '2026-08-05'
category: EIPs core
tags:
  - eips-core
  - consensus
  - validators
  - staking
  - proof-of-stake
  - protocol-design
  - post-quantum
topic_id: '29284'
translated_at: '2026-08-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8365: BLS withdrawal credential retirement](https://ethereum-magicians.org/t/eip-8365-bls-withdrawal-credential-retirement/29284) — ensi321 (2026-08-05)

EIP-8365に関する議論トピック: [Add EIP: BLS withdrawal credential retirement by ensi321 · Pull Request #12097 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12097)

この提案は、`0x00` (BLS) 引き出しクレデンシャルタイプを廃止するものです。アクティブな`0x00` [[glossary/Ethereum-validator|イーサリアムバリデータ]]は、[[glossary/epoch|エポック]]ごとの上限レートで退出させられ、新規`0x00`バリデータを作成するデポジットは処理されなくなります。`BLSToExecutionChange`は引き続き利用可能であるため、廃止されたバリデータの全残高は、`0x01`にローテーションすることでいつでも回復可能です。

簡単な動機としては、Capella以降3年間の変換期間を経て、`0x00`のバリデータ数は約9,300（約343k ETH）で停滞しており、そのうち数百はプロトコルを含め誰も削除できない失われた鍵である可能性が高いです。これらのバリデータは[[glossary/Post-Quantum|ポスト量子 (PQ)]]鍵を登録できず、このクレデンシャルタイプをPQ時代に持ち越すことは、強化された`BLSToExecutionChange`機構を無期限に維持することを意味します。これは段階的な非推奨化（廃止、引き出し、削除）の第一段階です。残高の引き出しを扱う関連[[glossary/EIP|EIP（Ethereum 改善提案）]]については、別途スレッドが立てられます。

現在の`0x00`バリデータに関するデータ: [Dealing with Legacy 0x00 Validators - HackMD](https://hackmd.io/@adrninistrator1/B127JkR7Gx)

`MAX_RETIREMENTS_PER_EPOCH`のサイズ設定、フォーク境界でのデポジットガードのエッジケース、および`0x00`クレデンシャルをまだ保持しているオペレーターからのフィードバックを特に求めています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8365-bls-withdrawal-credential-retirement/29284)
