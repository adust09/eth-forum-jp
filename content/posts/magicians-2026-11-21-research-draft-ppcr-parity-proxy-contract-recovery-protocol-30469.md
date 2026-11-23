---
title: '[研究ドラフト] PPCR — Parityプロキシコントラクト復旧プロトコル'
original_title: '[Research Draft] PPCR — Parity Proxy Contract Recovery Protocol'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/research-draft-ppcr-parity-proxy-contract-recovery-protocol/30469
author: Samwise
date: '2026-11-21'
category: EIPs core
tags:
  - eips-core
  - research
  - protocol-design
  - security
  - smart-contracts
  - governance
  - eips
  - economics
  - state-management
topic_id: '30469'
translated_at: '2026-11-23'
translator: gemini-2.5-flash
---

> [!note] 原文
> [[Research Draft] PPCR — Parity Proxy Contract Recovery Protocol](https://ethereum-magicians.org/t/research-draft-ppcr-parity-proxy-contract-recovery-protocol/30469) — Samwise (2026-11-21)

皆さん、こんにちは。

**PPCR（Parityプロキシコントラクト復旧プロトコル）**と仮称される、イーサリアムの復旧提案に関する研究ドラフトを共有したいと思います。

これは**まだ[[EIP|EIP（Ethereum 改善提案）]]として提出されたものではありません**。2017年の共有ライブラリ破壊イベントによって影響を受けたParityの[[Multisig|マルチシグ（マルチシグネチャ）]]プロキシコントラクトに対し、狭くスコープされた決定論的な復旧メカニズムを設計できるかどうかについて、技術的なフィードバックを収集することを目的とした、研究に基づいたプレドラフトです。

## **なぜこれが検討されているのか**

Parityのインシデントは、非常に特定の失敗モードを生み出しました。

- 資産は影響を受けたプロキシウォレットに残存した。
- ウォレットの所有権と承認閾値はコントラクト状態にエンコードされたままだった。
- しかし、履歴上のライブラリアドレスにあった共有ライブラリ`WalletLibrary`コードが破壊されたため、実行能力が失われた。

主要な研究課題は次のとおりです。

> イーサリアムは、この歴史的に識別可能なコントラクトのクラスに対して、[[所有者によって承認された制御]]を復元し、かつ一般化された状態介入への道を開くことなく、狭く境界が定められた、裁量のない復旧メカニズムを定義できるでしょうか？

## **これまでに研究されたこと**

私はアーカイブ状態分析とローカルフォーク実験を用いて、段階的な研究プロセス（D3I.10JからD3I.15）を進めてきました。

### **1. 履歴候補の列挙**

ブロック**4,501,969**までの履歴メインネットスキャンが実行され、ランタイムフィンガープリントによってParityプロキシ候補が特定されました。

現在の結果：

- **227,740**件の一意の履歴ブロックが記録された
- **782,601**件の重複排除されたコントラクト作成試行記録
- **284**件の一意のParityプロキシ候補
- **945**件の未解決のランタイム作成イベントが完全性レビューのためにフラグ付けされた

### **2. 履歴ETH残高レビュー**

284件のプロキシ候補について：

- **93**件が関連する履歴スナップショットでゼロでないETH残高を持っていた
- これらのコントラクト全体で観測された総ETHは次のとおりです。

**443,163.039443434519138007 ETH**

これは観測された履歴残高の数値であり、**回復可能な金額の主張ではありません**。

### **3. 履歴所有権/閾値の再構築**

2つの主要なウォレットが詳細に再構築されました。

- `0x3bfc20f0b9afcace800d73d2191166ff16540258`
    - 7人の所有者
    - 閾値 4
- `0x376c3e5547c68bc26240d8dcc6729fff665a4448`
    - 3人の所有者
    - 閾値 2

両方について、履歴ストレージとゲッター挙動は、再構築された所有者セットと一致していました。

### **4. 依存関係と因果関係の調査**

この研究では、両方のパイロットウォレットについて次のことが確立されました。

- プロキシはParityライブラリを静的に参照している。
- 実行には[[DELEGATECALL|DELEGATECALL (デリゲートコール)]]が使用されている。
- 破壊前の実行挙動は、破壊後の挙動と実質的に異なる。
- 制御されたローカル環境でライブラリコードを復元すると、以前機能していたパスが復元される。

### **5. ローカル状態遷移リプレイ**

次に、所有者閾値挙動が再現できるかどうかをテストするために、ローカルフォークリプレイが実行されました。

両方のパイロットウォレットについて：

- **破壊前シナリオ:** 閾値制御された転送パスが機能する
- **破壊後シナリオ:** 転送パスが機能しない
- **反実仮想ライブラリ復元シナリオ:** 転送パスが再び機能する

最新のパイロット結果：

- `COUNTERFACTUAL_TRANSFERS_RESTORED=2/2`
- `D3I15_THRESHOLD_CAUSALITY_PASS=True`

これは、テストされたウォレットにおいて、実行能力の喪失が欠落したライブラリコードに因果的に結びついているという主張を裏付けています。

## **これが*まだ*証明していないこと**

この研究は**まだ**次のことを証明していません。

- 284件すべての候補が復旧の対象となること。
- 履歴上の所有者からの現在の承認が暗号学的に証明されていること。
- ライブラリをグローバルに復元することが許容されること。
- [[consensus|コンセンサス]]変更が社会的または政治的に正当化されること。

また、前例、ガバナンスの正当性、例外ベースの状態変更に関するより広範な異議も解決していません。

## **PPCRの作業仮説**

作業の方向性は、**狭くスコープされ、決定論的で、所有者によって承認された復旧メカニズム**を検討することです。

意図された特性は次のとおりです。

- 裁量的なケースバイケースのガバナンス決定がないこと。
- 恣意的な受益者選択がないこと。
- 一般化された「資金復旧」権限がないこと。
- ウォレットの元の閾値承認モデルが維持されること。
- 歴史的に閉じた適格セットであること。

現在、大きく分けて2つのアーキテクチャの方向性があります。

### **オプションA — ライブラリコードの復元**

[[consensus|コンセンサス]]遷移によって、履歴上のParityライブラリアドレスにコードが復元されます。

**長所:**

- 観測された履歴実行モデルに最も近い
- 機械的に説明しやすい

**短所:**

- [[EIP|EIP（Ethereum 改善提案）]]-999と非常に似ている
- そのアドレスのすべての依存コントラクトに影響する
- 広すぎると見なされる可能性がある

### **オプションB — 復旧固有の遷移を定義する**

厳格な履歴述語と所有者閾値承認を満たすコントラクトのために、特別な復旧パスが追加されます。

**長所:**

- より明確に境界が定められている
- グローバルなコード復元よりも広範ではない可能性がある
- 所有者によって承認された復旧に焦点を当てていることがより明確

**短所:**

- 指定がはるかに難しい
- 新しい[[consensus|コンセンサス]]ロジックが必要
- やはり前例に関する懸念がある

現時点では、**オプションB**をPPCRの明確な設計としてより有望な方向性と捉えていますが、これはまだ研究の方向性に過ぎません。

## **現在の未解決の問題**

主な未解決項目は次のとおりです。

1.  **適格性**
    
    - 復旧可能なセットを定義する正確な述語は何であるべきか？
2.  **承認**
    
    - 履歴上の所有者は、暗号学的に健全でリプレイセーフな方法で、現在の承認をどのように証明すべきか？
3.  **完全性**
    
    - 945件の未解決のランタイム作成イベントはどのように処理すべきか？
4.  **スコープ**
    
    - ETHのみか、それともトークンも含むか？
5.  **[[consensus|コンセンサス]]設計**
    
    - PPCRはコードを復元すべきか、それとも新しい復旧遷移を導入すべきか？
6.  **ガバナンス / 前例**
    
    - なぜこのケースを例外的として扱うべきなのか、そして汎用的な復旧メカニズムにならないように、スコープを十分に厳密に閉じるにはどうすればよいか？

## **フィードバックを求めている点**

クライアント開発者、プロトコル研究者、および以前に[[EIP|EIP（Ethereum 改善提案）]]-999または関連する復旧に関する議論に参加された方々からのフィードバックを特に歓迎します。

### 質問：

1.  **ここでの問題提起は、さらなるプロトコル研究を正当化するのに十分に正確でしょうか？**
2.  **決定論的で、歴史的に閉じた適格性モデルは妥当でしょうか？**
3.  **[[consensus|コンセンサス]]層で受け入れられるような、所有者閾値承認のための信頼できるパスは存在するでしょうか？**
4.  **オプションBは[[EIP|EIP（Ethereum 改善提案）]]-999と意味のある区別があるでしょうか、それともこれは根本的に異なる形式の同じ提案でしょうか？**
5.  **この研究を継続することに対する最も強力な技術的または社会的な異議は何でしょうか？**

## **推奨される次のステップ**

私の現在の推奨は、**規範的な284ウォレット候補マニフェスト**を証拠基盤として開始し、その後、次のものを分離することです。

- **一致するコントラクト**
    と
- **潜在的に復旧可能なもの**

これは、時期尚早な適格性主張を避けつつ、研究の再現性を保つ最もクリーンな方法であると思われます。

もし有用であれば、より正式な**PPCR作業ドラフトv0.1**の構造と、より明確な適格性/不変条件セクションを含むフォローアップを投稿することも可能です。フィードバックを前もって感謝いたします。

[github.com/samstone93/ethereum-ppcr](https://github.com/samstone93/ethereum-ppcr/blob/main/README.md)

#### [README.md](https://github.com/samstone93/ethereum-ppcr/blob/main/README.md)

[`main`](https://github.com/samstone93/ethereum-ppcr/blob/main/README.md)

```

# ethereum-ppcr
Parity Proxy Contract Recovery — Ethereum Core EIP research, historical evidence, and consensus validation
# Ethereum PPCR — Parity Proxy Contract Recovery

**Research status:** Pre-EIP / Standards Track — Core candidate

PPCR explores a deterministic, historically bounded Ethereum consensus mechanism for restoring owner-authorized control of assets affected by the November 2017 Parity multisignature library destruction.

Etereum-Magicians https://ethereum-magicians.org/t/research-draft-ppcr-parity-proxy-contract-recovery-protocol/30469

PPCR_Protocol_Working_Draft_v0.1 [PPCR_Protocol_Working_Draft_v0.1.pdf](https://github.com/user-attachments/files/35221397/PPCR_Protocol_Working_Draft_v0.1.pdf)

Visual Explanation of PPCR_Protocol [PPCR_Explained_Research_Overview_v0.1.pdf](https://github.com/user-attachments/files/35221576/PPCR_Explained_Research_Overview_v0.1.pdf)

## Research completed

- Historical enumeration through Ethereum block 4,501,969
- 284 identified Parity proxy candidates
- 93 candidates with nonzero historical ETH balances
```

このファイルは切り詰められています。[オリジナルを表示](https://github.com/samstone93/ethereum-ppcr/blob/main/README.md)

* * *

ご希望であれば、これを次の形式にすることも可能です。

1.  読みやすくするための**より短いMagicians版**、または
2.  *概要 / 動機 / 仕様スケッチ / セキュリティ上の考慮事項*などのセクションを含む**より正式な[[EIP|EIP（Ethereum 改善提案）]]形式のMagicians投稿**。

*2投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/research-draft-ppcr-parity-proxy-contract-recovery-protocol/30469)
