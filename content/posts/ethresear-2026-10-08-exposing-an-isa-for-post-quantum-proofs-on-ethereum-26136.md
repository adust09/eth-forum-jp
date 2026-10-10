---
title: Ethereumにおけるポスト量子証明のためのISA公開
original_title: Exposing an ISA for post-quantum proofs on Ethereum
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/exposing-an-isa-for-post-quantum-proofs-on-ethereum/26136
author: soispoke
date: '2026-10-08'
category: Cryptography
tags:
  - cryptography
  - zk
  - post-quantum
  - evm
  - protocol-design
  - eip
  - isa
  - zkvm
topic_id: '26136'
translated_at: '2026-10-10'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Exposing an ISA for post-quantum proofs on Ethereum](https://ethresear.ch/t/exposing-an-isa-for-post-quantum-proofs-on-ethereum/26136) — soispoke (2026-10-08)

*議論、フィードバック、コメントをいただいた[Justin](https://x.com/drakefjustin)、[Vitalik](https://x.com/VitalikButerin)、[Kev](https://x.com/kevaundray)、[Alex](https://x.com/alexanderlhicks)、[Tau](https://x.com/TauLepton_)、[Ignacio](https://x.com/ignaciohagopian)に感謝します。*

[[glossary/EIP-8288|EIP-8288]]は、[[glossary/EVM|EVM（イーサリアム仮想マシン）]]の外部で検証される[[glossary/Post-Quantum|ポスト量子]]署名（[[glossary/leanSPHINCS|leanSPHINCS（リーンSPHINCS）]]）および[[glossary/STARK|STARK証明]]（leanSTARK）にトランザクションが依存できるようにします。それぞれは、[[glossary/EIP-8141|EIP-8141]]の[[glossary/Frame-Transactions|フレームトランザクション]]の依存関係フレームで宣言され、ノードがトランザクションを転送する前にチェックされます。そして、各ブロックは、そのすべての依存関係が有効であることを証明する単一の[[glossary/Recursive-STARK|再帰的STARK]]を運びます。

これにより、プライバシーアプリケーションは、その証明を大規模に[[glossary/Post-Quantum|ポスト量子]]セキュアにするネイティブな方法を得ます。今日、プライバシープールは、[[glossary/BN254|BN254]]ペアリング[[glossary/Precompile-target|プリコンパイル]]を使用してコントラクト内で[[glossary/Groth16-proof|Groth16証明]]を検証しており、BN254を破る量子コンピューターはそのような証明を偽造する可能性があります。EIP-8288を使用すると、ノードはユーザーが自身のデバイスで作成した証明を検証します。プールコントラクトは、検証者（verifier）を実行する代わりに、トランザクションが期待される公開入力を持つ自身の回路の証明に依存していることをチェックし、その後その状態を更新するだけです。

EIP-8288は現在、各証明の背後にある計算を検証鍵ハッシュ（verification key hash）によって識別しています。これは、イーサリアムが何を公開するかを決定するまでの一時的なプレースホルダーです。証明レベルの検証鍵は、leanSTARK証明を生成するzkVMである[[glossary/leanVM|leanVM]]の証明システムが更新されるたびに変更され、アップグレードできないプールを破壊することになります。代わりに、各証明は、プログラムが正しく実行されたことを示すことができます。例えば、プールの支出がそのルールに準拠しているかをチェックするコードなどです。依存関係はそのプログラムのハッシュを名前として持ち、すべてのアプリケーションの証明は同じ固定ルール（関係）に対してチェックされます。しかし、イーサリアムは、これらのプログラムが書かれる命令セット（ISA）を選択しなければなりません。その選択は、ユーザーがデバイス上でどれだけ速く証明できるか、新しい暗号化アプリケーションが新しい[[glossary/Precompile-target|プリコンパイル]]を待つことなく何を使用できるか、そして[[glossary/immutable-contract|不変コントラクト]]がそれに依存する限り、イーサリアムが何をサポートし続けなければならないかを決定します。今日の最も近い取り組みは、[[glossary/EVM-assembly|EVMアセンブリ (evm-asm)]]であり、各[[glossary/EVM|EVM]]オペコード（opcode）に対するRISC-Vコードが[[glossary/EVM|EVM]]仕様（spec）に従っていることを証明します。これは、各プログラムに対してではなく、すべてのプログラムに対して一度行われ、まだ完成していません。

この記事では、イーサリアムが公開できる3つのISA、すなわち[[glossary/EVM|EVM]]、RISC-V、および証明用に設計されたイーサリアムISA（eISA）を比較します。どれが最適かは、主に[[glossary/leanVM|leanVM]]自体が何をネイティブに実行するかに依存します。次に、公開されたISAが[[glossary/immutable-contract|不変スマートコントラクト]]を壊すことなく時間とともにどのように変化できるかを説明し、これに必要なEIP-8288における唯一の変更、すなわちその汎用leanSTARKスキームを、プログラムとそのISAバージョンを識別するスキームに置き換えることを記述します。

## 3つの候補ISA

3つの候補は、主に準備状況と証明効率をトレードオフします。[[glossary/EVM|EVM]]はイーサリアムがすでに維持しているため、最初にリリースできます。ユーザーのプルーバー（prover）は[[glossary/EVM|EVM]]プログラムを直接実行するのではなく、自身のISA（例えばRISC-V）にコンパイルされた1つの固定[[glossary/EVM|EVM]]インタープリターを実行し、そのインタープリターがすべての[[glossary/EVM|EVM]]プログラムを実行します。オペコードは1つずつ解釈されるため、証明が遅くなりますが、[[glossary/Precompile-target|プリコンパイル]]呼び出しはインタープリター自身のコンパイル済みコードとして実行され、RISC-Vプログラムでのコストとほぼ同じです。したがって、新しい暗号化は[[glossary/EVM|EVM]]コードで解釈コストを支払うか、新しい[[glossary/Precompile-target|プリコンパイル]]を必要とします。[[glossary/EVM|EVM]]は1つしかないため、これは[[glossary/Layer-1|L1]]に追加される必要があります。

RISC-Vはその中間に位置します。[[glossary/EVM|EVM]]よりもリリースは遅いですが、証明は速いです。最大のzkVMエコシステムとツールを持ち、RISC-Vプルーバーはそのプログラムを直接実行するため、新しい暗号化はネイティブ速度で証明される通常のコードであり、新しい[[glossary/Precompile-target|プリコンパイル]]は必要ありません。しかし、イーサリアムはまず、zkVM標準が未定としている部分、例えばメモリマップ（プログラムのコード、データ、スタックがどのメモリアドレスを占めるか）を特定する必要があります。これは、コンパイルされたプログラムにはこれらのアドレスが組み込まれているためです。

eISAは、イーサリアムが証明用に設計するISAです。メモリ上で直接動作するRISCに着想を得た命令セットであるValidaのように見えるかもしれませんし、プルーバーのフィールド上で6つの命令しか持たない[[glossary/leanVM|leanVM]]自身の[[glossary/leanISA|leanISA]]のように見えるかもしれません。プルーバーに近いほど証明コストは安くなりますが、プルーバーの変更に伴い新しいバージョンが必要になる可能性が高く、イーサリアム向けに設計されたeISAはまだありません。さらに一歩進んで、イーサリアムはAIR（[[glossary/STARK|STARK]]がチェックする多項式制約）のような制約フォーマットを公開し、各アプリケーションが独自のマシンと[[glossary/Precompile-target|プリコンパイル]]を持ち込むことを許可することもできます。しかし、これらの制約はプルーバーのフィールド上で書かれているため、もし後のプルーバーが異なるフィールドを使用した場合、そのプルーバーが古いものをエミュレートしない限り、すべての[[glossary/immutable-contract|不変プール]]は壊れてしまいます。

これらのどれが理にかなっているかは、[[glossary/leanVM|leanVM]]が最終的にネイティブに何を動かすかに依存し、そのリポジトリはRISC-Vと自身の[[glossary/leanISA|leanISA]]という2つのオプションを検討しています。[[glossary/leanVM|leanVM]]がRISC-Vを実行する場合、RISC-Vプログラムはインタープリターを必要とせず、eISAは後のプルーバーがRISC-Vから離れる場合にのみ重要になります。[[glossary/leanVM|leanVM]]が[[glossary/leanISA|leanISA]]を実行する場合、イーサリアムは[[glossary/leanISA|leanISA]]を直接公開するか、[[glossary/leanISA|leanISA]]が変更され続ける可能性が高い場合はその上にeISAを公開することができます。その場合、RISC-Vはインタープリターを必要とします。[[glossary/EVM|EVM]]はいずれの場合もインタープリターを必要とします。以下の表は、[[glossary/leanVM|leanVM]]が今日のRISC-VブランチのようにRISC-V（RV64IM）を実行し、1つの固定された関係の下で任意のRISC-Vプログラムを証明できると仮定しています。

| | EVM | RISC-V* | eISA |
| --- | --- | --- | --- |
| 証明効率 | [[glossary/Precompile-target|プリコンパイル]]が重い作業を行う場合、手書きバイトコードでRISC-Vの約2倍。[[glossary/EVM|EVM]]コードが行う場合、78〜163倍。 | ネイティブ速度。ただし、ハッシュにはzkVM[[glossary/Precompile-target|プリコンパイル]]が必要。 | プルーバーがネイティブに実行できるようになれば最高だが、まだ測定されていない。 |
| 新しいプリミティブ（例：新しい署名スキーム） | [[glossary/EVM|EVM]]コード（BLAKE2sで78〜163倍のサイクル）または新しい[[glossary/Layer-1|L1]][[glossary/Precompile-target|プリコンパイル]] | ネイティブ速度の通常のコード | コンパイラがターゲットとすれば通常のコード |
| 安定性コスト | 低い。[[glossary/Layer-1|L1]]がすでに各[[glossary/fork|フォーク]]のルールを定義しているため。ただし、インタープリターは古いプログラムのためにそれらすべてを維持する必要がある。 | 低い。ベースISAは固定されているため。ただし、公開されたすべてのzkVM[[glossary/Precompile-target|プリコンパイル]]は永久にサポートされなければならない。 | 高い。プルーバーの進化に伴い、新しいバージョンが必要になる可能性が高いため。 |
| 社会的コンセンサス | 最も容易だが、新しいハッシュ[[glossary/Precompile-target|プリコンパイル]]が必要になる可能性あり。 | 中程度。zkVM標準が開始点となる。 | 最も困難。 |
| [[glossary/leanVM|leanVM]]との不一致 | 常にインタープリターが必要。 | 小さい。[[glossary/leanVM|leanVM]]は、イーサリアムが固定するメモリマップを使用するだけでよいため。 | [[glossary/leanVM|leanVM]]がネイティブに実行するまでインタープリターが必要。 |
| ツーリング | Solidity、Yul、[[glossary/EVM|EVM]]ツール | コンパイラ、暗号ライブラリ、Sail形式モデル | 新しいコンパイラが必要。ValidaがRustとC向けにLLVM上に構築したものなど。 |
| [[glossary/Formal-Verification|形式検証]] | 最も大規模。各[[glossary/fork|フォーク]]の[[glossary/EVM|EVM]]ルール、インタープリター、[[glossary/Precompile-target|プリコンパイル]]をカバー。 | 今日では最小。Sailでモデル化された1つの固定ISAと公開されたzkVM[[glossary/Precompile-target|プリコンパイル]]。 | 新しい仕様の記述が必要。ただし、[[glossary/leanISA|leanISA]]は6つの命令しかなく、そのうちの1つはBLAKE2s圧縮。 |
| 準備状況 | インタープリターが時間内に[[glossary/Formal-Verification|形式検証]]できれば最も早い。ルールはすでに存在するため。 | 標準が未定としている部分（メモリマップなど）の仕様が必要。 | まず設計が必要。 |
| パス依存性 | [[glossary/Layer-1|L1]][[glossary/Precompile-target|プリコンパイル]]をさらに追加する圧力。 | eISAが続く場合、技術的負債。 | 存在しないものへの賭け。 |

> \* RISC-Vとは、[Ethereum zkVM Standards](https://github.com/eth-act/zkevm-standards)ターゲットにおけるRV64IMに、Keccak-256など、標準リストから公開するzkVM[[glossary/Precompile-target|プリコンパイル]]を加えたものを指します。この標準は、一部の実行ゲストプログラムが依存するアラインメントされていないアクセス（Zicclsm）も要求しますが、イーサリアム向けに書かれたカノニカルゲストはそれを必要としません。公開するzkVM[[glossary/Precompile-target|プリコンパイル]]はすべて、[[glossary/leanVM|leanVM]]との不一致、安定性コスト、および[[glossary/Formal-Verification|形式検証]]の作業を増加させます。

[[glossary/EVM|EVM]]の数値は、[[glossary/leanVM|leanVM]]のRISC-Vブランチ（[https://github.com/leanEthereum/leanVM/tree/1096dedfbe29c72cfff2a2d8d8b420e6ff0d9f2d](https://github.com/leanEthereum/leanVM/tree/1096dedfbe29c72cfff2a2d8d8b420e6ff0d9f2d)）で同じプライバシープール支出をRISC-Vプログラムとして、また[[glossary/EVM|EVM]]プログラムとして証明した[ベンチマーク](https://soispoke.github.io/evm-spend-challenge/explainer.html)に基づいています。支出の唯一の重い操作はBLAKE2sであり、このブランチではカスタム命令で計算されます。[[glossary/EVM|EVM]]プログラムがそれを使用できるようにするため、[[glossary/fork|フォーク]]がBLAKE2s[[glossary/Precompile-target|プリコンパイル]]を追加すると仮定しました（[[glossary/Layer-1|L1]]の`0x09`はBLAKE2bを計算します）。これにより、私たちの[[glossary/EVM|EVM]]バイトコードは、同じ命令を使用するRISC-Vプログラムの約2倍のサイクルを要し、証明時間は2.3倍になります。これは[[glossary/EVM|EVM]]のベストケースに近いものです。バイトコードは手書きであり、唯一の重い操作は[[glossary/Precompile-target|プリコンパイル]]でカバーされています。その[[glossary/Precompile-target|プリコンパイル]]がない場合、[[glossary/EVM|EVM]]コードで書かれたBLAKE2sは、ベース命令でハッシュするRISC-Vプログラムの78〜163倍のサイクルを要し、RISC-Vに事前にコンパイルされた場合でも17〜20倍かかります。これは[[glossary/EVM|EVM]]が256ビットワードで動作するためです。

どのISAを選択しても、プルーバーは依然として同じ機能、すなわち[[glossary/Zero-Knowledge-Proof|ゼロ知識証明]]、継続（長い実行を分割して証明する）、依存関係証明を集約するための再帰、およびプログラムが呼び出すための高速ハッシュを必要とします。[[glossary/leanVM|leanVM]]はそのハッシュをまだ選択しておらず、SHA-2、SHA-3、BLAKE3を検討している間、BLAKE2sをプレースホルダーとして使用しています。もし[[glossary/Layer-1|L1]]がすでに持っているハッシュ（SHA-256など）を選択した場合、[[glossary/EVM|EVM]]プログラムもプールも新しい[[glossary/Precompile-target|プリコンパイル]]を必要としません。BLAKE2sを維持する場合、[[glossary/EVM|EVM]]プログラムはそれを必要とし、オンチェーンでBLAKE2sを使用するプール（例えば、[[glossary/Merkle-Patricia-Trie|Merkleツリー]]を更新するため）も同様です。

## 公開されたISAのアップグレード

アップグレードできないプライバシープールは、公開されたISAやプルーバーが変更されても、資金を保持している限り、ユーザーの証明を受け入れ続ける必要があります。

これは、各プログラムのIDにそのISAバージョンが含まれる場合に機能します。`program_id = hash(ISA version, program bytes)` は、後の[[glossary/fork|フォーク]]が決して変更しないハッシュで計算されます。[[glossary/EVM|EVM]]プログラムのバージョンは、その[[glossary/fork|フォーク]]です。RISC-Vの場合、バージョンは、zkVM標準が各zkVMに委ねるもの（メモリマップやプログラムがzkVM[[glossary/Precompile-target|プリコンパイル]]を呼び出す方法など）も固定する必要があります。プールコントラクトはこの`program_id`を保存し、バージョンの既存の挙動は[[glossary/fork|フォーク]]がそれをアクティブ化すると決して変更されないため、`program_id`は常に同じルールで実行される同じプログラムを意味します。[[glossary/Layer-1|L1]]と同様に、[[glossary/fork|フォーク]]は命令やzkVM[[glossary/Precompile-target|プリコンパイル]]を追加できますが、プログラムがすでに観測できるものへの変更には新しいバージョンが必要です。[[glossary/Layer-1|L1]]は、コントラクトが最新の[[glossary/fork|フォーク]]のルールに従うことを許可します。これは、そのコードがオンチェーンにあり、コア開発者が[[glossary/fork|フォーク]]がどのコントラクトを破壊するかを確認できるためです。プールのプログラムはオンチェーンにないため、そのような変更がそれに何をもたらすかを誰もチェックできません。そのため、作成されたルールを維持します。

その後、プロトコルはアクティブ化されたすべてのバージョンを証明可能に保つ必要があります。現在のプルーバーは、各プログラムをそのプログラム自身のバージョンで実行するため、ユーザーは常に現在のプルーバーで証明し、ノードは現在の[[glossary/fork|フォーク]]の検証者のみで各証明をチェックします。

| 変更 | 既存のプログラム | 新しいプログラム |
| --- | --- | --- |
| 新しい命令またはzkVM[[glossary/Precompile-target|プリコンパイル]] | [[glossary/Layer-1|L1]]と同様に、それを呼び出さない限り影響なし。 | 使用可能。 |
| 既存の挙動の変更（新しいバージョン） | 自身のバージョンを維持。 | 新しいバージョンを使用。 |
| 新しいプルーバーまたは証明システム（[[glossary/fork|フォーク]]による） | それ以降、同じプログラムIDの下でそれで証明される。 | 同上。 |
| プルーバー内の新しいマシン（ネイティブに実行するISA）、例：eISA | 新しいマシン用のインタープリターを介して証明される（通常はより遅く）。 | [[glossary/fork|フォーク]]がそれを公開すればターゲットにできる。 |

すべてのプログラムは現在の証明システムで証明されるため、古い証明システムが後に壊れていることが判明しても、プールは影響を受けません。1つのISA内では、新しいバージョンはプルーバーにバージョンチェックを追加するだけであり、後のすべてのプルーバーはそれを引き継ぐ必要があります。これは、実行クライアントがすべての[[glossary/fork|フォーク]]のルールを引き継ぐのと似ています。より大きな代償は、プルーバーがネイティブに実行しなくなったISAは永久にインタープリターを必要とし、そのインタープリターは新しいマシンごとに移植され、再度[[glossary/Formal-Verification|形式検証]]されなければならないことです。各[[glossary/fork|フォーク]]の関係と検証者も、アクティブ化されたすべてのバージョンに対して[[glossary/Formal-Verification|形式検証]]を必要とし、少なくとも1つの維持されたプルーバーがそれらすべてをサポートし続ける必要があります。したがって、すべてのバージョンを証明可能に保つコストは、公開されたISAが小さく、追加によってのみ成長し、めったに変更されない場合にのみ安価に保たれます。

もう1つの選択肢はラッピング（Vitalik氏に感謝）です。ユーザーは古いプルーバーで証明し続け、その後、新しいシステムで古い検証者が最初の証明を受け入れることを示す2番目の証明を作成します。そうすれば、後の[[glossary/fork|フォーク]]は古いプログラムを証明する必要がなくなり、古いISA用のインタープリターも不要になります。しかし、もし古い証明システムが壊れた場合、攻撃者は最初の証明を偽造でき、2番目の証明は古い検証者がそれを受け入れることを確認するだけになります。また、新しいプルーバーは毎回古い検証者全体を実行する必要があるため、2番目の証明が比較的高価になる可能性もあります。

もう1つの興味深い選択肢は、公開されたISAを決して変更しないことです（Alex氏に感謝）。イーサリアムは1つのカノニカルISA（例えばRISC-V）を選択し、ユーザーはWebAssemblyなど、好きな言語や命令セットでプログラムが実行されたことを証明できます。これに加えて、プログラムがカノニカルISAに正しくコンパイルされることを示す2番目の証明も行います。新しい言語は新しいISAバージョンを必要としませんが、2番目の証明は両方の仕様に対してコンパイルが正しいことを示すことしかできないため、カノニカルISAの仕様と並行して維持される独自の仕様が必要になります。

## EIP-8288にとってこれが意味すること

ISAのためにEIP-8288が必要とする唯一の変更は、その汎用leanSTARKスキーム（`0x11`）をプログラムスキームに置き換えることです。このスキームでは、3番目のフィールドに検証鍵ハッシュの代わりに`program_id`が保持され、`data_hash`はプログラムの公開出力となり、各[[glossary/fork|フォーク]]が検証者を指定します。プログラムは支出の公開入力（public inputs）をハッシュすることでその出力を計算し、プールコントラクトは受け取った入力からハッシュを再計算します。[[glossary/Mempool|メムプール (Mempool)]]は引き続き証明のみを受け取り、プログラムは決して受け取らないため、ノードはそれらを実行したり計測したりすることはありません。

プライベート転送は、4つのフレームを持つ単一の[[glossary/Frame-Transactions|フレームトランザクション]]となります。

1.  [[glossary/EIP-8272|EIP-8272]]の最近のルート検証フレームは、支出の[[glossary/Merkle-Patricia-Trie|Merkleルート]]がルートソースが最近書き込んだものであることをチェックします。
2.  プールの`VERIFY`フレームは、`FRAMEPARAM`と`FRAMEDATACOPY`を使用してそのフレームと依存関係を読み取ります。依存関係がプールの固定された`program_id`を名前として持ち、支出の公開入力にコミットしていること、支出の[[glossary/nullifier|ナリファイア]]がシーケンス0におけるプールの[[glossary/EIP-8250|EIP-8250]]ノンスキー（nonce keys）であること、およびルートがプールの自身のルートソースによって書き込まれたものであることをチェックします。EIP-8250は、転送が失敗した場合でも承認時に[[glossary/nullifier|ナリファイア]]を消費するため、プールは承認する前に`SENDER`フレームに十分なガスがあり、そのツリーに新しいノートのためのスペースがあることもチェックします。
3.  `VERIFY`フレームの後の依存関係フレームは`(scheme, data_hash, program_id)`を運び、証明自体はトランザクションの横に配置されます。これをそこに配置することで、[[glossary/Mempool|メムプール (Mempool)]]が認識する検証プレフィックス（validation prefix）が保持されます。
4.  `SENDER`フレームが転送を実行します。

ノードはトランザクションを転送する前に各証明を検証し、[[glossary/Block-Building|ブロックビルダー]]はブロックのすべての依存関係に対して1つの[[glossary/Recursive-STARK|再帰的STARK]]を追加するため、[[glossary/EVM|EVM]]で検証者が実行されることはなく、検証者[[glossary/Precompile-target|プリコンパイル]]も必要ありません。

これが実際に機能するまでには、ISAの外部に1つのギャップが残っています。EIP-8288では、leanSPHINCSの例は、EIP-8141署名ハッシュをこのハッシュがカバーする依存関係フレームに配置しているため、構築できません。空の`msg`がEIP-8141で行うように、ゼロの`data_hash`が署名ハッシュを表すことができれば、署名ハッシュから何も除外する必要がなくなります。上記のプールはこのルールを必要としません。その証明は、プール自体がチェックする公開入力にコミットしているためです。

*3つの投稿 - 2人の参加者*

[トピック全文を読む](https://ethresear.ch/t/exposing-an-isa-for-post-quantum-proofs-on-ethereum/26136)
