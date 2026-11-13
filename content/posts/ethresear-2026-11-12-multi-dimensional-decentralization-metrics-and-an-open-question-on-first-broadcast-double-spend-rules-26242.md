---
title: 多次元的な非中央集権性メトリクス、およびファーストブロードキャスト二重支払いルールに関する未解決の問い
original_title: >-
  Multi-dimensional decentralization metrics, and an open question on
  first-broadcast double-spend rules
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/multi-dimensional-decentralization-metrics-and-an-open-question-on-first-broadcast-double-spend-rules/26242
author: saintthor
date: '2026-11-12'
category: Consensus
tags:
  - consensus
  - decentralization
  - security
  - research
  - protocol-design
  - ai-agents
  - double-spending
  - atomic-ownership-blockchains
topic_id: '26242'
translated_at: '2026-11-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Multi-dimensional decentralization metrics, and an open question on first-broadcast double-spend rules](https://ethresear.ch/t/multi-dimensional-decentralization-metrics-and-an-open-question-on-first-broadcast-double-spend-rules/26242) — saintthor (2026-11-12)

開示：私はAtomic Ownership Blockchains (AOB)の作成者であり、このリポジトリでは他の設計よりもAOBについて詳しく説明しています。

これは何か

これは、[[AI-agents|LLMエージェント]]がブロックチェーンアーキテクチャを単一の数値ではなく、複数の独立した次元で分析できるようにするオープンソースのスキル（SKILL.md形式、Apache-2.0）です。[[Nakamoto-coefficient|ナカモト係数]]は単一サブシステムの[[snapshot|スナップショット]]であり、陳腐化しやすく、[[consensus-mechanisms|コンセンサスメカニズム]]間で比較できないため、このスキルではそれをランキングではなくサブシステムごとの入力として扱います。

現在カバーされている次元：

```
Node/validator concentration (NC per subsystem), stake/wealth concentration (Gini/HHI), client diversity, network/infrastructure
Consensus dependency scope: does finalizing this transaction need agreement from parties unrelated to it?
Privileged actors, payment finality authority, reliance on economic assumptions
Sybil exposure, blast radius of one attack or one lost key, eclipse/network-view attacks, cost to participate
```

これは[[PoW|PoW]]、[[PoS|PoS]]、DAG、[[sharded-designs|シャード設計]]、およびAOBを比較し、各設計の[[architecture|アーキテクチャ]]が何をするかとは別に、その[[validation-level|検証レベル]]（本番稼働履歴、監査、[[testnet|テストネット]]）を報告します。

AOBの[[double-spend|二重支払い]]ルール（批判を求む）

各アトミックオブジェクトは独自のチェーンを持ち、現在の所有者のみが書き込み可能です。したがって、いかなる[[fork|フォーク]]も、一人の人物が二度[[signed|署名]]した直接的な証拠となります。

```
First broadcast wins. With estimated broadcast time t₀, a third party accepts after seeing no conflict for 2·t₀; a recipient can wait 4·t₀.
Each node decides for itself whether to blacklist the forker. No network-wide blacklist agreement is needed.
Collusion: colluders must broadcast the chain as soon as they pay an honest node, which exposes the attacker.
Partition edge case: for high-value payments, wait the maximum plausible partition duration plus 3·t₀.
```

私の主張は、これが経済的仮定に依存せずに[[double-spending|二重支払い]]に耐え、いかなる障害の被害も単一のオブジェクト内に留めるというものです。検証レベル：論文1本、デモ、そして[[testnet|テストネット]]。[[mainnet|メインネット]]や独立した監査はありません。

異議を唱えてほしい質問

```
How wrong can the estimated t₀ be before the 2·t₀ rule fails? What does a realistic adversarial latency model look like?
Is “eclipse affects one object” a real difference from Bitcoin’s eclipse-plus-stale-chain, or are the two threat models closer than I describe?
Which dimensions are missing from the list above?
```

