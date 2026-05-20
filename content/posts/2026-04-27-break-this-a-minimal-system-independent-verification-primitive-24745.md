---
title: 'これを破ってみてください: 最小限のシステム非依存検証プリミティブ'
original_title: 'Break This: A Minimal, System-Independent Verification Primitive'
source_url: >-
  https://ethresear.ch/t/break-this-a-minimal-system-independent-verification-primitive/24745
author: DamonZwicker
date: '2026-04-27'
category: Execution Layer Research
tags:
  - execution-layer-research
  - verification
  - data-availability
  - rollup
topic_id: '24745'
translated_at: '2026-05-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Break This: A Minimal, System-Independent Verification Primitive](https://ethresear.ch/t/break-this-a-minimal-system-independent-verification-primitive/24745) — DamonZwicker (2026-04-27)

**これを破れますか？**

本気です。

「フィードバック」ではありません。
「感想」でもありません。

**破ってみてください。**

* * *

Ethereumは2つのことにおいて非常に優れてきています。

-   計算の証明 (ZK)
-   [[glossary/Data-Availability|データアベイラビリティ]] (DA) の確保

しかし、まだギャップがあります。

> 実際に何が起こったのかを、それを生成したシステムとは独立して検証するポータブルな方法がありません。

現在、検証は依然として以下に依存しています。

-   [[glossary/Rollup|ロールアップ]]
-   インデクサー
-   ツール

つまり、ある意味で、**システムに何が真実かを尋ねている**ことになります。

* * *

私はこの問題を解決するための最小限のプリミティブに取り組んできました。

**バインド:**
実行 → ダイジェスト → オンチェーンコミットメント

そのため、検証は次のようになります。

**再計算 → 比較 → インクルージョンの確認**

APIなし
インデクサーなし
プロバーなし

ただ:

-   ローカル計算
-   パブリックレジャーへのアクセス

* * *

その結果、**ポータブルな検証アーティファクト**が生まれます。
→ 誰でも独立して検証できるもの
→ 発信元のシステムなしで

* * *

Ethereumが決済レイヤーになりつつあるのなら、これはオプションではありません。

> ポータブルな検証アーティファクトがなければ、実際に何が起こったのかを示す安定した参照がありません。

* * *

ですから、これ以上説明する代わりに…

**あなたにそれを破るよう招待します。**

-   1バイト変更する
-   証明を偽造する
-   エッジケースを見つける
-   仮定を攻撃する

もし失敗するなら、知りたいです。
もし成功するなら、それも興味深いです。

* * *

**ライブデモ:**
[https://observation-commitment-protocol.vercel.app/](https://observation-commitment-protocol.vercel.app/)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/break-this-a-minimal-system-independent-verification-primitive/24745)
