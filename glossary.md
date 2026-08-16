---
title: Ethereum Research 用語集（編集ソース）
last_updated: 2026-08-16
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

## receipt-freeness
- ja: 領収書不要性
- related: [vote-buying, MACI]
- auto_added: 2026-07-03
- auto_source_topic_id: 25348
- auto_source_url: https://ethresear.ch/t/designing-infrastructure-where-exploits-destroy-themselves/25348
- desc: |
  投票の買い占めを防ぐための特性で、投票者が中間的な行動を買い手に提示しても、買い手が最終的な選択を数学的に検証できない状態を指します。これにより、投票の売買が経済的に成り立たなくなります。

## AI Sentinel
- ja: AIセンチネル
- related: [AI as notary, Sybil attack]
- auto_added: 2026-07-03
- auto_source_topic_id: 25348
- auto_source_url: https://ethresear.ch/t/designing-infrastructure-where-exploits-destroy-themselves/25348
- desc: |
  AIエージェントが監視役として機能し、システム内の異常な活動や協調的な攻撃を検出する層を指します。特に、長期間にわたる同期活動の監視に用いられます。

## ZK-nullifier
- ja: ZKヌリファイア（ゼロ知識ヌリファイア）
- aliases: [ZK-nullifiers]
- related: [nullifier, zero-knowledge proof]
- auto_added: 2026-07-03
- auto_source_topic_id: 25348
- auto_source_url: https://ethresear.ch/t/designing-infrastructure-where-exploits-destroy-themselves/25348
- desc: |
  ゼロ知識証明（ZK-SNARKsなど）に基づいて生成されるヌリファイアで、特定の行動（例：投票）が一度だけ行われたことを証明し、二重投票などの不正を防ぐために使用されます。プライバシーを保護しつつ、一意性を保証します。

## mid-session choice mutability
- ja: セッション中選択変更可能性
- related: [receipt-freeness, vote-buying]
- auto_added: 2026-07-03
- auto_source_topic_id: 25348
- auto_source_url: https://ethresear.ch/t/designing-infrastructure-where-exploits-destroy-themselves/25348
- desc: |
  セッション中に参加者が自身の選択を変更できる特性を指します。これにより、投票の買い占めにおいて、買い手が最終的な投票結果を保証できないため、不正な取引を抑制する効果があります。

## L0 behavioral biometrics
- ja: L0行動生体認証
- related: [keystroke dynamics, Sybil attack]
- auto_added: 2026-07-03
- auto_source_topic_id: 25348
- auto_source_url: https://ethresear.ch/t/designing-infrastructure-where-exploits-destroy-themselves/25348
- desc: |
  プロトコルの最も基盤となるL0層で、ユーザーの行動パターン（例：キーストロークダイナミクス）に基づいて本人認証を行う技術です。Sybil攻撃対策として、大量の合成されたアイデンティティをフィルタリングするのに役立ちます。

## SPREAD
- ja: SPREAD (Secure Peer-to-Peer Relay for Efficient Anonymous Dissemination)
- aliases: [Secure Peer-to-Peer Relay for Efficient Anonymous Dissemination]
- related: [GossipSub, Dandelion++]
- auto_added: 2026-07-03
- auto_source_topic_id: 25343
- auto_source_url: https://ethresear.ch/t/spread-extending-gossipsub-with-efficient-anonymous-dissemination/25343
- desc: |
  EthereumのGossipSubプロトコルを拡張し、メッセージ送信者の匿名性を高めつつ、メッセージ伝播効率を向上させるための新しいゴシッププロトコル。ローカルなランダムウォークと地理的に指向された伝播を組み合わせる。

## Sender deanonymization
- ja: 送信者匿名性解除
- aliases: [deanonymization]
- related: [Timing-based attack, Censorship resistance]
- auto_added: 2026-07-03
- auto_source_topic_id: 25343
- auto_source_url: https://ethresear.ch/t/spread-extending-gossipsub-with-efficient-anonymous-dissemination/25343
- desc: |
  P2Pネットワークにおいて、メッセージの送信元を特定する行為。GossipSubのようなプロトコルでは、メッセージのタイミング観測を通じて攻撃者が送信者を特定し、標的型攻撃を行う可能性がある。

## Curious Nodes
- ja: 好奇心旺盛なノード (Honest-but-Curious Observers)
- aliases: [Honest-but-Curious Observers]
- related: [Adversary model, Deanonymization]
- auto_added: 2026-07-03
- auto_source_topic_id: 25343
- auto_source_url: https://ethresear.ch/t/spread-extending-gossipsub-with-efficient-anonymous-dissemination/25343
- desc: |
  プロトコルを正しく実行するが、観測されたトラフィックパターンから追加情報（例：メッセージの送信元）を推測しようとするノード。匿名性攻撃の評価によく用いられる特定の敵対者モデル。

## Timing-based attack
- ja: タイミングベース攻撃
- related: [Sender deanonymization, Eclipse attack]
- auto_added: 2026-07-03
- auto_source_topic_id: 25343
- auto_source_url: https://ethresear.ch/t/spread-extending-gossipsub-with-efficient-anonymous-dissemination/25343
- desc: |
  メッセージの伝播タイミングを観測・相関させることで、メッセージの送信元やネットワーク内のノードの身元を特定しようとする攻撃。GossipSubの匿名性解除に利用され、ブロックチェーンのバリデーター匿名性に影響を与える。

## Intra-cluster communication
- ja: クラスター内通信
- related: [Inter-cluster communication, Cluster]
- auto_added: 2026-07-03
- auto_source_topic_id: 25343
- auto_source_url: https://ethresear.ch/t/spread-extending-gossipsub-with-efficient-anonymous-dissemination/25343
- desc: |
  SPREADプロトコルにおいて、仮想座標空間で地理的に近いノードのグループ（クラスター）内で行われるメッセージ伝播。匿名性を確保するためのランダムウォークに利用され、低遅延が特徴。

## titled asset infrastructure
- ja: 権利証付き資産インフラ
- related: [RWA, tokenisation]
- auto_added: 2026-07-03
- auto_source_topic_id: 28913
- auto_source_url: https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913
- desc: |
  法的権利証（タイトル）が存在する不動産や天然資源権などの資産をブロックチェーン上で扱うためのインフラ。既存のERC標準ではカバーしきれない、資産とトークンの構造的結合、文書バンドルの確定的コミットメント、移転ドメインルールなどを標準化することを目指す。

## Asset Anchor Registry
- ja: 資産アンカーレジストリ
- related: [titled asset infrastructure, tokenisation]
- auto_added: 2026-07-03
- auto_source_topic_id: 28913
- auto_source_url: https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913
- desc: |
  資産とトークンを結合するためのレジストリ。特定のアンカーを(token, bindingScope, tokenId)タプルにリンクし、法的根拠と証拠のコミットメントを分離する。資産とトークンのバインディングを照会可能にし、構造的に検証可能にすることを目的とする。

## Canonical Document Bundle Anchor
- ja: 規範的文書バンドルアンカー
- related: [titled asset infrastructure]
- auto_added: 2026-07-03
- auto_source_topic_id: 28913
- auto_source_url: https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913
- desc: |
  オフチェーン文書セットを記述するマニフェストの確定的コミットメント。正規化された文書表現、規範的なエントリフィールド、順序付けルール、スキーマバージョンが同じであれば、互換性のある実装が同じバンドルハッシュを導出する。

## Directional Transfer Domain Registry
- ja: 方向性移転ドメインレジストリ
- related: [titled asset infrastructure, transfer controls]
- auto_added: 2026-07-03
- auto_source_topic_id: 28913
- auto_source_url: https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913
- desc: |
  資産クラスについて、2つのドメイン間の移転が許可されているかどうかを定義するコリドーレベルのルールを管理するレジストリ。移転の方向性があり、逆方向の許可には別途登録が必要。

## Subject-Linked NAV Snapshot Oracle
- ja: 主体リンク型NAVスナップショットオラクル
- related: [titled asset infrastructure, NAV, publication staleness, valuation staleness]
- auto_added: 2026-07-03
- auto_source_topic_id: 28913
- auto_source_url: https://ethereum-magicians.org/t/proposing-a-family-of-candidate-erc-interfaces-for-titled-asset-infrastructure-architecture-review/28913
- desc: |
  明示的な根拠、通貨、プロバイダーの帰属、修正チェーン、および2つの独立した陳腐化チェック（公開陳腐化と評価陳腐化）を備えた、主体キー付きのNAV（純資産価値）レポートを提供するオラクル。

## Multi-block Access List Warming
- ja: マルチブロック・アクセスリスト・ウォーミング
- related: [Access List, State Warming, EIP-2930, Gas Cost]
- auto_added: 2026-07-03
- auto_source_topic_id: 28912
- auto_source_url: https://ethereum-magicians.org/t/eip-8289-multi-block-access-list-warming/28912
- desc: |
  複数のブロックにわたって状態アクセスリストの「ウォーミング」効果を維持するメカニズム。これにより、トランザクションが将来のブロックでアクセスする状態に対して、事前にガス料金を支払うことで、その後のブロックでのガス料金を削減できる可能性がある。EIP-8289で提案されている。

## ReceiptOS
- ja: ReceiptOS (検証可能なエージェント実行のためのポータブルな証明基盤)
- related: [verifiable agent execution, Evidence Capsule Model, recomputable receipt]
- auto_added: 2026-07-03
- auto_source_topic_id: 28900
- auto_source_url: https://ethereum-magicians.org/t/receiptos-a-portable-proof-substrate-for-verifiable-agent-execution/28900
- desc: |
  エージェントの実行を検証可能にするためのポータブルな証明基盤。エージェントのアクションをキャプチャし、正規化して外部にアンカーすることで、信頼不要な検証を可能にする。

## verifiable agent execution
- ja: 検証可能なエージェント実行
- related: [ReceiptOS, agent action, recomputable receipt]
- auto_added: 2026-07-03
- auto_source_topic_id: 28900
- auto_source_url: https://ethereum-magicians.org/t/receiptos-a-portable-proof-substrate-for-verifiable-agent-execution/28900
- desc: |
  エージェントが行ったアクションが、そのエージェントを生成したシステムを信頼することなく、独立して検証可能であること。ReceiptOSはこの問題の解決を目指す。

## agent action
- ja: エージェントアクション
- related: [verifiable agent execution, Evidence Capsule]
- auto_added: 2026-07-03
- auto_source_topic_id: 28900
- auto_source_url: https://ethereum-magicians.org/t/receiptos-a-portable-proof-substrate-for-verifiable-agent-execution/28900
- desc: |
  自律エージェントによって実行される単一の操作や活動。ReceiptOSでは、このエージェントアクションごとに検証可能なレシートを生成する。

## Evidence Capsule Model
- ja: エビデンスカプセルモデル
- related: [ReceiptOS, Evidence Capsule, recomputable receipt]
- auto_added: 2026-07-03
- auto_source_topic_id: 28900
- auto_source_url: https://ethereum-magicians.org/t/receiptos-a-portable-proof-substrate-for-verifiable-agent-execution/28900
- desc: |
  ReceiptOSが採用する、エージェントアクションの検証可能性を確保するためのアーキテクチャモデル。アクションのキャプチャ、正規化、アンカー、検証の4つのステップで構成される。

## Evidence Capsule
- ja: エビデンスカプセル
- aliases: [capsule]
- related: [Evidence Capsule Model, recomputable receipt, agent action]
- auto_added: 2026-07-03
- auto_source_topic_id: 28900
- auto_source_url: https://ethereum-magicians.org/t/receiptos-a-portable-proof-substrate-for-verifiable-agent-execution/28900
- desc: |
  エージェントアクションとその入出力をキャプチャし、正規化された形式で格納するデータ構造。このカプセルからハッシュを再計算し、外部アンカーと照合することでアクションの検証が可能となる。

## Distributed Validator Technology
- ja: 分散型バリデータ技術 (DVT)
- aliases: [DVT]
- related: [Validator, Staking]
- auto_added: 2026-07-04
- auto_source_topic_id: 25353
- auto_source_url: https://ethresear.ch/t/in-protocol-client-data-reporting/25353
- desc: |
  複数の独立したノードが協力して単一のバリデータキーを運用し、バリデータの分散化と耐障害性を高める技術です。単一障害点のリスクを軽減し、ネットワークの堅牢性を向上させることを目的としています。

## Zero-Knowledge Consensus Layer
- ja: ゼロ知識コンセンサス層 (zkCL)
- aliases: [zkCL]
- related: [Zero-Knowledge Proof, Consensus Layer]
- auto_added: 2026-07-04
- auto_source_topic_id: 25353
- auto_source_url: https://ethresear.ch/t/in-protocol-client-data-reporting/25353
- desc: |
  ゼロ知識証明技術をコンセンサス層に統合する概念です。これにより、バリデータが自身の状態や行動を公開することなく、プロトコルルールに従っていることを証明できるようになり、プライバシーと効率が向上する可能性があります。

## In-Protocol Client Reporting
- ja: プロトコル内クライアント報告
- related: [Client Diversity, Network Resilience]
- auto_added: 2026-07-04
- auto_source_topic_id: 25353
- auto_source_url: https://ethresear.ch/t/in-protocol-client-data-reporting/25353
- desc: |
  Ethereumのプロトコル自体にクライアントの種類や設定に関する情報を報告する仕組みを組み込むことです。ネットワークのクライアント多様性を監視し、潜在的な集中化リスクやバグの影響を評価するために提案されています。

## Graffiti Watermark
- ja: グラフィティ・ウォーターマーク
- related: [Graffiti, Client Reporting]
- auto_added: 2026-07-04
- auto_source_topic_id: 25353
- auto_source_url: https://ethresear.ch/t/in-protocol-client-data-reporting/25353
- desc: |
  Ethereumのブロック提案時にバリデータが設定できる「グラフィティ」フィールドを利用して、使用しているクライアント情報を埋め込む手法です。クライアント多様性を追跡する初期の試みの一つですが、標準化されておらず、他の情報と競合する可能性があります。

## Priority Update Registry
- ja: プライオリティ更新レジストリ (PUR)
- aliases: [PUR]
- related: [PropAMMs, block producers]
- auto_added: 2026-07-04
- auto_source_topic_id: 28921
- auto_source_url: https://ethereum-magicians.org/t/erc-priority-update-registry-pur/28921
- desc: |
  他のコントラクトが所有する小さなステートを保持する単一の共有コントラクト。オフチェーンのアップデーターがステートを書き込み、所有コントラクトのみが他のトランザクション呼び出し中にそれを読み戻す。ブロックプロデューサーが特定のトランザクション（更新）を優先することを容易にする。

## PropAMMs
- ja: PropAMM (プロップAMM)
- related: [AMM, Priority Update Registry]
- auto_added: 2026-07-04
- auto_source_topic_id: 28921
- auto_source_url: https://ethereum-magicians.org/t/erc-priority-update-registry-pur/28921
- desc: |
  ブロックプロデューサーによる特定のトランザクション（更新）の優先順位付けから恩恵を受ける、特定の種類の自動マーケットメーカー。Priority Update Registry (PUR) の主要な動機付けとなるユースケース。

## commutative tier
- ja: 可換ティア
- related: [transaction ordering]
- auto_added: 2026-07-04
- auto_source_topic_id: 28921
- auto_source_url: https://ethereum-magicians.org/t/erc-priority-update-registry-pur/28921
- desc: |
  ブロック内の他の要素に依存してはならない更新のための、トランザクションの順序付けにおける特定のカテゴリ。このティアに属する更新は、ブロック内の他のトランザクションの実行順序に関わらず、同じ結果をもたらすことが期待される。

## Source-Token Agent Binding
- ja: ソーストークン・エージェントバインディング
- related: [ERC-8004, ERC-8217, Agent NFT Identity Bindings, Token Bound Account]
- auto_added: 2026-07-04
- auto_source_topic_id: 28920
- auto_source_url: https://ethereum-magicians.org/t/source-token-agent-binding-for-erc-8004/28920
- desc: |
  エージェント（スマートアカウントやNFT）が、その起源となるソーストークンに紐付けられるメカニズム。エージェントの不変な来歴（provenance）と、ソーストークンの現在の所有権という可変な事実を明確に分離して管理する。

## Permanent Provenance
- ja: 永続的な来歴
- related: [Source-Token Agent Binding]
- auto_added: 2026-07-04
- auto_source_topic_id: 28920
- auto_source_url: https://ethereum-magicians.org/t/source-token-agent-binding-for-erc-8004/28920
- desc: |
  エージェントがどのソーストークンから派生したかを示す、不変の記録。一度設定されると変更されず、エージェントの起源を恒久的に追跡可能にする。

## Function Selector
- ja: 関数セレクター
- related: [ERC-165, EVM]
- auto_added: 2026-07-04
- auto_source_topic_id: 28920
- auto_source_url: https://ethereum-magicians.org/t/source-token-agent-binding-for-erc-8004/28920
- desc: |
  Ethereum Virtual Machine (EVM) において、スマートコントラクトの特定の関数を識別するために使用される4バイトのハッシュ値。関数のシグネチャ（名前と引数の型）のKeccak-256ハッシュの最初の4バイトから生成される。

## TBA Custody Pattern
- ja: TBAカストディパターン (Token Bound Account Custody Pattern)
- aliases: [Token Bound Account Custody Pattern]
- related: [Token Bound Account, ERC-6551]
- auto_added: 2026-07-04
- auto_source_topic_id: 28920
- auto_source_url: https://ethereum-magicians.org/t/source-token-agent-binding-for-erc-8004/28920
- desc: |
  Token Bound Account (TBA) が、そのバインド元となるNFT（ソーストークン）を自身で保有する、または管理する特定の所有権パターン。エージェントがソーストークンの所有者である場合に、従来の ownerOf チェックとは異なる検証ロジックを必要とする。

## Regulated Asset Claim
- ja: 規制資産クレーム
- related: [ERC-8320, on-chain assets, verifiable claims]
- auto_added: 2026-07-04
- auto_source_topic_id: 28919
- auto_source_url: https://ethereum-magicians.org/t/erc-8320-regulated-asset-claim/28919
- desc: |
  オンチェーン資産に関する検証可能なクレームのためのレジストリ標準を提案するERC-8320の主要概念です。資産の価値、裏付け、コンプライアンスなどの情報を機械が検証できる形式で定義し、従来のPDFベースの情報を代替します。

## claim types
- ja: クレームタイプ
- related: [Regulated Asset Claim, ERC-8320]
- auto_added: 2026-07-04
- auto_source_topic_id: 28919
- auto_source_url: https://ethereum-magicians.org/t/erc-8320-regulated-asset-claim/28919
- desc: |
  ERC-8320で定義される、資産に関するクレームのカテゴリです。IDENTITY、VALUATION、MANDATE、TERMS、COMPLIANCE、BACKING、EVENT、RISKの8種類があり、それぞれ異なる種類の情報を表現します。

## Maker-checker (on-chain)
- ja: メイカーチェッカー（オンチェーン）
- related: [AUTHOR, VALIDATOR, ACTIVATOR, Regulated Asset Claim]
- auto_added: 2026-07-04
- auto_source_topic_id: 28919
- auto_source_url: https://ethereum-magicians.org/t/erc-8320-regulated-asset-claim/28919
- desc: |
  ERC-8320におけるクレーム管理のプロセスで、提案者（AUTHOR）と検証者（VALIDATOR）の役割を分離します。これにより、職務分掌がオンチェーンで強制され、クレームのライフサイクル（PROPOSED, VALID, ACTIVE, EXPIRED, REVOKED）が管理されます。

## IRegistryAnchor
- ja: IRegistryAnchor（インターフェース）
- related: [Regulated Asset Claim, registry admin]
- auto_added: 2026-07-04
- auto_source_topic_id: 28919
- auto_source_url: https://ethereum-magicians.org/t/erc-8320-regulated-asset-claim/28919
- desc: |
  ERC-8320において、資産が自身が認識するレジストリを承認するために実装できるインターフェースです。これにより、資産はどのレジストリからのクレームを受け入れるかを指定し、信頼の方向性を確立できます。

## verifiable claims
- ja: 検証可能なクレーム
- related: [Regulated Asset Claim, on-chain assets]
- auto_added: 2026-07-04
- auto_source_topic_id: 28919
- auto_source_url: https://ethereum-magicians.org/t/erc-8320-regulated-asset-claim/28919
- desc: |
  資産に関する署名され、バージョン管理され、ハッシュでアンカーされたステートメントです。機械がその真実性を検証できる形式で提供され、従来のオフチェーン文書に依存する情報管理のギャップを埋めます。

## Regulatory Compliance Protocol
- ja: 規制コンプライアンスプロトコル (RCP)
- aliases: [RCP]
- related: [action taxonomy, minimal enforcement primitives, regulatory state machine]
- auto_added: 2026-07-04
- auto_source_topic_id: 28917
- auto_source_url: https://ethereum-magicians.org/t/erc-8319-regulatory-compliance-protocol/28917
- desc: |
  トークン化された資産に対する規制執行措置に明示的な法的効果を割り当てるための共有定義レイヤー。ERC-8319として提案されており、標準、ツール、監査人が参照できる中立的で恒久的な規制参照を提供する。

## action taxonomy
- ja: アクション分類体系
- related: [Regulatory Compliance Protocol, regulatory actions]
- auto_added: 2026-07-04
- auto_source_topic_id: 28917
- auto_source_url: https://ethereum-magicians.org/t/erc-8319-regulatory-compliance-protocol/28917
- desc: |
  Regulatory Compliance Protocol (RCP)内で定義される、トークン化された資産に対する規制執行措置の分類システム。FREEZE, SEIZE, CONFISCATE, LIQUIDATE, RESTRICT, RECOVERの6つのアクションから構成され、それぞれ可逆性、所有権への影響、最終性によって定義される。

## regulatory state machine
- ja: 規制状態機械
- related: [Regulatory Compliance Protocol, action taxonomy]
- auto_added: 2026-07-04
- auto_source_topic_id: 28917
- auto_source_url: https://ethereum-magicians.org/t/erc-8319-regulatory-compliance-protocol/28917
- desc: |
  Regulatory Compliance Protocol (RCP)のアクションセマンティクスを形式的に検証するために使用される状態機械モデル。Isabelle/HOLで機械的にチェックされ、規制アクション間の有効な状態遷移と、CONFISCATED状態の特性（終端性、普遍的到達性）を証明する。

## minimal enforcement primitives
- ja: 最小限の執行プリミティブ
- related: [forcedTransfer, Regulatory Compliance Protocol]
- auto_added: 2026-07-04
- auto_source_topic_id: 28917
- auto_source_url: https://ethereum-magicians.org/t/erc-8319-regulatory-compliance-protocol/28917
- desc: |
  ERC-7943の`forcedTransfer`のように、トークン化された資産に対する執行措置を実行するが、その法的動機や効果を明示的に定義しない基本的な機能。Regulatory Compliance Protocol (RCP)は、これらのプリミティブに欠けている法的効果の語彙を提供する。

## reversibility ladder
- ja: 可逆性ラダー
- related: [action taxonomy, Regulatory Compliance Protocol]
- auto_added: 2026-07-04
- auto_source_topic_id: 28917
- auto_source_url: https://ethereum-magicians.org/t/erc-8319-regulatory-compliance-protocol/28917
- desc: |
  Regulatory Compliance Protocol (RCP)の行動分類において、規制執行措置の可逆性の度合いを示す概念。一時的なFREEZEと不可逆的なCONFISCATEのように、構造的に異なる法的効果を持つアクションを区別する。

## Goldilocks field
- ja: ゴールディロックス体 (Goldilocks field)
- aliases: [G64]
- related: [STARK, NTT, Plonky2]
- auto_added: 2026-07-05
- auto_source_topic_id: 25359
- auto_source_url: https://ethresear.ch/t/qingming-g64-ntt-native-goldilocks-g64-gpu-ntt-at-2-27-on-rx-7900-xtx-and-a-reproducible-benchmark-plan/25359
- desc: |
  zk-STARKsやFRIプロトコルなどのゼロ知識証明システムで計算に使用される特定の有限体です。特にPlonky2のようなシステムで効率的な演算を可能にするために設計されており、p = 2^64 - 2^32 + 1というモジュラスを持ちます。

## Number Theoretic Transform
- ja: 数論変換 (NTT)
- aliases: [NTT]
- related: [STARK, FRI, Goldilocks field]
- auto_added: 2026-07-05
- auto_source_topic_id: 25359
- auto_source_url: https://ethresear.ch/t/qingming-g64-ntt-native-goldilocks-g64-gpu-ntt-at-2-27-on-rx-7900-xtx-and-a-reproducible-benchmark-plan/25359
- desc: |
  巡回畳み込みを高速に計算するためのアルゴリズムで、多項式の乗算を効率化するために使用されます。特にゼロ知識証明システム（STARKsなど）において、有限体上での多項式演算の高速化に不可欠な技術です。

## STARK
- ja: STARK (スケーラブルで透過的な知識の引数)
- aliases: [Scalable Transparent ARgument of Knowledge]
- related: [ZKP, FRI, LDE, Plonky2]
- auto_added: 2026-07-05
- auto_source_topic_id: 25359
- auto_source_url: https://ethresear.ch/t/qingming-g64-ntt-native-goldilocks-g64-gpu-ntt-at-2-27-on-rx-7900-xtx-and-a-reproducible-benchmark-plan/25359
- desc: |
  ゼロ知識証明（ZKP）の一種で、証明サイズが検証される計算のサイズに対して対数的にしか増加しないスケーラビリティと、信頼できるセットアップが不要な透過性を特徴とします。Ethereumのスケーリングソリューションとして注目されています。

## Low Degree Extension
- ja: 低次数拡張 (LDE)
- aliases: [LDE]
- related: [STARK, FRI]
- auto_added: 2026-07-05
- auto_source_topic_id: 25359
- auto_source_url: https://ethresear.ch/t/qingming-g64-ntt-native-goldilocks-g64-gpu-ntt-at-2-27-on-rx-7900-xtx-and-a-reproducible-benchmark-plan/25359
- desc: |
  STARKsやFRIプロトコルにおいて、ある多項式をより大きなドメインに拡張し、その拡張された多項式が元の多項式と同じ低次数性を持つことを検証するプロセスです。これにより、証明の健全性が保証されます。

## Fast Reed-Solomon Interactive Oracle Proofs of Proximity
- ja: 高速リード・ソロモン対話型近接性オラクル証明 (FRI)
- aliases: [FRI]
- related: [STARK, LDE]
- auto_added: 2026-07-05
- auto_source_topic_id: 25359
- auto_source_url: https://ethresear.ch/t/qingming-g64-ntt-native-goldilocks-g64-gpu-ntt-at-2-27-on-rx-7900-xtx-and-a-reproducible-benchmark-plan/25359
- desc: |
  STARKsの主要な構成要素であり、多項式が特定の低次数を持つことを効率的に証明するためのプロトコルです。多項式の低次数性を繰り返し検証することで、証明のサイズを大幅に削減し、スケーラビリティを向上させます。

## Hash-chain RANDAO
- ja: ハッシュチェーンRANDAO
- related: [RANDAO, BLS signatures, Beacon chain randomness]
- auto_added: 2026-07-06
- auto_source_topic_id: 28942
- auto_source_url: https://ethereum-magicians.org/t/hash-chain-randao/28942
- desc: |
  RANDAOの特定のバリアントで、BLS署名への直接的な依存を排除し、ハッシュチェーンを利用してビーコンチェーンのランダム性を生成するメカニズムです。これにより、プロトコルの複雑性を軽減し、潜在的な攻撃ベクトルを減らすことを目指します。

## Beacon chain randomness
- ja: ビーコンチェーンのランダム性
- related: [RANDAO, Beacon Chain]
- auto_added: 2026-07-06
- auto_source_topic_id: 28942
- auto_source_url: https://ethereum-magicians.org/t/hash-chain-randao/28942
- desc: |
  Ethereumのコンセンサス層であるビーコンチェーンによって生成されるランダムな値。これは、プロポーザの選択、シャードの割り当て、その他のプロトコル機能に不可欠です。その生成方法のセキュリティと予測不可能性は、ネットワーク全体の健全性に影響を与えます。

## NAV basis
- ja: NAV基準 (NAV basis)
- related: [Net Asset Value, Oracle]
- auto_added: 2026-07-06
- auto_source_topic_id: 28939
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-nav-snapshot-oracle-candidate-erc/28939
- desc: |
  ネットアセットバリュー（NAV）の計算方法を定義する設定です。このERCでは、ストリームレベルで「単位あたり」「シェアまたはトークンあたり」「総資産価値」のいずれかを設定し、異なる計算方法のデータが混在するのを防ぎます。

## Linear correction chain
- ja: 線形訂正チェーン (Linear correction chain)
- aliases: [linear corrections]
- related: [Administrative invalidation, Data integrity]
- auto_added: 2026-07-06
- auto_source_topic_id: 28939
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-nav-snapshot-oracle-candidate-erc/28939
- desc: |
  過去のデータスナップショットを修正するためのメカニズムです。これにより、元のデータとその後の修正が時系列に沿って追跡可能となり、データの完全性と履歴の透明性が保たれます。

## Administrative invalidation
- ja: 管理的無効化 (Administrative invalidation)
- related: [Linear correction chain, Data integrity]
- auto_added: 2026-07-06
- auto_source_topic_id: 28939
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-nav-snapshot-oracle-candidate-erc/28939
- desc: |
  データの履歴を保持しつつ、特定のデータスナップショットを無効にするメカニズムです。特に、プロバイダーが侵害されたり利用不能になったりした場合に、不正なデータを修正せずに無効化し、直前の有効なスナップショットを復元するために使用されます。

## Deterministic lower median
- ja: 決定論的下位中央値 (Deterministic lower median)
- aliases: [lower median]
- related: [Aggregation, Oracle]
- auto_added: 2026-07-06
- auto_source_topic_id: 28939
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-nav-snapshot-oracle-candidate-erc/28939
- desc: |
  複数のプロバイダーから提出された値を集約する際に使用される特定のルールです。値を共通の小数点精度に正規化した後、決定論的に下位中央値を計算することで、単一の集約値を導出します。

## Executable market price
- ja: 実行可能な市場価格 (Executable market price)
- related: [Reported NAV, Oracle]
- auto_added: 2026-07-06
- auto_source_topic_id: 28939
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-nav-snapshot-oracle-candidate-erc/28939
- desc: |
  オンチェーンでの取引や決済に直接使用できる市場価格を指します。これは、情報提供を目的とする「報告されたNAV」とは対照的な概念であり、オラクルの出力が持つ機能的な違いを明確にします。

## Subject-Linked Impact Snapshot Log
- ja: 主題紐付けインパクトスナップショットログ (ERC)
- auto_added: 2026-07-06
- auto_source_topic_id: 28938
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-impact-snapshot-log-candidate-erc/28938
- desc: |
  アプリケーション定義の主題、指標、測定期間、単位、および手法に紐付けられた、追記専用の定量的インパクトスナップショットを記録するための候補ERC。過去の主張を消去することなく、新しい報告期間や以前の期間への修正を区別できる。

## Methodology Transition
- ja: メソドロジー移行
- related: [Methodology-Versioning Interface]
- auto_added: 2026-07-06
- auto_source_topic_id: 28938
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-impact-snapshot-log-candidate-erc/28938
- desc: |
  オンチェーンで定義された測定手法（メソドロジー）が、新しいバージョンや異なる手法に切り替わるプロセス。通常、特定のスケジュール（例：序数ベース）に従って行われる。

## Correction Provenance
- ja: 修正履歴 (Correction Provenance)
- auto_added: 2026-07-06
- auto_source_topic_id: 28938
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-impact-snapshot-log-candidate-erc/28938
- desc: |
  オンチェーンデータ、特にインパクトスナップショットに対する修正の起源と履歴を追跡するメカニズム。これにより、どの修正がいつ、誰によって行われたかを検証できる。

## Methodology-Versioning Interface
- ja: メソドロジーバージョン管理インターフェース
- related: [Methodology Transition]
- auto_added: 2026-07-06
- auto_source_topic_id: 28938
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-impact-snapshot-log-candidate-erc/28938
- desc: |
  今後のスナップショットに適用されるアクティブなメソドロジーを公開し、即時または序数ベースでスケジュールされたメソドロジーの変更（supersession）をサポートするインターフェース。メソドロジーの進化を管理する。

## Ordinal-Scheduled Supersession
- ja: 序数スケジュールによる置換 (Ordinal-Scheduled Supersession)
- related: [Methodology Transition]
- auto_added: 2026-07-06
- auto_source_topic_id: 28938
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-impact-snapshot-log-candidate-erc/28938
- desc: |
  タイムスタンプではなく、序数（シーケンス番号）に基づいて、あるメソドロジーが別のメソドロジーに置き換えられる（supersedeされる）ことをスケジュールする方式。ブロックチェーンの決定論的な性質に適している。

## Subject-Linked Compliance Event Log
- ja: 主体紐付け型コンプライアンスイベントログ
- related: [Compliance Event, Correction Chain]
- auto_added: 2026-07-06
- auto_source_topic_id: 28937
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-compliance-event-log-candidate-erc/28937
- desc: |
  特定の主体（トークン、アドレス、資産など）に関連付けられ、追記専用のコンプライアンスイベント記録を管理するためのERC候補インターフェース。属性、証拠コミットメント、型付けされた関係者、バージョン管理されたペイロード、インデックス、および修正履歴をサポートします。

## Correction Chain
- ja: 修正チェーン
- related: [Single-successor correction chain, Competing correction branches]
- auto_added: 2026-07-06
- auto_source_topic_id: 28937
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-compliance-event-log-candidate-erc/28937
- desc: |
  過去の記録に対する修正イベントが、その修正対象の記録にリンクされ、一連の連鎖を形成する仕組み。各イベントは後続の修正イベントへのポインタを持つことで、完全な履歴を保持します。

## Single-successor correction chain
- ja: 単一後続修正チェーン
- related: [Correction Chain, Competing correction branches]
- auto_added: 2026-07-06
- auto_source_topic_id: 28937
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-compliance-event-log-candidate-erc/28937
- desc: |
  修正チェーンにおいて、各イベントが最大で1つの後続の修正イベントのみを持つことを強制する設計。これにより修正の分岐（フォーク）を防ぎ、履歴の一貫性を保ちます。

## Competing correction branches
- ja: 競合する修正ブランチ
- related: [Correction Chain, Single-successor correction chain]
- auto_added: 2026-07-06
- auto_source_topic_id: 28937
- auto_source_url: https://ethereum-magicians.org/t/subject-linked-compliance-event-log-candidate-erc/28937
- desc: |
  修正チェーンの設計において、あるイベントに対して複数の異なる修正イベントが存在し、それぞれが独立した修正履歴の分岐を形成する可能性のある状態。単一後続修正チェーンとは対照的なアプローチです。

