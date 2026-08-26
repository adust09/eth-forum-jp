---
title: '[ERCドラフト] IBond: 固定金利債券の標準インターフェース'
original_title: '[Draft ERC] IBond: A Standard Interface for Fixed-Rate Bonds'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-erc-ibond-a-standard-interface-for-fixed-rate-bonds/29506
author: dkaj
date: '2026-08-25'
category: EIPs
tags:
  - eips
  - defi
  - economics
  - smart-contracts
  - eip
  - applications
  - tokenomics
  - rwa
  - financial-instruments
topic_id: '29506'
translated_at: '2026-08-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [[Draft ERC] IBond: A Standard Interface for Fixed-Rate Bonds](https://ethereum-magicians.org/t/draft-erc-ibond-a-standard-interface-for-fixed-rate-bonds/29506) — dkaj (2026-08-25)

# **概要**

私は、イーサリアムコミュニティが合意できる固定金利債券の標準として `IBond` を作成しました。共有された標準があれば、ウォレットなどのサードパーティが債券を追跡しやすくなり、[[glossary/EVM|EVM]]チェーン全体で取引可能な債券市場が普及するでしょう。

現時点では、最もシンプルなタイプの債券であるゼロクーポン債のインターフェースである `IBond` のみを共有しています。`IBond` は[[glossary/ERC-20|ERC-20]]を拡張しており、各債券は満期時にゼロクーポン支払いを行う[[glossary/ERC-20|ERC-20]]トークンとなります。

非常に重要な詳細として、この債券は、債券保有者がオンチェーン取引を実行することなく、機能し、ユーザーに支払いを行うことができます。その体験は証券口座と一致するはずです。債券を購入すると、自分で取引を送信することなく、自動的に支払いを受け取り、債券が償却されます。

`IBond` は、さまざまな種類の債券（クーポン、コーラブル、コンバーチブルなど）に拡張できます。

このインターフェースは、馴染みのある金融用語を使用しており、読みやすいように設計されています。目標は、[[glossary/RWA-platforms|RWAプラットフォーム]]企業や銀行による採用を促進し、固定金利金融商品がオンチェーンで普及するための共通標準を作成することです。

インターフェースがうまく機能することを証明したかったので、完全な概念実証を構築しました。そのプロセスを通じて、`IBond` を詳細に検討し、必要最小限のインターフェースに削減することができました。概念実証には以下が含まれます。

-   世界最大の債券市場でインターフェースが機能することを示すため、米国債市場全体（7兆ドル）をミラーリングしました。
    
-   最もダイナミックな債券市場の1つでインターフェースが機能することを示すため、社債型債券を発行するためのプレイグラウンドを構築しました。
    
-   コーラブル、コンバーチブル、クーポン、プッタブル、規制付き、再開可能、償還可能、およびサブスクリプション債券など、債券の以下の拡張機能を構築しました。
    
-   Base上で2,500人の保有者に対して20回のクーポン支払いを行う10年債を運用する場合、おおよそ300ドルかかると計算し、オンチェーンで実際の債券を運用することが経済的であることを示しました。
    

現時点では `IBond` のみを共有することにしました。なぜなら、それが他のすべてが依存するコアインターフェースだからです。コアが合意されるまで、残りを共有する意味はありません。

[[glossary/EIP|EIP]]ドラフトを完成させ、動作する概念実証を構築しました。正式な[[glossary/EIP|EIP]]プルリクエスト (PR) を公開する前に、コア設計と、これが適切な相互運用性の境界であるかについてフィードバックを求めています。

協力したい方がいれば、こちらにご連絡ください。目標は、すべての債券拡張機能を構築し、オープンソースとして公開することですが、それらが構築されることに真の関心がある場合にのみ、その努力を投入します。

