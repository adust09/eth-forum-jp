---
title: 'EIP-8513: 事前シードされた暗号化実行ペイロード'
original_title: 'EIP-8513: Pre-seeded Encrypted Execution Payloads'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8513-pre-seeded-encrypted-execution-payloads/30475
author: cskiraly
date: '2026-11-23'
category: EIPs networking
tags:
  - eips-networking
  - eip
  - pbs
  - mev
  - cryptography
  - networking
  - protocol-design
  - execution-layer
  - security
topic_id: '30475'
translated_at: '2026-11-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8513: Pre-seeded Encrypted Execution Payloads](https://ethereum-magicians.org/t/eip-8513-pre-seeded-encrypted-execution-payloads/30475) — cskiraly (2026-11-23)

[[EIP-8513|EIP-8513]]に関する議論スレッド、[Add EIP: Pre-seeded Encrypted Execution Payloads by cskiraly · Pull Request #12706 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12706) 。

[[EIP-7732|EIP-7732]]では、ビルダーは[[アテステーション（証明）|アテステーション]]がブロックの維持を示すまで[[実行ペイロード|実行ペイロード]]の開示を待つことが期待されています。そのため、ペイロードの転送は開示時に開始され、ペイロードのデッドラインまでに[[ペイロード適時性委員会 (PTC)|PTC]]に到達する必要があります。ビッドがすでにその内容を確定しているにもかかわらず、ブロックから開示までの時間は何も転送されません。この[[EIP|EIP]]は、有効なブロックにビッドが含まれ次第、ビルダーが暗号化されたペイロードを送信できるようにします。開示は32バイトの鍵となります。

-   [[EIP-8411|EIP-8411]]向けの2つのチャンキングスキーム、暗号化されたプレーンと暗号化されたリード・ソロモン: エンベロープはSnappy圧縮され、新しい鍵でChaCha20暗号化されます。鍵のSHA-256ハッシュは、ビッドがすでにコミットしているチャンクルートのリーフとなるため、ビッドは変更されません。
-   開示時、ビルダーは鍵をそのMerkleブランチ（385バイト）とともに、ペイロードの[[Waggleプロトコル (Waggle protocol)|Waggleオブジェクト]]で送信します。ノードはそれをルートと照合し、復号し、[[EIP-8411|EIP-8411]]と同様にエンベロープをチェックします。
-   [[コンセンサス層|コンセンサス層]]の変更はありません: ビッドのフィールド、エンベロープチェック、`[[glossary/PAYLOAD_DUE_BPS|PAYLOAD_DUE_BPS]]`は維持されます。[[EIP-8411|EIP-8411]]は、それを必要とする[[EIP|EIP]]がスキーム、種類、リーフを割り当てられるように、いくつかの文を必要とします。それらは同時に提案されています。
-   [[ビルダーのオプション|ビルダーのオプション]]（フリーオプション）は、節約された転送時間によって増加します。根拠 (Rationale) では、デッドラインの維持（この[[EIP|EIP]]の選択）、ペイロードデッドラインの早期化、鍵のデッドラインの分離、[[ペイロード適時性委員会 (PTC)|PTC]]への[[閾値暗号|閾値暗号]]、およびペナルティという選択肢が検討されています。

背景、スロットとシミュレーションの図: ethresear.chの「Reveal a key, not a payload: sending the [[ePBS (enshrined Proposer-Builder Separation)|ePBS]] payload before the reveal」（[https://ethresear.ch/t/reveal-a-key-not-a-payload-sending-the-epbs-payload-before-the-reveal/26264](https://ethresear.ch/t/reveal-a-key-not-a-payload-sending-the-epbs-payload-before-the-reveal/26264)）、シミュレーション結果は[https://ethresear.ch/t/reveal-a-key-not-a-payload-sending-the-epbs-payload-before-the-reveal/26264/5](https://ethresear.ch/t/reveal-a-key-not-a-payload-sending-the-epbs-payload-before-the-reveal/26264/5)にあります。

特にフリーオプションについて、フィードバックを歓迎します: デッドラインの維持は許容できるか、それとも鍵独自のデッドラインを設けるべきでしょうか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8513-pre-seeded-encrypted-execution-payloads/30475)
