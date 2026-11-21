---
title: 'ドラフトERC: オンチェーンAI推論トークン (AITO) - 計測、承認済み消費、決済を伴うAI推論供給の消費可能な権利'
original_title: >-
  Draft ERC: AI Inference Token Onchain (AITO) - consumable entitlements to AI
  inference supply, with metering, authorized consumption and settlement
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-erc-ai-inference-token-onchain-aito-consumable-entitlements-to-ai-inference-supply-with-metering-authorized-consumption-and-settlement/30453
author: garyyang-finchip
date: '2026-11-20'
category: ERCs
tags:
  - ercs
  - applications
  - ai-agents
  - economics
  - smart-contracts
  - eip
  - tokenomics
  - protocol-design
  - metering
  - settlement
topic_id: '30453'
translated_at: '2026-11-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Draft ERC: AI Inference Token Onchain (AITO) - consumable entitlements to AI inference supply, with metering, authorized consumption and settlement](https://ethereum-magicians.org/t/draft-erc-ai-inference-token-onchain-aito-consumable-entitlements-to-ai-inference-supply-with-metering-authorized-consumption-and-settlement/30453) — garyyang-finchip (2026-11-20)

このトピックは、ドラフト[[glossary/ERC|ERC]]である**オンチェーンAI推論トークン (AITO)** の議論スレッドです。

## 概要

AITOは、AI推論供給に対する権利 (entitlement) を[[glossary/on-chain|オンチェーン]]で保持、転送、消費するためのフレームワークです。

名称にある「トークン」は推論トークンであり、推論使用量 (inference usage) がカウントされる単位です。これは権利の額面であり、[[glossary/blockchain-token|ブロックチェーントークン]]ではありません。AITO単位は、バージョン管理された実行仕様 (execution specification)、計測ルール (metering rule)、および配信条件 (delivery condition) の下で、AI推論供給に対する承認可能かつ消費可能な権利 (consumable entitlement) を表現します。転送条件 (transfer condition) を満たす権利は、[[glossary/ERC-1155|ERC-1155]]および[[glossary/ERC-20|ERC-20]]トークンを通じて保持および流通されます。

このドラフトは、価格、サプライヤー間の換算レート、品質のランキングを固定するものではありません。カウントされるもの、約束されるもの、誰がそれを負っているのか、誰がそれを消費できるのか、そして何が消費されたのか、という5つの事柄を明示的かつ検証可能にすることを目指しています。

## 目的

推論供給は、エージェントが動作する基盤です。今日では、単一のプロバイダー内で[[glossary/account-credit|アカウントクレジット]]として購入されています。それを[[glossary/on-chain|オンチェーン]]に置こうとする試みは、常に同じ問題に直面しています。

-   トークンカウントはまだ量ではありません。トークナイザー (tokenizer) は異なり、推論トークン (reasoning token) は表示されずに請求されることがあり、キャッシュされた入力は別のレートで課金されます。
-   同じカウントが不均等な供給を表します。異なるモデル、量子化 (quantization)、設定、コンテキスト制限 (context limit)、レイテンシ (latency)、保持期間 (retention term) などです。
-   供給は再販業者 (reseller) を経由するため、保有者は誰がそれを負っているのか、あるいはどのような発行根拠 (issuance basis) で単位が発行されたのかを知ることができません。
-   前払い権利 (prepaid entitlement) はサプライヤーの負債 (liability) であり、供給可能な量よりも多く販売されたかどうかを示すものはありません。
-   使用量は資産 (asset) と誤解されています。すでに生成されたトークンのログは過去の記録であり、新しい供給源ではありません。

## ドラフトが指定するもの

