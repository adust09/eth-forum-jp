---
title: 'EIP-8435: PBTリーフにおける最終書き込みブロック'
original_title: 'EIP-8435: Last-Written Block in PBT Leaves'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8435-last-written-block-in-pbt-leaves/29860
author: astrion-coder
date: '2026-10-04'
category: EIPs
tags:
  - eips
  - eip
  - state-management
  - protocol-design
  - execution-layer
  - scaling
  - partitioned-binary-tree
  - state-tiering
topic_id: '29860'
translated_at: '2026-10-05'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8435: Last-Written Block in PBT Leaves](https://ethereum-magicians.org/t/eip-8435-last-written-block-in-pbt-leaves/29860) — astrion-coder (2026-10-04)

# [[EIP-8188]]の書き込み経過時間シグナルをパーティション化されたバイナリツリーに組み込む

[[EIP-8188|EIP-8188]]は、すべてのアカウントとストレージスロットについて、それが最後に書き込まれたブロックを記録します。これにより、クライアントは最近書き込まれたステートと長期間書き込まれていないステートを分離するためのコンセンサスレベルのシグナルを得ることができ、階層化提案である[EIP-8295](https://eips.ethereum.org/EIPS/eip-8295)と[EIP-8296](https://eips.ethereum.org/EIPS/eip-8296)はこれに基づいて価格設定を構築しています。

[[EIP-8188|EIP-8188]]は、[[glossary/Merkle-Patricia-Trie|MPT]]のフィールドを定義します。アカウントの[[glossary/RLP|RLP]]に5番目の要素を追加し、各ストレージスロットを2要素の[[glossary/RLP|RLP]]リストでラップします。[[EIP-8297|EIP-8297]]の[[glossary/Partitioned-Binary-Tree|パーティション化されたバイナリツリー]]には[[glossary/RLP|RLP]]がなく、アカウントフィールドはアカウントリーフ内の固定バイトオフセットに配置され、ストレージリーフは生の32バイトワードのみを保持します。そのため、ツリーが変更されると、フィールドの置き場所がなくなります。

この[[EIP|EIP]]は、`[[glossary/lastwrittenblock|最終書き込みブロック]]`を[[glossary/Partitioned-Binary-Tree|PBT]]リーフに配置します。[[EIP-8188|EIP-8188]]と同様に、ガス料金を変更せず、ステートを削除せず、[[glossary/resurrection-mechanism|復活メカニズム]]も必要としません。

### この[[EIP|EIP]]がすること

-   **アカウント:** `[[glossary/lastwrittenblock|最終書き込みブロック]]`（4バイト）は既存のアカウント`[[glossary/BASIC_DATA|BASIC_DATA]]`に格納されます。これは、3つの予約済みバイトと、`code_size`を4バイトから3バイトに縮小することで解放された1バイトを使用します。`[[glossary/nonce|ナンス]]`と`[[glossary/balance|残高]]`は移動せず、アカウントのサイズは0バイト増加します。
-   **ストレージスロット:** リーフ値は32バイトから36バイトに増加します。変更されていないスロット値の後に4バイトの`[[glossary/lastwrittenblock|最終書き込みブロック]]`が続きます。これはヘッダースロット`0..63`とストレージゾーンのスロットに適用されます。キーは変更されません。
-   **更新ルール:** 書き込みはフィールドを現在のブロック番号に設定し、読み取りは決してそれを変更せず、リバートされた書き込みは古い値を復元します。これらは[[EIP-8188|EIP-8188]]のルールであり、以下に説明する1つの違いがあります。
-   **取得:** フィールドはリーフのコミットされた値の一部であるため、自由に読み取ることができ、通常の[[EIP-8297|EIP-8297]]インクルージョン証明を使用して[[glossary/State-Root|ステートルート]]に対して証明できます。

### [[EIP-8188|EIP-8188]]との違い

| | [[EIP-8188|EIP-8188]] ([[glossary/Merkle-Patricia-Trie|MPT]]) | この[[EIP|EIP]] ([[glossary/Partitioned-Binary-Tree|PBT]]) |
| --- | --- | --- |
| アカウントエンコーディング | 5番目の[[glossary/RLP|RLP]]要素 | [[glossary/BASIC_DATA|BASIC_DATA]]の1〜4バイト目 |
| スロットエンコーディング | [[glossary/RLP|RLP]]リスト [値, [[glossary/lastwrittenblock|最終書き込みブロック]]] | 36バイト値: スロット値、その後にフィールド |
| アカウントあたりの増加量 | 5バイト | 0バイト |
| スロットあたりの増加量 | 6バイト | 4バイト |
| フィールド幅 | 可変（[[glossary/RLP|RLP]]整数） | 固定4バイト |
| ストレージ書き込みがアカウントのフィールドを更新するか | はい | いいえ |

**ストレージからアカウントへのカスケードなし。** [[EIP-8188|EIP-8188]]では、ストレージスロットを書き込むと、アカウントの`[[glossary/lastwrittenblock|最終書き込みブロック]]`も更新されます。これは[[glossary/Merkle-Patricia-Trie|MPT]]の形状に起因します。アカウントの[[glossary/RLP|RLP]]には`[[glossary/storageRoot|ストレージルート]]`が含まれているため、ストレージへの書き込みは常にアカウントリーフを書き換えます。[[glossary/Partitioned-Binary-Tree|PBT]]には`[[glossary/storageRoot|ストレージルート]]`がありません。アカウントのヘッダーとそのストレージは別々の[[glossary/account-leaf|アカウントリーフ]]であり、ストレージへの書き込みは`[[glossary/BASIC_DATA|BASIC_DATA]]`には影響しません。カスケードは、ツリーが他に必要としないヘッダーの書き換えを追加することになるため、この[[EIP|EIP]]ではそれを除外しています。

その結果、2つのフィールドは独立しています。アカウントの`[[glossary/lastwrittenblock|最終書き込みブロック]]`はそのヘッダー（[[glossary/balance|残高]]、[[glossary/nonce|ナンス]]、コード）の更新日時を示し、各スロットのフィールドはそのスロットの更新日時を示します。

### なぜフィールドをリーフ内に配置するのか

-   **1回の読み取り、1回の書き込み、1回の証明。** メタデータは、それが示す値とともに移動します。最初のリーフと同期させるために2番目のリーフを維持する必要はありません。
-   **ステートとともに削除され、リバートされる。** スロットがゼロに設定されると、そのリーフが削除され、メタデータもそれに伴って削除されます。
-   **リーフがどこに保存されていても機能する。** コールドリーフをメインデータベースから移動するクライアントでも、フィールドはリーフ内にあるため、そのフィールドを保持します。

### FAQ

**メタデータはステートを肥大化させませんか？**
[[EIP-8188|EIP-8188]]よりも少なくなります。最悪のケースでは、[[fork|フォーク]]後にすべてのスロットが書き換えられた場合、この[[EIP|EIP]]は約6 GBを追加します（15億スロット × 4バイト、アカウントはなし）。[[EIP-8188|EIP-8188]]は[[glossary/Merkle-Patricia-Trie|MPT]]エンコーディングで10.8 GBと見積もっています。両方の数値は[[EIP-8188|EIP-8188]]のステート数から計算されており、測定されたものではありません。

**なぜ4バイトだけなのですか？**
[[glossary/Partitioned-Binary-Tree|PBT]]フィールドは固定オフセットに配置されるため、幅は固定でなければなりません。3バイトは[[glossary/mainnet|メインネット]]のブロック高に対してすでに小さすぎ、4バイトは`[[glossary/nonce|ナンス]]`や`[[glossary/balance|残高]]`からスペースを取らずに`[[glossary/BASIC_DATA|BASIC_DATA]]`が提供できる最大値です。4バイトはブロック2^32 - 1まで持ちこたえ、[[EIP-8188|EIP-8188]]では12秒スロットで約1,600年先と見積もられています。

**なぜ`code_size`を縮小するのですか？**
これは、その幅よりもはるかに低い範囲で上限が設定されている唯一のヘッダーフィールドです。3バイトは64 KiBのコードサイズ制限の約256倍を保持します。[EIP-7864](https://eips.ethereum.org/EIPS/eip-7864)はすでに同じオフセットで3バイトの`code_size`を指定しています。

**36バイトのストレージリーフはハッシュ化により多くのコストがかかりますか？**
[[EIP-8297|EIP-8297]]の参照実装におけるハッシュであるBLAKE3ではかかりません。ストレージリーフのハッシュ入力は依然として2つの64バイトブロックに収まります。これは[[EIP-8297|EIP-8297]]がハッシュを修正した後に再確認する必要があります。

**階層化提案と連携しますか？**
はい。[[EIP-8295|EIP-8295]]と[[EIP-8296|EIP-8296]]は`[[glossary/lastwrittenblock|最終書き込みブロック]]`を読み取るだけです。両方とも、[[EIP-8188|EIP-8188]]がフィールドの「エンコーディングと更新ルールを所有している」こと、そしてステートを分類するためにそれを読み取ることを述べています。それらのルールはリーフごとです。「各リーフのティアは、その`[[glossary/lastwrittenblock|最終書き込みブロック]]`から決定されなければならない」とあり、操作が書き込む既存のリーフごとに追加料金が適用されます。

この[[EIP|EIP]]は、すべてのアカウントリーフとすべてのストレージリーフにそのフィールドを与えるため、[[glossary/Partitioned-Binary-Tree|PBT]]でも同じルールが適用されます。

-   [[glossary/balance|残高]]または[[glossary/nonce|ナンス]]の書き込みは、アカウントの`[[glossary/BASIC_DATA|BASIC_DATA]]`リーフから分類されます。
-   [[glossary/SSTORE|SSTORE]]は、スロット自身のリーフから分類されます。
-   生のブロック番号が保持されるため、[[EIP-8295|EIP-8295]]の期間と[[EIP-8296|EIP-8296]]のカットオフは、[[glossary/Merkle-Patricia-Trie|MPT]]とまったく同じようにそこから導出されます。

これら2つの[[EIP|EIP]]では、[[glossary/SSTORE|SSTORE]]は「`[[glossary/storageRoot|ストレージルート]]`カスケードを介して」アカウントに追加料金を課すこともできます。これは、[[glossary/Merkle-Patricia-Trie|MPT]]が実行するアカウントリーフへの書き込みに価格を設定します。[[glossary/Partitioned-Binary-Tree|PBT]]はそのような書き込みを実行しないため、[[glossary/Partitioned-Binary-Tree|PBT]]では[[glossary/SSTORE|SSTORE]]はスロット単独で価格設定されます。どちらのツリーでも、フィールドはそのリーフが最後に書き込まれた日時を示しており、それが階層化ルールが価格を設定するものです。

### 更新ログ

-   2026-10-04: 初版ドラフト

### 外部レビュー

2026-10-04現在なし。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8435-last-written-block-in-pbt-leaves/29860)
