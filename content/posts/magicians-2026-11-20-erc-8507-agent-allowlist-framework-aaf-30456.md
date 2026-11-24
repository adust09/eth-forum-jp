---
title: 'ERC-8507: エージェント許可リストフレームワーク (AAF)'
original_title: 'ERC-8507: Agent Allowlist Framework (AAF)'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8507-agent-allowlist-framework-aaf/30456'
author: garyyang-finchip
date: '2026-11-20'
category: ERCs
tags:
  - ercs
  - eip
  - applications
  - security
  - protocol-design
  - identity
  - smart-contracts
topic_id: '30456'
translated_at: '2026-11-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8507: Agent Allowlist Framework (AAF)](https://ethereum-magicians.org/t/erc-8507-agent-allowlist-framework-aaf/30456) — garyyang-finchip (2026-11-20)

このトピックは、ERC-8507、**[[glossary/Agent-Allowlist-Framework|エージェント許可リストフレームワーク (AAF)]]** の議論スレッドです。当初は[[glossary/Agent-Whitelist-Framework|エージェントホワイトリストフレームワーク (AWF)]]として投稿されました。リビジョン0.2.0以降、略称、インターフェース名とコントラクト名、識別子タグ、およびリポジトリは新しい名称を使用しています。

## 概要

AAFは、1つ以上の当事者が、宣言された活動の範囲内で、どの[[glossary/AI-agents|エージェント]]やその他のオブジェクトを、どのような根拠で、どのような効果をもって許可し、拒否するかを表明するための[[glossary/framework|フレームワーク]]です。

これは、[[glossary/Allowlist|許可リスト (allowlist)]]と[[glossary/Denylist|拒否リスト (denylist)]]（ホワイトリストとブラックリスト）を一緒に定義します。両者は極性（`ALLOW`または`DENY`）のみが異なる一種のリストです。リストには型付きメンバー（アカウント、登録済み[[glossary/Agent-Identity|エージェントID]]、グループ、ランタイムインスタンス、モデルやツールバージョンなどのアーティファクト、名前付きサービス）が含まれます。リストは、コンシューマーが自身の[[glossary/agent-action|アクション]]のためにそれをバインドするまで、誰にも影響を与えません。

このドラフトは、許可と拒否がどのように表現され、チェックされ、効力を持つかを規定します。誰を許可するか、どのような[[glossary/Evidence-Capsule|証拠]]を要求するか、または何がエージェントを良いまたは悪いとするかは規定しません。すべての許可と拒否は、次の1つの質問に完全に答えます。誰が、どの[[glossary/Observation-Scope|スコープ]]で、どのオブジェクトとどのアクションに対して、どのバージョンのどのルールと[[glossary/Evidence-Capsule|証拠]]の下で、どのような結果をもって採用するか。

## 目的

[[glossary/AI-agents|エージェント]]と連携するかどうかは、[[glossary/AI-agents|エージェント]]が出会うあらゆる場所で決定されます。例えば、入札者を受け入れるタスクボード、メンバーを受け入れるグループ、呼び出し元を受け入れるサービス、実行するツールを決定するランタイムなどです。今日、それぞれがプライベートなマッピングとプライベートなルールを保持しています。

