---
title: >-
  ERCドラフト:
  [[glossary/Secure-Transaction-Verification-and-Authorization|STVA（安全なトランザクション検証と認可）]]向けアカウント権限ライフサイクル
original_title: 'ERC draft: Account Authority Lifecycle for STVA'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-draft-account-authority-lifecycle-for-stva/30138
author: Obaresearch
date: '2026-10-31'
category: ERCs
tags:
  - ercs
  - account-abstraction
  - security
  - smart-contracts
  - protocol-design
  - eips
  - identity
  - access-control
topic_id: '30138'
translated_at: '2026-11-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC draft: Account Authority Lifecycle for STVA](https://ethereum-magicians.org/t/erc-draft-account-authority-lifecycle-for-stva/30138) — Obaresearch (2026-10-31)

# ERCドラフト: [[glossary/Secure-Transaction-Verification-and-Authorization|STVA（安全なトランザクション検証と認可）]]向けアカウント権限ライフサイクル

**概要:**

アカウントに対する権限の完全なライフサイクル（発行、有効化、[[glossary/Scoped-Capability|スコープ付きケイパビリティ]]による減衰、レビュー、停止、取り消し、およびリカバリー）のための標準モデルとインターフェース。権限ドリフト（意図された目的を超えて存続する古いオーナー、モジュール、または鍵）を防止します。

[[glossary/Scoped-Capability-Token|スコープ付きケイパビリティトークン]]と独立したシミュレーションを、高価値アカウントや[[glossary/Multisig|マルチシグ]]にとって運用上意味のあるものにするガバナンスの基盤を提供します。

**要約:**

[[glossary/EOA|EOA（外部所有アカウント）]]（[[glossary/EIP-7702|EIP-7702]]経由）、[[glossary/Smart-Account|スマートアカウント]]、および[[glossary/Multisig|マルチシグ]]に対する権限の状態、遷移、および必須チェックを定義します。高リスクな権限変更は、独立したシミュレーションに合格し、該当する場合は[[glossary/Scoped-Capability-Token|スコープ付きケイパビリティトークン]]を通じてのみ実行されなければなりません。

**動機:**

多くの損失は、適切に取り消されたりレビューされたりすることなく残存した、あるいは過度に広範な権限に起因しています。ライフサイクル規律は、一度限りの設定を継続的な最小権限管理へと変えます。

**仕様**:

状態: 未初期化、アクティブ、減衰済み（ケイパビリティのみ）、停止済み、取り消し済み、リカバリー済み。

現在の権限者（オーナー、モジュール、ガーディアン、[[glossary/session-keys|セッションキー]]）のための必須イベントとビュー関数。

高特権の遷移（オーナーの追加、閾値の変更、モジュールのインストール、実装のアップグレード、[[glossary/EIP-7702|EIP-7702]]委任の設定）

必須条件:

提案された変更と一致する[[glossary/Independent-Simulation-Result|独立シミュレーション結果]]。

その変更を正確に承認する明示的な[[glossary/Scoped-Capability|スコープ付きケイパビリティ]]（または[[glossary/MPC|マルチパーティ計算 (MPC)]]セレモニー）。

オプションの[[glossary/Time-Delayed-Access-Control|タイムロック]]またはデュアルコントロール。

レビュー頻度: アカウントは`lastAuthorityReview`タイムスタンプを公開してもよい（MAY）。厳格なコンプライアンスは、古い権限を表面化させます。

リカバリーパス自体もケイパビリティスコープであり、シミュレーション可能でなければなりません。

**インターフェース:**

```solidity
interface IAccountAuthorityLifecycle {
    // 状態: 未初期化, アクティブ, 減衰済み, 停止済み, 取り消し済み
    enum AuthorityState { Uninitialized, Active, Attenuated, Suspended, Revoked }

    function authorityState() external view returns (AuthorityState);

    function listAuthorities() external view returns (address[] memory, bytes32[] memory roles);

    function lastReviewTimestamp() external view returns (uint48);

    // 高特権の変更は有効なScoped Capabilityで呼び出される必要があります
    function transitionAuthority(
        bytes32 capabilityHash,
        bytes calldata capabilitySig,
        SimulationResult calldata simResult,
        bytes calldata newAuthorityData
    ) external;

    event AuthorityTransitioned(AuthorityState from, AuthorityState to, bytes32 capabilityHash);

    event AuthorityReviewed(uint48 timestamp);
}
```

**議論点**:

既存のSafe [[glossary/ERC|ERC]]-7579モジュールシステムへのマッピング。

ライフサイクル状態がオンチェーンで必須か、オンチェーンコミットメントを伴うオフチェーン推奨か。

リカバリーモジュールおよびソーシャルリカバリーとの統合。

[[glossary/Secure-Transaction-Verification-and-Authorization|STVA（安全なトランザクション検証と認可）]]提案のためのアカウント権限ライフサイクルに関する公開ドラフトリポジトリと、基本的なCI（Markdownリンティング、リンクチェック、codespell）をセットアップしました。

すべてのチェックは現在パスしています。

[[glossary/Secure-Transaction-Verification-and-Authorization|STVA（安全なトランザクション検証と認可）]]提案のためのアカウント権限ライフサイクルに関する公開ドラフトリポジトリと、基本的なCI（Markdownリンティング、リンクチェック、codespell）をセットアップしました。

すべてのチェックは現在パスしています。

![アカウント権限ライフサイクルに関するERCドラフトのGitHubリポジトリ](https://github.com/MATOBOYCRYPTO65/ERC-draft-Account-Authority-Lifecycle-for-STVA/raw/main/images/github-repo-screenshot.png)

[MATOBOYCRYPTO65/ERC-draft-Account-Authority-Lifecycle-for-STVA: アカウントに対する権限の完全なライフサイクル（発行、有効化、スコープ付きケイパビリティによる減衰、レビュー、停止、取り消し、およびリカバリー）のための標準モデルとインターフェース。権限ドリフト（意図された目的を超えて存続する古いオーナー、モジュール、または鍵）を防止します。](https://github.com/MATOBOYCRYPTO65/ERC-draft-Account-Authority-Lifecycle-for-STVA)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-draft-account-authority-lifecycle-for-stva/30138)
