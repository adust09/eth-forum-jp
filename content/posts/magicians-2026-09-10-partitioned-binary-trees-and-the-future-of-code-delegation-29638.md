---
title: パーティション化されたバイナリツリーとコード委任の未来
original_title: Partitioned binary trees and the future of code delegation
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/partitioned-binary-trees-and-the-future-of-code-delegation/29638
author: vbuterin
date: '2026-09-10'
category: Uncategorized
tags:
  - consensus
  - evm
  - account-abstraction
  - eip
  - protocol-design
  - state-management
  - cryptography
topic_id: '29638'
translated_at: '2026-09-11'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Partitioned binary trees and the future of code delegation](https://ethereum-magicians.org/t/partitioned-binary-trees-and-the-future-of-code-delegation/29638) — vbuterin (2026-09-10)

I\*で検討されている主要な[[EIP|EIP]]の1つは、[[Partitioned-Binary-Tree|パーティション化されたバイナリツリー (PBT)]]です: [EIP-8297: Partitioned Binary Tree](https://eips.ethereum.org/EIPS/eip-8297)

これは、[[Merkle-Patricia-Trie|ヘキサリパトリシアトライ (MPT)]]をバイナリツリー構造に置き換えるもので、[[prover|プルーバー]]のコスト削減、隣接アクセス、[[Validity-Only-Partial-Statelessness|VOPS]]同期、その他の目標を含め、イーサリアムにとって理想的なものとして10年間の教訓と考察に基づいて設計されています。

[[Partitioned-Binary-Tree|PBT]]の最近追加された機能で、あまり議論されていないのが新しいコードストレージ形式です。要するに、**コントラクトコードは別のツリーに格納され、コードハッシュによってインデックス付けされます**。

この主要な肯定的な結果は、イーサリアムのコード委任（code delegation）が長年抱えてきた混乱をきれいに解決する機会を与えてくれることです。

現状をまとめると次のようになります:

1.  コントラクトにはコードがあります。
2.  コードは大きくなる可能性があり、大きなコードをデプロイするには多額の[[gas|ガス]]がかかります。
3.  個々のアカウントが毎回大きなコードを再デプロイするのを避けるため、「アドレスXからコードを読み込んで使用する」とアカウントのコードが示す*委任*パターンがあります。これにより、ユーザーごとのコストは固定側の委任コードのみとなり、100バイト未満に抑えられます。
4.  [[EIP-7702|EIP-7702]]では、特定の23バイトのシーケンスが特定のコンテキストで「アドレスXからコードを読み込んで使用する」ことを意味する、奇妙なプロトコルに[[Enshrinement|組み込まれた]]委任を追加しました。
5.  汎用的な[[Account-Abstraction|アカウント抽象化 (AA)]]（[[EIP-8141|EIP-8141]]）により、委任をより効率的、アップグレード可能、かつプロトコルにとって読みやすいものにすることへの需要が高まっています。
6.  現在、コードは不変であるという長年のルールがあります。一度ゼロ以外の値に設定されると、変更できません。委任は（意図的に）これを回避する方法を提供します。しかし、[[SETCODEFROM|SETCODEFROM]]（[[EIP-8298|EIP-8298]]）という新しい提案があり、コントラクトがそのコードを変更することを許可します。具体的には、完全にデプロイするコストを支払うことなく、そのコードを別のアドレスのコードと同じに設定することを許可します（そのコードはすでにデプロイされているという議論に基づいています）。
7.  したがって、[[Hegot|ヘゴタ]]以降、私たちは大きなソフトウェアエンジニアリングの混乱に陥ることになります。そのコードがすでにオンチェーンにある場合、大きなコードのコストを支払うことなく、アカウントに大きなコードをデプロイする方法が*3つ*存在します。従来の委任、[[SETCODEFROM|SETCODEFROM]]、そして[[EIP-7702|7702]]に[[Enshrinement|組み込まれた]]委任です。

[[Partitioned-Binary-Tree|PBT]]は、この問題を解決する自然な機会を生み出します。**コードハッシュを、全体を直接含めるための[[state-creation-costs|ステートバイトコスト]]を支払うことなく、コードの断片を「指し示す」ための正規の主要な方法とすることができ、これ以上複雑な委任方法は必要なくなります**。

今日、コントラクトコードは一度設定されると不変であるという長年の[[Invariant|不変条件]]があります。[[SETCODEFROM|SETCODEFROM]]はこの[[Invariant|不変条件]]を削除します。しかし、コードハッシュ→コードツリーを使用すると、異なるレベルで不変性が回復します。特定の*コードハッシュ*がツリーに追加されると、コードハッシュ→コードのマッピングは固定され、変更できません（これは単にハッシュ衝突耐性です）。したがって、コードハッシュを正規の識別子として使用し、「アカウントXのコードを使用している」という哲学から「ハッシュYのコードを使用している」という哲学に切り替えることで、同じ安全特性を得ることができます。

これは実用的に何を意味するでしょうか？

-   オプション1: [[SETCODEFROM|SETCODEFROM]]を委任の主要な形式として受け入れる。
-   オプション2: [[SETCODEHASH]]オペコードを作成する。I\*以前に、コードハッシュ→アドレスのマッピングを追加できるシステムコントラクトを作成し、そのコントラクトが[[SETCODEFROM|SETCODEFROM]]または[[SETCODEHASH]]オペコードを含まない場合にのみ、そのオペコードがそれを指すようにする。I\*では、ツリーを介して機能するようにする。
-   オプション3: 両方のオペコードを持たせる？

しかし、いずれの場合も、これはアドレスのコード可変性を受け入れることが許容されるという議論です。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/partitioned-binary-trees-and-the-future-of-code-delegation/29638)
