---
title: 'ERC-8348: ファイナンシャルリース'
original_title: 'ERC-8348: Financial Lease'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8348-financial-lease/29076'
author: javierpmateos
date: '2026-07-23'
category: ERCs
tags:
  - ercs
  - erc
  - defi
  - smart-contracts
  - tokenomics
  - protocol-design
  - real-world-assets
topic_id: '29076'
translated_at: '2026-07-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8348: Financial Lease](https://ethereum-magicians.org/t/erc-8348-financial-lease/29076) — javierpmateos (2026-07-23)

皆さん、こんにちは。

私たちはトークン化されたファイナンシャルリースを構築してきましたが、常に同じ問題に直面していました。それは、リース契約をオンチェーンで公開する標準的な方法がないため、すべての統合がカスタムアダプターになってしまうことです。そこで、私たちはそのための[[ERC|ERC（Ethereum Request for Comments）]]をドラフトし、ethereum/ERCs にプルリクエストを出す前に、ここで設計の健全性を確認したいと考えています。

簡単なスコープノート：「ファイナンシャルリース」とは、信用供与手段（貸し手が資産に資金を提供し、借り手が分割払いを支払い、通常は最後に購入オプションが付く）を意味し、[[NFT|NFT]]レンタルではありません。[[ERC-4907]]は一時的な使用権をうまく扱いますが、分割払い、延滞、購入オプション、または譲渡の概念がありません。[[ERC-3643]]や[[ERC-7943]]のようなコンプライアンス標準は、トークンを「誰が」保有できるかを決定するものであり、リースが「何であるか」を決定するものではありません。そして、最近の[[権利証付き資産インフラ|権利証付き資産ファミリー]]（[[ERC-8325]]〜[[ERC-8330]]）は、資産レイヤー（バインディング、ドキュメント、コンプライアンスログ、[[NAVの鮮度/陳腐度|NAV]]）をカバーしていますが、その上に書かれる信用契約はカバーしていません。私たちが標準化を提案しているのは、この契約レイヤーです。

このアプローチは[[ERC-4626]]から自由に借用しています。つまり、手段を考案するのではなく、それを照会および観測する方法を標準化するということです。セマンティクスは、UNIDROIT国際ファイナンシャルリース条約（1988年）およびIFRS 16の用語に従っており、特定の国の法律について議論することなく、インターフェースを管轄区域に中立に保ちます。

主な設計上の決定とその理由：

**貸し手のポジションをERC-721として、`tokenId == leaseId`とする。** リースを譲渡したり、ポートフォリオを証券化したりすることが[[NFT|NFT]]転送になるため、既存のマーケットプレイス/カストディ/ボールトツールは変更なしで機能します。コンプライアンスフックは転送パスに属し、このインターフェースには属しません。

**スケジュールは支払いトークンではなく、会計単位で記述する。** これは実務上非常に重要です。最大のリース市場のいくつかでは、契約がインフレ指数連動型（アルゼンチンのUVA、チリのUF、ブラジルのIPCA連動型）であるため、固定トークン金額のスケジュールは単純に誤りです。私たちの設計では、スケジュールは抽象的な単位で不変であり、`convertToAssets` / `convertToUnits` は、照会時にリースごとのオラクルを介して[[ERC-20]]支払い資産に解決されます。固定金利リースは単なる退化ケースであり、同一変換、`oracle == address(0)`となります。丸め方向は規範的（チャージアップ、クレジットダウン — [[ERC-4626]]のインフレ攻撃を皆覚えているでしょう）であり、すべての`PaymentReceived`イベントは適用された変換レートを記録するため、オラクル履歴を必要とせずに過去の支払いを監査できます。

**2段階の延滞ティア。** `InArrears`は客観的です。支払期日が過ぎても未払いであり、オンチェーンで計算可能です。`InDefault`は、権限のある宣言者による正式な行為です。なぜなら、多くの管轄区域では、デフォルトが法的効力を持つ前に通知または猶予期間を要求しているからです。この標準は両方を記録し、現地法については立場を取りません。

リースされた資産自体がトークン化されている場合のためのオプションの拡張（`IFinancialLeaseAssetBound`）もあります。リース契約は資産トークンを[[エスクロー|エスクロー]]し、`exercisePurchaseOption()`は[[アトミック決済|アトミックに決済]]され、デフォルト時の差し押さえは意図的に自動ではありません。権限のある呼び出しと設定可能なタイムロックが必要であり、オンチェーン機能が法的権限を上回らないようにします。資産が[[ERC-4907]]を実装している場合、借り手は期間中`user`として設定されます。また、資産が[[権利証付き資産インフラ|権利証付き資産]]である場合、`assetReference`は[[ERC-8325]]の`anchorId`である可能性があり、`agreementHash`は単一のドキュメントではなく[[ERC-8326]]のドキュメントバンドルにコミットする可能性があります。

