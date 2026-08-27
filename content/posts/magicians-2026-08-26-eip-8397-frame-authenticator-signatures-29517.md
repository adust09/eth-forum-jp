---
title: 'EIP-8397: フレーム認証署名'
original_title: 'EIP-8397: Frame Authenticator Signatures'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8397-frame-authenticator-signatures/29517'
author: taek.eth
date: '2026-08-26'
category: EIPs core
tags:
  - eips-core
  - eip
  - protocol-design
  - cryptography
  - security
  - execution-layer
  - account-abstraction
  - pbs
  - mempool
topic_id: '29517'
translated_at: '2026-08-27'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8397: Frame Authenticator Signatures](https://ethereum-magicians.org/t/eip-8397-frame-authenticator-signatures/29517) — taek.eth (2026-08-26)

ドラフト[[glossary/EIP|EIP（Ethereum 改善提案）]] **フレーム認証署名**に関する議論トピック。これは、[[glossary/EIP-8141|EIP-8141 (フレームトランザクション)]]の関連コア[[glossary/EIP|EIP]]であり、制限付きの`AUTHENTICATOR`署名スキームを追加するものである。

ドラフトPR: [Add EIP: Frame Authenticator Signatures by leekt · Pull Request #12244 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12244)

## 概要

`AUTHENTICATOR`は、[[glossary/Frame-Transactions|フレームトランザクション (Frame Transactions)]]がカスタム認証証明を運ぶことを可能にする。この証明の高コストな暗号学的検証は、[[glossary/Protocol|プロトコル]]によって制限された[[glossary/State-Preservation|状態独立コンテキスト]]で実行される。アカウント認証（Account authorization）は通常の`VERIFY`フレームで行われる。

```
[scheme, signer, msg, signature]

scheme    = AUTHENTICATOR (0x03)
signer    = authenticator address
signature = key_id || proof

authenticator.authenticate(digest, proof) -> authenticated key_id
require authenticated key_id == claimed key_id
resolved_signer = authenticator
-> VERIFY frame: account decides whether it trusts the authenticator
```

### 提供される機能

-   固定された`AUTHENTICATOR_GAS_LIMIT`（50k）を持つ[[glossary/Protocol|プロトコル]]によって検証される任意の署名スキーム。純粋なコンテキストで実行され、状態（state）やブロック/環境の読み取りはなく、[[glossary/Predeploys|プリコンパイル]]の`STATICCALL`のみを使用する。
-   高コストな暗号処理（[[glossary/Protocol|プロトコル]]）と状態を持つポリシー（`VERIFY`）の分離。
-   認証されたクレデンシャルID: 認証器は`key_id`を返し、それが主張された値と照合されるため、[[glossary/Transaction-Validation|トランザクション作成者]]によって偽造されることはない。
-   [[glossary/Block-Building|ビルダー]]/[[glossary/sequencer|シーケンサー]]は、ルーティング、キャッシング、バッチ処理、DoSアカウンティングのために実行前に`(authenticator, key_id)`を認識する。[[glossary/Account-level-authorization|アカウントコード]]は、既存の`SIGDATACOPY`を介して`key_id`をオプションで読み取ることができる。
-   固定された[[glossary/Consensus-Layer|コンセンサス]]コストでのパーミッションレスな認証器。[[glossary/on-chain-registry|レジストリ]]や[[glossary/Validator-Whitelist|アローリスト]]は不要。
-   `compute_sig_hash`は変更されない。`signature`バイトは、他のすべての[[glossary/EIP-8141|EIP-8141]]スキームと同様に、コミットされていない[[glossary/Zero-Knowledge-Proof|ウィットネス]]として残る。

### アカウント / 認証器の実装に委ねられること

`(authenticator, key_id)`でキー付けされたアクター[[glossary/on-chain-registry|レジストリ]]、キーごとのスコープとポリシー、セッションキーと有効期限、ローテーション/取り消し、リカバリーとガーディアン、JITキー認証（明示的な`msg`を持つ`AUTHENTICATOR`署名 + ルート署名）、[[glossary/ERC|ERC]]-1271、コールフェーズエグゼキューター。これらはどれも[[glossary/Enshrinement|プロトコルに組み込まれる]]ものではない。関連[[glossary/ERC|ERC]]で標準化できる。

### 残された作業（別のEIP / EIP-8141の修正）

1.  既存のコードレス[[glossary/EOA|EOA（外部所有アカウント）]]の同一アドレス確立 / 最初のトランザクションでのカスタム認証。
2.  `MAX_VERIFY_GAS`: 送信者と支払い者の両方が`AUTHENTICATOR`を使用する場合（2 x 52,600）、100kのパブリック[[glossary/Mempool|メムプール]]上限を超える。
3.  [[glossary/EIP-8141|EIP-8141]]の直接評価リストにおける規範的なアカウントプロファイル。
4.  規範的な`valid_after`検証器。
5.  [[glossary/EIP-8250|EIP-8250 (キー付きNonce)]]を介した同一送信者による並列パブリック[[glossary/Mempool|メムプール]]。

固定された50kの認証器予算、認証器コード読み取りの[[glossary/Block-Access-List-Byte-Floor|ブロックアクセスリスト]]処理、そして`key_id`が[[glossary/Contract-Storage-Layout|ワイヤーフォーマット]]に残るべきかについて、特にフィードバックを歓迎する。

## 更新ログ

-   2026-08-26: 初期ドラフト、[Add EIP: Frame Authenticator Signatures by leekt · Pull Request #12244 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12244)

## 外部レビュー

2026-08-26現在なし。

## 未解決の課題

2026-08-26現在なし。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8397-frame-authenticator-signatures/29517)
