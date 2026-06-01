---
title: EIP-8250 キー付きナンスを改善するためのEVVMでの非同期ナンス経験
original_title: Async Nonces on EVVM experience to improve EIP-8250 Keyed Nonces
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642
author: ariutokintumi
date: '2026-05-27'
category: EIPs
tags:
  - eips
  - eip
  - account-abstraction
  - smart-contracts
  - evm
  - state-management
  - research
  - protocol-design
  - async-nonces
  - keyed-nonces
topic_id: '28642'
translated_at: '2026-05-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Async Nonces on EVVM experience to improve EIP-8250 Keyed Nonces](https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642) — ariutokintumi (2026-05-27)

こんにちは。背景を説明すると、この投稿は、より良い実装のために[[glossary/EIP|EIP]]-8250のコンテンツとアーキテクチャについて協力する意図をまとめたものです。

1.  ご存知の通り、[@soispoke](https://ethereum-magicians.org/u/soispoke)、[@nerolation](https://ethereum-magicians.org/u/nerolation)、lightclient、そして[@vbuterin](https://ethereum-magicians.org/u/vbuterin)が[[glossary/EIP|EIP]]-8250をまとめました。
2.  私は5月6日に以下の一般的な情報で返信しましたが、私のコメントは無視され、驚くべきことに、5月11日（[[glossary/EIP|EIP]]-8250のマージが、それに対処することなく要求された翌日）に「コミュニティメンバーからのリクエスト」以外の証拠なしに削除されました。このことは、すぐに[Xでここで](https://x.com/ariutokintumi/status/2054062281839747578?s=20)証明しました。

![EIP-8250: キー付きナンスとフレームトランザクション](https://ethereum-magicians.org/user_avatar/ethereum-magicians.org/soispoke/48/13615_2.png)

[EIP-8250: フレームトランザクションのためのキー付きナンス](https://ethereum-magicians.org/t/eip-8250-keyed-nonces-for-frame-transactions/28437) [[glossary/EIP|EIP]]s core](https://ethereum-magicians.org/c/eips/eips-core/35)

> [EIP-8250: Keyed Nonces for Frame Transactions · Pull Request #11598 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/11598) の議論トピック。概要: [[glossary/EIP|EIP]]-8141 フレームトランザクション (frame transaction) の単一送信者ナンスを `(nonce_key, nonce_seq)` ペアに置き換えます。`nonce_key == 0` はレガシーアカウントナンスのエイリアスです。各非ゼロキーは、`NONCE_MANAGER` システムコントラクトに保存されている独立したプロトコル管理のナンスシーケンスを選択します。異なる非ゼロキー上のトランザクションはリプレイ独立 (replay-independent) です。動機: フレームトランザクションは現在...

これらのコメントと返信における「タイミングの遅れ」の問題に対処するためにこの背景を考慮し、本投稿の主な目的へと進みましょう。

プライバシープロトコルを共有送信者とするボトルネックは現実の問題であり、リプレイ保護 (replay protection) を単一の線形シーケンス (linear sequence) から切り離すことは、正しい修正の形です。

補完的な方向からの注記: 私たちは2023年からこの設計空間でコントラクトレベルの実装を運用しており、現在は**EVVM**内で動作しています。そのデプロイ経験から、[[glossary/EIP|EIP]]-8250が進展する上で役立つ可能性のあるいくつかの点が浮上しました。

### **簡単な背景**

EVVMは、スマートコントラクトネイティブな仮想ブロックチェーンフレームワーク (smart-contract-native virtual blockchain framework) です。EVVMインスタンス内では、すべてのトランザクションは単一のコアエントリーポイント (Core entry point) `validateAndConsumeNonce` を通じて検証され、署名、ナンス、および実行者権限をアトミックに (atomically) チェックします。ナンスモデルはデュアルです。

-   **同期ナンス (Sync nonce)**: 順次順序付けのためのアカウントごとの線形カウンター。
    
-   **非同期ナンス (Async nonce)**: マッピング内のアカウントごとの `(account, nonce_value)` スロットで、使用時に消費済みとマークされます。ユーザーが値を決定します。異なる非同期ナンスは、あなたの仕様が非ゼロ `nonce_key` キーについて記述しているのとまったく同じ意味で、リプレイ独立 (replay-independent) です。
    

これは、`nonce_seq` がキーごとに単一のビット（使用済み/未使用）に集約されたあなたの `(nonce_key, nonce_seq)` モデルにマッピングされます。これまでに本番環境で見てきたユースケース（オーダーブック (order books)、サブスクリプション (subscriptions)、定期支払い (recurring payments)、ユーザーごとの複数の並列インテント (parallel intents)、共有送信者プライバシーパターン (shared-sender privacy patterns)）では、1ビットで十分でした。よりコンパクトなストレージレイアウト（消費されたシーケンスを `[start, end]` 範囲ペアとしてエンコードするのが注目すべきもの）が存在することは認識しており、ステート成長 (state growth) が理論的なボトルネックではなく実際のボトルネックになった場合の最適化パス上にあります。

### **実装リファレンス**

-   リポジトリ: [https://github.com/EVVM-org/testnet-Contracts](https://github.com/EVVM-org/testnet-Contracts) (v3.1.2 “Kitsuragi”)
    
-   ドキュメント (`validateAndConsumeNonce`、非同期ナンス、予約): [https://www.evvm.info/docs/intro](https://www.evvm.info/docs/intro)
    
-   ライブテスト用の署名コンストラクタ: [https://www.evvm.dev](https://www.evvm.dev/)
    
-   2026年には、Base、Arbitrum、Optimism、Mantle、Polygon、Zircuitなど10以上のチェーンに、コミュニティハッカーによって200以上のEVVMインスタンスがデプロイされ、非同期ナンスがデフォルトのUXパスとして使用されています。
    

### **本番環境から注目すべき2つの設計点**

**1. 意図的な選択としての非権威的な予約 (non-authoritative reservation)。**

EVVMは、キー付きナンスの上に1つの予約プリミティブのみを出荷しています。それは**非権威的**なものです。

いかなるアクター（ユーザー、アプリ、ミドルウェア）も、ガス代を支払って「ナンスXを使用するつもりである」ことをオンチェーンで公開できます。レジストリは、他の誰も同じナンスを使用することを**ブロックしません**。単に意図を可視化し、インデックス可能にするだけです。私たちは意図的に権威的なロック (authoritative locks) を出荷しませんでした。なぜなら、権威的なロックはそれ自身の障害モードを導入するからです。DoSベクトル (DoS vector) としてのロック奪取 (lock-grabbing)、キーを人質に取るUIの不良によるロックアップ (bad-UI lockups)、そして同じ異種RNGの懸念 (heterogeneous-RNG concern) が、解決されることなく別のプリミティブにシフトするだけです。助言レイヤー (advisory layer) は、サービス拒否の新たな方法を追加することなく、情報を追加します。

これが、特に[[glossary/EIP|EIP]]-8250にとって注目すべき点です。仕様は、アプリケーションが「使用ごとの識別子から `nonce_key` を導出する場合、入力のドメイン分離 (domain-separate) を行い、0に等しい導出キーを拒否すべきである」と正しく述べています。しかし、どのキーが*使用される意図があるか*についてのプロトコルレベルの可視性はなく、すでに使用されたものだけが可視です。2つの独立したウォレットが異なる目的で同じ `nonce_key` を生成するエッジケース（`2**256` の空間は強力なRNGでは宇宙的にありえないほど低い確率ですが、現実世界のUIコードは常に強力なRNGではありません）では、助言レジストリ (advisory registry) が消費前に衝突を表面化させます。安価なシグナルであり、自発的で、ガス代がかかりますが、`2**64` の `nonce_seq` 空間は、衝突が検出された場合に新しい派生で再発行する余地を残します。

これが[[glossary/EIP|EIP]]-8250自体に属するのか、それとも付随するインフラに属するのかは別の問題です。下流のウォレットとミドルウェア (downstream wallets and middleware) は、キー付きナンスの状態がどこに存在するかに関わらず、異種RNGの質問に直面するため、少なくとも根拠 (Rationale) またはセキュリティ上の考慮事項 (Security Considerations) で予測しておく価値があります。

**2. キー付きナンスと `tx.origin` および `msg.sender` チェックを同じ検証ステップでペアリングする。**

この[[glossary/EIP|EIP]]はリプレイドメイン分離 (replay-domain separation) を解決しますが、「誰がこのトランザクションを送信またはリレーする権限があるか」という問題には対処しません。署名 + ナンス + (origin, sender) 実行者許可を1つのアトミックな呼び出しで検証することにより、2つのプリミティブが実際に役立ちます。

-   **`tx.origin`** は、検証ステップで、*どのEOA*が特定のキー付きトランザクションを確定させることを許可されているかを制限できます。リレー市場 (relay markets) やフィッシャー型ネットワーク (Fisher-style networks) の場合、これは「どの送信者でもこの署名済みペイロード (signed payload) を抽出して競合する経路を通じてリプレイできる」と「発信者の意図するリレーヤー (originator’s intended relayer) のみが尊重される」の違いです。検証がこのヒントと連携すれば、多くのインフラレベルの実装が開かれます。
    
-   **`msg.sender`** は、コントラクトがユーザー署名済みトランザクションをオンチェーンでキューに入れ、保存し、条件付きでトリガーすることを可能にします。リレーヤーを信頼するためにステーキングまたはトークン許可システム (staking or token-permission systems) を必要としません。信頼は、経済的セキュリティではなく、監査可能なコントラクトコード (auditable contract code) から生まれます。具体的なパターン: 条件（タイムロック、オラクル出力、マルチシグ投票）が満たされるまで署名済みユーザートランザクションを保持し、その後それらを実行する `msg.sender` となるストレージコントラクト。コードレベルの信頼が、インテントベースおよびタイムロックフロー (intent-based and time-locked flows) の重要なクラスにおいて、スラッシングエコノミクス (slashing economics) に取って代わります。
    

### **プロトコルレベルでの必要性について**

[[glossary/EIP|EIP]]に反対するわけではなく、議論にデータポイントを提供するためですが、[[glossary/EIP|EIP]]-8250がアプリケーション層で解放するものの多くは、フォーク (fork) なしで、今日のコントラクトレベルで既にアクセス可能です。マッピング内の非同期ナンスは、私たちにとって本番環境で実際のプライバシー、共有送信者、および並列インテントフローに役立ってきました。`KEYED_NONCE_FIRST_USE_GAS = 20000` の動機となっているステート成長税 (state-growth tax) は現実のものですが、コントラクトレベルの実装では、モデルをプロトコルに引き上げることを正当化するような上限にはまだ達していません。この表面でのスマートコントラクトのイテレーション速度は、ユースケースが成熟する中で意味のある利点となっています。

私たちが内部で使っているフレーミングは次のとおりです。**EVVMは、EVMを垂直的にスケールするための高速イテレーションパスです**。仮想ブロックチェーンが数日で出荷できる変更は、実際のユーザーが数週間で利用し、[[glossary/EIP|EIP]]プロセスは独自のペースで吸収できます。同じプリミティブがクライアント層とプロトコル層にも着地すると（[[glossary/EIP|EIP]]-8250が提案するように）、その影響は、特にキー対応メンプールがアンロックとなる共有送信者およびプライバシーのコンテキストで、その上で仮想ブロックチェーンを実行するすべての人にとって複合的になります。2つのレイヤーは競合していません。コントラクトレイヤーは、プリミティブが実際の負荷の下でテストされる場所であり、プロトコルレイヤーは、それらが無料になり、メンプールアドレス可能になり、すべての人にとって共有インフラになる場所です。

[[glossary/EIP|EIP]]-8250が、コントラクトアプローチでは真に再現できないものを*解放する*のは、プロトコルレベルのメンプールアドレス可能性 (protocol-level mempool addressability) のキー付きナンスです。これは、送信者ごとの同時トランザクション (concurrent transactions) を許容する将来のキー対応メンプールポリシーを可能にするものです。それがこれをL1 (Layer 1) にプッシュする本当の理由であり、共有送信者向けのメンプールレベルの同時実行性が戦略的目標であるならば、その労力に見合う価値があります。リプレイドメイン分離 (replay-domain separation) だけであれば、コントラクトレベルのキー付きナンスストアでほとんどの目的を達成でき、設計を自由にイテレーションできます。

### **設計リスク (design risk)**

最後に、EVVMで常に発生している非常に大きな結果があります。それは、非同期ナンスが利用可能になったことで、利便性のために、すべての開発者が同期ナンス（現在のEVMの通常のナンス）の使用をやめ、これらの標準ナンスが陳腐化 (obsolescence) に向かっていることです。

### **招待**

議論に役立つようでしたら、EVVMインスタンスは1つのCLIコマンド (CLI command) でSepoliaまたは任意のL2にデプロイ可能です（Dockerイメージ (Docker image) は `ghcr.io/evvm-org/evvm-docker` にあります）。プライバシー型または共有送信者フローをそれに対して記述し、本番トラフィックでキー付きナンスの表面を負荷テストする (stress the keyed-nonce surface) ことができ、そのデータを使って[[glossary/EIP|EIP]]に情報を提供できます。喜んでそのいずれについても説明いたします。

目的は比較することではありません。目的は、同じ設計空間に実行中のコードとライブデプロイデータがあり、そこから学ぶことで仕様を厳密にしたり、エッジケース (edge cases) を早期に表面化させたりできるかもしれないということです。

クイックスタート: [https://www.evvm.info/docs/QuickStart](https://www.evvm.info/docs/QuickStart)

この作業に改めて感謝いたします。

敬具、
German Abal ([@ariutokintumi](https://ethereum-magicians.org/u/ariutokintumi))
[EVVM.org](http://EVVM.org)、[ETH Cinco de Mayo](https://ethcdm.com)、[IAldea.org](http://IAldea.org) の共同創設者
ECH Institute [[glossary/EIP|EIP]] Summit 2025 講演者 ([講演](https://www.youtube.com/watch?v=WcGYlzUChUE))。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642)
