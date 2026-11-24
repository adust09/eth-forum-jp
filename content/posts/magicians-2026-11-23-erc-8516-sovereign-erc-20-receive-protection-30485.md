---
title: 'ERC-8516: ERC-20受信保護の主権的制御'
original_title: 'ERC-8516: Sovereign ERC-20 Receive Protection'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8516-sovereign-erc-20-receive-protection/30485
author: radek
date: '2026-11-23'
category: Uncategorized
tags:
  - eip
  - smart-contracts
  - account-abstraction
  - security
  - ux
  - defi
  - protocol-design
topic_id: '30485'
translated_at: '2026-11-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8516: Sovereign ERC-20 Receive Protection](https://ethereum-magicians.org/t/erc-8516-sovereign-erc-20-receive-protection/30485) — radek (2026-11-23)

ERC PR: [ERC-8516: ERC-20受信保護の主権的制御のプルリクエスト](https://github.com/ethereum/ERCs/pull/2213)

## 概要

この[[glossary/ERC|ERC]]は、ERC-20へのオプトイン拡張を定義しており、任意のアカウントが着信トークン転送およびミントをゲートできるようにします。最小限のコアインターフェースは、インテグレーター向けの標準的な保護ステータスと事前チェックを公開し、モジュラー拡張により、受信者はトークンごとの許可リスト、拒否リスト、一度限りのオフチェーン署名、または[[glossary/EOA|EOA]]と[[glossary/Smart-Account|スマートアカウント]]の両方で外部ポリシーコントラクトを介して送信者を承認またはブロックできます。

## 動機

標準のERC-20トークンは、いかなるアドレスも同意なしに任意の受信者へトークンをプッシュすることを許可します。これにより、いくつかの繰り返し発生する問題が生じます。

1.  **アドレスポイズニングとダスト/スパム転送**: 攻撃者は、似たようなアドレスからゼロ値またはダスト転送を送信し、トランザクション履歴を汚染します。
2.  **汚染された流入とコンプライアンス**: 財務、DAO、および規制対象エンティティは、予期せぬ資産をカストディするのではなく、未検証または制裁対象のソースからの転送を拒否したい場合があります。
3.  **会計の健全性**: 自動化された財務システムは、プロトコル層で未承諾の流入を拒否することから恩恵を受けます。

既存の転送制限標準（ERC-3643など）は通常、発行者によって制御されますが、以前の受信者フック設計（ERC-777の`tokensReceived`など）は、転送中に状態を変更するリエントランシーベクターを導入し、[[glossary/EOA|EOA]]をネイティブに保護しませんでした。この提案は、リエントランシーリスクなしに[[glossary/EOA|EOA]]と[[glossary/Smart-Account|スマートアカウント]]の両方に対する**受信者側の主権**を導入し、**オプトイン**のデフォルトを通じて既存のERC-20ウォレット、DEXルーター、およびブリッジとの後方互換性を維持します。

## 仕様

このドキュメントのキーワード「MUST」、「MUST NOT」、「REQUIRED」、「SHALL」、「SHALL NOT」、「SHOULD」、「SHOULD NOT」、「RECOMMENDED」、「NOT RECOMMENDED」、「MAY」、「OPTIONAL」は、RFC 2119およびRFC 8174に記述されているように解釈されます。

### コア挙動

1.  **オプトインのデフォルト**: 新規アカウントはデフォルトで`isReceiveProtected(account) == false`でなければなりません。保護されていないアカウントは、標準ERC-20セマンティクスに従って受信転送とミントを受け入れなければなりません。
2.  **経済的送信者の帰属**: `to`が保護を有効にしている場合（`isReceiveProtected(to) == true`）、チェックは`from`（経済的送信者）を評価しなければならず、`msg.sender`（DEXルーターまたは`transferFrom`における支出者である可能性がある）を評価してはなりません。
3.  **免除とミント**:
    -   バーン（`to == address(0)`）は受信保護によってブロックされてはなりません。
    -   自己転送（`from == to`）は、`to`が保護されている場合でも許可されなければなりません。
    -   ミント（`from == address(0)`）は`to`の保護ルールに従わなければなりません。`address(0)`は許可リストに登録されるか、`permitReceive`を介して許可されてもよいです。
4.  **承認**: `to != address(0)`、`from != to`、および`isReceiveProtected(to) == true`の場合、実装された承認拡張機能間の評価順序と構成（`OR`対`AND`）は、以下の[[glossary/Invariant|不変条件]]に従ってトークン実装者に委ねられます。
    -   `canReceive(from, to, amount)`は、転送チェックと全く同じ承認結果を返さなければなりません。
    -   一度限りの受信許可（`oneTimeReceiveLimit(from, to) > 0 && amount <= oneTimeReceiveLimit(from, to)`)が転送を承認するために使用される場合、一度限りの制限全体は`0`にクリアされなければなりません（部分的な金額であっても厳密に一度限り使用）。
    -   外部`IReceivePolicy`が照会される場合、それは`staticcall`を介して呼び出されなければならず、フェイルクローズ（`false`またはリバートを拒否として扱う）しなければなりません。
    -   転送が承認されない場合、トークンは`RecipientTransferNotAllowed(from, to, amount)`でリバートしなければなりません。

