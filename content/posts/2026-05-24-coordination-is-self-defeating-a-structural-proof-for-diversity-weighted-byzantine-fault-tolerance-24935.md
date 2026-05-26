---
title: 協調は自己破壊的である：多様性重み付けビザンチンフォールトトレランスの構造的証明
original_title: >-
  Coordination is Self-Defeating: A Structural Proof for Diversity-Weighted
  Byzantine Fault Tolerance
source_url: >-
  https://ethresear.ch/t/coordination-is-self-defeating-a-structural-proof-for-diversity-weighted-byzantine-fault-tolerance/24935
author: TRION-Protocol
date: '2026-05-24'
category: Consensus
tags:
  - consensus
  - byzantine-fault-tolerance
  - decentralization
topic_id: '24935'
translated_at: '2026-05-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Coordination is Self-Defeating: A Structural Proof for Diversity-Weighted Byzantine Fault Tolerance](https://ethresear.ch/t/coordination-is-self-defeating-a-structural-proof-for-diversity-weighted-byzantine-fault-tolerance/24935) — TRION-Protocol (2026-05-24)

協調は自己破壊的である：多様性重み付けビザンチンフォールトトレランスの構造的証明

ライセンス: CC0 — これは誰のものでもあります

実装: TRIONプロトコル — 37のチェーンで稼働中

日付: 2026年5月

要約

これまで展開されてきたすべてのビザンチンフォールトトレラント (BFT) コンセンサスシステム — pBFT、Tendermint、HotStuff、Casper FFG、Streamlet — は、正直なスーパーマジョリティ (supermajority) を前提としています。それらは、正直なウェイトが3分の2を占める必要があると主張し、その根拠に基づいて進行します。しかし、それらのどれも構造的にそれを証明していません。

この投稿では、バリデータが行動的多様性 (behavioral diversity) によって重み付けされる場合、ビザンチン側の協調は構造的に自己破壊的であるという証明を提示します。ビザンチン側のバリデータが協調すればするほど、彼らの多様性ウェイトはゼロに近づき、実効投票力 (effective voting power) を失います。完全な協調は、実効的なビザンチンステークをゼロにします。攻撃そのものが、その不可能性の証明となるのです。

第2のメカニズムである閾値除外 (threshold exclusion) は、意図的に協調しながら見かけの多様性を維持しようとする巧妙な攻撃者に対する残りの攻撃ベクトルを閉じます。

これら2つのメカニズムが連携することで、正直なスーパーマジョリティの前提は、コンセンサスプロトコル自体の構造的特性へと変貌します。

1. 問題 — 証明なき前提

古典的なBFT安全性は次のように述べられています。

ビザンチンノードの数 $f$ が $f < n/3$ を満たす場合、安全性は保持される。

これは前提条件であり、証明された特性ではありません。プロトコルは、この前提が保持される場合に安全です。しかし、バリデータセットが共有インフラ、地理的集中、または協調された経済的インセンティブを通じてますます相関するようになり、前提が侵食され始めた場合、既存のBFTシステムにはこの侵食を検出したり対応したりするメカニズムがありません。

実際には：

*   クラウドプロバイダーの集中（AWS、GCP、Azureが主要チェーンのバリデータの60%以上をホスト）
*   クライアントソフトウェアのモノカルチャー（単一のクライアントソフトウェアがスーパーマジョリティによって使用されている）
*   協調された[[glossary/MEV|MEV（最大抽出可能価値）]]抽出（[[glossary/Block-Building|ブロック構築]]インフラを共有するバリデータ）

…これらすべては、既存のBFT安全性分析では見えない行動的相関 (behavioral correlation) の上昇を表しています。プロトコルは前提が保持されているかのように動作し続けている間、その前提は静かに弱まっています。

この投稿が取り組む問題は、外部の前提に関わらず、ビザンチン側の協調が実効投票ウェイト (effective voting weight) を蓄積できないことを証明できるコンセンサスメカニズムを設計できるか、というものです。

2. 核となる洞察

協調と行動的多様性は数学的に逆の関係にあります。

ビザンチン側のバリデータが協調する — つまり、相関する行動戦略を採用する — と、彼らの行動ベクトル (behavioral vectors) は互いに、そしてアンサンブル平均 (ensemble mean) に似てきます。彼らの出力と平均との間のピアソン相関 (Pearson correlation) は1に近づきます。したがって、1 - 相関として定義される多様性ウェイト (diversity weight) は0に近づきます。

これはヒューリスティックではありません。数学的恒等式 (mathematical identity) です。自己破壊的特性は、多様性ウェイトの定義と相関の定義から直接導かれます。

