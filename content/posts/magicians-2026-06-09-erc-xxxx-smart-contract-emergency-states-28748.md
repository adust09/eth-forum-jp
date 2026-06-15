---
title: 'ERC-XXXX: スマートコントラクトの緊急状態'
original_title: 'ERC-XXXX: Smart Contract Emergency States'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-xxxx-smart-contract-emergency-states/28748
author: dif
date: '2026-06-09'
category: ERCs
tags:
  - ercs
  - smart-contracts
  - eip
  - security
  - protocol-design
  - applications
  - ux
  - state-management
  - emergency-states
  - interoperability
topic_id: '28748'
translated_at: '2026-06-15'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX: Smart Contract Emergency States](https://ethereum-magicians.org/t/erc-xxxx-smart-contract-emergency-states/28748) — dif (2026-06-09)

この[[glossary/ERC|ERC]]は、[[glossary/Smart-Contracts|スマートコントラクト]]の緊急状態を監視するために設計されており、[[glossary/protocol|プロトコル]]間で相互運用可能な検出を可能にします。

## 概要

本提案は、[[glossary/Smart-Contracts|スマートコントラクト]]における緊急状態を監視するための標準[[glossary/interface|インターフェース]]を定義します。この[[glossary/interface|インターフェース]]は、多段階の緊急状態インジケーターと、最新の状態変更のタイムスタンプを提供します。

## 動機

[[glossary/Smart-Contracts|スマートコントラクト]]は、互換性のない方法で緊急メカニズムを実装しています。一部はバイナリの`paused`フラグを公開し、その他はカスタム名とセマンティクスを持つ独自のステート変数を使用し、多くは監視可能な緊急状態を全く公開していません。外部システムがコントラクトが緊急状態にあるかどうか、またはその深刻度を照会するための標準[[glossary/interface|インターフェース]]が存在しません。

これにより、具体的なギャップが生じています。

1.  **[[glossary/protocol|プロトコル]]間のリスク管理**: 多くのコントラクトは監視可能な緊急状態を公開していません。公開しているものも互換性のないアプローチを使用しており、[[glossary/protocol|プロトコル]]間の検出をコストのかかるものにし、サードパーティのリスクに対する自動応答を事実上不可能にしています。
2.  **ユーザーの安全性**: 標準[[glossary/interface|インターフェース]]がないため、ウォレットやフロントエンドは緊急状態を一般的に検出できません。ユーザーは警告なしに問題のあるコントラクトとやり取りしてしまいます。
3.  **自動監視**: セキュリティインフラは、コントラクト全体の緊急ステータスを一様な方法で照会できません。監視システムは各[[glossary/protocol|プロトコル]]ごとに個別に設定する必要があり、運用オーバーヘッドが増加し、アラートの見落としの可能性が高まります。

## 仕様

このドキュメントにおけるキーワード「MUST」、「MUST NOT」、「REQUIRED」、「SHALL」、「SHALL NOT」、「SHOULD」、「SHOULD NOT」、「RECOMMENDED」、「NOT RECOMMENDED」、「MAY」、「OPTIONAL」は、RFC 2119およびRFC 8174に記述されている通りに解釈されます。

### コアインターフェース: IEmergencyState

[[glossary/interface|インターフェース]]は以下の要素をMUSTで含みます。

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

/// @title IEmergencyState
/// @notice Standard interface for smart contract emergency states.
/// @dev Contracts implementing this interface MUST also implement ERC-165 supportsInterface.
interface IEmergencyState /* is IERC165 */ {

    /// @notice Emitted when the emergency state is set to a new value.
    /// @param executor      The address that triggered the state change.
    /// @param previousState The emergency state before the transition.
    /// @param newState      The emergency state after the transition.
    /// @dev MUST NOT be emitted when previousState equals newState.
    event EmergencyStateChanged(address indexed executor, uint8 previousState, uint8 newState);

    /// @notice Returns the current emergency state of the contract
    /// @dev MUST return a value in the range [0, 255]
    ///      State 0 MUST indicate normal operation
    ///      States 1-255 MAY be defined by the implementer
    /// @return emergencyState The current emergency state
    function emergencyState() external view returns (uint8 emergencyState);

    /// @notice Returns the timestamp of the most recent emergency state change.
    /// @dev MUST be updated to block.timestamp on every state change, regardless of direction.
    ///      MUST return 0 if no state change has ever occurred.
    /// @return timestamp The Unix timestamp of the most recent state change
    function lastEmergencyStateUpdateAt() external view returns (uint256 timestamp);
}
```

### 標準緊急状態

| 状態 (State) | 説明 (Description) |
| --- | --- |
| 0 | 通常動作。デフォルト状態である必要があります (MUST)。 |
| 1-255 | 実装者定義。セマンティクスは実装者によって文書化される必要があります (MUST)。 |

外部システムは、0より大きい状態を緊急状態を示すものとして扱うべきです (SHOULD)。消費者は、状態の解釈のために[[glossary/protocol|プロトコル]]固有のドキュメントを照会すべきです (SHOULD)。

### `emergencyState()`

-   [[glossary/view-function|view関数]]として実装される必要があります (MUST)。
-   \[0, 255] の範囲の値を返す必要があります (MUST)。
-   状態0は通常動作を示す必要があります (MUST)。

### `lastEmergencyStateUpdateAt()`

-   [[glossary/view-function|view関数]]として実装される必要があります (MUST)。
-   最新の状態変更時の`block.timestamp`を返す必要があります (MUST)。

### `EmergencyStateChanged`

-   [[glossary/event|イベント]]は、成功した状態遷移ごとに1回発行される必要があります (MUST)。
-   `previousState`が`newState`と等しい場合、[[glossary/event|イベント]]は発行されてはなりません (MUST NOT)。
-   `executor`フィールドは、直接の呼び出し元 (`msg.sender`) のアドレスである必要があります (MUST)。
-   `previousState`フィールドは、遷移前の緊急状態の値である必要があります (MUST)。
-   `newState`フィールドは、遷移後の緊急状態の値である必要があります (MUST)。

## 理論的根拠

### インターフェースに状態遷移関数を含めない理由

この[[glossary/interface|インターフェース]]は、何を監視するかを標準化するものであり、どのように変更するかを標準化するものではありません。外部システムは緊急状態を読み取る必要があり、設定する必要はありません。状態遷移関数は意図的に省略されています。なぜなら、認証パターンは[[glossary/protocol|プロトコル]]によって異なるためです。一部は単一のオーナーを使用し、その他は[[glossary/multi-sig-wallets|マルチシグ]]または[[glossary/governance-vote|ガバナンス投票]]を使用します。遷移関数を義務付けると、特定の認証パターンが強制され、相互運用性を向上させることなく有効な実装が除外されてしまいます。

### 実装者定義の状態

バイナリのpaused/unpausedフラグは、異なる緊急シナリオを区別する必要がある[[glossary/protocol|プロトコル]]には不十分です。状態1-255はオープンなままにされており、各[[glossary/protocol|プロトコル]]が、攻撃シナリオ、リスクレベル、運用モード、その他何であれ、そのユースケースにとって意味のある条件を表す状態を定義できるようにしています。重要な要件は、実装者が使用するすべての状態を文書化することであり、これにより外部システムがそれらを正しく解釈できるようになります。

### アクションと監視の分離

本提案は、緊急状態の監視層のみを定義します。状態遷移関数とその認証は実装上の懸念事項であり、この[[glossary/interface|インターフェース]]では標準化されません。緊急応答[[glossary/interface|インターフェース]]も実装するコントラクトは、応答フックが状態遷移関数を呼び出し、回復フックが状態を0にリセットするように、内部で両者を連携させることができます。本提案は、いかなるアクション層の標準にも依存しません。

## 後方互換性

この[[glossary/interface|インターフェース]]は、新しいコントラクトやアップグレード可能なコントラクトに[[glossary/proxy-upgrade|プロキシアップグレード]]を介して追加できます。この[[glossary/interface|インターフェース]]をまだ実装していないアップグレード不可能なコントラクトは、遡及的に採用することはできません。

## セキュリティに関する考慮事項

### 緊急状態の信頼性は保証されない

外部コントラクトから緊急状態を読み取り、それに基づいてアクションを実行するコントラクトは、誤った状態や操作された状態に基づいて行動することの結果を考慮する必要があります。監視対象コントラクトの状態遷移関数は、この[[glossary/interface|インターフェース]]の範囲外であり、侵害されたり、誤って設定されたり、悪意を持ってトリガーされたりする可能性があります。誤って設定された緊急状態は、消費するコントラクトが通常は行わない不可逆的なアクションを実行する原因となる可能性があります。

例えば、依存関係が緊急状態を報告したときにポジションを清算する[[glossary/lending-protocol|レンディングプロトコル]]は、その状態が誤って設定された場合、ユーザーに重大な損害を与える可能性があります。緊急状態を消費するコントラクトは、潜在的に不正確な状態に基づいて行動することの影響を慎重に評価し、重大な結果を伴うアクションに対しては、追加の検証、時間遅延、または人間による確認などの保護措置を適用すべきです (SHOULD)。

### 状態遷移権限の集中化

状態遷移関数は、この[[glossary/interface|インターフェース]]では定義されておらず、各実装に委ねられています。実際には、緊急状態をトリガーする権限は、単一のアドレスまたは少数のアドレスに集中していることがよくあります。この権限を制御するキーが侵害された場合、攻撃者は偽の緊急状態を設定して操作を妨害したり、真の緊急時に設定を怠ったりする可能性があります。実装は、[[glossary/multi-sig-wallets|マルチシグウォレット]]、[[glossary/time-locked-governance|タイムロックされたガバナンス]]、緊急トリガーと解決者の間の役割分離、状態遷移トランザクションの監視アラートなどの緩和策を検討すべきです。

## 参照実装

以下は`IEmergencyState`の参照実装です。認証と`setEmergencyState()`関数は意図的に省略されています。具体的なコントラクトは、独自の認証要件に従ってそれらを定義します。

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import "../interface/IEmergencyState.sol";

/// @title EmergencyState
/// @notice Reference implementation of IEmergencyState with storage for state and timestamp.
///         Authorization for state transitions and the setEmergencyState() function are
///         intentionally not defined here; concrete contracts MUST implement them.
abstract contract EmergencyState is IEmergencyState {

    uint8 internal _currentEmergencyState;
    uint256 internal _lastEmergencyStateUpdateAtTimestamp;

    /// @inheritdoc IEmergencyState
    function emergencyState() external view override returns (uint8) {
        return _currentEmergencyState;
    }

    /// @inheritdoc IEmergencyState
    function lastEmergencyStateUpdateAt() external view override returns (uint256 timestamp) {
        return _lastEmergencyStateUpdateAtTimestamp;
    }

    /// @notice Transitions to a new emergency state and records the timestamp of the change.
    /// @dev    Updates the timestamp to block.timestamp on every state change.
    ///         No-op when newState equals the current state (no event, no timestamp update).
    ///         Emits EmergencyStateChanged only when the state actually changes.
    function _setEmergencyState(uint8 newState) internal virtual {
        uint8 previousState = _currentEmergencyState;
        if (previousState == newState) {
            return;
        }
        _lastEmergencyStateUpdateAtTimestamp = block.timestamp;
        _currentEmergencyState = newState;
        emit EmergencyStateChanged(msg.sender, previousState, newState);
    }

    /**
     * @dev Checks if the contract supports a given interface
     * @param interfaceId The interface identifier, as specified in ERC-165
     * @return true if the contract supports the interface, false otherwise
     */
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == this.supportsInterface.selector || 
            interfaceId == type(IEmergencyState).interfaceId;
    }
}
```

### 状態定義の例

以下は、状態1-3がどのように定義されるかを示す非規範的な例です。実装者は、自身の[[glossary/protocol|プロトコル]]に適した任意の状態値とセマンティクスを自由に定義できます。

| 状態 (State) | 名前 (Name) | 動作例 (Example Behavior) |
| --- | --- | --- |
| 0 | Normal (通常) | すべてのコントラクト関数が正常に動作する |
| 1 | Restricted (制限付き) | 高価値またはリスクの高い操作が制限されるか、追加の認証が必要になる |
| 2 | HighRisk (高リスク) | 緊急回復操作のみが許可され、通常操作は停止される |
| 3 | Frozen (凍結) | すべての外部インタラクションが停止され、内部管理機能のみが動作可能 |

### スタンドアロン実装の例

以下の例は、緊急応答[[glossary/interface|インターフェース]]なしで、`IEmergencyState`のみを実装するトークンコントラクトを示しています。このコントラクトは、独自の`EMERGENCY_ROLE`と`setEmergencyState()`関数を定義しています。

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./EmergencyState.sol";

contract TokenWithEmergencyState is ERC20, Pausable, AccessControl, EmergencyState {

    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");

    constructor(address emergencyAdmin)
        ERC20("TokenWithEmergencyState", "TES")
    {
        _grantRole(EMERGENCY_ROLE, emergencyAdmin);
    }

    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    function setEmergencyState(uint8 newState) external onlyRole(EMERGENCY_ROLE) {
        _setEmergencyState(newState);
    }
}
```

### 緊急応答インターフェースとの組み合わせ例

以下の例は、`IEmergencyState`（本提案）と`IEmergencyResponse`（緊急応答[[glossary/interface|インターフェース]]）の両方を実装するトークンコントラクトを示しています。`EmergencyState`が独自の`AccessControl`を持たないため、両方の抽象コントラクトを競合なく直接継承できます。状態は`triggerEmergency()`と`resolveEmergency()`を通じてのみ管理され、状態と副作用（一時停止/一時停止解除）の一貫性が保たれます。

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./EmergencyResponse.sol";
import "./EmergencyState.sol";

contract TokenWithEmergencyResponseAndState is ERC20, Pausable, EmergencyResponse, EmergencyState {

    constructor(address emergencyTriggerer, address emergencyResolver)
        ERC20("TokenWithEmergencyResponseAndState", "TERS")
    {
        _grantRole(EMERGENCY_TRIGGER_ROLE, emergencyTriggerer);
        _grantRole(EMERGENCY_RESOLVE_ROLE, emergencyResolver);
    }

    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    /// @dev Only emergencyState 3 (Frozen) is supported: sets the state then pauses transfers.
    function _executeEmergencyTrigger(uint8 _emergencyState) internal override {
        if (_emergencyState == 3) {
            _setEmergencyState(_emergencyState);
            _pause();
            return;
        }
        revert("unsupported emergencyState");
    }

    /// @dev Resets the emergency state to 0 and unpauses transfers.
    ///      Only emergencyState 3 (Frozen) recovery is supported; other values revert.
    function _executeEmergencyResolve(uint8 _emergencyState) internal override {
        if (_emergencyState == 3) {
            _setEmergencyState(0);
            _unpause();
            return;
        }
        revert("unsupported emergencyState for recovery");
    }
}
```

## 著作権

著作権および関連する権利はCC0により放棄されます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-xxxx-smart-contract-emergency-states/28748)
