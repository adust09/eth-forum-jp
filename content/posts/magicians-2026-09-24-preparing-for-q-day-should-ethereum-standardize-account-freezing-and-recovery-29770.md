---
title: 'Q-dayへの備え: イーサリアムはアカウントの凍結とリカバリーを標準化すべきか？'
original_title: >-
  Preparing for Q-day: should Ethereum standardize account freezing and
  recovery?
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/preparing-for-q-day-should-ethereum-standardize-account-freezing-and-recovery/29770
author: colinlyguo
date: '2026-09-24'
category: EIPs
tags:
  - eips
  - cryptography
  - post-quantum
  - security
  - account-abstraction
  - eip
  - protocol-design
topic_id: '29770'
translated_at: '2026-09-25'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Preparing for Q-day: should Ethereum standardize account freezing and recovery?](https://ethereum-magicians.org/t/preparing-for-q-day-should-ethereum-standardize-account-freezing-and-recovery/29770) — colinlyguo (2026-09-24)

[Quantum recovery pathway](https://ethereum-magicians.org/t/quantum-recovery-pathway/28109)からの議論の続きです。

未移行アカウントの凍結とリカバリーに関する[[EIP|EIP]]を設けるべきでしょうか？例えば、[Vitalikの量子緊急リカバリー提案](https://ethresear.ch/t/how-to-hard-fork-to-save-most-users-funds-in-a-quantum-emergency/18901)を基盤とするものです。事前にクライアント間で実装を準備しテストすることで、緊急対応時間を短縮できる可能性があります。

懸念の一つは、公開された署名を通じて公開鍵が露出しており、その所有者がアクセスを失っているアカウントです。これらのアカウントは移行できず、その資金は量子攻撃者によってアクセス可能になる可能性があります。リスクに晒されている価値の推定値はありますか？

考えられる3つの構成要素:

1.  **スケジュールされた移行カットオフ。** 事前定義された移行期間の後、未移行アカウントのレガシーECDSA認証を無効にします。これには[[EOA|EOA]]トランザクションと、パーミットなどの関連する`ecrecover`ベースのパスの両方が含まれます。

2.  **早期の緊急アクティベーションパス。** [[EIP|EIP]]は、デフォルトでは未設定の`QUANTUM_FREEZE_TIME`パラメータを定義し、凍結ルールをクライアント全体で事前に実装できます。実用的な量子ブレイクの証拠が公開され、アクティベーションが合意されたら、ノード[[Operator|オペレーター]]は同じタイムスタンプを設定してクライアントを再起動し、その時刻以降の最初のブロックからルールを有効にします。

3.  **凍結されたアカウントのリカバリーパス。** リカバリーは、元のシードまたは適切な派生材料の知識の[[ゼロ知識証明]]を、それを明らかにすることなく使用するか、カットオフ前にコミットされたリカバリーメカニズムを使用できます。量子鍵リカバリーが可能になると、ECDSA秘密鍵だけでは正当な所有権を証明できなくなります。ただし、保持されたシードや適切な派生材料なしに秘密鍵が直接生成されたアカウントは、シードベースのリカバリーの恩恵を受けられない可能性があります。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/preparing-for-q-day-should-ethereum-standardize-account-freezing-and-recovery/29770)
