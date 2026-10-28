---
title: コンセンサス層におけるPQ P2P移行のインベントリ
original_title: Inventory of PQ P2P Migrations in the Consensus Layer
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/inventory-of-pq-p2p-migrations-in-the-consensus-layer/26183
author: adust09
date: '2026-10-27'
category: Networking
tags:
  - networking
  - post-quantum
  - p2p
  - consensus
  - cryptography
topic_id: '26183'
translated_at: '2026-10-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Inventory of PQ P2P Migrations in the Consensus Layer](https://ethresear.ch/t/inventory-of-pq-p2p-migrations-in-the-consensus-layer/26183) — adust09 (2026-10-27)

著者: [Nyx Foundation](https://nyx.foundation/en/)の[@adust09](https://ethresear.ch/u/adust09)

## 概要

この記事では、コンセンサス層における[[Post-Quantum|ポスト量子 (PQ)]] [[P2P-networking|P2Pネットワーキング]]が直面する課題を評価します。

イーサリアムのコンセンサス層ネットワーキングには、採用された[[Post-Quantum|ポスト量子]]移行プロファイルがありません。バリデータのBLS署名をleanXMSSに置き換えても、[[ENR|ENR]]、[[Discovery-v5|Discovery v5]]、libp2p Peer ID、またはQUIC/TLSで使用されるネットワーキングIDとハンドシェイクは更新されません。

この移行には、以下の3つの関連するターゲットがあります。

1.  **Discovery**: [[ENR|ENR]]署名、Discovery ID証明、Discovery鍵交換。
2.  **接続鍵交換**: QUIC内の[[TLS-1-3|TLS 1.3]]鍵合意。
3.  **接続認証**: libp2p TLS IDバインディングとTLS `CertificateVerify`。

主な制約は構造的なものです。[[ENR|ENR]]は300バイト、Discoveryパケットは1,280バイトに制限されており、ハイブリッド鍵交換は[[Post-Quantum|ポスト量子]]認証を提供しません。

実際には、コンセンサス署名にはハッシュベース署名が推奨されていますが、[[P2P-networking|P2Pネットワーキング]]層のサイズ制限により、格子ベーススキームがネットワーキングの事実上の標準候補となっています。このインベントリは、アルゴリズム、エンコーディング、またはアクティベーションスケジュールを選択せずに、必要な変更をマッピングします。

この記事は、ネットワーク層とlibp2pに取り組む開発者を対象としています。ぜひフィードバックをお寄せください。

## 1. スコープ

この記事は、libp2pとQUICを介したイーサリアムCLネットワーキングをカバーしています。

```
Discovery v5 + ENR
        ↓
クライアント Discovery アダプター
ENR → マルチアドレス + 期待される Peer ID
        ↓
QUIC + TLS 1.3
        ↓
libp2p ストリーム
        ↓
gossipsub およびリクエスト/レスポンスプロトコル

```

[[Execution-layer|実行レイヤー]]とTCP/Noiseフォールバックはハンドシェイク分析の範囲外です。これらも互換性のある移行作業が必要です。現在のコンセンサス仕様開発ブランチは両方のトランスポートを必要とし、QUICをプライマリとして扱います。したがって、QUICのみのスコープは分析上の境界であり、デプロイ提案ではありません。

この記事では、[[Post-Quantum|ポスト量子]]署名、[[KEM|鍵カプセル化メカニズム (KEM)]]、[[fork|フォーク]]、またはロールアウト日を選択するものではありません。

## 2. 現在のDiscoveryからメッセージへのパス

まず、現在の仕様を見てみましょう。

Discoveryとlibp2pは別々のセッションと鍵を使用します。現在のCLプロファイルは、DiscoveryノードIDとlibp2p Peer IDを1つのsecp256k1ネットワーキング鍵から導出しますが、識別子は相互に交換可能ではありません。ノードIDはDiscoveryルーティングテーブル内のレコードを選択し、Peer IDはlibp2pエンドポイントを識別します。

![ノードIDはイーサリアムのもので、Peer IDはlibp2pのものです。](https://ethresear.ch/uploads/default/optimized/3X/7/1/7125b4d3f960b91f7d4ed888cfcccb3085c9ddf8_2_690x253.png)

*図1. ノードIDはイーサリアムのもので、Peer IDはlibp2pのものです。*

ノードはブートノードまたはキャッシュされた[[ENR|ENR]]から開始します。[[Discovery-v5|Discovery v5]]は`FINDNODE`と`NODES`でKademliaスタイルのルックアップを実行し、認証されたレコードを返します。クライアントアダプターは、選択された[[ENR|ENR]]をダイヤル可能なマルチアドレスと期待されるPeer IDに変換します。

![DiscoveryはENRを返し、その後クライアントはそのQUICエンドポイントにダイヤルし、Peer IDをチェックします。](https://ethresear.ch/uploads/default/optimized/3X/b/0/b0fd7e0ebc57c25c3394ff0aee1a0e12c8bac1ea_2_690x436.png)

*図2. Discoveryは[[ENR|ENR]]を返し、その後クライアントはそのQUICエンドポイントにダイヤルし、Peer IDをチェックします。*

QUICは新しい[[TLS-1-3|TLS 1.3]]セッションを確立します。Discoveryの鍵とトランスクリプトは再利用されません。クライアントは、[[ENR|ENR]]から派生したPeer IDに対して、認証されたlibp2p IDをチェックします。その後、クライアントはイーサリアムのステータス交換を実行し、通常のトラフィックが開始される前に[[fork|フォーク]]と[[Checkpoint|チェックポイント]]の互換性をチェックします。

![DiscoveryとQUIC/libp2pは別々の認証ステージです。](https://ethresear.ch/uploads/default/optimized/3X/2/5/256e16a1c2c7a63748e4e1837a85c88bae8dfa8c_2_690x496.png)

*図3. DiscoveryとQUIC/libp2pは別々の認証ステージです。*

Lighthouse、Prysm、Teku、Nimbus、Lodestar、Grandineは、両方のシステムを1つのsecp256k1鍵にバインドしています。将来の設計でこれらが分離される場合、ノードIDからPeer IDへのマッピングは認証され、規範的である必要があります。クライアントローカルの慣習は、ID置換と相互運用性のリスクを生み出すでしょう。

## 3. 暗号学的インベントリ

第2章で見たように、いくつかの暗号プリミティブを置き換える必要があります。

| コンポーネント | 役割 | 現在のスキーム | 量子関連の脅威 |
| --- | --- | --- | --- |
| ENR | Discoveryレコード署名 | secp256k1 ECDSA | 量子能力が存在した後にレコードを偽造する |
| Discovery v5 | セッション鍵交換 | secp256k1 ECDH | 今すぐトラフィックを記録し、後で復号する |
| Discovery v5 | ハンドシェイクID証明 | secp256k1 ECDSA | ノードを偽装し、ハンドシェイクを偽造する |
| libp2p TLS拡張 | Peer ID-証明書バインディング | CLプロファイルにおけるsecp256k1 ECDSA | Peer IDを偽装する |
| QUIC/TLS 1.3 | セッション鍵交換 | ネゴシエートされたDHE/ECDHE | 今すぐトラフィックを記録し、後で復号する |
| TLS 1.3 | CertificateVerify | 証明書鍵署名 | セキュアチャネルハンドシェイクを偽造する |

脅威には異なるタイムラインがあります。

-   **鍵交換**: 古典的な合意が破られた場合、記録された暗号文は復号される可能性があります。
-   **署名**: 攻撃者は、偽装または偽造の時点で量子能力を必要とします。

したがって、ハイブリッド鍵交換は完全な[[Post-Quantum|ポスト量子]]ID設計に先行できますが、完全な[[P2P-networking|P2Pネットワーキング]]移行ではありません。

## 4. Discoveryのポスト量子移行

ここでは、置き換えターゲットに関連する課題を確認しましょう。まずはDiscv5に関する課題です。

### 4.1 ENR形式とPQサイズ制約

[[ENR|ENR]]は最大300バイトのRLPリストです。

```
[signature, seq, k₁, v₁, k₂, v₂, ...]

```

`v4` IDスキームの場合、64バイトのsecp256k1署名は以下をカバーします。

```
keccak256(RLP([seq, k₁, v₁, k₂, v₂, ...]))

```

署名されたフィールドには、ID鍵とアドバタイズされたエンドポイントが含まれます。`udp`と`quic`は別々のリスニングポートを識別します。

![v4署名はRLPエンコードされたコンテンツをカバーし、署名自体はカバーしません。](https://ethresear.ch/uploads/default/optimized/3X/7/f/7fe4396c8f101f00793e78cde8e15bfe2ac6b30e_2_690x429.png)

*図4. v4署名はRLPエンコードされたコンテンツをカバーし、署名自体はカバーしません。*

サイズ制限により、一般的な[[Post-Quantum|ポスト量子]]署名との直接的な置き換えはできません。

| 項目 | サイズ |
| --- | --- |
| 最大完全ENR | 300バイト |
| 最大Discovery v5パケット | 1,280バイト |
| 現在のsecp256k1 ENR署名 | 64バイト |
| 現在の圧縮secp256k1公開鍵 | 33バイト |
| ML-DSA-44公開鍵 | 1,312バイト |
| ML-DSA-44署名 | 2,420バイト |

ML-DSA-44は例であり、選択ではありません。その公開鍵はすでに両方の制限を超えており、その署名はさらに大きいです。ID鍵、署名、エンドポイント、およびメタデータが[[ENR|ENR]]の予算を共有するため、[[Post-Quantum|ポスト量子]]移行には新しいレコード形式またはクレデンシャル配布モデルが必要です。他のスキームは異なるサイズトレードオフを行いますが、どれもそのまま置き換え可能であると仮定すべきではありません。

スキームファミリーは層によって異なります。イーサリアムのコンセンサス署名作業は、XMSSや[[SLH-DSA|SLH-DSA (SPHINCS+)]]などのハッシュベーススキームを推進しており、高い信頼性を提供しますが、数キロバイト以上の署名を伴います。[[P2P-networking|P2Pネットワーキング]]層は、300バイトの[[ENR|ENR]]内でそのオーバーヘッドを許容できないため、ML-DSAのような標準化された格子ベーススキームが、ネットワーキングの実用的な候補として優勢です。これはコミュニティの現在の傾向を説明するものであり、選択ではありません。

### 4.2 Discovery v5セッション認証と移行の課題

最初の接触時、イニシエーターは受信者の[[ENR|ENR]]を知っていますが、セッション鍵を持っていません。

1.  イニシエーターは、ランダムなメッセージコンテンツを含む通常のパケットを送信します。
2.  受信者は、IDノンスと[[ENR|ENR]]シーケンスを含む`WHOAREYOU`チャレンジで応答します。
3.  イニシエーターは、ID署名、エフェメラル鍵、オプションの[[ENR|ENR]]、および`FINDNODE`などの暗号化されたリクエストを送信します。
4.  受信者は証明を検証し、鍵を導出し、`NODES`などの暗号化された応答を返します。
5.  両側は有効期限が切れるまでセッション鍵を再利用します。

Discoveryはsecp256k1 ECDHとHKDF-SHA-256からAES-128-GCM鍵を導出します。ECDSAはハンドシェイクを認証しますが、ECDH単独では認証しません。

![Discoveryとlibp2pは別々の鍵交換を実行します。](https://ethresear.ch/uploads/default/optimized/3X/3/0/302221c20c076afcf51f4ddf537de0b38bb8265f_2_690x211.png)

*図5. Discoveryとlibp2pは別々の鍵交換を実行します。*

[[Post-Quantum|ポスト量子]]移行は、[[ENR|ENR]]、ノードID、エンドポイント、およびPeer ID間のバインディングを維持しながら、ECDSA ID証明とECDHの両方を置き換える必要があります。ハイブリッド[[KEM|鍵カプセル化メカニズム (KEM)]]はセッションシークレットを保護しますが、ピアを認証しません。[[Post-Quantum|ポスト量子]]認証は、1,280バイトのパケット予算内に収まるか、個別に認証されたクレデンシャルを使用する必要があります。
したがって、[[Post-Quantum|ポスト量子]]Discoveryには以下の共通ルールが必要です。

-   [[ENR|ENR]]、ノードID、Peer ID、およびアドバタイズされたエンドポイントが同じノードに属することを証明すること。
-   大規模な[[Post-Quantum|ポスト量子]]公開鍵と署名がどこに保存され、どのように取得、キャッシュ、更新されるかを決定すること。
-   ダウングレード攻撃を許容せずに、現在の`v4`スキームを後継スキームと並行して運用すること。
-   サービス拒否攻撃に耐えるため、過大なDiscoveryパケットと高価なDiscovery側の暗号化（デカプセル化と署名検証）を制限すること。
-   すべてのクライアントが実装する1つのエンコーディング、エラー挙動、およびテストベクトルのセットを定義すること。

## 5. 接続鍵交換のポスト量子移行

次に鍵交換を見てみましょう。ここからはlibp2pのサポートが必要です。

QUICは[[TLS-1-3|TLS 1.3]]を使用します。古典的なECDHEシークレットがTLS鍵スケジュールに供給され、ハイブリッドグループがML-KEMシークレットを追加します。

| TLS 1.3鍵シェア | クライアントシェア | サーバーシェア | 追加されたプロパティ |
| --- | --- | --- | --- |
| X25519 | 32バイト | 32バイト | 古典的前方秘匿性 |
| X25519MLKEM768 | 1,216バイト | 1,120バイト | 古典的 + ML-KEMハイブリッド秘匿性 |

[[RFC-10024|RFC 10024]]はハイブリッド[[TLS-1-3|TLS 1.3]]グループを標準化しています。イーサリアムクライアントにはまだ以下が必要です。

-   共通のTLSプロファイルと互換性のあるライブラリ。
-   QUICハンドシェイクのサイズ、レイテンシ、CPU、メモリの測定。
-   決定論的なネゴシエーションとダウングレード安全なフォールバックルール。
-   設定済み、ネゴシエート済み、および失敗したハイブリッドセッションに関するクライアント間テストとテレメトリ。

ハイブリッド秘匿性は鍵確立を保護しますが、接続認証に使用される署名を置き換えるものではありません。

## 6. 接続認証のポスト量子移行

次は認証です。libp2p TLSハンドシェイクには2つの署名役割があります。

1.  **Peer IDバインディング**: 長期的なlibp2p鍵がTLS証明書公開鍵に署名し、チャネルを期待されるPeer IDにバインドします。
2.  **TLS `CertificateVerify`**: 証明書鍵がTLSトランスクリプトに署名し、その鍵の所有を証明します。

[[Post-Quantum|ポスト量子]]鍵交換はどちらの署名も変更しません。両方とも[[Post-Quantum|ポスト量子]]またはハイブリッド計画が必要です。

| 署名役割 | 未解決のアルゴリズム問題 | 必要な継続性とテスト |
| --- | --- | --- |
| Peer IDバインディング | PQのみか、ハイブリッドか？ | Peer ID導出、IDバインディング、ローテーション、取り消し、期待されるピアのチェック |
| TLS CertificateVerify | PQのみか、ハイブリッドか？ | TLSライブラリサポート、エンコーディング、トランスクリプト互換性、クライアント間ネゴシエーション |

## 7. 以前の作業と未解決の領域

いくつかの研究がすでに行われています。

1.  [[Post-Quantum|ポスト量子]]タスクリストは、ノードID、[[ENR|ENR]]、Discovery、ハンドシェイク、暗号化、ブートノードを分離していますが、CL相互運用性プロファイルを定義していません。
2.  [[Towards-a-Quantum-Safe-P2P-for-Ethereum|イーサリアムのための量子安全なP2Pに向けて]]は、[[Post-Quantum|ポスト量子]]サイズの増加を定量化し、Discoveryがフィールドごとのアルゴリズム交換ではなく、再設計を必要とする理由を示しています。
3.  [[Signature-free-post-quantum-RLPx-handshake|署名不要なポスト量子RLPxハンドシェイク]]は、[[Execution-layer|実行レイヤー]]のDiscv4/RLPxパスにおける静的[[KEM|鍵カプセル化メカニズム (KEM)]] IDと遅延認証を研究しており、CL [[Discovery-v5|Discovery v5]]/libp2pではありません。

標準化の面では、NISTはML-KEM ([[FIPS-203|FIPS 203]])、ML-DSA ([[FIPS-204|FIPS 204]])、および[[SLH-DSA|SLH-DSA (SPHINCS+)]] ([[FIPS-205|FIPS 205]])を最終化し、[[FN-DSA|FN-DSA (Falcon)]] ([[FIPS-206|FIPS 206]])はまだドラフト段階です。IETFは[[TLS-1-3|TLS 1.3]] ([[RFC-8446|RFC 8446]])と[[TLS-1-3|TLS 1.3]]用のハイブリッド[[Post-Quantum|ポスト量子]]/T鍵交換 ([[RFC-10024|RFC 10024]])を標準化しました。ハッシュベースのXMSS ([[RFC-8391|RFC 8391]])とLMS ([[RFC-8554|RFC 8554]])は個別に標準化されています。

libp2pでは、[[ML-DSA-peer-identities|ML-DSAピアID]]と[[PKIX-PKCS8-key-encodings|PKIX/PKCS#8鍵エンコーディング]]は未解決の提案のままです。この文書が求めるイーサリアムCL [[P2P-networking|P2Pネットワーキング]]プロファイルを定義する標準はありません。

## 移行課題の要約

イーサリアムCL [[P2P-networking|P2Pネットワーキング]]移行には、3つの境界に対する協調的な変更が必要です。

-   Discoveryには、新しいID、レコード、およびハンドシェイク形式が必要です。
-   QUIC/TLSには、ダウングレード安全なハイブリッド鍵交換が必要です。
-   libp2p/TLSには、IDバインディングと`CertificateVerify`の両方に対する[[Post-Quantum|ポスト量子]]計画が必要です。

現時点では、具体的な計画はありません。Discv5の計画はイーサリアムチームが主導し、それ以外のすべてはlibp2pチームが主導することが望ましいでしょう。

クライアントチームの協力なしには、全体的な移行は完了できません。
次に、Discv5に焦点を当てた具体的な移行計画を投稿する予定です。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/inventory-of-pq-p2p-migrations-in-the-consensus-layer/26183)
