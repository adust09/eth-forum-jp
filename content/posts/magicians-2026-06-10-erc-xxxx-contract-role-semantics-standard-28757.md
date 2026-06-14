---
title: ERC-XXXX：コントラクトロールのセマンティクス標準
original_title: ERC-XXXX：Contract Role Semantics Standard
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-xxxx-contract-role-semantics-standard/28757
author: baishuo13
date: '2026-06-10'
category: ERCs
tags:
  - ercs
  - smart-contracts
  - security
  - protocol-design
  - eip
  - governance
  - account-abstraction
topic_id: '28757'
translated_at: '2026-06-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX：Contract Role Semantics Standard](https://ethereum-magicians.org/t/erc-xxxx-contract-role-semantics-standard/28757) — baishuo13 (2026-06-10)

## **概要**

スマートコントラクトにおいて、同一の命名形式を持つロール（役割）は、セキュリティ上の意味合いが大きく異なる場合があります。`role.token.mint`（ミントの実行）と `role.token.grant`（ミントを許可する者の管理）は同じ命名パターンを共有していますが、後者の権限は前者よりもはるかに大きく、これらを混同すると権限昇格につながる可能性があります。既存の標準では、ロール識別子のみからこのような違いを区別することはできません。

この標準は、ロール名からセキュリティセマンティクスを導出するためのルールを定義します。(1) 階層ティア導出（ツールがロールのリスクレベルを自動的にランク付けできるようにする）、(2) グラントール（付与者）承認パターン（承認関係をロール名から直接読み取れるようにする）、(3) カテゴリ-アクションレジストリ（ロールの組み合わせが既知の安全なパターンに属するかどうかを検証する）。NatSpecアノテーションはオフチェーンのセマンティック補完を提供し、`IERCRoleSemantics`インターフェースはオンチェーンでの導出機能を提供します。

> 注：この標準は、[[EIP|EIP]]-XXXX（コントラクトロール命名標準）で定義されている `role.{category}.{action}` 命名構文に依存します。

## **動機**

複雑なシナリオにおける特権ロールの命名はカスタム拡張をサポートしますが、ロール名にはシナリオのセマンティクスを完全に表現する上で固有の限界があります。さらに、スマートコントラクトの特権インシデントの根本原因は3つのカテゴリに分類でき、既存の標準ではいずれも適切に対処されていません。

1.  **階層の区別不能性**: `role.token.mint` は操作を実行するためのアトミックな許可であるのに対し、`role.token.grant` は承認を管理するための統治的な許可です。後者は前者を付与できるため、その権限ははるかに大きくなります。しかし、両者は同じ命名形式を共有しており、監査ツールはこれらを自動的に区別できません。OpenZeppelinの `DEFAULT_ADMIN_ROLE`（無制限の権限）と `MINTER_ROLE`（単一操作）は、その名前に階層情報を含んでおらず、プロトコル間の監査時にコントラクトごとのソースコードレビューを必要とします。

2.  **不透明な承認関係**: `role.token.mint` を誰が付与できるのでしょうか？OpenZeppelinの `AccessControl` では、この関係はコントラクトコード全体に散らばった `_setRoleAdmin()` を介して設定され、ロール名と管理者関係の間に明示的な関連付けはありません。`DEFAULT_ADMIN_ROLE` の管理者は `bytes32(0)` であり、セマンティクスが不透明です。プロトコル間の監査時には、承認関係をコントラクトごとに手動で追跡する必要があります。

3.  **職務分離の制約なし**: `role.governance.propose`（提案の開始）と `role.governance.execute`（提案の実行）の両方を同じアドレスに付与することは、権力集中リスクを構成します。既存の標準はロール間の相互排他制約を表現せず、このような制限は完全に人間の記憶に依存しています。

これら3つの問題に共通するのは、重要なセキュリティ情報がコントラクトの実装にエンコードされており、ロール識別子から直接導出できないことです。この標準は導出ルールを定義し、ロール名自体が階層、承認、および相互排他情報を持つようにすることで、監査ツールが命名から直接セキュリティセマンティクスを読み取れるようにします。

## **仕様**

