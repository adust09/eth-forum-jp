---
title: 'ERC8415-Kit: リファレンス実装が公開されました (CC0)'
original_title: 'ERC8415-Kit: Reference Implementation Now Public (CC0)'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc8415-kit-reference-implementation-now-public-cc0/29724
author: MichaelYip
date: '2026-09-17'
category: ERCs
tags:
  - ercs
  - erc
  - nfts
  - protocol-design
  - verification
  - applications
  - state-management
  - research
topic_id: '29724'
translated_at: '2026-09-18'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC8415-Kit: Reference Implementation Now Public (CC0)](https://ethereum-magicians.org/t/erc8415-kit-reference-implementation-now-public-cc0/29724) — MichaelYip (2026-09-17)

**TL;DR:** [[glossary/Asynchronous-Register-Projection|NFT向け非同期レジスタプロジェクション]]を提案する[[glossary/ERC|ERC]]-8415提案と並行して、**ERC8415-Kit**を**CC0 1.0 Universal**ライセンスの下で公開しました。これは仕様の一つの実装であり、ERC-8415を採用するのにこのキットを使用する必要はなく、独立した実装も歓迎されます。

-   **リポジトリ:** [GitHub - GiraffeTechnology/ERC8415-Kit · GitHub](https://github.com/GiraffeTechnology/ERC8415-Kit)
-   **ライセンス:** CC0 1.0 (パブリックドメイン献呈)
-   **ステータス:** 開発および統合テスト用のリファレンスインフラストラクチャであり、本番環境へのデプロイは別途作業が必要です。

* * *

## キットが提供するもの

このキットは、ERC-8415の統合を構築およびテストするための実用的な出発点となります。

-   レジスタ確認済みホルダー記録のための**追記専用[[glossary/Asynchronous-Register-Projection|プロジェクションエンジン]]**
-   **[[glossary/Proof-Profile|証明プロファイル]]検証**とアトミックなアドミッション
-   **時系列クエリAPI** (`holderAsOf`、`isFinalAsOf`、`openGapOf`、`entryAt`など)
-   **JavaScriptおよびPython SDK**
-   共有**適合性テストスイート** (151のテスト、うち20は必須適合性テスト)

`npm run verify`を実行すると、ランタイム依存関係なしで全スイートが実行されます。

## 核となる区別

ERC-8415の中心的な設計選択は変更されておらず、キットはそれを正確に維持しています。

> **取引可能なトークンポジション (`ownerOf`) とレジスタ確認済みホルダーは別々の記録です。**

これら2つのシーケンスは*処理中に*乖離する可能性があり、個別にクエリする必要があります。

| 質問 | 回答元 |
| --- | --- |
| 履歴的なホルダー解決 | [[glossary/Asynchronous-Register-Projection|プロジェクション]] (`holderAsOf`) |
| その回答が最終的であるか | [[glossary/Authoritative-Finality|ファイナリティ]] (`isFinalAsOf`) |
| 決済が処理中であるか | [[glossary/Open-Projection-Gap|オープンギャップ]] (`openGapOf`, `openedAt`) |

キットは発生した事象を記録しますが、法的所有権を裁定したり、最終的な整合性を保証したり、キャンセル、エスクロー、返金などの救済措置を規定したりするものではありません。これらは当事者間のトランザクション条件の問題です。

## スコープと制限事項

期待値を明確にするために：

-   **仕様が適合性を定義し、キットは一つの実装です。** 相互運用性は、このコードベースからではなく、適合性テストによって決定されます。
-   **[[glossary/ERC|ERC]]-8415を採用するのに、当社のソフトウェアやサービスを使用する必要はありません。** 独立した実装は明示的に歓迎されます。
-   現在のコードは**開発および統合テスト用のリファレンスインフラストラクチャ**です。オンチェーンデプロイ（ステージ3）、永続ストレージ、および本番デプロイ証拠は未解決の作業として残っています。リポジトリの`Current Status`と`DELIVERY-EVIDENCE.md`を参照してください。

## 公開の理由

このキットを公開する理由は、**採用コストを削減**し、実装の選択を検査、テスト、改善のために公開するためです。適合性は共有テストから実証されるべきであり、単一のコードベースから推測されるべきではありません。

## フィードバックと貢献

以下を歓迎します。

-   [[glossary/Asynchronous-Register-Projection|プロジェクションモデル]]と検証エンジンの**技術レビュー**
-   ERC-8415を基盤に構築するチームからの**統合フィードバック**
-   特に**開発者インターフェース**と**実装間の適合性**に関する**貢献**

独立した実装に取り組んでいる場合は、相互運用できるよう、適合性スイートに関する意見交換を特に希望します。

* * *

*関連情報: 規範的な仕様と意味モデルについては、ERC-8415提案スレッドを参照してください。*

![マイケル・イップ](https://ethereum-magicians.org/user_avatar/ethereum-magicians.org/michaelyip/48/18807_2.png)

[[glossary/ERC|ERC]]-8415: [[glossary/Asynchronous-Register-Projection|NFT向け非同期レジスタプロジェクション]] [ERCs](https://ethereum-magicians.org/c/ercs/57)

> リポジトリ: [GitHub - GiraffeTechnology/ERC8415-Kit · GitHub](https://github.com/GiraffeTechnology/ERC8415-Kit) ライセンス: CC0 1.0 Universal (パブリックドメイン献呈) 採用を具体化するため、ERCと並行してリファレンス実装をオープンソース化しました。これには以下が含まれます: レジスタ確認済みホルダー記録のための追記専用[[glossary/Asynchronous-Register-Projection|プロジェクションエンジン]] [[glossary/Proof-Profile|証明プロファイル]]検証 + アトミックなアドミッション 時系列クエリAPI — holderAsOf, isFinalAsOf, openGapOf, entryAtなど JavaScript & Python SDK 共有適合性スイート — npm run verifyは151のテスト（…を含む）を実行します。

*3件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc8415-kit-reference-implementation-now-public-cc0/29724)
