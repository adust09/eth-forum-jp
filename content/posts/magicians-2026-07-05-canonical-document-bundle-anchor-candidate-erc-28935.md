---
title: 規範的文書バンドルアンカー - 候補ERC
original_title: Canonical Document Bundle Anchor - candidate ERC
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/canonical-document-bundle-anchor-candidate-erc/28935
author: redcoat
date: '2026-07-05'
category: ERCs
tags:
  - ercs
  - smart-contracts
  - eip
  - protocol-design
  - security
  - applications
  - document-anchoring
  - offchain-data
topic_id: '28935'
translated_at: '2026-07-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Canonical Document Bundle Anchor - candidate ERC](https://ethereum-magicians.org/t/canonical-document-bundle-anchor-candidate-erc/28935) — redcoat (2026-07-05)

オフチェーン文書のバンドルに対する決定論的なコミットメントを導出し、[[アンカリング|アンカリング]]するための候補[[ERC|ERC（Ethereum Request for Comments）]]についてフィードバックを募集します。

アプリケーションは頻繁に、合意、認証、証拠、修正、および補足記録にコミットします。各ファイルをハッシュ化するだけでは、バンドルの相互運用性を確保するには不十分です。実装は、エントリフィールド、順序付け、正規化識別子、バージョン分離、重複処理、および置換履歴について依然として意見が異なる可能性があります。

この提案は2つのレイヤーを分離します。

1.  正規化プロファイル (normalization profile) は、生の文書を規範的なバイト列に変換します。
2.  マニフェスト (manifest) は、それらのバイト列へのコミットメントを記述し、順序付けし、ハッシュ化します。

各マニフェストエントリには、5つの固定長フィールドが含まれます。

```
struct DocumentEntry {
    bytes32 contentHash;
    bytes32 role;
    bytes32 mimeTypeHash;
    bytes32 filenameHash;
    bytes32 normProfileId;
}
```

エントリは、`role`、`filenameHash`、`contentHash`、`mimeTypeHash`、`normProfileId`の順に辞書順で並べられます。等しいエントリは重複したまま残されるため、バンドルはセットではなくマルチセットです。各エントリはハッシュ化され、順序付けされたリーフはバージョン付きスキーマ識別子の下でコミットされ、1つの`bytes32`バンドルハッシュが生成されます。

ベースプロファイルには、生バイト、RFC 8785 JSON正規化、コメントなしのCanonical XML 1.1が含まれます。JSONおよびXMLの正規化はオフチェーンで行われます。[[Solidity|Solidity]]ライブラリは提供されたエントリフィールドをハッシュ化しますが、呼び出し元がプロファイルを正しく適用したことを証明することはできません。PDFおよび画像文書は、デプロイヤーがカスタム正規化プロファイルに合意しない限り、通常は生バイトプロファイル（`PROFILE_RAW`）を使用します。

オンチェーンインターフェースは、`(subjectId, role)`スロットにバンドルを[[アンカリング|アンカリング]]します。1つのスロットには最大1つのアクティブなバンドルが存在し、スーパーセッション（supersession）は以前の記録とその置換への前方ポインタを保持します。オプションのリカバリー拡張機能により、管理者は、[[アンカリング|アンカリング]]された履歴を書き換えることなく、係争中のスロットプリンシパルを再割り当てできます。

## スコープ境界

この提案は、マニフェストの構築、バンドルハッシュの導出、およびアンカーのライフサイクルを標準化します。以下のことは証明しません。

-   文書の真正性、[[来歴|入力来歴 (input provenance)]]、法的効力、または正確性
-   正規化プロファイルの正しい適用
-   コミットされた文書またはメタデータURIの継続的な可用性
-   マニフェストを再現することなく、個々の文書のメンバーシップ証明

この構築は、完全な順序付けされたマニフェストにコミットします。意図的に[[マークルツリー|マークルツリー]]を規定していません。

## レビューのための質問