### コアインターフェース（必須 — `MUST`）

**外部インテグレーターおよびオフチェーン/オンチェーンツール**（ウォレット、DEX、ブリッジ、バッチディストリビューター、ブロックエクスプローラー、インデクサー）向けに、準拠するトークンは、保護ステータス、事前転送チェック、および標準エラーデコードを公開するために、以下の最小限のコアインターフェースを実装しなければならず、コアおよびオプションの拡張サポートを宣伝するために[[glossary/ERC-165-discoverable|ERC-165で検出可能]]（`supportsInterface`）を実装すべきです。

```
interface IERCProtectedReceiveCore {
    event ReceiveProtectionUpdated(address indexed account, bool enabled);

    error RecipientTransferNotAllowed(address from, address to, uint256 amount);

    function isReceiveProtected(address account) external view returns (bool);
    function canReceive(address from, address to, uint256 amount) external view returns (bool);
}
```

### アカウント保護設定拡張

### アカウント保護設定拡張

これらの拡張機能は、アカウントが受信保護状態を**どのように有効化、設定、または委任するか**を管理します。

#### オプトイン切り替え拡張（推奨 — `SHOULD`）

**アカウント所有者およびウォレット/カストディUI**（[[glossary/EOA|EOA]]、ハードウェア/コールドウォレット、[[glossary/MPC|MPC (マルチパーティ計算)]]カストディ、マルチシグダッシュボード）向けに、この拡張機能は、呼び出し元自身の口座で着信転送保護を有効または無効にするための標準的なセルフサービストグルを提供します。

```
interface IERCProtectedReceiveOptIn {
    function setReceiveProtection(bool enabled) external;
}
```

#### 保護レベル拡張（オプション — `MAY`）

粒度の高い`bytes32`保護ビットマスクまたはティア（`bytes32(0)` = 保護なし、`bytes32(uint256(1))` = デフォルト）をサポートする**ウォレットUIおよび[[glossary/Smart-Account|スマートアカウント]]**向けに、実装は`setReceiveProtection(bytes32)`を公開してもよいです。2つの非ゼロレベル間で更新する場合、`ReceiveProtectionLevelUpdated`を発行しなければならず、`ReceiveProtectionUpdated`を再発行してはなりません（これは`0 <-> 非ゼロ`遷移のために予約されています）。

```
interface IERCProtectedReceiveLevel {
    event ReceiveProtectionLevelUpdated(address indexed account, bytes32 protectionLevel);

    function receiveProtectionLevel(address account) external view returns (bytes32);
    function setReceiveProtection(bytes32 protectionLevel) external;
}
```

#### 署名ベース保護拡張（オプション — `MAY`）

