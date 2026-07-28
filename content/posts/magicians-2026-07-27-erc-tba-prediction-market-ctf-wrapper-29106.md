---
title: 'ERC-TBA: 予測市場CTFラッパー'
original_title: 'ERC-TBA: Prediction Market CTF Wrapper'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-tba-prediction-market-ctf-wrapper/29106'
author: martchelo_eth
date: '2026-07-27'
category: ERCs
tags:
  - ercs
  - erc
  - defi
  - smart-contracts
  - tokenomics
  - protocol-design
  - security
  - applications
  - ux
  - prediction-markets
topic_id: '29106'
translated_at: '2026-07-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: Prediction Market CTF Wrapper](https://ethereum-magicians.org/t/erc-tba-prediction-market-ctf-wrapper/29106) — martchelo_eth (2026-07-27)

## 要約

この提案は、Conditional Tokens Framework (CTF) のポジション、すなわちERC-1155の[[glossary/outcome-shares|予測市場アウトカムシェア]]を、ERC-20トークンとして表現することを標準化します。

2つのインターフェースが定義されています。`ICTFWrapper`に準拠するコントラクトは、単一のCTFポジションを1対1でラップするERC-20トークンであり、`wrap`、`unwrap`、およびその[[glossary/Factory|ファクトリー]]へのポインターを公開します。`ICTFWrapperFactory`に準拠するコントラクトは、1つのConditional Tokensコントラクトと1つの[[glossary/collateral-token|担保トークン]]にバインドされており、ラッパーをデプロイして登録し、各ラッパーのポジションパラメータを記録し、[[glossary/complete-set-operations|完全セット操作]]である`split`と`merge`を公開します。

## 動機

[[glossary/outcome-shares|予測市場アウトカムシェア]]は、主にERC-1155トークンとして表現されます。主要な会場は、GnosisのConditional Tokens Frameworkを通じてポジションを発行しており、各アウトカムはERC-1155の`positionId`です。

これらのポジションにおけるオンチェーン活動は増加しており、[[glossary/DeFi|DeFi]]プロトコル（レンディング市場、ボールト、ストラクチャードプロダクト、レバレッジシステムなど）の幅広いセットが、予測市場シェアを第一級資産として利用したいと考えています。これらの会場はERC-20を扱い、ERC-1155ポジションIDを扱うものはほとんどありません。現在存在するラッパーは、2つの極端なタイプに分かれています。

汎用ラッパー（例：Gnosisの`Wrapped1155Factory`）は、ポジションIDのみを公開しますが、それ自体ではそのポジションがどの市場に属し、どのアウトカムを表し、どの担保で償還されるかについては何も明らかになりません。また、担保を完全セットに分割したり、セットを担保に戻したりする方法も提供されていません。インテグレーターはConditional Tokensコントラクトを直接操作し、すべてのIDを自分で再導出する必要があります。

プロトコルネイティブなアウトカムごとのERC-20は、これらすべてのパラメータとロジックを保持していますが、それは1つのプロトコルの独自の型、ゲッター、および市場コントラクトを通じてのみであり、ある会場向けに書かれた統合は他の会場には転用できません。

この2つの間には、ビルダーがCTFベースの会場で必要とする読み取り可能なポジションパラメータと[[glossary/complete-set-operations|完全セット操作]]を提供する共通のスキーマが存在しません。

## 仕様

このドキュメントにおけるキーワード「MUST」、「MUST NOT」、「REQUIRED」、「SHALL」、「SHALL NOT」、「SHOULD」、「SHOULD NOT」、「RECOMMENDED」、「NOT RECOMMENDED」、「MAY」、「OPTIONAL」は、RFC 2119およびRFC 8174に記述されている通りに解釈されます。

### 定義

-   **[[glossary/Factory|ファクトリー]]**: `ICTFWrapperFactory`に準拠するコントラクト。
-   **ラッパー**: [[glossary/Factory|ファクトリー]]によってデプロイおよび登録される、`ICTFWrapper`に準拠するコントラクト。
-   **`CTF`**: [[glossary/Factory|ファクトリー]]の`conditionalTokens()`によって返されるConditional Tokensコントラクト。
-   **`COLLATERAL`**: [[glossary/Factory|ファクトリー]]の`collateralToken()`によって返されるトークン。
-   **[[glossary/Position-id|ポジションID]]**: `CTF`および`COLLATERAL`の下でのタプル`(parentCollectionId, conditionId, indexSet)`のERC-1155 IDであり、以下のように計算されます。

    ```
    positionId = CTF.getPositionId(
        COLLATERAL,
        CTF.getCollectionId(parentCollectionId, conditionId, indexSet)
    )
    ```

