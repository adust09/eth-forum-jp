---
title: >-
  8415Wallet: [[glossary/Asynchronous-Register-Projection-for-NFTs|ERC-8415
  (NFTの非同期レジスタプロジェクション)]]ベースのウォレット、ベータテスト版が利用可能に
original_title: '8415Wallet: an ERC-8415-based wallet, now available for beta testing'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/8415wallet-an-erc-8415-based-wallet-now-available-for-beta-testing/29945
author: MichaelYip
date: '2026-10-11'
category: ERCs
tags:
  - ercs
  - applications
  - ux
  - eip
  - nft
  - research
  - protocol-design
topic_id: '29945'
translated_at: '2026-10-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [8415Wallet: an ERC-8415-based wallet, now available for beta testing](https://ethereum-magicians.org/t/8415wallet-an-erc-8415-based-wallet-now-available-for-beta-testing/29945) — MichaelYip (2026-10-11)

ネイティブな[[glossary/Asynchronous-Register-Projection-for-NFTs|ERC-8415 (NFTの非同期レジスタプロジェクション)]]をサポートし、既存のトークン標準とも連携するウォレット「8415Wallet」のベータ版をリリースしました。

現在もテスト中であり、試用にご興味のある方を歓迎します。V2/V3パッケージ、認証サービス、インストール手順はこちらです。

![](https://github.githubassets.com/favicons/favicon.svg) [GitHub](https://github.com/GiraffeTechnology/8415Wallet/releases/tag/8415wallet-runtime-beta-20261011-265172e0)

![](https://opengraph.githubassets.com/240818749bb3006700348abcfb0ed596ef5fb551268714a89de73d72f10ea953/GiraffeTechnology/8415Wallet/releases/tag/8415wallet-runtime-beta-20261011-265172e0)

### [リリース 8415Wallet V2/V3および認証ランタイム - ベータ ·...](https://github.com/GiraffeTechnology/8415Wallet/releases/tag/8415wallet-runtime-beta-20261011-265172e0)

8415Walletランタイムコンポーネント。V2およびV3静的ウォレットアプリケーションと依存関係が完備された認証サービス向けの機能テスト用ベータパッケージ。ダウンロード 8415wallet-dapp-v2-2.2.0-b...

[[glossary/Asynchronous-Register-Projection-for-NFTs|ERC-8415 (NFTの非同期レジスタプロジェクション)]]のスレッドでは、アプリケーションレベルで何が起こるかについていくつかの質問がありました。具体的には、ウォレットが異なる所有者（owner）とホルダー（holder）の記録をどのように表示するか、登録の遅延が取引（trade）にどう影響するか、そしてトークンをまたがる重複記録が実際に何を意味するのか、といった点です。

[@babyblueviper1](https://ethereum-magicians.org/u/babyblueviper1) [@Anzus\_GemWallet](https://ethereum-magicians.org/u/anzus_gemwallet)

いくつかの実装抜粋と小さな例をこちらに掲載しています。

![](https://github.githubassets.com/favicons/favicon.svg) [github.com](https://github.com/GiraffeTechnology/8415Wallet/tree/main/examples)

### [8415Wallet/examples (mainブランチ) · GiraffeTechnology/8415Wallet](https://github.com/GiraffeTechnology/8415Wallet/tree/main/examples)

[main/examples](https://github.com/GiraffeTechnology/8415Wallet/tree/main/examples)

GitHubアカウントを作成して、GiraffeTechnology/8415Walletの開発に貢献しましょう。

これらはステータス表示、カストディ（custody）とリリース/返金条件、およびクロストークン再利用チェックをカバーしています。これらの例は範囲が限定されており、元のスレッドで議論されたすべてのケースを完全に実装したものではありません。

もし試してみて、不明な点、壊れる点、あるいは異なる動作をすべきだと思う点があれば、ぜひお聞かせください。テスト資産（test assets）のみを使用してください。これはベータ版であり、まだ実際の資金（real funds）を預けるウォレットではありません。

公開されている例は、個人および研究（research）または教育機関（educational institutions）による非営利目的利用（non-commercial use）に提供されています。インストールパッケージは既存の利用規約を保持します。

元の[[glossary/ERC|ERC（Ethereum Request for Comments）]]-8415に関する議論：

![](https://ethereum-magicians.org/user_avatar/ethereum-magicians.org/michaelyip/48/18807_2.png)

[ERC-8415: [[glossary/Asynchronous-Register-Projection-for-NFTs|NFTの非同期レジスタプロジェクション]]](https://ethereum-magicians.org/t/erc-8415-asynchronous-register-projection-for-nfts/29634) [[glossary/ERC|ERC（Ethereum Request for Comments）]]

> 私は「[[glossary/Asynchronous-Register-Projection-for-NFTs|NFTの非同期レジスタプロジェクション]]」というドラフト（draft）に取り組んでおり、議論のために公開したいと考えていました。まだERC番号は割り当てられていません。プルリクエスト（PR）をプッシュする前に、スコープ（scope）とセマンティクス（semantics）を正しく設定したいと考えています。特に、履歴クエリの挙動（historical-query behavior）と、これが既存の標準（existing standards）とどのように（または本当に）重複するのかについて、フィードバックをいただけると幸いです。問題点：[[glossary/ERC-721|ERC-721]]は、外部レジスタが更新されるよりも速く取引（trade）される可能性があります。`ownerOf(tokenId)`は現在トークンを保有している人物を教えてくれますが、その人物が誰であるかは教えてくれません…

*7件の投稿 - 3名の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/8415wallet-an-erc-8415-based-wallet-now-available-for-beta-testing/29945)
