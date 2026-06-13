---
title: 'SPHINCS minus: EVM上での効率的なステートレスなポスト量子署名検証'
original_title: >-
  SPHINCS minus : Efficient Stateless Post-Quantum Signature Verification on the
  EVM
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/sphincs-minus-efficient-stateless-post-quantum-signature-verification-on-the-evm/25165
author: nicocsgy
date: '2026-06-12'
category: Cryptography
tags:
  - cryptography
  - post-quantum
  - signatures
  - evm
  - verification
  - scaling
topic_id: '25165'
translated_at: '2026-06-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [SPHINCS minus : Efficient Stateless Post-Quantum Signature Verification on the EVM](https://ethresear.ch/t/sphincs-minus-efficient-stateless-post-quantum-signature-verification-on-the-evm/25165) — nicocsgy (2026-06-12)

# SPHINCS minus: EVM上での効率的なステートレスなポスト量子署名検証

* * *

*Vitalik Buterin、Jean-Philippe Aumasson、Justin Drake、Chelsea Komlo、Mauro Toscano、ZKnox、およびEF PQ & 暗号チームの同僚の皆様には、すべての議論、レビュー、フィードバックに心から感謝いたします。*

## はじめに

量子コンピュータはいずれ、今日のイーサリアムとビットコインのアカウントを保護している署名スキームであるECDSAを破るでしょう。Babbush et al. \[1\]による最近のリソース推定は、このタイムラインが以前の予想よりも近いことを示しており、実行レイヤーでの[[Post-Quantum|ポスト量子]]署名検証が喫緊の課題となっています。本稿では、SPHINCS+と最近のコンパクトなハッシュベース署名に関する研究から派生した、EVMに最適化されたバリアント群である[SPHINCS-](https://github.com/nconsigny/SPHINCs-)を紹介します。私たちの目標はシンプルです。プリコンパイルやプロトコル変更に依存せず、純粋なオンチェーン検証コストを最小限に抑えることです。

限定署名パラメータセットに関する[NISTのドラフト](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-230.ipd.pdf)に準拠した[SPHINCSバリアントのSolidity実装](https://github.com/nconsigny/SPHINCS-/blob/eef1f889a46c77d45dca013d321e9648fd3eaa7e/src/SLH-DSA-SHA2-128-24verifier.sol)が、標準化されたスタイルのポスト量子署名をイーサリアム上で実用的なコスト（150Kガス）で検証できることを示します。また、[Verityを用いたlean 4で検証者の形式証明](https://github.com/nconsigny/SPHINCS-/tree/main/verity)も提供しています。これは、イーサリアムでのFIPS準拠を目指す組織にとって朗報です。次に、標準のハッシュコンポーネントをEVMネイティブなkeccakベースの構成に置き換え、署名予算をブロックチェーンウォレットに関連する範囲に削減する、より積極的な非標準バリアントを探求します。これらのバリアント全体で、検証者ガス、署名者作業、署名サイズ、およびキーごとの署名予算の間のトレードオフを研究します。

* * *

## 1. アイデアの起源

Vitalikとのイーサリアム上の[[Post-Quantum|ポスト量子暗号]]に関する議論から、シンプルな観察が浮上しました。EVMにはすでに安価なKECCAK256オペコードがあり、SPHINCS+は同様のハッシュ関数から完全に構築されています。標準のSHAKE256をKECCAK256に置き換えることで、検証者はプリコンパイルなしでオンチェーンでネイティブに実行できるようになります。

NISTはSPHINCS+を「SLH-DSA」\[3\]として標準化しましたが、その2^64の署名予算はブロックチェーンウォレットの使用範囲をはるかに超えています。[dune](https://dune.com/queries/7371191?utm_source=share&utm_medium=copy&utm_campaign=query)によると、Merge以降、アクティブアドレスあたりのイーサリアム[[mainnet|メインネット]]トランザクションの年間99.9パーセンタイルは年間約431トランザクションです。そこで、同じスキームをより控えめな署名予算で検討しました。

残りの要素は、SPHINCS+署名の圧縮に関する最近の研究から得られました。中でも、Drake et al. [\[4\]](https://eprint.iacr.org/2025/055)は、チェックサムオーバーヘッドを排除するターゲットサムWinternitzエンコーディングについて記述しています。KudinovとNick [\[5\]](https://eprint.iacr.org/2025/2203)は、ビットコイン向けのハッシュベース署名に関するレポートでこれをさらに体系化し、WOTS+Cチェックサムグラインディング、FORS+CおよびPORS+FPカウンターグラインディング/強制プルーニングを詳述し、削減された署名数予算でSLH-DSAをはるかに下回る署名サイズを実現する方法を示しました。同じ系統の研究から、NickはSHRINCS [\[6\]](https://delvingbitcoin.org/t/shrincs-324-byte-stateful-post-quantum-signatures-with-static-backups/2158)とSHRIMPS [\[7\]](https://delvingbitcoin.org/t/shrimps-2-5-kb-post-quantum-signatures-across-multiple-stateful-devices/2355)を提案し、ステートフル/ステートレスハイブリッドが、ハッシュベース署名をプライマリデバイスで324バイト、独立したバックアップデバイス間で約2.5KBに削減できることを示しました。これらのアイデアを組み合わせることで、積極的に検証者最適化されたパラメータを持つEVMネイティブなハッシュベース署名スキームを実現し、今日のイーサリアムでポスト量子署名を実用的にすることができます。

Blockstream Researchのパラメータ検索ツールを活用してSPHINCS+バリアントを探索し、EVMに適合させました（[パラメータのトレードオフを探索するにはこのリポジトリを確認してください](https://github.com/nconsigny/EVM-SPHINCs-Parameters)）。本稿では、パラメータ空間を記述し、各ノブがEVM検証者と署名者に何をするかを説明し、結果として得られるバリアントファミリーを提示します。探索を手伝ってくれたTom Wambsgansに特に感謝します。

## 2. 背景: SPHINCS+の仕組み

ハッシュ関数は一方向性です。順方向の計算は容易ですが、逆方向の計算は不可能です。ハッシュベース署名はこの非対称性を利用し、ハッシュで秘密の値にコミットし、後で選択された秘密を署名として開示します。これを実用的にするために、3つの構成要素があります。ハッシュチェーンは、一方向のシーケンス内の位置を開示することで選択をエンコードします。マークルツリーは、多数のワンタイム公開鍵を単一のルートに圧縮します。少数回スキームは、キーが少数のメッセージに署名した後、引退する必要があることを可能にします。SPHINCS+はこれらの要素をハイパーツリー（ツリーのツリー）上に構築されたステートレスなハッシュベース署名スキームに積み重ねます。リーフには、少数回署名を提供するFORSインスタンス（「ランダムサブセットのフォレスト」）があります。その上にはXMSSツリーのレイヤーがあり、それぞれがWOTS+（[[Winternitz-One-Time-Signatures|ウィンターニッツ・ワンタイム署名]]）を使用して下位レイヤーを認証します。

メッセージMに署名するには、ランダマイザーと公開鍵情報でメッセージをハッシュすることから始めます。その結果：
`H_msg(Randomizer, PK.seed,PK.root, M) => ( md , idx_tree , idx_leaf )`

このハッシュは3つの情報を提供します。メッセージダイジェスト`md`と、実際の署名を行うサブツリーとハイパーツリーのリーフを選択する2つのインデックスです。

ハイパーツリーを巨大なファイルキャビネットと考えてください。メッセージは、使用する引き出し`idx_tree`とフォルダ`idx_leaf`を指示します。メッセージダイジェストは`k`個の`a`ビットのチャンクに分割され、各チャンクはフォルダ内の1つの秘密を選択する値となります。それらの秘密を開示すれば、それが署名です。

d=1パラメータの場合、サブツリーがないため、`idx_tree`は常にアウターツリーを指します。

この仕組みは[https://sphincsminus.org/](https://sphincsminus.org/)で視覚的に確認できます。

![SPHINCS-の仕組み](https://ethresear.ch/uploads/default/optimized/3X/3/0/30eed833724aaacb1440ce3fd045ba6be30dfa3b_2_690x343.png)

署名には以下が含まれます。

1.  **FORS署名**: k個の秘密リーフ値とk個のマークル認証パスを1つのFORS公開鍵に圧縮したもの。
2.  **d個のWOTS+署名**: ハイパーツリー層ごとに1つずつ、それぞれl個のハッシュチェーンで構成されます。
3.  **d個のマークル認証パス**: ハイパーツリー層ごとに1つずつ、それぞれ高さh/dです。

検証者はこの構造をボトムアップで辿ります。FORSオープニングを検証し、それをFORS公開鍵に圧縮し、最初のWOTS+層のメッセージとして使用し、マークル認証パスを辿って次の層に到達し、ルートに到達するまでd回繰り返します。すべてのステップはハッシュ評価です。検証者が計算するハッシュの総数がオンチェーンガスコストを決定します。

### 2.1 標準化

NISTはすでに、ラティスベースのML-DSA \[2\]や、まだドラフト段階のFN-DSA（Falcon）を含むいくつかのPQ署名スキームを標準化しています。ハッシュベース署名は魅力的な代替手段です。そのセキュリティはハッシュ関数の特性に完全に依存しており、最小限の仮定でよく理解されており、これらのプリミティブはラティス構造よりも理解が容易です。

## 3. パラメータとその機能

### 3.1 ハッシュ出力サイズ: n => 各ハッシュが生成するバイト数

すべてのハッシュ評価の出力サイズ。標準SLH-DSAはn=16/24/32バイト（128/192/256ビット）を提供します。

**EVMへの影響:** すべてのマークルノード、WOTS+チェーン値、およびFORSリーフはnバイトです。n=16の場合、署名はn=32の半分になります。

**セキュリティ:** nは原像セキュリティを8nビットに制限します。n=16は128ビットを提供し、私たちの目標には十分です。

**私たちの選択: n=16。** 128ビットセキュリティの最小値であり、可能な限り最小の署名です。

### 3.2 ハイパーツリー層: d => 積み重ねられるツリーの数

XMSSサブツリー層の数。標準SLH-DSAはd=7からd=22を使用します。

**EVMへの影響。** 検証者はd回のWOTS+検証とd回のマークル認証パスウォークを実行します。dを2倍にすると、ハイパーツリー部分からの検証作業がほぼ2倍になります。

**署名者への影響。** 各層では、2^(h/d)個のリーフを持つ完全なサブツリーを構築する必要があります。d=2の場合、署名者は2つのサブツリーを構築し、d=3の場合、3つのサブツリーを構築します。これが主要な署名コストです。

**私たちの選択: d=2。** オンチェーンWOTS+検証を最小限に抑えます。すべてのスイープで、d=2がEVMガスに最適であることが確認されました。

### 3.3 ハイパーツリーの高さ: h => 1つのキーで生成できる署名の数

全ハイパーツリーの高さ。署名容量`q_s`を決定します。このスキームは2^h個のFORSインスタンスをアドレス指定します。

**EVMへの影響:** 検証者は合計h個のマークル認証ノード（層あたりh/d、d層）を辿ります。hを4増やすと約800ガスが追加され、 modestなコストです。

**セキュリティへの影響**: `h`が大きいほどFORSインスタンスが多くなる（2^h個）ため、署名が同じインスタンスで衝突する可能性が低くなります。FORSの再利用は、署名数が多い場合の主要な劣化メカニズムであるため、`h`を増やすことで、セキュリティが目標を下回る前にキーがより多くの署名を維持できるようになります。特定の署名数での正確なセキュリティレベルは、`h`、`k`、`a`の共同関数です。具体的な数値については、§5のバリアントごとの`sec_N`列を参照してください。

**署名者への影響:** d=2の場合、サブツリーサイズは2^(h/2)です。h=16からh=24に移行すると、サブツリーサイズは256から4,096リーフに増加し、署名作業が16倍になります。

**トレードオフ:** hは、署名速度と高署名数でのセキュリティの主要なノブです。hが大きいと検証者側のコストはほとんどかかりませんが（200ガス/単位）、署名者の作業が劇的に増加します。

### 3.4 FORSツリー: kとツリーの高さ: a => 少数回署名がどのように構造化されるか

FORSは、それぞれ高さa（2^aリーフ）のk個の独立した二分木を使用します。署名は、ツリーごとに1つのリーフとその認証パスを開示します。

**EVMへの影響:** 検証者は、FORS部分に対して約(k-1)\*(1+a) + 2個のハッシュを計算します。FORS+Cを使用すると、署名者は最後のインデックスをゼロに強制し、署名から1つのツリーを排除し、(1+a)\*nバイトと(1+a)個のハッシュを節約します。

**セキュリティ。** FORSのワンタイムセキュリティはk*aビットです。128ビットの場合: k*a >= 128。aが高いほど、再利用時の劣化が遅くなります（各再利用でツリーのより小さな部分が開示されるため）。

**署名者への影響。** FORS+Cグラインディングには、期待される2^a回の試行が必要です。aが高いほど、グラインディングは指数関数的に増加します。

### 3.5 Winternitzパラメータ: w => チェーン長とチェーン数のトレードオフ

WOTS+システムの基数。検証者はl個のハッシュチェーンを完了してw-1の位置に到達します。

**EVMへの影響。** ガスにとって最も重要なパラメータです。チェーン数lはnとwによって決定されます。n=16の場合:

| w | l | Verify chain steps (with +C) | WOTS body per layer |
| --- | --- | --- | --- |
| 8 | 43 | 43*7 - S_wn | 688 B |
| 16 | 32 | 32*15 - S_wn | 512 B |
| 32 | 26 | 26*31 - S_wn | 416 B |
| 256 | 16 | 16*255 - S_wn | 256 B |

wが高いほどチェーンは少なくなりますが（署名は小さくなります）、チェーンは長くなります（チェーンあたりのハッシュが多くなります）。式は`l = ceil(security_bits / log2(w))`で与えられます。

生のコールデータフロアモデルの下でのガス最適化の発見では、高wバリアントが魅力的に見えます。しかし、実際の検証者実行がモデル化されると、チェーン作業が支配的になります。**w=8が最適**です。チェーンが短い（最大7ステップ）にもかかわらず、チェーンの数が多い（43チェーン）ためです。このファミリーを発見したEmileに感謝します。これはパラメータ検索から得られた最も重要な教訓でした。実際の検証者実行をモデル化する必要があり、オペコードガスとコールデータだけでは不十分です。

### 3.6 ターゲット桁合計: S\_wn => 署名者が検証者を縮小するためにどれだけグラインドするか

WOTS+Cでは、署名者は桁合計が正確にS\_wnになるまでグラインドし、標準のWOTSチェックサムを置き換えます。

**EVMへの影響。** 検証者は層あたりl\*(w-1) - S\_wnチェーンステップを計算します。S\_wnが高いほど、ステップが少なくなり、安価になります。線形関係です。

**署名者への影響。** S\_wnが高いほど、有効なエンコーディングが少なくなり、グラインディングが多くなります。署名者の作業と検証者の節約を交換するスムーズなノブです。

**セキュリティへの影響。** なし。S\_wnは暗号学的セキュリティに影響しません。署名者と検証者の間でコストをシフトするだけです。

### 3.7 まとめ

```
Parameter   Verifier cost        Signer cost          Security
---------   -------------        -----------          --------
n=16        Minimum calldata     --                   128-bit cap
d=2         2 WOTS+ verifies     2 subtree builds     --
h up        +200 gas/unit        x16 per 4 units      More sigs at 128-bit
k up        More FORS trees      --                   Higher k*a
a up        Taller auth paths    Exponential grind     Slower degradation on reuse
w=8         Short chains (7)     43 chains, moderate   --
S_wn up     Fewer chain steps    Harder grinding       None
```

## 4. キャリブレーションされたガスモデル

私たちは、EIP-7623とEIP-7976のフロアプライシングを用いて[https://github.com/nconsigny/EVM-SPHINCs-Parameters](https://github.com/nconsigny/EVM-SPHINCs-Parameters)でバリアントを検索しました。デプロイされたバリアントの実際の検証者トレースを測定したところ、ランキングが生のモデルと異なることがわかりました。署名が小さいバリアント（高wまたはPORSベース）はフロアモデルの下では最適に見えましたが、ハッシュ評価の総数が少ないバリアント（w=8、FORS+C）は実際には安価でした。生のモデルは署名サイズを過大評価し、実行コストを過小評価していました。

測定されたトレースに対して粗いモデルを適合させました。

```
ExecGas = 36,118 + 194 * ops
```

ここで`ops`は検証者の総ハッシュ評価数です。これにより、バリアント間の正しいガス順序が回復され、デフォルトの検索メトリックとなりました。

この区別は、EIP-7623フロアのために重要です。

```
TotalGas = max(StdCalldata + ExecGas, CalldataFloor)
```

一部のバリアントは**フロアバウンド**であり、他のバリアントは**実行バウンド**です。検証者にハッシュを1つ追加すると、実行パスで約194ガスかかりますが、フロアパスでは何もかかりません。一方、署名バイトを1つ節約すると、両方のパスで16ガス節約されます。この非対称性が、実行が適切にモデル化されるとw=8（チェーンが多く、短く、ハッシュの総数が少ない）がw=32（チェーンが少なく、長く、ハッシュの総数が多い）に勝る理由です。**また、次のハードフォークでkeccakの[[repricing|再価格設定]]が予想されるため、keccakコストが20%増加することも確認しました**。

## 5. バリアントファミリー

要するに、C13はラップトップ署名者向けに最適化されたバリアントであり、C11とC12はハードウェアウォレット署名者向けに最適化されています。SLH-DSA-SHA2-128-24は、強力なラップトップまたはHSMで実行可能です。

パラメータセットによって、セキュリティ劣化と署名時間が異なります。選択したバリアントのセキュリティ劣化は以下の通りです。

![SPHINCS-のセキュリティ劣化](https://ethresear.ch/uploads/default/optimized/3X/f/c/fcddfc5437be1ac5567636fa26786eada7a4d148_2_690x405.png)

| Variant | Family | h | d | a | k | w | l | Signature Size (bytes) | sign_h (hash call) | Verify (gas EVM) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C13 | WOTS+C / FORS+C | 24 | 2 | 16 | 8 | 8 | 43 | 3,704 B | 4.3 M | 127 K |
| C12 | vanilla SPHINCS+ | 20 | 5 | 7 | 20 | 8 | 45 | 6,512 B | 36.6 K | 276 K |
| SLH-DSA-SHA2-128-24 | vanilla SPHINCS+ | 22 | 1 | 24 | 6 | 4 | 68 | 3,856 B | ~1.07 B | 142 K |
| SLH-DSA-Keccak-128-24 | vanilla SPHINCS+ | 22 | 1 | 24 | 6 | 4 | 68 | 3,856 B | ~1.07 B | 94 K |

検証者コントラクトは[https://github.com/nconsigny/SPHINCS-/tree/main/src](https://github.com/nconsigny/SPHINCS-/tree/main/src)で確認できます。

-   **Family**: SPHINCS+の構築スタイルは、バニラSPHINCS+またはグラインディングを伴うコンパクトな構築であるWOTS+C / FORS+Cのいずれかです。
-   **h; d; a ; k; w; l**: 構築パラメータ。上記の[§3](#3-the-parameters-and-what-they-do)の説明を参照してください。
-   **sign\_h**: キー生成+1回の署名中のハッシュ関数呼び出し、ゼロメモリ署名者（署名間のキャッシュなし）。数値が高いほど、ハードウェアの作業量が多くなります（悪い）。
-   **sec\_N**: キーあたり2^N署名でのセキュリティビット。
-   **Verify (pure)**: アセンブリブロックのFoundry `gasleft()`測定。

C11とC12は、それぞれST33K1M5セキュアエレメント（Ledger nano S+）で測定された署名時間が390秒と47.5秒であり、ハードウェアウォレットで実行するのに十分軽量です。一方、SLH-DSA-SHA2-128-24はFIPS準拠の代替案であり、ラップトップクラスの署名者であっても署名コストがはるかに大きくなります。Keccak版は、ビット単位のNIST準拠と引き換えに、オンチェーン検証が約34%安価になります。

## 6. 制限と「leanSPHINCS」の展望

SPHINCS-は非標準です。SHAKE256の代わりにkeccak256を使用（FIPS 205に違反）、署名数が制限されている（標準の2^64に対し2^14から2^20）、NISTのパラメータセットと一致しません。NISTがハッシュインスタンス化（例：SHAKEのスポンジパディングなしのNIST SHA-3パーミュテーション、またはPoseidon）とは独立してハイパーツリー構造とパラメータを指定することを検討するのは興味深いでしょう。あるいは、実装者がSLH-DSAのセキュリティ特性を維持しながらハッシュ関数置換を実行する方法に関するガイダンスを公開することも評価されるでしょう。

とはいえ、標準とのギャップは縮まっています。NISTは、証明書およびファームウェア署名をターゲットとする2^24の署名制限（`rls128cs1`、`rls192cs1`、`rls256cs1`）を持つ、より小さなSLH-DSAパラメータセット\[9 & 10\]に積極的に取り組んでいます。NISTは最近、Special Publication 800 \[11\]で新しいパラメータセットをリリースし、私たちが使用した128-24バリアントの初期公開ドラフトを公開しました。SPHINCS-は2^14から2^20の同じ設計空間で動作し、ここで開発された技術（keccak置換、EVMガスモデリング、WOTS+C/FORS+C圧縮）は、将来標準化される小予算SLH-DSAパラメータセットにも適用されるでしょう。

将来的には、基盤となるハッシュ関数は[[zkEVM|zkEVM]]の制約に適合するためにZKフレンドリーであるべきです。この将来のバリアントを「**[[leanSpec|leanSPHINCS]]**」と名付けます。

これは、プロトコルレベルの集約が登場する場面でもあります。最近の[[EIP|EIP]]ドラフト「PQ署名とSTARK集約のための[[Frame-type|フレームタイプ]]」は、トランザクションがオンチェーンで署名を運ぶ代わりに、軽量な`(scheme, data_hash, verification_key)`依存関係を宣言することを可能にします。メムプールノードとビルダーは、これらをオフチェーンでブロックヘッダー内の単一の再帰的STARKに折り込みます。これにより、[[leanSpec|leanSPHINCS]]検証はフレームレベルで3,000ガスになります。検証はプロバーによって一度支払われ、すべてのノードによって再実行されないためです。問題はZKフレンドリーなハッシュ要件です。keccakは算術化するのに桁違いに高価であるため、[[leanSpec|leanSPHINCS]]のみが集約回路内でネイティブに検証されます。keccakベースのSPHINCS-署名もパイプラインに乗ることはできますが、最初にクライアント側でSTARKラップする必要があり、その1回限りの証明コストは署名者のデバイスに転嫁されます。

その間、SPHINCS-はブリッジになり得るでしょう。プロトコル変更を待つことなく、今日デプロイ可能な最もガス効率の高いハッシュベースのPQオプションです。ハードウェアウォレットの制約は、JARDINに関する補足記事（近日公開予定™）で対処されており、これによりSTセキュアエレメントでのコンパクト署名が3秒に短縮されます。

* * *

## 参考文献

\[1\] R. Babbush et al. “Securing Elliptic Curve Cryptocurrencies against Quantum Vulnerabilities.” arXiv:2603.28846, 2026. [https://arxiv.org/abs/2603.28846](https://arxiv.org/abs/2603.28846)

\[2\] National Institute of Standards and Technology. “Module-Lattice-Based Digital Signature Standard.” FIPS 204, August 2024. [https://csrc.nist.gov/pubs/fips/204/final](https://csrc.nist.gov/pubs/fips/204/final)

\[3\] National Institute of Standards and Technology. “Stateless Hash-Based Digital Signature Standard.” FIPS 205, August 2024. [https://csrc.nist.gov/pubs/fips/205/final](https://csrc.nist.gov/pubs/fips/205/final)

\[4\] J. Drake, D. Khovratovich, M. Kudinov, and B. Wagner. “Hash-Based Multi-Signatures for Post-Quantum Ethereum.” ePrint 2025/055, 2025. [https://eprint.iacr.org/2025/055](https://eprint.iacr.org/2025/055)

\[5\] M. Kudinov and J. Nick. “Hash-based Signature Schemes for Bitcoin.” ePrint 2025/2203, 2025. [https://eprint.iacr.org/2025/2203](https://eprint.iacr.org/2025/2203)

\[6\] J. Nick. “SHRINCS: 324-byte stateful post-quantum signatures with static backups.” Delving Bitcoin, December 2025. [https://delvingbitcoin.org/t/shrincs-324-byte-stateful-post-quantum-signatures-with-static-backups/2158](https://delvingbitcoin.org/t/shrincs-324-byte-stateful-post-quantum-signatures-with-static-backups/2158)

\[7\] J. Nick. “SHRIMPS: 2.5 KB post-quantum signatures across multiple stateful devices.” Delving Bitcoin, March 2026. [https://delvingbitcoin.org/t/shrimps-2-5-kb-post-quantum-signatures-across-multiple-stateful-devices/2355](https://delvingbitcoin.org/t/shrimps-2-5-kb-post-quantum-signatures-across-multiple-stateful-devices/2355)

\[8\] EIP-8141: Frame Transactions [https://eips.ethereum.org/EIPS/eip-8141](https://eips.ethereum.org/EIPS/eip-8141)

\[9\] J. Dang. “SPHINCS+ Smaller Parameter Sets.” NIST PQC Seminar, 2025. [https://csrc.nist.gov/csrc/media/presentations/2025/sphincs-smaller-parameter-sets/sphincs-dang\_2.2.pdf](https://csrc.nist.gov/csrc/media/presentations/2025/sphincs-smaller-parameter-sets/sphincs-dang_2.2.pdf)

\[10\] Scott Fluhrer & Quynh Dang “Smaller Sphincs+ or, Honey, I Shrunk the Signatures.” ePrint 2024/018, 2024 [https://eprint.iacr.org/2024/018.pdf](https://eprint.iacr.org/2024/018.pdf).

\[11\] NIST Special Publication 800 Additional SLH-DSA Parameter Sets for Limited-Signature Use Cases Initial Public Draft [https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-230.ipd.pdf](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-230.ipd.pdf)

\[12\] ZKnox / Kohaku. “Post-quantum account pattern.” [https://github.com/ethereum/kohaku/tree/master/packages/pq-account/lib](https://github.com/ethereum/kohaku/tree/master/packages/pq-account/lib)

*1 post - 1 participant*

[Read full topic](https://ethresear.ch/t/sphincs-minus-efficient-stateless-post-quantum-signature-verification-on-the-evm/25165)
