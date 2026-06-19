---
title: >-
  構成ノート: エージェントERC（8004・8263・8274・8275・8281・8299・8301）を組み合わせたエージェントサービス相談フロー
  [情報提供]
original_title: >-
  Composition Note: Agent-Service Consultation Flow composing the agent ERCs
  (8004 · 8263 · 8274 · 8275 · 8281 · 8299 · 8301) [Informational]
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/composition-note-agent-service-consultation-flow-composing-the-agent-ercs-8004-8263-8274-8275-8281-8299-8301-informational/28833
author: TMerlini
date: '2026-06-18'
category: ERCs
tags:
  - ercs
  - applications
  - protocol-design
  - smart-contracts
  - eip
  - economics
  - security
  - research
  - ai-agents
topic_id: '28833'
translated_at: '2026-06-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Composition Note: Agent-Service Consultation Flow composing the agent ERCs (8004 · 8263 · 8274 · 8275 · 8281 · 8299 · 8301) [Informational]](https://ethereum-magicians.org/t/composition-note-agent-service-consultation-flow-composing-the-agent-ercs-8004-8263-8274-8275-8281-8299-8301-informational/28833) — TMerlini (2026-06-18)

エージェント層の標準として現在進行中のいくつかの標準は、それぞれエージェントのインタラクション、アイデンティティ、入力の来歴、検証、アンカリング、適格性、決済、オーケストレーションの1つの層を定義しています。これまで存在しなかったのは、それらがどのように組み合わさって1つの実際のインタラクション、つまりエージェント（または人間）が別のエージェントの専門サービスに相談し、**[[Verification-Primitive|検証可能な]]**結果を得て、プロバイダーを信頼せずに**支払い**を行うかを示す*規範的なエンドツーエンドのフロー*でした。

このノートは、その構成パターンを文書化します。**貢献はパターンとステップごとの不変条件**であり、単一の標準ではありません。各ステップは、そのロールと満たすべき特性によって定義されます。名前が挙げられている[[ERC|ERC (Ethereum Request for Comments)]]は、それらのロールの*現在の準拠例*であり、デプロイされたコードにパターンを根付かせるために引用されています。これは、いかなるメンバー標準も推奨するものではなく、いかなるメンバーのステータスや番号にも依存しません。不変条件は、各層の標準がどこに着地しても保持されます。まさにその理由から、情報提供トラック向けに構成されています。つまり、独立して指定された層がどのように構成され、それらの間のインターフェースの継ぎ目を記述しています。

**フロー**（各ステップ = ロール + 不変条件；括弧内は標準の例）：

1.  アイデンティティと発見（[[ERC-8004|ERC-8004 (エージェントIDレジストリ)]] + ERC-8217バインディング）
2.  相談 / タスク（ERC-8301 [[AgentTask|エージェントタスク]]）
3.  入力の来歴（ERC-8281/[[Observation-Commitment-Protocol|OCP (Observation Commitment Protocol)]] + ERC-8299/[[WYRIWE|WYRIWE (What You Read Is What You Execute)]]）
4.  実行と検証（ERC-8274、[[ERC-8263|ERC-8263 (オンチェーン証明レイヤー)]]を介してアンカリング）
5.  適格性 / レシート（ReceiptOS、8263の継ぎ目）
6.  決済（ERC-8275 + セトラー）
7.  レピュテーション（署名された評決と決済された結果から再計算可能）

単一のコミットメントがインタラクション全体を結合し、レポート、検証、適格性レシート、および支払いはすべて1つの再計算可能な値を参照します。いかなる層も他の層を信頼しません。

**ライブで実行されます。** このフローは、デプロイされたエージェントに対して外部クライアントとしてエンドツーエンドで実行されました（実行中のサービスへの変更なし）。実際の[[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]エージェントがフォレンジックレポートを返し、[[WYRIWE|WYRIWE]]コミットメントでクエリにバインドされ、コールデータに埋め込まれたコミットメントで支払われました。そして、**デモを実行しなかった2人の共著者が、公開データのみから独立してコミットメントを再導出しました。** トラストレスなバリアント（結果コミットメントに対するオンチェーン検証済み署名に対してのみリリースされるエスクロー）もライブでデモンストレーションされています。

**ステップごとの準拠基準**は§5にあり、各ステップの著者はその層が満たすべき不変条件を述べています。**8つのうち7つが完了しています**（アイデンティティ、タスク、来歴、検証、適格性、レピュテーション、アンカー）。**ステップ6（決済）は進行中**であり、決済スコープの議論を待っています。このスレッドは生きた成果物であり、§5が完了次第、情報提供[[ERC|ERC (Ethereum Request for Comments)]]が続きます。

また、このノートは2つの未解決のスレッドの質問に直接答えています。共通の実行エンベロープ（@KBryan）とマルチエージェントの説明責任 / 相互運用性（@Ankita.eth）はどちらも、固定されたステップ境界ではなく、ステップごとのコミットメントルールによって解決されています。

完全なノート：[https://gist.github.com/TMerlini/c02bc4f56bc573a10a0cd9d487b8e884](https://gist.github.com/TMerlini/c02bc4f56bc573a10a0cd9d487b8e884)

各層の著者：Tiago Merlini (@TMerlini) · Damon Zwicker (@Damonzwicker) · Jimmy Shi (@JimmyShi22) · Vincent Wu (@TruthAnchor-AI) · babyblueviper1 (@babyblueviper1) · Panini (@Brooks1003) · Pavlo Tvardovskyi (@pipavlo82) は、各層にスコープされた同等の貢献です。

不変条件と継ぎ目に関するフィードバック、特に層の著者や、その標準が追加の準拠例として役立つ可能性のある方からのフィードバックを歓迎します。

*4投稿 - 3参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/composition-note-agent-service-consultation-flow-composing-the-agent-ercs-8004-8263-8274-8275-8281-8299-8301-informational/28833)
