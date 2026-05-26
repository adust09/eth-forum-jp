---
title: 取引/商取引アプリケーション
original_title: Trade/commerce application
source_url: 'https://ethresear.ch/t/trade-commerce-application/24926'
author: juandtt
date: '2026-05-22'
category: Applications
tags:
  - applications
  - payments
  - smart-contracts
  - research
topic_id: '24926'
translated_at: '2026-05-23'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Trade/commerce application](https://ethresear.ch/t/trade-commerce-application/24926) — juandtt (2026-05-22)

こんにちは、

Ethereum上で動作する取引/商取引アプリケーションを開発しています。

必要な要素はいくつかあります。

1.  企業名や商品コードのような関連する標準化された識別子。
2.  注文/取引の発見/マッチングシステム。
3.  取引の調整/決済。
4.  追加の暗号化（オプション）。

アイデアとしては、実現不可能になったり煩雑になったりすることなく、ブロックチェーンの優れた特性を最大限に活用することです。

現在テストしているアーキテクチャは、基本的に注文/取引をエンコードするためのいくつかの基本的な構造体、注文を伝達/保存するためのデータを含むトランザクション、そして取引（決済）のためのスマートコントラクトで構成されています。

基本的には、注文（発見/マッチング）と取引（決済）の2つのステージを考えています。様々なフローをテストしています。一部の調整はオフチェーンで行う必要があるかもしれません。オフチェーンでの発見/マッチングシステムもいくつかテストしています。

同様の既存アプリケーションをご存知でしょうか？私自身もいくつか調査しましたが、実際に運用されているものは見つけられませんでした（この分野で人気のある企業が、このようなものに取り組んでいたと記憶しています…）。フィードバックをいただけると幸いです。これまでの経験、典型的なエラー/避けるべきこと、望ましい機能など。

もしご興味があり、必要であれば、現在行っていることについてさらに詳細を提供できます。

ありがとうございます。

Juan Diez Garcia
Torbellino Tech SL

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/trade-commerce-application/24926)
