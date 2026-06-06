---
title: Vitalik ButerinはAIが私たちに代わって投票することを提案。私たちは、誰も見ていない暗号空間で私たちが投票することを提案する
original_title: >-
  Vitalik Buterin proposes that AI votes for us. We propose a cryptographic
  space where we vote — and no one is watching
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/vitalik-buterin-proposes-that-ai-votes-for-us-we-propose-a-cryptographic-space-where-we-vote-and-no-one-is-watching/25077
author: Dede-Qorqud
date: '2026-06-03'
category: 'zk-s[nt]arks'
tags:
  - snarks
  - governance
  - cryptography
  - zk
  - applications
  - scaling
  - data-availability
  - ai-agents
  - privacy
topic_id: '25077'
translated_at: '2026-06-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Vitalik Buterin proposes that AI votes for us. We propose a cryptographic space where we vote — and no one is watching](https://ethresear.ch/t/vitalik-buterin-proposes-that-ai-votes-for-us-we-propose-a-cryptographic-space-where-we-vote-and-no-one-is-watching/25077) — Dede-Qorqud (2026-06-03)

2026年2月、Vitalik Buterinは、ユーザーの行動履歴で訓練されたパーソナルAIエージェント（「AIスチュワード」）を配備し、DAOでの投票を自動化することを提案しました。このコンセプトは、投票率の低さに対処し、大規模なトークン保有者への依存を軽減し、中央集権的な制御なしでガバナンスを簡素化するように設計されています。

彼が指摘する問題は現実のものです。低い投票率、権力の集中、社会的圧力下での選好の偽装。

私たちはその診断に同意します。私たちは異なる治療法を提案します。

— **Buterinのアプローチ:** 投票をAIエージェントに委任する。マシンがあなたの価値観を解釈し、あなたに代わって投票します。

— **BeTrueCoreのアプローチ:** 投票を人間に戻す — 暗号学的に保護された状態で。AIは読み取りアクセス権を持つ公証人に過ぎません。私たちが投票します。このアーキテクチャは「誰も見ていない」ことを保証します。

この違いは根本的です。Buterinのモデルでは、AIがあなたの価値観を解釈します。BeTrueCoreでは、あなたはそれを直接表現します — 観察者の不在を数学的に保証する空間で。

**このアイデアはどこから来たのか？**