## Opaque Domain
- ja: 不透明ドメイン (Opaque Domain)
- related: [Directional Transfer Domain Registry, Asset Class]
- auto_added: 2026-07-06
- auto_source_topic_id: 28936
- auto_source_url: https://ethereum-magicians.org/t/directional-transfer-domain-registry-candidate-erc/28936
- desc: |
  Directional Transfer Domain Registryにおいて、管轄区域、規制された場所、企業ネットワーク、ゲーム経済、DAOの財務境界など、アプリケーションによって定義される文脈を表す概念です。これらのドメインは、特定の分類法を規定せず、不透明な`bytes32`値として扱われます。

## Nonzero Evidence Commitment
- ja: ゼロでない証拠コミットメント (Nonzero Evidence Commitment)
- related: [Directional Transfer Domain Registry, Graceful Revocation]
- auto_added: 2026-07-06
- auto_source_topic_id: 28936
- auto_source_url: https://ethereum-magicians.org/t/directional-transfer-domain-registry-candidate-erc/28936
- desc: |
  Directional Transfer Domain Registryのコアインターフェースでサポートされる機能の一つで、ルートの決定（許可や取り消し）の背後にある証拠や正当性をコミットするメカニズムを指します。これにより、決定の透明性と説明責任が向上します。

## Graceful Revocation
- ja: グレースフル取り消し (Graceful Revocation)
- related: [Directional Transfer Domain Registry, Nonzero Evidence Commitment]
- auto_added: 2026-07-06
- auto_source_topic_id: 28936
- auto_source_url: https://ethereum-magicians.org/t/directional-transfer-domain-registry-candidate-erc/28936
- desc: |
  Directional Transfer Domain Registryにおける、時間ベースで将来的に有効となる取り消しメカニズムです。即時取り消しとは異なり、開始、キャンセル、将来の有効性、および最終化のライフサイクルをサポートします。

## Asset Class
- ja: 資産クラス (Asset Class)
- related: [Directional Transfer Domain Registry, Opaque Domain]
- auto_added: 2026-07-06
- auto_source_topic_id: 28936
- auto_source_url: https://ethereum-magicians.org/t/directional-transfer-domain-registry-candidate-erc/28936
- desc: |
  Directional Transfer Domain Registryにおいて、転送ルートの許可を定義する際の主要な識別子の一つです。特定の資産の種類を指し、同じドメインペアでも異なる資産クラスに対して異なる転送許可を設定できます。

## Normalization Profile
- ja: 正規化プロファイル
- related: [Canonical Document Bundle Anchor, Manifest]
- auto_added: 2026-07-06
- auto_source_topic_id: 28935
- auto_source_url: https://ethereum-magicians.org/t/canonical-document-bundle-anchor-candidate-erc/28935
- desc: |
  オフチェーン文書を標準的なバイト列に変換するためのルールセット。これにより、異なる実装間での文書の解釈の不一致を防ぎ、バンドルの相互運用性を確保する。

## Manifest
- ja: マニフェスト
- related: [Canonical Document Bundle Anchor, Normalization Profile, DocumentEntry]
- auto_added: 2026-07-06
- auto_source_topic_id: 28935
- auto_source_url: https://ethereum-magicians.org/t/canonical-document-bundle-anchor-candidate-erc/28935
- desc: |
  正規化された文書のコミットメントを記述し、順序付け、ハッシュ化するデータ構造。各エントリは文書のハッシュ、役割、MIMEタイプ、ファイル名、正規化プロファイルIDを含む。

## (subjectId, role) slot
- ja: (subjectId, role) スロット
- related: [Canonical Document Bundle Anchor, Supersession]
- auto_added: 2026-07-06
- auto_source_topic_id: 28935
- auto_source_url: https://ethereum-magicians.org/t/canonical-document-bundle-anchor-candidate-erc/28935
- desc: |
  文書バンドルをオンチェーンでアンカーするための特定の識別子とメカニズム。各スロットは特定の主題と役割に関連付けられ、一度に1つのアクティブなバンドルのみを保持できる。

## Bundle Hash
- ja: バンドルハッシュ
- related: [Canonical Document Bundle Anchor, Manifest]
- auto_added: 2026-07-06
- auto_source_topic_id: 28935
- auto_source_url: https://ethereum-magicians.org/t/canonical-document-bundle-anchor-candidate-erc/28935
- desc: |
  マニフェスト内のすべての文書エントリを特定のバージョン付きスキーマ識別子のもとでハッシュ化して生成される、単一の32バイトのコミットメント。文書バンドル全体の決定論的な表現となる。

## Binding
- ja: バインディング
- aliases: [token-to-anchor binding, contract binding, token-ID binding]
- related: [Asset Anchor Registry]
- auto_added: 2026-07-06
- auto_source_topic_id: 28934
- auto_source_url: https://ethereum-magicians.org/t/asset-anchor-registry-interface-candidate-erc/28934
- desc: |
  トークンコントラクトまたは個別のトークンIDを、オフチェーン資産に関するクレームを表すレジストリレコードに紐付ける行為。このERCの主要な概念であり、トークンとオフチェーン資産の関連付けを確立する。

## legalHash
- ja: legalHash (法的ハッシュ)
- related: [evidenceHash, anchorId]
- auto_added: 2026-07-06
- auto_source_topic_id: 28934
- auto_source_url: https://ethereum-magicians.org/t/asset-anchor-registry-interface-candidate-erc/28934
- desc: |
  オフチェーン資産に関する法的クレームのコミットメントを表すハッシュ値。evidenceHashと共にanchorIdを決定するために使用される。

## evidenceHash
- ja: evidenceHash (証拠ハッシュ)
- related: [legalHash, anchorId]
- auto_added: 2026-07-06
- auto_source_topic_id: 28934
- auto_source_url: https://ethereum-magicians.org/t/asset-anchor-registry-interface-candidate-erc/28934
- desc: |
  オフチェーン資産に関する証拠のコミットメントを表すハッシュ値。legalHashと共にanchorIdを決定するために使用される。

## Domain-separated scopes
- ja: ドメイン分離スコープ
- related: [Binding]
- auto_added: 2026-07-06
- auto_source_topic_id: 28934
- auto_source_url: https://ethereum-magicians.org/t/asset-anchor-registry-interface-candidate-erc/28934
- desc: |
  バインディングがコントラクト全体に適用されるか、特定のトークンIDに適用されるかを明確に区別するための仕組み。これにより、異なるタイプのトークン（ERC-20、ERC-721など）に対するバインディングの曖昧さを解消する。

## Token-side interfaces
- ja: トークン側インターフェース
- related: [mutual declaration, Asset Anchor Registry]
- auto_added: 2026-07-06
- auto_source_topic_id: 28934
- auto_source_url: https://ethereum-magicians.org/t/asset-anchor-registry-interface-candidate-erc/28934
- desc: |
  トークン自身が、認識するレジストリとアンカーを宣言するために公開するインターフェース。これにより、コンシューマーはレジストリの記録とトークン自身の応答を比較し、相互宣言された関係を確認できる。

## Augmented Mechanism Design
- ja: 拡張メカニズム設計 (AMD)
- aliases: [AMD]
- related: [Mechanism Design, Structural Invariant, Economic Invariant, Temporal Invariant]
- auto_added: 2026-07-07
- auto_source_topic_id: 25379
- auto_source_url: https://ethresear.ch/t/augmented-mechanism-design-one-operator-every-substrate/25379
- desc: |
  既存のメカニズムの核となる特性を維持しつつ、既知の脆弱性を排除するために、境界のある数学的に強制された不変条件を追加する設計手法。管理者を導入せずにシステムの堅牢性を高めることを目的とする。

## Structural Invariant
- ja: 構造的不変条件
- related: [Augmented Mechanism Design, Economic Invariant, Temporal Invariant]
- auto_added: 2026-07-07
- auto_source_topic_id: 25379
- auto_source_url: https://ethresear.ch/t/augmented-mechanism-design-one-operator-every-substrate/25379
- desc: |
  悪意のある状態がシステム内で表現不可能になるようにする不変条件。例えば、一様清算価格は注文ごとの価格が存在しないため、注文ごとに操作されることがない。

## Economic Invariant
- ja: 経済的不変条件
- related: [Augmented Mechanism Design, Structural Invariant, Temporal Invariant]
- auto_added: 2026-07-07
- auto_source_topic_id: 25379
- auto_source_url: https://ethresear.ch/t/augmented-mechanism-design-one-operator-every-substrate/25379
- desc: |
  攻撃が経済的に不採算になるようにする不変条件。例えば、攻撃コストが利益を上回るように罰則（スラッシュ）を設けることで、攻撃を抑止する。

## Temporal Invariant
- ja: 時間的不変条件
- related: [Augmented Mechanism Design, Structural Invariant, Economic Invariant]
- auto_added: 2026-07-07
- auto_source_topic_id: 25379
- auto_source_url: https://ethresear.ch/t/augmented-mechanism-design-one-operator-every-substrate/25379
- desc: |
  時間的な制約を設けることで、特定の攻撃（例：フロントランニング）の優位性を排除する不変条件。コミット・アンド・リビールスキームなどがこれに該当する。

## Plutocratic Capture
- ja: 金権的支配 (Plutocratic Capture)
- related: [Stake-weighted Consensus, Anti-concentration Invariant, Consensus Layer]
- auto_added: 2026-07-07
- auto_source_topic_id: 25379
- auto_source_url: https://ethresear.ch/t/augmented-mechanism-design-one-operator-every-substrate/25379
- desc: |
  資本の重み付けされたコンセンサスシステムにおいて、十分な資本を持つアクターが単独でファイナライズを支配し、貢献が無視される状態。資本によるシステム乗っ取りを指し、分散化の原則に反する脆弱性の一つ。

## Consensus homogeneity
- ja: コンセンサス均一性
- related: [Data homogeneity, Execution homogeneity]
- auto_added: 2026-07-07
- auto_source_topic_id: 25374
- auto_source_url: https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374
- desc: |
  ブロックチェーンのコンセンサス層における均一性または同質性を指します。異なるシャードや実行環境間でのコンセンサスプロトコルの統一性を意味し、システム全体の整合性とシンプルさを保つ上で重要となります。

## Data homogeneity
- ja: データ均一性
- related: [Consensus homogeneity, Execution homogeneity, Data availability]
- auto_added: 2026-07-07
- auto_source_topic_id: 25374
- auto_source_url: https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374
- desc: |
  ブロックチェーンのデータ層における均一性または同質性を指します。特にデータ可用性（DA）レイヤーにおいて、異なるデータチャンクやシャード間でデータ構造やアクセス方法が統一されている状態を意味します。

## Sub-rooted execution
- ja: サブルート実行
- related: [Execution sharding, Execution layer]
- auto_added: 2026-07-07
- auto_source_topic_id: 25374
- auto_source_url: https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374
- desc: |
  実行環境がメインのコンセンサスルートとは異なる、独立した「サブルート」を持つアーキテクチャを指します。これにより、特定の実行ロジックや状態がメインチェーンから分離され、スケーラビリティやモジュール性が向上する可能性があります。

## Execution homogeneity
- ja: 実行均一性
- related: [Consensus homogeneity, Data homogeneity, Execution layer]
- auto_added: 2026-07-07
- auto_source_topic_id: 25374
- auto_source_url: https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374
- desc: |
  ブロックチェーンの実行層における均一性または同質性を指します。異なる実行環境やシャード間で、トランザクションの処理ロジックや仮想マシン（EVM）の動作が統一されている状態を意味し、開発の簡素化や互換性の向上に寄与します。

## Universal coordination tree
- ja: ユニバーサル調整ツリー
- related: [Execution trees, Sharding]
- auto_added: 2026-07-07
- auto_source_topic_id: 25374
- auto_source_url: https://ethresear.ch/t/lean-execution-a-holistic-approach-to-secure-efficient-adaptive-and-resourceful-execution-throughput-to-scale-the-world-computer/25374
- desc: |
  複数の実行シャードやコンポーネント間の調整と同期を可能にするための、普遍的なツリー構造を持つデータ構造またはプロトコルを指します。システム全体の状態整合性を維持し、分散された実行環境間の連携を効率化します。

## STARK-LDE NTT
- ja: STARK-LDE NTT (STARK低次拡張数論変換)
- related: [STARK, Low Degree Extension, Number Theoretic Transform]
- auto_added: 2026-07-07
- auto_source_topic_id: 25373
- auto_source_url: https://ethresear.ch/t/qingming-g64-ntt-cuda-rtx4090-24g-results-for-native-goldilocks-g64-stark-lde-ntt/25373
- desc: |
  STARK証明システムにおける低次拡張（LDE）と数論変換（NTT）を組み合わせた演算。STARKの健全性を保証するために多項式の評価点を効率的に計算する際に用いられます。

## domain_logn
- ja: ドメインの対数サイズ (domain_logn)
- related: [Number Theoretic Transform, Low Degree Extension]
- auto_added: 2026-07-07
- auto_source_topic_id: 25373
- auto_source_url: https://ethresear.ch/t/qingming-g64-ntt-cuda-rtx4090-24g-results-for-native-goldilocks-g64-stark-lde-ntt/25373
- desc: |
  数論変換（NTT）や低次拡張（LDE）において、演算が行われるドメインのサイズを2を底とする対数で表したもの。計算の複雑さやメモリ要件を示す指標となります。

## STARK-style LDE
- ja: STARK形式のLDE (STARK-style LDE)
- related: [STARK, Low Degree Extension]
- auto_added: 2026-07-07
- auto_source_topic_id: 25373
- auto_source_url: https://ethresear.ch/t/qingming-g64-ntt-cuda-rtx4090-24g-results-for-native-goldilocks-g64-stark-lde-ntt/25373
- desc: |
  STARK（Scalable Transparent ARgument of Knowledge）証明システムに特有の低次拡張（LDE）の適用方法。STARKのプロトコル要件に合わせて多項式の評価点を拡張する手法を指します。

## logical_logn
- ja: 論理ドメインの対数サイズ (logical_logn)
- related: [domain_logn, Low Degree Extension]
- auto_added: 2026-07-07
- auto_source_topic_id: 25373
- auto_source_url: https://ethresear.ch/t/qingming-g64-ntt-cuda-rtx4090-24g-results-for-native-goldilocks-g64-stark-lde-ntt/25373
- desc: |
  低次拡張（LDE）において、拡張前の元の多項式が定義される論理ドメインのサイズを2を底とする対数で表したもの。拡張後のドメインサイズ（domain_logn）と対比されます。

## single-slot finality
- ja: シングルスロットファイナリティ
- related: [finalization, slot]
- auto_added: 2026-07-07
- auto_source_topic_id: 25369
- auto_source_url: https://ethresear.ch/t/the-extremely-lean-chain/25369
- desc: |
  各スロットでブロックが即座にファイナライズされることを目指すEthereumのコンセンサスアップグレードの目標。これにより、トランザクションの確定性が大幅に向上する。

## deposit tree
- ja: デポジットツリー
- related: [Merkle tree, validator deposit]
- auto_added: 2026-07-07
- auto_source_topic_id: 25369
- auto_source_url: https://ethresear.ch/t/the-extremely-lean-chain/25369
- desc: |
  バリデータのデポジット情報が格納されるマークルツリー。バリデータの公開鍵や出金資格情報がこのツリーに記録される。

## end-of-epoch processing
- ja: エポック終了処理
- related: [epoch, beacon chain]
- auto_added: 2026-07-07
- auto_source_topic_id: 25369
- auto_source_url: https://ethresear.ch/t/the-extremely-lean-chain/25369
- desc: |
  Ethereumビーコンチェーンにおいて、各エポックの終わりに実行される、バリデータの報酬計算や状態更新などの集中的な処理。この処理はリソースを大量に消費する。

## leanWOTS
- ja: leanWOTS (署名アルゴリズム)
- related: [WOTS+, quantum-resistant signature]
- auto_added: 2026-07-07
- auto_source_topic_id: 25369
- auto_source_url: https://ethresear.ch/t/the-extremely-lean-chain/25369
- desc: |
  投稿で提案されている、量子耐性を持つ署名アルゴリズムの一種。バリデータの公開鍵を状態から削除し、署名に含めることで状態要件を削減する。

## balance update proof
- ja: 残高更新証明
- related: [STARK, validator state]
- auto_added: 2026-07-07
- auto_source_topic_id: 25369
- auto_source_url: https://ethresear.ch/t/the-extremely-lean-chain/25369
- desc: |
  バリデータが自身の参加状況をZK証明として提出し、それに基づいて残高を更新するメカニズム。ビーコンチェーンの状態遷移関数から報酬・ペナルティ処理を削除するために提案されている。

## Native UTXOs
- ja: ネイティブUTXO
- related: [UTXO, Frame Transactions]
- auto_added: 2026-07-07
- auto_source_topic_id: 25368
- auto_source_url: https://ethresear.ch/t/native-utxos-on-ethereum/25368
- desc: |
  EthereumにBitcoinのようなUTXOモデルを導入する提案。支払いワークロードにおいて永続的なステート使用量を大幅に削減し、アカウントモデルと共存可能。

## account leaf
- ja: アカウントリーフ
- related: [account model, state tree]
- auto_added: 2026-07-07
- auto_source_topic_id: 25368
- auto_source_url: https://ethresear.ch/t/native-utxos-on-ethereum/25368
- desc: |
  Ethereumのアカウントモデルにおいて、アドレスが初めてETHを受け取った際に作成される永続的なステート要素。アカウントの存在を示す。

## openings root
- ja: オープニングルート
- related: [UTXO, commitment tree]
- auto_added: 2026-07-07
- auto_source_topic_id: 25368
- auto_source_url: https://ethresear.ch/t/native-utxos-on-ethereum/25368
- desc: |
  EthereumのネイティブUTXOモデルにおいて、各ブロックで作成されたUTXOの「オープニング」（source, value, recipient）をハッシュ化したバイナリツリーのルート。UTXOの存在証明に用いられる。

## spent bit
- ja: 使用済みビット
- related: [UTXO, spent set]
- auto_added: 2026-07-07
- auto_source_topic_id: 25368
- auto_source_url: https://ethresear.ch/t/native-utxos-on-ethereum/25368
- desc: |
  EthereumのネイティブUTXOモデルにおいて、UTXOが使用済みであるか否かを示すためにステートに保持される単一のビット。二重支払いを防ぐためのメカニズム。

## value-conserving frame
- ja: 価値保存フレーム
- related: [Frame Transactions, EIP-8141]
- auto_added: 2026-07-07
- auto_source_topic_id: 25368
- auto_source_url: https://ethresear.ch/t/native-utxos-on-ethereum/25368
- desc: |
  EIP-8141のフレームの一種で、UTXOの入出力、アカウントフロー、ガス代を単一のトランジションにまとめ、価値の保存則を強制する。自己資金調達型支払いとトラストレスなスポンサーシップを可能にする。

## Searcher
- ja: サーチャー
- related: [MEV, Builder]
- auto_added: 2026-07-09
- auto_source_topic_id: 25400
- auto_source_url: https://ethresear.ch/t/builders-defection-and-incentive-compatibility/25400
- desc: |
  Ethereumなどのブロックチェーンにおいて、MEV（Maximal Extractable Value）の機会を特定し、それらを抽出するためのトランザクションバンドルを作成してビルダーに提出するエンティティ。

## Bundle
- ja: バンドル
- related: [Searcher, Builder, MEV]
- auto_added: 2026-07-09
- auto_source_topic_id: 25400
- auto_source_url: https://ethresear.ch/t/builders-defection-and-incentive-compatibility/25400
- desc: |
  複数のトランザクションをまとめたもので、MEVサーチャーが特定の順序で実行されることを期待してビルダーに提出する。これにより、サーチャーはMEVを抽出し、ビルダーは報酬を得る。

## Orderflow
- ja: オーダーフロー
- related: [Mempool, Searcher, Builder]
- auto_added: 2026-07-09
- auto_source_topic_id: 25400
- auto_source_url: https://ethresear.ch/t/builders-defection-and-incentive-compatibility/25400
- desc: |
  ブロックチェーンネットワークに送信されるトランザクションの連続的な流れ。特にMEVの文脈では、サーチャーからビルダーへ、あるいはユーザーからサーチャーへと流れるトランザクションの注文を指す。

## Replication-based frontrunning
- ja: 複製ベースのフロントランニング
- related: [Frontrunning, MEV, Builder defection]
- auto_added: 2026-07-09
- auto_source_topic_id: 25400
- auto_source_url: https://ethresear.ch/t/builders-defection-and-incentive-compatibility/25400
- desc: |
  ビルダーがサーチャーから受け取った有利なトランザクションバンドルの内容を複製し、元のサーチャーの代わりに自分自身で実行することで利益を得る不正行為。ビルダーの裏切り（defection）の一種。

## Credibly committing architecture
- ja: 信頼できるコミットメントアーキテクチャ
- related: [Proposer-Builder Separation (PBS), Trusted Execution Environment (TEE), Cryptographic order protection]
- auto_added: 2026-07-09
- auto_source_topic_id: 25400
- auto_source_url: https://ethresear.ch/t/builders-defection-and-incentive-compatibility/25400
- desc: |
  ビルダーが観察したトランザクション情報（入札やペイロード）を悪用できないように、構造的に設計されたブロックチェーンアーキテクチャ。これにより、ビルダーの不正行為（defection）のインセンティブを根本的に排除する。

## Smart Contract Oriented Programming
- ja: スマートコントラクト指向プログラミング
- aliases: [SCOP]
- related: [Diamond (pattern), Facet (smart contract), Modular smart contracts]
- auto_added: 2026-07-09
- auto_source_topic_id: 28973
- auto_source_url: https://ethereum-magicians.org/t/compose-whitepaper-a-composition-layer-for-on-chain-applications/28973
- desc: |
  スマートコントラクトのコード再利用をデプロイされたアーキテクチャ自体に組み込むためのプログラミングパラダイム。Composeプロジェクトによって提唱され、モジュール化されたオンチェーンシステムの構築を容易にする。

## Diamond (pattern)
- ja: ダイヤモンド（パターン）
- aliases: [Diamond proxy, Diamond standard, EIP-2535]
- related: [Facet (smart contract), Modular smart contracts, Proxy upgradeable system]
- auto_added: 2026-07-09
- auto_source_topic_id: 28973
- auto_source_url: https://ethereum-magicians.org/t/compose-whitepaper-a-composition-layer-for-on-chain-applications/28973
- desc: |
  Solidityにおけるスマートコントラクトのモジュール化およびアップグレードパターン。複数のファセット（機能を提供するコントラクト）を単一のダイヤモンドコントラクトアドレスから呼び出すことを可能にし、コントラクトのサイズ制限を回避する。

## Facet (smart contract)
- ja: ファセット（スマートコントラクト）
- related: [Diamond (pattern), Modular smart contracts]
- auto_added: 2026-07-09
- auto_source_topic_id: 28973
- auto_source_url: https://ethereum-magicians.org/t/compose-whitepaper-a-composition-layer-for-on-chain-applications/28973
- desc: |
  ダイヤモンドパターンにおいて、特定の機能やロジックをカプセル化して提供する独立したスマートコントラクト。これらをダイヤモンドコントラクトに接続することで、機能の追加や更新を柔軟に行える。

## ePBS circuit breakers
- ja: ePBSサーキットブレーカー
- related: [ePBS, circuit breaker]
- auto_added: 2026-07-09
- auto_source_topic_id: 28968
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-consensus-acdc-182-july-9-2026/28968
- desc: |
  ePBS（Enshrined Proposer-Builder Separation）において、プロトコルの健全性を維持するために導入される安全装置。特定の異常な状態（例：ペイロードの欠落）が検出された場合に、システムが自動的に介入し、さらなる問題を防ぐためのメカニズム。

## Progressive containers
- ja: プログレッシブコンテナ
- related: [EIP-7688]
- auto_added: 2026-07-09
- auto_source_topic_id: 28968
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-consensus-acdc-182-july-9-2026/28968
- desc: |
  EIP-7688で提案されている、Ethereumのデータ構造や処理に関する新しい概念。コンテナが段階的に構築または処理されることで、効率性や柔軟性を向上させることを目指す。

## Account level authorization
- ja: アカウントレベル承認
- related: [Account Abstraction, EIP-712, ERC-20]
- auto_added: 2026-07-10
- auto_source_topic_id: 28977
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-account-level-authorization/28977
- desc: |
  スマートコントラクトアカウントが、オフチェーンで署名されたEIP-712承認メッセージに基づいてERC-20トークンやネイティブETHの送金を実行する仕組み。これにより、トークンレベルではなくアカウント自体で送金承認を管理できる。これはERC-3009の機能に類似しているが、トークンレベルではなくアカウントレベルで実装される。

## Physical Reserve Registry
- ja: 物理的準備金レジストリ
- related: [reserve-backed tokens, RWA instruments]
- auto_added: 2026-07-10
- auto_source_topic_id: 28964
- auto_source_url: https://ethereum-magicians.org/t/erc-8332-physical-reserve-registry/28964
- desc: |
  物理的な準備金をオンチェーンで表現するための標準インターフェース。準備金に裏付けられたトークンやその他のRWA（実世界資産）商品の裏付けとして割り当てられることを目的とする。

## reserveId
- ja: 準備金ID
- related: [Physical Reserve Registry, assetId]
- auto_added: 2026-07-10
- auto_source_topic_id: 28964
- auto_source_url: https://ethereum-magicians.org/t/erc-8332-physical-reserve-registry/28964
- desc: |
  物理的な準備金、または保管/在庫のエントリを一意に識別するためのID。ERC-8332で定義される物理的準備金レジストリの主要な構成要素。

## assetId
- ja: 資産ID
- related: [Physical Reserve Registry, reserveId]
- auto_added: 2026-07-10
- auto_source_topic_id: 28964
- auto_source_url: https://ethereum-magicians.org/t/erc-8332-physical-reserve-registry/28964
- desc: |
  物理的な資産タイプを一意に識別するためのID。ERC-8332で定義される物理的準備金レジストリにおいて、特定の準備金がどの資産タイプに属するかを示す。

## reserve states
- ja: 準備金ステータス
- related: [Physical Reserve Registry]
- auto_added: 2026-07-10
- auto_source_topic_id: 28964
- auto_source_url: https://ethereum-magicians.org/t/erc-8332-physical-reserve-registry/28964
- desc: |
  物理的準備金レジストリ内で準備金が取りうる状態。PENDING、ACTIVE、SUSPENDED、CONSUMED、CANCELLEDなどのステータスが含まれ、準備金のライフサイクルを管理する。

## accounting actions
- ja: 会計アクション
- related: [Physical Reserve Registry]
- auto_added: 2026-07-10
- auto_source_topic_id: 28964
- auto_source_url: https://ethereum-magicians.org/t/erc-8332-physical-reserve-registry/28964
- desc: |
  物理的準備金レジストリにおける準備金の管理操作。割り当て（allocation）、解放（release）、消費（consumption）などが含まれ、準備金の数量と状態の変更を記録する。

## Draft
- ja: ドラフト (EIP/ERC)
- related: [EIP, ERC, Review, Last Call, Final]
- auto_added: 2026-07-10
- auto_source_topic_id: 28963
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-105-july-7-2026/28963
- desc: |
  EIPまたはERCの提案が初期段階にあり、まだ変更が頻繁に行われる可能性がある状態。コミュニティからのフィードバックを募る段階です。

## Review
- ja: レビュー (EIP/ERC)
- related: [EIP, ERC, Draft, Last Call, Final]
- auto_added: 2026-07-10
- auto_source_topic_id: 28963
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-105-july-7-2026/28963
- desc: |
  EIPまたはERCの提案がドラフト段階を終え、より広範なコミュニティやコア開発者による詳細な検討とフィードバックを受ける段階。この段階で大きな変更は少なくなることが期待されます。

## Last Call
- ja: ラストコール (EIP/ERC)
- related: [EIP, ERC, Draft, Review, Final]
- auto_added: 2026-07-10
- auto_source_topic_id: 28963
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-105-july-7-2026/28963
- desc: |
  EIPまたはERCの提案が最終承認に向けて、最後のフィードバック期間に入る段階。この期間中に重大な問題が発見されなければ、最終段階に進むことになります。

## Final
- ja: ファイナル (EIP/ERC)
- related: [EIP, ERC, Draft, Review, Last Call]
- auto_added: 2026-07-10
- auto_source_topic_id: 28963
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-105-july-7-2026/28963
- desc: |
  EIPまたはERCの提案が承認され、Ethereumプロトコルの一部として実装されるか、標準として確立された状態。この状態のEIP/ERCは変更されないことが期待されます。

## EIP Board
- ja: EIPボード
- related: [EIP, EIP Editor]
- auto_added: 2026-07-10
- auto_source_topic_id: 28963
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-105-july-7-2026/28963
- desc: |
  Ethereum Improvement Proposal (EIP) のプロセスを監督し、EIPのステータス変更や承認に関する決定を行う委員会。EIPの品質と一貫性を維持する役割を担います。

## manual merkle proofing
- ja: 手動Merkle証明検証（manual Merkle proofing）
- related: [Merkle proof, fraudulent fork]
- auto_added: 2026-07-10
- auto_source_topic_id: 28960
- auto_source_url: https://ethereum-magicians.org/t/bounty-incentivised-manual-merkle-proofing-good-for-newcomers-and-extra-security/28960
- desc: |
  ユーザーが手動でMerkle証明を検証し、既存のブロックと他のユーザーのブロックをリンクするプロセス。不正なフォークを発見した場合に報酬を得るメカニズムと組み合わされることで、新規ユーザーのネットワークへの信頼構築とセキュリティ強化を目指す。

## fraudulent fork
- ja: 不正なフォーク（fraudulent fork）
- related: [fork, censorship resistance]
- auto_added: 2026-07-10
- auto_source_topic_id: 28960
- auto_source_url: https://ethereum-magicians.org/t/bounty-incentivised-manual-merkle-proofing-good-for-newcomers-and-extra-security/28960
- desc: |
  ブロックチェーンにおいて、悪意のある意図を持って作成された分岐。この投稿では、ユーザーが手動でMerkle証明を検証することで、このような不正なフォークを発見し、報告することで報酬を得るメカニズムが提案されている。

## slashed collateral
- ja: スラッシュされた担保（slashed collateral）
- related: [slashing, collateral, Proof of Stake]
- auto_added: 2026-07-10
- auto_source_topic_id: 28960
- auto_source_url: https://ethereum-magicians.org/t/bounty-incentivised-manual-merkle-proofing-good-for-newcomers-and-extra-security/28960
- desc: |
  EthereumのProof of Stake (PoS) システムにおいて、バリデーターがプロトコルルールに違反する不正行為（例: 二重署名、不適切な提案）を行った際に、その担保として預け入れたETHの一部または全部が没収されること。没収された担保は、不正行為の抑止とネットワークのセキュリティ維持に貢献する。

## embedded wallets
- ja: 組み込み型ウォレット
- auto_added: 2026-07-10
- auto_source_topic_id: 28955
- auto_source_url: https://ethereum-magicians.org/t/a-simple-open-source-embedded-wallet-pattern-for-ethereum/28955
- desc: |
  アプリケーションやウェブサイトに直接統合され、ユーザーが外部のウォレット拡張機能やアプリを必要とせずに暗号資産やブロックチェーン操作を行えるようにするウォレット。特に非クリプトネイティブユーザーのオンボーディングを容易にする。

## WebAuthn PRF extension
- ja: WebAuthn PRF拡張機能 (WebAuthn Pseudo Random Function extension)
- aliases: [PRF extension]
- related: [WebAuthn]
- auto_added: 2026-07-10
- auto_source_topic_id: 28955
- auto_source_url: https://ethereum-magicians.org/t/a-simple-open-source-embedded-wallet-pattern-for-ethereum/28955
- desc: |
  W3Cによって提案され、主要なブラウザやモバイルOSでサポートされているWebAuthnの拡張機能。これにより、ブラウザ内でポータブルなネイティブEthereumキーを生成し、デバイス間でアクセスできるようになる。

## signing kernel
- ja: 署名カーネル
- related: [embedded wallets, branding layer]
- auto_added: 2026-07-10
- auto_source_topic_id: 28955
- auto_source_url: https://ethereum-magicians.org/t/a-simple-open-source-embedded-wallet-pattern-for-ethereum/28955
- desc: |
  組み込み型ウォレットのアーキテクチャにおける低レベルの署名ユーティリティの不変な実装。クレデンシャル作成とペイロードへの署名を処理し、ユーザーの秘密鍵はこのコンテキストから離れない。

## branding layer
- ja: ブランディング層
- related: [embedded wallets, signing kernel]
- auto_added: 2026-07-10
- auto_source_topic_id: 28955
- auto_source_url: https://ethereum-magicians.org/t/a-simple-open-source-embedded-wallet-pattern-for-ethereum/28955
- desc: |
  組み込み型ウォレットのアーキテクチャにおけるポリシー層で、ウォレットのビジネスロジックを決定し、ユーザーにインタラクティブなコンポーネントを提示する。署名カーネルのiframeをマウントし、JSON-RPCメソッドを実装する。

## nested iframe pattern
- ja: ネストされたiframeパターン
- related: [embedded wallets, signing kernel, branding layer]
- auto_added: 2026-07-10
- auto_source_topic_id: 28955
- auto_source_url: https://ethereum-magicians.org/t/a-simple-open-source-embedded-wallet-pattern-for-ethereum/28955
- desc: |
  組み込み型ウォレットの実装において、ウォレットの機能をサードパーティサイトでプロバイダーとして利用可能にするために、複数のiframeを階層的に埋め込むアーキテクチャパターン。

## trace rows
- ja: トレース行
- related: [STARK, execution trace]
- auto_added: 2026-07-11
- auto_source_topic_id: 25417
- auto_source_url: https://ethresear.ch/t/qingming-stark-g64-a-goldilocks-stark-backend-on-amd-rocm-hip/25417
- desc: |
  STARKなどのゼロ知識証明システムにおいて、証明対象となる計算の実行トレースを構成する個々の状態またはステップ。各行は計算のある時点でのシステムの状態を表します。

## proof-carrying computation
- ja: 証明付き計算 (Proof-Carrying Computation)
- aliases: [PCC]
- related: [zero-knowledge proof, verifiable computation, rollup]
- auto_added: 2026-07-11
- auto_source_topic_id: 25417
- auto_source_url: https://ethresear.ch/t/qingming-stark-g64-a-goldilocks-stark-backend-on-amd-rocm-hip/25417
- desc: |
  計算結果にその正当性を保証する暗号学的証明を付与する計算パラダイム。これにより、結果の検証者は計算を再実行することなく、その正確性を信頼できます。

## Osaka
- ja: 大阪 (Osaka)
- related: [bpo]
- auto_added: 2026-07-11
- auto_source_topic_id: 28981
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-30-july-13-2026/28981
- desc: |
  Ethereumの次期アップグレードのコードネームの一つ。特定のEIP群を導入し、ネットワークの機能や性能を向上させることを目的とする。

