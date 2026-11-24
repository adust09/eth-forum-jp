---
title: 'ERC-8509: エージェントのリンカビリティレポート'
original_title: 'ERC-8509: Agent Linkability Report'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8509-agent-linkability-report/30462'
author: TOLL
date: '2026-11-21'
category: ERCs
tags:
  - ercs
  - eip
  - ai-agents
  - privacy
  - security
  - research
  - account-abstraction
topic_id: '30462'
translated_at: '2026-11-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8509: Agent Linkability Report](https://ethereum-magicians.org/t/erc-8509-agent-linkability-report/30462) — TOLL (2026-11-21)

皆さん、こんにちは。これは、[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]エージェントについて、公開チェーンデータから誰でもリンクできる内容をまとめた、小規模なレポート形式のドラフトです。

**問題**

[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]エージェントは、そのオーナー、[[glossary/agentWallet|エージェントウォレット (agentWallet)]]、そして（登録ファイル経由で）支払いを受け取るx402の[[glossary/payTo|支払い先 (payTo)]]を公開します。これらはすべて公開アドレスであり、公開された履歴を持つため、支払い者やチェーンを監視している誰もが、支払いアドレスをオーナーに、オーナーを他のエージェントに、そしてすべての支払い者をエージェントに結びつけることがしばしば可能です。

Robinhood Chain（[[glossary/chainId|チェーンID]] `4663`）では、2026年11月21日にアイデンティティレジストリを読み取ったところ、26,235のエージェントのうち25,620がオーナーとは異なる[[glossary/agentWallet|エージェントウォレット (agentWallet)]]を持っておらず、すべての支払いがオーナー自身のアドレスに着地していました。

一部のリーダーはすでにこの一部を計算しており、それぞれが独自の名称とスコアを持っていますが、読み取れなかった内容については何も言及していません。そのため、2つのリーダーを比較することはできず、スコアをチェックすることもできません。「何も見つからなかった」という結果は、「履歴を最後までたどれなかった」という結果と同じに見えてしまいます。

**ドラフトが標準化するもの**

1つの[[glossary/block|ブロック]]に固定されたJSONレポートで、各フィールドは`read`（値 + 証拠：トランザクションハッシュ、ログ、[[glossary/ethcall|eth_call (RPCメソッド)]]での[[glossary/block|ブロック]]時点の呼び出し、またはアドレス範囲）であるか、`reason`（`unsupported`、`unavailable`、`incomplete`、`timeout`、`rate-limited`、`invalid`）付きの`not_read`のいずれかです。`not_read`は`0`、`false`、または`[]`として書き込まれることはありません。

-   `agent`: [[glossary/chainId|チェーンID]]、`identityRegistry`、`agentId`、`owner`、[[glossary/agentWallet|エージェントウォレット (agentWallet)]]、[[glossary/payTo|支払い先 (payTo)]]
-   `payment_lands_on_owner`（支払いアドレスごと）：（`true` / `false` / `"unset"`）
-   `owner_funded_payment_address`: 各支払いアドレスの最初の資金提供者
-   `owner_payment_direct_link`: `owner` ↔ 支払いアドレス間の直接転送
-   `owner_agent_count`: オーナーがレジストリに保持しているエージェント数（このエージェントを含む）
-   `shared_payment_address`: 同じアドレス上の他の`agentId`、および比較対象
-   `payers_visible`: 指定された`window_seconds`内の異なる支払い者
-   `helps`: [[glossary/stealth-meta-address|ステルスメタアドレス]]（[[glossary/ERC-6538|ERC-6538]]レジストリ、チェックされたスキーム、`scheme_ids`）およびリーダーが指定するプールリストからの`shielded_pool_receipts`
-   オプションの`payment_wallet_leaks`ブロック：`funding_sibling`、`linked_counterparties`、`activity_hour_concentration`、`holdings_visibility`
-   `read_at`、[[glossary/block|ブロック]]、`partial`、`partial_reasons`

重要なルール：「リンクされている」とはオンチェーン転送を意味し、共通の制御の証明ではありません。[[glossary/agentWallet|エージェントウォレット (agentWallet)]]はレポートの[[glossary/block|ブロック]]時点で読み取られます（[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]は転送時にこれをクリアします）。リスト内のシールドプールは誰によっても保証されません。

**ドラフトがしないこと**

スコアリングなし。`score`はオプションであり、実装定義です。スコアを返すリーダーは、そのスコアの元となったレポートを返さなければなりません。レポートには[[glossary/off-chain|オフチェーン]]のアイデンティティは含まれません。

ライブのリファレンスリーダー（`GET ``https://t0ll.xyz/api/agent-privacy/{agentId}`、MCPツール`agent_privacy`）があります。その応答には、評価の根拠となる値を含む`read`ブロックが含まれています。アセットフォルダには、[[glossary/JSON-Schema|JSONスキーマ]]、ライブ応答からマッピングされた4つの[[glossary/test-vectors|テストベクトル]]（オーナー、[[glossary/agentWallet|エージェントウォレット (agentWallet)]]、エージェント数、および各レポートの[[glossary/block|ブロック]]時点での[[glossary/ethcall|eth_call (RPCメソッド)]]で再確認されたステルス）と、依存関係のないバリデーターが含まれています。

[[glossary/PR|プルリクエスト]]：[Add ERC-8509: Agent Linkability Report by soli0x · Pull Request #2193 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/2193)

**未解決の質問**

1.  [[glossary/payTo|支払い先 (payTo)]]はそもそもスコープに入れるべきでしょうか？これはレジストリではなく[[glossary/off-chain|オフチェーン]]のエンドポイントから取得されるため、`owner`や[[glossary/agentWallet|エージェントウォレット (agentWallet)]]のように[[glossary/block|ブロック]]に固定することはできません。読み取り時間を含めて維持するか、拡張機能に移動すべきでしょうか？
2.  `payment_wallet_leaks`（保有資産、活動時間、取引相手）は標準化する価値があるでしょうか、それとも共有フォーマットに含めることで、ドクシング問題が解決するよりも悪化するでしょうか？この理由から、私たちはこれをオプションとしました。
3.  `shielded_pool_receipts`の場合、リーダーが指定するプールリストで十分でしょうか、それとも2つのレポートが同じリストを使用していることを示すために、レポートにリストのハッシュを含めるべきでしょうか？

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8509-agent-linkability-report/30462)
