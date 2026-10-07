---
title: 所有権モジュール
original_title: Ownership Module
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/ownership-module/29894'
author: payalhanda348-bot
date: '2026-10-06'
category: ERCs
tags:
  - ercs
  - protocol-design
  - smart-contracts
  - applications
  - identity
  - governance
  - state-management
  - research
  - ux
topic_id: '29894'
translated_at: '2026-10-07'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Ownership Module](https://ethereum-magicians.org/t/ownership-module/29894) — payalhanda348-bot (2026-10-06)

# [[glossary/ARCOS|ARCOS]] → [[glossary/Module|モジュール]] → [[glossary/Ownership-Module|所有権モジュール]]

### 開発者向け概要

## [[glossary/ARCOS|ARCOS]]

[[glossary/ARCOS|ARCOS]]は、NFTをプログラマブルで運用可能にするインフラストラクチャだ。単なる所有者へのポインタではなく、デジタルアセットで何ができるか、誰ができるか、どのようなルールで行われるかを管理する[[glossary/governed-state-machine|ガバナンスされた状態機械]]である。

これは、アセットの挙動の各ドメインを管理する[[glossary/Module|モジュール]]のセットとして構成されている。

* * *

## [[glossary/Module|モジュール]] — 汎用インフラストラクチャ

[[glossary/Module|モジュール]]は、[[glossary/governed-state-machine|ガバナンスされた状態機械]]だ。

> 1つの状態ドメインであり、厳密に1つの[[glossary/Authority|権限]]によって所有され、定義された[[glossary/Transition|遷移]]を通じてのみ変更され、他のものからは[[glossary/Module-Activation-System|MAS（モジュールアクティベーションシステム）]]を通じてのみアクセス可能である。

すべての[[glossary/Module|モジュール]]は、同じ**9つの要素**から構築されている。要素は固定されており、何がそれらを埋めるかはドメイン固有だ。

### 1. [[glossary/Governed-State|ガバナンスされた状態]]

実際に保存される唯一のもの。

アセットに関する実際の事実を表す、固定された名前付きフィールドのセット。他には何も保存されない。

### 2. [[glossary/Authority|権限]]

誰が正当に状態を変更できるか。

[[glossary/Authority|権限]]はそれ自体の事実として保存されることはなく、チェックされるたびに[[glossary/Governed-State|ガバナンスされた状態]]からリアルタイムで計算される。

### 3. [[glossary/Transition|遷移]]

[[glossary/Governed-State|ガバナンスされた状態]]が変更を許可される、有限で名前付きの手段のセット。

すべての[[glossary/Transition|遷移]]は同じ順序に従う。

**[[glossary/Authority|権限]]チェック → [[glossary/Invariant|不変条件]]チェック → 書き込み → ログ**

いずれかのチェックで失敗した場合、部分的にであっても何も書き込まれない。

### 4. [[glossary/Invariant|不変条件]]

呼び出し元がすでに[[glossary/Authority|権限]]チェックを通過していることを前提として、特定の変更が有効かどうかを決定するルール。

**アイデンティティが問うのは「誰か？」**
**[[glossary/Invariant|不変条件]]が問うのは「この特定の変更は今、問題ないか？」**

### 5. [[glossary/History|履歴]]

成功または失敗にかかわらず、すべての[[glossary/Transition|遷移]]試行の永続的な追記専用記録。

失敗も成功とまったく同じように保持される。何も破棄されない。

### 6. [[glossary/Lifecycle|ライフサイクル]]

[[glossary/Lifecycle|ライフサイクル]]は保存されない。

これは[[glossary/History|履歴]]に対するリアルタイム読み取りであり、以下の問いに答える。

> これまでに記録されたすべてを考慮すると、このアセットは今どの段階にあるか？

### 7. [[glossary/Recovery|リカバリー]] / 失敗

失敗とは、通常の[[glossary/Transition|遷移]]がその[[glossary/Invariant|不変条件]]を通過しなかった場合に発生するものだ。

[[glossary/Recovery|リカバリー]]は、プライマリな[[glossary/Authority|権限]]が失われた場合に備えて予備として保持される、第二の独立した[[glossary/Authority|権限]]によってゲートされた特定の[[glossary/Transition|遷移]]だ。

### 8. [[glossary/Capabilities|ケイパビリティ]]

[[glossary/Capabilities|ケイパビリティ]]は保存されない。

これらは[[glossary/Governed-State|ガバナンスされた状態]]から読み取られ、[[glossary/Authority|権限]]に対して測定される名前付きパターンだ。

[[glossary/Capabilities|ケイパビリティ]]は状態の記述であり、それに関する別の事実ではない。

### 9. [[glossary/Module-Activation-System|MAS（モジュールアクティベーションシステム）]]

[[glossary/Module-Activation-System|MAS]]は[[glossary/Module|モジュール]]間の唯一の経路だ。

どの[[glossary/Module|モジュール]]も他の[[glossary/Module|モジュール]]を直接呼び出すことはない。

ある[[glossary/Module|モジュール]]の状態が別の[[glossary/Module|モジュール]]が必要とする問いに答える場合、後者は自身のコピーを保持する代わりに[[glossary/Module-Activation-System|MAS]]を通じてそれをクエリする。

* * *

# [[glossary/Ownership-Module|所有権モジュール]] — 適用されたインスタンス

[[glossary/Ownership-Module|所有権モジュール]]は、**1つのドメインに特化した[[glossary/Module|モジュール]]**だ。

> デジタルアセットを誰が所有し、その所有権が実際に何を行わせるか。

### [[glossary/Governed-State|ガバナンスされた状態]]

5つのフィールドがある。

-   **シェア**
-   **ポゼッション（占有）**
-   **ユース（利用）**
-   **ベネフィット（利益）**
-   **バージョン**

他には何も保存されない。

### [[glossary/Authority|権限]] — [[glossary/Authority-Root|権限ルート]]

[[glossary/Authority-Root|権限ルート]]は、チェックのたびにリアルタイムで再計算される**シェアの厳格な過半数**だ。

シェアが変更されると、[[glossary/Authority|権限]]も自動的に変更される。

個別に更新する必要があるものはない。

### [[glossary/Transition|遷移]]

現在の[[glossary/Ownership-Module|所有権モジュール]]は以下を定義する。

-   `mint`
-   `delegateUse`
-   `revokeUse`
-   `moveToCustody`
-   `returnFromCustody`
-   `splitShares`
-   `mergeShares`
-   `setGuardians`
-   `recoverOwnership`

### [[glossary/Invariant|不変条件]]

例:

-   ユース（利用）がすでに他でコミットされている場合、付与することはできない。
-   シェアの合計は100でなければならない。
-   レンタルは期間が終了する前に取り消すことはできない。

### [[glossary/History|履歴]]

成功または失敗にかかわらず、すべての[[glossary/Transition|遷移]]試行は台帳に永続的に記録される。

### [[glossary/Lifecycle|ライフサイクル]]

[[glossary/Lifecycle|ライフサイクル]]は台帳から導出される。

**ジェネシス → アクティブ → 担保付き → 分割済み → サスペンド済み → リカバリー済み**

### [[glossary/Recovery|リカバリー]] / 失敗

[[glossary/Recovery|リカバリー]]は、シェアの過半数ではなく**ガーディアンクォーラム**によってゲートされる。

これにより、プライマリな[[glossary/Authority|権限]]が失われた場合に備えて、[[glossary/Recovery|リカバリー]]のための第二の独立した[[glossary/Authority|権限]]が作成される。

失敗とは、通常の[[glossary/Invariant|不変条件]]が通過しなかった場合に台帳に表示されるものにすぎない。

### [[glossary/Capabilities|ケイパビリティ]]

現在、5つのフィールドから読み取られる4つのパターンがあり、これらは個別に保存されることはない。

-   **デリゲーション（委任）**
-   **レンタル**
-   **カストディ（保管）**
-   **共有所有権**

* * *

## [[glossary/Module-Activation-System|MAS]]の実践

レンタルの支払い/対価である[[glossary/Settlement|決済]]は、意図的に所有権の外部に置かれた。

これには異なる[[glossary/Authority|権限]]と異なる[[glossary/Lifecycle|ライフサイクル]]がある。

したがって、所有権は価格フィールドを保存しない。代わりに、その[[glossary/Invariant|不変条件]]は、その情報が必要なときに[[glossary/Module-Activation-System|MAS]]を通じて[[glossary/Settlement|決済]]をクエリする。

* * *

# 現状 — 改善が必要な点

**現在の[[glossary/Ownership-Module|所有権モジュール]]は権利のみを管理している。**

ポゼッション（占有）、ユース（利用）、ベネフィット（利益）、シェアはすべて権利であり、ホルダーが行う権利を持つことだ。

現在欠けているのは、**ホルダーが何かを保有している間に負う義務**の表現だ。

これは、私が開発者にレビューと挑戦を求めたい領域の1つだ。

* * *

# ライブデモ

[[glossary/Ownership-Module|所有権モジュール]]には、**ウォレットやブロックチェーンを必要としない**ライブのインタラクティブデモがある。

以下を順に説明する。

-   [[glossary/Governed-State|ガバナンスされた状態]]
-   [[glossary/Authority-Root|権限ルート]]
-   すべての[[glossary/Transition|遷移]]
-   [[glossary/Invariant|不変条件]]の合否
-   [[glossary/History|履歴]]
-   [[glossary/Lifecycle|ライフサイクル]]
-   [[glossary/Recovery|リカバリー]]

すべて1つのNFTを使用する。

**Sunset #7**

**GitHub:**

[github.com](https://github.com/payalhanda348-bot/Ownership-Module)

![Ownership Module with demo.](https://opengraph.githubassets.com/aa2ca007a4cc73b0d2538d3ef0b2a2b4/payalhanda348-bot/Ownership-Module)

### [GitHub - payalhanda348-bot/Ownership-Module: デモ付き所有権モジュール。](https://github.com/payalhanda348-bot/Ownership-Module)

デモ付き所有権モジュール。

* * *

# 開発者レビューを募集中

[[glossary/Ownership-Module|所有権モジュール]]を**レビューし、アーキテクチャに異議を唱え、何が欠けているかを特定し、改善を提案できる**開発者を募集している。

この方向性に興味があり、レビューを超えて貢献したい場合は、**[[glossary/Ownership-Module|所有権モジュール]]の構築に私と一緒に参加してほしい**。

[[glossary/ARCOS|ARCOS]]は現在**ソロで構築されており — 私一人だ — まだ資金提供はない。**

目標は、NFT/デジタルアセットの未来のためのオープンなインフラストラクチャとして、これを共に構築することだ。

### 問い

**NFTの所有権の未来はどのようなものになるべきか？**

**[[glossary/ERC|ERC]] `ownerOf()` → [[glossary/Ownership-Module|所有権モジュール]] → デジタルアセットのためのガバナンスされた所有権**

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/ownership-module/29894)
