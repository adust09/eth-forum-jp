---
title: ステルスアドレスプロトコルにおけるPQ支出
original_title: PQ spending for Stealth Address Protocol
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/pq-spending-for-stealth-address-protocol/26095'
author: namnc
date: '2026-09-28'
category: Uncategorized
tags:
  - cryptography
  - post-quantum
  - stealth-addresses
  - account-abstraction
  - snarks
  - starks
  - eip
topic_id: '26095'
translated_at: '2026-09-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [PQ spending for Stealth Address Protocol](https://ethresear.ch/t/pq-spending-for-stealth-address-protocol/26095) — namnc (2026-09-28)

# PQ SAP - PQ支出

> Hy、@mmjahanara、@Pierre、@winderica、および kassandra の皆様、有益な議論とフィードバックをありがとうございました。

## TLDR;

この投稿は、ステルスアドレスプロトコル (Stealth Address Protocol) とその[[Post-Quantum|ポスト量子 (PQ)]]アップグレードに関する一連の投稿の3番目です。最初の投稿については「[[Post Quantum Stealth Address Protocol](https://hackmd.io/SH4vEEUQQN212db1zJQGTw?view)]」を、アナウンス層のアップグレードについては「[[PQ SAP - PQ Anonymity](https://ethresear.ch/t/pq-anonymity-for-stealth-address-protocol/26094/1)]」を参照してください。

> スキーム3（[[Post-Quantum|PQ]] SAPアップグレードへの最良の第一歩）に対応する[[repo for scheme 3](https://github.com/namnc/pq-stealth-scheme3-public/)]があります。

ステルスアドレスプロトコル (Stealth Address Protocol) は以下を可能にします。

-   受信者が公開の[[stealth meta-address|ステルスメタアドレス]]を登録する
-   送信者が、[[stealth meta-address|ステルスメタアドレス]]と一時的なシークレット（ナンスでもある）を使用して、受信者向けにワンタイムの[[stealth meta-address|ステルスアドレス]]を導出する
-   同じ[[stealth meta-address|ステルスメタアドレス]]の異なるワンタイム[[stealth meta-address|ステルスアドレス]]（異なるナンスを意味する）での送信者から受信者への支払いは、リンク不可能である
-   送信者の匿名性は保証されない（*現在の*特性として）

ステルスアドレスプロトコル (Stealth Address Protocol) としばしば結合される（現在の）コンポーネントは次のとおりです。

-   受信者が公開鍵を登録できる[[stealth meta-address|ステルスメタアドレス]]レジストリと、送信者がステルス支払いをアナウンスできるアナウンスレジストリ
-   送信者側でのナンスマネージャー (nonce manager)。同じワンタイム[[stealth meta-address|ステルスアドレス]]が2回以上再利用されるのを防ぐため
-   ステルス支払いの発見またはスキャンサービス。この目的のために、通常、デュアルキーステルスアドレスプロトコル (Dual Key Stealth Address Protocol) に依存しており、これは支出キー (spending key) と閲覧キー (viewing key) を分離します。

```
 受信者 (Bob)                            送信者 (Alice)
 k_view, k_spend                         ナンスマネージャー: 新しい r, 再利用しない
 M = (P_view, P_spend)                        |
      |                                       |
      | M を登録                              | M をルックアップ
      v                                       v
 [メタアドレスレジストリ] ---------------------+
                                              |  s    = KA(r, P_view)
                                              |  P_st = P_spend + H(s)G
                                              |  R    = pub(r), vtag
                                              |
 [台帳]              value -> P_st  <-------+
 [アナウンスレジストリ]  (R, P_st, vtag) <---+
      |
      | Bob (または閲覧委任者) がスキャン: s' = KA(k_view, R); vtag? P_spend+H(s')G == P_st?
      v
 Bob が k_spend + H(s') で支出する

 リンク不可能: 同じ M からの P_st、異なる r        [ 成立 ]
 送信者    : Alice のアカウント資金 + アナウンス    [ 露出 ]
 キー      : k_view = 検出 (委任可能), k_spend = 支出
```

[[mainnet|メインネット]]上で永続的に存在する[[ERC-6538|ERC-6538]]レジストリと[[ERC-5564|ERC-5564]]アナウンサーを監視する[[Post-Quantum|量子]]攻撃者は、Rと(K,V)、およびステルスアドレスPへのすべてのステルス支払いを捕捉し、Rからrを、Kからkを、Vからvを回復できるため、vを持つスキャナーとして、またkを持つ受信者として、ステルス支払いへの完全な閲覧および支出アクセスを得ることができます。

私たちは、SAPの2つのコアコンポーネント、すなわち(1/2)-ECDHとECDSAのアップグレードに焦点を当て、schemeId = 3, 5, 6のSAPを結果として得て、既存のコンポーネントへの影響を解釈します。

ECDHをML-KEMに置き換えることは、[[Post-Quantum|量子]]攻撃者から支払い発見と受信者のリンク不可能性を保護することを目的としています。ECDSAを置き換えることは、支出承認を保護することを目的としています。スキーム2-5はECDSAを保持しているため、両方のプロパティを提供しません。

[[ERC-5564|ERC-5564]]のこの2番目の拡張では、ECDSAを[[ML-DSA|PQ ML-DSA]]およびハッシュベース支出 (HSAP) に置き換えることを試み、結果としてschemeId = 6のSAPを得ます。

> この投稿の数値（ガス代）は、この分野が活発に動いているため、将来変更される可能性があります。したがって、実際のコストよりもメカニズムに焦点を当てましょう。

## [[ML-DSA|PQ署名スキーム]]によるECDSAのアップグレード

まず、[[ML-DSA|PQセキュアなデジタル署名スキーム]]の構文を定義しましょう。

-   (k,K) \\leftarrow SKeyGen(\\lambda)
-   (\\sigma) \\leftarrow Sign(k,m)
-   \\{0,1\\} \\leftarrow Ver(K,\\sigma,m)

直感的には、上記の[[ML-DSA|PQセキュアなデジタル署名スキーム]]に対して、さらに3つの非標準的な追加[[Post-Quantum|PQ]]アルゴリズムを定義できます。

-   P \\leftarrow PKeyGen(K,r)
-   P' \\leftarrow PMatch(dk,c,K)
-   p \\leftarrow SKeyDer(k,r)
    ここで、pは公開鍵Pの署名鍵であり、Kまたはekにリンク不可能である。

> ECベースのSAPの場合、P \\leftarrow PKeyGen(K,r) は `set $P = K + hG$` に対応し、P' \\leftarrow PMatch(dk,c,K) は `decapsulating $r' = Decaps(dk,c)$, and recompute $h' = H(r')$, and the receiving address $P' = K + h'G$` に対応し、p \\leftarrow SKeyDer(k,r) は `one-time spending key now being $k + h$` に対応することに注意してください。

### 数学

-   受信者は (k,K) \\leftarrow SKeyGen(\\lambda) と (dk,ek) \\leftarrow KeyGen(\\lambda) を実行し、(K,ek) を[[stealth meta-address|ステルスメタアドレス]]として登録します。
-   ワンタイム支払いの場合、送信者は (K, ek) を（何らかの方法で）取得し、(r,c) \\leftarrow Encaps(ek) を実行し、h = H(r) を計算し、P \\leftarrow PKeyGen(K,r) を設定し、P に資金を送り、その後 c を公開します。
-   受信者、または受信者が復号鍵 dk を委託するスキャンサービスは、まず r' = Decaps(dk,c) を復号し、P' \\leftarrow PMatch(dk,c,K) を再計算し、P =? P' をテストすることでステルス支払いを照合できます。
-   しかし、k を持つ受信者のみ（dk のみを持つスキャンサービスでさえなく）、公開鍵 P \\leftarrow PKeyGen(K,r) のワンタイム支出鍵 p \\leftarrow SKeyDer(k,r) を使用して資金にアクセスできます。

### 候補

これを実現する最初のクリーンな方法は[[Isogeny](https://ethresear.ch/t/towards-practical-post-quantum-stealth-addresses/15437)]を介することですが、Isogenyのセキュリティは最近疑問視されており、NIST標準化もされていません。

以下では、[[ML-DSA|ML-DSA]] (NIST FIPS 204) の変種である他の2つのスキームについて概説します。これらは[[Post-Quantum|PQ]]-SAPに対応できます。

## [[ML-DSA|ML-DSA]] FIPS 204

[[ML-DSA|ML-DSA]]は、Dilithiumの標準化された後継です。算術は多項式を使用します。

R\_q=\\mathbb{Z}\_q\[X\]/(X^{256}+1), \\qquad q=8380417, \\qquad A\\in R\_q^{k\\times\\ell}.

**鍵の生成。** 署名者は、多項式係数が小さい（「短いベクトル」）秘密ベクトルs\_1とs\_2をサンプリングし、t=As\_1+s\_2を計算します。ここで、公開行列Aはコンパクトな公開シード\\rhoから生成されます: A=\\mathsf{ExpandA}(\\rho)。公開鍵のサイズを減らすために、tの各係数は丸められた上位部分と下位の剰余に分割されます: t=2^{13}t\_1+t\_0。公開鍵は (\\rho,t\_1) であり、署名者はt\_0を署名メタデータとして保持します。

> 係数 2^{13}=8192 がこの圧縮のスケールを決定します。

**メッセージの署名。** 署名は、公開鍵と署名コンテキストにバインドされたメッセージダイジェストとして\\muを取り、「試行」を繰り返して行われます。各署名試行で、署名者は秘密マスクyを生成し、w=Ayとw\_1=\\mathsf{HighBits}(w)を計算します。ここでw\_1は、署名アルゴリズムの丸めルールを使用してwを粗く表現したものです。署名者は\\widetilde c=H(\\mu\\parallel\\mathsf{Encode}(w\_1))を計算し、c=\\mathsf{SampleInBall}(\\widetilde c)を計算し、次にz=y+cs\_1を計算します。

**サンプリング拒否、すなわち不適切な試行の拒否。** [[Dilithium design explanation](https://pq-crystals.org/dilithium/data/dilithium-specification-round3-20210208.pdf)]にあるように、マスキングだけでは不十分です。一部の応答は、秘密に依存するシフトに関する情報を漏洩させる可能性があります。この拒否サンプリングは、秘密を保護し、検証が機能することを保証します。署名者はまた、小さな修正ヒントhを作成します。結果として得られる署名は\\sigma=(\\widetilde c,z,h)です。

**署名の検証。** 検証者はAとcを再構築し、次に\\overline w=Az-c(2^{13}t\_1)を計算します。署名および鍵生成方程式を代入すると、\\overline w=A(y+cs\_1)-c(t-t\_0)=w-cs\_2+ct\_0となります。

したがって、検証者は修正項付きのwを取得します。ヒントにより、署名者が使用したのと同じ粗い値w\_1を回復できます: w\_1'=\\mathsf{UseHint}(h,\\overline w)。次に、\\widetilde c\\stackrel{?}{=}H(\\mu\\parallel\\mathsf{Encode}(w\_1'))をチェックします。

**パラメータセット。** NISTは[[ML-DSA|ML-DSA]]用にさらに3つのパラメータセットを提供しています。

| パラメータセット | 公開鍵 | 署名 |
| --- | --- | --- |
| ML-DSA-44 | 1312バイト | 2420バイト |
| ML-DSA-65 | 1952バイト | 3309バイト |
| ML-DSA-87 | 2592バイト | 4627バイト |

### SPIRIT

> SPIRITは[[Post Quantum Fuzzy Stealth Signatures and Applications](https://eprint.iacr.org/2023/1148)]で提供されました。

Aをグローバルに共有された行列とします。

-   受信者は短い (s\_1,s\_2) をサンプリングし、フル精度の t=As\_1+s\_2 を計算し、KEM鍵ペア (ek,dk) を生成し、メタアドレス (t,ek) を公開します。
-   送信者は (\\kappa,ct)\\leftarrow\\mathsf{Encaps}(ek) を実行し、短い (s\_1',s\_2')=\\mathsf{ExpandS} (\\kappa) を導出し、t'=t+As\_1'+s\_2' を計算します。t' を丸めてワンタイム公開鍵 (\\rho\_A,t\_1') を取得し、支払いとともに ct を公開します。
-   受信者、または (dk,t) を持つスキャナーは、ct を復号し、導出された公開鍵を再計算して支払いを認識します。
-   受信者は署名秘密 (s\_1+s\_1',s\_2+s\_2') を、下位ビットと補助署名値とともに導出します。支出には対応するDilithiumスタイルの署名検証器を使用します。

正しさは t'=A(s\_1+s\_1')+(s\_2+s\_2') から単純に導かれます。

しかし、SAPのリンク不可能性（ERC全体で事前定義されたシード）のためにはグローバル行列が必要です。そして、マスターtは圧縮されないままでなければなりません。また、係数バウンドは\\etaから2\\etaに増加し、\\beta'=2\\tau\\etaが必要となります。オリジナルのSPIRITでは、署名再試行を制御するために\\gamma\_1と\\gamma\_2も2倍になります。標準のマスク幅を維持するためには、より厳密な署名者拒否と、別途互換性/セキュリティ分析が必要になります。

### [[ML-DSA|ML-DSA]]検証のコスト

SAPの場合、[[ML-DSA|ML-DSA]]署名検証とアカウント実行のみがオンチェーンで実行されます。主な検証のボトルネックには、SHAKE展開/ハッシュ化、NTT演算、行列-ベクトル積、デコード、および境界チェックが含まれます。[[ETHDILITHIUM benchmarks](https://github.com/ZKNoxHQ/ETHDILITHIUM#benchmarks)]によると：

| 検証パス | 報告されたガス | 仮定 |
| --- | --- | --- |
| ZKNox SHAKEベースの主要実装 | 約8.1M | 展開/事前計算された公開鍵 |
| ZKNox実験的パックSHAKE検証器 | 1,196,707 | 展開/事前計算された鍵と外部Keccak-fヘルパー |
| ZKNox実験的パックETHDilithium | 847,709 | 変更されたハッシュ構造; FIPS 204ではない |

[[EIP|EIP]]-[[EIP-8051|8051]]のドラフトでは、展開された鍵インターフェースを持つ4500ガスの[[ML-DSA|ML-DSA]]-44検証プリコンパイルが提案されています。

## 非[[ML-DSA|ML-DSA]] [[Post-Quantum|PQ]]-SAP

[[Vitalik’s idea](https://vitalik.eth.limo/general/2023/01/20/stealth.html)]に従ってSAPを抽象化すると、以下の最小モデルを考えることができます。

-   受信者はKを公開し、関連するkを秘密に保つ
-   送信者は、あるナンスr（ML-KEMを介して受信者に配信される）に関連付けられたアドレスPにステルス支払いを行う必要があり、Pは何らかの形でKに関連付けられているが、Kにリンク不可能である
-   支出条件は、kとrの知識があれば、受信者のみがPの資金を支出できることである

これは[[Zero-Knowledge-Proof|PQ zk-SNARK/STARK]]の典型的なアプリケーションとなりえます（実際、DSAはZKPの特定のインスタンスです）。これは以下のように最小限にすることができます。

-   K = H(k) とする
-   P = H(K,r) とする
-   支出条件は、P = H(H(k),r) となるようなk,rのzk知識を証明することである

これは[[zkwormholes|zkワームホール]]のように聞こえますが、P/Kが[[Ethereum-JSON-RPC-Specification|イーサリアムアドレス]]である場合は[[known to be insecure if P/K is an Ethereum address](https://ethresear.ch/t/wormholes-and-the-cost-of-plausible-deniability/23728)]とされています。しかし、これは送信者をスマートコントラクトアカウントから切り離したい場合にのみ当てはまります。つまり、送信者は実際に、後で[[Zero-Knowledge-Proof|PQ-zk-SNARK/STARK]]で支出できるスマートコントラクトアカウントに資金を送金します（支出ごとに1回の[[Zero-Knowledge-Proof|PQ-zk-SNARK/STARK]]検証のコストがかかります）。これは、現在のところ、[[WHIR-EVM-Verifier benchmark](https://hackmd.io/@clientsideproving/whir-evm-verifier)]を外挿すると、300,000 R1CS制約で約7Mガスかかります。しかし、[[EIP-8288|EIP-8288]]（[[Frame-type|フレームタイプ]] for [[Post-Quantum|PQ]] Sig and [[STARK-Aggregation|STARK集約]]に関する[[EIP|EIP]]）が、量子耐性署名と[[STARK|STARK]]のための再帰的[[STARK|STARK]]ベースの集約を[[Frame-Transactions|EIP-8141フレームトランザクション]]モードを介して追加することを提案しているため、それほど遠くない将来にはそうではないかもしれません。これにより、検証コストを償却できます（leanStarkを使用する場合）、追加の検証手数料は30Kガスのみです。

これにより、**HSAP: ML-KEM配信とハッシュ原像支出を備えた[[Post-Quantum|PQ]]-SAP**が得られます。

### 数学

H\_{\\mathsf{key}}、H\_{\\mathsf{pay}}、H\_{\\mathsf{auth}}を、それぞれ異なる1バイトのドメインタグと正規エンコーディングを持つSHA-256とします。\\mathsf{KDF}を、32バイト出力とデプロイメントドメインDを持つHKDF-SHA256とし、スキーム、チェーン、ファクトリをバインドします。

-   受信者はランダムに256ビットの支出鍵kをサンプリングし、(dk,ek)\\leftarrow\\mathsf{KeyGen}(\\lambda)を実行し、K=H\_{\\mathsf{key}}(k)である(K,ek)を[[stealth meta-address|ステルスメタアドレス]]として登録します。
-   ワンタイム支払いの場合、送信者は(K,ek)を取得し、(s,c)\\leftarrow\\mathsf{Encaps}(ek)を実行し、r=\\mathsf{KDF}(s,D)を導出し、C=H\_{\\mathsf{pay}}(K,r)を計算します。固定ファクトリは、P=\\mathsf{CREATE2Addr}(F,C,I(C))にスマートアカウントをアトミックにデプロイおよび資金提供し、その後cをアナウンスします。アカウントは完全な256ビットのC、支出ナンス、および固定検証器を保存します。デプロイメントの失敗は支払いを[[Revert|リバート]]します。
-   受信者、またはdkを委託されたスキャナーは、s'=\\mathsf{Decaps}(dk,c)を回復し、r'=\\mathsf{KDF}(s',D)を導出し、C'=H\_{\\mathsf{pay}}(K,r')とP'を再計算し、P=P'をテストします。また、デプロイされたアカウントと資金提供された残高もチェックします。
-   kを持つのは受信者のみです。送信者とスキャナーはrを知っていますが、単独で支出を承認することはできません。受信者は、証人(k,r)を使用して[[Zero-Knowledge-Proof|ZK証明]]で支出を承認します。

宛先Q、金額a、リレーヤーL、手数料f、現在のナンスn、有効期限tについて、以下を定義します。

m=H\_{\\mathsf{msg}}(D,P,C,n,Q,a,L,f,t), \\qquad T=H\_{\\mathsf{auth}}(k,r,m).

支出証明は次のとおりです。

\\pi=\\mathsf{ZKPoK}\\left\[ \\begin{array}{l} \\text{public: } C,m,T;\\quad \\text{private: } k,r\\\\ C=H\_{\\mathsf{pay}}(H\_{\\mathsf{key}}(k),r)\\\\ T=H\_{\\mathsf{auth}}(k,r,m) \\end{array} \\right\].

アカウントはmを再計算し、ナンス、有効期限、残高、および証明をチェックし、ナンスをインクリメントしてから、aをQに、fをLに転送します。再入攻撃から保護するためにアトミック実行が行われます。Kは回路内に隠されたままですが、証明トランスクリプトはステートメント全体をバインドします。

## schemeId = 6までの支出のまとめ

では、[[Post-Quantum|PQ]]支出がSAPに対してどのように見えるかを抽象化してみましょう。

| スキーム | マスター公開鍵 K | 導出された検証鍵 P | 導出された署名鍵 p |
| --- | --- | --- | --- |
| EC参照 | kG | K+H(r)G | k+H(r) |
| 基本SPIRIT | t=As_1+s_2 | (\\rho_A,\\mathsf{Hi}(t+Au_1+u_2)) | (s_1+u_1,s_2+u_2) と署名メタデータ |
| HSAP | H_{\\mathsf{key}}(k) | H_{\\mathsf{pay}}(K,r) | (k,r) |

SPIRITの場合、(u\_1,u\_2)はrから導出されます。署名メタデータには、導出された下位ビット、公開鍵ハッシュ、および必要な補助署名マテリアルが含まれます。

HSAPの場合、\\mathsf{Sign}(p,m)は\\sigma=(T,\\pi)を返します。ここで、T=H\_{\\mathsf{auth}}(k,r,m)であり、\\piは$P=H\_{\\mathsf{pay}}(H\_{\\mathsf{key}}(k),r) \\land T=H\_{\\mathsf{auth}}(k,r,m)$を証明します。一方、\\mathsf{Ver}(P,\\sigma,m)$はこのステートメントをK、k、またはrを公開せずに検証します。

### 拡張された[[ERC-5564|ERC-5564]] schemeId = 6

Pは現在、公開検証データであることに注意してください。資金を保持する実際の[[Smart-Account|イーサリアムスマートアカウント]]アドレスにはAを使用します。[[stealth meta-address|ステルスメタアドレス]]には、(K,ek)と、選択された支出構成の識別子が含まれます。この識別子は、送信者と受信者に、どの導出アルゴリズム、パラメータ、および検証器を使用するかを伝えます。

-   送信者はekにカプセル化し、rを導出し、P=\\mathsf{PKeyGen}(K,r)を計算します。
-   送信者は合意されたファクトリを通じてスマートアカウントアドレスAを導出し、アカウントをデプロイまたは検証し、Aに資金を送り、KEM暗号文cを公開します。
-   受信者またはスキャナーはcを復号し、PとAを再計算し、アナウンスが一致するかどうかをチェックします。
-   受信者のみがkを持っており、p=\\mathsf{SKeyDer}(k,r)を導出して支出を承認できます。

既存の[[ERC-5564|ERC-5564]]アナウンサーは、そのイベントインターフェースを維持できます。

```
schemeId        = 6
stealthAddress  = A
ephemeralPubKey = c
metadata        = viewTag || scheme-specific metadata
```

同様に、[[ERC-6538|ERC-6538]]レジストリも現在のマッピングを維持できます。その`bytes`値は、鍵と、支出構成およびアカウントデプロイメントを選択するために必要な情報を伝達します。

#### 支出パス

スマートアカウントは、P、またはPへの完全なコミットメント、および対応する検証器で初期化されます。

支出を行うために、受信者は、アカウント、チェーン、ナンス、および宛先、金額、コールデータ、および手数料を含む完全な支出指示を含むメッセージmを準備します。次に、受信者は\\sigma=\\mathsf{Sign}(p,m)を生成します。

アカウントはmを再計算し、ナンスと\\mathsf{Ver}(P,\\sigma,m)=1をチェックし、ナンスを消費して承認された指示を実行します。ただし、支出トランザクションはアカウントの検証鍵や検証器を置き換えることはできません。

また、検証器は承認のみをチェックすることにも注意してください。転送、バッチ処理、ガススポンサーシップ、および[[Account-Abstraction|アカウント抽象化 (AA)]]はスマートアカウントの責任です。したがって、同じアカウントフローでSPIRITスタイルの署名とHSAP証明の両方に対応できます。

#### 以前のスキームへの回顧

-   アナウンスとスキャンフローはKEMベースのままです。
-   支出はECDSAを選択された[[Post-Quantum|PQ]]承認メカニズムに置き換えます。
-   各支出は承認検証とアカウント実行の費用を支払います。新しいアカウントはデプロイコストも発生します。
-   送信者とスキャナーはrを知っているため、選択された構成は、その知識だけで支出を防ぐ必要があります。
-   将来のプリコンパイルは、正確な構成をサポートする場合、検証コストを削減できます。
-   送信者からアカウントへのリンクとそれに続く支出リンクは公開されたままです。

*1投稿 - 1参加者*

[[Read full topic](https://ethresear.ch/t/pq-spending-for-stealth-address-protocol/26095)]
