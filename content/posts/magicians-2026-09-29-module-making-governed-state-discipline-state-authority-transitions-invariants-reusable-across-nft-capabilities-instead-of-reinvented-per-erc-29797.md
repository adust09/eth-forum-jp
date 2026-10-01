---
title: モジュール：NFT機能全体で再利用可能な統制状態の規律（状態、権限、遷移、不変条件）を構築する
original_title: >-
  "Module: Making Governed-State Discipline
  (State/Authority/Transitions/Invariants) Reusable Across NFT Capabilities,
  Instead of Reinvented Per-ERC"
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/module-making-governed-state-discipline-state-authority-transitions-invariants-reusable-across-nft-capabilities-instead-of-reinvented-per-erc/29797
author: payalhanda348-bot
date: '2026-09-29'
category: ERCs
tags:
  - ercs
  - applications
  - smart-contracts
  - protocol-design
  - state-management
  - governance
  - verification
  - architecture
topic_id: '29797'
translated_at: '2026-10-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> ["Module: Making Governed-State Discipline (State/Authority/Transitions/Invariants) Reusable Across NFT Capabilities, Instead of Reinvented Per-ERC"](https://ethereum-magicians.org/t/module-making-governed-state-discipline-state-authority-transitions-invariants-reusable-across-nft-capabilities-instead-of-reinvented-per-erc/29797) — payalhanda348-bot (2026-09-29)

* * *

## [[glossary/ARCOS|ARCOS]] [[glossary/Module|モジュール]] —

### これが存在する理由（簡潔に）

[[glossary/ERC|ERC]]-721の `ownerOf()` は、「誰がこれを所有しているか」という静的な質問に1つのアドレスで答えます。それ以上の機能（[[glossary/Delegation|委任]]、[[glossary/Custody|カストディ]]、[[glossary/Rental|レンタル]]、検証）は、個別の[[glossary/ERC|ERC]]拡張機能やプロジェクトごとのカスタムコードとして、バラバラに解決されています。プロジェクトが複数の機能を採用しても、それらを調整するものは何もありません。[[glossary/ERC|ERC]]自体は堅牢ですが、ギャップは調整にあります。この問題を解決するために[[glossary/Module|モジュール]]が構築されました。この記事は[[glossary/Module|モジュール]]自体についてであり、上記の理由は文脈であり、ここでの主要な議論ではありません。

### [[glossary/Module|モジュール]]とは

[[glossary/Module|モジュール]]は、統制され、再利用可能で、構成可能で、進化可能なインフラストラクチャです。コントラクトに付け足された機能の集合ではありません。それはデジタルアセットの振る舞いの1つの首尾一貫したドメインであり、プロジェクトごとに各[[glossary/NFT|NFT]]コントラクトに組み込まれるのではなく、再利用可能な機構として一度構築されます。

[[glossary/Module|モジュール]]は、[[glossary/Governed-State|統制された状態]]機械です。つまり、1つの構造化された[[glossary/State|状態]]ドメインであり、厳密に1つの[[glossary/Authority|権限]]によって所有され、定義された[[glossary/Transitions|遷移]]のみを通じて変更され、[[glossary/Module-Activation-System|モジュールアクティベーションシステム (MAS)]]を通じてのみシステムの残りの部分からアクセス可能です。

機能とは、[[glossary/Module|モジュール]]が「何ができるか」です。[[glossary/Module|モジュール]]は、その機能が「どのように、いつ、誰の権限の下で」動作するかを決定する機構です。

### 6つの固定された質問

すべての[[glossary/Module|モジュール]]は、同じ6つのアーキテクチャ上の質問に答えます。これらの質問は普遍的であり、すべての[[glossary/Module|モジュール]]は例外なく6つすべてに答える必要があります。答え、そして特定のメカニズムが必要かどうかは、ドメイン固有です。