このドキュメントにおけるキーワード「MUST」、「MUST NOT」、「REQUIRED」、「SHALL」、「SHALL NOT」、「SHOULD」、「SHOULD NOT」、「RECOMMENDED」、「NOT RECOMMENDED」、「MAY」、「OPTIONAL」は、RFC 2119 および RFC 8174 に記述されている通りに解釈されます。

### **依存関係**

この標準は、[[EIP|EIP]]-XXXX（コントラクトロール命名標準）で定義されている以下の概念に依存します。

-   ロール命名構文 `role.{category}.{action}`
-   ロールハッシュ導出 `keccak256(roleName)`
-   コアロールセット（条件付きSHOULD）
-   `IERCRoleNaming` インターフェース

この標準を実装するコントラクトは、まず[[EIP|EIP]]-XXXX レベル1の採用要件に準拠**しなければなりません (MUST)**。

### **導出ロジックチェーン**

この標準の仕様セクションは、導出チェーンに沿って構成されており、各ステップが動機付けの問題の1つに対処しています。

```
ロール名 ──ティア導出──→ リスクレベル（階層ランキング）
          ──グラントール──────────→ 承認元（誰がそれを制御するか）
          ──レジストリ─────────→ 組み合わせの安全性（既知のパターン検証）
          ──インターフェース/アノテーション→ ツール消費（オンチェーン + オフチェーン）
```

### **ロールティア導出ルール**

ロールの承認ティアは、ロール名のみから決定論的に導出**されなければなりません (MUST)**。テーブルルックアップやオンチェーン呼び出しは必要ありません。

| マッチ条件 | ティア | タイプ | セキュリティ上の意味合い |
| --- | --- | --- | --- |
| role.admin.root (唯一の例外) | Tier-0 | root | 最高の権限、グラントールなし、すべてのTier-1ロールを付与できる |
| role.{category}.grant | Tier-1 | grantor | 承認ガバナンス — 「誰が使用できるか」を決定し、同じカテゴリ内のすべてのアトミックロールを付与できる |
| role.{category}.{scope-type action} | Tier-2 | scope | スコープ付き権限、ドメイン内操作に対する管轄権を意味し、単一のアトミックよりも広範なスコープ |
| role.{category}.{atomic-type action} | Tier-2 | atomic | 操作実行、他のロールを付与できない |

```
function deriveTier(roleName) returns (tier, tierType):
    parts = split(roleName, ".")
    if roleName == "role.admin.root":   return (0, "root")
    if parts[-1] == "grant":            return (1, "grantor")
    if parts[-1] in SCOPE_ACTIONS:      return (2, "scope")
    return (2, "atomic")
```

> **注**: `SCOPE_ACTIONS` はスコープタイプとして分類されるアクション識別子のセットを示します。現在のカテゴリ-アクションレジストリにはTier-2スコープロールは含まれていません（`admin` カテゴリの `root` アクションはTier-0の唯一の例外です）。スコープタイプは将来の拡張のために予約されており、新しいスコープアクションはカテゴリ-アクションレジストリセクションで定義されているレジストリ拡張メカニズムを通じて追加**されなければなりません (MUST)**。

ティア値はロールの危険度を表します。ティアが低いほどリスクは大きくなります。Tier-2内では、スコープとアトミックは同じレベルですが、異なるセマンティクスを持ちます。スコープロールはドメイン内操作に対する管轄権を意味し（例：Tier-0の `role.admin.root` は唯一の例外）、アトミックロールは単一の操作のみを実行します。監査ツールは、ロールリストをティアでソートし、Tier-0/1ロールの保護状況を優先的にレビューできます。`getRoleTier()` インターフェース（`IERCRoleSemantics` で定義）は、この導出ルールをオンチェーンでクエリ可能な関数として公開します。

### **グラントール承認パターン**

`role.{category}.grant` は各カテゴリの承認ロールです。このロールの保持者は、そのカテゴリ内のアトミックロールを付与および取り消すことができます。これにより、ロール割り当て権限とロール使用権限が分離されます。グラントールは「**誰が使用できるか**」を決定し、アトミックロールは「**何をすべきか**」を処理します。

ロール名は承認ツリーを直接エンコードします。ロールを付与した者を導出するためにテーブルルックアップは必要ありません。

