---
title: 資産アンカーレジストリインターフェース - 候補ERC
original_title: Asset Anchor Registry Interface - candidate ERC
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/asset-anchor-registry-interface-candidate-erc/28934
author: redcoat
date: '2026-07-05'
category: ERCs
tags:
  - ercs
  - erc
  - tokenomics
  - defi
  - security
  - protocol-design
  - applications
  - asset-tokenization
  - real-world-assets
topic_id: '28934'
translated_at: '2026-07-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Asset Anchor Registry Interface - candidate ERC](https://ethereum-magicians.org/t/asset-anchor-registry-interface-candidate-erc/28934) — redcoat (2026-07-05)

オフチェーン資産に関するクレームを表すレジストリレコードに、トークンコントラクトまたは個々のトークンIDをバインドするための[[glossary/ERC|ERC（Ethereum Request for Comments）]]候補についてフィードバックを募集します。

相互運用性の問題は、法的所有権や実世界資産の存在を証明することよりも狭い範囲です。トークンはメタデータを通じて資産を表すと主張できますが、別のコントラクトは現在、以下の点を決定する共通の方法を欠いています。

-   トークンがどのレジストリレコードを主張しているか。
-   レジストリが同じトークンとアンカーの関係を記録しているか。
-   バインディングがコントラクト全体に適用されるか、それとも1つのトークンIDに適用されるか。
-   そのレジストリ内でバインディングが排他的であるか。
-   アンカーがアクティブなままであり、バインディングが有効なままであるか。

提案されているレジストリは、個別の`legalHash`と`evidenceHash`コミットメントを保存し、決定論的なアンカー識別子を導出します。

```
anchorId = keccak256(abi.encode(legalHash, evidenceHash));
```

これは、コントラクト全体およびトークンIDのバインディングに対して、明示的なドメイン分離スコープを定義しており、トークンIDゼロの明確な表現を含みます。レジストリは、アンカーごとに1つの有効なバインディングを強制し、そのレジストリ内でアクティブなバインディングタプルの再利用を防ぎます。

個別のトークン側インターフェースにより、トークンは認識するレジストリとアンカーを宣言できます。相互宣言を必要とするコンシューマーは、レジストリレコードとトークン自身の応答を比較できます。トークン側インターフェースを公開しないトークンでも登録できますが、その場合、コンシューマーはその関係を相互宣言ではなく、レジストリ宣言として扱う必要があります。

レジストラは、登録とバインディングの間の期間を避けるために、`registerAndBind`を介してアトミックに登録およびバインドできます。そうでない場合、これらのステップを分割するデプロイメントでは、バインディングの承認とタイミングが重要になります。

ライフサイクルインターフェースは、構造化された登録メタデータ、有効期限、単調な再[[glossary/Attestation|アテステーション（証明）]]、および永続的な非アクティブ化をカバーします。アクティビティとバインディングは意図的に分離されています。期限切れまたは非アクティブ化されたアンカーは、履歴的にバインドされたままです。オプションのリカバリインターフェースは、異議申し立てされたバインディングを無効にしながらレコードを保持し、タプルを解放して代替バインディングを許可する場合があります。

## スコープ境界

この提案は、レジストリスコープの構造的関係を標準化するものです。以下のことを確立するものではありません。

-   資産の存在、所有権、カストディ、法的有効性、または価値。
-   コミットされた文書の真実性または利用可能性。
-   独立したレジストリ間でのグローバルな一意性。
-   トークンの供給、部分的な割り当て、または権利の完全性。
-   すべてのレジストリが同等の信頼に値すること。

レジストリの選択とガバナンスは、各コンシューマーにとって明示的な信頼決定のままです。

## レビューのための質問

