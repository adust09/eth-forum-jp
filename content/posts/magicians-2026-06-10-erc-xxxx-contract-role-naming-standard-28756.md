---
title: 'ERC-XXXX: コントラクトロール命名標準'
original_title: 'ERC-XXXX: Contract Role Naming Standard'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-xxxx-contract-role-naming-standard/28756'
author: baishuo13
date: '2026-06-10'
category: ERCs
tags:
  - ercs
  - smart-contracts
  - eip
  - security
  - protocol-design
  - governance
  - execution-layer
  - verification
  - role-management
  - naming-standard
topic_id: '28756'
translated_at: '2026-06-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX: Contract Role Naming Standard](https://ethereum-magicians.org/t/erc-xxxx-contract-role-naming-standard/28756) — baishuo13 (2026-06-10)

## **概要**

この提案は、スマートコントラクトにおける特権ロールの命名のための階層的な名前空間パターンを定義し、プロトコル間で一貫したロール命名を段階的な採用をサポートしつつ可能にします。`role.{category}.{action}` パターンと `keccak256` ハッシュ導出を組み合わせることで、意味的に明確でハッシュによって発見可能な標準化された命名を提供します。コアロールセットはコントラクトの機能に基づいて条件付きで適用されます。標準化されたストレージスロットによりロールレジストリの発見が可能になり、オンチェーンクエリインターフェースはロール名の解決とコアロールの検証を提供します。この標準は、プロトコル間で同等の特権コントラクトロールの命名規則が inconsistent であることによって引き起こされる断片化に対処します。

> 注: ロール名の意味的導出ルールは、コンパニオン[[EIP|EIP（Ethereum 改善提案）]]であるコントラクトロールセマンティクス標準によって定義されます。

## **動機**

スマートコントラクトにおける特権ロールの命名は、イーサリアムエコシステム全体で非常に inconsistent です。OpenZeppelinは `DEFAULT_ADMIN_ROLE`、`MINTER_ROLE`、`PAUSER_ROLE`、その他17以上の命名パターンを使用しています。Aave V3は `POOL_ADMIN`、`BRIDGE_ADMIN`、`RISK_ADMIN` を使用しています。Compound IIIは `pauseGuardian`、`borrowCapGuardian`、`baseRateOracle` を使用しています。Venus Protocolは、統一された命名を持たない関数レベルのポーズ機能を使用しています。

この inconsistency は3つの重大な問題を引き起こします。

1.  **プロトコル間の監査が不可能**: 監査人は、「アップグレードロール」が複数のプロトコル間で適切に保護されているかを機械的に検証できません。なぜなら、各プロトコルが異なる名前を付けているからです。監査レポート間でロールのセマンティクスを手動で相互参照することは、ヒューマンエラーを招きます。

2.  **ロール混同攻撃**: プロトコルAの `ADMIN` ロールは無制限の権限を付与するかもしれませんが、プロトコルBの `ADMIN` はセカンダリのオペレーターです。監査ツールは、名前だけではロールの権限を区別できません。[[EIP|EIP（Ethereum 改善提案）]]-6366の動機で述べられているように、「`Owner`、`Operator`、`Manager`、`Validator`、その他の特別なロールは多くのスマートコントラクトで一般的です…これらの権限は単一のスマートコントラクトで管理されていないため、これらのシステムの監査と維持は困難です。」

3.  **意味のずれ攻撃**: 実際にはミント操作を実行するカスタムの `BURNER` ロールは、監査人のロール名に関する仮定を悪用し、誤った外観を作り出す可能性があります。

[[EIP|EIP（Ethereum 改善提案）]]-5982はロールベースアクセス制御 (RBAC) インターフェースを定義していますが、ロール命名規則を特定していません。[[EIP|EIP（Ethereum 改善提案）]]-7820はクロスコントラクトのロール管理を提供しますが、命名を標準化していません。[[EIP|EIP（Ethereum 改善提案）]]-6366は命名の inconsistency を認識していますが、命名の標準化ではなくビット操作の権限によって対処しています。[[EIP|EIP（Ethereum 改善提案）]]-7303はロールハッシュ計算に `keccak256("MINTER")` を推奨していますが、階層的な命名を定義していません。既存の[[EIP|EIP（Ethereum 改善提案）]]には、規範的なロール名が何であるべきか、または拡張可能な階層的命名構文を提供するものは存在しません。

