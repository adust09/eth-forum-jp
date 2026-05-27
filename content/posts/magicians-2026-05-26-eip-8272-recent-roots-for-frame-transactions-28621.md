---
title: 'EIP-8272: フレームトランザクションの最近のルート'
original_title: 'EIP-8272:Recent Roots for Frame Transactions'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8272-recent-roots-for-frame-transactions/28621
author: soispoke
date: '2026-05-26'
category: EIPs core
tags:
  - eips-core
  - eip
  - execution-layer
  - smart-contracts
  - state-management
  - frame-transactions
topic_id: '28621'
translated_at: '2026-05-27'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8272:Recent Roots for Frame Transactions](https://ethereum-magicians.org/t/eip-8272-recent-roots-for-frame-transactions/28621) — soispoke (2026-05-26)

[EIP-8272: フレームトランザクションの最近のルート · Pull Request #11726 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/11726)に関する議論トピック。

## 概要

[[glossary/EIP|EIP（Ethereum 改善提案）]]-8141のフレームトランザクションは、検証中に可変ストレージを読み取ることなく、最近のルートを参照できる。ルートソースは、ルートをシステムコントラクトに書き込む。各ルートは `(source_id, slot)` でキー付けされ、`source_id` は書き込み元アドレスとソルトから派生する。フレームトランザクションは、以下の形式で最近のルート参照を宣言できる。

```
(source_id, slot, root)
```

フレーム実行前に、クライアントは各参照をトランザクションのプリステートに対してチェックする。チェックは、指定されたルートが指定されたソースとスロットに保存されており、かつそのスロットがまだ最近のものである場合にのみ成功する。検証コードは、トランザクションのイントロスペクションを通じて、検証済みの参照を読み取ることができる。

# 動機

[[glossary/EIP|EIP（Ethereum 改善提案）]]-8141の検証は、パブリックなメモリプールにおいて、他のアカウントやアプリケーションによって制御される任意のストレージを読み取るべきではない。一部の検証ルールは、プライバシーツリーのルート、ウォレットの認証ルート、アカウント検証ルートなど、最近のアプリケーション状態に依存する必要がある。

最近のルート参照により、トランザクションは署名されたトランザクションエンベロープ内で最近のルートを明示的に指定できる。各参照は1つのシステムコントラクトストレージキーにマッピングされ、検証コードが実行される前にチェックできる。

例えば、プライバシーアプリケーションはコミットメントのツリーを保持し、最近のツリールートに対して使用を証明する。このEIPにより、アプリケーションはスロットごとにルートを書き込み、使用トランザクションは検証中にアプリケーションの変更されるツリー状態を読み取るのではなく、それらのルートの1つを直接参照する。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8272-recent-roots-for-frame-transactions/28621)
