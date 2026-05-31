---
title: Ethereum Research 用語集（編集ソース）
last_updated: 2026-05-31
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

## Keyed Nonces
- ja: キー付きナンス (Keyed Nonces)
- related: [Async nonce, Frame Transactions, EIP-8250]
- auto_added: 2026-05-31
- auto_source_topic_id: 28642
- auto_source_url: https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642
- desc: |
  EIP-8250で提案されている、単一の送信者ナンスを(nonce_key, nonce_seq)のペアで置き換える仕組みです。これにより、異なるキーを持つトランザクションはリプレイ攻撃に対して独立し、並行処理やプライバシープロトコルでの利用が可能になります。

## Frame Transactions
- ja: フレームトランザクション (Frame Transactions)
- related: [EIP-8141, Keyed Nonces]
- auto_added: 2026-05-31
- auto_source_topic_id: 28642
- auto_source_url: https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642
- desc: |
  EIP-8141で導入されたトランザクションタイプです。EIP-8250では、このフレームトランザクションの単一送信者ナンスをキー付きナンスに置き換えることが提案されています。

## Async nonce
- ja: 非同期ナンス (Async nonce)
- related: [Keyed Nonces, Sync nonce]
- auto_added: 2026-05-31
- auto_source_topic_id: 28642
- auto_source_url: https://ethereum-magicians.org/t/async-nonces-on-evvm-experience-to-improve-eip-8250-keyed-nonces/28642
- desc: |
  EVVMで実装されているナンスモデルの一つで、アカウントごとに(account, nonce_value)のスロットを持ち、使用時に消費済みとマークされます。異なる非同期ナンスはリプレイ攻撃に対して独立しており、並行するインテントや共有送信者パターンに利用されます。

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

## Devnet
- ja: 開発ネットワーク (Devnet)
- aliases: [Development Network]
- related: [Testnet, Mainnet]
- auto_added: 2026-05-31
- auto_source_topic_id: 28635
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-pq-interop-41-may-27-2026/28635
- desc: |
  開発者が新しいプロトコルやアプリケーションをテストするために使用する、本番環境（メインネット）とは異なる独立したブロックチェーンネットワークです。実際の資産価値を持たないため、自由に実験やデバッグを行うことができます。

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
