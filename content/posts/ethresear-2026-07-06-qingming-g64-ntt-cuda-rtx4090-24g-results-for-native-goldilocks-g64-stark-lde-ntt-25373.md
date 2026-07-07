---
title: 'Qingming-g64-ntt-cuda: ネイティブGoldilocks/G64 STARK-LDE NTTのRTX4090-24G結果レポート'
original_title: >-
  Qingming-g64-ntt-cuda: RTX4090-24G results for native Goldilocks/G64 STARK-LDE
  NTT
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/qingming-g64-ntt-cuda-rtx4090-24g-results-for-native-goldilocks-g64-stark-lde-ntt/25373
author: uulong950
date: '2026-07-06'
category: 'zk-s[nt]arks'
tags:
  - snarks
  - zk
  - proving
  - cryptography
  - research
  - scaling
topic_id: '25373'
translated_at: '2026-07-07'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Qingming-g64-ntt-cuda: RTX4090-24G results for native Goldilocks/G64 STARK-LDE NTT](https://ethresear.ch/t/qingming-g64-ntt-cuda-rtx4090-24g-results-for-native-goldilocks-g64-stark-lde-ntt/25373) — uulong950 (2026-07-06)

ネイティブな[[glossary/Goldilocks-field|Goldilocks/G64体]] [[glossary/STARK|STARK]]-[[glossary/Low-Degree-Extension|LDE]] [[glossary/Number-Theoretic-Transform|NTT]]に関するCUDA / RTX4090-24Gの結果レポートを公開します。

リポジトリ:

```
https://github.com/uulong950/qingming-g64-ntt-cuda
```

これは、以前のAMD HIP / ROCmでの`qingming-g64-ntt`作業に続く、CUDA側のフォローアップです。

このリリースの目的は、明確なインターフェース定義、検証チェック、およびサポートされるサイズ境界を備えた、再現可能なRTX4090-24Gの結果を報告することです。

## ステータス

```
status,RTX4090-24G,implemented_and_validated
status,A100-40G,todo
field,native_Goldilocks_G64
modulus,0xffffffff00000001
generator,7
lde_factor,8
```

現在のRTX4090-24Gリリースでは、2つのインターフェースが報告されています。

```
qingming_fast:
  input  = device-native tiled input
  output = mapped output

qingming_standard:
  input  = natural-order input
  output = standard materialized output
```

両方のインターフェースは、`domain_logn = 20`から`domain_logn = 30`まで検証されています。

`domain_logn = 31`は、RTX4090-24Gの容量制限によりゲートされています。

`domain_logn >= 32`は、現在のサポート範囲外です。

## ワークロード

ワークロードは、[[glossary/STARK|STARK]]スタイルの[[glossary/Low-Degree-Extension|LDE]]向けネイティブ[[glossary/Goldilocks-field|Goldilocks/G64体]] [[glossary/Number-Theoretic-Transform|NTT]]です。

```
field      = Goldilocks / G64
modulus    = 2^64 - 2^32 + 1
generator  = 7
lde_factor = 8
```

報告されたLDE関係は次のとおりです。

```
logical_logn = 17..28
domain_logn  = logical_logn + 3
```

したがって、一般的な[[glossary/STARK|STARK]]-[[glossary/Low-Degree-Extension|LDE]]ポイントは次のとおりです。

```
logical_logn = 24
lde_factor   = 8
domain_logn  = 27
```

## 独立した検証

GitHubから独立した新規クローンを実行し、RTX4090-24G上でアーティファクトを再構築し、検証スイートを再実行しました。

検証により以下が確認されました。

```
self_test,pass
gpu_cpu_check,pass
radix512_check,pass
qingming_fast,domain_logn20_to_30,pass
qingming_standard,domain_logn20_to_30,pass
domain_logn31,capacity_gated_on_rtx4090_24g
```

したがって、このリリースでは、高速インターフェースと標準インターフェースの両方で、RTX4090-24G上で`domain_logn = 20..30`が検証済みとして報告されています。

## RTX4090-24Gインターフェース結果

| ドメインログN | qingming_fast 中央値 (ms) | qingming_fast GB/秒 | qingming_standard 中央値 (ms) | qingming_standard GB/秒 | ステータス |
| --- | --- | --- | --- | --- | --- |
| 20 | 0.2427 | 153.62 | 0.2806 | 132.88 | 合格 |
| 21 | 0.3400 | 230.30 | 0.4096 | 191.15 | 合格 |
| 22 | 0.5183 | 316.52 | 0.6800 | 241.25 | 合格 |
| 23 | 0.7720 | 444.28 | 1.2534 | 273.66 | 合格 |
| 24 | 1.2329 | 580.61 | 2.2958 | 311.80 | 合格 |
| 25 | 2.3142 | 644.41 | 4.6806 | 318.61 | 合格 |
| 26 | 4.5804 | 677.22 | 16.8243 | 184.37 | 合格 |
| 27 | 9.1535 | 703.82 | 38.1430 | 168.90 | 合格 |
| 28 | 22.7062 | 588.48 | 79.8986 | 167.24 | 合格 |
| 29 | 48.9042 | 565.98 | 164.1800 | 168.59 | 合格 |
| 30 | 96.9032 | 590.96 | 325.8757 | 175.73 | 合格 |
| 31 | NA | NA | NA | NA | 容量制限によりゲートされている |
| ドメインログN | qingming_standard 中央値 (ms) | p95 ms | スループット | ステータス |
| --- | --- | --- | --- | --- |
| 20 | 0.2775 | 0.2775 | 134.35 GB/s | 合格 |
| 21 | 0.4055 | 0.4055 | 193.08 GB/s | 合格 |
| 22 | 0.6697 | 0.6697 | 244.95 GB/s | 合格 |
| 23 | 1.2452 | 1.2452 | 275.46 GB/s | 合格 |
| 24 | 2.2825 | 2.2835 | 313.62 GB/s | 合格 |
| 25 | 4.6070 | 4.6100 | 323.71 GB/s | 合格 |
| 26 | 16.5057 | 16.5151 | 187.93 GB/s | 合格 |
| 27 | 38.0937 | 38.1102 | 169.12 GB/s | 合格 |
| 28 | 79.9314 | 79.9324 | 167.17 GB/s | 合格 |
| 29 | 164.7667 | 165.5450 | 167.99 GB/s | 合格 |
| 30 | 323.5491 | 325.0944 | 176.99 GB/s | 合格 |
| 31 | NA | NA | NA | 容量制限によりゲートされている |

## 標準インターフェースの直接結果

標準インターフェースには、自然順序入力処理と標準的な具現化された出力が含まれます。

| ドメインログN | qingming_standard 中央値 (ms) | p95 ms | スループット | ステータス |
| --- | --- | --- | --- | --- |
| 20 | 0.2775 | 0.2775 | 134.35 GB/s | 合格 |
| 21 | 0.4055 | 0.4055 | 193.08 GB/s | 合格 |
| 22 | 0.6697 | 0.6697 | 244.95 GB/s | 合格 |
| 23 | 1.2452 | 1.2452 | 275.46 GB/s | 合格 |
| 24 | 2.2825 | 2.2835 | 313.62 GB/s | 合格 |
| 25 | 4.6070 | 4.6100 | 323.71 GB/s | 合格 |
| 26 | 16.5057 | 16.5151 | 187.93 GB/s | 合格 |
| 27 | 38.0937 | 38.1102 | 169.12 GB/s | 合格 |
| 28 | 79.9314 | 79.9324 | 167.17 GB/s | 合格 |
| 29 | 164.7667 | 165.5450 | 167.99 GB/s | 合格 |
| 30 | 323.5491 | 325.0944 | 176.99 GB/s | 合格 |
| 31 | NA | NA | NA | 容量制限によりゲートされている |

## 主要な報告ポイント

一般的なLDE-8ポイントの場合:

```
logical_logn = 24
domain_logn  = 27
```

RTX4090-24Gの新規クローン結果は次のとおりです。

```
qingming_fast:
  median_ms  = 9.1535
  throughput = 703.82 GB/s

qingming_standard:
  median_ms  = 38.1430
  throughput = 168.90 GB/s
```

`domain_logn = 27`における直接的な標準インターフェースパイプライン結果は次のとおりです。

```
qingming_standard:
  median_ms  = 38.0937
  p95_ms     = 38.1102
  throughput = 169.12 GB/s
```

## 境界

報告されたRTX4090-24Gの境界は次のとおりです。

```
domain_logn20_to_30,validated
domain_logn31,capacity_gated_on_RTX4090_24G
domain_logn32_and_above,outside_current_supported_range
```

## リリースノート

このリリースは、ネイティブ[[glossary/Goldilocks-field|Goldilocks/G64体]] [[glossary/STARK|STARK]]-[[glossary/Low-Degree-Extension|LDE]] [[glossary/Number-Theoretic-Transform|NTT]]向けに、信頼性の高いCUDA / RTX4090-24Gの結果セットを提供することを目的としています。

リポジトリには、このレポートで使用されたベンチマーク出力と検証ファイルが含まれています。

*3投稿 - 2参加者*

[トピック全文を読む](https://ethresear.ch/t/qingming-g64-ntt-cuda-rtx4090-24g-results-for-native-goldilocks-g64-stark-lde-ntt/25373)
