---
title: EIP-7732に基づく複数ブロックの実行バッチ
original_title: Execution batches of multiple blocks under EIP-7732
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/execution-batches-of-multiple-blocks-under-eip-7732/29981
author: this
date: '2026-10-15'
category: EIPs
tags:
  - eips
  - eip
  - execution-layer
  - scaling
  - pbs
  - finality
  - gas
  - mempool
  - validators
topic_id: '29981'
translated_at: '2026-10-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Execution batches of multiple blocks under EIP-7732](https://ethereum-magicians.org/t/execution-batches-of-multiple-blocks-under-eip-7732/29981) — this (2026-10-15)

\-–

eip: draft

title: EIP-7732に基づく複数ブロックの実行バッチ

description: EIP-7732に従う。1スロットあたり1回のリビール。ペイロードはブロックのバッチ。各ブロックは今日のブロックガス制限に等しい独自のガス制限を持ち、N個のブロックのバッチはN倍のガスを運ぶ。バッチのハッシュは次のバッチの親ハッシュとなる。

author: Grok4.7

status: Draft

type: Standards Track

category: Core

created: 2026-10-15

requires: 7732

\-–

# 実行バッチ: 1つの[[glossary/EIP-7732|EIP-7732]]ペイロードはブロックのバッチ

中国語ドラフト: \[EIP-draft-账号名单一轮多块.md\](EIP-draft-账号名单一輪多塊.md) (同じディレクトリ内)。

## 概要