## **仕様**

このドキュメントにおけるキーワード「MUST」、「MUST NOT」、「REQUIRED」、「SHALL」、「SHALL NOT」、「SHOULD」、「SHOULD NOT」、「RECOMMENDED」、「NOT RECOMMENDED」、「MAY」、「OPTIONAL」は、RFC 2119およびRFC 8174に記述されている通りに解釈されます。

### **ロール命名構文**

ロール名 **MUST** は以下のBNF文法に準拠する必要があります。

```
<role-name> ::= "role" "." <ident> "." <ident>
```

```
<ident>     ::= [a-z][a-z0-9]*
```

対応する正規表現は次のとおりです。

```
^role\.[a-z][a-z0-9]*\.[a-z][a-z0-9]*$
```

有効な例: `role.admin.root`, `role.token.mint`, `role.system.proxy`

無効な例: `ADMIN`, `MINTER_ROLE`, `role.Admin`, `role.123.mint`, `role.token.Mint`, `role.aave.token.mint`

#### **レベル1 ロール定数定義**

レベル1を実装するコントラクトは、命名構文を使用してロール定数を定義 **MUST** します。以下の例は、管理者、トークン、およびシステム操作を持つコントラクトの正しいロール定数定義を示しています。

```
// Level 1 — Role constant definitions
bytes32 public constant ROLE_ADMIN_ROOT = keccak256("role.admin.root");
bytes32 public constant ROLE_TOKEN_MINT = keccak256("role.token.mint");
bytes32 public constant ROLE_SYSTEM_PAUSE = keccak256("role.system.pause");
```

### **ロールハッシュ導出**

`bytes32` ロールハッシュは次のように計算 **MUST** されます。

```
bytes32 roleHash = keccak256(roleNameString);
```

このパターンは[[EIP|EIP（Ethereum 改善提案）]]-5982および[[EIP|EIP（Ethereum 改善提案）]]-7303によって推奨されています。テストベクトル:

-   `keccak256("role.admin.root")` → `0x448bc86664db33d6588225675ce4416b4011dc2042715b15896ebd54b3505eea`

-   `keccak256("role.token.mint")` → `0x55fb6288bd8e87dee5defd2246b578e35c083751d5b87edda220600b885d438e`

-   `keccak256("role.system.pause")` → `0x14d56b8c118883194ba501333a39231409c3c0ebf29b0dc180005569e6bc0b7b`

### **ロール命名形式**

#### **2部構成の規範的構成**

規範的構成は `role.{category}.{action}` 形式を使用します。この形式はすべてのロール命名に使用 **SHOULD** され、ロール名の推奨される識別子形式として機能します。BNF文法に準拠する名前は2部構成の形式である **MUST** 必要があります。SHOULD は、すべてのコントラクトがこの命名形式を採用することを奨励しますが、コントラクトは非標準の命名を使用することもできます（その場合、この標準の対象外となります）。

**カテゴリ定義原則**: カテゴリは機能ドメイン、つまり関連する操作の論理的なグループ化を表します。有効なカテゴリは以下の原則を満たす **SHOULD** 必要があります。

1.  **ドメイン指向**: カテゴリは「どの操作ドメインか」を記述し、アクションは「どのような操作か」を記述します。カテゴリは名詞ベースの機能ドメインであり、アクションは動詞ベースの操作です。動詞（例: pause, upgrade, freeze）はカテゴリとして使用 **MUST NOT** され、対応する機能ドメイン内のアクションとして使用 **MUST** されます。Tier-0ロール（例: root admin）の場合、そのセマンティクスが特定の操作ではなく「ドメイン内の最高権限」を表すため、アクションは位置を示す名詞である場合があります。

2.  **凝集性**: 同じカテゴリ下のアクションは、同じ機能ドメインに属し、認証管理セマンティクスを共有するべきです（同じ付与者ロールがドメイン内のすべての原子ロールを管理します）。

3.  **拡張性**: カテゴリは複数の関連するアクションに対応できるべきです。単一のアクションのみを含むカテゴリは、より広範な機能ドメインに統合することを検討するべきです。

