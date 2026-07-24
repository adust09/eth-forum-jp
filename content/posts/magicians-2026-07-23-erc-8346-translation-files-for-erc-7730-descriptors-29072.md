---
title: 'ERC-8346: ERC-7730記述子用翻訳ファイル'
original_title: 'ERC-8346: Translation Files for ERC-7730 Descriptors'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8346-translation-files-for-erc-7730-descriptors/29072
author: alex-forshtat-tbk
date: '2026-07-23'
category: ERCs
tags:
  - ercs
  - eip
  - ux
  - smart-contracts
  - protocol-design
  - applications
topic_id: '29072'
translated_at: '2026-07-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8346: Translation Files for ERC-7730 Descriptors](https://ethereum-magicians.org/t/erc-8346-translation-files-for-erc-7730-descriptors/29072) — alex-forshtat-tbk (2026-07-23)

[[glossary/ERC|ERC]]-7730はバージョン1と2を経てきましたが、翻訳メカニズムは指定されていませんでした。将来のバージョン3に向けて、多言語対応の[[glossary/Clear-Signing|クリア署名]]の基盤を築くためにも、本[[glossary/ERC|ERC]]のような補完的な[[glossary/ERC|ERC]]を統合することは非常に良いことだと考えます。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1906)

#### [[glossary/ERC|ERC]]の追加: ERC-7730記述子用翻訳ファイル](https://github.com/ethereum/ERCs/pull/1906)

`master` ← `forshtat:add-erc7730-localization-files`

公開日 2026年7月23日 午前0時5分 (UTC)

 [![](https://avatars.githubusercontent.com/u/40541447?v=4) forshtat](https://github.com/forshtat)

[+259 \-0](https://github.com/ethereum/ERCs/pull/1906/files)

## 概要
[[glossary/ERC|ERC]]-7730の補完仕様であり、その`$i18n`フィールドで参照される翻訳ファイル形式を定義します。
- 翻訳ファイルスキーマ（v3開発中に[[glossary/ERC|ERC]]-7730自身の資産下に一時的に存在したドラフトスキーマを置き換えるもの）。
- ドット区切りの名前空間を持つsnake\_caseの翻訳キー。生の英語文字列キーを置き換えます。
- 将来の共有語彙パッケージのために予約された`common.`名前空間。解決の優先順位を持ちます。
- 翻訳リソース参照におけるSubresource-Integrity形式のハッシュ。
- 必須言語リスト、BCP-47ルックアップ/フォールバックセマンティクス、およびプレースホルダー保存ルール。
## テスト計画
- [ ] `erc7730-i18n-v1.schema.json`が整形式のDraft 2020-12 JSON Schemaとして検証済みであること。
- [ ] `example-main.fr.json`がスキーマに対して検証済みであること。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8346-translation-files-for-erc-7730-descriptors/29072)
