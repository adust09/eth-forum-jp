---
title: エフェメラルロールアップ：イーサリアムの新たな「L1.5」
original_title: 'Ephemeral Rollup: The New "L1.5" of Ethereum'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/ephemeral-rollup-the-new-l1-5-of-ethereum/26187'
author: namnc
date: '2026-10-28'
category: ZK Rollup
tags:
  - zk-rollup
  - rollup
  - account-abstraction
  - zk
  - cryptography
  - privacy
  - protocol-design
  - scaling
  - mempool
topic_id: '26187'
translated_at: '2026-10-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Ephemeral Rollup: The New "L1.5" of Ethereum](https://ethresear.ch/t/ephemeral-rollup-the-new-l1-5-of-ethereum/26187) — namnc (2026-10-28)

# エフェメラルロールアップ：イーサリアムの新たな「L1.5」

## 要約;

イーサリアムの核となる役割は常に[[glossary/State-transition-function|状態遷移]]の検証でした。[[glossary/Rollup|ロールアップ]]はその検証を簡潔にしましたが、同時にユーザーの[[glossary/State-Preservation|状態]]を保持するため、すべての[[glossary/Rollup|ロールアップ]]には[[glossary/exit|イグジット]]が必要です。ネイティブな[[glossary/Account-Abstraction|アカウント抽象化 (Account Abstraction)]]（[[glossary/EIP|EIP（Ethereum 改善提案）]]-[[glossary/EIP-8141|8141 (フレームトランザクション)]]および関連[[glossary/EIP|EIP]]）と[[glossary/proof-aggregation|証明集約]]により、計算と[[glossary/State-Preservation|状態]]を分離することが実用的になっています。私たちはこれを**L1.5**と呼んでいますが、これはレイヤーというよりもアーキテクチャパターンと呼ぶべきかもしれません。このパターンでは、a) ウォレットがユーザー自身の[[glossary/State-Preservation|状態]]をクリアな形で保持し、b) [[glossary/Layer-1|L1]]が共有[[glossary/State-Preservation|状態]]を保持し、すべての[[glossary/State-transition-function|状態遷移]]を検証し、c) その間の計算は、次のジョブが必要とする[[glossary/State-Preservation|状態]]を一切保持しない者が実行し、d) [[glossary/State-Preservation|状態]]変更は直接[[glossary/Layer-1|L1]]上で決済されます。

> このアイデアは新しいものではありません。[[glossary/relayer|リレイヤー]]、[[glossary/Block-Building|ビルダー]]、キーパーはすでにこの種の仕事の一部を担っており、[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]のインクルーダーがそれに続きます。新しいのは、これが構築可能になる「今、そしてこれから」というタイミングです。この記事では、その大まかな概念化のみを目的としています。

## はじめに

イーサリアムは当初、[[glossary/State-transition-function|状態遷移]]を再実行することで検証していました。[[glossary/Rollup|ロールアップ]]は簡潔な検証を追加し、[[glossary/fraud-proof|不正証明]]または[[glossary/validity-proof|有効性証明]]によって[[glossary/Layer-1|L1]]がバッチを再実行せずに受け入れることができるようになりました。しかし、[[glossary/Rollup|ロールアップ]]はユーザーの[[glossary/State-Preservation|状態]]も保持します。[[glossary/State-Preservation|状態]]は[[glossary/Rollup|ロールアップ]]のコントラクトに保持され、[[glossary/Rollup|ロールアップ]]のみがそれを変更できるため、ユーザーは離脱するために[[glossary/exit|イグジット]]を必要とします。これは意図的な選択でした。なぜなら、[[glossary/Rollup|ロールアップ]]はイーサリアムをスケーリングするために構築され、当時[[glossary/State-Preservation|状態]]を[[glossary/Layer-1|L1]]からオフチェーンに保つことが効率的な方法だったからです。

