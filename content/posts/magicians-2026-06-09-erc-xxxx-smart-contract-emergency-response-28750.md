---
title: 'ERC-XXXX: スマートコントラクト緊急対応'
original_title: 'ERC-XXXX: Smart Contract Emergency Response'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-xxxx-smart-contract-emergency-response/28750
author: dif
date: '2026-06-09'
category: ERCs
tags:
  - ercs
  - security
  - protocol-design
  - smart-contracts
  - eip
  - applications
  - emergency-response
topic_id: '28750'
translated_at: '2026-06-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX: Smart Contract Emergency Response](https://ethereum-magicians.org/t/erc-xxxx-smart-contract-emergency-response/28750) — dif (2026-06-09)

この[[glossary/ERC|Ethereum Request for Comments (ERC)]]は、オンチェーンでの緊急対応のための最小限の標準インターフェースを導入します。これにより、実装するコントラクトは、改ざん防止されたオンチェーンイベントトレイルを持つ呼び出し可能な緊急関数を公開することが求められます。

## 概要

この[[glossary/ERC|Ethereum Request for Comments (ERC)]]は、オンチェーンでの緊急対応能力を必要とするスマートコントラクトのための最小限の標準インターフェースを定義します。このインターフェースは、実装するコントラクトが公開しなければならない2つの外部関数を義務付けており、それぞれが対応または復旧ロジックのどのブランチを実行するかを選択する数値パラメータを受け入れ、それらの関数が呼び出されるたびに発行されなければならない対応するイベントを定義します。

* * *

## 動機

スマートコントラクトの悪用、特にキーの侵害、不正な権限昇格、その他のオンチェーン攻撃を含むものは、単一のトランザクションまたは数ブロック内で完了することが頻繁にあります。対応できる時間は数秒単位で測定されます。しかし、現在の慣行では、緊急対応はデプロイ後に対応される運用上の懸念として扱われています。コントラクトは緊急機能をアドホックに実装しており、関数名、イベント構造が不統一であり、外部システムが依存できる共有インターフェースが存在しません。

これにより、コントラクトのライフサイクル全体で複合的な障害が発生します。

-   **設計時**: セキュリティアーキテクトは、まだ存在しないインターフェースに対して対応手順を事前に設計できません。
-   **監査時**: 監査人は、標準に対して緊急対応の動作を検証できません。彼らは、特注の実装から意図をリバースエンジニアリングしなければなりません。
-   **運用時**: 自動監視システムは、既知のインターフェースを介して事前承認された対応をトリガーしたり監視したりできません。なぜなら、既知のインターフェースが存在しないからです。
-   **インシデント時**: 対応者はプレッシャーの下で即興的に行動し、テストしたことがないかもしれない関数を、緊急動作が正式に指定されたことのないコントラクトに対して呼び出します。

その結果、高度な検出能力を持つ組織でさえ、対応パスが標準化されていないために対応が遅れることになります。

* * *

## 仕様

このドキュメントにおけるキーワード「MUST」、「MUST NOT」、「REQUIRED」、「SHALL」、「SHALL NOT」、「SHOULD」、「SHOULD NOT」、「RECOMMENDED」、「NOT RECOMMENDED」、「MAY」、「OPTIONAL」は、[RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) および [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) に記述されている通りに解釈されます。

インターフェースは以下の要素を含まなければなりません (MUST)。

### インターフェース

`IEmergencyResponse` インターフェースは、緊急対応のための標準関数とイベントを定義し、実装間の相互運用性と一貫性を保証します。

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

/// @title IEmergencyResponse
/// @notice Minimal standard interface for on-chain emergency response.

interface IEmergencyResponse {

    /// @notice Emitted when triggerEmergency() is successfully executed.
    /// @param executor       The address that called triggerEmergency().
    /// @param emergencyState The emergencyState identifier passed to triggerEmergency().
    event EmergencyTriggered(address indexed executor, uint8 emergencyState);

    /// @notice Emitted when resolveEmergency() is successfully executed.
    /// @param executor       The address that called resolveEmergency().
    /// @param emergencyState The emergencyState identifier passed to resolveEmergency().
    event EmergencyResolved(address indexed executor, uint8 emergencyState);

    /// @notice Trigger a predefined emergency response.
    /// @param emergencyState An implementer-defined identifier selecting which response
    ///                       branch or standard operating procedure to execute.
    /// @dev    The implementing contract defines what each emergencyState value triggers.
    ///         MUST emit EmergencyTriggered upon successful execution.
    ///         The implementing contract MUST restrict access to authorized callers.
    function triggerEmergency(uint8 emergencyState) external;