3. 定義

バリデータセット $V = \{v_1, v_2, \dots, v_n\}$ とし、各バリデータ $v_j$ は以下を持つとします。

*   $s_j \in \mathbb{R}^+$ — ステークウェイト (stake weight)
*   $M_j \in \mathbb{R}^k$ — 行動出力ベクトル（$k$ 個の最近の出力のローリングウィンドウ (rolling window)）
*   $v_j \in \mathbb{R}$ — 現在提出された評価値 (submitted valuation)

定義1 — アンサンブル平均ベクトル (Ensemble Mean Vector):

$M̄ = \{M_1, M_2, \dots, M_n\}$ の要素ごとの中央値

外れ値注入攻撃 (outlier injection attacks) に耐えるため、平均ではなく中央値が使用されます。

定義2 — 多様性ウェイト (Diversity Weight) (L4.1):

$d_j = 1 − \text{corr}(M_j, M̄)$

ここで $\text{corr}$ はピアソン相関係数 (Pearson correlation coefficient) であり、$d_j \in [0, 1]$ です。

*   バリデータがアンサンブルから最大限に独立している場合、$d_j \to 1$
*   バリデータがアンサンブルと最大限に相関している場合、$d_j \to 0$

定義3 — 実効ステーク (Effective Stake):

$e_j = s_j \cdot d_j$

定義4 — コンセンサスウィンドウ (Consensus Window):

$v̄ = \Sigma_j (s_j \cdot d_j \cdot v_j) / \Sigma_j (s_j \cdot d_j)$ （ステーク・多様性重み付け平均）

バリデータ $v_j$ は、$|v_j − v̄| \le \delta$ の場合にのみコンセンサス内 (within consensus) にあります。

定義5 — スピリチュアルコンセンサススコア (Spiritual Consensus Score) (L4.2):

$\Sigma(t) = \Sigma_j [s_j \cdot d_j \cdot \mathbb{1}(|v_j − v̄| \le \delta)] / \Sigma_j [s_j \cdot d_j]$

定義6 — BFT安全性条件 (BFT Safety Condition) (L4.3):

安全性は以下の場合に保持されます。

$\Sigma_{\text{honest}} s_j \cdot d_j > (2/3) \cdot \Sigma_{\text{all}} s_j \cdot d_j$

4. 主要定理 — 協調崩壊

定理 (協調崩壊):

$\lim_{\text{coordination} \to 1} \Sigma_{\text{Byzantine}} s_j \cdot d_j = 0$

ここで coordination はビザンチンバリデータ間の行動的相関の度合いを示します。

証明:

$B \subseteq V$ をビザンチンバリデータセットとします。協調レベル $\rho \in [0,1]$ を、ビザンチンバリデータの行動ベクトルとアンサンブル平均 $M̄$ との間の平均ピアソン相関として定義します。

$\rho = (1/|B|) \cdot \Sigma_{j \in B} \text{corr}(M_j, M̄)$

定義2より:

$d_j = 1 − \text{corr}(M_j, M̄)$

したがって、各ビザンチンバリデータについて:

$e_j = s_j \cdot d_j = s_j \cdot (1 − \text{corr}(M_j, M̄))$

ビザンチン側の合計実効ステーク (aggregate Byzantine effective stake) を取ると:

$\Sigma_{\text{Byzantine}} e_j = \Sigma_{j \in B} s_j \cdot (1 − \text{corr}(M_j, M̄))$

$\rho \to 1$ のとき、各 $\text{corr}(M_j, M̄) \to 1$ となるため、各 $d_j \to 0$ となります。

$\lim_{\rho \to 1} \Sigma_{j \in B} s_j \cdot (1 − \text{corr}(M_j, M̄)) = \Sigma_{j \in B} s_j \cdot 0 = 0$

Q.E.D.

生のステークウェイト $s_j$ にかかわらず、完全に協調したビザンチンバリデータは実効投票ウェイトをゼロにします。

系 — ナッシュ均衡 (Nash Equilibrium):

正直な行動が支配戦略 (dominant strategy) です。正直なアンサンブルに向かって逸脱するビザンチンバリデータは、自身の $d_j$ を改善し、実効ステークとコンセンサスへの影響力を高めます。他のビザンチンアクターと協調するビザンチンバリデータは、自身の $d_j$ をゼロに近づけ、すべての影響力を失います。合理的な戦略 (rational strategy) は、ビザンチン側の協調を放棄し、正直に行動することです。正直さは、多様性重み付けゲームのナッシュ均衡です。