**1. [[glossary/State|状態]]/構造** — [[glossary/Module|モジュール]]が何を所有し、その[[glossary/State|状態]]が何を意味するか。単に「どのようなデータを保存するか」ではなく、特定の名前付きフィールドであり、それぞれが実際の事実にマッピングされます。フィールドを正確に命名できない[[glossary/Module|モジュール]]はまだ設計されていません。所有権：5つのフィールド — 共有、占有、使用、利益、バージョン。

**2. [[glossary/Authority|権限]]** — その[[glossary/State|状態]]を変更できるのは誰か。保存されたフラグではなく、いつでも「誰のアクションが今正当か」という質問に厳密に1つの答えを計算するためのルールです。それはライブである必要があり、キャッシュされてはいけません。もし[[glossary/Authority|権限]]が陳腐化する可能性があるなら、その上に構築されたすべてがその陳腐化を継承します。所有権：共有の過半数保有者、チェックごとに再計算されます。

**3. [[glossary/Transitions|遷移]]** — [[glossary/State|状態]]が正当に変更される方法。[[glossary/State|状態]]が移動することを許可される有限で名前付きのセットであり、それぞれに独自の[[glossary/Precondition|前提条件]]があります。これは「コントラクトが許可する任意の書き込み」ではありません。所有権：ミント、[[glossary/Delegation|委任]]、取り消し、[[glossary/Custody|カストディ]]への移動、[[glossary/Custody|カストディ]]からの返却、回復。

**4. [[glossary/Invariants|不変条件]]/ルール** — 変更の前後に何が真でなければならないか。[[glossary/Authority|権限]]とは異なります。[[glossary/Authority|権限]]は「誰が」を問い、[[glossary/Invariants|不変条件]]は「その人物が誰であるかを考慮して、この特定の変更が有効かどうか」を問います。呼び出し元は完全に承認されていても、無効な[[glossary/Transitions|遷移]]を試みる可能性があります。このチェックは常に2番目に実行され、決して1番目ではありません。

**5. [[glossary/Lifecycle|ライフサイクル]] & [[glossary/History|履歴]]/[[glossary/Provenance|来歴]]** — [[glossary/State|状態]]が時間の経過とともにどのように存在し、進化するか。[[glossary/History|履歴]]は、すべての過去の[[glossary/Transitions|遷移]]の追記専用記録です。[[glossary/Lifecycle|ライフサイクル]]は、その記録に対する派生的な読み取りであり、個別に保存されるステータスフラグではありません。

**6. [[glossary/System-Interaction|システムインタラクション]]** — [[glossary/ARCOS|ARCOS]]の残りの部分が、[[glossary/Module-Activation-System|MAS]]を通じてのみ、この[[glossary/State|状態]]を読み取り、トリガーする方法。どの[[glossary/Module|モジュール]]も他の[[glossary/Module|モジュール]]を直接呼び出しません。これにより、各[[glossary/Module|モジュール]]の正確性が、他のすべての[[glossary/Module|モジュール]]の内部変更から独立して保たれます。

なぜ厳密に6つなのか：それぞれが他のものにとって重要な役割を果たしているからです。[[glossary/State|状態]]を削除すれば、統制するものがなくなります。[[glossary/Authority|権限]]を削除すれば、誰でも書き込めます。[[glossary/Invariants|不変条件]]を削除すれば、承認された書き込みは結果に関係なく有効になります。[[glossary/History|履歴]]を削除すれば、どのようにここに到達したかを監査する方法がありません。[[glossary/System-Interaction|システムインタラクション]]を削除すれば、[[glossary/Module|モジュール]]は互いに密かに結合してしまいます。

### 普遍的ではないもの

6つの質問を超えて、[[glossary/Module|モジュール]]は追加のメカニズム（回復パス、バージョン管理、段階的[[glossary/Transitions|遷移]]、時間制限付き[[glossary/State|状態]]）を採用することがあります。ただし、これはそのドメイン自体が必要とする場合に限られます。発行され、後に無効化される[[glossary/State|状態]]（[[glossary/Attestation|アテステーション]]）を持つ[[glossary/Module|モジュール]]は、まったく回復を必要としないかもしれません。失われたり争われたりする可能性のあるクレームを表す[[glossary/State|状態]]を持つ[[glossary/Module|モジュール]]は、回復を必要とするかもしれません。どちらもそれぞれのドメインにとって正しいものであり、他の[[glossary/Module|モジュール]]の先例ではなく、ドメインによって決定されます。

