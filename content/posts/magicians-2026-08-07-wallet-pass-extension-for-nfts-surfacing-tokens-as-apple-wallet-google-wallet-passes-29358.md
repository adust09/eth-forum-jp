---
title: NFT向けウォレットパス拡張機能：トークンをApple Wallet / Google Walletパスとして表示する
original_title: >-
  Wallet Pass Extension for NFTs: surfacing tokens as Apple Wallet / Google
  Wallet passes
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/wallet-pass-extension-for-nfts-surfacing-tokens-as-apple-wallet-google-wallet-passes/29358
author: huntclubhero
date: '2026-08-07'
category: ERCs
tags:
  - ercs
  - applications
  - ux
  - eip
  - smart-contracts
  - identity
  - tokenomics
  - security
  - mobile
  - research
topic_id: '29358'
translated_at: '2026-08-08'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Wallet Pass Extension for NFTs: surfacing tokens as Apple Wallet / Google Wallet passes](https://ethereum-magicians.org/t/wallet-pass-extension-for-nfts-surfacing-tokens-as-apple-wallet-google-wallet-passes/29358) — huntclubhero (2026-08-07)

皆さん、こんにちは。初めての投稿なので、お手柔らかにお願いします。

まず自己紹介をさせてください。私はプロダクトデザイナー兼ビルダーで、2021年から[[glossary/NFT|NFT]]に参加しています。

[[glossary/NFT|NFT]]のより良い道を追い求める中で、私は[[glossary/NFT|NFT]]が常にこうあるべきだと考えています。それは、人々が毎日すでに使っているインターフェース上で生き生きと存在し、暗号ウォレットやシードフレーズの裏に閉じ込められるべきではない、と。

私がたどり着いたインターフェースは、すべてのスマートフォンに搭載されているウォレットアプリです。Apple WalletとGoogle Walletは世界最大のプログラマブルなインターフェースであり、このエコシステムはほとんどそれらに触れていません。

そこで、私は開発を進めてきました。トークンがウォレットパスそのものである[[glossary/ERC-721|ERC-721]]です。カード上に直接レンダリングされるライブ状態、実際のオンチェーン取引をトリガーするパス上のリンク、チェーンの状態が変化した際のプッシュ通知。アプリのダウンロードは不要で、シードフレーズもありません。メールアドレスでオンボーディングできます。数日前から公開[[glossary/testnet|テストネット]]で稼働しており、これまで暗号に触れたことのない人々が、Apple Walletからオンチェーン資産を操作しているのに、その下にブロックチェーンがあることに全く気づいていないのを見るのは、正直なところ、私がこれまでリリースした中で最もクールなことです。

これは単一のプロジェクトよりも大きなものだと考えています。トークン化された実世界資産、金庫に保管された鑑定済みのワンピースカード、トークン化された株式、デジタルアート、政府発行の身分証明書、ロイヤリティ残高など、オンチェーンの状態を持つあらゆるものが、このインターフェース上に居場所を求めています。チェーンは目に見えない配管であり、パスはUIであるべきです。一般の人々にとって、AppleとGoogle Walletは、オンチェーン資産が得られる最高の未開拓の領域となる可能性があり、現在、私たちのエコシステムはそれを後回しにしています。

私が投稿している理由はここにあります。何かを書く前に、このフォーラムと[[glossary/ERC|ERC]]リポジトリで先行技術を検索しましたが、何も見つかりませんでした。pkpassも、パス配信も、モバイルウォレットパスも全くありませんでした。最も近いものは、クローズドなAPIサービスであるEthPass（Unlock Protocolが会員パスに使用していました）でしたが、サービスは標準ではありません。そのため、現在、トークンをパスにバインドする（チケット、会員権、ロイヤリティ、私自身も）すべてのチームが独自のプライベートブリッジを考案しており、それには3つの実際のコストがかかります。

1.  ウォレット、マーケットプレイス、インデクサーは、トークンがパスを持っていることすら発見する方法がありません。発行者のサイトにアクセスしない限り、その機能全体が目に見えません。
2.  「このトークンのパスコンテンツは古くなっているため、再プッシュする」という共有シグナルがありません。
3.  誰もが同じセキュリティの教訓を一人で学び直しています。私は苦い経験をしました。パスは無記名ファイルです。誰かが.pkpassファイルを転送して別の電話に追加することができ、初期のビルドではアクションリンクがトークンのシリアルから導出可能だったため、共有パスを持っている人なら誰でも所有者として行動できてしまいました。この問題を解決したのは、転送時にローテーションする推測不可能なケイパビリティURLでした。標準はその傷跡を組み込むべきであり、次のビルダーが同じ脆弱性を出荷しないようにすべきです。

私が実際に標準化可能だと考えているのは、この部分です。意図的に非常に小さく、基本的にtokenURIの兄弟のようなものです。

```
interface IERC721WalletPass {
    event PassUpdate(uint256 indexed tokenId);
    event BatchPassUpdate(uint256 fromTokenId, uint256 toTokenId);

    /// Returns a URI resolving to a JSON pass manifest for the token
    function passURI(uint256 tokenId) external view returns (string memory);
}
```

そして、それが指すマニフェストは次のとおりです。

```
{
  "formats": {
    "apple": "https://issuer.example/passes/c3f1.../card.pkpass",
    "google": "https://pay.google.com/gp/v/save/eyJhbGciOi..."
  },
  "updatedAt": 1754500000
}
```

さらに、セキュリティが実際に存在する規範的なルールとして、取得URLは推測不可能なケイパビリティURLであるべき（インストールされたパスが状態変更アクションリンクを公開する場合は必須）、転送時にローテーションすべき、パスを保持していることがトークンを所有していることと見なされてはならない、パスから到達可能なアクションは個別に承認されなければならない、とします。パス生成自体（Apple証明書、APNs、Google Wallet API、アートワーク）は意図的にスコープ外とします。それはプラットフォームの配管であり、相互運用可能な接点は発見（discovery）です。

心から異論を唱えてほしい点です。

1.  フェッチされた1つのJSONマニフェストとフォーマットクエリパラメータのどちらが良いか。マーケットプレイスがトークンのパスオプションに関するすべてを1つのリクエストで学習できるようにしたいのですが、交渉を好む理由を見落としているでしょうか？
2.  専用のPassUpdateイベントと、[[glossary/ERC-4906|ERC-4906]]のMetadataUpdateを再利用するのとどちらが良いか。パスコンテンツはメタデータよりもはるかに頻繁に変化します（カウントダウン、残高など）。そして、そのコンシューマーは（[[glossary/NFT|NFT]]インデクサーではなく）パス配布者です。この独立したイベントはそれだけの価値があるでしょうか？
3.  [[glossary/ERC-1155|ERC-1155]]とファンジブルトークンはスコープ外としました。なぜなら、マルチホルダーセマンティクスはパスが人に紐づく方法を変えるからです。しかし、このインターフェースが将来的に[[glossary/RWA-platforms|RWA（リアルワールドアセット）]]やトークン化された株式を扱うのであれば、将来の拡張でそれらをカバーする必要があります。721のみで始めるのは正しい判断でしょうか、それとも怠慢な判断でしょうか？
4.  ケイパビリティURLのルールは適切な強度で提案されているでしょうか？
5.  ウォレットやマーケットプレイスを構築している方へ：もしこれが存在したら、準拠トークンに「Apple Walletに追加 / Google Walletに保存」ボタンを実際に表示しますか？それが全体の報酬だからです。

私は[[glossary/EIP|EIP]]-1形式の完全な[[glossary/Draft|ドラフト]]をethereum/ERCsにPRする準備ができており、その背後には動作する実装があります（現在はクローズドソースですが、この提案が[[glossary/Draft|ドラフト]]段階を通過する前にオープンなリファレンス実装をリリースする予定です）。私は普段インターフェースを書く人間ではないので、公式にする前にこのコミュニティにその形状を圧力テストしてほしいです。徹底的に批判してください。

私のこの提案への希望はシンプルです。次の波の人々に、彼らのポケットにあるウォレットから始めて、ブロックチェーンの複雑さなしにブロックチェーンの基盤を提供することです。

読んでいただきありがとうございます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/wallet-pass-extension-for-nfts-surfacing-tokens-as-apple-wallet-google-wallet-passes/29358)
