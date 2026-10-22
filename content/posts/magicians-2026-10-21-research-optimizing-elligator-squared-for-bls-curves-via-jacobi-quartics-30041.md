---
title: '[研究] Jacobi Quarticsを用いたBLS曲線向けElligator Squaredの最適化'
original_title: '[Research] Optimizing Elligator Squared for BLS Curves via Jacobi Quartics'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/research-optimizing-elligator-squared-for-bls-curves-via-jacobi-quartics/30041
author: Andrey_Chmora
date: '2026-10-21'
category: Uncategorized
tags:
  - cryptography
  - signatures
  - research
  - consensus
  - validators
  - scaling
topic_id: '30041'
translated_at: '2026-10-22'
translator: gemini-2.5-flash
---

> [!note] 原文
> [[Research] Optimizing Elligator Squared for BLS Curves via Jacobi Quartics](https://ethereum-magicians.org/t/research-optimizing-elligator-squared-for-bls-curves-via-jacobi-quartics/30041) — Andrey_Chmora (2026-10-21)

皆さん、こんにちは、

BLS署名における公開鍵の難読化の計算オーバーヘッドを大幅に削減するための最近の研究について共有したいと思います。

[[glossary/BLS12-Curves|BLS12曲線]]の公開鍵の生データをそのまま保存することは署名集約には優れていますが、[[glossary/Ethereum-validator|イーサリアムバリデータ]]をリンク可能性 (linkability) やサブグループメンバーシップの漏洩に晒します。これらの鍵を[[glossary/Elligator-Squared|エリゲーター・スクエアード]]フレームワークを介して一様ランダムなビット列に難読化することは暗号学的に健全ですが、コストのかかる[[glossary/Inverse-Isogeny-Bridge|逆同種写像ブリッジ]]やフルスカラコファクターのブラインド/クリアリングにより、通常は重いレイテンシペナルティが発生します。

私たちは、このフィールドスケーリングペナルティを実質的に排除する最適化された難読化および難読化解除パイプラインを開発しました。計算上の2-同種写像ブリッジをネイティブにサポートするステガノグラフィ的に設計された曲線バリアント（**BLS12-479+**および**BLS12-539+**）を利用することで、**拡張ヤコビカルテット (Extended Jacobi Quartic)** 空間への厳密な双有理同値 (birational equivalence) を確立します。

### 主要なアーキテクチャ最適化:

-   **逆元演算不要の算術**: Billet-Joye双有理写像とHişilの同次射影座標P(1,1,1)を融合させることで、中間フィールドの逆元演算を完全に排除しました。このパイプラインは、単一のフィールド逆元演算を難読化解除サイクルの最終段階でのアフィン射影に延期します。
    
-   **Jacobi Quarticサンドボックス**: 重いスカラー乗算は、超高速の専用倍加公式 (3M+4S+1C+3add) を使用して、高速化されたヤコビ空間内で完全に実行されます。
    
-   **バッチ正規化テーブルによる非対称wNAFwNAF**: フルスカラブラインドには広幅ウィンドウ (w=5) を、受信側の高速コファクタークリアリング (∣1−z∣ スカラー) には最小ウィンドウ (w=2) を採用しています。事前計算テーブルはモンゴメリバッチ逆元演算 (Montgomery Batch Inversion) を使用して正規化 (Z=1) されており、メイン評価ループは専用加算公式 (9M+5S+1C+6add) のみを実行できます。
    

### 実証結果 (Magma V2.29-6での100,000回の決定論的イテレーション):

私たちのユーザーレベルのインタプリタ型プロトタイプは、フィールドスケーリングペナルティを完全に吸収し、標準のBLS12-381向けにプリコンパイルされたCライブラリのベースラインを上回る性能を示しました。

-   **BLS12-381 (ネイティブCコンパイルベースライン)**: **26.43Mサイクル** (難読化) | **2.66Mサイクル** (難読化解除)
    
-   **BLS12-479+ (インタプリタ型ヤコビ)**: **21.08Mサイクル** (難読化、**20.2%高速**) | **2.63Mサイクル** (難読化解除)
    
-   **BLS12-539+ (インタプリタ型ヤコビ)**: **25.75Mサイクル** (難読化、**2.5%高速**) | **3.06Mサイクル** (難読化解除)
    

インタプリタ型Magmaスクリプトが仮想マシンオーバーヘッドにもかかわらず、プリコンパイルされた381ビットのベースラインを下回る性能をすでに示していることを考えると、スレッドレベルおよび命令レベル並列性 (Thread-Level and Instruction-Level Parallelism) を活用したコンパイル済みC/Rust実装は、プロダクションコンセンサスクライアントにおいてさらに大幅な速度向上をもたらすと予測されます。

-   :page_facing_up: **[研究論文](https://doi.org/10.5281/zenodo.23536594)**
    
-   :laptop: **[PoCソースコード (Magma)](https://doi.org/10.5281/zenodo.23542441)**
    

フィードバック、質問、ご意見、特にバリデータノード向けの潜在的なRust/Cリファレンス実装に関するものは大歓迎です！

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/research-optimizing-elligator-squared-for-bls-curves-via-jacobi-quartics/30041)
