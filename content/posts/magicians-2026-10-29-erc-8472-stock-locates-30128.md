---
title: 'ERC-8472: 株式貸出確認 (Stock Locates)'
original_title: 'ERC-8472: Stock Locates'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8472-stock-locates/30128'
author: BorroMarkets
date: '2026-10-29'
category: ERCs
tags:
  - ercs
  - defi
  - economics
  - smart-contracts
  - eip
  - applications
  - tokenomics
  - account-abstraction
  - oracle
  - interoperability
  - stock-lending
  - short-selling
topic_id: '30128'
translated_at: '2026-10-30'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8472: Stock Locates](https://ethereum-magicians.org/t/erc-8472-stock-locates/30128) — BorroMarkets (2026-10-29)

貸出プラットフォームに対し、トークンを現在いくら、どのような金利で、何と引き換えに借りられるかを確認します。

これはRobinhood Chain上の株式貸出市場であるBorroからの[[glossary/Draft|ドラフト]] [[glossary/ERC|ERC]]です。まだ番号はありませんが、このスレッドを`discussions-to`としてethereum/ERCsにプルリクエストをオープンする予定です。参照実装はデプロイされており、そのソースは検証済みです: [0xd86522162EBFc75bc3f959174be878FeD09dFc1f](https://robinhoodchain.blockscout.com/address/0xd86522162EBFc75bc3f959174be878FeD09dFc1f?tab=contract)。プルリクエストの前に、インターフェース、単位、名称に関するフィードバックを歓迎します。（BorroはRobinhoodとは提携していません。）

## 概要

この提案は、[[glossary/ERC-20|ERC-20]]トークン、とりわけ[[glossary/Tokenized-stocks|トークン化された株式]]を貸し出すあらゆるコントラクトに対する読み取りインターフェースを定義します。これにより、将来の借り手は[[glossary/short-selling|空売り]]を行う前にトークンを「貸出確認 (locate)」できます。具体的には、`amount`が現在借りられるか、最大でいくら借りられるか、借入前と借入直後の金利、新規借り手が差し入れる[[glossary/collateral|担保]]とその[[glossary/LTV|LTV（ローン・トゥ・バリュー）]]上限、そして借入が行われるコントラクトと市場が分かります。[[glossary/ERC-165|ERC-165]]を通じて検出可能な3つのビュー関数により、準拠するすべてのプラットフォームで同じ質問に答えることができるため、借り手、[[glossary/wallet|ウォレット]]、または[[glossary/AI-agents|エージェント]]はそれぞれ1回の呼び出しで複数のプラットフォームを比較できます。

## 動機

証券貸付において、[[glossary/short-seller|空売り者]]は株式を売却する前にその株式を貸出確認 (locate) する必要があります。貸し手は株式が借りられることを確認し、手数料を提示します。[[glossary/Tokenized-stocks|トークン化された株式]]は現在オンチェーンで取引および貸付が行われており、それらの貸出プラットフォームは、空売り者が必要とするあらゆる詳細において異なります。例えば、いくら自由に借りられるか、金利がどのように提示されるか（秒あたり、年あたり、単利か複利か）、借入によって供給が減少するにつれて金利がどのように変動するか、どのような[[glossary/collateral|担保]]が取られ、その上限は何か、そしてどのコントラクトを呼び出すべきか、などです。各プラットフォームはこれらを独自の形式で、あるいは複数のコントラクトにまたがって回答するため、それらを比較するには各プラットフォーム固有のコードが必要になります。

これは自動化された借り手にも当てはまります。株式を[[glossary/short-selling|空売り]]したい、あるいは何らかの理由でトークンを借りたい[[glossary/AI-agents|エージェント]]は、すべてのプラットフォームに同じ質問をして、その回答をランク付けできるべきです。重要な金利は借入後の金利です。利用率に応じて金利が変動するプラットフォームは、借入によって供給が減少するにつれてより多くの手数料を請求するため、低い金利で供給が少ないプラットフォームは、高い金利で供給が豊富なプラットフォームよりも、大量の借入ではコストが高くなる可能性があります。

この提案は、その質問とその回答を標準化します。借入方法自体は標準化しません。借入方法はプラットフォームによって異なります（単純な借入、同じトランザクション内で売却する借入、アカウントに保有するポジションを[[glossary/collateral|担保]]とする借入など）。回答にはコントラクトとプラットフォーム独自の市場IDが示され、借入はプラットフォーム独自のインターフェースを通じて行われます。

## 仕様

このドキュメントにおけるキーワード「MUST」、「MUST NOT」、「REQUIRED」、「SHALL」、「SHALL NOT」、「SHOULD」、「SHOULD NOT」、「RECOMMENDED」、「NOT RECOMMENDED」、「MAY」、「OPTIONAL」は、RFC 2119およびRFC 8174に記述されている通りに解釈されます。

### インターフェース

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

interface IStockLocate {
    struct Locate {
        bool borrowable;
        uint256 available;
        uint256 rateNow;
        uint256 rateAfter;
        address collateralToken;
        uint256 collateralNeeded;
        uint256 maxLtv;
        address venue;
        bytes32 market;
    }

    function locatableTokens() external view returns (address[] memory tokens);

    function maxLocate(address token) external view returns (uint256 available);

    function locate(address token, uint256 amount) external view returns (Locate memory);
}
```

準拠するコントラクトは[[glossary/ERC-165|ERC-165]]を実装し、インターフェースID `0x68b6211d`に対して`supportsInterface`から`true`を返さなければなりません (MUST)。

準拠するコントラクトは、貸出プラットフォーム自体であってもよいし、プラットフォームを読み取る別のコントラクトであってもよいです (MAY)。

### 単位

-   `available`、`amount`、`collateralNeeded`は、それらが数えるトークンの最小単位で表されます。
-   `rateNow`と`rateAfter`は、秒あたり、単利（複利ではない）、10^18でスケールされた借入金利です。金利`r`は、その金利で毎秒`r / 10^18`ずつ負債が増加することを意味します。年間の単利は`r * 31536000`です。
-   `maxLtv`は10^18でスケールされた比率です。10^18は100%です。

### `locatableTokens`

`maxLocate`がゼロより大きい値を返すことができるすべてのトークンを返さなければなりません (MUST)。現在借りることができないトークン（一時停止された市場、利用可能な供給がないなど）を返してもよいです (MAY)。リバートしてはなりません (MUST NOT)。

### `maxLocate`

現在のブロックで`venue`を通じて借りられる`token`の最大量を返さなければなりません (MUST)。これは、あらゆる`amount`に対する`locate(token, amount)`の`available`フィールドと同じ値です。コントラクトが貸し出さないトークン、および貸し出すが現在貸し出しを拒否するトークン（例えば、一時停止された市場）に対しては0を返さなければなりません (MUST)。リバートしてはなりません (MUST NOT)。

### `locate`

いかなる`token`および`amount`に対しても、リバートしてはなりません (MUST NOT)。コントラクトが貸し出さないトークンの場合、すべてのフィールドはゼロでなければなりません（アドレスはゼロアドレス、`borrowable`は`false`）(MUST)。

それ以外の場合、現在のブロックにおいて：

-   `borrowable`は、`amount`の借入が`venue`から`market`を通じて、プラットフォームにポジションを持たない借り手が`collateralToken`の`collateralNeeded`を差し入れる以外の変更なしに成功する場合にのみ`true`でなければなりません (MUST)。`amount`がゼロまたは`available`より大きい場合は`false`でなければなりません (MUST)。
-   `available`は`maxLocate(token)`と等しくなければなりません (MUST)。
-   `rateNow`は、新規借入がない状態で、現在のブロック以降にこの市場の借入に対してプラットフォームが請求する金利でなければなりません (MUST)。プラットフォームが次に呼び出されたときに金利を更新したり利息を計上したりする場合、`rateNow`はその更新後の金利でなければなりません (MUST)。
-   `rateAfter`は、現在のブロックで行われた`amount`の借入、または`amount`が`available`より大きい場合は`available`の借入の直後に、プラットフォームがこの市場の借入に対して請求する金利でなければなりません (MUST)。借入額に金利が依存しないプラットフォームの場合、`rateAfter`は`rateNow`と等しくなります。`available`がゼロの場合、`rateAfter`は`rateNow`と等しくなります。
-   `collateralToken`は、借り手がこの借入の[[glossary/collateral|担保]]として`venue`に渡すトークンでなければなりません (MUST)。プラットフォームが別の形式で[[glossary/collateral|担保]]を保持する場合（例えば、トークンを預け入れるボールトのシェアなど）、`collateralToken`は借り手が渡すトークンであり、`collateralNeeded`はそのトークンの数を数えます。
-   `collateralNeeded`は、プラットフォームにポジションを持たない借り手が差し入れた場合、現在のブロックで`amount`の借入がプラットフォーム独自の[[glossary/collateral|担保]]チェックを通過し、プラットフォームの制限に達する最小の`collateralToken`量でなければなりません (MUST)。`amount`がゼロの場合はゼロでなければなりません (MUST)。`borrowable`が`false`であっても（`amount`が`available`より大きいため）、`amount`に対して計算されなければなりません (MUST)。プラットフォームが[[glossary/collateral|担保]]を評価できない場合（例えば、その価格ソースが価格を報告しない場合）、`type(uint256).max`でなければなりません (MUST)。
-   `maxLtv`は、プラットフォームがポジションをクローズまたは清算する可能性のある、負債の価値に対する[[glossary/collateral|担保]]の価値の比率でなければなりません (MUST)。
-   `venue`は借入が行われるコントラクトでなければならず (MUST)、`market`は`token`が借りられる市場に対するプラットフォーム独自の識別子、またはプラットフォームがトークンごとに1つの市場を持つ場合はゼロでなければなりません (MUST)。`venue`を呼び出す方法は、この提案の範囲外です。

プラットフォームが複数の市場から`token`を貸し出す場合、`locate`は、`amount`以上の`available`を持つ市場の中で、`amount`に対する`rateAfter`が最も低い市場について回答すべきです (SHOULD)。それ以外の場合は、最も`available`が多い市場について回答すべきです (SHOULD)。

## 理論的根拠

**[[glossary/flash-loan|フラッシュローン]]貸し手の形。** [[glossary/ERC-3156|ERC-3156]]は[[glossary/flash-lender|フラッシュレンダ―]]に`maxFlashLoan(token)`と`flashFee(token, amount)`の2つの質問をし、ローン自体は別の呼び出しに任せています。この提案は、通常の貸し手に対して同じ2つの質問、`maxLocate(token)`と`locate(token, amount)`を行い、さらにオープンな状態を維持する借入に必要なもの、すなわち金利とその変動、および[[glossary/collateral|担保]]を追加します。

**1つの構造体、1回の呼び出し。** 複数のプラットフォームを比較する借り手は、同じブロックからのすべての数値を1回の呼び出しで取得したいと考えます。構造体を使用することで、回答を1つの戻り値にまとめ、インターフェースを3つの関数に保つことができます。

**秒あたり、単利、10^18スケール。** イーサリアム上のほとんどの変動金利貸し手は金利を秒あたりで保持しており、秒あたりの単利は、読み手が望むあらゆる年間数値に曖昧さなく変換できます。例えば、年間単利は`r * 31536000`、年間複利は`exp(r * 31536000) - 1`です。対照的に、年間数値は複利と単利の両方で提供され、誤読しやすいです。

**借入後の金利。** 利用率に応じて金利が変動するプラットフォームは、借入によって供給が減少するにつれてより多くの手数料を請求します。借入前の金利だけでは、供給に対して大きな借入の場合、プラットフォームを誤ってランク付けしてしまいます。借入後の金利は限界費用であり、`available`と合わせて、借り手は複数のプラットフォームに借入を分割することができます。

**次回の更新後の金利。** 一部の金利モデルは、利用状況だけでなく時間とともに変動し、市場が次に触れられたときに更新されます。保存された状態から読み取られた金利は、最後の更新からの平均金利であり、現在からの金利ではない可能性があります。この仕様は、新規借入が支払うことになる現在からの金利を要求します。

**上限付きの[[glossary/collateral|担保]]と、その上限。** プラットフォームのチェックを通過する最小の[[glossary/collateral|担保]]は正確であり、複数のプラットフォーム間で比較可能です。正確にその額を差し入れると、価格変動の余地がなくなるため、回答には`maxLtv`も含まれ、証拠金は借り手に委ねられます。借り手はポジションをどれくらいの期間保持するつもりかを知っているからです。

**どこから借りるか、ではなく、どう借りるか。** 借入インターフェースは、借入前の質問よりも多様です。一部のプラットフォームは呼び出し元に貸し出し、一部は借り手ごとにアカウントを通じて貸し出し、一部は[[glossary/short-selling|空売り]]を開始するために同じトランザクションでトークンを売却します。以前の共有借入・供給インターフェースの提案は進展しませんでした。借入前の質問を標準化し、プラットフォームとその市場を指し示すことで、アグリゲーターや[[glossary/AI-agents|エージェント]]は、プラットフォームに貸出方法の変更を求めることなく、共通の読み取り機能を得ることができます。

**貸出確認 (locate) は保有ではない。** 証券貸付において、貸出確認 (locate) は、借り手のために一定期間株式を確保することができます。オンチェーンでは、どの借り手も次のブロックで利用可能な供給を取ることができ、供給を確保するにはエスクローとその手数料が必要になります。この提案は、現在のブロックで借りられるものを報告し、何も予約しません。保有を提供するプラットフォームは、独自のインターフェースを通じてそれを行うことができます。

**あらゆる貸出トークン。** このインターフェースは、プラットフォームが貸し出すあらゆる[[glossary/ERC-20|ERC-20]]トークンに機能します。[[glossary/Tokenized-stocks|トークン化された株式]]は、[[glossary/short-seller|空売り者]]が売却前に貸出確認 (locate) を必要とするため、この提案の動機となるケースです。

**関連作業。** [[glossary/ERC-4626|ERC-4626]]はボールトの貸し手側を標準化しており、借り手の質問ではありません。[[glossary/ERC-7726|ERC-7726]]は価格提示を標準化しており、読み手はこれを使用して`collateralNeeded`と`available`を共通の単位で評価できます。[[glossary/Tokenized-investment-funds|トークン化投資ファンド]]の運用状況（参照市場が開いているか停止しているかなど）に関する提案は、[[glossary/short-seller|空売り者]]がこの質問と並行して行う質問に答えます。[[glossary/AI-agent-verification-stack|エージェントID]]への信用枠に関する提案は、IDへの無[[glossary/collateral|担保]]貸付をカバーしますが、この提案は誰でもトークンを[[glossary/collateral|担保]]付きで借りることをカバーします。

## 参照実装

`BorroStockLocator`のデプロイは、Robinhood Chain（チェーンID 4663）の`0xd86522162EBFc75bc3f959174be878FeD09dFc1f`で稼働しており、そのソースはSourcifyとBlockscoutで検証済み（完全一致）です。これは読み取り専用の[[glossary/adapter|アダプター]]であり、オーナーも独自のストレージもアップグレードするものもありません。

`BorroStockLocator`はBorroの株式貸出市場の貸出確認 (locates) に応答します。各市場は、Morpho Blueとそのアダプティブカーブ金利モデルを使用して、USDG貸出ボールトのシェアを[[glossary/collateral|担保]]として1つの[[glossary/Tokenized-stocks|トークン化された株式]]を貸し出します。借入はBorroのショートコントラクト（`venue`）を通じて行われ、USDGを受け取り、それをボールトに預け入れ、借り手自身のアカウントで借入を行います。

-   `available`は、Morpho Blueが借入開始時に計上する利息を差し引いた市場の供給量から借入量を引いたものであり、ショートコントラクトが市場を一時停止または非上場にしている間はゼロです。
-   `rateNow`と`rateAfter`は、アダプティブカーブモデル独自の算術から導き出されます。これは、市場が次に利息を計上するときにモデルが移行する目標金利（最後の更新からの利用率と経過時間から計算）であり、借入前と借入後の利用率におけるカーブ上の金利です。
-   `collateralNeeded`は、市場の[[glossary/oracle|オラクル]]価格と清算制限において、`amount`（借入シェアを切り上げたもの）に対してMorpho Blueがカウントする負債をカバーするボールトシェアをミントするUSDGです。

このコントラクトにはオーナーがなく、何も保有せず、状態も変更しません。その完全なソースは当該アドレスで検証されており、その金利ライブラリがMorphoのIRMに従うためGPL-2.0-or-laterの下で公開されています。そのため、この提案のアセットではなく、そちらに置かれています。そのソースからの貸出確認 (locate) に応答する関数は、CC0の下でここにリリースされています。

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity 0.8.28;

function _locate(address token, uint256 amount) internal view returns (Locate memory q) {
    bytes32 id = marketOf[token];
    if (id == bytes32(0)) return q;
    MarketParams memory p = morpho.idToMarketParams(Id.wrap(id));
    (MarketParams memory listed,,, bool paused,) = short.deskOf(id);
    bool open = listed.loanToken == token && !paused;

    (uint256 supplied,, uint256 borrowed, uint256 borrowShares) = morpho.expectedMarketBalances(p);
    uint256 free = supplied > borrowed ? supplied - borrowed : 0;
    q.available = open ? free : 0;

    Market memory m = morpho.market(Id.wrap(id));
    int256 rat = AdaptiveCurveRate.rateAtTargetAfter(
        IAdaptiveCurveIrm(irm).rateAtTarget(Id.wrap(id)),
        AdaptiveCurveRate.utilizationOf(m.totalSupplyAssets, m.totalBorrowAssets),
        block.timestamp - m.lastUpdate
    );
    uint256 draw = amount < q.available ? amount : q.available;
    q.rateNow = AdaptiveCurveRate.curve(rat, AdaptiveCurveRate.utilizationOf(supplied, borrowed));
    q.rateAfter = AdaptiveCurveRate.curve(rat, AdaptiveCurveRate.utilizationOf(supplied, borrowed + draw));

    q.borrowable = open && amount != 0 && amount <= free;
    q.collateralToken = usdg;
    q.collateralNeeded = amount == 0 ? 0 : _usdgToBorrow(p, amount, borrowed, borrowShares);
    q.maxLtv = p.lltv;
    q.venue = address(short);
    q.market = id;
}
```

## セキュリティに関する考慮事項

**貸出確認 (locate) は読み取りであり、約束ではない。** すべてのフィールドは現在のブロックに対して有効です。別の借り手、返済、貸し手による引き出し、または価格更新により、次のブロックですべてが変更される可能性があります。借り手は借入自体を（プラットフォーム独自の最小値と最大値によって、または借入後にポジションを確認することによって）制限しなければならず (MUST)、以前のトランザクションで読み取られた貸出確認 (locate) に依存してはなりません (MUST NOT)。

**[[glossary/oracle|オラクル]]ではない。** 利用可能な供給と利用率は、例えば[[glossary/flash-loan|フラッシュローン]]などによって1つのトランザクション内で移動できるため、`available`、`rateNow`、`rateAfter`はトランザクションの期間中押し上げられる可能性があります。コントラクトは、他の当事者が制御する状態と同じトランザクションで読み取られた貸出確認 (locate) に基づいて価値を移動させてはなりません (MUST NOT)。

**上限での[[glossary/collateral|担保]]。** `collateralNeeded`と全く同じ額の[[glossary/collateral|担保]]で開かれたポジションは、プラットフォームの制限にあり、わずかな価格変動で清算される可能性があります。借り手はより多くの額を差し入れ (SHOULD)、`maxLtv`とポジションを保持する期間から証拠金を決定すべきです (SHOULD)。

**[[glossary/Tokenized-stocks|トークン化された株式]]の価格。** `collateralNeeded`はプラットフォームの価格ソースを使用します。[[glossary/Tokenized-stocks|トークン化された株式]]の参照市場が閉じている間、価格ソースは最後の価格を保持し、再開時の価格は大きく異なる可能性があります。借り手は、市場が閉じる近くで`collateralNeeded`に依存する前に、トークンの市場状況を確認すべきです (SHOULD)。

**金利の急騰。** 利用率に応じて変動する金利は、他の借り手による借入や貸し手による引き出しの後、借入後に大きく変動する可能性があります。`rateAfter`は借入直後の金利であり、負債の期間中固定される金利ではありません。

**多数のプラットフォームの読み取り。** 多数のコントラクトで`locate`を呼び出すアグリゲーターは、準拠するコントラクトがすべての回答を安価に提供できるわけではないため、各呼び出しのガスを制限すべきであり (SHOULD)、戻り値の形式を信頼する前に`supportsInterface`を確認すべきです (SHOULD)。

**読み取りコントラクトへの信頼。** プラットフォーム自体ではなく、プラットフォームを読み取るコントラクトは、誤った報告をする可能性があります。読み手は、プラットフォームが公開した読み取りコントラクトを使用するか (SHOULD)、そのソースをプラットフォームのコントラクトと照合して検証すべきです (SHOULD)。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8472-stock-locates/30128)
