---
title: 'EIP-8450: 量子耐性バリデータ鍵レジストリ'
original_title: 'EIP-8450: Post-Quantum Validator Key Registry'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8450-post-quantum-validator-key-registry/30046
author: tcoratger
date: '2026-10-22'
category: EIPs
tags:
  - eips
  - post-quantum
  - validators
  - consensus
  - cryptography
  - security
topic_id: '30046'
translated_at: '2026-10-23'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8450: Post-Quantum Validator Key Registry](https://ethereum-magicians.org/t/eip-8450-post-quantum-validator-key-registry/30046) — tcoratger (2026-10-22)

[[EIP|EIP]]-8450に関する議論トピック ([PR #12550](https://github.com/ethereum/EIPs/pull/12550))

この[[EIP|EIP]]は、ビーコンステートに[[ポスト量子 (PQ)|ポスト量子]]公開鍵レジストリを追加します。各[[イーサリアムバリデータ|バリデータ]]は、既存の[[イーサリアムバリデータ|バリデータ]]インデックスに紐付けられた1つの[[leanxmss|leanXMSS]]鍵を登録します。この鍵は、`2**32`個のリーフインデックスを持つ2層のハッシュベースツリーであり、すべてのハッシュ化には[[Keccak-256ハッシュ|Keccak-256]]が使用されます。

登録は、公開鍵とそれに基づく所有証明を伴う新しい[[BeaconBlockBody|ビーコンブロック]]操作です。これは、[[イーサリアムバリデータ|バリデータ]]の[[BLS鍵|BLS署名鍵]]（登録のみ）または新しい[[EIP|EIP]]-7685リクエストによる出金アドレス（登録または置換）によって承認されます。

鍵は休眠状態のままです。この[[フォーク|フォーク]]では、どの義務もそれらを使用しません。後の[[フォーク|フォーク]]で義務がそれらに切り替わります。それまでは、レジストリは登録された鍵を持つ[[ステーク|ステーク]]の割合を示し、登録されたすべての[[イーサリアムバリデータ|バリデータ]]に、[[BLS鍵|BLS]]がまだ安全であったときに登録された鍵を提供します。

特に[[CLノード (コンセンサスレイヤーノード)|CL]]チームおよび[[ステーキング|ステーキング]]プール[[Operator|オペレーター]]からのフィードバックを歓迎します。

#### 更新ログ

-   2026-10-19: 初版ドラフト、[PR #12550](https://github.com/ethereum/EIPs/pull/12550)

#### 外部レビュー

2026-10-22現在なし。

#### 未解決の課題

2026-10-22現在なし。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8450-post-quantum-validator-key-registry/30046)
