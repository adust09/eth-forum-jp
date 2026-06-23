---
title: LSH/MinHashを活用した分散型NFTマーケットプレイスの実現
original_title: Using LSH/minHash to enable decentralized nft marketplaces
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/using-lsh-minhash-to-enable-decentralized-nft-marketplaces/28839
author: Joe-mcgee
date: '2026-06-22'
category: Uncategorized
tags:
  - nft
  - marketplaces
  - decentralization
  - smart-contracts
  - economics
  - applications
  - research
  - cryptography
topic_id: '28839'
translated_at: '2026-06-23'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Using LSH/minHash to enable decentralized nft marketplaces](https://ethereum-magicians.org/t/using-lsh-minhash-to-enable-decentralized-nft-marketplaces/28839) — Joe-mcgee (2026-06-22)

こんにちは！

分散型NFTマーケットプレイスを実現する方法について調査してきました。現在、ほとんどすべてのNFTマーケットプレイスは中央集権型であり、変更可能なオフチェーンメタデータ上での取引を容易にするためにオフチェーンのオーダーブックを使用しています。私が検討してきたアイデアは、[[locality-sensitive-hashing|局所性鋭敏型ハッシュ (Locality Sensitive Hashing)]] (LSH) / [[minhash|MinHash]] を活用することです。NFTのすべての特性を「key:value」ペアとしてMinHash化することで、NFTとオンチェーンでの入札との間の[[jaccard-similarity|ジャッカード類似度]]を計算できます。

例えるなら、MinHashはNFTの低解像度画像のようなものです。これは、すべての「key:value」特性をステージに配置し、スナップショットを撮ることで作成されます。入札者は、希望する特性をステージに配置し、そのスナップショットを撮ることができます。これで、2つの低解像度画像を比較し、それらが同じである確率を導き出すことができます。入札者は許容度/信頼度の閾値を設定でき、十分な類似性があれば[[smart-contracts|スマートコントラクト]]がスワップを許可します。

このアプローチは、MinHashの具体的な構築方法に関するルールと期待値を定義する標準として位置づけられるべきだと考えます。なぜなら、同じスキーマに準拠するNFTミントが増えれば、それらの市場は互いに流動性が高まるからです。これは、すべてのポケモンカードガチャゲームを見れば明らかです。

[Semi-Fungible Trading Onchain | Jaccard Swap](https://jaccard-swap.github.io/docs/) は参照実装を提供しており、[GitHub - jaccard-swap/relic-safari · GitHub](https://github.com/jaccard-swap/relic-safari) は、ユーザーが[[intent-layer|インテント]]全体でジャッカードの力を実感できるように、これをプレイ可能なゲームにしようとしています。

これは重要だと考えます。なぜなら、[[RWA-platforms|RWA（Real World Asset）プラットフォーム]]は、それぞれが独自のマーケットプレイスを垂直統合しようとするため、Netflixスタイルの[[Coordination-Collapse|コモンズの悲劇]]に苦しむことになるからです。市場の断片化を避けるためには、信頼できる中立的なオンチェーンマーケットプレイスが必要です。また、これを開発する企業から生まれるとは思いません。彼らは「今すぐ買い戻し」機能で大きな利益を得ていますが、ユーザーが他の場所で市場価格を得られるようになると、その利益は消滅するからです。

お時間をいただきありがとうございます！

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/using-lsh-minhash-to-enable-decentralized-nft-marketplaces/28839)
