---
title: Lean 4でFOCILを形式化する
original_title: Formalizing FOCIL in Lean 4
source_url: 'https://ethresear.ch/t/formalizing-focil-in-lean-4/24950'
author: rahul
date: '2026-05-25'
category: Consensus
tags:
  - consensus
  - ethereum
  - focil
  - lean4
  - 形式検証
topic_id: '24950'
translated_at: '2026-05-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Formalizing FOCIL in Lean 4](https://ethresear.ch/t/formalizing-focil-in-lean-4/24950) — rahul (2026-05-25)

# Lean 4でFOCILを形式化する

FOCIL ([[EIP|EIP（Ethereum改善提案）]]-7805) は、Hegotáで予定されている検閲耐性 (censorship-resistance) の目玉機能です。誰もが繰り返すセールスポイントは「IL（Inclusion List）委員会メンバー間のN分の1の正直さ」です。つまり、トランザクションをリストに載せる非曖昧なメンバーが1人いれば、そのトランザクションがカノニカルなブロックに強制的に含まれるのに十分だということです。

この主張が顕微鏡の下でどのように見えるかを知りたかったのです。短い答えは、Ethereumの標準的な正直なバリデーターが2/3超であるという仮定からエンドツーエンドで導き出され、それが成り立つということです。しかし、Leanで記述することで、仕様について議論する価値があると思われる3つの点が明らかになりました。

