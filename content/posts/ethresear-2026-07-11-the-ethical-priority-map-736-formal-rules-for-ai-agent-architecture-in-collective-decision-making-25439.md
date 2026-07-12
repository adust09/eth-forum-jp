---
title: 倫理的優先度マップ：集合的意思決定におけるAIエージェントアーキテクチャのための736の形式ルール
original_title: >-
  The Ethical Priority Map: 736 Formal Rules for AI Agent Architecture in
  Collective Decision-Making
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/the-ethical-priority-map-736-formal-rules-for-ai-agent-architecture-in-collective-decision-making/25439
author: Dede-Qorqud
date: '2026-07-11'
category: 'zk-s[nt]arks'
tags:
  - snarks
  - ai-agents
  - governance
  - protocol-design
  - research
  - applications
  - verification
  - ethics
topic_id: '25439'
translated_at: '2026-07-12'
translator: gemini-2.5-flash
---

> [!note] 原文
> [The Ethical Priority Map: 736 Formal Rules for AI Agent Architecture in Collective Decision-Making](https://ethresear.ch/t/the-ethical-priority-map-736-formal-rules-for-ai-agent-architecture-in-collective-decision-making/25439) — Dede-Qorqud (2026-07-11)

すべてのガバナンスシステムには、検証層、実行層、および決定層があります。この投稿では、BeTrueCoreのAIエージェント層（集合的判断を観測する層）の内部で何が起こるかについて、完全な形式仕様を提供します。

ほとんどのAI倫理フレームワークは、「システムはどのような特性を示すべきか？」という一つの問いに答えます。TDSHは、それ以前の異なる問いに答えます。「集合的意思決定プロセスは、どの時点で完全性を失い始めるのか？」

この区別 — システム特性とプロセス劣化の閾値との間の — が、AIガバナンス手法の領域におけるTDSHの位置を定義します。

**正式に指定されたもの：**

23のアシロマAI原則 × 32のTDSHパラメータ = 736の交点。各点は単なるラベルではなく、優先度割り当て（CRITICAL / HIGH / MEDIUM / SUPERPOSITION）と、ハーモニーエージェントが倫理的評決を計算するための論理ルールです。

優先度分布：

-   CRITICAL: 169セル (23%)
-   HIGH: 515セル (70%)
-   MEDIUM: 47セル (6%)
-   SUPERPOSITION: 5セル (1%)

**コア原則：**

L5の9つのAIエージェント（アナリスト、ストラテジスト、センチネル — それぞれ3つずつ）は、厳格な読み取り専用モードで動作します。彼らは観測を通じて記録し測定しますが、決して決定を下しません。

形式的な標準なしの観測は観測ではなく、印象です。23×32の行列は、印象を公証人の証言へと変換します。その証言の結果は、信号機信号（GREEN / YELLOW / RED）であり、ハーモニーエージェントが発行を許可されている唯一の評決です。鏡は仲裁者と実行者を区別せず、空間全体を反映します。公証人はどちらの側にもつきません。行列は両方を測定します。

完全な仕様：10.5281/zenodo.21225420

*鏡は映し出す。公証人は証言する。行列は測定する。*

*2投稿 - 2参加者*

[トピック全文を読む](https://ethresear.ch/t/the-ethical-priority-map-736-formal-rules-for-ai-agent-architecture-in-collective-decision-making/25439)
