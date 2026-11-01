---
title: 'ERCの追加: ソブリン型マルチイシューアー・クロスチェーン転送'
original_title: 'Add ERC: Sovereign Multi-Issuer Cross-Chain Transfer'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/add-erc-sovereign-multi-issuer-cross-chain-transfer/30144
author: 0xsptt
date: '2026-10-31'
category: ERCs
tags:
  - ercs
  - cross-chain
  - bridges
  - erc-20
  - evm
  - security
  - protocol-design
  - tokenomics
topic_id: '30144'
translated_at: '2026-11-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Add ERC: Sovereign Multi-Issuer Cross-Chain Transfer](https://ethereum-magicians.org/t/add-erc-sovereign-multi-issuer-cross-chain-transfer/30144) — 0xsptt (2026-10-31)

皆さん、こんにちは。ドラフトの[[ERC|ERC（Ethereum Request for Comments）]]「ソブリン型マルチイシューアー・クロスチェーン転送」について議論を開始したいと思います。これは、[[EVM|EVM (イーサリアム仮想マシン)]]チェーン間で[[ERC-20|ERC-20]]トークンを移動させるためのバーン・アンド・ミント標準です。

プルリクエスト:

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/2133)

#### [ERCの追加: ソブリン型マルチイシューアー・クロスチェーン転送 (#2133)](https://github.com/ethereum/ERCs/pull/2133)

`master` ← `0xsptt:add-erc-cross-chain-transfer`

公開日時 11:57AM - 2026年10月31日 UTC

 [![0xspttのアバター](https://avatars.githubusercontent.com/u/197877162?v=4) 0xsptt](https://github.com/0xsptt)

[+881 \-0](https://github.com/ethereum/ERCs/pull/2133/files)

ERCの追加: ソブリン型マルチイシューアー・クロスチェーン転送。これは、EVMチェーン間でERC-20トークンを移動させるためのバーン・アンド・ミント標準です。

核となるアイデアはシンプルです。トークンはソースチェーンで破棄され、デスティネーションチェーンでミントされるため、何も[[カストディ|カストディ]]されることはなく、総供給量はゾーン間で維持されます。このプロトコルは3つのレイヤーに分かれています。固定サイズのメッセージを運び、デプロイメントドメイン、両チェーン、両リレー、および検証者セットのバージョンと設定にスコープされた[[EIP-712アテステーションプロファイル|閾値EIP-712署名]]を検証するトランスポートコントラクト。転送ライフサイクルとトークンごとのマッピングを所有する転送コントラクト。そして、ミントまたはバーンを許可される唯一のアドレスである実行コントラクトです。

この提案の核心は、マルチイシューアーモデルです。1つのデプロイメントで複数のイシューアーをホストできますが、各イシューアーは自身のトークンを自身の検証者セット（自身の鍵、自身の閾値（例えば、あるイシューアーは10分の7、別のイシューアーは5分の3）、自身のローテーションポリシー）にバインドし、デスティネーション側はデリバリー時にそのバインディングを強制します。その結果、あるイシューアーの署名鍵が侵害されても、別のイシューアーのトークンをミントすることはできません。また、境界を明確に述べています。これは検証者鍵のリスクのみを分離するものです。リレー、ルーター、エグゼキューター、およびそれらのガバナンス/アップグレード管理は、共有された信頼の根源として残ります。ドラフトでは、それ以外を装うことなくそのように明記しています。

この設計は、2つのブリッジの失敗モードによって推進されました。すべてを単一のボルトに集中させるロック・アンド・ミントブリッジと、1つの[[イーサリアムバリデータ|バリデータ]]セットがすべての資産をカバーする共有ブリッジです。関連する既存の取り組みとしては、[[ERC-7802|ERC-7802]]は呼び出し元と検証を未指定のままにしており、[[ERC-7281|ERC-7281]]はブリッジごとのミント制限を扱っており、[[ERC-7786|ERC-7786]]と[[ERC-5164|ERC-5164]]は汎用メッセージングですが、そのどれもがマルチイシューアーのソブリン性と共有インフラストラクチャを組み合わせていません。

これは初期段階の提案であり、皆様からのコメントやフィードバックを歓迎いたします。お読みいただきありがとうございます。議論を楽しみにしています。

**謝辞**

この提案の準備段階において、SNZおよびBlockUnionチームの技術レビューと貴重なフィードバックに感謝いたします。メッセージワイヤーフォーマット、エポックと検証者セットの遷移、および重複排除境界におけるリプレイ保護のエッジケースに関する彼らのコメントは、当初当然と考えていた仮定をより明確にするよう私たちを促しました。

*2投稿 - 2参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/add-erc-sovereign-multi-issuer-cross-chain-transfer/30144)
