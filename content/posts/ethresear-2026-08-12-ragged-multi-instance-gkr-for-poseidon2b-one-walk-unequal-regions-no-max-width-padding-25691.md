---
title: Poseidon2b向けに不揃いな複数インスタンスGKR：単一ウォーク、不均等領域、最大幅パディングなし
original_title: >-
  Ragged multi-instance GKR for Poseidon2b: one walk, unequal regions, no
  max-width padding
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/ragged-multi-instance-gkr-for-poseidon2b-one-walk-unequal-regions-no-max-width-padding/25691
author: ignotusnemo
date: '2026-08-12'
category: Cryptography
tags:
  - cryptography
  - zk
  - proving
  - post-quantum
  - research
topic_id: '25691'
translated_at: '2026-08-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Ragged multi-instance GKR for Poseidon2b: one walk, unequal regions, no max-width padding](https://ethresear.ch/t/ragged-multi-instance-gkr-for-poseidon2b-one-walk-unequal-regions-no-max-width-padding/25691) — ignotusnemo (2026-08-12)

現在のイーサリアムの証明に関する取り組みのうち2つは、明示的にハッシュを多用しています。最近の[[glossary/Post-Quantum|ポスト量子 (PQ)]]バリデータ集約設計では、検証がハッシュ評価によって支配されると述べられており、別のWHIR実装では、代表的な構成においてPoseidon2 Merkleハッシュ化がGPU時間の58%を占めると報告されています。

![](https://ethresear.ch/user_avatar/ethresear.ch/tcoratger/48/20719_2.png)

[イーサリアムバリデータ向けポスト量子公開鍵レジストリの設計空間を探る](https://ethresear.ch/t/exploring-the-design-space-for-a-post-quantum-public-key-registry-for-ethereum-validators/25040) [[glossary/cryptography|暗号理論]]

> 著者: [Thomas Coratger](https://github.com/tcoratger), [Tom Wambsgans](https://github.com/TomWambsgans), [Ladislaus](https://x.com/ladislaus0x), [Thomas Thiery](https://x.com/soispoke), [Justin Drake](https://x.com/drakefjustin) 理論的な研究、アイデア、議論、eprintで公開されこの投稿にリンクされているすべての論文について、[Benedikt Wagner](https://benedikt-wagner.dev/)と[Dmitry Khovratovich](https://x.com/khovr)に感謝します。[[Strawmap roadmap](https://strawmap.org/)]で概説されているように、大規模な量子コンピューターの差し迫った脅威からイーサリアムを保護することは最優先事項です。この移行における重要なマイルストーンは、[[glossary/proof-of-stake|プルーフ・オブ・ステーク]]コンセンサスをBLS署名から…

![](https://ethresear.ch/user_avatar/ethresear.ch/miha-stopar/48/19828_2.png)

[Apple Silicon上でのGPUアクセラレーションWHIR証明](https://ethresear.ch/t/gpu-accelerated-whir-proving-on-apple-silicon/24762) [[glossary/privacy|プライバシー]]

> Apple Silicon上でのGPUアクセラレーションWHIR証明: クライアントサイドMetal Computeからのベンチマークと教訓 謝辞 セクション4のApple M3 MacBookおよびiPhoneのベンチマーク結果を提供してくれたMoven Tsai氏、WHIRに関する議論をしてくれたAlex Kuzmin氏に感謝します。TL;DR 我々はMetal computeシェーダーを使用してApple Silicon GPU上で[[WHIR](https://eprint.iacr.org/2024/1586)]プルーバーを高速化し、M1チップ上で高度に最適化されたCPUコード（SIMD + LTO + target-cpu=native）と比較して最大2.03倍、補足のApple M3 MacBook実行で最大2.58倍の高速化を達成しました…

再帰的なプルーバーを実装している際、同質なケースでは隠れていたバッチ処理の問題に遭遇しました。プルーバーは1つの固定されたPoseidon2bパーミュテーションの多くの実行を含んでいましたが、これらの実行は非常に異なるインスタンス数を持つ9つのコミットされた領域に分割されていました。

領域`a`が`2^w_a`個のパーミュテーションインスタンスを含む場合、そのブール幅は`w_a`です。私のケースでは、9つの幅は次のとおりでした。

```
[14, 15, 17, 16, 12, 15, 16, 12, 13]
```

2つの直接的なアプローチは、互いに逆の方向に作用します。

まず、各領域を独立して証明します。これによりネイティブな証人サイズは維持されますが、完全な66層GKRプロトコルを9回繰り返すことになります。

次に、領域を1つの最大幅ウォークに結合します。これにより1つのトランスクリプトが得られますが、すべての領域を`2^17`行にパディングする必要があります。物理的な証人は360,448から1,179,648のPoseidon行に増加します。

以下の構成は、両方のアプローチの有用な側面を維持します。ネイティブサイズの領域に対して1つの集約GKRウォークを実行し、欠落している高位座標を暗黙的なセレクターで表現します。その結果、最大幅パディングを具体化することなく1つのトランスクリプトが得られます。

## 不揃いな埋め込み (Ragged embedding)

`A`個の領域があると仮定します。領域`a`の層関係を`f_a`、そのブール幅を`w_a`、そしてこれらの幅の最大値を`W`とします。

W := \\max\_{1 \\leq a \\leq A} w\_a.

上記の9つの領域の場合、`W = 17`です。

私はそのネイティブな関係を`W`変数ハイパーキューブに次のように埋め込みます。

\\chi\_a(x) := \\prod\_{j=w\_a}^{W-1}(1+x\_j).

`w_a = W`の場合、これは空積であり、1に等しくなります。実装は標数2で行われるため、セレクターは`1 + x_j`
