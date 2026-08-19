---
title: PQ-DAS / leanDA の形式検証されたセキュリティ
original_title: Formally Verified Security for PQ-DAS / leanDA
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/formally-verified-security-for-pq-das-leanda/25746'
author: b-wagn
date: '2026-08-18'
category: Cryptography
tags:
  - cryptography
  - zk
  - data-availability
  - scaling
  - research
  - formal-verification
  - post-quantum
  - lean
topic_id: '25746'
translated_at: '2026-08-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Formally Verified Security for PQ-DAS / leanDA](https://ethresear.ch/t/formally-verified-security-for-pq-das-leanda/25746) — b-wagn (2026-08-18)

# [[glossary/PQ-DAS|量子耐性データ可用性サンプリング (PQ-DAS)]] の形式検証されたセキュリティ

*フィードバックと議論を提供してくれたAlex Hicksに感謝します。*

*この投稿と詳細なセキュリティ証明の概要は人間の著者によって書かれ、Leanへの翻訳はAIの多大な助けを借りて行われました。*

*免責事項。ここにあるLeanコードは、抽象的な構成要素に関する仮定の下で、抽象的なスキームに関するステートメントを証明するものです。特に、いかなる本番実装のセキュリティも証明するものではなく、将来の実装の適切な監査に取って代わるものではありません。*

## 動機と目標