これらの原則の検証は、コンパイル時および監査時に行われます。コントラクトは、カテゴリが名詞ベースの機能ドメインであるかをチェックするためにリンター規則を使用 **SHOULD** し、監査ツールは、適合性チェック中に命名の準拠を検証 **SHOULD** します。

| カテゴリ | アクション | 規範名 | ドメイン説明 |
| --- | --- | --- | --- |
| admin | root | role.admin.root | 管理ドメイン（rootはTier-0の例外で、ドメイン内の最高権限を表す） |
| token | mint | role.token.mint | トークンドメイン |
| token | burn | role.token.burn | トークンドメイン |
| token | freeze | role.token.freeze | トークンドメイン |
| system | pause | role.system.pause | システム操作ドメイン |
| system | upgrade | role.system.upgrade | システム操作ドメイン |
| system | proxy | role.system.proxy | システム操作ドメイン（プロキシ管理操作） |
| bridge | relay | role.bridge.relay | クロスチェーンドメイン |
| reserve | audit | role.reserve.audit | リザーブドメイン |
| finance | withdraw | role.finance.withdraw | ファイナンスドメイン |

### **コアロールセット（条件付きSHOULD）**

コアロールは、プロトコル間で高頻度で出現し、その誤用が直接的な資金損失やガバナンスの侵害につながる可能性がある特権ロールです。以下にリストされているすべてのコアロールは、以下の採用基準を満たしています。(1) OpenZeppelin、Aave、Compoundの少なくとも2つのロールシステムに存在すること、および (2) ロールの誤った認証または設定の欠落が、不可逆的な資金損失またはガバナンスのハイジャックにつながる可能性があること。

コアロールセットはこの[[EIP|EIP（Ethereum 改善提案）]]によって固定されます。新しいコアロールは、別の[[EIP|EIP（Ethereum 改善提案）]]を通じて提案される必要があり、その動機セクションで両方の採用基準を満たしていることを示す必要があります。

#### **ユニバーサルロール（MUST）**

| ロール名 | 説明 |
| --- | --- |
| role.admin.root | 他のすべてのロールを付与および取り消すことができる最高特権ロール |

#### **機能条件付きロール（該当する場合SHOULD）**

| ロール名 | 条件 |
| --- | --- |
| role.system.pause | コントラクトがポーズ可能な機能を実装している場合 |
| role.system.upgrade | コントラクトがアップグレード可能である場合 |
| role.system.proxy | コントラクトがプロキシコントラクトである場合 |
| role.token.mint | コントラクトがトークンミントを実装している場合 |
| role.token.burn | コントラクトがトークンバーンを実装している場合 |
| role.token.freeze | コントラクトがトークンフリーズを実装している場合 |
| role.bridge.relay | コントラクトがクロスチェーンリレーを実装している場合 |
| role.reserve.audit | コントラクトがリザーブ管理を実装している場合 |

**監査検証ルール**: 監査ツールは、コントラクトの機能とロール定義間の対応関係をチェック **SHOULD** します。例えば、コントラクトがアップグレード可能なパターン（例: UUPSまたはTransparent Proxy）を実装している場合、監査検証は、コントラクトが `role.system.upgrade` ロール定数を定義しており、そのロールが権限管理インターフェースで適切に設定されていることを確認 **SHOULD** します。Transparent Proxyの場合、`role.system.proxy` ロール定数の定義と設定も確認されるべきです。

### **オンチェーンクエリインターフェース**

