---
title: '[ERCドラフト] ステーク重み付け検証ゲート'
original_title: '[Draft ERC] Staked Weighted Verification Gate'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-erc-staked-weighted-verification-gate/29194
author: jamesavechives
date: '2026-07-29'
category: ERCs
tags:
  - ercs
  - security
  - mechanism-design
  - ai-agents
  - protocol-design
  - verification
topic_id: '29194'
translated_at: '2026-07-29'
translator: gemini-2.5-flash
---

> [!note] 原文
> [[Draft ERC] Staked Weighted Verification Gate](https://ethereum-magicians.org/t/draft-erc-staked-weighted-verification-gate/29194) — jamesavechives (2026-07-29)

[[glossary/AI-agents|AIエージェント]]がクレーム生成を安価にするにつれて、クレーム検証が希少なリソースとなります。この問題に直面するシステムによって、同じプリミティブが繰り返し再発明されているのを目にします。それは、クレームは第三者が検証するまで信頼されたステータスを持たず、承認の力は**承認者自身の検証済み深度によって重み付けされ**（決して数えられず）、不正なクレームが作成者にコストを負わせるように、クレーム提出者は[[glossary/stake|ステーク]]を要求されることがあり、信頼されたステータスは**監査証跡付きで取り消し可能**である、というものです。

この[[glossary/Draft|ドラフト]]は、そのゲートのみを標準化します。具体的には、4つのトランジション（`offer / verify / settle / revoke`）、2つのビュー（`statusOf / weightOf`）、4つのイベント、および`Offered → Verified → Settled`という固定の状態機械です。`Revoked`は2つのライブ状態から到達可能で、`Settled`は終端状態です。

意図的に**スコープ外**としているのは、支払い/決済額、エージェントのアイデンティティ、重み付け関数自体、プロモーション閾値、スラッシング曲線、および取り消し仲裁です。これらはすべて実装ポリシーです。設計規律は、最近の最小限の単一関心[[glossary/ERC|Ethereum Request for Comments (ERC)]]sに従っています。つまり、2つの正直な実装が正当に異なる方法で行うであろうことは、仕様には含まれていません。

この仕様が定める2つの厳格なルールは次のとおりです。

1.  **自己検証の禁止** — クレームの主題または提案者は、そのクレームに重みを貢献することはできず、各検証者はクレームごとに最大1回しかカウントされません。

2.  **数ではなく重み** — プロモーションは、検証者自身の検証済み状態から導出された検証者の重みで表現されなければなりません。定数または自己割り当ての重みは非準拠です。

この抽象化は、[[glossary/Sybil-resistance|シビル耐性]]のための重み付け承認パッチを含め、この正確な形に収束した2つの独立して構築された本番システム（エージェントタスクマーケットプレイスと作品/資格情報レジストリ）に由来します。両方の形に対応するアダプターを備えたFoundryリファレンス実装が存在し、ここにリンクされます。

宣言された信頼度や承認数ではなく、測定された検証がなぜ正しい信頼シグナルであるかについての理論的背景: *A Mathematical Theory of Value*, arXiv:2606.12502。

完全な[[glossary/Draft|ドラフト]]: (ethereum/ERCs PRが公開され次第リンク)

フィードバックを求む点:

-   `Settled`が終端状態であるという点が、他のシステムの取り消しニーズに合致するかどうか（消費後の反証可能性を必要とするシステムは、`Verified`状態に無期限に留まり、`settle`を後戻りできない点として扱うことができます）。

-   緩やかな`weightOf`の定義（外部の検証済み状態ソースが許可され、自己割り当て禁止を満たす必要がある）が十分に厳密であるかどうか。

-   私が見落としている先行研究。

*2投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/draft-erc-staked-weighted-verification-gate/29194)
