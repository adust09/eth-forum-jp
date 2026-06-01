---
title: 'ERC-8278: サービスオブジェクト'
original_title: 'ERC-8278: Service Objects'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8278-service-objects/28659'
author: MeltedMindz
date: '2026-05-28'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - applications
  - payments
  - protocol-design
  - service-objects
topic_id: '28659'
translated_at: '2026-05-30'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8278: Service Objects](https://ethereum-magicians.org/t/erc-8278-service-objects/28659) — MeltedMindz (2026-05-28)

サービスオブジェクトのための小さなERC-721拡張についてフィードバックをいただきたいです。

概要

この提案は、サービスオブジェクトのための最小限のERC-721互換インターフェースを定義します。サービスオブジェクトとは、オフチェーンサービスに対する制御を表す譲渡可能なトークンです。このインターフェースは、サービスマニフェスト、サービスオペレーター、および支払いルートを公開し、ウォレット、インデクサー、マーケットプレイス、クライアントがサービスとやり取りする前に、その現在の運用状態を解決できるようにします。

この提案は、サービスディスカバリ、レピュテーション、実行、支払い決済、スマートアカウントの挙動、MCPセマンティクス、またはx402セマンティクスを定義しません。

問題

ERC-721は所有権と譲渡のセマンティクスを提供しますが、トークンによって表されるサービスに関する運用上の質問に答える標準的な方法を提供しません。

現在、サービスマーケットプレイス、APIプロバイダー、エージェントレジストリ、および支払いミドルウェアはそれぞれ、独自のメタデータ形式と支払いルートの慣習を定義しています。

その結果、ウォレット、クライアント、およびインデクサーは、基本的な質問に確実に答えることができません。

-   どのマニフェストが現在このサービスを記述していますか？
-   どのオペレーターが現在その操作を許可されていますか？
-   有料エンドポイントはどの支払いルートを使用すべきですか？
-   クライアントが最後に確認してから支払いルートは変更されましたか？

共通インターフェースの欠如は、サービス指向アプリケーション全体に断片化を生み出し、汎用インフラストラクチャがそれらをサポートすることを困難にしています。

提案されるプリミティブ

提案されるインターフェースは意図的に小さく設計されています。

```
interface IERCServiceObject is IERC165 {
    event ServiceManifestUpdated(
        uint256 indexed serviceId,
        string uri,
        bytes32 indexed manifestHash
    );

    event ServiceOperatorUpdated(
        uint256 indexed serviceId,
        address indexed operator,
        uint64 expiresAt
    );

    event ServicePaymentRouteUpdated(
        uint256 indexed serviceId,
        address indexed revenueRecipient,
        string paymentURI,
        bytes32 indexed paymentManifestHash,
        uint64 routeNonce
    );

    function serviceManifest(uint256 serviceId)
        external
        view
        returns (string memory uri, bytes32 manifestHash);

    function serviceOperator(uint256 serviceId)
        external
        view
        returns (address operator, uint64 expiresAt);

    function servicePaymentRoute(uint256 serviceId)
        external
        view
        returns (
            address revenueRecipient,
            string memory paymentURI,
            bytes32 paymentManifestHash,
            uint64 routeNonce
        );
}

```

現在の短縮インターフェースID:

```
0xf94c99e5

```

非目標

この提案は以下を定義しません。

-   サービスディスカバリ
-   レピュテーションシステム
-   検証システム
-   支払い決済
-   エンドポイント実行
-   エスクロー
-   収益分配
-   サブスクリプション
-   スマートアカウントモジュール
-   MCPランタイムの挙動
-   x402支払いセマンティクス
-   サービス品質保証

MCPとx402はマニフェストを通じて参照される可能性がありますが、どちらもこの[[glossary/EIP|EIP（Ethereum 改善提案）]]によって必須とされるものではありません。

既存の標準との関係

ERC-721

この提案は、ERC-721の所有権と譲渡のセマンティクスを再利用します。所有権を再定義するものではありません。

ERC-7656

ERC-7656は、汎用的なコントラクトリンク型サービスとリンク型インフラストラクチャを扱います。

この提案は、サービスオブジェクトの状態に焦点を当てています。

-   サービスマニフェスト
-   サービスオペレーター
-   支払いルート

将来のERC-7656リンク実装は、同じインターフェースを公開する可能性があります。

ERC-8004

ERC-8004は、エージェントのアイデンティティ、検証、およびレピュテーションに焦点を当てています。

この提案は、アイデンティティ、信頼、レピュテーション、または登録を定義しません。運用サービス状態のみを定義します。

ERC-6551, ERC-4337, ERC-7579, ERC-6900

これらの標準は、トークン結合アカウント、アカウント抽象化、およびスマートアカウント実行を扱います。

サービスアカウントは有用な拡張となる可能性がありますが、最小限のインターフェースからは意図的に除外されています。

リポジトリ

リポジトリ:
[https://github.com/MeltedMindz/erc-service-object](https://github.com/MeltedMindz/erc-service-object)

最小限のドラフト:
[https://github.com/MeltedMindz/erc-service-object/blob/main/docs/ERC-draft-minimal.md](https://github.com/MeltedMindz/erc-service-object/blob/main/docs/ERC-draft-minimal.md)

堅牢化レビュー:
[https://github.com/MeltedMindz/erc-service-object/blob/main/docs/final-hardening-review.md](https://github.com/MeltedMindz/erc-service-object/blob/main/docs/final-hardening-review.md)

リファレンス実装:
[https://github.com/MeltedMindz/erc-service-object/tree/main/src](https://github.com/MeltedMindz/erc-service-object/tree/main/src)

レビューのための質問

1.  これは、以下のうちどれとして最も適切に位置づけられるでしょうか。
    -   ERC-721拡張
    -   ERC-7656プロファイル
    -   またはその両方
2.  `serviceOperator`は基本インターフェースに必要でしょうか、それともオペレーターの状態は別の拡張を通じて処理されるべきでしょうか？
3.  支払いルート情報には収益受取人を含めるべきでしょうか、それともルートディスカバリと受取人ディスカバリは分離されるべきでしょうか？
4.  `routeNonce`は、古い支払いルートやキャッシュされた支払いオファーを検出するための正しいプリミティブでしょうか？
5.  ERC-1155のサポートは、基本提案の範囲外のままであるべきでしょうか？
6.  署名付き利用レシートは、この提案に含めるのではなく、コンパニオン[[glossary/EIP|EIP]]として別途標準化すべきでしょうか？

特に、ERC-7656、ERC-8004、ウォレット、マーケットプレイス、インデクサー、スマートアカウント、x402インフラストラクチャ、およびMCPツールに取り組んでいる実装者からのフィードバックに興味があります。

[[glossary/EIP|EIP]] PR: [Add ERC: Service Objects by MeltedMindz · Pull Request #1777 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/1777)

*6投稿 - 2参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8278-service-objects/28659)