2021年の[[glossary/Rollup|ロールアップ]]ガイドが述べているように、[[glossary/Rollup|ロールアップ]]は「計算（および[[glossary/State-Preservation|状態]]ストレージ）をオフチェーンに移動」させます。ユーザー[[glossary/State-Preservation|状態]]を[[glossary/Layer-1|L1]]に保持することは高コストでした。1) 各ユーザーの[[glossary/State-transition-function|状態遷移]]は[[glossary/Layer-1|L1]]上で一つずつ検証される必要があり、これは高価でした。2) [[glossary/Account-Abstraction|アカウント]]の鍵保持者のみが[[glossary/transaction|トランザクション]]を送信できたため、誰か（[[glossary/relayer|リレイヤー]]または[[glossary/sequencer|シーケンサー]]）が各[[glossary/State-transition-function|状態遷移]]を提出し、その[[glossary/gas|ガス]]を支払う必要がありました。

現在予定または提案されている[[glossary/EIP|EIP]]は、上記の2つの問題の両方に対処しています。1) [[glossary/Frame-Transactions|フレームトランザクション (Frame Transactions)]]により、コントラクトは自身の[[glossary/transaction|トランザクション]]を送信し、その費用を支払うことができます。2) [[glossary/proof-aggregation|証明集約]]により、各証明は[[glossary/Mempool|メムプール (Mempool)]]で一度チェックされ、ブロックはそれらすべてに対して1つの証明を運びます。これにより、アプリケーションがその[[glossary/State-Preservation|状態]]を[[glossary/Layer-1|L1]]に保持し、計算をそれを行うことができる誰にでも委譲することが実用的になります。

この新しいパターンを2つの部分に分けて概念化を試みます。パート1ではパターンを説明し、パート2ではそのコンテキストを説明します。

## パート1：パターン

### 状態の3つの場所

```
ウォレット : ユーザー自身の状態、クリアな形で、およびそれを開くための秘密鍵
L1     : 共有およびグローバルな状態
         ユーザーの状態の各部分に対するコミットメント（その来歴）
         使用済み部分ごとの「使用済み」マーカー（ナリファイア）
         すべての状態遷移の検証者
L1.5   : f(L1の状態, ユーザーの入力) -> (新しい状態, 証明)
         1つのトランザクションまたは1つのラウンド用; 次のジョブが必要とするものは何も保持しない
```

これは[[glossary/Layer-2|L2]]が使用するコミット・アンド・プルーフ設計ですが、コミットメントが[[glossary/Layer-1|L1]]上にあり、オープニングがウォレット内にある点が異なります。[[glossary/Layer-1|L1]]は次の[[glossary/State-transition-function|状態遷移]]をチェックするために必要なものだけを保持し、ウォレットはその他すべてを保持し、L1.5は計算のみを行います。

> 実情確認: プライベート[[glossary/Rollup|ロールアップ]]はすでにウォレットにノートを保持しています。Aztecでは、ユーザーのPXEがクライアント上で実行されノートを保存し、[[glossary/transaction|トランザクション]]は「新しいノートコミットメントと[[glossary/nullifier|ナリファイア]]」を[[glossary/sequencer|シーケンサー]]に送信し、[[glossary/sequencer|シーケンサー]]はそれらを[[glossary/Rollup|ロールアップ]]のツリーに追加します。
> L1.5では、コミットメントと[[glossary/nullifier|ナリファイア]]は、[[glossary/Rollup|ロールアップ]]がそれらを間に保持することなく、直接[[glossary/Layer-1|L1]]に送られます。

### L1.5が保証すべきこと

この記事で考察するプライベート決済のケースでは、ジョブを[[glossary/Operator|オペレーター]]ではなくL1.5と呼ぶために、4つの特性を持つことを望みます。

-   **ステートレス:** ジョブが完了したら誰もそれに依存せず、誰でも次のジョブを引き受けることができます。ワーカーはキャッシュを保持できますが、次のジョブが必要とするものは何も保持しません。
-   **チェック済み:** [[glossary/Layer-1|L1]]がその出力を検証します。
-   **リンクなしで支払い済み:** ユーザーは誰であるかを明かすことなく支払うことができます。
-   **[[glossary/Operator|オペレーター]]なしで着地:** その出力は、提出するための長期間存続する[[glossary/Account-Abstraction|アカウント]]なしに、[[glossary/Layer-1|L1]]に到達し、その費用を支払います。

最後の点がかつては難しい部分でしたが、ネイティブ[[glossary/Account-Abstraction|アカウント抽象化]]がそれを実用的にします。