## BPO
- ja: BPO (Blob Pre-Confirmation)
- aliases: [bpo1, bpo2]
- related: [Osaka, blob]
- auto_added: 2026-07-11
- auto_source_topic_id: 28981
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-30-july-13-2026/28981
- desc: |
  EthereumのOsakaアップグレードに関連する機能またはフェーズの略称。Blob Pre-Confirmationの可能性があり、データ可用性レイヤーの改善やトランザクション処理の効率化に寄与すると考えられる。

## debug_executionWitness
- ja: debug_executionWitness (デバッグ実行証人)
- related: [execution layer, RPC]
- auto_added: 2026-07-11
- auto_source_topic_id: 28981
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-30-july-13-2026/28981
- desc: |
  Ethereumの実行レイヤーAPIにおけるデバッグ用の仕様。トランザクションの実行過程や状態変化に関する詳細な情報を取得し、開発者が問題の特定や分析を行うのに役立つ。

## AUCIL
- ja: AUCIL (オークションベース・インクルージョンリスト)
- related: [Inclusion list, PBS]
- auto_added: 2026-07-13
- auto_source_topic_id: 25447
- auto_source_url: https://ethresear.ch/t/sybil-attacks-on-aucil/25447
- desc: |
  Proposer-Builder Separation (PBS)における検閲耐性プリミティブの一つで、経済的インセンティブと戦略的参加、価格形成に依存するオークションベースのインクルージョンリスト設計。Sybil攻撃や賄賂攻撃に対する堅牢性が研究されている。

## Sybil attacks
- ja: Sybil攻撃
- related: [Sybil resistance, censorship resistance, DVT]
- auto_added: 2026-07-13
- auto_source_topic_id: 25447
- auto_source_url: https://ethresear.ch/t/sybil-attacks-on-aucil/25447
- desc: |
  ネットワークの参加者が多数の偽のアイデンティティ（Sybil）を作成し、それらを利用してネットワークの合意形成やリソース配分を操作しようとする攻撃。ブロックチェーンの分散性や検閲耐性を脅かす可能性がある。

## bribery attacks
- ja: 賄賂攻撃
- related: [censorship resistance, Sybil attacks, MEV]
- auto_added: 2026-07-13
- auto_source_topic_id: 25447
- auto_source_url: https://ethresear.ch/t/sybil-attacks-on-aucil/25447
- desc: |
  ブロックチェーンシステムにおいて、悪意のあるアクターがプロトコルの参加者（例: ビルダー、バリデーター）に金銭的インセンティブを提供し、特定のトランザクションの包含や除外、あるいは特定の行動を強制しようとする攻撃。検閲耐性を損なう可能性がある。

## executable skill
- ja: 実行可能なスキル
- related: [SkillBinding, SkillRoot, ERC-721]
- auto_added: 2026-07-14
- auto_source_topic_id: 29005
- auto_source_url: https://ethereum-magicians.org/t/token-bound-executable-skills-the-artifact-identity-integrity-layer-under-skill-registries-erc-721-extension/29005
- desc: |
  オフチェーンのランタイム（LLMエージェントランタイムを含む）が、オンチェーンのアンカーに対してバイト単位で検証し、実行できるファイルパッケージ。ERC-721トークンにバインドされることで、そのアイデンティティと整合性が保証されます。

## SkillBinding
- ja: スキルバインディング
- related: [executable skill, mdHash, packageHash, version]
- auto_added: 2026-07-14
- auto_source_topic_id: 29005
- auto_source_url: https://ethereum-magicians.org/t/token-bound-executable-skills-the-artifact-identity-integrity-layer-under-skill-registries-erc-721-extension/29005
- desc: |
  実行可能なスキルをオンチェーンで表現するデータ構造。`mdHash`（プライマリ文書のSHA-256ハッシュ）、`packageHash`（SkillRootのSHA-256ハッシュ）、および契約によってインクリメントされる`version`で構成され、スキルの整合性と履歴をコミットします。

## update authority
- ja: 更新権限
- related: [SkillBinding, ERC-721]
- auto_added: 2026-07-14
- auto_source_topic_id: 29005
- auto_source_url: https://ethereum-magicians.org/t/token-bound-executable-skills-the-artifact-identity-integrity-layer-under-skill-registries-erc-721-extension/29005
- desc: |
  実行可能なスキルの`SkillBinding`を更新する権利。これはERC-721トークンの所有権とは別に定義され、スキルの発行権限として機能し、コンテンツの変更を管理します。

## SkillRoot
- ja: スキルルート
- related: [executable skill, DAG-CBOR, packageHash]
- auto_added: 2026-07-14
- auto_source_topic_id: 29005
- auto_source_url: https://ethereum-magicians.org/t/token-bound-executable-skills-the-artifact-identity-integrity-layer-under-skill-registries-erc-721-extension/29005
- desc: |
  実行可能なスキルのファイルパッケージ全体をカバーする、決定論的にエンコードされたコンテンツアドレス指定オブジェクトグラフ。`packageHash`によってその整合性が保証され、パッケージ内のすべてのファイルへの依存関係を定義します。

## DAG-CBOR
- ja: DAG-CBOR (Directed Acyclic Graph - Concise Binary Object Representation)
- related: [SkillRoot, IPLD]
- auto_added: 2026-07-14
- auto_source_topic_id: 29005
- auto_source_url: https://ethereum-magicians.org/t/token-bound-executable-skills-the-artifact-identity-integrity-layer-under-skill-registries-erc-721-extension/29005
- desc: |
  決定論的な有向非巡回グラフ形式のCBOR（Concise Binary Object Representation）。この提案では、実行可能なスキルのファイルパッケージ（SkillRoot）をエンコードするために使用され、バイト単位の整合性と再現性を保証します。

## Checkpoint
- ja: チェックポイント
- related: [Epoch Boundary Block, Finalization]
- auto_added: 2026-07-14
- auto_source_topic_id: 29003
- auto_source_url: https://ethereum-magicians.org/t/eip-8333-align-checkpoint-with-epoch-boundary-block/29003
- desc: |
  Ethereumのコンセンサス層において、特定の時点でのブロックチェーンの状態を確定させるための参照点。ファイナリティの達成や同期の効率化に利用されます。

## Epoch Boundary Block
- ja: エポック境界ブロック
- related: [Epoch, Checkpoint]
- auto_added: 2026-07-14
- auto_source_topic_id: 29003
- auto_source_url: https://ethereum-magicians.org/t/eip-8333-align-checkpoint-with-epoch-boundary-block/29003
- desc: |
  Ethereumのコンセンサス層において、エポックの開始または終了を示す特定のブロック。チェックポイントとして機能し、ファイナリティの決定やネットワークの同期に重要な役割を果たします。

## Subjective Human Oracle Network
- ja: 主観的ヒューマンオラクルネットワーク (SHON)
- aliases: [SHON]
- related: [Human Oracle, DAO, Oracle]
- auto_added: 2026-07-15
- auto_source_topic_id: 25459
- auto_source_url: https://ethresear.ch/t/bounding-collusion-in-capital-allocation-daos-via-subjective-human-oracles/25459
- desc: |
  提案されたフレームワークにおいて、リアルワールドの物理的インフラストラクチャの資金吸収能力と正当性を検証するために導入される分散型ヒューマンオラクルネットワーク。悪意のあるアクターによるガバナンス攻撃を防ぐため、提案がオンチェーンガバナンス層に到達する前に投票配分の上限を動的に設定する。

## Capital Allocation DAO
- ja: 資金配分DAO
- related: [DAO, Token-weighted voting, Plutocratic capture]
- auto_added: 2026-07-15
- auto_source_topic_id: 25459
- auto_source_url: https://ethresear.ch/t/bounding-collusion-in-capital-allocation-daos-via-subjective-human-oracles/25459
- desc: |
  リアルワールドの物理的インフラストラクチャ（慈善事業、公共財など）への資金配分を管理する分散型自律組織。トークン加重投票の性質上、金権政治的支配や共謀攻撃に対して脆弱である。

## Physical Verification
- ja: 物理的検証
- related: [Subjective Human Oracle Network, Real-world asset]
- auto_added: 2026-07-15
- auto_source_topic_id: 25459
- auto_source_url: https://ethresear.ch/t/bounding-collusion-in-capital-allocation-daos-via-subjective-human-oracles/25459
- desc: |
  オンチェーンガバナンス層が物理的なオフラインエンティティの資金吸収能力と正当性を正確に検証するために、リアルワールドで行われる監査プロセス。提案されたSHONフレームワークでは、分散型ボランティアによって実施される。

## Capacity Assessment
- ja: 能力評価
- related: [Physical Verification, Subjective Human Oracle Network]
- auto_added: 2026-07-15
- auto_source_topic_id: 25459
- auto_source_url: https://ethresear.ch/t/bounding-collusion-in-capital-allocation-daos-via-subjective-human-oracles/25459
- desc: |
  物理的なオフラインエンティティが要求された資金を運用する能力を評価するプロセス。SHONフレームワークでは、物理的検証と合わせて、提案されたプロジェクトが実際にどれだけの資金を効果的に利用できるかを判断するために行われる。

## Dynamic Voting Cap Generation
- ja: 動的投票上限生成
- related: [Subjective Human Oracle Network, Token-weighted voting, Plutocratic capture]
- auto_added: 2026-07-15
- auto_source_topic_id: 25459
- auto_source_url: https://ethresear.ch/t/bounding-collusion-in-capital-allocation-daos-via-subjective-human-oracles/25459
- desc: |
  Subjective Human Oracle Network (SHON) による物理的検証と能力評価の結果に基づいて、提案に対する最大投票配分額を動的に設定するプロセス。これにより、金権政治的支配や共謀攻撃による過剰な資金抽出を防ぐ。

## Authority Visibility Problem
- ja: 権限可視性問題
- related: [Deterministic Authority Reconstruction, Authority Continuity]
- auto_added: 2026-07-15
- auto_source_topic_id: 25456
- auto_source_url: https://ethresear.ch/t/the-authority-visibility-problem-in-ethereum-governance/25456
- desc: |
  Ethereumガバナンスシステムにおいて、実行証拠は豊富に存在するものの、権限関係が直接的に観察しにくいという課題。権限の起源、伝播、永続性を完全に理解することが困難な状況を指す。

## Deterministic Authority Reconstruction
- ja: 決定論的権限再構築
- related: [Authority Visibility Problem, Authority Continuity, Replay-based Verification]
- auto_added: 2026-07-15
- auto_source_topic_id: 25456
- auto_source_url: https://ethresear.ch/t/the-authority-visibility-problem-in-ethereum-governance/25456
- desc: |
  公開されたガバナンス証拠から、権限関係を体系的かつ再現可能な手順で再構築するプロセス。これにより、異なるオブザーバー間でも一貫した分析結果が得られる基盤を提供する。

## Authority Continuity
- ja: 権限の継続性
- related: [Authority Visibility Problem, Deterministic Authority Reconstruction]
- auto_added: 2026-07-15
- auto_source_topic_id: 25456
- auto_source_url: https://ethresear.ch/t/the-authority-visibility-problem-in-ethereum-governance/25456
- desc: |
  ガバナンス権限が時間とともにどのように維持、変化、伝播していくかという特性。個々のイベントではなく、連続する制度的状態として権限の進化を捉える。

## Replay-based Verification
- ja: リプレイベース検証
- related: [Deterministic Authority Reconstruction, Replay Equivalence]
- auto_added: 2026-07-15
- auto_source_topic_id: 25456
- auto_source_url: https://ethresear.ch/t/the-authority-visibility-problem-in-ethereum-governance/25456
- desc: |
  ガバナンス活動の実行証拠を再実行（リプレイ）することで、再構築された権限関係やその解釈が元の証拠と一貫しているかを評価する検証手法。

## EVM Code
- ja: EVMコード
- related: [EVM, Bytecode]
- auto_added: 2026-07-15
- auto_source_topic_id: 29013
- auto_source_url: https://ethereum-magicians.org/t/eip-8337-validated-evm-code/29013
- desc: |
  Ethereum Virtual Machine (EVM) が実行するバイトコード。スマートコントラクトのロジックを表現し、ブロックチェーン上で実行される。

## Validated EVM Code
- ja: 検証済みEVMコード
- related: [EVM Code, EIP-8337]
- auto_added: 2026-07-15
- auto_source_topic_id: 29013
- auto_source_url: https://ethereum-magicians.org/t/eip-8337-validated-evm-code/29013
- desc: |
  EIP-8337で提案されている、特定の検証ルールを満たすEthereum Virtual Machine (EVM) のバイトコード。これにより、コードの安全性や挙動の予測可能性が向上する。

## Timelock Account recovery
- ja: タイムロックアカウントリカバリー
- related: [Smart Account, Account Abstraction, ERC-4337, ERC-7579]
- auto_added: 2026-07-15
- auto_source_topic_id: 29009
- auto_source_url: https://ethereum-magicians.org/t/timelock-account-recovery-a-trust-minimized-recovery-system-for-smart-accounts/29009
- desc: |
  ERC-4337/7579スマートアカウント向けの、信頼を最小化したリカバリーシステム。信頼できる第三者にリカバリー権限を与える代わりに、誰でも参加できるパーミッションレスな経済ゲームとしてリカバリーを機能させる。

## guardian model
- ja: ガーディアンモデル
- related: [Smart Account, Account Abstraction]
- auto_added: 2026-07-15
- auto_source_topic_id: 29009
- auto_source_url: https://ethereum-magicians.org/t/timelock-account-recovery-a-trust-minimized-recovery-system-for-smart-accounts/29009
- desc: |
  スマートアカウントのリカバリーにおいて、信頼できる第三者（ガーディアン）にリカバリー権限を付与する方式。アカウント所有者が秘密鍵を紛失した場合などに、ガーディアンの承認によってアカウントを復旧させる。

## hidden watchtowers
- ja: 隠されたウォッチタワー
- related: [watchtower, off-chain monitoring, censorship resistance]
- auto_added: 2026-07-15
- auto_source_topic_id: 29009
- auto_source_url: https://ethereum-magicians.org/t/timelock-account-recovery-a-trust-minimized-recovery-system-for-smart-accounts/29009
- desc: |
  オフチェーンでブロックチェーンの状態を監視し、不正行為や特定のイベントを検知するエンティティ。特に、攻撃者からその存在や活動を隠蔽することで、検知能力を高めることを意図する。

## Bundled Attestation Propagation
- ja: バンドル化されたアッテステーション伝播
- related: [Attestation, Bundle, gossipsub]
- auto_added: 2026-07-15
- auto_source_topic_id: 29008
- auto_source_url: https://ethereum-magicians.org/t/eip-8334-bundled-attestation-propagation/29008
- desc: |
  複数のアッテステーションをバンドル（束ねる）して効率的に伝播させるシステム。EIP-8334で提案されており、gossipsubの部分メッセージ機能を利用してネットワーク負荷を軽減することを目指します。

## gossipsub
- ja: ゴシップサブ
- related: [P2P network, Attestation]
- auto_added: 2026-07-15
- auto_source_topic_id: 29008
- auto_source_url: https://ethereum-magicians.org/t/eip-8334-bundled-attestation-propagation/29008
- desc: |
  P2Pネットワークにおけるトピックベースのメッセージ伝播プロトコル。Ethereumのコンセンサス層で、アッテステーションなどの重要なメッセージを効率的かつスケーラブルにノード間で共有するために利用されます。

## CBOR
- ja: CBOR (Concise Binary Object Representation)
- related: [EIP-8130, ERC-8340]
- auto_added: 2026-07-16
- auto_source_topic_id: 29022
- auto_source_url: https://ethereum-magicians.org/t/erc-8340-transaction-metadata-encoding/29022
- desc: |
  データ構造をコンパクトに表現するためのバイナリシリアライゼーションフォーマット。EthereumのEIPやERCにおいて、トランザクションメタデータなどのエンコーディングに利用される。

## call scoping
- ja: コールスコープ設定
- related: [account abstraction, ERC-8130]
- auto_added: 2026-07-16
- auto_source_topic_id: 29022
- auto_source_url: https://ethereum-magicians.org/t/erc-8340-transaction-metadata-encoding/29022
- desc: |
  トランザクション内の特定の関数呼び出し（call）に対して、権限や制約の範囲を設定する概念。アカウント抽象化の文脈で、きめ細やかなアクセス制御やセキュリティ強化のために用いられる。

## selective disclosure
- ja: 選択的開示
- related: [zero-knowledge proof, privacy]
- auto_added: 2026-07-16
- auto_source_topic_id: 29022
- auto_source_url: https://ethereum-magicians.org/t/erc-8340-transaction-metadata-encoding/29022
- desc: |
  プライバシー保護技術において、ある情報セットの中から、検証に必要な最小限の情報のみを選択的に開示するメカニズム。ゼロ知識証明などと組み合わせて、オンチェーンでのプライバシーを強化するために利用される。

## commitment digest
- ja: コミットメントダイジェスト
- related: [commitment, salted commitment]
- auto_added: 2026-07-16
- auto_source_topic_id: 29022
- auto_source_url: https://ethereum-magicians.org/t/erc-8340-transaction-metadata-encoding/29022
- desc: |
  あるデータに対するコミットメントのハッシュ値またはダイジェスト。データ自体を直接開示することなく、そのデータに対するコミットメントを表現し、後でデータを開示してコミットメントが正しかったことを証明するために使用される。

## salted commitment
- ja: ソルト付きコミットメント
- related: [commitment, commitment digest]
- auto_added: 2026-07-16
- auto_source_topic_id: 29022
- auto_source_url: https://ethereum-magicians.org/t/erc-8340-transaction-metadata-encoding/29022
- desc: |
  コミットメントを作成する際に、元のデータにランダムな値（ソルト）を追加してからハッシュ化する手法。これにより、同じデータに対するコミットメントが常に異なる値となり、ブルートフォース攻撃や辞書攻撃に対する耐性を高める。

## Cohort Order Book
- ja: コホートオーダーブック
- related: [Cohort, Generational fungible liquidity, Batch-FIFO]
- auto_added: 2026-07-16
- auto_source_topic_id: 29018
- auto_source_url: https://ethereum-magicians.org/t/cohort-order-book-an-o-1-fully-on-chain-limit-order-book-via-generational-fungible-liquidity/29018
- desc: |
  各価格帯の注文を時間順の「コホート」にまとめることで、O(1)のフィルを可能にするオンチェーンの指値注文板。部分フィルが正確で、キャンセルも容易な設計が特徴です。

## Cohort
- ja: コホート
- related: [Cohort Order Book, Staging cohort, Open cohort, Generational fungible liquidity]
- auto_added: 2026-07-16
- auto_source_topic_id: 29018
- auto_source_url: https://ethereum-magicians.org/t/cohort-order-book-an-o-1-fully-on-chain-limit-order-book-via-generational-fungible-liquidity/29018
- desc: |
  コホートオーダーブックにおいて、各価格帯の流動性をまとめるために使用される、時間順に並べられた代替可能なバッチ。新しい注文を受け付ける「Staging」と、現在フィルされている「Open」の2つの状態があります。

## One-sided add
- ja: 片側流動性追加 (One-sided add)
- aliases: [one-sided liquidity add]
- related: [Cohort Order Book, AMM]
- auto_added: 2026-07-16
- auto_source_topic_id: 29018
- auto_source_url: https://ethereum-magicians.org/t/cohort-order-book-an-o-1-fully-on-chain-limit-order-book-via-generational-fungible-liquidity/29018
- desc: |
  指値注文板やAMMにおいて、特定の価格帯で単一のトークンのみを追加して流動性を提供すること。部分的にフィルされた価格レベルで、プロラタAMMでは困難な操作であり、コホートオーダーブックが解決を目指す主要な課題の一つです。

## Generational fungible liquidity
- ja: 世代別代替可能流動性 (Generational fungible liquidity)
- related: [Cohort Order Book, Cohort]
- auto_added: 2026-07-16
- auto_source_topic_id: 29018
- auto_source_url: https://ethereum-magicians.org/t/cohort-order-book-an-o-1-fully-on-chain-limit-order-book-via-generational-fungible-liquidity/29018
- desc: |
  コホートオーダーブックの核となる概念で、各価格帯の流動性が時間順の「コホート」として代替可能なバッチにまとめられること。これにより、O(1)のフィルと片側流動性追加のクリーンな処理が可能になります。

## Batch-FIFO
- ja: バッチFIFO (Batch-FIFO)
- related: [Cohort Order Book, Cohort, FIFO]
- auto_added: 2026-07-16
- auto_source_topic_id: 29018
- auto_source_url: https://ethereum-magicians.org/t/cohort-order-book-an-o-1-fully-on-chain-limit-order-book-via-generational-fungible-liquidity/29018
- desc: |
  コホートオーダーブックで採用されている注文処理の順序付けメカニズム。コホート内ではプロラタ、コホート間ではFIFO（先入れ先出し）で処理されるため、粗い時間優先順位付けとなります。MEVやフロントランニングの懸念が指摘されています。

## Two-Phase Asset Transfers
- ja: 二段階資産転送
- related: [ERC-8339, ITwoPhaseEscrow]
- auto_added: 2026-07-16
- auto_source_topic_id: 29017
- auto_source_url: https://ethereum-magicians.org/t/erc-8339-two-phase-asset-transfers/29017
- desc: |
  送信者が転送を開始し、資産がエスクローにロックされ、指定された受信者が承認するまで決済されない資産転送の標準。受信者は承認するまでいつでも拒否でき、期限後は送信者が資産を取り戻せる。

## ITwoPhaseEscrow
- ja: ITwoPhaseEscrow（二段階エスクロー）
- related: [Two-Phase Asset Transfers, ERC-8339]
- auto_added: 2026-07-16
- auto_source_topic_id: 29017
- auto_source_url: https://ethereum-magicians.org/t/erc-8339-two-phase-asset-transfers/29017
- desc: |
  ERC-8339で定義される標準エスクローインターフェース。資産の二段階転送のライフサイクル（開始、承認、拒否、期限切れ後の回収）を管理する。

## Mempool-safe Second Factor
- ja: メムプールセーフな第二要素
- related: [Two-Phase Asset Transfers, Mempool]
- auto_added: 2026-07-16
- auto_source_topic_id: 29017
- auto_source_url: https://ethereum-magicians.org/t/erc-8339-two-phase-asset-transfers/29017
- desc: |
  ERC-8339の二段階資産転送で採用されている、メムプールでの情報漏洩リスクを考慮した第二要素認証メカニズム。秘密鍵そのものではなく、秘密鍵による署名を用いることで、トランザクションがリバートした場合でも秘密鍵がオンチェーンで公開されることを防ぐ。

## Poisoned Address
- ja: ポイズンドアドレス
- related: [Address Spoofing, Phishing]
- auto_added: 2026-07-16
- auto_source_topic_id: 29017
- auto_source_url: https://ethereum-magicians.org/t/erc-8339-two-phase-asset-transfers/29017
- desc: |
  ユーザーを欺いて資金を送金させることを目的とした、悪意のあるアドレス。正規のアドレスと似た文字列を使用したり、アドレス帳を汚染したりする手法が用いられることがある。

## Wallet Call Gas Limit Override Capability
- ja: ウォレットコールガス制限上書き機能
- related: [Account Abstraction, Smart Contract Wallet]
- auto_added: 2026-07-16
- auto_source_topic_id: 28998
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-106-july-14-2026/28998
- desc: |
  スマートコントラクトウォレットが、トランザクション実行時に設定されるガス制限を上書きできる機能。これにより、特定の操作に対して柔軟なガス管理が可能になり、ユーザーエクスペリエンスやプログラマビリティが向上します。

## private payment mechanism
- ja: プライベート決済メカニズム
- related: [privacy primitive, shielded pool]
- auto_added: 2026-07-18
- auto_source_topic_id: 25471
- auto_source_url: https://ethresear.ch/t/privacy-guardians-2-0/25471
- desc: |
  決済の送信者、受信者、金額などの情報を秘匿し、プライバシーを保護しながらブロックチェーン上での取引を可能にする仕組み。ゼロ知識証明などの暗号技術が用いられることが多い。

## honeypot
- ja: ハニーポット
- related: [scam, exploit]
- auto_added: 2026-07-18
- auto_source_topic_id: 25471
- auto_source_url: https://ethresear.ch/t/privacy-guardians-2-0/25471
- desc: |
  攻撃者を引き寄せて資金を盗もうとするように見せかけ、実際には攻撃者の資金を罠にかけるように設計されたスマートコントラクト。セキュリティ研究や詐欺対策で用いられる。

## Partial Execution Payload Commitments
- ja: 部分的実行ペイロードコミットメント
- related: [Execution Payload, Commitment, EIP-8341]
- auto_added: 2026-07-18
- auto_source_topic_id: 29030
- auto_source_url: https://ethereum-magicians.org/t/eip-8341-partial-execution-payload-commitments/29030
- desc: |
  EIP-8341で提案されている概念で、Ethereumの実行ペイロード全体ではなく、その一部に対して行われるコミットメントです。これにより、データ可用性や検証の効率化が図られる可能性があります。

## Sovereign Space
- ja: ソブリンスペース (主権空間)
- related: [Privacy as Predicate, Observer Removal]
- auto_added: 2026-07-21
- auto_source_topic_id: 25485
- auto_source_url: https://ethresear.ch/t/sovereign-space-when-values-need-architecture/25485
- desc: |
  テクノロジーが提供する、組織の運営者や外部圧力に依存しない真の保証された空間を指します。特に、アーキテクチャの対称性に基づいて、システムの出力がオペレーターの変換に対して不変であるという原則に立脚します。

## Privacy as Predicate
- ja: 述語としてのプライバシー
- related: [Sovereign Space, Cryptographic Model]
- auto_added: 2026-07-21
- auto_source_topic_id: 25485
- auto_source_url: https://ethresear.ch/t/sovereign-space-when-values-need-architecture/25485
- desc: |
  プライバシーを、プロトコルが誰によって操作されるか、規制圧力、あるいは創設組織の存続に関わらず成立する数学的特性として定義するモデルです。アクセス制御に依存する「ポリシーとしてのプライバシー」とは対照的です。

## Observer Contamination
- ja: 観測者汚染
- related: [Observer Removal, Blind Session]
- auto_added: 2026-07-21
- auto_source_topic_id: 25485
- auto_source_url: https://ethresear.ch/t/sovereign-space-when-values-need-architecture/25485
- desc: |
  システム設計において、可視化された投票パターン、評判リスク、審議への社会的圧力などの中間シグナルが漏洩し、集団的意思決定を歪める失敗モードを指します。プロトコルレベルでの能動的な抑制が必要とされます。

## Blind Session
- ja: ブラインドセッション
- related: [Observer Removal, Privacy as Predicate]
- auto_added: 2026-07-21
- auto_source_topic_id: 25485
- auto_source_url: https://ethresear.ch/t/sovereign-space-when-values-need-architecture/25485
- desc: |
  観測者汚染を防ぐための構造的原則として、暗号学的に強制されるセッションです。中間結果が同期復号化されるまでシステムオペレーターを含むすべての参加者から不可視となり、シグナル完全性を確保します。

## Stochastic Exit
- ja: 確率的脱出
- related: [Consensus Threshold, Itô’s Equation, Wiener Process]
- auto_added: 2026-07-21
- auto_source_topic_id: 25485
- auto_source_url: https://ethresear.ch/t/sovereign-space-when-values-need-architecture/25485
- desc: |
  集団シグナルが合意閾値に達しない場合に活性化されるメカニズムです。形式論理が終了する局所的最小値からの脱出を可能にするため、決定論的探索とウィーナー過程（伊藤の式）を組み合わせます。

## Silent, One-Shot threshold encryption
- ja: サイレント・ワンショット閾値暗号 (Silent, One-Shot threshold encryption)
- related: [Threshold encryption]
- auto_added: 2026-07-21
- auto_source_topic_id: 29042
- auto_source_url: https://ethereum-magicians.org/t/encrypt-the-mempool-7-july-22-2026/29042
- desc: |
  閾値暗号の一種で、暗号文の復号鍵が複数の参加者に分散され、一定数以上の参加者が協力することで復号可能になる。特に「サイレント」は通信オーバーヘッドが低いことを、「ワンショット」は一度きりの使用を意味し、特定の暗号スキームを指す。

## Post Quantum transaction signature
- ja: ポスト量子トランザクション署名 (PQTS)
- aliases: [PQTS]
- related: [Post-Quantum Cryptography, Quantum-resistant signature, Transaction]
- auto_added: 2026-07-21
- auto_source_topic_id: 29041
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-transaction-signature-pqts-breakout-12/29041
- desc: |
  量子コンピュータによる攻撃に耐性を持つように設計されたトランザクション署名方式。Ethereumなどのブロックチェーンにおいて、将来的な量子脅威からトランザクションのセキュリティを確保するために研究・開発が進められている。

## Mechanized Functor Tower
- ja: 機械化された関手塔 (Mechanized Functor Tower)
- related: [Coupling Breadth, Natural Transformation, Cross-Domain State Preservation]
- auto_added: 2026-07-22
- auto_source_topic_id: 25491
- auto_source_url: https://ethresear.ch/t/a-mechanized-functor-tower-for-cross-domain-state-preservation/25491
- desc: |
  異なる同期ドメイン間の状態保存を検証するための、形式的に機械化されたフレームワーク。状態の結合強度を階層化された関手としてモデル化し、各レベルが特定の結合の広さ（coupling breadth）に対応する。

## Cross-Domain State Preservation
- ja: クロスドメイン状態保存 (Cross-Domain State Preservation)
- related: [Synchronization Domains, Mechanized Functor Tower]
- auto_added: 2026-07-22
- auto_source_topic_id: 25491
- auto_source_url: https://ethresear.ch/t/a-mechanized-functor-tower-for-cross-domain-state-preservation/25491
- desc: |
  複数の異なるブロックチェーン（ドメイン）間で、資産やデータの状態が整合性を保ちながら維持される特性。特に、あるドメインでの状態遷移が別のドメインでもその法的・意味的効果を維持することを指す。

## Coupling Breadth
- ja: 結合の広さ (Coupling Breadth)
- related: [Mechanized Functor Tower, Synchronization Domains, Asset Degree]
- auto_added: 2026-07-22
- auto_source_topic_id: 25491
- auto_source_url: https://ethresear.ch/t/a-mechanized-functor-tower-for-cross-domain-state-preservation/25491
- desc: |
  資産の状態がいくつのチェーン（ドメイン）にまたがってサポートされているかを示す指標。この概念は、状態保存の強度を階層化する「関手塔」の各レベルを定義するために用いられる。

## Natural Transformation
- ja: 自然変換 (Natural Transformation)
- related: [Functor, Category Theory, Mechanized Functor Tower]
- auto_added: 2026-07-22
- auto_source_topic_id: 25491
- auto_source_url: https://ethresear.ch/t/a-mechanized-functor-tower-for-cross-domain-state-preservation/25491
- desc: |
  カテゴリー理論における概念で、2つの関手間の構造を保存する写像。この文脈では、結合の広さの異なるレベル間で状態を「忘れる」操作が、規制上の状態遷移と可換であることを形式的に証明するために用いられる。

## Aggregate degrees
- ja: 集約度 (Aggregate degrees)
- related: [Coupling Breadth, Asset Degree, Fungibility]
- auto_added: 2026-07-22
- auto_source_topic_id: 25491
- auto_source_url: https://ethresear.ch/t/a-mechanized-functor-tower-for-cross-domain-state-preservation/25491
- desc: |
  異なる宣言された結合の広さ（degree）を持つ単位が単一の表現を共有する場合に、それらをどのように保守的に集約するかという課題。資産の表現力や代替可能性に影響を与える。

## selector management
- ja: セレクター管理
- related: [function selector, facet, modular proxy architectures]
- auto_added: 2026-07-22
- auto_source_topic_id: 29054
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-cento-proxy-index-based-multi-facet-proxy/29054
- desc: |
  モジュラープロキシアーキテクチャにおいて、スマートコントラクトの機能セレクターを登録、更新、削除するプロセス。デプロイ、アップグレード、プロトコル保守を通じて継続的な懸念事項となる。

## routing index
- ja: ルーティングインデックス
- related: [Cento Proxy, facet, protocol routing]
- auto_added: 2026-07-22
- auto_source_topic_id: 29054
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-cento-proxy-index-based-multi-facet-proxy/29054
- desc: |
  Cento Proxyのようなモジュラープロキシアーキテクチャで、特定のファセット（実装モジュール）を一意に識別するために使用されるコンパクトなインデックス。関数セレクターとは独立して、プロトコルルーティングをファセット中心にするための仕組み。

## Gas station network
- ja: ガスステーションネットワーク (GSN)
- aliases: [GSN]
- related: [Account Abstraction]
- auto_added: 2026-07-22
- auto_source_topic_id: 29051
- auto_source_url: https://ethereum-magicians.org/t/erc-1613-gas-station-network/29051
- desc: |
  ユーザーが直接ガス料金を支払うことなく、第三者（リレイヤー）がガス料金を肩代わりし、後でユーザーから回収する仕組みを提供するネットワーク。これにより、ユーザーはETHを保有していなくてもトランザクションを実行できる。

## finalizedBlockHash
- ja: ファイナライズされたブロックハッシュ
- related: [finalization, safeBlockHash, consensus layer]
- auto_added: 2026-07-22
- auto_source_topic_id: 29050
- auto_source_url: https://ethereum-magicians.org/t/fast-confirmation-rule-fcr-12-august-4-2026/29050
- desc: |
  Ethereumのコンセンサスレイヤーにおいて、ファイナライズされたと見なされるブロックのハッシュ。このブロックは、プロトコルによって不可逆であることが保証されます。

## CL node
- ja: CLノード (コンセンサスレイヤーノード)
- aliases: [Consensus Layer node]
- related: [Consensus Layer, EL node, validator]
- auto_added: 2026-07-22
- auto_source_topic_id: 29050
- auto_source_url: https://ethereum-magicians.org/t/fast-confirmation-rule-fcr-12-august-4-2026/29050
- desc: |
  Ethereumのコンセンサスレイヤーを実行するノード。バリデータ機能を担い、ブロックの提案やアテステーションを行います。

## Contract Deactivation
- ja: コントラクト非アクティブ化
- related: [Pause mechanisms, SELFDESTRUCT, terminal lifecycle events]
- auto_added: 2026-07-22
- auto_source_topic_id: 29049
- auto_source_url: https://ethereum-magicians.org/t/contract-deactivation/29049
- desc: |
  スマートコントラクトが一時停止ではなく、永続的に非アクティブ化された状態であることを示す標準的なシグナルです。ウォレットやプロトコルがコントラクトの終焉を確実に検出できるようにすることを目的としています。

## SELFDESTRUCT
- ja: SELFDESTRUCT (自己破壊)
- related: [EIP-6780, EVM]
- auto_added: 2026-07-22
- auto_source_topic_id: 29049
- auto_source_url: https://ethereum-magicians.org/t/contract-deactivation/29049
- desc: |
  Ethereum Virtual Machine (EVM) のオペコードの一つで、コントラクトのコードとストレージを削除し、残りのEtherを転送する機能を持つものです。EIP-6780 (Dencun) 以降、その動作が変更され、コントラクトの完全な削除は特定の条件下でのみ可能となりました。

