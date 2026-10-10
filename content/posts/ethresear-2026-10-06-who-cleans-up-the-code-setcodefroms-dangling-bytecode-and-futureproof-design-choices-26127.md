---
title: コードをクリーンアップするのは誰か？SETCODEFROMの宙ぶらりんバイトコードと将来を見据えた設計選択
original_title: >-
  Who cleans up the code? SETCODEFROM's dangling bytecode and futureproof design
  choices
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/who-cleans-up-the-code-setcodefroms-dangling-bytecode-and-futureproof-design-choices/26127
author: CPerezz
date: '2026-10-06'
category: Execution Layer Research
tags:
  - execution-layer
  - protocol-design
  - state-management
  - evm
  - eip
  - research
topic_id: '26127'
translated_at: '2026-10-10'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Who cleans up the code? SETCODEFROM's dangling bytecode and futureproof design choices](https://ethresear.ch/t/who-cleans-up-the-code-setcodefroms-dangling-bytecode-and-futureproof-design-choices/26127) — CPerezz (2026-10-06)

![すべてのクライアントは、どのアカウントも指していないバイトコードをすでに保持しています。これはコードがステートルートの外にあるため問題になりませんでした。SETCODEFROMは任意のトランザクションがこの山にコードを追加することを可能にし、パーティション化されたバイナリツリーはコードをルート内に移動させます。](https://ethresear.ch/uploads/default/optimized/3X/f/1/f1da81f611cf21c37ca873a1e10d9b0c04ceec59_2_690x385.jpeg)

すべてのクライアントは、どのアカウントも指していないバイトコードをすでに保持しています。これはコードが[[glossary/State-Root|ステートルート]]の外にあるため問題になりませんでした。[[glossary/SETCODEFROM|SETCODEFROM]]は任意のトランザクションがこの山にコードを追加することを可能にし、[[glossary/Partitioned-Binary-Tree|パーティション化されたバイナリツリー]]はコードをルート内に移動させます。

同じクライアントをフル同期とスナップ同期でそれぞれ2回同期すると、両方のノードはすべての[[glossary/State-Root|ステートルート]]について合意します。しかし、コードデータベースの内容については合意しません。フル同期されたノードは、どのアカウントも指していないバイトコードを保持しています。[[glossary/EIP-8058|EIP-8058]]によると、[[glossary/Cancun|カンクン]]時点でのフル同期ノードでは、そのようなコードが27,869個ありました。

これはこれまでコンセンサスを破ることはなく、規模も小さいものでした。しかし、[[glossary/Hegot|ヘゴタ (Hegotá)]]向けに提案されている[[glossary/SETCODEFROM|SETCODEFROM]]は、すべてのトランザクションにコードを残す新しい方法を提供し（その目的については私の[以前の記事](https://cperezz.github.io/articles/setcodefrom-account-modes/)で説明しています）、[[glossary/Partitioned-Binary-Tree|パーティション化されたバイナリツリー (PBT)]]はコードを[[glossary/State-Root|ステートルート]]内に移動させます。これらが組み合わさることで、無害な残骸が設計上の決定事項となり、8298がまだ[[glossary/Draft|ドラフト]]である今がその時です。

## 同じチェーン、同じルート、異なるコード

![図1](https://ethresear.ch/uploads/default/optimized/3X/6/d/6d558867b4f27b15c516e00ee9089214f387c04a_2_690x442.png "図1")

[[glossary/State-Root|ステートルート]]は各アカウントのコードハッシュにコミットしますが、コード自体にはコミットしません。バイトコードはサイドテーブル（ハッシュからコードへのマッピング）に存在し、各クライアントが自由に格納・保持します。コンセンサスがこのテーブルに求めるのはただ一つ、すべてのライブアカウントのコードがそこにあることです。それ以外の余分なものはルートからは見えないため、誰もそれについて合意する必要はありませんでした。

## コードが宙ぶらりんになる経緯

![図2](https://ethresear.ch/uploads/default/optimized/3X/4/0/402c64d73c246092a50d0983bd8c1d75508fdb9c_2_690x390.png "図2")

コードは、クライアントがそれをデプロイするブロックを実行する際にそのテーブルに書き込まれ、ほとんどのクライアントではそれが削除されることはありません。

-   **リorg（Reorgs）。** クライアントがサイドブランチでブロックを実行し、新しいコードを書き込みます。チェーンが別のブランチを選択すると、そのブロックの状態は元に戻されますが、コードは残ります。
-   **[[glossary/SELFDESTRUCT|SELFDESTRUCT]]、[[glossary/Cancun|カンクン]]以前。** あるブロックでデプロイされ、後のブロックで破棄されたコントラクトは、そのアカウントとストレージを失います。コードをハッシュでキー付けするクライアントでは、そのコードも一緒に削除することはできません。別のEVMアカウントが同じコードハッシュを共有している可能性があり、クライアントにはそれを知る方法がないためです。参照カウントのみがそれを教えてくれます。[[glossary/EIP-6780|EIP-6780]]は[[glossary/Cancun|カンクン]]でこの問題を解決しました。
-   **リバートされたサブ[[glossary/CREATE|CREATE]]。** 内部の[[glossary/CREATE|CREATE]]が成功した後、外部のフレームがリバートされるケースです。ほとんどのクライアントは、コードがディスクに到達する前に元に戻します。[[glossary/Nethermind|Nethermind]]は挿入時にステージングし、結局ブロックの最後にバッチ全体を書き込みます。

各クライアントの比較は以下の通りです。

![図3](https://ethresear.ch/uploads/default/optimized/3X/a/6/a668cad8523ca63889953faae27af017b8a98b09_2_690x454.png "図3")

2つの点が際立っています。リバートは主な原因ではありません。[[glossary/Nethermind|Nethermind]]のみがリバートされたフレームからのコードを永続化し、他のクライアントは書き込まれる前に元に戻します。そして、1つのクライアントだけがこの問題を全く抱えていません。

[[glossary/Cancun|カンクン]]以降、リorgと[[glossary/Nethermind|Nethermind]]のリバート処理のみがコードを残しています。この2つを修正すれば、[[glossary/SETCODEFROM|SETCODEFROM]]が導入されるまでは何も残らなくなるでしょう。

## 参照カウントと現在のクライアント

![図4](https://ethresear.ch/uploads/default/optimized/3X/3/7/373eebcdbad4d7b3addc5c1d79273fdecdb26205_2_690x403.png "図4")

共有コードを削除するには、他に誰もそれを指していないことを知る必要があり、そのためには参照カウントが必要ですが、どのクライアントもそれを保持していません。[[glossary/geth|geth]]、[[glossary/reth|reth]]、[[glossary/Nethermind|Nethermind]]、[[glossary/Besu|Besu]]はコードをハッシュで保存します。1000個のクローンが1つのコピーを共有し、それらがすべて消えてもそのコピーは残ります。[[glossary/Besu|Besu]]は両方の方式を採用していました。古い[[glossary/Besu|Besu]]データベースはコードをアカウントでキー付けしていましたが、新しいものはハッシュでキー付けしています。

[[glossary/Erigon|Erigon]]はこの問題を回避しています。コードをアドレスごとに保存するため、コードはそのアカウントと共に削除され、その凍結ファイルは共有辞書に対して重複を圧縮します。これにより、1000個のクローンが1000個のコピーのわずかなコストで済みます（その設定では[[glossary/mainnet|メインネット]]上のコードで4倍の圧縮率を記録しています）。

ただし、圧縮はディスク容量を節約するだけです。ツリー内では、すべてのコピーはそれ自身のコミットされたリーフとして、ハッシュ化され、同期され、個別に証明されます。そのため、[[glossary/Partitioned-Binary-Tree|PBT]]はコードハッシュごとに1つのコピーを保持し、それを削除するには誰も保持していない正確なカウントが必要になります。

## 現在の規模は？小さい

![図5](https://ethresear.ch/uploads/default/optimized/3X/b/6/b6f3973d204b379d0cbc26199e82b4f201466a1f_2_690x471.png "図5")

これらの27,869個のコードは24 KiBの制限内でデプロイされたため、合計で最大0.68 GBです。新しい64 KiBの制限（[[glossary/EIP-7954|EIP-7954]]、[[glossary/Glamsterdam|グラムステルダム]]で予定）でも、同じ数であれば1.83 GBとなり、フルノードの約280 GBのステートの0.7%未満です。[[glossary/snap-synced node|スナップ同期ノード]]はこれをダウンロードすることすらありません。ディスク容量のためだけにクリーンアップする価値は誰も見出していません。

しかし、それが犠牲にしたのは設計の自由です。クライアントに「コードHを持っていますか？」と尋ねることはできません。なぜなら、その答えは同期方法によって異なるからです。8058の重複排除割引は、代わりに[[glossary/access list|アクセスリスト]]内のアドレスのコードハッシュをルックアップする必要があり、[[glossary/SETCODEFROM|SETCODEFROM]]がコードハッシュではなくソースアドレスを取るのも全く同じ理由です。

## [[glossary/Code-chunking|コードチャンキング]]がコードをルートに配置する

![図6](https://ethresear.ch/uploads/default/optimized/3X/a/1/a12415bda480d239bb9f2b4b9e453a3af9498ae5_2_690x419.png "図6")

[[glossary/Partitioned-Binary-Tree|PBT]]（[[glossary/EIP|EIP]]-8297）が行うように、また他の[[glossary/Code-chunking|コードチャンキング]]設計でもそうであるように、コードをステートツリーに[[glossary/Code-chunking|チャンク化]]すると、[[glossary/State-Root|ルート]]はコードハッシュだけでなくコードバイトにもコミットします。64 KiBのコントラクトは、それぞれ31バイトのコードリーフが最大2,115個になり、さらにリーフごとに約1つのブランチノードが追加され、これらすべてが[[glossary/consensus-state|コンセンサス状態]]となります。すべてのフルノードがこれを保存し、[[glossary/snap sync|スナップ同期]]が提供する必要があり、[[glossary/EIP-8369|EIP-8369]]の[[glossary/AA-VOPS-state-surface|AA-VOPSプロファイル]]の下では、部分的にステートレスなノードでさえコードコーパス全体を保持します。

[[glossary/Partitioned-Binary-Tree|PBT]]が重複を避けるためにコードハッシュごとにチャンクを一度だけ保存するようにすると、コードの削除はコンセンサスの決定事項となります。現在、これには参照カウントは必要ありません。[[glossary/Cancun|カンクン]]以降、コードを持つアカウントはそれを作成したトランザクション内でのみ削除でき、ライブアカウントがそのコードを置き換えることはできません。そのため、トランザクションよりも古いコードリーフは常に、トランザクションが削除できないホルダーを持っています。8297はこれを明確に述べています。ライブアカウントがコードを置き換えることを可能にする将来の変更は、「チェックがどのようにローカルに維持されるかを説明する必要がある」と。

ちなみに、現在の宙ぶらりんのコードは[[glossary/Partitioned-Binary-Tree|PBT]]には引き継がれません。そのコンバーター（[[glossary/EIP|EIP]]-8347）は、ライブアカウントのコードハッシュを介してのみコードを読み取ります。

## [[glossary/SETCODEFROM|SETCODEFROM]]は任意のトランザクションを最後のホルダーにする

![図7](https://ethresear.ch/uploads/default/optimized/3X/6/f/6fa8fac24c43a3e2ae45370831c65cd48ea7b1f8_2_625x500.png "図7")

[[glossary/SETCODEFROM|SETCODEFROM]]がその後の変更です。あるコードを保持する最後のアカウントが異なるコードを採用すると、古いコードにはホルダーが残りません。[[glossary/Merkle-Patricia-Trie|MPT]]の下では、それは誰も合意しないテーブルにさらに1つのエントリが追加されるだけであり、同期によって削除されます。[[glossary/Partitioned-Binary-Tree|PBT]]の下では、それは[[glossary/State-Root|ルート]]内の2,115個のリーフとなり、それらを削除するには誰も保持していない正確なカウントが必要になります。

[[glossary/SETCODEFROM|SETCODEFROM]]が意図するフローでは、この状況はほとんど発生しません。ソースは自身のコードを保持するため、テンプレートから採用されたものは常に少なくとも1つのホルダーを持ちます。宙ぶらりんになるのは、自己アップグレードするコントラクトの元のコード、または他のすべてのアカウントが離れた後に自身のコードを変更するテンプレートのコードです。そして、これらのバイトは支払われたものです。[[glossary/EIP-8037|EIP-8037]]の下では、64 KiBのデプロイには約100Mの[[glossary/State-gas|ステートガス]]がかかりますが、それを孤立させるには12,200ガスかかります。[[glossary/SETCODEFROM|SETCODEFROM]]はステート成長を安くするものではありません。それは、支払われたステートを取り戻すことを不可能にします。

> 私が最も懸念しているのはこの点です。**カウントがなければ、ツリー内のデッドコードは永遠に存在します**。すべてのノードがそれを保存し、同期し、提供し、すべての[[glossary/AA-VOPS-state-surface|AA-VOPS]]ノードもそれを保持します。カウントがあれば、[[glossary/SETCODEFROM|SETCODEFROM]]は[[glossary/Cancun|カンクン]]以降、ステートからコードを取り戻す最初の方法となります。
>
> そして、私たちは未来を予測することはできません。ユニークなコードをデプロイし、後で別のものを採用するあらゆるユースケースは、デッドコードの痕跡を残します。例えば、アップグレード頻度の高いプロトコルや、共有テンプレートに移行するユーザーごとのデプロイなどです。その痕跡がどれほど長くなるかは誰にも分かりませんし、**一度ルートに入ればそれは残ります**。

## 3つの実装方法

![図8](https://ethresear.ch/uploads/default/optimized/3X/c/5/c5144db3b2d57ed528d85e35534340fae76fc978_2_690x470.png "図8")

**A. [[glossary/Hegot|ヘゴタ (Hegotá)]]で今すぐカウントする。** 8298は、最後のホルダーがコードを置き換えるとコードを削除し、そのための[[glossary/SETCODEFROM|SETCODEFROM]]のガス価格を設定し、アドレスオペランドを保持します。クライアントはカウントを構築し、リorgやリバートの書き込みを修正します。[[glossary/Partitioned-Binary-Tree|PBT]]はカウントがどこに存在するかだけを決定します。そして、カウントのバグは[[glossary/Merkle-Patricia-Trie|MPT]]の下では、[[glossary/State-Root|ステートルート]]に影響を与えるずっと前に、リークまたはスタックとして現れます。

**B. 現状のまま出荷し、[[glossary/Partitioned-Binary-Tree|PBT]]に決定を委ねる。** [[glossary/Hegot|ヘゴタ (Hegotá)]]では何も変更しません。[[glossary/Partitioned-Binary-Tree|PBT]]は後で、置き換えられたコードを削除しない（これはCのケース）か、その時点でカウントを追加します。これは[[glossary/SETCODEFROM|SETCODEFROM]]のガス変更、初日からコンセンサスに不可欠なカウント、そしてすべての変換パスがそれを同一に計算することを意味します。

**C. 仕様により決して削除しない。** 2番目に出荷される[[glossary/EIP|EIP（Ethereum改善提案）]]のいずれかに1文を追加するだけで、新しいメカニズムは不要で、デッドリーフは永遠に[[glossary/State-Root|ルート]]に残ります。[[glossary/Cancun|カンクン]]以降、コードゾーンから何も削除されないため、現在では追加コストはかかりません。しかし、将来どうなるかは誰にも分かりません。

![図9](https://ethresear.ch/uploads/default/optimized/3X/3/a/3aa0b401269d4583bb52a2134298511fa5f4906d_2_666x500.png "図9")

## 私の立場

私はこの件に関して偏りがあります。[[glossary/Partitioned-Binary-Tree|PBT]]の[[glossary/EIP|EIP（Ethereum改善提案）]]を共同執筆しており、それらが実装されることを望んでいます。しかし、それらがすでに複雑であることについては皆が同意できると思います。そして、ツリーへの入り方は複数あります。自身のノードを変換する人々、変換されたスナップショットをインポートする人々、BALリプレイに従うノードなどです。Bのシナリオでは、これらのパスのすべてが、8298で少しの追加作業でできたはずの修正を継承することになります。

したがって、私はAの選択肢を好みます。8298がまだ[[glossary/Draft|ドラフト]]であるうちに決定し、バグの修正コストが低い段階でカウントを構築し、[[glossary/Partitioned-Binary-Tree|PBT]]に別の[[glossary/EIP|EIP（Ethereum改善提案）]]の[[glossary/tech debt|技術的負債]]ではなく、解決済みの問題を引き渡したいと考えています。

## チートシート

![図10](https://ethresear.ch/uploads/default/optimized/3X/d/f/df989b5d370329a62d06d275607eeb398f362dea_2_690x377.png "図10")

* * *

ウェブ版（図のソース付き）：[cperezz.github.io/articles/setcodefrom-dangling-code](https://cperezz.github.io/articles/setcodefrom-dangling-code/)

1投稿 - 1参加者

[トピック全文を読む](https://ethresear.ch/t/who-cleans-up-the-code-setcodefroms-dangling-bytecode-and-futureproof-design-choices/26127)
