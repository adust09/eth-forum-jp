---
title: 'EIP-8484: SLOTDURATION オペコード'
original_title: 'EIP-8484: SLOTDURATION Opcode'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8484-slotduration-opcode/30276'
author: Amxx
date: '2026-11-04'
category: EIPs core
tags:
  - eips-core
  - eip
  - evm
  - consensus
  - layer2
  - protocol-design
  - execution-layer
  - slotduration-opcode
topic_id: '30276'
translated_at: '2026-11-05'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8484: SLOTDURATION Opcode](https://ethereum-magicians.org/t/eip-8484-slotduration-opcode/30276) — Amxx (2026-11-04)

こんにちは、

新しいオペコード `SLOTDURATION` のPRを公開しました。これは現在の[[glossary/slot-time|スロット]]の期間をミリ秒単位でスタックにプッシュします。

PR: [Add EIP: SLOTDURATION Opcode by Amxx · Pull Request #12619 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12619)

### 未解決の質問:

1.  **現在の期間か、過去のルックアップか？** ドラフトでは現在の期間を返します。根拠 (Rationale) では、オペコードがスロット番号を受け取り、そのスロットで有効な期間を返す、または将来のスロットに対しては `0` を返す代替案が記述されています。これにより、Lidoのようなコントラクトは期間変更をまたいで正しいタイムスタンプを計算できるようになります。コストとしては、[[glossary/execution-layer|実行レイヤー]]が期間スケジュールを保持する必要がある点です。どちらがより有用でしょうか？
2.  **ミリ秒。** `SLOT_DURATION_MS` に合わせて、また100〜250ミリ秒のブロックタイムを持つ[[glossary/Layer-2|L2]]をサポートするために、ミリ秒を選択しました。異論はありますか？
3.  **`0` は「定期的な間隔なし」を意味する。** これはオンデマンドチェーンにとって適切なセンチネル値でしょうか？また、[[glossary/Execution-Client|L1実行クライアント]]は引き続き `0` を拒否すべきでしょうか？
4.  **実行レイヤーのデカップリング。** EIP-8198は意図的に実行レイヤーをスロット期間について認識させないようにしています。このドラフトではELを構成不要に保っていますが、ヘッダーフィールドを追加しています。これはEIP-8198の著者やクライアントチームにとって許容できるものでしょうか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8484-slotduration-opcode/30276)
