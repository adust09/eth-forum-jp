---
title: 'EIPの追加: 境界付きストレージクレジットとデビット'
original_title: 'Add EIP: Bounded Storage Credit and Debit'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/add-eip-bounded-storage-credit-and-debit/30477
author: cskiraly
date: '2026-11-23'
category: EIPs core
tags:
  - eips-core
  - eip
  - execution-layer
  - state-management
  - scaling
  - protocol-design
  - block-building
  - bounded-storage-credit-debit
  - scredit-sdebit
topic_id: '30477'
translated_at: '2026-11-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Add EIP: Bounded Storage Credit and Debit](https://ethereum-magicians.org/t/add-eip-bounded-storage-credit-and-debit/30477) — cskiraly (2026-11-23)

[[EIP-7519]]の後継として、**境界付きストレージクレジットとデビット** ([#12707](https://github.com/ethereum/EIPs/pull/12707)) を提案します。

`SCREDIT` はストレージスロットに指定された量を加算し、`SDEBIT` は減算します。どちらの操作も、変更前後のスロットの値が、オペランドとして与えられた下限と上限の範囲内にある場合にのみ実行されます。両オペコードは成功フラグをプッシュし、スロットの値はプッシュしません。チェックが失敗した場合、スロットは変更されず、変更されなかった値を保存するのと同じガスを消費します。上限は、各残高ワードの最上位ビットがブラックリストフラグであるUSDCの残高レイアウトに対応します。下限は最低残高などのフロアを示します。成功フラグにより、コントラクトは独自のエラーハンドリングを維持できます。

[[Glamsterdam|グラムステルダム]]の[[ブロックレベルアクセスリスト (BAL)|ブロックレベルアクセスリスト]]がアクティブになれば、ブロック検証にわずかなメリットが期待されます。主なユースケースは[[マルチパーティブロック構築 (MPBC)|並行ブロック構築]]であり、加算的な更新は、別のブロックが同じ残高を変更した後でも有効なままにできます。

私たちは2026年11月9日の[[メインネット|メインネット]]ブロック501個をリプレイし、[[Rapidblocks|Rapidblocks]]の[[入力ルール (Input rule)|入力ルール]] ([https://ethresear.ch/t/rapidblocks-minimizing-merge-conflicts-in-the-block-building-pipeline/22590](https://ethresear.ch/t/rapidblocks-minimizing-merge-conflicts-in-the-block-building-pipeline/22590)) に基づいて1つの並行ブロックをモデル化するためにスライスに分割しました。このルールはトランザクションの88.0%を受け入れました。`min = 0` の形式が適合する場所でこれらのオペレーションを使用した場合、ルールが除外したトランザクションの中から、[[EIP-7519]]のセマンティクスでは1.42ポイントであったのに対し、2.26パーセンテージポイントのトランザクションを回復できると推定されます。この推定は、1つのウィンドウで記録されたチェックから、コントラクトコードを固定したまま得られたものです。正確なステート入力を必要とするベースラインに対して、どのストレージアクセスが変更された値を許容できるかを推論するより広範なリプレイでは、回復された4,355個のトランザクションのうち、USDCが38%、USDTが36%に現れました（これらの割合は重複する可能性があります）。どちらのリプレイも、シーケンシャル実行用に書かれた今日のコントラクトと1つのウィンドウのトラフィックを使用しています。これらは、これらのオペレーションが既存の更新を置き換えることができる場所を示すものであり、それらを念頭に置いて設計されたコントラクトがどのように使用するかを示すものではありません。

go-ethereumのプロトタイプは、OsakaおよびAmsterdamの下で、[[EIP|EIP]]のテストテーブルのすべての行について、成功フラグ、残された値、ガス、および返金を提供します。

*1件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/add-eip-bounded-storage-credit-and-debit/30477)
