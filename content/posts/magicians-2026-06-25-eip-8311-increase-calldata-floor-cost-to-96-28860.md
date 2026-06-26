---
title: 'EIP-8311: コールデータフロアコストを96に引き上げ'
original_title: 'EIP-8311: Increase Calldata Floor Cost to 96'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8311-increase-calldata-floor-cost-to-96/28860
author: misilva73
date: '2026-06-25'
category: EIPs
tags:
  - eips
  - eip
  - gas
  - fee-market
  - execution-layer
  - calldata-pricing
topic_id: '28860'
translated_at: '2026-06-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8311: Increase Calldata Floor Cost to 96](https://ethereum-magicians.org/t/eip-8311-increase-calldata-floor-cost-to-96/28860) — misilva73 (2026-06-25)

[[glossary/EIP|EIP（Ethereum 改善提案）]]-8311に関する議論トピック

#### 概要

この[[glossary/EIP|EIP]]は、[[glossary/calldata|コールデータ]] (calldata) の価格設定を調整し、フロアコストを1バイトあたり64/64 [[glossary/gas|ガス]] (gas) から96/96ガスに引き上げることを提案します。これにより、純粋なコールデータブロックの最悪ケースのバイト密度が、[[glossary/ETH-transfer-full-block|ETH送金で満たされたブロック]] (ETH-transfer-full block) のバイト密度まで低下し、ガスあたりの価格設定されたコールデータ構成がこの[[glossary/anchor|アンカー]] (anchor) よりも密になることがなくなります。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8311-increase-calldata-floor-cost-to-96/28860)
