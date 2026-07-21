---
title: 主権的空間：価値がアーキテクチャを必要とするとき
original_title: 'Sovereign Space: When Values Need Architecture'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/sovereign-space-when-values-need-architecture/25485'
author: Dede-Qorqud
date: '2026-07-20'
category: Applications
tags:
  - applications
  - consensus
  - cryptography
  - governance
  - privacy
  - protocol-design
  - ai-agents
  - sovereign-space
  - collective-intelligence
topic_id: '25485'
translated_at: '2026-07-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Sovereign Space: When Values Need Architecture](https://ethresear.ch/t/sovereign-space-when-values-need-architecture/25485) — Dede-Qorqud (2026-07-20)

尋ねるのは簡単だが答えるのは難しい問い：テクノロジーが真の主権的空間を創出するとは、どういう意味なのだろうか？

この言葉は保証を意味する。ポリシーではない。組織的なコミットメントではない。ロードマップに記された価値ではない。保証とは、誰が組織を運営しているか、誰が理事を務めているか、どのような外部圧力に直面しているかに関わらず、維持されるものだ。

保証とは、誰が統治し、誰が統治されるかに関わらず維持されるものだ。保証とは、アーキテクチャにおける対称性の原則に基づいているものだ。TDSHモジュール1（検証とフィルタリング）では、システムの出力はオペレーターのいかなる変換に対しても不変である。これは宣言や約束ではない。これは不変の原則である。

主権的空間を*宣言する*ことと、それを*構築する*ことの間のギャップこそが、現在の私たちの中心的なエンジニアリング問題である。そして、このギャップは、いかなる制度改革によっても埋められない。なぜなら、問題は制度的なものではなく、アーキテクチャ的なものだからだ。

**二つのプライバシーモデル。**

既存のほとんどのシステム（ガバナンスプロトコルの大部分を含む）において、プライバシーはアクセス制御の特性である。つまり、誰が何を見ることを許されるかであり、管理者、コントラクト、または信頼の仮定によって強制される。これは**ポリシー**としてのプライバシーである。

BeTrueCoreは、プライバシーを**述語 (predicate)** として実装する。これは、誰がプロトコルを運用するか、規制圧力があるか、創設組織が存続し続けるかに関わらず、維持されるプロトコルの数学的特性である。

この区別は微妙なものではない。

— アクセス制御モデル：プライバシーは、鍵を管理する機関がそのコミットメントを維持する*限り*維持される。

— 暗号モデル：プライバシーは、数学が維持される*限り*維持される。

私たちは後者のモデルのために設計する。機関を信用していないからではない。機関は変化するということを理解しているからだ。

**主権的空間が実際に要求するもの。**

主権的空間の宣言とその実現を隔てる3つの失敗モードがある。

**1. 組織的ドリフト (Institutional drift)。** 強固な原則を持って始まった組織は、規模、規制、市場圧力に遭遇する。プライバシーへのコミットメントは、選好になり、次にガイドラインになり、そして過去の脚注となる。これは腐敗ではない。外部制約の下で運営されるあらゆる組織の自然なライフサイクルである。解決策はより良い組織ではない。組織の忠実性を必要としないアーキテクチャである。

**2. 観測者汚染 (Observer contamination)。** よく設計されたシステムでさえ、中間シグナル（可視的な投票パターン、評判リスク、審議への社会的圧力）を漏洩させる。これらは、存在すべきではないと宣言したからといって消えるわけではない。プロトコルレベルでの積極的な抑制が必要である。

**3. 脆弱性としてのアイデンティティ (Identity as vulnerability)。** プラットフォーム制御の識別子、観測可能な行動リンク、または組織的KYCに依存するすべてのシステムは、主権にとっての単一障害点 (single point of failure) を生み出す。人は、最も弱いアイデンティティ依存性と同じくらいしか主権を持たない。

BeTrueCoreは、これらのそれぞれに対して、理論レベルでアーキテクチャ的な応答を提案する。

