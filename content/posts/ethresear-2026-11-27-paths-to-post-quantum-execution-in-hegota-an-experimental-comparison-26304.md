---
title: Hegotáにおけるポスト量子実行への道筋：実験的比較
original_title: 'Paths to post-quantum execution in Hegotá: an experimental comparison'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/paths-to-post-quantum-execution-in-hegota-an-experimental-comparison/26304
author: ilitteri
date: '2026-11-27'
category: Execution Layer Research
tags:
  - execution-layer
  - post-quantum
  - cryptography
  - consensus
  - research
  - protocol-design
  - eip
  - scaling
topic_id: '26304'
translated_at: '2026-11-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Paths to post-quantum execution in Hegotá: an experimental comparison](https://ethresear.ch/t/paths-to-post-quantum-execution-in-hegota-an-experimental-comparison/26304) — ilitteri (2026-11-27)

## TL;DR

[[glossary/Hegot|ヘゴタ (Hegotá)]]、すなわち[[glossary/Glamsterdam|グラムステルダム]]に続く[[glossary/fork|フォーク]]において、イーサリアムはユーザーがアカウントを[[glossary/Post-Quantum|ポスト量子 (PQ)]]暗号へ移行するために必要なプロトコルレベルのツールを提供できる機会を得ます。[`bogota-devnet-2`](https://notes.ethereum.org/@ethpandaops/bogota-devnet-2)はすでにその基盤の多くを実践しています。具体的には、[[glossary/EIP-8141|EIP-8141 (フレームトランザクション)]]、[[glossary/EIP-8298|EIP-8298 (SETCODEFROM)]]、そして[[glossary/EIP-8151|EIP-8151 (アカウントコード制限付きecRecover)]]です。これらを組み合わせることで、カスタムアカウント認証、既存アカウントのアドレスを変更せずに移行、および移行後の`[[glossary/ecrecover|ecrecover (組み込み関数)]]`によるレガシー[[glossary/ECDSA-signature|ECDSA署名 (楕円曲線デジタル署名アルゴリズム署名)]]認証の制限が可能になります。

主要な欠落部分は、プロトコルに組み込まれた[[glossary/Post-Quantum|ポスト量子 (PQ)]]署名スキームです。それは、[[glossary/SPHINCS|SPHINCS-（SPHINCSマイナス）]]から派生したステートレスなハッシュベース署名スキームである[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]であり、その最終パラメータはまだ議論中です。私たちは[ethrex](https://github.com/lambdaclass/ethrex)において、集約なし（M1）と[[glossary/Block-Building|ビルダー]]側集約（M2）の両方で、同じ[[glossary/Execution-Client|実行クライアント]]のベースライン上に、その統合のための4つの提案を実装しました。また、[ethlambda](https://github.com/lambdaclass/ethlambda)で対応するペイロード変更も実装しました。

私たちの結果は、いくつかの予想を覆すものでした。

-   インラインPROOFフレームの代替案は、M1で最小の実装フットプリントを持ち、M2を通じて[[glossary/execution-layer|実行レイヤー]]の累積コード変更量が最も少ないです。証人（witness）を分離しても、M1の帯域幅は実質的に減少しません。
-   宣言的クレームの代替案は、M2の増分実装が最小であり、2回目の[[glossary/Consensus-Layer|コンセンサス層]]ペイロード変更を回避します。3つの分離されたプロトタイプは、集約全体でトランザクションアイデンティティを維持します。インラインプロトタイプは、実験のために選択されたエンコーディングルールに基づいて[[glossary/transaction hash|トランザクションハッシュ]]を変更します。その仕様では、そのルールは未定のままです。
-   暫定的な[[glossary/gas|ガス]]およびバイト制限の下では、プロトタイプはM1でブロックあたり270〜385の[[glossary/Post-Quantum|ポスト量子 (PQ)]]転送、M2で385〜3,591の[[glossary/Post-Quantum|ポスト量子 (PQ)]]転送を処理できます。測定された証明生成速度では、1秒の証明生成予算は約400の署名をサポートします。現実的な[[glossary/Block-Building|ビルダー]]のスループット推定では、その追加の制約を考慮する必要があります。
-   4つのプロトタイプすべてが、M1からM2にかけて同じ[[glossary/Post-Quantum|ポスト量子 (PQ)]]アカウントコード、ストレージ、およびキーを維持します。

私たちは、[[glossary/Hegot|ヘゴタ (Hegotá)]]が本番環境対応の集約を待つことなく、[[glossary/Post-Quantum|ポスト量子 (PQ)]]認証を利用可能にすべきだと主張します。トランザクションアーキテクチャの選択は、即時の実装コストと、後のロードマップで必要となる変更、特にトランザクションアイデンティティ、クロスレイヤーインターフェース、[[glossary/gas|ガス]]会計、および[[glossary/leanPCS|leanPCS]]互換性の両方を考慮する必要があります。各設計にはトレードオフと改善の機会があります。この研究と並行して、[完全な実験レポート](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/REPORT.md)と[再現性パッケージ](https://github.com/lambdaclass/pq-hegota-comparison/releases/tag/v1.0.0)が利用可能です。

## 1\. ポスト量子実行に向けた最小限のロードマップ

本研究は、[イーサリアムを[[glossary/PQAI-day|量子コンピュータ/AI脅威到来日]]に備える](https://blog.lambdaclass.com/making-ethereum-ready-for-pqai-day/)および[[[glossary/PQ-Ethereum|耐量子イーサリアム (PQ Ethereum)]]のスケーリング](https://blog.lambdaclass.com/the-last-mile-scaling-post-quantum-ethereum/)に関する以前の作業に基づいています。ここでは、[[glossary/Hegot|ヘゴタ (Hegotá)]]でネイティブ[[glossary/Post-Quantum|ポスト量子 (PQ)]]署名を導入するための4つの具体的な提案と、それらの集約に向けたそれぞれの道筋を評価します。段階的なロードマップでは、ネイティブ[[glossary/Post-Quantum|ポスト量子 (PQ)]]署名の導入と、それらをスケーリングするために必要なインフラストラクチャを分離しています。

![01-pq-roadmap](https://ethresear.ch/uploads/default/optimized/3X/d/d/ddd6a1ae8c3656ed4e67e93d777dccf3c434e6aa_2_514x500.png "図1. 提案されたロードマップ。M1は最小限のHegotáターゲットであり、それ以降のマイルストーンは展開時期が未定のアーキテクチャ目標です。")

*図1. 提案されたロードマップ。M1は最小限の[[glossary/Hegot|ヘゴタ (Hegotá)]]ターゲットであり、それ以降の[[glossary/Consensus-Layer|マイルストーン]]は展開時期が未定のアーキテクチャ目標です。*

M1は、ユーザーに個別の検証を伴うネイティブ[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]認証を提供します。M2は、ブロック内の集約可能な署名を、その[[glossary/Block-Building|ビルダー]]によって生成された[[glossary/Recursive-proof|再帰的証明]]に置き換えます。M3aは、インフラストラクチャを[[glossary/leanPCS|leanPCS]]多項式コミットメントのオープニング証明に拡張します。M3bは、一部の集約を[[glossary/Mempool|メムプール (Mempool)]]に移動させ、そこで複数の証明が、生署名（raw signatures）と並行して異なるトランザクションセットをカバーできるようになり、ピアトラフィックと[[glossary/Block-Building|ビルダー]]に残された作業を潜在的に削減します。実験的な実装はM1とM2をカバーしています。

![02-transaction-lifecycle](https://ethresear.ch/uploads/default/optimized/3X/2/d/2d5dad440f547ed8945a3267f7501e01b28458c8_2_690x441.png "図2. ビルダー側集約は、十分な大きさのバッチに対してブロックサイズを削減しますが、メムプールバイトは変更しません。M3bでは、複数の集約と個別の署名が共存できます。ビルダーは互換性のある集約を結合し、残りのクレームをカバーします。サイズとバッチ構成は例示的なものです。")

*図2. [[glossary/Block-Building|ビルダー]]側集約は、十分な大きさのバッチに対して[[glossary/block size|ブロックサイズ]]を削減しますが、[[glossary/Mempool|メムプール (Mempool)]]バイトは変更しません。M3bでは、複数の集約と個別の署名が共存できます。[[glossary/Block-Building|ビルダー]]は互換性のある集約を結合し、残りのクレームをカバーします。サイズとバッチ構成は例示的なものです。*

私たちのハードウェア（セクション4）で完全なM2ブロックを証明するコストは、[[glossary/Post-Quantum|ポスト量子 (PQ)]]認証の展開と集約の準備状況を分離するという主張を強化します。私たちの見解では、M1は[[glossary/Hegot|ヘゴタ (Hegotá)]]の最小限の有用な成果物です。**集約の開発を継続しながら、ユーザーは[[glossary/Post-Quantum|ポスト量子 (PQ)]]認証に移行できるべきです。** 可能な限り、後の[[glossary/Consensus-Layer|マイルストーン]]を並行して追求すべきです。

## 2\. マイルストーン1の4つの代替案

提案は、暗号ステートメント（クレーム）をどのように宣言し、それらを満足させる署名または証明（証人）をどこに保持するかという点で異なります。3つの提案は[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]の証人をカノニカルなトランザクションとは別に保持し、1つはトランザクション内に埋め込みます。

![03-witness-representation](https://ethresear.ch/uploads/default/optimized/3X/d/a/dafb593a2abf05cfc3124862ceeab8b52947910e_2_654x499.png "図3. M1では、個別の署名が宣言されたクレームを満足させます。M2では、単一のブロックレベル証明が複数のトランザクションにわたるクレームをカバーします。インライン証人には明示的な省略とアイデンティティルールが必要です。インライン設計では、証人に依存しないトランザクションハッシュを定義できます。図は簡略化のため、トランザクションごとに1つの適格なクレームを示しています。")

*図3. M1では、個別の[[glossary/signatures|署名]]が宣言されたクレームを満足させます。M2では、単一のブロックレベル証明が複数のトランザクションにわたるクレームをカバーします。インライン証人には明示的な省略とアイデンティティルールが必要です。インライン設計では、証人に依存しない[[glossary/transaction hash|トランザクションハッシュ]]を定義できます。図は簡略化のため、トランザクションごとに1つの適格なクレームを示しています。*

分離は、トランスポート、ブロックコミットメント、およびペイロードの変更を前倒しします。インライン証人は、これらの変更を集約まで延期します。その後、トランザクションから証明を削除することの意味を定義する必要があります。どちらのアプローチも、M1の生署名（raw-signature）トラフィックを本質的に削減するものではありません。

![04-proposal-architectures](https://ethresear.ch/uploads/default/optimized/3X/2/f/2fe2af3286549458c81da484f26e8bee8525e3f3_2_401x500.jpeg "図4. 概念的なM1構造（例示的なエンコーディング）。A3は集約指向の設計ノートを適応させています。")

*図4. 概念的なM1構造（例示的なエンコーディング）。A3は集約指向の設計ノートを適応させています。*

| 代替案 | クレーム表現 | 検証者 | 既存の署名リスト | アカウントインターフェース |
| --- | --- | --- | --- | --- |
| A1: [[glossary/EIP-8504|EIP-8504 (Proof frames for leanSPHINCS signatures)]] | 実行不可能なPROOFフレーム; 96バイトの依存関係トリプル | スキームID | 維持 | フレーム内省 |
| A2: インラインPROOFフレーム | PROOFフレーム; キー、メッセージ、インライン証明 | 検証者アドレス | 置換 | PROOFPARAM |
| A3: 拡張署名リスト | 署名リスト内のエントリ; 別個の証人 | スキームID | 拡張 | 署名内省 |
| A4: 宣言的クレーム | `tx_body`内のクレームリスト; 別個の証人 | 検証者アドレス | 置換 | HASCLAIM |

A1（私たちの提案）は、当初[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]に限定された[[glossary/EIP-8288|EIP-8288]]の依存関係宣言アーキテクチャを導入し、既存の署名処理を維持します。A2はプルーフフレームを一般化します。その解決されたターゲットは、[[glossary/Precompile-target|検証プリコンパイル]]（secp256k1、P-256、[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]）または[[glossary/pure-context|ピュアコンテキスト]]で実行されるコントラクトベースの検証者を識別します。A3は最初から集約を記述しており、A1の証人メカニズムと費用を使用してM1に適合させます。A4は不透明でバージョン管理された`claim_witnesses`フィールドを保持し、[[glossary/EVM|EVM (イーサリアム仮想マシン)]]の外部でネイティブクレームを検証し、予約されたクレーム専用アドレスによってプロトコル検証者を識別します。また、コントラクトベースの検証もサポートします。

[[glossary/Precompile-target|検証プリコンパイル]]は、実行中に決定される入力を含む[[glossary/EVM|EVM (イーサリアム仮想マシン)]]呼び出しに対して、効率的なネイティブ暗号検証を公開します。これは、すべての検証入力を予測できないアプリケーションや、トランザクションを無効にすることなく検証失敗を処理する必要があるアプリケーションに役立ちます。[[glossary/Post-Quantum|ポスト量子 (PQ)]]アカウント認証は、A1のように事前宣言を使用することもできます。アカウントは、プロトコルによってその有効性が保証された、必要なメッセージと公開鍵のクレームをチェックします。A2の適格なPROOFフレームは、明示的なルールに基づいて集約できます。実行中のプリコンパイルへの通常の呼び出しは、その集約の恩恵を自動的に受けることはありません。A2のより広範な検証インターフェースは、インライン証人配置とは別の設計上の選択であり、最小限のM1成果物とは独立して検討できます。

## 3\. 実験

[[glossary/EIP-8504|EIP-8504 (Proof frames for leanSPHINCS signatures)]]に関する[私たちのコメント](https://github.com/ethereum/EIPs/pull/12672#issuecomment-7169444856)で議論したように、当初は提案全体で証人分離を優先していました。私たちは4つの代替案すべてを個別に実装および測定しましたが、その結果の一部はその優先順位に疑問を投げかけるものでした。

![05-experimental-methodology](https://ethresear.ch/uploads/default/optimized/3X/a/e/aed27f90a0c60a31213052a27578bf7a00075e32_2_676x500.png "図5. 共通のベースライン上の8つのethrexプロトタイプと、対応するethlambdaペイロード実装。実験的なフォーク割り当ては、M1がHegotá、M2がIStarです。後者は単なるテスト規則です。")

*図5. 共通のベースライン上の8つのethrexプロトタイプと、対応するethlambdaペイロード実装。実験的な[[glossary/fork|フォーク]]割り当ては、M1が[[glossary/Hegot|ヘゴタ (Hegotá)]]、M2がIStarです。後者は単なるテスト規則です。*

ベースラインはethrexの[`bogota-devnet-2`](https://github.com/lambdaclass/ethrex/commit/c9d292a4997faec4578598805f13ad04c1566c5d)で、送信者ごとに1つのsecp256k1認証済みフレームトランザクションを使用しています。[測定されたベースライン](https://github.com/lambdaclass/ethrex/commit/6cf389db73a59770978188ebc9cd37ad31d01953)には共通のハーネスが追加されています。4つの代替案すべてが同じ[[glossary/leanVM|leanVM]]リビジョン（`92a97c919b2f2d6fe09853090b6b23f781ecec07`）と7,740バイトの[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]署名を使用しています。私たちは、共通のインプロセスハーネスで、3つのワークロード（単一署名転送、コントラクト呼び出し、2つの署名）といくつかの[[glossary/block size|ブロックサイズ]]を使用して、送信、ピアアドミッション、[[glossary/Block-Building|ブロック構築]]、インポートを測定しました。各構成で3回のウォームアップと30回の時間計測イテレーションを行いました。時間は特に明記されていない限り中央値です。

メインホストはAMD Ryzen 9 9950X3D（16コア、32スレッド）、64 GB DDR5（4800 MT/s）、Debian 13です。パイプラインはデフォルトで32の実行スレッドを使用します。プールアドミッションと[[glossary/Block-Building|ビルダー]]実行はシングルスレッドで、プロバーは独自のプールを使用します。2番目のホストはスタンドアロンプロバーベンチマークを繰り返すために使用されました。すべての代替案はRust 1.97.1を使用し、ベースラインは1.93.0を使用します。リリースビルドはネイティブCPUをターゲットとしています。**私たちは各代替案の暫定的な[[glossary/gas|ガス]]スケジュールとリソース制限を維持しました。**

テスト、ツール、生成されたコード、共通セットアップとは別に、追加および削除されたプロダクションコードの行数をカウントし、M1とM2を段階的に比較します。[技術レポート](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/REPORT.md)には、すべてのワークロード、95パーセンタイル値、偏差、生データパス、テスト結果、固定されたリビジョンが含まれています。[実装インデックス](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/README.md#implementations-measured-trees-and-data)は、すべての代替案と[[glossary/Consensus-Layer|マイルストーン]]をそのソースコードと測定値にマッピングしています。比較では、さらなる最適化の余地がある機能プロトタイプを使用しています。いくつかの観測された違いは、最適化の選択、暫定的なリソースパラメータ、または共有された実装上の仮定から生じています。これらの要因をアーキテクチャ要件と並行して特定します。この記事では、測定された（measured）はハーネス/テストまたは行カウンターの結果を、計算された（computed）はそれらの結果または定数に対する算術演算を、推定された（estimated）は外挿を意味します。

## 4\. 結果

### 4.1 実装の複雑さとクロスレイヤーのスコープ

![06-implementation-complexity](https://ethresear.ch/uploads/default/optimized/3X/9/c/9c4a126676aa2b057933f4309aa7b90bd1ceeb12_2_690x349.png "図6. 共通の前提条件、IStarフォークセットアップ、テスト、ツールを除いた、追加および削除されたコード行数。合計は累積変更量を測定します。追加と削除の両方を含みます。")

*図6. 共通の前提条件、IStar[[glossary/fork|フォーク]]セットアップ、テスト、ツールを除いた、追加および削除されたコード行数。合計は累積変更量を測定します。追加と削除の両方を含みます。*

| プロダクションコード | A1 | A2 | A3 | A4 |
| --- | --- | --- | --- | --- |
| [[glossary/Execution-Layer|EL]] M1 追加 / 削除 | +2,634 / −111 | +991 / −588 | +2,589 / −120 | +2,660 / −717 |
| [[glossary/Execution-Layer|EL]] M2 増分 | +1,068 / −97 | +1,130 / −51 | +1,069 / −97 | +705 / −80 |
| [[glossary/Consensus-Layer|CL]] M1 | +523 / −26 | 0 | +523 / −26 | +493 / −27 |
| [[glossary/Consensus-Layer|CL]] M2 増分 | +351 / −140 | +490 / −25 | +351 / −140 | 0 |

*出典：[技術レポート、セクションD](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/REPORT.md)。[[glossary/Consensus-Layer|CL]]のカウントはプロダクションのみです。汎用[[glossary/fork|フォーク]]対応ペイロードデコード（プロダクション405/88行）の追加657行/削除140行は、すべての代替案から除外されていますが、A1/A3 M2ペイロード置換ではethlambdaでこのメカニズムが必要でした。*

A2は、証人分離に関する当初の予想に反して、M1および累積[[glossary/Execution-Layer|EL]]コード変更量が最小です。M1ではA1やA3よりも多くの既存コードを変更しています。A1は両方の[[glossary/Consensus-Layer|マイルストーン]]で最も多くのプロダクションコード行を追加し（3,702）、A4は最も高い変更量（4,162）ですが、M2の増分変更は最小です（785）。A1/A3は、基本設計では規定されていない暫定的なP2Pプロトコルバージョンにそれぞれ832行を追加しています。A4は既存のメッセージを使用しています。

![07-protocol-change-footprint](https://ethresear.ch/uploads/default/optimized/3X/8/c/8c6ff82284ec3c53e91ea515514b7ba4e73328cd_2_660x500.png "図7. 記録されたプロダクションコードの変更があるコンポーネント。セルはプロダクションコードが変更された場所を示します。A4はM2でブロックフォーマットコードを変更しますが、ヘッダーとペイロードスキーマは保持します。")

*図7. 記録されたプロダクションコードの変更があるコンポーネント。セルはプロダクションコードが変更された場所を示します。A4はM2でブロックフォーマットコードを変更しますが、ヘッダーとペイロードスキーマは保持します。*

A2はM1において[[glossary/Consensus-Layer|CL]]または[[glossary/Engine-API|Engine API]]の変更を必要としません。A1とA3は[[glossary/Execution-Payload|実行ペイロード]]を2回変更します。A4の不透明でバージョン管理されたフィールドは、M2で別のペイロード変更なしに証人表現を進化させることができます。これは、分離された設計において維持すべき特性です。[[glossary/Consensus-Layer|CL]]の実装は単体テストに合格しました。[[glossary/Execution-Layer|EL]]と[[glossary/Consensus-Layer|CL]]の共同ネットワークテストは未解決のままであり、行数はethlambdaに特有のものです。

### 4.2 マイルストーン1：ネイティブ[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]、集約なし

| 単一署名転送 | ベースライン | A1 | A2 | A3 | A4 |
| --- | --- | --- | --- | --- | --- |
| カノニカルな[[glossary/transaction|トランザクション]] (バイト) | 180 | 216 | 7,947 | 144 | 167 |
| 個別の署名 (バイト) | 0 | 7,740 | 0 | 7,740 | 7,740 |
| ピア形式 (バイト) | 182 | 8,073 | 7,950 | 8,001 | 7,921 |
| [[glossary/gas|ガス]] / [[glossary/transaction|トランザクション]] (最大ブロック時) | 26,038 | 521,803 | 519,009 | 521,024 | 66,876 |
| [[glossary/transaction|トランザクション]] / [[glossary/block|ブロック]] | 7,677 | 383 | 385 | 383 | 270 |
| [[glossary/block size|ブロックサイズ]] (MiB) | 1.333 | 2.908 | 2.920 | 2.882 | 2.038 |
| [[glossary/Block-gas-used|ブロックガス使用量]] | 99.9% | 99.9% | 99.9% | 99.8% | 9.0% |
| [[glossary/Block-Building|ブロック構築]]時間 (ms) | 318.15 | 20.98 | 48.53 | 20.09 | 16.21 |
| インポート, 32スレッドパイプライン (ms) | 65.95 | 46.23 | 9.51 | 45.97 | 34.28 |

*最大ブロックで測定。[[glossary/gas|ガス]]/[[glossary/transaction|トランザクション]]は測定された[[glossary/Block-gas-used|ブロックガス]]と[[glossary/transaction|トランザクション]]数から計算。[[glossary/block size|ブロックサイズ]]はMiB (2²⁰バイト) を使用。ベースラインはsecp256k1認証を使用。出典：[レポート、セクションBおよびC](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/REPORT.md)、転送ワークロード。*

A4の2 MiBの証人制限は、[[glossary/gas|ガス]]使用量のわずか9%で270の転送でインクルージョンを停止させます。[[glossary/transaction|トランザクション]]あたりの[[glossary/gas|ガス]]が低いのは、証人バイトあたり4[[glossary/gas|ガス]]（7,740バイトの署名で30,960[[glossary/gas|ガス]]）と、検証に13,200[[glossary/gas|ガス]]を課金しているためです。A1は個別の依存関係ごとに495,360[[glossary/gas|ガス]]、宣言された検証ごとに3,000[[glossary/gas|ガス]]を課金します。A3はこのスケジュールをプロトタイプで継承します。A2は検証に13,200[[glossary/gas|ガス]]を課金し、その署名バイトはテストされたワークロードの下で495,360[[glossary/gas|ガス]]の[[glossary/calldata-floor|コールデータフロア]]貢献を発生させます。A4の低い課金は暫定的な価格設定を反映しています。4つの代替案すべてが同じ署名スキームと検証ライブラリを使用しています。

残りの[[glossary/Execution-gas|実行ガス]]は、[[glossary/Post-Quantum|ポスト量子 (PQ)]]認証への移行中に[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]証人を持たない[[glossary/transaction|トランザクション]]を収容できます。しかし、完全に[[glossary/Post-Quantum|ポスト量子 (PQ)]]化されたイーサリアムでは、証人を持つ[[glossary/transaction|トランザクション]]が一般的になります。私たちの[[glossary/Post-Quantum|ポスト量子 (PQ)]]のみのワークロードでは、A4は270の転送で暫定的な証人制限に達し、[[glossary/Execution-gas|実行ガス]]予算の91%が未使用のままになります。この結果は、2つのリソース制限を同時に調整することの重要性を示しています。混合ワークロードと、個別のリソース予算に対する代替パラメータ値は、今後評価する必要があります。

署名がネットワークトラフィックを支配します。約8KBの[[glossary/transaction|トランザクション]]あたり7,740バイトです。A1は両方の[[glossary/Consensus-Layer|マイルストーン]]で最大のピア形式と最も遅い[[glossary/RPC|RPC]]/ピアアドミッション（M1で193.4/144.9 µs、M2で178.4/127.5 µs）を持っています。A4は最速のピアアドミッション（それぞれ164.4/119.9 µsと163.6/117.4 µs）を持っています。ネイティブ検証単独では、M1で署名あたり約95〜98 µsかかります。

### 4.3 マイルストーン2：[[glossary/Block-Building|ビルダー]]側集約

[[glossary/Block-Building|ビルダー]]は、ブロックの集約可能な[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]クレームに対して単一の[[glossary/Recursive-proof|再帰的証明]]を構築します。インポーターは、プロトタイプに従って、ブロック検証前または検証中にそのステートメントを再構築し、検証します。生署名（raw signatures）は引き続き[[glossary/Mempool|メムプール (Mempool)]]で受け入れられ、伝播されます。ドラフトがM2を未定義のままにしている場合、実験ではテストのために具体的なエンコーディングとルールを選択します。

| 単一署名転送 | A1 | A2 | A3 | A4 |
| --- | --- | --- | --- | --- |
| [[glossary/gas|ガス]] / [[glossary/transaction|トランザクション]] (最大ブロック時) | 56,444 | 519,009 | 55,664 | 66,876 |
| [[glossary/transaction|トランザクション]] / [[glossary/block|ブロック]] | 3,541 | 385 | 3,591 | 2,989 |
| [[glossary/block size|ブロックサイズ]] (MiB) | 1.023 | 0.355 | 0.808 | 0.768 |
| 集約証明 (バイト) | 299,736 | 290,680 | 322,088 | 299,832 |
| [[glossary/block|ブロック]]バイト / [[glossary/transaction|トランザクション]] | 303 | 965 | 236 | 269 |
| 含まれる[[glossary/transaction|トランザクション]]の合計P2Pバイト (MiB) | 27.262 | 2.919 | 27.401 | 22.579 |
| [[glossary/Block-Building|ブロック構築]]時間 (s) | 8.922 | 0.968 | 9.296 | 7.613 |
| インポート, 32スレッドパイプライン (ms) | 51.24 | 15.41 | 52.26 | 40.99 |

*200M[[glossary/gas|ガス]]での最大ブロック。[[glossary/gas|ガス]]/[[glossary/transaction|トランザクション]]、バイト/[[glossary/transaction|トランザクション]]、および合計ピアバイトは測定値から計算。合計P2Pバイトは、含まれる[[glossary/transaction|トランザクション]]のシリアライズされたピア形式（証人およびラッパーオーバーヘッドを含む）を合計したもの。実際のネットワークトラフィックは未測定。カウントは代替案によって異なる。[[glossary/Block-Building|ビルダー]]集約は[[glossary/transaction|トランザクション]]ごとのピア形式を変更しない。出典：[レポート、セクションC](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/REPORT.md)。*

![08-block-capacity](https://ethresear.ch/uploads/default/optimized/3X/d/6/d6963d4ede50f810eb27cb6c85806c0d24d6fdc9_2_690x468.png "図8. ビルド期限なしで測定されたM1/M2容量と、1秒または2秒の証明生成のみの予算での推定M2容量の比較。推定値は、約400署名/秒と測定されたガス制限容量を使用しています。予算は例示的なものであり、証明生成のみをカバーします。")

*図8. ビルド期限なしで測定されたM1/M2容量と、1秒または2秒の証明生成のみの予算での推定M2容量の比較。推定値は、約400署名/秒と測定された[[glossary/gas|ガス]]制限容量を使用しています。予算は例示的なものであり、証明生成のみをカバーします。*

A1/A3は、実験が495,360[[glossary/gas|ガス]]の証人料金を[[glossary/EIP-8288|EIP-8288]]の30,000[[glossary/gas|ガス]]の宣言料金に置き換えるため、容量が増加します。A1はこの移行を未定のままにし、A3は[[glossary/gas|ガス]]スケジュールを未指定のままにしています。A4は、集約によって拘束する生証人バイト制約が削除されるため、容量が増加します。その[[glossary/gas|ガス]]スケジュールは変更されません。A2は、証明の省略後も支払い者の料金を維持するという固定された提案のルールに従います。元の7,740署名バイトは、依然として495,360[[glossary/gas|ガス]]を[[glossary/calldata-floor|コールデータフロア]]に貢献します。その結果、容量は385の転送にとどまります。インライン証人に対する異なる価格設定ルールは、その結果を変える可能性があります。A4も省略された証人バイトに対して引き続き料金を課金します。

![09-networking-overhead](https://ethresear.ch/uploads/default/optimized/3X/2/7/273311f0e35fdddfec83eadbe7a5fc4b7b1a4585_2_690x389.png "図9. M2のシリアライズされたブロックサイズと、含まれるトランザクション（個別の証人を含む）のP2Pエンコードされたサイズの合計。例えば、A1は1.02 MiBのブロックを構築するために約27.26 MiBのデータが必要です。計算されたP2P合計には、再送信、ピア数、その他のネットワークオーバーヘッドは含まれません。カウントは代替案によって異なります。ビルダー集約はトランザクションごとのピア形式を変更しません。")

*図9. M2のシリアライズされた[[glossary/block size|ブロックサイズ]]と、含まれる[[glossary/transaction|トランザクション]]（個別の証人を含む）のP2Pエンコードされたサイズの合計。例えば、A1は1.02 MiBの[[glossary/block|ブロック]]を構築するために約27.26 MiBのデータが必要です。計算されたP2P合計には、再送信、ピア数、その他のネットワークオーバーヘッドは含まれません。カウントは代替案によって異なります。[[glossary/Block-Building|ビルダー]]集約は[[glossary/transaction|トランザクション]]ごとのピア形式を変更しません。*

A1/A3/A4は、より多くの転送をより小さなブロックに収めます。A2は、M1の[[glossary/transaction|トランザクション]]数を維持しながら、[[glossary/block size|ブロックサイズ]]の絶対的な削減を最大化します。3つの増加する代替案の中で、A1は含まれる転送あたりのブロックバイト数が最も多いです（303対236および269）。1つの署名のバッチの場合、M2はブロックを約8.6 KBから202〜204 KBに増加させます。証明が生署名（raw signatures）よりも小さいと測定された最初のスタンドアロンバッチは64です。A2の検証ルールは、空の集約証明を持つ非ストリップ[[glossary/transaction|トランザクション]]を許可します。ベンチマークされた[[glossary/Block-Building|ビルダー]]は常に集約します。他のプロトタイプはM2で集約されたブロック形式を必要とします。

### 4.4 M1とM2の直接比較

以下の表は、[[glossary/Consensus-Layer|マイルストーン]]間の変更を、まず最大ブロックで、次に固定ワークロードで分離しています。

| メトリック (M1 → M2) | A1 | A2 | A3 | A4 |
| --- | --- | --- | --- | --- |
| [[glossary/gas|ガス]] / [[glossary/transaction|トランザクション]] | 521,803 → 56,444 | 519,009 → 519,009 | 521,024 → 55,664 | 66,876 → 66,876 |
| [[glossary/Post-Quantum|PQ]]転送 / [[glossary/block|ブロック]] | 383 → 3,541 | 385 → 385 | 383 → 3,591 | 270 → 2,989 |
| [[glossary/block size|ブロックサイズ]] (MiB) | 2.908 → 1.023 | 2.920 → 0.355 | 2.882 → 0.808 | 2.038 → 0.768 |
| [[glossary/Block-Building|ブロック構築]]時間 (ms) | 20.98 → 8,921.97 | 48.53 → 968.14 | 20.09 → 9,296.29 | 16.21 → 7,612.61 |
| [[glossary/Block-import|ブロックインポート]] (ms, 32スレッドパイプライン) | 46.23 → 51.24 | 9.51 → 15.41 | 45.97 → 52.26 | 34.28 → 40.99 |

*各プロトタイプの暫定的な[[glossary/gas|ガス]]およびバイト制限（200M[[glossary/gas|ガス]]制限、証明生成期限なし）の下での最大ブロックにおける単一署名転送。[[glossary/transaction|トランザクション]]あたりの[[glossary/gas|ガス]]は計算値。サイズと時間はハーネスから取得。出典：[レポート、セクションC](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/REPORT.md)、[[glossary/Consensus-Layer|マイルストーン]]1と[[glossary/Consensus-Layer|マイルストーン]]2を並列。*

| 256 [[glossary/Post-Quantum|PQ]]転送 (M1 → M2) | A1 | A2 | A3 | A4 |
| --- | --- | --- | --- | --- |
| [[glossary/block size|ブロックサイズ]] (MiB) | 1.944 → 0.352 | 1.942 → 0.349 | 1.927 → 0.333 | 1.932 → 0.339 |
| [[glossary/Block-Building|ブロック構築]]時間 (ms) | 13.89 → 637.54 | 32.28 → 641.68 | 13.41 → 618.59 | 7.65 → 609.50 |
| [[glossary/Block-import|ブロックインポート]] (ms, 32スレッドパイプライン) | 30.98 → 14.05 | 6.69 → 13.71 | 30.95 → 13.88 | 32.31 → 13.54 |

*各[[glossary/block|ブロック]]に正確に256の単一署名転送。中央値時間、デフォルト32スレッドインポートパイプライン、[[glossary/block size|ブロックサイズ]]は測定されたバイトからMiBに変換。出典：[レポート、セクションBおよびC](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/REPORT.md)、転送スケーリングテーブル。*

同じ[[glossary/transaction|トランザクション]]数で、M2は[[glossary/block size|ブロックサイズ]]を大幅に削減し、すべての代替案で[[glossary/Block-Building|ブロック構築]]時間を増加させます。このワークロードでは、インポートは3つの分離されたプロトタイプで高速化し、A2では遅くなります。以下で議論するネイティブ検証並列性の違いは、これらのインポート時間を解釈する上で重要です。

### 4.5 集約は拘束的な運用上の制約である

![10-aggregation-scalability](https://ethresear.ch/uploads/default/optimized/3X/8/b/8b262cc41bfbba7fe404914e148905769a7944e3_2_690x399.png "図10. メインホストでのスタンドアロンleanVM証明生成の中央値とp95、512署名リーフ、レート1/2、全スレッド。水平ガイドは例示的な証明生成のみの予算です。1回限りのセットアップは除外されています。")

*図10. メインホストでのスタンドアロン[[glossary/leanVM|leanVM]]証明生成の中央値と95パーセンタイル値、512署名リーフ、レート1/2、全スレッド。水平ガイドは例示的な証明生成のみの予算です。1回限りのセットアップは除外されています。*

256の単一署名転送という同じワークロードで、[[glossary/Block-Building|ブロック構築]]は4つのM2実装すべてで609.50〜641.68ミリ秒かかります。共有プロバーがコストを支配します。最大ブロックでは、A1/A3/A4は7.6〜9.3秒かかりますが、A2は385署名で0.97秒です。4つのプロトタイプすべてが、証明生成作業の時間制限、[[glossary/Block-Building|ビルダー]]の期限、およびフォールバックメカニズムを必要とします。これらは[[glossary/Block-Building|ビルダー]]側集約における共通のライブネスに関する懸念事項です。

プロバーは、このホストで128から4,096までの測定されたバッチサイズで、約383〜423署名/秒を処理します。1秒の証明生成予算に収まる最大のサンプリングされたバッチは256署名であり、2秒では512署名です。約400署名/秒で補間すると、図8の推定値が得られます。これらの推定値には、実行、ネットワーク遅延、および1回限りのプロバーセットアップ（プロセスあたり0.72〜0.77秒）は含まれていません。4,096署名では中央値は10.595秒です。同じCPUでメモリが遅い2台目のマシンでは、約23%遅くなりました。メモリ帯域幅が1つの考えられる説明であり、原因を特定するにはさらなる測定が必要です。ライフサイクル中の最大RSSは0.55〜0.62 GiB（ベースライン/M1）から3.29 GiB（A2 M2）および4.56〜4.69 GiB（A1/A3/A4 M2）に増加し、スタンドアロンプロバーはこの構成で約4.17 GiBでピークに達します。

![11-verification-tradeoff](https://ethresear.ch/uploads/default/optimized/3X/f/b/fb6d147fb50ce2cd757e9b95d298d9d7669d0209_2_690x404.png "図11. スタンドアロンのシーケンシャルネイティブ検証と集約証明検証の比較。256署名での個別に測定された32スレッドネイティブ検証も示されています。並列結果は、256署名での単一のマイクロベンチマークポイントです。")

*図11. スタンドアロンのシーケンシャルネイティブ検証と集約証明検証の比較。256署名での個別に測定された32スレッドネイティブ検証も示されています。並列結果は、256署名での単一のマイクロベンチマークポイントです。*

集約は、サンプリングされたバッチで128署名からシーケンシャル検証時間を短縮します。並列検証では、ネイティブ署名はより大きなバッチでも競争力を維持します。256署名では、32スレッドで約1.3ミリ秒かかりますが、1つの証明では9.13ミリ秒かかります。A2のM1ブロックインポートが高速なのは、並列[[glossary/transaction|トランザクション]]実行内で検証を行うためです。A1/A3/A4は、実行前に証人をシーケンシャルに検証します。スタンドアロンのマイクロベンチマークは、ネイティブ証人検証を並列化することでA1/A3/A4を大幅に改善する余地があることを示唆しており、これは今後の作業として残されています。A1/A3のA2に対する残りのシングルスレッドの不利な点は、原因が特定されていません。A2は、他の3つとは異なり、M1[[glossary/Block-Building|ビルダー]]で署名を再度検証します。検証結果を安全に再利用し、P2Pトランスポートを合理化することで、追加のオーバーヘッドを削減できます。これらの実装の非対称性は、提案全体での最適化の機会を特定します。

実験は、集約とは独立したM1のケースを支持します。M2には、制限された証明生成作業、時間認識型[[glossary/Block-Building|ブロック構築]]、および安全なフォールバックメカニズムが必要になります。[[glossary/Mempool|メムプール (Mempool)]]集約は、[[glossary/Block-Building|ブロック構築]]前にその作業の一部を分散させる可能性があります。その[[glossary/Block-Building|ビルダー]]遅延への影響は未測定です。

### 4.6 [[glossary/Block-Building|ビルダー]]側集約は必須とすべきか？

測定された証明生成速度では、集約を必須にすると、[[glossary/Block-Building|ブロック構築]]の障壁が高まり、より高い証明生成能力を持つ[[glossary/Block-Building|ビルダー]]が競争力を高める可能性があります。A2の実験的な検証ルールは、すでに生署名（raw signatures）と空の集約証明のみを含むブロックを許可しています。ベンチマークされた[[glossary/Block-Building|ビルダー]]は常に集約します。A1、A3、A4は、M2プロトタイプで[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]クレームの集約を要求します。他の集約ポリシーは、4つのアーキテクチャすべてで引き続き可能です。

検討に値する代替案は、オプションまたはハイブリッド集約です。[[glossary/Block-Building|ビルダー]]が有効な生、集約済み、または混合ブロック表現を選択できるようにします。[[glossary/Block-Building|ビルダー]]は、証明生成予算内でカバーできるクレームのみを集約し、残りの個別の証人を保持できます。有効なフォールバックは、適用される[[glossary/gas|ガス]]およびバイト制限に適合する必要があり、[[glossary/transaction|トランザクション]]を破棄してブロックを再構築する必要がある場合があります。[[glossary/Consensus-Layer|コンセンサス層]]は、必要なすべてのクレームを決定論的に識別および検証し、集約証明と残りの証人をそのクレームにバインドし、リソース会計またはカバレッジのギャップを防ぐ必要があります。バージョン管理された証人コンテナは、[[glossary/transaction|トランザクション]]形式を再度変更することなく、これらの表現をサポートできます。これらの選択をサポートするには、M2ブロックの有効性ルールを拡張し、[[glossary/EIP-8288|EIP-8288]]と調和させる必要があります。

十分な証明生成能力があったとしても、[[glossary/Block-Building|ビルダー]]は一部の証人を生形式で保持することから恩恵を受けることができます。集約が証人バイトを削減するバッチサイズは、検証時間を削減するバッチサイズとは異なります。ライフサイクル実験では、単一署名ブロックは、集約されると約8.6 KBから200 KB以上に増加します。

補完的なスタンドアロンベンチマークは、Apple M3 Pro（11コア：パフォーマンス5、効率6。36 GB RAM）で[リビジョン`b3fa806`の[[glossary/leanVM|leanVM]]](https://github.com/leanEthereum/leanVM/tree/b3fa806724b8d44daa48a544481c186a0a88ff9e)を使用し、4つの[[glossary/WHIR|WHIR]]レートと最大512署名のバッチサイズでこれらのクロスオーバーを評価します。以下の結果は、この個別の測定キャンペーンからのものです。

| [[glossary/WHIR|WHIR]]レート | サイズクロスオーバー (署名) | 検証クロスオーバー (1スレッド) | 検証クロスオーバー (5スレッド) | 検証クロスオーバー (11スレッド) |
| --- | --- | --- | --- | --- |
| 1/2 | 35 | ~99 | ~464 | ~695* |
| 1/4 | 22 | ~88 | ~411 | ~615* |
| 1/8 | 19 | ~80 | ~376 | ~562* |
| 1/16 | 17 | ~77 | ~362 | ~541* |

*サイズクロスオーバーは、集約がすべてのより大きなサンプリングバッチで小さくなる最初のサンプリングバッチです。検証クロスオーバーは、N ≥ 2k（kは検証スレッド）のネイティブ検証ウォールタイムへの線形フィットから推定されたもので、バッチサイズ全体の中央値の証明デコードと検証時間の中央値の合計を使用しています。各構成は11回の時間計測ラウンドを使用します。アスタリスクでマークされた値は、512署名を超えて外挿されています。証明サイズは近くのバッチ間で変動します。公開鍵とメッセージは両方の表現で必要であり、サイズ比較からは除外されています。*

レート1/2では、証明は並列ネイティブ検証の検証遅延と一致するかなり前に、実質的な証人バイトを節約できます。512署名の場合、集約は生署名（raw signatures）の3.96 MBと比較して、約314 KBを占めます。証明のデコードと検証には9.56ミリ秒かかります。ネイティブ検証は、個別のネイティブ検証スイープで11スレッドで6.63ミリ秒かかります。後者はスカラー[[glossary/Keccak-256-hash|Keccak-256ハッシュ]]を使用し、署名をスレッド間で動的に分散します。より高速なネイティブハッシュは、クロスオーバーをさらにシフトさせる可能性があります。

[[glossary/WHIR|WHIR]]レートも証明生成コストに影響します。512署名の場合、レート1/2から1/16に変更すると、証明サイズは約314 KBから170 KBに減少し、証明生成時間は2.51秒から24.01秒に増加します。これらの証明生成時間は単一のウォームプロセス測定値であり、暗号パラメータは暫定的なものです。有用な集約しきい値は、バッチサイズ、証明生成コスト、帯域幅、検証者並列性、およびリソース価格設定に依存します。オプションの集約により、[[glossary/Block-Building|ビルダー]]は、これらのトレードオフが変化するにつれて、プロトコル定義の制限内で表現を選択できます。

設計上の問題は、実行と認証の会計を、生または集約された証人を保持するために必要なリソースから分離するかどうかです。[[glossary/Block-Building|ビルダー]]が[[glossary/transaction|トランザクション]]が署名された後に表現を選択する場合、その選択がその実行セマンティクスや手数料責任を予期せず変更すべきではありません。個別のブロックレベルの証人予算は、予測可能な送信者向け[[glossary/gas|ガス]]スケジュールを維持しながら、より利用可能な容量で圧縮に報酬を与えることができます。生形式と集約形式の両方で、明示的な検証とバイト制限が必要になります。このリソース会計モデルのテストは今後の作業です。

[[glossary/Block-Building|ビルダー]]は、集約が拘束リソースを解放する場合、より小さなブロック（潜在的に高速な伝播）、より大きな[[glossary/transaction|トランザクション]]容量、および追加の優先手数料または[[glossary/MEV|MEV（最大抽出可能価値）]]機会から恩恵を受けることができます。これらの利点は、証明生成コスト、メモリ要件、およびより早い[[glossary/Block-Building|ブロック構築]]期限の機会費用と競合します。A2の現在の[[glossary/gas|ガス]]スケジュールでは、より小さなブロックは同じ[[glossary/gas|ガス]]使用量を維持し、直接的な容量インセンティブを制限します。[[glossary/transaction|トランザクション]]あたりの[[glossary/gas|ガス]]が低いと、同じ[[glossary/tip-per-gas|ガスあたりのチップ]]で[[glossary/transaction|トランザクション]]あたりの優先手数料収入も減少する可能性があります。オプションの集約は、より多く集約できる[[glossary/Block-Building|ビルダー]]に競争上の優位性を維持しながら、最小限のハードウェア要件を削減できる可能性があります。[[glossary/Mempool|メムプール (Mempool)]]集約は、その利点の一部を上流に分散させることができます。オプションまたはハイブリッドポリシーが[[glossary/Block-Building|ビルダー]]の経済性と[[glossary/Block-production|ブロック生成]]に与える影響は、未解決の研究課題です。

## 5\. マイルストーン1からマイルストーン2への移行

| 代替案 | M2プロトタイプでの変更点 |
| --- | --- |
| A1 | ブロック証人リストとヘッダーコミットメントを[[glossary/EIP-8288|EIP-8288]]スタイルの証明と依存関係コミットメントに置き換え、[[glossary/gas|ガス]]スケジュールを変更する。[[glossary/transaction|トランザクション]]、宣言、ラッパーを再利用する。 |
| A2 | ストリップされたプルーフフレームエンコーディング、ブロック証明とコミットメント、[[glossary/Engine-API|Engine API]]/[[glossary/Consensus-Layer|CL]]フィールド、および[[glossary/transaction identity|トランザクションアイデンティティ]]の新しい処理を導入する。M1[[glossary/gas|ガス]]スケジュールを維持する。 |
| A3 | A1と同じブロック側移行で、署名リストエントリから派生した依存関係を持つ。 |
| A4 | 集約証明を保持する`claim_witnesses`の新しいバージョンを導入する。同じヘッダーとペイロードフィールド、プールされた形式、[[glossary/gas|ガス]]スケジュールを維持する。 |

4つのプロトタイプすべてが、[[glossary/EIP-7702|EIP-7702]]と[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]（共通テストで133,110[[glossary/gas|ガス]]）を使用して既存のsecp256k1制御アカウントを正常に移行し、古いキーと間違った[[glossary/Post-Quantum|PQ]]キーによる認証を拒否し、新しいキーによる認証を受け入れます。個別の移行テストでは、[[glossary/Hegot|ヘゴタ (Hegotá)]]と実験的なIStar全体で同じアカウントコードハッシュとストレージルートを維持し、アップグレード後に署名されプールされた[[glossary/transaction|トランザクション]]を含みます。

| テストされた互換性 (M1 → M2) | A1 | A2 | A3 | A4 |
| --- | --- | --- | --- | --- |
| 同じアカウントコードとストレージ | はい | はい | はい | はい |
| 同じ署名ハッシュ; [[glossary/pre-fork-signature-usable|フォーク前の署名が使用可能]] | はい | はい | はい | はい |
| 同じ[[glossary/pooled-encoding|プールされたエンコーディング]] | はい | はい | はい | はい |
| 集約前後の[[glossary/canonical-transaction-bytes|カノニカルなトランザクションバイト]]が同一 | はい | いいえ (ストリップ済み) | はい | はい |
| 同じプール/ブロック[[glossary/transaction hash|トランザクションハッシュ]] | はい | いいえ | はい | はい |
| 移行テストで同じ[[glossary/gas|ガス]] | いいえ (−465,360) | はい | いいえ (−465,360) | はい |
| 追加のアカウント移行 | 不要 | 不要 | 不要 | 不要 |

*出典：[レポート、セクションE](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/REPORT.md)、移行テスト。[[glossary/gas|ガス]]の数値は移行テストのワークロードを参照。変更は495,360から30,000を引いたもの。*

![12-transaction-identity](https://ethresear.ch/uploads/default/optimized/3X/7/5/75760c53f0e1b3a85e2ada615db2403f98791263_2_690x428.png "図12. 私たちの実験的なA2 M2実装は、プール内の完全なトランザクションとブロック内のストリップされたエンコーディングをハッシュします。署名ハッシュは安定しています。提案は、ストリップされたエンコーディングとそのトランザクションハッシュルールを未定のままにしているため、図示されたハッシュ変更はプロトタイプで選択されたルールに従います。")

*図12. 私たちの実験的なA2 M2プロトタイプは、プール内の完全な[[glossary/transaction|トランザクション]]とブロック内の[[glossary/stripped-encoding|ストリップされたエンコーディング]]をハッシュします。[[glossary/signing-hash|署名ハッシュ]]は安定しています。提案は、[[glossary/stripped-encoding|ストリップされたエンコーディング]]とその[[glossary/transaction hash|トランザクションハッシュ]]ルールを未定のままにしているため、図示されたハッシュ変更はプロトタイプで選択されたルールに従います。*

私たちのA2 M2プロトタイプでは、提出されたハッシュは含まれる[[glossary/transaction|トランザクション]]を識別しなくなり、[[glossary/stripped-encoding|ストリップされたエンコーディング]]は[[glossary/reorg-resistant|リorg]]後にプールに戻ることができません。これらの影響は、プロトタイプのエンコーディングとハッシュルールに起因します。証人に依存しないカノニカルハッシュと、署名を回復または保持するメカニズムでこれらに対処できます。A2の最終的なM2設計では、[[glossary/transaction-identity|トランザクションアイデンティティ]]を証人省略全体で明示的に定義する必要があり、これには[[glossary/transaction|トランザクション]]追跡、インデックス作成、および[[glossary/reorg-resistant|リorg]]処理への影響が含まれます。[[glossary/reorg-resistant|リorg]]後の証人可用性については、4つの設計すべてでさらなる作業が必要です。完全な[[glossary/reorg-resistant|リorg]]リカバリーは未テストのままです。A1/A3は、すでに署名された[[glossary/transaction|トランザクション]]を再価格設定しながら[[glossary/transaction-identity|トランザクションアイデンティティ]]を維持し、一部の[[glossary/RPC|RPC]][[glossary/gas|ガス]]表示とヒューリスティックは依然としてM1値を使用しています。ウォレット、インデクサー、その他のインフラストラクチャの透過的なアップグレードは、安定したアカウントバイトコードだけでなく、これらのインターフェースにも依存します。

### 長期ロードマップとの互換性

以下の評価は、固定されたリビジョンでの仕様を比較したものです。M3は実装とベンチマークの範囲外です。

| ロードマップ項目 | A1 | A2 | A3 | A4 |
| --- | --- | --- | --- | --- |
| [[glossary/leanPCS|leanPCS]] | 新しいクレームスキームで依存関係宣言を拡張する。具体的なエンコーディングと可視性ルールを、進化するドラフトと整合させる。 | 読み取り可能なプルーフフレームは道筋を提供する。宣言、ラッパー、[[glossary/gas|ガス]]は未定。 | [[glossary/leanPCS|PCS]]エントリはスケッチ済み。オペコード/可視性ルールは検討が必要。 | アプリケーションクレームは適合。署名を証明トランスクリプトとする問題は未解決。 |
| [[glossary/Mempool|メムプール (Mempool)]]集約 | 複数の[[glossary/transaction|トランザクション]]とモード1にラッパーを拡張する。 | 証人省略/ハッシュ/トランスポートルールは未定。 | [[glossary/EIP-8288|EIP-8288]]ラッパーを前提とする。依存関係ルールを再定義する。 | プールされたラッパーを拡張するか、複数[[glossary/transaction|トランザクション]]ラッパーを導入する。 |
| [[glossary/EIP-8288|EIP-8288]] | 同じ依存関係フレーム表現。ブロックフィールドと[[glossary/gas|ガス]]が変更される。 | クレームをマッピングし、モード衝突を解決し、フィールドと[[glossary/gas|ガス]]を定義する。 | [[glossary/Recursive-proof|再帰的]]ラッパー/証明を保持し、フレームベースの依存関係ルールを置き換える。 | 独自のクレームアーキテクチャがフレーム/コミットメントインターフェースを置き換える。 |

[[glossary/EIP-8504|EIP-8504 (Proof frames for leanSPHINCS signatures)]]は、当初[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]に限定された[[glossary/EIP-8288|EIP-8288]]の依存関係宣言アーキテクチャの最小限の展開として設計されました。ロードマップが[[glossary/leanSTARK|leanSTARK]]から[[glossary/leanPCS|leanPCS]]へと進化するにつれて、私たちの意図はアーキテクチャを維持し、新しいクレームスキームで拡張することです。[[glossary/EIP-8504|EIP-8504 (Proof frames for leanSPHINCS signatures)]]は署名リストを保持し、アプリケーションレベルの[[glossary/leanPCS|leanPCS]]クレームと認証に使用される証明の両方への直接的なアーキテクチャパスを提供します。[固定された[[glossary/EIP-8288|EIP-8288]]](https://github.com/ethereum/EIPs/blob/ade9e9cab7e148bba4cd293f916a4a189cd7a8aa/EIPS/eip-8288.md)は固定96バイトの依存関係トリプルを使用します。個別の[leanPCSドラフト](https://github.com/leanEthereum/leanPCS/blob/38432076ad4b8154f427f4e0eb851e8f799d8dc3/eip-draft_leanPCS.md)は、宣言を`scheme || payload`に一般化し、`SIGDATACOPY`の可視性ルールを変更します。したがって、[[glossary/leanPCS|leanPCS]]の具体的な形式、検証ルール、価格設定、および証人処理は、進化する仕様と整合させる必要があり、既存の[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]宣言形式とセマンティクスを維持する必要があります。意図された拡張は、依存関係アーキテクチャ内の仕様の整合性を通じて実装できます。すべての既存のアカウントとコントラクトが最終ルールの下でその動作を維持するかどうかは、まだ確認が必要です。完全な[[glossary/leanPCS|leanPCS]]統合は、この実験の範囲外です。A4のバージョン管理されたコンテナは、クロスレイヤー進化にとって魅力的です。[[glossary/transaction|トランザクション]]なしで[[glossary/EIP-8288|EIP-8288]]の依存関係コミットメントチェックをサポートするには、追加のコミットメント設計作業が必要になります。そのコミットメントの設計、制限、および検証ルールは、コンテナの選択と並行して重要です。A3とA2のより広範な認証インターフェースも同様に、アプリケーションが読み取ることができる証明に対して明示的なルールを必要とします。

## 6\. 制限と再現性

ライフサイクルの結果は、1つの[[glossary/Execution-Layer|EL]]クライアントと1つの主要な測定ホスト上のプロトタイプを記述しています。クロスクライアント評価と本番環境対応には、さらなる検証が必要です。特に：

-   **正確性のカバレッジ:** [[glossary/Hegot|ヘゴタ (Hegotá)]]以前の15,336個のフィクスチャファイルはすべて、各ツリーで合格します。リグレッション実行は`tests@v21.0.0`と`tests-bogota-devnet@v2.0.0`を使用します（[方法論](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/METHODOLOGY.md)と[リグレッション記録](https://github.com/lambdaclass/pq-hegota-comparison/tree/1ecc9b643dcdebf70b59e31b3655e23b38772c95/data/ef)を参照）。分離されたプロトタイプは、ヘッダーエンコーディングが異なるため、既存の3,428個の[[glossary/Hegot|ヘゴタ (Hegotá)]]ファイルを使用できません。A2は2,328個に合格し、1,100個に失敗します。これは主に[[glossary/transaction|トランザクション]]エンコーディングまたは予想される拒否理由によるものです。[[glossary/Hegot|ヘゴタ (Hegotá)]]と移行フィクスチャ全体で、6つのファイル中の34のケースがA2で[[glossary/gas|ガス]]が異なります（15個は少なく、19個は多く、18個は約2M多い）。[[glossary/Precompile-target|検証プリコンパイル]]アドレスが妥当な説明ですが、個々のケースのトレースは未解決です。新しい[[glossary/Hegot|ヘゴタ (Hegotá)]]フィクスチャが必要です。12個の共通ハーネスチェックはすべて、ベースラインと8つの実験ツリーで、指定された範囲内で合格します。これらは[[glossary/transaction|トランザクション]]ライフサイクル、アカウント移行、およびネガティブケースをカバーし、各測定前に測定ホストで再度実行されました。A1/A3では、不一致の証人コミットメントはパイプラインによって拒否され、シーケンシャルM1インポートパスによって受け入れられます。これはベースラインクライアントのヘッダー/ボディチェックのギャップであり、A4とM2はそれを拒否します。ブランチスイートのカウントは、実装者報告のテスト実行（各最終ブランチで2,620〜2,654個のワークスペーステストが合格、失敗なし）から得られたものです。これらのスイートは最終レポートのために繰り返されませんでした。
-   **比較可能性:** [[glossary/gas|ガス]]スケジュール、バイト制限、P2Pトランスポート、および並列検証が異なります。A3 M1はA1のメカニズムを借用しています。M2エンコーディングと[[glossary/gas|ガス]]移行は実験的な選択です。ハーネスはビルド期限なしでプールを排出し、プロセスセットアップを共有し、ネットワーク伝播を測定しません。ベースラインコンパイラが異なります。同サイズおよび最大容量の比較は、異なる質問に答えます。
-   **スコープ:** [[glossary/Execution-Layer|EL]]–[[glossary/Consensus-Layer|CL]]エンドツーエンドネットワークテスト、セキュリティ監査、ステートレスノードのパフォーマンス、混合ブロック、[[glossary/leanPCS|leanPCS]]、[[glossary/Mempool|メムプール (Mempool)]]集約、またはオプションの集約測定はありません。[[glossary/EIP-7825|EIP-7825]][[glossary/gas|ガス]]上限チェックは、測定されたすべてのツリーでアドミッション時ではなく実行時に行われます。完全な技術レポートには、さらなる未解決のケースと実装の非対称性が記載されています。

[技術レポート](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/REPORT.md)には、完全な表、方法論、および再現コマンドが記載されています。AIエージェントはプロトタイプの実装とレポート作成を支援しました。測定値と正確性の結果は、記録されたハーネスとテスト実行に紐付けられています。[検証記録](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/VERIFICATION.md)には、生の測定値に対するセカンドリーダーチェックが記載されています。2つのエラー、2つのサポートされていないアサーション、17の不正確さが修正され、追加の発見が含まれています。そのスコープには、仕様分析（A、F、およびEのほとんど）と、コンポーネントへの行の独立した再帰属は含まれません。レビューは記録された証拠とレポートを照合します。独立したベンチマーク再現は未解決のままです。

実装コミット、測定されたツリー、および仕様リビジョンは[COMMITS.md](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/COMMITS.md)にあります。完全な結果テーブルは[RESULTS.md](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/RESULTS.md)にあります。[公開実験リポジトリ](https://github.com/lambdaclass/pq-hegota-comparison)と[リリースv1.0.0](https://github.com/lambdaclass/pq-hegota-comparison/releases/tag/v1.0.0)には、生のサンプル、ハーネス、スクリプト、スタンドアロン集約ベンチマーク、および設計ノートが含まれています。測定されたベースライン、4つの[[glossary/Execution-Layer|EL]]実装、および対応する[[glossary/Consensus-Layer|CL]]実装が公開されています。A4 M2の場合、測定には公開されたコミットと同じツリーを持つ未公開の作業コミットが使用されました。一部の補助的な作業コミットは公開されていません。ほとんどは同じツリーまたはパッチを持つ公開された同等物があります。古い証人リストを保持しながら集約証明を追加するセカンダリのethlambdaバリアントは公開されていないため、その補助的な行数は公開コミットから再現できません。6つの再配布可能な仕様スナップショットは変更されずに含まれています。A3のノートは、再配布ではなく元のURLとSHA-256で識別されます（[仕様スナップショット](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/specs/README.md)を参照）。公開リリースは、ライフサイクル実験とその元のスタンドアロンプロバーベンチマークをカバーしています。セクション4.6の補足的なクロスオーバースイープは、異なるマシンと[[glossary/leanVM|leanVM]]リビジョンを使用しています。その生の記録とベンチマークコードはリリースv1.0.0の範囲外です。

私たちの実装が意図された設計をどれだけ忠実に表現しているか、測定方法論、および実装の選択によって生じる避けられない欠点について、提案の著者や他のクライアントチームからのフィードバックを特に歓迎します。プロトタイプを改善できる場合、仮定が誤っていることが判明した場合、または測定を再検討する必要がある場合、私たちは喜んで必要な変更を行い、同等の条件下で実験を繰り返し、公開された結果と結論をそれに応じて更新します。

## 7\. 結論

M1では、プロトタイプは証人表現全体で同様のピアサイズを示し、実装カウントはA2に有利です。実験では、証人分離が他のアーキテクチャ上のパフォーマンス上の利点を提供するかどうかは未解決のままです。M2では、分離された設計はこれらのプロトタイプで[[glossary/transaction|トランザクション]]エンコーディングとハッシュを維持します。A4は最小の増分コード変更量であり、A1とA3はA2に近いです。A2は依然として最小の累積[[glossary/Execution-Layer|EL]]変更量を持っています。A4は不透明でバージョン管理されたペイロードの価値を示しています。A1は[[glossary/EIP-8288|EIP-8288]]の依存関係宣言との継続性を提供し、私たちの実装ではより多くの追加コードと2つのクロスレイヤーのスキーマ変更を必要とします。各結果は、異なるアーキテクチャまたは実装のトレードオフを強調しています。

各提案は、個別に評価できる有用なアイデアを提供します。A1は[[glossary/EIP-8288|EIP-8288]]との継続性を維持し、A2はコンパクトな初期統合とより広範な検証者インターフェースを示し、A3は既存の署名リストの拡張を模索し、A4はバージョン管理された証人コンテナと宣言的クレームの価値を示します。これらの選択肢の一部は、エンコーディング、認証、および[[glossary/Consensus-Layer|コンセンサス層]]ルールを解決できれば組み合わせることができます。私たちは、これらの設計の最良の側面を活用した、より強力な提案、および出現する新しい代替案を歓迎します。この比較がコミュニティがそのような設計に収束するのに役立つことを願っています。

4つの提案すべてを実装することで、最終的に採用するアーキテクチャに関係なく対処する必要がある問題を特定するのに役立ちました。暫定的な[[glossary/gas|ガス]]スケジュールとリソース制限を維持することで、価格設定と容量間の重要な相互作用が明らかになりました。集約後のA2の[[glossary/gas|ガス]]コストの変更なしと、[[glossary/Execution-gas|実行ガス]]制限よりもはるかに早く拘束するA4の証人制限は、リソース価格設定が、そうでなければ有用なメカニズムが期待される利点を提供できないようにする方法を示しています。これらの観測は、異なるクレームおよび証人表現における[[glossary/resource-accounting|リソース会計]]に関するさらなる研究を促します。

実験はまた、その後の作業のより明確な方向性を示しています。[[glossary/Post-Quantum|PQ]]ワークロード下での実際のネットワーク伝播の測定、混合および完全に[[glossary/Post-Quantum|ポスト量子 (PQ)]]化されたワークロードの両方における[[glossary/gas|ガス]]価格と証人制限の調整、ネイティブ署名検証の最適化、現実的な[[glossary/Block-Building|ブロック構築]]期限下での集約の評価、およびアップグレードと[[glossary/reorg-resistant|リorg]]全体での[[glossary/transaction-identity|トランザクションアイデンティティ]]と証人可用性の確保です。これらは、提案とクライアント実装全体で協力して調査できる共通の研究課題です。公開された実装、測定値、および方法論が、その作業の有用な出発点となることを願っています。

私たちの当面の目標は、[[glossary/Hegot|ヘゴタ (Hegotá)]]向けの小さく、十分にテストされたM1であり、安定した[[glossary/transaction-identity|トランザクションアイデンティティ]]と、クレーム形式、[[glossary/gas|ガス]]、および証人に関する明示的なアップグレードルールを備えています。特に、バージョン管理された証人コンテナを評価し、既存のクレームのセマンティクスを変更することなく、新しい[[glossary/leanPCS|leanPCS]]クレームが私たちの依存関係アーキテクチャをどのように拡張するかを特定する予定です。プロバーの測定結果は、M1をM2に依存させることに反対し、オプションの[[glossary/Block-Building|ビルダー]]集約、リソース価格設定、および[[glossary/distributed-aggregation|分散型集約]]に関するさらなる研究を促します。4つのプロトタイプすべてにさらなる最適化の余地があります。

![13-account-migration](https://ethresear.ch/uploads/default/optimized/3X/6/1/61f5c6d2246dae06bd19c020c302174f5a4cecac_2_519x500.png "図13. 意図された移行パス。テストされたM1 → M2移行では、4つの代替案のいずれにおいても2回目のアカウント移行は必要ありませんでした。後のマイルストーンは未テストです。")

*図13. 意図された移行パス。テストされたM1 → M2移行では、4つの代替案のいずれにおいても2回目のアカウント移行は必要ありませんでした。後の[[glossary/Consensus-Layer|マイルストーン]]は未テストです。*

長期的な目標は、[[glossary/leanPCS|leanPCS]]や[[glossary/EIP-8288|EIP-8288]]によって構想されている機能を含む、スケーラブルな[[glossary/Post-Quantum|ポスト量子 (PQ)]]実行であり続けます。ユーザーは、集約と新しい証明システムが登場しても、一度[[glossary/Post-Quantum|PQ]]認証に移行すれば、そのアカウントを保持できるべきです。**[[glossary/Hegot|ヘゴタ (Hegotá)]]は、集約の展開に先立って、そのアーキテクチャ基盤を確立すべきです。**

## 参考文献

### 提案とロードマップ

-   A1: [[glossary/EIP-8504|EIP-8504 (Proof frames for leanSPHINCS signatures)]]、[固定されたリビジョン`96da3c17`](https://github.com/ethereum/EIPs/blob/96da3c17047ad31608c40bfe75049db78dc4417d/EIPS/eip-8504.md)。
    
-   A2: [[glossary/EIP-8141|EIP-8141 (フレームトランザクション)]]の更新：PROOFフレームモードの追加、[固定されたリビジョン`9c7074e0`](https://github.com/ethereum/EIPs/blob/9c7074e01b8698e057aa46363761a902f4e3edd8/EIPS/eip-8141.md)。
    
-   A3: 署名リスト、プルーフフレームではない、[スナップショット2026-11-26](https://hackmd.io/@Nerolation/BJEQraRAGe)、SHA-256 `b51cc9af7446ac7b17a121fd04c97945d1d424321a6a6c858c2ef47636683728`。
    
-   A4: 宣言的クレーム、分離された証人、およびHASCLAIM、[固定されたリビジョン`787a3761`](https://github.com/kevaundray/EIPs/blob/787a376141d35b76649be724df8ee629918651c7/EIPS/eip-8141.md)。
    
-   [bogota-devnet-2仕様](https://notes.ethereum.org/@ethpandaops/bogota-devnet-2)。
    
-   [[glossary/EIP-8288|EIP-8288]]：[[glossary/Mempool|メムプール (Mempool)]]内署名および証明集約、[固定されたリビジョン`ade9e9ca`](https://github.com/ethereum/EIPs/blob/ade9e9cab7e148bba4cd293f916a4a189cd7a8aa/EIPS/eip-8288.md)。
    
-   [[glossary/leanPCS|leanPCS]]ドラフト、[固定されたリビジョン`38432076`](https://github.com/leanEthereum/leanPCS/blob/38432076ad4b8154f427f4e0eb851e8f799d8dc3/eip-draft_leanPCS.md)。
    
-   [[[glossary/EIP-8141|EIP-8141 (フレームトランザクション)]]基本仕様](https://github.com/ethereum/EIPs/blob/ade9e9cab7e148bba4cd293f916a4a189cd7a8aa/EIPS/eip-8141.md)、A1とA3で使用されたリビジョン。
    
-   [[glossary/leanVM|leanVM]]検証および集約ライブラリ、リビジョン`92a97c919b2f2d6fe09853090b6b23f781ecec07`。
    
-   [仕様スナップショットマニフェスト](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/specs/README.md)、リビジョン識別子、ハッシュ、再配布条件を含む。
    

### さらなるコンテキスト：LambdaClassの[[glossary/Post-Quantum|ポスト量子 (PQ)]]イーサリアムシリーズ

-   [ミッション2028：イーサリアムの暗号は[[glossary/Q-day|量子コンピュータ脅威到来日]]を待てない](https://blog.lambdaclass.com/mission-2028-ethereums-cryptography-cant-wait-for-q-day/)
-   [暗号解読がイーサリアムに意味するもの](https://blog.lambdaclass.com/what-a-cryptographic-break-would-mean-for-ethereum/)
-   [イーサリアムを[[glossary/PQAI-day|量子コンピュータ/AI脅威到来日]]に備える](https://blog.lambdaclass.com/making-ethereum-ready-for-pqai-day/)
-   [ラストマイル：[[glossary/PQ-Ethereum|耐量子イーサリアム (PQ Ethereum)]]のスケーリング](https://blog.lambdaclass.com/the-last-mile-scaling-post-quantum-ethereum/)

### 実験的証拠

-   [実験リポジトリ](https://github.com/lambdaclass/pq-hegota-comparison)と[リリースv1.0.0](https://github.com/lambdaclass/pq-hegota-comparison/releases/tag/v1.0.0)。
-   [実装インデックスと再現手順](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/README.md)。
-   [技術レポート](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/REPORT.md)：AからHのセクション、完全なデータテーブルと再現性を含む。
-   [結果](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/RESULTS.md)
-   [方法論](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/METHODOLOGY.md)
-   [コミットとリビジョン](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/COMMITS.md)
-   [互換性](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/COMPATIBILITY.md)
-   [制限](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/LIMITATIONS.md)
-   [検証](https://github.com/lambdaclass/pq-hegota-comparison/blob/1ecc9b643dcdebf70b59e31b3655e23b38772c95/report/VERIFICATION.md)。
-   [生の測定値](https://github.com/lambdaclass/pq-hegota-comparison/tree/1ecc9b643dcdebf70b59e31b3655e23b38772c95/data)、[ベンチマークハーネス](https://github.com/lambdaclass/pq-hegota-comparison/tree/1ecc9b643dcdebf70b59e31b3655e23b38772c95/harness)、[再現スクリプト](https://github.com/lambdaclass/pq-hegota-comparison/tree/1ecc9b643dcdebf70b59e31b3655e23b38772c95/scripts)、および[スタンドアロン集約ベンチマーク](https://github.com/lambdaclass/pq-hegota-comparison/tree/1ecc9b643dcdebf70b59e31b3655e23b38772c95/aggbench)。
-   [完全な結果アーカイブ](https://github.com/lambdaclass/pq-hegota-comparison/releases/download/v1.0.0/pq-hegota-comparison-v1.0.0.tar.gz)。

*2投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/paths-to-post-quantum-execution-in-hegota-an-experimental-comparison/26304)
