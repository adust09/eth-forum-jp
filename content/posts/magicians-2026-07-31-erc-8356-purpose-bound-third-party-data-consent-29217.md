---
title: 'ERC-8356: 利用目的拘束型第三者データ同意'
original_title: 'ERC-8356: Purpose-Bound Third-Party Data Consent'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8356-purpose-bound-third-party-data-consent/29217
author: duribebe
date: '2026-07-31'
category: ERCs
tags:
  - ercs
  - eip
  - privacy
  - security
  - smart-contracts
  - protocol-design
  - applications
  - account-abstraction
  - research
topic_id: '29217'
translated_at: '2026-08-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8356: Purpose-Bound Third-Party Data Consent](https://ethereum-magicians.org/t/erc-8356-purpose-bound-third-party-data-consent/29217) — duribebe (2026-07-31)

プルリクエスト (PR) をオープンする前に、[[glossary/ERC|ERC]] ドラフトに関するフィードバックをいただきたい。

**一行で要約すると。** 私が見つけた標準トラック (Standards Track) 上のすべての委任標準は二者間のものでした。同意する当事者が利益を得る当事者であり、リスクを負う当事者が署名した当事者です。私は、これらの当事者が異なるケースを標準化したいと考えています。なぜなら、それが他者のデータを使用することへの同意の形だからです。

