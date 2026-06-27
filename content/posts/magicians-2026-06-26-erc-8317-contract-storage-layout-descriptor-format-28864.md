---
title: 'ERC-8317: コントラクトストレージレイアウト記述子フォーマット'
original_title: 'ERC-8317: Contract Storage Layout Descriptor Format'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8317-contract-storage-layout-descriptor-format/28864
author: alex-forshtat-tbk
date: '2026-06-26'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - execution-layer
  - security
  - wallet
  - ux
  - research
  - state-management
topic_id: '28864'
translated_at: '2026-06-27'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8317: Contract Storage Layout Descriptor Format](https://ethereum-magicians.org/t/erc-8317-contract-storage-layout-descriptor-format/28864) — alex-forshtat-tbk (2026-06-26)

この[[ERC|ERC]]は、あらゆる[[EVM|EVM]]コントラクトのストレージレイアウトメタデータをJSONフォーマットで記述することを標準化する試みです。これは、[[クリア署名 (Clear Signing)|クリア署名]]（[[ERC-7730]](https://ethereum-magicians.org/t/eip-7730-proposal-for-a-clear-signing-standard-format-for-wallets/20403)を実装するハードウェアウォレットによる[[トランザクションシミュレーション (transaction simulation)|トランザクションシミュレーション]]および[[トランザクションアサーション (transaction assertions)|トランザクションアサーション]]機能で使用されることを目的としています。

インタラクションするコントラクトのストレージレイアウトを知ることで、ハードウェアウォレットはトランザクションをローカルでトレースし、次のような情報を表示できます。
`"This transaction sets USDC::balanceOf[vitalik.eth] := 1000"`

スマートコントラクトアカウントとトランザクションアサーションを使用すると、この割り当てはトランザクション検証または事後操作の一部として強制できます。

ここで指定されるフォーマットは、`solc --storage-layout` の出力フォーマットに大きく基づいていますが、Vyper、[ダイヤモンドストレージ](https://ethereum-magicians.org/t/erc-8042-diamond-storage/25718)、[名前空間ストレージ](https://ethereum-magicians.org/t/eip-7201-namespaced-storage-layout/14796)など、Solidityベースではないコントラクトレイアウトを対象とした多くの追加が施されています。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1841)

#### [ERCの追加: コントラクトストレージレイアウト記述子フォーマット](https://github.com/ethereum/ERCs/pull/1841)

`master` ← `forshtat:ideas-storage-layout-erc`

公開日 2026年6月25日 20:36 UTC

 [![forshtatのアバター](https://avatars.githubusercontent.com/u/40541447?v=4) forshtat](https://github.com/forshtat)

[+787 \-0](https://github.com/ethereum/ERCs/pull/1841/files)

これは、[[クリア署名 (Clear Signing)|クリア署名]]、[[トランザクションシミュレーション (transaction simulation)|トランザクションシミュレーション]]、および[[トランザクションアサーション (transaction assertions)|トランザクションアサーション]]のコンテキストでストレージ変更を参照できるようにするため、コントラクトのストレージレイアウトメタデータを標準化する取り組みの非常に初期段階のドラフトWIP PRです。これらはコールドストレージハードウェアウォレットに実装されるため、適切にバージョン管理されたスキーマを持つ最終的なデータ標準が重要です。現在、ストレージレイアウトを共有する必要がある場合、通常は`solc --storage-layout`の出力によって定義されており、この標準はVyperおよびカスタムレイアウトのサポートを追加したこのフォーマットに基づいています。

*1件の投稿 - 1名の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8317-contract-storage-layout-descriptor-format/28864)
