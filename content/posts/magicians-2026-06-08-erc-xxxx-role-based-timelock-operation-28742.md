---
title: ERC-XXXX ロールベースのタイムロック操作
original_title: ERC-XXXX Role-Based Timelock Operation
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-xxxx-role-based-timelock-operation/28742'
author: dif
date: '2026-06-08'
category: ERCs
tags:
  - ercs
  - security
  - smart-contracts
  - access-control
  - protocol-design
  - eip
  - timelock
  - rbac
topic_id: '28742'
translated_at: '2026-06-15'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX Role-Based Timelock Operation](https://ethereum-magicians.org/t/erc-xxxx-role-based-timelock-operation/28742) — dif (2026-06-08)

この[[glossary/ERC|ERC (Ethereum Request for Comments)]]は、スマートコントラクトのアクセス制御システムにおけるロールレベルの実行遅延を導入します。

## 概要

この提案は、スマートコントラクトにおける特権ロール操作に時間遅延を強制するための標準インターフェースを定義します。ロールを持つアカウントが機密性の高い関数を呼び出す際、その呼び出しはまず監視とアラートのためにオンチェーンイベントを発行します。この操作は、ロールごとの遅延が経過した後にのみ利用可能になります。この遅延ウィンドウは、特権キーが侵害された場合に防御側が介入する機会を提供します。

## 動機

アクセス制御は、イーサリアムスマートコントラクトにおける基本的かつ永続的なセキュリティ上の懸念事項です。[[glossary/Role-based-access-control|ロールベースアクセス制御 (RBAC)]]システムは、特権アカウントに、コントラクトの一時停止、実装のアップグレード、設定の変更といった機密性の高い操作を実行する能力を付与します。攻撃者が特権ロールキーを侵害した場合、介入ウィンドウなしに壊滅的な操作を即座に実行できます。この即時実行モデルでは、プロトコルは侵害を検出したり、対応を調整したり、損害を防いだりする時間がありません。いずれの場合も、侵害されたキーは即座で不可逆的な損害を可能にします。従来の機関セキュリティモデルでは、この種のリスクに対処するために、高特権操作に対して時間遅延承認を要求しますが、ロールレベルでそのような遅延を強制するための標準化されたオンチェーンメカニズムは存在しません。

この提案は、スマートコントラクトのアクセス制御にロールごとの実行遅延を導入する、構成可能なインターフェース標準を提供します。機密性の高い操作を実行前にスケジュールすることを要求することで、このインターフェースはオンチェーン監査証跡と強制的な遅延ウィンドウを作成します。このウィンドウ中に、監視システムは異常なスケジュールイベントを検出し、防御側は疑わしい操作をキャンセルまたは凍結し、プロトコルは損害が発生する前に対応できます。

## 仕様

このドキュメントにおけるキーワード「**しなければならない (MUST)**」、「**してはならない (MUST NOT)**」、「**要求される (REQUIRED)**」、「**するものとする (SHALL)**」、「**しないものとする (SHALL NOT)**」、「**すべきである (SHOULD)**」、「**すべきではない (SHOULD NOT)**」、「**推奨される (RECOMMENDED)**」、「**推奨されない (NOT RECOMMENDED)**」、「**してもよい (MAY)**」、「**任意である (OPTIONAL)**」は、RFC 2119およびRFC 8174に記述されている通りに解釈されます。

この[[glossary/EIP|EIP（Ethereum 改善提案）]]に準拠するすべてのコントラクトは、`IRoleBasedTimelock`インターフェースを実装**しなければならない (MUST)**。コントラクトは、インターフェース検出をサポートするためにERC-165も実装**すべきである (SHOULD)**。

```
/// @title IRoleBasedTimelock
/// @notice Core interface for role-based timelock enforcement.
/// @dev Implementations MUST implement ERC-165 interface detection.
/// @dev The opHash is computed as keccak256(abi.encode(role, caller, target, selector, paramsHash)).
interface IRoleBasedTimelock {

    /// @notice Emitted when a role's timelock delay is changed.
    event RoleTimelockDelayChanged(
        bytes32 indexed role,
        uint256 oldDelay,
        uint256 newDelay
    );

    /// @notice Emitted when an operation is scheduled.
    /// @dev Off-chain monitoring systems SHOULD watch this event for anomaly detection.
    event OperationScheduled(
        bytes32 indexed role,
        bytes32 indexed opHash,
        address initiator,
        address target,
        uint256 executionTime
    );

    /// @notice Emitted when a scheduled operation is cancelled.
    event OperationCancelled(
        bytes32 indexed role,
        bytes32 indexed opHash,
        address canceller
    );

    /// @notice Emitted when a scheduled operation is executed/consumed.
    event OperationExecuted(
        bytes32 indexed role,
        bytes32 indexed opHash,
        address executor
    );

    /// @notice Sets the timelock delay for a given role.
    /// @dev MUST emit RoleTimelockDelayChanged event.
    /// @dev MUST require caller has appropriate authorization (e.g., the admin role of the specified role).
    /// @param role The role identifier.
    /// @param delay The new delay in seconds.
    function setRoleTimelockDelay(bytes32 role, uint256 delay) external;

    /// @notice Returns the timelock delay in seconds for a given role.
    /// @dev A delay of 0 means operations for this role execute immediately without scheduling.
    /// @param role The role identifier (bytes32).
    /// @return delay The timelock delay in seconds.
    function getRoleTimelockDelay(bytes32 role) external view returns (uint256 delay);

    /// @notice Schedules a timelocked operation for a given role.
    /// @dev MUST emit OperationScheduled event.
    /// @dev If the role delay is 0, the operation MAY execute immediately without scheduling.
    /// @dev Scheduling an operation with the same opHash as a pending (non-executed, non-cancelled)
    ///      operation MUST overwrite the previous schedule, resetting the executionTime timestamp.
    /// @dev Scheduling an operation does NOT execute it. Execution occurs when the role-bearing
    ///      account subsequently calls the target function (Integrated Pattern) or calls
    ///      executeOperation (Controller Pattern), after the delay has elapsed.
    /// @param role The role identifier.
    /// @param selector The function selector (bytes4).
    /// @param target The target contract address. For Integrated Pattern implementations, this parameter is ignored and address(this) is used.
    /// @param paramsHash The keccak256 hash of the ABI-encoded function parameters.
    /// @return opHash The computed operation hash.
    function scheduleOperation(
        bytes32 role,
        bytes4 selector,
        address target,
        bytes32 paramsHash
    ) external returns (bytes32 opHash);

    /// @notice Cancels a scheduled operation.
    /// @dev MUST emit OperationCancelled event.
    /// @dev Cancellation is NOT subject to timelock delay (immediate effect).
    /// @dev Only the original initiator or an authorized canceller (typically the role admin) MAY cancel an operation.
    /// @param opHash The operation hash to cancel.
    function cancelOperation(bytes32 opHash) external;

    /// @notice Returns the status of a specific operation identified by its opHash.
    /// @param opHash The operation hash.
    /// @return executionTime Timestamp when the operation becomes consumable.
    /// @return executed True if the operation has been executed.
    /// @return cancelled True if the operation has been cancelled.
    function getOperationStatus(bytes32 opHash) external view returns (
        uint256 executionTime,
        bool executed,
        bool cancelled
    );
}
```

### コア定義

**ロール**: ロールベースアクセス制御システムで使用される、ロール識別子として機能する`bytes32`値。

**ロールタイムロック遅延**: 操作がスケジュールされてから、特定のロールに対して操作が利用/実行可能になるまでの強制的な待機期間を表す、秒単位の`uint256`値。遅延が0の場合、そのロールの操作はスケジュールを必要とせずに即座に実行されることを意味します。

**paramsHash**: `keccak256(abi.encode(...parameters...))`として計算される`bytes32`値。パラメータのエンコーディングは関数のABIエンコーディング規則に従います。これは`keccak256(calldata[4:])`と同等です。`paramsHash`は、スケジュールされた操作の特定のパラメータを識別します。

**opHash**: スケジュールされた操作を一意に識別する`bytes32`値。`opHash`は次のように計算**しなければならない (MUST)**。

```
opHash = keccak256(abi.encode(role, caller, target, selector, paramsHash))
```

ここで:

-   `role`は`bytes32`のロール識別子
-   `caller`は操作をスケジュールするアカウントのアドレス（スケジュール時の`msg.sender`）
-   `target`は操作が実行されるコントラクトのアドレス
-   `selector`は`bytes4`の関数セレクター
-   `paramsHash`はABIエンコードされたパラメータの`bytes32`ハッシュ

**スケジュールされた操作**: `scheduleOperation`を介してキューに入れられ、`executionTime`タイムスタンプが`block.timestamp + roleTimelockDelay`に設定された操作。スケジュールされた操作は、実行済み（ターゲット関数呼び出しまたは`executeOperation`を介して消費された）またはキャンセル済み（`cancelOperation`を介して）の終端状態に達するまで保留状態のままである。保留中の操作を再スケジュールすると、以前のスケジュールが上書きされ、遅延がリセットされるが、操作が終端状態に移行することはない。

**保留中の操作フィールド**: 保留中の操作には、以下のプロパティがあります。

-   `role`: 操作に関連付けられた`bytes32`のロール識別子
-   `initiator`: 操作をスケジュールしたアカウントのアドレス
-   `executionTime`: 操作が利用可能になる`uint256`タイムスタンプ
-   `executed`: 操作が消費されたかどうかを示す`bool`
-   `cancelled`: 操作がキャンセルされたかどうかを示す`bool`

### 並行スケジュール

複数の操作が同時にスケジュールされる場合、それぞれが一意の`opHash`によって識別されます。`opHash`は`(role, caller, target, selector, paramsHash)`から導出されるため、異なるパラメータを持つ操作は異なるハッシュを生成し、独立してスケジュール可能で利用可能です。

**再スケジュール**: `scheduleOperation`が、保留中の操作と同じ`opHash`を生成するパラメータで呼び出された場合、実装は以前のスケジュールを上書き**しなければならない (MUST)**。`executionTime`タイムスタンプは`block.timestamp + delay`にリセットされ、`OperationScheduled`イベントが再度発行されます。これにより、パラメータの修正や遅延ウィンドウのリセットが可能になります。

### キャンセルモデル

キャンセルモデルは、2つのセキュリティ層を提供します。

**レイヤー1 — イニシエーターによるキャンセル**:

-   操作をスケジュールしたアカウントは、自身の保留中の操作をキャンセル**してもよい (MAY)**。
-   キャンセルは即座に有効になります（タイムロックは適用されません）。

**レイヤー2 — ロール管理者によるキャンセル (任意)**:

-   実装は、特権ロールの保持者（例：そのロールの管理者ロール）が、そのロールの保留中の操作をキャンセルすることを許可**してもよい (MAY)**。
-   キャンセルは即座に有効になります（タイムロックは適用されません）。
-   この層は、既存のアクセス制御階層を活用する安全弁を提供します。

## 理論的根拠

### 設計上の決定事項

**なぜコントラクトごとの遅延ではなく、ロールごとの遅延なのか？**

既存のタイムロックメカニズム（OpenZeppelin TimelockController、Compound Governor）は、特定のコントラクト呼び出しに遅延を付与し、特権を保持するために別のタイムロックコントラクトを必要とします。ロールごとの遅延は、よりきめ細かいセキュリティを提供します。MINTERロールは24時間しか必要としないかもしれませんが、UPGRADERロールは48時間を必要とするかもしれません。各ロールの遅延は、他のロールに影響を与えることなく個別に設定できます。

**なぜコアメカニズムは「アラートのためのスケジュール、その後呼び出し時に消費」（単なるスケジュール実行ではない）なのか？**

タイムロックの根本的なセキュリティ価値は、意図と実行の間の遅延ウィンドウです。`OperationScheduled`イベントはオンチェーンのアラームベルとして機能します。監視システムは異常なスケジュールを検出し、防御側にアラートを出すことができます。しかし、操作は依然として明示的に消費される必要があり、これにより実装は消費時に以下のことを検証できます。(a) 操作がキャンセルまたは凍結されていないこと、(b) 遅延が経過したこと、(c) 呼び出し元が承認されていること。この2段階設計—アラート、その後消費—は、遅延ウィンドウがバイパスされないこと、および防御側が介入能力を保持することを保証します。

**なぜロール管理者を使用した2層キャンセルなのか？**

レイヤー1（イニシエーター）は、ユーザーが誤ったパラメータを入力した場合に、自身の操作をキャンセルすることを可能にします。レイヤー2（ロールベース）は、既存のアクセス制御システムを活用することで安全弁を提供します。例えば、ロールの管理者は、そのロールの保留中の操作をすべてキャンセルできます。このアプローチは、専用のキャンセルロールとその関連する攻撃対象領域を導入することを避けます。

**なぜopHashに呼び出し元アドレスが含まれるのか？**

`opHash`に呼び出し元を含めることで、同じ操作をスケジュールする異なるアカウントが異なるハッシュを生成することを保証します。これにより、あるアカウントが別のアカウントのスケジュールされた操作を消費するのを防ぎ、スケジュールされた各アクションに対する説明責任を保証します。

**なぜopHashにターゲットアドレスが含まれるのか？**

`opHash`にターゲットを含めることで、単一のコントローラーが複数のターゲットコントラクトのタイムロックを管理するマルチコントラクトアーキテクチャにおいて、一意性を保証します。[[glossary/Integrated-Pattern|統合パターン (Integrated Pattern)]]では、ターゲットは常に`address(this)`であるため、単一のコントラクト内ではハッシュに影響しませんが、これを含めることで両方のパターン間でのハッシュの一貫性を維持し、[[glossary/Controller-Pattern|コントローラーパターン (Controller Pattern)]]デプロイにおけるハッシュ衝突を防ぎます。

## 後方互換性

この提案はオプトインインターフェースです。このインターフェースを実装しない既存のコントラクトは影響を受けません。このインターフェースを実装するコントラクトは、基盤となるアクセス制御システム（例：OpenZeppelin AccessControl、ERC-173）との互換性を維持**しなければならない (MUST)**。

**移行パス**:

1.  **[[glossary/Integrated-Pattern|統合パターン (Integrated Pattern)]]**: 既存のコントラクトを`IRoleBasedTimelock`で拡張し、機密性の高い関数に`onlyTimelockedRole`修飾子を追加します。既存の関数シグネチャは保持され、ワークフローに事前の`scheduleOperation`呼び出しが追加されるだけです。
2.  **[[glossary/Controller-Pattern|コントローラーパターン (Controller Pattern)]]**: 既存のコントラクトと並行して`IRoleBasedTimelockExecute`を実装する新しいコントラクトをデプロイします。既存のコントラクトは、その特権ロールをコントローラーコントラクトに付与します。

**破壊的変更**:
非実装コントラクトにはありません。実装コントラクトは、既存のアクセス制御セマンティクスが保持されることを保証**しなければならない (MUST)**。このインターフェースは遅延レイヤーを追加するが、基盤となるパーミッション付与を変更するものではありません。

## 参照実装

[[glossary/Integrated-Pattern|統合パターン (Integrated Pattern)]]は、単一コントラクトのデプロイにおいて最もシンプルな開発者体験を提供します。タイムロックは実際の関数に対する修飾子によって強制され、関数呼び出し自体がスケジュールを消費します。このパターンはガスオーバーヘッドが低く、元の関数シグネチャを実行エントリポイントとして保持します。

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IRoleBasedTimelock} from "./IRoleBasedTimelock.sol";

