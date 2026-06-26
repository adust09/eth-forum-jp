---
title: 特権ロール制御フレームワークの紹介
original_title: Introducing a privileged role control framework
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/introducing-a-privileged-role-control-framework/28859
author: dif
date: '2026-06-24'
category: ERCs
tags:
  - ercs
  - security
  - smart-contracts
  - eip
  - protocol-design
  - governance
  - access-control
  - emergency-response
topic_id: '28859'
translated_at: '2026-06-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Introducing a privileged role control framework](https://ethereum-magicians.org/t/introducing-a-privileged-role-control-framework/28859) — dif (2026-06-24)

— オンチェーンセキュリティのための協調的な[[glossary/ERC|ERC（Ethereum Request for Comments）]]標準セット

## はじめに

特権アクセス制御は、ますます重要なセキュリティ課題となっています。わずか2年間で、アクセス制御はスマートコントラクトの脆弱性ランキングで4位から1位に上昇し（OWASP, 2026）、その傾向は衰える兆しを見せていません。この深刻度のエスカレートは実際の損失に反映されており、ロール関連の悪用により2025年だけで21.2億ドル、つまりその年のWeb3損失全体の53%が発生しました（Hacken, 2025）。これらのインシデントはコードのバグではなく、ガバナンスの失敗です。

これらのガバナンスの失敗は、今日のスマートコントラクトセキュリティの管理方法における断片化によってさらに悪化しています。例えば、デプロイ状況を追跡するためのコントラクトインベントリが多くのプロトコルで不足しています。プロトコルは、一貫性のない命名規則で特権ロールを定義しています。緊急メカニズムは、プロトコル間で共通のインターフェースを欠いています。結果として、インシデントが発生した場合、対応者は、セキュリティ動作が正式に指定されたことのないコントラクトに対して即興で対応することになります。

これらは独立した問題ではありません。それらは共通の根本原因を共有しています。それは、ロールの定義とガバナンスから、緊急事態の検出と解決方法まで、スマートコントラクトのセキュリティライフサイクル全体をカバーする、一貫性のある相互運用可能な特権ロールガバナンス標準セットの欠如です。

私たちは、欠けている標準化レイヤーを提供する、協調的な[[glossary/ERC|ERC]]セットである特権ロール制御フレームワーク（PRCF）を導入します。これは、ロールの定義とガバナンスから、緊急事態の検出と解決方法までをカバーします。この投稿では、フレームワーク全体を紹介し、コミュニティからのフィードバックを募ります。

* * *

## PRCFとは？

PRCFは、ロール定義からインシデント対応まで、スマートコントラクトの特権アクセスを管理する、構成可能な[[glossary/ERC|ERC]]標準の協調的なセットです。

**スマートコントラクトインベントリ**: 組織はデプロイされたコントラクトに対する信頼できる可視性を欠いており、放棄されたが呼び出し可能なコントラクトが永続的な攻撃対象領域として残されています。共有の[[glossary/on-chain-registry|オンチェーンレジストリ]]は、デプロイされたコントラクトをそのライフサイクルを通じて追跡し、組織全体のガバナンスのためのインベントリ基盤を提供します。

**ロール標準の定義と統一**: プロトコルは現在、一貫性のない命名とセマンティクスで特権ロールを定義しており、プロトコル間の監視と監査を非現実的にしています。PRCFは、ロールの命名方法とその意味を標準化し、すべての準拠コントラクトが同じアクセス制御言語を話すことを保証します。

**ロールへの制限**: 現在、鍵の漏洩は即座かつ永続的なアクセスを招き、防御ウィンドウがありません。PRCFは、ティアレベルの操作制限、時間制限付きロール有効期限、必須の付与遅延、および操作タイムロックを導入し、いかなる特権も永続的、即時、または監視されないものではないことを保証します。

**緊急対応**: 緊急メカニズムは現在、コントラクト固有であり、インシデント発生時にアドホックな対応手順を必要とします。一対の[[glossary/ERC|ERC]]は、観測からアクション、回復までの緊急ライフサイクル全体をカバーし、あらゆる準拠コントラクト全体で予測可能かつ標準化された緊急対応を可能にします。