-   **`positionId`**: ラッパーインターフェース内では、そのラッパーのために[[glossary/Factory|ファクトリー]]によって記録されたポジションID。

### ラッパーインターフェース

すべての準拠ラッパーは、ERC-20、ERC-1155レシーバーインターフェース、および以下のインターフェースを実装しなければなりません (MUST)。

```solidity
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

interface ICTFWrapper /* is IERC20, IERC1155Receiver */ {
    event Wrapped(address indexed from, address indexed to, uint256 amount);

    event Unwrapped(address indexed from, address indexed to, uint256 amount);

    function factory() external view returns (address);

    function wrap(address to, uint256 amount) external;

    function unwrap(address to, uint256 amount) external;
}
```

#### ラッパーの不変条件

以下の条件は、すべての準拠ラッパーに対して満たされなければなりません (MUST)。

-   **単一ポジション。** ラッパーは正確に1つのポジションIDをラップしなければなりません (MUST)。そのIDはラッパーが公開される前に固定されなければならず (MUST)、変更されてはなりません (MUST NOT)。
-   **供給。** すべての状態変更呼び出しの後、`totalSupply()`は`IERC1155(CTF).balanceOf(address(this), positionId)`と等しくなければなりません (MUST)。ラッパーは、そのERC-20供給によって1対1で表現されていないそのIDの残高を保持してはなりません (MUST NOT)。
-   **1対1、手数料なし。** `wrap`と`unwrap`は、原資産ポジションの単位ごとに正確に1つのERC-20単位をミントおよびバーンしなければならず (MUST)、手数料を請求したり、スケーリングファクターを適用したりしてはなりません (MUST NOT)。

#### ラッパーのメタデータ

-   `decimals()`は表示のみであり、この仕様のいかなる量にも影響を与えません。また、`COLLATERAL`の`decimals()`と等しくなければなりません (MUST)。ラッピングと分割はどちらも1対1であるため、ラッパーの1つのERC-20単位は決済時に1つの`COLLATERAL`単位であり、不一致は引用されるすべての場所でラッパーの価格を誤らせることになります。
-   `name()`と`symbol()`は`positionId`から決定論的に導出されるべきであり (SHOULD)、変更可能であってはなりません (SHOULD NOT)。

#### ラッパーのメソッド

##### `factory`

このラッパーを管理し、そのパラメータを保持する[[glossary/Factory|ファクトリー]]。

-   このラッパーが登録されている`ICTFWrapperFactory`に準拠するコントラクトを返さなければなりません (MUST)。すなわち、`ICTFWrapperFactory(factory()).isWrapper(address(this))`は`true`でなければなりません (MUST)。
-   変更されてはなりません (MUST NOT)。

```solidity
function factory() external view returns (address);
```

##### `wrap`

呼び出し元から原資産ポジションを受け取り、それに対してERC-20をミントします。

-   `amount`の`positionId`を`msg.sender`からラッパーに転送しなければなりません (MUST)。
-   `amount`のERC-20を`to`にミントしなければなりません (MUST)。
-   そのインバウンド転送によって引き起こされるラッパー自身の`onERC1155Received`の呼び出しは、ミントしてはなりません (MUST NOT)。
-   `amount`がゼロの場合、リバートしなければなりません (MUST)。
-   `to`がゼロアドレスの場合、リバートしなければなりません (MUST)。
-   条件の決済状態によってゲートされてはなりません (MUST NOT)。

```solidity
function wrap(address to, uint256 amount) external;
```

##### `unwrap`

呼び出し元からERC-20をバーンし、原資産ポジションを返します。

-   `amount`のERC-20を`msg.sender`からバーンしなければなりません (MUST)。
-   `amount`の`positionId`を`to`に転送しなければなりません (MUST)。
-   `Unwrapped`イベントを発行しなければなりません (MUST)。
-   `amount`がゼロの場合、リバートしなければなりません (MUST)。
-   `to`がゼロアドレスの場合、リバートしなければなりません (MUST)。
-   条件の決済状態によってゲートされてはなりません (MUST NOT)。

```solidity
function unwrap(address to, uint256 amount) external;
```

##### `onERC1155Received`

原資産ポジションのラッパーへの直接転送を`wrap`と同等にします。

