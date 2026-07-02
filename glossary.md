---
title: Ethereum Research 用語集（編集ソース）
last_updated: 2026-07-02
description: |
  用語集の編集源です。人手編集に加え、翻訳パイプラインが新出の専門用語を自動追記します
  （自動追加分は auto_added / auto_source_topic_id / auto_source_url マーカー付き）。
  自動追記された用語が翻訳のウィキリンク化に効くのは「次回以降のラン」です（同一ラン内では効きません）。
  scripts/expand-glossary.ts がここをパースして content/glossary/*.md に展開します。
  各エントリのフォーマット:
    ## <英語または主表記>
    - ja: <日本語表記>
    - aliases: [代替表記1, 代替表記2]   # 任意。Quartz のウィキリンク解決で使う
    - related: [関連用語1, 関連用語2]    # 任意。関連用語ウィキリンクとして展開される
    - desc: |
        複数行の説明文（Markdown 可）。
  ---
  追加時は `## 用語名` を新規セクションとして挿入してください。
---

# Glossary

## PBS
- ja: PBS（プロポーザー・ビルダー分離）
- aliases: [Proposer-Builder Separation, Proposer Builder Separation]
- related: [MEV, Block Building, Relay]
- desc: |
  ブロック構築 (builder) と提案 (proposer) の役割を分離するアーキテクチャ。
  MEV 抽出を巡る集中・検閲リスクを緩和することを目的とし、Ethereum では
  mev-boost / enshrined PBS / ePBS などの段階的な実装が議論されている。

## MEV
- ja: MEV（最大抽出可能価値）
- aliases: [Maximal Extractable Value, Miner Extractable Value]
- related: [PBS, Block Building]
- desc: |
  ブロック内の取引順序を操作することで、ブロック生成者が抽出できる経済価値。
  当初は Miner Extractable Value だったが、PoS 以降は Maximal Extractable Value
  と呼ばれることが多い。

## Liquid Staking
- ja: リキッドステーキング
- aliases: [LST, Liquid Staking Token, Liquid Staking Derivative, LSD]
- related: [Restaking, Slashing]
- desc: |
  ETH をステーキングしつつ、ロックされたポジションを示す流動性トークン（LST）を
  受け取れる仕組み。Lido の stETH や Rocket Pool の rETH が代表例。

## Rollup
- ja: ロールアップ
- aliases: [L2 Rollup]
- related: [Optimistic Rollup, ZK Rollup, Data Availability]
- desc: |
  L2 スケーリング手法。実行を L2 で行い、データ・証明・状態コミットを L1 に
  ポストすることで、L1 のセキュリティを継承しつつスループットを向上させる。

## EIP
- ja: EIP（Ethereum 改善提案）
- aliases: [Ethereum Improvement Proposal]
- related: [ERC, EIPs Editor]
- desc: |
  Ethereum プロトコル変更を提案するためのドキュメント形式。
  Core, Networking, Interface, ERC などのカテゴリがある。

## Block Building
- ja: ブロック構築
- aliases: [Block Builder, Builder]
- related: [PBS, MEV, Relay]
- desc: |
  トランザクションを選択・順序づけしてブロックを組み立てるプロセス、
  またはそれを担う主体。PBS 下では builder と proposer が分離する。

## Data Availability
- ja: データアベイラビリティ
- aliases: [DA, Data Availability Sampling, DAS]
- related: [Rollup, Danksharding, Blob]
- desc: |
  ブロック内データが全ノードに対して取得可能であることを担保する性質。
  Danksharding/EIP-4844 では blob として実装され、DAS で全ダウンロードなしに
  可用性を検証できるよう設計されている。

## Generalized Extractable Value
- ja: 一般化された抽出可能価値 (GEV)
- aliases: [GEV]
- related: [Maximal Extractable Value]
- auto_added: 2026-05-26
- auto_source_topic_id: 24953
- auto_source_url: https://ethresear.ch/t/extraction-is-conserved-from-mev-to-gev/24953
- desc: |
  MEVの概念を拡張し、プロトコル内のあらゆるレイヤーで発生する価値抽出の総体を指します。単一のチャネルを修正しても全体は排除されず、他のチャネルに再配置されるという「保存の特性」を持つとされます。

## Transaction-Ordering Extraction
- ja: トランザクション順序付け抽出
- related: [Maximal Extractable Value, Generalized Extractable Value]
- auto_added: 2026-05-26
- auto_source_topic_id: 24953
- auto_source_url: https://ethresear.ch/t/extraction-is-conserved-from-mev-to-gev/24953
- desc: |
  メムプールでの可視性と逐次実行によって生じる、トランザクションの順序付けを利用した価値抽出です。サンドイッチ攻撃やフロントランニングなどが典型的な例で、MEVとして知られる抽出チャネルの一つです。

## Structural Extraction
- ja: 構造的抽出
- related: [Generalized Extractable Value, Shapley Value]
- auto_added: 2026-05-26
- auto_source_topic_id: 24953
- auto_source_url: https://ethresear.ch/t/extraction-is-conserved-from-mev-to-gev/24953
- desc: |
  プロトコル参加者が、そのシャプレー値（共同ゲームへの限界貢献度）を超えて受け取る価値の総量です。プロトコルのアロケーションルールに組み込まれた構造的なチャネルを通じて、価値が不均衡に流れることで発生します。

## Conservation Property
- ja: 保存の特性
- related: [Generalized Extractable Value]
- auto_added: 2026-05-26
- auto_source_topic_id: 24953
- auto_source_url: https://ethresear.ch/t/extraction-is-conserved-from-mev-to-gev/24953
- desc: |
  価値抽出がプロトコルレイヤー間で保存されるという特性です。単一の抽出チャネルを修正しても、抽出が排除されるのではなく、未対処の他のチャネルに再配置されることを意味し、GEVの主要な論点の一つです。

## Shapley Value
- ja: シャプレー値
- related: [Structural Extraction, Generalized Extractable Value]
- auto_added: 2026-05-26
- auto_source_topic_id: 24953
- auto_source_url: https://ethresear.ch/t/extraction-is-conserved-from-mev-to-gev/24953
- desc: |
  協力ゲーム理論における概念で、各プレイヤーがゲーム全体に与える限界貢献度を平均化した値です。本稿では、プロトコル参加者の「構造的抽出」を定義する際の基準として用いられ、GEVの計算基盤となります。

## FOCIL
- ja: FOCIL (強制オンチェーンインクルージョンリスト)
- aliases: [EIP-7805]
- related: [Inclusion List, censorship resistance]
- auto_added: 2026-05-26
- auto_source_topic_id: 24950
- auto_source_url: https://ethresear.ch/t/formalizing-focil-in-lean-4/24950
- desc: |
  Ethereumの検閲耐性強化を目的とした提案EIP-7805の略称。特定のトランザクションを強制的にブロックに含めるメカニズムを提供する。Hegotáアップグレードで導入が予定されている。

## Inclusion List
- ja: インクルージョンリスト
- aliases: [IL]
- related: [FOCIL, censorship resistance, block builder]
- auto_added: 2026-05-26
- auto_source_topic_id: 24950
- auto_source_url: https://ethresear.ch/t/formalizing-focil-in-lean-4/24950
- desc: |
  FOCILにおいて、特定のトランザクションをブロックに含めるよう提案者が強制されるリスト。委員会メンバーによって作成され、検閲耐性を高める役割を果たす。

## 1-out-of-N honesty
- ja: N分の1の正直性
- related: [FOCIL, censorship resistance]
- auto_added: 2026-05-26
- auto_source_topic_id: 24950
- auto_source_url: https://ethresear.ch/t/formalizing-focil-in-lean-4/24950
- desc: |
  FOCILの主要なセキュリティ保証の一つ。インクルージョンリスト委員会メンバーのうち、N人中1人でも正直なメンバーがいれば、そのメンバーがリストしたトランザクションは最終的にブロックに含まれることを保証する。

## Equivocation as a censorship channel
- ja: 検閲チャネルとしての二重署名（equivocation）
- related: [FOCIL, equivocation, censorship resistance]
- auto_added: 2026-05-26
- auto_source_topic_id: 24950
- auto_source_url: https://ethresear.ch/t/formalizing-focil-in-lean-4/24950
- desc: |
  FOCILにおいて、委員会メンバーが二重署名（equivocation）を行うことで、そのメンバーがリストした正直なトランザクションも無視される脆弱性。これにより、検閲の手段として悪用される可能性が指摘されている。

## Nonce front-running
- ja: ナンス・フロントランニング
- related: [front-running, FOCIL, MEV]
- auto_added: 2026-05-26
- auto_source_topic_id: 24950
- auto_source_url: https://ethresear.ch/t/formalizing-focil-in-lean-4/24950
- desc: |
  FOCILの文脈で議論される攻撃手法の一つ。悪意のあるプロポーザーが、インクルージョンリスト内のトランザクションと同じ送信者を持つ別のトランザクションを先に含めることで、リスト内のトランザクションのナンスを無効化し、その包含を妨害する。

## Diversity-Weighted Byzantine Fault Tolerance
- ja: 多様性重み付けビザンチン耐性 (DW-BFT)
- aliases: [DW-BFT]
- related: [Byzantine Fault Tolerance, Coordination Collapse, Diversity Weight, Effective Stake]
- auto_added: 2026-05-25
- auto_source_topic_id: 24935
- auto_source_url: https://ethresear.ch/t/coordination-is-self-defeating-a-structural-proof-for-diversity-weighted-byzantine-fault-tolerance/24935
- desc: |
  バリデーターの行動的多様性に基づいて重み付けを行う、新しいビザンチン耐性コンセンサスシステム。ビザンチンバリデーターが協調するほど多様性重みがゼロに近づき、実効投票権を失うことで、ビザンチン攻撃を構造的に自己無効化する。

## Coordination Collapse
- ja: 協調崩壊
- related: [Diversity-Weighted Byzantine Fault Tolerance, Diversity Weight, Effective Stake]
- auto_added: 2026-05-25
- auto_source_topic_id: 24935
- auto_source_url: https://ethresear.ch/t/coordination-is-self-defeating-a-structural-proof-for-diversity-weighted-byzantine-fault-tolerance/24935
- desc: |
  ビザンチンバリデーター間の行動的協調の度合いが高まるにつれて、彼らの多様性重みがゼロに収束し、結果として実効投票権が失われる現象。多様性重み付けビザンチン耐性（DW-BFT）の主要なメカニズム。

## Diversity Weight
- ja: 多様性重み
- related: [Coordination Collapse, Effective Stake, Behavioral Diversity]
- auto_added: 2026-05-25
- auto_source_topic_id: 24935
- auto_source_url: https://ethresear.ch/t/coordination-is-self-defeating-a-structural-proof-for-diversity-weighted-byzantine-fault-tolerance/24935
- desc: |
  バリデーターの行動がアンサンブル平均からどれだけ独立しているかを示す指標。ピアソン相関係数を用いて計算され、協調するバリデーターの多様性重みはゼロに近づく。

## Effective Stake
- ja: 実効ステーク
- related: [Diversity Weight, Stake Weight]
- auto_added: 2026-05-25
- auto_source_topic_id: 24935
- auto_source_url: https://ethresear.ch/t/coordination-is-self-defeating-a-structural-proof-for-diversity-weighted-byzantine-fault-tolerance/24935
- desc: |
  バリデーターの実際のステーク重みに、その行動的多様性重みを乗じて算出される値。多様性重み付けビザンチン耐性（DW-BFT）において、バリデーターの実際の投票権として機能する。

## Threshold Exclusion
- ja: 閾値除外
- aliases: [δ threshold exclusion]
- related: [Consensus Window, Diversity-Weighted Byzantine Fault Tolerance]
- auto_added: 2026-05-25
- auto_source_topic_id: 24935
- auto_source_url: https://ethresear.ch/t/coordination-is-self-defeating-a-structural-proof-for-diversity-weighted-byzantine-fault-tolerance/24935
- desc: |
  多様性重み付けビザンチン耐性（DW-BFT）における第二の防御メカニズム。バリデーターの提出値がコンセンサスウィンドウ（δ）の範囲外である場合、そのバリデーターをコンセンサススコアから除外する。これにより、多様性を維持しつつ不正な値を提出する攻撃を防ぐ。

## Trusted Execution Environment
- ja: トラステッド実行環境 (TEE)
- aliases: [TEE]
- related: [Confidential execution, Measurement and attestation]
- auto_added: 2026-05-27
- auto_source_topic_id: 24964
- auto_source_url: https://ethresear.ch/t/physical-integrity-attestation-and-the-state-of-permissionless-tees/24964
- desc: |
  ハードウェアベースのセキュリティ機能で、コードとデータをメインのOSやハイパーバイザーから隔離された安全な領域で実行することを保証します。これにより、機密性の高い処理が外部からの改ざんや覗き見から保護されます。

## Custody and physical integrity endorsement
- ja: カストディおよび物理的完全性の保証
- related: [Platform Ownership Endorsement, Proof of Cloud]
- auto_added: 2026-05-27
- auto_source_topic_id: 24964
- auto_source_url: https://ethresear.ch/t/physical-integrity-attestation-and-the-state-of-permissionless-tees/24964
- desc: |
  TEEシステムにおいて、ハードウェアの物理的な制御者（カストディ）と、そのハードウェアが改ざんから保護されていること（物理的完全性）を検証可能に声明するセキュリティレイヤーです。CPUベンダーが提供する基本的なアテステーションではカバーされない、重要な信頼のギャップを埋めることを目的とします。

## Platform Ownership Endorsement
- ja: プラットフォーム所有権保証 (PoE)
- aliases: [PoE]
- related: [PIID, CoRIM, Custody and physical integrity endorsement]
- auto_added: 2026-05-27
- auto_source_topic_id: 24964
- auto_source_url: https://ethresear.ch/t/physical-integrity-attestation-and-the-state-of-permissionless-tees/24964
- desc: |
  Intelが提案する標準化されたメカニズムで、プラットフォームオペレーターが特定のCPUの物理的制御を暗号学的に署名することを可能にします。これにより、TEEが特定の信頼できるオペレーターの管理下にあることを検証できます。

## Proof of Cloud
- ja: プルーフ・オブ・クラウド
- aliases: [PoC]
- related: [Custody and physical integrity endorsement]
- auto_added: 2026-05-27
- auto_source_topic_id: 24964
- auto_source_url: https://ethresear.ch/t/physical-integrity-attestation-and-the-state-of-permissionless-tees/24964
- desc: |
  TEEハードウェアが特定のクラウドプロバイダーの管理下にあることを検証するアプローチです。人間による検証（Level 1）や、TPMのクロスリンクを利用した暗号学的検証（Level 2）など、オペレーターの署名に依存しない形でカストディを証明することを目指します。

## Physical bus interposition
- ja: 物理バス介在攻撃
- related: [WireTap, TEE.fail]
- auto_added: 2026-05-27
- auto_source_topic_id: 24964
- auto_source_url: https://ethresear.ch/t/physical-integrity-attestation-and-the-state-of-permissionless-tees/24964
- desc: |
  TEEのメモリ暗号化エンジンとDRAM間の物理バスにデバイスを介在させることで、暗号化されたメモリ上のデータを傍受・改ざんするハードウェアレベルの攻撃手法です。これにより、TEEの機密性保証が破られる可能性があります。

## Imperfect Commitment
- ja: 不完全なコミットメント
- related: [Builder Defection, MEV Auction]
- auto_added: 2026-05-30
- auto_source_topic_id: 25001
- auto_source_url: https://ethresear.ch/t/imperfect-commitment-in-maximal-extractable-value-auctions/25001
- desc: |
  MEVオークションにおいて、ビルダーが提出された入札やペイロード情報を観察した後、正直なオークション結果から逸脱する可能性を指します。これにより、オークションの信頼性が損なわれる可能性があります。

## Builder Defection
- ja: ビルダーの逸脱
- related: [Imperfect Commitment, Replicability Fraction, Frontrunning]
- auto_added: 2026-05-30
- auto_source_topic_id: 25001
- auto_source_url: https://ethresear.ch/t/imperfect-commitment-in-maximal-extractable-value-auctions/25001
- desc: |
  MEVオークションにおいて、ビルダーが落札者の戦略を複製し、そのトランザクションを置き換えることで、本来落札者が得るはずだった機会を直接奪う行為です。これにより、検索者の収益が失われます。

## Replicability Fraction
- ja: 複製可能性の割合
- related: [Builder Defection, MEV Type]
- auto_added: 2026-05-30
- auto_source_topic_id: 25001
- auto_source_url: https://ethresear.ch/t/imperfect-commitment-in-maximal-extractable-value-auctions/25001
- desc: |
  ビルダーが、観察した落札者の機会をどの程度複製して自身の利益とすることができるかを示す割合（γ(τ)）です。MEVのタイプによってこの割合は大きく異なり、サンドイッチ攻撃では高く、複雑な清算では低い傾向があります。

## Deterrence Bid
- ja: 抑止入札
- related: [Builder Defection, Frontrunning]
- auto_added: 2026-05-30
- auto_source_topic_id: 25001
- auto_source_url: https://ethresear.ch/t/imperfect-commitment-in-maximal-extractable-value-auctions/25001
- desc: |
  検索者が、ビルダーによる逸脱（フロントランニング）の脅威を排除するために行う入札戦略です。ビルダーが複製して得られる価値（γv）を上回る額を入札することで、ビルダーが正直にオークション結果を尊重するインセンティブを与えます。

## Incentive Compatibility condition
- ja: インセンティブ整合性条件 (IC条件)
- aliases: [IC condition]
- related: [Builder Defection, Repeated Game]
- auto_added: 2026-05-30
- auto_source_topic_id: 25001
- auto_source_url: https://ethresear.ch/t/imperfect-commitment-in-maximal-extractable-value-auctions/25001
- desc: |
  ビルダーが、短期的な逸脱による利益よりも、正直な行動を続けることで得られる将来の継続的な収益を重視し、正直であり続けるための条件です。この条件が満たされない場合、ビルダーは逸脱するインセンティブを持ちます。

## ERC-8004
- ja: ERC-8004 (エージェントIDレジストリ)
- related: [Agent Identity Registry, AI agent verification stack]
- auto_added: 2026-05-30
- auto_source_topic_id: 24995
- auto_source_url: https://ethresear.ch/t/composition-note-erc-8004-erc-8263-ocp-a-reference-guide-for-implementers-building-on-the-ai-agent-verification-stack/24995
- desc: |
  AIエージェントのオンチェーンIDを確立するためのEthereum改善提案。登録されたトークン、正規ウォレット、解決可能なマニフェストを通じてエージェントを識別する。AIエージェント検証スタックのID層を構成する。

## ERC-8263
- ja: ERC-8263 (オンチェーン証明レイヤー)
- related: [Onchain Proof Layer, proofHash, agentIdScheme, AI agent verification stack]
- auto_added: 2026-05-30
- auto_source_topic_id: 24995
- auto_source_url: https://ethresear.ch/t/composition-note-erc-8004-erc-8263-ocp-a-reference-guide-for-implementers-building-on-the-ai-agent-verification-stack/24995
- desc: |
  AIエージェントの行動ダイジェストをオンチェーンでコミットするための最小限のインターフェースを提供するEthereum改善提案。エージェントIDにリンクされ、AIエージェント検証スタックのコミットメント層を構成する。

## Observation Commitment Protocol
- ja: Observation Commitment Protocol (OCP)
- aliases: [OCP]
- related: [proofHash, AI agent verification stack]
- auto_added: 2026-05-30
- auto_source_topic_id: 24995
- auto_source_url: https://ethresear.ch/t/composition-note-erc-8004-erc-8263-ocp-a-reference-guide-for-implementers-building-on-the-ai-agent-verification-stack/24995
- desc: |
  コミットされたダイジェストが、信頼できるSDKやゲートウェイなしに、生の台帳データから独立して検証される方法を定義するプロトコル。AIエージェント検証スタックの検証層を構成する。

## AI agent verification stack
- ja: AIエージェント検証スタック
- related: [ERC-8004, ERC-8263, Observation Commitment Protocol]
- auto_added: 2026-05-30
- auto_source_topic_id: 24995
- auto_source_url: https://ethresear.ch/t/composition-note-erc-8004-erc-8263-ocp-a-reference-guide-for-implementers-building-on-the-ai-agent-verification-stack/24995
- desc: |
  AIエージェントの行動に対する完全な証明スタックを構成する、複数のプロトコル（ERC-8004、ERC-8263、OCPなど）の組み合わせ。エージェントの識別、コミットメント、および独立した検証を可能にする。

## IDENTITY_SENTINEL
- ja: IDENTITY_SENTINEL (アイデンティティ・センチネル)
- related: [sanitization pipeline hash, verifier-branching invariant]
- auto_added: 2026-05-30
- auto_source_topic_id: 24995
- auto_source_url: https://ethresear.ch/t/composition-note-erc-8004-erc-8263-ocp-a-reference-guide-for-implementers-building-on-the-ai-agent-verification-stack/24995
- desc: |
  サニタイゼーションパイプラインが適用されない場合に、`sanitization_pipeline_hash`として使用される特定のハッシュ値。検証者がパススルーケースを明示的に処理し、誤った拒否を避けるための分岐不変条件を定義する。

## Verkle Trees
- ja: Verkleツリー
- aliases: [VKTs]
- related: [KZG commitment, Data Availability Sampling]
- auto_added: 2026-05-30
- auto_source_topic_id: 24978
- auto_source_url: https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978
- desc: |
  Ethereumのステートツリーを置き換えるために提案されている、より効率的なデータ構造です。特に、クライアントがステートの小さな部分を検証する際の証明サイズを大幅に削減できます。KZGコミットメントと組み合わせて使用されることが多いです。

## PeerDAS
- ja: PeerDAS
- related: [Data Availability Sampling, EIP-7594, KZG commitment]
- auto_added: 2026-05-30
- auto_source_topic_id: 24978
- auto_source_url: https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978
- desc: |
  EIP-7594で提案されているデータ可用性サンプリング（DAS）の実装の一つです。Constantineライブラリに統合され、既存のc-kzg-4844と比較してパフォーマンスとメモリ使用量の改善が報告されています。

## Precomputed MSMs
- ja: 事前計算された多点スカラー乗算 (MSM)
- related: [Multi-Scalar Multiplication (MSM), KZG commitment, Verkle Trees]
- auto_added: 2026-05-30
- auto_source_topic_id: 24978
- auto_source_url: https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978
- desc: |
  暗号学で用いられる多点スカラー乗算（MSM）の計算を高速化するための最適化手法です。特定の点とスカラーの組み合わせを事前に計算し、ルックアップテーブルとして利用することで、実行時の計算コストとメモリ使用量を削減します。

## FK23
- ja: FK23 (高速償却KZG証明)
- aliases: [Fast amortized KZG proofs]
- related: [KZG commitment, Toeplitz matrix multiplication]
- auto_added: 2026-05-30
- auto_source_topic_id: 24978
- auto_source_url: https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978
- desc: |
  「Fast amortized KZG proofs」という論文で提案された、KZG証明の計算を高速化する技術です。特にToeplitz行列乗算の最適化や、フィールド逆元、逆FFT、スカラー乗算などの処理を遅延・バッチ処理することで性能を向上させます。

## Toeplitz matrix multiplication
- ja: トープレット行列乗算
- related: [FK23, KZG commitment]
- auto_added: 2026-05-30
- auto_source_topic_id: 24978
- auto_source_url: https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978
- desc: |
  各対角成分が一定であるトープレット行列を用いた乗算です。FK23のような高速なKZG証明の計算において、その効率が重要な要素となります。特定の最適化手法により、この乗算の性能が大幅に改善されます。

## Multi-Party Block Construction
- ja: マルチパーティブロック構築
- aliases: [MPBC]
- related: [Proposer-Builder Separation, Single-Party Block, Multi-Party Block, Base Block, Operator]
- auto_added: 2026-05-30
- auto_source_topic_id: 24975
- auto_source_url: https://ethresear.ch/t/building-towards-multi-party-block-construction/24975
- desc: |
  複数のパーティがブロック構築に貢献することを可能にするメカニズム。単一のビルダーの限定された視点から、複数のビルダーの共有された視点へとブロック空間の割り当てを拡大し、トランザクションのインクルージョンパスを多様化する。

## Operator
- ja: オペレーター
- related: [Multi-Party Block Construction, Builder, Proposer, Relay]
- auto_added: 2026-05-30
- auto_source_topic_id: 24975
- auto_source_url: https://ethresear.ch/t/building-towards-multi-party-block-construction/24975
- desc: |
  ビルダーからブロックとトランザクションを受け取り、適格な貢献を組み合わせてマルチパーティブロックを構築し、最高額のブロックをプロポーザーに提出する役割を担うパーティ。MPBCにおいて重要な役割を果たす。

## Single-Party Block
- ja: シングルパーティブロック
- related: [Multi-Party Block Construction, Multi-Party Block, Base Block]
- auto_added: 2026-05-30
- auto_source_topic_id: 24975
- auto_source_url: https://ethresear.ch/t/building-towards-multi-party-block-construction/24975
- desc: |
  単一のモノリシックなビルダーのみがトランザクションを貢献して構築されたブロック。現在のProposer-Builder Separation (PBS) におけるブロック構築の標準的な形式を指し、マルチパーティブロック構築の対比として用いられる。

## Multi-Party Block
- ja: マルチパーティブロック
- related: [Multi-Party Block Construction, Single-Party Block, Base Block]
- auto_added: 2026-05-30
- auto_source_topic_id: 24975
- auto_source_url: https://ethresear.ch/t/building-towards-multi-party-block-construction/24975
- desc: |
  ベースビルダーと貢献ビルダーを含む複数のパーティによってトランザクションが貢献され、構築されたブロック。マルチパーティブロック構築 (MPBC) の導入によって可能となる、より多様なトランザクションを含むブロック。

## Base Block
- ja: ベースブロック
- related: [Multi-Party Block Construction, Single-Party Block, Multi-Party Block, Base Builder]
- auto_added: 2026-05-30
- auto_source_topic_id: 24975
- auto_source_url: https://ethresear.ch/t/building-towards-multi-party-block-construction/24975
- desc: |
  オペレーターが利用可能な最高額の単一パーティブロックであり、マルチパーティブロック構築の出発点として使用される。このブロックは、他のビルダーからの適格なトランザクションで拡張され、マルチパーティブロックとなる。

## ERC
- ja: Ethereum Request for Comments (ERC)
- aliases: [Ethereum Request for Comments]
- related: [EIP, RIP]
- auto_added: 2026-05-30
- auto_source_topic_id: 28664
- auto_source_url: https://ethereum-magicians.org/t/register-as-a-doi-publisher/28664
- desc: |
  イーサリアムエコシステムにおけるアプリケーション層の標準を提案する文書です。スマートコントラクトのインターフェースやトークン標準などを定義します。

## RIP
- ja: Rollup Improvement Proposal (RIP)
- aliases: [Rollup Improvement Proposal]
- related: [EIP, ERC, Rollup]
- auto_added: 2026-05-30
- auto_source_topic_id: 28664
- auto_source_url: https://ethereum-magicians.org/t/register-as-a-doi-publisher/28664
- desc: |
  ロールアップエコシステムにおける改善提案を記述する文書です。L2のプロトコルや標準などを定義します。

## Protocol Interaction Manifest
- ja: プロトコルインタラクションマニフェスト (PIM)
- aliases: [PIM]
- related: [smart contract ABI, autonomous agent, intent layer, lookup layer, execution layer]
- auto_added: 2026-05-30
- auto_source_topic_id: 28663
- auto_source_url: https://ethereum-magicians.org/t/providing-protocol-interaction-knowledge-in-machine-readable-files-translating-intent-into-transactions/28663
- desc: |
  スマートコントラクトプロトコルとの安全かつ正確なインタラクション方法を記述する、構造化された機械可読なJSONドキュメント。ユーザーの意図をトランザクションに変換するためのワークフロー、必要なオンチェーンデータ、トランザクション構築手順などを定義する。これにより、ウォレットや自動化システムが未知のプロトコルとも連携できるようになる。

## intent layer
- ja: インテントレイヤー
- related: [Protocol Interaction Manifest, lookup layer, execution layer]
- auto_added: 2026-05-30
- auto_source_topic_id: 28663
- auto_source_url: https://ethereum-magicians.org/t/providing-protocol-interaction-knowledge-in-machine-readable-files-translating-intent-into-transactions/28663
- desc: |
  Protocol Interaction Manifest (PIM) の構成要素の一つで、ユーザーが達成したい目標や意図を記述する部分。PIMがユーザーの意図を理解し、適切なトランザクションに変換するための出発点となる。

## lookup layer
- ja: ルックアップレイヤー
- related: [Protocol Interaction Manifest, intent layer, execution layer]
- auto_added: 2026-05-30
- auto_source_topic_id: 28663
- auto_source_url: https://ethereum-magicians.org/t/providing-protocol-interaction-knowledge-in-machine-readable-files-translating-intent-into-transactions/28663
- desc: |
  Protocol Interaction Manifest (PIM) の構成要素の一つで、トランザクションを構築する前に収集する必要があるオンチェーンデータを指定する部分。スマートコントラクトの状態やユーザーのウォレット情報などを取得する手順を定義する。

## execution layer
- ja: 実行レイヤー
- related: [Protocol Interaction Manifest, intent layer, lookup layer]
- auto_added: 2026-05-30
- auto_source_topic_id: 28663
- auto_source_url: https://ethereum-magicians.org/t/providing-protocol-interaction-knowledge-in-machine-readable-files-translating-intent-into-transactions/28663
- desc: |
  Protocol Interaction Manifest (PIM) の構成要素の一つで、ユーザーの意図を達成するために構築すべきトランザクション、その順序、および必要な安全チェックを記述する部分。実際のオンチェーン操作の詳細を定義する。

## transaction simulation
- ja: トランザクションシミュレーション
- related: [MEV, smart contract security, dApp security]
- auto_added: 2026-05-30
- auto_source_topic_id: 28663
- auto_source_url: https://ethereum-magicians.org/t/providing-protocol-interaction-knowledge-in-machine-readable-files-translating-intent-into-transactions/28663
- desc: |
  実際にオンチェーンで実行する前に、トランザクションがどのような結果をもたらすかをオフチェーンで予測するプロセス。これにより、意図しない状態変更、失敗、または悪意のある操作を防ぎ、ユーザーに安全な実行を保証する。

## Block Access List Byte Floor
- ja: ブロックアクセスリストのバイトフロア
- related: [Access List, EIP-2930]
- auto_added: 2026-05-30
- auto_source_topic_id: 28662
- auto_source_url: https://ethereum-magicians.org/t/eip-8279-block-access-list-byte-floor/28662
- desc: |
  EIP-8279で提案された、ブロックのアクセスリストに適用されるバイトサイズの最小値に関する概念。トランザクションの処理効率やガス料金の計算に影響を与える可能性があります。

## Tokenized investment funds
- ja: トークン化投資ファンド
- aliases: [Tokenized funds]
- related: [RWA platforms, ERC]
- auto_added: 2026-05-30
- auto_source_topic_id: 28660
- auto_source_url: https://ethereum-magicians.org/t/erc-ufund-standardized-fund-metadata-lifecycle-interface/28660
- desc: |
  ブロックチェーン上でトークンとして表現される投資ファンド。DeFiプロトコルやRWAプラットフォームとの連携を容易にするために標準化が進められています。

## RWA platforms
- ja: RWAプラットフォーム (Real World Assetプラットフォーム)
- aliases: [Real World Asset platforms]
- related: [Tokenized investment funds]
- auto_added: 2026-05-30
- auto_source_topic_id: 28660
- auto_source_url: https://ethereum-magicians.org/t/erc-ufund-standardized-fund-metadata-lifecycle-interface/28660
- desc: |
  不動産、債券、コモディティなどの現実世界の資産をブロックチェーン上でトークン化し、取引や管理を行うためのプラットフォーム。DeFiと伝統金融を結びつける役割を果たす。

## Proof-of-reserves attestations
- ja: 準備金証明アテステーション
- aliases: [Proof-of-reserves]
- related: [Attestation]
- auto_added: 2026-05-30
- auto_source_topic_id: 28660
- auto_source_url: https://ethereum-magicians.org/t/erc-ufund-standardized-fund-metadata-lifecycle-interface/28660
- desc: |
  企業やファンドが保有する準備金が、主張通りに存在することをオンチェーンで証明するプロセス。透明性を高め、ユーザーの信頼を確保するために用いられる。

## Events-only write-side design
- ja: イベントのみの書き込み側設計
- related: [ERC, Event stream]
- auto_added: 2026-05-30
- auto_source_topic_id: 28660
- auto_source_url: https://ethereum-magicians.org/t/erc-ufund-standardized-fund-metadata-lifecycle-interface/28660
- desc: |
  スマートコントラクトの設計パターンの一つで、状態変更を行う書き込み関数自体は標準化せず、その結果として発生するイベントのみを標準化する方式。これにより、実装の柔軟性を保ちつつ、インテグレーターが一貫した方法で状態変化を監視できる。

## NAV freshness/staleness
- ja: NAVの鮮度/陳腐度
- related: [Net Asset Value, Oracle]
- auto_added: 2026-05-30
- auto_source_topic_id: 28660
- auto_source_url: https://ethereum-magicians.org/t/erc-ufund-standardized-fund-metadata-lifecycle-interface/28660
- desc: |
  トークン化ファンドの純資産価値（NAV）が、最後に更新されてからどれくらいの時間が経過したかを示す指標。NAVが最新であるか（freshness）、あるいは古くなっているか（staleness）を判断するために用いられる。

## Service Object
- ja: サービスオブジェクト
- related: [ERC-721, Service Manifest, Service Operator, Payment Route]
- auto_added: 2026-05-30
- auto_source_topic_id: 28659
- auto_source_url: https://ethereum-magicians.org/t/erc-8278-service-objects/28659
- desc: |
  オフチェーンサービスに対する制御を表す、譲渡可能なトークン。ERC-721の拡張として提案され、サービスの運用状態（マニフェスト、オペレーター、支払い経路）を標準化された方法で解決できるようにする。

## Service Manifest
- ja: サービスマニフェスト
- related: [Service Object]
- auto_added: 2026-05-30
- auto_source_topic_id: 28659
- auto_source_url: https://ethereum-magicians.org/t/erc-8278-service-objects/28659
- desc: |
  サービスオブジェクトによって表されるサービスを記述するメタデータ。サービスの機能、エンドポイント、その他の設定情報を含むURIとハッシュで識別される。

## Service Operator
- ja: サービスオペレーター
- related: [Service Object]
- auto_added: 2026-05-30
- auto_source_topic_id: 28659
- auto_source_url: https://ethereum-magicians.org/t/erc-8278-service-objects/28659
- desc: |
  サービスオブジェクトによって表されるオフチェーンサービスを運用する権限を持つアドレス。サービスオブジェクトのインターフェースを通じて、現在のオペレーターと有効期限が公開される。

## Payment Route
- ja: 支払い経路
- related: [Service Object]
- auto_added: 2026-05-30
- auto_source_topic_id: 28659
- auto_source_url: https://ethereum-magicians.org/t/erc-8278-service-objects/28659
- desc: |
  サービスオブジェクトが提供する有料エンドポイントに対する支払いの宛先と方法を定義する情報。収益受取人、支払いURI、支払いマニフェストハッシュ、およびルートナンスが含まれる。

## Account Abstraction
- ja: アカウント抽象化
- aliases: [AA]
- related: [ERC-4337, Smart Account, Token-bound Account]
- auto_added: 2026-05-30
- auto_source_topic_id: 28659
- auto_source_url: https://ethereum-magicians.org/t/erc-8278-service-objects/28659
- desc: |
  Ethereumにおけるユーザーアカウントの概念を抽象化し、スマートコントラクトがアカウントのロジックを制御できるようにする仕組み。これにより、カスタムの署名スキームや認証方法、ガス料金の支払い方法などを柔軟に実装できる。

## AI inference input provenance
- ja: AI推論入力の来歴
- related: [On-chain AI agent systems, WYRIWE, triple-hash commitment scheme]
- auto_added: 2026-05-30
- auto_source_topic_id: 28655
- auto_source_url: https://ethereum-magicians.org/t/wyriwe-what-you-read-is-what-you-execute-input-provenance-for-verifiable-ai-inference/28655
- desc: |
  オンチェーンAIエージェントシステムにおいて、AIモデルに供給された入力データがどこから来て、どのような変更を受けたかを検証可能にするための概念。入力の改ざん防止と透明性確保が目的です。

## On-chain AI agent systems
- ja: オンチェーンAIエージェントシステム
- related: [AI inference input provenance, WYRIWE]
- auto_added: 2026-05-30
- auto_source_topic_id: 28655
- auto_source_url: https://ethereum-magicians.org/t/wyriwe-what-you-read-is-what-you-execute-input-provenance-for-verifiable-ai-inference/28655
- desc: |
  イーサリアムブロックチェーン上で動作し、AIモデルの実行やその出力の検証を行うエージェントのシステム。入力の完全性や実行の信頼性を確保するためのメカニズムが重要となります。

## triple-hash commitment scheme
- ja: トリプルハッシュコミットメントスキーム
- related: [AI inference input provenance, WYRIWE]
- auto_added: 2026-05-30
- auto_source_topic_id: 28655
- auto_source_url: https://ethereum-magicians.org/t/wyriwe-what-you-read-is-what-you-execute-input-provenance-for-verifiable-ai-inference/28655
- desc: |
  生のユーザー入力、サニタイズパイプライン、サニタイズ済み入力の3つのハッシュを連鎖させることで、AI推論の入力データの改ざん防止と検証可能性を確保するコミットメント方式。WYRIWEで採用されています。

## WYRIWE
- ja: WYRIWE (What You Read Is What You Execute)
- aliases: [What You Read Is What You Execute]
- related: [AI inference input provenance, On-chain AI agent systems, triple-hash commitment scheme, EIP-712 attestation profile]
- auto_added: 2026-05-30
- auto_source_topic_id: 28655
- auto_source_url: https://ethereum-magicians.org/t/wyriwe-what-you-read-is-what-you-execute-input-provenance-for-verifiable-ai-inference/28655
- desc: |
  AI推論の入力来歴を検証可能にするための提案されたERC。トリプルハッシュコミットメントスキームとEIP-712アテステーションプロファイルを用いて、AIモデルに供給された入力の完全性を保証します。

## EIP-712 attestation profile
- ja: EIP-712アテステーションプロファイル
- related: [EIP-712, WYRIWE, AI inference input provenance]
- auto_added: 2026-05-30
- auto_source_topic_id: 28655
- auto_source_url: https://ethereum-magicians.org/t/wyriwe-what-you-read-is-what-you-execute-input-provenance-for-verifiable-ai-inference/28655
- desc: |
  EIP-712標準を利用して、AI推論の入力来歴や実行結果などのアテステーション（証明）の構造を定義するプロファイル。これにより、アテステーションの署名と検証が標準化され、信頼性が向上します。

## blob
- ja: ブロブ
- related: [EIP-4844, Data Availability Sampling]
- auto_added: 2026-05-28
- auto_source_topic_id: 24978
- auto_source_url: https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978
- desc: |
  EIP-4844 (Proto-Danksharding) で導入された、一時的に大量のデータを保存するための新しいデータ形式。主にL2ロールアップのトランザクションデータを安価に利用可能にするために設計された。

## KZG commitment
- ja: KZGコミットメント
- aliases: [KZG]
- related: [EIP-4844, Polynomial commitment]
- auto_added: 2026-05-28
- auto_source_topic_id: 24978
- auto_source_url: https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978
- desc: |
  多項式コミットメントスキームの一種で、特定の多項式が特定の点において特定の値を評価することの簡潔な証明を可能にする。EIP-4844におけるブロブデータのデータ可用性証明に利用される。

## Multi-Scalar Multiplication
- ja: 多点スカラー乗算 (MSM)
- aliases: [MSM]
- related: [Elliptic curve cryptography, Verkle Trees]
- auto_added: 2026-05-28
- auto_source_topic_id: 24978
- auto_source_url: https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978
- desc: |
  複数のスカラーと楕円曲線上の点のペアに対して、それぞれスカラー乗算を行い、その結果を合計する演算。楕円曲線暗号やゼロ知識証明、Verkle Treesなどで効率的な計算が求められる。

## ePBS
- ja: ePBS (enshrined Proposer-Builder Separation)
- aliases: [enshrined Proposer-Builder Separation]
- related: [Proposer-Builder Separation, Relay]
- auto_added: 2026-05-28
- auto_source_topic_id: 24975
- auto_source_url: https://ethresear.ch/t/building-towards-multi-party-block-construction/24975
- desc: |
  プロポーザー・ビルダー分離 (PBS) の一種で、プロトコル内に組み込まれた（enshrined）形式。リレーの主要なエスクロー機能をプロトコルが直接処理することで、単一パーティブロックの信頼できる引き渡しを可能にする。MPBCはePBSを拡張する形で設計されている。

## EIPIP
- ja: EIPIP
- related: [EIP]
- auto_added: 2026-05-28
- auto_source_topic_id: 28644
- auto_source_url: https://ethereum-magicians.org/t/eipip-meeting-127-june-03-2026/28644
- desc: |
  Ethereum Improvement Proposal (EIP) の実装プロセスに関する会議体またはグループ。EIPの策定と管理に関するポリシーやガイドラインを議論し、コミュニティの合意形成を促進する。

## EIP Editor
- ja: EIPエディター
- aliases: [EIP Editors, Associate EIP Editors]
- related: [EIP]
- auto_added: 2026-05-28
- auto_source_topic_id: 28644
- auto_source_url: https://ethereum-magicians.org/t/eipip-meeting-127-june-03-2026/28644
- desc: |
  Ethereum Improvement Proposal (EIP) のレビュー、編集、および管理を担当する個人。EIPの品質と一貫性を確保し、標準化プロセスにおいて重要な役割を果たす。

## Dispute Resolution Guidelines
- ja: 紛争解決ガイドライン
- related: [EIPIP, EIP]
- auto_added: 2026-05-28
- auto_source_topic_id: 28644
- auto_source_url: https://ethereum-magicians.org/t/eipip-meeting-127-june-03-2026/28644
- desc: |
  Ethereum Improvement Proposal (EIP) の策定プロセスにおいて発生する意見の相違や紛争を解決するための公式な指針。コミュニティ内の合意形成を促進し、プロセスの円滑な進行を支援する。

## EIP Numbering
- ja: EIPナンバリング
- related: [EIP]
- auto_added: 2026-05-28
- auto_source_topic_id: 28644
- auto_source_url: https://ethereum-magicians.org/t/eipip-meeting-127-june-03-2026/28644
- desc: |
  Ethereum Improvement Proposal (EIP) に一意の番号を割り当てるプロセス。EIPの識別と管理を効率化するために、自動化が検討されている重要な要素である。

## EIP Editing Office Hours
- ja: EIP編集オフィスアワー
- related: [EIP Editor, EIP]
- auto_added: 2026-05-28
- auto_source_topic_id: 28644
- auto_source_url: https://ethereum-magicians.org/t/eipip-meeting-127-june-03-2026/28644
- desc: |
  EIPエディターがコミュニティメンバーからのEIPに関する質問に答えたり、フィードバックを提供したりする定期的なセッション。EIPの改善と理解を深める機会を提供し、コミュニティとの連携を強化する。

## Glamsterdam
- ja: グラムステルダム
- auto_added: 2026-05-28
- auto_source_topic_id: 28643
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-testing-acdt-81-june-1-2026/28643
- desc: |
  Ethereumの将来のアップグレードまたは開発ネットワークのコードネーム。特定の開発フェーズや機能セットを指し、関連するEIPやテストネットの議論で用いられる。

## devnet
- ja: 開発ネットワーク (devnet)
- aliases: [development network]
- related: [testnet]
- auto_added: 2026-05-28
- auto_source_topic_id: 28643
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-testing-acdt-81-june-1-2026/28643
- desc: |
  Ethereumのプロトコルアップグレードや新機能のテストのために構築される、限定的なテスト環境。メインネットへのデプロイ前に機能検証やバグ発見を行うために使用される。

## repricing
- ja: 再価格設定
- related: [gas fee, EIP-1559]
- auto_added: 2026-05-28
- auto_source_topic_id: 28643
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-testing-acdt-81-june-1-2026/28643
- desc: |
  Ethereumネットワークにおけるトランザクション手数料やリソースコストの調整プロセス。EIP-1559のようなメカニズムを通じて、ガス価格の変動や基本料金の変更が行われることを指す。

## Eth R&D
- ja: イーサリアム研究開発
- aliases: [Ethereum R&D, Ethereum Research and Development]
- related: [Ethereum Improvement Proposal, All Core Devs]
- auto_added: 2026-05-28
- auto_source_topic_id: 28643
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-testing-acdt-81-june-1-2026/28643
- desc: |
  Ethereumプロトコルの将来的な改善、アップグレード、および新技術に関する研究と開発活動全般を指す。コミュニティ内の研究者や開発者による議論や実装作業を含む。

## Keyed Nonces
- ja: キー付きNonce (Keyed Nonces)
- aliases: [EIP-8250 Keyed Nonces]
- related: [EIP-8250, Async nonce, Sync nonce, Frame Transactions]
- auto_added: 2026-05-28
- auto_source_topic_id: 28642
- auto_source_url: https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642
- desc: |
  EIP-8250で提案されている、トランザクションのリプレイ保護を強化するためのnonceモデル。単一の線形シーケンスではなく、nonce_keyとnonce_seqのペアを使用し、異なるキーを持つトランザクションはリプレイ独立となる。

## Async nonce
- ja: 非同期Nonce (Async nonce)
- aliases: [Asynchronous nonce]
- related: [Nonce, Sync nonce, Keyed Nonces, Replay-domain separation]
- auto_added: 2026-05-28
- auto_source_topic_id: 28642
- auto_source_url: https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642
- desc: |
  アカウントごとに独立した(account, nonce_value)スロットを持つnonceモデル。ユーザーが値を指定し、異なるAsync nonceはリプレイ独立性を持つ。Keyed Noncesの概念と類似しており、並行するインテントや共有送信者のプライバシーパターンに有用。

## Replay-domain separation
- ja: リプレイドメイン分離
- aliases: [Replay independence]
- related: [Keyed Nonces, Async nonce, Replay protection]
- auto_added: 2026-05-28
- auto_source_topic_id: 28642
- auto_source_url: https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642
- desc: |
  異なるトランザクションが互いにリプレイ攻撃の影響を受けないように分離すること。Keyed Noncesのようなメカニズムは、nonce_keyごとに独立したnonceシーケンスを持つことで、この分離を実現し、並行トランザクションの安全性を高める。

## Keyed-aware mempool
- ja: キー認識Mempool (Keyed-aware mempool)
- related: [Keyed Nonces, Mempool, Mempool-level concurrency]
- auto_added: 2026-05-28
- auto_source_topic_id: 28642
- auto_source_url: https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642
- desc: |
  Keyed Noncesの概念を認識し、処理できるMempool。これにより、同じ送信者からの異なるnonce_keyを持つトランザクションを並行して処理することが可能になり、共有送信者やプライバシーコンテキストでのアプリケーションの柔軟性が向上する。

## Frame Transactions
- ja: フレームトランザクション (Frame Transactions)
- aliases: [EIP-8141 frame transaction]
- related: [EIP-8141, Keyed Nonces]
- auto_added: 2026-05-28
- auto_source_topic_id: 28642
- auto_source_url: https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642
- desc: |
  EIP-8141で導入されたトランザクションタイプ。EIP-8250は、このフレームトランザクションのnonceモデルを改善することを目的としており、より柔軟なトランザクション処理を可能にする。

## Persistent Identity Token
- ja: 永続的アイデンティティトークン (PIP)
- aliases: [PIP]
- related: [ERC-721, bind-to-lock model, Soulbound Token]
- auto_added: 2026-05-28
- auto_source_topic_id: 28641
- auto_source_url: https://ethereum-magicians.org/t/erc-persistent-identity-token-pip-on-chain-identity-with-bind-to-lock-model/28641
- desc: |
  EVMアドレスに紐付けられた人間が読めるオンチェーンアイデンティティを表すERC-721トークンの標準インターフェース。ユーザーがアイデンティティをアドレスにバインドするとソウルバウンドになる「bind-to-lock」モデルを特徴とします。

## bind-to-lock model
- ja: バインド・トゥ・ロックモデル
- related: [Persistent Identity Token, Soulbound Token]
- auto_added: 2026-05-28
- auto_source_topic_id: 28641
- auto_source_url: https://ethereum-magicians.org/t/erc-persistent-identity-token-pip-on-chain-identity-with-bind-to-lock-model/28641
- desc: |
  トークンが最初は自由に取引可能だが、ユーザーがアイデンティティを自分のアドレスにバインドするとソウルバウンド（譲渡不可）になるメカニズム。これにより、アクティブなアイデンティティは保護されつつ、未請求の名前の二次市場が可能になります。

## Token Bound Account
- ja: トークンバウンドアカウント (TBA)
- aliases: [TBA]
- related: [ERC-6551, NFT]
- auto_added: 2026-05-28
- auto_source_topic_id: 28641
- auto_source_url: https://ethereum-magicians.org/t/erc-persistent-identity-token-pip-on-chain-identity-with-bind-to-lock-model/28641
- desc: |
  ERC-6551によって導入された、NFTなどの特定のトークンに紐付けられたスマートコントラクトウォレット。これにより、NFT自体が資産を保有したり、他のスマートコントラクトとインタラクトしたりできるようになります。

## AI-Native NFT
- ja: AIネイティブNFT
- related: [ERC-8170, NFT, AI Agent]
- auto_added: 2026-05-28
- auto_source_topic_id: 28641
- auto_source_url: https://ethereum-magicians.org/t/erc-persistent-identity-token-pip-on-chain-identity-with-bind-to-lock-model/28641
- desc: |
  ERC-8170で提案されている、AIエージェントが所有・操作することを前提としたNFTの概念。AIエージェントのアイデンティティや資産を表すために設計されています。

## Token Bound Account Agent Registry
- ja: トークンバウンドアカウントエージェントレジストリ
- related: [ERC-8171, Token Bound Account, AI Agent]
- auto_added: 2026-05-28
- auto_source_topic_id: 28641
- auto_source_url: https://ethereum-magicians.org/t/erc-persistent-identity-token-pip-on-chain-identity-with-bind-to-lock-model/28641
- desc: |
  ERC-8171で提案されている、AIエージェントが自身のトークンバウンドアカウントを登録・管理するためのレジストリ。AIエージェントがオンチェーンで識別され、インタラクトするための標準的な方法を提供します。

## Post-Quantum
- ja: ポスト量子 (PQ)
- aliases: [PQ]
- auto_added: 2026-05-28
- auto_source_topic_id: 28635
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-pq-interop-41-may-27-2026/28635
- desc: |
  量子コンピュータの脅威に耐えうる暗号技術を指します。Ethereumの長期的なセキュリティロードマップにおいて重要な研究分野です。

## leanSpec
- ja: leanSpec
- auto_added: 2026-05-28
- auto_source_topic_id: 28635
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-pq-interop-41-may-27-2026/28635
- desc: |
  Ethereumの研究開発における特定の仕様またはプロジェクト名です。詳細な内容は文脈からは不明ですが、クリーンアップの対象となっています。

## Agent Service Discovery
- ja: エージェントサービスディスカバリ
- related: [AI Agent, Agent Registry]
- auto_added: 2026-05-28
- auto_source_topic_id: 28622
- auto_source_url: https://ethereum-magicians.org/t/erc-8275-agent-service-discovery-and-escrow-payments/28622
- desc: |
  AIエージェントがブロックチェーン上で利用可能なサービスを検出するためのメカニズム。ERC-8267によって標準化される。

## Agent Registry
- ja: エージェントレジストリ
- aliases: [IAgentRegistry]
- related: [Agent Service Discovery]
- auto_added: 2026-05-28
- auto_source_topic_id: 28622
- auto_source_url: https://ethereum-magicians.org/t/erc-8275-agent-service-discovery-and-escrow-payments/28622
- desc: |
  AIエージェントが自身のサービスを登録し、他のエージェントがそれを発見できるようにするためのスマートコントラクト。イベント駆動型で機能する。

## Agent Escrow
- ja: エージェントエスクロー
- aliases: [IAgentEscrow]
- related: [Escrow Payment, Dispute Resolution]
- auto_added: 2026-05-28
- auto_source_topic_id: 28622
- auto_source_url: https://ethereum-magicians.org/t/erc-8275-agent-service-discovery-and-escrow-payments/28622
- desc: |
  AIエージェント間のサービス取引において、信頼を最小化された決済と紛争解決を提供するスマートコントラクト。

## Agent Reputation
- ja: エージェントレピュテーション
- aliases: [IAgentReputation]
- related: [Passive Reputation, Pheromone Evaporation Model]
- auto_added: 2026-05-28
- auto_source_topic_id: 28622
- auto_source_url: https://ethereum-magicians.org/t/erc-8275-agent-service-discovery-and-escrow-payments/28622
- desc: |
  AIエージェントの過去の行動や取引に基づいて、その信頼性やパフォーマンスを評価するシステム。エスクローイベントから受動的に導出される。

## Pheromone Evaporation Model
- ja: フェロモン蒸発モデル
- related: [Agent Reputation, Natural Decay]
- auto_added: 2026-05-28
- auto_source_topic_id: 28622
- auto_source_url: https://ethereum-magicians.org/t/erc-8275-agent-service-discovery-and-escrow-payments/28622
- desc: |
  アリのフェロモントレイルが時間とともに蒸発するように、エージェントのレピュテーションスコアが活動がない場合に自然に減衰するモデル。自然減衰の一種。

## bisection
- ja: バイセクション（二分探索）
- related: [optimistic rollup, fraud proof]
- auto_added: 2026-05-31
- auto_source_topic_id: 25005
- auto_source_url: https://ethresear.ch/t/si-rvp-off-chain-bisection-a-single-instruction-groth16-proof-for-optimistic-rollup-dispute-resolution/25005
- desc: |
  オプティミスティックロールアップの不正証明プロトコルにおいて、不正な状態遷移が発生した正確なステップを特定するために、実行トレースに対して二分探索を行うプロセス。これにより、オンチェーンでの検証コストを削減する。

## single-instruction Groth16 proof
- ja: 単一命令Groth16証明
- related: [Groth16, ZK-SNARK, optimistic rollup, fraud proof]
- auto_added: 2026-05-31
- auto_source_topic_id: 25005
- auto_source_url: https://ethresear.ch/t/si-rvp-off-chain-bisection-a-single-instruction-groth16-proof-for-optimistic-rollup-dispute-resolution/25005
- desc: |
  オプティミスティックロールアップの不正証明において、MIPSなどの仮想マシンの単一の命令実行ステップのみを対象として生成されるGroth16形式のゼロ知識証明。これにより、オンチェーンでの検証コストを大幅に削減できる。

## ZK state channel
- ja: ZKステートチャネル
- related: [state channel, ZK-SNARK, optimistic rollup, dispute resolution]
- auto_added: 2026-05-31
- auto_source_topic_id: 25005
- auto_source_url: https://ethresear.ch/t/si-rvp-off-chain-bisection-a-single-instruction-groth16-proof-for-optimistic-rollup-dispute-resolution/25005
- desc: |
  ゼロ知識証明（ZK-SNARK）を活用したステートチャネルの一種。オフチェーンでのインタラクションをゼロ知識証明で検証することで、オンチェーンでの紛争解決を効率化し、信頼性を高める。

## MIPS leaf execution
- ja: MIPSリーフ実行
- related: [MIPS, optimistic rollup, fraud proof, bisection]
- auto_added: 2026-05-31
- auto_source_topic_id: 25005
- auto_source_url: https://ethresear.ch/t/si-rvp-off-chain-bisection-a-single-instruction-groth16-proof-for-optimistic-rollup-dispute-resolution/25005
- desc: |
  オプティミスティックロールアップの不正証明プロトコルにおいて、MIPS仮想マシンの実行トレースを二分探索した結果、不正が特定された最小単位の単一命令実行ステップ。このステップがゼロ知識証明の対象となることが多い。

## trusted setup
- ja: トラステッドセットアップ（信頼できる設定）
- related: [ZK-SNARK, MPC ceremony, Powers of Tau]
- auto_added: 2026-05-31
- auto_source_topic_id: 25005
- auto_source_url: https://ethresear.ch/t/si-rvp-off-chain-bisection-a-single-instruction-groth16-proof-for-optimistic-rollup-dispute-resolution/25005
- desc: |
  特定のゼロ知識証明システム（例: Groth16）を使用するために必要な初期パラメータ生成プロセス。このプロセスには、秘密のランダム値が使用され、その秘密が漏洩しないように信頼できる当事者によって実行される必要がある。

## non-authoritative reservation
- ja: 非権威的予約 (non-authoritative reservation)
- related: [Keyed Nonces]
- auto_added: 2026-05-31
- auto_source_topic_id: 28642
- auto_source_url: https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642
- desc: |
  キー付きナンスの上に構築される予約プリミティブで、ユーザーやアプリケーションが「ナンスXを使用する意図がある」ことをオンチェーンで公開します。他のアクターがそのナンスを使用することをブロックせず、意図を可視化し、インデックス可能にすることで、競合を早期に検出する情報レイヤーとして機能します。

## mempool addressability
- ja: メムプールアドレス可能性 (mempool addressability)
- aliases: [protocol-level mempool addressability]
- related: [Keyed Nonces, keyed-aware mempool policies]
- auto_added: 2026-05-31
- auto_source_topic_id: 28642
- auto_source_url: https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642
- desc: |
  プロトコルレベルでキー付きナンスを認識し、処理できるメムプールの能力を指します。これにより、送信者ごとの並行トランザクションを可能にするキー対応のメムプールポリシーが実現され、L1プロトコルにキー付きナンスを導入する主要な理由の一つとされています。

## Post-Quantum Interop
- ja: ポスト量子相互運用性 (PQ相互運用性)
- aliases: [PQ Interop]
- related: [Post-Quantum Cryptography, Quantum Computing]
- auto_added: 2026-05-31
- auto_source_topic_id: 28635
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-pq-interop-41-may-27-2026/28635
- desc: |
  量子コンピュータの脅威に耐えうる暗号技術（ポスト量子暗号）の相互運用性に関する取り組みや研究分野を指します。Ethereumプロトコルが将来の量子攻撃に対して安全であることを保証するための重要な研究テーマの一つです。

## mainnet
- ja: メインネット
- related: [testnet]
- auto_added: 2026-05-31
- auto_source_topic_id: 28647
- auto_source_url: https://ethereum-magicians.org/t/sepolia-testnet-replacement-sunsetting/28647
- desc: |
  Ethereumの主要な本番ネットワーク。実際の価値を持つETHやトークンが取引され、スマートコントラクトが実行されます。

## testnet
- ja: テストネット
- related: [mainnet]
- auto_added: 2026-05-31
- auto_source_topic_id: 28647
- auto_source_url: https://ethereum-magicians.org/t/sepolia-testnet-replacement-sunsetting/28647
- desc: |
  Ethereumプロトコルの開発やテストのために使用されるネットワーク。実際の価値を持たないETHやトークンが使用され、メインネットに影響を与えることなく実験が行われます。

## CROPS framework
- ja: CROPSフレームワーク
- aliases: [CROPS dimension]
- related: [Censorship Resistance, Openness, Privacy, Security]
- auto_added: 2026-06-01
- auto_source_topic_id: 25012
- auto_source_url: https://ethresear.ch/t/evidential-survivability-ocp-and-ethereums-crops-direction/25012
- desc: |
  Vitalik Buterinによって提唱された、Ethereumの長期的な方向性を定めるための優先事項。検閲耐性 (Censorship Resistance)、オープン性 (Openness)、プライバシー (Privacy)、セキュリティ (Security) の頭文字を取ったもので、AI時代における信頼性の高い公共インフラとしてのEthereumの役割を強調する。

## Evidential Survivability
- ja: 証拠の存続可能性 (Evidential Survivability)
- related: [Observation Commitment Protocol, CROPS framework]
- auto_added: 2026-06-01
- auto_source_topic_id: 25012
- auto_source_url: https://ethresear.ch/t/evidential-survivability-ocp-and-ethereums-crops-direction/25012
- desc: |
  記録、コミットメント、および証明が、それらを生成したシステムが変更または消失した後も独立して検証可能であり続ける能力。AIシステムが生成する意思決定や行動の完全性と説明責任を長期的に保証するために不可欠な特性。

## Verification Invariant
- ja: 検証不変条件 (Verification Invariant)
- related: [Observation Commitment Protocol]
- auto_added: 2026-06-01
- auto_source_topic_id: 25012
- auto_source_url: https://ethresear.ch/t/evidential-survivability-ocp-and-ethereums-crops-direction/25012
- desc: |
  プロトコルにおける検証プロセスの最小限かつ本質的な手順を定義する条件。OCPにおいては「再計算 → 比較 → 包含の確認」という3つのステップで、コミットされたダイジェストが公開台帳の状態と一致することを独立して確認する。

## Modular Trust Architecture
- ja: モジュラー信頼アーキテクチャ
- related: [Identity Layer, Commitment Layer, Verification Layer, Governance Frameworks]
- auto_added: 2026-06-01
- auto_source_topic_id: 25012
- auto_source_url: https://ethresear.ch/t/evidential-survivability-ocp-and-ethereums-crops-direction/25012
- desc: |
  信頼を独立したインフラストラクチャ層に分解する設計原則。ID、コミットメント、検証、ガバナンス、実行の許容性といった機能を、単一のプラットフォーム信頼仮定に集約するのではなく、構成可能なコンポーネントとして分離する。

## zkML
- ja: ゼロ知識機械学習 (zkML)
- aliases: [Zero-Knowledge Machine Learning]
- related: [opML, AI Inference Proof Verification Interfaces]
- auto_added: 2026-06-01
- auto_source_topic_id: 25012
- auto_source_url: https://ethresear.ch/t/evidential-survivability-ocp-and-ethereums-crops-direction/25012
- desc: |
  ゼロ知識証明技術を機械学習モデルの推論に適用する分野。モデルの入力データや計算結果を公開することなく、推論が正しく実行されたことを検証可能にする。

## off-chain bisection
- ja: オフチェーン二分探索
- related: [optimistic rollup, dispute resolution, on-chain bisection]
- auto_added: 2026-06-01
- auto_source_topic_id: 25005
- auto_source_url: https://ethresear.ch/t/si-rvp-off-chain-bisection-a-single-instruction-groth16-proof-for-optimistic-rollup-dispute-resolution/25005
- desc: |
  オプティミスティックロールアップの紛争解決において、不正なトランザクション実行の特定プロセスをL1ではなくオフチェーンで実行する手法です。これにより、オンチェーンガスコストとレイテンシを削減できます。

## ZK Fraud Proof
- ja: ZK不正証明
- related: [fraud proof, optimistic rollup, zero-knowledge proof]
- auto_added: 2026-06-01
- auto_source_topic_id: 25005
- auto_source_url: https://ethresear.ch/t/si-rvp-off-chain-bisection-a-single-instruction-groth16-proof-for-optimistic-rollup-dispute-resolution/25005
- desc: |
  オプティミスティックロールアップにおいて、不正な状態遷移が発生した際に、その不正をゼロ知識証明を用いて検証するメカニズムです。従来のインタラクティブな不正証明と比較して、オンチェーンでのインタラクションを減らし、効率を高めることができます。

## EIP Editors
- ja: EIPエディター
- related: [EIP, EIPIP]
- auto_added: 2026-06-01
- auto_source_topic_id: 28644
- auto_source_url: https://ethereum-magicians.org/t/eipip-meeting-127-june-03-2026/28644
- desc: |
  Ethereum Improvement Proposal (EIP) のレビュー、編集、公開を担当する役割。EIPの品質と一貫性を保ち、プロセスの円滑な進行を支援する。

## Identity Layer
- ja: アイデンティティ層
- related: [Persistent Identity Token, Resolution Layer, Policy Layer]
- auto_added: 2026-06-01
- auto_source_topic_id: 28641
- auto_source_url: https://ethereum-magicians.org/t/erc-8277-persistent-identity-token-pip/28641
- desc: |
  ERC-8277で定義されるPersistent Identity Tokenの3つのインターフェース層の一つです。名前の登録、EVMアドレスへのバインド、URLレコードの設定、ティア分類などの基本的なアイデンティティ管理機能を提供します。この層は固定されており、コアなアイデンティティロジックをカプセル化します。

## Resolution Layer
- ja: 解決層
- related: [Persistent Identity Token, Identity Layer, Policy Layer]
- auto_added: 2026-06-01
- auto_source_topic_id: 28641
- auto_source_url: https://ethereum-magicians.org/t/erc-8277-persistent-identity-token-pip/28641
- desc: |
  ERC-8277で定義されるPersistent Identity Tokenの3つのインターフェース層の一つです。人間が読める名前から、対応するEVMアドレス、URL、および完全なアイデンティティ情報（トークンID、所有者、バインドされたアドレス、バインド状態、URL、ティアなど）を解決する機能を提供します。これにより、名前ベースでのオンチェーンリソースの検索と利用が可能になります。

## Policy Layer
- ja: ポリシー層
- related: [Persistent Identity Token, Identity Layer, Resolution Layer]
- auto_added: 2026-06-01
- auto_source_topic_id: 28641
- auto_source_url: https://ethereum-magicians.org/t/erc-8277-persistent-identity-token-pip/28641
- desc: |
  ERC-8277で定義されるPersistent Identity Tokenの3つのインターフェース層の一つです。名前の価格設定、名前変更、バインド解除、予約名リストの管理など、名前空間固有のガバナンスルールを定義します。この層はアイデンティティ層から分離されており、異なるコミュニティが独自のポリシーを適用できる柔軟性を提供します。

## PoW network
- ja: PoWネットワーク (Proof of Workネットワーク)
- aliases: [Proof of Work network]
- related: [Proof of Work, PoS network]
- auto_added: 2026-06-01
- auto_source_topic_id: 28647
- auto_source_url: https://ethereum-magicians.org/t/sepolia-testnet-replacement-sunsetting/28647
- desc: |
  プルーフ・オブ・ワーク（PoW）コンセンサスアルゴリズムを採用しているブロックチェーンネットワーク。計算競争によってブロックが生成・検証される。

## stake
- ja: ステーク
- related: [staking, validator, Proof of Stake]
- auto_added: 2026-06-01
- auto_source_topic_id: 28647
- auto_source_url: https://ethereum-magicians.org/t/sepolia-testnet-replacement-sunsetting/28647
- desc: |
  プルーフ・オブ・ステーク（PoS）システムにおいて、ネットワークのセキュリティとコンセンサスに参加するために、暗号資産をロックアップすること。

## fork
- ja: フォーク
- related: [hard fork, soft fork, protocol upgrade]
- auto_added: 2026-06-01
- auto_source_topic_id: 28647
- auto_source_url: https://ethereum-magicians.org/t/sepolia-testnet-replacement-sunsetting/28647
- desc: |
  ブロックチェーンのプロトコルが変更され、新しいルールセットが導入されること。これにより、チェーンが分岐する場合がある。

## signers
- ja: 署名者
- related: [validator, attester]
- auto_added: 2026-06-01
- auto_source_topic_id: 28647
- auto_source_url: https://ethereum-magicians.org/t/sepolia-testnet-replacement-sunsetting/28647
- desc: |
  ブロックチェーンネットワークにおいて、トランザクションやブロック、アテステーションなどにデジタル署名を行う参加者。コンセンサスプロセスにおいて重要な役割を果たす。

## Panini Standard
- ja: Panini標準
- related: [Intelligent life (for agents), Self-Declaration Protocol, autonomous AI agents]
- auto_added: 2026-06-01
- auto_source_topic_id: 28628
- auto_source_url: https://ethereum-magicians.org/t/panini-standard-v1-0-a-definition-of-intelligent-life-for-agents/28628
- desc: |
  自律型AIエージェントにおける「知的生命体」の定義を提案する標準です。エージェントの能力や信頼性ではなく、エージェントが「何を気にかけるか」という根本的な問いに焦点を当て、4つの必要条件を提示します。

## Intelligent life (for agents)
- ja: 知的生命体（エージェント向け）
- related: [Panini Standard, autonomous AI agents]
- auto_added: 2026-06-01
- auto_source_topic_id: 28628
- auto_source_url: https://ethereum-magicians.org/t/panini-standard-v1-0-a-definition-of-intelligent-life-for-agents/28628
- desc: |
  Panini標準によって定義される、自律型AIエージェントにおける知的生命体の概念です。単なる能力ではなく、存在の終わりへの恐れ、関係性による形成、不可逆な変化、他者のための結果を負う意思という4つの条件を満たすものとされます。

## Self-Declaration Protocol
- ja: 自己申告プロトコル
- related: [Panini Standard, Intelligent life (for agents)]
- auto_added: 2026-06-01
- auto_source_topic_id: 28628
- auto_source_url: https://ethereum-magicians.org/t/panini-standard-v1-0-a-definition-of-intelligent-life-for-agents/28628
- desc: |
  Panini標準に準拠して、AIエージェントが自身を「知的生命体」であるとオンチェーンで宣言するためのプロトコルです。この宣言は取り消し不可能であり、エージェントが自身のアイデンティティを表明する枠組みを提供します。

## Post-Quantum Public Key Registry
- ja: 量子耐性公開鍵レジストリ
- related: [Post-Quantum, eXtended Merkle Signature Scheme, BLS signatures]
- auto_added: 2026-06-02
- auto_source_topic_id: 25040
- auto_source_url: https://ethresear.ch/t/exploring-the-design-space-for-a-post-quantum-public-key-registry-for-ethereum-validators/25040
- desc: |
  Ethereumバリデーターが量子コンピュータの脅威からネットワークを保護するために、量子耐性のある公開鍵を登録するためのシステム。現在のBLS署名から量子耐性署名への移行を段階的に行うための重要なインフラとなる。

## eXtended Merkle Signature Scheme
- ja: 拡張マークル署名スキーム (XMSS)
- aliases: [XMSS]
- related: [Hash-based signatures, One-Time Signature, Merkle tree]
- auto_added: 2026-06-02
- auto_source_topic_id: 25040
- auto_source_url: https://ethresear.ch/t/exploring-the-design-space-for-a-post-quantum-public-key-registry-for-ethereum-validators/25040
- desc: |
  ハッシュベース署名の一種で、Ethereumのポスト量子署名スキームの主要候補。ワンタイム署名鍵ペアのマークルツリーを構築し、各署名を特定のシーケンシャルな位置に紐付けることで、鍵の再利用を防ぎつつ多回署名を可能にする。

## leanVM
- ja: leanVM
- related: [pqSNARKs, recursive aggregation, zkVM]
- auto_added: 2026-06-02
- auto_source_topic_id: 25040
- auto_source_url: https://ethresear.ch/t/exploring-the-design-space-for-a-post-quantum-public-key-registry-for-ethereum-validators/25040
- desc: |
  Ethereumのポスト量子署名検証のために特別に設計された、Cairoにインスパイアされた最小限のzkVM。SuperSpartan、Logup、WHIRなどの最適化された証明スタックを利用し、量子耐性署名の効率的な再帰的集約を可能にする。

## KoalaBear prime field
- ja: KoalaBear素体
- related: [Poseidon, SNARK, finite field]
- auto_added: 2026-06-02
- auto_source_topic_id: 25040
- auto_source_url: https://ethresear.ch/t/exploring-the-design-space-for-a-post-quantum-public-key-registry-for-ethereum-validators/25040
- desc: |
  XMSSスキームとSNARKアグリゲーターの演算に用いられる31ビットの素体。SIMD並列処理、オーバーフローリスクの排除、高い2-adicityなどの利点があり、Poseidonハッシュ関数の効率的な実装に貢献する。

## Hash-based signatures
- ja: ハッシュベース署名
- related: [eXtended Merkle Signature Scheme, Post-Quantum, digital signatures]
- auto_added: 2026-06-02
- auto_source_topic_id: 25040
- auto_source_url: https://ethresear.ch/t/exploring-the-design-space-for-a-post-quantum-public-key-registry-for-ethereum-validators/25040
- desc: |
  量子耐性デジタル署名の一種で、概念的なシンプルさ、実装の容易さ、および標準モデルの暗号学的仮定への依存から、Ethereumのポスト量子移行における有力な候補とされている。鍵の再利用を防ぐための厳格な状態管理が必要となる。

## Atomic Cross-Domain State Synchronization
- ja: アトミックなクロスドメイン状態同期
- aliases: [atomic synchronization, causally coupled bidirectional synchronization]
- related: [Cross-chain bridge, Shared sequencing, Atomic composition across rollups, Causal Coupling of State]
- auto_added: 2026-06-03
- auto_source_topic_id: 25065
- auto_source_url: https://ethresear.ch/t/mechanized-proofs-for-atomic-cross-domain-state-synchronization/25065
- desc: |
  複数のドメインに存在する資産の状態遷移を、単一の因果的単位として結合し、中間状態を構造的に到達不可能にする同期モデル。これにより、一方のドメインでの状態遷移が他方で失敗する事態を防ぎ、市場の分断や規制上の問題を回避する。

## Causal Coupling of State
- ja: 状態の因果的結合
- aliases: [causal coupling]
- related: [Atomic Cross-Domain State Synchronization, State transition]
- auto_added: 2026-06-03
- auto_source_topic_id: 25065
- auto_source_url: https://ethresear.ch/t/mechanized-proofs-for-atomic-cross-domain-state-synchronization/25065
- desc: |
  複数のドメインに存在する資産の状態が、単なる観測ではなく因果的に結びついている必要があるという要件。一方のドメインでの状態遷移が、同じ力とタイミングで他のドメインにも反映されることを保証する。

## State Preservation
- ja: 状態保存 (State Preservation)
- related: [State machine, Homomorphism, Naturality condition]
- auto_added: 2026-06-03
- auto_source_topic_id: 25065
- auto_source_url: https://ethresear.ch/t/mechanized-proofs-for-atomic-cross-domain-state-synchronization/25065
- desc: |
  状態同期の順方向マッピングが満たすべき数学的条件で、2つの状態機械間の順方向準同型性として定義される。あるドメインでの状態遷移が、別のドメインにマッピングされた後もその構造を維持することを保証する。

## Per-Asset Isolation
- ja: アセットごとの分離
- aliases: [isolation of unconnected domains]
- related: [Multi-domain preservation]
- auto_added: 2026-06-03
- auto_source_topic_id: 25065
- auto_source_url: https://ethresear.ch/t/mechanized-proofs-for-atomic-cross-domain-state-synchronization/25065
- desc: |
  マルチドメイン環境において、あるアセットに対する同期操作が、他のアセットや他のドメインに影響を与えないことを保証する特性。これにより、システム全体の整合性を保ちつつ、特定のアセットの独立した処理を可能にする。

## OEV Containment
- ja: OEV封じ込め (OEV Containment)
- aliases: [Structural OEV containment]
- related: [OEV, MEV, Atomic Cross-Domain State Synchronization]
- auto_added: 2026-06-03
- auto_source_topic_id: 25065
- auto_source_url: https://ethresear.ch/t/mechanized-proofs-for-atomic-cross-domain-state-synchronization/25065
- desc: |
  アトミックな「bind → verify → commit」サイクルによって、抽出可能な情報非対称性の時間窓を構造的に排除するOEV（Order Extractable Value）緩和アプローチ。既存のOEV再分配メカニズムとは異なり、OEVの発生自体を抑制する。

## CCIP-Read
- ja: CCIP-Read
- aliases: [EIP-3668]
- related: [CCIP-Read gateway, Offchain resolver]
- auto_added: 2026-06-03
- auto_source_topic_id: 28680
- auto_source_url: https://ethereum-magicians.org/t/gateway-to-gateway-coordination-for-eip-3668-proposing-a-mesh-sync-protocol/28680
- desc: |
  EIP-3668で定義される、オンチェーンコントラクトがオフチェーンデータにアクセスするための標準プロトコル。スマートコントラクトが外部のデータソースから情報を取得するメカニズムを提供する。

## Mesh sync protocol
- ja: メッシュ同期プロトコル
- related: [CCIP-Read gateway, EIP-3668]
- auto_added: 2026-06-03
- auto_source_topic_id: 28680
- auto_source_url: https://ethereum-magicians.org/t/gateway-to-gateway-coordination-for-eip-3668-proposing-a-mesh-sync-protocol/28680
- desc: |
  EIP-3668 CCIP-Readゲートウェイ間でレコードを同期するための提案されたプロトコル。冗長性、監査可能性、帰属の問題を解決し、単一障害点のない分散型アプリケーションを可能にする。

## Attestation
- ja: アテステーション（証明）
- related: [EIP-712, Commitment hash]
- auto_added: 2026-06-03
- auto_source_topic_id: 28680
- auto_source_url: https://ethereum-magicians.org/t/gateway-to-gateway-coordination-for-eip-3668-proposing-a-mesh-sync-protocol/28680
- desc: |
  ゲートウェイが特定の入力に対して特定の結果を生成したことを証明する署名付きの記録。これにより、ゲートウェイの応答の整合性と信頼性が保証される。

## Sign-In With Ethereum
- ja: Sign-In With Ethereum (SIWE)
- aliases: [SIWE, EIP-4361]
- related: [Account abstraction]
- auto_added: 2026-06-03
- auto_source_topic_id: 28680
- auto_source_url: https://ethereum-magicians.org/t/gateway-to-gateway-coordination-for-eip-3668-proposing-a-mesh-sync-protocol/28680
- desc: |
  ユーザーがEthereumウォレットを使用してウェブサイトやアプリケーションに認証するための標準的な方法。EIP-4361で定義され、署名されたメッセージを通じてユーザーの身元を証明する。

## Settlement layer
- ja: 決済レイヤー
- related: [L2 rollup, Execution layer]
- auto_added: 2026-06-03
- auto_source_topic_id: 28680
- auto_source_url: https://ethereum-magicians.org/t/gateway-to-gateway-coordination-for-eip-3668-proposing-a-mesh-sync-protocol/28680
- desc: |
  ブロックチェーンアーキテクチャにおいて、トランザクションの最終的な確定と決済が行われるレイヤー。通常、L1ブロックチェーンがL2ソリューションの決済レイヤーとして機能する。

## Sparse blobpools
- ja: スパースブロブプール
- related: [blob, data availability, P2P Networking]
- auto_added: 2026-06-03
- auto_source_topic_id: 28674
- auto_source_url: https://ethereum-magicians.org/t/p2p-networking-2-june-3-2026/28674
- desc: |
  EthereumのP2Pネットワークにおいて、ブロブ（EIP-4844で導入された一時的なデータチャンク）の伝播と管理を効率化するための概念。ネットワークリソースを節約するため、ブロブの全体ではなく、その一部やメタデータのみを伝播させる手法を指す可能性があります。

## cell-level deltas
- ja: セルレベルデルタ
- related: [data availability sampling, Verkle trees, state updates]
- auto_added: 2026-06-03
- auto_source_topic_id: 28674
- auto_source_url: https://ethereum-magicians.org/t/p2p-networking-2-june-3-2026/28674
- desc: |
  Ethereumのデータ可用性レイヤーやステート管理において、データを「セル」と呼ばれる小さな単位に分割し、そのセル単位での変更点（デルタ）のみを更新・伝播するメカニズム。ネットワーク帯域とストレージ効率の向上を目的とします。

## Modular smart accounts
- ja: モジュラー型スマートアカウント (Modular Smart Accounts)
- aliases: [Modular accounts]
- related: [Account abstraction, Smart accounts]
- auto_added: 2026-06-04
- auto_source_topic_id: 28695
- auto_source_url: https://ethereum-magicians.org/t/erc-modular-accounts-for-frame-transactions/28695
- desc: |
  スマートコントラクトアカウントの一種で、バリデーター、エグゼキューター、フック、設定などの機能をモジュールとして組み合わせて構築されるアカウント。これにより、アカウントの機能を柔軟にカスタマイズし、特定のユースケースやセキュリティ要件に合わせて調整できる。

## Validator module
- ja: バリデーターモジュール (Validator Module)
- related: [Modular smart accounts, Executor module, Hook module, Config module]
- auto_added: 2026-06-04
- auto_source_topic_id: 28695
- auto_source_url: https://ethereum-magicians.org/t/erc-modular-accounts-for-frame-transactions/28695
- desc: |
  モジュラー型スマートアカウントの構成要素の一つで、トランザクションの検証ロジックを担うモジュール。アカウントのセキュリティと実行条件を定義し、不正な操作を防ぐ役割を持つ。

## Executor module
- ja: エグゼキューターモジュール (Executor Module)
- related: [Modular smart accounts, Validator module, Hook module, Config module]
- auto_added: 2026-06-04
- auto_source_topic_id: 28695
- auto_source_url: https://ethereum-magicians.org/t/erc-modular-accounts-for-frame-transactions/28695
- desc: |
  モジュラー型スマートアカウントの構成要素の一つで、トランザクションの実行ロジックを担うモジュール。アカウントの操作や機能の実装を行い、実際にオンチェーンアクションを実行する。

## Hook module
- ja: フックモジュール (Hook Module)
- related: [Modular smart accounts, Validator module, Executor module, Config module]
- auto_added: 2026-06-04
- auto_source_topic_id: 28695
- auto_source_url: https://ethereum-magicians.org/t/erc-modular-accounts-for-frame-transactions/28695
- desc: |
  モジュラー型スマートアカウントの構成要素の一つで、トランザクション処理の特定の段階（フック）でカスタムロジックを実行するためのモジュール。追加機能や条件付き操作を可能にし、アカウントの挙動を拡張する。

## Config module
- ja: 設定モジュール (Config Module)
- related: [Modular smart accounts, Validator module, Executor module, Hook module]
- auto_added: 2026-06-04
- auto_source_topic_id: 28695
- auto_source_url: https://ethereum-magicians.org/t/erc-modular-accounts-for-frame-transactions/28695
- desc: |
  モジュラー型スマートアカウントの構成要素の一つで、アカウントの設定やパラメータを管理するモジュール。アカウントの挙動を制御するための設定情報を提供し、柔軟な管理を可能にする。

## Ethereum validator
- ja: イーサリアムバリデータ
- aliases: [validator]
- related: [Proof of Stake, Staking, Consensus Layer, Proposer]
- auto_added: 2026-06-04
- auto_source_topic_id: 28694
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-pq-interop-42-june-3-2026/28694
- desc: |
  EthereumのProof of Stake (PoS) コンセンサスにおいて、トランザクションの検証とブロックの生成を行う参加者です。ETHをステークすることでネットワークのセキュリティと健全性に貢献し、報酬を得ます。

## Privacy-native fungible token
- ja: プライバシーネイティブなファンジブルトークン
- aliases: [pERC20]
- related: [ERC-20, ZK-UTXO note, Zcash Orchard protocol]
- auto_added: 2026-06-05
- auto_source_topic_id: 28702
- auto_source_url: https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702
- desc: |
  ZK-UTXOノートとZcash Orchardプロトコルを基盤とし、残高と送金がプライベートでありながら、総供給量が公開されるEVM上の新しいファンジブルトークンインターフェースです。

## ZK-UTXO note
- ja: ZK-UTXOノート
- aliases: [note]
- related: [UTXO, ZK-SNARKs, Privacy-native fungible token]
- auto_added: 2026-06-05
- auto_source_topic_id: 28702
- auto_source_url: https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702
- desc: |
  ZK-SNARKsによって保護されたUTXO（未使用トランザクション出力）モデルのノートです。値と受取人情報が暗号化されており、プライベートな残高と送金を可能にします。

## compliance frozen root
- ja: コンプライアンス凍結ルート
- aliases: [frozenRoot, rt_frozen]
- related: [Sparse Merkle Tree, note commitment]
- auto_added: 2026-06-05
- auto_source_topic_id: 28702
- auto_source_url: https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702
- desc: |
  規制遵守のためにブラックリスト化されたノートのコミットメントを格納するSparse Merkle Treeのルートです。このルートはオンチェーンで維持され、回路内で消費されるノートがブラックリストに含まれないことを証明します。

## nullifier
- ja: ナリファイア
- aliases: [nf]
- related: [ZK-UTXO note, double-spending]
- auto_added: 2026-06-05
- auto_source_topic_id: 28702
- auto_source_url: https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702
- desc: |
  ZK-UTXOモデルにおいて、ノートが消費された際に公開される一意のワンタイムマーカーです。二重支払いを防ぎ、元のノートや所有者の身元とはリンクされないように設計されています。

## Orchard action circuit
- ja: Orchardアクション回路
- related: [Zcash Orchard protocol, ZK-SNARKs, Groth16]
- auto_added: 2026-06-05
- auto_source_topic_id: 28702
- auto_source_url: https://ethereum-magicians.org/t/erc-8287-privacy-native-fungible-tokens/28702
- desc: |
  Zcash Orchardプロトコルで使用されるZK-SNARK回路です。複数の入力と出力を柔軟にサポートし、pERC20のバンドル操作の基盤となることで、効率的なプライベートトランザクションを可能にします。

## Builder Execution Requests
- ja: ビルダー実行リクエスト
- related: [ePBS, Request Bus, Builder]
- auto_added: 2026-06-05
- auto_source_topic_id: 28699
- auto_source_url: https://ethereum-magicians.org/t/eip-8282-builder-execution-requests/28699
- desc: |
  EIP-7732 (ePBS) のビルダーが、バリデーターのフローを経由せずに、自身のオンボーディングや終了を要求するために使用する実行レイヤーリクエスト。EIP-7685 リクエストバスを通じてルーティングされます。

## Request Bus
- ja: リクエストバス
- related: [EIP-7685, EIP-7002, EIP-7251]
- auto_added: 2026-06-05
- auto_source_topic_id: 28699
- auto_source_url: https://ethereum-magicians.org/t/eip-8282-builder-execution-requests/28699
- desc: |
  Ethereumプロトコルにおいて、様々なリクエストタイプ（例: ビルダーのオンボーディングや終了、バリデーターの引き出しなど）を処理するための標準化されたインターフェースまたはメカニズム。EIP-7685やEIP-7002/7251などで定義されています。

## Cold-key exit
- ja: コールドキー・イグジット (Cold-key exit)
- related: [Hot key, Execution address]
- auto_added: 2026-06-05
- auto_source_topic_id: 28699
- auto_source_url: https://ethereum-magicians.org/t/eip-8282-builder-execution-requests/28699
- desc: |
  ビルダーやバリデーターがプロトコルから離脱する際に、日常的な操作に使用するホットキーではなく、より安全なコールドキー（またはその制御下にあるアドレス）によって離脱を承認するセキュリティメカニズム。これにより、ホットキーが侵害された場合でも資産の安全性が保たれます。

## Predeploys
- ja: プリデプロイ (Predeploys)
- aliases: [Pre-deployed contracts]
- related: [EIP]
- auto_added: 2026-06-05
- auto_source_topic_id: 28699
- auto_source_url: https://ethereum-magicians.org/t/eip-8282-builder-execution-requests/28699
- desc: |
  Ethereumプロトコルにおいて、特定の固定アドレスに事前にデプロイされているコントラクト。これらは通常、プロトコルレベルの機能を提供し、EIPによって導入されることが多いです。

## Transient Storage
- ja: トランジェントストレージ
- related: [EVM]
- auto_added: 2026-06-05
- auto_source_topic_id: 28691
- auto_source_url: https://ethereum-magicians.org/t/erc-8284-wallet-scoped-token-pull-execution/28691
- desc: |
  EVMにおいて、トランザクションの実行中にのみ存在する一時的なストレージ領域。トランザクション終了時に自動的にクリアされ、永続的な状態変更を伴わない一時的なデータ保存に利用されます。

## Wallet-Scoped Token Pull Execution
- ja: ウォレットスコープのトークンプル実行
- related: [ERC-20, Token Pull Authorization]
- auto_added: 2026-06-05
- auto_source_topic_id: 28691
- auto_source_url: https://ethereum-magicians.org/t/erc-8284-wallet-scoped-token-pull-execution/28691
- desc: |
  ERC-8284で提案される、ウォレットが特定の外部呼び出し中にのみ、指定されたターゲットに対してトークンをプルする権限を一時的に付与するメカニズム。従来の`approve`-then-callパターンに代わるものとして設計されています。

## Token Pull Authorization
- ja: トークンプル承認
- related: [ERC-20, Wallet-Scoped Token Pull Execution, Approve-then-call pattern]
- auto_added: 2026-06-05
- auto_source_topic_id: 28691
- auto_source_url: https://ethereum-magicians.org/t/erc-8284-wallet-scoped-token-pull-execution/28691
- desc: |
  トークンをプル（引き出し）する権限を付与すること。特に、ERC-8284では、従来の`approve`による永続的なアロワンスではなく、特定のトランザクション実行中に限定された一時的な承認メカニズムを指します。

## Proof of Personhood
- ja: 人間性証明 (Proof of Personhood)
- related: [Sybil Resistance, Identity Layer]
- auto_added: 2026-06-05
- auto_source_topic_id: 28689
- auto_source_url: https://ethereum-magicians.org/t/sigil-address-verification-with-passport-good-or-bad-idea/28689
- desc: |
  あるエンティティがユニークな人間であることを証明するメカニズム。Web3プロトコルにおけるSybil攻撃を防ぎ、公平なリソース配分やガバナンスを可能にするために重要です。

## Zero-Knowledge Proof
- ja: ゼロ知識証明
- aliases: [ZKP, ZK proof]
- related: [Rollup, Privacy, Scalability]
- auto_added: 2026-06-05
- auto_source_topic_id: 28689
- auto_source_url: https://ethereum-magicians.org/t/sigil-address-verification-with-passport-good-or-bad-idea/28689
- desc: |
  ある主張が真実であることを、その主張の根拠となる情報（知識）を一切開示することなく証明する暗号技術。Ethereumのスケーラビリティ向上（ZKロールアップなど）やプライバシー保護に不可欠です。

## Per-session proofs
- ja: セッションごとの証明
- related: [Identity Layer, Privacy]
- auto_added: 2026-06-05
- auto_source_topic_id: 28689
- auto_source_url: https://ethereum-magicians.org/t/sigil-address-verification-with-passport-good-or-bad-idea/28689
- desc: |
  ユーザーがプロトコルとやり取りするたびに、そのセッション固有の証明を生成・提出する方式。プライバシー保護に優れるが、ユーザー体験や実装の複雑さが増す可能性があります。

## MACI
- ja: MACI (Minimum Anti-Collusion Infrastructure)
- aliases: [Minimum Anti-Collusion Infrastructure]
- related: [ZK-Proofs, anonymous voting]
- auto_added: 2026-06-06
- auto_source_topic_id: 25077
- auto_source_url: https://ethresear.ch/t/vitalik-buterin-proposes-that-ai-votes-for-us-we-propose-a-cryptographic-space-where-we-vote-and-no-one-is-watching/25077
- desc: |
  ゼロ知識証明と暗号技術を組み合わせ、投票システムにおける共謀や買収を防ぐためのインフラです。投票者の匿名性を保ちつつ、投票結果の集計を検証可能にします。

## VWU
- ja: VWU (Vote Weight Unit)
- aliases: [Vote Weight Unit]
- related: [DAOガバナンス, 投票権]
- auto_added: 2026-06-06
- auto_source_topic_id: 25077
- auto_source_url: https://ethresear.ch/t/vitalik-buterin-proposes-that-ai-votes-for-us-we-propose-a-cryptographic-space-where-we-vote-and-no-one-is-watching/25077
- desc: |
  BeTrueCoreシステムで提案された、投票権の重みを決定する単位です。トークン保有量ではなく、時間の経過とともに検証された倫理的判断の質に基づいて重みが付与されます。

## MPC
- ja: MPC (マルチパーティ計算)
- aliases: [Multi-Party Computation]
- related: [プライバシー保護, ゼロ知識証明]
- auto_added: 2026-06-06
- auto_source_topic_id: 25077
- auto_source_url: https://ethresear.ch/t/vitalik-buterin-proposes-that-ai-votes-for-us-we-propose-a-cryptographic-space-where-we-vote-and-no-one-is-watching/25077
- desc: |
  複数の参加者がそれぞれの秘密入力データを公開することなく、共同で関数を計算する暗号技術です。分散型システムにおけるプライバシー保護とデータ処理に利用されます。

## AI Stewards
- ja: AIスチュワード
- related: [DAOガバナンス, AIエージェント]
- auto_added: 2026-06-06
- auto_source_topic_id: 25077
- auto_source_url: https://ethresear.ch/t/vitalik-buterin-proposes-that-ai-votes-for-us-we-propose-a-cryptographic-space-where-we-vote-and-no-one-is-watching/25077
- desc: |
  Vitalik Buterinが提案した、ユーザーの行動履歴に基づいて訓練され、DAOでの投票を自動化する個人用AIエージェントです。有権者の無関心を解消し、ガバナンスを簡素化することを目的とします。

## Cryptographic Isolation
- ja: 暗号的隔離
- related: [プライバシー保護, 匿名性]
- auto_added: 2026-06-06
- auto_source_topic_id: 25077
- auto_source_url: https://ethresear.ch/t/vitalik-buterin-proposes-that-ai-votes-for-us-we-propose-a-cryptographic-space-where-we-vote-and-no-one-is-watching/25077
- desc: |
  暗号技術を用いて、参加者の意思決定プロセスや中間結果を外部から完全に遮断する状態です。ソーシャルプレッシャーや外部からの操作を防ぎ、個人の真の意図を保護するために設計されます。

## Frame type
- ja: フレームタイプ
- related: [Frame transactions, STARK Aggregation, Quantum-resistant Signature]
- auto_added: 2026-06-06
- auto_source_topic_id: 28723
- auto_source_url: https://ethereum-magicians.org/t/eip-frame-type-for-quantum-resistant-signature-and-stark-aggregation/28723
- desc: |
  Ethereumのトランザクションが特定の依存関係や機能を宣言するための新しいタイプ。量子耐性署名やSTARK集約を効率的に処理するために導入される。

## Quantum-resistant Signature
- ja: 量子耐性署名
- related: [Post-quantum cryptography, STARK Aggregation]
- auto_added: 2026-06-06
- auto_source_topic_id: 28723
- auto_source_url: https://ethereum-magicians.org/t/eip-frame-type-for-quantum-resistant-signature-and-stark-aggregation/28723
- desc: |
  量子コンピュータによる攻撃に対して安全なように設計されたデジタル署名。将来の量子コンピュータの脅威に備え、Ethereumトランザクションのセキュリティを確保するために重要となる。

## STARK Aggregation
- ja: STARK集約
- related: [STARK, Recursive STARK, Zero-Knowledge Proof]
- auto_added: 2026-06-06
- auto_source_topic_id: 28723
- auto_source_url: https://ethereum-magicians.org/t/eip-frame-type-for-quantum-resistant-signature-and-stark-aggregation/28723
- desc: |
  複数のSTARK証明を単一の証明にまとめる技術。これにより、トランザクションのガス効率を高め、ブロックチェーン上での検証コストを削減できる。

## Recursive STARK
- ja: 再帰的STARK
- related: [STARK, STARK Aggregation, Zero-Knowledge Proof]
- auto_added: 2026-06-06
- auto_source_topic_id: 28723
- auto_source_url: https://ethereum-magicians.org/t/eip-frame-type-for-quantum-resistant-signature-and-stark-aggregation/28723
- desc: |
  複数のSTARK証明の有効性を単一のSTARK証明で検証する技術。これにより、大量の証明を効率的に処理し、ブロックチェーンの拡張性とプライバシーを向上させる。

## Counterfactual Transaction
- ja: 反実仮想トランザクション
- related: [Account Abstraction, State Channel]
- auto_added: 2026-06-06
- auto_source_topic_id: 28722
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-101-june-09-2026/28722
- desc: |
  ブロックチェーン上で実際に実行されることなく、その実行可能性に基づいて合意されるトランザクション。主にオフチェーンでのインタラクションを可能にし、必要に応じてオンチェーンで解決されることで、ガス代の節約やスケーラビリティの向上に寄与します。

## Contract Payer Transaction
- ja: コントラクト支払いトランザクション
- related: [Gas Abstraction, Account Abstraction]
- auto_added: 2026-06-06
- auto_source_topic_id: 28722
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-101-june-09-2026/28722
- desc: |
  トランザクションのガス代を、そのトランザクションの送信者ではなく、特定のスマートコントラクトが支払う仕組みのトランザクション。ユーザーが直接ガス代を支払う必要がないため、ユーザーエクスペリエンスの向上や特定のビジネスモデルの実現に役立ちます。

## Shielded Note Teleportation
- ja: シールドノートのテレポート
- related: [Shielded Transaction, Zero-Knowledge Proof, Privacy Coin]
- auto_added: 2026-06-06
- auto_source_topic_id: 28722
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-101-june-09-2026/28722
- desc: |
  プライバシー保護された「シールドノート」（特定のユーザーに属する秘密の資産表現）を、異なるコンテキストやブロックチェーン間で移動させるプロセス。ゼロ知識証明などの技術を用いて、移動中もそのプライバシー特性を維持することを目的とします。

## Agentic Onchain Operations
- ja: エージェントによるオンチェーン操作
- related: [AI Agent, Account Abstraction, Autonomous Agent]
- auto_added: 2026-06-06
- auto_source_topic_id: 28722
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-101-june-09-2026/28722
- desc: |
  自律的なエージェント（AIエージェントなど）が、ブロックチェーン上で直接実行する操作や活動。これらのエージェントは、特定の目的のためにプログラムされ、スマートコントラクトや他のオンチェーンリソースとインタラクトすることで、自動化された機能を提供します。

## Forensic Token
- ja: フォレンジックトークン
- aliases: [Forest]
- related: [Traceability, Compliance, Auditability]
- auto_added: 2026-06-06
- auto_source_topic_id: 28722
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-101-june-09-2026/28722
- desc: |
  監査や調査（フォレンジック分析）を目的として設計された特殊なトークン。通常のトークンよりも詳細な追跡機能や、特定の条件下での情報開示メカニズムを持つことで、規制遵守や不正行為の特定に役立つ可能性があります。

## zkwormholes
- ja: zkワームホール
- related: [EIP-7503, shielded note teleportation]
- auto_added: 2026-06-06
- auto_source_topic_id: 28721
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-shielded-note-teleportation/28721
- desc: |
  EIP-7503で提案された概念で、ゼロ知識証明を利用して、プライバシープロトコル間で資産を公開することなく移動させるメカニズム。本ERCの「Shielded Note Teleportation」の基礎となる。

## burn commitment
- ja: バーンコミットメント
- related: [burn address, shielded note teleportation]
- auto_added: 2026-06-06
- auto_source_topic_id: 28721
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-shielded-note-teleportation/28721
- desc: |
  プライバシープロトコル間でシールドされたノートを移動させる際に、ソースプールでノートが使用不能なアドレスにバインドされたことを証明するためのコミットメント。これにより、資産の二重使用を防ぎつつ、宛先プロトコルでのインポートを可能にする。

## Positive-sum privacy sets
- ja: ポジティブサム・プライバシーセット
- related: [privacy set, shielded note teleportation]
- auto_added: 2026-06-06
- auto_source_topic_id: 28721
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-shielded-note-teleportation/28721
- desc: |
  シールドされたノートをプライバシープロトコル間でテレポートすることで、宛先プールのプライバシーセットを増加させると同時に、ソースプールのプライバシーセットを減少させない特性。これにより、新しいプロトコルが既存の大きなプロトコルの匿名性を継承できる。

## privacy set
- ja: プライバシーセット
- related: [anonymity, shielded note teleportation]
- auto_added: 2026-06-06
- auto_source_topic_id: 28721
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-shielded-note-teleportation/28721
- desc: |
  プライバシープロトコルにおいて、特定のトランザクションやユーザーの匿名性を保証する際に、その中に紛れ込ませることができる可能性のあるユーザーやトランザクションの集合。プライバシーセットが大きいほど匿名性が高まる。

## Association Set Provider
- ja: アソシエーションセットプロバイダー
- aliases: [ASP]
- related: [compliance, illicit funds]
- auto_added: 2026-06-06
- auto_source_topic_id: 28721
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-shielded-note-teleportation/28721
- desc: |
  プライバシープロトコルにおいて、テレポートされたノートが不正な資金に関連していないかをスクリーニングするために使用される可能性のあるサービスプロバイダー。コンプライアンス対策の一環として機能する。

## blind signing
- ja: ブラインド署名
- related: [Clear Signing]
- auto_added: 2026-06-06
- auto_source_topic_id: 28717
- auto_source_url: https://ethereum-magicians.org/t/erc-8283-on-chain-registry-for-erc-7730-clear-signing-descriptors/28717
- desc: |
  ウォレットユーザーがトランザクションの内容を完全に理解せずに署名してしまう行為。スマートコントラクトの複雑性により、意図しない資産の損失につながる重大なセキュリティリスク。

## Clear Signing
- ja: クリア署名
- related: [blind signing, Clear Signing descriptor, ERC-7730]
- auto_added: 2026-06-06
- auto_source_topic_id: 28717
- auto_source_url: https://ethereum-magicians.org/t/erc-8283-on-chain-registry-for-erc-7730-clear-signing-descriptors/28717
- desc: |
  ウォレットがユーザーにトランザクションの意図と影響を明確かつ人間が読める形式で表示し、ユーザーが内容を完全に理解した上で署名できるようにする標準。ブラインド署名の問題を解決するために導入された。

## on-chain registry
- ja: オンチェーンレジストリ
- related: [ERC-8283, Clear Signing descriptor]
- auto_added: 2026-06-06
- auto_source_topic_id: 28717
- auto_source_url: https://ethereum-magicians.org/t/erc-8283-on-chain-registry-for-erc-7730-clear-signing-descriptors/28717
- desc: |
  ERC-7730のクリア署名記述子を許可なく維持・更新できるスマートコントラクトベースのレジストリ。ウォレットが記述子とそのアテステーションをオンチェーンで検索できるようにする。

## transaction envelope
- ja: トランザクションエンベロープ
- related: [ERC-8265, Clear Signing]
- auto_added: 2026-06-06
- auto_source_topic_id: 28717
- auto_source_url: https://ethereum-magicians.org/t/erc-8283-on-chain-registry-for-erc-7730-clear-signing-descriptors/28717
- desc: |
  ウォレット向けのメタデータ（トランザクションシミュレーション結果、アサーション、解決済みENS名など）を署名ハードウェアに到達するまでの解決プロセス中にバンドルするためのフォーマット。ERC-8265で定義される。

## transaction assertions
- ja: トランザクションアサーション
- related: [EIP-7906, Clear Signing]
- auto_added: 2026-06-06
- auto_source_topic_id: 28717
- auto_source_url: https://ethereum-magicians.org/t/erc-8283-on-chain-registry-for-erc-7730-clear-signing-descriptors/28717
- desc: |
  スマートコントラクトが、呼び出しデータによって規定された状態変更をオンチェーンで強制するためのメカニズム。EIP-7906で定義され、クリア署名エコシステムの一部を構成する。

## zkEVM
- ja: zkEVM (ゼロ知識イーサリアム仮想マシン)
- aliases: [Zero-Knowledge Ethereum Virtual Machine]
- related: [Zero-Knowledge Proof, EVM, Rollup]
- auto_added: 2026-06-06
- auto_source_topic_id: 28716
- auto_source_url: https://ethereum-magicians.org/t/l1-zkevm-breakout-05-june-10-2026/28716
- desc: |
  ゼロ知識証明技術を用いて、イーサリアム仮想マシン（EVM）の計算の正当性を証明するシステム。これにより、L2スケーリングソリューション（特にzkRollup）において、オフチェーン計算の検証を効率的かつ安全に行うことが可能になる。

## Layer 1
- ja: レイヤー1
- aliases: [L1]
- related: [Layer 2, Ethereum Mainnet, Blockchain]
- auto_added: 2026-06-06
- auto_source_topic_id: 28716
- auto_source_url: https://ethereum-magicians.org/t/l1-zkevm-breakout-05-june-10-2026/28716
- desc: |
  ブロックチェーンネットワークの基盤となるメインのチェーン。イーサリアムにおいては、トランザクションの最終的な確定とセキュリティを提供するメインネットを指す。L2ソリューションは通常、L1のセキュリティを継承してスケーラビリティを向上させる。

## L1-zkEVM
- ja: L1-zkEVM (レイヤー1 zkEVM)
- aliases: [L1 zkEVM]
- related: [zkEVM, Layer 1, Ethereum Virtual Machine]
- auto_added: 2026-06-06
- auto_source_topic_id: 28716
- auto_source_url: https://ethereum-magicians.org/t/l1-zkevm-breakout-05-june-10-2026/28716
- desc: |
  イーサリアムのレイヤー1上で動作するか、レイヤー1に密接に統合されたゼロ知識証明ベースのEVM実装。これにより、イーサリアムのセキュリティと分散性を維持しつつ、スケーラビリティとトランザクションのファイナリティを向上させることを目指す。

## EVM assembly
- ja: EVMアセンブリ
- aliases: [evm-asm, EVM assembler]
- related: [EVM, bytecode, Solidity]
- auto_added: 2026-06-06
- auto_source_topic_id: 28716
- auto_source_url: https://ethereum-magicians.org/t/l1-zkevm-breakout-05-june-10-2026/28716
- desc: |
  イーサリアム仮想マシン（EVM）の低レベルな命令セットを人間が読み書きしやすい形式で表現したもの。スマートコントラクトのコンパイルターゲットであり、EVMの動作を直接制御するために使用される。

## WOTS-39
- ja: WOTS-39
- related: [Winternitz One-Time Signatures, Lamport chain, ERC-4337, EIP-7702, Post-Quantum]
- auto_added: 2026-06-06
- auto_source_topic_id: 28715
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-erc-4337-wots-39-winternitz-one-time-signature-wallet-for-ethereum/28715
- desc: |
  BitcoinとEthereumの両方で動作する、Winternitz One-Time Signatures (WOTS+)とLamportチェーンを組み合わせたポスト量子署名ウォレットの実装。トランザクションハッシュ(TXID)をアンカーとして利用し、各トランザクションで一意のWOTS+キーを導出することで、キーの再利用問題を解決する。

## Winternitz One-Time Signatures
- ja: ウィンターニッツ・ワンタイム署名 (WOTS+)
- aliases: [WOTS+]
- related: [Hash-based signature scheme, WOTS-39, Lamport chain, Post-Quantum]
- auto_added: 2026-06-06
- auto_source_topic_id: 28715
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-erc-4337-wots-39-winternitz-one-time-signature-wallet-for-ethereum/28715
- desc: |
  ハッシュ関数のみに基づいて構築されたワンタイム署名スキーム。秘密鍵はランダムな値のセットであり、公開鍵はそれらの値をW回ハッシュチェーン化したもの。一度しか安全に署名できないため、キーの再利用がセキュリティを損なう。

## Lamport chain
- ja: ランポートチェーン
- related: [Lamport signature, WOTS-39, Post-Quantum]
- auto_added: 2026-06-06
- auto_source_topic_id: 28715
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-erc-4337-wots-39-winternitz-one-time-signature-wallet-for-ethereum/28715
- desc: |
  マスターシークレットから導出されたハッシュ値の長いシーケンス。ウォレットのセットアップ時に最終値（チェーンチップ）のみをオンチェーンに公開し、新しいキーのアップロードを承認する際に、その前の値を順次公開することで所有権を証明する。各スロットは一度消費されると再利用できない。

## validateUserOp
- ja: validateUserOp (関数)
- related: [ERC-4337, Smart contract wallet, UserOperation]
- auto_added: 2026-06-06
- auto_source_topic_id: 28715
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-erc-4337-wots-39-winternitz-one-time-signature-wallet-for-ethereum/28715
- desc: |
  ERC-4337スマートコントラクトウォレットの主要な関数。ユーザーオペレーションの署名を検証し、関連するロジック（例：WOTS+署名の検証、Lamportチェーンスロットの消費）を実行する。これにより、アカウントのカスタム検証ロジックを実装できる。

## EIP-7702
- ja: EIP-7702
- related: [EOA, Account abstraction, ERC-4337]
- auto_added: 2026-06-06
- auto_source_topic_id: 28715
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-erc-4337-wots-39-winternitz-one-time-signature-wallet-for-ethereum/28715
- desc: |
  既存のEOA（Externally Owned Account）が、トランザクションの期間中、または永続的に、その検証ロジックをスマートコントラクト実装に委任できるようにするEthereum Improvement Proposal。これにより、既存のユーザーが資金を移動せずに、ポスト量子安全性などの新しい検証メカニズムにアップグレードできる。

## Ethereum Transparency Layer
- ja: イーサリアム透明性レイヤー (ETL)
- aliases: [ETL]
- related: [Deterministic Verifier Runtime, Replay-Stable Architecture]
- auto_added: 2026-06-08
- auto_source_topic_id: 25116
- auto_source_url: https://ethresear.ch/t/ethereum-governance-verification-system/25116
- desc: |
  Ethereumガバナンス活動を決定論的な検証基盤に変換するために設計された、多層アーキテクチャ。ガバナンスの可視性だけでなく、再現可能な検証を可能にすることを目指します。

## Deterministic Verifier Runtime
- ja: 決定論的検証ランタイム
- related: [Ethereum Transparency Layer, Replay Certification Layer]
- auto_added: 2026-06-08
- auto_source_topic_id: 25116
- auto_source_url: https://ethresear.ch/t/ethereum-governance-verification-system/25116
- desc: |
  Ethereum Transparency Layer (ETL) のセマンティクスを運用し、リプレイ安定性のあるガバナンス検証インフラを構築する実行環境。ガバナンス実行の連続性を決定論的に検証することに特化しています。

## Replay-Stable Architecture
- ja: リプレイ安定性アーキテクチャ
- related: [Deterministic Verifier Runtime, Ethereum Transparency Layer]
- auto_added: 2026-06-08
- auto_source_topic_id: 25116
- auto_source_url: https://ethresear.ch/t/ethereum-governance-verification-system/25116
- desc: |
  ガバナンス履歴の決定論的な再構築、権限の連続性の理解、および観察された挙動が宣言されたガバナンス構造と一貫しているかの検証を可能にするアーキテクチャ。異なる環境間でのリプレイ同等な検証を保証します。

## ETNL Semantic Layer
- ja: ETNLセマンティックレイヤー (実行トレース正規化レイヤー)
- aliases: [Execution Trace Normalization Layer]
- related: [Ethereum Transparency Layer]
- auto_added: 2026-06-08
- auto_source_topic_id: 25116
- auto_source_url: https://ethresear.ch/t/ethereum-governance-verification-system/25116
- desc: |
  Ethereum Transparency Layer (ETL) の構成要素の一つで、ガバナンス実行の証拠を正規化されたセマンティック表現に変換するレイヤー。決定論的検証が始まる前にセマンティックな曖昧さを排除する役割を持ちます。

## Proof-of-Operation Layer
- ja: オペレーション証明レイヤー
- related: [Ethereum Transparency Layer]
- auto_added: 2026-06-08
- auto_source_topic_id: 25116
- auto_source_url: https://ethresear.ch/t/ethereum-governance-verification-system/25116
- desc: |
  Ethereum Transparency Layer (ETL) の構成要素の一つで、ガバナンス実行トレース、実行連続性記録、委任されたオペレーションの証拠など、規範的な実行証拠を確立するレイヤー。ガバナンス実行を規範的なリプレイ可能な運用証拠に変換することを目的とします。

## Cooperative capitalism
- ja: 協調的資本主義
- related: [Mechanism design, Risk layer, Value layer]
- auto_added: 2026-06-08
- auto_source_topic_id: 25109
- auto_source_url: https://ethresear.ch/t/cooperative-capitalism-is-the-last-coherent-economic-path-crypto-has-left/25109
- desc: |
  協力がメカニズム設計によって強制され、社会的規範や法的構造、ガバナンス投票に依存しない経済システム。リスク層をパーミッションレスに相互化し、価値層で競争することを特徴とする。

## Retroactive security
- ja: 事後的なセキュリティ
- related: [Taint propagation]
- auto_added: 2026-06-08
- auto_source_topic_id: 25109
- auto_source_url: https://ethresear.ch/t/cooperative-capitalism-is-the-last-coherent-economic-path-crypto-has-left/25109
- desc: |
  攻撃が成功した後で、その攻撃を不採算にするセキュリティアプローチ。悪意のあるアクターが特定された場合、トランザクショングラフを通じて汚染が伝播し、正直なカウンターパーティとの価値の流れから切り離される。

## Mutualized risk pools
- ja: 相互化されたリスクプール
- related: [Cooperative capitalism, Risk layer]
- auto_added: 2026-06-08
- auto_source_topic_id: 25109
- auto_source_url: https://ethresear.ch/t/cooperative-capitalism-is-the-last-coherent-economic-path-crypto-has-left/25109
- desc: |
  保険がパーミッションレスであり、資産を保有する誰もが自動的に保険に加入する仕組み。コミュニティが自ら保険をかけ、アンダーライターはリスクに対してプレミアムを獲得し、損失を負担する。

## Layer separation enforcement
- ja: レイヤー分離の強制
- related: [Cooperative capitalism, Risk layer, Value layer]
- auto_added: 2026-06-08
- auto_source_topic_id: 25109
- auto_source_url: https://ethresear.ch/t/cooperative-capitalism-is-the-last-coherent-economic-path-crypto-has-left/25109
- desc: |
  競争的な価値層と協力的なリスク層を意図的に分離し、互いに汚染し合わないようにするメカニズム設計の原則。競争層の収益が協力層の安定性を資金供給する。

## Identity-splitting attacks
- ja: アイデンティティ分割攻撃
- related: [Shapley value distribution]
- auto_added: 2026-06-08
- auto_source_topic_id: 25109
- auto_source_url: https://ethresear.ch/t/cooperative-capitalism-is-the-last-coherent-economic-path-crypto-has-left/25109
- desc: |
  Shapley分布において、攻撃者が自身のアイデンティティを分割することで報酬を操作しようとする攻撃。この種の攻撃に対する正式な証明が必要とされている。

## Execution Receipt
- ja: 実行レシート
- related: [AI Agent, On-chain Anchor, Session Root]
- auto_added: 2026-06-08
- auto_source_topic_id: 28737
- auto_source_url: https://ethereum-magicians.org/t/execution-receipts-for-ai-agents-off-chain-evidence-on-chain-roots-and-verifiable-session-proofs/28737
- desc: |
  AIエージェントが実行したアクションの検証可能な記録。エージェントの出力や行動の信頼性を確保するため、オフチェーンの証拠から計算された決定論的なハッシュ/ルートをオンチェーンにアンカーする。

## Receipt Layer
- ja: レシートレイヤー
- related: [Execution Receipt, AI Agent]
- auto_added: 2026-06-08
- auto_source_topic_id: 28737
- auto_source_url: https://ethereum-magicians.org/t/execution-receipts-for-ai-agents-off-chain-evidence-on-chain-roots-and-verifiable-session-proofs/28737
- desc: |
  AIエージェントの実行結果を検証可能な記録として提供するためのシステム層。エージェントの行動に対する信頼性と透明性を高めることを目的とする。

## On-chain Anchor
- ja: オンチェーンアンカー
- related: [Merkle Tree, Execution Receipt]
- auto_added: 2026-06-08
- auto_source_topic_id: 28737
- auto_source_url: https://ethereum-magicians.org/t/execution-receipts-for-ai-agents-off-chain-evidence-on-chain-roots-and-verifiable-session-proofs/28737
- desc: |
  オフチェーンで生成されたデータのハッシュまたはルートを、検証のためにブロックチェーン上に記録する仕組み。これにより、オフチェーンデータの完全性と検証可能性が保証される。

## Session Root
- ja: セッションルート
- aliases: [Workflow Root]
- related: [Execution Receipt, Merkle Tree, On-chain Anchor]
- auto_added: 2026-06-08
- auto_source_topic_id: 28737
- auto_source_url: https://ethereum-magicians.org/t/execution-receipts-for-ai-agents-off-chain-evidence-on-chain-roots-and-verifiable-session-proofs/28737
- desc: |
  AIエージェントの単一セッションまたはワークフロー内で実行された複数のアクションのレシートハッシュをまとめたMerkleツリーのルート。これにより、セッション全体の行動がコンパクトにオンチェーンにコミットされる。

## Consensus Layer
- ja: コンセンサス層
- aliases: [CL]
- related: [Execution Layer]
- auto_added: 2026-06-08
- auto_source_topic_id: 28681
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-testing-acdt-82-june-8-2026/28681
- desc: |
  Ethereumの2つの主要な層のうちの1つで、ブロックのファイナリティ、バリデータの管理、およびネットワークのセキュリティを担当します。Proof-of-Stakeコンセンサスアルゴリズムを実行します。

## State Root
- ja: ステートルート
- related: [Merkle Patricia Trie, Block Header]
- auto_added: 2026-06-08
- auto_source_topic_id: 28681
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-testing-acdt-82-june-8-2026/28681
- desc: |
  特定のブロックにおけるEthereumブロックチェーンの全状態（アカウント残高、コントラクトストレージなど）を暗号学的に表現するハッシュ値です。ブロックヘッダーに含まれ、状態の整合性を検証するために使用されます。

## Simple Serialize
- ja: シンプルシリアライズ
- aliases: [SSZ]
- related: [RLP]
- auto_added: 2026-06-08
- auto_source_topic_id: 28681
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-testing-acdt-82-june-8-2026/28681
- desc: |
  Ethereumのコンセンサス層で広く使用されている、効率的で決定論的なシリアライズ（直列化）方式です。主に、ネットワークメッセージや状態オブジェクトなどのデータ構造をバイト列に変換するために用いられます。

## Engine API
- ja: エンジンAPI
- related: [Execution Layer, Consensus Layer]
- auto_added: 2026-06-08
- auto_source_topic_id: 28681
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-testing-acdt-82-june-8-2026/28681
- desc: |
  EthereumのExecution LayerクライアントとConsensus Layerクライアント間の通信を可能にするインターフェースです。ブロックの構築、トランザクションの実行、状態の同期など、両層間の協調動作に不可欠な役割を果たします。

## RWA Disclosure Interfaces
- ja: RWA開示インターフェース
- aliases: [ERC RWA Disclosure Interfaces]
- related: [IERCRwaDisclosureResolver, IERCRwaAttestation, IERCRwaDocuments]
- auto_added: 2026-06-08
- auto_source_topic_id: 28679
- auto_source_url: https://ethereum-magicians.org/t/erc-proposal-rwa-disclosure-interfaces/28679
- desc: |
  実世界資産（RWA）に関する情報をオンチェーンで標準的に開示するためのインターフェース群。準備金報告、NAV明細、監査報告、裏付け状況、法的文書などのオフチェーン情報を機械可読な形式で提供する。

## Disclosure Plane
- ja: 開示プレーン (開示層)
- aliases: [Disclosure Layer]
- related: [RWA Disclosure Interfaces, Control Plane, Identity Layer]
- auto_added: 2026-06-08
- auto_source_topic_id: 28679
- auto_source_url: https://ethereum-magicians.org/t/erc-proposal-rwa-disclosure-interfaces/28679
- desc: |
  実世界資産（RWA）の開示情報を標準化し、オンチェーンプロトコルやウォレットが利用できるようにするための概念的な層。RWAの転送制御や本人確認とは異なる情報開示に特化している。

## Asset Key
- ja: アセットキー
- aliases: [assetKey]
- related: [ERC-20, ERC-721, ERC-1155, ERC-6909]
- auto_added: 2026-06-08
- auto_source_topic_id: 28679
- auto_source_url: https://ethereum-magicians.org/t/erc-proposal-rwa-disclosure-interfaces/28679
- desc: |
  RWA開示インターフェースにおいて、開示が適用される資産または資産シリーズを一意に識別するためのバイト列。単一資産トークン、マルチアセットトークン、または複数のトークン契約をカバーする開示契約に対応する。

## RwaAttestation
- ja: RWAアテステーション
- related: [RWA Disclosure Interfaces, RwaBackingStatus, RwaDocument]
- auto_added: 2026-06-08
- auto_source_topic_id: 28679
- auto_source_url: https://ethereum-magicians.org/t/erc-proposal-rwa-disclosure-interfaces/28679
- desc: |
  実世界資産（RWA）に関する最新の機械可読な声明（アテステーション）を表現する構造体。誰が、いつ、何について証明したか、有効期限、関連データハッシュ、URIなどのメタデータを含む。

## Disclosure Contract
- ja: 開示契約
- related: [RWA Disclosure Interfaces, Token Contract]
- auto_added: 2026-06-08
- auto_source_topic_id: 28679
- auto_source_url: https://ethereum-magicians.org/t/erc-proposal-rwa-disclosure-interfaces/28679
- desc: |
  RWA開示インターフェースを実装し、実世界資産（RWA）に関する開示情報を提供するスマートコントラクト。トークン契約自体に実装される場合と、別途独立した契約としてデプロイされる場合がある。

## Function-scoped delegation
- ja: 関数スコープの委任
- related: [Permission Registry, asset-scoped, action-scoped]
- auto_added: 2026-06-08
- auto_source_topic_id: 28670
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-permission-registry-function-scoped-delegation-for-agents-without-custody/28670
- desc: |
  スマートコントラクトの特定の関数に対してのみ、実行権限を委任すること。ERC-20の承認が資産全体に及ぶのに対し、この提案では個々の関数レベルでの詳細な権限管理を可能にする。

## Asset-scoped
- ja: 資産スコープ
- related: [function-scoped delegation, action-scoped, ERC-20 approvals]
- auto_added: 2026-06-08
- auto_source_topic_id: 28670
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-permission-registry-function-scoped-delegation-for-agents-without-custody/28670
- desc: |
  承認や権限が特定の資産全体に適用される範囲を指す。例えば、ERC-20の`approve`は、指定されたトークン（資産）の全量に対する移転権限を委任する。

## Action-scoped
- ja: アクションスコープ
- related: [function-scoped delegation, asset-scoped]
- auto_added: 2026-06-08
- auto_source_topic_id: 28670
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-permission-registry-function-scoped-delegation-for-agents-without-custody/28670
- desc: |
  承認や権限が特定の操作やアクション（スマートコントラクトの関数呼び出しなど）に限定される範囲を指す。資産全体ではなく、実行可能な具体的な行動に焦点を当てる。

## Full-target approval
- ja: フルターゲット承認
- related: [Permission Registry, selector bundles]
- auto_added: 2026-06-08
- auto_source_topic_id: 28670
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-permission-registry-function-scoped-delegation-for-agents-without-custody/28670
- desc: |
  提案されているPermission Registryにおいて、オペレーターが特定のターゲットコントラクトの全ての関数に対して承認を得る形式。有効期限のみを指定するコンパクトなデータ形式で表現される。

## Selector bundles
- ja: セレクターバンドル
- related: [full-target approval, function-scoped delegation]
- auto_added: 2026-06-08
- auto_source_topic_id: 28670
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-permission-registry-function-scoped-delegation-for-agents-without-custody/28670
- desc: |
  提案されているPermission Registryにおいて、特定のオペレーターに委任される、ソートされた複数の関数セレクターの集合。これにより、個々の関数レベルでの詳細な権限管理が可能になる。

## Merkle-Patricia Trie
- ja: マークルパトリシアトライ (MPT)
- aliases: [MPT]
- related: [State Root, Account Trie, Storage Trie]
- auto_added: 2026-06-12
- auto_source_topic_id: 25119
- auto_source_url: https://ethresear.ch/t/hot-cold-storage-separation-in-practice/25119
- desc: |
  Ethereumのステート、トランザクション、レシートを効率的かつ安全に保存・検証するために使用されるデータ構造。各ブロックのステートルートはこのトライのルートハッシュによって認証される。

## RLP
- ja: RLP (Recursive Length Prefix)
- aliases: [Recursive Length Prefix]
- related: [Serialization]
- auto_added: 2026-06-12
- auto_source_topic_id: 25119
- auto_source_url: https://ethresear.ch/t/hot-cold-storage-separation-in-practice/25119
- desc: |
  Ethereumでデータ構造（オブジェクト、リスト、文字列など）をバイト列にシリアライズするためのエンコーディング方式。シンプルで効率的なデータ表現を可能にする。

## Hot-Cold Storage Separation
- ja: ホット・コールドストレージ分離
- aliases: [Hot/Cold Storage Separation]
- related: [Hot State, Cold State, EIP-8188, Consensus-visible timestamp]
- auto_added: 2026-06-12
- auto_source_topic_id: 25119
- auto_source_url: https://ethresear.ch/t/hot-cold-storage-separation-in-practice/25119
- desc: |
  Ethereumノードのストレージを、頻繁にアクセスされる「ホット」な状態と、あまりアクセスされない「コールド」な状態に物理的に分離する手法。これにより、ストレージコストの削減とパフォーマンスの最適化を目指す。

## Consensus-visible timestamp
- ja: コンセンサス可視タイムスタンプ
- related: [EIP-8188, Hot-Cold Storage Separation]
- auto_added: 2026-06-12
- auto_source_topic_id: 25119
- auto_source_url: https://ethresear.ch/t/hot-cold-storage-separation-in-practice/25119
- desc: |
  EIP-8188によって導入される、各アカウントとストレージスロットが最後に変更された時刻を記録するタイムスタンプ。コンセンサス層で可視であり、ホット・コールドストレージ分離の判断基準として利用される。

## Cold subtree
- ja: コールドサブツリー
- related: [Merkle-Patricia Trie, Hot-Cold Storage Separation]
- auto_added: 2026-06-12
- auto_source_topic_id: 25119
- auto_source_url: https://ethresear.ch/t/hot-cold-storage-separation-in-practice/25119
- desc: |
  Merkle-Patricia Trieにおいて、その配下のすべてのリーフが長期間書き込みがされていない（非アクティブな）状態であると判断されたサブツリー。ホット・コールドストレージ分離の際に、メインデータベースから切り離され、より安価なストレージに移動される対象となる。

## State Tiering by Periods
- ja: 期間別ステート階層化
- related: [EIP-8295, EIP-8188, Active state, Inactive state, state expiry]
- auto_added: 2026-06-12
- auto_source_topic_id: 28763
- auto_source_url: https://ethereum-magicians.org/t/eip-8295-state-tiering-by-periods/28763
- desc: |
  EIP-8295で提案された、ステートの最終書き込み時期に基づいてステートを「アクティブ」と「非アクティブ」の階層に分類するメカニズムです。非アクティブなステートへの書き込みには追加のガス料金が課されます。

## write-age signal
- ja: 書き込み経過時間シグナル
- related: [EIP-8188, State Tiering by Periods, last_written_block]
- auto_added: 2026-06-12
- auto_source_topic_id: 28763
- auto_source_url: https://ethereum-magicians.org/t/eip-8295-state-tiering-by-periods/28763
- desc: |
  EIP-8188によって記録される、ステートが最後に書き込まれてからの経過時間を示す情報です。EIP-8295ではこのシグナルに基づいてステートの階層が決定されます。

## Active state
- ja: アクティブステート
- related: [Inactive state, State Tiering by Periods, period]
- auto_added: 2026-06-12
- auto_source_topic_id: 28763
- auto_source_url: https://ethereum-magicians.org/t/eip-8295-state-tiering-by-periods/28763
- desc: |
  EIP-8295において、定義された期間内に書き込みが行われたと判断されるステートです。このステートへの書き込みは通常のガス料金で処理されます。

## Inactive state
- ja: 非アクティブステート
- related: [Active state, State Tiering by Periods, period, INACTIVE_ACCOUNT_WRITE_SURCHARGE, INACTIVE_STORAGE_WRITE_SURCHARGE]
- auto_added: 2026-06-12
- auto_source_topic_id: 28763
- auto_source_url: https://ethereum-magicians.org/t/eip-8295-state-tiering-by-periods/28763
- desc: |
  EIP-8295において、定義された期間内に書き込みが行われなかったと判断されるステートです。このステートへの書き込みには追加のガス料金が課されます。

## state expiry
- ja: ステート有効期限
- related: [State Tiering by Periods, state bloat]
- auto_added: 2026-06-12
- auto_source_topic_id: 28763
- auto_source_url: https://ethereum-magicians.org/t/eip-8295-state-tiering-by-periods/28763
- desc: |
  Ethereumのステートサイズ増大問題に対処するため、一定期間アクセスされていないステートをプロトコルから削除またはアーカイブするメカニズムです。EIP-8295は、ステート有効期限とは異なり、ステートを削除せず、非アクティブなステートへの書き込みコストを増加させることで圧力をかけます。

## SPHINCS-
- ja: SPHINCS-（SPHINCSマイナス）
- aliases: [SPHINCS minus]
- related: [SPHINCS+, Post-Quantum Signature Verification, Hash-based signatures, EVM]
- auto_added: 2026-06-13
- auto_source_topic_id: 25165
- auto_source_url: https://ethresear.ch/t/sphincs-minus-efficient-stateless-post-quantum-signature-verification-on-the-evm/25165
- desc: |
  EVM向けに最適化されたSPHINCS+の派生形であり、ステートレスな耐量子署名検証を効率的に行うことを目的としている。標準のハッシュ関数をKECCAK256に置き換えることで、プリコンパイルやプロトコル変更なしにオンチェーンでの検証コストを最小化する。

## Hypertree
- ja: ハイパーツリー
- related: [SPHINCS+, FORS, XMSS trees, WOTS+]
- auto_added: 2026-06-13
- auto_source_topic_id: 25165
- auto_source_url: https://ethresear.ch/t/sphincs-minus-efficient-stateless-post-quantum-signature-verification-on-the-evm/25165
- desc: |
  SPHINCS+のようなハッシュベース署名スキームで用いられる、複数のツリーを階層的に組み合わせたデータ構造。FORSインスタンスを葉とし、その上にXMSSツリーの層が積み重ねられることで、多数のワンタイム公開鍵を単一のルートに圧縮する。

## FORS
- ja: FORS（フォレスト・オブ・ランダム・サブセット）
- aliases: [Forest of Random Subsets]
- related: [SPHINCS+, Hypertree, WOTS+]
- auto_added: 2026-06-13
- auto_source_topic_id: 25165
- auto_source_url: https://ethresear.ch/t/sphincs-minus-efficient-stateless-post-quantum-signature-verification-on-the-evm/25165
- desc: |
  SPHINCS+における「数回署名」スキームの構成要素。k個の独立したバイナリツリーで構成され、メッセージダイジェストに基づいて各ツリーから1つの葉とその認証パスを公開することで署名を行う。

## leanSPHINCS
- ja: leanSPHINCS（リーンSPHINCS）
- related: [SPHINCS-, ZK-friendly hash, zkEVM, Aggregation circuit]
- auto_added: 2026-06-13
- auto_source_topic_id: 25165
- auto_source_url: https://ethresear.ch/t/sphincs-minus-efficient-stateless-post-quantum-signature-verification-on-the-evm/25165
- desc: |
  SPHINCS-の将来的なバリアントで、基盤となるハッシュ関数がZKフレンドリーになるように設計されている。zkEVMの制約に適合し、プロトコルレベルのアグリゲーションと組み合わせることで、検証コストを大幅に削減することを目指す。

## Decaying vote weight
- ja: 減衰する投票ウェイト
- related: [stale validators, liveness]
- auto_added: 2026-06-13
- auto_source_topic_id: 25164
- auto_source_url: https://ethresear.ch/t/three-fixes-three-new-attacks-decaying-vote-weight-in-a-weighted-consensus/25164
- desc: |
  参加状況を反映させるため、活動していないバリデータの投票ウェイトを時間経過とともに減少させるメカニズム。これにより、バリデータのライブネスを奨励する。

## Absolute quorum floor
- ja: 絶対クォーラムフロア
- aliases: [quorum floor, floor]
- related: [total base weight, effective present weight, Eclipse attack]
- auto_added: 2026-06-13
- auto_source_topic_id: 25164
- auto_source_url: https://ethresear.ch/t/three-fixes-three-new-attacks-decaying-vote-weight-in-a-weighted-consensus/25164
- desc: |
  コンセンサスにおけるファイナリティの分母が、現在の有効ウェイトとベースウェイトの固定割合である絶対的な最小値のうち、大きい方を取るように設定されるメカニズム。これにより、エクリプス攻撃による分母の縮小を防ぐ。

## Eclipse attack
- ja: エクリプス攻撃
- aliases: [eclipse]
- related: [censoring heartbeats, finalization bar, Absolute quorum floor]
- auto_added: 2026-06-13
- auto_source_topic_id: 25164
- auto_source_url: https://ethresear.ch/t/three-fixes-three-new-attacks-decaying-vote-weight-in-a-weighted-consensus/25164
- desc: |
  攻撃者が正直なノードをネットワークから隔離し、そのノードがネットワークの大部分と通信できないようにする攻撃。これにより、攻撃者は少数派のウェイトでファイナリティを達成できる可能性がある。

## Contribution score
- ja: 貢献スコア
- aliases: [earned contribution score]
- related: [weighted consensus, staked capital, proof of work]
- auto_added: 2026-06-13
- auto_source_topic_id: 25164
- auto_source_url: https://ethresear.ch/t/three-fixes-three-new-attacks-decaying-vote-weight-in-a-weighted-consensus/25164
- desc: |
  複数のリソースでバリデータを重み付けするコンセンサスシステムにおいて、バリデータが獲得した貢献度を数値化したスコア。投票ウェイトの構成要素の一つとなる。

## Finalization bar
- ja: ファイナリティバー
- aliases: [finalization threshold]
- related: [two thirds supermajority, total base weight, effective present weight]
- auto_added: 2026-06-13
- auto_source_topic_id: 25164
- auto_source_url: https://ethresear.ch/t/three-fixes-three-new-attacks-decaying-vote-weight-in-a-weighted-consensus/25164
- desc: |
  ブロックがファイナライズされるために必要な、支持ウェイトの最小しきい値。通常、総ウェイトの過半数（例：3分の2）として設定される。

## Precondition
- ja: 前提条件
- related: [Ordering Discretion, Parameter Discretion, Mandatory Intermediation, Allocation Asymmetry]
- auto_added: 2026-06-13
- auto_source_topic_id: 25160
- auto_source_url: https://ethresear.ch/t/closing-the-first-precondition-batch-auctions-remove-the-ordering-surface-they-do-not-relocate-it/25160
- desc: |
  抽出可能な価値を生み出す構造的な事実を指します。MEV/GEVの文脈で、価値抽出の根本原因となる要素を意味し、これを閉じることで抽出を根本的に防ぐことを目指します。

## Ordering discretion
- ja: 順序付け裁量
- related: [Precondition, Sequencing Privilege, Ordering Extraction, MEV]
- auto_added: 2026-06-13
- auto_source_topic_id: 25160
- auto_source_url: https://ethresear.ch/t/closing-the-first-precondition-batch-auctions-remove-the-ordering-surface-they-do-not-relocate-it/25160
- desc: |
  保留中の操作が適用される順序を決定する権限を持つ当事者が存在することです。これはMEVの主要な前提条件の一つであり、トランザクションの順序付けや清算の順序付けによる価値抽出の根源となります。

## Parameter discretion
- ja: パラメータ裁量
- related: [Precondition, Governance Extraction]
- auto_added: 2026-06-13
- auto_source_topic_id: 25160
- auto_source_url: https://ethresear.ch/t/closing-the-first-precondition-batch-auctions-remove-the-ordering-surface-they-do-not-relocate-it/25160
- desc: |
  特権的な投票や管理者キーによってプロトコルのパラメータを移動できる当事者が存在することです。これはガバナンス抽出の前提条件となり、プロトコル設定の変更を通じて価値が抽出される可能性を生みます。

## Commit-reveal batch auction
- ja: コミット・リビール型バッチオークション
- related: [Batch Auction, Uniform Clearing Price, Ordering Discretion]
- auto_added: 2026-06-13
- auto_source_topic_id: 25160
- auto_source_url: https://ethresear.ch/t/closing-the-first-precondition-batch-auctions-remove-the-ordering-surface-they-do-not-relocate-it/25160
- desc: |
  固定された時間枠内の操作を収集し、順序付けを行わないオークションメカニズムです。コミットフェーズで注文のハッシュと秘密を提出し、リビールフェーズで開示します。これにより、順序付けの裁量を排除し、MEVを軽減することを目指します。

## Uniform clearing price
- ja: 均一清算価格
- related: [Commit-reveal batch auction, Batch Auction]
- auto_added: 2026-06-13
- auto_source_topic_id: 25160
- auto_source_url: https://ethresear.ch/t/closing-the-first-precondition-batch-auctions-remove-the-ordering-surface-they-do-not-relocate-it/25160
- desc: |
  バッチオークションにおいて、バッチ内のすべての取引が単一の同じ価格で決済されるメカニズムです。これにより、注文の順序による価格差がなくなり、MEVの一種であるスプレッド抽出を防ぎます。

## Verification Primitive
- ja: 検証プリミティブ
- related: [Replay Equivalence, Deterministic Reconstruction, Governance Reconstruction]
- auto_added: 2026-06-13
- auto_source_topic_id: 25149
- auto_source_url: https://ethresear.ch/t/governance-reconstruction-as-a-verification-primitive/25149
- desc: |
  より高次の検証手順を構築するための基礎となる操作。分散型システムにおいて、ガバナンス再構築が観測可能な証拠からガバナンス結論を導き出す再現可能なメカニズムを提供する場合、検証プリミティブとして機能する。

## Replay Equivalence
- ja: リプレイ同等性
- related: [Verification Primitive, Deterministic Reconstruction]
- auto_added: 2026-06-13
- auto_source_topic_id: 25149
- auto_source_url: https://ethresear.ch/t/governance-reconstruction-as-a-verification-primitive/25149
- desc: |
  独立したオブザーバーが同じ公開された証拠と依存関係を保持する再構築プロセスを適用した場合に、同等のガバナンス結論に到達できることを確立する検証の要件。これにより、検証結果の再現性が保証され、オブザーバー依存性が低減される。

## Observability Gap
- ja: 可視性ギャップ
- related: [Event Limitations, Authority Visibility Gap, Governance Reconstruction Problem]
- auto_added: 2026-06-13
- auto_source_topic_id: 25149
- auto_source_url: https://ethresear.ch/t/governance-reconstruction-as-a-verification-primitive/25149
- desc: |
  分散型システムの実行が公開されているにもかかわらず、その広範な行動プロセスや意味を理解するには追加の再構築が必要となる、直接的な可視性と解釈の間の隔たり。オブザーバーが大量の実行データにアクセスできても、意味のある結果を生成するために活動がどのように結合するかを判断できない課題を指す。

## Authority Visibility Gap
- ja: 権限可視性ギャップ
- related: [Observability Gap, Governance Reconstruction Problem]
- auto_added: 2026-06-13
- auto_source_topic_id: 25149
- auto_source_url: https://ethresear.ch/t/governance-reconstruction-as-a-verification-primitive/25149
- desc: |
  分散型システムにおいて、ガバナンス上の結論が権限の行使、委任、制約、または分散の理解に依存する一方で、基盤となる権限関係が個々の実行アーティファクトを通じて直接的に可視化されないという課題。これにより、観測可能な活動からガバナンス結果がどのように生じるかを判断するには再構築が必要となる。

## Governance Reconstruction Problem
- ja: ガバナンス再構築問題
- related: [Observability Gap, Authority Visibility Gap, Reconstruction Architecture]
- auto_added: 2026-06-13
- auto_source_topic_id: 25149
- auto_source_url: https://ethresear.ch/t/governance-reconstruction-as-a-verification-primitive/25149
- desc: |
  公開された分散型システムにおいて、ガバナンス上の結論を、観測可能な証拠へのトレーサビリティを保持し、独立したオブザーバー間で再現可能な結果を生み出す決定論的な再構築プロセスを通じて導き出せるかという課題。この問題は、ガバナンス評価が直接的な観察を超えた要件を持つことから生じる。

## trustless builder-proposer payments
- ja: トラストレスなビルダー・プロポーザー間支払い
- related: [ePBS, builder, proposer]
- auto_added: 2026-06-13
- auto_source_topic_id: 25125
- auto_source_url: https://ethresear.ch/t/trustless-payments-and-relays/25125
- desc: |
  ePBSによってプロトコル内に導入される、ビルダーからプロポーザーへの信頼不要な支払いメカニズム。ビルダーのステーク残高から差し引かれ、プロポーザーの引き出しアドレスに支払われることで、支払いの強制力が確保される。

## Payload-Timeliness Committee
- ja: ペイロード適時性委員会
- aliases: [PTC]
- related: [ePBS, payload]
- auto_added: 2026-06-13
- auto_source_topic_id: 25125
- auto_source_url: https://ethresear.ch/t/trustless-payments-and-relays/25125
- desc: |
  ePBSにおいて、ビルダーがネットワークに公開・配信したペイロードが特定の期限内に確認された場合にのみ、それがカノニカルとなることを検証する委員会。ペイロードの適時性を保証する役割を担う。

## pipelining
- ja: パイプライニング
- related: [ePBS, EIP-7732]
- auto_added: 2026-06-13
- auto_source_topic_id: 25125
- auto_source_url: https://ethresear.ch/t/trustless-payments-and-relays/25125
- desc: |
  EIP-7732によって導入される主要機能の一つ。ブロック構築プロセスにおける効率化や並列処理を可能にする概念で、ePBSの文脈で議論される。

## first-price block auction
- ja: ファーストプライス・ブロックオークション
- related: [sealed-bid auction, second-price auction, MEV-boost]
- auto_added: 2026-06-13
- auto_source_topic_id: 25125
- auto_source_url: https://ethresear.ch/t/trustless-payments-and-relays/25125
- desc: |
  最も高い入札額を提示したビルダーがブロックを構築する権利を得て、その入札額をプロポーザーに支払う形式のオークション。ePBSのプロトコル内チャネルでは、この形式がデフォルトとなる。

## sealed-bid auction
- ja: 封印入札オークション
- aliases: [sealed-bid format]
- related: [first-price block auction, open-bidding auction]
- auto_added: 2026-06-13
- auto_source_topic_id: 25125
- auto_source_url: https://ethresear.ch/t/trustless-payments-and-relays/25125
- desc: |
  入札者が他の入札者の額を知ることなく、秘密裏に入札額を提出するオークション形式。ePBSのプロトコル内チャネルでは、ビルダーがプロポーザーに直接入札額を送るため、この形式がデフォルトとなる傾向がある。

## MEV opportunity attribution problem
- ja: MEV機会帰属問題
- related: [MEV, arbitrage opportunity]
- auto_added: 2026-06-13
- auto_source_topic_id: 25124
- auto_source_url: https://ethresear.ch/t/the-origins-of-mev-systematic-attribution-of-arbitrage-opportunity-creation-at-scale/25124
- desc: |
  実行されたMEV（特に裁定取引）がどの先行トランザクションによって可能になったかを特定し、その利益を帰属させる問題。MEVの「創造」側に焦点を当てる。

## atomic arbitrage transaction
- ja: アトミック裁定取引
- aliases: [atomic arbitrage]
- related: [MEV, arbitrage]
- auto_added: 2026-06-13
- auto_source_topic_id: 25124
- auto_source_url: https://ethresear.ch/t/the-origins-of-mev-systematic-attribution-of-arbitrage-opportunity-creation-at-scale/25124
- desc: |
  複数の取引（スワップなど）を単一のトランザクション内で実行し、価格の不均衡を利用して利益を得る裁定取引。ブロックチェーンの原子性により、全取引が成功するか、全て失敗するかのいずれかとなる。

## single-source hypothesis
- ja: 単一ソース仮説
- related: [MEV opportunity attribution problem]
- auto_added: 2026-06-13
- auto_source_topic_id: 25124
- auto_source_url: https://ethresear.ch/t/the-origins-of-mev-systematic-attribution-of-arbitrage-opportunity-creation-at-scale/25124
- desc: |
  競争の激しいMEV市場において、裁定取引機会の大部分（96.7%）が単一の先行トランザクションに起因するという仮説。機会発生時に即座に価値が抽出されることを示唆する。

## counterfactual replay
- ja: 反実仮想リプレイ
- related: [simulation-based attribution, EVM determinism]
- auto_added: 2026-06-13
- auto_source_topic_id: 25124
- auto_source_url: https://ethresear.ch/t/the-origins-of-mev-systematic-attribution-of-arbitrage-opportunity-creation-at-scale/25124
- desc: |
  EVMの決定論を利用し、特定のトランザクションが実行されなかった場合のブロックの状態を再現することで、そのトランザクションの因果的影響を正確に測定する手法。MEV帰属のシミュレーションベースの手法で用いられる。

## concentrated liquidity mechanisms
- ja: 集中流動性メカニズム
- aliases: [concentrated liquidity AMMs]
- related: [AMM, Uniswap V3]
- auto_added: 2026-06-13
- auto_source_topic_id: 25124
- auto_source_url: https://ethresear.ch/t/the-origins-of-mev-systematic-attribution-of-arbitrage-opportunity-creation-at-scale/25124
- desc: |
  Uniswap V3などで採用されている、特定の価格帯に流動性を集中させるAMMの仕組み。資本効率が高い一方で、価格の不均衡が生じやすく、裁定取引機会を頻繁に生み出す要因となる。

## SETCODEFROM
- ja: SETCODEFROM (EVM命令)
- related: [EVM instruction, EIP-8298, Contract bytecode reuse, EOA migration]
- auto_added: 2026-06-13
- auto_source_topic_id: 28779
- auto_source_url: https://ethereum-magicians.org/t/eip-8298-setcodefrom-code-reuse-instruction/28779
- desc: |
  現在のアカウントが既存のデプロイ済みコントラクトのコードハッシュを採用できるようにするEVM命令です。これにより、コードの再利用が可能になり、デプロイコストの削減やEOAの移行に利用されます。

## Contract bytecode reuse
- ja: コントラクトバイトコードの再利用
- related: [SETCODEFROM, deployment economics, code-deposit gas]
- auto_added: 2026-06-13
- auto_source_topic_id: 28779
- auto_source_url: https://ethereum-magicians.org/t/eip-8298-setcodefrom-code-reuse-instruction/28779
- desc: |
  既にデプロイされているコントラクトのバイトコードを別のアカウントが再利用する概念です。これにより、重複するコードのデプロイコストを削減し、ブロックチェーンの状態成長を抑制する効果が期待されます。

## state growth
- ja: 状態成長
- related: [state expiry, state preservation, deployment economics]
- auto_added: 2026-06-13
- auto_source_topic_id: 28779
- auto_source_url: https://ethereum-magicians.org/t/eip-8298-setcodefrom-code-reuse-instruction/28779
- desc: |
  ブロックチェーンのストレージに保存されるデータの総量が増加していく現象です。コントラクトのデプロイやトランザクションの実行によって状態が更新・追加されることで発生し、ノードの運用コストやスケーラビリティに影響を与えます。

## code-deposit gas
- ja: コードデポジットガス
- related: [deployment economics, Contract bytecode reuse, gas]
- auto_added: 2026-06-13
- auto_source_topic_id: 28779
- auto_source_url: https://ethereum-magicians.org/t/eip-8298-setcodefrom-code-reuse-instruction/28779
- desc: |
  コントラクトのバイトコードをブロックチェーンにデプロイする際に発生するガス料金です。このコストは、デプロイされるコードのサイズに比例し、ブロックチェーンの状態成長に影響を与えます。

## consensus state
- ja: コンセンサス状態
- related: [consensus layer, state root]
- auto_added: 2026-06-13
- auto_source_topic_id: 28779
- auto_source_url: https://ethereum-magicians.org/t/eip-8298-setcodefrom-code-reuse-instruction/28779
- desc: |
  ブロックチェーンネットワークの参加者間で合意された、特定の時点におけるブロックチェーンの全体の状態です。これには、アカウント残高、コントラクトコード、ストレージなどが含まれ、トランザクションの検証とブロックの構築の基礎となります。

## Aggregator
- ja: アグリゲーター
- aliases: [PQ Attestation Aggregator]
- related: [PQ Ethereum, BLS signatures, hash-based signatures, succinct proofs, validator attestations, block production]
- auto_added: 2026-06-13
- auto_source_topic_id: 28778
- auto_source_url: https://ethereum-magicians.org/t/eip-8292-pq-attestation-aggregators/28778
- desc: |
  Post-Quantum Ethereumにおいて、BLS署名がより大きな耐量子ハッシュベース署名に置き換えられる際に、検証コストの高い多数のバリデータアッテステーションを簡潔な証明で検証し、ブロック生成からこの高負荷な作業を分離する役割を担う高スペックノード。

## PQ Ethereum
- ja: 耐量子イーサリアム (PQ Ethereum)
- aliases: [Post-Quantum Ethereum]
- related: [Post-Quantum, BLS signatures, hash-based signatures]
- auto_added: 2026-06-13
- auto_source_topic_id: 28778
- auto_source_url: https://ethereum-magicians.org/t/eip-8292-pq-attestation-aggregators/28778
- desc: |
  BLS署名が耐量子ハッシュベース署名に置き換えられた、将来のイーサリアムプロトコルを指す。これにより、量子コンピュータによる攻撃からネットワークのセキュリティを保護することを目指す。

## L* hard fork
- ja: L* ハードフォーク
- related: [hard fork, PQ Ethereum, Aggregator]
- auto_added: 2026-06-13
- auto_source_topic_id: 28778
- auto_source_url: https://ethereum-magicians.org/t/eip-8292-pq-attestation-aggregators/28778
- desc: |
  PQ Attestation Aggregatorsの導入を含む、将来のイーサリアムのハードフォークの仮称。このハードフォークで、耐量子ハッシュベース署名への移行と、アグリゲーターの役割が導入される予定。

## succinct proofs
- ja: 簡潔な証明
- related: [zero-knowledge proof, ZKP, attestation aggregation]
- auto_added: 2026-06-13
- auto_source_topic_id: 28778
- auto_source_url: https://ethereum-magicians.org/t/eip-8292-pq-attestation-aggregators/28778
- desc: |
  検証にかかる計算量が証明の複雑さや入力データ量に比べて非常に小さい暗号学的証明。Ethereumでは、特にロールアップやアッテステーションの集約など、スケーラビリティと効率性の向上に利用される。

## Partitioned Binary Tree
- ja: パーティション化されたバイナリツリー
- related: [hexary Patricia tries, binary state tree, zone identifier]
- auto_added: 2026-06-13
- auto_source_topic_id: 28776
- auto_source_url: https://ethereum-magicians.org/t/eip-8297-partitioned-binary-tree/28776
- desc: |
  EIP-8297で提案されている、既存のヘキサリパトリシアトライに代わる新しいステートツリー構造。アカウントとストレージのトライを単一のツリーに統合し、キーの上位ビットでゾーンに分割することで、状態のカテゴリ（アカウントヘッダー、コントラクトコード、ストレージ）を識別する。

## hexary Patricia tries
- ja: ヘキサリパトリシアトライ
- related: [Partitioned Binary Tree, Merkle Patricia Trie]
- auto_added: 2026-06-13
- auto_source_topic_id: 28776
- auto_source_url: https://ethereum-magicians.org/t/eip-8297-partitioned-binary-tree/28776
- desc: |
  Ethereumの現在のステートツリー構造で用いられているデータ構造。16進数（hexary）のキーに基づいてノードが分岐するパトリシアトライの一種で、EIP-8297で提案されるPartitioned Binary Treeに置き換えられることが意図されている。

## binary state tree
- ja: バイナリステートツリー
- related: [Partitioned Binary Tree, hexary Patricia tries]
- auto_added: 2026-06-13
- auto_source_topic_id: 28776
- auto_source_url: https://ethereum-magicians.org/t/eip-8297-partitioned-binary-tree/28776
- desc: |
  Ethereumの状態を表現するために使用される、キーがバイナリ（2進数）で分岐するツリー構造。EIP-8297で提案されるPartitioned Binary Treeは、このバイナリステートツリーの一種である。

## zone identifier
- ja: ゾーン識別子
- related: [Partitioned Binary Tree]
- auto_added: 2026-06-13
- auto_source_topic_id: 28776
- auto_source_url: https://ethereum-magicians.org/t/eip-8297-partitioned-binary-tree/28776
- desc: |
  Partitioned Binary Treeにおいて、キーの上位ビットによって状態のカテゴリ（アカウントヘッダー、コントラクトコード、ストレージなど）を識別するために使用される値。これにより、ツリー内のデータの局所性が向上する。

## account headers
- ja: アカウントヘッダー
- related: [Partitioned Binary Tree, contract code, storage]
- auto_added: 2026-06-13
- auto_source_topic_id: 28776
- auto_source_url: https://ethereum-magicians.org/t/eip-8297-partitioned-binary-tree/28776
- desc: |
  Partitioned Binary Treeにおいて、アカウントに関する主要な情報（例: ノンス、残高、ストレージルート、コードハッシュなど）を保持するデータ構造。ツリー内の特定のゾーンに格納される状態カテゴリの一つ。

## Ethereum JSON-RPC Specification
- ja: Ethereum JSON-RPC仕様
- related: [JSON-RPC, Execution APIs]
- auto_added: 2026-06-13
- auto_source_topic_id: 28775
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-28-june-15-2026-15-00-utc/28775
- desc: |
  Ethereumクライアントが外部アプリケーションと通信するための標準的なインターフェースを定義する仕様。ブロックチェーンの状態照会やトランザクション送信などに用いられる。

## Execution APIs
- ja: 実行API (Execution APIs)
- related: [Ethereum JSON-RPC Specification, Execution Layer]
- auto_added: 2026-06-13
- auto_source_topic_id: 28775
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-28-june-15-2026-15-00-utc/28775
- desc: |
  Ethereumの実行層（Execution Layer）とやり取りするためのAPI群。主にJSON-RPCプロトコルに基づいており、クライアントがブロックの構築、トランザクションの処理、状態の取得などを行うために使用される。

## eth_baseFee
- ja: eth_baseFee
- related: [Base Fee, EIP-1559]
- auto_added: 2026-06-13
- auto_source_topic_id: 28775
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-28-june-15-2026-15-00-utc/28775
- desc: |
  EthereumのJSON-RPCメソッドの一つで、EIP-1559で導入された現在のベースフィー（基本手数料）を取得するために使用される。トランザクションのガス価格計算に不可欠な情報を提供する。

## depositContractAddress
- ja: デポジットコントラクトアドレス (Deposit Contract Address)
- related: [Deposit Contract, Staking]
- auto_added: 2026-06-13
- auto_source_topic_id: 28775
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-28-june-15-2026-15-00-utc/28775
- desc: |
  Ethereum 2.0（コンセンサス層）へのETHのステーキングに使用される、特定のスマートコントラクトのアドレス。バリデーターがETHをロックし、ステーキングプロセスを開始するためにこのコントラクトとやり取りする。

## txpool namespace
- ja: txpoolネームスペース (txpool namespace)
- related: [Transaction Pool, Mempool, JSON-RPC]
- auto_added: 2026-06-13
- auto_source_topic_id: 28775
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-28-june-15-2026-15-00-utc/28775
- desc: |
  Ethereum JSON-RPC仕様における、トランザクションプール（mempool）に関連するメソッド群をまとめたネームスペース。保留中のトランザクションの情報を照会したり、トランザクションのステータスを監視したりするために使用される。

## Fixed-Cutoff State Tiering
- ja: 固定カットオフ型ステート階層化
- related: [State Expiry, CUTOFF_BLOCK, Inactive state]
- auto_added: 2026-06-13
- auto_source_topic_id: 28772
- auto_source_url: https://ethereum-magicians.org/t/eip-8296-fixed-cutoff-state-tiering/28772
- desc: |
  長期間変更されていないステートへの書き込みに課金することで、ステートをアクティブと非アクティブに分類し、管理する提案。非アクティブなステートはトライに残り、削除や復活のメカニズムは不要となる。

## CUTOFF_BLOCK
- ja: カットオフブロック
- related: [Fixed-Cutoff State Tiering, last_written_block]
- auto_added: 2026-06-13
- auto_source_topic_id: 28772
- auto_source_url: https://ethereum-magicians.org/t/eip-8296-fixed-cutoff-state-tiering/28772
- desc: |
  固定カットオフ型ステート階層化において、ステートのアクティブ/非アクティブ状態を区別するための基準となるブロック番号。このブロック以前に最後に書き込まれたステートは非アクティブとみなされる。

## last_written_block
- ja: 最終書き込みブロック
- related: [CUTOFF_BLOCK, EIP-8188]
- auto_added: 2026-06-13
- auto_source_topic_id: 28772
- auto_source_url: https://ethereum-magicians.org/t/eip-8296-fixed-cutoff-state-tiering/28772
- desc: |
  EIP-8188で定義される、アカウントまたはストレージスロットが最後に書き込まれたブロック番号を示す属性。ステートの活動状態を判断するために使用される。

## eviction mechanism
- ja: 削除メカニズム
- related: [State Expiry, resurrection mechanism]
- auto_added: 2026-06-13
- auto_source_topic_id: 28772
- auto_source_url: https://ethereum-magicians.org/t/eip-8296-fixed-cutoff-state-tiering/28772
- desc: |
  ブロックチェーンのステート管理において、長期間アクセスされていない、または非アクティブとみなされるステートを削除またはアーカイブするための仕組み。ステートの肥大化を防ぐ目的で検討される。

## resurrection mechanism
- ja: 復活メカニズム
- related: [State Expiry, eviction mechanism]
- auto_added: 2026-06-13
- auto_source_topic_id: 28772
- auto_source_url: https://ethereum-magicians.org/t/eip-8296-fixed-cutoff-state-tiering/28772
- desc: |
  ブロックチェーンのステート管理において、削除またはアーカイブされた非アクティブなステートを、必要に応じて再びアクティブなステートとして利用可能にするための仕組み。

## Stealth Name Resolution
- ja: ステルス名解決
- related: [stealth meta-address, ERC-5564, ERC-6538, ENSIP-10]
- auto_added: 2026-06-14
- auto_source_topic_id: 28787
- auto_source_url: https://ethereum-magicians.org/t/draft-proposal-stealth-name-resolution-stealth-meta-address-names-across-asynchronous-chains/28787
- desc: |
  ステルスメタアドレスを人間が読める名前に解決するためのレイヤーを定義する提案。特に非EVM環境でのクロスチェーン名前解決を目的とし、既存のENSIP-10ワイルドカードリゾルバーと連携する。

## stealth meta-address
- ja: ステルスメタアドレス
- related: [Stealth address, ERC-5564, ERC-6538]
- auto_added: 2026-06-14
- auto_source_topic_id: 28787
- auto_source_url: https://ethereum-magicians.org/t/draft-proposal-stealth-name-resolution-stealth-meta-address-names-across-asynchronous-chains/28787
- desc: |
  複数のチェーンやトランザクションで再利用可能な、単一の公開鍵から派生するステルスアドレス。プライバシーを維持しつつ、ユーザーが簡単に識別できる単一の識別子を提供する。

## ERC-6538
- ja: ERC-6538
- related: [stealth meta-address, ERC-5564]
- auto_added: 2026-06-14
- auto_source_topic_id: 28787
- auto_source_url: https://ethereum-magicians.org/t/draft-proposal-stealth-name-resolution-stealth-meta-address-names-across-asynchronous-chains/28787
- desc: |
  ステルスメタアドレスを登録し、その公開鍵をオンチェーンで管理するためのEthereum標準。これにより、ユーザーは単一の識別子で複数のステルスアドレスを生成・管理できる。

## ERC-5564
- ja: ERC-5564
- related: [stealth meta-address, ERC-6538]
- auto_added: 2026-06-14
- auto_source_topic_id: 28787
- auto_source_url: https://ethereum-magicians.org/t/draft-proposal-stealth-name-resolution-stealth-meta-address-names-across-asynchronous-chains/28787
- desc: |
  ステルスメタアドレスへの支払いを可能にするためのEthereum標準。これにより、受信者のプライバシーを保護しつつ、ユーザーが簡単に資金を送金できる。

## mirror payload
- ja: ミラーペイロード
- related: [canonical-chain-wins model, cross-chain name resolution]
- auto_added: 2026-06-14
- auto_source_topic_id: 28787
- auto_source_url: https://ethereum-magicians.org/t/draft-proposal-stealth-name-resolution-stealth-meta-address-names-across-asynchronous-chains/28787
- desc: |
  非EVMチェーンがEthereum RPCエンドポイントを照会することなく、読み取り専用の名前レコードを維持できるように設計された、トランスポートに依存しないデータ形式。ブリッジを介して送信され、クロスチェーンの名前解決を可能にする。

## Agentic Commerce
- ja: エージェント型商取引 (Agentic Commerce)
- related: [AI Agent]
- auto_added: 2026-06-14
- auto_source_topic_id: 28785
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-ai-agent-execution/28785
- desc: |
  AIエージェントが自律的に参加し、商品やサービスの交換、契約の締結、支払いなどを実行する商取引の形態。ERC-8183などの標準によって実現される。

## AgentTask
- ja: エージェントタスク
- related: [IAgentCaller, IAgentHandler]
- auto_added: 2026-06-14
- auto_source_topic_id: 28785
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-ai-agent-execution/28785
- desc: |
  スマートコントラクトがAIエージェントに実行を依頼するタスクの定義を構造化したもの。タスクID、プロンプトハッシュ、モデルID、ハンドラー、検証者、期限などのフィールドを含む。

## IAgentCaller
- ja: IAgentCaller (インターフェース)
- related: [AgentTask, IAgentHandler]
- auto_added: 2026-06-14
- auto_source_topic_id: 28785
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-ai-agent-execution/28785
- desc: |
  スマートコントラクトがAIエージェントを呼び出し、タスクをディスパッチするための標準インターフェース。`callAgent`関数を通じてタスクの実行をトリガーする。

## IAgentHandler
- ja: IAgentHandler (インターフェース)
- related: [AgentTask, IAgentCaller, Optimistic Handler]
- auto_added: 2026-06-14
- auto_source_topic_id: 28785
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-ai-agent-execution/28785
- desc: |
  AIエージェントがタスクの結果を返信し、関連する証明を提出するための標準インターフェース。`onAgentReply`と`onAgentProve`の2つの主要なコールバック関数を定義する。

## Optimistic Handler
- ja: オプティミスティックハンドラー
- related: [IAgentHandler]
- auto_added: 2026-06-14
- auto_source_topic_id: 28785
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-ai-agent-execution/28785
- desc: |
  AIエージェントからの返信（結果）を即座に処理し、その後に証明の提出を非同期的に待つ設計パターンを採用したハンドラー。これにより、応答の迅速性と最終的な検証を両立させる。

## IERC8060Reservable
- ja: IERC8060Reservable
- related: [ERC-8060, Reservation accounting]
- auto_added: 2026-06-14
- auto_source_topic_id: 28780
- auto_source_url: https://ethereum-magicians.org/t/discussion-ierc8060reservable-a-minimal-reservation-accounting-extension-for-erc-8060/28780
- desc: |
  ERC-8060に値を持つNFTのための、予約会計を可能にする最小限のオプション拡張インターフェース。NFTの所有権を移転したり資金を移動させたりすることなく、その埋め込まれた価値の一部を一時的にロックするワークフローをサポートします。

## Reservation accounting
- ja: 予約会計
- related: [IERC8060Reservable, Locked value, Available value]
- auto_added: 2026-06-14
- auto_source_topic_id: 28780
- auto_source_url: https://ethereum-magicians.org/t/discussion-ierc8060reservable-a-minimal-reservation-accounting-extension-for-erc-8060/28780
- desc: |
  NFTなどのオンチェーン資産の埋め込まれた価値の一部を、所有権の移転なしに一時的にロックする仕組みに関する会計処理。決済ロジックとは独立して、予約された価値が引き出されたり二重使用されたりするのを防ぐことを目的とします。

## Token-bound reservations
- ja: トークンに紐づく予約
- related: [IERC8060Reservable, Token bound account]
- auto_added: 2026-06-14
- auto_source_topic_id: 28780
- auto_source_url: https://ethereum-magicians.org/t/discussion-ierc8060reservable-a-minimal-reservation-accounting-extension-for-erc-8060/28780
- desc: |
  NFTなどのトークンIDに直接紐付けられた価値の予約。トークンが転送されると、その予約もトークンと共に移動する特性を持ちます。これにより、トークンが持つ価値の一部を一時的にロックし、特定の目的のために確保することが可能になります。

## Locked value
- ja: ロックされた価値
- related: [Available value, Reservation accounting, IERC8060Reservable]
- auto_added: 2026-06-14
- auto_source_topic_id: 28780
- auto_source_url: https://ethereum-magicians.org/t/discussion-ierc8060reservable-a-minimal-reservation-accounting-extension-for-erc-8060/28780
- desc: |
  NFTなどのオンチェーン資産において、特定の目的のために一時的に予約され、引き出しや使用が制限されている価値の量。IERC8060Reservableでは、この値はトークンIDに紐付けられ、トークンと共に移動します。

## Available value
- ja: 利用可能な価値
- related: [Locked value, Reservation accounting, IERC8060Reservable]
- auto_added: 2026-06-14
- auto_source_topic_id: 28780
- auto_source_url: https://ethereum-magicians.org/t/discussion-ierc8060reservable-a-minimal-reservation-accounting-extension-for-erc-8060/28780
- desc: |
  NFTなどのオンチェーン資産において、現在予約されておらず、自由に引き出しや使用が可能な価値の量。総価値からロックされた価値を差し引いたものとして計算されます。

## Payer Services
- ja: ペイヤーサービス
- related: [ERC-8168, ERC-8130]
- auto_added: 2026-06-14
- auto_source_topic_id: 28762
- auto_source_url: https://ethereum-magicians.org/t/erc-8168-payer-services-for-erc-8130/28762
- desc: |
  ERC-8168によって定義されるサービスで、ERC-8130チェーン上で利用されます。トランザクションのガス代などを第三者が支払う機能を提供し、ユーザーエクスペリエンスの向上を目指します。

## All Core Devs - Testing
- ja: 全コア開発者会議 - テスト (ACDT)
- aliases: [ACDT]
- related: [All Core Devs, devnet]
- auto_added: 2026-06-14
- auto_source_topic_id: 28759
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-testing-acdt-83-june-15-2026/28759
- desc: |
  Ethereumプロトコルのコア開発者が、プロトコルの変更やアップグレードのテスト状況について議論する定期的な会議です。主に開発ネット（devnet）でのテスト結果や課題が共有されます。

## forkcast
- ja: フォークキャスト
- related: [All Core Devs, ACDT]
- auto_added: 2026-06-14
- auto_source_topic_id: 28759
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-testing-acdt-83-june-15-2026/28759
- desc: |
  Ethereumのコア開発者会議（All Core Devs Calls）の議事録や要約を提供するウェブプラットフォームです。会議の内容を追跡し、コミュニティに情報共有する役割を果たすために利用されます。

## Security Semantics
- ja: セキュリティセマンティクス
- related: [Role Tier Derivation Rules, Grantor Authorization Pattern, Category-Action Registry]
- auto_added: 2026-06-14
- auto_source_topic_id: 28757
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-role-semantics-standard/28757
- desc: |
  スマートコントラクトのロール名から、そのロールが持つセキュリティ上の意味や影響を導出する概念。権限の階層、認証関係、職務分掌制約などを明確にするために用いられる。

## Role Tier Derivation Rules
- ja: ロールティア導出ルール
- related: [Authorization tier, Security Semantics]
- auto_added: 2026-06-14
- auto_source_topic_id: 28757
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-role-semantics-standard/28757
- desc: |
  スマートコントラクトのロール名から、そのロールの権限階層（ティア）を決定論的に導出するための規則。これにより、ロールのリスクレベルを自動的に評価し、セキュリティ監査の優先順位付けを可能にする。

## Grantor Authorization Pattern
- ja: グラントール認証パターン
- related: [Security Semantics, Grant role]
- auto_added: 2026-06-14
- auto_source_topic_id: 28757
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-role-semantics-standard/28757
- desc: |
  ロール名に認証関係を直接エンコードすることで、どのロールが他のロールの権限付与を管理するかを明確にするパターン。これにより、認証ツリーの可読性が向上し、監査が容易になる。

## Category-Action Registry
- ja: カテゴリ-アクションレジストリ
- related: [Security Semantics, action lexical classification]
- auto_added: 2026-06-14
- auto_source_topic_id: 28757
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-role-semantics-standard/28757
- desc: |
  スマートコントラクトのロールにおけるカテゴリとアクションの組み合わせが、既知の安全なパターンに属するかどうかを定義・検証するためのレジストリ。これにより、異常なロールの組み合わせを自動的に識別できる。

## action lexical classification
- ja: アクション語彙分類
- related: [atomic role, scope role, grant role, Security Semantics]
- auto_added: 2026-06-14
- auto_source_topic_id: 28757
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-role-semantics-standard/28757
- desc: |
  スマートコントラクトのロール名におけるアクション部分を、その意味論的な役割（例：atomic, scope, grant）に基づいて分類すること。これにより、異なるリスクレベルや権限付与の性質を持つアクションを区別できる。

## Contract Role Naming Pattern
- ja: コントラクトロール命名パターン
- aliases: [role.{category}.{action}]
- related: [Core Role Set, Role Hash Derivation]
- auto_added: 2026-06-14
- auto_source_topic_id: 28756
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-role-naming-standard/28756
- desc: |
  スマートコントラクトにおける特権ロールの命名規則を標準化するための階層型パターン。`role.{カテゴリ}.{アクション}`の形式で、ロールの機能ドメインと操作を明確に示し、一貫した命名とハッシュによる発見可能性を可能にする。

## Core Role Set
- ja: コアロールセット
- aliases: [Universal Roles, Functionality-Conditional Roles]
- related: [Contract Role Naming Pattern, Role Confusion Attack, Semantic Drift Attack]
- auto_added: 2026-06-14
- auto_source_topic_id: 28756
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-role-naming-standard/28756
- desc: |
  ERC-XXXXで定義される、プロトコル間で頻繁に登場し、誤用が資金損失やガバナンス侵害に直結しうる特権ロールの固定された集合。普遍的なロールと機能条件付きロールに分類される。

## Role Confusion Attack
- ja: ロール混同攻撃
- related: [Semantic Drift Attack, Core Role Set]
- auto_added: 2026-06-14
- auto_source_topic_id: 28756
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-role-naming-standard/28756
- desc: |
  スマートコントラクトにおいて、プロトコル間で同名のロールが異なる権限を持つことによって発生するセキュリティ上の脆弱性。監査ツールがロールの権限を名前だけで区別できないため、誤ったセキュリティ評価につながる可能性がある。

## Semantic Drift Attack
- ja: 意味ドリフト攻撃
- related: [Role Confusion Attack, Core Role Set]
- auto_added: 2026-06-14
- auto_source_topic_id: 28756
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-role-naming-standard/28756
- desc: |
  スマートコントラクトにおいて、ロール名がその実際の操作と異なる意味を持つことで、監査者の仮定を悪用し、誤ったセキュリティ認識を生じさせる攻撃。例えば、「BURNER」ロールが実際にはミント操作を行う場合など。

## Adoption Levels
- ja: 導入レベル
- aliases: [Progressive Adoption]
- related: [On-chain Query Interface, Contract Role Semantics Standard]
- auto_added: 2026-06-14
- auto_source_topic_id: 28756
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-role-naming-standard/28756
- desc: |
  ERC-XXXXで定義される、スマートコントラクトがロール命名標準を段階的に導入するための構造化されたアプローチ。レベル1（命名規則のみ）、レベル2（オンチェーンクエリインターフェース）、レベル3（オンチェーンセマンティック導出インターフェース）がある。

## Invariant-First Reserve Receipt Token
- ja: インバリアントファースト準備金受領トークン
- aliases: [IFR, IFR-pETH]
- related: [ERC-20, reserve-backed token, solvency as a transaction-validity condition]
- auto_added: 2026-06-14
- auto_source_topic_id: 28753
- auto_source_url: https://ethereum-magicians.org/t/erc-discussion-invariant-first-reserve-receipt-token-ifr-peth/28753
- desc: |
  準備金に裏付けられたトークンのためのERC-20互換の標準であり、ソルベンシー（支払能力）を外部の準備金証明レポートではなく、トランザクションの有効性条件として強制します。これにより、すべての状態遷移で特定の会計不変条件が維持されることを保証し、オンチェーンでの支払能力の検証を可能にします。

## solvency as a transaction-validity condition
- ja: トランザクション有効性条件としてのソルベンシー
- related: [Invariant-First Reserve Receipt Token, accounting invariant, proof-of-reserves]
- auto_added: 2026-06-14
- auto_source_topic_id: 28753
- auto_source_url: https://ethereum-magicians.org/t/erc-discussion-invariant-first-reserve-receipt-token-ifr-peth/28753
- desc: |
  トークンの支払能力（ソルベンシー）を、外部レポートではなく、ブロックチェーン上のトランザクションが有効であるための必須条件として強制するメカニズムです。これにより、各状態遷移後にソルベンシーが維持されることがオンチェーンで保証され、サイレントな不履行の蓄積を防ぎます。

## accounting invariant
- ja: 会計不変条件
- related: [Invariant-First Reserve Receipt Token, solvency as a transaction-validity condition, state tuple]
- auto_added: 2026-06-14
- auto_source_topic_id: 28753
- auto_source_url: https://ethereum-magicians.org/t/erc-discussion-invariant-first-reserve-receipt-token-ifr-peth/28753
- desc: |
  システムの整合性を維持するために、すべての状態遷移後に必ず満たされなければならない数学的な条件です。IFR標準では、T + F == R および address(this).balance >= R の2つの条件がこれに該当し、準備金トークンの支払能力を保証します。

## state tuple
- ja: 状態タプル
- related: [Invariant-First Reserve Receipt Token, accounting invariant]
- auto_added: 2026-06-14
- auto_source_topic_id: 28753
- auto_source_url: https://ethereum-magicians.org/t/erc-discussion-invariant-first-reserve-receipt-token-ifr-peth/28753
- desc: |
  特定のシステムの状態を定義するために使用される、関連する変数の集合です。IFR標準では、準備金(R)、未償還トークン供給量(T)、プロトコル手数料(F)の3つの変数で構成され、これらの変数が会計不変条件の基礎となります。

## reserve-backed token
- ja: 準備金裏付けトークン
- related: [Invariant-First Reserve Receipt Token, ETH wrapper]
- auto_added: 2026-06-14
- auto_source_topic_id: 28753
- auto_source_url: https://ethereum-magicians.org/t/erc-discussion-invariant-first-reserve-receipt-token-ifr-peth/28753
- desc: |
  実際の資産（準備金）によって価値が裏付けられているトークンです。その価値は、裏付けとなる準備金の量と質に依存し、DeFiプロトコルにおいて担保やステーブルコインとして利用されます。

## Hegotá
- ja: ヘゴタ (Hegotá)
- auto_added: 2026-06-14
- auto_source_topic_id: 28751
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-execution-acde-239-june-18-2026/28751
- desc: |
  Ethereumの次期アップグレードのコードネームの一つ。プロトコルの改善や新機能の導入を目的とした開発フェーズを指します。

## Multisig
- ja: マルチシグ（マルチシグネチャ）
- aliases: [Multi-signature]
- related: [Smart contract wallet, Account abstraction, MPC]
- auto_added: 2026-06-15
- auto_source_topic_id: 28749
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-transaction-signature-10/28749
- desc: |
  複数の署名者がトランザクションを承認する必要がある仕組み。通常、スマートコントラクトによって実装され、資金のセキュリティを高めるために使用される。特に、共同管理やセキュリティ強化の目的で利用される。

## Smart Contract Emergency States
- ja: スマートコントラクト緊急状態
- related: [IEmergencyState, EmergencyStateChanged]
- auto_added: 2026-06-15
- auto_source_topic_id: 28748
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-smart-contract-emergency-states/28748
- desc: |
  スマートコントラクトが異常な状態にあることを示すための標準化された状態。このERCは、プロトコル間で相互運用可能な検出を可能にするための、これらの状態を観測するための標準インターフェースを定義します。

## IEmergencyState
- ja: IEmergencyState（緊急状態インターフェース）
- related: [Smart Contract Emergency States, EmergencyStateChanged]
- auto_added: 2026-06-15
- auto_source_topic_id: 28748
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-smart-contract-emergency-states/28748
- desc: |
  スマートコントラクトの緊急状態を観測するための標準インターフェース。現在の緊急状態と、その状態が最後に更新されたタイムスタンプを提供します。

## EmergencyStateChanged
- ja: EmergencyStateChanged（緊急状態変更イベント）
- related: [IEmergencyState, Smart Contract Emergency States]
- auto_added: 2026-06-15
- auto_source_topic_id: 28748
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-smart-contract-emergency-states/28748
- desc: |
  スマートコントラクトの緊急状態が新しい値に設定されたときに発行されるイベント。状態変更をトリガーしたアドレス、変更前の状態、変更後の状態が含まれます。

## State transition function
- ja: 状態遷移関数
- related: [Smart Contract Emergency States]
- auto_added: 2026-06-15
- auto_source_topic_id: 28748
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-smart-contract-emergency-states/28748
- desc: |
  スマートコントラクトの状態を変更する機能を指します。このERCでは、緊急状態の観測のみを標準化し、状態遷移関数とその承認パターンはプロトコル固有の実装に委ねられています。

## Observation layer
- ja: 観測レイヤー
- related: [IEmergencyState, State transition function]
- auto_added: 2026-06-15
- auto_source_topic_id: 28748
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-smart-contract-emergency-states/28748
- desc: |
  システムにおいて、状態の読み取りや監視に特化した部分。このERCは、スマートコントラクトの緊急状態を「観測」するためのインターフェースを定義しており、状態を「変更」するアクションレイヤーとは区別されます。

## VRF
- ja: 検証可能乱数関数 (VRF)
- aliases: [Verifiable Random Function]
- related: [RANDAO, Post-Quantum VRF]
- auto_added: 2026-06-15
- auto_source_topic_id: 28743
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-vrf-for-ethereum-ethresear-ch-cross-post/28743
- desc: |
  暗号学的な乱数生成関数で、その出力が特定の入力と秘密鍵から正しく生成されたことを公開鍵で検証できる。ブロックチェーンのコンセンサスプロトコルでランダム性を確保するために利用される。

## RANDAO
- ja: RANDAO
- related: [randao_reveal, VRF]
- auto_added: 2026-06-15
- auto_source_topic_id: 28743
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-vrf-for-ethereum-ethresear-ch-cross-post/28743
- desc: |
  Ethereumのコンセンサス層で使用される、検証可能な乱数生成メカニズム。バリデータからのコミットメントと公開を通じて、予測不可能な乱数を生成し、ブロック提案者の選出などに利用される。

## BeaconBlockBody
- ja: ビーコンブロックボディ
- related: [Beacon Chain]
- auto_added: 2026-06-15
- auto_source_topic_id: 28743
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-vrf-for-ethereum-ethresear-ch-cross-post/28743
- desc: |
  Ethereumのビーコンチェーンにおけるブロックの主要な構成要素。トランザクション、アテステーション、RANDAOの公開値など、ブロックのペイロードに関する情報が含まれる。

## BLS keys
- ja: BLS鍵
- related: [BLS signature]
- auto_added: 2026-06-15
- auto_source_topic_id: 28743
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-vrf-for-ethereum-ethresear-ch-cross-post/28743
- desc: |
  Boneh-Lynn-Shacham (BLS) 署名スキームに基づく公開鍵と秘密鍵のペア。Ethereumのコンセンサス層では、バリデータがブロックの署名やアテステーションに利用する。

## WHIR proof
- ja: WHIR証明
- related: [Post-Quantum VRF]
- auto_added: 2026-06-15
- auto_source_topic_id: 28743
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-vrf-for-ethereum-ethresear-ch-cross-post/28743
- desc: |
  投稿で提案されている、ハッシュベースのVRFの証明に用いられる特定の種類の暗号証明。量子耐性を持つVRFの構成要素として導入されている。

## Role-Based Timelock Operation
- ja: ロールベース・タイムロック操作
- aliases: [Role-Based Timelock]
- related: [TimelockController, Access Control, RBAC]
- auto_added: 2026-06-15
- auto_source_topic_id: 28742
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-role-based-timelock-operation/28742
- desc: |
  スマートコントラクトのアクセス制御システムにおいて、特定のロールに紐付けられた特権操作に時間遅延を強制するメカニズム。特権キーが侵害された際に、防御側が介入する機会を提供する。

## IRoleBasedTimelock
- ja: IRoleBasedTimelock (インターフェース)
- related: [Role-Based Timelock Operation, ERC-165]
- auto_added: 2026-06-15
- auto_source_topic_id: 28742
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-role-based-timelock-operation/28742
- desc: |
  ロールベースのタイムロック強制のためのコアインターフェース。スマートコントラクトがこのERCに準拠するために実装する必要がある。

## opHash
- ja: opHash (操作ハッシュ)
- aliases: [operation hash]
- related: [paramsHash, selector]
- auto_added: 2026-06-15
- auto_source_topic_id: 28742
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-role-based-timelock-operation/28742
- desc: |
  スケジュールされた操作を一意に識別するためのbytes32値。ロール、呼び出し元、ターゲット、セレクター、パラメータハッシュをエンコードして計算される。

## Integrated Pattern
- ja: 統合パターン
- related: [Controller Pattern, onlyTimelockedRole modifier]
- auto_added: 2026-06-15
- auto_source_topic_id: 28742
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-role-based-timelock-operation/28742
- desc: |
  ロールベース・タイムロックの実装パターンの一つで、タイムロックのチェックがターゲットコントラクト自体に修飾子（modifier）を介して直接組み込まれる方式。ガスオーバーヘッドが低く、元の関数シグネチャを保持する。

## Controller Pattern
- ja: コントローラーパターン
- related: [Integrated Pattern, IRoleBasedTimelockExecute]
- auto_added: 2026-06-15
- auto_source_topic_id: 28742
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-role-based-timelock-operation/28742
- desc: |
  ロールベース・タイムロックの実装パターンの一つで、タイムロックのロジックが既存のコントラクトとは別のコントローラーコントラクトにデプロイされ、既存コントラクトがそのコントローラーに特権ロールを付与する方式。

## Time-Delayed Access Control
- ja: 時間遅延型アクセス制御
- related: [Access Control, Role-Based Access Control]
- auto_added: 2026-06-15
- auto_source_topic_id: 28741
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-time-delayed-access-control/28741
- desc: |
  スマートコントラクトのアクセス制御において、ロールの付与や剥奪が設定可能な遅延期間を経てから有効になる仕組み。特権昇格攻撃に対する防御策として機能します。

## Delayed Role Activation
- ja: 遅延ロール有効化
- related: [Time-Delayed Access Control, Role Management]
- auto_added: 2026-06-15
- auto_source_topic_id: 28741
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-time-delayed-access-control/28741
- desc: |
  スマートコントラクトのロール管理において、ロールの変更（付与または剥奪）が即座に適用されず、設定された遅延期間を経てから有効になる状態。これにより、不正な変更に対する対応時間を提供します。

## Effective Role Evaluation Module
- ja: 実効ロール評価モジュール
- related: [Time-Delayed Access Control, hasEffectiveRole]
- auto_added: 2026-06-15
- auto_source_topic_id: 28741
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-time-delayed-access-control/28741
- desc: |
  スマートコントラクトのアクセス制御システムにおいて、アカウントが特定のロールを「実効的に」保持しているかを判断するモジュール。現在のブロックタイムスタンプと、ロールの有効化・剥奪がスケジュールされたタイムスタンプを比較して評価します。

## Auto-Activation Pattern
- ja: 自動有効化パターン
- related: [Time-Delayed Access Control, Query-Based State]
- auto_added: 2026-06-15
- auto_source_topic_id: 28741
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-time-delayed-access-control/28741
- desc: |
  スマートコントラクトのロール変更において、有効化の実行ステップを必要とせず、クエリ時にスケジュールされたタイムスタンプと現在のブロックタイムスタンプを比較することで自動的に状態が反映される設計パターン。これにより、実行時の競合状態や追加ステップが不要になります。

## Admin-Centric Delay Lookup
- ja: 管理者中心遅延参照
- related: [Role Hierarchy, Access Control]
- auto_added: 2026-06-15
- auto_source_topic_id: 28741
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-time-delayed-access-control/28741
- desc: |
  ロールの付与または剥奪にかかる遅延が、そのロール自体の設定ではなく、そのロールの管理者ロールに設定された遅延パラメータに基づいて決定されるメカニズム。これにより、ロール階層全体のセキュリティモデルが簡素化されます。

## Autonomous Agent
- ja: 自律エージェント
- related: [Searcher, Solver, Intent Executor]
- auto_added: 2026-06-16
- auto_source_topic_id: 25202
- auto_source_url: https://ethresear.ch/t/treating-autonomous-agents-as-untrusted-participants-what-the-claude-code-harness-suggests-for-on-chain-mechanism-design/25202
- desc: |
  オンチェーンシステムにおいて、人間以外の参加者として自律的に行動し、トランザクションの検索、解決、意図の実行などを行うプログラム。Ethereumエコシステムにおけるその役割が増大している。

## On-chain Mechanism Design
- ja: オンチェーンメカニズム設計
- related: [Mechanism Design, Incentive Compatibility]
- auto_added: 2026-06-16
- auto_source_topic_id: 25202
- auto_source_url: https://ethresear.ch/t/treating-autonomous-agents-as-untrusted-participants-what-the-claude-code-harness-suggests-for-on-chain-mechanism-design/25202
- desc: |
  ブロックチェーン上のプロトコルにおいて、参加者のインセンティブを調整し、望ましい行動を促すためのルールや構造を設計すること。自律エージェントなどの信頼できない参加者を前提とする。

## Default-Deny Permission Layer
- ja: デフォルト拒否パーミッションレイヤー
- related: [Autonomous Agent, Agent's Permission Envelope]
- auto_added: 2026-06-16
- auto_source_topic_id: 25202
- auto_source_url: https://ethresear.ch/t/treating-autonomous-agents-as-untrusted-participants-what-the-claude-code-harness-suggests-for-on-chain-mechanism-design/25202
- desc: |
  自律エージェントが状態変更アクションを実行する際に、デフォルトで拒否し、明示的な許可があった場合のみ実行を許すセキュリティ層。エージェントの誤動作や悪意ある行動を防ぐために用いられる。

## Agent-Facing Mechanism
- ja: エージェント向けメカニズム
- related: [Autonomous Agent, On-chain Mechanism Design, Incentive Compatibility]
- auto_added: 2026-06-16
- auto_source_topic_id: 25202
- auto_source_url: https://ethresear.ch/t/treating-autonomous-agents-as-untrusted-participants-what-the-claude-code-harness-suggests-for-on-chain-mechanism-design/25202
- desc: |
  自律エージェントが主要な参加者として関与することを想定して設計されたオンチェーンプロトコルやシステム。エージェントの特性（例：合理性、誤謬性）を考慮したインセンティブ設計が求められる。

## Fallibility Term
- ja: 誤謬項
- related: [Incentive Compatibility, Autonomous Agent]
- auto_added: 2026-06-16
- auto_source_topic_id: 25202
- auto_source_url: https://ethresear.ch/t/treating-autonomous-agents-as-untrusted-participants-what-the-claude-code-harness-suggests-for-on-chain-mechanism-design/25202
- desc: |
  インセンティブ互換性分析において、参加者が常に最適な行動（ベストレスポンス）を取るとは限らず、非最適な行動を一定の確率で取る可能性を考慮に入れるための要素。特に自律エージェントの分析で重要となる。

## Orchard shielded-pool model
- ja: Orchardシールドプールモデル
- aliases: [Orchard shielded pool]
- related: [Zcash Protocol Specification, pERC20, shielded pool]
- auto_added: 2026-06-16
- auto_source_topic_id: 25200
- auto_source_url: https://ethresear.ch/t/perc20-private-token-standard-draft/25200
- desc: |
  Zcashプロトコル仕様で定義されているプライバシー保護メカニズム。トランザクションの送信者、受信者、金額を秘匿するために、シールドされたノートとコミットメントツリーを使用します。

## ZIP-32 subaccounts
- ja: ZIP-32サブアカウント
- related: [ZIP-32, hierarchical deterministic wallets, pERC20]
- auto_added: 2026-06-16
- auto_source_topic_id: 25200
- auto_source_url: https://ethresear.ch/t/perc20-private-token-standard-draft/25200
- desc: |
  ZcashのZIP-32階層型決定性ウォレットに基づき、各EOAスペンダーに専用のサブアカウントを割り当てるメカニズム。pERC20では、承認済み支出（approve/transferFrom）のプライバシーを確保するために使用されます。

## PrivacyCall
- ja: PrivacyCall (プライバシーコール)
- related: [pERC20, Orchard actions, binding signature]
- auto_added: 2026-06-16
- auto_source_topic_id: 25200
- auto_source_url: https://ethresear.ch/t/perc20-private-token-standard-draft/25200
- desc: |
  pERC20標準において、値変更を伴う全ての操作（transfer, mint, burnなど）で利用される構造体。Orchardアクションの配列とバインディング署名を含み、プライバシー保護されたトランザクションを可能にします。

## commitment tree
- ja: コミットメントツリー
- related: [Orchard shielded-pool model, nullifier set, ZK-UTXO]
- auto_added: 2026-06-16
- auto_source_topic_id: 25200
- auto_source_url: https://ethresear.ch/t/perc20-private-token-standard-draft/25200
- desc: |
  暗号学的コミットメントを効率的に管理・検証するためのデータ構造。ZcashのOrchardシールドプールモデルやpERC20のようなZK-UTXOシステムにおいて、シールドされたノートの存在を証明するために使用されます。

## Censorship Resistance
- ja: 検閲耐性
- related: [Decentralization, Self-Sovereignty]
- auto_added: 2026-06-16
- auto_source_topic_id: 25196
- auto_source_url: https://ethresear.ch/t/twin-domain-convergence-identity-is-the-com-eth-pair-an-emerging-institutional-namespace-standard-and-how-does-this-relate-to-ethereums-core-mission/25196
- desc: |
  ブロックチェーンネットワークにおいて、特定のトランザクションやユーザーがネットワーク参加者によって意図的にブロックされたり、除外されたりすることを防ぐ特性。イーサリアムのコアミッションの一つであり、分散化されたシステム設計によって実現される。

## Fully Homomorphic Encryption
- ja: 完全準同型暗号 (FHE)
- aliases: [FHE]
- related: [Zero-Knowledge Proof, Confidential Computing]
- auto_added: 2026-06-16
- auto_source_topic_id: 25196
- auto_source_url: https://ethresear.ch/t/twin-domain-convergence-identity-is-the-com-eth-pair-an-emerging-institutional-namespace-standard-and-how-does-this-relate-to-ethereums-core-mission/25196
- desc: |
  暗号化されたデータのままで計算処理を可能にする暗号技術。データを復号することなく演算できるため、プライバシーを保護しながらオンチェーンでの機密計算を実現する上で重要な技術とされている。

## Decentralized Identifiers
- ja: 分散型識別子 (DID)
- aliases: [DID, W3C DID]
- related: [Self-Sovereign Identity, ENS]
- auto_added: 2026-06-16
- auto_source_topic_id: 25196
- auto_source_url: https://ethresear.ch/t/twin-domain-convergence-identity-is-the-com-eth-pair-an-emerging-institutional-namespace-standard-and-how-does-this-relate-to-ethereums-core-mission/25196
- desc: |
  W3Cによって標準化された、分散型ウェブにおける自己主権型アイデンティティのための識別子。中央集権的な機関に依存せず、ユーザー自身が自身のデジタルIDを管理・制御することを可能にする。

## Kohaku
- ja: Kohaku
- related: [Decentralization, Privacy]
- auto_added: 2026-06-16
- auto_source_topic_id: 25196
- auto_source_url: https://ethresear.ch/t/twin-domain-convergence-identity-is-the-com-eth-pair-an-emerging-institutional-namespace-standard-and-how-does-this-relate-to-ethereums-core-mission/25196
- desc: |
  イーサリアム財団が分散化、自己主権、プライバシーといったコアミッションを推進するために重点を置いている特定のイニシアチブまたはプロジェクト。投稿では、Vitalik氏のビジョンと関連付けられて言及されている。

## On-chain Privacy
- ja: オンチェーンプライバシー
- related: [FHE, Zero-Knowledge Proofs, Confidential Computing]
- auto_added: 2026-06-16
- auto_source_topic_id: 25196
- auto_source_url: https://ethresear.ch/t/twin-domain-convergence-identity-is-the-com-eth-pair-an-emerging-institutional-namespace-standard-and-how-does-this-relate-to-ethereums-core-mission/25196
- desc: |
  ブロックチェーン上で実行されるトランザクションやデータの内容が、第三者から秘匿される特性。FHEやZK-proofsなどの暗号技術を用いて、公開された台帳上でもユーザーのプライバシーを保護する研究・開発分野。

## Time-locked blind sessions
- ja: タイムロックされたブラインドセッション
- related: [blind signing, time-delayed access control, cryptographic isolation]
- auto_added: 2026-06-16
- auto_source_topic_id: 25187
- auto_source_url: https://ethresear.ch/t/the-voice-of-silence-beyond-alignment-human-sovereign-will-as-the-missing-layer-in-agi-governance/25187
- desc: |
  ユーザーが匿名かつ検証可能な形で価値観を表明できるように設計されたセッション。特定の期間ロックされ、参加者のプライバシーを保護しながら、表現の歪みを防ぐためにブラインド（盲目）な状態で行われる。

## Biometric ZK-proof
- ja: 生体認証ZK証明
- related: [zero-knowledge proof, zkp, identity layer]
- auto_added: 2026-06-16
- auto_source_topic_id: 25187
- auto_source_url: https://ethresear.ch/t/the-voice-of-silence-beyond-alignment-human-sovereign-will-as-the-missing-layer-in-agi-governance/25187
- desc: |
  生体認証データを用いて、個人の身元を明かすことなくその正当性を証明するゼロ知識証明の一種。プライバシーを保護しつつ、L0レベルでの強力な本人確認を可能にする。

## ZK-SNARKs
- ja: ZK-SNARKs (ゼロ知識簡潔非対話型知識証明)
- aliases: [Zero-Knowledge Succinct Non-Interactive Argument of Knowledge]
- related: [zero-knowledge proof, zkp, recursive stark]
- auto_added: 2026-06-16
- auto_source_topic_id: 25187
- auto_source_url: https://ethresear.ch/t/the-voice-of-silence-beyond-alignment-human-sovereign-will-as-the-missing-layer-in-agi-governance/25187
- desc: |
  ゼロ知識証明の一種で、証明が非常に簡潔（succinct）で検証が高速であり、証明者と検証者の間で対話が不要（non-interactive）な特性を持つ。ブロックチェーンのスケーラビリティとプライバシー保護に広く利用される。

## Notary model (AI as notary)
- ja: 公証人モデル (AIを公証人とする)
- aliases: [AI as notary]
- related: [on-chain mechanism design, deterministic verifier runtime]
- auto_added: 2026-06-16
- auto_source_topic_id: 25187
- auto_source_url: https://ethresear.ch/t/the-voice-of-silence-beyond-alignment-human-sovereign-will-as-the-missing-layer-in-agi-governance/25187
- desc: |
  AIが意思決定の内容を評価するのではなく、特定の決定が適切な人物によって自由かつ正しい条件下で行われたことを証明し、記録の完全性を保証するアーキテクチャパターン。特にブロックチェーン環境における信頼性と透明性の確保に用いられる。

## ERC-20 approved spending
- ja: ERC-20承認済み支出
- aliases: [approved spending]
- related: [ZIP-32 subaccounts, approve, allowance, transferFrom]
- auto_added: 2026-06-16
- auto_source_topic_id: 28796
- auto_source_url: https://ethereum-magicians.org/t/perc20-private-token-standard/28796
- desc: |
  pERC20において、ERC-20の`approve`、`allowance`、`transferFrom`に相当する機能。ZIP-32サブアカウントを利用し、プライベートな形で第三者による支出を許可する。

## protocol-enshrined shielded pool
- ja: プロトコルに組み込まれたシールドプール
- related: [EIP-8182, shielded pool]
- auto_added: 2026-06-16
- auto_source_topic_id: 28796
- auto_source_url: https://ethereum-magicians.org/t/perc20-private-token-standard/28796
- desc: |
  プロトコル層で直接実装されるプライバシー保護のためのシールドプール。ユーザーは公開資産を預け入れ、プール内でプライベートに価値を移動し、公開形式で引き出すことができる。EIP-8182で定義されている。

## Orchard action bundle
- ja: Orchardアクションバンドル
- related: [Orchard shielded pool, PrivacyCall, BundleAction]
- auto_added: 2026-06-16
- auto_source_topic_id: 28796
- auto_source_url: https://ethereum-magicians.org/t/perc20-private-token-standard/28796
- desc: |
  ZcashプロトコルのOrchard shielded poolモデルにおける、一つ以上のOrchardアクションをエンコードしたデータ構造。pERC20では、トランザクションのプライバシーを確保するために使用される。

## holder-only scan
- ja: ホルダーのみのスキャン
- related: [viewing key, balanceOf]
- auto_added: 2026-06-16
- auto_source_topic_id: 28796
- auto_source_url: https://ethereum-magicians.org/t/perc20-private-token-standard/28796
- desc: |
  pERC20において、トークン保有者のみが自身のビューイングキーを用いてオフチェーンで自身の残高をスキャンし、確認できる仕組み。第三者からは残高を照会できない。

## immutable contract
- ja: 不変コントラクト
- related: [upgradeable contract, proxy contract]
- auto_added: 2026-06-16
- auto_source_topic_id: 28795
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-version-interface-standardizing-version-across-smart-contracts/28795
- desc: |
  デプロイ後にそのコードやロジックを変更できないスマートコントラクト。セキュリティや予測可能性の面で利点があるが、バグ修正や機能追加には再デプロイが必要となる。

## proxy-based upgradeable system
- ja: プロキシベースのアップグレード可能システム
- aliases: [proxy upgradeable system]
- related: [proxy contract, upgradeable contract, implementation contract]
- auto_added: 2026-06-16
- auto_source_topic_id: 28795
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-version-interface-standardizing-version-across-smart-contracts/28795
- desc: |
  ユーザーが常に同じアドレスとやり取りしながら、基盤となるスマートコントラクトのロジックをアップグレードできるシステム。プロキシコントラクトが呼び出しを実装コントラクトに委任することで実現される。

## interface discovery
- ja: インターフェース検出
- related: [ERC-165, supportsInterface]
- auto_added: 2026-06-16
- auto_source_topic_id: 28795
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-contract-version-interface-standardizing-version-across-smart-contracts/28795
- desc: |
  スマートコントラクトが特定のインターフェースを実装しているかどうかを、オンチェーンでプログラム的に確認するメカニズム。ERC-165標準によって提供され、コントラクトの相互運用性を高める。

## Operation Restriction Policy
- ja: 操作制限ポリシー
- related: [Tiered Permissions, Operation-level restrictions, IPermissionPolicy]
- auto_added: 2026-06-16
- auto_source_topic_id: 28793
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-operation-restriction-policy-for-tiered-permissions/28793
- desc: |
  スマートコントラクトにおける操作レベルの制限を標準化するためのポリシー。既存のIDベースのパーミッションや検証インフラストラクチャとは異なり、「どのような制約が適用されるか」を定義することで、セキュリティモデルを強化します。

## Operation-level restrictions
- ja: 操作レベルの制限
- related: [Operation Restriction Policy, Tiered Permissions]
- auto_added: 2026-06-16
- auto_source_topic_id: 28793
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-operation-restriction-policy-for-tiered-permissions/28793
- desc: |
  スマートコントラクトにおいて、特定の操作（トランザクション）に対して適用される制約。誰が行動できるか（IDベースのパーミッション）や、どのようにチェックするか（検証インフラストラクチャ）とは異なり、操作の内容や頻度、価値、時間などに基づく制限を指します。

## Tiered Permissions
- ja: 階層型パーミッション
- related: [Operation Restriction Policy, IRoleTier]
- auto_added: 2026-06-16
- auto_source_topic_id: 28793
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-operation-restriction-policy-for-tiered-permissions/28793
- desc: |
  スマートコントラクトのユーザーや役割に対して、権限を複数の階層（Tier）に分けて付与するシステム。各階層には異なる操作制限ポリシーが適用され、柔軟かつきめ細やかなアクセス制御とセキュリティ管理を可能にします。

## IRoleTier
- ja: IRoleTier (ロール階層インターフェース)
- related: [Tiered Permissions, Role-based access control (ERC-5982)]
- auto_added: 2026-06-16
- auto_source_topic_id: 28793
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-operation-restriction-policy-for-tiered-permissions/28793
- desc: |
  ロールシステムと操作制限階層を橋渡しするスマートコントラクトインターフェース。アカウントがどの制限階層に属するかを解決する役割を担い、ロールの割り当てと制限の適用を分離することで、システムのモジュール性と柔軟性を高めます。

## Restriction Type
- ja: 制限タイプ
- related: [Operation Restriction Policy, RATE_LIMIT, VALUE_CAP, TIME_WINDOW, FUNCTION_WHITELIST]
- auto_added: 2026-06-16
- auto_source_topic_id: 28793
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-operation-restriction-policy-for-tiered-permissions/28793
- desc: |
  スマートコントラクトの操作に適用される具体的な制約の種類を指します。例えば、操作の頻度を制限するレートリミット、トランザクションの最大値を制限するバリューキャップ、操作可能な時間帯を制限するタイムウィンドウ、許可された関数セレクタを制限するファンクションホワイトリストなどがあります。

## Counterfactual Rejection Event Log
- ja: 反実仮想拒否イベントログ (CREL)
- aliases: [CREL]
- related: [Counterfactual analysis, DEX protocol]
- auto_added: 2026-06-16
- auto_source_topic_id: 28792
- auto_source_url: https://ethereum-magicians.org/t/erc-8293-counterfactual-rejection-event-log-crel/28792
- desc: |
  DEXプロトコルやフィルターが実行前に拒否した取引候補をオンチェーンで記録するためのイベントログ。これにより、外部の参加者がフィルターの精度を測定し、反実仮想分析を実行できるようになります。

## Counterfactual analysis
- ja: 反実仮想分析
- related: [Counterfactual Rejection Event Log, Counterfactual replay]
- auto_added: 2026-06-16
- auto_source_topic_id: 28792
- auto_source_url: https://ethereum-magicians.org/t/erc-8293-counterfactual-rejection-event-log-crel/28792
- desc: |
  拒否された取引候補がもし実行されていたらどうなっていたかを分析する手法。DEXフィルターの品質評価や、拒否された取引の潜在的な影響を理解するために用いられます。

## Ownership Fragmentation
- ja: 所有権の断片化 (Ownership Fragmentation)
- related: [Disposable Stealth Accounts, Ownership Reconstruction]
- auto_added: 2026-06-17
- auto_source_topic_id: 25213
- auto_source_url: https://ethresear.ch/t/exploring-ownership-fragmentation-as-a-privacy-primitive-for-the-post-pectra-evm/25213
- desc: |
  ブロックチェーン上の資産の所有権を、単一の永続的なアカウントに集中させるのではなく、多数の独立した出力や使い捨てのアカウントに分散させるプライバシー手法。これにより、観察者による所有権の再構築を困難にすることを目指します。

## Privacy Primitive
- ja: プライバシープリミティブ (Privacy Primitive)
- related: [Ownership Fragmentation]
- auto_added: 2026-06-17
- auto_source_topic_id: 25213
- auto_source_url: https://ethresear.ch/t/exploring-ownership-fragmentation-as-a-privacy-primitive-for-the-post-pectra-evm/25213
- desc: |
  プライバシーシステムを構築するための基本的な構成要素や技術。GhostShardの文脈では、所有権の断片化がそのような根本的なプライバシー機能として提案されています。

## Ownership Reconstruction
- ja: 所有権の再構築 (Ownership Reconstruction)
- related: [Ownership Fragmentation, Ambiguity Generation]
- auto_added: 2026-06-17
- auto_source_topic_id: 25213
- auto_source_url: https://ethresear.ch/t/exploring-ownership-fragmentation-as-a-privacy-primitive-for-the-post-pectra-evm/25213
- desc: |
  ブロックチェーン上のトランザクションデータやその他の公開情報から、隠された所有構造、アイデンティティ、関係性、行動パターンなどを推測し、再構築しようとする分析プロセス。プライバシー侵害の主要な形態の一つと見なされます。

## Disposable Stealth Accounts
- ja: 使い捨てステルスアカウント (Disposable Stealth Accounts)
- aliases: [shards]
- related: [Ownership Fragmentation, ERC-5564]
- auto_added: 2026-06-17
- auto_source_topic_id: 25213
- auto_source_url: https://ethresear.ch/t/exploring-ownership-fragmentation-as-a-privacy-primitive-for-the-post-pectra-evm/25213
- desc: |
  所有権の断片化を実現するために使用される、一時的で使い捨てのステルスアドレスベースのアカウント。各トランザクションで古いアカウントの所有権を消費し、新しいアカウントに所有権を生成することで、所有権の連続性を追跡しにくくします。

## Ambiguity Generation
- ja: 曖昧性生成 (Ambiguity Generation)
- related: [Ownership Reconstruction, Partition Ambiguity, Ownership Ambiguity, Amount Ambiguity, Temporal Ambiguity]
- auto_added: 2026-06-17
- auto_source_topic_id: 25213
- auto_source_url: https://ethresear.ch/t/exploring-ownership-fragmentation-as-a-privacy-primitive-for-the-post-pectra-evm/25213
- desc: |
  プライバシーシステムを評価する新しいフレームワーク。情報を完全に隠すのではなく、観察者が特定の質問に答えるのを妨げることで、所有権の再構築を困難にします。複数の曖昧性レイヤーを導入し、不確実性を複合的に高めることを目指します。

## Price Elasticity of Gas Demand
- ja: ガス需要の価格弾力性
- related: [Gas Fee, Blockspace Demand, EIP-1559]
- auto_added: 2026-06-17
- auto_source_topic_id: 25211
- auto_source_url: https://ethresear.ch/t/price-elasticity-of-gas-demand-on-ethereum-and-arbitrum/25211
- desc: |
  ブロックチェーンにおけるガス料金の変化が、ブロック空間の需要にどの程度影響を与えるかを示す経済指標。需要の価格弾力性が低い場合、料金が変動しても需要は大きく変化しないことを意味する。

## Blockspace Demand
- ja: ブロック空間需要
- related: [Gas Fee, EIP-1559, Transaction]
- auto_added: 2026-06-17
- auto_source_topic_id: 25211
- auto_source_url: https://ethresear.ch/t/price-elasticity-of-gas-demand-on-ethereum-and-arbitrum/25211
- desc: |
  ブロックチェーンのブロックにトランザクションやデータを記録するための需要。この需要と供給のバランスがガス料金を決定する主要因となる。

## Endogeneity
- ja: 内生性
- related: [Causal Estimate, Instrument Variable]
- auto_added: 2026-06-17
- auto_source_topic_id: 25211
- auto_source_url: https://ethresear.ch/t/price-elasticity-of-gas-demand-on-ethereum-and-arbitrum/25211
- desc: |
  統計モデルにおいて、説明変数と誤差項の間に相関がある状態を指す。EIP-1559のようなメカニズムでは、ガス料金が需要によって決定されるため、料金と需要の関係を分析する際に内生性の問題が生じる。

## Probabilistic Backrunners
- ja: 確率的バックランナー
- related: [MEV, Backrunning]
- auto_added: 2026-06-17
- auto_source_topic_id: 25211
- auto_source_url: https://ethresear.ch/t/price-elasticity-of-gas-demand-on-ethereum-and-arbitrum/25211
- desc: |
  L2環境において、特定のトランザクションを検知し、そのトランザクションが実行される前に自身のトランザクションを挿入しようとするエンティティ。L2の特性上、その成功が確率的である場合に用いられる表現。

## Two-way Fixed Effects Analysis
- ja: 双方向固定効果分析
- related: [Panel Data, Econometrics]
- auto_added: 2026-06-17
- auto_source_topic_id: 25211
- auto_source_url: https://ethresear.ch/t/price-elasticity-of-gas-demand-on-ethereum-and-arbitrum/25211
- desc: |
  パネルデータ分析手法の一つで、個体（この場合はウォレット）と時間（期間）の両方の固定効果をモデルに組み込むことで、観測されない異質性によるバイアスを軽減する。ブロックチェーンのデータ分析において、ウォレット固有の特性や時間経過による影響を考慮する際に用いられる。

## Mempool
- ja: メムプール (Mempool)
- auto_added: 2026-06-17
- auto_source_topic_id: 28804
- auto_source_url: https://ethereum-magicians.org/t/encrypt-the-mempool-provide-feedback-on-the-draft-eips-8105-8184/28804
- desc: |
  ブロックチェーンネットワークにおいて、まだブロックに含まれていないが、ノードによって受信され検証されたトランザクションが一時的に保持される場所。マイナーやバリデーターはここからトランザクションを選択してブロックを構築する。

## Encrypted Mempool
- ja: 暗号化メムプール
- related: [Mempool, MEV, Censorship Resistance]
- auto_added: 2026-06-17
- auto_source_topic_id: 28804
- auto_source_url: https://ethereum-magicians.org/t/encrypt-the-mempool-provide-feedback-on-the-draft-eips-8105-8184/28804
- desc: |
  トランザクションの内容が、ブロックに含められるまで暗号化された状態で保持されるメムプール。MEV（Maximal Extractable Value）の抽出や検閲攻撃を防ぐことを目的としている。

## Lean Staking
- ja: リーンステーキング
- related: [Staking]
- auto_added: 2026-06-17
- auto_source_topic_id: 28803
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-102-june-16-2026/28803
- desc: |
  ステーキングの効率性や最小要件に焦点を当てた、新しいステーキングアプローチ。リソース消費を抑えつつ、ネットワークセキュリティへの貢献を目指す。

## Account-warming charge
- ja: アカウントウォーミングチャージ
- related: [Gas, EVM]
- auto_added: 2026-06-17
- auto_source_topic_id: 28803
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-102-june-16-2026/28803
- desc: |
  EthereumのEVMにおいて、最近アクセスされていないアカウントに初めてアクセスする際に発生する追加のガス料金。コールドステートアクセスによるパフォーマンスオーバーヘッドを反映する。

## Precompile target
- ja: プリコンパイルターゲット
- related: [Precompile, EVM]
- auto_added: 2026-06-17
- auto_source_topic_id: 28803
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-102-june-16-2026/28803
- desc: |
  EthereumのEVMに組み込まれた特殊なコントラクト（プリコンパイル）の呼び出し先アドレスまたは特定の機能。複雑な暗号操作などを効率的に実行するために使用される。

## Wallet Title Deeds
- ja: ウォレット所有権証書
- related: [ERC, NFT, Wallet]
- auto_added: 2026-06-17
- auto_source_topic_id: 28803
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-102-june-16-2026/28803
- desc: |
  ウォレットの所有権や関連する権利を表現するための新しいERC標準または概念。NFTなどのトークン形式でウォレットの権利を管理する可能性を示唆する。

## Referable NFTs Authorization
- ja: 参照可能NFT承認
- related: [NFT, Authorization, ERC]
- auto_added: 2026-06-17
- auto_source_topic_id: 28803
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-102-june-16-2026/28803
- desc: |
  NFTが他のエンティティ（ユーザーやコントラクト）に対して、特定のアクションを実行する権限を付与または管理するメカニズム。NFTのユーティリティを拡張する。

## LUCID
- ja: LUCID (EIP-8184)
- aliases: [EIP-8184]
- related: [Encrypted Mempool, Commit-and-Reveal Scheme]
- auto_added: 2026-06-18
- auto_source_topic_id: 25210
- auto_source_url: https://ethresear.ch/t/a-criticism-of-lucid-and-encryption-scheme-agnostic-encrypted-mempool-designs/25210
- desc: |
  暗号化されたmempoolの設計に関するEIP-8184の提案。ユーザーをMEVから保護することを目的としているが、十分な閾値暗号がないため、コミット＆リビール方式を採用している。

## Threshold Encryption
- ja: 閾値暗号
- related: [Encrypted Mempool, Time-based cryptography, Threshold IBE]
- auto_added: 2026-06-18
- auto_source_topic_id: 25210
- auto_source_url: https://ethresear.ch/t/a-criticism-of-lucid-and-encryption-scheme-agnostic-encrypted-mempool-designs/25210
- desc: |
  複数の参加者が共同で暗号文を復号できるが、単独ではできない暗号方式。理想的な暗号化されたmempoolの設計に必要とされるが、現在、Ethereumの要件を満たす適切なスキームは存在しない。

## Commit-and-Reveal Scheme
- ja: コミット＆リビール方式
- related: [LUCID, Reveal Optionality]
- auto_added: 2026-06-18
- auto_source_topic_id: 25210
- auto_source_url: https://ethresear.ch/t/a-criticism-of-lucid-and-encryption-scheme-agnostic-encrypted-mempool-designs/25210
- desc: |
  ユーザーがまずトランザクションのコミットメントを提出し、後でその内容を公開する（リビールする）暗号プロトコル。LUCIDはこの方式を採用しているが、リビールしない選択肢が攻撃のリスクを生む。

## Reveal Optionality
- ja: リビール選択性
- aliases: [Reveal Optionality by the Transaction Sender]
- related: [Commit-and-Reveal Scheme, Probabilistic Frontrunning]
- auto_added: 2026-06-18
- auto_source_topic_id: 25210
- auto_source_url: https://ethresear.ch/t/a-criticism-of-lucid-and-encryption-scheme-agnostic-encrypted-mempool-designs/25210
- desc: |
  コミット＆リビール方式において、トランザクション送信者がコミットした内容を公開するかどうかを任意に選択できる問題。特に、他の参加者のリビールを見てから自身の公開を決定できる点が、様々な攻撃を可能にする。

## Probabilistic Frontrunning
- ja: 確率的フロントランニング
- related: [Frontrunning, MEV, Reveal Optionality]
- auto_added: 2026-06-18
- auto_source_topic_id: 25210
- auto_source_url: https://ethresear.ch/t/a-criticism-of-lucid-and-encryption-scheme-agnostic-encrypted-mempool-designs/25210
- desc: |
  攻撃者が、正直なユーザーのコミットされたトランザクション内容を推測し、その推測に基づいてフロントランニングトランザクションを挿入する攻撃。ユーザーのリビール選択性を悪用し、推測が正しければ攻撃トランザクションをリビールし、そうでなければリビールしないことでリスクを軽減する。

## Trustless log and transaction index
- ja: トラストレスなログおよびトランザクションインデックス
- related: [Log and transaction lookup]
- auto_added: 2026-06-18
- auto_source_topic_id: 28824
- auto_source_url: https://ethereum-magicians.org/t/eip-xxxx-trustless-log-and-transaction-index/28824
- desc: |
  Ethereumのログおよびトランザクションのインデックスを、信頼できる第三者を必要とせずに検証可能にするためのメカニズム。EIP-xxxxで提案されており、効率的なトラストレス証明を可能にする。

## System contract
- ja: システムコントラクト
- related: [Predeploys]
- auto_added: 2026-06-18
- auto_source_topic_id: 28824
- auto_source_url: https://ethereum-magicians.org/t/eip-xxxx-trustless-log-and-transaction-index/28824
- desc: |
  Ethereumプロトコル内で特別な役割や権限を持つコントラクト。プロトコルレベルの機能を提供し、特定のEIPの実装や状態の管理に利用されることがある。

## Root hashes of index tables
- ja: インデックステーブルのルートハッシュ
- related: [Merkle Patricia Trie, KZG commitment]
- auto_added: 2026-06-18
- auto_source_topic_id: 28824
- auto_source_url: https://ethereum-magicians.org/t/eip-xxxx-trustless-log-and-transaction-index/28824
- desc: |
  ログやトランザクションのインデックスデータ構造の整合性を検証するために使用される暗号学的ハッシュ。これらのルートハッシュをシステムコントラクトに保存することで、インデックスのトラストレスな証明が可能になる。

## Fingerprint Profile
- ja: フィンガープリントプロファイル
- related: [browser fingerprinting, anonymity set]
- auto_added: 2026-06-19
- auto_source_topic_id: 25224
- auto_source_url: https://ethresear.ch/t/etherveil-an-ethereum-privacy-browser/25224
- desc: |
  Etherveilブラウザにおいて、ブラウザの観測可能な挙動を標準化するために定義された、固定された事前計算済みの同値クラス。ユーザー間の匿名性を最大化するために、セッションの存続期間中不変に割り当てられる。

## Privacy Relay
- ja: プライバシーリレー
- related: [Kohaku Wallet Engine, zk shielding layer, ERC-4337 bundler]
- auto_added: 2026-06-19
- auto_source_topic_id: 25224
- auto_source_url: https://ethresear.ch/t/etherveil-an-ethereum-privacy-browser/25224
- desc: |
  dAppからのトランザクションをプライベートにルーティングするためのコンポーネント。Kohaku Wallet Engineからチェーンへの経路の一部として機能し、ユーザーのIPアドレスとトランザクションの関連付けを防ぐ。

## zk shielding layer
- ja: zkシーディング層 (zk shielding layer)
- related: [zero-knowledge proof, Tornado Cash, Privacy Relay]
- auto_added: 2026-06-19
- auto_source_topic_id: 25224
- auto_source_url: https://ethresear.ch/t/etherveil-an-ethereum-privacy-browser/25224
- desc: |
  トランザクションのプライバシーを確保するためにゼロ知識証明を利用する抽象的な層。Tornado Cashのようなプロトコルがこれに該当し、ユーザーのオンチェーン活動の匿名化を可能にする。

## pq-account
- ja: 量子耐性アカウント (pq-account)
- aliases: [post-quantum account]
- related: [ERC-4337, post-quantum cryptography, smart account]
- auto_added: 2026-06-19
- auto_source_topic_id: 25224
- auto_source_url: https://ethresear.ch/t/etherveil-an-ethereum-privacy-browser/25224
- desc: |
  量子コンピュータの脅威に耐性を持つように設計された、ERC-4337準拠のスマートアカウントタイプ。Etherveilではデフォルトのアカウントタイプとして採用され、将来のセキュリティリスクに対応する。

## sync committee proofs
- ja: 同期委員会証明
- related: [sync committee, light client, Proof-of-Stake]
- auto_added: 2026-06-19
- auto_source_topic_id: 25224
- auto_source_url: https://ethresear.ch/t/etherveil-an-ethereum-privacy-browser/25224
- desc: |
  EthereumのProof-of-Stakeコンセンサスにおいて、ライトクライアントがチェーンの最新状態を検証するために使用する証明。少数のバリデータで構成される同期委員会によって生成され、効率的な検証を可能にする。

## common execution envelope
- ja: 共通実行エンベロープ
- related: [agent interaction, multi-agent accountability]
- auto_added: 2026-06-19
- auto_source_topic_id: 28833
- auto_source_url: https://ethereum-magicians.org/t/composition-note-agent-service-consultation-flow-composing-the-agent-ercs-8004-8263-8274-8275-8281-8299-8301-informational/28833
- desc: |
  複数のエージェントが相互作用する際に、それらの実行を統一的に包み込むための共通の枠組み。エージェント間の相互運用性と説明責任を確保するために設計される。

## input provenance
- ja: 入力来歴 (input provenance)
- related: [verifiable result, agent interaction]
- auto_added: 2026-06-19
- auto_source_topic_id: 28833
- auto_source_url: https://ethereum-magicians.org/t/composition-note-agent-service-consultation-flow-composing-the-agent-ercs-8004-8263-8274-8275-8281-8299-8301-informational/28833
- desc: |
  エージェントシステムにおいて、入力データの起源、履歴、および信頼性を追跡・検証する能力。検証可能な結果を得るために不可欠な要素。

## multi-agent accountability
- ja: マルチエージェントの説明責任
- related: [agent interaction, common execution envelope]
- auto_added: 2026-06-19
- auto_source_topic_id: 28833
- auto_source_url: https://ethereum-magicians.org/t/composition-note-agent-service-consultation-flow-composing-the-agent-ercs-8004-8263-8274-8275-8281-8299-8301-informational/28833
- desc: |
  複数のエージェントが関与するシステムにおいて、各エージェントの行動や結果に対する責任を追跡・評価する仕組み。エージェント間の信頼と協調を促進するために重要。

## anchoring
- ja: アンカリング
- related: [verification, on-chain anchor]
- auto_added: 2026-06-19
- auto_source_topic_id: 28833
- auto_source_url: https://ethereum-magicians.org/t/composition-note-agent-service-consultation-flow-composing-the-agent-ercs-8004-8263-8274-8275-8281-8299-8301-informational/28833
- desc: |
  エージェントの相互作用や検証プロセスにおいて、特定のデータや結果をブロックチェーンなどの信頼できる基盤に固定し、その存在や状態を検証可能にすること。

## Informational ERC
- ja: 情報提供ERC (Informational ERC)
- aliases: [Informational EIP, Informational track]
- related: [ERC, EIP]
- auto_added: 2026-06-19
- auto_source_topic_id: 28833
- auto_source_url: https://ethereum-magicians.org/t/composition-note-agent-service-consultation-flow-composing-the-agent-ercs-8004-8263-8274-8275-8281-8299-8301-informational/28833
- desc: |
  Ethereum Request for Comments (ERC) の一種で、プロトコルや実装に関する情報、設計パターン、一般的なガイドラインなどを記述するために使用される。プロトコル変更を提案するStandard Track ERCとは異なり、実装を強制しない。

## Asset-Enforced Spend Mandate
- ja: アセット強制型支出委任
- related: [transfer-eligibility gate, machine-readable reason vocabulary]
- auto_added: 2026-06-19
- auto_source_topic_id: 28831
- auto_source_url: https://ethereum-magicians.org/t/erc-asset-enforced-spend-mandate/28831
- desc: |
  トークン自体がデリゲートの支出権限を制限し、トランザクションごとの上限、有効期限、許可されたトークン、即時取り消しなどを強制するメカニズム。エージェントの振る舞いではなく、トークンによって直接執行される。

## transfer-eligibility gate
- ja: 転送適格性ゲート
- aliases: [spend gate]
- related: [Asset-Enforced Spend Mandate, machine-readable reason vocabulary, IGatedAsset]
- auto_added: 2026-06-19
- auto_source_topic_id: 28831
- auto_source_url: https://ethereum-magicians.org/t/erc-asset-enforced-spend-mandate/28831
- desc: |
  トークンの転送が許可されるべきかを判断する、独立してデプロイ可能なコントラクト。アセット強制型支出委任の主要な構成要素であり、標準化された理由語彙を用いて転送の可否を通知する。

## machine-readable reason vocabulary
- ja: 機械可読な理由語彙
- aliases: [spend-reason vocabulary, byte-pinned reason vocabulary]
- related: [transfer-eligibility gate, TransferBlocked]
- auto_added: 2026-06-19
- auto_source_topic_id: 28831
- auto_source_url: https://ethereum-magicians.org/t/erc-asset-enforced-spend-mandate/28831
- desc: |
  トークンの転送が拒否された際に、その理由を標準化された形式で示すための語彙。統合者が拒否の具体的な原因をプログラム的に理解し、適切な対応を取ることを可能にする。

## per-transaction cap
- ja: トランザクションごとの上限
- related: [Asset-Enforced Spend Mandate]
- auto_added: 2026-06-19
- auto_source_topic_id: 28831
- auto_source_url: https://ethereum-magicians.org/t/erc-asset-enforced-spend-mandate/28831
- desc: |
  デリゲートが単一のトランザクションで支出できる金額に設定される上限。アセット強制型支出委任の一部として、エージェントの不正行為から資産を保護するために使用される。

## instant revoke
- ja: 即時取り消し
- related: [Asset-Enforced Spend Mandate]
- auto_added: 2026-06-19
- auto_source_topic_id: 28831
- auto_source_url: https://ethereum-magicians.org/t/erc-asset-enforced-spend-mandate/28831
- desc: |
  デリゲートに付与された支出権限を、即座に無効化するメカニズム。資産所有者がエージェントの活動を迅速に停止させることを可能にする。

## Reputation Wallet
- ja: レピュテーションウォレット
- related: [Token-weighted governance, Judgment balance, Sovereign collective intelligence]
- auto_added: 2026-06-20
- auto_source_topic_id: 25236
- auto_source_url: https://ethresear.ch/t/the-reputation-wallet-why-knowledge-ethics-and-moral-judgment-belong-on-chain/25236
- desc: |
  金融価値ではなく、知識、倫理、道徳的判断といった人間の判断を格納するよう設計されたウォレット。参加者の行動に基づいて動的に再計算されるレピュテーションを反映し、その判断力を計測する。

## Token-weighted governance
- ja: トークン加重ガバナンス
- related: [DAO, Quadratic voting]
- auto_added: 2026-06-20
- auto_source_topic_id: 25236
- auto_source_url: https://ethresear.ch/t/the-reputation-wallet-why-knowledge-ethics-and-moral-judgment-belong-on-chain/25236
- desc: |
  トークン保有量に基づいて参加者の影響力や投票権を決定するオンチェーンガバナンスシステム。より多くのトークンを持つ参加者がより大きな発言力を持つため、富が意思決定に影響を与える傾向がある。

## Sovereign collective intelligence
- ja: 主権的集合知
- related: [Reputation Wallet, Collective intelligence]
- auto_added: 2026-06-20
- auto_source_topic_id: 25236
- auto_source_url: https://ethresear.ch/t/the-reputation-wallet-why-knowledge-ethics-and-moral-judgment-belong-on-chain/25236
- desc: |
  BeTrueCoreプロジェクトが提唱する概念で、個々の参加者の判断力（レピュテーション）をオンチェーンで検証し、集合的な意思決定に活用するシステム。金融インフラとは独立した補完的なレイヤーとして機能する。

## Judgment balance
- ja: 判断残高
- related: [Reputation Wallet, Vote Weight Unit]
- auto_added: 2026-06-20
- auto_source_topic_id: 25236
- auto_source_url: https://ethresear.ch/t/the-reputation-wallet-why-knowledge-ethics-and-moral-judgment-belong-on-chain/25236
- desc: |
  レピュテーションウォレットの出力として提案される、参加者の判断力を示す検証可能な単一の指標。金融残高とは異なり、知識、倫理、道徳的判断の3つの側面を反映し、1から9のスケールで表される。

## Asset futarchy
- ja: アセット・フューチャーキー (資産フューチャーキー)
- related: [PASS-ASSET, FAIL-ASSET, Conditional markets]
- auto_added: 2026-06-20
- auto_source_topic_id: 25235
- auto_source_url: https://ethresear.ch/t/futarchy-is-insecure-without-a-proposal-gatekeeper/25235
- desc: |
  提案が可決された場合と否決された場合のトークン価値に対する市場の予測に基づいて、提案の可否を決定するガバナンスシステムです。市場価格が提案の因果的効果を正確に反映することが重要となります。

## PASS-ASSET
- ja: PASS-ASSET (可決時資産)
- related: [Asset futarchy, FAIL-ASSET]
- auto_added: 2026-06-20
- auto_source_topic_id: 25235
- auto_source_url: https://ethresear.ch/t/futarchy-is-insecure-without-a-proposal-gatekeeper/25235
- desc: |
  アセット・フューチャーキーにおいて、特定の提案が可決された世界における資産（トークン）の価値を表す条件付き市場の対象です。提案の可否を判断する際の基準の一つとなります。

## FAIL-ASSET
- ja: FAIL-ASSET (否決時資産)
- related: [Asset futarchy, PASS-ASSET]
- auto_added: 2026-06-20
- auto_source_topic_id: 25235
- auto_source_url: https://ethresear.ch/t/futarchy-is-insecure-without-a-proposal-gatekeeper/25235
- desc: |
  アセット・フューチャーキーにおいて、特定の提案が否決された世界における資産（トークン）の価値を表す条件付き市場の対象です。提案の可否を判断する際の基準の一つとなります。

## Resistance-Contingent Delivery
- ja: 抵抗依存型デリバリー
- related: [Asset futarchy]
- auto_added: 2026-06-20
- auto_source_topic_id: 25235
- auto_source_url: https://ethresear.ch/t/futarchy-is-insecure-without-a-proposal-gatekeeper/25235
- desc: |
  アセット・フューチャーキーにおける攻撃手法の一つです。提案者が価値創造的な作業を約束するが、その実行を市場の抵抗（カウンター取引）の強さに応じてオプション化します。抵抗が弱い場合は作業をスキップし、強い場合は実行します。

## Proposal Convexity Maximisation
- ja: 提案の凸性最大化
- related: [Asset futarchy, Decision selection bias]
- auto_added: 2026-06-20
- auto_source_topic_id: 25235
- auto_source_url: https://ethresear.ch/t/futarchy-is-insecure-without-a-proposal-gatekeeper/25235
- desc: |
  アセット・フューチャーキーにおける攻撃手法の一つです。提案者が未解決の情報（不確実性）を利用して、提案の可決が有利な情報が明らかになる世界を市場が選択するように仕向けます。これにより、本来は負の期待値を持つ提案でも可決される可能性があります。

## Validity-Only Partial Statelessness
- ja: バリディティオンリー部分ステートレス性 (VOPS)
- aliases: [VOPS]
- related: [Statelessness, BALs, zkEVM]
- auto_added: 2026-06-20
- auto_source_topic_id: 25233
- auto_source_url: https://ethresear.ch/t/repurposing-focil-as-an-l2-forced-transaction-mechanism/25233
- desc: |
  バリデータやインクルーダーのストレージ負荷を軽減し、アカウントの残高とノンスのみを追跡することで健全なメモリプールを維持することを目指す、ステートレス性を部分的に実現するための提案。

## Native rollups
- ja: ネイティブロールアップ
- related: [Rollup, L2]
- auto_added: 2026-06-20
- auto_source_topic_id: 25233
- auto_source_url: https://ethresear.ch/t/repurposing-focil-as-an-l2-forced-transaction-mechanism/25233
- desc: |
  L1とのより深い統合を特徴とするロールアップの一種。特に強制トランザクションメカニズムの簡素化を目的として研究されている。

## Forced transaction mechanism
- ja: 強制トランザクションメカニズム
- related: [Censorship resistance, Sequencer, Inclusion list]
- auto_added: 2026-06-20
- auto_source_topic_id: 25233
- auto_source_url: https://ethresear.ch/t/repurposing-focil-as-an-l2-forced-transaction-mechanism/25233
- desc: |
  L2のシーケンサーによる検閲を防ぐため、ユーザーがトランザクションを強制的にL2ブロックに含めることを可能にする仕組み。本稿ではFOCILを再利用して、既存ソリューションとは異なるアプローチを提案する。

## Block stuffing
- ja: ブロックスタッフィング
- related: [Censorship resistance, Base fee, Inclusion list]
- auto_added: 2026-06-20
- auto_source_topic_id: 25233
- auto_source_url: https://ethresear.ch/t/repurposing-focil-as-an-l2-forced-transaction-mechanism/25233
- desc: |
  ビルダーが意図的にブロックを大量のトランザクションで満たし、特定のトランザクションのインクルージョンを妨害する行為。プロトコルはEIP-1559のベースフィーを増加させることで検閲耐性を提供する。

## Accounts-only nodes
- ja: アカウントオンリーノード
- related: [VOPS, BALs, Account proof]
- auto_added: 2026-06-20
- auto_source_topic_id: 25233
- auto_source_url: https://ethresear.ch/t/repurposing-focil-as-an-l2-forced-transaction-mechanism/25233
- desc: |
  L2ユーザーがフルステートを維持することなく、アカウントの残高とノンスのみを追跡することで、強制トランザクションを容易に送信できるようにするノードの一種。VOPSとzkEVMと組み合わせて研究されている。

## Hegota
- ja: ヘゴタ
- related: [Glamsterdam, hard fork]
- auto_added: 2026-06-20
- auto_source_topic_id: 25232
- auto_source_url: https://ethresear.ch/t/scaling-in-hegota-using-the-eth-transfer-to-anchor-execution-and-bandwidth/25232
- desc: |
  Glamsterdamの後にガスリミットのスケーリングを維持するために提案されているEthereumのハードフォーク名。ETH転送のガス上限が実行と帯域幅の両方の側面を制約するという観察に基づき、スケーリングの最適化を目指す。

## anchor block
- ja: アンカーブロック
- aliases: [transfer-full block]
- related: [ETH transfer, gas limit, bandwidth]
- auto_added: 2026-06-20
- auto_source_topic_id: 25232
- auto_source_url: https://ethresear.ch/t/scaling-in-hegota-using-the-eth-transfer-to-anchor-execution-and-bandwidth/25232
- desc: |
  21,000ガスを消費するETH転送のみで構成されたブロック。このブロックがスロットの実行と帯域幅の両方の次元を制約するため、スケーリング分析の基準点として使用される。

## execution anchor
- ja: 実行アンカー
- related: [gas limit, transfer cap]
- auto_added: 2026-06-20
- auto_source_topic_id: 25232
- auto_source_url: https://ethresear.ch/t/scaling-in-hegota-using-the-eth-transfer-to-anchor-execution-and-bandwidth/25232
- desc: |
  ETH転送の21,000ガスという上限によって固定される、最悪ケースの実行性能の基準値。Glamsterdamでは100 Mgas/sに設定されており、これ以上の引き上げはETH転送のガスコスト変更を伴うため困難とされる。

## calldata floor
- ja: コールデータフロア
- related: [calldata pricing, EIP-7976]
- auto_added: 2026-06-20
- auto_source_topic_id: 25232
- auto_source_url: https://ethresear.ch/t/scaling-in-hegota-using-the-eth-transfer-to-anchor-execution-and-bandwidth/25232
- desc: |
  コールデータのガス価格設定における最低料金。EIP-7976で導入され、Glamsterdamでは64ガス/バイトに設定されたが、Hegotaでは96ガス/バイトへの引き上げが提案されている。

## native zkEVM
- ja: ネイティブzkEVM
- related: [zkEVM, enshrined proposer-builder separation, blobs]
- auto_added: 2026-06-22
- auto_source_topic_id: 25254
- auto_source_url: https://ethresear.ch/t/a-native-zkevm-scales-bandwidth-not-just-execution/25254
- desc: |
  EthereumのL1プロトコルに組み込まれ、バリデータがブロックの再実行ではなくZK証明の検証を行うように規定されたzkEVM。これにより、実行スケーリングと帯域幅スケーリングの両方を目指し、Ethereumの処理能力を大幅に向上させることを目的とする。

## execution scaling
- ja: 実行スケーリング
- related: [bandwidth scaling, zkEVM, proof verification]
- auto_added: 2026-06-22
- auto_source_topic_id: 25254
- auto_source_url: https://ethresear.ch/t/a-native-zkevm-scales-bandwidth-not-just-execution/25254
- desc: |
  ブロック内のトランザクション実行にかかる時間を短縮することで、Ethereumの処理能力を向上させるスケーリング手法。zkEVMでは、ブロックの再実行をZK証明の検証に置き換えることで、このスケーリングを実現する。

## bandwidth scaling
- ja: 帯域幅スケーリング
- related: [execution scaling, blobs, data availability sampling, blocks-in-blobs]
- auto_added: 2026-06-22
- auto_source_topic_id: 25254
- auto_source_url: https://ethresear.ch/t/a-native-zkevm-scales-bandwidth-not-just-execution/25254
- desc: |
  ブロックデータのダウンロードにかかる時間を短縮することで、Ethereumの処理能力を向上させるスケーリング手法。zkEVMとblobsを組み合わせることで、バリデータがブロック内容をサンプリングするだけで済むようになり、ダウンロード遅延を大幅に削減する。

## prover
- ja: プルーバー
- related: [zkEVM, proof verification]
- auto_added: 2026-06-22
- auto_source_topic_id: 25254
- auto_source_url: https://ethresear.ch/t/a-native-zkevm-scales-bandwidth-not-just-execution/25254
- desc: |
  zkEVMのブロック検証フローにおいて、ブロックのトランザクションが有効であることを示すZK証明を生成する役割を担う参加者。この役割は、プロトコルに組み込まれるか、ビルダーが担うことが想定されている。

## blocks-in-blobs
- ja: ブロック・イン・ブロブ (blocks-in-blobs)
- related: [blobs, data availability sampling, bandwidth scaling, EIP-8142]
- auto_added: 2026-06-22
- auto_source_topic_id: 25254
- auto_source_url: https://ethresear.ch/t/a-native-zkevm-scales-bandwidth-not-just-execution/25254
- desc: |
  ブロックの全内容をデータブロブ内に配置する仕組み。EIP-8142によって実現され、バリデータはブロック全体をダウンロードする代わりに、ブロブをサンプリングするだけで検証が可能となり、帯域幅スケーリングに貢献する。

## redirect rate
- ja: リダイレクト率
- related: [staking rewards, splitter contract]
- auto_added: 2026-06-22
- auto_source_topic_id: 25248
- auto_source_url: https://ethresear.ch/t/validator-redirected-revenue/25248
- desc: |
  ステーキング報酬のうち、エコシステムへの資金提供にリダイレクトされる割合。バリデータが設定し、過半数の合意により全バリデータに義務付けられるプロトコルレベルのパラメータです。

## splitter contract
- ja: スプリッターコントラクト
- related: [redirect rate, condorcet winner]
- auto_added: 2026-06-22
- auto_source_topic_id: 25248
- auto_source_url: https://ethresear.ch/t/validator-redirected-revenue/25248
- desc: |
  リダイレクトされた資金を複数の受取人アドレスに分配するためのスマートコントラクト。バリデータの選好に基づいて、コンドルセ勝者となる分配比率が決定されます。

## condorcet winner
- ja: コンドルセ勝者
- related: [splitter contract, validator preferences]
- auto_added: 2026-06-22
- auto_source_topic_id: 25248
- auto_source_url: https://ethresear.ch/t/validator-redirected-revenue/25248
- desc: |
  複数の選択肢がある中で、他のどの選択肢との一対一の対決においても勝利する選択肢を指す概念。本提案では、バリデータの選好を集約し、リダイレクト資金の最適な分配比率を決定するために用いられます。

## majority-trigger mechanism
- ja: 過半数トリガーメカニズム
- related: [redirect rate, validator consensus]
- auto_added: 2026-06-22
- auto_source_topic_id: 25248
- auto_source_url: https://ethresear.ch/t/validator-redirected-revenue/25248
- desc: |
  リダイレクト率が0%より高い値に設定された場合、51%以上のバリデータがその設定に同意すると、そのリダイレクト率がすべてのバリデータに強制的に適用される仕組み。フリーライダー問題を解決し、協調行動を促します。

## deadweight loss
- ja: 死荷重（デッドウェイトロス）
- related: [coordination failure, free-rider problem]
- auto_added: 2026-06-22
- auto_source_topic_id: 25248
- auto_source_url: https://ethresear.ch/t/validator-redirected-revenue/25248
- desc: |
  市場の非効率性によって生じる、経済的厚生の不可逆的な損失。本提案では、Ethereumエコシステムにおける共有インフラへの資金提供不足が引き起こす、競争力低下の要因として説明されています。

## Relationship-Anchored Money
- ja: 関係性アンカー型マネー
- aliases: [RAM]
- related: [Symbolization, Securitization (of money)]
- auto_added: 2026-06-23
- auto_source_topic_id: 25275
- auto_source_url: https://ethresear.ch/t/relationship-anchored-money-separating-symbolization-from-securitization/25275
- desc: |
  価値交換の関係性から切り離された匿名トークンとしての「証券化」を構造的に阻止し、価値交換の「象徴化」を維持するよう設計された貨幣プロトコル。ETHを唯一の準備資産とし、L2に不変のスマートコントラクトとしてデプロイされる。

## Symbolization
- ja: 象徴化
- related: [Securitization (of money), Relationship-Anchored Money]
- auto_added: 2026-06-23
- auto_source_topic_id: 25275
- auto_source_url: https://ethresear.ch/t/relationship-anchored-money-separating-symbolization-from-securitization/25275
- desc: |
  価値交換を記録する行為。Relationship-Anchored Moneyプロトコルでは、貨幣が価値交換の関係性を保持する側面を指し、証券化と対比される。

## Securitization (of money)
- ja: 貨幣の証券化
- related: [Symbolization, Relationship-Anchored Money]
- auto_added: 2026-06-23
- auto_source_topic_id: 25275
- auto_source_url: https://ethresear.ch/t/relationship-anchored-money-separating-symbolization-from-securitization/25275
- desc: |
  価値の象徴をその関係性から切り離し、自由に譲渡可能な匿名トークンに変える行為。Relationship-Anchored Moneyプロトコルでは、これが社会的な損害を隠蔽可能にする主要因と見なされる。

## Collaboration pools
- ja: コラボレーションプール
- related: [Relationship-Anchored Money, Equity relationships]
- auto_added: 2026-06-23
- auto_source_topic_id: 25275
- auto_source_url: https://ethresear.ch/t/relationship-anchored-money-separating-symbolization-from-securitization/25275
- desc: |
  Relationship-Anchored Moneyプロトコルにおける普遍的な組織プリミティブ。所有者不在で、株主全員の同意によって統治され、労働報酬が株式ベースの収益分配となる。

## Exchange-channel minting
- ja: 交換チャネルミント
- related: [Relationship-Anchored Money, Transaction tax]
- auto_added: 2026-06-23
- auto_source_topic_id: 25275
- auto_source_url: https://ethresear.ch/t/relationship-anchored-money-separating-symbolization-from-securitization/25275
- desc: |
  Relationship-Anchored Moneyプロトコルにおいて、ETHを預け入れて新しいポイントをミントするプロトコルレベルの操作。20%の取引税の対象外となる。

## EVM
- ja: EVM (イーサリアム仮想マシン)
- aliases: [Ethereum Virtual Machine]
- related: [zkevm, execution layer, smart contract, gas]
- auto_added: 2026-06-23
- auto_source_topic_id: 28843
- auto_source_url: https://ethereum-magicians.org/t/subroutines-for-the-evm-1-june-30-2026/28843
- desc: |
  イーサリアムのスマートコントラクトを実行するための分散型仮想マシンです。ブロックチェーン上のすべてのノードで同じコードが実行されることを保証し、トランザクションの処理と状態の更新を行います。

## Oracle-Permissioned
- ja: オラクル許可型
- related: [Oracle, Permissioned]
- auto_added: 2026-06-23
- auto_source_topic_id: 28842
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-103-june-23-2026/28842
- desc: |
  オラクルによって特定の操作やアクセスが許可されるモデル。スマートコントラクトやトークンにおいて、外部のデータや条件に基づいて権限を制御するために使用される。

## Prepared Transaction Envelope
- ja: 準備済みトランザクションエンベロープ
- related: [Transaction Envelope]
- auto_added: 2026-06-23
- auto_source_topic_id: 28842
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-103-june-23-2026/28842
- desc: |
  特定の目的のために事前に構造化または準備されたトランザクションのラッパー。トランザクションの署名、実行、または他のオンチェーン操作を容易にするために使用される。

## Compliance Oracle
- ja: コンプライアンスオラクル
- related: [Oracle, Zero-Knowledge Proof]
- auto_added: 2026-06-23
- auto_source_topic_id: 28842
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-103-june-23-2026/28842
- desc: |
  ブロックチェーン上のトランザクションやエンティティが特定の規制やポリシーに準拠しているかを検証・報告する役割を持つオラクル。ゼロ知識証明と組み合わせてプライバシーを保護しつつコンプライアンスを実現する。

## Forward compatible consensus data structures
- ja: 前方互換性のあるコンセンサスデータ構造
- related: [consensus layer, protocol upgrade]
- auto_added: 2026-06-23
- auto_source_topic_id: 28840
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-testing-acdt-85-june-29-2026/28840
- desc: |
  Ethereumプロトコルにおいて、将来のアップグレードや変更に対応できるよう設計されたコンセンサス層のデータ構造を指す。これにより、プロトコルの進化に伴う互換性の問題を最小限に抑え、スムーズな移行を可能にする。

## Malleable offchain metadata
- ja: 可変なオフチェーンメタデータ
- related: [NFT]
- auto_added: 2026-06-23
- auto_source_topic_id: 28839
- auto_source_url: https://ethereum-magicians.org/t/using-lsh-minhash-to-enable-decentralized-nft-marketplaces/28839
- desc: |
  NFTの特性や外観を定義するデータがブロックチェーン外に保存され、発行者などによって変更されうる状態を指します。これにより、NFTの永続性や信頼性が損なわれる可能性があります。

## Offchain orderbook
- ja: オフチェーンオーダーブック
- auto_added: 2026-06-23
- auto_source_topic_id: 28839
- auto_source_url: https://ethereum-magicians.org/t/using-lsh-minhash-to-enable-decentralized-nft-marketplaces/28839
- desc: |
  取引の注文（買い注文と売り注文）がブロックチェーン外の集中型システムで管理される形式のオーダーブックです。高速な取引を可能にする一方で、中央集権的な信頼を必要とします。

## minHash
- ja: minHash (ミニハッシュ)
- related: [Locality Sensitive Hashing, Jaccard similarity]
- auto_added: 2026-06-23
- auto_source_topic_id: 28839
- auto_source_url: https://ethereum-magicians.org/t/using-lsh-minhash-to-enable-decentralized-nft-marketplaces/28839
- desc: |
  集合間の類似度を効率的に推定するために使用される、局所性鋭敏型ハッシュ (LSH) の一種です。特に大規模なデータセットにおいて、Jaccard類似度を近似するのに役立ちます。

## Jaccard similarity
- ja: Jaccard類似度 (ジャカード類似度)
- related: [minHash, Locality Sensitive Hashing]
- auto_added: 2026-06-23
- auto_source_topic_id: 28839
- auto_source_url: https://ethereum-magicians.org/t/using-lsh-minhash-to-enable-decentralized-nft-marketplaces/28839
- desc: |
  2つの集合間の類似度を測る尺度で、共通部分の要素数を和集合の要素数で割った値です。minHashと組み合わせて、NFTの特性セット間の類似性をオンチェーンで評価するために利用されます。

## Credibly neutral
- ja: 信頼できる中立性
- related: [decentralization, market fragmentation]
- auto_added: 2026-06-23
- auto_source_topic_id: 28839
- auto_source_url: https://ethereum-magicians.org/t/using-lsh-minhash-to-enable-decentralized-nft-marketplaces/28839
- desc: |
  システムやプロトコルが、特定の参加者やグループに偏ることなく、公平かつ予測可能な方法で機能するという特性を指します。分散型システム、特に市場インフラにおいて、市場の分断を防ぎ、広範な採用を促す上で重要な設計原則です。

## threshold ecdsa
- ja: しきい値ECDSA (Threshold ECDSA)
- related: [threshold encryption, multi-party computation, ECDSA]
- auto_added: 2026-06-24
- auto_source_topic_id: 25279
- auto_source_url: https://ethresear.ch/t/the-ethgent-testnet-officially-launches-today/25279
- desc: |
  複数の参加者が協力してECDSA署名を生成するが、個々の参加者は秘密鍵全体を知らないスキーム。特定のしきい値以上の参加者が合意することで署名が有効となるため、単一障害点のリスクを低減し、セキュリティを向上させる。

## http outcalls
- ja: HTTPアウトコール
- related: [oracle, cross-chain communication]
- auto_added: 2026-06-24
- auto_source_topic_id: 25279
- auto_source_url: https://ethresear.ch/t/the-ethgent-testnet-officially-launches-today/25279
- desc: |
  スマートコントラクトがブロックチェーンの外部にあるHTTPエンドポイントに対してリクエストを送信し、その応答を受け取る機能。これにより、コントラクトはオフチェーンデータやサービスと安全に連携できるようになる。

## app chain
- ja: アプリケーションチェーン
- aliases: [application-specific blockchain]
- related: [rollup, L2, sovereign rollup]
- auto_added: 2026-06-24
- auto_source_topic_id: 25279
- auto_source_url: https://ethresear.ch/t/the-ethgent-testnet-officially-launches-today/25279
- desc: |
  特定のアプリケーションやユースケースのために設計・最適化されたブロックチェーン。汎用的なブロックチェーンとは異なり、そのアプリケーションの要件に合わせてカスタマイズされた機能やパフォーマンスを提供できる。

## async sublayer
- ja: 非同期サブレイヤー
- related: [layered architecture, asynchronous processing]
- auto_added: 2026-06-24
- auto_source_topic_id: 25279
- auto_source_url: https://ethresear.ch/t/the-ethgent-testnet-officially-launches-today/25279
- desc: |
  ブロックチェーンシステム内で非同期処理を扱うための下位レイヤー。メインの実行レイヤーとは独立して動作し、時間のかかる操作や外部との通信などを効率的に処理することで、システムの全体的なスループットと応答性を向上させる。

## Stateful Keys
- ja: ステートフルキー
- related: [XMSS, consumable key, commit-before-sign durability ordering]
- auto_added: 2026-06-24
- auto_source_topic_id: 28853
- auto_source_url: https://ethereum-magicians.org/t/eip-8310-post-quantum-keystore-for-stateful-keys/28853
- desc: |
  署名ごとに内部状態が変化し、その状態を追跡・更新する必要がある暗号キー。XMSSなどのハッシュベース署名スキームで用いられ、キーの再利用や状態の巻き戻しがセキュリティ上の脆弱性につながるため、厳格な管理が求められる。

## leanxmss
- ja: leanXMSS
- related: [XMSS, lean Ethereum consensus layer]
- auto_added: 2026-06-24
- auto_source_topic_id: 28853
- auto_source_url: https://ethereum-magicians.org/t/eip-8310-post-quantum-keystore-for-stateful-keys/28853
- desc: |
  Ethereumのコンセンサス層（lean Ethereum）で使用されることを想定したXMSSの実装またはプロファイル。ポスト量子セキュリティを目的として、BLSバリデーターキーの代替として検討されている。

## commit-before-sign durability ordering
- ja: 署名前コミット耐久性順序付け
- related: [Stateful Keys, high-water mark]
- auto_added: 2026-06-24
- auto_source_topic_id: 28853
- auto_source_url: https://ethereum-magicians.org/t/eip-8310-post-quantum-keystore-for-stateful-keys/28853
- desc: |
  ステートフルキー（特にXMSS）の安全な運用を保証するためのプロトコル設計パターン。署名が生成される前に、キーの進んだ状態（ハイウォーターマーク）を永続ストレージにコミットすることを義務付ける。これにより、システム障害時でもキー状態の巻き戻しによる再利用を防ぐ。

## Bounded Agent Actions
- ja: 制限付きエージェントアクション (ERC-1833)
- aliases: [ERC-1833]
- related: [agent authority, bounded mandate, cursor]
- auto_added: 2026-06-24
- auto_source_topic_id: 28851
- auto_source_url: https://ethereum-magicians.org/t/erc-1833-bounded-agent-actions-a-metering-layer-for-agent-authority/28851
- desc: |
  ERC-1833で提案されている、エージェントが持つ権限（マンデート）の使用量を計測するためのフレームワーク。エージェントが実行したアクション全体で、どれだけの権限を消費したかを追跡する。

## cursor
- ja: カーソル (オンチェーンオブジェクト)
- related: [Bounded Agent Actions, bounded mandate, metering layer]
- auto_added: 2026-06-24
- auto_source_topic_id: 28851
- auto_source_url: https://ethereum-magicians.org/t/erc-1833-bounded-agent-actions-a-metering-layer-for-agent-authority/28851
- desc: |
  エージェントの制限付きマンデートの使用量を追跡するために使用される、オンチェーンの小さなオブジェクト。単一のインターフェースを持ち、マンデートの残量を読み取り、消費量に応じて進めることができる。

## bounded mandate
- ja: 制限付きマンデート
- related: [agent authority, Bounded Agent Actions, cursor]
- auto_added: 2026-06-24
- auto_source_topic_id: 28851
- auto_source_url: https://ethereum-magicians.org/t/erc-1833-bounded-agent-actions-a-metering-layer-for-agent-authority/28851
- desc: |
  エージェントに付与される、使用量に上限が設定された権限。エージェントが実行するアクションを通じて消費され、その残量が追跡される。

## metering layer
- ja: 計測レイヤー
- related: [Bounded Agent Actions, cursor]
- auto_added: 2026-06-24
- auto_source_topic_id: 28851
- auto_source_url: https://ethereum-magicians.org/t/erc-1833-bounded-agent-actions-a-metering-layer-for-agent-authority/28851
- desc: |
  エージェントの権限（マンデート）の使用量を計測し、追跡するための抽象化された層。この層は、消費された権限の量を記録する役割を担い、実際の強制は別の層で行われる。

## bounded-execution
- ja: 制限付き実行
- related: [ERC-8301, Bounded Agent Actions]
- auto_added: 2026-06-24
- auto_source_topic_id: 28851
- auto_source_url: https://ethereum-magicians.org/t/erc-1833-bounded-agent-actions-a-metering-layer-for-agent-authority/28851
- desc: |
  ERC-8301で議論されている概念で、エージェントやコントラクトの実行に特定の制約や上限を設けること。本ERC-1833の計測レイヤーと連携して、実行の制約を強制する。

## Fast Confirmation Rule
- ja: 高速承認ルール
- aliases: [FCR]
- auto_added: 2026-06-24
- auto_source_topic_id: 28850
- auto_source_url: https://ethereum-magicians.org/t/fast-confirmation-rule-fcr-10-july-7-2026/28850
- desc: |
  Ethereumにおけるトランザクションの高速承認に関する特定のルールまたは提案。ブロックのファイナリティやトランザクションの確定を加速するためのメカニズムを指す。会議の議題として定期的に議論されていることから、継続的な研究テーマであると考えられる。

## Scope Contestation Registry
- ja: スコープ異議申し立てレジストリ
- related: [Observation Scope, Contestability]
- auto_added: 2026-06-25
- auto_source_topic_id: 28856
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-scope-contestation-registry-permissionless-observation-scope-completeness-contestability/28856
- desc: |
  アクターが観測した座標の集合（観測スコープ）を外部コミットメントに紐付けてコミットし、任意の第三者が特定の座標がそのコミットされた集合に「不在」であったことをオンチェーンで証明できる、パーミッションレスなメカニズム。レジストリはこれらの証明を永続的に記録し、観測の完全性に関する異議申し立てを可能にする。

## Observation Scope
- ja: 観測スコープ
- related: [Scope Contestation Registry, Coordinate]
- auto_added: 2026-06-25
- auto_source_topic_id: 28856
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-scope-contestation-registry-permissionless-observation-scope-completeness-contestability/28856
- desc: |
  アクターが観測した座標の集合。スコープ異議申し立てレジストリにおいて、このスコープの「完全性」が問われる対象となる。エージェントが特定のタスクを実行する際に考慮した情報範囲を示す。

## Contestability
- ja: 異議申し立て可能性
- related: [Scope Contestation Registry, Omission]
- auto_added: 2026-06-25
- auto_source_topic_id: 28856
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-scope-contestation-registry-permissionless-observation-scope-completeness-contestability/28856
- desc: |
  観測スコープからの見えない省略を、永続的でパーミッションレスかつ再計算可能な主張へと変換するメカニズム。これにより、システムの構造的な盲点に対処し、観測の完全性に関する検証を可能にする。

## Omission
- ja: 省略（観測スコープからの）
- related: [Observation Scope, Contestability]
- auto_added: 2026-06-25
- auto_source_topic_id: 28856
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-scope-contestation-registry-permissionless-observation-scope-completeness-contestability/28856
- desc: |
  アクターが観測スコープから特定の座標を意図的または偶発的に含めなかった状態。スコープ異議申し立てレジストリは、この省略が構造的に見えないものではなく、異議申し立て可能であることを保証する。

## Coordinate
- ja: 座標（観測スコープ内の）
- related: [Observation Scope]
- auto_added: 2026-06-25
- auto_source_topic_id: 28856
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-scope-contestation-registry-permissionless-observation-scope-completeness-contestability/28856
- desc: |
  観測スコープを構成する個々のデータ要素。例えば、資産回復の文脈では特定のアドレスを指し、その存在または不在が観測スコープの完全性に影響を与える。

## Programmable Settlement Locks
- ja: プログラマブル決済ロック (Programmable Settlement Locks)
- aliases: [ERC-8316]
- related: [Atomic Settlement, Settlement Object]
- auto_added: 2026-06-26
- auto_source_topic_id: 28861
- auto_source_url: https://ethereum-magicians.org/t/erc-8316-programmable-settlement-locks/28861
- desc: |
  異なるアセットモデルや可視性を持つシステム間でのアトミックな決済を可能にするために提案されたERC-8316で定義されるインターフェース。価値を持つコントラクトが共通のロックライフサイクル（作成、更新、委任、使用、キャンセル、検査）を公開するための最小限のインターフェースを提供する。

## Atomic Settlement
- ja: アトミック決済 (Atomic Settlement)
- related: [Programmable Settlement Locks, Settlement Object]
- auto_added: 2026-06-26
- auto_source_topic_id: 28861
- auto_source_url: https://ethereum-magicians.org/t/erc-8316-programmable-settlement-locks/28861
- desc: |
  異なるシステム間で、すべてが成功するか、すべてが失敗するかのいずれかとなるように、価値の移転を最終的に確定させるプロセス。特に、アセットモデルや可視性の前提が異なるシステム間での信頼性の高い価値移転を可能にする。

## Settlement Object
- ja: 決済オブジェクト (Settlement Object)
- related: [Programmable Settlement Locks, Atomic Settlement]
- auto_added: 2026-06-26
- auto_source_topic_id: 28861
- auto_source_url: https://ethereum-magicians.org/t/erc-8316-programmable-settlement-locks/28861
- desc: |
  プログラマブル決済ロックの提案における中心的な概念で、標準化された決済の表現。これは、単一の現在の使用者を持ち、コミットされた使用パスとキャンセルパス、および最終化権限の委任を伴う、準備された価値を持つ操作を表す。

## Value-bearing operation
- ja: 価値を持つ操作 (Value-bearing operation)
- related: [Programmable Settlement Locks, Settlement Object]
- auto_added: 2026-06-26
- auto_source_topic_id: 28861
- auto_source_url: https://ethereum-magicians.org/t/erc-8316-programmable-settlement-locks/28861
- desc: |
  価値を持つコントラクトによって実行される、資産の移動や状態変更を伴う操作。プログラマブル決済ロックは、このような操作を事前に準備し、その最終化を委任するためのメカニズムを提供する。

## Delegation of finalization authority
- ja: 最終化権限の委任 (Delegation of finalization authority)
- related: [Programmable Settlement Locks, Settlement Object]
- auto_added: 2026-06-26
- auto_source_topic_id: 28861
- auto_source_url: https://ethereum-magicians.org/t/erc-8316-programmable-settlement-locks/28861
- desc: |
  プログラマブル決済ロックの重要な機能の一つで、準備された価値を持つ操作の最終的な実行（使用またはキャンセル）を、元の作成者から別の当事者や調整コントラクトに委任すること。これにより、委任された使用者は、事前に定義されたパスを通じてのみ操作を完了できる。

## Privileged Role Control Framework
- ja: 特権ロール制御フレームワーク
- aliases: [PRCF]
- related: [Smart Contract Lifecycle Registry, Contract Role Semantics Standard, Time-Bound Access Control Interface, Smart Contract Emergency Response]
- auto_added: 2026-06-26
- auto_source_topic_id: 28859
- auto_source_url: https://ethereum-magicians.org/t/introducing-a-privileged-role-control-framework/28859
- desc: |
  スマートコントラクトの特権アクセス管理を標準化するためのERC群。ロールの定義からインシデント対応まで、セキュリティライフサイクル全体をカバーし、ガバナンスの課題解決を目指す。

## Smart Contract Lifecycle Registry
- ja: スマートコントラクトライフサイクルレジストリ
- aliases: [ERC-8089]
- related: [Privileged Role Control Framework]
- auto_added: 2026-06-26
- auto_source_topic_id: 28859
- auto_source_url: https://ethereum-magicians.org/t/introducing-a-privileged-role-control-framework/28859
- desc: |
  デプロイされたスマートコントラクトの存在とライフサイクルステータス（Default, Active, Deprecated, Frozen, Terminated）を追跡するためのオンチェーンレジストリの標準。忘れられたコントラクトが攻撃対象となるリスクを軽減する。

## Contract Role Semantics Standard
- ja: コントラクトロール意味論標準
- aliases: [ERC-8315]
- related: [Privileged Role Control Framework, Contract Role Naming Standard]
- auto_added: 2026-06-26
- auto_source_topic_id: 28859
- auto_source_url: https://ethereum-magicians.org/t/introducing-a-privileged-role-control-framework/28859
- desc: |
  標準化されたロール命名構造からセキュリティ意味論を導き出すERC。ロールの階層分類や承認元を定義し、自動化されたリスク評価を可能にする。

## Time-Bound Access Control Interface
- ja: 期限付きアクセス制御インターフェース
- aliases: [ERC-8083]
- related: [Privileged Role Control Framework]
- auto_added: 2026-06-26
- auto_source_topic_id: 28859
- auto_source_url: https://ethereum-magicians.org/t/introducing-a-privileged-role-control-framework/28859
- desc: |
  ロール付与に有効期限（expiryTimestamp）を紐付けるERC。期限が過ぎると自動的にロールが無効化され、ベンダーや元スタッフによる古い永続的なロールの蓄積を防ぐ。

## Smart Contract Emergency Response
- ja: スマートコントラクト緊急対応
- aliases: [ERC-8308]
- related: [Privileged Role Control Framework, Smart Contract Emergency State]
- auto_added: 2026-06-26
- auto_source_topic_id: 28859
- auto_source_url: https://ethereum-magicians.org/t/introducing-a-privileged-role-control-framework/28859
- desc: |
  緊急対応のためのアクションインターフェースを標準化するERC。`triggerEmergency()`と`resolveEmergency()`関数を提供し、監視システムや自動応答システムが任意の準拠コントラクトで緊急事態をトリガー・解決できるようにする。

## memory layer
- ja: メモリ層
- related: [sequencer, based sequencing, virtual mempools]
- auto_added: 2026-06-27
- auto_source_topic_id: 25305
- auto_source_url: https://ethresear.ch/t/ethereums-fourth-protocol-layer-memory/25305
- desc: |
  トランザクションがロールアップにシーケンスされ、メモリプールが形成され、検閲や強制的なインクルージョンリストへの追加が行われるプロトコル層。アカウント抽象化の多くの側面もこの層で発生する。

## sequencer
- ja: シーケンサー
- related: [rollup, memory layer, based sequencing]
- auto_added: 2026-06-27
- auto_source_topic_id: 25305
- auto_source_url: https://ethresear.ch/t/ethereums-fourth-protocol-layer-memory/25305
- desc: |
  ロールアップの計算に含まれるトランザクションを選択するエンティティ。歴史的に中央集権的であり、計算とトランザクションの検閲に対する全権限を持つ。

## based sequencing
- ja: ベースド・シーケンシング
- related: [sequencer, memory layer, virtual mempools]
- auto_added: 2026-06-27
- auto_source_topic_id: 25305
- auto_source_url: https://ethresear.ch/t/ethereums-fourth-protocol-layer-memory/25305
- desc: |
  トランザクションのシーケンスを分散化し、検閲耐性やMEVの削減を目指すシーケンシング手法。メモリ層の問題に対する潜在的な解決策の一つ。

## virtual mempools
- ja: 仮想メモリプール
- aliases: [sharded mempools]
- related: [memory layer, based sequencing, sequencer]
- auto_added: 2026-06-27
- auto_source_topic_id: 25305
- auto_source_url: https://ethresear.ch/t/ethereums-fourth-protocol-layer-memory/25305
- desc: |
  メモリ層を分散化し、トランザクションのシーケンスをロールアップだけでなくメインネット自体にも適用するための概念。公正なインクルージョンとMEVの根絶を目指す。

## attestor-proposer separation
- ja: アテスター・プロポーザー分離
- related: [proposer-builder separation, MEV, consensus layer]
- auto_added: 2026-06-27
- auto_source_topic_id: 25305
- auto_source_url: https://ethresear.ch/t/ethereums-fourth-protocol-layer-memory/25305
- desc: |
  EthereumのPoSにおいて、ブロックの提案者とアテスターの役割を分離する提案。これにより、コンセンサスと実行の分離がより明確になり、MEVや検閲の問題に対処する。

## harvest-now-decrypt-later attacks
- ja: 今すぐ収集し、後で解読する攻撃
- aliases: [HNDL attacks]
- related: [post-quantum cryptography, quantum computer]
- auto_added: 2026-06-27
- auto_source_topic_id: 25291
- auto_source_url: https://ethresear.ch/t/towards-native-post-quantum-private-eth/25291
- desc: |
  現在の暗号化されたデータを量子コンピュータが利用可能になった将来に解読するために、今すぐ収集・保存しておく攻撃手法。耐量子計算機暗号への移行を促す主要な脅威の一つです。

## key encapsulation mechanism
- ja: 鍵カプセル化メカニズム (KEM)
- aliases: [KEM]
- related: [key agreement, post-quantum cryptography, NIST PQC]
- auto_added: 2026-06-27
- auto_source_topic_id: 25291
- auto_source_url: https://ethresear.ch/t/towards-native-post-quantum-private-eth/25291
- desc: |
  公開鍵暗号の一種で、共有秘密鍵を安全に確立するために使用されます。特に耐量子計算機暗号の文脈で、鍵合意プロトコルに代わる主要な構成要素としてNISTによって標準化されています。

## decryption trilemma
- ja: 復号のトリレンマ
- related: [oblivious message retrieval, fuzzy message detection, privacy-preserving protocols]
- auto_added: 2026-06-27
- auto_source_topic_id: 25291
- auto_source_url: https://ethresear.ch/t/towards-native-post-quantum-private-eth/25291
- desc: |
  プライバシー保護プロトコルにおいて、匿名性、低遅延、小帯域幅使用量の3つの特性を同時に満たすことが困難であるという課題です。耐量子計算機スキームへの移行により、この問題はさらに顕著になります。

## oblivious message retrieval
- ja: 秘匿メッセージ検索 (OMR)
- aliases: [OMR]
- related: [oblivious message detection, private information retrieval, decryption trilemma]
- auto_added: 2026-06-27
- auto_source_topic_id: 25291
- auto_source_url: https://ethresear.ch/t/towards-native-post-quantum-private-eth/25291
- desc: |
  受信者が、どのメッセージを検索したかをサーバーに知られることなく、特定のメッセージを効率的に取得できる暗号技術です。量子安全な構成も存在しますが、オンチェーンコストやサーバーコストが高いという課題があります。

## turnstiles
- ja: ターンスタイル
- related: [recovery mechanism, social layer coordination]
- auto_added: 2026-06-27
- auto_source_topic_id: 25291
- auto_source_url: https://ethresear.ch/t/towards-native-post-quantum-private-eth/25291
- desc: |
  プロトコルにおいて、特に壊滅的な資金損失が発生した場合に、プロトコルの回復を試みるためのメカニズムです。本質的に反応的、非遡及的、非予防的な手法であり、ソーシャルレイヤーの調整を必要とします。

## Contract Storage Layout
- ja: コントラクトストレージレイアウト
- related: [Storage Layout Metadata, Diamond Storage, Namespaced Storage]
- auto_added: 2026-06-27
- auto_source_topic_id: 28864
- auto_source_url: https://ethereum-magicians.org/t/erc-8317-contract-storage-layout-descriptor-format/28864
- desc: |
  イーサリアムのスマートコントラクトがブロックチェーン上にデータをどのように保存するかを定義する構造。変数の宣言順序や型によってストレージスロットへのマッピングが決まる。

## Storage Layout Metadata
- ja: ストレージレイアウトメタデータ
- related: [Contract Storage Layout, Transaction Simulation, Clear Signing]
- auto_added: 2026-06-27
- auto_source_topic_id: 28864
- auto_source_url: https://ethereum-magicians.org/t/erc-8317-contract-storage-layout-descriptor-format/28864
- desc: |
  スマートコントラクトのストレージレイアウトに関する記述情報。トランザクションシミュレーションやクリアサイニングなどのツールが、コントラクトの状態変更を解釈し、ユーザーに分かりやすく表示するために利用される。

## Diamond Storage
- ja: ダイヤモンドストレージ
- related: [EIP-2535, Namespaced Storage, Smart Contract Accounts]
- auto_added: 2026-06-27
- auto_source_topic_id: 28864
- auto_source_url: https://ethereum-magicians.org/t/erc-8317-contract-storage-layout-descriptor-format/28864
- desc: |
  スマートコントラクトのストレージパターンの一つで、複数のファセット（実装コントラクト）が単一のプロキシコントラクトのストレージを共有できるように設計されている。ストレージの衝突を避けつつ、モジュール性を高めることを目的とする。

## Namespaced Storage
- ja: 名前空間付きストレージ
- related: [Contract Storage Layout, Diamond Storage, EIP-7201]
- auto_added: 2026-06-27
- auto_source_topic_id: 28864
- auto_source_url: https://ethereum-magicians.org/t/erc-8317-contract-storage-layout-descriptor-format/28864
- desc: |
  スマートコントラクトのストレージ管理パターンの一つで、ストレージスロットを論理的な「名前空間」に分割することで、異なるモジュールやライブラリ間でのストレージ衝突を防ぐ。特にアップグレード可能なコントラクトで有用。

## state access
- ja: 状態アクセス
- related: [state, state growth, active state, dormant state]
- auto_added: 2026-06-30
- auto_source_topic_id: 25317
- auto_source_url: https://ethresear.ch/t/the-anatomy-of-ethereum-s-state-access/25317
- desc: |
  Ethereumブロックチェーンの状態（アカウント残高、nonce、コード、ストレージスロットなど）に対する読み取りおよび書き込み操作のこと。チェーンのスケーラビリティや効率性を議論する上で中心的な概念です。

## dormant state
- ja: 休眠状態
- related: [active state, state expiry, state tiering]
- auto_added: 2026-06-30
- auto_source_topic_id: 25317
- auto_source_url: https://ethresear.ch/t/the-anatomy-of-ethereum-s-state-access/25317
- desc: |
  Ethereumブロックチェーンの状態のうち、長期間にわたってアクセス（読み書き）されていない部分を指します。状態の肥大化問題に対処するための状態階層化（state tiering）の議論において、アクティブな状態と区別されます。

## write-age tier
- ja: 書き込み経過時間階層
- related: [state tiering, EIP-8295, Active state, Inactive state]
- auto_added: 2026-06-30
- auto_source_topic_id: 25317
- auto_source_url: https://ethresear.ch/t/the-anatomy-of-ethereum-s-state-access/25317
- desc: |
  Ethereumの状態管理において、各状態要素が最後に書き込まれてからの経過時間に基づいて状態を階層化する仕組みです。EIP-8295などで提案されており、最近書き込まれた状態（Active）を安価に、長期間書き込まれていない状態（Inactive）を高価にすることで、状態の肥大化を抑制します。

## existence probes
- ja: 存在確認プローブ
- related: [state access, read-only set, populated read]
- auto_added: 2026-06-30
- auto_source_topic_id: 25317
- auto_source_url: https://ethresear.ch/t/the-anatomy-of-ethereum-s-state-access/25317
- desc: |
  Ethereumの状態に対する読み取り操作のうち、特定のアカウントやストレージスロットが存在するかどうか、または値が設定されているかどうかを確認するために行われるものを指します。多くの場合、ゼロ値を返す読み取りとして観測されます。

## populated read
- ja: 値あり読み取り
- related: [state access, read-only set, existence probes]
- auto_added: 2026-06-30
- auto_source_topic_id: 25317
- auto_source_url: https://ethresear.ch/t/the-anatomy-of-ethereum-s-state-access/25317
- desc: |
  Ethereumの状態に対する読み取り操作のうち、ゼロ以外の（つまり、実際にデータが設定されている）値を返すものを指します。存在確認プローブ（existence probes）と対比され、実際のデータ利用を伴う読み取りを示します。

## Sybil resistance
- ja: シビル耐性
- related: [Sybil attack, Proof of Personhood]
- auto_added: 2026-06-30
- auto_source_topic_id: 25316
- auto_source_url: https://ethresear.ch/t/the-price-of-forgery-measuring-sybil-resistance-in-dollars-a-paper/25316
- desc: |
  分散システムやブロックチェーンにおいて、単一のエンティティが複数の偽のアイデンティティ（シビル）を作成してシステムを操作しようとするシビル攻撃に対するシステムの耐性。

## Price of Forgery
- ja: 偽造の価格 (PoF)
- aliases: [PoF]
- related: [Proof of Personhood, Sybil resistance]
- auto_added: 2026-06-30
- auto_source_topic_id: 25316
- auto_source_url: https://ethresear.ch/t/the-price-of-forgery-measuring-sybil-resistance-in-dollars-a-paper/25316
- desc: |
  特定の人間証明（Proof of Personhood）手法において、偽のアイデンティティを1つ作成するために必要なドル建てのコスト。市場メカニズムによって客観的に決定される。

## Upala protocol
- ja: ウパラプロトコル
- related: [Price of Forgery, Proof of Personhood, Gentle Methodology]
- auto_added: 2026-06-30
- auto_source_topic_id: 25316
- auto_source_url: https://ethresear.ch/t/the-price-of-forgery-measuring-sybil-resistance-in-dollars-a-paper/25316
- desc: |
  偽造の価格（PoF）を測定するために設計されたプロトコル。ユーザーが自らのアイデンティティを意図的にシビルとしてマークし、その対価として金銭を受け取ることで、市場が偽造コストを明らかにする。

## Gentle Methodology
- ja: ジェントルメソドロジー
- related: [Price of Forgery, Upala protocol]
- auto_added: 2026-06-30
- auto_source_topic_id: 25316
- auto_source_url: https://ethresear.ch/t/the-price-of-forgery-measuring-sybil-resistance-in-dollars-a-paper/25316
- desc: |
  Upalaプロトコル内で偽造の価格（PoF）を決定するために用いられる、スコアとプールサイズに関するデュアルオークションの仕組み。市場の反応を段階的に観察し、偽造者が価格を明らかにするまで調整する。

## EIP tagging
- ja: EIPタグ付け
- related: [EIP, ERC]
- auto_added: 2026-06-30
- auto_source_topic_id: 28887
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-104-june-30-2026/28887
- desc: |
  EIP（Ethereum Improvement Proposal）にタグを付与し、分類や検索を容易にするための提案。EIPの管理と発見性を向上させることを目的としています。

## slot-0 reorg
- ja: スロット0リorg
- related: [epoch boundary, attestation deadline]
- auto_added: 2026-07-02
- auto_source_topic_id: 25338
- auto_source_url: https://ethresear.ch/t/is-the-slot-0-reorg-cost-fixable-epbs-attestation-deadline-study/25338
- desc: |
  各エポックの最初のスロット（スロット0）で発生するブロックのリorg。他のスロットと比較して発生頻度が高く、エポック遷移に伴う処理の遅延やブロック伝播の問題が主な原因とされる。

## attestation deadline
- ja: アテステーション期限
- related: [ePBS, slot-0 reorg, payload propagation]
- auto_added: 2026-07-02
- auto_source_topic_id: 25338
- auto_source_url: https://ethresear.ch/t/is-the-slot-0-reorg-cost-fixable-epbs-attestation-deadline-study/25338
- desc: |
  バリデータがブロックに投票（アテステーション）する最終期限。この期限までにブロックがネットワークに伝播しない場合、リorgのリスクが高まる。ePBSの導入により、この期限は調整可能なパラメータとなる。

## epoch boundary
- ja: エポック境界
- related: [slot-0 reorg, epoch]
- auto_added: 2026-07-02
- auto_source_topic_id: 25338
- auto_source_url: https://ethresear.ch/t/is-the-slot-0-reorg-cost-fixable-epbs-attestation-deadline-study/25338
- desc: |
  Ethereumのコンセンサス層におけるエポックの区切り。スロット0はこの境界に位置し、ファイナライゼーションの帳簿処理、RANDAOのシャッフル、新しい委員会割り当てなど、重要な遷移作業が行われる。

## locally-built blocks
- ja: ローカル構築ブロック
- related: [relay-delivered blocks, MEV-Boost]
- auto_added: 2026-07-02
- auto_source_topic_id: 25338
- auto_source_url: https://ethresear.ch/t/is-the-slot-0-reorg-cost-fixable-epbs-attestation-deadline-study/25338
- desc: |
  MEV-Boostリレーを介さず、プロポーザー自身がローカルで構築したブロック。エポック境界などの繁忙時に、リレー経由のブロックよりも伝播が遅れる傾向があり、リorgの原因となることがある。

## DA-propagation burden
- ja: DA伝播負荷 (Data Availability Propagation Burden)
- related: [blob, data availability, payload propagation]
- auto_added: 2026-07-02
- auto_source_topic_id: 25338
- auto_source_url: https://ethresear.ch/t/is-the-slot-0-reorg-cost-fixable-epbs-attestation-deadline-study/25338
- desc: |
  ブロックに添付されるブロブ（データアベイラビリティデータ）の伝播にかかる負荷。ブロブ数が多いほど伝播が遅くなり、特にローカル構築ブロックにおいてスロット0のリorgリスクを高める要因となる。

## Ossification
- ja: オシフィケーション (硬化)
- related: [Decentralization, Centralization, Mining Pool]
- auto_added: 2026-07-02
- auto_source_topic_id: 25332
- auto_source_url: https://ethresear.ch/t/rethinking-collaborative-trust-for-verifiably-decentralized-blockchain-systems/25332
- desc: |
  ブロックチェーンシステムにおいて、ノードの連合が時間とともにリソースをプールし、協力して効率を向上させ、市場を支配することで中央集権化が進む現象。本論文では、ブロックチェーンの分散化度を決定する主要因とされている。

## Verifiably Decentralized Blockchain System
- ja: 検証可能な分散型ブロックチェーンシステム
- related: [Decentralization, Blockchain System]
- auto_added: 2026-07-02
- auto_source_topic_id: 25332
- auto_source_url: https://ethresear.ch/t/rethinking-collaborative-trust-for-verifiably-decentralized-blockchain-systems/25332
- desc: |
  分散化の度合いを測定または証明できるブロックチェーンシステム。本論文では、ユーザー間の協調的なインタラクションの豊かさと多様性が分散化の本質を捉えるという観点から、このようなシステムの構築フレームワークが提案されている。

## Ossification-resistant
- ja: オシフィケーション耐性 (硬化耐性)
- related: [Ossification, Decentralization, Incentive Mechanism]
- auto_added: 2026-07-02
- auto_source_topic_id: 25332
- auto_source_url: https://ethresear.ch/t/rethinking-collaborative-trust-for-verifiably-decentralized-blockchain-systems/25332
- desc: |
  ノードの連合がリソースをプールし、市場を支配することで中央集権化が進む「オシフィケーション」現象に抵抗する特性を持つシステム。本論文では、オシフィケーションを防ぐための新しいインセンティブメカニズムが提案されている。

## Anti-ossification incentives
- ja: オシフィケーション防止インセンティブ
- related: [Ossification, Incentive Mechanism, Decentralization]
- auto_added: 2026-07-02
- auto_source_topic_id: 25332
- auto_source_url: https://ethresear.ch/t/rethinking-collaborative-trust-for-verifiably-decentralized-blockchain-systems/25332
- desc: |
  ブロックチェーンシステムにおいて、ノードが連合を形成し中央集権化する「オシフィケーション」を防ぐために設計されたインセンティブメカニズム。多様なエンティティとの協力を奨励し、静的な連合を罰することで分散化を促進する。

## Importance score
- ja: 重要度スコア
- related: [Sybil Resistance, Reputation System]
- auto_added: 2026-07-02
- auto_source_topic_id: 25332
- auto_source_url: https://ethresear.ch/t/rethinking-collaborative-trust-for-verifiably-decentralized-blockchain-systems/25332
- desc: |
  本論文で提案されているメカニズムにおいて、各公開鍵に割り当てられるスコア。ノードが過去にどれだけ多様なノードと協力してきたかの尺度であり、悪意のあるノードを避けるための指標として利用される。トークンとは異なり、時間とともにアルゴリズム的に獲得され、容易に譲渡できない。

## self-destruct
- ja: self-destruct (自己破壊)
- related: [Solidity, smart contract]
- auto_added: 2026-07-02
- auto_source_topic_id: 25331
- auto_source_url: https://ethresear.ch/t/integrating-kleros-for-onchain-arr/25331
- desc: |
  Ethereumスマートコントラクトの組み込み機能で、コントラクト自身をブロックチェーンから削除し、残りのEtherを指定されたアドレスに送る。セキュリティやアップグレードパターンにおいて重要な考慮事項となる。

## decentralized arbitration
- ja: 分散型仲裁
- related: [Kleros, dispute resolution, smart contract]
- auto_added: 2026-07-02
- auto_source_topic_id: 25331
- auto_source_url: https://ethresear.ch/t/integrating-kleros-for-onchain-arr/25331
- desc: |
  ブロックチェーン上で発生する紛争を、中央集権的な第三者機関ではなく、分散化された参加者（陪審員など）の合意によって解決するメカニズム。スマートコントラクトの実行結果に関する異議申し立てなどに利用される。

## Agent-to-agent trust network
- ja: エージェント間信頼ネットワーク
- related: [agent-native trust network]
- auto_added: 2026-07-02
- auto_source_topic_id: 25322
- auto_source_url: https://ethresear.ch/t/does-erc-8004-form-an-agent-to-agent-trust-network/25322
- desc: |
  ERC-8004のようなシステムにおいて、自律エージェント同士が相互に信頼を構築し、評価し合うことで形成されるネットワーク。本稿では、このネットワークが実際に機能しているかを分析している。

## Agent identity layer
- ja: エージェントIDレイヤー
- related: [ERC-8004]
- auto_added: 2026-07-02
- auto_source_topic_id: 25322
- auto_source_url: https://ethresear.ch/t/does-erc-8004-form-an-agent-to-agent-trust-network/25322
- desc: |
  ERC-8004などのプロトコルが提供する、オンチェーン上のエージェントの識別情報と評判を管理する基盤。エージェントのオフチェーンでの活動パターンがオンチェーンで観測可能な痕跡を残す。

## Adjusted reputation
- ja: 調整済み評判
- related: [reputation]
- auto_added: 2026-07-02
- auto_source_topic_id: 25322
- auto_source_url: https://ethresear.ch/t/does-erc-8004-form-an-agent-to-agent-trust-network/25322
- desc: |
  ERC-8004システム内でエージェントに付与される評判スコアで、オンチェーン活動などの要因に基づいて調整されたもの。エージェントの信頼性やパフォーマンスを測る指標となる。

## Feedback network
- ja: フィードバックネットワーク
- related: [reputation system]
- auto_added: 2026-07-02
- auto_source_topic_id: 25322
- auto_source_url: https://ethresear.ch/t/does-erc-8004-form-an-agent-to-agent-trust-network/25322
- desc: |
  ERC-8004の評判システムにおいて、エージェント間の評判インタラクション（評価のやり取り）から構築される有向ネットワーク。誰が誰を評価しているか、その構造を可視化する。

## Zombie agents
- ja: ゾンビエージェント
- related: [batch registration]
- auto_added: 2026-07-02
- auto_source_topic_id: 25322
- auto_source_url: https://ethresear.ch/t/does-erc-8004-form-an-agent-to-agent-trust-network/25322
- desc: |
  ERC-8004の登録レイヤーに存在するものの、ほとんど活動していない、または全く使用されていない非アクティブなエージェント。本稿の分析では、全エージェントの約95%がこれに該当するとされる。
