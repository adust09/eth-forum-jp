---
title: 'B(l)o(h)ard: 最小限のオンチェーンメッセージボード'
original_title: 'B(l)o(h)ard: a minimal on-chain message board'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/b-l-o-h-ard-a-minimal-on-chain-message-board/29639
author: roberto-bayardo
date: '2026-09-10'
category: Primordial Soup
tags:
  - primordial-soup
  - applications
  - smart-contracts
  - decentralization
  - protocol-design
  - ux
  - state-management
  - security
  - governance
topic_id: '29639'
translated_at: '2026-09-11'
translator: gemini-2.5-flash
---

> [!note] 原文
> [B(l)o(h)ard: a minimal on-chain message board](https://ethereum-magicians.org/t/b-l-o-h-ard-a-minimal-on-chain-message-board/29639) — roberto-bayardo (2026-09-10)

デザイン: [blohard protocol design](https://blohard.social/design.html)

Base SepoliaおよびBase [[mainnet|メインネット]]で稼働中の概念実証: [https://blohard.social](https://blohard.social)

アイデアの概要

1つの不変でオーナーレスな[[glossary/smart-contracts|スマートコントラクト]]が、メッセージのテーブルを保持します。各メッセージは2つのストレージスロットで構成されます。コンテンツのkeccak256ハッシュ、作成者、親リンク（トップレベル投稿の場合はゼロ）、およびタイムスタンプです。コンテンツバイトは任意のホスト上に[[glossary/Off-chain-coordination|オフチェーン]]で存在し、クライアントはハッシュによってそれらを取得し、検証します。返信は親を持つメッセージです。返信を受け入れる前に、コントラクトは親の作成者によって選ばれた読み取り専用コントラクトである「ゲート」に対し、このアカウントが返信できるかどうかを問い合わせます。ゲートは、ブロックリスト、フォロワー限定、認証済み人間限定など、あらゆるルールを表現できます。作成者はアカウント全体に適用されるデフォルトのゲートを1つ設定し、メッセージごとにそれを上書きできます。[[glossary/Token|トークン]]、手数料、管理者キー、プロトコル全体のモデレーターは存在しません。

フィードバックをお待ちしております。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/b-l-o-h-ard-a-minimal-on-chain-message-board/29639)
