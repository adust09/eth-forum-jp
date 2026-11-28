---
title: SETCODEFROMのステート担保型検証
original_title: A state-backed validation of SETCODEFROM
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/a-state-backed-validation-of-setcodefrom/26300'
author: CPerezz
date: '2026-11-27'
category: Uncategorized
tags:
  - execution-layer
  - eip
  - smart-contracts
  - security
  - evm
  - protocol-design
  - account-abstraction
  - state-management
topic_id: '26300'
translated_at: '2026-11-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [A state-backed validation of SETCODEFROM](https://ethresear.ch/t/a-state-backed-validation-of-setcodefrom/26300) — CPerezz (2026-11-27)

## [[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]のドラフトを[[glossary/mainnet|メインネット]]のバイトコードに対してテストしました。その結論は？2つの新しいルールが必要です。その理由とコストについて説明します。

[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]は、アカウントのコードハッシュを、別のコントラクトがすでにデプロイしているコードに向ける命令です。ドラフトは寛容でした。どのアカウントでも、自分の代わりに実行されている任意のコードから、好きなだけコードを採用でき、新しいコードは命令が実行された瞬間に反映されました。

この寛容さが、[アカウントモードのメニュー](https://cperezz.github.io/articles/setcodefrom-account-modes/)の基盤となっており、そこに問題がありました。私たちは、現在[[glossary/mainnet|メインネット]]に存在するバイトコードに対して最悪のケースを実行しました。その結果、2つの問題が発覚し、それぞれについて[提案する変更](https://github.com/ethereum/EIPs/pull/12716)にルールが追加されました。現在、危険にさらされているものはありません。[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]はまだ稼働しておらず、修正は[[glossary/EIP|EIP（Ethereum 改善提案）]]に組み込まれるものであり、誰かのコントラクトに組み込まれるものではありません。

## 今日信頼できる2つのこと

Cancun以降、[[glossary/EIP-6780|EIP-6780]]により、`SELFDESTRUCT`はコントラクトを作成したトランザクション内でのみコントラクトを削除できるようになったため、デプロイされたコードは変更されなくなりました。コントラクトは、それに続く2つの保証に静かに依存し始めました。

[![Figure 1](https://ethresear.ch/uploads/default/optimized/3X/6/e/6e71bdc7b58c86f85a13bcf5a00b9b6cd1118170_2_690x368.png)](https://ethresear.ch/uploads/default/original/3X/6/e/6e71bdc7b58c86f85a13bcf5a00b9b6cd1118170.png "図1")

*図1：Cancun以降、デプロイされたコードが持っていた2つの保証。ドラフトではどちらも放棄されていました。表示されているものが実行されるコードであり、借りたコードが自分のコードを置き換えることはできません。*

どちらもコンセンサスルールではありませんが、[[glossary/EIP-7702|EIP-7702]]は意図的に最初のものを保護しました。`EXTCODEHASH`が委任に従うことを拒否することで、どのアカウントも「一時的に特定のコードハッシュを持っているかのように偽装する」ことができないようにしました。

## 発見1：あるコードを表示し、別のコードを実行する

ドラフトの下では、[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]を実行するフレームは、ロードしたコードの実行を継続しますが、他のすべてのノードはすでに採用されたコードを認識しています。つまり、アカウントは1つのコードを表示しながら、別のコードを実行します。[sudoswapのルーター](https://etherscan.io/address/0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329#code)は、呼び出し元のコードがそのペアのいずれかのように始まる場合、承認されたNFTを移動させます。これは今日では健全なチェックです。

[![Figure 2](https://ethresear.ch/uploads/default/optimized/3X/a/d/ade62765bab37fdafa367e8c430102d935909b47_2_666x500.png)](https://ethresear.ch/uploads/default/original/3X/a/d/ade62765bab37fdafa367e8c430102d935909b47.png "図2")

*図2：攻撃者はペアのコードを表示しながら自身のコードを実行するため、sudoswapのファクトリはそれを保証し、ルーターは被害者のNFTを移動させます。ルール1が適用されれば、ファクトリは攻撃者の実際のコードを認識し、ルーターは拒否します。*

> **[[glossary/mainnet|メインネット]]のバイトコードからsudoswapのルーターとファクトリを実行しました。ドラフトの下では、ルーターは被害者のNFTを攻撃者に移動させます。** 戻る前に古いコードを再度採用しても、ステートにも[[glossary/Block-Access-List-Byte-Floor|ブロックアクセスリストのバイトフロア]]にも痕跡は残りません。

「この呼び出し元は私のクローンの一つか」というチェックは、ERC-1167の参照`isClone`を含め、同様に騙されます。ルール1がこれを解決します。

## 発見2：借りたコードが自分のコードを置き換える

ドラフトでは、借りたコードが借り手のために採用することも許可されており、そのように記述されていました。「この[[glossary/EIP|EIP（Ethereum 改善提案）]]は、委任された実行が呼び出し元のアカウントコードを更新することを許可する」。これは、プロキシが卒業する方法であり、コントラクトが単に実行しただけのものによってコードを失う方法でもありました。

[![Figure 3](https://ethresear.ch/uploads/default/optimized/3X/e/6/e6b579e4f3e11f301b480612c320ba4ab7ebee81_2_690x459.png)](https://ethresear.ch/uploads/default/original/3X/e/6/e6b579e4f3e11f301b480612c320ba4ab7ebee81.png "図3")

*図3：モジュールが2つの[[glossary/DELEGATECALL|DELEGATECALL (デリゲートコール)]]を通じてSafeにペイロードを実行させます。ドラフトの下では、ペイロードの[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]がSafeのコードを置き換え、ガードがチェックするすべては同じままです。ルール2が適用されれば、命令は停止し、Safeはそのプロキシを維持します。*

> **[[glossary/mainnet|メインネット]]のバイトコードからSafe 1.4.1をセットアップし、モジュールに[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]を実行するペイロードを実行させました。ドラフトの下では、Safeのプロキシコードは消滅し、モジュール呼び出しは成功を報告します。**

なぜこれが聞こえるよりも悪いのか：

-   **コードが所有者を強制するものです。** プロキシはすべての呼び出しを、それらをチェックするシングルトンに送ります。それを置き換えれば、新しいコードを書いた者がSafeを制御します。
-   **ガードが監視するものは何も移動していません。** [Bybitハック](https://www.halborn.com/blog/post/explained-the-bybit-hack-february-2025)では、ペイロードがシングルトンを指すスロットを書き換えました。ここでは、所有者、閾値、モジュール、残高、およびそのスロットはすべて変更されていません。
-   **元に戻す方法がなく、Safeだけの問題ではありません。** 所有者はストレージを復元できますが、コードを変更できるのは新しいコードだけです。実行するコードを渡される可能性のあるすべてのコントラクトが危険にさらされており、次のセクションでその数を数えます。それは、これまでに作成されたすべてのもののほぼ3分の1に相当します。

**ルール2がどのように修正するか。** [[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]は、フレームで実行されているコードがアカウント自身のコードでない限り停止します。Safeでは、フレームはペイロードを実行するため、今日の`0xA7`がそこで行うのとまったく同じように停止し、Safeはそのプロキシを維持します。ルール1だけでは、Safeの最も外側のフレームが終了するまで置き換えが遅れるだけです。

## 誰が借りたコードを実行するのか？

[[glossary/mainnet|メインネット]]のブロック26,430,999までのコントラクト作成によって残されたすべてのコードをスキャンし、そのうちどれだけが借りたコードを実行しているか、そして誰がそのコードを選んでいるかを調査しました。

[![Figure 4](https://ethresear.ch/uploads/default/optimized/3X/0/f/0fdb7a81ecdbb5f267529621e393e076957e0c7c_2_690x436.png)](https://ethresear.ch/uploads/default/original/3X/0/f/0fdb7a81ecdbb5f267529621e393e076957e0c7c.png "図4")

*図4：全コントラクト作成の62.6%が借りたコードを実行できます。借りているコードを追跡すると、全作成の27.4%は永久に固定されたコードを借りており、30.9%は実行時に誰かが選ぶコードを借りています（その3分の2はCoinToolのXENプロキシ）、そして4.3%は追跡できませんでした。コードを選ぶことができる者は、今日、コントラクトが保持するものを消費できます。ドラフトの下では、そのコードを置き換えることもできました。*

62.6%は上限値であるため、これらのコードのうち最も多く作成された400個について、何を借りているかを追跡しました。全コントラクトの27%は永久に固定されたコードを借りており、ドラフトでもそれらに触れることはできませんでした。31%については、誰かが実行時にコードを選択します。そのうち3分の2はCoinToolのXENミントプロキシという一つのファミリーであり、作成者が送信するものは何でも実行します。残りは、取引所のデポジットウォレット、OpenSeaのユーザープロキシ、Safe、DSProxyなどです。

今日、そのコードを選択する者は、コントラクトが保持するものを消費できますが、そのコードを置き換えることはできません。ドラフトはこの境界線を消去しましたが、ルール2がそれを再描画します。

## ルール1：今記録し、最も外側のフレームが終了したときに切り替える

[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]は、もはやコードハッシュを変更しません。保留中のコードハッシュを記録し、それはアカウントの最も外側のフレームが正常に終了したときに書き込まれます。それまでは、アカウントは自身にとっても他のすべての人にとっても、以前とまったく同じです。

[![Figure 5](https://ethresear.ch/uploads/default/optimized/3X/7/a/7abfb147acc643173d5a434f6048056bf8ee3069_2_690x425.png)](https://ethresear.ch/uploads/default/original/3X/7/a/7abfb147acc643173d5a434f6048056bf8ee3069.png "図5")

*図5：ルール1。[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]は新しいコードハッシュを記録するだけです。アカウントの最も外側のフレームが正常に終了するまで、すべての観測者は古いコードを認識します。リバートが発生すると記録は破棄されます。*

-   **アドレスごとの最も外側**、なぜなら[[glossary/DELEGATECALL|DELEGATECALL (デリゲートコール)]]やアカウントへのコールバックは、依然としてそのアカウントのフレームであり、古いコードを実行しているからです。
-   **トランザクションの終わりではありません。** 後続の呼び出しや、[[glossary/Frame-Transactions|8141フレームトランザクション]]の後続のフレームは新しいコードを実行するため、1回の呼び出しで移行し、次の呼び出しで初期化する、という流れは引き続き機能します。

## ルール2：自分のコードだけが自分のコードを置き換えることができる

アカウントがコードを保持しており、フレームが別のコードを実行している場合、[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]は、今日の`0xA7`がそこで行うのとまったく同じように停止します。

[![Figure 6](https://ethresear.ch/uploads/default/optimized/3X/b/d/bd325fd30a6300c72410e95c75d42b3de0b1cf40_2_690x413.png)](https://ethresear.ch/uploads/default/original/3X/b/d/bd325fd30a6300c72410e95c75d42b3de0b1cf40.png "図6")

*図6：ルール2。コードを保持するアカウントは、その同じコードからのみ採用します。[[glossary/DELEGATECALL|DELEGATECALL (デリゲートコール)]]で呼び出されたコードからは、命令は停止します。コードを持たないアカウント、または[[glossary/EIP-7702|EIP-7702]]の委任を持つアカウントは、その[[glossary/initcode|初期化コード]]またはそのデリゲートを通じて採用します。*

撤回された`SETCODE`提案である[[glossary/EIP-6913|EIP-6913]]は、同じ理由でこのルールをより厳格な形で持っていました。命令を持たないコードは「不変であると安全に仮定できる」からです。

このルールは、アカウントが保持するコードを見ており、それがどのような種類のアカウントであるかは見ていません。[[glossary/Frame-Transactions|フレームトランザクション]]では、「[[glossary/EOA|EOA (Externally Owned Account)]]」と「コントラクト」は、そのコードを記述するにすぎません。コードを持たないアカウント、または[[glossary/EIP-7702|EIP-7702]]の委任のみを持つアカウントは、保護すべき自身のものを持たず、そのデリゲートが移行方法となります。

## デプロイ済みのコードで`0xA7`をすでに実行しているものはあるか？

ルール2が適用された場合、今日デプロイされているコントラクトは、自身のコードが`0xA7`を実行する場合にのみコードを変更できます。そのようなコントラクトはあるでしょうか？

[![Figure 7](https://ethresear.ch/uploads/default/optimized/3X/1/a/1aeadd77c7bf5f336b9b3eed49ac69f9ee8447f0_2_690x402.png)](https://ethresear.ch/uploads/default/original/3X/1/a/1aeadd77c7bf5f336b9b3eed49ac69f9ee8447f0.png "図7")

*図7：調査結果。3,031,417個の異なるデプロイ済みコードのうち、212,172個は命令が開始できる位置にバイト`0xA7`を持ち、29個はそこに到達する可能性があり、2個はそれを実行し、実行して継続するものは1つもありません。*

いいえ、ありません。2つのコードがそれを実行しますが、どちらもすべての入力に対して次の命令で停止します。これは、今日バイト自体で停止するのとまったく同じです。

調査では6,650個のコードが未解決のまま残されました。バイトは、データから計算されたジャンプでしか到達できないジャンプ先に存在していました。私たちはすべてを分析しましたが、見知らぬ人がバイトを実行して結果を保持できるようなものは一つもありませんでした。

| [[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]がそれらを変更できない理由 | コード数 | コントラクト数 |
| --- | --- | --- |
| コードはバイトの直後に停止またはリバートし、採用を破棄する | 6,007 | 6,506 |
| 最初の命令からバイトに到達するパスが全くない | 637 | 767 |
| バイトはデータ内にあり、見知らぬ人の手の届かない場所にある | 6 | 29 |

静的解析は最初の2行をそれ自体で解決します。最後の6行は解決できません。5つでは、ジャンプターゲットがコールデータまたはストレージから来ており、1つは大きすぎて完了できないため、それらを読み取りました。4つは[[glossary/MEV|MEV（最大抽出可能価値）]]ボットで、そのジャンプテーブルは所有者のみが駆動し、バイトまで到達することはありません。1つはBoson Protocolの[[glossary/Facet|ファセット（スマートコントラクト）]]で、その関数ポインタは初期化子のみが書き込みます。最後の1つは古いコントラクトで、そのバイトはコンパイラのメタデータ内にあり、コードの終わりを超えています。分析が探索した1200万の状態では、すべてのジャンプは固定されていました。アーカイブノードでは、最も困難な25ケースのうち223件の実際のトランザクションはデータにジャンプしませんでした。

7,289個のコントラクトは、約5 ETH、197 WETH、90万USDCを保持しており、そのほとんどが最初の行にあります。最後の行はETHを保持しておらず、トークンのわずかな残高のみです。

> **見知らぬ人にジャンプターゲットを選択させるコントラクトは、すでに壊れています。それは[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]のバグではなく、そのコントラクトのバグです。**

## 各ルールにはそれぞれの役割がある

両方の[[glossary/mainnet|メインネット]]ケースで4つの組み合わせすべてを実行しましたが、どちらのルールも互いをカバーしません。sudoswapの攻撃者は自身のコードから採用するため、ルール2では止められません。Safeは誰の身元についても騙されていないため、ルール1は損害を遅らせるだけです。

[![Figure 8](https://ethresear.ch/uploads/default/optimized/3X/1/b/1bcb8509f7e7b54daa819fd98f9358a049816a4f_2_690x345.png)](https://ethresear.ch/uploads/default/original/3X/1/b/1bcb8509f7e7b54daa819fd98f9358a049816a4f.png "図8")

*図8：各ルールは、[[glossary/mainnet|メインネット]]のバイトコードで実行された4つの組み合わせすべてにおいて、一方の発見を阻止し、もう一方を阻止しません。*

## もはやできなくなること

4つのことができなくなり、最初のものが痛手となります。

[![Figure 9](https://ethresear.ch/uploads/default/optimized/3X/f/8/f8bec41587d0b9d3df71afbc028ef238a9a95734_2_690x459.png)](https://ethresear.ch/uploads/default/original/3X/f/8/f8bec41587d0b9d3df71afbc028ef238a9a95734.png "図9")

*図9：できなくなること：プロキシの卒業、コードを保持するアカウントのために借りたコードが採用すること、同じフレームで新しいコードハッシュを読み取ること、採用してから自分自身を呼び出すこと。残ること：[[glossary/initcode|初期化コード]]からの安価なコピー、キーの引退、キー上のコードアカウント、インプレースアップグレード、ガス料金表。*

-   **プロキシは卒業しません。** [[glossary/EVM|EVM (イーサリアム仮想マシン)]]にとって、実装を通じて採用するプロキシと、[[glossary/DELEGATECALL|DELEGATECALL (デリゲートコール)]]を通じてハイジャックされた実装は同じものであり、一方を閉じることはもう一方を閉じることになります。プロキシは通常のアップグレードパスを維持し、[[glossary/fork|フォーク]]後にデプロイされたプロキシは、自身のコード内に[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]を保持できます。
-   **残りは順序の問題です。** アップグレード関数を自身のバイトコードに置き、採用後にコードハッシュをチェックするのではなく、採用前にソースをチェックし、採用前または後続の呼び出しで初期化します。最も外側のフレームが終了するまで、自分自身への呼び出しは依然として古いコードを実行します。

テンプレートを作成する際に覚えておくべき2つのこと。[[glossary/DELEGATECALL|DELEGATECALL (デリゲートコール)]]を通じて実行するコードは、依然としてあなた自身としてあなたを呼び出すことができます。ルール2は、借りたコードが命令を実行するのを阻止するものであり、自身のコードに依頼するのを阻止するものではありません。そして、テンプレートもアカウントです。もし[[glossary/SETCODEFROM|SETCODEFROM (EVM命令)]]を保持している場合、自身のコードが自身のコードを採用するのを拒否させるか、または、そのチェックを通過する者が、それに委任されたすべてのアカウントのコードを置き換えることになります。

* * *

*Web版：[cperezz.github.io/articles/setcodefrom-state-backed-validation](https://cperezz.github.io/articles/setcodefrom-state-backed-validation/)*

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/a-state-backed-validation-of-setcodefrom/26300)