    /// @notice Resolve an emergency and return to normal operation.
    /// @param emergencyState An implementer-defined identifier selecting which recovery
    ///                       branch or standard operating procedure to execute.
    /// @dev    The implementing contract defines what each emergencyState value triggers.
    ///         MUST emit EmergencyResolved upon successful execution.
    ///         The implementing contract MUST restrict access to authorized callers.
    function resolveEmergency(uint8 emergencyState) external;
}
```

### 振る舞い要件

#### `triggerEmergency(uint8 emergencyState)`

-   実装するコントラクトは、`triggerEmergency(uint8)` と全く同じシグネチャを持つ関数を `external` または `public` として公開しなければなりません (MUST)。
-   この関数は、許可された呼び出し元のみが緊急対応を実行できるように、認証チェックを強制しなければなりません (MUST) (例: ロールベースアクセス制御 (Role-Based Access Control) の使用)。
-   この関数は、正常な実行時に `EmergencyTriggered(msg.sender, emergencyState)` を発行しなければなりません (MUST)。
-   `emergencyState` パラメータは実装者定義です。実装するコントラクトは、各値がどのブランチまたは手順を呼び出すかを定義し、サポートされるすべての `emergencyState` 値を文書化しなければなりません (MUST)。
-   実装するコントラクトは、その他のすべての振る舞いを定義します。どのようなアクションが取られるか、誰が関数を呼び出すことができるか、どのような条件下で呼び出すことができるかなどです。

#### `resolveEmergency(uint8 emergencyState)`

-   実装するコントラクトは、`resolveEmergency(uint8)` と全く同じシグネチャを持つ関数を `external` または `public` として公開しなければなりません (MUST)。
-   この関数は、許可された呼び出し元のみが緊急復旧を実行できるように、認証チェックを強制しなければなりません (MUST) (例: ロールベースアクセス制御 (Role-Based Access Control) の使用)。
-   この関数は、正常な実行時に `EmergencyResolved(msg.sender, emergencyState)` を発行しなければなりません (MUST)。
-   `emergencyState` パラメータは実装者定義です。実装するコントラクトは、各値がどのブランチまたは手順を呼び出すかを定義し、サポートされるすべての `emergencyState` 値を文書化しなければなりません (MUST)。
-   実装するコントラクトは、その他のすべての振る舞いを定義します。どのような復旧アクションが取られるか、誰が関数を呼び出すことができるか、どのような条件下で呼び出すことができるかなどです。

#### `EmergencyTriggered`

-   このイベントは、`triggerEmergency(uint8)` の呼び出しが成功するたびに1回発行されなければなりません (MUST)。
-   `executor` フィールドは、直接の呼び出し元 (`msg.sender`) のアドレスでなければなりません (MUST)。
-   `emergencyState` フィールドは、関数呼び出しに渡された値でなければなりません (MUST)。

#### `EmergencyResolved`

-   このイベントは、`resolveEmergency(uint8)` の呼び出しが成功するたびに1回発行されなければなりません (MUST)。
-   `executor` フィールドは、直接の呼び出し元 (`msg.sender`) のアドレスでなければなりません (MUST)。
-   `emergencyState` フィールドは、関数呼び出しに渡された値でなければなりません (MUST)。

* * *

## 論拠

### 規定された実装よりも最小限のインターフェース

この[[glossary/EIP|EIP（Ethereum 改善提案）]]は、実装 (規定された振る舞いを持つベースコントラクト) ではなくインターフェースを標準化します。代替案として、具体的な実装を標準化することが検討されましたが、却下されました。実装標準は、どのような緊急アクションが存在するか (一時停止、凍結、転送など) と、それらがどのように振る舞うかを規定します。これは、すべてのコントラクトタイプに1つの脅威モデルを強制することになります。対照的に、インターフェース標準は、コントラクトが既知のエントリポイントと既知の観測可能なものを公開することのみを要求し、各コントラクトが独自の緊急動作を定義しながら、その動作に関する知識を共有しない監視システム、監査人、対応者との相互運用性を維持することを可能にします。

### ブランチ選択のための `emergencyState` パラメータ

`uint8 emergencyState` パラメータにより、単一の標準化されたエントリポイントが複数の異なる対応または復旧手順をディスパッチできるようになります。これがない場合、複数の緊急シナリオを持つコントラクトは、複数の非標準関数を公開するか (相互運用性を損なう)、またはすべてのシナリオを1つの関数にまとめ、呼び出し元が手順を選択する方法がない状態になります。`uint8` の範囲 (0-255) は、単一のコントラクトが定義する現実的な緊急手順のセットには十分です。パラメータのセマンティクスは意図的に実装するコントラクトに委ねられています。この[[glossary/EIP|EIP（Ethereum 改善提案）]]は、特定の値に意味を割り当てません。実装は、サポートされるすべての `emergencyState` 値を文書化しなければなりません (MUST)。

### 実装定義メカニズムによる強制的な認証

インターフェースは `triggerEmergency(uint8)` が認証を強制しなければならない (MUST) と要求しますが、意図的にメカニズムを規定しません。これは、インターフェースのみの設計と同じ原則を反映しています。結果 (許可された呼び出し元のみが緊急対応をトリガーできること) は標準化されていますが、その手段は標準化されていません。異なるデプロイメントは、正当に異なる認証要件を持っています。一部は専用のロールを使用し、一部はマルチシグウォレット (multi-signature wallet) を使用し、一部はオンチェーンガバナンスプロセスを使用します。特定のメカニズムを義務付けることは、セキュリティを向上させることなく有効な実装を排除することになります。重要なのは、認証が存在し、強制されることです。どのように強制されるかは、実装するコントラクトとその監査人の責任です。

* * *

## 後方互換性

この[[glossary/EIP|EIP（Ethereum 改善提案）]]は新しいインターフェースを導入するものであり、既存のオペコード (opcode)、プリコンパイル (precompile)、または[[glossary/ERC|Ethereum Request for Comments (ERC)]]を変更するものではありません。非標準の関数名を通じて緊急機能を実装している既存のコントラクトには影響しません。採用は厳密にオプトインです。

* * *

## 参照実装

以下は、推奨されるパターンを示す最小限の参照実装です。`triggerEmergency(uint8)` を専用の `EMERGENCY_TRIGGER_ROLE` に、`resolveEmergency(uint8)` を専用の `EMERGENCY_RESOLVE_ROLE` にアクセス制御し、必須イベントを発行します。内部で実行されるアクション (一時停止、凍結、資産転送) は例示のみであり、標準の一部ではありません。

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import "../interface/IEmergencyResponse.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title EmergencyResponse, Reference Implementation
/// @notice Demonstrates the RECOMMENDED pattern for IEmergencyResponse.
///         EMERGENCY_TRIGGER_ROLE is the designated role for calling triggerEmergency()
///         and EMERGENCY_RESOLVE_ROLE is the designated role for calling resolveEmergency().
///         The internal implementations are contract-specific and are NOT defined by the standard.
abstract contract EmergencyResponse is IEmergencyResponse, AccessControl {

    /// @notice Dedicated role for triggering emergency response.
    /// @dev    RECOMMENDED: held by a multi-signature wallet (threshold >= 2-of-N).
    ///         This role name and its use are a recommendation, not a requirement of
    ///         IEmergencyResponse.
    bytes32 public constant EMERGENCY_TRIGGER_ROLE = keccak256("EMERGENCY_TRIGGER_ROLE");

    /// @notice Dedicated role for resolving emergency response.
    /// @dev    RECOMMENDED: held by a multi-signature wallet (threshold >= 2-of-N).
    ///         This role name and its use are a recommendation, not a requirement of
    ///         IEmergencyResponse.
    bytes32 public constant EMERGENCY_RESOLVE_ROLE = keccak256("EMERGENCY_RESOLVE_ROLE");

    /// @inheritdoc IEmergencyResponse
    function triggerEmergency(uint8 emergencyState) external override onlyRole(EMERGENCY_TRIGGER_ROLE) {
        _executeEmergencyTrigger(emergencyState);
        emit EmergencyTriggered(msg.sender, emergencyState);
    }

    /// @inheritdoc IEmergencyResponse
    function resolveEmergency(uint8 emergencyState) external override onlyRole(EMERGENCY_RESOLVE_ROLE) {
        _executeEmergencyResolve(emergencyState);
        emit EmergencyResolved(msg.sender, emergencyState);
    }

    /// @notice Internal hook: override to define contract-specific emergency actions.
    /// @param emergencyState The emergencyState identifier forwarded from triggerEmergency().
    function _executeEmergencyTrigger(uint8 emergencyState) internal virtual;

    /// @notice Internal hook: override to define contract-specific resolve actions.
    /// @param emergencyState The emergencyState identifier forwarded from resolveEmergency().
    function _executeEmergencyResolve(uint8 emergencyState) internal virtual;
}
```

