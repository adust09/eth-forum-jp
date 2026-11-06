---
title: 推論プログラム（AI評価型コントラクト）のためのERCはイーサリアムで実現可能か？
original_title: >-
  Would an ERC for inference programs (AI-evaluated contracts) be feasible on
  Ethereum?
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/would-an-erc-for-inference-programs-ai-evaluated-contracts-be-feasible-on-ethereum/30291
author: rexsaurus
date: '2026-11-05'
category: Primordial Soup
tags:
  - primordial-soup
  - applications
  - smart-contracts
  - ai-agents
  - zk
  - protocol-design
  - research
  - inference-programs
topic_id: '30291'
translated_at: '2026-11-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Would an ERC for inference programs (AI-evaluated contracts) be feasible on Ethereum?](https://ethereum-magicians.org/t/would-an-erc-for-inference-programs-ai-evaluated-contracts-be-feasible-on-ethereum/30291) — rexsaurus (2026-11-05)

皆さん、こんにちは。最近、Solana SIMDリポジトリで、「推論プログラム (inference programs)」または「「実際にスマートなコントラクト (Actually Smart Contracts)」」と大まかに呼んでいる新しいクラスのスマートコントラクトについて議論を開始しました。この提案について何かを記述する前に、イーサリアムでも同様の提案が実現可能かどうかについて、このコミュニティからの技術的なご意見を伺いたく思います。

簡単に言うと、そのアイデアはこうです。コントラクトがプロンプトとそれを形成するルール（DAOの憲法、ポリシー、標準など）を格納します。別のコントラクトが証拠付きで質問を投げかけます。異なる[[glossary/Operator|オペレーター]]からのAIモデルがオフチェーンで回答し、それぞれが投票に署名し、呼び出し元は行動する前に署名された結果をチェックします。この動機となったのは、Anthropicによる[LLM推論のゼロ知識証明](https://www.anthropic.com/research/provable-inference)に関する最近の取り組みです。

Solanaのドラフトとこれまでの議論は以下の通りです。

-   概要とドラフト: [Solanaへの推論プログラム導入](https://blog.verafy.ai/articles/20261105-simd-verifiable-inference)
-   図とサンドボックスを含むマイクロサイト: [asc.verafy.ai](https://asc.verafy.ai)
-   議論: [solana-improvement-documents #724](https://github.com/solana-foundation/solana-improvement-documents/discussions/724)

これが技術的に実現可能かどうかについては強い見解を持っておらず、オプティミスティックオラクル (optimistic oracles) やopML (opML) など、私たちが考慮に入れていない先行研究が多数あることも承知しています。ドラフトはAIツールの助けを借りて書かれたため、一部に不十分な推論があるかもしれません。

特にご協力いただきたい質問は以下の通りです。

1.  これはアプリケーションレベルの[[glossary/ERC|Ethereum Request for Comments (ERC)]]として適しているか、それとも全く標準 (standard) としない方が良いか？
2.  推論の証明 (Proofs of inference) は現在、オンチェーンで検証するには大きすぎます（それぞれ約18.78 MB）。コミット、ボンド、チャレンジの設計 (commit, bond and challenge design) がイーサリアムにおける現実的な道筋でしょうか、それともより良い方法があるでしょうか？
3.  どのような既存の取り組み (existing work) を基盤とすべきか、あるいは代わりに参照すべきか？

何かご指摘いただければ幸いです。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/would-an-erc-for-inference-programs-ai-evaluated-contracts-be-feasible-on-ethereum/30291)
