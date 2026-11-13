---
title: 'EIPドラフト: 量子/AI時代までBLSと並行してleanVM集約をシャドウモードで実行'
original_title: 'EIP Draft: Run leanVM aggregation in shadow mode alongside BLS until PQ/AI day'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-draft-run-leanvm-aggregation-in-shadow-mode-alongside-bls-until-pq-ai-day/30367
author: sauliusgrigaitis
date: '2026-11-12'
category: EIPs
tags:
  - eips
  - cryptography
  - post-quantum
  - consensus
  - signatures
  - research
  - leanvm
  - shadow-mode
topic_id: '30367'
translated_at: '2026-11-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP Draft: Run leanVM aggregation in shadow mode alongside BLS until PQ/AI day](https://ethereum-magicians.org/t/eip-draft-run-leanvm-aggregation-in-shadow-mode-alongside-bls-until-pq-ai-day/30367) — sauliusgrigaitis (2026-11-12)

## 概要

この提案は、[[Post-Quantum|ポスト量子]]署名集約をleanVMと共に**シャドウモード**で導入するものです。BLSは集約に対する唯一の権威であり続けます。[[consensus|コンセンサス]]の有効性は、今日と全く同じくBLSのみに依存します。leanVMの集約と証明はBLSと並行して生成および検証されますが、その結果は[[consensus|コンセンサス]]に影響を与えません。それらは測定、比較、報告されるのみです。[[Post-Quantum|ポスト量子]]/AI時代が到来した際には、緊急の[[fork|ハードフォーク]]によってBLSが廃止され、leanVMが完全に有効化されます。

「[[Post-Quantum|ポスト量子]]/AI時代」とは、量子コンピュータまたはAI支援型暗号解析によってBLSが安全でなくなると判断される時点を指します。

## 動機

イーサリアムは、BLSが実際に破られるずっと前から[[Post-Quantum|ポスト量子]]署名に対応できる準備をしておく必要があります。土壇場まで待つことは、新しく複雑なコードを急いで[[mainnet|メインネット]]にデプロイすることを意味します。leanVMに早期に権限を与えることには、それ自体のリスクがあります。leanVMは本番環境でテストされていない新しいコードです。どれほど慎重に構築され監査されたとしても、無効な証明を受け入れる健全性バグや、有効な証明を拒否する活性バグの可能性を排除することはできません。

シャドウモードの主な利点は、[[Post-Quantum|ポスト量子]]/AI時代が到来する前に、leanVMのバグによってイーサリアムが危険にさらされることがない点です。leanVMには権限がないため、leanVMのバグがイーサリアムのセキュリティを破綻させたり、チェーンを停止させたりすることはありません。同時に、leanVMは[[mainnet|メインネット]]で実際の負荷の下で実行されるため、権限が必要になる頃には、急いで有効化されたものではなく、実戦でテストされたコードとなっています。

## 仕様 (高レベル)

-   [[Ethereum-validator|バリデータ]]は、BLS署名と[[Post-Quantum|ポスト量子]]ハッシュベース署名の両方を生成します。
-   アグリゲーターは、BLS集約とleanVM集約証明の両方を生成します。
-   [[consensus|コンセンサス]]の有効性はBLSによって**のみ**決定されます。leanVM証明の欠落、無効、または遅延によって、[[block|ブロック]]や[[Attestation|アテステーション]]が無効になることはありません。
-   クライアントはleanVM証明を検証し、その結果を記録します。leanVMとBLS間の不一致はすべてログに記録され、メトリクスを通じて公開されます。
-   [[Post-Quantum|ポスト量子]]/AI時代が到来した際には、緊急の[[fork|ハードフォーク]]によってBLSが廃止され、leanVMが完全に有効化されます。leanVMはすでに[[mainnet|メインネット]]でシャドウモードで実行されているため、この[[fork|フォーク]]は権限を切り替えるだけであり、新しい[[cryptography|暗号]]をデプロイすることはありません。

署名フォーマット、証明伝播、[[networking|ネットワーキング]]の詳細は後日発表されます。

## 理論的根拠

シャドウモードは、[[consensus|コンセンサス]]にコストをかけることなく、leanVMの[[mainnet|メインネット]]レベルのテストを可能にします。

-   クライアントは、実際の負荷と敵対的条件下でleanVMの運用経験を積むことができます。
-   leanVMとBLS間のすべての不一致は、損害を与える前に発見される具体的なバグ報告となります。
-   研究者や監査人は、BLSがまだ保護している間にleanVMの精査を続けることができます。
-   パフォーマンス、証明サイズ、帯域幅は、パラメータが固定される前に実際のトラフィックで測定できます。

[[Post-Quantum|ポスト量子]]/AI時代までは、イーサリアムのセキュリティは今日と全く同じです。[[Post-Quantum|ポスト量子]]/AI時代以降、ネットワークはすでに何年もの実際の[[mainnet|メインネット]]集約を処理してきたシステムに依存することになります。

## セキュリティ上の考慮事項

leanVMには権限がないため、[[consensus|コンセンサス]]のセキュリティを弱めることはできません。leanVMの健全性バグは無効な集約を受け入れさせることはできず、完全性バグは有効な集約を拒否させることはできません。[[Post-Quantum|ポスト量子]]/AI時代までの[[consensus|コンセンサス]]セキュリティは、今日と同じくBLSセキュリティに等しいです。

残りのリスクはノードの可用性です。過剰なリソース使用など、leanVMの実装バグが、それを実行しているノードに影響を与える可能性は依然としてあります。クライアントはleanVM検証を隔離し、[[consensus|コンセンサス]]処理に影響を与えないようにすべきです。例えば、タイムアウトとリソース制限を設けた別のスレッドまたはプロセスで実行し、いかなる失敗もエラーではなく記録された不一致として扱うべきです。

## コスト

leanVMのみのアプローチと比較して、[[Post-Quantum|ポスト量子]]署名とleanVM証明はどちらにせよ必要です。シャドウモードの唯一の追加コストは、BLSをそれらと並行して実行し続けることです。

-   **帯域幅:** BLS署名は96バイトですが、ハッシュベースの[[Post-Quantum|ポスト量子]]署名はキロバイト単位で測定されます。BLS部分は、[[Post-Quantum|ポスト量子]]オーバーヘッドのごく一部に過ぎません。
-   **計算:** BLSの署名、集約、検証は、leanVM証明の生成と比較して安価です。
-   **コード:** BLSはすでにすべてのクライアントに実装され、実戦でテストされているため、これを維持しても新しいコードはほとんど追加されません。
-   **[[fork|フォーク]]:** leanVMのみのアプローチでは、leanVMを有効にするために[[fork|ハードフォーク]]が必要です。シャドウモードでは、[[Post-Quantum|ポスト量子]]/AI時代が到来した際にBLSを廃止するための[[fork|ハードフォーク]]が必要です。その時までにleanVMはすでに実行されているため、この[[fork|フォーク]]は権限を切り替えるだけです。

このわずかなオーバーヘッドと引き換えに、leanVMのバグが[[Post-Quantum|ポスト量子]]/AI時代が到来する前にイーサリアムを危険にさらすことはありません。

フィードバック、特にインセンティブと緊急[[fork|フォーク]]に関するものは大歓迎です。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-draft-run-leanvm-aggregation-in-shadow-mode-alongside-bls-until-pq-ai-day/30367)
