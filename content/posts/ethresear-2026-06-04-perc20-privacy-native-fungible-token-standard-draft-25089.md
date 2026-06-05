---
title: 'pERC20: プライバシーネイティブな代替可能トークン標準 (ドラフト)'
original_title: 'pERC20: Privacy-Native Fungible Token Standard (Draft)'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/perc20-privacy-native-fungible-token-standard-draft/25089
author: JiangXb-son
date: '2026-06-04'
category: Privacy
tags:
  - privacy
  - smart-contracts
  - zk
  - cryptography
  - eip
  - tokenomics
  - evm
topic_id: '25089'
translated_at: '2026-06-05'
translator: gemini-2.5-flash
---

> [!note] 原文
> [pERC20: Privacy-Native Fungible Token Standard (Draft)](https://ethresear.ch/t/perc20-privacy-native-fungible-token-standard-draft/25089) — JiangXb-son (2026-06-04)

**著者:** [\_pERC20Labs](https://x.com/_pERC20) · **種類:** Standards Track ([[ERC|Ethereum Request for Comments (ERC)]]) · **作成日:** 2026-06-03

* * *

## 簡易要約

プライバシーネイティブな代替可能トークン (fungible tokens) のための標準インターフェース。

## 概要

以下の標準は、EVM上のスマートコントラクト内で**プライバシーネイティブな代替可能トークン**のための標準APIの実装を可能にする。この標準は、残高と送金量がデフォルトでプライベートであるトークンを、公開検証可能な`totalSupply`を維持しつつ、送金、ミント、バーンするための基本的な機能を提供する。トークンは、発行時から暗号化されたUTXOノート（Groth16証明、Orchardスタイルのモデル）として存在する。各pERC20アセットは、アセットコントラクトによって維持される**コンプライアンス凍結ルート (compliance frozen root)** にバインドされなければならず、これによりブラックリストに登録されたノートは使用できなくなる。

この標準は[[ERC|Ethereum Request for Comments (ERC)]]-20とバイナリ互換性が**ない**。公開の`balanceOf`や`approve` / `allowance`は存在しない。代わりに、同等のプライバシーインターフェースである`IPERC20`を定義する。

この提案は[[EIP|EIP（Ethereum 改善提案）]]-8182を補完するものである。[[EIP|EIP（Ethereum 改善提案）]]-8182はETHおよび互換性のある[[ERC|Ethereum Request for Comments (ERC)]]-20アセットのプライベート送金レイヤーを対象としているが、pERC20はアセットレベルでプライバシーネイティブなトークン標準インターフェースを定義する。

## 動機

イーサリアムは、プロトコル層での**ネイティブなプライバシー**にますます注力している。いくつかの[[EIP|EIP（Ethereum 改善提案）]]はすでに、[[FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]] ([[EIP|EIP（Ethereum 改善提案）]]-7805)、[[フレームトランザクション (Frame Transactions)|EIP-8141 frame transaction]] ([[EIP|EIP（Ethereum 改善提案）]]-8141)、[[キー付きNonce (Keyed Nonces)|EIP-8250 Keyed Nonces]] ([[EIP|EIP（Ethereum 改善提案）]]-8250)、[[EIP|EIP（Ethereum 改善提案）]]-8272 (Recent Roots) を含む、補完的な構成要素を提案している。これらの提案がまとめて採用されれば、イーサリアムはベースレイヤーでトラストレスで検閲耐性のあるプライベートトランザクションをサポートできるようになり、エコシステムは公開トークンに対して[[ERC|Ethereum Request for Comments (ERC)]]-20が果たすのと同じ標準化の役割を持つ**プライバシーネイティブな代替可能トークン標準**を必要とするだろう。

この文書は、そのギャップを埋めるために**pERC20**を提案する。これは、**Orchardスタイル**のZK-[[UTXO|UTXOモデル]]モデル（Groth16証明、Zcash Orchardプロトコルを応用）に基づいて構築された、EVM上のプライバシーネイティブな代替可能アセットのための標準インターフェースである。対照的に、[[ERC|Ethereum Request for Comments (ERC)]]-20は残高と送金を完全にオンチェーンで公開し、保有者の分布、取引相手、および金額を明らかにする。pERC20は、以下の目標を持つノートベースの[[UTXO|UTXOモデル]]モデルを採用する。

-   **デフォルトでのプライバシー**: アセットは発行時からプライベートであり、公開からシールドへの変換ステップは不要。
-   **UTXOレベルのプライバシー**: アカウント残高はパターン分析の対象とならず、匿名化セットは同種のノートから形成される。
-   **検証可能な正直性**: `totalSupply`は公開されており、見えないインフレを防ぐ。
-   **組み込みのコンプライアンス**: プロトコル層は、規制上の措置可能性要件を満たすために特定のノートを凍結できる。
-   **EVMデプロイ可能性**: 標準インターフェースにより、ウォレット、インデクサー、およびサービスによる統一された統合が可能になる。

## 仕様

この文書におけるキーワード**MUST**、**MUST NOT**、**SHOULD**、および**MAY**は、RFC 2119に記述されている通りに解釈される。

### 用語

| 用語 | 意味 |
| --- | --- |
| note | 値（トークン量）と受信者情報を含む暗号化された[[UTXO|UTXOモデル]] |
| commitment / cmx | ノートコミットメント（Merkleツリーのリーフ、x座標） |
| nullifier / nf | ノートを使用する際に公開される1回限りの公開マーカー。二重使用を防ぎ、IDとリンクできない |
| anchor | 使用時に参照される過去のMerkleルート |
| perc1 address | pERC20を受信するためのプライバシーアドレス（Orchardキー導出）。この仕様内で定義される（別途の補完[[EIP|EIP（Ethereum 改善提案）]]なし） |
| cmxFrozenRoot / rt_frozen | コンプライアンスブラックリストのSparse Merkle Treeのルート。公開回路入力 |
| binding signature | オペレーションの値の保存を証明するSchnorr署名 |
| spend-auth signature | ノートを使用する権限を証明するSchnorr署名 |
| bundle | 1つ以上の行動（各行動 = オプションの消費 + 1つの出力）からなる単一のオペレーション |

### データ構造

以下の仕様はSolidity `0.8.20`（またはそれ以降）の構文を使用する。

#### PrivacyCall

`IPERC20`メソッドのプロダクト層コールペイロード。

```
struct PrivacyCall {
    bytes      actions;     // = abi.encode(BundleAction[])
    uint256[3] bindingSig;  // [Rx, Ry, s] Baby JubJub Schnorr binding signature
}
```

#### BundleAction

`IEndpointCore`の実装層アクション。

```
struct BundleAction {
    bytes32    cmx;            // output note commitment
    bytes      encCiphertext;  // recipient ciphertext; length MUST match the note encryption format (see below)
    bytes      outCiphertext;  // sender self-recovery ciphertext; length MUST match the OVK encryption format (see below)
    bytes32    epk;            // ephemeral public key
    bytes32    nfOld;          // nullifier of the consumed input note
    bytes32    anchor;         // historical root used by the consumed input note
    bytes      proof;          // Groth16 proof = abi.encode(pA, pB, pC)
    uint256[8] pubFields;      // public inputs; [7] MUST == cmxFrozenRoot
    uint256[3] spendAuthSig;   // spend authorization signature for the consumed input note
}
```

**ノート暗号文形式**: この標準は、特定のノートプレーンテキストのレイアウトをバイトレベルの不変条件に埋め込んでいないが、実装は1つを固定し、それを文書化**しなければならない**。参照実装は、[Zcash Protocol Specification §7.5 *Action Description Encoding and Consensus*](https://zips.z.cash/protocol/protocol.pdf#actionencodingandconsensus)で定義されているOrchardスタイルのフィールドサイズを使用する。

-   `encCiphertext` = 580バイト: `epk`と受信者の受信ビューイングキー (IVK) から導出されたキーでノートプレーンテキストを暗号化したChaCha20-Poly1305暗号文（564バイトのプレーンテキスト + 16バイトのPoly1305タグ。プレーンテキストフィールドには、ダイバーシファイア/送信キーエンコーディング、`value`、`rseed`、および512バイトのメモが含まれる）。
-   `outCiphertext` = 80バイト: 送信キーとエフェメラル秘密鍵から形成されたバイト文字列を、送信者の送信ビューイングキー (OVK) で暗号化したChaCha20-Poly1305暗号文。送信済みノートのリカバリに使用される（64バイトのプレーンテキスト + 16バイトのPoly1305タグ）。

ノート暗号化レイアウト（異なる暗号、異なるプレーンテキストスキーマ、異なるメモサイズ）を変更する実装は、サイレントに長さを変更するのではなく、この[[EIP|EIP（Ethereum 改善提案）]]の別のバリアントを公開**しなければならない**。

**`pubFields`の順序は** `[anchor, cv_net_x, cv_net_y, nf_old, rk_x, rk_y, cmx, rt_frozen]` **でなければならない**。

このレイアウトは、[Zcash Protocol Specification §4.18.4 *Action Statement (Orchard)*](https://zips.z.cash/protocol/protocol.pdf#actionstatement)におけるOrchard Actionの主要入力（`anchor`、純値コミットメント`cv_net`、`nf_old`、ランダム化キー`rk`、出力コミットメント`cmx`）から導出されている。pERC20は、コンプライアンスと統一された検証パスのために、2つの意図的な変更を加えている。

-   **`rt_frozen`が`enable_spend` / `enable_output`を置き換える**: スロット`[7]`は各アクションをアセットのコンプライアンスブラックリストSMTルート（`IPERC20.cmxFrozenRoot()`）にバインドする。回路は、そのルートの下で消費されたノートコミットメントが非メンバーであることを証明する。
-   **ミント/送金/バーンに対する単一のアクション形状**: ダミー入力のミントと実際の消費は同じ公開フィールドレイアウトを共有する。有効化フラグは個別の公開入力として公開されない（回路内で処理される）。

オンチェーン実装は、これらの8つのフィールドを`ActionPubHash`（Poseidonスポンジ）を介して単一のGroth16公開シグナル`pub_hash`に圧縮**しなければならず**、この圧縮関数は回路の`PubHashAction()`と一致**しなければならない**。

`pubFields`の各要素は、正規のフィールド要素（実装の検証者が使用する[[SNARK曲線|SNARK curve]]の**[[スカラー体モジュラス|scalar field modulus]]** `Fr`よりも厳密に小さい）でなければならない。そうでない場合、コールはリバート**しなければならない**（`PubFieldOutOfRange`）。この制約がないと、`ActionPubHash`はハッシュ化前にフィールドのモジュロで入力を削減するが、[[SNARK曲線|SNARK curve]]検証者は最終的な`pub_hash`のみをチェックする。攻撃者は`nf + Fr`を提出して同じ`pub_hash`と証明を生成できるが、異なるnullifierセットキーにマッピングされ、同じノートの二重使用が可能になる。

### IPERC20

実装は成功時に`true`を返し、失敗時にリバート**しなければならない**。`bool`の戻り値は[[ERC|Ethereum Request for Comments (ERC)]]-20の呼び出し規約互換性のために保持されている。

#### name

トークンの名前を返す。例: `"MyPrivateToken"`。

```
function name() external view returns (string memory)
```

#### symbol

トークンのシンボルを返す。例: `"pHIX"`。

```
function symbol() external view returns (uint8)
```

#### decimals

トークンが使用する小数点以下の桁数を返す。例: `8`は、トークン量を`100000000`で割ってユーザー表現を得ることを意味する。

```
function decimals() external view returns (uint8)
```

#### totalSupply

総トークン供給量（累積ミントから累積バーンを引いたもの）を返す。この値は公開されており、オンチェーンで検証可能でなければならない。

```
function totalSupply() external view returns (uint256)
```

#### issuer

この標準の下でミントを許可されたアドレスを返す。

```
function issuer() external view returns (address)
```

#### cmxFrozenRoot

現在のコンプライアンス凍結ルート（`IPERC20`標準メソッド）を返す。

```
function cmxFrozenRoot() external view returns (uint256)
```

#### setFrozenRoot

オフチェーンのブラックリストSMTを再構築した後、コンプライアンス凍結ルートを更新する。`admin`に制限**しなければならない**。

```
function setFrozenRoot(uint256 newRoot) external
```

#### transfer

一連のノートを受益者にプライベートに送金する（ノート→ノート）、値の保存を伴う。

実装は、`valueBalance == 0`で基盤となるバンドルロジックを実行**しなければならない**（`_executeBundle`などの内部実行パスを介して）。

実装は成功時に`true`を返**さなければならない**。失敗はリバートによって表現**しなければならない**。

実装は[[ERC|Ethereum Request for Comments (ERC)]]-20の`Transfer(from, to, value)`イベントを発行**してはならない**。ノートごとの可視性は`NoteAdded` / `NoteConfirmed`によって提供される（`IEndpointCore`を参照）。

送信者、受信者のID、および送金量はプライベートのまま**でなければならない**。

値変更操作は、制御された`mint` / `burn` / `transfer`を通じてのみ公開**しなければならない**。コア実行パスは公開呼び出し可能**であってはならない**。これにより、呼び出し元が供給会計を迂回するために`valueBalance`の方向を選択できないようにする（以下の**供給不変条件**を参照）。

```
function transfer(PrivacyCall calldata call) external returns (bool success)
```

#### mint

額面`amount`の新しいノートを作成する。`totalSupply`は`amount`だけ増加する。

実装は、`amount < ℓ`（`SUBGROUP_ORDER`）を検証**しなければならない**。これにより、バインディングスカラー`amount mod ℓ`が宣言された量（`AmountTooLarge`）と等しくなる。

実装は、`valueBalance`の下位255ビットが`amount`と等しいことを検証**しなければならない**（amount binding）。

実装は、`transfer`および`burn`と同じアンカー / nullifier / spend-auth検証パスを通じてミントアクションを実行**しなければならない**（オンチェーンでの出力のみのブランチなし。`nfOld == 0`センチネルなし）。**回路**は、ミントアクションの消費された入力ノートが`v = 0`を保持するように制約**しなければならない**。これにより、アクションは純流入セマンティクスを示す。これは回路レベルの不変条件であり、オンチェーンで直接チェック可能ではない。

**承認**: `mint`は発行者（`onlyIssuer`）に制限**しなければならない**。

実装は、後のバージョンでミント承認を緩和する**ことができる**（ブロックウィンドウ、キャップ、許可リスト、PoW、ステーキング）が、`totalSupply`は公開で累積され続け**なければならない**。

受信者のIDはプライベート**でなければならない**。`amount`は公開である。

```
function mint(uint256 amount, PrivacyCall calldata call) external
```

#### burn

ノートを消費して値を破壊する。`totalSupply`は`amount`だけ減少する。外部アセットはリリースされない。

実装は、`amount < 2^255`（符号ビットが設定されていない）および`amount < ℓ`（`SUBGROUP_ORDER`、`AmountTooLarge`）を検証**しなければならない**。

実装は、`valueBalance == amount`（bit255 = 0）で実行**しなければならない**。

実装は、`totalSupply >= amount`を検証**しなければならない**。そうでない場合、リバートする。

**承認**: 任意の保有者は自身のノートをバーンする**ことができる**（対応する消費承認が必要）。

バーナーのIDはプライベート**でなければならない**。`amount`は公開である。

```
function burn(uint256 amount, PrivacyCall calldata call) external
```

### イベント

#### Mint

新しいトークンがミントされたときにトリガー**しなければならない**。

```
event Mint(address indexed issuer, uint256 amount)
```

#### Burn

トークンがバーンされたときにトリガー**しなければならない**。

```
event Burn(uint256 amount)
```

#### FrozenRootUpdated

コンプライアンス凍結ルートが変更されたときにトリガー**しなければならない**。

```
event FrozenRootUpdated(uint256 oldRoot, uint256 newRoot)
```

#### Perc20Created

新しいpERC20アセットコントラクトがデプロイされたときに一度発行**しなければならない**（通常はアセットコンストラクタ内で）。

ファクトリデプロイパターンは**推奨される**が、**必須ではない**。アセットコントラクトが`Perc20Created`（または同等のコンストラクタ時メタデータ）を発行する限り、スタンドアロンデプロイメントは準拠している。ファクトリコントラクトは規範的な標準の一部**ではない**。参照実装は、発見可能性と共有検証者配線のためにファクトリコントラクト（例: `PERC20Factory`）を提供する**ことができる**。

```
event Perc20Created(
    address indexed pool,
    address indexed issuer,
    string name,
    string symbol,
    uint8 decimals
)
```

インデクサーとウォレットは、新しいアセットを登録するためにこのイベントをリッスン**すべきである**。ファクトリが使用される場合でも、イベントはデプロイされたアセットコントラクトから発信**しなければならない**（ファクトリラッパーからのみではない）。これにより、スタンドアロンデプロイメントとファクトリバックアップデプロイメントが同じ観測可能なメタデータを生成する。

**注**: この標準は意図的に[[ERC|Ethereum Request for Comments (ERC)]]-20の`Transfer`または`Approval`イベントを定義**しない**。From/toは常に隠されたノートであり、送金量はプライベートであるため、`Transfer`を発行することは誤解を招く可能性がある。供給量の変更は`Mint` / `Burn`を通じて観測可能であり、ノートごとの詳細は`NoteAdded` / `NoteConfirmed`によって伝達される。

### コンプライアンス凍結ルート

コンプライアンス凍結ルートは**`IPERC20`**の一部である（個別のコンプライアンスモジュールではない）。

```
function cmxFrozenRoot() external view returns (uint256)
function setFrozenRoot(uint256 newRoot) external  // onlyAdmin

event FrozenRootUpdated(uint256 oldRoot, uint256 newRoot)
```

-   各アクションの`pubFields[7]`は現在の`cmxFrozenRoot()`と等しく**なければならない**。そうでない場合、リバートする（`BadFrozenRoot`）。
-   回路は、消費されたノートのコミットメントが`cmxFrozenRoot`をルートとするブラックリストSMTのメンバーではないことを証明**しなければならない**（非メンバーシップ証明）。
-   完全なブラックリストSMT構造はオフチェーンで維持され、ルートのみがオンチェーンに保存される。
-   `setFrozenRoot`は`admin`（デプロイメントと`admin`設定に応じて、発行者または専任のコンプライアンス担当者）に制限**しなければならず**、マルチシグ / タイムロックを使用**すべきである**。各変更は監査可能性のために`FrozenRootUpdated`を発行**しなければならない**。
-   ノートを凍結するには: オフチェーンで、その`cmx`をブラックリストSMTに挿入し、新しいルートを計算し、`setFrozenRoot(newRoot)`を呼び出す。凍結を解除するには、削除して再度`setFrozenRoot`を呼び出す。
-   初期の`cmxFrozenRoot == 0`は空のブラックリスト（デフォルトで許可）を示す。

### IEndpointCore

基盤となるノートステートマシンは以下を公開**しなければならない**。

```
interface IEndpointCore {
    function cmxRoot() external view returns (bytes32);
    function isValidAnchor(bytes32 root) external view returns (bool);

    event NoteAdded(
        bytes32 indexed cmx,
        bytes encCiphertext,
        bytes outCiphertext,
        bytes32 epk,
        bytes32 nfOld,
        bytes32 cvNetX
    );
    event NoteConfirmed(bytes32 indexed cmx, bytes32 newRoot, uint256 position);
    event BundleExecuted(uint256 valueBalance, uint256 amount, bytes32 recipientMeta);
}
```

-   **`cmxRoot()`**: 最新のコミットメントツリーのルート。ウォレットとインデクサーはイベントからツリーを再構築し、この値と比較する**ことができる**。
-   **`isValidAnchor(root)`**: `root`がこのコントラクトのコミットメントツリーによって発行されたことがあるかどうか。ウォレットはトランザクションを送信する前にこれを呼び出して、証明アンカーを検証**すべきである**。

実装は以下を**しなければならない**。

-   内部のnullifierセットを介して二重使用を防ぐ。同じ`nf`は二度使用**されてはならない**。Nullifierメンバーシップは`IEndpointCore`の公開ビュー関数として必須ではない。
-   `isValidAnchor`を介してクエリ可能な履歴ルートを持つ、追記専用のMerkleコミットメントツリーを維持する。
-   バインディング署名を介して値の保存を検証し、spend-auth署名を介して消費承認を検証する。バインディング署名検証は、状態変更（ツリー挿入、nullifierマーク、イベント発行）の前に完了**しなければならない**。
-   重複する`cmx`（`DuplicateCommitment`）およびゼロコミットメント`cmx == 0`（`ZeroCommitment`）を拒否する。
-   バインディング / spend-auth署名点`R`が[[SNARK曲線|SNARK curve]]とペアリングされた署名曲線（参照実装はBaby JubJubを使用）上にあり、正規のフィールド座標（`< Fr`）を持つことを検証する。
-   各アクションの`pubFields[7] == IPERC20.cmxFrozenRoot()`（コンプライアンスバインディング）を検証する。
-   空の`BundleAction[]`配列を拒否し、コールあたりのアクション数に上限を設ける**しなければならない**（`maxActions`）。上限は有限で設定可能な正の整数**でなければならない**。証明検証のガスを予測可能に保つために、妥当な上限は10〜50の範囲である。

実装は、すべての特権的な設定変更（検証者ローテーション、管理者移譲、`maxActions`）に対してイベントを発行**すべきである**。管理者移譲は、ゼロアドレス禁止の2段階フロー（`transferAdmin` + `acceptAdmin`）を使用**すべきである**。

#### 供給不変条件

`totalSupply`会計を持つアセットコントラクト（例: `PERC20`）は、値の変更を制御された`mint` / `burn` / `transfer`を通じてのみ公開**しなければならない**。コア実行パス（例: `_executeBundle`）は公開呼び出し可能**であってはならない**。そうでない場合、誰でも`totalSupply`を増やさずに未計上の値を注入できてしまう。

`NoteAdded`は`outCiphertext`（80バイトの送信者自己回復暗号文）と`cvNetX`（= `pubFields[1]`）を運**ばなければならない**。これにより、送信ビューイングキー (OVK) を持つウォレットは、calldataを解析せずにログから送信済みノートをスキャンできる。

### 値残高エンコーディング

`valueBalance` (uint256) の符号ビットエンコーディングは以下に従**わなければならない**。

| 操作 | エンコーディング | バインディングスカラー |
| --- | --- | --- |
| transfer | 0 | 0 (保存) |
| burn | bit255 = 0, 下位ビット = v | v (+v 流出) |
| mint | bit255 = 1, 下位ビット = v | ℓ − v (−v 流入) |

## 理論的根拠

### ノートモデルとERC-20セマンティクス

-   **アカウント残高ではなく[[UTXO|UTXOモデル]]ノート**: アカウント活動パターンの漏洩を防ぐ。同種のノートはより強力な匿名化セットを提供する。
-   **バイナリ互換性のない[[ERC|Ethereum Request for Comments (ERC)]]-20セマンティクス**: 公開残高の欠如を正直に反映しつつ、エコシステムの認知コストを低減する。バイナリ[[ERC|Ethereum Request for Comments (ERC)]]-20互換性は残高の公開を強制し、設計目標と矛盾する。
-   **公開`totalSupply`**: 高価なレンジ証明なしで「見えないインフレなし」を検証するための最小限の透明性トレードオフ。
-   **ミントはダミー入力（`v=0`）を使用し、バーン/送金と同じ検証パスを共有**: ミントの純流入セマンティクスを維持しつつ、単一のアクション検証フローを維持する。回路の増分は単一の追加公開入力`rt_frozen`に収束する。

### SaplingではなくOrchard

Orchardが選ばれたのは、そのアクション回路が単一の証明内で**任意の数の入力と出力を柔軟にサポートする**ためである。pERC20バンドルは、複数の消費と出力を1つのトランザクションに結合できる。Saplingの固定された1入力/2出力のアクション形状では、人工的な分割、高いリレーヤーコスト、およびマルチノート送金におけるUXの低下を強いられるだろう。

### Halo2 / PLONKではなくGroth16

[[EVM|EVM]]における[[Groth16証明|Groth16 proofs]]の検証コストは、同等のセキュリティレベルで一般的なHalo2またはPLONK検証者よりも**低い**。ペアリングベースの[[Groth16証明|Groth16 proofs]]チェッカーはオンチェーンでよく理解されている。VKサイズと検証者バイトコードは、アクションごとのガスを予測可能に保ちつつ、アセットごとのデプロイメントにとって実用的である。

### 回路内のコンプライアンスルート (`cmxFrozenRoot`)

コンプライアンスブラックリストは、`cmxFrozenRoot`をルートとする**`cmx`（ノートコミットメント）**のセットである。ユーザーが消費する際、オンチェーンアクションは消費されたノートの`cmx`ではなく、**`nfOld`（nullifier）**を公開する。オンチェーンでは、**`nf`から`cmx`への直接的でプライバシーを保護するマッピングは存在しない**ため、コントラクトはプライバシーを侵害することなく「このnullifierは凍結されたコミットメントに紐付けられているか？」を安価にチェックできない。

したがって、制約は**回路内で**強制される。証明者は、消費されたノートのコミットメントが`pubFields[7] == cmxFrozenRoot()`をルートとするブラックリストSMTの**メンバーではない**ことを示す。チェーンはSMTルートのみを保存およびバインドし、メンバーシップロジックはZK内に留まる。これは明示的なトレードオフである。コンプライアンスは識別された特定のノートに対して厳密に保証されるが、回路と`cmxFrozenRoot`を更新する管理者を信頼する必要がある。

## エコシステム統合 (非規範的)

このセクションは情報提供を目的としており、追加のプロトコル要件を導入するものではない。

pERC20は、より広範なプライバシー送金インフラストラクチャを補完することを意図している。考えられるエコシステムパスの1つは次のとおりである。

1.  既存の公開アセット（DeFi関連アセットを含む）は、[[EIP|EIP（Ethereum 改善提案）]]-8182などのインフラストラクチャを通じてプライベート送金パスを獲得する。
2.  プライバシーネイティブなアセットとノートが、新しいアプリケーション設計の第一級のプリミティブとなる。
3.  プライバシーを周辺的なラッパーとして扱うのではなく、プライバシーネイティブな状態に直接基づいて新しいプロトコルカテゴリが構築される（例えば、プライバシー保護型取引所、貸付、または構造化決済フロー）。

この提案は、ブリッジ構築、リレーヤー経済学、プライベートメムプール/ネットワークの仮定、またはプライベートオラクル設計を標準化するものではない。その範囲は、プライバシーネイティブな代替可能アセットのトークンインターフェースのセマンティクスと不変条件に限定される。

## 後方互換性

pERC20は[[ERC|Ethereum Request for Comments (ERC)]]-20の`balanceOf`、`approve`、`allowance`、または`transferFrom(from, to, amount)`を実装**しない**ため、既存の[[ERC|Ethereum Request for Comments (ERC)]]-20ツールで直接使用することはできない。

| [[ERC|Ethereum Request for Comments (ERC)]]-20 | pERC20 | 注記 |
| --- | --- | --- |
| name / symbol / decimals | 同じ | 公開メタデータ |
| totalSupply | totalSupply | 公開 |
| balanceOf(addr) | なし | 残高はプライベート。保有者はIVK/FVKを介してスキャン |
| transfer(to, amount) → bool | transfer(PrivacyCall) → bool | 当事者と金額はプライベート。戻り値の規約は維持 |
| transferFrom / approve / allowance | なし | 承認する公開残高なし。ビューイングキーを介した委任 |
| mint (拡張) | mint(amount, PrivacyCall) | 発行者のみ |
| burn (拡張) | burn(amount, PrivacyCall) | 任意の保有者 |
| Transfer / Approval イベント | Transferは省略。ノートごとはNoteAdded / NoteConfirmedを介して。供給量はMint / Burnを介して | IDはリンク不可 |

公開DeFiとの相互運用性は、オプションの`bridgeOut`（pERC20 → 公開[[ERC|Ethereum Request for Comments (ERC)]]-20ツイン）を介して達成される**ことができる**。この場合、プライバシーは出口で終了する（この標準では必須ではない）。

## 参照実装

参照実装は[pERC20\_](https://github.com/PERC20Labs/pERC20_)リポジトリで利用可能。

-   [`contracts/ptoken/PERC20.sol`](https://github.com/PERC20Labs/pERC20_/blob/2491764beb2bd3bc76f8d8074bde67952a3d67cd/contracts/ptoken/PERC20.sol) — 規範的なアセットコントラクト（`IPERC20`参照）

`PERC20`は`OrchardVerifier`（[[IEndpointCore|IEndpointCore]]）を継承し、完全な参照実装からのGroth16検証者、Merkleコミットメントツリー、および暗号ライブラリに依存する。

## セキュリティに関する考慮事項

-   **二重使用保護**: nullifierセットと回路内の正しい`nf`導出に依存する。一度nullifierが使用済みとマークされると、ノートは再度使用可能**であってはならない**。**`pubFields`のフィールド範囲チェック（`< Fr`）は二重使用保護の前提条件である**。そうでない場合、`nf + Fr`は同じ証明を再利用できるが、nullifierセットを迂回する（上記の**データ構造**を参照）。
-   **供給不変条件**: `totalSupply`会計を持つアセットコントラクトは、値の変更を`mint` / `burn` / `transfer`を通じてのみ公開**しなければならない**。コア実行パスは公開呼び出し可能**であってはならない**。そうでない場合、誰でも`totalSupply`を増やさずに未計上の値を注入できてしまう。
-   **値の保存**: バインディング署名とNUMSジェネレーター（`log_{G_RANDOM}(G_VALUE)`は不明）に依存する。`amount`と`valueBalance`の一貫性は、下位255ビットを比較することで強制される。署名点`R`は曲線とフィールドの検証**を受けなければならない**。
-   **リプレイ保護**: sighashドメイン分離は`chainId`、コントラクトアドレス、およびすべての`nf` / `cmx`値をバインドし、クロスチェーン、クロスコントラクト、クロスバンドルのリプレイを防ぐ。
-   **アンカーの有効性**: `isValidAnchor`は永続的なセットを使用するため、古い証明アンカーは有効なままだが、生成されたことのないルートの偽造を防**がなければならない**。
-   **コンプライアンス権限のリスク**: `admin`（発行者 / コンプライアンス担当者）は`setFrozenRoot`を介してノートを凍結できる。これは高価値の攻撃対象であり、信頼された役割である。マルチシグ / タイムロックを使用**すべきである**。`FrozenRootUpdated`ログは公開**すべきである**。デプロイメントでは、通常、コンプライアンスとアセット管理の両方を構築時に同じ`admin`に割り当てる。分離が必要な実装は、`admin`を独立したコンプライアンスマルチシグに転送**すべきである**。
-   **管理者権限**: `setGroth16Verifier`、`transferAdmin` + `acceptAdmin`、および`setMaxActions`は検証ロジックとパラメータを変更できる。ガバナンスによって制約される**べきである**（マルチシグ + タイムロック）。検証者をローテーションする際、新しい検証者の`ActionPubHash`は回路と一致**しなければならない**。2段階の管理者移譲は偶発的なロックアウトを防ぐ。

## プライバシーに関する考慮事項

-   **受信者の匿名性**: 操作はリレーヤーを介して送信**すべきである**。これにより、送信者のEOAが隠される。直接自己送信すると、EOAが操作にリンクされる。
-   **金額の可視性**: `mint` / `burn`の`amount`と`totalSupply`は公開される。送金量はプライベートである。
-   **匿名化セット**: V1はアセットごとのプールを使用する。新しいアセットは匿名化セットが小さい。クロスアセットの共有匿名性（共有ツリー + `asset_id`）は、回路の変更を必要とする将来の機能強化である。
-   **コンプライアンス vs. プライバシー**: `cmxFrozenRoot`メカニズムは**識別された特定のノート**を凍結できるが、(a) `cmx`の特定には通常、ビューイングキーの開示またはオフチェーンのインテリジェンスが必要であり、(b) ターゲットノートが凍結前に送金された場合、値は新しい`cmx`に移動し、再識別が必要となる。強制的なコンプライアンスルートは明示的な設計選択である。実装は、トラストレス性を近似するために`cmxFrozenRoot == 0`（空のブラックリスト = デフォルトで許可）を維持する**ことができる**。

*8件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethresear.ch/t/perc20-privacy-native-fungible-token-standard-draft/25089)
