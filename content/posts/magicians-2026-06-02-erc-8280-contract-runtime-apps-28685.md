---
title: 'ERC-8280: コントラクトランタイムアプリ'
original_title: 'ERC-8280: Contract Runtime Apps'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8280-contract-runtime-apps/28685'
author: wenzhenxiang
date: '2026-06-02'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - execution-layer
  - account-abstraction
  - applications
  - contract-design
topic_id: '28685'
translated_at: '2026-06-05'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8280: Contract Runtime Apps](https://ethereum-magicians.org/t/erc-8280-contract-runtime-apps/28685) — wenzhenxiang (2026-06-02)

この[[glossary/ERC|ERC]]は、サードパーティのランタイムアプリをホストするスマートコントラクトのための最小限のインターフェースを定義します。準拠するホストは、ローカルアプリの有効化と、有効化されたアプリに対するパーミッションレスな実行エントリポイントを公開します。

ランタイムアプリの実行は、アプリが所有する状態への単純な外部呼び出しとしてではなく、ホストのコンテキスト内で発生しなければなりません (MUST)。

## 動機

スマートコントラクト、特にスマートアカウントは、継承ルール、決済フロー、定期支払い、財務ポリシー、取引ロジックなど、長期にわたる振る舞いをホストすることが増えています。これらの機能は、無関係な外部dAppsとしてではなく、ホストの権限とホストが所有する状態を使用して、ホストの拡張機能として実行される必要があることがよくあります。

-   **ランタイムホスト**: この[[glossary/ERC|ERC]]を実装し、1つ以上のランタイムアプリをホストするスマートコントラクト。

-   **ランタイムアプリ**: ランタイムホストが `executeRuntimeApp` を介して実行するアプリケーションコントラクト。

-   **ホストコンテキスト実行**: アプリコードがホストの権限で実行され、アプリコードによって永続的な状態が書き込まれる際に、ホストが所有するストレージに対して行われる実行。

-   **共有ストレージランタイム**: ホストコンテキストランタイムの一種で、アプリコードが `delegatecall`、ファセットディスパッチ、または同等のメカニズムを介して、ランタイムホストのストレージアドレスで永続的な状態を読み書きできるもの。

**インターフェース**

ランタイムホストは以下を実装しなければなりません (MUST)。

```
pragma solidity ^0.8.23;

interface IERCRuntimeAppHost {

event AppEnabled(address indexed host, address indexed app);
event AppDisabled(address indexed host, address indexed app);

function executeRuntimeApp(address app, bytes calldata data) external payable returns (bytes memory result);

function enableApp(address app) external;

function disableApp(address app) external;

function isAppEnabled(address app) external view returns (bool);
}
```

1件の投稿 - 1名の参加者

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8280-contract-runtime-apps/28685)
