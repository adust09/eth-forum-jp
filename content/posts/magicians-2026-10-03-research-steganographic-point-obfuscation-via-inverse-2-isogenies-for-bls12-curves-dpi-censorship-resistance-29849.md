---
title: BLS12曲線に対する逆2-アイソジェニーによるステガノグラフィック点難読化（DPI検閲耐性）
original_title: >-
  [Research] Steganographic Point Obfuscation via Inverse 2-Isogenies for BLS12
  Curves (DPI Censorship Resistance)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/research-steganographic-point-obfuscation-via-inverse-2-isogenies-for-bls12-curves-dpi-censorship-resistance/29849
author: Andrey_Chmora
date: '2026-10-03'
category: Uncategorized
tags:
  - cryptography
  - security
  - networking
  - consensus
  - performance
  - protocol-design
  - censorship-resistance
  - bls12-curves
topic_id: '29849'
translated_at: '2026-10-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [[Research] Steganographic Point Obfuscation via Inverse 2-Isogenies for BLS12 Curves (DPI Censorship Resistance)](https://ethereum-magicians.org/t/research-steganographic-point-obfuscation-via-inverse-2-isogenies-for-bls12-curves-dpi-censorship-resistance/29849) — Andrey_Chmora (2026-10-03)

### TL;DR

標準的なBLS12曲線上の公開鍵と署名は決定論的な構造を持つため、[[glossary/DPI|ディープパケットインスペクション (DPI)]]によるネットワーク層での[[glossary/Censorship-Resistance|検閲耐性]]に対して脆弱です。Point-to-Uniform難読化（Elligator Squaredなど）はこれを軽減しますが、BLS12-381に適用すると、重い11-アイソジェニーブリッジのため、受信側のバリデータにとって計算上のボトルネックが大きくなります。

偶数コファクターを持つ最適化された**BLS12-479+**曲線を利用することで、明示的な逆2-アイソジェニーブリッジを実装できます。これにより、受信側の復号化オーバーヘッドはわずか**約73,000 CPUサイクル（30 µs未満）に削減され、19.7倍の高速化**が実現し、大量のブロックブロードキャスト中の遅延がほぼゼロになります。

### 問題: [[glossary/EIP-2537|EIP-2537]]と11-アイソジェニーのボトルネック

[[glossary/Censorship-Resistance|検閲耐性]]には、暗号化された情報を一様なランダム文字列の中に隠す必要があります。One-to-Manyゴシッププロトコルでは、バリデータ（送信者）が署名を一度難読化しますが、数万のノード（受信者）がパケットを検証するためにそれを復号化しなければなりません。

[[glossary/EIP-2537|EIP-2537]]で標準化されているように、BLS12-381のFpからG1へのマッピングは11-アイソジェニーに依存しており、11次および15次多項式の評価が必要です。基本的な`hash_to_curve`操作には適していますが、このモノリシックなブリッジをElligator Squaredの復号化に使用すると、**約1,439,000サイクル**のコストがかかります。これは高スループットのgossipsub伝播には許容できないほど重いものです。

### 解決策: 構成的な2-アイソジェニー反転

モノリシックな多項式根探索に頼る代わりに、私はステガノグラフィーに最適化された曲線（BLS12-479+）をモデル化しました。その偶数コファクターは、数学的に自明な**2-アイソジェニーブリッジ**をネイティブにサポートします。

明示的なVélusの公式を使用すると、逆マッピングは厳密に有理極の和として評価されます。重い計算（難読化のための二次方程式の解法）は、厳密にブロックプロポーザー（送信者）にオフロードされます。ネットワーク受信者は軽量な順方向アイソジェニーのみを実行します。

### ハードウェアベンチマーク（Magma実装）

| メトリック | BLS12-381 (RFC 9381) | BLS12-479+ (提案) | パフォーマンス向上 |
| --- | --- | --- | --- |
| アイソジェニー次数 | 11-アイソジェニー | 2-アイソジェニー | - |
| セキュリティレベル | 約128ビット | 約160ビット | +32ビット |
| 難読化（送信者） | 約4,250,000サイクル | 約1,793,000サイクル | 約2.37倍高速化 |
| 復号化（受信者） | 約1,439,000サイクル | 約73,000サイクル | 約19.7倍高速化 |

