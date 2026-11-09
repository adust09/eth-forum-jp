---
title: 'leanVMにおけるPQ署名集約のためのフォールディング vs フルベリファイアリカーシブ: 測定と負の結果'
original_title: >-
  Folding vs full-verifier recursion for PQ signature aggregation in leanVM:
  measurements and negative results
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/folding-vs-full-verifier-recursion-for-pq-signature-aggregation-in-leanvm-measurements-and-negative-results/26227
author: arianaraghi
date: '2026-11-08'
category: Cryptography
tags:
  - cryptography
  - post-quantum
  - signatures
  - zk
  - proving
  - scaling
  - research
topic_id: '26227'
translated_at: '2026-11-09'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Folding vs full-verifier recursion for PQ signature aggregation in leanVM: measurements and negative results](https://ethresear.ch/t/folding-vs-full-verifier-recursion-for-pq-signature-aggregation-in-leanvm-measurements-and-negative-results/26227) — arianaraghi (2026-11-08)

## TL;DR

コミットdf7d122のleanVMを実行する8GB M2上で、ハッシュベースの[[cryptography/accumulation|アキュムレーション]]は、[[Aggregator|アグリゲーター]]内でのleanVMのフルベリファイア[[Recursive-verification|再帰的検証]]を上回ることはありませんでした。また、最適なバッチ処理設計も、リーフサイズを調整すると15%の目標を達成できませんでした。

-   **負の結果 (D1, D2, D3-S)。**
    -   leanXMSS検証を直接[[zk/Folding|フォールディング]]するには、署名あたり少なくとも7.1Mの[[R1CS-Constraint|R1CS制約]]が必要です。これはleanVMの署名あたりコストの約450倍に相当します（測定されたWARPレートから推測）。
    -   leanVMのステップ関係全体を[[zk/Folding|フォールディング]]すると、witness要素あたり260 nsで実行されますが、leanVMはコミットされたワードあたり55 nsです（検証済みレート）。
    -   マージ全体で子要素のオープニングを[[cryptography/accumulation|アキュムレーション]]すると、最大46kサイクルを節約するためにステップあたり約57kサイクルを費やします（検証済みカウント）。
-   **コスト分析（検証済み）。**
    -   マージ内で1つの子を検証するには186.8k VMサイクルかかります。その[[WHIR-proof|WHIR証明]]のオープニングがその55%を占めます。
    -   Merkleハッシュ化はサイクルの12%ですが、Keccak呼び出しの79%を占めます。
    -   JUMP行の73%はサブフィールドチェックです。
-   **バッチ処理された子オープニング (B’-L1)。**
    -   レベル1からの共有[[WHIR-proof|WHIR証明]]オープニングは、子要素あたり32.8kサイクル（17.6%、コストエミュレーションにより検証済み）を節約します。ラウンドごとのスケッチはleanVMの境界を維持します（推測）。
    -   1,500署名の場合、スロットのデッドラインでは、ベースラインの最適な構成よりも2.4%遅くなります。
-   **構成ルール（このマシンで検証済み）。**
    -   mu 25からmu 26にステップするマージノードは、コミットされたワードが約3%増えるだけで、1.4〜1.8倍の時間がかかります。
    -   1,500署名を250署名のリーフ6個ではなく300署名のリーフ5個として集約すると、ノードはmu 25に留まります。デッドラインは3.11秒から2.24秒に、スロットあたりのCPUは7.99秒から6.47秒に短縮されます。ファンインとリーフサイズに線形なコストモデルでは、このステップを認識できません。
-   **スコープ。**ここでのすべては1つの[[Aggregator|アグリゲーター]]内にあり、[[gossipsub|ゴシップ]]されたオブジェクトはleanVM[[zk/proofs|証明]]のままです。[[cryptography/accumulation|アキュムレーター]]は、265 KiBの[[zk/proofs|証明]]の代わりに、そのリーフのwitness（1,500署名で約1 GiB）を運ぶ必要があります。したがって、[[gossipsub|ゴシップ]]ホップは[[Recursive-STARK|再帰的]]なままです。[[cryptography/accumulation|アキュムレーション]]は、1つのマシンがすでに保持している[[zk/proofs|証明]]間の[[Recursive-verification|再帰的検証]]のみを置き換えることができます。

## 1. 質問と設定

私たちは、ハッシュベースの[[cryptography/accumulation|アキュムレーション]]（WARP、Arc）が[[Post-Quantum|ポスト量子]]署名集約のためのleanVMのフルベリファイア[[Recursive-verification|再帰的検証]]を上回る場所があるかどうかを調査しました。CPU時間、スロットデッドラインでのレイテンシ、メモリ、移動バイト数を測定しました。

Lean Ethereumは、BLSをleanXMSS署名に置き換え、leanVM[[zk/proofs|証明]]によって集約されます。[[EIP|EIP]]-8292（ドラフト）は、リーフ集約、[[Recursive-STARK|再帰的]]マージ、および集約あたり約256 KiBの[[gossipsub|ゴシップ]]ターゲットを定義しています。

CoratgerとSettyによるEF設計研究では、2つのパスを対比しています。パスAは[[zkVM|zkVM]]内でフルベリファイアを実行します。パスBはデサイダーを[[zk/Folding|フォールディング]]して[[zk/proofs|証明]]します。この研究には数値がありません。公開されているArcの実装は見つかりませんでした。WARPには研究コード（compsec-epfl/warp）があり、これをローカルで実行しました。

**スコープ: 1つの[[Aggregator|アグリゲーター]]内。**[[cryptography/accumulation|アキュムレーター]]は、265 KiBのleanVM[[zk/proofs|証明]]の代わりに、そのwitness（1,500署名リーフで約1 GiBのコミットされたワード）を運ぶ必要があります。したがって、[[gossipsub|ゴシップ]]ホップは[[Recursive-STARK|再帰的]]なままです。[[cryptography/accumulation|アキュムレーション]]は、1つのマシンがすでに保持している[[zk/proofs|証明]]間の[[Recursive-verification|再帰的検証]]のみを置き換えることができます。

**セットアップ（検証済み）。**

-   **leanVM:** leanEthereum/leanMultisig（leanVMに改名済み）、コミットdf7d122、rustc 1.99.0でビルド。
    -   二元体タワーフィールド: GF(2^64)、GF(2^192)のチャレンジ付き。
    -   ハッシュとしてKeccak-256。
    -   [[WHIR-proof|WHIR証明]]はLigerito形式で、[[KZG-commitment|コミットメント]]ごとに1つのスタックされた[[KZG-commitment|コミットメント]]を使用。
-   **マシン:** Apple M2 MacBook Air、8コア（パフォーマンス4、効率4）、8 GB、ファンレス、macOS 26.5.2。これをローエンドの[[Aggregator|アグリゲーター]]として扱います。
    -   タイミング中、バックグラウンドスワップは1.4〜1.8 GiBでした。
    -   一部の構成では、実行ごとのノイズが10〜15%に達します。
-   **ワークロード:** 250〜350のleanXMSS署名を持つリーフをレート1/4で、n対1で外部レート1/4でマージ。マージ[[zk/proofs|証明]]は218〜248 KiBでした。
-   **メトリクス:** デッドライン = 最後のリーフ + マージ。スロットあたりのCPU = n x リーフ + マージ。
-   **転送されるもの:** サイクルカウント、テーブルサイズ、コミットされたワードは正確であり、プラットフォームに依存しません。時間は、このマシン上での比率としてのみ意味があります。

## 2. ベースライン、および1つの子を検証するコスト

マージ内で1つの250署名の子を検証するには186.8k VMサイクルかかり、その子の[[WHIR-proof|WHIR証明]]オープニングがその55%を占めます（検証済み）。

**ベースライン（検証済み）。**

-   **リーフ集約:** N個のleanXMSS署名は、署名あたり186.5回のKeccak呼び出しで、約18.5k + 805.7 Nサイクルかかります。
    -   N = 1,500の場合、READMEと完全に一致します: 1,227,023サイクル、2^26.993のコミットされたワード、265.1 KiBの[[zk/proofs|証明]]。
-   **マージ:** 250署名リーフ上のn個の子は、約19.4k + 186.8k nサイクルかかります。
    -   READMEの2対1[[Recursive-verification|再帰的検証]]の数値（542,049サイクル）は再現されませんでした。900署名リーフで438,675を測定しました。
-   **M2でのタイミング:** 250署名リーフは約1.0秒で[[zk/prover|証明]]されます。mu 25でのマージは、コミットされたワードあたり35〜44 nsで[[zk/prover|証明]]されます。
-   **今日のバッチ処理なし:** マージゲストは、すべての子のスタックされた[[KZG-commitment|コミットメント]]に対して、完全な5レベルの[[WHIR-proof|WHIR証明]]オープニングを実行します。

**マージゲスト内の子要素あたりのコスト**（検証済み; 正確なプロファイラ属性、250署名リーフ、レート1/4）：

| コンポーネント | 子要素あたりのサイクル数 | 割合 |
| --- | --- | --- |
| WHIRオープニング、レベル0 | 56,931.5 | 30.5% |
| WHIRオープニング、レベル1 | 18,815.5 | 10.1% |
| WHIRオープニング、レベル2〜4、テールおよびセットアップ | 27,375.5 | 14.7% |
| Keccak GKR | 35.8k | 19.2% |
| テーブルサムチェック | 12.1k | 6.5% |
| ターミナルウェイト | 11.3k | 6.0% |
| バスGKR | 9.6k | 5.1% |
| リングスイッチとクレームバッチ処理 | 6.1k | 3.3% |
| その他（残余、派生） | 約8.8k | 4.7% |
| 合計 | 186,807.5 | 100% |

レート1/4の[[WHIR-proof|WHIR証明]]ラダーは、各レベルで112、45、28、21、16のクエリと17のグラインディングビットで6、4、4、4、4に[[zk/Folding|フォールディング]]します。

**2つの観測（検証済み）。**

-   **Merkleハッシュ化**は子要素あたりのサイクルの12.4%ですが、その5,188回のKeccak呼び出しの78.7%を占めます。ハッシュの変更は、サイクルよりもKeccakカウントをはるかに大きく変動させるでしょう。
-   **JUMP行:** 子要素あたり12,665行あります。
    -   9,300行（73%）は`assert_in_k`サブフィールド（パッキング）チェックによるものです。
    -   1,488行はランタイム`match`ディスパッチによるものです。
    -   ループは567行しか占めないため、ループアンローリングでこのテーブルを大幅に縮小することはできません。

## 3. ハッシュベースの[[cryptography/accumulation|アキュムレーション]]に対する負の結果

私たちがコストを計算した3つの[[cryptography/accumulation|アキュムレーション]]設計のいずれも、[[Aggregator|アグリゲーター]]内での[[Recursive-verification|再帰的検証]]を上回ることはありませんでした。それぞれ、チューニングでは埋められない差で目標を達成できませんでした。

**D1: 署名検証を直接[[zk/Folding|フォールディング]]する（WARPスタイルのPESAT / [[R1CS-Constraint|R1CS]]）。**

-   1つのleanXMSS検証は186回のKeccak-f順列を実行します。ビットレベルのエンコーディングには、少なくとも7.1Mの[[R1CS-Constraint|R1CS制約]]が必要です（推測）。
-   WARPの研究コードは、このマシン上の[[Goldilocks-field|Goldilocks体]]で、制約あたり約0.26 usの限界[[zk/prover|証明]]レートを測定しています。これは署名あたり約1.9秒に相当します。
-   leanVMは署名あたり約4.1 msを費やすため、D1は約450倍遅くなります（検証済みレートから推測）。理想的な64方向のビットパッキングでも約29 msかかり、それでも7倍です。

**D2: leanVMのステップ関係全体を[[zk/Folding|フォールディング]]する。**

-   WARPの[[zk/prover|証明]]はwitness要素あたり約260 nsかかります。leanVMはリーフ全体をコミットされたワードあたり約55 nsで[[zk/prover|証明]]します。両方ともM2で検証済みです。
-   この4.7倍のギャップは、バスとKeccak GKR引数がPESATとして表現される前、そして最終的なデサイダーの前から存在します（推測）。

**D3-S: マージ全体で子要素の[[WHIR-proof|WHIR証明]]近接性クレームを[[cryptography/accumulation|アキュムレーション]]する。**

-   子のレベル0オープニングは回路内で約57kサイクルかかります。レベル1以上は約46kサイクルかかります（検証済み）。
-   [[cryptography/accumulation|アキュムレーション]]ステップは、レベル0で自身の[[cryptography/accumulation|アキュムレーター]]を再オープンする必要があります。最大46kを遅延させるために約57kを支払うため、すべての子要素で損失が発生します（検証済みカウントから推測）。

**WARP参照点（検証済み）。**コミット655e7d5のWARP研究コードは、BLS12-381スカラーフィールド上でM = 2^16の8インスタンスを[[cryptography/accumulation|アキュムレーション]]しました。

-   [[zk/prover|証明]] 1.16秒;
-   検証 1.48ミリ秒;
-   決定 141ミリ秒;
-   [[zk/proofs|証明]] 189 KB。

WARPには大きなフィールドが必要です。leanVMのwitnessはGF(2^64)に存在し、GF(2^192)でチャレンジされます。WARPの著者は、小さなフィールド上での線形時間[[zk/Folding|フォールディング]]を未解決の問題として挙げています。

**WARPの研究コードに関する注意。**WARPの研究コードを実行中に、重要と考える実装上の問題に気づきました。WARPの著者には私的に報告しており、彼らからの返答があり次第、ここで説明します。これが上記のWARPレートを変更するとは予想していません（推測）。

## 4. 子要素のオープニングのバッチ処理 (B’-L1)

レベル1以降のすべての子要素で共有される1つの[[WHIR-proof|WHIR証明]]オープニングは、子要素あたり32.8kサイクル（17.6%）を節約します。しかし、1,500署名の場合、デッドラインではベースラインの最適な構成よりも2.4%遅くなります。

**設計。**

-   各リーフは独自の[[WHIR-proof|WHIR証明]]レベル0ラウンドを実行し、停止してレベル1のコードワードを保持します。
-   マージは、今日と同様に各子のレベル0ラウンドを検証します。
-   次に、子要素のレベル1ワードを余分なインターリーブ行としてスタックする仮想ワード上で1つのオープニングを実行します。これにはk = ceil(log2 n)個の追加の[[zk/Folding|フォールド]]変数が使用されます。
-   レベル1以降、クエリカウントと17ビットグラインディングは変更されません。これはleanVM自身のパラメータ探索と照合して確認しました。

**健全性スケッチ（推測、証明ではない）。**マージを1つのIOPとして扱います: n個の子プレフィックス、次にBCSでコンパイルされた1つのバッチサフィックス。バッチトランスクリプトは、すべての子のステートメント、ルート、およびクレームによってシードされます。各ラウンドごとの遷移は、leanVMの遷移ごとの境界またはより強力な境界を維持します。ただし、以下の条件を満たす場合です。

1.  スタックされたレベル1ワードは、1つのインターリーブされたコードワードとして分析され、そのJohnsonリストサイズL_1はアルファベットに依存しません。
2.  2^{4+k}行の[[zk/Folding|フォールディング]]には、leanVMがすでに依拠している相互相関合意の結果（Jo 2026/891、Thm 4.4）が使用され、そのエラーは行数に依存しません。
3.  バッチ処理チャレンジ $\beta$ は、すべての子のルートとクレームが吸収された後にのみ引き出されます。

唯一の新しい遷移は $\beta$ です。

-   共通の大きなセットでスタックされたワードと一致するタプルは、その子のリストに各子コンポーネントを持ちます。
-   したがって、結合リスト内のすべてのタプル（最大L_1個）について、結合されたクレームエラーは $\beta$ の非ゼロ多線形多項式です。
-   結合リストに対するユニオンバウンドは、以下を与えます。

$\Pr[\text{escape at } \beta] \le \frac{k \cdot L_1}{|\mathbb{E}|} \approx 2^{1.6 + 9.4 - 192} = 2^{-181} \quad (k = 3)$

落とし穴は、個々のリストに対するユニオンです。これはL_1^n個のタプルを与え、n = 8の場合、128ビットターゲットを下回る約2^{-114}しかありません。

**測定コスト。**私たちは健全性ではなく、コストを正確にエミュレートしました。UNSOUNDゲストバリアント（V6）は、各子のレベル1 Merkleオープニングを共有位置で行います。これは、バッチが実際の値を提供するはずの場所でダミー値を使用し、バッチトランスクリプト、k個の追加の[[zk/Folding|フォールド]]ラウンド、および子ごとの組み合わせ作業を追加します。

| 数量 | 値 | ステータス |
| --- | --- | --- |
| 子要素あたり節約されるサイクル数 | 32,835 (186,873の17.6%) | 検証済み (n = 2〜8の傾き) |
| 新しい子要素あたりの作業 | 511.5サイクル | 検証済み (プロファイル済み) |
| 子要素あたり節約されるKeccak呼び出し数 | 少なくとも1,134 (約22%) | 検証済み (以前のバリアント) |
| リーフ時間節約 (レベル1〜4は実行されない) | 0.103秒 | 測定されたトレーススパンから推測 |
| デッドラインでのバッチ処理されたネイティブオープナー | 0.11秒 | 推測 |
| デッドラインまで子要素あたり保持されるレベル1データ | 約0.45 GiB | 推測 |

**ゲート結果。**タイミングの前に、ルールを固定しました。各側は1,500署名に対するより低いデッドライン構成で比較され、B’-L1はデッドラインまたはスロットあたりのCPUを少なくとも15%削減する必要があります。

| 構成 | 側 | マージmu | リーフ (秒) | マージ (秒) | デッドライン (秒) | スロットあたりのCPU (秒) |
| --- | --- | --- | --- | --- | --- | --- |
| 6 x 250 | ベースライン | 26 | 0.976 | 2.132 | 3.108 | 7.988 |
| 6 x 250 | B’-L1 | 25 | 0.873 | 1.305 | 2.288 | 6.653 |
| 5 x 300 | ベースライン | 25 | 1.059 | 1.176 | 2.235 | 6.471 |
| 5 x 300 | B’-L1 | 25 | 0.956 | 1.235 | 2.301 | 6.125 |

テーブルの読み方:

-   リーフとマージの時間は、6回の実行のプールされた中央値です（検証済み）。B’-L1の行は、リーフあたり0.103秒を減算し、0.11秒のオープナーを加算します。
-   **ベスト対ベスト**（ベースライン5 x 300、B’-L1 6 x 250）: B’-L1はデッドラインで2.4%遅く、CPUを2.8%多く使用します。
-   **最も有利な仮定**（無料のオープナー、最大のリーフ節約、セクション5のレーンモデルマージ時間）: デッドラインで最大11.4%、CPUで最大10.5%のゲインです（推測）。

固定された6 x 250の場合、B’-L1はデッドラインを26%削減します。そのほとんどはノードをmu 25に維持することによるものであり、ベースラインはより大きなリーフを選択することでより安価にそこに到達します。

## 5. コミットされたサイズ、レーン、およびmuステップ

このマシンでのマージの[[zk/prover|証明]]時間を決定する2つの要因は、1つのmu内のコミットされたレーン数と、ノードがmu 25からmu 26に移行する際の大きなジャンプです（検証済み）。

**leanVMが[[KZG-commitment|コミットメント]]のサイズを決定する方法**（df7d122のソースから検証済み）。各テーブルは2のべき乗にパディングされ、スタックされたwitnessは以下のようになります。

$\mathrm{TC} = 4 \cdot 2^{h} + 2^{k_{bc}} + 2^{6+\tau_K} + \sum_t w_t \cdot 2^{\tau_t}, \quad \tau_t = \lceil \log_2 \mathrm{rows}_t \rceil, \quad \mu = \max(\lceil \log_2 \mathrm{TC} \rceil, 15)$

-   **幅:** XOR、MUL、DEREFではwは15、SETでは8、JUMPでは14、KECCAKでは26です。
-   **その他の用語:** hはメモリの高さ、k$_{bc}$はバイトコードカウンターの高さです。
-   **レーン:** [[zk/prover|証明]]者は、2^(mu-6)ワードのceil(TC / 2^(mu-6))レーンのみを[[KZG-commitment|コミット]]し、ゼロテールをエンコードすることはありません。
-   **チェック:** 正確な行数から再計算されたTCは、チェックした8回の実行すべてで表示された値と一致しました。

**mu 25でのノード容量（検証済み）。**2のべき乗を超えることで、w x 2^tauワードが一度に追加されるため、容量は段階的に増加します。

| リーフサイズ（署名） | mu 25でのベースラインの子要素 | mu 25でのB’-L1の子要素 | mu 26での最初のファンイン |
| --- | --- | --- | --- |
| 250 | 5 | 6 | ベースライン6: JUMPが2^16行を超える（+14 x 2^16ワード）。B’-L1 7: メモリが2^21を超える。 |
| 350 | 5 (正確に2^25ワード) | 6 | ベースライン6; B’-L1 7 |

mu 25に留まる最大のリーフは350署名です。375署名リーフはmu 26です。25ステップでテストしました。

**mu-26プレミアム（このマシンで検証済み）。**2つのほぼ制御されたペアがジャンプを示しています。

| ペア | mu 25実行 | mu 26実行 | コミットされたワード | 時間比率 |
| --- | --- | --- | --- | --- |
| ベースライン、各6回実行 | 5 x 300: 1.176秒 | 6 x 250: 2.132秒 | 33.55M vs 34.60M | 1.81 |
| ベースライン、単一実行 | 5 x 350: 1.163秒 | 6 x 350: 1.637秒 | 33.55M vs 34.60M | 1.41 |

最初のペアの**ステージ属性**（それぞれ2回のトレースされた[[zk/prover|証明]]；スパンは検証済み、原因は推測）：

| ステージ | mu 25 (ms) | mu 26 (ms) | 比率 |
| --- | --- | --- | --- |
| WHIRイテレーション、レベル0〜3 | 240.1 | 529.7 | 2.21 |
| コミット（エンコードとMerkle） | 365.5 | 625.5 | 1.71 |
| バス、GKR以外 | 63.2 | 203.5 | 3.22 |
| 実行 | 41.1 | 130.9 | 3.18 |
| バスGKR | 94.8 | 132.5 | 1.40 |
| Keccak削減 | 168.5 | 192.5 | 1.14 |
| テーブルサムチェック、リングスイッチ、witnessビルド、テール | 139.4 | 147.2 | 1.06 |
| ステージ合計 | 1,112.6 | 1,961.8 | 1.76 |

[[zk/prover|証明]]スパンの合計は1,130 msと1,975 msです。

**属性の読み取り（推測）。**

-   **構造部分は約290 msです。**[[WHIR-proof|WHIR証明]]の最初の[[zk/Folding|フォールド]]後のすべては2^(mu-6)エントリのオブジェクトで動作するため、[[WHIR-proof|WHIR証明]]行の倍増は予想されます。
-   **残りはメモリコストのように見えます。**
    -   [[KZG-commitment|コミット]]は、約8%増加するはずです（レーン数 x レーンあたりのエンコード長: 33 x 2^22 x 22 対 64 x 2^21 x 21）。しかし、71%増加しました。
    -   バスと実行は3倍以上増加しましたが、サイクルは19%増加しました。
    -   約500 msの超過はメモリシステムコストと解釈されます。8 GBマシンで3.1 GBのフットプリントがあり、完全なコードワードがメモリに保持されています（Appleシリコン上のleanVMのストアモード）。
-   **より大きなマシンでは、この現象は少ないかもしれません。**そのプレミアムは構造的な0.3秒に近いかもしれません。私たちはそれをテストできませんでした。

**構成ルール。**このハードウェアでは、マージノードがmu 25に留まるようにリーフサイズとファンインを選択します。

-   最大350署名のmu-25リーフでは、ベースラインのmu-25ノードは最大5つの子、つまり1,750署名を保持します。
-   1,500署名の場合、6 x 250の代わりに5 x 300を使用します。デッドラインは3.11秒から2.24秒に（-28%）、スロットあたりのCPUは7.99秒から6.47秒に（-19%）短縮され、プロトコル変更はありません（検証済み入力）。

**トポロジツールへの影響（推測）。**ファンインとリーフサイズに線形なコストモデルは、muステップを平滑化します。leanBenchのトポロジエクスプローラは、この種の機械ごとの線形フィットを使用します。

-   このようなモデルは、mu境界のすぐ下のマージを過大予測し、すぐ上のマージを過小予測します。このマシンでは約0.5〜1秒の誤差が生じます。
-   ステップを認識するモデルは、上記のTC式を使用できます。テーブルごとの行数を数え、各テーブルをパディングし、合計し、その後、コミットされたレーンごとに課金し、muごとの項を加算します。

## 6. バッチ処理が依然として重要となる可能性のある箇所

B’-L1は、mu-25ノード内にさらに1つの子を収容します。これは、ベースラインのmu-25ノードが保持するよりも多くの署名をマージする必要がある[[Aggregator|アグリゲーター]]にのみ役立ちます（推測）。

-   **ウィンドウは1,751から2,100署名です。**最大350署名のリーフでは、ベースラインのmu-25ノードは1,750署名を保持し、B’-L1ノードは2,100署名を保持します。この範囲では、B’-L1はmu-26プレミアムを回避し、このマシンでは約0.5〜1.0秒の価値があります。
-   **メモリが不利に働きます。**B’-L1は、デッドラインまで子要素あたり約0.45 GiBのレベル1データを保持します。6つの子と350署名リーフ（3.3 GBのフットプリント）は、8 GBマシンの70%を超えます。
-   **これを採用するコストは現実的です。**部分的なリーフ[[zk/proofs|証明]]、新しいバッチオープナー、ゲストの変更、および完全な健全性[[zk/proofs|証明]]が必要です。
-   **私たちのワークロードはウィンドウの下にあります。**[[Aggregator|アグリゲーター]]あたり512および1,500署名を仮定しました。委員会が単一の[[Aggregator|アグリゲーター]]を1,750を超えてプッシュする場合、このレジームが関連し、上記の設計と健全性スケッチが開始点となります。

## 7. 制限事項

-   **1台のマシン。**1.4〜1.8 GiBのバックグラウンドスワップを持つ8 GBファンレスM2で、一部の構成では10〜15%のノイズがあります。B’-L1の評価はこのノイズを乗り越えます。mu-26プレミアムのサイズは、他のハードウェアには引き継がれない可能性があります。
-   **1つのコミット。**leanVM df7d122（2026年11月6日）。その計画されているハッシュ変更、RISC-V ISA、および[[Zero-Knowledge-Proof|ゼロ知識]]は、それぞれこれらの数値を変動させるでしょう。
-   **B’-L1はコストのためにエミュレートされたもので、構築されたものではありません。**V6ゲストは設計上不健全です。ダミー値と制約のない共有位置を使用しています。そのリーフ節約はネイティブトレーススパンによるものであり、オープナーコストは推定値です。
-   **健全性引数は、ラウンドごとの境界のスケッチであり、[[zk/proofs|証明]]ではありません。**これは、leanVM自身のレジームが主張どおり健全であると仮定しています。Johnson境界、遷移あたり128ビット、17ビットグラインディングです。
-   **D1とD2は、そのレートについてWARPの素体研究コードに依拠しています。**二元体または小フィールドの[[zk/Folding|フォールディング]]スキームはこれらの定数を変更する可能性がありますが、D3-Sの引数は変更しません。
-   **スコープ外:** [[gossipsub|ゴシップ]]ホップを介した[[Recursive-verification|再帰的検証]]、および[[Zero-Knowledge-Proof|ゼロ知識]]。

## 8. 読者への質問

1.  **leanVM開発者へ:** [[KZG-commitment|コミット]]、バス、実行時間におけるmu-26のジャンプは予想されますか？リビルドモード（REBUILD\_OVER\_STORE）は、より多くのRAMを搭載したマシンでそれを変更しますか？cc [@tcoratger](https://ethrese.ch/u/tcoratger)
2.  **サブフィールドチェック:** `assert_in_k`チェック（子要素あたり9,300 JUMP行）は健全にバッチ処理できますか？ランダムなK線形結合は、繰り返しあたり約64ビットしか与えません。
    cc Tom Wambsgans
3.  **EF / leanSpecへ:** どのような集約間隔と、[[Aggregator|アグリゲーター]]あたり何個の署名を目標とすべきですか？私たちは1、2、または4秒間隔と512または1,500署名を仮定しました。
4.  **パスB:** 二元体書き換え後も[[zk/Folding|フォールディング]]は検討されていますか、またツリーのどのホップについてですか？cc [@tcoratger](https://ethrese.ch/u/tcoratger)
5.  **leanBenchメンテナーへ:** ステップを認識するコストモデル（セクション5）は、トポロジエクスプローラで有用でしょうか？[@unnawut](https://ethrese.ch/u/unnawut)
6.  **より大きなマシン:** より大きなLinuxマシンをお持ちの方は、以下のスクリプトで構成比較を再実行できます。

## 9. 関連作業

私たちは、1つの[[Recursive-verification|再帰的検証]]ノードの子要素全体で[[WHIR-proof|WHIR証明]]またはFRIオープニングをバッチ処理する先行研究を見つけられませんでした。また、テーブルパディングで集約ツリーのコストをモデル化する研究も見つかりませんでした。

これは、2026年11月8日時点での以下の情報源のターゲット検索に基づいています。網羅的な調査ではありません。

-   **ハッシュベースの[[cryptography/accumulation|アキュムレーション]]。**
    -   [Accumulation Without Homomorphism](https://eprint.iacr.org/2024/474): 境界付き深さ、任意の線形コード。
    -   [Arc](https://eprint.iacr.org/2024/1731): 無制限の深さ。リード・ソロモン近接性クレームをIOPベースのPCDのほぼドロップインとして[[cryptography/accumulation|アキュムレーション]]します。
    -   [WARP](https://eprint.iacr.org/2025/753): 線形時間[[zk/prover|証明]]者、直線抽出。
    -   D3-Sは、leanVM内でのArcスタイルの使用に関するコストチェックです。
    -   FACSはWARP著者の講演で言及されていますが、論文は見つかりませんでした。
-   **小フィールドおよび二元体上での[[zk/Folding|フォールディング]]。**WARPの著者は、小フィールド上での線形時間[[zk/Folding|フォールディング]]を未解決の問題として挙げています。Neo、SuperNeo、PikkuFoldは格子ベースです。Accordionは[[zk/Folding|フォールディング]]を[[KZG-commitment|KZG]]デサイダーとバッチ処理するため、[[Post-Quantum|ポスト量子]]ではありません。
-   **遅延クレームを伴う二元体[[Recursive-verification|再帰的検証]]。**クローズされたPlonky3プルリクエスト（2026年10月、現在は別のリポジトリに移動）は、二元体上でFlock[[zk/proofs|証明]]を[[Recursive-STARK|再帰的]]に処理します。
    -   各ノードは、内部回路の行列評価を公開クレームとして遅延させます。同じ行列に関するクレームは子要素全体で[[zk/Folding|フォールド]]され、ルートはそれぞれを1回評価します。
    -   これはB’-L1とは異なるオブジェクトを遅延させます。PCS近接性オープニングではなく、行列評価クレームです。
    -   その2対1 XMSSノードは、8スレッドのRyzen 9 9950X3Dで36.9秒かかったため、今日のleanVMのレイテンシ比較対象ではありません。
-   **1つの[[zk/proofs|証明]]内のバッチ処理されたオープニング。**共有クエリ位置で複数のコミットされたオラクルを開くことは標準的な慣行です。
    -   例: Plonky2のバッチFRI。最近の[[STARK|STARK]][[zk/prover|証明]]者における共有クエリインデックスを持つ高さごとのFRIグループ。Zirenにおける多くの[[KZG-commitment|コミットメント]]に対する1つの[[WHIR-proof|WHIR証明]]オープニング。
    -   B’-L1は、レベル1以降、[[Recursive-verification|再帰的検証]]ノードの子要素全体に同じアイデアを適用します。
-   **集約トポロジ。**
    -   [leanBench](https://github.com/leanEthereum/leanBench)は、ファンイン2、4、8のleanVMツリーを、125、250、500署名リーフ上でレート1/4で測定します。
    -   その[トポロジエクスプローラ](https://bench.leanroadmap.org/topology.html)は、機械ごとの線形フィットから実現可能性を予測します。セクション5は、そのようなフィットがmuステップを見落としていることを示唆しています。
    -   [イーサリアムの[[Post-Quantum|ポスト量子]]コンセンサスの調査](https://hackmd.io/@goatresearch/H1G2tOCwGx)（2026年8月）は、最適な集約ツリー構築を未解決の問題として挙げています。
-   **ハッシュベースの[[ZK-SNARKs|SNARK]]に対する[[Recursive-verification|再帰的検証]]の健全性。**直線抽出器からのPCD。算術化されたランダムオラクルからのPCD。ROMにおける相対化された簡潔な引数の不可能性。
-   **フレーミング。**CoratgerとSettyによるEF設計研究（パスA対パスB）は、この投稿が測定する問題を提起しました。

## 10. 再現性

上記のすべての数値は、leanVMコミット（df7d122abbe25cf12e5c8ae992ce6d3505f75372）、コマンドライン、繰り返し回数、および中央値であるかどうかを記録しています。

-   **測定ブランチ:** マージゲスト（crates/rec\_aggregation/guests/lean\_ethereum.py）のローカル編集と、環境ゲート付きテーブル出力。UNSOUNDバリアントはコストをカウントするためだけに存在します。
-   **マージタイミング:** `leanvm recursion --n <n> --xmss-per-leaf <N> --leaf-log-inv-rate 2 --log-inv-rate 2 --repeat 3 --tracing`、30秒のスリープと2回のインターリーブパスを使用。
-   **リーフタイミング:** `leanvm aggregate --xmss <N> --log-inv-rate 2 --repeat 3`。
-   **スクリプト、差分、ログ:** [GitHub - aryaethn/leanvm-accum-study: Measurements comparing hash-based accumulation with leanVM recursion for PQ signature aggregation (cost study, includes UNSOUND measurement-only variants) · GitHub](https://github.com/aryaethn/leanvm-accum-study)。このバンドルには、df7d122に対する全10個の測定ブランチの差分、私たちのスクリプト、パースされたテーブル、およびタイミング実行の生ログが含まれています。そのパーサーは、バンドルされたログからタイミングおよびステージテーブルをバイト単位で再生成します。

## 参考文献

-   WARP, Linear-Time Accumulation Schemes: [Linear-Time Accumulation Schemes](https://eprint.iacr.org/2025/753)
-   Arc, Accumulation for Reed-Solomon Codes: [Arc: Accumulation for Reed--Solomon Codes](https://eprint.iacr.org/2024/1731)
-   Accumulation Without Homomorphism: [Accumulation without Homomorphism](https://eprint.iacr.org/2024/474)
-   PQ Signature Aggregation, a Folding Approach (EF design study): [Post Quantum Signature Aggregation: a Folding Approach](https://ethrese.ch/t/post-quantum-signature-aggregation-a-folding-approach/23639)
-   EIP-8292 PQ Attestation Aggregators: [EIP-8292: Post-Quantum Attestation Aggregators](https://eips.ethereum.org/EIPS/eip-8292)
-   leanVM repository: [GitHub - leanEthereum/leanVM: Minimal zkVM for Ethereum. · GitHub](https://github.com/leanEthereum/leanVM)
-   leanBench: [GitHub - leanEthereum/leanBench: Performance benchmarks for leanSig and leanMultisig across hardware. · GitHub](https://github.com/leanEthereum/leanBench)
-   leanBench topology explorer: [leanBench · topology explorer](https://bench.leanroadmap.org/topology.html)
-   WARP research code: [GitHub - compsec-epfl/warp · GitHub](https://github.com/compsec-epfl/warp)
-   Plonky3 native recursion for FRI, WHIR and Flock (PR 2533): [feat: native recursion for FRI, WHIR and Flock proofs, with XMSS and SLH-DSA signature aggregation by tcoratger · Pull Request #2533 · Plonky3/Plonky3 · GitHub](https://github.com/Plonky3/Plonky3/pull/2533)
-   Flock: [Flock: Fast Proving for Batch Boolean Computations](https://eprint.iacr.org/2026/1329)
-   Plonky2 whitepaper: [https://docs.rs/crate/plonky2/latest/source/plonky2.pdf](https://docs.rs/crate/plonky2/latest/source/plonky2.pdf)
-   lambda\_vm batched FRI per height (PR 994): [Prove-and-retire prover (Approach 1), per-table and batched by jotabulacios · Pull Request #994 · yetanotherco/lambda\_vm · GitHub](https://github.com/yetanotherco/lambda_vm/pull/994)
-   Ziren: [Ziren: Succinct Arguments for MIPS32 Execution](https://eprint.iacr.org/2026/2330)
-   From Aggregate Signatures to Aggregate Proofs (survey): [From Aggregate Signatures to Aggregate Proofs: A Survey of Ethereum's Post-Quantum Consensus - HackMD](https://hackmd.io/@goatresearch/H1G2tOCwGx)
-   WHIR: [WHIR: Reed–Solomon Proximity Testing with Super-Fast Verification](https://eprint.iacr.org/2024/1586)
-   Ligerito: [Ligerito: A Small and Concretely Fast Polynomial Commitment Scheme](https://eprint.iacr.org/2025/1187)
-   Interleaving Stability for Mutual Correlated Agreement and Curve Decodability: [Interleaving Stability for Mutual Correlated Agreement and Curve Decodability](https://eprint.iacr.org/2026/891)
-   On Proximity Gaps for Reed-Solomon Codes: [ECCC - TR25-169](https://eccc.weizmann.ac.il/report/2025/169/)
-   Security Bounds for PCD from Straightline Extractors: [Security Bounds for Proof-Carrying Data from Straightline Extractors](https://eprint.iacr.org/2023/1646)
-   Proof-Carrying Data From Arithmetized Random Oracles: [Proof-Carrying Data From Arithmetized Random Oracles](https://eprint.iacr.org/2023/587)
-   Relativized Succinct Arguments in the ROM Do Not Exist: [Relativized Succinct Arguments in the ROM Do Not Exist](https://eprint.iacr.org/2024/728)
-   Neo and SuperNeo: [Neo and SuperNeo: Post-quantum folding with pay-per-bit costs over small fields](https://eprint.iacr.org/2026/242)
-   PikkuFold: [PikkuFold: Efficient Folding in a Few Kilobytes](https://eprint.iacr.org/2026/1809)
-   Accordion: [Accordion: Efficient Batch Proving via Algebraic Folding](https://eprint.iacr.org/2026/2160)

*1 post - 1 participant*

[Read full topic](https://ethresear.ch/t/folding-vs-full-verifier-recursion-for-pq-signature-aggregation-in-leanvm-measurements-and-negative-results/26227)
