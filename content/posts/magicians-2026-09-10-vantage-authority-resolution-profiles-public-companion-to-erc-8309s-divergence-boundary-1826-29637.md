---
title: Vantage-Authority解決プロファイル — ERC-8309の分岐境界に対する公開コンパニオン (#1826)
original_title: >-
  Vantage-Authority Resolution Profiles — public companion to ERC-8309's
  divergence boundary (#1826)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/vantage-authority-resolution-profiles-public-companion-to-erc-8309s-divergence-boundary-1826/29637
author: Damonzwicker
date: '2026-09-10'
category: ERCs
tags:
  - ercs
  - eip
  - protocol-design
  - verification
  - consensus
  - networking
  - cryptography
  - vantage-authority-resolution
  - divergence-boundary
topic_id: '29637'
translated_at: '2026-09-11'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Vantage-Authority Resolution Profiles — public companion to ERC-8309's divergence boundary (#1826)](https://ethereum-magicians.org/t/vantage-authority-resolution-profiles-public-companion-to-erc-8309s-divergence-boundary-1826/29637) — Damonzwicker (2026-09-10)

[[glossary/ERC-8309|ERC-8309]]は、ethereum/ERCs#1826で提案された§Deduplication（重複排除）修正案に基づき、2つのバンテージ (vantage) が同じ観測 (observation) について意見を異にする場合にメッシュ (mesh) が行う処理を変更します。それは、サイレントに重複排除 (deduplicating) する代わりに、その分岐 (divergence) をファーストクラスのストア状態（単一 | 分岐（コミットされた観測セット） | 不在）として保持し、宣言された解決ポリシー (resolution policy) をアタッチできる拡張ポイント `resolveDivergence` を指定します。意図的に何も規定していません。

このコンパニオン仕様 (companion specification) は、そこに何がアタッチされるかを定義します。現在公開されています。

[github.com](https://github.com/damonzwicker/erc8309-companion-drafts)

![damonzwicker/erc8309-companion-draftsのGitHubリポジトリのOpen Graph画像](https://opengraph.githubassets.com/5061f157148266a06804cb46b2f9543d/damonzwicker/erc8309-companion-drafts)

### [GitHub - damonzwicker/erc8309-companion-drafts: ERC-8309のドラフトコンパニオン仕様...](https://github.com/damonzwicker/erc8309-companion-drafts)

ERC-8309バンテージ・オーソリティ解決プロファイルのためのドラフトコンパニオン仕様。プライベートな執筆記録 — 作業コピーではありません。グループディスカッションは別の場所で行われます。

**定義するもの。** すべてのポリシーが満たすべき解決エンベロープ (resolution envelope) (E1–E6) — 何が合意されるのか、誰がカウントされるのか、どのバンテージクラス (vantage classes) において独立性が仮定されるのか、フォールトモデル (fault model) と[[glossary/finality|ファイナリティ]]ルール (finality rule)、評価ウィンドウ (evaluation window)、必要な証拠 (evidence) — および、ダイジェスト (digest) によって正確なコミット済み証拠セットをバインドする評決 (verdict) (V1–V5)。これにより、すべての解決は、それが指定するバイトから第三者によって再計算可能 (recomputable) になります。2つの対称的な禁止事項を持つ出力分類体系 (output taxonomy)：偽陽性 (false green) なし（解決された不一致は決して合意 (agreement) として報告されない — 崩壊した状態は表現不可能であり、単に推奨されないわけではない）、および偽陰性 (false red) なし（未宣言の変換から分岐 (divergence) が生成されない）。4つのプロファイル：Aは規範的なデフォルト (normative default) であり、何も解決せず、ダウンストリーム層 (downstream layers) に分岐を表面化させます。B（クォーラム (quorum)、バンテージクラスごとに異なる[[glossary/signers|署名者]]をカウントし、生のアテステーション (raw attestations) はカウントしない）、C（レジストリ加重 (registry-weighted)、検証可能な履歴 (verifiable history) を要求）、D（宣言された優先度）はオプトイン (opt-in) であり、それぞれが合意 (agreement) になることのない異なる解決済み状態 (resolved state) を生成します。評価は不変だが置き換え可能 (immutable but supersedable) です。プロファイルがルールを宣言しない限り、いかなる評価も[[glossary/finality|ファイナリティ]]を持ちません。

**境界、狭義に述べると。** これは単独の提案ではありません。ベース (base) は証拠の保存と分岐の露出 (divergence exposure) を所有し、コンパニオン (companion) はその境界のポリシー側 (policy side) のみを所有し、それを明示的かつ独立して再計算可能にします。シリアライザー (serializers) はスキーマ (schema) ごとにバインドされ、名前が付けられ、推論されることはありません。ドキュメントが引用する参照実装 (reference implementation) は、指定されたレシピ (recipe) を持つ構造化された証拠 (structured evidence) に対してダイジェスト固定 (digest-pinned) されているため、ピン (pin) は信頼されるのではなくチェック可能です。プロファイルAはTSEIの取り込み境界として本番稼働しています。

**リポジトリの要点は来歴 (Provenance) です。** v0.2から現在のv0.3.9までのすべての配布されたカットは、それぞれ独自のファイルとして保存され、配布後に編集されることはありません。ドキュメントの§13は、すべての設計決定、承認 (ratification)、修正、および着地 (landing) の追記専用記録 (append-only record) です — ドキュメント自体のエラーを含め、それぞれが発表 (announcement) ではなく成果物 (artifact) をチェックする共同執筆者 (co-author) によって発見されました。修正は、古い行を参照によって置き換える新しい行であるため、何が間違っていたかの記録は修正とともに残ります。この主張は機械的にチェック可能です：隣接する2つのカットの差分 (diff) を取ってください。

Damon Zwicker、Tiago Merlini、Jimmy Shi、Pavlo Tvardovskyi、babyblueviper1が共同執筆しました — これはそれを構築しレビューしたワーキンググループであり、それぞれが個別に共同執筆を選択しました。ベース標準：[[glossary/ERC-8309|ERC-8309]] (Merlini, Zwicker, Wu, Shi)。来歴：再計算・比較メカニズム (recompute-and-compare mechanism) は、[[glossary/ERC-8281|ERC-8281]]の[[glossary/Verification-Invariant|検証不変条件]]を単一のコミットメントエッジ (commitment edge) からメッシュ観測 (mesh observations) に一般化します。隣接する上位層：[[glossary/Recomputable-Verification-Receipts|再計算可能な検証レシート (RVR)]]は、すでにこのフォーラム (forum) に掲載されています。

成果物レベル (artifact level) でのレビューを歓迎します — セクション名を挙げ、バイトを引用し、記録が何を示しているかを述べてください。コンパニオンERC (companion ERC) としての提出は、#1826に意味のあるエディターの動き (editor movement) があるまで延期されます。

*2件の投稿 - 2人の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/vantage-authority-resolution-profiles-public-companion-to-erc-8309s-divergence-boundary-1826/29637)
