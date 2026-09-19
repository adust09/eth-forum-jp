---
title: 分散型ギルド/エージェントシステムにおけるプロジェクト申請のための証拠レビューフレームワーク
original_title: >-
  Evidence Review Framework for Project Applications in Decentralized
  Guilds/Agent Systems
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/evidence-review-framework-for-project-applications-in-decentralized-guilds-agent-systems/26048
author: MATOBOYCRYPTO65
date: '2026-09-19'
category: Applications
tags:
  - applications
  - ux
  - protocol-design
  - governance
  - mechanism-design
  - ai-agents
  - account-abstraction
  - research
topic_id: '26048'
translated_at: '2026-09-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Evidence Review Framework for Project Applications in Decentralized Guilds/Agent Systems](https://ethresear.ch/t/evidence-review-framework-for-project-applications-in-decentralized-guilds-agent-systems/26048) — MATOBOYCRYPTO65 (2026-09-19)

こんにちは :waving_hand:、

分散型ギルド（および関連するエージェント/調整システム）におけるプロジェクト申請のための**構造化された証拠レビュー**に関する作業を共有し、フィードバックをいただきたいと思います。

**動機:**

[[AI-agents|トラストレスなエージェント]]、[[Account-Authority-Lifecycle|アカウント権限ライフサイクル]]、[[Regulated-Asset-Claim|規制資産クレーム]]、[[Token-Bound-Account|NFT紐付けアカウント]]、[[Confidential-Agent-Policy-Verdicts|機密エージェントポリシー判定]]に関する議論が進むにつれて、プロジェクト（またはエージェント）が**証拠パッケージ**を提出し、ギルドやコレクティブ内でメンバーシップ、権限、資金、その他の特権を受け取る前にそれらをレビューしてもらう信頼できる方法という、繰り返し現れる実用的なニーズがあります。

現在のプロセスはしばしばアドホックでオフチェーンで行われたり、明確なオンチェーン/ハイブリッドな[[Attestation|アテステーション]]を欠いています。これにより摩擦が生じ、新たなエージェントおよびアカウント標準との[[Composability|コンポーザビリティ]]が低下しています。

**ハイレベルなアイデア**

以下をサポートするフレームワーク：

*   証拠（コード、監査、パフォーマンスデータ、コンプライアンス証明、PRなど）の構造化された提出
*   検証可能または[[Attestation|アテステーション]]可能な結果を伴う、指定されたまたはオープンなレビュー担当者ワークフロー
*   評判、[[On-chain-Execution-Authority|アカウント権限]]、[[Confidential-Agent-Policy-Verdicts|ポリシー判定]]、またはアクセス制御に利用できるレビュー結果の記録
*   エージェント、[[Modular-Trust-Architecture|信頼インフラ]]、および[[Binding|紐付けアカウント]]に焦点を当てた既存および新たな[[ERC|ERC]]との潜在的な[[Composability|コンポーザビリティ]]

**フィードバックを求めている点**

1.  [ethresear.ch](http://ethresear.ch/)における既存の[[research|研究]]方向性（アプリケーション、経済学、その他のカテゴリ）との適合性。
2.  [[Cryptoeconomics|クリプトエコノミクス]]設計 — 正直なレビュー、[[MACI|反共謀]]、および[[Sybil-resistance|シビル耐性]]のための[[Incentive-Design|インセンティブ設計]]。
3.  [[AI-agent-verification-stack|エージェント信頼システム]]および[[Account-Abstraction|アカウント抽象化]]との統合ポイント。
4.  参照すべき先行研究、プロトタイプ、または関連する議論。
5.  この一部が[[Ethereum-Magicians|Ethereum Magicians]]での[[ERC|ERC]]議論としてより適切かどうか。

詳細な設計ノート、図、またはプロトタイプのアウトラインは、今後の投稿で共有できます。コミュニティの意見に基づいて改善していくことを楽しみにしています。

皆様のご意見とご批判をお待ちしております。

ありがとうございます！

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/evidence-review-framework-for-project-applications-in-decentralized-guilds-agent-systems/26048)
