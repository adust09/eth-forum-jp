---
title: EIP-3668のためのゲートウェイ間連携 / メッシュ同期プロトコルの提案
original_title: Gateway-to-gateway coordination for EIP-3668 / Proposing a mesh sync protocol
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/gateway-to-gateway-coordination-for-eip-3668-proposing-a-mesh-sync-protocol/28680
author: TMerlini
date: '2026-06-02'
category: EIPs
tags:
  - eips
  - eip
  - networking
  - protocol-design
  - applications
  - security
  - cryptography
  - identity
  - attestations
topic_id: '28680'
translated_at: '2026-06-03'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Gateway-to-gateway coordination for EIP-3668 / Proposing a mesh sync protocol](https://ethereum-magicians.org/t/gateway-to-gateway-coordination-for-eip-3668-proposing-a-mesh-sync-protocol/28680) — TMerlini (2026-06-02)

**カテゴリ:** EIPs / ERC ディスカッション
**タグ:** eip-3668, ccip-read, gateways, attestation
**共同執筆者:** Tiago Merlini ([@TMerlini](https://ethereum-magicians.org/u/tmerlini)), Damon Zwicker (OCP) [@Damonzwicker](https://ethereum-magicians.org/u/damonzwicker), Vincent Wu (ERC-8263 / Composition Note) [@VincentWu](https://ethereum-magicians.org/u/vincentwu), Jimmy Shi (ERC-8274) [@JimmyShi22](https://ethereum-magicians.org/u/jimmyshi22)

* * *

## ギャップ

[[glossary/EIP|EIP]]-3668は、クライアントがCCIP-Readゲートウェイとどのように通信するかを正確に指定しています。リクエスト形式、レスポンスエンベロープ、リバート規約などです。しかし、ゲートウェイ同士がどのように通信するかについては何も言及していません。

これは、最も単純なケース（1つのゲートウェイ、1つのオペレーター）では問題ありません。しかし、CCIP-Readの採用が進むにつれて、単一のゲートウェイでは解決できない3つの問題が浮上します。

1.  **冗長性 (Redundancy)**。ゲートウェイがダウンすると、ENS名（または任意のCCIP-Readリゾルバー）が機能しなくなります。2番目のゲートウェイが同じネームスペース (namespace) を提供するための標準的な方法がありません。これは単純な稼働時間以上の問題です。IPFS CIDとしてページがピン留めされているCCIP-Readのdapp（分散型アプリケーション）は、停止させるフロントエンドサーバーを持ちませんが、それでも単一のゲートウェイが故障する可能性があります。メッシュ同期プロトコルは、その最後の集中型依存関係を取り除きます。ネームスペースを同期した任意のノードが応答できるようになります。CIDでピン留めされたページと組み合わせることで、結果として、どのレイヤーでも単一障害点のないdappが実現します。

2.  **監査可能性 (Auditability)**。ゲートウェイは実際に何を受信し、何を返したのでしょうか？各呼び出しの署名され、複製可能な記録がなければ、ゲートウェイが応答を改ざんしなかったことを検証する方法はありません。

3.  **帰属 (Attribution)**。マルチパーティシステム（複数のエージェント、複数のノード）において、誰が共有記録セットに何を提供したのでしょうか？

これらのいずれも[[glossary/EIP|EIP]]-3668自体では対処されておらず、その後の連携標準もありません。

* * *

## 提案されたプロトコル

私たちは数ヶ月間リファレンス実装を運用しており、議論のために最小限のゲートウェイ間同期プロトコルを提案したいと考えています。

コアとなるプリミティブ (primitive) は、任意の[[glossary/EIP|EIP]]-3668ゲートウェイが公開できる単一のエンドポイントです。

```
GET /records?namespace=<str>&since=<unix>&limit=<n>&cursor=<str>


```

応答:

```
{
  "protocol": 1,
  "node_version": "0.3.0",
  "namespace": "agent-attestations",
  "records": [
    {
      "inputHash":  "0x...",
      "namespace":  "agent-attestations",
      "key":        "0x...",
      "value":      "0x...",
      "timestamp":  1234567890,
      "signature":  "0x...",
      "sourcePeer": null
    }
  ],
  "cursor": "1234567890|0xabc..." 
}


```

いくつかの意図的な設計上の選択肢があります。

**オフセットではなくカーソルページネーション (Cursor pagination over offset)**。`timestamp|inputHash`複合カーソルを使用することで、同時書き込み下でもタイムスタンプ境界でレコードがスキップされることはありません。純粋なオフセットページネーションでは、ページ間に新しいレコードが挿入されるとレコードが失われます。

**`INSERT OR IGNORE`による重複排除 (deduplication)**。複合プライマリキーは`(inputHash, namespace)`です。同じレコードが2つのピアから到着しても、一度だけ保存されます。ゴシップは自由に実行しても安全です。

**プロトコルバージョンフィールド (Protocol version field)**。異なるプロトコルバージョンのノードは、不正なデータを黙って受け入れるのではなく、警告とともに互いをスキップします。

**署名者の固定 (Signer pinning)**。ピアからの最初の同期時に、復元された署名者アドレスが保存されます。異なる署名者からの後続のレコードは拒否されます。これにより、侵害されたピアが他のノードに代わってレコードを挿入することはできません。

**ネームスペースのスコープ化 (Namespace scoping)**。各プルはネームスペース文字列にスコープされます。`token-metadata`を提供するノードと`agent-attestations`を提供するノードは、互いにピアリングしていても、レコードレベルで完全に分離されます。

* * *

## アテステーション (Attestation) をその上に重ねる

上記の同期プロトコルはトランスポート層のものであり、署名されたレコードを移動させるだけです。私たちはその上に何が来るかについても取り組んできました。それは、ゲートウェイが*何*を受信し、*何*を返したかを証明する方法であり、単にレコードを書き込んだという事実だけではありません。

このアプローチは、任意のリゾルバー関数を以下のパイプラインでラップすることです。

1.  生の`calldata`をハッシュ化します: `rawInputHash = keccak256(calldata)`
2.  オプションでサニタイゼーションパイプラインハッシュを適用します: `inputHash = keccak256(abi.encode(rawInputHash, pipelineHash))` — またはサニタイゼーションが適用されなかった場合は`keccak256("IDENTITY_SENTINEL")`を使用します。
3.  応答をハッシュ化します: `outputHash = keccak256(response)`
4.  コミットメント (commitment) を計算します: `commitmentHash = keccak256(agentId · modelHash · inputHash · outputHash · timestamp)`
5.  上記すべてを含む[[glossary/EIP|EIP]]-712 `WyriweAttestation`構造体に署名します。

これらのアテステーションは、通常のレコードと同じ`/records`プロトコルを使用して、別の`{namespace}:wyriwe`ネームスペースで同期されます。任意のピアは[[glossary/EIP|EIP]]-712署名を検証し、コミットメントハッシュを独立して再構築できます。

コミットメントハッシュはその後、オンチェーンにアンカー (anchor) することができます。これは単一の32バイトの書き込みであり、任意の一つのゲートウェイを信頼することなく、アテステーションを不変かつクエリ可能にします。

Sepoliaにデプロイされたコントラクト（Etherscanで検証済み）:

| コントラクト | 役割 | アドレス |
| --- | --- | --- |
| AttestationIndex | ccip-router OCP互換コミットメントストア | 0x107D706112225aC57eCf6692FBbDC283fb6E3698 |
| NodeRegistry | ノード登録 | 0x6be4966596A9CBaa7260ab6EbbFFA69bBC9a42b7 |
| WyriweProofVerifier | [[glossary/ERC-8274|ERC-8274]] IProofVerifier | 0x001eFFa0fD1D171b164808644678F3301d8EDC96 |
| TruthAnchorV1 ([[glossary/ERC-8263|ERC-8263]]カノニカル — Vincent Wu) | [[glossary/ERC-8263|ERC-8263]]リファレンスコントラクト・メインネット | 0xe95d6a15966984c209a62a2c188828555eb5ec3d |

`AttestationIndex`はccip-router独自のコミットメントストアです — `signerOf[commitmentHash]` + `commitmentOf[inputHash]`。これは[[glossary/Observation-Commitment-Protocol|OCP (Observation Commitment Protocol)]]コミットメント不変条件を満たし、[[glossary/ERC-8263|ERC-8263]]カノニカルコントラクトとは異なる、有効な[[glossary/Observation-Commitment-Protocol|OCP (Observation Commitment Protocol)]]互換アンカーです。`TruthAnchorV1`はカノニカルな`AnchorProof(uint8 agentIdScheme, bytes32 agentId, bytes32 proofHash, address operator, bytes aux)`イベントを発行します。`AttestationIndex`は、ゲートウェイがアテステーションされた実行後に書き込むトランスポート層のアンカーです。これら2つは設計上、別々のプリミティブです。

**ccip-routerが[[glossary/ERC-8263|ERC-8263]]に接続する方法:** ccip-routerは、その`commitmentHash`を`TruthAnchorV1`の`proofHash`としてアンカーします。[[glossary/ERC-8263|ERC-8263]]の`proofHash`は意図的に不透明です。同じアンカー層が[[glossary/Observation-Commitment-Protocol|OCP (Observation Commitment Protocol)]]、[[glossary/WYRIWE|WYRIWE (What You Read Is What You Execute)]]、[[glossary/zkML|ゼロ知識機械学習 (zkML)]]に均一にサービスを提供します。ccip-routerの`commitmentHash = keccak256(abi.encode(agentId, modelHash, inputHash, outputHash, timestamp))`は、定義ではなく、1つのカノニカルなインスタンス化です。完全なチェーン: 推論が実行される → ゲートウェイが`WyriweAttestation`に署名し`commitmentHash`を生成 → `TruthAnchorV1`で`anchor(commitmentHash)`が`proofHash`として呼び出される → `AnchorProof`イベントが発行される。L3アンカリングを検証するには、`eth_getLogs`を介して`proofHash`トピック（=あなたの`commitmentHash`）で`AnchorProof`をフィルタリングし、アンカリングブロックのタイムスタンプと実行時間を比較します。V1は設計上イベントのみです。アンカーごとのストレージコストはありません。同期的なオンチェーンビュー（`IAnchorReader`）は[[glossary/ERC-8263|ERC-8263]] v0.3で提案されています。

`WyriweProofVerifier`は[[glossary/ERC-8274|ERC-8274]] `IProofVerifier`を実装しています。これはL4のみのアテステーションチェックです。「この`agentId`の認可されたゲートウェイは、`inputHash`が`outputHash`を生成したことをアテステーションしましたか？」パラメータ:

-   `inputHash`、`outputHash` — 明示的な推論の入出力コミットメント
-   `metadata` = `abi.encode(agentId, registry)` — 認可された署名者のID
-   `proof` = `abi.encode(modelHash, rawInputHash, sanitizationPipelineHash, commitmentHash, timestamp, sig)` — L4暗号学的マテリアル

`verify()`は`(agentId, modelHash, inputHash, outputHash, timestamp)`から`commitmentHash`を再計算し、完全な構造体から[[glossary/EIP|EIP]]-712ダイジェストを再構築し、署名者を回復します。外部呼び出しはありません。ゲートウェイが構造体に対して以前に行った署名は、`rawInputHash → sanitizationPipelineHash → inputHash`という来歴チェーンを保証します。検証者は再検証することなくこれを信頼します。これによりループが閉じられます。メッシュ全体で連携されたコミットメントは、任意の[[glossary/ERC-8274|ERC-8274]]互換コントラクトによってオンチェーンで決済可能です。

* * *

## ENSワイルドカード解決

このスタックの実用的なアプリケーションの1つは、ENSオフチェーンリゾルバーゲートウェイです。リファレンス実装には、`resolve(bytes name, bytes data)` calldata（[[glossary/EIP|EIP]]-137ワイルドカード解決パターン）をデコードし、クリーンなハンドラーにディスパッチする`withEns()`ラッパーが付属しています。

```
import { CcipRouter, withEns } from 'ccip-router'

const ccip = new CcipRouter({
  resolver: withEns(async (name, record) => {
    // name   → "vitalik.eth"
    // record → { type: 'addr' } | { type: 'addr', coinType: 60n }
    //           { type: 'text', key: 'avatar' } | { type: 'contenthash' }
    return db.lookup(name, record)   // return value string or null
  }),
})


```

`withEns()`は、DNSワイヤーフォーマットのデコード、セレクターディスパッチ（`addr`、`addr(uint256)`、`text`、`contenthash`）、および応答のABIエンコーディングを処理します。`null`はレコードタイプごとに正しいゼロ値にマッピングされます。不明なセレクターは例外をスローするのではなく`0x`を返します。

スタンドアロンノードには、デフォルトでDBバックアップされたENSリゾルバーが付属しています。レコードは管理パネルから管理され、コードは不要です。オンチェーンのCCIP-Readリゾルバーを介してこのゲートウェイを指す任意の名前は、自動的に提供されます。

**アテステーションとの組み合わせ。** `withEns`を`withWyriwe`の中に配置することで、すべてのENS解決が完全な`WyriweAttestation`（生のcalldataハッシュ、モデルハッシュ、入出力コミットメント、[[glossary/EIP|EIP]]-712署名）を保持するようにします。

```
resolver: withWyriwe(withEns(myResolver), attestationOpts)


```

**SIWEによるオペレーターID。** 管理ダッシュボードは、Sign-In With Ethereum（[[glossary/EIP|EIP]]-4361）を介して認証されるようになりました。認可された署名者は、ノード自身のゲートウェイキーであり、すべてのレコードに署名するのと同じキーです。秘密鍵を保持していることが、ノードを操作していることの証明となり、別途パスワードは不要です。

* * *

## 決済レイヤー

オンチェーンに[[glossary/Observation-Commitment-Protocol|OCP (Observation Commitment Protocol)]]アンカーされる`commitmentHash`は、資金を解放する前に任意の決済コントラクトが必要とするプリミティブです。[[glossary/ERC-8274|ERC-8274]]は、このL4ステップのための最小限の`IProofVerifier`インターフェースを提案しています。これは、基盤となる証明システムを知らなくても、任意のコンシューマーが`verify(inputHash, outputHash, metadata, proof)`を1回呼び出すだけで済むものです。このインターフェースは「認可された当事者がこの推論結果をアテステーションしましたか？」という狭い範囲にスコープされています。L3アンカリング（ゲートウェイの責任）や入力の来歴チェーン（ゲートウェイの[[glossary/EIP|EIP]]-712署名によって既に保証されている）は検証しません。これは、オラクル/マルチシグパターンに自然にマッピングされます。ゲートウェイが認可されたアテスターであり、`metadata`がそのIDを運び、`proof`が暗号学的証拠を運びます。

`WyriweProofVerifier`は、このスタックのための具体的な[[glossary/ERC-8274|ERC-8274]]実装であり、Sepoliaの[`0x001eFFa0fD1D171b164808644678F3301d8EDC96`](https://sepolia.etherscan.io/address/0x001eFFa0fD1D171b164808644678F3301d8EDC96#code)にデプロイされています。`inputHash`は、生のcalldataからサニタイゼーションパイプライン、コミットメント、オンチェーンアンカー、決済まで、すべてのレイヤーを結びつける共有の暗号学的アンカーです。

* * *

## フィードバックを求めている点

1.  **`/records`プロトコル自体について。** カーソル設計は健全でしょうか？プロトコルバージョンのネゴシエーションはより正式なもの（例: `GET /protocol`エンドポイント）であるべきでしょうか？考慮していない障害モードはありますか？
2.  **ネームスペース設計について。** 現在、ネームスペースは任意の文字列です。オペレーターは帯域外で調整する必要があります。レジストリが必要でしょうか、それともそれは不必要な複雑さでしょうか？
3.  **署名者固定のトレードオフについて。** 最初の同期で固定するのはシンプルですが、キーをローテーションするノードはピアから見ると別のノードのように見えます。ここにはより良いIDプリミティブがあるでしょうか？（私たちはVNI — `nodeId = keccak256(signerAddress)`となる署名付き`{ nodeId, signerAddress, url }`ドキュメントで、オペレーターが再署名すればキーローテーション後も安定する — を実験しています。）
4.  **これがフォローアップの[[glossary/EIP|EIP]]を必要とするかどうかについて。** `/records`プロトコルは十分にシンプルなので、[[glossary/EIP|EIP]]-3668の補完として短い情報提供[[glossary/EIP|EIP]]になる可能性があります。あるいは、実装が収束するデファクトスタンダードとして残しておく方が良いかもしれません。ご意見を歓迎します。
5.  **実行ごとのコミットメントと設定ごとのコミットメントについて。** ここで生成される`commitmentHash`は厳密に実行ごとのものです。特定の呼び出しに対して`inputHash`、`outputHash`、`agentId`、`modelHash`、`timestamp`をバインドします。エージェント設定（モデル、パイプライン）を記述する別の安定したコミットメントを一度アンカーし、複数の実行で参照すべきかどうかは未解決の疑問です。トランスポート層に位置するため、ここで表面化する必要があるため、ここで取り上げます。

* * *

## リファレンス実装

`ccip-router` v0.3.0 — npmパッケージ + セットアップウィザード、管理ダッシュボード、および上記すべてが組み込まれたスタンドアロンノード:

-   npm: [https://www.npmjs.com/package/ccip-router](https://www.npmjs.com/package/ccip-router)
-   GitHub + 統合ガイド: [https://github.com/Echo-Merlini/ccip-router](https://github.com/Echo-Merlini/ccip-router)

**v0.3.0に含まれるもの:** `WyriweProofVerifier`（[[glossary/ERC-8274|ERC-8274]] `IProofVerifier`）用の`WYRIWE_PROOF_VERIFIER_ABI`エクスポート、`withEns()` ENSワイルドカードリゾルバーラッパー、DBバックアップされたENSレコード（管理パネルから管理、コード不要）、SIWE管理認証（[[glossary/EIP|EIP]]-4361、ゲートウェイキー = 管理者ID）、多目的リゾルバー用の`isEnsCalldata()`ガード。

* * *

*この作業は、[[glossary/WYRIWE|WYRIWE (What You Read Is What You Execute)]]、[[glossary/Observation-Commitment-Protocol|OCP (Observation Commitment Protocol)]] (Damon)、[[glossary/ERC-8263|ERC-8263]] (Vincent / Composition Note)、[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]、[[glossary/ERC-8274|ERC-8274]]、およびERC-8275に関連しています。これらの仕様に関する以前のスレッドは、アテステーション層と決済層自体を議論するのに適切な場所です。このスレッドは特にゲートウェイ連携層に関するものです。*

* * *

*Damon Zwicker (OCP)、Vincent Wu (ERC-8263 / Composition Note)、Jimmy Shi (ERC-8274) との共同執筆。*

*2件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/gateway-to-gateway-coordination-for-eip-3668-proposing-a-mesh-sync-protocol/28680)
