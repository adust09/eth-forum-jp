---
title: 'ERC-TBA: uRWAポリシーインターフェース'
original_title: 'ERC-TBA: uRWA Policy Interface'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-tba-urwa-policy-interface/30048'
author: fepvenancio
date: '2026-10-22'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - tokenomics
  - security
  - protocol-design
  - applications
  - rwa
topic_id: '30048'
translated_at: '2026-10-23'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: uRWA Policy Interface](https://ethereum-magicians.org/t/erc-tba-urwa-policy-interface/30048) — fepvenancio (2026-10-22)

[[ERC|ERC]]-7943 (uRWA) は、パーミッション型トークンが公開する機能、すなわち `canSend`、`canReceive`、`canTransfer`、凍結された残高、および `forcedTransfer` を標準化しました。これは、トークンがこれらの決定にどのように到達するかを意図的に未定義のままにしていました。この提案は、そのもう半分、すなわち[[ERC|ERC]]-7943トークンと外部のポリシーコントラクト間のインターフェースを標準化します。

## なぜ

-   **コンプライアンスロジックはトークンよりも速く変化します。** ID、管轄区域、ロックアップ、ホルダー上限、決済時間は、トークンの会計処理よりも頻繁に変化します。異なるチームがそれらを監査し、一つのルールセットがしばしば多くの金融商品に適用されます。そのため、トークンはこれらのルールを別のコントラクトに移動させ、各実装が独自のトークン↔ポリシーインターフェースを考案しています。
-   **[[ERC|ERC]]-3643の境界は薄いです。** そのコンプライアンスチェックは `canTransfer(from, to, amount) returns (bool)` とコールバックです。誰がどのような権限で移動を開始したかを把握せず、拒否理由を伝えることもできません。
-   **インテグレーターはプリフライト（事前チェック）を信頼できません。** トークンのプリフライトが、予測する転送と同じ方法で計算されるかどうかを知ることができません。

## 設計概要

-   **ポリシーインターフェース。** `checkSend` と `checkReceive` が `canSend` と `canReceive` をサポートします。`checkTransfer(TransferContext)` が各移動を決定します。これら3つはすべて `bytes32` を返すビュー関数です。`wantsAfterTransfer()` と `afterTransfer()` は、ホルダー数などのステートフルなポリシーに役立ちます。トークン側では: `policy()` と `PolicyChanged` です。
-   **非ゼロの成功値。** `TRANSFER_OK = keccak256("TRANSFER_OK")`。ゼロおよびその他のすべての値は拒否を意味するため、忘れられた、または未割り当ての戻り値はクローズド失敗となります。
-   **権限によって選択される、閉じた種類のセット。** すべての移動は `TRANSFER`、`EXECUTED`、`FORCED`、`MINT`、`BURN` のいずれかの種類を伴います。順序付けられた手順が、関数名やビジネスプロセス名ではなく、誰が移動を承認したかというオンチェーンの事実から種類を選択します。これは、ドラフトが抽出された実装における実際のバグに由来します。強制転送としてラベル付けされたエスクローされた株式を返却すると、ホルダー上限と一時停止がスキップされていました。
-   **プリフライトは移動と一致します。** トークンの `canTransfer` は、誰が提出したかに関わらず、それが予測する転送、`transferFrom`、ミント、またはバーンが受け取るであろう決定を返さなければなりません。これを維持するため、`TRANSFER`、`MINT`、`BURN` の決定は[[Operator|オペレーター]]に依存してはならず、ポリシーの回答は `msg.sender` やその他のトランザクションコンテキストに依存してはなりません。
-   **[[ERC|ERC]]-7943自身の制限が適用されます。** ポリシーは[[ERC|ERC]]-7943の制限（アカウントレベルのみ）の下で `canSend` と `canReceive` に応答し、`checkTransfer` はそれらと一貫性を保つ必要があります。

## 未解決の質問

1.  **[[ERC|ERC]]-7943の著者へ。** ドラフトでは、`canTransfer` は通常の転送、ミント、バーンのみのプリフライトとして解釈されます。エグゼキューターによって決済された移動や強制移動は、制限された関数を介して行われ、予測されません。また、`from` または `to` がゼロである場合をミントまたはバーンのプリフライトとして解釈します。これはあなたの意図と一致しますか？
2.  `wantsAfterTransfer()` と[[ERC|ERC]]-165によるコールバック検出の比較。移動ごとに1回の `STATICCALL` の価値はありますか？
3.  ミントのプリフライトは、[[Operator|オペレーター]]を呼び出し元に設定します。いずれにしても、決定はそれに依存できません。すべての呼び出し元で同じコンテキストのために、代わりに `from` (ゼロ) を使用すべきでしょうか？
4.  `EXECUTED` (承認されたエグゼキューターによって実行されるホルダー署名済み命令): これは基本セットに含めるべきでしょうか、それとも拡張機能でしょうか？

## リンク

-   ドラフト: ![urwa-policy/erc/eip-draft_urwa_policy.md at main · fepvenancio/urwa-policy · GitHub](https://github.com/fepvenancio/urwa-policy/blob/main/erc/eip-draft_urwa_policy.md)
-   参照実装: ![GitHub - fepvenancio/urwa-policy: urwa-policy · GitHub](https://github.com/fepvenancio/urwa-policy) 。これには、[[ERC|ERC]]-20 + [[ERC|ERC]]-7943のサンプルトークンと、アローリスト/ホルダーキャップポリシーが含まれており、ファズテストされたプリフライトパリティを含む82のテストがあります。

特に[[ERC|ERC]]-7943または[[ERC|ERC]]-3643トークンを運用しているチームからのフィードバックを歓迎します。

*12件の投稿 - 3名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-tba-urwa-policy-interface/30048)
