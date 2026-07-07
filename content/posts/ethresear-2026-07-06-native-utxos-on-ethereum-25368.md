---
title: イーサリアムにおけるネイティブUTXO
original_title: Native UTXOs on Ethereum
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/native-utxos-on-ethereum/25368'
author: Nero_eth
date: '2026-07-06'
category: Execution Layer Research
tags:
  - execution-layer
  - state-management
  - eip
  - gas
  - ux
  - protocol-design
  - utxo
topic_id: '25368'
translated_at: '2026-07-07'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Native UTXOs on Ethereum](https://ethresear.ch/t/native-utxos-on-ethereum/25368) — Nero_eth (2026-07-06)

# イーサリアムにおけるネイティブUTXO

フィードバックとレビューをいただいた[Thomas](https://x.com/soispoke)、[Ignacio](https://x.com/ignaciohagopian)、[Matt](https://x.com/lightclients)に、そしてこのトピックを提起し議論を促進してくださった[Vitalik](https://vitalik.eth.limo/)に、特に感謝いたします。

[![UTXO投稿](https://ethresear.ch/uploads/default/optimized/3X/d/c/dc61dd2827717ff535d795e07f94b72c5fbe2d4b_2_690x459.png)](https://ethresear.ch/uploads/default/original/3X/d/c/dc61dd2827717ff535d795e07f94b72c5fbe2d4b.png "utxopost")

イーサリアムでは、支払いを受け取ると永続的なステート (state) が追加されます。アドレスが初めてETHを受け取ると、永続的なアカウントリーフ (account leaf) を取得します。初めてERC-20を保有すると、永続的なストレージスロット (storage slot) を取得します。

ビットコインは異なります。ビットコインの支払いはワンショットオブジェクト (one-shot object) です。一度作成され、一度使用されると、ステートから削除され、なくなります。チェーンはアカウント残高 (account balance) ではなく、[[glossary/UTXO|UTXO]]が使用されたことを記憶します。

**この特性は借りる価値があり、イーサリアムはアカウントを放棄することなくこれを実現できます。永続的なステート (persistent state) を必要としない支払いワークロード (payment workloads) の場合、ネイティブUTXOは永続的なステート使用量を約99.8%削減します。**

この記事は[[glossary/Frame-Transactions|フレームトランザクション (EIP-8141)]]を前提としています。*フレーム*とは、[[glossary/EIP-8141|EIP-8141]]トランザクション内の自己完結型で署名されたステップのことです。読み取り専用のVERIFYフェーズにより、あるフレームが次のフレームを検査し、スポンサーシップ (sponsoring) を承認することを拒否できるため、[[glossary/Trustless-sponsorship|トラストレスなスポンサーシップ]]が可能になります。署名はリストに格納され、各エントリはそのスキームを命名します。現在はsecp256k1とP-256ですが、将来的には[[glossary/Post-Quantum|ポスト量子 (PQ)]]スキームも含まれます。UTXOの支払いはそのリストをそのまま再利用します。

> **tl;dr** 署名され、値を保存する (value-conserving) 単一の[[glossary/EIP-8141|EIP-8141]]フレームは、UTXO入力、UTXO出力、アカウントフロー、およびガス (gas) を1つのトランジションにまとめます。スポンサーシップは通常のフレームとなり、支払い者フレームは、返済される出力を見た後にのみ承認します。

## ワンショット支払い、永続的なステートなし

イーサリアムのアカウントは優れていますが、ワンショット支払い (one-shot payments) にはあまり適していません。

ほとんどの単純な支払いには、永続的なアカウント (persisting account) は必要ありません。必要なのは次のものだけです。

-   値
-   受信者
-   値を一度だけ使用する方法（[[glossary/Double-spending|二重支払い]]を回避するため）

これはまさにビットコインの[[glossary/UTXO|UTXO]]モデルです。

> **ビットコインの場合、未使用UTXO (unspent UTXOs) はステートとなり、使用されたときにのみ回収されます。永続的なステートなしで同じワンショット値を求めているため、UTXOをステートではなく履歴 (history) に置くことを検討するかもしれません。その方法は以下で説明します。**

UTXOの受信者は単なるイーサリアムアドレスです。それを使用するには、受信者の鍵からの署名が必要で、署名リストがサポートする任意のスキームを使用できます。パスキーは今日UTXOを保持でき、明日には量子耐性鍵も可能です。受信者コードは実行されず、新しいスクリプト言語も必要ありません。

## UTXOオブジェクト

各UTXOは、オープニング (opening) とプロトコルによって割り当てられた1つのインデックスで記述されます。

```
opening = (source, value, recipient)
index   : uint64
```

-   `source`: UTXOを作成したアカウント。
-   `value`: wei単位の金額。
-   `recipient`: 使用を許可されたアドレス。
-   `index`: 作成時に割り当てられるグローバルな単調増加カウンター (global monotonic counter) で、[[glossary/Double-spending|二重支払い]]を防ぐために使用されます。

**UTXOは全額使用されます (spent whole)。** ビットコインと同様に、部分的な支払い (partial spends) はありません。支払いは`value`全体を消費し、残余 (remainder) は新しいUTXO出力として、またはアカウント転送 (account transfer) として戻されます。

**作成はシステムコントラクト (system contract) の呼び出しです。** コントラクトを含む誰でも、コールデータ (calldata) にオープニングを含めて、`value`をボールト (vault) `UTXO_VAULT`に送信できます。ボールトは`msg.value`から金額を読み取り、次のインデックスを割り当て、作成イベントログ (event log) を発行します。ボールトはすべての未使用UTXOの価値を保持し、プロトコル (protocol) のみが資金を移動できます。

**重要なことに、オープニング自体はステートに保存されません。** それは作成イベントログにのみ発行され、UTXOを発見可能にし、ブロックごとの**オープニングルート (openings root)** にコミットされ、証明可能 (provable) にします。各ブロックの終わりに、プロトコルはそのブロックで作成されたすべてのオープニングを`leaf = hash(index, source, recipient, value)`として小さなバイナリツリー (binary tree) にハッシュ化し、そのルートをリングバッファ (ring buffer) に保持します。これは、ノードが未使用UTXOのセットをステートに保持する必要があるビットコインとは異なります。ここでは、ノードはシステムコントラクトの（小さな）ステートを保持するだけで済みます。作成ログには以下が含まれます。

-   `source`が`topics[1]`として、
-   `recipient`が`topics[2]`として、
-   `index`と`value`がデータに。

これにより、UTXOを発見可能かつ証明可能に保ちながら、ステートフットプリント (state footprint) を最小限に抑えます。

## 最小限のプロトコルステート

UTXOごとに1つの事実のみをステートに保持します。「*使用済みか？*」という事実のみを保持し、その他すべては履歴から証明します。チェーンは以下のステートのみを保持します。

| 名前 | 役割 | サイズ |
| --- | --- | --- |
| next_utxo_index | 次に割り当てるインデックス | 1スロット、上書き |
| spent_bits[index >> 8] | 使用済みフラグ | UTXOごとに1ビット |
| openings_root_ring[N mod 8192] | 最近のオープニングルート | 256 KB固定 |
| batches[N / 8192] | 封印された古いルート | 約10 KB/年 |
| UTXO_VAULT | ロックされたETH | 1つの予約済みアドレス |

`index`は使用済みビットを選択します。

```
word = index >> 8
bit  = index & 0xff
```

> 使用済みセットは`mapping(uint => bool)`ではなく、ビットフィールド (bitfield) です。boolマッピングはスロットごとに255ビットを無駄にしますが、パックされたビットフィールドは1ワードに256個のフラグを収めます。1つの32バイトワードは256個の連続するインデックスをカバーするため、使用済みUTXOは生のビットフィールドで約0.125バイトのコストです。

**支払いはオープニングをオープニングルートに対して証明します。** 最近のルートはシステムコントラクトに保存されているリングから読み取られ、古いルートは同じコントラクトに保持されている封印されたバッチを通じて回復されます。これにより、UTXOごとに1つのコミットメントを保存する必要がなくなり、ステート成長問題 (state growth problem) が再発するのを防ぎます。

> チェーンは既に[[glossary/Execution-Receipt|レシートルート]]を通じてログにコミットしていますが、レシート証明 (receipt proof) は、発行されたすべてのログを含む、作成トランザクションの完全なレシートを運ぶ必要があります。1つのトランザクションで500個のUTXOを作成するバッチ支払い (batch payout) は、500個の支払い者 (spenders) のそれぞれにそのレシート全体を証人 (witness) として送ることを強制します。オープニングツリー (openings tree) では、すべてのUTXOが独自のリーフです。証明は、UTXOがどのように作成されたかに関係なく、数百バイトの平文ハッシュ (plain hashing) であり、検証者 (verifier) は[[glossary/RLP|RLP (Recursive Length Prefix)]]や[[glossary/Merkle-Patricia-Trie|MPT（マークルパトリシアトライ）]]証明に触れることはありません。作成は依然としてそのログに対してのみ支払い、ルートはレシートルートと同様に、ブロック境界 (block boundary) でクライアント (client) によって計算されます。

## 存在を保存し、消費を証明する

UTXOから一歩引いて考えてみましょう。ここには一般的な原則があります。「*これはまだ使用可能か？*」というチェックは、同時に2つの質問に答えます。「*これは存在したか？*」そして「*これはまだ使用されていないか？*」

**ビットコインは両方を1つに結合します。UTXOセットに存在することです。** これはエレガントですが、オブジェクト全体をステートに強制し、そのスペースを回収する唯一の方法は、使用時に削除することです。イーサリアムのアカウントはさらに悪く、作成時に支払い、決して回収しません。どちらも作成時に永続的なコスト (permanent cost) を前払いします。

**上記のUTXO設計は、代わりに2つの質問を分割します。** 存在は追記専用履歴 (append-only history) から証明され、オープニングはオープニングルートに対して証明され、ステートに保持される唯一のものは単一の「使用済み」ビットです。**すべてのUTXOをステートに保持することで、未使用UTXOセットを追跡することを全員に要求することはありません。** 永続的なコストは作成時に発生するのではなく、消費 (consumption) 時期に移動します。作成されたが一度も使用されないUTXOは永続的なステートを全く書き込まず、使用されたUTXOは1ビットのコストです。

> **ルール:** 次のトランザクションの有効性が依存する最小限の事実、通常は「*これは使用済みか？*」のみをステートに保持し、存在と内容はオンデマンドで証明する追記専用履歴に押し込む。

欠点は、これがビットコインのゼロ残余には達しないことです。履歴は書き換えられないため、すべてのUTXOにはリプレイ (replay) を防ぐための「消費済み」マーカー (consumed marker) が必要です。ビットコインのマーカーは削除自体です。UTXOはセットから単に消滅します。ここでは、残る1ビットです。
したがって、私たちは大きな*回収可能な*フットプリントを、小さな*永続的な*フットプリントと交換しています。部分的にステートフルなノード (partially stateful nodes) の場合、これによりすべてのUTXO（オープニング）を追跡する必要がなくなり、代わりに[[glossary/UTXO|UTXO]]_VAULTステートのみが必要となり、無視できる速度 (negligible rate) で増加します。

| モデル | 存在が保存される場所 | 消費が保存される場所 | 作成時に書き込まれるステート（オープニングサイズ） |
| --- | --- | --- | --- |
| ビットコイン | ステート（UTXOセット） | 履歴（使用済みUTXO） | UTXOオープニングあたり約50～100+ B |
| 現在のイーサリアム | ステート（アカウント/ストレージ） | ステート（アカウント/ストレージ更新） | アカウント/ストレージエントリあたり約100～150+ B |
| イーサリアムネイティブUTXO | 履歴（ログ + オープニングルート） | ステート（使用済みビット） | 0 B |

## 支払いが保証すべきこと

作成は、示されているように簡単な半分です。ボールト（=システムコントラクト）はビーコンデポジットコントラクトのように機能し、値を含む呼び出しが作成ログを発行し、UTXOを作成します。作成されたUTXOを使用することはもう半分であり、作成とは異なり、ネイティブプロトコルのサポートが必要です。なぜなら、新しい受信者はETHを全く持っていない可能性があるからです。

受信者はUTXOを使用するためにETHを保持する必要があってはなりません。重要なのはワンショット受信者です。一度値を受け取り、自身のETHを全く持たず、持つ理由もないアドレスです。そのようなアドレスは新規であり、ガスを支払うためだけに資金を供給すると、UTXOが回避しようとしていたアカウントリーフを再作成してしまいます。[[glossary/ERC-5564|ERC-5564]]ステルスアドレス (stealth address) のような単一使用の受信者は極端なケースですが、この要件はあらゆる新規受信者に当てはまります。

受信者は0 ETHを保持しながら1 ETHのUTXOを使用できる必要があり、それを行うには2つの許容可能な方法しかありません。

1.  **自己資金による支払い (Self-funded spend):** UTXOが自身の値から自身の支払いを賄う。
2.  **スポンサー付き支払い (Sponsored spend):** 誰かがガスを立て替え、UTXOからトラストレス (trustlessly) に返済される。つまり、スポンサーは返済が保証された場合にのみ承認する。理想的には、システムコントラクトがこの役割を果たす。

これら2つの特性が真のテストです。これらを提供できないUTXO設計は、既に資金のあるアカウント (already-funded accounts) にのみ有用であり、UTXOが最も価値を追加する場所ではありません。

## 設計空間: オペコードかフレームか

**そのネイティブサポートを追加する方法は2つあります。**

**1. 支払いオペコード (spend opcode) を追加する、**
**2. 特別なターゲットの[[glossary/EIP-8141|EIP-8141]] `VERIFY`フレームを追加する。**

> 最初はオペコード設計の方がシンプルに見えます。UTXOの支払いを[[glossary/EVM|EVM (イーサリアム仮想マシン)]]コードに直接公開します。フレーム設計はより重く見えます。アカウントとUTXO間の完全な署名済みトランジションを公開します。

以下のセクションでは、フレーム設計が正しい理由を示します。それは自己資金による支払いと[[glossary/Trustless-sponsorship|トラストレスなスポンサーシップ]]を実現します。オペコード設計がなぜ不十分であるかに関心がない場合は、次のセクションをスキップしてください。

## オプション1: 支払いオペコード

オペコード設計では以下が追加されます。

```
SPEND_UTXO(index, source, value, creation_block, opening_path) -> value
```

`SPEND_UTXO`はオープニングルートを解決し、オープニングを検証し、使用済みビット (spent bit) が未設定であることを確認し、それを反転させ、`msg.sender`にクレジット (credits msg.sender) します。

既に資金のあるアカウント (already-funded accounts) の場合、これは機能します。ウォレットがUTXOを作成し、資金のある受信者がそれを使用し、[[glossary/EIP-8141|EIP-8141]]の仕組みは必要ありません。残念ながら、この設計はUTXOが最も重要となる場所、つまり新規受信者 (fresh recipients) の場合に失敗します。

### 自己資金による支払いが失敗する

通常のイーサリアムトランザクションは、実行が開始される前にガスを支払います。0 ETHの受信者は、固有ガス (intrinsic gas) の事前残高チェックが`SPEND_UTXO`が実行される前に失敗するため、実行を開始することさえできません。

たとえ実行が開始できたとしても、DoS攻撃ベクトル (DoS vector) を無視すれば、ロック解除された価値 (unlocked value) は遅すぎます。`SPEND_UTXO`は実行中に値を移動しますが、ガスは既に前払い (prepaid) されています。実行中の価値 (mid-execution value) は実行前料金 (pre-execution charge) をカバーできません。

したがって、UTXOはオペコードを通じて自身の支払いを賄うことはできず、その根本的な理由は、**プロトコルがトランザクションを実行する前に何を行おうとしているかを見ることができない**ためです。

> リレイヤー (relayer) が必要になるでしょう。`SPEND_UTXO`は`msg.sender`にクレジットし、承認するため、支払いは受信者を呼び出し元として実行される必要があります。第三者がそれをトリガーするには、受信者自身のコードが必要です。スマートウォレット (smart wallet) または[[glossary/EIP-7702|EIP-7702]]委任 (delegation) です。それは受信者の永続的なアカウントリーフ (permanent account leaf) を書き込み、ワンショット支払い (one-shot payments) の目的を損ないます。

### トラストレスなスポンサーシップが失敗する

スポンサー（おそらくコントラクト）は、支払う前に返済されることを知る必要があります。

[[glossary/EIP-8141|EIP-8141]]の観点から見ると、支払い者は次のフレームを検査し、自身への返済 (repayment) を確認し、返済が保証されている場合にのみ承認すべきです。通常のトランザクションにはそのような構造はありません。実行前に固定された1つのガス支払い者があり、プロトコルレベルの支払い者ステップはなく、構造化された返済フィールドもありません。

例えば、コントラクトは他のフレームを内省 (introspect) できますが、支払いが自身に返済されるかどうかを判断するために[[glossary/EVM|EVM (イーサリアム仮想マシン)]]コードをシミュレートすることはできません。

したがって、スポンサーシップはリレイヤー、メタトランザクション (meta-transactions)、ERC-4337、または特注コントラクトコード (bespoke contract code) に移行する必要があります。これを機能させる方法はあるかもしれませんが、返済ロジック (repayment logic) はUTXOオブジェクトの外に存在し、私たちが望むクリーンなプリミティブ (clean primitive) ではありません。

### フレーム内のオペコードでも解決しない

`SPEND_UTXO`を[[glossary/EIP-8141|EIP-8141]]トランザクション内に配置しても問題は解決しません。

支払い者は`STATICCALL`として実行されるVERIFYフレーム (VERIFY frame) で承認されます。しかし、`SPEND_UTXO`はステートを変更します。使用済みビットを反転させ、ボールト残高を移動させます。VERIFYでは実行できません。支払い者が既にコミットされた後に実行される必要があり、ロック解除された価値 (unlocked value) は依然として遅すぎます。

スポンサーシップも依然として失敗します。スポンサーは後続のフレームに渡されたデータを解析 (parse the data) できますが、そのフレームが実際にオペコードを呼び出すことで自身に返済するかどうかを判断できません。

**問題は構造的です。** オペコードは単なる[[glossary/EVM|EVM (イーサリアム仮想マシン)]]コードです。支払い者が固定された後に実行され、他のパーティにコミットする前に検査するオブジェクトを提供しません。

## オプション2: 値を保存するフレーム

支払いは、署名され、値を保存するトランジション (value-conserving transition) です。UTXO入力が入り、UTXO出力とアカウント支払いが外に出され、ガスが含まれます。

**[[glossary/EIP-8141|EIP-8141]]は、そのトランジションをカノニカルなVERIFYフレームターゲット (canonical VERIFY-frame target) として、プロトコル定義の決済セマンティクス (protocol-defined settlement semantics) とともに直接公開できます。** ターゲットは`UTXO_VAULT`自体ですが、そのコードはここでは実行されません。プロトコルは、カノニカルペイマスター (canonical paymaster) や有効期限検証者 (expiry verifier) のようにアドレスを認識し、以下のセマンティクスを適用します。ボールトコードは預金 (deposits) の場合にのみ実行されます。支払いの出力（お釣りを含む）はプロトコルが直接作成します。

フレームは次のようになります。

```
actors: [address] // 各々がスキームタグ付き署名 (scheme-tagged signature) によって裏付けられる
                  // フレームダイジェスト (frame digest) に対するtx署名リストから


inputs: [
  { index, creation_block, opening_path }
]

utxo_outs: [
  { recipient, value }
]

account_outs: [
  { recipient, value }
]

change_index: uint
payer: address

max_fee_per_gas
max_priority_fee_per_gas
max_gas_limit
```

各アクター (actor) は`opening_path`の証人 (witness) を除くフレーム全体に署名します。具体的には、署名は証人を除くすべてのフィールドをカバーします。したがって、証人を更新しても署名は有効なままです。提出者 (submitter) は、新しい証人の周りに外側のトランザクションを再ラップ (re-wraps the outer transaction) するだけで、証人に触れることはありません。署名自体はトランザクションの署名リスト内の通常の項目です。secp256k1とP-256は今日機能し、[[glossary/Post-Quantum|ポスト量子 (PQ)]]スキームは単なる別のタグであり、フレーム形式は変更されません。署名は入力、UTXO出力、アカウントフロー、手数料上限 (fee caps)、およびチェーンID (chain ID) をバインドします。提出者は値をリダイレクト (redirect value) したり、トランジションを変更 (alter the transition) したりすることはできませんが、誰でも証人を更新 (refresh a witness) できます。例えば、作成がリングを離れた後にバッチパスを追加 (append the batch path) できます。置換された証人 (substituted witness) は、同じ署名された作成を証明するか、検証に失敗します。なぜなら、各入力はそのグローバルに一意なインデックス (globally unique index) によって固定されているからです。`utxo_outs`を使用すると、新しいUTXOを作成でき、`account_outs`を使用すると、アカウント残高に直接支払うことができます。

入力は`index`と`creation_block`のみを運びます。`source`、`value`、`recipient`は、一意の`index`が既にそれらを固定しているため、署名されるのではなく、証明されたオープニング (proven opening) から読み取られます。検証には、各入力の証明された`recipient`が**アクターのいずれかである**ことが必要です。これにより、1つのフレームで複数のアドレスが保持するUTXOを統合 (consolidate UTXOs) できます。10個のステルス支払い (stealth payments) が単一の支払いに統合され、単一の手数料 (single fee) で済みます。アクターが1人の場合、各出力は`source = actor`で作成されます。複数いる場合、出力は`source = UTXO_VAULT`を運びます。

すべてのフレームは少なくとも1つの入力を消費するため、使用済みビット (spent bits) がリプレイ保護 (replay protection) となります。一度設定されると、フレームは再度実行できません。

プロトコルは以下の保存ルール (conservation rule) を強制します。

```
sum(inputs.value)
>=
sum(utxo_outs.value) + sum(account_outs.value) + max_cost
```

`max_cost`はトランザクションの最大手数料（`TXPARAM(0x06)`）です。固有ガス (intrinsic gas)、フレームごと (per-frame)、コールデータ (calldata)、および署名コストを含む、`max_fee_per_gas`でのすべてのガスです。最大値を予約することで、入力が手数料をカバーすることを保証します。`change_index`は、1つの`utxo_out`（またはアカウント出力）をお釣りとしてマークします。その署名された値はゼロであり、上記の合計から除外されます。手数料と`max_cost`はトランザクションスコープ (transaction-scoped) であるため、トランザクションは最大1つのUTXOフレームを運びます。スポンサー付きケース (sponsored case)（`payer != 0`）では、`max_cost`項は支払い者への署名済み返済出力 (repayment output) に置き換えられます。詳細は「トラストレスなスポンサーシップ」を参照してください。

ガスは保存ルール内に存在し、トランジションの外には存在しないため、UTXOは自身のトランザクション手数料を支払います。

### 自己資金による支払い

消費されたUTXO入力は以下をカバーします。

-   新しいUTXO出力
-   アカウント出力
-   ガス

**アクターはアカウントにETHを必要としません。ボールトは消費されるUTXOの値から支払います。** ガスには優先手数料 (priority fee) が含まれ、これもUTXOから支払われるため、支払いを含むプロポーザーはアクターがETHを保持していなくても支払いを受けます。

> これはオペコード設計では表現できないことです。オペコードの場合、ガスは支払い前に請求されます。フレームの場合、支払いと手数料の支払いは1つの検証されたトランジションです。ワンショット受信者はUTXOを受け取り、後でそれを使用し、アカウント残高を保持する必要がありません。

### トラストレスなスポンサーシップ

スポンサーシップはフレームでも実現できます。

自己資金による支払いでは、UTXOがプロトコルガス (protocol gas) 自体を支払います。これはその保存ルールの`max_cost`項です。支払い者がトランザクションをスポンサーする場合、代わりに支払い者がプロトコルガスを支払います。UTXOは`max_cost`項を削除し、支払い者のガスコスト以上になるように設定された、支払い者への通常の署名済み返済出力 (repayment output) を運びます。返済は`utxo_out`または`account_out`のいずれかです。スポンサーはとにかく資金のあるアカウントなので、アカウントクレジット (account credit) は別の支払いを省きます。アクターはどちらの方法でも同じ値を確保します。支払い者は実際の手数料を支払い、後続のフレームで返済されるため、予約された金額と実際の手数料の差額が、ガスを立て替えることに対する支払い者の報酬となります。署名された`payer`フィールドはモードにコミットします。提出者はスポンサーフレームを削除してフレームを自己資金として再実行することはできません。なぜなら、ゼロ以外の`payer`が支払いを承認する必要があるからです。

支払い者フレームは次のフレームを内省 (introspects) し、構造化された出力 (structured outputs) をチェックします。

```
exists output in utxo_outs + account_outs where
  output.recipient == payer
  output.value >= required_payment
```

支払い者はそのような出力が存在する場合にのみ承認し、それ以外の場合は拒否します。VERIFYフレームが失敗した場合、トランザクション全体が失敗し、支払い者は請求されません。これにより、すべての信頼要件が取り除かれ、スポンサーはコントラクトであることさえ可能です。

## 具体的なフレームセマンティクス

ここでは、同じトランジションをより詳細に、フェーズごとに説明します。検証 (validate)、承認 (approve)、決済 (settle) です。

### VERIFYフェーズ

VERIFYは読み取り専用です。各UTXOフレームについて:

1.  各アクターについて、トランザクションの署名リスト (transaction’s signature list) 内のフレームに対する署名をチェックします。
2.  少なくとも1つ存在する必要がある各入力について:
    -   `creation_block`のオープニングルート (openings root) を解決します。
    -   ルートに対するオープニングパス (opening path) を検証し、`index`を運ぶリーフ (leaf) を特定 (locate the leaf) します。
    -   そのオープニングから`source`、`value`、`recipient`を読み取り、`recipient`がアクターのいずれかであることを要求します。
    -   その`index`の使用済みビット (spent bit) が未設定 (unset) であることを要求します。
3.  各出力について:
    -   `recipient != address(0)`であることを要求します。
4.  `change_index`によって選択された変更エントリ (change entry) を除いて、保存ルール (conservation rule) をチェックします。
5.  手数料上限 (fee caps) をチェックします。
    -   エンベロープの`max_fee_per_gas`と`max_priority_fee_per_gas`は、署名された上限 (signed caps) 以下であること。
    -   `tx.gas_limit <= max_gas_limit`であること。

証明されたオープニング (proven opening) は、作成ブロックのツリーの1つのリーフです。

```
leaf = hash(index, source, recipient, value)
```

証人 (witness) はオープニングのフィールドとルートへのパス (path to the root) を提供します。

支払いは常に`opening -> openings_root`を証明します。検証者 (verifier) はリング (ring) からルートを読み取ります。しばらくして、バッチに封印される (sealed into a batch) と、支払い者はさらに1つのパス`openings_root -> batch_root`を追加し、検証者はそれをステート内のバッチルート (batch root) に対してチェックします。ベース証明は決して変更されません。リングを離れることはバッチパスを追加するだけであり、それは誰でも公開チェーンデータ (public chain data) から再構築できます。したがって、支払いは可変リングスロット (mutable ring slot) に依存することはなく、永久に有効に保つことができます。

### 承認

フレームが承認されると、プロトコルは1つのアトミックなステップを適用します。これは[[glossary/EIP-8250|EIP-8250 (キー付きNonce)]]が消費されたnonceを記録するのと同じ方法で、フレームのリバートジャーナル (revert journal) の外に記録されるため、後続のフレームの失敗によって元に戻すことはできません。

1.  各入力について、検証された`index`で使用済みビット (spent bit) をチェックし設定します。既に設定されている場合、フレームは失敗します。
2.  フレームの`payer`がゼロの場合、`payer = UTXO_VAULT`を設定します。そうでない場合、指定された支払い者が支払いを承認する必要があり、そうでない場合はトランザクションは無効です。

ここで使用済みビットを設定することで、一度だけ使用保証 (spend-once guarantee) が提供され、二重計上 (double-counting) が排除されます。このフレームまたは後続のフレームで重複する入力があった場合、設定されたビットを見て失敗します。したがって、支払いは承認されると最終的になり、後続のフレームがリバート (later frame reverts) しても変わりません。

### 決済

決済は承認されたすべてのフレームに対して実行され、VERIFYが既に支払い能力がある (solvent) ことを証明しているため、失敗することはありません。

1.  各入力の値でボールトからデビット (Debit the vault) します。
2.  各出力を作成します。`next_utxo_index`をインクリメント (increment next_utxo_index) し、ボールトにクレジット (credit the vault) し、`UtxoCreated`を発行 (emit UtxoCreated) します。お釣り出力は残余 (left-over) を受け取ります。
3.  `account_outs`を適用 (Apply account_outs) します。
4.  実際の手数料を支払います。ベースフィー (basefee) をバーン (burn the basefee) し、優先手数料 (priority fee) をプロポーザーに送ります。

検証はプロトコルステート (protocol state)、オープニングルート、ボールト自身の使用済みビットのみを読み取り、任意の口座状態 (arbitrary account state) は読み取らないため、UTXOフレームは検証が安価であり、公開[[glossary/Mempool|メムプール (Mempool)]]内の他のトランザクションと同様に安全に扱えます。これが、支払いが署名チェックであり、受信者コードが実行されない理由でもあります。コードが支払いの有効性を決定する場合、任意のストレージ書き込みによって[[glossary/Mempool|メムプール (Mempool)]]内の保留中の支払い (pending spends) が無効になる可能性があります。

## 第二のルール: トランジションを宣言し、実行しない

フレーム設計が機能するのは、トランジション全体を検査可能なデータとして宣言するためです。オペコードが失敗するのは、ガス支払い者が既に固定された後に実行されるコードであり、他のパーティに値をコミットする前に検査するオブジェクトを提供しないためです。フレームが成功するのは、トランジション全体を、プロトコルと将来のスポンサーが値が移動する前に検証できる、署名され、値を保存するデータとして表現するためです。

これが、ガスを保存ルールに含めることが重要であり、スポンサーシップがトラストレスになる理由です。「*このトランジションは値を保存するか？*」および「*この出力は私に返済するか？*」という決定点は、フレームを読み取ることで答えられ、何も実行することではありません。トランジションを静的に推論可能にすることが、両方の成功特性を不格好な回避策 (awkward workarounds) からクリーンなプリミティブ (clean primitive) に変えるものです。

**これでコア設計 (core design) は完了です。残りは実用的な詳細 (practical detail) です。受信者がUTXOを発見する方法、トークンがどのように適合 (tokens fit) するか、使用済みビットがステートツリー (state tree) のどこに存在 (spent bits live in the state tree) するか、そしてそのコスト (costs) はどうなるかです。**

## 発見

受信者は、`UTXO_VAULT`下のログを`topics[2]`に自身のアドレスがあるかどうかスキャン (scanning logs) することで、自身のUTXOを発見します。発行者と署名トピック（`topics[0] = UtxoCreated_sig`）の両方をチェックする必要があります。そうしないと、ボールト下の将来のログが一致を偽装 (spoof a match) する可能性があります。

> ステルス受信者 (stealth recipients) は例外です。[[glossary/ERC-5564|ERC-5564]]ステルスアドレス (stealth address) は支払いごとに新しく派生 (derived fresh per payment) するため、受信者は`topics[2]`で事前フィルタリング (pre-filter by topics[2]) できません。代わりにビュータグ (view tag) でスキャンします。

これは、この設計がプライバシー (privacy) に関して報われる点でもあります。`recipient`は単なるアドレスであるため、ステルスアドレスにすることができ、支払いが自己資金であるため、その新規アドレスはETHを保持したり、`tx.sender`として表示されたりする必要がありません。その結果、支払い間で受信者の非リンク性 (recipient unlinkability) が実現されます。送信者は依然として`topics[1]`を通じて公開されるため、送信者プライバシー (sender privacy) にはミキシング (mixing) などの別のメカニズムが必要です。

## トークン

ERC-20も、小さな拡張で機能します。オープニングには`token_address`が含まれ、ETHの場合は`address(0)`となります。グローバルインデックス (global index)、使用済みビットフィールド (spent bitfield)、オープニング証明 (opening proofs)、および発見 (discovery) は変更されません。なぜなら、インデックスはアセットに関係なくインデックスだからです。トークンは同じインデックス空間と約0.3バイトの同じ使用済みコスト (spent cost) を共有します。入力の`token_address`は、`source`や`value`と同様に、署名されるのではなく、証明されたオープニング (proven opening) から読み取られます。

作成は実際のトークンを預金します。`create(token, value, recipient)`は`transferFrom`で`value`を引き出し、実際に受け取った金額を記録 (records the amount actually received) するため、ボールトは常に借りているものを正確に保持します。ボールトはトークンごとのエスクロー (per-token escrow) となります。支払いは同じフレームですが、保存は**トークンごと**に強制されます。各トークンについて、入力はそのトークンの`utxo_outs`と`account_outs`をカバーする必要があり、`max_cost`ガス項はETHバケット (ETH bucket) にのみ適用されます。各トークンは独自の変更出力 (change output) を保持します。単一の支払いは複数のトークンを一度に運ぶことができますが、ボールトはエスクローであり交換所ではないため、一方を他方と交換 (swaps one for another) することはありません。

重要なことに、支払いフレームは外部トークン呼び出し (external token calls) を行いません。決済 (settlement) はボールトの内部会計 (vault’s internal accounting) を更新するだけです。使用済みビットを設定し、`UtxoCreated`ログを発行し、トークンの`account_out`については、受信者が後で個別の引き出し (separate withdraw) で引き出す内部残高 (internal balance) にクレジットします。したがって、純粋なUTXO-to-UTXOトークンフロー (pure UTXO-to-UTXO token flow) は、元の預金 (original deposit) 時に一度だけトークンコントラクト (token contract) に触れ、その後は二度と触れません。これにより、決済が失敗せず (settlement unable to fail)、VERIFYがプロトコルステートのみを読み取る (VERIFY reading only protocol state) 状態が維持されるため、トークン支払いはETH支払いと同じメムプール安全性 (mempool-safety) を継承し（「決済」を参照）、不正なトークン (misbehaving token) は自身の保有者にのみ影響を与える (affect its own holders) ことができます。トークンはアカウントをブロック (block accounts) する自由も保持します。ブロックされたアカウントはボールトに預金できません。

ガスはトークンが異なる唯一の場所です。ガスはETHで支払われるため、ETH UTXOのみが自身の支払いを自己資金で賄うことができます。したがって、トークンのみの支払い (token-only spend) は常にスポンサー付き (sponsored) である必要があります。支払い者がETHを立て替え、トークンで返済を受け取ります。

## 使用済みビットがステートツリーに存在する場所

[[glossary/EIP-7864|EIP-7864]]では、すべてのキーの最初のバイトは、それが保持するデータの種類を示す*ストレージタイプ (storage type)* です。アカウントヘッダー (account headers)、コントラクトコード (contract code)、ストレージ (storage)、そして使用済みビットフィールド (spent bitfield) のような将来のカテゴリのために予約されたものがあります。したがって、使用済みセットは独自のタイプを取得し、ハッシュ化 (hashing) ではなく**インデックスでキー付け (keyed by index)** します。

`index`はプロトコルが順番に (protocol in sequence) 割り当てるため、ツリーキーに直接マッピング (maps directly into the tree key) され、高位ビット優先 (high bits first) で、連続するUTXOは隣接 (consecutive UTXOs are adjacent) します。

```
index : uint64
  index & 0xFF        ->  リーフ内のどのビットか (リーフは256ビット)
 (index >> 8) & 0xFF  ->  ステム内のどのリーフか (ステムは256リーフを保持する)
  index >> 16         ->  ステム自体。タイプバイトの直後に配置される
```

1つの32バイトリーフは256個のフラグであり、1つのステムは256個のリーフであるため、単一のステムは65,536個の連続するUTXOをカバーし、ツリーの順序はインデックスの順序 (tree’s order is the index’s order) です。これは以前と同じ`spent_bits[index >> 8]`ワードです。インデックスがどのステム、どのリーフ、どのビットかを決定します。

残りのプロトコルステートは小さく、`next_utxo_index`は単一のカウンターであり、ボールトのアカウントヘッダー (vault’s account header) にその残高の隣に存在します。オープニングルートリング (openings-root ring) と封印されたバッチ (sealed batches) は境界付けられており (bounded)、ボールトのストレージ (vault’s storage) に留まることができます。

> **配置ルール:** システム割り当て (system-assigned) で、常に増加し (ever-growing)、一度書き込みセット (write-once set) は、独自のタイプバイトの下に、インデックスでキー付けされて属します。キーとしてのインデックスは、それを順序付けられ、バッチでの証明が安価 (ordered and cheap to prove in batches) に保ちます。これは[[glossary/Validity-Only-Partial-Statelessness|バリディティオンリー部分ステートレス性 (VOPS)]]ともうまく機能します。なぜなら、ストレージをナリファイア (nullifiers) や使用済みビット (spent bits) のような「特殊な」ステートから明確に分離する (cleanly separates storage from “special” state) からです。

## コスト

### 永続的なステート

| モデル | エントリごとのステート | 10億エントリの場合 | 使用後 |
| --- | --- | --- | --- |
| 新規アカウント / ホルダースロット | 約100～150 B | 約100～150 GB | リーフが残る |
| ネイティブUTXO | 約0.3 B | 約300 MB | 使用済みビットが残る |

永続的なステート (persistent state) を必要としない支払いワークロード (payment workloads) の場合、ネイティブUTXOはアカウントモデル (account model) よりも永続的なステートにおいて約2桁安価です。

## 例: アリスがUTXOでボブに支払う

アリスは10 ETHを持っており、ボブに1 ETHのUTXOを与えたいと考えています。ボブは`0xB0`です。

### 作成

アリスはボールトを呼び出します。

```
to:    UTXO_VAULT
value: 1 ETH
data:  create(recipient = 0xB0)
```

実行後:

```
UtxoCreated(
  addr   = UTXO_VAULT,
  topics = [UtxoCreated_sig, 0xA1, 0xB0],
  data   = (42, 1 ETH)
)
```

ステート変更:

```
next_utxo_index: 42 -> 43
Alice:           10 ETH -> 9 ETH - 実際の手数料
vault:           0 -> 1 ETH
```

ブロックの終わり:

```
openings_root_ring[N mod 8192] = openings_root_N
# リーフをコミット = hash(42, 0xA1, 0xB0, 1 ETH)
```

ボブのウォレットは、`topics[2] = 0xB0`である`UTXO_VAULT`下のログをフィルタリングし、オープニングを保存します。アリスからの帯域外メッセージは不要です。

### 支払い

3ブロック後、ボブはUTXOを使用します。彼はチャーリーに0.4 ETH、デイブに0.5 ETHを送り、残りの価値を手数料を引いた後、お釣りのUTXOとして受け取ります。

```
fee = gas_used * effective_gas_price
```

ビットコインと全く同じように、お釣りは新しい出力であり、残りのアカウント残高 (account balance) ではありません。その値は決済時に設定されます。

```
actors: [0xB0]

inputs: [
  {
    index: 42,
    creation_block: N,
    opening_path: ...
  }
]

utxo_outs: [
  { recipient: 0xC4, value: 0.4 ETH },
  { recipient: 0xD5, value: 0.5 ETH },
  { recipient: 0xB0, value: 0 }
]

account_outs: []
change_index: 2
payer: 0
```

どのノードでもフレームを提出できます。ボブのアカウント残高は決して触れられません。なぜなら、使用済みUTXOがトランジション全体に資金を提供するからです。

決済後:

```
spent bit 42:     0 -> 1
next_utxo_index:  43 -> 46
vault:            1 ETH -> 1 ETH - 手数料
```

チャーリー、デイブ、そしてボブのお釣りは、ボールトに裏付けられた3つの独立したUTXOとなります。アカウントステートは触れられません。

`account_outs`はオプションです。これはアカウントモデル (account model) への脱出ハッチ (escape hatch) です。純粋なUTXO-to-UTXO支払いはアカウントステートを残しません。

*7投稿 - 5参加者*

[トピック全文を読む](https://ethresear.ch/t/native-utxos-on-ethereum/25368)
