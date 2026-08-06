---
title: ネイティブETH操作のガス代優遇 — フィードバック用ドラフト
original_title: Preferential Gas Costs for Native ETH Operations – Draft for feedback
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/preferential-gas-costs-for-native-eth-operations-draft-for-feedback/29302
author: crypDuck
date: '2026-08-05'
category: EIPs core
tags:
  - eips-core
  - economics
  - fee-market
  - evm
  - eip
  - protocol-design
  - state-management
topic_id: '29302'
translated_at: '2026-08-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Preferential Gas Costs for Native ETH Operations – Draft for feedback](https://ethereum-magicians.org/t/preferential-gas-costs-for-native-eth-operations-draft-for-feedback/29302) — crypDuck (2026-08-05)

ネイティブETH操作のガス代優遇に関する議論トピック（初期ドラフト）

## 更新履歴

-   2026-08-05: 初期ドラフト公開

## 外部レビュー

2026-08-05現在なし。

## 未解決の課題

-   並行するステートアクセス変更（例: [[glossary/EIP|EIP]]-8038）に対するベンチマーク後、クライアントチームによる0.75係数の最終確認
-   この係数を`SELFBALANCE`や`CALLVALUE`にも適用すべきか（現在未定）
-   `[[glossary/SELFDESTRUCT|SELFDESTRUCT]]`における残余価値の処理（もし関連性がある場合）

* * *

**背景**

これは、ETHの「デジタル準備通貨」としての役割を強化することを目的とした2番目の提案です。これを達成する1つの方法は、ネイティブ残高を使用する操作を、他のトークンでの同等の操作よりも構造的に安価で便利にすることです。単純なトップレベルの転送はすでにコスト面で優位性がありますが、内部の価値を持つ呼び出しは依然としてかなりの追加料金を支払い（そして他のどのトークンを使用するよりも優位性はありません）、この摩擦を減らすことは、発行や[[glossary/staking|ステーキング]]の経済学を変更するのではなく、需要側の改善として意図されています。

**提案**

乗法係数0.75を以下に適用します。

-   `value > 0`の場合の`CALL`、`CALLCODE`、`CREATE`、`CREATE2`の価値転送ガスコンポーネント
-   `BALANCE`のコールドおよびウォームアクセスコスト

価値転送コンポーネントは、イエローペーパーの`G_callvalue`および[[glossary/EIP|EIP]]-8038の分解（`ACCOUNT_WRITE + CALL_STIPEND`）を参照して定義されます。

リポジトリ（README + 両方のドラフト）：

[github.com](https://github.com/crypDuck/eip-drafts)

![](https://opengraph.githubassets.com/24df86c28abe1531460d6a04ddc170b0/crypDuck/eip-drafts)

### [GitHub - crypDuck/eip-drafts: あなたが見たい変化になりましょう](https://github.com/crypDuck/eip-drafts)

あなたが見たい変化になりましょう

特定のドラフト：

[github.com/crypDuck/eip-drafts](https://github.com/crypDuck/eip-drafts/blob/main/02-preferential-gas-costs-for-native-eth-operations.md)

#### [02-preferential-gas-costs-for-native-eth-operations.md](https://github.com/crypDuck/eip-drafts/blob/main/02-preferential-gas-costs-for-native-eth-operations.md)

[`main`](https://github.com/crypDuck/eip-drafts/blob/main/02-preferential-gas-costs-for-native-eth-operations.md)

```
---
title: Preferential Gas Costs for Native ETH Operations
description: Apply a preferential gas factor to the value-transfer component of CALL/CREATE-family opcodes and to BALANCE access costs, reinforcing native ETH as the preferred medium of exchange and unit of account.
author: crypDuck
discussions-to: https://github.com/crypDuck/eip-drafts/issues
status: Draft
type: Standards Track
category: Core
created: 2026-08-04
requires: 2929, 3529
related: Native ETH as ERC-20 Precompile
---

## Abstract

This EIP applies a multiplicative preferential factor to the value-transfer gas component of `CALL`, `CALLCODE`, `CREATE` and `CREATE2` when `value > 0`, and to both the cold and warm access costs of `BALANCE`. The change makes operations that move or query native ETH balances cheaper relative to the same operations on other tokens, reinforcing ETH as the preferred medium of exchange, unit of account, and digital reserve asset.

## Motivation

A plain native ETH transfer costs 21 000 gas. A typical ERC-20 transfer costs 45 000–65 000 gas. Balance queries via `BALANCE` are also cheaper than an ERC-20 `balanceOf`. These structural differences already favour native ETH for simple top-level transfers.
```

このファイルは切り詰められています。[オリジナルを表示](https://github.com/crypDuck/eip-drafts/blob/main/02-preferential-gas-costs-for-native-eth-operations.md)

この係数の大きさ、スケーリングされるコンポーネントの正確な定義、および超低コストのコンテキストオペコードも含まれるべきかについて、特にフィードバックを歓迎します。同じリポジトリには、[0x20にネイティブETH [[glossary/ERC|ERC]]-20インターフェースを導入する関連する付随提案](https://github.com/crypDuck/eip-drafts/blob/main/01-native-eth-as-erc20-precompile.md)（[議論トピック](https://ethereum-magicians.org/t/native-eth-as-erc-20-system-contract-draft-for-feedback/29301)）があります。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/preferential-gas-costs-for-native-eth-operations-draft-for-feedback/29302)
