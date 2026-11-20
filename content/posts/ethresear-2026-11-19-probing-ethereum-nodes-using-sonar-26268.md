---
title: Sonarを用いたイーサリアムノードのプロービング
original_title: Probing Ethereum nodes using Sonar
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/probing-ethereum-nodes-using-sonar/26268'
author: srene
date: '2026-11-19'
category: Networking
tags:
  - networking
  - validators
  - client-diversity
  - security
  - research
  - monitoring
  - tooling
topic_id: '26268'
translated_at: '2026-11-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Probing Ethereum nodes using Sonar](https://ethresear.ch/t/probing-ethereum-nodes-using-sonar/26268) — srene (2026-11-19)

## TL;DR

[[glossary/Sonar|Sonar]]は、[[glossary/ProbeLab|ProbeLab]]が提供する無料ツールで、単一のイーサリアムノードをオンデマンドでプローブします。[[glossary/ENR|ENR（イーサリアムノードレコード）]]を入力すると、[[glossary/discv5|discv5]]経由でノードを検出し、レコードがアドバタイズするすべてのアドレスにダイヤルし、[[glossary/libp2p|libp2p]]または[[glossary/devp2p|devp2p]]のハンドシェイクを実行します。また、[[glossary/Consensus-Layer|コンセンサス層ノード]]に対しては、[[glossary/Status|Status]]と[[glossary/MetaData|MetaData]]を交換します。各結果は、ノード自身のENRと、当社のdiscv5クローラーが記録した情報と比較されます。libp2p [[glossary/peerID|ピアID (peerID)]]や[[glossary/enode-URL|enode URL]]など、他のノード識別子形式も受け入れられます。Sonarはベータ版です。プローブが他に何をチェックすべきかについて、クライアントチームやノードオペレーターからのフィードバックを求めています。

## 外部からノードをプローブする理由

ノードは自身のログでは健全に見えても、ネットワークの他の部分から到達しにくい場合があります。一般的なケースは以下の通りです。

- ENRが到達不能なIPまたはポートをアドバタイズしている（[[glossary/NAT|NAT]]、[[glossary/firewall-rule|ファイアウォールルール]]、変更された[[glossary/public-IP|パブリックIP]]など）
- 一部のトランスポートのみが機能する（例: [[glossary/TCP|TCP]]は応答するが[[glossary/QUIC|QUIC]]は応答しない）
- ENRとノードのStatus/MetaDataが一致しない（[[glossary/fork-digest|フォークダイジェスト]]、[[glossary/attestation-subnets|アテステーションサブネット]]または[[glossary/sync-committee-subnets|同期委員会サブネット]]、[[glossary/custody-group-count|カストディグループ数]]など）
- [[glossary/beacon-API|ビーコンAPI]]または[[glossary/metrics-ports|メトリクスポート]]がインターネットに公開されている

ノードはこれらの問題の自身の側面しか見ることができません。Sonarは未知のピアとしてノードに接続し、各ステップで何が起こったかを示します。

