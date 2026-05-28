---
title: PeerDAS - メモリ使用量4分の1で30%高速化
original_title: PeerDAS - 30% acceleration for 4x less memory usage
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978'
author: mratsim
date: '2026-05-27'
category: Consensus
tags:
  - consensus
  - data-availability
  - cryptography
  - scaling
  - research
  - protocol-design
  - peerdas
  - kzg-commitments
  - optimization
topic_id: '24978'
translated_at: '2026-05-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [PeerDAS - 30% acceleration for 4x less memory usage](https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978) — mratsim (2026-05-27)

イーサリアム財団からの助成金を受けて、最近ConstantineにPeerDASサポートを追加しました。

最先端の研究と慎重なエンジニアリングを組み合わせることで、事前計算テーブルのメモリ使用量を4分の1に抑えながら（そしてメモリを増やすことでさらに高速化）、c-kzg-4844と比較して30%の高速化を達成しました。これは、リソース制約のあるデバイスにとって大きな助けとなるはずです。

| ベンチマーク | 事前計算 | c-kzg-4844 (シリアル) | constantine (シリアル) | Δ% |
| --- | --- | --- | --- | --- |
| blob_to_kzg_commitment | — | 29.857 ms | 19.556 ms | -34.5% |
| compute_kzg_proof | — | 31.482 ms | 20.235 ms | -35.7% |
| compute_blob_kzg_proof | — | 31.691 ms | 19.858 ms | -37.3% |
| verify_kzg_proof | — | 0.802 ms | 0.568 ms | -29.1% |
| verify_blob_kzg_proof | — | 1.196 ms | 0.955 ms | -20.2% |
| verify_blob_kzg_proof_batch 1 | — | 1.203 ms | 1.044 ms | -13.2% |
| verify_blob_kzg_proof_batch 2 | — | 2.017 ms | 1.608 ms | -20.3% |
| verify_blob_kzg_proof_batch 4 | — | 3.600 ms | 2.760 ms | -23.3% |
| verify_blob_kzg_proof_batch 8 | — | 6.637 ms | 4.967 ms | -25.2% |
| verify_blob_kzg_proof_batch 16 | — | 13.056 ms | 9.205 ms | -29.5% |
| verify_blob_kzg_proof_batch 32 | — | 25.704 ms | 17.765 ms | -30.9% |
| verify_blob_kzg_proof_batch 64 | — | 51.174 ms | 34.736 ms | -32.1% |
| precompute_load (L0) | — | 1163.746 ms | — | — |
| PeerDAS (EIP-7594) |  |  |  |  |
| compute_cells | — | 1.932 ms | 1.020 ms | -47.2% |
| compute_cells_and_kzg_proofs | 事前計算なし | 183.384 ms | 141.489 ms | -22.8% |
| compute_cells_and_kzg_proofs | ckzg 事前計算=1, 768 KiB | 608.452 ms | — | — |
| compute_cells_and_kzg_proofs | ckzg 事前計算=2, 1536 KiB | 315.771 ms | — | — |
| compute_cells_and_kzg_proofs | ckzg 事前計算=3, 3 MiB | 226.319 ms | — | — |
| compute_cells_and_kzg_proofs | ckzg 事前計算=4, 6 MiB | 182.381 ms | — | — |
| compute_cells_and_kzg_proofs | ckzg 事前計算=5, 12 MiB | 156.495 ms | — | — |
| compute_cells_and_kzg_proofs | ckzg 事前計算=6, 24 MiB | 138.634 ms | — | — |
| compute_cells_and_kzg_proofs | ckzg 事前計算=7, 48 MiB | 129.472 ms | — | — |
| compute_cells_and_kzg_proofs | ckzg 事前計算=8, 96 MiB | 120.608 ms | — | — |
| compute_cells_and_kzg_proofs | ctt t=64, b=6, 32.2 MiB | — | 115.359 ms | — |
| compute_cells_and_kzg_proofs | ctt t=64, b=8, 96.0 MiB | — | 105.269 ms | — |
| compute_cells_and_kzg_proofs | ctt t=64, b=10, 312.0 MiB | — | 95.802 ms | — |
| compute_cells_and_kzg_proofs | ctt t=64, b=12, 1056.0 MiB | — | 87.591 ms | — |
| compute_cells_and_kzg_proofs | ctt t=128, b=6, 16.5 MiB | — | 114.424 ms | — |
| compute_cells_and_kzg_proofs | ctt t=128, b=8, 48.0 MiB | — | 101.874 ms | — |
| compute_cells_and_kzg_proofs | ctt t=128, b=10, 156.0 MiB | — | 95.423 ms | — |
| compute_cells_and_kzg_proofs | ctt t=128, b=12, 528.0 MiB | — | 88.957 ms | — |
| compute_cells_and_kzg_proofs | ctt t=256, b=6, 8.2 MiB | — | 117.055 ms | — |
| compute_cells_and_kzg_proofs | ctt t=256, b=8, 24.0 MiB | — | 98.698 ms | — |
| compute_cells_and_kzg_proofs | ctt t=256, b=10, 84.0 MiB | — | 97.307 ms | — |
| compute_cells_and_kzg_proofs | ctt t=256, b=12, 288.0 MiB | — | 93.098 ms | — |
| recover_cells_and_kzg_proofs¹ | ¹参照 | 137.245 ms | 97.272 ms | -29.1% |
| verify_cell_kzg_proof_batch² | — | 439.979 ms | 381.058 ms | -13.4% |

