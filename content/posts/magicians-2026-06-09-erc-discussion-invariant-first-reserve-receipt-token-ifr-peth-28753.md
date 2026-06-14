---
title: 'ERC議論: 不変条件優先準備金レシートトークン (IFR-pETH)'
original_title: 'ERC Discussion: Invariant-First Reserve Receipt Token (IFR-pETH)'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-discussion-invariant-first-reserve-receipt-token-ifr-peth/28753
author: EmilianoSolazzi
date: '2026-06-09'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - defi
  - tokenomics
  - security
  - protocol-design
  - economics
  - state-management
topic_id: '28753'
translated_at: '2026-06-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC Discussion: Invariant-First Reserve Receipt Token (IFR-pETH)](https://ethereum-magicians.org/t/erc-discussion-invariant-first-reserve-receipt-token-ifr-peth/28753) — EmilianoSolazzi (2026-06-09)

このスレッドは、不変条件優先準備金レシートトークン (IFR) 標準を定義する提案された[[glossary/EIP|EIP（Ethereum 改善提案）]]に関する議論の場です。

## 概要

IFRは、準備金に裏付けられたトークン向けの[[glossary/ERC|Ethereum Request for Comments (ERC)]]-20互換プリミティブであり、ソルベンシー（支払能力）を外部の準備金証明レポートではなく、トランザクション有効性条件として強制します。

すべての状態遷移は以下を維持します。

T + F == R address(this).balance >= R

ここで：

-   R = 計上済み準備金 (wei)
-   T = 流通中の未償還償還可能トークン供給量
-   F = 準備金内に保持されるプロトコル手数料部分

いずれかの遷移が不変条件に違反する場合、状態がコミットされる前にトランザクションはリバートします。

## 動機

既存の準備金に裏付けられたトークンやETHラッパーは、3つの構造的弱点を共有しています。

1.  ソルベンシーはオフチェーンまたは非公式に報告され、トランザクションごとに強制されないため、インソルベンシー（債務超過）がブロック間で静かに蓄積する可能性があります。
2.  プロトコル手数料はユーザーの裏付けと明示的な帰属なしに混合されるため、インテグレーターがユーザーが償還可能な準備金とプロトコルが所有する準備金を区別することが不可能です。
3.  ウォレット、エクスプローラー、またはダウンストリームプロトコルが準備金の状態、手数料の帰属、または不変条件のステータスを一様に照会するための標準インターフェースが存在しません。

IFRは、状態タプル (R, T, F) を明示化し、すべての状態変更時に両方の不変条件をオンチェーンで強制し、標準ビューインターフェースを定義することで、これら3つすべてに対処します。準備金に裏付けられたDeFiプリミティブの使用が増加するにつれて、標準のソルベンシーインターフェースの欠如が断片化を生み出し、IFRがこれを解決します。

## 状態タプル

| 変数 | 説明 |
| --- | --- |
| R | 計上済み準備金: コントラクトがシステムを裏付けていると見なすETHの総量 |
| T | 流通中の未償還供給量: 流通している償還可能レシートトークンの総量 |
| F | 累積手数料: Rのうちプロトコルが所有する部分 |

## 経済的遷移

| 操作 | R | T | F |
| --- | --- | --- | --- |
| mint(x)（発行） | R + x | T + (x - f) | F + f |
| burn(x)（焼却） | R - (x - f) | T - x | F + f |
| sweep(y)（回収） | R - y | T | F - y |
| absorb(y)（吸収） | R + y | T | F + y |

これら4つの遷移はすべて T + F == R を維持します。

## ユースケース

-   任意のブロックでリアルタイム準備金検証を必要とするDAO財務
-   オンチェーンソルベンシー保証を備えたレンディングプロトコルの担保
-   トランザクションごとの監査可能な裏付けを必要とする保険準備金
-   ユーザーがオフチェーンレポートを信頼することなく裏付けを検証する必要があるプロトコル所有流動性

## インターフェース

この標準は、以下を含む標準ビューインターフェースを定義します。

-   `stateTuple()` — (R, T, F, address(this).balance) を返します
-   `checkInvariant()` — (holds, accountingDiff, shortfall, surplus) を返します
-   `previewMint(grossDeposit)` — (fee, minted) を返します
-   `previewBurn(burnAmount)` — (fee, released) を返します
-   `surplus()` — 計上済み準備金を超えて保持されているETH
-   `userRedeemableBacking()` — T と等しくなるべきです
-   `protocolFeeBacking()` — F と等しくなるべきです

## リファレンス実装

標準的なETH担保実装 (pETH-IFE-1.0.0) は、[[glossary/EIP|EIP（Ethereum 改善提案）]]ドラフトとともに利用可能です。これは以下でテストされています。

-   すべての経済的遷移にわたるFoundry不変条件ファジング
-   プロパティベースのファズテスト (mint, burn, transfer, sweep, surplus)
-   すべての操作に対する正確な生の状態アサーションを含むユニットテスト
-   リエントランシーガード検証

## [[glossary/EIP|EIP（Ethereum 改善提案）]]ドラフト

[github.com/emilianosolazzi/pETH](https://github.com/emilianosolazzi/pETH/blob/main/EIP/eip-draft-ifr.md)

#### [EIP/eip-draft-ifr.md](https://github.com/emilianosolazzi/pETH/blob/main/EIP/eip-draft-ifr.md)

[`main`](https://github.com/emilianosolazzi/pETH/blob/main/EIP/eip-draft-ifr.md)

```
---
eip: <to be assigned>
title: Invariant-First Reserve Receipt Token (IFR) (pETH)
description: A standard for reserve-backed ERC-20 tokens that enforce solvency as a transaction-validity condition via an on-chain accounting invariant.
author: Emiliano Solazzi Griminger
discussions-to: 
status: Draft
type: Standards Track
category: ERC
created: 2026-06-09
requires: 20
copyright: CC0-1.0
---

## Abstract

This EIP defines an **Invariant-First Reserve Receipt Token (IFR)** — an ERC-20-compatible primitive for reserve-backed tokens that enforces solvency as a transaction-validity condition rather than an external proof-of-reserves report.

The token represents claims on a native ETH reserve governed by a strict three-variable state tuple and two invariants that **MUST** hold after every state-changing operation:

```

このファイルは切り詰められています。[オリジナルを表示](https://github.com/emilianosolazzi/pETH/blob/main/EIP/eip-draft-ifr.md)

## 議論のための未解決の質問

1.  手数料計算式は規範的（MUST）であるべきか、助言的（SHOULD）であるべきか？
2.  余剰金吸収は財務の役割に限定されるべきか、それともパーミッションレスであるべきか？
3.  この標準は最小のMAX_FEE_BPS上限を定義すべきか、それとも実装に任せるべきか？
4.  ベース標準で対処すべき[[glossary/ERC|Ethereum Request for Comments (ERC)]]-20担保（ETH以外）の考慮事項があるか、それとも拡張[[glossary/EIP|EIP（Ethereum 改善提案）]]で対処すべきか？

インターフェース設計、手数料モデル、余剰金処理、およびプロトコルインテグレーターからのコンポーザビリティに関する懸念について、フィードバックをお待ちしております。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-discussion-invariant-first-reserve-receipt-token-ifr-peth/28753)
