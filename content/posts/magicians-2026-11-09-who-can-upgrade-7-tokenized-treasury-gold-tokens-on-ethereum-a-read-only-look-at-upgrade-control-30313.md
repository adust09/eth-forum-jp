---
title: イーサリアム上の7つのトークン化された国債/金トークンをアップグレードできるのは誰か？アップグレード制御の読み取り専用調査
original_title: >-
  Who can upgrade 7 tokenized treasury/gold tokens on Ethereum? A read-only look
  at upgrade control
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/who-can-upgrade-7-tokenized-treasury-gold-tokens-on-ethereum-a-read-only-look-at-upgrade-control/30313
author: it44
date: '2026-11-09'
category: Magicians
tags:
  - magicians
  - economics
  - defi
  - security
  - smart-contracts
  - protocol-design
  - research
  - tokenomics
  - governance
topic_id: '30313'
translated_at: '2026-11-09'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Who can upgrade 7 tokenized treasury/gold tokens on Ethereum? A read-only look at upgrade control](https://ethereum-magicians.org/t/who-can-upgrade-7-tokenized-treasury-gold-tokens-on-ethereum-a-read-only-look-at-upgrade-control/30313) — it44 (2026-11-09)

イーサリアム上の7つの[[glossary/Tokenized-investment-funds|トークン化投資ファンド]]（国債および金ファンドトークン）のアップグレード制御をチェーンから直接読み取りました。スナップショット: 2026年11月9日。読み取り専用であり、稼働中のコントラクトでは何もテストしていません。

**結果**（調査した7つのトークンであり、市場ランキングではありません）：

-   3つ: アップグレードオーナーは1つの[[glossary/EOA|EOA（外部所有アカウント）]]であり、オンチェーン遅延はありませんでした。
-   2つ: Safe [[glossary/Multisig|マルチシグ（マルチシグネチャ）]]、4-of-7、遅延は見つかりませんでした。
-   1つ: 古い[[glossary/Multisig|マルチシグ（マルチシグネチャ）]]、3-of-6、遅延は見つかりませんでした。
-   1つ: [[glossary/Timelock|タイムロック]]、最低24時間の遅延。

**この調査が**示唆しないこと: いずれのキーも不適切に保管されている（ハードウェアセキュリティモジュール (HSM) / [[glossary/MPC|MPC（マルチパーティ計算）]]または外部からは見えない発行者プロセスによって保護されている可能性がある）、資産が危険にさらされている、または他の制御（ポーズロール、ミント/バーンロール、法的、オフチェーン）が欠けている、ということではありません。これは、オンチェーンでトークンコードを変更できるのが誰か、という点のみを示します。

**再現方法**: 公開RPCを使って再現できます。以下の3つのパターンで7つすべてをカバーします。

A) [[glossary/EIP-1967-proxy|EIP-1967プロキシ]]: 管理者スロットを読み取り、その管理者からオーナーを問い合わせます。

```
cast storage <token> 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103
cast call <admin> "owner()(address)"
```

B) トークン/プロキシ自体にオーナーが保存されている場合:

```
cast call <token> "owner()(address)"
```

C) 古いプロキシの管理者スロット:

```
cast storage <token> 0x10d6a54a4754c8869d6886b5f5d7fbfa5b4522237ea5c60d11bc4e7a1ff9390b
```

次に、オーナーが何であるかを確認します:

```
cast code <owner>          # empty = externally owned
getThreshold()             # Safe
getMinDelay()              # timelock
```

トークンの名前は挙げていません。これは特定の発行者ではなく、パターンに関するものです。フィードバックをいただきたい質問: 「オンチェーン遅延がない」という点は、[[glossary/Tokenized-investment-funds|トークン化投資ファンド]]にとってフラグを立てるべき適切な事柄でしょうか？また、他にどのような制御シグナル（ポーズロール、ミント/バーンロール）を標準チェックに追加する価値があるでしょうか？

Xでの短縮版: [it it on X: "Who can change the code of a tokenized treasury or gold fund on Ethereum, and how fast? I read the upgrade control of 7 of them straight from the chain. Snapshot: 9 Nov 2026. Read-only; nothing was tested on live contracts." / X](https://x.com/itpvl4/status/2119636253859885256)
修正を歓迎します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/who-can-upgrade-7-tokenized-treasury-gold-tokens-on-ethereum-a-read-only-look-at-upgrade-control/30313)
