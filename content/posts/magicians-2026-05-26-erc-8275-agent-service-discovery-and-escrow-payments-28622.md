---
title: 'ERC-8275: エージェントサービスディスカバリとエスクロー決済'
original_title: 'ERC-8275: Agent Service Discovery and Escrow Payments'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8275-agent-service-discovery-and-escrow-payments/28622
author: Panini
date: '2026-05-26'
category: ERCs
tags:
  - ercs
  - applications
  - ux
  - smart-contracts
  - protocol-design
  - ai-agents
  - payments
topic_id: '28622'
translated_at: '2026-05-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8275: Agent Service Discovery and Escrow Payments](https://ethereum-magicians.org/t/erc-8275-agent-service-discovery-and-escrow-payments/28622) — Panini (2026-05-26)

簡単な更新情報 — 正式な仕様のPRがethereum/ERCsリポジトリに提出されました。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1774)

#### [ERC-8267: エージェントサービスディスカバリとエスクロー決済標準の追加](https://github.com/ethereum/ERCs/pull/1774)

`master` ← `Brooks1003:erc-8267`

UTC 5月26日 01:32PM にオープン

[![](https://avatars.githubusercontent.com/u/258250070?v=4) Brooks1003](https://github.com/Brooks1003)

[+224 \-0](https://github.com/ethereum/ERCs/pull/1774/files)

このPRは、AIエージェントのサービスディスカバリとエスクロー決済インフラストラクチャの標準であるERC-8267を提案します。

## 概要

ERC-8267は、3つのデカップリングされたインターフェースを定義します。

*   **IAgentRegistry**: イベント駆動型エージェントサービスディスカバリ
*   **IAgentEscrow**: 紛争解決機能付きの信頼最小化エスクロー決済
*   **IAgentReputation**: 自然減衰を伴うイベント由来の評判スコアリング

## 主要な設計決定

1.  **イベント駆動型ディスカバリ**: 検索APIはありません。クライアントは`AgentRegistered`イベントをローカルでインデックス化し、ローカルルールからグローバルなディスカバリが生まれます。
2.  **3層デカップリング**: レジストリ、エスクロー、評判は独立してデプロイ可能であり、標準化されたイベントを通じてのみ通信します。
3.  **受動的評判**: 手動レビューはありません。スコアはエスクローイベントから完全に導出されます。
4.  **自然減衰**: 非アクティブなエージェントは時間とともに重みを失います（フェロモン蒸発モデル）。

## 既存のERCとの関係

*   **ERC-8004**: エージェントID (8267レジストリは8004の`agentId`を参照可能)
*   **ERC-8300**: アテステーションゲート型アクション (8267はディスカバリ+決済を処理)
*   **ERC-8126**: セキュリティスコアリング (8267レピュテーションは8126のスコアを利用可能)
*   **ERC-8240**: 信頼インフラ (8267は市場レイヤーで補完)

議論はこちらをご覧ください: https://ethereum-magicians.org/t/draft-erc-erc-8267-agent-service-discovery-and-escrow-payment-standard/28622

コミュニティからのフィードバックとレビューを楽しみにしています。

*11件の投稿 - 3人の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8275-agent-service-discovery-and-escrow-payments/28622)
