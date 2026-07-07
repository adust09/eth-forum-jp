---
title: 極めてリーンなチェーン
original_title: The Extremely Lean Chain
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/the-extremely-lean-chain/25369'
author: vbuterin
date: '2026-07-06'
category: Proof-of-Stake
tags:
  - proof-of-stake
  - consensus
  - scaling
  - zk
  - cryptography
  - validators
  - protocol-design
  - state-management
  - privacy
  - lean-chain
  - single-slot-finality
topic_id: '25369'
translated_at: '2026-07-07'
translator: gemini-2.5-flash
---

> [!note] 原文
> [The Extremely Lean Chain](https://ethresear.ch/t/the-extremely-lean-chain/25369) — vbuterin (2026-07-06)

*Emile、Potuz、Anders Elowssonには、初期のフィードバックとレビューに感謝します。*

この投稿の目的は、「リーン」アップグレード（[[glossary/single-slot-finality|シングルスロットファイナリティ]]、再帰的[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]ベースの[[glossary/Post-Quantum|ポスト量子 (PQ)]]耐性署名集約など）の文脈において、イーサリアムの[[glossary/Consensus-Layer|コンセンサス層]]チェーンが、[[glossary/stake|ステーク]]保有者に自身の[[glossary/consensus-state|コンセンサス状態]]の管理と時折の[[glossary/Zero-Knowledge-Proof|ゼロ知識証明]]の責任を負わせることで、[[glossary/state-growth|状態成長]]要件を積極的に最小化するように設計できることを示すことです。これにより、「エポック終了処理」（数スロットのファイナリティでは、例えば16秒ごとに発生する必要があるかもしれません）の負担が軽減され、必要に応じて[[glossary/consensus|コンセンサス]]が数百万の[[glossary/Ethereum-validator|イーサリアムバリデータ]]にスケールできるようになる可能性があります。これの高度なバージョンでは、[[glossary/Ethereum-validator|イーサリアムバリデータ]]の再匿名化も「無料で」提供されます。

### 「現状」のチェーンにおける状態会計

[[glossary/Beacon-chain|ビーコンチェーン]]の[[glossary/consensus-state|コンセンサス状態]]には現在、各[[glossary/Ethereum-validator|イーサリアムバリデータ]]について以下が含まれます。

| フィールド | サイズ |
| --- | --- |
| 公開鍵 (Pubkey) | 48バイト |
| 出金資格情報 (Withdrawal credentials) | 32バイト |
| 実効残高 (Effective balance) | 1バイト |
| スラッシュ済みか？ (Slashed?) | 1ビット |
| 各フェーズのエポック番号 (アクティベーション資格、アクティベーション、終了、出金可能) | 8 × 4バイト |
| アクティブ残高 (Active balance) | 8バイト |

[[glossary/Beacon-chain|ビーコンチェーン]]の[[glossary/consensus-state|コンセンサス状態]]の*変更*は、エポックごとに非常にコストのかかる操作です。ほとんどの場合、[[glossary/Ethereum-validator|イーサリアムバリデータ]]の参加または不参加に起因するアクティブ残高の変更に関連しています。

### フェーズ1A: 公開鍵ツリーの省略

[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]ベースの集約の主要な利点の1つは、署名と集約方法の内部ロジックにおいて、より多くの自由度があることです。私たちはすでにこれを集約 (Aggregation) に利用するつもりであり、その結果、ビットフィールドマージ集約が可能になります。しかし、これを署名にも利用して、[[glossary/Ethereum-validator|イーサリアムバリデータ]]の公開鍵を[[glossary/consensus-state|コンセンサス状態]]から削除することもできます。

[[glossary/Ethereum-validator|イーサリアムバリデータ]]がデポジットを行うと、その公開鍵はデポジットツリーの固定された場所に保存されることに注意してください。さらに、誰もデポジットツリー全体を保存する必要はありません。デポジットコントラクトは*右側ブランチ*のみを保存し、これは次の値を追加するために必要なすべてです。

![デポジットコントラクト.drawio](https://ethresear.ch/uploads/default/original/3X/e/4/e404724bd3fdcb45667bd587f276d2fff2c34098.png)

[[glossary/Beacon-chain|ビーコンチェーン]]の[[glossary/consensus-state|コンセンサス状態]]に[[glossary/Ethereum-validator|イーサリアムバリデータ]]の公開鍵（48バイト）を保存する代わりに、デポジットツリー内のその*インデックス*（5バイト）を保存します。ベース署名アルゴリズム（leanWOTS）は、公開鍵がデポジットツリーを通るマークル証明 (Merkle proof) とともに署名に含まれるように調整され、署名検証関数はインデックスを公開鍵として扱い、デポジットツリーの最近の（例：現在の日の開始時点の）ルートを補助的な公開入力として受け取ります。

[[glossary/Ethereum-validator|イーサリアムバリデータ]]は、署名を継続できるように、自身のデポジットの更新されたマークル証明 (Merkle proof) を追跡する必要があります。これは、デポジットが組み込まれた時点で[[glossary/Ethereum-validator|イーサリアムバリデータ]]が右側ブランチを所有しており、それ以降デポジットがあるたびにチェーンを処理してブランチを調整すれば、容易に行えます。

[[glossary/Ethereum-validator|イーサリアムバリデータ]]がデポジットを行う際、出金資格情報は公開鍵の隣にあるため、同じ証明を出金に利用できます（したがって、[[glossary/Beacon-chain|ビーコンチェーン]]の[[glossary/consensus-state|コンセンサス状態]]に出金資格情報を保存する必要はありません）。

### フェーズ1B: 残高の[[glossary/Zero-Knowledge-Proof|ゼロ知識証明]]

[[glossary/Beacon-chain|ビーコンチェーン]]の[[glossary/State-transition-function|状態遷移関数]]から、報酬およびペナルティ処理に関連するすべてのロジックを削除します。[[glossary/Attestation|アテステーション（証明）]]は、その有効性が（[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]によって）確認されれば、単に[[glossary/Block|ブロック]]に含められ、リアルタイムでの処理は一切行われません。

毎日終了時、[[glossary/Ethereum-validator|イーサリアムバリデータ]]は、前日以降のチェーンを辿り、オンチェーンに含まれた各[[glossary/Attestation|アテステーション（証明）]]ビットフィールド内の自身のインデックスのマークルブランチ (Merkle branch) を提供し、これを用いて参加した回数と参加しなかった回数を判断し、新しい残高を計算する[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]を生成する必要があります。彼らはこの[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]をプロトコルに提出します。これにより、[[glossary/Ethereum-validator|イーサリアムバリデータ]]の残高が更新され、翌日も有効なままとなります。

![チェーンウォーカー.drawio](https://ethresear.ch/uploads/default/original/3X/6/a/6a0cae65d63b4e00e870021e792ae33eb86b0573.png)

実用性のため、上記の設計に1つ明確化が必要です。期間 `[T, T + 1日]` の実効残高は、`T - 0.5日` までの[[glossary/Block|ブロック]]に基づいてのみ計算される必要があります。これにより、[[glossary/Ethereum-validator|イーサリアムバリデータ]]は、参加能力が中断されることなく、証明を組み込むための半日間の時間を得られます。また、証明の公開を半日間にわたって分散させることができ、突然の輻輳期間を回避できます（[[glossary/Ethereum-validator|イーサリアムバリデータ]]がブランチ公開時間をある程度ランダム化すると仮定した場合。必要であれば、ずらした最小公開時間を割り当てることでこれを強制できます。例：`T_min(validator) = global_T_min + (1/4 day) * validator.pubkey_hash / 2**256`）。

### 注記

-   [[glossary/Ethereum-validator|イーサリアムバリデータ]]が残高更新証明の提出に遅れても、[[glossary/slash|スラッシュ]]されたり、追い出されたりすることはありません。むしろ、いつでも提出できます。[[glossary/Ethereum-validator|イーサリアムバリデータ]]が失うのは、残高更新証明を提出するまで[[glossary/Attestation|アテステーション（証明）]]できないことだけです。
    
-   参加のマークルブランチ (Merkle branch) のみを証明すればよく、不参加のマークルブランチ (Merkle branch) は必要ありません。
    
-   現時点では、[[glossary/slash|スラッシュ]]はこの[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]メカニズムの外部で行われ、即座に効果を発揮できるようにします。
    
-   また、終了の仕組みも調整します。翌日の残高更新[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]の*代わりに*「終了したい」[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]を提出することで終了します。翌日の残高更新[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]に「部分的に出金したい」というメッセージを追加することで部分的に出金します。
    
-   各[[glossary/Attestation|アテステーション（証明）]]（ビットフィールド）は、同じ[[glossary/Block|ブロック]]の前の[[glossary/Attestation|アテステーション（証明）]]、または[[glossary/Block|ブロック]]自体を指し、それを[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]マージに含める必要があります。したがって、各[[glossary/Attestation|アテステーション（証明）]]のビットフィールドは、それが適用されているオブジェクトにとって最も最新のビットフィールドであり、以前のすべての[[glossary/Attestation|アテステーション（証明）]]と新しい[[glossary/Attestation|アテステーション（証明）]]をOR結合したものです。
    
-   [[glossary/Proposer|プロポーザー]]は、自身の[[glossary/Block|ブロック]]に含まれる[[glossary/Attestation|アテステーション（証明）]]内のオブジェクトについて「合計実効残高」を証明する必要があります。これにより、必要に応じて[[glossary/Block|ブロック]]が正当化され、公証され、[[glossary/finality|ファイナリティ]]が確定されるなどが可能になります。
    
-   実効残高の仕組みをわずかに調整して最適化することもできます。符号ビットなしのfp8形式（例：3ビットの指数部、5ビットの仮数部、最小値16で16〜4032 ETHをカバー）を使用し、異なる残高でほぼ均等に情報が失われるようにします。この値をオーバーロードし、`slashed`を0の実効残高として表現します（*合計残高*は別途追跡し、[[glossary/slash|スラッシュ]]された残高はそこから*減算しません*）。
    
-   非アクティブリークにおける1日あたりの最大損失は、実効残高の粒度レベルとほぼ同じであるため、これにより非アクティブリークメカニズムが大きく劣化することはありません。また、実効残高を再設計するなら、[[glossary/EIP|EIP（Ethereum 改善提案）]]-8068で提案されているヒステリシス (Hysteresis) を追加してもよいでしょう。
    

### 新しい会計

[[glossary/Ethereum-validator|イーサリアムバリデータ]]ごとの[[glossary/consensus-state|コンセンサス状態]]は次のとおりです。

| フィールド | サイズ |
| --- | --- |
| 実効残高 (Effective balance) | 1バイト |
| 公開鍵インデックス (Pubkey index) | 5バイト |

その他すべては保存する必要がありません。各残高更新証明は、*[[glossary/Ethereum-validator|イーサリアムバリデータ]]の以前のオンチェーン残高更新証明*に接続されるため、残高の下位桁は実効残高に入ることなく証明を通じてスレッド化されます。デポジットエポック、終了エポックなどを追跡する必要はありません。その追跡は残高更新証明メカニズムに包含されるためです。

[[glossary/Ethereum-validator|イーサリアムバリデータ]]のN-1番目の残高更新証明は、(i) N-2番目の残高更新証明、(ii) それ以降のオンチェーンデータの決定論的関数であることに注意してください。これは、固定されたバックアップシードからのリカバリが依然として可能であることを意味します。

[[glossary/consensus-state|コンセンサス状態]]の更新は次のとおりです。

-   [[glossary/slash|スラッシュ]]ごとに1回の書き込み
-   [[glossary/Ethereum-validator|イーサリアムバリデータ]]ごとに1日1回の書き込み

### 証明のコスト

残高更新証明を作成するために、[[glossary/Ethereum-validator|イーサリアムバリデータ]]は、前日以降、オブジェクトごとに最大1つのマークルブランチ (Merkle branch) （そのオブジェクトの最新の[[glossary/Attestation|アテステーション（証明）]]）を証明する必要があります。ここでの「オブジェクト」は[[glossary/Block|ブロック]]を意味します。ほとんどの場合、[[glossary/finality|ファイナリティ]]スロットごとに最大1つの[[glossary/Block|ブロック]]しかありません。

1日間の期間と16秒のエポックでは、これは約5400のマークルブランチ (Merkle branch) を意味します。[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]（[[glossary/ZK-SNARKs|ZK-SNARKs (ゼロ知識簡潔非対話型知識証明)]]よりも証明コストがはるかに低い）を使用すれば、弱いハードウェアでも1時間以内に十分可能です。[[glossary/fork|フォーク]]が発生した場合、[[glossary/fork|フォーク]]の一方の側の[[glossary/Attestation|アテステーション（証明）]]はその側にのみ含まれるため、各[[glossary/Ethereum-validator|イーサリアムバリデータ]]は参加している[[glossary/fork|フォーク]]の側のブランチのみを証明すれば済みます。[[glossary/fork|フォーク]]の他の側で更新を維持するための証明ははるかに安価になります。

合計実効残高を証明するコストは高くなります。これは、ビットフィールド全体と実効残高のセット全体を辿るためです（注：最適化のため、公開鍵インデックスと実効残高は別々のツリーに保存し、証明は後者のみ、[[glossary/Ethereum-validator|イーサリアムバリデータ]]あたり1バイトを辿るだけで済むようにすべきです）。

この非ハッシュ部分は「単なる」部分和であるため、コストはビットフィールドのマークルツリー (Merkle tree) 化（100万[[glossary/Ethereum-validator|イーサリアムバリデータ]]あたり128 kB）と実効残高ツリー（100万[[glossary/Ethereum-validator|イーサリアムバリデータ]]あたり1 MB）によって支配されます。今日、ハイエンドのラップトップは50万ハッシュ/秒以上（つまり、16 MB/秒のマークルツリー (Merkle tree) 化）を証明できるため、これは問題ありません。ローエンドのラップトップでもこれを処理できるはずです。

オンチェーンでは、このメカニズムは[[glossary/Ethereum-validator|イーサリアムバリデータ]]あたり1日1つの[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]を想定しています。100万[[glossary/Ethereum-validator|イーサリアムバリデータ]]の場合、これはスロットあたり100以上の[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]となり、多すぎます。したがって、これらの証明も署名が集約 (Aggregation) されるのと同様に集約 (Aggregation) される必要があります。

これはすでに非常に効果的で最適化された設計です。次のステップとして、プライバシーを追加します。

### フェーズ2: プライバシー

[[glossary/Beacon-chain|ビーコンチェーン]]の設計にいくつかの大きな調整を加えます。

まず、**「アクティブ[[glossary/Ethereum-validator|イーサリアムバリデータ]]レジストリ」は*日ごとの独立した構造*になります**。長期的な[[glossary/Ethereum-validator|イーサリアムバリデータ]]インデックスという概念は存在しません。システムの観点からは、[[glossary/Ethereum-validator|イーサリアムバリデータ]]は毎日新たに現れ、自身の有効残高を宣言・証明し、全員がアクティブになります。特に、委員会の割り当てはすべて、その日の公開鍵から行われる必要があることに注意してください。

第二に、**公開鍵の登録を残高証明ステップに移動します**。各[[glossary/Ethereum-validator|イーサリアムバリデータ]]は毎日新しい公開鍵を提供します。これは、インデックスがその日のツリーにおける[[glossary/Ethereum-validator|イーサリアムバリデータ]]の位置に過ぎないため、公開鍵インデックスの概念を削除できることも意味します。

第三に、**[[glossary/Ethereum-validator|イーサリアムバリデータ]]がラウンドごとにメッセージを送信する**形式のBFTコンセンサス (BFT consensus) を想定します。**「サラウンド[[glossary/slash|スラッシュ]]」はありません**。

また、残高更新証明で証明されるクレームも調整します。[[glossary/Ethereum-validator|イーサリアムバリデータ]]は、以前のN個のオンチェーン登録のチェーンについて証明します。これは、デポジットまたは`[[glossary/weak-subjectivity-period|弱い主観性の期間]]`日以上前の登録に遡ります。

-   以前のオンチェーン登録（おそらくデポジット）
-   それ以降にオンチェーンで発生したすべての[[glossary/Attestation|アテステーション（証明）]]
-   それ以降にオンチェーンで発生したすべての[[glossary/slash|スラッシュ]]

[[glossary/Block|ブロック]]内の[[glossary/slash|スラッシュ]]は公開鍵の順序である必要があり、マークルブランチ (Merkle branch) サイズの証明を可能にします。これにより、[[glossary/slash|スラッシュ]]のスキャンオーバーヘッドは、[[glossary/Attestation|アテステーション（証明）]]のスキャンオーバーヘッドと最大で同じになります（通常、[[glossary/Block|ブロック]]には[[glossary/slash|スラッシュ]]はゼロです）。

さらに、使用される[[glossary/STARK|STARK (スケーラブルで透過的な知識の引数)]]が**[[glossary/ZK-STARK|ZK-STARK]]**であることを確認してください。

また、部分的な出金も別の[[glossary/ZK-STARK|ZK-STARK]]とします。これは、正確な超過残高（部分的な出金では必然的に漏洩しますが、実効残高は粗粒度であるため漏洩しません）を翌日の鍵に添付し、それによって翌日の鍵を前日の鍵にリンクするのを避けるためです。

また、*以前の*公開鍵を[[glossary/slash|スラッシュ]]できるようにするために、以下のいずれかを行う必要があります。

-   公開鍵がデポジット時に固定されたシードから決定論的に生成されることを要求します。これにより、証明は過去`[[glossary/weak-subjectivity-period|弱い主観性の期間]]`日間の公開鍵を生成し、それらすべての中から[[glossary/slash|スラッシュ]]をチェックできます。
-   証明が、オンチェーンで`[[glossary/weak-subjectivity-period|弱い主観性の期間]]`日前までの以前の[[glossary/slash|スラッシュ]]を辿ることを要求します。

前者はより単純で安価です。後者はより集中的で複雑ですが、2つの利点があります。

-   出金とデポジットのループなしで鍵のローテーションを可能にする
-   [[glossary/Ethereum-validator|イーサリアムバリデータ]]が`[[glossary/weak-subjectivity-period|弱い主観性の期間]]`よりも古い鍵（出金資格情報を除く）を削除することを可能にし、デバイスが侵害された例外的なケースでのプライバシーを向上させます。ただし、実際にこれを行うとバックアップ手順が複雑になるというコストがかかることに注意してください。

現在アクティブな公開鍵に対する[[glossary/slash|スラッシュ]]は即座に適用され（実効残高をゼロに設定することで）、以前の公開鍵に対する[[glossary/slash|スラッシュ]]は1日遅れてのみ適用されます。

これにより、かなり強力な[[glossary/Ethereum-validator|イーサリアムバリデータ]]の匿名性が得られます。各[[glossary/Ethereum-validator|イーサリアムバリデータ]]のIDは毎日完全に再ランダム化され、現在のIDと過去のIDの間のリンクを知っているのは[[glossary/Ethereum-validator|イーサリアムバリデータ]]自身だけであり、このリンクを再証明するのは、(i) 最後の証明以降の残高変更、(ii) [[glossary/slash|スラッシュ]]されたかどうか、という2つの情報のみを明らかにするためです。

最後に、デポジットが出金アドレスを平文で公開しないようにしてください。代わりに、*隠蔽コミットメント* `hash(withdrawal_address, secret)` を作成します。出金アドレスとシークレットを知っている人だけが出金を行うことができます。したがって、毎日の証明は、出金が行われていないことも証明する必要があります（これには、[[glossary/consensus-state|コンセンサス状態]]が日ごとの出金イベントのアキュムレータを持つ必要があります）。これにより出金アドレスは公開されますが（[[glossary/Execution-layer|実行レイヤー]]側での平文のETH転送であるため避けられません）、これは「このアドレスがX ETHを受け取った」という以上の情報を公開することはありません。出金アドレスがデポジットやオンチェーン活動に公開でリンクされることは決してありません。

### [[glossary/single-secret-leader-election|単一秘密リーダー選挙 (SSLE)]]

この投稿で導入されたメカニズムは、ある意味で[[glossary/single-secret-leader-election|単一秘密リーダー選挙 (SSLE)]]（[https://eprint.iacr.org/2020/025.pdf](https://eprint.iacr.org/2020/025.pdf)）をほぼ「無料で」提供します。公開で追跡される永続的な[[glossary/Ethereum-validator|イーサリアムバリデータ]]セットの概念がなくなるため、[[glossary/Proposer|プロポーザー]]を選出する唯一の場所は、再匿名化された日ごとの[[glossary/Ethereum-validator|イーサリアムバリデータ]]セットになります。実際、[[glossary/Ethereum-validator|イーサリアムバリデータ]]が[[glossary/Proposer|プロポーザー]]になるまで[[glossary/Attestation|アテステーション（証明）]]しない場合、これはすでに[[glossary/single-secret-leader-election|単一秘密リーダー選挙 (SSLE)]]の主要な特性を満たしています。この設計は、[[glossary/Ethereum-validator|イーサリアムバリデータ]]が[[glossary/Proposer|プロポーザー]]になる前に[[glossary/Attestation|アテステーション（証明）]]する場合でも[[glossary/single-secret-leader-election|単一秘密リーダー選挙 (SSLE)]]の特性を提供するように拡張できます。

### 期間長の選択

証明を作成するコストのほとんどは償却されます。それは前のチェックポイントから現在のチェックポイントまで「チェーンを辿る」ことなので、非常に低い閾値を超えれば、期間長に関係なく同程度のコストがかかります。

主な*オンチェーン*コストは、残高更新証明がオンチェーンで32バイトのコミットメントを必要とすることです。これは[[glossary/Attestation|アテステーション（証明）]]（1ビット）よりも256倍高価です。したがって、コストを2倍以下に抑えたい場合、最小の残高更新期間は256[[glossary/finality|ファイナリティ]]期間となります。[[glossary/finality|ファイナリティ]]期間が16秒の場合、これは4096秒（約1.1時間）の残高更新期間を意味します。このような非常に積極的なパラメータは、上記の投稿が示唆したように、更新が期間全体にわたってずらして行われる必要があり、1/4の長い範囲だけでなく、更新のレイテンシをいくらか増加させます。

したがって、1時間が下限であり、1日は保守的です。

期間が長くなると、[[glossary/Ethereum-validator|イーサリアムバリデータ]]の匿名性の有効性が低下します。

3投稿 - 3参加者

[トピック全文を読む](https://ethresear.ch/t/the-extremely-lean-chain/25369)
