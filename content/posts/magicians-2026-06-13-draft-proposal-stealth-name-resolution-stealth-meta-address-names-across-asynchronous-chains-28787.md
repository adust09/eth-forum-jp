---
title: 'ドラフト提案: ステルスネーム解決（非同期チェーン間でのステルスメタアドレス名）'
original_title: >-
  Draft Proposal: Stealth Name Resolution (stealth meta-address names across
  asynchronous chains)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-proposal-stealth-name-resolution-stealth-meta-address-names-across-asynchronous-chains/28787
author: collinsadi
date: '2026-06-13'
category: ERCs
tags:
  - ercs
  - stealth-addresses
  - name-resolution
  - cross-chain
  - erc
  - protocol-design
  - cryptography
topic_id: '28787'
translated_at: '2026-06-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Draft Proposal: Stealth Name Resolution (stealth meta-address names across asynchronous chains)](https://ethereum-magicians.org/t/draft-proposal-stealth-name-resolution-stealth-meta-address-names-across-asynchronous-chains/28787) — collinsadi (2026-06-13)

## 要約

議論のためにドラフト提案を共有します。これは、[[glossary/stealth-meta-address|ステルスメタアドレス]]のためのネーム解決レイヤーを定義します。カノニカルなイーサリアムレジストリは、親[[glossary/ENS|ENS]]名のレジストラと[[glossary/ENSIP-10|ENSIP-10]]ワイルドカードリゾルバーの両方として機能し、`com.opaque.meta`テキストレコードを提供します。このレジストリは、明示的なキーを保存することも、[[glossary/ERC-6538|ERC-6538]]レジストリからライブで取得することもできます。この提案はまた、2番目のチェーンがイーサリアムRPCエンドポイントにクエリすることなく、読み取り専用のネームレコードを維持できるように、トランスポート非依存のミラーペイロードを定義します。

議論が十分に行われた後、これを標準化トラックに提出する予定です。まだ提出されておらず、番号も割り当てられていません。[[glossary/ERC-5564|ERC-5564]]と[[glossary/ERC-6538|ERC-6538]]が必要です。

