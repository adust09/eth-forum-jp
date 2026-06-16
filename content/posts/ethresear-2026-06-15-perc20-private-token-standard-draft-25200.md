---
title: 'pERC20: プライベートトークン標準 (ドラフト)'
original_title: '# pERC20: Private Token Standard (Draft)'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/perc20-private-token-standard-draft/25200'
author: JiangXb-son
date: '2026-06-15'
category: Privacy
tags:
  - privacy
  - tokenomics
  - smart-contracts
  - evm
  - cryptography
  - zk
  - eip
  - research
topic_id: '25200'
translated_at: '2026-06-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [# pERC20: Private Token Standard (Draft)](https://ethresear.ch/t/perc20-private-token-standard-draft/25200) — JiangXb-son (2026-06-15)

**著者:** Cyimon ([@Cyimon](https://github.com/Cyimon)) · **ステータス:** ドラフト · **タイプ:** 標準トラック ([[glossary/ERC|ERC]]) · **[[glossary/EIP|EIP]]**: [8287 (PR)](https://github.com/ethereum/ERCs/pull/1796) · **作成日:** 2026-06-09

**説明:** EVM向けの、デフォルトでプライベートなファンジブルトークン標準。

> **議論:** [ethresear.ch #25089](https://ethresear.ch/t/perc20-privacy-native-fungible-token-standard-draft/25089) · [Ethereum Magicians #28702](https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702) · **実装:** [PERC20Labs/pERC20\_](https://github.com/PERC20Labs/pERC20_)

* * *

以前公開されたpERC20プロトコル設計 ([Ethereum Magicians #28702](https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702) / [ethresear.ch #25089](https://ethresear.ch/t/perc20-privacy-native-fungible-token-standard-draft/25089)) を拡張します。この改訂版の主な追加点は、[[glossary/ZIP-32|ZIP-32]] サブアカウントを介した**[[glossary/ERC|ERC]]-20承認済み支出** — `approve`、`allowance`、および `transferFrom` — です。更新された標準は、[[glossary/ERC|ERC]]-[[glossary/ERC|20]]と**機能的に完全互換 (capability-complete)** ですが、**バイト互換性はありません** (異なるABI、公開残高なし)。

| ERC-20 | pERC20 | レイヤー |
| --- | --- | --- |
| name / symbol / decimals / totalSupply | はい — 同じ公開ビュー | オンチェーン |
| balanceOf | はい — ホルダーのみのスキャン | オフチェーン |
| transfer | はい — プライベートな当事者と金額 | オンチェーン |
| approve / allowance / transferFrom | 新規 — [[glossary/ZIP-32|ZIP-32]] サブアカウントを介したEOAスペンダー向けの承認済み支出。オンチェーン = transfer (コントラクトスペンダーはサポートされません) | オフチェーン |
| mint / burn | はい — 一般的な拡張 | オンチェーン |
| Transfer / Approval イベント | 省略 (プライバシー) | — |

以下は最新のpERC20標準: **プライベートトークン標準**です。

* * *

## 概要

`pERC20` は、[[glossary/EVM|EVM]]向けの**デフォルトでプライベートなファンジブルトークン標準**です。これは[[glossary/ERC|ERC]]-[[glossary/ERC|20]]のプライバシーバージョンです。内部的には、[Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)のOrchardシールドプールモデルを使用しています。[[glossary/ERC|ERC]]-[[glossary/ERC|20]]の全メソッドインターフェース (method surface) を維持していますが、いくつかのメソッドは公開オンチェーン読み取りではなく**プライベート** (ホルダーのみ、オフチェーン) であり、`transfer` / `approve` / `transferFrom` はすべてオンチェーンでは同じ `transfer` 操作として現れます。以下の**pERC20インターフェース**を参照してください。

## 動機

イーサリアムの公開台帳は、すべての[[glossary/ERC|ERC]]-[[glossary/ERC|20]]残高、転送、およびアローワンスを永続的に可視化します。支払い、給与、財務、およびオンチェーン金融が[[glossary/Layer-1|L1]]に移行するにつれて、ユーザーと発行者は**プライベートなファンジブルトークン**を必要としています — 公開残高に関するプライベートなメッセージングだけでなく。

プライバシーはプロトコル層でますます対処されています。例えば、[[glossary/EIP|EIP]]-8182は**プロトコルに組み込まれたシールドプール**を定義しています。ユーザーは公開ETHまたは互換性のある[[glossary/ERC|ERC]]-[[glossary/ERC|20]]トークンをデポジットし、共有プール内でプライベートに価値を移動させ、公開形式に戻して引き出します。このモデルは**既存の公開資産をシールドします**が、**作成時からプライベートなトークンを発行する方法**は定義していません。

`pERC20` は後者のギャップを埋めます。これは、**ネイティブにプライベートなファンジブルトークン**のためのアプリケーション層トークン標準です。ミント、保持、転送、および `approve` / `transferFrom` を介した支出が、最初からプライベートノートとして行われ、公開の `balanceOf` フェーズや共有シールドプールへのデポジットは必要ありません。これは[[glossary/ERC|ERC]]-[[glossary/ERC|20]]のプライベートな対応物を指定します — 同じメソッドインターフェース、異なる公開性 — そのため、プロトコルレベルのプライバシー (例: [[glossary/EIP|EIP]]-8182) が並行して進化する間も、発行者は今日からプライベート資産を立ち上げることができます。両者は補完的であり、競合するものではありません。[[glossary/EIP|EIP]]-8182は公開資産をプライベート化し、`pERC20` はプライベート資産の発行を定義します。

## 仕様

キーワード **MUST**、**MUST NOT**、**SHOULD**、**MAY** はRFC 2119に従って解釈されます。Solidity構文は`0.8.20`以上です。

### 基盤となるプロトコル

価値はアカウント残高ではなく、シールドノートに保持されます。ノート形式、[[glossary/nullifier|ナリファイア]]、コミットメントツリー、ノート暗号化、およびアクション/バンドル構造は、[Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)の**Orchardシールドプール**に従い、ここでは[[glossary/Groth16|Groth16]]で検証されるアセットごとの[[glossary/EVM|EVM]]コントラクトとして適応されています。以下に繰り返されないフィールドレベルの形式は、**参照実装**セクションで規範的です。

### pERC20インターフェース

このセクションでは、**すべてのpERC20インターフェース**を一箇所にリストし、それぞれが[[glossary/ERC|ERC]]-[[glossary/ERC|20]]標準インターフェースに対応するかどうかを示します。**ERC-20**: `yes` = [[glossary/ERC|ERC]]-[[glossary/ERC|20]]標準; `extension` = 一般的な拡張 (mint/burn); `no` = pERC20固有。**レイヤー**: `on-chain` = コントラクトABI; `off-chain` = ウォレット/SDK (コントラクトメソッドなし)。

| pERC20インターフェース | ERC-20 | レイヤー | 公開性 | 説明 |
| --- | --- | --- | --- | --- |
| name() / symbol() / decimals() | yes | オンチェーン | public | [[glossary/ERC|ERC]]-[[glossary/ERC|20]]と同一 |
| totalSupply() | yes | オンチェーン | public | 公開カウンター (mint − burn) |
| balanceOf(addr) | yes | オフチェーン | private | [[glossary/viewing-key|ビューイングキー]]でOrchardノートをスキャン; ホルダーのみ |
| transfer([[glossary/PrivacyCall|PrivacyCall]]) | yes | オンチェーン | private (当事者 + 金額) | Orchardアクションバンドル |
| approve(spender, N) | yes | オフチェーン | private (関係は隠蔽) | [[glossary/ZIP-32|ZIP-32]] サブアカウント; キーを資金提供 + 配信; オンチェーンではtransfer([[glossary/PrivacyCall|PrivacyCall]])として提出 |
| allowance(owner, spender) | yes | オフチェーン | private | サブアカウントの残り残高をスキャン |
| transferFrom(from, to, amount) | yes | オフチェーン | private (関係は隠蔽) | スペンダーがサブアカウントから `to` に支払う; お釣りはサブアカウントに戻る。オンチェーンではtransfer([[glossary/PrivacyCall|PrivacyCall]])として提出 |
| mint(amount, [[glossary/PrivacyCall|PrivacyCall]]) | extension | オンチェーン | 金額は公開; 受取人はプライベート | 発行者のみ; Orchardアクション + totalSupply増加 |
| burn(amount, [[glossary/PrivacyCall|PrivacyCall]]) | extension | オンチェーン | 金額は公開; バーナーはプライベート | ホルダーが自身のノートをバーン; Orchardアクション + totalSupply減少 |
| issuer() | no | オンチェーン | public | トークン発行者アドレス |
| [[glossary/cmxFrozenRoot|cmxFrozenRoot]]() / [[glossary/setFrozenRoot|setFrozenRoot]]() | no | オンチェーン | 公開ルート; 管理者書き込み | [[glossary/Compliance-frozen-note-root|コンプライアンス凍結ノートルート]] |
| [[glossary/cmxRoot|cmxRoot]]() / [[glossary/isValidAnchor|isValidAnchor]]() / [[glossary/isSpent|isSpent]]() / [[glossary/treeSize|treeSize]]() | no | オンチェーン | public | Orchardコミットメントツリーの状態 |

#### イベント

| pERC20イベント | ERC-20 | レイヤー | 説明 |
| --- | --- | --- | --- |
| Transfer(from, to, value) | yes | オフチェーン (省略) | 発行されません; 当事者と金額はプライベートです |
| Approval(owner, spender, value) | yes | オフチェーン (省略) | 発行されません; owner ↔ spenderをリンクすることになります |
| [[glossary/NoteAdded|NoteAdded]] / [[glossary/NoteConfirmed|NoteConfirmed]] | Transferを置き換え | オンチェーン | ノートごとの可視性 |
| [[glossary/Mint|Mint]] / [[glossary/Burn|Burn]] | extension | オンチェーン | 公開金額のみ |
| [[glossary/Perc20Created|Perc20Created]] / [[glossary/FrozenRootUpdated|FrozenRootUpdated]] / [[glossary/BundleExecuted|BundleExecuted]] | no | オンチェーン | デプロイメント、コンプライアンス、バンドルメタデータ |

**オンチェーンでの区別不能性 (On-chain indistinguishability)。** `transfer`、`approve` の資金提供ステップ、`transferFrom`、および取り消し・回収はすべて同じオンチェーン呼び出しです: `transfer([[glossary/PrivacyCall|PrivacyCall]])`。オブザーバーはどの[[glossary/ERC|ERC]]-[[glossary/ERC|20]]操作が実行されているかを判別できません。

**ネイティブにはサポートされない。** [[glossary/ERC|ERC]]-[[glossary/ERC|20]]の `approve(contractAddress, amount)` — コントラクトが自律的に `transferFrom` を呼び出す — にはネイティブな同等物がありません。支出にはプライベートキーが必要であり、コントラクトはそれを保持できません。理由 (Rationale) を参照してください。

### コントラクトインターフェース

`pERC20` は1つのオンチェーンABI (`IPERC20`; 上記の**pERC20インターフェース**を参照) を公開します。その表で**オフチェーン**とマークされたメソッドにはコントラクトのエントリポイントがありません。動作は以下の**メソッドセマンティクス**で指定されます。

```solidity
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

-   成功した `transfer` は `true` を**MUST**返します。
-   コアのバンドル実行パスは公開呼び出し可能で**MUST NOT**ありません (供給不変条件; 以下を参照)。
-   実装はSolidityを複数のコントラクトに分割しても**MAY**構いません (例: `IPERC20` + 検証者ベース) が、観測可能なABIとイベントは上記の統一されたインターフェースと**MUST**一致します。
-   `cmxRoot()` は最新のコミットメントツリーのルートです; `isValidAnchor(root)` は `root` が過去にアクティブであった場合にのみtrueを返します; `isSpent(nf)` は[[glossary/nullifier|ナリファイア]]セットを公開します; `treeSize()` は挿入されたコミットメントの数です。

### 呼び出し形式

すべての値を変更する操作は、1つ以上の**Orchardアクション** ([Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)) をエンコードする[[glossary/PrivacyCall|PrivacyCall]]を提出します:

-   `actions` = `abi.encode(BundleAction[])`。
-   `bindingSig` = 価値保存を証明するシュノアバインディング署名 `[Rx, Ry, s]`。

各[[glossary/BundleAction|BundleAction]]は、[[glossary/EVM|EVM]]検証用に適応されたOrchardアクションです: 1つの出力ノートコミットメント ([[glossary/cmx|cmx]]) と、その (実またはダミーの) 入力に対する証明マテリアル。[[glossary/pubFields|pubFields]]は以下の順序で**MUST**並べられます (Orchardアクションの主要入力):

| インデックス | フィールド | 役割 |
| --- | --- | --- |
| [0] | anchor | 消費された入力のマークルルート |
| [1] | cv_net_x | 正味価値コミットメントX (バインディング署名) |
| [2] | cv_net_y | 正味価値コミットメントY (バインディング署名) |
| [3] | nf_old | 消費された入力の[[glossary/nullifier|ナリファイア]] |
| [4] | rk_x | ランダム化された[[glossary/spendAuthSig|spend-auth]]キーX |
| [5] | rk_y | ランダム化された[[glossary/spendAuthSig|spend-auth]]キーY |
| [6] | cmx | 出力ノートコミットメント |
| [7] | rt_frozen | コンプライアンス凍結ルートバインディング |

各 `pubFields[i]` は `< Fr` で**MUST**なければなりません。ここで `Fr` は検証者が使用する[[glossary/SNARK-curve|SNARK曲線]]のスカラー体モジュラスです (参照実装では[[glossary/BN254|BN254]])。そうでない場合はリバートします (`PubFieldOutOfRange`)。実装は、8つのフィールドを `ActionPubHash` ([[glossary/Poseidon-sponge|ポセイドンスポンジ]]) を介して1つの[[glossary/Groth16|Groth16]]公開シグナルにハッシュ化し、回路の `PubHashAction()` と一致させる**MUST**必要があります。

**calldataフィールドへのバインディング。** 証明の公開入力はアクションのトップレベルフィールドと**MUST**一致します。実装は、以下のいずれかが失敗した場合に**MUST**リバートします:

| チェック | リバート |
| --- | --- |
| pubFields[0] == anchor and isValidAnchor(anchor) | BadAnchor |
| pubFields[3] == nfOld | **MUST**リバート (参照実装: NullifierSpent) |
| pubFields[6] == cmx and cmx != 0 | InvalidProof / ZeroCommitment |
| pubFields[7] == cmxFrozenRoot() | BadFrozenRoot |
| spendAuthSig verifies under pubFields[4], pubFields[5] over (nfOld, cmx, epk, encCiphertext, outCiphertext) | BadSpendAuthSig |

`pubFields` ↔ calldataの等価性チェックがないと、有効な証明が異なる `nfOld` または `cmx` でリプレイされ、[[glossary/nullifier|ナリファイア]]セットをバイパスしたり、証明されていないコミットメントを挿入したりする可能性があります。

[[glossary/encCiphertext|encCiphertext]]は580バイト (**MUST** Orchardノートプレーンテキスト + 受取人キー下のAEADタグ)。[[glossary/outCiphertext|outCiphertext]]は80バイト (**SHOULD** 送信者自己回復のためのOVK下)。ノート暗号化レイアウトを変更する実装は、この[[glossary/ERC|ERC]]の別のバリアントを公開**MUST**する必要があります。

バンドルレベルの[[glossary/bindingSig|bindingSig]]は、状態変更の前に、すべてのアクション[[glossary/nullifier|ナリファイア]]、コミットメント、および操作の[[glossary/valueBalance|valueBalance]]に対して検証される**MUST**必要があります (エンコーディングについてはメソッドセマンティクスを参照)。

ノート暗号化とキー導出は、[Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)のOrchardノート形式に従います。正確なエンコーディングは参照実装リポジトリにあります。

### メソッドセマンティクス

#### `name` / `symbol` / `decimals` / `totalSupply`

[[glossary/ERC|ERC]]-[[glossary/ERC|20]]と同一: 公開オンチェーンビュー。

#### `transfer(PrivacyCall) → bool`

入力[Orchard](https://zips.z.cash/protocol/protocol.pdf)ノートを消費し、価値保存アクションバンドル (`valueBalance == 0`) で出力ノートを作成します。送信者、受取人、および金額はプライベートのまま**MUST**です。成功時に `true` を返します; `Transfer(from,to,value)` ではなく、[[glossary/NoteAdded|NoteAdded]] / [[glossary/NoteConfirmed|NoteConfirmed]] を発行します。

#### `mint(amount, PrivacyCall)` / `burn(amount, PrivacyCall)`

`transfer` と同じ[Orchard](https://zips.z.cash/protocol/protocol.pdf)アクション検証パスで、公開 `totalSupply` 会計が行われます:

-   `mint`: `totalSupply += amount` (`onlyIssuer`); `amount` は公開、受取人はプライベート。[[glossary/Mint|Mint]]は `transfer` と同じアンカー / [[glossary/nullifier|ナリファイア]] / [[glossary/spendAuthSig|spend-auth]] パスを**MUST**使用します (出力のみのブランチはありません)。回路は消費された入力を `v = 0` に制約し、アクションが純流入を表すように**MUST**します。コントラクトはノートの値を直接読み取りません。
-   `burn`: `totalSupply -= amount`; 任意のホルダーは自身のノートをバーン**MAY**できます; `amount` は公開、バーナーはプライベート。

| 操作 | valueBalanceエンコーディング |
| --- | --- |
| transfer | 0 |
| burn | bit255 = 0, 下位ビット = amount |
| mint | bit255 = 1, 下位ビット = amount |

#### `balanceOf` (オフチェーン、プライベート)

ホルダーのみが、[[glossary/NoteAdded|NoteAdded]]イベントをスキャンし、[[glossary/viewing-key|ビューイングキー]]で[Orchard](https://zips.z.cash/protocol/protocol.pdf)ノートを試行復号 (trial-decrypt) し、消費された[[glossary/nullifier|ナリファイア]]を除外することで、自身の残高を計算できます。オンチェーンの `balanceOf` はなく、第三者の残高をクエリする方法もありません。

#### `approve` / `allowance` / `transferFrom` (オフチェーンセマンティクス; オンチェーン = `transfer`)

承認済み支出 (`approve` / `allowance` / `transferFrom`) は[[glossary/ZIP-32|ZIP-32]]階層型アカウントに基づいて構築されています。各**EOAスペンダー**は、独自の[[glossary/spending-key|スペンディングキー]]と[[glossary/viewing-key|ビューイングキー]]を持つ専用のサブアカウント (`account_S`) を受け取ります。これは、所有者のメインアカウントや他のすべてのスペンダーから暗号的に隔離されています。[[glossary/ZIP-32|ZIP-32]]はキー導出を定義し、この[[glossary/ERC|ERC]]は[[glossary/ERC|ERC]]-[[glossary/ERC|20]]の `approve` / `transferFrom` を以下のようにマッピングします:

1.  **`approve(spender, N)`** — 所有者は未使用の[[glossary/ZIP-32|ZIP-32]]サブアカウントを導出し、`transfer([[glossary/PrivacyCall|PrivacyCall]])` を介して `N` を資金提供し、そのサブアカウントの[[glossary/spending-key|スペンディングキー]]をEOAスペンダーに (オフチェーンで暗号化して) 配信します。オンチェーン: 1回の `transfer`。
2.  **`allowance(owner, spender)`** — そのサブアカウントの残り残高を、サブアカウントの[[glossary/viewing-key|ビューイングキー]]でスキャンします。オンチェーンマッピングはありません。
3.  **`transferFrom(owner, to, amount)`** — スペンダーはサブアカウントから `to` に支払うために支出します; お釣りはサブアカウントに戻ります。オンチェーン: 1回の `transfer`。
4.  **`approve(spender, 0)` / 取り消し** — 所有者は `transfer` を介してサブアカウントを回収します。

アローワンスの上限は、オンチェーンカウンターではなく、サブアカウントの実際のノート残高によって強制されます。ウォレットは、どの[[glossary/viewing-key|ビューイングキー]]がノートを復号したかによって「自身の」資産と「アローワンス」資産を区別します — オンチェーンマーカーはありません。

### 実行要件

オンチェーン状態マシンはOrchardシールドプール ([Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)) に従います。実装は**MUST**以下を行います:

-   [[glossary/nullifier|ナリファイア]]セットを維持します; 同じ `nf` は2回消費されては**MUST NOT**なりません。
-   追記専用のコミットメントツリーを維持します; 履歴ルートは `isValidAnchor` を介してクエリ可能です。
-   [[glossary/Groth16|Groth16]]証明、[[glossary/spendAuthSig|spend-auth]]および[[glossary/bindingSig|bindingSig]]、およびすべての[[glossary/pubFields|pubFields]]バインディングチェック ( `pubFields[7]` のみではない) を検証します。
-   重複またはゼロのコミットメントを拒否します; 空のアクション配列を拒否します; 呼び出しごとのアクション数を上限設定します (`maxActions`、有限で設定可能な正の境界)。
-   値の変更を `mint` / `burn` / `transfer` を介してのみ公開します (公開バンドルエントリポイントはありません)。
-   デプロイ時に一度だけ[[glossary/Perc20Created|Perc20Created]]を発行します (ファクトリデプロイメントが**RECOMMENDED**ですが、必須ではありません)。

**コンプライアンス。** [[glossary/cmxFrozenRoot|cmxFrozenRoot]]() はオフチェーンのブラックリストSMTのルートです; 回路は消費されたノートの非メンバーシップを証明します。[[glossary/setFrozenRoot|setFrozenRoot]]は `admin` のみです; 初期ルート `0` は空のブラックリストを示します。実装は、更新後短い猶予期間中に直前のルートを受け入れる**MAY**ことができ、処理中の証明が立ち往生しないようにします。

## 理由 (Rationale)

-   **Orchard ZK-UTXOモデル。** ノート、[[glossary/nullifier|ナリファイア]]、およびコミットメントツリーは[Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf)に従います; この[[glossary/ERC|ERC]]は[[glossary/EVM|EVM]]上でのプライベートトークンインターフェースとアセットごとのデプロイメントを定義します。
-   **プライベート[[glossary/ERC|ERC]]-[[glossary/ERC|20]]であり、異なる資産ではない。** 同じメソッドインターフェース; プライバシーは公開性 (公開ビュー vs プライベートクエリ vs 区別不能な転送) を変更しますが、ユーザーの意図は変更しません。
-   **すべての移動に対して1つのオンチェーン操作。** `transfer` / `approve` / `transferFrom` を統合することで、[[glossary/ERC|ERC]]-[[glossary/ERC|20]]が不可避的に漏洩する承認メタデータが削除されます。
-   **[[glossary/ZIP-32|ZIP-32]]サブアカウントを介した承認済み支出。** 各EOAスペンダーは、オンチェーンの `allowance` マッピングの代わりに、隔離された階層型アカウントを取得します; メソッドセマンティクスを参照してください。
-   **`approve(contract)` はなし。** コントラクトはプライベートキーを持っていません; [[glossary/spending-key|スペンディングキー]]をオンチェーンに置くと、誰にでも公開されてしまいます。プログラム可能なプライベート支出 (述語承認ノート、MPCカストディ) は将来の作業であり、この[[glossary/ERC|ERC]]の一部ではありません。
-   **ウォレットの動作はオンチェーンABIの範囲外。** サブアカウントのレイアウト、暗号化されたキー配信、およびノートスキャンはウォレット/SDKの責任です; 参照実装を参照してください。

## 後方互換性

`pERC20` は[[glossary/ERC|ERC]]-[[glossary/ERC|20]]と**機能的に完全互換 (capability-complete)** ですが、**バイト互換性はありません**。公開 `balanceOf`、オンチェーン `allowance`、`approve`/`transferFrom` ABI、`Transfer`/`Approval` イベントはありません。既存の[[glossary/ERC|ERC]]-[[glossary/ERC|20]]インデクサーや構成可能なコントラクトは、プライバシー対応のウォレット/SDKなしではこれを駆動できません。

公開[[glossary/ERC|ERC]]-[[glossary/ERC|20]]ツインへのオプションの `bridgeOut` は、出口でプライバシーを終了**MAY**する可能性がありますが、この提案では必須ではありません。

## テストケース

参照実装リポジトリには以下が含まれます:

-   Foundryユニットテスト (`test/PERC20Test.t.sol`): コンストラクタガード、mint/burn/transfer会計、供給不変条件。
-   エンドツーエンドテスト (`test/PERC20E2E.t.sol`, `e2e/`): デプロイされた `PERC20` に対する実際の[[glossary/Groth16|Groth16]]証明。mint、transfer、burn、および `approve` / `transferFrom` フローをカバーします。

## 参照実装

### コード

参照実装: [PERC20Labs/pERC20\_](https://github.com/PERC20Labs/pERC20_).

-   規範的なアセットコントラクト: `contracts/ptoken/PERC20.sol` (`IPERC20`)。
-   暗号化およびウォレット形式 (キー導出、`perc1`アドレス、ノート暗号化、[[glossary/nullifier|ナリファイア]]、`approve`パッケージング): 同じリポジトリ内の参照ライブラリおよびSDK。

### 関連する標準およびプロトコル

-   [[glossary/EIP|EIP]]-[[glossary/ERC|20]] ([https://eips.ethereum.org/EIPS/eip-20](https://eips.ethereum.org/EIPS/eip-20)): トークン標準 — `pERC20` がマッピングする公開ファンジブルトークンインターフェース。
-   [Zcashプロトコル仕様](https://zips.z.cash/protocol/protocol.pdf): Orchardシールドプール — ここで[[glossary/EVM|EVM]][[glossary/Groth16|Groth16]]検証用に適応されたノートコミットメント、[[glossary/nullifier|ナリファイア]]、ノート暗号化、およびアクション構造。
-   [[glossary/ZIP-32|ZIP-32]] ([https://zips.z.cash/zip-0032](https://zips.z.cash/zip-0032)): シールド階層型決定性ウォレット — `approve` / `transferFrom` におけるスペンダーごとのサブアカウントに使用される階層型アカウント導出。

## セキュリティに関する考慮事項

-   **二重支払い保護**: [[glossary/nullifier|ナリファイア]]セット + 正しい `nf` 導出。各 `pubFields[i]` は `< Fr` で**MUST**なければなりません (そうでない場合、`nf + Fr` は異なる `isSpent` キーで証明を再利用します); `pubFields[0]`、`[3]`、`[6]` はそれぞれ `anchor`、`nfOld`、`cmx` と**MUST**等しくなければなりません (そうでない場合、有効な証明が異なるcalldataにバインドされる可能性があります)。
-   **供給不変条件**: 値の変更は `mint`/`burn`/`transfer` を介してのみ行われます; コア実行パスは公開呼び出し可能で**MUST NOT**ありません。
-   **価値保存**: 状態変更の前に[[glossary/bindingSig|bindingSig]]が検証されます。
-   **リプレイ保護**: sighashは `chainId`、コントラクトアドレス、およびすべての `nf`/`cmx` をバインドします。
-   **サブアカウント[[glossary/spending-key|スペンディングキー]]**: `approve` のために配信されるキーは、暗号文としてのみ現れる**MUST**必要があります; コントラクトストレージには決して現れません。
-   **コンプライアンス権限**: [[glossary/setFrozenRoot|setFrozenRoot]]は高信頼の管理者ロールです; [[glossary/Multisig|マルチシグ]]/タイムロックを**SHOULD**使用します。

### プライバシーに関する考慮事項

-   操作は[[glossary/relayer|リレイヤー]]を介して提出され、提出者のEOAを隠す**SHOULD**必要があります。
-   `mint`/`burn` の `amount` と `totalSupply` は公開です; 転送金額と `approve` の関係はプライベートです。
-   `approve`/`transferFrom` は `transfer` とオンチェーンで区別不能です (同じ `transfer([[glossary/PrivacyCall|PrivacyCall]])` セレクター); `mint`/`burn` は公開金額を持つ別々の関数です。
-   試行復号 (trial-decryption) は受領の信頼境界です: [[glossary/NoteAdded|NoteAdded]]イベントだけでは支払いを証明しません; 回路は `encCiphertext` が `cmx` と一致することを検証しません。
-   [[glossary/setFrozenRoot|setFrozenRoot]]は、管理者がオフチェーンのブラックリストを介して識別されたノートを凍結することを可能にします; これは完全なトラストレス性とのコンプライアンス上の明示的なトレードオフです。

## 著作権

著作権および関連する権利は[CC0](https://creativecommons.org/publicdomain/zero/1.0/)により放棄されます。

この文書を引用する際は、Cyimon, “ERC-8287: Private Token Standard,” *Ethereum Improvement Proposals*, June 2026. としてください。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/perc20-private-token-standard-draft/25200)
