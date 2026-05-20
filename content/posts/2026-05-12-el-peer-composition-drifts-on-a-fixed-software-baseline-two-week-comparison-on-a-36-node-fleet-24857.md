---
title: ELピア構成が固定ソフトウェアベースライン上で変動：36ノードフリートでの2週間比較
original_title: >-
  EL peer composition drifts on a fixed software baseline: two-week comparison
  on a 36-node fleet
source_url: >-
  https://ethresear.ch/t/el-peer-composition-drifts-on-a-fixed-software-baseline-two-week-comparison-on-a-36-node-fleet/24857
author: stefa2k
date: '2026-05-12'
category: Networking
tags:
  - networking
  - ethereum
  - p2p
  - client-diversity
  - besu
topic_id: '24857'
translated_at: '2026-05-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EL peer composition drifts on a fixed software baseline: two-week comparison on a 36-node fleet](https://ethresear.ch/t/el-peer-composition-drifts-on-a-fixed-software-baseline-two-week-comparison-on-a-36-node-fleet/24857) — stefa2k (2026-05-12)

## TL;DR

最近のフリート分析 ([docs.stereumlabs.com/blog/ec-p2p-peering-behavior-analysis](https://docs.stereumlabs.com/blog/ec-p2p-peering-behavior-analysis)) で、Besuノード上のDevP2Pピア構成が、Rethのネットワーク全体のシェアが約12%であるにもかかわらず、約75%がRethであると観測されました。同じハードウェア上で同一のECおよびCCバージョンを使用し、2週間後に同じ測定を再実行したところ、同じBesuインスタンス上で約96%のReth集中度を示しました。当社のフリートにおけるRethの接続ピア数は約123から約69に減少し、追跡ピアテーブルは約7,400から約2,506に減少しました。これは同じReth v2.1.0でのことです。明確な説明はまだありません。この変動は、静的なピアグラフスナップショットに基づいて構築されたカスケード分析にとって重要です。

## 変更がなかった点

| 変数 | スナップショット 1 (4月29日) | スナップショット 2 (5月12日) |
| --- | --- | --- |
| ECバージョン | 同一 | 同一 |
| CCバージョン | 同一 | 同一 |
| ハードウェア | ベアメタル、ウィーン | ベアメタル、ウィーン |
| Gethピア数 | 50 | 49.5 |
| Nethermindピア数 | 50 | 50.1 |
| Erigonピア数 | 42 | 41.9 |
| Besuピア数 | 24 | 25.0 |

6つのECピア数のうち5つは横ばいです。変動はRethとピア構成に集中しています。

## 変更があった点

**Reth自身のピアフットプリントが縮小しました。**

| メトリック | 4月29日 | 5月12日 | 差分 |
| --- | --- | --- | --- |
| Reth接続ピア (7日間平均) | 123 | 69 | -44% |
| Reth追跡ピア (DHT) | ~7,400 | ~2,506 | -66% |
| Rethバックオフピア | ~540 | ~989 | +83% |
| Reth「ピアが多すぎる」拒否率 | 高い (アクティブなリミッター) | ~0.006/s | 無視できるレベルに低下 |

Rethのバージョンは同じ (v2.1.0) です。当社側のRethプロセス設定も同じです。Rethのピアテーブルが3分の2に縮小し、接続数がほぼ半減したことは、Reth側の設定ではなく、より広範なネットワークのRethへの接続パターンに何らかの変化があったことを示唆しています。

**BesuのReth集中度が増加しました。**

`besu_peers_peer_count_by_client`、同じフリート上の6つのCCとペアリングされたBesuインスタンスすべてにおける7日間移動平均：

| ピアクライアント | 4月29日シェア | 5月12日シェア | ネットワーク全体のシェア |
| --- | --- | --- | --- |
| Reth | ~75% | 95.9% | ~12% |
| Erigon | 少数 | 1.5% | ~5% |
| Nethermind | 少数 | 0.7% | ~21% |
| Geth | 少数 | 0.4% | ~50% |

25のピアが設定されている場合、Besuは現在約24のRethピアと、その他すべてのピアを合わせて約1つを認識しています。ネットワーク全体のRethシェアに対する増幅係数は、約6倍から約8倍に上昇しました。

これら2つの変化は方向性が一致していません。ネットワークにおけるRethの絶対的な存在感は低下しました（Rethピアの接続数が減少し、ディスカバリテーブルが縮小）。一方、BesuにおけるRethへの相対的な集中度は増加しました。残っているRethピアは、以前よりもBesuの視点から見た割合がさらに大きくなっています。

## 副次的な発見：CCペアリングが構成を乱す

同じECバージョン、同じハードウェア、同じデータセンターで、ECがどのCCと並行して起動されたかによってのみ区別されます：

**ペアリングされたCC別のBesuのRethシェア (5月12日、7日間平均)：**

| Besuのペアリング相手 | Rethシェア |
| --- | --- |
| Teku | 99.6% |
| Lodestar | 99.1% |
| Lighthouse | 96.0% |
| Prysm | 95.8% |
| Nimbus | 95.2% |
| Grandine | 89.6% |

同一のECソフトウェア上で、単一クライアントのピア集中度に10パーセンテージポイントの変動が見られます。DevP2PスタックはCCと直接相互作用しないため、メカニズムは間接的であるはずです。初期のディスカバリ期間中に、ディスカバリルーティングテーブルがシードされる際の、異なる起動タイミング、Engine API呼び出しパターン、および共有ホストのCPU/メモリ負荷が考えられます。ルーティングテーブルのエントリが安定すると、新しいピアがどのように発見されるかというパス依存性が生まれます。

同一のECバージョンを同一のハードウェアで実行している2つのオペレーターが、CCの選択のみによって、実質的に異なるピア構成になる可能性があります。これが起こったことを検出するためのEC側のメトリックからの明確なシグナルはありません。

## カスケードモデリングへの影響

ELクライアント多様性の標準的な枠組みでは、各クライアントの障害シェアは比例的に含まれると見なされます。Rethが障害を起こした場合、ネットワークは12%を失います。96%がRethピアで、25のピアスロットが設定されたBesuノードでは、Rethの障害によりローカルピア数は約1に減少し、信頼性の高いゴシップ伝播のための合理的な閾値をはるかに下回ります。

4月のスナップショット（75%の集中度、25のピア上限）に対して計算されたカスケード確率は、Rethの停止後、Besuノードが約6つのピアを保持すると予測しました。5月のスナップショットに対して再計算すると、停止後の予測数は約1です。同じソフトウェア、同じフリートで、2週間後の結果です。単一時点の測定値を使用するカスケード耐性モデリングは、安定したソフトウェアベースラインにおけるピアグラフの自然な変動に対して堅牢ではありません。

ネットワークセキュリティ分析で使用されるピア構成データにとって、適切な時間的集約とは何でしょうか？月間平均は変動を平滑化しますが、特定の時点での構造的な集中を隠蔽します。スナップショットは構造を捉えますが、数週間後のカスケード結果を誤って予測します。

## 知りたいこと

以下の3つの点が、これがフリート固有のアーティファクトであることを確認または否定するのに役立ちます：

1.  **他のフリート。** マルチリージョンまたは非ベアメタルフリートを持つ方で、同様のRethピア数減少と、Besu-Rethまたは類似のペアリング（例：当社のフリートでは約69%のGeth集中度を示すEthrex-Geth）における並行する集中度増加を観測した方はいらっしゃいますか？
    
2.  **メカニズム。** この変動は、Reth側のディスカバリ動作（古いENRを新しいENRがバインドされるよりも速く破棄する）によって引き起こされているのでしょうか、それともRethノードに不釣り合いな影響を与えるネットワーク全体のピアの変動（例：クラウドホストされたRethデプロイメントにおけるインバウンドポートの到達可能性の低下）によるものなのでしょうか？Rethクライアントチームの視点も特に歓迎します。
    
3.  **CCペアリングのばらつき。** BesuのCCペアリングにおける10パーセンテージポイントのRethシェア変動は、他の場所でも再現可能なのでしょうか、それとも単一データセンターの測定では分離できない、フリート間の自然なばらつきの範囲内なのでしょうか？
    

## 副次的な提案

変動がどのように説明されるかに関わらず：上記の測定は現在、主要なECのうち2つでのみ可能です。`besu_peers_peer_count_by_client` と `ethrex_p2p_peer_clients` は、ピアクライアントごとの内訳をネイティブに公開しています。Geth、Reth、Erigon、Nethermindは公開していません。Nethermindは5分ごとに標準出力に内訳をログ出力しますが、他の3つは全く公開していません。

すべての主要なECで `<client>_peer_count_by_client` Prometheusメトリックを義務化することは、クライアント側の低コストな変更であり、ピアグラフ特性の外部測定を意味のある形で解除することになります。現在、ELネットワークのカスケード分析は、ネットワーク全体の約88%（Geth + Reth + Erigon + Nethermindのシェア合計）におけるピア構成に対して盲目です。

* * *

## 方法論ノート

オーストリア、ウィーンにある36台のベアメタルノードで、以下のすべての{EC × CC}の組み合わせをカバーしています：Besu 26.4.0、Erigon v3.3.10、Ethrex 10.0.0、Geth v1.17.2、Nethermind 1.36.2、Reth v2.1.0 × Grandine 2.0.4、Lighthouse v8.1.3、Lodestar v1.42.0、Nimbus multiarch-v26.3.1、Prysm v7.1.3、Teku 26.4.0。

すべてのメトリックは、`avg_over_time(metric[7d:1h])` インスタントクエリによる7日間移動平均です。スナップショット1は2026年4月29日に終了し、スナップショット2は2026年5月12日に終了します。ECとCCのバージョンは両期間で一定に保たれました。ECごとのピアメトリック名：`ethereum_peer_count` (Besu, Nethermind)、`p2p_peers` (Geth, Erigon)、`reth_network_connected_peers` (Reth)、`ethrex_p2p_peer_count` (Ethrex)。

フリートインベントリ（VMごとのECおよびCCバージョン、ハードウェア、場所）は [docs.stereumlabs.com/docs/scope/list-of-vms](https://docs.stereumlabs.com/docs/scope/list-of-vms) で確認できます。検証用の生のPrometheusデータは [grafana.stereumlabs.com](http://grafana.stereumlabs.com) (データソース `prometheus-cold`) で利用可能です。

*1投稿 - 1参加者*

[全トピックを読む](https://ethresear.ch/t/el-peer-composition-drifts-on-a-fixed-software-baseline-two-week-comparison-on-a-36-node-fleet/24857)
