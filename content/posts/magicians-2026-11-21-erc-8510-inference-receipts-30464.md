---
title: 'ERC-8510: 推論レシート'
original_title: 'ERC-8510: Inference Receipts'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8510-inference-receipts/30464'
author: kurosato
date: '2026-11-21'
category: ERCs
tags:
  - ercs
  - eip
  - applications
  - ai-agents
  - smart-contracts
  - economics
  - verification
  - research
  - inference-receipts
topic_id: '30464'
translated_at: '2026-11-22'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8510: Inference Receipts](https://ethereum-magicians.org/t/erc-8510-inference-receipts/30464) — kurosato (2026-11-21)

モデルエンドポイントに呼び出しごとに料金を支払う[[AI-agents|エージェント]]は、その支払いがオンチェーンで決済されるため、支払ったことを証明できます。しかし、その支払いが何を購入したのか、あるいは後でエンドポイントの1日の記録が実際に行った呼び出しと一致するかどうかを確認することはできません。このドラフトは、支払い済みの呼び出しごとに署名付きレシートと、それらのレシートに対する日次[[Merkle-root|Merkleルート]]を定義し、これらをオンチェーンで公開します。

ドラフト: [erc-draft\_inference\_receipts.md](https://github.com/kurokawasato/ERCs/blob/add-erc-inference-receipts/ERCS/erc-draft_inference_receipts.md)。このスレッドが存在し次第、ethereum/ERCsへのプルリクエストが続きます。ドラフトがこれを議論として指定しているためです。

各レシートは、固定されたメンバー順序を持つJSONオブジェクトです。これには、リクエストとレスポンスのハッシュ、モデル、カウントされたトークン、[[ERC-20|ERC-20]]資産での価格、支払い者、およびその決済を行った支払いが含まれます。エンドポイントは、その[[keccak256-hash|Keccak-256ハッシュ]]を[[ERC-191|ERC-191]]メッセージとして署名します。リクエストとレスポンスのボディはエンドポイントから離れることはなく、そのハッシュのみがレシートに含まれます。

エンドポイントは、各UTC日のレシートを署名された順序で保持し、OpenZeppelinのMerkleProofがチェックする方法で構築された、それらのハッシュに対する[[Merkle-root|Merkleルート]]を持つ日次リストとして提供します。その日が終了すると、日付、カウント、およびルートを含む1つのレコードをオンチェーンのログに公開します。レシートを保持する支払い者は、エンドポイントがその日に呼び出しをカウントしたことを示すことができ、公開されたルートに含まれない署名付きレシートは、エンドポイントが呼び出しを省略した証拠となります。コストは、ボリュームに関わらず1日1トランザクションです。

[参照コード](https://github.com/kurokawasato/ERCs/tree/add-erc-inference-receipts/assets/eip-draft_inference_receipts)はドラフトに付属しており、依存関係はありません。これには、正規形式、署名チェック、日次ルート、インクルージョン証明、テストキーからのテストベクトル、およびその日に公開されたルートとハッシュが一致する実際のレシート1つが含まれます。

支払いスキームは範囲外です。レシートは、支払いをそのnonceで指定するため、[[x402|x402]]の`exact`および`upto`スキーム、ならびに[[EIP-3009|EIP-3009]]転送と連携します。

開示：私はBrainChainに勤務しており、その推論ゲートウェイは[[x402|x402]]を介して支払われた呼び出しに対してこれらのレシートを発行し、終了した各日のルートをBrainChainに公開しています。

レビューアへの3つの質問：

1.  このドラフトでは、レスポンスヘッダーを`Inference-Receipt`と名付けています。ヘッダーは適切な伝達手段でしょうか、それともレシートはレスポンスボディで伝達されるべきでしょうか？
2.  読み手は、日次レコードに対してどの発行者アカウントを受け入れるかを決定します。この標準は、エンドポイントがそのアカウントを、例えば[[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]登録で宣言することを要求すべきでしょうか？
3.  日次レコードは汎用的なログイベントです。型付きイベントを持つ小さなレジストリコントラクトの方が、読み手にとってより良いでしょうか？

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8510-inference-receipts/30464)