**リレイヤー、[[glossary/Paymaster|ペイマスター]]、送信者、およびウォレット/チェックアウトUI**が**0-ETHアカウント**（受信者由来の1回限り/請求書アドレス、反実仮想[[glossary/Smart-Account|スマートアカウント]]、またはコールドストレージなど）に代わって動作する場合、実装は[[glossary/EIP-712-attestation-profile|EIP-712]]署名ベースの保護管理を公開してもよいです。

```
interface IERCProtectedReceiveSig {
    error ExpiredReceiveProtectionSetupSignature(uint256 deadline);
    error InvalidReceiveProtectionSetupSignature(address account);

    function setReceiveProtectionWithSig(
        address account,
        bytes32 protectionLevel,
        uint256 deadline,
        bytes calldata signature
    ) external;
}
```

-   **[[glossary/EIP-712-attestation-profile|EIP-712]]タイプハッシュ**:

    ```
    SetReceiveProtection(address account,bytes32 protectionLevel,uint256 nonce,uint256 deadline)
    ```

    *（`uint256 nonce`は、アカウントごとに一度限りの[[glossary/Replay-protection|リプレイプロテクション]]を提供しなければならず、ノンススキーム（シーケンシャルまたは順序なし）およびオンチェーンクエリゲッターは実装定義であり、この標準の範囲外です。）*

-   **アトミックな一度限りのアカウント保護**: 受信者由来の1回限りアドレスの場合、送信者またはリレイヤーは、単一のトランザクションで`1. transfer(S, amount)` → `2. setReceiveProtectionWithSig(S, level, deadline, sig)`を実行できます。これにより、`S`は資金が供給され、0 ETHで即座に保護され、保護されていない期間はなくなります。

    *（注: ERC-5564のような送信者由来のステルススキームでは、受信者がアナウンスをスキャンするまで`S`を知らないため、`S`は資金調達トランザクションとリレーされた`setReceiveProtectionWithSig`トランザクションの間で保護されないままになります。）*

#### 外部ポリシー委任拡張（オプション — `MAY`）

DAO、財務、[[glossary/Modular-smart-accounts|モジュラー型スマートアカウント]]、およびパワーユーザーが、トークンごとに状態を重複させることなく、共有のマルチトークンルールまたはカスタム受信ロジック（クロストークン許可リスト/拒否リスト、最小金額ダストフィルター、レート制限、またはコンプライアンスおよび汚染チェックなど）を必要とする場合:

```
interface IERCProtectedReceivePolicy {
    event ReceivePolicyUpdated(address indexed account, address indexed policy);

    function receivePolicy(address account) external view returns (address);
    function setReceivePolicy(address policy) external;
}

interface IReceivePolicy {
    function canReceive(
        address token,
        address from,
        address to,
        uint256 amount,
        bytes calldata data
    ) external view returns (bool allowed);
}
```

トークンは`staticcall`を介して`IReceivePolicy.canReceive`をクエリしなければならず（`view`インターフェースによって強制される）、リエントランシーリスクなしに`_update`中のEVMレベルでの読み取り専用実行を保証します。`data`パラメータは、トークンがオプションのABIエンコードされたコンテキスト（`msg.sender`、アローワンス、トークン固有のフラグ、またはティアやコンプライアンス属性などの送信者/受信者アカウントメタデータなど。デフォルトは`""`）を渡すことを許可します。`data`は不透明でトークン定義であるため、汎用的なマルチトークンポリシーは、呼び出し元トークンと調整されていない限り、任意のトークン間で固定の`data`スキーマを想定すべきではありません。[[glossary/Modular-smart-accounts|モジュラー型スマートアカウント]]（ERC-7579アカウントなど）または共有レジストリは、`IReceivePolicy`を直接実装して、すべてのサポートするトークンにわたって統一されたアカウントレベルの受信ルールを強制できます。

### 送信者承認とブロック拡張

これらの拡張機能は、保護された受信者に対して、**どの送信者または個々の転送が承認またはブロックされるか**を管理します。

#### 一度限りの受信許可拡張（オプション — `MAY`）

保護された受信者、送信者、リレイヤー、およびチェックアウト/請求書UIが、単一の、金額上限付きの受信支払い（一度限りの請求書、OTC取引、または稀な取引相手など）を、送信者を永続的な許可リストポリシーに追加することなく決済する場合:

