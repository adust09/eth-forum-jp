---
title: (ERCドラフト) 安全なトランザクション検証と承認 (STVA) – ブラインド署名とマルチシグUI攻撃の阻止
original_title: >-
  (ERC Draft), Secure Transaction Verification and Authorization (STVA) –
  Stopping Blind Signing & Multisig UI Attacks
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-draft-secure-transaction-verification-and-authorization-stva-stopping-blind-signing-multisig-ui-attacks/30106
author: Obaresearch
date: '2026-10-27'
category: ERCs
tags:
  - ercs
  - security
  - smart-contracts
  - ux
  - wallet
  - account-abstraction
  - eip
  - protocol-design
topic_id: '30106'
translated_at: '2026-10-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [(ERC Draft), Secure Transaction Verification and Authorization (STVA) – Stopping Blind Signing & Multisig UI Attacks](https://ethereum-magicians.org/t/erc-draft-secure-transaction-verification-and-authorization-stva-stopping-blind-signing-multisig-ui-attacks/30106) — Obaresearch (2026-10-27)

皆さん、こんにちは。

高額な署名フローおよびサプライチェーン攻撃（特に2025年のBybit Safe事件や多数のアクセス制御損失）の波を受け、私はトランザクション署名を独立して検証可能かつ人間にとって意味のあるものにすることに焦点を当てた新しい[[ERC|ERC（Ethereum Request for Comments）]]を提案します。

コアアイデア:

「あなたが見るものがあなたが署名するもの (WYSIWYS)」が単なる願望ではなく強制可能となるよう、[[Verification-Payload|検証ペイロード]] + 独立したシミュレーションインターフェース + スコープ付きケイパビリティを標準化することです。

動機:

主要なインシデント（2025年2月のBybitによる約14億～15億ドルのSafeマルチシグ侵害や、その他多数のアクセス制御/署名フロー損失を含む）の分析によると、高額な盗難の大部分は、もはや古典的な[[スマートコントラクト|スマートコントラクト (Smart Contract)]]のバグのみに依存していません。代わりに、以下の点を悪用しています。

-   不透明なcalldataの[[blind-signing|ブラインド署名]]またはセミブラインド署名。
-   悪意のあるcalldataを署名のために提示しながら、無害なUIを表示する、侵害されたフロントエンド/サプライチェーン攻撃。
-   署名前の独立した、機械で検証可能な[[transaction-simulation|トランザクションシミュレーション]]の欠如。
-   過度に広範で長期間有効な承認/認可。
-   マルチシグおよび高額な[[スマートアカウント|スマートアカウント (Smart Account)]]に対する儀式要件の弱さ。

既存の標準（[[EIP-712-attestation-profile|EIP-712]]、ERC-1271、[[EIP|EIP（Ethereum Improvement Proposal）]]-4337、[[EIP-7702|EIP-7702]]、ERC-7683インテントなど）は優れた構成要素を提供しますが、署名者と検証者が必要とする完全な安全な検証ループを義務付けたり標準化したりしていません。この[[ERC|ERC（Ethereum Request for Comments）]]は、アプリケーション層でそのギャップを埋めます。

コアコンセプト:

**[[Verification-Payload|検証ペイロード]]**: 生のトランザクション/UserOperation + 必須メタデータを含む構造化されたオブジェクト。

**セマンティックインテント**: 効果の人間および機械可読な記述（例: 「1000 USDCを0xabc…に転送」、「Safe実装を0xdef…にアップグレード」、「パーミッションYでモジュールXをインストール」）。

**独立シミュレーター**: 正確なペイロードを再シミュレートし、カノニカルな結果を生成できる任意の当事者（[[ウォレット|ウォレット (wallet)]]、ハードウェアデバイス、サードパーティ検証者、別の署名者）。

**スコープ付きケイパビリティ**: 特定のアクションのみを許可する、短命で目的が限定された承認トークン（[[EIP-712-attestation-profile|EIP-712]]型データまたはERC-1271互換）。

主要な質問:

1.  [[Verification-Payload|検証ペイロード]]の構造は適切な形か、それとも既存のインテント標準（ERC-7683など）にもっと強く依存すべきか？
2.  「STVA準拠」ステータスにとって、マルチシグの儀式要件はどの程度厳格であるべきか？
3.  明示的なコンプライアンスレベル（基本/標準/厳格）を定義すべきか？
4.  [[EIP-7702|EIP-7702]]承認および[[Modular-smart-accounts|モジュラー型スマートアカウント]]（ERC-7579/6900）との統合の最善策は何か？
5.  これと重複する既存の作業で、参照または統合すべきものはあるか？

フィードバック、特に[[ウォレット|ウォレット (wallet)]]チーム（Safe、Ambire、MetaMask、Rabby、ハードウェアベンダー）、カストディプロバイダー、セキュリティ研究者からの意見を楽しみにしています。

3投稿 - 3参加者

[トピック全文を読む](https://ethereum-magicians.org/t/erc-draft-secure-transaction-verification-and-authorization-stva-stopping-blind-signing-multisig-ui-attacks/30106)
