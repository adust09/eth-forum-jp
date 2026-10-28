---
title: 'Proof of One: 暗号化された投票用紙による一人一票の投票システム — 設計と参照コード、批判的レビューを募集'
original_title: >-
  Proof of One: one-person-one-identity polling with encrypted ballots — design
  and reference code, requesting critical review
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/proof-of-one-one-person-one-identity-polling-with-encrypted-ballots-design-and-reference-code-requesting-critical-review/26184
author: NemoUnus
date: '2026-10-27'
category: Privacy
tags:
  - privacy
  - cryptography
  - zk
  - applications
  - protocol-design
  - identity-verification
  - polling
topic_id: '26184'
translated_at: '2026-10-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Proof of One: one-person-one-identity polling with encrypted ballots — design and reference code, requesting critical review](https://ethresear.ch/t/proof-of-one-one-person-one-identity-polling-with-encrypted-ballots-design-and-reference-code-requesting-critical-review/26184) — NemoUnus (2026-10-27)

皆さん、こんにちは。

Proof of One の仮名メンテナー、Nemo Unusです。これは、以下の4つの特性を持つ投票システムのためのオープンソースで非営商的な設計です。

1.  各参加者は唯一の人間である。
2.  オペレーターを含め、誰も回答を個人に紐付けられない。
3.  各投票者は自身の記録された投票用紙を検証できる。
4.  誰でも公開データから結果を集計できる。

まず開示しておきますが、現在の設計とコードのほとんどは、AGENTS.mdで開示されているAIエージェントのチームと共にドラフトされました。まだ独立した人間によるレビューは行われていません。そのため、ここに投稿しています。

**設計の概要**

-   **登録、文書。** 電話はNFC経由でICAO 9303パスポートチップを読み取ります。チップデータが、検証済み署名者の公開ツリー内の文書署名者によって署名されたことを、文書を明らかにすることなく[[glossary/Zero-Knowledge-Proof|ゼロ知識証明]]で証明します。参照回路はSHA-256とRSA-2048を扱い、577,678個の制約を持ちます。電話での証明時間はまだ測定されていません。
    -   署名者は、公開されている国署名証明書 (country signing certificates) の信頼リストと照合されます。このリストは参照のみを保持し、誰でも再構築できるハッシュを持っています。最初のバージョンはドイツのマスターリストから構築されており、186のチップパスポート発行国のうち113カ国が含まれています。
-   **登録、個人。** ライブの顔は、アテステーションされたエンクレーブ (attested enclave) 内でチップ写真と照合されます。重複はOPRF文書フィンガープリント (OPRF document fingerprint) と1:N顔検索によって検出されます。エンクレーブは隠蔽コミットメント (hiding commitment) のみを署名します。その後、電話は資格情報保持のZK証明 (ZK proof of holding a credential) と共に自身のアイデンティティリーフ (identity leaf) を登録するため、エンクレーブは個人をリーフに紐付けることはできません。隠された取り消しハンドル (hidden revocation handle) により、再登録時に古いアイデンティティを、それがどのリーフであったかを明らかにすることなく取り消すことができます。
-   **投票。** 投票用紙は、投票ごとの閾値鍵の下でのBaby Jubjub上のワンホット指数エルガマル (one-hot exponential ElGamal) です。[[glossary/Groth16-proof|Groth16証明]] (32,607個の制約; iPhone 14のブラウザで3.5秒) は、メンバーシップ、非取り消し、[[glossary/nullifier|ナリファイア]]、適格性、および投票用紙の整形式性をカバーします。ナリファイアごとの最新の投票用紙が有効となります。
-   **集計。**
    -   投票用紙は準同型に合計されます。
    -   投票ごとの鍵は、GJKR形式の分散鍵生成 (GJKR-style distributed key generation) から得られ、その苦情は誰でも公開トランスクリプト (public transcript) から解決できます。
    -   受託者はDLEQ証明 (DLEQ proofs) と共に部分的な復号を公開します。
    -   コントラクトは、カウントの合計が異なる投票者の数と等しく、それが適格なアイデンティティの数以下であることを確認します。その後7日間の異議申し立て期間 (challenge window) が続き、鍵シェア (key shares) はその後削除されます。