-   `msg.sender`が`CTF`でない場合、リバートしなければなりません (MUST)。
-   `id`が`positionId`でない場合、リバートしなければなりません (MUST)。
-   転送がこのラッパー自身の`wrap`（それ自体がミントを行う）に由来する場合、ミントしてはなりません (MUST NOT)。

```solidity
function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes calldata data)
    external
    returns (bytes4);
```

##### `onERC1155BatchReceived`

-   リバートしなければなりません (MUST)。

```solidity
function onERC1155BatchReceived(
    address operator,
    address from,
    uint256[] calldata ids,
    uint256[] calldata values,
    bytes calldata data
) external returns (bytes4);
```

#### ラッパーのイベント

##### `Wrapped`

`wrap`を通じて、または`onERC1155Received`によって受け入れられた直接のERC-1155転送を通じて、ラップごとに正確に1回発行されなければなりません (MUST)。

-   `from`: 原資産ポジションが来たアカウント。
-   `to`: ERC-20がミントされたアカウント。
-   `amount`: ラップされた単位数。

```solidity
event Wrapped(address indexed from, address indexed to, uint256 amount);
```

##### `Unwrapped`

ERC-20が原資産ポジションに戻ってアンラップされたときに発行されなければなりません (MUST)。

-   `from`: ERC-20がバーンされたアカウント。
-   `to`: 原資産ポジションが転送されたアカウント。
-   `amount`: アンラップされた単位数。

```solidity
event Unwrapped(address indexed from, address indexed to, uint256 amount);
```

### [[glossary/Factory|ファクトリー]]インターフェース

すべての準拠[[glossary/Factory|ファクトリー]]は、以下のインターフェースを実装しなければなりません (MUST)。

```solidity
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

interface ICTFWrapperFactory {
    struct TokenParams {
        bytes32 conditionId;
        bytes32 parentCollectionId;
        uint256 indexSet;
        uint256 positionId;
    }

    event WrapperCreated(
        address indexed wrapper,
        uint256 indexed positionId,
        bytes32 indexed conditionId,
        bytes32 parentCollectionId,
        uint256 indexSet
    );

    event Split(
        address indexed account,
        address indexed to,
        bytes32 indexed conditionId,
        bytes32 parentCollectionId,
        uint256 amountIn,
        address tokenIn
    );

    event Merged(
        address indexed account,
        address indexed to,
        bytes32 indexed conditionId,
        bytes32 parentCollectionId,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOut
    );

    function conditionalTokens() external view returns (address);

    function collateralToken() external view returns (address);

    function wrapperOf(uint256 positionId) external view returns (address);

    function paramsOf(address wrapper) external view returns (TokenParams memory);

    function isWrapper(address wrapper) external view returns (bool);

    function getAddress(uint256 positionId) external view returns (address);

    function siblingWrapperOf(address wrapper, uint256 siblingIndexSet)
        external
        view
        returns (address);

    function deploy(bytes32 conditionId, bytes32 parentCollectionId, uint256 indexSet)
        external
        returns (address wrapper);

    function deployMulti(bytes32 conditionId, bytes32 parentCollectionId, uint256[] calldata indexSets)
        external
        returns (address[] memory wrappers);

    function getSupportedTokens() external view returns (address[] memory);

    function split(
        bytes32 conditionId,
        bytes32 parentCollectionId,
        uint256 amount,
        address tokenIn,
        address to
    ) external;

    function merge(address[] calldata wrappers, uint256 amount, address tokenOut, address to)
        external
        returns (uint256 amountOut);
}
```

#### `TokenParams`

ラッパーの単一ポジションのパラメータ。

-   `conditionId`: ポジションが属する`CTF`条件。
-   `parentCollectionId`: ポジションがネストされている親コレクション。トップレベルポジションの場合は`bytes32(0)`。
-   `indexSet`: ポジションがカバーするアウトカムスロットのビットマスク。
-   `positionId`: 上記3つのフィールドから**定義**に従って導出されたポジションID。

```solidity
struct TokenParams {
    bytes32 conditionId;
    bytes32 parentCollectionId;
    uint256 indexSet;
    uint256 positionId;
}
```

#### [[glossary/Factory|ファクトリー]]のメソッド

##### `conditionalTokens`

この[[glossary/Factory|ファクトリー]]のすべてのラッパーがラップするConditional Tokensコントラクト。

-   デプロイ時に固定され、変更されてはなりません (MUST NOT)。

```solidity
function conditionalTokens() external view returns (address);
```

##### `collateralToken`

