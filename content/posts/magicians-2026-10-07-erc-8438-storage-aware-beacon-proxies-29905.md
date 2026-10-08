---
title: 'ERC-8438: ストレージ対応ビーコンプロキシ'
original_title: 'ERC-8438: Storage-Aware Beacon Proxies'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8438-storage-aware-beacon-proxies/29905'
author: ashutosh-ukey
date: '2026-10-07'
category: ERCs
tags:
  - ercs
  - smart-contracts
  - eip
  - protocol-design
  - state-management
  - security
  - research
topic_id: '29905'
translated_at: '2026-10-08'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8438: Storage-Aware Beacon Proxies](https://ethereum-magicians.org/t/erc-8438-storage-aware-beacon-proxies/29905) — ashutosh-ukey (2026-10-07)

ビーコンプロキシは、単一のビーコンを介して多数のコントラクトをアップグレードすることを可能にしますが、既存のパターンは通常、新しい実装がすべてプロキシの既存のストレージレイアウトと互換性を保つことを前提としています。これは、ストレージの構成が異なる実装間でフリートをアップグレードする必要がある場合に、制約となります。

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/2047)

#### [[ERC|ERC]]の追加: ストレージ対応ビーコンプロキシ (#2047)](https://github.com/ethereum/ERCs/pull/2047)

`master` ← `ashutosh-ukey:storage-aware-beacon-proxies`

公開日時 09:29PM - 2026年10月5日 UTC

 [![](https://avatars.githubusercontent.com/u/109698595?v=4) ashutosh-ukey](https://github.com/ashutosh-ukey)

[+890 \-0](https://github.com/ethereum/ERCs/pull/2047/files)

## 概要
ビーコン管理されたプロキシフリートは、各プロキシの状態をアップグレードすることなく、異なるストレージレイアウトを持つ実装間を安全に移行することはできません。この[[ERC|ERC]]は、ストレージ対応ビーコンメタデータ、プロキシごとのマイグレーションおよびフォールバック動作を規定し、テスト付きのスタンドアロンCC0リファレンス実装を含みます。

## 検証
- スタンドアロンのFoundryテストは合格しました (9/9)。
- Markdown lintは合格しました。
- Ethereum Magiciansの議論URLと[[ERC|ERC]]番号は保留中です。

[[ERC|ERC]]-8438は、ストレージ対応ビーコンプロキシパターンを提案しています。ビーコンはターゲット実装とそのストレージレイアウト識別子の両方を識別し、各プロキシは自身のストレージで現在初期化されているレイアウトの識別子を追跡します。これらのレイアウトが異なる場合、プロキシは新しい実装を使用する前にストレージをマイグレーションできます。マイグレーションが完了できない場合、プロキシは既存のレイアウトを保持し、互換性のないコードを実行する代わりに互換性のあるフォールバックを使用します。

目標は、調整されたフリート全体のアップグレードを維持しつつ、プロキシごとに安全にストレージマイグレーションが行われるようにすることです。ドラフト仕様、リファレンス実装、およびテストは、[[ERC|ERC]]のプルリクエストで利用可能です。全体的なアプローチや見落とされている可能性のあるエッジケースについて、ご意見を歓迎します。ありがとうございます！

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8438-storage-aware-beacon-proxies/29905)