[![Lighthouseノードの結果ページ: 左側に概要、右側に到達可能性。](https://ethresear.ch/uploads/default/optimized/3X/a/e/ae5262b37587bc101949e0909b7f2255b513b072_2_690x450.png)](https://ethresear.ch/uploads/default/original/3X/a/e/ae5262b37587bc101949e0909b7f2255b513b072.png "Lighthouseノードの結果ページ: 左側に概要、右側に到達可能性。")

## プローブの仕組み

1.  ENRをデコードします。Sonarはすべてのフィールドを表示します: [[glossary/node-ID|ノードID]]、[[glossary/IPv4IPv6-addresses|IPv4/IPv6アドレス]]と[[glossary/ports|ポート]]、[[glossary/eth2|eth2]]のフォークダイジェストと[[glossary/next-fork|次のフォーク]]、`[[glossary/attnets|attnets]]`、`[[glossary/syncnets|syncnets]]`、カストディグループ数、および[[glossary/execution-layer-node|実行層ノード]]を示す`[[glossary/eth|eth]]`フィールド。
2.  discv5経由でノードをルックアップします。ルックアップはレコードの最新バージョンを返すため、古いENRはダイヤル前に更新されます。
3.  アドバタイズされたすべてのアドレスに1つずつダイヤルします。IPv4とIPv6、TCPとQUICは個別にダイヤルされ、報告されます。
4.  ノードを識別します。コンセンサス層ノードはlibp2pの識別（エージェントバージョン、プロトコル、リッスンアドレス）を実行します。実行層ノードは[[glossary/RLPx|RLPx]]経由のdevp2p hello（[[glossary/client-name|クライアント名]]と[[glossary/capabilities|機能]]）を実行します。
5.  [[glossary/eth2-exchange|eth2交換]]を実行します（コンセンサス層ノードのみ）。SonarはStatusとMetaDataを要求し、ノードが購読している[[glossary/gossipsub-topics|ゴシップサブトピック]]を収集し、あらゆる[[glossary/GOODBYE|GOODBYE]]とその[[glossary/reason-code|理由コード]]を記録します。
6.  ノードの[[glossary/discv5-routing-table|discv5ルーティングテーブル]]を[[glossary/bucket|バケット]]ごとに読み取ります。
7.  ノードが実行しているクライアントの[[glossary/API-ports|APIポート]]と[[glossary/metrics-ports|メトリクスポート]]をチェックします。

プローブは、ノードがアドバタイズするアドレスの数と応答速度に応じて、数秒から約30秒かかります。各ステップが完了すると、結果がページにストリーミングされます。

## 結果が示すもの

### 到達可能性

アドレスごとに1行で、接続できたかどうか、接続設定時間、[[glossary/RTT|RTT]]、ダイヤルが失敗した場合の完全なエラーが表示されます。右側の列は、各アドレスがどこから来たかを示します: ENR、libp2p識別、discv5ルックアップ、または当社の[[glossary/crawl-history|クロール履歴]]。この例では、ノードはdiscv5（[[glossary/UDP|UDP]] 9000）、TCP 9000、QUIC 9001で応答しています。識別では6つのプライベートアドレスも報告されましたが、Sonarはそれらをリストするだけでダイヤルしません。

[![Sonar到達可能性](https://ethresear.ch/uploads/default/optimized/3X/f/2/f2cda2c3197160cbbdb42e7617db3de4f71f8290_2_690x333.png)](https://ethresear.ch/uploads/default/original/3X/f/2/f2cda2c3197160cbbdb42e7617db3de4f71f8290.png "Sonar到達可能性")

### コンセンサス層

このカードは、ENRに`eth2`フィールドを持つコンセンサス層ノードにのみ表示されます。実行層ノードやDHTを共有する他のネットワークのノードなど、他のdiscv5参加者も到達可能性、ルーティングテーブル、ポートチェックは受けますが、実行するeth2交換はありません。コンセンサスノードの場合、カードはStatusとMetaDataの値を、ENRの同じフィールドの隣に表示します。サブネットグリッドは、ENRがアドバタイズする内容と、ノードが購読していると報告する内容を、アテステーションサブネット、同期委員会サブネット、カストディグループについて比較します。不一致があればフラグが立てられます。ノードがGOODBYEを送信した場合、カードにはそのコードと意味（例: 129、[[glossary/too-many-peers|ピアが多すぎる]]）が表示されます。満杯のノードでもGOODBYEの理由を伝え、一部のクライアント（Tekuなど）は切断する前にゴシップトピックを送信します。

[![コンセンサス層: StatusとMetaData、およびサブネットの一貫性グリッド。](https://ethresear.ch/uploads/default/original/3X/b/6/b6966d04ad419d5c5aa062260474d72ed8520f91.png)](https://ethresear.ch/uploads/default/original/3X/b/6/b6966d04ad419d5c5aa062260474d72ed8520f91.png "コンセンサス層: StatusとMetaData、およびサブネットの一貫性グリッド。")

### ルーティングテーブル

ノードのdiscv5ルーティングテーブルの各バケットにいくつのピアが存在するか、読み取りにかかった時間、および前回のクロールでこのノードを自身のテーブルに持つ他のノードの数が表示されます。セルにカーソルを合わせると、そのバケット内のピアがENRでリストされ、それぞれが自身のSonar結果にリンクしているため、ノードからその隣接ノードへと辿ることができます。

バケット数は、ノード自体がネットワークにどれだけうまく接続されているかを示します。ほとんどのバケットが埋まっているテーブルは、ピアを見つけてルックアップを提供できることを意味し、ほとんど空のテーブルは、ノードが孤立しているか、まだ起動中であることを示します。「known by」カウントは逆方向、つまりノードがどれだけ発見可能かを示します。discv5ルックアップは他のノードのテーブルに存在するノードのみを返すため、少数のピアにしか認識されていないノードは、新しいピアが見つけるのが難しく、自身のテーブルが健全に見えても[[glossary/inbound-connections|インバウンド接続]]が少なくなります。

[![ルーティングテーブル: 15のバケットに170のピア、2.6秒で読み取り完了。ノードは前回のクロールで124のピアに認識されている。](https://ethresear.ch/uploads/default/original/3X/c/7/c7c8dd886c15bf36f03961531b218a023080d180.png)](https://ethresear.ch/uploads/default/original/3X/c/7/c7c8dd886c15bf36f03961531b218a023080d180.png "ルーティングテーブル: 15のバケットに170のピア、2.6秒で読み取り完了。ノードは前回のクロールで124のピアに認識されている。")

### ポート露出

管理ポートには通常、認証がありません。インターネットに公開されている場合、誰でもノードの状態を読み取ったり、高価なクエリで過負荷にしたり、Prysmの[[glossary/gRPC-port|gRPCポート]]では[[glossary/validator-client|バリデータクライアント]]が使用するインターフェースに到達したりできます。メトリクスポートは[[glossary/client-version|クライアントバージョン]]を明らかにし、攻撃者を既知のバグに誘導したり、ノードのIPをそれが実行するバリデータに紐付けたりする可能性があります。公開されたポートはエラーを引き起こさないため、オペレーターがそれに気づくことはめったにありません。

Sonarは、ノードが実行しているクライアントのAPIポートとメトリクスポートを、ノードのパブリックIPでチェックします。各ポートは、公開している内容によって評価されます: ノード制御（高）、ノード読み取り（中）、またはメトリクス（低）。Lighthouseノードの場合、これはビーコンAPI（5052）とメトリクス（5054）です。Prysmの場合、gRPC（4000）が追加され、クライアントごとに同様です。公開されたビーコンAPIポートは、`/eth/v1/node/identity`を呼び出し、ピアIDをプローブされたノードと比較することで確認されます。

[![ポート露出: Lighthouseのポートは両方ともフィルタリングされている。](https://ethresear.ch/uploads/default/optimized/3X/7/7/770d697159e86532cfa96b527e5ee1266251c09d_2_690x184.png)](https://ethresear.ch/uploads/default/original/3X/7/7/770d697159e86532cfa96b527e5ee1266251c09d.png "ポート露出: Lighthouseのポートは両方ともフィルタリングされている。")

### 履歴

ProbeLabは2時間ごとにイーサリアムdiscv5ネットワークをクロールします。Sonarは、これらのクロールがノードについて記録したアドレスとエージェントバージョンをリストするため、アドレスやクライアントバージョンがいつ変更されたかを確認できます。

## 次のステップ

**単一の視点。** プローブは当社のインフラストラクチャの1つのリージョンから実行されるため、結果はそのリージョンからの到達可能性を記述します。未知のピアを[[glossary/rate-limit|レートリミット]]するノードは、通常のピアとは異なる応答をする可能性があります。例えば、[[glossary/Geth|Geth]]は1つのIPからの繰り返しの[[glossary/inbound-connections|インバウンド接続]]を[[glossary/throttles|スロットル]]するため、同じ実行ノードに対する2回の迅速なプローブは異なる結果になることがあります。今後の作業には、複数のリージョンからのプロービングと、それら全体にルックアップを分散させることが含まれる可能性があり、これにより、結果はダウンしているノードと特定の場所から到達不能なノードを区別できるようになります。

**単発プローブ。** 各ルックアップは今日1回実行されます。次のステップは継続的な監視です。ノードをスケジュールに基づいてプローブし、到達不能になったとき、トランスポートが応答しなくなったとき、または新しいポートが開いたときに報告します。これらすべては、日次/週次/月次レポートと、対応するアラートを伴うことができます。**もし、あなたが運用または依存しているノードでこれが役立つようでしたら、どのチェックが重要で、どのくらいの頻度で実行すべきかをお知らせください。**

クライアントチームや研究者の方々から、ノードの外部からチェックする価値のある動作（特定のGOODBYEコード、req/respメソッド、または[[glossary/Fulu-custody|Fuluカストディ]]や[[glossary/column-fields|カラムフィールド]]など）についてご意見をいただきたいと考えています。上記の2つの方向性のいずれかに対する返信も同様に歓迎します。

* * *

Sonarはこちらでご確認ください: [Sonar: Inspect a PeerID, ENR or MultiAddress | ProbeLab Analytics](https://probelab.io/sonar/) および [お問い合わせ](https://probelab.io/contact/)。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/probing-ethereum-nodes-using-sonar/26268)
