---
title: 'EIP-TBD: レゾリューション — 自己承認しない状態遷移'
original_title: 'EIP-TBD: Resolution — Non-Self-Authorizing State Transitions'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-tbd-resolution-non-self-authorizing-state-transitions/29846
author: chugarchugarr
date: '2026-10-03'
category: EIPs informational
tags:
  - eips-informational
  - protocol-design
  - security
  - state-management
  - applications
  - ai-agents
  - formal-verification
  - resolution
  - authority-boundary
topic_id: '29846'
translated_at: '2026-10-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-TBD: Resolution — Non-Self-Authorizing State Transitions](https://ethereum-magicians.org/t/eip-tbd-resolution-non-self-authorizing-state-transitions/29846) — chugarchugarr (2026-10-03)

リカバリー、エージェント、来歴 (provenance)、裁定、およびクロス標準の構成において共通して現れる権限の境界があり、これを直接定義する価値があります。イーサリアムが定義できるものはすべて、[[glossary/Resolution|レゾリューション]]の背後に置くことができます。

[[glossary/Resolution|レゾリューション]]とは、何かが生成または証明された後、そのものが結果的な状態 (consequential state) を変更する権限 (authority) を獲得するまでの遷移を指します。

最小限の区別は次のとおりです。

```
COMPUTATION  
は意味しない  
AUTHORITY
```

```
EVIDENCE  
は意味しない  
AUTHORITY
```

```
VALIDITY  
は意味しない  
AUTHORITY
```

有効なオブジェクトは、それが指し示す状態遷移 (state transition) に対して権限 (authority) を持たずに存在することができます。

一般的な形式は次のとおりです。

```
候補となる遷移
    ↓
証拠 (evidence)
    ↓
許容性
    ↓
権限 (authority)
    ↓
レゾリューション
    ↓
後続状態
```

各矢印は独立した遷移です。もし矢印が結果的な状態 (consequential state) を変更できる場合、その権限 (authority) のセマンティクスを定義する必要があります。

不変条件 (invariant) は次のとおりです。

許容された証拠 (evidence)、コミットされた手順 (procedure) またはポリシー (policy)、および現在の権限 (authority) 状態から導き出せる以上の権限 (authority) を、いかなる後続状態も含むことはできません。

概念的には：

```
Resolve(  
  currentState,  
  evidence,  
  procedure,  
  authority,  
  proposedTransition  
)  
→ 承認済み (AUTHORIZED)  
| 未承認 (UNAUTHORIZED)  
| 未解決 (UNRESOLVED)
```

`承認済み (AUTHORIZED)` は正確な遷移を許可します。

`未承認 (UNAUTHORIZED)` はそれを拒否します。

`未解決 (UNRESOLVED)` は、現在、承認された後続状態を導き出すことができないことを意味します。

この3番目の状態は必要不可欠です。もし手順 (procedure) が権限 (authority) が未解決 (UNRESOLVED) の場合でも回答を要求するなら、その手順 (procedure) は選択を強制されるだけで権限 (authority) を作り出すことができます。これは自律システムにとってもより明確な境界を与えます。

問題は、マシンが誰も予期しなかった遷移を発見できるかどうかではありません。マシンは任意の候補を計算できます。

関連する問いは、その候補が独立した権限 (authority) の境界を越えることなく、結果的な状態 (consequential state) になり得るか、ということです。

```
マシン
    ↓
候補
    ↓
レゾリューション
    ↓
承認済み (AUTHORIZED) | 未承認 (UNAUTHORIZED) | 未解決 (UNRESOLVED)
    ↓
状態遷移 (state transition)
```

候補を生成するマシンは、それを生成する行為から遷移に対する権限 (authority) を継承しません。したがって、能力の向上は権限 (authority) の増加を意味する必要はありません。

システムが定義できるものはすべて、[[glossary/Resolution|レゾリューション]]の背後に置くことができます。

転送は解決できます。

署名は解決できます。

ツール呼び出しは解決できます。

委任は解決できます。

ポリシー (policy) 変更は解決できます。

コントラクト呼び出しは解決できます。