-   仕様書: [spec/ONS.md at main · opaquecash/spec · GitHub](https://github.com/opaquecash/spec/blob/main/ONS.md)

## 問題

[[glossary/ERC-5564|ERC-5564]]と[[glossary/ERC-6538|ERC-6538]]により、送信者は[[glossary/stealth-meta-address|ステルスメタアドレス]]に支払うことができますが、66バイトのメタアドレスは実用的なユーザー向け識別子ではありません。[[glossary/ENS|ENS]]がイーサリアム上でこれを解決します。複数のチェーンで受け取るユーザーは、例えばSolanaネイティブウォレットのように、[[glossary/Ethereum-RPC|イーサリアムRPC]]が利用できないウォレット環境から同じメタアドレスに解決される、人間が読める名前を1つ必要とします。

## 既存の作業との関係

ここで何が新しく、何がそうでないかを明確にしたいと思います。

-   [[glossary/stealth-meta-address|ステルスメタアドレス]]を名前の下に公開することは新しいことではありません。これは2023年のステルスアドレスに関する記述で説明されており、[[glossary/ERC-6538|ERC-6538]]によってイーサリアム向けに標準化されています。既に本番環境のウォレットでは、[[glossary/ENS|ENS]]サブネームとステルスアドレスを組み合わせて使用しています。
    
-   クロスチェーンのネーム解決は活発な分野です。[[glossary/ENSIP-10|ENSIP-10]]と[[glossary/CCIP-Read|CCIP-Read (ERC-3668)]]は確立されたイーサリアムネイティブなパスであり、[[glossary/ERC-7265|ERC-7265]]はカノニカルチェーン優先モデルと来歴証明メタデータを用いてクロスチェーンのネームブリッジングに対応しています。
    

このドラフトが追加しようとしている部分は、より限定的です。

1.  [[glossary/Ethereum-RPC|イーサリアムRPC]]や[[glossary/CCIP-Read|CCIP-Read]]ゲートウェイに依存しない、非[[glossary/EVM|EVM]]チェーン向けの読み取り専用ミラーフォーマット。[[glossary/CCIP-Read|CCIP-Read]]はイーサリアムへの検証可能なパスを前提としていますが、この提案はそれが扱いにくい環境を対象とし、明示的なカノニカルチェーン優先ルールのもとでブリッジの遅延を受け入れます。
    
2.  ワイルドカードリゾルバー内での[[glossary/ERC-6538|ERC-6538]]ライブソーシング。これにより、ユーザーは[[glossary/ERC-6538|ERC-6538]]でステルスキーを一度ローテーションするだけで、名前がそれに追従し、明示的なキーはオーバーライドとして機能します。
    
3.  非同期リモートクレームのための指定されたセマンティクス: 一度だけ消費されるクレームメッセージ、競合するラベルに対するカノニカルチェーン優先の競合ルール、およびウォレットがユーザーに表示する保留中、確認済み、失効、または期限切れの状態マシン。
    

## 設計概要

-   名前: 設定された親（例: `alice.opq.eth`）の深さ1のサブネーム、LDHラベルのみ、Unicode正規化はスコープ外。
    
-   カノニカルレジストリ: 名前ごとに1つのレコード（登録者、オプションのリモート権限、オプションの明示的なキー、タイムスタンプ）を保持します。`text(node, "com.opaque.meta")`および`addr(node)`に対する[[glossary/ENSIP-10|ENSIP-10]]の`resolve`を実装します。
    
-   キーのソース: 明示的なキーが優先されます。それらが空の場合、リゾルバーは[[glossary/ERC-6538|ERC-6538]]から`stealthMetaAddressOf(registrant, 1)`を読み取ります。
    
-   ミラーペイロード: 固定164バイトのバージョン1レイアウト（バージョン、アクション、名前ハッシュ、[[glossary/spend-key|スペンディングキー]]、[[glossary/view-key|ビューキー]]、オーナー、リモート権限）。ブリッジエンベロープがこれをラップする場合があります。受信者はエンベロープを認証し、承認済みエミッターリストを強制し、古いまたはリプレイされたシーケンス番号を拒否します。
    
-   リモートクレーム: リモートチェーンからのオプションの暫定クレームペイロード。カノニカルレジストリによって最大1回消費され、競合するラベルではカノニカル登録が優先されます。
    

## キー順序に関する注意

[[glossary/ERC-5564|ERC-5564]]と[[glossary/ERC-6538|ERC-6538]]は、[[glossary/meta-address|メタアドレス]]を[[glossary/spend-key|スペンディングキー]]、次に[[glossary/view-key|ビューキー]]としてシリアライズします。`com.opaque.meta`テキストレコードは、[[glossary/view-key|ビューキー]]、次に[[glossary/spend-key|スペンディングキー]]を使用します。ミラーペイロードは、[[glossary/spend-key|スペンディングキー]]、次に[[glossary/view-key|ビューキー]]を使用します。テキストレコードを発行するリゾルバーまたはミラーは、半分を並べ替えます。この仕様は、あらゆる方向でこれを明記しています。なぜなら、これは発生しやすい相互運用性の間違いだからです。

## レビュアーへの公開質問

1.  明示的な読み取り専用ミラーによるカノニカルチェーン優先は、非[[glossary/EVM|EVM]]環境にとって適切なトレードオフでしょうか？それとも、ゲートウェイが実現可能な場合は[[glossary/CCIP-Read|CCIP-Read]]に委ね、非[[glossary/EVM|EVM]]ケースのみミラーを指定すべきでしょうか？
    
2.  リモート発信の登録者に対するサロゲートアドレスの導出は、ここで指定すべきでしょうか、それともデプロイメントに任せるべきでしょうか？
    
3.  24時間のデフォルト保留期間は妥当でしょうか？また、それはプロトコル定数であるべきか、デプロイごとの値であるべきでしょうか？
    
4.  [[glossary/ERC-7265|ERC-7265]]との重複を考慮すると、ミラーペイロードをその来歴証明メタデータと整合させるべきでしょうか、それとも別のレイアウトを定義すべきでしょうか？
    
5.  [[glossary/ERC-6538|ERC-6538]]ライブソーシングのオーバーライド動作は、曖昧さなく実装できるように十分に明確に指定されているでしょうか？
    

スコープ、セキュリティ、および見落としている重複に関するフィードバックを歓迎します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/draft-proposal-stealth-name-resolution-stealth-meta-address-names-across-asynchronous-chains/28787)
