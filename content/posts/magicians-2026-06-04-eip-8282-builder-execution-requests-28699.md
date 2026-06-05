---
title: 'EIP-8282: ビルダー実行リクエスト'
original_title: 'EIP-8282: Builder Execution Requests'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/eip-8282-builder-execution-requests/28699'
author: wemeetagain
date: '2026-06-04'
category: EIPs
tags:
  - eips
  - consensus
  - pbs
  - mev
  - execution-layer
  - eip
  - protocol-design
topic_id: '28699'
translated_at: '2026-06-05'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EIP-8282: Builder Execution Requests](https://ethereum-magicians.org/t/eip-8282-builder-execution-requests/28699) — wemeetagain (2026-06-04)

# EIP-8282: ビルダー実行リクエスト

[[EIP|EIP（Ethereum 改善提案）]]-8282に関する議論トピック

**更新ログ**

-   2026-06-04: 初回ドラフト [Add EIP: Builder Execution Requests by wemeetagain · Pull Request #11760 · ethereum/EIPs · GitHub](https://github.com/ethereum/EIPs/pull/11760)

#### 外部レビュー

2026-06-04現在、なし。

#### 未解決の課題

2026-06-04現在、なし。

## 概要

新しい[[EIP|EIP]]であり、[[ePBS|ePBS (enshrined Proposer-Builder Separation)]]の[[Block-Building|ビルダー]]が[[Ethereum-validator|バリデータ]]のフローを介してオンボーディングや終了を行うのではなく、[[EIP|EIP]]-7685リクエストバス上に独自の[[execution-layer|実行レイヤー]]リクエストコントラクトを持つことを可能にする。2つのプリデプロイがある。

| リクエストタイプ | コントラクト | エントリーポイント | レコード |
| --- | --- | --- | --- |
| 0x03 | ビルダーデポジット（トップアップも含む） | deposit(pubkey, withdrawal_credentials, amount, signature) | pubkey ++ wc ++ amount ++ signature (184 B) |
| 0x04 | ビルダー終了 | exit(pubkey) | source_address ++ pubkey (68 B) |

どちらも、[[EIP|EIP]]-7002/7251リクエストバスをモデルとした共有の`RequestQueue`（[[EIP|EIP]]-1559スタイルの手数料、`EXCESS_INHIBITOR`、ブロック終了時の`SYSTEM_ADDRESS`ドレイン）上の薄いキューである。どちらもオンチェーン暗号化を実行したり、ログを出力したりしない。アドレス、リクエストタイプバイト、およびランタイムコードは、割り当てと監査が保留中のプレースホルダーである。

## 根拠

-   **[[Block-Building|ビルダー]]を[[Ethereum-validator|バリデータ]]から分離する。** 専用のリクエストタイプにより、[[consensus|コンセンサス層]]は引き出し資格情報プレフィックスを検査する代わりにタイプによってルーティングできるようになり、[[Ethereum-validator|バリデータ]]と[[Block-Building|ビルダー]]のレジストリを独立してキー設定できる。これにより、単一の公開鍵が[[Ethereum-validator|バリデータ]]と[[Block-Building|ビルダー]]の両方になることも可能になる（この[[EIP|EIP]]が削除する制限）。
-   **[[consensus|コンセンサス層]]側のDoSを制限する。** [[Block-Building|ビルダー]]デポジットの所有証明は、[[EIP|EIP]]-7732と同様に[[consensus|コンセンサス層]]によって検証される。ブロックあたり`MAX_REQUESTS_PER_BLOCK`に制限されたリクエストバスを介してデポジットを配信し、さらに1-ETHの[[stake|ステーク]]に加えて[[EIP|EIP]]-1559手数料を課すことで、ブロックあたりの検証作業とスパム経済を制限する。
-   **コールドキーでの終了。** [[Block-Building|ビルダー]]のBLSキーはホットである（入札に署名するため）。そのため、終了は[[Block-Building|ビルダー]]の`execution_address`によって承認され、[[EIP|EIP]]-7002の`0x01`資格情報に関する根拠を反映している。

## コンセンサス層の変更点（EIP-7732 / gloas）

この[[EIP|EIP]]は、[[EIP|EIP]]-7732の[[Block-Building|ビルダー]]ライフサイクルを変更する（規範的な「[[EIP|EIP]]-7732への変更」セクション）。

-   `process_deposit_request`から[[Block-Building|ビルダー]]ブランチを削除する。[[fork|フォーク]]後の[[Block-Building|ビルダー]]は、実行リクエスト`0x03`からのみ供給される。[[Block-Building|ビルダー]]（`0x03`プレフィックス）資格情報を持つ`0x00`デポジットは拒否される。
-   `process_voluntary_exit`から[[Block-Building|ビルダー]]ブランチを削除する（[[Ethereum-validator|バリデータ]]専用になる）。[[Block-Building|ビルダー]]は実行リクエスト`0x04`を介してのみ終了する。
-   `onboard_builders_from_pending_deposits`を**保持**し、アクティベーションスロットからジェネシス[[Block-Building|ビルダー]]が存在するようにする（[[fork|フォーク]]時の[[Block-Building|ビルダー]]に依存するアプリケーションは影響を受けない）。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/eip-8282-builder-execution-requests/28699)
