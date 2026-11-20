---
title: ペイロードではなく鍵を公開する：公開前にePBSペイロードを送信する
original_title: 'Reveal a key, not a payload: sending the ePBS payload before the reveal'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/reveal-a-key-not-a-payload-sending-the-epbs-payload-before-the-reveal/26264
author: cskiraly
date: '2026-11-18'
category: Networking
tags:
  - networking
  - pbs
  - mev
  - block-building
  - cryptography
  - research
  - payload-diffusion
  - builder-option
topic_id: '26264'
translated_at: '2026-11-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Reveal a key, not a payload: sending the ePBS payload before the reveal](https://ethresear.ch/t/reveal-a-key-not-a-payload-sending-the-epbs-payload-before-the-reveal/26264) — cskiraly (2026-11-18)

*著者: [@cskiraly](https://ethresear.ch/u/cskiraly)*

*この投稿のきっかけとなった会話を提供してくれた[@llewtae](https://ethresear.ch/u/llewtae)に感謝します。このアイデアのより狭い形式は、私の初期ドラフト「[Hiding the source of a segmented payload](https://notes.ethereum.org/@cskiraly/segmented-source-privacy)」（2026年10月）にあります。これは、公開前に暗号化されたコピーを少数のノードに配置し、ソースを隠すというものです。ネットワーク全体と時間に関する現在の形式は、私のDevcon 8での講演「Big Blocks, Quick Slots, Fast Diffusion」で初めて一行で言及されました。この投稿でそれを説明します。*

## TL;DR

-   Gloas（[[glossary/ePBS|ePBS（enshrined Proposer-Builder Separation）]]）では、ペイロードは[[glossary/Block-Building|ビルダー]]が公開して初めて転送されます。[[glossary/Block-Building|ビルダー]]はビーコンブロックの後まで待つ十分な理由があり、待機する時間が長くなるほどペイロードの転送時間が短くなります。
-   **事前シード化**はこのコストを取り除きます。ブロックが入札を含んだら、[[glossary/Block-Building|ビルダー]]はペイロードを暗号化して送信し、公開は32バイトの短い鍵メッセージに縮小されます。これにより得られるのは、ブロックの到着から公開までの時間です。これは、早いブロックであれば12秒スロットで最大約3秒ですが、遅いブロックではほとんどありません。
-   代償として、鍵を送信するだけでよい[[glossary/Block-Building|ビルダー]]は後で決定できるため、非公開にする[[glossary/Imperfect-Commitment|フリーオプション]]が拡大します。プライベート[[glossary/blob|ブロブ]]を持つ[[glossary/Block-Building|ビルダー]]は、[[glossary/blob|ブロブ]]を非公開にすることで、より遅い[[glossary/blob|ブロブ]]の期限まで決定できます。

## 予算

Gloasは順序を固定します（ビーコンブロックが最初、ペイロードが2番目）が、[[glossary/Block-Building|ビルダー]]がいつ公開するかは固定しません。その後破棄されたブロックのために公開されたペイロードは、次に[[glossary/Block-Building|ブロック構築]]を行う者にその内容を晒すため、[[glossary/Block-Building|ビルダー]]は[[glossary/attestations|アテステーション]]がブロックが維持されることを示すまで待ち、[[glossary/Equivocation-as-a-censorship-channel|二重署名（equivocation）]]を行うプロポーザーを捕らえるのに十分な時間待ちます。『[[glossary/Glamsterdam|グラムステルダム]]方程式』（2025年）も、公開を[[glossary/attestation-deadline|アテステーション期限]]後の[[glossary/Block-Building|ビルダー]]遅延として同様にモデル化しています。正直な[[glossary/Block-Building|ビルダー]]も、ブロックが遅れて到着し、それが自身のヘッドでない場合は非公開にする可能性があります。その後、[[glossary/Payload-Timeliness-Committee|ペイロード適時性委員会 (PTC)]]のメンバーは、スロットの半分（`PAYLOAD_DUE_BPS`）までにペイロードを確認した場合にのみ、ペイロードが存在すると投票します。以前の投稿では、公開が約3秒と仮定していたため、予算は約3秒でした（『[*Segment, code, push-pull*](https://ethresear.ch/t/wen-fast-payload-broadcast-segment-code-push-pull-and-everything-in-between/25913)』、2026年）。[[glossary/Attestation|アテスター]]はブロックを受け取るとすぐに投票するため、早いブロックは[[glossary/Block-Building|ビルダー]]がより早く確信できるようにし、タイミングゲームのように遅いブロックは、稼ぐ時間を少なくします。

高速ブロードキャストはこの予算に余裕を持って収まります。シミュレーションでは、提案されているブロードキャストプロトコルである[SEACAST](https://ethresear.ch/t/seacast-fast-lean-sampled-broadcast-for-ethereum-with-an-executable-spec-and-a-formal-model/26167)は、今日のペイロードの約5倍である1 MiBを、[[glossary/all-home-network|オールホームネットワーク]]の99%に約0.6秒で到達させます。ペイロードが大きくなり、スロットが縮小し、アップリンクが細くなるにつれて、予算は厳しくなります。10 Mbpsのアップリンクでは、同じ1 MiBがそのシミュレーションで1.8秒かかり、6秒スロットで同じスロットの割合が残す1.5秒よりも長くなります。一方、ブロックと公開の間の時間はペイロードの何も転送せず、ペイロードは入札の`block_hash`によって既に固定されています。

## アイデア

-   **入札時、** [[glossary/Block-Building|ビルダー]]はペイロードを圧縮し、新しい鍵で暗号化し、その暗号文をチャンク化して[[glossary/ReedSolomon-codes|イレイジャーコード]]化します。
-   **有効なブロックが入札を含んだら、** 暗号文チャンクをプッシュし、ノードはそれをチェックして転送します。
-   **公開時、** 鍵を送信します。ノードはそれをすぐにチェックして転送します。十分なチャンクがあれば、Gloasの指定通りに復号してエンベロープをチェックします。

ブロックが既にコミットしているのに、なぜ暗号化するのか？コミットメントだけでは平文は安全ではありません。[[glossary/Attestation|アテステーション]]されるまではブロックが破棄される可能性があるからです。暗号化は待機を安全にします。ブロックが破棄された場合、正直な[[glossary/Block-Building|ビルダー]]が非公開にした場合と同様に、ペイロードの内容はプライベートに保たれます。同じ暗号化が、[[glossary/Block-Building|ビルダー]]の戦略的オプションを維持し、延長します（後述）。

**Gloasでの変更点：**

-   入札は暗号文のチャンクルートにコミットします。これは[[glossary/EIP|EIP]]-8411の`41ba25cc`が平文のチャンクルートにコミットするのと同様であり、鍵のハッシュにもコミットします。`block_hash`と共に、これにより鍵で開けるものが固定されます。
-   暗号文チャンクのトピック。ルートと照合され、有効なブロックが入札を含んだ場合にのみ転送されます（[[glossary/EIP|EIP]]-8411の`41ba25cc`は、入札トピックで受け入れられたあらゆる入札のチャンクを転送します）。これにより、落札されなかった入札の暗号文は転送されません。
-   公開メッセージ：鍵と、鍵およびビーコンブロックルートに対する[[glossary/Block-Building|ビルダー]]の署名。これらは転送前に両方ともチェックされます（鍵はハッシュと照合されます）。エンベロープは[[glossary/EIP|EIP]]-8411がチャンク化するように、`beacon_block_root`なしで暗号化されます。
-   [[glossary/Payload-Timeliness-Committee|PTC（ペイロード適時性委員会）]]メンバーは、鍵と十分な暗号文が期限前に到達し、そのチェックを通過するエンベロープに復号された場合にペイロードが存在すると投票します。間違った鍵または欠落した鍵は、非公開にされたペイロードとして扱われます。
-   公開後、チャンクを逃したノードは、Gloasと同様にビーコンブロックルートでエンベロープを要求できます。

[![Figure 1: the payload's transfer window in one slot, in Gloas as specified and pre-seeded](https://ethresear.ch/uploads/default/optimized/3X/1/3/13dbd05c916231273021f0eae5755ebcb46b5f58_2_690x207.png)](https://ethresear.ch/uploads/default/original/3X/1/3/13dbd05c916231273021f0eae5755ebcb46b5f58.png "図1：1つのスロットにおけるペイロードの転送ウィンドウ。Gloasの仕様通りと事前シード化された場合")

*図1. 1つの12秒スロットでペイロードがノードに到達するまでの時間。Gloasの仕様通りでは、公開からペイロード期限まで実行されます。事前シード化された場合、暗号化されたペイロードはブロックから期限まで利用可能であり、鍵だけが公開を待ちます。ブロックはスロットの開始時に、公開は[[glossary/attestation-deadline|アテステーション期限]]に描かれており、これは上記で仮定した最大の利益です。ブロックが遅れるか、公開が早まると、利益は少なくなります。*

**[[glossary/Block-Level-Access-Lists|ブロックレベルアクセスリスト (BAL)]]。** Gloasは[[glossary/Block-Level-Access-Lists|BAL（ブロックレベルアクセスリスト）]]（[[glossary/EIP|EIP]]-7928）をペイロード内に配置します。上記のように事前シード化された場合、それは残りの部分と共に暗号化されます。[[glossary/EIP|EIP]]-8146の`b6d3f2c6`は、ビーコンブロックが公開されたら、代わりに平文のサイドカーとして送信することを提案しています。これは、状態変更が署名されたトランザクションをバンドル解除しないため、ペイロードの残りの部分だけを暗号化すればよいと主張しています。この2つの部分はブロックからのリンクを共有し、一方が早く到着するともう一方が遅く到着することを意味します（『[*The payload and its BAL: how to split on the network?*](https://notes.ethereum.org/@cskiraly/segmented-payload-and-bal)』、2026年）。公開されると、平文の[[glossary/Block-Level-Access-Lists|BAL（ブロックレベルアクセスリスト）]]は、ブロックが破棄されたとしても、ブロックの状態アクセスとトランザクション後の変更を露呈します。これを隠すため、[[glossary/Block-Building|ビルダー]]はペイロードと同様に、自身の鍵で[[glossary/Block-Level-Access-Lists|BAL（ブロックレベルアクセスリスト）]]を事前シード化することができます。[[glossary/Payload-Timeliness-Committee|PTC（ペイロード適時性委員会）]]メンバーは、ペイロードの期限の1秒前にそれを開き、入札の[[glossary/Block-Level-Access-Lists|BAL（ブロックレベルアクセスリスト）]]ハッシュと一致させた場合にのみそれをカウントし、ノードはペイロードの残りの部分が開かれる前に状態をプリフェッチする時間を稼ぐことができます。

## なぜもっと単純な方法ではないのか

**パリティチャンクのk-1個を事前シード化し、最後の1個を公開時に送信する。** k個のデータチャンクに対する[[glossary/ReedSolomon-codes|リード・ソロモン符号]]では、k-1個のチャンクは復号できませんが、各シンボルオフセットでk個の未知数に対するk-1個の等式であり、k個のうち1個を除くすべてのシンボルを明らかにし、他のチャンクからの1個の正しいシンボルがそのオフセットを復号します。残りの情報の一部は、入札のフィールドや[[glossary/Mempool|メムプール]]で確認されたトランザクションから既に公開されています。Mazorra、Öz、Schlegel、Wu（2025年）は、[[glossary/blob|ブロブ]]カラムについても同様の動きを記述しており、「再構築に必要な閾値をわずかに下回る」状態で公開することで、[[glossary/Block-Building|ビルダー]]のオプションを延長する方法としています。**ワンタイムパッド**も役に立ちません。ペイロードと同じ大きさである場合にのみ完全に隠蔽できます（シャノン）。鍵は計算経路であり、短い公開を可能にします。

## コスト

-   **[[glossary/Block-Building|ビルダー]]のオプションが、ある経路で増大する。** Mazorraらは、[[glossary/Block-Building|ビルダー]]がまだ決定できる期間が長くなるにつれて、[[glossary/Imperfect-Commitment|フリーオプション]]の価値とその使用頻度が増大することを発見しました。期間を短縮することはスケーラビリティを犠牲にして役立ちます。彼らの期間は、[[glossary/blob|ブロブ]]の最新リリース時で終了し、その期限は後になります。鍵の時間はペイロードと共に増大しないため、事前シード化は、ペイロードの転送時間から鍵の時間を差し引いた分だけ、ペイロードの最新公開を遅らせます。[[glossary/blob|ブロブ]]経路はスロットの4分の3まで変更されず、非公開にされた鍵は、非公開にされた[[glossary/blob|ブロブ]]が公開のままにする場所でペイロードを隠し続けます。ペイロードの期限を早めることは、ペイロード経路のみを相殺し、ペイロードの利益をそれだけ取り戻すことになります。
-   **非公開にされたペイロード**は、その暗号文のバイトを各ノードで無駄にし、圧縮されたサイズは示されるものの、隠されたままとなります。[[glossary/Block-Building|ビルダー]]は、ブロックが十分な[[glossary/Attestation|アテステーション]]を集めた場合にのみ入札を支払います。
-   **初期のバイト**は、ブロックおよびスロットの4分の1で期限となる[[glossary/Attestation|アテステーション]]とリンクを共有するため、先行分のいくらかはそれらに割り当てられます。

## 関連研究

ブロックを暗号化して送信し、後で短い鍵を公開するというアイデアは新しいものではありません。bloXroute（Klarman、Basu、Kuzmanovic、Sirer、2018年）は、暗号化されたブロックが拡散すると鍵を公開し、その「微小なサイズ」によって「迅速に伝播」させ、ネットワークの中立性を保ちます。イーサリアムでは、公開前にペイロードを暗号化することが、[[glossary/MEV|MEV（最大抽出可能価値）]]-Boostリレー（Luhn、2022年；Noyes、Policharla、2024年。彼らの暗号化されたブロックはプロポーザルと共にゴシップされ、[[glossary/Attestation|アテステーション]]によって開かれる）や、[[glossary/ePBS|ePBS（enshrined Proposer-Builder Separation）]] [[glossary/Block-Building|ビルダー]]（Shutter、2025年）から選択肢を奪うために提案されてきました。Buterin（2022年）は、プロポーザルの前に暗号化されたコード化チャンクを委員会に配置しました。トランザクションごとに、[[glossary/LUCID|LUCID (EIP-8184)]]（2026年）は、ビーコンブロックが信頼された後に公開される鍵の前に封印されたトランザクションを拡散し、[[glossary/Frame-Transactions|暗号化フレームトランザクション (Encrypted Frame Transactions)]]（Thiery、2026年）はそのような鍵をコミットメントと照合します。[[glossary/Blob|ブロブ]]ストリーミング（2026年）は公開[[glossary/blob|ブロブ]]データをクリティカルパスの前に移動させ、[[glossary/EIP|EIP]]-8146（2026年）は[[glossary/Block-Level-Access-Lists|BAL（ブロックレベルアクセスリスト）]]を移動させます。我々が見つけた限りでは、ここでの新しい点は以下の通りです。[[glossary/Block-Building|ビルダー]]自身の鍵で暗号化されたGloasペイロード全体が、ブロックの後に拡散され、その転送が公開よりも先行するようにすること、そしてそれが[[glossary/Block-Building|ビルダー]]のオプションにどのような影響を与えるかです。

## 未解決の疑問

-   **どれだけの時間が稼げるか**は、ノードがいつブロックを保持するか、[[glossary/Block-Building|ビルダー]]がどれだけ待つか、そして鍵がどれだけ速く拡散するかによります。これは測定が必要です。
-   ペイロードが公開を待たなくなった場合、ペイロードの期限はどこに設定されるべきか。
-   **[[glossary/blob|ブロブ]]とセルフ[[glossary/Block-Building|ビルダー]]。** 暗号化された[[glossary/blob|ブロブ]]カラムは、平文への[[glossary/KZG-commitment|KZGコミットメント]]に対する[[glossary/KZG-commitment|KZG]]チェックに失敗するため、[[glossary/blob|ブロブ]]には独自の解決策が必要です。セルフ[[glossary/Block-Building|ビルダー]]はこれらすべてを必要としないかもしれません。

*3件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethresear.ch/t/reveal-a-key-not-a-payload-sending-the-epbs-payload-before-the-reveal/26264)
