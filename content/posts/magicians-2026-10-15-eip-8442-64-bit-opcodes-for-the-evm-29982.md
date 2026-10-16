---
title: 'EIP-8442: EVM向け64ビットオペコード'
original_title: 'EIP-8442: 64-bit Opcodes for the EVM'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8442-64-bit-opcodes-for-the-evm/29982'
author: gcolvin
date: '2026-10-15'
category: EIPs core
tags:
  - eips-core
  - eip
  - evm
  - execution-layer
  - smart-contracts
  - scaling
  - research
topic_id: '29982'
translated_at: '2026-10-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8442: 64-bit Opcodes for the EVM](https://ethereum-magicians.org/t/eip-8442-64-bit-opcodes-for-the-evm/29982) — gcolvin (2026-10-15)

[EIP-8442: EVM向け64ビットオペコード](https://eips.ethereum.org/EIPS/eip-8442)

すべての計算に256ビットが必要なわけではありません。カウンター、オフセット、長さ、ハッシュや多倍長算術の内部ループは64ビットに収まりますが、[[EVM|EVM]]はそれらに対して常に256ビットのコストを支払わせています。この提案は、オペランドの下位64ビットで計算を行う28個の命令を追加します。これらは[[EIP|EIP]]-[[EIP-7937|7937]]のEVM64命令セットと同じ操作を同じコストで提供し、プレフィックスバイトの背後ではなく、通常の1バイトオペコードとしてエンコードされます。それぞれが既存の命令の*ツイン*であり、既存のオペコードに`0xC0`を加えたものとしてエンコードされます。

これらの命令は即値データを受け取らず、モードに入ることもありません。命令セットの他の部分と自由に混在し、すべての結果は通常の256ビットワードです。単独では、解釈された算術演算を控えめに安価にします。静的な制御フローと組み合わせると、その効果は複合的になります。両方でRISC-Vにコンパイルされたコードは、今日の解釈されたEVMよりも19〜51倍少ない命令で実行されます。これは、スタックスロットがマシンレジスタになるのは、そのオフセットが静的*かつ*その値がレジスタに収まる場合のみだからです。

#### 更新ログ

-   2026-10-14: [初回ドラフト](https://github.com/ethereum/EIPs/pull/12504)
-   2026-10-14: [参照実装](https://github.com/ethereum/execution-specs/pull/3829)

#### 外部レビュー

-   2026-10-15現在なし

#### 未解決の課題

-   2026-10-15現在なし

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8442-64-bit-opcodes-for-the-evm/29982)