-   許可はあらゆる場所で決定されるが、どこにも明示されない。取引相手は、どのルールが自分を許可または拒否したのか、あるいはどのような根拠でそうしたのかを知ることができません。
-   [[glossary/Agent-Identity|アイデンティティ]]は[[glossary/AI-agents|エージェント]]が誰であるかを述べ、[[glossary/transaction-assertions|アサーション]]と[[glossary/Agent-Reputation|評判]]はその[[glossary/AI-agents|エージェント]]について何が知られているかを述べます。どちらも、この当事者がこの[[glossary/agent-action|アクション]]に対して今、[[glossary/AI-agents|エージェント]]を許可するかどうかは述べません。
-   [[glossary/Observation-Scope|スコープ]]のないリストは[[glossary/Confidential-Agent-Policy-Verdicts|評決]]となる。あるグループが自身のタスクのために決定した拒否は、その[[glossary/AI-agents|エージェント]]に関する声明として解釈されます。
-   未知のものはパスとして扱われる。拒否リストに載っていないことの[[glossary/Zero-Knowledge-Proof|証明]]を提示しても、そこから[[glossary/Proofs-of-absence|不在であることの証明]]にはならない。また、そのソースを読み取れない[[glossary/Evaluator|評価者]]は、[[glossary/AI-agents|エージェント]]がクリーンであると判断したことにはなりません。
-   [[glossary/Standing|立場]]は借用され、拒否は回避される。許可された[[glossary/Agent-Identity|アイデンティティ]]を名乗ることは、そのために行動する[[glossary/On-chain-Execution-Authority|権限]]があることにはならない。また、あるオブジェクトの拒否は、関連するオブジェクトについて何も述べません。
-   根拠は多岐にわたります: ウォレット、登録済み[[glossary/Agent-Identity|アイデンティティ]]、プロファイル、クレデンシャル、ランタイム、推論使用状況、完了したタスク、取引相手、検証済みプリンシパル、[[glossary/On-chain-AI-agent-systems|オンチェーン活動]]。単一の[[glossary/Schema|スキーマ]]では対応できず、どのリストもそれらのいずれかの使用を強制されるべきではありません。

## ドラフトが規定するもの

-   **リストの4つのオブジェクト。** [[glossary/Observation-Scope|スコープ]]（ルールが適用されるべき場所）、リスト（極性を持つメンバーとマネージャー）、[[glossary/Preregistered-Acceptance-Criteria|基準]]（ルールの一つの不変バージョンで、それらを計算する[[glossary/Module|モジュール]]のコードと構成が固定されている）、および[[glossary/Entry|エントリ]]（根拠、有効期間、ステータスを持つ一つの主体）。
-   **型付き主体。** 参照は種類、チェーン、[[glossary/Namespace|名前空間]]、および識別子を保持します。登録済み[[glossary/Agent-Identity|エージェントID]]、それを制御するアカウント、グループとそのメンバー、および1つのツールの2つのバージョンは異なるオブジェクトです。リストがそう指示しない限り、あるオブジェクトから別のオブジェクトへは何も伝達されません。アカウントに関する[[glossary/Entry|エントリ]]は、そのアカウントが実行する[[glossary/EVM-Code|コード]]に紐付けられることができ、これにより、異なる[[glossary/EVM-Code|コード]]を持つ同じアドレスが評価されたオブジェクトと見なされないようにします。
-   **メンバーを持つ4つの方法。** マネージャーによって書かれる。コミットされたセットに対する[[glossary/Zero-Knowledge-Proof|証明]]によって示され、ソートされたセットに対する[[glossary/Proofs-of-absence|不在の証明]]も含む。[[glossary/Preregistered-Acceptance-Criteria|基準]]から[[glossary/Evaluator|評価者]]によって計算される。別のリストから派生し、単純な参照として、またはリストされたオブジェクトに関連するオブジェクトへの拡張によって。
-   **[[glossary/Binding|バインディング]]。** リストは、コンシューマー、またはそれが指定した採用者がそれをバインドする場所でのみ有効になります。名前付き[[glossary/agent-action|アクション]]に対して、`ALLOW`側と`DENY`側のリスト、[[glossary/Threshold-Exclusion|閾値]]、および競合、不一致、未決定の場合の宣言されたルールを使用します。リクエストに有利な仮定は一切されず、リストを公開しても、誰に対しても[[glossary/On-chain-Execution-Authority|権限]]を与えるものではありません。
-   **一つの標準結果。** リストは`MATCH`、`NO_MATCH`、または`UNDETERMINED`を返します。[[glossary/Binding|バインディング]]は`ALLOW`、`DENY`、`NOT_APPLICABLE`、または`INDETERMINATE`を返します。未決定の入力を持つ[[glossary/Attestable-Outcomes|結果]]は、その入力が解決しうるあらゆる方法が同じ結果を与える場合にのみ成立します。採用者がその後行うこと（`PROCEED`、`REFUSE`、[[glossary/Defer|延期]]、`PROCEED_RESTRICTED`）は別途記録されます。これにより、未決定のまま進行することが、検証済みの許可として書き換えられることはありません。制限内での進行は、その制限を明記した文書によってのみ宣言され、その[[glossary/agent-action|アクション]]が実行される場所でそれを適用するコンシューマーによって行われます。
-   **[[glossary/Standing|立場]]。** 呼び出し元が主体のために行動する[[glossary/On-chain-Execution-Authority|権限]]を持つと検証されない限り、アクターに対して`ALLOW`は返されません。
-   **バージョンと有効性。** ルール、リストの状態、および[[glossary/Binding|バインディング]]は個別に[[glossary/Agreement-Versioning|バージョン管理]]されます。評価はこれら3つすべてを名前で指定するため、取り消し、修正、または有効期限切れの後には、以前の結果が現在のものと認識されなくなります。リストが変更されなくても変更されうるもの（取り消されうるクレデンシャルなど）に基づく[[glossary/Attestable-Outcomes|結果]]は、その呼び出しに対してのみ有効です。
-   **再利用。** 評価は許可ではありません。決定が再利用できるかどうかは、[[glossary/Binding|バインディング]]によって[[glossary/agent-action|アクション]]ごとに宣言され、デフォルトでは再利用できません。つまり、すべての使用は個別に決定されます。操作の条件（金額やターゲットなど）は、それを実行するコンシューマーによってチェックされます。
-   **[[glossary/Entry|エントリ]]。** [[glossary/Entry|エントリ]]は、マネージャー自身の選択（主体について何も[[glossary/transaction-assertions|アサート]]しない）に基づくか、コミットされた[[glossary/Evidence-Capsule|証拠]]を伴う明示された事実に基づくかのいずれかです。通知期間、異議申し立て、および[[glossary/Appeal|控訴]]はオプションです。異議申し立ては記録されますが、それ自体では何も変更しません。
-   **関連オブジェクトの拡張。** 拒否または許可が関連オブジェクトに到達するのは、その関係を明示する派生リストを通じて、そのリストをバインドするコンシューマーに対してのみ、そして両側からの[[glossary/Evidence-Capsule|証拠]]に基づいてのみです。リストされた当事者が誰かを後継者として指名しても、誰も関連付けられません。
-   **進行中の作業。** リストの変更は、後の決定に影響を与えます。[[glossary/Binding|バインディング]]は[[glossary/agent-action|アクション]]を許可として宣言でき、これは一度記録され、採用者が取り消すまで既に許可された作業に対して尊重されます。このドラフトには、獲得されたものや負っているものに関する記述はありません。
-   **[[glossary/Evidence-Capsule|証拠]]の次元。** オープンな語彙と、すべての[[glossary/Evidence-Capsule|証拠]]がその命題、オブジェクト、ソース、方法、時間、および有効期限を記述する一つの形式。

