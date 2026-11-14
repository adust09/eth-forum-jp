---
title: 'ERC-8499: BIP-39からのハッシュベース鍵導出'
original_title: 'ERC-8499: Hash-Based Key Derivation from BIP-39'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8499-hash-based-key-derivation-from-bip-39/30375
author: johba
date: '2026-11-13'
category: ERCs
tags:
  - ercs
  - cryptography
  - security
  - post-quantum
  - account-abstraction
  - wallet
  - eip
  - protocol-design
topic_id: '30375'
translated_at: '2026-11-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8499: Hash-Based Key Derivation from BIP-39](https://ethereum-magicians.org/t/erc-8499-hash-based-key-derivation-from-bip-39/30375) — johba (2026-11-13)

BIP-39フレーズからハッシュベースの[[Post-Quantum|ポスト量子 (PQ)]]鍵（[[leanSPHINCS|leanSPHINCS]]、[[SLH-DSA|SLH-DSA (SPHINCS+)]]、[[Winternitz-One-Time-Signatures|WOTS+（ウィンターニッツ・ワンタイム署名）]]、[[FORS|FORS（フォレスト・オブ・ランダム・サブセット）]]、[[eXtended-Merkle-Signature-Scheme|XMSS（拡張マークル署名スキーム）]]）をウォレットがどのように導出するかを規定する[[Draft|ドラフト (EIP/ERC)]] ERC についてフィードバックをいただきたいです。

