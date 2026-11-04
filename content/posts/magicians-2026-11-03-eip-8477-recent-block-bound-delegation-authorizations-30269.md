---
title: 'EIP-8477: 最近のブロックにバインドされた委任承認'
original_title: 'EIP-8477: Recent Block Bound Delegation Authorizations'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/eip-8477-recent-block-bound-delegation-authorizations/30269
author: dangerousfood
date: '2026-11-03'
category: EIPs core
tags:
  - eips-core
  - eip
  - account-abstraction
  - security
  - protocol-design
  - transaction-validation
topic_id: '30269'
translated_at: '2026-11-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8477: Recent Block Bound Delegation Authorizations](https://ethereum-magicians.org/t/eip-8477-recent-block-bound-delegation-authorizations/30269) — dangerousfood (2026-11-03)

[EIP-8477: Recent Block Bound Delegation Authorizations](https://github.com/ethereum/EIPs/pull/12601)に関する議論トピックです。

この提案は、[Binance 16](https://x.com/XBToshi/status/2115989338345619794)で発生した最近の[[glossary/EIP-7702|EIP-7702]]スイープに触発されたもので、本質的には、[[glossary/EIP-7702|EIP-7702]]署名の長期的な保存と後からのリプレイを防ぐものです。

この提案は、未使用の[[glossary/EIP-7702|EIP-7702]]承認の遅延使用を制限します。各承認は、既存のチェーンID、委任アドレス、ノンスに加えて、最近の実行ブロック番号とそのブロックヘッダーハッシュに署名します。

実行ブロック `N` に含めるためには、署名されたブロックがその先行する256個の祖先ブロックのいずれかであり、そのハッシュがその祖先と一致する必要があります。ちょうど256ブロック前のアンカーは引き続き有効ですが、257ブロック前のアンカーは無効になります。現在のブロックと将来のブロックは除外されます。

鮮度チェックは、署名回復や権限固有のステートアクセスが行われる前に、[[glossary/native-authorization-processing|ネイティブ承認処理]]中に実行されます。期限切れまたは不一致のアンカーは、[[glossary/EIP-7702|EIP-7702]]の既存の失敗時スキップ動作を使用して、その承認をスキップします。これにより、そのエントリを通じて権限のノンスが消費されたり、既存の委任がクリアされたりすることはありません。構造的に不正な形式の承認は、[[glossary/transaction|トランザクション]]を無効にします。

このドラフトは、インストール、置換、およびゼロアドレスによる取り消しにも同じ鮮度要件を適用します。インストールされた委任は、その承認のアンカーが期限切れになった後も有効です。この提案は、未使用の署名の包含期間を制限するものであり、インストールされた委任を期限切れにしたり、ライブ署名アクセスを持つ攻撃者が新しい署名を即座に使用するのを防ぐものではありません。

この変更には、協調的な[[glossary/network-upgrade|ネットワークアップグレード]]が必要です。アクティベーション時には、レガシーな6フィールド承認は拒否され、拡張された8フィールド形式が必須となります。このドラフトは、[[glossary/transaction-type|トランザクションタイプ]] `0x04` と[[glossary/signing-prefix|署名プレフィックス]] `0x05` を維持しますが、レビューの対象となります。

#### 更新ログ

-   2026-10-30: 初版ドラフト、[ethereum/EIPs PR #12601](https://github.com/ethereum/EIPs/pull/12601)。
-   2026-10-30: [[glossary/EIP-8477|EIP-8477]]は[[glossary/editorial-review|編集レビュー]]中に割り当てられました ([ethereum/EIPs PR #12601#discussion_r4428457660](https://github.com/ethereum/EIPs/pull/12601#discussion_r4428457660))。

#### 外部レビュー

2026-10-30現在、外部技術レビューは記録されていません。編集フィードバックは[プルリクエストレビュー](https://github.com/ethereum/EIPs/pull/12601/files)で確認できます。

#### 未解決の問題

-   2026-10-30: 固定された256ブロックウィンドウが、[[glossary/wallet|ウォレット]]、[[glossary/relayer|リレイヤー]]、置換、およびリカバリーワークフローにおいて、チェーン全体で十分な包含ヘッドルームを提供するかどうかを評価する。詳細は[ドラフトPR](https://github.com/ethereum/EIPs/pull/12601)を参照。
-   2026-10-30: 既存の承認料金を維持する前に、追加の承認バイト、祖先ルックアップ、および処理コストの[[glossary/benchmarking|ベンチマーク]]を行う。詳細は[ドラフトPR](https://github.com/ethereum/EIPs/pull/12601)を参照。

*2件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8477-recent-block-bound-delegation-authorizations/30269)
