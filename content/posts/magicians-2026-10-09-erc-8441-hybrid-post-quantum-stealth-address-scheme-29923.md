---
title: 'ERC-8441: ハイブリッド量子耐性[[glossary/Stealth-Address-Protocol|ステルスアドレス]]スキーム'
original_title: 'ERC-8441: Hybrid post-quantum stealth address scheme'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8441-hybrid-post-quantum-stealth-address-scheme/29923
author: namncc
date: '2026-10-09'
category: ERCs
tags:
  - ercs
  - cryptography
  - privacy
  - account-abstraction
  - eip
  - post-quantum
  - security
topic_id: '29923'
translated_at: '2026-10-10'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8441: Hybrid post-quantum stealth address scheme](https://ethereum-magicians.org/t/erc-8441-hybrid-post-quantum-stealth-address-scheme/29923) — namncc (2026-10-09)

皆さん、こんにちは。

[[glossary/ERC|ERC]]-5564の[[glossary/Stealth-Address-Protocol|ステルスアドレス]]に量子耐性スキームを追加するドラフト[[glossary/ERC|ERC]]について、フィードバックをいただきたく思います。

ドラフト: [pq-stealth-scheme3-public/spec/ERC-VVVV-schemeid3.md at main · namnc/pq-stealth-scheme3-public · GitHub](https://github.com/namnc/pq-stealth-scheme3-public/blob/main/spec/ERC-VVVV-schemeid3.md)
参照実装、テストベクトル、ガスハーネス: [GitHub - namnc/pq-stealth-scheme3-public: pq-stealth-scheme3-public · GitHub](https://github.com/namnc/pq-stealth-scheme3-public/tree/main)

## 概要

[[glossary/ERC-5564|ERC-5564]]は[[glossary/Stealth-Address-Protocol|ステルスアドレス]]と`schemeId`ネームスペースを定義し、secp256k1上で`schemeId` 1という1つのスキームを規定しています。このドラフトでは`schemeId` 3を規定します。その支払いシークレット (payment secret) は、ML-KEM-768のカプセル化とsecp256k1 ECDHシークレットを組み合わせることで、将来量子コンピュータを構築する攻撃者であっても、ML-KEM-768が安全である限り、公開されたアナウンスログから誰に支払われたかを特定できないようにします。

支出（Spending）は変更されません。各[[glossary/Stealth-Address-Protocol|ステルスアドレス]]は通常のsecp256k1 [[glossary/EOA|EOA]]です。このスキームは、デプロイ済みの[[glossary/ERC-5564|ERC-5564]]アナウンサーと[[glossary/ERC-6538|ERC-6538]]レジストリをそのまま使用し、プロトコルの変更や新しいコントラクトは不要です。

## なぜ今なのか

アナウンスは公開され、永続的です。`schemeId` 1では、離散対数を計算できる者であれば誰でも、登録された各ビューイングキー (viewing key) を使って、過去のすべての支払いが誰に行われたかを特定できます。将来構築される量子コンピュータは、今日公開されたアナウンスに対してもこれを行うことができるため、そのようなコンピュータが存在する前に保護を導入する必要があります。盗難は異なります。資金がまだ存在している間に量子コンピュータが必要であり、支出は別途移行できます。

## 設計の概要

-   **鍵.** 128バイトのシードから、支出鍵 (spending key)、ECDHビューイングキー、およびML-KEM-768シード`(d, z)`が生成されます。[[glossary/stealth-meta-address|ステルスメタアドレス]]は`spending_pk || viewing_pk_ec || ek`で、1,250バイトあり、[[glossary/ERC-6538|ERC-6538]]に一度登録されます。96バイトのトラッキングキー (tracking key) `viewing_ec || d || z`はスキャンサービスに渡すことができ、サービスは支払いを見つけることはできますが、それを使うことはできません。
-   **支払いシークレット (Payment secret).** `ss = SHA3-256(DS || ss_ec || ss_pq || epk || ct || viewing_pk_ec || ek)`。両方の共有シークレットと両方の暗号文をハッシュ化することで、ML-KEMに固有の何かに依存することなく、いずれかのコンポーネントがIND-CCAである場合にIND-CCAを維持します。
-   **アナウンス.** `ephemeralPubKey = epk || ct` (1,121バイト) であり、`metadata`はビュータグ (view tag) で、オプションで[[glossary/ERC-5564|ERC-5564]]のトークンメタデータが続きます。したがって、[[glossary/ERC-5564|ERC-5564]]のメタデータレイアウトとそのメソッドシグネチャは変更なく適用されます。
-   **オフセットとビュータグ (view tag).** どちらも`ss`の個別のドメイン分離 (domain-separated) されたSHA-256ダイジェストから導出されます。ビュータグは[[glossary/key-encapsulation-mechanism|KEM]]の後に導出されます。なぜなら、ECDHシークレットのみから計算されたタグは、量子攻撃者がほとんどの候補受信者を排除することを可能にするからです。
-   **送信者ランダム性 (Sender randomness)** はCSPRNGから得られ、カプセル化はプレーンな`ML-KEM.Encaps(ek)`であるため、FIPS検証済みのML-KEMライブラリが機能します。

## コスト (プラハ、正規コントラクトに対するローカルノードでの測定)

| | アナウンス | 登録（受信者ごとに1回） |
| --- | --- | --- |
| schemeId 1 (古典的) | 28 313 gas | 115 310 gas |
| schemeId 3 | 69 330 gas (2.45x) | 964 737 gas |
| schemeId 3、[[glossary/ERC-5564|ERC-5564]]トークンメタデータ付き | 70 550 gas | |

`schemeId` 3の支払い全体（アナウンス、資金調達、支出）は111,330ガスかかります。`schemeId` 3のアナウンスは[[glossary/EIP|EIP]]-7623のコールデータフロア (calldata floor) に収まるため、そのコストはコールデータサイズのみによって決まります。スキャンには、アナウンスごとに1回のECDH、1回のML-KEM-768デカプセル化 (decapsulation)、および1回のハッシュ計算が必要で、より安価な事前フィルターはありません。

## このスキームが提供しないもの

このスキームは、アナウンスとその受信者間のリンクを保護するだけで、それ以外のことは行いません。支出は古典的なままです。量子コンピュータが存在するようになると、支出によって公開鍵が明らかになった時点で[[glossary/Stealth-Address-Protocol|ステルスアドレス]]は露呈します。登録された支出鍵 (spending key) も同様に危険にさらされるため、支払いの`ss`を保持している者（委任されたスキャナーを含む）は誰でもそれを使うことができます。それまでに資金は別途移行する必要があります。資金の転送、スイープ、タイミング、金額は、他の[[glossary/Stealth-Address-Protocol|ステルスアドレス]]スキームと同様に、依然として支払いをリンクする可能性があります。

## 特にフィードバックをいただきたい点

1.  **`ephemeralPubKey`内の`ct`について。** これにより[[glossary/ERC-5564|ERC-5564]]のメタデータとメソッドシグネチャはそのまま維持されますが、33バイトの一時鍵 (ephemeral key) を前提とするツールは`schemeId`に基づいてディスパッチ (dispatch) する必要があります。これは許容されますか？
2.  **[[glossary/stealth-meta-address|ステルスメタアドレス]]の長さについて。** 1,250バイトという長さは、[[glossary/ERC-5564|ERC-5564]]の`n` / `2n`ルールに適合しません。これは[[glossary/ERC-5564|ERC-5564]]からの唯一残る逸脱点です。
3.  **[[glossary/key-encapsulation-mechanism|KEM]]の匿名性について。** このスキームでは、ML-KEM-768の暗号文が受信者を漏洩しないこと（[[glossary/Indistinguishability-of-keys|ANO-CCA]]）が必要です。公開されている証明はラウンド3のKyberを対象としており、CRYPTRECのML-KEM評価では、その議論がML-KEMにも適用されると述べられています。これを前提としていますが、標準化されたML-KEMに対する証明を知っている方はいますか？
4.  **コンバイナー (combiner) について。** X-Wingに従うのではなく、6つの入力すべてをハッシュ化しており、SP 800-56C承認のコンバイナーではありません。ここでNISTの承認を必要とする方はいますか？
5.  **ダウングレードについて。** `schemeId` 1と3の両方で登録された受信者は、`schemeId` 1のみを知るウォレットによって、量子耐性保護なしで支払いを受けることができます。ドラフトでは、`schemeId` 3を実装する送信者がそれを優先するようにし、受信者には`schemeId` 3のみを登録するようアドバイスしています。
6.  **スキャンコストについて。** 各アナウンスは、ビュータグ (view tag) をチェックする前にデカプセル化 (decapsulation) を必要とします。これはウォレットやスキャンサービスにとってどの程度重要でしょうか？

Nam Ngo (@namnc)、Pierre Daix-Moreux ([@dmpierre](https://ethereum-magicians.org/u/dmpierre))、kassandra.eth (@kassandraoftroy) より

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8441-hybrid-post-quantum-stealth-address-scheme/29923)
