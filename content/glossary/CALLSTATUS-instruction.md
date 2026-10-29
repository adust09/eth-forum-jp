---
title: CALLSTATUS instruction
aliases:
  - CALLSTATUS命令
tags:
  - glossary
date: '2026-10-29'
---

**CALLSTATUS命令**

EIP-8456で提案されているEVMの新しい命令。現在のフレームにおける直近のCALL系命令やCREATE系命令の完了ステータス（成功、リバート、停止など）を3ビットでスタックにプッシュする。これにより、コントラクトはガスの残量に依存せず、呼び出しの失敗原因を正確に判断できるようになる。

## 関連用語

- [[glossary/EIP-8456|EIP-8456]]
- [[glossary/CALL|CALL]]
- [[glossary/CALLCODE|CALLCODE]]
- [[glossary/DELEGATECALL|DELEGATECALL]]
- [[glossary/STATICCALL|STATICCALL]]
- [[glossary/CREATE|CREATE]]
- [[glossary/CREATE2|CREATE2]]
- [[glossary/EVM|EVM]]

## この用語を使っている記事

(なし)

## 元の表記（英語）

(なし)