### 誰が状態遷移を送信するか

[[glossary/EIP|EIP]]-[[glossary/EIP-8141|8141 (フレームトランザクション)]]の下では、[[glossary/transaction|トランザクション]]は[[glossary/Frame-Transactions|フレームトランザクション]]のリストです。`VERIFY`[[glossary/Frame-type|フレームタイプ]]は実行、支払い、またはその両方を承認でき、最大100,000[[glossary/gas|ガス]]を使用し、送信者自身の[[glossary/State-Preservation|状態]]のみを読み取ることができます。したがって、アプリケーションコントラクトは自身の`VERIFY`[[glossary/Frame-type|フレームタイプ]]で証明をチェックし、移動する資金から手数料を支払うことができます。[[glossary/EIP|EIP]]-[[glossary/EIP-8250|8250 (キー付きNonce)]]は[[glossary/Keyed-Nonces|キー付きNonce (Keyed Nonces)]]を追加します。「例えばプライバシー[[glossary/nullifier|ナリファイア]]から派生したもの」であり、チェーンは再利用された[[glossary/Async-nonce|非同期Nonce (Async nonce)]]を拒否するのと同じ方法で二重支払いを拒否します。[[glossary/EIP|EIP]]-[[glossary/EIP-8288|8288 (再帰的STARKトランザクション事前承認)]]は、各[[glossary/Mempool|メムプール]]ノードが証明を一度だけチェックできるようにし、ブロックはそれらすべてに対して「1つの[[glossary/Recursive-STARK|再帰的STARK]]」を運びます。これらにより、コントラクトのみが[[glossary/transaction|トランザクション]]の費用を支払い、どのノードもそれを[[glossary/relayer|リレー]]できるため、ユーザーは支払い元のアドレスに[[glossary/stake|ETH]]を必要としません。

> 以下は、[[glossary/Hegot|ヘゴタ (Hegotá)]]テストネットワークで実行した[[glossary/Privacy-Pool|プライバシープール (privacy pool)]]からの償還です（[[glossary/transaction|トランザクション]]）。

```
[0] VERIFY   最近のルート   スロットごとのプールのルート             (EIP-8272)
[1] VERIFY   プール       証明をチェック; 実行と支払いを承認
[2] SENDER   プール       引き出し: 受取人に支払い、手数料を差し引く
[3] DEFAULT  プール       未使用の手数料を受取人に返金
nonce key:   ノートのナリファイアハッシュ                            (EIP-8250)
署名:  なし
```

> フレーム\[0\]は[[glossary/EIP|EIP]]-8272を介して最近のルートを読み取り、フレーム\[1\]は[[glossary/Layer-1|L1]]が証明をチェックする場所です。[[glossary/EIP|EIP]]-8288では、証明チェックはこの[[glossary/Frame-type|フレームタイプ]]から別の依存関係[[glossary/Frame-type|フレームタイプ]]に移動します。いずれにせよ、[[glossary/Layer-1|L1]]は資金が移動する前に証明をチェックします。

## パート2：文脈におけるL1.5

### 命名と先行技術

このパターンは、1つのアプリケーションから[[glossary/Layer-2|L2]]、プロトコル自体まで、あらゆる規模に適用されます。

[[glossary/Layer-2|L2]]と比較すると、[[glossary/Layer-2|L2]]はユーザーの[[glossary/State-Preservation|状態]]を保持するため、ユーザーは[[glossary/exit|イグジット]]を必要としますが、L1.5は[[glossary/State-Preservation|状態]]を保持しません。L1.5はまた、誰がシーケンスし、誰が実行するかを記述する*ベースド*と*ネイティブ*とは独立しており、L1.5は誰が[[glossary/State-Preservation|状態]]を保持するかに関するものです。私たちはその位置がウォレットと[[glossary/Layer-1|L1]]の間にあるため「1.5」と呼んでいます。もし本当に「X-[[glossary/Rollup|ロールアップ]]」という名前を付ける必要があるなら、Xは*エフェメラル*（一時的）でしょう。

イーサリアム上のいくつかの役割（既存または計画中）は、すでにこの一部を担っています。それらのそれぞれにおいて、誰かが計算を行い、[[glossary/State-Preservation|状態]]はユーザーまたは[[glossary/Layer-1|L1]]に留まりますが、それぞれが上記の4つの特性の一部しか持っていません。

