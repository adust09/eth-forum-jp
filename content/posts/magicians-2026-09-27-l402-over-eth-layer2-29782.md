---
title: L402-over-eth-Layer2
original_title: L402-over-eth-Layer2
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/l402-over-eth-layer2/29782'
author: ddorigoddorigo
date: '2026-09-27'
category: Uncategorized
tags:
  - scaling
  - payments
  - account-abstraction
  - eip
  - smart-contracts
  - research
  - networking
  - defi
topic_id: '29782'
translated_at: '2026-09-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [L402-over-eth-Layer2](https://ethereum-magicians.org/t/l402-over-eth-layer2/29782) — ddorigoddorigo (2026-09-27)

マジシャンズの皆さん、

[[glossary/Layer-2|レイヤー2]]上でのL402（x402ラップドBTC）に関する新しいトピックを立てました。

現在、これに取り組んでいます（LLMを使っているからといって、私が何も考えていないわけではありません！）。

小さなプロジェクトを共有し、支払いチャネル、[[glossary/EIP-712|EIP-712]]、[[glossary/Account-Abstraction|アカウント抽象化]]について私よりもはるかに詳しい方々からフィードバックをいただきたいと思っています。

## 目的

私はエージェントオーケストレーター向けのLLMプロバイダーである[LightPhon](https://lightphon.com)を運営しており、通常のサブスクリプション/API競合他社よりもはるかに低い従量課金制を提供しています。ビットコインでは、エージェントはL402パターン（HTTP 402チャレンジ → 支払い → マカルーンと支払い証明で再試行）を使用して、Lightningネットワーク経由でマシン間での支払いを行っています。

**イーサリアムでも同じもの**が必要でした。多くのエージェントビルダーは[[glossary/EVM|EVM（イーサリアム仮想マシン）]]の世界に住んでおり、Lightningノードを運用したくない人には別の選択肢が必要です。

しかし、Lightningネットワークと同じ制約があります。1日に何千回もツールを呼び出すエージェントは、呼び出しごとにトランザクションを送信することはできません。[[glossary/gas|ガス]]代がサービス料金よりも高くなり、各リクエストに約1〜2秒の遅延が追加されてしまいます。

## 方法

**L402-EL2**はL402のワイヤーフォーマットを維持し（既存のパーサーが引き続き機能するように）、Lightningインボイス/プリイメージを[[glossary/Layer-2|レイヤー2]]上の**単方向支払いチャネル**に置き換えます。

-   **エスクローコントラクト** (`L402Escrow.sol`): エージェントはプロバイダーに対して事前資金提供されたチャネルを開設します（1回のL2トランザクション）。`channelId = keccak256(abi.encode(payer, provider, token))`であるため、オフラインで計算できます。
-   支払い証明としての**累積[[glossary/EIP-712|EIP-712]]バウチャー**: `Voucher(channelId, cumulativeAmount, nonce, validUntil)`。各呼び出しは新しい*合計*に署名するため、リプレイ攻撃はなく、サーバーはチャネルごとに1行を保持し、検証はインメモリの署名チェック（約数ミリ秒、RPCなし）で行われます。
-   HTTPクレデンシャルとしての**マカルーン**: 注意事項（`tool`、`max_cumulative`、`expires_at`など）、フェイルクローズ評価、および減衰により、エージェントはより狭いトークンをサブエージェントに渡すことができます。
-   **オンチェーンセッションキー**: `authorizeSigner(key, maxCumulative, validUntil)`は、コントラクト内に支出上限を設定し、クライアント側には設定しません。取り消し/引き締めは、チャネルクローズと同じ24時間のチャレンジ期間を尊重するため、既に提供されたバウチャーを無効にするために使用することはできません。
-   **バッチ決済**: セトラーは、多くのチャネルの最新のバウチャーを1回の`settleBatch()`で収集します。
-   [[glossary/EOA|EOA（Externally Owned Account）]]およびERC-4337アカウント（[[glossary/ERC-1271|ERC-1271]]検証）と連携し、さらに[[glossary/ERC-2612|ERC-2612]]/ERC-3009の単一署名デポジットもサポートします。
-   **MCP統合**: `initialize`/`tools/list`は発見のために無料で維持され、`tools/call`、`resources/read`、`prompts/get`のみが課金されます。

正味の効果：呼び出しごとに1回のオンチェーントランザクションではなく、チャネルライフサイクルごとに2回のオンチェーントランザクション（開設 + 決済）、およびリクエストあたりの支払いオーバーヘッドは10ミリ秒未満です。トークンは任意のERC-20であり、Lightning側と同じ額面を維持するためにラップドBTC（cbBTC/WBTC/tBTC）を使用しています。

リポジトリには、コントラクト（ノード + [[glossary/Foundry|Foundry]]テスト、[[glossary/fuzzing|ファジング]]を含む）、TypeScriptのサーバー/クライアント/セトラーパッケージ、プロトコル仕様、および設定なしでインプロセス[[glossary/EVM|EVM（イーサリアム仮想マシン）]]上で実行されるエンドツーエンドの例が含まれています。

リポジトリ: [GitHub - ddorigoddorigo/L402-over-eth-L2: a protocol for token net payments (like L402) for stablecoin instead of Lightning net · GitHub](https://github.com/ddorigoddorigo/L402-over-eth-L2)

**監査済みではありません — まだ実際の資金で使用しないでください。**

## フィードバックを歓迎します。問題を見つければ見つけるほど、私が学ぶことができます…

読んでいただきありがとうございます。ご質問があれば喜んでお答えします。

*開示: 私はLightPhonの創設者であり、これが私がこれを構築した理由であり、将来的に使用する予定です。*

追伸 私はここが初めてです。サイトはこちら: [https://www.l402-over-eth-l2.com/](https://www.l402-over-eth-l2.com/)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/l402-over-eth-layer2/29782)