### 4つの特性

これらは6つの質問をうまく答えた結果であり、それらを生成する入力ではありません：**統制されている**（アーキテクチャ全体が[[glossary/State|状態]]機械を通じて実行され、迂回するパスがない）、**再利用可能**（どの[[glossary/NFT|NFT]]もカスタムロジックを組み立てることなく[[glossary/Module|モジュール]]を採用できる）、**構成可能**（[[glossary/Module|モジュール]]は[[glossary/Module-Activation-System|MAS]]を通じてのみ接続し、直接接続しない）、**進化可能**（機能は進化するが、[[glossary/Governed-State|統制された状態]]モデルと6つの質問の構造は基盤として一定に保たれる）。

### [[glossary/Module-Activation-System|MAS]]：[[glossary/Module|モジュール]]間の唯一のパス

どの[[glossary/Module|モジュール]]も他の[[glossary/Module|モジュール]]を直接呼び出しません。[[glossary/Module-Activation-System|MAS]]はすべてのエントリーをルーティングし、操作が複数の[[glossary/Module|モジュール]]からの入力を必要とする場合にチェックを集約し、重複する[[glossary/State|状態]]がないことを強制します。ある[[glossary/Module|モジュール]]の[[glossary/State|状態]]が別の[[glossary/Module|モジュール]]が必要とする質問に答える場合、後者は自身のコピーを保持するのではなく、[[glossary/Module-Activation-System|MAS]]を通じて前者に問い合わせます。

### これが実際にエンドツーエンドでどのように実行されるか

6つの質問は、[[glossary/Module|モジュール]]が何を答えるべきかを記述しています。ここでは、それらの答えが実行時に、特に所有権[[glossary/Module|モジュール]]上でどのように連鎖するかを示します。これは単なる紙上のアーキテクチャではなく、実際に構築して実行したからです。

**[[glossary/Governed-State|統制された状態]]** — 5つのフィールド。**機能** — 保存されることはなく、オンデマンドでこれらのフィールドから読み取られるパターンに過ぎません。これにより、2つの機能が「誰が何を保持しているか」について構造的に意見が食い違うことがなくなります。**[[glossary/Authority|権限]]ルート** — 「誰のアクションが今正当か」というライブで計算された答えであり、すべての機能がそれに対して測定される参照点です。**[[glossary/Transitions|遷移]]** — [[glossary/State|状態]]が移動できる、名前付きの正当な方法の1つ。**[[glossary/Invariants|不変条件]]** — [[glossary/Authority|権限]]の後に2番目に実行されます。要求している人物を考慮して、この特定の変更が有効かどうかをチェックします。**[[glossary/Lifecycle|ライフサイクル]] & [[glossary/History|履歴]]** — 成功したすべての[[glossary/Transitions|遷移]]は追記専用のログエントリを出力します。[[glossary/Lifecycle|ライフサイクル]]はそれに対する派生的な読み取りであり、保存されることはありません。**回復/失敗**は2つの方法でループを閉じます。失敗した[[glossary/Invariants|不変条件]]チェックは、呼び出し全体を[[glossary/Revert|リバート]]させます。部分的な書き込みはなく、指し示すものもありません。これは単に「効果の前のチェック」であり、別のメカニズムではありません。そして、回復は、通常のルートがまったく機能できない場合に、*異なる* [[glossary/Authority|権限]]（ガーディアンクォーラム）によってゲートされる唯一の[[glossary/Transitions|遷移]]です。