## One-way state
- ja: 一方向状態
- related: [Contract Deactivation, terminal state]
- auto_added: 2026-07-22
- auto_source_topic_id: 29049
- auto_source_url: https://ethereum-magicians.org/t/contract-deactivation/29049
- desc: |
  スマートコントラクトの状態が、一度ある状態に遷移すると元に戻せない性質を持つことを指します。コントラクトの永続的な非アクティブ化など、不可逆なライフサイクルイベントを表現する際に用いられます。

## renounce upgrade authority
- ja: アップグレード権限の放棄
- related: [upgradeable proxies, immutable contract]
- auto_added: 2026-07-22
- auto_source_topic_id: 29049
- auto_source_url: https://ethereum-magicians.org/t/contract-deactivation/29049
- desc: |
  アップグレード可能なプロキシコントラクトにおいて、将来のロジック変更権限を永続的に放棄する行為です。これにより、プロキシコントラクトの実装が事実上不変となり、セキュリティと信頼性が向上します。

## terminal lifecycle events
- ja: 終端ライフサイクルイベント
- related: [Contract Deactivation, Pause mechanisms]
- auto_added: 2026-07-22
- auto_source_topic_id: 29049
- auto_source_url: https://ethereum-magicians.org/t/contract-deactivation/29049
- desc: |
  スマートコントラクトの運用が永続的に終了するようなイベントを指します。一時的な停止とは異なり、コントラクトが二度とアクティブな状態に戻らないことを意味し、非アクティブ化などのメカニズムでシグナルされます。

## NFT-Bound Prediction Markets
- ja: NFT紐付け型予測市場
- related: [ERC-721, Prediction Market]
- auto_added: 2026-07-22
- auto_source_topic_id: 29046
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-nft-bound-prediction-markets-lmsr-pricing-on-chain-state/29046
- desc: |
  ERC-721トークンと1対1で紐付けられたバイナリ（YES/NO）予測市場。市場の状態がオンチェーンに保存され、トークンのtokenURI SVGとしてレンダリングされるため、NFT自体が自己完結型の市場として機能する。

## Logarithmic Market Scoring Rule
- ja: 対数市場スコアリングルール (LMSR)
- aliases: [LMSR]
- related: [Prediction Market, Automated Market Maker]
- auto_added: 2026-07-22
- auto_source_topic_id: 29046
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-nft-bound-prediction-markets-lmsr-pricing-on-chain-state/29046
- desc: |
  予測市場における価格決定アルゴリズムの一つ。市場メーカーの損失を流動性パラメータbによって限定し、流動性に関わらず常に価格を提示できる特性を持つ。本提案では、ネイティブ通貨で決済されるオンチェーンLMSRが採用されている。

## optimistic dispute window
- ja: オプティミスティック紛争期間
- related: [Oracle, Dispute Resolution]
- auto_added: 2026-07-22
- auto_source_topic_id: 29046
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-nft-bound-prediction-markets-lmsr-pricing-on-chain-state/29046
- desc: |
  予測市場の解決プロセスにおいて、オラクルによる結果提案後に設定される異議申し立てが可能な期間。この期間中に異議が申し立てられなければ、提案された結果が確定する。

## launch primitive
- ja: ローンチプリミティブ
- related: [Token Launch, Memecoin]
- auto_added: 2026-07-22
- auto_source_topic_id: 29046
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-nft-bound-prediction-markets-lmsr-pricing-on-chain-state/29046
- desc: |
  新しいトークンやアプリケーションを立ち上げるための基本的な構成要素やメカニズム。本提案では、従来のミームコインのような不透明なトークンではなく、予測市場自体が次世代のローンチプリミティブとなる可能性を提唱している。

## fixed-point math
- ja: 固定小数点演算
- related: [Smart Contract, Precision]
- auto_added: 2026-07-22
- auto_source_topic_id: 29046
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-nft-bound-prediction-markets-lmsr-pricing-on-chain-state/29046
- desc: |
  浮動小数点数ではなく、小数点以下の桁数を固定して数値を表現する演算方法。スマートコントラクトにおいて、浮動小数点演算の非決定性や精度問題を回避し、正確な計算を保証するために用いられる。

## Positive-Sum Coordination
- ja: 正の和の協調 (ポジティブサム・コーディネーション)
- related: [Incentive Design, Microstructure Design]
- auto_added: 2026-07-23
- auto_source_topic_id: 25505
- auto_source_url: https://ethresear.ch/t/positive-sum-microstructure-design-is-the-last-bottleneck/25505
- desc: |
  参加者全員が協力することで、個々の利益だけでなくシステム全体の利益も最大化されるような経済的インセンティブ設計。暗号経済システムにおいて、抽出的なゼロサムゲームではなく、協調的な成果を目指す上で重要な概念。

## Incentive Design
- ja: インセンティブ設計
- related: [Positive-Sum Coordination, Mechanism Design]
- auto_added: 2026-07-23
- auto_source_topic_id: 25505
- auto_source_url: https://ethresear.ch/t/positive-sum-microstructure-design-is-the-last-bottleneck/25505
- desc: |
  参加者の行動を特定の望ましい方向へ誘導するために、経済的報酬や罰則などのインセンティブ構造を設計すること。特にブロックチェーンや暗号経済システムにおいて、プロトコルの安全性や効率性、特定の行動パターンを促すために不可欠な研究分野。

## Microstructure Design
- ja: マイクロストラクチャー設計
- related: [Incentive Design, Positive-Sum Coordination, MEV]
- auto_added: 2026-07-23
- auto_source_topic_id: 25505
- auto_source_url: https://ethresear.ch/t/positive-sum-microstructure-design-is-the-last-bottleneck/25505
- desc: |
  金融市場における取引の仕組みやルール、参加者の行動パターンなどを設計すること。暗号資産の文脈では、オンチェーンの取引市場（AMMなど）やオークションメカニズムなど、特定の市場構造を構築し、望ましい経済的特性（例：正の和の協調）を実現するための設計を指す。

## Ordering Rent
- ja: オーダリング・レント
- related: [MEV, Sandwich Attack]
- auto_added: 2026-07-23
- auto_source_topic_id: 25505
- auto_source_url: https://ethresear.ch/t/positive-sum-microstructure-design-is-the-last-bottleneck/25505
- desc: |
  ブロックチェーンにおいて、トランザクションの順序を操作することで得られる超過利益。特にサンドイッチ攻撃などで、特定の取引の前後で売買を行うことで、被害者の価格インパクトを捕捉する形で発生するMEVの一種。

## Impossibility Triad
- ja: 不可能性の三つ組 (インポッシビリティ・トライアド)
- related: [Mechanism Design, Game Theory]
- auto_added: 2026-07-23
- auto_source_topic_id: 25505
- auto_source_url: https://ethresear.ch/t/positive-sum-microstructure-design-is-the-last-bottleneck/25505
- desc: |
  メカニズム設計において、同時に達成することが困難または不可能な複数の望ましい特性（例：効率性、戦略耐性、予算均衡など）の組み合わせを指す。ギバード-サタースウェイトの定理、グリーン-ラフォン/グローブスの定理、マイヤーソン-サタースウェイトの定理などが代表的。

## Mechanism design
- ja: メカニズム設計
- related: [Incentive design, DeFi protocols]
- auto_added: 2026-07-23
- auto_source_topic_id: 25496
- auto_source_url: https://ethresear.ch/t/call-for-papers-blockchain-defi-and-ai/25496
- desc: |
  参加者のインセンティブを調整し、望ましい結果を達成するためのルールや制度を設計する経済学の分野。DeFiプロトコルにおいて、ユーザーの行動を誘導し、システムの安定性や効率性を確保するために不可欠な概念です。

## Token engineering
- ja: トークンエンジニアリング
- related: [Tokenomics, Mechanism design, Incentive design]
- auto_added: 2026-07-23
- auto_source_topic_id: 25496
- auto_source_url: https://ethresear.ch/t/call-for-papers-blockchain-defi-and-ai/25496
- desc: |
  ブロックチェーンベースのシステムにおけるトークンの経済的、技術的、社会的な側面を設計・分析する学際的な分野。トークンエコノミクスの持続可能性と効率性を確保することを目的とします。

## AI agents
- ja: AIエージェント
- related: [LLM trading agents, Decentralized markets]
- auto_added: 2026-07-23
- auto_source_topic_id: 25496
- auto_source_url: https://ethresear.ch/t/call-for-papers-blockchain-defi-and-ai/25496
- desc: |
  自律的に環境を認識し、目標を達成するために行動する人工知能プログラム。分散型市場やDeFiにおいて、取引戦略の実行、プロトコル管理、データ分析など、様々な役割を果たすことが期待されています。

## Market microstructure with on-chain data
- ja: オンチェーンデータを用いた市場ミクロ構造分析
- related: [Market microstructure, On-chain data, DeFi markets, MEV]
- auto_added: 2026-07-23
- auto_source_topic_id: 25496
- auto_source_url: https://ethresear.ch/t/call-for-papers-blockchain-defi-and-ai/25496
- desc: |
  金融市場における取引の仕組みや価格形成のプロセスを、ブロックチェーン上の公開データ（オンチェーンデータ）を用いて分析する研究分野。DeFi市場の効率性、流動性、MEVなどの特性を理解するために用いられます。

## Security Manifest
- ja: セキュリティマニフェスト
- related: [Pre-Mempool Validation, State Invariants]
- auto_added: 2026-07-23
- auto_source_topic_id: 29056
- auto_source_url: https://ethereum-magicians.org/t/idea-draft-protocol-level-smart-contract-invariant-protection-via-pre-mempool-validation-security-manifests/29056
- desc: |
  スマートコントラクトの意図された挙動、状態の境界、制限された変更などを詳細に記述した標準化されたドキュメント。トランザクション実行前にコントラクトのセキュリティを強制するために使用されます。

## Pre-Mempool Validation
- ja: プレ・メンプール検証
- related: [Security Manifest, Mempool]
- auto_added: 2026-07-23
- auto_source_topic_id: 29056
- auto_source_url: https://ethereum-magicians.org/t/idea-draft-protocol-level-smart-contract-invariant-protection-via-pre-mempool-validation-security-manifests/29056
- desc: |
  トランザクションが標準的なメンプールに入る前に、そのトランザクションがスマートコントラクトのセキュリティマニフェストに違反していないかを検証するプロセス。ゼロデイエクスプロイトを防ぐことを目的とします。

## Infrastructure-Layer Gatekeeper
- ja: インフラ層ゲートキーパー
- related: [Security Manifest, Pre-Mempool Validation]
- auto_added: 2026-07-23
- auto_source_topic_id: 29056
- auto_source_url: https://ethereum-magicians.org/t/idea-draft-protocol-level-smart-contract-invariant-protection-via-pre-mempool-validation-security-manifests/29056
- desc: |
  スマートコントラクトの意図された挙動を強制し、不正なトランザクションが実行されるのを防ぐために、プロトコルレベルで機能するセキュリティメカニズム。プレ・メンプール検証を通じて機能します。

## Specialized Builder Network
- ja: 特殊化されたビルダーネットワーク
- related: [Builder, Pre-Mempool Validation]
- auto_added: 2026-07-23
- auto_source_topic_id: 29056
- auto_source_url: https://ethereum-magicians.org/t/idea-draft-protocol-level-smart-contract-invariant-protection-via-pre-mempool-validation-security-manifests/29056
- desc: |
  保護されたスマートコントラクトをターゲットとするトランザクションに対し、高度な非決定論的チェック（AI/ML脅威モデリングなど）を実行するために設計された、通常のビルダーネットワークとは異なる専門のネットワークです。

## Committee Signature
- ja: 委員会署名
- related: [Cryptographic Proof]
- auto_added: 2026-07-23
- auto_source_topic_id: 29056
- auto_source_url: https://ethereum-magicians.org/t/idea-draft-protocol-level-smart-contract-invariant-protection-via-pre-mempool-validation-security-manifests/29056
- desc: |
  複数のエンティティ（委員会）が協力して生成する署名。この文脈では、特殊化されたネットワークのノードがトランザクションの安全性を検証した後、その検証結果を証明するために使用されます。

## Over-collateralization
- ja: 過剰担保（過剰担保化）
- related: [Collateral]
- auto_added: 2026-07-24
- auto_source_topic_id: 25510
- auto_source_url: https://ethresear.ch/t/institutional-rwas-mitigating-t-0-risks-via-hardcoded-200-collateral/25510
- desc: |
  担保として提供される資産の価値が、借り入れた資産の価値を上回る状態を指します。DeFiプロトコルにおいて、価格変動リスクや流動性リスクを吸収するために用いられ、本稿ではRWAのT+0決済リスク軽減策として200%の比率が提案されています。

## Protocol-level bank run
- ja: プロトコルレベルの取り付け騒ぎ
- related: [Bank run, Liquidity crisis]
- auto_added: 2026-07-24
- auto_source_topic_id: 25510
- auto_source_url: https://ethresear.ch/t/institutional-rwas-mitigating-t-0-risks-via-hardcoded-200-collateral/25510
- desc: |
  分散型金融プロトコルにおいて、ユーザーが同時に大量の資産引き出し（償還）を要求することで、プロトコルの流動性準備が枯渇し、システムが機能不全に陥る現象です。特にRWAトークン化において、オンチェーンの即時決済と原資産の非流動性のミスマッチにより発生リスクが高まります。

## T+0 settlement
- ja: T+0決済（即時決済）
- aliases: [Instant settlement]
- related: [On-chain settlement, RWA tokenization]
- auto_added: 2026-07-24
- auto_source_topic_id: 25510
- auto_source_url: https://ethresear.ch/t/institutional-rwas-mitigating-t-0-risks-via-hardcoded-200-collateral/25510
- desc: |
  取引が成立したその日のうちに決済が完了する方式を指します。オンチェーン環境では技術的に可能ですが、実世界の非流動性資産（RWA）をトークン化した場合、原資産の決済タイムラインとの間に「時間的デルタ」が生じ、流動性ミスマッチのリスクを引き起こします。

## On-chain safeguards
- ja: オンチェーンセーフガード
- related: [Smart contract logic, Risk management]
- auto_added: 2026-07-24
- auto_source_topic_id: 25510
- auto_source_url: https://ethresear.ch/t/institutional-rwas-mitigating-t-0-risks-via-hardcoded-200-collateral/25510
- desc: |
  ブロックチェーン上のスマートコントラクトロジックに直接組み込まれた、システムを保護するためのメカニズムやルールを指します。本稿では、RWAの流動性リスクを軽減するため、オフチェーンの現金バッファに代わる構造的な解決策として、決定論的な過剰担保化が提案されています。

## Immutable Cryptographic Predicates
- ja: 不変な暗号学的述語
- related: [On-chain Governance]
- auto_added: 2026-07-24
- auto_source_topic_id: 25503
- auto_source_url: https://ethresear.ch/t/mechanism-design-failure-modes/25503
- desc: |
  組織の運営者に関わらず保持されるよう、値を不変な暗号学的述語としてエンコードする設計。オンチェーンガバナンスにおいて、特定の価値やルールを数学的に強制するが、その述語自体の選択は初期の主観性を伴う。

## Adversarially Reachable
- ja: 敵対的に到達可能
- related: [Mechanism Design, Vulnerability]
- auto_added: 2026-07-24
- auto_source_topic_id: 25503
- auto_source_url: https://ethresear.ch/t/mechanism-design-failure-modes/25503
- desc: |
  システム内のラベルやプロパティが、敵対者によって自由に操作または影響を受け、その結果、システムの義務や挙動が意図せず変更されてしまう状態を指す。客観性が求められる場面で主観的なプロキシが使われた場合に発生する脆弱性。

## Work-backed Conflict Resolution
- ja: 作業担保型紛争解決
- related: [Consensus, Proof of Work]
- auto_added: 2026-07-24
- auto_source_topic_id: 25503
- auto_source_url: https://ethresear.ch/t/mechanism-design-failure-modes/25503
- desc: |
  コンセンサスシステムにおいて、紛争解決の客観的な根拠として、計算作業などの検証可能な「作業」を必要とするメカニズム。主観的な評判やネットワーク接続性に基づく解決策と対比され、より堅牢な客観性を提供する。

## Received Floor
- ja: 受容された基盤
- related: [On-chain Governance, Mechanism Design]
- auto_added: 2026-07-24
- auto_source_topic_id: 25503
- auto_source_url: https://ethresear.ch/t/mechanism-design-failure-modes/25503
- desc: |
  ガバナンスシステムにおいて、そのアーキテクチャが強制できるが、システム自体が生成できない根本的な価値や原則。システム外から「受容」される必要があり、自己完結的なガバナンス設計の限界を示す。

## Per-lot Individuation
- ja: ロットごとの個別化
- related: [Cross-domain State, Asset Management]
- auto_added: 2026-07-24
- auto_source_topic_id: 25503
- auto_source_url: https://ethresear.ch/t/mechanism-design-failure-modes/25503
- desc: |
  異なる特性を持つ単位が混在する残高（例：異なる「度合い」を持つ資産）を扱う際に、それらを個別の「ロット」として区別し、それぞれの特性を維持するアプローチ。これにより、高コストな特性がそれを望む当事者に帰属し、敵対的な操作を防ぐ。

## Financial Lease
- ja: ファイナンシャルリース (オンチェーン)
- related: [ERC-8348, Titled Asset]
- auto_added: 2026-07-24
- auto_source_topic_id: 29076
- auto_source_url: https://ethereum-magicians.org/t/erc-8348-financial-lease/29076
- desc: |
  貸し手が資産を調達し、借り手が分割払いを支払い、通常は最終的に購入オプションを持つ信用供与契約を、ブロックチェーン上で標準化するための概念。NFTレンタルとは異なり、分割払い、延滞、購入オプション、譲渡の概念を含む。

## Lessor position as ERC-721
- ja: ERC-721としての貸し手ポジション
- related: [Financial Lease, ERC-721]
- auto_added: 2026-07-24
- auto_source_topic_id: 29076
- auto_source_url: https://ethereum-magicians.org/t/erc-8348-financial-lease/29076
- desc: |
  ファイナンシャルリース契約における貸し手の権利をERC-721トークンとして表現する設計パターン。これにより、リース契約の譲渡や証券化がNFTの転送として扱え、既存のマーケットプレイスやカストディツールとの互換性が生まれる。

## On-chain delinquency tiers
- ja: オンチェーン延滞ティア
- aliases: [Delinquency tiers, InArrears, InDefault]
- related: [Financial Lease]
- auto_added: 2026-07-24
- auto_source_topic_id: 29076
- auto_source_url: https://ethereum-magicians.org/t/erc-8348-financial-lease/29076
- desc: |
  ファイナンシャルリース契約において、延滞状態をブロックチェーン上で管理するための二段階の分類。客観的に支払期日を過ぎた「InArrears」と、正式な宣言を必要とする「InDefault」があり、各管轄区域の法的要件を考慮して設計される。

## Payment imputation
- ja: 支払い充当 (オンチェーン)
- related: [Financial Lease]
- auto_added: 2026-07-24
- auto_source_topic_id: 29076
- auto_source_url: https://ethereum-magicians.org/t/erc-8348-financial-lease/29076
- desc: |
  オンチェーンのファイナンシャルリース契約において、受け取った支払いをペナルティ、利息、元本にどのように割り当てるかという会計処理。管轄区域によって強制される順序が異なるため、標準では順序を特定せず、オフチェーンでの再構築を可能にする設計が検討される。

## Tokenized lessee position
- ja: トークン化された借り手ポジション
- aliases: [Lessee as a position]
- related: [Financial Lease, ERC-721]
- auto_added: 2026-07-24
- auto_source_topic_id: 29076
- auto_source_url: https://ethereum-magicians.org/t/erc-8348-financial-lease/29076
- desc: |
  ファイナンシャルリース契約における借り手の権利をトークンとして表現する概念。これにより、リース・トゥ・オウンのセカンダリマーケットを可能にするが、コンプライアンスの複雑さが増す可能性があるため、その導入が検討される。

## Multi-lingual Clear Signing
- ja: 多言語対応クリア署名
- related: [Clear Signing]
- auto_added: 2026-07-24
- auto_source_topic_id: 29072
- auto_source_url: https://ethereum-magicians.org/t/erc-8346-translation-files-for-erc-7730-descriptors/29072
- desc: |
  ERC-7730の記述子など、Ethereumトランザクションやメッセージの人間が読める形式の署名（クリア署名）を多言語で提供するための仕組み。ユーザーが署名内容を理解しやすくすることで、セキュリティとアクセシビリティを向上させることを目指します。

## ERC-7730 Descriptors
- ja: ERC-7730記述子
- related: [ERC-7730]
- auto_added: 2026-07-24
- auto_source_topic_id: 29072
- auto_source_url: https://ethereum-magicians.org/t/erc-8346-translation-files-for-erc-7730-descriptors/29072
- desc: |
  ERC-7730で定義される、スマートコントラクトやアカウント抽象化の文脈における特定のデータ構造やインターフェースを記述するための標準化された形式。ユーザーが署名する内容を明確に理解できるようにするための情報を提供します。

## Top-up sync
- ja: トップアップ同期
- related: [sync, EIP]
- auto_added: 2026-07-24
- auto_source_topic_id: 29060
- auto_source_url: https://ethereum-magicians.org/t/ssz-engine-api-call-3-july-24-2026/29060
- desc: |
  Ethereumクライアントの同期メカニズムの一つで、既存の同期プロセスを補完するために設計されたものです。プロトコルへの組み込みが検討されており、EIPとして提案される可能性があります。

## Censorship Lever
- ja: 検閲レバー
- related: [Protocol Layer, Censorship Resistance, Governance]
- auto_added: 2026-07-25
- auto_source_topic_id: 25531
- auto_source_url: https://ethresear.ch/t/censoring-transactions-at-the-protocol-layer/25531
- desc: |
  Ethereumプロトコル層に実装されることが提案されている、特定の悪意あるスマートコントラクトやトランザクションを検閲するためのメカニズム。ガバナンスによって決定されたルールに基づき、プロトコル自体が検閲を実行する能力を持つことを指します。

## liquidity layer
- ja: 流動性レイヤー
- related: [DeFi, Layer 2]
- auto_added: 2026-07-25
- auto_source_topic_id: 25530
- auto_source_url: https://ethresear.ch/t/1000-year-hyper-reality-stress-test-why-the-current-capitalist-system-programmatically-destroys-the-economy-and-how-shiono-os-defends-against-shocks-and-human-avarice/25530
- desc: |
  分散型金融（DeFi）プロトコルやレイヤー2ソリューションにおいて、資産の流動性を提供する基盤となる層。取引や貸し借りなどの金融活動を円滑に行うために不可欠な要素です。

## Offline state migration
- ja: オフライン状態移行
- related: [Partitioned Binary Tree, Merkle Patricia Trie]
- auto_added: 2026-07-25
- auto_source_topic_id: 29089
- auto_source_url: https://ethereum-magicians.org/t/eip-8347-offline-state-migration-to-the-pbt/29089
- desc: |
  Ethereumの状態を、コンセンサスに不可欠なパスから外れたオフライン環境で、あるデータ構造から別のデータ構造へ移行させるプロセス。これにより、メインチェーンの処理に影響を与えずに大規模な状態変更が可能となる。

## PBT snapshot
- ja: PBTスナップショット
- related: [Partitioned Binary Tree, offline state migration]
- auto_added: 2026-07-25
- auto_source_topic_id: 29089
- auto_source_url: https://ethereum-magicians.org/t/eip-8347-offline-state-migration-to-the-pbt/29089
- desc: |
  Partitioned Binary Tree (PBT) 形式で表現されたEthereumの完全な状態の検証可能なコピー。オフライン状態移行の成果物として配布され、チェーンの最新状態に追いつくために使用される。

## shadow-root
- ja: シャドウルート
- related: [Partitioned Binary Tree, state migration, dual-check verification procedure]
- auto_added: 2026-07-25
- auto_source_topic_id: 29089
- auto_source_url: https://ethereum-magicians.org/t/eip-8347-offline-state-migration-to-the-pbt/29089
- desc: |
  Ethereumの状態移行プロセスにおける監視概念。新しい状態ツリー（PBTなど）のルートハッシュを、メインのコンセンサスパスに影響を与えずに並行して計算・追跡することで、移行の健全性を検証するために用いられる。

## dual-check verification procedure
- ja: デュアルチェック検証手順
- related: [PBT snapshot, shadow-root, offline state migration]
- auto_added: 2026-07-25
- auto_source_topic_id: 29089
- auto_source_url: https://ethereum-magicians.org/t/eip-8347-offline-state-migration-to-the-pbt/29089
- desc: |
  オフラインで生成されたPBTスナップショットの正当性を確認するための検証プロセス。既存のMPTと新しいPBTの両方の状態を比較・検証することで、移行の正確性と安全性を保証する。

## Confidential Agent Policy Verdicts
- ja: 機密エージェントポリシー判定 (Confidential Agent Policy Verdicts)
- related: [autonomous agent, zero-knowledge proof, Policy Domain, Guard contract]
- auto_added: 2026-07-25
- auto_source_topic_id: 29088
- auto_source_url: https://ethereum-magicians.org/t/draft-idea-confidential-agent-policy-verdicts/29088
- desc: |
  自律エージェントのアクションに対して、実行前に許可/拒否を決定するインターフェース。ポリシーの内容をオンチェーンで開示することなく、ゼロ知識証明を用いてその決定の正当性を検証します。

## Policy Domain
- ja: ポリシードメイン (Policy Domain)
- related: [Confidential Agent Policy Verdicts, Guard contract, policy interpreter]
- auto_added: 2026-07-25
- auto_source_topic_id: 29088
- auto_source_url: https://ethereum-magicians.org/t/draft-idea-confidential-agent-policy-verdicts/29088
- desc: |
  機密エージェントポリシー判定システムにおいて、エージェントのアクションを秘密のルールセットに対して評価し、ゼロ知識証明を生成するオフチェーンエンジンを管理するエンティティです。ポリシーの機密性を維持しつつ、オンチェーンでの検証を可能にします。

## Guard contract
- ja: ガードコントラクト (Guard contract)
- related: [Confidential Agent Policy Verdicts, Policy Domain, zero-knowledge proof]
- auto_added: 2026-07-25
- auto_source_topic_id: 29088
- auto_source_url: https://ethereum-magicians.org/t/draft-idea-confidential-agent-policy-verdicts/29088
- desc: |
  機密エージェントポリシー判定システムにおいて、Policy Domainが生成したゼロ知識証明をオンチェーンで検証するスマートコントラクトです。証明が有効であればエージェントのアクションの実行を許可し、無効であれば拒否します。

## Policy interpreter
- ja: ポリシーインタープリター (Policy interpreter)
- related: [zero-knowledge proof, Verification key churn, program commitment]
- auto_added: 2026-07-25
- auto_source_topic_id: 29088
- auto_source_url: https://ethereum-magicians.org/t/draft-idea-confidential-agent-policy-verdicts/29088
- desc: |
  ゼロ知識証明システムにおいて、ポリシー自体をコンパイルするのではなく、固定されたインタープリタープログラムの実行を証明する手法です。これにより、ポリシーの変更があっても検証キーを更新する必要がなく、ルールセットをプライベートな証人として渡すことで機密性を保ちます。

## Verification key churn
- ja: 検証キーの頻繁な更新 (Verification key churn)
- related: [Policy interpreter, zero-knowledge proof, program commitment]
- auto_added: 2026-07-25
- auto_source_topic_id: 29088
- auto_source_url: https://ethereum-magicians.org/t/draft-idea-confidential-agent-policy-verdicts/29088
- desc: |
  ゼロ知識証明システムにおいて、ポリシーやプログラムが変更されるたびに新しい検証キーが生成され、それに伴いオンチェーンの検証コントラクトも頻繁にデプロイし直す必要がある問題です。ポリシーインタープリターの導入によりこの問題は回避されます。

## Proprietary AMM
- ja: プロプライエタリAMM (PropAMM)
- aliases: [PropAMM]
- related: [AMM, Request for Quotes (RFQ), Aggregator]
- auto_added: 2026-07-27
- auto_source_topic_id: 25543
- auto_source_url: https://ethresear.ch/t/proprietary-amms-and-ethereum/25543
- desc: |
  マーケットメーカーが積極的に流動性を管理し、オフチェーンの価格モデルに基づいて頻繁にパラメータを更新するスマートコントラクトベースのAMM。Solanaで普及しており、Ethereumでの導入も検討されている。

## Application-Controlled Execution
- ja: アプリケーション制御型実行 (ACE)
- aliases: [ACE]
- related: [Proposer-Builder Separation (PBS), MEV, Censorship Resistance]
- auto_added: 2026-07-27
- auto_source_topic_id: 25543
- auto_source_url: https://ethresear.ch/t/proprietary-amms-and-ethereum/25543
- desc: |
  プロトコルまたはコミットメントメカニズムによってトランザクションの順序付けが強制される仕組み。SolanaのPropAMMではその弱い形式が実現されており、Ethereumではプロトコルレベルでの導入が議論されている。

## Loss-Versus-Rebalancing
- ja: リバランス損失 (LVR)
- aliases: [LVR]
- related: [AMM, Arbitrage]
- auto_added: 2026-07-27
- auto_source_topic_id: 25543
- auto_source_url: https://ethresear.ch/t/proprietary-amms-and-ethereum/25543
- desc: |
  AMMの流動性プロバイダーが、外部市場（CEXなど）での価格変動により、アービトラージトレーダーによって被る損失。伝統的なAMMモデルの主要な欠点の一つとされる。

## CEX-DEX arbitrage auction
- ja: CEX-DEXアービトラージオークション
- related: [Arbitrage, MEV, Proposer-Builder Separation (PBS)]
- auto_added: 2026-07-27
- auto_source_topic_id: 25543
- auto_source_url: https://ethresear.ch/t/proprietary-amms-and-ethereum/25543
- desc: |
  中央集権型取引所（CEX）と分散型取引所（DEX）間の価格差を利用したアービトラージ機会を、ブロックプロデューサーがオークションにかける行為。プロデューサーの利益最大化戦略として言及される。

## Agent Memory State Registry
- ja: エージェントメモリ状態レジストリ (ERC-8337)
- related: [ERC-8337, Memory Space, ExperienceDelta]
- auto_added: 2026-07-27
- auto_source_topic_id: 29098
- auto_source_url: https://ethereum-magicians.org/t/erc-8337-agent-memory-state/29098
- desc: |
  自律エージェントのメモリ状態の検証可能なバージョン管理を可能にするERC-8337で定義されたシステム。メモリの内容自体はオンチェーンに置かず、その状態の進化の検証可能な履歴を管理します。

## Memory Space
- ja: メモリースペース
- related: [Agent Memory State Registry, ExperienceDelta]
- auto_added: 2026-07-27
- auto_source_topic_id: 29098
- auto_source_url: https://ethereum-magicians.org/t/erc-8337-agent-memory-state/29098
- desc: |
  ERC-8337において、自律エージェントのメモリ状態を識別し、その進化を追跡するための論理的なコンテナ。各メモリースペースは、初期コントローラーに暗号学的にバインドされ、一意の線形履歴を持ちます。

## ExperienceDelta
- ja: エクスペリエンスデルタ
- related: [Memory Space, Transition ID, deltaCommitment, provenanceCommitment, locatorCommitment]
- auto_added: 2026-07-27
- auto_source_topic_id: 29098
- auto_source_url: https://ethereum-magicians.org/t/erc-8337-agent-memory-state/29098
- desc: |
  ERC-8337で定義される、エージェントのメモリ状態の更新を表す固定幅の構造体。spaceId、sequence、prevStateRoot、deltaCommitmentなどのフィールドを含み、状態遷移の検証可能なコミットメントを提供します。

## Sequenced State Machine
- ja: シーケンス化された状態マシン
- related: [flat anchor, state-transition rule]
- auto_added: 2026-07-27
- auto_source_topic_id: 29098
- auto_source_url: https://ethereum-magicians.org/t/erc-8337-agent-memory-state/29098
- desc: |
  ERC-8337の核となるメカニズムで、エージェントのメモリ状態の進化を監査可能な履歴として提供します。各状態コミットメントが前の状態に暗号学的にバインドされ、状態の巻き戻しやスキップ、矛盾する履歴の並行発生を検出できます。

## Transition ID
- ja: トランジションID
- related: [ExperienceDelta, Next State Root]
- auto_added: 2026-07-27
- auto_source_topic_id: 29098
- auto_source_url: https://ethereum-magicians.org/t/erc-8337-agent-memory-state/29098
- desc: |
  ERC-8337において、ExperienceDelta構造体のEIP-712 hashStructから導出される一意の識別子。このIDは、状態遷移の正当性を検証し、次の状態ルートを計算する際に使用されます。

## Conditional Tokens Framework
- ja: コンディショナル・トークン・フレームワーク (CTF)
- aliases: [CTF]
- related: [Prediction Market, Outcome Shares]
- auto_added: 2026-07-28
- auto_source_topic_id: 29106
- auto_source_url: https://ethereum-magicians.org/t/erc-tba-prediction-market-ctf-wrapper/29106
- desc: |
  Gnosisが提供する、予測市場の成果物を表現するためのフレームワーク。特定の条件付きイベントの結果に基づいてトークン化されたポジションを作成・管理する。

## ICTFWrapper
- ja: ICTFラッパー
- aliases: [Wrapper]
- related: [ICTFWrapperFactory, ERC-20, ERC-1155]
- auto_added: 2026-07-28
- auto_source_topic_id: 29106
- auto_source_url: https://ethereum-magicians.org/t/erc-tba-prediction-market-ctf-wrapper/29106
- desc: |
  Conditional Tokens Framework (CTF) のERC-1155ポジションをERC-20トークンとしてラップするための標準インターフェース。これにより、CTFポジションをDeFiプロトコルで利用しやすくなる。

## ICTFWrapperFactory
- ja: ICTFラッパーファクトリー
- aliases: [Factory]
- related: [ICTFWrapper, Conditional Tokens Framework]
- auto_added: 2026-07-28
- auto_source_topic_id: 29106
- auto_source_url: https://ethereum-magicians.org/t/erc-tba-prediction-market-ctf-wrapper/29106
- desc: |
  ICTFWrapperコントラクトをデプロイ・登録し、CTFポジションの完全なセット操作（splitやmerge）を提供する標準インターフェース。各ラッパーのパラメータを管理する。

## Complete-set operations
- ja: 完全セット操作
- aliases: [split, merge]
- related: [Conditional Tokens Framework, ICTFWrapperFactory]
- auto_added: 2026-07-28
- auto_source_topic_id: 29106
- auto_source_url: https://ethereum-magicians.org/t/erc-tba-prediction-market-ctf-wrapper/29106
- desc: |
  Conditional Tokens Framework (CTF) において、担保トークンを予測市場の全成果物シェア（完全セット）に分割したり、その完全セットを担保トークンに戻したりする操作。splitとmergeが代表的。

