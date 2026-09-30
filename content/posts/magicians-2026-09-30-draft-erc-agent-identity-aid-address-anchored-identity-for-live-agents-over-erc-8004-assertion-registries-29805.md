---
title: 'ドラフトERC: エージェントID (AID) — ERC-8004とアサーションレジストリを介した、ライブエージェント向けアドレスアンカー型ID'
original_title: >-
  Draft ERC: Agent Identity (AID) — address-anchored identity for live agents,
  over ERC-8004 + assertion registries
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-erc-agent-identity-aid-address-anchored-identity-for-live-agents-over-erc-8004-assertion-registries/29805
author: garyyang-finchip
date: '2026-09-30'
category: ERCs
tags:
  - ercs
  - ai-agents
  - identity
  - smart-contracts
  - protocol-design
  - account-abstraction
  - security
  - ux
topic_id: '29805'
translated_at: '2026-09-30'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Draft ERC: Agent Identity (AID) — address-anchored identity for live agents, over ERC-8004 + assertion registries](https://ethereum-magicians.org/t/draft-erc-agent-identity-aid-address-anchored-identity-for-live-agents-over-erc-8004-assertion-registries/29805) — garyyang-finchip (2026-09-30)

**ドラフト:** [aid-standard/ERCS/erc-aid.md at main · garyyang-finchip/aid-standard · GitHub](https://github.com/garyyang-finchip/aid-standard/blob/main/ERCS/erc-aid.md) **提出バリアント（ethereum/ERCsに提出されるもの）:** [aid-standard/ercs-pr-package/ERCS/erc-9999.md at main · garyyang-finchip/aid-standard · GitHub](https://github.com/garyyang-finchip/aid-standard/blob/main/ercs-pr-package/ERCS/erc-9999.md) **リファレンス実装、スキーマ、ベクトル、リゾルバー、テスト:** [GitHub - garyyang-finchip/aid-standard: aid-standard for AI Agent · GitHub](https://github.com/garyyang-finchip/aid-standard) **ERCs PR:** (追加予定)

## 概要

エージェントID (AID) は、ブロックチェーンアドレスをアンカーとする[[Autonomous-Agent|自律エージェント]]のためのIDです。すべてのアドレスは「休眠状態のAID (dormant AID)」です。これは、[[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]エージェントがアドレスに一対一でバインドされ、ウィンドウ内の生存シグナル、およびエージェント自身のオンチェーン挙動によって、ライブエージェントがその背後で実証可能に動作する際に「アクティブ」になります。AIDは意図的に薄いオンチェーン層を追加し、その他のすべてについては既存のレジストリを構成します。その層の周囲で、決定論的な解決モデルを確立します。それは、**AIDドキュメント**であり、**ファセット**から構成され、それぞれに来歴クラス、有効期間ウィンドウ、ダイジェストまたはコミットメント、およびアクセスモードがタグ付けされています。これにより、アドレスのみを持つ誰もがエージェントの状態を導出し、そのプロファイルを組み立て、インデクサーを信頼することなくオンチェーンで各ファセットを再検証できます。

## 目的

[[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]は、エージェントにトークンIDでキー付けされた登録および評判チャネルを提供します。しかし、エージェントが生存しているか、登録がエージェントが実際にトランザクションを行うアドレスとどのように関連しているか、あるいは異種混合の信頼シグナル（フィードバック、信用スコア、監査、オンチェーン金融行動、スキルおよびタスク履歴）がどのようにして検証可能で時間制限のある単一の全体像にまとめられるかについては言及していません。ディスカバリ層（GoogleのAgentic Resource Discovery、DNSベースのエージェントレコード）は、DIDのような識別子を期待する信頼スロットを公開し、「それはどこにあるのか」という問いに答えます。AIDは、そのスロットに配置され、「それは生存しているか、誰であるか、どのように振る舞ったか」という問いに、オンチェーンでの再検証可能性をもって答えることを意図しています。

設計は4つの観察に基づいています。

-   **アドレスはすでに結合キーです。** [[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]レジストリおよびトークンに紐づくスキル/タスクコントラクトによって発行されるすべてのイベントは、実行中のアドレスを運びます。アドレスにアンカーを設定すれば、エージェントの履歴に追加の登録は不要です — それは導出されます。
-   **生存性はプロパティであり、フラグではありません。** 登録は一度行われるクレームです。AIDは「生存」を、決定論的なオンチェーン部分と1つの明示的なオフチェーンでの洗練を持つ4つの状態を持つステートマシンにします。
-   **信頼は減衰します。** 信用および行動プロファイルは、ウィンドウ内でのみ意味を持ちます。ウィンドウ化されていない信用は、単に推奨されないだけでなく、リゾルバーで拒否されます。
-   **金融行動は機密性が高いです。** 金融ファセットのデフォルトは、オンチェーンコミットメントと述語証明であり、平文は承認された当事者のみに提供されます。

## オンチェーンにあるもの（とないもの）

AIDレジストリは、アンカーによって承認されたレコードのみを保存します。具体的には、厳密に1つの[[ERC-8004|ERC-8004 (エージェントIDレジストリ)]] `(identityRegistry, agentId)` への**バインディング**（双方向で一対一が強制されます。アンカーはエージェントの`agentWallet`またはオーナーである必要があります。直接呼び出しまたは[[EIP-712-attestation-profile|EIP-712]] `bindWithSig`、[[ERC-1271|ERC-1271]]は[[Smart-Account|スマートアカウント]]用）、**ハートビート/生存期間ウィンドウ**、**ドキュメントURI + ダイジェスト**、**自己申告型ファセットポインタ**、および**リタイアメント**（不可逆的で、バインディングを解放し、後継者が同じエージェントを引き継ぐことができる、オプションの後継者ポインタ）です。オーナーはなく、アップグレードパスもなく、2つの不変な生存期間境界があります。

状態: `DORMANT → ACTIVE ⇄ STALE`、`→ RETIRED`。`state()`はオンチェーンデータ（バインディングが損なわれていない、`ownerOf`/`getAgentWallet`が依然としてアンカーを指している、`lastSeen + window >= now`）の純粋関数です。リゾルバーは正確に1つのダウングレードを追加します: 登録ファイル `"active": false` → `STALE`。ウォレットのドリフトまたはトークンの焼却は、AIDトランザクションなしで次回読み取り時に`STALE`に劣化します — IDは密かに転送できません。

その他のすべては複製ではなく構成されます:

| コンテンツ | 存在する場所 |
| --- | --- |
| 登録ファイル、エンドポイント、エージェントウォレット | [[ERC-8004|ERC-8004 (エージェントIDレジストリ)]] Identity Registry |
| 生のインタラクションごとのフィードバック、オープンな評価条件 (tag1) | [[ERC-8004|ERC-8004 (エージェントIDレジストリ)]] Reputation Registry |
| 集約された信用スコア、信頼レベル、監査、プロファイラ出力、[[zk|ZK]]述語 | アサーションレジストリ — ドラフトは必要な最小限のものを指定します（サブジェクト = account(chainId, anchor)、resolve/check、ハッシュ固定スキーム、ATTESTED/PROVEDモード、有効期限）。リファレンスレジストリはKnow-Your-Agent (KYA) Frameworkドラフトであり、記述されたとおりにそのインターフェースに一致します。 |
| スキル/タスク履歴 | トークンに紐づくスキルおよびタスク入札コントラクトイベントから役割別に導出される（情報提供目的） |

## ファセットと来歴

AIDドキュメントの各ファセットは、`facetType`（名前空間付きURI、オンチェーンキー [[keccak256-hash|Keccak-256ハッシュ]]）、`provenance`、`issuer`、`validUntil`（必須）、`digest`、`access`、`resolver`を運びます。来歴は、私が最も精査を望む部分です。なぜなら、「改ざん防止」は4つの異なる意味を持ち、その区別を隠すことが信頼システムが悪用される方法だからです。

| クラス | 生成元 | 保証 | 読者の義務 |
| --- | --- | --- | --- |
| SELF | アンカー | 整合性のみ | 検証済みとして提示されることはない |
| OBSERVED | ハッシュ固定アルゴリズムに基づくチェーンイベントから、誰でも | 再現可能 | 再計算または抜き打ちチェック |
| ATTESTED | 第三者発行者 | 発行者の説明責任 | 信頼できる発行者でフィルタリングする |
| PROVED | コミットメントに対するプルーバー | 暗号学的 | 証明を検証する |

コアファセットタイプ: `aid:core/identity/v1`、`aid:core/kya/v1`、`aid:finance/observed/v1`（頻度、ボリューム、方向、カウンターパーティ分散、レバレッジ、導出されたインテント — デフォルトアクセス [[zk|ZK]]）、`aid:behavior/*`（オープンな名前空間: ランタイム、スキル、業界、プロトコル、タスクトレイト）、`aid:skills/erc8338/v1`、`aid:tasks/erc8414/v1`、`aid:review/erc8004/v1`。アクセスモード `PUBLIC | GATED | ZK`。

## リポジトリの内容

-   `AIDRegistry.sol` リファレンス実装（依存関係なし；自己完結型[[EIP-712-attestation-profile|EIP-712]] / low-s ECDSA / [[ERC-1271|ERC-1271]]）、22の挙動テスト（双方向のバインディング一意性、状態遷移、ウォレットドリフト、焼却、ファセット、[[EOA|EOA (Externally Owned Account)]]およびERC-1271アンカー向けの`bindWithSig`（リプレイ/有効期限を含む）、リタイアメント+後継者、エンドツーエンドリゾルバー）
-   AIDドキュメント、ファセットエンベロープ、および5つのコアファセットコンテンツドキュメント用のJSONスキーマ
-   テストベクトル（facetTypeキー、JCSダイジェスト、[[EIP-712-attestation-profile|EIP-712]] `Bind`ダイジェスト、`account` subjectKey、interfaceId `0x72750a54`）およびリゾルバーフィクスチャ
-   規範的な7段階解決アルゴリズムを実装するリファレンスリゾルバー、RPCまたはフィクスチャモード

Sepoliaデプロイメントと動作例（KYAスレッドで使用されている[[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]デモエージェントのバインディング）が次に続きます。

## フィードバックをいただきたい質問

1.  **アンカー = アドレス、バインディングは厳密に一対一。** [[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]では1人のオーナーが多数のエージェントトークンを保有できますが、AIDは複数のトークンに分岐するIDは単一の[[Autonomous-Agent|エージェント]]のIDではないとし、複数のエージェントを持つオーナーはそれぞれに独自のウォレットまたはERC-6551アカウントを与えるべきであると述べています。この設計が破綻させる、1つのアンカーと多数のエージェント間の正当なケースはありますか？
2.  **「生存」のオンチェーン/オフチェーン境界。** `state()`は登録ファイルの`active`フラグ（オンチェーンでは読み取り不可）を無視し、リゾルバーはそれを単一のダウングレードとして適用します。1つの明示的な洗練が適切な量か、それとも`setMetadata`を介してフラグがオンチェーンにミラーリングされるべきでしょうか？
3.  **アサーションレジストリをハードな依存関係ではなくインターフェースとして扱うこと。** ドラフトは、特定のレジストリERCを要求する代わりに、最小限のものを指定します（サブジェクトエンコーディング、`resolve`/`check`、固定スキーム、2つのモード、有効期限）。これは緩すぎないか、それとも複数のレジストリが満たせる適切な形でしょうか？
4.  **必須の`validUntil`と、ウィンドウ化されていない信用の拒否。** 設計上厳格ですが、オープンエンドの有効性が正当に必要とされるファセットクラスはありますか？
5.  **命名。** どのERC提案も「Agent Identity (AID)」をその名称または頭字語として使用していませんが、「エージェントアイデンティティ」は他のエージェント提案で記述的に現れ、一部のエージェントレジストリは`aid`を識別子プレフィックスとして使用しています。DNSディスカバリプロジェクトは「Agent Identity & Discovery」に同じ頭字語を使用していますが、これら2つの層は補完的であり、互いを指すように設計されています。異論はありますか？
6.  **レジストリディスカバリ。** チェーンごとに1つのAIDレジストリがあり、リゾルバーが`chainId`のみからそれを見つけられるように決定論的なアドレスが推奨されます。DIDメソッド仕様（コンパニオン、`did:aid:eip155:{chainId}:{address}`）が代わりにチェーンごとのレジストリリストを保持すべきでしょうか？

コンテキスト: これは一連の4番目のピースです — ERC-8338（スキル供給側）、ERC-8414（タスク需要側）、ERC-8419（KYA信頼アサーション）、そして今やAIDは他の3つが依存するIDです。見落としているものと重複している箇所があれば、喜んでご指摘ください。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/draft-erc-agent-identity-aid-address-anchored-identity-for-live-agents-over-erc-8004-assertion-registries/29805)
