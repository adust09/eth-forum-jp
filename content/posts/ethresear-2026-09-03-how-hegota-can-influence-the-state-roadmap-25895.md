---
title: ヘゴタ (Hegotá) がステートロードマップにどう影響するか
original_title: How Hegotá can influence the state roadmap
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/how-hegota-can-influence-the-state-roadmap/25895'
author: misilva73
date: '2026-09-03'
category: Execution Layer Research
tags:
  - execution-layer
  - state-management
  - eip
  - gas
  - account-abstraction
  - verkle-trees
  - protocol-design
  - scaling
  - research
  - hegota
  - pbt
topic_id: '25895'
translated_at: '2026-09-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [How Hegotá can influence the state roadmap](https://ethresear.ch/t/how-hegota-can-influence-the-state-roadmap/25895) — misilva73 (2026-09-03)

> これは私と[@CPerezz](https://ethresear.ch/u/cperezz)による意見記事です。

この記事では、[[glossary/Hegot|ヘゴタ (Hegotá)]]向けに提案された[[glossary/EIP|EIP（Ethereum 改善提案）]]が、ステートに関する現在の作業にどう影響するかを議論します。そのため、ステート管理、ステートアクセス、またはトライ移行に直接影響を与える[[glossary/EIP|EIP]]に焦点を当てています。

ステートロードマップには、私たちの見解では2つの目標があります。

1.  スループットの上昇に伴い、ステートの保持、アクセス、提供を管理可能な状態に保つこと。
2.  新しいステートトライへの安全な移行を準備すること。

[[glossary/Hegot|ヘゴタ (Hegotá)]]は、[[glossary/State-growth|ステート成長]]を明確な予算内に抑え、[[glossary/Frame-Transactions|フレームトランザクション]]の新しいステートを制限し、いくつかのレガシーなステートの問題を解決し、フォークのタイミングが許せば、[[glossary/Runtime-block-level-access-lists|ブロックアクセスリスト (BAL)]]サイドカーを通じて既存のステートへのアクセスを改善することで貢献できます。今日のメリットは小さいが、移行中や[[glossary/State-growth|ステート成長]]の増加時にコストが発生するような変更は延期すべきです。

[[glossary/Hegot|ヘゴタ (Hegotá)]]は、[[glossary/Glamsterdam|グラムステルダム]]で導入された[[glossary/Runtime-block-level-access-lists|BAL]]（[[glossary/EIP|EIP]]-[7928](https://eips.ethereum.org/EIPS/eip-7928)）と[[glossary/State-gas|ステートガス]]（[[glossary/EIP|EIP]]-[8037](https://eips.ethereum.org/EIPS/eip-8037)）に続くものです。[[glossary/Partitioned-Binary-Tree|PBT（パーティション化されたバイナリツリー）]]の移行は、その後のフォークI*で予定されています。

## PBTと移行に関する簡単な入門

[[glossary/EIP|EIP]]-[8297](https://eips.ethereum.org/EIPS/eip-8297)で規定されている[[glossary/Partitioned-Binary-Tree|パーティション化されたバイナリツリー (PBT)]]は、イーサリアムの現在のステートトライレイアウトを、より小さな証明とより効率的な証明生成のために設計されたバイナリ構造に置き換えます。これは異なる種類のステートをゾーンに分離し、コントラクトコードをその内容によって保存することで、同一のコードの共有を可能にします。

[[glossary/EIP|EIP]]-[8347](https://eips.ethereum.org/EIPS/eip-8347)はオフライン移行を提案しています。クライアントはファイナライズされたアンカーブロックでステートを変換し、その後[[glossary/Runtime-block-level-access-lists|ブロックアクセスリスト (BAL)]]を使用して、新しいツリーが追いつくまで変更をリプレイします。その後の[[glossary/Partitioned-Binary-Tree|PBT]]アクティベーションフォークで、[[glossary/State-Root|ステートルート]]が[[glossary/Merkle-Patricia-Trie|MPT（マークルパトリシアトライ）]]から[[glossary/Partitioned-Binary-Tree|PBT]]に切り替わります。これにより、アクティベーション境界での完全な変換は回避されますが、完全で信頼性の高い[[glossary/Runtime-block-level-access-lists|BAL]]が移行の依存関係となります。

[[glossary/EIP|EIP]]-[8025](https://eips.ethereum.org/EIPS/eip-8025)のオプションの実行証明は、トレードオフをこのオフラインアプローチにさらに傾けます。オンライン移行の場合、移行期間中、両方のツリーに対して証明生成が機能し続ける必要があります。これは[[glossary/EIP|EIP]]-8025の賛否を問うものではありませんが、移行設計に影響を与えます。

## ステート成長制御：観察し、選択する

[[glossary/EIP|EIP]]-[8037](https://eips.ethereum.org/EIPS/eip-8037)は、標準化された[[glossary/CPSB|CPSB（ステートバイトあたりのコスト）]]を介して価格設定される個別の[[glossary/State-gas|ステートガス]]次元を導入し、すべてのステート作成操作が書き込むバイトに比例して課金され、[[glossary/State-growth|ステート成長]]が制限されるようにします。この[[glossary/EIP|EIP]]は[[glossary/Glamsterdam|グラムステルダム]]で予定されています。

[[glossary/Glamsterdam|グラムステルダム]]がアクティベートされた後、最初のステップは、ステート作成の需要が[[glossary/EIP|EIP]]-[8037](https://eips.ethereum.org/EIPS/eip-8037)にどう反応するかを観察し、[[glossary/State-gas|ステートガス]]と[[glossary/Execution-gas|実行ガス]]の利用率をそれぞれの目標と比較することです。その証拠によって、[[glossary/Hegot|ヘゴタ (Hegotá)]]が`CPSB`または[[glossary/State-gas|ステートガス]]メカニズムを修正すべきかどうかが決まります。考えられるシナリオは3つあります。

1.  **ステートと実行の需要がミスマッチしている場合:** 一方のリソースの利用率が目標から大きく離れている一方で、もう一方のリソースがブロックを制約している場合です。これは[[glossary/EIP|EIP]]-8037の[[glossary/Failure-mode|失敗モード]]です。この場合、`CPSB`の一回限りの再調整を行い、ハードフォーク境界で生の[[glossary/State-gas|ステートガス]]制限をスケーリングして、ステートと実行の容量をバランスに戻す[[glossary/EIP|EIP]]-[8372](https://eips.ethereum.org/EIPS/eip-8372)を採用すべきです。
    
2.  **需要はバランスしているが、[[glossary/Hegot|ヘゴタ (Hegotá)]]が[[glossary/Block-gas-limit|ブロックガス制限]]を引き上げる場合:** この場合、より高い制限のために`CPSB`を再導出し、メカニズムを変更せずに[[glossary/State-growth|ステート成長]]を目標に維持する[[glossary/EIP|EIP]]-[8368](https://eips.ethereum.org/EIPS/eip-8368)を採用すべきです。
    
3.  **需要はバランスしており、[[glossary/Block-gas-limit|ブロックガス制限]]が変更されない場合:** この場合、[[glossary/Hegot|ヘゴタ (Hegotá)]]の更新は行わず、[[glossary/EIP|EIP]]-8037の既存のパラメータを維持すべきです。
    

したがって、[[glossary/EIP|EIP]]-[8368](https://eips.ethereum.org/EIPS/eip-8368)と[[glossary/EIP|EIP]]-[8372](https://eips.ethereum.org/EIPS/eip-8372)は、[[glossary/Glamsterdam|グラムステルダム]]後の十分な利用データが得られるまで、代替の緊急対応パスとして残すべきです。この決定は証拠に裏打ちされ、フォークの最終的なガス制限目標に依存すべきです。

## フレームトランザクションは制限されたステートフットプリントを必要とする

[[glossary/EIP|EIP]]-[8141](https://eips.ethereum.org/EIPS/eip-8141)は、[[glossary/Hegot|ヘゴタ (Hegotá)]]のネイティブな[[glossary/Account-Abstraction|アカウント抽象化 (AA)]]設計として[[glossary/Frame-Transactions|フレームトランザクション]]を導入します。プログラマブルな検証は、ステートの制限されたスライスのみを読み取る必要があります。これにより、将来のインクルージョンリストビルダーを含む有効性チェックノードが、全体のステートを保持する必要がなくなります。このため、ERC-20手数料スポンサーシップを[[glossary/Frame-Transactions|フレームトランザクション]]の機能として採用することには反対すべきです。それは有効性を任意のトークンストレージに依存させ、その制約を無効にしてしまうからです。

2つの[[glossary/Frame-Transactions|フレームトランザクション]]拡張は、新しいステートタイプを追加します。[[glossary/EIP|EIP]]-[8250](https://eips.ethereum.org/EIPS/eip-8250)は[[glossary/Keyed-Nonces|キー付きNonce]]を追加し、[[glossary/EIP|EIP]]-[8272](https://eips.ethereum.org/EIPS/eip-8272)は最近のアプリケーション[[glossary/State-Root|ステートルート]]のローリングウィンドウを追加します。どちらも最初はシステムコントラクト内の通常のストレージとして開始し、後で独自の[[glossary/Partitioned-Binary-Tree|PBT]]ゾーンに移動できます。これは、需要が制限されたままである場合にのみ機能します。特に[[glossary/Keyed-Nonces|キー付きNonce]]の場合、新しいキーごとに永続的なスロットが追加されるため、需要の制限が重要です。プライバシープールの使用が現在の最良の代理指標であり、この[Duneダッシュボード](https://dune.com/soispoke/privacy-pools-nullifier-state-growth?utm_source=share&utm_medium=copy&utm_campaign=dashboard)に基づくと、[[glossary/nullifier|ナリファイア]]の成長は今のところ実現可能に見えます。採用が進むにつれて、引き続き監視する必要があります。

## レガシーアカウントの解決

[[glossary/EIP|EIP]]-[8253](https://eips.ethereum.org/EIPS/eip-8253)は、スピュリアスドラゴン以前から残っている少数の[[glossary/legacy-accounts|レガシーアカウント]]、すなわちストレージはあるがコードがなく、[[glossary/nonce|ナンス]]がゼロのアカウントに対処します。[[glossary/Hegot|ヘゴタ (Hegotá)]]は[[glossary/Partitioned-Binary-Tree|PBT]]移行前にこのアカウント形状を削除すべきです。[[glossary/EIP|EIP]]-8253は28のアカウントの[[glossary/nonce|ナンス]]を1に設定することでこれを行いますが、代替案としてはそれらの129のストレージエントリをクリアする方法もあります。[[glossary/nonce|ナンス]]の増加はより小さくシンプルな移行であり、ストレージをクリアするとより多くのステートが削除されます。[[glossary/Hegot|ヘゴタ (Hegotá)]]でこの異常を解決すべきであり、アカウントリストを検証し、移行の複雑さを比較した後に正確なメカニズムを選択すべきです。

## フォークのタイミングが許せば、BALをサイドカーとして追加する

[[glossary/EIP|EIP]]-[7928](https://eips.ethereum.org/EIPS/eip-7928)の[[glossary/Runtime-block-level-access-lists|ブロックアクセスリスト (BAL)]]には、ブロックが触れるすべてのアカウント、ストレージスロット、およびコードまたは残高/[[glossary/nonce|ナンス]]の変更が含まれます。[[glossary/EIP|EIP]]-[8146](https://eips.ethereum.org/EIPS/eip-8146)は、[[glossary/Runtime-block-level-access-lists|BAL]]の配信をペイロードから外し、独自のチャネルで早期に送信することで、クライアントにステートをプリフェッチし、[[glossary/State-Root|ステートルート]]を計算するためのより多くの時間を与えます。

これは、フォークを遅らせない限り、良い改善です。これを含める前に、プリフェッチと[[glossary/State-Root|ステートルート]]計算の追加の1秒による実行上のメリットをベンチマークすべきです。

## ステート階層化は待てる

今日のクライアントデータベースは、マルチテラバイトのステートのために構築されていません。考えられる解決策は[[glossary/Hot-Cold-Storage-Separation|ホット・コールドストレージ分離]]です。[[glossary/Active-state|ホットステート]]をライブデータベースに保持し、[[glossary/Inactive-state|コールドステート]]を安価なメディア上のフラットファイルにプッシュします。測定によると、ストレージ書き込みの約94%は過去30日間のステートにヒットし、上位1%のアカウントが読み取りの96〜98%を吸収しています（「[[glossary/Hot-Cold-Storage-Separation|実用におけるホット・コールドストレージ分離]]」、[The Anatomy of Ethereum’s State Access](https://ethresear.ch/t/the-anatomy-of-ethereum-s-state-access/25317)）。[[glossary/Inactive-state|コールドステート]]はHDDをターゲットとすべきです。なぜなら、大きく、遅く、安価なディスクには仕事が必要だからです。

[[glossary/EIP|EIP]]-[8188](https://eips.ethereum.org/EIPS/eip-8188)は、各アカウントとストレージスロットに最後に書き込んだブロックを記録し、この分割のための明確なシグナルを提供します。最終的には必要になるでしょうが、これは書き込み頻度をステートに組み込むものであり、現在の[[glossary/Partitioned-Binary-Tree|PBT]]リーフフォーマットはそれを表現していません。移行前にこれを含めることは、そのギャップを解決し、変換を通じてより多くのデータを運ぶことを意味します。その主な運用上のメリットは、ステートがTBマークに近づいたときにのみ現れます。

したがって、トライ移行後に[[glossary/EIP|EIP]]-8188を再検討し、現時点では低優先度の探索のみを継続すべきです。HDDから[[glossary/Inactive-state|コールドステート]]を提供し、アクセスを過度に高価にしないためのさらなる作業も必要です。

## SETCODEFROMはSETDELEGATEを包含する

[[glossary/EIP|EIP]]-[7819](https://eips.ethereum.org/EIPS/eip-7819)と[[glossary/EIP|EIP]]-[8298](https://eips.ethereum.org/EIPS/eip-8298)はどちらも、[[glossary/EIP|EIP]]-[7702|EIP-7702]]委任アカウントがその委任をクリアし、スマートアカウントになることを可能にします。[[glossary/EIP|EIP]]-8298の`[[glossary/SETCODEFROM|SETCODEFROM]]`は、アカウントが既に他の場所にデプロイされているコードを再利用することも可能にします。

この再利用により、重複するバイトコードの書き込みが回避されます。[[glossary/EIP|EIP]]-[8037](https://eips.ethereum.org/EIPS/eip-8037)の`[[glossary/CPSB|CPSB]]`は、同一のコードが存在する場合でも書き込まれたバイトに対して課金しますが、[[glossary/Partitioned-Binary-Tree|PBT]]はデプロイヤーに割引を与えることなくそれらのバイトを重複排除します。`[[glossary/SETCODEFROM|SETCODEFROM]]`は書き込みを完全にスキップします。報告によると、デプロイされたコントラクトの約62%が既存のバイトコードを複製しており、この節約は移行後も残ります。

[[glossary/Hegot|ヘゴタ (Hegotá)]]は委任のクリアを含める必要はありません。しかし、含めるのであれば、[[glossary/EIP|EIP]]-8298を選択すべきです。これは[[glossary/EIP|EIP]]-7819のユースケースをカバーし、重複コードのデプロイを削減します。そのコストは[[glossary/EIP|EIP]]-8037の後により明確になるでしょう。

## `SELFDESTRUCT`とエフェメラルストレージ

[[glossary/EIP|EIP]]-[4758](https://eips.ethereum.org/EIPS/eip-4758)は、[[glossary/EIP|EIP]]-[6780](https://eips.ethereum.org/EIPS/eip-6780)によって残された唯一のアカウント削除ケース、すなわち同じトランザクションで作成され自己破壊されたアカウントを削除します。このケースを削除することは、[[glossary/Partitioned-Binary-Tree|PBT]]またはその移行に対して中立的です。なぜなら、これらのアカウントはプリステートに存在せず、ポストステートに存続しないからです。

`[[glossary/SELFDESTRUCT|SELFDESTRUCT]]`を置き換える計画は、[[glossary/EIP|EIP]]-[8360](https://github.com/ethereum/EIPs/pull/12073)の`[[glossary/TCREATE|TCREATE]]`です。これは`CREATE2`のバリアントで、コード、[[glossary/nonce|ナンス]]、ストレージがすべてトランザクションの終わりに削除され、残高のみが残るコントラクトをデプロイします。`[[glossary/TCREATE|TCREATE]]`されたコントラクト内では、`SLOAD`/`SSTORE`は価格設定され、`TLOAD`/`TSTORE`のように振る舞います。

この[[glossary/Ephemeral-storage|エフェメラルストレージ]]層から恩恵を受けるユースケースはいくつかありますが、現在の使用は限られています。1ヶ月分のブロックをカバーする[サンプル](https://github.com/misilva73/evm-gas-repricings/blob/e1665df71d44c2125f49976dac2d7f8da5db6b82/notebooks/5.1-eip-6780-same-tx-create-selfdestruct.ipynb)では、1日あたり平均約1,500のアカウントが同じトランザクションで作成され、自己破壊されていることがわかります。このサンプルには2つの使用パターンがあり、中央集権型取引所や[[glossary/NFT-marketplaces|NFTマーケットプレイス]]の内部ウォレット管理、および詐欺からのマネーロンダリングです。現在の使用状況で、ストレージを無視してアカウントあたり120バイトのみを数えると、この削除により年間約62 MiBの[[glossary/State-growth|ステート成長]]が回避されますが、これはかなり小さいです。したがって、これは明確な勝利ではなく、現時点では優先事項ではない可能性が高いです。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/how-hegota-can-influence-the-state-roadmap/25895)
