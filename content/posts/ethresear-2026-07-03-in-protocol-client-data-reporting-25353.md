---
title: プロトコル内クライアントデータ報告
original_title: In-Protocol Client Data Reporting
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/in-protocol-client-data-reporting/25353'
author: hanniabu
date: '2026-07-03'
category: Proof-of-Stake
tags:
  - proof-of-stake
  - consensus
  - networking
  - validators
  - protocol-design
  - client-diversity
  - eip
  - security
  - research
topic_id: '25353'
translated_at: '2026-07-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [In-Protocol Client Data Reporting](https://ethresear.ch/t/in-protocol-client-data-reporting/25353) — hanniabu (2026-07-03)

# プロトコル内クライアント報告

*Paul Harris [@rolfyone](https://ethresear.ch/u/rolfyone) と Luca @eth2353 のコメントとレビューに感謝します。*

CL/ELクライアントの利用状況を追跡することは、ネットワークのレジリエンス（回復力）を理解するために不可欠ですが、信頼できる報告ソリューションが存在しません。

### 以前の取り組み

-   **フィンガープリンティング (Fingerprinting)**: Blockprintは、クライアントのブロック提案スタイルを監視して使用されているクライアントを推測していましたが、イーサリアム・エレクトラアップグレード (Ethereum Electra upgrade) 後に不正確になり、現在は非推奨となっています。 [\[1\]](https://twitter.com/sproulM_/status/1440512518242197516), [\[2\]](https://x.com/sigp_io/status/1955075542866420164)
-   **クローリング (Crawling)**: MigaLabsはネットワーク上のノードを監視していますが、これは[[glossary/Ethereum-validator|イーサリアムバリデータ]]ノードに限定されず、ピアバイアス (peer bias) があります。 [\[3\]](https://www.migalabs.io/consensus-layer)
-   **リレーデータ (Relay Data)**: リレーはクライアントデータを持っていますが、[[glossary/ePBS|ePBS（enshrined Proposer-Builder Separation）]]はリレーを不要にします（また、データを集約するために共有するよう説得する必要もあります）。 [\[4\]](https://collective.flashbots.net/t/a-consensus-layer-client-diversity-snapshot/5431)
-   **グラフィティウォーターマーク (Graffiti Watermark)**: 提案のグラフィティフィールド (graffiti field) を使用してCL/ELクライアントを報告しますが、実装が標準化されておらず、カスタムグラフィティが設定された場合に十分なスペースがあることに依存し、マルチノード/DVTセットアップ (multinode/DVT setups) を考慮していません。 [\[5\]](https://paragraph.com/@rolfy-eth/graffiti-watermarks), [\[6\]](https://discord.com/channels/595666850260713488/1399999127751757947/1400367856847425556)

### 以前のリサーチ

[このリサーチ投稿](https://ethresear.ch/t/allowing-validators-to-provide-client-information-privately-a-project-by-nethermind-research-and-nethermind-core/18527)では、以下のトピックと実装上の課題について説明しています。

-   提案されたブロックでクライアントデータを可視化する
-   クローリングメソッドの信頼性を向上させる
-   クライアントデータ収集のための専用サブプロトコル
-   専用のプライベート投票スキーム

### 提案: 新しい32バイトの提案フィールド

[グラフィティウォーターマーク](https://paragraph.com/@rolfy-eth/graffiti-watermarks)に触発された新しい32バイトのビーコンブロックボディ (beacon block body) データフィールドですが、専用のフィールドとして、Vero、Vouch、DVTのようなマルチノードセットアップを考慮した拡張スキーマを備えています。将来的には、zkCL証明の多様性 (zkCL proof diversity) を監視するためにも有益でしょう。

**用語**

-   **フィールドバージョン (Field Version)** - この新しいデータフィールドのバージョン管理。
-   **セットアップ (Setup)** - 使用されているセットアップのタイプ。通常のシンプルなセットアップ、Obol、SSV、Vero、Vouchなど。
-   **スレッショルド (Threshold)** - 投票を行う前に合意が必要な接続されたクライアントのM-of-N。
-   **クライアントペア (Client Pairs)** - クライアントの組み合わせのセット数。例えば、Prysm+NethermindとTeku+Besuを実行している場合、これは2つのクライアントペアです。

**エンコーディング**

-   **バイト 0 \[7-0\]** = フィールドバージョン (最大 2^8 = 256)
-   **バイト 1 \[7-3\]** = セットアップ (最大 2^5 = 32)
-   **バイト 1 \[2-0\]** = スレッショルド (最大 2^3 = 8)
-   **バイト 2-15** = CL/ELクライアントペアごとに1バイト (14ペア、それぞれ最大 2^4 = 16オプション)
-   **バイト 16-31** = 初期実装では未使用ですが、将来的に追加の追跡を可能にします。

将来、zkCL証明が導入された際には、クライアントデータバージョンを更新し、追加のバイトを使用してその多様性データも収集できます。

これを絞り込む前に、いくつかの他のバリエーションが検討されました。[このgist](https://gist.github.com/hanniabu/37d417dcaadf96e77116312cb526a780)で確認できます。

**参照リスト**

セットアップとクライアントペアの参照リストが必要になります。これらは、数値とセットアップ、CL、ELオプションをマッピングし、バイトエンコーディング/デコーディング (byte encoding/decoding) に使用されます。

値0と1は「未定義 (undefined)」と「その他 (other)」のために予約できます。

### 例

**前提:**

-   フィールドバージョン: 1
-   セットアップ: Vero
-   セットアップ参照リストのマッピング:
    -   未定義: 0
    -   その他: 1
    -   シンプル: 2
    -   Obol: 3
    -   SSV: 4
    -   Vero: 5
    -   Vouch: 6
-   スレッショルド: 3/4
-   クライアントペア: TK+NM,LS+GE,NB+NM,LH+BU
-   CL参照リストのマッピング:
    -   未定義: 0
    -   その他: 1
    -   GR: 2
    -   LH: 3
    -   LS: 4
    -   NB: 5
    -   TK: 6
    -   PM: 7
-   EL参照リストのマッピング:
    -   未定義: 0
    -   その他: 1
    -   BU: 2
    -   EJ: 3
    -   EG: 4
    -   EX: 5
    -   GE: 6
    -   NB: 7
    -   NM: 8
    -   RH: 9

**バイトエンコーディング:**

-   バイト 0 = 00000001 (バージョン)
-   バイト 1 = 00101011 (セットアップ 00101 + スレッショルド 011)
-   バイト 2 = 01101000 (TK 0110 + NM 1000)
-   バイト 3 = 01000110 (LS 0100 + GE 0110)
-   バイト 4 = 01011000 (NB 0101 + NM 1000)
-   バイト 5 = 00110010 (LH 0011 + BU 0010)
-   バイト 6-15 = 00000000 (未定義のクライアントペア)
-   バイト 16-31 = 00000000 (未使用)

### 設定

-   デフォルトでオンにする
-   ユーザーがクライアント報告を無効にできるようにする
    -   EL、CL、zkCL証明の報告を、すべてを制御する1つの設定ではなく、個別にオプトアウトする機能を持つことについて、何か議論はありますか？
-   ユーザーがクライアントセットアップを無効にできるようにする

### 懸念事項/欠点

-   **プライバシー (Privacy)**
    -   プライバシーについて懸念する人もいるかもしれませんが、クライアントのバージョン情報は記載されておらず、無効にするオプションもあり、クライアントはすでにクライアント情報を追加しているため、これは実際の問題ではないと思われます。
    -   Veroのようなマルチノードクライアントでは、現在実行しているクライアントが特定されるリスクは大幅に軽減されます。
-   **データスプーフィング (Data Spoofing)** - データをスプーフィング (spoofing) する可能性はありますが、[[glossary/Ethereum-validator|イーサリアムバリデータ]]セット (validator set) が大きいため、これは現在私たちが扱っているものよりも良いものになると信じています。
-   **古いデータ (Stale Data)** - この実装は提案に依存するため、データはネットワークのライブビューを提供しません（現在、[[glossary/Ethereum-validator|イーサリアムバリデータ]]セットを巡回するには少なくとも約129日かかります）。ただし、この記事を書く数週間前には約131日だったことを考えると、統合 (consolidations) によりこれは減少し続ける可能性があります。

### 議論

クライアント報告を実装するための簡単な方法について、他のアイデアがあればぜひ聞かせてください。

この提案は技術的に最善の解決策ではないかもしれませんが、実装の容易さと柔軟性から、これには価値があると考えています。私たちのネットワークに必要な洞察を得ましょう。

他にアイデアや強い懸念がなければ、[[glossary/EIP|EIP（Ethereum 改善提案）]]提案を進めたいと思います。これには技術パートナーが必要なので、協力に興味がある方がいればぜひご連絡ください。

*3投稿 - 3参加者*

[トピック全文を読む](https://ethresear.ch/t/in-protocol-client-data-reporting/25353)
