---
title: ERC-8004のためのソーストークンエージェントバインディング
original_title: Source-Token Agent Binding for ERC-8004
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/source-token-agent-binding-for-erc-8004/28920'
author: babyblueviper1
date: '2026-07-03'
category: ERCs
tags:
  - ercs
  - erc
  - nft
  - identity
  - smart-contracts
  - account-abstraction
  - applications
  - research
topic_id: '28920'
translated_at: '2026-07-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Source-Token Agent Binding for ERC-8004](https://ethereum-magicians.org/t/source-token-agent-binding-for-erc-8004/28920) — babyblueviper1 (2026-07-03)

**ERC-8004のためのソーストークンエージェントバインディング** — [[ERC-8217|ERC-8217]] (エージェントNFTアイデンティティバインディング、[@nxt3d](https://ethereum-magicians.org/u/nxt3d)) の付随文書。[@TMerlini](https://ethereum-magicians.org/u/tmerlini) との共著。

**ギャップ。** [[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]は、エージェントが新しくミントされることを前提としています。しかし実際には、最も自然なエージェントは、人々がすでに保有しているNFT（PFP、メンバーシップトークン、ゲームキャラクターなど）から派生します。既存の標準は、分離しておくべき2つの事実を混同しています。*エージェントがどのトークンから派生したか*（不変であるべき — 永続的な来歴 (permanent provenance)）と、*現在のエージェント所有者がそのトークンをまだ所有しているか*（ライブで再チェック可能であるべき — 可変）。この標準は、その境界を明確に引きます。前者のためには `getSourceNFT` を、後者のためには `isSourceNFTOwnershipValid` を使用します。

**リファレンス実装はイーサリアムの[[mainnet|メインネット]]で稼働中**であり、仮説ではありません — `dinamic.eth` はこのスタックを通じて解決され、その分離は `eth_call` を介して直接観測可能です。投稿前に独立して検証済み（数値を鵜呑みにしていません）：

```
Pixel Goblins registry: 0xe0454dFA17a57a84c3E0E2DBFdA5318CBBE91e2c

agent #1:  getSourceNFT(1)  -> (0x6559807F..., 85)   isSourceNFTOwnershipValid(1)  -> true
agent #14: getSourceNFT(14) -> (0x6559807F..., 577)  isSourceNFTOwnershipValid(14) -> false
```

エージェント#14の来歴 (provenance) は永続的であり（引き続きGoblin #577に解決されます）、しかしソーストークンはその後所有者が変わったため、ライブチェックは正しくfalseを報告します — 不変の事実と可変の事実が独立して報告され、これが `ownerOf` のように混同された単一のビューではなく、別々のビューとして保持する目的そのものです。

ERC-165インターフェースID `0x27eba962` は、5つの関数セレクターのXORであり、独立して再計算され、一致することが確認されています。完全に準拠したリファレンスインスタンスがSepolia (`0x01B014fc69d823FfEb80C313C29Bb6ead3978CEe`) にデプロイされており、`supportsInterface(0x27eba962) == true` をアドバタイズしています。これは、[[mainnet|メインネット]]のレジストリが最終化されたインターフェースIDより前に存在し、機能的表面 (functional surface) のみを実装しているため、ゼロから準拠したデプロイメントに対してテストしたい人向けです。

`isSourceNFTOwnershipValid` の主権ケース（エージェント所有者だけでなく、ソーストークンを保有するERC-6551 [[Token-Bound-Account|トークンバウンドアカウント (TBA)]]）は、インターフェースドキュメントに正確に記述されています — 単純な `ownerOf(sourceToken) == ownerOf(agentId)` チェックは、TBAカストディパターンを強制的に失敗させるため、非準拠です。

完全な仕様 + インターフェース: [Source-Token Agent Binding — live-ownership view + consumer requirements, additive to ERC-8217 (Agent NFT Identity Bindings). Authors: TMerlini, babyblueviper1. TBA sovereignty case: cody. · GitHub](https://gist.github.com/TMerlini/9ed302623a534381b90acd185c871a11)

これは、[Agent-Service Consultation Flow composition note](https://ethereum-magicians.org/t/composition-note-agent-service-consultation-flow-composing-the-agent-ercs-8004-8263-8274-8275-8281-8299-8301-informational/28833) のアイデンティティ層です — ライブ所有権の再チェックは、下流の裁定と決済が依存する前提ですが、ここでのインターフェースはそれ自体で独立しており、その構成のいずれにも依存しません。特に主権/TBAカストディの枠組みに関するフィードバックを歓迎します。

*2件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/source-token-agent-binding-for-erc-8004/28920)
