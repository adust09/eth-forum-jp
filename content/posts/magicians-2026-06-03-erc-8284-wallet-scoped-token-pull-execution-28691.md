---
title: 'ERC-8284: ウォレットスコープのトークンプル実行'
original_title: 'ERC-8284: Wallet-Scoped Token Pull Execution'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8284-wallet-scoped-token-pull-execution/28691
author: wenzhenxiang
date: '2026-06-03'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - wallet
  - ux
  - gas
  - payments
topic_id: '28691'
translated_at: '2026-06-05'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8284: Wallet-Scoped Token Pull Execution](https://ethereum-magicians.org/t/erc-8284-wallet-scoped-token-pull-execution/28691) — wenzhenxiang (2026-06-03)

この提案は、1回の外部呼び出し中に一時的な `ERC-20` プル認証を行うための、ウォレットネイティブなプリミティブを定義します。

準拠するアカウントは `executeWithTokenPull` を公開し、これにより1つのターゲット、1つのアセット、および1つの最大量に対する一時的なプルコンテキストを開きます。その呼び出し中、バインドされたターゲットは `tokenPullToCaller` を呼び出すことで、アカウントからトークンをプルできます。アクティブな呼び出しウィンドウ外では、プル試行は失敗します。

意図される実装モデルは、実行ローカルな状態、例えば一時ストレージ (transient storage) です。アカウントはターゲットを呼び出す前にアクティブな `(target, asset, remainingAmount)` コンテキストを記録し、戻る前またはリバート (revert) をバブルする前にそれをクリアします。これにより、ターゲットは現在の実行ウィンドウ中のみ、限定的なプル機能を持つことになります。

この動機は、ターゲットが実行中に最終的な量を決定する決済フローにおいて、一般的な `approve` の後に呼び出しを行うパターンを回避することです。このパターンは煩雑であり、別途承認トランザクションが必要になる場合があり、余分なガス (gas) を消費し、後で取り消し (revocation) ステップをユーザーに残す可能性があります。また、決済ターゲットによって最終的な量が決定されるフローでは、単純なウォレット側の `transfer` は柔軟性に欠けます。

この[[glossary/ERC|Ethereum Request for Comments (ERC)]]は、認証を一時的、ターゲットにバインド、アセットにバインド、および量に上限を設けるものとします。これにより、再利用可能なアローアンス (allowance) を残すことを避けつつ、アクティブな呼び出し中に上限内で分割プルを可能にします。

*1件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8284-wallet-scoped-token-pull-execution/28691)