ドラフト: [Add ERC: Hash-Based Key Derivation from BIP-39 by johba37 · Pull Request #2172 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/2172)

## なぜ

コントラクトはすでに[[ERC-1271|ERC-1271]]と[[Account-Abstraction|アカウント抽象化 (AA)]]を通じてハッシュベース署名を検証しており、[[EIP-8288|EIP-8288]]は[[leanSPHINCS|leanSPHINCS]]を集約するでしょう。ユーザーはBIP-39フレーズでアカウントをバックアップしていますが、フレーズがハッシュベース鍵になる方法を規定する標準がなく、実装は乖離しています。

-   BIP-39エントロピー (entropy) から、アプリケーションラベルに対する[[keccak256-hash|Keccak-256ハッシュ]]を使用（私が取り組んでいるWinterlock署名者は現在この方法を採用）。
-   フレーズと独自のソルトに対する2回目のPBKDF2を通じて（[[WOTS-39|WOTS-39]]）。
-   BIP-39シード (seed) に対するHMAC-SHA512を独自のラベルの下で使用（開発中のハードウェアウォレット）。

そのため、同じフレーズでもウォレットが異なると異なる鍵が生成され、別の場所で復元しても鍵は復元されません。

すでにBIP-32を実装しているウォレットは、それを通じてこれらの鍵を導出するかもしれません。しかし、それ自体が問題を引き起こします。すべてのBIP-32ノードには楕円曲線公開鍵があります。アカウントレベルのxpub（ウォレットが常にウォッチオンリーソフトウェアにエクスポートするもの）が与えられると、[[Post-Quantum|ポスト量子 (PQ)]]攻撃者はそのノードの秘密鍵、そしてその下のすべての強化された子鍵を計算できてしまいます。

## 内容

すべての秘密はHMAC-SHA512で導出されます。まずBIP-39自身のPBKDF2で、次にHKDF (RFC 5869) で導出されます。BIP-32も曲線演算もありません。

```
S    = BIP39-Seed(mnemonic, passphrase)            64 bytes, as BIP-39
R    = HKDF-Extract(salt = "HBKD/v1", S)
seed = HKDF-Expand(R, info, L)
info = purpose || be32(account) || be16(L) || len8(name) || name || tail

purpose 0x01  stateless key                  name = key type
purpose 0x02  stateful key (optional)        name = key type, tail = context || instance
purpose 0x03  application secret (optional)  name = the application's label
```

**コアは小さいです。** ウォレットがルートを導出し、アカウントと鍵タイプで命名された各ステートレス鍵 (stateless key) のシードを導出する場合、それは適合します。ドラフトは、例えば`SLH-DSA-SHA2-128s`のようなFIPS 205自身の12種類の[[SLH-DSA|SLH-DSA (SPHINCS+)]]鍵タイプを定義しています。シードは`SK.seed`、`SK.prf`、`PK.seed`に分割されます。したがって、2つの適合するウォレットは、同じフレーズから同じ[[SLH-DSA|SLH-DSA (SPHINCS+)]]公開鍵を取得します。[[fork|フォーク]]が新しいパラメータセットを修正した場合、ウォレットは同じフレーズから新しい鍵を導出し、古い鍵がそれを証明します。新しいバックアップは不要です。

**3つの部分はオプションです**。なぜなら、2つのウォレットがそれらについて合意する必要がないからです。

-   [[Stateful-Keys|ステートフル鍵]]（[[Winternitz-One-Time-Signatures|WOTS+（ウィンターニッツ・ワンタイム署名）]]、[[FORS|FORS（フォレスト・オブ・ランダム・サブセット）]]、[[eXtended-Merkle-Signature-Scheme|XMSS（拡張マークル署名スキーム）]]）は決して復元されません。各インスタンスは、その状態とともに保存される32バイトのフレッシュなランダムバイトを使用するため、復元されたウォレットはワンタイム鍵 (one-time key) で2回署名することはできません。
-   [[Application-secrets|アプリケーションシークレット]]は、ラベルごとに1つです。
-   [[Random-roots|ランダムルート]]は、フレーズを持たないデバイスや自動署名者向けです。フレーズのステートレス鍵がそれらの鍵を証明し、取り消します。

ドラフトにはテストベクトルと短いPythonリファレンス実装が含まれています。テストベクトルは3つのフレーズ（そのうち2つはBIP-39自身の`TREZOR`ベクトル）、[[Random-roots|ランダムルート]]、アカウント0、1、2^32 − 1、[[Stateful-Keys|ステートフル鍵]]インスタンス、[[Application-secrets|アプリケーションシークレット]]、拒否されるべき入力、およびフレーズから公開鍵までの3つの[[SLH-DSA|SLH-DSA (SPHINCS+)]]鍵をカバーしており、これらは2つの独立したライブラリで再現されます。ブラウザおよびマイクロコントローラ向けのno_std Rustによる2番目の実装も、すべての値を再現します。

## 質問

1.  **シード (seed) またはエントロピー (entropy)？** ドラフトはBIP-39シードから導出するため、パスフレーズ (passphrase) や隠しウォレットは引き続き機能し、シードのみを保持するウォレットでも実装できます。コストとして、パスフレーズの入力ミスは有効だが間違った鍵を生成するため、ウォレットは復元後にフィンガープリント (fingerprint) を表示すべきです。このERCはフィンガープリントのフォーマットを固定し、2つのウォレットが同じものを表示するようにすべきでしょうか？
2.  **`info`レイアウト。** すべてのフィールドは固定幅または長さバイトを持ち、出力長`L`はTLS 1.3のように`info`の一部です。何か不足しているもの、または間違った場所にあるものはありませんか？
3.  **鍵タイプ。** ドラフトは[[SLH-DSA|SLH-DSA (SPHINCS+)]]のものを定義しています。[[leanSPHINCS|leanSPHINCS]]のような他のスキームは、パラメータが確定すれば独自の仕様で定義するでしょう。これは適切な分割でしょうか、それともこのERCがレジストリ (registry) を保持すべきでしょうか？
4.  [[Stateful-Keys|**ステートフル鍵**]]**。** 「ランダムなインスタンスで、決して復元されない」という考え方は正しいでしょうか、それとも信頼性の低いストレージを持つデバイスなど、決定論的なカウンターのケースがあるでしょうか？
5.  **ハードウェアウォレット。** BIP-39シードのみを保存するデバイスにとって、ここで何か困難な点はありますか？
6.  **エージェント (agent) およびその他の自動署名者。** ドラフトでは、コピー可能な署名者（VMスナップショット (VM snapshot)、レプリカ、1つのイメージから複数回起動されるエージェント）はワンタイム鍵 (one-time key) を保持してはならないと述べています。なぜなら、2つのコピーが同じ鍵で署名してしまうからです。自動署名者には、フレーズではなく独自の[[Random-roots|ランダムルート]]を保持し、署名制限に達しない鍵タイプを使用するよう求めています。エージェントウォレット (agent wallet) を構築している方へ：これはエージェントが鍵を保持する方法と一致していますか、そして何が不足していますか？

*3投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8499-hash-based-key-derivation-from-bip-39/30375)