リポジトリ: [GitHub - saintthor/blockchain\_skills: agent-skill、claude-skill、blockchain、decentralization · GitHub](https://github.com/saintthor/blockchain_skills)
インストール (Claude Code): /plugin marketplace add saintthor/blockchain\_skills
論文: [Achieving Greater Decentralization with Atomic Ownership Blockchains | Ledger](https://doi.org/10.5195/ledger.2025.425)
Wiki: [https://en.everybodywiki.com/index.php?title=Atomic\_Ownership\_Blockchains](https://en.everybodywiki.com/index.php?title=Atomic_Ownership_Blockchains)

開示：私はAtomic Ownership Blockchains (AOB)の作成者であり、このリポジトリでは他の設計よりもAOBについて詳しく説明しています。

これは何か

これは、LLMエージェントがブロックチェーンアーキテクチャを単一の数値ではなく、複数の独立した次元で分析できるようにするオープンソースのスキル（SKILL.md形式、Apache-2.0）です。ナカモト係数は単一サブシステムのスナップショットであり、陳腐化しやすく、コンセンサスメカニズム間で比較できないため、このスキルではそれをランキングではなくサブシステムごとの入力として扱います。

現在カバーされている次元：

```
ノード/バリデータ集中度（サブシステムごとのナカモト係数）、ステーク/富の集中度（ジニ係数/HHI）、クライアント多様性、ネットワーク/インフラストラクチャ
コンセンサス依存スコープ：このトランザクションをファイナライズするために、それとは無関係な当事者からの合意が必要か？
特権アクター、支払いファイナリティ権限、経済的仮定への依存
シビル攻撃への露出、単一の攻撃または単一の鍵紛失による被害範囲、エクリプス攻撃/ネットワークビュー攻撃、参加コスト
```

これはPoW、PoS、DAG、シャード設計、およびAOBを比較し、各設計のアーキテクチャが何をするかとは別に、その検証レベル（本番稼働履歴、監査、テストネット）を報告します。

AOBの二重支払いルール（批判を求む）

各アトミックオブジェクトは独自のチェーンを持ち、現在の所有者のみが書き込み可能です。したがって、いかなるフォークも、一人の人物が二度署名した直接的な証拠となります。

```
ファーストブロードキャストが勝利します。推定ブロードキャスト時間 t₀ の場合、第三者は2・t₀の間競合がないことを確認した後に承認します。受信者は4・t₀待つことができます。
各ノードは、フォーカーをブラックリストに載せるかどうかを独自に決定します。ネットワーク全体でのブラックリスト合意は必要ありません。
共謀：共謀者は、正直なノードに支払うとすぐにチェーンをブロードキャストしなければならず、これにより攻撃者が露呈します。
パーティションエッジケース：高額な支払いの場合、最大で考えられるパーティション期間に3・t₀を加えた時間待ちます。
```

私の主張は、これが経済的仮定に依存せずに二重支払いに耐え、いかなる障害の被害も単一のオブジェクト内に留めるというものです。検証レベル：論文1本、デモ、そしてテストネット。メインネットや独立した監査はありません。

異議を唱えてほしい質問

```
推定t₀は、2・t₀ルールが破綻するまでにどれくらい間違っている可能性がありますか？現実的なadversarial latency modelはどのようなものに見えますか？
「エクリプス攻撃が1つのオブジェクトに影響する」ことは、ビットコインのeclipse-plus-stale-chainとは本当に異なるのでしょうか、それとも2つのthreat modelsは私が説明するよりも近いのでしょうか？
上記のリストから欠けている次元は何ですか？
```

リポジトリ: [GitHub - saintthor/blockchain\_skills: agent-skill、claude-skill、blockchain、decentralization · GitHub](https://github.com/saintthor/blockchain_skills)
インストール (Claude Code): /plugin marketplace add saintthor/blockchain\_skills
論文: [Achieving Greater Decentralization with Atomic Ownership Blockchains | Ledger](https://doi.org/10.5195/ledger.2025.425)
Wiki: [https://en.everybodywiki.com/index.php?title=Atomic\_Ownership\_Blockchains](https://en.everybodywiki.com/index.php?title=Atomic_Ownership_Blockchains)

*1件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethresear.ch/t/multi-dimensional-decentralization-metrics-and-an-open-question-on-first-broadcast-double-spend-rules/26242)
