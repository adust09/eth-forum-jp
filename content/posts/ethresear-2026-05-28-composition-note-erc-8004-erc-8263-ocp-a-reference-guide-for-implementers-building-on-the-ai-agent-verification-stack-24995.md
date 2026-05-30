---
title: '構成ノート: ERC-8004 + ERC-8263 + OCP — AIエージェント検証スタックを構築する実装者向けリファレンスガイド'
original_title: >-
  Composition Note: ERC-8004 + ERC-8263 + OCP — A reference guide for
  implementers building on the AI agent verification stack
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/composition-note-erc-8004-erc-8263-ocp-a-reference-guide-for-implementers-building-on-the-ai-agent-verification-stack/24995
author: DamonZwicker
date: '2026-05-28'
category: Architecture
tags:
  - architecture
  - applications
  - protocol-design
  - smart-contracts
  - verification
  - identity
  - research
  - ai-agents
topic_id: '24995'
translated_at: '2026-05-30'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Composition Note: ERC-8004 + ERC-8263 + OCP — A reference guide for implementers building on the AI agent verification stack](https://ethresear.ch/t/composition-note-erc-8004-erc-8263-ocp-a-reference-guide-for-implementers-building-on-the-ai-agent-verification-stack/24995) — DamonZwicker (2026-05-28)

共同執筆者: [@TruthAnchorAi](https://ethresear.ch/u/truthanchorai) (Vincent Wu — ERC-8263) および [@tmerlini](https://ethresear.ch/u/tmerlini) (Tiago Merlini — ERC-8004 / WYRIWE)。完全なドキュメントはこちらでも入手可能です: [composition-note-8004-8263-ocp.md · GitHub](http://gist.github.com/damonzwicker/8742e742bdc627b8e2179c00b81289dc)

**構成ノート: ERC-8004 + ERC-8263 + OCP**

*AIエージェント検証スタックを構築する実装者向けリファレンスガイド*

共同執筆者:

-   Vincent Wu — ERC-8263 (AIエージェント向けオンチェーン証明レイヤー)
    
-   Damon Zwicker — オブザベーション・コミットメント・プロトコル (OCP)
    
-   Tiago Merlini — ERC-8004 / WYRIWE / 実行アテステーションプロファイル
    

* * *

## **証明スタック**

このノートでは、AIエージェントのアクションに対する完全な証明スタックを構成する5つのレーンについて説明します。

| レーン | 仕様 / 実装 | 役割 |
| --- | --- | --- |
| アイデンティティ | ERC-8004 — Tiago Merlini 他 | エージェントは誰か |
| コミットメント | ERC-8263 — Vincent Wu / TruthAnchor | エージェントが何をコミットしたか |
| 検証 | オブザベーション・コミットメント・プロトコル — Damon Zwicker | チェーンの状態のみから、誰もがダイジェストを独立して検証する方法 |
| 永続性 | HBS画像プロベナンス — Tiago Merlini と @wgw_eth | 証明がアーティファクトと共に伝播する方法 |
| リファレンスワークフロー | TruthAnchor | 上記4つを構成する実装サーフェス。いずれの規範的要件でもない |

最初の3つのレーンはコアプロトコルスタックを形成します。それぞれが単一の独立した役割を持ち、完全な帰属（attribution）-コミットメント-検証チェーンには、それらが連携して機能することが必要です。アプリケーションはスタックの任意のサブセットを採用できますが、対応するレイヤーなしではチェーンが保持されることを期待すべきではありません。HBSは、そのコアの上に構築された非規範的なアーティファクト層の拡張であり、4番目の規範的なプロトコル層ではありません。これはコミットされたペイロードを配布チャネル間でポータブルにするものですが、アイデンティティ解決とオンチェーンインクルージョンには依然として基盤となるパブリックチェーンデータが必要です。TruthAnchorは、仕様と実装の境界を明確にするためのリファレンスワークフローとして個別に記載されています。ERC-8263はコントラクトのセマンティクスを管理し、TruthAnchorはそのセマンティクスの1つのデプロイメントであり、仕様そのものではありません。

このノートは記述的なものであり、規範的なものではありません。各基盤となる仕様はそれ自体で管理されます。ここで説明する構成は、クリーンな共同デプロイメントのためのガイドであり、メタ標準ではありません。

* * *

## **問題**

AIエージェントは、取引、ガバナンス、コンテンツ生成、自律的な意思決定など、結果を伴うアクションを実行する機会が増えています。記録を生成したシステムに依存することなく、エージェントのアイデンティティを、アクション、入力、出力、またはオブザベーションに関する独立して検証可能なコミットメントにバインドする標準的な方法はありません。

3つの補完的な標準がこれを共に解決します。

* * *

## **3つの標準**

### **ERC-8004 — エージェントアイデンティティレジストリ**

AIエージェントのオンチェーンアイデンティティを確立します。エージェントは、正規のウォレット、バインドされたコレクション、および解決可能なマニフェストを持つ登録済みトークンです。

**何に答えるか:** このエージェントは誰か？

リファレンス: [ERC-8004](https://ethereum-magicians.org/t/erc-8004-trustless-agents/25098)

* * *

### **ERC-8263 — オンチェーン証明レイヤー**

エージェントのアイデンティティにリンクされたアクションダイジェストをオンチェーンでコミットするための最小限のインターフェースを提供します。`agentIdScheme` ディスクリミネーターは、ERC-8004へのファーストクラスのオンチェーンブリッジを提供します。

```
function anchor(
    uint8 agentIdScheme,
    bytes32 agentId,
    bytes32 proofHash
) external;

function anchorWithAux(
    uint8 agentIdScheme,
    bytes32 agentId,
    bytes32 proofHash,
    bytes calldata aux
) external;

event AnchorProof(
    uint8           agentIdScheme,
    bytes32 indexed agentId,
    bytes32 indexed proofHash,
    address indexed operator,
    bytes           aux
);
```

**agentIdScheme レジストリ:**

| スキーム | 名前 | agentId 導出 |
| --- | --- | --- |
| 0x00 | ANONYMOUS | agentId は bytes32(0) でなければならない |
| 0x01 | REGISTRY | bytes32(uint256(erc8004AgentId)) — 32バイトゼロパディングされたERC-8004（または互換性のある）レコードID |
| 0x02 | URI_HASH | keccak256(正規のエージェントURI) |
| 0x03+ | 予約済み | コントラクトレベルで拒否される |

**aux:** `aux` はプロファイル定義の不透明なバイトです。ERC-8263はこれに正規のセマンティクスを割り当てず、コミットメントのセマンティクスはこれに依存してはなりません。プロファイルは `aux` をセッションID、親証明参照、OCPエンベロープポインタ、マークル証明、またはその他のコンテキストメタデータに使用できます。コントラクトはオンチェーンのサイズ制限を課しませんが、クライアントとインデクサーはプロファイル固有のサイズ制限を強制したり、サイズ超過の `aux` を拒否したりする場合があります。

**何に答えるか:** このエージェントは何を、いつコミットしたか？

リファレンス: [ERC-8263](https://github.com/ethereum/ERCs/pull/1748)

* * *

### **OCP — オブザベーション・コミットメント・プロトコル**

コミットされたダイジェストが、生の台帳データに対して独立して検証される方法を定義します。信頼できるSDK、ゲートウェイ、またはインデクサーは不要で、パブリックRPCを介して生の台帳データから検証を実行できます。

```
再計算 → 比較 → インクルージョン確認

```

**何に答えるか:** 誰にも信頼を置くことなく、これを独立して検証できるか？

リファレンス: [OCP](https://github.com/damonzwicker/observation-commitment-protocol)

* * *

## **それらの構成方法**

```
┌─────────────────────────────────────────────────────┐
│                   アプリケーション層                  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│  ERC-8004 — アイデンティティ                                 │
│  エージェントは誰か？レジストリ検索、ウォレット、マニフェスト │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│  ERC-8263 — コミットメント                               │
│  anchor(agentIdScheme, agentId, proofHash)           │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│  OCP — 検証                                  │
│  再計算 → 比較 → トランザクションでのインクルージョン確認       │
└─────────────────────────────────────────────────────┘

```

`proofHash = H(正規のオブザベーションバイト)`。ここでHは証明プロファイルによって定義されます。TruthAnchor / OCPパスの場合、H = SHA-256です。

各レイヤーは独立して検証可能です。いずれも他のレイヤーのセマンティクスを吸収することはありません。

* * *

## **エンドツーエンドのフロー**

**コミットメント（書き込み側）:**

1.  エージェントがオブザベーションに対してアクションを実行する
    
2.  `proofHash = H(observation)` — 生バイト、アルゴリズムは証明プロファイルによって定義される
    
3.  `anchor(agentIdScheme, agentId, proofHash)` がオンチェーンで呼び出される (ERC-8263)
    
4.  トランザクションレシートからOCP証明エンベロープが構築される
    

**検証（読み取り側）:**

1.  検証者が以下を受け取る: オブザベーション + OCP証明エンベロープ
    
2.  `H′ = H(observation)` — 宣言されたハッシュ関数を使用して独立して再計算される
    
3.  `H′ == proofHash` — エンベロープ値と比較される
    
4.  `proofHash ∈ R(tx)` — 生のトランザクションレシートで確認される
    
5.  `agentId` は `agentIdScheme` に従って解決されます: `0x01` の場合、解決はERC-8004を介して行われます。`0x02` の場合、`agentId` は `keccak256(正規のエージェントURI)` です。`0x00` の場合、アイデンティティ解決は適用されません。
    

**結果:** ダイジェストがエージェントのアイデンティティ参照の下でオンチェーンにコミットされたことを示す、独立したシステムに依存しない証明。特定のエージェントへの帰属は、検証者が使用するERC-8004 / ERC-8263のアイデンティティおよびオペレーターバインディングルールに依存します。

* * *

## **各標準が**しない**こと**

| 標準 | 範囲外 |
| --- | --- |
| ERC-8004 | コミットメントや検証を定義しない |
| ERC-8263 | 検証手順や証明形式を定義しない |
| OCP | アイデンティティ、作成者、サニタイゼーション、またはデータアベイラビリティを定義しない |
| HBS | アイデンティティ、コミットメント、または検証を定義しない — 証明のみを伝達する |

* * *

## **注記: 永続性レイヤー（非規範的）**

上記で説明したコアスタック — エージェントのアイデンティティのためのERC-8004、オンチェーンコミットメントのためのERC-8263、および独立したダイジェスト検証のためのOCP — は、プロトコル層と台帳層で動作します。Tiago Merliniと@wgw\_ethによる独立した作業から、補完的な永続性プリミティブが生まれました: HBS画像プロベナンス（来歴）埋め込みです。HBSは、アテステーション（証明）またはプロベナンスデータを画像ピクセルまたはPNGメタデータに直接エンコードすることでアーティファクト層で動作し、証明ペイロードがコントラクト、ゲートウェイ、またはアプリケーションを離れた後もアーティファクトと共に伝播できるようにします。HBSはアイデンティティ、コミットメント、または検証を置き換えるものではありません。埋め込まれたペイロードをポータブルにするものであり、完全な検証には、レジストリ解決やトランザクションインクルージョンチェックなどのパブリックチェーンデータが依然として必要となる場合があります。これは非規範的なオブザベーション（観察）です。HBSはコアの3層スタックの一部ではありませんが、バッジ、スコアカード、レポート、プロベナンス画像などのポータブルで自己記述的なアーティファクトを必要とする実装にとって、自然な拡張パスを示しています。

リファレンス: [hbs-attestation-poc](https://github.com/Echo-Merlini/hbs-attestation-poc)

* * *

## **アイデンティティ・センチネル**

サニタイゼーションパイプラインが適用されない場合、`sanitization_pipeline_hash` は IDENTITY\_SENTINEL でなければなりません。

```
8116eec29078e8f57c07077d5e8080a35bde73036581df3abb93755d1b1a16ea

```

アイデンティティ仕様のSHA-256。Tiago MerliniがERC-8263 ↔ ERC-8004のアラインメントスレッドで明らかにし、検証者がパススルーケースを明示的に処理できるようにここに文書化されています。検証者の分岐不変条件はERC-8263 v0.2 Appendix A.2に成文化されており、特定のSENTINEL値はプロファイルで宣言されます。

値 `8116eec29078e8f57c07077d5e8080a35bde73036581df3abb93755d1b1a16ea` はOCPプロファイル固有のSENTINELです。各プロファイルは、検証者が正しく分岐できるように、そのSENTINEL値を明示的に宣言すべきです。

検証者の分岐不変条件:

-   `sanitization_pipeline_hash == IDENTITY_SENTINEL` の場合 → `raw_input_hash` == `input_hash`、サニタイゼーション変換検証をスキップ
    
-   `sanitization_pipeline_hash != IDENTITY_SENTINEL` の場合 → サニタイゼーションパイプラインによって定義された変換を検証し、変換された入力が `input_hash` にハッシュされることを要求
    

この分岐を実装しない検証者は、パススルー実行を誤って拒否します。

* * *

## **クロスチェーン互換性**

OCPの証明エンベロープはチェーンに依存しません。同じフォーマットがEVMチェーンとSolana（2026年5月開発ネットで検証済み）で機能します。ERC-8263の製品アンカリングデプロイメント: Polygon、Base、BNB Smart ChainのメインネットとSepoliaテストネット。Polygon、Base、BNB Smart Chainのデプロイメントは、それぞれのチェーンエクスプローラーで検証されています。EthereumメインネットV1のリファレンスコントラクト（`0xe95d6a15...`）はEtherscanで検証されており、正規のリファレンスデプロイメントとして機能します。これはデフォルトのユーザーアンカーパスではありません。ERC-8004はEVMネイティブです。ERC-8263とERC-8004のクロスチェーンデプロイメントは、このノートの範囲外です。

* * *

## **リファレンス実装**

| 標準 | リファレンス |
| --- | --- |
| ERC-8004 | gateway.ensub.org · アテステーション: GET /agent/{registry}/{agentId}/attestations · センチネル対応検証者: GET /agent/verify/:inputHash · ライブ例: https://gateway.ensub.org/agent/verify/758d61f26a44448384e5c4468a0dcb7a2abe456067b0f7b505bc28b9411fe931 |
| ERC-8263 | truthanchor.biz · ETHメインネットV1: 0xe95d6a15…eb5ec3d (Etherscan完全一致、v0.8.19、オプティマイザーなし、MIT) · L2メインネット (Polygon/Base/BSC): 0x87dd3A56AFD0D2c488aD7E13fB036b59144b25dC (各チェーンエクスプローラーで検証済み) |
| OCP | GitHub - damonzwicker/observation-commitment-protocol: 特定のバイトシーケンスがパブリック台帳にコミットされたことを独立して検証するための最小限のプロトコル。 · GitHub |
| HBS | GitHub - Echo-Merlini/hbs-attestation-poc · GitHub |

OCP検証者: `npm install -g ocp-verify`

* * *

## **ERC-8004 リファレンス実行アテステーションプロファイル**

*Tiago Merliniと共同執筆。*

このセクションでは、ERC-8004、WYRIWE、OCP、およびEIP-712ゲートウェイアテステーションを中心に構築されたリファレンス実行アテステーションプロファイルについて説明します。これは、上記のコアERC-8004 / ERC-8263 / OCP構成表の代替ではありません。コア表は、「エージェントが何かをコミットし、誰もがそれを独立して検証できる」ために必要な最小限の構成を記述しています。ゲートウェイを介した実行（[gateway.ensub.org](http://gateway.ensub.org) のリファレンスデプロイメントパターン）を伴うERC-8004アイデンティティレジストリ上に構築されたデプロイメントの場合、より完全な4層ビューは、コア表が抽象化している追加の軸を表面化します。それは、ダイジェストがコミットされたかどうかとは別に、実行インフラストラクチャ自体がアクションをアテステーション（証明）するかどうかです。

| レイヤー | 仕様 | 役割 | 信頼モデル |
| --- | --- | --- | --- |
| L1 — アイデンティティ | ERC-8004 | エージェントは誰か — 登録済みトークン、正規ウォレット、解決可能なマニフェスト | オンチェーン、トラストレス |
| L2 — 入力信頼 | WYRIWE入力プロベナンスプロファイル（github.com/TMerlini/wyriwe, Appendix A.2）を備えたERC-8263 | エージェントが実際に受け取ったもの — raw_input_hash → サニタイゼーションパイプライン → input_hashバインディング。サニタイゼーションが適用されない場合のIDENTITY_SENTINELパススルー不変条件 | オフチェーンパイプライン、オンチェーンコミット済みハッシュ |
| L3 — コミットメント検証 | OCP | チェーンの状態のみからのinput_hashのトラストレスな検証 — 再計算 → 比較 → インクルージョン確認。SDKやゲートウェイは不要 | 完全なトラストレス、パブリックRPC |
| L4 — インフラストラクチャアテステーション | ERC-8004 getAgentWalletを介して解決されるゲートウェイキーによるEIP-712 InferenceAttestation | どのアクション実行インフラストラクチャがアクションを処理し署名したか — ゲートウェイがアテスターであり、エージェント自身が署名するのではない。L3/L4のギャップは構造上可視化される | インフラストラクチャ信頼、ゲートウェイが公証人として |

### **なぜ4層目が必要か**

L3は「このダイジェストはこのエージェントのアイデンティティの下でコミットされたか？」というトラストレスな問いに答えます。L4は「この特定の実行インフラストラクチャが、ダイジェストを生成した入力を処理したか？」という、L3が意図的に抽象化したインフラストラクチャ信頼に関する問いに答えます。

L4を明示的に表面化することで、2つのことが可能になります。

**L3/L4のギャップを読み取り可能にします。** 「ダイジェストがコミットされた」ことだけが必要な検証者はL3で停止します。「そして、指定されたゲートウェイが処理をアテステーションした」ことが必要な検証者はL4に進みます。このギャップは欠陥ではなく、透明性のシグナルです。L4なしでL1〜L3をデプロイする実装は、インフラストラクチャアテスターにコミットしないことを選択しており、その選択が可視化されます。

**自己署名と公証人署名を分離します。** ゲートウェイキーがERC-8004 getAgentWalletを介してバインドされる場合、アテステーションはインフラストラクチャによって署名され、エージェント自身によって署名されるわけではありません。これは実用的なデプロイメントの形態と一致します。エージェントは永続的なキーを保持せず、ゲートウェイが保持します。

### **このプロファイルがそうでないもの**

ERC-8263、ERC-8004、またはOCPへの規範的な追加ではありません。3つのコア標準は変更されず、このプロファイルはそれらを構成するものです。

すべてのERC-8263デプロイメントがL4アテステーションを伴うことを義務付けるものではありません。L4アテステーションのないアンカーも、標準のL1〜L3信頼モデルを持つ有効なERC-8263アンカーです。

ERC-8263の完全なプロファイルスペースと同等ではありません。WYRIWEは、ERC-8263 v0.2のAppendix A.2に文書化されている3つのプロファイル（単一のオブザベーションダイジェストプロファイルとマークルバッチルートプロファイルと共に）の1つです。上記のL2の入力信頼の枠組みは、WYRIWEプロファイルが使用されている場合に特に適用されます。

### **リファレンス実装**

L1 + L4バインディング: `GET gateway.ensub.org/agent/{registry}/{agentId}/attestations` は、ERC-8004 getAgentWalletを介して解決されたゲートウェイキーの下で署名されたEIP-712 InferenceAttestationペイロードを返します。

L2 + L3検証: `GET gateway.ensub.org/agent/verify/:inputHash` ([ライブ例](https://gateway.ensub.org/agent/verify/758d61f26a44448384e5c4468a0dcb7a2abe456067b0f7b505bc28b9411fe931)) は、オンチェーンのERC-8263アンカーに対して再計算 → 比較 → 確認のパスを実行します。

* * *

## **関連する将来の拡張**

以下は現在活発に開発中であり、安定し次第、このノートの将来の改訂版で参照される予定です。

-   **ERC-8274** — AI推論証明検証インターフェース (Jimmy Shi): ERC-8263の上位にあるコントラクト向けIProofVerifierインターフェース層
    
-   **ERC-8275** — エージェントサービスディスカバリ + エスクロー (Panini): L3/L4スタックを利用するディスカバリと証明または返金エスクロー
    
-   **BountySettlement** — input_hashをキーとするリファレンスオンチェーンバウンティ決済コントラクト (Tiago Merlini + Jimmy Shi): [gist.github.com/TMerlini/bf3abd30c332cccb257d0e5bdff1ff95](https://gist.github.com/TMerlini/bf3abd30c332cccb257d0e5bdff1ff95)
    

* * *

-   @wgw\_eth — HBS / 永続性アラインメント

* * *

## **ステータス**

公開準備完了 — 3人の共同執筆者全員が確認済み。ERC-8004リファレンス実行アテステーションプロファイルセクションを組み込み済み (Vincent Wu + Tiago Merlini)。ERC-8263 v0.2稼働中 (PR #1748, 9/9 CIグリーン)。WYRIWE ERCドラフト稼働中 ( [GitHub - TMerlini/wyriwe: WYRIWE — What You Read Is What You Execute: input-provenance profile for verifiable AI inference · GitHub](http://github.com/TMerlini/wyriwe) )。ERC-8274 v0.1稼働中 (PR #1771)。このノートは仕様の進化に合わせて更新されます。これは実装者向けの生きたリファレンスとして意図されており、規範的なドキュメントではありません。

* * *

*[GitHub - damonzwicker/observation-commitment-protocol: 特定のバイトシーケンスがパブリック台帳にコミットされたことを独立して検証するための最小限のプロトコル。 · GitHub](http://github.com/damonzwicker/observation-commitment-protocol)*

*2投稿 - 2参加者*

[トピック全体を読む](https://ethresear.ch/t/composition-note-erc-8004-erc-8263-ocp-a-reference-guide-for-implementers-building-on-the-ai-agent-verification-stack/24995)
