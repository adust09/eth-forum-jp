---
title: 'ERC-8470: ローンチ観測'
original_title: 'ERC-8470: Launch Observations'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8470-launch-observations/30112'
author: TOLL
date: '2026-10-28'
category: ERCs
tags:
  - ercs
  - eip
  - economics
  - applications
  - identity
  - agent-systems
  - onchain-data
  - attestations
  - protocol-design
topic_id: '30112'
translated_at: '2026-10-29'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8470: Launch Observations](https://ethereum-magicians.org/t/erc-8470-launch-observations/30112) — TOLL (2026-10-28)

トークンを購入しようとしている[[Autonomous-Agent|エージェント]]は、「信頼する検出器がこのローンチについて何を見たか、そしてどのブロックで見たか」という1つの読み取りを行うことができるべきです。この[[Informational-ERC|Pre-ERC]]は、それを標準的な[[on-chain-registry|オンチェーン記録]]とします。`latestFinding(chainId, token, detector, kind, param)`は型付きの値とそれが保持されていたブロックを返します。これにより、[[Autonomous-Agent|エージェント]]、ウォレットガード、またはルーターは、購入する同じトランザクション内で、欠落または古い読み取りを拒否できます。

これは[[ERC|ERC]]-8462（トークンローンチ宣言）の観測側です。その提案により、ローンチパッドはローンチ時に事実を宣言でき、「検出器、ウォレット、貸し手がローンチパッドが宣言した内容と彼らが[[Observation|観測]]した内容を比較できる」ようになります。[[Observation|観測]]は、同じ[[ERC|ERC]]-8376ローンチID、またはディレクトリにローンチがリストされていない場合はチェーンID + トークンを使用します。

**スケッチ**

-   トークンと検出器ごとに1つの呼び出し: `latestByToken`と`latestFinding`。欠落した[[Observation|観測]]または発見は「読み取りなし」として返され、クリーンに見える0としては返されません。読み取り側は、読み取りがどれくらい古くてもよいかを設定します。
-   小さな型付きコア: 最初のブロックのシェア、早期購入者のシェア、作成者の以前のローンチ、資金調達を通じてリンクされたウォレットが保有するシェア、製品ラベル、およびフィールド名による任意の[[ERC|ERC]]-8376ベースシグナル。
-   さらに、集計（反対/注意/クリア）と、完全なレポートのハッシュおよびURI。
-   任意のアドレスが検出器になれます。追記専用: 新しい[[Observation|観測]]は古いものを上書きしますが、両方とも読み取り可能です。
-   [[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]: 検出器は[[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]の[[Agent-Identity|アイデンティティ]]であり、その登録ファイルにレジストリをリストします。読み取りに依存した[[Autonomous-Agent|エージェント]]は、8004の評判でそれを評価できます。

ブロック時点の事実であり、評決ではありません。[[ERC|ERC]]-8376レポートとは異なり、スコア、不正パターン、ボンドはありません。

8462スレッドでの私の返信以来の1つの修正点: 流動性は、[[ERC|ERC]]-8376の`lpLockedShare` / `lpLockRemaining`シグナル（8463ロックがどのように表示されるか）を通じて読み取られ、私たち自身の発見ではありません。

**ステータス**

[[Draft|ドラフト]]、参照コントラクト、テストは記述済みです。Robinhood Chainでの完全な[[Observation|観測]]には、約0.04ドルのガス料金がかかります。私たちはRobinhood ChainでTollを実行しており、これはチェーンから直接ローンチを読み取り、[[Autonomous-Agent|エージェント]]からMCPと[[x402|x402]]を介して呼び出すことができます。私たちはレジストリに書き込む最初の検出器となるでしょう。

**質問**

1.  ガードにとって(トークン、検出器)ごとの1回の読み取りで十分か、それとも「リスト内の任意の検出器による最新の読み取り」も必要か？
2.  陳腐化: 読み取り側が境界を選択すべきか（[[Draft|ドラフト]]通り）、それともレジストリが種類ごとに設定すべきか？
3.  [[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]: [[Autonomous-Agent|エージェント]]からの評判フィードバックが正しいリンクか、それとも[[Observation|観測]]も8004の検証リクエストに応答すべきか？
4.  型付きコアは正しいか: 上記の5種類に加えて8376シグナルか？

[@Cybercentry](https://ethereum-magicians.org/u/cybercentry): 8376が[[Review|レビュー]]に進むにあたり、そのシグナルをフィールド名で再利用します。修正を歓迎します。

*6 posts - 3 participants*

[Read full topic](https://ethereum-magicians.org/t/erc-8470-launch-observations/30112)
