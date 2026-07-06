---
title: 方向性のある転送ドメインレジストリ - 候補となるERC
original_title: Directional Transfer Domain Registry - candidate ERC
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/directional-transfer-domain-registry-candidate-erc/28936
author: redcoat
date: '2026-07-05'
category: ERCs
tags:
  - ercs
  - erc
  - smart-contracts
  - security
  - applications
  - protocol-design
  - tokenomics
  - compliance
  - asset-management
topic_id: '28936'
translated_at: '2026-07-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Directional Transfer Domain Registry - candidate ERC](https://ethereum-magicians.org/t/directional-transfer-domain-registry-candidate-erc/28936) — redcoat (2026-07-05)

アセットクラスごとの不透明なドメイン間の方向性のある転送経路パーミッションに関する、トークンに依存しないレジストリの候補となる[[glossary/ERC|ERC（Ethereum Request for Comments）]]についてフィードバックを募集しています。

トークン標準とコンプライアンスモジュールは、一般的にアドレスレベルまたはトークンレベルの問いに答えます。これらは、多くのトークンに適用できる別のポリシーに関する問いに対して、共有されたルックアップサーフェスを提供しません。

> このアセットクラスについて、このソースドメインからこの宛先ドメインへの転送は現在許可されていますか？

ドメインは、管轄区域、規制された会場、企業ネットワーク、ゲーム経済、DAO（分散型自律組織）の財務境界、またはその他のアプリケーション定義のコンテキストを表す場合があります。この提案は、ドメインとアセットクラスの識別子を、普遍的な分類法を規定するのではなく、不透明な `bytes32` 値として意図的に扱います。

経路は、順序付けられた以下の3つの要素でキー付けされます。

```
(sourceDomain, destinationDomain, assetClass)
```

方向は重要です。AからBへの許可は、BからAへの許可を意味しません。アセットクラスも重要であり、同じドメインペアでも、あるクラスは許可し、別のクラスは拒否することができます。

コアインターフェースは、経路ルックアップ、経路状態の取得、設定、即時取り消し、ゼロ以外の証拠コミットメント、および制限付きバッチクエリをサポートします。オプションのグレースフル取り消しインターフェースは、開始、キャンセル、将来の有効性、および最終化をサポートします。グレースフル取り消しは、最終化トランザクションが提出されなくても、発表されたタイムスタンプで有効になります。最終化は状態を永続化し、最終イベントを発行します。

## スコープの境界

レジストリは、提供された経路の3つの要素のみを評価します。以下のことは行いません。

-   アカウントやトークンをドメインに割り当てること。
-   ドメインやアセットクラスの分類法を定義すること。
-   保有者のID、残高、凍結、制裁、または決済のチェックを実行すること。
-   経路決定の背後にある証拠を検証すること。
-   トークンの転送自体を強制すること。

トークン、コンプライアンスモジュール、ブリッジ、決済コントラクト、または転送コントローラーは、適用される識別子を解決し、統制されたアクションと同じトランザクション内でレジストリをクエリする必要があります。[[glossary/ERC|ERC]]-165のサポートは、インターフェースが公開されていることを示すだけであり、トークンがレジストリを参照したり、その決定を強制したりすることを証明するものではありません。

## レビューのための質問

1.  不透明な、アプリケーション定義のドメインネームスペースは適切な抽象化でしょうか、それとも相互運用性には別の標準化されたリゾルバーインターフェースが必要でしょうか？
2.  アセットクラスのスコープで十分でしょうか、それともベースキーに追加の経路次元が必要でしょうか？
3.  すべての許可および取り消しアクションに対して、ゼロ以外の証拠コミットメントを必須とすべきでしょうか？
4.  即時取り消しと、オプションのタイムスタンプベースのグレースフル取り消しは、適切なライフサイクル分割でしょうか？
5.  有効性が時間によってすでに遅延的に決定されている場合、グレースフル最終化はパーミッションレスであるべきでしょうか？
6.  バッチクエリは標準インターフェースで有用でしょうか、また[[glossary/ERC|ERC]]は普遍的な最大サイズを設定すべきでしょうか、それとも実装定義にすべきでしょうか？

## 実装状況

[Solidity（ソリディティ）のリファレンス実装とテストスイート](https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-transfer-domain)は、監査済みのコミット[`caa9b05`](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05)で利用可能です。これには、即時およびグレースフルレジストリ、ユニットテストとファズテスト、およびMedusa（メデューサ）プロパティテストが含まれています。この実装は、[独立したVerichains（ベリチェーンズ）監査](https://github.com/KulaDao/titled-asset-standards/blob/main/docs/security/audits/verichains-titled-asset-standards-v1.0.pdf)でもレビューされています。

このインターフェースは独立してデプロイ可能であり、トークン標準に中立です。これは、以前の[アーキテクチャに関する議論](https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913)で他の5つのスタンドアロンインターフェースとともに導入されましたが、このレジストリを使用するためにそれらのいずれも必須ではありません。

## 著者

[Chris Turner](https://uk.linkedin.com/in/chrissio76)、[David Hay](https://github.com/david-hay) ([LinkedIn](https://www.linkedin.com/in/david-j-hay))、[Reagan Simpson](https://github.com/krumg111)、および[Collins Musyimi](https://github.com/Musyimi97)。

**Kula**で開発されました。Kulaは、規制された仮想資産および[[glossary/titled-asset-infrastructure|権利証付き資産インフラ]]のユースケースのためのインフラを構築しています。リファレンス実装はオープンソースであり、Kula専用のスタックではなく、エコシステムインターフェースを提案しています。Kula以外の追加の共同執筆やコミュニティ貢献も歓迎します。

正式な[[glossary/ERC|ERC]]の提出はこちらで入手できます。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1855)

#### [ERCの追加: 方向性のある転送ドメインレジストリ](https://github.com/ethereum/ERCs/pull/1855)

`master` ← `KulaDao:erc/transfer-domain-registry`

2026年7月5日 22:10 UTC 開設

 ![david-hayのアバター](https://avatars.githubusercontent.com/u/3615726?v=4) [david-hay](https://github.com/david-hay)

[+679 -0](https://github.com/ethereum/ERCs/pull/1855/files)

## 概要 - ドラフト[[glossary/ERC|ERC]]「**方向性のある転送ドメインレジストリ**」を追加 - 仕様[…](https://github.com/ethereum/ERCs/pull/1855) ファイル: `ERCS/erc-transfer_domain_registry.md` - リファレンス実装: [`packages/erc-transfer-domain`](https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-transfer-domain) @ [`caa9b05`](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05) ステータス: ドラフト。eip/ファイル名の番号は、エディターの割り当て待ちのプレースホルダー (XXXX) です。 ## 議論 - メタスレッド: https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913 - 専用の提案3スレッド: https://ethereum-magicians.org/t/directional-transfer-domain-registry-candidate-erc/28936 ## リファレンス実装 | | | |---|---| | リポジトリ | https://github.com/KulaDao/titled-asset-standards | | パッケージ | https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-transfer-domain | | セキュリティレビュー | https://github.com/KulaDao/titled-asset-standards/tree/main/docs/security | ## 著者 Chris Turner, David Hay (@david-hay), Reagan Simpson (@krumg111), Collins Musyimi (@Musyimi97)

*1件の投稿 - 1人の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/directional-transfer-domain-registry-candidate-erc/28936)
