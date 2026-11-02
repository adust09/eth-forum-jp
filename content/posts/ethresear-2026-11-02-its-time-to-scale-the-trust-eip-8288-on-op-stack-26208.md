---
title: 信頼のスケーリングの時：OP StackにおけるEIP-8288
original_title: 'It''s time to scale the trust: EIP-8288 on OP Stack'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/its-time-to-scale-the-trust-eip-8288-on-op-stack/26208'
author: sm-stack
date: '2026-11-02'
category: Layer 2
tags:
  - layer2
  - scaling
  - rollup
  - zk
  - cryptography
  - post-quantum
  - data-availability
  - eip
  - protocol-design
topic_id: '26208'
translated_at: '2026-11-02'
translator: gemini-2.5-flash
---

> [!note] 原文
> [It's time to scale the trust: EIP-8288 on OP Stack](https://ethresear.ch/t/its-time-to-scale-the-trust-eip-8288-on-op-stack/26208) — sm-stack (2026-11-02)

[![image](https://ethresear.ch/uploads/default/optimized/3X/2/c/2c80b97c4d46d126cedb9016f24b864152724a16_2_690x362.jpeg)](https://ethresear.ch/uploads/default/original/3X/2/c/2c80b97c4d46d126cedb9016f24b864152724a16.jpeg "OP StackにおけるEIP-8288の信頼スケーリング")

# 概要

[[glossary/Rollup|ロールアップ]]は[[glossary/Layer-1|L1]]から実行をオフロードすることでスケーリングを実現しましたが、すべてのトランザクションの認証部分は依然として[[glossary/Layer-1|L1]]に送られます。これが[[glossary/Post-Quantum|PQ]]時代における[[glossary/Layer2|L2]]スケーリングのボトルネックとなる可能性があり、たとえ[[glossary/blob|ブロブ]]が増えても同様です。[[glossary/post-quantum-signatures|PQ署名]]はECDSAよりもはるかに大きいため、もしすべての[[glossary/Layer2|L2]]ユーザーが[[glossary/post-quantum-signatures|PQ署名]]に切り替えた場合、署名がトランザクションデータの99%を占め、6つの[[glossary/blob|ブロブ]]に収まる転送数は約6,600から155に減少します。[[glossary/zk|ZK]]アプリケーションはさらに状況が悪く、単一の[[glossary/Zero-Knowledge-Proof|PQ証明]]が通常3つの[[glossary/blob|ブロブ]]に収まりません。いずれにせよ、ボトルネックは、信頼をチェックするコストがユーザー数とともに増加することです。

[[glossary/Layer2|L2]]は[[glossary/EIP-8288|EIP-8288]]を採用することでこのコストを削減できます。署名と証明はトランザクションから移動し、多くのブロックのステートメントは1つの[[glossary/leanVM|leanVM]]集約証明にバンドルされ、[[glossary/Layer-1|L1]]に投稿されます。これにより、[[glossary/leanSPHINCS|leanSPHINCS]]で認証されたトランザクションは100から129バイトに圧縮され、ECDSAトランザクションに近くなります。

32コアマシン (AWS c7a.8xlarge) は、2秒チェーン上で毎秒最大170個の[[glossary/leanSPHINCS|leanSPHINCS]]署名を証明できます。この負荷では、[[glossary/Layer-1|L1]]ブロックあたりに到着する2,040個の[[glossary/leanSPHINCS|leanSPHINCS]]トランザクションは、測定された集約サイズと圧縮率から計算すると、平均2.8から3.3個の[[glossary/blob|ブロブ]]に収まります。[[glossary/EIP-8288|EIP-8288]]の集約がない場合、同じトランザクションの署名をトランザクション内に含めると79個の[[glossary/blob|ブロブ]]が必要になります。

[実装リンク (GitHub)](https://github.com/sm-stack/optimism/tree/feat/harry/eip-8288-proof-aggregation)

# 1. 問題

[[glossary/Rollup|ロールアップ]]のスケーリングは、[[glossary/Layer-1|L1]]から実行をオフロードすることで実現しました。[[glossary/Layer-1|L1]]は、トランザクションがいくつあっても状態遷移を再実行しないため、これが今日の[[glossary/Rollup|ロールアップ]]に[[glossary/Layer-1|L1]]の数十倍の容量を与えています。しかし、[[glossary/Layer2|L2]]の署名データは、すべてのトランザクションとともに依然として[[glossary/Layer-1|L1]]に到達し、圧縮するための構造を持っていません。

今日のECDSA署名では、署名データは圧縮後でもトランザクションの半分以上を占めています。量子コンピュータに備えるために必要な[[glossary/post-quantum-signatures|PQ署名]]は、ECDSAの10倍から100倍以上の大きさになります。

| オブジェクト | サイズ |
| --- | --- |
| ECDSA署名 (secp256k1) | 65 B |
| Falcon-512署名 | ~666 B |
| ML-DSA-44署名 | 2,420 B |
| [[glossary/leanSPHINCS|leanSPHINCS]]署名 + 公開鍵 | 4,936 B + 32 B |
| SLH-DSA-128s署名 | 7,856 B |
| [[glossary/leanVM|leanVM]]リーフ証明 (ZK) | 415–430 KiB |

OP Stackチャネルは、各[[glossary/blob|ブロブ]]の130,044バイトを使用します。同じワークロードで署名のみを変更すると、6[[glossary/blob|ブロブ]]チャネルでこれらの容量が得られます。

| トランザクション | 圧縮済み | そのうち認証部分 | 6[[glossary/blob|ブロブ]]チャネル |
| --- | --- | --- | --- |
| ECDSA署名 | 118 B | 67 B | 約6,600 |
| [[glossary/leanSPHINCS|leanSPHINCS]]署名インライン | 5,034 B | 4,983 B | 155 |

ユーザーは、これらのバイトに対してすべてのトランザクションで[[glossary/Layer-1|L1]]データ手数料を支払うため、[[glossary/Layer2|L2]]の総スループットは急激に低下します。

[[glossary/Layer2|L2]]上のプライバシーアプリケーションは、ハッシュベースの[[glossary/STARK|STARK]]証明が数百キロバイトのサイズであるため、さらに悪い状況にあります。Railgun、Privacy Pools、Privacy Boostのような[[glossary/zk|ZK]]アプリケーションは、現在[[glossary/Groth16-proof|Groth16]]のような小さな証明を使用していますが、[[glossary/Post-Quantum|PQ]]時代に向けて[[glossary/leanVM|leanVM]]のようなハッシュベースの証明に移行すると、単一の証明が400KBを超えます。[[glossary/EVM|EVM]]にはハッシュベース署名や二元体[[glossary/STARK|STARK]]のプリコンパイルもなく、コントラクトでそれらを検証するとトランザクションのガス予算をはるかに超えるため、オンチェーンで検証することもできません。

[[glossary/Rollup|ロールアップ]]の目的は、[[glossary/Layer-1|L1]]が実行に支払うコストがトランザクション数とともに増加しないことです。[[glossary/Post-Quantum|PQ]]時代には、認証と証明検証についても、トランザクションとアプリケーションの両方で同じことが当てはまる必要があります。[[glossary/EIP-8288|EIP-8288]]は[[glossary/Layer-1|L1]]でこの問題を解決するために設計されていますが、[[glossary/Layer2|L2]]でも同様に有用です。

# 2. 設計

## OP Stackにおける[[glossary/EIP-8288|EIP-8288]]

[[glossary/EIP-8288|EIP-8288]]は、署名と証明をブロックから取り除くための[[glossary/Layer-1|L1]]設計です。これは[[glossary/EIP-8141-frame-transaction|EIP-8141フレームトランザクション]]に依存関係フレームを追加し、そのフレームは`(scheme, data_hash, verification_key_hash)`のトリプルのリストを宣言します。スキームは[[glossary/leanSPHINCS|leanSPHINCS]]署名 (`0x10`) と[[glossary/STARK|leanSTARK]]証明 (`0x11`) です。

署名と証明は[[glossary/Mempool|メムプール]]にのみ存在し、ブロックには含まれません。ユーザーはトランザクションをその証明とともにラッパーで送信し、ノードは証明を再帰的にマージします。マージされた証明は、新しいヘッダーフィールド`recursive_stark`としてすべてのブロックに含まれます。実行中、トランザクションはその依存関係が有効であると仮定し、検証のためのガス (署名で3,000、[[glossary/STARK|STARK]]で30,000) と、ヘッダーフィールドの共有分 (`recursive_stark_gas`で30,000) を支払います。

[[glossary/Layer2|L2]]のブロック時間は[[glossary/Layer-1|L1]]よりもはるかに短いため、この構造をそのまま移行することはできません。証明がブロックの後に到着するため、ヘッダーに含めることができないからです。代わりに、この概念実証 (PoC) では、[[glossary/EIP-8288|EIP-8288]]の集約証明が多くの[[glossary/Layer2|L2]]ブロックをカバーし、新しいOP Stackバッチタイプ`0x02`として[[glossary/Layer-1|L1]]に別途投稿されます。証明のないブロックは無効であるというルールは残りますが、それは後で適用されます。[[glossary/Derivation|導出]]プロセス中に、証明が届かないブロックは、[[glossary/deposit-tree|デポジット]]のみを保持するブロックに置き換えられます。

トランザクションレベルでは違いがあります。[[glossary/EIP-8288|EIP-8288]]は署名と汎用プログラムに異なるスキームを与えますが、この概念実証 (PoC) ではそれらを分割せず、すべてのプログラムを単一のスキーム`0x20`の下に置きます。

[[glossary/Layer2|L2]]には証明が通過するパブリック[[glossary/Mempool|メムプール]]がないため、[[glossary/sequencer|シーケンサー]]がRPC経由でそれらを受け取り、[[glossary/sequencer|シーケンサー]]に接続されたコンポーネントであるop-aggregatorがそれらを再帰的にマージします。

集約を投稿するコストは、[[glossary/Layer2|L2]]が[[glossary/blob|ブロブ]]に課金する方法と同じです。トランザクションが宣言する依存関係ごとに2,048バイトの[[glossary/Layer-1|L1]]データ手数料が課金されます。

| [[glossary/EIP-8288|EIP-8288]] | この実装 |
| --- | --- |
| スキーム0x10、0x11 | スキーム0x20、任意のプログラムのステートメント |
| ヘッダー内の`recursive_stark` | バッチタイプ0x02として[[glossary/Layer-1|L1]]に投稿される集約 |
| ブロックごとに1つの証明 | 多くの[[glossary/Layer2|L2]]ブロックにわたる1つの集約 |
| 証明がないブロックは無効 | 証明がないブロックは[[glossary/deposit-tree|デポジット]]のみのブロックに置き換えられる |
| [[glossary/Mempool|メムプール]]ラッパーと再帰的集約 | [[glossary/sequencer|シーケンサー]]RPCとop-aggregator |
| `recursive_stark_gas` | [[glossary/Layer-1|L1]]データ手数料で2,048バイト |

## トランザクションフロー

[![image](https://ethresear.ch/uploads/default/optimized/3X/0/f/0fc1e6a786a1f6c84e764523deaea2dabcf9b1c5_2_690x388.jpeg)](https://ethresear.ch/uploads/default/original/3X/0/f/0fc1e6a786a1f6c84e764523deaea2dabcf9b1c5.jpeg "トランザクションフロー")

トランザクションは、それが依存する証明を依存関係として宣言します。依存関係とは、[[glossary/EIP-8288|EIP-8288]]の`(scheme, data_hash, verification_key_hash)`トリプルです。この投稿では、最後の2つを*ステートメント*と呼びます。これは、プログラムの検証鍵のハッシュと、そのプログラムが公開した出力のダイジェストです。例えば、[[glossary/leanSPHINCS|leanSPHINCS]]アカウントでは、依存関係は「この公開鍵がこのトランザクションに署名した」という署名プログラムのステートメントです。

エンドツーエンドのフローは以下のようになります。

1.  ユーザーはトランザクションとそのステートメント証明を[[glossary/sequencer|シーケンサー]]であるop-rethに送信します。ステートメントに応じて、証明は生の[[glossary/leanSPHINCS|leanSPHINCS]]署名か、ユーザーが作成した[[glossary/leanVM|leanVM]]証明のいずれかです。
2.  op-rethは、トランザクションをプールに入れる前にそれを検証するため、ユーザーは不正な証明でトランザクションをプッシュすることはできません。
3.  ブロックが[[glossary/Block-Building|構築]]されると、op-rethはその依存関係をop-aggregatorに渡します。
4.  op-aggregatorは、署名を一度に最大100個まで署名プログラムとともにリーフにバンドルし、ユーザーの証明を直接リーフとして受け取り、各ブロックのリーフを[[glossary/leanVM|leanVM]]ツリーの1つのルートにマージします。1つの集約は連続するブロックの区間をカバーします。
5.  区間の最後のブロックがマージされると、op-aggregatorはルートにシールと呼ばれる最終証明を添付してop-rethに返し、[[glossary/Batch-Publishing|バッチャー]]がそれを[[glossary/Layer-1|L1]]に投稿します。

集約はトランザクションが実行された後に[[glossary/Layer-1|L1]]に到達するため、実行中は宣言された依存関係は証明済みとして扱われます。op-rethはすでに証明を検証しているため、ブロックは[[glossary/sequencer|シーケンサー]]または[[glossary/prover|プルーバー]]が集約を生成できなかった場合にのみ置き換えられます。

[[glossary/Layer-1|L1]]には集約証明と、大きな署名の代わりに公開鍵とプログラム識別子を運ぶトランザクションが残ります。圧縮後、トランザクションは集約のステートメントリストの共有分を含めて100から129バイトになります。ルートとシールは、カバーするステートメントの数に関係なく約354KB、または圧縮後約322KBです。

## [[glossary/leanVM|leanVM]]と証明ツリー

[[glossary/leanVM|leanVM]]は、プログラムの実行を証明する[[glossary/zkVM|zkVM]]です。RISC-Vにコンパイルされたプログラムを実行すると、それが正しく実行されたことを証明する証明が生成され、その証明はハッシュのみから構築されます。

証明は再帰によってマージされます。「これら2つの証明は有効である」ことをチェックするプログラムを実行し、その実行を証明すると、2つの証明が1つになり、これを繰り返すことでツリーが生成されます。

| レイヤー | 実行内容 |
| --- | --- |
| リーフ | 1つのプログラム実行の証明。署名プログラムは100個の署名を検証する1つのリーフを作成します。 |
| ノード | その下の2つの証明を検証し、それらをマージします。 |
| ルート | 最上位ノードで、すべてのステートメントを表します。 |

[![image](https://ethresear.ch/uploads/default/optimized/3X/9/d/9df2c074256736bad09e77172e732d502b4124a8_2_690x388.jpeg)](https://ethresear.ch/uploads/default/original/3X/9/d/9df2c074256736bad09e77172e732d502b4124a8.jpeg "leanVMと証明ツリー")

[[glossary/EIP-8288|EIP-8288]]の再帰証明は、単一の固定鍵`AGGREGATED_VK`の下で任意のプログラムの証明を検証することを意図しています。[[glossary/leanVM|leanVM]]の集約ツリーは、まだ1つのプログラムの証明しかマージできないため、これを実行できません。また、[[glossary/EIP-8288|EIP-8288]]自体もこの部分がまだ確定しておらず、`LEANSTARK_SCHEME` (`0x11`) は予約されたままです。プライバシープールの証明は、これが解決されて初めて集約に参加できるため、この概念実証 (PoC) では、[[[glossary/leanVM|leanVM]]の[[glossary/fork|フォーク]]](https://github.com/sm-stack/leanVM/tree/op-stack/claim-set-leaves)でツリーを変更します。

最初の変更は、ツリーをプログラムから分離します。[上流の提案](https://github.com/leanEthereum/leanVM/pull/418)に基づき、プログラムはその検証鍵にコミットされ、ツリーの回路は特定のプログラムではなくサイズ制限によって固定されます。この回路のセットは*クラス*と呼ばれます。そのダイジェストはプロトコル定数であり、`AGGREGATED_VK`の役割を果たします。制限内のすべてのプログラムは同じ回路を通過するため、ルートは保持するプログラムの数に関係なく同じコストで検証されます。小さなプログラムは、はるかに大きなプログラムと回路を共有すると遅くなるため、リーフは小さな[[glossary/zk|ZK]]プログラム、署名、大きな[[glossary/zk|ZK]]プログラムの3種類に分けられます。

2番目の変更により、1つのリーフが多くのステートメントを証明できるようになります。リーフは値のリストを公開し、ツリーの第一層回路はプログラムの検証鍵ダイジェストを各値に添付します。このような各ペアが1つのステートメントです。署名もこのケースの1つです。署名プログラムは100個の署名を検証し、それぞれに対して`BLAKE2s("sphmem01" ‖ 公開鍵 ‖ メッセージ)`を公開するため、ツリーにとって署名は他のプログラムの出力と何ら変わりません。

この構造では、[[glossary/EIP-8288|EIP-8288]]のスキームをそのまま使用することはできません。`0x11`の`data_hash`は1つの証明の公開入力ハッシュであり、`0x10`の`verification_key_hash`は公開鍵ですが、ここでは`data_hash`はリストからの1つの値であり、`verification_key_hash`は常にプログラムの検証鍵ダイジェストです。したがって、署名とプログラムの両方が新しい1つのスキーム`0x20`の下に置かれます。

ルートを検証するには、検証者が回路に固定された値を自分で計算する必要がありますが、これはCannonで約100億ステップかかります。この概念実証 (PoC) では、それらを事前に約1KBのクラス鍵に計算し、残りのチェックはシールと呼ばれる別の証明に任せます。ルートとシールを合わせると、数ミリ秒で検証され、Cannonで約8億ステップかかります。1つのルートは、最大64個のプログラムから最大4,096個のステートメントを保持できます。

## アカウントと認証: [[glossary/EIP-8130|EIP-8130]]と[[glossary/EIP-8430|EIP-8430]]

この概念実証 (PoC) では、[[glossary/EIP-8141-frame-transaction|EIP-8141フレームトランザクション]]の代わりに、[[glossary/Layer2|L2]]に最初に到達する可能性が高い[[glossary/EIP-8130|EIP-8130]]の[[glossary/AA-Transaction-Type|AAトランザクション]] (タイプ`0x79`、[[glossary/EIP-8430|EIP-8430]]のフォーマット) を使用します。[[glossary/EIP-8130|EIP-8130]]では、アカウントは[[glossary/Keystore|キーストア]]コントラクトに、自身の代わりにトランザクションを承認できる当事者を登録します。これらの当事者はアクターと呼ばれ、オーセンティケーターと呼ばれるコントラクトがアクターの認証方法を決定します。

一般的なオーセンティケーターは、トランザクションに含まれる署名をオンチェーンで検証します。このアプローチでは[[glossary/post-quantum-signatures|PQ署名]]が[[glossary/Layer-1|L1]]まで伝播するため、この概念実証 (PoC) では、署名をトランザクションから除外する*ステートメントオーセンティケーター*を追加します。このオーセンティケーターのアクターは、プログラムの検証鍵、鍵、およびプログラムが公開するフォーマットを識別する8バイトのタグで構成されます。これは「このプログラムがこの鍵が承認したことを証明する」という意味です。

署名の代わりに、トランザクションはオーセンティケーターのアドレスと、これら3つの値を92バイトで運びます。これらとトランザクションの署名ハッシュ (送信者ハッシュ) から、ノードは依存関係`(0x20, BLAKE2s(タグ ‖ キー ‖ 送信者ハッシュ), 検証鍵ハッシュ)`を計算し、その依存関係が証明されると、その鍵がトランザクションを承認したとみなされます。署名は[[glossary/sequencer|シーケンサー]]にのみ送られ、そこで証明の[[glossary/Block-Building|構築]]に使用され、[[glossary/Layer-1|L1]]には決して到達しません。

[[glossary/leanSPHINCS|leanSPHINCS]]アカウントはこの構造の1つのケースです。プログラムは署名プログラム、タグは`"sphmem01"`、鍵は32バイトの公開鍵です。署名プログラムが公開するものは、この依存関係の`data_hash`と等しいため、署名が集約に含まれると、アカウント認証も完了します。FalconやML-DSAを検証するプログラム、または任意のポリシーをチェックするプログラムも、同様にアカウント鍵として機能できますが、この概念実証 (PoC) ではテストしていません。

トランザクションは、アカウント認証とは別に、他の証明に依存することもできます。プライバシープールでの転送はその一例です。このような依存関係は、トランザクションの`account_changes`の`0x04`エントリに最大256個まで宣言され、コントラクトは、この概念実証 (PoC) がトランザクションコンテキストプリコンパイルに追加した関数を通じてそれらを読み取り、自身のロジックでチェックします。

## 手数料メカニズム

この概念実証 (PoC) では、集約のコストはデータのみをカバーします。各依存関係は2,048バイトとしてカウントされ、[[glossary/Layer-1|L1]]データ手数料に追加されます。

```
dependency_l1_cost = 2048 × deps × (baseFeeScalar × l1BaseFee × 16 + blobFeeScalar × l1BlobBaseFee) / 1e6

```

`deps`は宣言された依存関係の数（重複を含む）と`STATEMENT`認証の合計です。手数料は[[glossary/Layer-1|L1]]の価格に従い、[[glossary/Layer-1|L1]]手数料ボルトに送られます。ユーザーが支払う2,048バイトは、トランザクションに含まれる署名の4.9KBよりも少ないため、同じ[[glossary/Layer-1|L1]]価格であれば、集約を使用する方が安価です。

[[glossary/Layer2|L2]]ガスは検証コストのみを保持します。署名プログラムで3,000、その他で30,000、さらに`STATEMENT`認証で`K1_AUTH_COST`の5,100が加算され、[[glossary/leanSPHINCS|leanSPHINCS]]の場合は合計8,100になります。

[[glossary/prover|プルーバー]]を実行するコストは、この手数料には含まれていません。単一のマシンがフル稼働している場合、計算コストは署名あたり約0.0000027ドルとなり、データコストに比べて小さいですが、マシンは負荷に関係なく稼働するため、負荷の低いチェーンではこれが相当な額になる可能性があります。[[glossary/zk|ZK]]証明コストを回収するために導入されたOP Stackの[[glossary/Operator|オペレーター]]手数料のバリアントのような解決策も考えられますが、この概念実証 (PoC) では扱っていません。

## 新しいバッチ提出ルール: Nブロックごとに1つの集約

OP Stackの[[glossary/Batch-Publishing|バッチャー]]は、チャネルがターゲットサイズに達するか、`max-channel-duration`が経過するとチャネルを閉じ、提出します。どちらの条件も証明とは関係がないため、この概念実証 (PoC) では、集約が準備できたときにチャネルを閉じるように提出ルールを変更します。

新しいルールはブロック番号に基づいて機能します。設定された値Kに対して、区間は`(ブロック番号 + 1) % K == 0`となるブロックで終了します。ブロック時間が2秒のチェーンでK=12の忙しいチェーンでは、これは24秒ごとに1つの集約を意味します。依存関係を持つブロックを含むチャネルは、境界まで`max-channel-duration`を超えても開いたままになります。その後、チャネルは閉じられ、集約がそれに結合するのを短時間待ちます。集約がそのウィンドウを逃した場合、チャネルはそれなしで提出され、集約は次のチャネルに入ります。

いくつかの例外があります。境界前にサイズ制限に達したチャネルは早期に閉じられ、次のチャネルは同じ境界まで実行されます。[[glossary/sequencer|シーケンシング]]ウィンドウの終了が近づいているチャネルはすぐに提出されます。依存関係のないブロックを持つチャネルは、既存のルールに従います。

[[glossary/sequencer|シーケンサー]]、[[glossary/prover|プルーバー]]、[[glossary/Batch-Publishing|バッチャー]]はそれぞれ独自に境界を計算するため、同期を保つべき状態はありません。[[glossary/prover|プルーバー]]が遅れても、集約は後で到着しますが、同じ数のブロックをカバーするため、スループットは影響を受けません。[[glossary/Derivation|導出]]は集約の`through`フィールドのみを読み取るため、これは[[glossary/Batch-Publishing|バッチャー]]の変更であり、[[glossary/consensus|コンセンサス]]の変更ではありません。

Kの選択は、コストとスループットのトレードオフです。集約は保持する量に関係なく約322KBを占めるため、12秒ごとに1つを投稿すると[[glossary/Layer-1|L1]]ブロックあたり2.5[[glossary/blob|ブロブ]]のコストがかかりますが、24秒ごとに1つを投稿すると1.2[[glossary/blob|ブロブ]]のコストがかかります。反対に、集約は最大4,096個のステートメントを保持するため、Kを大きくすると各ブロックに含めることができるステートメントの数が減り、この機能を使用するトランザクションのスループットが制限される可能性があります。

## 新しい運用コンポーネント: op-aggregator

証明はすべてのコアと数GBのメモリを消費するため、この概念実証 (PoC) では、それを[[glossary/sequencer|シーケンサー]]からop-aggregatorという別のプロセスに移動します。op-aggregatorは、op-rethから認証されたRPC経由で各ブロックの署名と証明を読み取り、集約を[[glossary/Block-Building|構築]]し、それを返します。

作業には異なる制約を持つ2つの部分があります。実行中のルートにブロックをマージする作業は、一度に1ブロックずつ順番に行う必要があります。それ以下のすべての作業、つまりブロックのリーフを証明し、それらを小さなツリーに結合する作業は、そのブロックのみに依存するため、並行して事前に実行できます。op-aggregatorはこの線に沿って作業を分割します。メインプロセスがマージを行い、別のヘルパープロセスが今後のブロックを事前に証明します。その後、メインプロセスは各ブロックの小さなツリーの最上位のみをルートにマージするため、順序付けされたステップはブロックのサイズに関係なくブロックごとに1回だけ発生します。

セクション3の結果は、単一の32vCPUマシンでこのセットアップを使用しており、スループットは主にリーフとノードの証明に費やされるCPU時間によって制限されます。例えば、ヘルパーはメインプロセスが返す証明を検証するため、信頼されることなく他のマシンで実行できるなど、さらなるスケーリングの余地があると考えられますが、現在の実装では同じマシン上で子プロセスとして起動するだけです。GPUも別の選択肢となり得ます。ノード証明のCPU時間の約3分の1は[[glossary/Number-Theoretic-Transform|NTT]]に、28%はBLAKE2sに費やされており、どちらも高速化の候補ですが、[[glossary/leanVM|leanVM]]にはまだGPU[[glossary/prover|プルーバー]]がありません。

ただし、マシンの数を増やしても、集約の4,096ステートメントという制限は変わりません。そのスループットを超えるには、集約をより頻繁に投稿するためにKを減らすか、より多くのステートメントを保持できるように[[glossary/leanVM|leanVM]]ツリーを改善する必要があります。

## 集約と[[glossary/Derivation|導出]]

集約は、新しいバッチタイプ`0x02`として[[glossary/Batch-Publishing|バッチャー]]チャネルに含まれ、以下のフィールドを持ちます。これは`through`までのブロックで宣言された依存関係を証明します。

| フィールド | 内容 |
| --- | --- |
| `version` | フォーマットバージョン |
| `through` | この集約が対応する最後の[[glossary/Layer2|L2]]ブロック |
| `aggregation_vkey_hash` | ツリーのクラス鍵のダイジェスト。プロトコル定数と等しくない場合は無効 |
| `statements` | 証明されたステートメント |
| `proof` | ルートとシールのRLP。1MiBを超える場合はデコードしないと無効 |

[[glossary/Derivation|導出]]は通常、バッチを読み込むとすぐにブロックに変換します。これは依存関係を持つブロックには機能しません。なぜなら、ブロックの有効性は[[glossary/Layer-1|L1]]に後で現れる集約に依存するからです。そこで、この概念実証 (PoC) では、*依存関係ゲート*と呼ばれる[[glossary/Derivation|導出]]ステージを追加します。依存関係を持つバッチが到着すると、ゲートはそれを保持し、スキャナーが[[glossary/Layer-1|L1]]データを先読みして、ブロックをカバーする集約を見つけます。

ブロックBのバッチが[[glossary/Layer-1|L1]]ブロックIで読み込まれた場合、スキャナーはIとI + 100の間で完了したチャネルをデコードします。これは約20分間の[[glossary/Layer-1|L1]]ブロックに相当します。パイプラインのフレームとチャネルルールを使用しますが、パイプラインとは別に実行されます。Bに到達する最初の集約がBの責任を負うものです。この選択はIと[[glossary/Layer-1|L1]]データのみに依存するため、チェーンを追跡するノードと、任意のブロックから開始する[[glossary/ZK-Fraud-Proof|不正証明]]は同じ結果を得ます。

その集約が見つかると、その証明が検証され、ブロックの各依存関係がそのステートメントリストと照合されます。すべてが存在する場合、バッチは変更されずに使用されます。いずれかが欠落している場合、ブロックは無効とみなされ、無効なメッセージを持つブロックをOPインターオペラビリティが処理するのと同じ方法で、[[glossary/deposit-tree|デポジット]]のみを含むブロックに置き換えられます。

## [[glossary/ZK-Fraud-Proof|不正証明]]における集約の検証

この概念実証 (PoC) のOP Stackチェーンは[[glossary/Optimistic-Rollup|オプティミスティックロールアップ]]として[[glossary/Block-Building|構築]]されているため、集約検証も[[glossary/ZK-Fraud-Proof|不正証明]]内で再現可能である必要があります。紛争では、konaはCannon (MIPS64) 上で[[glossary/Derivation|導出]]を再実行します。依存関係ゲートとスキャナーは通常通り実行され、[[glossary/Layer-1|L1]]データ内で責任ある集約を見つけ、Cannon内で[[glossary/leanVM|leanVM]]証明を検証します。

Cannonで[[glossary/leanVM|leanVM]]証明を検証する最大のコストはクラス鍵から来ます。鍵がツリーの固定値を直接保持する場合、60MBに達し、4,096個のステートメントからなる1つの集約を検証するには、約42億ステップと275MiBが必要です。約1KBのクラス鍵と前述のシールを使用することで、この概念実証 (PoC) は1つの集約の検証を約8億ステップと13〜14MiBに削減します。完全な紛争状態遷移は、約20億ステップと約70MiBを要し、Cannonのトレース制限である約2^{42}ステップをはるかに下回ります。

ブロックの決定には[[glossary/Layer-1|L1]]データがI + 100までかかる場合があるため、[[glossary/dispute-game|紛争解決ゲーム]]の[[glossary/Layer-1|L1]]ヘッドもそのブロックに到達する必要があります。したがって、ゲートはその決定に使用した[[glossary/Layer-1|L1]]ブロックを記録し、ブロックはその[[glossary/Layer-1|L1]]ブロックから[[glossary/Derivation|導出]]されたものとみなされます。チャレンジャーはこの値を使用して、主張がゲームの[[glossary/Layer-1|L1]]ヘッドで証明できるかどうかを判断します。

このパスをカバーするために3つのエンドツーエンドテストが用意されています。後続の集約によって対応されるブロックの状態遷移を証明するkona[[glossary/ZK-Fraud-Proof|不正証明]]プログラム、集約が到着しなかったために置き換えられたブロックを証明する同じプログラム、そして攻撃者が集約検証内の単一命令まで[[glossary/bisection|バイセクション]]で絞り込み、正直なチャレンジャーがそれをCannonで実行し、オンチェーンステップで反論する実際の[[glossary/dispute-game|紛争解決ゲーム]]です。

# 3. 結果

## スループットと[[glossary/blob|ブロブ]]

測定はAWS c7a.8xlarge (32 vCPU) 1台で、2秒チェーン上で[[glossary/leanSPHINCS|leanSPHINCS]]署名を使用し、12ブロックごと、つまり24秒ごとに1つの集約を行いました。[[glossary/blob|ブロブ]]は[[glossary/Layer-1|L1]]ブロックあたりの平均値で、集約サイズとトランザクションの圧縮率から計算されています。

[![image](https://ethresear.ch/uploads/default/optimized/3X/0/7/07c2ae4f88782763da8dd5678315840b463ca114_2_690x388.jpeg)](https://ethresear.ch/uploads/default/original/3X/0/7/07c2ae4f88782763da8dd5678315840b463ca114.jpeg "スループットとブロブ")

| ブロックあたりの署名数 | 秒あたりの署名数 | 集約あたりの署名数 | [[glossary/blob|ブロブ]]数 | 署名インラインの場合の[[glossary/blob|ブロブ]]数 |
| --- | --- | --- | --- | --- |
| 85 | 43 | 1,020 | 1.6–1.7 | 20 |
| 170 | 85 | 2,040 | 2.0–2.2 | 39 |
| 255 | 127 | 3,060 | 2.4–2.8 | 59 |
| 340 | 170 | 4,080 | 2.8–3.3 | 79 |

[[glossary/prover|プルーバー]]はあらゆる負荷でチェーンに追随し、12ブロック間隔の制限であるブロックあたり340個では、2回の測定で同じ結果が得られました。より高い負荷では、1台のマシンは毎秒約180〜195個で頭打ちになります。計算コストは100万署名あたり約2.7ドルです。

署名がインラインの場合、[[glossary/Post-Quantum|PQ]]遷移は[[glossary/Layer-1|L1]]の容量に収まりません。1つの[[glossary/blob|ブロブ]]は26個の[[glossary/Zero-Knowledge-Proof|PQトランザクション]]を保持するため、毎秒170個では[[glossary/Layer-1|L1]]ブロックあたり79個の[[glossary/blob|ブロブ]]が必要となり、今日の[[glossary/Layer-1|L1]]の[[glossary/blob|ブロブ]]制限21のほぼ4倍です。[[glossary/Layer-1|L1]]上のすべての[[glossary/blob|ブロブ]]を使用する単一のチェーンでさえ、毎秒約45個しか達成できません。

集約を使用すると、同じ負荷が2.8から3.3個の[[glossary/blob|ブロブ]]に収まります。これは署名がインラインの場合よりも96%少なく、同じトランザクションがECDSAを使用した場合の1.5から1.8倍です。[[glossary/Post-Quantum|PQ]]署名への移行コストは43倍から2倍未満に減少します。6[[glossary/blob|ブロブ]]チャネルで測定すると、署名がインラインの場合は155トランザクションが収まりますが、この構造では約3,550から4,096トランザクションが収まります。

コストの形状も変化します。署名がインラインの場合、[[glossary/blob|ブロブ]]は署名に直接比例して増加します。ここでは、証明の割合は署名がいくつあっても[[glossary/Layer-1|L1]]ブロックあたり約1.2[[glossary/blob|ブロブ]]に留まり、残りはトランザクションとステートメントリストからのデータです。したがって、負荷が高まるにつれて、この構造はより効果を発揮します。毎秒43個ではECDSAの3.5から3.8倍、毎秒170個では1.5から1.8倍となり、24秒間隔で毎秒約3個からインライン署名を上回ります。[[glossary/zk|ZK]]プログラム証明は署名と同じ集約に入るため、アプリケーションが増えてもこの固定された割合が増加することはありません。

# 4. 実際のアプリケーションコスト

この構造上で[[glossary/Post-Quantum|PQ]]証明に依存する実際のアプリケーションを実行するには、どれくらいのコストがかかるでしょうか？それを知るために、Privacy Boost ([`sunnyside-io/privacy-boost-protocol`](https://github.com/sunnyside-io/privacy-boost-protocol)) と[[glossary/leanSPHINCS|leanSPHINCS]]アカウントを移植し、[[glossary/devnet|開発ネットワーク (devnet)]]で実行しました。

Privacy Boostは、ユーザーの転送内容を隠し、[[glossary/zk|ZK]]証明でそれらが有効であることを示すプールです。現在、コントラクトで[[glossary/Groth16-proof|Groth16]]証明を検証しています。[[glossary/Groth16-proof|Groth16]]はペアリングベースであり[[glossary/Post-Quantum|PQ]]ではないため、量子耐性を得るには証明システムを変更する必要がありますが、[[glossary/leanVM|leanVM]]証明を直接[[glossary/Layer-1|L1]]に投稿することは現実的ではありません。1つの証明は約430KiB、つまり3.4[[glossary/blob|ブロブ]]であるため、転送ごとに1つの証明を使用すると、この1つのプールが[[glossary/Layer-1|L1]]の全21[[glossary/blob|ブロブ]]を使用しても、[[glossary/Layer-1|L1]]ブロックあたり6転送、つまり毎秒0.5転送が上限となります。

そこで、[[glossary/Groth16-proof|Groth16]]検証者は[[glossary/EIP-8288|EIP-8288]]ステートメントをチェックするコントラクトに置き換えられます。コントラクトはもはや証明を受け取らず、トランザクションが正しいステートメントに依存していることのみをチェックします。Privacy Boostサーバーは証明を作成して[[glossary/sequencer|シーケンサー]]に送信し、それが集約に含まれます。その結果、単一の転送が[[glossary/Layer-1|L1]]手数料で支払うバイト数は、約445KBから約5.1KBに減少し、約86分の1に削減されます。

[[glossary/leanSPHINCS|leanSPHINCS]]アカウントも同様に機能します。署名がトランザクションに含まれる場合、約5KBの署名が[[glossary/Layer-1|L1]]に送られる必要があり、その上、コントラクトはMerkleパスを含めて497回のハッシュを実行する必要があります。これは生の署名を使用するよりもはるかに高速ですが、[[glossary/SPHINCS|SPHINCS-]]署名 (keccakバリエーション) の検証には転送あたり10万ガス以上かかります。この構造では、ユーザーは署名を作成するだけでop-aggregatorが証明を行うため、[[glossary/Layer-1|L1]]手数料のバイト数は約2.2KBに、[[glossary/Layer2|L2]]ガスは35,250に減少し、約6.6倍の削減となります。

| トランザクション | [[glossary/Layer2|L2]]ガス | 直接投稿した場合の[[glossary/Layer2|L2]]ガス | [[glossary/Layer-1|L1]]手数料バイト | 直接投稿した場合の[[glossary/Layer-1|L1]]バイト |
| --- | --- | --- | --- | --- |
| [[glossary/leanSPHINCS|leanSPHINCS]]アカウントからの転送 | 35,250 | ~100,000 | ~2.2 KB | ~5 KB |
| プライバシープールでの1回の転送 | ~330,000 | 測定不能 | ~5.1 KB | ~445 KB |

# 5. 今後の作業

この概念実証 (PoC) は、トランザクション認証のみを証明に移行します。チェーンは依然として[[glossary/Optimistic-Rollup|オプティミスティックロールアップ]]であり、状態遷移は紛争時のみCannonで再実行され、集約はバッチに含まれ、[[glossary/blob|ブロブ]]スペースを占有します。この構造は、[[glossary/leanVM|leanVM]]がまだ長い実行を証明できないことと、[[glossary/Layer-1|L1]]が[[glossary/EIP-8288|EIP-8288]]を実装していないという2つの制限から生じており、これらが解消されれば変更可能です。

[[glossary/leanVM|leanVM]]に継続が導入されれば、状態遷移も証明できるようになります。現在、1つの実行は1つの証明であり、証明サイズには上限があるため、長い実行をリンクされた証明に分割することはできません。ブロック実行を証明するプログラムが再帰的に集約を検証すれば、チェーンは完全な[[glossary/zk-rollup|ZKロールアップ]]となり、Cannon[[glossary/ZK-Fraud-Proof|不正証明]]や別途投稿される集約は不要になります。なぜなら、証明はもはや各チャネルに従う必要がなく、はるかに少ない頻度で投稿できるからです。集約が占める[[glossary/Layer-1|L1]]ブロックあたり約1.2[[glossary/blob|ブロブ]]がなくなれば、毎秒170個で必要な[[glossary/blob|ブロブ]]数は2.8〜3.3から1.6〜2.0に減少し、6[[glossary/blob|ブロブ]]チャネルは約6,000〜7,800トランザクションを保持でき、ECDSAの約6,600に近づきます。

[[glossary/Layer-1|L1]]に[[glossary/EIP-8288|EIP-8288]]が導入されれば、[[glossary/zk-rollup|ZKロールアップ]]への移行前でも集約は[[glossary/blob|ブロブ]]から離れることができます。予約されている[[glossary/STARK|leanSTARK]]スキーム`0x11`が有効になれば、[[glossary/Layer2|L2]]の証明は[[glossary/Layer-1|L1]]トランザクションの依存関係となり、[[glossary/Mempool|メムプール]]を介して移動し、[[glossary/Layer-1|L1]]ブロックの1つの`recursive_stark`にマージされる可能性があります。

ツリー自体にも改善の余地があります。同じマシンで署名リーフのみを証明すると毎秒421個に達しますが、マージステップを含めるとスループットは毎秒約180〜195個で止まります。今日のツリーのすべてのノードは同じ回路を使用しているため、最も低いノードでさえ4,096個のステートメントを意図したサイズで証明されており、これが制限を16,384個に引き上げるとスループットが36%低下する理由でもあります。下位層を実際に保持するサイズに合わせた小さな回路で証明し、上位層のみで大きな回路を使用することで、スループットと容量を同時に向上させることができると考えられます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/its-time-to-scale-the-trust-eip-8288-on-op-stack/26208)
