---
title: 'EIP-8367: 引退したBLSバリデータの残高サンセット'
original_title: 'EIP-8367: Balance sunset for retired BLS validators'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8367-balance-sunset-for-retired-bls-validators/29299
author: ensi321
date: '2026-08-05'
category: EIPs core
tags:
  - eips-core
  - eip
  - protocol-design
  - validators
  - staking
  - cryptography
  - post-quantum
  - consensus
topic_id: '29299'
translated_at: '2026-08-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8367: Balance sunset for retired BLS validators](https://ethereum-magicians.org/t/eip-8367-balance-sunset-for-retired-bls-validators/29299) — ensi321 (2026-08-05)

[[glossary/EIP|EIP（Ethereum 改善提案）]]-8367に関する議論トピック: [EIPの追加: ensi321による引退したBLSバリデータの残高サンセット · プルリクエスト #12099 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12099)

[[glossary/EIP|EIP]]-8365（[EIP-8365: BLS出金クレデンシャルの引退](https://ethereum-magicians.org/t/eip-8365-bls-withdrawal-credential-retirement/29284)）の補完提案です。[[glossary/EIP|EIP]]-8365が`0x00`バリデータを職務から引退させ、その残高を凍結するのに対し、本[[glossary/EIP|EIP]]は第2段階を提案します。引退した各`0x00`残高は、公開された複数年間の期間にわたって線形にゼロに減少する上限に固定されます。任意の時点でクレデンシャルを`0x01`にローテーションすることで、この削減は停止され、残りの全残高がスイープを通じて解放されます。

目標状態: [[glossary/Post-Quantum|ポスト量子 (PQ)]]への移行までに、すべての`0x00`残高がゼロになるため、`BLSToExecutionChange`とレジストリエントリを削除しても、誰も所有するものを失うことはありません。スケジュール定数は単純な仕様パラメータであり、[[glossary/Post-Quantum|PQ]]のタイムラインが変更された場合、その間の各[[glossary/fork|フォーク]]で再検討可能です。

特に、期間の長さ（公平性と繰り越し）、スケジュール定数、および財産規範の問題（何年もの通知を伴うルールベースの残高削減と、無期限の資金凍結のどちらか。根拠 (Rationale) で議論されています）についてフィードバックを求めています。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/eip-magicians.org/t/eip-8367-balance-sunset-for-retired-bls-validators/29299)
