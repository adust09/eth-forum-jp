---
title: RANDAOはL*で破綻する：Ethereumのための耐量子VRF
original_title: 'RANDAO Breaks at L*: A Post-Quantum VRF for Ethereum'
source_url: >-
  https://ethresear.ch/t/randao-breaks-at-l-a-post-quantum-vrf-for-ethereum/24906
author: arianaraghi
date: '2026-05-20'
category: Cryptography
tags:
  - cryptography
  - post-quantum
  - consensus
  - vrf
  - research
topic_id: '24906'
translated_at: '2026-05-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [RANDAO Breaks at L*: A Post-Quantum VRF for Ethereum](https://ethresear.ch/t/randao-breaks-at-l-a-post-quantum-vrf-for-ethereum/24906) — arianaraghi (2026-05-20)

## TL;DR

L*マイルストーンにおいて、BLSキーは廃止されます。現在の`randao_reveal`メカニズムは完全に機能しなくなります。本投稿では、最小限のハッシュベースの修正案を提案します。それは、leanSigシードから派生したPRFコミットメントVRF（検証可能乱数関数）であり、`BeaconBlockBody`に含まれるスタンドアロンのWHIRプルーフで証明されます。この構成はI*で有効化されるため、RANDAOはL*ではなく、それ以前に耐量子性を獲得します。

