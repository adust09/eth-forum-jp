---
title: 主体リンク型コンプライアンスイベントログ - 候補ERC
original_title: Subject-Linked Compliance Event Log - candidate ERC
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/subject-linked-compliance-event-log-candidate-erc/28937
author: redcoat
date: '2026-07-05'
category: ERCs
tags:
  - ercs
  - smart-contracts
  - protocol-design
  - security
  - applications
  - compliance
  - event-logging
topic_id: '28937'
translated_at: '2026-07-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Subject-Linked Compliance Event Log - candidate ERC](https://ethereum-magicians.org/t/subject-linked-compliance-event-log-candidate-erc/28937) — redcoat (2026-07-05)

帰属、証拠コミットメント、型付けされた当事者、バージョン管理されたペイロード、インデックス付け、および修正の来歴を備えた、追記専用の主体リンク型コンプライアンスイベント記録に関する候補[[glossary/ERC|Ethereum Request for Comments (ERC)]]についてフィードバックを募集します。

既存のトークンおよびコンプライアンス標準は、主に動作を定義しています。例えば、転送適格性、保有者ID、凍結、強制転送、その他のライフサイクル操作などです。アプリケーションは、結果として生じる記録を、カスタムイベント、トークンローカルな状態、汎用的な[[glossary/Attestation|アテステーション（証明）]]、またはオフチェーンデータベースを通じて表現しています。これにより、コントラクト、インデクサー、監査人、および報告システムが、実装間で比較可能な主体レベルの履歴をクエリすることが困難になっています。

各記録には以下が含まれます。

-   アプリケーション定義の主体と主体タイプ
-   イベントタイプと結果
-   技術的な記録者としての `msg.sender`
-   別途宣言された権限または委任
-   明示的な役割を持つ当事者
-   ゼロ以外の証拠コミットメントとオプションの証拠URI
-   バージョン管理されたペイロードプロファイルとペイロード
-   操作参照
-   発生、記録、および修正データ

イベントは主体ごとに保存され、正確なイベントタイプでインデックス付けされます。この提案は、一般的なライフサイクルアクション、結果、権限、当事者役割、およびABIエンコードされたペイロードプロファイル用の基本識別子を定義しつつ、名前空間付きカスタム拡張を許可します。

修正は追加的です。修正とは、以前の記録にリンクされた新しいイベントであり、修正された記録は後続への前方ポインタを受け取ります。各イベントは最大1つの後続を持つことができ、修正の[[fork|フォーク]]を防ぎつつ、完全な履歴を保持します。ヘルパーは、修正チェーン内の最終イベントを解決します。

アクターフィールドと権限フィールドは意図的に区別されています。アクターは、どの承認済みアドレスがバイトを送信したかを証明します。権限フィールドは、そのアクターが主張する根拠を記録します。ログは、法的または規制上の権限自体を認証しません。

## スコープの境界

これは報告インターフェースであり、コンプライアンスエンジンではありません。以下を定義または証明しません。

-   保有者のIDまたは適格性
-   転送制限またはトークン強制
-   イベントの真実性または基礎となるアクションの発生
-   法的権限または規制遵守
-   証拠の真正性または利用可能性
-   すべてのイベントタイプ、結果、ペイロードの組み合わせのセマンティックな有効性

アプリケーションは、承認、ポリシー検証、プライバシー、および基礎となる操作へのリンク付けに引き続き責任を負います。

## レビューのための質問

1.  不透明な主体識別子は、相互運用性を犠牲にすることなく、トークン、アドレス、資産、ケース、ポリシーに対して十分に広範でしょうか？
2.  技術的なアクターを主張された権限から分離することは有用で十分に明確でしょうか？
3.  基本[[glossary/ERC|ERC（Ethereum Request for Comments）]]は共通のペイロードプロファイルを定義すべきでしょうか、それとも汎用的なバージョン管理されたペイロードエンベロープのみを定義すべきでしょうか？
4.  単一の後続を持つ修正チェーンは、競合する修正ブランチを許可するよりも好ましいでしょうか？
5.  当事者数とペイロードサイズの制限は、規範的な相互運用性要件であるべきか、それとも参照実装の選択であるべきでしょうか？
6.  イベントのみの設計と比較して、保存されたクエリインターフェースはオンチェーンコストに見合うでしょうか？

## 実装状況

[[Solidity]]参照実装、定数ライブラリ、およびテストスイートは、監査済みコミット[`caa9b05`](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05)で利用可能です。これには、ユニットテストと[[Medusa]]プロパティテストが含まれます。この実装は、[独立した[[Verichains]]監査](https://github.com/KulaDao/titled-asset-standards/blob/main/docs/security/audits/verichains-titled-asset-standards-v1.0.pdf)でもレビューされています。

このインターフェースは独立してデプロイ可能であり、特定のトークンまたはID標準を必要としません。これは、以前の[アーキテクチャに関する議論](https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913)で他の5つのスタンドアロンインターフェースとともに導入されましたが、それらのインターフェースは依存関係ではありません。

## 著者

[Chris Turner](https://uk.linkedin.com/in/chrissio76)、[David Hay](https://github.com/david-hay) ([LinkedIn](https://www.linkedin.com/in/david-j-hay))、[Reagan Simpson](https://github.com/krumg111)、および [Collins Musyimi](https://github.com/Musyimi97)。

規制された仮想資産および[[glossary/titled-asset-infrastructure|権利証付き資産インフラ]]のユースケース向けインフラを構築する**[[Kula]]**で開発されました。参照実装はオープンソースであり、私たちは[[Kula]]専用のスタックではなく、エコシステムインターフェースを提案しています。[[Kula]]以外からの追加の共同執筆やコミュニティ貢献も歓迎します。

正式な[[glossary/ERC|ERC（Ethereum Request for Comments）]]提出はこちらで利用可能です。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1856)

#### [ERCの追加: 主体リンク型コンプライアンスイベントログ](https://github.com/ethereum/ERCs/pull/1856)

`master` ← `KulaDao:erc/compliance-event-log`

2024年7月26日 22:10 UTC に公開

[![david-hayのアバター](https://avatars.githubusercontent.com/u/3615726?v=4) david-hay](https://github.com/david-hay)

[+783 \-0](https://github.com/ethereum/ERCs/pull/1856/files)

## 概要 - ERCドラフト「**主体リンク型コンプライアンスイベントログ**」を追加 - 仕様ファイル: `ERCS/erc-compliance_event_log.md` - 参照実装: [`packages/erc-compliance-event-log`](https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-compliance-event-log) @ [`caa9b05`](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05) 状態: ドラフト。eip/ファイル名の番号はエディターの割り当て待ちのプレースホルダー (XXXX) です。 ## 議論 - メタスレッド: https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913 - 専用提案4スレッド: https://ethereum-magicians.org/t/subject-linked-compliance-event-log-candidate-erc/28937 ## 参照実装 | | | |---|---| | リポジトリ | https://github.com/KulaDao/titled-asset-standards | | パッケージ | https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-compliance-event-log | | セキュリティレビュー | https://github.com/KulaDao/titled-asset-standards/tree/main/docs/security | ## 著者 Chris Turner, David Hay (@david-hay), Reagan Simpson (@krumg111), Collins Musyimi (@Musyimi97)

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/subject-linked-compliance-event-log-candidate-erc/28937)
