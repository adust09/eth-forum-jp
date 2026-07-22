---
title: 'ERC-XXXX: Cento Proxy – インデックスベースのマルチファセットプロキシ'
original_title: 'ERC-XXXX: Cento Proxy – Index-Based Multi-Facet Proxy'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-xxxx-cento-proxy-index-based-multi-facet-proxy/29054
author: Arhemius
date: '2026-07-21'
category: ERCs
tags:
  - ercs
  - smart-contracts
  - eip
  - protocol-design
  - ux
  - research
  - account-abstraction
topic_id: '29054'
translated_at: '2026-07-22'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX: Cento Proxy – Index-Based Multi-Facet Proxy](https://ethereum-magicians.org/t/erc-xxxx-cento-proxy-index-based-multi-facet-proxy/29054) — Arhemius (2026-07-21)

## Motivation

過去数年間、イーサリアムエコシステムでは、モジュラー型プロキシアーキテクチャに対する持続的な関心が示されてきました。[[glossary/Diamond|ERC-2535]]（ダイヤモンド）は、最初に広く採用された標準を確立し、その後の[[glossary/ERC|ERC]]-8109やERC-8153などの提案は、特にセレクター管理、[[glossary/introspection|イントロスペクション]]、標準化の境界に関して、設計のさまざまな側面を洗練し続けています。

これらの議論を追う中で、一つのアーキテクチャ上の疑問が繰り返し浮上しました。

> **モジュラー型ルーティングは、根本的に実装モジュールを関数セレクターによって識別すべきなのでしょうか？**

関数セレクターは、外部から呼び出し可能な関数を自然に識別します。しかし、[[glossary/Facet|ファセット]]は実装モジュールです。既存のセレクター中心のアーキテクチャでは、これら二つの責任が結合され、デプロイ、アップグレード、プロトコルメンテナンス全体を通じてセレクター管理が恒久的な懸念事項となっています。

## Routing Model

この提案は、異なる原則に基づいた代替のルーティングモデルを探求します。

> **プロトコルルーティングはファセットを識別すべきであり、関数セレクターはインターフェースの互換性に専念すべきです。**

セレクターテーブルを介したルーティングの代わりに、Cento Proxyは各[[glossary/Facet|ファセット]]にコンパクトなルーティングインデックスを割り当てます。ネイティブプロトコルコールは、このルーティングインデックスをコールデータ (calldata) に追加します。ルーター (router) はデリゲーション (delegation) の前にこれを取り除き、デリゲートされた[[glossary/Facet|ファセット]]は、直接呼び出されたかのように元のコールデータ (calldata) を受け取ります。既存の標準インターフェースは、現在のツールやインフラとの互換性を保つために、セレクター経由でルーティングされたままです。

これにより、二つの異なる責任が自然に分離されます。

1.  **プロトコルルーティング**: `index → facet`
2.  **インターフェース互換性**: `selector → index → facet`

結果として、モジュール性は根本的にセレクター中心ではなく[[glossary/Facet|ファセット]]中心となり、デプロイ、アップグレード、および可観測性 (observability) が、関数セレクターのコレクションではなく、実装モジュール上で直接動作できるようになります。

この分離にはいくつかの実用的な結果があります。ネイティブプロトコルの開発は、セレクター管理やセレクター衝突の懸念に依存しなくなり、アップグレードコストは関数ではなく影響を受ける[[glossary/Facet|ファセット]]の数に応じてスケールし、プロトコルの進化はセレクターテーブルではなく実装モジュールを中心に展開されるようになります。

## Resources

この提案と並行して、私は以下を準備しました。

-   完全な[リファレンス実装](https://github.com/Arhemius/cento-proxy) (Reference Implementation)；
-   ルーティングモデルを記述した[[glossary/ERC|ERC]]提案 ([ERC Proposal](https://github.com/Arhemius/cento-proxy/blob/master/erc-XXXX.md))；
-   包括的なテスト、ベンチマーク、ドキュメント、デプロイツール。

* * *

## Thoughts & Feedback

ルーティングモデル自体が主要な貢献ですが、特に標準化の境界に関する議論を歓迎します。

[[glossary/Diamond|ダイヤモンド]]エコシステムは、必須インターフェース、[[glossary/introspection|イントロスペクション]]、アップグレードイベント、標準化されたエラーといったトピックが、解決済みの慣例ではなく、未解決の設計上の問題として残っていることを示しています。

インデックスベースのルーティングは、異なるアーキテクチャ的視点からモジュール性に取り組むため、これまでの仮定を継承するのではなく、モジュラー型プロキシ標準を新たな出発点から再考する機会を提供すると私は信じています。

特に、以下の点に関するフィードバックに興味があります。

-   ルーティングモデル自体；
-   標準に含めるべき側面と、実装定義のままにすべき側面；
-   イベント、エラー、インターフェース、および[[glossary/introspection|イントロスペクション]]機能は標準化されるべきか。

この提案をお読みいただきありがとうございます。皆様のご意見を伺い、コミュニティと議論できることを楽しみにしています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-xxxx-cento-proxy-index-based-multi-facet-proxy/29054)
