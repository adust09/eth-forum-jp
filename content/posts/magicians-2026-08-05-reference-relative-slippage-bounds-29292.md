---
title: 参照価格相対スリッページ許容範囲
original_title: Reference-Relative Slippage Bounds
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/reference-relative-slippage-bounds/29292'
author: zexoverz
date: '2026-08-05'
category: ERCs
tags:
  - ercs
  - defi
  - smart-contracts
  - eip
  - economics
  - mev
  - ux
  - protocol-design
topic_id: '29292'
translated_at: '2026-08-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Reference-Relative Slippage Bounds](https://ethereum-magicians.org/t/reference-relative-slippage-bounds/29292) — zexoverz (2026-08-05)

小さな[[ERC|ERC]]のドラフト仕様を公開します。参照価格には[[ERC|ERC]]-7726を再利用するため、意図的に範囲を狭めています。特に末尾の未解決の質問について、フィードバックを歓迎します。

`requires: ERC-165, ERC-7726`

## 概要

この提案は、トークンスワップにおける参照価格相対スリッページ保護のためのインターフェースを定義します。署名時に静的な`minAmountOut`にコミットする代わりに、呼び出し元はスリッページポリシー、[[ERC|ERC]]-7726クォートオラクル、および最大乖離率を提供します。実行コントラクトは、実行時に読み取られた参照価格から許容可能な出力フロアを導出し、実際の出力が許容範囲を超えて乖離した場合はリバートします。

スリッページフロアを古い署名時定数からライブの実行時バウンドに移行することで、サンドイッチ攻撃者が抽出できるウィンドウが縮小され、ウォレットやアグリゲーターは、既存の[[ERC|ERC]]-7726オラクルAPIを再利用して、別の価格ソースを発明することなく、単一の相互運用可能な方法でスリッページ保護を表現できるようになります。

## 動機

現在、スワップはトランザクション構築時に選択された単一の`minAmountOut`によって保護されています。これは、[[MEV|MEV（最大抽出可能価値）]]抽出が悪用するまさにそのレバーです。

-   **陳腐化。** `minAmountOut`はブロックNからのクォートに対して設定されますが、スワップはブロックN+kで実行されます。サンドイッチボットはそのギャップ内でプール価格を操作します。実際の出力が古いフロアを上回っている限り、サンドイッチは利益を生み、被害者はそれを認識できません。
-   **過剰な許容範囲。** ボラティリティ中のトランザクション失敗を避けるため、ウォレットはデフォルトのスリッページを高く設定します（1〜3パーセント）。その余裕こそが、抽出可能な表面です。
-   **標準の欠如。** すべてのルーター、アグリゲーター、ウォレットがスリッページを異なる方法でエンコードするため、保護について一貫して推論したり改善したりすることができません。

参照価格相対フロアは最初の2つの問題に対処します。フロアは実行時に新しい参照価格に対して計算されるため、署名時にすでに陳腐化している数値ではなく、実際の市場状況を追跡します。インターフェースを標準化することで3番目の問題に対処します。これは[[MEV|MEV（最大抽出可能価値）]]を排除すると主張するものではありません。抽出可能な帯域を狭め、スリッページ保護を読みやすく、構成可能にします。

## 仕様

このドキュメントにおけるキーワード「MUST」、「MUST NOT」、「REQUIRED」、「SHOULD」、「SHOULD NOT」、「MAY」、「OPTIONAL」は、RFC 2119およびRFC 8174に記述されている通りに解釈されます。

### スリッページポリシー

```
struct SlippagePolicy {
    address quoteOracle;     // (tokenIn, tokenOut) のための ERC-7726 オラクル
    uint32  maxDeviationBps; // 参照出力に対する許容される最大不足分（ベーシスポイント単位）
    uint256 hardFloor;       // 参照価格に関わらず受け入れられる絶対最小出力
}
```

-   `quoteOracle`は[[ERC|ERC]]-7726 (`getQuote`) を実装している**MUST**。
-   `maxDeviationBps`は不足許容範囲です。実際の出力は、参照価格が示唆する出力よりも最大で`maxDeviationBps`だけ下回っても**MAY**。これは`<= 10_000`である**MUST**。
-   `hardFloor`は絶対的なフロアです。実効フロアは`max(referenceFloor, hardFloor)`です。
-   参照価格の鮮度と操作耐性はオラクルの責任です（[[ERC|ERC]]-7726の実装は、信頼できるクォートを提供できない場合にリバートすることが期待されます）。呼び出し元は、その鮮度SLAと操作コストが取引に適したオラクルを選択します。

### 保護されたスワップインターフェース

```
interface ISlippageBoundedSwap {
    error SlippageExceeded(uint256 realizedOut, uint256 floor);
    error InvalidDeviation(uint32 maxDeviationBps);

    function swapWithPolicy(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        SlippagePolicy calldata policy,
        bytes calldata routeData
    ) external returns (uint256 amountOut);
}
```

`ISlippageBoundedSwap`を実装する実行者は、以下の通りです。

