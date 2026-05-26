---
title: このサイトについて
description: ethresear-jp の運用方針・翻訳パイプライン・免責事項
tags:
  - meta
date: 2026-05-17
---

## このサイトは何か

[ethresear.ch](https://ethresear.ch/) と [ethereum-magicians.org](https://ethereum-magicians.org/) の投稿を、Gemini 2.5 Pro で日本語化し [Quartz](https://quartz.jzhao.xyz/) で公開しているサイトです。

## 仕組み

1. GitHub Actions が日次（JST 09:00）で各 Discourse フォーラム（ethresear.ch, ethereum-magicians.org）の `/latest.rss` を取得
2. 新着投稿の HTML を Markdown に変換し、Gemini に翻訳を依頼
3. プロンプトに [[glossary/index|用語集]] を毎回注入することで、専門用語の表記揺れを抑制
4. 翻訳結果を `content/posts/` に Markdown として保存し PR を作成
5. main にマージされると Cloudflare Pages が Quartz をビルドして公開

ソース: [adust09/ethresear-jp](https://github.com/adust09/ethresear-jp)

## 翻訳の精度について

- Gemini による機械翻訳のため、誤訳が含まれます
- 各記事の冒頭に **原文 URL** を必ず併記しているので、重要な意思決定に使う際は原文で確認してください
- 用語の一貫性を担保するため [[glossary/index|用語集]] を別管理していますが、新出用語は反映が遅れる可能性があります

## 用語集への貢献

`glossary.md` に項目を追加すると、次回ビルド時に [[glossary/index|用語集ページ]] に反映され、過去記事中の該当用語にもバックリンクが張られます。

## ライセンス

- 翻訳対象の原文の著作権はそれぞれの著者に帰属します
- 本サイトのコードは [MIT License](https://github.com/adust09/ethresear-jp/blob/main/LICENSE) です
- 翻訳結果は CC BY 4.0 で公開しています（原文の二次利用にあたる部分は原文ライセンスを優先）

## 問い合わせ

誤訳や引用範囲の問題、その他の指摘は [GitHub Issues](https://github.com/adust09/ethresear-jp/issues) までお寄せください。
