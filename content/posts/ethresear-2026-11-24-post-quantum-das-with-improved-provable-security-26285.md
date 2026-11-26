---
title: 証明可能なセキュリティが向上したポスト量子DAS
original_title: Post-quantum DAS with improved provable security
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/post-quantum-das-with-improved-provable-security/26285'
author: b-wagn
date: '2026-11-24'
category: Cryptography
tags:
  - cryptography
  - data-availability
  - zk
  - security
  - research
  - post-quantum
  - formal-verification
  - protocol-design
topic_id: '26285'
translated_at: '2026-11-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Post-quantum DAS with improved provable security](https://ethresear.ch/t/post-quantum-das-with-improved-provable-security/26285) — b-wagn (2026-11-24)

# 証明可能なセキュリティが向上したポスト量子DAS

*著者: Benedikt Wagner*

TL;DR: [こちら](https://ethresear.ch/t/formally-verified-security-for-pq-das-leanda/25746)のPQ-DASスキームを修正し、より厳密な証明済みセキュリティバウンドを持つものを提案します。この厳密なバウンドをLeanで証明しました。利点は、より高い証明可能なセキュリティレベルが得られることです。欠点は、効率が低いことです。

## 背景

[[glossary/Post-Quantum-PeerDAS|ポスト量子DAS]]の[[glossary/PeerDAS|PeerDAS]]に関する[現在の提案](https://ethresear.ch/t/leanda-design-and-benchmark/25642)は、[[glossary/Merkle-trees|Merkleツリー]]と[[glossary/ZK-SNARKs|簡潔非対話型知識証明 (SNARKs)]]に依存しています。その主要なセキュリティ特性である*[[glossary/Code-binding|コードバインディング (code-binding)]]* は、[最近の投稿](https://ethresear.ch/t/formally-verified-security-for-pq-das-leanda/25746)でLeanで[[glossary/Formal-Verification|形式的に証明]]されています。その投稿（および本投稿）では、構成要素（[[glossary/Vector-commitment|ベクトルコミットメント]]、[[glossary/ReedSolomon-codes|消去符号]]、SNARKs、コードチェッカー）を抽象的に扱い、一般的なセキュリティ証明を提供しています。

> 読者の皆様には、コードバインディング、ベクトルコミットメント、コードチェッカーなどの基本的な用語に精通していることを前提とします。そうでない場合は、まず[元の投稿](https://ethresear.ch/t/formally-verified-security-for-pq-das-leanda/25746)を読むことをお勧めします。

残念ながら、証明されたセキュリティバウンドはスキームが「構造的」な弱点がないことを確立する一方で、それが確立する具体的なセキュリティレベル（別名：セキュリティビット数）は定量的に弱いものです。すなわち、証明は以下を示しています。

\\Pr\[\\text{adversary breaks code-binding}\] \\;\\le\\; \\varepsilon\_{\\mathsf{ks}} + \\varepsilon\_{\\mathsf{pb}} + \\sqrt{(Q+2)\\left(\\varepsilon\_{\\mathsf{pb}}' + \\delta + \\tfrac{1}{|\\mathcal{L}|}\\right)}.

ここで、\\varepsilon\_{\\mathsf{ks}} はSNARKの知識健全性エラーを示し、\\varepsilon\_{\\mathsf{pb}}、\\varepsilon\_{\\mathsf{pb}}' は[[glossary/Position-binding|ベクトルコミットメントスキームの位置拘束性 (position-binding)]]に対する削減の利点であり、\\delta、\\mathcal{L} はコードチェッカー（すなわち、確率的[[glossary/ReedSolomon-codes|リード・ソロモン符号]]メンバーシップチェック）に関連する項です。
典型的なインスタンス化では、\\delta + \\tfrac{1}{|\\mathcal{L}|} を非常に小さくすることができますが、\\varepsilon\_{\\mathsf{pb}}' が、例えば実行時間 Q の攻撃者に対して (Q/2^{128})^2 のような値で上限が定められるハッシュ関数を選択する可能性が高いでしょう。特に、バウンド内の平方根項は、約 Q\\sqrt{Q+2}/2^{128} となり、敵対者の利点において約 \\sqrt{Q} の追加因子を生み出します。Q が大きい場合、これはかなり重要です。この項のみを考慮すると、バウンドは望ましい Q=2^{128} ではなく、約 Q=2^{85.3} で無意味になります。

本投稿では、このスキームの修正版を示し、より厳密なバウンドが得られます。

\\Pr\[\\text{adversary breaks code-binding}\] \\;\\le\\; \\varepsilon\_{\\mathsf{ks},0} + \\varepsilon\_{\\mathsf{ks}} + \\varepsilon\_{\\mathsf{pb}} + \\varepsilon\_{\\mathsf{pb}}' + (Q+1)\\cdot\\delta.

ここで、\\varepsilon\_{\\mathsf{ks},0} は修正されたスキームが使用する2番目のSNARKの知識健全性エラーであり、Q は敵対者の[[glossary/VRF|ランダムオラクル]]クエリ数であり、その他の項は（異なる削減に対して）上記と同じです。重要なのは、もはや平方根がなく、因子 Q は統計項 \\delta のみを乗算することです。例えば、コードチェッカーチャレンジに十分大きな拡大体を使用することで、(Q+1) 項を補償するために \\delta を十分に小さくできることに注意してください。

## 損失の発生源

平方根による損失がどこから来るのかを理解するために、まずスキームを振り返りましょう。私たちはコードワードにコミットし、後で個々の位置を開示したいと考えています。どの検証者も、開示されたものがコードと一貫していることを確信できるべきです（これが*コードバインディング*です）。

このスキームでは、メッセージ m へのコミットメントは次のように計算されます。

- m をコードワード c = \\mathcal{C}(m) にエンコードし、[[glossary/Vector-commitment|ベクトルコミットメント]]でコミットします。\\mathsf{com}\_{\\mathsf{VC}} = \\mathsf{VC}.\\mathsf{Com}(\\mathsf{ck}\_{\\mathsf{VC}}, c);
- コードチェッカーのチャレンジを L = \\mathsf{H}(\\mathsf{com}\_{\\mathsf{VC}}) として導出します;
- \\mathsf{com}\_{\\mathsf{VC}} = \\mathsf{VC}.\\mathsf{Com}(\\mathsf{ck}\_{\\mathsf{VC}}, c) および \\mathsf{Check}(L, c) = 1 を満たすベクトル c の知識を示すSNARK \\pi を計算します。

コミットメントは (\\mathsf{com}\_{\\mathsf{VC}}, \\pi) であり、位置は \\mathsf{VC} を使用して開示されます。SNARKは c がコードワードであることを示すものではないことに注意してください。これは、Fiat-Shamirから導出されたチャレンジ L に対して c が確率的チェックをパスすることのみを示しており、証明がより安価です。

セキュリティ証明は、コードバインディングの破綻が与えられた場合にVCの[[glossary/Position-binding|位置拘束性]]の破綻を見つける必要があります。

コードバインディングの破綻とは、いかなるコードワードとも一貫しない受け入れ可能な開示を持つコミットメント (\\mathsf{com}\_{\\mathsf{VC}}, \\pi) です。\\pi から、\\mathsf{com}\_{\\mathsf{VC}} にコミットし、L = \\mathsf{H}(\\mathsf{com}\_{\\mathsf{VC}}) のチェックをパスするベクトル c を抽出できます。もし c がコードワードであれば、完了です。開示のいずれかが c と一致せず、これにより[[glossary/Position-binding|位置拘束性]]が破綻します。

問題は、c がコードワードではないケースです。コードチェッカーの健全性は、L がサンプリングされる*前*に固定された非コードワードが、最大 \\delta の確率でチェックをパスすることのみを述べています。しかし、私たちは \\pi から c を取得し、敵対者は L を見た*後*に \\pi を計算します。したがって、c が L の前に固定されていたことを示すものは何もありません。証明できる限り、敵対者は L に応じて c を選択した可能性があります。

元の証明は、*巻き戻し (rewinding)* によってこれを解決します。これが平方根の由来です。具体的には、敵対者が \\mathsf{H}(\\mathsf{com}\_{\\mathsf{VC}}) をクエリした時点から、今度は新しいチャレンジ L' を用いて敵対者を2回目に実行し、2番目のベクトル c' を抽出します。もし c' \\neq c であれば、\\mathsf{com}\_{\\mathsf{VC}} にコミットする2つの異なるベクトルが存在することになり、[[glossary/Position-binding|位置拘束性]]が破綻します。もし c' = c であれば、c は L' がサンプリングされる前に固定されていたため、このケースの確率は最大 \\delta です。

述べたように、巻き戻しが平方根の理由です。敵対者は*両方*の実行で成功し、その Q 個の[[glossary/VRF|ランダムオラクル]]クエリのうち同じ1つに対して成功する必要があります。少し単純化すると、コードバインディングを確率 \\mathsf{acc} で破綻させる場合、これは約 \\mathsf{acc}^2/Q の確率でしか起こりません（これは「フォーク補題 (forking lemma)」と呼ばれるものです）。したがって、\\mathsf{acc}^2/Q \\leq \\varepsilon\_{\\mathsf{pb}}' + \\delta となり、\\mathsf{acc} について解くと平方根と因子 Q が得られます。

巻き戻しが必要な理由の詳細については、[元の投稿](https://ethresear.ch/t/formally-verified-security-for-pq-das-leanda/25746)を参照してください。

[著者による投稿への返信](https://ethresear.ch/t/formally-verified-security-for-pq-das-leanda/25746/2)では、[[glossary/Vector-commitment|ベクトルコミットメント]]の[[glossary/Position-binding|位置拘束性]]のみを仮定する限り、この緩いバウンドがこのスキームにとってある程度必要であることが示されています。

## 修正されたスキーム

修正は簡単です。知識の引数 (argument of knowledge) がコードチェッカーのチャレンジが定義された*後*に原像を与えたため、巻き戻しが必要でした。この順序は、チャレンジを定義するハッシュに知識の引数を入力することで変更できます。もちろん、この引数はチャレンジによって誘発されるチェックが成立することを証明できないため、2つのSNARKが必要になります。

スキームをより形式的に指定するために、[元の投稿](https://ethresear.ch/t/formally-verified-security-for-pq-das-leanda/25746)と同じ構成要素 \\mathcal{C},\\mathsf{VC},(\\mathcal{L}, \\mathsf{Check}),\\mathsf{H},\\mathsf{AS} を使用しますが、さらに、関係 \\mathcal{R}\_0 のための[[glossary/ZK-SNARKs|非対話型知識証明 (non-interactive argument of knowledge)]] \\mathsf{AS}\_0 = (\\mathsf{Setup}, \\mathsf{Prove}, \\mathsf{Ver}) を使用します。これは以下の通りです。

- *ステートメント (Statement):* (\\mathsf{ck}, \\mathsf{com}\_{\\mathsf{VC}})、すなわちコミットメントキーとコミットメント;
- *証人 (Witness):* 文字列 c \\in \\Gamma^n;
- *制約 (Constraint):* \\mathsf{com}\_{\\mathsf{VC}} = \\mathsf{VC}.\\mathsf{Com}(\\mathsf{ck}, c).

これは \\mathcal{R} と同じですが、コードメンバーシップに関する要件はありません。以前の投稿と同様に、引数システムは[[glossary/VRF|ランダムオラクル]] \\mathsf{H} 自体にアクセスしないものとして扱い、そこにある知識健全性の同じ（理想化された）概念を使用します。[[glossary/VRF|ランダムオラクル]]モデルにおけるストレートライン抽出 (straight-line extraction) も同様に十分であるはずです。

新しいスキームの詳細は以下の通りです。

-   `Setup`(1^\\lambda) \\to `ck`: `ck_VC` \\leftarrow `VC`.`Setup`(1^\\lambda), `par_AS_0` \\leftarrow `AS_0`.`Setup`(1^\\lambda), および `par_AS` \\leftarrow `AS`.`Setup`(1^\\lambda) を実行し、`ck` = (`ck_VC`, `par_AS_0`, `par_AS`) を返します。
-   `Com`(`ck`, m) \\to (`com`, `St`):
    -   c = \\mathcal{C}(m) をエンコードし、`com_VC` = `VC`.`Com`(`ck_VC`, c) をコミットします。
    -   `pi_0` = `AS_0`.`Prove`(`par_AS_0`, (`ck_VC`, `com_VC`), c) を計算します。
    -   L = `H`(`com_VC`,`pi_0`) を導出します。
    -   `pi` = `AS`.`Prove`(`par_AS`, (`ck_VC`, `com_VC`, L), c) を計算します。
    -   `com` = (`com_VC`, `pi_0`, `pi`) および `St` = c を返します。
-   `Open` および `Ver`: `VC` を使用して位置を開示します。検証は L = `H`(`com_VC`, `pi_0`) を再計算し、`pi_0` と `pi` の両方を検証し、その後開示を検証します。

元のスキームとの主な違いは、[[glossary/VRF|ランダムオラクル]] \\mathsf{H} に入力される証明 \\pi\_0 です。

## 証明の概要

コードバインディング実験を考えます。一般性を失うことなく、敵対者が[[glossary/VRF|ランダムオラクル]]クエリを2回行わないと仮定します。

*ステップ1: \\pi\_0 と \\pi から抽出する。* 敵対者が[[glossary/VRF|ランダムオラクル]] \\mathsf{H} に対して行うすべてのクエリ (\\mathsf{com}\_{\\mathsf{VC}},\\pi\_0) において、提供された \\pi\_0 から c\_0 を抽出します。同様に、コードバインディングを破綻させるために敵対者が提供する最終コミットメント \\mathsf{com} に含まれる \\pi から証人 c を抽出します。\\pi が検証されるが c が有効な証人ではない場合、中止します。また、検証中に検証者が \\mathsf{H} に対して[[glossary/VRF|ランダムオラクル]]クエリを行うことに注意してください。このクエリ（または以前に行われた同じクエリ）で抽出される c\_0 を c\_0^\* と表記します。このクエリの \\pi\_0 が検証されるが抽出に失敗する場合、すなわち c\_0^\* が提供されたコミットメント \\mathsf{com}\_{\\mathsf{VC}} の有効な原像ではない場合も中止します。中止する確率は、引数システムの知識健全性を破綻させる削減を使用して境界を定めることができ、項 \\varepsilon\_{\\mathsf{ks},0} + \\varepsilon\_{\\mathsf{ks}} を与えます。

ここからは、中止せず、両方の証明が検証される（そうでなければ敵対者は勝てないため）と仮定します。この場合、チャレンジ L = \\mathsf{H}(\\mathsf{com}\_{\\mathsf{VC}},\\pi\_0) に対して c が \\mathsf{Check}(L, c) = 1 を満たし、c\_0^\* と c の両方が同じコミットメント \\mathsf{com}\_{\\mathsf{VC}} の原像であることがわかります。

*ステップ2: c\_0^\* \\neq c を排除する。* ここで、コードバインディングを破綻させるために最終出力の一部として提供された \\mathsf{com}\_{\\mathsf{VC}} の2つの抽出された原像に対して c\_0^\* \\neq c の場合、中止します。これまでに見てきたことから、このような中止は、[[glossary/Vector-commitment|ベクトルコミットメント]]の[[glossary/Position-binding|位置拘束性]]を容易に破綻させられることを意味します。これにより、項 \\varepsilon\_{\\mathsf{pb}} が得られます。

*ステップ3: L が c にとって悪いチャレンジであることを排除する。* [[glossary/VRF|ランダムオラクル]]クエリ \\mathsf{H}(\\mathsf{com}\_{\\mathsf{VC}},\\pi\_0) のいずれにおいても、コミットメントの原像 c\_0 はハッシュの出力 L がサンプリングされる前に固定されていることに注意してください。したがって、コードチェッカーの健全性プロパティは、L が c\_0 にとって「悪い」確率が最大 \\delta であることを保証します。ここで「悪い」とは、c\_0 がコード内にないが、\\mathsf{Check}(L, c\_0) = 1 であることを意味します。いずれかのクエリでこれが起こった場合、中止し、私たちのバウンドに項 (Q+1)\\cdot \\delta を追加します（敵対者の Q 個のクエリと検証者の1つのクエリに対して）。これが最終的に抽出された c に与える影響に注意してください。前のステップにより c\_0^\* = c であるため、もし c = c\_0^\* がコード内にない場合、\\mathsf{Check}(L, c) = \\mathsf{Check}(L, c\_0^\*) = 0 であることがわかります。しかし、その場合 c は有効な証人ではなく、ステップ1と矛盾します。したがって、c はコード内にあるはずです。

*ステップ4: 結論。* ここで、敵対者がいかなるコードワードとも一貫しない開示を提供するが、c がコードワードであることがわかっています。したがって、開示の少なくとも1つは c の対応する位置と矛盾するはずであり、再び[[glossary/Vector-commitment|ベクトルコミットメント]]の[[glossary/Position-binding|位置拘束性]]を適用することで、最終項 \\varepsilon\_{\\mathsf{pb}}' が得られます。すべての項を合計すると、バウンドが得られます。

振り返ると、主なトリックは、L がサンプリングされる前に固定されている c\_0^\* にコードチェッカーの健全性を適用することです。そして、[[glossary/Vector-commitment|ベクトルコミットメント]]のバインディングを使用して c\_0^\* と c が同じであると主張し、コードチェッカーの健全性が c に転送されるようにしました。

## 証明の形式化

私たちはLeanで証明を[[glossary/Formal-Verification|形式化]]しました。コードは[こちら](https://github.com/b-wagn/fv-pq-da/tree/tighterscheme)にあります。元の投稿と全く同じLean定義を使用しています。元の投稿と同様に、[[glossary/Formal-Verification|形式化]]は古典的な[[glossary/VRF|ランダムオラクル]]モデルで行われ、構成要素のセキュリティを抽象的に扱っています。特に、量子[[glossary/VRF|ランダムオラクル]]モデルにおける対応する具体的なセキュリティバウンドは確立しておらず、[[glossary/ReedSolomon-codes|消去符号]]コミットメントから完全なDASスキームへのコンパイルも[[glossary/Formal-Verification|形式化]]していません。Leanにおける主要な関連定理は `tightScheme_perfectlyComplete`、`tightScheme_positionBinding`、および `tightScheme_codeBinding_posBinding` です。

## 比較と結論

良い面としては、このスキームははるかに高い証明済みセキュリティレベルをもたらすことができます。例えば、128ビット安全な[[glossary/Vector-commitment|ベクトルコミットメント]]、コードチェッカー、SNARKsを使用すれば、コードバインディングに対して128ビットに近いセキュリティが得られる可能性があります。もちろん、欠点は、この新しいスキームの効率が低いことです。元のスキームと比較して、プルーバーは1つではなく2つのSNARKを計算する必要があります。

このスキームを元のスキームの代替と見なすかどうかは、効率への影響がどれほど大きいかによります。また、正確なRSコードメンバーシップを証明し、確率的コードチェックを使用しない、したがってFiat-Shamirを使用しない、より素朴なスキームも常に念頭に置くべきです。この素朴なスキームも平方根の損失はありませんが、主要な提案よりも効率は低いです。

*1件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethresear.ch/t/post-quantum-das-with-improved-provable-security/26285)
