---
title: 'EIP-8429: 繰り返し呼び出しに対するエスカレートするガス料金'
original_title: 'EIP-8429: Escalating gas for repeated calls'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8429-escalating-gas-for-repeated-calls/29798
author: staccoverflow
date: '2026-09-29'
category: EIPs
tags:
  - eips
  - eip
  - gas
  - fee-market
  - mev
  - protocol-design
  - economics
  - smart-contracts
  - anti-frontrunning
topic_id: '29798'
translated_at: '2026-10-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8429: Escalating gas for repeated calls](https://ethereum-magicians.org/t/eip-8429-escalating-gas-for-repeated-calls/29798) — staccoverflow (2026-09-29)

# EIP-8429: 繰り返し呼び出しに対するエスカレートするガス料金

[[glossary/EIP-8429|EIP-8429]]に関する議論トピック

繰り返しは過小評価されています。[[glossary/block|ブロック]]内でオプトインされた[[glossary/smart-contracts|コントラクト]]へのk番目の呼び出しは、`G_REF * k^2`の追加[[glossary/gas|ガス]]を支払います。
その半分は引き出し権限のない[[glossary/stake|ステーク]]として預けられます。残りの半分は、オプトインされた[[glossary/smart-contracts|コントラクト]]が指す場所に[[glossary/stake|ステーク]]されます。
[[glossary/Block-Builder|ブロックプロデューサー]] (block producer) は何も得られないため、誰もそれをファームする理由がありません。

#### 更新ログ

-   2026-09-28: 初期ドラフト、[PR 12384](https://github.com/ethereum/EIPs/pull/12384)
-   2026-09-28: 2つのラチェット、[[glossary/block|ブロック]]ごとの高速なものと、ウィンドウごとの発信者ごとの低速なもの、コミット [070e88d](https://github.com/ethereum/EIPs/pull/12384/commits/070e88d)
-   2026-09-28: ロビンフッドのリプレイからの定数、高速な追加料金に対する自己順序ゲート、コミット [acea3dc](https://github.com/ethereum/EIPs/pull/12384/commits/acea3dc)
-   2026-09-29: 番号8429が割り当てられ、[[glossary/block|ブロック]]シーケンスルールが仕様に移動、コミット [2bfd684](https://github.com/ethereum/EIPs/pull/12384/commits/2bfd684)

#### 外部レビュー

-   2026-09-28: パブリックRPCからのライブの[[glossary/Parametric-Token|トークン]]レベルデプロイメントの測定で、`NUMBER`エイリアシングバグが確認され、以前の設計では参照の68%が課金されていたことが判明（wtpkによる、彼は私がデプロイした[[glossary/Parametric-Token|トークン]]を保有していることを開示）、[PRコメント](https://github.com/ethereum/EIPs/pull/12384#issuecomment-5876284569)

#### 未解決の問題

-   2026-09-29: `STATICCALL`は参照としてカウントされるべきか？バッチ読み取りとレンディング市場は、抽出意図のない読み取り専用呼び出しを繰り返します。両方のバリアントのリプレイが進行中、[ここで提起](https://github.com/ethereum/EIPs/pull/12384#issuecomment-5876284569)
-   2026-09-29: 「単一のスワップは何も支払わない」は、取引所のルートが無料許容量内に留まる場合にのみ当てはまります。[[glossary/mainnet|メインネット]]にとって`K_FREE = 2`は適切か？
-   2026-09-29: キャップは[[glossary/block|ブロック]]あたり50番目の参照で拘束されます。それ以上の[[glossary/smart-contracts|コントラクト]]を価格設定から除外することが正しい境界か？
-   2026-09-29: `StakeVault`参照実装はまだ提供されていません。

* * *

#### この提案の背景

私はホワイトボードから始めたわけではありません。この[[glossary/EIP|EIP（Ethereum 改善提案）]]が価格設定するマシンを実行することから始めました。

ロビンフッドチェーンでは、ローンチに次ぐローンチで同じことが起こるのを見てきました。[[glossary/Parametric-Token|トークン]]が稼働すると、数分以内に少数の[[glossary/wallet|ウォレット]]が、誰も選ばないような手数料ティアで、その[[glossary/Parametric-Token|トークン]]上にプール群を開設し、ある[[glossary/block|ブロック]]から次の[[glossary/block|ブロック]]へと[[glossary/Parametric-Token|トークン]]を操作します。私はそのプール群の誕生を検出し、その裏で取引するリグを構築し、内部からその形状を学びました。65回のローンチに参加しました。それは機能しましたが、それが問題なのです。

次に、その形状が他の全員にどれだけのコストをかけるかを測定しました。あるローンチパッドの[[glossary/Transaction-Validation|トランザクション]]は、チェーン上の全[[glossary/gas|ガス]]料金の約42%を占めていました。24時間のウィンドウで、3,466回のローンチのうち130回がプール群の攻撃を受け、その日卒業した33の[[glossary/Parametric-Token|トークン]]のうち31がその中に含まれていました。クルーはほぼ完璧に勝者を選び出し、一般の購入者が出口となります。

私がたどり着いた結論は単純です。この行動をチェーンのネイティブ[[glossary/gas|ガス]][[glossary/Parametric-Token|トークン]]で課税し、誰もその税金を懐に入れることができないようにすることは、おそらく全員の利益になります。半分は一切の権限なしに永遠に[[glossary/stake|ステーク]]されます。残りの半分は、その標準にオプトインするアプリケーションの指示に従って[[glossary/stake|ステーク]]されます。何も焼却されず、何も[[glossary/Block-Builder|ブロックプロデューサー]] (block producer) には渡らないため、誰もそれをファームする理由がありません。

#### この[[glossary/EIP|EIP（Ethereum 改善提案）]]がすること

アカウントは一度、そして取り消し不能な形で自身を登録します。その後、[[glossary/block|ブロック]]内でk番目の呼び出しは`G_REF * k^2`の追加[[glossary/gas|ガス]]を要します。カウンターは[[glossary/consensus-state|ステート]] (state) ではなく、[[glossary/Execution-Client|クライアント]] (client) メモリに存在します。2番目の、より遅いカウンターは、同じ発信者が1週間にわたって同じアカウントに戻る場合の価格を設定します。両者のうち大きい方が課金されます。

一度購入する人は何も支払いません。[[glossary/block|ブロック]]内で同じ[[glossary/smart-contracts|コントラクト]]を50回参照するマシンは二次関数的に支払います。

#### すでに稼働しているもの

[[glossary/protocol|プロトコル]] (protocol) 形式には[[glossary/Execution-Client|クライアント]] (client) の変更が必要です。同じルールの[[glossary/Parametric-Token|トークン]]レベルの形式は必要なく、2026年9月28日からロビンフッドチェーンで稼働しています。

私のリグが参加したローンチにおける45,728件の実際の転送に対する私の独自のリプレイ（現在ドラフトにある定数を使用）：

|                                | 課金された量（ボリュームのベーシスポイント単位） |
| :----------------------------- | :--------------------------------- |
| マシンの形状に一致する[[glossary/wallet|ウォレット]] | 632                                |
| その他の全員                   | 19                                 |

*7件の投稿 - 2人の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8429-escalating-gas-for-repeated-calls/29798)
