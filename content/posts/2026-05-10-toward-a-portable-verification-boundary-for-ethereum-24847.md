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
  - data-availability
  - zk-proofs
  - protocol
topic_id: '24847'
translated_at: '2026-05-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Toward a Portable Verification Boundary for Ethereum](https://ethresear.ch/t/toward-a-portable-verification-boundary-for-ethereum/24847) — DamonZwicker (2026-05-10)

## Ethereumにおけるポータブルな検証境界に向けて

Ethereumは2つの主要な側面で大きな進歩を遂げました。

-   **正確性**（例: ZKプルーフ）: 計算が正しく実行されたことを証明する
-   **[[glossary/Data-Availability|データアベイラビリティ]]**（例: DAS、ブロブ）: データが取得可能であることを証明する

しかし、ギャップが残っています。

**検証は依然としてシステムに依存しています。**

ほとんどの実際の検証ワークフローは、依然として以下に依存しています。

-   特定の実行環境
-   [[glossary/Rollup|ロールアップ]]固有のプロバー
-   インデクサーまたはAPI
-   アプリケーション層のセマンティクス

これは、検証が結果を生成したシステムの外では機能しないことを意味します。

* * *

## 欠けているレイヤー

AIシステムが以下を生成し始めるにつれて:

-   法的文書
-   財務記録
-   監査ログ
-   実行トレース

…要件が変化します。

問いはもはや:

> 「これは正しく計算されたか？」

ではなくなります。それは次のようになります:

> 「発信元のシステムを信頼することなく、実際に存在したものを任意の第三者が独立して検証できるか？」

* * *

## 最小モデル

```
observation ∈ {0,1}*
H = hash(observation)
commitment = inclusion of H in a public ledger
```

検証は以下に帰着します。

1.  H′ = hash(observation′) を再計算する
2.  H′ == H をチェックする
3.  トランザクションにおけるHのインクルージョン（包含）を確認する

これにより、ポータブルな検証不変条件が得られます。

> 1バイトでも変更されれば、検証は失敗します。

* * *

## オブザベーション・コミットメント・プロトコル（OCP）

オブザベーション・コミットメント・プロトコルは、この境界のみを定義します。

それは以下を**定義しません**:

-   ストレージ
-   アイデンティティ
-   オーサーシップ（著作権/作成者）
-   カノニカルエンコーディング
-   実行セマンティクス
-   データアベイラビリティ

それは以下を定義します:

> **システムに依存しない検証境界**  
> **ポータブルな検証アーティファクト**: (ダイジェスト + トランザクション参照)

* * *

## なぜこれが重要なのか

今日:

-   ZKは*正しい実行*を証明する
-   DAは*データが利用可能*であることを証明する

しかし、どちらも単独では以下を提供しません。

> 実際に存在したものを独立した第三者検証を可能にするポータブルなアーティファクト

これがなければ、検証は以下のままです。

-   特定のシステムに縛られる
-   インフラの前提に依存する
-   コンテキスト間でポータブルではない

* * *

## 提案される枠組み

Ethereumには第三のプリミティブが欠けているかもしれません。

1.  **正確性** → 「それは正しく計算されたか？」
2.  **アベイラビリティ** → 「データは取得できるか？」
3.  **検証境界** → 「この正確なアーティファクトは後で独立して検証できるか？」

* * *

## 未解決の疑問

-   この境界はプロトコルレベルで標準化されるべきか？
-   カノニカルなコミットメント/抽出インターフェースが必要か？
-   これは[[glossary/Rollup|ロールアップ]]、ZKシステム、およびDA層とどのように構成されるべきか？
-   これはインデクサーやアプリケーション固有の検証ロジックへの依存を減らすことができるか？

* * *

## リファレンス実装

```
npx ocp-commit file.txt
npx ocp-verify file.txt
```

1バイトでも変更されれば、検証は失敗します。

リポジトリ:

[github.com](https://github.com/damonzwicker/observation-commitment-protocol)

![OCPリファレンス実装のスクリーンショット](https://ethresear.ch/uploads/default/optimized/3X/0/b/0b9279094cda5ea312ec876012388f2af07075ca_2_690x344.png)

### [GitHub - damonzwicker/observation-commitment-protocol: 特定のバイトシーケンスが公開台帳にコミットされたことを独立して検証するための最小限のプロトコル](https://github.com/damonzwicker/observation-commitment-protocol)

特定のバイトシーケンスが公開台帳にコミットされたことを独立して検証するための最小限のプロトコル。

* * *

## 結び

Ethereumは決済レイヤーから調整レイヤーへと進化しました。

次のステップは以下のようになるかもしれません。

> **検証レイヤー** — 真実がシステムから推論されるのではなく、  
> 独立して再計算され、確認される場所。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/toward-a-portable-verification-boundary-for-ethereum/24847)