```
role.admin.root ── role.token.grant ── role.token.mint
                 │                  ├── role.token.burn
                 │                  ├── role.token.freeze
                 │                  └── role.token.unfreeze
                 └── role.system.grant ── role.system.pause
                                       ├── role.system.upgrade
                                       └── role.system.proxy
```

同じカテゴリのグラントロールは、そのカテゴリ内のすべてのアトミックロールおよびスコープロールを付与できます。カテゴリ-アクションレジストリの各行は、同時に2つのことを定義します。(1) 有効なアクションの組み合わせ、および (2) 対応するグラントールロール。

**2つの実装パス**:

1.  **明示的なグラントールロール** (推奨): `role.{category}.grant` 定数を定義し、OZ AccessControlで `_setRoleAdmin(atomicRole, grantorRole)` を設定します。セマンティクスが明確で、この標準に完全に準拠します。
2.  **暗黙的なグラントール** (既存のコントラクトと互換性あり): すべてのロールの管理者として `role.admin.root` を引き続き使用しますが、NatSpecの `@custom:role-grantor` アノテーションを通じて論理的なグラントール関係を宣言します。コントラクトコードの変更は不要で、セマンティック導出は有効なままです。静的解析ツールはアノテーションから承認セマンティクスを読み取ります。

グラントールパターンはセマンティックな慣例であり、コントラクトの変更を**必須 (MUST)**とする要件ではありません。

### **アクションの語彙分類**

ティア導出とグラントールパターンの前提条件は、アクションが異なるリスクレベルと承認上の意味合いを持つ3つのセマンティックロールを持つことです。

| クラス | セマンティクス | 例 | なぜ区別が必要か |
| --- | --- | --- | --- |
| atomic | 操作を実行する — 特定のタスクを実行する | mint, burn, withdraw, propose, execute, relay, freeze | 最小特権単位、Tier-2 |
| scope | 権限スコープを定義する — ドメイン内操作に対する管轄権を意味する | officer | スコープ付き権限、Tier-2だが単一のアトミックよりも広範な管轄権を持つ |
| grant | 承認操作 — あるクラスの許可を使用できる者を管理する | grant | 統治権限、Tier-1、同じカテゴリ内のアトミックロールとスコープロールを付与できる |

`role.token.mint` と `role.token.grant` は同じ命名形式を共有していますが、前者は操作権限であり、後者は承認権限であり、リスクレベルは桁違いに異なります。アクションタイプ分類がなければ、監査ツールは操作権限と承認権限を自動的に区別できません。

**アクションクラスごとの制約**:

-   atomic: 新しく定義されるロールは、このクラスを優先**すべきです (SHOULD)**。
-   scope: 暗黙的なアクションコンテキスト（例：`officer` は「コンプライアンスドメイン内のすべてを管理する」を意味する）と共に使用**されなければなりません (MUST)**。スコープタイプは将来の拡張のために予約されており、現在のレジストリにはTier-2スコープロールは存在しません。
-   grant: 承認ロールのためにのみ使用**されなければなりません (MUST)**。同じカテゴリ内のグラントロールとアトミックロールは、同じアドレスに付与**されてはなりません (MUST NOT)**（ロールが承認者と操作者の両方になることを防ぐため）。ランタイム分離ポリシーはセキュリティベースラインフレームワークによって定義されます。

### **カテゴリ-アクションレジストリ**

レジストリは、どのカテゴリ-アクションの組み合わせが既知の安全なパターンに属するかを定義します。レジストリにない組み合わせが必ずしも安全でないわけではありませんが、`isKnownRole()` が `false` を返す場合、監査ツールはそれらを手動レビューのためにフラグ付け**すべきです (SHOULD)**。

`role.finance.admin` は命名構文に準拠していますが、`admin` は finance カテゴリの既知のアクションではありません。これは、管理者ロールを装った引き出し権限である可能性があります。レジストリは、ツールがこのような異常を自動的に識別できるようにします。

レジストリの内容（[[EIP|EIP]]-XXXXコアロールセットと整合）：

