---
title: Ethereumにおけるポータブルな検証境界に向けて
original_title: Toward a Portable Verification Boundary for Ethereum
source_url: >-
  https://ethresear.ch/t/toward-a-portable-verification-boundary-for-ethereum/24847
author: DamonZwicker
date: '2026-05-10'
category: Execution Layer Research
tags:
  - execution-layer-research
  - ethereum
  - verification
  - protocol
topic_id: '24847'
translated_at: '2026-05-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Toward a Portable Verification Boundary for Ethereum](https://ethresear.ch/t/toward-a-portable-verification-boundary-for-ethereum/24847) — DamonZwicker (2026-05-10)

## Ethereumにおけるポータブルな検証境界に向けて

Ethereumは2つの側面で大きな進歩を遂げました。

-   **正当性 (Correctness)**（例: ZK証明）: 計算が正しく実行されたことを証明する
-   **[[glossary/Data-Availability|データアベイラビリティ]] (Data Availability)**（例: DAS、ブロブ）: データが取得可能であることを証明する

しかし、ギャップが残っています。

**検証は依然としてシステム依存です。**

ほとんどの現実世界の検証ワークフローは、依然として以下に依存しています。

-   特定の実行環境
-   [[glossary/Rollup|ロールアップ]]固有のプロバー
-   インデクサーまたはAPI
-   アプリケーション層のセマンティクス

これは、検証が結果を生成したシステムの外では成り立たないことを意味します。

* * *

## 欠けているレイヤー

AIシステムが以下を生成し始めると:

-   法的文書
-   財務記録
-   監査ログ
-   実行トレース

…要件が変わります。

もはや問いは次のようではありません。

> 「これは正しく計算されたか？」

それは次のようになります。

> 「元のシステムを信頼することなく、実際に存在したものを第三者が独立して検証できるか？」

* * *

## 最小限のモデル

```
observation ∈ {0,1}*
H = hash(observation)
commitment = inclusion of H in a public ledger
```

検証は以下に還元されます。

1.  H′ = hash(observation′) を再計算する
2.  H′ == H を確認する
3.  トランザクションにおけるHのインクルージョン（包含）を確認する

これにより、ポータブルな検証不変条件が得られます。

> 1バイトでも変更があれば、検証は失敗する。

* * *

## 観測コミットメントプロトコル（OCP）

観測コミットメントプロトコルは、この境界のみを定義します。

以下は**定義しません**。

-   ストレージ
-   アイデンティティ
-   オーサーシップ（著作権）
-   カノニカルなエンコーディング
-   実行セマンティクス
-   データアベイラビリティ

定義するのは以下です。

> **システム非依存の検証境界**  
> **ポータブルな検証アーティファクト**: (ダイジェスト + トランザクション参照)

* * *

## なぜこれが重要なのか

今日:

-   ZKは*正しい実行*を証明する
-   DAは*データが利用可能である*ことを証明する

しかし、どちらか一方だけでは以下を提供しません。

> 実際に存在したものを独立した第三者が検証できるポータブルなアーティファクト

これがなければ、検証は以下のままです。

-   特定のシステムに縛られる
-   インフラの仮定に依存する
-   コンテキスト間でポータブルではない

* * *

## 提案される枠組み

Ethereumには3つ目のプリミティブが欠けているかもしれません。

1.  **正当性 (Correctness)** → 「正しく計算されたか？」
2.  **利用可能性 (Availability)** → 「データは取得可能か？」
3.  **検証境界 (Verification Boundary)** → 「この正確なアーティファクトは後で独立して検証できるか？」

* * *

## 未解決の疑問

-   この境界はプロトコルレベルで標準化されるべきか？
-   カノニカルなコミットメント/抽出インターフェースが必要か？
-   これは[[glossary/Rollup|ロールアップ]]、ZKシステム、DAレイヤーとどのように組み合わせるべきか？
-   これはインデクサーやアプリケーション固有の検証ロジックへの依存を減らせるか？

* * *

## リファレンス実装

```
npx ocp-commit file.txt
npx ocp-verify file.txt
```

1バイトでも変更があれば、検証は失敗します。

リポジトリ:

[github.com](https://github.com/damonzwicker/observation-commitment-protocol)

![](https://ethresear.ch/uploads/default/optimized/3X/0/b/0b9279094cda5ea312ec876012388f2af07075ca_2_690x344.png)

### [GitHub - damonzwicker/observation-commitment-protocol: A minimal protocol for independently verifying...](https://github.com/damonzwicker/observation-commitment-protocol)

特定のバイトシーケンスが公開台帳にコミットされたことを独立して検証するための最小限のプロトコル。

* * *

## 結び

Ethereumは決済レイヤーから調整レイヤーへと進化しました。

次のステップは次のようになるかもしれません。

> **検証レイヤー** — 真実がシステムから推論されるのではなく、  
> 独立して再計算され、確認される場所。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/toward-a-portable-verification-boundary-for-ethereum/24847)
