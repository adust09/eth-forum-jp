---
title: 'ERC議論: ERC-20 転送可能なタイムロック'
original_title: 'ERC Discussion: ERC-20 Transferable Timelock'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-discussion-erc-20-transferable-timelock/30493
author: yellowBirdy
date: '2026-11-24'
category: ERCs
tags:
  - ercs
  - erc-20
  - tokenomics
  - security
  - defi
  - smart-contracts
  - protocol-design
topic_id: '30493'
translated_at: '2026-11-27'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC Discussion: ERC-20 Transferable Timelock](https://ethereum-magicians.org/t/erc-discussion-erc-20-transferable-timelock/30493) — yellowBirdy (2026-11-24)

私は、新しく[[ミント|mint]]されたトークンが、[[ミント|mint]]された同じ[[ブロック|block]]内で[[バーン|burn]]されるのを防ぐ[[ERC-20|ERC-20]]拡張機能を提案します。このトークンは転送可能であり、通常の[[DeFi|DeFi]]操作と互換性を保ちます。

このパターンは共有する価値があると思いますが、独自の[[ERC|EIP（Ethereum 改善提案）]]としてふさわしいかどうかは確信が持てません。そのため、コンセプト、実装、そして標準に属すべきかどうかについてフィードバックを得るためにここに投稿します。

この拡張機能は、各アカウントの[[タイムロック|timelock]]された残高を追跡します。[[ミント|mint]]は[[タイムロック|timelock]]された残高を増やし、[[転送|transfer]]はその一部またはすべてを別のアカウントに移動させることができ、[[バーン|burn]]は[[アンロック|unlocked]]された残高のみを使用できます。

```
unlockedBalance = balanceOf(account) - timelockedBalanceOf(account)
```

## 動機

[[LPトークン|LP tokens]]、[[ボールトシェア|vault shares]]、[[リキッドステーキングトークン|リキッドステーキングトークン]]など、パーミッションレスな[[ミント|mint]]と[[バーン|burn]]を持つ[[ERC-20|ERC-20]]トークンを考えてみましょう。これらのトークンでは、1つの[[ブロック|block]]内での`mint → action → burn`シーケンスが潜在的な攻撃対象となります。

素朴な解決策としては、各アカウントの最終[[ミント|mint]]の[[ブロック|block]]を記録し、そのアカウントが同じ[[ブロック|block]]内で[[バーン|burn]]するのを防ぐことが考えられます。しかし、これは同じアカウント内の古いトークンを制限し、ユーザーは新しいトークンを別のアカウントに[[転送|transfer]]することでこれを回避できます。[[転送|transfer]]をブロックすると、[[DeFi|DeFi]]の相互運用性やUXを犠牲にして回避策を閉じることになります。

別の解決策は、[[タイムロック|timelock]]が[[転送|transfer]]に追随するようにすることです。これにより、新しいトークンを受け取ると、その[[ブロック|block]]の残りの期間、受信者が「汚染」されます。アカウントレベルで追跡される汚染は、[[グリフィング問題|griefing problem]]を引き起こします。アリスが1,000個の古いトークンを保有しており、1個の新しいトークンを受け取ると、彼女のアカウントは汚染され、1,001個のトークンのいずれも[[バーン|burn]]できなくなります。

TransferableTimelockは、代わりに[[タイムロック|timelock]]された量を追跡します。

```
Alice:
    balance        1,001    
    timelocked         1
    unlocked       1,000
```

アリスは依然として1,000個の古いトークンを[[バーン|burn]]できます。新しいトークンは転送可能であり、一時的な[[タイムロック|timelock]]を伴います。

## ファンジビリティ

TransferableTimelockは、[[バーン|burn]]の目的で[[ERC-20|ERC-20]]残高の一部を区別するため、[[タイムロック|timelock]]されたトークンと[[アンロック|unlocked]]されたトークンは厳密には完全に[[ファンジブル|fungible]]ではありません。

[[タイムロック|timelock]]されたトークンは、[[AMM|AMM]]、[[ボールト|vault]]、レンディング市場などの共有[[流動性プール|liquidity pool]]に入ることができ、その後、[[タイムロック|timelock]]を別のユーザーに渡すことができます。[[タイムロック|timelock]]されたトークンは、市場にすでに存在する[[アンロック|unlocked]]されたトークンと交換することもできます。

例えば、アリスは100個の[[タイムロック|timelock]]されたトークンを[[AMM|AMM]]に売却し、100個を買い戻すことができます。もし[[AMM|AMM]]が古い[[アンロック|unlocked]]された残高を保有していれば、彼女は[[アンロック|unlocked]]されたトークンを受け取ることができます。これを「在庫スワップ」と呼びます。

```
Alice before swap 1:
    balance          100
    timelocked       100
    unlocked           0

Alice after swap 1:
    balance            0
    timelocked         0
    unlocked           0

AMM:
    +100 timelocked tokens

Alice after swap 2:
    balance          100
    timelocked         0
    unlocked         100
```

アリスはこれで買い戻した100個のトークンを[[バーン|burn]]できます。[[タイムロック|timelock]]は消えたわけではありません。[[AMM|AMM]]は依然として100個の[[タイムロック|timelock]]されたトークンを保有しています。アリスは[[タイムロック|timelock]]されたトークンを古い[[アンロック|unlocked]]されたトークンに置き換えたのです。その実現可能性は、利用可能な[[アンロック|unlocked]]された[[流動性|liquidity]]と実行コストに依存します。[[転送|transfer]]順序が、[[アンロック|unlocked]]された[[流動性|liquidity]]にどのようにアクセスできるかを決定します。

## 転送順序: アン