リポジトリは [github.com/rahulbarmann/focil-lean4](https://github.com/rahulbarmann/focil-lean4) です。これは純粋なLean 4であり、Mathlibは使用しておらず、標準のツールチェーンから数十秒でビルドできます。5つの純粋な安全性 (safety) 定理はゼロ公理です。PoS（Proof of Stake）由来のチェーンは `propext` と `Quot.sound` のみを受け継ぎます。`Classical.choice` と `sorryAx` はどこにも使用されていません。

この投稿は次のように構成されています。§1 安全性に関する主張、§2 PoSリフトの仕組み、§3 形式化によって明らかになった3つの観察、§4 範囲外の事項と次の自然なステップ、§5 監査の再現方法、§6 フィードバックをいただきたい質問。

## 1\. 安全性に関する主張

[`Focil/EndToEnd.lean`](https://github.com/rahulbarmann/focil-lean4/blob/d6832793e6c5153e58079252e4a29c29bf1b7138/Focil/EndToEnd.lean) の主要な定理：

```lean
theorem focil_concrete_pos_safety
    {s : StakeModel} (r : AttesterRun s)
    (b : Block) (tx : Transaction)
    (initial : AccountState)
    (h_canAppend_pin :
      r.canAppend = fun tx' b' => canAppendToBlock initial b' tx')
    (h_listed_by_some_honest_member :
      ∃ il, il ∈ r.state.stored_ils
            ∧ IsConsidered r.state il
            ∧ tx ∈ il.transactions)
    (h_can_append    : canAppendToBlock initial b tx)
    (h_block_not_full: ¬ r.full b)
    (h_canonical     : IsCanonical r.toForkChoice b) :
    tx ∈ b.transactions
```

言葉で説明すると：3H > 2N（正直なバリデーターの数がH、合計がNである場合の過半数条件）を持つ任意の `StakeModel` と、その上で有効性述語がnonceのみのアカウント状態プロキシである任意の `AttesterRun` を固定します。任意のブロック `b` とトランザクション `tx` について、ストア内の何らかのインクルージョンリスト (inclusion list) が曖昧でなく `tx` を含み、ブロックが厳密な2/3のクォーラムを蓄積しており、`tx` のnonceが `b` のポストステートにおける送信者の期待されるnonceと一致し、`b` が満杯でない場合、`tx` は `b` のトランザクションに含まれます。

ここには不透明な `CanAppend` はありません。有効性レイヤーは実際のアカウント状態述語であり、soispokeの [FOCIL :handshake: Native Account Abstraction](https://ethereum-magicians.org/t/focil-native-account-abstraction/27999) の投稿でEOA（Externally Owned Account）ケースのために指摘されているのと同じ安価なnonceプロキシです。

この証明は3つの要素を組み合わせます。

1.  [`Focil/Safety.lean`](https://github.com/rahulbarmann/focil-lean4/blob/d6832793e6c5153e58079252e4a29c29bf1b7138/Focil/Safety.lean) にある、有効性述語でパラメーター化された1-of-N定理 `focil_one_of_n_protection`。
2.  PoS由来の `ForkChoice` リフト `AttesterRun.toForkChoice`。これは、過半数仮定からフォーク選択 (fork-choice) の義務を両方とも果たします（これについては§2で詳しく説明します）。
3.  [`Focil/AccountState.lean`](https://github.com/rahulbarmann/focil-lean4/blob/d6832793e6c5153e58079252e4a29c29bf1b7138/Focil/AccountState.lean) からの具体的な `canAppendToBlock`。

主要な補題 `canonical_implies_compliant` 内の連鎖は次のとおりです。

> b がカノニカルである \\Rightarrow b がクォーラムを持つ（カノニカル性の定義） \\Rightarrow b に投票した正直なバリデーター `v` が存在する (`quorum_has_honest_voter`) \\Rightarrow b はバンドルされたストアに対してFOCIL準拠である (`honest_attester_compliance`)。

検閲耐性の結果は、証人ILと候補トランザクションで準拠性をインスタンス化することで導き出されます。準拠性述語は3方向の選言（トランザクションが含まれる、または追加できない、またはブロックが満杯）に展開されます。後者の2つは仮説によって除外され、包含が残ります。

全体的なスローガン：FOCILの安全性は、非準拠ブロックをフィルタリングするフォーク選択ルールに対するカノニカル性の構造的な結果です。構造が機能し、証明はその構造をたどるだけです。

## 2\. PoSリフトの背後にある数え上げ引数

私が本当に興味深いと感じるこの部分が `quorum_has_honest_voter` です。これは、クォーラムに達したブロックには少なくとも1人の正直な投票者がいるということを述べているだけであり、Ethereum PoSが依拠する完全な2/3超の正直な過半数よりも**厳密に弱い**ものです。この弱い仮定こそが検閲耐性の証明に必要なすべてであり、過半数はそれを導き出すための入力としてのみ使用されます。

正直なバリデーターの数をH、`b` に投票したバリデーターの数をV\_b、合計バリデーター数をNとします。リフトは2つの入力を取ります。3H > 2N（過半数の仮定）と3V\_b > 2N（`b` に対する2/3のクォーラム）。不等式を加算すると：

3(H + V\_b) > 4N

したがって H + V\_b > N となり、正直なセットと `b` に投票したバリデーターのセットは、N人のバリデーターの集団内で互いに素であることはできません。証人となる正直な投票者は、数え上げの鳩の巣原理の補題から導き出されます。

```lean
private theorem filter_count_overlap
    {α : Type} (L : List α) (P Q : α → Bool)
    (h : L.length < (L.filter P).length + (L.filter Q).length) :
    ∃ x, x ∈ L ∧ P x = true ∧ Q x = true
```

`L` に関する帰納法と `(P hd, Q hd)` に関する2 \\times 2のケース分割によって証明されます。Mathlibも `Classical.choice` も使用していません。次に `AttesterRun.toForkChoice` は、ステークモデル (stake model) とアテスター実行 (attester-run) を `ForkChoice` 値にパッケージ化し、両方の義務が仮定ではなく証明されています。

このバージョンではステークモデルは重み付けされていません（1人のバリデーターは1つのステーク単位としてカウントされます）。数え上げ引数は、自明な方法で重み付けされた合計に一般化され、それは明確な次のフォローアップ項目です。

ここで別に引き出す価値のあることがあります。これが示すアーキテクチャ上の事実は、検閲耐性にはPoSの完全なBFT（Byzantine Fault Tolerance）の重みは必要ないということです。必要なのは、1人の正直な反対アテスターの存在だけであり、それは過半数から数え上げによって導き出されます。活性 (liveness) の議論にはより多くのものが必要かもしれませんが、安全性には必要ありません。

## 3\. これを行うことで得られた3つの観察

[FINDINGS.md](https://github.com/rahulbarmann/focil-lean4/blob/d6832793e6c5153e58079252e4a29c29bf1b7138/FINDINGS.md) に詳細に文書化されています。それぞれの短いバージョンと、フィードバックをいただきたい質問を添付します。

### 3.1 検閲チャネルとしての曖昧性

フォーク選択の変更では、同じ委員会メンバーからの2番目の異なるILは、そのメンバーを `inclusion_list_equivocators` に追加し、その後、そのメンバーのすべてのIL（最初のILに含まれる正直にリストされたトランザクションを含む）が無視されると規定されています。

これは正しいフォーク選択の安全性です。ビザンチン署名者を信頼することはできません。しかし、これは「N分の1の正直さ」の保証を「(N-曖昧な行為者)分の1」に低下させます。これは、あるトランザクションが単一の委員会メンバーのILに載っていたが、そのメンバーが曖昧な行為を捕捉された場合に発生します。EIPは曖昧な行為の証拠を記録していますが、EIP本文にはそれに関連する明示的なスラッシングルール (slashing rule) は見つかりませんでした。もしあれば教えていただけると幸いです。

Leanモデルはこれを正確に捉えています。`IsConsidered state il` は、作成者が `state.equivocators` に含まれるとfalseになるため、そのILに対する安全性定理の仮説は失敗します。定理は、`tx` をリストする**他の**正直なILに対しては依然として成り立ちます。`Tests/Examples.lean` のシナリオ9と10は、具体的な状態を詳細に説明しています。

問題は、仕様の作成者がこれをどのように考えているかです。これは許容可能な帯域幅レベルのコスト（1つのバリデーターのステークがリスクにさらされ、1つの委員会席の貢献が1つのトランザクションに対して無効になる）と見なされているのか、それとも曖昧な行為の証拠には明示的なスラッシングペナルティを付加すべきなのか、ということです。どちらも合理的ですが、現在の仕様テキストはどちらかの解釈にコミットしていません。

### 3.2 敵対的な有効性変更

EIP-7805のペイロード構築に関する議論では、プロポーザー (proposer) は、ILトランザクション `tx` がブロック生成時に有効でなくなった場合、正当にそれを省略できると指摘しています。悪意のあるプロポーザーは、ブロックを構築する直前にその無効性を意図的に引き起こしたいと考えるでしょう。

Nonceフロントランニング (nonce front-running) は最も単純な攻撃です。共謀する当事者がILトランザクションと同じ送信者を持つトランザクションを提出し、プロポーザーがそれを追加すると、ILトランザクションのnonceは古くなります。その後、プロポーザーは条件付き包含の免除を援用できます。

これは `front_running_breaks_appendability` として形式化されています。

```lean
theorem front_running_breaks_appendability
    (initial : AccountState) (b : Block)
    (tx_il tx_evil : Transaction)
    (h_same_sender    : tx_evil.sender = tx_il.sender)
    (h_il_appendable  : canAppendToBlock initial b tx_il)
    (h_evil_appendable: canAppendToBlock initial b tx_evil) :
    ¬ canAppendToBlock initial
        { b with transactions := b.transactions ++ [tx_evil] }
        tx_il
```

注目すべき小さな点：2つのトランザクションが明示的にnonceを共有すると仮定する必要はありません。同じ送信者であることと同時追加可能性は、すでにnonceの衝突を強制します（両方ともポストステートにおける送信者の期待されるnonceと等しくなければなりません）。これが最小限の仮説セットです。

シナリオ13は、この攻撃を実際のデータで実行します。送信者100、両方のトランザクションのnonceは0です。プロポーザーは空のブロックを共謀するトランザクションで拡張し、ILトランザクションはもはや追加できなくなります。

現在の具体的なモデルは、送信者ごとのnonceのみを追跡します。残高を考慮したバリアントで残高枯渇攻撃 (balance-drain attack) を捉える場合、構造的には同じ証明形状でケースの表面が2倍になります。これは自然な次の貢献です。

攻撃のコストは、スラッシングなしの1回のガス料金支払い（攻撃者はトランザクションを実行しており、曖昧な行為はしていません）です。仕様の作成者への質問：EIPは、プロポーザーが尊重しなければならないアカウント状態ごとの抽象化（プロポーザーがブロックに含める同じスロット内のトランザクションの前にプリステートをスナップショットする）にコミットしているのか、それともガス代がEOAケースに対する十分な抑止力と見なされているのか、ということです。どちらも合理的です。EIP本文やmagiciansスレッドで決定的な立場は見つかりませんでした。

### 3.3 正直なアテスターの不変条件は、アテスターのローカルストアに相対化されなければならない

フォーク選択の変更では、英語で、正直なアテスターはFOCIL非準拠ブロックに投票することを拒否すると規定されています。これはごく自然なことです。

これをLeanの述語として書こうとしたとき、このルールにはフォーク選択ストアがどのように定量化されるかによって、2つの非等価な形式的解釈があることに気づきました。

1.  **グローバルに定量化される場合。** *考えられるすべてのフォーク選択ストアに対して、`b` に投票した正直なアテスターは、そのストアに対して `b` を準拠させる。*
2.  **ローカルに相対化される場合。** *`b` に投票した正直なアテスターは、アテステーション (attestation) 時に彼ら自身が観察したストアに対して `b` を準拠させる。*

解釈(1)は、EVMの有効性が不透明な場合、非自明的に満たされません。`b` のトランザクションに含まれない任意の `tx` を選び、その唯一の格納されたILが `tx` を含む敵対的なストアを考えます。準拠性は3方向の選言となり、その選言肢は任意の `b` に対して満たされません。唯一の回避策は、投票関係を空にすることで先行条件を満たせないようにすることですが、これはルールを無効にします。

解釈(2)は満たされるものであり、正直なアテスターが実際に行うことと一致します。つまり、考えられるすべてのストアに対してではなく、アテステーション時に**彼ら自身の**フォーク選択ストアに対して投票するということです。EIPは解釈(2)の下で正しいです。私の懸念は、異なるストアスナップショットを持つアテスター間でルールを構成し、それを単一のグローバルな不変条件として扱う非形式的な証明スケッチには、英語の散文バージョンでは表面化しない隠れた量化子のスコープに関する仮定があるということです。

Leanモデルでの修正は小さく構造的です。`ForkChoice` 構造体はストアとフルネスモデルをフィールドとしてバンドルし、型レベルで解釈(2)を固定します。修正された形式化は、非自明な具体的なインスタンス（`Tests/Examples.lean` の `threeValidatorForkChoice`）を許容します。ここでは、両方の健全性義務が真のケース分析によって果たされ、§2のPoSリフトも過半数から同じことを行います。

これは、Lean形式化が本当に表面化させるのが得意な種類の微妙な仮定だと思います。他の人がこのルールを同じように読むか、異なるように読むか興味があります。

## 4\. 範囲外の事項と次の自然なステップ

正確に述べる価値があります。以下の各項目は、フォローアップ作業の候補となる接合部としてコードベースで命名されています。順序は、私が取り組むであろうおおよその順序です。

-   **ILトランザクション間のシーケンシャルな有効性依存性。** EIP-7805のペイロード構築に関するメモでは、以前のILトランザクションが追加されたために、あるILトランザクションが有効になる可能性があると指摘されています。現在の `CompliantWith` 述語は、最終ブロックに対してトランザクションごとに独立して定量化します。これを捉えることが、最もレバレッジの高い未解決項目です。構造的に侵襲的です。有効性述語は、「一時的に追加されたトランザクション」のリストをパラメータとして取る必要があり、安全性証明におけるケース分析の形状が変わるでしょう。
-   **残高を考慮した具体的な有効性。** 現在の具体的なモデルは、送信者ごとのnonceのみを追跡します。残高を考慮したバリアントを使用すると、同じPoS由来のチェーンに対して残高枯渇攻撃（§3.2）をエンドツーエンドで形式化できます。証明形状は同じですが、ケースの表面はほぼ2倍になります。
-   **[[EIP|EIP（Ethereum改善提案）]]-8141 フレームトランザクション。** [FOCIL :handshake: Native Account Abstraction](https://ethereum-magicians.org/t/focil-native-account-abstraction/27999) スレッドからのバウンド検証プレフィックスリプレイ (bounded validation-prefix replay) ルールを形式化する必要があります。より大きなスコープであり、別の作業として行うのが良いでしょう。
-   **曖昧な行為者の検出。** `state.equivocators` は入力として受け取られます。`on_inclusion_list` をモデル化し、それが曖昧な行為者セットを正しく設定することを証明することで、入力と派生値のギャップを埋めることができます。
-   **ILゴシップ / ネットワークモデル。** IL伝播を選択的に遅延させるネットワークの敵対者は、実効的な委員会サイズを減少させます。現在は前提条件（`il ∈ state.stored_ils`）としてのみ捉えられています。
-   **ステークの重み付け。** 各バリデーターは1単位としてカウントされます。数え上げ引数は重み付けされた合計に一般化されます。これはルーチン作業です。
-   **活性。** これは安全性のみの形式化です。活性に関する補完（すべてのスロットで常に準拠ブロックが存在する）は、別の研究方向です。

## 5\. 監査の再現

5つの純粋な安全性定理はゼロ公理です。PoS由来のチェーンは、`List.length` の補題に対する `omega` と `simp` を介して `propext` と `Quot.sound` を継承します。それ以外はありません。

これを自分で確認するには：

```bash
cat > AuditAxioms.lean <<'EOF'
import FocilLean4

#print axioms Focil.focil_one_of_n_protection
#print axioms Focil.focil_censorship_resistance
#print axioms Focil.censoring_block_not_canonical
#print axioms Focil.canonical_implies_compliant
#print axioms Focil.focil_concrete_safety
#print axioms Focil.focil_concrete_pos_safety
#print axioms Focil.focil_concrete_pos_censoring_block_not_canonical
EOF
lake env lean AuditAxioms.lean
```

5つの純粋な定理は「`does not depend on any axioms`」と報告されるはずです。PoS/具体的なチェーンは「`[propext, Quot.sound]`」と報告します。ビルドはMathlibフリーです。`lean-toolchain` はLean 4.29.1に固定されています。コールドキャッシュビルドは数十秒程度です。

## 6\. フィードバックをいただきたい質問

おおよそ重要度順に：

-   §3.1（検閲チャネルとしての曖昧性）：これは現状で許容可能なトレードオフなのか、それとも仕様にスラッシングルールを付加すべき項目なのか？
-   §3.2（敵対的な有効性変更）：これは既知の懸念であり、私がまだ見つけていないどこかで解決済みの立場があるのか？
-   §3.3（量化子のスコープの微妙さ）：これは他の人にとって実質的なものとして読めるのか、それとも私がフォーク選択ルールをモデル化する方法を選択したことによる文体上の人工物として読めるのか？

これら以外では、私の読みでは最も有用な貢献機会は§4の最初の項目です。つまり、シーケンシャルな依存性を捉えるために `CompliantWith` を改良することです。

ライセンスはEIPsに合わせCC0-1.0です。上記について、こちらまたはGitHub Issuesで議論できることを嬉しく思います。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/formalizing-focil-in-lean-4/24950)