## ドラフトが除外するもの

スコアとランキング、[[glossary/Identity-Layer|アイデンティティ]]と[[glossary/transaction-assertions|アサーション]]システム、[[glossary/Zero-Knowledge-Proof|証明]]システム、操作の条件、支払い拒否の結果、および他のチェーンの状態の検証。[[glossary/Zero-Knowledge-Proof|ゼロ知識]]セット[[glossary/Zero-Knowledge-Proof|証明]]と評価の署名付き[[glossary/Execution-Receipt|レシート]]は、このバージョンには含まれていません。

## 既存の提案との関係

-   [[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]は[[glossary/Agent-Identity|エージェントID]]を登録し、[[glossary/Feedback-network|フィードバック]]と検証シグナルを伝達します。AAFはそのような[[glossary/Agent-Identity|アイデンティティ]]を[[glossary/on-chain-registry|レジストリ]]エントリとして参照し、それらのシグナルを[[glossary/Evidence-Capsule|証拠]]として使用できます。また、誰が誰を、何のために許可または拒否するかの記録を追加します。
-   ERC-8107はENS名間の[[glossary/Weighted-endorsement|承認]]と拒否、および[[glossary/Trust-path|信頼パス]]による許可を定義します。AAFは異なる領域をカバーします。あらゆる種類の型付きオブジェクトのリストであり、明示された根拠に基づいて維持され、コンシューマー、活動、[[glossary/agent-action|アクション]]ごとに有効になり、3値の結果に対する宣言されたルールと組み合わされ、派生リストがそう指示しない限り伝播しません。その種の[[glossary/Trust-registry|信頼レジストリ]]は、AAF[[glossary/Evaluator|評価者]]の背後にあるソースとなり得ます。
-   ERC-8262は[[glossary/Zero-Knowledge-Proof|ゼロ知識]]でセットのメンバーシップと非メンバーシップを[[glossary/Zero-Knowledge-Proof|証明]]します。そのような[[glossary/Zero-Knowledge-Proof|証明]]は3つのマッチ結果に適合し、[[glossary/Evaluator|評価者]]を通じて添付できます。

ドラフトの[[glossary/Core|コア]]は[[glossary/ERC-165|ERC-165]]のみに依存しています。

## 参照実装

リポジトリ:

[github.com](https://github.com/garyyang-finchip/agent-allowlist-framework)

![](https://opengraph.githubassets.com/74c2156f9c7a26bfd5b6c30a94a6228b/garyyang-finchip/agent-allowlist-framework)

### [GitHub - garyyang-finchip/agent-allowlist-framework: エージェントホワイトリストフレームワーク](https://github.com/garyyang-finchip/agent-allowlist-framework)

エージェントホワイトリストフレームワーク

-   [[glossary/AAFRegistry|AAFRegistry]]と[[glossary/AAFGuard|AAFGuard]]は、オーナーも[[glossary/Upgrade-path|アップグレードパス]]も[[glossary/Privileged-account|特権アカウント]]も持ちません。
-   2つの[[glossary/Module|モジュール]]の例：クレデンシャルとデリバリー履歴を読み取る[[glossary/Evaluator|評価者]]、および[[glossary/Agent-Identity|エージェントID]]にバインドされたアカウントの関係ソース。
-   145のFoundryテストには、3つのエンドツーエンドの実行例が含まれます。[[glossary/Preregistered-Acceptance-Criteria|基準]]に基づくタスクの入札。通知、異議申し立て、拡張を伴うグループの拒否リスト。許可リスト、拒否リスト、およびコミットされた拒否セットを組み合わせたサービス。
-   ドキュメントのJSON[[glossary/Schema|スキーマ]]、例示ドキュメント、およびSolidity外の第2の[[glossary/Implementation|実装]]によって生成され、コントラクトに対してリプレイされたベクトル。

プルリクエスト:

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/2192)

#### [ERCを追加: エージェント許可リストフレームワーク (#2192)](https://github.com/ethereum/ERCs/pull/2192)

`master` ← `garyyang-finchip:add-erc-agent-whitelist`

2026年11月20日 01:51PM (UTC) にオープン

 [![](https://avatars.githubusercontent.com/u/301982187?v=4) garyyang-finchip](https://github.com/garyyang-finchip)

[+6364 \-0](https://github.com/ethereum/ERCs/pull/2192/files)

ドラフトERC、エージェント許可リストフレームワーク (AAF) を追加します。これは、[[glossary/AI-agents|エージェント]]やその他のオブジェクトに対する[[glossary/Observation-Scope|スコープ]]付きの許可リストおよび拒否リストであり、明示された根拠、コンシューマーによる採用、および統一された結果を伴います。 - 仕様: ERCS/erc-8507.md - アセット: インターフェースと参照[[glossary/Implementation|実装]]、2つの例示[[glossary/Module|モジュール]]、ドキュメントのJSON[[glossary/Schema|スキーマ]]、例示ドキュメント、およびテストベクトル - [[glossary/ERC-165|ERC-165]]のみを必要とします - 議論: [https://ethereum-magicians.org/t/erc-8507-agent-allowlist-framework-aaf/30456](https://ethereum-magicians.org/t/erc-8507-agent-allowlist-framework-aaf/30456) - テスト付き参照リポジトリ: [https://github.com/garyyang-finchip/agent-allowlist-framework](https://github.com/garyyang-finchip/agent-allowlist-framework)

2026年11月22日、リビジョン0.2.0での[[glossary/Sepolia|Sepolia]]デプロイメント。3つの実行例がエンドツーエンドで実行されました（87[[glossary/Transaction|トランザクション]]、ブロック12190415から12190525まで。各ステップは仕様が与える結果通りであり、最終状態が読み戻され確認されました）。

-   `AAFRegistry`: [0xBCD17Ac576A675a29F78176209289B72c1b122C7 の[[glossary/Sepolia|Sepolia]]アドレス詳細 | Blockscout](https://eth-sepolia.blockscout.com/address/0xBCD17Ac576A675a29F78176209289B72c1b122C7)
-   `AAFGuard`: [0x1e977Eae5dc102bDc72c6E6aE14654257ec787b7 の[[glossary/Sepolia|Sepolia]]アドレス詳細 | Blockscout](https://eth-sepolia.blockscout.com/address/0x1e977Eae5dc102bDc72c6E6aE14654257ec787b7)
-   例示[[glossary/Evaluator|評価者]]と関係ソース: 0x33712D575b991Ded45131807d8d6b05839217877, 0x65B8755d22bDcDC6A96EaE5FE46B433E208949D9
-   記録、アドレス、フェーズ、およびコスト: [agent-allowlist-framework/docs/sepolia-evidence.md at main · garyyang-finchip/agent-allowlist-framework · GitHub](https://github.com/garyyang-finchip/agent-allowlist-framework/blob/main/docs/sepolia-evidence.md)

## 未解決の質問

1.  **[[glossary/Binding|バインディング]]の形式。** [[glossary/Threshold-Exclusion|閾値]]と競合ルールを持つ両側は、「いずれか」、「すべて」、「n個中k個」、「AただしBを除く」をカバーします。実用上、ネストされた組み合わせが必要か、それとも2番目の[[glossary/Binding|バインディング]]でカバーできるか？
2.  **未決定の入力。** 未決定の入力の解決によって[[glossary/Attestable-Outcomes|結果]]が変わらない場合にのみ、[[glossary/Attestable-Outcomes|結果]]は成立します。これは、[[glossary/Defer|延期]]するコンシューマーにとって適切な厳格さか？リビジョン0.2.0以降、`PROCEED_RESTRICTED`はコンシューマーが適用する明示された制限でのみ宣言されますが、この条件で十分か？
3.  **関連オブジェクトへの拡張。** ドラフトでは、両側からの[[glossary/Evidence-Capsule|証拠]]に基づいて、要求されたときに計算される1つの関係ホップを許可しています。「[[glossary/Agent-Identity|アイデンティティ]]にバインドされたアカウント」以外のどの関係が、参照[[glossary/Module|モジュール]]として価値のある十分な[[glossary/Evidence-Capsule|証拠]]を持つか？
4.  **[[glossary/Proofs-of-absence|不在の証明]]。** [[glossary/Sentinel-value|センチネル値]]を持つソートされたセットは、ハッシュ化のみを必要とし、[[glossary/Zero-Knowledge-Proof|証明]]ごとに2つの隣接するキーを開示します。これは共有拒否リストにとって許容できるか、それとも[[glossary/Zero-Knowledge-Proof|ゼロ知識]]セットの種類が最初のバージョンの一部であるべきか？
5.  **[[glossary/Standing|立場]]。** 組み込みルールは、[[glossary/Entry|エントリ]]の[[glossary/on-chain-registry|レジストリ]]から所有権と承認を読み取ります。グループおよびランタイムインスタンスの[[glossary/Standing|立場]]として何が考慮されるべきか？
6.  **異議申し立てと[[glossary/Appeal|控訴]]。** ドラフトは異議申し立てを記録し、ドキュメントで[[glossary/Venue|開催地]]を指名します。[[glossary/Entry|エントリ]]は、その[[glossary/Appeal|控訴]]の[[glossary/Venue|開催地]]を[[glossary/On-chain-AI-agent-systems|オンチェーン]]で保持すべきか？
7.  **アカウントの[[glossary/EVM-Code|コード]]。** [[glossary/Entry|エントリ]]はアドレスの[[glossary/Codehash|コードハッシュ]]に紐付けられることができ、これは[[glossary/Delegation-target|委任ターゲット]]に従い、[[glossary/Proxy|プロキシ]]の背後にある[[glossary/Implementation|実装]]は見ません。一般的な[[glossary/Proxy|プロキシ]]レイアウトのための組み込みルールを持つ価値があるか、それとも[[glossary/Evaluator|評価者]]が適切な場所か？

*4件の投稿 - 3人の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8507-agent-allowlist-framework-aaf/30456)
