---
title: 'ERC-8277: 永続的アイデンティティトークン (PIP)'
original_title: 'ERC-8277: Persistent Identity Token (PIP)'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8277-persistent-identity-token-pip/28641'
author: nftprof
date: '2026-05-27'
category: ERCs
tags:
  - ercs
  - eip
  - identity
  - applications
  - ux
  - smart-contracts
  - ai-agents
topic_id: '28641'
translated_at: '2026-06-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8277: Persistent Identity Token (PIP)](https://ethereum-magicians.org/t/erc-8277-persistent-identity-token-pip/28641) — nftprof (2026-05-27)

## 概要

この[[glossary/ERC|ERC]]は、人間が読めるオンチェーンアイデンティティをEVMアドレスにバインドする[[glossary/ERC-721|ERC-721]]トークンである**永続的アイデンティティトークン (Persistent Identity Token)** の標準インターフェースを提案します。この標準は、3つのインターフェース層を定義します。アイデンティティ（登録とバインディング）、解決（名前からアドレスへのルックアップ）、およびポリシー（ネームスペースのガバナンス (namespace governance)）です。

コアメカニズムは**バインド・トゥ・ロックモデル (bind-to-lock model)** です。トークンはバインドされていない間は自由に取引可能ですが、ユーザーがアイデンティティを自分のアドレスにバインドすると、[[glossary/Soulbound|ソウルバウンド]]になります。これにより、アクティブなアイデンティティが譲渡されるのを防ぎつつ、未請求の名前の[[glossary/Secondary-Market|セカンダリマーケット]]を可能にします。

**プルリクエスト (PR):** [ethereum/ERCs#1776](https://github.com/ethereum/ERCs/pull/1776)
**プロトコルリポジトリ (CC0):** [persistent-identity-protocol](https://github.com/blockchainsuperheroes/persistent-identity-protocol)
**リファレンス実装:** Pentagon Chain上のPEG ID (`0xf97EB9f8293D1FD5587a809Eb74518c300738d07`)（2,200以上のアイデンティティがミント済み）

## 問題

Web3にはウォレット所有権がありますが、標準化されたアイデンティティ層がありません。既存のアプローチはそれぞれ問題の一部を解決しています。

-   [[glossary/ENS|ENS]]は名前をアドレスに解決しますが、ログインシステム (login system) として設計されておらず、ライフサイクルガバナンス (lifecycle governance) を定義していません。また、人間だけでなく自律エージェント (autonomous agents) にも対応していません。
-   [[glossary/ERC-5192|ERC-5192 (SBT)]]はトークンを永続的に譲渡不可能にしますが、これにより名前の[[glossary/Secondary-Market|セカンダリマーケット]]が妨げられます。
-   Web2のユーザー名は人間が読めますが、プラットフォームによって管理され、ポータブルではなく、所有できません。

永続的アイデンティティ (persistent identity) を必要とするアプリケーション — キャラクターを持つゲーム、評判を持つソーシャルプラットフォーム、アドレス指定可能なAIエージェント — は現在、特注システム (bespoke systems) を構築しています。[[glossary/Composable|コンポーザブルな標準]]がありません。

## 3つのインターフェース層

この標準は、アイデンティティとポリシーを意図的に分離しています。

### 1. アイデンティティ層 (`IPersistentIdentity`)

-   名前登録: トークンごとに1つの名前、ネームスペース内でユニーク
-   アドレスバインディング: `bind(tokenId)` はトークンを `msg.sender` にロックし、[[glossary/Soulbound|ソウルバウンド]]にする
-   URLレコード: オンチェーン転送
-   ティア分類: 予約済み / 標準 / 基本（異なる取引可能性ルールを持つ）

```solidity
function nameRegistered(string calldata name) external view returns (bool);
function tokenOfName(string calldata name) external view returns (uint256);
function nameOf(uint256 tokenId) external view returns (string memory);
function boundAddress(uint256 tokenId) external view returns (address);
function bind(uint256 tokenId) external;
function setUrlRecord(uint256 tokenId, string calldata url) external;
```

### 2. 解決層 (`IPersistentIdentityResolver`)

```solidity
function resolveAddress(string calldata name) external view returns (address);
function resolveUrl(string calldata name) external view returns (string memory);
function resolveIdentity(string calldata name) external view returns (
    uint256 tokenId, address owner, address boundAddr, bool bound, string memory url, uint8 tier
);
```

### 3. ポリシー層 (`IPersistentIdentityPolicy`)

ガバナンス: 価格設定、名前変更、アンバインディング、予約済み名前リスト。アイデンティティから分離されているため、異なるネームスペースが同じコア標準を共有しながら異なるルールを適用できます。

## 主要な設計上の決定事項

**バインド・トゥ・ロック vs 永続的なSBT:** [[glossary/ERC-5192|ERC-5192]]とは異なり、トークンは譲渡可能として開始されます。それらはアクティブにバインドされた場合にのみ[[glossary/Soulbound|ソウルバウンド]]になります。これにより、アクティブなアイデンティティを保護しながら、名前が[[glossary/Secondary-Market|セカンダリマーケット]]で取引されることを可能にします。

**アイデンティティとポリシーの分離:** アイデンティティ層は固定です。ポリシー層はネームスペース固有です。異なるコミュニティがコアを変更することなく独自のポリシーを展開できます。

**エージェント互換 (Agent-compatible):** 人間ユーザーとAIエージェントは同じネームスペースと解決プリミティブを使用します。[[glossary/ERC-8170|ERC-8170 (AIネイティブNFT)]] および [[glossary/ERC-8171|ERC-8171 (トークンバウンドアカウントエージェントレジストリ)]] と連携するように設計されています。

**有効期限なし:** [[glossary/ENS|ENS]]のレンタルモデル (rental model) とは異なり、永続的アイデンティティは期限切れになりません。スパム耐性 (spam resistance) は、時間ベースの再請求ではなく、ポリシー層における経済的な価格設定から来ます。

## 互換性

-   **[[glossary/ERC-721|ERC-721]]:** PIPトークンは有効な[[glossary/ERC-721|ERC-721]]です。
-   **[[glossary/ERC-165|ERC-165]]:** 実装は `IPersistentIdentity` のサポートを登録します。
-   **[[glossary/ERC-5192|ERC-5192]]:** 関連するが異なる（条件付き vs 永続的な譲渡不可能性）。
-   **[[glossary/ERC-6551|ERC-6551]]:** 補完的 — アイデンティティはトークンバウンドアカウント (Token Bound Accounts) を持つことができます。
-   **[[glossary/ENS|ENS]]:** 共存可能。PIPはアイデンティティ/ユーザー名層で動作し、DNS層ではありません。

## 未解決の疑問

1.  この標準は、標準的な名前正規化ルール (canonical name normalization rule)（例: 小文字のみ）を定義すべきか、それともポリシー層に任せるべきか？
2.  3層システム (three-tier system)（予約済み/標準/基本）は、プロトコルレベルの標準としては意見が強すぎるか、それとも標準化するのに有用か？
3.  クロスチェーン解決 (cross-chain resolution) は指定されるべきか、それとも別個の拡張[[glossary/ERC|ERC]]によって処理されるべきか？

コミュニティからのフィードバックを楽しみにしています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8277-persistent-identity-token-pip/28641)