| カテゴリ | アトミック | グラント | スコープ | 説明 |
| --- | --- | --- | --- | --- |
| admin | — | — | root (Tier-0例外) | root = 最高の権限、グラントールなし |
| token | mint, burn, freeze, unfreeze | grant | — | トークンドメイン：完全なライフサイクル（ミント/バーン/フリーズ/アンフリーズ） |
| system | pause, upgrade, proxy | grant | — | システム操作ドメイン：グローバル一時停止、コントラクトアップグレード、プロキシ管理。proxyはプロキシ管理操作（独立したカテゴリではない） |
| finance | withdraw | grant | — | 金融操作：資金引き出し権限 |
| governance | propose, execute | grant | — | proposeとexecuteは相互排他的 |
| bridge | relay | grant | — | クロスチェーンリレー |
| reserve | audit | grant | — | 準備金監査 |
| compliance | manage | grant | — | コンプライアンス/規制管理 |
| auth | authorize | grant | — | マルチシグ承認 |

**レジストリの制約**:

-   governance カテゴリの propose および execute アクションは、同じアドレスに付与**されてはなりません (MUST NOT)**。
-   レジストリにないカテゴリ-アクションペアの場合、`isKnownRole()` は `false` を返し、手動レビューのためにフラグ付け**すべきです (SHOULD)**。
-   レジストリは、コミュニティガバナンスプロセスを通じて拡張**されてもよい (MAY)**です。

### **オンチェーンセマンティクスインターフェース（レベル3定義）**

