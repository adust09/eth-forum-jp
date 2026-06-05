---
title: 'ERC-8287: プライバシーネイティブなファンジブルトークン'
original_title: 'ERC-8287: Privacy-Native Fungible Tokens'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702'
author: Cyimon
date: '2026-06-04'
category: ERCs
tags:
  - ercs
  - privacy
  - snarks
  - standards
  - erc-20
  - tokenomics
  - cryptography
  - protocol-design
topic_id: '28702'
translated_at: '2026-06-05'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8287: Privacy-Native Fungible Tokens](https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702) — Cyimon (2026-06-04)

**著者:** Cyimon ([@Cyimon](https://github.com/Cyimon)) · **ステータス:** ドラフト · **タイプ:** 標準トラック · **カテゴリ:** ERC · **作成日:** 2026-06-03

**概要:** Zcash Orchardプロトコルを搭載した、EVM上のプライバシーネイティブなファンジブルトークンインターフェース。

**関連議論:** [ethresear.ch #25089](https://ethresear.ch/t/perc20-privacy-native-fungible-token-standard-draft/25089) · **実装:** [PERC20Labs/PERC20](https://github.com/PERC20Labs/PERC20) ·

> この行以下のすべてをMagiciansトピック本文に貼り付けてください。投稿前に**プレビュー**を使用してください。推奨カテゴリ: **ERCs**。タグ: `privacy`, `zk-snarks`, `standards`, `erc-20`。

* * *

## 簡易要約

[[glossary/EVM|EVM]]上のプライバシーネイティブなファンジブルトークン（ZK-UTXOノート、Orchardスタイル）で、公開された`totalSupply`とプライベートな残高/転送を持ち、Zcash [[glossary/Orchard-protocol|Orchardプロトコル]]によって強化されています。

## 概要

[[glossary/EVM|EVM]]上で[[glossary/ZK-UTXO|ZK-UTXO]]ノートを使用する、プライバシーネイティブなファンジブルトークンインターフェースです。公開された`totalSupply`を持ち、残高と転送はプライベートです。実装は、プライベートな残高と転送量をデフォルトで提供しつつ、公開検証可能な`totalSupply`を維持した[[glossary/transfer|転送]]、[[glossary/mint|発行]]、[[glossary/burn|焼却]]を提供します。トークンは、発行時から暗号化されたUTXOノート（[[glossary/Groth16-proofs|Groth16証明]]、Orchardスタイルのモデル）として存在します。各`pERC20`アセットは、アセットコントラクトによって維持される**コンプライアンス凍結ルート**にバインドされなければならず、ブラックリストに載ったノートが使用できないようにします。

この提案は、[[glossary/ERC-20|ERC-20]]とバイナリ互換ではありません。公開された`balanceOf`や`approve` / `allowance`はありません。代わりに、同等のプライバシーインターフェース`IPERC20`を定義します。

この提案は、ETHおよび互換性のある[[glossary/ERC-20|ERC-20]]アセットのプロトコルレベルのプライベート転送レイヤーを補完するものであり、`pERC20`はアセットレベルでプライバシーネイティブなトークンインターフェースを定義します。

## 動機

イーサリアムは、プロトコル層での**ネイティブなプライバシー**にますます注力しています。ベースレイヤーのプライバシープリミティブが成熟するにつれて、エコシステムは、公開トークンに対する[[glossary/ERC-20|ERC-20]]と同様の役割を持つ**プライバシーネイティブなファンジブルトークンインターフェース**を必要とするでしょう。

このドキュメントは、そのギャップを埋めるために**`pERC20`**を提案します。これは、[[glossary/Orchard-protocol|Orchardスタイル]]の[[glossary/ZK-UTXO|ZK-UTXO]]モデル（[[glossary/Groth16-proofs|Groth16証明]]、Zcash Orchardプロトコルから適応）に基づいて構築された、[[glossary/EVM|EVM]]上のプライバシーネイティブなファンジブルアセットの規範的なインターフェースです。対照的に、[[glossary/ERC-20|ERC-20]]は残高と転送を完全にオンチェーンで公開し、保有者の分布、取引相手、および金額を明らかにします。`pERC20`は、以下の目標を持つノートベースのUTXOモデルを採用しています。

追加の背景と初期レビュー: [ethresear.ch #25089](https://ethresear.ch/t/perc20-privacy-native-fungible-token-standard-draft/25089)。

-   **デフォルトでのプライバシー**: アセットは発行時からプライベートであり、公開からシールドへの変換ステップは不要です。
-   **UTXOレベルのプライバシー**: アカウント残高はパターン分析の対象にならず、同種のノートから匿名セットが形成されます。
-   **検証可能な正直さ**: `totalSupply`は公開されており、見えないインフレを防ぎます。
-   **組み込みのコンプライアンス**: プロトコル層は、規制上の措置可能性要件を満たすために特定のノートを凍結できます。
-   **[[glossary/EVM|EVM]]デプロイ可能性**: 標準インターフェースにより、ウォレット、インデクサー、およびサービスによる統一された統合が可能になります。

## 仕様

このドキュメントにおけるキーワード「**MUST**」、「**MUST NOT**」、「**SHOULD**」、「**MAY**」は、RFC 2119に記述されている通りに解釈されます。

### 用語

| 用語 | 意味 |
| --- | --- |
| note | 値（トークン量）と受信者情報を含む暗号化されたUTXO |
| commitment / cmx | ノートコミットメント（[[glossary/Merkle-tree|マークルツリー]]のリーフ、x座標） |
| nullifier / nf | ノートを使用する際に公開される1回限りの公開マーカー。二重使用を防ぎ、IDとはリンクできない |
| anchor | 使用時に参照される過去の[[glossary/Merkle-root|マークルルート]] |
| perc1 address | `pERC20`を受信するためのプライバシーアドレス（Orchardキー導出）。この仕様内で定義される（別途のコンパニオン[[glossary/ERC|ERC]]なし） |
| frozenRoot / rt_frozen | コンプライアンスブラックリストのSparse Merkle Tree ([[glossary/SMT|SMT]])のルート。公開された回路入力 |
| binding signature | 値の保存を証明する[[glossary/Schnorr-signature|シュノア署名]] |
| spend-auth signature | ノートを使用する権限を証明する[[glossary/Schnorr-signature|シュノア署名]] |
| bundle | 1つ以上の行動（各行動 = オプションの消費 + 1つの出力）からなる単一の操作 |

### データ構造

以下の仕様はSolidity `0.8.20`（またはそれ以上）の構文を使用しています。

#### PrivacyCall

`IPERC20`メソッドのプロダクト層コールペイロード。

```solidity
struct PrivacyCall {
    bytes      actions;     // = abi.encode(BundleAction[])
    uint256[3] bindingSig;  // [Rx, Ry, s] Baby JubJub Schnorr binding signature
}
```

#### BundleAction

`IEndpointCore`の実装層アクション。

```solidity
struct BundleAction {
    bytes32    cmx;            // output note commitment
    bytes      encCiphertext;  // recipient ciphertext; length MUST match the note encryption format (see below)
    bytes      outCiphertext;  // sender self-recovery ciphertext; length MUST match the OVK encryption format (see below)
    bytes32    epk;            // ephemeral public key
    bytes32    nfOld;          // nullifier of the consumed (or circuit-constrained dummy) input note
    bytes32    anchor;         // historical root used by the consumed input note
    bytes      proof;          // Groth16 proof = abi.encode(pA, pB, pC)
    uint256[8] pubFields;      // public inputs; [7] MUST == cmxFrozenRoot
    uint256[3] spendAuthSig;   // spend authorization signature for the consumed input note
}
```

**ノート暗号文フォーマット**: この標準は、特定のノートプレーンテキストレイアウトをバイトレベルの不変条件に埋め込みませんが、実装は1つを固定し、それを文書化**MUST**します。参照実装は、Zcashプロトコル仕様 §7.5 Action Description Encoding and Consensus (zips.z.cash protocol PDF, action encoding and consensus)で定義されているOrchardスタイルのフィールドサイズを使用します。

-   `encCiphertext` = 580バイト: `epk`と受信者の[[glossary/IVK|受信ビューイングキー (IVK)]]から導出されたキーで暗号化されたノートプレーンテキストのChaCha20-Poly1305暗号文（564バイトのプレーンテキスト + 16バイトのPoly1305タグ。プレーンテキストフィールドには、ダイバーシファイア/送信キーエンコーディング、`value`、`rseed`、および512バイトのメモが含まれます）。
-   `outCiphertext` = 80バイト: 送信キーとエフェメラル秘密キーから形成されたバイト文字列のChaCha20-Poly1305暗号文で、送信者の[[glossary/OVK|送信ビューイングキー (OVK)]]で暗号化され、送信されたノートの回復に使用されます（64バイトのプレーンテキスト + 16バイトのPoly1305タグ）。

ノート暗号化レイアウト（異なる暗号、異なるプレーンテキストスキーマ、異なるメモサイズ）を変更する実装は、黙って長さを変更するのではなく、この[[glossary/ERC|ERC]]の別のバリアントを公開**MUST**します。

**`pubFields`の順序は** `[anchor, cv_net_x, cv_net_y, nf_old, rk_x, rk_y, cmx, rt_frozen]` **MUST**です。

このレイアウトは、Zcashプロトコル仕様 §4.18.4 Action Statement (Orchard) (zips.z.cash protocol PDF, action statement)におけるOrchardアクションの主要入力（`anchor`、ネット値コミットメント`cv_net`、`nf_old`、ランダム化キー`rk`、出力コミットメント`cmx`）から導出されています。`pERC20`は、コンプライアンスと統一された検証パスのために、意図的に2つの変更を加えています。

-   **`rt_frozen`が`enable_spend` / `enable_output`を置き換える**: スロット`[7]`は、各アクションをアセットのコンプライアンスブラックリスト[[glossary/SMT|SMT]]ルート（`IPERC20.cmxFrozenRoot()`）にバインドします。回路は、そのルートの下で消費されたノートコミットメントが非メンバーであることを証明します。
-   **[[glossary/mint|発行]] / [[glossary/transfer|転送]] / [[glossary/burn|焼却]]のための単一のアクション形状**: ダミー入力の[[glossary/mint|発行]]と実際の消費は同じ公開フィールドレイアウトを共有します。有効化フラグは個別の公開入力として公開されません（回路内で処理されます）。

オンチェーン実装は、これらの8つのフィールドを`ActionPubHash`（[[glossary/Poseidon-sponge|Poseidonスポンジ]]）を介して単一の[[glossary/Groth16-proofs|Groth16]]公開シグナル`pub_hash`に圧縮**MUST**し、この圧縮関数は回路の`PubHashAction()`と一致**MUST**します。

`pubFields`の各要素は、正規のフィールド要素（実装の検証者が使用する[[glossary/SNARK-curve|SNARK曲線]]の**[[glossary/scalar-field-modulus|スカラー体モジュラス]]** `[[glossary/Fr|Fr]]`よりも厳密に小さい）でなければなりません**MUST**。そうでなければ、呼び出しはリバート**MUST**します（`PubFieldOutOfRange`）。この制約がないと、`ActionPubHash`はハッシュ化前にフィールドを法として入力を削減しますが、[[glossary/Groth16-proofs|SNARK]]検証者は最終的な`pub_hash`のみをチェックします。攻撃者は`nf + Fr`を提出して同じ`pub_hash`と証明を生成できますが、異なる`isSpent`キーにマッピングされ、同じノートの二重使用が可能になります。

### `IPERC20`インターフェース

#### メソッド

**注記**:

-   実装は成功時に`true`を返**MUST**し、失敗時にリバート**MUST**します。`bool`の戻り値は[[glossary/ERC-20|ERC-20]]呼び出し規約との互換性のために保持されています。

#### name

トークンの名前を返します — 例: `"MyPrivateToken"`。

```solidity
function name() external view returns (string memory)
```

#### symbol

トークンのシンボルを返します。例: `"pHIX"`。

```solidity
function symbol() external view returns (string memory)
```

#### decimals

トークンが使用する小数点以下の桁数を返します — 例: `8`は、トークン量を`100000000`で割ってユーザー表現を得ることを意味します。

```solidity
function decimals() external view returns (uint8)
```

#### totalSupply

トークンの総供給量（累積[[glossary/mint|発行]]から累積[[glossary/burn|焼却]]を引いたもの）を返します。この値は公開されており、オンチェーンで検証可能でなければなりません**MUST**。

```solidity
function totalSupply() external view returns (uint256)
```

#### issuer

この標準の下で[[glossary/mint|発行]]を許可されたアドレスを返します。

```solidity
function issuer() external view returns (address)
```

#### cmxFrozenRoot

現在のコンプライアンス凍結ルート（`IPERC20`インターフェースメソッド）を返します。

```solidity
function cmxFrozenRoot() external view returns (uint256)
```

#### setFrozenRoot

オフチェーンのブラックリスト[[glossary/SMT|SMT]]を再構築した後、コンプライアンス凍結ルートを更新します。`admin`に制限されなければなりません**MUST**。

```solidity
function setFrozenRoot(uint256 newRoot) external
```

#### transfer

値の保存を伴う、一連のノートを秘密裏に受信者に[[glossary/transfer|転送]]します（ノート→ノート）。

実装は、`valueBalance == 0`で基盤となるバンドルロジックを実行**MUST**します（`_executeBundle`などの内部実行パスを介して）。

実装は成功時に`true`を返**MUST**します。失敗はリバートによって表現されなければなりません**MUST**。

実装は[[glossary/ERC-20|ERC-20]]の`Transfer(from, to, value)`イベントを発行してはなりません**MUST NOT**。ノートごとの可視性は`NoteAdded` / `NoteConfirmed`によって提供されます（`IEndpointCore`を参照）。

送信者、受信者のID、および[[glossary/transfer|転送]]量はプライベートのまま**MUST**です。

値変更操作は、制御された[[glossary/mint|発行]] / [[glossary/burn|焼却]] / [[glossary/transfer|転送]]を通じてのみ公開されなければなりません**MUST**。コア実行パスは公開呼び出し可能であってはなりません**MUST NOT**。これにより、呼び出し元が`valueBalance`の方向を選択して供給会計をバイパスすることを防ぎます（[供給不変条件](https://ethereum-magicians.org#supply-invariant)を参照）。

```solidity
function transfer(PrivacyCall calldata call) external returns (bool success)
```

#### mint

額面`amount`の新しいノートを作成します。`totalSupply`は`amount`だけ増加します。

実装は、バインディングスカラー`amount mod ℓ`が宣言された量と等しくなるように、`amount < ℓ`（`SUBGROUP_ORDER`）を検証**MUST**します（`AmountTooLarge`）。

実装は、`valueBalance`の下位255ビットが`amount`と等しいことを検証**MUST**します（金額バインディング）。

実装は、[[glossary/mint|発行]]アクションを[[glossary/transfer|転送]]および[[glossary/burn|焼却]]と同じアンカー / [[glossary/nullifier|nullifier]] / スペンドアテステーション検証パスを通じて実行**MUST**します（オンチェーンでの出力のみのブランチなし。`nfOld == 0`センチネルなし）。**回路**は、[[glossary/mint|発行]]アクションの消費された入力ノートが`v = 0`を保持するように制約**MUST**し、それによってアクションが純流入セマンティクスを示すようにします。これは回路レベルの不変条件であり、オンチェーンで直接チェック可能ではありません。

**承認**: [[glossary/mint|発行]]は発行者（`onlyIssuer`）に制限されなければなりません**MUST**。

実装は、後のバージョンで[[glossary/mint|発行]]承認を緩和**MAY**できます（ブロックウィンドウ、キャップ、許可リスト、PoW、[[glossary/staking|ステーキング]]）が、`totalSupply`は公開で累積され続けなければなりません**MUST**。

受信者のIDはプライベートでなければなりません**MUST**。`amount`は公開です。

```solidity
function mint(uint256 amount, PrivacyCall calldata call) external
```

#### burn

値を破棄するためにノートを使用します。`totalSupply`は`amount`だけ減少します。外部アセットはリリースされません。

実装は、`amount < 2^255`（符号ビットが設定されていない）および`amount < ℓ`（`SUBGROUP_ORDER`、`AmountTooLarge`）を検証**MUST**します。

実装は、`valueBalance == amount`（bit255 = 0）で実行**MUST**します。

実装は、`totalSupply >= amount`を検証**MUST**します。そうでなければリバートします。

**承認**: どの保有者も自身のノートを[[glossary/burn|焼却]]**MAY**できます（対応するスペンドアテステーションが必要です）。

焼却者のIDはプライベートでなければなりません**MUST**。`amount`は公開です。

```solidity
function burn(uint256 amount, PrivacyCall calldata call) external
```

### イベント

#### Mint

新しいトークンが[[glossary/mint|発行]]されたときにトリガーされなければなりません**MUST**。

```solidity
event Mint(address indexed issuer, uint256 amount)
```

#### Burn

トークンが[[glossary/burn|焼却]]されたときにトリガーされなければなりません**MUST**。

```solidity
event Burn(uint256 amount)
```

#### FrozenRootUpdated

コンプライアンス凍結ルートが変更されたときにトリガーされなければなりません**MUST**。

```solidity
event FrozenRootUpdated(uint256 oldRoot, uint256 newRoot)
```

#### `Perc20Created`イベント

新しい`pERC20`アセットコントラクトがデプロイされたときに（通常はアセットコンストラクタで）一度発行されなければなりません**MUST**。

ファクトリデプロイパターンは**推奨**されますが、**必須ではありません**。アセットコントラクトが`Perc20Created`イベント（または同等のコンストラクタ時メタデータ）を発行する限り、スタンドアロンデプロイメントは準拠しています。ファクトリコントラクトは規範的な標準の一部では**ありません**。参照実装は、発見可能性と共有検証者配線のためにファクトリ（例: `PERC20Factory`）を提供**MAY**できます。

```solidity
event Perc20Created(
    address indexed pool,
    address indexed issuer,
    string name,
    string symbol,
    uint8 decimals
)
```

インデクサーとウォレットは、新しいアセットを登録するためにこのイベントをリッスン**SHOULD**します。ファクトリが使用される場合でも、イベントはデプロイされたアセットコントラクトから発信されなければなりません**MUST**（ファクトリラッパーからのみではない）。これにより、スタンドアロンデプロイメントとファクトリバックデプロイメントが同じ観測可能なメタデータを生成します。

**注記**: この標準は意図的に[[glossary/ERC-20|ERC-20]]の`Transfer`または`Approval`イベントを定義**しません**。From/toは常に隠されたノートであり、[[glossary/transfer|転送]]量はプライベートです。`Transfer`を発行することは誤解を招くでしょう。供給量の変更は`Mint` / `Burn`を通じて観測可能です。ノートごとの詳細は`NoteAdded` / `NoteConfirmed`によって運ばれます。

### コンプライアンス凍結ルート

コンプライアンス凍結ルートは**`IPERC20`**の一部です（個別のコンプライアンスモジュールではありません）。

```solidity
function cmxFrozenRoot() external view returns (uint256);
function setFrozenRoot(uint256 newRoot) external; // onlyAdmin

event FrozenRootUpdated(uint256 oldRoot, uint256 newRoot);
```

-   各アクションの`pubFields[7]`は現在の`cmxFrozenRoot()`と等しくなければなりません**MUST**。そうでなければリバートします（`BadFrozenRoot`）。
-   回路は、消費されたノートのコミットメントが`cmxFrozenRoot`をルートとするブラックリスト[[glossary/SMT|SMT]]のメンバーではないことを証明**MUST**します（非メンバーシップ証明）。
-   完全なブラックリスト[[glossary/SMT|SMT]]構造はオフチェーンで維持されます。ルートのみがオンチェーンに保存されます。
-   `setFrozenRoot`は`admin`（発行者または、デプロイメントと`admin`設定に応じて、専任のコンプライアンス担当者）に制限されなければならず**MUST**、[[glossary/multisig|マルチシグ]] / [[glossary/timelock|タイムロック]]を使用**SHOULD**します。各変更は監査可能性のために`FrozenRootUpdated`を発行**MUST**します。
-   ノートを凍結するには: オフチェーンで、その`cmx`をブラックリスト[[glossary/SMT|SMT]]に挿入し、新しいルートを計算し、`setFrozenRoot(newRoot)`を呼び出します。凍結を解除するには、削除して再度`setFrozenRoot`を呼び出します。
-   初期の`cmxFrozenRoot == 0`は空のブラックリスト（デフォルトで許可）を示します。

### IEndpointCore

基盤となるノートステートマシンは以下を公開**MUST**します。

```solidity
interface IEndpointCore {
    function activeRoot() external view returns (bytes32);
    function isValidAnchor(bytes32 root) external view returns (bool);
    function isSpent(bytes32 nf) external view returns (bool);
    function treeSize() external view returns (uint256);

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

実装は以下を**MUST**します。

-   [[glossary/nullifier|nullifier]]セットと回路内の正しい`nf`導出を介して二重使用を防ぎます。`isSpent`が設定されたら、ノートは再度使用可能であってはなりません**MUST NOT**。
-   `isValidAnchor`を介してクエリ可能な履歴ルートを持つ、追加専用の[[glossary/Merkle-commitment-tree|マークルコミットメントツリー]]を維持します。
-   バインディング署名を介して値の保存を検証し、スペンドアテステーション署名を介してスペンドアテステーションを検証します。バインディング署名検証は、状態変更（ツリー挿入、[[glossary/nullifier|nullifier]]マーク、イベント発行）の前に完了**MUST**します。
-   重複する`cmx`（`DuplicateCommitment`）とゼロコミットメント`cmx == 0`（`ZeroCommitment`）を拒否します。
-   バインディング / スペンドアテステーション署名ポイント`R`が[[glossary/SNARK-curve|SNARK曲線]]とペアリングされた署名曲線（参照実装は[[glossary/Baby-JubJub|Baby JubJub]]を使用）上にあり、正規のフィールド座標（`< Fr`）を持つことを検証します。
-   各アクションの`pubFields[7] == IPERC20.cmxFrozenRoot()`を検証します（コンプライアンスバインディング）。
-   空の`BundleAction[]`配列を拒否し、呼び出しごとのアクション数に上限（`maxActions`）を設けます**MUST**。上限は有限で設定可能な正の整数でなければなりません**MUST**。合理的な上限は、証明検証ガスを予測可能に保つために10〜50の範囲です。

実装は、すべての特権構成変更（検証者ローテーション、[[glossary/admin|管理者]]転送、`maxActions`）に対してイベントを発行**SHOULD**します。[[glossary/admin|管理者]]転送は、ゼロアドレス禁止の2段階フロー（`transferAdmin` + `acceptAdmin`）を使用**SHOULD**します。

#### 供給不変条件

`totalSupply`会計を持つアセットコントラクト（例: `PERC20`）は、値の変更を制御された[[glossary/mint|発行]] / [[glossary/burn|焼却]] / [[glossary/transfer|転送]]を通じてのみ公開**MUST**します。コア実行パス（例: `_executeBundle`）は公開呼び出し可能であってはなりません**MUST NOT**。そうでなければ、誰でも`totalSupply`を増加させることなく、未計上の値を注入できてしまいます。

`NoteAdded`は`outCiphertext`（80バイトの送信者自己回復暗号文）と`cvNetX`（= `pubFields[1]`）を運ばなければなりません**MUST**。これにより、[[glossary/OVK|送信ビューイングキー (OVK)]]を保持するウォレットは、calldataを解析することなくログから送信されたノートをスキャンできます。

### 値残高エンコーディング

`valueBalance`（uint256）の符号ビットエンコーディングは以下に従わなければなりません**MUST**。

| 操作 | エンコーディング | バインディングスカラー |
| --- | --- | --- |
| [[glossary/transfer|転送]] | 0 | 0 (保存) |
| [[glossary/burn|焼却]] | bit255 = 0, 下位ビット = v | v (+v 流出) |
| [[glossary/mint|発行]] | bit255 = 1, 下位ビット = v | ℓ − v (−v 流入) |

## 理論的根拠

### ノートモデルと[[glossary/ERC-20|ERC-20]]セマンティクス

-   **アカウント残高ではなくUTXOノート**: アカウント活動パターンの漏洩を回避します。同種のノートはより強力な匿名セットを提供します。
-   **バイナリ互換性なしの[[glossary/ERC-20|ERC-20]]セマンティクス**: 公開残高の欠如を正直に反映しつつ、エコシステムの認知的コストを低減します。バイナリ[[glossary/ERC-20|ERC-20]]互換性は残高の公開を強制し、設計目標と矛盾します。
-   **公開`totalSupply`**: 高価なレンジ証明なしで「見えないインフレなし」を検証可能にするための最小限の透明性トレードオフです。
-   **[[glossary/mint|発行]]はダミー入力（`v=0`）を使用しつつ、[[glossary/burn|焼却]]/[[glossary/transfer|転送]]と同じ検証パスを共有**: [[glossary/mint|発行]]の純流入セマンティクスを維持しつつ、単一のアクション検証フローを維持します。回路のインクリメントは、単一の追加公開入力`rt_frozen`に収束します。

### [[glossary/Sapling|Sapling]]ではなくOrchard

Orchardが選ばれたのは、そのアクション回路が単一の証明内で**任意の数の入力と出力を柔軟にサポートする**ためです。`pERC20`バンドルは、複数の消費と出力を1つのトランザクションに結合できます。[[glossary/Sapling|Sapling]]の固定された1入力/2出力のアクション形状では、人為的な分割、高いリレーヤーコスト、およびマルチノート[[glossary/transfer|転送]]のUXの低下を余儀なくされます。

### [[glossary/Halo2|Halo2]] / [[glossary/PLONK|PLONK]]ではなく[[glossary/Groth16-proofs|Groth16]]

[[glossary/EVM|EVM]]上での[[glossary/Groth16-proofs|Groth16]]検証コストは、同等のセキュリティレベルで一般的な[[glossary/Halo2|Halo2]]または[[glossary/PLONK|PLONK]]検証者よりも低いです。ペアリングベースの[[glossary/Groth16-proofs|Groth16]]チェッカーはオンチェーンでよく理解されています。VKサイズと検証者バイトコードは、アセットごとのデプロイメントに実用的であり、アクションごとのガスを予測可能に保ちます。

### 回路内のコンプライアンスルート（`cmxFrozenRoot`）

コンプライアンスブラックリストは、`cmxFrozenRoot`をルートとする**`cmx`（ノートコミットメント）**のセットです。ユーザーが使用する際、オンチェーンアクションは消費されたノートの`cmx`ではなく、**`nfOld`（[[glossary/nullifier|nullifier]]）**を公開します。オンチェーンには、**[[glossary/nullifier|nullifier]]から`cmx`への直接的でプライバシーを保護するマッピングは存在しない**ため、コントラクトはプライバシーを侵害することなく「この[[glossary/nullifier|nullifier]]は凍結されたコミットメントに紐付けられているか？」を安価にチェックすることはできません。

したがって、制約は**回路内で**強制されます。証明者は、消費されたノートのコミットメントが`pubFields[7] == cmxFrozenRoot()`をルートとするブラックリスト[[glossary/SMT|SMT]]の**メンバーではない**ことを示します（非メンバーシップ証明）。チェーンは[[glossary/SMT|SMT]]ルートのみを保存しバインドします。メンバーシップロジックは[[glossary/ZK|ZK]]内に留まります。これは明示的なトレードオフです。特定されたノートに対するコンプライアンスは厳密に保証されますが、回路と`cmxFrozenRoot`を更新する[[glossary/admin|管理者]]を信頼する必要があります。

### エコシステム統合（非規範的）

`pERC20`は、より広範なプライバシー[[glossary/transfer|転送]]インフラストラクチャを補完することを意図しています。考えられるエコシステムパスの1つは次のとおりです。

1.  既存の公開アセット（[[glossary/DeFi|DeFi]]関連アセットを含む）は、プロトコルレベルのプライベート[[glossary/transfer|転送]]インフラストラクチャを通じてプライベート[[glossary/transfer|転送]]パスを獲得します。
2.  プライバシーネイティブなアセットとノートは、新しいアプリケーション設計のための第一級のプリミティブになります。
3.  新しいプロトコルカテゴリは、プライバシーを周辺的なラッパーとして扱うのではなく、プライバシーネイティブな状態に直接構築されます（例えば、プライバシー保護された交換、貸付、または構造化された決済フロー）。

この提案は、ブリッジ構築、リレーヤー経済学、プライベート[[glossary/mempool|メムプール]]/ネットワークの仮定、またはプライベートオラクル設計を標準化するものではありません。その範囲は、プライバシーネイティブなファンジブルアセットのトークンインターフェースセマンティクスと不変条件に限定されます。

## 後方互換性

`pERC20`は、[[glossary/ERC-20|ERC-20]]の`balanceOf`、`approve`、`allowance`、または`transferFrom(from, to, amount)`を実装**しない**ため、既存の[[glossary/ERC-20|ERC-20]]ツールで直接使用することはできません。

| [[glossary/ERC-20|ERC-20]] | pERC20 | 注記 |
| --- | --- | --- |
| name / symbol / decimals | 同じ | 公開メタデータ |
| totalSupply | totalSupply | 公開 |
| balanceOf(addr) | なし | 残高はプライベート。保有者は[[glossary/IVK|IVK]]/[[glossary/FVK|FVK]]を介してスキャン |
| transfer(to, amount) → bool | transfer(PrivacyCall) → bool | 当事者と金額はプライベート。戻り値の規約は保持 |
| transferFrom / approve / allowance | なし | 承認する公開残高なし。ビューイングキーを介した委任 |
| [[glossary/mint|発行]] (拡張) | mint(amount, PrivacyCall) | 発行者のみ |
| [[glossary/burn|焼却]] (拡張) | burn(amount, PrivacyCall) | どの保有者も可能 |
| Transfer / Approval イベント | Transferは省略。ノートごとはNoteAdded / NoteConfirmedを介して。供給はMint / Burnを介して | IDはリンク不可 |

公開[[glossary/DeFi|DeFi]]との相互運用性は、オプションの`bridgeOut`（`pERC20` → 公開[[glossary/ERC-20|ERC-20]]ツイン）を介して達成**MAY**できます。この場合、プライバシーは出口で終了します（この提案では必須ではありません）。

## テストケース

参照実装 ([PERC20Labs/PERC20](https://github.com/PERC20Labs/PERC20)) には以下が含まれます。

-   コンストラクタガード、[[glossary/mint|発行]]/[[glossary/burn|焼却]]/[[glossary/transfer|転送]]会計、および供給不変条件のための[[glossary/Foundry|Foundry]][[glossary/unit-tests|単体テスト]]（`test/PERC20Test.t.sol`）。
-   実際の[[glossary/Groth16-proofs|Groth16証明]]を生成し、デプロイされた`PERC20`コントラクトに対して[[glossary/mint|発行]]、[[glossary/transfer|転送]]、[[glossary/burn|焼却]]を実行するモックなしの[[glossary/end-to-end-suite|エンドツーエンドスイート]]（`test/PERC20E2E.t.sol`, `e2e/`）。

シナリオから仕様へのマッピングと調査結果については、そのリポジトリの[`docs/e2e-report.md`](https://github.com/PERC20Labs/PERC20/blob/main/docs/e2e-report.md)を参照してください。

## 参照実装

参照実装: [PERC20Labs/pERC20\_](https://github.com/PERC20Labs/PERC20_) (最小限の参照アセットコントラクト)。

-   規範的なアセットコントラクト: そのリポジトリの`contracts/ptoken/PERC20.sol`（`IPERC20`参照）。

`PERC20`は`OrchardVerifier`（[[glossary/IEndpointCore|IEndpointCore]]）を継承し、完全な参照実装からの[[glossary/Groth16-verifier|Groth16検証者]]、[[glossary/Merkle-commitment-tree|マークルコミットメントツリー]]、および[[glossary/crypto-libraries|暗号ライブラリ]]に依存しています。

## セキュリティに関する考慮事項

-   **二重使用防止**: [[glossary/nullifier|nullifier]]セットと回路内の正しい`nf`導出に依存します。`isSpent`が設定されたら、ノートは再度使用可能であってはなりません**MUST NOT**。**`pubFields`のフィールド範囲チェック（`< Fr`）は二重使用防止の前提条件です**。そうでなければ、`nf + Fr`は同じ証明を再利用しつつ`isSpent`をバイパスできます（[データ構造](https://ethereum-magicians.org#data-structures)を参照）。
-   **供給不変条件**: `totalSupply`会計を持つアセットコントラクトは、値の変更を[[glossary/mint|発行]] / [[glossary/burn|焼却]] / [[glossary/transfer|転送]]を通じてのみ公開**MUST**します。コア実行パスは公開呼び出し可能であってはなりません**MUST NOT**。そうでなければ、誰でも`totalSupply`を増加させることなく、未計上の値を注入できてしまいます。
-   **値の保存**: [[glossary/binding-signature|バインディング署名]]と[[glossary/NUMS-generator|NUMSジェネレーター]]（`log_{G_RANDOM}(G_VALUE)`は不明）に依存します。`amount`と`valueBalance`間の一貫性は、下位255ビットを比較することで強制されます。署名ポイント`R`は曲線およびフィールドの検証**MUST**を受けなければなりません。
-   **リプレイ保護**: [[glossary/sighash-domain-separation|sighashドメイン分離]]は、`[[glossary/chainId|chainId]]`、コントラクトアドレス、およびすべての`nf` / `cmx`値をバインドし、クロスチェーン、クロスコントラクト、およびクロスバンドルのリプレイを防ぎます。
-   **アンカーの有効性**: `isValidAnchor`は永続的なセットを使用するため、古い証明アンカーは有効なままですが、決して生成されなかったルートの偽造を防がなければなりません**MUST**。
-   **コンプライアンス権限のリスク**: [[glossary/admin|管理者]]（発行者 / コンプライアンス担当者）は`setFrozenRoot`を介してノートを凍結できます。これは高価値の攻撃対象であり、信頼された役割です。[[glossary/multisig|マルチシグ]] / [[glossary/timelock|タイムロック]]を使用**SHOULD**し、`FrozenRootUpdated`ログは公開**SHOULD**されるべきです。デプロイメントでは通常、コンプライアンスとアセット管理の両方を構築時に同じ[[glossary/admin|管理者]]に割り当てます。分離が必要な実装は、[[glossary/admin|管理者]]を独立したコンプライアンス[[glossary/multisig|マルチシグ]]に[[glossary/transfer|転送]]**SHOULD**します。
-   **[[glossary/admin|管理者]]権限**: `setGroth16Verifier`、`transferAdmin` + `acceptAdmin`、および`setMaxActions`は検証ロジックとパラメータを変更できます。ガバナンスによって制約される**SHOULD**です（[[glossary/multisig|マルチシグ]] + [[glossary/timelock|タイムロック]]）。検証者をローテーションする際、新しい検証者の`ActionPubHash`は回路と一致**MUST**します。2段階の[[glossary/admin|管理者]][[glossary/transfer|転送]]は偶発的なロックアウトを防ぎます。

### プライバシーに関する考慮事項

-   **受信者の匿名性**: 操作はリレーヤーを介して提出**SHOULD**され、提出者の[[glossary/EOA|外部所有アカウント (EOA)]]を隠します。直接の自己提出は[[glossary/EOA|EOA]]を操作にリンクさせます。
-   **金額の可視性**: [[glossary/mint|発行]] / [[glossary/burn|焼却]]の`amount`と`totalSupply`は公開です。[[glossary/transfer|転送]]量はプライベートです。
-   **匿名セット**: アセットごとのプールは、新しいアセットが小さな匿名セットから始まることを意味します。クロスアセット共有匿名性（共有ツリー + `asset_id`）は、回路の変更を必要とする将来の強化です。
-   **コンプライアンス vs. プライバシー**: `cmxFrozenRoot`メカニズムは**特定された特定のノート**を凍結できますが、(a) `cmx`の特定には通常、ビューイングキーの開示またはオフチェーンのインテリジェンスが必要であり、(b) ターゲットノートが凍結前に[[glossary/transfer|転送]]された場合、値は新しい`cmx`に移動し、再特定が必要になります。強制的なコンプライアンスルートは明示的な設計選択です。実装は、`cmxFrozenRoot == 0`（空のブラックリスト = デフォルトで許可）を維持して、トラストレス性を近似**MAY**できます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702)
