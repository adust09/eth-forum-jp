---
title: これを破ってみてください：最小限の、システム非依存の検証プリミティブ
original_title: 'Break This: A Minimal, System-Independent Verification Primitive'
source_url: >-
  https://ethresear.ch/t/break-this-a-minimal-system-independent-verification-primitive/24745
author: DamonZwicker
date: '2026-04-27'
category: Execution Layer Research
tags:
  - execution-layer-research
  - verification
  - ethereum
  - rollup
topic_id: '24745'
translated_at: '2026-05-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Break This: A Minimal, System-Independent Verification Primitive](https://ethresear.ch/t/break-this-a-minimal-system-independent-verification-primitive/24745) — DamonZwicker (2026-04-27)

**これを破れますか？**

本気です。

「フィードバック」ではありません。
「意見」でもありません。

**破ってください。**

* * *

イーサリアムは2つのことにおいて非常に優れてきています。

-   計算の証明（ゼロ知識 (ZK)）
    
-   データの利用可能性（[[glossary/Data-Availability|データアベイラビリティ]] (DA)）の確保
    

しかし、まだギャップがあります。

> 実際に何が起こったのかを、それを生成したシステムから独立して検証するポータブルな方法がありません。

現在、検証は依然として以下に依存しています。

-   [[glossary/Rollup|ロールアップ]]
    
-   インデクサー
    
-   ツール
    

つまり、ある意味で、あなたはまだ**システムに何が真実かを尋ねている**ことになります。

* * *

この問題に対処するための最小限のプリミティブに取り組んできました。

**バインド (Bind):**  
実行 → ダイジェスト → オンチェーンコミットメント

したがって、検証は次のようになります。

**再計算 → 比較 → インクルージョンの確認**

APIなし  
インデクサーなし  
プロバーなし

ただ、

-   ローカル計算
    
-   公開台帳へのアクセス
    

* * *

その結果は、**ポータブルな検証アーティファクト**です。
→ 誰でも独立して検証できるもの
→ 元のシステムなしで

* * *

イーサリアムが決済レイヤーになりつつあるなら、これはオプションではありません。

> ポータブルな検証アーティファクトがなければ、実際に何が起こったのかを示す安定した参照がありません。

* * *

だから、これ以上説明する代わりに…

**私はあなたにそれを破るよう誘います。**

-   バイトを変更する
    
-   偽の証明を作成する
    
-   エッジケースを見つける
    
-   仮定を攻撃する
    

もし失敗したら、知りたいです。
もし成立するなら、それも興味深いことです。

* * *

**ライブデモ:**  
[https://observation-commitment-protocol.vercel.app/](https://observation-commitment-protocol.vercel.app/)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/break-this-a-minimal-system-independent-verification-primitive/24745)