[以前の投稿](https://ethresear.ch/t/leanda-design-and-benchmark/25642)で、リード・ソロモン符号 (Reed–Solomon codes)、ハッシュベースコミットメント、および[[glossary/leanVM|leanVM]]証明システムから構築された[[glossary/Post-Quantum|ポスト量子 (PQ)]] [[glossary/Data-Availability|データアベイラビリティ (DA)]]サンプリング (DAS) スキームについて説明し、ベンチマークを行いました。この投稿では、その設計の暗号学的コアに対する*機械検証済み (machine-checked)* セキュリティ証明について報告します。私たちは、[Lean](https://lean-lang.org/)で[mathlib](https://github.com/leanprover-community/mathlib4)と[VCVio](https://github.com/Verified-zkEVM/VCVio)を使用してスキームを形式化し、そのセキュリティを証明しました。これは[Foundations of DAS論文](https://eprint.iacr.org/2023/1079)のセキュリティ概念に従っています。

このスキームは、Foundations論文のセクション7のエンコード・アンド・プルーブ構成 (encode-and-prove construction) に従っており、すでに手書きのセキュリティ証明が付属しています。しかし、私たちが関心を持つスキームは、1つの非自明な最適化を行っています。すなわち、[[glossary/ZK-SNARKs|ZK-SNARKs (ゼロ知識簡潔非対話型知識証明)]]内で厳密なリード・ソロモンメンバーシップを証明する代わりに、コミットメントからフィアット・シャミア (Fiat–Shamir) を介して導出されたランダム性（[[glossary/ZK-SNARKs|ZK-SNARKs]]の外部）を用いて、安価な*確率的*メンバーシップチェックのみを証明します。この形式化の主な貢献は、この最適化されたバリアントに対する完全なセキュリティ証明です。この証明は、ランダムオラクル (random oracles)、[[glossary/ZK-SNARKs|ZK-SNARKs]]、およびリワインディング (rewinding) の相互作用により、やや非自明です。

## TL;DR 証明内容

おおよそ、以下のことを証明します。

-   *仮定。* 消失訂正符号 (erasure code)、セキュアなベクトルコミットメント (vector commitment)、ランダムオラクル、および以下に指定された関係に対する非対話型知識証明 (non-interactive argument of knowledge) が存在します。
-   *結論。* 明示的なセキュリティ削減 (security reductions) を伴う、セキュアな消失訂正符号コミットメント (erasure code commitments) スキーム、すなわち*位置拘束性 (position-binding)* および*コード拘束性 (code-binding)* を満たすスキームが得られます。
-   *解釈。* セキュアな消失訂正符号コミットメントは、Foundations論文で示されているように、結果として得られる[[glossary/Data-Availability|データアベイラビリティ (DA)]]サンプリング (DAS) スキームがセキュアであることを意味します（この最終的なコンパイルステップは形式化されていません）。
-   [*コードへのリンク。* こちら。](https://github.com/b-wagn/fv-pq-da)

開発におけるすべての削減は明示的なアルゴリズムとして記述されており、人間が検査によってそれが効率的であることを検証できます。主な定理とその場所は以下の通りです。

| 結果 | Lean定理 |
| --- | --- |
| 完全性 | scheme_perfectlyComplete in Target/Scheme.lean |
| 位置拘束性 | scheme_positionBinding in Proof/PositionBinding.lean |
| コード拘束性 (モジュラー形式) | scheme_codeBinding in Proof/CodeBinding.lean |
| コード拘束性 (明示的な境界) | scheme_codeBinding_concrete in Proof/CorollaryCodeBinding.lean |

## スキームの抽象化

*なぜ抽象化するのか。* Foundations論文のセクション7に従い、例えばマークルツリー (Merkle trees) をベクトルコミットメントとして抽象化するなど、スキームの抽象化を形式化します。そして、これらの抽象的な構成要素に関する仮定、例えばベクトルコミットメントの位置拘束性の下でセキュリティを証明します。その理由は、(a) これがスキームの異なるバリアントをカバーすること、および (b) 議論を形式化しやすくすることです。

*論文のスキームとの違い。* Foundations論文のセクション7では、引数システムによって証明される関係は、コード内の厳密なメンバーシップをチェックします。ここでは、フィアット・シャミアを介して導出された双対コードのランダムベクトルとの内積のみをチェックします。これにより、セキュリティ証明は非自明になり、特にベクトルコミットメントスキームの抽出可能性 (extractability) に依存できないためです。後述するように、ベクトルが[[glossary/ZK-SNARKs|ZK-SNARKs]]の外部で導出されるため、依然としてセキュリティを証明できます。

### 構成要素

このスキームは、以下の抽象的な構成要素を使用します（それぞれ `Assumptions/` で形式化されています）。

-   **消失訂正符号** $\mathcal{C} \subseteq \Gamma^n$ は、エンコード関数 $\Sigma^k \to \Gamma^n$ によって与えられます。私たちの結果には、コードのそれ以上の特性は必要ありません。再構築型の特性は、消失訂正符号コミットメントから[[glossary/Data-Availability|データアベイラビリティ (DA)]]サンプリング (DAS) への（形式化されていない）ステップでのみ関与します。
-   **ベクトルコミットメント** $\mathsf{VC} = (\mathsf{Setup}, \mathsf{Com}, \mathsf{Ver})$ は、*位置拘束性 (position-binding)*（Foundations論文の定義16）を満たします。私たちは、$\mathsf{Com}$ とオープニングアルゴリズムが決定論的で完全に完全であると仮定します。これは、主要な関心のあるインスタンス、すなわちマークルツリー (Merkle trees) に当てはまります。
-   $\mathcal{C}$ のための**コードチェッカー** (code checker) $(\mathcal{L}, \mathsf{Check})$。これは新しいプリミティブです。
    -   $\mathcal{L}$ は効率的にサンプリングできる有限ドメインです。
    -   $\mathsf{Check}(L, c) \to 0/1$ は、ドメイン要素 $L \in \mathcal{L}$ と主張されるコードワード $c$ を受け取り、決定論的にビットを出力します。
    -   *完全性 (Completeness):* $c \in \mathcal{C}$ ならば、すべての $L$ に対して $\mathsf{Check}(L, c) = 1$ です。
    -   *$\delta$-健全性 (Soundness):* **固定された** $c \notin \mathcal{C}$ の場合、一様ランダムな $L \in \mathcal{L}$ に対して $\mathsf{Check}(L, c) = 1$ となる確率は最大で $\delta$ です。
    
    直感的には、これは[以前の投稿](https://ethrese.ch/t/leanda-design-and-benchmark/25642)の*内積によるリード・ソロモンメンバーシップチェック*をモデル化しています。健全性における量化子の順序に注意してください。非コードワードはランダム性がサンプリングされる*前に*固定されます。不正なコミッターは、コミットされたベクトルをチェックランダム性と相関させる可能性があります。これは、セキュリティ証明で排除しなければならないことです。
-   コードチェッカーのドメイン $\mathcal{L}$ にマッピングする**ランダムオラクル** (random oracle) $\mathsf{H}$。
-   以下の関係 $\mathcal{R}$ に対する**非対話型知識証明** (non-interactive argument of knowledge) $\mathsf{AS} = (\mathsf{Setup}, \mathsf{Prove}, \mathsf{Ver})$ は、ストレートラインエクストラクター (straightline extractor) を伴う知識健全性 (knowledge soundness)（Foundations論文の定義18）を満たします。関係は以下の通りです。
    -   *ステートメント (Statement):* $(\mathsf{ck}, \mathsf{com}_{\mathsf{VC}}, L)$、すなわちコミットメントキー、コミットメント、およびチェックランダム性。
    -   *証人 (Witness):* 主張されるコードワード $c \in \Gamma^n$。
    -   *制約 (Constraint):* $\mathsf{com}_{\mathsf{VC}} = \mathsf{VC}.\mathsf{Com}(\mathsf{ck}_{\mathsf{VC}}, c)$ **かつ** $\mathsf{Check}(L, c) = 1$。

完全なメンバーシップチェック $c \in \mathcal{C}$ は意図的に関係の一部では*ありません*。これが最適化の全体的なポイントです。モデル化に関する注意点として、引数システムはそれ自体ではランダムオラクルクエリを行わないものとして扱われます。内部的にハッシュを使用する証明システム（[[glossary/leanVM|leanVM]]のように）でインスタンス化する場合、そのハッシュは $\mathsf{H}$ とドメイン分離 (domain-separated) されている必要があります。

### スキーム

これらの構成要素を用いて、以下の消失訂正符号コミットメントスキームを構築します（`Target/Scheme.lean` の `scheme` として形式化されています）。

-   $\mathsf{Setup}(1^\lambda) \to \mathsf{ck}$: $\mathsf{ck}_{\mathsf{VC}} \leftarrow \mathsf{VC}.\mathsf{Setup}(1^\lambda)$ と $\mathsf{par}_{\mathsf{AS}} \leftarrow \mathsf{AS}.\mathsf{Setup}(1^\lambda)$ を実行し、$\mathsf{ck} = (\mathsf{ck}_{\mathsf{VC}}, \mathsf{par}_{\mathsf{AS}})$ を返します。
-   $\mathsf{Com}(\mathsf{ck}, m) \to (\mathsf{com}, \mathsf{St})$:
    -   $c = \mathcal{C}(m)$ をエンコードし、$\mathsf{com}_{\mathsf{VC}} = \mathsf{VC}.\mathsf{Com}(\mathsf{ck}_{\mathsf{VC}}, c)$ をコミットします。
    -   $L = \mathsf{H}(\mathsf{com}_{\mathsf{VC}})$ を導出します。
    -   $\pi = \mathsf{AS}.\mathsf{Prove}(\mathsf{par}_{\mathsf{AS}}, (\mathsf{ck}_{\mathsf{VC}}, \mathsf{com}_{\mathsf{VC}}, L), c)$ を計算します。
    -   $\mathsf{com} = (\mathsf{com}_{\mathsf{VC}}, \pi)$ を返します。
-   $\mathsf{Open}$ と $\mathsf{Ver}$: $\mathsf{VC}$ を使用してポジションを開きます。検証は $L = \mathsf{H}(\mathsf{com}_{\mathsf{VC}})$ を再計算し、$\pi$ を検証してから、オープニングを検証します。

セキュリティの観点からは、Lを導出するためにコミットメントのみをハッシュすることに注意してください。より多くのものをハッシュしても、セキュリティは向上するだけです。

このようなコミットメントがどのように[[glossary/Data-Availability|データアベイラビリティ (DA)]]サンプリング (DAS) スキームに変換されるかについては、Foundations論文を参照してください。スキームが*コード拘束性 (code-binding)* と*位置拘束性 (position-binding)* を満たしていれば十分であり、これが私たちが証明する内容です。

## 証明の概要

この証明は興味深いので、ここでその概要を説明します。これをLeanに変換するには多少の労力が必要ですが、それほど多くはありません。*位置拘束性 (position-binding)* と*コード拘束性 (code-binding)* を示すことを思い出してください（定義はFoundations論文を参照）。

### シンプルな位置拘束性

これはベクトルコミットメントの位置拘束性 (position-binding) に直接還元されます。削減はコミットメントの証明部分を無視し、残りを転送するだけです（定理 `scheme_positionBinding`）。

### コード拘束性: Foundations論文からの証明の要約

まず、コードチェックが完璧であった場合、つまり関係が正確なコードメンバーシップをチェックした場合のセキュリティ証明を思い出してください。

-   攻撃者はコミットメント $(\mathsf{com}_{\mathsf{VC}}, \pi)$ といくつかのポジションのオープニングを出力し、どのコードワードもそれらと矛盾しないようにします。
-   私たちは $\pi$ からコミットメント $\mathsf{com}_{\mathsf{VC}}$ の原像 $c$ を抽出します。関係が正確なコードメンバーシップをチェックするため、$c$ はコード内にあります（そうでなければ知識健全性 (knowledge soundness) が破られます）。
-   $c$ がコード内にあり、どのコードワードもオープニングと矛盾しないため、オープニングの1つが $c$ と矛盾しているはずです。これは位置拘束性 (position-binding) を破ります。

最後のステップでは、弱い位置拘束性 (position-binding) のバリアントで十分です。このバリアントでは、2つのオープニングのうちの1つが*正直に計算された*コミットメント（すなわち、抽出された $c$ へのコミットメント）から来ています。形式化では、この弱いバリアントと、後で使用される決定論的な $\mathsf{Com}$ の衝突耐性 (collision-resistance) プロパティが、位置拘束性 (position-binding) と完全性から証明されます（`Assumptions/VectorCommitment.lean`）。

### 主な技術的課題

私たちのスキームでは、コードメンバーシップは確率的にのみチェックされ、ランダム性 $L$ はコミットメントからフィアット・シャミア (Fiat–Shamir) を介して導出されます。コミットメントが*完全に抽出可能 (perfectly extractable)* であると一時的に仮定してみましょう。$\mathsf{com}_{\mathsf{VC}}$ を見ると、後続のすべてのオープニングが矛盾しない原像 $c$ を直ちに取得できます。この場合、各ランダムオラクルクエリ (random oracle query) に対して悪いイベントを定義できます。すなわち、クエリされたコミットメントが非コードワード $c$ に抽出されるが、新しくサンプリングされた応答 $L$ でチェックに合格するというイベントです。$c$ は $L$ の前に決定されるため、各イベントは $\delta$ で制限されます。

これには問題があります。$\mathsf{Com}$ をマークルツリー (Merkle tree) と考えてみましょう。私たちは証明された関係の内部で $\mathsf{Com}$ を評価しますが、マークルツリーは、そのハッシュ自体がランダムオラクルとしてモデル化されている場合にのみ完全に抽出可能です。つまり、証明された関係の内部でランダムオラクルを評価することになり、これは[不可能](https://eprint.iacr.org/2024/728.pdf)であることが示されている*相対化された簡潔な引数 (relativized succinct argument)* を必要とします。*この経路は避けなければなりません。* 補足ですが、フィアット・シャミアハッシュが[[glossary/ZK-SNARKs|ZK-SNARKs]]の外部で計算されるのもこのためです。そうでなければ、相対化された引数を使用せざるを得なくなります。

抽出可能性がなければ、$L$ がサンプリングされる前に $c$ が固定されているという形式的な保証はありません。私たちが証明できる限り、攻撃者は $L$ を見てからどの $c$ を開くかを決定するかもしれません。したがって、コードチェッカーの健全性を直接適用することはできません。

### 解決策の直感

もちろん、希望はあります。もし攻撃者が $L$ を見てからどの $c$ を開くかを決定するならば、異なる $L'$ に対して異なる $c' \neq c$ を開くこともできたはずです。そして、同じコミットメントの2つの異なるオープニングはバインディングを破ります。問題は、削減がこの仮説上の別の $c'$ を決して見ないことです。解決策は*リワインディング (rewinding)* です。攻撃者がコミットメントを生成した時点から、独立したチェックランダム性を用いて2回実行し、仮説上の $c'$ を実際の $c'$ にします。

### コミットされた健全性

分析の核心を、*コミットされた健全性 (committed soundness)* と呼ぶ抽象的なセキュリティ実験に分離します。これにはベクトルコミットメント、コード、コードチェッカー、およびランダムオラクルのみが関与し、引数システムは役割を果たしません。攻撃者は $\mathsf{ck}_{\mathsf{VC}}$ とランダムオラクルへのアクセスを得て、ペア $(\mathsf{com}_{\mathsf{VC}}, c)$ を出力します。$L = \mathsf{H}(\mathsf{com}_{\mathsf{VC}})$ の場合、以下の条件で勝利します。

1.  $c \notin \mathcal{C}$ だが $\mathsf{Check}(L, c) = 1$、かつ
2.  $c$ は $\mathsf{com}_{\mathsf{VC}}$ にコミットしている、すなわち $\mathsf{com}_{\mathsf{VC}} = \mathsf{VC}.\mathsf{Com}(\mathsf{ck}_{\mathsf{VC}}, c)$。

この実験は、上記で特定されたギャップを正確に捉えています。攻撃者は $c$ をそのコミットメントから導出されたチャレンジと相関させる可能性があります。（形式化には、ランダムオラクルなしの同等の*インタラクティブ*バリアントも含まれており、ゲーム自体が攻撃者がコミットした後に一様な $L$ を送信します。この2つは、チャレンジを決定したオラクルクエリを推測する標準的な引数によって関連付けられます。これはクエリ数に比例した損失を伴います。）

### コミットされた健全性からコード拘束性へ

効率的な攻撃者がコミットされた健全性 (committed soundness) ゲームに勝利できないと一時的に仮定します。コード拘束性 (code-binding) は、Foundations論文と同じパターンで導かれます（定理 `scheme_codeBinding`）。コード拘束性に対する攻撃者がコミットメント $(\mathsf{com}_{\mathsf{VC}}, \pi)$ とオープニングを出力し、どのコードワードもそれらと矛盾しない場合、ステートメント $(\mathsf{ck}_{\mathsf{VC}}, \mathsf{com}_{\mathsf{VC}}, L)$ で $\pi$ から抽出された証人 $c$ を考えます。正確に3つのうちの1つが発生します。

-   *抽出が失敗する* ($c$ が有効な証人ではない): 実行は引数システムの知識健全性 (knowledge soundness) を破ります（削減 $\mathcal{R}_1$）。
-   *抽出が成功するが $c \notin \mathcal{C}$*: この場合、$c$ は $L = \mathsf{H}(\mathsf{com}_{\mathsf{VC}})$ でチェックに合格し、$\mathsf{com}_{\mathsf{VC}}$ にコミットします。これはコミットされた健全性 (committed soundness) ゲームでの勝利です（削減 $\mathcal{R}_2$）。
-   *抽出が成功し $c \in \mathcal{C}$*: どのコードワードもオープニングと矛盾しないため、いくつかのオープニングが $c$ と矛盾し、（弱い）位置拘束性 (position-binding) を破ります（削減 $\mathcal{R}_3$）。

3つのケースの和集合境界 (union bound) は以下を与えます。

$\Pr[\text{コード拘束性が破られる}] \;\le\; \varepsilon_{\mathsf{ks}} + \varepsilon_{\mathsf{cs}} + \varepsilon_{\mathsf{wpb}}.$

### コミットされた健全性ゲームの分析

これはリワインディング (rewinding) を使用する部分です（定理 `niCommittedSoundness_forking_bound`）。アイデアは、攻撃者が顕著な確率でゲームに勝利する場合、そのチャレンジを決定したオラクルクエリの時点から、新しい応答で2回目を再生すると、関連する確率で*両方の*実行に勝利するというものです。これはフォークイング補題 (forking lemma) によって正確に記述され、これはVCVioライブラリにすでに利用可能でした。最大 $Q$ 個のランダムオラクルクエリ (random oracle query) を行う攻撃者の勝利確率を $\mathsf{acc}$ とすると、2回の実行は2つの独立したチャレンジ $L \neq L'$ と2つの応答 $c, c'$ を伴う同じコミットメント $\mathsf{com}_{\mathsf{VC}}$ を生成し、以下を区別します。

-   *異なる応答* ($c \neq c'$): 両方とも決定論的な $\mathsf{Com}$ の下で同じ $\mathsf{com}_{\mathsf{VC}}$ にコミットします。これは衝突であり、ベクトルコミットメントの位置拘束性 (position-binding) を破ります。
-   *同じ応答* ($c = c'$): この場合、$c$ は最初の実行によってすでに決定されており、特に新しいチャレンジ $L'$ がサンプリングされる*前に*決定されており、$\mathsf{Check}(L', c) = 1$ に合格する非コードワードです。コードチェッカーの $\delta$-健全性 (soundness) により、これは最大 $\delta$ の確率で発生します。

全体として、フォークイング分析は以下を与えます。

$\mathsf{acc} \cdot \left( \frac{\mathsf{acc}}{Q+1} - \frac{1}{|\mathcal{L}|} \right) \;\le\; \varepsilon_{\mathsf{coll}} + \delta,$

ここで $\varepsilon_{\mathsf{coll}}$ は明示的な衝突発見削減の成功確率であり（これは位置拘束性 (position-binding) によって制限されます）、$\delta$ はコードチェッカーの健全性エラーです。形式化の取り組みにおける嬉しい驚きの一つは、ライブラリのフォークイング補題 (forking lemma) を用いて非対話型ゲームを直接分析することが、上記で概説したインタラクティブゲームを経由する2段階の経路よりも、より単純で定量的に優れていることが判明したことです。

### 最終的な境界

各部分を組み合わせ、不等式を解くと（定理 `scheme_codeBinding_concrete` および `scheme_codeBinding_concrete_posBinding`）、$Q$ 個のランダムオラクルクエリ (random oracle query) を行うコード拘束性 (code-binding) を破る攻撃者は以下を導出します。

$\Pr[\text{コード拘束性が破られる}] \;\le\; \varepsilon_{\mathsf{ks}} + \varepsilon_{\mathsf{pb}} + \sqrt{(Q+2)\left(\varepsilon_{\mathsf{pb}}' + \delta + \tfrac{1}{|\mathcal{L}|}\right)},$

ここで $\varepsilon_{\mathsf{ks}}$ は知識健全性 (knowledge soundness) エラーであり、$\varepsilon_{\mathsf{pb}}, \varepsilon_{\mathsf{pb}}'$ は明示的な削減の位置拘束性 (position-binding) エラーです。（Lean開発では、境界は正確な二乗形式で記述されており、平方根は回避されています。）

*定量的な側面に関する注意。* 平方根の損失と係数 $Q$ は、フィアット・シャミア (Fiat–Shamir) 由来のランダム性のリワインディング (rewinding) ベースの分析に固有のものであり、パラメータ選択において重要です。証明可能なセキュリティレベルは、$\delta$ 自体ではなく $\sqrt{Q \cdot \delta}$ によって決定されます。例えば、$\delta \approx 2^{-136}$ のチェッカー（以前の投稿のリード・ソロモンインスタンス化のように）は、$2^{64}$ 個のランダムオラクルクエリ (random oracle query) を行う攻撃者に対して、約36ビットのコード拘束性 (code-binding) セキュリティを証明可能に提供します。これはヒューリスティックな推定 $\delta$ よりもはるかに保守的です。これは証明技術の成果物かもしれませんが、パラメータをどのように設定するかは議論の余地があります。

## カバーされていない内容

形式化は消失訂正符号コミットメントスキームとその2つのバインディングプロパティを、すべての削減を明示的に含めてカバーしています。カバーされていない内容は以下の通りです。消失訂正符号コミットメントから完全な[[glossary/Data-Availability|データアベイラビリティ (DA)]]サンプリング (DAS) スキームへのコンパイル（Foundations論文のセクション6）、具体的なコードチェッカーインスタンス化のセキュリティ（例えば、以前の投稿の重心リード・ソロモンチェック (barycentric Reed–Solomon check) — その健全性は自己完結型の多項式同一性引数 (polynomial identity argument) であるため、次の自然なステップです）、または引数システムとハッシュ関数の内部（これらはモデルの仮定です）。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethrese.ar.ch/t/formally-verified-security-for-pq-das-leanda/25746)
