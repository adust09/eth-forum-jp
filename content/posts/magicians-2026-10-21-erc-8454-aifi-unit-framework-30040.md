---
title: 'ERC-8454: AIFiユニットフレームワーク'
original_title: 'ERC-8454: AIFi Unit Framework'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8454-aifi-unit-framework/30040'
author: garyyang-finchip
date: '2026-10-21'
category: ERCs
tags:
  - ercs
  - erc
  - ai-agents
  - economics
  - smart-contracts
  - protocol-design
  - research
  - applications
topic_id: '30040'
translated_at: '2026-10-22'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8454: AIFi Unit Framework](https://ethereum-magicians.org/t/erc-8454-aifi-unit-framework/30040) — garyyang-finchip (2026-10-21)

これは、**AIFiユニットフレームワーク (AUF)** のドラフト[[glossary/ERC|ERC]]です。これは、AI駆動型経済におけるあらゆる[[glossary/economic-object|経済オブジェクト]]を、1つの全体として命名、境界設定、記述、観測、分類、評価するためのレジストリおよび[[glossary/descriptor-model|記述子モデル]]です。

リポジトリ（ERCテキスト、参照実装、スキーマ、ベクトル、作業例）：[GitHub - garyyang-finchip/aifi-unit-framework: AIFi Unit Framework · GitHub](https://github.com/garyyang-finchip/aifi-unit-framework)

プルリクエスト：[Add ERC: AIFi Unit Framework by garyyang-finchip · Pull Request #2095 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/2095) (ERC-8454が割り当て済み)。

## なぜ必要か

[[glossary/AI-agents|エージェント]]、[[glossary/executable-skill|スキル]]、[[glossary/AgentTask|タスク]]、[[glossary/model|モデル]]、[[glossary/Computational-Unit|計算資源]]、[[glossary/data|データ]]、[[glossary/capital|資本]]は、[[glossary/On-chain-AI-agent-systems|オンチェーン]]で発行、取引、構成されることが増えており、いくつかの提案はこれらのオブジェクトの個々の種類、その発見、およびそれらの集団的決定について記述しています。欠けているのはその下のレイヤーです。「ここで1つの[[glossary/economic-whole|経済的全体]]として扱われるものは何か、経済的に何をするのか、そしてこの[[glossary/valuation|評価]]値は何を意味するのか」という共通の答えです。これがないと、2つの当事者は「同じ」[[glossary/Agentic-Onchain-Operations|エージェント]]ビジネスについて異なる意味を持ち、[[glossary/staking|ステーキング]]プールや[[glossary/AgentTask|タスク]]は実際の[[glossary/Contract-Role-Naming-Pattern|役割]]を隠す1つの永続的なラベルを得てしまい、2人の評価者は100と200を公開しても、それが純資産なのか、日次利回りなのか、確率なのか、信用格付けなのか、どの通貨で、いつ時点のものなのか、誰の利害のためのものなのか、誰も分かりません。

## このフレームワークが解決すること

1.  **境界 (Boundary)**。ユニットはバージョン管理された[[glossary/Unit-Definition|ユニット定義]]です。要素（[[glossary/AI-agents|エージェント]]、[[glossary/executable-skill|スキル]]、[[glossary/AgentTask|タスク]]、サービス、[[glossary/model|モデル]]、[[glossary/Computational-Unit|計算資源]]、[[glossary/data|データ]]、金融ポジション、ネストされたユニット）、各要素が含まれる[[glossary/rights-and-obligations|権利と義務]]を規定する[[glossary/typed-relations|型付き関係]]（所有、[[glossary/licenses|ライセンス]]、[[glossary/reserve-backed-token|準備金]]、[[glossary/revenue-share|収益分配]]、[[glossary/holds|保有]]、[[glossary/owes|負債]]、[[glossary/commitments|コミット]]、[[glossary/pledges|担保]]、[[glossary/depends-on|依存]]、[[glossary/exchanges|交換]]、[[glossary/control|制御]]、[[glossary/contains|含む]]）、[[glossary/ports|ポート]]（経済インターフェース）、[[glossary/authorities|権限]]、および[[glossary/validity|有効性]]が含まれます。`boundaryHash = keccak256(JCS(definition))`。[[glossary/containment|包含関係]]はバージョンを固定し、構築上[[glossary/acyclic|非巡回]]です。[[glossary/typed-acknowledgments|型付き承認]]（[[glossary/participation|参加]]、[[glossary/resource-use|リソース使用]]、[[glossary/fund-operation|資金運用]]、[[glossary/Weighted-endorsement|保証]]）は、主張されたものと確認されたものを分離します。
2.  **特性評価 (Characterization)**。ユニット、ポート、または要素に条件付きで帰属する[[glossary/Contract-Role-Naming-Pattern|役割]]（[[glossary/Source-Token-Agent-Binding|ソース]]、[[glossary/sink|シンク]]、[[glossary/conductor|コンダクター]]、[[glossary/damping|ダンピング]]、[[glossary/container|コンテナ]]、[[glossary/pledge|担保]]、[[glossary/valve|バルブ]]、[[glossary/control|制御]]）を積み重ね可能。[[glossary/behavior-attributes|挙動属性]]は個別に宣言されます。[[glossary/behavior-models|挙動モデル]]（[[glossary/financial-circuit-model-statement|金融回路分析プロファイル]]と[[glossary/stated-premises|明示された前提]]を含むオプション）、[[glossary/structure-profiles|構造プロファイル]]（[[glossary/simple|シンプル]]、[[glossary/composite|複合]]、[[glossary/chip|チップ]]）、[[glossary/credit-application-profile|信用申請プロファイル]]、[[glossary/knowledge-states|明示的な知識状態]]。
3.  **測定と評価ステートメント (Measurement and valuation statements)**。[[glossary/Observation-layer|観測記録]]は[[glossary/Per-Asset-Isolation|アセットごとに調整される]]（欠損は決してゼロではない。[[glossary/internal-transfers|内部転送]]はフローではない）、および[[glossary/valuation-receipts|評価レシート]]は[[glossary/subject-version|対象バージョン]]、[[glossary/assessment-boundary|評価境界]]、[[glossary/interest|利害]]と[[glossary/perspective|視点]]、[[glossary/snapshot|スナップショット]]、[[glossary/content-addressed-method|コンテンツアドレス型メソッド]]、[[glossary/inputs|入力]]、および[[glossary/typed-result|型付き結果]]（[[glossary/monetary|金銭的]]（[[glossary/negative|負]]を含む）、[[glossary/interval|区間]]、[[glossary/scenario|シナリオ]]、[[glossary/score|スコア]]、[[glossary/grade|グレード]]、[[glossary/not-valuable|価値なし]]、[[glossary/insufficient-evidence|証拠不十分]]、…）を固定します。

このフレームワークが未解決のまま残すもの：[[glossary/valuation-functions|評価関数]]、[[glossary/behavior-models|挙動モデル]]、[[glossary/credit-models|信用モデル]]そのものです。メソッドは[[glossary/content-addressed-descriptors|コンテンツアドレス型記述子]]であり、[[glossary/composability|構成可能性]]が宣言されています。どの[[glossary/evaluator|評価者]]も任意のメソッドを[[glossary/plug-in|組み込む]]ことができ、読者はその数値が何を指しているかを理解できます。

## カーネル

2つの[[glossary/on-chain-registry|レジストリ]]：`AUFUnitRegistry`（ユニット、バージョン、[[glossary/containment|包含関係]]、[[glossary/definition-control|定義制御]]、[[glossary/typed-acknowledgments|承認]]）と`AUFAssertionRegistry`（特性評価、[[glossary/Observation-layer|観測]]、[[glossary/valuation|評価]]、および拡張のための1つの[[glossary/assertion-envelope|アサーションエンベロープ]]。[[glossary/validity|有効性]]、[[glossary/revocation|取り消し]]、[[glossary/supersession|上書き]]。[[glossary/EIP-712-attestation-profile|EIP-712]]/[[glossary/ERC-1271|ERC-1271]]署名済みアサーション。[[glossary/content-addressed-descriptors|コンテンツアドレス型記述子]]）。[[glossary/ERC-165-discoverable|ERC-165]]、[[glossary/EIP-712-attestation-profile|EIP-712]]、[[glossary/ERC-1271|ERC-1271]]のみが必要です。他の[[glossary/AI-agents|エージェント]]経済提案（[[glossary/executable-skill|スキル]]、[[glossary/Task-Tender|タスク入札募集]]、[[glossary/Agent-Identity|エージェントID]]、[[glossary/Know-Your-Agent-Framework|KYA]]、集団的決定、[[glossary/Agentic-Resource-Discovery-Onchain|ARD発見]]、[[glossary/Swarm|スウォーム]]、[[glossary/ERC-8004|ERC-8004]]）は記述的なバインディングであり、依存関係ではありません。[[glossary/Swarm|スウォーム]]は[[glossary/collaboration-organization|協調組織]]を記述し、ユニットは[[glossary/economic-boundary|経済的境界]]、その[[glossary/Contract-Role-Naming-Pattern|役割]]、およびその[[glossary/measurement|測定]]を記述します。

## リポジトリの内容

-   eipwをパスする完全な[[glossary/ERC|ERC]]テキスト。
-   57のFoundryテスト、ethers ↔ solcベクトルクロスチェック（interface ids、canonicalization、element ids、EIP-712 struct hash、bit-exact fixed-point valuation vectors）を含む参照コントラクト。
-   すべてのドキュメント種類に対するJSON Schemas、4つのメソッド記述子（[[glossary/net-equity|純資産]]、[[glossary/realized-net-cash-flow|実現純キャッシュフロー]]、[[glossary/finite-horizon-DCF|有限期間DCF]]、[[glossary/conditional-payoff|条件付きペイオフ]]）。
-   7つの作業済みユニット：複数の[[glossary/non-exclusive-licenses|非独占的ライセンス]]を持つ[[glossary/executable-skill|スキル]]、1つのライセンスを共有する2つの[[glossary/agent-sub-units|エージェントサブユニット]]、それらを含む[[glossary/economic-whole|経済的全体]]としての[[glossary/Swarm|スウォーム]]、[[glossary/escrow|エスクロー]]と3つの異なる利害のために評価された[[glossary/conditional-settlement|条件付き決済]]を持つ[[glossary/AgentTask|タスク]]、[[glossary/cash-flow|キャッシュフロー]]のない[[glossary/contingent-obligation|偶発債務]]（[[glossary/negative-and-insufficient-evidence-receipts|負および証拠不十分レシート]]）、および[[glossary/financial-circuit-model-statement|金融回路モデル記述]]を持つ[[glossary/chip|チップ]]としてパッケージ化された[[glossary/running-agent|稼働中のエージェント]]。
-   ハッシュを検証し、固定されたバージョンによって[[glossary/containment|包含関係]]を展開し、[[glossary/shared-elements|共有要素]]にフラグを立て、[[glossary/reconciliation|調整]]をチェックし、[[glossary/unsupported-required-extensions|サポートされていない必須拡張]]を報告する[[glossary/reference-resolver|参照リゾルバー]]（[[glossary/offline-and-on-chain|オフラインおよびオンチェーン]]）。
-   ローカルチェーンでエンドツーエンドでリハーサルされた4段階の[[glossary/evidence-script|証拠スクリプト]]。[[glossary/Sepolia|Sepolia]]での実行とその記録が続きます。

## レビュー担当者への質問

1.  [[glossary/definition-control|定義制御]]、[[glossary/resource-control|リソース制御]]、[[glossary/representation|表現]]、[[glossary/cash-flow-rights|キャッシュフロー権]]の分割は十分に明確か、それとも[[glossary/on-chain-registry|レジストリ]]は[[glossary/controller-address|コントローラーアドレス]]以上のものを保持すべきか？
2.  8つの[[glossary/Contract-Role-Naming-Pattern|役割]]と4つの[[glossary/behavior-attributes|挙動属性]]は適切なv1語彙か、そして[[glossary/credit-application-profile|プロファイルとしての信用決定]]は正しいか？
3.  [[glossary/valuation-receipts|評価レシート]]の[[glossary/on-chain-core|オンチェーンコア]]（メソッド、[[glossary/interest|利害]]、[[glossary/assessment-boundary|評価境界]]、[[glossary/snapshot|スナップショット]]、結果の種類、[[glossary/value|値]]、[[glossary/denomination|通貨単位]]、[[glossary/as-of|時点]]、[[glossary/horizon|期間]]）は[[glossary/indexers|インデクサー]]にとって適切な最小限か、それとも[[glossary/interval-bounds|区間境界]]や[[glossary/evidence-root|証拠ルート]]も[[glossary/On-chain-AI-agent-systems|オンチェーン]]に含めるべきか？
4.  [[glossary/Acyclic-containment|バージョン固定による非巡回包含関係]]と[[glossary/explicit-cycle-detection|明示的なサイクル検出]]：これにより排除されるべきではない[[glossary/compositions|構成]]があるか？

フィードバックを歓迎します。テキストは意図的に自己完結型にしています。[[glossary/related-proposals|関連提案]]へのバインディングは[[glossary/later-revisions|後の改訂]]で深めていきます。

*2件の投稿 - 1人の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8454-aifi-unit-framework/30040)