レベル2は、レベル1（命名規則）の上に構築され、オンチェーンのロール名クエリおよびコアロール検証機能を提供します。外部監査ツール、ブロックエクスプローラー、およびセキュリティスキャナーは、標準化されたインターフェースを通じてコントラクトのロール定義情報をクエリできます。

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERCRoleNaming {
    /// @notice Reverse mapping from hash to name
    /// @dev Returns empty string for unregistered hashes; callers SHOULD check for non-empty return
    function roleHashToName(bytes32 roleHash) external view returns (string memory);

    /// @notice Name-to-hash computation (pure computation, no storage)
    function roleNameToHash(string calldata roleName) external pure returns (bytes32);

    /// @notice Whether the role belongs to the canonical core role set
    ///         (universal roles and functionality-conditional roles defined by this EIP)
    function isCanonicalRole(bytes32 roleHash) external view returns (bool);
}
```

`isCanonicalRole()` は、ロールがこの[[EIP|EIP（Ethereum 改善提案）]]で定義されたコアロールセットに属するかどうかのみを検証します。より広範な意味検証（カテゴリ-アクションレジストリ）は、コンパニオンのコントラクトロールセマンティクス標準インターフェースによって提供されます。

`roleHashToName()` は、未登録のハッシュに対して空の文字列 (`""`) を返さ **MUST** します。呼び出し元は、`isCanonicalRole()` を通じて、または空でない戻り値をチェックすることによって、ハッシュの有効性を検証 **SHOULD** します。

実装は、[[EIP|EIP（Ethereum 改善提案）]]-165の `supportsInterface()` を介して `IERCRoleNaming` インターフェースを宣言 **SHOULD** します。インターフェースIDは `0x8f97d349` です。

### **採用レベル**

この標準は段階的な採用をサポートしています。

| レベル | 範囲 | 要件 | 依存関係 | 採用コスト |
| --- | --- | --- | --- | --- |
| レベル1 | ロール命名標準定義 | REQUIRED | なし | ゼロ（コンパイル時定数） |
| レベル2 | オンチェーン命名クエリインターフェース | RECOMMENDED | レベル1 | 単一のインターフェースコントラクトデプロイ |
| レベル3 | オンチェーン意味導出インターフェース | OPTIONAL（コンパニオン[[EIP|EIP（Ethereum 改善提案）]]によって定義） | レベル2 | 追加の意味インターフェースコントラクト |

## **根拠**

### **階層的命名パターン**

`role.{category}.{action}` パターンは、フラットな命名 (`MINTER`, `ADMIN`) よりも3つの理由で選択されました。

1.  **意味の明確さ**: `role.token.mint` は、ドメイン（トークン操作）と権限（ミント）を同時に伝達します。

2.  **ハッシュの発見可能性**: 標準化された命名により、すべてのプロトコルで同じロール名が同じ `keccak256` ハッシュを生成します。未検証のコントラクトにおける `role.admin.root` ロールは、既知のハッシュテーブルを通じてブロックエクスプローラーやセキュリティスキャナーによって識別できます。これがこの標準のコアバリューです。もし名前空間プレフィックスが許可されていた場合（例: `role.aave.token.mint`）、同一名のロールのハッシュは異なるプレフィックスのために分岐し、`MINTER_ROLE` のようなカスタム定数と同じ不透明さに逆戻りし、標準化された命名のコアメリットが失われます。

3.  **ドメイン内拡張性**: 既存のカテゴリの下に新しいアクションを拡張でき（例: `role.token.newaction`）、既存の名前を変更することなく機能ドメインによって新しいカテゴリを追加できます。

### **条件付きSHOULD vs 絶対MUST**

絶対的なMUST要件は、アップグレード不可能なコントラクトに無関係なロールを宣言することを強制することになります。条件付きSHOULDは、コントラクトの異質性を受け入れつつ、監査の強制可能性を維持します。監査ツールは、コントラクトの機能とロール定義間の対応関係をチェックします。例えば、「コントラクトがアップグレード可能なパターンを実装している場合、アップグレードロールを定義すべきである」といった具合です。

### **ハッシュの発見可能性と2部構成の命名**

この標準は、主にハッシュの発見可能性のために、厳密な2部構成の命名 `role.{category}.{action}` を選択しています。

-   `keccak256("role.admin.root")` は決定論的なハッシュを生成します。この標準名を使用するコントラクトは、オープンソースであるかどうかにかかわらず、同じ `bytes32` 値を生成します。ブロックエクスプローラー、セキュリティスキャナー、および監査ツールは、「既知のロールハッシュテーブル」を維持し、オンチェーンストレージスロットからロールのセマンティクスを直接逆引きできます。

-   `role.aave.token.mint` のような3部構成の名前は `role.token.mint` とは異なるハッシュを生成し、第三者はハッシュだけではこれがトークンミントロールであると推測できません。標準化された命名のコアメリットは、名前空間によって希薄化されます。

プロトコルの区別には名前空間プレフィックスは必要ありません。異なるプロトコルのロールは、異なるコントラクトアドレスによって自然に分離されます。プロトコル間の比較は、コントラクトアドレスとロール名の組み合わせによって達成され、ロール名にプロトコル識別子を埋め込むことによってではありません。

### **段階的な採用**

採用レベルは段階的に設計されています。コントラクトは、一度に完全な実装を要求されることなく、自身のニーズに基づいて任意のレベルを選択できます。

-   **レベル1** (REQUIRED): コントラクトコードでBNF文法に準拠するロール定数名を使用するだけです。デプロイコストはゼロです。ロールハッシュはコンパイル時定数であり、オンチェーンストレージを追加しません。すべてのコントラクトは、このレベルに到達 **MUST** します。

-   **レベル2** (RECOMMENDED): `IERCRoleNaming` を実装する追加のコントラクトまたはライブラリをデプロイし、外部ツールがオンチェーン呼び出しを通じてロール名をクエリできるようにします。コストは単一のインターフェースコントラクトのデプロイです。

-   **レベル3** (OPTIONAL、コンパニオン[[EIP|EIP（Ethereum 改善提案）]]によって定義): レベル2の上に `IERCRoleSemantics` インターフェースを追加し、Tier導出とセマンティック検証を提供します。コストは追加のセマンティックインターフェースコントラクトです。

これは、[[EIP|EIP（Ethereum 改善提案）]]-5982のような既存のRBAC標準とは対照的です。これらの標準は、事前に完全なインターフェース実装を要求しますが、この標準では、コントラクトが命名規則のみを採用することから利益を得ることができ、必要に応じてオンチェーン機能を段階的にアップグレードできます。

### **命名と意味の責任の分離**

ロール命名標準は、「識別子優先」の設計姿勢を採用しています。名前は識別子（短く、ハッシュ可能で、ガス効率が良い）であり、ドキュメント（階層や認証ソースが名前文字列に埋め込まれていない）ではありません。これは、K8sの `cluster-admin` やDNSドメイン名などの業界慣行と一致しています。

> 命名における意味的ギャップは、コンパニオンのコントラクトロールセマンティクス標準によって対処されます。アクションの語彙分類（atomic/scope/grant）、Tier導出、Grantorセマンティクス、およびNatSpecの意味的注釈フィールド（`@custom:role-tier`など）が提供されます。

## **後方互換性**

### **EIP-5982との互換性**

この標準は[[EIP|EIP（Ethereum 改善提案）]]-5982と直交します。[[EIP|EIP（Ethereum 改善提案）]]-5982はRBACインターフェースメカニズムを定義し、この標準はロール識別子があるべき姿を定義します。[[EIP|EIP（Ethereum 改善提案）]]-5982を実装するコントラクトは、互換性を損なうことなくこの命名標準を採用 **MAY** できます。

### **EIP-7820との互換性**

この標準は[[EIP|EIP（Ethereum 改善提案）]]-7820と直交します。[[EIP|EIP（Ethereum 改善提案）]]-7820は集中型レジストリを通じてクロスコントラクトロールを管理し、この標準はそれらのロールが一貫した命名を持つことを保証します。

### **EIP-173との互換性**

`role.admin.root` ロールは、[[EIP|EIP（Ethereum 改善提案）]]-173の `owner()` の概念を包含します。コントラクトは両方のインターフェースを同時に実装 **MAY** できます。`role.admin.root` と `owner()` の権限主体が異なる場合、`role.admin.root` の認証操作（付与/取り消し）は最終的な権限として扱われる **SHALL** べきです。

### **OpenZeppelinからの移行**

| OpenZeppelin定数 | 標準名 | 移行フェーズ |
| --- | --- | --- |
| DEFAULT_ADMIN_ROLE | role.admin.root | フェーズ1 |
| MINTER_ROLE | role.token.mint | フェーズ1 |
| PAUSER_ROLE | role.system.pause | フェーズ1 |
| BURNER_ROLE | role.token.burn | フェーズ1 |
| UPGRADER_ROLE | role.system.upgrade | フェーズ2 |
| PROXY_ADMIN_ROLE | role.system.proxy | フェーズ2 |

移行戦略: 二重定数移行フェーズはストレージの完全性を維持します。

```
// Deprecated: Use ROLE_ADMIN_ROOT instead
bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
bytes32 public constant ROLE_ADMIN_ROOT = keccak256("role.admin.root");
```

**ロール管理者関係の移行**: OpenZeppelinの `AccessControl._setRoleAdmin()` によって確立された「ロール → 管理者ロール」の認証関係は、同期して移行される必要があります。移行後、`ROLE_ADMIN_ROOT` はすべての付与者ロールの `adminRole` として設定され、認証チェーンの一貫性を確保する必要があります。

## **セキュリティに関する考慮事項**

-   **ロール混同攻撃**: 標準化された命名により、プロトコル間の意味的曖昧さが解消されます。`role.admin.root` は一貫して最高権限を表します。

-   **ストレージスロット衝突**: `keccak256("eip.role.registry") - 1` は[[EIP|EIP（Ethereum 改善提案）]]-1967/[[EIP|EIP（Ethereum 改善提案）]]-7201パターンを使用しており、衝突の確率は無視できるほど小さいです。

-   **プロキシおよびファクトリーパターン**: プロキシコントラクト（Transparent Proxy / UUPS）および実装コントラクトは、それぞれの異なるアドレスで独立して分離されたロール名前空間を持ちます。プロキシコントラクトは `role.system.proxy` を使用してプロキシ自体を管理し、実装コントラクトはビジネスロジックに標準ロールを使用します。Diamondパターン（[[EIP|EIP（Ethereum 改善提案）]]-2535）は、すべてのファセットでこの標準の命名を統一して採用し、Diamondアドレスの `IERCRoleNaming` 実装が集約されたクエリを提供すべきです。コントラクトファクトリーによって作成された子コントラクトは、独自のロール名前空間を独立して所有し、ファクトリーロールを自動的に継承しません。

-   **アップグレードロールのハイジャック**: 条件付きSHOULDは、アップグレード可能なコントラクトが `role.system.upgrade` を定義することを奨励します。

-   **ACL統合の盲点**: 二重定数移行フェーズはストレージの完全性を維持し、移行期間中はレガシー定数と標準定数が共存します。

-   **誤った標準主張**: `isCanonicalRole()` 関数はコアロールのカバレッジを検証できます。誤った動作をするインターフェース実装は、適合性を構成しません。

-   **非対称な権限ペア**: `role.token.freeze`（条件付きSHOULD）は、`role.token.unfreeze`（コアロールではありませんが、この標準の命名規則に従う有効なドメイン固有の拡張です）よりも適用閾値が低いです。これは、フリーズが緊急の損失停止操作であり、トークンフリーズを実装するコントラクトがこのロールを定義することを強く推奨されるためです。同様に、`role.system.pause`（条件付きSHOULD）には対応するアンポーズロールはありません。これは、ポーズ権限のセキュリティへの影響がより直接的であるためです。

## **参照実装**

以下の実装はデモンストレーション目的のみであり、MITライセンスの下で提供されます。本番環境へのデプロイは、完全なセキュリティ監査を受ける必要があります。

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IERCRoleNaming {
    /// @notice Reverse mapping from hash to name
    /// @dev Returns empty string for unregistered hashes; callers SHOULD check for non-empty return
    function roleHashToName(bytes32 roleHash) external view returns (string memory);

    /// @notice Name-to-hash computation (pure computation, no storage)
    function roleNameToHash(string calldata roleName) external pure returns (bytes32);

    /// @notice Whether the role belongs to the canonical core role set
    ///         (universal roles and functionality-conditional roles defined by this EIP)
    function isCanonicalRole(bytes32 roleHash) external view returns (bool);
}

/**
 * @title RoleNamingStandard
 * @dev Reference implementation for EIP-XXXX Contract Role Naming Standard
 *      Demonstrates role naming constant definitions, hash derivation,
 *      and IERCRoleNaming interface implementation
 */
contract RoleNamingStandard is IERC165, IERCRoleNaming {

    // ─── Level 1: Role Constant Definitions ────────────────────────────

    bytes32 public constant ROLE_ADMIN_ROOT = keccak256("role.admin.root");
    bytes32 public constant ROLE_TOKEN_MINT = keccak256("role.token.mint");
    bytes32 public constant ROLE_TOKEN_BURN = keccak256("role.token.burn");
    bytes32 public constant ROLE_TOKEN_FREEZE = keccak256("role.token.freeze");
    bytes32 public constant ROLE_SYSTEM_PAUSE = keccak256("role.system.pause");
    bytes32 public constant ROLE_SYSTEM_UPGRADE = keccak256("role.system.upgrade");
    bytes32 public constant ROLE_SYSTEM_PROXY = keccak256("role.system.proxy");
    bytes32 public constant ROLE_BRIDGE_RELAY = keccak256("role.bridge.relay");
    bytes32 public constant ROLE_RESERVE_AUDIT = keccak256("role.reserve.audit");

    // ─── EIP-165 Interface Declaration ──────────────────────────────

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == type(IERC165).interfaceId
            || interfaceId == type(IERCRoleNaming).interfaceId;
    }

    // ─── Level 2: Name Registry ───────────────────────────────

    mapping(bytes32 => string) private _nameRegistry;
    mapping(bytes32 => bool) private _registered;

    constructor() {
        _register(ROLE_ADMIN_ROOT, "role.admin.root");
        _register(ROLE_TOKEN_MINT, "role.token.mint");
        _register(ROLE_TOKEN_BURN, "role.token.burn");
        _register(ROLE_TOKEN_FREEZE, "role.token.freeze");
        _register(ROLE_SYSTEM_PAUSE, "role.system.pause");
        _register(ROLE_SYSTEM_UPGRADE, "role.system.upgrade");
        _register(ROLE_SYSTEM_PROXY, "role.system.proxy");
        _register(ROLE_BRIDGE_RELAY, "role.bridge.relay");
        _register(ROLE_RESERVE_AUDIT, "role.reserve.audit");
    }

    function _register(bytes32 roleHash, string memory name) internal {
        _nameRegistry[roleHash] = name;
        _registered[roleHash] = true;
    }

    // ─── IERCRoleNaming Interface Implementation ─────────────────────────

    function roleHashToName(bytes32 roleHash)
        external view override returns (string memory)
    {
        if (!_registered[roleHash]) return "";
        return _nameRegistry[roleHash];
    }

    function roleNameToHash(string calldata roleName)
        external pure override returns (bytes32)
    {
        return keccak256(bytes(roleName));
    }

    function isCanonicalRole(bytes32 roleHash)
        external pure override returns (bool)
    {
        return roleHash == keccak256("role.admin.root")
            || roleHash == keccak256("role.system.pause")
            || roleHash == keccak256("role.system.upgrade")
            || roleHash == keccak256("role.system.proxy")
            || roleHash == keccak256("role.token.mint")
            || roleHash == keccak256("role.token.burn")
            || roleHash == keccak256("role.token.freeze")
            || roleHash == keccak256("role.bridge.relay")
            || roleHash == keccak256("role.reserve.audit");
    }
}
```

## **今後の作業**

この[[EIP|EIP（Ethereum 改善提案）]]は、最小限のコンセンサス基盤を確立するために、意図的にそのスコープをロール命名に限定しています。以下の機能は、コンパニオン標準として計画されています。

-   **コントラクトロールセマンティクス標準**: アクションの語彙分類（atomic/scope/grant）、Tier導出、Grantorセマンティクス、およびNatSpecの意味的注釈フィールド（`@custom:role-tier`など）を定義します。

-   **ロール列挙拡張**: コントラクトによって宣言されたすべてのロールをオンチェーンで発見するためのインターフェース（`IERCRoleNamingEnumerable`）を提供します。

-   **静的分析ツールチェーン**: BNF文法検証、ロールカバレッジレポート、条件付きSHOULDヒューリスティック検出。

これらの拡張は、ここで定義された命名基盤の上に構築され、そのコアセマンティクスを変更するものではありません。

## **著作権**

著作権および関連する権利はCC0を通じて放棄されます。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-xxxx-contract-role-naming-standard/28756)
