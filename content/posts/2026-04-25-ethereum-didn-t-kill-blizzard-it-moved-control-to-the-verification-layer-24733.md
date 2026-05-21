---
title: イーサリアムはブリザードを殺さなかった — コントロールを検証レイヤーに移しただけだ
original_title: Ethereum Didn’t Kill Blizzard—It Moved Control to the Verification Layer
source_url: >-
  https://ethresear.ch/t/ethereum-didn-t-kill-blizzard-it-moved-control-to-the-verification-layer/24733
author: DamonZwicker
date: '2026-04-25'
category: Meta-innovation
tags:
  - meta-innovation
  - ethereum
  - verification
  - decentralization
topic_id: '24733'
translated_at: '2026-05-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Ethereum Didn’t Kill Blizzard—It Moved Control to the Verification Layer](https://ethresear.ch/t/ethereum-didn-t-kill-blizzard-it-moved-control-to-the-verification-layer/24733) — DamonZwicker (2026-04-25)

# Vitalik Buterinはなぜイーサリアムを構築したのか？

Blizzard Entertainmentが『World of Warcraft』のルールを変更したとき、それは根本的な真実を露呈させた。

> あるシステムがルールを制御するなら、それは現実を制御する。

イーサリアムはこれを実行レイヤー (execution layer) で修正した。

-   実行は決定論的 (deterministic) である
-   状態遷移 (state transitions) は検証可能 (verifiable) である
-   コンセンサス (consensus) は分散型である

その問題は解決された。

* * *

## 解決されなかった問題

イーサリアムは以下を保証する。

> 実行はルールに従う

しかし、以下は保証しない。

> 独立した当事者が、**標準的でシステムに依存しない方法**を用いて、何が起こったかについての主張を検証できること

* * *

## 検証スタック

今日の検証 (verification) はプリミティブ (primitive) ではない。

それは**生のチェーンデータの上に重ねられた解釈のスタック**から生まれる。

-   RPC
-   インデクサー (indexer)
-   デコードロジック (decoding logic)
-   プルーフフォーマット (proof formats)
-   トランザクション参照 (transaction references)
-   検証実装 (verification implementations)

これらは壊れているわけではない。

しかし、これらは以下の通りである。

> **非標準化されており、環境に依存する**

* * *

## 結果

> **検証はポータブル (portable) ではない** — 共有された前提なしには、同じ主張をシステム間で独立して再現することはできない。

確かに、自分のノード (node) を実行することはできる。

しかし、それは以下の問題を解決しない。

> 異なるシステムが何を検証するか、そしてどのように検証するかについて合意する方法

* * *

## 簡単な例

3つのシステムが同じ主張を検証しようとする。

-   1つはcalldataからハッシュ (hash) を抽出する
-   1つはログ (logs) から抽出する
-   1つはインデクサーに依存する

それらは以下に基づいて異なる結果を返す可能性がある。

-   エンコーディング (encoding) の前提
-   抽出ルール (extraction rules)
-   パースロジック (parsing logic)

チェーンは意見を異にしなかった。

> **検証プロセスが意見を異にしたのだ。**

* * *

## これが意味すること

以下の問いに答えるには、

> 「このデータはオンチェーン (on-chain) でコミットされたか？」

通常、以下に依存する。

-   特定のノードまたはRPC
-   特定のインデックスモデル (indexing model)
-   アプリケーション定義のデコード (decoding)
-   カスタム検証ロジック (custom verification logic)

そのため、イーサリアムは実行に対する中央集権的な制御を排除したが、

> **検証を標準化することはなかった**

* * *

## 権力の移行

ブリザードはルールを制御することで結果を制御した。

イーサリアムはそれを取り除いた。

しかし今日、システムは依然として以下を制御することで**理解**を制御している。

-   データがどのようにエンコードされるか
-   データがどのように抽出されるか
-   データがどのように解釈されるか
-   データがどのように検証されるか

これは新たな依存関係につながる。

> 検証が主張を生成したシステムに依存するなら、そのシステムは依然として真実を仲介する。

* * *

## 欠けている特性

イーサリアムは以下を標準化する。

-   実行
-   コンセンサス
-   状態

しかし、以下は標準化しない。

> **ポータブルで実装に依存しない検証アーティファクト (verification artifact)**

以下のための共有された不変条件 (invariant) は存在しない。

> 「この正確なバイトシーケンス (byte sequence) は、このオンチェーンコミットメント (on-chain commitment) に対応する」

* * *

## 主張

> 検証が実装間で独立して再現可能でない場合、システムは完全に分散化されているとは言えない。

* * *

## なぜこれが重要なのか

イーサリアムが以下へと移行するにつれて、

-   [[glossary/Rollup|ロールアップ]]
-   プルーフ (proofs)
-   データ最小化 (data minimization)

我々はますます以下のようになっている。

> 何が検証されたかへのポータブルな参照を保持することなく、正しさを検証している

これは以下の状態である。

> **参照可能性 (referenceability) のない検証**

* * *

## 未解決の問い

今日の検証は、実際には実装間でポータブルなのだろうか？

あるいは、

> 我々は、排除したと主張するシステムに依然として依存しているのだろうか？

* * *

## 結び

イーサリアムは実行からブリザードを排除した。

しかし、何が起こったかの検証が依然としてクライアント (client)、インデクサー、またはアプリケーション (application) に依存するなら —

> **制御は消滅したわけではない。それは真実と見なされるものを定義するレイヤーへと移動したのだ。**

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/ethereum-didn-t-kill-blizzard-it-moved-control-to-the-verification-layer/24733)