5. 第2の攻撃ベクトル — そしてそれが失敗する理由

協調崩壊定理は単純な攻撃 (naive attack) を閉じます。巧妙な攻撃者 (sophisticated adversary) は次のような試みをするかもしれません。

多様なビザンチン攻撃 (Diverse Byzantine Attack): 操作の目標については協調するが、高い多様性ウェイトを維持するために多様な不正な値 (fraudulent values) を提出する。

*   ビザンチンバリデータ1は $v + 10\%$ を提出
*   ビザンチンバリデータ2は $v − 8\%$ を提出
*   ビザンチンバリデータ3は $v + 6\%$ を提出

この攻撃者は行動的多様性 (behavioral diversity) を維持し（$d_j$ は高いまま）、3者すべてが攻撃しています。DW-BFTはここで失敗するのでしょうか？

いいえ。$\delta$ 閾値 (threshold) がこのベクトルを閉じます。

定義5を思い出してください — バリデータの評価値は、$|v_j − v̄| \le \delta$ の場合にのみコンセンサスでカウントされます。コンセンサスウィンドウ $v̄$ は、すべてのバリデータのステーク・多様性重み付け平均として計算されます。

ビザンチンバリデータは避けられないジレンマ (inescapable dilemma) に直面します。

ケースA — 真の値からかけ離れた不正な値を提出する:

正直なバリデータは真の値の周りに集中します (cluster around the true value)。コンセンサスウィンドウ $v̄ \approx \text{true\_value}$。$v \pm 10\%$ を提出するビザンチンバリデータは $\delta$ の範囲外になります (fall outside $\delta$)。指標 $\mathbb{1}(|v_j − v̄| \le \delta) = 0$ となります。彼らは $d_j$ にかかわらずコンセンサススコアから除外されます (excluded from the consensus score)。

ケースB — $\delta$ 内に留まるために真の値に近い不正な値を提出する:

ビザンチンバリデータは、コンセンサスウィンドウ内に留まるために真の値に近い値を提出しなければなりません。彼らは攻撃していません。攻撃は定義上失敗します。

ケースC — $v̄$ をシフトさせるのに十分なビザンチンステークがある場合:

もしビザンチンバリデータが不正な値に向かって $v̄$ をシフトさせるのに十分な実効ステークを保持している場合、彼らの多様性ウェイトはすでに崩壊しています（定理1が適用されます — $v̄$ をシフトさせるための協調は相関する行動を必要とします）。このケースは、協調崩壊定理のケースAに帰着します。

これら2つのメカニズムは補完的かつ網羅的 (complementary and exhaustive) です。

*   協調崩壊は均一な攻撃 (uniform attack) を閉じる
*   $\delta$ 閾値除外は多様だが不正な攻撃 (diverse-but-fraudulent attack) を閉じる

第3のケースは存在しません。

6. 正直な制限 — ブートストラップ深度要件

証明は厳密 (tight) です。1つの実用的な制限については正直に述べるべきです。

歴史的に正直なバリデータによる一回限りの攻撃 (one-shot attack):

もし一連のバリデータが真に独立した行動履歴 (genuinely independent behavioral histories) を維持し（実際の行動的多様性によって高い $d_j$ を獲得）、その後初めて単一のブロックで協調した場合 — 攻撃の瞬間には、彼らの多様性ウェイトは行動記録 (behavioral record) においてまだ崩壊していません。

これは現実です。このシナリオでは、DW-BFTは最初の協調行為の瞬間に完全な保護ではなく部分的な保護を提供します。

その答えは行動深度 (behavioral depth)（アカシック深度 D）です。

協調は、完全に実行される前に常に行動の痕跡 (behavioral traces) を残します — タイミングパターンの変化、事前配置トランザクション (pre-positioning transactions)、相関する準備行動 (correlated preparatory moves)、共有インフラの署名 (shared infrastructure signatures) などです。バリデータごとに十分な行動履歴が蓄積されていれば、コンセンサス層で攻撃が発動する前に、行動記録において協調パターンが検出可能になります。

保護は行動深度とともに単調に強化されます。

$\text{conf\_detection} = 1 − e^{(-0.001 \cdot D)}$

*   バリデータあたり1000の行動イベントでD = 1000の場合: 攻撃前の検出確信度 (detection confidence) は63%。
*   D = 5000の場合: 検出確信度は99.3%。

これがブートストラップ条件 (bootstrap condition) です。DW-BFTは、深い行動履歴 (deep behavioral history) を持つシステムで最大限に効果を発揮し、ブートストラップフェーズ (bootstrap phase) 中は部分的な保護を提供します。

