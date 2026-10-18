---
title: ポスト量子ステートレスステガノグラフィーとMTU境界：P2P検閲耐性を量子ネットワークへ橋渡しする
original_title: >-
  Post-Quantum Stateless Steganography & MTU Bounds: Bridging P2P Censorship
  Resistance to Quantum Networks
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/post-quantum-stateless-steganography-mtu-bounds-bridging-p2p-censorship-resistance-to-quantum-networks/29995
author: Andrey_Chmora
date: '2026-10-17'
category: Uncategorized
tags:
  - post-quantum
  - cryptography
  - privacy
  - networking
  - censorship-resistance
  - p2p
  - protocol-design
  - security
  - research
  - steganography
topic_id: '29995'
translated_at: '2026-10-18'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Post-Quantum Stateless Steganography & MTU Bounds: Bridging P2P Censorship Resistance to Quantum Networks](https://ethereum-magicians.org/t/post-quantum-stateless-steganography-mtu-bounds-bridging-p2p-censorship-resistance-to-quantum-networks/29995) — Andrey_Chmora (2026-10-17)

皆さん、こんにちは！[[glossary/Censorship-Resistance|検閲耐性]]のあるピアツーピア（P2P）オーバーレイアーキテクチャを探求する継続的な研究シリーズ（*The Invariant Boundary Theorem*と*The ECDH Protocol Discipline Trap*に続く）の一環として、次の重要なレイヤーである**[[glossary/Post-Quantum|ポスト量子 (PQ)]]ステートレスステガノグラフィー**を形式化しました。

プレプリントはZenodoで公式に公開されています。:backhand_index_pointing_right: **[DOI: 10.5281/zenodo.23437773](https://doi.org/10.5281/zenodo.23437773 "null")**

### **問題：なぜナイーブなポスト量子移行がP2Pトンネルで失敗するのか**

分散型バリデータ通信やプライベートなRPCリレーを保護するような[[glossary/Censorship-Resistance|検閲耐性]]オーバーレイを、古典的な楕円曲線（[[glossary/ECDH|楕円曲線ディフィー・ヘルマン鍵共有 (ECDH)]] / X25519）から[[glossary/Post-Quantum|ポスト量子 (PQ)]]プリミティブ（NIST [[glossary/ML-KEM|ML-KEM (モジュール格子ベース鍵カプセル化メカニズム)]]や[[glossary/ML-DSA|ML-DSA (格子ベース署名アルゴリズム)]]など）へ移行すると、既存のステガノグラフィー（steganographic）トンネル設計は、以下の2つの数学的およびシステムレベルの落とし穴によって破綻します。

1.  **モジュロバイアス不変条件 (**$q \neq 2^k$**):** 標準的な格子[[glossary/key-encapsulation-mechanism|鍵カプセル化メカニズム (KEM)]]は素数モジュロ（例: ML-KEMでは $q = 3329$）上で動作します。ナイーブなビットパッキング（bit-packing）では上位のサブインターバルが未利用のままとなり、一様ノイズからの統計的距離（$\Delta(\mathcal{P}, \mathrm{U}) \to 1$）が大きくなります。情報理論的限界の下では、これは自動的にゼロコストの$\mathcal{O}(1)$パッシブなディープパケットインスペクション（DPI）ラインレート識別器へと変換されます。
    
2.  **MTUフラグメンテーションの罠:** 複合的な[[glossary/Post-Quantum|ポスト量子 (PQ)]] 0-RTTエンベロープ（[[glossary/key-encapsulation-mechanism|鍵カプセル化メカニズム (KEM)]]暗号文 + 署名 + AEAD）は$4.4$~KBを超え、複数パケットへのフラグメンテーション（断片化）を強制します。eBPF/XDPのようなカーネルバイパスフィルターはドライバーレベルで個々のフレームを検査するため、断片化された0-RTTペイロードは、AEAD検証*前*に応答側にステートフルなIP/UDP再構成バッファの割り当てを強制します。これにより、メモリ枯渇DoS（サービス拒否）攻撃ベクトルやマルチパケット次元フィンガープリントが再開されます。

### **提案されるアーキテクチャソリューション**

ステートフルなフィンガープリントを漏洩させることなく、厳密な$\mathcal{O}(1)$カーネルバイパス**サイレントドロップ (**$\bot$**)**および**サイレントセッショントランジション**の保証を維持するため、本論文では以下を確立しています。

-   **代数的均一化（Algebraic Uniformization）:** ネイティブな2のべき乗Learning With Rounding (LWR) 格子（例: Saber/FrodoKEM）または定数時間の*逆棄却サンプリング（Inverse Rejection Sampling）*を活用し、素数モジュロの暗号文を区別不可能な一様ビット列（$\Delta(\mathcal{P}, \mathrm{U}) \le 2^{-\lambda}$）にマッピングします。
-   **サブMTU 0-RTTエンベロープアーキテクチャ:** 以下の方法により、コンパクトな[[glossary/Post-Quantum|ポスト量子 (PQ)]]エンベロープ（IPv6で$\le 1232$~バイト / IPv4で$\le 1472$~バイト）を設計します。
    -   *[[glossary/harvest-now-decrypt-later-attacks|今すぐ収集し、後で解読する攻撃]]耐性ハイブリッドエンベロープ*（[[glossary/Post-Quantum|ポスト量子 (PQ)]] [[glossary/key-encapsulation-mechanism|鍵カプセル化メカニズム (KEM)]] + リアルタイム認証のための難読化された古典的署名）。
    -   *純粋な[[glossary/Post-Quantum|ポスト量子 (PQ)]]サブMTUエンベロープ*（Falcon-512のような均一化されたNTRU署名、または単方向認証[[glossary/key-encapsulation-mechanism|鍵カプセル化メカニズム (KEM)]] / Signcryptionの利用）。
-   **藤崎-岡本（Fujisaki–Okamoto）暗黙的拒否:** IND-CCA2 [[glossary/key-encapsulation-mechanism|鍵カプセル化メカニズム (KEM)]]の暗黙的拒否を利用し、ランダムなDPIプローブやクロスノードリプレイが定数時間で擬似乱数鍵にサイレントに評価され、AEAD検証が失敗して即座にサイレントドロップがトリガーされるようにします。

### イーサリアムとP2Pプロトコルへの関連性

イーサリアムバリデータネットワーク、libp2pベースの[[glossary/gossipsub|ゴシップサブ]]オーバーレイ、およびRPCトランスポート層が、[[glossary/harvest-now-decrypt-later-attacks|今すぐ収集し、後で解読する攻撃]]脅威に対する[[glossary/Post-Quantum|ポスト量子 (PQ)]]時代に備える中で、ネットワークドライバーレベルで低オーバーヘッドでフィンガープリント不可能なワイヤーエンベロープを維持することは不可欠です。

これらのサブMTU格子均一化技術を[[glossary/P2P-networking|P2Pネットワーキング]]トランスポートセキュリティに適用することに関する皆様のご意見、セキュリティレビュー、フィードバックを歓迎します！

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/post-quantum-stateless-steganography-mtu-bounds-bridging-p2p-censorship-resistance-to-quantum-networks/29995)