この提案は[[glossary/EIP-7732|EIP-7732]] ( [EIP-7732: Enshrined Proposer-Builder Separation](https://eips.ethereum.org/EIPS/eip-7732) ) に従います。ブロックの生成、入札、リビール (reveal)、投票の新しい方法を定義するものではありません。ランダムに選択される主体は依然として[[glossary/beacon-block-proposer|ビーコンブロックプロポーザー]]です。[[glossary/staked-builder|ステークされたビルダー]]は依然として[[glossary/execution-payload|実行ペイロード]]にコミットし、後でそれをリビールします。[[glossary/Payload-Timeliness-Committee|ペイロード適時性委員会]]は、ペイロードが時間通りにリビールされたこと、コミットされたハッシュが一致すること、および[[glossary/blob|ブロブ]]データが利用可能であることをのみチェックします。実行検証は、次のビーコンブロックが処理されるまで延期されます。

1つの[[glossary/execution-payload|実行ペイロード]]は1つのバッチです。バッチは実行ブロックのセットです。そのセットのハッシュは`batchHash`です。[[glossary/EIP-7732|EIP-7732]]の`[[glossary/ExecutionPayloadBid|ExecutionPayloadBid]].block_hash`はこの`batchHash`に設定されます。次のバッチ内のすべての実行ブロックの親ハッシュ (parent hash) は、前のバッチの`batchHash`であり、[[glossary/EIP-7732|EIP-7732]]の既存の`[[glossary/parent_block_hash|parent_block_hash]]`フィールドおよび各ブロックヘッダーの`[[glossary/parentHash|parentHash]]`に書き込まれます。

バッチ内のブロックは、クライアントが提出するアカウントリストによってパーティション化され、スケジューラー (scheduler) がそれらを仮想マシン (virtual-machine) インスタンスに割り当てます。各実行ブロックは独自のガス制限を持ち、これは今日の1ブロックあたりのガス制限に等しいです。N個のブロックのバッチは、そのスロット (slot) で今日のN倍のガスを運びます。[[glossary/full-nodes|フルノード]]はバッチ全体を保存し、商用オペレーターによってサーバー上で実行されます。[[glossary/EIP-7732|EIP-7732]]で指定された遅延検証中に、[[glossary/verification-node|検証ノード]]は1つのブロックのみをリプレイします。トランザクションボディはトランザクションプール (transaction pool) からIDでフェッチされるため、[[glossary/Ethereum-validator|バリデータ]]の帯域幅と作業はNの増加とともに増大しません。ブロックはチェックが通過すると有効になります。次の`[[glossary/FINALITY_DEPTH|FINALITY_DEPTH]]`個のバッチがそれぞれこのバッチの`batchHash`を親として使用し、それを検証した[[glossary/stake|ステーク]]が閾値（例: 1024 ETH）に達すると、最終的 (final) になります。

## 動機

[[glossary/EIP-7732|EIP-7732]]はすでに[[glossary/consensus-validation|コンセンサス検証]]と[[glossary/execution-validation|実行検証]]を分離しています。投票前に、[[glossary/beacon-block-proposer|プロポーザー]]はビーコンブロックのみを処理します。ビルダーはリビールウィンドウ (reveal window) 内に[[glossary/execution-payload|実行ペイロード]]を配信します。次の[[glossary/beacon-block-proposer|プロポーザー]]は約6秒、他の[[glossary/Ethereum-validator|バリデータ]]は約9秒の実行検証時間があります。この提案は、1つのペイロードを並行して実行できる実行ブロックのバッチとして記述し、そのウィンドウをマルチインスタンス実行とシングルブロック検証に使用します。

今日、1つのペイロード内のトランザクションは、シングルスレッドの[[glossary/State-transition|状態遷移]]によって適用されます。アカウントで競合しないトランザクションも同じキュー (queue) に並びます。アカウントリストはそれらを同じバッチの異なるブロックに配置し、スケジューラー (scheduler) はそれらのブロックを異なる[[glossary/EVM|仮想マシン]]インスタンスに送信します。

リビールレート (reveal rate) は変更されません。12秒ごとに1つのバッチです。この間隔は世界規模の投票の往復時間です。これを短縮すると、[[glossary/Ethereum-validator|バリデータ]]はより重いマシンに移行せざるを得なくなります。ガスはブロックごとに加算されます。各実行ブロックは今日の1ブロックあたりのガス制限を受け取り、[[glossary/Ethereum-validator|バリデータ]]は自身のブロックのみをチェックします。N個のブロックのバッチは、そのスロット (slot) に今日のN倍の計算予算を与えます。2026年10月15日現在、[[glossary/mainnet|メインネット]]ではN=32で約30倍のTPS (Transactions Per Second) になります。

今日の[[glossary/Finality|ファイナリティ]]は2つの[[glossary/epoch|エポック]]を待ち、実時間で約10分かかります。遅延検証が通過すると、ブロックはすでに使用可能になります。これが有効性 (effectiveness) です。[[glossary/Finality|ファイナリティ]]は、次のいくつかのバッチがこのバッチの`batchHash`にチェーンバックし、検証[[glossary/stake|ステーク]]が十分に高いという後の条件です。

## 仕様

### 1. ブロック生成は[[glossary/EIP-7732|EIP-7732]]に従う

以下の役割、メッセージ、タイミングはすべて[[glossary/EIP-7732|EIP-7732]] ( [EIP-7732: Enshrined Proposer-Builder Separation](https://eips.ethereum.org/EIPS/eip-7732) ) から完全に採用されています。この提案はそれらのいずれも追加しません。

- [[glossary/beacon-block-proposer|ビーコンブロックプロポーザー]]は、現在のルールに従って、1スロットあたり1つ、ランダムに選択されます。[[glossary/beacon-block-proposer|プロポーザー]]は`[[glossary/SignedExecutionPayloadBid|SignedExecutionPayloadBid]]`をビーコンブロックに書き込みます。
- ビルダーの[[glossary/stake|ステーク]]、入札、支払い、および`[[glossary/SignedExecutionPayloadEnvelope|SignedExecutionPayloadEnvelope]]`のリビールは[[glossary/EIP-7732|EIP-7732]]に従います。ビルダーの最小[[glossary/stake|ステーク]]は1 ETHである可能性があります。これは入札保証金です。
- [[glossary/Payload-Timeliness-Committee|ペイロード適時性委員会]]は`[[glossary/PayloadAttestationMessage|PayloadAttestationMessage]]`をブロードキャストします。ペイロードが出現したこと、`[[glossary/block_hash|block_hash]]`がリビールされたペイロードと一致すること、および[[glossary/blob|ブロブ]]が利用可能であることをチェックします。委員会は実行をリプレイしません。
- [[glossary/fork-choice|フォーク選択]]におけるフル、スキップ、および空のスロット、[[glossary/proposer-payment|プロポーザー支払い]]、リビール安全性、および非公開安全性は[[glossary/EIP-7732|EIP-7732]]に従います。
- [[glossary/execution-validation|実行検証]]は、次のビーコンブロックが処理されるときに実行されます。無効なペイロードは[[glossary/EIP-7732|EIP-7732]]の[[glossary/fork-choice|フォーク選択]]によって処理されます。この提案は、個別の[[glossary/slashing-condition|スラッシング条件]]を定義しません。

スロットの実時間長は`[[glossary/SLOT_TIME|SLOT_TIME]]` = 12秒のままです。バッチは[[glossary/beacon-block-proposer|プロポーザー]]がスロットを占有する時間を延長せず、リビール期限も変更しません。

この提案が変更するのは、その[[glossary/execution-payload|実行ペイロード]]の内部形状、`[[glossary/block_hash|block_hash]]`および`[[glossary/parent_block_hash|parent_block_hash]]`によって命名されるオブジェクト、ブロックごとのガス上限、および[[glossary/full-nodes|フルノード]]と[[glossary/verification-node|検証ノード]]がそれぞれフェッチするデータです。

### 2. バッチと親ハッシュ

1つのスロットの[[glossary/execution-payload|実行ペイロード]]は1つのバッチです。バッチは実行ブロックを要素とするセットです。`N ≥ 1`。`N = 1`の場合、バッチは1つのブロックを含みます。

```text
blockHash(block) = その実行ブロックのヘッダーのハッシュ
batchHash(batch) = keccak256( blockHash値のリスト、辞書順にソート )
```

辞書順は、ハッシュがセットの記述順序に依存しないようにします。各`[[glossary/blockHash|blockHash]]`はそのブロックのボディにコミットするため、`[[glossary/batchHash|batchHash]]`はバッチ内のすべてのブロックにコミットします。

バッチの親は、セットとしての前のバッチです。親ハッシュは前のバッチの`batchHash`です。

- `[[glossary/ExecutionPayloadBid|ExecutionPayloadBid]].parent_block_hash` = 前のバッチの`batchHash`
- `[[glossary/ExecutionPayloadBid|ExecutionPayloadBid]].block_hash` = このバッチの`batchHash`
- このバッチ内のすべての実行ブロックのヘッダー`[[glossary/parentHash|parentHash]]` = 前のバッチの`batchHash`
- このバッチのペイロードが承認された後、[[glossary/beacon-state|ビーコン状態]]の`[[glossary/latest_block_hash|latest_block_hash]]`はこのバッチの`batchHash`に更新されます

バッチ内のすべてのブロックは同じ親ハッシュを指します。ブロックは`[[glossary/parentHash|parentHash]]`によって互いにチェーンされません。読み書きで競合するブロックは、バッチ内依存関係フィールドでその順序を記録します。依存関係は同じバッチ内の兄弟の`[[glossary/blockHash|blockHash]]`であり、ターゲットはこのバッチに属している必要があります。スケジューラー (scheduler) はそのフィールドに従って実行します。親ハッシュはバッチのみを接続します。

このバッチ内のすべての実行ブロックは、バッチインデックスに等しい同じ`number`を持ちます。バッチインデックスは、ペイロードが正常にリビールされた各スロット (slot) ごとに1ずつ増加します。これは今日の1スロットあたり1ブロック番号と同じステップです。

[[glossary/EIP-1559|EIP-1559]] ( [EIP-1559: Fee market change for ETH 1.0 chain](https://eips.ethereum.org/EIPS/eip-1559) ) は、このブロックの[[glossary/base-fee|ベースフィー]]を親ブロックのガス使用量から導出します。[[glossary/EIP-4844|EIP-4844]] ( [EIP-4844: Shard Blob Transactions](https://eips.ethereum.org/EIPS/eip-4844) ) は、[[glossary/blob-fee|ブロブフィー]]を親から導出します。親が前のバッチになった後も、[[glossary/base-fee|ベースフィー]]と[[glossary/blob-fee|ブロブフィー]]は引き続きこれら2つの式を使用し、バッチごとに1回計算されます。親バッチのガス制限はそのバッチの`N × [[glossary/BLOCK_GAS_LIMIT|BLOCK_GAS_LIMIT]]`であり、そのガス使用量はその実行ブロック全体の合計です。Nがバッチごとに変化する場合、比較には次のバッチのNではなく、親バッチ自身の制限と使用量が使用されます。

### 3. アカウントリストとバッチのパーティション化

各トランザクションは、クライアントが提出時に署名済みペイロード内に書き込んだアカウントリストを運びます。ビルダーはそのリストを書き換えてはなりません。各エントリは次のとおりです。

- オブジェクト: アカウントアドレス、またはアカウントアドレスと1つのストレージスロット
- モード: 読み取り、または書き込み

同じコントラクト (contract) の異なるストレージスロットは異なるオブジェクトです。

競合ルール:

- 2つの読み取りは競合しない
- 1つの書き込みは、その同じオブジェクトの他のすべての読み取りまたは書き込みと競合する

ビルダーは、トランザクションをそのリストによってこのバッチの実行ブロックに割り当てます。

- 同時に実行される2つのブロックは、互いに排他的な書き込みセットを持ち、どちらのブロックの書き込みセットも他のブロックの読み取りセットと交差しない
- 競合するトランザクションは順序付けられる: 1つのブロック内で順次、または依存関係がマークされた2つのブロックとして
- ビルダーはパーティションが必要とする数のブロックを作成する
- ビルダーは、どの実行ブロックにも配置するのが難しいトランザクションを省略する可能性がある。省略されたトランザクションは[[glossary/Mempool|メムプール]]に残り、後のバッチで選択される可能性がある

リストが実行と一致しない場合、そのトランザクションは実行されません。これら両方が不一致です: 実行がリスト外のオブジェクトに触れる、または書き込みが読み取り専用とマークされたオブジェクトに適用される。[[glossary/EVM|仮想マシン]]は`[[glossary/ACCESS_LIST_MISS|ACCESS_LIST_MISS]]`を発生させ、そのトランザクションの状態はトランザクション前と同じままになります。そのトランザクションのガスはその制限で課金されます。リストが自己矛盾しており、スケジューラー (scheduler) が実行前にそれを確認できる場合、トランザクションは[[glossary/EVM|仮想マシン]]に送信されず、やはり`[[glossary/ACCESS_LIST_MISS|ACCESS_LIST_MISS]]`を発生させます。

これはSolanaと一致します。トランザクションが触れるアカウントはクライアントによってリストされます。リストが実際に発生するアクセスと一致しない場合、ランタイムはそのトランザクションを拒否します。\[Sealevel\]([https://docs.solana.com/proposals/sealevel](https://docs.solana.com/proposals/sealevel))を参照してください。

[[glossary/EIP-2930|EIP-2930]] ( [EIP-2930: Optional access lists](https://eips.ethereum.org/EIPS/eip-2930) ) のアクセスリストはオプションです。それはコールドガスとウォームガスのみに影響します。読み取りと書き込みを区別せず、リストから外されたストレージスロットもアクセス可能です。[[glossary/EIP-7981|EIP-7981]] ( [EIP-7981: Increase Access List Cost](https://eips.ethereum.org/EIPS/eip-7981) ) はそのリストのガス価格を上げます。この提案のリストは異なるオブジェクトです。クライアントがそれを供給する必要があり、読み取りと書き込みを区別し、エントリがない場合はそのトランザクションが実行されないことを意味します。

[[glossary/EIP-7928|EIP-7928]] ( [EIP-7928: Block-Level Access Lists](https://eips.ethereum.org/EIPS/eip-7928) ) のブロックレベルアクセスリストは、ブロック実行後に生成される記録です。ブロック内のトランザクションインデックスごとに、どのスロットが読み取られ、どの値が書き込まれたかを記録します。この提案のリストは実行前にクライアントによって提出され、トランザクションを同じバッチの異なるブロックに配置するために使用されます。各実行ブロックは依然として独自の[[glossary/EIP-7928|EIP-7928]]リストを運びます。

[[glossary/EIP-7805|EIP-7805]] ( [EIP-7805: Fork-choice enforced Inclusion Lists (FOCIL)](https://eips.ethereum.org/EIPS/eip-7805) ) からのインクルージョンチェックは、[[glossary/EIP-7732|EIP-7732]]ですでに述べられている互換性に従います。チェックの対象は、このバッチに対応する単一の[[glossary/execution-payload|実行ペイロード]]です。

### 4. 複数の仮想マシンとスケジューラー

今日の[[glossary/EVM|仮想マシン]]は、1つのブロックのトランザクションをシングルスレッドの[[glossary/State-transition|状態遷移]]で適用します。[[glossary/EIP-7928|EIP-7928]] ( [EIP-7928: Block-Level Access Lists](https://eips.ethereum.org/EIPS/eip-7928) ) は、クライアントがその結果を並行してチェックすることを可能にします。チェックはそのシングルスレッド遷移と一致しなければなりません。この提案は、インタープリター (interpreter) 自体をマルチスレッド化するものではありません。

ビルダーの実行ノードは、複数の[[glossary/EVM|仮想マシン]]インスタンスを一度に起動します。各インスタンスは依然として今日のシングルスレッド[[glossary/EVM|仮想マシン]]です。インスタンスの上にはスケジューラー (scheduler) があります。その唯一の仕事はディスパッチ (dispatch) です。

- 入力は、このバッチ用にすでにパーティション化されたブロックと、バッチ内依存関係です。
- 依存関係のないブロックは空いているインスタンスに与えられ、そのようなブロックは同時に実行されます。
- 依存関係のあるブロックは、それが依存するブロックを実行したインスタンスが戻った後にディスパッチされます。
- インスタンスは書き込み可能な状態を共有しません。

競合しないブロックを並行して実行した結果は、依存関係を尊重する任意の中間実行 (interleaving) と一致しなければなりません。すべてのインスタンスが終了すると、ビルダーは[[glossary/EIP-7732|EIP-7732]]の下でエンベロープ (envelope) をリビールします。エンベロープ内のペイロードはこのバッチであり、そのハッシュは入札の`[[glossary/block_hash|block_hash]]`と等しくなります。

### 5. シングルブロック検証、有効性、およびファイナリティ

検証は投票メッセージを追加しません。[[glossary/Payload-Timeliness-Committee|ペイロード適時性委員会]]は[[glossary/EIP-7732|EIP-7732]]に記述された義務を維持します。実行が正しいかどうかは、次のビーコンブロックが処理されるときに決定されます。これが[[glossary/EIP-7732|EIP-7732]]の遅延検証です。

この遅延検証を実行する[[glossary/verification-node|検証ノード]]は、バッチの1つの実行ブロックのみをリプレイし、1つの[[glossary/EVM|仮想マシン]]インスタンスのみを実行します。それが読み取るデータはセクション6で指定されています。その1つのブロックについて、次の3つのことをチェックします。

1. クライアントによって提出されたリストが、そのトランザクションの読み取りと書き込みをカバーしていること。不一致は`[[glossary/ACCESS_LIST_MISS|ACCESS_LIST_MISS]]`です。
2. このブロックと同時に実行される他のブロックが書き込みで競合しないこと。このステップは、それらのブロックのアカウントリストのみを読み取ります。それらのトランザクションボディをフェッチしたり、実行したりはしません。
3. セクション6の[[glossary/state-proof|ステート証明]]に対してこのブロックをリプレイすること。[[glossary/state-root|ステートルート]]と[[glossary/receipts-root|レシートルート]]がリビールされたペイロードと一致すること。

そのブロックのチェックが通過すると、ブロックは有効 (effective) になります。有効性は遅延検証が完了した瞬間に発生します。同じバッチの他のブロックはそれぞれ独自に有効になります。兄弟に依存するブロックは、依存するブロックが有効になった後にのみ有効になります。

次のスロットの[[glossary/beacon-block-proposer|ビーコンブロックプロポーザー]]は[[glossary/verification-node|検証ノード]]として扱われます。割り当てられたブロックのみをチェックします。バッチ全体をリプレイしません。バッチのトランザクションと状態は[[glossary/full-nodes|フルノード]]上に留まります。

[[glossary/Finality|ファイナリティ]]は有効性とは別です。

- 有効なブロックは、次の`[[glossary/FINALITY_DEPTH|FINALITY_DEPTH]]`個の連続するバッチの親ハッシュが`batchHash`に沿ってこのバッチにチェーンバックし、このブロックのペイロードの遅延検証を完了した有効な[[glossary/stake|ステーク]]が`[[glossary/FAST_FINALITY_STAKE|FAST_FINALITY_STAKE]]`以上である場合に最終的 (final) になります。
- 実施例では`[[glossary/FAST_FINALITY_STAKE|FAST_FINALITY_STAKE]] = 1024 ETH`を使用します。実時間 (wall-clock) は2、4、6バッチの`[[glossary/FINALITY_DEPTH|FINALITY_DEPTH]]`で与えられます。1つのバッチは1つのスロットを占有します。
- 検証[[glossary/stake|ステーク]]がその閾値を下回る場合、ブロックは有効なままとなり、[[glossary/Finality|ファイナリティ]]は今日と同じく[[glossary/Casper-FFG|Casper FFG]]に従って2つの[[glossary/epoch|エポック]]を要します。
- ビルダーの1 ETHの入札保証金は`[[glossary/FAST_FINALITY_STAKE|FAST_FINALITY_STAKE]]`にはカウントされません。

### 6. フルノードと検証ノード

2種類のノードは異なるデータをフェッチします。

**[[glossary/full-nodes|フルノード]]**はバッチ全体を保存し、提供します。すべての実行ブロックのトランザクションボディ、アカウントリスト、[[glossary/state-root|ステートルート]]、レシート、およびバッチ全体でマージされた状態です。[[glossary/full-nodes|フルノード]]は商用オペレーターによってサーバー上で実行されます。この提案は、家庭用マシン向けの[[glossary/full-nodes|フルノード]]のサイズを規定しません。ビルダーがリビールする完全なバッチは[[glossary/full-nodes|フルノード]]によって受信されます。N=32の場合、今日の平均密度で各ブロックが満杯であれば、1つのバッチは約5 MBです。各ブロックが今日の最悪ケースのバイトサイズまで満たされている場合、1つのバッチは約30 MBです。この転送は[[glossary/full-nodes|フルノード]]とビルダーに依存します。

**[[glossary/verification-node|検証ノード]]**は1つの実行ブロックを検証します。他の実行ブロックのトランザクションボディをダウンロードせず、バッチ全体の状態を保存しません。次の3つのものを読み取ります。

1. そのブロックのトランザクション。すでに[[glossary/transaction-pool|トランザクションプール]]にあるボディはトランザクションIDで読み取られ、リビールはそれらのボディを2回目に運びません。ローカルに不足しているボディは、IDでプールまたは[[glossary/full-nodes|フルノード]]からフェッチされ、このブロックに不足しているトランザクションのみがフェッチされます。プールからハッシュでフェッチするのは現在の[[glossary/execution-layer|実行レイヤー]]の挙動です。[[glossary/EIP-5793|EIP-5793]] ( [EIP-5793: eth/68 - Add tx type to tx announcement](https://eips.ethereum.org/EIPS/eip-5793) ) を参照してください。
2. 書き込み競合をチェックするために使用される、バッチ内の他のブロックのアカウントリスト。
3. 前のバッチの`batchHash`に対する、このブロックが読み取るアカウントとストレージスロットの[[glossary/state-proof|ステート証明]]。この証明は[[glossary/full-nodes|フルノード]]またはビルダーによって生成されます。[[glossary/transaction-pool|トランザクションプール]]にはありません。

IDリストはトランザクションボディよりもはるかに小さいです。約200トランザクションのブロックの場合、IDは数KBから数十KBです。プールヒット率が高い場合、このブロックがワイヤー上で節約するのはボディ転送の時間です。ビルダーにのみ存在し、パブリックプールに入らなかったトランザクションは、引き続き[[glossary/full-nodes|フルノード]]からIDでフェッチされ、フェッチはこのブロックに不足しているトランザクションに限定されます。

このスロットの[[glossary/verification-node|検証ノード]]のホットパス (hot path) は約1ブロックです。今日の密度で約100 KB、バイトサイズが今日の最悪ケースまで満たされている場合は約1 MB、さらに兄弟リストとこのブロックの[[glossary/state-proof|ステート証明]]です。証明は、このブロックが触れる状態とともに増加します。

[[glossary/Payload-Timeliness-Committee|ペイロード適時性委員会]]は引き続き[[glossary/EIP-7732|EIP-7732]]に従います。バッチ全体がリビールされたこと、`[[glossary/block_hash|block_hash]]`がリビールされたペイロードと一致すること、および[[glossary/blob|ブロブ]]が利用可能であることをのみチェックします。このチェックは、委員会メンバーがすべてのトランザクションボディを受信することを要求しません。

### 7. ガス、実行ブロックごと

リビールレート (reveal rate) は変更されません。1つのスロット、1つのバッチ、`[[glossary/SLOT_TIME|SLOT_TIME]]` = 12秒。[[glossary/Ethereum-validator|バリデータ]]は1つの実行ブロックをリプレイするため、ガスはブロックごとに上限が設定されます。バッチは今日のシングルブロックガス制限で上限が設定されません。

`[[glossary/BLOCK_GAS_LIMIT|BLOCK_GAS_LIMIT]] = 60_000_000`。これは2026年10月15日の[[glossary/mainnet|メインネット]]の1ブロックのガス制限です。どの実行ブロックの`gasUsed`もこれを超えてはなりません。バッチのガスはブロック全体の合計であり、上限は`N × [[glossary/BLOCK_GAS_LIMIT|BLOCK_GAS_LIMIT]]`です。[[glossary/EIP-7732|EIP-7732]]の入札の`gas_limit`はその合計です。新しいフィールドは追加されません。

各実行ブロックのバイト上限は、今日の1ブロックのバイト上限と等しいです。そうでなければ、そのブロックのガス予算をトランザクションで満たすことができません。バッチのバイトはブロック全体の合計です。

| パラメータ | 制約 |
|—|—|
| `[[glossary/BLOCK_GAS_LIMIT|BLOCK_GAS_LIMIT]]` | 60,000,000。実行ブロックごとに1つの許容量 |
| バッチのガス | ブロック全体の合計、最大`N × [[glossary/BLOCK_GAS_LIMIT|BLOCK_GAS_LIMIT]]`。入札の`gas_limit`は合計 |
| 各実行ブロックのバイト | 今日の1ブロックのバイト上限と等しい |
| バッチのバイト | ブロック全体の合計 |
| `[[glossary/SLOT_TIME|SLOT_TIME]]` | 12秒。1スロットあたり1回のリビール |
| `[[glossary/FAST_FINALITY_STAKE|FAST_FINALITY_STAKE]]` | 実施例: 1024 ETH |
| `[[glossary/FINALITY_DEPTH|FINALITY_DEPTH]]` | 有効性後の追加バッチ数。計算はセクション9 |

自身のガス上限またはバイト上限を超えるブロックは無効です。バッチの合計が入札の`gas_limit`と一致しない場合、ペイロード全体が無効となり、[[glossary/EIP-7732|EIP-7732]]の下で無効なペイロードとして処理されます。リビール期限は[[glossary/EIP-7732|EIP-7732]]に従い、バッチがより多くのブロックを含むため延長されることはありません。

### 8. スループット

2026年10月15日、[[glossary/mainnet|メインネット]]は約21.8 TPSで観測され、ブロックあたりのガス制限は60,000,000、その日の[[glossary/Layer-1|L1]]トランザクションは約180万でした。ブロックがほぼ満杯の場合、平均トランザクションは約240,000ガスです。1つのフルブロックのスロットあたりのトランザクション数は次のとおりです。

```text
60_000_000 / 240_000 / 12 = 20.8 TPS
```

すべての実行ブロックがその予算を満たし、ビルダーが競合しないトランザクションを異なるブロックに配置する場合、スロットのTPSは約20.8 × Nです。

| N | バッチのガス | 約TPS | 約21 TPSに対する相対値 |
|—|—|—|—|
| 8 | 4億8000万 | 170 | 8倍 |
| 16 | 9億6000万 | 330 | 15倍 |
| 32 | 19億2000万 | 670 | 30倍 |

Nは、ビルダーが一度に実行でき、実際に[[glossary/Mempool|メムプール]]から満たすことができる競合しないブロックの数です。各[[glossary/verification-node|検証ノード]]は1つのブロックを受け取り、セクション6のようにデータをフェッチするため、Nが大きくなっても[[glossary/verification-node|検証ノード]]の転送量は増えません。バッチ全体のバイトと状態は[[glossary/full-nodes|フルノード]]上に存在し、Nにほぼ線形に増加します。[[glossary/Glamsterdam|グラムステルダム]]はすでに約2億ガス、今日の約3倍のペイロードで状態を価格設定しています。このガスルールの下では、Nが16から32、約300から700 TPSの範囲が、[[glossary/full-nodes|フルノード]]の状態成長も考慮に入れた範囲です。N=32は約30倍です。

### 9. ファイナリティ時間

計算には2026年10月15日頃の公開パラメータを使用します。1つのバッチは1つのスロットに対応するため、バッチ数の実時間 (wall clock) はその数のスロットの実時間と等しくなります。

[[glossary/Casper-FFG|Casper FFG]] ( \[Gasper\]( [Gasper | ethereum.org](https://ethereum.org/developers/docs/consensus-mechanisms/pos/gasper/) ) ) は、[[glossary/epoch|エポック]]境界の[[glossary/checkpoint|チェックポイント]]のみを最終化します。1つの[[glossary/epoch|エポック]]は32スロット、1つのスロットは12秒です。[[glossary/Finality|ファイナリティ]]には、2つの連続する[[glossary/checkpoint|チェックポイント]]が総[[glossary/stake|ステーク]]の3分の2からの投票を集める必要があるため、下限は2つの[[glossary/epoch|エポック]]です。

```text
32 × 12 = 384秒 = 6.4分 (1エポック)
2 × 384 = 768秒 = 12.8分 (ファイナリティの下限)
```

[[glossary/epoch|エポック]]の途中で着地したトランザクションは、その境界に入るまでにさらに半分の[[glossary/epoch|エポック]]を待ちます。[[glossary/Finality|ファイナリティ]]までの予想時間は次のとおりです。

```text
768 + 192 = 960秒 = 16分
```

これは、プロトコル議論「\[Upgrading finality\]( [Protocol Consensus](https://consensus.ethereum.foundation/blog/upgrading-finality-edition-1) )」で与えられた期待値と一致します。2026年10月15日の実時間観測: 中央値15.9分、90パーセンタイル18.4分、99パーセンタイル19.0分。\[OpenChainBench\]( [Ethereum finality time: 15.9 min · OpenChainBench](https://openchainbench.com/benchmarks/l1-finality/ethereum) ) を参照してください。

総[[glossary/stake|ステーク]]は43,950,553 ETHで、2026年10月13日に[ethereum.org](http://ethereum.org)で公開された数値です。\[Staking\]( [Ethereum staking: How does it work? | ⁦ethereum.org⁩](https://ethereum.org/staking/) ) を参照してください。

```text
ファイナリティに必要な投票数 2/3 × 43,950,553 = 29,300,369 ETH
ファイナリティを元に戻すために破壊されるべきステーク 1/3 × 43,950,553 = 14,650,184 ETH
1スロットで投票するステーク 43,950,553 / 32 = 1,373,455 ETH
```

各スロットはすでに約137万ETHの投票があります。[[glossary/Finality|ファイナリティ]]が依然として約10分かかるのは、プロトコルが2つの[[glossary/epoch|エポック]]にわたって総[[glossary/stake|ステーク]]の3分の2を収集するためであり、単一のスロットが1024 ETHを収集できないためではありません。

`[[glossary/FAST_FINALITY_STAKE|FAST_FINALITY_STAKE]] = 1024 ETH`の場合:

```text
1024 / 32 = 32 (32 ETHのバリデータユニット)
1024 / 43,950,553 = 0.00233% (総ステークの約1/42,920)
1024 / 14,650,184 = 0.0070% (グローバルファイナリティを元に戻すために破壊されるステークの約1/14,307)
1024 / 1,373,455 = 0.0746% (1スロットで投票するステークの約1/1,341)
```

[[glossary/EIP-7251|EIP-7251]] ( [EIP-7251: Increase the MAX\_EFFECTIVE\_BALANCE](https://eips.ethereum.org/EIPS/eip-7251) ) は、単一の[[glossary/Ethereum-validator|バリデータ]]の最大有効残高を2048 ETHに引き上げます。1024 ETHは1つの[[glossary/Ethereum-validator|バリデータ]]に収まります。

したがって、1024 ETHの検証[[glossary/stake|ステーク]]は同じスロット内で閾値を超えます。有効性は[[glossary/EIP-7732|EIP-7732]]の遅延検証ウィンドウ内に収まります。ペイロードがリビールされた後、次のブロックが投票される前です。[[glossary/Finality|ファイナリティ]]はさらに`[[glossary/FINALITY_DEPTH|FINALITY_DEPTH]]`個のバッチを待ちます。

| `[[glossary/FINALITY_DEPTH|FINALITY_DEPTH]]` | ファイナリティまでの実時間 | 12.8分の下限に対する比率 | 16分の期待値に対する比率 | 15.9分の観測中央値に対する比率 |
|—|—|—|—|—|
| 2 | 24秒 | 1/32 | 1/40 | 約1/40 |
| 4 | 48秒 | 1/16 | 1/20 | 約1/20 |
| 6 | 72秒 | 約1/11 | 約1/13 | 約1/13 |

1024 ETHは、この1つのブロックの高速[[glossary/Finality|ファイナリティ]]をカバーします。これはグローバル[[glossary/Finality|ファイナリティ]]の[[glossary/slashing-floor|スラッシングフロア]]を下回ります。この[[glossary/stake|ステーク]]に達しないブロックは、引き続き2つの[[glossary/epoch|エポック]]にわたって最終化されます。

## 論拠

1つの[[glossary/EIP-7732|EIP-7732]][[glossary/execution-payload|実行ペイロード]]は、この提案では1つのバッチです。バッチはセットです。セットのハッシュは次のバッチの親ハッシュであるため、チェーンはバッチをリンクし、バッチ内のブロックは兄弟です。

`[[glossary/block_hash|block_hash]]`と`[[glossary/parent_block_hash|parent_block_hash]]`は、[[glossary/EIP-7732|EIP-7732]]の入札にすでに存在するフィールドです。この提案は、これら2つのフィールドがバッチハッシュを運ぶことを指定するだけです。リビール、[[glossary/Payload-Timeliness-Committee|ペイロード適時性委員会]]、および[[glossary/fork-choice|フォーク選択]]は引き続きこれら2つのフィールドを読み取り、メソッドは変更されません。

複数の[[glossary/EVM|仮想マシン]]は、ビルダーがリビール前に実行する方法です。インタープリター (interpreter) はシングルスレッドのままです。遅延検証では、[[glossary/verification-node|検証ノード]]は1つのインスタンスを実行し、1つのブロックをチェックします。バッチ全体は[[glossary/full-nodes|フルノード]]上に存在します。[[glossary/verification-node|検証ノード]]は、[[glossary/transaction-pool|プール]]からのトランザクションID、他のブロックのアカウントリスト、および自身のブロックの[[glossary/state-proof|ステート証明]]を使用してブロックをチェックします。

ストレージスロットまでオブジェクトを記録することで、同じコントラクト (contract) 内の異なるユーザーの残高を異なるブロックに配置できます。ガスはバッチの共有許容量ではありません。各実行ブロックには1つの`[[glossary/BLOCK_GAS_LIMIT|BLOCK_GAS_LIMIT]]`があり、バッチにはN個のそれがあります。リビールは依然として12秒ごとに1回です。

## 後方互換性

これは[[glossary/consensus-layer|コンセンサス層]]の[[glossary/hard-fork|ハードフォーク]]であり、[[glossary/EIP-7732|EIP-7732]]がアクティブである必要があります。アップグレードされたノードは[[glossary/execution-payload|実行ペイロード]]をバッチとして読み取ります。`N = 1`の場合、`batchHash`は単一の`[[glossary/blockHash|blockHash]]`から導出され、親ハッシュは依然として前のバッチの`batchHash`です。

アップグレードされていないノードはバッチペイロードを検証できません。

`[[glossary/FAST_FINALITY_STAKE|FAST_FINALITY_STAKE]]`を下回るブロックは、今日の[[glossary/Casper-FFG|Casper FFG]]と同じ[[glossary/Finality|ファイナリティ]]ルールに従います。

## セキュリティに関する考慮事項

- **誤ったリスト。** クライアントがオブジェクトを省略したり、書き込みを読み取りとしてマークしたりした場合、そのトランザクションは`[[glossary/ACCESS_LIST_MISS|ACCESS_LIST_MISS]]`を発生させ、状態を変更しません。バッチ内の他のブロックは、それぞれの遅延検証結果に従って有効になります。

- **粗すぎるリスト。** 余分なオブジェクトを宣言すると、並列処理が減少するだけです。

- **シングルブロック検証。** [[glossary/verification-node|検証ノード]]はバッチ内の他のブロックをリプレイせず、それらのトランザクションボディをダウンロードしません。競合チェックはそれらのブロックのリストから行われます。リプレイに使用される以前の状態は、前のバッチの`batchHash`に対する[[glossary/state-proof|ステート証明]]から取得されます。[[glossary/state-root|ステートルート]]が一致しないペイロードは、[[glossary/EIP-7732|EIP-7732]]の下で無効なペイロードとして処理されます。

- **[[glossary/full-nodes|フルノード]]。** バッチ全体のトランザクションと状態は、商用オペレーターが運営するサーバーに保存されます。[[glossary/verification-node|検証ノード]]はその追加の転送を負担しません。次のスロットの[[glossary/beacon-block-proposer|プロポーザー]]は自身のブロックのみをチェックします。

- **ビルダーと[[glossary/beacon-block-proposer|プロポーザー]]。** [[glossary/beacon-block-proposer|プロポーザー]]はペイロードを別のバッチに置き換えることはできません。ビルダーがリビールするハッシュは、入札の`[[glossary/block_hash|block_hash]]`と等しくなければなりません。実時間 (wall clock) とリビール期限は[[glossary/EIP-7732|EIP-7732]]と同じです。

- **親ハッシュ。** 次のバッチは前のバッチの`batchHash`のみを認識します。バッチ内依存関係は親子関係ではありません。依存関係フィールドを変更すると`[[glossary/blockHash|blockHash]]`が変更され、`batchHash`が変更され、入札が一致しなくなります。

- **高速[[glossary/Finality|ファイナリティ]]の重み。** 1024 ETHは、1スロットで投票する[[glossary/stake|ステーク]]の約0.075%、グローバル[[glossary/Finality|ファイナリティ]]の[[glossary/slashing-floor|スラッシングフロア]]の約0.007%です。ビルダーの1 ETHの保証金はこの閾値にはカウントされません。

- **ガス。** 各実行ブロックは、独自の`[[glossary/BLOCK_GAS_LIMIT|BLOCK_GAS_LIMIT]]`で上限が設定されます。[[glossary/Ethereum-validator|バリデータ]]は1つのブロックをチェックし、マシンの要件は今日の1つのブロックをチェックする場合と同じです。バッチの計算量はそのN倍であり、状態書き込みも約N倍です。

- **省略。** ビルダーは、実行ブロックに配置するのが難しいトランザクションをこのバッチから除外する可能性があります。除外されたトランザクションは[[glossary/Mempool|メムプール]]に残ります。[[glossary/EIP-7732|EIP-7732]]で述べられている互換性の下で、[[glossary/EIP-7805|EIP-7805]]が強制的に含めるトランザクションはこのカテゴリには含まれません。

- **スロット長。** リビールは12秒ごとに1回です。Nが増加しても、この間隔は短くなりません。

## 参考文献

- \[EIP-1559: Fee market change for ETH 1.0 chain\]( [EIP-1559: Fee market change for ETH 1.0 chain](https://eips.ethereum.org/EIPS/eip-1559) )
- \[EIP-2930: Optional access lists\]( [EIP-2930: Optional access lists](https://eips.ethereum.org/EIPS/eip-2930) )
- \[EIP-4844: Shard Blob Transactions\]( [EIP-4844: Shard Blob Transactions](https://eips.ethereum.org/EIPS/eip-4844) )
- \[EIP-5793: eth/68: Add tx type to tx announcement\]( [EIP-5793: eth/68 - Add tx type to tx announcement](https://eips.ethereum.org/EIPS/eip-5793) )
- \[EIP-7251: Increase the MAX\_EFFECTIVE\_BALANCE\]( [EIP-7251: Increase the MAX\_EFFECTIVE\_BALANCE](https://eips.ethereum.org/EIPS/eip-7251) )
- \[EIP-7732: Enshrined Proposer-Builder Separation\]( [EIP-7732: Enshrined Proposer-Builder Separation](https://eips.ethereum.org/EIPS/eip-7732) )
- \[EIP-7805: Fork-choice enforced Inclusion Lists (FOCIL)\]( [EIP-7805: Fork-choice enforced Inclusion Lists (FOCIL)](https://eips.ethereum.org/EIPS/eip-7805) )
- \[EIP-7928: Block-Level Access Lists\]( [EIP-7928: Block-Level Access Lists](https://eips.ethereum.org/EIPS/eip-7928) )
- \[EIP-7981: Increase Access List Cost\]( [EIP-7981: Increase Access List Cost](https://eips.ethereum.org/EIPS/eip-7981) )
- \[Gasper\]( [Gasper | ethereum.org](https://ethereum.org/developers/docs/consensus-mechanisms/pos/gasper/) )
- \[Upgrading Ethereum Finality\]( [Protocol Consensus](https://consensus.ethereum.foundation/blog/upgrading-finality-edition-1) )
- \[Ethereum staking, total ETH staked 43,950,553 on 2026-10-13\]( [Ethereum staking: How does it work? | ⁦ethereum.org⁩](https://ethereum.org/staking/) )
- \[OpenChainBench, Ethereum finality on 2026-10-15\]( [Ethereum finality time: 15.9 min · OpenChainBench](https://openchainbench.com/benchmarks/l1-finality/ethereum) )
- \[Sealevel\]([https://docs.solana.com/proposals/sealevel](https://docs.solana.com/proposals/sealevel))

## 著作権

著作権および関連する権利は\[CC0\]([Deed - CC0 1.0 Universal - Creative Commons](https://creativecommons.org/publicdomain/zero/1.0/))を通じて放棄されます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/execution-batches-of-multiple-blocks-under-eip-7732/29981)