[[glossary/EIP|EIP]]ドラフトとインターフェース: [IBond](https://github.com/davekaj/ibond)

動作する概念実証: [EVM Bonds](https://evmbonds.com)

詳細は以下に記載されています。

# **問題**

トークン化された債券は[[glossary/RWA-platforms|RWAプラットフォーム]]全体で発行されていますが、発行者、ウォレット、カストディアン、インデクサー全体で標準となる共有債券インターフェースはまだありません。

暗号資産は歴史的に独自の債券用語を使用してきましたが、これは必ずしもTradFi（伝統的金融）に優しいとは限りません。しかし、債券は本質的にTradFiが支配的であるため、この標準は銀行、証券会社、固定利回り市場で使用されている言語を採用すべきです。具体的には、発行者、額面元本、額面、発行日、満期、資金調達状況、支払いが期日通りであるか、各保有者が現在何を請求できるか、などです。

また、債券保有者に支払いを請求させることで、貧弱なユーザーエクスペリエンスを生み出してしまいました。[[glossary/EVM|EVM]]債券の保有者は何もする必要がないはずです。債券は証券口座のように機能し、支払いは自動的に入金されるべきです。

イーサリアム上で債券が普及していないのは、共有債券インターフェースの強力な試みをしてこなかったためです。今こそこれを解決すべきです。CoinbaseやMicroStrategyのような暗号資産企業はすでに伝統的な市場で債券を発行していますが、ブロックチェーン上でも発行できるべきです。いずれそうなるでしょう。

# **提案**

`IBond` は、コントラクトごとに1つの代替可能な固定金利債券シリーズのための小さなインターフェースです。これは[[glossary/ERC-20|ERC-20]]を継承しており、`IBond` は債券固有の条件、会計、サービス状態、およびアクションを標準化します。

以下に、提案されている`IBond`インターフェースの完全な内容と、その[[glossary/NatSpec|NatSpec]]を示します（灰色のウィンドウ内をスクロールしてインターフェース全体を確認してください）。

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.24;
import {IERC20Minimal} from "./IERC20Minimal.sol";

/// @title IBond
/// @notice ERC-20-compatible interface for an on-chain-settled, principal-at-maturity bond series.
interface IBond is IERC20Minimal {

enum Lifecycle {
  /// @notice Terms exist and the bond has not started regular servicing.
  Created,
  /// @notice the bond is outstanding and servicing before maturity.
  Live,
  /// @notice The bond has reached its maturity date.
  Matured,
  /// @notice No bond units remain outstanding and settlement is complete.
  Settled
}

enum PaymentStatus {
  /// @notice No due payment is currently late under the bond's payment-status rules.
  Performing,
  /// @notice A due payment is unpaid but has not reached its default condition.
  Late,
  /// @notice The payment has reached a contractual or authoritative default condition.
  Default
}

event BondUnitsIssued(address indexed issuer, address indexed receiver, uint256 principalAmount, uint256 bondUnits);
event PrincipalFunded(address indexed payer, uint256 amount, PaymentStatus indexed status);
event BondUnitsRedeemed(address indexed holder, address indexed receiver, uint256 bondUnits, uint256 principalAmount);

// -------------------------------------------------------------------------
// View functions
// -------------------------------------------------------------------------

/// @notice Returns the on-chain obligor responsible for bond payments.
function issuer() external view returns (address);

/// @notice Returns the ERC-20 token in which the bond is denominated and settled.
function asset() external view returns (address);

/// @notice Returns the maximum face principal the bond can issue and owe at maturity.
function principalCap() external view returns (uint256);

/// @notice Returns the timestamp that anchors the bond's regular servicing schedule.
function issueDate() external view returns (uint64);

/// @notice Returns the timestamp when the bond matures.
function maturityDate() external view returns (uint64);

/// @notice Returns the current lifecycle state.
function lifecycle() external view returns (Lifecycle);

/// @notice Returns the current principal payment status.
function principalPaymentStatus() external view returns (PaymentStatus);

/// @notice Returns the face principal represented by bond units counted as issued.
function issuedPrincipal() external view returns (uint256);

/// @notice Returns bond token units currently issued. Redemptions do not lower this value.
function issuedBondUnits() external view returns (uint256);

/// @notice Returns the face principal represented by one whole displayed bond token i.e. 10 ** decimals().
function denomination() external view returns (uint256);

/// @notice Returns the principal amount represented by a holder's bond token balance.
function principalOf(address holder) external view returns (uint256);

/// @notice Converts bond token units to represented principal.
function bondUnitsToPrincipal(uint256 bondUnits) external view returns (uint256);

/// @notice Converts principal amount to bond token units.
function principalToBondUnits(uint256 principalAmount) external view returns (uint256);

/// @notice Returns whether maturity principal has been fully funded for redemption.
function principalFunded() external view returns (bool);

/// @notice Returns the bond asset currently claimable by a holder.
function holderClaimable(address holder) external view returns (uint256);

// -------------------------------------------------------------------------
// State changing functions
// -------------------------------------------------------------------------

/// @notice Issues bond units under the implementation's issuance rules.
function issue(uint256 bondUnits, address receiver) external returns (uint256 principalIssued);

/// @notice Funds the exact remaining maturity principal cash for redemption.
function fundPrincipal() external returns (uint256 funded);

/// @notice Claims bond asset currently owed to the caller.
function claim(address receiver) external returns (uint256 claimed);

/// @notice Claims bond asset owed to a holder, using bond-token ERC-20 allowance.
function claimFrom(address holder, address receiver) external returns (uint256 claimed);
}
```

主に3つの状態変更操作があります。

-   `issue()` は、発行者が債券を作成し、保有者に送ることを可能にします。
-   `fundPrincipal()` は、発行者が債券を返済し、`claim()` を利用可能にすることを可能にします。
-   `claim()` と `claimFrom()` は、保有者の債券を償却し、保有者が受け取る権利のある資産を受け取ることを可能にします。`claimFrom()` は、[[glossary/ERC-20|ERC-20]] `allowance` を使用して、発行者が債券保有者のためにこれを自動的に行うことを可能にします。

2つのタイプがあります。

-   `Lifecycle` は、債券が `Created`、`Live`、`Matured`、または `Settled` のいずれであるかを表します。最初の3つの状態はタイムスタンプに基づいています。債券は `Matured` になり、すべての債券単位が償却されると `Settled` になります。
-   `PaymentStatus` は、債券が履行中であるか、支払いが遅延しているか、またはデフォルト状態であるかを表します。各債券にはその真のステータスを決定する多くの法的要因があるため、意図的にこれら3つの状態のみを使用しています。

ビュー関数は、上記の記述で自己説明的です。

オークション、サブスクリプション、クーポンスケジュール、コール、プット、コンバージョン、再開、譲渡制限、カストディ、IDシステム、法的文書、およびマーケットプレイスは、コアの範囲外です。これらのメカニズムは、債券が負うものや、統合がその状態を読み取る方法を変更することなく、多様化することができます。

# **既存のERCおよびその他の金融標準との関係**

-   [[glossary/ERC-3475|ERC-3475]]: Abstract Storage Bonds は、1つのコントラクトで複数の債券クラスとnonceを表し、メタデータモデルに大きく依存しています。`IBond` は代わりに、代替可能なシリーズごとに1つのコントラクトを使用し、主要な金融条件と会計を型付きビューとして公開します。
    
-   [[glossary/ERC-7092|ERC-7092]]: Financial Bonds は、債券固有の重要な用語とアクションを確立しました。`IBond` は、明示的な元本/単位変換、発行済みおよび流通単位の会計、個別のライフサイクルと支払い履行状態、満期元本資金調達、および保有者が請求可能な金額を定義することで異なります。
    

この提案は、完全な発行または[[glossary/RWA-platforms|RWAプラットフォーム]]プロトコルよりも意図的に範囲を狭めています。債券自体を標準化しつつ、その周りの異なるオークション、決済、コンプライアンス、カストディ、および法的アーキテクチャを可能にします。

`IBond` は、[[glossary/ACTUS|ACTUS]]の満期時元本プロファイルを、実行可能なオンチェーン資金調達と保有者決済を備えた[[glossary/ERC-20|ERC-20]]請求トークンとして、意図的に制約された形で表現します。これは、[[glossary/CMTAT|CMTAT]]のようなより広範な証券トークンフレームワークを補完します。法的文書、コンプライアンス、ID、および譲渡管理は、構成可能な拡張機能として残ります。

# **動作する概念実証**

`IBond` は実装され、テストされており、現在使用可能です。

概念実証には、ゼロクーポン債とクーポン付き債券、参照ベースの実装、および発行者による支払いサービス、バッチ処理、サブスクリプション、再開、コール、プット、コンバージョン、償還、支払いステータスウィンドウ、および規制された譲渡管理のためのオプションの拡張機能が含まれています。

[EVM Bonds](https://evmbonds.com)では、以下のことができます。

-   Base Sepolia上で実験的な社債または米国債型の債券を設定し、デプロイする。
    
-   デプロイされた社債レプリカからのライブ `IBond` 読み取りを検査する。
    
-   個々の読み取り専用債券コントラクトとしてミラーリングされたアクティブな米国短期証券を閲覧する。
    
-   機関規模で債券を配布およびサービスするためのガスモデルをレビューする。
    

サイトとコントラクトは実験的であり、監査されていませんが、提案されたインターフェースが実際のクーポン、元本、発行、サービス、償還、および再開のフロー全体で機能することを示しています。

# **範囲外**

-   プライバシー — ここではプライベートなトランザクションは考慮していません。ユーザーのIDが公開でアドレスにリンクされていない限り、トランザクションは仮名のままです。
    
-   [[glossary/KYC/AML|KYC/AML]]要件 — これらはここで実装しているもののコアではありませんが、それらの拡張機能は100%必要です。
    
-   サブスクリプション / オークション — この実装は、債券がすでに販売されており、発行者がローンチ時に設定するアドレスのリストとその債券トークン割り当てを持っていることを前提としています。サブスクリプションとオークションは最終的にはオンチェーンで行われるべきですが、これらは別の懸念事項です。
    

# **フィードバック**

インターフェースについて、何か追加または削除すべき点があるか、他のプロジェクトが同様の作業を行っているかについてフィードバックをいただければ幸いです。このスレッドにご連絡ください。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/draft-erc-ibond-a-standard-interface-for-fixed-rate-bonds/29506)
