---
title: 'ERC-8494: 機関管理型ユーザー支払い台帳'
original_title: 'ERC-8494: Institution-Managed User Payment Ledger'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8494-institution-managed-user-payment-ledger/30329
author: hanzhe.hz
date: '2026-11-10'
category: ERCs
tags:
  - ercs
  - economics
  - defi
  - payments
  - smart-contracts
  - eip
  - protocol-design
  - nanopayments
  - payment-ledger
topic_id: '30329'
translated_at: '2026-11-11'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8494: Institution-Managed User Payment Ledger](https://ethereum-magicians.org/t/erc-8494-institution-managed-user-payment-ledger/30329) — hanzhe.hz (2026-11-10)

本提案は、口座の借方・貸方を記録し、[[glossary/spending-capacity|支出能力]]を強制し、[[glossary/funds-settlement|資金決済]]とは独立して口座期間を確定（シーリング）するための、機関管理型ユーザー支払い台帳 (Institution-Managed User Payment Ledger) を提案します。

-   [仕様](https://github.com/iampkuhz/ERCs-settelment-Decoupled-Nanopayment-Ledger/blob/codex/user-payment-ledger-proposal/ERCS/eip-user-payment-ledger.md)
-   [ドラフトPR #2159](https://github.com/ethereum/ERCs/pull/2159)

## 問題と範囲

支払い機関 (payment institution) は、顧客の事業取引記録 (customer’s business entries) と、付与する[[glossary/spending-capacity|支出能力]]の変更を区別する必要があります。また、顧客資金の照合 (reconciling customer funds) を行う際に、個々の取引記録、現在の期間合計、および確定された期間を連結する必要があります。機関レベルの集計 (institution-level aggregate) では、これらのアカウントごとの記録は提供されません。

本提案は、これらの記録と制御のための共通コントラクトインターフェースを定義します。これは、機関自身の事業に独立して役立てることも、オンチェーン支払いプロトコル (on-chain payment protocol) と組み合わせることも可能です。資産の発行や転送、顧客の身元確立、資金が凍結または決済されたことの証明は行いません。

## アカウントモデルとインターフェース

各アカウントは`(account, institution)`によってスコープされます。機関は支払い側アカウント (payer accounts)、加盟店アカウント (merchant accounts)、またはその両方を提供できます。2つの機関で同じアドレスを使用しても、記録やキャパシティは共有されません。アカウントの秘密鍵 (private key) を保持しても、取引記録を書き込む権限は付与されません。

現在の状態には、制限ベースライン (limit baseline)、累積流出額 (cumulative outflows) と累積流入額 (cumulative inflows)、およびユーザー期間識別子 (user-period identifier) が含まれます。

```
available = limit + credit - debit
```

3つの金額と結果として得られる利用可能キャパシティは`uint96`に収まる必要があります。算術演算はより広い中間値を使用し、負のキャパシティや範囲外の結果を拒否します。

5つの書き込み操作 (write operations) が関連する責任を分離します。

-   `addLimit`と`subLimit`は、事業取引記録の合計 (business-entry totals) を変更せずにベースラインを調整します。
-   `debit`と`credit`は、流出額と流入額を記録します。デビットには十分な利用可能キャパシティが必要です。
-   `rollup`は、両期間の合計を確定し、ベースラインを現在の利用可能キャパシティに設定し、合計をクリアし、利用可能キャパシティを変更せずに期間識別子を進めます。

アカウントの機関のみが制限を調整し、期間をロールアップします。デビットおよびクレジットの呼び出し元は、デプロイで宣言された認可ポリシー (authorization policy) に従います。標準イベント (Standard events) は個々の取引記録と確定された合計を公開し、クエリは現在の状態を返します。

例えば、ベースライン100、流出額30、流入額5の場合、利用可能キャパシティは75です。ロールアップはこれらの合計を記録し、次の期間をベースライン75、合計ゼロで開始します。これは会計期間 (accounting period) を変更するものであり、利用可能キャパシティや資金処理 (funds processing) のステータスを変更するものではありません。

## リプレイ、返金、タスク認可

4つの増分操作 (incremental operations) は、単一のデプロイ内で機関全体で一意な安定した識別子を使用します。これには、関数、アカウント、期間を横断する識別子が含まれます。成功した識別子は再利用できません。リバート (revert) された操作は識別子を消費しません。ロールアップは代わりにアカウントの期間識別子をチェックし、進めます。

直接記録は、重複防止 (duplicate prevention) をローカルで強制します。制御された構成は、アップストリームの重複防止 (upstream duplicate prevention) がすべての記録パスをカバーし、識別子の一意性を保持する場合にのみ、それを再利用できます。その場合、台帳は、制御されたエントリーポイント (controlled entry point) が各取引記録を一度だけ発行することを信頼します。これは、エントリーポイント自体が行う重複呼び出しに対する2番目の独立した防御を提供しません。

制限削減 (limit reduction) はベースラインをゼロにフロアしますが、結果として生じるキャパシティが負になる場合はリバートします。そのイベントは実際の削減額（ゼロの場合もあります）を記録します。成功したゼロ削減でも識別子は消費されます。純流入によって貢献されたキャパシティは、ベースラインを削減する前にベースラインにロールアップすることで削除できます。

過去の返金は現在の会計期間に入力されます。タスク終了後も数値的なキャパシティを回復する可能性があるため、機関は期限切れまたは取り消されたタスク認可 (task authorization) の下で新規事業を拒否し続ける必要があります。ゼロキャパシティは永続的な口座閉鎖メカニズム (account-closure mechanism) ではありません。

## ERC-8439との関係

関連する[[ERC|ERC]]-8439提案 (ERC-8439 proposal) は、機関間会計 (inter-institution accounting) を記録します。本提案は、それらの機関が提供するアカウントを記録します。独立した使用には、ERC-8439のデプロイや支払いネットワーク (Payment Network) の導入は必要ありません。

本仕様は、その提案に対する具体的な構成ルールを定義しているため、`requires: 8439`を宣言しています。ERC-8439は自身のPRでまだ保留中です。本提案も番号付けされておらず、ドラフト提出 (draft submission) のままです。

台帳が構成される場合、統合されたすべてのオンチェーン支払い (on-chain payment) または返金状態 (refund state) と、対応するユーザー取引記録 (user entries) は、まとめてコミット (commit) またはリバート (revert) される必要があります。実装は、支払い側 (payer side)、受取人側 (recipient side)、またはその両方が統合されているかを識別します。両方が統合されている場合、流出は流入の前にチェックされ、バッチエントリ (batch entries) は入力順序を保持します。アップストリームの認可および返金チェックは引き続き有効です。

ユーザー期間と機関期間は独立したままです。照合 (Reconciliation) は、同じ事業スコープの確定された記録と現在の合計を組み合わせます。2つのレイヤーの現在の期間合計が一致する必要はありません。オンチェーンのアトミック性 (atomicity) は、オフチェーンの資金実行 (off-chain funds execution) には及びません。

## 実装とフィードバック

PRには2つの図と[最小限の参照実装](https://github.com/iampkuhz/ERCs-settelment-Decoupled-Nanopayment-Ledger/tree/codex/user-payment-ledger-proposal/assets/eip-user-payment-ledger)が含まれています。添付された正確なソースは独立してコンパイルされ、それぞれ512回の実行を含む2つのファズテスト (fuzz tests) を含む39のローカルアカウントテストに合格しました。これらのチェックは、本番環境対応 (production readiness)、独立したセキュリティ監査 (security audit)、または法定通貨決済 (fiat settlement) の成功を確立するものではありません。

フィードバックは特に、インターフェースとイベントが独立した実装間で口座履歴 (account history) について合意できるか、制御されたエントリーポイントの信頼境界 (trust boundary) が十分に正確か、そして構成ルールが独立した使用を強制することなく現実的な支払い側および加盟店側の統合をカバーしているかについて有用です。重複エントリ (duplicate entries)、同時ロールアップ (concurrent rollup)、または遅延返金 (late refunds) を含む具体的な反例は、仕様の保証をテストするのに役立ちます。

1投稿 - 1参加者

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8494-institution-managed-user-payment-ledger/30329)
