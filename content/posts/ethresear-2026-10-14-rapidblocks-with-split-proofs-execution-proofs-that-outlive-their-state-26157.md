---
title: '分割証明によるRapidblocks: ステートよりも長く存続する実行証明'
original_title: 'Rapidblocks with split proofs: execution proofs that outlive their state'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/rapidblocks-with-split-proofs-execution-proofs-that-outlive-their-state/26157
author: cskiraly
date: '2026-10-14'
category: Consensus
tags:
  - consensus
  - scaling
  - zk
  - proof-of-stake
  - protocol-design
  - execution-layer
  - statelessness
  - rapidblocks
topic_id: '26157'
translated_at: '2026-10-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Rapidblocks with split proofs: execution proofs that outlive their state](https://ethresear.ch/t/rapidblocks-with-split-proofs-execution-proofs-that-outlive-their-state/26157) — cskiraly (2026-10-14)

著者: [@cskiraly](https://ethresear.ch/u/cskiraly)

**TL;DR**

-   **[[glossary/Split-proofs|分割証明 (Split proofs)]]**: ブロックの[[glossary/execution-proof|実行証明]]は3つに分割されます。\\Pi\_Tは、ブロックの*[[glossary/inputs|入力 (inputs)]]*（読み取る値）で[[glossary/transactions|トランザクション]]を実行するとその[[glossary/outputs|出力 (outputs)]]が得られることを証明し、[[glossary/State-Root|ステートルート]]は指定しません。\\Pi\_\\mathrm{in}と\\Pi\_\\mathrm{out}は、[[glossary/inputs|入力 (inputs)]]と[[glossary/outputs|出力 (outputs)]]を[[glossary/State-Root|ステートルート]]に結びつけ、[[glossary/Merkle-work|Merkle作業]]です。
-   **コミットされた[[glossary/inputs|入力 (inputs)]]に対する証明**: [[glossary/header|ヘッダー]]はプリステートルートの代わりに[[glossary/inputs|入力 (inputs)]]にコミットするため、固定された[[glossary/transactions|トランザクション]]と[[glossary/context|コンテキスト]]に対して、\\Pi\_Tはそれらを見逃すあらゆる[[glossary/State-Root|ステート]]変更に対して[[glossary/slot|スロット]]をまたいで有効なままです。誰でも利用可能で正しく宣言されたブロックを証明できます。
-   **[[glossary/input-rule|入力ルール]]**: ブロックが「in」であるのは、その[[glossary/slot|スロット]]の値がそのブロックであり、その証明が有効であり、その[[glossary/inputs|入力 (inputs)]]がまだ最新であり（読み取ったものがその[[glossary/slot|スロット]]の直前の[[glossary/State-Root|ステート]]である）、その[[glossary/context|コンテキスト]]が[[glossary/horizon|ホライズン]]と一致する場合のみです。これは以前の投稿の*[[glossary/Hist|Histルール]]*を置き換えるものです。互換性はこのルールから生まれ、スキップされたブロックは、直接的または間接的に、それが変更したものを読み取るブロックのみを停止させることができます。
-   **2つのトラック**: *[[glossary/window-vote|ウィンドウ投票]]*は、[[glossary/State-Root|ステート]]を保持せずに[[glossary/inputs|入力 (inputs)]]をチェックする[[glossary/Ethereum-validator|イーサリアムバリデータ]]とともに、各[[glossary/slot|スロット]]でブロックに合意します。[[glossary/State-Root|ステートルート]]は、それ自体が[[glossary/recursive-proof|再帰的証明]]によって証明され、独自のトラックをたどります。
-   **後の証明[[glossary/round|ラウンド]]**: 投票は[[glossary/round|ラウンド]]Aで可用性について尋ね、d[[glossary/round|ラウンド]]後に証明について尋ねることができます。これはaをa+dに引き上げるように機能します。

私たちの[以前の投稿](https://ethresear.ch/t/rapidblocks-take-two-a-pipelined-consensus-for-independent-blocks/26152)では、[[glossary/Rapidblocks|Rapidblocks]]のためのパイプライン化された[[glossary/consensus|コンセンサス]]を設計しました。それは、[[glossary/slot|スロット]]ごとに1つの値を決定する*[[glossary/window-vote|ウィンドウ投票]]*と、それらの値を[[glossary/canonical-set|カノニカルセット]]に変える*[[glossary/Hist|Histルール]]*です。ブロックは以前のブロックのセットである[[glossary/Hist|Hist]]の[[glossary/State-Root|ステート]]に基づいて構築され、より新しい同時実行ブロックの[[glossary/filter|フィルター]]のみを尊重するため、ブロックをスキップしても[[glossary/reorg|リorg]]は発生しません。そこでは[[glossary/Ethereum-validator|イーサリアムバリデータ]]は、投票する前にすべてのブロックを再実行します。この投稿では、代わりに[[glossary/execution-proof|実行証明]]を検証する場合に何が変わるかを問いかけます。

私たちの答えは、*[[glossary/Split-proofs|分割証明 (Split proofs)]]*と呼ぶもので、証明を3つに分割し、ブロックの[[glossary/inputs|入力 (inputs)]]（読み取る値）にコミットさせることです。そのように作成された証明は、それらの[[glossary/inputs|入力 (inputs)]]を見逃すあらゆる[[glossary/State-Root|ステート]]変更に対して、[[glossary/slot|スロット]]をまたいで有効なままです。これにより、ブロックは、その[[glossary/inputs|入力 (inputs)]]がまだ最新である限り、周囲で何が起こっても有効なままです。これは、証明を変更するよりも[[glossary/Rapidblocks|Rapidblocks]]のブロックモデルをより多く変更し、ブロックに関する合意を[[glossary/State-Root|ステートルート]]に関する合意よりも先行させることができます。私たちは[[glossary/Devconnect-Argentina|Devconnect Argentina]]周辺の人々とこれらのアイデアについて議論し始め、この投稿はそれ以来私たちが到達した場所です。これはアイデアの投稿です。ブロックレベルのルールは小さな実行可能モデルでプロパティテストに合格し、[[glossary/slot|スロット]]間の依存関係に抽象化された[[glossary/inputs|入力 (inputs)]]を持つ投票モデルは、小さなインスタンスの境界チェックに合格しますが、そのいずれも証明されておらず、設計自体の[[glossary/simulation|シミュレーション]]や測定はまだなく、最後の未解決の質問は現実のものです。

以前の投稿の[[glossary/parameter|パラメータ]]を使用します。[[glossary/slot|スロット]] \\tau、ネットワーク境界 \\Delta = \\tau/4、[[glossary/window|ウィンドウ]] L、ブロックの[[glossary/header|ヘッダー]]投票から[[glossary/body|ボディ]]投票までの[[glossary/round|ラウンド]] a、および投票[[glossary/vote-cadence|ケイデンス]] m。作業値は \\tau = 2 s、\\Delta = 0.5 s、L = 4、a = 1、m = 1です。

## ブロックごとの1つの証明はチェーンにならない

[[glossary/Rapidblocks|Rapidblocks]]では、ブロックbは[[glossary/Hist|Hist]]後の[[glossary/State-Root|ステート]]で実行されます。これは通常、チェーン内のbの直前の[[glossary/State-Root|ステート]]ではありません。

-   典型的な1[[glossary/slot|スロット]]パイプラインでは、b\_{j+2}は[[glossary/slot|スロット]]jまでのすべてに基づいて構築されますが、チェーンではb\_{j+1}の後に実行されます。
-   決定が遅い場合、\\mathrm{Hist}(b)はチェーンのプレフィックスである必要さえありません。その場合、bが実行される[[glossary/State-Root|ステート]]は、チェーンが持つことのない[[glossary/State-Root|ステート]]です。

したがって、「[[glossary/State-Root|ステートルート]]rを持つ[[glossary/State-Root|ステート]]で実行されたbは、[[glossary/State-Root|ステートルート]]r'を与える」というモノリシックな証明は、間違った[[glossary/State-Root|ステート]]に関するものです。その[[glossary/producer|プロデューサー]]は、チェーンが持つことのない[[glossary/State-Root|ステート]]のルートを必要とし、チェーン自体のルートは、そこで実行された[[glossary/State-Root|ステート]]でbが再度証明される必要があります。再実行する[[glossary/Ethereum-validator|イーサリアムバリデータ]]はこれを回避します。同時実行ブロックが何も書き込まなかったブロックは、どちらの[[glossary/State-Root|ステート]]でも同じように実行されるため、[[glossary/slot|スロット]]順にチェーンを実行できます。証明はまさにそれを述べるべきです。

## 証明を3つに分割する

ブロックbの場合:

-   **[[glossary/inputs|入力 (inputs)]]** I(b): 以前の投稿と同様に、bの前にA(b)のキー（[[glossary/credits|クレジット]]を除く、bが読み書きするすべて）の値。[[glossary/account|アカウント]]が[[glossary/credits|クレジット]]のみを扱う場合、[[glossary/inputs|入力 (inputs)]]は最大でもその[[glossary/status|ステータス]]であり、実行がそれに依存する場合のみです。つまり、[[glossary/account-exists|アカウントの存在]]と[[glossary/account-empty|アカウントの空状態]]の確認です（質問4）。
-   **[[glossary/outputs|出力 (outputs)]]** O(b): bが書き込む値。[[glossary/balance|残高]][[glossary/credits|クレジット]]の場合、追加される量。2つの同時実行ブロックが同じ[[glossary/fee-recipient|フィーレシーピエント]]に支払うことができ、それらの[[glossary/credits|クレジット]]は合計されます。
-   [[glossary/transactions|トランザクション]] T(b)と[[glossary/context|コンテキスト]] X(b)。[[glossary/slot|スロット]]と[[glossary/fee-recipient|フィーレシーピエント]]は[[glossary/header|ヘッダー]]から取得されます。[[glossary/base-fee|ベースフィー]]と[[glossary/block-hashes|ブロックハッシュ]]は、同時実行ブロックに依存しないように、[[glossary/horizon|ホライズン]]（決定された過去）から取得されます。[[glossary/randomness|ランダム性]]と[[glossary/System-contract|システムコントラクト]]には、まだそのようなルールが必要です（質問8）。

| 証明 | ステートメント | [[glossary/State-Root|ステートルート]] |
| --- | --- | --- |
| \Pi_T | [[glossary/transactions|トランザクション]] T(b)を[[glossary/context|コンテキスト]] X(b)で[[glossary/inputs|入力 (inputs)]] I(b)で実行すると、これらの[[glossary/receipts|レシート]]とこの[[glossary/gas|ガス]]とともに[[glossary/outputs|出力 (outputs)]] O(b)が得られる | なし |
| \Pi_\mathrm{in} | [[glossary/inputs|入力 (inputs)]]は[[glossary/State-Root|ステート]] \\sigma の値である | \\sigma |
| \Pi_\mathrm{out} | [[glossary/outputs|出力 (outputs)]]を \\sigma に適用すると \\sigma' が得られる | \\sigma, \\sigma' |

モノリシックな証明はそれらの合成です。[[glossary/Split-proofs|分割証明 (Split proofs)]]はそれらを分離します。\\Pi\_Tは高価な部分、[[glossary/EVM|EVM (イーサリアム仮想マシン)]]です。\\Pi\_\\mathrm{in}と\\Pi\_\\mathrm{out}は[[glossary/Merkle-work|Merkle作業]]です。[[glossary/multiproofs|マルチプルーフ]]、またはそれらに対する[[glossary/SNARKs|SNARKs]]です。

\\Pi\_Tは完全かつ[[glossary/binding|バインディング]]でなければなりません。[[glossary/gas|ガス]]のみが依存する[[glossary/state-read|ステート読み取り]]を含む、実行が依存するすべての[[glossary/state-read|ステート読み取り]]はI(b)に含まれている必要があります。[[glossary/prover|プルーバー]]では、これは追加の証明ではなくルールです。ゲストは、ブロック前の[[glossary/State-Root|ステート]]のすべての[[glossary/lookup|ルックアップ]]をI(b)から提供し、キーがその範囲外にある場合はゼロをデフォルトにする代わりに中止します。ブロック内の後の読み取りは、それ自身の書き込みから取得され、[[glossary/SSTORE|SSTORE (EVMオペコード)]]の元の値は[[glossary/transactions|トランザクション]]ごとに追跡されます。ゲストは、すべてのエントリを使用したこともチェックする必要があります。これにより、I(b)の[[glossary/padding|パディング]]によって[[glossary/witnesses|証人 (witnesses)]]が肥大化することはありません。存在しないキーと、ブロックが[[glossary/hash|ハッシュ]]で呼び出す[[glossary/bytecode|バイトコード]]には、それぞれ独自のエントリが必要です。その[[glossary/inputs|入力 (inputs)]]、[[glossary/outputs|出力 (outputs)]]、および[[glossary/filter|フィルター]]は、[[glossary/header|ヘッダー]]がコミットするものと一致する必要があります。[[glossary/header|ヘッダー]]は、プリ[[glossary/State-Root|ステートルート]]の代わりにI(b)にコミットし、[[glossary/body|ボディ]]は値とその[[glossary/witnesses|証人 (witnesses)]]を運びます。\\Pi\_Tはブロックが読み書きするキーを出力するため、ブロックの[[glossary/filter|フィルター]]も固定されます。これにより、[[glossary/producer|プロデューサー]]は、書き込みよりも多いまたは少ない[[glossary/filter|フィルター]]を主張することはできません。証明が公開されれば、誰でも[[glossary/header|ヘッダー]]と証明から、[[glossary/body|ボディ]]なしでそれをチェックできます。

ブロックは読み取った値を公開する必要があります。[[glossary/EIP|EIP（Ethereum 改善提案）]]-[[glossary/EIP-7928|EIP-7928]]のブロックレベル[[glossary/access-list|アクセスリスト]]は、読み取ったキーを値なしで記録し、[[glossary/balance|残高]]をポスト[[glossary/balance|残高]]として記録します。[[glossary/inputs|入力 (inputs)]]にコミットするには、読み取った値と[[glossary/delta|デルタ]]（[[glossary/credits|クレジット]]の場合）が必要です。

**誰でも利用可能なブロックを証明できます。** \\Pi\_Tは、[[glossary/transactions|トランザクション]]、[[glossary/inputs|入力 (inputs)]]、および[[glossary/context|コンテキスト]]のみを必要とします。これらはすべて[[glossary/body|ボディ]]が公開されれば公開されます。さらに、ブロックが呼び出す[[glossary/bytecode|バイトコード]]は[[glossary/witnesses|証人 (witnesses)]]とともに伝送されるか、[[glossary/State-Root|ステート]]から取得されます。したがって、どの[[glossary/prover|プルーバー]]でも、[[glossary/producer|プロデューサー]]だけでなく、正しく宣言されたブロックを証明できます。宣言された[[glossary/outputs|出力 (outputs)]]が間違っている場合、証明は存在せず、ブロックは除外されます。ブロックが宣言どおりに実行されるかどうかは、[[glossary/delayed-execution|遅延実行]]と同様に、利用可能なデータに依存します。時間内にそれを証明することは、[[glossary/producer|プロデューサー]]に関する仮定ではなく、[[glossary/prover|プルーバー]]に関する仮定です。

## [[glossary/inputs|入力 (inputs)]]にコミットする

\\Pi\_TはI(b)を介してのみ[[glossary/State-Root|ステート]]を読み取ります。したがって、固定された[[glossary/transactions|トランザクション]]と[[glossary/context|コンテキスト]]に対して、bが読み取るキーについてI(b)と一致するすべての[[glossary/State-Root|ステート]]で有効です。

[![image](https://ethresear.ch/uploads/default/optimized/3X/b/8/b818c16f653ca51b26e3ad8be734f1d7e235f732_2_690x434.png)](https://ethresear.ch/uploads/default/original/3X/b/8/b818c16f653ca51b26e3ad8be734f1d7e235f732.png "image")

*図1: b\_{j+2}はb\_j後の[[glossary/State-Root|ステート]]に基づいて構築されましたが、チェーンではb\_{j+1}の後に実行されます。2つの[[glossary/State-Root|ステート]]はyのみが異なりますが、b\_{j+2}はyを読み取らないため、その[[glossary/inputs|入力 (inputs)]]に対する証明は両方で有効です。*

これは異なる有効性ルール、すなわち*[[glossary/input-rule|入力ルール]]*を示唆しています。

> **ブロックが「in」であるのは、その[[glossary/slot|スロット]]の値がそのブロックであり、その証明が有効であり、その[[glossary/inputs|入力 (inputs)]]が最新であり（読み取ったものがその[[glossary/slot|スロット]]の直前の[[glossary/State-Root|ステート]]である）、その[[glossary/context|コンテキスト]]が[[glossary/horizon|ホライズン]]と一致する場合のみです。**

[[glossary/Hist|Histルール]]の下では、b\_jが「in」であるのは、以下の条件を満たす場合です。

-   その[[glossary/slot|スロット]]の値がb\_jである。
-   その[[glossary/Hist|Hist]]内のすべてが「in」である。
-   その[[glossary/window|ウィンドウ]]より前にすでに「in」であるすべてのブロックがその[[glossary/Hist|Hist]]に含まれている。
-   すでに「in」である同時実行ブロックと互換性がある。

[[glossary/input-rule|入力ルール]]は、最初の条件を除いてこれらすべてを置き換えます。これはブロックレベルでの[[glossary/optimistic-concurrency-control|楽観的並行性制御]]であり、値によって検証されます。ブロックは、その[[glossary/inputs|入力 (inputs)]]が「in」である以前のブロックによって生成された[[glossary/State-Root|ステート]]と等しい場合にのみコミットされます。

-   **互換性はこのルールから生まれます。** 「in」である同時実行の以前のブロックが、bが読み取るキーをbの場所で異なる値で残した場合、bは「out」です。以前の[[glossary/slot|スロット]]が依然として勝ちますが、チェックは値に対して行われます。
-   **スキップは読み取りに沿って伝播します。** [[glossary/Hist|Histルール]]の下では、b\_5が投票で除外された場合、その[[glossary/Hist|Hist]]にb\_5が含まれるすべてのブロックも除外されます。ここでは、スキップは、b\_5が変更したキーの値を、直接的またはそれが影響する他のブロックを介して読み取るブロックのみに影響を与える可能性があり、正確な[[glossary/inputs|入力 (inputs)]]チェックによってどれが除外されるかが決定されます。つまり、読み取った値が現在異なるブロックが除外されます。b\_5に基づいて構築されたが、直接的または推移的に何も変更しなかった[[glossary/producer|プロデューサー]]は、そのブロックを保持します。
-   **証明は作成された[[glossary/State-Root|ステート]]よりも長く存続します。** [[glossary/transactions|トランザクション]]と[[glossary/context|コンテキスト]]が固定されている場合、同時実行ブロックによる変更、[[glossary/producer|プロデューサー]]が構築したブロックのドロップ、または古い[[glossary/State-Root|ステート]]からの変更など、その[[glossary/inputs|入力 (inputs)]]を見逃すあらゆる変更に対して有効です。これが、1つの証明が複数の[[glossary/slot|スロット]]を通じて有効なままである理由です。
-   **同じ値の書き込みは競合しません。** 実行は読み取られた値にのみ依存します。同時実行ブロックがbが読み取った値を書き込んだ場合、bは同じように実行されます。
-   **正確なセット。** [[glossary/filter|フィルター]]テストが参照に対して行われる場合（質問6）、[[glossary/filter|フィルター]]ヒットは[[glossary/producer|プロデューサー]]へのガイダンスとなり、有効性の条件ではなくなります。また、偽陽性によってブロックが無効になることもなくなります。いずれにせよ、[[glossary/filter|フィルター]]は、[[glossary/body|ボディ]]が到着する前に、ブロックが何を修正するかを次の[[glossary/producer|プロデューサー]]に早期に知らせる役割を維持します。
-   **[[glossary/execution-layer|実行レイヤー]]は[[glossary/DAG|DAG (有向非巡回グラフ)]]を必要としません。** [[glossary/slot|スロット]]を順番に処理し、決定された各ブロックを適用します。その\\Pi\_Tが検証され、[[glossary/inputs|入力 (inputs)]]と[[glossary/context|コンテキスト]]が一致するものです。その他の[[glossary/slot|スロット]]は空のままです。[[glossary/Hist|Hist]]と参照は[[glossary/producer|プロデューサー]]にとって有用なままですが、[[glossary/filter|フィルター]]テストが参照に対して残る場合を除き（質問6）、有効性はもはやそれらに依存しません。

[![image](https://ethresear.ch/uploads/default/optimized/3X/0/6/06528b4d34f49a08f316e540e0f4b845fb2ba2dc_2_690x489.png)](https://ethresear.ch/uploads/default/original/3X/0/6/06528b4d34f49a08f316e540e0f4b845fb2ba2dc.png "image")

*図2: b\_5が投票で除外されました。[[glossary/Hist|Histルール]]の下では、[[glossary/Hist|Hist]]にb\_5が含まれるすべてのブロックも除外されます。[[glossary/input-rule|入力ルール]]の下では、b\_7のみが除外されます。なぜなら、b\_5がxに書き込んだ値を読み取ったためであり、他のブロックは何も提供しないからです。b\_8はb\_5に基づいて構築されましたが、yのみを読み取ったため、残ります。その他の[[glossary/Hist|Hist]]エッジは省略されています。*

これらはいずれも証明を必要としません。再実行する[[glossary/Ethereum-validator|イーサリアムバリデータ]]は、ブロックが読み取った値にコミットする限り、同じルールを適用できます。証明はそれを[[glossary/stateless|ステートレス]]にします。

## ブロックは今、[[glossary/State-Root|ステートルート]]は後で

分割により、ブロックに関する合意と[[glossary/State-Root|ステートルート]]に関する合意は2つのトラックに分かれます。これは、[[@fradamt](https://ethresear.ch/u/fradamt)の[[glossary/decoupled-consensus|デカップリングされたコンセンサス]]（利用可能なチェーンを[[glossary/finality|ファイナリティ]]から分離するもの）とは異なる分割であり、両者は直交しています。

-   **ブロックトラック、各[[glossary/slot|スロット]]ごと。** これは[[glossary/window-vote|ウィンドウ投票]]を適応させたものです。[[glossary/round|ラウンド]]Aで、[[glossary/voter|投票者]]は以下をチェックします。

    -   [[glossary/header|ヘッダー]]が適時であったこと。
    -   [[glossary/body|ボディ]]が利用可能であり、その[[glossary/inputs|入力 (inputs)]]に対する[[glossary/Merkle-witness|Merkle証人]]があること（下記参照）。
    -   \\Pi\_Tが有効であること。
    -   [[glossary/inputs|入力 (inputs)]]が最新であること。

    [[glossary/voter|投票者]]は最後のチェックのために[[glossary/State-Root|ステート]]を必要としません。ブロックが読み取る各キーについて、その値は、[[glossary/voter|投票者]]の値によって「in」である[[glossary/window|ウィンドウ]]内の最後の書き込みブロックから取得されます。[[glossary/voter|投票者]]はそれをそのブロックの[[glossary/access-list|アクセスリスト]]から読み取ります。それ以外の場合は、[[glossary/horizon|ホライズン]]（L+1[[glossary/slot|スロット]]前）の[[glossary/State-Root|ステート]]から、そのルートに対する[[glossary/Merkle-witness|Merkle証人]]とともに取得されます。[[glossary/balance|残高]]の場合、値は[[glossary/window|ウィンドウ]]内で最後に書き込まれたポスト[[glossary/balance|残高]]、または存在しない場合は[[glossary/horizon|ホライズン]]の値に、それ以降の[[glossary/credits|クレジット]]を加えたものです。このチェックは\\Pi\_\\mathrm{in}であり、[[glossary/voter|投票者]]自身が行うため、誰も事前にそれを証明する必要はありません。

-   **[[glossary/State-Root|ステート]]トラック、[[glossary/horizon|ホライズン]][[glossary/slot|スロット]]ごと。** [[glossary/horizon|ホライズン]]までのプレフィックスが決定されると、1つの正しいルート \\sigma\_Hが固定されます。ルートは[[glossary/canonical-outputs|カノニカル出力]]に対する\\Pi\_\\mathrm{out}から取得されます。これは、最後の[[glossary/finalized-root|ファイナライズされたルート]]からの[[glossary/recursive-proof|再帰的証明]]であり、決定されたプレフィックスに[[glossary/binding|バインド]]されているため、[[glossary/stateless-voter|ステートレス投票者]]は\\sigma\_H自体をチェックできます。[[glossary/Checkpoint|チェックポイント]]は最新の証明済みルートを運び、[[glossary/finality|ファイナリティ]]がそれをカバーし、[[glossary/recursion|再帰]]がベースを持ちます。ルートは[[glossary/MEV|MEV（最大抽出可能価値）]]を運びません。[[glossary/State-Root|ステート]]を持つ人、または更新されるキーの[[glossary/witnesses|証人 (witnesses)]]を持つ人は誰でもそれらを証明できます。

[[glossary/slot|スロット]]jの[[glossary/round|ラウンド]]Aは、[[glossary/slot|スロット]]j - L - 1のルートを必要とします。その[[glossary/slot|スロット]]の開始から数えて、[[glossary/State-Root|ステート]]トラックはそれまで(L+1+a)\\tau + \\Delta - Dの時間を持ちます。ここでDは、その[[glossary/slot|スロット]]までのプレフィックスが決定されるまでの時間です。

-   (L+a)\\tau - \\Delta = 9.5 s（典型的な決定は6\\Delta）
-   a\\tau + 2\\Delta = 3 s（決定が[[glossary/deadline|デッドライン]]までかかる場合、(L+1)\\tau - \\Delta）

その時間は、ルートを[[glossary/voter|投票者]]に届ける時間もカバーする必要があり、それ以前のルートが完了していることを前提としています。[[glossary/State-Root|ステート]]トラックがさらに遅れる場合、[[glossary/header|ヘッダー]]は、その[[glossary/witnesses|証人 (witnesses)]]が対抗するルート、つまり[[glossary/horizon|ホライズン]]以前の証明済みルートを指定できます。[[glossary/voter|投票者]]は、そのルート以降の「in」ブロックの[[glossary/access-list|アクセスリスト]]を追加します。したがって、遅い[[glossary/State-Root|ステート]]トラックは、[[glossary/deadline|デッドライン]]に間に合う限り、[[glossary/round|ラウンド]]Aでの[[glossary/lookup|ルックアップ]]コストを発生させますが、ブロックの[[glossary/liveness|ライブネス]]は犠牲になりません。遅れるのは、[[glossary/finalized-root|ファイナライズされたルート]]がどこまで到達するかです。

[![image](https://ethresear.ch/uploads/default/optimized/3X/c/5/c502400c0cbf616cc4cd8f2b31c708856cef1d5e_2_690x398.png)](https://ethresear.ch/uploads/default/original/3X/c/5/c502400c0cbf616cc4cd8f2b31c708856cef1d5e.png "image")

*図3: [[glossary/slot|スロット]]jの[[glossary/round|ラウンド]]Aは、[[glossary/slot|スロット]]H = j - L - 1後のルート \\sigma\_Hと、その間のL[[glossary/slot|スロット]]の[[glossary/access-list|アクセスリスト]]に対して[[glossary/inputs|入力 (inputs)]]をチェックします。バーは、Hまでのプレフィックスの決定からその[[glossary/round|ラウンド]]までの[[glossary/State-Root|ステート]]トラックの時間です。*

## 投票における変更点

[[glossary/window-vote|ウィンドウ投票]]は、[[glossary/slot|スロット]]ごとに1つの値を決定し、依存関係は[[glossary/feasibility-check|実現可能性チェック]]に任せます。これは変わりません。変わるのは依存関係です。ブロックは、それが読み取るキーを変更した、または変更する可能性のある以前の[[glossary/window|ウィンドウ]][[glossary/slot|スロット]]すべてに依存するようになりました。つまり、その[[glossary/inputs|入力 (inputs)]]が最新であるかどうかに影響を与える可能性のある[[glossary/slot|スロット]]です。通常、これらは次のとおりです。

-   **in**: 読み取ったブロックの場合。
-   **out**: 読み取ったものを上書きするブロックの場合。

別のブロックが同じ値を書き込む可能性があるため、これらは待つべき[[glossary/slot|スロット]]であり、ブロックが必要とする結果ではありません。正確な[[glossary/inputs|入力 (inputs)]]チェックが決定します。[[glossary/voter|投票者]]は、[[glossary/window|ウィンドウ]]ブロックの[[glossary/access-list|アクセスリスト]]から、または[[glossary/body|ボディ]]が不足しているブロックの[[glossary/filter|フィルター]]からこれらの[[glossary/slot|スロット]]を見つけます。これは[[glossary/slot|スロット]]を追加するだけです。

実現可能性は、[[glossary/voter|投票者]]自身の値の下での[[glossary/inputs|入力 (inputs)]]チェックになります。[[glossary/closure|クロージャ]]は、ブロックが依存するすべての[[glossary/slot|スロット]]を待つ必要があります。[[glossary/round|ラウンド]]の投票は、それらの[[glossary/slot|スロット]]のそれぞれが、少なくともm[[glossary/round|ラウンド]]前に、いずれかの方法で確認された場合にのみブロックを確認します。その後、正確な[[glossary/inputs|入力 (inputs)]]チェックが決定します。

正直な[[glossary/producer|プロデューサー]]は、確認済みのブロックからのみ読み取ります。[[glossary/window-vote|ウィンドウ投票]]の適時性ルールにより、[[glossary/producer|プロデューサー]]はブロックを固定するまでに「in」になる可能性のあるすべての[[glossary/header|ヘッダー]]を保持します。確認されていない各ブロックのキーは避けます。[[glossary/access-list|アクセスリスト]]があればそれを使用し、なければ[[glossary/filter|フィルター]]を使用します。したがって、正直なブロックは確認済みの[[glossary/slot|スロット]]にのみ依存します。以前の投稿では、正直なブロックは決してドロップされないと主張しています。それは、ブロックが構築も参照もしない以前のブロックとの競合という1つのギャップを挙げており、その[[glossary/feasibility-check|実現可能性チェック]]と[[glossary/closure|クロージャ]]はそれを無視していました。そして、そのモデルチェックがサポートする修正です。ここでは、両方とも[[glossary/inputs|入力 (inputs)]]チェックとともに提供され、その修正と同様に、[[glossary/closure|クロージャ]]は両方向で待機します。したがって、[[glossary/window-vote|ウィンドウ投票]]の仮定の下で、[[glossary/witnesses|証人 (witnesses)]]と証明が時間通りであれば、この議論は引き継がれるはずです。これらの仮定の中には、[[glossary/synchrony|同期性]]、すべての[[glossary/round|ラウンド]]での正直な多数派、m \\le a + 1、および[[glossary/deadline|デッドライン]]までに決定が確定することなどがあります。私たちはそれを証明していませんが、小さなモデルの境界チェックでは違反は見つかりません（質問3）。

**後の証明[[glossary/round|ラウンド]]。** 誰でも利用可能なブロックを証明できるため、投票は[[glossary/round|ラウンド]]Aで可用性について尋ね、d[[glossary/round|ラウンド]]後に証明について尋ねることができます。証明が検証されるまで、ブロックは利用可能ですが未証明です。確認できず、[[glossary/stateless-voter|ステートレス投票者]]は後のブロックをチェックするためにその[[glossary/outputs|出力 (outputs)]]を使用できません。その後、証明[[glossary/round|ラウンド]]はブロックの有効性[[glossary/round|ラウンド]]となり、aをa+dに引き上げるように機能します。[[glossary/window|ウィンドウ]]Lをdだけ増やすと、フォロー[[glossary/round|ラウンド]]が維持されます。Lを維持すると、それらのうち\\lfloor (L-a-d)/m \\rfloorが残り、[[glossary/window-vote|ウィンドウ投票]]の[[glossary/deadline|デッドライン]]見逃しに対する境界（\\beta^{1+\\lfloor (L-a)/m \\rfloor}、ここで\\betaは攻撃者の[[glossary/stake|ステーク]]の割合）が弱まります。確認も遅れるため、ブロックを実行する[[glossary/producer|プロデューサー]]が証明が到着する前にブロックに基づいて構築しない限り、より多くの[[glossary/slot|スロット]]が同時実行になります。彼らのリスクは、証明が[[glossary/round|ラウンド]]を逃した場合、ブロックが投票で除外され、そこから読み取ったブロックも除外される可能性があることです。正確な[[glossary/inputs|入力 (inputs)]]チェックが決定します。

## 関連研究

各要素には前例があります。それらがブロックレベルで組み合わされている例は見つかりませんでした。[Hyperledger Fabric](https://arxiv.org/abs/1801.10228)は、順序付け後に読み取りセットによって[[glossary/transactions|トランザクション]]の有効性をバージョンごとに決定し、[Aria](https://www2.cs.arizona.edu/~caolei/papers/Aria.pdf)の基本ルールは、1つの[[glossary/snapshot|スナップショット]]でバッチを実行し、以前の[[glossary/transactions|トランザクション]]が競合に勝つようにします。代わりに値によって検証することは、チェックが[[glossary/serialization-point|シリアライゼーションポイント]]で行われる場合に健全であり、[NOrec](https://www.cs.rochester.edu/u/scott/papers/2010_ppopp_NOrec.pdf)の値ベースの検証が示すように、同じ値の書き込みは競合を引き起こしません。[[glossary/zkEVM|zkEVM (ゼロ知識イーサリアム仮想マシン)]]はすでに[[glossary/State-Root|ステート]]アクセスを実行とは別に証明していますが、[PSE zkEVM](https://github.com/privacy-scaling-explorations/zkevm-specs/blob/master/specs/state-proof.md)のように2つのルート間の1つの証明内で証明しています。Zcashの[[glossary/spend|支出]]は以前の[[glossary/anchor|アンカー]]に対して証明され、ノードは[[glossary/nullifier|ナリファイア]]をチェックします（[Zebra](https://zebra.zfnd.org/dev/rfcs/0007-treestate.html)）。[Monad](https://docs.monad.xyz/monad-arch/consensus/asynchronous-execution)の提案は、3ブロック前の[[glossary/State-Root|ステートルート]]を運びます。この投稿に最も近いのは、[ブロックレベル[[glossary/access-list|アクセスリスト]]スレッド](https://ethresear.ch/t/block-level-access-lists-bals/22331)のState BALsバリアントで、実行を[[glossary/State-Root|ステート]]から切り離すために読み取った値を[[glossary/access-list|アクセスリスト]]に入れました。[[glossary/EIP|EIP（Ethereum 改善提案）]]-[[glossary/EIP-7928|EIP-7928]]はサイズのためにそれらを省略し、その[最初のドラフト](https://github.com/ethereum/EIPs/blob/1ee4cac92df6b6f18ff625b8f8f977bdc80d88d7/EIPS/eip-7928.md)の[[glossary/balance|残高]][[glossary/delta|デルタ]]はポスト[[glossary/balance|残高]]になりました。この提案は両方を元に戻す必要があります（質問2）。

## 未解決の質問

1.  **[[glossary/latency|レイテンシ]]の証明。** EFのリアルタイム証明目標は、P99で最大10秒以内に[[glossary/mainnet|メインネット]]ブロックを証明することであり、10万ドル未満、10kW未満のハードウェアで実現することです（[L1 zkEVMの出荷 #1](https://blog.ethereum.org/2025/07/10/realtime-proving)）。2025年12月には、[[glossary/zkVM|zkVM (Zero-Knowledge Virtual Machine)]]がブロックの99%をその目標時間内に証明したと報告されています（[#2](https://blog.ethereum.com/2025/12/18/zkevm-security-foundations)）。

    -   今日の[[glossary/gas-rate|ガスレート]]では、2秒のスライスはブロックの[[glossary/gas|ガス]]の約6分の1を運びます。
    -   ブロックを固定してから[[glossary/round|ラウンド]]Aまで、[[glossary/producer|プロデューサー]]はa\\tau + 2\\Delta = 3秒の時間があります。証明を出すために\\Deltaが確保されると約a\\tau + \\Delta = 2.5秒です。[[glossary/slot|スロット]]の2\\Delta後に[[glossary/body|ボディ]]を受け取る[[glossary/prover|プルーバー]]は、約a\\tau - 2\\Delta = 1秒、つまり目標時間の10分の1しかありません。
    -   [[glossary/trusted-setup|セットアップ]]、[[glossary/recursion|再帰]]、証明の出力など、証明ごとの[[glossary/fixed-costs|固定コスト]]は6倍の頻度で発生します。したがって、[[glossary/gas|ガス]]の6分の1はコストの6分の1ではありません。
    -   [[glossary/post-quantum-signatures|量子耐性署名 (post-quantum signatures)]]の場合と同様に、[[glossary/BLS|BLS (Boneh-Lynn-Shacham) 署名]]なしでは、[[glossary/window-vote|ウィンドウ投票]]の投票も[[glossary/recursive-proof|再帰的証明]]によって[[glossary/aggregation|集約]]されます。投票[[glossary/latency|レイテンシ]]全体（[[glossary/aggregation|集約]]と配信）は、安全のためにm = 1でm\\tau - 2\\Delta = 1秒以内に、パイプラインを維持するためにm\\tau - 3\\Delta = 0.5秒以内に収まる必要があります。ブロック証明と投票証明は[[glossary/slot|スロット]]を共有し、おそらく[[glossary/prover|プルーバー]]も共有します。

    \\Pi\_Tは[[glossary/round|ラウンド]]A、または1[[glossary/round|ラウンド]]後に、投票自身の証明と並行して、どのようなハードウェアで実行できるでしょうか？

2.  **クリティカルパスにおけるサイズ。** 読み取られた値は[[glossary/access-list|アクセスリスト]]自体を肥大化させます。State BALsの提案では、36M[[glossary/gas|ガス]]制限の最悪の場合で約1.51 MiB（0.93 MiBに対して）と見積もられています。[[glossary/witnesses|証人 (witnesses)]]はさらに追加されます。[[glossary/window|ウィンドウ]]の[[glossary/access-list|アクセスリスト]]がカバーしないすべての[[glossary/inputs|入力 (inputs)]]は、指定されたルートに対する[[glossary/witnesses|証人 (witnesses)]]を必要とし、それらのほとんどがそうである可能性があります。これらすべては[[glossary/body|ボディ]]内で、証明と共有される[[glossary/round|ラウンド]]Aの[[glossary/budget|予算]]内に収まります。[[glossary/prover|プルーバー]]は[[glossary/bytecode|バイトコード]]を必要とするため、[[glossary/bytecode|バイトコード]]はそのような[[glossary/witnesses|証人 (witnesses)]]の大部分を占めます。今日の[[glossary/Merkle-Patricia-Trie|マークルパトリシアトライ (MPT)]]と[[glossary/binary-tree|バイナリツリー]]（[[glossary/EIP|EIP（Ethereum 改善提案）]]-[[glossary/EIP-7864|EIP-7864]]）の場合、2秒のスライスでこれはどれくらいの大きさになるでしょうか？

3.  **これらの依存関係における安全性。** 以前の投稿のQuintモデルを、両方向の依存関係で拡張しました。ブロックの[[glossary/inputs|入力 (inputs)]]を、それが読み取った[[glossary/slot|スロット]]と、それを上書きする[[glossary/slot|スロット]]に抽象化しました。[[glossary/Apalache|Apalache]]は、2つの小さなインスタンスのいずれの実行でも[[glossary/safety-properties|安全性プロパティ]]の違反を見つけません。a = 1で4[[glossary/round|ラウンド]]にわたる3つの[[glossary/slot|スロット]]（3番目のブロックの[[glossary/round|ラウンド]]Aに到達するが、そのフォロー[[glossary/round|ラウンド]]には到達しない）、およびa = 2で後の証明[[glossary/round|ラウンド]]を持つ5[[glossary/round|ラウンド]]にわたる2つの[[glossary/slot|スロット]]です。どちらもm = 1です。モデルには[[glossary/equivocation|二重署名（equivocation）]]はなく、証明は後の[[glossary/round|ラウンド]]Aとしてのみ現れます。[[glossary/window-vote|ウィンドウ投票]]の[[glossary/lemma|補題]]は一般的に、そしてm = 2の場合にも成り立つでしょうか？

4.  **値ではない[[glossary/inputs|入力 (inputs)]]。** 一部の読み取りは[[glossary/predicate|述語]]です。例えば、[[glossary/account-exists|アカウントの存在]]または[[glossary/account-empty|アカウントの空状態]]（[[glossary/EIP|EIP（Ethereum 改善提案）]]-[[glossary/EIP-161|EIP-161]]）、[[glossary/contract-creation-target|コントラクト作成ターゲット]]が[[glossary/storage|ストレージ]]を持っているか（[[glossary/EIP|EIP（Ethereum 改善提案）]]-[[glossary/EIP-7610|EIP-7610]]）などです。ブロックはそれらにどのようにコミットすべきでしょうか、そしてどの[[glossary/credits|クレジット]]がそれらに依存するのでしょうか？[[glossary/fee-credit|フィークレジット]]の効果は[[glossary/recipient|受取人]]が存在するかどうかに依存しませんが、[[glossary/value-transfer|価値転送]]の[[glossary/gas|ガス]]は依存します。

5.  **[[glossary/granularity|粒度]]。** ブロックごとの[[glossary/inputs|入力 (inputs)]]は、ブロックをオールオアナッシングにします。[[glossary/transactions|トランザクション]]ごと、または[[glossary/Bundle|バンドル]]ごとの[[glossary/inputs|入力 (inputs)]]であれば、[[glossary/stale-input|陳腐化した入力]]はそれを読み取ったものだけをドロップします。\\Pi\_Tはそれを安価に証明できるでしょうか？

6.  **参照に対する[[glossary/filter|フィルター]]テスト。** 以前の投稿では、A(b)のキーが参照するブロックの[[glossary/filter|フィルター]]にヒットした場合、ブロックは無効でした。正確な[[glossary/inputs|入力 (inputs)]]チェックでは、そのルールが拒否し、[[glossary/inputs|入力 (inputs)]]チェックが拒否しないブロックは、[[glossary/filter|フィルター]]の偽陽性であり、[[glossary/inputs|入力 (inputs)]]を最新のままにする重複です。[[glossary/header|ヘッダー]]のみからのチェックはまだ価値があるでしょうか？

7.  **[[glossary/State-Root|ステートルート]]が到着する時期。** [[glossary/State-Root|ステートルート]]は、その[[glossary/slot|スロット]]までのプレフィックスが決定されると証明できます。通常、[[glossary/slot|スロット]]開始後約1.5[[glossary/slot|スロット]]、最大L+1[[glossary/slot|スロット]]に証明時間を加えた時間です。[[glossary/State-Root|ステートルート]]はいつ公開され、[[glossary/finality|ファイナリティ]]されるべきでしょうか、そして[[glossary/Light-Client-Protocol|ライトクライアントプロトコル]]はそれまで何を追跡するのでしょうか？また、[[glossary/header|ヘッダー]]の[[glossary/witness-root|証人ルート]]はどれくらい遡ることができるでしょうか？

8.  **[[glossary/context|コンテキスト]]と[[glossary/system-steps|システムステップ]]。** [[glossary/randomness|ランダム性]]、および[[glossary/EIP|EIP（Ethereum 改善提案）]]-7002や[[glossary/EIP|EIP（Ethereum 改善提案）]]-7251の[[glossary/request-queues|リクエストキュー]]のように、すべてのブロックで同じキーを読み書きする[[glossary/System-contract|システムコントラクト]]には、同時実行ブロックに依存しないルールが必要です。

9.  **誰が支払うか。** データが公開されたが投票で除外されたブロック、または証明が届かないブロックは、依然として[[glossary/Data-Availability|データアベイラビリティ]]を使用しており、証明には[[glossary/prover|プルーバー]]が必要です。\\Pi\_Tと\\Pi\_\\mathrm{out}の費用は誰が支払うのでしょうか、そして[[glossary/delayed-execution|遅延実行]]（[[glossary/EIP|EIP（Ethereum 改善提案）]]-[[glossary/EIP-7886|EIP-7886]]が提案）のように、費用は前払いされるべきでしょうか？

10. **スローモード。** ブロックは[[glossary/State-Root|ステートルート]]が証明される前に合意され、ブロックが宣言どおりに実行されるかどうかは利用可能なデータに依存します。したがって、証明が追いつかない場合でも、チェーンを停止させる必要はありません。[[glossary/window-vote|ウィンドウ投票]]は可用性を決定し続け、未証明のブロックが宣言する[[glossary/outputs|出力 (outputs)]]に対して、暫定的に現在の[[glossary/inputs|入力 (inputs)]]をチェックできます。確認と有効性は証明、または再実行を待つことになり、遅れているノードはゆっくりと追跡し、後でチェックできます。コストはリスクです。ブロックが証明されるまで、そこから読み取ったブロックはそれに依存し、[[glossary/Stateless-Clients|ステートレスクライアント]]は遅い証明と決して存在し得ない証明を区別できません。[[glossary/window|ウィンドウ]]を超えて伸びる証明[[glossary/deadline|デッドライン]]と、そこでまだ開いている有効性には、独自のルールが必要です。証明はどれくらい遅れてもよいのでしょうか、そしてそれを決定するのは何でしょうか？

## 今後の方向性

-   **[[glossary/partial-state-nodes|部分ステートノード]]。** [[glossary/voter|投票者]]と\\Pi\_T[[glossary/prover|プルーバー]]は独自の[[glossary/State-Root|ステート]]を保持せず、\\Pi\_\\mathrm{out}は更新するキーの[[glossary/witnesses|証人 (witnesses)]]のみを必要とします。したがって、[[glossary/State-Root|ステート]]の一部をそれぞれ保持するノードは、[[glossary/witnesses|証人 (witnesses)]]を提供し、[[glossary/State-Root|ステート]]トラックをそれぞれ自分の部分について証明できます。[[glossary/producer|プロデューサー]]はより困難です。なぜなら、ブロックのすべての[[glossary/inputs|入力 (inputs)]]は、[[glossary/producer|プロデューサー]]が保持しているか与えられたものに含まれている必要があるからです。501の[[glossary/mainnet|メインネット]]ブロックを最初の半分で[[glossary/contract|コントラクト]]をランク付けし、後半でカバー率を測定した最初の調査では、最も使用されている1,000の[[glossary/contract|コントラクト]]を保持する[[glossary/producer|プロデューサー]]は、[[glossary/transactions|トランザクション]]の75%を含めることができましたが、[[glossary/gas|ガス]]の43%しか含めることができませんでした（ユーザーが[[glossary/sender|送信者]]や[[glossary/code|コード]]のない他の[[glossary/account|アカウント]]の[[glossary/witnesses|証人 (witnesses)]]を提供した場合）。ランダムな半分の[[glossary/contract|コントラクト]]に触れた場合、20回の試行で平均して53%と20%でした。
-   **[[glossary/elastic-timeline|弾力的なタイムライン]]。** 証明時間はブロックのサイズと内容によって異なり、スローモードはその範囲の一端です。[[glossary/Rapidblocks|Rapidblocks]]では、ブロックをスキップするのに合意は必要ないため、パイプラインの多くはブロックごとに適応できます。[[glossary/producer|プロデューサー]]は、合意された境界内で、[[glossary/header|ヘッダー]]でブロックの[[glossary/round|ラウンド]]Aとそれに伴う証明[[glossary/deadline|デッドライン]]を宣言できます。そのブロックは後で確認され、その[[glossary/filter|フィルター]]は他のブロックのためにホットキーをより長くブロックし、[[glossary/window|ウィンドウ]]は境界に合わせてサイズ設定する必要があります。投票の[[glossary/round|ラウンド]]構造、その[[glossary/vote-cadence|ケイデンス]]と[[glossary/window|ウィンドウ]]は、依然として合意が必要です。私たちは、[[glossary/slot|スロット]]が作成されるときに、チェーンがすでに確定したデータからそれを[[glossary/fixed|固定]]し、チェーンに記録された[[glossary/finality|ファイナリティ]]が[[glossary/stale|陳腐化]]したときに後退するルールを検討しています。

コメント、抜け穴、反例は大歓迎です。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/rapidblocks-with-split-proofs-execution-proofs-that-outlive-their-state/26157)
