---
title: EIP-8288における量子耐性署名集約の探求
original_title: Exploring post-quantum signature aggregation for EIP-8288
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/exploring-post-quantum-signature-aggregation-for-eip-8288/26261
author: manel1874
date: '2026-11-16'
category: Cryptography
tags:
  - cryptography
  - zk
  - signatures
  - post-quantum
  - scaling
  - wallet
  - account-abstraction
  - research
topic_id: '26261'
translated_at: '2026-11-17'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Exploring post-quantum signature aggregation for EIP-8288](https://ethresear.ch/t/exploring-post-quantum-signature-aggregation-for-eip-8288/26261) — manel1874 (2026-11-16)

Manuel B. Santos ([@manel1874](https://ethresear.ch/u/manel1874)) [MultiVM Labs](https://www.multivmlabs.com/)

# 動機

今日のウォレットエコシステムには、さまざまなセキュリティモデルに依存する多数の機能が含まれています。これらの機能は、しきい値署名 (threshold signing)、鍵導出、またはハードウェア署名者 (hardware signers) に適合する実装をサポートするために、古典的な署名を必要とします。これらの特性は、[[glossary/post-quantum-signatures|量子耐性署名]]スキームには一般的に存在しませんが、いくつかの提案されているスキームはこれらをサポートしています。例としては、[Efficient Threshold ML-DSA](https://www.usenix.org/system/files/conference/usenixsecurity26/sec26_prepub_celi.pdf)、[Threshold Raccoon](https://csrc.nist.gov/presentations/2024/threshold-raccoon)、[Falcon on Ledger Nano S+](https://github.com/ZKNoxHQ/ZKNOX-HW-FALCON)、およびウォッチオンリーウォレット (watch-only wallets) 向けの公開子鍵導出 (public child-key derivation) をサポートする[Raccoon-G HD wallets](https://eprint.iacr.org/2026/380)などがあります。

イーサリアムはハッシュベースのアプローチを採用しており、これらの異なるユースケースを直接サポートする能力が一般的に欠けています。しかし、[[glossary/EIP-8141|EIP-8141]]と[[glossary/EIP-8288|EIP-8288]]の組み合わせは、ウォレットのニーズに応じて異なる署名スキームをサポートするための非常に機敏なパスを提供します。[[glossary/EIP-8141|EIP-8141]]はプログラム可能な[[glossary/account-validation|アカウント検証]]を提案し、一方、[[glossary/EIP-8288|EIP-8288]]は署名と証明の依存関係の[[glossary/Recursive-STARK|再帰的STARK]][[glossary/signature-aggregation|署名集約]]を提案しています。これら2つのドラフトを組み合わせることで、ウォレットは自身の署名スキームを選択でき、ネットワークは共通の証明を[[glossary/verification|検証]]できるようになります。

本稿では、5つの異なる署名スキーム（Falcon-512、[[glossary/ML-DSA|ML-DSA]]-44、[[glossary/FORS|FORS]]、Raccoon-128、Raccoon-G）を[[glossary/STARK|STARK]]証明の下で実行し、そのアプローチにおける[[glossary/proving|証明生成]]、証明サイズ、および[[glossary/verification|検証]]のコストを測定します。

# 実装

この（実験的な）実装は[こちら](https://github.com/multivmlabs/leanvm-pq-signatures)で確認できます。Falcon、[[glossary/ML-DSA|ML-DSA]]、および両方のRaccoonバリアントは、[`06e5c9cd6981103786f9d0a17324241b559a50d3`](https://github.com/leanEthereum/leanVM/tree/06e5c9cd6981103786f9d0a17324241b559a50d3)に固定された[[glossary/leanVM|leanVM]]の実験的な`riscv-exploration`ブランチを使用しています。Falconは[PR #490](https://github.com/leanEthereum/leanVM/pull/490)で導入された実装を再利用しています。一方、[[glossary/FORS|FORS]]は[`575df819d9c857f38068cecf7b1640e0ce4bfb29`](https://github.com/leanEthereum/leanVM/tree/575df819d9c857f38068cecf7b1640e0ce4bfb29)のPython leanISAゲストを使用しています。現状では、[[glossary/FORS|FORS]]は専用のKeccak回路により優れたパフォーマンスを達成しています。

RISC-VおよびleanISAベースの実装は、以下の図にまとめられている[[glossary/leanVM|leanVM]]がサポートするアプローチに従っています。

[![risc-v-leanISA-flow](https://ethresear.ch/uploads/default/optimized/3X/d/c/dcb49780fd21ce29ab6280d5883f63a3758cedf2_2_322x500.png)](https://ethresear.ch/uploads/default/original/3X/d/c/dcb49780fd21ce29ab6280d5883f63a3758cedf2.png "RISC-VとleanISAのフロー")

*図1: leanVMの証明生成フロー（RISC-Vは左ブランチ、leanISAは右ブランチ）。*

4つの署名（Falcon、[[glossary/ML-DSA|ML-DSA]]、[[glossary/FORS|FORS]]、Raccoon-128）の[[glossary/verification|検証]]メカニズムはすべて1つのleanSTARK証明内に収まります。しかし、Raccoon-Gの[[glossary/verification|検証]]は[[glossary/leanVM|leanVM]]のコミットメント容量上限を超えており、約8億3900万witnessワードに対し、上限は2億6800万ワードです。次に、1つのRaccoon-G署名[[glossary/verification|検証]]メカニズムのleanSTARK証明を作成するために採用されたアプローチを探ります。

## Raccoon-G検証アプローチ

Raccoon-Gの[[glossary/verification|検証]]メカニズムは、[\[PKPR24\]](https://eprint.iacr.org/2024/1291.pdf)のアルゴリズム3に記載されているオリジナルのRaccoonプロセスに従います。最もコストのかかるステップはステップ4であり、次のように要約できます。

y := A\\cdot z - c\_{poly}\\cdot T, \\tag{1}\\label{eq:full}

ここで、Aは9x9の多項式行列、zは署名コンポーネント、c\_{poly}はそのチャレンジ多項式、Tは丸められスケールされた公開鍵ベクトルです。検証者はステップ5で、署名ヒントhを使用してコミットメントベクトルw':= \\text{Round}(y) + hを計算し、次にc'\_{hash}=\\mathsf{ChalHash}(w', \\mu)を再構築します。ここで\\muは完全な公開鍵とメッセージを結合し、c\_{hash}は署名のチャレンジダイジェストです。

### マルチSTARK検証

前述の通り、署名[[glossary/verification|検証]]プロセス全体がleanVMのコミットメント容量上限を超えており、1つのleanSTARK証明に直接収めることは不可能です。したがって、[[glossary/verification|検証]]メソッドを異なるleanSTARK証明に分割し、それらを最終的なleanSTARKで集約することに焦点を当てます。

[\[PKPR24\]、アルゴリズム3](https://eprint.iacr.org/2024/1291.pdf)のステップ4が最もコストのかかる要素であるため、yの計算\\eqref{eq:full}を5つの行列行のセットに分割し、各行の関係を個別に1つのleanSTARKで証明します。より具体的には、次式で与えられる行列行rに対して、

y\_r=\\sum\_{j=0}^{8}A\_{r,j}\\cdot z\_j-c\_{poly}\\cdot T\_r, \\tag{2}\\label{eq:row}

(0,1)、(2,3)、(4,5)、(6,7)、(8,8)の5つの証明チェック行を作成します。各リーフleanSTARK証明は、プロバーから完全な署名\\sigmaと提案されたコミットメントベクトルwを受け取ります。そして、[[glossary/leanVM|leanVM]]内で、各インスタンスは[\[PKPR24\]、アルゴリズム3](https://eprint.iacr.org/2024/1291.pdf)のステップ4と5を除くすべてのステップを実行します。代わりに、次のことを行います。

1.  \\eqref{eq:row}に従って2つの行を再構築し、(w'\_i, w'\_j)を取得します。
2.  対応する提供されたw行、すなわち(w\_i, w\_j) == (w'\_i, w'\_j)との等価性をチェックします。

さらに、leanSTARK証明を結合し、異なる証明が異なるwitnessペア (\\sigma, w)を使用しないことを保証するために、各証明はバインディング要素D = H(\\sigma, w)を計算し、これを検証者に渡す必要があります。図2はこの最初のプロセスを要約しています。

[![matrix-split](https://ethresear.ch/uploads/default/optimized/3X/3/9/39947a234ddbfc9bae03d2b9028f70ab93069aa1_2_690x313.png)](https://ethresear.ch/uploads/default/original/3X/3/9/39947a234ddbfc9bae03d2b9028f70ab93069aa1.png "行列分割とSTARK証明要素")

*図2: 行列分割構造とSTARK証明要素。*

5つの[[glossary/STARK|STARK]]証明すべてを作成した後、これらは図3に示すようにMerkleツリー形式で集約されます。我々は[[glossary/leanVM|leanVM]]のネイティブバイナリ再帰回路を介して各部分を結合します。したがって、1つの署名に対して、5つの新しい証明が8つのパディングされたリーフスロットを占め、パディングのために最終証明を繰り返します。

受信者は、意図された公開鍵/メッセージペアとプロバーの信頼できないDから、期待される5つの出力をすべて再構築でき、その後完全な`Tree::verify`を実行します。これにより、署名\\sigmaと中間コミットメントwを見る必要なく、ルート、順序付けられた出力、および残りのすべての多項式クレームがチェックされます。

[![proof-aggregation](https://ethresear.ch/uploads/default/optimized/3X/4/f/4ff5b3addb75be363417244a4b2cf7a39edfac1e_2_690x269.png)](https://ethresear.ch/uploads/default/original/3X/4/f/4ff5b3addb75be363417244a4b2cf7a39edfac1e.png "複数のleanSTARK証明の最終的なleanSTARK証明への集約")

*図3: 複数のleanSTARK証明を最終的なleanSTARK証明に集約。*

# 実験結果

このセクションでは、[[glossary/leanVM|leanVM]]の下での代替署名の[[glossary/proving|証明生成]]と[[glossary/verification|検証]]のパフォーマンスをチェックするためにいくつかの実験を実行します。まず、バッチ署名のための単一[[glossary/STARK|STARK]]証明生成を探求し、次に実装された5つのカテゴリ（Falcon-512、[[glossary/ML-DSA|ML-DSA]]-44、[[glossary/FORS|FORS]]、Raccoon-128、Raccoon-G）それぞれについて、10、30、70、100の異なる署名を持つことの影響と限界をチェックします。

実験に使用したマシンは、24 GiB RAMを搭載したApple M4 Proでした。各実験では、1回のウォームアップ後、新しいプロセスで3つの新しい証明の中央値を取り、図に示されているバーは全範囲を示しています。また、セットアップとウォームアップを含むプロセスライフタイムのメモリピーク（RSS、Resident Set Size）を監視します。

## 直接バッチ

まず、単一の[[glossary/STARK|STARK]]でいくつの署名をバッチ処理できるかをチェックします。これはすべての署名を[[glossary/verification|検証]]し、順序付けられた鍵とメッセージにコミットします。上記の図1で説明されているように、検証者は自身の意図された公開記録から期待されるコミットメントを導出し、アプローチされたプログラムと証明パラメータをチェックする必要があります。このセクションでは、Raccoon-Gは1つの署名証明[[glossary/verification|検証]]に複数の[[glossary/STARK|STARK]]証明を必要とするため、省略します。

### プロバー

[![prover-overview](https://ethresear.ch/uploads/default/optimized/3X/c/7/c7a6328941d85ce48e968b3db02e6821a12b0ce4_2_641x500.png)](https://ethresear.ch/uploads/default/original/3X/c/7/c7a6328941d85ce48e968b3db02e6821a12b0ce4.png "プロバーの概要")

*図4: leanVMにおける直接バッチの証明生成コスト。バッチサイズが増加するにつれて、証明サイズ（左上）、証明生成時間（右上）、ピークプロバーメモリ（下）が変化する。*

上記の図からわかるように、分析した4つの代替署名について、**32個のFalcon**、**6個の[[glossary/ML-DSA|ML-DSA]]**、**1個の標準Raccoon**、および**（少なくとも）100個の[[glossary/FORS|FORS]]署名**をバッチ処理することができました。最初の3つのスキームの容量上限は、図5に示すように、2^{28}ワードのコミットされたwitnessの容量上限に関連しています。

[![capacity-efficiency](https://ethresear.ch/uploads/default/optimized/3X/e/9/e9f1721129a2c6aab7558a9e5b17fa664e4ef691_2_690x289.png)](https://ethresear.ch/uploads/default/original/3X/e/9/e9f1721129a2c6aab7558a9e5b17fa664e4ef691.png "容量効率")

*図5: leanVMにおけるwitness容量と署名あたりの証明生成コスト。左のパネルは2^{28}ワードのwitness予算の使用割合を示し、右はバッチサイズで割った証明生成時間を示す。*

最大のバッチが常に最適な動作点ではないことは興味深い観察です。Falconのwitnessは、28署名で約1億4500万ワードから29署名で2億4300万ワードに急増します。これは、図5に示すように、署名あたりの[[glossary/proving|証明生成]]時間の急増も正当化します。同様の急増は、[[glossary/ML-DSA|ML-DSA]]-44でも3署名と4署名の間で発生します。

一方、[[glossary/FORS|FORS]]は特殊なKeccakの恩恵を受けています。100署名のバッチでは、わずか1940万ワードと298.02 KiBの証明を使用しており、これは450 KiBの署名ペイロードを下回っています。

### 検証者

以下では、完全な直接証明の[[glossary/verification|検証]]を測定し、公開クレームの導出、セットアップ、ファイル読み取りは除外します。

[![direct-batch-verification](https://ethresear.ch/uploads/default/optimized/3X/5/1/51371978895868289e8b41d6ac47c563dde0fe6a_2_290x249.png)](https://ethresear.ch/uploads/default/original/3X/5/1/51371978895868289e8b41d6ac47c563dde0fe6a.png "直接バッチ検証")

*図6: leanVMにおける直接バッチSTARK検証時間。署名数の増加に伴う変化。*

## 再帰ツリー

次に、10、30、70、100の元の署名[[glossary/verification|検証]]手順を含む[[glossary/STARK|STARK]]ツリーを扱います。各リーフは小さな署名[[glossary/verification|検証]]ワークロードを証明し、以下のリーフ構造を持つバイナリツリーを選択しました。

| ワークロード | リーフあたりの作業 |
| --- | --- |
| Falcon, RISC-V | 10署名 |
| [[glossary/ML-DSA|ML-DSA]], RISC-V | 2署名 |
| [[glossary/FORS|FORS]], leanISA | 5署名 |
| Raccoon, RISC-V | 1署名 |
| Raccoon-G, RISC-V | 2行列行 |

### プロバー

[![recursive-trees](https://ethresear.ch/uploads/default/optimized/3X/b/9/b9eacf3cdeb76c749ef1eef09eeac2a95efbb2ce_2_623x500.png)](https://ethresear.ch/uploads/default/original/3X/b/9/b9eacf3cdeb76c749ef1eef09eeac2a95efbb2ce.png "再帰ツリー")

*図7: leanVMにおける再帰的STARK集約: 完全ツリーの証明生成作業（左）と集約サイズ（右）。点は3回の実行の中央値を示し、100署名でのRaccoon-Gは1回の完了実行を示す。エラーバーは範囲を示す。サイズには公開鍵とメッセージは含まれない。*

4つのRISC-V実装は同じネイティブ再帰機構で終了し、ルートは共通の再帰回路ファミリーを使用して子証明の[[glossary/verification|検証]]を証明します。したがって、そのサイズは主にそのルート回路とその証明パラメータに依存します。結果として、異なる署名アルゴリズムは、同様のサイズのルートを生成しながら、非常に異なる[[glossary/proving|証明生成]]作業を必要とします。

一方、[[glossary/FORS|FORS]]は異なるバックエンドと再帰的構成を使用しています。これは、sumcheck削減を伴うleanISA検証者ラッパーです。その最終パックには、333.13 KiBのルート証明と2.84 KiBの補助データが含まれています。したがって、ほとんどの違いはルート証明の構築に由来しており、これは実装の違いであり、[[glossary/FORS|FORS]]の集約が大きくなる固有の要件ではありません。

各署名スキームについて、ピークRSSはテストされた署名数全体でほぼ一定を保っています。リーフバッチと再帰マージは順次証明され、ツリーが成長するにつれて作業メモリの再利用が可能になります。したがって、これらの測定値は完全な証明パイプラインをカバーしていますが、ピークメモリ使用量は単一リーフの[[glossary/proving|証明生成]]と非常に似ています。

### 検証者

検証者は、ルート[[glossary/STARK|STARK]]と、Raccoon-Gのwitnessバインディングや[[glossary/FORS|FORS]]の残りの多項式クレームなど、それを[[glossary/verification|検証]]するために必要な補助データを含むレシートを受け取ります。したがって、検証者は以下の図8に示す3種類の作業を実行します。

\\begin{aligned} T\_{\\text{first use}} &\\approx T\_{\\text{setup}}+T\_{\\text{public processing}}+T\_{\\text{proof checks}},\\\\ T\_{\\text{prepared}} &\\approx T\_{\\text{public processing}}+T\_{\\text{proof checks}}. \\end{aligned}

***プログラムセットアップ*** (T\_{\\text{setup}}) とは、承認されたプログラムをロードまたはコンパイルし、[[glossary/verification|検証]]テーブルと再帰回路を準備することを意味します。この実装では[[glossary/FORS|FORS]]が実質的に多くの準備作業を必要とし、図8の左上の曲線が高い理由の多くを説明しています。

***公開処理*** (T\_{\\text{public processing}}) は、「この証明は私が受け入れようとしているトランザクションに関するものか？」という問いに答えます。

検証者は、すべての元の公開鍵/メッセージペアを処理し、期待されるリーフコミットメントを構築し、順序付けとパディングを考慮します。Raccoon-Gの場合、提供された同じDを使用して署名ごとに5つの部分クレームを構築します。これは、異なるトランザクションに対する暗号的に有効な証明が、意図されたトランザクションを承認しないため、非常に重要です。

***証明検証*** (T\_{\\text{proof checks}}) は、「そのステートメントは正しく証明されているか？」という問いに答えます。

図8の左下のパネルには、ルート[[glossary/STARK|STARK]]と残りのすべての検証者の義務が含まれています。これは単にルートトランスクリプトのチェックではありません。

RISC-Vの場合、完全な`Tree::verify`は[[glossary/Recursive-STARK|再帰的STARK]]証明をチェックし、残りのプログラム、メモリ、および回路クレームを解決します。[[glossary/FORS|FORS]]の場合、ルート[[glossary/STARK|STARK]]をチェックし、残りの削減されたプログラムクレームを評価します。100署名の場合、[[glossary/FORS|FORS]]にはこのような最終評価が5つあります。

[![tree-verification](https://ethresear.ch/uploads/default/optimized/3X/f/1/f1fcdfab87f8a5eca3c4ae80f6ace43cf7ac644a_2_560x500.png)](https://ethresear.ch/uploads/default/original/3X/f/1/f1fcdfab87f8a5eca3c4ae80f6ace43cf7ac644a.png "ツリー検証")

*図8: leanVMにおける再帰的STARK検証。上: プログラムセットアップを含む完全な検証（左）とセットアップがキャッシュされた状態での検証（右）。下: 完全な証明チェック（左）とすべての鍵とメッセージからの公開ステートメントの準備（右）。*

# ウォレットインフラに関する議論

[[glossary/EIP-8288|EIP-8288]]は、より複雑な暗号学的[[glossary/verification|検証]]フローを統合する能力を開き、[[glossary/EVM|EVM]]からオフチェーンの証明計算に作業をオフロードします。これにより、ウォレットフローに代替署名を統合することが可能になります。

**メモリ制約。** ウォレットが独自のleanSTARKを生成する場合、[[glossary/proving|証明生成]]はブラウザ、電話、ハードウェア署名者にとって大きな障害となります。従来のwasm32ビルドでは、1つの線形メモリで最大4 GiBしかアドレス指定できず、RAMが不足している場合はそれより早く割り当てが失敗する可能性があります。Memory64はサポートされている場合、アドレス指定可能な範囲を増やしますが、追加のRAMは提供しません。図4の単一署名測定では、Falcon-512と[[glossary/FORS|FORS]]のみが4 GiB未満のネイティブピークRSSを持っています。これらはブラウザの候補として妥当ですが、より大きなバッチや[[glossary/Recursive-STARK|再帰的STARK]][[glossary/proving|証明生成]]にははるかに多くのメモリが必要になる場合があります。

**考えられるフロー。** ウォレットはローカルで署名し、トランザクション、公開鍵、署名を外部の信頼できないアグリゲーター (EUAgg) に送信します（もちろん、署名鍵はデバイスに残ります）。その後、EUAggは[[glossary/leanVM|leanVM]]の下で署名[[glossary/verification|検証]]を証明し、トランザクションと証明バンドルを[[glossary/Mempool|メムプール]]に転送します。そこでビルダーはそれらをさらに集約できます。ネットワークは宣言された依存関係に対して最終証明をチェックし、[[glossary/account-validation|アカウント検証]]は期待される検証者、承認された鍵、および署名されたトランザクションを要求します。フローの図については図9を参照してください。

[![wallet-flow](https://ethresear.ch/uploads/default/optimized/3X/2/7/274f8cc755e376d738f83b9bfe356b0bff4cfc66_2_690x279.png)](https://ethresear.ch/uploads/default/original/3X/2/7/274f8cc755e376d738f83b9bfe356b0bff4cfc66.png "ウォレットフロー")

*図9: オフチェーンleanSTARK生成と集約を伴うウォレットインフラのスケッチ。*

この構造により、[[glossary/proving|証明生成]]がウォレットから切り離され、ユーザーは[[glossary/proving|証明生成]]コストを共有できます。EUAggはサービスの遅延や拒否を行う可能性がありますが、トランザクションの承認はアカウントポリシーと証明によって強制されることに注意してください。

**[[glossary/EIP-8288|EIP-8288]]。** このフローには、ドラフトの汎用[[glossary/STARK|STARK]]パスが完了している必要があり、`LEANSTARK_SCHEME`は現在予約済みであり、依存関係フレーム (dependency frames) では無効です。また、`AGGREGATED_VK`と`DEPS_HASH`は`TBD`のままです。統合では、証明フォーマットとパラメータを定義し、各依存関係を署名-[[glossary/verification|検証]]プログラム、公開鍵、トランザクションハッシュにバインドする必要があります。アカウントの[[glossary/account-validation|アカウント検証]]ロジックは、その正確なクレームを要求する必要があります。また、ドラフトでは`MAX_LEANSTARK_DEPS_PER_WRAPPER=1`と設定されているため、多くの個別の証明済み依存関係を生成する同一検証者によるバッチ処理 (same-verifier batch) には、改訂されたラッパー/アドミッション制限と指定された汎用セマンティクスが必要です。これは、[[glossary/EIP-8288|EIP-8288]]の議論における[同一検証者によるバッチ処理の提案](https://ethereum-magicians.org/t/eip-8288-frame-type-for-pq-sig-and-stark-aggregation/28723/14)に従うことになります。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/exploring-post-quantum-signature-aggregation-for-eip-8288/26261)
