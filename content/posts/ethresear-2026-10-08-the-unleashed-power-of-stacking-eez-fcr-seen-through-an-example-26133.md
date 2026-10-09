---
title: EEZとFCRを組み合わせることで解き放たれる力：具体例を通して
original_title: The unleashed power of stacking EEZ & FCR seen through an example
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/the-unleashed-power-of-stacking-eez-fcr-seen-through-an-example/26133
author: CPerezz
date: '2026-10-08'
category: Layer 2
tags:
  - layer2
  - scaling
  - finality
  - payments
  - ux
  - protocol-design
  - rollups
  - consensus
topic_id: '26133'
translated_at: '2026-10-09'
translator: gemini-2.5-flash
---

> [!note] 原文
> [The unleashed power of stacking EEZ & FCR seen through an example](https://ethresear.ch/t/the-unleashed-power-of-stacking-eez-fcr-seen-through-an-example/26133) — CPerezz (2026-10-08)

# カードのように支払い、イーサリアムのように決済する

*ブリッジも仲介者も、新たに信頼するエンティティも不要で、あらゆる[[glossary/Rollup|ロールアップ]]からの支払いをカード端末のようなUXで実現する。それが、[[glossary/Fast-Confirmation-Rule|FCR（高速承認ルール）]]と[[glossary/Ethereum-Economic-Zone|EEZ（イーサリアム経済圏）]]を組み合わせることで可能になることだ。今日のところは約2スロット、イーサリアムのスロットが短縮されるにつれてクレジットカードをタップするようなUXになるだろう。*

![EEZとFCRを組み合わせることで解き放たれる力](https://ethresear.ch/uploads/default/optimized/3X/9/d/9dfbac5007cf4d52d0bbcd6244aa1494ff218ce0_2_690x385.jpeg)

あなたは[[glossary/Rollup|ロールアップ]]上にETHを持っている。ショップはUSDCを求めており、イーサリアムのベースレイヤーしか監視していない。あなたの[[glossary/Rollup|ロールアップ]]について聞いたこともなく、あなたのものも次のものも統合することはないだろう。これをすべての[[glossary/Rollup|ロールアップ]]とすべてのショップに当てはめると、誰もが不満を漏らす断片化が発生する。つまり、流動性が孤立した島々に閉じ込められ、それぞれが信頼しなければならない独自のブリッジと、独自の待ち時間を抱えているのだ。

イーサリアムの2つのインフラがこれを解決する。[[glossary/Fast-Confirmation-Rule|FCR]]（**高速承認ルール**）は、ブロックが着地してから信頼されるまでの待ち時間を短縮する。[[glossary/Ethereum-Economic-Zone|EEZ]]（**イーサリアム経済圏**）は、あなたの[[glossary/Rollup|ロールアップ]]とベースレイヤー間の個別の横断を不要にする。これらは異なる2つの待ち時間を解決するため、両方を組み合わせることで、ショップは数分や数日ではなく、数秒で商品を発送できるようになる。

## 2つの待ち時間

![図1](https://ethresear.ch/uploads/default/optimized/3X/d/1/d11ae62555d9a180256fef8a2bee8cb3d76326f5_2_690x276.png "図1")

クロスレイヤー決済には、互いに積み重なった2つの別々の待ち時間があり、それぞれが異なる2つの要素によって解決される。

-   **到達**: あなたの価値が実際に[[glossary/Rollup|ロールアップ]]を離れ、ショップがそれを見ることができる場所に到達する必要がある。今日では、[[glossary/Block-Building|マーケットメイカー]]やブリッジを信頼して資金を立て替えてもらうか、[[glossary/Rollup|ロールアップ]]自身の退出を待つ必要があり、これには最大で約1週間かかる場合がある。
-   **信頼**: ベースレイヤーに何かが着地したら、ショップは商品を引き渡す前にそれがそこに留まることを確信する必要がある。ブロックは含まれた後も、しばらくの間[[glossary/fork|リorg]]される可能性があるためだ。

## 今日のチェックアウトと同じ方法で構築する

![図2](https://ethresear.ch/uploads/default/optimized/3X/5/9/5960a691010cbbe65cd8e4d39ade6d148e148423_2_690x264.png "図2")

どちらの修正もなければ、ショップはあなたの[[glossary/Rollup|ロールアップ]]を特別に統合するか、あなたの資金を受け入れないかのどちらかだ。もし受け入れる場合、あなたのETHはまずそこに到達する必要がある。つまり、[[glossary/Block-Building|マーケットメイカー]]を信頼して、あなたのETHの約束に対してUSDCを立て替えてもらうか（速いが、誰かを信頼することになる）、あるいは[[glossary/Rollup|ロールアップ]]自身のカノニカルな退出を利用するかだ。後者は、その[[glossary/Rollup|ロールアップ]]がどのように状態を証明するかによって、数分から約1週間かかる場合がある。資金が実際に到着して初めて、ショップは独自の時計をスタートさせる。イーサリアムのベースレイヤーがその到着を実質的に不可逆にするまでには約13分かかる。受け入れたいすべての[[glossary/Rollup|ロールアップ]]に対して、この統合作業を繰り返す必要がある。

## 修正1: FCRは「信頼される」待ち時間を短縮する

![図3](https://ethresear.ch/uploads/default/optimized/3X/2/a/2acc7242ebef9228065d22dac334d15893da8b7f_2_690x322.png "図3")

物理的なチェックアウトでのカード支払いを考えてみよう。「承認済み」が1〜2秒で点滅し、店員がバッグを渡してくれる。これは暫定的なもので、カードネットワークの言葉に依拠しており、まれな詐欺の場合には取り戻される可能性がある。銀行間の不可逆的な決済は後から行われる。2026年4月16日にイーサリアムの[[glossary/consensus|コンセンサス]]仕様にマージされた[[glossary/Fast-Confirmation-Rule|FCR]]は、ブロックの「承認済み」画面のようなものだ。

-   **高速**: 十分な[[glossary/Ethereum-validator|バリデータ]]がブロックに[[glossary/Attestation|アテステーション]]すると、ブロックが着地してから約1スロット（約13秒）後に、ノードはそれを`safe`とマークしてそれに基づいて行動できる。これにより、完全な[[glossary/slashing|スラッシング]]に裏打ちされた[[glossary/finality|ファイナリティ]]を約13分待つ必要がなくなる。
-   **条件付き**: [[glossary/Attestation|アテステーション]]が時間通りに到着し、[[glossary/stake|ステーク]]の25%以上が敵対的に行動しないことを前提としている。これらが破られた場合、[[glossary/finality|ファイナリティ]]とは異なり、誰も[[glossary/slashing|スラッシング]]されない。ルールは単に[[glossary/finality|ファイナリティ]]を待つことにフォールバックするだけだ。
-   **[[glossary/fork|フォーク]]不要**: これは[[glossary/Consensus-Client|クライアントサイドのルール]]であり、[[glossary/network-upgrade|ネットワークアップグレード]]ではない。一部の[[glossary/Consensus-Client|コンセンサスクライアント]]は今日すでにこれを実装しており、他のものはまだリリース候補の段階にある。

## 修正2: EEZは「到達する」待ち時間を不要にする

![図4](https://ethresear.ch/uploads/default/optimized/3X/f/a/fa40961bc0e697aff237f73523a97fb91a827e25_2_690x299.png "図4")

ブリッジモデルは電信送金のようなものだ。あなたのETHは[[glossary/Rollup|ロールアップ]]の台帳を離れ、輸送中に留まり、後でベースレイヤーの台帳に着地する。もし転送が途中で中断した場合、どちらの側にも何も残らず立ち往生する可能性がある。GnosisとZisKが[[glossary/Eth-RD|イーサリアム研究開発]]の共同資金提供を受けて構築した[[glossary/Ethereum-Economic-Zone|EEZ]]は、[[glossary/Rollup|ロールアップ]]の共有ゾーンであり、代わりに両方の台帳が一緒に承認する1つのレシートを作成する。

-   **1つのブロック**: [[glossary/Block-Building|ビルダー]]はあなたの[[glossary/Rollup|ロールアップ]]アクションとベースレイヤーアクションを同じイーサリアムブロックにパッケージ化する。あなたの[[glossary/Rollup|ロールアップ]]のコントラクトは、ベースレイヤーがそのブロックに記録した後にのみ更新を受け入れ（コードではこれを`postAndVerifyBatch`と呼ぶ）、[[glossary/Rollup|ロールアップ]]自身の台帳はそれをその場でミラーリングする。
-   **間に信頼するものはない**: ブリッジ[[glossary/Operator|オペレーター]]や[[glossary/Block-Building|マーケットメイカー]]が、横断中にあなたの資金を保持することは決してない。ベースレイヤーはあなたの[[glossary/Rollup|ロールアップ]]側を証明付きでのみ受け入れるため、[[glossary/Ethereum-Economic-Zone|EEZ]]は待ち時間だけでなく、信頼されるステップも不要にする。（今日のデモでは、その証明のために代理署名者を使用した。）
-   **すべてか無か**: パッケージ全体が着地するか、全く着地しないかのどちらかであるため、途中で立ち往生するような半分送信された状態は存在しない。
-   **構成可能**: 設計上、各要素は互いに呼び出し合い、結果を返すことができるため、「ベースレイヤーでスワップし、お釣りをあなたの[[glossary/Rollup|ロールアップ]]に戻す」という操作は1つのパッケージであり、3つの別々の旅ではない。

## 似ている点、異なる点、そして出会う場所

![図5](https://ethresear.ch/uploads/default/optimized/3X/6/d/6da152bdcd0a4e0b4c5c3bfe9ca6480e3ba7cf87_2_690x356.png "図5")

これらは競合するものではなく、2つの名前を持つ同じ機能でもない。[[glossary/Fast-Confirmation-Rule|FCR]]は、チェックアウトであろうとなかろうと、あらゆるイーサリアムブロックで機能し、すべての[[glossary/Ethereum-validator|バリデータ]]がすでに実行している[[glossary/Consensus-Client|コンセンサスクライアント]]内に存在する。[[glossary/Ethereum-Economic-Zone|EEZ]]は、そのゾーン内のコントラクト間のアクションでのみ機能し、特定の、まだ監査されていない[[glossary/Rollup|ロールアップ]]およびベースレイヤーコントラクトのセット内に存在する。これらが構成される理由は単純だ。[[glossary/Ethereum-Economic-Zone|EEZ]]の[[glossary/Atomic-Cross-Domain-State-Synchronization|アトミックパッケージ]]は依然として1つの通常のイーサリアムブロックとして着地し、[[glossary/Fast-Confirmation-Rule|FCR]]はブロックの中身が何であれ、それを迅速に確認することには関心がないからだ。

## チェックアウトを構築する4つの方法

![図6](https://ethresear.ch/uploads/default/optimized/3X/1/3/135c559815cb40a8c7c7a767b0a5ba1c5921379f_2_690x390.png "図6")

-   **どちらもなし。** 今日のチェックアウト：ブリッジ（数分、信頼が必要、または約1週間、トラストレス）と、その後の約13分の[[glossary/finality|ファイナリティ]]。通常、ブリッジが支配的だ。
-   **[[glossary/Fast-Confirmation-Rule|FCR]]のみ。** ブリッジは依然として最初に実行される必要があり、あなたはそれを信頼しなければならない。[[glossary/Fast-Confirmation-Rule|FCR]]は横断には関与しない。資金が到着すると、ショップ自身の待ち時間は約13分から約13秒に短縮される。依然としてブリッジに縛られる。
-   **[[glossary/Ethereum-Economic-Zone|EEZ]]のみ。** 横断が不要になり、信頼しなければならなかったブリッジも消える。あなたの[[glossary/Rollup|ロールアップ]]アクションとベースレイヤーアクションは1つのパッケージ、1つのブロックとして着地する。しかし、ショップは依然として迅速な確認ルールに頼ることができないため、そのブロックが確実に留まることを確認するために、[[glossary/finality|ファイナリティ]]の全約13分を待つことになる。
-   **両方。** 1つのパッケージ、1つのブロックが約2スロットで確認される。着地したスロットと、[[glossary/Fast-Confirmation-Rule|FCR]]の条件が満たされればもう1スロット、つまり約25秒だ。これは、高速で、信頼するブリッジがなく、**かつ**単一の統合である唯一の象限だ。

## 両方を組み合わせる：カード速度への道

![図7](https://ethresear.ch/uploads/default/optimized/3X/9/9/999fabdce46601e6e0c396450761fa6d905e6e4_2_690x270.png "図7")

あなたは一度署名する。[[glossary/Block-Building|ビルダー]]はあなたの[[glossary/Rollup|ロールアップ]]側（ETHを送り、お釣りを受け取る）とベースレイヤー側（USDCにスワップし、請求書を支払う）を1つのイーサリアムブロックに入れる。ショップはあなたの[[glossary/Rollup|ロールアップ]]が存在することを知る必要はない。ベースレイヤーを監視し、ブロックが着地するのを確認し、[[glossary/Fast-Confirmation-Rule|FCR]]が1スロット後にそれを`safe`とマークするのを確認し、商品を発送する。2スロット、1つの統合、信頼するブリッジは不要だ。この種で最初の[[glossary/Atomic-Cross-Domain-State-Synchronization|アトミックトランザクション]]は2026年10月5日に[[glossary/mainnet|メインネット]]に着地した。このチェックアウトよりもはるかに単純な転送だったが、同じ部品から構築されている。

25秒はまだカードをタップする速度ではない。しかし、**チェックアウト全体は秒ではなくスロットでカウントされる**ため、イーサリアムの[[glossary/slot|スロット]]時間が短縮されるたびに、待ち時間も短縮される。

![図8](https://ethresear.ch/uploads/default/optimized/3X/4/c/4c15a8d9cf59b3efcae9445a161d802089b3ac2d_2_690x350.png "図8")

まだ[[glossary/Draft|ドラフト]]段階の[[glossary/EIP-7782|EIP-7782]]は6秒[[glossary/slot|スロット]]を提案しており、Vitalikのロードマップスケッチは12 → 8 → 6 → 4 → 3 → 2と段階的に短縮していくことを示唆している（最後の2ステップはまだ推測的だ）。2秒[[glossary/slot|スロット]]の場合、チェックアウトは約5秒かかり、カード端末で許容される一時停止に近い。あなたは電話をタップし、ショップは`safe`と表示されるのを確認し、バッグがカウンターを越える。

この曲線に乗るのは、この組み合わせだけだ。[[glossary/slot|スロット]]が短くなってもブリッジの退出ウィンドウは短くならず、今日の[[glossary/finality|ファイナリティ]]では、ショップは2秒[[glossary/slot|スロット]]でも64[[glossary/slot|スロット]]、つまり2分以上待つことになる。[[glossary/Ethereum-Economic-Zone|EEZ]]と[[glossary/Fast-Confirmation-Rule|FCR]]を組み合わせることで、チェックアウトは2[[glossary/slot|スロット]]になり、その2[[glossary/slot|スロット]]はどんどん短くなっていく。

## チートシート

![図9](https://ethresear.ch/uploads/default/optimized/3X/d/9/d9718775c635d8f516a9cddf5f3ada244ab070b5_2_690x323.png "図9")

* * *

*ウェブ版: [cperezz.github.io/articles/pay-like-a-card-settle-like-ethereum](https://cperezz.github.io/articles/pay-like-a-card-settle-like-ethereum/)*

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/the-unleashed-power-of-stacking-eez-fcr-seen-through-an-example/26133)
