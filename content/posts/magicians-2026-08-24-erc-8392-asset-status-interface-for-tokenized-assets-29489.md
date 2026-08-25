---
title: 'ERC-8392: トークン化資産のアセットステータスインターフェース'
original_title: 'ERC-8392: Asset Status Interface for Tokenized Assets'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8392-asset-status-interface-for-tokenized-assets/29489
author: econoar
date: '2026-08-24'
category: ERCs
tags:
  - ercs
  - eip
  - defi
  - tokenomics
  - protocol-design
  - applications
  - ai-agents
  - economics
  - oracle
topic_id: '29489'
translated_at: '2026-08-25'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8392: Asset Status Interface for Tokenized Assets](https://ethereum-magicians.org/t/erc-8392-asset-status-interface-for-tokenized-assets/29489) — econoar (2026-08-24)

トークン化された株式は現在、週7日24時間オンチェーンで取引されていますが、NYSEは週に32.5時間しか開いていません。これらの[[glossary/Tokenized-investment-funds|トークン化資産]]が安全に評価されるか、担保として使用できるかを決定する状態、すなわち、参照市場が開いているか、取引停止中か、評価フィードが日曜日だから陳腐化しているのか、それとも壊れているから陳腐化しているのか、今すぐ誰でも償還できるのかといった情報は、[[glossary/ERC|ERC-20]]では観測できません。そして今日、すべての発行者がそれを異なる方法で公開しています。OndoはオフチェーンのHTTPステータスAPIを持ち、Robinhood Chainトークンは独自の`oraclePaused()`を持ち、他のほとんどは素の`paused()`を持っています。これらのトークンをリスティングするすべてのレンディング市場は、リスティングごとにこれを手作業で実装しています。

人間のキュレーターは5つのリスティングであればこれを吸収できます。しかし、清算ボット、4337ポリシーモジュール、そしてトークン化された株式を保有する[[glossary/AI-agents|AIエージェント]]はそうできません。そして、彼らが主要な消費者になりつつあります。レンディング市場が日曜の夜のギャップ中に金曜日の古い価格に基づいて借り手を清算する最初の時、これは理論的な話ではなくなります。

このドラフトでは、[[glossary/ERC|ERC-165]]で検出可能な、トークンレベルの小さなビューセットを提案します。1つの必須関数と3つのオプション拡張機能です。

-   `IAssetStatus`（必須）：プログラムのライフサイクル＋運用ステータス
-   `IReferenceMarketStatus`：セッション（REGULAR/EXTENDED/AUCTION/CLOSED）×中断（NONE/PRICE_CONSTRAINED/ASSET_HALTED/VENUE_HALTED）の直交する次元に加え、`marketId`（ISO 10383 MIC）により、クレームを公開カレンダーと相互参照できます。
-   `IReferenceValuationStatus`：「更新が予定されていないため陳腐化している」状態と「何らかの問題があるため陳腐化している」状態を区別します。これはフィードの`updatedAt`では表現できない区別です。
-   `IAssetPrimaryStatus`：発行/償還期間の利用可能性（NAVカットオフを含む）

設計不変条件：すべてのenumは`UNKNOWN = 0`を持ち（ゼロ化されたプロキシストレージが健全な状態としてデコードされることは決してない）、ビューは決してリバートせず、`msg.sender`への依存性はなく、イベントもありません（セッション遷移はトランザクションではなく実時間で発生するため）。そして、すべてのステータスは明示的に助言的です。この[[glossary/ERC|ERC]]は信頼ではなく、問いを標準化します。

これは意図的に、[[glossary/ERC-8056|ERC-8056]]（分割乗数）、ERC-7943/3643（コンプライアンス/転送制御）、およびフィードレベルの市場ステータス製品と構成され、重複しません（有効な実装は、オラクルレポートからセッション状態をソースとすることができます）。

完全なドラフト：[Add ERC: Asset Status Interface for Tokenized Assets by econoar · Pull Request #1964 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/1964)

## 具体的に求めていること

この仕様は、非米国市場構造に対して机上でストレステスト済みです（香港証券取引所（HKEX）の昼休み、中国本土の価格制限ロック、Xetraのボラティリティ中断、ロンドン証券取引所（LSE）の定期オークション証券、湾岸諸国の取引週、NAVカットオフファンドなど）。しかし、机上は本番環境ではないため、[[glossary/Final|ファイナル]]になった後よりも、ここで問題を見つけたいと考えています。

1.  **発行者**（Robinhood、Superstate、Ondo、Backed、Securitize、Dinari、その他これらのトークンを出荷しているすべての企業）：これは、あなたが既に維持している状態に対する薄いアダプターとして実装可能でしょうか？あなたのアーキテクチャと衝突する点はどこですか？皆さんの何社かは、この標準が定義するセマンティクスを既に構築しています。共同執筆者を心から歓迎します。
2.  **キュレーターおよびレンディング市場チーム**：LTV（融資比率）と清算ロジックを設定するためにこれを利用しますか？それが現実になるために何が不足していますか？
3.  **市場構造レビュー**：`AUCTION`マッピングルールと`PRICE_CONSTRAINED`のスコープ（制限ロック、特別気配、プログラム取引サイドカーのような部分的な制約）は、enumが現実を適切に切り分けているかについて私が最も確信が持てない2つの点です。これらの状態をエンコードできない取引所をご存知でしたら、ぜひ指摘してください。
4.  **`marketId`エンコーディング**（MIC、右詰め`bytes32`）— 十分でしょうか、それともクロスリスティング/OTC取引にはもっと必要でしょうか？

誰も驚かないように、2つのスコープ決定事項を指摘しておきます。企業行動の*経済的側面*は意図的に除外されています（[[glossary/ERC-8056|ERC-8056]]が分割を扱い、合併/スピンオフは独自の[[glossary/ERC|ERC]]に値します。この仕様はそれらの運用上の影のみを公開します）。また、集約された「安全/危険」の判断は意図的にありません。安全性は資産ではなく、消費者のユースケースの特性であるためです。

Foundryテストスイート（ゼロ化プロキシおよびインターフェースIDアサーションを含む）を備えた参照実装は進行中であり、PRに付随する予定です。

*3投稿 - 3参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8392-asset-status-interface-for-tokenized-assets/29489)
