---
title: 'ERC-8316: プログラム可能な決済ロック'
original_title: 'ERC-8316: Programmable Settlement Locks'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8316-programmable-settlement-locks/28861'
author: awrichardson
date: '2026-06-25'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - defi
  - cross-chain
  - protocol-design
  - applications
topic_id: '28861'
translated_at: '2026-06-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8316: Programmable Settlement Locks](https://ethereum-magicians.org/t/erc-8316-programmable-settlement-locks/28861) — awrichardson (2026-06-25)

「プログラム可能な決済ロック」と仮称される新しい[[ERC|ERC（Ethereum Request for Comments）]]のPRをオープンする準備を進めており、まずこの提案を紹介し、議論の場を提供するためにスレッドを開始しました。

## **背景**

この提案は、価値を保持するコントラクトが共通のロックライフサイクル（作成、更新、委任、使用、キャンセル、検査）を公開するための最小限のインターフェースを定義します。

主なユースケースは、同じアセットモデルや可視性の前提を共有しないシステム間での[[Atomic-Cross-Domain-State-Synchronization|アトミックなクロスドメイン状態同期]]です。これには、ERC-20のような従来のトークンコントラクト、シールドまたはプライベートなトークンシステム、[[Zero-Knowledge-Proof|ゼロ知識証明]]に基づく転送、外部で検証される状態遷移、および操作の詳細がオンチェーンで完全に可視ではないその他の価値を保持するコントラクトが含まれます。

## **提案の概要**

核となるアイデアは、統一されたトークンモデルではなく、標準化された決済オブジェクトです。

プログラム可能な決済ロックは、単一の現在の支出者、コミットされた支出およびキャンセルパス、そしてファイナリティ権限の委任を伴う、準備された価値保持操作を表します。

インターフェースの意図する形状は概ね以下の通りです。

```
interface IERCXXXX {
   function createLock(...) external returns (bytes32 lockId);
   function updateLock(bytes32 lockId, ...) external;
   function delegateLock(bytes32 lockId, address newSpender, ...) external;
   function spendLock(bytes32 lockId, ...) external;
   function cancelLock(bytes32 lockId, ...) external;

   function getLock(bytes32 lockId) external view returns (...);
   function isLockActive(bytes32 lockId) external view returns (bool);
}
```

実装するコントラクトは、ロックが何を意味するのか、引数がどのようにエンコードされるのか、コミットメントがどのように構築されるのか、そして提供された実行引数がどのように検証されるのかを正確に定義する責任を負います。

これにより、調整役のスマートコントラクトのような単一のエグゼキューターが、内部構造が大きく異なるアセットや価値システムに紐付けられている場合でも、多くのそのようなロックを統一された方法で決済できるようになります。

この提案は、ある当事者が自身の資産または価値システム上で操作を準備し、その準備された操作の制御を別の当事者または調整役のコントラクトに委任し、委任された支出者が事前定義された支出またはキャンセルパスを通じてのみそれを最終化できるようにするフローをサポートすることを意図しています。

## **レビューの焦点**

私の計画では、ここで仕様を再掲載したり要約したりするのではなく、完全な仕様を含むPRをオープンする予定です。最も有益な議論は、完全な提案に対して行われるでしょう。

一般的な枠組み、関連する決済パターン、および考慮すべき主要なトークンまたは価値システムの例について、初期のフィードバックを歓迎します。PRがオープンしたら、詳細な議論のためにここにリンクを戻します。

*2投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8316-programmable-settlement-locks/28861)
