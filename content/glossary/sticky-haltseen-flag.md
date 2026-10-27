---
title: sticky halt_seen flag
aliases:
  - スティッキーハルト検出フラグ
tags:
  - glossary
date: '2026-10-27'
---

**スティッキーハルト検出フラグ**

EVMの各実行フレームが保持する内部フラグ。フレーム内のいずれかの呼び出しが「halt bit」をセットして終了した場合に設定され、そのフレームが完了（リバートまたはリターン）する際に親フレームに伝播する。これにより、プロキシなどの仲介コントラクトを介しても、下位フレームで発生した例外的な停止が上位フレームに正確に報告される。

## 関連用語

- [[glossary/CALLSTATUS-instruction|CALLSTATUS instruction]]
- [[glossary/EVM-execution-frame|EVM execution frame]]
- [[glossary/halt-bit|halt bit]]

## この用語を使っている記事

(なし)

## 元の表記（英語）

(なし)
