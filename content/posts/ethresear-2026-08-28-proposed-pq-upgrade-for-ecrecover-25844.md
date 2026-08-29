---
title: ecrecoverに対する量子耐性ホットフィックスの提案
original_title: Proposed PQ upgrade for ecrecover
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/proposed-pq-upgrade-for-ecrecover/25844'
author: mirabelenkiy-circle
date: '2026-08-28'
category: Cryptography
tags:
  - cryptography
  - post-quantum
  - evm
  - eip
  - security
  - smart-contracts
  - account-abstraction
topic_id: '25844'
translated_at: '2026-08-29'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Proposed PQ upgrade for ecrecover](https://ethresear.ch/t/proposed-pq-upgrade-for-ecrecover/25844) — mirabelenkiy-circle (2026-08-28)

# ecrecoverに対する量子耐性ホットフィックスの提案

今日デプロイされている多くの[[glossary/EVM|EVM (イーサリアム仮想マシン)]]コントラクトは、ECDSA署名を検証するために`ecrecover`を使用しており、量子攻撃に対して脆弱である。`ecrecover`オペコードを完全に無効にするのではなく、`ecrecover`を更新して、[[glossary/Frame-Transactions|EIP-8141フレームトランザクション]]から[[glossary/Post-Quantum|ポスト量子 (PQ)]]署名を読み取れるようにすることができる。65バイトの署名`(v, r, s)`はルックアップ値をエンコードするために使用できる。センチネル値は、元のECDSAリカバリの代わりに新しいルックアップパスをトリガーする。これにより、不変なデプロイ済みコントラクトに対して、スムーズな移行パスが作成される。この提案は、EOAアカウント自体を修正することを目的としていない。

## 後方互換性の制約

1.  [[glossary/EVM|EVM]]は`ecrecover`を`pure`関数として定義している。公開鍵、クレームされたアカウント、署名、および検証関数のいかなるルックアップも、デプロイ済みのバイトコードやコンパイラを壊してはならない。
2.  [[glossary/EVM|EVM]]は`bytes32 r < n`であることをチェックする。`r`にエンコードされる値は`0x00`バイトで始まる必要がある。
3.  OpenZeppelinの`ECDSA.tryRecover`バージョン4.7以前では、`v ∈ {27, 28}`および`s < n/2`であることもチェックされる。
4.  [[glossary/EIP-7702|EIP-7702]]デリゲートはEOAに代わってトランザクションを送信できるが、EIP-3009のようなガスレスパーミットや承認に署名することはできない。`ecrecover`の更新は、これを予期せず許可すべきではない。

## 提案された解決策

この投稿は、[[glossary/Frame-Transactions|EIP-8141]]を活用した高レベルの提案である。[[glossary/Frame-Transactions|EIP-8141]]が大幅な変更を受けることを理解した上で、**[[glossary/Frame-Transactions|EIP-8141]]の最終バージョンには、おそらく正規の認証器セットを持つ`pure`検証関数が含まれるだろう。**

**センチネル値。** 新しい実行パスをトリガーするセンチネル値として`v = 27`, `s = 0`を提案する。`v = 27`, `s = 0`の組み合わせは、`v ∈ {27, 28}`を強制する初期のOpenZeppelinベースのコントラクトを尊重しつつ、新しい実行パスを明確に識別する。なぜなら、有効なECDSA署名では`s = 0`になることはないからである。

**ルックアップ。** ルックアップ情報は次のようにエンコードできる。

```
r = 0x00 || signatureIndex (11-byte) || verificationFunctionId (20-byte)
```

先頭の`0x00`バイトは`r < n`を保証する。`bytes11 signatureIndex`は`2^88`個の署名を可能にする。これは、[[glossary/Gas|ガス]]上限のため[[glossary/Frame-Transactions|フレームトランザクション]]に含めることができる数よりも多い。`bytes20 verificationFunctionId`は、`pure`署名検証関数を呼び出すために使用される固定列挙型であるか、固定の鍵登録プリコンパイル（`pure`として扱われる）内のハッシュテーブルへのルックアップのいずれかである。

**クレームされたアドレス。** `claimed`アドレスは公開鍵を承認する必要がある。いくつかの選択肢がある。

-   [[glossary/EIP-8164|EIP-8164]] (ここでアカウントコードは`0xef0101 || pubkey`となる)。
-   [[glossary/EIP-7932|EIP-7932]]は、有効な[[glossary/EVM|EVM]]アドレスを公開鍵のハッシュとして定義する。
-   [[glossary/EIP-8130|EIP-8130]]は、指定されたキーストアコントラクトを作成する。

ここでの課題は、`pure`検証を維持することである。設計は、[[glossary/Frame-Transactions|EIP-8141]]が取る最終的な形式、および/または上記の[[glossary/EIP|EIP（Ethereum Improvement Proposal）]]の採用に依存するだろう。

**署名検証。** [[glossary/Frame-Transactions|EIP-8141]]の`tx.signature[]`は配列であり、各エントリには`scheme`、`signer`、`msg`、および`signature`（公開鍵を含む場合がある）が含まれる。期待される不変条件は、各`signature`が`msg`に対して有効であることである。

```
scheme = ARBITRARY

signer = (empty)

msg = h

signature = pk || signature
```

[[glossary/Frame-Transactions|EIP-8141]]は、ARBITRARYスキームの場合`len(signer)=0`であることを期待する。`signature`が`msg`に対して有効であるという期待される不変条件があるため、`ecrecover(h,...)`は`msg==h`であり、`verifySignature(pk, msg)==true`であることをチェックする必要がある。署名検証はまた、`claimed`が`pk`を承認していること（上記の未定のメカニズムを使用して）をチェックする必要がある。

**出力。** 関数`ecrecover`は、成功時には`claimed`を返し、失敗時には`address(0)`を返す。

## 代替アプローチ

-   有効なECDSA値ではない`v = 29`のようなセンチネル値を使用する。これは`v = 27`, `s = 0`よりもクリーンであり、`r < n`と`s < n/2`の両方にデータをエンコードすることを可能にし、異なる`v`のセンチネル値を持つ将来のアップグレードへのパスを作成する。しかし、これは古いOpenZeppelinベースのスマートコントラクトを破壊する。

-   `(v, r, s)`または`tx.signature`に`claimed`アドレスをエンコードし、[[glossary/ERC-1271|ERC-1271]]を活用して`claimed.isValidAuthorization()`に`STATICCALL`する。これにより、既存のECDSAアドレスが公開鍵を承認する方法が作成される。しかし、[[glossary/ERC-1271|ERC-1271]]の`isValidAuthorization()`は`view`関数であり、`ecrecover`の期待される動作を壊す可能性がある。また、[[glossary/EIP-7702|EIP-7702]]デリゲートがEIP-3009の`transferWithAuthorization`リクエストに署名することも可能になる。最後に、`isValidAuthorization`が`APPROVE`を呼び出す場合、特定の署名をチェックすることが意図されていたにもかかわらず、[[glossary/Frame-Transactions|フレームトランザクション]]全体を承認してしまう可能性がある。

-   [[glossary/Frame-Transactions|フレームトランザクション]]署名内に公開鍵を含め、`claimed`アドレスを[[glossary/Post-Quantum|ポスト量子]]公開鍵のハッシュとして計算する。これにより、`claimed`が公開鍵を承認し、`ecrecover`チェックをパスするための`pure`メカニズムが作成される。しかし、そのようなアドレスに誤って送信されたETHやトークンは、`claimed`が有効なECDSAアドレスではないため、回復不能になる可能性がある。

*3投稿 - 3参加者*

[トピック全文を読む](https://ethresear.ch/t/proposed-pq-upgrade-for-ecrecover/25844)