1.  レジストリスコープの排他性が適切な相互運用性保証でしょうか、それともインターフェースはより強力なクロスレジストリ協調を試みるべきでしょうか？
2.  コントラクト全体とトークンIDスコープの区別は、ERC-20、ERC-721、ERC-1155、パーミッション型、および将来のトークン設計にとって十分に明確でしょうか？
3.  相互トークン側宣言はオプションのままであるべきでしょうか、コンシューマーがそれをレジストリのみの表明と区別できるようにすべきでしょうか？
4.  ライフサイクルアクティビティとバインディングの有効性を分離することは明確で有用でしょうか、それともコンシューマーは追加の統合クエリから恩恵を受けるでしょうか？
5.  導入される信頼を考慮すると、管理上の無効化はオプションのリカバリインターフェースとして維持するのが最善でしょうか？

## 実装状況

[[glossary/Solidity|Solidity]]の参照実装とテストスイートは、監査済みコミット[`caa9b05`](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05)で利用可能です。これには、ユニットテスト、[[glossary/fuzz|ファズテスト]] (fuzz test)、[[glossary/invariant|不変条件]] (invariant) テスト、およびMedusaプロパティテストが含まれます。この実装は、[独立したVerichains監査](https://github.com/KulaDao/titled-asset-standards/blob/main/docs/security/audits/verichains-titled-asset-standards-v1.0.pdf)でもレビューされています。

このインターフェースは独立してデプロイ可能です。以前の[アーキテクチャに関する議論](https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913)で他の5つのスタンドアロンインターフェースと共に導入されましたが、それらの他のインターフェースの採用は必須ではありません。

## 著者

[Chris Turner](https://uk.linkedin.com/in/chrissio76)、[David Hay](https://github.com/david-hay) ([LinkedIn](https://www.linkedin.com/in/david-j-hay))、[Reagan Simpson](https://github.com/krumg111)、および[Collins Musyimi](https://github.com/Musyimi97)。

**Kula**で開発されました。Kulaは、規制された仮想資産および[[glossary/titled-asset-infrastructure|権利証付き資産インフラ]] (titled-asset infrastructure) のユースケース向けインフラを構築しています。参照実装はオープンソースであり、私たちはKula専用のスタックではなく、エコシステムインターフェースを提案しています。Kula以外の共同執筆やコミュニティ貢献も歓迎します。

正式な[[glossary/ERC|ERC]]提出は以下で利用可能です。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1853)

#### [ERCの追加: 資産アンカーレジストリインターフェース](https://github.com/ethereum/ERCs/pull/1853)

`master` ← `KulaDao:erc/asset-anchor-registry`

公開日 2026年7月5日 22:10 UTC

 ![david-hayのアバター](https://avatars.githubusercontent.com/u/3615726?v=4) [david-hay](https://github.com/david-hay)

[+712 \-0](https://github.com/ethereum/ERCs/pull/1853/files)

\## 概要 - ドラフトERC: \*\*[[glossary/Asset-Anchor-Registry|資産アンカーレジストリ]] (Asset Anchor Registry)\*\* を追加 - 仕様ファイル: \`ERCS/er[…](https://github.com/ethereum/ERCs/pull/1853)c-asset\_anchor\_registry.md\` - 参照実装: \[\`packages/erc-asset-registry\`\](https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-asset-registry) @ \[\`caa9b05\`\](https://github.com/KulaDao/titled-asset-standards/commit/caa9b05) ステータス: ドラフト。eip/ファイル番号はエディター割り当て待ちのプレースホルダー (XXXX) です。 ## 議論 - メタスレッド: https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913 - 専用提案1スレッド: https://ethereum-magicians.org/t/asset-anchor-registry-interface-candidate-erc/28934 ## 参照実装 | | | |---|---| | リポジトリ | https://github.com/KulaDao/titled-asset-standards | | パッケージ | https://github.com/KulaDao/titled-asset-standards/tree/caa9b05/packages/erc-asset-registry | | セキュリティレビュー | https://github.com/KulaDao/titled-asset-standards/tree/main/docs/security | ## 著者 Chris Turner, David Hay (@david-hay), Reagan Simpson (@krumg111), Collins Musyimi (@Musyimi97)

*1件の投稿 - 1人の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/asset-anchor-registry-interface-candidate-erc/28934)