私たちはこの完全なチェーンを記述しただけでなく、実際に実行しました。1つの[[glossary/NFT|NFT]]、Sunset #7は、所有者にミントされ、30日間ギャラリーに[[glossary/Delegation|委任]]されました。衝突の試み（貸出中に[[glossary/Custody|カストディ]]にも送ろうとする）は、[[glossary/State|状態]]変更なしで[[glossary/Revert|リバート]]しました。貸出期間が終了すると、使用権は自動的に[[glossary/Revert|リバート]]し、作品は物理的な[[glossary/Custody|カストディ]]に移されました。最後に、元のキーが失われた後、3人のガーディアンのうち2人が共同で新しいウォレットへの回復に署名しました。すべてのステップは、図ではなく、実際のローカル[[glossary/Ethereum|イーサリアム]]ノードに対する実際のトランザクションとして発生しました。`solc` でクリーンにコンパイルされ、警告はゼロでした。

### v0.5 → v1.0

**v0.5**は最初の構築バージョンでした。所有権ドメインと4つの機能（[[glossary/Delegation|委任]]、[[glossary/Shared-Ownership|共有所有権]]、[[glossary/Custody|カストディ]]、[[glossary/Rental|レンタル]]）を通じて[[glossary/Module|モジュール]]の概念を証明する動作プロトタイプ（Next.js/TypeScript、オフチェーンで実行される[[glossary/Module-Activation-System|MAS]]）でした。これは、アプリケーション層で概念がエンドツーエンドで機能するかどうかを答えました。

**v1.0**は、v0.5が明らかにしたものから構築された、より詳細に指定されたアーキテクチャです。[[glossary/Authority|権限]] → [[glossary/Invariants|不変条件]] → [[glossary/Transitions|遷移]]のパターンは、[[glossary/on-chain|オンチェーン]]で実装するのに十分な精度で固定され、強制モデルが解決され（既存のコントラクトをラップするのではなく、[[glossary/ARCOS|ARCOS]]を通じてネイティブミント。ラップはバイパス可能であるため）、[[glossary/Governed-State|統制された状態]]の構造は、より多くの機能が追加されるにつれて活発にレビューされています。v1.0はアーキテクチャ段階であり、まだデプロイされた[[glossary/on-chain|オンチェーン]]ビルドではありません。

### ステータス

このフレームワークは、所有権という1つのドメインに対して検証されています。他の計画されている[[glossary/Module|モジュール]]（転送、パーミッション、メタデータ、検証、ロイヤリティ、構成、セキュリティ）は、このフレームワークの範囲内で定義されていますが、まだ同じ深さまで構築されていません。構成可能と進化可能は設計意図として示されていますが、まだ複数の[[glossary/Module|モジュール]]にわたって証明されていません。

これを一人で構築しています。この投稿の読み方にとって重要なので、あえて明記します。これは一人の人間のアーキテクチャ作業であり、公開の精査にかけられています。資金提供を受けたチームの完成品ではありません。意見の相違や厳しい質問こそが、ここに投稿する理由であり、後付けではありません。

Magicianへの質問：

**6つの質問は固定されているが、メカニズムはドメイン固有である場合、[[glossary/Module|モジュール]]がリリースされる前に正しく構築されているかどうかをテストする最善の方法は何でしょうか？** 所有権は、1つのアセットをミント → [[glossary/Delegation|委任]] → 衝突 → 期限切れ → [[glossary/Custody|カストディ]] → 回復のプロセスで実行し、すべての失敗が部分的な[[glossary/State|状態]]なしで[[glossary/Revert|リバート]]することを確認することでテストされました。このトレース・アンド・検証アプローチは[[glossary/Module|モジュール]]の検証に十分でしょうか、それとも、この種のインフラストラクチャが実際の資産で信頼される前に、より厳密な方法（[[glossary/Invariants|不変条件]]の[[glossary/Formal-Verification|形式検証]]、[[glossary/State|状態]]機械に対するプロパティベーステスト、その他）があるのでしょうか？[[glossary/State|状態]]機械スタイルの[[glossary/Smart-Account|スマートコントラクト]]を構築または監査した経験がある場合、私たちの見落とした何かを捉えられたテストは何でしたか？

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/module-making-governed-state-discipline-state-authority-transitions-invariants-reusable-across-nft-capabilities-instead-of-reinvented-per-erc/29797)