**述語層。**

理論モデルでは、この層は次のように機能する。

**→ [[glossary/Zero-Knowledge-Proof|ゼロ知識証明]] + [[glossary/MACI|MACI (Minimum Anti-Collusion Infrastructure)]]**: 投票は、投票が行われた瞬間からゼロ知識暗号化によって保護される。AIエージェント（ストラテジスト、アナリスト、センチネル）は、スマートコントラクトにエンコードされた読み取り専用アクセス (read-only access) を持つ。これは設定オプションではない。これは実行環境の数学的特性である。

**→ Lit Protocolを介したタイムロック (Time-lock)**：中間結果は、同期復号 (synchronous decryption) まで、システムオペレーターを含むすべての参加者に対して不可視である。バンドワゴン効果 (bandwagon effect) には目に見える勢いが必要だ。20:00の同期開示 (synchronous reveal) はUXデザインの選択ではない。それはシグナル完全性メカニズム (signal integrity mechanism) である。集団的選好の量子 (collective quantum of preference) は、中間的な可視性による汚染なしに、一度きれいに崩壊する。

**→ [[glossary/VWU|VWU (Vote Weight Unit)]]**: ウェイトは、トークン所有権、ソーシャルグラフ、組織的割り当てによって決定されるのではなく、時間の経過とともに蓄積された倫理的判断の示された質によって決定される。指数平滑化を伴うベイズ適応 (Bayesian adaptation with exponential smoothing) が用いられる。パラドックス検出器 (paradox detector) はゲーム化をブロックする。検証者は先例 (precedent) であり、許可ではない。

**→ アイデンティティ層 ([[glossary/MPC|MPC (マルチパーティ計算)]] + FaceID + Web3Auth)**：生体認証プレゼンス (biometric presence) は暗号署名として機能し、生体認証生データ (raw biometric data) はデバイスから決して離れない。単一障害点 (single point of failure) は存在しない。「私のアイデンティティは私の要塞である」という設計要件がL0を形作ったのであり、マーケティングの要約ではない。

**→ [[glossary/Data-Availability|データアベイラビリティ]] (Celestia + Ethereum)**：監査証跡 (audit trail) は不変 (immutable) であり、安価であり、いかなる単一組織の継続的な運用にも依存しない。アーカイブは組織の存続を必要としない。

**GCPの問い。**

グローバル意識プロジェクト (Global Consciousness Project)（プリンストン、1998年）は、集団的な感情的顕著性 (collective emotional salience) のイベント中に、グローバルな乱数生成器ネットワーク (random-number-generator networks) において統計的に有意な偏差を記録した。その偏差はp < 0.001に達した。その解釈は議論の余地がある。

しかし、彼らが提起するエンジニアリングの問いはそうではない。もし集団的な人間のシグナルが存在するならば、つまり社会的圧力や戦略的行動のノイズを超えて測定すべき何かがあるならば、それをどのようにきれいに測定するのか？

答えは、より良い調査設計ではない。それは*観測者除去 (observer removal)* である。観測者にもっと注意するよう求めることで、観測者汚染 (observer contamination) を減らすことはできない。測定アーキテクチャから観測者を除去するのだ。

BeTrueCoreはこれを構造的原則 (structural principle) として実装する。暗号的に強制されるブラインドセッション (blind session) は、プライバシー機能ではない。それは測定条件 (measurement condition) である。

**インフラストラクチャ層。**

TCP/IPは、その上に構築されたアプリケーションと競合しない。プロトコル層 (protocol layer) には価値観はなく、特定の価値観を*実装可能にする*仕様があるだけだ。

BeTrueCoreは、ガバナンスインフラストラクチャ (governance infrastructure) に対しても同じ関係を提案する。競合するDAOフレームワーク (DAO framework) でも、既存プラットフォームの代替でもなく、市民民主主義 (municipal democracy)、コーポレートガバナンス (corporate governance)、人道研究 (humanitarian research)、Web3プロトコルといった様々な文脈で、観測者フリーのアーキテクチャを展開可能にする述語層である。

