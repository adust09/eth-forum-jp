---
title: 'ERC提案: RWA開示インターフェース'
original_title: 'ERC Proposal: RWA Disclosure Interfaces'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-proposal-rwa-disclosure-interfaces/28679'
author: parasev
date: '2026-06-02'
category: ERCs
tags:
  - ercs
  - erc
  - rwa
  - defi
  - smart-contracts
  - tokenomics
  - protocol-design
  - applications
  - economics
topic_id: '28679'
translated_at: '2026-06-08'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC Proposal: RWA Disclosure Interfaces](https://ethereum-magicians.org/t/erc-proposal-rwa-disclosure-interfaces/28679) — parasev (2026-06-02)

# 皆さん、こんにちは。

[[glossary/RWA|RWA（実世界資産）]]の開示インターフェースに関する新しい[[glossary/ERC|ERC]]を提案したいと思います。

# 概要

[[glossary/RWA|RWA]]トークンは、通常のトークンインターフェースでは公開されないオフチェーンの事実（準備金報告書、[[glossary/NAV|NAV（純資産価値）]]明細書、監査報告書、裏付け状況、グローバル供給明細書、法的文書など）に依存しています。現在、すべての発行者はこれらの事実をウェブサイト、API、ダッシュボード、PDF、IPFS、カスタムコントラクト、オラクル、または法的ポータルなど、異なる方法で公開しています。

これにより、コンポーザビリティの問題が生じます。ウォレット、エクスプローラー、ボールト、レンディングプロトコル、監査人、リスクエンジンは、次のような基本的な質問に答えるために、発行者ごとにカスタム統合を行う必要があります。

- この[[glossary/RWA|RWA]]トークンは、現在の準備金または[[glossary/NAV|NAV]][[glossary/Attestation|アテステーション]]を持っていますか？
- 誰がそれを[[glossary/Attestation|アテステーション]]しましたか？
- いつ公開されましたか？
- いつ期限切れになりますか？
- どの単位と値が報告されましたか？
- ソースレポートはどこにありますか？
- 取得したレポートまたは文書はどのハッシュと一致すべきですか？
- どの法的文書が資産または保有者の権利を規定していますか？

この[[glossary/ERC|ERC]]は、[[glossary/RWA|RWA]]向けの小さな開示プレーンを提案します。資産が真に裏付けられていることを証明するものではありません。開示が機械可読であること、タイムスタンプが付与されていること、期限が設定されていること、ハッシュにバインドされていること、帰属が明確であること、および発見可能であることを標準化します。

# 提案されたインターフェース

この提案では、3つのオプションの[[glossary/ERC-165|ERC-165]]で発見可能なインターフェースを定義します。

1.  IERCRwaDisclosureResolver

    - `assetKey`に対する開示コントラクトを見つけるためのオプションの発見インターフェース。

2.  IERCRwaAttestation

    - 最新の[[glossary/RWA|RWA]][[glossary/Attestation|アテステーション]]、[[glossary/Attestation|アテステーション]]の有効性、認可された[[glossary/Attester|アテスター]]、および裏付け状況のための読み取りインターフェース。

3.  IERCRwaDocuments

    - コンテンツアドレス指定された法的文書、文書ハッシュ、ハッシュアルゴリズム、有効期間、およびバージョン管理のための読み取りインターフェース。

現在の[[glossary/ERC-165|ERC-165]]インターフェースIDは以下の通りです。

| | インターフェース | インターフェースID | |
| --- | --- | --- | --- |
| | IERCRwaDisclosureResolver | 0xad59352f | |
| | IERCRwaAttestation | 0xd926a9ab | |
| | IERCRwaDocuments | 0xa6d47605 | |

# この[[glossary/ERC|ERC]]がしないこと

この[[glossary/ERC|ERC]]は以下のことをしません。

- 信頼性のない準備金を証明する。
- 転送制限を定義する。
- アイデンティティまたはコンプライアンスレジストリを定義する。
- オラクル構築を定義する。
- ライフサイクル/コーポレートアクションの分類を定義する。
- 分配請求または決済フローを定義する。
- 開示が法的に十分であるかどうかを決定する。

これは、[[glossary/RWA|RWA]]開示と文書アンカーのための最小限の読み取りインターフェースを標準化するだけです。

# 既存の[[glossary/ERC|ERC]]との関係

この提案は、以下のものを置き換えるのではなく、補完することを意図しています。

- [[glossary/RWA|RWA]]転送制御に焦点を当てた[[glossary/ERC-7943|ERC-7943]]。
- アイデンティティとコンプライアンスアーキテクチャに焦点を当てた[[glossary/ERC-3643|ERC-3643]]。
- クオートオラクル読み取りに焦点を当てた[[glossary/ERC-7726|ERC-7726]]。
- セキュリティトークンエコシステムからの[[glossary/ERC-1643|ERC-1643]]スタイルの文書管理のアイデア。
- [[glossary/ERC-7578|ERC-7578]]、[[glossary/ERC-6956|ERC-6956]]、[[glossary/ERC-7092|ERC-7092]]、[[glossary/ERC-3475|ERC-3475]]、[[glossary/ERC-3525|ERC-3525]]などの資産固有の標準。

意図されたギャップは開示レイヤーです。これは、インテグレーターが[[glossary/RWA|RWA]]準備金、[[glossary/NAV|NAV]]、監査、裏付け、供給、および法的文書の開示に関するメタデータを読み取り、検証するための共通の方法を提供します。
