---
title: Arbitrumの凍結が、鍵なしでアドレスからトランザクションを送信する方法
original_title: How Arbitrum's freezes send transactions from an address without its key
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/how-arbitrums-freezes-send-transactions-from-an-address-without-its-key/30175
author: Zealynx
date: '2026-11-02'
category: ERCs
tags:
  - ercs
  - security
  - rollup
  - layer2
  - governance
  - smart-contracts
  - execution-layer
  - protocol-design
  - arbitrum
topic_id: '30175'
translated_at: '2026-11-03'
translator: gemini-2.5-flash
---

> [!note] 原文
> [How Arbitrum's freezes send transactions from an address without its key](https://ethereum-magicians.org/t/how-arbitrums-freezes-send-transactions-from-an-address-without-its-key/30175) — Zealynx (2026-11-02)

10月30日、[[glossary/Arbitrum-Security-Council|Arbitrumセキュリティカウンシル]]は、Binanceエクスプロイトに関連するアドレスが[[glossary/Arbitrum-One|Arbitrum One]]上で保有していた8,425 ETHと74,559,805.2 ARBを凍結しました（[通知](https://forum.arbitrum.foundation/t/31625)）。これは今年2度目のことです。4月21日には、[[glossary/KelpDAO-exploiter|KelpDAOエクスプロイター]]から30,765 ETHに対しても同様の措置を取りました（[通知](https://forum.arbitrum.foundation/t/30803)）。

ここでドラフトをレビューする際、通常、アドレスは鍵が署名した場合にのみ移動するという前提で話を進めます。今月はArbitrumチェーン上で構築しているチームからのドラフトがいくつかあったため、私は10月のトランザクションを調べて、実際にチェーン上で何が起こっているのかを確認しました。

## イーサリアム上の1つのトランザクション

すべては[0xb69c81…35d6](https://etherscan.io/tx/0xb69c81774f507d46ce776aeaed8b4d31df96dd66ce6fd05073481011835355d6)、ブロック26301886にあります。カウンシルの9/12の[[glossary/Safe|Safe]]は、[[glossary/L1-UpgradeExecutor|L1 UpgradeExecutor]]を呼び出し、それが[[glossary/Inbox-proxy|Inboxプロキシ]]を別の[[glossary/implementation|実装]]に向け、メッセージを配信し、元に戻します。これをARBとETHでそれぞれ1回ずつ行います。

通常、Inboxはメッセージが[[glossary/Bridge|ブリッジ]]に到達する前に、それを呼び出す者をエイリアス化します（[`_deliverToBridge`](https://github.com/OffchainLabs/nitro-contracts/blob/2695e7b3e3f460531e2b77fed48a60561c54d90e/src/bridge/Inbox.sol#L317-L326)）。そして、[[glossary/ArbOS|ArbOS]]はブリッジが記録した送信者を[[glossary/L2-transaction|L2トランザクション]]の`from`として使用します（[`parseUnsignedTx`](https://github.com/OffchainLabs/nitro/blob/ccc5c828d9ea22f161efc784bac4d4a6559b7e59/arbos/parse_l2.go#L245-L248)）。オーバーライドされた実装（通知では新しい関数を`sendUnsignedTransactionOverride`と呼んでいます）は、エイリアスなしでターゲットアドレス自体を記録します。これは2つの`MessageDelivered`イベントで確認できます：種類3、送信者0x3e2b…32d5。

約10分後、両方のメッセージはArbitrum Oneにタイプ0x65トランザクション（ArbitrumUnsignedTx）として着地し、r、s、vはすべてゼロでした。[[glossary/nonce|ナンス]]2のトランザクションは、ARBトークン上で`transfer`を0x…0DA0に呼び出し、ナンス3のトランザクションは8,425.998 ETHを同じアドレスに送信します。このアドレスはArbitrum One上で7702デリゲーションを持っていましたが、それは何の影響も与えませんでした。トランザクションはアドレスから発信されるため、デリゲートのコードは実行されません。

## コントラクトまたはインデクサーがどう見るか

ARBトークンにとっては、保有者からの通常の`transfer`であり、通常の`Transfer`イベントでした。アドレスのトランザクションや`Transfer`ログを自身のアクションとしてカウントするレピュテーションスコアや収入記録は、これも同様にカウントするでしょう。Arbitrumチェーンでは、違いはトランザクション自体（タイプ0x65、空の署名）にあり、トークンのログにはありません。

強制されたトランザクションは、アドレスの次のナンスも使用したため、保有者がナンス2または3用に事前に署名していたものは、もはや着地できません。

[[glossary/EIP-1967|EIP-1967]]の実装スロットを読み取ってプロキシを監視している場合、このアップグレードは表示されません。Inboxスロットはブロック26301885で0x7c05…0a10を読み取り、ブロック26301886でも同じです。そのトランザクション内で別のコードが実行されたことを示すのは、Inbox上の4つの`Upgraded`イベントと、executor上の2つの`UpgradeExecuted`イベントです。4月と10月は同じオーバーライド実装（0x980d…a859）と、同じアクションコントラクト（0x3d45…a322）を使用したため、その実装への`Upgraded`アラートは安価に追加できます。

## 誰が実行できるか

Arbitrum Oneでは、[[glossary/L1-UpgradeExecutor|UpgradeExecutor]]がInboxの[[glossary/ProxyAdmin|ProxyAdmin]]を所有しており、カウンシルの緊急[[glossary/Safe|Safe]]（9/12）と[[glossary/DAO|DAO]]の[[glossary/L1-Timelock|L1タイムロック]]（投票後3日遅延）の両方がその`[[glossary/EXECUTOR_ROLE|EXECUTOR_ROLE]]`を保持しています。他のArbitrumチェーンでは、同じコントラクトがそのチェーンの所有者によって、そのチェーン独自のUpgradeExecutorを通じてアップグレードされます（[Arbitrum docs](https://docs.arbitrum.io/launch-arbitrum-chain/operate/ownership-and-access)）。[[glossary/ERC-8470|ERC-8470]]と[[glossary/ERC-8472|ERC-8472]]は[[glossary/Robinhood-Chain|Robinhood Chain]]（Arbitrumチェーン）上で構築しているチームからのものなので、これらのドラフトの場合、答えは[[glossary/Arbitrum-DAO|Arbitrum DAO]]ではなく、そのチェーンの所有者に依存します。

これらの中にバグは見当たりません。カウンシルはDAOから与えられた権限を行使し、両方のアクションを1時間半以内に公開しました。ドラフトで変更するとすれば、小さなことです。仕様が「エージェントの鍵だけがそのウォレットを移動できる」とか「[[glossary/stake|ステーク]]は`withdraw`を通じてのみ離れる」と述べている場合、これらのチェーンでは、それはアップグレードパスを制御する者によって左右されます。[[glossary/Security-Considerations|セキュリティに関する考慮事項]]にその旨を1行追加することで、異なる所有者を持つチェーンにデプロイする読者の助けになるでしょう。

Arbitrumチェーン上で構築している場合、あなたの[[glossary/indexer|インデクサー]]や[[glossary/pre-sign-check|事前署名チェック]]は、アドレスからのタイプ0x65トランザクションをそのアドレス自身のアクションとして扱いますか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/how-arbitrums-freezes-send-transactions-from-an-address-without-its-key/30175)
