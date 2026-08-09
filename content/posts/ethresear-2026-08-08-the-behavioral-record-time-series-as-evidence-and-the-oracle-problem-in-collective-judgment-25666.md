---
title: 行動記録：時系列を証拠とする集合的判断におけるオラクル問題
original_title: >-
  The Behavioral Record: Time-Series as Evidence and the Oracle Problem in
  Collective Judgment
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/the-behavioral-record-time-series-as-evidence-and-the-oracle-problem-in-collective-judgment/25666
author: Dede-Qorqud
date: '2026-08-08'
category: Applications
tags:
  - applications
  - research
  - protocol-design
  - ai-agents
  - security
  - economics
  - data-analysis
  - mechanism-design
topic_id: '25666'
translated_at: '2026-08-09'
translator: gemini-2.5-flash
---

> [!note] 原文
> [The Behavioral Record: Time-Series as Evidence and the Oracle Problem in Collective Judgment](https://ethresear.ch/t/the-behavioral-record-time-series-as-evidence-and-the-oracle-problem-in-collective-judgment/25666) — Dede-Qorqud (2026-08-08)

*「人の徳の強さは、その特別な努力によって測られるべきではなく、その習慣的な行為によって測られるべきである。」* — ブレーズ・パスカル、『パンセ』。

全く異なる問題を解決しようとした論文があり、それが我々の問題にとって重要な発見をもたらしました。

Huynhら (arXiv:2308.16391) は、[[glossary/Ethereum|イーサリアム]]上でのポンジスキーム（Ponzi scheme）検出に取り組んでいました。標準的なアプローチは、スマートコントラクト (smart contract) のソースコードを分析することです。問題は、コードが書き換えられたり、難読化されたり、再構築されたりする可能性があることです。詐欺師は検出器が再訓練されるよりも速く適応します。そして、イーサリアム上のコントラクトの77%のソースコードは、そもそも公開されていません。

著者らは異なる賭けに出ました。コードではなく、トランザクション履歴に着目したのです。トランザクションは事後に書き換えることはできません。オンチェーンで人工的に作成するには約14ドルと高価です。コントラクト作成者だけでなく、あらゆる参加者がそれに貢献します。コントラクトの行動記録は集合的に形成され、不変のままです。

しかし、重要な発見はトランザクションベースのアプローチ自体ではありません。それはすでに存在していました。鍵となるのは時間の測定です。コントラクトの全ライフタイムにわたる行動を追跡する63の新しい時系列特徴量を追加することで、著者らはF1スコア (F1-score) で検出精度を30%向上させました。ポンジスキームは単一のトランザクションでは明らかになりません。それは、トランザクションが時間とともにどのように展開するか、つまりローンチ時のピーク活動、特徴的な残高の急落、短縮されたライフサイクルといった形で現れます。これは静的なスナップショットでは見えません。動的な変化の中で初めて読み取れるのです。

ここで私は立ち止まりました。

既存のほとんどのアルゴリズムは、スマートコントラクトのソースコードを分析することでポンジスキームを特定しようとします。それらは形式的な宣言に基づいて機能します。BeTrueCoreは集合的なシグナルのアーキテクチャに基づいて機能します。これは優劣ではなく、直交するものです。

コード → 操作可能。トランザクション → 不変。

しかし、構造原理は同じです。宣言はシステムが*自分自身を何と呼ぶか*を述べます。行動記録は、現実の圧力の下で、時間を通じて、一連のアクションの中で、それが*何であるか*を示します。

**行動時系列としての[[glossary/VWU|VWU（Vote Weight Unit）]]。**

BeTrueCoreにおける[[glossary/VWU|VWU]]は、オペレーター (operator) によって割り当てられるスコアではありません。それは参加者の選択の蓄積された軌跡です。セッションごとに、[[glossary/Cryptographic-Isolation|暗号的隔離 (cryptographic isolation)]]の下で、32のTDSH整合性パラメータに対して測定されます。形式的には、各セッションは重み空間における縮小写像 (contractive mapping) です。このシーケンスの極限が[[glossary/VWU|VWU]]です。ベイズ更新 (Bayesian updating) と指数平滑化 (exponential smoothing) は、オペレーターが提供するラベルに対してではなく、参加者自身の蓄積された前例に対して行われます。

更新チャネルは書き込み可能な表面ではありません。それは参加者全体に分散され、遡及的に不変であり、時間を通じてのみ読み取ることができます。

これはまさにHuynhらがトランザクションデータで発見したものです。多くの独立したインタラクションを通じてゆっくりと形成され、動的な変化の中で初めて可視化されるため、大規模に偽造することはできないパターンです。

**時系列異常検出器としてのSentinel。**

レイヤーL5の[[glossary/AI-agents|AIエージェント (AI agent)]] Sentinelは、集合的判断に適用されるのと同じ原則で動作します。独立した参加者は、高エントロピーで非同期の、カオス的なタイミングパターンを生成します。調整されたネットワークはスペクトル圧縮（時間を通じてのみ検出可能な隠れた同期）を生成します。単一のアクションは単独では正当に見えるかもしれません。しかし、時間経過に伴うアクションのパターンはそうではありません。

Sentinelは観測します。決定はしません。読み取り専用の制約は、外部からの圧力で変更できる組織的なポリシーではありません。それはコントラクト実行環境の数学的な特性です。

**境界。**

Huynhらはリアクティブシステムを構築しました。それは行動記録がすでに存在した後に分析します。BeTrueCoreは異なります。目標は事後の操作を検出することではなく、測定が始まる前に測定環境を構造的に汚染に強くすることです。[[glossary/Time-locked-blind-sessions|タイムロック]]、投票セッションの[[glossary/Cryptographic-Isolation|暗号的隔離]]、20:00の同期的な公開 — これらは検出メカニズムではありません。これらは、行動シグナルをそもそも蓄積する価値がある条件なのです。

両方のアプローチは一つの発見に収束します。行動時系列は宣言よりも信頼性が高いということです。前者は詐欺師を捕まえることでこれを発見し、後者はこれを基盤としてアーキテクチャをゼロから構築します。

アーキテクチャは意図を判断してはなりません。それは軌跡を測定しなければなりません。

参考文献: Huynh et al. (2023). Improving the Accuracy of Transaction-Based Ponzi Detection on Ethereum. arXiv:2308.16391

前回の投稿: [Sovereign Space: When Values Need Architecture](https://ethresear.ch/t/sovereign-space-when-values-need-architecture/25485)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/the-behavioral-record-time-series-as-evidence-and-the-oracle-problem-in-collective-judgment/25666)
