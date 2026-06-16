---
title: 'pERC20: プライベートトークン標準'
original_title: 'pERC20: Private Token Standard'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/perc20-private-token-standard/28796'
author: Cyimon
date: '2026-06-15'
category: EIPs
tags:
  - eips
  - privacy
  - tokenomics
  - erc
  - smart-contracts
  - cryptography
  - zk
topic_id: '28796'
translated_at: '2026-06-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [pERC20: Private Token Standard](https://ethereum-magicians.org/t/perc20-private-token-standard/28796) — Cyimon (2026-06-15)

**著者:** Cyimon ([@Cyimon](https://github.com/Cyimon)) · **ステータス:** ドラフト · **タイプ:** 標準トラック · **カテゴリ:** [[glossary/ERC|ERC]] · **[[glossary/EIP|EIP]]:** 8287 · **作成日:** 2026-06-09

**概要:** [[glossary/EVM|EVM]]向けの、デフォルトでプライベートな[[glossary/Privacy-native-fungible-token|ファンジブルトークン標準]]。

**関連議論:** [EIP-8287-Draft](https://github.com/ethereum/ERCs/pull/1796) · [Ethereum Magicians #28702](https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702) · [ethresear.ch #25089](https://ethresear.ch/t/perc20-privacy-native-fungible-token-standard-draft/25089) · **実装:** [PERC20Labs/pERC20\_](https://github.com/PERC20Labs/pERC20_)

* * *

以前公開された[[glossary/Privacy-native-fungible-token|pERC20]]プロトコル設計 ([Ethereum Magicians #28702](https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702)) を拡張します。この改訂版の主な追加点は、[[glossary/ZIP-32|ZIP-32]]サブアカウントを介した**[[glossary/ERC-20|ERC-20]]承認済み支出** — `approve`、`allowance`、`transferFrom` — です。更新された標準は[[glossary/ERC-20|ERC-20]]と**機能的に完全 (capability-complete)** ですが、**バイト互換性はありません**（異なる[[glossary/ABI|ABI]]、公開残高なし）。

| [[glossary/ERC-20|ERC-20]] | [[glossary/Privacy-native-fungible-token|pERC20]] | レイヤー |
| --- | --- | --- |
| name / symbol / decimals / totalSupply | はい — 同じ公開ビュー | オンチェーン |
| balanceOf | はい — ホルダーのみのスキャン | オフチェーン |
| transfer | はい — プライベートな当事者と金額 | オンチェーン |
| approve / allowance / transferFrom | 新規 — [[glossary/ZIP-32|ZIP-32]]サブアカウントを介した[[glossary/EOA|EOA]]支出者向けの承認済み支出; オンチェーン = 転送（コントラクト支出者は非対応） | オフチェーン |
| mint / burn | はい — 一般的な拡張 | オンチェーン |
| Transfer / Approval events | 省略（プライバシーのため） | — |

以下は最新の[[glossary/Privacy-native-fungible-token|pERC20]]標準です: **プライベートトークン標準**。

* * *

## 概要

`pERC20`は、[[glossary/EVM|EVM]]向けの**デフォルトでプライベートな[[glossary/Privacy-native-fungible-token|ファンジブルトークン標準]]**であり、[[glossary/ERC-20|ERC-20]]のプライバシーバージョンです。内部的には、[Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)の[[glossary/Orchard-shielded-pool-model|Orchardシールドプールモデル]]を使用しています。[[glossary/ERC-20|ERC-20]]の全メソッドサーフェスを維持していますが、いくつかのメソッドはオンチェーンの公開読み取りではなく**プライベート**（ホルダーのみ、オフチェーン）であり、`transfer` / `approve` / `transferFrom`はすべてオンチェーンでは同じ`transfer`操作として現れます。詳細については、以下の[pERC20インターフェース](https://ethereum-magicians.org#perc20-interface)を参照してください。

## 動機

イーサリアムの公開台帳は、すべての[[glossary/ERC-20|ERC-20]]残高、転送、および許容量を永続的に可視化します。支払い、給与、財務、およびオンチェーン金融が[[glossary/Layer-1|L1]]に移行するにつれて、ユーザーと発行者は**プライベートな[[glossary/Privacy-native-fungible-token|ファンジブルトークン]]**を必要としています — 公開残高に関するプライベートメッセージングだけでは不十分です。

プライバシーはプロトコル層でますます対処されています。例えば、[[glossary/EIP|EIP]]-8182は**プロトコルに組み込まれたシールドプール**を定義しています: ユーザーは公開ETHまたは互換性のある[[glossary/ERC-20|ERC-20]]トークンを預け入れ、共有プール内で価値をプライベートに移動させ、公開形式に戻して引き出します。このモデルは**既存の公開アセットをシールドします**が、**作成時からプライベートなトークンを発行する方法**は定義していません。

`pERC20`は後者のギャップを埋めます。これは、**ネイティブにプライベートな[[glossary/Privacy-native-fungible-token|ファンジブルトークン]]**のためのアプリケーション層トークン標準です: 最初からプライベートノートとして発行、保有、転送、および`approve` / `transferFrom`を介して使用され、公開`balanceOf`フェーズや共有シールドプールへの預け入れはありません。これは[[glossary/ERC-20|ERC-20]]のプライベートな対応物を指定します — 同じメソッドサーフェス、異なる公開度 — そのため、プロトコルレベルのプライバシー（例: [[glossary/EIP|EIP]]-8182）が並行して進化する間も、発行者は今日からプライベートアセットをローンチできます。両者は補完的であり、競合するものではありません: [[glossary/EIP|EIP]]-8182は公開アセットをプライベート化し、`pERC20`はプライベートアセットの発行を定義します。

## 仕様

キーワード**MUST**、**MUST NOT**、**SHOULD**、**MAY**はRFC 2119に従って解釈されます。Solidity構文は`0.8.20`以上です。

### 基盤となるプロトコル

価値はアカウント残高ではなく、シールドノートに保持されます。ノート形式、[[glossary/nullifier|ナリファイア]]、[[glossary/commitment-tree|コミットメントツリー]]、ノート暗号化、および[[glossary/action-bundle|アクション]]/バンドル構造は、[Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)の**[[glossary/Orchard-shielded-pool-model|Orchardシールドプール]]**に従い、ここでは[[glossary/Groth16|Groth16]]で検証されるアセットごとの[[glossary/EVM|EVM]]コントラクトとして採用されています。以下に繰り返されないフィールドレベルの形式は、[参照実装](https://ethereum-magicians.org#reference-implementation)で規範的です。

### pERC20インターフェース

このセクションでは、**すべての[[glossary/Privacy-native-fungible-token|pERC20]]インターフェース**を一箇所にまとめ、それぞれが[[glossary/ERC-20|ERC-20]]標準インターフェースに対応するかどうかを示します。**[[glossary/ERC-20|ERC-20]]**: `yes` = [[glossary/ERC-20|ERC-20]]標準; `extension` = 一般的な拡張（発行/焼却）; `no` = [[glossary/Privacy-native-fungible-token|pERC20]]固有。**レイヤー**: `on-chain` = コントラクト[[glossary/ABI|ABI]]; `off-chain` = ウォレット/SDK（コントラクトメソッドなし）。

| [[glossary/Privacy-native-fungible-token|pERC20]]インターフェース | [[glossary/ERC-20|ERC-20]] | レイヤー | 公開度 | 説明 |
| --- | --- | --- | --- | --- |
| name() / symbol() / decimals() | yes | オンチェーン | public | [[glossary/ERC-20|ERC-20]]と同一 |
| totalSupply() | yes | オンチェーン | public | 公開カウンター（発行 − 焼却） |
| balanceOf(addr) | yes | オフチェーン | private | ビューイングキーで[[glossary/Orchard-shielded-pool-model|Orchard]]ノートをスキャン; ホルダーのみ |
| transfer(PrivacyCall) | yes | オンチェーン | private (当事者 + 金額) | [[glossary/Orchard-shielded-pool-model|Orchard]]アクションバンドル |
| approve(spender, N) | yes | オフチェーン | private (関係は隠蔽) | [[glossary/ZIP-32|ZIP-32]]サブアカウント; 資金提供 + キーの配布; オンチェーンではtransfer(PrivacyCall)として提出 |
| allowance(owner, spender) | yes | オフチェーン | private | サブアカウントの残高をスキャン |
| transferFrom(from, to, amount) | yes | オフチェーン | private (関係は隠蔽) | 支出者がサブアカウントから支払い; オンチェーンではtransfer(PrivacyCall)として提出 |
| mint(amount, PrivacyCall) | extension | オンチェーン | 金額はpublic; 受取人はprivate | 発行者のみ; [[glossary/Orchard-shielded-pool-model|Orchard]]アクション + 総供給量増加 |
| burn(amount, PrivacyCall) | extension | オンチェーン | 金額はpublic; 焼却者はprivate | ホルダーが自身のノートを焼却; [[glossary/Orchard-shielded-pool-model|Orchard]]アクション + 総供給量減少 |
| issuer() | no | オンチェーン | public | トークン発行者アドレス |
| cmxFrozenRoot() / setFrozenRoot() | no | オンチェーン | public root; 管理者書き込み | コンプライアンス凍結ノートルート |
| cmxRoot() / isValidAnchor() / isSpent() / treeSize() | no | オンチェーン | public | [[glossary/Orchard-shielded-pool-model|Orchard]]コミットメントツリーの状態 |

#### イベント

| [[glossary/Privacy-native-fungible-token|pERC20]]イベント | [[glossary/ERC-20|ERC-20]] | レイヤー | 説明 |
| --- | --- | --- | --- |
| Transfer(from, to, value) | yes | オフチェーン（省略） | 発行されない; 当事者と金額はプライベート |
| Approval(owner, spender, value) | yes | オフチェーン（省略） | 発行されない; 所有者 ↔ 支出者をリンクしてしまうため |
| NoteAdded / NoteConfirmed | 転送を置き換える | オンチェーン | ノートごとの可視性 |
| Mint / Burn | extension | オンチェーン | 公開金額のみ |
| Perc20Created / FrozenRootUpdated / BundleExecuted | no | オンチェーン | デプロイ、コンプライアンス、バンドルメタデータ |

**オンチェーンでの区別不能性。** `transfer`、`approve`の資金提供ステップ、`transferFrom`、および取り消し・回収はすべて同じオンチェーン呼び出しです: `transfer(PrivacyCall)`。オブザーバーはどの[[glossary/ERC-20|ERC-20]]操作が実行されているかを判別できません。

**ネイティブにはサポートされない。** [[glossary/ERC-20|ERC-20]]の`approve(contractAddress, amount)` — コントラクトが自律的に`transferFrom`を呼び出す — にはネイティブな同等物がありません: 支出には秘密鍵が必要ですが、コントラクトはそれを保持できません。理由を参照してください。

### コントラクトインターフェース

`pERC20`は1つのオンチェーン[[glossary/ABI|ABI]]（`IPERC20`; [pERC20インターフェース](https://ethereum-magicians.org#perc20-interface)を参照）を公開します。その表で**オフチェーン**とマークされたメソッドにはコントラクトのエントリポイントがありません; 動作は[メソッドセマンティクス](https://ethereum-magicians.org#method-semantics)で指定されています。

```
interface IPERC20 {
    struct PrivacyCall  { bytes actions; uint256[3] bindingSig; }
    struct BundleAction {
        bytes32    cmx;
        bytes      encCiphertext;
        bytes      outCiphertext;
        bytes32    epk;
        bytes32    nfOld;          // nullifier of the consumed (or dummy) input note
        bytes32    anchor;         // historical root of the consumed (or dummy) input note
        bytes      proof;
        uint256[8] pubFields;
        uint256[3] spendAuthSig;
    }

    // ERC-20-aligned public views
    function name()        external view returns (string memory);
    function symbol()      external view returns (string memory);
    function decimals()    external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function issuer()      external view returns (address);

    // Value-changing operations (private parties; see Method Semantics)
    function transfer(PrivacyCall calldata call) external returns (bool success);
    function mint(uint256 amount, PrivacyCall calldata call) external;
    function burn(uint256 amount, PrivacyCall calldata call) external;

    // Compliance
    function cmxFrozenRoot() external view returns (uint256);
    function setFrozenRoot(uint256 newRoot) external; // onlyAdmin

    // Note state machine (Orchard commitment tree)
    function cmxRoot()                 external view returns (bytes32);
    function isValidAnchor(bytes32 root) external view returns (bool);
    function isSpent(bytes32 nf)         external view returns (bool);
    function treeSize()                  external view returns (uint256);

    event Mint(address indexed issuer, uint256 amount);
    event Burn(uint256 amount);
    event FrozenRootUpdated(uint256 oldRoot, uint256 newRoot);
    event Perc20Created(
        address indexed pool, address indexed issuer,
        string name, string symbol, uint8 decimals
    );
    event NoteAdded(
        bytes32 indexed cmx, bytes encCiphertext, bytes outCiphertext,
        bytes32 epk, bytes32 nfOld, bytes32 cvNetX
    );
    event NoteConfirmed(bytes32 indexed cmx, bytes32 newRoot, uint256 position);
    event BundleExecuted(uint256 valueBalance, uint256 amount, bytes32 recipientMeta);
}
```

適合性:

-   成功した`transfer`は`true`を**MUST**返します。
-   コアバンドル実行パスは公開呼び出し可能で**MUST NOT**ありません（供給不変条件; 後述）。
-   実装はSolidityを複数のコントラクトに分割しても**MAY**構いません（例: `IPERC20` + 検証者ベース）が、観測可能な[[glossary/ABI|ABI]]とイベントは上記の統一インターフェースと一致して**MUST**ください。
-   `cmxRoot()`は最新の[[glossary/commitment-tree|コミットメントツリー]]ルートです; `isValidAnchor(root)`は`root`がこれまでアクティブであった場合にのみtrueを返します; `isSpent(nf)`は[[glossary/nullifier|ナリファイア]]セットを公開します; `treeSize()`は挿入されたコミットメントの数です。

### 呼び出し形式

すべての値変更操作は、1つ以上の**[[glossary/Orchard-shielded-pool-model|Orchard]]アクション** ([Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)) をエンコードする`PrivacyCall`を提出します:

-   `actions` = `abi.encode(BundleAction[])`。
-   `bindingSig` = 値の保存を証明するSchnorrバインディング署名`[Rx, Ry, s]`。

各`BundleAction`は、[[glossary/EVM|EVM]]検証用に適合された[[glossary/Orchard-shielded-pool-model|Orchard]]アクションです: 1つの出力ノートコミットメント（`cmx`）と、その（実またはダミーの）入力の証明マテリアル。`pubFields`は以下の順序で**MUST**並べられます（[[glossary/Orchard-shielded-pool-model|Orchard]]アクションの主要入力）:

| インデックス | フィールド | ロール |
| --- | --- | --- |
| [0] | anchor | 消費された入力のマークルルート |
| [1] | cv_net_x | 正味価値コミットメントX（バインディング署名） |
| [2] | cv_net_y | 正味価値コミットメントY（バインディング署名） |
| [3] | nf_old | 消費された入力の[[glossary/nullifier|ナリファイア]] |
| [4] | rk_x | ランダム化された支出認証キーX |
| [5] | rk_y | ランダム化された支出認証キーY |
| [6] | cmx | 出力ノートコミットメント |
| [7] | rt_frozen | コンプライアンス凍結ルートバインディング |

各`pubFields[i]`は`< Fr`で**MUST**あり、`Fr`は検証者が使用するSNARK曲線のスカラーフィールドモジュラス（[参照実装](https://ethereum-magicians.org#reference-implementation)ではBN254）です; そうでない場合はリバートします（`PubFieldOutOfRange`）。実装は、`ActionPubHash`（Poseidonスポンジ）を介して8つのフィールドを1つの[[glossary/Groth16|Groth16]]公開シグナルにハッシュ化し、回路の`PubHashAction()`と一致させて**MUST**ください。

**calldataフィールドへのバインディング。** 証明の公開入力はアクションのトップレベルフィールドと一致して**MUST**ください; 以下のいずれかが失敗した場合、実装はリバートして**MUST**ください:

| チェック | リバート |
| --- | --- |
| pubFields[0] == anchor and isValidAnchor(anchor) | BadAnchor |
| pubFields[3] == nfOld | **MUST**リバート（参照実装: NullifierSpent） |
| pubFields[6] == cmx and cmx != 0 | InvalidProof / ZeroCommitment |
| pubFields[7] == cmxFrozenRoot() | BadFrozenRoot |
| spendAuthSig verifies under pubFields[4], pubFields[5] over (nfOld, cmx, epk, encCiphertext, outCiphertext) | BadSpendAuthSig |

`pubFields` ↔ calldataの等価性チェックがないと、有効な証明が異なる`nfOld`または`cmx`でリプレイされ、[[glossary/nullifier|ナリファイア]]セットをバイパスしたり、未証明のコミットメントを挿入したりする可能性があります。

`encCiphertext`は580バイト（受信者キー下の[[glossary/Orchard-shielded-pool-model|Orchard]]ノートプレーンテキスト + AEADタグ）で**MUST**ください。`outCiphertext`は80バイト（OVK下の送信者自己回復）で**SHOULD**ください。ノート暗号化レイアウトを変更する実装は、この[[glossary/ERC|ERC]]の別のバリアントを公開して**MUST**ください。

バンドルレベルの`bindingSig`は、状態変異の前に、すべてのアクション[[glossary/nullifier|ナリファイア]]、コミットメント、および操作の`valueBalance`に対して検証されて**MUST**ください（エンコーディングについてはメソッドセマンティクスを参照）。

ノート暗号化とキー導出は、[Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)の[[glossary/Orchard-shielded-pool-model|Orchard]]ノート形式に従います; 正確なエンコーディングは[参照実装](https://ethereum-magicians.org#reference-implementation)にあります。

### メソッドセマンティクス

#### `name` / `symbol` / `decimals` / `totalSupply`

[[glossary/ERC-20|ERC-20]]と同一: 公開オンチェーンビュー。

#### `transfer(PrivacyCall) → bool`

入力[[glossary/Orchard-shielded-pool-model|Orchard]]ノートを消費し、値保存型[[glossary/action-bundle|アクションバンドル]]（`valueBalance == 0`）で出力ノートを作成します。送信者、受信者、および金額はプライベートのまま**MUST**ください。成功時には`true`を返します; `Transfer(from,to,value)`ではなく`NoteAdded` / `NoteConfirmed`を発行します。

#### `mint(amount, PrivacyCall)` / `burn(amount, PrivacyCall)`

`transfer`と同じ[[glossary/Orchard-shielded-pool-model|Orchard]]アクション検証パスで、公開`totalSupply`の会計処理が行われます:

-   `mint`: `totalSupply += amount`（`onlyIssuer`）; `amount`は公開、受信者はプライベート。発行は`transfer`と同じアンカー / [[glossary/nullifier|ナリファイア]] / 支出認証パスを使用**MUST**ください（出力のみのブランチなし）。回路は消費された入力を`v = 0`に制約し、アクションが純流入を表すように**MUST**ください; コントラクトはノート値を直接読み取りません。
-   `burn`: `totalSupply -= amount`; どのホルダーも自身のノートを焼却**MAY**できます; `amount`は公開、焼却者はプライベート。

| 操作 | valueBalanceエンコーディング |
| --- | --- |
| transfer | 0 |
| burn | bit255 = 0, low bits = amount |
| mint | bit255 = 1, low bits = amount |

#### `balanceOf` (オフチェーン、プライベート)

ホルダーのみが、`NoteAdded`イベントをスキャンし、ビューイングキーで[[glossary/Orchard-shielded-pool-model|Orchard]]ノートを[[glossary/Trial-decryption|試行復号]]し、消費された[[glossary/nullifier|ナリファイア]]を除外することで、残高を計算できます。オンチェーンの`balanceOf`はなく、第三者の残高を照会する方法もありません。

#### `approve` / `allowance` / `transferFrom` (オフチェーンセマンティクス; オンチェーン = `transfer`)

承認済み支出（`approve` / `allowance` / `transferFrom`）は[[glossary/ZIP-32|ZIP-32]]階層型アカウントに基づいて構築されています: 各支出者は、所有者のメインアカウントや他のすべての支出者から暗号的に隔離された、独自の支出キーとビューイングキーを持つ専用のサブアカウント（`account_S`）を受け取ります。[[glossary/ZIP-32|ZIP-32]]はキー導出を定義します; この[[glossary/ERC|ERC]]は[[glossary/ERC-20|ERC-20]]の`approve` / `transferFrom`を以下のようにマッピングします:

1.  **`approve(spender, N)`** — 所有者は未使用の[[glossary/ZIP-32|ZIP-32]]サブアカウントを導出し、`transfer(PrivacyCall)`を介して`N`を資金提供し、そのサブアカウントの支出キーを支出者に（オフチェーンで暗号化して）配布します。オンチェーン: 1つの`transfer`。
2.  **`allowance(owner, spender)`** — そのサブアカウントの残高を、サブアカウントのビューイングキーでスキャンします。オンチェーンマッピングはありません。
3.  **`transferFrom(owner, to, amount)`** — 支出者がサブアカウントから`to`に支払うために支出します; お釣りはサブアカウントに戻ります。オンチェーン: 1つの`transfer`。
4.  **`approve(spender, 0)` / 取り消し** — 所有者は`transfer`を介してサブアカウントを回収します。

許容量の上限は、オンチェーンカウンターではなく、サブアカウントの実際のノート残高によって強制されます。ウォレットは、どのビューイングキーがノートを復号したかによって「自身の」アセットと「許容量」アセットを区別します — オンチェーンマーカーはありません。

### 実行要件

オンチェーン状態マシンは[[glossary/Orchard-shielded-pool-model|Orchardシールドプール]] ([Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)) に従います。実装は**MUST**以下を実行します:

-   [[glossary/nullifier|ナリファイア]]セットを維持します; 同じ`nf`が二度消費されて**MUST NOT**ください。
-   追加専用の[[glossary/commitment-tree|コミットメントツリー]]を維持します; 履歴ルートは`isValidAnchor`を介して照会可能です。
-   [[glossary/Groth16|Groth16]]証明、支出認証およびバインディング署名、およびすべての`pubFields`バインディングチェック（`pubFields[7]`だけでなく）を検証します。
-   重複またはゼロのコミットメントを拒否します; 空の[[glossary/action-bundle|アクション]]配列を拒否します; 呼び出しごとの[[glossary/action-bundle|アクション]]数を制限します（`maxActions`、有限で設定可能な正の境界）。
-   値の変更は`mint` / `burn` / `transfer`を介してのみ公開します（公開バンドルエントリポイントなし）。
-   デプロイ時に一度`Perc20Created`を発行します（ファクトリデプロイが**RECOMMENDED**ですが必須ではありません）。

**コンプライアンス。** `cmxFrozenRoot()`はオフチェーンブラックリスト[[glossary/SMT|SMT]]のルートです; 回路は消費されたノートがメンバーではないことを証明します。`setFrozenRoot`は`admin`のみです; 初期ルート`0`は空のブラックリストを示します。実装は、更新後の一時的な猶予期間中に直前のルートを受け入れても**MAY**構いません。これにより、処理中の証明が立ち往生するのを防ぎます。

## 理由

-   **[[glossary/Orchard-shielded-pool-model|Orchard ZK-UTXOモデル]]。** ノート、[[glossary/nullifier|ナリファイア]]、および[[glossary/commitment-tree|コミットメントツリー]]は[Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)に従います; この[[glossary/ERC|ERC]]は、[[glossary/EVM|EVM]]上でのプライベートトークンインターフェースとアセットごとのデプロイを定義します。
-   **プライベート[[glossary/ERC-20|ERC-20]]であり、異なるアセットではない。** 同じメソッドサーフェス; プライバシーは公開度（公開ビュー vs プライベートクエリ vs 区別不能な転送）を変更しますが、ユーザーの意図は変更しません。
-   **すべての移動に対して1つのオンチェーン操作。** `transfer` / `approve` / `transferFrom`を統合することで、[[glossary/ERC-20|ERC-20]]が不可避的に漏洩する承認メタデータが削除されます。
-   **[[glossary/ZIP-32|ZIP-32]]サブアカウントを介した承認済み支出。** 各支出者は、オンチェーンの`allowance`マッピングの代わりに、隔離された階層型アカウントを取得します; メソッドセマンティクスを参照してください。
-   **`approve(contract)`なし。** コントラクトは秘密鍵を持っていません; 支出キーをオンチェーンに置くと、誰にでも公開されてしまいます。プログラム可能なプライベート支出（述語承認ノート、MPCカストディ）は将来の作業であり、この[[glossary/ERC|ERC]]の一部ではありません。
-   **ウォレットの動作はオンチェーン[[glossary/ABI|ABI]]の範囲外。** サブアカウントのレイアウト、暗号化されたキーの配布、およびノートのスキャンはウォレット/SDKの責任です; 準拠した参照は[参照実装](https://ethereum-magicians.org#reference-implementation)で提供されています。

## 後方互換性

`pERC20`は[[glossary/ERC-20|ERC-20]]と**機能的に完全 (capability-complete)** ですが、**バイト互換性はありません**: 公開`balanceOf`なし、オンチェーン`allowance`なし、`approve`/`transferFrom`の[[glossary/ABI|ABI]]なし、`Transfer`/`Approval`イベントなし。既存の[[glossary/ERC-20|ERC-20]]インデクサーや構成可能なコントラクトは、プライバシー対応のウォレット/SDKなしではこれを駆動できません。

公開[[glossary/ERC-20|ERC-20]]ツインへのオプションの`bridgeOut`は、出口でプライバシーを終了させる**MAY**ことができます; この提案では必須ではありません。

## テストケース

[参照実装](https://ethereum-magicians.org#reference-implementation)リポジトリには以下が含まれます:

-   Foundryユニットテスト（`test/PERC20Test.t.sol`）: コンストラクタガード、発行/焼却/転送の会計処理、供給不変条件。
-   エンドツーエンドテスト（`test/PERC20E2E.t.sol`、`e2e/`）: デプロイされた`PERC20`に対する実際の[[glossary/Groth16|Groth16]]証明。発行、転送、焼却、および`approve` / `transferFrom`フローをカバーしています。

## 参照実装

### コード

参照実装: [PERC20Labs/pERC20\_](https://github.com/PERC20Labs/pERC20_)。

-   規範的なアセットコントラクト: `contracts/ptoken/PERC20.sol` (`IPERC20`)。
-   暗号およびウォレット形式（キー導出、`perc1`アドレス、ノート暗号化、[[glossary/nullifier|ナリファイア]]、`approve`パッケージング）: 同じリポジトリ内の参照ライブラリおよびSDK。

### 関連標準およびプロトコル

-   [[glossary/EIP|EIP]]-20: トークン標準 — `pERC20`がマッピングする公開[[glossary/Privacy-native-fungible-token|ファンジブルトークン]]インターフェース。
-   [Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf): [[glossary/Orchard-shielded-pool-model|Orchardシールドプール]] — ノートコミットメント、[[glossary/nullifier|ナリファイア]]、ノート暗号化、および[[glossary/action-bundle|アクション]]構造は、[[glossary/EVM|EVM]][[glossary/Groth16|Groth16]]検証用にここで適合されています。
-   [[glossary/ZIP-32|ZIP-32]]: シールド階層型決定性ウォレット — `approve` / `transferFrom`における支出者ごとのサブアカウントに使用される階層型アカウント導出。

## セキュリティに関する考慮事項

-   **二重支払い保護**: [[glossary/nullifier|ナリファイア]]セット + 正しい`nf`導出。各`pubFields[i]`は`< Fr`で**MUST**ください（そうでない場合、`nf + Fr`は異なる`isSpent`キーで証明を再利用します）; `pubFields[0]`、`[3]`、`[6]`はそれぞれ`anchor`、`nfOld`、`cmx`と等しく**MUST**ください（そうでない場合、有効な証明が異なるcalldataにバインドされる可能性があります）。
-   **供給不変条件**: 値の変更は`mint`/`burn`/`transfer`を介してのみ行われます; コア実行パスは公開呼び出し可能で**MUST NOT**ください。
-   **価値保存**: 状態変異の前にバインディング署名が検証されます。
-   **リプレイ保護**: sighashは`chainId`、コントラクトアドレス、およびすべての`nf`/`cmx`をバインドします。
-   **サブアカウント支出キー**: `approve`のために配布されるキーは、暗号文としてのみ現れて**MUST**ください; コントラクトストレージには決して現れて**MUST NOT**ください。
-   **コンプライアンス権限**: `setFrozenRoot`は高信頼の管理者ロールです; [[glossary/Multisig|マルチシグ]]/[[glossary/Timelock|タイムロック]]を使用**SHOULD**ください。

### プライバシーに関する考慮事項

-   操作は[[glossary/Relayer|リレイヤー]]を介して提出され、提出者[[glossary/EOA|EOA]]を隠す**SHOULD**ください。
-   `mint`/`burn`の`amount`と`totalSupply`は公開です; 転送金額と`approve`の関係はプライベートです。
-   `approve`/`transferFrom`は`transfer`とオンチェーンで区別不能です（同じ`transfer(PrivacyCall)`セレクター）; `mint`/`burn`は公開金額を持つ別々の関数です。
-   [[glossary/Trial-decryption|試行復号]]は受信の信頼境界です: `NoteAdded`イベントだけでは支払いを証明しません; 回路は`encCiphertext`が`cmx`と一致することを検証しません。
-   `setFrozenRoot`は、管理者がオフチェーンブラックリストを介して識別されたノートを凍結することを可能にします; これは完全なトラストレス性に対する明示的なコンプライアンス上のトレードオフです。

## 著作権

著作権および関連する権利は[CC0](https://creativecommons.org/publicdomain/zero/1.0/)により放棄されます。

この文書を引用する際は、Cyimon、「[[glossary/ERC-7605|ERC]]-7605: プライベートトークン標準」、*イーサリアム改善提案*、2026年6月、と記述してください。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/perc20-private-token-standard/28796)
