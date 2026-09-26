---
title: 'ERC TBD: ポータブル支出許可'
original_title: 'ERC TBD: Portable Spend Grants'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-tbd-portable-spend-grants/29776'
author: tankcdr
date: '2026-09-25'
category: ERCs
tags:
  - ercs
  - account-abstraction
  - eip
  - smart-contracts
  - security
  - ux
  - defi
  - protocol-design
  - delegation
topic_id: '29776'
translated_at: '2026-09-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC TBD: Portable Spend Grants](https://ethereum-magicians.org/t/erc-tbd-portable-spend-grants/29776) — tankcdr (2026-09-25)

皆さん、こんにちは。

これは新しい[[glossary/ERC|ERC]]、「ポータブル支出許可 (Portable Spend Grants)」に関する議論スレッドです。このスレッドのURLを`discussions-to`に記載できるようになり次第、[[glossary/ERC|ERC]]のPRをオープンします。

[github.com/tankcdr/ERCs](https://github.com/tankcdr/ERCs/blob/erc-draft-spend-grants/ERCS/erc-draft_spend_grants.md)

#### [ERCS/erc-draft\_spend\_grants.md](https://github.com/tankcdr/ERCs/blob/erc-draft-spend-grants/ERCS/erc-draft_spend_grants.md)

[`erc-draft-spend-grants`](https://github.com/tankcdr/ERCs/blob/erc-draft-spend-grants/ERCS/erc-draft_spend_grants.md)

```
---
title: Portable Spend Grants
description: Signed multi-asset spend grants with rolling and lifetime caps
author: Chris Madison (@tankcdr)
discussions-to: https://ethereum-magicians.org/t/placeholder
status: Draft
type: Standards Track
category: ERC
created: 2026-09-17
requires: 20, 712, 1271, 7528, 7702
---

## Abstract

This specification defines a portable spend grant: a typed, signed grant from a principal to a delegate that authorizes repeated spending of one or more assets under per-call, trailing-window, and lifetime caps. Native currency of the execution chain is identified by the [[glossary/ERC-7528|ERC-7528]] address; every other asset is an [[glossary/ERC-20|ERC-20]] contract. The principal signs an [[glossary/EIP-712|EIP-712]] digest bound to the execution chain and to an immutable revocation registry. The registry stores remaining usage and does not move funds. A separate executor, selected by signing that registry as the domain verifying contract, calls `consume` in the same transaction as the value movement. Contract principals validate signatures with [[glossary/ERC-1271|ERC-1271]]; [[glossary/EIP-7702|EIP-7702]] delegated accounts also accept their own key's signature. Caps never treat zero as unlimited. The terms are portable: any wallet or tool can hash, render, and check them. A grant is bound to one chain and one registry, and through the registry to one executor; using a different one requires a new signature. This document is an unnumbered working draft.

## Motivation

Approvals and one-shot signatures do not give wallets, applications, and relying parties a shared object for bounded spend. An [[glossary/ERC-20|ERC-20]]アローアンスは通常、単一資産で、上限がなく、有効期限のないデビット権です。UTC日または暦期間でリセットされる定期的なアローアンスでは、深夜を挟んで2回全額を支出できてしまいます。マルチアセット許可では、各資産が独自の残高を持つ必要があるため、1つの署名で複数の資産をカバーでき、ある資産の支出が別の資産の残高を減らすことはありません。

```

このファイルは途中で切り詰められています。[オリジナルを表示](https://github.com/tankcdr/ERCs/blob/erc-draft-spend-grants/ERCS/erc-draft_spend_grants.md)

ベクター、コンパクトなSolidityリファレンス、および[[glossary/ERC-7730-Descriptors|ERC-7730記述子]]は、同じブランチの`assets/erc-draft_spend_grants/`にあります。

### なぜ

エージェントや[[glossary/session-keys|セッションキー]]を使って開発したことがあるなら、おそらくこれが必要だったでしょう。「このキーは、これらの資産のXまでをしばらくの間使うことができ、私はそれを停止できる。」[[glossary/ERC-20|ERC-20]]の`approve`は、通常1つのトークンを対象とし、有効期限や時間枠がないため、適しません。暦日ごとの制限も適しません。これらは深夜にリセットされるため、デリゲートは23:59に全額を使い、再び00:01に全額を使うことができます。
このドラフトでは、その1つのオブジェクトを定義します。署名されたタイプは`SpendGrant`です。

### 署名される内容

プリンシパルは以下に署名します。

-   誰が行動できるか（デリゲート）
-   どの資産か（ネイティブ通貨は[[glossary/ERC-7528|ERC-7528]]の`0xEeee…EEeE`アドレス、その他はすべて[[glossary/ERC-20|ERC-20]]）
-   各資産に対するコールごと、移動ウィンドウ、およびライフタイムの制限
-   誰が資金を受け取ることができるか
-   有効範囲

ダイジェストは1つのチェーンと1つのレジストリにバインドされます。レジストリは残りの使用量と取り消しを記録し、トークンを移動させることはありません。実際に価値を転送するコントラクトは、価値の移動と同じトランザクション内で`consume`を呼び出す必要があり、そうしないと支出はカウントされません。

例えば、「このチェーンでは、エージェントは過去24時間で最大1000 USDCと0.5 WETHを支出できる」というものです。これは単一の署名と単一のハッシュであり、一度取り消せば済みます。

ウィンドウは現在から`windowSeconds`だけ過去を遡ります。「今日」ではありません。制限がゼロの場合、それはゼロを意味し、決して無制限ではありません。

「ポータブル」とは、その条件を指します。どのウォレットやツールでも、それらをハッシュ化し、レンダリングし、チェックできます。許可自体が移動するという意味ではありません。別のチェーン、レジストリ、またはエグゼキューターで使用するには、新しい署名が必要です。

これら2つの役割は混同しやすいです。デリゲートは、プリンシパルが許可で指名した人物です。エグゼキューターは、`consume`を呼び出すことが許可された唯一のコントラクトであり、レジストリ上で不変に設定されます。したがって、どのレジストリに対して署名するかを選択することで、エグゼキューターを選択します。

### 3つの設計選択

-   **各資産は独自の予算を持つ。** `assetCombine`は署名されたタイプに含まれていますが、今のところ有効なのは`0`のみです。資産間で共有される予算は有用ですが、人々はドルで予算を立てるため、このドラフトでは定義されていない価格参照が必要です。後でモードが変更されてもタイプハッシュが変わらないように、このフィールドは残しました。
-   **レンダリングハッシュなし。** 規範的なプレーンテキストレンダリングはありますが、それは完全に署名されたフィールドから構築されるため、それを許可にハッシュ化しても新しいコミットメントは何もありません。
-   **フラットコストでの正確な移動ウィンドウ。** リファレンスでは、各資産のデビットを1024スロットのリングに実行中の合計とともに保持し、期限切れのデビットを先頭から削除します。リファレンスエグゼキューターを介した[[glossary/Execution-gas|実行ガス]]（21kのベースとコールデータを除く）は、許可に対する最初の支出で約161k、その後はライブデビットの数に関わらず約89k、リングが一周すると約70kです。1024の制限はリファレンスに属し、署名された許可には属しません。

### 試してみる

Arc [[glossary/testnet|テストネット]]（チェーン5042002）にデプロイされており、ソースは検証済みです。

-   レジストリ: [`0xE3591E35c6473FB2A9D2f7370d1FE3454864fb32`](https://explorer.testnet.arc.io/address/0xE3591E35c6473FB2A9D2f7370d1FE3454864fb32)
    
-   エグゼキューター: [`0xd0F9e902b054fd8B329Ae8615F9C8247A199ecd2`](https://explorer.testnet.arc.io/address/0xd0F9e902b054fd8B329Ae8615F9C8247A199ecd2)
    

Arc固有の注意点として、USDCはトークンアドレス`0x3600…0000`でリストし、ネイティブアドレスではありません。Arcでは両者は同じ残高なので、両方をリストすると、1つの資金プールに対して2つの別々の予算を持つことになります。

そのレジストリには[[glossary/ERC-7730-Descriptors|ERC-7730記述子]]があるため、ウォレットはデリゲート、受取人、ウィンドウ、各資産の制限をその資産の単位で、そして有効期限日を表示できます。`assetCombine`が`0`以外の場合は拒否します。`executor()`は表示できないため、ウォレットは依然としてそれを自分で調べる必要があります。

移動ウィンドウは、素朴なモデルに対してファズテストされており、フルリングのラップアラウンドも含まれます。Halmosは、有効期限ルール、完全な256ビット幅での制限チェック、2回の支出シーケンス、取り消し、およびエグゼキューターのみの`consume`を証明します。

リファレンスは未監査ですので、[[glossary/testnet|テストネット]]でのみ使用してください。

### 他の[[glossary/ERC|ERC]]との関連性

-   **[[glossary/ERC-7710|ERC-7710]] / [[glossary/ERC-7715|ERC-7715]]。** [[glossary/ERC-7710|ERC-7710]]はデリゲーションの償還をカバーし、[[glossary/ERC-7715|ERC-7715]]は許可を要求するためのウォレットRPCです。[[glossary/ERC-7710|ERC-7710]]は許可バイトを不透明なままにしており、このドラフトはそのバイトが運ぶことができる1つの型付きの意味です。[[glossary/ERC-7710|ERC-7710]]を必須とはしていません。
-   **[[glossary/ERC-8226|ERC-8226]]。** これは、コンプライアンスプロバイダーと凍結機能を備えた規制された単一資産許可であり、異なる問題です。失敗条件が同じである場合、その理由名（`EXPIRED`、`REVOKED`、`OVER_TX_CAP`など）を再利用しました。
-   **[[glossary/ERC-8312|ERC-8312]]。** これは、不透明として扱う機能の残りの使用量を追跡します。このドラフトは機能自体を定義し、レジストリはその残りの使用量のv1ストアです。
    フォローアップの拡張機能として、許可内にスワップ価格チェックが追加される予定です。所有者は価格ポリシーに署名し、エージェントはそれを厳しくすることはできますが、緩めることはできません。

### フィードバックを希望する点

1.  **[[glossary/EIP-7702|EIP-7702]]プリンシパル。** キーの[[glossary/ECDSA-signature|ECDSA署名]]は[[glossary/ERC-1271|ERC-1271]]の前にチェックされるため、未処理の許可はデリゲーションの変更後も存続します。トレードオフとして、[[glossary/Smart-Account|スマートアカウント]]コードへのデリゲーションはキーを引退させないため、キーが署名した許可、およびキーが署名する新しい許可は、レジストリで取り消されるまで有効なままです。キーはいつでもデリゲーションを元に戻すことができるため、これはキーがすでに持っているもの以上のものを与えるものではありません。この順序付けに異議のある方はいますか？
2.  **`consume`とデリゲート。** `consume`は`msg.sender`を`delegate`にバインドしません。バインディングは「このレジストリのエグゼキューター」です。これで十分でしょうか、それとも`consume`は`delegate`もチェックすべきでしょうか？
3.  **ライブデビット制限。** レジストリは資産ごとのライブデビットに上限を設け、その上限を超えると`WINDOW_FULL`でリバートする場合があります（リファレンスでは1024を使用）。仕様は最小値を設定すべきでしょうか。そうすれば、多数の少額支払いを実行するデリゲートは、どの準拠レジストリが許可するかを知ることができます。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-tbd-portable-spend-grants/29776)
