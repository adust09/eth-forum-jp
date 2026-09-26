---
title: イーサリアムのTCB、パート1：クライアント
original_title: 'Ethereum''s TCB, Part 1: The client'
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/ethereums-tcb-part-1-the-client/26086'
author: asn
date: '2026-09-25'
category: Security
tags:
  - security
  - formal-verification
  - protocol-design
  - research
  - client-diversity
  - trusted-computing-base
  - lean4
topic_id: '26086'
translated_at: '2026-09-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Ethereum's TCB, Part 1: The client](https://ethresear.ch/t/ethereums-tcb-part-1-the-client/26086) — asn (2026-09-25)

[George](https://x.com/asn_d6) と [Kev](https://x.com/kevaundray) による。

*この投稿の形成に多くの刺激的な議論を与えてくれた [Alex Hicks](https://x.com/alexanderlhicks) に感謝します。*

## 動機

2026年、AIは最近インターネットを混乱させています。[[glossary/Formal-Verification|形式検証 (FV)]]は、長期的には防御側が優位に立つための方法であるように思われます。

しかし、[[glossary/Formal-Verification|形式検証]]という言葉は安易に使われがちであり、イーサリアムの文脈でそれが何を意味するのかを深く掘り下げる価値があります。

[[glossary/Formal-Verification|形式検証]]を考える上で重要な視点となるのが、[[glossary/TCB|TCB（信頼できる計算基盤）]]です。これは、証明されるのではなく信頼されるすべてのコンポーネント、仕様、ツール、および仮定を指します。人間が依然としてチェックしなければならない部分です。[[glossary/Formal-Verification|形式検証]]は[[glossary/TCB|TCB]]を完全に排除することはできませんが、大幅に縮小することは可能です。

したがって、次の問いを立てる価値があります。

*「[[glossary/Formal-Verification|FV]]後の世界において、イーサリアムの[[glossary/TCB|TCB]]はどのようになるのか？」*

## 概要

イーサリアムプロトコルは広大で複雑であり、その[[glossary/TCB|TCB]]を分析することは価値がありますが、この投稿ではより簡単な問題に限定し、抽象的なイーサリアムクライアントの[[glossary/TCB|TCB]]について議論します。

この投稿では、主に2つのテーマについて議論します。

- ソフトウェアを[[glossary/Formal-Verification|形式検証]]されるモジュールに分割する方法
- [[glossary/end-to-end-FV|エンドツーエンド形式検証]]を達成する方法

私たちの定理証明器は[[glossary/Lean-4|Lean 4]]であり、これは要件というよりは時代の兆候です。以下のすべては、どの証明支援系でも機能します。

![画像](https://ethresear.ch/uploads/default/optimized/3X/1/e/1ed062c87b8ba9b7b53ca4c24903812ebc4bc470_2_690x314.png)

## イーサリアムクライアントとFV

[[glossary/Formal-Verification|形式検証]]の視点からイーサリアムクライアントを見ると、まずクライアント全体が何を保証すべきか（例：競合する[[glossary/Attestation|アテステーション（証明）]]を二度と署名しないこと）を決定する必要があります。

次に、クライアントをモジュールに分割し、それらの間のインターフェースを固定し、各モジュールがどのような保証を持つべきかを検討します。クライアント全体の保証は、これらのインターフェースに沿って構成されたモジュールの保証から導き出されます。

一般的に、一部のモジュールは[[glossary/Formal-Verification|形式検証]]が容易ですが、他のモジュールは困難または不可能です。

- *純粋な*モジュールは[[glossary/Formal-Verification|FV]]が容易です。それらは副作用がゼロまたは最小限で、数学的であり、クリーンなインターフェースを持っています。例えば、暗号化、[[glossary/Simple-Serialize|SSZ（シンプルシリアライズ）]]、またはフォーク選択ルールなどです。
- *ダーティな*モジュールは[[glossary/Formal-Verification|FV]]が困難です。それらは副作用とI/Oに満ちています。例えば、ネットワークモジュールをモデル化することは、メッセージが順不同で到着したり、接続が切断されたり、メッセージが遅れて到着したりする可能性があるため、複雑です。

![画像](https://ethresear.ch/uploads/default/optimized/3X/0/0/00070588822badd86e79f64b959687314e22f7dd_2_690x258.png)

### ダーティモジュールの取り扱い

イーサリアムクライアントには多くのダーティモジュールが存在するため（おそらく全体の半分以上）、それらをうまく扱うことが重要です。その方法は2つのステップで構成されます。

最初のステップは、ダーティモジュールを*設計上信頼できない*ものとして慎重にモデル化することです。

例えば、署名を*純粋な*署名検証モジュールに渡す*ダーティな*ネットワークモジュールを考えてみましょう。適切な脅威モデルでは、ネットワークモジュールのすべての出力は信頼できないものとして扱われます。これは署名モジュールの形式モデルの明示的な仮定となり、その定理はあらゆる入力に対して成立します。ネットワークモジュールのバグは、悪意のあるピアと何ら変わらず、証明はすでにそれをカバーしています。

![画像](https://ethresear.ch/uploads/default/optimized/3X/a/5/a553c2dd157797f42ee853bad1820c1222d8e422_2_690x166.png)

2番目のより長期的なステップは、検証済みの境界を外側に押し広げ、可能な限りハードウェアに近い部分までダーティモジュールも[[glossary/Formal-Verification|FV]]することです。ネットワークのモデリングと検証は困難ですが、その上に位置するパーサー、ゴシップルール、同期ロジックを検証することで、いかなるメッセージもそれらをクラッシュさせたり、無制限のリソースを消費させたりしないことを証明できます。

## 仕様からバイナリへ

イーサリアムユーザーは[[glossary/Lean-4|Lean 4]]の定理や仕様には関心がありません。彼らが関心があるのは、自分のコンピューターで実行されるコードが安全であることだけです。

したがって、本当に重要なのは[[glossary/end-to-end-FV|エンドツーエンド形式検証]]です。証明は、ユーザーが実際に実行するバイナリに可能な限り近づく必要があります。

[[glossary/end-to-end-FV|エンドツーエンド形式検証]]のタスクを2つの半分に分けましょう。

1.  [[glossary/Lean-4|Lean 4]]で形式仕様を記述し、それに関する定理を証明すること
2.  そして、実装が[[glossary/Lean-4|Lean 4]]の仕様と一致することを証明すること

例えば、[[glossary/Simple-Serialize|SSZ（シンプルシリアライズ）]]モジュールを考えてみましょう。前半は、その仕様を記述し、例えばデコードが元の値を返すことを証明することです。後半は、クライアント内の[[glossary/Simple-Serialize|SSZ]]コードがその仕様の言うことを実行することを示すことです。

![画像](https://ethresear.ch/uploads/default/optimized/3X/a/5/a5d00283ebd20598fb4db746f4d46307d674671c_2_690x166.png)

良い仕様を記述することは困難です。しかし、この投稿ではある程度の創作の自由を許容し、仕様は与えられたものとして、問題の後半に焦点を当てます。

## エンドツーエンドの検証

[[glossary/end-to-end-FV|エンドツーエンド形式検証]]には多くの提案があります（この[調査](https://ethresear.ch/t/formal-verification-of-execution-and-consensus-clients/25894/9)と[この講演](https://www.youtube.com/watch?v=IY_SfBvejko)を参照）。それらはすべて共通のテーマを持っています。

*ソースコードが[[glossary/Lean-4|Lean 4]]で証明された形式モデルに対応することを何らかの方法で証明し、さらにそのソースコードをバイナリに変換するものが何であれ、その正しさを証明しようとします。*

もちろん、これは自明ではありません。なぜなら、ソースコード側はRust/Go/C#で書かれているのに対し、モデル側は[[glossary/Lean-4|Lean 4]]だからです。これら2つの世界を結びつけるのは難しく、いくつかの提案されたアプローチがあります。

Rustで書かれたクライアントを考えてみましょう（Go、C#などでも同様です）。[[glossary/end-to-end-FV|エンドツーエンド形式検証]]のための4つの選択肢を見てみましょう。

### オプション1：トランスレーター

![画像](https://ethresear.ch/uploads/default/optimized/3X/8/b/8bf70c1d526b7ec5227909f8426570a6a7304187_2_690x165.png)

このアプローチでは、モジュールはRustのままで、何らかのトランスレーターソフトウェアを使用して[[glossary/Lean-4|Lean 4]]に自動翻訳されます。

Microsoftのような大企業は、このアプローチのためのツール開発に数百万ドルを投じてきました。例えば、[Aeneas](https://www.microsoft.com/en-us/research/publication/aeneas-rust-verification-by-functional-translation/)はRust-to-Leanのためのまさにそのツールであり、[hax](https://github.com/cryspen/hax)も同様のツールです。

このアプローチには2つの問題があります。トランスレーター自体が[[glossary/TCB|TCB]]の一部となること。また、Rustのような言語には*形式意味論*がないため、トランスレーターは言語のサブセットしか扱えず、クライアントコードはそのサブセット内に留まらなければなりません。この最後の問題は特に制限的です（[sproulによるAeneasでの試み](https://discord.com/channels/595666850260713488/1544664467076292709/1544843992406171798)を参照）。

このアプローチでは、最終的なバイナリを準備するRustコンパイラも[[glossary/TCB|TCB]]の一部となることを言及する価値があります。

### オプション2：[[glossary/Lean-4|Lean 4]]で書かれたモジュール

![画像](https://ethresear.ch/uploads/default/optimized/3X/d/3/d3606acdb8442a7f62a07f5873249b5c8fe5d705_2_690x138.png)

このアプローチでは、モジュール自体を[[glossary/Lean-4|Lean 4]]で記述するため、証明は実装自体について言及します。コードはその後Cに抽出され、[[github.com/leanprover/lean4/blob/master/doc/dev/ffi.md|FFIバインディング]]を使用してクライアントと統合されます。

信頼されるのは、Lean-to-Cエクストラクタ ([leanc](https://lean-lang.org/doc/reference/latest/Build-Tools-and-Distribution/))、Cコンパイラ、およびFFIバインディングです。

### オプション3：Lean最大限活用

![画像](https://ethresear.ch/uploads/default/optimized/3X/2/1/21bcf2c7fbc934cbbc9aa428eebaa7dda2555b1d_2_690x129.png)

このアプローチでは、クライアント自体が[[glossary/Lean-4|Lean 4]]で記述され、上記のオプションと同じ方法でコンパイルされます。

ダーティモジュールは、適切な言語で記述され、FFIで組み込まれます。[[glossary/TCB|TCB]]はオプション2と同じです：エクストラクタ、Cコンパイラ、バインディング。

このオプションの利点は、証明がモジュール間の結合部分により深く到達できることです。

### オプション4：アセンブリ

![画像](https://ethresear.ch/uploads/default/optimized/3X/f/8/f893a123fcfa3c07b21f6f5587ac45328a4a549c_2_690x144.png)

このアプローチでは、モジュールはRISC-Vアセンブリで[直接記述されます](https://blog.zksecurity.xyz/posts/end-coding/)。最初は非常識に思えるかもしれませんが、これによりコンパイラを[[glossary/TCB|TCB]]から完全に排除できます。

[[glossary/Lean-4|Lean]]の仕様とアセンブリは、[RISC-V ISAの形式モデル](https://github.com/Verified-zkEVM/riscv-zkvm)によって接続されており、その[モデルは信頼されています](https://github.com/awslabs/s2n-bignum/blob/main/SOUNDNESS.md#b1-isa-model-fidelity)。AWSは、[s2n-bignumライブラリ](https://github.com/awslabs/s2n-bignum/)を介して、本番環境の多倍長整数演算にこのオプションを使用しています。また、RISC-Vアセンブリを、ユーザーが持つマシンに応じてx86またはARMアセンブリに変換するエミュレータまたはトランスレーターも必要です。

### オプション5：検証済みコンパイラ

![画像](https://ethresear.ch/uploads/default/optimized/3X/7/3/73df7e8a8559c7d8480d1807083bcbc26b44bad5_2_690x137.png)

このアプローチでは、モジュールは[[glossary/Formal-Verification|FV]]に適した言語で記述され、そのコンパイラは正しさが証明されています。[Pancake](https://cakeml.org/pancake)はその一例で、検証のためにゼロから構築されたCライクな言語です。[[glossary/Lean-4|Lean]]の証明はPancakeのソースコードについて言及でき、検証済みコンパイラがそれらをマシンコードまで伝達します。これにより、[[glossary/TCB|TCB]]を縮小し、エクストラクタとCコンパイラが信頼される必要がなくなります。

[[glossary/TCB|TCB]]の観点から見ると、証明が深く到達するほど[[glossary/TCB|TCB]]は小さくなりますが、同時に*今日のソフトウェアエンジニアリングの実践からの乖離*も大きくなります。

### ハイブリッドアプローチ

これらのオプションは、同じクライアント内で組み合わせることもできます。数学的なモジュールは、[[glossary/Lean-4|Lean]]で記述および証明するのに特に適しています。一方、フォーク選択のような大規模なモジュールや、多くのデータ構造を使用するモジュールは、AeneasやPancakeのような高レベルなツールの恩恵を受けるかもしれません。

## 考察：エンジニアリングの変化

AIがソフトウェアエンジニアリングを変えたことは周知の事実です。しかし、私たちのケースではセキュリティ上重要なコードベースを扱っているため、潜在的な変化はさらに大きくなります。

**インターフェースは依然として重要**：すべての[[glossary/Formal-Verification|FV]]アプローチは、クライアント内の綿密なインターフェース設計を必要とします。純粋な部分とダーティな部分を分離するための最もシンプルなインターフェースを見つけることは非常に重要であり、[[glossary/Formal-Verification|形式検証]]の定理も形成します。幸いなことに、これはソフトウェアエンジニアリングにおいて常にそうでした。モジュラーシステムとクリーンなインターフェースを設計することが、常に良いコードベースと悪いコードベースを分けるものでした。

## 未解決の疑問

- 仕様と定理を監査するのは誰か？仕様の多様性を好むのか、それとも多くの目による1つの良い仕様を好むのか？
- [[aws.amazon.com/blogs/security/an-unexpected-discovery-automated-reasoning-often-makes-systems-more-efficient-and-easier-to-maintain/|形式検証]]済みコンポーネントのパフォーマンスは、ネイティブパフォーマンスと比較してどうか？

*2投稿 - 2参加者*

[トピック全文を読む](https://ethresear.ch/t/ethereums-tcb-part-1-the-client/26086)
