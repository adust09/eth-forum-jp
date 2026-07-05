---
title: >-
  Qingming-g64-ntt: RX 7900 XTXにおけるネイティブGoldilocks/G64 GPU NTT (2^27)
  と再現可能なベンチマーク計画
original_title: >-
  Qingming-g64-ntt: Native Goldilocks/G64 GPU NTT at 2^27 on RX 7900 XTX, and a
  reproducible benchmark plan
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/qingming-g64-ntt-native-goldilocks-g64-gpu-ntt-at-2-27-on-rx-7900-xtx-and-a-reproducible-benchmark-plan/25359
author: uulong950
date: '2026-07-04'
category: 'zk-s[nt]arks'
tags:
  - snarks
  - zk
  - proving
  - cryptography
  - scaling
  - research
  - gpu
  - ntt
  - starks
topic_id: '25359'
translated_at: '2026-07-05'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Qingming-g64-ntt: Native Goldilocks/G64 GPU NTT at 2^27 on RX 7900 XTX, and a reproducible benchmark plan](https://ethresear.ch/t/qingming-g64-ntt-native-goldilocks-g64-gpu-ntt-at-2-27-on-rx-7900-xtx-and-a-reproducible-benchmark-plan/25359) — uulong950 (2026-07-04)

オープンソースのネイティブGoldilocks/G64 GPU NTT実装を共有し、STARK-LDEワークロードのベンチマーク手法に関するフィードバックを求めたいと思います。

私は`qingming-g64-ntt`の著者です。これは、STARKスタイルのLDEワークロード向けネイティブGoldilocksフィールドNTTの、オリジナルのAMD HIP / ROCm実装です。この投稿の目的は、普遍的な「最速NTT」を主張することではなく、ネイティブG64 GPU NTTの結果をより再現可能で、より明確に指定され、オープンな実装間で比較しやすくすることです。

リポジトリ: \[[https://github.com/uulong950/qingming-g64-ntt\\](https://github.com/uulong950/qingming-g64-ntt%5C)\]

関連する外部ベースライン作業: \[[https://github.com/Alisah-Ozcan/GPU-NTT/pull/6\\](https://github.com/Alisah-Ozcan/GPU-NTT/pull/6%5C)\]

## 動機

Goldilocks/G64は、Plonky2スタイルのSTARK/FRIシステムや関連するプロバーパイプラインにとって依然として重要です。しかし、公開されているGPU NTTベンチマーク結果は、比較が難しいことが多いです。

私が見てきた一般的な曖昧さには、以下のようなものがあります。

-   フィールドは真にネイティブGoldilocks/G64なのか、それとも汎用64ビット演算に過ぎないのか？
    
-   測定されている正確な変換サイズは何か？
    
-   タイミングには、レイアウト/転置（transpose）/ラッパー作業が含まれるのか、それともコアカーネルのみなのか？
    
-   出力順序/レイアウト規約は何か？
    
-   正確性は独立したCPUリファレンスに対してチェックされているのか、それとも弱い健全性テストに対してのみなのか？
    
-   実際にサポートされている変換サイズはどれで、サポートされていないサイズはどれか？
    

私はこれらの前提を明確にしようとしています。

## ワークロード

`qingming-g64-ntt`における現在の主要なワークロードは以下の通りです。

-   フィールド: Goldilocks / G64
    
-   モジュラス: `p = 2^64 - 2^32 + 1`
    
-   ジェネレーター: `7`
    
-   元の論理サイズ: `2^24`
    
-   LDE展開: 正確に`8倍`
    
-   変換ドメイン: `2^27`
    
-   バックエンド: AMD HIP / ROCm
    
-   検証GPU: AMD Radeon RX 7900 XTX
    

リポジトリには、`logn = 20`から`logn = 27`までのスケーリングターゲットも提供されています。

## 正確性チェック

この実装には、いくつかの正確性ゲートが含まれています。

-   フィールド演算のランダム化された自己テスト
    
-   プリミティブ`2^27`ルート規約
    
-   明示的なベース-512レイアウト全単射
    
-   デルタベクトルチェック
    
-   サンプリングされた直接評価
    
-   標準/高速レイアウトマッピングチェック
    
-   `2^27`ターゲットに対する完全なCPU radix-2リファレンスチェック
    

この部分は重要だと思います。デルタベクトルチェックだけでは不十分です。なぜなら、多くの誤ったレイアウトやトゥイドル（twiddle）スケジュールでも、すべて1の出力チェックをパスしてしまう可能性があるからです。サンプリングされた直接評価とCPUリファレンスチェックは、実際のマッピングや分解エラーを検出するのに役立ちます。

## 現在のRX 7900 XTXの結果

ROCm/HIPを使用したAMD Radeon RX 7900 XTXで測定。

高速インターフェースのスケーリング:

| logn | N | 論理サイズ | 中央値 (ms) | p95 (ms) |
| --- | --- | --- | --- | --- |
| 24 | 16,777,216 | 2,097,152 | 2.8914 | 2.9595 |
| 25 | 33,554,432 | 4,194,304 | 4.8422 | 5.4525 |
| 26 | 67,108,864 | 8,388,608 | 9.9209 | 10.2368 |
| 27 | 134,217,728 | 16,777,216 | 19.1927 | 19.4936 |

`logn = 27`の場合、これは私が重視する主要なSTARK-LDEポイントに対応します。

```
論理サイズ = 2^24
LDE係数   = 8
ドメインサイズ  = 2^27

```

これはまだプリミティブレベルのベンチマークです。

## GPU-NTTとの相互チェック

別途、私はGPU-NTT PR #6をオープンし、`paper_version`の4ステップ実装に対するスタンドアロンで検証済みのネイティブGoldilocks/G64ベンチマークパスを追加しました。

そのPR/テストからの現在の観察:

-   `logn = 24`はRTX 4090で動作し、検証されます。
    
-   `logn >= 25`は現在、そのパスではサポートされていないと報告されています。
    
-   これはGPU-NTTに対するパフォーマンス主張ではなく、サポート/カバレッジに関する観察です。
    

このPRを行った理由は、`qingming-g64-ntt`を私自身の実装と比較するだけにとどめたくなかったからです。同じフィールドと検証前提の下で、より明確な外部ベースラインを求めています。

## 計画されている今後の作業

私は次の3つのステップを計画しています。

### 1. RTX 4090でのqingming-g64-ntt

現在の公開実装はAMD HIP / ROCmです。同じG64/STARK-LDEワークロードを消費者向けAMDと消費者向けNVIDIAの両方のハードウェアで評価できるように、RTX 4090 / CUDA側での比較も提供したいと考えています。

### 2. ntt-g64-benchmark

私は別の`ntt-g64-benchmark`リポジトリを作成する予定です。

目標は、すべてのNTT実装を単一の数値でランク付けすることではありません。目標は、ネイティブGoldilocks/G64 GPU NTT実装のための再現可能なファクトマトリックスを構築することです。

このマトリックスには、以下を記録すべきです。

-   実装
    
-   ソース / コミット / PR
    
-   フィールドとモジュラス
    
-   変換サイズ
    
-   論理サイズとLDE係数
    
-   デバイスとソフトウェアスタック
    
-   タイミング領域
    
-   出力レイアウト
    
-   正確性検証方法
    
-   生ログ
    
-   再現コマンド
    
-   サポートされている/サポートされていないサイズ
    

サポートされていないサイズも記録されるべきだと考えます。例えば、「`2^24`はサポートするが`2^25`はサポートしない」という情報は、STARK-LDEエンジニアリングにとって有用な情報です。

### 3. qingming-zkp

私は`qingming-zkp`も持っており、これはプリミティブレベルのNTT高速化から、NTT、Merkle、FRI、オープニング、検証を含むより完全なG64/STARKプロバーパイプラインへ移行することを意図しています。

現在の`qingming-g64-ntt`の結果は、NTT/LDEプリミティブ層として理解されるべきです。完全なプロバーベンチマークには、AIR、トランスクリプト、セキュリティパラメータ、Merkle/FRIの詳細、検証者、証明サイズ、エンドツーエンドの実時間（wall-clock time）といった、より厳密な定義が必要です。

## コミュニティへの質問

ベンチマーク手法に関するフィードバックをいただければ幸いです。

1.  `logical_size = 2^24`と正確に`8倍`のLDEを`2^27`に展開するワークロードは、代表的なGoldilocks/STARK-LDEベンチマークポイントとして適切でしょうか？
    
2.  ネイティブG64 GPU NTTベンチマークには、デフォルトでどの変換サイズを含めるべきでしょうか？私の現在の提案は`2^20`から`2^27`までで、`2^24..2^27`に焦点を当てることです。
    
3.  どのタイミング領域を必須とすべきでしょうか？
    
    -   コアカーネルのみ
        
    -   レイアウト/転置を含むラッパー
        
    -   完全なプロバー段階のタイミング
        
4.  公開ベンチマークには、どの正確性チェックを要求すべきでしょうか？
    
    -   サンプリングされた直接評価
        
    -   完全なCPUリファレンス
        
    -   逆変換チェック
        
    -   固定シードテストベクトル
        
    -   出力ダイジェスト
        
5.  `ntt-g64-benchmark`に含めるべき、他にオープンソースのネイティブGoldilocks/G64 GPU NTT実装はありますか？
    
6.  Plonky2/Plonky3スタイルのシステムにおいて、「論理サイズ + LDE係数 + 変換ドメイン」よりも優れたワークロード定義はありますか？
    

手法、代表的なワークロード、正確性要件、または公正なベースラインに関するフィードバックは、大変役立ちます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/qingming-g64-ntt-native-goldilocks-g64-gpu-ntt-at-2-27-on-rx-7900-xtx-and-a-reproducible-benchmark-plan/25359)
