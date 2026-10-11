---
title: 不変境界定理
original_title: The Invariant Boundary Theorem
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/the-invariant-boundary-theorem/29893'
author: Andrey_Chmora
date: '2026-10-06'
category: Uncategorized
tags:
  - protocol-design
  - security
  - cryptography
  - research
  - censorship-resistance
  - resource-exhaustion
topic_id: '29893'
translated_at: '2026-10-11'
translator: gemini-2.5-flash
---

> [!note] 原文
> [The Invariant Boundary Theorem](https://ethereum-magicians.org/t/the-invariant-boundary-theorem/29893) — Andrey_Chmora (2026-10-06)

**定義1（[[glossary/Perfect-Indistinguishability|完全な不可分性]]）:**
プロトコルは、いかなる外部の観測者（例: 検閲者）に対しても、転送データストリームが真のホワイトノイズ（一様乱数）と統計的または計算的に区別できない場合、*完全な不可分性*を達成している。これは、観測者がプロトコルの公開パラメータや仕様を知っているかどうかにかかわらず、観測データに容易に計算可能な不変条件 (invariant) が数学的に完全に存在しないことを意味する。

**定義2（[[glossary/Resource-Exhaustion|リソース枯渇]]耐性）:**
プロトコルは、受信エンティティが計算コストの高い操作を実行する厳密に前に、計算コストを無視できる$O(1)$時間で無効なデータをアルゴリズム的に破棄できる場合、*リソース枯渇*戦略に耐性がある。

**不変境界定理:**
[[glossary/permissionless-system|パーミッションレスシステム]]では、データの[[glossary/Perfect-Indistinguishability|完全な不可分性]]と[[glossary/Resource-Exhaustion|リソース枯渇]]戦略への耐性を同時に保証することは数学的に不可能である。

-   **直接的な主張:** プロトコルが完全な不可分性（不変条件ゼロ）を保証する場合、システムは数学的にリソース枯渇戦略に対して脆弱である。
-   **逆の主張:** ジャンクデータ（リソース枯渇からの保護）を早期に破棄するいかなるメカニズムも、データ内にアルゴリズム的または構造的な不変条件の存在を必要とし、これは自動的に完全な不可分性を破り、プロトコルを検閲に対して脆弱にする。

**証明（概要）:**

-   **パート1（完全な不可分性 $\\rightarrow$ リソース枯渇の成功）:**
    プロトコルが完全な不可分性を持つと仮定する。したがって、正当なデータ $P$ は、ランダムノイズ $R$ と計算的に区別できない。データ検証のため、受信エンティティは、計算コストの高い操作を含む可能性のある完全な難読化解除関数 $F^{-1}(P)$ を適用する必要がある。攻撃者はCPUコストゼロで理想的なホワイトノイズ $R$ を生成し、受信エンティティは早期フィルタリングのためのメタデータマーカーを欠いているため、エンティティは計算コストの高い関数 $F^{-1}(R)$ を受信ストリーム全体に適用せざるを得ない。計算コストに致命的な非対称性が生じ、リソース枯渇戦略の成功を保証する。

-   **パート2（リソース枯渇耐性 $\\rightarrow$ 検閲への脆弱性）:**
    プロトコルがリソース枯渇に耐性があると仮定する。したがって、コアプロトコル実行前に、$O(1)$時間で有効なデータをホワイトノイズから区別する軽量なフィルター関数 $f(x)$ が存在する。[[glossary/Kerckhoffs-principle|ケルクホフの原則]]によれば、プロトコル仕様は公開されている。したがって、関数 $f(x)$ は検閲者に知られている。検閲者は転送データに $f(x)$ を体系的に適用し、$f(x) = \\text{True}$ となるデータを選択的に破棄する。完全な不可分性の特性は不可逆的に破られ、プロトコルは正常に検閲される。 $\\blacksquare$

**[研究論文 (Zenodo)](https://doi.org/10.5281/zenodo.23194114)**

*1件の投稿 - 1名の参加者*

[全てのトピックを読む](https://ethereum-magicians.org/t/the-invariant-boundary-theorem/29893)
