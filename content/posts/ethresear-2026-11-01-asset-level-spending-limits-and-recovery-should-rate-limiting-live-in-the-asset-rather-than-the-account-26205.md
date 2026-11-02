---
title: 資産レベルの支出制限とリカバリー：レート制限はアカウントではなく資産に置かれるべきか？
original_title: >-
  Asset-level spending limits and recovery: should rate limiting live in the
  asset rather than the account?
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/asset-level-spending-limits-and-recovery-should-rate-limiting-live-in-the-asset-rather-than-the-account/26205
author: dlebee
date: '2026-11-01'
category: Security
tags:
  - security
  - smart-contracts
  - account-abstraction
  - eip
  - protocol-design
  - mempool
  - scaling
topic_id: '26205'
translated_at: '2026-11-02'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Asset-level spending limits and recovery: should rate limiting live in the asset rather than the account?](https://ethresear.ch/t/asset-level-spending-limits-and-recovery-should-rate-limiting-live-in-the-asset-rather-than-the-account/26205) — dlebee (2026-11-01)

今日のほとんどのキー侵害防御策 (key-compromise defenses)（スマートウォレット、[[glossary/ERC-7579|ERC-7579]]モジュール、ソーシャルリカバリー、[[glossary/EIP-7702|EIP-7702]]デリゲーション）は、アカウントのコード内でポリシーを強制します。ERC-8403もこれに続き、支出制限とロック解除時間はアカウントのルートの下でコミットされた権限となります。

私は異なる配置、すなわち**資産**レベルでのレート制限の強制を検討したいと思います。具体的には、[[glossary/ERC|ERC-20]]トークンの場合はトークンコントラクト、将来的には[[glossary/Native-ETH|ネイティブETH]]の場合はプロトコル自体です。

**動機。** アカウントレベルのポリシーは、アカウントのコードが転送パス (transfer path)にある間のみ拘束されます。これには2つのギャップがあります。

1.  *アローワンス (Allowances)*：既存の`transferFrom`承認を保持するコントラクトは、ウォレットの検証ロジック (validation logic)を再入力することなくトークンを移動させるため、ウォレットレベルの日次制限は拘束されません。
2.  *デリゲーションの置き換え (Delegation replacement)*：[[glossary/EIP-7702|EIP-7702]]の下では、侵害されたEOAキーが再委任 (re-delegate)を行い、それを抑制するはずだったポリシーを剥奪することができます。

資産レベルのチェックは、どのアプリケーションが開始したかに関わらず、すべてのバランス減少パス (balance-reducing path)（`transfer`、`transferFrom`、`burns`）を拘束し、デリゲーションの変更後も存続します。

**概要**（詳細は交渉可能であり、それがこのスレッドの目的です）：

-   オプションでアカウントごとの支出制限（ローリングウィンドウ (rolling window)）を、残高が変更される場所で強制します。
-   セキュリティを弱体化させる変更（制限の引き上げまたは削除、リカバリーアドレスの置き換え）は、約14日間の遅延後に有効になります。セキュリティを強化する変更は即時です。
-   通常の流出 (ordinary outflows)（既存のアローワンス (existing allowances)を介した支出を含む）をブロックする、不可逆な`declareCompromised()`状態。
-   事前登録されたリカバリーアドレス（「救世主 (savior)」）。これは侵害された状態でのみ権限を獲得し、残りの資金をスイープできます。これは単なるアドレスなので、[[glossary/Post-Quantum|ポスト量子署名]]を検証するコントラクトにすることができ、高価なキー (expensive key)はめったに使用されないパスに、安価な日常キー (cheap everyday key)はレート制限の背後に置かれます。新しい救世主の登録自体も遅延するため、攻撃者が登録してからスイープすることはできません。
-   [[glossary/ERC|ERC-20]]の場合、プロトコル変更は不要です。参加トークンが参照する、救世主と侵害状態を保持する共有レジストリコントラクト、またはトークンごとの状態のいずれかです。[[glossary/Native-ETH|ネイティブETH]]の強制には、残高減少時に参照される[[glossary/System-contract|システムコントラクト]]のようなものが必要になりますが、これははるかに大きな要求であり、おそらく正当化されることはないでしょう。

### ネイティブETH: システムコントラクト

固定アドレスに[[glossary/EIP|EIP]]-7002パターンで実装された[[glossary/System-contract|システムコントラクト]]。設定 (configuration)はアカウントからの通常の署名済みトランザクション (ordinary signed transaction)であり、ETHがアカウントから出るたびにプロトコルがコントラクトを参照します。

```solidity
interface IAccountSecurity {
    // decrease: immediate; increase or removal: 14-day delay
    function setSpendingLimit(uint256 amountPerPeriod, uint64 period) external;

    // irreversible by the primary key
    function declareCompromised() external;

    // activation delayed 14 days; a pending savior never activates if
    // the account is declared compromised first
    function setCompromisedSavior(address savior) external;

    // callable by the registered savior, only in compromised state
    function saviorSweep(address account, address destination, uint256 amount) external;
}
```

以下の呼び出し例では、実際のABIエンコーディング (ABI encoding)ではなく、`data`に読み取り可能な略記 (readable shorthand)を使用しています。制限の設定：

```json
{
  "jsonrpc": "2.0",
  "method": "eth_sendTransaction",
  "params": [{
    "from": "0xYourAccount",
    "to": "0xAccountSecuritySystemContract",
    "data": "setSpendingLimit(1 ETH, 24 hours)"
  }],
  "id": 1
}
```

救世主の登録（任意のアドレス：[[glossary/EOA|EOA]]、[[glossary/Multisig|マルチシグ]]、または[[glossary/Post-Quantum|ポスト量子署名]]を検証するコントラクト）：

```json
{
  "jsonrpc": "2.0",
  "method": "eth_sendTransaction",
  "params": [{
    "from": "0xYourAccount",
    "to": "0xAccountSecuritySystemContract",
    "data": "setCompromisedSavior(0xSaviorAccount)"
  }],
  "id": 1
}
```

侵害の宣言（通常の流出を即座にブロックし、プライマリーキー (primary key)による不可逆な状態）：

```json
{
  "jsonrpc": "2.0",
  "method": "eth_sendTransaction",
  "params": [{
    "from": "0xYourAccount",
    "to": "0xAccountSecuritySystemContract",
    "data": "declareCompromised()"
  }],
  "id": 1
}
```

リカバリースイープ (recovery sweep)。プライマリーキーではなく救世主によって署名され、通常の支出制限によって制限されません：

```json
{
  "jsonrpc": "2.0",
  "method": "eth_sendTransaction",
  "params": [{
    "from": "0xSaviorAccount",
    "to": "0xAccountSecuritySystemContract",
    "data": "saviorSweep(0xYourAccount, 0xSafeAccount, 9 ETH)"
  }],
  "id": 1
}
```

### ERC-20: トークンレベルの強制

プロトコル変更は不要です。トークンはすべての残高減少（`transfer`、`transferFrom`、`burns`）で制限を強制するため、既存のアローワンスがこれをバイパスすることはありません。

```solidity
interface IERC20SecurityExtended is IERC20 {
    function setSpendingLimit(uint256 amount, uint64 period) external;
    function saviorTransfer(address account, address destination, uint256 amount) external returns (bool);
}
```

救世主と侵害状態はトークンごとに存在することも、共有監査済みレジストリ (shared audited registry)から読み取られることも可能です。これにより、ユーザーはチェーンごとに一度登録するだけで済みます。

```solidity
interface IAccountSecurityRegistry {
    function setCompromisedSavior(address savior) external;
    function declareCompromised() external;
    function saviorOf(address account) external view returns (address);
    function isCompromised(address account) external view returns (bool);
}
```

**意見をいただきたい未解決の質問:**

1.  資産側（アカウント側ではなく）のレート制限に関する先行研究はありますか？ガーディアンやモジュールの設計（Argent、[[glossary/ERC-7579|ERC-7579]]）やタイムロックは見つけましたが、それらはすべてアカウント側にあります。
2.  アローワンスバイパスの議論は成り立ちますか、それとも資産側での強制を実質的に冗長にするウォレット側の緩和策がありますか？
3.  侵害状態は意図的にプライマリーキーによる不可逆なものとされています。設定された救世主がいる場合、グリフィング（攻撃者があなたのアカウントを凍結する行為）は盗難防止のための許容可能なトレードオフでしょうか？
4.  [[glossary/Native-ETH|ネイティブETH]]の場合：すべての価値フロー (value flows)を拘束するコンセンサス層の変更に満たない強制ポイントはありますか、それともこれは本質的にアプリケーション層機能 (application-layer feature)でしょうか？
5.  [[glossary/Frame-Transactions|EIP-8141フレームトランザクション]]および[[glossary/Account-Abstraction|ネイティブアカウント抽象化]]との相互作用：転送ごとの制限チェックは、[[glossary/mempool-admission|メムプールアドミッション]]がすでにボトルネック (bottleneck)となっている場所で検証コスト (validation cost)を追加します（[[glossary/MATCHA|MATCHA]]およびフレームトランザクションアドミッションのスレッドを参照）。ストレージに触れる制限チェック (storage-touching limit check)は、スケーラブルなメムプール検証 (scalable mempool validation)と互換性がありますか？

断片化 (fragmentation)は明らかなコストです。トークンごとのセキュリティ状態、一貫性のないUX (inconsistent UX)、そしてレジストリがシステム的な依存関係 (systemic dependency)になることです。資産レベルが厳密に優れているとは確信していません。私は、この強制ポイント (enforcement-point)の区別が現実的であり、その複雑さに見合う価値があるかどうかを尋ねています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/asset-level-spending-limits-and-recovery-should-rate-limiting-live-in-the-asset-rather-than-the-account/26205)