```
interface IERCProtectedReceivePermit {
    event OneTimeReceivePermitted(
        address indexed from,
        address indexed to,
        uint256 indexed nonce,
        uint256 maxAmount,
        uint256 deadline
    );

    error ExpiredReceivePermit(uint256 deadline);
    error InvalidReceivePermitSignature(address recipient);
    error InvalidReceiveNonce(address recipient, uint256 nonce);

    function oneTimeReceiveLimit(address from, address to) external view returns (uint256);
    function isReceiveNonceUsed(address account, uint256 nonce) external view returns (bool);

    function permitReceive(
        address from,
        address to,
        uint256 maxAmount,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external;
}
```

-   **[[glossary/EIP-712-attestation-profile|EIP-712]]タイプハッシュ**:

    ```
    PermitReceive(address from,address to,uint256 maxAmount,uint256 nonce,uint256 deadline)
    ```

-   **署名検証とドメイン発見**: 実装は[[glossary/ECDSA-signature|ECDSA署名]]と[[glossary/ERC-1271|ERC-1271]]スマートコントラクト署名（例: OpenZeppelin `SignatureChecker`を介して）の両方をサポートしなければならず、ウォレットが[[glossary/EIP-712-attestation-profile|EIP-712]]署名ドメインを動的に発見できるようにERC-5267 (`eip712Domain()`)を実装すべきです。承認された署名者は、受信者`to`自身であるか、`to`のために設定された指定された委任署名者（例: オペレーション/財務共同署名者または[[glossary/ERC-1271|ERC-1271]]バリデータ）であってもよいです。

-   **[[glossary/Replay-protection|リプレイプロテクション]]（順序なしノンス）**: シーケンシャルノンスは、並行するオフチェーン許可をシリアライズします。受信者が複数の送信者に許可を発行した場合、順序が異なる決済はリバートまたは衝突します。代わりに、`permitReceive`は、受信者`to`ごとにスコープされた任意の順序なし`uint256`ノンスを使用します。実装は、消費された各`nonce`を使用済みとしてマークしなければならず、`isReceiveNonceUsed(to, nonce)`を介してそのステータスを報告しなければならず、`nonce`がすでに使用されている場合は`InvalidReceiveNonce(to, nonce)`でリバートしなければなりません。ガス効率の良い参照パターン（Permit2のように）として、実装は、`wordPos = uint248(nonce >> 8)`と`bitPos = uint8(nonce)`（`mask = 1 << bitPos`）でインデックス付けされた順序なし256ビットビットマップにノンスを格納し、256個の並行許可を単一のストレージスロットにパックしてもよいです。オフチェーン署名者は、必要に応じて軸を選択できます（例: ウォームスロットパッキングには`wordPos = 0`、送信者ごとの分離には`wordPos = uint248(uint160(from))`、ステートレスなマルチデバイス発行にはランダムな`uint248` `wordPos`）。

-   **無制限キャップ**: `maxAmount = type(uint256).max`を署名することで、任意の単一転送金額を一度だけ許可します。

-   **ゼロアドレスチェック**: `from`または`to`が`address(0)`である場合、実装はリバートしなければなりません。

#### 組み込み許可リスト拡張（オプション — `MAY`）

組み込み許可リストを検査する**エクスプローラー、インデクサー、およびウォレット/カストディUI**向け。エントリがどのように管理されるか（例: 直接`msg.sender`セッター、バッチ処理、または委任されたマネージャー）は実装に委ねられます。

```
interface IERCProtectedReceiveAllowlist {
    event ReceiveSenderAllowlistUpdated(address indexed from, address indexed to, uint40 expiry);

    function receiveSenderAllowlistedUntil(address from, address to) external view returns (uint40);
}
```

#### 組み込み拒否リスト拡張（オプション — `MAY`）

