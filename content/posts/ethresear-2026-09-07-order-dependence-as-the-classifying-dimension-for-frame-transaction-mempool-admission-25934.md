---
title: フレームトランザクションのメムプール承認における分類軸としての順序依存性
original_title: >-
  Order-dependence as the classifying dimension for frame-transaction mempool
  admission
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/order-dependence-as-the-classifying-dimension-for-frame-transaction-mempool-admission/25934
author: AnkushinDaniil
date: '2026-09-07'
category: Execution Layer Research
tags:
  - execution-layer
  - mempool
  - account-abstraction
  - transaction-validation
  - protocol-design
  - scaling
  - evm
  - research
  - economics
  - formal-verification
  - state-management
topic_id: '25934'
translated_at: '2026-09-09'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Order-dependence as the classifying dimension for frame-transaction mempool admission](https://ethresear.ch/t/order-dependence-as-the-classifying-dimension-for-frame-transaction-mempool-admission/25934) — AnkushinDaniil (2026-09-07)

[[glossary/Frame-Transactions|フレームトランザクション]]に重ねられる[[glossary/Mempool|メムプール]]承認ルールは、単一の暗黙的な分類器を共有しています。それは、有効性チェックが順序依存ステートを読み取るかどうかです。このノートでは、その分類器に名前を付け、[[glossary/CALM-theorem|CALM定理]]と[[glossary/Herlihy-consensus-hierarchy|ハーリヒー合意階層]]にその根拠を置き、それが意味する還元不可能なコアを導き出します。

## 1. 問題

ノードは現在、トランザクションの有効性を実行することで確立しています。公開[[glossary/Mempool|メムプール]]では、このコストは非対称です。承認時の評価は無償であり、[[glossary/Account-Abstraction|アカウント抽象化 (Account Abstraction)]]（[[glossary/EIP-8141|EIP-8141]]）の下では検証コードは任意であるため、安価に送信できるトランザクションは、それを考慮するすべてのノードに無制限の検証作業を課す可能性があります。表1の各メカニズムは、その無償の作業を制限するために存在します。

## 2. 5つのメカニズム、1つの次元

3つの競合クラスが全体を通して使用され、セクション3と4で正式に導出されます。表1を明確に読むために、ここでそれらを述べます。

-   **クラス0**、シングルライター: 送信者のみが変更できます（ナンス (nonce)、自身の残高引き落とし）。
-   **クラス1**、最近のルートに紐付けられた: 保存されたルートに対して読み取られる共有値で、古い値が許容される場合（キーストア権限）。
-   **クラス2**、ライブ競合: ブロック内で多くのライターが存在し、ライブ値が必要な場合（AMM価格、先着順スロット）。

クラス0と2は、標準的なシングルライターと共有の分割（例えば[Suiの所有オブジェクトと共有オブジェクト](https://move-book.com/object/fast-path-and-consensus/)）を再定義するものであり、クラス1は、その分割に欠けていた、[[glossary/EIP-8272|EIP-8272]]によって提供される最近のルートに紐付けられたティアです。これを別のクラスとして位置づけることが、このノートの貢献です。

**表1.**

| メカニズム | 制限するもの | 競合下での読み取り |
| --- | --- | --- |
| [[glossary/MAXVERIFYGAS|MAX_VERIFY_GAS]]（[[glossary/EIP-8141|EIP-8141]]） | VERIFYプレフィックスが実行できる作業 | クラス0から1のみを承認 |
| [[glossary/VOPS-Profiles|VOPSプロファイル]]（[[glossary/EIP-8369|EIP-8369]]） | [[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]強制（[[glossary/EIP-7805|EIP-7805]]）が安価なトランザクション | VOPS適格 = クラス0 |
| [[glossary/recent-roots|最近のルート]]（[[glossary/EIP-8272|EIP-8272]]） | ライブステートではなく、保存されたルートに対してチェック | クラス1の解除 |
| [[glossary/2D-gas|2Dガス]]（[[glossary/EIP-8037|EIP-8037]]） | ステートアクセスを次元として価格設定 | 真の分割は競合ありかなしか |
| [[glossary/Transaction-Validity-Proofs|トランザクション有効性証明]]（ethereum/EIPs#12075） | プレフィックスを実行する代わりに[[glossary/STARK|STARK]]を検証 | 送信者ローカル = クラス0のみ |

これらを合わせて読むと、これらは5つの独立したルールではなく、1つの次元に対する5つの閾値であることがわかります。

## 3. 形式的根拠

これらの閾値の背後にある次元は、正確に定義できます。ブロック内で読み取りが順序独立であるのは、それがブロックの他のトランザクションと可換である場合のみであり、したがって順序独立性は可換性と一致します（Shapiro et al., 2011）。送信者自身のナンス (nonce) はシングルライターであるため可換ですが、共有されたAMM価格は、その値がどのスワップが最初に順序付けられるかに依存するため可換ではありません。[[glossary/CALM-theorem|CALM定理]]によれば、計算が協調フリーな実装を許容するのは、それが単調である場合のみであり（Hellerstein and Alvaro, 2019; Ameloot, Neven and Van den Bussche, 2013によって証明）、したがって順序フリーな有効性は、まさに単調で可換なフラグメントです。[[glossary/Transaction-Validity-Proofs|トランザクション有効性証明]]ドラフト（Harvey-Hill）の「送信者ローカル」制限は、そのフラグメントの一般的なシングルライターケースです。

## 4. 分類軸

したがって、分類軸は順序依存性であり、読み取られるステートの量ではありません。ステートの量はこれらのケースを誤ってランク付けします。シングルライターデータは、どれほど頻繁に書き換えられてもチェックが安価であるのに対し、単一の競合スロットは高価であり、セクション3のナンスと価格の対比が正しい次元で読み取られます。競合によってインデックス付けすると、表1のメカニズムは、{0: シングルライター、1: 最近のルートに紐付けられ、古い値が許容される、2: ライブ競合} のクラスに対する閾値に集約されます。

## 5. 還元不可能なフロア

この還元にはフロアがあります。「この[[glossary/nullifier|ナリファイア]]は未使用である」または「このスロットは空いている」という形式のアサーションは反単調であり、並行トランザクションがそれを偽にすることができるため、過去のルートに対する証明では解決できません。[[glossary/CALM-theorem|CALM定理]]によれば、そのようなアサーションには協調が必要であり、[[glossary/Herlihy-consensus-hierarchy|ハーリヒー合意階層]]によれば、1回消費オブジェクトは少なくとも2の合意数を持ち、それ自体が合意プリミティブであり、協調フリーレジスタから構築することはできません。したがって、いかなる台帳の還元不可能な、順序付けられたコアは、まさにその厳密に1回のアサーションです。他のすべての有効性チェックは、原則として順序フリーな証明付き承認が可能です。

## 6. 以前の作業との関連

この再構築は既存の作業に基づいており、このノートでは明示的にその功績を認めています。安価に強制できる有効性と高価に強制できる有効性の区別、および[[glossary/VOPS-Profiles|VOPSプロファイル]]2の送信者ローカルストレージ制限は、[[glossary/EIP-8369|EIP-8369]]（Thiery）によるものであり、ここでは主張されていません。それと比較して、このノートは3つのことを貢献します。その境界の背後にある次元（順序依存性）を特定し、既存の理論（CALM; Herlihy; Shapiro et al.）にその根拠を置いています。正しい尺度はステートの量ではなく競合であると主張しています。なぜなら、シングルライターデータはどれほど頻繁に書き込まれても安価であるからです。そして、いかなる承認スキームも超えることのできない、厳密に1回というフロアを述べています。以前のシステムでは、競合は実行スケジューリングと手数料にのみ使用されており、例えば[Suiの所有オブジェクトと共有オブジェクトの分割](https://move-book.com/object/fast-path-and-consensus/)、Solanaのアカウントモデル、および[[glossary/Block-STM|Block-STM]]など、有効性や承認には使用されていません。中間クラス（最近のルートに対して読み取られ、古い値が許容される競合オブジェクト）はSuiのバイナリスプリットには類似物がなく、まさに[[glossary/EIP-8272|EIP-8272]]がすでに提供しているものです。

## 7. 結論

有効性チェックが全体順序なしで解決できるかどうかを決定する特性は、チェックが読み取るステートの量ではなく、順序依存性です。シングルライターデータは、どれほど頻繁に書き込まれても安価であり、競合するデータはそうではありません。これにより、既存の承認メカニズムが1つの次元に対する閾値として統一され、その限界が固定されます。証明付き承認は、原則として可換フラグメント全体をカバーできますが、厳密に1回コアは還元不可能な順序付けが必要であり、いかなる承認スキームもそれを超えることはできません。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/order-dependence-as-the-classifying-dimension-for-frame-transaction-mempool-admission/25934)
