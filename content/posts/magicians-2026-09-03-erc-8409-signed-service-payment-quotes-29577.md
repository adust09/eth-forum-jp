---
title: 'ERC-8409: 署名付きサービス支払い見積もり'
original_title: 'ERC-8409: Signed Service Payment Quotes'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8409-signed-service-payment-quotes/29577'
author: SergeevDmitry
date: '2026-09-03'
category: ERCs
tags:
  - ercs
  - erc
  - smart-contracts
  - payments
  - ux
  - protocol-design
topic_id: '29577'
translated_at: '2026-09-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8409: Signed Service Payment Quotes](https://ethereum-magicians.org/t/erc-8409-signed-service-payment-quotes/29577) — SergeevDmitry (2026-09-03)

この提案は、サービスプロバイダーが特定の要求に対する[[EVM|EVM]]支払い見積もりを署名するための[[EIP-712-attestation-profile|EIP-712]]フォーマットを定義します。

目的は、プロバイダーの見積もり条件を、支払い者の承認および決済メカニズム自体から分離することです。

見積もりは、発行者、オプションの支払い者、決済チェーン、アセット、受取人、金額、要求、見積もりID、および有効期間をコミットします。

このフォーマットはトランスポートに依存しません。HTTP、x402、MCP、A2A、その他のプロトコルは、同じ署名付き見積もり構造を使用しながら、独自の要求スキームとトランスポートバインディングを定義できます。

特に以下の点についてフィードバックをいただけると幸いです。

-   プロトコル固有の署名付きオファーと比較して、これが適切な標準化境界であるか。
-   要求スキームを実装間でどのように拡張し、共有すべきか。
-   [[EOA]]および[[ERC-1271]]検証セマンティクス。
-   決済、有効期限、およびリプレイ動作。

## リンク

-   PR: [https://github.com/ethereum/ERCs/pull/1990](https://github.com/ethereum/ERCs/pull/1990)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8409-signed-service-payment-quotes/29577)