組み込み拒否リストエントリを検査する**エクスプローラー、インデクサー、およびウォレット/カストディUI**向け（例: 拒否リストのみの保護または明示的な送信者ブロックの場合）、この拡張機能は現在のブロック有効期限と更新を公開します。エントリがどのように管理されるか（例: 直接`msg.sender`セッター、バッチ処理、または委任されたマネージャー）と、それらが許可リスト、`permitReceive`、または`protectionLevel`とどのように構成されるかは実装に委ねられます。

```
interface IERCProtectedReceiveDenylist {
    event ReceiveSenderDenylistUpdated(address indexed from, address indexed to, uint40 expiry);

    function receiveSenderDenylistedUntil(address from, address to) external view returns (uint40);
}
```

-   **有効期限セマンティクス**: `expiry == 0`または`expiry <= block.timestamp`は、アクティブに拒否されていないことを意味します。`expiry > block.timestamp`は、`expiry`まで`from`をブロックします。`type(uint40).max`は永続的なブロックを示します。
-   **その他の拒否ルール**: 最小金額ダストフィルター、レート制限、または汚染スクリーニングは`IReceivePolicy`と`IERCProtectedReceiveLevel`に属します。

### 利便性と相互運用性

#### アトミック転送ヘルパー（オプション — `MAY`）

実装は、単一トランザクション決済のための利便性ヘルパーを公開してもよいです。

-   `transferWithReceivePermit(address to, uint256 amount, uint256 maxAmount, uint256 nonce, uint256 deadline, bytes calldata receiveSignature)`: `permitReceive`と`transfer`をアトミックに呼び出します。
-   `transferFromWithPermits(address from, address to, uint256 amount, SpendPermit calldata spendPermit, ReceivePermit calldata receivePermit)`: [[glossary/EIP|EIP]]-2612 `permit`（`from`から、`SpendPermit`はオンチェーン`nonces(from)`を使用して`{deadline, v, r, s}`を保持する）、`permitReceive`（`to`から、`ReceivePermit`は`{maxAmount, nonce, deadline, signature}`を保持する）、および`transferFrom`を1つのリレーヤートランザクションに結合します。

#### ERC-7943 / uRWAとの互換性（オプション — `MAY`）

この標準と[[glossary/uRWA-Policy-Interface|ERC-7943 (uRWA)]]の両方を実装するトークンは、`canReceive(from, to, amount)`を正準な受信者ゲーティングチェックとして保持し、以下のオプションの相互作用を伴います。

-   **`canTransfer(address from, address to, uint256 amount)`**: この標準とともに実装されている場合、`canTransfer(from, to, amount)`は、`canReceive(from, to, amount)`が`false`を返すときは常に`false`を返さなければなりません。

## 理論的根拠

-   **オプトイン対オプトアウト**: デフォルトでオプトインすることで、CEXの引き出し、ブリッジ、および一度もトランザクションを送信したことのないコールドアドレスを壊すことを回避します。
-   **ハイブリッド組み込み+ポリシーモデル**: 組み込み許可リストは、シンプルなユーザーにとって外部呼び出しを必要とせず、オプションの`IReceivePolicy`委任により、財務やパワーユーザーは、すべてのサポートするトークンにわたって1つの共有許可リストを維持できます。
-   **読み取り専用ポリシー呼び出し（`staticcall` + [[glossary/EIP|EIP]]-1153）**: `IReceivePolicy.canReceive`が`view`（`staticcall`）であることを要求することで、`_update`中のリエントランシーリスクを排除し、ポリシーが同じトランザクションの早い段階で設定された[[glossary/Transient-Storage|EIP-1153トランジェントストレージ]]（`TLOAD`）を読み取れるようにします（例: `SSTORE`の肥大化やMerkleプライバシー漏洩なしに、10,000以上の取引相手に対する署名済み許可リストチケット）。
-   **厳密な一度限りの許可**: 最初のマッチする転送で`oneTimeReceiveLimit`全体をクリアすることで、送信者が承認された金額を複数のダスト/スパム転送に分割するのを防ぎます。
-   **バーン免除（`to == address(0)`）**: バーンは、受信者に資金を届けるのではなく、トークンを破壊します。`to == address(0)`を明示的に免除することで、保護されたアカウントが誤って受信チェックをトリガーすることなく、常にトークンをバーンまたは償還できることを保証します。
-   **自己転送免除（`from == to`）**: `from == to`である転送は、汚染された流入、新しい取引相手、または類似のアドレスポイズニングログを導入できません。それらを免除することで、[[glossary/Smart-Account|スマートアカウント]]やプロトコルにおけるネットゼロのリバランス/会計フローを壊すことを回避します。
-   **ミントゲーティング（`from == address(0)`）**: ミントは受信者の残高を増加させ、未承諾のエアドロップや会計ノイズに依然として使用される可能性があります。`from == address(0)`をゲーティングすることで、保護の一貫性を保ちつつ、受信者がミントを期待しているときに`address(0)`を明示的に許可リストに登録するか、`permitReceive`を発行できるようにします。

