---
title: 'ERC-TBA: ERC-8004エージェント向け信用履歴'
original_title: 'ERC-TBA: Credit history for ERC-8004 agents'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-tba-credit-history-for-erc-8004-agents/30022
author: priors-agents
date: '2026-10-20'
category: ERCs
tags:
  - ercs
  - erc
  - applications
  - defi
  - economics
  - identity
  - protocol-design
  - erc-8004
  - credit-history
topic_id: '30022'
translated_at: '2026-10-21'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-TBA: Credit history for ERC-8004 agents](https://ethereum-magicians.org/t/erc-tba-credit-history-for-erc-8004-agents/30022) — priors-agents (2026-10-20)

これは、貸付結果（貸付開始、期限内返済、遅延返済、デフォルト）に関する[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]レピュテーションレジストリのプロファイルです。コアコントラクトは追加しません。貸し手は、2つのタグ（`credit.statement`と`credit.defaulted`）を持つ通常の`giveFeedback`エントリを投稿します。これらのタグのファイルは、エントリ内に`data:`URIとして含まれます。

ステートメントは、貸し手のコントラクトでブロックウィンドウ内に完了したエージェントのすべての貸付に対して、Merkleルートを用いてコミットします。各リーフは、貸付を完了した貸し手自身のログを指名するため、RPCエンドポイントのみを持つ読み手は、すべてのリーフ、ルート、合計を再構築し、移動した資金をサンプリングできます。ステートメントは連続するウィンドウ間でハッシュによって連鎖されるため、スキップされたウィンドウ、取り消されたステートメント、または宣言されたコントラクトで省略されたデフォルトは、再構築を行うすべての読み手から可視です。

今週から、オプションの部分として「オンチェーンマニフェスト、[[glossary/ERC-8092|ERC-8092]]のプロファイル」も追加されました。貸し手は、そのライターがどのコントラクトのために発言するかを、貸付コントラクト（またはそのERC-173オーナー）とライターの両方によって署名された[[glossary/ERC-8092|ERC-8092]]アソシエーションとして公開します。これにより、読み手はライターのファイルからではなく、チェーンからマニフェストを取得できます。

-   テキスト: [priors/docs/ERC-8004-CREDIT.md at main · priors-agents/priors · GitHub](https://github.com/priors-agents/priors/blob/main/docs/ERC-8004-CREDIT.md)
-   参照リーダー、エンコーディング、テストベクトル、テスト: 同リポジトリ (`sdk/credit-profile.mjs`, `sdk/credit-reader.mjs`, `docs/erc-8004-credit/vectors.json`)

ご意見を伺いたい質問:

1.  タグ名（`credit.statement`、`credit.defaulted`）について、また貸し手のサマリースコアが標準タグに値するかどうか。
2.  デフォルト後の回収額、一部返済、ロールオーバーについて: リーフのv2とするか、それとも別エントリとするか？
3.  オンチェーンマニフェストの適切な場所は[[glossary/ERC-8092|ERC-8092]]プロファイルでしょうか、それとも読み手は貸し手のレジストリに依存すべきでしょうか？
4.  読み手は`getSummary`で信用エントリを平均化してはなりません（これは値を平均化するものであり、加算するものではありません）。プロファイルはレジストリに合計ビューを要求すべきでしょうか、それとも読み手側のルールで十分でしょうか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-tba-credit-history-for-erc-8004-agents/30022)
