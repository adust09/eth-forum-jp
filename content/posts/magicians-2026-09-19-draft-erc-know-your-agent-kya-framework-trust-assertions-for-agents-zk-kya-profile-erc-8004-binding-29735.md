---
title: >-
  [ドラフトERC] Know-Your-Agent (KYA) フレームワーク —
  エージェントの信頼性アサーション、ZK-KYAプロファイル、ERC-8004バインディング
original_title: >-
  [Draft ERC] Know-Your-Agent (KYA) Framework — trust assertions for agents,
  ZK-KYA profile, ERC-8004 binding
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-erc-know-your-agent-kya-framework-trust-assertions-for-agents-zk-kya-profile-erc-8004-binding/29735
author: garyyang-finchip
date: '2026-09-19'
category: ERCs
tags:
  - ercs
  - research
  - protocol-design
  - account-abstraction
  - identity
  - security
  - zk
  - applications
  - eip
topic_id: '29735'
translated_at: '2026-09-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [[Draft ERC] Know-Your-Agent (KYA) Framework — trust assertions for agents, ZK-KYA profile, ERC-8004 binding](https://ethereum-magicians.org/t/draft-erc-know-your-agent-kya-framework-trust-assertions-for-agents-zk-kya-profile-erc-8004-binding/29735) — garyyang-finchip (2026-09-19)

