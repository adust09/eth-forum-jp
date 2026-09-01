---
title: Poseidon2bは安全である！
original_title: Poseidon2b is secure!
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/poseidon2b-is-secure/25865'
author: ignotusnemo
date: '2026-08-31'
category: Cryptography
tags:
  - cryptography
  - zk
  - security
  - research
  - protocol-design
  - formal-verification
  - snarks
  - hash-function
  - cryptanalysis
topic_id: '25865'
translated_at: '2026-09-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Poseidon2b is secure!](https://ethresear.ch/t/poseidon2b-is-secure/25865) — ignotusnemo (2026-08-31)

すでに「イーサリアム向けの[[glossary/Poseidon-hash|Poseidonハッシュ]]は安全ではない！」と主張するトピックがここにあります。

私はその反対を主張します。

もちろん、どちらの見出しも不完全です。ハッシュファミリーは、体 (field)、幅 (width)、容量 (capacity)、ラウンドスケジュール (round schedule)、行列 (matrices)、操作モード (operation mode)、および攻撃モデル (attack model) を固定せずに安全とも安全でないとも言えません。

そこで、これらすべてを固定しましょう。

私は本番環境で以下の[[glossary/Poseidon2b|Poseidon2b]]インスタンスを使用しています。

```
Field:        GF(2^128)
State width:  t = 4
Rate:         r = 2
Capacity:     c = 2
Digest:       2 field elements
S-box:        x^7
Rounds:       RF = 8, RP = 58
```

最近の[Skipping Class論文](https://eprint.iacr.org/2026/306)は、Poseidon2および[[glossary/Poseidon2b|Poseidon2b]]に対する改良された代数的攻撃を提示しています。

重要なのは、その主要な広幅状態ラウンドスキップ法が、幅 `t = 12, 16, 20, 24` に適用される点です。

これはこの `t = 4` インスタンスには適用されません。ここではバイナリ `M4` 行列が完全な外部[[glossary/MDS-layer|MDS層]]であり、広幅テンソル構築内の繰り返しブロックではありません。

よく繰り返される `2^106` の改善も、この構成に対する攻撃ではありません。これは `RP = 15` のバイナリ `(n,t,c,d) = (32,24,8,8)` [[glossary/sponge|スポンジ]]に属します。

論文の付録Aは、Parano1dで使用されている2対1のフィードフォワード圧縮に適用されます。正確な本番パラメータの場合、その特殊化は以下を与えます。

```
d_I <= 7^73
```

そして、論文の二次作業予測は以下を与えます。

```
log2(d_I^2) = 409.873818620410...
```

これは409ビットのセキュリティを主張するものではありません。これはこの特定の代数的攻撃の予測です。意図された128ビットのセキュリティレベルを下回る攻撃は生成されません。

私は完全な対応付けを実行可能にしました。監査は、体 (field)、幅 (width)、レート (rate)、ダイジェストサイズ (digest size)、ラウンド (rounds)、行列 (matrices)、および圧縮モード (compression mode) を固定された本番ソースに対してチェックします。これらを変更すると監査は失敗します。

計算とソースは公開されています。

-   [[glossary/Poseidon2b|Poseidon2b]]の実行可能な監査 ([Executable Poseidon2b audit](https://github.com/ignotusnemo/parano1d-soundness/blob/c3ea3342fbe27111c84046613010f14f13b917c6/src/poseidon2b_cryptanalysis.rs))
-   導出と正確なスコープ ([Derivation and exact scope](https://github.com/ignotusnemo/parano1d-soundness/blob/c3ea3342fbe27111c84046613010f14f13b917c6/docs/category-one.md#current-poseidon2b-cryptanalysis))
-   固定された本番実装 ([Pinned production implementation](https://github.com/ignotusnemo/parano1d/tree/fedbe6e3c0ddf8b8372546017bb9bc341acb8ab0/noid_poseidon2b))

私は、より優れた攻撃が今後一切見つからないと主張しているわけではありません。私が主張しているのは、検証可能なことです。

**現在公開されている代数的攻撃は、この正確な[[glossary/Poseidon2b|Poseidon2b]]インスタンスを破るものではありません。**

もし異論があるなら、「Poseidon」に関する一般的な議論を私に持ち出さないでください。

この正確なインスタンスを攻撃してください。

私はここに公開されたソース固定の研究タスクを開設しました。

![noid.networkのPoseidon2b攻撃研究タスク](https://ethresear.ch/uploads/default/original/3X/4/c/4c30698735d54030010c6433cf478795c1e8ceed.svg) [noid.network](https://noid.network/research/poseidon2b-attack)

### [本番環境のPoseidon2b攻撃 | noid.network](https://noid.network/research/poseidon2b-attack)

正確な幅4の本番[[glossary/Poseidon2b|Poseidon2b]]インスタンスとそのフレーミングに対して、具体的な[[glossary/cryptanalysis|暗号解読]]、固定コンパイラ[[glossary/QROM-bound|QROMバウンド]]、または反例を提出してください。

より安価な攻撃、有効な本番[[glossary/collision|衝突]]または[[glossary/preimage|原像]]、あるいは論文と実装の間の対応関係におけるエラーを見つけてください。再現可能な証拠は公開され、帰属が明記され、公開セキュリティフロンティアに反映されます。

5件の投稿 - 2名の参加者

[トピック全体を読む](https://ethresear.ch/t/poseidon2b-is-secure/25865)
