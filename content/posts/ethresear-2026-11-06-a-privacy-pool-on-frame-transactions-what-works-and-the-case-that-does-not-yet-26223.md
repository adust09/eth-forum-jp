---
title: 'フレームトランザクション上のプライバシープール: 機能するものと、まだ機能しないもの'
original_title: >-
  A privacy pool on frame transactions: what works, and the case that does not
  yet
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/a-privacy-pool-on-frame-transactions-what-works-and-the-case-that-does-not-yet/26223
author: AnkushinDaniil
date: '2026-11-06'
category: Privacy
tags:
  - privacy
  - account-abstraction
  - eip
  - snarks
  - gas
  - mempool
  - protocol-design
topic_id: '26223'
translated_at: '2026-11-08'
translator: gemini-2.5-flash
---

> [!note] 原文
> [A privacy pool on frame transactions: what works, and the case that does not yet](https://ethresear.ch/t/a-privacy-pool-on-frame-transactions-what-works-and-the-case-that-does-not-yet/26223) — AnkushinDaniil (2026-11-06)

*Daniil Ankushin、Nethermind。検証予算の数値: Daniil Ankushinによる手法、Manuel Artoによるベンチマークと測定。*

[[glossary/Frame-Transactions|フレームトランザクション]]では、シールドプールが自身のガスを支払うため、プライベートな引き出しにリレイヤーは不要です。私たちは現在のNethermindマスター上で、この方法で実際の[[glossary/BN254|BN254]] [[glossary/Groth16-proof|Groth16]]プールを実行しました。引き出しには679,322ガスかかります。[[glossary/Keyed-Nonces|EIP-8250キー付きNonce]]を使用すると、1つのプールアドレスから多くの引き出しを同時に行うことができます。まだ機能しない点が2つあります。証明チェックが検証ガスの仕様上限を超えていること、そしてプールがユーザー自身のウォレットアドレスからの呼び出しに対してガスを支払うことができないことです。

私たちが実行したプールは、soispokeのminimal-shielded-poolです（[GitHub - soispoke/minimal-shielded-pool · GitHub](https://github.com/soispoke/minimal-shielded-pool)）。

## 引き出しの仕組み

引き出しでは、プールが送信者となります。そのVERIFYコードがZK証明をチェックし、実行と支払いを承認します。ユーザーは資金のあるアカウントを必要とせず、トランザクションに現れることもありません。

2つの[[glossary/Draft|ドラフト]]により、これはパブリック[[glossary/Mempool|メムプール]]で安全になります。[[glossary/Keyed-Nonces|EIP-8250]]では、プールはノートの[[glossary/nullifier|ナリファイア]]をノンスキーとして使用します。各引き出しには独自のノンスキーがあるため、プールを送信者とする引き出しが1つのノンスを競合することはありません。副次的な効果として、既に使用されたナリファイアは使用済みノンスキーとなるため、プールのコードが実行される前にプロトコルが二重支払いを拒否します。[[glossary/EIP-8272|EIP-8272]]では、トランザクションはプールのコードが実行される前に、プールのMerkleルートを最近のルートのコントラクトと照合してチェックするため、メムプールノードがプールのストレージを読み取ることはありません。

![プールを送信者とする引き出しフロー](https://ethresear.ch/uploads/default/optimized/3X/7/d/7dab7d3493d78fffc199a0541ea712880a29e6ea_2_690x296.png)

## コスト

すべての値は、Nethermind master 4bcb9e30の単一ノードでマイニングされたレシートからのものです。

| ステップ | ガス |
| --- | --- |
| ノートのデポジット、フレームトランザクション | 990,503 |
| うちステートガス | 195,840 |
| ノートのデポジット、通常のEIP-1559コール | 958,555 |
| 引き出し、トランザクション全体 | 679,322 |
| 最近のルートVERIFYフレーム | 5,515 |
| プールVERIFYフレーム（証明チェックと承認） | 405,979 |
| うち実行 | 210,139 |
| うち2つのナリファイアキーのステートガス | 195,840 |
| SENDERフレームの決済 | 25,526 |
| クレームフレーム | 198,338 |
| フレーム外（固有、コールデータ、キーアクセス） | 43,964 |
| 裸のGroth16チェック、それ自体のトランザクションとして、21,000ベースを含む | 222,991 |
| 転送、2つのノートの入出金、トランザクション全体 | 1,333,766 |
| うちステートガス | 293,760 |

2つのナリファイアキーは195,840ステートガスかかり、これは[[glossary/Keyed-Nonces|EIP-8250]]の価格のちょうど2倍です。「各新規キーは`97920`ステートガスを要する」とあります。[[glossary/Keyed-Nonces|EIP-8250]]はまた、キーあたり12,100実行ガスを課し、同じ量をコールデータフロアに追加します。

この証明は共有予算に収まりません。検証プレフィックスは233,000実行ガスを宣言し、215,654を使用しており、[[glossary/EIP-8141|EIP-8141]]の上限`MAX_VERIFY_GAS`を超えています。未解決の変更（[Update EIP-8141: define MAX\_VERIFY\_GAS as a shared mempool floor by AnkushinDaniil · Pull Request #12301 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12301)）では、この上限を共有メムプールフロアとし、各ノードはそれ以上自由に実行できるようにし、その値を測定に基づいて設定することになります。Nethermindのデフォルトノード予算はすでに300,000（[fix(txpool): separate verification floor from node headroom by SIDDHANTCOOKIE · Pull Request #14992 · NethermindEth/nethermind · GitHub](https://github.com/NethermindEth/nethermind/pull/14992)）なので、デフォルトノードは私たちの引き出しを受け入れましたが、フロアに設定されたノードは受け入れません。公開された測定ノート（[Sizing MAX\_VERIFY\_GAS: how much unpaid work a node can absorb - HackMD](https://hackmd.io/@0Eo_JbIrQIKnf-o35CQ9EQ/H12MW5GsMg)）では、AMD EPYC 4344PとGCE c2-standard-8（2台のローカル[[glossary/Block-Building|ビルダー]]マシン）でNethermind d804d33bを測定しました。そこでは、300,000の予算で、[[glossary/Block-Building|ブロック構築]]が25ミリ秒遅くなる場合、Nethermind上で1秒あたり100件の失敗トランザクションを生成する攻撃者ピアを1つ維持し、50ミリ秒遅くなる場合は117件を維持しました。私たちは同じスイートを現在のNethermindマスター（1f6469e64ee）で、1つの共有12vCPU AMD EPYC 9645ホスト上で再実行しました。そこでは、250,000の予算で、25ミリ秒で攻撃者ピアを1つ余裕なく維持します（1秒あたり100件の失敗トランザクションに対し、1つのピアが処理できるのは約100件）。300,000の予算では25ミリ秒で83件を維持するため、50ミリ秒でしか1つのピアを維持できません（117件）。ピアあたり約100件という数値はNethermindのフラッドコントローラーによるもので、他のクライアントはピアの上限を低く設定しています。両方の比較はマシンをまたいでいるため、これらの実行では変更がコードによるものかマシンによるものかを判断できません。私たちの233,000は両方の条件下で収まります。プールがすべてのノードで機能するためには、測定によってフロアが上昇するか、または[[glossary/proof-aggregation|証明集約]]などを通じて証明チェックがノードごとの予算から外れる必要があります。

新しいストレージがコストの大部分を占めます。引き出しでは、679,322ガスのうち379,440ガスがステートガスです。これは2つのナリファイアキーに195,840ガス、クレームフレームに183,600ガスです。

## 二重支払い

同じナリファイアキーと新しいボディで2回目の引き出しを送信しました。ノードは受け入れ時に「keyed nonce sequence not current」として拒否しました。[[glossary/Block-Building|ビルダー]]を介してブロックに強制的に含めようとしたところ、ブロックにはトランザクションが1つも含まれませんでした。最初の引き出しの後、ノンスマネージャーのナリファイアスロットは両方とも1を読み取っていました。

## 未解決の課題: 支払いのみを行うプール

上記では、呼び出しはプールから行われます。多くの場合、ユーザーは自分のウォレットアドレスから行動したいが、プールがノートからガスを支払うことを望みます。

ここでは[[glossary/Keyed-Nonces|EIP-8250]]は役に立ちません。各キーを`(sender, key)`の下に保存します。ユーザーを送信者とすると、2つのウォレットアドレスから送信された同じナリファイアは2つの異なるキーとなり、プールはプロトコルから「一度使用済み」のマークを受け取りません。

プールは代わりに自身のストレージを使用することもできません。[[glossary/EIP-8141|EIP-8141]]のパブリックメムプールルールでは、「`SLOAD`は`tx.sender`ストレージにのみアクセスできる」とあり、ここではプールは送信者ではありません。同じルールでは、非カノニカルペイマスターごとに`MAX_PENDING_TXS_USING_NON_CANONICAL_PAYMASTER = 1`のペンディングトランザクションが許可されるため、支払いのみを行うプールは、各ノードで一度に1人のユーザーにしかサービスを提供できません。jstinhwは[[glossary/MATCHA|MATCHA]]スレッド（[Mempool Account Transaction Capacity from Historical Activity (MATCHA)](https://ethresear.ch/t/25949)）でこのケースを提起しました。100人の送信者から100件のトランザクションがあり、それぞれが同じノートに対して有効な証明を持っている場合です。mmjahanaraも同じスレッドで同じ結論に達しています。

![2人の送信者、1つのナリファイア](https://ethresear.ch/uploads/default/optimized/3X/a/a/aa740248cc9818d2f158ff0aa1e64c3a78790a8a_2_690x250.png)

私たちはこれに対し、トランザクションがそのキーを支払いを承認するアカウントの下に配置できるようにする仕様変更を提案しました（[Update EIP-8250: let a transaction scope its nonce keys to the payer by AnkushinDaniil · Pull Request #12422 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/12422)）。[[glossary/Keyed-Nonces|EIP-8250]]の著者であるnerolationは次のように回答しました。

> そのアプリレベルのナリファイア追跡を改善するために、新しいフィールドを追加し、すべてのトランザクションノンスがtx.senderに属するという不変条件を弱める価値があるのか疑問に思っています。私の感覚では、その価値はなく、tx.sender != payerの場合、ペイマスターのために2次元ノンスは必要ないかもしれません。

私たちはそのプルリクエストをクローズしました。不変条件は、1つのトランザクションを節約するよりも価値があります。

また、変更されていないプールでこの形式をマスター上で試しました。ユーザーのアカウントが実行を承認し、プールのVERIFYフレームが支払いを承認する形です。ノードは受け入れ時に「frame transaction validation-prefix simulation failed, validation prefix frame reverted」として拒否しました。プールのVERIFYコードはプールが送信者であると仮定しているため、この拒否は仕様について何も語っていません。

したがって、現在パブリックメムプールで機能する形式は2つあります。上記で測定されたようにプールが送信者である場合、またはユーザーが引き出し先のアドレスに引き出し、そのアドレスが自身で支払うという2つのトランザクションの場合です。3番目の形式は未解決のままです。つまり、プールがユーザー自身のウォレットアドレスからの呼び出しに対して、1つのトランザクションでパブリックメムプールを介して支払う形式です。現在の[[glossary/Draft|ドラフト]]では方法が見当たらず、そのガス数値もありません。

## 再現方法

Nethermind master 4bcb9e30986a86061fc8b7efe33abeeaa31f745a、1つのノード、[[glossary/EIP-8141|EIP-8141]]、[[glossary/Keyed-Nonces|EIP-8250]]、[[glossary/EIP-8272|EIP-8272]]、および[[glossary/EIP-7906|EIP-7906]]がブロック1からアクティブ。Genesisには[[glossary/EIP-8272|EIP-8272]]の最近のルートコードと[[glossary/Keyed-Nonces|EIP-8250]]のノンスマネージャーコードが含まれています。プールは[GitHub - soispoke/minimal-shielded-pool · GitHub](https://github.com/soispoke/minimal-shielded-pool)のbb45b3b9で、最近のルートコントラクトアドレスと手数料パラメータインデックスが現在の仕様に更新されています。証明はリポジトリ独自のツールから生成されます。

3件の投稿 - 2人の参加者

[トピック全体を読む](https://ethresear.ch/t/a-privacy-pool-on-frame-transactions-what-works-and-the-case-that-does-not-yet/26223)