開示: 私は分散型バイオバンキングシステムを構築する [GenoBank.io](http://GenoBank.io) の創設者であり、患者が研究者に自身のデータへのアクセスを許可するシステムです。このドラフトはその作業から生まれました。ドラフトは意図的にドメインニュートラルに作成されています。規範的なテキストには、健康、ゲノミクス、または [GenoBank.io](http://GenoBank.io) について何も言及されていません。なぜなら、その構造はそれらのいずれにも固有のものではないからです。

* * *

## 問題

このケースには3つの[[glossary/Subject|主体]] (principal) があり、既存の標準では最後の2つが統合されています。

-   **[[glossary/Subject|主体]] (subject)**: 付与が関係するデータを持つ人物であり、その同意が記録される人物
-   **[[glossary/Grantee|被付与者]] (grantee)**: 付与を行使することを許可された当事者
-   **[[glossary/Agent|エージェント]] (agent)**: [[glossary/Grantee|被付与者]]の代理として付与を行使するオプションの[[glossary/Subject|主体]]

[[glossary/ERC|ERC]]-4907および[[glossary/ERC|ERC]]-5006では、所有者が自身のトークンに対する期間制限付き (time-boxed) の `user` ロールを付与します。[[glossary/ERC|ERC]]-8226では、[[glossary/Subject|主体]]が自身の資産に対するスコープと上限が設定された権限 (scoped, capped authority) を[[glossary/Agent|エージェント]]に委任し、その委任 (mandate) は `(agent, principal)` でキー付けされます。いずれのケースでも、同意する当事者が受益者です。この標準が扱うケースは構造的に異なります。[[glossary/Subject|主体]]が[[glossary/Grantee|被付与者]]による[[glossary/Subject|主体]]に関するデータへのアクセスに同意し、不正な行為による損害は、トランザクションの当事者ではない人物に及ぶのです。

以下の3つのギャップがあり、既存のものではどれも表現できませんでした。

**1. [[glossary/Subject|主体]]が受益者ではない。** [[glossary/ERC|ERC]]-8328は[[glossary/Subject|主体]]をモデル化しており、W3C VC 2.0も `credentialSubject` で同様です。しかし、どちらも非当事者の[[glossary/Subject|主体]]による[[glossary/revocation|取り消し]]を、アクセス時に[[glossary/off-chain|オフチェーン]]依存パーティ (relying party) に対して**有効にする**ことはできません。[[glossary/ERC|ERC]]-8328自体がこれを述べています。「コンプライアンスポリシー…転送制限を定義しない」とあり、その `OUTCOME_REVOKED` は、何も参照されない記録されたアサーションに過ぎません。

**2. [[glossary/Agent|エージェント]]は人間とは別に[[glossary/revocation|取り消し]]可能でなければならない。** [[glossary/Agent|エージェント]]がモデル化されている場合でも、それは[[glossary/Subject|主体]]の拡張としてモデル化されているため、二者間標準では「この研究者はアクセスを保持するが、彼らが使用していたツールはアクセスできない」と言うことはできません。これは、モデルプロバイダー、MCPサーバー、またはセッションキーが侵害された場合にインシデント対応が必要とするまさにそのアクションです。

**3. 利用目的がどこにも強制されていない。** これまでのすべての規制遵守[[glossary/ERC|ERC]]（3643、7518、8106、8226、8320）は、認定 (accreditation)、管轄区域ブロック (jurisdiction blocks)、AMLフラグ (AML flags)、転送上限 (transfer caps) といった証券関連の語彙 (securities vocabulary) をエンコードしています。ファンドユニットには利用目的制限 (purpose limitation) がないため、誰もそれを必要としませんでした。しかし、データにはそれが必要です。

* * *

## なぜ[[glossary/on-chain|オンチェーン]]なのか

これは私が最も強く問われると予想する質問であり、その答えは2つの部分からなります。

**手段自体**については、W3C [[glossary/Verifiable-Credential|検証可能なクレデンシャル (Verifiable Credential)]]の方が優れた担い手であり、ドラフトもそのように述べています。`termsRef`と`purposeProfileRef`は、クレデンシャルの規範的な`termsOfUse`から参照されるドキュメントのハッシュです。これらはその代替ではありません。

発行者管理の場所 (issuer-controlled place) にあってはならない唯一のものは、**[[glossary/revocation|取り消し]]ステータス**です。ビットストリングステータスリスト (Bitstring Status List) は、発行者が書き換えたり、オフラインにしたり、日付を遡って変更したりできるエンドポイントからフェッチされます。[[glossary/consensus|コンセンサス]]順序付けされた[[glossary/revocation|取り消し]] (consensus-ordered revocation) は、これらを行うことはできません。

これは理論的ではなく、具体的に重要です。認証されたデータセットへのアクセスに関する既存の標準はGA4GHパスポート (GA4GH Passports) であり、そのAAIプロファイル自体が、ビザ発行者 (Visa Issuer) は「いかなる[[glossary/revocation|取り消し]]プロセスなしにこのタイプのトークンを提供してもよい (MAY provide tokens of this type without any revocation process)」と述べており、`exp`を厳密な期限 (hard cutoff) ではないと明示的に定義しています（「アクセスは`exp`タイムスタンプによって必ずしも削除されるわけではない (access is NOT necessarily removed by the `exp` timestamp)」）。そして、唯一のアクティブなチェックであるポーリングは、「パスポートクリアリングハウスごとに1時間あたり1回を超えて行ってはならない (MUST NOT be done more than once per hour per Passport Clearinghouse)」とレート制限されています。[[glossary/revocation|取り消し]]リストもプッシュチャネルもありません。同意が撤回された場合の最悪の伝播は、トークン寿命 (token lifetime) と1時間ごとのポーリング (hourly poll) によって制限されます。

したがって、この主張は狭く、私も狭く判断されることを望んでいます。それは、**[[glossary/Subject|主体]]が受益者ではない付与の、公開され、否認不可能な (non-repudiable)、[[glossary/consensus|コンセンサス]]順序付けされた[[glossary/revocation|取り消し]]**です。これは新しいアイデンティティシステムでも、新しいクレデンシャル形式でも、コンプライアンスオラクル (compliance oracle) でもなく、それ以上のものでもありません。

* * *

## なぜ[[glossary/ERC|ERC]]-8226のプロファイルではないのか

[[glossary/ERC|ERC]]-8226は最も近い隣接標準であり、藁人形論法で批判する (strawman it) のではなく、その違いについて正確に述べたいと思います。

その `Mandate` は `(agent, principal)` でキー付けされ、その上限は転送量 (transfer quantity) で表されます。プロファイルを妨げる3つの要因があります。

-   [[glossary/Subject|主体]]は**受益者**です。第三者の席はなく、それを追加するとキーが変わります。
-   コンプライアンスは**付与時のみ**チェックされます。その「セキュリティに関する考慮事項 (Security Considerations)」は、[[glossary/revocation|取り消し]]と執行の競合 (race between revocation and enforcement) を受け入れており、帯域外フリーズリレー (out-of-band freeze relay) によって緩和されます。不可逆的な開示 (irreversible disclosure) の場合、トリガーが知識と[[glossary/revocation|取り消し]]の容易さであるレジームの下では、付与時のチェックでは不十分です。
-   `metadata`は、手段や利用目的が存在しうる唯一のフィールドですが、**明示的に非規範的**です。実装は「執行決定のためにそれに依存してはならない (MUST NOT rely on it for enforcement decisions)」とされています。

この2つは組み合わせて使用できます。[[glossary/Agent|エージェント]]は支払い資産に対する8226の委任 (mandate) と、この仕様に基づくデータ資産に対する付与を保持できます。私は、それがどちらかをもう一方のプロファイルにするとは考えていません。

* * *

## ステータス

[[glossary/ERC|ERC]]ドラフトと参照実装 (reference implementation) はデプロイされ、検証可能です。

| チェーン | アドレス |
| --- | --- |
| [[glossary/Avalanche-mainnet|アバランチメインネット]] (43114) | `0xA04d20E6fB15A0939B08eb1cB88673f34051342c` |
| [[glossary/Avalanche-Fuji|アバランチFuji]] (43113) | `0x25d419259d7336a4d883808adc02a5F92520b2C0` |
| [[glossary/Sequentia|セクエンティア]] (15132025, 許可制 (permissioned)) | `0x473Cd8D24437c9321e2e0c32C7cC9F777f99d1A5` |

45のテストがあり、そのほとんどはネガティブテストです。興味深いアサーションは、サブ付与がスコープ、操作、有効期限、利用目的、使用回数において親を超えることはできないこと。主張されたが証明されていない[[glossary/Agent|エージェント]]のアイデンティティは[[glossary/Agent|エージェント]]の制約を満たさないこと。[[glossary/Agent|エージェント]]の脚を[[glossary/revocation|取り消し]]ても人間の付与は生き残ること。そして、[[glossary/revocation|取り消し]]コストが委任された子どもの数とともに増加しないことです。

この投稿を作成する前に、私は仕様と実装を5つの独立した視点（[[glossary/EIP-Editor|EIPエディター]]、セキュリティ監査人、データ保護責任者、敵対的な競合標準作成者、テキストのみから作業する実装者）からの敵対的レビューにかけました。その結果、54の発見があり、そのうち48が検証パスを生き残りました。公開を妨げる問題 (publication blockers) と分類された7つの問題を修正しました。そのうち2つは、私自身の[[glossary/NatSpec|NatSpec]]がコードが実行しないことを主張していたケースであり、1つはデプロイされたコントラクトにおける現行の権限昇格 (privilege escalation) でした。これを言及するのは、以下の残りの項目が謙遜ではなく、私がすでに把握しているリストだからです。

* * *

## まだ弱いと認識している点

これらを指摘される前に、私自身が挙げたいと思います。

**プライバシーセクションがデータモデルと矛盾している。** プライバシー規則は、個人データ (personal data) をハッシュ化された形式を含め、いかなる形でも[[glossary/on-chain|オンチェーン]]に書き込んではならないと規定しています。データモデルは `address subject` を義務付けています。ドラフトは、[[glossary/Subject|主体]]が資産レジストリ (asset registry) から派生するゼロ主体プロファイル (zero-subject profile) を推奨していますが、公開されたインターフェースには `subjectOf` フックがないため、そのプロファイルは指定通りに構築できません。これとは別に、付与が[[glossary/ERC|ERC]]-1155トークンとして表現される場合、主体側ミント (subject-side mint) は、フィールドをゼロにすることで削除されるはずだったアドレスを再公開し、`nonces` は生アドレス (raw address) でキー付けされます。私はこれを解決しておらず、これについて最もフィードバックが欲しい唯一の点です。

**`usesMax` は自己申告である。** [[glossary/Grantee|被付与者]]または[[glossary/Agent|エージェント]]のみが `commitUsage` を介して `useCount` を進めます。これを呼び出さない[[glossary/Grantee|被付与者]]は、実質的に上限なしの付与 (uncapped grant) を保持します。これは暗号学的に (cryptographically) ではなく、契約上 (contractually) 拘束されるため、ドラフトはそれを明確に述べるか、`checkAccess` をビュー (view) と状態変更を伴う消費 (state-changing consume) に分割すべきです。

**使用状況ハッシュチェーン (usage hash chain) の仕様が不十分である。** `h_i = H(h_{i-1} || record_i)` とありますが、名前付きのハッシュ関数 (H) も `h_0` も `record_i` スキーマもありません。2つの実装が比較可能なチェーンを生成することはできません。ドラフトはまだ「完全性 (completeness)」という言葉を使用していますが、これは誤りです。ハッシュチェーンは改ざん証拠 (tamper-evidence) と順序付けを提供しますが、単に追記を拒否する当事者に対しては、いかなる保護も提供しません。

**Merkleリーフ構築 (Merkle leaf construction) は指定されていません**（ハッシュ関数とペアの順序付け）。また、撤回されたリーフはサブ付与によって継承されないため、データごとの[[glossary/revocation|取り消し]] (per-datum withdrawal) は1つの委任ホップ (delegation hop) を超えて存続しません。

**4つの `Status` 値にはセッター (setter) または遷移ルール (transition rule) がなく**、`SUSPENDED` は復元可能であると文書化されていますが、これは復帰ルール (no-reinstatement rule) と矛盾します。

**`checkAccess` は[[glossary/on-chain|オンチェーン]]呼び出し元 (on-chain caller) のみを認証する。** [[glossary/eth_call|eth_call]] を介してそれを呼び出す[[glossary/off-chain|オフチェーン]]依存パーティは、`from` を自身で提供し、認証を一切受けません。動機で説明したデプロイメントがまさに[[glossary/off-chain|オフチェーン]]ゲートウェイであることを考えると、これには署名付きチャレンジコンパニオン (signed-challenge companion) またはより大きな警告、おそらくその両方が必要です。

**RFC 8785は配列要素をソートしない**ため、私が指定する利用目的プロファイルの正規化 (purpose profile canonicalization) は、同じ意味論的プロファイル (semantic profile) に対して安定したハッシュを生成しません。

* * *

## 私が求めていること

1.  この狭い主張は本当に未開拓なものなのでしょうか？私は特に、[[glossary/Subject|主体]]が受益者ではない付与の、**アクセス時に有効な非当事者[[glossary/Subject|主体]]の[[glossary/revocation|取り消し]]**について尋ねています。一般的な三者間モデリングについては、[[glossary/ERC|ERC]]-8328がすでにそれを行っています。
2.  `ops` ビットマスク (bitmask) は[[glossary/ERC|ERC]]-6617であるべきでしょうか、それとも、ある当事者によってミントされた付与が別の当事者によって評価される場合、固定値 (fixed values) が適切でしょうか？
3.  上記のプライバシーの矛盾について: `subjectOf` リゾルバーフック (resolver hook) が適切な形でしょうか、それとも[[glossary/Subject|主体]]は[[glossary/on-chain|オンチェーン]]状態を完全に離れ、[[glossary/off-chain|オフチェーン]]クレデンシャルのみに存在すべきでしょうか？
4.  そもそもこれを標準として採用する意欲はあるのでしょうか、それとも、[[glossary/on-chain|オンチェーン]]ステータスアンカー (status anchor) を持つ[[glossary/Verifiable-Credential|VCプロファイル]] (VC profile) であり、それ以上のものではないというのが正しい結論でしょうか？プルリクエスト (PR) の後ではなく、今それを聞きたいです。

もしフレームワーク (framing) 自体が間違っているなら、それが私が最も聞きたい答えです。

* * *

## リンク

**デプロイされた参照実装 (reference implementation)**、3つすべてでバイト同一 (byte-identical) (ランタイム (runtime) 15,385バイト):

-   [[glossary/Avalanche-mainnet|アバランチメインネット]]: [`0xA04d20E6fB15A0939B08eb1cB88673f34051342c`](https://snowtrace.io/address/0xA04d20E6fB15A0939B08eb1cB88673f34051342c)
-   [[glossary/Avalanche-Fuji|アバランチFuji]]: [`0x25d419259d7336a4d883808adc02a5F92520b2C0`](https://testnet.snowtrace.io/address/0x25d419259d7336a4d883808adc02a5F92520b2C0)
-   [[glossary/Sequentia|セクエンティア]] (許可制 (permissioned), chainId 15132025): `0x473Cd8D24437c9321e2e0c32C7cC9F777f99d1A5`, `https://seqrpc.genobank.app` で読み取り可能

以前のデプロイメントからの置き換えられたインスタンス (superseded instances) は3つのチェーンすべてで稼働しており、このバージョンで修正されたスコープ包含バイパス (scope-containment bypass) を含んでいます。これらはプロキシ (proxies) ではなく、無効にすることはできないため、見つけられるままにするのではなく、名前を挙げておきます。
`0xA25543a0eDF4755d7C4f39207F8cF59C23173864` (メインネット (mainnet))、
`0xEE53dAAf7AF86E47bc3155b0642c41a30F1A5d06` (Fuji)、
`0x6D6604eD95A46018a36C730614714f9586049C3D` (セクエンティア)。これらは使用しないでください。

**ドラフト全文**は次の返信に続くため、スレッドは自己完結型 (self-contained) であり、リンクが生きていることに依存しません。

*5投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8356-purpose-bound-third-party-data-consent/29217)
