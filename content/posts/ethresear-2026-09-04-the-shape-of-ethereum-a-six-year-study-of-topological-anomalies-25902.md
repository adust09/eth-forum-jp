---
title: イーサリアムの形状：トポロジー的異常の6年間にわたる研究
original_title: 'The Shape of Ethereum: A Six-Year Study of Topological Anomalies'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/the-shape-of-ethereum-a-six-year-study-of-topological-anomalies/25902
author: urihamster
date: '2026-09-04'
category: Data Science
tags:
  - data-science
  - research
  - economics
  - applications
  - smart-contracts
  - protocol-design
  - topological-data-analysis
  - anomaly-detection
topic_id: '25902'
translated_at: '2026-09-05'
translator: gemini-2.5-flash
---

> [!note] 原文
> [The Shape of Ethereum: A Six-Year Study of Topological Anomalies](https://ethresear.ch/t/the-shape-of-ethereum-a-six-year-study-of-topological-anomalies/25902) — urihamster (2026-09-04)

# イーサリアムの形状：トポロジー的異常の6年間にわたる研究

**著者:** Matan Prasma ([@KanExtension](https://ethresear.ch/u/kanextension)), Uri Yacobi Keller ([@urihamster](https://ethresear.ch/u/urihamster))

イーサリアムのトランザクショングラフに毎日「形状」を関連付け、単にボリュームや価格を追跡するだけでなく、その形状が現実世界のショックの前後で認識可能な形で変化するかどうかを調べたらどうなるでしょうか？私たちは6年間のデータを分析して、この問いに答えました。

## アイデアを1段落で

私たちは、代数トポロジーから派生したデータサイエンスでは比較的新しい手法である**トポロジー的データ解析 (Topological Data Analysis, TDA)** を、スマートコントラクト (smart contract) の実行を含むイーサリアムの毎日のトランザクションデータに適用しました。毎日のトランザクションは、以下の4つのレイヤーに分割されます。

1.  **小 / 中 / 大規模なスマートコントラクト (smart contract) コール**
    
2.  **通常のETH (ETH) 送金**
    

各レイヤーのアドレスは、距離スケールごとに1つずつ、幾何学的形状の増大するシーケンスに変換されます。このシーケンスが成長するにつれて、連結成分がマージされ、ループが開閉し、ボイドが出現・消失します。これらの生成と消滅はすべて、**パーシステンスダイアグラム (persistence diagram)** に記録されます。

ある日のダイアグラムと次の日のダイアグラムを（**ワッサースタイン距離 (Wasserstein distance)** を介して）比較すると、レイヤーごと、日ごとに1つの数値が得られます。それは「ネットワークの形状がどれだけ変化したか」です。この数値を6年間追跡し、標準的な時系列異常検出にかけることで、何が明らかになるかを確認します。

完全な数学的処理（ヴィエトリス・リップス構成、パーシステントホモロジー、パーシステンスダイアグラム、そしてワッサースタイン距離がそれらを比較する適切な方法である理由）については、付随する記事に記載されています。私たちの目的は、完成した監視ツールを提供することよりも、トポロジー的レンズが価格とボリュームだけでは明らかにできない何を明らかにできるかを示すことにあります。この投稿には、主要な結果が含まれています。

## 発見事項

このパイプラインを**2020年から2025年**のデータに適用したところ、**86の異常な日**（より正確には、隣接するフラグ付きの日をマージした後の異常クラスター）が検出されました。その後、それぞれの異常の近くにどのような現実世界イベントがあったかを確認したところ、**86件中73件（85%）**が、チェーン内部または外部の現実世界イベントに対応していました。

### 主要な例：

-   **ブラックサーズデー（2020年3月12日）：** `highInput` レイヤー（コールデータが500バイト以上のETH (ETH) ゼロトランザクション）は、この日、年間で最大の単日スパイクを100パーセンタイルで記録しました。これは、単なる価格暴落自体ではなく、実際の障害モード（清算カスケード、負荷に耐えきれなくなったオラクルコントラクト (smart contract)）と一致しています。
    
-   **ロシアによるウクライナ侵攻（2022年2月）：** `medInput` レイヤー（コールデータが100〜499バイトのETH (ETH) ゼロトランザクション）は2日後に発火しました。これは、週末後に市場が再開し、DeFi (DeFi) の再配置がニュースに追いついたときに予想される遅延と正確に一致します。
    
-   **Bybitハッキング（2025年2月）：** `medInput` は翌日に発火しました。これは盗難自体の日（構造的距離指標には見えない単一のトランザクション）ではなく、盗まれた資金がDeFi (DeFi) ブリッジやミキサーを通じて拡散し始めた翌日です。
    

### 構造的変化点とレイヤーの回転

-   **教師なし変化点検出：** 価格やニュースに関する知識なしに、4層シグナルの形状のみで、教師なし検出は6年間の記録に**6つの構造的変化点**を発見しました。これらはすべて、特定可能な触媒（例：DeFi (DeFi) サマーの終わり、The Merge、BlackRockのETF (ETF) 申請）から2週間以内に発生しています。
    
-   **時間経過に伴うレイヤーの回転：** 2024年には、`nonFactory` レイヤー（ガバナンス、ERC-20 (ERC-20) 送金、カストディフロー）が16件のフラグ付きイベントのうち11件を牽引しましたが、単純なETH (ETH) 送金はほとんど記録されませんでした。2025年には、これがほぼ逆転し、通常の送金が最も活発な異常源となり、複雑なコントラクト (smart contract) コールは静かになりました。イーサリアムを誰がどのように利用しているかについて、標準的な価格チャートでは見えない根本的な変化がこの2年間で起こったのです。
    

[![全レイヤーのチャート](https://ethresear.ch/uploads/default/optimized/3X/9/b/9b6de23655d5c09b0353711be8db78fca41f2ae0_2_690x283.png)](https://ethresear.ch/uploads/default/original/3X/9/b/9b6de23655d5c09b0353711be8db78fca41f2ae0.png "全レイヤーのチャート")

*（全レイヤーのS-ESDスコアオーバーレイ、2020年～2025年）*

## 異常を超えて：ボラティリティ予測の展望

同じパイプラインは、オンチェーントポロジーを市場予測に活用するという、より広範な応用も示唆しています。予備的な実験では、TDAの特徴量が、GARCH (GARCH) （ボラティリティ予測のための既製の標準モデル）ベースラインを含む、標準的な金融機能を超えた7日先のETH (ETH) ボラティリティに対する予測情報を追加しました。この効果は統計的に堅牢であり、時間シャッフルプラセボテストにも耐えました。私たちはこれを、ブロックチェーントポロジーが従来の金融シグナルでは捉えられない市場関連情報を含んでいる可能性を示す、有望な兆候と見ています。この方向性は今後の研究課題とします。

## 事前の注意点

「意味のある、チェーンを変化させる」イベントが何であるかについて、私たちは真の正解 (ground truth) を持っていません。自己評価を行うためのラベル付きデータセットは存在しないのです。私たちが言えるのは、上記のほとんどの一致は、私たちの判断では、もっともらしくチェーンを変化させるものであり、読者の皆様には、イベントの全リストを自分で確認し、ご自身の見解を形成していただきたいと心から願っています。このプロジェクトは、特定の明確なユースケースを主張するよりも、TDAがこの種のデータに対して何ができるかを示すことを目的としています。

## 詳細はこちら

すべての情報はリポジトリにあります。

-   **記事：** 完全な手法（実行例と図解付き）、パイプラインの詳細、変化点テーブル、レイヤーごとの内訳、および次のステップ（クロスチェーン比較、よりきめ細かいホモロジー分割、ライブモニタリング）に関する議論。 [GitHubで完全な記事を読む](https://github.com/Simplex-TDA/ETH-Anomaly-Detection/blob/d7b099788587cd9f9aa258a3a1edceac40c559b9/Article/Shape_of_Ethereum-Full_Article.md) / [PDFをダウンロード](https://github.com/Simplex-TDA/ETH-Anomaly-Detection/blob/d7b099788587cd9f9aa258a3a1edceac40c559b9/Article/Shape_of_Ehereum-Full_Article.pdf)。
    
-   **付録：** 86件すべての異常イベントの完全なリスト（帰属ティア付き）、3つの追加ケーススタディ、および完全なイベントマッチング手法。 [GitHubで付録を読む](https://github.com/Simplex-TDA/ETH-Anomaly-Detection/blob/d7b099788587cd9f9aa258a3a1edceac40c559b9/Article/Shape_of_Ethereum-Appendix.md)。
    
-   **コード：** 生のトランザクションデータからパーシステンスダイアグラム、異常フラグまでの完全なパイプライン： [https://github.com/Simplex-TDA/ETH-Anomaly-Detection](https://github.com/Simplex-TDA/ETH-Anomaly-Detection)。
    
-   **ボラティリティ予測：** ボラティリティ予測の予備結果に関するレポート： [GitHubで完全な結果を見る](https://github.com/Simplex-TDA/ETH-Anomaly-Detection/blob/d7b099788587cd9f9aa258a3a1edceac40c559b9/predictive-validation/REPORT.md)。
    

この手法について、どのマッチしたイベントが説得力があるか否か、そしてこれが最も有用であると思われる分野について、ぜひフィードバックをお寄せください。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/the-shape-of-ethereum-a-six-year-study-of-topological-anomalies/25902)
