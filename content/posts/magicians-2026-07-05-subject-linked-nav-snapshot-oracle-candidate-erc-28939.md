---
title: 主体リンク型NAVスナップショットオラクル - ERC候補
original_title: Subject-Linked NAV Snapshot Oracle - candidate ERC
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/subject-linked-nav-snapshot-oracle-candidate-erc/28939
author: redcoat
date: '2026-07-05'
category: Uncategorized
tags:
  - economics
  - defi
  - oracle
  - eip
  - smart-contracts
  - protocol-design
  - nav-oracle
  - real-world-assets
topic_id: '28939'
translated_at: '2026-07-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Subject-Linked NAV Snapshot Oracle - candidate ERC](https://ethereum-magicians.org/t/subject-linked-nav-snapshot-oracle-candidate-erc/28939) — redcoat (2026-07-05)

アプリケーション定義の主体 (subject) 向けに、プロバイダーに帰属する純資産価値 (NAV) スナップショットを公開およびクエリするための、[[glossary/ERC|ERC（Ethereum Request for Comments）]]候補に関するフィードバックを募集しています。

ファンド、プライベートクレジット、不動産、インフラ、コモディティ、その他の非流動性資産や管理価格設定資産の定期的なNAVは、継続的な市場価格フィードとは異なります。消費者は、その価値が何を表しているのか、その通貨単位、評価がいつ測定されたのか、いつ公開されたのか、誰が提供したのか、どの方法論が使用されたのか、そしてそのいずれかの時間が意図された用途に対して古すぎないかを知る必要があります。

各ストリームは `(subjectId, currency)` でキー付けされ、基礎となるNAVの不変な設定済み基準を1つ持ちます。これは、基礎となるユニットごと、シェアまたはトークンごと、または総主体価値のいずれかです。ストリームレベルで基準を設定することで、プロバイダーが比較不能な解釈を同じ集約セットに提出することを防ぎます。

コアインターフェースは以下を提供します。

-   明示的な小数点精度を持つ署名済みNAV
-   プロバイダーと方法論の帰属
-   個別の評価タイムスタンプと公開タイムスタンプ
-   評価タイムスタンプごとのプロバイダーによるオリジナル提出は1つ
-   線形修正チェーン
-   履歴を保持する管理上の無効化
-   ストリーム全体およびプロバイダー固有の最新値クエリ
-   独立した公開ハートビートと評価経過時間ステータス

無効化は修正とは別です。なぜなら、侵害された、取り消された、または利用できないプロバイダーは、汚染された最終スナップショットを修正できない可能性があるからです。最終修正を無効にすると、その直接の先行が現在のものとして復元され、代替修正が可能になります。同時に、すべての履歴記録と無効化イベントは保持されます。

オプションの集約インターフェースは、現在クォーラムを満たす最大の評価タイムスタンプを選択し、プロバイダーの値を共通の小数点精度に正規化し、決定論的な下位中央値を返します。また、適格なプロバイダー提出を公開し、逸脱アラートを発行します。集約はプロバイダーの独立性や評価の正確性を証明するものではありません。

## スコープ境界

この提案は、公開とクエリのセマンティクスを標準化します。以下のことは行いません。

-   NAVを計算したり、独立して検証したりすること
-   プロバイダーを認証したり、方法論を検証したりすること
-   資産の所有権や裏付けを確立すること
-   流動性や償還権を保証すること
-   NAVを実行可能な市場価格にすること
-   消費するコントラクトが陳腐化や集約結果をチェックすることを保証すること

`latestNAV`は意図的に生の最新スナップショットを公開します。陳腐化に敏感な消費者は、`latestNAVStatus`、集約、または制御されたアダプターを使用し、両方の経過時間シグナルを評価する必要があります。

## レビューに関する質問