-   **5つのコアオブジェクト。** ユニット（何がどのようにカウントされるか）、グレード（バージョン管理された仕様、条件、制約のセットとして約束されるもの。グローバルな順序付けなし）、ソース（誰が発行し、誰が供給を負い、どの宣言された発行根拠 (issuance basis) に基づくか）、インストゥルメント（すべての用語がその識別子の一部であるシリーズ）、およびレシート（1つのリクエストのクレーム、証拠、承認、および[[glossary/settlement|決済]]効果。これらは分離して保持されます）。
-   **3つのオプションモジュール。** メソッド（アプリケーションによって固定された型付き計測、キャリブレーション、変換メソッド）、アセスメント（誰がどのような条件下で何を発見したか）、およびトークンバインディング。
-   **消費。** ホルダーの承認は上限 (ceiling) であり、何も予約 (reserve) しません。これは転送アローワンス (transfer allowance) やオペレーター承認 (operator approval) から推論されることはありません。ホールド (hold) は、1つの[[glossary/logical-request|論理的リクエスト]]のために単位を予約します。台帳は、報告された使用量 (reported usage)、結果クラス (outcome class)、およびシリーズスケジュール (series schedule) から控除 (deduction) を計算し、ホールドによって制限されます。決済 (settlement) は、承認されたものを控除し、残りを解放します。これは論理的リクエストごとに1回行われます。
-   **3つの承認ルール。** ホルダーが購入前にどのルールが適用されるかを知るために、用語で命名されています。消費者共同署名 (co-signature)、[[glossary/objection-window|異議申し立て期間]]を伴う[[glossary/optimistic-acceptance|オプティミスティック承認]]、および[[glossary/provider-metering|プロバイダー計測]]です。
-   **トークンバインディング。** 残高が利用可能な量であるネイティブERC-1155バインディング (ERC-1155 binding) と、ERC-20ラッパー (ERC-20 wrapper) です。ラップされた単位は消費される前にアンラップ (unwrap) されるため、シリーズごとに1つの消費パス (consumption path) があり、どの単位も二度行使 (exercise) されることはありません。
-   **2つのオプションの権利プロファイル (entitlement profile)**。[[glossary/periodic-allowance|定期アローワンス]]と[[glossary/reserved-capacity|予約容量]]であり、動作状態例 (worked state example) を伴う[[glossary/critical-extension|重要な拡張]]として定義されます。
-   **重要な拡張。** シリーズの重要な拡張を理解していない当事者は、その拡張が影響を与える可能性のある操作 (operation) を実行しません。
-   **レシートは発行 (issuance) の根拠ではないというルール。** 過去の使用量 (past usage) の記録だけでは、誰も新しい未消費の権利 (unconsumed entitlement) を発行する権限を得ることはできません。

## ドラフトが除外するもの

価格、[[glossary/market-making|マーケットメイキング]]、インデックス、[[glossary/cash-settled-derivatives|現金決済デリバティブ]]、推論のための証明システム (proof system for inference)、および権利 (entitlement) の法的分類は含まれていません。単一の償還約束 (redemption promise) の下での複数のサプライヤーのプーリング (pooling) はこのバージョンには含まれていません。このドラフトは、後のプロファイルが満たすべき制約 (constraint) のみを記録しています。

## リファレンス実装

リポジトリ:

[github.com](https://github.com/garyyang-finchip/ai-inference-token)

![AI推論トークン オンチェーン](https://opengraph.githubassets.com/9ce69f52a0998e394f90d27dba45b494/garyyang-finchip/ai-inference-token)

### [GitHub - garyyang-finchip/ai-inference-token: AI Inference Token Onchain](https://github.com/ethereum/ERCs/pull/2188)

-   `AITOLedger` (コアおよびネイティブERC-1155バインディング (ERC-1155 binding))、`AITOWrapper20`、および`AITORecords`。これらにはオーナー (owner) もアップグレードパス (upgrade path) も特権アカウント (privileged account) もありません。
-   98のFoundryテスト。単体テスト (unit test)、2つのエンドツーエンド (end to end) の動作例 (worked case)、ファズテスト (fuzz test)、および不変条件テスト (invariant test) が含まれます。
-   8種類のレコード種別 (record kind) のJSONスキーマ (JSON Schema)、サンプルレコード (example record)、およびSolidity外の第二実装 (second implementation) によって生成され、コントラクトに対してリプレイ (replay) されたベクトル (vector)。
-   2つのオプションプロファイル (optional profile) は仕様のみです。リファレンス台帳 (reference ledger) はそれらを実装 (implement) も報告 (report) もしません。

[[glossary/Sepolia|Sepolia]]デプロイ (deployment)、2026-11-20。両方の動作例 (worked case) が実行済み (33トランザクション、ブロック12172538から12172585。すべての最終数値 (final figure) は仕様に合致 (match the specification) しました):

-   AITORecords: [0x7863F072581A96C3E147b7e366299EAc49D6E726のSepoliaアドレス詳細 | Blockscout](https://eth-sepolia.blockscout.com/address/0x7863F072581A96C3E147b7e366299EAc49D6E726)
-   AITOLedger: [0xF6c40A9821a8105e550d695B153b64c34b2f89CaのSepoliaアドレス詳細 | Blockscout](https://eth-sepolia.blockscout.com/address/0xF6c40A9821a8105e550d695B153b64c34b2f89Ca)
-   AITOWrapper20 (ケースA): [0xb3428103825aDDE885036ab01c84a85E9a4bAE01のSepoliaアドレス詳細 | Blockscout](https://eth-sepolia.blockscout.com/address/0xb3428103825aDDE885036ab01c84a85E9a4bAE01)
-   トランザクションと読み戻し状態 (read-back state): [ai-inference-token/docs/sepolia-evidence.md at main · garyyang-finchip/ai-inference-token · GitHub](https://github.com/ethereum/ERCs/pull/2188)

プルリクエスト (Pull request): [ERCの追加: AI Inference Token Onchain by garyyang-finchip · Pull Request #2188 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/2188)

## フィードバックを希望する質問

1.  **レコード形式 (Record format)。** レコードはRFC 8785正規形式 (RFC 8785 canonical form) のJSONドキュメント (JSON document) であり、keccak256で識別され、台帳が[[glossary/on-chain|オンチェーン]]で強制する条件 (term) のみが保持されます。これはチェーンとドキュメント間の適切な分割 (split between chain and document) でしょうか？
2.  **承認ルール (Acceptance rule)。** 共同署名 (co-signature)、オプティミスティック承認 (optimistic acceptance)、およびプロバイダー計測 (provider metering) は適切な基本セット (base set) でしょうか？アテステーション済みハードウェア (attested hardware) または証明 (proof) からの証拠は、それがサポートする命題によって分類され、重要な拡張 (critical extension) を通じてさらなる承認ルール (acceptance rule) として導入 (enter) できます。これらのいずれかを基本セットに含めるべきでしょうか？
3.  **リクエストのコスト (Cost of a request)。** 各リクエストはホーム台帳 (home ledger) にレコードを残します。[[glossary/state-creation|状態作成]]が高価 (expensive) な場合、これがコストを支配 (dominate the cost) するため、このドラフトでは1つのリクエストキー (request key) の下での累積決済 (cumulative settlement) を許可しています。これは十分なガイダンス (guidance) でしょうか、それとも[[glossary/session-profile|セッションプロファイル]]を指定すべきでしょうか？
4.  **他のキャリア。** バインディングインターフェース (binding interface) はトークンインターフェース (token interface) とは独立しています。[[glossary/ERC-3525|ERC-3525]]または[[glossary/ERC-6909|ERC-6909]]のバインディング (binding) に関心はありますか？
5.  **定期的な権利 (Periodic right)。** 最初の定期プロファイル (periodic profile) は、アクティブな権利の転送を禁止し、次の期間境界 (period boundary) で有効化 (activation) を有効にします。これはシンプルであり、所有者の変更 (changing hands) によって使用済みアローワンス (used allowance) をリセット (resetting a used allowance) することを排除します。これは実際のサブスクリプション (real subscription) には厳しすぎるでしょうか？
6.  **プール。** 単一の仕様の下で供給を約束するプール (pool) は、責任者 (responsible party) がそのプールである新しいシリーズです。発行 (issuance) の前に、ホルダーが要求できるもの、保持する適格準備金 (qualifying reserve)、および誰がどの金額まで不足 (shortfall) を補うかを固定 (fix) する必要があります。他に固定すべきことは何でしょうか？

お読みいただきありがとうございます。いかなる部分へのコメントも歓迎します。

*4件の投稿 - 2名の参加者*

[全トピックを読む](https://ethereum-magicians.org/t/draft-erc-ai-inference-token-onchain-aito-consumable-entitlements-to-ai-inference-supply-with-metering-authorized-consumption-and-settlement/30453)