新しく発見された機能は、それが到達可能になったり記述可能になったりしたというだけで、権限 (authority) を獲得することはありません。

これはイーサリアム全体で、より狭い形で既に存在しているようです。

[[glossary/ERC-7710|ERC-7710]]は、委任の所有と、その委任が承認する正確な機能とを分離します。[[glossary/ERC-8196|ERC-8196]]は、自律的なトランザクションと、それが所有者のコミットされたポリシー (policy) を満たすという証明とを分離します。[[glossary/ERC-8354|ERC-8354]]は、提案されたアクションと、実行前に必要とされるポリシー (policy) の判定とを分離します。同じ区別はエージェントの実行以外にも現れます。

有効なリカバリー証明は、必ずしも後続の権限 (authority) を確立するわけではありません。有効な来歴 (provenance) コミットメントは、必ずしも実行を確立するわけではありません。有効なオークション結果は、参照されたターゲットの変更を必ずしも承認するわけではありません。かつて権限 (authority) が存在したという歴史的証拠は、その権限 (authority) が今も存在することを意味しません。

これらはすべて同じ形式に還元されます。

```
VALID(X)  
は意味しない  
AUTHORITATIVE_FOR(Y)
```

XからYへの権限 (authority) のエッジ自体が確立されるまでは。

したがって、構成は権限 (authority) を拡張しないものであるべきです。

```
VALID(A)  
+  
VALID(B)
```

は、どちらの入力も、また既に承認された構成ルールも提供しない権限 (authority) を生み出しません。同じことが時間に対しても適用されます。証拠 (evidence) は蓄積される一方で、権限 (authority) は変化します。

```
E_n ⊆ E_n+1
```

は意味しない：

```
A_n ⊆ A_n+1
```

取り消された鍵は歴史的証拠 (evidence) として残ります。以前の所有者は歴史的証拠 (evidence) として残ります。上書きされたリカバリーコミットメントは歴史的証拠 (evidence) として残ります。これらの事実を保存しても、新しい状態を生成する権限 (authority) は保存されません。これは、[[glossary/Resolution|レゾリューション]]の境界に対する単純な反証テストを提供します。

許容された証拠 (evidence) を固定する

コミットされていない、結果に関連する入力または変換を変更する

承認された後続状態は変化するか？

もし「はい」であれば、コミットされた[[glossary/Resolution|レゾリューション]]手順 (procedure) の外に、権威ある結果を変更できる何かが存在します。同じテストを権限 (authority) に直接適用できます。

有効な証明、結果、観測、アイデンティティ、または複合オブジェクトが

それが実際に確立する権限 (authority) よりも強い遷移を

引き起こすことは可能か？

もし「はい」であれば、その遷移はどこかで自己承認しています。

この提案は、すべての決定がオンチェーンで行われるべきだとか、イーサリアムに一つの普遍的なポリシー (policy) 言語が必要だというものではありません。この提案はより狭いものです。

システムが特定し、仲介できる結果的な遷移はすべて、有効になる前に独立した[[glossary/Resolution|レゾリューション]]を要求することができます。マシンは可能性を生成できます。証拠 (evidence) は事実を確立できます。ポリシー (policy) は許可された遷移を定義できます。権限 (authority) はどの遷移が有効になるかを決定します。[[glossary/Resolution|レゾリューション]]は、これらの層のいずれかが他の層の権限 (authority) を密かに獲得するのを防ぐ境界です。

最も短い形式は依然として次のとおりです。

イーサリアムが結果的な遷移として定義できるものはすべて、[[glossary/Resolution|レゾリューション]]の背後に置くことができます。

有用な反例としては、コミットされていない、または承認されていない、結果に関連する依存関係が結果的な状態 (consequential state) を変更できる一方で、結果として生じる遷移が完全に承認されたままであるシステムが挙げられます。もしそのようなケースが存在するなら、それは不変条件 (invariant) を狭めます。もし存在しないなら、これはイーサリアムが既に構築しているいくつかのメカニズムの根底にある共通の境界である可能性があります。

*4投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-tbd-resolution-non-self-authorizing-state-transitions/29846)