### 具体的な実装例

```
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./EmergencyResponse.sol";

contract TokenWithEmergencyResponse is ERC20, Pausable, EmergencyResponse {

    constructor(address emergencyTriggerer, address emergencyResolver)
        ERC20("TokenWithEmergencyResponse", "TER")
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

    /// @dev emergencyState 3 (Frozen) = pause transfers; other values revert.
    function _executeEmergencyTrigger(uint8 emergencyState) internal override {
        if (emergencyState == 3) {
            _pause();
            return;
        }
        revert("unsupported emergencyState");
    }

    /// @dev emergencyState 3 (Frozen) = unpause transfers; other values revert.
    function _executeEmergencyResolve(uint8 emergencyState) internal override {
        if (emergencyState == 3) {
            _unpause();
            return;
        }
        revert("unsupported emergencyState");
    }
}
```

* * *

## セキュリティに関する考慮事項

### アクセス制御は必須

実装するコントラクトは、`triggerEmergency(uint8)` を許可された呼び出し元に制限しなければなりません (MUST)。関数セレクターは公開されているため、保護されていない実装は直接的な攻撃対象となります。認証メカニズムは実装定義であり、他のアクセス制御メカニズムも許容されます。

### 緊急ロールキーの侵害

`triggerEmergency(uint8)` または `resolveEmergency(uint8)` の許可された呼び出し元が単一のキーである場合、そのキーが侵害されると、攻撃者は緊急アクションを実行または元に戻す一方的な能力を得ます。実装者は、以下の緩和策を検討することが推奨されます (encouraged)。

