---
title: ERC-8415とBinanceハッキング事件：何が凍結可能か、そしてRWAにアセットステート層が必要な理由
original_title: >-
  ERC-8415 and the Binance heist: what can be frozen, and why RWAs need an
  asset-state layer
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8415-and-the-binance-heist-what-can-be-frozen-and-why-rwas-need-an-asset-state-layer/30170
author: MichaelYip
date: '2026-11-01'
category: Uncategorized
tags:
  - erc
  - rwa
  - security
  - tokenomics
  - protocol-design
  - applications
  - state-management
  - nfts
topic_id: '30170'
translated_at: '2026-11-02'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8415 and the Binance heist: what can be frozen, and why RWAs need an asset-state layer](https://ethereum-magicians.org/t/erc-8415-and-the-binance-heist-what-can-be-frozen-and-why-rwas-need-an-asset-state-layer/30170) — MichaelYip (2026-11-01)

2026年10月29日の攻撃後、[Binanceは約63億ドルの損失と、約30億ドルがオンチェーンで凍結されたことを報告しました](https://www.binance.com/en-TR/support/announcement/detail/d3306d9dca5243548c813b605e1d1751)。10月31日には、[FBIがこの攻撃を北朝鮮のTraderTraitor活動によるものと断定しました](https://www.fbi.gov/investigate/cyber/alerts/2026/north-korea-responsible-for-6-billion-binance-attack)。

ステーブルコイン発行者は、そのトークンコントラクト内の制御機能を通じて資金を凍結できます。ネイティブのBTCやETHには同等の発行者レベルの凍結機能はありませんが、仲介者を通じた回復や秘密鍵の押収によって、依然として回復が可能な場合があります。[Reutersがこの違いについてここで説明しています](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/)。

[[glossary/RWA-platforms|RWAプラットフォーム]]のインフラを構築する者にとって、これは2つの異なる疑問を提起します。

-   誰がトークンの移動を制限できるのか？
-   誰が基礎となる権利を確認し、コントラクトはその確認をどのように読み取れるのか？

[[glossary/Asynchronous-Register-Projection-for-NFTs|ERC-8415 (NFTの非同期レジスタプロジェクション)]]は2番目の疑問に対処します。

**設計上の疑問**

トークンがSPVシェア、カストディアルクレーム、または個別登録資産のいずれを表すかに関わらず、アプリケーションはそれが表す権利をどの記録が管理しているかを知る必要があります。

トークンコントラクトの外部に権威あるレジスタが存在する場合、そのレジスタが転送を認識する前にトークンが移動する可能性があります。倉庫レジスタ、証券レジスタ、またはその他の外部台帳は、チェーンとは異なるタイムテーブルで動作する場合があります。

**権威あるレジスタが転送を認識する前にトークンが移動する可能性があります。アプリケーションはその違いを認識する必要があります。**

[[glossary/Asynchronous-Register-Projection-for-NFTs|ERC-8415 (NFTの非同期レジスタプロジェクション)]]は、その違いを明確にします。レジスタは記録された保有のソースであり続け、チェーンはその履歴の検証可能なプロジェクション（投影）を公開します。

主要なインターフェースは異なる質問に答えます。

-   `ownerOf(tokenId)` は現在の[[glossary/ERC-721|ERC-721]]所有者を識別します。
-   `holderAsOf(tokenId, t)` は、特定の有効な時間について、投影されたレジスタによって記録されたホルダーを識別します。
-   `isFinalAsOf(tokenId, t)` は、その後の適合する承認によってその履歴の回答が変更される可能性があるかどうかを示します。
-   `openGapOf(tokenId)` は、オプションの決済インターフェースにおいて、未解決の登録ギャップを公開します。

登録が追いつく間も、通常のトークン転送は継続できます。ここでの履歴のファイナリティは、投影された回答の安定性に関わるものであり、登録の法的効力は基礎となる取り決めによって決定されます。

**アプリケーション層でこれが可能にすること**

A → B → C という一連の取引を考えてみましょう。

レジスタがBを承認したばかりでも、トークンはすでにCに属している可能性があります。アプリケーションは、A → Bの登録と契約条件が満たされれば、そのレッグ（区間）を決済できますが、B → Cは未完了のままです。

後のレッグが失敗した場合、アプリケーションは、完了したA → Bレッグを再開することなく、未完了の部分を巻き戻すように設計できます。これには、適切なエスクロー、承認、および取引条件が必要です。[[glossary/Asynchronous-Register-Projection-for-NFTs|ERC-8415 (NFTの非同期レジスタプロジェクション)]]は登録の証拠を提供し、アプリケーションは是正措置を提供します。

同じ区別は盗難後も重要です。不正なトークン転送は、それ自体ではレジスタが受取人を認識していることを確立しません。プロジェクションは、オンチェーンの所有権と記録されたホルダーとの間の乖離を公開できます。盗難が発生したことの確立、転送の制限、および基礎となる権利の解決は、依然として関連する当局とアプリケーションメカニズムに依存します。

用語に関する1点：**pending（保留中）、accepted（承認済み）、rejected（拒否済み）は有用なアプリケーションラベルですが、これらは[[glossary/Asynchronous-Register-Projection-for-NFTs|ERC-8415 (NFTの非同期レジスタプロジェクション)]]のネイティブな3状態ライフサイクルではありません。** プロトコルは、承認されたエントリ、オープンまたはクローズされたギャップ、および暫定または最終的な履歴の回答を区別します。

**他の標準との適合性**

[[glossary/ERC-3643|ERC-3643]]および[[glossary/uRWA-Policy-Interface|ERC-7943]]は、コンプライアンスチェック、転送制御、および凍結や承認済み転送を含む執行メカニズムをカバーしています。

[[glossary/Asynchronous-Register-Projection-for-NFTs|ERC-8415 (NFTの非同期レジスタプロジェクション)]]は補完的な疑問に対処します。**外部レジスタが実際に何を承認したのか？** トークンを受け取る許可と、レジスタによる認識は別個の事実です。

[[glossary/ERC-8392|ERC-8392]]は、アセットステートの別の部分、すなわち市場セッション、評価ソース条件、および発行または償還の可用性に対処します。更新の一時停止と失敗したフィードを区別することは、運用条件をコントラクトが読み取れるようにするという同様のニーズを反映しています。

これらのインターフェースは、ウォレット、レンディングプロトコル、およびエージェントに、いつ取引し、資金を解放し、担保を受け入れるかを決定するためのより正確な根拠を提供できます。

**ステータスと実装**

-   この提案は[ethereum/ERCs PR #2006](https://github.com/ethereum/ERCs/pull/2006)として提出され、仕様ステータスは**[[glossary/Draft|ドラフト]]**です。
-   [ERC8415-Kit](https://github.com/GiraffeTechnology/ERC8415-Kit)は、リファレンスコンポーネントと、プロジェクションを読み取り、同じトランザクション内で動作する実行可能なコンシューマ例を提供します。仕様とリファレンスコードは**CC0**ライセンスの下にあります。
-   [公開統合レポート](https://github.com/GiraffeTechnology/ERC8415-Kit/blob/main/docs/testing/TEST-RESULTS-2026-10-19.md)には、[[glossary/Hoodi|Hoodi]]実行、API/ネイティブ統合、制御されたフォールトインジェクション、および追加の同一ブロック順序付けキャンペーンを含む、**文書化されたスコープ内で60のウォレットテストケースが合格した**ことが記録されています。

**フィードバックを募集しています**

特に以下の3点についてフィードバックを歓迎します。

1.  **コンポーザビリティ（Composability）**: [[glossary/ERC-721|ERC-721]]拡張が適切な出発点でしょうか、それともレジスタプロジェクションは他のトークンタイプへの標準的なバインディングも持つべきでしょうか？
2.  **信頼**: 実際に最も有用な検証プロファイルはどれでしょうか—レジスタ自身の署名、説明責任のあるアテスター、またはクォーラム—そして、消費者はその信頼モデルについて何を検査できるべきでしょうか？
3.  **消費者要件**: レンディングプロトコルやエージェントツールにとって、ホルダー履歴、履歴のファイナリティ、およびオープンな登録ギャップ以外に、どのような追加シグナルが必要でしょうか？鮮度、期限、紛争理由、またはその他何か？

詳細な仕様と以前の議論は以下にあります。

[Ethereum MagiciansでのERC-8415に関する議論](https://ethereum-magicians.org/t/erc-8415-asynchronous-register-projection-for-nfts/29634)

*2投稿 - 2参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8415-and-the-binance-heist-what-can-be-frozen-and-why-rwas-need-an-asset-state-layer/30170)
