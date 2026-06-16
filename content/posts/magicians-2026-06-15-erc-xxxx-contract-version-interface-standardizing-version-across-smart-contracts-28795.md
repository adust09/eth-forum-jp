---
title: 'ERC-XXXX: コントラクトバージョンインターフェース — スマートコントラクト全体での `version()` の標準化'
original_title: >-
  ERC-XXXX: Contract Version Interface — Standardizing version() Across Smart
  Contracts
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-xxxx-contract-version-interface-standardizing-version-across-smart-contracts/28795
author: AccessDenied403
date: '2026-06-15'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - protocol-design
  - ux
  - standards
topic_id: '28795'
translated_at: '2026-06-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX: Contract Version Interface — Standardizing version() Across Smart Contracts](https://ethereum-magicians.org/t/erc-xxxx-contract-version-interface-standardizing-version-across-smart-contracts/28795) — AccessDenied403 (2026-06-15)

# **概要**

インテグレーター、監査人、およびツールが現在デプロイされている実装バージョンを識別するためのシンプルでオンチェーンな方法として、[[スマートコントラクト|スマートコントラクト]]向けの `version()` ビュー関数を標準化する最小限の[[ERC|ERC]]を提案したいと思います。

* * *

## 動機

今日、ほとんどの非自明なプロトコルは何らかのバージョンの文字列を公開していますが、それぞれ異なる方法で行われており、ほとんどは[[ERC-165|ERC-165]]を介したインターフェースサポートを通知していません。これにより、以下の摩擦が生じています。

-   **インテグレーター**は、バージョンを検出するためにプロトコルごとにカスタムアダプターを必要とします。
-   **インシデント対応者**は、どのデプロイメントを調査しているのかを迅速に確認できません。
-   **セキュリティ監査人**は、稼働中のコントラクトを監査済みのコードベースにマッピングする標準的な方法がありません。
-   **ガバナンスおよびアップグレードツール**は、オンチェーンの自己内省ではなく、オフチェーンの帳簿管理に依存しなければなりません。

[[ERC-3643|ERC-3643]]（パーミッション付きトークン）はすでに `version()` 関数を義務付けており、これは実際に有用であることが証明されています。この[[ERC|ERC]]の目標は、そのパターンを抽出し、トークンに依存しないものにし、適切な[[ERC-165|ERC-165]]サポートを提供することで、[[DeFi|DeFi]]、インフラストラクチャコントラクト、およびガバナンスシステム全体で使用できるようにすることです。

* * *

## 仕様 (概要)

```
interface IERCVersion {
    /// @notice Returns the implementation version string.
    /// @return The version value (for example "1.0.0").
    function version() external view returns (string memory);
}
```

**必須の動作:**

-   `version()` はビュー関数でなければならず (MUST)、通常の操作でリバートしてはなりません (MUST NOT)。
-   `version()` は空でない文字列を返さなければなりません (MUST)。
-   実装はSemVerスタイルのフォーマットを使用すべきです (SHOULD): `MAJOR.MINOR.PATCH`（例: `1.0.0`、`3.2.1`）。
-   実装は[[ERC-165|ERC-165]]をサポートすべきです (SHOULD)。[[ERC-165|ERC-165]]がサポートされている場合、`supportsInterface(0x54fd4d50)` は `true` を返さなければなりません (MUST)。

**デプロイメントモデル:** イミュータブルなコントラクトとプロキシベースのアップグレード可能なシステムの両方と互換性があります。アップグレード可能なデプロイメントでは、`version()` はユーザーが認識するアクティブな実装を反映すべきです (SHOULD)。

**[[ERC-3643|ERC-3643]]との後方互換性:** インテグレーターは、互換性のある `version()` を公開する既存の[[ERC-3643|ERC-3643]]コントラクトを、[[ERC-165|ERC-165]]サポートなしでも、このインターフェースを実装しているものとして扱ってもよいです (MAY)。

* * *

## 設計上の選択と根拠

**なぜ単一の関数なのか？** 最小限のインターフェースは採用を最大化します。追加の要件はすべて、インターフェースを実装しない理由となります。

**なぜ `string` で `bytes32` ではないのか？** エクスプローラーやツールでの人間による可読性が、わずかなガス節約よりも優先されました。バージョン文字列はホットパスにはありません。

**なぜ[[ERC-165|ERC-165]]を推奨するが必須ではないのか？** [[ERC-165|ERC-165]]を必須にすると、インターフェース検出を実装していないコントラクトの採用障壁が高まります。SHOULDにすることで、インターフェースを最小限に保ちます。[[ERC-165|ERC-165]]が存在する場合、このインターフェースを宣伝することは必須であるため、シグナルが存在する場合にはインテグレーターは一貫した検出を得ることができ、オプトアウトするコントラクトを除外することもありません。

**なぜSemVerで整数ではないのか？** SemVerはすでにエコシステム（npm、cargo、go modules）におけるデファクトスタンダードです。`MAJOR.MINOR.PATCH` 文字列は、追加のドキュメントなしに開発者やツールにとってすぐに意味を持ちます。

* * *

## この[[ERC|ERC]]が定義しないこと

-   **オンチェーンでのバージョンフォーマットの強制:** コントラクトは自身のバージョン文字列を検証できません。フォーマットの遵守は社会的な/ツールによる慣習です。
-   **バージョン変更イベント:** インターフェースを最小限に保つため、バージョン変更のためのイベントは意図的に除外しました。アップグレード可能性フレームワークにおけるガバナンスイベントがすでにこれをカバーしています。
-   **バージョン増分の意味論的意味:** 実装者は独自のバージョン管理ポリシーを定義し、それを公開すべきです (SHOULD)。

* * *

## コミュニティへの未解決の質問

1.  [[ERC|ERC]]は特定のバージョンフォーマット（SemVer正規表現）を義務付けるべきか、それともSHOULDのままにすべきか？より厳格な要件は機械による比較可能性を向上させますが、柔軟性を低下させます。
2.  アップグレード可能なシステム向けに、オプションであっても `versionChanged` イベントは存在すべきか？

* * *

## 先行研究と参考文献

-   [[ERC-3643|ERC-3643]]: パーミッション付きトークンコントラクトに `version()` 関数を義務付けています。この[[ERC|ERC]]の直接的なインスピレーションです。
-   [[ERC-165|ERC-165]]: インターフェース検出標準であり、この[[ERC|ERC]]によって推奨されています。
-   [SemVer 2.0.0](https://semver.org/): 推奨されるバージョン管理フォーマットです。

* * *

フィードバックをお待ちしております！

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-xxxx-contract-version-interface-standardizing-version-across-smart-contracts/28795)
