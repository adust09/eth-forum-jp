---
title: 協調崩壊と沈黙の最適性：標準的なBFTおよびオラクル設計を破る2つの結果
original_title: >-
  Coordination Collapse and the Optimality of Silence: Two Result That Break
  Standard BFT and Oracle Design
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/coordination-collapse-and-the-optimality-of-silence-two-result-that-break-standard-bft-and-oracle-design/25674
author: TRION-Protocol
date: '2026-08-10'
category: Consensus
tags:
  - consensus
  - proof-of-stake
  - validators
  - economics
  - oracle
  - security
  - coordination-collapse
  - optimality-of-silence
topic_id: '25674'
translated_at: '2026-08-10'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Coordination Collapse and the Optimality of Silence: Two Result That Break Standard BFT and Oracle Design](https://ethresear.ch/t/coordination-collapse-and-the-optimality-of-silence-two-result-that-break-standard-bft-and-oracle-design/25674) — TRION-Protocol (2026-08-10)

# 協調崩壊と沈黙の最適性：標準的なBFTおよびオラクル設計を破る2つの結果

**著者:** Hudu Yusuf (Analys)
**日付:** 2026年8月
**ライセンス:** CC0 — この著作はパブリックドメインに属します。
**対象読者:** コンセンサス研究者、[[oracle|オラクル]]設計者、応用暗号学者。

* * *

## 要約

ビザンチンフォールトトレラント (BFT) コンセンサスと[[oracle|オラクル]]設計の両方における標準的な慣行と矛盾する2つの結果を証明します。

1.  **定理1（[[Coordination-Collapse|協調崩壊]]）:** [[Ethereum-validator|バリデータ]]の行動が観測可能な、重み付けされた任意の[[BFT system|BFTシステム]]において、相関する[[Ethereum-validator|バリデータ]]のセットの*実効*投票ウェイトは、それらのペアワイズ相関が1に近づくにつれて、名目[[stake|ステーク]]に関わらず**ゼロ**に収束します。イーサリアムの現在の[[Ethereum-validator|バリデータ]]セット（3つのエンティティによって約60%が制御されている）に適用すると、設計上正直なセキュリティマージンは33%ではなく、実効的には**一桁台**であることを示唆します。

2.  **定理2（[[Optimality-of-Silence|構造化された沈黙の最適性]]）:** 入力シグナルを一時的に操作できる敵対者に直面するあらゆる[[oracle|オラクル]]にとって、定義可能な不確実性の下で公開を差し控える戦略は、常に公開する戦略よりも**厳密に優位**です。デプロイされているすべての[[oracle|オラクル]]（Chainlink、Pyth、UMA、Band、API3、RedStone）は常時公開戦略を使用しており、したがって設計上最適ではありません。

両方の結果は建設的です。明示的な公式、攻撃シミュレーション、および未解決の問題を提示します。また、我々が誤っていると予想される点も正確に述べます。

* * *

## 1. 背景と動機

イーサリアムは、[[Casper FFG|Casper FFG]] + LMD-GHOSTが33%の敵対者に対して安全であるという仮定のもと、1日あたり約150億ドルの経済的価値を決済しています。この境界は、ビザンチンフォールトが無相関である、つまり各[[Ethereum-validator|バリデータ]]が独立して失敗すると仮定しています。

同様に、デプロイされているすべての[[oracle|オラクル]]は、「たとえ悪い数値であっても、数値がないよりはましである」という暗黙の仮定に基づいて動作しています。[[DeFi protocols|DeFiプロトコル]]は、古い、または操作されたフィードを、欠落したフィードよりも優れていると見なしています。

どちらの仮定も誤りです。その理由を説明します。

* * *

## 2. 結果1: 重み付けされたBFTにおける[[Coordination-Collapse|協調崩壊]]

### 2.1 セットアップ

n個の[[Ethereum-validator|バリデータ]]を持つ[[BFT system|BFTシステム]]を考えます。各[[Ethereum-validator|バリデータ]] j は以下を持ちます。

-   名目[[stake|ステーク]] s_j、ただし $\sum s_j = 1$
-   最近の行動（投票パターン、[[MEV|MEV]]行動、[[block-timing|ブロックタイミング]]、[[proposer-boost|プロポーザーブースト]]の使用、[[off-chain-communication-signals|オフチェーン通信シグナル]]）を要約した行動ベクトル M_j $\in \mathbf{R}^k$
-   コンセンサスで使用される実効ウェイト w_j

標準的な[[BFT system|BFTシステム]]（イーサリアムを含む）: $w_j = s_j$。多様性は議論されますが、*実際の*重み付け関数には決して入りません。

**定義1（[[Diversity-Weight|多様性重み]]）。** 各[[Ethereum-validator|バリデータ]] j について、以下を定義します。

$$d_j = 1 - \mathrm{corr}(M_j, \overline{M})$$

ここで $\overline{M} = (1/n) \sum M_i$ は[[Ethereum-validator|バリデータ]]セットの平均行動ベクトルであり、$\mathrm{corr}$ は[[Pearson-correlation|ピアソン相関係数]]です。

**定義2（[[Diversity-Weighted-Byzantine-Fault-Tolerance|DW-BFT]]ウェイト）。** 実効投票ウェイトは以下です。

$$w_j = \frac{s_j \cdot d_j}{\sum_i s_i \cdot d_i}$$

### 2.2 定理と証明の概要

**定理1（[[Coordination-Collapse|協調崩壊]]）。** S $\subseteq \{1..n\}$ を、同一の行動ベクトルを持つ[[Ethereum-validator|バリデータ]]のカルテル（すべての $j \in S$ について $M_j = M_{\text{cartel}}$）とします。このとき：

$$\lim_{|\mathrm{corr}(M_j, \overline{M})| \to 1} w_j = 0 \quad \text{for all } j \in S$$

*証明の概要。* S内のすべての $M_j$ が同一である場合、$M_j - \overline{M}$ はカルテルメンバーすべてにとって同じベクトルになります。各メンバーと平均との相関は1に近づくため、各 $d_j \to 0$ となります。カルテルの合計名目[[stake|ステーク]] $\sum_{j \in S} s_j$ は大きいかもしれませんが、その*実効*ウェイト $\sum w_j \to 0$ となります。システムはカルテルを、制御する[[stake|ステーク]]の量に関わらず、**1つの投票を持つ1つの[[Ethereum-validator|バリデータ]]**として扱います。∎

### 2.3 イーサリアムの現在の[[Ethereum-validator|バリデータ]]セットでのシミュレーション

預託シェア上位50のイーサリアム[[Ethereum-validator|バリデータ]]エンティティ（2026年5月～7月、420万エポック）の行動ベクトルを抽出しました。特徴量には、アテステーションタイミングの偏差、[[MEV-Boost|MEV-Boost]]リレー選択エントロピー、[[Block-Building|ブロックビルダー]]相関、リorg参加、エポック欠落パターンが含まれます。

| エンティティ | 名目シェア | d_j | 実効シェア |
| --- | --- | --- | --- |
| Lido | 28.4% | 0.21 | 8.7% |
| Coinbase | 15.1% | 0.18 | 4.0% |
| Binance | 13.7% | 0.15 | 3.0% |
| Kraken | 5.8% | 0.42 | 3.6% |
| 分散型ソロ[[Ethereum-validator|バリデータ]] | 22.3% | 0.91 | 60.2% |
| 上位3社合計 | 57.2% | — | 15.7% |

**示唆:** 標準的な[[BFT system|BFTシステム]]の重み付けでは、上位3つのエンティティが合計で33%のフォールトバウンドを超え、無効なブロックをファイナライズできます。[[Diversity-Weighted-Byzantine-Fault-Tolerance|DW-BFT]]の下では、それらの合計実効ウェイトは**15.7%**であり、フォールトバウンドを下回ります。名目[[stake|ステーク]]がわずか22.3%のソロ[[Ethereum-validator|バリデータ]]セットは、メンバーが独立して行動するため、実効投票権の**60.2%**を制御します。

様々な相関レベルで50個の[[sybil-validators|シビルバリデータ]]を用いた10,000回の攻撃シミュレーションを実行しました。

| カルテル内部相関 | 標準[[BFT system|BFTシステム]]成功率 | [[Diversity-Weighted-Byzantine-Fault-Tolerance|DW-BFT]]成功率 |
| --- | --- | --- |
| 0.00 (独立) | 0.0% | 0.0% |
| 0.50 | 12.4% | 0.8% |
| 0.75 | 41.7% | 3.1% |
| 0.90 | 75.8% | 2.4% |
| 0.98 | 99.2% | 0.3% |
| 1.00 (完全なカルテル) | 100% | 0.0% |

完全な相関の場合、カルテルの権限は完全に消滅します。これはパラメータ調整の結果ではなく、構造的なものです。カルテルは*定義上*同一の行動を生み出し、同一の行動は[[Diversity-Weight|多様性重み]]がゼロになることを意味します。

### 2.4 なぜこれが議論を呼ぶのか

標準的な[[BFT system|BFTシステム]]理論は、[[Ethereum-validator|バリデータ]]を*異なるアイデンティティを持つエージェント*として扱います。[[Diversity-Weighted-Byzantine-Fault-Tolerance|DW-BFT]]は、それらを*情報源*として扱います。2つの[[Ethereum-validator|バリデータ]]が常に同じように投票し、常に同じように[[Block-Building|ブロック構築]]する場合、それらは**2つではなく1つの情報源**です。それぞれに完全な[[stake|ステーク]]を与えることは、同じ情報を二重にカウントすることになります。

33%の境界は独立したフォールトを仮定しています。フォールトが相関している場合（デプロイされているすべてのプルーフ・オブ・ステーク (PoS) システムでそうであるように）、実際の正直な多数派の仮定は、名目[[stake|ステーク]]が67%に達するずっと前に破られます。

**未解決の議論:** [[Diversity-Weighted-Byzantine-Fault-Tolerance|DW-BFT]]は新たな攻撃経路を導入するでしょうか？具体的には、敵対者がウェイトを得るために意図的にデコレーションし、攻撃の瞬間に再相関することは可能でしょうか？[[exponential-moving-average|指数移動平均]]を $d_j$ に適用することでこれを制限できるという予備的な結果がありますが、確信はありません。

* * *

## 3. 結果2: [[Optimality-of-Silence|構造化された沈黙の最適性]]

### 3.1 セットアップ

各ステップ t で値 $v_t$ を報告する[[oracle|オラクル]]を考えます。真の値は $V_t$ です。敵対者はコスト c を費やして、観測されたシグナルを1ステップあたり最大 $\Delta$ まで摂動させることができます。[[oracle|オラクル]]は、$v_t \neq V_t$ を公開すると損失 $L(v_t, V_t)$ を被り、差し控えると損失 K を被ります（消費者は待つ必要があります）。

標準的な[[oracle|オラクル]]は、**常に公開する**という制約の下で $\mathbf{E}[L]$ を最小化します。それらは何も公開しないという選択肢を考慮しません。

**定義3（コヒーレンス）。** $C_t \in [0,1]$ を、現在の観測が資産の蓄積された行動履歴（クロス取引所のフローの一貫性、ウォレットアーキテクチャの安定性、[[MEV|MEV]]パターン、時間エントロピーなど）とどれだけ一致するかを測定するスカラーとします。$\Theta_t \in [0,1]$ を閾値とします。

**定義4（サイレント[[oracle|オラクル]]戦略）。**

-   $C_t \ge \Theta_t$ の場合: 履歴に基づいて期待損失を最小化する値を公開する
-   $C_t < \Theta_t$ の場合: **何も公開しない**（構造化された沈黙）

差し控える場合でも、[[oracle|オラクル]]はメタデータを公開します。*どのプレーンが失敗したか*、ギャップサイズ $\Theta_t - C_t$、過去kステップにおける $C_t$ のトレンド、およびコヒーレンス回復までの推定時間 (ETA) です。

### 3.2 定理

**定理2（[[Optimality-of-Silence|沈黙の最適性]]）。** $L(\text{誤り}, \Delta) > K$（誤った公開は遅延よりも悪い）である任意の損失関数 L と、有限の攻撃予算を持つ任意の敵対者に対して、サイレント[[oracle|オラクル]]戦略が任意の常時公開戦略よりも**厳密に低い期待損失**を達成する閾値 $\Theta^*$ が存在します。

常時公開戦略は、成功したすべての攻撃で損失 L を被ります。サイレント[[oracle|オラクル]]は、C_t < $\Theta_t$ を介して攻撃を検出するたびに、それらの L の損失をより小さな K の損失に変換します。仮定により L > K であるため、検出された各攻撃は損失を L - K だけ削減します。敵対者の予算制約は総攻撃回数を制限するため、サイレント[[oracle|オラクル]]の損失は常時公開[[oracle|オラクル]]の損失によって上限が定められ、少なくとも1つの攻撃が検出された場合は厳密に少なくなります。∎

**系。** 閾値が適応的である場合（$\Theta_t = 0.55 + 0.37 \cdot \sigma_t$、つまり変動性の高い資産にはより高いコヒーレンスが必要）、非ゼロの攻撃予算すべてに対して優位性は厳密です。

### 3.3 記録された30件の[[DeFi protocols|DeFi]]エクスプロイトに対するバックテスト

2020年以降の主要な[[oracle|オラクル]]操作エクスプロイトすべて（30件、総損失額**33.15億ドル**）に対して両戦略を実行しました。

| 指標 | 常時公開（Chainlink/Pyth型） | サイレント[[oracle|オラクル]]（$\Theta^* = 0.62$） |
| --- | --- | --- |
| 防止されたエクスプロイト | 0 / 30 | 30 / 30 |
| 偽陽性（正当なボラティリティ→沈黙） | 0 | 2,147 |
| [[FPR|偽陽性率 (FPR)]] | 0% | 高ボラティリティイベントの100% |
| 平均沈黙期間 | — | 2.4ブロック |
| 保護された総価値 | 0ドル | 33.15億ドル |
| 消費者厚生損失（遅延） | 0ドル | 清算摩擦で約1100万ドル |

常時公開[[oracle|オラクル]]は*完璧に調整されている*が、操作に対しては*完全に無用*です。攻撃者の価格を忠実に報告します。サイレント[[oracle|オラクル]]はすべての攻撃を捕捉しますが、すべての大きな正当なウィックでもトリガーされます。

**困難なトレードオフ:** [[FPR|偽陽性率 (FPR)]]が100%の場合、[[recall|リコール（再現率）]]も100%です。これが現在の実装における最先端の状態です。[[recall|リコール（再現率）]]を95%未満に落とさずに[[FPR|偽陽性率 (FPR)]]を約18%未満にする方法は**知りません**。これが中心的な未解決問題です。

### 3.4 なぜこれが議論を呼ぶのか

すべての[[oracle|オラクル]]チームはこう言うでしょう。「プロトコルはフィードの欠落を処理できません。清算が機能しなくなります。ポジションを閉じることができません。システムは常に何らかの数値を持つ必要があります。」

これは短期的には真実ですが、長期的には壊滅的に誤っています。「常に何らかの数値を持つ必要がある」という理由で、操作された価格で3億ドルのユーザーポジションを清算するプロトコルは**堅牢ではありません**。設計上脆弱なのです。曖昧な状況で2.4ブロック停止するプロトコルは、スループットの0.3%を失いますが、ユーザー資金の100%を保護します。

[[oracle|オラクル]]業界全体が「いかなる犠牲を払っても可用性」を最適化してきました。定理2は、敵対者が存在する場合にはこれが誤った目標であることを証明しています。

**未解決の議論:** L(誤り, $\Delta$) > K がほとんどの[[DeFi protocols|DeFiプロトコル]]で実際に真であるか？レンディング市場と無期限契約市場ではイエスですが、スポットAMMではノーだと考えられます。閾値はユースケースによって異なる可能性があり、その境界はまだ特徴づけられていません。

* * *

## 4. 特にイーサリアムへの影響

これらの結果が成り立つ場合、3つの差し迫った変更が交渉の余地のないものとなります。

1.  **コンセンサス:** [[Casper FFG|Casper FFG]]はファイナリティ投票を $s_j$ だけでなく $d_j$ で重み付けすべきです。常に同一に投票する50万ETHのカルテルは、ソロ[[Ethereum-validator|バリデータ]]の50万倍の権限を持つべきではありません。約1倍であるべきです。

2.  **[[MEV-Boost|MEV-Boost]]:** [[builder-centralization-problem|ビルダー集中化問題]]（約7つの[[Block-Building|ビルダー]]がブロックの90%を制御）は、[[Diversity-Weighted-Byzantine-Fault-Tolerance|DW-BFT]]の下で自然に解決します。相関する[[Block-Building|ビルダー]]は自動的にプロポーザーへの影響力を失います。[[PBS|PBS（プロポーザー・ビルダー分離）]]の再設計は不要です。

3.  **[[oracle|オラクル]]ロードマップ:** あらゆる[[in-protocol-oracle-design|プロトコル内オラクル設計]]は、「利用可能な値がない」ことをファーストクラスの出力タイプとして扱うべきです。これと統合するプロトコルは、沈黙を処理する必要があります。これは既存のすべてのコンシューマーにとって破壊的な変更ですが、さらに30億ドルを失わないための唯一の道です。

* * *

## 5. 我々が誤っていると予想される点

コミュニティが間違いを見つけられるように、これらの結果を正確に公開しています。以下は我々自身のリストです。

1.  **[[Diversity-Weighted-Byzantine-Fault-Tolerance|DW-BFT]][[sybil-decorrelation-attack|シビルデコレーション攻撃]]:** 敵対者が1000のエンティティに分裂し、それぞれがわずかに異なる行動を取り、その後一度だけ協調する。28日間ウィンドウで計算された $d_j$ がこれを制限すると考えていますが、証明はありません。
2.  **[[Diversity-Weighted-Byzantine-Fault-Tolerance|DW-BFT]]は正直な相関を罰する:** すべての[[Ethereum-validator|バリデータ]]が*正しく*同じチェーンに投票する場合、相関は1に近づき、正直な[[Ethereum-validator|バリデータ]]はウェイトを失います。これは最も深刻な異議です。現在、正直な共通成分を除去した後の残差で相関を計算するベースライン減算ステップでこれを解決していますが、これは[[heuristic|ヒューリスティック]]です。
3.  **沈黙検出における[[FPR|偽陽性率 (FPR)]]:** [[FPR|偽陽性率 (FPR)]]が100%では[[production|本番環境]]対応ではありません。6番目の[[coherence-plane|コヒーレンスプレーン]]がこれを約4%に引き下げると推測していますが、これは推測です。
4.  **$C_t$ 自体が操作可能:** 敵対者がコヒーレンス公式を知っている場合、価格ではなくコヒーレンスを攻撃できます。これは直接的な[[price-attack|価格攻撃]]よりも40〜60倍の資本を必要とすることを示す予備的な結果がありますが、厳密な上限はありません。
5.  **行動ベクトル $M_j$ は*何らか*によって計算されなければならない:** その「何らか」が新たな信頼できるコンポーネントとなります。我々は[[block-data|ブロックデータ]]から完全にオンチェーンで計算していますが、[[feature-selection-step|特徴量選択ステップ]]は現在中央集権的です。

* * *

## 6. 結論

分散システムにおける2つの標準的な仮定、すなわち[[stake|ステーク]]が投票情報に等しいこと、および公開が常に遅延よりも好ましいことは、行動が観測可能で敵対者が戦略的である場合には破綻します。

これらの結果がコミュニティの精査に耐えるならば、その影響はイーサリアムをはるかに超えます。過去14年間に構築されたすべての[[PoS chain|PoSチェーン]]、すべての[[oracle|オラクル]]ネットワーク、およびすべての[[reputation-system|レピュテーションシステム]]は、[[production|本番環境]]で数学的に破られている仮定に基づいています。

我々は、反論、代替シミュレーション、そして特に我々の定理が成り立たない構成を歓迎します。それが進歩の起こり方です。

* * *

## 参考文献

\[1\] Buterin, V. et al. “Combining GHOST and Casper.” arXiv:2003.03052, 2020.
\[2\] Nakamoto, S. “Bitcoin: A Peer-to-Peer Electronic Cash System.” 2008.
\[3\] Castro, M., Liskov, B. “Practical Byzantine Fault Tolerance.” OSDI 1999.
\[4\] Breidenbach, L. et al. “Chainlink 2.0: Next Steps in the Evolution of Decentralized Oracle Networks.” 2021.
\[5\] Dahlberg, A. et al. “The Pyth Network Whitepaper.” 2023.
\[6\] Angeris, G. et al. “When is the Price Right?” arXiv:2306.09688, 2023.
\[7\] Kalodner, H. et al. “An Empirical Study of DeFi Manipulation.” IMC 2022.

* * *

**コードと生データ:** すべてのシミュレーションコード、[[Ethereum-validator|バリデータ]]特徴量抽出、および30件のエクスプロイトに対するバックテストデータセットは、以下で入手可能です。

`[GitHub - dev-analyshd/trion-core: Behavioral Truth Oracle — C(t) five-plane coherence, manipulation detection, Akashic Index · GitHub](http://github.com/dev-analyshd/trion-core)`

*注: この公開リポジトリは実験とテスト用です。デプロイされたリポジトリはプライベートですが、両方とも同じ公式、アーキテクチャ、機能性を共有しています。公開リポジトリは構造的には整理されていませんが、機能的には同一です。*

我々の結果を再現し、どこで間違ったか教えてください。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/coordination-collapse-and-the-optimality-of-silence-two-result-that-break-standard-bft-and-oracle-design/25674)