簡略化されたコアインターフェース：

```solidity
interface IFinancialLease {
    function jurisdiction(uint256 leaseId) external view returns (bytes2);
    function agreementHash(uint256 leaseId) external view returns (bytes32);
    function denomination(uint256 leaseId) external view returns (string memory symbol, address oracle);
    function convertToAssets(uint256 leaseId, uint256 units) external view returns (uint256);
    function paymentAt(uint256 leaseId, uint256 i) external view returns (uint256 units, uint64 dueDate, bool paid);
    function outstandingUnits(uint256 leaseId) external view returns (uint256);
    function nextPayment(uint256 leaseId) external view returns (uint256 assets, uint64 dueDate);
    function arrears(uint256 leaseId) external view returns (uint256);
    function status(uint256 leaseId) external view returns (LeaseStatus);
    function pay(uint256 leaseId, uint256 assets) external;
    function exercisePurchaseOption(uint256 leaseId) external;
    // + events: LeaseCreated, PaymentReceived, DefaultDeclared, ...
}
```

完全なドラフトとリファレンス実装（Foundryテスト、モックインデックスオラクル）は作成済みです。プルリクエストが公開され次第、このスレッドにリンクを貼ります。

私たちが本当に不確実であり、意見をいただきたい点：

1.  **支払い帰属。** 罰金/利息/元本の順序は意図的に未指定にしました。一部の管轄区域では強制的な法律であるため、1つの順序を標準に組み込むと、どこかでコンプライアンスが破綻する可能性があります。`pay()`は、オフチェーンで任意の帰属を再構築するのに十分なデータを出力します。これは許容される過小仕様でしょうか、それとも実装の順序を公開するオプションのビューを追加すべきでしょうか？

2.  **オラクルの陳腐度。** 陳腐度を観測可能（`conversionRateAsOf`）かつ文書化することを要求していますが、ポリシーは義務付けていません。インデックスオラクルについては、[[ERC-8330]]の公開陳腐度と評価陳腐度の区別を採用することを検討しています。標準は観測可能性を超えて踏み込むべきでしょうか？

3.  **借り手のポジション。** 貸し手側は[[NFT|NFT]]ですが、借り手は単に割り当て関数を持つアドレスです。借り手のポジションもトークン化すれば、リース・トゥ・オウンのセカンダリーマーケットが可能になりますが、コンプライアンスの範囲が2倍になります。v1でそれだけの価値があるか、それともスコープクリープでしょうか？

4.  **先行技術。** [[ERC-4907]]、[[ERC-2615]]、[[ERC-3475]]、[[ERC-3525]]、[[ERC-4626]]、[[ERC-3643]]、[[ERC-7943]]、および[[権利証付き資産インフラ|権利証付き資産ファミリー]]（[[ERC-8325]]〜[[ERC-8330]]）をレビューしました。最も近いのは[[ERC-2615]]（2020年からの停滞した[[Draft|ドラフト]]）で、レンタル/抵当の役割と[[ERC-721]]への留置権を追加しますが、信用セマンティクスはありません。スケジュール、インデックス付き通貨単位、延滞モデル、購入オプションもありません。[[ERC-3475]]は、指名された当事者との二者間契約、正式なデフォルト、資産[[エスクロー|エスクロー]]ではなく、ファンジブルな債務証券（クラス/ナンス、償還重視）を標準化しています。[[権利証付き資産インフラ|権利証付き資産ファミリー]]は資産レイヤーを標準化しており、契約レイヤーではありません。むしろ、そこには構成要素が見られます（リースデフォルトイベントを[[ERC-8328]]エントリとして、ポートフォリオ[[NAVの鮮度/陳腐度|NAV]]を[[ERC-8330]]経由で）。2022年の「Financial Primitive Standard」スレッドは、汎用トークン会計を提案しましたが、[[ERC|ERC]]にはなりませんでした。何か見落としているものはありますか？

5.  **[[権利証付き資産インフラ|権利証付き資産レイヤー]]との構成。** 主体識別子（`leaseId` vs [[ERC-8325]] `anchorId`）は慣例によって整合可能であるべきでしょうか？また、[[ERC-8330]]のリースポートフォリオ[[NAVの鮮度/陳腐度|NAV]]プロファイルを指定する価値はありますか？

これらのいずれかが間違っていると指摘されても構いません…それがこのスレッドの目的です。

*2件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8348-financial-lease/29076)