*注: ローカルベンチマークは、P2Pネットワークノイズを含まない純粋な暗号化CPUサイクルを追跡しています。*

### リンクと証明

G1およびG2マッピングの両方について、完全な代数証明、カーネル抽出定理、およびMagmaスクリプトを公開しました。

-   **[GitHubリポジトリ（スクリプトとベンチマーク）](https://github.com/andreychmora-maker/bls12-steganography)**
    
-   **[研究論文（Zenodo）](https://doi.org/10.5281/zenodo.22736944)**
    

[[glossary/Censorship-Resistance|検閲耐性]]のあるコンセンサス層のために偶数コファクター曲線への移行の実現可能性について、コア暗号コミュニティからのフィードバックをいただければ幸いです。この曲線トポロジーに関して考慮すべき[[glossary/EVM-precompile|EVMプリコンパイル]]の隠れたエッジケースはありますか？

[[glossary/EIP-2537|EIP-2537]]の`hash_to_curve`ベースラインに対する理論的なフォローアップとして：

Koshelevらの、j=0曲線（BLS12-381など）への最適化されたindifferentiable hashingに関する結果を思い出す価値があります。彼らの研究は、順方向のHash-to-Curveマッピング（例: 標準的なWahby-Boneh 11-アイソジェニーアプローチと比較して指数計算を最小化）に対してエレガントな数学的最適化を提供しますが、逆マッピング（Elligator Squaredを介したPoint-to-Uniform）は、アイソジェニーの次数自体によって根本的に制約されたままです。

数学的に自明な2-アイソジェニーを持つBLS12-479+のような曲線に移行することで、これらの順方向マッピングの最適化を本質的に補完します。これにより、受信側のElligator Squared復号化がハードウェア効率的になり、高次アイソジェニーに内在するモノリシックな多項式評価を完全に回避できます。

また、Koshelevによって提案された最近のバッチハッシュ技術のいずれかを、この新しい曲線トポロジーにおけるプロポーザー側（送信者）の難読化オーバーヘッドをさらに最適化するために適応できるかどうかを探るのも興味深いでしょう。

**参考文献 / 理論的背景:**

1.  **D. Koshelev.** “Indifferentiable hashing to ordinary elliptic Fq -curves of j=0 with the cost of one exponentiation in Fq .” *Designs, Codes and Cryptography*, 90(3):621–641, 2022. <[https://doi.org/10.1007/s10623-022-01012-8>](https://doi.org/10.1007/s10623-022-01012-8)
    
2.  **D. Koshelev.** “The most efficient indifferentiable hashing to elliptic curves of j-invariant 1728.” *Journal of Mathematical Cryptology*, 16(1):119–131, 2022. <[https://doi.org/10.1515/jmc-2021-0051>](https://doi.org/10.1515/jmc-2021-0051)
    
3.  **J. Chávez-Saab, F. Rodríguez-Henríquez, and M. Tibouchi.** “SwiftEC: Shallue–van de Woestijne indifferentiable function to elliptic curves.” *Journal of Cryptology*, 37(4):Article 34, 2024. <[https://doi.org/10.1007/s00145-024-09529-y>](https://doi.org/10.1007/s00145-024-09529-y)
    
4.  **D. Koshelev.** “Simultaneously simple universal and indifferentiable hashing to elliptic curves.” In *Progress in Cryptology – AFRICACRYPT*, Lecture Notes in Computer Science. Springer, 2025/2026. <[https://doi.org/10.1007/978-3-031-97260-7\_18>](https://doi.org/10.1007/978-3-031-97260-7_18)
    

*5件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/research-steganographic-point-obfuscation-via-inverse-2-isogenies-for-bls12-curves-dpi-censorship-resistance/29849)
