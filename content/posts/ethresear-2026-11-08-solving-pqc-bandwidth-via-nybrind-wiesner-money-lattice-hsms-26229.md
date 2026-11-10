---
title: Nybrind Wiesner Moneyと格子HSMによる耐量子暗号の帯域幅問題の解決
original_title: Solving PQC Bandwidth via Nybrind Wiesner Money & Lattice HSMs
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/solving-pqc-bandwidth-via-nybrind-wiesner-money-lattice-hsms/26229
author: AfeRisT_D
date: '2026-11-08'
category: Cryptography
tags:
  - cryptography
  - post-quantum
  - security
  - networking
  - validators
  - protocol-design
topic_id: '26229'
translated_at: '2026-11-10'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Solving PQC Bandwidth via Nybrind Wiesner Money & Lattice HSMs](https://ethresear.ch/t/solving-pqc-bandwidth-via-nybrind-wiesner-money-lattice-hsms/26229) — AfeRisT_D (2026-11-08)

皆さん、こんにちは。

ネットワーク帯域幅と[[Ethereum-validator|イーサリアムバリデータ]]ノードのセキュリティに関する[[Post-Quantum|耐量子暗号 (PQC)]]移行の行き詰まりを解決することを目的とした、概念的なハードウェアフレームワークを提案したいと思います。量子状態によって共同署名された、ハードウェアセキュリティモジュール (HSM) の境界内に局所化された格子構造を統合するハイブリッドアプローチを設計しました。

皆様からのフィードバックや技術的なご意見をお待ちしております！

プロジェクト: LATTICE-NOTATION (LN)

分散型ネットワークにおける[[Post-Quantum|耐量子]]検証のためのハイブリッドハードウェアセキュリティモジュール (HSM)

1.  コアボトルネック (問題)

現代のブロックチェーンネットワーク（イーサリアムなど）がNIST標準の[[Post-Quantum|耐量子暗号 (PQC)]]へ移行するにあたり、重大なインフラの障壁に直面しています。

帯域幅の崩壊: 次世代の格子ベースアルゴリズム（例: [[ML-KEM|ML-KEM]]/Kyber）は、従来のRSA/ECCの同等物よりも指数関数的に大きな公開鍵とデジタル署名を利用します。完全な暗号負荷の下では、標準の[[P2P-networking|P2Pネットワーキング]] ([[P2P-networking|P2P]]) [[Ethereum-validator|バリデータ]]ネットワークは、深刻な遅延とスループットの低下を経験するでしょう。

SNDL脅威（「今すぐ保存し、後で復号する」）: 敵対者は現在、暗号化されたネットワークトラフィックを積極的に収集しており、暗号解析的に関連する量子コンピュータ (CRQC) が出現し次第、[[Ethereum-validator|バリデータ]]インフラを遡及的に侵害することを意図しています。

2.  ソリューション (LNコンセプト)

プロジェクトLattice-Notationは、[[Post-Quantum|耐量子]]防御を隔離された物理層へ移動させることで、ネットワーク層のボトルネックを完全に回避します。重い鍵をオープンなインターネット経由で常に送信する代わりに、ノード検証は特殊なハードウェアセキュリティモジュール (HSM) 内にカプセル化されます。このモジュールは物理的な量子状態トークンとして機能し、複製不可能な物理的境界を利用して、ネットワークオーバーヘッドゼロの検証を可能にします。

3.  仕組み (物理学 + 数学の統合)

LNアーキテクチャは、単一のハードウェア境界内に2つの独立した暗号ドメインを統合します。

量子シールド（物理的アンチクローニング）: [[Ethereum-validator|バリデータ]]のコア暗号IDは、フラッシュメモリに静的な古典的ビットとして保存されません。代わりに、それはコヒーレントな量子重ね合わせ状態に吊り下げられたアクティブなオンチップ量子ビットアレイ内で初期化されます。ノー・クローニング定理により、チップを傍受、スキャン、または物理的にプローブする不正な試みは、フラッシュメモリに静的な古典的ビットとして保存されません。代わりに、それはコヒーレントな量子重ね合わせ状態に吊り下げられたアクティブなオンチップ量子ビットアレイ内で初期化されます。物理的な複製は、物理法則の下では根本的に不可能です。

数学的シールド（ローカル格子処理）: 高次元の幾何学的格子計算は厳密にオンチップで行われます。デバイスは巨大な生のマトリックスを[[P2P-networking|P2Pネットワーク]]経由でブロードキャストしません。代わりに、マトリックスをローカルで処理し、高度に圧縮されたスカラー暗号証明（ペイロード）のみを閉鎖された検証境界内に送信します。ネットワークオーバーヘッドはほぼゼロに低下し、トランザクション実行速度は最大効率を維持します。

4.  イーサリアムエコシステムへの応用

改ざん防止[[stake|ステーキング]]インフラストラクチャ: [[Ethereum-validator|イーサリアムバリデータ]]向けに設計された物理HSMモジュール。[[Ethereum-validator|バリデータ]]の秘密鍵を量子重ね合わせの状態に固定することで、インフラストラクチャは完全な物理的耐性を達成します。物理的なデータセンター侵害、ハードウェア押収、またはサイドチャネル分析 (SCA) が発生した場合でも、不正な検査が行われると、強制的なデコヒーレンスにより秘密鍵は即座にゼロ化されます。

[[Post-Quantum|耐量子]]安全なクロスチェーンブリッジ: スマートコントラクトブリッジの脆弱性を、物理的に隔離された[[Post-Quantum|耐量子]]格子セキュア認証トークンに状態検証をオフロードすることで軽減します。

*2投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/solving-pqc-bandwidth-via-nybrind-wiesner-money-lattice-hsms/26229)