1.  不変なストリームレベルのNAV基準は、比較不能なプロバイダー提出に対する適切な保護策でしょうか？
2.  プロバイダーと評価の一意性、および線形修正は、修正履歴として十分でしょうか？
3.  管理上の無効化は、侵害されたプロバイダーの復旧に必要でしょうか。また、先行復元セマンティクスは消費者にとって理解可能でしょうか？
4.  公開経過時間と評価経過時間は、個別の必須シグナルとして維持されるべきでしょうか？
5.  下位中央値は、特に偶数のプロバイダー数と署名付き値の場合に、適切な決定論的集約ルールでしょうか？
6.  集約はオプションのインターフェースとして維持されるべきでしょうか、それともコアに属するほど中心的でしょうか？
7.  報告されたNAVと実行可能な価格との間の明確な区別を考慮すると、「[[glossary/Oracle-Permissioned|オラクル]]」という用語はインターフェースを正確に伝えていますか？

## 実装状況

[[glossary/Solidity|Solidity]]のリファレンス実装とテストスイートが、監査済みコミット[`caa9b05`](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05)で利用可能です。これには、ユニットテスト、Medusaプロパティテスト、決定論的集約、および無効化のカバレッジが含まれます。この実装は、[独立したVerichains監査](https://github.com/KulaDao/titled-asset-standards/blob/main/docs/security/audits/verichains-titled-asset-standards-v1.0.pdf)でもレビューされています。

このインターフェースは独立してデプロイ可能であり、特定のトークンやボールト標準を必要としません。これは、以前の[アーキテクチャ議論](https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913)で他の5つのスタンドアロンインターフェースとともに導入されましたが、それらのインターフェースは依存関係ではありません。

## 著者

[Chris Turner](https://uk.linkedin.com/in/chrissio76)、[David Hay](https://github.com/david-hay) ([LinkedIn](https://www.linkedin.com/in/david-j-hay))、[Reagan Simpson](https://github.com/krumg111)、および[Collins Musyimi](https://github.com/Musyimi97)。

Kulaで開発されました。Kulaは、規制された仮想資産および[[glossary/titled-asset-infrastructure|権利証付き資産インフラ]]のユースケース向けインフラを構築しています。リファレンス実装はオープンソースであり、Kula専用のスタックではなく、エコシステムインターフェースを提案しています。Kula以外の共同執筆やコミュニティ貢献も歓迎します。

正式なERC提出はこちらで利用可能です。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1858)

#### [ERCを追加: [[glossary/Subject-Linked-NAV-Snapshot-Oracle|主体リンク型NAVスナップショットオラクル]]] (https://github.com/ethereum/ERCs/pull/1858)

`master` ← `KulaDao:erc/nav-snapshot-oracle`

2026年7月5日午後10時10分（UTC）にオープン

[![david-hay](https://avatars.githubusercontent.com/u/3615726?v=4) david-hay](https://github.com/david-hay)

[+948 \-0](https://github.com/ethereum/ERCs/pull/1858/files)

## 概要 - ドラフトERCを追加: **[[glossary/Subject-Linked-NAV-Snapshot-Oracle|主体リンク型NAVスナップショットオラクル]]** - 仕様ファイル: `ERCS/erc-nav_snapshot_oracle.md` - リファレンス実装: [`packages/erc-nav-oracle`](https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-nav-oracle) @ [`caa9b05`](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05) ステータス: ドラフト。eip/ファイル名番号は、エディターの割り当て待ちのプレースホルダー（XXXX）です。 ## 議論 - メタスレッド: https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913 - 専用提案6スレッド: https://ethereum-magicians.org/t/subject-linked-nav-snapshot-oracle-candidate-erc/28939 ## リファレンス実装 | | | |---|---| | リポジトリ | https://github.com/KulaDao/titled-asset-standards | | パッケージ | https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-nav-oracle | | セキュリティレビュー | https://github.com/KulaDao/titled-asset-standards/tree/main/docs/security | ## 著者 Chris Turner, David Hay (@david-hay), Reagan Simpson (@krumg111), Collins Musyimi (@Musyimi97)

*1投稿 - 1参加者*

[全トピックを読む](https://ethereum-magicians.org/t/subject-linked-nav-snapshot-oracle-candidate-erc/28939)