| 役割 | 計算内容 | その後に保持するもの |
| --- | --- | --- |
| [[glossary/relayer|リレイヤー]]、Tornado CashまたはRailgun向け | ユーザーが証明した引き出しを提出し、手数料として[[glossary/gas|ガス]]を支払う | 何もなし; コントラクトがツリー、[[glossary/nullifier|ナリファイア]]、証明チェックを保持 |
| バッチインサーター、例: World IDの[[glossary/sequencer|シーケンサー]] | バッチのMerkleツリー更新、証明付き | コントラクトが依存するものは何もなし |
| [[glossary/Privacy-Pool|プライバシープール]]の[[glossary/Association-Set-Provider|アソシエーションセットプロバイダー (ASP)]] | 保証する預金、ルートとして投稿 | セットの内容、オフチェーン |
| [[glossary/Block-Building|ビルダー]]と[[glossary/relayer|リレー]]、MEV-Boost向け | プロポーザー向けのブロック | ブロックが公開されたら何もなし |
| キーパー、暗号化された[[glossary/Mempool|メムプール]]向け | 鍵、オーダーが確定した後にリリース | 鍵のシェア、ローテーションまで |
| インクルーダー、[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]向け | 「[[glossary/Mempool|メムプール]]の主観的なビューに従った」リスト | スロット後には何もなし |

> 実情確認: [[glossary/relayer|リレイヤー]]やインクルーダーから[[glossary/exit|イグジット]]する必要はありません。なぜなら、もし1つが失敗してもユーザーは別のものを選ぶからです。しかし、これらの役割のうち2つはまだ誰にでも開かれているわけではありません。[[glossary/Privacy-Pool|プライバシープール]]のコントラクトは1つの役割からのみルートを受け入れ、MEV-Boost[[glossary/relayer|リレー]]は[[glossary/ePBS|ePBS (enshrined Proposer-Builder Separation)]][[glossary/EIP|EIP]]の言葉を借りれば「信頼されたパーティ」です。

### なぜ今なのか

効率性が主な障害でしたが、それは一歩ごとに小さくなっています。ネイティブ[[glossary/Account-Abstraction|アカウント抽象化]]は2020年（[[glossary/EIP|EIP]]-2938）から提案されていました。[[glossary/Frame-Transactions|フレームトランザクション]]は2026年1月に作成され、[[glossary/EIP|EIP]]-7701に代わりました。[[glossary/Keyed-Nonces|キー付きNonce (Keyed Nonces)]]は4月に続き、[[glossary/Frame-Transactions|フレームトランザクション]]は8月に[[glossary/Hegot|ヘゴタ (Hegotá)]]に組み込まれる予定でした。[[glossary/Strawmap|Strawmap]]では、両方が[[glossary/Hegot|ヘゴタ (Hegotá)]]に、[[glossary/EIP|EIP]]-8288の[[glossary/STARK-Aggregation|STARK集約]]がその後の[[glossary/fork|フォーク]]に配置されています。これらの[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]はハッシュベースであり、したがって[[glossary/Post-Quantum|ポスト量子 (PQ)]]であり、再帰によりノードは各証明を一度だけチェックし、ブロックはそれらすべてに対して1つの証明を運びます。

> [[glossary/Strawmap|Strawmap]]は[[glossary/Layer-1|L1]]をカバーしていますが、これらの変更に対してアプリケーションが何をすべきかについてはほとんど言及しておらず、L1.5はその1つの答えです。

### ネイティブ[[glossary/Rollup|ロールアップ]]、最初の非捕捉

[[glossary/Layer-2|L2]]は、ユーザーが預け入れと引き出しを行うコントラクト内の[[glossary/State-Preservation|状態]]にコミットします。これには、検証（[[glossary/fraud-proof|不正証明]]または[[glossary/validity-proof|有効性証明]]）と計算（[[glossary/zk|ZK]]、[[glossary/MPC|MPC (マルチパーティ計算)]]、[[glossary/Fully-Homomorphic-Encryption|完全準同型暗号 (FHE)]]または[[glossary/Trusted-Execution-Environment|トラステッド実行環境 (TEE)]]）という2つの独立したツールセットがあります。どのような組み合わせであっても、ユーザーの[[glossary/State-Preservation|状態]]は[[glossary/Layer-2|L2]]のコントラクトに留まるため、すべての[[glossary/Layer-2|L2]]には[[glossary/exit|イグジット]]が必要です。

