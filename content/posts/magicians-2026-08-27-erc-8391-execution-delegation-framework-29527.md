---
title: 'ERC-8391: 実行委任フレームワーク'
original_title: 'ERC-8391: Execution Delegation Framework'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8391-execution-delegation-framework/29527'
author: dgusakov
date: '2026-08-27'
category: ERCs
tags:
  - ercs
  - smart-contracts
  - security
  - account-abstraction
  - eip
  - protocol-design
topic_id: '29527'
translated_at: '2026-08-29'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8391: Execution Delegation Framework](https://ethereum-magicians.org/t/erc-8391-execution-delegation-framework/29527) — dgusakov (2026-08-27)

### ERC-8391に関する議論トピック

概要

ERC-8391は、オンチェーンの実行権限をローテーション可能な運用キーに委任するための標準コントラクトインターフェースを定義します。インテグレーターは委任コントラクトに一度承認を与えるだけで、その所有者（理想的にはコールドウォレット (cold wallet) または[[glossary/Multisig|マルチシグ（マルチシグネチャ）]]）は、インテグレーターのさらなる関与なしに、アクティブなホットキー (hot key) を割り当て、ローテーションし、または即座に取り消すことができます。これは、`execute()` を介した直接実行と、[ERC-1271](https://eips.ethereum.org/EIPS/eip-1271) を介したリレー署名検証の両方をサポートします。

### 動機

運用ホットキー (hot key) は頻繁に侵害の危険にさらされますが、そのローテーションには、権限を付与したプロトコルとの時間のかかる、またはコストのかかる調整が必要となることがよくあります。ERC-8391は、永続的なオンチェーン (on-chain) 権限と、それを実行する一時的なキーを分離することで、統合プロトコルを変更することなく、定期的なキーローテーション、迅速なインシデント対応、一貫した監視、および将来の署名スキーム (signature-scheme) のアップグレードを可能にします。

#### 更新ログ

-   2026-08-22: 初版ドラフト - [ERCの追加: 実行委任フレームワーク by F4ever · Pull Request #1962 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/1962)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8391-execution-delegation-framework/29527)
