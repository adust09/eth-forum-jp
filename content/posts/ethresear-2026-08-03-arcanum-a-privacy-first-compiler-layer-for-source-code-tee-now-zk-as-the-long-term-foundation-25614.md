---
title: 'Arcanum: ソースコード向けプライバシーファーストなコンパイラレイヤー — 現状はTEE、長期的にはZKを基盤に'
original_title: >-
  Arcanum: a privacy-first compiler layer for source code — TEE now, ZK as the
  long-term foundation
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/arcanum-a-privacy-first-compiler-layer-for-source-code-tee-now-zk-as-the-long-term-foundation/25614
author: Sidistr
date: '2026-08-03'
category: 'zk-s[nt]arks'
tags:
  - snarks
  - cryptography
  - zk
  - starks
  - privacy
  - security
  - post-quantum
  - research
  - protocol-design
topic_id: '25614'
translated_at: '2026-08-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Arcanum: a privacy-first compiler layer for source code — TEE now, ZK as the long-term foundation](https://ethresear.ch/t/arcanum-a-privacy-first-compiler-layer-for-source-code-tee-now-zk-as-the-long-term-foundation/25614) — Sidistr (2026-08-03)

開発中のコンセプトを共有し、このコミュニティからフィードバックを得たい。ここにいる皆さんは、まさにこのコンセプトをストレステストするのに最適な方々だからだ。

**コアアイデア:** Arcanumは、ソースコードのプライバシーを第一原則として扱うことを提案するコンパイラレイヤーだ。開発者は、すでに使い慣れた言語（C++、Rust、JavaScript、TypeScript、Go — LLVMまたはRISC-V互換であれば何でも）で記述する。Arcanumがそれを変換する。コンパイル後、平文のソースは決して存在しない。

**二段階アプローチ:**

*フェーズ1 — [[glossary/Trusted-Execution-Environment|TEE（トラステッド実行環境）]]:* コンパイルされたコードは、ハードウェアによって強制されるセキュアエンクレーブ（Intel SGX、AMD SEV、ARM TrustZone）内にラップされる。ソースロジックは、サーバーオーナーやクラウドプロバイダーでさえ読み取ることができない。ほぼネイティブなパフォーマンス。信頼の前提: ハードウェアメーカー。

*フェーズ2 — [[glossary/Zero-Knowledge-Proof|ZK（ゼロ知識証明）]]:* [[glossary/Zero-Knowledge-Proof|ZK]]コンパイラインフラが成熟するにつれて、Arcanumはソースを[[glossary/STARK|STARK]]ベースの算術回路に変換する。これは元のソースがなければ数学的に読み取れず、[[glossary/Trusted-Execution-Environment|トラステッドハードウェア]]は不要で、[[glossary/Post-Quantum|ポスト量子]]耐性を持つ。信頼の前提: なし。

**既存の[[glossary/Zero-Knowledge-Proof|ZK]]ツールとの違い:** zkLLVM、RISC Zero、SP1は検証可能な実行、つまりコードが正しく実行されたことを証明することに焦点を当てている。Arcanumは異なる問いに焦点を当てる。ソースコード自体を永続的に読み取れないようにしつつ、証明可能に実行可能にできるか？2つの異なる問題、2つの異なるアーキテクチャだ。

**認識している正直な制限事項:**

-   フェーズ1はハードウェアメーカー（Intel/AMD/ARM）に信頼を置く。
    
-   コンパイラレベルのバグが中間表現を露出させる可能性がある。
    
-   内部脅威（開発者によるソース漏洩）は対象外だ。
    
-   サイドチャネル攻撃は部分的にしか軽減されない。
    
    これはプレ-[[glossary/MVP|MVP]]の概念的なホワイトペーパーだ。私は非技術系の創業者であり、このアーキテクチャは[[glossary/Zero-Knowledge-Proof|ZK]]およびコンパイラエンジニアによる徹底的な分析を必要としている。まさにそれが私がここにいる理由だ。
    
    暗号またはコンパイラレベルで何か見落としている点はあるか？[[glossary/Trusted-Execution-Environment|TEE]] → [[glossary/Zero-Knowledge-Proof|ZK]]への移行パスは現実的か、それとも私が考慮していない根本的な阻害要因があるか？
    

ホワイトペーパー & リポジトリ: [\[GitHub\]](https://github.com/Sidistr/Arcanum)

*3投稿 - 2参加者*

[トピック全体を読む](https://ethresear.ch/t/arcanum-a-privacy-first-compiler-layer-for-source-code-tee-now-zk-as-the-long-term-foundation/25614)