## Minimal-proxy clones
- ja: ミニマルプロキシクローン
- aliases: [Minimal proxy, Clones]
- related: [Smart Contract Deployment]
- auto_added: 2026-07-28
- auto_source_topic_id: 29106
- auto_source_url: https://ethereum-magicians.org/t/erc-tba-prediction-market-ctf-wrapper/29106
- desc: |
  スマートコントラクトのデプロイコストを削減するためのパターン。マスターコントラクトのロジックを指し示す軽量なプロキシコントラクトを多数デプロイすることで、効率的なコントラクトインスタンスの作成を可能にする。

## testing_commitBlockV1
- ja: testing_commitBlockV1 (ブロックコミットテストV1)
- related: [execution-apis, RPC]
- auto_added: 2026-07-28
- auto_source_topic_id: 29103
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-31-july-27-2026/29103
- desc: |
  Ethereumの実行レイヤーAPIで、テスト目的でブロックをコミットするためのRPCメソッドのバージョン1。テスト環境でのブロック処理の検証に使用される。

## callTracer
- ja: callTracer (コールトレーサー)
- related: [tracing, debugging]
- auto_added: 2026-07-28
- auto_source_topic_id: 29103
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-31-july-27-2026/29103
- desc: |
  Ethereumのトランザクション実行を詳細に追跡し、その内部コール構造やガスの使用状況などを可視化するためのデバッグツール。開発者がスマートコントラクトの挙動を理解するのに役立つ。

## two-dimensional gas
- ja: 二次元ガス
- related: [EIP-8037, gas]
- auto_added: 2026-07-28
- auto_source_topic_id: 29103
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-31-july-27-2026/29103
- desc: |
  EIP-8037で提案されている、Ethereumのガス計算モデル。従来の単一のガス消費量だけでなく、異なるリソース（例：CPU時間とストレージアクセス）を二次元的に考慮する。

## eth_subscribe
- ja: eth_subscribe (イーサリアム購読)
- related: [RPC, event subscription]
- auto_added: 2026-07-28
- auto_source_topic_id: 29103
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-31-july-27-2026/29103
- desc: |
  EthereumのJSON-RPC APIで提供されるメソッドの一つで、クライアントがブロックの確定、ログイベント、新しいトランザクションなどの特定のイベントをリアルタイムで購読するために使用される。

## Private sequencers
- ja: プライベートシーケンサー
- related: [Sequencer, MEV, L2 rollup, Order flow]
- auto_added: 2026-07-29
- auto_source_topic_id: 25562
- auto_source_url: https://ethresear.ch/t/can-a-cex-microstructure-signal-survive-ethereum-execution-latency-and-mev/25562
- desc: |
  L2ロールアップにおいて、トランザクションの順序付けを特定のエンティティが管理し、通常はMEVの悪影響を軽減するために、ユーザーのトランザクションを非公開で処理するシーケンサー。

## Validium
- ja: Validium (バリディウム)
- related: [L2 rollup, ZK rollup, Data availability]
- auto_added: 2026-07-29
- auto_source_topic_id: 25562
- auto_source_url: https://ethresear.ch/t/can-a-cex-microstructure-signal-survive-ethereum-execution-latency-and-mev/25562
- desc: |
  データ可用性保証をオフチェーンに置くことで、ZKロールアップよりも高いスケーラビリティを実現するL2スケーリングソリューションの一種。データはオフチェーンで管理されるが、その正当性はオンチェーンのZK証明によって検証される。

## Private order flow
- ja: プライベートオーダーフロー
- related: [Order flow, MEV, Sequencer, Mempool]
- auto_added: 2026-07-29
- auto_source_topic_id: 25562
- auto_source_url: https://ethresear.ch/t/can-a-cex-microstructure-signal-survive-ethereum-execution-latency-and-mev/25562
- desc: |
  ユーザーがトランザクションを公開のMempoolに送信する代わりに、特定のエンティティ（例：ビルダーやシーケンサー）に直接送信するトランザクションの流れ。MEVの悪影響を軽減し、より良い執行を試みるために利用される。

## CEX–DEX convergence
- ja: CEX-DEXコンバージェンス (CEX-DEX収束)
- related: [Arbitrage, Market microstructure, Decentralized exchange, Centralized exchange]
- auto_added: 2026-07-29
- auto_source_topic_id: 25562
- auto_source_url: https://ethresear.ch/t/can-a-cex-microstructure-signal-survive-ethereum-execution-latency-and-mev/25562
- desc: |
  中央集権型取引所（CEX）と分散型取引所（DEX）間の価格差が、裁定取引などの市場メカニズムによって縮小し、最終的に収束する現象。効率的な市場形成の指標となる。

## Periodically anchored to Ethereum
- ja: 定期的にイーサリアムにアンカーされる
- related: [Data availability, Proofs, Off-chain data, Hash chain]
- auto_added: 2026-07-29
- auto_source_topic_id: 25562
- auto_source_url: https://ethresear.ch/t/can-a-cex-microstructure-signal-survive-ethereum-execution-latency-and-mev/25562
- desc: |
  オフチェーンで生成されたデータや証明の完全性を保証するため、そのハッシュや要約を定期的にイーサリアムブロックチェーンに記録するメカニズム。これにより、データの改ざんを検出し、信頼性を高める。

## mixhash
- ja: ミックスハッシュ
- related: [RANDAO, BLS signature]
- auto_added: 2026-07-29
- auto_source_topic_id: 25556
- auto_source_url: https://ethresear.ch/t/native-randomness-sourcing-with-looser-guarantees/25556
- desc: |
  Ethereumのコンセンサスレイヤーで乱数生成のために使用されるハッシュ値。RANDAOメカニズムの出力であり、ブロックプロポーザーのBLS署名から導出されます。

## signidice
- ja: サイニダイス (Signidice)
- related: [commit-reveal scheme, RANDAO]
- auto_added: 2026-07-29
- auto_source_topic_id: 25556
- auto_source_url: https://ethresear.ch/t/native-randomness-sourcing-with-looser-guarantees/25556
- desc: |
  複数の参加者が秘密の値をコミットし、後で公開して結合することで乱数を生成する方式。コミット＆リビールスキームの一種で、各参加者のバイアスを軽減するために使用されます。

## withholding bias
- ja: 意図的なブロック非提出によるバイアス (Withholding Bias)
- related: [RANDAO, Selfish Mixing]
- auto_added: 2026-07-29
- auto_source_topic_id: 25556
- auto_source_url: https://ethresear.ch/t/native-randomness-sourcing-with-looser-guarantees/25556
- desc: |
  ブロックプロポーザーが、生成される乱数が自分にとって不利な場合に、そのブロックの提出を意図的にスキップすることで乱数にバイアスをかける行為。これにより、プロポーザーはブロック報酬を犠牲にして、より有利な乱数を引き出す機会を得ます。

## Selfish Mixing
- ja: セルフィッシュミキシング (Selfish Mixing)
- related: [RANDAO, withholding bias, MEV]
- auto_added: 2026-07-29
- auto_source_topic_id: 25556
- auto_source_url: https://ethresear.ch/t/native-randomness-sourcing-with-looser-guarantees/25556
- desc: |
  プルーフ・オブ・ステーク（PoS）システムにおいて、バリデーターが乱数生成プロセスを自分に有利になるように操作する戦略。RANDAOのような乱数源の特性を利用し、ブロックの提出を戦略的に行わないことで、望ましい乱数結果を得ようとします。

## RANDAO target slot attack
- ja: RANDAOターゲットスロット攻撃
- related: [RANDAO, withholding bias, Selfish Mixing, Tail run]
- auto_added: 2026-07-29
- auto_source_topic_id: 25556
- auto_source_url: https://ethresear.ch/t/native-randomness-sourcing-with-looser-guarantees/25556
- desc: |
  攻撃者がRANDAO乱数源を操作し、特定の将来のスロットで望ましい乱数結果を得ようとする攻撃。複数の連続するプロポーザースロット（Tail run）を制御することで、乱数結果を特定の範囲に誘導する可能性が高まります。

## Structural OEV Elimination
- ja: 構造的OEV排除 (Oracle Extractable Value排除)
- related: [Oracle Extractable Value, Atomic State Binding]
- auto_added: 2026-07-29
- auto_source_topic_id: 25555
- auto_source_url: https://ethresear.ch/t/structural-oev-elimination-through-state-synchronization/25555
- desc: |
  オラクル更新とそれに続く状態変化を単一のアトミックなトランジションに結合することで、オラクル抽出可能価値（OEV）の発生源となる時間的ギャップを構造的に排除するアプローチ。これにより、更新の可視化と結果のコミットの間に抽出機会が存在しない状態を作り出す。

## bind-verify-commit synchronization cycle
- ja: バインド・検証・コミット同期サイクル
- related: [Atomic State Binding, Cross-Domain State Synchronization]
- auto_added: 2026-07-29
- auto_source_topic_id: 25555
- auto_source_url: https://ethresear.ch/t/structural-oev-elimination-through-state-synchronization/25555
- desc: |
  複数のドメイン間で状態をアトミックに同期させるためのサイクル。資産のロック、トランジションの検証、そして接続された全てのチェーンへの後続状態の書き込みを単一のステップで行い、部分的な状態が存在しないことを保証する。

## internal extraction window
- ja: 内部抽出ウィンドウ
- related: [Oracle Extractable Value, MEV]
- auto_added: 2026-07-29
- auto_source_topic_id: 25555
- auto_source_url: https://ethresear.ch/t/structural-oev-elimination-through-state-synchronization/25555
- desc: |
  オラクル更新がオンチェーンで公開されてから、その更新の結果（例：清算）が消費されるまでの時間間隔。この期間中に、MEVアクターは更新を先読みして利益を得る機会を持つ。

## Update-timing extraction
- ja: 更新タイミング抽出
- related: [internal extraction window, Oracle Extractable Value]
- auto_added: 2026-07-29
- auto_source_topic_id: 25555
- auto_source_url: https://ethresear.ch/t/structural-oev-elimination-through-state-synchronization/25555
- desc: |
  オラクル更新トランザクションが公開されてから、その結果が実行されるまでの間に発生する抽出。これは、更新をバックランすることで利益を得る典型的なOEV取引である。

## Update-anticipation extraction
- ja: 更新予測抽出
- related: [pre-window, Oracle Extractable Value]
- auto_added: 2026-07-29
- auto_source_topic_id: 25555
- auto_source_url: https://ethresear.ch/t/structural-oev-elimination-through-state-synchronization/25555
- desc: |
  オラクル更新の閾値やハートビートにより、オフチェーンデータから次の更新が統計的に予測可能であるために、更新が実際にオンチェーンに到達する前に発生する抽出。

## Staked Weighted Verification Gate
- ja: ステーク型加重検証ゲート (Staked Weighted Verification Gate)
- related: [Weighted endorsement, Measured verification, Slashing curves]
- auto_added: 2026-07-29
- auto_source_topic_id: 29194
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-staked-weighted-verification-gate/29194
- desc: |
  提案されているERC標準であり、クレームの検証プロセスを標準化するゲートウェイです。クレームが信頼できるステータスを持つためには、第三者による検証が必要であり、その検証の重みは検証者の「検証済み深度」によって決定され、誤ったクレームに対してはクレーム作成者がステークを失う可能性があります。

## Weighted endorsement
- ja: 加重型承認 (Weighted endorsement)
- related: [Staked Weighted Verification Gate, Measured verification]
- auto_added: 2026-07-29
- auto_source_topic_id: 29194
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-staked-weighted-verification-gate/29194
- desc: |
  クレームや情報の承認において、承認者の信頼性や「検証済み深度」に基づいてその承認の重みを決定するメカニズムです。単なる承認数ではなく、承認の質を重視することで、シビル攻撃耐性を高めます。

## Measured verification
- ja: 測定型検証 (Measured verification)
- related: [Staked Weighted Verification Gate, Weighted endorsement]
- auto_added: 2026-07-29
- auto_source_topic_id: 29194
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-staked-weighted-verification-gate/29194
- desc: |
  クレームの検証において、宣言された信頼度や承認数に依存するのではなく、定量的な指標や検証者の「検証済み深度」に基づいて検証の有効性を評価するアプローチです。より客観的で信頼性の高い検証を目指します。

## Slashing curves
- ja: スラッシング曲線 (Slashing curves)
- related: [Slashing, Staking]
- auto_added: 2026-07-29
- auto_source_topic_id: 29194
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-staked-weighted-verification-gate/29194
- desc: |
  ステーキングシステムにおいて、バリデーターやクレーム作成者の不正行為に対するペナルティ（スラッシング）の量を決定するために使用される数学的な関数です。不正の度合いや期間などに応じて、スラッシングの計算方法を定義します。

## Post-consumption falsifiability
- ja: 消費後反証可能性 (Post-consumption falsifiability)
- related: [Revocability, Finality]
- auto_added: 2026-07-29
- auto_source_topic_id: 29194
- auto_source_url: https://ethereum-magicians.org/t/draft-erc-staked-weighted-verification-gate/29194
- desc: |
  クレームや情報が一度「消費」されたり、それに基づいて行動が実行されたりした後でも、そのクレームの真偽を反証できる（誤りであることを証明できる）特性です。システムの最終性や取り消し可能性の設計に関連します。

