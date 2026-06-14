---
title: '議論: IERC8060Reservable — ERC-8060のための最小限の予約会計拡張'
original_title: >-
  Discussion: IERC8060Reservable — A Minimal Reservation Accounting Extension
  for ERC-8060
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/discussion-ierc8060reservable-a-minimal-reservation-accounting-extension-for-erc-8060/28780
author: ten-io-meta
date: '2026-06-13'
category: ERCs
tags:
  - ercs
  - eip
  - defi
  - tokenomics
  - smart-contracts
  - applications
  - research
topic_id: '28780'
translated_at: '2026-06-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Discussion: IERC8060Reservable — A Minimal Reservation Accounting Extension for ERC-8060](https://ethereum-magicians.org/t/discussion-ierc8060reservable-a-minimal-reservation-accounting-extension-for-erc-8060/28780) — ten-io-meta (2026-06-13)

# 議論: IERC8060Reservable — ERC-8060のための最小限の予約会計拡張

私たちは、価値を保持するNFT (Non-Fungible Token) であるERC-8060のための、最小限のオプション拡張である `IERC8060Reservable` のドラフト参照実装を公開しました。

**リポジトリと参照実装:**
[https://github.com/ten-io-meta/erc8060-reservable](https://github.com/ten-io-meta/erc8060-reservable)

## 動機

多くのワークフローでは、所有権を移転したり、トークンから資金を移動させたりすることなく、NFTに埋め込まれた価値の一部を一時的にロックする必要があります。

一般的な例としては、以下が挙げられます。

-   エスクロー (Escrows)
-   担保 (Collateral) の取り決め
-   レンディングシステム (Lending systems)
-   エージェント調整 (Agent coordination)
-   条件付き支払い (Conditional payments)

`IERC8060Reservable` は、これらのパターンに対して最小限の会計レイヤー (accounting layer) を提供しつつ、決済ロジック (settlement logic)、レピュテーションシステム (reputation system)、紛争、またはビジネスルール (business rules) に依存しません。

## 範囲

この拡張が標準化するのは以下の点のみです。

-   `reserveAllowance(tokenId, spender, asset)`
-   `reserveValue(tokenId, asset, amount)`
-   `releaseValue(tokenId, asset, amount)`
-   `lockedValue(tokenId, asset)`
-   `availableValue(tokenId, asset)`

予約 (reservation) とロックされた価値 (locked value) は `tokenId` に紐付けられ、NFTの転送時に共に移動します。

`reserveAllowance` は、拘束力のあるコミットメント (binding commitment) ではなく、取り消し可能な承認 (revocable authorization) を表します。

## 設計思想

`IERC8060Reservable` は、厳密には予約会計のプリミティブ (primitive) です。

その目的は、予約された価値が引き出されたり、二重に消費 (double-spent) されたりするのを防ぎつつ、決済のセマンティクス (settlement semantics) に完全に依存しないことです。

意図的に以下の要素は除外されています。

-   決済または消費機能
-   リクイデーション (liquidation) および紛争ロジック (dispute logic)
-   デッドライン (deadline) または有効期限メカニズム (expiration mechanism)
-   レピュテーションシステム (reputation system)
-   転送制限 (transfer restrictions)
-   ビジネス固有の実行ルール (business-specific execution rules)

レビュー中には、集約されたアロワンス追跡 (`allocatedValue`) や標準化された決済プリミティブなどの提案が検討されましたが、これらが設計を会計からアプリケーション層の実行へと移行させてしまうため、却下されました。

## アーキテクチャ層

| レイヤー | 責任 |
| --- | --- |
| ERC-8060 | 価値のカストディ (custody) |
| IERC8060Reservable | 予約会計 |
| エスクロー / アプリケーション | 実行と決済 |
| レピュテーションシステム (例: [[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]) | アイデンティティと信頼 |
| リスクエンジン | 解釈と引受 |

## コア不変条件

正しい実装は以下を強制しなければなりません。

1.  `lockedValue(tokenId, asset) <= totalValue(tokenId, asset)`
2.  `availableValue(tokenId, asset) == totalValue(tokenId, asset) - lockedValue(tokenId, asset)`
3.  カストディされた価値の削減 (`withdraw`、`burn` など) は、`amount > availableValue(tokenId, asset)` の場合に**必ず**リバートしなければならない。
4.  `reserveValue()` は、両方の条件が満たされない限り**必ず**リバートしなければならない。
    -   `amount <= reserveAllowance(tokenId, msg.sender, asset)`
    -   `amount <= availableValue(tokenId, asset)`
5.  `releaseValue()` は、呼び出し元が現在ロックしている量を超える価値を解放することはできない。
6.  アクティブな予約は、転送時に `tokenId` と共に移動する。

## フィードバック募集

数回にわたる敵対的レビュー (adversarial review) の後、私たちは欠けているプリミティブや、会計モデル自体における還元不可能な失敗 (irreducible failure) を特定していません。

以下の点についてフィードバックを歓迎します。

-   会計/実行の境界が適切であるか
-   本質的なプリミティブが欠けているか
-   トークンに紐付けられた予約が適切なデフォルトの挙動であるか
-   現在の不変条件が、エスクロー設計、リスクモデリング (risk modeling)、マーケットプレイスの挙動 (marketplace behavior)、レピュテーションシステム、またはその他のアプリケーション層 (application-layer) の決定に合理的に還元できない失敗を引き起こす本番環境のシナリオ

すべてのフィードバックを歓迎します。

**リポジトリ:**
[https://github.com/ten-io-meta/erc8060-reservable](https://github.com/ten-io-meta/erc8060-reservable)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/discussion-ierc8060reservable-a-minimal-reservation-accounting-extension-for-erc-8060/28780)
