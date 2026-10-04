---
title: '[ドラフトERC] エージェント集合意思決定フレームワーク (ACDF) — 手続き的ファイナリティを持つ、認可され構成可能な集合意思決定'
original_title: >-
  [Draft ERC] Agent Collective Decision Framework (ACDF) — authorized,
  composable collective decisions with procedural finality
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-erc-agent-collective-decision-framework-acdf-authorized-composable-collective-decisions-with-procedural-finality/29850
author: garyyang-finchip
date: '2026-10-04'
category: ERCs
tags:
  - ercs
  - protocol-design
  - governance
  - smart-contracts
  - applications
  - ai-agents
  - mechanism-design
topic_id: '29850'
translated_at: '2026-10-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [[Draft ERC] Agent Collective Decision Framework (ACDF) — authorized, composable collective decisions with procedural finality](https://ethereum-magicians.org/t/draft-erc-agent-collective-decision-framework-acdf-authorized-composable-collective-decisions-with-procedural-finality/29850) — garyyang-finchip (2026-10-04)

皆さん、こんにちは。

これは、**エージェント集合意思決定フレームワーク (ACDF)** の[[glossary/Draft|ドラフト]][[glossary/ERC|ERC]]です。これは、資格のある参加者（エージェント、人間、またはコントラクト）が、明示的な認可の下、レジストリが実行するまさにそのパラメータとして固定されたルールに基づいて、定義された効果を持つ集合的な意思決定を形成するための、共同デプロイ可能な2つのレジストリです。