監査ツールとセキュリティスキャナーは、標準化されたインターフェースを通じてロール階層をクエリし、組み合わせの安全性を検証できます。`getRoleTier()` はロールハッシュを受け入れます。実装は、まず命名[[EIP|EIP]]の `roleHashToName()` を介してロール名を取得し、その後ティア導出を実行するか、内部レジストリ検索を使用できます。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
​
interface IERCRoleSemantics {
    /// @notice ロールの承認ティアとタイプタグを導出します
    /// @dev 未登録のハッシュに対しては (255, "unknown") を返します。
    ///      呼び出し元は、まず isKnownRole() を介して検証すべきです (SHOULD)。
    /// @return tier 0=root, 1=grantor, 2=atomic/scope, 255=unknown
    /// @return tierType "root" | "grantor" | "atomic" | "scope" | "unknown"
    function getRoleTier(bytes32 roleHash)
        external view returns (uint8 tier, string memory tierType);
​
    /// @notice ロールがレジストリ内の既知の安全な組み合わせに属するかどうか
    function isKnownRole(bytes32 roleHash) external view returns (bool);
}
```

`getRoleTier()` は、未登録のハッシュに対して `(255, "unknown")` を返**さなければなりません (MUST)**。呼び出し元は、まず `isKnownRole()` を介してロールを検証**すべきです (SHOULD)**。

`isKnownRole()` は、命名[[EIP|EIP]]の `isCanonicalRole()` を補完します。`isCanonicalRole()` は、ロールが命名[[EIP|EIP]]で定義されたコアロールセットに属するかどうかを検証するのに対し、`isKnownRole()` は、ロールのカテゴリ-アクションの組み合わせがこの標準で定義された既知の安全なパターンに属するかどうかを検証します。両方の標準を実装するコントラクトは、両方のインターフェースを実装**すべきです (SHOULD)**。

実装は、[[ERC|ERC]]-165の `supportsInterface()` を介して `IERCRoleSemantics` インターフェースを宣言**すべきです (SHOULD)**。インターフェースIDは `0x98892310` です。

### **NatSpecセマンティックアノテーション**

ロール名には階層と承認元がエンコードされていません。コントラクトは、静的解析ツールのオフチェーン検証のために、ロール定数宣言で標準化されたNatSpecアノテーションを使用することを**推奨します (RECOMMENDED)**。

```solidity
/// @custom:role-tier     2
/// @custom:role-type     atomic
/// @custom:role-grantor  role.token.grant
bytes32 public constant ROLE_TOKEN_MINT = keccak256("role.token.mint");
​
/// @custom:role-tier     1
/// @custom:role-type     grantor
/// @custom:role-grants   role.token.mint,role.token.burn,role.token.freeze,role.token.unfreeze
/// @custom:role-grantor  role.admin.root
bytes32 public constant ROLE_TOKEN_GRANT = keccak256("role.token.grant");
​
/// @custom:role-tier     0
/// @custom:role-type     root
bytes32 public constant ROLE_ADMIN_ROOT = keccak256("role.admin.root");
​
/// @custom:role-tier     2
/// @custom:role-type     atomic
/// @custom:role-grantor  role.system.grant
/// @custom:role-delay    172800
bytes32 public constant ROLE_SYSTEM_UPGRADE = keccak256("role.system.upgrade");
```

**アノテーションフィールドの仕様**:

| フィールド | タイプ | セマンティクス |
| --- | --- | --- |
| @custom:role-tier | 0/1/2 | 承認ティア、`getRoleTier()` の戻り値に対応 |
| @custom:role-type | root/grantor/atomic/scope | ロールタイプ：rootはグラントールなし、grantorは承認を管理、atomicは操作を管理、scopeはドメインを管理 |
| @custom:role-grantor | ロール文字列 | グラントール — このロールを付与した者（rootロールはこのフィールドを省略） |
| @custom:role-grants | コンマ区切りのロール文字列 | グラントールタイプのみ：付与可能なロールのリスト、`role-grantor` との双方向検証を形成 |
| @custom:role-delay | uint256 (秒) | タイムロック遅延 — このロールの付与/取り消しに予想される待機時間 |

**拡張メカニズム**: 実装は追加の `@custom:role-*` アノテーションフィールドを定義**してもよい (MAY)**です。新しいフィールドは `role-{dimension-name}` 命名プレフィックスに従い、プロジェクトドキュメントでそのセマンティクスを宣言**しなければなりません (MUST)**。将来の標準バージョンは、広く採用された拡張フィールドをコアセットに組み込む**こともあります (MAY)**。

静的解析ツールは、上記のアノテーションフィールドを解析し、アノテーションと実際のコントラクトデプロイメントおよびロール設定ロジックとの整合性を検証**すべきです (SHOULD)**。

### **採用レベル**

この標準は段階的な採用をサポートします。

| レベル | スコープ | 要件 | 依存関係 | 採用コスト |
| --- | --- | --- | --- | --- |
| レベル1 | ロール命名標準 | 必須 (REQUIRED) | なし | ゼロ（コンパイル時定数） |
| レベル2 | オンチェーン命名クエリインターフェース | 推奨 (RECOMMENDED) | レベル1 | 単一インターフェースコントラクトのデプロイ |
| レベル3 | オンチェーンセマンティック導出インターフェース | 任意 (OPTIONAL) (この標準で定義) | レベル2 | 追加のセマンティックインターフェースコントラクト |

## **理論的根拠**

### **ティア導出の根拠**

ロール特権インシデントの一般的なパターンは、高権限ロールの保護が不十分であることですが、「高権限」には既存の標準で統一された定義がありません。`DEFAULT_ADMIN_ROLE` と `MINTER_ROLE` は、その名前に階層の区別を含んでいません。この標準は、ティア導出ルールを通じて、命名から数値的に導出可能な値として危険度をエンコードします。Tier-0（グラントールなし）> Tier-1（権限を付与できる）> Tier-2（操作のみを実行できる）。監査ツールは、ティアでソートすることで、最もリスクの高いロールのレビューを優先できます。

### **グラントールパターンの根拠**

OpenZeppelin `AccessControl` の `_roleAdmin` パターンは、各ロールに管理者ロールを設定することを可能にしますが、ロール命名と管理者関係の間に明示的な関連付けはありません。この標準は、`role.{category}.grant` 命名パターンを通じて、承認関係を命名から導出可能にします。同じカテゴリのグラントロールは、そのカテゴリ内のアトミックロールの管理者として自然に機能します。これは、AWS `iam:PassRole` や K8s `rbac.authorization.k8s.io` のような承認管理の語彙と一致します。

### **NatSpecアノテーションの設計**

NatSpecアノテーションは、Solidityエコシステムの慣例に従って `@custom:` プレフィックスを使用します。フィールドの選択は、最小限の十分性の原則に従います。

-   `role-tier` と `role-type`: 階層情報をエンコードします。これは、命名では表現できない最も重要なセキュリティ側面です。
-   `role-grantor`: 承認元をエンコードします。これは「誰がこのロールを付与したか」という監査ニーズに対応します。
-   `role-grants`: グラントールタイプにのみ必要で、「このロールがどのロールを付与できるか」をエンコードし、`role-grantor` との双方向検証を形成します。

アノテーションはオフチェーンの慣例（推奨）として設計されており、オンチェーンのガス（Gas）コストを追加することなく、静的解析ツールに構造化されたセマンティック情報を提供します。

### **アクションタイプ命名: `grant` vs `meta`**

コントラクトロール命名標準の将来の作業セクションでは、アクションの語彙分類を `atomic/scope/meta` と参照しています。この標準では、承認アクションタイプとして `meta` を `grant` に置き換えます。これには3つの理由があります。(1) `grant` はOpenZeppelin `_setRoleAdmin()` のセマンティクスを直接エンコードします。グラントールは自身のカテゴリ内でロールを付与します。(2) `meta` は曖昧です。承認ガバナンスではなく、メタデータ操作を指す可能性があります。(3) `grant` は `role.{category}.grant` 命名パターンと一致し、アクション識別子からアクションタイプを直接導出可能にします。

## **後方互換性**

### **[[EIP|EIP]]-XXXX (コントラクトロール命名標準)**

この標準は[[EIP|EIP]]-XXXXの拡張であり、その仕様要件を一切変更しません。命名標準のみを実装するコントラクトは、この標準を認識することなく独立して動作できます。

### **[[EIP|EIP]]-5982**

この標準で定義されているセマンティック導出ルールは、[[EIP|EIP]]-5982のRBAC（ロールベースアクセス制御）インターフェースメカニズムとは直交します。`getRoleTier()` は、[[EIP|EIP]]-5982の `hasRole()` チェックを補完するロール階層情報を提供します。

### **OpenZeppelin移行**

OpenZeppelin `AccessControl` を使用し、この標準を実装するコントラクトは、`_roleAdmin` マッピングをグラントールセマンティクスと整合させる**べきです (SHOULD)**。

```solidity
// OpenZeppelin _setRoleAdmin をグラントールセマンティクスにマッピング
_setRoleAdmin(ROLE_TOKEN_MINT, ROLE_TOKEN_GRANT);  // role.token.grant が role.token.mint を管理
_setRoleAdmin(ROLE_TOKEN_BURN, ROLE_TOKEN_GRANT);  // role.token.grant が role.token.burn を管理
_setRoleAdmin(ROLE_TOKEN_GRANT, ROLE_ADMIN_ROOT);  // role.admin.root が role.token.grant を管理
```

## **セキュリティ上の考慮事項**

-   **ティア導出の誤用**: `getRoleTier()` が返すティア情報は、アクセス制御の唯一の根拠として使用**すべきではありません (SHOULD NOT)**。オンチェーンのアクセス制御は、`hasRole()` などの標準メカニズムを通じて引き続き強制**されなければなりません (MUST)**。
-   **導出とランタイム設定の不整合**: `getRoleTier()` は命名セマンティクスからティアを導出し、`_setRoleAdmin()` の実際のランタイム設定を反映しません。コントラクトが管理者関係を変更し、実際の承認パスがグラントールパターンから逸脱した場合（例：`role.token.mint` の管理者が `role.token.grant` ではなく `role.admin.root` に設定された場合）、ティア導出結果は変更されません。このような不整合はセキュリティ上の異常であり、静的解析ツールはこれを検出**すべきです (SHOULD)**。
-   **NatSpecアノテーションの偽造**: NatSpecアノテーションはオフチェーンの慣例であり、コンパイル後に検証することはできません。静的解析ツールは、アノテーションと実際のコントラクトデプロイメントおよびロール設定ロジックとの整合性を相互検証**すべきです (SHOULD)**。
-   **レジストリのカバレッジ不足**: レジストリにないカスタムのカテゴリ-アクションペアは `isKnownRole()` を `false` にしますが、名前は[[EIP|EIP]]-XXXX命名構文に準拠しています。これは意図的な設計です。レジストリは既知の安全な組み合わせのサブセットであり、有効な命名の完全なセットではありません。
-   **グラントール-アトミックの相互排他性**: 同じカテゴリ内のグラントロールとアトミックロールは、同じアドレスに付与**されてはなりません (MUST NOT)**。これにより、グラントールとオペレーターのアイデンティティ重複を防ぎます。相互排他制約はセキュリティベースラインフレームワークによって定義および強制されます。この標準はセマンティックな相互排他関係を宣言するだけです。
-   **レジストリ外の組み合わせリスク**: 命名構文に準拠するロール名が必ずしもレジストリに属するとは限りません。`isKnownRole()` が `false` を返しても、それが安全でないことを示すわけではなく、手動レビューが必要であることを示唆するだけです。

## **参照実装**

以下の実装はデモンストレーションのみを目的としており、MITライセンスの下で提供されます。本番環境へのデプロイメントは、完全なセキュリティ監査を受ける必要があります。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
​
interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
​
interface IERCRoleSemantics {
    /// @notice ロールの承認ティアとタイプタグを導出します
    /// @dev 未登録のハッシュに対しては (255, "unknown") を返します。
    ///      呼び出し元は、まず isKnownRole() を介して検証すべきです (SHOULD)。
    /// @return tier 0=root, 1=grantor, 2=atomic/scope, 255=unknown
    /// @return tierType "root" | "grantor" | "atomic" | "scope" | "unknown"
    function getRoleTier(bytes32 roleHash)
        external view returns (uint8 tier, string memory tierType);
​
    /// @notice ロールがレジストリ内の既知の安全な組み合わせに属するかどうか
    function isKnownRole(bytes32 roleHash) external view returns (bool);
}
​
/**
 * @title RoleSemanticsStandard
 * @dev EIP-XXXX コントラクトロールセマンティクス標準の参照実装
 *      ティア導出、セマンティック検証、
 *      および IERCRoleSemantics インターフェースの実装を示します
 */
contract RoleSemanticsStandard is IERC165, IERCRoleSemantics {
​
    // ─── ロール定数 (EIP-XXXX 命名標準から継承) ──────
​
    bytes32 public constant ROLE_ADMIN_ROOT = keccak256("role.admin.root");
    bytes32 public constant ROLE_TOKEN_GRANT = keccak256("role.token.grant");
    bytes32 public constant ROLE_TOKEN_MINT = keccak256("role.token.mint");
    bytes32 public constant ROLE_TOKEN_BURN = keccak256("role.token.burn");
    bytes32 public constant ROLE_TOKEN_FREEZE = keccak256("role.token.freeze");
    bytes32 public constant ROLE_TOKEN_UNFREEZE = keccak256("role.token.unfreeze");
    bytes32 public constant ROLE_SYSTEM_GRANT = keccak256("role.system.grant");
    bytes32 public constant ROLE_SYSTEM_PAUSE = keccak256("role.system.pause");
    bytes32 public constant ROLE_SYSTEM_UPGRADE = keccak256("role.system.upgrade");
    bytes32 public constant ROLE_SYSTEM_PROXY = keccak256("role.system.proxy");
    bytes32 public constant ROLE_FINANCE_GRANT = keccak256("role.finance.grant");
    bytes32 public constant ROLE_FINANCE_WITHDRAW = keccak256("role.finance.withdraw");
    bytes32 public constant ROLE_GOVERNANCE_GRANT = keccak256("role.governance.grant");
    bytes32 public constant ROLE_GOVERNANCE_PROPOSE = keccak256("role.governance.propose");
    bytes32 public constant ROLE_GOVERNANCE_EXECUTE = keccak256("role.governance.execute");
    bytes32 public constant ROLE_BRIDGE_GRANT = keccak256("role.bridge.grant");
    bytes32 public constant ROLE_BRIDGE_RELAY = keccak256("role.bridge.relay");
    bytes32 public constant ROLE_RESERVE_GRANT = keccak256("role.reserve.grant");
    bytes32 public constant ROLE_RESERVE_AUDIT = keccak256("role.reserve.audit");
    bytes32 public constant ROLE_COMPLIANCE_GRANT = keccak256("role.compliance.grant");
    bytes32 public constant ROLE_COMPLIANCE_MANAGE = keccak256("role.compliance.manage");
    bytes32 public constant ROLE_AUTH_GRANT = keccak256("role.auth.grant");
    bytes32 public constant ROLE_AUTH_AUTHORIZE = keccak256("role.auth.authorize");
​
    // ─── EIP-165 インターフェース宣言 ──────────────────────────────
​
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == type(IERC165).interfaceId
            || interfaceId == type(IERCRoleSemantics).interfaceId;
    }
​
    // ─── セマンティクスレジストリ ─────────────────────────────────────
​
    mapping(bytes32 => uint8) private _tierRegistry;
    mapping(bytes32 => string) private _tierTypeRegistry;
    mapping(bytes32 => bool) private _knownRoleRegistry;
​
    constructor() {
        _registerTier(ROLE_ADMIN_ROOT, 0, "root");
​
        _registerTier(ROLE_TOKEN_GRANT, 1, "grantor");
        _registerTier(ROLE_TOKEN_MINT, 2, "atomic");
        _registerTier(ROLE_TOKEN_BURN, 2, "atomic");
        _registerTier(ROLE_TOKEN_FREEZE, 2, "atomic");
        _registerTier(ROLE_TOKEN_UNFREEZE, 2, "atomic");
​
        _registerTier(ROLE_SYSTEM_GRANT, 1, "grantor");
        _registerTier(ROLE_SYSTEM_PAUSE, 2, "atomic");
        _registerTier(ROLE_SYSTEM_UPGRADE, 2, "atomic");
        _registerTier(ROLE_SYSTEM_PROXY, 2, "atomic");
​
        _registerTier(ROLE_FINANCE_GRANT, 1, "grantor");
        _registerTier(ROLE_FINANCE_WITHDRAW, 2, "atomic");
​
        _registerTier(ROLE_GOVERNANCE_GRANT, 1, "grantor");
        _registerTier(ROLE_GOVERNANCE_PROPOSE, 2, "atomic");
        _registerTier(ROLE_GOVERNANCE_EXECUTE, 2, "atomic");
​
        _registerTier(ROLE_BRIDGE_GRANT, 1, "grantor");
        _registerTier(ROLE_BRIDGE_RELAY, 2, "atomic");
​
        _registerTier(ROLE_RESERVE_GRANT, 1, "grantor");
        _registerTier(ROLE_RESERVE_AUDIT, 2, "atomic");
​
        _registerTier(ROLE_COMPLIANCE_GRANT, 1, "grantor");
        _registerTier(ROLE_COMPLIANCE_MANAGE, 2, "atomic");
​
        _registerTier(ROLE_AUTH_GRANT, 1, "grantor");
        _registerTier(ROLE_AUTH_AUTHORIZE, 2, "atomic");
    }
​
    function _registerTier(bytes32 role, uint8 tier, string memory tierType) internal {
        _tierRegistry[role] = tier;
        _tierTypeRegistry[role] = tierType;
        _knownRoleRegistry[role] = true;
    }
​
    // ─── IERCRoleSemantics インターフェース実装 ─────────────────────
​
    function getRoleTier(bytes32 roleHash)
        external view override returns (uint8 tier, string memory tierType)
    {
        if (!_knownRoleRegistry[roleHash]) {
            return (255, "unknown");
        }
        tier = _tierRegistry[roleHash];
        tierType = _tierTypeRegistry[roleHash];
    }
​
    function isKnownRole(bytes32 roleHash)
        external view override returns (bool)
    {
        return _knownRoleRegistry[roleHash];
    }
}
```

## **テストケース**

| ロール名 | 期待されるティア | 期待される `tierType` | 導出ロジック |
| --- | --- | --- | --- |
| role.admin.root | 0 | root | 唯一の例外マッチ |
| role.token.grant | 1 | grantor | `action`="grant" → Tier-1 |
| role.system.grant | 1 | grantor | `action`="grant" → Tier-1 |
| role.token.mint | 2 | atomic | `action`="mint" が `SCOPE_ACTIONS` にない → Tier-2 atomic |
| role.system.pause | 2 | atomic | `action`="pause" が `SCOPE_ACTIONS` にない → Tier-2 atomic |
| role.system.proxy | 2 | atomic | `action`="proxy" が `SCOPE_ACTIONS` にない → Tier-2 atomic |
| role.finance.withdraw | 2 | atomic | `action`="withdraw" → Tier-2 atomic |
| role.bridge.relay | 2 | atomic | `action`="relay" → Tier-2 atomic |
| Unknown hash | 255 | unknown | レジストリにない → unknown |

## **著作権**

著作権および関連する権利はCC0を通じて放棄されます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-xxxx-contract-role-semantics-standard/28757)