GCP（プリンストン、1998年）は、9/11、ダイアナ妃の死、大規模な地震など、人類に深く影響を与えた出来事の際に、グローバルな乱数生成器 (RNG) ネットワークで統計的に有意な逸脱を記録しました。ランダム性からの逸脱は p < 0.001 に達しました。この解釈は議論されていますが、疑問は残ります。もし集合的な信号が存在するなら、社会的圧力のノイズなしに、どのようにしてそれをきれいに測定できるでしょうか？BeTrueCoreはこの原則をアーキテクチャ的に実装しています。20:00のパノラマは、重ね合わせから決定された結果への「崩壊」の瞬間であり、測定の完全性に対する暗号学的保証が付いています。詳細な分析はプレプリントにあります: [https://doi.org/10.5281/zenodo.20319857](https://doi.org/10.5281/zenodo.20319857)

**仕組み:**

完全なアーキテクチャは一連のプレプリントで説明されています。主要DOI: [https://doi.org/10.5281/zenodo.20424602](https://doi.org/10.5281/zenodo.20424602)

主要な要素は以下の通りです。

→ **[[Zero-Knowledge-Proof|ゼロ知識証明]] (ZK-Proofs) + MACI:** あなたの最終投票はゼロ知識暗号化によって保護されます。AIエージェントでさえ読み取り専用アクセスしか持たず、あなたを匿名解除することはできません。

→ **Lit Protocolによるタイムロック:** 中間結果は20:00の同期復号まで誰にも見えません。バンドワゴン効果も、戦略的投票もありません。

→ **VWU (Vote Weight Unit):** 重みはトークン数ではなく、時間とともに検証された倫理的判断の質によって決定されます。指数平滑化を伴うベイズ適応。検証者は蓄積された先例Dです。パラドックス検出器はゲーミフィケーションによる操作をブロックします。コア原則はプレプリントにあります: [https://doi.org/10.5281/zenodo.20296816](https://doi.org/10.5281/zenodo.20296816)

→ **ホワイトフェザー効果:** 集合信号Pがコンセンサス閾値に達しない場合、システムはデッドロックを登録し、確率的脱出を自動的に起動します。

dXt = f(Xt, t)dt + g(Xt, t)dWt

決定論的探索 $f(X_t,t)dt$ とウィーナー過程 $g(X_t,t)dW_t$ — 形式論理が尽きる局所的最小値からの脱出。これは比喩ではなく、形式述語 $P \ge \text{Threshold}$ によって活性化される伊藤の式です。

**技術スタック — 5つのレイヤー:**

1.  ```
     **L0 — Identity:** MPC + FaceID + Web3Auth — Biometric sovereignty, zero single point of failure.
    ```
    
2.  ```
     **L1 — Proofs:** zk-SNARKs + MACI — Anonymity, anti-collusion, ZK-Proof generation.
    ```
    
3.  ```
     **L2 — Execution:** Optimism Rollup — Scalability, low transaction costs.
    ```
    
4.  ```
     **L3 — Time-lock:** Lit Protocol — Time-lock encryption, information symmetry.
    ```
    
5.  ```
     **L4 — Archive:** Celestia + Ethereum — Data availability, immutable audit trail.
    ```
    

AIエージェント（ストラテジスト、アナリスト、ガーディアン）は読み取り専用アクセスに制限されており、これはスマートコントラクトにエンコードされた技術的に不変の特性です。最終決定は常に[[Zero-Knowledge-Proof|ゼロ知識証明]]暗号によって行われます。

**BeTrueCoreはまず第一にゲームです。**

各参加者は、完全な暗号学的隔離の条件下で、1日あたり正確に7つの離散的な決定を行います — チャットなし、中間結果なし、社会的圧力なし。インタラクションは1日または1週間の都合の良い時間に分散され、1〜2時間以内です。活動、ペース、エンゲージメントの深さは、参加者自身の内なる衝動にのみ依存します。

ブラインドセッション全体を通じて、[[Zero-Knowledge-Proof|ゼロ知識証明]]プロトコルは絶対的な機密性を保証します。主権的な情報原子化は意識的な選択です。内省と内なる静寂のための「デジタル要塞」。各参加者の選択は、外部の操作的なノイズ（ダークノイズ）から保護されます。原則は「私のアイデンティティは私の要塞」です。

AIメトロノームは、人間の衝動から来るエントロピーを消去しません — それを確率共鳴 (Stochastic Resonance) として利用します。これは、システムが局所的なデッドロックから脱出し、セッションの最も一貫した信号を結晶化させるのに役立つ創造的なエネルギーです。これらのブラインドセッションは、ボトムアップでLogos Lを形成します。

参加者の検証は、23×32フレームワークを通じて構築されます。これは、23のアシロマAI原則と32の思慮深い意思決定システム衛生 (TDSH) パラメータの直積です。736の交差点 — それぞれが技術要件です。

**結果:**

投票プラットフォームではなく、測定の完全性を暗号学的に保証する集合的直感を測定するためのツールです。

私たちはButerinの提案と競合しているわけではありません。私たちは追加のレイヤーを提供しています。それは、フィルタリングされていない、即時で、主権的な人間の信号が必要な瞬間のためのインフラストラクチャです。

BeTrueCoreは既存のソリューションの競合相手でも、代替品でも、「より良いプロトコル」でもありません。それはインフラストラクチャレイヤーです — TCP/IPがその上に構築されたサービスと競合しないのと同じように。BeTrueCoreは、地方自治体の民主主義から企業ガバナンス、国際人道研究からWeb3エコシステムまで、まったく新しいアプリケーションの基盤として機能できます。

MVPは定義されています。MACI + zk-SNARKアイデンティティ + VWUスマートコントラクト。最小チームは3名の専門家。技術仕様は準備済みです。

制限を含むコンセプトの再帰的分析: [https://doi.org/10.5281/zenodo.20468741](https://doi.org/10.5281/zenodo.20468741)

これはMVP前の段階にある理論的なアーキテクチャです。技術的な実装仕様は、開発チームのために意図的にオープンにされています。まさにそれが私たちがここにいる理由です。

**開かれた地平:**

システムは自身の境界 — 閾値述語、パラドックス検出器、Logosの毎日のベイズ更新、キャリブレーションポイントとしてのナッシュ均衡 — を形式化します。しかし、ゲーデルは言います。「十分に強力な形式システムは、その内部では証明できない真理を含む」と。侘び寂びは言います。「不完全なものは美しい」と。BeTrueCoreはこれを欠陥ではなく、アーキテクチャ原則として受け入れています。

私たちは、どの問題が未解決のままなのかを知りません — まさにそれらが未解決だからです。内部からは見えない、アーキテクチャの根本的なエラーはあるでしょうか？

**何が不足しているでしょうか？**

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/vitalik-buterin-proposes-that-ai-votes-for-us-we-propose-a-cryptographic-space-where-we-vote-and-no-one-is-watching/25077)
