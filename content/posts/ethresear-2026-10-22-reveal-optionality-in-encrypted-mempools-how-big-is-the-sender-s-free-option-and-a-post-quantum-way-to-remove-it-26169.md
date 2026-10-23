---
title: 暗号化されたメムプールにおけるリビール選択性：送信者のフリーオプションの規模と、それを排除するポスト量子的な方法
original_title: >-
  Reveal optionality in encrypted mempools: how big is the sender’s free option,
  and a post-quantum way to remove it
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/reveal-optionality-in-encrypted-mempools-how-big-is-the-sender-s-free-option-and-a-post-quantum-way-to-remove-it/26169
author: arianaraghi
date: '2026-10-22'
category: Cryptography
tags:
  - cryptography
  - security
  - mempool
  - post-quantum
  - protocol-design
  - economics
topic_id: '26169'
translated_at: '2026-10-23'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Reveal optionality in encrypted mempools: how big is the sender’s free option, and a post-quantum way to remove it](https://ethresear.ch/t/reveal-optionality-in-encrypted-mempools-how-big-is-the-sender-s-free-option-and-a-post-quantum-way-to-remove-it/26169) — arianaraghi (2026-10-22)

皆さん、こんにちは。

[@aelowsson](https://ethresear.ch/u/aelowsson)、[@julian](https://ethresear.ch/u/julian)、[@b-wagn](https://ethresear.ch/u/b-wagn)、[@GottfriedHerold](https://ethresear.ch/u/gottfriedherold)に感謝します。この研究は[[glossary/LUCID|LUCID (EIP-8184)]]と、その批判スレッドに直接基づいています。また、この研究に対するレビューをお願いします。

暗号化された[[glossary/Encrypted-Mempool|暗号化メムプール]]における「[[glossary/Free-option-problem|フリーオプション問題]]」が実際にどれくらいの価値があるのか、そしてそれを取り除こうとするとどうなるのか、ずっと考えていました。短いバージョンはTL;DRにあります。証明を含む完全な内容は論文に、Lean 4による形式化は以下にリンクされています。

**TL;DR**

-   送信者が新しい情報を見た後にリビールするかどうかを決定できる場合、彼らは[[glossary/Free-option-problem|フリーオプション問題]]を保持しています。私はその価値を制限し、それを取り除こうとするとどうなるかを示します。
-   送信者が多くの条件付きコミットメントを使用できるため、手数料だけではその価格を適切に設定できません。
-   送信者からオプションを取り上げると、それは委員会メンバーに移るだけです。
-   私はブラインド同時リリース (BSR) を提案します。これは、誰も新しい情報に基づいて条件付けする前に、実行されるセットを固定します。ハッシュのみを使用するため、[[glossary/Post-Quantum|ポスト量子 (PQ)]]です。
-   論文: [Reveal Optionality - BSR.pdf](https://ethresear.ch/uploads/short-url/dQHmgHMfpfZSx0kcTEUWmf7za05.pdf) (391.1 KB)、またはGitHubリポジトリで確認できます。すべての定理は[[glossary/Lean-4|Lean 4]]で機械検証済みです（107定理、標準公理のみ）：[GitHub - aryaethn/optionality: Lean 4 formalization and numerics for 'Reveal Optionality in Encrypted Mempools, Separation, Pricing, and Blind Simultaneous Release with Post-Quantum Time-Locks' · GitHub](https://github.com/aryaethn/optionality)

**設定**

Gは誰もが常に得る情報であり、Fはリビールを制御する送信者が持つ情報とします。内生的なオプションは V^endo = V^F − V^G です。これは、市場が無料で提供するものに加えて、リビールを制御することで得られるものです。

**1. その規模はどれくらいか？**

-   V^endo はまさにイェンセンの不等式ギャップであり、単純な基準の下で厳密に正です。
-   オプションが確率 ε で行使される場合、‖D‖\_p (2ε)^(1−1/p) によって制限されます。
-   ETHのインプライドボラティリティが約51%、8秒のウィンドウの場合、外生的なオプションは約1 bpです。約6 bpの手数料があれば、行使を1%に抑えるのに十分です。

**2. 強制公開で解決できるか？**

-   タイムロック付きの復号化を義務付けることは役立ちますが、ハードウェアの速度が重要です。γ を、攻撃者が正直なソルバーよりも逐次関数を計算する速度がどれだけ速いかを表すものとします。
-   健全でタイムリーな強制公開には γ ≤ (t2 − t\_h)/(t1 − t\_pub) が必要です。[[Mempool|メムプール]]での1スロット待機では、その上限は2未満です。

**3. LUCIDの手数料は適切に価格設定されているか？**

[[glossary/LUCID|LUCID (EIP-8184)]]では、公開されたトランザクションはブロック先頭手数料の f/F を支払い、公開されなかったトランザクションは f を没収されます（F = 128）。このアイデアは、手数料が[[glossary/Probabilistic-Frontrunning|確率的フロントランニング]]の価格を設定するというものです。送信者が多くの条件付きコミットメントを使用すると、これは機能しなくなります。1つのセレクターと1つのエグゼキューターがあれば、任意のキャップ m ≥ 2 に十分です。ヒットすると f(1+1/F) のコストがかかり、ミスすると 2f/F しかかからないため、損益分岐点の手数料は次のようになります。

`f_inv = pΛ / (p(1+1/F) + 2(1−p)/F)`

そして、p1 ≥ 2/(F+1) の場合、常に Λ/2 以上になります。Λ = 50 bp、p1 = 1/64 の場合、これは約25 bpです。単一のコミットメントでは約0.8 bpしか必要ないため、マルチコミットメント攻撃を阻止するには約30倍の費用がかかります。

**4. オプションはどこへ行くのか？**

送信者からオプションを取り上げると、|W| ≥ n−t+1 の委員会メンバーのブロッキング連合がそれを継承します。任意の閾値 t に対して、ブロックまたは早期復号化できる最小の連合のサイズは min(t, n−t+1) ≤ ⌈n/2⌉ です。阻止が機能するのは、連合の正味ペナルティ β がオプションのペイオフの本質的上限以上である場合のみです。独立性のないハイブリッド設計では、誘発された利用不能性項が残ります。

**BSRの概要**

BSRは、事後的にオプションと戦うのではなく、誰も有用な情報を知る前に全員にコミットさせます。

-   t1後の短いウィンドウ ω の間に、各送信者はエスクローを投稿します。これは、値への署名付きコミットメントと、長い逐次ハッシュチェーン（70 ns/ステップで約1.4e8ステップ）でマスクされた値です。
-   通常、リリース者は素早く公開します。
-   彼らが非公開にした場合、誰でもパッドを計算して強制的に公開させることができます。
-   エスクローに矛盾がある場合、デポジットSはスラッシュされ、値は破棄されます。

得られるもの（定理5）：

-   エスクロー期限dの前に、内生的なオプションは厳密にゼロです。
-   dの後、Sが実行されたセットを変更することによる最大の利益をカバーする場合、逸脱は支払われません。論文の仮定A2の下では、手数料f1はコミットメントのキャップに関わらず阻止します。
-   d後の情報に基づいたブロッキングは、連合に少なくともSのコストをかけます。
-   t = ⌈2n/3⌉ の場合、ブロックできる最小の連合は、BSRなしの任意の閾値よりも小さくなることはなく、n = 2 および n ≥ 4 の場合は厳密に大きくなります。
-   すべてハッシュベースであるため、タイミングメカニズムにペアリングや離散対数仮定はありません。

**私が仮定していること、そして未解決の課題**

-   **ハードウェアギャップ。** BSRには γ ≤ Θ/ω が必要です。ここで Θ は公開ウィンドウです。12秒スロットの場合、γ\_max = 5 (ω = 2秒、Θ = 10秒) または 11 (ω = 1秒、Θ = 11秒) となります。これは明示的な仮定であり、私が測定したものではありません。逐次ハッシュASICの高速化に関する実際の数値があれば、これが解決されるでしょう。
-   **未分析。** 矛盾するエスクローに対する[[glossary/bisection|バイセクション（二分探索）]]紛争ゲーム、非共謀リリース者の完全な均衡分析、検証可能なエスクロー、バッチ処理された[[glossary/Post-Quantum|ポスト量子 (PQ)]]強制公開、およびエンドユーザーエスクロー。

特にハードウェアの仮定と、委員会モデルが展開された設計で期待されるものと一致するかどうかについて、フィードバックをいただければ幸いです。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/reveal-optionality-in-encrypted-mempools-how-big-is-the-sender-s-free-option-and-a-post-quantum-way-to-remove-it/26169)
