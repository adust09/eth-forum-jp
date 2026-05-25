---
title: Ethereum Research 用語集（編集ソース）
last_updated: 2026-05-25
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
