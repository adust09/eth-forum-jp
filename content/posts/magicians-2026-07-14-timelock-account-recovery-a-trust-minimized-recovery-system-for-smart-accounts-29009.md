---
title: 'タイムロックアカウントリカバリ: スマートアカウント向けの信頼最小化リカバリシステム'
original_title: >-
  Timelock Account recovery: A trust minimized recovery system for Smart
  Accounts
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/timelock-account-recovery-a-trust-minimized-recovery-system-for-smart-accounts/29009
author: iyari
date: '2026-07-14'
category: Primordial Soup
tags:
  - primordial-soup
  - account-abstraction
  - security
  - wallet
  - protocol-design
  - economics
  - mechanism-design
  - cryptography
topic_id: '29009'
translated_at: '2026-07-15'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Timelock Account recovery: A trust minimized recovery system for Smart Accounts](https://ethereum-magicians.org/t/timelock-account-recovery-a-trust-minimized-recovery-system-for-smart-accounts/29009) — iyari (2026-07-14)

私はERC-4337/7579スマートアカウント向けのリカバリメカニズムに取り組んできました。これはガーディアンモデルとは異なるアプローチを取っています。信頼できる第三者にリカバリ権限を与える代わりに、リカバリを誰でも参加できるパーミッションレスな経済ゲームにし、攻撃者が構造的に不利な立場に置かれるようにします。

詳細な解説は[こちら](https://github.com/koinlabs/Timelock-account-recovery)にありますが、要約すると以下の通りです。

リカバリは、`LockValue` ETHを[[glossary/stake|ステーク]]し、`LockTime`チャレンジ期間を待つことで開始されます。この期間中、所有者はリカバリの試みを拒否し、[[glossary/stake|ステーク]]を没収することができます。誰も異議を唱えなければ、リカバリは確定します。これがコアとなるループです。これは新しいパターンではありませんが、アカウントカストディに適用することで、議論する価値のある方法で信頼モデルが変化します。

純粋なメカニズムだけでは不十分であるため、この解説ではさらにいくつかのレイヤーを追加しています。アンチフロントランニングコミットメント、および非アクティブな所有者を標的とする情報を持った攻撃者に対処するための匿名拒否権を持つ隠れたウォッチタワーです。

これはまだ設計段階であり、実装はまだありません。構築を開始する前に、アイデア自体についてフィードバックを収集したいと考えていました。

このシステムについてどう思いますか？他のリカバリメカニズムと共存できるでしょうか？説明されている通りに利用可能になった場合、あなたのアカウントでこれを有効にしますか？改善提案はありますか、あるいはこれはすでに試されたものと重複していますか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/timelock-account-recovery-a-trust-minimized-recovery-system-for-smart-accounts/29009)