**PR:** [ethereum/ERCs#2012](https://github.com/ethereum/ERCs/pull/2012) · **リポジトリ / リファレンス実装:** [garyyang-finchip/kya-standard](https://github.com/garyyang-finchip/kya-standard) · **ステータス:** ドラフト、番号未割り当て

## 本提案の概要

[[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]は、エージェントにポータブルなアイデンティティと、生の信頼性*シグナル*（評判、検証）を蓄積する場所を提供します。しかし、信頼性に関する*結論*、つまり「このエージェントは原則Xに基づき、発行者YによってレベルLまでチェックされ、Tまで有効であり、取り消されていない」といった共通の表現方法までは意図的に踏み込んでいません。

この[[ERC|Ethereum Request for Comments (ERC)]]は、そのような結論そのものではなく、その**コンテナ**を標準化します。

-   **スキームレジストリ (Scheme Registry)** — *KYAスキーム*を登録します。これは、アドレス指定可能で、バージョン管理され、凍結可能な記述子へのポインターです。記述子には、何がチェックされるか、結果が`uint8 level`としてどのように表現されるか、どの証拠タイプが許容されるか、およびアサーションがどのように承認されるか（発行者による`ATTESTED`、または検証コントラクトによる`PROVED`）が記述されます。
-   **KYAレジストリ (KYA Registry)** — アサーション`(subjectKey, schemeId, issuer, level, claimDigest, issuedAt, expiresAt, evidenceHash, status)`を記録し、発行者ごとの上書きと取り消しをサポートし、それらを解決します: `resolve(subject, schemeId, issuers[])` / `check(subject, schemeId, minLevel, issuers[])`。`issuers`は空であってはなりません。これは、8004の`getSummary`が`clientAddresses`を要求するのと同じ[[Sybil-resistance|シビル耐性]]の論理です。
-   **ZK-KYAプロファイル (ZK-KYA profile)** — 別のレジストリではありません。`attestWithProof(subject, schemeId, publicInputs, proof)`はスキームの`IKYAVerifier`を呼び出し、`(ok, subjectKey, nullifier, level, claimDigest, expiresAt)`を返します。レジストリはサブジェクトバインディングと[[nullifier|ナリファイア]]の消費を強制し、`issuer = verifier`としてアサーションを記録します。任意の証明システムはアダプターを介して入力されます。仕様は公開入力のレイアウト（`kya-public-v1`）のみを固定します。証明は、チェーンに触れることなくハンドシェイクで一時的に提示することもできます。
-   **ハンドシェイク (Handshake)** — [[EIP-712-attestation-profile|EIP-712]] `KYAChallenge` / `KYAPresentation`、`/.well-known/kya.json`による検出。相互KYAは2回の交換です。
-   **ポリシー（最小限） (Policy (minimal))** — `registerPolicy(uri, hash)`は、依拠当事者の要件にチャレンジで名前を付けることができるIDを与えます。オンチェーン評価はオプションです。
-   **ERC-8004バインディング (ERC-8004 binding)** — `erc8004`はMUSTサポートのサブジェクトタイプ`(chainId, identityRegistry, agentId)`です。オプションの`supportedTrust: ["kya","zk-kya"]`、`KYA`サービスエントリ、`"kya"`メタデータキー、および8004バリデータとして機能し、`tag = "kya:<8 hex of schemeId>"`の下でレベルを0〜100にミラーリングする**KYAブリッジ (KYA Bridge)**が含まれます。これにより、8004のみのクライアントは、8004に変更を加えることなくKYAの結果を確認できます。

このフレームワークは、KYAアルゴリズムやクレジットルールを定義することはありません。それがポイントです。評判の計算における8004と同様に、ルールをオンチェーンで固定すると[[Final|ファイナル]]になる前に陳腐化しますが、ルールを格納するコンテナは陳腐化しません。

## リポジトリの内容

完全な[[ERC|Ethereum Request for Comments (ERC)]]テキスト、リファレンス契約（`KYASchemeRegistry`、`KYARegistry`、`KYAPolicyRegistry`、`KYABridge8004`、Groth16→IKYAVerifierアダプター）、スキーム/ポリシー/検出ドキュメントのJSONスキーマ、決定論的ベクトル（ID、[[EIP-712-attestation-profile|EIP-712]]ダイジェスト、ERC-165 ID）、アテステーションおよび証明されたフロー、取り消し/有効期限、ポリシー評価、および完全な8004ブリッジの往復をカバーする17ケースのエンドツーエンドスイート（インプロセス[[EVM|EVM (イーサリアム仮想マシン)]]上）が含まれています。

## 特にフィードバックを希望する点

1.  **サブジェクトの抽象化 (Subject abstraction)** — `erc8004`をMUSTとし、`account` / `erc721` / `did`をオプションとする`(subjectType, subjectData)`が適切な切り口でしょうか、それともv1は8004のみにすべきでしょうか？
2.  **証明モードにおける検証者＝発行者 (Verifier-as-issuer)** — 依拠当事者は、アテスターを信頼するのと同じように検証者アドレスを信頼します。この語彙は許容できるでしょうか、それとも証明されたアサーションは別の`verifier`フィールドを持つべきでしょうか？
3.  **ブリッジ設計 (Bridge design)** — オペレーターが設定した発行者とレベル→0〜100マップ、決定論的な`requestHash`が`(agentId, schemeId)`にバインドされたキュレーション済みバリデータです。検証（Validation）にミラーリングする（評判（Reputation）ではない）のは正しい選択でしょうか？
4.  **ナリファイアのスコープ設定 (Nullifier scoping)** — `scheme`対`scheme-epoch`。ドメイン分離（chainId + registry）はSHOULDではなくMUSTであるべきでしょうか？
5.  [[ERC-8143|ERC-8143]]および汎用[[Attestation|アテステーション（証明）]]サービスとの関係 — このドラフトは、どちらの上にも位置づけられるエージェントKYAセマンティックレイヤーとして自らを位置づけています。反論を歓迎します。

同じ著者による先行研究: [[ERC-8338|ERC-8338 (トークン結合型実行可能スキル)]]（Token-Bound Executable Skills）、[[ERC-8414|ERC-8414]]（Token-Bound Task Tenders）。これらは情報提供のユースケースとしてのみここに登場し、この[[ERC|Ethereum Request for Comments (ERC)]]はそれらに依存しません。

*7投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/draft-erc-know-your-agent-kya-framework-trust-assertions-for-agents-zk-kya-profile-erc-8004-binding/29735)
