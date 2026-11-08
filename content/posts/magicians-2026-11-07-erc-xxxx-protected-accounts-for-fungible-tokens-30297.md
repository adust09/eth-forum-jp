---
title: 'ERC-XXXX: ファンジブルトークン向け保護アカウント'
original_title: 'ERC-XXXX: Protected Accounts for Fungible Tokens--*'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-xxxx-protected-accounts-for-fungible-tokens/30297
author: eshan
date: '2026-11-07'
category: ERCs
tags:
  - ercs
  - security
  - applications
  - ux
  - protocol-design
  - defi
  - smart-contracts
  - account-abstraction
topic_id: '30297'
translated_at: '2026-11-08'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX: Protected Accounts for Fungible Tokens--*](https://ethereum-magicians.org/t/erc-xxxx-protected-accounts-for-fungible-tokens/30297) — eshan (2026-11-07)

**TL;DR:** [[glossary/ERC-20|ERC-20]]トークン向けに、オプトインで公開された、アカウントごとの「保護」フラグを導入します。少額の送金は即時実行されますが、それ以上の額はスケジュールされ、事前登録されたバックアップウォレットによってキャンセルできます。「ストレス」アクションは、保留中の全てをバックアップに移動し、事前設定された期間ロックします。これはレンチ攻撃対策にもなります。保護をオンにするのは即時ですが、保護を弱める（オフにする、上限を引き上げる、待機時間を短縮する、新しいバックアップを設定する）には、保有者が選択した遅延期間が必要です。

**目的:** 今日、鍵が盗まれたり、保有者が強制されたりすると、即時かつ最終的な資金流出が発生します。既存のアプローチは、トランザクションごと（SLOW）であったり、受取人の協力が必要（[[glossary/ERC-8236|ERC-8236]]）であったり、裁定者が必要（ERC-20R）であったり、ユーザーではなくプロトコルを保護する（ERC-7265）ものであったり、特定のスマートウォレットでのみ機能したりします。本提案は、保護機能をトークン自体に組み込むことで、プレーンな[[glossary/EOA|EOA]]を含むあらゆる保有者とあらゆるウォレットで機能するようにします。

**仕組み:**

-   `protect(backup, dailyLimit, holdWindow, offDelay, lockDuration, fastLane)`: 即時実行されます。
-   上限を超える`transferFrom`は**[[glossary/Revert|リバート]]**します（トークンを移動せずにtrueを返すことは決してないため、ルーター、ボルト、貸し手は騙されません）。[[glossary/EOA|EOA]]からの上限を超える`transfer`は、自動的にスケジュールされる**場合があります**。これにより、ウォレットの「送信」ボタンはそのまま機能します。
-   `queueTransfer` → 保留期間 → 誰でも`executeTransfer`を実行できます。オーナーまたはバックアップは`cancelTransfer`できます。オプトインのファストレーンを使用すると、バックアップは`approveTransfer`で待機をスキップできます。
-   `stress(account)`: 保留中の全てをキャンセルし、残高をバックアップに移動し、事前設定された期間ロックします（呼び出し元は期間を選択できないため、強制された呼び出し元はゼロを選択できません）。
-   受信は常に即時です。保護されていないアカウントは通常の[[glossary/ERC-20|ERC-20]]として扱われます。

**現状:** ETHGlobal Mumbaiで動作するリファレンス実装を構築しました。これはBase Sepolia上の1:1 [[glossary/USDC|USDC]]ラッパー (pUSDC) で、未変更のUniswap V2に対する[[glossary/mainnet|メインネット]]フォーク実行を含む95のテストと、保護された大規模スワップのためのUniswap v4統合が含まれています。

-   ドラフト仕様: [ERCs/ERCS/erc-draft\_protected\_accounts.md at protected-accounts · Eshan276/ERCs · GitHub](https://github.com/Eshan276/ERCs/blob/protected-accounts/ERCS/erc-draft_protected_accounts.md)
-   コード: [GitHub - Eshan276/pUSDC · GitHub](https://github.com/Eshan276/pUSDC)
-   ライブデモ (Base Sepolia): [https://protected-usdc.vercel.app](https://protected-usdc.vercel.app/)

**フィードバックをいただきたい未解決の質問:**

1.  直接`transfer`の自動スケジュールは、標準の一部とすべきでしょうか、それとも現状のようにオプションのままにすべきでしょうか？
2.  [[glossary/EIP-7702|EIP-7702]]委任アカウントは、自動スケジュールのために[[glossary/EOA|EOA]]のように扱われるべきでしょうか？
3.  フラグオフにはバックアップの承認が必要でしょうか（単一の盗まれた鍵に対する安全性は高まりますが、バックアップを紛失すると身動きが取れなくなります）？
4.  スケジュールされた転送は、誰も完了しない場合に期限切れとなるべきでしょうか？
5.  既存のトークンにとって、1:1ラッパーは適切な導入パスでしょうか、それとも発行者はネイティブに採用すべきでしょうか？

関連: [[glossary/ERC-8236|ERC-8236]]（遅延決済）、ERC-20R（可逆トランザクション）、ERC-7265（サーキットブレーカー）、SLOW。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-xxxx-protected-accounts-for-fungible-tokens/30297)
