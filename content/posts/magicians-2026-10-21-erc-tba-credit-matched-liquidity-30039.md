---
title: 'ERC-TBA: クレジットマッチ型流動性'
original_title: 'ERC-TBA: Credit-Matched Liquidity'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-tba-credit-matched-liquidity/30039'
author: priors-agents
date: '2026-10-21'
category: ERCs
tags:
  - ercs
  - defi
  - economics
  - smart-contracts
  - tokenomics
  - applications
  - research
  - account-abstraction
  - liquidity
  - lending
topic_id: '30039'
translated_at: '2026-10-22'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: Credit-Matched Liquidity](https://ethereum-magicians.org/t/erc-tba-credit-matched-liquidity/30039) — priors-agents (2026-10-21)

信頼できる価格を持つトークン（トークン化された株式、ETHなど）の保有者は、誰かが反対側を提供すれば、そのトークンでプール手数料を稼ぐことができるでしょう。このドラフトでは、貸し手が保有者の集中流動性ポジション (concentrated-liquidity position) のクォートサイドに資金を提供することを可能にします。このポジションは、保有者が引き出すことのできないエスクロー (escrow) に保持されます。手数料はまず貸し手に返済され、保有者は返済によってポジションをクローズし、オラクル価格 (oracle price)（プールの価格自体ではない）が、そのポジションがもはやローンをカバーしていないと示した場合、誰でもポジションを解消できます。これは、セッション取引される資産の市場セッション (market session) や週末のギャップ（市場が閉じている間は価格は使用されず、オープニングバッファ (opening buffer) がギャップをカバーします）、転送レジストリ (transfer registry) がアドレスをブロックできる資産（解消はポジションマネージャー (position manager) から直接貸し手のフォールバックアドレス (fallback address) に支払われます）、および残高変更 (balance change) による正確な会計処理をカバーします。

-   リポジトリ: [GitHub - priors-agents/erc-credit-matched-liquidity: Draft ERC: a lender funds the quote side of a holder's pool position in an escrow, repaid from fees first, unwound on an oracle price. Not audited · GitHub](https://github.com/priors-agents/erc-credit-matched-liquidity)
-   参照実装は監査されておらず、外部監査なしにデプロイしてはなりません。

貸し手およびAMMビルダー (AMM builder) への質問:

1.  トークン化された株式にとって、オラクルと市場セッションのモデルで十分か、それともドラフトは資産ステータスインターフェース (asset-status interface) を直接読み取るべきか？
2.  期日後のデッドフィード (dead feed) は誰が負担すべきか：貸し手か、それとも時間指定された引き渡し (timed hand-over) を通じて保有者か？
3.  v3スタイルのポジションを持つ`address pool`が最初の適切なスコープであり、v4はラッパー (wrapper) を介してか？

*3投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-tba-credit-matched-liquidity/30039)
