---
title: 'ERC-8474: ERC-20 遅延アンロック'
original_title: 'ERC-8474: ERC-20 Delayed Unlock'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8474-erc-20-delayed-unlock/30177'
author: shargon
date: '2026-11-02'
category: ERCs
tags:
  - ercs
  - eip
  - security
  - account-abstraction
  - smart-contracts
  - ux
  - defi
topic_id: '30177'
translated_at: '2026-11-03'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8474: ERC-20 Delayed Unlock](https://ethereum-magicians.org/t/erc-8474-erc-20-delayed-unlock/30177) — shargon (2026-11-02)

ERC-8474、すなわちホルダーが制御する出金転送ロック（ブロックベースのアンロック遅延と独立したロックガーディアンを備える）のためのオプトインのERC-20拡張について、フィードバックを募集します。

提案と仕様: [Add ERC: ERC-20 Delayed Unlock by shargon · Pull Request #2129 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/2129)

## 動機

コールドストレージ (Cold storage) は、静止状態の鍵を保護しますが、侵害された署名インターフェースは、意図しない有効な署名を生成する可能性があります。この目標は、保護されたトークンがアカウントから移動する前に、オンチェーン (on-chain) での応答期間を提供することです。

## 提案される挙動

-   ホルダーは、ゼロ以外のクールダウン期間と別のガーディアンを設定して登録し、直ちに出金（正の残高減少）をロックします。
-   ホルダーのみがアンロックを要求できます。転送は、要求ブロックにクールダウン期間を加えたブロックまでブロックされたままになります。
-   ホルダーまたはガーディアンは直ちに再ロックし、カウントダウンをキャンセルできます。ガーディアンは、その役割によって資金をアンロックしたり転送したりすることはできません。
-   この最小限のインターフェースでは、登録、クールダウン期間、およびガーディアンは不変です。
-   強制は、`transfer`、`transferFrom`、`burns`、自己転送、および既存の承認を通じた支出を含む、その他の正のデビットパス（残高減少経路）を対象とします。入金転送は引き続き可能です。
-   この提案は、インターフェース、イベント、および状態遷移を標準化しますが、特定の[実装を義務付けるものではありません。

## トレードオフとフィードバックの募集

これはトークン側のサポートが必要であり、既存の不変トークンに後付けすることはできません。転送を元に戻したり、アンロック期限にガーディアントランザクションが順序付けで勝利することを保証したりするものではありません。侵害されたガーディアンはサービス拒否を引き起こす可能性があり、不変のパラメータはリカバリーにおけるトレードオフを生み出します。

特に、インターフェースの相互運用性価値、不変の登録モデル、ガーディアンのリカバリーに関するトレードオフ、およびウォレット (wallet) やカストディアン (custodian) との統合についてフィードバックを歓迎します。

著者: Fernando Díaz Toledano ([@shargon](https://ethereum-magicians.org/u/shargon)).

*3投稿 - 3参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8474-erc-20-delayed-unlock/30177)
