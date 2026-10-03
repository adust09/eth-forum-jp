---
title: 6ラウンドの外部検証で発見された、ある署名検証ツールの6つの欠陥
original_title: >-
  Six defects in one signature verification tool, found from outside in six
  rounds
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/six-defects-in-one-signature-verification-tool-found-from-outside-in-six-rounds/26109
author: achemperety
date: '2026-10-02'
category: Security
tags:
  - security
  - cryptography
  - research
  - formal-verification
  - protocol-design
  - verification
  - tooling
topic_id: '26109'
translated_at: '2026-10-03'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Six defects in one signature verification tool, found from outside in six rounds](https://ethresear.ch/t/six-defects-in-one-signature-verification-tool-found-from-outside-in-six-rounds/26109) — achemperety (2026-10-02)

検証ツールは成功を返すだけで、何も確立しないことがあります。この2週間で、私は自分のリポジトリで4件、他人のリポジトリで6件のそのようなケースを発見しました。このパターンは十分に一貫しており、書き留める価値があります。

**私自身の4件。** 読み込まれたが何も比較されなかった参照ダイジェスト。バイトコードの内容ではなくバイトコードの長さを比較していたもの。テストセット内のすべてのレコードがたまたま同じ形状を共有していたためだけにパスしたリーダー。発見メカニズムがすでに期待していたものだけを探していたドリフト検出器。これら4つすべてがCI (継続的インテグレーション) でグリーンでした。しかし、それらが捕捉すべきものを捕捉することはなかったでしょう。

**他人のリポジトリで見つかったさらに6件。** nsgoodsのNikolaos Dimitriadisは、x402カタログの週次スキャンに対して読み取り専用のMCPサーバーを運用しており、これには公開されたマニフェストに対してオフラインで署名を検証するツールが含まれています。彼はテストを呼びかけました。私は9月18日から22日の間に6ラウンドのテストを実施し、各呼び出しグループの前に予測をファイルに書き留め、後で自己評価できないようにしました。すべてのラウンドで何らかの発見がありました。

1回目、9月18日: `verify_signature`がオペレーター自身の署名済みプレビューに対して`valid: false`を返しました。マニフェストに記載されたレシピでオフラインで再計算したところ、宣言された署名者が正確に復元されました — このツールは、このサービスが署名するフィールドを含む固定フィールドリストを削除していたのです。これは真正なドキュメントに対する偽陰性でした。同じ実行で、マニフェストが署名者のアイデンティティを、ツールがそれに対してチェックするプレビューから導き出していることが判明しました。これはアイデンティティではなく一貫性を確立するものだったのです。

2回目、9月19日: 偽陰性は修正され、彼がテストしていなかった2つ目の偽陰性も発見しました。しかし、同じ署名者の下で異なるサービスに属する注入されたフィールドを持つボディが、依然として有効として検証され、私が提出した2つの再現[[glossary/Attestation|アテステーション（証明）]]は、サポートされていないフォーマットではなく、単なる検証失敗として返されました — そのため、彼のツールで私の証拠をチェックした人は、それが不良だと結論付けただろう。

3回目、9月19日: 新しい`service`引数が追加され、推測を排除するために、呼び出し元がメッセージから除外するフィールドを選択できるようになりました。適切なサービス名を指定すると、改ざんされたボディが検証されました。事前の予測では約60%でしたが、2回中2回発生しました。

4回目、9月20日: スキーマゲートによって閉じられ、誤ったサービスのマトリックス全体で確認されました — 30個の非対角セルのうち30個が拒否され、その中には署名単独では検証されたであろう5つが含まれていました。しかし、スキーマ拒否と実際の署名失敗はバイト単位で同一のテキストを返したため、外部からは、どのチェックがボディを拒否したのか判別できませんでした。

5回目、9月22日: 署名者アイデンティティが公開レジストリ記録にアンカーされ、決済署名レシピがフローズンゴールデンに対してオフラインで確認されました。彼はそのアンカーが確立するものについて、より控えめな説明を採用しました。すなわち、チェーンは固定された登録日と誰も編集できない履歴を提供するが、ドメインへのリンクは依然としてそのドメインの制御に依存している、というものです。共有された拒否テキストはまだ残っていました。

6回目、9月22日: 異なるステータスが追加され、それに伴い宣言された[[glossary/Invariant|不変条件]]が示されました — `checked` はリカバリーが実際に実行された場合にのみ真となる、というものです。私は構築可能なあらゆる入力クラスを網羅する106回の呼び出しでそれを破ろうと試みました。本質は維持されました。1つの文字通りの例外として、非オブジェクトJSON入力は`checked`キーが全くないステータスを返し、falseではなかった。

**私自身では発見できなかった部分。** 9月25日、私はツールログが私の呼び出しをどのように処理したか尋ねました。彼は私が尋ねた以上のことを教えてくれました。ログが9月17日から26日までの文字列引数値の最初の80文字、セッションID、呼び出し元IPを保持していたこと、プライバシーページに記載されていたローテーションがそのファイルでは行われていなかったこと、そして9月22日に私の行がディレクトリプローブと私の実行を区別するために使用されていたこと、です。彼は同日中にプライバシーページを修正しました。ロギングは現在、引数名、引数長、および日ごとのキー付きIPハッシュを保持しています。古い形式の記録は10月26日までに削除されます。彼はその後、質問を超えて、編集ルールがウォレットアドレスまたは類似の識別子を含むクエリ文字列全体を置き換えるようにし、それに基づいて51ファイルを書き換え、108個すべてのログファイルで残っていないことを確認しました。

それが何を示す証拠であるかについて、正確に述べたいと思います。ツールに関するすべては私が自分で検証しました。ログに関するすべては彼自身のシステムに関する彼の説明であり、外部からそれをチェックする方法はありません。私がそれを信じる気になるのは、彼が私が発見できなかったことを2度教えてくれたからです。

**パターン。** ほとんどすべての場合において、チェックは実行され、判定を返しましたが、その判定は周囲のコードが想定していた意味を持っていませんでした。エラーが報告されないことは、チェックが機能している証拠ではありません。したがって、私が現在、自分の仕事と他人の仕事に対して守っているルールは次のとおりです。誰も失敗を観測していないチェックは、機能しているとは言えない。私のリポジトリにあるすべての回帰テストは、修正前に壊れたコードに対して実行されています。今日私が公開したツールは、成功する実行と失敗する実行の両方を出荷しており、失敗する実行は偽造された例ではなく、ライブの結果です。

**知りたいこと。** 他に、この種の予測先行型パスを[[glossary/Attestation|アテステーション（証明）]]または署名検証サービスに対して実行した人はいますか？そして、何を発見しましたか？レジストリ実装、[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]ツール、他者が依存するブーリアン値を返すものであれば何でも構いません。私の推測では、この種の欠陥は一般的であり、ほとんど見過ごされていると思いますが、それはあくまで推測です。

両方の実行がキャプチャされたツール: [GitHub - achemperety/exactzk-verification-guards: Three guards against verification code that passes while establishing nothing: a deployment drift canary, a self-test for the canary's own logic, and a verifier freshness check. · GitHub](https://github.com/achemperety/exactzk-verification-guards)
nsgoodsサーバー: [nsgoods Workbench MCP: read only index of the x402 catalogue](https://mcp.nsgoods.org/mcp) 、ソースは [GitHub - Nikoble1926/nsgoods-workbench-mcp: Read only MCP server for the x402 catalogue: payability verdicts, prices, host drift, offline signature verification. Hosted at mcp.nsgoods.org · GitHub](https://github.com/Nikoble1926/nsgoods-workbench-mcp)
この作業の元となった以前の作業: [Atomic ZK-Proof-Gated Settlement for x402 Agent Payments: A Measured Reference Design](https://ethresear.ch/t/atomic-zk-proof-gated-settlement-for-x402-agent-payments-a-measured-reference-design/25660)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/six-defects-in-one-signature-verification-tool-found-from-outside-in-six-rounds/26109)
