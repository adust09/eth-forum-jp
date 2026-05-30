---
title: 'ERC: uFund - 標準化されたファンドメタデータとライフサイクルインターフェース'
original_title: 'ERC: uFund - Standardized Fund Metadata & Lifecycle Interface'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-ufund-standardized-fund-metadata-lifecycle-interface/28660
author: praveensparkout
date: '2026-05-29'
category: ERCs
tags:
  - ercs
  - applications
  - defi
  - smart-contracts
  - eip
  - protocol-design
  - rwa
  - fund-management
topic_id: '28660'
translated_at: '2026-05-30'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC: uFund - Standardized Fund Metadata & Lifecycle Interface](https://ethereum-magicians.org/t/erc-ufund-standardized-fund-metadata-lifecycle-interface/28660) — praveensparkout (2026-05-29)

## 概要 (Summary)

uFundは、トークン化された投資ファンドのための提案されたERCインターフェースです。

これは、ファンドレベルの情報を照会するための、最小限で読み取り中心の、ベーストークンに依存しないインターフェースを定義します。照会できる情報には以下が含まれます。

-   1株あたりのNAV（純資産価値） (Net Asset Value)
-   NAVの鮮度/陳腐度
-   ファンドのライフサイクル状態
-   宣言され、支払われた分配金
-   基本的な手数料メタデータ
-   サブスクリプション（購入）および償還（換金）期間
-   満期日

また、以下のためのオプションの拡張機能も定義します。

-   AUM（運用資産残高）レポート
-   ロックアップレポート
-   発生利回り
-   マルチクラスシェア構造
-   準備金証明のアテステーション

目標は、トークン化されたファンドと連携する必要があるDeFiプロトコル、ウォレット、インデクサー、カストディアン、およびRWA（現実資産）プラットフォームのカスタム統合作業を削減することです。

## 動機 (Motivation)

トークン化されたファンドとRWA製品は、オンチェーンで意味のある資産クラスになりつつありますが、統合は依然として断片化されています。

今日、各発行者はファンドデータを異なる方法で公開しています。

-   NAVはERC-4626スタイルのボールト計算から導出される場合があります。
-   NAVはオラクルによってプッシュされる場合があります。
-   NAVは管理者によってプッシュされる場合があります。
-   分配金はカスタムイベントまたはオフチェーンレコードを通じて表現される場合があります。
-   ライフサイクル状態はまったく標準化されていない場合があります。
-   準備金証明データは発行者固有の場合があります。

ウォレット、インデクサー、レンディングプロトコル、カストディアン、ダッシュボード、RWAアグリゲーターなどのインテグレーターにとって、これはファンドごとにカスタムアダプターが必要になることが多いことを意味します。

uFundは、発行者が基盤となるトークンモデル、コンプライアンスシステム、カストディシステム、またはサブスクリプション/償還アーキテクチャを変更することを強制することなく、一般的なファンドのメタデータとライフサイクルインターフェースを標準化しようとします。

## 設計目標 (Design Goals)

この提案は意図的に以下の特徴を持ちます。

-   読み取り中心 (read-heavy)
-   ベーストークンに依存しない (base-token-agnostic)
-   ERC-20、ERC-4626、ERC-7540、ERC-7575、ERC-3643、およびERC-7943スタイルのシステムと互換性がある
-   必須コアは最小限 (minimal in the mandatory core)
-   オプションのインターフェースを通じて拡張可能 (extensible through optional interfaces)
-   特権/管理者書き込み機能については非規範的 (non-prescriptive on privileged/admin write functions)

## コアインターフェース (Core Interface)

必須コアは以下に焦点を当てています。

### NAV

-   `navPerShare()`
-   `navAsOf(uint256 timestamp)`
-   `navUpdatedAt()`
-   `navStale()`
-   `navStalenessThreshold()`
-   `valuationCurrency()`

### ライフサイクル (Lifecycle)

-   `lifecycleState()`
-   `lifecycleStateUpdatedAt()`

### 分配金 (Distributions)

-   `pendingDistributions()`
-   `lastDistribution()`
-   `nextDistributionDate()`

### 基本的なファンドパラメータ (Basic fund parameters)

-   `managementFeeBps()`
-   `performanceFeeBps()`
-   `subscriptionFeeBps()`
-   `redemptionFeeBps()`
-   `minInvestment()`
-   `subscriptionWindow()`
-   `redemptionWindow()`
-   `maturityDate()`

## イベントのみの書き込み側設計 (Events-Only Write-Side Design)

主要な設計選択の1つは、uFundが管理者書き込み関数のシグネチャを**標準化しない**ことです。

例えば、この標準は、すべての実装が以下のために同じ関数名を公開することを要求しません。

-   NAVの設定
-   ライフサイクル状態の変更
-   分配金の宣言
-   AUMの更新
-   アテステーションの公開

代わりに、実装は独自の管理者モデル、オラクルモデル、バッチプロセス、ロールシステム、マルチシグ、DAO、またはオフチェーン会計フローを自由に使用できます。

uFundが標準化するのは、対応する状態変更が発生したときに発行されなければならない**イベントストリーム**です。

これは、インテグレーターとインデクサーに、すべての発行者に同じ書き込みアーキテクチャを強制することなく、ファンドの状態変化を一貫した方法で監視する方法を提供することを意図しています。

これは、ERC-20が`Transfer`および`Approval`イベントを標準化し、ミントとバーンのメカニズムは実装固有であるのと同様の考え方です。

## 必須イベント (Required Events)

コア提案は、以下のような必須イベントを定義します。

-   `NavUpdated`
-   `LifecycleStateChanged`
-   `DistributionDeclared`
-   `DistributionPaid`
-   `DistributionCancelled`

オプションの拡張機能は、以下のような追加イベントを定義します。

-   `AUMUpdated`
-   `ShareClassAdded`
-   `AttestationPublished`

## オプションの拡張機能 (Optional Extensions)

現在のドラフトでは、より議論の余地がある、またはファンド固有の概念をオプションの拡張機能として分離しています。

### `IERC_UFUND_AUM`

AUMとAUM更新タイムスタンプを公開したいファンド向け。

### `IERC_UFUND_Lockup`

ホルダーごとのロックアップ期限情報を公開するファンド向け。

### `IERC_UFUND_Yield`

NAVの評価益とは別に、アカウントレベルの発生利回りを公開するファンド向け。

### `IERC_UFUND_MultiClass`

複数のシェアクラスを持つファンド向け。

### `IERC_UFUND_ProofOfReserves`

準備金証明または準備金アテステーションのメタデータを公開するファンド向け。

## なぜERC-4626やERC-7540だけでは不十分なのか？ (Why Not Just ERC-4626 or ERC-7540?)

ERC-4626とERC-7540はボールト/リクエストフローの標準です。これらは有用で補完的ですが、すべてのトークン化されたファンドがオンチェーンボールトとして構築されているわけではありません。

一部のトークン化されたファンドは以下を使用します。

-   パーミッション型ERC-20シェアトークン
-   オフチェーン会計
-   管理者プッシュ型NAV
-   オラクルプッシュ型NAV
-   日次配当モデル
-   価格評価益型シェアモデル
-   非同期のサブスクリプション/償還ワークフロー

uFundは、既存の標準を置き換えるのではなく、追加的で互換性があることを意図しています。

コントラクトは以下を実装できます。

-   ERC-20 + uFund
-   ERC-4626 + uFund
-   ERC-7540 + uFund
-   ERC-3643 + uFund
-   ERC-7943 + uFund

## 参照実装 (Reference Implementation)

ドラフトの参照実装は以下で入手できます。

[github.com](https://github.com/Blockchainxtech/ufund)

![ufundのGitHubリポジトリ](https://opengraph.githubassets.com/ea3550b30d212090da5d39b611017aa5/Blockchainxtech/ufund)

### [GitHub - Blockchainxtech/ufund: uFundの参照実装とツール。トークン化されたファンドのNAV、ライフサイクル、分配金、およびオプションのRWAファンドメタデータのための提案されたERCインターフェース。](https://github.com/Blockchainxtech/ufund)

この実装は非規範的であり、主に以下を示すことを目的としています。

-   コアインターフェース
-   オプションの拡張インターフェース
-   ERC-165サポート
-   必須イベントの発行
-   シンプルな管理者駆動の参照実装

## 未解決の質問 (Open Questions)

以下の点についてフィードバックをいただけると幸いです。

1.  必須コアはまだ広すぎるでしょうか、それともNAV + ライフサイクル + 分配金 + 基本的なファンドパラメータは許容可能な最小限のインターフェースでしょうか？
    
2.  AUMはオプションの拡張機能のままであるべきでしょうか、それともコアインターフェースの一部であるべきでしょうか？
    
3.  ロックアップ情報は、ホルダー固有の情報を公開する可能性があることを考えると、そもそも標準化されるべきでしょうか？
    
4.  イベントのみの書き込み側設計は許容できるでしょうか、それとも一部の書き込み関数は標準化されるべきでしょうか？
    
5.  ライフサイクル状態は、ほとんどのトークン化されたファンド/RWA製品にとって十分でしょうか？
    
6.  イベントのインデックス付きフィールドは、インデクサーや分析プラットフォームに適しているでしょうか？
    
7.  準備金証明はオプションの拡張機能のままであるべきでしょうか、それとも完全に別のERCで扱われるべきでしょうか？
    

## 次のステップ (Next Steps)

フィードバックを収集するために、まずここに投稿します。その後、議論と反復を経て、ドラフトを以下として提出する予定です。

`ERCS/erc-draft_ufund.md`

最終的なSolidityインターフェースから計算されたERC-165インターフェースIDを含めます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-ufund-standardized-fund-metadata-lifecycle-interface/28660)