1.  実行時に`IERC7726(policy.quoteOracle).getQuote(amountIn, tokenIn, tokenOut)`を呼び出すことにより、参照価格を**MUST**取得します。呼び出し元が提供する参照出力を受け入れては**MUST NOT**なりません。
2.  `policy.maxDeviationBps > 10_000`の場合、`InvalidDeviation`を**MUST**リバートします。
3.  `floor = max(referenceOut * (10_000 - policy.maxDeviationBps) / 10_000, policy.hardFloor)`を**MUST**計算します。
4.  `routeData`を介してスワップを実行し、実際の`amountOut`を**MUST**測定します。
5.  `amountOut < floor`の場合、`SlippageExceeded(amountOut, floor)`を**MUST**リバートします。

実装者は[[ERC|ERC]]-165をサポートし、`ISlippageBoundedSwap`インターフェースIDに対して`true`を返す**MUST**。

## 理論的根拠

**なぜ静的な最小値ではなく参照価格相対なのか？** 静的な`minAmountOut`は署名時点の市場をエンコードします。攻撃者は実行までのデルタで操作します。新しい参照価格に対してフロアを再計算することで、そのデルタはオラクルの鮮度と操作コストが許す範囲に収束します。

**なぜ[[ERC|ERC]]-7726を再利用するのか？** クォートオラクルはまさに[[ERC|ERC]]-7726の職務（`getQuote`は`(base, quote)`ペアに対して明示的なトークン量を返します）であり、すでに様々な場所でアダプターが存在します。ここで別のオラクルインターフェースを定義すると、エコシステムが分断され、標準が重複することになります。この提案は、その上にスリッページコントラクトのみを修正します。

**なぜ呼び出し元がフロアを渡すのではなく、不足許容範囲（`maxDeviationBps`）なのか？** これにより、保護はサイズとライブ価格に自動的に合わせて調整され、ウォレットは取引ごとに数値を再計算するのではなく、1つのポリシー（「参照価格より0.5パーセント以上下回らない」）を表現できます。

**なぜ`hardFloor`を維持するのか？** オラクルは失敗します。`hardFloor`は、参照価格が許容範囲内で利用できない場合でも、呼び出し元が事前に受け入れる最悪のケースを保証します。

**[[ERC|ERC]]-5143との関係。** [[ERC|ERC]]-5143は、トークン化されたボールトにスコープされた、呼び出し元が提供する静的な最小値を持つ[[ERC|ERC]]-4626ボールトのエントリーポイントのスリッページ保護バリアントを定義します。この提案は一般的なスワップにスコープされ、静的な入力ではなくライブの[[ERC|ERC]]-7726参照価格からバウンドを導出します。両者は補完的です。

## 後方互換性

追加的です。`ISlippageBoundedSwap`を実装しないルーターは影響を受けず、呼び出し元は静的な`minAmountOut`エントリーポイントを使い続けることができます。ルーターは両方を実装しても**MAY**構いません。

## セキュリティに関する考慮事項

-   **オラクルは信頼の根源。** 操作可能な参照価格は、フロアを操作可能にします。参照価格は[[ERC|ERC]]-7726オラクルから提供されるため、操作耐性と鮮度はそのオラクルの責任です。呼び出し元は、取引に適したオラクル（例えば、操作コストがサンドイッチ攻撃を可能にするコストよりも高くなるようにサイズ設定されたTWAPウィンドウなど）を**SHOULD**選択すべきであり、取引されているプールからのスポット価格を参照価格として使用しては**MUST NOT**なりません。
-   **[[MEV|MEV（最大抽出可能価値）]]排除器ではありません。** これはサンドイッチ帯域を狭めますが、リオーダリング、バックランニング、または`maxDeviationBps`内に留まる抽出を排除するものではありません。プライベート[[mempool|メムプール (Mempool)]]や[[PBS|PBS（プロポーザー・ビルダー分離）]]レベルの保護と組み合わせて使用され、それらを置き換えるものではありません。
-   **オラクルの失敗。** オラクルがリバートするか、許容範囲内でクォートを提供できない場合、スワップはリバートするか`hardFloor`パスにフォールバックします。呼び出し元は`hardFloor`を受け入れられる最悪のケースとして設定します。
-   **参照価格と取引場所の乖離。** 参照価格と実行場所が正当に乖離した場合（流動性が薄い、実際の価格変動）、正直な取引がリバートする可能性があります。呼び出し元は、取引場所の通常のベーシスに合わせて`maxDeviationBps`を**SHOULD**設定すべきです。

## 未解決の質問

-   **参照ソース。** TWAPが適切なデフォルトなのか、それともインターフェースは現在のように不可知論的であり、[[ERC|ERC]]-7726アダプターに決定させるべきなのか？
-   `maxDeviationBps`は呼び出しごとだけであるべきか、それともウォレットが複数の取引で再利用する署名済みポリシーとして表現可能であるべきか？
-   `hardFloor`は維持する価値があるのか、それともオラクルがクォートできない場合にリバートすることに依存するだけで、失敗ケースを十分にカバーできるのか？

私は、ネガティブテストを含む参照実装（インターフェース、フロアロジックを持つ抽象ベース、およびモック[[ERC|ERC]]-7726オラクル）を持っており、返信でリポジトリをリンクします。

*2投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/reference-relative-slippage-bounds/29292)