[[glossary/Native-rollups|ネイティブロールアップ]]は2025年1月に同様のタイミング議論とともに提案されました。「ついにその時が来たかもしれない大きなアイデア」と。[[glossary/Native-rollups|ネイティブロールアップ]]は、[[glossary/Layer-1|L1]]自身の実行エンジンを介して、`EXECUTE`[[glossary/Predeploys|プリデプロイ]]によって[[glossary/State-transition-function|状態遷移]]を検証し、「同期的なコンポーザビリティを劇的に簡素化」します。この提案は現在[[glossary/EIP|EIP]]-8079であり、[[glossary/Strawmap|Strawmap]]のL*（2029年12月）の目玉です。

[[glossary/Native-rollups|ネイティブロールアップ]]は主に[[glossary/Layer-2|L2]]の断片化の解決策として見られていますが、私の意見ではそれ以上のことをします。[[glossary/Rollup|ロールアップ]]内の[[glossary/State-Preservation|状態]]は、その外部の[[glossary/State-Preservation|状態]]と構成可能であり、これは[[glossary/State-Preservation|状態]]の非捕捉に向けた第一歩です。[[glossary/Layer-1|L1]]に[[glossary/ERC|ERC]]-20を保持するユーザーは、1つの[[glossary/transaction|トランザクション]]で、[[glossary/Rollup|ロールアップ]]に保持されている中央指値注文板と取引できます。ネイティブ[[glossary/Account-Abstraction|アカウント抽象化]]はさらに一歩進んで、注文板自体が自身の決済[[glossary/transaction|トランザクション]]を送信し、その費用を支払うコントラクトとして[[glossary/Layer-1|L1]]上に存在できます。L1.5のマッチャーはマッチのバッチを証明し、どのノードもそれを注文板に[[glossary/relayer|リレー]]し、注文板は自身の`VERIFY`[[glossary/Frame-type|フレームタイプ]]で証明をチェックします。マッチャーが停止した場合、別のマッチャーが引き継ぎます。

### 次世代のイーサリアムアプリケーション

これにより、ウォレットがユーザーの[[glossary/State-Preservation|状態]]をクリアな形で保持し、[[glossary/Layer-1|L1]]が共有[[glossary/State-Preservation|状態]]と各ユーザーの[[glossary/State-Preservation|状態]]へのコミットメントを保持し、検証のみを行い、L1.5が計算と証明を行うという、新しい種類のアプリケーションが開かれます。

> 一部のアプリケーションは、[[glossary/Native-rollups|ネイティブロールアップ]]から始めて、段階的にこのモデルに移行するかもしれません。その後、L1.5部分はオンデマンドで構築される一時的なレイヤーとなることができます。それは[[glossary/Layer-1|L1]]とユーザーから必要なものを収集し、計算し、証明とともに結果を[[glossary/Layer-1|L1]]に投稿し、解散します。

以下に、興味深いと思われる3つの方向性を示します。私たちは大まかなスケッチしか作成していません（そして、一部はまだ提案段階のイーサリアムアップグレードに依存しています）。

**プライバシー保護アプリケーションにおける[[glossary/gas|ガス]]レス支払い**（例えば、[[glossary/stake|ETH]]以外の資産のための[[glossary/Stealth-Address-Protocol|ステルスアドレスプロトコル (SAP)]]）。ブラインド[[glossary/gas|ガス]]チケットは以前にも提案されていました。Vitalikは、各チケットが「チャウミアンブラインディングスキームを使用してエンコードされた」チケットのセットを事前に販売する[[glossary/Aggregator|アグリゲーター]]について説明し、Toniの[[glossary/Gas-station-network|ガスステーションネットワーク (GSN)]]では、チケットが償還されたときにコーディネーターが資金のないアドレスに資金を提供します。どちらの場合も、ユーザーは単一の発行者を信頼します。L1.5では、委員会が[[glossary/threshold-blind-signature|閾値ブラインド署名]]でチケットを発行するため、単一のメンバーだけではチケットに署名できず、誰も署名内容を見ることができません。そして、チケットはネイティブ[[glossary/Account-Abstraction|アカウント抽象化]]を介して[[glossary/Layer-1|L1]]で償還されます。ユーザーは任意のアカウントからチケットを購入し、後で新しいアカウントから1枚を使用します。アプリケーションの[[glossary/Paymaster|ペイマスター]]は、自身の`VERIFY`[[glossary/Frame-type|フレームタイプ]]でチケットをチェックします。発行者はチケットとその購入をリンクできないため、ユーザーは使用するアドレスに[[glossary/stake|ETH]]を必要とせず、そのアドレスにリンクされたアドレスから資金を供給する必要もありません。

