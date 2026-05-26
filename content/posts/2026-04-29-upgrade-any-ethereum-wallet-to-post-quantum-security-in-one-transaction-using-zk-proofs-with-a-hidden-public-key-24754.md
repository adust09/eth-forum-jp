---
title: 隠された公開鍵とZK証明を用いて、あらゆるEthereumウォレットを単一トランザクションで耐量子安全性にアップグレード
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
  - post-quantum
  - zk
  - eip
  - account-abstraction
  - wallet
topic_id: '24754'
translated_at: '2026-05-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Upgrade any Ethereum wallet to post-quantum security in one transaction using ZK proofs with a hidden public key](https://ethresear.ch/t/upgrade-any-ethereum-wallet-to-post-quantum-security-in-one-transaction-using-zk-proofs-with-a-hidden-public-key/24754) — Mahdi171 (2026-04-29)

# 隠された公開鍵と[[EIP|EIP-7702]]デリゲーションによる耐量子Ethereumウォレット

*[@gnosed](https://ethresear.ch/u/gnosed)氏の貢献に感謝します。*

一度でもトランザクションを実行したEthereumのEOA (Externally Owned Account) は、そのsecp256k1公開鍵が恒久的にオンチェーンに存在するため、ショアのアルゴリズム（Shor’s algorithm）を介して量子コンピュータによって抽出される可能性があります。本稿では、アドレス変更、資産移行、コンセンサス変更なしに、単一の[[EIP|EIP-7702]]トランザクションで既存のEOAを耐量子安全性に適合させる方法を示します。EOAは、隠された公開鍵の下でのECDSA知識のZK証明のみを受け入れる`GatedWallet`コントラクトに実行を委任します。この鍵は決してオンチェーンに現れません。

実装例: [longfellow-zk-hiddenpk](https://github.com/SoundnessLabs/longfellow-zk-hiddenpk)。
ベンチマーク: Apple M1上で**87 msで証明生成 / 65 msで検証 / 226 KBの証明サイズ**。

これは、正しい目標を特定しつつもデリゲーションと検証フローを未解決のままにしていた2022年の投稿「[Quantum Proof Keypairs with ECDSA-ZK](https://ethresear.ch/t/quantum-proof-keypairs-with-ecdsa-zk/14901)」を拡張するものです。

## 既存のアプローチが不十分な理由

| アプローチ | アドレス安定性 | 資産移行なし | コンセンサス変更なし | 公開鍵がmempoolに現れない |
| --- | --- | --- | --- | --- |
| PQアドレスへの移行 | いいえ | いいえ | いいえ | はい (PQ安全) |
| エフェメラル鍵ローテーション [1] | はい | はい | はい | いいえ |
| 新しいPQスマートウォレット | いいえ | いいえ | はい | はい |
| 本研究 | はい | はい | はい | はい |

エフェメラル鍵ローテーション（Ephemeral key rotation）は、最も近い先行研究です。各ローテーション・トランザクションは現在の公開鍵をmempoolにブロードキャストするため、CRQC（Cryptographically Relevant Quantum Computer）が秘密鍵を抽出できる期間が残ります。本手法ではその期間は存在しません。

## なぜ単に耐量子署名に切り替えないのか

Falcon、Dilithium (ML-DSA)、SPHINCS+は、長期的に見て正しい解決策です。しかし、これらは今日のほとんどのEthereumウォレットでは利用できません。

ボトルネックは、ウォレットソフトウェアの下にあるインフラ層です。ほとんどの機関向けウォレットはHSM（Hardware Security Module）またはMPC（Multi-Party Computation）プロトコル上で動作します。現世代のHSMはECDSA、RSA、EdDSAのみをサポートしています。ハードウェアの更新サイクルは2年から5年かかります。MPCウォレットも同様の問題に直面しています。閾値ECDSAには監査済みの本番プロトコル（GG18、CGGMP21）がありますが、閾値ML-DSAにはありません。さらに、PQ（耐量子）移行には、新しいアドレススキーム、コンセンサス変更、そしてより大きな署名（ML-DSAは2.4-3.3 KBに対し、ECDSAは65バイト）のためのcalldataの経済性の再交渉が必要です。

隠された公開鍵（hidden-PK）構成はECDSAを置き換えるものではありません。それをラップ（wrap）します。HSMまたはMPC層は内部でECDSAを実行し続けます。ZK証明層はその上に、ウォレットソフトウェア内に存在し、オンチェーンの検証者は、コミットされた鍵の下でECDSA署名が行われたという証明のみを確認します。**これは、現在本番環境にあるMPCおよびHSMウォレットにとって、量子安全性への最速の道筋です。**

## 構成

**セットアップ。** ユーザーのEOA `A`は、`GatedWallet`コントラクトを指す単一の[[EIP|EIP-7702]] SetCode承認に署名します。これが`sk_A`が使用される最後の機会です。コントラクトは`pkHash_B = H(pkx_B || pky_B)`という1つの値を格納します。ここで`pk_B`はユーザーの新しい隠された鍵ペアであり、オフチェーンで生成され、決してブロードキャストされません。

[![アーキテクチャ](https://ethresear.ch/uploads/default/optimized/3X/6/1/61037ab08088a70dbed1ead86c7e681dabb878fb_2_690x399.png)](https://ethresear.ch/uploads/default/original/3X/6/1/61037ab08088a70dbed1ead86c7e681dabb878fb.png "アーキテクチャ")

*(注: 現在の実装では`pkHash_B`にSHA-256を使用しています。これはLongfellow-ZKがまだ回路内でKeccakをサポートしていないためです。Ethereumのアドレススキームに合わせるためのKeccakの追加は進行中です。)*

**定常状態。** その後のすべてのトランザクションについて、ユーザーのウォレットはデバイス上でZK証明 $\pi$ を生成します。

$\exists\,(pk\_B, r, s) \;\text{ s.t. }\; \mathrm{ECDSA.verify}(pk\_B,\,(r,s),\,e) = 1 \;\wedge\; H(pk\_B) = pkHash\_B$

ここで $e = H(\mathtt{userOpHash} \;||\; \mathtt{chainid} \;||\; \mathtt{nonce})$ は、この特定の行動に証明をバインドします。証明は[[ERC-4337]] UserOperationの`signature`フィールドに入り、パブリックなバンドラーによって転送されます。`GatedWallet.execute`は検証を行い、成功した場合、`addr_A`の資産に対してアクションを実行します。

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

`msg.sender == address(this)`ガードは標準的な[[EIP|EIP-7702]]パターンです。EOA自身の署名済みトランザクションは、`msg.sender = addr_A = address(this)`として`execute`に入ります。直接の外部呼び出しは、ZKチェックに到達する前に拒否されます。

## ハイブリッド移行: デュアル署名セーフティネット

初期デプロイ期間中、回路における健全性バグ（soundness bug）は重大なリスクとなります。`GatedWallet`は両方の署名を同時に要求できます。

$\text{authorize} \iff \underbrace{\mathrm{ECDSA.verify}(pk\_1,\,sig\_1,\,e)}_{\text{古典的ガード、} pk\_1 \text{ は露出}} \;\wedge\; \underbrace{\mathrm{ZK.verify}(\pi,\,pkHash\_2,\,e)}_{\text{隠し鍵ガード、PQ安全}}$

これにより、2つの異なる障害モードに対して独立した保護が提供されます。ショアのアルゴリズムを介して`sk_1`を抽出する量子攻撃者は、`pk_2`が隠されており、ショアのアルゴリズムを適用できないため、依然として資金を使うことはできません。ZK健全性バグにより攻撃者が証明を偽造できたとしても、`sk_1`なしでは有効な`sig_1`を生成できません。どちらのガードも、どちらの障害も防ぎます。

数年間のデプロイと独立した監査の後、`ecrecover`チェックは、古典的ガードを持たない`GatedWallet`を指す新しい[[EIP|EIP-7702]] SetCodeトランザクションによって削除されます。

## 証明システム: なぜLigeroでGroth16ではないのか

Groth16とKZG-PLONKは、構造化された参照文字列（structured reference string）の離散対数問題の困難性に依存しています。これらは耐量子的に健全ではありません。LigeroとWHIRは、健全性をハッシュ衝突耐性（hash collision resistance）に帰着させ、トラステッドセットアップ（trusted setup）を必要としません。現在の実装は、[Longfellow-ZK](https://github.com/google/longfellow-zk) (C++, Google) を使用しています。これは、secp256k1のFFTに不向きなフィールド ($v_2(p^2-1) = 5$) を処理するためにCRTベースのリード・ソロモン（Reed-Solomon）を使用するLigeroのバリアントです。独立したRustポートは[zk-cred-longfellow](https://github.com/abetterinternet/zk-cred-longfellow)にあります。

PSEの[zkIDプロジェクト](https://github.com/privacy-ethereum/zkID)は、Ethereum上でのプライバシー保護アイデンティティのためのECDSA-ZKクレデンシャルという、アイデンティティの観点から同じ回路プリミティブを解決しています。彼らのCircom回路、オンチェーン検証者、およびモバイル証明ライブラリは、隠された公開鍵ウォレットパターンに直接再利用可能です。このスタックの成熟度が、この構成が今日デプロイ可能である大きな理由の一つです。

## 指定証明者ECDSA最適化

標準的なECDSA検証では以下が必要です。
$R = u_1 \cdot G + u_2 \cdot pk, \quad u_1 = e \cdot s^{-1}, \quad u_2 = r \cdot s^{-1}$

これは2つの可変基底スカラー乗算（variable-base scalar multiplication）であり、現在の回路制約の約70%を占めます。

証明者は署名を生成し、秘密鍵 `sk` とノンス `k` を保持しているため、署名方程式を直接証明できます。

$pk = sk \cdot G, \qquad r = (k \cdot G).x, \qquad s = k^{-1}(e + r \cdot sk) \bmod n$

代わりに2つの固定基底スカラー乗算（fixed-base scalar multiplication）を使用します（基底点Gは定数であるため、事前計算されたテーブルにより制約数を4〜8倍削減できます）。これに加えて、安価なモジュラー演算（modular arithmetic）が加わります。これにより、プロトコル変更なしで、全体の制約が3〜5倍削減され、証明サイズが約226 KBから約50〜80 KBに、ガス消費量が約3 Mから約800 Kに削減されると推定されます。

[![証明の構成](https://ethresear.ch/uploads/default/optimized/3X/a/e/aecb8b06960f8ddd6aac2f29b49ad0359ab9c462_2_690x238.png)](https://ethresear.ch/uploads/default/original/3X/a/e/aecb8b06960f8ddd6aac2f29b49ad0359ab9c462.png "証明の構成")

重要な点として、ECDSAを完全に削除し、$pk = sk \cdot G$ のみで証明することは機能しません。そのステートメントはどのトランザクションにもバインドされていません。ECDSAはトランザクションの整合性メカニズムです。(r, s) は $e = H(\mathtt{userOpHash} \;||\; \mathtt{chainid} \;||\; \mathtt{nonce})$ にコミットし、各証明が正確に1つのアクションに対して有効であることを保証します。指定証明者最適化は回路パスのみを変更し、トランザクションのバインディングは維持します。

## ベンチマーク

Apple M1、シングルコア、リリースビルド、`kLigeroRate = 7`、`kLigeroNreq = 132`で測定。

| メトリック | 値 |
| --- | --- |
| 回路入力数 | 7,694 |
| 公開入力数 | 258 |
| 総証明生成時間 | 約87 ms |
| 検証時間 | 約65 ms |
| 証明サイズ | 226 KB |
| オンチェーンガス | 約3 M |

証明サイズの内訳: 32 Bのマークルルート、17.6 KBのサムチェック、213.9 KBのRSカラム開示（132カラム）。calldata圧縮を備えたL2（[[glossary/Rollup|ロールアップ]]）では、ガス消費量が10〜50倍に減少します。指定証明者最適化を使用すると、プロトコル変更なしで約800 Kになります。

## 未解決の課題

-   **回路内Keccak。** LongfellowにKeccakを追加することで、EthereumのアドレススキームとのSHA-256 / Keccakの不一致が解消されます。
-   **指定証明者回路の実装。** 制約削減の推定には、CRT-リード・ソロモン（CRT-Reed-Solomon）における固定基底MSM（Multi-Scalar Multiplication）の実際の制約数が必要です。
-   **WHIRバックエンド。** WHIRは同等のセキュリティでより良い証明サイズを提供します。WHIRを用いたECDSA回路のベンチマークは、次の直接的なステップです。
-   **証明の集約。** 同じブロック内で複数のユーザーが支出する場合、償却されたcalldataオーバーヘッドを共有できます。Ligeroの線形構造はバッチ検証（batch verification）をサポートしています。

## 参考文献

1.  mvicari et al., [Achieving Quantum Safety Through Ephemeral Key Pairs and Account Abstraction](https://ethresear.ch/t/achieving-quantum-safety-through-ephemeral-key-pairs-and-account-abstraction/24273), ethresear.ch, 2026.
2.  [Quantum Proof Keypairs with ECDSA-ZK](https://ethresear.ch/t/quantum-proof-keypairs-with-ecdsa-zk/14901), ethresear.ch, 2022.
3.  Frigo and Shelat, [Anonymous Credentials from ECDSA](https://eprint.iacr.org/2024/2010), IACR ePrint 2024/2010.
4.  Gaborit et al., [WHIR: Reed-Solomon Proximity Testing with Super-Fast Verification](https://eprint.iacr.org/2024/1586), IACR ePrint 2024/1586.
5.  [EIP-7702: Set EOA Account Code](https://eips.ethereum.org/EIPS/eip-7702)
6.  [ERC-4337: Account Abstraction Using Alt Mempool](https://eips.ethereum.org/EIPS/eip-4337)
7.  [PSE zkID](https://github.com/privacy-ethereum/zkID)
8.  [longfellow-zk-hiddenpk](https://github.com/SoundnessLabs/longfellow-zk-hiddenpk) (本研究)
9.  [Longfellow-ZK C++ reference](https://github.com/google/longfellow-zk)
10.  [Longfellow-ZK Rust port (独立した実装)](https://github.com/abetterinternet/zk-cred-longfellow)

*5件の投稿 - 4名の参加者*

[トピック全体を読む](https://ethresear.ch/t/upgrade-any-ethereum-wallet-to-post-quantum-security-in-one-transaction-using-zk-proofs-with-a-hidden-public-key/24754)