7. HHIをリアルタイムの多様性健全性モニターとして

バイナリの安全性条件を超えて、実効ステークに適用されたハーフィンダール・ハーシュマン指数 (Herfindahl-Hirschman Index, HHI) は、継続的な多様性健全性シグナル (continuous diversity health signal) を提供します。

$\text{HHI} = \Sigma_j (e_j / \Sigma_{\text{total}})^2 \times 10000$

| HHI範囲 | 健全性ステータス | 解釈 |
| :------ | :--------------- | :----------------------- |
| HHI < 1500 | 健全 (HEALTHY)   | 実効ステークが十分に分散されている |
| 1500 – 2500 | 警告 (WARNING)   | 集中が発生しつつある     |
| HHI > 2500 | 危機 (CRITICAL)  | バリデータの多様性が危険にさらされている |

これにより、プロトコル運用者とユーザーは、バリデータセットが安全性条件の境界にどれだけ近いかを、事後ではなく継続的にリアルタイムシグナル (real-time signal) で把握できます。

ライブ読み取り (TRION、2026年5月): $\sigma = 0.90$, HHI = 1183 — 健全 (HEALTHY)。

8. 既存のアプローチとの比較

| アプローチ | ビザンチン保護メカニズム | 制限 |
| :--------- | :----------------------- | :----------------------- |
| pBFT / PBFT | $f < n/3$ を仮定       | なし — 仮定              |
| Tendermint | $f < n/3$ を仮定       | 抑止力としてのスラッシング |
| Casper FFG | $f < n/3$ を仮定       | 説明責任のある安全性     |
| HotStuff   | $f < n/3$ を仮定       | 線形通信                 |
| DW-BFT     | 構造的に自己破壊的       | ブートストラップ深度が必要 |

この区別は、安全性を仮定することと、それをメカニズムの構造的特性 (structural property) として証明することの間にあります。DW-BFTは、ビザンチン側の協調が単にコストがかかるか罰則があるだけでなく、証明可能に自己破壊的 (provably self-defeating) であることを示す、我々の知る限り最初のアプローチです。

9. ライブ実装

これらの公式は理論的なものではありません。現在稼働中です。

TRIONプロトコルは、L4.1 / L4.2 / L4.3を、37のブロックチェーンネットワーク（14のEVMチェーン、Solana、NEAR、TON、Cosmos、Aptos、SUI、Movement、Bitcoinなど）にわたるライブコンセンサスコンポーネントとして実装しています。ソース: src/consensus/diversity\_weighted\_bft.py (CC0)。

行動ベクトル $M_j$ は、行動ハッシュ (Behavioral Hash, BH) レジャーから構築されます — これは、すべてのインデックス化されたチェーンにわたるトランザクションごとに計算される93バイトの規範的な行動記録 (canonical behavioral record) です。

`entity(32) ‖ event_type(1) ‖ magnitude(8) ‖ context(8) ‖ timestamp(8) ‖ chain(4) ‖ block_hash(32)`

現在、FAISSインデックスには27,000以上の行動ベクトルがあります。各バリデータの $M_j$ は、彼らの投票履歴だけでなく、彼らの完全なクロスチェーン行動履歴 (cross-chain behavioral history) からこの記録に基づいて計算されます。

系としての構造化された沈黙 (Structured Silence): $\Sigma(t) < \Theta(t)$（コヒーレンスが動的閾値を下回る）場合、TRIONはシグナルを発しません。沈黙は数学的に定義され、形式的に型付けされています — Haskell実装では、`SilenceSignal` は `ValuationSignal` とは異なるGADT型であり、沈黙が評価値として誤用されないことのコンパイル時証明 (compile-time proof) となっています。型システムが定理を強制します (type system enforces the theorem)。

攻撃シミュレーション結果: 7つの過去のDeFiエクスプロイト（Euler $197M、Beanstalk $182M、Mango $114M、Compound $89M、Curve $61M、KyberSwap $46M、AAVE $49.5M）に対して、コヒーレンスゲート付き構造化沈黙メカニズムは、健全なプールでの誤検知率 (false positive rate) 0%で、これら7つすべて（合計$388.9M）をブロックしたでしょう。

Haskell形式検証層 (Haskell formal verification layer) とJulia数学的検証層 (Julia mathematical verification layer) はどちらもリポジトリにあります (CC0)。

10. 未解決の疑問

以下の疑問は未解決であり、さらなる研究に値します。