**イーサリアムサービスのためのフェアエクスチェンジ。** ユーザーがブラインドチケットで[[glossary/PIR-query|PIRクエリ]]のためにプライベートRPCに支払うとします。サーバーはその回答が正しい場合にのみ支払いを受けるべきですが、通常の支払いではそれが強制されません。ユーザーはブロックヘッダーに対して回答をチェックできますが、チケットを受け取って決して回答しないサーバーは証拠を残しません（[[glossary/fisherman’s-dilemma|フィッシャーマンのジレンマ]]）。また、間違った回答に異議を唱えるユーザーはクエリを公開してしまいます。L1.5はこれを、[[glossary/Zero-Knowledge-Contingent-Payments|ゼロ知識条件付き支払い]]に似たフェアエクスチェンジに変えることができます。サーバーは暗号化された回答をユーザーに投稿し、それが最近のヘッダーの[[glossary/State-Root|ステートルート]]に対する暗号化されたクエリへの正しい回答であるという証明を添付します。チケットは、その証明が[[glossary/Paymaster|ペイマスター]]の`VERIFY`[[glossary/Frame-type|フレームタイプ]]で検証された場合にのみ支払われます。クエリはプライベートに保たれ、サーバーは正しい回答に対してのみ支払いを受けるため、異議を唱える必要はありません。PIRクエリは読み取る[[glossary/State-Preservation|状態]]を変更せず、検証と支払いのみが[[glossary/Layer-1|L1]]で決済されることに注意してください。

**ステルス[[glossary/Privacy-Pool|プライバシープール (privacy pool)]]。** [[glossary/Privacy-Pool|プライバシープール (privacy pool)]]は、既知のコントラクトへの預金がユーザーがプライバシーツールを使用したことを示すため、オンチェーンで可視です。L1.5がプールをステルス化し、ユーザーが認識可能なプールコントラクトに触れることがないようにできるかどうかを調べたいと考えています。L1.5ラウンドは、多くのユーザーの[[glossary/stake|ETH]]を新しいステルスアドレスに[[glossary/shuffle|シャッフル]]し、各レッグは通常の転送です。チェーンにはプールコントラクト、預金、引き出しは表示されず、新しいアドレス間の支払いのみが表示され、それぞれが支払い、スワップ、またはシャッフルの一部である可能性があります。コンプライアンスは、必要であれば引き続き提供できます。その場合、[[glossary/Association-Set-Provider|アソシエーションセットプロバイダー (ASP)]]が各参加者が持ち込む資金を保証し、その証明をコントラクトではなくラウンドに提供します。このようなラウンドが全体としてどのようなプライバシーを提供し、入力適格性証明がどのようにそれに引き継がれるかは、今後の課題とします。

### プロトコルは大規模なL1.5であり、その影響

過去と未来を振り返ると、イーサリアム自身のプロトコルは、はるかに大規模な、短命な役割を長命な共有[[glossary/State-Preservation|状態]]上で既に実行しています。