参照実装は[GitHub - aryaethn/leanEthereumPostQuantumVRF: Forked repo from "Minimal zkVM, targeting aggregation of hash-based signatures," to create a PQ VRF on top of it. · GitHub](https://github.com/aryaethn/leanEthereumPostQuantumVRF)にあります。
付随する論文は[pq\_vrf\_ethereum.pdf](https://ethresear.ch/uploads/short-url/84UmcdtPbDDAsgyZxM5EG2kd62u.pdf) (657.8 KB)に添付されています。

レビューのため、EF PQチームに連絡します：[@JustinDrake](https://ethresear.ch/u/justindrake) [@Khovratovich](https://ethresear.ch/u/khovratovich) @benedikt-wagner [@will-corcoran](https://ethresear.ch/u/will-corcoran)。

* * *

## 1. 問題

[[EIP|EIP（Ethereum 改善提案）]]-7998（@aryaethnと[@71104](https://ethresear.ch/u/71104)の共著）は、ブロックプロポーザーが各スロットでBLS VRF（検証可能乱数関数）の出力とプルーフを生成することを要求することで、RANDAOを強化します。これにより、最終リビーラー攻撃が排除され、単一秘密リーダー選出（Single Secret Leader Election）が可能になります。

L*マイルストーンにおいて、BLSキーは段階的に廃止され、leanSig（XMSSベース）キーに置き換えられます。その時点で、[[EIP|EIP（Ethereum 改善提案）]]-7998は暗号学的に破綻します。署名に使えるBLSキーは残っておらず、`randao_reveal`を置き換えるメカニズムもありません。既存の[[EIP|EIP（Ethereum 改善提案）]]はこのギャップに対処していません。

L*以降には、差し迫った問題があります。BLS公開鍵はすでにオンチェーンに存在します。暗号学的に関連する量子コンピューター（CRQC: Cryptographically Relevant Quantum Computer）は、ショアのアルゴリズム（Shor’s algorithm）を使用して、登録された公開鍵から任意のバリデーターのBLS秘密鍵を回復し、今日からRANDAOを偏らせることができます。BLSキーが新しく登録されたleanSigキーと並行して稼働するハイブリッドなI*からL*までの期間は、最も危険な期間です。

この[[EIP|EIP（Ethereum 改善提案）]]は、[[EIP|EIP（Ethereum 改善提案）]]-7998に対するオプションの機能強化ではありません。これは必須の移行です。問題は、それがどのような形であるべきか、そしていつ有効化されるべきかだけです。

* * *

## 2. この構成が選ばれた理由

提案を説明する前に、なぜ自然なアプローチが機能しないのかを説明する価値があります。

**X-VRF (ESORICS 2022) は破綻しています。** X-VRFの構成は、XMSS/WOTS+を一意な署名スキームとして扱い、そこからVRF（検証可能乱数関数）の一意性を導き出します。FC 2024は、WOTS+が関連する意味で一意な署名スキームではないことを示しました。チェーン構造は、与えられたメッセージに対して複数の有効な署名を許容します。WOTS+の一意性から一意性を継承するいかなる構成も、その基盤から破綻しています。

**leanSigをRANDAOに直接使用してもVRF（検証可能乱数関数）は得られません。** `(slot, prev_epoch_randao_mix)`に対するleanSig署名は、署名キーの知識の証明を与えますが、出力の一意性は与えません。WOTS+チェーンの拡張は、異なるリーフインデックス、または異なるチェーントラバーサルが、同じメッセージに対して異なる署名を生成できることを意味します。RANDAO貢献の一意性は、これから導き出すことはできません。

**正しいアプローチ：PRFコミットメントVRF（検証可能乱数関数）。** プロポーザーは、ドメイン分離されたハッシュを介してleanSigシードからVRF秘密鍵`vrf_sk`を導出し、スロットのVRF入力`x`に対して`y = H(vrf_sk, x)`としてVRF出力を計算します。一意性は`H`の衝突耐性から成り立ち、いかなる署名の一意性プロパティからも成り立ちません。VRFプルーフは、`y`が正直に計算されたことを示すゼロ知識証明です。

このアプローチはクリーンで、構成上正しく、X-VRFの欠陥を完全に回避します。

* * *

## 3. 構成

すべてのハッシュ呼び出しは、KoalaBearフィールド（`p = 2^31 - 2^24 + 1 = 2,130,706,433`）上で`poseidon16_compress`を使用し、S-boxの次数は3（Davies-Meyer、8フルラウンド、20パーシャルラウンド、出力8フィールド要素）です。パラメータは、コミット`5a5e10dd`のleanMultisigソースから確認されています。

### 3.1 キー導出

```
leanSig_seed    uniform random 32 bytes
vrf_sk          = compress([seed_fe[0..11], DOMAIN_VRF_DERIVE, 0, 0, 0, 0])   in F_p^8
pk_vrf          = compress([vrf_sk[0..8],   DOMAIN_VRF_PK,     0, 0, 0, 0, 0, 0, 0])   in F_p^8
```

`seed_fe[0..11]`は、3バイト/要素のリトルエンディアンパッキングを使用して11個のKoalaBearフィールド要素としてエンコードされたleanSigシードです。`DOMAIN_VRF_DERIVE = p - 3`。別途VRF（検証可能乱数関数）キー登録セレモニーは必要ありません。`pk_vrf`は、I*ですでに登録されているleanSigシードから決定論的に導出されます。

### 3.2 VRF評価

特定のスロット`s`と前のエポックのRANDAOミックス`r`の場合：

```
x   = encode(s, r)    15 field elements: [DOMAIN_VRF_INPUT, slot_fe[3], mix_fe[11]]
m   = compress([x[0..15], DOMAIN_VRF_EVAL])    in F_p^8     (inner hash)
y   = compress([vrf_sk[0..8], m[0..8]])         in F_p^8     (VRF output)
```

ドメイン分離定数（すべて`2^24`を超えるため、3バイトパックされた入力データには現れません）：

| 定数 | 値 |
| --- | --- |
| DOMAIN_VRF_INPUT | p - 1 = 2,130,706,432 |
| DOMAIN_VRF_PK | p - 2 = 2,130,706,431 |
| DOMAIN_VRF_DERIVE | p - 3 = 2,130,706,430 |
| DOMAIN_VRF_EVAL | p - 4 = 2,130,706,429 |

leanSigの内部調整（0x00, 0x01, 0x02）およびleanMultisig SNARKドメイン分離（最大要素2,063,844,858）に対するドメインタグの衝突はチェックされ、問題がないことが確認されています。完全な分析は`crates/vrf/FINDINGS.md §0e`にあります。

### 3.3 VRFプルーフ

プルーフ`pi`は、以下の関係に対するWHIRプルーフ（XMSSアテステーション集約と同じ`lean_prover::prove_execution`インフラストラクチャを使用）です。

```
R = { (pk_vrf, slot, r, y ; vrf_sk) :
        compress([vrf_sk, DOMAIN_VRF_PK, 0^7]) = pk_vrf
      AND
        compress([vrf_sk, compress([encode(slot, r), DOMAIN_VRF_EVAL])]) = y }
```

この回路は、共有された8要素のプライベートな証人`vrf_sk`を用いて3回の`poseidon16_compress`呼び出しを行います。公開ステートメントは31個のフィールド要素です：`pk_vrf[8] || encode(slot, r)[15] || y[8]`。

これは`BeaconBlockBody`内のスタンドアロンのWHIRプルーフであり、`process_randao`中に同期的に検証されます。スロット後のleanMultisigアテステーション集約には埋め込まれません。

### 3.4 検証

```
def pq_vrf_verify(pk_vrf, slot, randao_mix, y, proof):
    x = encode_vrf_input(slot, randao_mix)    # 15 field elements
    public_input = list(pk_vrf) + list(x) + list(y)    # 31 field elements
    return lean_prover.verify_execution(VRF_BYTECODE, public_input, proof)
```

* * *

## 4. プロトコルの変更点

### 4.1 3段階のprocess\_randao

この移行はL*ではなくI*で有効化されるため、RANDAOはハイブリッド期間中に耐量子性を獲得します。

**フェーズ0 (I*以前):** [[EIP|EIP（Ethereum 改善提案）]]-7998は変更なし。

**フェーズ1 (I*からL*まで、ハイブリッド):**

```
def process_randao(state, body):
    epoch = get_current_epoch(state)
    proposer = state.validators[get_beacon_proposer_index(state)]

    # EIP-7998 BLS path (unchanged until L*)
    randao_data = RandaoRevealData(
        slot=state.slot,
        prev_epoch_randao_mix=get_randao_mix(state, epoch - 1)
    )
    assert bls.Verify(proposer.bls_pubkey,
                      compute_signing_root(randao_data, DOMAIN_RANDAO),
                      body.randao_reveal)
    bls_contribution = hash(body.randao_reveal)

    # PQ VRF path (this EIP, active from I*)
    x = encode_vrf_input(state.slot, get_randao_mix(state, epoch - 1))
    assert pq_vrf_verify(proposer.pk_vrf, x, body.pq_vrf_output, body.pq_vrf_proof)
    pq_contribution = serialize_field_elements(body.pq_vrf_output)    # 32 bytes

    # XOR both contributions
    mix = xor(get_randao_mix(state, epoch),
              xor(bls_contribution, pq_contribution))
    state.randao_mixes[epoch % EPOCHS_PER_HISTORICAL_VECTOR] = mix
```

**フェーズ2 (L*以降、PQのみ):**

```
def process_randao(state, body):
    epoch = get_current_epoch(state)
    proposer = state.validators[get_beacon_proposer_index(state)]
    x = encode_vrf_input(state.slot, get_randao_mix(state, epoch - 1))
    assert pq_vrf_verify(proposer.pk_vrf, x, body.pq_vrf_output, body.pq_vrf_proof)
    mix = xor(get_randao_mix(state, epoch),
              serialize_field_elements(body.pq_vrf_output))
    state.randao_mixes[epoch % EPOCHS_PER_HISTORICAL_VECTOR] = mix
```

ハイブリッドフェーズのセキュリティ議論：擬似乱数値と他の任意の値のXOR（排他的論理和）は擬似乱数です。どちらかのVRF（検証可能乱数関数）が安全であれば、結合されたRANDAOミックスは擬似乱数です。バリデーターのBLSキーを回復するCRQC（暗号学的に関連する量子コンピューター）はBLS貢献を偏らせることはできますが、PQ貢献を制御することはできません。したがって、RANDAOはI*以降、耐量子性を持つことになります。

### 4.2 ビーコンチェーンの変更点

**`BeaconBlockBody`** はI*から2つの新しいフィールドを獲得します。

-   `pq_vrf_output: Bytes32` （8要素のフィールドベクトル`y`をリトルエンディアンでシリアライズしたもの）
-   `pq_vrf_proof: VRFProof` （シリアライズされたWHIRプルーフ、約116 KB）

両フィールドはI*から必須となります。いずれかのフィールドが欠落しているブロックは無効です。クライアントはI*アクティベーションエポックより前にアップグレードする必要があります。

L*では、`randao_reveal`は`BeaconBlockBody`から削除されます。

**バリデーターレコード**はI*で1つのフィールドを獲得します。

-   `pk_vrf: Bytes32` （8要素のキーコミットメント`compress([vrf_sk, DOMAIN_VRF_PK, 0^7])`をシリアライズしたもの）

バリデーターは、I* leanSigキー登録の一部として`pk_vrf`を計算し、登録します。追加のセレモニーは必要ありません。

### 4.3 [[EIP|EIP（Ethereum 改善提案）]]-7998との関係

この[[EIP|EIP（Ethereum 改善提案）]]は、I*からL*まで[[EIP|EIP（Ethereum 改善提案）]]-7998と互換性があります。両方のメカニズムが並行して実行され、それらの出力はRANDAOミックスにXORされます。L*では、この[[EIP|EIP（Ethereum 改善提案）]]が[[EIP|EIP（Ethereum 改善提案）]]-7998に取って代わります。[[EIP|EIP（Ethereum 改善提案）]]のヘッダーには「マイルストーンL*で[[EIP|EIP（Ethereum 改善提案）]]-7998を置き換える。I*からL*までは[[EIP|EIP（Ethereum 改善提案）]]-7998と互換性あり。」と記載されます。

* * *

## 5. セキュリティ特性

セキュリティ議論には4つのコンポーネントがあります。それぞれについて、そのモデルと仮定を明示的に述べます。

### 5.1 正当性 (Correctness)

WHIRの完全性（completeness）から無条件に成り立ちます。有効な証人を持つ正直な証明者は、常に正直な検証者が受け入れる証明を生成します。

### 5.2 計算上の一意性 (Computational Uniqueness) (ROM)

**主張:** どのようなPPT（確率的多項式時間）攻撃者も、`y != y'`であり、かつ両方のプルーフが検証されるような`(pk_vrf, x, y, pi, y', pi')`を見つけることはできません。

**証明の概要:** WHIRの知識抽出器（Fiat-Shamirの下でROM（ランダムオラクルモデル）に存在する）を適用して、`pi`から`vrf_sk`を、`pi'`から`vrf_sk'`を抽出します。もし`vrf_sk = vrf_sk'`であれば、`y = compress([vrf_sk, m]) = y'`となり、`y != y'`と矛盾します。もし`vrf_sk != vrf_sk'`であれば、`compress([vrf_sk, DOMAIN_VRF_PK, ...]) = compress([vrf_sk', DOMAIN_VRF_PK, ...]) = pk_vrf`は`poseidon16_compress`における衝突となります。これはPoseidon1の衝突耐性を破ることになります。

この構成は、X-VRFの欠陥（FC 2024）を設計上回避しています。一意性はハッシュ関数の衝突耐性に帰着され、WOTS+のチェーン一意性プロパティには依存しません。

### 5.3 擬似乱数性 (Pseudorandomness) (QROM)

**主張:** `H`への量子オラクルアクセスを持つQPT（量子多項式時間）攻撃者は、`pk_vrf`、他の入力でのVRF（検証可能乱数関数）評価、およびそれらのプルーフが与えられた場合、`y = H(vrf_sk, m)`を均一なランダム値と区別することはできません。

**モデル:** QROM（量子ランダムオラクルモデル）。**仮定:** Poseidon1は量子ランダムオラクルである。

**証明の概要:** これはZhandryの量子PRF（擬似乱数関数）定理（FOCS 2012, Theorem 3.1）の直接的な適用です。`F_k(m) = H(k, m)`と定義します。もし`H`が量子ランダムオラクルであり、`k = vrf_sk`が実質的に均一である（QROMにおける新しい入力に`H`を適用した出力であるため）ならば、`F_k`は量子安全なPRFです。攻撃者には、すべてのVRF入力からドメイン分離された追加の評価`pk_vrf = H(vrf_sk, DOMAIN_VRF_PK)`が与えられます。ZhandryのQPRFセキュリティにより、クエリされていない入力での値は均一な値と区別できません。

8要素の秘密鍵`vrf_sk`は、約124ビットの量子セキュリティ（8 x 31ビットのフィールド要素、leanMultisigのセキュリティレベルと一致）を提供します。QPRFの優位性の上限は、`q`個の量子クエリを行うQPT攻撃者に対して`O(q^2 / 2^{124})`であり、これは現実的なクエリ予算では無視できるレベルです。

**これはこの[[EIP|EIP（Ethereum 改善提案）]]における最も強力な結果です。** WHIR証明システムのQROM健全性が正式に確立されていない場合でも成り立ちます。量子攻撃者はVRF（検証可能乱数関数）出力を偽造してRANDAOを偏らせることはできません。そのためにはQROMでPoseidon1の一方向性を破る必要があります。

### 5.4 プルーフの健全性 (Proof Soundness) (ROM)

**主張:** どのようなPPT（確率的多項式時間）攻撃者も、`y`が`vrf_sk`に対する正しいPRF（擬似乱数関数）出力ではないような、検証される`(pk_vrf, x, y, pi)`を生成することはできません。

**モデル:** ROM（ランダムオラクルモデル）。**仮定:** WHIR IOP（対話型オラクル証明）に適用されたFiat-ShamirによるWHIRの健全性。

**証明の概要:** 公開コインIOPに対するFiat-Shamir定理により、非対話型WHIR引数はROMで健全です。誤った`y`に対する検証されるプルーフは、WHIRの健全性を破ることになります。

**QROMのギャップ:** WHIRに適用されたFiat-Shamirは、QROMで正式に分析されていません。これはleanMultisig自身のアテステーション集約プルーフに関する立場を反映しています。重要なのは、このギャップが影響するのはプルーフの健全性のみであり、擬似乱数性には影響しないということです。これらの特性は独立しています。誤った`y'`に対するプルーフを偽造するためにギャップを悪用する量子攻撃者であっても、`y'`を予測可能にしたり偏らせたりすることはできません。それはQPRF議論の下では擬似乱数であることに変わりありません。QROMのギャップを正式に埋めることが、付随論文の主要な目標です。

### まとめ

| 特性 | モデル | 仮定 | 状況 |
| --- | --- | --- | --- |
| 正当性 | 無条件 | WHIRの完全性 | 確立済み |
| 一意性 | ROM | WHIRの知識健全性 + Poseidon1の衝突耐性 | 確立済み（概要） |
| 擬似乱数性 | QROM | Poseidon1をQROMとして扱う (Zhandry 2012) | 確立済み（概要） |
| プルーフの健全性 | ROM | WHIR + Fiat-Shamir | 確立済み（概要） |
| プルーフの健全性 | QROM | WHIR QROM Fiat-Shamir | 未解決の問題 |

* * *

## 6. ベンチマーク

MacBook Air (Apple M2, 8コア, 8 GB RAM)、Rust 1.88.0、リリースプロファイル、`target-cpu=native`で測定。

WHIR構成：`log_inv_rate = 2`（レート1/4）、約124ビットのセキュリティ。

| 操作 | 時間 (中央値) | 注記 |
| --- | --- | --- |
| vrf_eval | 3.71 µs | PRF（擬似乱数関数）評価のみ (2x poseidon16_compress) |
| vrf_prove | 81.4 ms | 完全なWHIRプルーフ生成 |
| vrf_verify | 19.2 ms | プルーフ検証 |
| プルーフサイズ | 116 KB | postcard経由でシリアライズ |

比較として、BLSベースの[[EIP|EIP（Ethereum 改善提案）]]-7998のベースラインは、約1ミリ秒の証明/検証時間と96バイトのプルーフサイズです。116 KBのプルーフと81ミリ秒の証明者コストは、耐量子健全性のコストです。

**プロポーザーコスト:** `vrf_prove`は1スロットあたり1回実行されます。12秒のスロットでは、81ミリ秒は無視できるレベルです。

**ノードコスト:** 1ブロックあたり19.2ミリ秒の`vrf_verify`は、BLS集約検証と同程度のオーダーであり、処理予算内に十分に収まります。

**プルーフサイズ:** 116 KBは、当初の推定10〜50 KBよりも大きいです。これは実際の実装で測定された正直な数値です。プルーフにはWHIR多項式コミットメントとIOPトランスクリプトが含まれており、バリデーターの数によって増加することはありません。ビーコンブロックのサイズ予算内に収まっています。

116 KBは、3回の`poseidon16_compress`呼び出しに対するスタンドアロンのプルーフです。参考までに、leanMultisigは同じWHIRレートで約1,400個のXMSS署名を130〜355 KBのプルーフに集約します。VRF（検証可能乱数関数）プルーフは、劇的にシンプルな回路に対して同様のサイズです。

* * *

## 7. これが正しい修正である4つの理由

**1. 必須である。** L*において、BLSキーは廃止されます。現在の`randao_reveal`は完全に機能しなくなります。代替手段はありません。この[[EIP|EIP（Ethereum 改善提案）]]はオプションのVRF（検証可能乱数関数）強化ではなく、L*が有効化される前に必要な移行です。

**2. 安価である。** VRF回路は、KoalaBearフィールド上での3回の`poseidon16_compress`呼び出しです。これは、leanMultisigアテステーション集約回路内で既に実行されているのと同じプリミティブです。新しいプリコンパイルは必要ありません。新しい証明システムも導入されません。leanMultisig集約回路は変更されません。バリデーターのキー管理の負担は、バリデーターレコードに追加される32バイトのフィールド1つだけであり、これは既に登録されているleanSigシードから決定論的に導出されます。

**3. BLSの現状よりも強力である。** [[EIP|EIP（Ethereum 改善提案）]]-7998における一意性は、BLS12-381上の計算ディフィー・ヘルマン仮定（computational Diffie-Hellman assumption）に依存しています。この構成では、一意性はPoseidon1の衝突耐性に依存しており、これはハッシュベースのVRF（検証可能乱数関数）にとってより直接的でよく理解されている仮定です。擬似乱数性はQROM（量子ランダムオラクルモデル）で確立されており、これは[[EIP|EIP（Ethereum 改善提案）]]-7998では全く主張できません。X-VRFの一意性の欠陥（FC 2024）は設計上回避されています。

**4. 耐量子性がより早く実現される。** BLS公開鍵はすでにオンチェーンに存在します。CRQC（暗号学的に関連する量子コンピューター）は、今日、登録された公開鍵からBLS秘密鍵を回復できます。I*以降、RANDAOミックスにXORされるPQ VRF（検証可能乱数関数）の貢献は耐量子性を持つことになります。すべてのバリデーターのBLSキーを回復するCRQCは、BLS貢献を偏らせることはできますが、Poseidonベースの貢献を予測したり制御したりすることはできません。RANDAOはL*からではなく、I*から耐量子性を持つことになります。

* * *

## 8. 未解決の質問

2つの項目が未解決であり、付随論文とコミュニティからのフィードバックの主要なターゲットとなります。

**QROM（量子ランダムオラクルモデル）プルーフの健全性。** 具体的なセキュリティ境界を持つQROMにおけるFiat-Shamir + WHIRの健全性を確立すること。これはleanMultisig自身のセキュリティ分析における未解決の問題を反映しています。

**具体的な擬似乱数性の境界。** 私たちの特定のパラメータ（31ビットのフィールド要素、8要素のキー、現実的なEthereumクエリ予算）に対するZhandry QPRF（擬似乱数関数）の境界。境界は124ビットのセキュリティレベルで十分ですが、正確な定数を用いた具体的な分析はセキュリティ議論を強化するでしょう。

* * *

## 9. 私が求めていること

これはプレ[[EIP|EIP（Ethereum 改善提案）]]の議論投稿です。[[EIP|EIP（Ethereum 改善提案）]]のPRはコミュニティからのフィードバック後に公開されます。具体的には、以下の点についてレビューを求めています。

1.  **セキュリティ議論** – QROM（量子ランダムオラクルモデル）の擬似乱数性に関する主張（セクション5.3、Zhandry QPRF（擬似乱数関数））は正しく適用されていますか？ROM（ランダムオラクルモデル）の一意性削減（セクション5.2）は完全ですか？
    
2.  **leanMultisig回路インターフェース** – 3-compress zkDSLプログラムを用いた`prove_execution`は、VRF（検証可能乱数関数）をleanVMに統合する正しい方法ですか、それとも異なる方法で表現すべきですか？
    
3.  **ドメイン分離タグ** – `p - 1`、`p - 2`、`p - 3`、`p - 4`をVRFドメイン定数として使用することは、leanSigおよびleanSpecの内部規約と互換性がありますか？
    
4.  **移行メカニズム** – 3段階の`process_randao`（I*からのハイブリッドXOR、L*からのPQのみ）は正しいアプローチですか、それともI*からL*までの期間を処理するよりクリーンな方法がありますか？
    
5.  **プルーフサイズ。** 116 KBは実装からの正直な数値です。これはビーコンチェーンのブロック予算内に収まっていますか、それともブロックサイズパラメータの変更が必要ですか？
    

テスト、ベンチマーク、および`FINDINGS.md`パラメータ導出を含む参照実装は、[YOUR GITHUB LINK]にあります。

付随論文（セキュリティ証明と正式な境界）は添付されています：[PAPER TITLE / LINK]。

議論を楽しみにしています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/randao-breaks-at-l-a-post-quantum-vrf-for-ethereum/24906)