-   **明示された限界。** パスポートを発行する当局は、本物そっくりのアイデンティティをミント (mint) することができます。私たちは、不可能ではなく、コストがかかり、限定的で、可視的であることを目指しています。

**既存の作業との関連性**

-   VocdoniのDAVINCIと[[glossary/MACI|MACI (Minimum Anti-Collusion Infrastructure)]]は投票用紙側をうまく解決しており、私たちの投票レイヤー (ballot layer) はDAVINCIのそれに近いものです（閾値エルガマル (threshold ElGamal)、DKG、ナリファイア、再投票 (re-voting)）。違いはセンサス (census) です。これらのシステムでは、主催者が投票者リストを提供します。私たちの主な貢献は、登録サービス (enrolment service) が個人をそのアイデンティティに紐付けられないようにする方法で、チップ文書 (chip documents) から構築された唯一の人間 (unique humans) のセンサスです。私はDAVINCIの著者たちに、このようなレジストリが彼らのセンサスとして組み込めるかどうかをスレッドで尋ねました。
-   DAVINCIとは異なり、私たちは再投票 (re-voting) を超える領収書不要性 (receipt-freeness) をまだ持っていません。オペレーターによる再暗号化 (operator re-encryption) と各投票者が自身の投票用紙を検証する能力を組み合わせることに関する見解は、非常に歓迎されます。
-   ZKパスポートプロジェクト (ZK-passport projects)、人間性証明システム (proof-of-personhood systems)、および検証可能な投票システム (verifiable voting systems) とのより詳細な比較は、リポジトリ (repository) にあります（ランドスケープレビュー (landscape review)、修正歓迎）。

**特に批判を求める点**

1.  エンクレーブが取り消しハンドル (revocation handle) を知っている場合の登録資格情報 (enrolment credential) の非リンク性 (issue #3)
2.  投票回路 (ballot circuit) と集計チェック (tally checks) の完全性 (issue #2)
3.  脅威モデルの「根本的な限界」が正直に提示されているか (issue #1)
4.  オープンプロジェクトが信頼する国署名証明書 (country signing certificates) をどのように取得し、監査すべきか (issue #14)。フィールドテストでは、本物のチップを正しく読み取ったものの、発行国の証明書が不足していたために検証できなかった商用検証者が見つかりました。
5.  セレモニー (ceremony) 付きGroth16とユニバーサルセットアップ (universal setup) の比較 (issue #7)

**リンク**

-   リポジトリ: [GitHub - NemoUnus/proof-of-one: オープンで検証可能な投票ネットワーク：一人の人間、一つのアイデンティティ、一つの声。設計段階 — 未監査。 · GitHub](https://github.com/NemoUnus/proof-of-one)
-   技術概要 (15分): [proof-of-one/docs/review/technical-brief-v0.1.md at c005a021043d4edfb10e91aa7ae326b7f7c29243 · NemoUnus/proof-of-one · GitHub](https://github.com/NemoUnus/proof-of-one/blob/c005a021043d4edfb10e91aa7ae326b7f7c29243/docs/review/technical-brief-v0.1.md)
-   エリア別質問付きレビュアーガイド: [proof-of-one/REVIEWING.md at c005a021043d4edfb10e91aa7ae326b7f7c29243 · NemoUnus/proof-of-one · GitHub](https://github.com/NemoUnus/proof-of-one/blob/c005a021043d4edfb10e91aa7ae326b7f7c29243/REVIEWING.md)
-   ランドスケープレビュー: [proof-of-one/docs/research/landscape-review-v0.1.md at c005a021043d4edfb10e91aa7ae326b7f7c29243 · NemoUnus/proof-of-one · GitHub](https://github.com/NemoUnus/proof-of-one/blob/c005a021043d4edfb10e91aa7ae326b7f7c29243/docs/research/landscape-review-v0.1.md)
-   参照コード (93のテスト、その多くは攻撃ケース): [proof-of-one/reference at main · NemoUnus/proof-of-one · GitHub](https://github.com/NemoUnus/proof-of-one/tree/main/reference)

トークンはなく、販売するものもありません。厳しい批判が最も役立ちます。ありがとうございます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/proof-of-one-one-person-one-identity-polling-with-encrypted-ballots-design-and-reference-code-requesting-critical-review/26184)
