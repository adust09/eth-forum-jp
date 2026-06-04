---
title: 'ERC: ウォレットNFTプル実行'
original_title: 'ERC: Wallet NFT Pull Execution'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-wallet-nft-pull-execution/28693'
author: wenzhenxiang
date: '2026-06-03'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - wallet
  - nft
  - execution-layer
  - ux
  - protocol-design
topic_id: '28693'
translated_at: '2026-06-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC: Wallet NFT Pull Execution](https://ethereum-magicians.org/t/erc-wallet-nft-pull-execution/28693) — wenzhenxiang (2026-06-03)

この提案は、単一の外部呼び出し中に一時的なNFTプル承認を行うための、ウォレットネイティブなプリミティブを定義します。

準拠するアカウントは `executeWithNftPull` を公開します。これは、単一のターゲット、単一の `ERC-721` アセット、および単一のトークンIDに対して、一時的なプルコンテキストを開きます。その呼び出し中、バインドされたターゲットは `nftPullToCaller` を呼び出すことで、アカウントからNFTをプルできます。アクティブな呼び出しウィンドウ外では、プル試行は失敗します。

意図される実装モデルは、実行ローカルな状態、例えばトランジェントストレージです。アカウントは、ターゲットを呼び出す前にアクティブな `(target, asset, tokenId)` コンテキストを記録し、戻る前またはリバートをバブルアップする前にそれをクリアします。これにより、ターゲットは現在の実行ウィンドウ中のみ、限定的なプル機能を持つことになります。

この動機は、ターゲットが実行中にカストディ（保管）を取るかどうかを決定するNFT決済フローをサポートすることです。通常のウォレット側の `safeTransferFrom` は、ターゲットが自身の決済チェックを完了する前にウォレットが転送を開始しなければならないため、これらのフローには柔軟性に欠ける場合があります。

この[[glossary/ERC|ERC（Ethereum Request for Comments）]]は、承認を一時的、ターゲットに紐付け、アセットに紐付け、トークンIDに紐付けられたものとします。これにより、再利用可能な転送権限を残すことを避けつつ、決済ターゲットがアクティブな呼び出し中に正確なNFTをプルすることを可能にします。

*1件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-wallet-nft-pull-execution/28693)
