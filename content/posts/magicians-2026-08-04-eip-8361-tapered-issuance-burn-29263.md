---
title: 'EIP-8361: テーパー型発行量バーン'
original_title: 'EIP-8361: Tapered Issuance Burn'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8361-tapered-issuance-burn/29263'
author: pintail
date: '2026-08-04'
category: EIPs core
tags:
  - eips-core
  - eip
  - consensus
  - economics
  - staking
  - validators
  - protocol-design
topic_id: '29263'
translated_at: '2026-08-05'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8361: Tapered Issuance Burn](https://ethereum-magicians.org/t/eip-8361-tapered-issuance-burn/29263) — pintail (2026-08-04)

EIP-XXXX: テーパー型発行量バーンに関する議論トピック

この[[glossary/EIP|EIP]]は、[[glossary/Ethereum-validator|イーサリアムバリデータ]]報酬の部分的なバーン（焼却）によって、ETHの発行曲線に変更を加えるものです。

**参考文献**

この主要な原則は、[pa7x1による先行研究](https://github.com/pa7x1/ethereum-issuance)に大きく基づいています。重要な改良点である、デューティごとのバーンバージョンは、Anders Elowssonによるものです（[この投稿](https://ethresear.ch/t/properties-of-issuance-offsets-and-increased-penalties-under-low-zero-negative-issuance-policies/25292)に含まれる主要な洞察を参照。彼の[発行に関するFAQ](https://ethresear.ch/t/faq-ethereum-issuance-reduction/19675)も参照してください）。

このトピックに関する過去数年間の追加の先行研究は、[issuance.wtf](https://issuance.wtf)にインデックス化されています。

#### 更新履歴

-   2026-08-04: [初版ドラフト](https://github.com/pintail-xyz/EIPs/blob/edde78eb1feeb285906d5a8deb582c4feaecd6ba/EIPS/eip-draft_tapered_issuance_burn.md)

*25件の投稿 - 14名の参加者*

[全トピックを読む](https://ethereum-magicians.org/t/eip-8361-tapered-issuance-burn/29263)
