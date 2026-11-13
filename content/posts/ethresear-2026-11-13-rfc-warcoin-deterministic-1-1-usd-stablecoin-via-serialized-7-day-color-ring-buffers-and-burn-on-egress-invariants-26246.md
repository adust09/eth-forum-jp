---
title: 'WARCoin: シリアル化された7日間カラーリングバッファと出金時焼却不変条件による決定論的1:1 USDステーブルコイン'
original_title: >-
  [RFC] WARCoin: Deterministic 1:1 USD Stablecoin via Serialized 7-Day Color
  Ring Buffers and Burn-on-Egress Invariants
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/rfc-warcoin-deterministic-1-1-usd-stablecoin-via-serialized-7-day-color-ring-buffers-and-burn-on-egress-invariants/26246
author: Deamonminwar
date: '2026-11-13'
category: Economics
tags:
  - economics
  - stablecoins
  - mechanism-design
  - security
  - smart-contracts
  - protocol-design
  - warcoin
topic_id: '26246'
translated_at: '2026-11-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [[RFC] WARCoin: Deterministic 1:1 USD Stablecoin via Serialized 7-Day Color Ring Buffers and Burn-on-Egress Invariants](https://ethresear.ch/t/rfc-warcoin-deterministic-1-1-usd-stablecoin-via-serialized-7-day-color-ring-buffers-and-burn-on-egress-invariants/26246) — Deamonminwar (2026-11-13)

**著者:** Daemon Minwar
**カテゴリ:** 経済学 / メカニズム設計

### TL;DR

私たちは、無限ミントバグ、クロス担保の伝染、およびリプレイベクターを排除するために設計された、決定論的でエクスプロイト耐性のある1:1 USDステーブルコインアーキテクチャである**WARCoin**を提案します。モノリシックな残高マッピングの代わりに、WARCoinは**USDのみの入金ファイアウォール**、[[glossary/burn-on-egress-serial-invalidation|出金時シリアル無効化]]、および厳格な`10^9`グローバル供給不変条件によって制限される**7つの日次色分けリングバケット**（バケットあたり`1,000`シリアル、`#1`～`#1,000`）を強制します。

* * *

### 1\. 脅威モデルと動機

標準的なERC-20ステーブルコインは、無制限の整数ストレージスロット（`mapping(address => uint256)`）に依存しています。ミント権限が侵害されたり、ブリッジ/担保コントラクトが悪用されたりすると、攻撃者は任意の裏付けのない供給をミントしたり、不良担保で準備金を汚染したりする可能性があります。WARCoinは、有限でシリアル化された発行スロットと厳格な資産分離を強制することにより、これらのベクターを状態遷移レベルで軽減します。

* * *

### 2\. コアプロトコルアーキテクチャ

#### A. 入金/出金資産ファイアウォール

-   **厳格なUSDのみの入金:** ミントルーターは、USD以外の資産の預け入れをリバートします（`require(asset == USD)`）。担保の伝染を防ぐため、外部の暗号資産はゲートウェイで拒否されます。
-   **[[glossary/Burn-on-Egress-Invalidation|出金時無効化]]:** 外部トークンへの出金転送またはスワップは、基盤となるWARCoinシリアルをオンチェーンで即座に焼却し、それらのシリアルインデックスをアクティブな日の**バーンプール (Burn Pool)**に戻し、リプレイ/二重支払いエクスプロイトを防ぎます。

#### B. 7日間カラーリングとシリアル化されたバケット（`#1` – `#1,000`）

各`1 WARCoin`（`$1 USD`）は、**シリアルID（`#1`～`#1,000`）**と**曜日カラーインデックス（`0`～`6`）**が刻印された離散的なシリアル化されたユニットとして追跡されます。

| インデックス | 曜日 | カラータグ | バケット容量 |
| --- | --- | --- | --- |
| 0 | 日曜日 | 赤 | #0001 – #1000 |
| 1 | 月曜日 | 黄色 | #0001 – #1000 |
| 2 | 火曜日 | ピンク | #0001 – #1000 |
| 3 | 水曜日 | 緑 | #0001 – #1000 |
| 4 | 木曜日 | オレンジ | #0001 – #1000 |
| 5 | 金曜日 | 青 | #0001 – #1000 |
| 6 | 土曜日 | 紫 | #0001 – #1000 |

#### C. 決定論的状態遷移ルール

1.  **シーケンシャルなジェネシス実行:** 有効なUSD預け入れは、アクティブな日のカラーバケット内でシリアルをシーケンシャルに（`#1 -> #1,000`）ミントします。
2.  **日中バーン・トゥ・ミントループ:** 日中の引き出し/出金転送は、シリアルをその日のバーンプールに焼却しますが、**焼却されたインデックスは即座に再利用されません**。ステートマシンは、バーンプールから排他的にインデックスを再ミントするためにループバックする前に、まず`#1,000`までのシーケンシャルな実行を使い切る必要があります。
3.  **`+1`循環カラーオーバーフロー:** 現在のバケット内の`1,000`個のシリアルすべてがアクティブに保持されている場合のみ（`BurnPool.length == 0`）、ルーターはモジュロシフト（`nextColor = (currentColor + 1) % 7`）を実行して、7日間リングによって制限される分離された`1,000`シリアルオーバーフローバケットを開きます。
4.  **フェイルセーフなハードフリーズ:** 7つのカラーバケットすべてが焼却済みシリアルゼロで飽和した場合、または`1,000,000,000`のアクティブシリアルのグローバルハードキャップに達した場合、償還がバーンプールを補充するまで、ミントは無条件にリバートされます（`MintingPaused`）。

* * *

### 3\. 供給不変条件

$$ \sum \text{ActiveSerials} + \sum \text{BurnedSerials} \le 10^9 $$

$$ \text{ActiveSerials} \le \text{VerifiedUSDReserves} $$

* * *

### 4\. 実装とセキュリティに関する質問

1.  **ビットマップパッキング (Bitmap Packing):** 各日次バケットは`1,000`スロットに固定されているため、アクティブ/焼却済みフラグをカラーバケットあたり4つの`uint256`ワード（`uint256[4]`）にパッキングすることで、O(1)のビット単位の状態チェックが可能になります。バーン・トゥ・ミントループ中に最下位ビットインデックスをスキャンする際、[[glossary/MEV|MEV（最大抽出可能価値）]]のフロントランニングに関するエッジケースはありますか？
2.  **複数週エポックインデックス付け:** ステート肥大化なしに、`10^9`のグローバルキャップまで過去の週次リングをインデックス付けするための最もガス効率の良いストレージレイアウトは何ですか？
3.  **アトミックな出金スワップ:** ユーザーがWARCoinを外部ERC-20にスワップする際、DEXルーターコールバック内でアトミックなシリアル焼却を強制することに関する注意点はありますか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/rfc-warcoin-deterministic-1-1-usd-stablecoin-via-serialized-7-day-color-ring-buffers-and-burn-on-egress-invariants/26246)