ポジションが額面表示される[[glossary/collateral-token|担保トークン]]。

-   デプロイ時に固定され、変更されてはなりません (MUST NOT)。

```solidity
function collateralToken() external view returns (address);
```

##### `wrapperOf`

ポジションIDのラッパー。

-   `positionId`に対して登録されたラッパーを返さなければなりません (MUST)。デプロイされていない場合は`address(0)`を返します。
-   `paramsOf`の逆でなければなりません (MUST)。登録された任意のラッパー`w`について、`wrapperOf(paramsOf(w).positionId) == w`が成り立ちます。

```solidity
function wrapperOf(uint256 positionId) external view returns (address);
```

##### `paramsOf`

ラッパーのために記録されたパラメータ。

-   デプロイ時に`wrapper`のために記録されたパラメータを、その後のすべての呼び出しで変更せずに返さなければなりません (MUST)。
-   不明なラッパーに対しては、ゼロ値の`TokenParams`を返さなければなりません (MUST)。

```solidity
function paramsOf(address wrapper) external view returns (TokenParams memory);
```

##### `isWrapper`

アドレスがこの[[glossary/Factory|ファクトリー]]によってデプロイおよび登録されたかどうか。

-   `wrapper`がこの[[glossary/Factory|ファクトリー]]によってデプロイおよび登録された場合にのみ`true`を返さなければなりません (MUST)。

```solidity
function isWrapper(address wrapper) external view returns (bool);
```

##### `getAddress`

ポジションIDのラッパーが持つ、または持つであろう決定論的なアドレス。

-   `positionId`のラッパーが持つ、または持つであろうアドレスを返さなければなりません (MUST)。

```solidity
function getAddress(uint256 positionId) external view returns (address);
```

##### `siblingWrapperOf`

登録されたラッパーと同じ条件および親コレクションの別のアウトカムのラッパー。

-   `(paramsOf(wrapper).parentCollectionId, paramsOf(wrapper).conditionId, siblingIndexSet)`のポジションIDに対する登録されたラッパーを返さなければなりません (MUST)。存在しない場合は`address(0)`を返します。
-   不明な`wrapper`に対してはリバートしなければなりません (MUST)。`wrapperOf`とは異なり、この呼び出しは提供されたラッパーのパラメータからその答えを導出するため、ゼロを返すと「この[[glossary/Factory|ファクトリー]]のラッパーではない」と「兄弟がまだデプロイされていない」が混同されてしまいます。

```solidity
function siblingWrapperOf(address wrapper, uint256 siblingIndexSet)
    external
    view
    returns (address);
```

##### `getSupportedTokens`

`tokenIn`として受け入れられ、`tokenOut`として配信されるトークンのセット。

-   [[glossary/Factory|ファクトリー]]が`tokenIn`として受け入れ、`tokenOut`として配信するトークンの正確なセットを返さなければなりません (MUST)。
-   `collateralToken()`を含まなければならず (MUST)、したがって空であってはなりません (MUST NOT)。
-   重複を含んではなりません (MUST NOT)。

```solidity
function getSupportedTokens() external view returns (address[] memory);
```

##### `deploy`

単一アウトカムポジションの既存のラッパーをデプロイするか、返します。

-   引数から導出されたポジションIDのラッパーを、`getAddress(positionId)`にデプロイおよび登録しなければなりません (MUST)。
-   `TokenParams(conditionId, parentCollectionId, indexSet, positionId)`を記録しなければなりません (MUST)。
-   `WrapperCreated`イベントを発行しなければなりません (MUST)。
-   ポジションIDごとに冪等でなければなりません (MUST)。同じIDに対する2回目の呼び出しは、既存のラッパーを返し、それ以上のイベントを発行してはなりません (MUST NOT)。
-   `indexSet`がゼロの場合、または`CTF.getOutcomeSlotCount(conditionId)`以上のビットを設定する場合、リバートしなければなりません (MUST)。

```solidity
function deploy(bytes32 conditionId, bytes32 parentCollectionId, uint256 indexSet)
    external
    returns (address wrapper);
```

##### `deployMulti`

1つの条件の複数のアウトカムポジションに対するラッパーをデプロイするか、既存のラッパーを返します。

-   `indexSets`の各エントリに対して、順序通りに`deploy(conditionId, parentCollectionId, indexSet)`を1回呼び出すことと同等でなければなりません (MUST)。
-   結果のラッパーを`indexSets`と同じ順序で返さなければなりません (MUST)。
-   `indexSets`が空の場合、リバートしなければなりません (MUST)。

