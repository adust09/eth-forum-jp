---
title: Ethereum Research 用語集（編集ソース）
last_updated: 2026-05-17
description: |
  この単一ファイルが用語集の唯一の編集源です。
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