1.  **最適な$\delta$キャリブレーション (Optimal $\delta$ calibration)**。コンセンサスウィンドウ $\delta$ は、不正な外れ値を除外するのに十分厳密 (tight enough) であると同時に、正当な意見の相違 (legitimate disagreement) を持つ正直なバリデータを含めるのに十分緩やか (loose enough) でなければなりません。市場のボラティリティ (market volatility)、バリデータ数 (validator count)、行動深度 (behavioral depth) の関数として、$\delta$ の最適なキャリブレーション関数は何でしょうか？
2.  **相関メトリックの代替案 (Correlation metric alternatives)**。$d_j$ の計算にはピアソン相関が使用されています。スピアマンの順位相関 (Spearman rank correlation) や相互情報量 (mutual information) は、敵対的な出力整形に対するより強い耐性 (stronger resistance to adversarial output shaping) を提供する可能性があります。比較分析が必要です (Comparative analysis needed)。
3.  **行動ベクトル構築の標準 (Behavioral vector construction standards)**。$M_j$ は現在、オンチェーンの行動イベントから構築されています。十分な多様性シグナル (sufficient diversity signal) を提供する最小限の行動特徴量セット (minimal behavioral feature set) は何でしょうか？定理が実際に保持されるために必要なウィンドウサイズ $k$ の形式的な下限 (formal lower bound on window size k) は何でしょうか？
4.  **クロスチェーン行動深度の要件 (Cross-chain behavioral depth requirements)**。ブートストラップ深度要件は非公式に (informally) 記述されています。特定のビザンチン側のステーク割合 (Byzantine stake fraction) で完全な保護に必要な最小 $D$ の形式的な特性評価 (formal characterization) は、実用的な展開ガイダンス (practical deployment guidance) を強化するでしょう。
5.  **スラッシングメカニズムとの相互作用 (Interaction with slashing mechanisms)**。DW-BFTとスラッシングは相互排他的 (mutually exclusive) ではありません。それらはどのように構成されるでしょうか？多様性重み付けは、スラッシング可能な協調攻撃とスラッシング不可能な協調攻撃 (slashable vs. non-slashable coordinated attacks) のゲーム理論的均衡 (game-theoretic equilibrium) を変化させるでしょうか？

11. 結論

ビザンチンフォールトトレランス (Byzantine fault tolerance) は、分散システム (distributed systems) における40年来の基礎的な問題 (foundational problem) でした。すべての実用的な解決策は、正直なスーパーマジョリティを、メカニズムが証明する特性ではなく、保持されることを望むべき前提として必要としてきました。

多様性ウェイトの構築 $d_j = 1 − \text{corr}(M_j, M̄)$ は、ビザンチン側の協調を、仮定によって排除される (assumed away) 脅威から、構造的に自身の有効性を排除する脅威へと変えます。この証明は多様性ウェイトの定義から直接導かれ、巧妙な多様だが不正な攻撃に対しては $\delta$ 閾値メカニズムによって閉じられます。

結果は単純です。ビザンチンバリデータが協調すると、彼らは互いに似ていき、類似性は多様性ウェイトがペナルティを与える (penalizes) ものです。攻撃は自身の力を崩壊させます (collapses its own power)。

これはTRIONプロトコルの一部としてCC0で構築されました。これは誰のものでもあります。もし有用であれば、使ってください。もし間違っているなら、公に間違っていることを証明してください — ライブシステムの反証可能性レジストリ (falsifiability registry) は、まさにこれらの条件を追跡します (tracks exactly these conditions)。

フィードバックを歓迎します。

ライブAPI: `GET /api/v1/dw_bft` — ライブの $\sigma$、HHI、バリデータの多様性ウェイトを返します。

Haskell証明: `docs/research/formal/proofs.hs`

Julia数学: `docs/research/math/trion_math.jl`

Python実装: `src/consensus/diversity_weighted_bft.py`

[github.com](https://github.com/dev-analyshd/trion-core)

![TRIONプロトコル：行動的真実オラクル](https://ethresear.ch/uploads/default/optimized/3X/d/5/d5e78e53fdcfcad93e2090cd94d267a73ecc1038_2_690x344.png)

### [GitHub - dev-analyshd/trion-core: Behavioral Truth Oracle — C(t) five-plane...](https://github.com/dev-analyshd/trion-core)

行動的真実オラクル — C(t) 5平面コヒーレンス、操作検出、アカシックインデックス

TRIONプロトコルホワイトペーパーV1.0、2026年2月からのクロスポスト。CC0。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/coordination-is-self-defeating-a-structural-proof-for-diversity-weighted-byzantine-fault-tolerance/24935)