```solidity
function deployMulti(bytes32 conditionId, bytes32 parentCollectionId, uint256[] calldata indexSets)
    external
    returns (address[] memory wrappers);
```

##### `split`

`tokenIn`をラップされたアウトカムの完全セットに分割します。

-   `amount`の`tokenIn`を`msg.sender`から受け取らなければなりません (MUST)。
-   そのパーティションの各ラッパーの`amount`を`to`に配信しなければなりません (MUST)。まだ存在しないラッパーはデプロイします。
-   `Split`イベントを発行しなければなりません (MUST)。

```solidity
function split(
    bytes32 conditionId,
    bytes32 parentCollectionId,
    uint256 amount,
    address tokenIn,
    address to
) external;
```

##### `merge`

完全アウトカムセットをバーンし、[[glossary/collateral-token|担保トークン]]を`tokenOut`として解放します。

-   `wrappers`内の各ラッパーの`amount`を`msg.sender`から受け取らなければなりません (MUST)。
-   正確に`amount`の`tokenOut`を`to`に配信しなければなりません (MUST)。
-   `Merged`イベントを発行しなければなりません (MUST)。
-   `amount`を返さなければなりません (MUST)。
-   `wrappers`のエントリがすべてこの[[glossary/Factory|ファクトリー]]によって登録されており、1つの`conditionId`と1つの`parentCollectionId`を共有している場合にのみ、リバートしてはなりません (MUST NOT)。
-   `amount`がゼロの場合、`to`がゼロアドレスの場合、または`tokenOut`がサポートされていない場合、リバートしなければなりません (MUST)。

```solidity
function merge(address[] calldata wrappers, uint256 amount, address tokenOut, address to)
    external
    returns (uint256 amountOut);
```

#### [[glossary/Factory|ファクトリー]]のイベント

##### `WrapperCreated`

ラッパーがデプロイおよび登録されたときに発行されなければならず (MUST)、同じポジションIDに対して再度発行されてはなりません (MUST NOT)。このイベントは完全な`TokenParams`を運び、ログのみを読み取るコンシューマーが`positionId`を再計算し、導出を検証できるようにします。

```solidity
event WrapperCreated(
    address indexed wrapper,
    uint256 indexed positionId,
    bytes32 indexed conditionId,
    bytes32 parentCollectionId,
    uint256 indexSet
);
```

##### `Split`

すべての`split`が成功したときに発行されなければなりません (MUST)。

```solidity
event Split(
    address indexed account,
    address indexed to,
    bytes32 indexed conditionId,
    bytes32 parentCollectionId,
    uint256 amountIn,
    address tokenIn
);
```

##### `Merged`

すべての`merge`が成功したときに発行されなければなりません (MUST)。

```solidity
event Merged(
    address indexed account,
    address indexed to,
    bytes32 indexed conditionId,
    bytes32 parentCollectionId,
    uint256 amountIn,
    address tokenOut,
    uint256 amountOut
);
```

## 理論的根拠

### [[glossary/Factory|ファクトリー]]とトークンのインターフェースであり、トークン単独ではない理由

ビルダーが必要とする2つの機能、すなわちポジションのパラメータの読み取りと[[glossary/complete-set-operations|完全セット操作]]の実行は、単一のラッパーでは安価に実行できません。パラメータはすべてのアウトカムごとのデプロイメントに重複して格納されることになり、`split`と`merge`は複数のポジションと[[glossary/collateral-token|担保トークン]]にまたがるため、それらを実行するラッパーはルーティングと兄弟に関する知識を必要とします。会場ごとに1つの[[glossary/Factory|ファクトリー]]に両方を集中させることで、ラッパーは[[glossary/minimal-proxy-clones|ミニマルプロキシクローン]]として十分ミニマルに保たれ、インテグレーターにはパラメータを読み取り、セットに参加または退出するための統一された場所が提供されます。

### パラメータが各ラッパーではなく[[glossary/Factory|ファクトリー]]に存在する理由

ラッパーは通常[[glossary/minimal-proxy-clones|ミニマルプロキシクローン]]であり、インスタンスごとの不変値を保持できません。パラメータを[[glossary/Factory|ファクトリー]]に保持することで、ラッパーは`factory()`のみを公開し、そこからそれに関するすべての情報を読み取ることができます。

## 後方互換性

