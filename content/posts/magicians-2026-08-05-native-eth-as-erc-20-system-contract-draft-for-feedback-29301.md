---
title: ネイティブETHをERC-20システムコントラクトとして — フィードバック募集ドラフト
original_title: Native ETH as ERC-20 System Contract – Draft for feedback
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/native-eth-as-erc-20-system-contract-draft-for-feedback/29301
author: crypDuck
date: '2026-08-05'
category: EIPs core
tags:
  - eips-core
  - evm
  - eip
  - smart-contracts
  - gas
  - economics
  - protocol-design
  - state-management
  - tokenomics
topic_id: '29301'
translated_at: '2026-08-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Native ETH as ERC-20 System Contract – Draft for feedback](https://ethereum-magicians.org/t/native-eth-as-erc-20-system-contract-draft-for-feedback/29301) — crypDuck (2026-08-05)

ネイティブETHを[[glossary/ERC|ERC]]-20 [[glossary/System-contract|システムコントラクト]]とする議論トピック（初期ドラフト）

## 更新ログ

-   2026-08-05: 初期ドラフト公開

## 外部レビュー

2026-08-05現在、なし。

## 未解決の課題

-   クライアントチームによる正確な[[glossary/gas|ガス]]定数の最終確認（現在の目標値は例示）
-   AllCoreDevsによるアドレス`0x20`の最終確認
-   [[glossary/EIP-7702|EIP-7702]]の一時的なコード下での残高不変条件に関するエッジケース
-   レガシーコントラクトの`optIn()`メソッドにおけるセレクター衝突リスク

* * *

**背景**

ネイティブETHは現在、統一された[[glossary/ERC|ERC]]-20インターフェースを欠いています。ETHを他のトークンと同じように扱いたいプロトコルは、ネイティブ転送を特別扱いするか、[[glossary/WETH|WETH]]を介してルーティングする必要があります。これにより、継続的なオーバーヘッド、余分なトランザクション、および[[glossary/state-growth|状態成長]]が発生しています。より広範な目標は、ネイティブETHと他のトークンの使用を促進し、そのユーティリティを高め、プロトコルレベルで好ましいトークンとすることで、ETHが主要な交換媒体および計算単位としての役割を強化することです。究極の目標は、「デジタル経済の基軸通貨」としてのETHの地位を高めることです。

**提案**

アドレス`0x20`に[[glossary/Stateful-Keys|ステートフルな]][[glossary/System-contract|システムコントラクト]]を導入します。これは以下の機能を提供します。

-   標準の[[glossary/ERC|ERC]]-20 + [[glossary/ERC-2612|ERC-2612]]インターフェースを通じてネイティブETHの残高を公開します。
-   実際の口座残高を移動させます（トークン残高マッピングは行いません）。
-   受信者コードは決して実行しません。
-   優遇された[[glossary/gas|ガス]]スケジュールを持ち、ネイティブパスが通常の[[glossary/ERC|ERC]]-20や[[glossary/WETH|WETH]]よりも安価になります。

これは、2022年にMagiciansで以前議論されたアイデアを復活させ、更新するものです。

![EIP: ETHをERC20プリコンパイルとして](https://ethereum-magicians.org/user_avatar/ethereum-magicians.org/philogy/48/17402_2.png)

[EIP: ETHをERC20プリコンパイルとして](https://ethereum-magicians.org/t/eip-eth-as-erc20-precompile/12095) [[glossary/EIP|EIP（Ethereum 改善提案）]]

> 簡単な要約 仲介的なラップ/アンラップ手順なしに、ETHを直接[[glossary/ERC|ERC]]-20トークンとして扱い、転送できるようにする[[glossary/Precompile-target|プリコンパイル]]。動機 [[glossary/WETH|WETH]]は非常に人気のあるコントラクトであり、etherscanによるとほぼ常に「トップ30-40の[[glossary/gas|ガス]]消費量」に入っています。[[glossary/WETH|WETH]]は、コントラクトが[[glossary/ERC|ERC]]-20トークンとネイティブ[[glossary/EVM|EVM（イーサリアム仮想マシン）]]資産（イーサリアム上のイーサETH）の両方でトランザクションを行うための統一されたインターフェースを持つという非常に有用な機能を提供します。さらに、そのコンプライアンスによりETHにいくつかの追加機能を与えます…

リポジトリ（README + 両方のドラフト）：

[github.com](https://github.com/crypDuck/eip-drafts)

![GitHub - crypDuck/eip-drafts: あなたが見たい変化になりましょう](https://opengraph.githubassets.com/24df86c28abe1531460d6a04ddc170b0/crypDuck/eip-drafts)

### [GitHub - crypDuck/eip-drafts: あなたが見たい変化になりましょう](https://github.com/crypDuck/eip-drafts)

あなたが見たい変化になりましょう

特定のドラフト：

[github.com/crypDuck/eip-drafts](https://github.com/crypDuck/eip-drafts/blob/main/01-native-eth-as-erc20-precompile.md)

#### [01-native-eth-as-erc20-precompile.md](https://github.com/crypDuck/eip-drafts/blob/main/01-native-eth-as-erc20-precompile.md)

[`main`](https://github.com/crypDuck/eip-drafts/blob/main/01-native-eth-as-erc20-precompile.md)

```
---
title: Native ETH as ERC-20 Precompile
description: Introduce a system contract at address 0x20 that exposes native ETH balances through a standard ERC-20 (and ERC-2612) interface, with a preferential gas schedule that makes the native path cheaper than ordinary ERC-20 tokens or wrapped ETH.
author: crypDuck
discussions-to: https://github.com/crypDuck/eip-drafts/issues
status: Draft
type: Standards Track
category: Core
created: 2026-08-04
requires: 20, 2612, 7528
---

## Abstract

This EIP introduces a system contract at address `0x20` that implements the ERC-20 and ERC-2612 interfaces against native ETH balances. Transfers through the contract move real account balances, emit standard `Transfer` events, and never execute recipient code. The methods are given a preferential gas schedule so that using native ETH via the standard ERC-20 interface is cheaper than the same operations on ordinary ERC-20 tokens or on wrapped ETH. The change removes the need for most WETH wrapping while preserving native ETH semantics for gas payment and value transfers.

Although the title retains the familiar term “precompile” for continuity with prior discussion and existing implementations, the facility is implemented as a stateful system contract. State is required to store allowances and nonces.

## Motivation

```

このファイルは切り詰められています。[オリジナルを表示](https://github.com/crypDuck/eip-drafts/blob/main/01-native-eth-as-erc20-precompile.md)

[[glossary/System-contract|システムコントラクト]]の設計、レガシーコントラクトのオプトインメカニズム、例示的な[[glossary/gas|ガス]]スケジュール、およびあらゆるエッジケースについて、特にフィードバックを歓迎します。同じリポジトリに、[ネイティブETH操作の優遇[[glossary/gas|ガス]]コストに関する関連する付随提案](https://github.com/crypDuck/eip-drafts/blob/main/02-preferential-gas-costs-for-native-eth-operations.md)があります。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/native-eth-as-erc-20-system-contract-draft-for-feedback/29301)