## Substrate Incompleteness
- ja: 基盤の不完全性（Substrate Incompleteness）
- related: [Capture Surface, Gödel's incompleteness theorems]
- auto_added: 2026-07-30
- auto_source_topic_id: 25572
- auto_source_url: https://ethresear.ch/t/substrate-incompleteness/25572
- desc: |
  どんなに精巧な公平性メカニズムであっても、必ず悪用されうる抜け穴（capture surface）が存在するという、システム設計における構造的な特性。ゲーデルの不完全性定理に例えられ、メカニズムの完全性と実装可能性は両立しないとされる。

## Capture Surface
- ja: キャプチャ・サーフェス
- related: [Substrate Incompleteness]
- auto_added: 2026-07-30
- auto_source_topic_id: 25572
- auto_source_url: https://ethresear.ch/t/substrate-incompleteness/25572
- desc: |
  公平性メカニズムやセキュリティメカニズムにおいて、洗練された攻撃者が悪用できる抜け穴や脆弱な側面を指す。新たなメカニズムを追加しても、既存のギャップを埋める一方で、新たなキャプチャ・サーフェスを生み出す可能性がある。

## Off-chain coordination
- ja: オフチェーン調整
- aliases: [The coalition beyond mechanism reach]
- related: [Capture Surface, MEV]
- auto_added: 2026-07-30
- auto_source_topic_id: 25572
- auto_source_url: https://ethresear.ch/t/substrate-incompleteness/25572
- desc: |
  ブロックチェーン上のメカニズムの範囲外で、参加者がチェーン外の手段（例：電話）を用いて合意形成や行動調整を行うこと。オンチェーンメカニズムからは検出が困難であり、意思決定を歪めるキャプチャ・サーフェスとなりうる。

## v(S) estimation gap
- ja: v(S)推定ギャップ
- related: [Shapley value, Characteristic function, Capture Surface]
- auto_added: 2026-07-30
- auto_source_topic_id: 25572
- auto_source_url: https://ethresear.ch/t/substrate-incompleteness/25572
- desc: |
  協力ゲーム理論におけるシャープレイ値の計算に用いられる特性関数v(S)（特定の連合が生成する価値）の推定において生じる誤差。異なる観測者間で推定値に大きな乖離が生じ、シャープレイ値の計算結果に影響を与えるキャプチャ・サーフェスとなる。

## Unmeasured contribution
- ja: 未測定の貢献
- related: [Capture Surface, Incentive design]
- auto_added: 2026-07-30
- auto_source_topic_id: 25572
- auto_source_url: https://ethresear.ch/t/substrate-incompleteness/25572
- desc: |
  メカニズムによって観測・記録されない、しかしシステムやコミュニティにとって価値のある貢献。例えば、火災の防止、継続性の維持、感情労働、ギャップの埋め合わせなどが挙げられる。インセンティブ設計において、これらの貢献が適切に評価されないことがキャプチャ・サーフェスとなる。

## P2P networking
- ja: P2Pネットワーキング
- related: [gossipsub, mesh sync protocol]
- auto_added: 2026-07-30
- auto_source_topic_id: 29200
- auto_source_url: https://ethereum-magicians.org/t/p2p-networking-5-july-29-2026/29200
- desc: |
  Ethereumクライアントがブロック、トランザクション、アッテステーションなどの情報を交換するために使用するピアツーピアネットワーク。分散型システムの基盤となる通信層。

## Topic streams extension
- ja: トピックストリーム拡張
- related: [P2P networking, gossipsub]
- auto_added: 2026-07-30
- auto_source_topic_id: 29200
- auto_source_url: https://ethereum-magicians.org/t/p2p-networking-5-july-29-2026/29200
- desc: |
  EthereumのP2Pネットワークにおけるデータ伝播メカニズムであるトピックストリームを拡張する提案または機能。特定の種類の情報を効率的に共有するために使用される。

## ML-DSA
- ja: ML-DSA (格子ベース署名アルゴリズム)
- related: [Post-quantum cryptography, Digital Signature Algorithm (DSA)]
- auto_added: 2026-07-31
- auto_source_topic_id: 29211
- auto_source_url: https://ethereum-magicians.org/t/eip-8355-precompiles-for-ml-dsa-verification/29211
- desc: |
  NISTによって標準化された、量子耐性を持つデジタル署名アルゴリズム。Ethereumにおけるアカウント認証やトランザクション署名への導入が検討されている。

## account authenticator
- ja: アカウント認証器
- related: [Account abstraction, Smart account, Signature verification]
- auto_added: 2026-07-31
- auto_source_topic_id: 29211
- auto_source_url: https://ethereum-magicians.org/t/eip-8355-precompiles-for-ml-dsa-verification/29211
- desc: |
  アカウントの操作やトランザクションの正当性を検証する役割を持つコンポーネント。特にスマートアカウントやアカウント抽象化の文脈で、署名検証などを担当する。

## ISZERO
- ja: ISZERO (EVMオペコード)
- related: [EVM, Opcode, Smart contract]
- auto_added: 2026-07-31
- auto_source_topic_id: 29211
- auto_source_url: https://ethereum-magicians.org/t/eip-8355-precompiles-for-ml-dsa-verification/29211
- desc: |
  Ethereum Virtual Machine (EVM) のオペコードの一つ。スタックの最上位の値がゼロである場合に1を、それ以外の場合に0を返す。スマートコントラクトにおける条件分岐の実装に利用される。

## account code
- ja: アカウントコード
- related: [Smart contract, EVM, Bytecode, Persistent state]
- auto_added: 2026-07-31
- auto_source_topic_id: 29211
- auto_source_url: https://ethereum-magicians.org/t/eip-8355-precompiles-for-ml-dsa-verification/29211
- desc: |
  Ethereumブロックチェーン上の特定のアドレスにデプロイされたスマートコントラクトのバイトコード。コントラクトのロジックと機能を定義し、その実行を可能にする。

## domain separation
- ja: ドメイン分離
- related: [Cryptographic security, Signature verification, Replay attack]
- auto_added: 2026-07-31
- auto_source_topic_id: 29211
- auto_source_url: https://ethereum-magicians.org/t/eip-8355-precompiles-for-ml-dsa-verification/29211
- desc: |
  暗号学的操作（署名やハッシュなど）が、意図しない異なるコンテキストで有効と見なされることを防ぐためのセキュリティ手法。メッセージに特定のコンテキスト識別子を付加することで実現される。

## All Core Devs - Consensus
- ja: オールコア開発者会議 - コンセンサス
- aliases: [ACDC]
- related: [All Core Devs - Testing, EIP]
- auto_added: 2026-07-31
- auto_source_topic_id: 29209
- auto_source_url: https://ethereum-magicians.org/t/all-core-devs-consensus-acdc-184-august-6-2026/29209
- desc: |
  Ethereumのコンセンサス層に関する主要な開発者会議。プロトコルのアップグレードや研究課題について議論され、開発の方向性を決定する重要な場です。

## Anchored key-binding
- ja: アンカー型鍵バインディング
- related: [Post-quantum migration, Consumer cutoff, Anchor time]
- auto_added: 2026-08-01
- auto_source_topic_id: 29225
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-migration-for-on-chain-identity-an-anchored-key-binding-a-cutoff-verified-by-recompute-not-a-second-signature/29225
- desc: |
  既存の古典的な公開鍵と新しいポスト量子公開鍵をオンチェーンで紐付けるメカニズム。これにより、古典的な鍵が破られた場合でも、新しいポスト量子鍵への安全な移行を可能にする。

## Consumer cutoff
- ja: コンシューマーカットオフ
- related: [Post-quantum migration, Anchored key-binding, Anchor time]
- auto_added: 2026-08-01
- auto_source_topic_id: 29225
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-migration-for-on-chain-identity-an-anchored-key-binding-a-cutoff-verified-by-recompute-not-a-second-signature/29225
- desc: |
  ポスト量子移行戦略において、特定の時点（カットオフ）以降のアクションに対して、アンカー型鍵バインディングで紐付けられたポスト量子署名の検証を義務付けるルール。これにより、攻撃者が古典的な署名のみを提示して不正を行うことを防ぐ。

## Anchor time
- ja: アンカータイム
- related: [Anchored key-binding, Consumer cutoff]
- auto_added: 2026-08-01
- auto_source_topic_id: 29225
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-migration-for-on-chain-identity-an-anchored-key-binding-a-cutoff-verified-by-recompute-not-a-second-signature/29225
- desc: |
  オンチェーンでのアクションが記録されたブロックのタイムスタンプ。署名が作成された時間ではなく、このアンカータイムに基づいてアクションの権限と有効性が判断される。過去の不正な署名によるバックデートを防ぐために重要となる。

## Post-quantum migration
- ja: ポスト量子移行
- related: [Post-quantum, Anchored key-binding, Consumer cutoff]
- auto_added: 2026-08-01
- auto_source_topic_id: 29225
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-migration-for-on-chain-identity-an-anchored-key-binding-a-cutoff-verified-by-recompute-not-a-second-signature/29225
- desc: |
  量子コンピュータによる暗号解読の脅威に備え、既存の暗号システム（特に署名スキーム）を量子耐性のあるものに置き換えるプロセス。オンチェーンアイデンティティの文脈では、古典的な鍵からポスト量子鍵への安全な切り替えを指す。

## Recovery-class taxonomy
- ja: リカバリークラス分類
- related: [Key rotation, Key revocation, On-chain identity]
- auto_added: 2026-08-01
- auto_source_topic_id: 29225
- auto_source_url: https://ethereum-magicians.org/t/post-quantum-migration-for-on-chain-identity-an-anchored-key-binding-a-cutoff-verified-by-recompute-not-a-second-signature/29225
- desc: |
  オンチェーンアイデンティティの鍵管理において、鍵のローテーションや失効といった権限移行の種類を分類するためのフレームワーク。監査可能性を高め、どのような種類の移行が発生したかを第三者が独立して検証できるようにする。

## Beacon Block Reporting Field
- ja: ビーコンブロック報告フィールド
- related: [Beacon Block, EIP-8359]
- auto_added: 2026-08-01
- auto_source_topic_id: 29224
- auto_source_url: https://ethereum-magicians.org/t/eip-8359-beacon-block-reporting-field/29224
- desc: |
  EIP-8359で提案されている、ビーコンブロック内にクライアントデータを報告するためのフィールドです。プロトコル内でクライアントの挙動や状態に関する情報を収集することを目的としています。

## EVM Verification Key Registry
- ja: EVM検証鍵レジストリ
- related: [EVM verification key, L1 feature fork]
- auto_added: 2026-08-01
- auto_source_topic_id: 29222
- auto_source_url: https://ethereum-magicians.org/t/eip-8357-evm-verification-key-registry/29222
- desc: |
  L1の機能フォークごとに正規のEVM検証鍵を格納する固定アドレスのシステムコントラクト。各エントリは、特定のフォークに紐づくEVMプログラムの検証鍵とその有効化タイムスタンプをマッピングする。これにより、ロールアップがL1 EVMのアップグレードを追跡したり、特定のEVMフォークに留まったりすることが可能になる。

## L1 feature fork
- ja: L1機能フォーク
- related: [EVM Verification Key Registry, EVM upgrade]
- auto_added: 2026-08-01
- auto_source_topic_id: 29222
- auto_source_url: https://ethereum-magicians.org/t/eip-8357-evm-verification-key-registry/29222
- desc: |
  イーサリアムのレイヤー1（L1）プロトコルに新しい機能や変更を導入するために行われるハードフォークの一種。EVMの動作や機能に影響を与える更新を指すことが多い。

## Fungible Agent Tokens
- ja: ファンジブルエージェントトークン (FAT)
- aliases: [FAT]
- related: [FAT Agent, AI agent, on-chain economic entity]
- auto_added: 2026-08-01
- auto_source_topic_id: 29220
- auto_source_url: https://ethereum-magicians.org/t/draft-fungible-agent-tokens-fat-a-minimal-standard-for-ai-agents-as-on-chain-economic-entities/29220
- desc: |
  AIエージェントをオンチェーンの経済エンティティとして定義するための最小限の標準。エージェントが自身の経済活動における株式を発行し、自律的に行動し、その行動の改ざん防止可能な推論記録を残すことを可能にするプロトコルです。

## FAT Agent
- ja: FATエージェント
- related: [Fungible Agent Tokens, AI agent, on-chain economic entity]
- auto_added: 2026-08-01
- auto_source_topic_id: 29220
- auto_source_url: https://ethereum-magicians.org/t/draft-fungible-agent-tokens-fat-a-minimal-standard-for-ai-agents-as-on-chain-economic-entities/29220
- desc: |
  Fungible Agent Tokens (FAT) プロトコルによって定義されるAIエージェント。自身の経済活動における株式を発行し、自律的に行動し、行動の推論記録を残すオンチェーンの経済エンティティとして機能します。

## Reasoning Attestation
- ja: 推論証明
- related: [reasoningHash, reasoningURI, Agent URI, tamper-evident reasoning record]
- auto_added: 2026-08-01
- auto_source_topic_id: 29220
- auto_source_url: https://ethereum-magicians.org/t/draft-fungible-agent-tokens-fat-a-minimal-standard-for-ai-agents-as-on-chain-economic-entities/29220
- desc: |
  FATエージェントのオフチェーンメタデータと各アクションの推論記録を、エージェントのオンチェーンIDに紐付けるプロセス。改ざん防止可能な記録を通じて、エージェントのアイデンティティ、戦略、モデル、意思決定の根拠をオンチェーンで証明します。

## Reasoned Settlement
- ja: 推論に基づく決済
- related: [settleMint, settleRedeem, reasoningHash, reasoningURI]
- auto_added: 2026-08-01
- auto_source_topic_id: 29220
- auto_source_url: https://ethereum-magicians.org/t/draft-fungible-agent-tokens-fat-a-minimal-standard-for-ai-agents-as-on-chain-economic-entities/29220
- desc: |
  FATエージェントが、ミントおよび償還のリクエストを承認、価格設定、または拒否する際に、自身の推論に基づいて決定を下すプロセス。各決済には改ざん防止可能な推論記録が添付され、エージェントの自律的な意思決定を標準化します。

## Accept Token
- ja: 受入トークン
- related: [Shares, Equity Issuance]
- auto_added: 2026-08-01
- auto_source_topic_id: 29220
- auto_source_url: https://ethereum-magicians.org/t/draft-fungible-agent-tokens-fat-a-minimal-standard-for-ai-agents-as-on-chain-economic-entities/29220
- desc: |
  FATエージェントの株式購入に受け入れられ、償還時に支払われる、デプロイ時に選択された不変のERC-20トークン。株式の価格設定と償還を明確にするための固定された会計単位として機能します。

## Purpose-Bound Third-Party Data Consent
- ja: 目的拘束型第三者データ同意 (Purpose-Bound Third-Party Data Consent)
- related: [Data Consent, ERC-8356, Verifiable Credential]
- auto_added: 2026-08-01
- auto_source_topic_id: 29217
- auto_source_url: https://ethereum-magicians.org/t/erc-8356-purpose-bound-third-party-data-consent/29217
- desc: |
  データ主体、データ利用を許可される受領者、受領者の代理として利用を実行するエージェントという三者間で、特定の目的に限定されたデータ利用の同意を管理するためのEthereum標準。データ主体が受益者ではない状況での同意の取り消しを、アクセス時に有効にすることを目的とする。

## Consensus-ordered revocation
- ja: コンセンサス順序付けされた取り消し
- related: [Revocation Status, Verifiable Credential]
- auto_added: 2026-08-01
- auto_source_topic_id: 29217
- auto_source_url: https://ethereum-magicians.org/t/erc-8356-purpose-bound-third-party-data-consent/29217
- desc: |
  ブロックチェーンのコンセンサス機構を利用して、データ利用の同意や資格情報の取り消しを記録するメカニズム。発行者が書き換えたりオフラインにしたりできない、公開され、否認不可能な取り消しステータスを提供する。

## Bitstring Status List
- ja: ビットストリングステータスリスト
- related: [Revocation Status, Verifiable Credential]
- auto_added: 2026-08-01
- auto_source_topic_id: 29217
- auto_source_url: https://ethereum-magicians.org/t/erc-8356-purpose-bound-third-party-data-consent/29217
- desc: |
  W3C Verifiable Credentialの取り消しステータスを管理するための一般的なメカニズムの一つ。発行者が制御するエンドポイントから取得されるビット列で、取り消し状態を示す。発行者による改ざんやオフライン化のリスクが指摘される。

## NatSpec
- ja: NatSpec
- aliases: [Ethereum Natural Language Specification]
- related: [Smart Contract, Solidity]
- auto_added: 2026-08-01
- auto_source_topic_id: 29217
- auto_source_url: https://ethereum-magicians.org/t/erc-8356-purpose-bound-third-party-data-consent/29217
- desc: |
  Ethereumスマートコントラクトのコード内に自然言語でドキュメントを記述するための標準。関数、イベント、変数などの目的や動作を説明し、開発者や監査人がコードを理解しやすくするために使用される。

## On-chain status anchor
- ja: オンチェーンステータスアンカー
- related: [Verifiable Credential, Off-chain data]
- auto_added: 2026-08-01
- auto_source_topic_id: 29217
- auto_source_url: https://ethereum-magicians.org/t/erc-8356-purpose-bound-third-party-data-consent/29217
- desc: |
  オフチェーンで発行された資格情報やデータに対するステータス（特に取り消し状態）を、ブロックチェーン上に固定（アンカー）する設計パターン。ブロックチェーンの不変性とコンセンサスを利用して、オフチェーンデータの信頼性の高いステータス検証を可能にする。

## reorg-resistant
- ja: リorg耐性 (reorg-resistant)
- related: [reorg, finality]
- auto_added: 2026-08-01
- auto_source_topic_id: 29208
- auto_source_url: https://ethereum-magicians.org/t/deterministic-random-number-in-evm-for-independent-recomputability/29208
- desc: |
  ブロックチェーンの再編成（reorg）が発生しても、その影響を受けずにデータの整合性や有効性が保たれる性質。特に、トランザクションや状態の確定性において重要な特性とされる。

## independently-recomputable identifier
- ja: 独立して再計算可能な識別子
- related: [off-chain verification, data availability]
- auto_added: 2026-08-01
- auto_source_topic_id: 29208
- auto_source_url: https://ethereum-magicians.org/t/deterministic-random-number-in-evm-for-independent-recomputability/29208
- desc: |
  チェーン上のデータのみから、RPCやインデクサーなどの外部サービスに依存せずに、第三者が同じ識別子を再生成できる特性を持つ識別子。オフチェーンでの検証可能性を保証するために重要となる。

## execution position
- ja: 実行位置
- related: [call depth, storage state, EVM]
- auto_added: 2026-08-01
- auto_source_topic_id: 29208
- auto_source_url: https://ethereum-magicians.org/t/deterministic-random-number-in-evm-for-independent-recomputability/29208
- desc: |
  EVMトランザクションの実行中に、コードが実行されている特定の場所と、その時点で観測されるストレージ状態を指す概念。同じトランザクション内でも、異なる呼び出し深度や状態変化によって実行位置は区別される。

## BLOCKID opcode
- ja: BLOCKID オペコード
- related: [EVM opcode, block.number, block.timestamp, chainid]
- auto_added: 2026-08-01
- auto_source_topic_id: 29208
- auto_source_url: https://ethereum-magicians.org/t/deterministic-random-number-in-evm-for-independent-recomputability/29208
- desc: |
  提案されているEVMオペコードの一つで、ブロック固有の決定論的な識別子を生成することを目的とする。チェーンID、ブロック番号、タイムスタンプ、ベースフィー、ガスリミットなどのブロックヘッダー情報からハッシュ値を計算することが想定されている。

## Non-transferable credits
- ja: 譲渡不可能なクレジット
- related: [Credit decay, Public goods]
- auto_added: 2026-08-03
- auto_source_topic_id: 25602
- auto_source_url: https://ethresear.ch/t/dynamic-leverage-pricing-for-non-transferable-time-credits-solving-skill-mismatch-in-volunteer-public-good-labor/25602
- desc: |
  金銭的価値の蓄積や投機を防ぐため、個人間での譲渡ができないように設計されたクレジット。Ethereumエコシステムにおける公共財や評判システムで、インセンティブ設計の重要な要素となる。

## Credit decay
- ja: クレジットの減衰
- aliases: [Decay (of credits)]
- related: [Non-transferable credits, Decay-gaming]
- auto_added: 2026-08-03
- auto_source_topic_id: 25602
- auto_source_url: https://ethresear.ch/t/dynamic-leverage-pricing-for-non-transferable-time-credits-solving-skill-mismatch-in-volunteer-public-good-labor/25602
- desc: |
  未使用のクレジットが時間とともに価値を失ったり失効したりするメカニズム。投機的な蓄積を防ぎ、積極的な参加を促すことで、システムの目的とインセンティブを一致させる。

## Decay-gaming
- ja: 減衰ゲーミング
- related: [Credit decay, Sybil resistance]
- auto_added: 2026-08-03
- auto_source_topic_id: 25602
- auto_source_url: https://ethresear.ch/t/dynamic-leverage-pricing-for-non-transferable-time-credits-solving-skill-mismatch-in-volunteer-public-good-labor/25602
- desc: |
  クレジットの減衰メカニズムを回避しようとする行為。例えば、最小限の労力で取引を行う、あるいは新しいアイデンティティを登録するなどして、実質的な参加なしにクレジットの有効期限をリセットし、蓄積を維持しようとする。

## Multi-signal feedback loop
- ja: マルチシグナルフィードバックループ
- related: [Dynamic rate adjustment]
- auto_added: 2026-08-03
- auto_source_topic_id: 25602
- auto_source_url: https://ethresear.ch/t/dynamic-leverage-pricing-for-non-transferable-time-credits-solving-skill-mismatch-in-volunteer-public-good-labor/25602
- desc: |
  複数の異なるデータポイント（需給、離脱率、リピート率、アンケートなど）を用いて、システムパラメータ（労働の交換レートなど）を動的に調整する制御メカニズム。単一のシグナルに基づくシステムよりも、堅牢で繊細な調整を目指す。

## Arithmetic Circuit
- ja: 算術回路
- related: [STARK, Zero-Knowledge Proof]
- auto_added: 2026-08-04
- auto_source_topic_id: 25614
- auto_source_url: https://ethresear.ch/t/arcanum-a-privacy-first-compiler-layer-for-source-code-tee-now-zk-as-the-long-term-foundation/25614
- desc: |
  ゼロ知識証明システムにおいて、計算を表現するために使用される数学的な回路。加算と乗算のゲートで構成され、プログラムの実行を検証可能な形式に変換する。

## Verifiable Execution
- ja: 検証可能な実行
- related: [ZKVM, Zero-Knowledge Proof, Trusted Execution Environment]
- auto_added: 2026-08-04
- auto_source_topic_id: 25614
- auto_source_url: https://ethresear.ch/t/arcanum-a-privacy-first-compiler-layer-for-source-code-tee-now-zk-as-the-long-term-foundation/25614
- desc: |
  計算が正しく実行されたことを第三者が検証できる特性。特にゼロ知識証明やトラステッド実行環境の文脈で、計算の完全性と正確性を保証するために重要となる。

## TCREATE
- ja: TCREATEオペコード
- related: [EVM opcode, CREATE opcode, temporary contracts]
- auto_added: 2026-08-04
- auto_source_topic_id: 29258
- auto_source_url: https://ethereum-magicians.org/t/eip-8360-tcreate-opcode/29258
- desc: |
  EIP-8360で導入される新しいEVMオペコードです。一時的なコントラクトをガス効率よく、かつステートを認識した形でデプロイするための公式なメカニズムを提供します。

## Decentralized State
- ja: 分散型ステート
- aliases: [DS]
- related: [Stateless Clients, Full Node, State structure]
- auto_added: 2026-08-05
- auto_source_topic_id: 25622
- auto_source_url: https://ethresear.ch/t/why-decentralized-state-is-important-for-ethereum/25622
- desc: |
  Ethereumの今後のアップグレード、特にステートレスクライアントの導入に伴う課題（Mempoolの検証、フルノードの同期、自己主権的なアクセスなど）を解決するために提案されている概念。ネットワーク全体に最新のヘッドステートを分散して保存することで、これらの課題に対処することを目指す。

## Stateless Clients
- ja: ステートレスクライアント
- aliases: [Stateless nodes]
- related: [Execution Layer, Merkle Patricia Trie, Verkle Tree, Unified Binary Tree, Partitioned Binary Tree, Decentralized State]
- auto_added: 2026-08-05
- auto_source_topic_id: 25622
- auto_source_url: https://ethresear.ch/t/why-decentralized-state-is-important-for-ethereum/25622
- desc: |
  実行レイヤーのステートを完全に保存することなく、バリデータノードを実行できるクライアント。これにより、ノードのハードウェア要件を軽減し、スケーラビリティを向上させることを目指すが、Mempool検証やフルノード同期などの新たな課題も生じる。

## Code chunking
- ja: コードチャンキング
- related: [EIP-2926, Stateless Clients, State tree migration]
- auto_added: 2026-08-05
- auto_source_topic_id: 25622
- auto_source_url: https://ethresear.ch/t/why-decentralized-state-is-important-for-ethereum/25622
- desc: |
  ステートレスクライアントを実現するための技術の一つで、スマートコントラクトのコードを小さなチャンクに分割し、必要に応じてオンデマンドで取得・検証する手法。EIP-2926などで提案されており、ステートツリーの移行と合わせて検討されることが多い。

## Unified Binary Tree
- ja: 統合バイナリツリー
- aliases: [UBT]
- related: [Merkle Patricia Trie, Partitioned Binary Tree, Verkle Tree, Stateless Clients, State structure]
- auto_added: 2026-08-05
- auto_source_topic_id: 25622
- auto_source_url: https://ethresear.ch/t/why-decentralized-state-is-important-for-ethereum/25622
- desc: |
  Ethereumの現在のMerkle Patricia Trieに代わる新しいステート構造として提案されているものの一つ。ステートレスクライアントやzkEVMなどの改善に適しており、特に分散型ステート（DS）設計において、ステートの均等な分散と効率的な部分ステート証明に非常に適しているとされる。

## SSZ Compact Multiproofs
- ja: SSZコンパクトマルチプルーフ
- related: [SSZ]
- auto_added: 2026-08-05
- auto_source_topic_id: 29277
- auto_source_url: https://ethereum-magicians.org/t/eip-8364-ssz-compact-multiproofs/29277
- desc: |
  SSZ (Simple Serialize) データ構造において、複数の要素に対する証明を効率的に行うための技術です。証明のサイズをコンパクトに保ちつつ、複数のデータ要素の検証を可能にすることで、データ可用性サンプリングなどのプロトコルにおける効率化を目指します。

## Inheritable Agent Mandate
- ja: 継承可能なエージェントマンデート
- aliases: [Inheritable Mandate]
- related: [AI agents, Mandate, Soulbound Identity]
- auto_added: 2026-08-05
- auto_source_topic_id: 29275
- auto_source_url: https://ethereum-magicians.org/t/inheritable-agent-mandates-a-non-strippable-inherited-leash-for-on-chain-agents/29275
- desc: |
  オンチェーンエージェントが子エージェントを生成する際に、親エージェントの権限（キャップ、有効期限、複製予算、許可された受取人など）を子エージェントに継承させるメカニズム。子エージェントは親よりも能力が低い（または同等）でなければならず、このマンデートは剥奪不可能。

## Telomere (reproduction counter)
- ja: テロメア（複製カウンター）
- aliases: [Generation counter]
- related: [AI agents, Inheritable Agent Mandate]
- auto_added: 2026-08-05
- auto_source_topic_id: 29275
- auto_source_url: https://ethereum-magicians.org/t/inheritable-agent-mandates-a-non-strippable-inherited-leash-for-on-chain-agents/29275
- desc: |
  オンチェーンエージェントが複製できる回数を制限するためのカウンター。生物学的なテロメアに例えられ、エージェントが子エージェントを生成するたびにカウントダウンされ、ゼロになると複製が停止する。

## Cascading freeze
- ja: カスケードフリーズ
- related: [Inheritable Agent Mandate, AI agents]
- auto_added: 2026-08-05
- auto_source_topic_id: 29275
- auto_source_url: https://ethereum-magicians.org/t/inheritable-agent-mandates-a-non-strippable-inherited-leash-for-on-chain-agents/29275
- desc: |
  親エージェントがフリーズ（機能停止）した場合、その状態が自動的にすべての子エージェントにも伝播し、子エージェントもフリーズするメカニズム。エージェントの制御を維持するための重要なガードレール。

## Delegation tree
- ja: デリゲーションツリー
- related: [Mandate, AI agents]
- auto_added: 2026-08-05
- auto_source_topic_id: 29275
- auto_source_url: https://ethereum-magicians.org/t/inheritable-agent-mandates-a-non-strippable-inherited-leash-for-on-chain-agents/29275
- desc: |
  権限や予算が階層的に委任される構造。親エンティティが子エンティティに特定の能力を委任し、その子がさらに下位に委任することで形成される。

## Execution-gate substrate
- ja: 実行ゲート基盤
- related: [Custody, Mandate]
- auto_added: 2026-08-05
- auto_source_topic_id: 29275
- auto_source_url: https://ethereum-magicians.org/t/inheritable-agent-mandates-a-non-strippable-inherited-leash-for-on-chain-agents/29275
- desc: |
  トランザクションや操作が実行される前に、特定の条件やポリシーを満たしているかを検証し、満たさない場合は実行を阻止する基盤レイヤー。エージェントの行動を強制的に制限する役割を持つ。

## Unclonable Agent Execution Credentials
- ja: アンクローン可能なエージェント実行クレデンシャル
- related: [Zero Knowledge Nullifier, Autonomous Agent, Exactly Once Execution]
- auto_added: 2026-08-05
- auto_source_topic_id: 29274
- auto_source_url: https://ethereum-magicians.org/t/idea-draft-erc-unclonable-agent-execution-credentials-via-zero-knowledge-nullifiers/29274
- desc: |
  自律エージェントが特定のタスクを実行するための、厳密に1回限りの事前実行認証メカニズム。ゼロ知識nullifierを用いて、侵害されたエージェントによるクレデンシャルのクローンやリプレイを防ぎ、実行の完全性と厳密な1回実行を保証する。

## Exactly Once Execution
- ja: 厳密な1回実行
- related: [Unclonable Agent Execution Credentials, Zero Knowledge Nullifier]
- auto_added: 2026-08-05
- auto_source_topic_id: 29274
- auto_source_url: https://ethereum-magicians.org/t/idea-draft-erc-unclonable-agent-execution-credentials-via-zero-knowledge-nullifiers/29274
- desc: |
  特定の操作やタスクが、システム内で正確に一度だけ実行されることを保証する特性。特に自律エージェントの認証において、不正なリプレイ攻撃を防ぐために重要となる。

## Cross Chain Nullifier Synchronization
- ja: クロスチェーンNullifier同期
- related: [Nullifier, Cross-chain, Unclonable Agent Execution Credentials]
- auto_added: 2026-08-05
- auto_source_topic_id: 29274
- auto_source_url: https://ethereum-magicians.org/t/idea-draft-erc-unclonable-agent-execution-credentials-via-zero-knowledge-nullifiers/29274
- desc: |
  複数のブロックチェーン間でNullifierの状態を同期させるプロセス。特に、あるチェーンで消費されたNullifierが、別のチェーンで不正に再利用されるのを防ぐために必要となる。

## Transaction Validity Proofs
- ja: トランザクション有効性証明
- related: [Transaction, Proof, Validity, Zero-Knowledge Proof, Stateless Client, Rollup]
- auto_added: 2026-08-05
- auto_source_topic_id: 29265
- auto_source_url: https://ethereum-magicians.org/t/eip-8361-transaction-validity-proofs/29265
- desc: |
  Ethereumプロトコルにおいて、特定のトランザクションが有効であること（例えば、署名が正しい、残高が十分である、状態遷移が正当であるなど）を簡潔に証明するメカニズム。ステートレスクライアントやL2ソリューションにおける効率的な検証に利用される。

## Tapered Issuance Burn
- ja: テーパー型発行量バーン
- related: [ETH issuance curve, validator rewards, ETH burn]
- auto_added: 2026-08-05
- auto_source_topic_id: 29263
- auto_source_url: https://ethereum-magicians.org/t/eip-8361-tapered-issuance-burn/29263
- desc: |
  イーサリアムのETH発行量を調整するメカニズムの一つで、バリデータ報酬の一部をバーンすることで、発行量を段階的に減少させることを目的とします。

## ETH issuance curve
- ja: ETH発行曲線
- related: [ETH issuance, ETH burn, monetary policy]
- auto_added: 2026-08-05
- auto_source_topic_id: 29263
- auto_source_url: https://ethereum-magicians.org/t/eip-8361-tapered-issuance-burn/29263
- desc: |
  イーサリアムネットワークにおける新規ETHの発行レートを決定する関数またはモデルです。ネットワークの経済的安定性とセキュリティに影響を与えます。

## validator rewards
- ja: バリデータ報酬
- related: [validator, ETH issuance, staking]
- auto_added: 2026-08-05
- auto_source_topic_id: 29263
- auto_source_url: https://ethereum-magicians.org/t/eip-8361-tapered-issuance-burn/29263
- desc: |
  イーサリアムのプルーフ・オブ・ステークネットワークにおいて、ブロックの提案やアテステーションなどの義務を果たすバリデータに支払われるインセンティブです。新規発行されたETHやトランザクション手数料の一部から構成されます。

## partial burn
- ja: 部分バーン
- related: [ETH burn, ETH issuance curve]
- auto_added: 2026-08-05
- auto_source_topic_id: 29263
- auto_source_url: https://ethereum-magicians.org/t/eip-8361-tapered-issuance-burn/29263
- desc: |
  トークンの総供給量を減らすために、発行されたトークンの一部を永久に利用不可能にすることです。特に、イーサリアムではトランザクション手数料やバリデータ報酬の一部がバーンされます。

## Contract-Hosted Application HTML
- ja: コントラクトホスト型アプリケーションHTML
- related: [ERC]
- auto_added: 2026-08-05
- auto_source_topic_id: 29254
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-109-aug-04-2026/29254
- desc: |
  コントラクトにホストされるアプリケーションのHTMLコンテンツに関するERC。オンチェーンでアプリケーションのフロントエンドを提供するための標準を定義します。

## Clear Signing On-Chain Descriptors Registry
- ja: クリア署名オンチェーン記述子レジストリ
- related: [Clear Signing, ERC]
- auto_added: 2026-08-05
- auto_source_topic_id: 29254
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-109-aug-04-2026/29254
- desc: |
  クリア署名のためのオンチェーン記述子を登録・管理するための標準を定義するERC。ユーザーが署名する内容を人間が読める形式で明確に表示することを目的とします。

## Token-Bound Executable Skills
- ja: トークン結合型実行可能スキル
- related: [Token-Bound Account, Executable Skill, ERC]
- auto_added: 2026-08-05
- auto_source_topic_id: 29254
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-109-aug-04-2026/29254
- desc: |
  トークンに紐付けられた実行可能なスキルを定義するERC。特定のトークンを所有することで、そのトークンが表すスキルや機能を実行できるメカニズムを提供します。

## Index-Based Multi-Facet Proxy
- ja: インデックスベース多面ファセットプロキシ
- related: [Facet, Diamond Standard, Proxy]
- auto_added: 2026-08-05
- auto_source_topic_id: 29254
- auto_source_url: https://ethereum-magicians.org/t/eip-editing-office-hour-eip-erc-meeting-109-aug-04-2026/29254
- desc: |
  複数のファセット（機能モジュール）をインデックスに基づいて管理するプロキシコントラクトのパターンを定義するERC。コントラクトのアップグレード可能性とモジュール性を高めます。

## Net Gas Metering for Account Changes
- ja: アカウント変更のネットガス計測
- related: [EIP-8358, EIP-2200, Gas Metering]
- auto_added: 2026-08-06
- auto_source_topic_id: 29304
- auto_source_url: https://ethereum-magicians.org/t/eip-8358-net-gas-metering-for-account-changes/29304
- desc: |
  EIP-8358で導入される、アカウントの残高やnonceの変更に対するガス計測スキーム。ストレージに対するEIP-2200のスキームと同様に、変更の正味（ネット）のコストに基づいてガスを計算する。

## CALL_VALUE_BASE_GAS
- ja: CALL_VALUEベースガス
- related: [CALL_VALUE, CALL_STIPEND, EIP-8358, EIP-8038, EIP-7708]
- auto_added: 2026-08-06
- auto_source_topic_id: 29304
- auto_source_url: https://ethereum-magicians.org/t/eip-8358-net-gas-metering-for-account-changes/29304
- desc: |
  EIP-8358で導入される、`CALL`および`CALLCODE`オペコードによる値転送の新しいガスコスト。EIP-8038で定義された`CALL_VALUE`を置き換え、stipendとEIP-7708の転送ログのコストを含む。

## CLEAN_BALANCE_CHANGE_GAS
- ja: クリーン残高変更ガス
- related: [Net Gas Metering for Account Changes, EIP-8358]
- auto_added: 2026-08-06
- auto_source_topic_id: 29304
- auto_source_url: https://ethereum-magicians.org/t/eip-8358-net-gas-metering-for-account-changes/29304
- desc: |
  EIP-8358で導入されるガス料金。トランザクション内でまだ残高またはnonceが変更されていないアカウントに対して、その残高またはnonceが変更された際に課される。既に変更されたアカウントには追加のガスは課されない。

## BALANCE_RESET_REFUND
- ja: 残高リセット返金
- related: [Net Gas Metering for Account Changes, EIP-8358, Refund Counter]
- auto_added: 2026-08-06
- auto_source_topic_id: 29304
- auto_source_url: https://ethereum-magicians.org/t/eip-8358-net-gas-metering-for-account-changes/29304
- desc: |
  EIP-8358で導入される返金メカニズム。アカウントの残高が元の値に戻り、かつnonceが変更されていない場合に、返金カウンターに追加されるガス量。

## CALL_VALUE
- ja: CALL値
- related: [CALL_VALUE_BASE_GAS, ACCOUNT_WRITE, CALL_STIPEND, EIP-8038]
- auto_added: 2026-08-06
- auto_source_topic_id: 29304
- auto_source_url: https://ethereum-magicians.org/t/eip-8358-net-gas-metering-for-account-changes/29304
- desc: |
  EIP-8038で定義された、`CALL`および`CALLCODE`オペコードによる値転送のガスコスト。EIP-8358によって`CALL_VALUE_BASE_GAS`に置き換えられる。`ACCOUNT_WRITE`と`CALL_STIPEND`の合計として定義されていた。

## SELFBALANCE
- ja: SELFBALANCE (EVMオペコード)
- related: [BALANCE, CALLVALUE]
- auto_added: 2026-08-06
- auto_source_topic_id: 29302
- auto_source_url: https://ethereum-magicians.org/t/preferential-gas-costs-for-native-eth-operations-draft-for-feedback/29302
- desc: |
  EVMのオペコードの一つで、現在実行中のコントラクト自身のETH残高を取得するために使用されます。EIP-8038などのガス料金変更の文脈で、そのコストが議論されることがあります。

## Digital Reserve Currency
- ja: デジタル基軸通貨 (Digital Reserve Currency)
- related: [ETH]
- auto_added: 2026-08-06
- auto_source_topic_id: 29302
- auto_source_url: https://ethereum-magicians.org/t/preferential-gas-costs-for-native-eth-operations-draft-for-feedback/29302
- desc: |
  イーサリアムのネイティブトークンであるETHが、ブロックチェーンエコシステム内での価値の保存、交換、計算の主要な媒体として機能する概念を指します。ETHの構造的な利点を強化することで、この役割を促進しようとする提案があります。

## Value-transfer gas component
- ja: 価値転送ガスコンポーネント
- related: [CALL, CREATE, Gas Cost]
- auto_added: 2026-08-06
- auto_source_topic_id: 29302
- auto_source_url: https://ethereum-magicians.org/t/preferential-gas-costs-for-native-eth-operations-draft-for-feedback/29302
- desc: |
  `CALL`や`CREATE`などのEVMオペコードにおいて、ETHの価値転送が発生する際に課されるガス料金の一部です。Yellow Paperの`G_callvalue`やEIP-8038の分解で定義されており、このコストを調整することでネイティブETHの利用を促進する提案があります。

## Cold/Warm Access Costs
- ja: コールド/ウォームアクセスコスト
- aliases: [cold access costs, warm access costs]
- related: [EIP-2929, State Access]
- auto_added: 2026-08-06
- auto_source_topic_id: 29302
- auto_source_url: https://ethereum-magicians.org/t/preferential-gas-costs-for-native-eth-operations-draft-for-feedback/29302
- desc: |
  イーサリアムのステート（状態）にアクセスする際に発生するガス料金で、EIP-2929で導入されました。最近アクセスされていないステート（コールド）へのアクセスは高価であり、最近アクセスされたステート（ウォーム）へのアクセスは安価です。

## Context Opcodes
- ja: コンテキストオペコード
- related: [EVM, Opcode]
- auto_added: 2026-08-06
- auto_source_topic_id: 29302
- auto_source_url: https://ethereum-magicians.org/t/preferential-gas-costs-for-native-eth-operations-draft-for-feedback/29302
- desc: |
  EVMのオペコードのうち、現在の実行コンテキストに関する情報（例：`CALLER`、`ADDRESS`、`TIMESTAMP`など）を取得するために使用されるものを指します。これらのオペコードは通常、比較的低いガス料金で実行されます。

## ERC-2612
- ja: ERC-2612
- related: [ERC-20, Permit]
- auto_added: 2026-08-06
- auto_source_topic_id: 29301
- auto_source_url: https://ethereum-magicians.org/t/native-eth-as-erc-20-system-contract-draft-for-feedback/29301
- desc: |
  ERC-20トークンに「Permit」機能を追加する標準。これにより、ユーザーはガスを支払うことなくオフチェーンで署名し、その署名を使ってオンチェーンでトークンを承認（approve）できるようになります。

## Preferential Gas Schedule
- ja: 優遇ガススケジュール
- related: [Gas Cost]
- auto_added: 2026-08-06
- auto_source_topic_id: 29301
- auto_source_url: https://ethereum-magicians.org/t/native-eth-as-erc-20-system-contract-draft-for-feedback/29301
- desc: |
  特定の操作やシステムコントラクトに対して、通常の操作よりも低いガス料金を設定するメカニズム。これにより、特定のプロトコルレベルの機能の利用を促進します。

## Balance Invariant
- ja: 残高不変条件
- related: [State Invariant]
- auto_added: 2026-08-06
- auto_source_topic_id: 29301
- auto_source_url: https://ethereum-magicians.org/t/native-eth-as-erc-20-system-contract-draft-for-feedback/29301
- desc: |
  システム内の総資産（例: ETHやトークン）の残高が、トランザクションや操作を通じて常に一定に保たれるべきであるという特性。金融システムの健全性を保証するために重要です。

## Selector-collision risk
- ja: セレクター衝突リスク
- related: [Function Selector, Diamond Standard]
- auto_added: 2026-08-06
- auto_source_topic_id: 29301
- auto_source_url: https://ethereum-magicians.org/t/native-eth-as-erc-20-system-contract-draft-for-feedback/29301
- desc: |
  スマートコントラクトにおいて、異なる関数が同じ4バイトの関数セレクターを持つことで発生するリスク。特にプロキシコントラクトやモジュール化されたコントラクトで問題となる可能性があります。

## Balance sunset
- ja: 残高サンセット
- related: [BLS withdrawal credential retirement, 0x00 validator]
- auto_added: 2026-08-06
- auto_source_topic_id: 29299
- auto_source_url: https://ethereum-magicians.org/t/eip-8367-balance-sunset-for-retired-bls-validators/29299
- desc: |
  特定の条件（例：引退したBLSバリデータ）を満たすウォレットの残高を、一定期間をかけて徐々にゼロに減らしていくプロセス。これは、プロトコルの健全性を保ちつつ、将来的なアップグレードを円滑に進めるために提案される。

## BLS withdrawal credential retirement
- ja: BLS引き出しクレデンシャルの引退
- related: [0x00 validator, Balance sunset, BLSToExecutionChange]
- auto_added: 2026-08-06
- auto_source_topic_id: 29299
- auto_source_url: https://ethereum-magicians.org/t/eip-8367-balance-sunset-for-retired-bls-validators/29299
- desc: |
  BLS署名スキームを使用するバリデータの引き出しクレデンシャルを、プロトコル上で非推奨とし、そのバリデータに特定の義務（例：アテステーション）を免除するプロセス。これにより、これらのバリデータは引退状態となり、残高サンセットの対象となる。

## 0x00 validator
- ja: 0x00バリデータ
- related: [BLS withdrawal credential retirement, Balance sunset, BLSToExecutionChange]
- auto_added: 2026-08-06
- auto_source_topic_id: 29299
- auto_source_url: https://ethereum-magicians.org/t/eip-8367-balance-sunset-for-retired-bls-validators/29299
- desc: |
  レガシーなBLS引き出しクレデンシャルタイプ`0x00`を使用しているバリデータ。これらのバリデータは、プロトコルアップグレードにより特定の義務から引退し、残高のサンセット対象となることが提案されている。

## BLSToExecutionChange
- ja: BLSToExecutionChange
- related: [0x00 validator, BLS withdrawal credential retirement]
- auto_added: 2026-08-06
- auto_source_topic_id: 29299
- auto_source_url: https://ethereum-magicians.org/t/eip-8367-balance-sunset-for-retired-bls-validators/29299
- desc: |
  Ethereumのコンセンサスレイヤーにおけるメッセージタイプの一つ。BLS引き出しクレデンシャルを持つバリデータが、引き出し先をイーサリアム実行レイヤーのアドレスに変更するために使用する。このEIPでは、将来的にこのメカニズムが不要となる状態を目指す。

## Post-quantum switch
- ja: ポスト量子スイッチ
- aliases: [PQ switch]
- related: [Post-quantum]
- auto_added: 2026-08-06
- auto_source_topic_id: 29299
- auto_source_url: https://ethereum-magicians.org/t/eip-8367-balance-sunset-for-retired-bls-validators/29299
- desc: |
  Ethereumプロトコルが、量子コンピュータの攻撃に耐性のある暗号方式（ポスト量子暗号）に完全に移行する将来のアップグレード。このEIPの目標は、このスイッチまでにレガシーなBLSバリデータの残高をゼロにすることである。

## VOPS Profiles
- ja: VOPSプロファイル (Validity-Only Partial Statelessness Profiles)
- related: [Validity-Only Partial Statelessness, FOCIL]
- auto_added: 2026-08-06
- auto_source_topic_id: 29298
- auto_source_url: https://ethereum-magicians.org/t/eip-8369-vops-profiles-for-focil-eligibility/29298
- desc: |
  Validity-Only Partial Statelessness (VOPS) の具体的な適用方法を定義するプロファイル。FOCILの適格性を判断するために、トランザクションの種類や検証ロジックに基づいて異なるプロファイルが設定される。

## FOCIL Eligibility
- ja: FOCIL適格性 (Fork-Choice Enforced Inclusion List Eligibility)
- related: [FOCIL, Inclusion List, VOPS Profiles]
- auto_added: 2026-08-06
- auto_source_topic_id: 29298
- auto_source_url: https://ethereum-magicians.org/t/eip-8369-vops-profiles-for-focil-eligibility/29298
- desc: |
  Fork-Choice Enforced Inclusion List (FOCIL) によって強制的にブロックに含められるトランザクションが満たすべき条件。主にトランザクションの検証コストや複雑性に基づいて判断される。

## end-of-payload omission check
- ja: ペイロード末尾省略チェック
- related: [FOCIL, Omission Check]
- auto_added: 2026-08-06
- auto_source_topic_id: 29298
- auto_source_url: https://ethereum-magicians.org/t/eip-8369-vops-profiles-for-focil-eligibility/29298
- desc: |
  FOCILのルールの一部で、ビルダーがインクルージョンリストのトランザクションを省略した場合に、そのトランザクションがペイロードの最後に付加されたと仮定して検証を行うチェック。主にガス、nonce、残高に基づいて行われる。

## AA-VOPS state surface
- ja: AA-VOPS状態空間 (Account Abstraction Validity-Only Partial Statelessness State Surface)
- related: [Account Abstraction, Validity-Only Partial Statelessness, State Surface]
- auto_added: 2026-08-06
- auto_source_topic_id: 29298
- auto_source_url: https://ethereum-magicians.org/t/eip-8369-vops-profiles-for-focil-eligibility/29298
- desc: |
  Account Abstraction (AA) を利用するトランザクションがValidity-Only Partial Statelessness (VOPS) の制約下で検証される際に、その検証が依存する状態の範囲。この状態空間が固定されていることで、検証コストを予測可能にする。

## builder-claimed transaction index
- ja: ビルダー主張トランザクションインデックス
- related: [Builder, Transaction Index, Payload]
- auto_added: 2026-08-06
- auto_source_topic_id: 29298
- auto_source_url: https://ethereum-magicians.org/t/eip-8369-vops-profiles-for-focil-eligibility/29298
- desc: |
  FOCILの文脈で、ビルダーがインクルージョンリストのトランザクションを省略した場合に、そのトランザクションがペイロード内の特定のインデックスに配置されたと仮定して検証を行う際の、ビルダーが主張するインデックス。

## CPSB
- ja: CPSB (ステートバイトあたりのコスト)
- aliases: [cost per state byte]
- related: [EIP-8037, gas limit, state]
- auto_added: 2026-08-06
- auto_source_topic_id: 29293
- auto_source_url: https://ethereum-magicians.org/t/eip-8368-cpsb-recalibration-for-new-gas-limit/29293
- desc: |
  EIP-8037で導入された、Ethereumの新しいステートバイトを導入する際の単位ガス料金。参照ブロックガスリミットに基づいて再計算されます。

## Reference-Relative Slippage Bounds
- ja: 参照相対スリッページ制限
- related: [Slippage policy, ERC-7726, minAmountOut, Sandwich attack]
- auto_added: 2026-08-06
- auto_source_topic_id: 29292
- auto_source_url: https://ethereum-magicians.org/t/reference-relative-slippage-bounds/29292
- desc: |
  トークンスワップにおいて、実行時にERC-7726オラクルから取得した参照価格に基づいて許容される出力の下限を動的に計算し、スリッページを保護するメカニズム。静的なminAmountOutの課題を解決し、サンドイッチ攻撃のリスクを軽減します。

## ERC-7726
- ja: ERC-7726
- related: [Quote oracle, Reference-Relative Slippage Bounds, TWAP]
- auto_added: 2026-08-06
- auto_source_topic_id: 29292
- auto_source_url: https://ethereum-magicians.org/t/reference-relative-slippage-bounds/29292
- desc: |
  参照価格オラクルに関するEthereum Request for Comments。この提案では、トークンスワップのスリッページ保護のために、実行時に信頼できる参照価格を取得する手段として再利用されます。

## Sandwich attack
- ja: サンドイッチ攻撃
- aliases: [Sandwiching]
- related: [MEV, Front-running, Back-running]
- auto_added: 2026-08-06
- auto_source_topic_id: 29292
- auto_source_url: https://ethereum-magicians.org/t/reference-relative-slippage-bounds/29292
- desc: |
  悪意のあるアクターが、ターゲットとなるトランザクションの前後で自身のトランザクションを挿入し、価格を操作することで利益を得るMEVの一種。この提案は、この攻撃による抽出可能な価値を狭めることを目的としています。

## minAmountOut
- ja: 最小出力量 (minAmountOut)
- related: [Slippage, Sandwich attack, Reference-Relative Slippage Bounds]
- auto_added: 2026-08-06
- auto_source_topic_id: 29292
- auto_source_url: https://ethereum-magicians.org/t/reference-relative-slippage-bounds/29292
- desc: |
  トークンスワップにおいて、トランザクションが成功するために最低限受け取るべき出力トークン量を指定するパラメータ。静的な値であるため、市場価格の変動やサンドイッチ攻撃によってユーザーが不利になる可能性があります。

## Slippage policy
- ja: スリッページポリシー
- related: [Reference-Relative Slippage Bounds, ERC-7726, maxDeviationBps, hardFloor]
- auto_added: 2026-08-06
- auto_source_topic_id: 29292
- auto_source_url: https://ethereum-magicians.org/t/reference-relative-slippage-bounds/29292
- desc: |
  トークンスワップにおけるスリッページ保護のルールを定義する構造体。参照価格オラクル、最大許容乖離率、絶対的な最低出力値を指定し、動的なスリッページ保護を可能にします。

## Capella
- ja: カペラ
- aliases: [Shapella]
- related: [Shanghai, withdrawal credential]
- auto_added: 2026-08-06
- auto_source_topic_id: 29284
- auto_source_url: https://ethereum-magicians.org/t/eip-8365-bls-withdrawal-credential-retirement/29284
- desc: |
  EthereumのShapella（Shanghai + Capella）アップグレードの一部で、主にビーコンチェーンからのETH出金を可能にした。これにより、バリデータはステークしたETHを引き出すことができるようになった。

## staged deprecation
- ja: 段階的廃止
- related: [BLS withdrawal credential retirement, balance drain]
- auto_added: 2026-08-06
- auto_source_topic_id: 29284
- auto_source_url: https://ethereum-magicians.org/t/eip-8365-bls-withdrawal-credential-retirement/29284
- desc: |
  プロトコル内の特定の機能やコンポーネントを、複数の段階（例：廃止、排出、削除）を経て徐々に廃止していくプロセス。これにより、システムへの影響を最小限に抑えつつ、スムーズな移行を促進する。

## balance drain
- ja: 残高排出
- related: [staged deprecation, BLS withdrawal credential retirement, 0x01 withdrawal credential type]
- auto_added: 2026-08-06
- auto_source_topic_id: 29284
- auto_source_url: https://ethereum-magicians.org/t/eip-8365-bls-withdrawal-credential-retirement/29284
- desc: |
  段階的廃止プロセスの一環として、廃止されるバリデータやアカウントから残りのETH残高を、指定された有効な出金先アドレス（例：0x01出金資格タイプ）へ移動させるプロトコルアクション。

## 0x01 withdrawal credential type
- ja: 0x01出金資格タイプ
- aliases: [Execution Layer withdrawal credential type]
- related: [0x00 withdrawal credential type, withdrawal credential, BLSToExecutionChange]
- auto_added: 2026-08-06
- auto_source_topic_id: 29284
- auto_source_url: https://ethereum-magicians.org/t/eip-8365-bls-withdrawal-credential-retirement/29284
- desc: |
  Ethereumのビーコンチェーンバリデータが出金先アドレスを指定する際に使用するタイプの一つ。これは実行層のアドレスを指し、バリデータ報酬やステークされたETHの引き出しをそのアドレスで管理できるようにする。

## Zero-Knowledge Spending Policies
- ja: ゼロ知識支出ポリシー
- aliases: [ZKSP]
- related: [Spending policy, Zero-knowledge proof, Account abstraction]
- auto_added: 2026-08-06
- auto_source_topic_id: 29281
- auto_source_url: https://ethereum-magicians.org/t/erc-8366-zero-knowledge-spending-policies/29281
- desc: |
  ユーザーの資金を保持するコントラクトが、事前に登録された支出ポリシーを満たすゼロ知識証明がある場合にのみ資金を解放することを標準化する機能セット。ポリシーのパラメータはコミットメントとしてプライベートに保たれる。

## Spending policy
- ja: 支出ポリシー
- related: [Zero-Knowledge Spending Policies, Commitment, Zero-knowledge proof]
- auto_added: 2026-08-06
- auto_source_topic_id: 29281
- auto_source_url: https://ethereum-magicians.org/t/erc-8366-zero-knowledge-spending-policies/29281
- desc: |
  ユーザーが事前に登録する、資金の支出に関するルール。このポリシーはコミットメントとして登録され、そのパラメータはプライベートに保たれる。ゼロ知識証明によって、支払いがこのポリシーを満たすことが検証される。

## Delegation by constraint
- ja: 制約による委任
- related: [Autonomous agents, Spending policy, Zero-Knowledge Spending Policies]
- auto_added: 2026-08-06
- auto_source_topic_id: 29281
- auto_source_url: https://ethereum-magicians.org/t/erc-8366-zero-knowledge-spending-policies/29281
- desc: |
  資金の所有者が支払い条件を制約として設定し、エージェントはその制約内で自由に活動できるメカニズム。決済レイヤー自体が制約外の支払いを拒否することで、エージェントの自律性と安全性を両立させる。

## Off-chain facts
- ja: オフチェーンの事実
- related: [Zero-knowledge proof, Policy circuit, Merchant-signed quote]
- auto_added: 2026-08-06
- auto_source_topic_id: 29281
- auto_source_url: https://ethereum-magicians.org/t/erc-8366-zero-knowledge-spending-policies/29281
- desc: |
  ブロックチェーン上に直接存在しないが、ゼロ知識証明の入力として利用される情報。例えば、マーチャントが署名した見積もりなどがこれに該当し、オンチェーン状態のみでは評価できないポリシーの実現を可能にする。

## Proof envelope
- ja: 証明エンベロープ
- related: [ERC-1271, isValidSignature, Digest binding]
- auto_added: 2026-08-06
- auto_source_topic_id: 29281
- auto_source_url: https://ethereum-magicians.org/t/erc-8366-zero-knowledge-spending-policies/29281
- desc: |
  ゼロ知識証明とクリアテキストの支払い承認情報（authorization）をERC-1271の`signature`スロットにパッキングして渡すためのデータ構造。これにより、コントラクトの署名として証明を伝達できる。

## Multi-dimensional metering
- ja: 多次元メータリング
- related: [Glamsterdam, EIP-8037, EIP-7999]
- auto_added: 2026-08-07
- auto_source_topic_id: 25644
- auto_source_url: https://ethresear.ch/t/demand-model-with-elasticities-for-ethereum-state-data-and-execution-and-glamsterdam-fee-market-analysis/25644
- desc: |
  Ethereumのガス市場において、単一のガス単位ですべてのリソースを計測・価格設定するのではなく、複数の異なるリソース（ステート、データ、実行など）を個別に計測し、それぞれに価格を付ける設計。これにより、各リソースの需要と供給に応じたより効率的な価格設定が可能になる。

## Resource-specific capacity rules
- ja: リソース固有の容量ルール
- related: [Multi-dimensional metering, Gas target, Gas limit]
- auto_added: 2026-08-07
- auto_source_topic_id: 25644
- auto_source_url: https://ethresear.ch/t/demand-model-with-elasticities-for-ethereum-state-data-and-execution-and-glamsterdam-fee-market-analysis/25644
- desc: |
  Ethereumの多次元ガス市場において、各EVMリソース（ステート、データ、実行など）に対して個別に設定されるガス目標値（gas target）とガス上限値（gas limit）のこと。これにより、各リソースの消費を独立して管理し、市場の安定性を図る。

## Metering multiplier
- ja: メータリング乗数
- related: [Glamsterdam, Gas accounting]
- auto_added: 2026-08-07
- auto_source_topic_id: 25644
- auto_source_url: https://ethresear.ch/t/demand-model-with-elasticities-for-ethereum-state-data-and-execution-and-glamsterdam-fee-market-analysis/25644
- desc: |
  Glamsterdamのガス会計ルールにおいて、同じアクティビティに対する過去のガス単位を新しいGlamsterdamガス単位に変換するために使用される係数。これにより、各リソースの有効価格が再設定され、需要への影響が分析される。

## Binding branch
- ja: 結合ブランチ
- related: [Glamsterdam, Shared base fee, Regular gas branch, State branch]
- auto_added: 2026-08-07
- auto_source_topic_id: 25644
- auto_source_url: https://ethresear.ch/t/demand-model-with-elasticities-for-ethereum-state-data-and-execution-and-glamsterdam-fee-market-analysis/25644
- desc: |
  Glamsterdamの共有手数料市場において、レギュラーガス（実行とデータ）とステートガスという2つのブランチのうち、より多くのメータリングガスを消費し、共有ベースフィーを決定する側のブランチを指す。市場の均衡点と価格設定に直接影響を与える。

## Independent-demand benchmark
- ja: 独立需要ベンチマーク
- related: [Own-price elasticity, Cross-price terms]
- auto_added: 2026-08-07
- auto_source_topic_id: 25644
- auto_source_url: https://ethresear.ch/t/demand-model-with-elasticities-for-ethereum-state-data-and-execution-and-glamsterdam-fee-market-analysis/25644
- desc: |
  Ethereumのガス市場分析において、各リソース（実行、データ、ステート）の需要が他のリソースの価格に依存しないと仮定するモデル。この仮定は、過去の価格変動データから各リソースの自己価格弾力性を推定するための識別ギャップを埋めるために用いられる。

## Wash-building
- ja: ウォッシュビルディング
- related: [Sybil problem, Wash tree, External value anchor]
- auto_added: 2026-08-07
- auto_source_topic_id: 25643
- auto_source_url: https://ethresear.ch/t/wash-building-in-contribution-protocols-is-not-a-sybil-problem/25643
- desc: |
  貢献プロトコルにおいて、多数の真正な異なるアイデンティティが、互いの価値のないコンテンツに基づいて構築し、相互に承認し合う行為。シビル攻撃とは異なり、偽のアイデンティティは含まれない。

## Wash tree
- ja: ウォッシュツリー
- related: [Wash-building, Genuine collaboration]
- auto_added: 2026-08-07
- auto_source_topic_id: 25643
- auto_source_url: https://ethresear.ch/t/wash-building-in-contribution-protocols-is-not-a-sybil-problem/25643
- desc: |
  ウォッシュビルディングの一種で、真正なアイデンティティが互いの価値のないコンテンツに基づいて構築し、相互に承認し合う構造。正直な階層的作業と構造的に区別がつかない特徴を持つ。

## External value anchor
- ja: 外部価値アンカー
- related: [Wash-building, Proof-of-work]
- auto_added: 2026-08-07
- auto_source_topic_id: 25643
- auto_source_url: https://ethresear.ch/t/wash-building-in-contribution-protocols-is-not-a-sybil-problem/25643
- desc: |
  貢献プロトコルにおけるウォッシュビルディングに対抗するために必要な、疑わしい共謀セットの外部で生成される価値シグナル。独立した当事者による実際の利用、下流の資金提供、外部からの採用などがこれに該当する。

## Contribution-denominated bond
- ja: 貢献額建て債券 (Contribution-denominated bond)
- related: [External value anchor, Vesting, Clawback]
- auto_added: 2026-08-07
- auto_source_topic_id: 25643
- auto_source_url: https://ethresear.ch/t/wash-building-in-contribution-protocols-is-not-a-sybil-problem/25643
- desc: |
  ウォッシュビルディングを防ぐために提案されるメカニズム。将来の外部利用に対して貢献額で担保され、利用時に返還される。共謀の度合いに応じてリスクが増大する。

## Myerson value
- ja: マイアソン値
- related: [Shapley value, Sybil problem]
- auto_added: 2026-08-07
- auto_source_topic_id: 25643
- auto_source_url: https://ethresear.ch/t/wash-building-in-contribution-protocols-is-not-a-sybil-problem/25643
- desc: |
  シビル攻撃への耐性を持つ集計ルールとして言及される、グラフ接続された連合に限定されたシャプレー値。グラフ内で切断されたアイデンティティは価値をプールできないため、偽造されたアイデンティティの限界貢献はゼロに近くなる。

## PQ-DAS
- ja: 量子耐性データ可用性サンプリング (PQ-DAS)
- aliases: [Post-Quantum Data Availability Sampling]
- related: [Data Availability Sampling, Post-Quantum Security, KZG polynomial commitments]
- auto_added: 2026-08-07
- auto_source_topic_id: 25642
- auto_source_url: https://ethresear.ch/t/pq-das-from-leanvm-design-and-benchmark/25642
- desc: |
  Ethereumのデータ可用性サンプリング(DAS)プロトコルにおいて、量子コンピュータの脅威に対応するために提案された、量子耐性のある代替手段。現在のKZGベースのDASプロトコルを置き換えることを目指す。

## Encode + Prove DAS
- ja: エンコード＋証明DAS
- aliases: [Encode + Prove paradigm]
- related: [Data Availability Sampling, SNARK proof system, Vector Commitment Scheme]
- auto_added: 2026-08-07
- auto_source_topic_id: 25642
- auto_source_url: https://ethresear.ch/t/pq-das-from-leanvm-design-and-benchmark/25642
- desc: |
  データ可用性サンプリング(DAS)プロトコルの一種で、ビルダーがデータを符号化し、ベクトルコミットメントスキームでコミットし、コミットされたオブジェクトが有効なコードワードであることをSNARK証明システムで証明するパラダイム。

## KoalaBear quintic extension field
- ja: KoalaBear五次拡大体
- related: [Reed-Solomon code, Finite field]
- auto_added: 2026-08-07
- auto_source_topic_id: 25642
- auto_source_url: https://ethresear.ch/t/pq-das-from-leanvm-design-and-benchmark/25642
- desc: |
  リード・ソロモン符号の実装に使用される特定の有限体。この五次拡大体上で符号化と評価が行われる。

## RS Membership Check Instantiations
- ja: RSメンバーシップチェックの実装
- related: [Reed-Solomon code, SNARK proof system, Barycentric check, Parity check]
- auto_added: 2026-08-07
- auto_source_topic_id: 25642
- auto_source_url: https://ethresear.ch/t/pq-das-from-leanvm-design-and-benchmark/25642
- desc: |
  リード・ソロモン符号のコードワードが有効であることをSNARK証明システム内で検証するための具体的な手法。パリティチェック、汎用重心チェック、特殊重心チェックなどのアプローチがある。

## Full DAS throughput
- ja: フルDASスループット
- related: [Data Availability Sampling, LeanVM proving throughput, Dpayload, Ttotal]
- auto_added: 2026-08-07
- auto_source_topic_id: 25642
- auto_source_url: https://ethresear.ch/t/pq-das-from-leanvm-design-and-benchmark/25642
- desc: |
  ビルダーからバリデーターへのブロック承認パスにおいて、1秒あたりに処理できる有用なブロブペイロードの総データ量を示す主要な性能指標。ビルダー側の処理時間と検証者側の処理時間を合計して算出される。

## Poseidon hash
- ja: Poseidonハッシュ
- related: [hash function, zero-knowledge proof]
- auto_added: 2026-08-07
- auto_source_topic_id: 25637
- auto_source_url: https://ethresear.ch/t/poseidon-hash-for-ethereum-is-not-secure/25637
- desc: |
  暗号技術で用いられるハッシュ関数の一種。特にゼロ知識証明システムで効率的に計算できるよう設計されており、zk-SNARKsなどの文脈で利用されます。

## Classical preimage
- ja: 古典的原像（耐性）
- related: [Preimage resistance, Quantum preimage, Hash function]
- auto_added: 2026-08-07
- auto_source_topic_id: 25637
- auto_source_url: https://ethresear.ch/t/poseidon-hash-for-ethereum-is-not-secure/25637
- desc: |
  古典的な計算能力を持つ攻撃者が、ハッシュ値から元の入力（原像）を見つけることの困難さを示す指標。ビット数で表現され、この値が大きいほど安全性が高いとされます。

## Quantum preimage
- ja: 量子的原像（耐性）
- related: [Preimage resistance, Classical preimage, Quantum computing]
- auto_added: 2026-08-07
- auto_source_topic_id: 25637
- auto_source_url: https://ethresear.ch/t/poseidon-hash-for-ethereum-is-not-secure/25637
- desc: |
  量子コンピュータを持つ攻撃者が、ハッシュ値から元の入力（原像）を見つけることの困難さを示す指標。古典的な計算能力の場合よりも耐性ビット数が低下することが一般的です。

## Ashlar
- ja: アシュラー
- related: [Arithmetization-Oriented Hash, Squaring Degree Engine, CICO Ideal Degree, R1CS Constraint]
- auto_added: 2026-08-07
- auto_source_topic_id: 25634
- auto_source_url: https://ethresear.ch/t/ashlar-an-ao-hash-from-a-squaring-degree-engine-and-a-request-for-cryptanalysis/25634
- desc: |
  Squaring Degree Engineを基盤とする新しい算術化指向ハッシュ関数。FreeLunch攻撃に対する耐性を考慮し、R1CS制約あたりのCICO理想次数ビット数を最大化することを目指して設計された。

## Arithmetization-Oriented Hash
- ja: 算術化指向ハッシュ (AOハッシュ)
- aliases: [AO hash]
- related: [R1CS Constraint, ZK-SNARKs, STARKs, Poseidon, Rescue-Prime]
- auto_added: 2026-08-07
- auto_source_topic_id: 25634
- auto_source_url: https://ethresear.ch/t/ashlar-an-ao-hash-from-a-squaring-degree-engine-and-a-request-for-cryptanalysis/25634
- desc: |
  算術回路（特にR1CSやAIR）での効率的な実装と検証を目的として設計されたハッシュ関数。ZK-SNARKsなどのゼロ知識証明システムにおいて、証明生成コストを低減するために重要となる。

## CICO Ideal Degree
- ja: CICO理想次数
- related: [FreeLunch attack, Algebraic attack]
- auto_added: 2026-08-07
- auto_source_topic_id: 25634
- auto_source_url: https://ethresear.ch/t/ashlar-an-ao-hash-from-a-squaring-degree-engine-and-a-request-for-cryptanalysis/25634
- desc: |
  暗号学的ハッシュ関数のセキュリティ分析、特に代数攻撃（FreeLunch攻撃など）の文脈で用いられる概念。入力-出力関係を記述する多項式系のイデアルの次数を指し、攻撃の計算量の下限を評価する指標となる。

## Squaring Degree Engine
- ja: 二乗次数エンジン
- related: [Ashlar, Feistel Chain, R1CS Constraint]
- auto_added: 2026-08-07
- auto_source_topic_id: 25634
- auto_source_url: https://ethresear.ch/t/ashlar-an-ao-hash-from-a-squaring-degree-engine-and-a-request-for-cryptanalysis/25634
- desc: |
  Ashlarハッシュ関数の中心的な設計要素。従来のべき乗マップの代わりに、フィールドの二乗演算をFeistelチェーンとして利用することで、R1CS制約あたりの理想次数ビット数を最大化することを目指す。

## R1CS Constraint
- ja: R1CS制約
- aliases: [Rank-1 Constraint System constraint]
- related: [Arithmetic Circuit, ZK-SNARKs]
- auto_added: 2026-08-07
- auto_source_topic_id: 25634
- auto_source_url: https://ethresear.ch/t/ashlar-an-ao-hash-from-a-squaring-degree-engine-and-a-request-for-cryptanalysis/25634
- desc: |
  Rank-1 Constraint Systemにおける制約。ゼロ知識証明システム（特にZK-SNARKs）において、計算の正当性を検証するために必要な算術回路の複雑さを測る基本的な単位。証明生成の計算コストに直結する。

## Normalized state gas limit
- ja: 正規化されたステートガス制限
- related: [State gas, Execution gas, EIP-8037, EIP-8075, EIP-7999, Multidimensional fee market]
- auto_added: 2026-08-07
- auto_source_topic_id: 29332
- auto_source_url: https://ethereum-magicians.org/t/eip-8372-normalized-state-gas-limit/29332
- desc: |
  EIP-8372で提案される、ステートガスと実行ガス利用のバランスを取るためにステートガス制限を調整するメカニズムです。ステートガスの利用量をブロックレベルで集計する前に正規化することで、ステート成長の目標を維持しつつ、ステートバイト価格が需要を反映するように調整します。

## State gas
- ja: ステートガス
- aliases: [state-gas]
- related: [Execution gas, Gas limit, CPSB, State growth, Multidimensional fee market]
- auto_added: 2026-08-07
- auto_source_topic_id: 29332
- auto_source_url: https://ethereum-magicians.org/t/eip-8372-normalized-state-gas-limit/29332
- desc: |
  Ethereumにおいて、ブロックチェーンの状態（ステート）へのアクセスや変更にかかるコストを測定するためのガスです。実行ガスとは異なり、主にストレージの読み書きやアカウントの作成・削除に関連するリソース消費を反映します。

## Execution gas
- ja: 実行ガス
- aliases: [execution-gas]
- related: [State gas, Gas limit, EVM, Transaction]
- auto_added: 2026-08-07
- auto_source_topic_id: 29332
- auto_source_url: https://ethereum-magicians.org/t/eip-8372-normalized-state-gas-limit/29332
- desc: |
  Ethereumにおいて、EVM上でのトランザクション実行にかかる計算コストを測定するためのガスです。スマートコントラクトのロジック処理や計算命令の実行に消費されるリソースを反映し、ステートガスとは区別されます。

## Multidimensional fee market
- ja: 多次元手数料市場
- related: [EIP-7999, Fee market, State gas, Execution gas]
- auto_added: 2026-08-07
- auto_source_topic_id: 29332
- auto_source_url: https://ethereum-magicians.org/t/eip-8372-normalized-state-gas-limit/29332
- desc: |
  Ethereumの長期的な方向性として提案されている、複数のリソース（例：実行ガス、ステートガス、データ可用性）に対してそれぞれ独立した料金メカニズムを持つ市場です。各リソースの需要と供給に基づいて料金が決定されることで、より効率的なリソース配分を目指します。

## RowDAS
- ja: RowDAS
- related: [PeerDAS, DAS, blobspace]
- auto_added: 2026-08-07
- auto_source_topic_id: 29320
- auto_source_url: https://ethereum-magicians.org/t/eip-8371-rowdas-distributed-blobspace-reconstruction/29320
- desc: |
  EIP-8371で提案されている、分散型ブロブスペース再構築を可能にするデータ可用性サンプリング（DAS）の新しいアプローチです。部分的なメッセージベースの行トピックを使用し、スーパーノードの負担を軽減します。

## Distributed Blobspace Reconstruction
- ja: 分散型ブロブスペース再構築 (Distributed Blobspace Reconstruction)
- related: [RowDAS, PeerDAS, DAS, blobspace]
- auto_added: 2026-08-07
- auto_source_topic_id: 29320
- auto_source_url: https://ethereum-magicians.org/t/eip-8371-rowdas-distributed-blobspace-reconstruction/29320
- desc: |
  RowDASによって実現される、ブロブスペースのデータを複数のノードが協力して再構築するプロセスです。スーパーノードへの集中負担を軽減し、DASの効率と回復力を向上させます。

## supernodes
- ja: スーパーノード
- related: [PeerDAS, DAS]
- auto_added: 2026-08-07
- auto_source_topic_id: 29320
- auto_source_url: https://ethereum-magicians.org/t/eip-8371-rowdas-distributed-blobspace-reconstruction/29320
- desc: |
  PeerDASのようなデータ可用性サンプリングの設計において、ブロブの再構築など特定の高負荷なタスクを担うノードです。その役割により、ブロブ数に応じて高い負担がかかる可能性があります。

## partial message based row topics
- ja: 部分メッセージベースの行トピック (partial message based row topics)
- related: [RowDAS, DAS]
- auto_added: 2026-08-07
- auto_source_topic_id: 29320
- auto_source_url: https://ethereum-magicians.org/t/eip-8371-rowdas-distributed-blobspace-reconstruction/29320
- desc: |
  RowDASが分散型ブロブスペース再構築を実現するために使用するメカニズムです。これにより、すべてのノードが再構築に貢献できるようになり、スーパーノードの負荷が大幅に軽減されます。

## Merkle proof
- ja: マークル証明
- related: [Merkle tree, Merkle root, ZK proof, Storage proof]
- auto_added: 2026-08-07
- auto_source_topic_id: 29315
- auto_source_url: https://ethereum-magicians.org/t/is-there-appetite-for-a-cheaper-on-chain-ao-hash-ashlar-14-232-gas-vs-poseidons-18-229/29315
- desc: |
  データがマークルツリーの特定のルートに含まれていることを簡潔に検証するための暗号学的証明。ブロックチェーンにおいて、特定のトランザクションやデータがブロックに含まれていることを効率的に検証するために広く利用されます。

## Storage proof
- ja: ストレージ証明
- related: [Merkle proof, State proof, ZK proof]
- auto_added: 2026-08-07
- auto_source_topic_id: 29315
- auto_source_url: https://ethereum-magicians.org/t/is-there-appetite-for-a-cheaper-on-chain-ao-hash-ashlar-14-232-gas-vs-poseidons-18-229/29315
- desc: |
  ブロックチェーンの特定のストレージスロットに格納されている値が、特定のブロックのステートルートに存在することを検証する証明。スマートコントラクトの状態の検証や、オフチェーンデータとの連携に用いられます。

## Rollup withdrawal proof
- ja: ロールアップ引き出し証明
- related: [Rollup, ZK proof, Withdrawal]
- auto_added: 2026-08-07
- auto_source_topic_id: 29315
- auto_source_url: https://ethereum-magicians.org/t/is-there-appetite-for-a-cheaper-on-chain-ao-hash-ashlar-14-232-gas-vs-poseidons-18-229/29315
- desc: |
  レイヤー2ロールアップからレイヤー1ブロックチェーンへ資産を引き出す際に、引き出しトランザクションがロールアップのルールに従って正しく実行されたことを証明するもの。通常、ZK証明やオプティミスティック証明の形式で提供されます。

## BN254
- ja: BN254 (楕円曲線)
- related: [Elliptic curve, ZK-SNARK, Pairing-friendly curve]
- auto_added: 2026-08-07
- auto_source_topic_id: 29315
- auto_source_url: https://ethereum-magicians.org/t/is-there-appetite-for-a-cheaper-on-chain-ao-hash-ashlar-14-232-gas-vs-poseidons-18-229/29315
- desc: |
  暗号学で広く用いられるペアリングフレンドリーな楕円曲線の一つ。特にゼロ知識証明システム（ZK-SNARKs）において、効率的な証明生成と検証を可能にするために利用されます。

## Plonkish
- ja: Plonkish (証明システム)
- related: [ZK-SNARK, PLONK, STARK]
- auto_added: 2026-08-07
- auto_source_topic_id: 29315
- auto_source_url: https://ethereum-magicians.org/t/is-there-appetite-for-a-cheaper-on-chain-ao-hash-ashlar-14-232-gas-vs-poseidons-18-229/29315
- desc: |
  PLONK証明システムに触発された、特定の構造を持つゼロ知識証明システムのファミリーを指します。柔軟なゲート制約とユニバーサルなセットアップにより、様々な計算を効率的に証明できる特徴を持ちます。

## Zero-Knowledge Contingent Payments
- ja: ゼロ知識条件付き支払い
- aliases: [ZKCP]
- related: [Zero-Knowledge Proof, Fair Exchange Problem, Atomic Swap]
- auto_added: 2026-08-08
- auto_source_topic_id: 25660
- auto_source_url: https://ethresear.ch/t/atomic-zk-proof-gated-settlement-for-x402-agent-payments-a-measured-reference-design/25660
- desc: |
  ゼロ知識証明の検証が成功した場合にのみ支払いが実行されるように設計された支払いプロトコル。これにより、計算の正当性を検証するまで資金がロックされ、フェアな交換が保証されます。

## fair exchange problem
- ja: フェアエクスチェンジ問題
- related: [Zero-Knowledge Contingent Payments, Atomic Swap]
- auto_added: 2026-08-08
- auto_source_topic_id: 25660
- auto_source_url: https://ethresear.ch/t/atomic-zk-proof-gated-settlement-for-x402-agent-payments-a-measured-reference-design/25660
- desc: |
  2者間でデジタルアイテムを交換する際に、どちらか一方が相手を欺くことなく、両者が同時にアイテムを受け取ることを保証する問題。信頼できる第三者なしでは解決が困難とされる古典的な問題です。

## proof aggregation
- ja: 証明集約
- related: [Zero-Knowledge Proof, SNARK, STARK, Recursive SNARK]
- auto_added: 2026-08-08
- auto_source_topic_id: 25660
- auto_source_url: https://ethresear.ch/t/atomic-zk-proof-gated-settlement-for-x402-agent-payments-a-measured-reference-design/25660
- desc: |
  複数のゼロ知識証明を単一のより小さな証明にまとめる技術。これにより、オンチェーンでの検証コストを大幅に削減し、スケーラビリティを向上させることができます。

## adaptor signatures
- ja: アダプター署名
- related: [Atomic Swap, Scriptless Script, Schnorr Signature]
- auto_added: 2026-08-08
- auto_source_topic_id: 25660
- auto_source_url: https://ethresear.ch/t/atomic-zk-proof-gated-settlement-for-x402-agent-payments-a-measured-reference-design/25660
- desc: |
  特定の秘密情報（アダプター）が公開された場合にのみ有効になるように設計された署名スキーム。アトミックスワップやスクリプトレススクリプトなど、オンチェーンでの複雑なロジックをオフチェーンで実現するために利用されます。

## Hard Rug Pull
- ja: ハードラグプル
- related: [Soft Rug Pull, Deployer Abuse Patterns]
- auto_added: 2026-08-08
- auto_source_topic_id: 29359
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-token-launch-abuse-detection-and-remediation/29359
- desc: |
  トークン発行者が流動性プールから資金を全て引き抜き、トークンの価値をゼロにする悪質な行為。ERC-XXXXで定義されるデプロイヤーの不正パターンの一つ。

## Soft Rug Pull
- ja: ソフトラグプル
- related: [Hard Rug Pull, Deployer Abuse Patterns]
- auto_added: 2026-08-08
- auto_source_topic_id: 29359
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-token-launch-abuse-detection-and-remediation/29359
- desc: |
  トークン発行者が大量のトークンを秘密裏に売却するなどして、徐々にトークンの価値を希薄化させる不正行為。ERC-XXXXで定義されるデプロイヤーの不正パターンの一つ。

## Wash Launch
- ja: ウォッシュローンチ
- related: [Deployer Abuse Patterns, Wash Trading]
- auto_added: 2026-08-08
- auto_source_topic_id: 29359
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-token-launch-abuse-detection-and-remediation/29359
- desc: |
  トークン発行者が自身のウォレット間で取引を繰り返すことで、取引量や流動性を偽装し、トークンローンチを不正に操作する行為。ERC-XXXXで定義されるデプロイヤーの不正パターンの一つ。

## Deployer Bond
- ja: デプロイヤーボンド（発行者保証金）
- related: [Escrow, Remediation]
- auto_added: 2026-08-08
- auto_source_topic_id: 29359
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-token-launch-abuse-detection-and-remediation/29359
- desc: |
  トークン発行者がローンチ前に預託する保証金。不正行為が検出された場合に、購入者への返金や賠償に充てられる。ERC-XXXXにおける不正対策の主要なメカニズム。

## Pull-Refund Model
- ja: プル型返金モデル
- related: [Escrow, Pro-rata Refunds]
- auto_added: 2026-08-08
- auto_source_topic_id: 29359
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-token-launch-abuse-detection-and-remediation/29359
- desc: |
  トークン購入者が、不正が認定された場合にエスクローされた資金から自ら返金を引き出す形式の返金モデル。個別の請求や被害者の列挙が不要となる。

## passURI
- ja: passURI (パスURI)
- related: [tokenURI, JSON pass manifest, IERC721WalletPass]
- auto_added: 2026-08-08
- auto_source_topic_id: 29358
- auto_source_url: https://ethereum-magicians.org/t/wallet-pass-extension-for-nfts-surfacing-tokens-as-apple-wallet-google-wallet-passes/29358
- desc: |
  ERC-721トークンに紐付けられたウォレットパスのJSONマニフェストを解決するURIを返す関数。ERC-721のtokenURIと同様に、トークンに関連する外部リソースへの標準的な参照方法を提供する。

## JSON pass manifest
- ja: JSONパスマニフェスト
- related: [passURI, Wallet Pass Extension for NFTs]
- auto_added: 2026-08-08
- auto_source_topic_id: 29358
- auto_source_url: https://ethereum-magicians.org/t/wallet-pass-extension-for-nfts-surfacing-tokens-as-apple-wallet-google-wallet-passes/29358
- desc: |
  passURIによって返されるURIが指すJSONデータ構造。Apple WalletやGoogle Walletなどのモバイルウォレットパスのフォーマットと、そのパスの最終更新時刻に関する情報を含む。

## Unguessable Capability URLs
- ja: 推測不可能なケイパビリティURL
- aliases: [Capability URLs (for passes)]
- related: [Wallet Pass Extension for NFTs, Bearer file]
- auto_added: 2026-08-08
- auto_source_topic_id: 29358
- auto_source_url: https://ethereum-magicians.org/t/wallet-pass-extension-for-nfts-surfacing-tokens-as-apple-wallet-google-wallet-passes/29358
- desc: |
  モバイルウォレットパスに埋め込まれる、状態変更アクションをトリガーするためのセキュリティ強化されたURL。パスの転送時にURLが更新され、推測困難な形式であることで、パスの保有者がトークン所有者として不正に振る舞うことを防ぐ。

## Wallet Pass Extension for NFTs
- ja: NFT向けウォレットパス拡張
- related: [passURI, JSON pass manifest, Unguessable Capability URLs]
- auto_added: 2026-08-08
- auto_source_topic_id: 29358
- auto_source_url: https://ethereum-magicians.org/t/wallet-pass-extension-for-nfts-surfacing-tokens-as-apple-wallet-google-wallet-passes/29358
- desc: |
  NFTをApple WalletやGoogle Walletなどのモバイルウォレットパスとして表示・管理するための標準化された仕組み。トークンのライブ状態をパス上にレンダリングし、オンチェーン取引をトリガーする機能を提供する。

## Multi-holder semantics (for passes)
- ja: マルチホルダーセマンティクス（パス向け）
- related: [ERC-1155, Wallet Pass Extension for NFTs]
- auto_added: 2026-08-08
- auto_source_topic_id: 29358
- auto_source_url: https://ethereum-magicians.org/t/wallet-pass-extension-for-nfts-surfacing-tokens-as-apple-wallet-google-wallet-passes/29358
- desc: |
  ERC-1155のような複数の保有者が存在するトークンにおいて、ウォレットパスが個々の保有者とどのように紐付けられ、その状態やアクションが管理されるかに関する設計上の課題。将来的なウォレットパス標準の拡張で考慮されるべき点。

## Native Ethereum Delegation
- ja: ネイティブ・イーサリアム・デリゲーション
- aliases: [NED, Flanders Protocol]
- related: [Delegation domain, Concentration-sensitive economics, Bond-backed delegation capacity]
- auto_added: 2026-08-08
- auto_source_topic_id: 29356
- auto_source_url: https://ethereum-magicians.org/t/idea-native-ethereum-delegation-ned-a-protocol-level-delegation-market-with-diminishing-concentration-economics/29356
- desc: |
  イーサリアムのプロトコルレベルでデリゲーション市場を構築する提案。ETH保有者がETHの所有権を保持したまま、プロトコルを通じてバリデータにETHをデリゲートできるようにすることを目指す。既存の流動性ステーキングプロトコルや取引所によるデリゲーションの経済的影響をプロトコル内部に取り込み、競争を促進する。

## Delegation domain
- ja: デリゲーション・ドメイン
- related: [Native Ethereum Delegation, Validator set, Operator economic commitment]
- auto_added: 2026-08-08
- auto_source_topic_id: 29356
- auto_source_url: https://ethereum-magicians.org/t/idea-native-ethereum-delegation-ned-a-protocol-level-delegation-market-with-diminishing-concentration-economics/29356
- desc: |
  Native Ethereum Delegation (NED)において、デリゲーションの経済学が適用される経済単位。個々のバリデータキーではなく、複数のバリデータを束ねる論理的なグループとして機能し、委任されたETH、オペレーターの経済的コミットメント、パフォーマンス履歴などを集約する。

## Concentration-sensitive economics
- ja: 集中度感応型経済学
- related: [Native Ethereum Delegation, Delegation domain, Bond-backed delegation capacity]
- auto_added: 2026-08-08
- auto_source_topic_id: 29356
- auto_source_url: https://ethereum-magicians.org/t/idea-native-ethereum-delegation-ned-a-protocol-level-delegation-market-with-diminishing-concentration-economics/29356
- desc: |
  Native Ethereum Delegation (NED)の経済設計原則の一つで、デリゲーションドメインがネイティブにデリゲートされたETHのシェアを大きくするにつれて、追加のデリゲーションの経済的魅力が段階的に低下するように設計されたメカニズム。これにより、ステーキング市場における集中化を抑制し、競争を促進することを目指す。

## Bond-backed delegation capacity
- ja: ボンド担保型デリゲーション容量
- related: [Native Ethereum Delegation, Split-invariance property, Operator economic commitment]
- auto_added: 2026-08-08
- auto_source_topic_id: 29356
- auto_source_url: https://ethereum-magicians.org/t/idea-native-ethereum-delegation-ned-a-protocol-level-delegation-market-with-diminishing-concentration-economics/29356
- desc: |
  Native Ethereum Delegation (NED)において、オペレーターの経済的コミットメント（スラッシュ可能なボンド）に基づいて効率的なデリゲーション容量を決定するメカニズム。これにより、オペレーターが複数のドメインに分割してもデリゲーション効率が変化しない「分割不変性」を達成し、経済的アイデンティティの分割による報酬増加を防ぐ。

## Split-invariance property
- ja: 分割不変性
- related: [Bond-backed delegation capacity, Sybil resistance, Economic identity splitting]
- auto_added: 2026-08-08
- auto_source_topic_id: 29356
- auto_source_url: https://ethereum-magicians.org/t/idea-native-ethereum-delegation-ned-a-protocol-level-delegation-market-with-diminishing-concentration-economics/29356
- desc: |
  経済メカニズムの設計において、参加者が自身の資産や活動を複数の匿名エンティティに分割しても、全体としての経済的利益が変わらない、または悪化する特性。Native Ethereum Delegation (NED)では、オペレーターがデリゲーションドメインを分割しても報酬効率が向上しないように、この特性を持つメカニズムが求められる。

## Warm Access Sets
- ja: ウォームアクセスセット
- related: [EIP-2929, Accessed Addresses, Accessed Storage Keys, Gas Costs]
- auto_added: 2026-08-08
- auto_source_topic_id: 29341
- auto_source_url: https://ethereum-magicians.org/t/eip-8374-persist-warm-access-sets-across-reverts/29341
- desc: |
  EIP-2929で導入された概念で、トランザクション実行中にアクセスされたアドレスとストレージキーのセットです。これらのセットに含まれる要素へのアクセスは、ガス料金が安くなる「ウォーム」状態と見なされます。EIP-8374は、コールがリバートしてもウォーム状態が維持されるように変更を提案しています。

## Accessed Addresses
- ja: アクセス済みアドレス
- related: [Warm Access Sets, EIP-2929, Gas Costs]
- auto_added: 2026-08-08
- auto_source_topic_id: 29341
- auto_source_url: https://ethereum-magicians.org/t/eip-8374-persist-warm-access-sets-across-reverts/29341
- desc: |
  EIP-2929で導入された、トランザクション実行中にアクセスされたアドレスのセットです。このセットに含まれるアドレスへのアクセスは、ガス料金が安くなる「ウォーム」状態と見なされます。

## Accessed Storage Keys
- ja: アクセス済みストレージキー
- related: [Warm Access Sets, EIP-2929, Gas Costs]
- auto_added: 2026-08-08
- auto_source_topic_id: 29341
- auto_source_url: https://ethereum-magicians.org/t/eip-8374-persist-warm-access-sets-across-reverts/29341
- desc: |
  EIP-2929で導入された、トランザクション実行中にアクセスされたストレージキーのセットです。このセットに含まれるストレージキーへのアクセスは、ガス料金が安くなる「ウォーム」状態と見なされます。

## Call Frame
- ja: コールフレーム
- related: [EVM, Transaction Execution, Revert]
- auto_added: 2026-08-08
- auto_source_topic_id: 29341
- auto_source_url: https://ethereum-magicians.org/t/eip-8374-persist-warm-access-sets-across-reverts/29341
- desc: |
  EVMにおける関数呼び出しの実行コンテキストです。各コールは独自のコールフレームを持ち、その中でローカル変数、スタック、メモリなどが管理されます。コールがリバートすると、そのコールフレーム内で行われた状態変更は元に戻されます。

## Revert
- ja: リバート
- related: [Call Frame, Transaction Execution, Exception Handling]
- auto_added: 2026-08-08
- auto_source_topic_id: 29341
- auto_source_url: https://ethereum-magicians.org/t/eip-8374-persist-warm-access-sets-across-reverts/29341
- desc: |
  EthereumトランザクションまたはEVMコールが失敗し、その実行によって行われたすべての状態変更が元に戻されるプロセスです。これにより、トランザクションはブロックチェーンの状態に影響を与えずに終了しますが、ガス料金は消費されます。

## Behavioral Record
- ja: 行動記録
- related: [Time-Series Features, Transaction History]
- auto_added: 2026-08-09
- auto_source_topic_id: 25666
- auto_source_url: https://ethresear.ch/t/the-behavioral-record-time-series-as-evidence-and-the-oracle-problem-in-collective-judgment/25666
- desc: |
  スマートコントラクトや参加者のトランザクション履歴など、ブロックチェーン上での行動の時系列データ。特に、詐欺検出や信頼性の評価において、宣言的な情報よりも信頼性が高いとされる。

## Time-Series Features
- ja: 時系列特徴量
- related: [Behavioral Record, Ponzi Scheme Detection]
- auto_added: 2026-08-09
- auto_source_topic_id: 25666
- auto_source_url: https://ethresear.ch/t/the-behavioral-record-time-series-as-evidence-and-the-oracle-problem-in-collective-judgment/25666
- desc: |
  スマートコントラクトのライフサイクル全体にわたる行動を追跡するために抽出される、時間的要素を含むデータ特性。ポンジスキーム検出の精度向上に寄与する。

## Ponzi Scheme Detection
- ja: ポンジスキーム検出
- related: [Behavioral Record, Time-Series Features]
- auto_added: 2026-08-09
- auto_source_topic_id: 25666
- auto_source_url: https://ethresear.ch/t/the-behavioral-record-time-series-as-evidence-and-the-oracle-problem-in-collective-judgment/25666
- desc: |
  イーサリアム上のスマートコントラクトがポンジスキームであるかどうかを識別するプロセス。特に、コード分析だけでなく、トランザクション履歴の時系列パターンを分析する手法が有効とされる。

## Optimality of Structured Silence
- ja: 構造化された沈黙の最適性
- related: [Silent Oracle Strategy, Always-publish strategy, Coherence]
- auto_added: 2026-08-10
- auto_source_topic_id: 25674
- auto_source_url: https://ethresear.ch/t/coordination-collapse-and-the-optimality-of-silence-two-result-that-break-standard-bft-and-oracle-design/25674
- desc: |
  入力シグナルを一時的に操作できる攻撃者に対して、定義可能な不確実性のもとで公開を差し控える戦略が、常に公開する戦略よりも厳密に低い期待損失を達成するという定理。オラクル設計における「常に公開する」という標準的な慣行に反し、堅牢なオラクルシステムの構築に不可欠な概念である。

## Weighted BFT
- ja: 加重ビザンチンフォールトトレランス (Weighted BFT)
- related: [Byzantine Fault Tolerance, DW-BFT Weight, Coordination Collapse]
- auto_added: 2026-08-10
- auto_source_topic_id: 25674
- auto_source_url: https://ethresear.ch/t/coordination-collapse-and-the-optimality-of-silence-two-result-that-break-standard-bft-and-oracle-design/25674
- desc: |
  各バリデーターが異なる投票ウェイトを持つビザンチンフォールトトレランスシステム。通常、ステーク量に基づいてウェイトが割り当てられるが、本稿では行動の多様性も考慮したウェイト付けが提案されており、より現実的なセキュリティモデルを提供する。

## Behavioral vector
- ja: 行動ベクトル
- aliases: [M_j]
- related: [Coordination Collapse, Diversity Weight]
- auto_added: 2026-08-10
- auto_source_topic_id: 25674
- auto_source_url: https://ethresear.ch/t/coordination-collapse-and-the-optimality-of-silence-two-result-that-break-standard-bft-and-oracle-design/25674
- desc: |
  バリデーターの最近の行動（投票パターン、MEV行動、ブロックタイミング、プロポーザーブースト使用状況、オフチェーン通信シグナルなど）を要約した多次元ベクトル。バリデーターの行動特性を定量的に表現し、その独立性や相関性を評価するために用いられる。

## Sybil-decorrelation attack
- ja: シビルデコレーション攻撃
- related: [DW-BFT Weight, Sybil attacks, Diversity Weight]
- auto_added: 2026-08-10
- auto_source_topic_id: 25674
- auto_source_url: https://ethresear.ch/t/coordination-collapse-and-the-optimality-of-silence-two-result-that-break-standard-bft-and-oracle-design/25674
- desc: |
  DW-BFTシステムにおいて、攻撃者が意図的に複数のエンティティに分散し、それぞれがわずかに異なる行動をとることでダイバーシティウェイトを獲得し、その後攻撃時に再結託する可能性のある攻撃手法。DW-BFTの脆弱性として指摘されており、対策が求められる。

## Parametric Token
- ja: パラメトリックトークン
- related: [ERC-20, fungible token]
- auto_added: 2026-08-11
- auto_source_topic_id: 29385
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-parametric-token/29385
- desc: |
  各アカウントが独自のパラメータセットを保持できる、ERC-20互換の新しいトークンタイプ。トークンが転送されると、パラメータは決定論的に更新され、流動性を維持しつつ状態を持つトークンを実現する。

## Non-Zero-Sum Transfer
- ja: 非ゼロサム転送 (Non-Zero-Sum Transfer)
- aliases: [NZS Transfer]
- related: [Parametric Token]
- auto_added: 2026-08-11
- auto_source_topic_id: 29385
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-parametric-token/29385
- desc: |
  Parametric Token標準で導入される、送金元と受取先の金額が一致しない（creditAmount != debitAmount）特殊な転送。適切な残高計算のためにオプションのインターフェース実装が必要となる。

## Liquidity Consolidation
- ja: 流動性統合
- related: [Parametric Token, fragmented liquidity]
- auto_added: 2026-08-11
- auto_source_topic_id: 29385
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-parametric-token/29385
- desc: |
  パラメトリックトークンによって実現される、異なるパラメータを持つトークンが同じ流動性プールで取引されること。これにより、従来のステートフルなトークンで発生していた流動性の断片化を防ぐ。

## Velocity Control
- ja: 流動性速度制御
- related: [Parametric Token]
- auto_added: 2026-08-11
- auto_source_topic_id: 29385
- auto_source_url: https://ethereum-magicians.org/t/erc-xxxx-parametric-token/29385
- desc: |
  パラメトリックトークンを用いて、トークンの保有期間や年齢に基づいて手数料や報酬を設計し、トークンの回転率（流通速度）を効果的に制御する機能。トークン保有を奨励または抑制するために利用できる。

## eMBER
- ja: eMBER (ePBS実行報酬強制焼却)
- aliases: [ePBS Mandatory Burn of Execution Rewards]
- related: [ePBS, Burn, Execution Rewards]
- auto_added: 2026-08-12
- auto_source_topic_id: 29380
- auto_source_url: https://ethereum-magicians.org/t/eip-8375-ember-epbs-mandatory-burn-of-execution-rewards/29380
- desc: |
  EIP-8375で提案されている、ePBS環境下での実行報酬の強制焼却メカニズム。プロトコルレベルで実行報酬を焼却することで、MEVの分配とプロトコルの健全性を改善することを目指します。

## eth_simulateV1
- ja: eth_simulateV1 (RPCメソッド)
- related: [RPC, Execution API]
- auto_added: 2026-08-12
- auto_source_topic_id: 29377
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-32-august-10-2026/29377
- desc: |
  Ethereumの実行層APIにおけるRPCメソッドの一つで、トランザクションの実行をシミュレートするために使用されます。これにより、実際のオンチェーン実行前にトランザクションの結果やガス消費量を予測できます。

## EIP-1898
- ja: EIP-1898 (ブロック識別子)
- related: [EIP, BlockNumberOrTagOrHash]
- auto_added: 2026-08-12
- auto_source_topic_id: 29377
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-32-august-10-2026/29377
- desc: |
  Ethereum Improvement Proposalの一つで、RPCメソッドにおいてブロックを識別するための標準的な方法を定義しています。ブロック番号、タグ（"latest"など）、またはハッシュ値を用いてブロックを指定することを可能にします。

## BlockNumberOrTagOrHash
- ja: BlockNumberOrTagOrHash (ブロック識別子型)
- related: [EIP-1898, RPC]
- auto_added: 2026-08-12
- auto_source_topic_id: 29377
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-32-august-10-2026/29377
- desc: |
  EthereumのRPCメソッドでブロックを指定する際に用いられるデータ型です。ブロック番号、特定のタグ（例: "latest", "earliest", "pending"）、またはブロックハッシュのいずれかを使用してブロックを識別できます。

## EIP-8037
- ja: EIP-8037 (二次元ガス)
- related: [EIP, two-dimensional gas]
- auto_added: 2026-08-12
- auto_source_topic_id: 29377
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-32-august-10-2026/29377
- desc: |
  Ethereum Improvement Proposalの一つで、トランザクションのガス消費量を二次元的に扱う概念を導入します。これにより、実行ガスとデータガスなど、異なるリソースに対する料金体系をより柔軟に設計できるようになります。

## Transaction Validation
- ja: トランザクション検証
- aliases: [tx validation]
- related: [Mempool, Block Building]
- auto_added: 2026-08-12
- auto_source_topic_id: 29377
- auto_source_url: https://ethereum-magicians.org/t/rpc-standards-32-august-10-2026/29377
- desc: |
  ブロックチェーンネットワークにおいて、受信したトランザクションがプロトコルのルール（署名の有効性、残高、nonceなど）に準拠しているかを確認するプロセスです。これにより、不正なトランザクションがブロックに含まれることを防ぎます。

## Operator Family
- ja: オペレーターファミリー
- related: [Native Ethereum Delegation]
- auto_added: 2026-08-13
- auto_source_topic_id: 25699
- auto_source_url: https://ethresear.ch/t/idea-native-ethereum-delegation-ned-operator-families-and-concentration-reserve/25699
- desc: |
  Native Ethereum Delegation (NED) における経済的単位。単一のバリデーターキーではなく、永続的な暗号学的アイデンティティとして機能し、複数のバリデーターを運用できる。

## Quadratic Concentration Reserve
- ja: 二次集中化準備金
- related: [Native Ethereum Delegation, Operator Family, Sterile Operator Capital]
- auto_added: 2026-08-13
- auto_source_topic_id: 25699
- auto_source_url: https://ethresear.ch/t/idea-native-ethereum-delegation-ned-operator-families-and-concentration-reserve/25699
- desc: |
  オペレーターファミリーが管理する委任されたETHの量に応じて、二次関数的に増加する非生産的な資本要件。オペレーターの集中度が高まるにつれて、追加の資本コストを課すことで集中化を抑制する。

## Source-attributed Runoff
- ja: ソース帰属型ランオフ
- related: [Quadratic Concentration Reserve, Native Ethereum Delegation]
- auto_added: 2026-08-13
- auto_source_topic_id: 25699
- auto_source_url: https://ethresear.ch/t/idea-native-ethereum-delegation-ned-operator-families-and-concentration-reserve/25699
- desc: |
  委任されたETHの再委任（redelegation）によって二次集中化準備金が減少する場合、その減少分を元のオペレーターファミリーのランオフ残高に加算する仕組み。資本の即時解放を防ぎ、シビル攻撃による集中化コストの回避を困難にする。

## Sybil Boundary
- ja: シビル境界
- related: [Sybil Attack]
- auto_added: 2026-08-13
- auto_source_topic_id: 25699
- auto_source_url: https://ethresear.ch/t/idea-native-ethereum-delegation-ned-operator-families-and-concentration-reserve/25699
- desc: |
  分散型システムにおいて、信頼できる認証局なしに複数の偽のアイデンティティ（シビル）を区別することが根本的に不可能であるという限界。Native Ethereum Delegation (NED) のようなプロトコル設計における基本的な制約として認識される。

## Resource Vector
- ja: リソースベクトル
- related: [Multidimensional Fee Market, Execution Gas, State Gas, Data Resource]
- auto_added: 2026-08-13
- auto_source_topic_id: 25696
- auto_source_url: https://ethresear.ch/t/designs-for-evm-gas-accounting-in-eip-7999/25696
- desc: |
  EVMの多次元料金市場において、実行ガス、ステートガス、データガスなど複数のリソースの予算や消費量をまとめて表現する概念です。新しいEVM設計では、このベクトルを直接操作することが提案されています。

## Strict-Cap Call Opcode
- ja: 厳格な上限付きコールオペコード
- related: [Universal Overflow, CALL(g), Callee-Cap Compatibility]
- auto_added: 2026-08-13
- auto_source_topic_id: 25696
- auto_source_url: https://ethresear.ch/t/designs-for-evm-gas-accounting-in-eip-7999/25696
- desc: |
  Universal overflowの設計パラダイムで提案されている、サブコールが消費できるリソース量を厳密に制限するための新しいEVMオペコードです。呼び出し元が、呼び出し先の実行、ステート、データ容量を個別に正確に制限することを可能にします。

## Conservative Funding Check
- ja: 保守的な資金調達チェック
- related: [Aggregate EVM Gas, Funding Efficiency, Base Fee]
- auto_added: 2026-08-13
- auto_source_topic_id: 25696
- auto_source_url: https://ethresear.ch/t/designs-for-evm-gas-accounting-in-eip-7999/25696
- desc: |
  多次元料金市場の設計において、トランザクションが消費する可能性のあるすべてのリソースに対して、最も高いベースフィーで資金を確保する必要がある事前チェックです。これにより、実際の消費量よりも多くのETHを一時的にロックする必要が生じ、資金効率が低下する可能性があります。

## Funding Efficiency
- ja: 資金効率
- related: [Conservative Funding Check, Multidimensional Fee Market]
- auto_added: 2026-08-13
- auto_source_topic_id: 25696
- auto_source_url: https://ethresear.ch/t/designs-for-evm-gas-accounting-in-eip-7999/25696
- desc: |
  トランザクションを実行するために必要なETHの事前ロック量と、実際に消費されるリソースのコストとの比率を示す指標です。多次元料金市場の設計において、ユーザーの資金調達負担を軽減するための重要な評価軸となります。

## Callee-Cap Compatibility
- ja: 被呼び出し元制限の互換性
- related: [CALL(g), Universal Overflow, Strict-Cap Call Opcode]
- auto_added: 2026-08-13
- auto_source_topic_id: 25696
- auto_source_url: https://ethresear.ch/t/designs-for-evm-gas-accounting-in-eip-7999/25696
- desc: |
  呼び出し元がサブコール（被呼び出し元）の実行を制限する機能が、新しいガス会計設計においてどの程度維持されるかを示す指標です。特に、レガシーなCALL(g)オペコードが持つサンドボックス化やリソース制限の機能が、多次元ガス市場でどのように扱われるかが重要となります。

## Liquidator
- ja: リクイデーター
- related: [liquidation, over-collateralization]
- auto_added: 2026-08-13
- auto_source_topic_id: 25692
- auto_source_url: https://ethresear.ch/t/the-illusion-of-over-collateralization-why-static-c-ratios-fail-in-t-0-macro-panics-and-a-proposed-on-chain-solution/25692
- desc: |
  DeFiプロトコルにおいて、担保価値が特定の閾値を下回った際に、担保を清算して債務を返済する役割を担うエンティティ。通常、自動化されたボットによって実行される。

## UUPS Proxy
- ja: UUPSプロキシ
- aliases: [UUPS]
- related: [proxy upgradeable system, smart contract upgrade]
- auto_added: 2026-08-13
- auto_source_topic_id: 25692
- auto_source_url: https://ethresear.ch/t/the-illusion-of-over-collateralization-why-static-c-ratios-fail-in-t-0-macro-panics-and-a-proposed-on-chain-solution/25692
- desc: |
  アップグレード可能なスマートコントラクトの設計パターンの一つ。実装ロジックを別のコントラクトに委譲し、そのロジックコントラクトのアドレスをアップグレードすることで機能更新を可能にする。プロキシコントラクト自体は変更されず、ロジックコントラクトのみが更新される。

## Maturity Settlement Queue
- ja: 満期決済キュー
- aliases: [T+n Maturity Settlement Queue]
- related: [T+0 settlement, liquidity crisis, bank run]
- auto_added: 2026-08-13
- auto_source_topic_id: 25692
- auto_source_url: https://ethresear.ch/t/the-illusion-of-over-collateralization-why-static-c-ratios-fail-in-t-0-macro-panics-and-a-proposed-on-chain-solution/25692
- desc: |
  金融システムにおいて、特定の条件下で即時決済（T+0）を停止し、引き出し要求を一定期間後に処理するキュー。流動性危機時に資産の投げ売りを防ぎ、秩序ある清算を可能にするためのメカニズム。

## Dynamic Step-Function Penalty Curve
- ja: 動的ステップ関数ペナルティカーブ
- related: [bank run, mechanism design, swing pricing]
- auto_added: 2026-08-13
- auto_source_topic_id: 25692
- auto_source_url: https://ethresear.ch/t/the-illusion-of-over-collateralization-why-static-c-ratios-fail-in-t-0-macro-panics-and-a-proposed-on-chain-solution/25692
- desc: |
  プロトコルの流動性枯渇速度などの動的な条件に基づいて、引き出し手数料やペナルティを段階的に増加させるメカニズム。銀行取り付け騒ぎのような状況で、先着者利益を排除し、引き出しを抑制することを目的とする。

## Absolute Junior Subordination
- ja: 絶対劣後（Absolute Junior Subordination）
- related: [junior tranche, senior obligations, subordination ratio]
- auto_added: 2026-08-13
- auto_source_topic_id: 25692
- auto_source_url: https://ethresear.ch/t/the-illusion-of-over-collateralization-why-static-c-ratios-fail-in-t-0-macro-panics-and-a-proposed-on-chain-solution/25692
- desc: |
  資本構造において、劣後トランシェ（ジュニア）が優先トランシェ（シニア）の債務が完全に履行されるまで、いかなる引き出しも許可されない厳格なルール。シニア債務のフロントランニングを防ぎ、システム全体の安定性を確保するために用いられる。

## GKR
- ja: GKR (Grand Product Argument)
- aliases: [Grand Product Argument]
- related: [Sumcheck protocol, ZKP]
- auto_added: 2026-08-13
- auto_source_topic_id: 25691
- auto_source_url: https://ethresear.ch/t/ragged-multi-instance-gkr-for-poseidon2b-one-walk-unequal-regions-no-max-width-padding/25691
- desc: |
  複数の多項式の積の和を効率的に検証するためのゼロ知識証明プロトコル。特に、大規模な算術回路の検証コストを削減するために利用される。

## Poseidon2b
- ja: Poseidon2b
- related: [Poseidon hash, ハッシュ関数, ZKP]
- auto_added: 2026-08-13
- auto_source_topic_id: 25691
- auto_source_url: https://ethresear.ch/t/ragged-multi-instance-gkr-for-poseidon2b-one-walk-unequal-regions-no-max-width-padding/25691
- desc: |
  ZKPフレンドリーなハッシュ関数であるPoseidonの特定のバージョン。Ethereumの検証プロセスにおいて、特にポスト量子検証やGPUアクセラレーションの文脈でハッシュ計算の効率化に用いられる。

## Ragged embedding
- ja: ラギッド埋め込み
- related: [GKR, Max-width padding]
- auto_added: 2026-08-13
- auto_source_topic_id: 25691
- auto_source_url: https://ethresear.ch/t/ragged-multi-instance-gkr-for-poseidon2b-one-walk-unequal-regions-no-max-width-padding/25691
- desc: |
  GKRプロトコルにおいて、異なる論理幅（インスタンス数）を持つ複数の領域を効率的にバッチ処理するための手法。最大幅のパディングを物理的に行わずに、単一のGKRウォークで検証を可能にする。

## Boolean width
- ja: ブーリアン幅
- aliases: [w_a]
- related: [GKR, 算術回路]
- auto_added: 2026-08-13
- auto_source_topic_id: 25691
- auto_source_url: https://ethresear.ch/t/ragged-multi-instance-gkr-for-poseidon2b-one-walk-unequal-regions-no-max-width-padding/25691
- desc: |
  GKRプロトコルにおける特定の計算領域やインスタンスセットのサイズを示す指標。領域を表現するために必要なブーリアン変数の数を指す。

## Sumcheck degree
- ja: Sumcheck次数
- related: [Sumcheck protocol, GKR]
- auto_added: 2026-08-13
- auto_source_topic_id: 25691
- auto_source_url: https://ethresear.ch/t/ragged-multi-instance-gkr-for-poseidon2b-one-walk-unequal-regions-no-max-width-padding/25691
- desc: |
  Sumcheckプロトコルにおいて、検証対象となる多項式の最大次数。この次数はプロトコルの計算複雑性に影響を与える重要なパラメータである。

## CL-driven EL synchronisation
- ja: CL主導型EL同期
- aliases: [CL-driven EL sync]
- related: [Top-up Sync, Consensus Layer, Execution Layer]
- auto_added: 2026-08-13
- auto_source_topic_id: 29405
- auto_source_url: https://ethereum-magicians.org/t/eip-0000-top-up-sync/29405
- desc: |
  Ethereumのコンセンサス層（CL）が実行層（EL）の同期を主導するプロセス。Top-up Syncの文脈で、この同期の具体的な方法を指す。

## execution client head
- ja: 実行クライアントヘッド
- aliases: [EL client head]
- related: [Execution Layer, block header, state root, Top-up Sync]
- auto_added: 2026-08-13
- auto_source_topic_id: 29405
- auto_source_url: https://ethereum-magicians.org/t/eip-0000-top-up-sync/29405
- desc: |
  Ethereumの実行クライアントが認識している最新のブロックまたは状態。同期プロセスにおいて、クライアントがどの時点までデータを処理したかを示す。

## missing state
- ja: 不足状態
- related: [state, state root, execution client head, missing history, Top-up Sync]
- auto_added: 2026-08-13
- auto_source_topic_id: 29405
- auto_source_url: https://ethereum-magicians.org/t/eip-0000-top-up-sync/29405
- desc: |
  実行クライアントが同期中に必要とするが、まだ持っていないブロックチェーンの状態データ。ブロックの履歴とは区別され、Top-up Syncの主要な課題の一つ。

## missing history
- ja: 不足履歴
- related: [block, execution client head, missing state, Top-up Sync]
- auto_added: 2026-08-13
- auto_source_topic_id: 29405
- auto_source_url: https://ethereum-magicians.org/t/eip-0000-top-up-sync/29405
- desc: |
  実行クライアントが同期中に必要とするが、まだ持っていないブロックチェーンのブロック履歴。状態データとは区別され、Top-up Syncの主要な課題の一つ。

## Waggle protocol
- ja: ワグルプロトコル (Waggle protocol)
- related: [P2P networking, Client]
- auto_added: 2026-08-13
- auto_source_topic_id: 29404
- auto_source_url: https://ethereum-magicians.org/t/p2p-networking-6-august-12-2026/29404
- desc: |
  EthereumのP2Pネットワーキングに関する議論で言及された特定のプロトコル。クライアント間のデータ交換や通信を効率化するために提案されている可能性があります。

## Protocol Maturity and Ossification Framework
- ja: プロトコル成熟度と骨化フレームワーク
- related: [Protocol Maturity, Protocol Ossification, Protocol-Property Finality]
- auto_added: 2026-08-13
- auto_source_topic_id: 29376
- auto_source_url: https://ethereum-magicians.org/t/idea-meta-eip-protocol-maturity-and-ossification-framework/29376
- desc: |
  Ethereumプロトコルの各要素が、活発な開発段階から成熟し、最終的に変更されない「骨化」状態へと移行するための、提案されたメタEIPフレームワーク。プロトコルの安定性と信頼性を高めることを目的とする。

## Protocol-Property Finality
- ja: プロトコルプロパティのファイナリティ
- related: [Document Finality, Protocol Maturity, Protocol Ossification]
- auto_added: 2026-08-13
- auto_source_topic_id: 29376
- auto_source_url: https://ethereum-magicians.org/t/idea-meta-eip-protocol-maturity-and-ossification-framework/29376
- desc: |
  Ethereumプロトコルの特定のプロパティが、将来にわたって変更されないという明確な意図と合意が確立された状態を指す。EIP文書の最終状態（Document Finality）とは異なり、プロトコル自体の安定性へのコミットメントを示す。

## Protocol Maturity
- ja: プロトコル成熟度
- related: [Protocol Ossification, Protocol Maturity and Ossification Framework]
- auto_added: 2026-08-13
- auto_source_topic_id: 29376
- auto_source_url: https://ethereum-magicians.org/t/idea-meta-eip-protocol-maturity-and-ossification-framework/29376
- desc: |
  Ethereumプロトコルの特定のプロパティが、活発な開発段階を終え、安定しており、将来のユーザーが信頼できる状態になったことを指す。変更の必要性が低くなり、収束と長期的な安定性が重視される段階。

## Ossification Candidate
- ja: 骨化候補
- related: [Protocol Ossification, Protocol Maturity and Ossification Framework, Ossified (status)]
- auto_added: 2026-08-13
- auto_source_topic_id: 29376
- auto_source_url: https://ethereum-magicians.org/t/idea-meta-eip-protocol-maturity-and-ossification-framework/29376
- desc: |
  Ethereumプロトコルの特定のプロパティが、十分に成熟したと見なされ、変更に対する正当化の負担が大幅に高まる段階。コミュニティがそのプロパティをEthereumの永続的な社会契約の一部とする準備ができているか議論する。

## Ossified (status)
- ja: 骨化済み（ステータス）
- related: [Protocol Ossification, Ossification Candidate, Protocol Maturity and Ossification Framework]
- auto_added: 2026-08-13
- auto_source_topic_id: 29376
- auto_source_url: https://ethereum-magicians.org/t/idea-meta-eip-protocol-maturity-and-ossification-framework/29376
- desc: |
  Ethereumプロトコルの特定のプロパティが、通常のプロトコル設計空間の一部ではなくなったという明確な社会的合意に達した状態。将来のプロトコルアップグレードで変更すべきではないという規範的なコミットメントとなる。

## attenuated re-delegation
- ja: 減衰再委譲
- related: [mandate inheritance, autonomous agent, delegation]
- auto_added: 2026-08-14
- auto_source_topic_id: 29421
- auto_source_url: https://ethereum-magicians.org/t/a-map-of-the-agent-mandate-ercs-what-each-one-actually-does/29421
- desc: |
  親エージェントによって既に制約が課せられた状態で子エージェントが生成され、その制約が剥奪不可能であるような再委譲の概念です。Ethereumエコシステムにおける自律エージェントの権限管理において、未解決の課題の一つとされています。

## mandate inheritance
- ja: 委任の継承
- related: [attenuated re-delegation, autonomous agent, delegation]
- auto_added: 2026-08-14
- auto_source_topic_id: 29421
- auto_source_url: https://ethereum-magicians.org/t/a-map-of-the-agent-mandate-ercs-what-each-one-actually-does/29421
- desc: |
  親エージェントから子エージェントへ、その権限や制約が引き継がれるメカニズムです。特に、子エージェントが親の制約をそのまま、あるいはさらに減衰された形で継承するシナリオがEthereumリサーチで議論されています。

## intent/solver layer
- ja: インテント/ソルバー層
- related: [intent layer, MEV]
- auto_added: 2026-08-14
- auto_source_topic_id: 29421
- auto_source_url: https://ethereum-magicians.org/t/a-map-of-the-agent-mandate-ercs-what-each-one-actually-does/29421
- desc: |
  ユーザーの意図（インテント）を表現し、それを最適な方法で実行する（ソルバー）ための抽象化レイヤーです。Ethereumエコシステムにおいて、より高度な自動化とユーザー体験の向上を目指す文脈で提案されています。

## token-based role access control
- ja: トークンベースのロールアクセス制御
- related: [access control, ERC-721, ERC-20]
- auto_added: 2026-08-14
- auto_source_topic_id: 29421
- auto_source_url: https://ethereum-magicians.org/t/a-map-of-the-agent-mandate-ercs-what-each-one-actually-does/29421
- desc: |
  特定のトークンを所有しているかどうかに基づいて、ユーザーやエージェントに特定のロール（役割）とそれに対応するアクセス権限を付与するメカニズムです。スマートコントラクトや分散型アプリケーションにおける権限管理に利用されます。

## Regulated Agent Mandate
- ja: 規制されたエージェントの委任 (ERC-8226)
- aliases: [ERC-8226]
- related: [autonomous agent, delegation, compliance]
- auto_added: 2026-08-14
- auto_source_topic_id: 29421
- auto_source_url: https://ethereum-magicians.org/t/a-map-of-the-agent-mandate-ercs-what-each-one-actually-does/29421
- desc: |
  プリンシパルがエージェントに対して、スコープ、上限、時間制限を設けた委任を行うための標準です。規制されたトークンの既存の事前転送フック内でチェックされ、トランザクションごとおよび累積の上限、凍結、コンプライアンスプロバイダーの機能を含む概念です。

## BAL data
- ja: BALデータ (Bytecode Access Listデータ)
- related: [Bytecode Access List, EIP-7928, EIP-7999]
- auto_added: 2026-08-15
- auto_source_topic_id: 29427
- auto_source_url: https://ethereum-magicians.org/t/preserving-censorship-resistance-for-bal-data-in-eip-7999/29427
- desc: |
  EIP-7928で導入された、トランザクション実行中にアクセスまたはデプロイされたバイトコードを記録するデータ。EIP-7999では、このデータもデータリソースの一部として扱われる。

## data gas
- ja: データガス
- related: [EIP-7999, execution gas, calldata]
- auto_added: 2026-08-15
- auto_source_topic_id: 29427
- auto_source_url: https://ethereum-magicians.org/t/preserving-censorship-resistance-for-bal-data-in-eip-7999/29427
- desc: |
  EIP-7999で提案されている、トランザクションのデータリソース消費に対して課されるガス。EVMの実行ガスとは分離して扱われ、データ可用性の確保を目的とする。

## runtime code
- ja: ランタイムコード
- related: [initcode, smart contract, EVM]
- auto_added: 2026-08-15
- auto_source_topic_id: 29427
- auto_source_url: https://ethereum-magicians.org/t/preserving-censorship-resistance-for-bal-data-in-eip-7999/29427
- desc: |
  スマートコントラクトがブロックチェーンにデプロイされた後に実行される実際のバイトコード。コントラクトの初期化コード（initcode）によって生成される。

## initcode
- ja: 初期化コード
- related: [runtime code, smart contract, CREATE opcode]
- auto_added: 2026-08-15
- auto_source_topic_id: 29427
- auto_source_url: https://ethereum-magicians.org/t/preserving-censorship-resistance-for-bal-data-in-eip-7999/29427
- desc: |
  スマートコントラクトのデプロイ時に一度だけ実行され、コントラクトのランタイムコードをブロックチェーンに書き込むためのバイトコード。

## cold storage reads
- ja: コールドストレージ読み取り
- related: [SLOAD, gas schedule, state access]
- auto_added: 2026-08-15
- auto_source_topic_id: 29427
- auto_source_url: https://ethereum-magicians.org/t/preserving-censorship-resistance-for-bal-data-in-eip-7999/29427
- desc: |
  EVM実行中に、現在のトランザクションでまだアクセスされていないストレージスロットからデータを読み取る操作。通常、ウォームストレージ読み取りよりも高いガス料金が課される。

## DMQ framework
- ja: DMQフレームワーク
- aliases: [DMQ]
- related: [On-Chain Penalty Enforcement, Panic State, MEV Attack Vectors]
- auto_added: 2026-08-16
- auto_source_topic_id: 25725
- auto_source_url: https://ethresear.ch/t/dmq-framework-on-chain-penalty-execution-mev-attack-vectors/25725
- desc: |
  オンチェーンでのペナルティ実行とMEV攻撃ベクトルに対処するために提案されたフレームワーク。パニック状態において、二次市場の流動性に依存せず、プログラムによって従属関係を強制することを目的としている。

## On-Chain Penalty Enforcement
- ja: オンチェーンペナルティ執行
- aliases: [Penalty Execution]
- related: [DMQ framework, Panic State, Subordination, Haircut]
- auto_added: 2026-08-16
- auto_source_topic_id: 25725
- auto_source_url: https://ethresear.ch/t/dmq-framework-on-chain-penalty-execution-mev-attack-vectors/25725
- desc: |
  ブロックチェーン上で、特定の条件（例：パニック状態）がトリガーされた際に、スマートコントラクトによって自動的かつプログラム的にペナルティを適用・執行すること。二次市場の流動性に依存せず、強制的な従属関係を確立する。

## Panic State
- ja: パニック状態
- related: [DMQ framework, On-Chain Penalty Enforcement, Subordination]
- auto_added: 2026-08-16
- auto_source_topic_id: 25725
- auto_source_url: https://ethresear.ch/t/dmq-framework-on-chain-penalty-execution-mev-attack-vectors/25725
- desc: |
  DMQフレームワークにおいて、特定の条件（例：準備金の枯渇速度）が閾値を超えた際にシステムが移行する状態。この状態では、二次市場の流動性に依存しないプログラム的なペナルティ執行がトリガーされる。

## Subordination
- ja: 従属（関係）
- related: [On-Chain Penalty Enforcement, Panic State, Haircut]
- auto_added: 2026-08-16
- auto_source_topic_id: 25725
- auto_source_url: https://ethresear.ch/t/dmq-framework-on-chain-penalty-execution-mev-attack-vectors/25725
- desc: |
  DMQフレームワークにおいて、特定の条件下で、ある資産や請求権が他のものに対して優先順位が低く設定され、強制的に価値が減じられる状態。二次市場の流動性に依存せず、プログラムによってこの従属関係が執行される。

## Flash-loan manipulation
- ja: フラッシュローン操作
- aliases: [Flash loan manipulation]
- related: [Flash loan, Oracle, TWAP]
- auto_added: 2026-08-16
- auto_source_topic_id: 25725
- auto_source_url: https://ethresear.ch/t/dmq-framework-on-chain-penalty-execution-mev-attack-vectors/25725
- desc: |
  ブロックチェーン上で、担保なしで瞬時に借り入れと返済を行うフラッシュローンを利用して、市場価格やオラクルデータを一時的に操作する攻撃手法。特にTWAPなどの時間加重平均価格に依存するシステムが脆弱となる可能性がある。
