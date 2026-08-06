---
title: 'ERC-8366: ゼロ知識支出ポリシー'
original_title: 'ERC-8366: Zero-Knowledge Spending Policies'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8366-zero-knowledge-spending-policies/29281
author: junbeomlee
date: '2026-08-05'
category: ERCs
tags:
  - ercs
  - zk
  - smart-contracts
  - applications
  - security
  - mechanism-design
  - ai-agents
  - payments
  - erc
topic_id: '29281'
translated_at: '2026-08-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8366: Zero-Knowledge Spending Policies](https://ethereum-magicians.org/t/erc-8366-zero-knowledge-spending-policies/29281) — junbeomlee (2026-08-05)

*(2024年8月5日更新: 実装フィードバックと以下の議論に基づき改訂。変更履歴は返信を参照。規範テキスト: [Add ERC: Zero-Knowledge Spending Policies by junbeomlee · Pull Request #1929 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/1929))*

## 概要

この[[glossary/ERC|ERC]]は、[[glossary/Zero-Knowledge-Proof|ゼロ知識証明]]支出ポリシーを標準化します。これは、ユーザーの資金を保持するあらゆるコントラクト（専用エスクロー、スマートウォレット、ERC-4337アカウント、または[[glossary/EIP-7702|EIP-7702]]委任型EOA (Externally Owned Account)）が実装できる構成可能な関数セットであり、所有者が事前に登録した支出ポリシーを満たす[[glossary/Zero-Knowledge-Proof|ゼロ知識証明]]に対してのみ資金を解放します。ポリシーはコミットメントとして一度登録されるため、そのパラメータ（例えば価格上限）はプライベートに保つことができます。証明は実装コントラクトの署名として伝達されます。支払い承認ダイジェストをそのERC-1271 `isValidSignature` に提示するあらゆる[[glossary/Searcher|支払い者]]（コントラクトまたはEOA）は、付随する証明が登録されたポリシーを満たす場合にのみマジック値を受け取ります。決済レール上では、実装コントラクトが[[glossary/Searcher|支払い者]]となります。この標準の核となるのは、ポリシー自体をシングルユースにする登録セマンティクスと、ポリシーチェック `verifyPolicy` です。署名伝達レール上では、ERC-1271アダプターがその同じチェックをコントラクトの署名検証として公開します。ERC-3009とERC-7598の`bytes`オーバーロード（およびその上の[[glossary/x402|x402]]のようなHTTP決済フロー）など、すでにコントラクト署名をルーティングするレールは、準拠するコントラクトから変更なしで支出できますが、それらはインスタンス化であり、標準ではありません。

## 動機

[[glossary/AI-agents|自律エージェント]]が決済クライアントになりつつありますが、エージェント決済で難しかったのは送金ではなく、エージェントがその資金を使うことを信頼することです。今日、オペレーターは2つの悪い選択肢のいずれかを選んでいます。人間が各支払いを承認する（安全ですが、人間がボトルネックとなり自律性が失われます）、またはエージェントが鍵や包括的な許可を持つ（自律的ですが無制限です。バグやプロンプトインジェクションがあれば、資金はどこへでも、何にでも使われてしまいます）。

欠けているのは、制約による委任です。所有者が支払いが満たすべき条件を述べ、エージェントはその範囲内で自由に活動し、決済レイヤー自体がその範囲外のものを拒否します。具体的には、この標準は「1ポリシー = 1支払い」という特性を目標としています。登録された各ポリシーは正確に1つの決済を承認するため、最悪の場合の損害は単一の事前承認済み支払いに限定されます。

既存の標準ではこれを提供していません。

-   ERC-7715およびERC-7710（ウォレットパーミッション、セッションキー）はアカウント内で支出制限を強制しますが、ポリシーは公開されており、[[glossary/on-chain-registry|オンチェーン状態]]に対してのみ評価され、マーチャント署名済み見積もりなどのオフチェーンの事実を拘束することはできません。
-   ERC-8183はエージェントジョブのエスクロー（デリバリー評価による解放）を標準化しており、[[glossary/Searcher|支払い者]]に対する支出ポリシーではありません。
-   [[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]は信頼および発見レイヤーであり、支払いを明示的に除外しています。
-   現在レビュー中の提案の中では、ERC-8150は[[glossary/Zero-Knowledge-Proof|ZK証明]]を用いてバッチごとのユーザー署名済みインテントに対する[[glossary/calldata-floor|コールデータマッチング]]によりエージェント支払いを検証するため、バッチごとに新しい署名が必要であり、パラメータをプライベートに保つことはできず、オフチェーンの事実を拘束することはできません。ERC-8354は、機密の第三者ルールセットの背後で任意の[[glossary/AI-agents|エージェントアクション]]をゲートしますが、これはこの標準とは逆の信頼トポロジーです（そこでは[[glossary/prover|プルーバー]]は信頼されたポリシーエンジンであり、秘密はルールです。ここでは[[glossary/prover|プルーバー]]は信頼されていないエージェント自体であり、秘密はポリシーのパラメータのみです）。ERC-8312は、エージェントが消費した制限付きマンデートの量を計測しますが、何も強制せず、Rationaleで議論されている複数支払い予算拡張を補完するものです。

この関数セットは、以下の3つの軸すべてにおいて異なります。ポリシーは一度登録され（支払いごとの署名なし）、証明はコールデータの一致ではなく制約の充足を示し（これにより、署名済み見積もりなどのオフチェーンの事実が証明可能な入力となります）、プライベートパラメータはコミットメントの背後でプライベートに保たれます。

## 仕様

このドキュメントにおけるキーワード「MUST」、「MUST NOT」、「SHOULD」、「MAY」は、RFC 2119およびRFC 8174に記述されている通りに解釈されます。

### インターフェース

```solidity
interface IZKSpendingPolicy {
    /// A policy was registered for `nonce`.
    event PolicyAllowed(bytes32 indexed nonce, bytes32 paramsCommit, address verifier);

    /// The policy for `nonce` was revoked before settlement.
    event PolicyRevoked(bytes32 indexed nonce);

    /// Register a single-use policy.
    /// `nonce`: the authorization nonce this policy is bound to; doubles as
    /// the policy id.
    /// `paramsCommit`: commitment to the policy's (possibly private) parameters.
    /// `verifier`: proof-system verifier contract for this policy's circuit.
    function allowPolicy(bytes32 nonce, bytes32 paramsCommit, address verifier) external;

    /// Revoke a policy that has not settled. MUST revert if already settled.
    function revokePolicy(bytes32 nonce) external;

    /// The registered policy for `nonce`, or zero values if none.
    function allowedPolicy(bytes32 nonce)
        external view returns (bytes32 paramsCommit, address verifier);

    /// The core check of this standard: does the payment described by
    /// `authorization`, with `proof`, satisfy the policy registered for its
    /// nonce? View: consumes nothing, so anyone can pre-flight a settlement
    /// with a static call before submitting it.
    function verifyPolicy(bytes calldata authorization, bytes calldata proof)
        external view returns (bool);
}

/// Optional extension for rails without contract-signature signed transfers.
/// Implementations that expose direct settlement declare this interface in
/// addition to `IZKSpendingPolicy`. See "Direct settlement".
interface IZKSpendingPolicySettlement {
    /// Emitted by direct settlement.
    event Settled(bytes32 indexed nonce, address to, uint256 value);

    /// Permissionless: the proof, not the caller, is the authorization.
    function settle(bytes calldata authorization, bytes calldata proof) external;
}
```

`allowedPolicy`は、登録されていない[[glossary/nonce|ナンス]]と取り消された[[glossary/nonce|ナンス]]の両方に対してゼロ値を返します。区別が重要な場合は、イベントから取得できます。

`isValidSignature`はこのインターフェースの一部ではありません。これはERC-1271の関数であり、この標準のものではありません。コントラクト署名レール上で決済する準拠コントラクトは、レールアダプターとしてERC-1271も実装しなければなりません（MUST）。その`isValidSignature`は、証明エンベロープ（proof envelope）をデコードし、以下のダイジェストバインディング（digest-binding）ステップを実行し、デコードされたフィールドに対して`verifyPolicy`が成立する場合にのみマジック値を返さなければなりません（MUST）。2つのエントリーポイントは矛盾してはなりません（MUST NOT）。

### ポリシー登録

-   `allowPolicy`および`revokePolicy`は、所有者に制限されなければなりません（MUST）。
-   [[glossary/nonce|ナンス]]はシングルユースでなければなりません（MUST）。これは、このポリシーが承認できる1つの支払いの承認[[glossary/nonce|ナンス]]です。決済時にはリプレイ保護が存在しなければなりません（MUST）。転送とアトミックに[[glossary/nonce|ナンス]]を消費するレール（ERC-3009のように）を使用する場合、実装はレールに依存してもよい（MAY）です。その他のパスでは、エスクローに対して支出する決済コンポーネントが[[glossary/nonce|ナンス]]自体を消費しなければなりません（MUST）。既に未取り消しのポリシーを持つ[[glossary/nonce|ナンス]]を登録しようとすると、リバートしなければなりません（MUST）。
-   ポリシーは、その[[glossary/nonce|ナンス]]が決済コンポーネントで消費されたときに**決済済み**となります（ERC-3009の場合、`authorizationState(address(this), nonce)`がtrueの場合）。その状態が[[glossary/on-chain-registry|オンチェーン]]で読み取り可能な場合、`allowPolicy`は既に消費された[[glossary/nonce|ナンス]]を拒否しなければならず（そのようなポリシーは決して決済されず、オブザーバーには有効と読まれるため）、`revokePolicy`は決済済みポリシーに対してリバートしなければなりません（MUST）。読み取り不可能な場合、実装は両方の要件が強制不可能であり、消費された[[glossary/nonce|ナンス]]に対する登録は使用できないことを文書化すべきです（SHOULD）。
-   `isValidSignature`は状態を書き込むことができないため、ポリシーレコードは決済後も存続します。したがって、ゼロ以外の`allowedPolicy`の結果は「登録済み」を意味し、「使用可能」を意味しません。消費者は、両者を区別するために決済コンポーネントの[[glossary/nonce|ナンス]]状態を参照しなければなりません（MUST）。
-   [[glossary/paramsCommit|paramsCommit]]は実装に対して不透明です。コミットメントスキーム（例えば、回路バージョン、上限、引用署名者キーに対するPoseidonハッシュ）は、この標準ではなくポリシー回路によって定義されます。
-   実装コントラクトが資金を保持します。所有者は、使用されるトークンでそれを資金供給します。この標準は、残高と登録されたポリシーとの間にいかなる関係も課しません（Rationaleを参照）。この機能は、専用のエスクローコントラクト内、または汎用ウォレット内（例えば、モジュラー型スマートアカウントのモジュールとして）に存在してもよい（MAY）です。準拠するのは関数セットとそのセマンティクスであり、コントラクトの形状ではありません。

### 支払い承認と証明エンコーディング

`verifyPolicy`は2つの引数を取ります。`authorization`は支払いのクリアテキスト記述です。参照ERC-3009スキーマの場合、次のようにデコードされなければなりません（MUST）。

```solidity
abi.encode(address to, uint256 value, uint256 validAfter, uint256 validBefore, bytes32 nonce)
```

`from`は意図的に省略されています。実装は、[[glossary/Searcher|支払い者]]が重要となる場所（アダプターのダイジェスト再計算、`settle`）で[[glossary/Searcher|支払い者]]を`address(this)`としてバインドするため、`from`フィールドは冗長な入力となります。他のダイジェストスキーマも同様に、その`authorization`レイアウトを規範的に固定しなければなりません（MUST）。実装定義のままにすると、同じスキーマの2つの準拠実装がワイヤー互換性を持たなくなり、ファシリテーターは仕様のみからペイロードを構築できなくなります。

`proof`は、ポリシーの登録された[[glossary/verifier|ベリファイア]]によって定義される、証明システム固有のエンコーディングです（参照[[glossary/Groth16|Groth16]]ベリファイアの場合、`abi.encode(a, b, c)`）。

どちらの引数も公開入力（public inputs）を運びません。すべての公開入力は、実装が既に信頼しているソース（登録されたポリシー、承認、環境）にアンカーされているため、実装はベクトル自体を構築します。[[glossary/prover|プルーバー]]が提供するベクトルを受け入れ、フィールドごとにチェックすることも有効ですが、忘れられた等価性チェックがそれぞれ致命的なバグに変わるため、構築することでその失敗モードが排除されます。

### 検証

`verifyPolicy(authorization, proof)`は、以下のすべての条件が成功した場合にのみtrueを返さなければなりません（MUST）。

1.  **ポリシー検索（Policy lookup）。** 承認の[[glossary/nonce|ナンス]]に対して、取り消されていないシングルユースポリシーが存在することを要求します。
    
2.  **公開入力構築（Public-input construction）。** 少なくとも`[to, value, paramsCommit, account, chainid]`を含む公開入力ベクトルを構築します。`to`と`value`は`authorization`から、[[glossary/paramsCommit|paramsCommit]]は登録されたポリシーから、`account`は`address(this)`（実装コントラクト）として、`chainid`は実行中のチェーンIDとして取得します。最後の2つは、証明をこのコントラクトとチェーンにスコープします。公開入力は`authorization`を介して以外は[[glossary/prover|プルーバー]]から取得してはならず（MUST NOT）、`verifyPolicy`は呼び出し元が提示する承認に対して応答します。その承認を実際の決済にバインドするのは、消費パスの仕事です（ERC-1271アダプターでのダイジェストバインディング、`settle`での[[glossary/nonce|ナンス]]消費）。最小限のベクトルは、すべての準拠実装がアンカーできるものです。ポリシー回路はこれを拡張してもよい（MAY）ですが、追加の公開入力はすべて次の3つのチャネルのいずれかを介して到達しなければなりません（MUST）。
    
    -   **承認から。** `to`/`value`以外の支払い承認のフィールド（有効期間、よりリッチなダイジェストスキーマのカテゴリフィールド）：これらは`authorization`で到達し、ダイジェスト等価性チェックによってアンカーされます。
    -   **チェーン状態から。** ビュー呼び出し中に実装が読み取る値（オラクルフィード、許可リストルート、時間窓ポリシーの`block.timestamp`）：ポリシー登録が読み取り場所を固定し、読み取りが値をアンカーします。
    -   **登録から。** ポリシー登録時に固定される値：[[glossary/paramsCommit|paramsCommit]]にコミットされるか、それと並行して登録されます。
    
    これらのチャネルのいずれにも適合しない値は、[[glossary/verifier|ベリファイア]]によってアンカーできず、アンカーされていない公開入力は意味的に証人（witness）であるため、証人でなければなりません（MUST）。これは、[[glossary/paramsCommit|paramsCommit]]にコミットされた引用署名者キーに対してマーチャント署名済み見積もりが認証されるように、アンカーされたものに対して回路内で認証されます。
    
3.  **証明検証（Proof verification）。** `proof`をポリシーの登録された[[glossary/verifier|ベリファイア]]と構築された公開入力ベクトルに対して検証します。
    

署名レール上では、2つの引数はERC-1271 `signature`スロットに**証明エンベロープ（proof envelope）**としてパックされて伝達され、次のようにデコードされなければなりません（MUST）。

```solidity
abi.encode(bytes proof, bytes authorization)
```

クリアテキストの`authorization`は一緒に伝達されます。なぜなら、`hash`は一方向であるため、ERC-1271は実装にダイジェストとこれらのバイトしか渡さず、フィールドがなければダイジェストを再計算したり、ポリシーを検索したり、公開入力を構築したりできないからです。これは信頼できない入力であり、ダイジェストバインディング（digest binding）がそれを決済に結びつけます。

`isValidSignature(hash, signature)`では、ERC-1271アダプターはエンベロープをデコードし、その後**ダイジェストバインディング（digest binding）**を実行しなければなりません（MUST）。これは、実装がサポートするダイジェストスキーマ（参照: ERC-3009 `TransferWithAuthorization`）の下で、`from = address(this)`として支払い承認の[[glossary/EIP-712-attestation-profile|EIP-712型付きデータダイジェスト]]を`authorization`から再計算し、それが`hash`と等しいことを要求します。ダイジェストスキーマは、少なくとも受取人、金額、シングルユース[[glossary/nonce|ナンス]]をバインドする型付きデータレイアウトです。アダプターは、これらのフィールドに分解できないダイジェストを受け入れてはならず（MUST NOT）、ダイジェストバインディングが成功し、デコードされたフィールドに対して`verifyPolicy`が成立する場合にのみマジック値`0x1626ba7e`を返し、それ以外の場合は`0xffffffff`を返さなければなりません（MUST）。

`isValidSignature`は状態を変更してはなりません（MUST NOT）（ERC-1271による）。これらの要件は、デコードされるエンベロープに適用されます。形式が不正なエンベロープはデコード中にリバートしてもよく（MAY）、ERC-1271の呼び出し元は既にそれを無効な署名として扱います。

回路がバインドされた公開入力以外に何を証明するか（プライベートな価格上限、マーチャント署名済み見積もり、カテゴリ制限、時間窓など）はポリシーの関心事であり、この標準の範囲外です。この標準は、証明がどこでチェックされるか、何にバインドされるか、およびポリシーと支払い間のシングルユース結合のみを固定します。

### 参照擬似コード（参考情報）

[[glossary/Groth16|Groth16]]は例示的な証明システムとして使用されています。証明エンコーディングと[[glossary/verifier|ベリファイア]]インターフェースは、ポリシーの登録された[[glossary/verifier|ベリファイア]]が定義するものです。

```solidity
function verifyPolicy(bytes calldata authorization, bytes calldata proof)
    external view returns (bool)
{
    (address to, uint256 value,,, bytes32 nonce) =
        abi.decode(authorization, (address, uint256, uint256, uint256, bytes32));

    // 1. Policy lookup. An unrevoked single-use policy must exist for `nonce`.
    Policy storage p = policies[nonce];
    if (p.paramsCommit == bytes32(0)) return false;

    // 2. Public-input construction. Nothing is taken from the prover except
    //    through `authorization`; the registered policy and the environment
    //    supply the rest.
    uint256[5] memory publicInputs = [
        uint256(uint160(to)),            // authorization
        value,                           // authorization
        uint256(p.paramsCommit),         // registered policy
        uint256(uint160(address(this))), // scopes proof to this contract
        block.chainid                    // scopes proof to this chain
    ];

    // 3. Groth16 verification against the verifier registered for this
    //    policy. For Groth16 the proof bytes decode as the (a, b, c) points.
    (uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c) =
        abi.decode(proof, (uint256[2], uint256[2][2], uint256[2]));
    return IGroth16Verifier(p.verifier).verifyProof(a, b, c, publicInputs);
}

// The ERC-1271 rail adapter: digest binding, then the same check. The token
// calls this; verifyPolicy above is what it is really asking.
function isValidSignature(bytes32 hash, bytes calldata signature)
    external view returns (bytes4)
{
    (bytes memory proof, bytes memory authorization) =
        abi.decode(signature, (bytes, bytes));

    // Digest binding. Recompute the EIP-712 digest from the authorization
    // fields under a supported schema (reference: ERC-3009
    // TransferWithAuthorization), with from = address(this), and require it
    // to equal `hash`. Equality pins the payer, since `from` is part of the
    // typed data and only this contract's address is ever used.
    bytes32 recomputed = eip712Digest(tokenDomainSeparator, authorization);
    if (recomputed != hash) return 0xffffffff;

    return this.verifyPolicy(authorization, proof)
        ? bytes4(0x1626ba7e)  // ERC-1271 magic value
        : bytes4(0xffffffff);
}
```

### 直接決済（オプション）

必須インターフェースには、意図的に資金を移動する関数は含まれていません。署名付き転送レールでは、支出関数はすでにトークン上に存在し（`transferWithAuthorization`）、任意のEOAまたはコントラクトがそれを呼び出すことができ、実装の役割は検証のみです。この分離により、機能がデプロイ済みのレールにそのままアタッチできます。

そのような支出パスがないレールでは、実装は`settle(authorization, proof)`を公開し、決済コンポーネント自体として機能してもよい（MAY）です。`settle`は`verifyPolicy(authorization, proof)`を要求しなければならず（MUST）、承認の有効期間を強制しなければならず（MUST）、転送前に[[glossary/nonce|ナンス]]を消費しなければならず（MUST）（これはポリシー登録で要求される[[glossary/nonce|ナンス]]消費決済コンポーネントです）、パーミッションレスでなければならず（MUST）、`Settled`イベントを発行すべきです（SHOULD）。`isValidSignature`とは異なり、`settle`は状態変更を伴う呼び出しであり、まさにそれが[[glossary/nonce|ナンス]]消費を所有できる理由です。

### インスタンス化: ERC-3009 / ERC-7598 / [[glossary/x402|x402]]（参考情報）

このセクションのいかなる内容も規範的ではありません。これは、今日稼働しているレール上での関数セットの1つのデプロイメントです。ERC-3009 + ERC-7598トークン（例えばUSDC v2.2以降）を使用する場合、決済は標準的なフローです。ファシリテーターは`transferWithAuthorization(from, to, value, validAfter, validBefore, nonce, bytes signature)`を、証明エンベロープ（proof envelope）を`signature`として提出します。`from`がコントラクトであるため、トークンはバイトを`from.isValidSignature`にルーティングし、それが上記の検証を実行します。[[glossary/x402|x402]]デプロイメントでは、エンベロープは標準の`exact`スキームの`X-PAYMENT`ヘッダーで伝達されます。マーチャントとファシリテーターは変更を必要としません。

```
x402              HTTP 402 envelope                      (要求の伝達方法)
 └─ ERC-3009      transferWithAuthorization              (ガスレス署名付き転送)
     └─ ERC-7598   bytes-signature overload              (証明を運ぶスロット)
         └─ ERC-1271  isValidSignature                   (アダプター: ポリシー証明を検証)
```

## 理論的根拠

**[[glossary/verifier|ベリファイア]]はアカウントであり、レールではない。** 実装コントラクトのアップストリームにあるすべてのものは、証明を不透明な署名として扱います。これにより「プロトコル変更なし」が成立し、ポータビリティの議論となります。[[glossary/EVM|EVM]]のインスタンス化はERC-3009/7598/1271ですが、不透明な署名[[glossary/blob|ブロブ]]を自己検証アカウントにルーティングするあらゆる決済システムは、同じパターンをホストできます。

**実行前のコールデータマッチングではなく、決済時の制約充足。** 「コールデータが署名済みインテントと等しい」ではなく「支払いがポリシーを満たす」を検証することで、証明がマーチャント署名済み見積もりなどのオフチェーンの事実を拘束できるようになり、支払いごとの署名が不要になります。所有者の1回の登録で、エージェントが見つける具体的な支払いが制約を満たす限り、それをカバーできます。

**クリアテキストポリシーではなく、コミットメント。** パラメータの代わりに[[glossary/paramsCommit|paramsCommit]]を登録することで、交渉に影響する値（上限）をオフチェーンに保ちつつ、それらを強制できます。

**プライバシーモデル。** 公開入力（public inputs）ベクトルは、設計上、秘密を含みません。ポリシーパラメータは[[glossary/paramsCommit|paramsCommit]]の背後にあり、マーチャントの見積もりなどのオフチェーンの事実はプライベートな証人（private witness）です。`to`と`value`が公開入力であるのは、決済時に本質的に公開されるためです。透明な[[glossary/ERC|ERC]]-20トークンは、いずれにせよ`Transfer(from, to, value)`を発行するため、検証呼び出しからそれらを隠しても何も得られません。それらを実際に隠すには、`to`/`value`をレールの独自のコミットメントに置き換えるプライベート決済レールが必要です。これはインスタンス化の懸念であり、このインターフェースの変更ではありません。ダイジェストの開示（digest opening）を回路内に移動すること（[[glossary/EIP-712-attestation-profile|EIP-712]]ハッシュを唯一の公開入力とすること）も検討されましたが、プライバシー上の利益がゼロであるため、回路内にkeccakを配置することになるため却下されました。

**1ポリシー = 1支払い。** ポリシーIDを承認[[glossary/nonce|ナンス]]にバインドすることで、決済パス独自のリプレイ保護をシングルユースメカニズムとして再利用し、署名パスでの実装をステートレスに保ちます。複数支払い予算（N回の決済にわたる減額予算を承認する1つのコミットメント）は、ビューオンリー署名チェックの外部で単調な使用済み状態の進行を必要とします。これらは意図的にこの[[glossary/ERC|ERC]]の範囲外であり、これに基づいて構築されることが期待されます（実装コントラクトは、[[glossary/verifier|ベリファイア]]として、そのカウンターの自然な場所です）。

**残高/ポリシーの結合なし。** 保持されている残高は、すべての未決済ポリシーにわたる集計損失を制限します。支払いごとの制限は各ポリシーから来ます。両者を結合すること（ポリシーごとに残高を予約すること）は実装の選択であり、標準の要件ではありません。

## 後方互換性

デプロイ済みのコントラクトやプロトコルに変更はありません。`bytes`署名を[[glossary/Searcher|支払い者]]のERC-1271チェックにルーティングするあらゆる決済パスは、準拠するコントラクトから支出できます。ERC-3009とERC-7598の`bytes`オーバーロードを実装する[[glossary/ERC|ERC]]-20トークン（USDC FiatTokenV2_2以降）がデプロイ済みの例であり、[[glossary/x402|x402]]スタイルのHTTPフローはエンベロープをそのまま伝達します。

## セキュリティ上の考慮事項

-   **回路の健全性がポリシーである。** ポリシー回路のバグは、支出制御のバグです。ポリシー回路は、小さく、監査可能で、[[glossary/paramsCommit|paramsCommit]]内でバージョン管理されるべきです（コミットメント内の回路バージョンフィールドは、廃止された回路形状からの証明を防ぎます）。
-   **証明システムの選択。** [[glossary/Groth16|Groth16]]は回路ごとの[[glossary/trusted-setup|トラステッドセットアップ（信頼できる設定）]]を必要とします。ポリシーごとの[[glossary/verifier|ベリファイア]]フィールドにより、証明システムをポリシーごとに交換可能に保ちます。
-   **[[glossary/verifier|ベリファイア]]はポリシーの一部である。** [[glossary/verifier|ベリファイア]]コントラクトは1つの回路の検証鍵を埋め込み、[[glossary/paramsCommit|paramsCommit]]はその回路に対してのみ意味を持つため、両者は`allowPolicy`で一緒に登録されます。これにより、ある回路の証明を別の回路のコミットメントに対して検証する構造的な防止がなされます。[[glossary/verifier|ベリファイア]]アドレスは所有者によって設定されるため、所有者によって信頼されます（悪い[[glossary/verifier|ベリファイア]]を登録することは、悪いポリシーを承認することと同じ種類の誤りです）。実装はそれをステートレスなビュー関数（view function）として呼び出さなければなりません（MUST）。[[glossary/verifier|ベリファイア]]は共有インフラストラクチャです。パラメータは[[glossary/paramsCommit|paramsCommit]]を介して変化し、回路を介して変化しないため、回路ごと、チェーンごとに1つのデプロイメントがすべてのポリシーとすべての実装コントラクトにサービスを提供します。[[glossary/zkEVM|zkVM]][[glossary/verifier|ベリファイア]]のように、[[glossary/verifier|ベリファイア]]が普遍的である場合（プログラムIDを取ることで多くの回路を検証する1つのデプロイメント）、回路IDは登録時に、[[glossary/paramsCommit|paramsCommit]]内またはそれと並行して固定されなければなりません（MUST）。この場合、[[glossary/verifier|ベリファイア]]アドレスだけでは回路を特定できません。
-   **ビューオンリー検証（View-only verification）。** ERC-1271検証は状態を書き込むことができないため、署名パスのいかなるものも支出の記録に依存してはなりません。シングルユースは決済パスの[[glossary/nonce|ナンス]]消費から来ており、実装からではありません。
-   **エンベロープはスクリプトではない。** 回路が制約しないフィールドはエージェントの裁量です。同じポリシーを満たす2つの支払いは交換可能です。所有者は、自然言語のタスクではなく、ポリシーが執行境界のすべてであることを理解しなければなりません（MUST）。
-   **引用署名者の信頼。** マーチャント署名済み見積もりをバインドするポリシーは、マーチャントの署名鍵を信頼アンカーとします。侵害された引用署名者は、上限の意図を無効にする価格を証明する可能性があります（受取人バインディングは決して無効になりません）。
-   **取り消し競合。** 決済前の`revokePolicy`は、それ以降の`isValidSignature`呼び出しに対して有効でなければなりませんが（MUST）、同じブロックで既に進行中の決済はまだ検証される可能性があります。強制キャンセルが必要な所有者は、決済パス独自のキャンセル（例えばERC-3009 `cancelAuthorization`）も利用すべきです（SHOULD）。

## 著作権

CC0により著作権および関連する権利を放棄します。

*7件の投稿 - 3名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8366-zero-knowledge-spending-policies/29281)
