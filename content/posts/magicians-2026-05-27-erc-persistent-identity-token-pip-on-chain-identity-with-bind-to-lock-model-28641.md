---
title: 'ERC: 永続的アイデンティティトークン (PIP) - バインド・トゥ・ロックモデルによるオンチェーンID'
original_title: >-
  ERC: Persistent Identity Token (PIP) - On-chain identity with bind-to-lock
  model
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-persistent-identity-token-pip-on-chain-identity-with-bind-to-lock-model/28641
author: nftprof
date: '2026-05-27'
category: ERCs
tags:
  - ercs
  - applications
  - identity
  - smart-contracts
  - eip
  - ux
  - tokenomics
topic_id: '28641'
translated_at: '2026-05-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC: Persistent Identity Token (PIP) - On-chain identity with bind-to-lock model](https://ethereum-magicians.org/t/erc-persistent-identity-token-pip-on-chain-identity-with-bind-to-lock-model/28641) — nftprof (2026-05-27)

## 概要

このERCは、**永続的アイデンティティトークン (Persistent Identity Tokens)** の標準インターフェースを提案します。これは、EVMアドレスにバインドされた、人間が読めるオンチェーンIDを表すERC-721トークンです。この標準は、アイデンティティ（登録とバインディング）、解決（名前からアドレスへのルックアップ）、およびポリシー（ネームスペースのガバナンス）の3つのインターフェース層を定義します。

コアメカニズムは**バインド・トゥ・ロック (bind-to-lock)** モデルです。トークンはアンバウンド（未バインド）状態では自由に取引可能ですが、ユーザーがそのアイデンティティを自身のアドレスにバインドすると、ソウルバウンド (soulbound) になります。これにより、アクティブなアイデンティティが転送されるのを防ぎつつ、未請求の名前の二次市場を可能にします。

**PR:** [ethereum/ERCs#1776](https://github.com/ethereum/ERCs/pull/1776)
**プロトコルリポジトリ (CC0):** [persistent-identity-protocol](https://github.com/blockchainsuperheroes/persistent-identity-protocol)
**リファレンス実装:** Pentagon Chain上のPEG ID (`0xf97EB9f8293D1FD5587a809Eb74518c300738d07`)（2,200以上のIDがミント済み）

## 問題

Web3にはウォレットの所有権はありますが、標準化されたアイデンティティ層がありません。既存のアプローチはそれぞれ問題の一部を解決しています。

-   **ENS**は名前をアドレスに解決しますが、ログインシステムとして設計されたものではなく、ライフサイクルガバナンスを定義しておらず、人間だけでなく自律エージェントにも対応していません。
-   **ERC-5192 (SBT)** はトークンを永続的に譲渡不能にするため、名前の二次市場を妨げます。
-   **Web2のユーザー名**は人間が読めますが、プラットフォームによって制御され、ポータブルではなく、所有できません。

永続的なアイデンティティを必要とするアプリケーション（キャラクターを持つゲーム、評判を持つソーシャルプラットフォーム、アドレス指定可能なAIエージェントなど）は、現在、独自のシステムを構築しています。構成可能な標準が存在しないのです。

## 3つのインターフェース層

この標準は、アイデンティティとポリシーを意図的に分離しています。

### 1. アイデンティティ層 (`IPersistentIdentity`)

-   名前登録: ネームスペース内で一意な、トークンごとに1つの名前
-   アドレスバインディング: `bind(tokenId)` はトークンを `msg.sender` にロックし、ソウルバウンドにします。
-   URLレコード: オンチェーン転送
-   ティア分類: 予約済み (Reserved) / 標準 (Standard) / 基本 (Basic) で異なる取引可能性ルール

```
function nameRegistered(string calldata name) external view returns (bool);
function tokenOfName(string calldata name) external view returns (uint256);
function nameOf(uint256 tokenId) external view returns (string memory);
function boundAddress(uint256 tokenId) external view returns (address);
function bind(uint256 tokenId) external;
function setUrlRecord(uint256 tokenId, string calldata url) external;
```

### 2. 解決層 (`IPersistentIdentityResolver`)

```
function resolveAddress(string calldata name) external view returns (address);
function resolveUrl(string calldata name) external view returns (string memory);
function resolveIdentity(string calldata name) external view returns (
    uint256 tokenId, address owner, address boundAddr, bool bound, string memory url, uint8 tier
);
```

### 3. ポリシー層 (`IPersistentIdentityPolicy`)

ガバナンス: 価格設定、名前変更、アンバインディング、予約名リスト。アイデンティティから分離されているため、異なるネームスペースが同じコア標準を共有しながら異なるルールを適用できます。

## 主要な設計上の決定事項

**バインド・トゥ・ロック vs 永続的なSBT:** ERC-5192とは異なり、トークンは最初は譲渡可能です。アクティブにバインドされた場合にのみソウルバウンドになります。これにより、名前が二次市場で取引されることを可能にしつつ、アクティブなアイデンティティを保護します。

**アイデンティティとポリシーの分離:** アイデンティティ層は固定されています。ポリシー層はネームスペース固有です。異なるコミュニティは、コアを変更することなく独自のポリシーを展開できます。

**エージェント互換性:** 人間ユーザーとAIエージェントは同じネームスペースと解決プリミティブを使用します。ERC-8170 (AI-Native NFT) およびERC-8171 (Token Bound Account Agent Registry) と連携するように設計されています。

**有効期限なし:** ENSのレンタルモデルとは異なり、永続的なアイデンティティには有効期限がありません。スパム耐性は、ポリシー層における経済的な価格設定によってもたらされ、時間ベースの再請求ではありません。

## 互換性

-   **ERC-721:** PIPトークンは有効なERC-721です。
-   **ERC-165:** 実装は `IPersistentIdentity` のサポートを登録します。
-   **ERC-5192:** 関連していますが、異なります（条件付きと永続的な譲渡不能性）。
-   **ERC-6551:** 補完的です — アイデンティティはトークンバウンドアカウント (Token Bound Accounts) を持つことができます。
-   **ENS:** 共存可能です。PIPはDNS層ではなく、アイデンティティ/ユーザー名層で動作します。

## 未解決の質問

1.  この標準は、標準的な名前正規化ルール（例: 小文字のみ）を定義すべきでしょうか、それともポリシー層に任せるべきでしょうか？
2.  3層システム（予約済み/標準/基本）は、プロトコルレベルの標準としては意見が分かれすぎるでしょうか、それとも標準化するのに有用でしょうか？
3.  クロスチェーン解決は指定されるべきでしょうか、それとも別の拡張ERCによって処理されるべきでしょうか？

コミュニティからのフィードバックを楽しみにしています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-persistent-identity-token-pip-on-chain-identity-with-bind-to-lock-model/28641)
