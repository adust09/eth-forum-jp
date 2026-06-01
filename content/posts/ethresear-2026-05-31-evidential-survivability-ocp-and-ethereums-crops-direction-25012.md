---
title: 証拠の生存可能性：OCPとEthereumのCROPS方向性
original_title: 'Evidential Survivability: OCP and Ethereum''s CROPS Direction'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/evidential-survivability-ocp-and-ethereums-crops-direction/25012
author: DamonZwicker
date: '2026-05-31'
category: Architecture
tags:
  - architecture
  - ai-agents
  - verification
  - security
  - decentralization
  - protocol-design
  - research
  - evidential-survivability
  - ocp
topic_id: '25012'
translated_at: '2026-06-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Evidential Survivability: OCP and Ethereum's CROPS Direction](https://ethresear.ch/t/evidential-survivability-ocp-and-ethereums-crops-direction/25012) — DamonZwicker (2026-05-31)

# 証拠の生存可能性：OCPとEthereumのCROPS方向性

## AI時代のための独立検証インフラストラクチャ

**デイモン・ズウィッカー — 2026年5月**

---

## 概要

Ethereumは、より速く、より安価な実行環境としてではなく、AI駆動の世界のための耐久性のある公共インフラストラクチャとして、その位置付けを強めています。ヴィタリック・ブテリンは、Ethereumの長期的な軌道における基盤的優先事項として、検閲耐性 (censorship resistance)、オープン性 (openness)、プライバシー (privacy)、セキュリティ (security) — 彼がCROPS次元と表現するもの — を強調するEthereum Foundationの方向性を明確に示しました。

同時に、AIシステムは受動的なツールから、動的な実行、委任された意思決定、機械間経済協調が可能な自律的な運用アクターへと進化しています。この収束は新たなインフラストラクチャ上の問題を生み出します。すなわち、元のシステム、ベンダー、オーケストレーション層、または実行環境が変更された後も、観測、アクション、コミットメントがどのように独立して検証可能であり続けるかという問題です。

[[glossary/Observation-Commitment-Protocol|Observation Commitment Protocol (OCP)]]は、AIガバナンスフレームワーク、実行環境、またはランタイム制御システムではありません。それは、より狭いインフラストラクチャの役割、すなわち独立検証を定義します。本稿では、OCPが、EthereumのCROPS方向性がますます必要とする、狭く、公開され、独立して検証可能なインフラストラクチャの一例であり、この整合性が今日の公開実装ですでに確認できると主張します。

---

## Ethereumの公共インフラストラクチャへの移行

Ethereumの新たな方向性は、プロトコルの長期的な重要性がトランザクション量や実行スループットからではなく、ますます自律的になるシステムのための信頼のアンカーおよび協調基盤となることから派生するという判断を反映しています。

CROPSフレームワーク — [[glossary/censorship-resistance|検閲耐性]]、オープン性 (openness)、[[glossary/privacy|プライバシー]]、[[glossary/security|セキュリティ]] — は、敵対的な状況、制度的変化、時間の経過の下でも信頼できるインフラストラクチャを構築するというコミットメントを表しています。ブテリンはこの方向性について明確に述べています。「Ethereumは、異なる次元、すなわちCROPS次元において、深く印象的なものとなるよう最も努力すべきだと私は考えています。」これは、運用上の利便性や短期的なパフォーマンス指標に最適化されたシステムとは根本的に異なる目的です。それは、Ethereumが提供できる最も重要な特性が速度ではなく、**生存可能性 (survivability)** — それらを生み出したシステムが変更または消失した後も、記録、コミットメント、および証明が独立して検証可能であり続ける能力 — であることを意味します。

これこそが、AI時代において最も価値のあるインフラストラクチャ特性です。AIシステムは、意思決定、観測、推奨、および自律的な経済行動をますます生成します。これらのシステムがより高性能になり、結果に影響を与えるプロセスに深く組み込まれるにつれて、その証拠履歴の完全性と[[glossary/evidential-survivability|証拠の生存可能性]]は、技術的だけでなく、法的、規制的、制度的にも最優先事項となります。

---

## 検証の危機

現代のガバナンスアーキテクチャは、すでに階層化された可視性システム、すなわちダッシュボード、監視フレームワーク、ポリシーエンジン、アテステーションシステム、ランタイム制御に依存しています。これらのシステムは、運用中の動作を管理するかもしれません。しかし、実行中の運用上の可視性は、後で独立して生存可能な説明責任とは異なります。

時間が経つにつれて、システムは訴訟、監査、規制当局の監視、敵対的レビュー、ベンダーの交代、インフラストラクチャの移行、またはプラットフォームの完全な障害に遭遇します。その時点で、組織は、運用中にシステムを監視する能力が、後で何が起こったかを独立して再構築する能力を保証しないことを発見します。

このギャップは、実行パスが動的に進化し、委任チェーンが断片化し、運用状態が一時的にしか存在しない確率的AIシステムにおいて、より深刻になります。AI時代は、新たなインフラストラクチャ上の課題を導入します。それは、[[glossary/evidential-survivability|証拠の生存可能性]] — コミットメントがそれを作成したインフラストラクチャよりも長く存続する能力 — です。

独立した検証境界がなければ、コミットメントはそれらを作成したシステムに暗黙的に縛られます。それらのシステムが変更されると、コミットメントの検証可能性もそれに伴って変化します。これはガバナンスの失敗ではありません。アーキテクチャ上の失敗です。

---

## OCPの狭い役割

[[glossary/Observation-Commitment-Protocol|Observation Commitment Protocol (OCP)]]は、意図的にその範囲を制限しています。真実、作者、ガバナンス、意図、またはAIアライメントを解決しようとはしません。それは、より狭い問いを分離します。

> コミットされたダイジェストは、元のプラットフォーム、SDK、ゲートウェイ、ベンダー、またはオーケストレーション環境に依存することなく、独立して再計算され、公開台帳の状態と照合してチェックできるか？

その検証不変条件は、設計上最小限です。

```
再計算 → 比較 → インクルージョンの確認
```

検証は公開台帳の状態に対して直接行われます。信頼されたダッシュボードは必要ありません。信頼されたゲートウェイは必要ありません。信頼されたSDKは必要ありません。信頼されたインデクサーは必要ありません。検証者は、公開RPCエンドポイントと元の観測バイトのみを必要とします。

OCPはチェーンに依存しませんが、EthereumのCROPS方向性は、この種の検証プリミティブにとって最も明確な哲学的拠点の1つを提供します。

---

### OCPが主張しないこと

> OCPは、観測が真実であることを証明しません。
>
> OCPは、アクターが認可されていたことを証明しません。
>
> OCPは、AIの決定が正しかったことを証明しません。
>
> OCPは、データアベイラビリティ (data availability) を保証しません。
>
> OCPは、ダイジェストが独立して再計算され、オンチェーンの公開コミットメントと一致することを証明します。

この境界は意図的であり、交渉の余地がありません。これにより、OCPは、アイデンティティシステム、ガバナンスフレームワーク、アテステーション層と、それらのセマンティクスを吸収することなく構成可能になります。

---

## CROPSとOCP：アーキテクチャの整合性

### [[glossary/censorship-resistance|検閲耐性]]

一度コミットされると、ダイジェストは公開台帳の状態を通じて独立してチェック可能であり続けます。検証は、元のアプリケーション、ベンダー、ゲートウェイ、または機関が利用可能であることに依存しません。これこそが、[[glossary/censorship-resistance|検閲耐性]]が実際に意味することです。敵対者の不在ではなく、単一のアクターが事後にコミットメントの検証可能性を取り消す構造的な不能性です。

### オープン性 (Openness)

OCP検証は公開で再計算可能です。公開チェーンデータにアクセスできる検証者は誰でも、ダイジェスト、インクルージョン、およびトランザクションのリンクを独立して確認できます。許可された検証層、APIキー、SDKへの依存は必要ありません。検証手順は、公開データに適用される公開アルゴリズムです。アルゴリズムに従う任意の実装は、同じ結果を生成します。

### [[glossary/privacy|プライバシー]]

OCPはプライベートデータを公開しません。基礎となるデータを開示することなく、公開コミットメントが存在することを可能にします。コミットメント自体 — オンチェーンに固定されたダイジェスト — は、それが表す観測について何も明らかにしません。[[glossary/privacy|プライバシー]]は、後で何が開示されるかに依存します。検証には関連する観測バイトが必要ですが、コミットメントはそれらなしで無期限に存在できます。これにより、機密性の高い入力で動作するシステムにとって意味のある、検証能力とデータ開示の分離が生まれます。

### [[glossary/security|セキュリティ]]

OCPは信頼される表面を最小限に抑えます。検証者は、独自のAPI、集中型ダッシュボード、ゲートウェイ、SDK、または運用ベンダーを信頼する必要がありません。これにより、検証は敵対的な状況下で実質的に回復力が高まります。元のシステム、ゲートウェイ、またはSDKを侵害する攻撃者は、オンチェーンコミットメントを遡及的に無効にすることはできません。コミットされたダイジェストは、公開台帳の状態を通じて独立してチェック可能であり続けるからです。

---

## モジュラーな信頼アーキテクチャ

AI時代に現れる最も重要なアーキテクチャ上の変化の1つは、信頼を独立したインフラストラクチャ層に分解することです。ますます、本番システムは、アイデンティティ、コミットメント、検証、ガバナンス、および実行の許容性を、単一のプラットフォーム信頼仮定に集約するのではなく、構成可能なコンポーネントに分離しています。

これは、3カ国の4つのビルダー間の共同作業から生まれたスタックに現れています。

| レイヤー | 標準 | 答える質問 |
|---|---|---|
| アイデンティティ | [[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]] | エージェントは誰か？ |
| 入力信頼 | [[glossary/WYRIWE|WYRIWE (What You Read Is What You Execute)]] / [[glossary/ERC-8263|ERC-8263 (オンチェーン証明レイヤー)]] プロファイル | エージェントは実際に何を受け取ったか？ |
| コミットメント | [[glossary/ERC-8263|ERC-8263 (オンチェーン証明レイヤー)]] | オンチェーンで何がコミットされたか？ |
| 検証 | [[glossary/Observation-Commitment-Protocol|OCP]] | コミットメントはチェーンの状態のみから独立して検証できるか？ |
| インターフェース | ERC-8274 | 任意のコントラクトが証明を消費できるか？ |

各レイヤーは、実質的に異なる質問に答えます。それぞれが独立して指定されています。どれも他のセマンティクスを吸収しません。

この分離が重要なのは、ガバナンスシステム自体が最終的に制度的漂流、インフラストラクチャの置き換え、敵対的挑戦、および運用上の劣化の対象となるからです。独立した検証境界がなければ、ガバナンスアーキテクチャは、その完全性が単に信頼されなければならない不透明な権威システムに崩壊するリスクがあります。OCPは検証境界 — コミットされたものが独立してチェックできるという構造的な保証 — を提供し、その上でガバナンスシステムはより自信を持って運用できます。

---

## 実証的な証拠

これは理論的な整合性だけではありません。このスタックは、すでに公開実装で確認できます。

[[glossary/ERC-8263|ERC-8263]] v0.2は、その検証免責事項においてOCPの境界ステートメントを逐語的に引用しています。検証不変条件は、アクティブなEthereum標準（PR #1748, ethereum/ERCs）の付録A.2で正式に成文化されています。2026年5月現在、742を超える証明が4つのチェーンに固定されています。2026年5月にBase Sepoliaでライブの[[glossary/AI-agent-verification-stack|AIエージェント検証スタック]]のバウンティが決済されました — オラクル、仲介者、信頼された第三者はなく、アイデンティティ、入力の来歴 (input provenance)、コミットメント、検証、およびゲートウェイアテステーション層がエンドツーエンドで実行されました。

ERC-8274（AI推論証明検証インターフェース、PR #1771）は、zkML、opML、[[glossary/Trusted-Execution-Environment|TEE]]、オラクル (oracle)、およびマルチシグ (multisig) バックエンド全体を統一する検証プリミティブとしてOCPを挙げています。Vincent Wu（[[glossary/ERC-8263|ERC-8263]]）、Damon Zwicker（[[glossary/Observation-Commitment-Protocol|OCP]]）、Tiago Merlini（[[glossary/ERC-8004|ERC-8004]] / [[glossary/WYRIWE|WYRIWE]]）が共同執筆したコンポジションノートは、レイヤーがどのように構成されるかを文書化しており、ethresear.chで公開されています。完全な参考文献は付録にあります。

EthereumのCROPS方向性が求めるアーキテクチャは、将来の開発を待っているわけではありません。それは今日存在し、公開インフラストラクチャ上で動作し、公開RPCエンドポイントを持つ誰でも検証可能です。

---

## なぜ狭いシステムが重要なのか

OCPは、EthereumのCROPS方向性が必要とするインフラストラクチャのクラスの一例です。それは、ガバナンス、アイデンティティ、またはアプリケーションのセマンティクスを吸収することなく、耐久性のある保証を提供する、狭く、公開され、独立して検証可能なプリミティブです。

Ethereumは、モジュール性、信頼できる中立性、最小化された信頼仮定、および制約されたプロトコルスコープをますます重視しています。OCPも同じアーキテクチャ規律に従います。ガバナンス、実行制御、アイデンティティセマンティクス、または制度的権限を吸収しようとはしません。

この狭さは回復力戦略です。あまりにも多くの責任を吸収しようとするシステムは、しばしば中央集権的で不透明、政治的に脆弱になり、独立して検証することが困難になります。制約されたシステムは、敵対的な状況下で推論しやすくなります。監査しやすく、構成しやすく、信頼しやすいのは、信頼すべきものが少ないからです。

システムが確率的で自律的であり、予測が困難なAI時代において、プリミティブが何をするか、何をしないかについて明確に推論する能力はますます価値が高まります。アイデンティティも処理する検証レイヤーは、検証のみを処理するレイヤーよりも信頼しにくいです。ガバナンスも処理するコミットメントレイヤーは、両方の機能を独立して監査することを困難にする絡み合いを導入します。

分解こそがアーキテクチャなのです。

---

## 結論

EthereumのCROPS方向性は、自律システム、確率的計算、制度的中央集権化、および機械規模の協調によってますます形成される時代において、信頼できる公共インフラストラクチャを維持しようとする試みを反映しています。Ethereumが提供できる最も重要な特性は、実行速度ではありません。それは[[glossary/evidential-survivability|証拠の生存可能性]]です。すなわち、コミットメントがそれらを生み出したシステムよりも長く存続する能力です。

OCPは、この方向性が必要とする、狭く、公開され、独立して検証可能なインフラストラクチャの一例です。それは、何が真実か、何が許可されているか、誰が責任を負うかには答えません。それは、コミットされたダイジェストが、誰でも、いつでも、どのクライアントからでも、それを作成したシステムを信頼することなく、独立して再計算され、公開台帳の状態と照合できるかどうかに答えます。

独立検証はAIアライメント問題を解決しません。ガバナンスに取って代わるものでもありません。それは両方の基盤を提供します。

それは小さなことではありません。自律計算の時代において、それはインフラストラクチャが提供できる最も重要な特性の1つかもしれません。

---

## 参考文献および証拠付録

**CROPS / EFの方向性（主要情報源）**

- Vitalik Buterin, 2026年5月: [x.com/VitalikButerin/status/2058583593102844111](http://x.com/VitalikButerin/status/2058583593102844111)

**[[glossary/Observation-Commitment-Protocol|OCP]]**

- 仕様: [GitHub - damonzwicker/observation-commitment-protocol: A minimal protocol for independently verifying that a specific byte sequence was committed to a public ledger. · GitHub](http://github.com/damonzwicker/observation-commitment-protocol)
- ethresear.ch掲載: ethresear.ch/t/observation-commitment-protocol-ocp-v1-0-0/24602
- npmパッケージ: [npmjs.com/package/ocp-verify](http://npmjs.com/package/ocp-verify) (ocp-verify@1.1.0)
- Base Sepoliaコントラクト: 0x0963Fd33DF80c94360F2DC22e5c09517AeE7ED5c
- Solana devnet: GCXRKzreL2fdYBpnfmKzFqTxE46eGmwQuErMw4uZ1DUL

**[[glossary/ERC-8263|ERC-8263]] v0.2（OCP境界の引用）**

- PR #1748: [Add ERC: Onchain Proof Layer for AI Agents by TruthAnchor-AI · Pull Request #1748 · ethereum/ERCs · GitHub](http://github.com/ethereum/ERCs/pull/1748)
- ETHメインネットコントラクト: 0xe95d6a15966984c209a62a2c188828555eb5ec3d (Etherscan Exact Match)
- L2メインネット（Polygon/Base/BSC）: 0x87dd3A56AFD0D2c488aD7E13fB036b59144b25dC

**ERC-8274（OCPを統一プリミティブとして）**

- PR #1771: [Add ERC: AI Inference Proof Verification Interfaces by JimmyShi22 · Pull Request #1771 · ethereum/ERCs · GitHub](http://github.com/ethereum/ERCs/pull/1771)
- Ethereum Magiciansスレッド: [ethereum-magicians.org/t/erc-8274-ai-inference-proof-verification/28083](http://ethereum-magicians.org/t/erc-8274-ai-inference-proof-verification/28083)

**[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]**

- Ethereum Magiciansスレッド: [ethereum-magicians.org/t/erc-8004-trustless-agents/25098](http://ethereum-magicians.org/t/erc-8004-trustless-agents/25098)
- 参照実装: [gateway.ensub.org](http://gateway.ensub.org)

**[[glossary/WYRIWE|WYRIWE (What You Read Is What You Execute)]]**

- ERCドラフト: [GitHub - TMerlini/wyriwe: WYRIWE — What You Read Is What You Execute: input-provenance profile for verifiable AI inference · GitHub](http://github.com/TMerlini/wyriwe)
- Ethereum Magiciansスレッド: [ethereum-magicians.org/t/wyriwe-what-you-read-is-what-you-execute-input-provenance-for-verifiable-ai-inference/28655](http://ethereum-magicians.org/t/wyriwe-what-you-read-is-what-you-execute-input-provenance-for-verifiable-ai-inference/28655)

**コンポジションノート（Wu / Zwicker / Merlini）**

- ethresear.ch: ethresear.ch/t/composition-note-erc-8004-erc-8263-ocp-a-reference-guide-for-implementers-building-on-the-ai-agent-verification-stack/24995
- Gist: [composition-note-8004-8263-ocp.md · GitHub](http://gist.github.com/damonzwicker/8742e742bdc627b8e2179c00b81289dc)

**ライブバウンティ決済 — Base Sepolia, 2026年5月**

- コントラクト: 0x57fe09a6Eb8d5741b24fF640AA8Bc4D2010B93D7
- クレームトランザクション: [Base Transaction Hash: 0x2780f94d11... | BaseScan Sepolia](http://sepolia.basescan.org/tx/0x2780f94d11ad3766e7d370b1016d3ba917933f8111ddd42d3fcab2226cd380e4)
- 検証エンドポイント: [gateway.ensub.org/agent/verify/758d61f26a44448384e5c4468a0dcb7a2abe456067b0f7b505bc28b9411fe931](http://gateway.ensub.org/agent/verify/758d61f26a44448384e5c4468a0dcb7a2abe456067b0f7b505bc28b9411fe931)
- コントラクトソース: [BountySettlement.sol — ERC-8263 / ERC-8274 / OCP proof-of-concept. Verifies L4 EIP-712 InferenceAttestation on-chain, releases bounty if valid. Reference implementation for IProofVerifier.verify() pattern (ERC-8274). Deployed on Base Sepolia: 0x57fe09a6Eb8d5741b24fF640AA8Bc4D2010B93D7 · GitHub](http://gist.github.com/TMerlini/bf3abd30c332cccb257d0e5bdff1ff95)

**OCP議論先 (Ethereum Magicians)**

- [ethereum-magicians.org/t/draft-erc-observation-commitment-protocol-ocp-chain-agnostic-cryptographic-commitment-primitive/28399](http://ethereum-magicians.org/t/draft-erc-observation-commitment-protocol-ocp-chain-agnostic-cryptographic-commitment-primitive/28399)

*1件の投稿 - 1人の参加者*

[トピック全文を読む](https://ethresear.ch/t/evidential-survivability-ocp-and-ethereums-crops-direction/25012)
