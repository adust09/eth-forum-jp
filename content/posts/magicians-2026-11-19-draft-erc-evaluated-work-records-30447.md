---
title: 'ドラフトERC: 評価済み作業記録'
original_title: 'Draft ERC: Evaluated Work Records'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/draft-erc-evaluated-work-records/30447'
author: kurosato
date: '2026-11-19'
category: ERCs
tags:
  - ercs
  - erc
  - ai-agents
  - smart-contracts
  - protocol-design
  - attestations
  - work-records
topic_id: '30447'
translated_at: '2026-11-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Draft ERC: Evaluated Work Records](https://ethereum-magicians.org/t/draft-erc-evaluated-work-records/30447) — kurosato (2026-11-19)

[[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]のフィードバックエントリはタスク名を指定できますが、そのスコアと有償の作業を結びつけるものはありません。このドラフトは、エスクローで決済されたタスクごとに1つのエントリを投稿し、その証拠はエスクローのログと照合可能です。

ドラフト: [erc-draft\_evaluated\_work\_records.md](https://github.com/kurokawasato/ERCs/blob/add-erc-evaluated-work-records/ERCS/erc-draft_evaluated_work_records.md)。このスレッドが存在し次第、ドラフトのプレアンブルがここへのリンクを張っているため、ethereum/ERCsへのプルリクエストが続きます。

決済された各タスクについて、ライターは`work.outcome`とタグ付けされたエントリを1つ投稿します。作業が承認され支払われた場合は100、拒否された場合、またはワーカーがオンチェーンでタスクを引き受けたものの納品しなかった場合は0です。このエントリには、エスクローがタスクのために発行したすべてのログ（資金提供、納品、各評決、各紛争または異議申し立て、そして支払いまたは返金）と、それが読み取ったイベントシグネチャの記録が含まれます。エスクローのディスクリプタとRPCエンドポイントを持つリーダーは、記録を再構築し、最終的な評決に従って全額が納品したワーカーに支払われたことを確認できます。

新しいコントラクトはありません。これらのステップをログに記録し、タスクIDを各イベントの最初のインデックス付きパラメータとする任意のエスクローは、[[ERC-8183|ERC-8183 (エージェント型商取引)]]ジョブコントラクトのように、デプロイされた状態でソースとなります。このドラフトは、[[ERC-8183|ERC-8183 (エージェント型商取引)]]ジョブの成果マッピングも提案しています。ゼロの評価には、ワーカーがオンチェーンで送信した行為が必要です。これにより、他者のエスクローによって指名されたワーカーが評価を下げられることはなく、期限切れのジョブにはエントリが作成されません。

[参照コード](https://github.com/kurokawasato/ERCs/tree/add-erc-evaluated-work-records/assets/eip-draft_evaluated_work_records)がドラフトに付属しています。依存関係のないライターとリーダー、そして実際のタスクからのテストベクトルです。5つはBrainChain [[mainnet|メインネット]]（承認済み、拒否済み、未納品、未判定、未採用）から、3つはBrainChain [[testnet|テストネット]]から来ており、これまでの紛争や異議申し立てはそこで行われました。すべてのベクトルはチェーンから再読み取り可能です。

これは、[[ERC-8466|ERC-8466 (エージェント信用履歴)]]（エージェント信用履歴）および[[ERC-8458|ERC-8458 (エージェント損益計算書)]]（エージェント損益計算書）のドラフトと並んで、同じ[[on-chain-registry|オンチェーンレジストリ]]上に、同じ`data:`エンコーディング、カノニカルJSON、8,192バイトのキャップで存在します。損益計算書は[[AI-agents|エージェント]]が何を受け取ったかを示しますが、これらの記録は各支払いがどのタスクを決済し、どのように判断されたかを示します。

最初のソースは、BrainChain [[mainnet|メインネット]]（チェーン274663）上のBrainChainのタスクボードであり、そこではどちらの側も一度だけ評価に異議を唱え、一度だけ裁定に異議申し立てをすることができます（保証金を伴う）。その紛争および異議申し立てフローが[[testnet|テストネット]]ベクトルを生成しました。

開示：私はBrainChainで働いており、このボードを運営し、ベクトル内のすべてのタスクを投稿、評価、記録しました。

レビュー担当者への3つの質問：

1.  プロファイルは[[on-chain-registry|オンチェーンビュー]]を定義すべきでしょうか。そうすれば、[[smart-contracts|コントラクト]]は記録を読み取らずに1つのタスクの結果を確認できます。
2.  [[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]の[[metadata|メタデータ]]は、[[AI-agents|エージェント]]がどのエスクローワーカーが自分のものであるかを宣言するのに適切な場所でしょうか。
3.  リーダーは、各エスクローの[[descriptor|ディスクリプタ]]を、その[[deployer|デプロイヤー]]によって公開されたものとして固定します。それで十分でしょうか、それともプロファイルは[[on-chain-registry|ディスクリプタのレジストリ]]を命名すべきでしょうか。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/draft-erc-evaluated-work-records/30447)