エコシステムが組織的コミットメントとして表現しようとしてきた特性（検閲耐性 (censorship resistance)、オープン性、プライバシー、セキュリティ）は、この層では、組織的入力 (institutional inputs) ではなく、数学的出力 (mathematical outputs) となる。

私個人を信頼する必要はない。コントラクトはオープンであり、証明は検証可能である。回路を読むことができる。

**開かれた境界。**

23×32の倫理マトリックス（アシロマAI原則 (Asilomar AI Principles) と思慮深い意思決定システム衛生パラメータ (Thoughtful Decision-making System Hygiene parameters) の間の736の交点）は、システム内の[[glossary/AI-agent|AIエージェント]]に対する行動制約 (behavioral constraints) を形式化する。各交点はガイドラインではなく、技術要件 (technical requirement) である。

しかし、ゲーデル (Gödel) はまだそこにいる。十分に強力な形式システム (formal system) は、その内部では証明不可能な真理を含んでいる。私たちはこれをアーキテクチャ的に受け入れる。

ホワイトフェザー効果 (White Feather Effect) はこれを形式的にエンコードする。集団シグナルP (collective signal P) がコンセンサス閾値 (consensus threshold) に達しない場合、システムは解決を強制しない。代わりに確率的離脱 (stochastic exit) を活性化する。

**dXₜ = f(Xₜ, t)dt + g(Xₜ, t)dWₜ**

決定論的探索 (Deterministic search) とウィーナー過程 (Wiener process) — 形式論理 (formal logic) が終了する局所的最小値 (local minima) からの脱出。形式述語 (formal predicate) によって活性化される伊藤の式 (Itô’s equation)。これは比喩ではない。

わびさび (Wabi-sabi) は言う。その不完全性 (incompleteness) を知る不完全なシステム (imperfect system) は、それを知らない完全なシステムよりも堅牢 (robust) である。

**私たちが知らないこと。**

内部からは見えないアーキテクチャの失敗モード (failure modes) はあるか？

これはMVP前段階 (pre-MVP stage) の理論的アーキテクチャである。最小限のアーキテクチャ輪郭 (minimum architectural contour) は定義されている。[[glossary/MACI|MACI]]スマートコントラクト + [[glossary/ZK-SNARKs|ZK-SNARKs (ゼロ知識簡潔非対話型知識証明)]]アイデンティティ回路 + [[glossary/VWU|VWU]]計算コントラクトである。仕様はZenodoでタイムスタンプが押されている。実装はオープンなままだ。

私たちは、コミュニティ内部からの批判を求めて、ここにこれを公開している。どのような仮定が間違っているのか、そして特にエンジニア向けに：ビザンチン障害仮定 (Byzantine fault assumption) の下で[[glossary/MACI|MACI]]コーディネーターモデル (MACI coordinator model) において対称性不変条件 (symmetry invariant) は維持されるのか、それともコーディネーター層 (coordinator layer) で述語 (predicate) が破綻するのか？ [エクスプロイトが自己破壊するインフラストラクチャの設計](https://ethresear.ch/t/designing-infrastructure-where-exploits-destroy-themselves/25348)

*全プレプリントシリーズ (Full preprint series)*: Zenodo (ORCID: 0009-0004-4841-594X)

*主要参考文献 (Core references)*: The Notary Under Attack: An Adversarial Model for Cryptographic Collective Intelligence. [https://doi.org/10.5281/zenodo.21111544](https://doi.org/10.5281/zenodo.21111544)

*リポジトリ (Repository)*: [https://github.com/Dede-Qorqud/BeTrueCore](https://github.com/Dede-Qorqud/BeTrueCore)

*1投稿 - 1参加者*

[全トピックを読む](https://ethresear.ch/t/sovereign-space-when-values-need-architecture/25485)
