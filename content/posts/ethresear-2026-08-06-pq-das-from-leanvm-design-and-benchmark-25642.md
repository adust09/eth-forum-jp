---
title: LeanVMによるPQ-DAS：設計とベンチマーク
original_title: 'PQ-DAS from LeanVM: Design and Benchmark'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/pq-das-from-leanvm-design-and-benchmark/25642'
author: LongMeng
date: '2026-08-06'
category: Sharding
tags:
  - sharding
  - cryptography
  - data-availability
  - zk
  - scaling
  - research
  - post-quantum
  - benchmarking
  - protocol-design
topic_id: '25642'
translated_at: '2026-08-07'
translator: gemini-2.5-flash
---

> [!note] 原文
> [PQ-DAS from LeanVM: Design and Benchmark](https://ethresear.ch/t/pq-das-from-leanvm-design-and-benchmark/25642) — LongMeng (2026-08-06)

*著者。* Long Meng、Benedikt Wagner、George Kadianakis、Francesco Risitano

*Tom Wambsgans、Thomas Coratger、Arantxa Zapico、その他の方々の洞察に富んだ議論に感謝します。*

## 1. 動機

イーサリアムは、[[glossary/Data-Availability|データアベイラビリティサンプリング (DAS)]] を使用して、バリデータが大きなブロブデータの可用性をチェックできるようにしています。これは、イレイジャーコード化されたオブジェクトから少数のランダムな位置をサンプリングすることで行われ、ペイロード全体をダウンロードする必要はありません。イーサリアムがポスト量子セキュリティへと移行するにつれて、[KZG多項式コミットメントに基づく現在のDASプロトコル](https://eprint.iacr.org/2025/1683.pdf)には、ポスト量子代替案が必要です。

この投稿ではまず、Reed-Solomonコード、ハッシュコミットメント、およびLeanVM証明システムでインスタンス化されたエンコード＋証明タイプのPQ-DAS構成を示し、次に様々な入力パラメータと出力メトリクスに対する*ベンチマーク*を示します。最新の実装コードは以下にあります: [LongMeng-Crypto/PQ-DAS](https://github.com/LongMeng-Crypto/PQ-DAS/tree/V2%2FV3-Demo)。ベンチマークとセキュリティ結果を含む補足文書は、[Supplementary.md](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md)で入手できます。

## 2. エンコード＋証明DAS：ワークフロー

一般に、DASプロトコルは、一連のユーザー、[[glossary/Block-Building|ブロックビルダー]]、および一連の検証者で構成されます。本レポートでベンチマークされたDASプロトコルは、[DAS基盤、セクション7](https://eprint.iacr.org/2023/1079.pdf)のソリューション空間からの**エンコード＋証明**パラダイムです。このクラスでは、ビルダーは誤り訂正符号 (erasure code) でデータをエンコードし、ベクトルコミットメントスキームを使用してコードワードにコミットし、コミットされたオブジェクトがSNARK証明システムを使用して有効なコードワードであることを証明します。サンプリングはコードワードシンボルの認証された位置を開示し、再構築は受け入れられたサンプルを誤り訂正符号の評価として使用します。

抽象的に、このようなDASプロトコルのワークフローは次のとおりです。

-   **初期化**: すべてのユーザーがデータをビルダーに送信します。
    
-   **コミット**: ビルダーはユーザーからデータを受け取り、まずそれらをエンコードしてコードワードにコミットし、次にデータがコードワードにエンコードされ、コードワードがコミットメントとしてコミットされていることを証明するためのSNARK証明を生成します。最後に、ビルダーはコミットメント、SNARK証明、およびすべてのシンボルに対するコミットメント開示を含むコードワードをネットワークにアップロードします。
    
-   **コミットメントのダウンロード**: 各検証者は、ネットワークから完全なコミットメントとSNARK証明をダウンロードします。各検証者は、SNARK証明がコミットメントに対して検証されるかどうかをチェックします。検証されない場合、直ちに拒否します。
    
-   **サンプリングと検証**: 各検証者は、ランダムなインデックスのセットをサンプリングし、対応するコードワードシンボルとその開示をネットワークからダウンロードしようとします。各検証者は、受信した開示がコミットメントに対して有効であるかどうかをチェックします。有効でない場合、拒否します。すべて有効である場合、受け入れます。
    

直感的には、いずれかのパーティが検証済みの十分なシンボルを収集すれば、元のデータを再構築し、不足しているシンボルをネットワークに再挿入して、他の検証者が最終的に受け入れるのを助けることができます。

非公式には、DASスキームは、完全性、(サブセット)健全性、一貫性、および修復可能性というセキュリティ特性を満たす必要があります。DASの構文とこれらの特性の正式な定義については、[DAS基盤](https://eprint.iacr.org/2023/1079.pdf)を参照してください。

**その他のスキーム**。この投稿では、[FRIDA](https://eprint.iacr.org/2024/248.pdf)や[ZODA](https://angeris.github.io/papers/da-construction.pdf)などの他のポスト量子代替案には焦点を当てていません。これは、それらが現在のKZGソリューションによって達成され、プロトコル全体で暗黙的に仮定されている*修復可能性*と呼ばれる重要な特性を満たさないためです。非公式には、この特性は、再構築されたシンボルがネットワークに再挿入され、(悪意を持って生成された可能性のある)コミットメントに対して検証されることを保証します。これにより、パーティはデータが利用可能であるかどうかについて最終的に合意することができます。この特性がない場合、周囲のプロトコルを大幅に適合させる必要があります。

## 3. 具体的な構成

全体的なワークフローを紹介した後、次に検討する構成がどのように機能するかをより正確に説明します。特に、コミットメントがどのように計算され、どのコードが使用されるかを定義します。その際、ベンチマークで変動させるパラメータも紹介します。

次の画像はワークフローを示しています。

![V3 デザインダイアグラム](https://ethresear.ch/uploads/default/optimized/3X/7/1/719f28745eabe47625d8c84b39dd94de858e4052_2_690x357.png)

構成には、[Poseidon](https://eprint.iacr.org/2019/458.pdf)ハッシュ関数（$\mathsf{H}$と表記）を使用します。誤り訂正符号としては、KoalaBear五次拡大体上のReed-Solomon (RS) コードを固定します。評価ドメインには、KoalaBear基底体における1の冪根を使用するため、エンコードはFFT (高速フーリエ変換) によって与えられます。

ベクトルコミットメントスキームとしてMerkleツリーコミットメントを選択し、SNARK証明システムとして[[glossary/leanVM|LeanVM]]を使用します。以下では、LeanVMを使用してどの関係が証明されるかについても説明します。

非常に大まかに言えば、この構成は、[PeerDAS](https://eprint.iacr.org/2024/1362.pdf)のようにデータを行列の行に配置し、Reed-Solomonコードを介して各行を拡張することで機能します。KZGコミットメントの代わりにMerkleルートを使用し、さらに上記で説明したようにSNARKを追加します。

より正確には、行長 $k$、エンコードされた行長 $m = 2k$ (レート $\rho = 1/2$ を意味する)、セルサイズ $c$、行あたりのセル数 $\ell=m/c$、および再構築閾値 $t=\lceil k/c\rceil$ を設定します。各データオブジェクトは $n$ 行 (各行は今日ではブロブと呼ばれる) に解析され、各行は1つのReed-Solomonコードワードとしてエンコードされ、最初の $k$ シンボルはシステマティックペイロードシンボルです。これらのパラメータにより、プロトコルワークフローは次のように記述されます。

-   **初期化**: すべてのユーザーがデータをビルダーに送信します。
    
-   **コミット**: ビルダーは次の手順を実行します。
    
-   各ブロブデータをRSコードワードにエンコードします。$w_i$ をコードワードの $i$ 番目の行とします。
    
-   すべてのコードワードを $n \times m$ 行列に配置し、各行を1つのコードワードとします。次に、各行 $i \in [1, n]$ のコードワードを $\ell$ 個の連続するセル $W_{i,j}\quad (j \in [1, \ell])$ に分割します。各セルは $c$ 個の体要素を含みます。各セルはダイジェスト $e_{i,j}=\mathsf{H}(W_{i,j})$ にハッシュされます。
    
-   各行 $i$ について、システマティックペイロードセルをカバーする最初の $t$ 個のセルダイジェストが、行ダイジェスト $r_i=\mathsf{H}(e_{i,1},\ldots,e_{i,t})$ にハッシュされます。行ダイジェストはMerkleツリーを介して $\mathsf{root}_{\mathsf{row}}$ にコミットされます。この行コミットメントは、各行のシステマティックデータへのコンパクトなバインディングを提供します。
    
-   各セル列 $j \in [1, \ldots, \ell]$ について、ダイジェスト $(e_{1,j},\ldots,e_{n,j})$ はMerkleツリーを介して列ルート $C_j$ に集約されます。列ルート $(C_1,\ldots,C_{\ell})$ はさらにMerkleツリーを介して $\mathsf{root}_{\mathsf{col}}$ に集約されます。
    
-   行ルート $\mathsf{root}_{\mathsf{row}}$ と列ルートはさらにハッシュされ、コミットメント $\mathsf{root}=\mathsf{H}(\mathsf{root}_{\mathsf{row}},\mathsf{root}_{\mathsf{col}})$ を形成します。
    
-   公開パラメータと $\mathsf{root}$ から公開Reed-Solomonメンバーシップチェックベクトル $L$ を計算します。Fiat-Shamirを介して $L$ を計算する方法の詳細は、次のセクション「RSメンバーシップチェックのインスタンス化」を参照のこと。
    
-   LeanVM証明 $\pi$ は、これらのコミットメントを有効なReed-Solomonコードワードにバインドします。具体的には、$\pi \leftarrow \mathsf{LeanVM}.\mathsf{Prove}(\mathsf{pp}_{\mathsf{STARK}}, \mathsf{stmt}, \mathsf{witn}, \mathcal{R})$ となります。
    

公開ステートメント、証人、および証明された関係は次のように定義されます。

$$
\begin{aligned} \mathcal{R} = \{(\mathsf{stmt},\mathsf{witn}) \;:\;& \mathsf{stmt} = (\{\mathsf{r}_i\}_{i \in [1, n]}, L, \mathsf{root}), \\ & \ \mathsf{witn}= \{W_{i, j}\}_{i \in [1, n], j \in [1, \ell]}, \\ & \forall i\in[1,n],j\in[1,\ell],\;\mathsf{e}_{i,j}=\mathsf{H}(W_{i,j}),\\ & \forall i\in[1,n],\;\mathsf{r}_i=\mathsf{H}(\mathsf{e}_{i,1},\ldots,\mathsf{e}_{i,t}),\\ & \mathsf{root}_{\mathsf{row}}=\mathsf{Merkle.Com}(\mathsf{r}_1,\ldots, \mathsf{r}_n), \\ & \forall j\in[1,\ell],\;\mathsf{C}_j=\mathsf{Merkle.Com}(\mathsf{e}_{1,j}, ..., \mathsf{e}_{n,j}),\\ & \mathsf{root}_{\mathsf{col}}=\mathsf{Merkle.Com}(\mathsf{C}_1, ..., \mathsf{C}_{\ell}),\\ & \forall i\in[1,n],\;\langle L, w_i\rangle=0 \}, \\ & \mathsf{root} = \mathsf{H}(\mathsf{root}_{\mathsf{row}}, \mathsf{root}_{\mathsf{col}}). \end{aligned}
$$

証明を生成した後、ビルダーは各 $j \in [1,\ell]$ の列セル $W_{1,j},\ldots,W_{n,j}$ のMerkle認証パスを生成します。次に、すべてのコードワードセル $W_{i,j}$、行ハッシュ $r_i\quad(i \in [1,n])$、列ルート $\mathsf{root}_{\mathsf{col}}$、LeanVM証明 $\pi$、およびすべての列セルのMerkle開示をアップロードします。

-   **コミットメントのダウンロード**: 各検証者は、行ハッシュ $r_i\quad(i \in [1,n])$、列ルート $\mathsf{root}_{\mathsf{col}}$、leanVM証明 $\pi$ をダウンロードします。各検証者は、$r_i\quad(i \in [1,n])$ から $\mathsf{root}_{\mathsf{row}}$ を計算し、$\mathsf{root} = \mathsf{H}(\mathsf{root}_{\mathsf{row}}, \mathsf{root}_{\mathsf{col}})$ を計算し、公開パラメータと $\mathsf{root}$ からベクトル $L$ を再計算し、$\pi$ が $\mathsf{root}$ に対して検証されるかどうかをチェックします。検証されない場合、直ちに拒否します。
    
-   **サンプリングと検証**: 検証者はセル列インデックスのセット $Q$ をサンプリングし、ネットワークにクエリを送信して、$j \in Q$ のサンプリングされた列 $W_{1,j},\ldots,W_{n,j}$ と、最終的な $\mathsf{root}$ へのMerkleツリーパスをダウンロードします。各検証者は、Merkleパスが $\mathsf{root}$ に対して有効であるかどうかをチェックします。有効でない場合、拒否します。すべて有効である場合、受け入れます。
    

## 4. RSメンバーシップチェックのインスタンス化

証明する関係において、最終的に各コードワード行 $w_i$ が有効なRSコードワードであることをチェックしたいと考えています。これを、ランダムベクトル $L$ との単純な内積を介して実装します。

このチェックをインスタンス化するには、いくつかの方法があります。パリティチェック、汎用重心チェック、およびRSコードレート $\rho = {1}/{2}$ の場合の特殊な形式の重心チェックの3つのアプローチを調査します。これらのアプローチの詳細は、[RS membership check](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md#RS-Membership-Check-Instantiations)を参照してください。

これら3つのアプローチの計算オーバーヘッドは非常に近いです。長さ $m$ のコードワードと $n$ 行の場合、Fiat-Shamir後に証明外で公開ベクトル $L$ を計算するコストは $\mathcal{O}(m)$ 体演算です。証明内では、RSメンバーシップ関係は行あたり1つの長さ $m$ の内積であるため、証明内の総コストは $\mathcal{O}(nm)$ 体演算です。

私たちの実装では、ベンチマークされたRSコードのレートが $\rho=1/2$ であるため、特殊な重心チェックを選択します。これにより、コードワードを偶数および奇数評価に分割でき、メンバーシップは単一の恒等式 $A_i(p)=B_i(p/\omega)$ に還元されます。パリティチェック法と比較して、すべての高次係数に対するランダムな線形結合の構築を回避します。汎用重心チェックと比較して、選択されたシステマティック分割に対する任意のLagrange基底の評価を回避します。したがって、計算がわずかに安価になり、LeanVMワークロードも安価になります。

以下では、Fiat-Shamir変換に異なるハッシュ関数 $\mathsf{H}'$ を使用します。これは、SHA256、Keccak、またはBlakeのような標準的なハッシュ関数である可能性があります。

### 特殊な重心チェック:

#### 証明外での前処理:

-   $\{\mathsf{U}\}=\{\omega^0,\omega^1,\ldots,\omega^{m-1}\}$ とします。ここで、$\omega$ は原始 $m$ 次1の冪根であり、$m=2k=2h$ と仮定します。
    
-   $i$ を行インデックス、$j$ を各行のコードワードシンボルインデックス、$r$ を半サイズドメインのインデックスとします。
    
-   $r\in[0,h-1]$ に対して $x_r=(\omega^2)^r$ を定義します。
    
-   各行 $w_i$ に対して、$A_i(x_r)=w_{i,2r}$ および $B_i(x_r)=w_{i,2r+1}$ を定義します。
    
-   Fiat-Shamir変換を使用して、ランダムチャレンジ $p \leftarrow\mathsf{H}'({\mathsf{pp}},\mathsf{root})$ を導出し、$q=p/\omega$ と設定します。
    
-   $\ell_r(z)=\frac{z^h-1}{h}\cdot\frac{x_r}{z-x_r}$ を定義します。
    
-   共有重心チェックベクトル $L=(L_0,\ldots,L_{m-1})$ を計算します。ここで、$\forall r\in[0,h-1]:L_{2r}=\ell_r(p)$ および $L_{2r+1}=-\ell_r(q)$ です。
    

#### 証明内での内積:

$$
\begin{aligned} \forall i\in[1,n]:\quad \langle L,w_i\rangle &= \sum_{j=0}^{m-1}L_jw_{i,j} = \sum_{r=0}^{h-1}L_{2r}w_{i,2r} +\sum_{r=0}^{h-1}L_{2r+1}w_{i,2r+1} \\ &= \sum_{r=0}^{h-1}\ell_r(p)w_{i,2r} -\sum_{r=0}^{h-1}\ell_r(q)w_{i,2r+1} = A_i(p)-B_i(q) \\ &= A_i(p)-B_i(p/\omega) = 0. \end{aligned}
$$

### 健全性の直感

健全性の直感として、特殊な重心チェックはFiat-Shamirを使用して公開コミットメントから公開ランダム点 $p$ をサンプリングし、次に公開ベクトル $L=L(p)$ を導出します。証明は、各行に対して $\langle L,w_i\rangle=0$ を示すだけでよく、これは $A_i(p)=B_i(p/\omega)$ をチェックすることと同じです。もし行 $w_i$ が有効なRSコードワードでない場合、$A_i(X)-B_i(X/\omega)$ は次数が高々 $k-1$ の非ゼロ多項式であるため、ランダムな $p$ がそれをゼロにする確率は高々 $(k-1)/|\mathbb{F}|$ です。すべての $n$ 行にわたって、和集合限界は高々 $n(k-1)/|\mathbb{F}|$ を与えます。

* * *

## 5. ベンチマークメトリクス

私たちが最も重視する主要なメトリクスは**フルDASスループット**です。これは、1秒あたりにビルダーからバリデータへの承認パスを通過できる有用なブロブペイロードの量を示します。以下では、このスループットが、以下の表で説明されている測定メトリクスからどのように計算されるかを説明します。

以下の表のパラメータを使用すると、フルDASスループットは次のように計算されます。

$$
\frac{D_{\mathrm{payload}}}{T_{\mathrm{total}}}
$$

ここで、$D_{\mathrm{payload}}$ は有用なブロブペイロードサイズです。総ワークフローは1つのビルダーと $N_{\mathrm{clients}}$ 個の検証者を含みます。

$$
T_{\mathrm{total}}=T_{\mathrm{builder}}+T_{\mathrm{verifiers}}
$$

$B_{\mathrm{upload}}$ と $B_{\mathrm{download}}$ は、それぞれ仮定されるビルダーのアップロード帯域幅と検証者のダウンロード帯域幅を示します。

ビルダー側の時間は次のとおりです。

$$
T_{\mathrm{builder}}=T_{\mathrm{encode+commit}}+T_{\mathrm{preprocess}}+T_{\mathrm{prove}}+T_{\mathrm{open}}+\frac{D_{\mathrm{codeword}}+D_{\mathrm{commit}}+D_{\mathrm{proof}}}{B_{\mathrm{upload}}}
$$

検証者側の時間は次のように記述されます。

$$
T_{\mathrm{verifiers}}=\max_{a\in\{1,\ldots,N_{\mathrm{clients}}\}}T_{\mathrm{verifier}}^{(a)}
$$

ここで、

$$
T_{\mathrm{verifier}}^{(a)}=T_{\mathrm{verifier rebuild}}+T_{\mathrm{verify proof}}+T_{\mathrm{verify openings}}+\frac{D_{\mathrm{commit}}+D_{\mathrm{proof}}+D_{\mathrm{sample}}}{B_{\mathrm{download}}}.
$$

上記の式は楽観的な上限モデルです。すべてのパーティがアイドルギャップなしでプロトコルステージを実行し、測定されたローカル計算とモデル化されたアップロード/ダウンロード時間のみを課金すると仮定しています。これは実際のネットワークシミュレーションではなく、ゴシップレイテンシ、ピアスケジューリング、メムプール/ブロック伝播効果は含まれていません。アップロードおよびダウンロード時間は、アップロード/ダウンロードされたバイトサイズと、仮定される $B_{\mathrm{upload}}=B_{\mathrm{download}}=50 \text{ Mbps}$ の帯域幅（この仮定は[[glossary/EIP|EIP]]-7870: ハードウェアと帯域幅の推奨事項に基づいています）から計算されます。エンドポイントは、証明検証と開示検証後の検証者による承認です。

フルDASスループットを計算する際には、すべての検証者が同時に計算し、ほぼ同じ時間を費やす理想的な並列ケースを仮定しているため、$T_{\mathrm{verifiers}}$ はすべての検証者の合計ではなく、1つの（最も遅い）検証者の時間にすぎません。

| メトリクス | 意味 |
| --- | --- |
| Dpayload | ユーザーの総データサイズ |
| Dcodeword | コードワードの総サイズ |
| Dcommit | 公開コミットメントのサイズ |
| Dproof | LeanVM証明サイズ |
| Dsample | $|Q|$ 列のサンプリングされた開示のサイズ |
| Tencode+commit | データのエンコード、セルダイジェストの計算、ベクトルコミットメントの構築にかかる時間 |
| Tpreprocess | RSメンバーシップチェックベクトル $L$ の計算にかかる時間 |
| Tprove | LeanVM証明の生成にかかる時間 |
| Topen | サンプリングされた開示の生成にかかる時間 |
| Trebuild | 検証者がベクトル $L$ を再構築する時間 |
| Tverify proof | LeanVM証明の検証にかかる時間 |
| Tverify openings | サンプリングされた列開示の検証にかかる時間 |
| Treconstruct | 承認されたセルからデータを再構築する時間 |
| VM cycles | LeanVMゲストサイクル |
| Poseidon16 calls | 証明関係で使用されるPoseidon幅16コール数 |
| ExtensionOp calls | RSメンバーシップで使用される拡大体演算コール数 |
| LeanVM proving throughput | 実効ペイロードをLeanVM証明時間で割った値 |
| Full DAS throughput | 実効ペイロードを、検証者がブロックを承認するまでのクリティカルなビルダーからバリデータへのワークフロー時間で割った値 |

**補足。** 検証者によって開示されるサンプリングされたセル列の数（$|Q|$ と表記）は、目的のサブセット健全性レベルによって決定されます。それを導出するための式は、補足資料の[サブセット健全性式](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md#subset-soundness-formula)セクションに記載されています。

## 6. ベンチマーク結果の概要

本レポートのベンチマーク数値は、Intel Core i9-14900 CPU、32論理CPU（16コア、コアあたり2スレッド）、32 GiBメモリ、単一NUMAノード、36 MiB L3キャッシュ、AVX2サポートを備えたローカルPCで測定されました。ベンチマークでは、このマシン上のローカルデフォルトのRayonスレッドプールを使用しています。各ベンチマークプロファイルは、エンドツーエンドのPQ-DAS実行として実行されます。データをエンコードしてコミットし、LeanVMステートメントを準備し、LeanVM証明を生成し、開示を生成し、証明と開示を検証し、有効な場合はサンプリングされたペイロードを再構築します。報告される計測時間は、同じパラメータプロファイルで100回実行した平均値です。サイズ、セキュリティ推定値、VMカウンターは固定プロファイルに対して決定論的であり、1回報告されます。

ベンチマークスイープは、ブロブサイズ $k$、セルサイズ $c$、行数 $n$、および上記の拡大体構成に関するWHIRレートを変動させます。ベンチマークプロファイル名は `bX-cY-rZ-wT` の形式を使用します。`bX` はブロブサイズ乗数、`cY` は拡大体シンボルでのセルサイズ、`rZ` は行数 $n$、`wT` はWHIR対数逆レートを示します。これらの比較を解釈可能にするために、各スイープは1つのパラメータファミリーを除くすべてを固定します。ブロブサイズスイープは $n=14$ と $\ell=1024$ を固定し、$k,m,c$ を一緒にスケーリングします。2倍および4倍セルサイズスイープはブロブサイズと $n=14$ を固定し、$c$ を変動させます。2倍および4倍行数スイープはブロブサイズとセルサイズを固定し、$n$ を変動させます。WHIRレートスイープは2つの代表的なプロファイルを固定し、WHIR対数逆レートのみを変動させます。コンパクトなパラメータ概要は[表0](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md#table-0-benchmark-sweep-parameter-summary)に示されており、生の測定値は補足資料の[ベンチマーク表](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md#benchmark-tables)セクションに収集されています。

各スイープで最高の測定点は、詳細な考察の前に以下にまとめられています。

| スイープ | ベストプロファイル | n | k | m | c | ℓ | WHIR対数逆レート | LeanVM証明スループット | フルDASスループット |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ブロブサイズスイープ | b4-c64-r14-w1 | 14 | 32768 | 65536 | 64 | 1024 | 1 | 907.38 KiB/s | 623.21 KiB/s |
| 2倍セルサイズスイープ | b2-c32-r14-w1 | 14 | 16384 | 32768 | 32 | 1024 | 1 | 846.33 KiB/s | 578.60 KiB/s |
| 2倍行数スイープ | b2-c32-r14-w1 | 14 | 16384 | 32768 | 32 | 1024 | 1 | 887.16 KiB/s | 602.28 KiB/s |
| 4倍セルサイズスイープ | b4-c32-r14-w1 | 14 | 32768 | 65536 | 32 | 2048 | 1 | 882.29 KiB/s | 609.71 KiB/s |
| 4倍行数スイープ | b4-c32-r6-w1 | 6 | 32768 | 65536 | 32 | 2048 | 1 | 795.89 KiB/s | 538.65 KiB/s |
| WHIRレートスイープ | b2-c32-r14-w1 | 14 | 16384 | 32768 | 32 | 1024 | 1 | 789.38 KiB/s | 551.19 KiB/s |

主な考察は次のとおりです。

-   **ブロブサイズスイープ:** 固定 $\ell=1024$ および $n=14$ で、1倍から2倍/4倍のペイロードに移行すると、固定証明オーバーヘッドが償却されます。このスイープで最高のフルDASスループットは `b4-c64-r14-w1` で623.21 KiB/sであり、2倍と4倍はほぼ同じLeanVM証明スループット約0.9 MiB/sを示します（[表1](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md#table-1-blob-size-sweep)）。
    
-   **2倍セルサイズスイープ:** $k=16384, m=32768, n=14$ の場合、$c=32$ が最高の測定点であり、LeanVM証明スループットは846.33 KiB/s、フルDASスループットは578.60 KiB/sです。より大きなセルはVMサイクルを削減しますが、開示サイズを増加させ、この実行ではフルスループットを改善しません（[表2](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md#table-2-cell-size-sweep-at-2x-blob-size)）。
    
-   **2倍行数スイープ:** $n$ を増やすと、パディングクリフが現れるまで固定オーバーヘッドが償却されます。最高の測定フルDASスループットは $n=14$ で602.28 KiB/sであり、$n=16$ と $n=32$ では急激な証明時間クリフが見られます（[表3](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md#table-3-row-count-sweep-at-2x-blob-size)）。
    
-   **4倍セルサイズスイープ:** 4倍ブロブサイズでは、$c=32$ が最高の測定点であり、LeanVM証明スループットは882.29 KiB/s、フルDASスループットは609.71 KiB/sです。$c=64$ は近いですが、$c=16$ はセル数が2倍になるためはるかに遅くなります（[表4](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md#table-4-cell-size-sweep-at-4x-blob-size)）。
    
-   **4倍行数スイープ:** 最高の測定フルDASスループットは $n=6$ で538.65 KiB/sです。より大きな行数は、特に $n=16$ のいくつかの境界で証明システムパディングコストが支配的になるため、スループットを単調に改善しません（[表5](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md#table-5-row-count-sweep-at-4x-blob-size)）。
    
-   **WHIRレートスイープ:** WHIR対数逆レート1は、テストされた両方のプロファイルで対数逆レート2よりも一貫して高速です。対数逆レート2は証明サイズを削減しますが、証明時間を増加させ、フルDASスループットを低下させるのに十分な影響を与えます（[表6](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md#table-6-whir-rate-sweep)）。
    

証明サイズ、サンプルサイズ、VMサイクル、Poseidon16コール、拡大体演算コール、および再構築時間を含む完全な測定値については、補足資料の[ベンチマーク表](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary.md#benchmark-tables)を参照してください。

また、AMD EPYC 9V74プロセッサ、32論理CPU（16コア、コアあたり2スレッド）、62 GiBメモリ、AVX-512サポートを備えたより強力なサーバーで同じベンチマークプロファイルを実行しました。代表的な `b4-c64-r14-w1` プロファイルの場合、このサーバーはLeanVM証明スループットを907.38 KiB/sから1183.20 KiB/sに30.4%向上させ、フルDASスループットを623.21 KiB/sから794.57 KiB/sに27.5%向上させました。完全なサーバー側ベンチマーク表は[Supplementary2.md](https://github.com/LongMeng-Crypto/PQ-DAS/blob/b1927fa29768c83eacacaf4d441c91bfbab0d4f2/PQ-DAS%20Docs/Supplementary2.md)で入手できます。

## まとめと今後の方向性

全体として、私たちの実験から以下の要約が得られました。

-   **主な成果:** ポスト量子DAS構成は、ハッシュベースコミットメントとLeanVM証明を使用して、最も強力な測定プロファイルで約0.9 MiB/s、単一プロファイル実行では時折約1 MiB/sに達するスループットで実装できます。
    
-   **パラメータ選択:** セルサイズ $c=32$ は2倍プロファイルで現在の最強点であり、$c=32$ と $c=64$ は4倍プロファイルで両方とも競争力があり、行数 $n=12$ から $n=14$ 付近では、正確な2のべき乗でみられる大きな証明時間クリフを回避できます。
    
-   **主なボトルネック:** 証明関係は依然として、セル/行/列コミットメントのためのPoseidonコールと、RSメンバーシップのための拡大体演算によって支配されています。LeanVM内でこれらのコストを削減することが、より高いスループットへの最も明確な道筋です。
    

そして、次のステップとして取り組むべき方向性は以下のとおりです。

-   **分散ブロブ証明**: 現在のバージョンでは、1つのビルダーがすべてのユーザーのデータを受け取り、1つのDASコミットメントを生成すると仮定しています。分散バージョンでは、各ユーザー/プルーバーが自身の行を証明し、行証明を中央アグリゲーターに送信し、アグリゲーターが最終的な集約コミットメント/証明を構築します。これは、行あたりの通信量が、行ペイロードを直接アグリゲーターに送信するよりも小さい場合にのみ価値があります。プルーバーがLeanVM証明 $\pi_i$、行ダイジェスト $r_i$、およびすべての $\ell$ セルダイジェストを送信する必要がある場合、$|\pi_i|+|r_i|+\ell\cdot|\mathsf{digest}| < D_{\mathrm{blob}}$ である必要があります。ベンチマークされた2倍ブロブサイズプロファイルでは、$\ell=1024$ セルと仮定すると、$D_{\mathrm{blob}}\approx310 \text{ KiB}$ であり、各ダイジェストは32バイトであるため、行証明は約$310\text{ KiB}-32\text{ KiB}-32\text{ B}\approx278 \text{ KiB}$未満である必要があります。4倍ブロブサイズプロファイルの場合、同様の閾値は約$620\text{ KiB}-32\text{ KiB}-32\text{ B}\approx588 \text{ KiB}$です。そうでなければ、生のブロブをアグリゲーターに送信し、アグリゲーターに通常の集中型証明を生成させる方が単純で安価です。
    
-   **代替誤り訂正符号**: RSコードを、[多重度コード](https://eprint.iacr.org/2025/1414)や[線形時間エンコード可能コード](https://eprint.iacr.org/2021/1043)など、潜在的に効率的な他のコードに置き換え、現在の結果と比較してその効率をベンチマークする予定です。
    
-   **代替証明システム**: また、DAS SNARK/STARKレイヤーをLeanVM以外の証明システム、またはDAS固有の漸進的な変更を加えたLeanVMでインスタンス化し、同じDAS構成でより良いスループットが得られるかどうかをベンチマークする予定です。*著者。* Long Meng, Benedikt Wagner, George Kadianakis.
    

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/pq-das-from-leanvm-design-and-benchmark/25642)