-   N ≥ 3 の署名者に対して少なくとも2-of-Nの閾値を持つマルチシグウォレット (multi-signature wallet) を使用すること。
-   古いキーの露出が時間とともに特権を蓄積するのを防ぐため、認証付与を時間制限付きにすること。
-   `triggerEmergency(uint8)` と `resolveEmergency(uint8)` の認証を別々のロールに分離すること。共有キーが侵害された場合、攻撃者は `resolveEmergency(uint8)` を介して直後に対処を元に戻す可能性があります。トリガーと解決の認証を分離することで、一方が侵害されても他方が制御下に保たれることを保証します。

### 緊急アクティベーションによるサービス拒否

特権を持つ呼び出し元は、`triggerEmergency(uint8)` を悪用してサービス拒否を引き起こす可能性があります。例えば、復旧パスのないコントラクトを永久に一時停止させるなどです。実装するコントラクトは、可能な限り `resolveEmergency(uint8)` を介して緊急アクションが元に戻せることを保証すべきであり (SHOULD)、どの行動が不可逆的であり、どのようなガバナンス条件下で元に戻せるかを明確に文書化すべきです (SHOULD)。

### 重複する `emergencyState` の副作用

異なる `emergencyState` 値を持つ複数の `triggerEmergency(uint8)` 呼び出しが同時にアクティブであるかどうかは、実装の決定です。並行性を許容する実装は、以下のリスクに注意する必要があります。2つの `emergencyState` 値が副作用を共有する場合 (例えば、両方が `_pause()` を呼び出す場合)、コントラクトがすでに一時停止されているため、2回目の呼び出しはリバートします。さらに重要なのは、1つの `emergencyState` を解決すると、別の `emergencyState` が論理的にアクティブなままであっても、共有された副作用が元に戻される可能性があることです。例えば、`triggerEmergency(1)` がコントラクトを一時停止させ、次に `triggerEmergency(2)` が呼び出され、その後 `resolveEmergency(1)` がコントラクトを一時停止解除しますが、`emergencyState 2` はまだ有効なままです。複数の同時アクティブな `emergencyState` 値をサポートする実装コントラクトは、ストレージでどれがアクティブであるかを追跡し、実行前にアクティブな `emergencyState` 値の完全なセットに対して共有された副作用を保護すべきです (SHOULD)。

### 緊急対応の有効性は対応時間に依存する

ほとんどの攻撃は単一のトランザクションまたは少数のブロック内で完了するため、人間が反応的に `triggerEmergency(uint8)` を呼び出す時間はほとんどありません。このインターフェースの有効性を最大化するために、実装者は、大規模な引き出しや特権的な状態変更に対するタイムロック (timelock) など、影響の大きい操作に遅延メカニズムを組み合わせることを推奨されます (encouraged)。タイムロックは、悪意のあるアクションが開始されてから決済されるまでの間にウィンドウを作成し、被害が完了する前に `triggerEmergency(uint8)` を呼び出して保護アクションを発効させることを可能にします。このような遅延がない場合、緊急対応は事後にさらなる被害を制限することしかできず、それを防ぐことはできません。

* * *

## 著作権

著作権および関連する権利はCC0により放棄されます。

*4投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-xxxx-smart-contract-emergency-response/28750)
