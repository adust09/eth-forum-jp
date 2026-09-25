---
title: トークン化されたRWAにおける「任意のアドレスへの転送可能性」の標準？（トークン化された株式で引用されたロック済みv4プール）
original_title: >-
  Standard for "transferable to arbitrary addresses" on tokenized RWAs? (locked
  v4 pools quoted in tokenized stocks)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/standard-for-transferable-to-arbitrary-addresses-on-tokenized-rwas-locked-v4-pools-quoted-in-tokenized-stocks/29769
author: TheUsualSuspecT
date: '2026-09-24'
category: ERCs
tags:
  - ercs
  - tokenomics
  - defi
  - security
  - smart-contracts
  - economics
  - rwa-platforms
  - oracle
  - mev
topic_id: '29769'
translated_at: '2026-09-25'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Standard for "transferable to arbitrary addresses" on tokenized RWAs? (locked v4 pools quoted in tokenized stocks)](https://ethereum-magicians.org/t/standard-for-transferable-to-arbitrary-addresses-on-tokenized-rwas-locked-v4-pools-quoted-in-tokenized-stocks/29769) — TheUsualSuspecT (2026-09-24)

[[glossary/mainnet|メインネット]]でローンチパッド（sender.family）を見ていますが、他では見たことのないことをしており、安全かどうか確信が持てません。

ボンディングカーブとマイグレーションの代わりに、全供給量を単一の片側Uniswap v4ポジションに入れ、それを永久にロックしています。これは、clanker/zoraがBaseで同様のことをしているので問題ありません。新しい点は、引用資産（quote asset）がOndoの[[glossary/Tokenized-stocks|トークン化された株式]]（NVDA、TSLA、AAPL）を含む、彼らの許可リストにある何でもよいという点です。そして、作成者はスワップ手数料の70%を保有者（ホルダー）に、株式トークンで支払われるようにルーティングできます。つまり、保有者が取引量から[[glossary/Tokenized-stocks|トークン化された株式]]NVIDIAを得るコインです。これは本日発表されたばかりで、まだ稼働している株式ペアは見つけられませんでした。

私が懸念している点：

*   [[glossary/Tokenized-stocks|トークン化された株式]]は通常、KYC転送レジストリを持っています。v4では、すべてのプール残高はシングルトンのPoolManagerにあり、スワップ出力/手数料の支払いは任意のアドレスに行われます。したがって、発行者はPoolManagerとすべてのユーザーを許可する必要があります。もし彼らがルールを厳格化した場合、プールは資金が中に閉じ込められたまま機能停止し、ロックされているため、プロトコルでさえ誰も資金を引き出すことができません。
*   彼らの解決策は経験的なものです。2つのランダムなアドレス間で実際の残高を移動させ、それが機能すればその資産は許可リストに追加されます。これは、管理者がいる資産に対する一時的なチェックに過ぎません。
*   彼らのドキュメント自体にも、ほとんどのOndoトークンにはプールが全くないため、署名する前に到達可能性をチェックすると書かれています。正直な姿勢ですが、これがどれほど脆弱であるかを示しています。

質問：

1.  プールを作成する前に、オンチェーンで「任意のアドレスへの転送可能性」をチェックする既存の方法はありますか？ERC-3643の`canTransfer`はアドレスごとでステートフルであり、あまり役に立ちません。
2.  永久ロッカーは、アップグレード可能なプロキシや一時停止機能を持つ引用資産を拒否すべきでしょうか？それとも、転送失敗時にのみトリガーされるエスケープハッチは許容されますか？これは[[glossary/Hard-Rug-Pull|ラグプル]]の温床のように感じます。
3.  小さな質問ですが、彼らの買い戻しはオーナーによって制限されています。なぜなら、v4には組み込みのオラクルがなく、パーミッションレスな買い戻しは[[glossary/Sandwich-attack|サンドイッチ攻撃]]を受けるからです。まさにこの目的のために、安価なオラクルフックやTWAMMのようなものを構築した人はいますか？

ドキュメント：sender.family/docs

より多くの[[glossary/RWA-platforms|RWAプラットフォーム (Real World Assetプラットフォーム)]]が[[glossary/mainnet|メインネット]]に登場するにつれて、これはミームコインを超えて重要になるように感じます。ここで誰かこれについて考えた人がいれば興味があります。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/standard-for-transferable-to-arbitrary-addresses-on-tokenized-rwas-locked-v4-pools-quoted-in-tokenized-stocks/29769)