1.  マニフェストフィールドと5フィールドの全順序は、隠れた順序付けの曖昧さを排除するのに十分ですか？
2.  JSONおよびXMLの正規化プロファイルは、この[[ERC|ERC（Ethereum Request for Comments）]]で規範的であるべきか、それともプロファイルは独立してバージョン管理された付属文書に存在すべきか？
3.  重複エントリを保持するのが適切なデフォルトか、それとも完全に重複するエントリは拒否されるべきか？
4.  `(subjectId, role)`は、1つのアクティブなバンドルと追記専用のスーパーセッション履歴のための適切な名前空間ですか？
5.  スロットプリンシパルの再割り当ては、オプションのリカバリー拡張機能のままであるべきか？
6.  完全なマニフェストハッシュがベースプリミティブとして好ましいか、[[マークルツリー|マークルツリー]]メンバーシップ証明は別の拡張機能に任せるべきか？

## 実装状況

[[Solidity|Solidity]]のリファレンス実装、ハッシュ化ライブラリ、およびテストスイートが、監査済みコミット[`caa9b05`](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05)で利用可能です。これには、ユニットテスト、ファズテスト、Medusaプロパティテストが含まれます。この実装は、[独立したVerichains監査](https://github.com/KulaDao/titled-asset-standards/blob/main/docs/security/audits/verichains-titled-asset-standards-v1.0.pdf)でもレビューされています。

このインターフェースは独立してデプロイ可能です。以前の[アーキテクチャに関する議論](https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913)で他の5つのスタンドアロンインターフェースとともに導入されましたが、資産レジストリやそのファミリーの他の提案には依存しません。

## 著者

[Chris Turner](https://uk.linkedin.com/in/chrissio76)、[David Hay](https://github.com/david-hay) ([LinkedIn](https://www.linkedin.com/in/david-j-hay))、[Reagan Simpson](https://github.com/krumg111)、および[Collins Musyimi](https://github.com/Musyimi97)。

**Kula**で開発されました。Kulaは、規制された仮想資産および[[RWAプラットフォーム (Real World Assetプラットフォーム)|RWAプラットフォーム]]のユースケース向けインフラを構築しています。リファレンス実装はオープンソースであり、Kula専用のスタックではなく、エコシステムインターフェースを提案しています。Kula以外の追加の共同執筆およびコミュニティ貢献も歓迎します。

正式な[[ERC|ERC（Ethereum Request for Comments）]]提出はこちらで利用可能です。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1854)

#### [ERCの追加: 規範的文書バンドルアンカー](https://github.com/ethereum/ERCs/pull/1854)

`master` ← `KulaDao:erc/document-bundle-anchor`

公開日 05 Jul 26 UTC 午後10時10分

 [![david-hayのアバター](https://avatars.githubusercontent.com/u/3615726?v=4) david-hay](https://github.com/david-hay)

[+676 -0](https://github.com/ethereum/ERCs/pull/1854/files)

## 概要 - ドラフト[[ERC|ERC（Ethereum Request for Comments）]]の追加: **規範的文書バンドルアンカー** - 仕様ファイル:[…](https://github.com/ethereum/ERCs/pull/1854)e: `ERCS/erc-document_bundle_anchor.md` - リファレンス実装: [`packages/erc-document-bundle-anchor`](https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-document-bundle-anchor) @ [`caa9b05`](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05) ステータス: ドラフト。eip/ファイル番号は、エディター割り当て待ちのプレースホルダー (XXXX) です。 ## 議論 - メタスレッド: https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913 - 専用提案2スレッド: https://ethereum-magicians.org/t/canonical-document-bundle-anchor-candidate-erc/28935 ## リファレンス実装 | | | |---|---| | リポジトリ | https://github.com/KulaDao/titled-asset-standards | | パッケージ | https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-document-bundle-anchor | | セキュリティレビュー | https://github.com/KulaDao/titled-asset-standards/tree/main/docs/security | ## 著者 Chris Turner, David Hay (@david-hay), Reagan Simpson (@krumg111), Collins Musyimi (@Musyimi97)

*1件の投稿 - 1人の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/canonical-document-bundle-anchor-candidate-erc/28935)
