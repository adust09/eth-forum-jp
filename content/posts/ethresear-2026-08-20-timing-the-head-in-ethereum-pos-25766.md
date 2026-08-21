---
title: イーサリアムPoSにおけるヘッドのタイミング
original_title: Timing the Head in Ethereum PoS
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/timing-the-head-in-ethereum-pos/25766'
author: Yolodannn
date: '2026-08-20'
category: Economics
tags:
  - economics
  - consensus
  - proof-of-stake
  - validators
  - security
  - protocol-design
  - timing-attacks
  - head-vote
topic_id: '25766'
translated_at: '2026-08-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Timing the Head in Ethereum PoS](https://ethresear.ch/t/timing-the-head-in-ethereum-pos/25766) — Yolodannn (2026-08-20)

## 概要

[[glossary/proof-of-stake|イーサリアムPoS]]では、多くのリorg攻撃が[[glossary/Ethereum-validator|イーサリアムバリデータ]]のヘッドに対する見方を操作し、その[[glossary/Attestation|アテステーション]]ウェイトを異なるブランチに分散させ、潜在的にリorgを引き起こします。これは、ヘッドがコンセンサスセキュリティにおいて重要な役割を果たすことを示しています。一方、ヘッド投票は[[glossary/Attestation|アテステーション]]報酬の大部分を占め、報酬を得るためには厳格なタイミング条件を満たす必要があり、損失に対して特に脆弱です。しかし、コンセンサスセキュリティと[[glossary/Ethereum-validator|バリデータ]]インセンティブにおけるヘッドの役割は、統一的な方法で研究されていませんでした。

### 背景

**ヘッド投票 (Head Vote)**
[[glossary/Ethereum-validator|バリデータ]]は、LMD-GHOSTに従ってヘッドと見なすブロックを[[glossary/Attestation|アテステーション]]します。ソース投票とターゲット投票とは異なり、ヘッド報酬は、[[glossary/Ethereum-validator|バリデータ]]が正しいブロックを時間内に観測したかどうかに強く依存します。

**[[glossary/Attestation|アテステーション]]のタイミング (Attestation Timing)**
各12秒のスロットにおいて、[[glossary/Ethereum-validator|バリデータ]]は通常、スロット開始から4秒以内に[[glossary/Attestation|アテステーション]]します。したがって、ブロックのリリース時期を制御する[[glossary/Proposer|プロポーザー]]は、正直な[[glossary/Attestation|アテスター]]が使用するローカルビューに影響を与えることができます。

**[[glossary/Proposer-Boost|プロポーザーブースト]] (Proposer Boost)**
イーサリアムは、現在のスロットのブロックに40%の追加の一時的なフォーク選択ウェイトを与えます。このメカニズムは、事前リorg攻撃 (ex ante reorg attack) とバランシング攻撃 (balancing attack) を最小限に抑えることを目的としていますが、競合するブランチが意図的に作成された場合にも結果に影響を与えます。

### 攻撃シナリオ

イーサリアムPoSにおけるヘッド投票の役割を悪用する、2つのタイミングベースの攻撃シナリオを検討します。

1.  **ヘッド投票タイミングゲーム (Head-vote timing game)**。敵対的[[glossary/Proposer|プロポーザー]]は、そのブロックのブロードキャストを妥当なネットワーク遅延範囲内で遅延させ、[[glossary/attestation-deadline|アテステーション期限]]近くにリリースします。ブロックを受信せず、その親をヘッドと見なし続けて親に投票する正直な[[glossary/Ethereum-validator|バリデータ]]は、遅延されたブロックが[[glossary/canonical|カノニカル]]になると、[[glossary/Attestation|アテステーション]]報酬のヘッドコンポーネントを失います。重要なことに、このような遅延配信は、通常のネットワーク伝播遅延 (network propagation delay) からも生じる可能性があるため、プロトコルによって悪意のある行動として確実に識別することはできません。

    [![Timing Game-p](https://ethresear.ch/uploads/default/optimized/3X/3/e/3e7fcb1559c09dc1a685a84de017e8e0d0c49892_2_690x193.png)](https://ethresear.ch/uploads/default/original/3X/3/e/3e7fcb1559c09dc1a685a84de017e8e0d0c49892.png "タイミングゲーム-p")

2.  **Kブロック攻撃 (K-block attack)**。この攻撃を連続する敵対的[[glossary/Proposer|プロポーザー]]のスロットにさらに一般化します。攻撃者がk個の連続する[[glossary/Proposer|プロポーザー]]を制御する場合、これらのブロックを正直な[[glossary/Ethereum-validator|バリデータ]]から隠しながら、競合するブランチを秘密裏に拡張できます。プライベートブランチは後続の正直なブロックを隔離し、リリースされると[[glossary/canonical-chain|カノニカルチェーン]]になり、リorgを引き起こす可能性があります。結果として、正直な[[glossary/Ethereum-validator|バリデータ]]は、後に[[glossary/canonical-chain|カノニカルチェーン]]から削除されるブロックにヘッド投票を行い、再びヘッド投票報酬の損失を引き起こす可能性があります。

    [![k-block-p](https://ethresear.ch/uploads/default/optimized/3X/1/e/1edefa435ca302abcdd596744b9e921d8ea95c5a_2_690x404.png)](https://ethresear.ch/uploads/default/original/3X/1/e/1edefa435ca302abcdd596744b9e921d8ea95c5a.png "kブロック-p")

### 影響

私たちのPrysm実験は、このタイミング操作が永続的な報酬の非対称性を生み出すことを示しています。

ヘッド投票タイミングゲームは、正直な[[glossary/Ethereum-validator|バリデータ]]に対して平均15.06%の総報酬損失をもたらします。同じブロック可視性の非対称性はHLMD-GHOSTにも直接影響を与える可能性があります。Kブロック非公開 (k-block withholding) の下では、協調する敵対的[[glossary/Proposer|プロポーザー]]と[[glossary/Attestation|アテスター]]が十分なプライベートフォーク選択ウェイトを蓄積し、リorgを実現できます。

これらの古いローカルビューによって引き起こされるインセンティブ損失を減らすために、私たちは**距離加重ヘッド報酬 (distance-weighted head reward)** を検討します。これは、最近の[[glossary/canonical-ancestors|カノニカルな祖先]]を指す適格な[[glossary/Attestation|アテステーション]]に部分的な報酬を与えつつ、最新の[[glossary/freshest-canonical-head|カノニカルヘッド]]への投票には最高の報酬を維持します。このメカニズムは報酬計算のみを変更し、HLMD-GHOSTと[[glossary/Proposer-Boost|プロポーザーブースト]]は変更しません。私たちの実験では、タイミングゲームの損失を**15.06%から4.71%**に削減し、Kブロック攻撃下での正直な報酬損失を一貫して削減します。オーファン化されたブランチ (orphaned branches) やすべてのリorg効果によって引き起こされる損失を排除するわけではありませんが、正直な[[glossary/Ethereum-validator|バリデータ]]が経験する報酬の不利を大幅に軽減します。

*1投稿 - 1参加者*

[全トピックを読む](https://ethresear.ch/t/timing-the-head-in-ethereum-pos/25766)