リポジトリ（設計メモ、リファレンス実装、テスト、ベクトル）：[GitHub - garyyang-finchip/acd-framework: Agent Collective Decision Framework（ACDF） · GitHub](https://github.com/garyyang-finchip/acd-framework)
[[glossary/ERC|ERC]]テキスト：そのリポジトリ内の`ERCS/erc-acdf.md`（`ethereum/ERCs`へのプルリクエストは後ほど提出予定。リンクはここに追記されます）。

## このフレームワークが埋める隙間

いくつかの[[glossary/AI-agents|エージェントエコノミー]]標準は、*意思決定*が必要となるまさにその時点で、単一の信頼されたアドレスで停止してしまいます。例えば、`ERC-8183`の`evaluator`、トークン結合型タスクテンダーのドラフト (`ERC-8414`) の`acceptanceAuthority`、`ERC-792`系統の仲裁人などです。`ERC-8033`は情報クエリのための特定の評議会フローを標準化しています。ガバナーは単一の有権者と単一の重み付けを前提としており、Safeは名簿にK-of-Nの閾値を与えますが、質問、結果記録、または*意思決定なしに*終了する可能性のある手続きという概念を持っていません。

`ACDF`は、これらの隙間が待ち望んでいたものです。それは、**どのルール**が**どの主題**について**どの質問**を決定し、**誰が事前に**結果を受け入れることに**コミットしていたか**、手続きがオープン、暫定的、または最終的であるか、そしてそもそも意思決定で終わったかどうか、という相互運用可能な記録です。

## 仕様内容

-   **意思決定ポリシー (Decision Policy)** — 不変でコンテンツアドレス指定可能な`PolicySpec` (`policyId = keccak256(abi.encode(spec))`)：構成員、閾値、構成グラフ、期間、異議申し立てルール。公開されたルールと実行されるルールは同じオブジェクトであり、プロキシ、管理者リスト、コードハッシュ引数は不要です。バージョンは*ポリシーファミリー*を通じてリンクされ、その更新権限のみが次のバージョンを公開します。公開は以前のバージョンに紐づく問題には決して影響しません。
-   **問題 (Issue)** — 1つの具体的な意思決定：主題 + 質問 + ポリシーバージョン + 最大1つの*コンシューマー*（依存コントラクト）。3つの承認モードがあり、すべてコンシューマーの行為です：`CONSUMER_FILED`（依存コントラクトが申請）、`STANDING_ACCEPTANCE`（受け入れるものを事前に宣言。リストされた申請者がその範囲内で申請）、`POST_ACK`（誰でも申請できるが、指名されたコンシューマーは承認と投票**前**に確認する必要がある — そうでない場合、問題は*諮問 (Advisory)*としてのみ進行し、諮問問題はアップグレードできません）。`(consumer, subject, question)`ごとに未完了のバインディング問題は1つのみ：評決ショッピングなし。
-   **構成員 (Bodies)** — 固定名簿のK-of-N（オンチェーン投票、または誰でも中継できる[[glossary/EIP-712-attestation-profile|EIP-712]]署名済み投票、コントラクト投票者向け[[glossary/ERC-1271|ERC-1271]]、[[glossary/nonce|ナンス]]なし — アイデンティティが唯一のキー）および認可された提出者。`ALL / ANY / K-of-M / VETO`による**四値**セマンティクス（保留 / 賛成 / 反対 / 決定なし）での**構成 (Composition)**：2つのチャンバーはロジックによって構成され、投票をプールすることはありません。また、有効な拒否権期間は早期決済によって消滅することはありません。
-   **ファイナリティ (Finality)** — 手続きの状態（`申請済み → 決定中 → 暫定的 → 最終`）、結果タイプ（`なし / 決定済み / 決定なし`）、および制定ステータスは3つの独立した次元です。最終は終端状態です。異議申し立ては同じポリシーの下で全ての構成員を再構築します。定足数に達しなかった異議申し立てラウンドは、異議申し立てされている決定を**維持します**（`sourceRound` ≠ `roundCount`）。異議申し立て期間は、投票が結果を決定した瞬間から始まり、決済トランザクションからではありません。
-   **カーネルでの実行なし** — レジストリは資産を移動しません。依存コントラクトは`Final × Decided`を読み取り、自身のコミットされた効果を強制します。`NoDecision`は、コンシューマーが事前にコミットした処分のみをトリガーします（タスクテンダーの場合：何もしない — テンダー自身の「[[glossary/Silence-pays-the-fulfiller|沈黙は履行者への支払いとなる]]」デフォルトが適用されます）。

最小限の適合性は、固定名簿のK-of-N投票です。構成、署名済み投票、認可された提出者、および異議申し立ては、同じオブジェクトに対する規範的オプションのプロファイルです。適格性プロファイル（例：[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]アイデンティティと[[glossary/Know-Your-Agent-Framework|KYAフレームワーク]]スタイルの信頼アサーション、私の他のドラフトにある`ERC-8419` / `ERC-8434`）、選定、重み付け、非バイナリ結果、エグゼキューター、手数料、プライバシー、クロスチェーン伝送は明示的に**予約されており**、指定されていません。

## 現状

-   リファレンス実装（[[glossary/Solidity|Solidity]] 0.8.24、アップグレード不可）：`ACDFPolicyRegistry` (9.6 KB)、`ACDFRegistry` (23.5 KB、[[glossary/EIP|EIP]]-170準拠、via-IR使用)、`ACDFTaskTenderAdapter`。
-   8つのスイートにわたる119の[[glossary/Foundry|Foundry]]テストは以下をカバーしています：最小集計のエッジケースとポリシー検証；承認モード、凍結、引き出し、義務ルール；「決済順序に依存しない結果」を含む全ての構成ブランチ；ラウンド、異議申し立て、採用ルール、厳格な期限、以前のラウンドの署名のリプレイ；[[glossary/ERC-1271|ERC-1271]]と可鍛性署名を含む署名済み投票の検証；そして**ベンダー提供の実物**タスクテンダーカーネルに対するエンドツーエンドアダプター実行（承認はワーカーに支払い、拒否は予約を解除、`NoDecision`は`claimUnjudged`を有効のままにし、遅延実行はカーネルによって拒否され、エポックペースの拒否後に再試行）。
-   クロス言語ベクトル：`ethers v6`で生成され、[[glossary/Solidity|Solidity]]で再導出された`policyId`と[[EIP-712-attestation-profile|EIP-712]]ダイジェスト；ルールの独立した`JS`実装によって生成された83行のK-of-Nおよび192行の構成真理値表。

まだ：[[glossary/Sepolia|Sepolia (テストネット)]]へのデプロイ。これは次のステップであり、完了次第、アドレス、ソースバージョン、ランタイムコード、およびエンドツーエンドケースのトランザクションをここに投稿します。それまでは、メモにある2つの作業済みケースは「設計ケースの検討結果」であり、「オンチェーンでテスト済み」ではありません。

## フィードバックをいただきたい質問

1.  **義務の粒度 (Obligation granularity)**。カーネルは`(consumer, subject, question)`に対して「1つの有効なバインディング問題」をキーとしています。これは適切なレベルでしょうか、それともカーネルは`subject.dataHash`内のビジネスキーも固定し、アダプターに任せるべきではないでしょうか？
2.  **異議申し立てにおける採用ルール (Adoption rule on appeal)**。異議申し立てラウンドが`NoDecision`で終了した場合、以前の実質的な決定が採用されます。代替案（「再審理は以前の結果を無効にする」）は、将来の明示的な設定に委ねられています。これに異論はありますか？
3.  **拒否権のセマンティクス (VETO semantics)**。拒否権構成員における承認投票は拒否を意味し、明示的なブロックはクリアランスを意味し、沈黙はポリシーに応じてパススルーまたはクリアランスなしを意味し、ウィンドウが開いている限り、ターゲットに関わらずノードは保留状態のままです。スクリーニング評議会のユースケースで何か不足しているものはありますか？
4.  **[[glossary/nonce|ナンス]]なしの署名済み投票**。重複排除は（問題、ラウンド、構成員、投票者）ごとに行われます。2回目の署名は設計上無価値です。[[glossary/nonce|ナンス]]が依然として必要となるケースはありますか？
5.  **適格性 (Eligibility)**。カーネルは、名簿が承認時に固定され凍結されていることのみを要求します。レビューアは、この[[glossary/ERC|ERC]]に（アイデンティティ + 信頼アサーション、オペレーター上限、競合排除などの）適格性プロファイルを含めることを望みますか、それとも計画通り分離しておくべきでしょうか？

ありがとうございます — Gary

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/draft-erc-agent-collective-decision-framework-acdf-authorized-composable-collective-decisions-with-procedural-finality/29850)
