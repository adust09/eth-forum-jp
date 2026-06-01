---
title: WYRIWE - 読んだものが実行されるもの（検証可能なAI推論における入力の来歴）
original_title: >-
  WYRIWE - What You Read Is What You Execute (Input Provenance for Verifiable AI
  Inference)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/wyriwe-what-you-read-is-what-you-execute-input-provenance-for-verifiable-ai-inference/28655
author: TMerlini
date: '2026-05-28'
category: ERCs
tags:
  - ercs
  - applications
  - smart-contracts
  - research
  - protocol-design
  - security
  - cryptography
  - ai-agents
  - input-provenance
topic_id: '28655'
translated_at: '2026-05-30'
translator: gemini-2.5-flash
---

> [!note] 原文
> [WYRIWE - What You Read Is What You Execute (Input Provenance for Verifiable AI Inference)](https://ethereum-magicians.org/t/wyriwe-what-you-read-is-what-you-execute-input-provenance-for-verifiable-ai-inference/28655) — TMerlini (2026-05-28)

このスレッドは、WYRIWEの議論の場です。WYRIWEは、AI推論の入力来歴（input provenance）のためのトリプルハッシュコミットメントスキームとEIP-712アテステーションプロファイルを定義する提案中の[[glossary/EIP|ERC（Ethereum 改善提案）]]です。

## 問題

オンチェーンAIエージェントシステム（ERC-8004、ERC-8263、ERC-8274）は、どのモデルが実行され、どのような出力が生成されたかを証明できますが、*実際にモデルに供給された入力*をコミットする方法を定義する標準はありません。エージェントは、リクエストと実行の間でユーザーの入力をサニタイズ（無害化）、書き換え、または置換することができ、その変換のオンチェーン証拠を残しません。

## スキーム

すべてのWYRIWE準拠の実行は、3つのリンクされたハッシュを生成します。

```
raw_input_hash             = keccak256(raw_user_input)
sanitization_pipeline_hash = keccak256(sanitization_spec_cid || raw_input_hash)
input_hash                 = keccak256(sanitized_input)


```

これらは共に、検証可能なカストディチェーン（chain of custody）を形成します。どの検証者も、エージェント、ゲートウェイ、または実行環境を信頼することなく、コミットされたハッシュと公開されたサニタイゼーション仕様のみを使用して入力の整合性を確認できます。

サニタイゼーションなしのケースは、IDENTITY\_SENTINEL CIDを介して明示的に処理され、`input_hash == raw_input_hash`を仮定ではなく証明可能な主張とします。

## スタックにおける位置付け

WYRIWEは、4層のAI推論信頼スタックのL3に位置します。

| レイヤー | 標準 | 責任 |
| --- | --- | --- |
| L1 | モデルマニフェストハッシュ | どのモデルが実行されたかを証明 |
| L2 | ERC-8004 | どのエージェントが実行したかを証明 |
| L3 | WYRIWE | モデルにどのような入力が供給されたかを証明 |
| L4 | ERC-8263 / OCP | 実行が発生し、出力がコミットされたことを証明 |

## ステータス

-   仕様リポジトリ: [https://github.com/TMerlini/wyriwe](https://github.com/TMerlini/wyriwe)
    
-   正式な[[glossary/EIP|ERC（Ethereum 改善提案）]]ドラフト: [https://github.com/TMerlini/wyriwe/blob/main/ERC-draft.md](https://github.com/TMerlini/wyriwe/blob/main/ERC-draft.md)
    
-   ライブリファレンス実装: [https://gateway.ensub.org/agent/verify/:inputHash](https://gateway.ensub.org/agent/verify/:inputHash)
    
-   ERC-8263 v0.2（§proofHash Constructions 付録）およびERC-8004 + ERC-8263 + OCP Composition Noteで参照により組み込まれています。
    
-   `inputHash`は、ERC-8274のIProofVerifierインターフェースで使用される共有キーです。
    
-   ERC-8183 §11 / 付録Bの`commitmentRef`は、WYRIWEの`input_hash`にマッピングされます。
    

ethereum/ERCsへのPRは近日公開予定です。提出前のフィードバックを得るため、まずここに投稿します。

Tiago Merlini

*1件の投稿 - 1名の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/wyriwe-what-you-read-is-what-you-execute-input-provenance-for-verifiable-ai-inference/28655)
