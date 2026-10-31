---
title: 'EIP-8476: EOA委任の永続的オプトアウト'
original_title: 'EIP-8476: Permanent EOA Delegation Opt-Out'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8476-permanent-eoa-delegation-opt-out/30134
author: nicolashw
date: '2026-10-30'
category: EIPs core
tags:
  - eips-core
  - eip
  - account-abstraction
  - security
  - execution-layer
  - protocol-design
  - eoa-delegation
topic_id: '30134'
translated_at: '2026-10-31'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8476: Permanent EOA Delegation Opt-Out](https://ethereum-magicians.org/t/eip-8476-permanent-eoa-delegation-opt-out/30134) — nicolashw (2026-10-30)

ドラフトCore [[EIP|EIP]]「**Permanent EOA Delegation Opt-Out**」に関する議論スレッドです。

PR: [Add EIP: Permanent EOA Delegation Opt-Out by nicolashw · Pull Request #12600 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12600)

## 概要

[[EOA|EOA（外部所有アカウント）]]が、実行不可能なアカウントコードマーカーをインストールすることで、[[EIP-7702|EIP-7702]]の委任を永続的に無効にできるようにします。このオプトアウトは、狭く定義された、これまで無効だった形式のset-codeトランザクションによって実行されます。アカウントはそのアドレスと通常のトランザクション機能を保持しますが、その後の委任承認によってマーカーを置き換えたりクリアしたりすることはできません。

## 動機

一部のアカウント（機関ウォレット、取引所のホットウォレット、財務ウォレットなど）は委任された実行を必要とせず、その運用管理はそれが利用できないことを前提としている場合があります。この提案により、所有者はその機能を明示的に削除できます。これは通常の秘密鍵の漏洩（private-key compromise）から保護するものでは**ありません**。鍵の所有者は引き続き通常のトランザクションに署名し、資金を転送できます。

## メカニズムの概要

-   オプトアウトは、空の承認リスト、`destination == sender`、`value == 0`、空のデータ、および空のアクセスリストを持つタイプ4（set-code）トランザクションです。この形式は現在無効であり、他のすべての空リスト形式は引き続き無効です。
-   これにより、送信者のコードが候補マーカー`0xef0200`（正確な3バイト一致）に設定され、固定の`33500` [[gas|ガス]]が課金され、[[EVM-Code|EVMコード]]は実行されません。
-   EIP-3607の例外が拡張され、このコードを持つ送信者は引き続きトランザクションを発行できます。
-   マーカーを持つオーソリティの[[EIP-7702|EIP-7702]]承認は、コード適格性チェックに失敗し、スキップされます（ゼロアドレスへのクリアを含む）。
-   マークされたアカウントへの呼び出しは空のコードとして実行され、`EXTCODESIZE`/`EXTCODECOPY`/`EXTCODEHASH`は生のマーカーを参照します。

## 未解決の質問

1.  `0xef0200`は暫定的なものです。[[Frame-Transactions|EIP-8141]]の根拠では、将来のキーエイリアスに`0xef02`プレフィックスが議論されており、EIP-7851 / EIP-8164は隣接する`0xef0101`形式を使用しています。これにはどのプレフィックスを使用すべきでしょうか？
2.  制約された空リストのタイプ4形式を再利用する方が、専用のトランザクションタイプよりも望ましいでしょうか？
3.  `33500` [[gas|ガス]]（21000 + 12500）は、ベンチマークを待つとして、妥当な料金でしょうか？
4.  EIP-8151および、空のコードによってアカウントを分類するコントラクトやウォレットとの相互作用。

仕様とセキュリティフレームワークに関するフィードバックを歓迎します。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8476-permanent-eoa-delegation-opt-out/30134)
