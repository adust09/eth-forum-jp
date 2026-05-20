---
title: 31ビット有限体上でのWHIRのEVM検証
original_title: EVM Verification of WHIR over a 31-bit Field
source_url: 'https://ethresear.ch/t/evm-verification-of-whir-over-a-31-bit-field/24902'
author: alxkzmn
date: '2026-05-19'
category: 'zk-s[nt]arks'
tags:
  - zk-s-nt-arks
  - evm-verification
  - whir
  - snarks
topic_id: '24902'
translated_at: '2026-05-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EVM Verification of WHIR over a 31-bit Field](https://ethresear.ch/t/evm-verification-of-whir-over-a-31-bit-field/24902) — alxkzmn (2026-05-19)

## 要約

*我々は、31ビットKoalaBear有限体上の多項式コミットメントスキーム (PCS) として、スタンドアロンWHIRのSolidity検証器を実装しました。[\[1\]](https://ethresear.ch#footnote-60007-1) WHIR[\[2\]](https://ethresear.ch#footnote-60007-2)は、制約付きリード・ソロモン符号 (Reed–Solomon codes) のためのハッシュベースの透過的なIOPPであり、おそらく耐量子安全性 (post-quantum sound) を持ちます。*

*ジョンソン限界 (Johnson bound) 下で証明可能な100ビットの健全性 (soundness) を持つ、サイズ$2^{22}$のコミットされた多項式 (committed polynomial) の開示は、EVMトランザクションとして5,646,080ガスを要します。別のプリコンパイル (precompile) 実験では、拡大体 (extension field) の内積プリミティブである`EXTFIELD_MAC`が、*

c + \\sum\_i a\_i b\_i \\in \\mathbb{F}\_{p^k},

*スカラーおよびバッチ拡大体プリコンパイルとともに、検証コストを4,328,805ガスまで削減することを示しています。*

*31ビット有限体 (field) はガスを削減します（我々の実験では約14%）。カールデータ (calldata) を劇的に縮小しますが、拡大体演算 (extension-field arithmetic) がその節約の多くを消費します。*

## 1. 小さい有限体への賭け

現在、合理的なガス (gas) コストでオンチェーン検証可能なSNARKs（ほぼGroth16に限定される）は、楕円曲線ペアリング (elliptic-curve pairings) に依存しており、量子攻撃 (quantum attacks) に対して脆弱です。SNARK内では、耐量子安全性は多項式コミットメントスキーム (polynomial commitment scheme) から得られます。WHIRは、この設定で我々が知る限り最小の証明サイズを持つ透過的なPCSとしてインスタンス化できるハッシュベースのIOPPであり、その検証器は高速です。このプロジェクトは、Plonky3を使用したWHIRのRust実装である*whir‑p3*[\[3\]](https://ethresear.ch#footnote-60007-3)に基づいています。

以前のSolidity WHIR検証器である*sol‑whir*[\[4\]](https://ethresear.ch#footnote-60007-4)は、254ビット有限体を使用し、容量限界近接ギャップ予想 (capacity-bound proximity-gap conjecture) に依存していましたが、これはその後反証されました[\[5\]](https://ethresear.ch#footnote-60007-5)[\[6\]](https://ethresear.ch#footnote-60007-6)[\[7\]](https://ethresear.ch#footnote-60007-7)。この予想が失敗すると、検証器は同じ健全性 (soundness) を維持するためにより多くのクエリ (query) を必要とし、したがってより多くのガスを消費します。我々の作業仮説は、小さい有限体が、より安全なジョンソン限界 (Johnson bound) パラメータを賄うのに十分なガスを買い戻すだろうというものでした。

本番環境対応の検証器を構築する前に、*sol‑whir*に対して小規模で低セキュリティの比較[\[8\]](https://ethresear.ch#footnote-60007-8)を行いました。これは、ある狭い質問に答えます。同等のパラメータで、31ビット有限体 (KoalaBear + ext4) はEVMガスを削減するか？

この比較のためだけに、両方の検証器は80ビットの目標セキュリティを使用しました（*sol‑whir*の最新コミットバージョン[\[9\]](https://ethresear.ch#footnote-60007-9)と同じ）。

| メトリック | KoalaBear + ext4 | sol-whir |
| --- | --- | --- |
| 総検証トランザクションガス | 975,202 | 1,135,052 |
| 固有ガス | 21,000 | 21,000 |
| カールデータガス | 159,640 | 414,876 |
| 実行残余 | 794,562 | 699,176 |
| カールデータバイト | 10,276 | 28,740 |

KoalaBear検証器は、総トランザクションガスで約14.1%安価です。カールデータ (calldata) ガスは61.5%低いですが、実行ガス (execution gas) は13.6%高くなっています。31ビット有限体は証明を縮小しますが、拡大体演算 (extension field arithmetic) がその利点の一部を食い潰します。

## 2. 小さい有限体が主にカールデータを節約する理由

31ビット有限体はEVM上で役立ちますが、その効果は限定的です。カールデータ (calldata) を大幅に削減する一方で、実行は高価なままです。なぜなら、検証器は健全性 (soundness) のために拡大体 (extension field) 上で動作する必要があり、Solidityでの拡大体演算 (extension arithmetic) は`MULMOD`よりも2桁高価だからです。

KoalaBearは31ビット有限体で、$p = 2^{31} - 2^{24} + 1$です。これは検証器のチャレンジ (challenge) には小さすぎます。公開コイン引数 (public-coin arguments) では、チャレンジ空間が十分に大きくなければ、証明者 (prover) は受理されるトランスクリプト (transcript) を探索できません。したがって、検証器は拡大体$\mathbb{F}_{p^k}$上で動作します。100ビットのジョンソン限界 (Johnson bound) 検証器の場合、これは5次拡大 (quintic extension) $\mathbb{F}_{p^5} = \mathbb{F}_p[X] / (X^5 + X^2 - 1)$です。

カールデータ (calldata) の利点は表現サイズから来ます。KoalaBearの基底体要素 (base-field element) は31ビットを必要とし、5次拡大要素は20バイトにパックされた5つのリム (limb) です。BN254要素は完全な32バイトのEVMワード (EVM word) を占めます。したがって、クエリされた評価、チャレンジ、および多項式値は、小さい有限体検証器ではより少ないカールデータバイトを消費します。

| 値の型 | 数学的サイズ | この比較でのエンコードサイズ |
| --- | --- | --- |
| KoalaBear基底体要素 | 31ビット | 4バイト |
| KoalaBear 5次拡大要素 | 155ビット | 20バイト |
| BN254基底体要素 | 254ビット | 32バイト |

表現が小さくなっても、拡大体演算 (extension-field arithmetic) が安価になるわけではありません。BN254検証器は、ネイティブな`ADDMOD`と`MULMOD`をそれぞれ8ガスで利用できます。KoalaBear拡大体には専用のオペコード (opcode) がないため、検証器は乗算を多項式乗算 (polynomial multiplication) に続き、既約多項式 (irreducible polynomial) による剰余 (reduction modulo the irreducible) として、完全にSolidityで実装します。異なる健全性 (soundness) 目標には異なるサイズが必要なため、3つの拡大次数を実装しました。

-   **4次** ($\mathbb{F}_{p^4}$、既約$X^4 - 3$)：BN254に対する低セキュリティ80ビット比較用。
-   **5次** ($\mathbb{F}_{p^5}$、既約$X^5 + X^2 - 1$)：100ビットジョンソン限界 (Johnson bound) 検証器用。
-   **8次** ($\mathbb{F}_{p^8}$、既約$X^8 - 3$)：同じ健全性レベルでのより高い代数的セキュリティ比較用。

`solc 0.8.28`で`via_ir = true`（Yulオプティマイザパイプライン有効）でコンパイルされた5次カーネルの、EVMのネイティブなスカラー体演算 (scalar-field arithmetic) に対する、償却されていない呼び出しごとのコスト：

| 作業項目 | BN254 / EVMコスト | この検証器でのKoalaBear拡大体コスト |
| --- | --- | --- |
| スカラー体加算 | ADDMOD: 8ガス | ext5加算: 394ガス; ext5減算: 409ガス |
| スカラー体乗算 | MULMOD: 8ガス | ext5乗算: 979ガス; ext5二乗: 642ガス |

要素ごとの乗算ガスは、畳み込み演算 (convolution work) とともにほぼ増加します。検証器は、行評価、等価積、制約重み、および最終チェックのほとんどを拡大体 (extension field) 上で実行し、これらの乗算を何千回も実行します。これが実行ガス (execution gas) を押し上げる要因です。

小さい有限体はカールデータ (calldata) を削減しますが、結果として得られる検証器は拡大体演算 (extension arithmetic) に支配され、個々の操作を素朴に実行するのではなく、それを償却する必要があります。次のセクションでは、その方法について説明します。

## 3. Solidityで最適化した点

検証器は、1つのWHIRパラメータセットにハードワイヤードされています。折りたたみスケジュール、ラウンド数、クエリ数、行幅、および拡大次数はすべて、スケジュール固有のSolidity定数と特化された検証器コードに組み込まれています。ランタイム設定可能な検証器は、ガスとバイトコードサイズの両方で劣ります。後者は、[[glossary/EIP|EIP（Ethereum 改善提案）]]‑170がデプロイされたランタイムコードをコントラクトあたり24,576バイトに制限しているため重要です。実際のバイトコード測定値はセクション6にあります。

最適化全体を通してバイトコードサイズを追跡しましたが、ガスが優先事項でした。高セキュリティの5次および8次検証器は、単一のコントラクトとしては依然として[[glossary/EIP|EIP（Ethereum 改善提案）]]‑170を超過するため（セクション6を参照）、デプロイ可能性には、検証器をヘルパーコントラクト (helper contract) またはライブラリ (library) に分割する必要があります。

最初の優先事項は拡大体演算 (extension-field arithmetic) でした。最大の成果は、定数ファクタエンジニアリングから得られました。拡大体要素を1つのEVMワード (EVM word) にパックすること、有界なリム計算の終わりまでモジュラ還元 (modular reduction) を遅延させること、二乗を特化すること、そして中間拡大体値が繰り返しアンパックおよびリパックされないように検証器カーネルを融合することです。

*sol‑whir*からは、すでに実績のあるEVMパターンを採用しました。カールデータ (calldata) からカスタムバイト文字列として直接証明を読み取ること、バッチ化されたマークル開示（別名「マルチプルーフ」）、および測定可能なすべてのフェーズを囲むFoundryテストです。WHIRステートマシン (state machine) と有限体演算 (field arithmetic) は、*whir‑p3*に基づいてゼロから書き直されました。

その他の大きな成果は、20バイトダイジェスト (digest) 用の特化されたマークル (Merkle) およびKeccak処理、トランスクリプトネイティブな観測、既知の行幅に特化されたSTIR行評価器、およびスクラッチメモリの再利用から得られました。

すべての変更は同じループを通過しました。

1.  プロファイル (profile) から候補を選択します。Foundryフレームグラフ、フェーズごとのガス、またはマイクロベンチマーク (microbenchmark) です。ホットなカーネルの手書きの書き換えが妥当に見える場合は、コンパイル済みアセンブリ (compiled assembly) を検査します。
2.  それを実装します。
3.  同じフィクスチャで実際の検証器パスを再測定します。
4.  `forge build --sizes`を[[glossary/EIP|EIP（Ethereum 改善提案）]]‑170予算に対してチェックします。
5.  ガスを節約し、トランスクリプト (transcript) と証明の互換性を維持し、コントラクトサイズ予算に収まる場合にのみ変更を保持します。そうでなければ元に戻します。

多くの候補が元に戻されました。`via_ir`は手書きの書き換えよりも優れたコードを生成することが多く、ガスを大幅に節約したいくつかの書き換えはコントラクトサイズを著しく増加させました。その他の試みられた変更は、バイトコードの利点なしにガスで同点だったため却下されました。このプロファイリングループが、ソフトウェアパスを停止してプリコンパイル (precompile) 実験（セクション5）に移行することを決定した方法です。一桁パーセントの改善はまだ存在するかもしれませんが、残りの目に見える機会は主要な結論を変えるには小さすぎました。

## 4. 正確に測定されたもの

リード・ソロモン近接性テスト (Reed–Solomon proximity testing) の場合、検証器のコストは、符号レート (code rate)、クエリ数、および健全性 (soundness) の間の仮定された関係に大きく依存します。2025年まで、FRIスタイルおよびWHIRスタイルの検証器パラメータを容量限界推定 (capacity-bound estimates) から選択するのが一般的でした。これは、主張されたセキュリティレベルに対して最小の検証器を提供します。最近のリード・ソロモン近接ギャップ結果は、積極的なパラメータ選択に使用された予想の容量までの形式（WHIR相互相関合意容量まで予想を含む）を排除します[\[5:1\]](https://ethresear.ch#footnote-60007-5)[\[6:1\]](https://ethresear.ch#footnote-60007-6)[\[7:1\]](https://ethresear.ch#footnote-60007-7)。したがって、主要な検証器測定にはジョンソン限界 (Johnson bound) パラメータを使用し、報告されたセキュリティ主張は証明された限界に基づいています。

目標健全性 (target soundness) は100ビットに設定しました。現代の証明システム構成とベンチマーク[\[10\]](https://ethresear.ch#footnote-60007-10)で一般的な96ビットのレベルは、攻撃者の能力に不快なほど近いです。ビットコインの年間ハッシュレートは$2^{96}$オペレーションに近づいており[\[11\]](https://ethresear.ch#footnote-60007-11)、約1年のマージンしか残されていません。128ビットのジョンソン限界 (Johnson bound) セキュリティは、より大きな拡大次数とより多くのクエリを必要とし、大幅に高価になるでしょう。

コミットされた多項式 (committed polynomial) のサイズは$2^{22}$で、*sol‑whir*[\[4:1\]](https://ethresear.ch#footnote-60007-4)で関連するとされた上限です。これは多くの現代の回路にとって十分な大きさです。

検証器は、*sol‑whir*とStarkNetのようなデプロイされたSTARK検証器の両方に従い、80ビットの実効マークルダイジェスト (Merkle digest) を使用します。ここでは、このダイジェストマスキング規則がハッシュベースの証明システムの実用的なデフォルトです[\[4:2\]](https://ethresear.ch#footnote-60007-4)。切り捨てなしの測定は今後の課題です。

WHIRスケジュールの選択は別の探索でした。候補は、プルーフ生成時間 (prover time) と検証器ガス (gas) コストのトレードオフとして選択する必要がありました。スイープは、ほとんどのパラメータ（折りたたみファクタ、初回ラウンド折りたたみ挙動、開始逆レート、初期リード・ソロモン領域削減）で広範囲をカバーし、2つのプロトコルおよびユースケース駆動のカットオフによって制限されました。1つ目はプルーフ・オブ・ワーク (proof-of-work) グラインディングに関するものです。*whir‑p3*はグラインディング証人 (grinding witness) を単一の基底体要素 (base-field element) として保持するため、プロトコルを変更せずにグラインディングに使用できるビット容量は`pow_bits = 30`に制限されました。2つ目はプルーフ生成時間に関するものです。検証器は実用的な（理想的にはクライアントサイドでの）プルーフ生成を目的としているため、M4 Proで600秒を実際の測定のカットオフとしました。

以下のパレートフロンティア (Pareto front)[\[12\]](https://en.wikipedia.org/wiki/Pareto_front)プロットは、測定されたスケジュールと、5次選択に使用された近くの補間されたスケジュールを示しています（4次拡大では100ビットのセキュリティに到達するには不十分でした）。横軸：合成検証器スコア (synthetic verifier score)（ガス換算単位）、WHIRスケジュールとSolidityマイクロベンチマーク (microbenchmark) から導出[\[13\]](https://ethresear.ch#footnote-60007-13)。縦軸：プルーフ生成時間 (prover time)（秒）、利用可能な場合は測定値、それ以外は補間値。フロンティア上の点は、一方の目的を改善するともう一方のコストが増加するスケジュールです。

![WHIR検証器のパレートフロンティア：プルーフ生成時間 vs 検証器スコア](https://ethresear.ch/uploads/default/original/3X/4/c/4cae9f8dd5b238ebc94af25629d779207dd326f2.svg)

このフロンティア上に実装された点は`constant_pow28_ff4_lir4_rsv3`です。ラベル形式はスコア脚注[\[13:1\]](https://ethresear.ch#footnote-60007-13)でデコードされています。フロンティア上のすべての点の中で最も低い検証器スコアのためにこれを選択しました。この選択は、EVM検証ガスを最小限に抑えるために、意図的にプルーフ生成時間 (prover time) を犠牲にしています。

選択された検証器パラメータは次のとおりです。

| 数量 | 値 |
| --- | --- |
| 基底体 (Base field) | KoalaBear, 31ビット |
| 拡大体 (Extension field) | 5次, $X^5 + X^2 - 1$ |
| 目標健全性推定 (Target soundness estimate) | 100ビット |
| 使用された限界 (Bound used) | ジョンソン限界 (Johnson bound) |
| コミットされた多項式サイズ (Committed polynomial size) | $2^{22}$ |
| 折りたたみファクタ (Folding factor) | 4 |
| 開始ログ逆レート (Starting log inverse rate) | 4 |
| RS初期削減 (RS initial reduction) | 3 |
| プルーフ・オブ・ワークビット (Proof-of-work bits) | 28 |
| 証明カールデータサイズ (Proof calldata size) | 54,436バイト |

この点でのM4 Proラップトップでのプルーフ生成時間 (prover time) は約274秒でした。

この構成でのトランザクション合計の内訳は次のとおりです。

| コンポーネント | ガス |
| --- | --- |
| 実行残余 | 4,768,744 |
| カールデータ (Calldata) | 856,336 |
| 固有トランザクションコスト | 21,000 |
| 総トランザクションガス | 5,646,080 |

以下はフェーズ内訳です。フェーズ合計は上記の実行残余より447ガス低くなっています。この不一致は、ラベル付けされた検証器フェーズの周りのプロファイリングハーネス (profiling harness) によって費やされたガスによるものです。

| フェーズ | ガス |
| --- | --- |
| セットアップ | 20,864 |
| 初期サムチェック | 27,353 |
| ラウンド0パース | 2,799 |
| ラウンド0 STIR | 703,346 |
| ラウンド0サムチェック | 27,243 |
| ラウンド1パース | 2,784 |
| ラウンド1 STIR | 925,758 |
| ラウンド1サムチェック | 27,301 |
| ラウンド2パース | 2,793 |
| ラウンド2 STIR | 582,564 |
| ラウンド2サムチェック | 27,209 |
| 最終多項式観測 | 63,759 |
| 最終STIR | 669,008 |
| 最終サムチェック | 37,047 |
| 制約評価 | 1,512,664 |
| 最終値チェック | 135,805 |
| フェーズ合計 | 4,768,297 |

制約評価 (Constraint evaluation) (1,512,664ガス) とSTIR (合計2,880,676ガス) が支配的です。サムチェック (sumcheck) フェーズの合計は146,153ガスで、フェーズ合計の約3%です。これが、完全なSNARKに関する将来の作業でSpartan‑WHIRを選択した理由の1つです。SpartanのIOPはほとんどがサムチェックであるため、検証器はIOPレイヤーではなくWHIRに支配され続けるはずです。

明示的なext5乗算/二乗/減算関数はガスの約5.8%しか占めていません。ほとんどの拡大体演算 (extension arithmetic) は、融合された行評価および制約評価カーネル内にあります。

同じ形状（STIRと制約評価が支配的、サムチェックが小さい）は、4次および8次検証器にも当てはまります。セクション6では、これら2つのバリアントの総トランザクションガスを示します。定性的な内訳は同じであり、絶対値はセクション2で議論した要素ごとの拡大体コストにほぼ比例するため、2番目のフェーズごとの表は省略します。

## 5. プリコンパイル実験

プリコンパイル (precompile) 実験は、少数の新しいEVMプリミティブが透過的なハッシュベースの検証コストを実質的に削減できるかどうかを問うものです。ペアリングベースのSNARKsと耐量子システム (post-quantum systems) の間の検証器ガス (gas) コストのギャップは、PQ検証への圧力が強まるにつれて、より重要になるでしょう。

2つの質問があります。どのプリミティブがこの検証器のガスを実質的に削減するか、そしてそれは特定のWHIR実装のアクセラレータ (accelerator) ではなく、信頼できる[[glossary/EIP|EIP（Ethereum 改善提案）]]となるのに十分汎用的か？

プリコンパイル実装でパッチ適用されたAnvilノードで実験を実行しました。開始セットは明白な一般的なターゲットでした。

| プリミティブ | 操作 |
| --- | --- |
| EXT5_MUL(a,b) | $\text{a} \cdot \text{b}$ in $\mathbb{F}_p[X] / (X^5 + X^2 - 1)$ |
| EXT8_MUL(a,b) | $\text{a} \cdot \text{b}$ in $\mathbb{F}_p[X] / (X^8 - 3)$ |
| バッチバリアント | EXTk_MULを要素ごとに適用 |

これらは指定が簡単です。固定フィールドID、固定拡大レイアウト、2入力、1出力。それら自体では限定的な効果しかありませんでした。スタンドアロンの拡大体乗算は、`STATICCALL`転送、メモリパッキング、およびリターンデータ処理のコストを賄うには小さすぎることがよくあります。バッチ乗算は、検証器がすでに適切な形状の多くの独立した積を持っている場合に価値がありますが、いくつかのホットループにはシリアルな依存関係や互換性のないデータレイアウトがあります。

生産的なプリミティブはプロファイリングから生まれました。STIR行評価のホットパスは、拡大体 (extension field) の内積です。

c + \\sum\_i a\_i b\_i.

これが`EXTFIELD_MAC`プリコンパイル (precompile) につながりました。`EXTFIELD_MAC`は、選択された拡大体上でこの操作を正確に計算します。そのインターフェースは意図的にシンプルです。

-   フィールドID
-   ベクトル長
-   オプションのアキュムレータフラグ
-   パックされた拡大体要素のペア
-   1つのパックされた拡大体出力

同じ内積形状は、FRI、STIR、WHIR、および小素数拡大体 (small-prime extension fields) 上のサムチェック (sumcheck) 形式の検証器カーネルに現れます。ここでの証拠はまだこの検証器に限定されており、他のシステムに関する主張はそれらのシステムでの測定が必要です。

測定されたプリコンパイル関連の削減は次のとおりです。

| プリコンパイル関連の変更 | おおよその節約 |
| --- | --- |
| スカラー/バッチ拡大体プリコンパイルとEXTFIELD_MAC行ドット | 910,600 |
| MAC入力テンプレート化 | 57,741 |
| プリコンパイル関連の削減 | 968,341 |

完全に統合された実験的ブランチは、4,328,805トランザクションガス (transaction gas) を測定します。

[[glossary/EIP|EIP（Ethereum 改善提案）]]として十分汎用的であり、ガスを節約するのに十分な大きさの別の操作がないか、残りのプロファイルを検査しましたが、`EXTFIELD_MAC`以外には見つかりませんでした。残りのホットコードは、この検証器に特化しすぎているか、プリコンパイル呼び出しを償却するにはシリアルすぎたか、または通常のSolidity最適化として処理する方が適切でした。

## 6. 測定されたバリアント全体の結果とデプロイ可能性

ソフトウェア測定値は次のとおりです。

| 検証器 | セキュリティモデル | 総トランザクションガス | カールデータガス | 実行残余 |
| --- | --- | --- | --- | --- |
| 5次KoalaBear検証器 | 100ビットジョンソン限界 (Johnson bound) | 5,646,080 | 856,336 | 4,768,744 |
| 8次KoalaBear検証器 | 100ビットジョンソン限界 (Johnson bound) | 6,367,262 | 753,800 | 5,592,462 |

実験的なプリコンパイル (precompile) に基づく測定値は次のとおりです。

| 検証器 | 総トランザクションガス | 注記 |
| --- | --- | --- |
| 実験的プリコンパイル付き5次検証器 | 4,328,805 | ext5スカラー/バッチ演算とEXTFIELD_MAC |
| 実験的プリコンパイル付き8次検証器 | 4,345,429 | ext8スカラー/バッチ演算とEXTFIELD_MAC |

8次の結果は、VMプリミティブ (VM primitive) がいかに重要かを示しています。ソフトウェアでは、8次検証器は5次検証器よりも高価です。実験的な拡大体プリコンパイル (extension-field precompiles) を使用すると、8次と5次のトランザクションガス (transaction gas) はほぼ同じです。

デプロイ可能性 (Deployability) には、実装をヘルパーコントラクト (helper contract) またはライブラリ (library) に分割し、結果として生じる呼び出しオーバーヘッド (call overhead) を再測定する必要があります。分割はまだ今後の課題です。

| パック済み証明5次検証器バリアント | ランタイムバイトコード | [[glossary/EIP|EIP（Ethereum 改善提案）]]‑170ステータス |
| --- | --- | --- |
| rsv3_pow28 ソフトウェア | 33,119 B | 8,543 B超過 |
| rsv4 ソフトウェア | 32,870 B | 8,294 B超過 |
| rsv3_pow28 実験的プリコンパイルパス | 29,551 B | 4,975 B超過 |

## 7. 残された課題

未解決の項目はすべて上記で指摘されています。

| 項目 | 残された理由 |
| --- | --- |
| 切り捨てなしマークルダイジェスト測定 | 報告された検証器は、80ビットダイジェストマスキング規則を固定しています。完全なダイジェスト (full digests) での測定はまだ行われていません。 |
| デプロイ可能なバイトコード分割 | 高セキュリティのパック済み証明検証器は、単一のコントラクトとしては[[glossary/EIP|EIP（Ethereum 改善提案）]]‑170コントラクトサイズ制限を超過します。ヘルパーコントラクト (helper-contract) またはライブラリ (library) 分割を実装し、再測定する必要があります。 |
| 完全なSpartan-WHIR検証器 | このレポートはスタンドアロンWHIRを測定しています。完全なSNARK構成は今後の課題です。 |

## 8. 結論

EVM上でのWHIR検証は、自明でないパラメータ（100ビットジョンソン限界 (Johnson bound) 健全性 (soundness)、$|f| = 2^{22}$）の下で、証明可能な近接限界 (proximity bound) で実現可能です。ソフトウェアでは5.65 MGas、実験的なプリコンパイル (precompile) パスでは4.33 MGasです。

小さい有限体の選択は、実質的ではあるものの限定的なガス (gas) 改善をもたらします。カールデータ (calldata) を大幅に削減しますが、その後は実行が拡大体 (extension field) の行評価に支配されます。カスタムノード実験で最も役立つプリコンパイルは、拡大体要素 (extension-field elements) 上の累積内積である`EXTFIELD_MAC`です。

今日の価格（0.554 gwei、1 ETHあたり$2,359）では、5.65 MGasのソフトウェアパスは約$3.98、4.33 MGasのプリコンパイルパスは約$3.05かかります。これはGroth16検証よりもはるかに高価ですが、デプロイされたSTARK決済と同じガス範囲です。StarkNetの2021年のチェックポイント投稿では、オンチェーンSTARK検証に約5 MGasがかかると引用されており[\[14\]](https://ethresear.ch#footnote-60007-14)、2024年のStarkNetコストノートでは、証明検証にSHARPトレインあたり約6 MGasがかかると報告されています[\[15\]](https://community.starknet.io/t/starknet-costs-and-fees/113853)。

これらの以前のSTARK検証器との比較には注意が必要です。システムとセキュリティ仮定が異なるためです。「非対話型FRIの具体的なセキュリティについて (On the Concrete Security of Non-interactive FRI)」[\[16\]](https://eprint.iacr.org/2024/1161)は、それらのデプロイの一部が、予想された仮定が削除されると、59ビットの証明可能なFRIセキュリティしか持たないことを報告しており、2021年のチェックポイント投稿は、直接比較可能な方法で回路サイズ (circuit size) を指定していません[\[17\]](https://ethresear.ch#footnote-60007-17)。コスト状況も変化しました。2021年の投稿日には、イーサリアムの平均ガス価格は約50.1 gweiで、ETHは約$2,889でした。したがって、5 MGasの検証コストは約0.25 ETH、つまり約$724でした（[[glossary/EIP|EIP（Ethereum 改善提案）]]-1559以前）。今日では、サブgweiまたは低一桁gweiのL1ガス価格、そしてL2では間違いなく、5～6 MGasの検証は扱いやすい決済コストです。ここで新しいのは、WHIR検証器が、その後反証された容量限界仮定ではなく、証明可能なジョンソン限界 (Johnson bound) 100ビット健全性で6 MGas未満に収まることです。

WHIRは再帰的検証 (recursive verification) にも適しています。このEVM検証器は、イーサリアムに`KECCAK256`オペコードがあるため、KeccakでWHIRをインスタンス化しますが、PoseidonベースのWHIRインスタンスは、Poseidonが算術回路 (arithmetic circuits) 向けに設計されているため、プルーフ生成がはるかに高速で、再帰的検証がはるかに容易です。1つのもっともらしいアーキテクチャは、Poseidon上で多くのアプリケーション証明を再帰的に集約し、その後、ここで測定されたKeccakベースの検証器でEVM上で1つの最終WHIR証明を検証することです。

## 謝辞

実装計画とPRに関する有益なレビューと提案をいただいた[@miha-stopar](https://ethresear.ch/u/miha-stopar)に感謝します。

* * *

1.  `sol-spartan-whir`リポジトリ: [GitHub - privacy-ethereum/sol-spartan-whir: Solidity verifier for the Spartan-WHIR SNARK over the KoalaBear field · GitHub](https://github.com/privacy-ethereum/sol-spartan-whir)。 [↩︎](https://ethresear.ch#footnote-ref-60007-1)
    
2.  Gal Arnon, Alessandro Chiesa, Giacomo Fenzi, and Eylon Yogev, “WHIR: Reed-Solomon Proximity Testing with Super-Fast Verification,” IACR ePrint 2024/1586: [WHIR: Reed–Solomon Proximity Testing with Super-Fast Verification](https://eprint.iacr.org/2024/1586)。 [↩︎](https://ethresear.ch#footnote-ref-60007-2)
    
3.  *whir‑p3*リポジトリ: [GitHub - tcoratger/whir-p3 · GitHub](https://github.com/tcoratger/whir-p3/)。執筆時点では、WHIRコードベースはPlonky3にネイティブに統合されています: [GitHub - Plonky3/Plonky3: A toolkit for polynomial IOPs (PIOPs) · GitHub](https://github.com/Plonky3/Plonky3)。 [↩︎](https://ethresear.ch#footnote-ref-60007-3)
    
4.  *sol‑whir*の解説、「On the Gas Efficiency of the WHIR Polynomial Commitment Scheme」、Ethereum Research: [On the gas efficiency of the WHIR polynomial commitment scheme](https://ethresear.ch/t/on-the-gas-efficiency-of-the-whir-polynomial-commitment-scheme/21301)。 [↩︎](https://ethresear.ch#footnote-ref-60007-4) [↩︎](https://ethresear.ch#footnote-ref-60007-4) [↩︎](https://ethresear.ch#footnote-ref-60007-4)
    
5.  Benjamin E. Diamond and Angus Gruen, “On the Distribution of the Distances of Random Words,” IACR ePrint 2025/2010: [On the Distribution of the Distances of Random Words](https://eprint.iacr.org/2025/2010)。 [↩︎](https://ethresear.ch#footnote-ref-60007-5) [↩︎](https://ethresear.ch#footnote-ref-60007-5)
    
6.  Elizabeth C. Crites and Alistair Stewart, “On Reed-Solomon Proximity Gaps Conjectures,” IACR ePrint 2025/2046: [On Reed–Solomon Proximity Gaps Conjectures](https://eprint.iacr.org/2025/2046)。 [↩︎](https://ethresear.ch#footnote-ref-60007-6) [↩︎](https://ethresear.ch#footnote-ref-60007-6)
    
7.  Antonio Kambiré, “Proximity Gaps Conjecture Fails Near Capacity over Prime Fields,” arXiv:2604.09724: [\[2604.09724\] Proximity Gaps Conjecture Fails Near Capacity over Prime Fields](https://arxiv.org/abs/2604.09724)。 [↩︎](https://ethresear.ch#footnote-ref-60007-7) [↩︎](https://ethresear.ch#footnote-ref-60007-7)
    
8.  4次検証器のソースコード, [sol-spartan-whir/src/whir/lir6 at main · privacy-ethereum/sol-spartan-whir · GitHub](https://github.com/privacy-ethereum/sol-spartan-whir/tree/main/src/whir/lir6) [↩︎](https://ethresear.ch#footnote-ref-60007-8)
    
9.  *sol‑whir*リポジトリ: [GitHub - privacy-ethereum/sol-whir: Solidity libraries and contracts for verifying WHIR proofs on the EVM. · GitHub](https://github.com/privacy-ethereum/sol-whir)。 [↩︎](https://ethresear.ch#footnote-ref-60007-9)
    
10.  Ethproofsベンチマーク表、configured-security列: [https://ethproofs.org/csp-benchmarks](https://ethproofs.org/csp-benchmarks)。 [↩︎](https://ethresear.ch#footnote-ref-60007-10)
     
11.  Vitalik Buterin, ビットコインのハッシュレートと96ビットセキュリティマージン: [https://x.com/VitalikButerin/status/1996954146604204363](https://x.com/VitalikButerin/status/1996954146604204363)。 [↩︎](https://ethresear.ch#footnote-ref-60007-11)
     
12.  [パレートフロンティア - Wikipedia](https://ja.wikipedia.org/wiki/パレート最適) [↩︎](https://ethresear.ch#footnote-ref-60007-12)
     
13.  スケジュールsの場合、スコアラーは$\operatorname{score}(s)=\alpha\cdot(M(s)+F(s)+T(s)+S(s)+C(s))$を計算します。ここでMはクエリ数、圧縮数、行折りたたみコスト、OODリーフ、PoW検証からのマークル/STIR行項です。Fは等価積ステップ、逆数、パック要素検証からの折りたたみ作業です。Tはトランスクリプト観測作業です。Sはサムチェック観測とラウンド多項式外挿です。C=$16 \cdot \text{非ゼロカールデータバイト} + 4 \cdot \text{ゼロカールデータバイト}$です。スケール$\alpha$は、生のマイクロベンチマークスコアを測定された5次ネイティブ検証器トランザクションガスに校正します。生のスイープは`pow_bits = 27..30`、初回ラウンド折りたたみファクタ`ff = 1..22`、開始ログ逆レート`lir = 1..6`、初期リード・ソロモン削減`rsv = 1..ff`、および定数折りたたみと`rest < first`の`ConstantFromSecondRound(first, rest)`スケジュールの両方をカバーしました。ラベルは次の規則を使用します:`constant_pow28_ff4_lir4_rsv3`は定数折りたたみ、28プルーフ・オブ・ワークビット、折りたたみファクタ4、開始ログ逆レート4、初期リード・ソロモン削減3を意味します。`cfsr_pow28_ff5_rest3_lir4_rsv4`は同じ残りのフィールドを持つ`ConstantFromSecondRound(5, 3)`を意味します。 [↩︎](https://ethresear.ch#footnote-ref-60007-13) [↩︎](https://ethresear.ch#footnote-ref-60007-13)
     
14.  「StarkNetでのより高速なファイナリティのためのチェックポイント」、Ethereum Research: [Checkpoints for Faster Finality in StarkNet](https://ethresear.ch/t/checkpoints-for-faster-finality-in-starknet/9633)。 [↩︎](https://ethresear.ch#footnote-ref-60007-14)
     
15.  「Starknet Costs and Fees」、[Starknet Costs and Fees - 🆙 Versions Upgrade - Starknet Community Forum](https://community.starknet.io/t/starknet-costs-and-fees/113853) [↩︎](https://ethresear.ch#footnote-ref-60007-15)
     
16.  Alexander R. Block and Pratyush Ranjan Tiwari, “On the Concrete Security of Non-interactive FRI,” IACR ePrint 2024/1161: [On the Concrete Security of Non-interactive FRI](https://eprint.iacr.org/2024/1161)。 [↩︎](https://ethresear.ch#footnote-ref-60007-16)
     
17.  Block–Tiwariによって抽出されたSHARPパラメータの場合、関連するFRIパラメータは$k=26$、すなわちFRI入力次数限界$2^{26}$、レート$1/32$であり、したがって評価ドメインサイズは$2^{31}$です。StarkExの用語では、これは`log trace length = logNSteps + 4`の関係を通じて`logNSteps = 22`に対応します。したがって、`logNSteps = 22`はFRI入力次数$2^{26}$に対応します。 [↩︎](https://ethresear.ch#footnote-ref-60007-17)
     

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/evm-verification-of-whir-over-a-31-bit-field/24902)
