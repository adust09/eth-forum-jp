---
title: 'EIP-8433: 0x00バリデータの引退'
original_title: 'EIP-8433: Retire 0x00 validators'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8433-retire-0x00-validators/29808'
author: ensi321
date: '2026-09-30'
category: EIPs core
tags:
  - eips-core
  - consensus
  - validators
  - staking
  - protocol-design
  - economics
  - eip
topic_id: '29808'
translated_at: '2026-10-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8433: Retire 0x00 validators](https://ethereum-magicians.org/t/eip-8433-retire-0x00-validators/29808) — ensi321 (2026-09-30)

[[glossary/EIP|EIP（Ethereum 改善提案）]]-8433に関する議論トピック: [EIPを追加: 0x00バリデータの引退 by ensi321 · Pull Request #12390 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12390)

これは、`[[glossary/0x00-validator|0x00バリデータ]]`の出金資格の非推奨化の第2段階です。[[glossary/EIP-8365|EIP-8365]] ([EIP-8365: 新規0x00バリデータの禁止](https://ethereum-magicians.org/t/eip-8365-bls-withdrawal-credential-retirement/29284)) は、新規の`[[glossary/0x00-validator|0x00バリデータ]]`を作成するデポジットを拒否することで、流入を停止させます。この[[glossary/EIP|EIP]]は、[[glossary/fork|フォーク]]有効化後に公開される[[glossary/epoch|エポック]]（`RETIREMENT_START_EPOCH`）から開始し、標準のイグジットチャーンを通じて残りの`[[glossary/0x00-validator|0x00バリデータ]]`を、[[glossary/epoch|エポック]]ごとに上限付きのレートで退出させます。[[glossary/BLSToExecutionChange|BLSToExecutionChange]]は常に開いているため、引退した[[glossary/Ethereum-validator|バリデータ]]の全残高は`[[glossary/0x01-withdrawal-credential-type|0x01出金資格タイプ]]`に切り替えることで回復可能であり、開始[[glossary/epoch|エポック]]前に切り替えた者は中断なく[[glossary/Ethereum-validator|バリデート]]を継続できます。

これは、[[glossary/All-Core-Devs-Consensus|オールコア開発者会議 - コンセンサス]] #187の議論（すなわち、[[glossary/Hegot|ヘゴタ (Hegotá)]]でのデポジットガード、その後の[[glossary/fork|フォーク]]でのイグジット）を受けて[[glossary/EIP-8365|EIP-8365]]から分離された強制イグジット部分であり、タイムラインはアナウンスに任せるのではなく、[[glossary/EIP|EIP]]のテキストに記載されています。[[glossary/EIP-8367|EIP-8367]]（[[glossary/Balance-sunset|残高サンセット]]、[EIP-8367: 引退したBLSバリデータのための残高サンセット](https://ethereum-magicians.org/t/eip-8367-balance-sunset-for-retired-bls-validators/29299)）はこの[[glossary/EIP|EIP]]を基盤としています。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8433-retire-0x00-validators/29808)
