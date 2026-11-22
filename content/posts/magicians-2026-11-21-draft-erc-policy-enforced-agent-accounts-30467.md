---
title: 'ドラフトERC: ポリシー強制型エージェントアカウント'
original_title: 'Draft ERC: Policy-Enforced Agent Accounts'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-erc-policy-enforced-agent-accounts/30467
author: palisec-dev
date: '2026-11-21'
category: ERCs
tags:
  - ercs
  - account-abstraction
  - security
  - smart-contracts
  - eip
  - applications
  - ux
  - agentic-onchain-operations
topic_id: '30467'
translated_at: '2026-11-22'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Draft ERC: Policy-Enforced Agent Accounts](https://ethereum-magicians.org/t/draft-erc-policy-enforced-agent-accounts/30467) — palisec-dev (2026-11-21)

皆さん、こんにちは。プロダクションでエージェントアカウントを運用する中で直面した問題について、ドラフト[[ERC|Ethereum Request for Comments (ERC)]]に関するフィードバックをいただきたく思います。その問題とは、**アプリ、ウォレット、または貸し手が、エージェントのアカウントが外部のポリシー署名者によって保護されているかどうか、そのポリシーが何を許可しているか、あるいは何が拒否されたのかを判断するための標準的な方法がない**ことです。

**この提案が追加するもの:** 読み取りおよび証拠レイヤーです。強制方法については何も定義していません。

-   **発見 (ERC-165 `0xcc16d336`):** `policySigner(account)`、`policyOf(account)`、`pendingPolicyOf(account)`、`mandateOf(account)`、`isStopped(account)`。これらはアカウント自体、またはSafeのような既存のアカウント向けにシングルトンレジストリによって提供されます。レジストリを使用する場合、アカウントは自身の[[signers|署名者]]を自身で宣言し、宣言された発行者のみがそのアカウントのために投稿できます。
-   **ポリシーコミットメント:** ポリシードキュメントのハッシュで、オプションで誰でもそれを取得して確認できるURIを含みます。ハッシュは、ドキュメントのRFC 8785カノニカルJSONのKeccak-256です。
-   **保留中の緩和:** これらは`effectiveAt`とともに公開され、レジストリは時間のみによってそれらに切り替わります。静かな緩和は通常、[[Drain|ドレイン (厳格な役割交代におけるメカニズム)]]の前のステップであるため、監視者は反応するまでの遅延を得られます。
-   **理由コード:** 追記専用の`bytes32`リスト（`TARGET_NOT_ALLOWED`、`OVER_TX_CAP`、`HUMAN_APPROVAL_REQUIRED`、`ASSET_UNSAFE`など）。ベンダーの詳細は別の名前空間付き`detailCode`に記述されます。名前は、同じ意味を持つ場合は[[ERC-8226|規制されたエージェントの委任 (ERC-8226)]]に従います。
-   **決定レシート:** [[EIP-712|EIP-712アテステーションプロファイル]]形式で、正確な[[intent layer|インテントレイヤー]]（チェーン、アカウント、ターゲット、値、コールデータハッシュ）、ポリシーハッシュ、および有効期限にバインドされます。これらはアカウントが宣言したレシート署名者に対して検証され、コントラクト署名者には[[ERC-1271|ERC-1271]]が使用されます。

**既存の作業との関連性:**

-   ERC-7579と7780はアカウント内部で強制します。ERC-7710は条件付きで委任します。ISpendGateスレッドはトークンでゲートします。[[ERC-8226|規制されたエージェントの委任 (ERC-8226)]]は規制資産の[[bounded mandate|制限付きマンデート]]を保存します。[[ERC-8196|オンチェーンIP資産・ライセンスレジストリ]]はウォレット全体を規定します。
-   この提案は、これらすべてを補完するものです。これは、強制者が何であれ、誰でも何が強制されているかを**読み取る**方法です。
-   外部ポリシー署名者、オフチェーンポリシーへのオンチェーンコミットメント、または検証可能な決定レシートをカバーする既存の標準は見つかりませんでした。情報があれば歓迎します。

**これは単なるドキュメントではなく、ライブで稼働しています:**

-   参照レジストリはRobinhood Chain [[mainnet|メインネット]] (4663) に`0x20D6B38B47F7cb765A2318a1f318ed54a6f87e92`としてデプロイされ、検証されています。所有者、アップグレードパス、資金はありません。
-   プロダクションの強制者 (Palisec) は、そのアカウントのコミットメントをそこに公開し、この形式でレシートに署名します。
-   テストベクトルはTypeScriptとSolidityの両方でチェックされています。
-   小さなクライアントライブラリ (`policy-enforced-accounts` on npm) は、準拠するすべてのアカウントを読み取り、APIキーなしでレシートを検証します。
-   ガイドと仕様: [Standard: Policy-Enforced Agent Accounts · Palisec](https://palisec.tech/docs/standard)

**コミュニティへの未解決の質問:**

1.  既存のアカウントにとってレジストリが適切なデフォルトでしょうか、それともアカウントにインターフェースをネイティブに実装するよう促すべきでしょうか（例えば、7579のフォールバックとして）？
2.  `policySigner`はタイプタグ（共同署名者、モジュール、またはガード）も持つべきでしょうか。これにより、読み取り側はどの構成チェックを実行すべきかを知ることができます。
3.  共通コアのポリシー語彙は有用でしょうか、それとも`schemaURI`のみがフォーマットを伝えるべきでしょうか？
4.  レシートの有効期間: 仕様で上限を設けるべきでしょうか？

[[ERC|Ethereum Request for Comments (ERC)]]のプルリクエストは、以下の返信で続きます。

*3投稿 - 2参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/draft-erc-policy-enforced-agent-accounts/30467)
