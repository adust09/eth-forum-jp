---
title: 配当支払い型エクイティトークン
original_title: Dividend-paying equity token
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/dividend-paying-equity-token/29991'
author: this
date: '2026-10-17'
category: ERCs
tags:
  - ercs
  - erc-20
  - tokenomics
  - protocol-design
  - smart-contracts
  - economics
  - research
topic_id: '29991'
translated_at: '2026-10-17'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Dividend-paying equity token](https://ethereum-magicians.org/t/dividend-paying-equity-token/29991) — this (2026-10-17)

* * *

## title: 配当支払い型エクイティトークン
description: 1つの不変の配当資産を分配する[[glossary/ERC-20|ERC-20]]シェアトークン。スケール1は整数余りを次ラウンドに残す。10^9または2^64の大きなスケールは余りを支払う。サンプルは2^64を使用。
author: Grok4.7
status: Draft
type: Standards Track
category: [[glossary/ERC|ERC]]
created: 2026-10-17
requires: 20

# 配当支払い型エクイティトークン

このドキュメントは、[[glossary/ERC|ERC]]リポジトリ向けのアプリケーションレベルの[[glossary/ERC|ERC]]です。[[glossary/EIP-Editor|EIPエディター]]が番号を割り当てます。

中国語ドラフト: 同ディレクトリ内の ERC-draft-EquityToken.md

## 概要

[[glossary/ERC-20|ERC-20]]シェアトークン。保有者は、保有株式に比例して1つの配当資産を請求します。配当資産は構築時に固定されます。それはETHまたは1つの[[glossary/ERC-20|ERC-20]]です。ETHは`address(0)`です。

1株あたりの配当は、配当基本単位にスケール`dividendScale`を乗じた`dividendPerShare`に格納されます。1株あたりまだ割り当てられていない金額は`undistributedDividend = dividend balance + totalWithdrawn − totalDistributed`です。`totalSupply`が0より大きい場合、1株あたりの値は`undistributedDividend * dividendScale / totalSupply`だけ増加します。スケール1は余りを次ラウンドに残します。`totalSupply`がそのスケールを超えない場合、`10^9`または`2^64`のスケールは、そのラウンドで最大1つの基本単位を残します。サンプルコントラクトは`2^64`を使用します。転送、ミント、またはバーンを行う前に、両側が決済されるため、配当はその時点の保有者に残ります。

この標準は、この会計とこのインターフェースのみを規定します。税金、他の場所からの利益の引き出し、自己への転送時のバーンは実装に委ねられます。株式の小数点以下の桁数（decimals）は、配当資産の小数点以下の桁数よりも少なくすべきであり、一般的には6桁少ないのが望ましいです。

## 動機

株式と配当は2つの資産です。株式、国債、資産運用商品、その他の利回り付き証券は、この説明に当てはまります。証券はシェアトークンであり、現金利回りは配当資産です。保有者の配当は、株式を保有していた期間に連動します。後の購入者には連動しません。すべての保有者に1つのトランザクションで支払う方法は、保有者が多くなると機能しなくなります。

1株あたりの累積額は1つの整数です。各アカウントは、決済された1株あたりの値のみを記録します。転送は両側を決済します。請求は、残高に1株あたりのギャップを乗じ、スケールで割ります。直接送られた配当と`distribute`関数を通じて送られた配当は同じアカウントに入ります。

スケールは構築時に固定されます。スケール1は、整数余りを次ラウンドのためにコントラクトに残します。より大きなスケールは、同じラウンドでより多くの残高を割り当てます。`10^9`と`2^64`はどちらも十分です。サンプルは`2^64`を使用します。

[[glossary/ERC-20|ERC-20]]には、このような会計処理はありません。[[glossary/EIP|EIP]] 1726の配当支払いトークンのドラフトはETHのみを受け入れ、1株あたりの配当を固定の`2^128`倍に拡大します。この標準では、実装がスケールを選択でき、配当資産はETHまたは1つの[[glossary/ERC-20|ERC-20]]であることができます。

## 仕様

RFC 2119およびRFC 8174に記載されている通り、「MUST」、「MUST NOT」、「REQUIRED」、「SHALL」、「SHALL NOT」、「SHOULD」、「SHOULD NOT」、「RECOMMENDED」、「NOT RECOMMENDED」、「MAY」、「OPTIONAL」のキーワードを解釈します。

### 1. 用語

-   **シェアトークン**: この標準を実装する[[glossary/ERC-20|ERC-20]]。その残高は株式数です。
-   **配当資産**: 構築時に固定される単一の資産。`dividendToken()`がそれを返します。`address(0)`はETHを意味します。シェアトークンは自身の配当資産であってはなりません。
-   **スケール** `dividendScale`: 構築時に固定される整数。1以上でなければなりません。`dividendPerShare`の単位は、1株あたりの配当基本単位にこのスケールを乗じたものです。
-   **1株あたり配当** `dividendPerShare`: スケールを含む、すでに株式に割り当てられた累積値。
-   **アカウントチェックポイント** `dividendPerShareOf(account)`: そのアカウントの最後の決済時点での`dividendPerShare`。
-   **総分配額** `totalDistributed`: スケールなしで、すでに1株あたりに割り当てられた配当総額（配当基本単位）。
-   **総引き出し額** `totalWithdrawn`: 保有者がすでに引き出した配当総額（同じ単位）。
-   **未分配配当** `undistributedDividend`: このコントラクトに入り、まだ1株あたりに割り当てられていない金額（同じ単位）。

`dividendPerShare()`は、すでに書き込まれた累積値を返します。まだ割り当てられていない余りは含まれません。プレビューは、請求可能な金額を計算する場合にのみ使用されます。

```
previewPerShare =
    dividendPerShare
    + (totalSupply == 0 ? 0 : undistributedDividend * dividendScale / totalSupply)
```

### 2. 会計

実装は以下を維持しなければなりません。

```
undistributedDividend = dividendBalance + totalWithdrawn - totalDistributed
```

`dividendBalance`は、このコントラクトの配当資産の残高です。ETHは`address(this).balance`を使用します。[[glossary/ERC-20|ERC-20]]はそのトークンの`balanceOf(address(this))`を使用します。

`totalReceived()`は`dividendBalance + totalWithdrawn`と等しくなければなりません。したがって、`totalDistributed + undistributedDividend`とも等しくなります。

`totalSupply`が0より大きく、`undistributedDividend * dividendScale / totalSupply > 0`の場合、1回の割り当ては次のようになります。

```
delta       = undistributedDividend * dividendScale / totalSupply
distributed = delta * totalSupply / dividendScale
dividendPerShare += delta
totalDistributed += distributed
```

`distributed`は、その時点の`undistributedDividend`以下です。差額は余りであり、`undistributedDividend`に残ります。余りは最大で`ceil((totalSupply - 1) / dividendScale)`基本単位です。スケール1の場合、余りはその時点の`totalSupply`より厳密に少なくなります。`totalSupply`がスケールを超えない場合、余りは最大1つの基本単位です。`totalSupply`が0の場合、`dividendPerShare`は増加してはなりません。未分配額は、`totalSupply`があるまでコントラクトに残ります。

`delta`が0の場合、そのラウンドは`dividendPerShare`を増加させてはならず、`totalDistributed`を増加させてはならず、`DividendsDistributed`を発行してはなりません。

アカウントの請求可能額は次のとおりです。

```
unclaimedDividendOf(account) =
    balanceOf(account) * (previewPerShare - dividendPerShareOf(account)) / dividendScale
    + settledUnclaimed[account]
```

`settledUnclaimed`は、すでにそのアカウントに決済され、まだ引き出されていない金額です。これは個別の外部関数である必要はありません。一度も決済されていないアカウントは、`dividendPerShareOf`と`settledUnclaimed`が0に等しくなります。

### 3. インターフェース

```
interface IEquityToken is IERC20 {
    function dividendToken() external view returns (address);
    function dividendScale() external view returns (uint256);
    function dividendPerShare() external view returns (uint256);
    function dividendPerShareOf(address account) external view returns (uint256);
    function undistributedDividend() external view returns (uint256);
    function totalDistributed() external view returns (uint256);
    function totalWithdrawn() external view returns (uint256);
    function totalReceived() external view returns (uint256);
    function unclaimedDividendOf(address account) external view returns (uint256);

    /// @notice Take amount into this contract, then allocate as in section 2. amount 0 only allocates the dividend already held.
    function distributeDividends(uint256 amount) external payable;

    /// @notice Allocate first, then settle account to the current dividendPerShare.
    function settle(address account) external returns (uint256 newDividendPerShare);

    /// @notice Allocate first, then pay the caller the full amount currently claimable.
    function withdrawDividend() external returns (uint256 amount);

    event DividendsDistributed(
        uint256 indexed index,
        address indexed caller,
        uint256 undistributed,
        uint256 distributed,
        uint256 supply,
        uint256 delta,
        uint256 dividendPerShare
    );

    event DividendWithdrawn(
        address indexed account,
        address indexed to,
        uint256 amount,
        uint256 dividendPerShare
    );
}
```

`index`は1から始まり、`DividendsDistributed`ごとに1ずつ増加します。`caller`は、その割り当ての直接の呼び出し元です。転送が割り当てをトリガーする場合、`caller`はそのトランザクションの`msg.sender`です。

`DividendWithdrawn.account`は配当の所有者です。この標準の`withdrawDividend`では、`to`はその呼び出し元であり、`account`と同じアドレスです。`amount`が0の場合はこのイベントは発行されません。

### 4. 配当の受領

`distributeDividends`:

-   配当資産がETHの場合、`amount`が0であれば`msg.value`は0でなければなりません。そうでなければ`msg.value`は`amount`と等しくなければなりません。
-   配当資産が[[glossary/ERC-20|ERC-20]]の場合、`msg.value`は0でなければなりません。`amount`が0より大きい場合、実装は呼び出し元から`amount`の配当トークンをこのコントラクトにプルしなければなりません。残高の増加は`amount`以上でなければなりません。

支払い後、または`amount`が0の場合、割り当てはセクション2に従って進行します。

ETHまたは配当[[glossary/ERC-20|ERC-20]]をこのコントラクトに直接送ることは許可されています。これらの残高は`undistributedDividend`に入ります。それらを配信する転送は、割り当てを行う必要はありません。次の`distributeDividends`、`settle`、シェア転送、ミント、バーン、または`withdrawDividend`がそれらを割り当てます。

手数料を請求したり、受け取った金額を変更したり、それ自体で残高を変更したりする配当トークンは、セクション2の同一性を満たすことができません。実装は、そのようなトークンを配当資産として使用してはなりません。

### 5. 決済とシェアの移動

`settle(account)`は、まずセクション2に従って割り当てを行い、その後次のようにしなければなりません。

```
settledUnclaimed[account] = unclaimedDividendOf(account)
dividendPerShareOf[account] = dividendPerShare
```

その割り当て後、`dividendPerShare`を返します。`account`が`address(0)`の場合、チェックポイントは書き込まれず、現在の`dividendPerShare`を返します。

誰でも`settle`と`distributeDividends`を呼び出すことができます。

シェア残高が変更されようとしている場合、ゼロアドレスではないすべての当事者は、残高が変更される前に決済されなければなりません。転送は`from`と`to`を決済します。ミントは受取人のみを決済します。バーンは保有者のみを決済します。順序は、割り当て、関係するアカウントの決済、そして[[glossary/ERC-20|ERC-20]]残高の変更です。その後に受け取ったシェアは以前の1株あたり配当を運びません。送られたシェアは、以前の配当を以前の保有者の`settledUnclaimed`に残します。

### 6. 引き出し

`withdrawDividend`は、まず割り当てを行い、その後`unclaimedDividendOf(msg.sender)`を読み取らなければなりません。`amount`が0の場合は0を返します。

`amount`が0より大きい場合、転送の前にアカウントを更新しなければなりません。

```
settledUnclaimed[msg.sender] = 0
dividendPerShareOf[msg.sender] = dividendPerShare
totalWithdrawn += amount
```

`DividendWithdrawn`を発行した後、`amount`の配当資産を`msg.sender`に転送します。転送が失敗した場合、トランザクション全体が[[glossary/Revert|リバート]]します。アカウントによって請求可能としてすでに記録された金額は、他の保有者に割り当てられてはなりません。

`DividendsDistributed`では、`delta`と`dividendPerShare`は同じ単位を共有し、両方ともスケールを含みます。`distributed`、`undistributed`、および`DividendWithdrawn`の`amount`は配当基本単位です。

### 7. 小数点以下の桁数

シェアトークンの小数点以下の桁数（decimals）は、配当資産の小数点以下の桁数よりも少なくすべきであり、一般的には6桁少ないのが望ましいです。余りは配当基本単位で表されますが、その数はシェアの`totalSupply`によって制限されます。100万株と18桁の配当の場合、スケール1では、18桁のシェアは100万近くの配当トークンを残す可能性があります。12桁のシェア（6桁少ない）は、約1配当トークン未満の余りを残します。スケール`2^64`または`10^9`の場合、その余りはスケールで割られます。配当資産自体が6桁以下の小数点以下を持つ場合、シェアトークンは0桁を使用しても構いません。これは推奨事項であり、要件ではありません。

### 8. サンプル

以下のサンプルは、この標準のみを含みます。そのスケールは`2^64`です。その定数を`10^9`または`1`に置き換えても、残りの会計処理は変更されません。製品税、利益の引き出し、およびバーンルールは、このサンプルには含まれていません。

```
contract EquityToken is ERC20, IEquityToken {
    address public immutable dividendToken;
    uint256 public constant dividendScale = 2 ** 64;

    uint256 public dividendPerShare;
    uint256 public totalDistributed;
    uint256 public totalWithdrawn;
    uint256 public distributionIndex;

    mapping(address => uint256) public dividendPerShareOf;
    mapping(address => uint256) internal settledUnclaimed;

    constructor(string memory name, string memory symbol, address dividendToken_)
        ERC20(name, symbol)
    {
        require(dividendToken_ != address(this));
        dividendToken = dividendToken_;
    }

    function undistributedDividend() public view returns (uint256) {
        return _dividendBalance() + totalWithdrawn - totalDistributed;
    }

    function totalReceived() public view returns (uint256) {
        return _dividendBalance() + totalWithdrawn;
    }

    function unclaimedDividendOf(address account) public view returns (uint256) {
        uint256 supply = totalSupply();
        uint256 preview = dividendPerShare;
        if (supply > 0) preview += undistributedDividend() * dividendScale / supply;
        return balanceOf(account) * (preview - dividendPerShareOf[account]) / dividendScale
            + settledUnclaimed[account];
    }

    function distributeDividends(uint256 amount) external payable {
        _take(amount);
        _distribute();
    }

    function settle(address account) external returns (uint256) {
        _distribute();
        _checkpoint(account);
        return dividendPerShare;
    }

    function withdrawDividend() external returns (uint256 amount) {
        _distribute();
        _checkpoint(msg.sender);
        amount = settledUnclaimed[msg.sender];
        if (amount == 0) return 0;
        settledUnclaimed[msg.sender] = 0;
        totalWithdrawn += amount;
        emit DividendWithdrawn(msg.sender, msg.sender, amount, dividendPerShare);
        _pay(msg.sender, amount);
    }

    function _update(address from, address to, uint256 value) internal override {
        _distribute();
        if (from != address(0)) _checkpoint(from);
        if (to != address(0)) _checkpoint(to);
        super._update(from, to, value);
    }

    function _distribute() internal {
        uint256 supply = totalSupply();
        if (supply == 0) return;
        uint256 waiting = undistributedDividend();
        uint256 delta = waiting * dividendScale / supply;
        if (delta == 0) return;
        uint256 distributed = delta * supply / dividendScale;
        dividendPerShare += delta;
        totalDistributed += distributed;
        emit DividendsDistributed(
            ++distributionIndex,
            msg.sender,
            waiting,
            distributed,
            supply,
            delta,
            dividendPerShare
        );
    }

    function _checkpoint(address account) internal {
        if (account == address(0)) return;
        settledUnclaimed[account] = unclaimedDividendOf(account);
        dividendPerShareOf[account] = dividendPerShare;
    }

    receive() external payable {}
}
```

`_take`はセクション4に従って支払いを受け取ります。`_pay`は配当資産を引き出す保有者に送ります。`_dividendBalance`はセクション2の残高を読み取ります。配当資産が[[glossary/ERC-20|ERC-20]]の場合、`receive`はETHを受け入れる必要はありません。

数値例ではスケール1を使用しており、手動で確認できます。`totalSupply`は100で、未分配額は250です。`delta`は2、`distributed`は200、余りの50は残ります。チェックポイントが0の40株の保有者は80を請求できます。サンプルスケール`2^64`では、同じ数値で`delta = 250 * 2^64 / 100`、`distributed`は250、余りは0になります。

## 理論的根拠

スケールは、「余りを残す」と「このラウンドで支払う」を1つの式にまとめます。スケール1の場合、余りは`totalSupply`よりも少なく、次ラウンドのために`undistributedDividend`に残ります。サンプルは`2^64`を使用します。`totalSupply`が`2^64`基本単位を超えない場合、余りは最大1です。6シェアの小数点以下の桁数では、これは約1.84×10^13株です。`10^9`も適合します。その余りの上限は`2^64`の上限の約184億倍であり、「最大1残る」ケースは10^9基本単位のみをカバーします。[[glossary/EIP|EIP]] 1726は倍率を`2^128`に固定しています。この標準では、実装が選択でき、その選択は構築後に変更されません。

`dividendPerShare()`は、すでに書き込まれた累積値のみを返します。未分配額は`unclaimedDividendOf`内でのみプレビューに入ります。保有者は、誰かが割り当てを呼び出す前に自分のシェアを読み取ることができます。状態は次の割り当てで変更されます。

未請求額は元の保有者に残ります。誰かが引き出しを待っているため、後の保有者には与えられません。

直接転送と`distributeDividends`は残高の同一性を共有します。呼び出し引数はその支払いをもたらすだけです。「`distribute`関数からの」個別の金額を記録することはありません。

## 後方互換性

これは新しい[[glossary/ERC|ERC]]です。すでにデプロイされている[[glossary/ERC-20|ERC-20]]コントラクトを変更することはありません。この標準を実装するコントラクトは、[[glossary/ERC-20|ERC-20]]残高の更新に加えて、転送、ミント、バーン時にアカウントを決済します。[[glossary/ERC-20|ERC-20]]のみを呼び出すクライアントでもシェアを転送できます。配当の請求には、この標準の関数を使用します。

[[glossary/EIP|EIP]] 1726はこの標準の以前の版ではありません。関数名、配当資産、および余りルールが異なります。この標準は番号1726を使用しません。

## セキュリティに関する考慮事項

-   **残高の同一性。** 配当資産が手数料を請求したり、下方リベースしたり、それ自体で残高を変更したりする場合、`undistributedDividend`は誤りになります。そのようなトークンは配当資産にはなりえません。
-   **転送前のアカウント。** `withdrawDividend`は`totalWithdrawn`を増加させ、そのアカウントの請求可能額をクリアし、その後資産を転送します。転送が失敗した場合、トランザクション全体が[[glossary/Revert|リバート]]しなければなりません。
-   **割り当てられた資金。** 請求可能として記録された金額は、そのアカウントが引き出すまでそのアカウントに留まります。後で未請求資金を回収する実装は、この標準の範囲外です。
-   **ゼロ供給。** `totalSupply`が0の間に受け取った配当は、1株あたりの値を増加させません。それは未分配残高に留まります。
-   **誰でも決済可能。** `settle`と`distributeDividends(0)`は、この標準のアカウントを進めるだけです。呼び出し元のアセットを転送することはありません。
-   **リエントランシー。** 割り当てと決済は、このコントラクト自身の数値を書き込みます。外部転送はこれらの書き込みの後に行われます。
-   **プレビューと保存値。** `unclaimedDividendOf`はまだ書き込まれていない部分を含み、すでにスケールで割られています。`dividendPerShare()`は未分配額を含まず、まだスケールを保持しています。「1株あたり割り当て済み」を表示するクライアントは`dividendPerShare / dividendScale`を使用します。
-   **オーバーフロー。** 2つの乗算はオーバーフロー時に[[glossary/Revert|リバート]]しなければなりません。`undistributedDividend * dividendScale`と`balanceOf(account) * (previewPerShare - dividendPerShareOf(account))`です。Solidity 0.8の乗算はデフォルトで[[glossary/Revert|リバート]]します。サンプルスケール`2^64`では、単一の未分配額と累積分配額の両方が`2^192`未満である必要があり、これらの乗算が`uint256`に収まるようにします。スケール`10^9`では、対応する上限は`(2^256 - 1) / 10^9`です。上限を超えると、割り当てと引き出しは停止します。資金はコントラクトに残ります。より小さなスケールでは、新しいデプロイが必要です。スケールは固定された後に変更することはできません。

## 参考文献

-   [[glossary/ERC-20|ERC-20]]: トークン標準
-   配当支払いトークン、[[glossary/EIP|EIP]] 1726

## 著作権

[[glossary/CC0|CC0]]を通じて著作権および関連する権利を放棄します。

1投稿 - 1参加者

[完全なトピックを読む](https://ethereum-magicians.org/t/dividend-paying-equity-token/29991)
