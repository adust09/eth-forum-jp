---
title: 隠された公開鍵とZK証明を用いて、あらゆるEthereumウォレットを単一トランザクションで耐量子安全性にアップグレードする
original_title: >-
  Upgrade any Ethereum wallet to post-quantum security in one transaction using
  ZK proofs with a hidden public key
source_url: >-
  https://ethresear.ch/t/upgrade-any-ethereum-wallet-to-post-quantum-security-in-one-transaction-using-zk-proofs-with-a-hidden-public-key/24754
author: Mahdi171
date: '2026-04-29'
category: Cryptography
tags:
  - cryptography
  - post-quantum-cryptography
  - zk-snarks
  - eip-7702
topic_id: '24754'
translated_at: '2026-05-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Upgrade any Ethereum wallet to post-quantum security in one transaction using ZK proofs with a hidden public key](https://ethresear.ch/t/upgrade-any-ethereum-wallet-to-post-quantum-security-in-one-transaction-using-zk-proofs-with-a-hidden-public-key/24754) — Mahdi171 (2026-04-29)

# 隠された公開鍵とEIP-7702委任による耐量子Ethereumウォレット

[@gnosed](https://ethrese.ch/u/gnosed)氏の貢献に感謝します。

一度でもトランザクションを実行したことのあるEthereumのEOA（外部所有アカウント）は、そのsecp256k1公開鍵 (public key) が恒久的にオンチェーンに存在するため、ショアのアルゴリズム (Shor’s algorithm) を用いる量子コンピュータによって抽出される可能性があります。本稿では、既存のあらゆるEOAを単一のEIP-7702トランザクションで耐量子安全性 (post-quantum security) に改修 (retrofit) する方法を示します。これにはアドレス変更、資産移行、コンセンサス変更は一切不要です。EOAは実行を `GatedWallet` コントラクトに委任 (delegates execution) し、このコントラクトは隠された公開鍵 (public key) の下でのECDSAの知識 (ECDSA knowledge) のZK証明 (ZK proofs) のみを受け入れます。その鍵は決してオンチェーンに現れることはありません。

動作する実装: [longfellow-zk-hiddenpk](https://github.com/SoundnessLabs/longfellow-zk-hiddenpk)。
ベンチマーク: Apple M1上で**87ミリ秒の証明生成 / 65ミリ秒の検証 / 226KBの証明サイズ**。

これは、適切な目標を特定しつつも委任と検証フローを未解決のままにしていた2022年の投稿『[Quantum Proof Keypairs with ECDSA-ZK](https://ethrese.ch/t/quantum-proof-keypairs-with-ecdsa-zk/14901)』を拡張するものです。

## 既存のアプローチが不十分な理由

| アプローチ | アドレス安定性 | 資産移行なし | コンセンサス変更なし | PKがmempoolに現れない |
| --- | --- | --- | --- | --- |
| PQアドレスへの移行 | いいえ | いいえ | いいえ | はい (PQ安全) |
| エフェメラル鍵ローテーション [1] | はい | はい | はい | いいえ |
| 新しいPQスマートウォレット | いいえ | いいえ | はい | はい |
| 本研究 | はい | はい | はい | はい |

エフェメラル鍵ローテーション (ephemeral key rotation) は、これまでの構成で最も近いものです。各ローテーション・トランザクションは現在の公開鍵 (public key) をmempoolにブロードキャストするため、暗号関連量子コンピュータ (CRQC) が秘密鍵 (private key) を抽出できる期間が生じます。本手法ではその期間は存在しません。

## なぜ耐量子署名に切り替えないのか

Falcon、Dilithium (ML-DSA)、SPHINCS+が長期的な正しい答えです。しかし、これらは今日のほとんどのEthereumウォレットでは利用できません。

ボトルネックはウォレットソフトウェアの下にあるインフラ層です。ほとんどの機関向けウォレットはHSM（ハードウェアセキュリティモジュール）またはMPC（マルチパーティ計算）プロトコル上で動作します。現世代のHSMはECDSA、RSA、EdDSAのみをサポートしています。ハードウェアの更新サイクルは2〜5年です。MPCウォレットも同じ問題に直面しています。閾値ECDSA (threshold ECDSA) には監査済みの本番プロトコル（GG18、CGGMP21）がありますが、閾値ML-DSA (threshold ML-DSA) にはありません。それに加えて、PQ移行には新しいアドレススキーム、コンセンサス変更、そしてより大きな署名（ML-DSAは2.4-3.3KBに対し、ECDSAは65バイト）のためのコールデータ経済性 (calldata economics) の再交渉が必要です。

隠しPK（公開鍵）の構成はECDSAを置き換えるものではありません。ECDSAをラップするものです。HSMまたはMPC層は内部でECDSAを実行し続けます。ZK証明層はその上に、ウォレットソフトウェア内に存在し、オンチェーンの検証者はコミットされた鍵 (committed key) の下でECDSA署名が行われたという証明のみを認識します。**これは、現在本番稼働しているMPCおよびHSMウォレットにとって、量子安全性への最速の道です。**

## 構成

**セットアップ。** ユーザーのEOA `A` は、`GatedWallet` コントラクトを指す1つのEIP-7702 SetCode承認に署名します。これが `sk_A` が使用される最後の機会です。コントラクトは1つの値 `pkHash_B = H(pkx_B || pky_B)` を保存します。ここで `pk_B` はユーザーの新しい隠された鍵ペア (keypair) であり、オフチェーン (off-chain) で生成され、決してブロードキャストされません。

![アーキテクチャ](https://ethrese.ch/uploads/default/optimized/3X/6/1/61037ab08088a70dbed1ead86c7e681dabb878fb_2_690x399.png "アーキテクチャ")

*(注: 現在の実装では、Longfellow-ZKがまだ回路内でKeccakをサポートしていないため、`pkHash_B` にSHA-256を使用しています。Ethereumのアドレススキームに合わせるためのKeccakの追加は進行中です。)*

**定常状態。** その後のすべてのトランザクションについて、ユーザーのウォレットはデバイス上で (on-device) ZK証明 \\pi を生成します。

\\exists\\,(pk\_B, r, s) \\;\\text{ s.t. }\\; \\mathrm{ECDSA.verify}(pk\_B,\\,(r,s),\\,e) = 1 \\;\\wedge\\; H(pk\_B) = pkHash\_B

ここで $e = H(\mathtt{userOpHash} \;||\; \mathtt{chainid} \;||\; \mathtt{nonce})$ は、この特定の行動に証明をバインドします。証明はERC-4337 UserOperation `signature` フィールドに入力され、公開バンドラー (bundler) によって転送されます。`GatedWallet.execute` は検証を行い、成功した場合、`addr_A` の資産に対してアクションを実行します。

```
contract GatedWallet {
    bytes32 public immutable pkHash;
    IZKVerifier public immutable zkVerifier;
    uint256 public nonce;

    function execute(
        address to, uint256 value, bytes calldata data, bytes calldata proof
    ) external {
        require(msg.sender == address(this), "self only"); // EIP-7702 idiom
        bytes32 e = keccak256(abi.encode(keccak256(data), block.chainid, nonce));
        require(zkVerifier.verify(proof, pkHash, e), "bad proof");
        nonce++;
        (bool ok,) = to.call{value: value}(data);
        require(ok);
    }
}
```

`msg.sender == address(this)` ガードは標準的なEIP-7702パターンです。EOA自身の署名済みトランザクションは `msg.sender = addr_A = address(this)` として `execute` に入ります。外部からの直接呼び出しは、ZKチェックに到達する前に拒否されます。

## ハイブリッド移行: デュアル署名セーフティネット

初期展開期間中、回路におけるサウンドネスバグ (soundness bug) は重大なリスクとなります。`GatedWallet` は両方の署名を同時に要求できます。

\\text{authorize} \\iff \\underbrace{\\mathrm{ECDSA.verify}(pk\_1,\\,sig\_1,\\,e)}\_{\\text{古典的ガード, } pk\_1 \\text{ 露出}} \\;\\wedge\\; \\underbrace{\\mathrm{ZK.verify}(\\pi,\\,pkHash\_2,\\,e)}\_{\\text{隠し鍵ガード, PQ安全}}

これにより、2つの障害モードに対して独立した保護が提供されます。ショアのアルゴリズム (Shor’s algorithm) を介して `sk_1` を抽出する量子攻撃者は、`pk_2` が隠されており、ショアのアルゴリズムを適用できないため、依然として資金を使うことはできません。ZKのサウンドネスバグ (soundness bug) によって攻撃者が証明を偽造できたとしても、`sk_1` なしでは有効な `sig_1` を生成することはできません。どちらのガードもどちらの障害も防ぎます。

数年間の展開と独立した監査の後、`ecrecover` チェックは、古典的ガード (classical guard) のない `GatedWallet` を指す新しいEIP-7702 SetCodeトランザクションによって削除されます。

## 証明システム: なぜGroth16ではなくLigeroなのか

Groth16とKZG-PLONKは、構造化された参照文字列の離散対数問題の困難性に依存しています。これらは耐量子的に安全ではありません。LigeroとWHIRは、健全性をハッシュ衝突耐性 (hash collision resistance) に帰着させ、信頼されたセットアップ (trusted setup) を必要としません。現在の実装は、secp256k1のFFTに不向きなフィールド ($v_2(p^2-1) = 5$) を処理するためにCRTベースのリード・ソロモン (CRT-based Reed-Solomon) を使用するLigeroの変種である[Longfellow-ZK](https://github.com/google/longfellow-zk) (C++, Google) を使用しています。独立したRustポートは[zk-cred-longfellow](https://github.com/abetterinternet/zk-cred-longfellow)にあります。

PSEの[zkIDプロジェクト](https://github.com/privacy-ethereum/zkID)は、アイデンティティの観点 (identity angle) から同じ回路プリミティブ (circuit primitives) を解決しています。Ethereum上でのプライバシー保護型アイデンティティ (privacy-preserving identity) のためのECDSA-ZKクレデンシャルです。彼らのCircom回路、オンチェーン検証者、およびモバイル証明ライブラリ (mobile proving libraries) は、隠しPKウォレットパターンに直接再利用可能です。このスタックの成熟度が、この構成が今日展開可能である大きな理由です。

## 指定プロバーECDSA最適化

標準的なECDSA検証は以下を必要とします。
$R = u_1 \cdot G + u_2 \cdot pk, \quad u_1 = e \cdot s^{-1}, \quad u_2 = r \cdot s^{-1}$

これは2つの可変基点スカラー乗算 (variable-base scalar multiplications) であり、現在の回路制約の約70%を占めます。

プロバーは署名を生成し、skとnonce kを保持しているため、署名方程式を直接証明できます。

$pk = sk \cdot G, \qquad r = (k \cdot G).x, \qquad s = k^{-1}(e + r \cdot sk) \bmod n$

これは2つの固定基点スカラー乗算 (fixed-base scalar multiplications) （基点Gは定数であるため、事前計算テーブル (precomputed tables) によって制約数が4〜8倍削減されます）と、安価なモジュラ演算 (modular arithmetic) に置き換わります。プロトコル変更なしで、全体の制約削減は3〜5倍と推定され、証明サイズは約226KBから約50〜80KBに、ガスは約3Mから約800Kに削減されます。

![証明の構成](https://ethrese.ch/uploads/default/optimized/3X/a/e/aecb8b06960f8ddd6aac2f29b49ad0359ab9c462_2_690x238.png "証明の構成")

重要な点として、ECDSAを完全に削除し、$pk = sk \cdot G$ のみで証明することは機能しません。そのステートメントはどのトランザクションにもバインドされていません。ECDSAはトランザクション整合性メカニズム (transaction integrity mechanism) です。$(r, s)$ は $e = H(\mathtt{userOpHash} \;||\; \mathtt{chainid} \;||\; \mathtt{nonce})$ にコミットし、各証明を正確に1つのアクションに対して有効にします。指定プロバー最適化 (designated-prover ECDSA optimization) は回路パス (circuit path) のみを変更し、トランザクションバインディング (transaction binding) を維持します。

## ベンチマーク

Apple M1、シングルコア、リリースビルド、`kLigeroRate = 7`、`kLigeroNreq = 132` で測定。

| メトリック | 値 |
| --- | --- |
| 回路入力数 | 7,694 |
| 公開入力数 | 258 |
| 総証明生成時間 | 約87ミリ秒 |
| 検証時間 | 約65ミリ秒 |
| 証明サイズ | 226 KB |
| オンチェーンガス | 約3 M |

証明サイズの内訳: 32Bのマークルルート (Merkle root)、17.6KBのサムチェック (sumcheck)、213.9KBのRSカラム開示 (RS column openings) (132カラム)。コールデータ圧縮 (calldata compression) を使用する[[glossary/Rollup|L2ロールアップ]]では、ガスは10〜50倍削減されます。指定プロバー最適化 (designated-prover ECDSA optimization) を使用すると、プロトコル変更なしで約800Kになります。

## 未解決の質問

-   **回路内Keccak (Keccak in-circuit)。** LongfellowにKeccakを追加することで、SHA-256とEthereumのアドレススキームとの不一致が解消されます。
-   **指定プロバー回路の実装。** 制約削減推定 (constraint reduction estimate) には、CRTベースのリード・ソロモン (CRT-based Reed-Solomon) における固定基点MSM (fixed-base MSM) の実際の制約数が必要です。
-   **WHIRバックエンド。** WHIRは同等のセキュリティでより良い証明サイズを提供します。WHIRでECDSA回路をベンチマークすることが次の直接的なステップです。
-   **証明集約。** 同じブロック内で複数のユーザーが支出する場合、償却されたコールデータオーバーヘッドを共有できます。Ligeroの線形構造はバッチ検証 (batch verification) をサポートします。

## 参考文献

1.  mvicari et al., [Achieving Quantum Safety Through Ephemeral Key Pairs and Account Abstraction](https://ethrese.ch/t/achieving-quantum-safety-through-ephemeral-key-pairs-and-account-abstraction/24273), ethrese.ch, 2026.
2.  [Quantum Proof Keypairs with ECDSA-ZK](https://ethrese.ch/t/quantum-proof-keypairs-with-ecdsa-zk/14901), ethrese.ch, 2022.
3.  Frigo and Shelat, [Anonymous Credentials from ECDSA](https://eprint.iacr.org/2024/2010), IACR ePrint 2024/2010.
4.  Gaborit et al., [WHIR: Reed-Solomon Proximity Testing with Super-Fast Verification](https://eprint.iacr.org/2024/1586), IACR ePrint 2024/1586.
5.  [EIP-7702: Set EOA Account Code](https://eips.ethereum.org/EIPS/eip-7702)
6.  [ERC-4337: Account Abstraction Using Alt Mempool](https://eips.ethereum.org/EIPS/eip-4337)
7.  [PSE zkID](https://github.com/privacy-ethereum/zkID)
8.  [longfellow-zk-hiddenpk](https://github.com/SoundnessLabs/longfellow-zk-hiddenpk) (本研究)
9.  [Longfellow-ZK C++ reference](https://github.com/google/longfellow-zk)
10.  [Longfellow-ZK Rust port (独立)](https://github.com/abetterinternet/zk-cred-longfellow)

5件の投稿 - 4名の参加者

[トピック全体を読む](https://ethrese.ch/t/upgrade-any-ethereum-wallet-to-post-quantum-security-in-one-transaction-using-zk-proofs-with-a-hidden-public-key/24754)
