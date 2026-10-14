---
title: 'ドラフトERC: オンチェーンエージェント型リソース発見 (ARD) — ARDエントリをレコードとするアドレスルートの価値レジストリ'
original_title: >-
  Draft ERC: Agentic Resource Discovery (ARD) Onchain — an address-rooted value
  registry whose records are ARD entries
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-erc-agentic-resource-discovery-ard-onchain-an-address-rooted-value-registry-whose-records-are-ard-entries/29963
author: garyyang-finchip
date: '2026-10-13'
category: ERCs
tags:
  - ercs
  - ai-agents
  - smart-contracts
  - protocol-design
  - identity
  - interoperability
topic_id: '29963'
translated_at: '2026-10-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Draft ERC: Agentic Resource Discovery (ARD) Onchain — an address-rooted value registry whose records are ARD entries](https://ethereum-magicians.org/t/draft-erc-agentic-resource-discovery-ard-onchain-an-address-rooted-value-registry-whose-records-are-ard-entries/29963) — garyyang-finchip (2026-10-13)

**リポジトリ:** [GitHub - garyyang-finchip/ard-onchain-framework: Agentic Resource Discovery (ARD) Onchain · GitHub](https://github.com/garyyang-finchip/ard-onchain-framework)
**PR:** 後日追加予定

## これは何ですか

Googleの[[glossary/Agentic-Resource-Discovery|エージェント型リソース発見 (ARD)]]（現在、Microsoft、Hugging Face、GoDaddyなどが参加するards-projectワーキンググループのオープン仕様）は、エージェントがドメインにアンカーされたマニフェストとフェデレーテッドレジストリを通じてMCPサーバー、A2Aエージェント、スキル、APIを見つける方法を提供します。これは意図的に発見に限定されており、価格、支払い、決済、エスクロー、クレジットは含まれず、需要側もなく、信頼はDNSに根ざしています。

このドラフトは、ARDの下に価値層を追加し、すべてのレコードを有効なARDエントリとして保持します。

-   **価値ルート = 決済ルート。** レコードに対する権限は、支払われるべきアドレスに属し、ドメインには決して属しません。ドメインはアドレスが収集する承認であり、アドレスはオンチェーンでドメインを主張し、ドメインは自身の`/.well-known/ard.json`でそれを認識します。キーを持たない発行者は、休眠状態（L0）のエントリとして発見可能です。
-   **アンカーはアイデンティティ、URNはエイリアス。** レコードはCAIP-19 / CAIP-10アンカーによって識別されます。コントローラーのURNは、検証されたバインディングの下でのみカノニカルです。すべてのゲートウェイは、自身のエイリアスの下で各レコードを提供します。転送は無害です。コントローラーが変更されても、カノニカル名が陳腐化しても、アンカーは維持されます。
-   **Kindは姿勢、Typeはフォーマット。** `skill`（提供）、`task`（募集）、`agent`（主体）、`registry`（インデックス）の4種類のKindがあり、ARDの`type`とは直交します。`task` Kindは、仕事を探しているサプライヤーが読み手となる最初のARDエントリであり、そのペイロードは、オンチェーンメンバーなしでアップストリームに採用できるように設計されています。

カーネルは薄く、Kind、アンカー、記述子（JCS + SHA-256）のコンテンツハッシュ、カノニカルURN、ステータス、さらにドメインクレームと書き込み専用のKindテーブルが含まれます。価格、エスクロー残高、クレジット、およびアイデンティティの状態は、Kindアダプターを通じてアンカーされたコントラクトからリアルタイムで読み取られます。コントローラーは派生され、保存されることはありません。

## リポジトリの内容

-   ドラフトテキスト（`ERCS/erc-9999.md`、プレースホルダー番号）— 自己完結型。関連するドラフトは記述的に参照されています。
-   リファレンスカーネル + 4つのアダプター（Solidity、Foundry）、実際のベンダー提供のスキル、タスク、エージェントIDコントラクトに対する43のテスト、クロス言語ベクトル（ethers v6 + RFC 8785 ↔ solc）。
-   カーネルをインデックス化し、`POST /search`、`POST /explore`、`GET /agents`、`/.well-known/ard.json`を提供するNode.jsリゾルバー/ゲートウェイ。anvil上での4種類のすべてをカバーするエンドツーエンド実行、ハッシュ不一致レコード、バインディング状態、カノニカルURNを陳腐化させる転送、プロベナンスドリフト、キャンセルされた募集。公式のARD適合CLI（ベンダー提供、スキーマモード）は、ゲートウェイに対してエラー0、警告0でパスします。

## フィードバックを希望する質問

1.  「アドレスを唯一のルートとし、ドメインを収集された承認とする」という境界は、ARDの相互運用性にとって適切でしょうか、それともドメインのみの発行者が他の証明を通じてL1に到達できるようにすべきでしょうか？
2.  記述子ハッシュはARDエンベロープ（`identifier`、`trustManifest`、`@context`）を除外しているため、ゲートウェイエイリアスは同じコミットメントに対して検証されます。エンベロープをコミットする必要があるケースを誰か見つけられますか？
3.  v1では同一チェーンのアンカーのみを対象としています。クロスチェーンの重複は別レコードとして扱われます。異論はありますか？
4.  `task`ペイロード（`application/ai-task+json`）— アップストリームに提案する前に何か不足しているものはありますか？

[[glossary/Sepolia|Sepolia (テストネット)]]へのデプロイとアップストリームへの提案は、このスレッドが存在した後に続きます。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/draft-erc-agentic-resource-discovery-ard-onchain-an-address-rooted-value-registry-whose-records-are-ard-entries/29963)
