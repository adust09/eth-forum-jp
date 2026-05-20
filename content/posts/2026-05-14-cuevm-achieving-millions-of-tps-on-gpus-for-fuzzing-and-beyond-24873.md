---
title: CuEVM - ファジングなどでGPU上で数百万TPSを達成
original_title: CuEVM - Achieving Millions of TPS on GPUs for fuzzing and beyond
source_url: >-
  https://ethresear.ch/t/cuevm-achieving-millions-of-tps-on-gpus-for-fuzzing-and-beyond/24873
author: minhhn2910
date: '2026-05-14'
category: Execution Layer Research
tags:
  - execution-layer-research
  - fuzzing
  - gpu
  - evm
  - performance
  - parallel-execution
topic_id: '24873'
translated_at: '2026-05-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [CuEVM - Achieving Millions of TPS on GPUs for fuzzing and beyond](https://ethresear.ch/t/cuevm-achieving-millions-of-tps-on-gpus-for-fuzzing-and-beyond/24873) — minhhn2910 (2026-05-14)

**CuEVM V2**を発表します。私たちは2024年に、GPUネイティブなEVMでトランザクションを並列実行し、ファジング（わずかに変異させたトランザクションを大量にテストすること）を最初のユースケースとして、イーサリアムエコシステムにGPUパワーを活用することを目指しました。さらなるユースケースとしては、トランザクションシミュレーションや、L2（適切な並行性制御を伴う）のための並列実行も含まれます。Devcon SEAで発表した**CuEVM V1**（40-80k TPS、[講演へのリンク](https://app.devcon.org/schedule/PQBKHF)）以降、私たちはコードベース全体を再設計・再実装し、前例のないスループット（800万+ TPS）を実現しました。

すべてのソースコードとDockerコンテナは、誰もが試して構築できるように公開されています。今後数週間のフォローアップ投稿で、より詳細な設計選択と研究論文のプレプリントを共有する予定です。貢献、議論、質問を歓迎します。

### **ハイライト**

-   :high_voltage: RTX 5000 Ada上でERC20転送（ステート競合なし）で**800万+ TPS**
-   :test_tube: medusa-cuevmによるエンドツーエンドのスマートコントラクトファジングで**100万+ ファジングTPS**
-   :magnifying_glass_tilted_left: ファジング統合: CryticのMedusa v1.2.1上に構築された**medusa-cuevm**
-   :white_check_mark: go-ethereumと**96%以上のトレースが一致**（eth-tests Shanghaiにて）
-   :spouting_whale: 容易に再現可能なDockerコンテナ

**Githubリンク**

-   CuEVM [sbip-sg/CuEVM](https://github.com/sbip-sg/CuEVM)
-   ファザー統合とベンチマークを含むDockerコンテナ [minhhn2910/CuEVM-container](https://github.com/minhhn2910/CuEVM-container)

### **エコシステム統合**

-   **medusa-cuevm** - CryticのMedusa上に構築
-   **go-evmlab** - holiman/goevmlabからのフォーク

### **構成とリソース消費**

-   32,768–65,536 CUDAスレッド ↔ 約20GB GPUメモリ
-   トランザクションのバッチ間でCUDAスレッド用のトランザクションデータを準備し、実行結果を処理するための2–8 CPUスレッド。これらのパラメータの設定方法によって、ボトルネックはCPU側とGPU側の間で変化します。

### **高スループットのための主な最適化**

-   **コアレスアクセスを備えた事前割り当てバッファ**（重要なCUDA最適化）
-   異なるEVMインスタンス間での**データ構造のインターリービング**（SoA、構造体配列設計）
-   **スレッドスケジューリング**（ワープサイズトランザクションの類似性）
-   GPUリソースの**低レベル最適化**（例: レジスタ使用量）
-   **楽観的リバートメカニズム**（コピーオンライト、すべての書き込みのログを保持。安価なコミットは直接ステートに書き込み、高価なリバート）
-   **CPU↔GPU間のトランザクションデータ転送の最小化**（トランザクション間の永続的なワールドステート、ステートリセットのためのキャッシュされた初期ステート）

### **結果の再現**

上記のDockerコンテナリンクから、完全に再現可能な環境が利用可能です。

### **インターフェース**

-   **CuEVMバイナリ** — go-ethereumの`./cmd/evm`と同等の機能。JSONファイルを入力として受け取ります。
-   **CuEVMライブラリ (libcuevm_go.so)** — それ自体がファザーであり、ホストプログラムと連携してスマートコントラクトをファジングし、バグをトリガーするプログラムカウンタを返します。サポートされるオラクル: Medusaからのアサーション、整数バグ、Etherのリーク、再入可能性。

### **設計**

[![CuEVM全体設計](https://ethresear.ch/uploads/default/optimized/3X/4/1/410c430879af2958bb1d2f47b4eb0d827d815574_2_690x250.png)](https://ethresear.ch/uploads/default/original/3X/4/1/410c430879af2958bb1d2f47b4eb0d827d815574.png "CuEVM全体設計")

**実行モデル:** 初期ステート + M個のトランザクションからなるN個のシーケンス → GPUカーネルがN個のCUDAスレッド = N個のトランザクション（N個のシーケンスすべての最初のトランザクション）を実行 → ステートはGPUメモリに永続化 → N個のシーケンスすべての2番目のトランザクションを実行 → … → N個のシーケンスすべてのM番目のトランザクションを実行 → 結果をコピー → ステートをリセット。

**通信:**

-   生のトランザクションデータは、GoライブラリとバイナリEVMモード間の互換性を保つため、eth-tests JSONフォーマットを模倣したオブジェクトとして渡されます。
-   単一のワールドステートがすべてのN個のEVMインスタンスにクローンされ、各インスタンスは1つのトランザクションを実行します。
-   **実行結果:** ファジング固有の結果（バグの場所、バグをトリガーしたりコードカバレッジを向上させたりする興味深い入力）、および[[EIP|EIP（Ethereum 改善提案）]]-3155トレース（現在は1つのスレッドのトレースの出力に限定）。CuEVMをインスツルメントして、他のカスタム結果を出力することもできます。

### **異なるアプローチの可能性**

私は実験的にPythonライブラリとPythonでファザーをゼロから開発しましたが、CPU側での並列データ準備の難しさ（CPU側が最大のボトルネックとなる）のため、その方向性を断念しました。Python 3.13+でGIL無効化による真のマルチスレッディングが導入されるため、Pythonライブラリは将来の作業において実現可能な方向性となる可能性があります。

* * *

新しいユースケースや機会について、議論し、フォローアップし、協力できることを嬉しく思います。お気軽に@nminh\_hoまでDMをお送りください。

このプロジェクトは、シンガポール国立大学のシンガポールブロックチェーンイノベーションプログラムの下で開発され、イーサリアム財団から資金提供を受けました。CuEVMをエコシステムに統合する上でのFredrik Svantes氏のサポートとメンターシップに感謝いたします。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/cuevm-achieving-millions-of-tps-on-gpus-for-fuzzing-and-beyond/24873)
