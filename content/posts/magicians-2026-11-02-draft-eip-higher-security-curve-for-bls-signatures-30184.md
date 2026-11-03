---
title: 'ドラフトEIP: BLS署名のための高セキュリティ曲線'
original_title: 'Draft EIP: Higher-Security Curve for BLS Signatures'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-eip-higher-security-curve-for-bls-signatures/30184
author: sauliusgrigaitis
date: '2026-11-02'
category: EIPs core
tags:
  - eips-core
  - cryptography
  - consensus
  - eip
  - signatures
  - post-quantum
  - security
  - validators
  - protocol-design
topic_id: '30184'
translated_at: '2026-11-03'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Draft EIP: Higher-Security Curve for BLS Signatures](https://ethereum-magicians.org/t/draft-eip-higher-security-curve-for-bls-signatures/30184) — sauliusgrigaitis (2026-11-02)

**カテゴリ:** [[EIP|EIP]]（コアサブカテゴリ）

**タイトル:** ドラフト[[EIP|EIP]]: BLS署名のための高セキュリティ曲線

* * *

ドラフト[[EIP|EIP]]に関する議論トピック。まだ番号やPRはありません: [ドラフト](https://gist.github.com/sauliusgrigaitis/6f833d88d91940e0ea64f1cd43ee5842)。

このドラフトは、最もセキュリティ上重要な[[Consensus-Layer|コンセンサス層]]のBLS署名をBLS12-381からより高セキュリティなペアリングフレンドリー曲線（現在の候補はBLS48-581）へ移行する方法を規定しています。[[RANDAO|RANDAO]]の開示、選択証明、およびアグリゲーター署名はBLS12-381に残ります。これは、楕円曲線セキュリティを半減させる仮想的な攻撃に対するヘッジとなります。現在、そのような攻撃は知られていません。これは[[Consensus-Layer|コンセンサス層]]のみを対象としており、同様のアプローチは[[Execution-layer|実行レイヤー]]でも検討される可能性があります。[[blob|ブロブ]]は対象外です。

[[Ethereum-validator|バリデータ]]は、[[ERC-8004|EIP-8450]]の登録を通じて、新しい鍵を[[Post-Quantum|ポスト量子]]鍵とともに登録し、必要になるまで休眠状態に保ちます。後の[[fork|フォーク]]（緊急ハードフォークである可能性もあります）で署名が新しい曲線に切り替わるか、状況に応じてチェーンが[[Post-Quantum|ポスト量子]]鍵に切り替わる可能性があります。

#### 更新ログ

-   2026-11-02: [初回ドラフト](https://gist.github.com/sauliusgrigaitis/6f833d88d91940e0ea64f1cd43ee5842)

#### 外部レビュー

2026-11-02現在、なし。

#### 未解決の課題

-   2026-11-02: 初期のモデリングでは、バッチ処理とこの署名分割により、通常のマルチコアコンピューターでの切り替えは可能であると示唆されていますが、すべてのアテステーションサブネット上のノードにはより多くのリソースが必要であり、これはまだクライアントで実証されていません。
-   2026-11-02: [[ERC-8004|EIP-8450]]の[[Post-Quantum|ポスト量子]]鍵も古典的な攻撃に耐性があることを考えると、2つ目の休眠鍵がコストに見合う価値があるか。
-   2026-11-02: その他の未解決の質問はドラフトに記載されており、G2対G1署名、アグリゲーター署名がBLS12-381に残るべきか、未登録の[[Ethereum-validator|バリデータ]]、および最終的な曲線選択などが含まれます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/draft-eip-higher-security-curve-for-bls-signatures/30184)
