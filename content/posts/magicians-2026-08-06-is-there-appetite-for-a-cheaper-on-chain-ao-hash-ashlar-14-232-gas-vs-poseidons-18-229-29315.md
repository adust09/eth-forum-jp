---
title: 'より安価なオンチェーンAOハッシュに需要はありますか？ (Ashlar 14,232 gas vs Poseidon 18,229)'
original_title: >-
  Is there appetite for a cheaper on-chain AO hash? (Ashlar, 14,232 gas vs
  Poseidon's 18,229)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/is-there-appetite-for-a-cheaper-on-chain-ao-hash-ashlar-14-232-gas-vs-poseidons-18-229/29315
author: aryaethn
date: '2026-08-06'
category: Primordial Soup
tags:
  - primordial-soup
  - cryptography
  - zk
  - scaling
  - gas
  - protocol-design
  - research
topic_id: '29315'
translated_at: '2026-08-07'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Is there appetite for a cheaper on-chain AO hash? (Ashlar, 14,232 gas vs Poseidon's 18,229)](https://ethereum-magicians.org/t/is-there-appetite-for-a-cheaper-on-chain-ao-hash-ashlar-14-232-gas-vs-poseidons-18-229/29315) — aryaethn (2026-08-06)

## まず、質問です

算術化指向ハッシュ (arithmetization-oriented hash) を用いたMerkle証明のオンチェーン検証は、ロールアップの引き出し証明、ストレージ証明、SolidityでZKフレンドリーなツリーを検証するあらゆるものにおいて、実際のコストセンターとなっています。Poseidonは事実上の標準であり、メンテナンスされている`poseidon-solidity`実装において、飽和したオプティマイザ設定で2対1ハッシュあたり約18,229ガスを消費します。

私は同じ操作で**14,232ガス**を計測した設計を持っており、これは1.28倍の改善です。この改善幅が、ここで標準化可能なものとして追求する価値があるほど興味深いものなのか、それとも「ガスはボトルネックではないので、気にするな」という答えなのかを知りたいです。

**これは、その方向性が重要かどうかについてのフィードバックを求めるものであり、[[glossary/EIP|EIP（Ethereum 改善提案）]]でも、何かを採用する提案でもありません。** この設計は新しく、外部からの暗号解析は行われていません。デプロイしないでください。

## 概要

**Ashlar**は、べき乗写像ではなく、体の二乗演算 (field squarings) のファイステル構造 (Feistel chain) を次数エンジンとする算術化指向ハッシュです。動機となる観察は会計上のものです。ランク1制約 (rank-1 constraint) は合計次数が最大2であるため、それらによって提示されるゼロ次元のCICOイデアル (CICO ideal) は、商次元 (quotient dimension) が最大`2^C`になります。二乗演算はその上限に達します。制約あたり1ビットのイデアル次数に対し、`x^5`では0.774、`x^7`では0.702です。

回路の観点からの結果：BN254上の幅3の2対1ハッシュで、計測されたR1CS制約は191です。これはPoseidonの243、Poseidon2の240という導出された数と比較して優れています。オンチェーンでの結果は上記のガス数値です。

-   アーティファクト、Solidityコントラクト、および論文：[GitHub - aryaethn/ashlar: Ashlar: an arithmetization-oriented hash from an R1CS-optimal squaring degree engine — paper, artifact manifest, and validation campaign · GitHub](https://github.com/aryaethn/ashlar)
-   暗号解析の議論：[ethresear.ch thread](https://ethresear.ch/t/ashlar-an-ao-hash-from-a-squaring-degree-engine-and-a-request-for-cryptanalysis/25634)

## ガス計測の詳細

すべてのコントラクトは、ガス数値を計測する前に、凍結されたテストベクトルに対してオンチェーンでゲートされました。Foundry 1.7.1、solc 0.8.24、Cancunを使用。

| optimizer_runs | Ashlar | Poseidon t=3 | Poseidon2 t=4 | Keccak-256 |
| --- | --- | --- | --- | --- |
| 200 | 18,552 | 30,485 | 26,813 | 418 |
| 1,000 | 18,040 | 30,485 | 26,813 | 418 |
| 5,000 | 14,232 | 30,485 | 26,807 | 418 |
| 10,000 | 14,232 | 18,229 | 19,639 | 418 |
| 200,000 | 14,232 | 18,229 | 19,639 | 418 |

以下の3点については、それぞれ読み取り方が変わる可能性があるため、正直に申し上げます。

1.  **ランキングはオプティマイザ設定に依存します。** `runs=200`では1.64倍の差に見えますが、飽和状態では1.28倍です。飽和状態はハッシュライブラリにとってデプロイメントにおいて現実的な設定であるため、1.28倍が私が主張する数値です。しかし、もしどこかで1.64倍という数値を見かけた場合、それは低オプティマイザ設定のアーティファクトであり、私はそれを擁護するつもりはありません。
2.  **Keccakは34倍安価**であり、常にそうでしょう。これは、証明の*内部*でも安価なハッシュが必要な場合にのみ重要です。
3.  **Poseidon2の行は幅4です**。これは、私が計測した時点で、メンテナンスされている幅3のSolidity Poseidon2実装が存在しなかったためです。これは公平な比較ではない行であり、私はこれに依拠しません。

Ashlarコントラクトの算術的な下限は、326 `mulmod` + 395 `addmod` + 2 `mod` = 5,778ガスであり、計測された14,232ガスはスタック、メモリ、ディスパッチにおいて2.46倍のオーバーヘッドを伴います。**私よりもYulに詳しい人なら、おそらくそのギャップの大部分を埋めることができるでしょう**。これは私が助けを求めている具体的なことの一つです。

## 劣っている点

これは私からお伝えしておきたいことです。

-   **ネイティブGoldilocksは、幅12のPoseidon2よりも4.09倍遅いです。** ワークロードが制約やガスではなく、STARKプルーバーにおけるネイティブハッシュに支配されている場合、これは間違った設計です。
-   **ネイティブBN254は、Poseidon2よりも約11%遅いです。**
-   **Plonkishはトレードオフであり、勝利ではありません。** あるゲート選択はPoseidonよりも1.26倍多くの行を必要とし、別のゲートは58行でPoseidonを上回りますが、次数9の予算全体を消費するため、回路内の他のゲートが9を超えると、すべての拡張ドメインの膨張 (extended-domain blowup) が2倍になります。
-   **AIRコストは計測されておらず**、そこでは何も評価していません。

## 実際に必要となること

もし誰かがこれを追求する価値があると思うなら、正直な前提条件は以下の順序です。

1.  **外部からの暗号解析。** ここにあるものは何も独立してレビューされていません。論文は*コアエンジン*のアクティブSボックス数と構造次数を証明しており、CICOの解決コストやデプロイされたモードの代数セキュリティの下限を明示的に主張するものでは**ありません**。完全なパーミュテーションの多出力イデアル次数は未解決です。外部解析のないハッシュは標準に採用されるべきではありません。
2.  **2番目の独立した実装。** 理想的には、関与していない誰かが、付録の規範的な擬似コード (normative pseudocode) のみから構築することです。付録はそのように書かれており、参照をインポートせずに凍結されたベクトルを再現することを確認する適合性チェック (conformance check) があります。
3.  **プルーバー制約ではなく、ガス制約を受けている実際のユースケース。** この設計は意図的にネイティブ速度を制約とガスと引き換えにしているためです。

これら3つすべてが満たされて初めて、[[glossary/EIP|EIP]]または[[glossary/ERC|ERC]]形式のレジストリエントリが意味をなしますが、私はそれを提案しているわけではありません。

## 私が尋ねていること

-   オンチェーンの算術化指向ハッシュが1.28倍改善されることは、誰かの注目に値するでしょうか、それともMerkle検証のガスコストはもはや問題の核心ではないのでしょうか？
-   制約数（191対243）がネイティブ速度の低下よりも重要となるデプロイメントはありますか？
-   Yulコントラクトの2.46倍のオーバーヘッドを打ち破ろうとする人はいますか？コントラクトとそのガスハーネスはリポジトリにあります。
-   これはPrimordial Soupの適切なカテゴリでしょうか、それとも外部解析が行われるまでethresear.chにのみ掲載されるべきでしょうか？

「面白くない、理由はこれだ」という意見も大歓迎です。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/is-there-appetite-for-a-cheaper-on-chain-ao-hash-ashlar-14-232-gas-vs-poseidons-18-229/29315)