-   **実行:** すべてのノードが再実行することで、どのノードも他を信頼する必要がありません。[[glossary/zkEVM|zkEVM]]証明（[[glossary/Strawmap|Strawmap]]の「ギガ[[glossary/gas|ガス]]L1」）により、1つのパーティが計算し、全員が検証します。
-   **[[glossary/Consensus-Layer|コンセンサス層]]:** [[glossary/Validator-Whitelist|バリデータセット]]はエポックごとに新しい委員会に[[glossary/random-churn|シャッフル]]されます。各委員会は、その背後にある[[glossary/stake|ステーク]]が維持される間、1つのエポック存続し、委員会は署名によってチェックされます。
-   **[[glossary/Data-Availability|データアベイラビリティ]]:** ノードはデータを供給する作業を共有し、[[glossary/Data-Availability|サンプリング]]によってそれをチェックします。
-   **[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]と[[glossary/LUCID|LUCID (EIP-8184)]]** は、プロトコルに組み込まれたL1.5の役割のように機能します。各スロットに16のインクルーダーがおり、そのリストはブロックが尊重しなければならず、鍵発行者はそのタイムリーな鍵リリースをネットワークがチェックします。

**ここには2つの作業ラインがあります。** 1つは、チケット、シャッフル、フェアエクスチェンジ、証明委員会、集約などの新しい機能をL1.5として構築することです。もう1つは、実行、[[glossary/Consensus-Layer|コンセンサス層]]、[[glossary/Data-Availability|データアベイラビリティ]]レイヤーが既に行っていることを*再利用*することです。事前に固定されたシードから委員会を抽選し（[[glossary/fluid-MPC|流動的MPC]]やYOSOとして研究されています）、各メンバーの行動を公開し署名させ、失敗時に焼却されるボンドを投稿し、[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]が[[glossary/transaction|トランザクション]]に対して行うようにL1.5の出力を強制的に含め、公開すべきものを公開し[[glossary/Data-Availability|サンプリング]]します。

> この時点で、[[glossary/Mempool|メムプール]]もL1.5クラスに入れることができるかもしれません。

### 「[[glossary/Layer-2|L2]]」から「ウォレット + L1.5」へ

> そして、ネイティブ[[glossary/Account-Abstraction|アカウント抽象化]][[glossary/EIP|EIP]]がより成熟すれば、カノニカルバージョンを新しい標準にすることさえできるかもしれません。

一部の[[glossary/Layer-2|L2]]アプリケーションは、このモデルに段階的に移行できます。

1.  **所有[[glossary/State-Preservation|状態]]をウォレットに移動する。** [[glossary/Privacy-Pool|プライバシープール]]が既に行っているように、コミットメントと[[glossary/nullifier|ナリファイア]]のみを[[glossary/Layer-1|L1]]に保持し、ウォレットにオープニングを保持させます。
2.  **コントラクトが自身の[[glossary/transaction|トランザクション]]を送信できるようにする。** コントラクトの`VERIFY`[[glossary/Frame-type|フレームタイプ]]で証明をチェックし、移動する資金から手数料を支払い、[[glossary/nullifier|ナリファイア]]を[[glossary/Keyed-Nonces|Nonceキー]]として使用します。[[glossary/sequencer|シーケンサー]]や[[glossary/relayer|リレイヤー]]は不要です。
3.  **証明と提出をオープンなジョブにする。** ユーザーのデバイスで証明でき、より強力なノードが公開ステートメント（レゴのように構成されたもの）で支援でき、どのノードも[[glossary/relayer|リレー]]できます。

[[glossary/State-Preservation|状態]]をウォレットに移動することは、責任もウォレットに移動させることになります。

-   **1つのリカバリ可能なシード。** すべての秘密鍵を1つのシードから派生させます。ユーザーが保持するフレーズと、ユーザーがキャンセルできる遅延を伴う[[glossary/guardian-model|ガーディアン]]を通じてリカバリ可能にします。
-   **デバイス上で証明する。** 委員会が支援する必要がある場合、秘密のシェア（co-SNARK）を与え、完全な証人は決して与えません。証明はレゴのように構成し、[[glossary/proof-aggregation|集約]]することもできます。
-   **盲目的に支払う**（スケッチ）。1つの[[glossary/Account-Abstraction|アカウント]]からチケットを購入し、新しい[[glossary/Account-Abstraction|アカウント]]からそれを使用します。既知の[[glossary/Account-Abstraction|アカウント]]から新しいアドレスに資金を供給したり、新しいアドレスを1つに[[glossary/Sweep|スウィープ]]したりしないでください。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/ephemeral-rollup-the-new-l1-5-of-ethereum/26187)
