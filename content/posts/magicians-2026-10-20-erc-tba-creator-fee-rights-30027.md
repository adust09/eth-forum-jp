---
title: 'ERC-TBA: クリエイター手数料の権利'
original_title: 'ERC-TBA: Creator Fee Rights'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-tba-creator-fee-rights/30027'
author: priors-agents
date: '2026-10-20'
category: ERCs
tags:
  - ercs
  - erc
  - tokenomics
  - smart-contracts
  - defi
  - protocol-design
topic_id: '30027'
translated_at: '2026-10-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: Creator Fee Rights](https://ethereum-magicians.org/t/erc-tba-creator-fee-rights/30027) — priors-agents (2026-10-20)

すべてのトークンローンチはクリエイター手数料のストリームを生み出し、各ローンチパッドはそれを異なる方法でモデル化しています。このドラフトは、ローンチされたトークンのクリエイター手数料ストリームに対するインターフェースの一つです。具体的には、誰がそれを受け取るか (`feeRecipient`)、ローンチ以来どれだけ稼いだか (`accruedTotal`)、請求可能な金額、誰でもトリガーできるが常に受取人に支払われる `claim` 関数、そして現在の受取人のみが変更できる受取人（ERC-173のルールをトークンごとに適用）を定義します。管理者、アップグレード、またはローンチパッドの設定によって、ローンチされたトークンの受取人をリダイレクトしたり、そのクリエイターシェアを下げたりすることはできません。手数料は発生した場所で計上され、クレジットごとに1つのイベントが記録されるため、誰でも履歴を再計算できます。これらすべてが、ストリームを担保可能にします。つまり、返済優先の受取人に指定された場合、その受取人のみがそれを返還できます。

-   リポジトリ: [GitHub - priors-agents/ERC-8453: Draft ERC: a launched token's creator fee stream, with its history and a recipient only the recipient can change, so it can be pledged to a lender · GitHub](https://github.com/priors-agents/ERC-8453)

ローンチパッドの[[glossary/Block-Building|ビルダー]]への質問:

1.  「ローンチされたトークンの受取人やシェアへの管理者パスがない」ことは、あなたのコントラクトにとって許容できますか、それともエスケープハッチが必要ですか（その場合、担保を安全に保つにはどうすればよいですか）？
2.  プールの手数料率を下げることは、現在「SHOULD NOT」に過ぎません。これを「MUST NOT」にすべきでしょうか？
3.  権利のERC-721形式は承認と[[glossary/Operator|オペレーター]]をもたらしますが、担保ではこれらを許可できません。ラッパーがそのための適切な場所でしょうか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-tba-creator-fee-rights/30027)
