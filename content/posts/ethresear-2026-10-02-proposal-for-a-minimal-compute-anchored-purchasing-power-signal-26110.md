---
title: 最小限の計算力にアンカーされた購買力シグナルの提案
original_title: Proposal for a minimal compute-anchored purchasing power signal
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/proposal-for-a-minimal-compute-anchored-purchasing-power-signal/26110
author: j0i0m0b0o
date: '2026-10-02'
category: Economics
tags:
  - economics
  - mechanism-design
  - oracle
  - smart-contracts
  - cryptography
  - research
  - protocol-design
  - tokenomics
topic_id: '26110'
translated_at: '2026-10-03'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Proposal for a minimal compute-anchored purchasing power signal](https://ethresear.ch/t/proposal-for-a-minimal-compute-anchored-purchasing-power-signal/26110) — j0i0m0b0o (2026-10-02)

オンチェーンで何らかのトラストレスな購買力関連シグナルを持つことは有用であるため、以下にその提案を行う。

ゲームリクエスターは、購買力レポートをインセンティブ化するために報酬を投稿する。誰でも閾値とETH流動性を投稿することでレポートでき、これにより即座にブレイクゲームが開始される。ブレイクゲームでは、誰でもレポーターのアドレス、ゲームID、レポート時にキャプチャされた親ブロックハッシュと組み合わせたnonceを見つけ、そのハッシュが閾値を超えることでレポーターを「ブレイク」しようと試みることができる。

ブレイクされると、そのレポーターの流動性の一部が次ラウンドの報酬に充てられ、残りはブレイクした者に支払われる。乗数 (multiplier) は、次ラウンドの報酬と流動性がどれだけ増加するかを決定する。

ブレイクゲーム中に、誰かが十分に低い閾値（[[glossary/replacement-decay-parameter|置換減衰パラメータ]]によって管理される）を投稿した場合、レポーターは置き換えられることがある。この場合、現職のレポーターの流動性は返還され、[[glossary/settlement-timer|決済タイマー]]がリフレッシュされる。

タイマーが期限切れになるとゲームは終了する。生き残ったレポーターが報酬を獲得する。

レポーターは、自身の流動性を保護するのに十分な難易度の閾値を投稿するインセンティブを持つ一方、競合するレポーターはより簡単な閾値を投稿することで報酬を奪い取ることができる。ブレイクする者は、利用可能なペイアウトが予想される計算コストを超える場合に攻撃するインセンティブを持つ。遅延は置換減衰と幾何級数的な流動性エスカレーションによって管理される。この仮説は、これらの競合するインセンティブが、ETHの価値と計算コストに対する有用なシグナルを生み出すというものである。

スマートコントラクトはかなり短く（約200行）、現在はkeccak256を使用している。

このアイデアは、生き残った閾値の単位流動性あたりの暗示された作業量を時間経過とともに比較し（他のゲームパラメータが同等である場合）、購買力の変化を把握することである。ユーザーは、この[[glossary/oracle|オラクル]]出力によって管理されるペイアウトの条件に、予想されるハードウェア効率の変化を組み込むことができる。理想的には、このゲームに多額の流動性が流れる前に、keccak ASICが開発されることである。

フィードバックや建設的な批判を歓迎する。もしこの設計を破れる (break) なら、ぜひ教えてほしい！

より詳細な解説を含むリポジトリ：

[github.com](https://github.com/j0i0m0b0o/purchasing-power-sketches)

![計算力にアンカーされた購買力シグナル](https://ethresear.ch/uploads/default/optimized/3X/7/5/7523f432dbc599dc287afdf454d4a5c971f069a9_2_690x344.png)

### [GitHub - j0i0m0b0o/purchasing-power-sketches](https://github.com/j0i0m0b0o/purchasing-power-sketches)

GitHubでアカウントを作成して、j0i0m0b0o/purchasing-power-sketchesの開発に貢献しましょう。

シンプルなスマートコントラクト：

[github.com/j0i0m0b0o/purchasing-power-sketches](https://github.com/j0i0m0b0o/purchasing-power-sketches/blob/7010a264c87aece38c6da8d4133452f7888b75bc/openHashSimple.sol)

#### [openHashSimple.sol](https://github.com/j0i0m0b0o/purchasing-power-sketches/blob/7010a264c87aece38c6da8d4133452f7888b75bc/openHashSimple.sol)

[`7010a264c`](https://github.com/j0i0m0b0o/purchasing-power-sketches/blob/7010a264c87aece38c6da8d4133452f7888b75bc/openHashSimple.sol)

```
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title openHash
 * @notice A trust-minimized hash price oracle. It is a minimal reality-coupled game where the weirdness and distortions are ~ scale-invariant unlike many other oracle designs.
 * @dev This contract enables hash price discovery through economic incentives.
 *      Intended use is to compare implied work from the final surviving threshold, normalized by liquidity, across two games with otherwise equivalent GameParams.
 *      Participants are responsible for validating game instance parameters before participation
 *      and unsafe parameter sets including but not limited to settlementTime too high
 *      will result in lost funds.
 * @author OpenOracle Team
 * @custom:version 0.1
 */
contract openHash {

    uint256 public nextGameId = 1;

    error InvalidInput(string);

```

このファイルは切り詰められています。[オリジナルを表示](https://github.com/j0i0m0b0o/purchasing-power-sketches/blob/7010a264c87aece38c6da8d4133452f7888b75bc/openHashSimple.sol)

*1件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethresear.ch/t/proposal-for-a-minimal-compute-anchored-purchasing-power-signal/26110)