これら4つの領域は、接続されたシステムを形成します。ロール標準は期待されるパーミッションモデルを定義します。制限は、定義されたロールに時間的制約を強制します。緊急対応は、これらの制約が破られたときに機能します。共有レジストリは、これら3つすべてをコントラクト全体で統一します。

各[[glossary/ERC|ERC]]は独立して採用可能です。プロトコルは任意のサブセットを実装できます。これらを合わせると、すべての準拠コントラクトが同じアクセス制御言語を話し、同じ緊急インターフェースを公開する完全なセキュリティ基盤が形成され、コントラクトごとのカスタム統合なしで組織全体のガバナンスが可能になります。

* * *

## フレームワークの概要

```
ERC-8089: スマートコントラクトライフサイクルレジストリ
└── すべてのコントラクトをカバー
    └── 単一コントラクト
        ├── ロールブランチ
        │   ERC-8314: コントラクトロール命名標準
        │   → ERC-8315: コントラクトロールセマンティクス標準
        │   → ERC-XXXX-Restriction: 階層型パーミッションのための操作制限ポリシー
        │                             ├── ERC-8083  時間制限付きアクセス制御インターフェース
        │                             ├── ERC-8305  時間遅延型アクセス制御
        │                             └── ERC-8306  ロールベース・タイムロック操作
        └── 緊急ブランチ
            ERC-8308: スマートコントラクト緊急対応
            → ERC-8307: スマートコントラクト緊急状態
```

