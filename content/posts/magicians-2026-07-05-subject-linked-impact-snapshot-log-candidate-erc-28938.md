---
title: 主体リンク型インパクトスナップショットログ - 候補ERC
original_title: Subject-Linked Impact Snapshot Log - candidate ERC
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/subject-linked-impact-snapshot-log-candidate-erc/28938
author: redcoat
date: '2026-07-05'
category: ERCs
tags:
  - ercs
  - eip
  - protocol-design
  - applications
  - economics
  - impact-measurement
  - data-structures
topic_id: '28938'
translated_at: '2026-07-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Subject-Linked Impact Snapshot Log - candidate ERC](https://ethereum-magicians.org/t/subject-linked-impact-snapshot-log-candidate-erc/28938) — redcoat (2026-07-05)

アプリケーション定義の主体、指標、完了した測定期間、単位、および方法論にリンクされた、追記専用の定量的インパクトスナップショットに関する候補[[glossary/ERC|ERC（Ethereum Request for Comments）]]についてフィードバックを募集します。

インパクト測定は、一般的にレポートまたはアプリケーション固有の形式で公開されます。単一の可変なオンチェーン値では、新しい報告期間と以前の期間への修正を区別できず、値を置き換えると以前の主張が消去されます。一般的な[[glossary/Attestation|アテステーション（証明）]]は個々のクレームを表すことができますが、それ自体では期間のルックアップ、指標の時系列インデックス作成、修正チェーン、または方法論の移行を定義しません。

コアスナップショットインターフェースは以下を記録します。

-   `subjectId` および `indicatorId`。
-   明示的な小数点以下桁数と単位を持つ署名済み値。
-   完了した半開区間の測定期間 `[periodStart, periodEnd)`。
-   必須の方法論ハッシュと取得URI。
-   報告者の帰属と記録時間。
-   修正の来歴。

正確な`(subjectId, indicatorId, periodStart, periodEnd)`スロットには、1つのオリジナルスナップショットのみが存在できます。後の改訂は、線形かつフォークのない修正チェーンを使用します。月次、四半期、年次、ローリング、およびプロジェクトフェーズの測定はすべて正当であるため、異なる期間が重複する場合があります。消費者は二重計上を避ける責任を負います。

2つのオプションインターフェースは、コアログに必須とすることなく機能を追加します。

1.  [[glossary/Attestation|アテステーション]]インターフェースは、特定のスナップショットに対する不変の承認または異議を保存します。これはコンセンサスを計算したり、[[glossary/Attestation|アテステーション]]を修正に自動的に転送したりしません。
2.  方法論バージョン管理インターフェースは、将来のスナップショットのアクティブな方法論を公開し、即時または順序付けされたスケジュールによる置き換えをサポートします。

正確な報告者アドレスは自身のスナップショットを[[glossary/Attestation|アテステーション]]できませんが、これはアドレスレベルの分離に過ぎません。組織的または財務的な独立性を証明するものではありません。

## スコープの境界

この提案は、表現とライフサイクル動作を標準化します。以下のことは行いません。

-   測定、ソースデータ、または方法論の適用を検証すること。
-   報告者または[[glossary/Attestation|アテステーション]]者を認証すること。
-   普遍的な指標分類体系またはスコアリングモデルを定義すること。
-   重複する期間が加算的であるかどうかを決定すること。
-   同じ基礎となるインパクトが他の場所で主張されるのを防ぐこと。
-   スナップショットを炭素クレジットやその他の譲渡可能な資産に変換すること。

## レビューのための質問

1.  正確な期間ごとに1つのオリジナルを設け、その後に修正の来歴を続けるという方法は、解決可能な現在の値を提供するための正しい方法でしょうか？
2.  [[glossary/ERC|ERC]]は、指標と単位識別子の小さな基本セットを定義すべきでしょうか、それともすべてのセマンティクスを外部の分類体系に任せるべきでしょうか？
3.  プライベートまたはアクセス制御された取得要件があるにもかかわらず、方法論ハッシュと並行して空でない方法論URIを必須とすべきでしょうか？
4.  方法論のガバナンスとスナップショットの[[glossary/Attestation|アテステーション]]は、オプションのERC-165で検出可能なインターフェースに適切に分離されていますか？
5.  [[glossary/Attestation|アテステーション]]者が後に評価を変更した場合でも、[[glossary/Attestation|アテステーション]]は追記専用のままであるべきでしょうか？
6.  追記専用の報告ストリームの場合、タイムスタンプベースのアクティベーションよりも順序付けされたスケジュールによる方法論の変更が望ましいでしょうか？

## 実装状況

[Solidityリファレンス実装、オプションの拡張機能、およびテストスイート](https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-impact-snapshot)は、監査済みコミット[`caa9b05`](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05)で利用可能であり、単体テストとMedusaプロパティテストが含まれています。この実装は、[独立したVerichains監査](https://github.com/KulaDao/titled-asset-standards/blob/main/docs/security/audits/verichains-titled-asset-standards-v1.0.pdf)でもレビューされています。

このインターフェースは独立してデプロイ可能であり、トークン、資産レジストリ、または会計標準に依存しません。これは以前の[アーキテクチャに関する議論](https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913)で他の5つのスタンドアロンインターフェースと共に導入されましたが、それらのインターフェースは依存関係ではなくオプションのコンテキストです。

## 著者

[Chris Turner](https://uk.linkedin.com/in/chrissio76)、[David Hay](https://github.com/david-hay) ([LinkedIn](https://www.linkedin.com/in/david-j-hay))、[Reagan Simpson](https://github.com/krumg111)、および[Collins Musyimi](https://github.com/Musyimi97)。

**Kula**で開発されました。Kulaは、規制された仮想資産および[[glossary/titled-asset-infrastructure|権利証付き資産インフラ]]のユースケース向けインフラを構築しています。リファレンス実装はオープンソースであり、Kula専用のスタックではなく、エコシステムインターフェースを提案しています。Kula以外の追加の共同執筆やコミュニティ貢献も歓迎します。

正式な[[glossary/ERC|ERC]]提出はこちらで利用可能です。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1857)

#### [ERCの追加: 主体リンク型インパクトスナップショットログ](https://github.com/ethereum/ERCs/pull/1857)

`master` ← `KulaDao:erc/impact-snapshot-log`

2026年7月5日 22:10 UTCにオープン

 [![](https://avatars.githubusercontent.com/u/3615726?v=4) david-hay](https://github.com/david-hay)

[+764 \-0](https://github.com/ethereum/ERCs/pull/1857/files)

## 概要 - ドラフトERCを追加: **主体リンク型インパクトスナップショットログ** - 仕様ファイル: `ERCS/erc-impact_snapshot_log.md` - リファレンス実装: [`packages/erc-impact-snapshot`](https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-impact-snapshot) @ [`caa9b05`](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05) ステータス: ドラフト。eip/ファイル名番号はエディター割り当て待ちのプレースホルダー (XXXX) です。 ## 議論 - メタスレッド: https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913 - 専用提案5スレッド: https://ethereum-magicians.org/t/subject-linked-impact-snapshot-log-candidate-erc/28938 ## リファレンス実装 | | | |---|---| | リポジトリ | https://github.com/KulaDao/titled-asset-standards | | パッケージ | https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-impact-snapshot | | セキュリティレビュー | https://github.com/KulaDao/titled-asset-standards/tree/main/docs/security | ## 著者 Chris Turner, David Hay (@david-hay), Reagan Simpson (@krumg111), Collins Musyimi (@Musyimi97)

*1件の投稿 - 1人の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/subject-linked-impact-snapshot-log-candidate-erc/28938)