**注記:**

-   ¹ リカバリ: c-kzg-4844は事前計算=8 (96 MiB)を使用。constantineはt=256, b=8 (24 MiB)を使用。
-   ² c-kzg-4844は8192セル (64ブロブ) を検証。constantineはこの設定に一致。
-   Δ%はc-kzg-4844に対するconstantineの相対値を示す (負の値 = 高速)。
-   c-kzg-4844の事前計算レベルとconstantineの(t, b)設定は直接比較できない。
-   事前計算=8 (c-kzg-4844) は96 MiBのメモリと引き換えにFK20操作で約34%の高速化を実現。

**いくつかのハイライト:**

-   FK23 ([Fast amortized KZG proofs](https://eprint.iacr.org/2023/033) - 高速な償却KZG証明) の場合、トープレッツ行列 (Toeplitz matrix) 乗算をアキュムレータAPIで書き換え、可能な限り多くの処理（体（フィールド）の逆元計算、逆FFT、スカラー乗算）を最後に遅延・バッチ処理し、ホットパスでのアロケーションとストライド反復を制限しました: [constantine/constantine/math/matrix/toeplitz.nim at e6bee85e8c7a89af279460e4ca03283d817d1ce9 · mratsim/constantine · GitHub](https://github.com/mratsim/constantine/blob/e6bee85e8c7a89af279460e4ca03283d817d1ce9/constantine/math/matrix/toeplitz.nim) (逆FFTを遅延しなかったことで5倍、スカラー乗算をバッチ処理しなかったことでさらに2倍のパフォーマンスバグがありました [\[PeerDAS\] Perf fix - Proof computation 9.39x acceleration by mratsim · Pull Request #616 · mratsim/constantine · GitHub](https://github.com/mratsim/constantine/pull/616))
    
-   そして、c-kzg-4844と同様に事前計算されたMSM（多点スカラー乗算）を導入しましたが、BLSTのアプローチとは異なります: [blst/src/ec\_mult.h at e7f90de551e8df682f3cc99067d204d8b90d27ad · supranational/blst · GitHub](https://github.com/supranational/blst/blob/e7f90de551e8df682f3cc99067d204d8b90d27ad/src/ec_mult.h#L87-L96) / [c-kzg-4844/README.md at 9f4bcc83cbb17b3dbc3432de7320790968143ab9 · ethereum/c-kzg-4844 · GitHub](https://github.com/ethereum/c-kzg-4844/blob/9f4bcc83cbb17b3dbc3432de7320790968143ab9/README.md?plain=1#L111)
    
    ```
    static void ptype##_precompute_w##SZ(ptype row[], const ptype *point) \
    { \
        size_t i, j; \
                                          /* row[-1] is implicit infinity */\
        vec_copy(&row[0], point, sizeof(ptype));        /* row[0]=p*1     */\
        ptype##_double(&row[1],  point);                /* row[1]=p*(1+1) */\
        for (i = 2, j = 1; i < 1<<(SZ-1); i += 2, j++) \
            ptype##_add(&row[i], &row[j], &row[j-1]),   /* row[2]=p*(2+1) */\
            ptype##_double(&row[i+1], &row[j]);         /* row[3]=p*(2+2) */\
    }                                                   /* row[4] ...     */\
    ```
    
    事前計算テーブルは、Gottfried Herold ([Notes on MSMs with Precomputation - HackMD](https://hackmd.io/WfIjm0icSmSoqy2cfqenhQ)) と Ignacio Hagopian ([Verkle Trees - Another iteration of VKTs MSM - HackMD](https://hackmd.io/@jsign/vkt-another-iteration-of-vkt-msms)) が記述した手法に従い、[constantine/constantine/math/elliptic/ec\_multi\_scalar\_mul\_precomp.nim at e6bee85e8c7a89af279460e4ca03283d817d1ce9 · mratsim/constantine · GitHub](https://github.com/mratsim/constantine/blob/e6bee85e8c7a89af279460e4ca03283d817d1ce9/constantine/math/elliptic/ec_multi_scalar_mul_precomp.nim) を用いることで、Constantineが事前計算テーブルなしで持っていた22%の優位性を維持し、さらに改善しながら、驚異的な4倍のメモリ削減を実現しました。
    

**マルチスレッドについて**

[[glossary/EIP|EIP]]-4844とは異なり、PeerDASはまだ並列化していませんが、Constantineの並列バックエンドは高度にチューニングされており（go-kzg-4844との比較はこちらを参照 [Releasing Constantine v0.2.0 (Jan 2025), a modular cryptography stack for Ethereum](https://ethresear.ch/t/releasing-constantine-v0-2-0-jan-2025-a-modular-cryptography-stack-for-ethereum/19990#p-48991-kzg-polynomial-commitment-for-eip-4844-consensus-layer-9) 22%高速化）、低オーバーヘッドでネストされた並列処理が可能です。実際、私のMSMは3レベルの並列処理を持ち、PeerDASのボトルネックは128個の事前計算されたMSMに対する極めて並列化しやすいforループです: [constantine/constantine/math/matrix/toeplitz.nim at e6bee85e8c7a89af279460e4ca03283d817d1ce9 · mratsim/constantine · GitHub](https://github.com/mratsim/constantine/blob/e6bee85e8c7a89af279460e4ca03283d817d1ce9/constantine/math/matrix/toeplitz.nim#L344-L362)

```
proc finish*[EC, ECaff, F; N: static int](
  ctx: var ToeplitzAccumulator[EC, ECaff, F],
  output: var openArray[EC],
  polyphaseSpectrumBank: openArray[PrecomputedMSM[EC, N]]
): ToeplitzStatus {.raises: [], meter.} =
  ## Finalize using precomputed MSM tables (one per output position).
  ## For each output position `i`, extracts the `L` scalars from `coeffs`
  ## and computes `output[i]` using `polyphaseSpectrumBank[i].msm_vartime`.
  ## After all MSMs, an in-place EC IFFT is applied to `output`.
  let n = ctx.size
  if n == 0 or output.len != n or ctx.offset != ctx.L or polyphaseSpectrumBank.len != n or N != ctx.L:
    return Toeplitz_MismatchedSizes
  let scalars = cast[ptr UncheckedArray[F.getBigInt()]](ctx.scratchScalars)
  for i in 0 ..< n:
    for offset in 0 ..< ctx.L:
      scalars[offset].fromField(ctx.coeffs[i * ctx.L + offset])
    polyphaseSpectrumBank[i].msm_vartime(output[i], scalars.toOpenArray(ctx.L))
  checkReturn ec_ifft_nn(ctx.ecFftDesc, output, output)
  return Toeplitz_Success
```

*したがって、8コアZen 4搭載のミニPC（Ryzen 7840HSはノートPCやミニPCで非常に人気があります）を想定すると、64ブロブの証明で15ミリ秒を下回ることは十分に可能だと確信しています。*

* * *

関連PR:

-   初期構造: [https://github.com/mratsim/constantine/pull/613](https://github.com/mratsim/constantine/pull/613)
-   C、Go、Rust API: [https://github.com/mratsim/constantine/pull/617](https://github.com/mratsim/constantine/pull/617)
-   ベンチマークによる最終的なパフォーマンスチューニング: [https://github.com/mratsim/constantine/pull/619](https://github.com/mratsim/constantine/pull/619)

*1件の投稿 - 1人の参加者*

[トピック全文を読む](https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978)
