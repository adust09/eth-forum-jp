---
title: ERC-XXXX 時間遅延アクセス制御
original_title: ERC-XXXX Time-Delayed Access Control
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-xxxx-time-delayed-access-control/28741'
author: dif
date: '2026-06-08'
category: ERCs
tags:
  - ercs
  - security
  - smart-contracts
  - eip
  - access-control
  - role-management
topic_id: '28741'
translated_at: '2026-06-15'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX Time-Delayed Access Control](https://ethereum-magicians.org/t/erc-xxxx-time-delayed-access-control/28741) — dif (2026-06-08)

この[[glossary/ERC|Ethereum Request for Comments (ERC)]]は、アクセス制御における時間遅延型ロール管理を提供します。ロールの付与と取り消しは、設定可能な遅延期間の後に有効になり、権限昇格 (privilege escalation) に対する防御ウィンドウを提供します。

## 概要

この[[glossary/ERC|Ethereum Request for Comments (ERC)]]は、スマートコントラクトのアクセス制御システムにおける時間遅延型ロール管理のための最小限のインターフェースを導入します。「遅延ロールアクティベーション」とは、ロールの変更（付与または取り消し）が、所定のアクティベーション時刻に有効になる前に、設定可能な遅延期間の間、保留状態に入ることを指します。

この提案は3つの機能モジュールを定義します。ロールごとの付与および取り消し遅延パラメータを設定するための遅延設定モジュール、現在のブロックタイムスタンプと保存されたアクティベーションおよび取り消しタイムスタンプを比較してアカウントがロールを保持しているかどうかを判断する有効ロール評価モジュール、そして現在の遅延設定を取得するための遅延クエリモジュールです。これらのモジュールが連携することで、権限評価の時点で保留中のロール変更が自動的にアクティベーションされ、プロトコルオペレーターは、不正な特権ロール変更が有効になる前にそれを検出し、キャンセルするための対応ウィンドウを得ることができます。

## 動機

不適切なアクセス制御のリスクは、イーサリアムにおいて最も壊滅的な攻撃ベクトルの1つとなっています。攻撃者が、鍵の侵害、運用上のエラー、内部脅威、ソーシャルエンジニアリングなどによって、特権アカウントへの不正アクセスを得た場合、彼らはすぐに任意の特権ロールを自分自身に付与し、悪意のあるアクションを実行し、正当な保持者を取り消して防御的な対応を阻止することができます。これらすべてが単一のトランザクション内で発生する可能性があり、防御者には対応時間が一切残りません。

既存の部分的な解決策は、異なる抽象化レベルで時間遅延に対処していますが、ロール権限レイヤーは保護されていません。欠けているセキュリティレイヤーは、ロール保持者が何ができるかだけでなく、「誰が」ロールを保持できるかを遅延させることです。この提案は、ロール変更の開始から自動アクティベーションまでの間に設定可能な待機期間を導入することで、そのレイヤーを提供し、防御者が不正な変更が有効になる前にそれを検出し、検証し、キャンセルする時間を与えます。

## 仕様

このドキュメントにおけるキーワード「MUST」、「MUST NOT」、「REQUIRED」、「SHALL」、「SHALL NOT」、「SHOULD」、「SHOULD NOT」、「RECOMMENDED」、「NOT RECOMMENDED」、「MAY」、「OPTIONAL」は、[RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) および [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) に記述されている通りに解釈されます。

この[[glossary/ERC|Ethereum Request for Comments (ERC)]]に準拠するすべてのコントラクトは、`ITimeDelayedAccessControl` インターフェースを実装しなければなりません (MUST)。コントラクトは、インターフェース検出をサポートするために [[glossary/ERC|ERC]]-165 も実装すべきです (SHOULD)。

### コアインターフェース

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

/// @title Time-Delayed Access Control Interface
/// @notice Interface for role-based access control with time-delayed grant and revocation.
/// @dev Implementations MUST implement ERC-165 interface detection.
///      Role grants and revocations are subject to configurable delays: a grant takes effect
///      only after the grant delay has elapsed, and a revocation takes effect only after the
///      revoke delay has elapsed. This provides a safety window for stakeholders to react
///      to privilege changes.
interface ITimeDelayedAccessControl {

    // ── Events ──

    /// @notice Emitted when delay parameters for a role are changed.
    /// @param role The role identifier.
    /// @param previousGrantDelay The previous grant delay in seconds.
    /// @param previousRevokeDelay The previous revoke delay in seconds.
    /// @param newGrantDelay The new grant delay in seconds.
    /// @param newRevokeDelay The new revoke delay in seconds.
    event RoleDelayChanged(
        bytes32 indexed role,
        uint256 previousGrantDelay,
        uint256 previousRevokeDelay,
        uint256 newGrantDelay,
        uint256 newRevokeDelay
    );

    /// @notice Emitted when a role grant is scheduled.
    /// @param role The role identifier.
    /// @param account The address of the account affected by the change.
    /// @param effectTime The timestamp when the change automatically takes effect.
    /// @param scheduler The address that initiated the schedule.
    event RoleGrantScheduled(
        bytes32 indexed role,
        address indexed account,
        uint256 effectTime,
        address scheduler
    );

    /// @notice Emitted when a scheduled role change is cancelled before taking effect.
    /// @param role The role identifier.
    /// @param account The address of the account affected by the cancelled change.
    /// @param canceller The address that cancelled the change.
    event RoleGrantCancelled(
        bytes32 indexed role,
        address indexed account,
        address canceller
    );

    /// @notice Emitted when a role revoke is scheduled.
    /// @param role The role identifier.
    /// @param account The address of the account affected by the change.
    /// @param effectTime The timestamp when the change automatically takes effect.
    /// @param scheduler The address that initiated the schedule.
    event RoleRevokeScheduled(
        bytes32 indexed role,
        address indexed account,
        uint256 effectTime,
        address scheduler
    );


    /// @notice Emitted when a scheduled role revocation is cancelled before taking effect.
    /// @param role The role identifier.
    /// @param account The address of the account affected by the cancelled revocation.
    /// @param canceller The address that cancelled the revocation.
    event RoleRevokeCancelled(
        bytes32 indexed role,
        address indexed account,
        address canceller
    );

    // ── Configuration ──

    /// @notice Sets the delay parameters for a role.
    /// @dev MUST require the caller to hold the admin role for the given role.
    ///      MUST revert when `role == getRoleAdmin(role)` (self-admin role) to prevent
    ///      delay bypass by compromised key holders.
    /// @param role The role whose delay is being modified.
    /// @param grantDelay New grant delay in seconds. MUST be greater than 0.
    /// @param revokeDelay New revoke delay in seconds. MUST be greater than 0.
    function setRoleDelay(bytes32 role, uint256 grantDelay, uint256 revokeDelay) external;

    // ── Queries ──

    /// @notice Returns the effective delay configuration for a role.
    /// @param role The role identifier to query.
    /// @return grantDelay The grant delay in seconds. Returns 0 if the role has not been configured.
    /// @return revokeDelay The revoke delay in seconds. Returns 0 if the role has not been configured.
    function getRoleDelay(bytes32 role) external view returns (uint256 grantDelay, uint256 revokeDelay);

    /// @notice Returns the effective role state for an account, considering
    /// pending delayed changes that have auto-activated.
    /// @dev This is the canonical way to check whether an account holds a role
    ///      in a delayed activation system.
    /// @param role The role identifier to check.
    /// @param account The address of the account to check.
    /// @return Whether the account effectively holds the role.
    function hasEffectiveRole(bytes32 role, address account) external view returns (bool);
}
```

### 動作要件

#### 遅延設定

1.  `setRoleDelay` 関数は、アクセス制御チェックを通じて、特権ロール（例：ターゲットロールの管理者）を保持するアカウントにアクセスを制限しなければなりません (MUST)。
    
2.  ロールは自身の遅延を設定してはなりません (MUST NOT)。`setRoleDelay` 関数は、時間遅延メカニズムのバイパスを防ぐため、そのような自己管理ロールに対してリバートしなければなりません (MUST)。自己管理ロールの遅延パラメータは、コントラクト構築時に内部関数（例：`_setRoleDelay`）を介してのみ設定できます。
    
3.  `grantDelay` と `revokeDelay` パラメータは独立しています。ロールは、付与操作と取り消し操作で異なる遅延値を持つことができます (MAY)。
    
4.  遅延値 `0` は、明示的に設定されていないロールの未初期化状態として予約されています。有効な遅延値は `0` より大きくなければなりません (MUST)。
    
5.  ロールの付与または取り消しに適用される遅延は、その管理者ロールの遅延設定によって決定されます。これにより、ロールの付与/取り消しの遅延がその管理者の遅延設定によって制御されるという自然な階層構造が作成されます。
    

#### ロール状態遷移

1.  保留中の変更が存在する場合、またはアカウントがすでにロールを保持している場合、システムはロールを付与すべきではありません (SHOULD NOT)。付与された場合、ロールは `activationTime = block.timestamp + config.grantDelay` で有効にならなければなりません (MUST)。
    
2.  保留中の変更が存在する場合、またはアカウントが現在ロールを保持していない場合、システムはロールを取り消すべきではありません (SHOULD NOT)。取り消された場合、ロールは `revokingTime = block.timestamp + config.revokeDelay` で有効にならなければなりません (MUST)。
    
3.  実装は、同じ `(role, account)` ペアに対して保留中の変更が存在する間に、新しい変更をスケジュールすることを防がなければなりません (MUST)。これにより、競合するスケジュールされた変更が防止され、クリーンな状態遷移が保証されます。
    
4.  キャンセルは、スケジュールされた時刻より前に許可されなければなりません (MUST)。変更が有効になった後は、キャンセルメカニズムを通じてキャンセルすることはできません。
    
5.  スケジュールされた時刻が経過し、変更がキャンセルされなかった場合、すべての状態クエリは変更が有効であると反映しなければなりません (MUST)。
    

#### 有効ロールクエリ

1.  `hasEffectiveRole` 関数は、保存されたアクティベーションおよび取り消しタイムスタンプを `block.timestamp` と比較することにより、有効なロール状態を返さなければなりません (MUST)。

2.  `hasEffectiveRole` 関数は、時間遅延システムにおけるロール状態の正規のクエリです。保護されたコントラクト内のすべての権限チェックは、基盤となる[[glossary/RBAC|RBAC（ロールベースアクセス制御）]]を直接クエリするのではなく、`hasEffectiveRole` を使用すべきです (SHOULD)。

#### イベント発行

1.  `setRoleDelay` が呼び出された場合、`RoleDelayChanged` イベントが発行されなければなりません (MUST)。
    
2.  ロールの付与がスケジュールされた場合、`RoleGrantScheduled` イベントが発行されなければなりません (MUST)。
    
3.  ロールの取り消しがスケジュールされた場合、`RoleRevokeScheduled` イベントが発行されなければなりません (MUST)。
    
4.  スケジュールされた付与がキャンセルされた場合、`RoleGrantCancelled` イベントが発行されなければなりません (MUST)。
    
5.  スケジュールされた取り消しがキャンセルされた場合、`RoleRevokeCancelled` イベントが発行されなければなりません (MUST)。
    

## 根拠

### [[glossary/ERC|ERC]]-8083（時間制約付きアクセス制御）との関係

この提案と[[glossary/ERC|ERC]]-8083は、アクセス制御の異なる時間次元に対処する補完的な標準です。各標準は独立して使用することも、組み合わせて完全な双方向時間ベースのアクセス制御を実現することもできます。

| 次元 | [[glossary/ERC|ERC]]-8083 | この[[glossary/ERC|ERC]] |
| --- | --- | --- |
| 制御対象 | ロールの有効期限（ロールがいつ無効になるか） | ロール変更のアクティベーション（保留中の変更がいつ有効になるか） |
| 方向 | 将来志向：期限を設定 | 過去志向：アクティベーション前の遅延を設定 |
| 正規クエリ | `hasActiveRole(role, account)` | `hasEffectiveRole(role, account)` |
| 対処する脅威 | 期限切れ後に取り消されない古い/孤立したロール | 侵害された鍵による権限昇格 |
| 時間パラメータ | `expiryTimestamp`（絶対期限） | `activationTimestamp`（計算値：`block.timestamp + delay`） |

両方の標準は、単一の設定関数、単一の正規クエリ、および可視性のためのイベント発行という同じミニマリスト設計哲学に従っています。

独立して使用する場合、この[[glossary/ERC|ERC]]は設定可能なアクティベーション遅延を通じて権限昇格に対する防御を提供します。[[glossary/ERC|ERC]]-8083と組み合わせる場合、コントラクトは `hasEffectiveRole` を使用して保留中の変更がアクティベーションされたかどうかを判断し、`hasActiveRole` を使用してロールがまだ期限切れになっていないかどうかを判断します。

### 自動アクティベーション設計

この提案は、スケジュールされたアクティベーションタイムスタンプを `block.timestamp` と比較することで、クエリ時に有効な状態が計算される自動アクティベーションパターンを使用します。実行ステップは必要ありません。

-   **決定論的な有効時間**: `activationTime = schedulingTimestamp + delay`。曖昧さはありません。
-   **実行競合状態なし**: 誰もフロントランニング (front-run) できる実行ステップは存在しません。
-   **第2ステップなし**: スケジュール後、唯一可能なアクションはキャンセル（`activationTime` より前）です。`activationTime` 後は、変更はすでに有効です。
-   **クエリベースの状態**: `hasEffectiveRole` は、スケジュールされた変更を `block.timestamp` と比較することで有効な状態を計算します。正確なアクティベーションの瞬間にストレージの更新は必要ありません。

代替の2ステップパターン（スケジュール + 実行）も検討されましたが、採用されませんでした。自動アクティベーションパターンは、ユースケースにとってよりシンプルで十分です。

### 管理者中心の遅延ルックアップ

ロールの付与/取り消しの遅延は、ターゲットロールの `_roleDelays` 設定ではなく、管理者ロールの設定からルックアップされます。この設計は、自然な階層構造を作成します。

-   管理者ロールの遅延設定は、その下位ロールをどれだけ迅速に付与/取り消しできるかを制御します。
-   管理者ロール自体の変更は、その管理者ロールの遅延設定によって管理されます。
-   自己管理ロールの場合、遅延は自己参照的ですが、制限されます。

このアプローチはセキュリティモデルを簡素化します。ロール階層を保護するには、すべての下位ロールを個別にではなく、管理者ロールにのみ遅延を設定する必要があります。

### 自己管理遅延の制限

この制限は、自己管理ロール（`DEFAULT_ADMIN_ROLE` など）が、公開 `setRoleDelay` 関数を通じて自身の遅延パラメータを変更することを防ぎます。これは以下の理由から不可欠です。

-   この制限がない場合、侵害された管理者キーは `setRoleDelay(DEFAULT_ADMIN_ROLE, ...)` を呼び出して遅延を許容される最小値に短縮し、その後、防御ウィンドウが大幅に短縮された状態で攻撃者のアドレスにロールを付与する可能性があります。
-   この制限がある場合、自己管理ロールの遅延パラメータは構築後に不変となり、防御ウィンドウが排除されることはありません。
-   自己管理ロールの遅延パラメータは、内部 `_setRoleDelay` 関数を介してコントラクト構築時に設定され、この制限をバイパスします。

### 付与と取り消しの遅延の分離

付与操作と取り消し操作は、異なるリスクプロファイルを持っています。`DEFAULT_ADMIN_ROLE` の付与は高リスクであり、長い遅延が必要です。侵害されたアカウントからの取り消しは防御的であり、より短い遅延が正当化される場合があります。個別の遅延は、「即時取り消し、その後付与を待つ」という攻撃ベクトルも閉じます。独立した取り消し遅延がない場合、攻撃者は防御者の管理者ロールを即座に取り消し、その後、自身の悪意のある付与の遅延を待つことができます。

### ロールごとのオプトイン設計

遅延アクティベーションは、すべてのロールに必須ではなく、ロールごとに設定可能です。すべてのロールが遅延の恩恵を受けるわけではありません。`PAUSER_ROLE` は緊急対応のために即時アクティベーションが必要な場合があり、初期化専用ロールはデプロイ後に遅延を必要としません。ロールごとのオプトインにより、プロトコルはセキュリティ価値を追加する場所に遅延を適用できます。

## 後方互換性

この提案は、既存の[[glossary/RBAC|RBAC（ロールベースアクセス制御）]]実装と競合しないオプトイン拡張として設計されています。

-   **[[glossary/RBAC|RBAC]]互換性**: `hasEffectiveRole` 関数は、ロール状態をクエリする正規の方法を提供します。
-   **[[glossary/ERC|ERC]]-8083互換性**: この提案は[[glossary/ERC|ERC]]-8083と完全に互換性があります。コントラクトは両方の標準を独立して、または組み合わせて実装することができます。`hasEffectiveRole` と `hasActiveRole` は、直交する時間次元に対処する独立したクエリです。
-   **[[glossary/ERC|ERC]]-165互換性**: 実装は、`ITimeDelayedAccessControl` と `IAccessControl` の両方で[[glossary/ERC|ERC]]-165インターフェース検出をサポートします。
-   **ストレージレイアウトの競合なし**: この提案は、基盤となるストレージレイアウトを変更することなく、既存の `AccessControl` ストレージと並行して新しいストレージマッピング（例：`_roleDelays`、`_roleActivationTimestamp`、`_roleRevokingTimestamp`）を使用できます。

## 参照実装

### 実装

この実装は、OpenZeppelinの `AccessControl` コントラクトに基づいています。開発者はこの[[glossary/ERC|Ethereum Request for Comments (ERC)]]を独立して実装することもできます。

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import { AccessControl } from "./AccessControl.sol";
import { ITimeDelayedAccessControl } from "./ITimeDelayedAccessControl.sol";

/// @title TimeDelayedAccessControl
/// @notice Implementation of {ITimeDelayedAccessControl} with time-delayed role grant and revocation.
/// @dev Extends {AccessControl} so that role grants and revocations are subject to configurable
///      delays. A granted role does not become effective until its grant delay elapses, and a
///      revoked role remains effective until its revoke delay elapses. This provides a safety
///      window for stakeholders to react to privilege changes.
contract TimeDelayedAccessControl is ITimeDelayedAccessControl, AccessControl {

    /// @dev Stores the grant and revoke delay configuration for a role.
    /// @param grantDelay The delay in seconds before a grant takes effect.
    /// @param revokeDelay The delay in seconds before a revocation takes effect.
    struct DelayConfig {
        uint256 grantDelay;
        uint256 revokeDelay;
    }

    /// @dev Represents a pending update to a role's delay configuration.
    /// @param newGrantDelay The new grant delay that will take effect.
    /// @param newRevokeDelay The new revoke delay that will take effect.
    /// @param activationTime The timestamp when the delay update takes effect.
    /// @param exists Whether a pending delay update exists.
    struct PendingDelayUpdate {
        uint256 newGrantDelay;
        uint256 newRevokeDelay;
        uint256 activationTime;
        bool exists;
    }

    /// @dev Maps role identifiers to their delay configuration.
    mapping(bytes32 => DelayConfig) private _roleDelays;

    /// @dev Maps role identifiers and accounts to the timestamp when the grant becomes effective.
    mapping(bytes32 => mapping(address => uint256)) internal _roleActivationTimestamp;

    /// @dev Maps role identifiers and accounts to the timestamp when the revocation takes effect.
    ///      If this value is in the future, the account still effectively holds the role
    ///      despite having been revoked in the underlying {AccessControl}.
    mapping(bytes32 => mapping(address => uint256)) internal _roleRevokingTimestamp;

    /// @dev Sets the grant and revoke delay configuration for a role.
    ///      Emits a {RoleDelayChanged} event.
    /// @param role The role identifier whose delay is being modified.
    /// @param grantDelay The new grant delay in seconds.
    /// @param revokeDelay The new revoke delay in seconds.
    function _setRoleDelay(bytes32 role, uint256 grantDelay, uint256 revokeDelay) internal virtual {
        DelayConfig memory current = _roleDelays[role];
        uint256 oldGrantDelay = current.grantDelay;
        uint256 oldRevokeDelay = current.revokeDelay;

        _roleDelays[role] = DelayConfig(grantDelay, revokeDelay);

        emit RoleDelayChanged(
            role,
            oldGrantDelay,
            oldRevokeDelay,
            grantDelay,
            revokeDelay
        );
    }

    /// @dev Reverts when attempting to set the delay for a role whose admin role is itself.
    ///      This prevents a compromised key holder from clearing delays to bypass the time-delay mechanism.
    error CannotSetSelfAdminDelay();

    /// @dev Reverts when attempting to set a delay value of 0, which is reserved as the uninitialized state.
    error InvalidDelay();

    /// @inheritdoc ITimeDelayedAccessControl
    function setRoleDelay(bytes32 role, uint256 grantDelay, uint256 revokeDelay)
        external override virtual onlyRole(getRoleAdmin(role))
    {
        // Disallow setting delay for a role whose admin is itself, preventing a compromised
        // key holder from clearing delays to bypass the time-delay mechanism.
        if (role == getRoleAdmin(role)) revert CannotSetSelfAdminDelay();

        // Disallow zero delay values, as 0 is reserved for the uninitialized mapping default.
        if (grantDelay == 0 || revokeDelay == 0) revert InvalidDelay();

        _setRoleDelay(role, grantDelay, revokeDelay);
    }

    /// @inheritdoc ITimeDelayedAccessControl
    function getRoleDelay(bytes32 role)
        external view override virtual returns (uint256 grantDelay, uint256 revokeDelay)
    {
        DelayConfig memory config = _roleDelays[role];
        return (config.grantDelay, config.revokeDelay);
    }

    /// @inheritdoc ITimeDelayedAccessControl
    /// @dev A role is considered effectively held when either:
    ///      1. The account has been granted the role AND the grant delay has elapsed, OR
    ///      2. The account has been revoked the role BUT the revoke delay has NOT yet elapsed
    ///      (the account retains privileges during the revocation grace period).
    function hasEffectiveRole(bytes32 role, address account)
        public view virtual returns (bool)
    {
        uint256 activationTime = _roleActivationTimestamp[role][account];
        bool roleActived = activationTime != 0 && activationTime <= block.timestamp;

        uint256 revokingTime = _roleRevokingTimestamp[role][account];
        bool roleRevoked = revokingTime != 0 && revokingTime <= block.timestamp;

        return roleActived && !roleRevoked;
    }

    /// @dev Returns `true` if this contract implements the interface defined by `interfaceId`.
    ///      Overrides {AccessControl.hasRole} to use {hasEffectiveRole} as the canonical role check.
    ///      In this implementation, `hasRole` is equivalent to `hasEffectiveRole`.
    function hasRole(bytes32 role, address account) public view override virtual returns (bool) {
        return hasEffectiveRole(role, account);
    }

    /// @dev Returns `true` if there is a pending (not yet effective) role change for the account.
    ///      A pending change exists when the activation or revoking timestamp is in the future.
    /// @param role The role identifier.
    /// @param account The address of the account to check.
    /// @return Whether a pending role change exists.
    function _existsPendingRoleChange(bytes32 role, address account) internal view virtual returns (bool) {
        return (block.timestamp < _roleActivationTimestamp[role][account]) ||
            (block.timestamp < _roleRevokingTimestamp[role][account]);
    }

    /// @dev Overrides {AccessControl._grantRole} to apply delayed activation.
    ///      If no pending change exists and the account does not already hold the role effectively,
    ///      schedules a grant with the configured delay. Clears any previous revocation timestamp.
    ///      Emits a {RoleGrantScheduled} event.
    /// @param role The role identifier.
    /// @param account The address of the account to grant the role to.
    /// @return Whether the grant was scheduled.
    function _grantRole(bytes32 role, address account) internal override virtual returns(bool) {
        if (!_existsPendingRoleChange(role, account) && !hasEffectiveRole(role, account)) {
            bytes32 adminRole = getRoleAdmin(role);
            DelayConfig memory config = _roleDelays[adminRole];

            // Clear any previous revocation so the new grant can take effect
            _roleRevokingTimestamp[role][account] = 0;

            uint256 activationTime = block.timestamp + config.grantDelay;
            _roleActivationTimestamp[role][account] = activationTime;

            emit RoleGrantScheduled(role, account, activationTime, msg.sender);
            return true;
        } else {
            return false;
        }
    }

    /// @dev Overrides {AccessControl._revokeRole} to apply delayed revocation.
    ///      If no pending change exists and the account currently holds the role effectively,
    ///      schedules a revocation with the configured delay.
    ///      Emits a {RoleRevokeScheduled} event.
    /// @param role The role identifier.
    /// @param account The address of the account to revoke the role from.
    /// @return Whether the revocation was scheduled.
    function _revokeRole(bytes32 role, address account) internal override virtual returns(bool) {
        if (!_existsPendingRoleChange(role, account)  && hasEffectiveRole(role, account)) {
            bytes32 adminRole = getRoleAdmin(role);
            DelayConfig memory config = _roleDelays[adminRole];

            uint256 revokingTime = block.timestamp + config.revokeDelay;
            _roleRevokingTimestamp[role][account] = revokingTime;

            emit RoleRevokeScheduled(role, account, revokingTime, msg.sender);
            return true;
        } else {
            return false;
        }
    }

    /// @dev Reverts when attempting to cancel a role change that is not in a pending state.
    error NoPendingRoleGrant();

    /// @dev Reverts when attempting to cancel a role revocation that is not in a pending state.
    error NoPendingRoleRevoke();

    /// @notice Cancels a pending scheduled role grant before it takes effect.
    /// @dev Resets the activation timestamp to 0 to prevent the grant from ever becoming effective.
    ///      Only accounts with the role's admin role can cancel scheduled grants.
    ///      Emits a {RoleGrantCancelled} event.
    /// @param role The role identifier.
    /// @param account The address of the account whose scheduled grant is being cancelled.
    function cancelScheduledRoleGrant(
        bytes32 role,
        address account
    ) external virtual onlyRole(getRoleAdmin(role)) {
        // Must have a pending grant (activation timestamp in the future)
        if (_roleActivationTimestamp[role][account] <= block.timestamp) revert NoPendingRoleGrant();

        _roleActivationTimestamp[role][account] = 0;

        emit RoleGrantCancelled(role, account, msg.sender);
    }

    /// @notice Cancels a pending scheduled role revocation before it takes effect.
    /// @dev Resets the revoking timestamp to 0 to restore the account's role.
    ///      Only accounts with the role's admin role can cancel scheduled revocations.
    ///      Emits a {RoleRevokeCancelled} event.
    /// @param role The role identifier.
    /// @param account The address of the account whose scheduled revocation is being cancelled.
    function cancelScheduledRoleRevoke(
        bytes32 role,
        address account
    ) external virtual onlyRole(getRoleAdmin(role)) {
        // Must have a pending revoke (revoking timestamp in the future)
        if (_roleRevokingTimestamp[role][account] <= block.timestamp) revert NoPendingRoleRevoke();

        _roleRevokingTimestamp[role][account] = 0;

        emit RoleRevokeCancelled(role, account, msg.sender);
    }

    /// @dev Returns true if this contract implements the interface defined by `interfaceId`.
    ///      Supports {ITimeDelayedAccessControl} and inherited interfaces.
    function supportsInterface(bytes4 interfaceId) public view override virtual returns (bool) {
        return interfaceId == this.supportsInterface.selector ||
            interfaceId == type(ITimeDelayedAccessControl).interfaceId || super.supportsInterface(interfaceId);
    }
}
```

## セキュリティに関する考慮事項

### 管理者ロールの侵害

遅延ロールの管理者ロールのすべての保持者が侵害された場合、遅延による防御は限定的です。攻撃者は保留中の防御的な変更をキャンセルし、新しい変更をスケジュールすることができます。プロトコルは、管理者ロールを複数の独立したアカウントに分散させ、セキュリティ上重要なロールに対する管理者操作にマルチシグ (multi-sig) 要件を検討することを推奨します。

### 永続的なルートロール

ルートまたはデフォルトの管理者ロールは、遅延 `grantRole` フローではなく、構築時に永続的なアクティベーションタイムスタンプを割り当てることを推奨します。これにより、ルート管理者はデプロイ時に即座に有効になり、その後の付与に対しても遅延保護の恩恵を受けられます。

### キャンセルのフロントランニング

攻撃者が[[glossary/mempool|メムプール (mempool)]]で正当な `cancelScheduledRoleRevoke` トランザクションを観測した場合、キャンセルが有効になる前に悪意のあるアクションでフロントランニング (front-running) する可能性があります。これは公開[[glossary/mempool|メムプール (mempool)]]の既知の制限です。実装は、高価値のロール変更に対してコミット・リビールパターンまたはプライベートトランザクションリレーを推奨すべきです。

### タイムスタンプの変動性と安全マージン

イーサリアムのブロックタイムスタンプはバリデータによって決定され、現実世界の時間と異なる場合があります。悪意のある、または偶発的な操作により、ロールの早期アクティベーションや取り消しの意図しない遅延が発生する可能性があります。高価値の権限や時間機密性の高いロールを管理するコントラクトは、タイムスタンプの変動を軽減するために安全マージンを組み込むことを推奨します。短期間の遅延の場合、潜在的なネットワーク混雑や遅延を考慮して、より大きなマージンが推奨されます。

### L2タイムスタンプ操作

[[glossary/Rollup|オプティミスティック・ロールアップ (Optimistic Rollups)]]では、シーケンサーが既知の範囲内（主要な[[glossary/Layer-2|L2（レイヤー2）]]ネットワークでは約1時間）で `block.timestamp` に影響を与えることができます。[[glossary/Layer-2|L2]]にデプロイされる実装は、遅延を最大タイムスタンプ偏差の少なくとも2倍に設定することを推奨します。1時間のドリフトウィンドウを持つ[[glossary/Layer-2|L2]]の場合、実用的な最小遅延は少なくとも2時間です。

### 保留中の変更状態遷移

保留中の変更ガードは、競合するスケジュールされた変更を防ぎますが、状態依存性を作成します。保留中の変更がキャンセルされるか完了するまで、新しい変更はスケジュールできません。実装はこの動作を明確に文書化すべきです。特に：

-   保留中の付与は、同じ `(role, account)` ペアに対するその後の付与と取り消しの両方をブロックします。
-   保留中の取り消しは、同じ `(role, account)` ペアに対するその後の取り消しと付与の両方をブロックします。
-   保留中の変更を元に戻すには、管理者はまずそれをキャンセルし、その後反対の変更をスケジュールする必要があります。

### 基盤となる[[glossary/RBAC|RBAC]]の非同期化

既存の `AccessControl` 実装から継承する場合、一貫性を確保し、厳格なコード監査が必要です。実装は、`hasRole`/`hasEffectiveRole` が権威あるクエリであることを明確に文書化することを推奨します。

## 著作権

著作権および関連する権利は、[CC0](https://creativecommons.org/publicdomain/zero/1.0/) を通じて放棄されています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-xxxx-time-delayed-access-control/28741)
