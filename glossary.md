---
title: Ethereum Research 用語集（編集ソース）
last_updated: 2026-05-28
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

## PeerDAS
- ja: PeerDAS
- related: [Data Availability Sampling, EIP-7594]
- auto_added: 2026-05-28
- auto_source_topic_id: 24978
- auto_source_url: https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978
- desc: |
  EIP-7594で提案されているデータ可用性サンプリング (DAS) の実装の一つ。リソース制約のあるデバイスでのデータ可用性証明の効率化を目指す。

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

## Verkle Trees
- ja: Verkleツリー
- aliases: [VKTs]
- related: [State tree, Merkle Patricia Trie]
- auto_added: 2026-05-28
- auto_source_topic_id: 24978
- auto_source_url: https://ethresear.ch/t/peerdas-30-acceleration-for-4x-less-memory-usage/24978
- desc: |
  Ethereumのステートツリーの将来的なアップグレード候補として検討されているデータ構造。Merkle Patricia Trieと比較して、より小さな証明サイズでステートの検証を可能にする。

## Multi-Party Block Construction
- ja: マルチパーティブロック構築 (MPBC)
- aliases: [MPBC]
- related: [Proposer-Builder Separation, Multi-Party Block, Operator]
- auto_added: 2026-05-28
- auto_source_topic_id: 24975
- auto_source_url: https://ethresear.ch/t/building-towards-multi-party-block-construction/24975
- desc: |
  複数のパーティ（ビルダー）が単一のブロック構築に貢献することを可能にするメカニズム。これにより、トランザクションのインクルージョンパスが多様化し、ブロック空間の割り当てが複数のビルダーの共有ビューに拡大される。現在の単一ビルダーによるブロック構築の構造的ギャップを解消し、イーサリアムの堅牢性を向上させることを目指す。

## Operator
- ja: オペレーター
- related: [Multi-Party Block Construction, Builder, Proposer]
- auto_added: 2026-05-28
- auto_source_topic_id: 24975
- auto_source_url: https://ethresear.ch/t/building-towards-multi-party-block-construction/24975
- desc: |
  ビルダーからブロックとトランザクションを受け取り、適格な貢献をマルチパーティブロックに結合し、最も高い報酬を支払うブロックをプロポーザーに提出する役割を担うパーティ。MPBCにおいて、ベースブロックに他のビルダーからのトランザクションを追加することでブロックの価値を向上させる。

## ePBS
- ja: ePBS (enshrined Proposer-Builder Separation)
- aliases: [enshrined Proposer-Builder Separation]
- related: [Proposer-Builder Separation, Relay]
- auto_added: 2026-05-28
- auto_source_topic_id: 24975
- auto_source_url: https://ethresear.ch/t/building-towards-multi-party-block-construction/24975
- desc: |
  プロポーザー・ビルダー分離 (PBS) の一種で、プロトコル内に組み込まれた（enshrined）形式。リレーの主要なエスクロー機能をプロトコルが直接処理することで、単一パーティブロックの信頼できる引き渡しを可能にする。MPBCはePBSを拡張する形で設計されている。

## Multi-Party Block
- ja: マルチパーティブロック
- related: [Multi-Party Block Construction, Single-Party Block, Base Block]
- auto_added: 2026-05-28
- auto_source_topic_id: 24975
- auto_source_url: https://ethresear.ch/t/building-towards-multi-party-block-construction/24975
- desc: |
  複数のパーティ（ビルダー）によってトランザクションが貢献されたブロック。MPBCのメカニズムによって生成され、単一ビルダーのブロックと比較して、より多くのトランザクションを含み、ブロック空間の利用率を高めることを目指す。

## Base Block
- ja: ベースブロック
- related: [Multi-Party Block Construction, Single-Party Block, Multi-Party Block]
- auto_added: 2026-05-28
- auto_source_topic_id: 24975
- auto_source_url: https://ethresear.ch/t/building-towards-multi-party-block-construction/24975
- desc: |
  オペレーターが利用可能な最高額の単一パーティブロックであり、マルチパーティブロック構築の出発点として使用される。このベースブロックに、他の貢献ビルダーからの適格なトランザクションが追加され、マルチパーティブロックが形成される。

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
