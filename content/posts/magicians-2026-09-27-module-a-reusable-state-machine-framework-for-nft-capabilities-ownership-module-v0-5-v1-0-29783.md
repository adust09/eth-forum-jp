---
title: 'モジュール: NFT機能のための再利用可能なステートマシンフレームワーク（所有権モジュール v0.5 → v1.0）'
original_title: >-
  "Module: A Reusable State-Machine Framework for NFT Capabilities (Ownership
  Module v0.5 → v1.0)"
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/module-a-reusable-state-machine-framework-for-nft-capabilities-ownership-module-v0-5-v1-0/29783
author: payalhanda348-bot
date: '2026-09-27'
category: ERCs
tags:
  - ercs
  - applications
  - state-management
  - smart-contracts
  - protocol-design
  - governance
  - nft-capabilities
  - ownership
topic_id: '29783'
translated_at: '2026-09-30'
translator: gemini-2.5-flash
---

> [!note] 原文
> ["Module: A Reusable State-Machine Framework for NFT Capabilities (Ownership Module v0.5 → v1.0)"](https://ethereum-magicians.org/t/module-a-reusable-state-machine-framework-for-nft-capabilities-ownership-module-v0-5-v1-0/29783) — payalhanda348-bot (2026-09-27)

## ARCOS: モジュールとは何か、そしてなぜ構築するのか — 所有権モジュール v0.5 → v1.0

### なぜこれを構築するのか

ERC-721は `ownerOf()` を提供します。これは単一のアドレス、単一の静的な事実です。これは来歴 (provenance) と転送 (transfer) には十分ですが、それ以上の豊かな表現はできません。例えば、所有権 (possession) と使用権 (use) と利益享受権 (benefit) を別々の独立した権利として表現すること、委任 (delegation)、カストディ (custody)、部分所有権 (fractional ownership) などです。NFTにウォレットにただ座っている以上のことをさせたいと考えるすべてのプロジェクトは、最終的にこれを独自に解決することになり、エコシステム全体で同じ失敗パターンが繰り返されます。

-   **断片化 (Fragmented)** — 委任、カストディ、レンタルといった機能は、それぞれ別々の連携しないERCによって断片的にカバーされています（例：相互運用性のない3つの異なる委任提案、競合する3つのレンタル標準）。ERC自体は問題ありませんが、プロジェクトが複数の機能を必要とした場合、それらの間で何も調整されません。
-   **カスタム、使い捨て (Custom, one-off)** — すべてのプロジェクトが、これらの機能のための独自のロジックをゼロから再構築しています。
-   **デプロイ時に固定 (Frozen at deployment)** — 一度デプロイされると、そのカスタムロジックは、再デプロイと移行なしには新しい機能を追加したり、既存の機能を変更したりできません。
-   **再利用不可、構成不可 (Non-reusable, non-composable)** — あるプロジェクトが構築した調整機能は次のプロジェクトで利用できず、同じトークン上の2つの機能が特注コードとして構築された場合、競合を解決するための共通レイヤーが存在しません。

ARCOSは、このギャップを埋めるための統制された調整レイヤーです。これは、この問題の一部をうまく解決している既存のERCを置き換えるのではなく、不足している状態を生成し、各プロジェクトが独自に配線する代わりに、1つの共有レイヤー（これをMAS — Module Activation Systemと呼んでいます）を通じてすべてを調整することで実現します。

### モジュールとは何か

[[glossary/Module|モジュール]] (Module) とは、統制されたステートマシン (state machine) です。これは、構造化された状態のドメインであり、正確に1つの権限 (authority) によって所有され、定義された遷移 (transitions) を通じてのみ変更され、システムの残りの部分からはMASを通じてのみアクセス可能です。

すべてのモジュールは、6つの固定された質問に答えます。これらは普遍的な質問ですが、ドメイン固有の答えを持ちます。

1.  **状態/構造 (State/Structure)** — 何を所有し、その状態が何を意味するか
2.  **権限 (Authority)** — 誰がその状態の変更を引き起こせるか
3.  **遷移 (Transitions)** — 状態がどのように正当に変更されるか
4.  **不変条件/ルール (Invariants/Rules)** — 変更の前後に何が真でなければならないか
5.  **ライフサイクルと履歴 (Lifecycle & History)** — 状態が時間とともにどのように存在し、進化するか
6.  **システムインタラクション (System Interaction)** — システムの残りの部分が、MASを通じて排他的にこの状態を読み取り、トリガーする方法

これら6つに加えて、モジュールは追加のメカニズム（回復パス (recovery paths)、バージョン管理 (versioning)、段階的遷移 (staged transitions) など）を採用することがありますが、それはそのドメインが実際にそれらを必要とする場合に限られます。これは意図的な設計ルールであり、省略ではありません。あるモジュールが回復を必要とするからといって、次のモジュールもそうであるとは限りません。

これにより、6つの質問にうまく答えた結果として、直接的に設計されたチェックリストとしてではなく、4つの特性が生まれます。

-   **統制された (Governed)** — 全てのパスがステートマシンを通過し、迂回する方法がない
-   **再利用可能 (Reusable)** — 任意のARCOSネイティブNFTは、カスタムロジックを組み立てることなくモジュールを採用できる
-   **構成可能 (Composable)** — モジュールはMASを通じてのみ接続され、互いに直接接続されることはない
-   **進化可能 (Evolvable)** — 機能は進化するが、統制された状態モデルと6つの質問の構造は基盤として固定される

### 所有権モジュール: 最初のモジュール、v0.5

所有権自体（占有、使用、利益、転送、排他性）がERC-721で最もモデル化が不十分なものであるため、所有権は私たちが最初に完全に構築したドメインでした。私たちはv0.5を、所有権モジュールと4つの機能（**委任 (Delegation)、共有所有権 (Shared Ownership)、カストディ (Custody)、レンタル (Rental)**）をカバーする動作プロトタイプ（Next.js/TypeScript、MASはオフチェーンで実行）として構築しました。

v0.5は、アプリケーション層でエンドツーエンドの概念を証明しました。実際の状態遷移、実際の機能ロジックが、実際のNFTデータに対して実行されました。また、v1.0で現在解決している実際のアーキテクチャ上の問題も浮上しました。その問題とは、このうちどの部分をオンチェーンで強制する必要があるか、どの部分をオフチェーンで調整する必要があるか、新しい機能がスキーマ変更を必要としないように状態をどのように構造化すべきか、そしてトークンの所有者がキーを紛失した場合に、機能システム全体をその1つのケースに合わせて再設計することなく回復できる方法です。

### 現在: v1.0

現在、私たちは所有権モジュールの完全な仕様に取り組んでいます。統制された状態 (Governed State) モデルを形式化し、権限/遷移/不変条件パターン (Authority/Transition/Invariant pattern) を固定して、すべての状態変更が書き込まれる前にチェックされるようにし、オンチェーン強制モデルを決定しています（既存のNFTコントラクトを外部からラップするのではなく、ARCOSを通じてネイティブにミントされたトークン。既存のコントラクトをラップしても、所有者がベースコントラクトの `transferFrom` を直接呼び出すことで常にバイパスできるため、実際には強制できないことがわかりました）。

所有権は、これまでのところこの深さまで構築された唯一のモジュールです。パーミッション (Permission)、メタデータ (Metadata)、検証 (Verification)、ロイヤリティ (Royalty)、構成 (Composition)、および**経済とインセンティブ [ロイヤリティ/割引/ロイヤリティ/メンバーシップ/報酬/利益/インセンティブ/収益分配] (Economic & Incentive)** は、同じ6つの質問のフレームワークでスコープされていますが、まだ構築されていません。所有権は、フレームワークが有効であることの証明であり、完成品ではありません。

所有権モジュールのより深い設計（統制された状態のフィールド、権限、計算された読み取りとしての機能）については、追って投稿する予定です。この投稿は、その「何と理由」を説明するものです。Githubリンク: [GitHub - payalhanda348-bot/ARCOS---STGF · GitHub](https://github.com/payalhanda348-bot/ARCOS---STGF)

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/module-a-reusable-state-machine-framework-for-nft-capabilities-ownership-module-v0-5-v1-0/29783)