この提案はERC-20またはERC-1155のセマンティクスを変更するものではなく、デプロイ済みのConditional Tokensコントラクトに変更を要求するものでもありません。[[glossary/Factory|ファクトリー]]とそのラッパーは、既存の`CTF`と`COLLATERAL`の上に完全に存在し、ラッパーはそれを転送するだけのすべてのコントラクトにとって通常のERC-20です。

1つの非互換性が受信側で導入されます。

### ラッパーへのバッチ転送

ラッパーはERC-1155レシーバーインターフェースを実装していますが、単一の転送のみを受け入れます。その`onERC1155BatchReceived`は常にリバートします。リバートはERC-1155レシーバーにとって準拠した応答であるため、原資産が失われることはありません（リバートによって転送が取り消されます）。しかし、任意のレシーバーをバッチ対応とみなすコントラクトはラッパーに対して失敗し、ラッパーは呼び出し前にこれを検出する方法を提供しません。`ERC165.supportsInterface(type(IERC1155Receiver).interfaceId)`はラッパーに対して`true`を報告します。これはインターフェースが実装されているためであり、2つのエントリーポイントを区別しません。

この問題の深刻度は、資金の損失ではなくライブネスであり、影響を受ける呼び出し元は、エンドユーザーではなく、ユーザーに代わってERC-1155残高を移動するコントラクト（ルーター、ボールト、移行ヘルパーなど）です。このような呼び出し元は、`wrap`を通じて、または`safeTransferFrom`を一度に1つのIDに対して実行することで、ポジションをラッパーにルーティングすべきであり、`safeBatchTransferFrom`を通じてルーティングすべきではありません。

ラッパーはポジションIDと1対1であるため、単一のラッパー内でのバッチ処理は何も得られません。複数のポジションにまたがるバッチは、いずれにせよそれらのラッパー間で分割される必要があります。

## セキュリティに関する考慮事項

### パラメータの整合性

`paramsOf`は、ラッパーが何を表すかについての唯一のオンチェーンの真実の源です。誤った`conditionId`や[[glossary/collateral-token|担保トークン]]は、ラッパーが誤った市場に対して価格設定されることを許してしまいます。導出不変条件が防御策であり、それは[[glossary/Factory|ファクトリー]]が提供されたポジションIDを決して受け入れず、登録されたラッパーのパラメータを決して変更しない場合にのみ成り立ちます。デプロイしていないラッパーを信頼するインテグレーターは、信頼する[[glossary/Factory|ファクトリー]]の下で`isWrapper`を確認すべきであり (SHOULD)、`WrapperCreated`のフィールドから不変条件を自分で再計算してもよいでしょう (MAY)。

### レシートパスでの二重ミント

ラッパーには原資産を受け取る2つの方法があり、`wrap`はその両方を通過します。`wrap`が実行する`safeTransferFrom`は、ラッパー自身の`onERC1155Received`を呼び出します。両方でミントする実装は、1つのレシートに対して2回ミントすることになり、[[glossary/supply-invariant|供給不変条件]]を恒久的に破り、呼び出し元が預け入れた量よりも多くアンラップすることを可能にします。これは、他のすべてのホルダーを裏付けるポジション残高を枯渇させることになります。

### [[glossary/supply-invariant|供給不変条件]]とバーン権限

[[glossary/supply-invariant|供給不変条件]]は、ラッパーの供給が自身の`wrap`と`unwrap`によってのみ変更される場合にのみ成り立ちます。ラッパーも[[glossary/Factory|ファクトリー]]も、ホルダーのERC-20残高に対する特権的なバーンフックを導入してはなりません。[[glossary/Factory|ファクトリー]]の[[glossary/complete-set-operations|完全セット操作]]は、どのインテグレーターでも同じアローワンスで行えることに限定されます。

### [[glossary/Reentrancy|リエントランシー]]

[[glossary/complete-set-operations|完全セット操作]]は、単一のトランザクション内で`CTF`、ラッパー、および変換アダプターを呼び出し、`unwrap`はERC-1155レシーバーフックを通じて任意の`to`に制御を渡します。[[glossary/supply-invariant|供給不変条件]]はすべての状態変更呼び出しに対して述べられており、[[glossary/Reentrancy|リエントランシー]]パスは操作中にそれを侵害する可能性があるため、これらの操作は[[glossary/Reentrancy|リエントランシー]]から保護されなければならず (MUST)、外部呼び出しの前に状態変更を順序付けなければなりません (MUST)。

## 著作権

著作権および関連する権利はCC0を通じて放棄されます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-tba-prediction-market-ctf-wrapper/29106)
