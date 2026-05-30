---
title: 'ERC-8276: 非代替性マルチトークン ownerOf (ERC-1155F / ERC-6909F)'
original_title: 'ERC-8276: Non-Fungible Multi-Token ownerOf (ERC-1155F / ERC-6909F)'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8276-non-fungible-multi-token-ownerof-erc-1155f-erc-6909f/28646
author: nxt3d
date: '2026-05-28'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - applications
  - ux
  - token-standards
topic_id: '28646'
translated_at: '2026-05-30'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8276: Non-Fungible Multi-Token ownerOf (ERC-1155F / ERC-6909F)](https://ethereum-magicians.org/t/erc-8276-non-fungible-multi-token-ownerof-erc-1155f-erc-6909f/28646) — nxt3d (2026-05-28)

このドラフト標準は、非代替性 ERC-1155 および ERC-6909 トークンID（供給量が1に固定されているID）に対する、標準的な `ownerOf(uint256)` 読み取りを標準化します。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1767)

#### [ERCを追加: 非代替性マルチトークン ownerOf](https://github.com/ethereum/ERCs/pull/1767)

`master` ← `nxt3d:erc-nft-ownerof-1155-6909`

公開日 2026年5月24日 0:23 UTC

 [![nxt3dのアバター](https://avatars.githubusercontent.com/u/3857985?v=4) nxt3d](https://github.com/nxt3d)

[+90 -0](https://github.com/ethereum/ERCs/pull/1767/files)

## 概要
非代替性 ERC-1155 および ERC-6909 トークンID（IDあたりの供給量が0または1）に対する、標準的な `ownerOf(uint256 id)` アクセサーを提案する新しい[[EIP|ERC]]です。これは ERC-721 の `ownerOf` セレクター（ERC-165 インターフェースID `0x6352211e`）を再利用します。これにより、単一所有者向けのツール — ウォレット、マーケットプレイス、委任レジストリ、インデクサー、およびエージェントバインディング統合 — が、契約ごとに特注のアダプターを必要とせず、単一のアクセサーを通じてマルチトークンNFTを読み取れるようになります。この提案は、停滞している ERC-5409（ERC-1155 用の `ownerOf`）を一般化し、同じセレクターと ERC-165 識別子を維持しつつ、ERC-6909 のサポートを追加し、供給量と残高の不変条件を明確にします。本番環境での先行事例として、ENS NameWrapper（`ownerOf` を公開する単一ユニット ERC-1155）があります。番号が割り当てられ次第、`discussions-to` は Ethereum Magicians のスレッドで更新されます。

ERC-1155 と ERC-6909 は `(owner, id)` によって残高を公開しますが、どちらもNFTのように振る舞うIDに対する単一所有者アクセサーを提供していません。すでに `ownerOf(uint256)` を介して ERC-721 の所有権を理解しているツールは、現在、これらのIDに対して特注のアダプターを必要としています。この提案は、ERC-721 の関数セレクターと ERC-165 インターフェース識別子 (`0x6352211e`) をそのまま再利用することで、ウォレット、マーケットプレイス、委任レジストリ、インデクサー、およびトークンバウンド/エージェントバインディング統合が、契約が ERC-721 を実装していなくても、単一の制御アカウントを解決できるようにします。

このパターンはすでに本番環境で稼働しています。ENS NameWrapper は、ラップされた名前（単一ユニットの ERC-1155 ID）に対して `ownerOf(uint256)` を公開しています。このドラフトは、停滞している ERC-5409 を一般化して ERC-6909 もカバーし、`ownerOf`、供給量、および残高の関係を明確にします。実装は非公式に ERC-1155F / ERC-6909F と呼ばれています。

```
interface IERC_NFMultiTokenOwnerOf {
function ownerOf(uint256 id) external view returns (address owner);
}
```

主なルール: 各トークンIDの総供給量は0または1です。`ownerOf(id)` は、所有者（正確に1つを保持している必要があります）を返すか、未所有の場合（ミント前またはバーン後）には `address(0)` を返し、リバートはしません。

フィードバックを歓迎します！

*1件の投稿 - 1人の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8276-non-fungible-multi-token-ownerof-erc-1155f-erc-6909f/28646)
