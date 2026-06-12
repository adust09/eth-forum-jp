---
title: Ethereum Research 用語集（編集ソース）
last_updated: 2026-06-12
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
