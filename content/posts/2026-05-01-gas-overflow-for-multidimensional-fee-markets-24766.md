---
title: 多次元手数料市場におけるガスオーバーフロー
original_title: Gas overflow for multidimensional fee markets
source_url: 'https://ethresear.ch/t/gas-overflow-for-multidimensional-fee-markets/24766'
author: aelowsson
date: '2026-05-01'
category: Uncategorized
tags:
  - uncategorized
  - multidimensional-fee-markets
  - gas
  - eip-7999
topic_id: '24766'
translated_at: '2026-05-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Gas overflow for multidimensional fee markets](https://ethresear.ch/t/gas-overflow-for-multidimensional-fee-markets/24766) — aelowsson (2026-05-01)

# 多次元手数料市場におけるガスオーバーフロー

*フィードバックと主要なアイデアを提供してくれた [Vitalik Buterin](https://ethresear.ch/u/vbuterin/summary) に感謝します。*

**TL;DR:** この投稿は、`CALL` 周りのレガシーなスカラー残存ガスパターンを維持しつつ、すべての集約EVMガスを最も高価なEVMリソースの価格で評価するという主要な非効率性を回避するための最小限の方法として、[[glossary/EIP|EIP-7999]]における「ユニバーサルオーバーフロー (Universal overflow)」を分析します。

## 背景

多次元手数料市場 (multidimensional fee market) は、リソース消費を正確に制御できる、望ましい最終的なリソース価格決定メカニズムです。実行、ステート成長、calldata、ブロブデータなどの希少なリソースにはそれぞれ独自のベースフィー (base fee) が与えられ、トランザクションはこれらのリソース全体での実際の消費量に応じて支払います。これにより、市場は開発者が安全と見なすターゲットと制限に従ってリソースを公正に価格設定でき、これらの制限内でリソースを最大容量で消費できます。ここで検討する実装は、[EIP-7706](https://eips.ethereum.org/EIPS/eip-7706) を基盤とし、ユーザーが単一の `max_fee` を設定できるようにすることでUXを簡素化しつつ、良好な経済的効率性を維持する[[glossary/EIP|EIP-7999]]です。

多次元手数料市場 (multidimensional fee market) における主な懸念は、ガス可観測性 (gas observability) (イントロスペクション) をどのように扱うかです。具体的には、一部のコントラクトは `CALL` ファミリーのオペコード (以下、`CALL` と略記) のガスパラメータに依存して、呼び出し元が利用可能なガスの一部のみを転送し、呼び出し元コントラクトで完了する残りの操作のためにガスを保持します。ガスパラメータは多次元ではないため、ガスイントロスペクション (gas introspection) に依存する開発者は、リソース次元全体でどれだけのガスを転送できるかという点で粒度が不足します。一般的にガスイントロスペクション (gas introspection) から離れることが望ましい一方で、現時点ではこれが開発者やユーザーに受け入れられるかどうかは不明です。

このため、EIP-7999 はガスパラメータを持つサブコール (subcall) を扱うためのオプションを概説しています。ベースラインのアプローチは、EVMがガスパラメータ g\_c を持つレガシーなサブコール (subcall) を[再解釈](https://github.com/ethereum/EIPs/blob/2215c17cde2c7ee0bb5068f2beb573c4776e92ac/EIPS/eip-7999.md#evm-without-gas-observability)し、各リソース次元で呼び出し元の残りの予算の一部を転送することです。次元 j における呼び出し元の残りの予算が g\_j であり、残りの集約ガス (aggregate gas) が g\_r := \\sum\_j g\_j である場合、呼び出しは各次元 j で \\lfloor g\_j \\cdot \\min(1, g\_c/g\_r)\\rfloor を転送します。

ユーザーが単一のトランザクションガス制限を提供し、[EVMガスを集約する](https://github.com/ethereum/EIPs/blob/2215c17cde2c7ee0bb5068f2beb573c4776e92ac/EIPS/eip-7999.md#multidimensional-fee-market-with-aggregate-evm-gas)ことで、EVMで現在行われているように処理を進めることができます。欠点は、集約EVMガス (aggregate EVM gas) 制限が最終的に最も高価なEVMリソースで消費されない場合、ユーザーは不必要に高い `max_fee` 割り当て m を規定しなければならないことです。

j をベースフィー (base fee) b\_j と反事実的なリソースごとの制限 g\_j を持つ非決定論的なEVMリソースのインデックスとし、i を決定論的なガス使用量 g\_i とベースフィー (base fee) b\_i を持つリソースのインデックスとします。最も高価なEVMリソースを b\_\\text{max} := \\max\_j b\_j と定義します。集約トランザクションガス制限 g\_a (ここで g\_a = \\sum\_j g\_j + \\sum\_i g\_i) は、個々のEVMガス制限 g\_j を使用する場合と比較して、必要な実行前ベースフィー (base fee) カバー率を以下によって増加させます。

\\sum\_j (b\_\\text{max} - b\_j)g\_j.

決定論的なリソース i を含む資金チェック (funding check) のベースフィー (base fee) 部分は次のようになります。

m \\ge (g\_a-\\sum\_i g\_i) b\_\\text{max} + \\sum\_i b\_i g\_i.

これを軽減するための提案されたオプションは次のとおりです。

-   トランザクション後のチェックで、トランザクションの合計手数料が `max_fee` を超えた場合にブロックを無効にする。
-   ブロックプロデューサー (block producer) に、実行後チェックの一部として不足している資金を供給する能力と責任を与える。
-   トランザクター (transactor) に、希望に応じてすべての次元の制限を提供する能力を与える。

最後の箇条書きのオプションは、ハイブリッドEVMガス (Hybrid EVM gas) 設計です。これはEIP-7999で提示された最も満足のいくオプションです。ガスパラメータを持つ `CALL` に依存するユーザーは集約EVMガス (aggregate EVM gas) を使用でき、他のすべてのユーザーはすべてのリソースに対して個別の制限を持つことができます。一部のユーザーは特定のリソースのみを集約できます。しかし、集約EVMガス (aggregate EVM gas) に依存するユーザーにとっては、不必要に高い `max_fee` 割り当てが残ります。

## ユニバーサルオーバーフロー (Universal overflow)

「ハイブリッドEVMガス (Hybrid EVM gas)」を改善するためのアイデアの1つが「ユニバーサルオーバーフロー (Universal overflow)」です。これは、ガスパラメータを持つ `CALL` を含む一般的なユースケースにおいて、最も高価なEVMリソースで価格設定されなければならないガスの割合を減らします。Vitalik はこの設計を次のように提案しました。

> *ガスには n+1 の次元があり、n+1 は「ユニバーサルオーバーフロー (Universal overflow)」です。すべてのオペレーションは意図された形式のガスを消費しようとし、それが尽きるとユニバーサルオーバーフロー (Universal overflow) から消費を開始します。GAS オペコード (opcode) は残りのユニバーサルオーバーフロー (Universal overflow) を返し、CALL オペコード (opcode) はすべての新しいガス次元を転送しますが、指定されたユニバーサルオーバーフロー (Universal overflow) のみ転送します。*

言い換えれば、レガシーな `CALL` は残りの通常の多次元ガス制限をすべて転送しますが、スカラーガスパラメータはユニバーサルオーバーフロー (Universal overflow) の転送量のみを制御します。これにより、レガシーなガス可観測性 (gas observability) の主要な残存ガスパターン (retained-gas use case) が維持されます。呼び出し元は、スカラーガス値を使用して `CALL` 後のバッファを予約しつつ、実行の大部分は複数の次元で価格設定されます。図1は、緑色のユニバーサルオーバーフロー (Universal overflow) と赤色の通常のガス制限を持つサブコール (subcall) を示しています。

[![ユニバーサルオーバーフロー](https://ethresear.ch/uploads/default/optimized/3X/f/b/fb5b7bf07c0ade952bc71e8ec33ca1d71de519dd_2_690x336.jpeg)](https://ethresear.ch/uploads/default/original/3X/f/b/fb5b7bf07c0ade952bc71e8ec33ca1d71de519dd.jpeg "ユニバーサルオーバーフロー")

**図1.** 緑色のユニバーサルオーバーフロー (Universal overflow) は、赤色の通常の多次元リソース制限と並んで追加のトランザクションパラメータとして指定されます。レガシーな `CALL` は、残りの通常の多次元制限をすべて転送しますが、そのスカラーガスパラメータは、共有されるユニバーサルオーバーフロー (Universal overflow) の転送量を決定します。リソースの通常の制限が使い果たされると、トランザクションはユニバーサルオーバーフロー (Universal overflow) を利用します。

この設計の下では、実行前ベースフィー (base fee) 資金チェック (funding check) は、トランザクションのすべてのEVMガスに対して最も高価なリソースをカバーするために `max_fee` を要求するのではなく、ユニバーサルオーバーフロー (Universal overflow) 量に対してのみ要求します。これは、呼び出し元が `CALL` 実行後に保持したいガスが主である一般的なケースでは、トランザクションに割り当てられた総EVMガスの小さな割合にすぎず、経済的効率性 (economic efficiency) を大幅に向上させます。ユニバーサルオーバーフロー (Universal overflow) 制限 o\_u は任意のEVMリソース j に費やされる可能性があるため、実行前ベースフィー (base fee) 資金チェック (funding check) は以下を要求します。

m \\ge \\sum\_j b\_j g\_j + o\_u b\_\\text{max} + \\sum\_i b\_i g\_i.

改善点は、b\_\\text{max} がもはや完全なEVMガス制限 \\sum\_j g\_j に適用されないことです。保守的なブロック有効性事前チェックでは、o\_u が任意の単一のEVMリソースに完全に費やされる可能性（例えば、各EVM次元で o\_u の余裕を確保することによって）のために容量を予約する必要があります。

また、有用であるかどうかわからない2番目の機能もあります。複数の分岐を持つ複雑なトランザクションは、よりファンジブルなガスバッファ (fungible gas buffer) としてユニバーサルオーバーフロー (Universal overflow) に依存できますが、そのバッファに対して最も高価なリソースに応じてより多くの資金を事前に割り当てる必要があります。

1つの制限は、ユニバーサルオーバーフロー (Universal overflow) が `GAS` を残りのすべての実行容量の尺度として保持しないことです。EVMは通常の多次元制限を追跡しますが、レガシーな `GAS` オペコード (opcode) はスカラー `CALL` パラメータが制御できるユニバーサルオーバーフロー (Universal overflow) のみ報告します。したがって、各次元に残っている通常のガス量を把握する必要があるコントラクトは、新しい多次元イントロスペクション (introspection) メカニズム、またはスカラーインターフェースが有用であり続けるのに十分なユニバーサルオーバーフロー (Universal overflow) を必要とするかもしれません。

## EIP-8037 との関係

[[glossary/EIP|EIP-8037]] は、単一のベースフィー (base fee) を共有する通常のガスとステートガスの2つのリソースを使用します。内在ガス (intrinsic gas) 後が [[glossary/EIP|EIP-7825]] の通常のガス予算を超過した場合、超過分は特別なステートガスリザーバーに配置され、ステート作成操作のみが消費できます。残りの非リザーバーガス (EIP-8037 の `gas_left`) は、ここでは実行ガス (execution gas) と呼ばれます。ユニバーサルオーバーフロー (Universal overflow) との類似点は、`CALL` ガスパラメータがフォールバックガスとしても機能する予算を制御することです。EIP-8037 では、実行ガス (execution gas) も、ステートガスリザーバーを使い果たした後で、ステート作成操作によって消費されることがあります。

しかし、EIP-7999 の場合、オーバーフローリソースは個別のリソースである必要があり、最も関連性の高いベースフィー (base fee) で資金チェック (funding check) が行われます。実行ガス (execution gas) 自体がオーバーフローリソースとして使用される場合、保守的な資金チェック (funding check) は、EIP-7999 で説明されている「集約EVMガス (aggregate EVM gas)」を本質的に反映するように、最大ベースフィー (base fee) で実行ガス (execution gas) 制限全体に適用される必要があります。これは、より広範なトランザクションセットに影響を与え、経済的効率性 (economic efficiency) を低下させるでしょう。

EIP-7999 の現在の計画は、ステート作成を独自のベースフィー (base fee) を持つ独自のリソースに分割することです。その場合、EIP-8037 と同様に、EIP-7825 トランザクションガスキャップによる特別な処理が必要になります。実行ガス (execution gas) 制限は EIP-7825 トランザクションガスキャップを超えることはできません。このキャップを維持するために、クライアントは、ユニバーサルオーバーフロー (Universal overflow) から消費された実行ガス (execution gas) を含め、消費された総実行ガス (execution gas) も追跡します。実行操作は、結果として生じる総実行ガス (execution gas) 消費がキャップ内に収まる範囲でのみ、ユニバーサルオーバーフロー (Universal overflow) から引き出すことができます。

## オーバーフローベクトル (Overflow vector)

実行前資金チェック (funding check) から最悪ケースの項 o\_u b\_\\text{max} を削除することも理想的でしょう。したがって、ユニバーサルオーバーフロー (Universal overflow) の潜在的な拡張として、単一のユニバーサルオーバーフロー (Universal overflow) の代わりに、n 個のEVMリソースそれぞれに対応するコンポーネントを持つ「オーバーフローベクトル (Overflow vector)」 \\mathbf{o} を使用することが考えられます。レガシーなガス可観測性 (gas observability) のルールとして考えられるのは、o\_r := \\sum\_j o\_j とし、`GAS` オペコード (opcode) が o\_r を返すことです。o\_r>0 の場合、ガスパラメータ g\_c を持つ `CALL` は、各リソース次元 j で \\lfloor o\_j \\cdot \\min(1, g\_c/o\_r)\\rfloor オーバーフローガスを転送します。o\_r=0 の場合、ベクトルオーバーフロー (Overflow vector) は転送されません。ユニバーサルオーバーフロー (Universal overflow) とは異なり、この集約はリソース固有のベクトルのスカラー射影にすぎないため、保持されたガスの組み合わせが十分であるかどうかのランタイム信号としては不十分である可能性があります。通常の多次元制限は完全に転送されます。

図2は典型的なユースケースを示しています。サブコール (subcall) は通常の多次元制限の下で実行され、その後の呼び出し元側の処理は保持されたオーバーフローベクトル (Overflow vector) を使用できます。

[![オーバーフローベクトル](https://ethresear.ch/uploads/default/optimized/3X/a/c/ac39b89bc02525975f24eeec855cded1fc8abad7_2_641x500.jpeg)](https://ethresear.ch/uploads/default/original/3X/a/c/ac39b89bc02525975f24eeec855cded1fc8abad7.jpeg "オーバーフローベクトル")

**図2.** 黄色のオーバーフローベクトル (Overflow vector) は、赤色の通常の多次元リソース制限ごとに1つの追加オーバーフローを持ちます。サブコール (subcall) で渡されるオーバーフローベクトル (Overflow vector) の量は、`CALL` ガスパラメータとオーバーフローベクトル (Overflow vector) の集約ガスとの相対関係によって決定されます。リソースの通常の制限が使い果たされると、トランザクションは関連するオーバーフローを利用します。この例では、呼び出し元はオーバーフローベクトル (Overflow vector) 全体を後で使用するために予約します。サブコール (subcall) は渡された通常の多次元制限の下で実行され、その後の呼び出し元側の処理は保持されたオーバーフローベクトル (Overflow vector) を使用できます。

ユーザーが各リソース次元におけるトランザクションのオーバーフロー使用量について信頼できる見積もりを持っている場合、オーバーフローベクトル (Overflow vector) は過剰な `max_fee` 割り当てを回避できます。各オーバーフローコンポーネントは個別に指定され、価格設定されるため、事前資金チェック (funding check) は、その予算が実際にそのリソースに割り当てられていない限り、最も高価なリソースでオーバーフロー予算を請求する必要はありません。

m \\ge \\sum\_j b\_j (g\_j + o\_j) + \\sum\_i b\_i g\_i.

オーバーフローベクトル (Overflow vector) の経済的効率性 (economic efficiency) の改善が、その複雑さを考慮してユニバーサルオーバーフロー (Universal overflow) よりも採用を正当化するかどうかは不明です。ユーザーがオーバーフローベクトル (Overflow vector) のみに依存する場合、コントラクトは通常、`GAS` によって返される集約ガスから、残りのリソース間のオーバーフローガスの組み合わせが意図された実行（例えば、サブコール (subcall) の後に実行されるように設定された操作）に十分であるかどうかをランタイムで判断できません。これは、以下で議論するハイブリッドバリアントを動機付けます。保持されたガスのリソース構成が不確実な場合、ユーザーはその不確実な部分にユニバーサルオーバーフロー (Universal overflow) を使用しつつ、事前にわかっているリソース使用量にはオーバーフローベクトル (Overflow vector) を使用できます。

## 代替バリエーション

### ガス予約 (Gas reservation)

指定されたガスに比例して `CALL` でガス制限ベクトルを転送する（以前に検討されたベースラインアプローチ）ことと、指定されたガスに比例してオーバーフローベクトル (Overflow vector) を転送することの違いは、オーバーフローベクトル (Overflow vector) が呼び出し元の通常のガス制限ベクトルとは異なる*リソース構成*を持つように選択できることです。これは、呼び出し元コントラクトが、呼び出し先によって行われる操作とは異なる一連の `CALL` 後操作（例えば、クリーンアップ、会計、ログの出力）のためにガスを予約したい場合があるため、有益です。これは、リソース構成が異なる可能性があることを意味します。オーバーフローベクトル (Overflow vector) を使用すると、転送されるものとは異なる構成を予約することが可能になります。

より侵襲的ですが、潜在的によりクリーンなEVMの変更は、コントラクトがランタイムで特定のガスベクトルを明示的に予約できるようにすることでしょう。概念的には、これにより呼び出し元の残りの予算が、*利用可能な*（転送可能な）ベクトルと、`CALL` 後実行のために残ることが保証される*予約済み*（転送不可な）ベクトルに分割されます。これは、(a) 利用可能なベクトルから予約済みベクトルにガスを移動させる（そしてオプションで後で解放する）オペコード (opcode) を介して、または (b) 転送されるガスベクトルと予約済みガスベクトルの両方を受け取る多次元 `CALL` バリアントを介して実現できます。

### ハイブリッドオーバーフロー (Hybrid overflow)

この投稿で提案された2つのアプローチは、オーバーフローベクトル (Overflow vector) \\mathbf{o} とユニバーサルオーバーフロー (Universal overflow) o\_u の両方を許可することで組み合わせることもできます。リソースの通常のガス制限が使い果たされると、プロトコルはまずそのリソースのオーバーフローベクトル (Overflow vector) コンポーネント o\_j に残っているガスを使用し、その後でユニバーサルオーバーフロー (Universal overflow) o\_u からガスを使用します。対応するベースフィー (base fee) 資金チェック (funding check) は次のようになります。

m \\ge \\sum\_j b\_j (g\_j + o\_j) + o\_u b\_\\text{max} + \\sum\_i b\_i g\_i.

しかし、このハイブリッドもレガシーなガス可観測性 (gas observability) のルールを必要とします。最も簡単なルールは、`GAS` オペコード (opcode) が o\_u のみを返し、レガシーな `CALL` ガスパラメータがユニバーサルオーバーフロー (Universal overflow) の転送量のみを制御することです。したがって、オーバーフローベクトル (Overflow vector) はレガシーなガス可観測性 (gas observability) を通じて公開されず、レガシーな `CALL` の下では、サブコール (subcall) 後に行われる処理のために呼び出し元に残ります。

## 結論

ユニバーサルオーバーフロー (Universal overflow) は、`CALL` 周りのレガシーなスカラー残存ガスパターンを維持しつつ、すべての集約EVMガスを最も高価なEVMリソースの価格で評価するという主要な非効率性を回避するための最小限の方法を提供します。最も高価な資金調達要件を明示的に提供されたユニバーサルオーバーフロー (Universal overflow) に限定することで、実行の大部分に対する多次元価格設定を放棄することなく、コントラクトに馴染みのある残存ガスバッファを提供します。オーバーフローベクトル (Overflow vector) やハイブリッドソリューションは、有用な改良を提供する可能性があります。それでも、ユニバーサルオーバーフロー (Universal overflow) は、ガス可観測性 (gas observability) と多次元手数料市場 (multidimensional fee market) を調和させるための直感的なベースラインを提供します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/gas-overflow-for-multidimensional-fee-markets/24766)
