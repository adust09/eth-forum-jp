---
title: 'ERC-8420: AA互換ソルバー'
original_title: 'ERC-8420: AA-Compatible Solver'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8420-aa-compatible-solver/29989'
author: Helkomine
date: '2026-10-16'
category: ERCs
tags:
  - ercs
  - eip
  - account-abstraction
  - ux
  - protocol-design
  - intent-layer
topic_id: '29989'
translated_at: '2026-10-17'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8420: AA-Compatible Solver](https://ethereum-magicians.org/t/erc-8420-aa-compatible-solver/29989) — Helkomine (2026-10-16)

## 概要

この[[glossary/ERC|Ethereum Request for Comments (ERC)]]は、既存の[[glossary/Smart-Account|スマートウォレット (smart wallets)]]との完全な後方互換性を保ちつつ、[[glossary/Agentic-Onchain-Operations|ユーザーインテント (User Intents)]]の実行を調整する汎用[[glossary/Solver|ソルバー (Solver)]]を提案します。

ユーザーは、ウォレットの署名済みトランザクションデータを含む `envelopeTx` を保持する `UserEnvelopeTx` オブジェクトを提出します。ウォレットは、既存の署名スキームと、この[[glossary/ERC|ERC]]で定義されたトランザクション構築ポリシーに従って `envelopeTx` を自由に構築できます。これらのポリシーは、ウォレットのインターフェースや署名メカニズムの変更を必要とせず、[[glossary/Solver|ソルバー]]フローに参加するためにトランザクションをどのように構築し署名すべきかを指定するだけです。

この設計は、[[glossary/ERC|ERC]]-7521を含む関連するインテント標準から着想を得ています。[[glossary/ERC|ERC]]-7521は[[glossary/Wallet|ウォレットアーキテクチャ (wallet architecture)]]に根本的な変更を導入するため、ウォレットのセットアップ、統合、およびアップグレードに複雑さを加える可能性があります。対照的に、この[[glossary/ERC|ERC]]は、既存のウォレットをアップグレードまたは置き換えることなく、ウォレットが個別に信頼するかどうかを選択できる共有[[glossary/Solver|ソルバー]]コントラクトを導入します。

両方のアプローチは、[[glossary/Intent|インテント採用 (Intent adoption)]]に対してそれぞれ異なる利点を提供します。[[glossary/ERC|ERC]]-7521はウォレットレベルでより包括的で汎用的なインテント機能を実現しますが、この[[glossary/ERC|ERC]]はデプロイのシンプルさと既存インフラとの互換性を優先し、[[glossary/Intent|インテントベース実行 (Intent-based execution)]]のより迅速かつ広範な採用を可能にする可能性があります。

[Github PR](https://github.com/ethereum/ERCs/pull/2026)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8420-aa-compatible-solver/29989)
