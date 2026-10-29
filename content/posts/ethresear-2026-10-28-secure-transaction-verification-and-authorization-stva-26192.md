---
title: 安全なトランザクション検証と認可 (STVA)
original_title: Secure Transaction Verification and Authorization (STVA)
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/secure-transaction-verification-and-authorization-stva/26192
author: MATOBOYCRYPTO65
date: '2026-10-28'
category: Security
tags:
  - security
  - account-abstraction
  - wallet
  - smart-contracts
  - verification
  - protocol-design
  - eip
  - ux
topic_id: '26192'
translated_at: '2026-10-29'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Secure Transaction Verification and Authorization (STVA)](https://ethresear.ch/t/secure-transaction-verification-and-authorization-stva/26192) — MATOBOYCRYPTO65 (2026-10-28)

[[glossary/EOA|EOA]]、[[glossary/Smart-Account|スマートアカウント]]、および[[glossary/Multisig|マルチシグ]]のための、検証可能で人間が読めるトランザクションシミュレーション、スコープ付き認可、および署名ペイロードの独立した検証のための標準インターフェースとワークフロー。

author: [@MATOBOYCRYPTO65](https://ethresear.ch/u/matoboycrypto65)

discussions-to: [(ERC Draft), Secure Transaction Verification and Authorization (STVA) – Stopping Blind Signing & Multisig UI Attacks - ERCs - Fellowship of Ethereum Magicians](https://ethereum-magicians.org/t/erc-draft-secure-transaction-verification-and-authorization-stva-stopping-blind-signing-multisig-ui-attacks/30106/9)

status: Draft

type: Standards Track

category: ERC

created: 2026-10-27

Abstract:

この[[glossary/ERC|ERC]]は、[[glossary/Secure-Transaction-Verification-and-Authorization|安全なトランザクション検証と認可 (STVA)]]の標準を定義します。これは以下を提供します。

1.  構造化された、人間が読めるメタデータと[[glossary/Semantic-Intent|セマンティックインテント]]を、あらゆるトランザクションまたはUserOperationに付与するカノニカルな方法。
2.  ウォレット、[[glossary/signers|署名者]]、および検証者が呼び出すことができる、必須の[[glossary/Independent-Simulator|独立シミュレーター]]および検証インターフェース。
3.  特権操作（アップグレード、大規模な転送、モジュールインストール、所有権変更）のための、[[glossary/Scoped-Capability|スコープ付きケイパビリティ]]トークン[[glossary/Attestation|アテステーション（証明）]]。
4.  フロントエンドのサプライチェーン攻撃やUIスプーフィングに耐性のある、[[glossary/Multisig|マルチシグ]]および[[glossary/Smart-Account|スマートアカウント]]の署名セレモニーに対する明確な要件。

目標は、「見たものが署名したもの (what you see is what you sign)」を暗号学的に強制可能にし、独立して検証可能にすることです。これにより、2024年から2026年にかけて観測された主要な実世界の損失ベクトル（署名フローの侵害、[[glossary/blind-signing|ブラインド署名]]、[[glossary/Multisig|マルチシグ]]UI攻撃）に対処します。

Motivation:

主要なインシデント（2025年2月のBybitによる約14億～15億ドルのSafe [[glossary/Multisig|マルチシグ]]侵害や、その他多数のアクセス制御署名フローの損失を含む）の分析によると、高額な盗難の大部分は、もはや古典的な[[glossary/smart-contracts|スマートコントラクト]]のバグのみに依存していません。代わりに、以下の点を悪用しています。

*   不透明なコールデータの[[glossary/blind-signing|ブラインド署名]]またはセミ[[glossary/blind-signing|ブラインド署名]]。
*   悪意のあるコールデータを署名のために提示しながら、良性なUIを表示する、侵害されたフロントエンドのサプライチェーン攻撃。
*   署名前の独立した機械検証可能なシミュレーションの欠如。
*   過度に広範で長期間有効な承認（認可）。
*   [[glossary/Multisig|マルチシグ]]および高価値の[[glossary/Smart-Account|スマートアカウント]]に対する弱いセレモニー要件。

既存の標準（[[glossary/EIP-712-attestation-profile|EIP-712]]、[[glossary/ERC-1271|ERC-1271]]、[[glossary/EIP-4337|EIP-4337]]、[[glossary/EIP-7702|EIP-7702]]、ERC-7683インテントなど）は優れた構成要素を提供しますが、[[glossary/signers|署名者]]と検証者が必要とする完全な安全な検証ループを義務付けたり標準化したりするものではありません。この[[glossary/ERC|ERC]]は、アプリケーション層でそのギャップを埋めます。

Core Concepts:

[[glossary/Verification-Payload|検証ペイロード]]：生のトランザクション/UserOperationと必須のメタデータを含む構造化されたオブジェクト。

[[glossary/Semantic-Intent|セマンティックインテント]]：効果の人間および機械可読な説明（例：0xabc…に1000 USDCを転送、Safe実装を0xdef…にアップグレード、権限YでモジュールXをインストール）。

[[glossary/Independent-Simulator|独立シミュレーター]]：正確なペイロードを再シミュレートし、カノニカルな結果を生成できるあらゆる当事者（ウォレット、ハードウェアデバイス、サードパーティ検証者、別の[[glossary/signers|署名者]]）。

[[glossary/Scoped-Capability|スコープ付きケイパビリティ]]：特定の行動のみを許可する、短命で目的が限定された認可トークン（[[glossary/EIP-712-attestation-profile|EIP-712]]型データまたは[[glossary/ERC-1271|ERC-1271]]互換）。

*1 post - 1 participant*

[Read full topic](https://ethresear.ch/t/secure-transaction-verification-and-authorization-stva/26192)
