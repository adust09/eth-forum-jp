---
title: 'ERC: オンチェーンアナウンスメント'
original_title: 'ERC: Onchain Announcements'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-onchain-announcements/30428'
author: conner
date: '2026-11-18'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - applications
  - ux
  - protocol-design
  - state-management
  - research
topic_id: '30428'
translated_at: '2026-11-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC: Onchain Announcements](https://ethereum-magicians.org/t/erc-onchain-announcements/30428) — conner (2026-11-18)

このスレッドは、ドラフト[[ERC|ERC（Ethereum Request for Comments）]]である**オンチェーンアナウンスメント**に関する議論のためのものです。

**概要。** このERCは、人間が読める開示情報と、それが記述する状態変更とを結びつけるための慣習を定義します。アナウンスメントはブラケット（括弧）のようなものです。`Announcement`イベントがそれを開き、ゼロ個以上の自己ターゲットコールがその中でアトミックに実行され、`EndAnnouncement`イベントがそれを閉じます。呼び出し元が選択する`id`が、ブラケット内のすべての効果をその開示情報に結びつけます。

-   `announce(internalCalls, id, description, uri)` は、新しいアナウンスメントを公開し、その状態変更を同じトランザクション内でディスパッチします。
-   `updateAnnouncement(internalCalls, id)` は、既存のアナウンスメントを改訂します。これは`AnnouncementUpdated`を発行し、消費者に`uri`にあるコンテンツを再フェッチするよう指示し、同じ`id`の下でさらなる状態変更（例えば、以前にアナウンスされたアクションの実行など）をブラケット化できます。
-   `uri` は、必須の`category`を持つJSONドキュメントに解決され、ドメイン固有のスキーマ（例えば、企業行動など）がそれに基づいて構築できるようにします。
-   アセットは、ERC-7930相互運用可能アドレスによって識別されるアナウンスメント参照を指定でき、これによりサービスプロバイダーやホームチェーンフィードがアセットに代わってアナウンスメントを行えるようになります。

**動機。** トークンのリスケーリング、発行、パラメータ更新といった[[Operator|オペレーター]]主導の変更は、今日では生のイベントログとしてのみ現れ、その根拠やオフチェーンの開示情報へのリンクがありません。企業行動のような現実世界の行動も時間とともに変化します。それらはアナウンスされ、修正され、確認され、実行されます。このERCは、そのライフサイクル全体に対して単一のオンチェーンアイデンティティを提供します。

**募集しているフィードバック:**

1.  アナウンスメントのファイナリティ（最終性）はオンチェーンで表現されるべきでしょうか、それともコンテンツスキーマに任せるだけで十分でしょうか？
2.  アナウンスメント参照メカニズムは、クロス発行者サービスプロバイダーやマルチチェーンアセットにとって十分でしょうか？

ethereum/ERCsへのプルリクエストは、公開され次第ここにリンクされます。

*3投稿 - 3参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-onchain-announcements/30428)
