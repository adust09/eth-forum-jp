---
title: 'EIP-7002のLean検証: システムコール成功とFIFOリクエスト'
original_title: 'Lean verification of EIP-7002: system-call success and FIFO requests'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/lean-verification-of-eip-7002-system-call-success-and-fifo-requests/26180
author: skbaek
date: '2026-10-26'
category: Security
tags:
  - security
  - formal-verification
  - eip
  - evm
  - consensus
  - protocol-design
  - research
  - eip-7002
topic_id: '26180'
translated_at: '2026-10-27'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Lean verification of EIP-7002: system-call success and FIFO requests](https://ethresear.ch/t/lean-verification-of-eip-7002-system-call-success-and-fifo-requests/26180) — skbaek (2026-10-26)

プラハ以降、バリデータ退出および部分引き出しのための[[glossary/execution-layer|実行レイヤー]]リクエストは、`0x00000961Ef480Eb55e80D19ad83579A64c007002`にある504バイトのコントラクトを介して処理されます。このコントラクトはgeasアセンブラ用に手書きされたものです。すべてのブロックの終わりに、プロトコルはこれに対してシステムコールを行い、そのコールはコンセンサスにクリティカルです。[[glossary/EIP-7002|EIP-7002]]は、そのコールが失敗したブロックは無効化されることを要求しています。

私たちは[[glossary/Lean-4|Lean 4]]でデプロイされたランタイムバイトコードの2つのプロパティを証明しました。

1.  **システムコールは常に成功し、** コントラクトのストレージが何を保持していようとも、与えられた30,000,000ガス中、最大210,000ガスしか使用しません。
2.  **リクエストは到着した順序と全く同じ順序で処理されます。** コントラクトのデプロイ以降の任意の有効な履歴において、コミットされた[[glossary/submissions|提出]]は、発行された引き出しリクエストと、まだキューに残っているエントリを合わせたものと正確に一致します。

どちらのプロパティも、同じくLeanで書かれたEVMおよびブロック処理の実行可能セマンティクスであるJauneに対して記述されており、プラハ、大阪、BPO1、BPO2の[[glossary/fork|フォーク]]をカバーしています。証明は、Leanの標準的な3つの公理（`propext`、`Classical.choice`、`Quot.sound`）以外に公理を使用していません。

デプロイ前には、このコントラクトはすでに[4つの監査](https://github.com/ethereum/audits/tree/master/Pectra)と[ループ境界付きHalmosチェック](https://github.com/daejunpark/sys-asm-halmos)によって検証されていました。ここでの結果は、デプロイされたバイトコードとJauneのブロック処理を、正確なガス使用量で結びつけ、提出から配送までのリクエストを履歴全体にわたって追跡しています。

## システムコールは成功する

ステートメントは引用するのに十分なほど短いです。ストレージに関する前提条件はありません。

```
theorem checked_system_totality {benv : Benv} (fork : CoveredFork benv.stat.fork)
    (installed : benv.state.getCode withdrawalRequestPredeployAddress = Blanc.withdrawalRequestCode) :
    processCheckedSystemTransaction benv withdrawalRequestPredeployAddress [] =
      .ok ((systemProtocolPost benv).state, systemProtocolOutput benv) ∧
    (systemProtocolOutput benv).gasLeft = systemTransactionGas - systemProtocolGas benv ∧
    systemProtocolGas benv ≤ 210000
```

ここで[`processCheckedSystemTransaction`](https://github.com/skbaek/jaune/blob/ff22ec809b7431cc839738150495339ba3f3b6ca/Jaune/Transaction.lean#L2947)は、Jauneのブロック処理が使用するチェック済みシステムコールルーチンです。これは、コールがエラーなしで終了した場合にのみ`.ok`を返します。それ以外の場合はブロックを拒否します。したがって、対象[[glossary/fork|フォーク]]の下で、カノニカルコードがインストールされていれば、コールは成功します。そのガス費用`systemProtocolGas benv`は、状態から正確に計算され、210,000を超えることはありません。([`checked_system_totality`](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/SystemProtocol.lean#L247))

付随する定理は、対象[[glossary/fork|フォーク]]の下での有効な履歴がカノニカルコードをインストールし続けることを示しています。([`history_canonical_code`](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/BalanceHistory.lean#L244))

## リクエストは先入れ先出し (FIFO)

FIFO定理である[`history_fifo`](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/HistoryFifo.lean#L285)は、[`HistoryFifo history`](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/HistoryFifo.lean#L71)を結論付けています。

```
def HistoryFifo {cfg : ChainConfig} {checkpoint final : BlockChain}
    (history : ConfiguredHistoryTrace cfg checkpoint final) : Prop :=
  submissions history = emissions history ++ remainingQueue history
```

3つのリストはそれぞれ実行履歴から直接読み取られます。

-   [`submissions`](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/HistoryFifo.lean#L25)は、コントラクトへのコミットされたすべての[[glossary/submissions|提出]]コール（[[glossary/Transaction|トランザクション]]内からのコールを含む）を、その呼び出し元とコールデータとともにリストアップします。提出は、成功し、かつそれを囲むコールがロールバックしない場合にコミットされたとみなされます。
-   [`emissions`](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/HistoryFifo.lean#L44)は、ブロックが実際にアウトプットした引き出しリクエスト（リクエストタイプ1）を、ブロック順序および各ブロック内の順序でリストアップします。
-   [`remainingQueue`](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/HistoryFifo.lean#L64)は、コントラクトの最終ストレージから、保存されたヘッドポインタからテールまでのライブキューを読み取ります。

3つすべてが同じ76バイト形式（呼び出し元、公開鍵、金額）でレコードを生成するため、等価性はすべてのフィールドを比較します。この方程式はリストを比較するため、順序と多重度を尊重します。同じリクエストが2回提出されれば2回カウントされます。そして、すべての有効な履歴に対して成立するため、空の履歴から始めて、すべてのブロックの後に成立します。したがって、コミットされた提出が失われたり、重複したり、順序が変更されたり、提出される前に発行されたりすることはありません。

さらに2つの結果が、キューがどのように処理されるかを説明しています。

-   **サービスルール。** 各ブロックは、最初の`min(16, キュー長)`エントリを発行し、コミットされたすべての提出は、バイトコードが計算する手数料以上を支払いました。（この手数料は常にEIPの手数料と同じではありません。下記の「手数料」を参照してください。）([`block_word_fifo`](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/WordFifo.lean#L641))
-   **配送境界。** エントリがブロックBがリクエストを計算する際にキュー内で0ベースの位置qにあると仮定します。すると、それはBの\lfloor q/16 \rfloorブロック後に正確に発行されます（q < 16の場合はB自身で）。また、後続の提出がそれを遅らせることはできません。これは、その長さまで実行され、かつ前提条件を満たす履歴の任意の拡張において成立します。チェーンがそれらのブロックを生成することを主張するものではありません。([`block_word_delivery_from_deployment`](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/WordDelivery.lean#L398))

## FIFO定理が前提とすること

すべての履歴はJauneの設定されたブロック処理の下で有効です。各ブロックはまた、残高上限を満たします。ブロック前のすべての[[glossary/execution-layer|実行レイヤー]]残高と、ブロックの入ってくる[[glossary/Consensus-Layer|コンセンサス層]]引き出しクレジットの合計は、$2^{256}$ wei未満です。ハッシュの前提はありません。

残りの前提は3つのグループに分けられます。いくつかについては、プロトコルがシステムコールの呼び出し元として使用するシステムアドレス`0xfffffffffffffffffffffffffffffffffffffffe`（以下`0xff…fe`）に関するものです。

-   **デプロイ。** 履歴はコントラクト自身のデプロイから始まります。これは、カノニカルな作成コード、ゼロ値、十分なガス、アドレス衝突なしのカノニカルなCREATE[[glossary/Transaction|トランザクション]]を含むカンクンブロックです。そのブロックの残りの部分と、アクティベーションまでのすべてのブロックはカンクンを実行します。この期間中、ブロックの[[glossary/Transaction|トランザクション]]のいずれもシステムアドレスから送信されず（プロトコル自身のシステムコールは[[glossary/Transaction|トランザクション]]ではないため影響を受けません）、リバートするものであってもコントラクト作成がそこで実行されることはありません。デプロイ[[glossary/Transaction|トランザクション]]の直後にはシステムアドレスにコードがなく、その後の各ブロックはカノニカルな[[glossary/EIP-4788|EIP-4788]]ビーコンルートコードがすでに配置された状態で始まります。
-   **アクティベーション後。** すべてのブロックは、同じ有効なチェーン設定の下でプラハ、大阪、BPO1、またはBPO2を実行します。アクティベーション時、他の3つのシステムコントラクト（[[glossary/EIP-2935|EIP-2935]]、[[glossary/EIP-4788|EIP-4788]]、[[glossary/EIP-7251|EIP-7251]]）はカノニカルコードを保持しています。全体を通して、ブロック[[glossary/Transaction|トランザクション]]はシステムアドレスから送信されず、[[glossary/EIP-7702|EIP-7702]]承認はそれによって署名されず、リバートするものであってもコントラクト作成がそこで実行されることはありません。
-   **容量。** アクティベーション後のコミットされた[[glossary/submissions|提出]]は最大$2^{254}$件です。この上限は、証明中にカウンタとキューアドレスが256ビット算術でラップするのを防ぐためだけであり、コントラクトはそのような制限を強制しません。

コントラクトの開始状態は仮定されていません。[デプロイメントブリッジ](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/DeploymentHistory.lean#L77)がそれを証明します。アクティベーション時、コントラクトはカノニカルなランタイムとデプロイ後のストレージ（空のキュー、カウント、ヘッド、テールがゼロ、そして最初のシステムコールまで提出をブロックするインヒビター値である過剰な$2^{256}-1$）を保持しています。また、アクティベーション前に提出がコミットされなかったことも証明します。カンクンはコントラクトにシステムコールを行わないため、過剰はインヒビターに留まり、他の呼び出し元からのすべてのコールはリバートします。唯一導出されない開始事実は、システムアドレスにコードがないことです。デプロイではそれを確立できないため、デプロイ直後に仮定され、アクティベーションまで引き継がれます。

この条件は形式的なものではありません。[機械検証済み反例](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Composition/WithdrawalRequestDrainControl.lean#L599)では、システムアドレスにコードが配置され、ユーザー[[glossary/Transaction|トランザクション]]がそのコードをトリガーし、それが[[glossary/EIP-7002|EIP-7002]]を呼び出します。[[glossary/EIP-7002|EIP-7002]]は呼び出し元によってのみシステムコールを認識するため、このコールをシステムコールとして扱い、ブロックの実際のコールよりも前にキューを排出します。この反例は、デプロイからではなく、仮定されたデプロイ後の状態から開始する定理の以前の形式の他のすべての前提条件を満たしています。したがって、その以前の定理からこの条件を削除することはできません。ただし、この反例はカノニカルなデプロイから開始するものではなく、[[glossary/mainnet|メインネット]]がそのような状態に到達できることを示すものでもありません。

この定理は実行履歴に関するものであり、[[glossary/mainnet|メインネット]]の[[glossary/Transaction|トランザクション]]や[[glossary/State-Root|ステートルート]]を認証するものではありません。以前の形式については、関連論文の検証パッケージ（下記参照）が、プラハ前の最後のブロックであるブロック22,431,083で3つのRPCプロバイダーが報告した内容を記録しています。[[glossary/EIP-7002|EIP-7002]]のストレージはデプロイ後の状態のままで、空のキューとインヒビターにある過剰がありました。4つのシステムコントラクト（[[glossary/EIP-2935|EIP-2935]]、[[glossary/EIP-4788|EIP-4788]]、[[glossary/EIP-7002|EIP-7002]]、[[glossary/EIP-7251|EIP-7251]]）はそれぞれカノニカルコードを保持しており、システムアドレスにはコードがありませんでした。これらの観測は以前の形式の開始前提条件と一致しますが、認証された[[glossary/State-Root|ステートルート]]証明ではありません。どちらの形式を[[glossary/mainnet|メインネット]]に適用するかも、Jauneのイーサリアムへの忠実性に依存しており、これはフィクスチャテストによってサポートされていますが、これらの証明では確立されていません。

## 手数料

EIPは、無制限の整数に対する`fake_exponential`を指定しています。バイトコードはこれを256ビットワードで計算するため、オーバーフローする可能性があります。デプロイ前の2つの監査がこれを指摘しました。[Blackthorn L-8](https://github.com/ethereum/audits/blob/f4a9ecad63727076ada587c8ef35a3186ee60fcd/Pectra/2025_02_04_Final_Ethereum_Foundation_Collaborative_Audit_Report.pdf)と[Sigma Prime PEC-03](https://github.com/ethereum/audits/blob/f4a9ecad63727076ada587c8ef35a3186ee60fcd/Pectra/Sigma_Prime_Ethereum_Foundation_Pectra_System_Contracts_Bytecode.pdf)です。私たちは、バイトコードの手数料がEIPの手数料を超えることはなく、計算の中間値がラップしない場合にのみ両者が等しくなることを[証明しました](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/ExactFeeDomain.lean)。

このギャップは利用されうる可能性があります。[機械検証済み3ブロック履歴](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Composition/WithdrawalRequestFeeRefutation.lean#L1246)は、FIFO定理の以前の形式の前提条件を満たしていますが、EIPの手数料よりも少ない金額を支払った提出をコミットしています。したがって、すべての提出がEIPの手数料を支払ったという保証は偽となるため、FIFOの結果はバイトコードが計算する手数料を参照しています。ただし、この履歴はドレインの反例と同様に、カノニカルなデプロイから開始するものではありません。

また、[[glossary/mainnet|メインネット]]とはかけ離れています。この証拠は合成プラハチェーンを実行し、1ブロックで2,895件の提出があり、過剰が2,893に達します。このブロックのガス制限は$2^{29}$です。各提出は1 weiしか支払いません。なぜなら、ブロックの手数料は前のブロックによって残された過剰（ここではゼロ）によって設定され、その後、ターゲットの2を超える提出の数だけ過剰が増加するからです。次のブロックでの過少支払い提出は、$2^{245}$ wei（約$5.65\times10^{55}$ ETH）を支払いますが、これは[[glossary/mainnet|メインネット]]の全供給量よりもはるかに大きい初期割り当てからのものです。これは普遍的な手数料保証を反証しますが、そのような過少支払いが[[glossary/mainnet|メインネット]]で発生しうることを示すものではありません。

証明の範囲外での直接計算によると、2,892までのすべての過剰で両手数料は一致します。規模の例として、関連論文の検証パッケージは、2025年12月19日の[[glossary/mainnet|メインネット]]の過剰が666であったことを記録しています。Sigma Primeは、最適化またはより高いブロックガス制限によってオーバーフロー閾値に到達する可能性があると指摘しました。ただし、閾値に到達するだけでは十分ではありません。過剰が2,893の場合でも、バイトコードの低い手数料は約$3.2\times10^{55}$ ETHであるため、実際のどのアカウントもそれを支払うことはできません。

## この記事が言及しないこと

-   アムステルダムまたはそれ以降の[[glossary/fork|フォーク]]については何も言及していません。結果は、アクティベーション前にカンクンを実行し、アクティベーション後に4つの対象[[glossary/fork|フォーク]]を実行するブロックのみをカバーしています。
-   [[glossary/Consensus-Layer|コンセンサス層]]がリクエストをどのように処理するかについては何も言及していません。これには、呼び出し元がバリデータに対して行動する権利があるか、またはリクエストされた退出や引き出しがいつ完了するかは含まれません。
-   手数料パラメータが経済的に健全であるか、またはストレージの成長については何も言及していません。デキューされたスロットはストレージに残ります。
-   [[glossary/Transaction|トランザクション]]レベルの活性定理はありません。フレームレベルの定理は存在します。インヒビターがクリアされると、システムアドレス以外の呼び出し元からの提出は、EIPの手数料以上を支払い、56バイトの入力を持ち、静的ではなく、そのコストを2,300ガス以上超えるガスを持つ場合、正確なコストで成功します。EIPの手数料を支払うことはバイトコードの手数料もカバーするため、手数料の等価性は要求されません。これは、[[glossary/Transaction|トランザクション]]が承認または含まれるかについては何も言及していません。
-   [[glossary/EIP-7251|EIP-7251]]コントラクトに対応する全体性またはFIFO定理はありません。

## 証拠と成果物

上記のすべてのLeanの結果は、1つのソースリビジョンにあります。[Blanc `7954405c`](https://github.com/skbaek/blanc/tree/7954405cba63d64a3a4d9f11d59178d29320c6c8)と[Jaune `ff22ec80`](https://github.com/skbaek/jaune/tree/ff22ec809b7431cc839738150495339ba3f3b6ca)を使用し、Lean `v4.35.0`で動作します。上記の定理の他に、フレームレベルの[提出活性](https://github.com/skbaek/blanc/blob/7954405cba63d64a3a4d9f11d59178d29320c6c8/Blanc/Lift/WithdrawalRequest/NatLiveness.lean#L59)定理が含まれています。

ピン留めされたJauneの[README](https://github.com/skbaek/jaune/blob/ff22ec809b7431cc839738150495339ba3f3b6ca/README.md)は、`execution-specs`リリース`tests@v21.0.1`に対する厳格な現在の[[glossary/mainnet|メインネット]]フィクスチャレーンを報告しています。そのマニフェストの4,968ファイルすべてが、予想される失敗の許容なしにパスしています。これは、そのソースとフィクスチャのスナップショットに関する結果であり、すべてのイーサリアム実行挙動に関する主張ではありません。

公理監査は依存関係をゼロから追跡します。これは、`#print axioms`に[インポートされた帰納的報告バグ](https://github.com/leanprover/lean4/issues/15226)があり、報告の完全性に影響を与えるものの、カーネルの健全性には影響しないため、それに依存していません。監査は使用される公理を制限しますが、ステートメントが意図されたプロトコルプロパティを捉えていることを示すことはできません。

関連論文である[arXiv:2610.19764v1](https://arxiv.org/abs/2610.19764v1)は、8つのデプロイされたアーティファクトの中でこのコントラクト（§4.5と付録F.5）をカバーしています。この投稿は[[glossary/EIP-7002|EIP-7002]]のみをカバーしています。なぜなら、その失敗はブロックを無効化するからです。この論文は、コーパスの古いスナップショットに基づいています。[Blanc `5048a51f`](https://github.com/skbaek/blanc/tree/5048a51f)と[Jaune `2737c8eb`](https://github.com/skbaek/jaune/tree/2737c8eb)を使用し、Lean `v4.34.0`で動作します。ここでのFIFO定理は論文のものよりも新しく、デプロイからではなく、仮定されたデプロイ後の状態から開始しています。その検証パッケージ（Zenodo DOI [10.5281/zenodo.23351349](https://doi.org/10.5281/zenodo.23351349)）は、`leanchecker`リプレイと上記の[[glossary/mainnet|メインネット]]観測を含む、そのスナップショットのチェックを記録しています。

[[glossary/AI-agents|AIエージェント]]が私の指示の下で証明とステートメントを作成し、この投稿の草稿作成を支援しました。特にFIFO方程式における3つのリストの定義、前提条件、および[[glossary/mainnet|メインネット]]への接続に関する修正を歓迎します。

## 質問

1.  前提条件が見落としている、システムアドレスへのコードまたは[[glossary/Transaction|トランザクション]]への経路はありますか？
2.  将来の[[glossary/fork|フォーク]]のために、デプロイのためにバイトコードが最終化される前に検証することが最も価値のあるシステムコントラクトまたはプロパティは何ですか？また、クライアントチームがそれらの結果を使用するためにどのような証拠が必要ですか？
3.  [クライアントFVスレッド](https://ethresear.ch/t/formal-verification-of-execution-and-consensus-clients/25894)と[クライアントTCBスレッド](https://ethresear.ch/t/ethereums-tcb-part-1-the-client/26086)を追っている方へ: JauneはLeanにおける実行可能ELセマンティクスであり、上記のフィクスチャカバレッジを持ち、ここでの結果はJauneがクライアントと一致する限りにおいてのみ[[glossary/mainnet|メインネット]]に引き継がれます。Jauneはクライアントとどこで乖離する可能性があり、それを確認するために最初にどの挙動をテストしますか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/lean-verification-of-eip-7002-system-call-success-and-fifo-requests/26180)
