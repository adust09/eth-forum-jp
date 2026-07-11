---
title: 'Qingming-STARK-G64: AMD ROCm/HIP上のGoldilocks STARKバックエンド'
original_title: 'Qingming-STARK-G64: a Goldilocks STARK backend on AMD ROCm/HIP'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/qingming-stark-g64-a-goldilocks-stark-backend-on-amd-rocm-hip/25417
author: uulong950
date: '2026-07-10'
category: 'zk-s[nt]arks'
tags:
  - snarks
  - zk
  - proving
  - cryptography
  - scaling
  - applications
  - starks
  - gpu-acceleration
topic_id: '25417'
translated_at: '2026-07-11'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Qingming-STARK-G64: a Goldilocks STARK backend on AMD ROCm/HIP](https://ethresear.ch/t/qingming-stark-g64-a-goldilocks-stark-backend-on-amd-rocm-hip/25417) — uulong950 (2026-07-10)

![qingming_stark_g64_証明チャート](https://ethresear.ch/uploads/default/optimized/3X/c/a/ca10268bf771c307a6390761ee3a2a7503560fb8_2_690x383.png)

私は、AMD ROCm/HIPをターゲットとする、[[glossary/Goldilocks-field|Goldilocks体 (Goldilocks field)]]/G64 [[glossary/STARK|STARK]] バックエンドである `qingming-stark-g64` を構築し、リリースしました。

リポジトリ:

[https://github.com/uulong950/qingming-stark-g64](https://github.com/uulong950/qingming-stark-g64)

この成果物は、シンプルな証明パイプラインを提供します。

```
CLI prover → QSPG64 .qsp proof file → standalone verifier

```

私は `SCALE20` から `SCALE27` までの完全な保持されたMerkleツリー行列を検証しました。

各スケールは以下のように完了しました。

```
prover: PASS
standalone verifier: PASS

```

最も重要な実用上のポイントは `SCALE24` です。

```
SCALE24
2^24 rows
1,048,576 trace rows
337 ms proving time
192 MiB retained Merkle tree
standalone verifier PASS

```

これは実用的なアプリケーションのポイントとなりそうです。コンシューマー向けAMD GPUバックエンドで、100万行の[[glossary/STARK|STARK]]証明をサブ秒のレイテンシで実行できます。

フラッグシップのベンチマークポイントは `SCALE27` です。

```
SCALE27
2^27 rows
8,388,608 trace rows
2.05 s proving time
1.5 GiB retained Merkle tree
fast_prelayout_xyz
standalone verifier PASS

```

この成果物は、具体的なバックエンド境界に基づいて設計されています。

```
source-visible prover
explicit proof file
independent verifier
AMD ROCm/HIP proving path
cost-controlled local proving

```

構造的な意味合いとしては、より多くのアプリケーションが通常のバックエンド計算から、証明を伴う計算へと移行できるようになる可能性があるということです。

```
result → result + proof

```

ビジネスロジック、決済、コンプライアンスチェック、本人確認、データ処理、AIエージェントのタスク検証、そして分散型サービスは、信頼された出力だけでなく、検証可能な出力を公開できるようになります。

`SCALE27` は上位ベンチマークパスを示しています。

`SCALE24` はアプリケーションポイントを示しています。

重要なメッセージはシンプルです。

```
100万行のSTARK証明は、実際のアプリケーションから呼び出されるのに十分な速さ、小ささ、そして安価さになる可能性があります。

```

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/qingming-stark-g64-a-goldilocks-stark-backend-on-amd-rocm-hip/25417)
