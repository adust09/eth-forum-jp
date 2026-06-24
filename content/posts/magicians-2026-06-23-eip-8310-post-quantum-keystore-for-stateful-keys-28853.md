---
title: 'EIP-8310: ステートフル鍵のためのポスト量子キーストア'
original_title: 'EIP-8310: Post-Quantum Keystore for Stateful Keys'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8310-post-quantum-keystore-for-stateful-keys/28853
author: ch4r10t33r
date: '2026-06-23'
category: EIPs
tags:
  - eips
  - cryptography
  - post-quantum
  - security
  - consensus
  - validators
  - protocol-design
  - keystore
  - xmss
topic_id: '28853'
translated_at: '2026-06-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8310: Post-Quantum Keystore for Stateful Keys](https://ethereum-magicians.org/t/eip-8310-post-quantum-keystore-for-stateful-keys/28853) — ch4r10t33r (2026-06-23)

このスレッドは、**[[glossary/EIP|EIP（Ethereum 改善提案）]]-8310: ステートフルな[[glossary/Hash-based-signatures|ハッシュベース署名]]鍵**（[[glossary/leanSpec|Lean Ethereum]] [[glossary/Consensus-Layer|コンセンサス層]]で使われるXMSS、`leanxmss`と呼ばれる）のためのキーストアフォーマットを定義する、標準トラック（コア）提案に関する議論のためのものです。

これは[[glossary/ERC|ERC（Ethereum Request for Comments）]]-2335を拡張し、暗号化されたシークレットがXMSSシードになることを可能にし、*消費可能な*鍵が必要とするメカニズムを追加します。

-   **ドラフトPR:** [Add EIP: Post-Quantum Keystore for Stateful Keys by ch4r10t33r · Pull Request #11820 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/11820)

## 動機

[[glossary/ERC|ERC（Ethereum Request for Comments）]]-2335は再利用可能な32バイトのBLSスカラーを保存します。[[glossary/leanSpec|Lean Ethereum]]は、[[glossary/Post-Quantum|ポスト量子 (PQ)]]セキュリティのために[[glossary/BLS-keys|BLS鍵]]をXMSSに置き換えます。XMSSシークレットは小さなシードに還元されるため、*コンテナ*はわずかな変更で済みますが、セキュリティモデルはそうではありません。

各XMSS署名は、インデックスが**決して**再利用されてはならないワンタイムの[[glossary/Winternitz-One-Time-Signatures|ウィンターニッツ・ワンタイム署名 (WOTS+)]]リーフを消費します。2つの異なるメッセージ間で再利用すると偽造が可能になり、鍵が破壊されます。この単一の特性が、今日のツールが当然と考える3つのことを壊します。

1.  **不変性**: 2335キーストアは決して変更されません。XMSS鍵は署名ごとに状態を進めます。
2.  **自由なコピー**: BLS鍵の2つのコピーは無害です。XMSS鍵の2つのコピーが独立して署名すると、リーフが再利用されます。
3.  **復元安全性**: *古い*XMSS状態を復元すると、ハイウォーターマークがロールバックされ、再利用を招きます。

同期されたバリアントの場合、「リーフを再利用しない」という原則と[[glossary/EIP|EIP（Ethereum 改善提案）]]-3076の「スロットを二重署名しない」という不変条件は同一であるため、この[[glossary/EIP|EIP（Ethereum 改善提案）]]はその結合を規範とし、スラッシング保護の対象外となるプロトコル外のケース（例: ビルダー入札署名）を特定します。

## EIPが追加するもの

-   明示的で不変な`scheme`パラメータブロック（公開鍵を再生成し、署名を検証するために必要なすべて）。
-   オペレーターの可視性のための非権威的な容量スナップショット。
-   **権威ある署名状態が存在する場所**に関する規範的なルール（同期モードではスラッシング保護DB、カウンターモードでは専用ストア）。
-   **コミット・ビフォア・サイン**の耐久性順序付け（署名をリリースする前に、進んだハイウォーターマークを永続化する）。
-   並行/高スループットの署名者のための**予約済みリーフ範囲**。
-   鍵の署名位置を黙ってリセットすることを禁止する**インポート/エクスポート**のセマンティクス。*回復*と*署名再開*を明確に区別します。
-   マイナーな暗号化アップグレード: AES-256 / AEAD暗号とオプションの`argon2id` KDF。

## 議論のための未解決の質問

1.  **ハッシュ関数。** フォーマットは意図的に**ハッシュ非依存**であり、`scheme.params.hash`が具体的な選択を記録します。Poseidon1（例: [[glossary/KoalaBear-prime-field|KoalaBear素体]]上）は現在、推奨されるインスタンス化として検討されています。ハッシュの選択、および[[glossary/EIP|EIP（Ethereum 改善提案）]]が何を推奨すべきか、あるいはオープンにしておくべきかについてのフィードバックを歓迎します。
2.  **スキームパラメータ。** 例では、2^32の鍵寿命（`dimension = 46`、`winternitz_w`/base `= 8`、`target_sum = 200`、ターゲットサムエンコーディング）に対するleanSigの推奨プロダクションセットを使用しています。これらは仕様に記載するのに適切なデフォルトでしょうか？
3.  **パラメータ命名。** `winternitz_w`はチェーンごとのベースに使用されていますが、ハイパーキューブ/ターゲットサムの定式化に合わせて`base`と命名すべきでしょうか？
4.  **カウンターモード状態ストア。** 専用のカウンターモードストアに指定された耐久性/アトミック性の基準は、クライアント全体で十分であり、実装可能でしょうか？
5.  **予約済み範囲。** 範囲ベースのパーティショニングは、ビルダー入札枯渇ケースに適したメカニズムでしょうか、それとも異なる並行性モデルが好ましいでしょうか？

[ドラフトPR](https://github.com/ethereum/EIPs/pull/11820)に関するフィードバック、異議、レビューはすべて歓迎します。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/eip-8310-post-quantum-keystore-for-stateful-keys/28853)
