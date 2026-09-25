---
title: 'Post-Poseidon: イーサリアム向けハッシュ関数バリアント'
original_title: 'Post-Poseidon: Hash Function Variants for Ethereum'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/post-poseidon-hash-function-variants-for-ethereum/26071'
author: khovratovich
date: '2026-09-23'
category: Cryptography
tags:
  - cryptography
  - zk
  - consensus
  - execution-layer
  - post-quantum
  - protocol-design
  - research
topic_id: '26071'
translated_at: '2026-09-25'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Post-Poseidon: Hash Function Variants for Ethereum](https://ethresear.ch/t/post-poseidon-hash-function-variants-for-ethereum/26071) — khovratovich (2026-09-23)

## はじめに

バイナリ回路（特にハッシュ）向けの[[Post-Quantum|ポスト量子 (PQ)]]証明システムとしてFlockが登場したことで、イーサリアムは、その計算が証明されるプロトコルに対して、特定の回路フレンドリーなハッシュを必要としなくなりました。それでも、どのハッシュ関数を選択するかという問題は、イーサリアムプロトコルの文脈においてそれぞれ長所と短所があるため、非自明です。

## 用途

### ユースケース

ここでは、ハッシュ関数の大規模な使用ケースに限定します。

-   [[Consensus-Layer|コンセンサス層 (CL)]]署名（[[eXtended-Merkle-Signature-Scheme|拡張マークル署名スキーム (XMSS)]]バリアント）。ここでは、署名と検証の両方に数百回のハッシュ呼び出しが必要です。セットアップには、(署名+検証) * (署名数) にほぼ比例するかなりの追加コストがかかります。
    
-   [[Post-Quantum|ポスト量子 (PQ)]]証明システム（現在は[[leanVM|leanVM]]のバリアント）によるCL署名の集約。PQ[[Hash-based-signatures|ハッシュベース署名]]の集約証明では、合計サイズが計算トレースのサイズ以上であるメッセージのMerkleツリーハッシュが必要であり、その検証にはこれらのツリーから数十のMerkleパスをチェックする必要があります。
    ![CL署名集約の図](https://notes.ethereum.org/_uploads/Bkx1_BYHYzl.png =50%x)
    
-   [[Execution-Layer|実行レイヤー (EL)]]でのステートツリー構築と、ブロック検証のためのツリー遷移証明の提供（ネイティブおよびzkVM内）。これには、現在の実装でKeccak（SHA-3のバリアント）を使用する巨大なMerkleツリー（またはそのバリアント）が必要です。
    ![ELステートツリー構築の図](https://notes.ethereum.org/_uploads/BJlVfLYHKMl.png =50%x)
    
-   EL署名。PQ署名オプションの1つは、[[SPHINCS|SPHINCS-（SPHINCSマイナス）]]のような[[Hash-based-signatures|ハッシュベース署名]]です。ステートレスであるため、CLのXMSSよりもはるかに多くのハッシュ関数呼び出しが必要ですが、ブロックあたりの署名数は少ないと予想されます。
    

![EL署名と集約の図](https://notes.ethereum.org/_uploads/B1liOUtrtzx.png =50%x)

-   EL集約: いくつかのzkVMを使用して、EL署名の検証を含むイーサリアムブロックの実行を証明します。後者は、[[leanVM|leanVM]]と同様の[[Hash-based-signatures|ハッシュベース署名]]証明システムを使用すると想定されています。このような証明システムは再帰を使用すると想定されており、同じハッシュ関数がコミットメントスキーム内で使用され、Merkleパスのコレクション内で証明されます。

### 入力長

すべての候補ハッシュ関数が反復的に動作することを早期に言及する価値があります。

[![SHA-256の反復ハッシュ関数（パディングスキーム）](https://ethresear.ch/uploads/default/optimized/3X/7/6/76f26f83c1c7f5655e6b6b83cc52587909797980_2_690x217.png)](https://ethresear.ch/uploads/default/original/3X/7/6/76f26f83c1c7f5655e6b6b83cc52587909797980.png "SHA-256の反復ハッシュ関数（パディングスキーム）")

*図3: 反復ハッシュ関数（SHA-256のパディングスキーム）。*

具体的には、まず入力をパディングして整数個のチャンクにし、次にチャンクごとに圧縮します。パフォーマンスの観点からは、ネイティブ計算と回路計算の両方で、バイト数ではなくチャンク数のみが重要です。パディングルールとチャンクサイズはハッシュごとに異なるため、各ハッシュ関数のパフォーマンスを推定するために、予想されるメッセージバイト長を特定することが重要です。メッセージ長は、外部プロトコルによって決定され、ハッシュ関数の出力が入力になる場合は、ハッシュ関数自体のダイジェスト長を含む場合があります。

[![SHA-256のメッセージ長に対する圧縮呼び出し数](https://ethresear.ch/uploads/default/optimized/3X/b/9/b965787dacc1be5fb746660c305eb242d865e981_2_690x333.png)](https://ethresear.ch/uploads/default/original/3X/b/9/b965787dacc1be5fb746660c305eb242d865e981.png "SHA-256のメッセージ長に対する圧縮呼び出し数")

*図4: SHA-256のメッセージ長に対する圧縮呼び出し数。*

各ケースのメッセージ長の内訳は次のとおりです。

-   XMSS CL署名におけるハッシュ関数呼び出しは、[[Winternitz-One-Time-Signatures|ウィンターニッツ・ワンタイム署名 (
