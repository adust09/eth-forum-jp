---
title: 'EIP-8369: FOCIL適格性のためのVOPSプロファイル'
original_title: 'EIP-8369: VOPS Profiles for FOCIL Eligibility'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8369-vops-profiles-for-focil-eligibility/29298
author: soispoke
date: '2026-08-05'
category: EIPs informational
tags:
  - eips-informational
  - eip
  - consensus
  - mev
  - execution-layer
  - account-abstraction
  - state-management
  - censorship-resistance
  - research
topic_id: '29298'
translated_at: '2026-08-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8369: VOPS Profiles for FOCIL Eligibility](https://ethereum-magicians.org/t/eip-8369-vops-profiles-for-focil-eligibility/29298) — soispoke (2026-08-05)

[EIP-8369: VOPS Profiles for FOCIL Eligibility · Pull Request #12110 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12110/) の議論トピック

## 要約

この[[glossary/EIP|EIP]]は、[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]適格性のための2つの[[glossary/Validity-Only-Partial-Statelessness|バリディティオンリー部分ステートレス性 (VOPS)]]プロファイルを記述します。プロファイル1は通常のトランザクション、つまり[[glossary/blob|ブロブ]]を含まないすべての非[[glossary/Frame-Transactions|フレームタイプ]]をカバーし、EIP-7805のペイロード末尾省略チェックを維持します。プロファイル2は、固定された[[glossary/Account-Abstraction|アカウント抽象化]]VOPS (AA-VOPS) ステートサーフェス内で検証が維持される[[glossary/Frame-Transactions|EIP-8141フレームトランザクション]]をカバーし、これには[[glossary/Keyed-Nonces|キー付きNonce]]と最近のルートに基づくプライバシートランザクションが含まれます。プロファイル2の省略は、[[glossary/Block-Building|ビルダー]]が主張するペイロード内のトランザクションインデックスでチェックされるため、トランザクションが[[glossary/Block-Building|ビルダー]]が主張しうるすべてのインデックスで有効なままである場合にのみ保護されます。両方のプロファイルに該当しないトランザクションも[[glossary/Inclusion-List|インクルージョンリスト (IL)]]に現れる可能性がありますが、[[glossary/FOCIL|FOCIL]]はそれらを強制しません。パブリック[[glossary/Mempool|メムプール]]への受け入れと[[glossary/FOCIL|FOCIL]]適格性は分離されたままであるとします。この[[glossary/EIP|EIP]]は[[glossary/Informational-ERC|情報提供 (Informational)]]であり、コンセンサス強制はEIP-7805の拡張に属します。

## 動機

[[glossary/FOCIL|FOCIL]] (EIP-7805) は、不足しているトランザクションがペイロードに追加されたときに無効であるか、ペイロードに追加するのに十分な残りのガスがない場合を除き、[[glossary/Block-Building|ビルダー]]に[[glossary/Inclusion-List|IL]]トランザクションを含めることを要求します。このルールは、省略チェックが主にガス、ナンス、残高に依存するため、通常のトランザクションにとっては安価です。[[glossary/Frame-Transactions|フレームトランザクション]]はプログラム可能な検証を持つため、有効性は[[glossary/Keyed-Nonces|キー付きNonce]]、支払い者の状態、最近のルート、または制限されたアカウントストレージにも依存する可能性があります。

この[[glossary/EIP|EIP]]は、強制するのに十分安価なトランザクションを定義します。プロファイル1はEIP-7805のペイロード末尾ルールを維持します。プロファイル2は、省略された[[glossary/Frame-Transactions|フレームトランザクション]]を、[[glossary/Block-Building|ビルダー]]が主張するインデックスで、固定された検証ステートサーフェスに対して評価します。[[glossary/Block-Building|ビルダー]]がインデックスを選択するため、別のトランザクションがブロック内で検証依存関係を移動できる場合、プロファイル2は弱くなります。「セキュリティに関する考慮事項 (Security Considerations)」では、その境界を定義しています。

[[glossary/FOCIL|FOCIL]]適格性は[[glossary/Mempool|メムプール]]ポリシーではありません。インクルーダーは、パブリック[[glossary/Mempool|メムプール]]、カスタム[[glossary/Mempool|メムプール]]、または直接提出を通じて、適格なトランザクションを受け取ることができます。提出パスは、トランザクションが[[glossary/Inclusion-List|IL]]に到達するかどうかに影響し、その省略が強制可能であるかどうかには影響しません。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8369-vops-profiles-for-focil-eligibility/29298)
