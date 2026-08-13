---
title: 過剰担保の幻想：T+0マクロパニック時に静的担保率が失敗する理由（および提案されたオンチェーンソリューション）
original_title: >-
  The Illusion of Over-Collateralization: Why Static C-Ratios Fail in T+0 Macro
  Panics (and a Proposed On-Chain Solution)
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/the-illusion-of-over-collateralization-why-static-c-ratios-fail-in-t-0-macro-panics-and-a-proposed-on-chain-solution/25692
author: chuseo090
date: '2026-08-12'
category: Economics
tags:
  - economics
  - defi
  - mechanism-design
  - security
  - protocol-design
  - smart-contracts
  - research
topic_id: '25692'
translated_at: '2026-08-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [The Illusion of Over-Collateralization: Why Static C-Ratios Fail in T+0 Macro Panics (and a Proposed On-Chain Solution)](https://ethresear.ch/t/the-illusion-of-over-collateralization-why-static-c-ratios-fail-in-t-0-macro-panics-and-a-proposed-on-chain-solution/25692) — chuseo090 (2026-08-12)

**過剰担保の幻想：T+0マクロパニック時に静的[[glossary/C-Ratio|担保率 (C-Ratio)]]が失敗する理由（および提案されたオンチェーンソリューション）**

**1. [[glossary/T0-settlement|T+0]]流動性が無限であるという誤った仮定**

現在の[[glossary/DeFi|DeFi]]および[[glossary/RWA-platforms|RWAアーキテクチャ (Real World Assetアーキテクチャ)]]（例: [[glossary/MakerDAO|MakerDAO]]、[[glossary/Synthetix|Synthetix]]）は、静的な[[glossary/Over-Collateralization|過剰担保]]率（[[glossary/C-Ratio|C-Ratio]]）という単一の防御メカニズムに大きく依存しています。一般的な論理では、150%または200%のC-Ratioがシステム全体の[[glossary/solvency|ソルベンシー]]を保証すると仮定されています。

しかし、このアーキテクチャは、[[glossary/Diamond-Dybvig-bank-run-model|ダイアモンド・ディブヴィグの取り付け騒ぎモデル]]に晒されると、致命的な構造的欠陥を抱えています。それは、[[glossary/liquidators|清算人]]が[[glossary/T0-settlement|T+0]]で担保を売却するために十分な[[glossary/secondary-market-liquidity|流動性の高い二次市場]]を「常に」見つけられると仮定している点です。[[glossary/Macro-Panics|マクロパニック]]がシステム全体に及ぶと、このT+0流動性は蒸発します。[[glossary/Oracles|オラクル]]は更新され、証拠金請求が行われ、清算ボットが売却をトリガーしますが、買い手がいなければ、システムは[[glossary/bad-debt|不良債権]]を蓄積し、壊滅的な死亡スパイラルにつながります。

静的なソルベンシーマージンは、動的な流動性蒸発から保護することはできません。

**2. ソリューション: 動的成熟度キュー (DMQ) フレームワーク**

[[glossary/T0-settlement|T+0]]清算依存性を数学的に排除するには、静的なC-Ratioから動的な時間とコストの制約へと移行する必要があります。私は、**動的成熟度キュー (DMQ) フレームワーク**と呼ばれる概念実証 (PoC) アーキテクチャを研究・実装しました。これは、数学的に結合された3つの柱で構成されています。

-   **T+n成熟度決済キュー（72時間ハードロック）：** [[glossary/TWAP|TWAP (時間加重平均価格)]]の準備金枯渇速度が臨界閾値を超えると、プロトコルはT+0償還を停止します。引き出し者を決定論的な3日間（T+3）の成熟度キューに移行させ、[[glossary/fire-selling|投げ売り]]することなく、物理的または非流動性資産の[[glossary/OTC-liquidation|OTC清算]]に必要な期間を提供します。
    
-   **動的ステップ関数ペナルティ曲線：** [[glossary/bank-run-scenario|取り付け騒ぎシナリオ]]における先着者利益を反転させるため（スイングプライシングロジック）、プロトコルは時間ごとの枯渇率に基づいて最大40%までスケールアップする自動ペナルティ曲線を適用します。
    
-   **絶対劣後：** 劣後比率が破られた場合、劣後トランシェが退出するのを厳密にロックするハードコードされたルールで、イールドツーリストが上位債務を[[glossary/front-running|フロントランニング]]するのを防ぎます。

**3. オンチェーン概念実証 ([[glossary/Sepolia-Testnet|Sepoliaテストネット]])**

これは理論的なホワイトペーパーの演習ではありません。私は、[[glossary/UUPS-Proxy-architecture|UUPSプロキシアーキテクチャ]]を介して、コアDMQロジックを[[glossary/Sepolia-Testnet|Sepoliaテストネット]]にコンパイルしてデプロイしました。

-   **検証済みPoCアドレス:** `0x82Cb97881d0A600cc45dF5e1E264645fAbE0D47E` (Sepolia)
    
-   **コアロジックスニペット（アンチ・バンクランモジュール）:**
    

[[glossary/Solidity|Solidity]]

```
uint256 public constant T_PLUS_3 = 3 days;  // 72-hour Maturity Settlement Queue
uint256 public constant MAX_PENALTY = 4000; // 40.00% Maximum Panic Fee (Basis Points)
uint256 public constant BASE_FEE = 100;     // 1.00% Base Exit Fee 

// Dynamic Step-Function Penalty Curve based on Depletion Velocity
function calculateDynamicPenalty() public view returns (uint256) {
    uint256 v = mockDepletionVelocity;
    
    if (v < 1000) { 
        return BASE_FEE; // Normal regime: 1% fee
    } else if (v >= 1000 && v < 1500) { 
        return 1000;     // Warning tier: 10% fee
    } else if (v >= 1500 && v < 2000) { 
        return 2500;     // Panic tier: 25% fee
    } else { 
        return MAX_PENALTY; // Death spiral defense: 40% fixed penalty & T+3 queue
    }
}

// Absolute Junior Subordination (Preventing Front-Running)
function withdrawJunior(uint256 _amount) external {
    require(juniorBalances[msg.sender] >= _amount, "DMQ: Insufficient Junior Balance");
    // The core lock mechanism:
    require((totalJuniorCapital - _amount) >= totalSeniorCapital, "DMQ: Subordination Ratio breached. Junior cannot front-run Senior.");
    
    juniorBalances[msg.sender] -= _amount;
    totalJuniorCapital -= _amount;
}

```

[[glossary/core-developers|コア開発者]]、[[glossary/researchers|研究者]]、[[glossary/quants|クオンツ]]の皆様に、このアーキテクチャを批判的に評価していただきたいと思います。オンチェーンの取り付け騒ぎに対抗するために、タイムロックされたキューを利用することに理論的な脆弱性はありますか？コードと数学について議論しましょう。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/the-illusion-of-over-collateralization-why-static-c-ratios-fail-in-t-0-macro-panics-and-a-proposed-on-chain-solution/25692)