[![image](https://ethereum-magicians.org/uploads/default/optimized/3X/9/8/980bc71f18ff15d1bac11fe97325daccfc14f5f3_2_690x402.jpeg)](https://ethereum-magicians.org/uploads/default/original/3X/9/8/980bc71f18ff15d1bac11fe97325daccfc14f5f3.jpeg "特権ロール制御フレームワークの概要")

> **インシデント前 — 鍵の漏洩を防ぐ**
>
> *   [[glossary/Smart-Contract-Lifecycle-Registry|ERC-8089: スマートコントラクトライフサイクルレジストリ]]は、忘れられたコントラクトが気づかれずに攻撃対象領域となることを防ぐため、デプロイされたすべてのコントラクトを追跡します。
> *   [[glossary/Contract-Role-Naming-Standard|ERC-8314: コントラクトロール命名標準]]と[[glossary/Contract-Role-Semantics-Standard|ERC-8315: コントラクトロールセマンティクス標準]]はロールの特権を明確に定義し、不正なロール使用を検出可能にします。
> *   [[glossary/Time-Bound-Access-Control-Interface|ERC-8083: 時間制限付きアクセス制御インターフェース]]は、有効期限タイムスタンプを通じて定期的な鍵のローテーションを強制し、盗まれた鍵が有効である期間を短縮します。
> *   [[glossary/Operation-Restriction-Policy|ERC-XXXX-Restriction: 階層型パーミッションのための操作制限ポリシー]]は、ロールごとに操作制限を適用し、漏洩した鍵ができることを制限します。
>
> **インシデント中／後 — 鍵の漏洩による影響を軽減する**
>
> *   [[glossary/Time-Delayed-Access-Control|ERC-8305: 時間遅延型アクセス制御]]は、ロールの付与を遅延させ、漏洩した鍵で行われた不正な付与を検出してキャンセルする時間を与えます。
> *   [[glossary/Role-Based-Timelock-Operation|ERC-8306: ロールベース・タイムロック操作]]は、影響の大きい操作を遅延させ、悪意のあるトランザクションが確定する前に阻止する時間を与えます。
> *   [[glossary/Smart-Contract-Emergency-Response|ERC-8308: スマートコントラクト緊急対応]]は、標準化されたインターフェースを通じて迅速な緊急対応を可能にし、侵害を封じ込めるまでの時間を短縮します。
> *   [[glossary/Smart-Contract-Emergency-State|ERC-8307: スマートコントラクト緊急状態]]は、すべてのインテグレーターに危険を知らせるオンチェーンアラートを発行し、プロトコル間の連鎖的な影響を軽減します。

* * *

## [[glossary/EIP|EIP]]群

### レイヤー1 — コントラクトインベントリ

**[[glossary/Smart-Contract-Lifecycle-Registry|ERC-8089: スマートコントラクトライフサイクルレジストリ]]**

コントラクトのセキュリティを管理する前に、どのようなコントラクトを所有しているかを知る必要があります。[[glossary/Smart-Contract-Lifecycle-Registry|ERC-8089]]は、組織がデプロイしたコントラクトを登録し、そのライフサイクルステータス（`Default`、`Active`、`Deprecated`、`Frozen`、`Terminated`）を追跡するための標準的な[[glossary/on-chain-registry|オンチェーンレジストリ]]インターフェースを定義します。

これはシステム的なギャップに対処します。セキュリティチームはデプロイされたコントラクトの追跡を定期的に見失い、放棄されたが呼び出し可能なコントラクトが永続的な攻撃対象領域として残されています。[[glossary/Smart-Contract-Lifecycle-Registry|ERC-8089]]は、他のすべてのセキュリティ作業が依存するインベントリレイヤーを提供します。

> 議論: [https://ethereum-magicians.org/t/erc-8089-smart-contract-lifecycle-registry/26641](https://ethereum-magicians.org/t/erc-8089-smart-contract-lifecycle-registry/26641)

* * *

### レイヤー2a — ロール管理

ロール管理は、単一コントラクトのセキュリティ態勢における最も内側の懸念事項です。私たちは、互いに構築される[[glossary/ERC|ERC]]のパイプラインを提案します。

**\[[[glossary/Contract-Role-Naming-Standard|ERC-8314]]: コントラクトロール命名標準\]**

決定論的ハッシュ導出を伴う階層型ネームスペースを使用して、特権ロールの命名方法を標準化します。すべての識別子は、`role.{category}.{action}`構造を小文字で従い、すべてのプロトコルで一貫したkeccak256ハッシュを生成します。監査人や監視ツールは、カスタムのロール名からセマンティクスをリバースエンジニアリングする必要がなくなります。

> 議論: [https://ethereum-magicians.org/t/erc-8314-contract-role-naming/28756](https://ethereum-magicians.org/t/erc-8314-contract-role-naming/28756)

* * *

**\[[[glossary/Contract-Role-Semantics-Standard|ERC-8315]]: コントラクトロールセマンティクス標準\]**

ロールを命名するだけでは十分ではありません。この[[glossary/ERC|ERC]]は、ティア分類や認証ソースを含むセキュリティセマンティクスを、標準化された命名構造から直接導出します。これにより、ロールがどのティアに属するか、および特定のロールの組み合わせを同時に保持することが安全であるかを判断することで、自動化されたリスク評価が可能になります。

> 議論: [https://ethereum-magicians.org/t/erc-8315-contract-role-semantics/28757](https://ethereum-magicians.org/t/erc-8315-contract-role-semantics/28757)

* * *

**\[[[glossary/Operation-Restriction-Policy|ERC-XXXX-Restriction]]: 階層型パーミッションのための操作制限ポリシー\]**

既存のアクセス制御標準は、どのアドレスがどのロールを保持するかを定義しますが、ロール間のセキュリティポリシーを管理するメカニズムを提供しません。この[[glossary/ERC|ERC]]は、ポリシー管理層としてグループを導入します。グループにバインドされたロールは、時間制限付き有効期限、付与遅延、操作タイムロックなどのデフォルトのセキュリティ要件を継承します。これにより、組織はグループレベルでセキュリティポリシーを一度定義し、関連するすべてのロール全体で一貫した強制を保証できます。

> 議論: [https://ethereum-magicians.org/t/erc-xxxx-operation-restriction-policy-for-tiered-permissions/28793](https://ethereum-magicians.org/t/erc-xxxx-operation-restriction-policy-for-tiered-permissions/28793)

* * *

ロールが命名され、定義され、制限された後、さらに3つの[[glossary/ERC|ERC]]がそのライフサイクルを管理します。

**[[glossary/Time-Bound-Access-Control-Interface|ERC-8083: 時間制限付きアクセス制御インターフェース]]**

すべてのロール付与に`expiryTimestamp`をバインドします。タイムスタンプが過ぎると、`hasActiveRole()`は自動的にfalseを返し、手動での取り消しは不要になります。これにより、ベンダー、請負業者、元従業員からの陳腐化した永続的ロールの静かな蓄積が排除されます。

> 議論: [https://ethereum-magicians.org/t/eip-8083-time-bound-access-control-interface/26516](https://ethereum-magicians.org/t/eip-8083-time-bound-access-control-interface/26516)

* * *

**[[glossary/Time-Delayed-Access-Control|ERC-8305: 時間遅延型アクセス制御]]**

ロール変更が開始されてから有効になるまでの間に、設定可能な待機期間を導入します。これは付与と取り消しの両方に適用されます。これにより、鍵の漏洩に対する防御ウィンドウが作成されます。攻撃者が特権鍵を盗み、自分自身にロールを付与しようとした場合、遅延により、組織は付与がアクティブになる前にそれを検出してキャンセルする時間を得られます。

> 議論: [https://ethereum-magicians.org/t/erc-8305-time-delayed-access-control/28741](https://ethereum-magicians.org/t/erc-8305-time-delayed-access-control/28741)

* * *

**[[glossary/Role-Based-Timelock-Operation|ERC-8306: ロールベース・タイムロック操作]]**

遅延モデルを*操作*自体に拡張します。正当に保持されているロールであっても、影響の大きい操作を即座に実行できるべきではありません。この[[glossary/ERC|ERC]]は、特権操作にロールごとの設定可能な遅延を導入し、まずそれらをスケジュールすることを要求し、不可逆なアクションが確定する前に応答ウィンドウを作成します。

> 議論: [https://ethereum-magicians.org/t/erc-8306-role-based-timelock-operation/28742](https://ethereum-magicians.org/t/erc-8306-role-based-timelock-operation/28742)

* * *

### レイヤー2b — 緊急管理

**[[glossary/Smart-Contract-Emergency-Response|ERC-8308: スマートコントラクト緊急対応]]**

緊急対応のための*アクション*インターフェースを標準化します。`triggerEmergency(uint8 emergencyState)`と`resolveEmergency(uint8 emergencyState)`により、このインターフェースを知っている監視システムや自動応答システムは、コントラクトの内部構造を知る必要なく、任意の準拠コントラクトで緊急事態をトリガーまたは解決できます。この[[glossary/ERC|ERC]]を採用することで、すべてのコントラクトが緊急対応機能を実装し、デプロイ時に呼び出し可能な応答メカニズムの存在が保証されます。

[[glossary/Smart-Contract-Emergency-State|ERC-8307]]と[[glossary/Smart-Contract-Emergency-Response|ERC-8308]]はペアとして設計されています。`triggerEmergency()`は[[glossary/Smart-Contract-Emergency-State|ERC-8307]]が公開する観測可能な状態を設定します。`resolveEmergency()`はそれを0にリセットします。これらを合わせると、観測からアクション、回復までの緊急ループ全体をカバーします。

> 議論: [https://ethereum-magicians.org/t/erc-8308-smart-contract-emergency-response/28750](https://ethereum-magicians.org/t/erc-8308-smart-contract-emergency-response/28750)

* * *

**[[glossary/Smart-Contract-Emergency-State|ERC-8307: スマートコントラクト緊急状態]]**

緊急状態のための*観測*インターフェースを標準化します。`emergencyState()`は`uint8`（0 = 正常、1-255 = 実装者定義の状態）を返し、`lastEmergencyStateUpdateAt()`は最新の状態変更のタイムスタンプを返し、`EmergencyStateChanged`はすべての状態遷移で発行されます。

今日、コントラクトは緊急状態インジケーターを互換性のない方法で実装しているか、まったく公開していません。標準インターフェースがなければ、ウォレットはユーザーに警告できず、監視システムはコントラクトの健全性を照会できず、プロトコル間のリスク検出は事実上不可能です。

> 議論: [https://ethereum-magicians.org/t/erc-8307-smart-contract-emergency-state/28748](https://ethereum-magicians.org/t/erc-8307-smart-contract-emergency-state/28748)

* * *

## リファレンス実装

> **近日公開…**

* * *

## このフレームワークにおける[[glossary/ERC|ERC]]群

| [[glossary/ERC|ERC]] | タイトル | 説明 |
| --- | --- | --- |
| [[glossary/Smart-Contract-Lifecycle-Registry|ERC-8089]] | スマートコントラクトライフサイクルレジストリ | デプロイされたコントラクトの存在とライフサイクルステータスを追跡する[[glossary/on-chain-registry|オンチェーンレジストリ]] |
| [[glossary/Contract-Role-Naming-Standard|ERC-8314]] | コントラクトロール命名標準 | 機械で解析可能なロール識別子のための階層型ネームスペースでロール命名を標準化 |
| [[glossary/Contract-Role-Semantics-Standard|ERC-8315]] | コントラクトロールセマンティクス標準 | 承認された操作とティア境界を含むロール名の意味を定義 |
| [[glossary/Operation-Restriction-Policy|ERC-XXXX-Restriction]] | 階層型パーミッションのための操作制限ポリシー | 呼び出し元がどのロールを保持しているかに関わらず、ティアレベルの操作制限を強制 |
| [[glossary/Time-Bound-Access-Control-Interface|ERC-8083]] | 時間制限付きアクセス制御インターフェース | すべてのロール付与に有効期限タイムスタンプをバインドし、陳腐化したロールを自動的に無効化 |
| [[glossary/Time-Delayed-Access-Control|ERC-8305]] | 時間遅延型アクセス制御 | ロール付与とそれが有効になるまでの間に必須の遅延を導入 |
| [[glossary/Role-Based-Timelock-Operation|ERC-8306]] | ロールベース・タイムロック操作 | 影響の大きい特権操作が実行される前に必須の遅延を強制 |
| [[glossary/Smart-Contract-Emergency-Response|ERC-8308]] | スマートコントラクト緊急対応 | 緊急停止損失アクションをトリガーおよび解決するためのインターフェースを標準化 |
| [[glossary/Smart-Contract-Emergency-State|ERC-8307]] | スマートコントラクト緊急状態 | 標準化された状態遷移イベントを伴う観測可能な緊急状態を定義 |

## 参考文献

*   **Hacken (2025)**: The 2025 TRUST report: Web3 security and compliance\* . [2025 Hacken年間レポートでブロックチェーンセキュリティの現状を学ぶ - Hacken](https://hacken.io/insights/2025-security-report/)
*   **OWASP (2026)**: OWASPスマートコントラクトトップ10: 2026\* . [OWASPスマートコントラクトトップ10 | OWASP財団](https://owasp.org/www-project-smart-contract-top-10/)

* * *

## フィードバックを募集しています

これらの[[glossary/ERC|ERC]]の価値は、個々の提案としてよりも、協調的なセットとしての方が大きいと信じているため、フレームワークの概要としてこれを共有しています。フレームワーク全体および個々の[[glossary/ERC|ERC]]それぞれに対するフィードバックを歓迎します。ギャップの特定、改善提案、またはご自身のプロトコルでこれらの標準を採用することへの関心表明など、上記のリンクされたスレッドにコメントすることを奨励します。

残りの[[glossary/ERC|ERC]]については、レビューと提出プロセスに積極的に取り組んでいます。この段階でのフィードバックは、最終提案に直接影響を与えます。

![](https://intranetproxy.alipay.com/skylark/lark/0/2026/png/199356558/1782291554608-7a3551dd-ac1c-4bcd-b555-116f340077c0.png)

*Ant International Web3 Securityによる*
([@kennyk10](https://ethereum-magicians.org/u/kennyk10), @77eff, [@baishuo13](https://ethereum-magicians.org/u/baishuo13))

*1件の投稿 - 1人の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/introducing-a-privileged-role-control-framework/28859)