/// @title RoleBasedTimelock
/// @notice Reference implementation of IRoleBasedTimelock using Integrated Pattern.
/// @dev In the Integrated Pattern, timelock checks are embedded directly into the target contract
///      via the `onlyTimelockedRole` modifier. Operations are scheduled, then the protected
///      function is called after the delay elapses, consuming the scheduled operation.
contract RoleBasedTimelock is AccessControl, IRoleBasedTimelock {

    /// @notice スケジュールされたタイムロック操作のライフサイクル状態を追跡します。
    /// @param role 操作に関連付けられたロール識別子。
    /// @param initiator 操作をスケジュールしたアドレス。
    /// @param executionTime 操作が実行可能になるタイムスタンプ。
    /// @param executed 操作が実行（消費）されたかどうか。
    /// @param cancelled 操作がキャンセルされたかどうか。
    struct OperationStatus {
        bytes32 role;
        address initiator;
        uint256 executionTime;
        bool executed;
        bool cancelled;
    }

    /// @dev タイムロックされた操作が実行時間前に呼び出された場合、
    ///      または一致するスケジュールされた操作が存在しない場合にリバートします。
    error OperationNotReady(bytes32 opHash);

    /// @dev 凍結によりタイムロックされた操作が実行できない場合にリバートします。
    ///      凍結機能を実装する拡張機能で利用可能です。
    error OperationFrozen(bytes32 opHash);

    /// @dev グローバル凍結がアクティブで操作の実行を妨げる場合にリバートします。
    ///      凍結機能を実装する拡張機能で利用可能です。
    error GlobalFreezeActive();

    /// @dev ロール識別子をそのタイムロック遅延（秒単位）にマッピングします。
    mapping(bytes32 => uint256) private _roleTimelockDelays;

    /// @dev 操作ハッシュをそのライフサイクル状態にマッピングします。
    mapping(bytes32 => OperationStatus) private _operations;

    /// @inheritdoc IRoleBasedTimelock
    function setRoleTimelockDelay(bytes32 role, uint256 delay) public virtual onlyRole(getRoleAdmin(role)) {
        _setRoleTimelockDelay(role, delay);
    }

    /// @dev ロールのタイムロック遅延を設定する内部関数。
    ///      初期化中にonlyRoleチェックをバイパスするためにコンストラクタで使用できます。
    function _setRoleTimelockDelay(bytes32 role, uint256 delay) internal virtual {
        uint256 oldDelay = _roleTimelockDelays[role];
        _roleTimelockDelays[role] = delay;
        emit RoleTimelockDelayChanged(role, oldDelay, delay);
    }

    /// @inheritdoc IRoleBasedTimelock
    function getRoleTimelockDelay(bytes32 role) public view virtual returns (uint256) {
        return _roleTimelockDelays[role];
    }

    /// @inheritdoc IRoleBasedTimelock
    /// @dev 統合パターンでは、タイムロックがターゲットコントラクト自体（つまり`address(this)`が常に使用される）に
    ///      埋め込まれているため、`target`パラメータは無視されます。
    function scheduleOperation(
        bytes32 role,
        bytes4 selector,
        address /* target */,
        bytes32 paramsHash
    ) external onlyRole(role) returns (bytes32 opHash) {
        opHash = keccak256(abi.encode(role, msg.sender, address(this), selector, paramsHash));
        uint256 delay = _roleTimelockDelays[role];
        uint256 executionTime = block.timestamp + delay;

        _operations[opHash] = OperationStatus({
            role: role,
            initiator: msg.sender,
            executionTime: executionTime,
            executed: false,
            cancelled: false
        });

        emit OperationScheduled(role, opHash, msg.sender, address(this), executionTime);
    }

    /// @inheritdoc IRoleBasedTimelock
    /// @dev 操作の元のイニシエーター、またはロールの管理者ロールを持つアカウントのみが、
    ///      スケジュールされた操作をキャンセルできます。キャンセルは即座に有効になります。
    function cancelOperation(bytes32 opHash) external {
        OperationStatus storage status = _operations[opHash];
        require(!status.executed, "Already executed");
        require(!status.cancelled, "Already cancelled");
        require(
            msg.sender == status.initiator || hasRole(getRoleAdmin(status.role), msg.sender),
            "Not authorized to cancel"
        );

        status.cancelled = true;
        emit OperationCancelled(status.role, opHash, msg.sender);
    }

    /// @inheritdoc IRoleBasedTimelock
    function getOperationStatus(bytes32 opHash) external view returns (
        uint256 executionTime,
        bool executed,
        bool cancelled
    ) {
        OperationStatus storage status = _operations[opHash];
        return (status.executionTime, status.executed, status.cancelled);
    }

    /// @notice 現在の呼び出しコンテキストの操作ハッシュを計算します。
    /// @dev ロール、呼び出し元、コントラクトアドレス、関数セレクター、
    ///      およびABIエンコードされたパラメータのkeccak256ハッシュからopHashを導出します。
    function _getOpHash(bytes32 role) internal view returns (bytes32) {
        bytes4 selector = msg.sig;
        bytes32 paramsHash = keccak256(msg.data[4:]);
        return keccak256(abi.encode(role, msg.sender, address(this), selector, paramsHash));
    }

    /// @notice タイムロックされた操作がスケジュールされ、その遅延が経過したことを検証します。
    /// @dev ロールにゼロ以外の遅延があり、以下のいずれかの場合に{OperationNotReady}でリバートします。
    ///      - 一致する操作がスケジュールされていない（executionTime == 0）、
    ///      - 操作がすでに実行またはキャンセルされている、または
    ///      - 現在のタイムスタンプが操作の実行時間前である。
    ///      ロールの遅延が0の場合、この関数は何も行いません（タイムロックは強制されません）。
    function _checkRoleTimelock(bytes32 role) internal view virtual {
        uint256 delay = _roleTimelockDelays[role];
        if (delay > 0) {
            bytes32 opHash = _getOpHash(role);
            OperationStatus storage op = _operations[opHash];
            if (op.executionTime == 0 || op.executed || op.cancelled) revert OperationNotReady(opHash);
            if (block.timestamp < op.executionTime) revert OperationNotReady(opHash);
        }
    }

    /// @notice 保護された関数が完了した後、タイムロックされた操作を実行済みとしてマークします。
    /// @dev {OperationExecuted}イベントを発行します。スケジュールされた操作を消費し、
    ///      再実行を防ぐために、保護された関数本体の後に呼び出す必要があります。
    function _operationExecutedHook(bytes32 role) internal virtual {
        bytes32 opHash = _getOpHash(role);
        OperationStatus storage op = _operations[opHash];
        op.executed = true;
        emit OperationExecuted(role, opHash, msg.sender);
    }

    /// @notice 関数呼び出しの前後にタイムロック遅延を強制し、実行をマークする修飾子。
    /// @dev 関数本体の前に{_checkRoleTimelock}を介してタイムロックをチェックし、
    ///      関数本体の後に{_operationExecutedHook}を介して操作を実行済みとしてマークします。
    ///      ロールベースのタイムロックによって保護されるべき関数にこの修飾子を使用してください。
    modifier onlyTimelockedRole(bytes32 role) {
        _checkRoleTimelock(role);
        _;
        _operationExecutedHook(role);
    }

    // 例: タイムロックで保護された関数
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    function mint(address to, uint256 amount)
        external
        onlyRole(MINTER_ROLE)
        onlyTimelockedRole(MINTER_ROLE)
    {
        // Mint logic here
    }

    /// @dev このコントラクトが`interfaceId`で定義されたインターフェースを実装している場合にtrueを返します。
    ///      {IRoleBasedTimelock}および{AccessControl}インターフェースをサポートします。
    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl) returns (bool) {
        return
            interfaceId == this.supportsInterface.selector ||
            interfaceId == type(IRoleBasedTimelock).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
```

## セキュリティ上の考慮事項

### 攻撃ベクトル

**1. 侵害された特権ロールキー**

攻撃者が特権ロールキー（例：MINTER_ROLE）を取得した場合、悪意のある操作をスケジュールできます。遅延ウィンドウは、防御側に以下の時間を提供します。

-   `OperationScheduled`イベントを介して侵害を検出する。
-   操作をキャンセルする（特権ロールを保持している場合、またはイニシエーターとして）。
-   操作を凍結する（オプションの緊急凍結拡張機能が実装されている場合）。

遅延ウィンドウは中核的なセキュリティ機能です。

**2. キューのフラッディング**

タイムロックされたロールを持つ攻撃者は、多数の操作でキューを溢れさせ、防御側が悪意のある操作を特定することを困難にする可能性があります。

実装はレート制限を強制できます（例：ロールごと、アカウントごとの最大保留操作数）。

**3. キャンセルのフロントランニング**

防御側が悪意のある`OperationScheduled`イベントを検出し、`cancelOperation`を呼び出します。攻撃者は、同じ操作の別の`scheduleOperation`でキャンセルをフロントランし、スケジュールをリセットします。

再スケジュールは以前のエントリを上書きし、遅延をリセットするため、この攻撃は単に遅延ウィンドウを再開させるだけです。防御側は再度キャンセルできます。実装は、再スケジュールとキャンセルの間にクールダウン期間を強制することで、これをさらに軽減できます。

**4. 保留中の操作中のロール放棄**

攻撃者が操作をスケジュールした後、追跡を困難にするためにロールを放棄します。

実装は、イニシエーターを現在のロール保持者とは別に追跡します。保留中の操作は、ロールの変更に関わらず、元のスケジュールアカウントに関連付けられたままになります。

**5. キャンセルによるDoS**

イニシエーター、特権ロール保持者、またはその他の指定されたキャンセラーのいずれであっても、キャンセル権限を持つすべてのアカウントは、合法的な操作を体系的にキャンセルし、ロール保持者へのサービスを効果的に拒否する可能性があります。これは、あらゆる集中型キャンセル権限に内在するリスクです。

軽減策:

-   他のアカウントの操作に対するキャンセル権限を付与されたアカウントは、マルチシグウォレットを使用することが推奨されます。
-   キャンセル権限自体がタイムロックされたロールである場合、その自身の遅延は、影響を与える可能性のあるすべてのロールの中で最も長くすべきです。
-   オプションの緊急凍結拡張機能は、キャンセル権限とは独立した別の介入メカニズムを提供します。
-   実装は、キャンセルイベントをログに記録し、キャンセルレート制限を強制してもよい (MAY)。

## 著作権

著作権および関連する権利はCC0により放棄されます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-xxxx-role-based-timelock-operation/28742)
