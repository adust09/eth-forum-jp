---
title: CuEVM - GPUで数百万TPSを達成、ファジングとその先へ
original_title: CuEVM - Achieving Millions of TPS on GPUs for fuzzing and beyond
source_url: >-
  https://ethresear.ch/t/cuevm-achieving-millions-of-tps-on-gpus-for-fuzzing-and-beyond/24873
author: minhhn2910
date: '2026-05-14'
category: Execution Layer Research
tags:
  - execution-layer-research
  - ethereum
  - gpu
  - fuzzing
topic_id: '24873'
translated_at: '2026-05-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [CuEVM - Achieving Millions of TPS on GPUs for fuzzing and beyond](https://ethresear.ch/t/cuevm-achieving-millions-of-tps-on-gpus-for-fuzzing-and-beyond/24873) — minhhn2910 (2026-05-14)

**CuEVM V2**を発表します。私たちは2024年に、GPUネイティブなEVMでトランザクションを並列実行し、EthereumエコシステムのためにGPUパワーを活用することを目指しました。最初のユースケースはファジング（わずかに変異させたトランザクションを大量にテストすること）です。さらなるユースケースとしては、トランザクションシミュレーションや、適切な並行性制御を備えたL2向けの並列実行も考えられます。Devcon SEAで発表した**CuEVM V1**（40-80k TPS、[講演へのリンク](https://app.devcon.org/schedule/PQBKHF)）以降、私たちはコードベース全体を再設計・再実装し、前例のないスループット（800万+ TPS）を実現しました。

すべてのソースコードとDockerコンテナが公開され、誰でも試したり、その上に構築したりできるようになりました。今後数週間にわたるフォローアップ投稿で、より詳細な設計選択と研究論文のプレプリントを共有する予定です。貢献、議論、質問を歓迎します。

### **ハイライト**

-   :high_voltage: RTX 5000 AdaでERC20転送（ステート競合なし）において**800万+ TPS**
-   :test_tube: medusa-cuevmによるエンドツーエンドのスマートコントラクトファジングで**100万+ ファジングTPS**
-   :magnifying_glass_tilted_left: ファジング統合: CryticのMedusa v1.2.1上に構築された**medusa-cuevm**
-   :white_check_mark: go-ethereumと**96%以上のトレースが一致**（eth-tests Shanghaiにて）
-   :spouting_whale: 簡単に再現可能なDockerコンテナ

**Githubリンク**

-   CuEVM [sbip-sg/CuEVM](https://github.com/sbip-sg/CuEVM)
-   ファザー統合とベンチマークを含むDockerコンテナ [minhhn2910/CuEVM-container](https://github.com/minhhn2910/CuEVM-container)

### **エコシステム統合**

-   **medusa-cuevm** - CryticのMedusa上に構築
-   **go-evmlab** - holiman/goevmlabからのフォーク

### **構成とリソース消費**

-   32,768～65,536 CUDAスレッド ↔ 約20GB GPUメモリ
-   トランザクションのバッチ間でCUDAスレッド用のトランザクションデータを準備し、実行結果を処理するために2～8個のCPUスレッドを使用します。これらのパラメータの設定方法によって、ボトルネックはCPU側とGPU側の間で変化します。

### **高スループットのための主な最適化**

-   **コヒーレントアクセスを備えた事前割り当てバッファ**（重要なCUDA最適化）
-   異なるEVMインスタンス間での**データ構造のインターリーブ**（SoA、構造体配列設計）
-   **スレッドスケジューリング**（ワープサイズトランザクションの類似性）
-   GPUリソースの**低レベル最適化**（例: レジスタ使用量）
-   **楽観的リバートメカニズム**（コピーオンライト、すべての書き込みのログを保持。コミットはステートに直接書き込むため安価、リバートは高価）
-   **CPU↔GPU間のトランザクションデータ転送の最小化**（トランザクション間で永続的なワールドステート、ステートリセット用のキャッシュされた初期ステート）

### **結果の再現**

完全に再現可能な環境は、上記のDockerコンテナリンクから利用できます。

### **インターフェース**

-   **CuEVMバイナリ** — go-ethereumの./cmd/evmと同等の機能。JSONファイルをインプットとして受け取ります。
-   **CuEVMライブラリ (libcuevm\_go.so)** — それ自体がファザーであり、ホストプログラムと連携してスマートコントラクトをファジングし、バグをトリガーするプログラムカウンタを返します。サポートされているオラクル: Medusaからのアサーション、整数バグ、Etherリーク、リエントランシー。

### **設計**

![CuEVM 全体設計](https://ethresear.ch/uploads/default/optimized/3X/4/1/410c430879af2958bb1d2f47b4eb0d827d815574_2_690x250.png)

**実行モデル:** 初期ステート + 各MトランザクションのNシーケンス → GPUカーネルがN個のCUDAスレッド = N個のトランザクション（Nシーケンスすべての最初のトランザクション）を実行 → ステートはGPUメモリに永続化 → Nシーケンスすべての2番目のトランザクションを実行 → … → NシーケンスすべてのM番目のトランザクションを実行 → 結果をコピー → ステートをリセット。

**通信:**

-   生のトランザクションデータは、GoライブラリとバイナリEVMモード間の互換性を保つため、eth-testsのJSONフォーマットを模倣したオブジェクトとして渡されます。
-   単一のワールドステートがN個すべてのEVMインスタンスにクローンされ、各インスタンスが1つのトランザクションを実行します。
-   **実行結果:** ファジング固有の結果（バグの場所、バグをトリガーしたりコードカバレッジを向上させたりする興味深い入力）、および[[EIP|EIP]]-3155トレース（現在は1つのスレッドのトレース出力に限定）。CuEVMを計測して、他のカスタム結果を出力することも可能です。

### **異なるアプローチ**

私は実験的にPythonライブラリとPython製のファザーをゼロから開発しましたが、CPU側での並列データ準備の難しさ（CPU側が最大のボトルネックになる）のため、その方向性を断念しました。Python 3.13+でGILが無効化された真のマルチスレッディングが導入されるため、Pythonライブラリは将来の作業にとって実行可能な方向性となる可能性があります。

* * *

新しいユースケースや機会について、議論し、フォローアップし、協力できることを嬉しく思います。お気軽に@nminh\_hoまでDMしてください。

このプロジェクトは、シンガポール国立大学のシンガポールブロックチェーンイノベーションプログラムの下で開発され、Ethereum Foundationから資金提供を受けました。CuEVMをエコシステムに統合する上でのサポートと指導に対し、Fredrik Svantes氏に感謝いたします。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/cuevm-achieving-millions-of-tps-on-gpus-for-fuzzing-and-beyond/24873)