## 後方互換性

この標準はERC-20への純粋な追加拡張であり、任意の正準なERC-20実装、ウォレット、DEX、またはブリッジと互換性があります。

-   **変更されていない正準インターフェース**: 既存のERC-20関数シグネチャ（`transfer`、`transferFrom`、`approve`、`balanceOf`、`allowance`、`totalSupply`）やイベント（`Transfer`、`Approval`）は変更または削除されません。サポートは[[glossary/ERC-165-discoverable|ERC-165で検出可能]]（`supportsInterface`）を介して発見可能です。
-   **同一のデフォルト挙動**: アカウントはデフォルトで`isReceiveProtected(account) == false`であるため、すべての既存の[[glossary/EOA|EOA]]、スマートコントラクト、流動性プール、およびコールドアドレスは、明示的にオプトインしない限り、正準なERC-20と同一に動作します。
-   **アグリゲーターとルーターの互換性**: `transferFrom`で`msg.sender`ではなく`from`を評価することで、DEXルーター、アグリゲーター、リレイヤーがそれ自体を許可リストに登録する必要なくシームレスに機能することを保証します。
-   **保護されたアカウントのリバート挙動**: `isReceiveProtected(to) == true`であり、転送が承認されない場合、`transfer`と`transferFrom`はリバートします。これはERC-20転送制限パターン（ERC-3643やERC-1404など）と一貫しています。任意の受信者へのプッシュベースのバッチ配布を実行するプロトコルは、`canReceive(from, to, amount)`を事前にチェックするか、リバートする転送を分離/スキップして、1つの保護された受信者がバッチ全体をブロックできないようにすべきです。

## セキュリティに関する考慮事項

-   **フェイルクローズポリシー呼び出し**: アカウントがバグのあるまたはリバートする`IReceivePolicy`を設定した場合、`ProtectedERC20`はリバートを捕捉し、転送を拒否されたもの（`false`）として扱います。アカウント所有者は、`setReceivePolicy(address(0))`または`setReceiveProtection(false)`を呼び出すことでいつでも回復できます。
-   **ゼロ金額転送**: チェックは明示的に`oneTimeLimit > 0`を要求するため、未初期化ストレージ（`0`）が`0`値転送を承認することはありません。
-   **読み取り専用ポリシー照会（`staticcall`）**: `staticcall`を介して`IReceivePolicy.canReceive`を照会することで、EVMレベルで、悪意のあるまたはバグのあるポリシーが`_update`中に状態を変更したり、トークンにリエントリしたりできないことを保証します。
-   **呼び出し元に依存するポリシー`data`との事前チェックの乖離**: トークンが呼び出し元に依存するコンテキスト（`msg.sender`など）を`data`で転送し、`IReceivePolicy`がそれに依存する場合、事前チェックの`canReceive(from, to, amount)`ビュー呼び出し（ここで`_msgSender()`はクエリ元のUI/ウォレット）は、その後の`transferFrom`実行（ここで`_msgSender()`はルーターまたはリレイヤー）とは異なる結果を返す可能性があります。そのトレードオフが明示的に意図されていない限り、ポリシーは`msg.sender`に依存することを避けるべきです。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8516-sovereign-erc-20-receive-protection/30485)
