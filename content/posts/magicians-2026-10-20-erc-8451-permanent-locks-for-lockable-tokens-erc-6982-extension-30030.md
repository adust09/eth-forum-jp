---
title: 'ERC-8451: ロック可能なトークンに対する永続的ロック（ERC-6982拡張）'
original_title: 'ERC-8451: Permanent Locks for Lockable Tokens (ERC-6982 extension)'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8451-permanent-locks-for-lockable-tokens-erc-6982-extension/30030
author: ryanio
date: '2026-10-20'
category: ERCs
tags:
  - ercs
  - erc
  - smart-contracts
  - tokenomics
  - applications
  - ux
  - protocol-design
  - defi
  - state-management
  - identity
topic_id: '30030'
translated_at: '2026-10-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8451: Permanent Locks for Lockable Tokens (ERC-6982 extension)](https://ethereum-magicians.org/t/erc-8451-permanent-locks-for-lockable-tokens-erc-6982-extension/30030) — ryanio (2026-10-20)

皆さん、こんにちは！[[glossary/ERC-6982|ERC-6982]]の拡張である[[glossary/ERC-8451|ERC-8451]]「**ロック可能なトークンに対する永続的ロック**」について議論を開始します。

**PR:** [ERCの追加: ロック可能なトークンに対する永続的ロック by ryanio · Pull Request #2084 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/2084)

## 概要

[[glossary/ERC-6982|ERC-6982]]は、コントラクトが1つの`DefaultLocked`イベントで全てのトークンをロックまたはアンロックし、トークンごとの`Locked`オーバーライドを可能にします。この拡張はこれらのイベントをそのまま維持し、[[glossary/ERC-6982|ERC-6982]]が未解決のままにしている点に対処します。

1.  永続的ロック（Permanent locks）：これにより、マーケットプレイス (marketplaces) やウォレット (wallets) は、一時的な取引一時停止 (temporary trading pause) と、決して譲渡不能 (non-transferable) にならないコレクションを区別できます。
2.  [[glossary/ERC-1155|ERC-1155]]のサポート：`tokenId`をトークンタイプIDとして読み取ります。
3.  ミント (mint) とバーン (burn) のルール：ロックはホルダーの転送のみを制限するため、取引が一時停止されている間もミントは継続されます。

```
interface IERC8451 /* is IERC165, IERC6982 */ {
    event PermanentlyLocked();
    error TokenLocked(uint256 tokenId);
    function permanentlyLocked() external view returns (bool);
}
```

ミント中の取引一時停止は、デプロイ時に`DefaultLocked(true)`、取引開始時に`DefaultLocked(false)`となり、これは通常の[[glossary/ERC-6982|ERC-6982]]です。ソウルバウンドコレクション (soulbound collection) は、デプロイ時に一度`DefaultLocked(true)`と`PermanentlyLocked()`を発行し、その後はロックを解除できません。

## 理由

クリエイターは定期的に二次転送を一時的に停止します。例えば、パブリックミント中、公開前、移行中などです。その他のコレクションは、資格情報やバッジのように、永続的に譲渡不能 (non-transferable) です。マーケットプレイス (marketplaces) はどちらの場合も取引の提供を停止する必要がありますが、異なる扱いをすべきです。一時停止が解除された場合に備えて注文を保持し、永続的ロック (permanent lock) は譲渡不能 (non-transferable) と表示すべきです。

[[glossary/ERC-6982|ERC-6982]]は永続性を表現できず、[[glossary/ERC-721|ERC-721]]を必要とし、ロック中にミントが継続されるかどうかも明記していません。[[glossary/ERC-5192|ERC-5192]]は永続的ロックをカバーしますが、トークンごとに1つのイベントが必要です。

## フィードバックを求めている点

-   永続性は、[[glossary/ERC-6982|ERC-6982]]がFinalであるため、別のイベントを使用します。ロックは永続的とマークされる前に設定されている必要があります。そのため、[[glossary/ERC-6982|ERC-6982]]のみを知るコンシューマー (consumer) は、全てのトークンがロックされていると認識します。
-   永続性はコントラクト全体 (contract-wide) のみです。動機となるケースはコレクション全体をロックするものであり、[[glossary/ERC-5192|ERC-5192]]は既に単一のソウルバウンドトークン (soulbound tokens) をカバーしているため、インターフェースは1つのイベント、1つのビュー、1つのエラーに留まります。
-   永続性は一方向です。一度マークされると、コントラクト (contract) はデフォルトまたは任意のトークンのロック解除を発行することはできません。
-   厳格なリバート (reverts) は永続的ロックにのみ適用されます。一時的なロックは[[glossary/ERC-6982|ERC-6982]]の柔軟性を維持し、プロテクターウォレット (protector wallet) はロックされたトークンを移動できます。
-   範囲イベント (range event) はありません。デフォルトステータスはコレクション全体をカバーし、`Locked`は単一トークンをカバーします。
-   予想される終了時刻フィールド (expected end time field) はありません。一時停止はしばしば早く終了したり遅れたりするため、古い終了時刻 (stale end time) はコンシューマー (consumer) がリバートする注文を表示する原因となります。

ドラフトの参照実装は、デプロイ時にロックし、オーナーがロック解除、再ロック、またはロックを永続的にすることを可能にするOpenZeppelin 5.x [[glossary/ERC-721|ERC-721]]です。

もしこの提案があなたのマーケットプレイス (marketplace)、ウォレット (wallet)、またはコントラクト (contract) に役立つようでしたら、ここかPRに+1をお願いします。これにより、ドラフト (Draft) としてマージされる助けになります。

*5件の投稿 - 4名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8451-permanent-locks-for-lockable-tokens-erc-6982-extension/30030)
