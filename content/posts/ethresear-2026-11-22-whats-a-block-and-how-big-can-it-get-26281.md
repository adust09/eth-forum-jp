---
title: ブロックとは何か、そしてそのサイズはどれくらいになり得るか？
original_title: 'What''s a block, and how big can it get?'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/whats-a-block-and-how-big-can-it-get/26281'
author: Nero_eth
date: '2026-11-22'
category: Execution Layer Research
tags:
  - execution-layer
  - consensus
  - eip
  - protocol-design
  - scaling
  - gas
  - focil
  - block-building
topic_id: '26281'
translated_at: '2026-11-23'
translator: gemini-2.5-flash
---

> [!note] 原文
> [What's a block, and how big can it get?](https://ethresear.ch/t/whats-a-block-and-how-big-can-it-get/26281) — Nero_eth (2026-11-22)

# ブロックとは何か、そしてそのサイズはどれくらいになり得るか？

[[glossary/Glamsterdam|グラムステルダム]]後の最悪ケースのブロックサイズ、それが[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]にとってなぜ重要なのか、そしてブロックサイズとガスから何がわかるのか。

> ここでのすべての数値は、60Mガス制限を基準点とする[[glossary/Glamsterdam|グラムステルダム]]のルールを使用しています。

## TL;DR

-   イーサリアムにはブロックに対する2つのバイト制限があります。[[glossary/EIP-7934|EIP-7934]]は[[glossary/RLP|RLP (Recursive Length Prefix)]]エンコードされたELブロックを8MiBに制限し、CLはすべてのゴシップメッセージを[10 MiB](https://github.com/ethereum/consensus-specs/blob/1db1846bdc6393fc9764ff5e1ca2bb5fb641f6e2/specs/phase0/p2p-interface.md#configs)に制限しています。これらは異なるものを測定しており、ガス価格設定はどちらの制限も下回るようにブロックを維持しません。
-   [[glossary/Glamsterdam|グラムステルダム]]の価格設定で見つかった最大のブロックは、[[glossary/calldata|コールデータ]]ブロックではありません。それはゼロバイトの[[glossary/calldata|コールデータ]]と、数千件のスキップされた[[glossary/EIP-7702|EIP-7702]]承認で構成されており、[[glossary/calldata|コールデータ]]単独の場合の約2倍のサイズになります。60Mガス制限では1.8MiBです。
-   [[glossary/Glamsterdam|グラムステルダム]]の価格設定では、ELの8MiB制限は266Mガス制限で到達可能です。[[glossary/EIP-8131|EIP-8131]]（[[glossary/Hegota|ヘゴタ (Hegotá)]]向けにCFI済み）では、CLの10MiB制限が339Mで先に破られ、ELブロックはまだ8MiBを大きく下回っています。
-   [[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]は、「ブロックに収まる」チェックを必要としますが、これはサイズ制限が拘束しない場合にのみ有効です。解決策は、すべてのペイロードバイトをガスで価格設定し、ネットワークが処理できる最大許容ガス制限をキャップし、ガス制限からCLのサイズ上限を導き出すことです。

## 2つの制限、2つの測定

ブロックサイズについて話すとき、混同されやすい2つのものがあります。

**ELブロック**は`rlp(block)`です。ヘッダー、トランザクション、オマー、[[glossary/Withdrawals|引き出し]]が含まれます。[[glossary/EIP-7934|EIP-7934]]はこれを8MiBに対してチェックします。[[glossary/Block-Level-Access-Lists|ブロックアクセスリスト (BAL)]]は**含まれません**。ヘッダーにはそのハッシュのみが含まれます。同様に[[glossary/Builder-Execution-Requests|実行リクエスト]]についても、ヘッダーには`requests_hash`のみが含まれます。

**CLエンベロープ**は、SSZエンコードされた[`SignedExecutionPayloadEnvelope`](https://github.com/ethereum/consensus-specs/blob/1db1846bdc6393fc9764ff5e1ca2bb5fb641f6e2/specs/gloas/beacon-chain.md#signedexecutionpayloadenvelope)です。[[glossary/Gloas|グロアス (Gloas)]]以降、実行ペイロード (execution payload) は独自のメッセージで転送され、10MiBのゴシップキャップが唯一のサイズ制限となります。これにはトランザクションと[[glossary/Withdrawals|引き出し]]に加え、BALと[[glossary/Builder-Execution-Requests|実行リクエスト]]が含まれます。

したがって、大まかに言えば、**エンベロープ ≈ ELブロック + BAL + リクエスト**です。ELブロック単独のチェックでは、最後の2つを認識できません。

| アイテム | カウント対象 |
| --- | --- |
| トランザクション（[[glossary/calldata|コールデータ]]、アクセスリスト、承認、[[glossary/blob|ブロブ]]ハッシュ、エンベロープフィールド、署名） | EL/CL |
| [[glossary/Withdrawals|引き出し]] | EL/CL |
| ペイロードにも含まれるヘッダーフィールド（ルート、ブルーム、ガスフィールド、タイムスタンプ、追加データなど） | EL/CL |
| parent_beacon_block_root | EL/CL |
| ヘッダーのみのフィールド（ommers_hash、difficulty、nonce、transactions_root、withdrawals_root、requests_hash、block_access_list_hash） | EL |
| オマーリスト（空） | EL |
| [[glossary/Block-Level-Access-Lists|ブロックアクセスリスト (BAL)]] | CL |
| [[glossary/EIP-6110|EIP-6110]]のデポジットリクエスト | CL |
| [[glossary/EIP-7002|EIP-7002]]、[[glossary/EIP-7251|EIP-7251]]の[[glossary/Withdrawals|引き出し]]および統合リクエスト | CL |
| [[glossary/EIP-8282|EIP-8282]]の[[glossary/Block-Building|ビルダー]]デポジットおよびイグジットリクエスト | CL |
| block_hash、builder_index、beacon_block_root | CL |
| BLS署名 | CL |
| SSZオフセット（トランザクションごとに4B、可変フィールド用に数バイト） | CL |

[[glossary/blob|ブロブ]]、レシート (receipts)、ログ (logs) はどちらにもカウントされません。そのため、デポジットの576バイトのログはどちらの測定でも無料ですが、192バイトのリクエストはCL制限に計上されます。

## フロアが残す空き容量

[[glossary/EIP-7623|EIP-7623]]以降、トランザクションは以下を支払います。

```
gas_used = max(intrinsic + execution, floor)
```

そして[[glossary/EIP-7976|EIP-7976]]以降、フロア (floor) は[[glossary/calldata|コールデータ]]1バイトあたり64ガス（ゼロバイトか非ゼロバイトかに関わらず）です。

重要なのは、これが合計ではなく`max`であることです。トランザクションがフロア (floor) に拘束されると、固有 (intrinsic) ガスと実行 (execution) ガスの合計がフロア (floor) を下回る限り、追加の実行 (execution) にはコストがかかりません。その実行 (execution) がバイトも生成する場合、それらのバイトは[[glossary/calldata|コールデータ]]に上乗せされます。

得られる空き容量はバイトの種類によって異なります。

-   **ゼロバイト**はフロア (floor) で64ガスかかりますが、固有 (intrinsic) は4ガスしかかかりません。これにより、**1バイトあたり60ガスの無料実行 (execution) が可能**になります。
-   **非ゼロバイト**は固有 (intrinsic) が16ガスかかり、48ガスが残ります。

両方のサイズ制限は**非圧縮**バイト数をカウントするため、ゼロバイトは攻撃者にとって最良の選択です。非ゼロバイトは、ゼロが圧縮される圧縮サイズ（例: DoS攻撃）の場合にのみ重要になります。

## 空き容量がもたらすもの

次の問題は、その無料ガスを何に使うかです。フロア (floor) で何も支払うことなく、実行 (execution) ガス単位あたりで最も多くのバイトを提供するものが望ましいです。

[![Bytes per 1,000 gas of free execution](https://ethresear.ch/uploads/default/original/3X/c/f/cf925c02007d3b0bf0c80feadce615555b606407.svg)](https://ethresear.ch/uploads/default/original/3X/c/f/cf925c02007d3b0bf0c80feadce615555b606407.svg "1,000ガスあたりの無料実行で得られるバイト数")

データ ([詳細はこちらをクリック](https://ethresear.ch/t/whats-a-block-and-how-big-can-it-get/26281/1))

スキップされた承認は、ガスあたりで最も多くのバイトを提供します。誤った[[glossary/chain-ID|チェーンID]]を持つ承認は、[[glossary/ecrecover|ecrecover]]が実行される前にスキップされますが、トランザクションは有効なままです。スキップされた承認は、[[glossary/EIP-2780|EIP-2780]]の固有 (intrinsic) `EXECUTION_PER_AUTH_BASE_COST`である7,816ガスのみを支払います。

[[glossary/EIP-7702|EIP-7702]]は各フィールドをその整数幅でしか制限しないため、タプルは完全な133バイトになる可能性があります。33バイトの[[glossary/chain-ID|チェーンID]]、9バイトの[[glossary/nonce|ナンス]]、2バイトのy-パリティ、33バイトのrとs、さらにアドレスとリストヘッダーです。[[glossary/Glamsterdam|グラムステルダム]]では、これらはフロア (floor) の一部ではありません。

## 私が見つけた最大の（非圧縮）ブロック

### ゼロ埋め[[glossary/calldata|コールデータ]]とスキップされた承認

これは私が見つけた最大のELブロックです。各トランザクションは次のようになります。

-   タイプ4（コード設定 (set-code)）、送信者自身に送信されるため、基本コストは12,000
-   `data` = 234,031個のゼロバイト
-   1,796件の承認。それぞれ`chain_id = 2^256 - 1`、`address = 0xff..ff`、`nonce = 2^64 - 2`、`y_parity = 255`、`r = s = 2^256 - 1`
-   ガス制限14,989,984。したがって、これら4つで60Mブロックを埋めます。

フロア (floor) は12,000 + 64 \* 234,031 = 14,989,984です。固有 (intrinsic) コストは12,000 + 4 \* 234,031 + 7,816 \* 1,796 = 14,985,660で、フロア (floor) をわずかに下回ります。トランザクションはフロア (floor) を支払い、承認は無料で付随します。各トランザクションは約473KBです。

私はこのブロックを[[glossary/Glamsterdam|グラムステルダム]]の[実行仕様](https://github.com/ethereum/execution-specs)で構築しました。これは**有効で、59.96Mガスを使用し、1,892,706バイト（1.805MiB）**になります。

圧縮サイズの場合、上記のゼロ埋め[[glossary/calldata|コールデータ]]はほとんど圧縮されてしまいます。これを非ゼロの[[glossary/calldata|コールデータ]]（60ガスではなく48ガスの空き容量）に置き換え、ランダムなr、s、[[glossary/chain-ID|チェーンID]]を使用すると、何も圧縮されなくなります。そのバージョンは60Mで約1.62MiBに達し、[[glossary/EIP-8279|EIP-8279]]の[[glossary/SLOAD|SLOAD]]構築による約1.55MiBと比較されます。

### ゼロ埋め[[glossary/calldata|コールデータ]]とコールド[[glossary/SLOAD|SLOAD]]

これは、ゼロバイトを使用した既知のBALバイパスです。トランザクションは、異なる32バイトのキーに対して`PUSH32 key, SLOAD, POP`を実行するコントラクトにゼロバイトの[[glossary/calldata|コールデータ]]を送信します。これはそれぞれ2,105ガスかかります。キーは`2^255 + i`のようになり、それぞれBALで33バイトを占めます。

このようなブロックは、0.894MiBのELブロックと、その上にBALがある状態で有効です。空き容量を完全に利用すると、約1.73MiBのエンベロープに達します。ただし、BALはブロックに含まれないため、[[glossary/EIP-7934|EIP-7934]]に対しては0.894MiBの[[glossary/calldata|コールデータ]]のみがカウントされます。

## 各EIPが最悪ケースをどのように変化させるか

サイズ制限が拘束するまで、すべてはガス制限Gにほぼ線形に比例します。各最悪ケースは「バイト/ガス \* G」であり、各閾値は「制限 / バイト/ガス」です。トランザクションごとの基本コストはこれに比べて微々たるもの（ブロックあたり数件の12,000ガスベース）なので、ここでは省略します。

[![What fills the worst-case envelope at a 60M gas limit](https://ethresear.ch/uploads/default/original/3X/2/f/2f49e60b614b27e3265eb3050a8cc043aabcf591.svg)](https://ethresear.ch/uploads/default/original/3X/2/f/2f49e60b614b27e3265eb3050a8cc043aabcf591.svg "60Mガス制限で最悪ケースのエンベロープを埋めるもの")

データ（60Mガス制限でのバイト数） ([詳細はこちらをクリック](https://ethresear.ch/t/whats-a-block-and-how-big-can-it-get/26281/1))

### [[glossary/Glamsterdam|グラムステルダム]]: ELブロックは266Mで8MiBに達する

[[glossary/calldata|コールデータ]]は1バイトあたり64ガスでフロア (floor) を使い切るため、G / 64バイトの[[glossary/calldata|コールデータ]]が得られます。固有 (intrinsic) 側では、これらのバイトはそれぞれ4ガスしか使用しないため、Gの60/64が承認のために残されます。

```
calldata  = G / 64
auths     = (60/64 · G) / 7,816
total     = G/64 · (1 + 60 · 133 / 7,816) = 2.021 · G/64 ≈ 0.0316 · G
```

0.0316 · G = 8 MiBを解くと、**G ≈ 266M**が得られます。この時点で、ブロックは4,156,250バイトの[[glossary/calldata|コールデータ]]と31,906件の承認（4,243,498バイト）、または8.01MiBを保持します。

エンベロープはさらに大きくなる可能性があります。なぜなら、ブロックには事実上、同時に使用できる3つのGの予算があるからです。すべてのトランザクションは`max(execution, floor)`を支払い、これによりフロア (floor) 予算と実行 (execution) 予算が得られ、[[glossary/EIP-8037|EIP-8037]]は別途[[glossary/State-gas|ステートガス]]予算を追加します。G = 330Mの場合、最悪のエンベロープがそれらをどのように消費するかを以下に示します。

-   **フロア (Floor)**: 5.16Mのゼロ埋め[[glossary/calldata|コールデータ]]バイトがELブロックに入ります。
-   **実行 (Execution)**: [[glossary/calldata|コールデータ]]の固有 (intrinsic) コストは20.6Mを使用します。スキップされた承認は次の190Mを占め、ELブロックに3.23MBを追加し、8MiBに達すると停止します。残りの119Mはコールド[[glossary/SLOAD|SLOAD]]に費やされ、BALに1.87MBを追加します。この部分は[[glossary/EIP-7934|EIP-7934]]の対象外です。
-   **ステート (State)**: 別途作成されたトランザクションは、1バイトあたり1,530[[glossary/State-gas|ステートガス]]で、最大64KiBのコントラクトごとに、約216KBのゼロ埋めコードをデプロイします。そのコードもBALに格納されます。

これは8MiBのELブロックと約2.1MBのBALなので、**エンベロープは約330Mで10MiBに達します**が、ELブロックはまだ有効です。

### \+ [[glossary/EIP-8131|EIP-8131]]: 順序が逆転する

[[glossary/EIP-8131|EIP-8131]]は、承認（それぞれ133 \* 64ガス）を含むすべてのコンテンツバイトをフロア (floor) で課金します。承認は同じフロア (floor) 予算を[[glossary/calldata|コールデータ]]と競合するため、そのトリックはなくなります。

ELブロックに残るのは[[glossary/RLP|RLP (Recursive Length Prefix)]]フレーミングです。アクセスリストアドレスは20コンテンツバイトを運びますが、23バイトにエンコードされます。[[glossary/calldata|コールデータ]]と混合すると1.044 · G/64となり、**ELブロックは約514Mで8MiBに達します**。

しかし、[[glossary/EIP-8131|EIP-8131]]はBALに触れないため、[[glossary/SLOAD|SLOAD]]トリックはエンベロープで引き続き機能します。

```
total ≈ G/64 + 33 · (60/64 · G) / 2,105 + G/1,530 ≈ 0.0310 · G
```

これは**約339Mで10MiB**です。[[glossary/EIP-8131|EIP-8131]]単独では、CL制限がEL制限よりもはるかに早く破られます。[[glossary/EIP-7934|EIP-7934]]を楽に通過するブロックでも、ゴシップするには大きすぎる可能性があり、EL側では何も気づきません。

### \+ [[glossary/EIP-8279|EIP-8279]]: ランタイムデータ

[[glossary/EIP-8279|EIP-8279]]は、実行 (execution) が生成するバイトをフロア (floor) に対して1バイトあたり64ガスで計測するため、[[glossary/SLOAD|SLOAD]]は無料ではなくなります。私は、[[glossary/EIP-8279|EIP-8279]]が[このPR](https://github.com/ethereum/EIPs/pull/12686)で提案されているように、デポジットリクエストも計測すると仮定しています。デポジットにはどこにもカウント制限がないため、それがなければ次のバイパスになります。192バイトのリクエストあたり約26,000ガスで、空き容量を埋め、エンベロープを1.44 · G/64に押し上げるでしょう。

両方がカバーされると、残るのはBALの[[glossary/RLP|RLP (Recursive Length Prefix)]]フレーミングです。最悪のパターンは[[glossary/EIP-8279|EIP-8279]]が記述しているものです。アクセスリストアドレスに対する`BALANCE`が[[glossary/calldata|コールデータ]]と混合されます。これは1.146 · G/64、または60Mで1.02MiBとなり、[[glossary/EIP-8279|EIP-8279]]自身の約1.01MiBという数値と一致します。**エンベロープは約585Mで10MiBに達します**が、ELブロックはまだ514Mで8MiBに達します。

## 制限が破られる場所

[![Gas limit at which each size limit can be broken](https://ethresear.ch/uploads/default/original/3X/0/d/0d89344483ff98414255f614773db7bd2526c23b.svg)](https://ethresear.ch/uploads/default/original/3X/0/d/0d89344483ff98414255f614773db7bd2526c23b.svg "各サイズ制限が破られるガス制限")

データ ([詳細はこちらをクリック](https://ethresear.ch/t/whats-a-block-and-how-big-can-it-get/26281/1))

60Mガス制限では、これらはどれも到達できません。2つの点が際立っています。

-   現在、EL制限が最初に破られます。
-   [[glossary/EIP-8131|EIP-8131]]単独では、CL制限が最初に破られ、その差は大きいです。[[glossary/EIP-8279|EIP-8279]]なしで[[glossary/EIP-8131|EIP-8131]]をリリースすると、2つの制限間のギャップが悪化します。

## これが[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]にとってなぜ重要か

[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]は、[[glossary/Ethereum-validator|アテスター]]が、インクルージョンリストトランザクション (inclusion-list transaction) を省略したブロックを拒否することを可能にします。このトランザクションは追加できたはずのものです。「追加できたはず」は、ガス、[[glossary/nonce|ナンス]]、残高によってチェックされます。

**これはバイト制限が拘束可能になるとすぐに破綻します。** トランザクションはガス的には収まるかもしれませんが、それを追加するとブロックが8MiBを超え、ブロックが無効になります。[[glossary/Block-Building|ビルダー]]はそれを含めることができませんが、[[glossary/Ethereum-validator|アテスター]]は依然としてそれを期待します。パベル (Paweł) が[FOCILスレッド](https://ethereum-magicians.org/t/eip-7805-committee-based-fork-choice-enforced-inclusion-lists-focil/21578/18)でこの問題を提起し、彼の[実行仕様PR #4041](https://github.com/ethereum/execution-specs/pull/4041)は、トランザクションが追加されたブロックを再エンコードし、その[[glossary/RLP|RLP (Recursive Length Prefix)]]サイズをチェックすることでこれを修正しています。

このようにサイズを測定しても、次の4つの理由から完全に解決することはできません。

-   **ELブロックしか認識しない。** トランザクションを追加すると、BALバイト、場合によってはデポジットリクエスト、およびエンベロープへのSSZオフセットも追加されます。BAL部分が支配的です。ILトランザクションは最大8KiBですが、16.7Mガス（[[glossary/EIP-7825|EIP-7825]]）のコールド[[glossary/SLOAD|SLOAD]]を使用すると、約260KBのBALが追加されます。
-   **CL側をチェックすることは実行を意味する。** [[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]のチェックは意図的に安価です。トランザクションを実行することはありません。BALとリクエストバイトは実行後にのみ存在するため、エンベロープのサイズチェックを行うと、すべての[[glossary/Ethereum-validator|アテスター]]が省略されたすべてのILトランザクションを実行することになります。
-   **エンベロープのサイズはELが計算するものではない。** ELはSSZエンコードしません。正確なチェックには、CLが独自の[[glossary/fork|フォーク]]で変更できるCLのコンテナレイアウトも組み込む必要があります。
-   **存在しないブロックを測定する。** チェックはヘッダーを変更しないままにしますが、トランザクションを追加すると`gas_used`が増加し、そのエンコードが1バイト増える可能性があります。制限ぎりぎりの場合、チェックは「収まる」と言うかもしれませんが、実際のブロックは収まらず、[[glossary/Block-Building|ビルダー]]はスロットを失います。

「追加できたはず」の背後にあるチェックは、すべての[[glossary/Ethereum-validator|アテスター]]に同じ答えを与え、何も実行せずに実行され、[[glossary/Block-Building|ビルダー]]が実際にトランザクションを追加できる場合にのみイエスと言う必要があります。ガスはこれら3つすべてを満たします。なぜなら、`T.gas`はトランザクションが使用できる静的な上限だからです。バイトは、サイズがガスによっても制限されている場合にのみ、これらを満たすことができます。

## 解決策: サイズをガスから導き出す

より簡単な解決策があります。ペイロードに格納されるすべてのバイトが十分なガスを消費する場合、バイト制限がブロックを満杯にする原因になることはありません。そうすれば、[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]はガスのみを考慮し、[[glossary/Block-Building|ビルダー]]はガスのみをパックし、CLはガス制限から厳密なサイズ上限を導き出すことができます。

### 1. すべてのペイロードバイトを価格設定する

**[[glossary/EIP-8131|EIP-8131]]と[[glossary/EIP-8279|EIP-8279]]を一緒にリリースします。どちらも[[glossary/Hegota|ヘゴタ (Hegotá)]]向けにCFI済みです。** [[glossary/EIP-8131|EIP-8131]]はトランザクションコンテンツをカバーし、[[glossary/EIP-8279|EIP-8279]]は実行 (execution) が生成するデータをカバーします。

デポジットリクエストにはどこにもカウント制限がないため、[[glossary/EIP-8279|EIP-8279]]もそれらを計測する必要があります。[このPR](https://github.com/ethereum/EIPs/pull/12686)は、デポジットコントラクトからのデポジットイベントが192バイトのリクエストを計測する、という形でこれを追加します。

他のリクエストタイプ（7002、7251、8282）は、プリデプロイでブロックごとのハードキャップがあるため、[[glossary/Withdrawals|引き出し]]と同様に定数`C`に計上されます。

これらすべてが整うと、kは約1.15になります。

### 2. 最大許容ガス制限をキャップし、バイトはキャップしない

これが実際に[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]を修正するものです。`gas_limit <= MAX_GAS_LIMIT`というヘッダーチェックを1つ追加し、最悪のケースがELブロックで8MiB、またはエンベロープで10MiBに達しないように設定します。

-   上記の価格設定で約**500M**
-   [[glossary/EIP-8131|EIP-8131]]と[[glossary/EIP-8279|EIP-8279]]が[[glossary/Hegota|ヘゴタ (Hegotá)]]に含まれない場合は**256M**（これは266Mと330Mの両方を下回ります）

[[glossary/EIP-7934|EIP-7934]]のチェックはバックストップとして残すことができます。ガスによって有効なブロックを拘束することは決してないため、誰もそれについて考える必要がなくなり、[PR #4041](https://github.com/ethereum/execution-specs/pull/4041)のサイズチェックは不要になります。

トランザクションバイトのみにキャップを設けることは、加算的なものであり、[[glossary/RLP|RLP (Recursive Length Prefix)]]チェックよりも[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]にとって簡単です。しかし、BALとリクエストが除外されるため、10MiB制限を保護せず、[[glossary/Block-Building|ビルダー]]は依然として2つ目のものに対してパックする必要があります。

根本的な問題は、ガス制限がネットワークが処理できる範囲を超えて成長できないことです。より高く設定することは、データの[[glossary/repricing|再価格設定]]を行うか、メッセージ制限を引き上げることを意味します。

### 3. CLに厳密なエンベロープ上限を与える

サイズがガスから導き出されるようになれば、CLは過大なエンベロープをすぐに拒否できます。

```
max_envelope_size = C + ceil(k * bid.gas_limit / 64)
```

k = 1.25の場合、上限は60Mで10MiBではなく約1.12MiB + `C`となるため、ノードが転送する最大のエンベロープは約9分の1に縮小します。同じ上限がリクエスト/レスポンス (req/resp) によってフェッチされるエンベロープにも適用されるべきです。

kは、ある程度のマージンを持った適切な導出から導き出される必要があります。上限が厳しすぎると、ノードはゴシップ層 (gossip layer) で有効なペイロードをドロップし、[[glossary/Block-Building|ブロック構築]]がより困難になります。

上限がすべてのバイトソースを本当にカバーしていれば、ブロックはガスによってのみ満杯になり、[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]のチェックはガス、[[glossary/nonce|ナンス]]、残高のままでいられます。そのためにはまだ2つのことが必要です。完全なサイズ上限（見落とされたバイトソースがあれば破綻します）と、最大ガス制限を設定する[[glossary/EIP|EIP（Ethereum 改善提案）]]（まだ存在しません）です。

## 付録: ガス制限ごとの最悪ケース

異なるガス制限における最悪ケースのELブロック（`rlp(block)`）とCLエンベロープ（MiB単位）。エンベロープの列は、ELブロックが8MiBチェックをまだ通過する最大のエンベロープです。太字は制限が破られていることを意味します。ELブロックの場合は8MiB超、エンベロープの場合は10MiB超です。

| ガス制限 | [[glossary/Glamsterdam|グラムステルダム]] EL | [[glossary/Glamsterdam|グラムステルダム]] CL | + [[glossary/EIP-8131|EIP-8131]] EL | + [[glossary/EIP-8131|EIP-8131]] CL | + [[glossary/EIP-8131|EIP-8131]] + [[glossary/EIP-8279|EIP-8279]] EL | + [[glossary/EIP-8131|EIP-8131]] + [[glossary/EIP-8279|EIP-8279]] CL |
| --- | --- | --- | --- | --- | --- | --- |
| 60M | 1.81 | 1.84 | 0.93 | 1.77 | 0.93 | 1.02 |
| 100M | 3.01 | 3.07 | 1.56 | 2.95 | 1.56 | 1.71 |
| 150M | 4.52 | 4.61 | 2.33 | 4.43 | 2.33 | 2.56 |
| 200M | 6.02 | 6.15 | 3.11 | 5.91 | 3.11 | 3.41 |
| 250M | 7.53 | 7.68 | 3.89 | 7.38 | 3.89 | 4.27 |
| 300M | **9.03** | 9.14 | 4.67 | 8.86 | 4.67 | 5.12 |
| 400M | **12.05** | **11.97** | 6.22 | **11.81** | 6.22 | 6.83 |
| 500M | **15.06** | **14.81** | 7.78 | **14.77** | 7.78 | 8.54 |
| 600M | **18.07** | **16.84** | **9.33** | **16.84** | **9.33** | **10.24** |

*2投稿 - 2参加者*

[トピック全文を読む](https://ethresear.ch/t/whats-a-block-and-how-big-can-it-get/26281)
