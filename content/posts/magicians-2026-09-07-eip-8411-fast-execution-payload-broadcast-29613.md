---
title: 'EIP-8411: 高速実行ペイロードブロードキャスト'
original_title: 'EIP-8411: Fast Execution Payload Broadcast'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8411-fast-execution-payload-broadcast/29613
author: kamilsa
date: '2026-09-07'
category: EIPs networking
tags:
  - eips-networking
  - eip
  - networking
  - execution-layer
  - protocol-design
topic_id: '29613'
translated_at: '2026-09-09'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8411: Fast Execution Payload Broadcast](https://ethereum-magicians.org/t/eip-8411-fast-execution-payload-broadcast/29613) — kamilsa (2026-09-07)

[[glossary/EIP|EIP-8411]]: 高速実行ペイロードブロードキャストに関する議論

この[[glossary/EIP|EIP]]は、[[glossary/EIP|EIP-7732]]で導入された`execution_payload` [[glossary/gossipsub|ゴシップサブ]]トピックを、新しい`execution_payload_chunks`トピックに置き換えるものです。ペイロードエンベロープはチャンクに分割され、ビルダーは[[glossary/execution-bid|実行入札]]に含まれるMerkleルート（`payload_chunks_root`）でチャンクセットにコミットします。これにより、各チャンクは単一の入札署名チェックと[[glossary/inclusion-proof|インクルージョン証明]]を介して独立して検証可能になります。

動機: [[glossary/EIP|EIP-7732]]は、より高いガス制限を介してより大きな実行ペイロードを可能にしますが、これは[[glossary/propagation-latency|伝播遅延]]を増加させます。現在の単一メッセージ`execution_payload`トピックは、大きなペイロードに対してスケーラビリティが低いです。[[glossary/peer|ピア]]が大きなメッセージの受信を開始すると、転送中の重複をキャンセルするのが難しく、また[[glossary/peer|ピア]]はメッセージ全体をダウンロードしないと転送を開始できません。チャンク化は両方の問題を軽減します。重複転送はチャンクサイズに制限され、[[glossary/peer|ピア]]はチャンクが到着するとすぐに転送を開始できます。

*1件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8411-fast-execution-payload-broadcast/29613)
