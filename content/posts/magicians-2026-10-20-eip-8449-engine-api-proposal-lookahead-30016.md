---
title: 'EIP-8449: エンジンAPI提案の先行情報'
original_title: 'EIP-8449: Engine API proposal lookahead'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8449-engine-api-proposal-lookahead/30016'
author: cskiraly
date: '2026-10-20'
category: EIPs core
tags:
  - eips-core
  - eip
  - engine-api
  - consensus
  - execution-layer
  - pbs
  - scaling
  - protocol-design
topic_id: '30016'
translated_at: '2026-10-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8449: Engine API proposal lookahead](https://ethereum-magicians.org/t/eip-8449-engine-api-proposal-lookahead/30016) — cskiraly (2026-10-20)

[[glossary/EIP|EIP（Ethereum 改善提案）]]-8449に関する議論トピック

この[[glossary/EIP|EIP]]は、[[glossary/Engine-API|エンジンAPI]]メソッド`engine_proposalLookaheadUpdatedV1`を追加します。これにより、[[glossary/Consensus-Client|コンセンサスクライアント]]は、現在および次のエポックにおけるバリデータの今後の提案（スロット、タイムスタンプ、手数料受取人、ターゲットガス制限）を[[glossary/Execution-Client|実行クライアント]]に伝えます。これは通知であり、コマンドではありません。[[glossary/Block-Building|ブロック構築]]を開始したり、親ブロックを指定したり、コンセンサスルールを変更したりすることはありません。[[glossary/Execution-Client|実行クライアント]]は、いつ、どのように準備するかを決定します。

現在、[[glossary/Execution-Client|実行クライアント]]は、スロットの数秒前にペイロード属性から提案を学習します。適切に[[glossary/Block-Building|ブロック構築]]するためにできることの多くは、親ブロックを必要としません。いくつかの例を挙げます。

-   [[glossary/Sparse-blobpools|スパースブロブプール]]（[[glossary/EIP|EIP]]-8070）の下で含める可能性のある[[glossary/blob|ブロブ]]トランザクションの完全な[[glossary/blob|ブロブ]]を、常にではなく、数分前にランダムなタイミングでフェッチするように切り替えること。
-   ペンディング中のトランザクションが触れるステートをウォームアップすること。
-   アナウンスされたタイムスタンプ、手数料受取人、ガス制限でペンディング中のトランザクションを事前実行すること。
-   自身が実行するメンテナンスやトラフィックをスロットから遠ざけること。

[[glossary/ePBS|ePBS (enshrined Proposer-Builder Separation)]]（[[glossary/EIP|EIP]]-7732）、より高いガス制限、短いスロット（[[glossary/EIP|EIP]]-8198）、および[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]（[[glossary/EIP|EIP]]-7805）はそれぞれ、親ブロックとスロット間の時間を短縮するか、作業を追加します。Rationaleセクションでは、これが2021年に[[glossary/Engine-API|エンジンAPI]]が`[[glossary/engineforkchoiceUpdated|engine_forkchoiceUpdated]]`に統合した`engine_preparePayload`とどのように異なるかを説明しています。

サポートは両側でオプションであり、[[glossary/fork|フォーク]]に縛られません。メソッドを実装する[[glossary/Execution-Client|実行クライアント]]は、それを`engine_exchangeCapabilities`にリストし、[[glossary/Consensus-Client|コンセンサスクライアント]]はその場合にのみ呼び出します。どちらかの側が実装しない場合、何も変更されません。ブロックは今日と同じように`[[glossary/engineforkchoiceUpdated|engine_forkchoiceUpdated]]`とペイロード属性から構築されます。実装する[[glossary/Execution-Client|実行クライアント]]は、すべての呼び出しを検証する必要がありますが、アナウンスされた提案を好きなだけ使用しても、まったく使用しなくても構いません。

CLチームおよびELチームからのフィードバックを特に歓迎します。

#### 更新ログ

-   2026-10-19: 初版ドラフト、[PR #12547](https://github.com/ethereum/EIPs/pull/12547)

#### 外部レビュー

2026-10-20現在なし。

#### 未解決の問題

-   2026-10-20: この[[glossary/EIP|EIP]]が参照する形で、メソッドの仕様をethereum/execution-apis (`src/engine/`) にプルリクエストとして移動する。
-   2026-10-20: リクエストが大きすぎ、かつ不正な形式である場合：[[glossary/EIP|EIP]]はまだ`-38004`と`-32602`のどちらが優先されるかを明記していません。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8449-engine-api-proposal-lookahead/30016)
