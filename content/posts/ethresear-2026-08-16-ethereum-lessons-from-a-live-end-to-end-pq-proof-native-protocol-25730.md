---
title: ライブなエンドツーエンドのポスト量子プルーフネイティブプロトコルから得られたイーサリアムの教訓
original_title: Ethereum lessons from a live end-to-end PQ proof-native protocol
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/ethereum-lessons-from-a-live-end-to-end-pq-proof-native-protocol/25730
author: ignotusnemo
date: '2026-08-16'
category: Architecture
tags:
  - architecture
  - post-quantum
  - cryptography
  - proof-of-work
  - scaling
  - protocol-design
  - research
  - state-management
  - security
topic_id: '25730'
translated_at: '2026-08-17'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Ethereum lessons from a live end-to-end PQ proof-native protocol](https://ethresear.ch/t/ethereum-lessons-from-a-live-end-to-end-pq-proof-native-protocol/25730) — ignotusnemo (2026-08-16)

エンドツーエンドの[[glossary/Post-Quantum|ポスト量子]]ブロックチェーンスタックが最終的にどのようなものになるべきかについて、ここでは多くの議論があります。

私はゼロベースのアプローチを取り、それを構築し、公開[[glossary/testnet|テストネット]]としてローンチしました。私の古いラップトップでも、フルノードがネットワークを独立して検証し、ブロックを生成できます。

![gui](https://ethresear.ch/uploads/default/optimized/3X/b/2/b2839282f704bf484475bcccf776b4e94b4fd100_2_689x456.jpeg "GUI")

[Parano1dプロトコル](https://github.com/ignotusnemo/parano1d)は、[[glossary/PoW-network|プルーフ・オブ・ワーク]]によって順序付けられたプルーフネイティブな[[glossary/Layer-1|L1]]です。ウォレット認証、状態遷移、およびジェネシスからの再帰的有効性はすべて、単一の[[glossary/Post-Quantum|ポスト量子]]証明スタックによって実行されます。以下に記述する明示的な前提の下で、そのセキュリティ定理は、NIST PQC カテゴリ1のリソースエンベロープに対するジェネシスからのエンドツーエンドの[[glossary/Post-Quantum|ポスト量子]]健全性を確立します。

ソースは公開されており、現在の[v2.0.1リリース](https://github.com/ignotusnemo/parano1d/releases/tag/v2.0.1)には、Linux、Windows、macOS用のGUIおよびコアバイナリが含まれています。

## ここでいう「プルーフネイティブ」とは

Parano1dブロックは、すべてのフルノードがリプレイしなければならない実行リクエストではありません。

ウォレットは、入力オーナーアドレスの256ビットの原像を知っていることを示す、新しくランダム化された[[glossary/Zero-Knowledge-Proof|ゼロ知識証明]]を生成します。この証明は、完全な論理トランザクションにバインドされています。証明は支出シークレットを明らかにせず、公開鍵、デジタル署名、またはステートパスを含みません。

次に、マイナーが公開部分を証明します。すべての入力が存在し、すべての出力スロットが空であり、値と手数料がバランスし、新しい[[glossary/State-Root|ステートルート]]が正確な結果であることを証明します。結果として得られる再帰的証明は、前のブロックによって運ばれた証明も検証し、ジェネシスから新しいブロックまでの有効な状態遷移の証明済みチェーンを拡張します。

ノードは証明を検証し、証明されたスロット書き込みを具体化します。同じ遷移を発見するためにトランザクションロジックを独立して再実行することはありません。

ブロックが最近の18ブロック再編成ウィンドウを離れると、アクティブなコンセンサスがそれを必要としなくなるため、ノードはそのフルボディをプルーニングします。永続的なコンパクトヘッダーはトランザクションルートを保持します。保存された支払いレシートには、トランザクションの概要とそのルートへの[[glossary/Merkle-proof|マークルパス]]が含まれているため、元のブロックボディが削除された後も、カノニカルチェーンへの支払いのインクルージョンは独立して検証可能です。

したがって、新しいノードは、その再帰的ターミナルでファイナライズされた状態を認証し、選択されたライブチップで後続のターミナルを検証できます。ジェネシスからトランザクション実行をリプレイしたり、チェックポイントを信頼したりする必要はありません。

これは、状態有効性検証においてチェーンの高さに対して`O(1)`であり、総ブートストラップデータに対して`O(1)`ではありません。状態転送は依然としてライブUTXOセットとともにスケールし、累積作業[[glossary/fork|フォーク]]選択のためには永続的なコンパクトヘッダーが必要不可欠です。

## 証明スタック

コミットされたトレース算術は`GF(2^128)`を使用し、フィアット・シャミールチャレンジと再帰認証は`GF(2^256)`を使用します。[[glossary/Poseidon2b|Poseidon2b]]は、アドレス、トランザクション、[[glossary/Merkle-Patricia-Trie|マークルツリー]]、状態コミットメント、トランスクリプト、ブロック識別子、および[[glossary/PoW-network|PoW]]の共通のパーミュテーションです。

プロダクションパーミュテーションは幅4、`x^7`、8回のフルラウンド、58回のパーシャルラウンドです。

証明パイプラインは、[[glossary/trusted-setup|トラステッドセットアップ]]なしで[[glossary/GKR|GKR]]、バッチ化されたSumcheck、Zerocheck、Lincheck、およびFRI-Binius/BaseFoldを組み合わせます。私は、[[glossary/Poseidon2b|Poseidon2b]]と[[glossary/Merkle-Patricia-Trie|マークル]]ワークロードのためにFROST-GKRと呼ばれるグローバルトレース削減を開発しました。

59個の幅4の[[glossary/Poseidon2b|Poseidon2b]]パーミュテーションをカバーする同等比較ベンチマークにおいて、FROST-GKRは中央値のプルーバー時間を10.69倍、プロトコル検証者時間を14.80倍、生の代数証明バイトを51.67倍削減しました。ベンチマーク、リファレンス実装、および測定記録は[こちら](https://github.com/ignotusnemo/parano1d/tree/main/research/frost_gkr)で公開されています。

二進体フィールドは、x86 PCLMUL/VPCLMULおよびARM PMULLがキャリーレス乗算を直接高速化するため、コモディティCPUによく適合することが判明しました。リリースされたバイナリは、実行時に適切なバックエンドを選択します。

現在の分離された生産測定値は以下の通りです。

| ホスト                               | クラス | HistoryStep構築 | ターミナル |
| :----------------------------------- | :----- | :-------------- | :--------- |
| 低コストAVX2ラップトップ、12スレッド | B25    | 10.734秒        | 971,732 B  |
| AVX-512 PC、24スレッド               | B25    | 6.905秒         | 971,732 B  |
| 低コストAVX2ラップトップ、12スレッド | B255   | 34.938秒        | 1,081,108 B |
| AVX-512 PC、24スレッド               | B255   | 21.053秒        | 1,081,108 B |

公開[[glossary/testnet|テストネット]]は、証明構築、ナンス検索、伝播を含む完全な20秒のブロック間隔を目標としています。B25はラップトップクラスの生産フロアであり、B255はホストがそれを維持できる場合にのみ選択されます。完全なベンチマーク手法は[こちら](https://github.com/ignotusnemo/parano1d/blob/57d4df765b483a14136d198992931d23d9173092/docs/reference/performance.md)に文書化されています。

## セキュリティの主張、正確に

プロダクションプロファイルは、証明可能なBlock–Tiwari FS-FRIセキュリティの127ビットと、推測されるRBR前提の下での127ビットのセキュリティを持ちます。エンドツーエンドのセキュリティゲームは、ステートフルな量子敵対者が、再帰的祖先がジェネシスから始まる無効なターミナル状態を検証者に受け入れさせることができるかどうかを問います。

この削減は、ウォレット認証、ブロック関係、親リンク、正確な状態遷移、および再帰的検証を単一の敵対的リソースバジェットの下でカバーします。

結果として得られるカテゴリ1のステートメントは、明示的に述べられた固定[[glossary/Poseidon2b|Poseidon2b]]デルタと首尾一貫した応答コスト前提に条件付けられています。これはNIST認証または外部監査の主張ではありません。完全な定理、有限項、および実行可能な厳密算術証明書は[noid_soundness](https://github.com/ignotusnemo/parano1d/tree/main/noid_soundness)にあります。

[ePrint 2026/306](https://eprint.iacr.org/2026/306)における最近の代数攻撃は分析に含まれています。広範なテンソル行列攻撃は、幅4のプロダクションインスタンスには適用されません。適用可能な付録Aのフィードフォワード圧縮ケースは直接インスタンス化されています。論文が確立していないこと、すなわち固定パーミュテーション量子デルタは、「128ビット」という略記の背後に隠されるのではなく、明示的な前提として残っています。

この境界線について、特に独立したレビューを歓迎します。

## イーサリアムにとって有用な可能性のあること

イーサリアムはすでに、[[glossary/leanxmss|leanXMSS]]、[[glossary/leanVM|leanVM]]、再帰的集約、および[[glossary/Post-Quantum|ポスト量子]][[glossary/devnet|開発ネットワーク]]に関する真剣な実装作業を行っています。[[glossary/Ethereum-validator|バリデータ]]レジストリの設計[https://ethresear.ch/t/exploring-the-design-space-for-a-post-quantum-public-key-registry-for-ethereum-validators/25040](https://ethresear.ch/t/exploring-the-design-space-for-a-post-quantum-public-key-registry-for-ethereum-validators/25040)も、ハッシュ選択、集約、およびネットワーク帯域幅がいかに密接に相互作用するかを明確に示しています。

Parano1dプロトコルは、いくつかのより広範な結論を示唆しています。

第一に、[[glossary/Post-Quantum|ポスト量子]]セキュリティはエンドツーエンドのシステムプロパティであり、署名の代替ではありません。ウォレット認証、再帰的証明、コミットメント、[[glossary/fork|フォーク]]選択、および移行の仮定は、**一つのパス**として評価されなければなりません。

第二に、ハッシュ関数はアーキテクチャ上の決定です。それはトレースジオメトリ、再帰コスト、[[glossary/Merkle-Patricia-Trie|マークル]]パフォーマンス、証明サイズ、およびネットワーク動作を決定します。暗号解析はパフォーマンスエンジニアリングから切り離すことはできません。

第三に、再帰的有効性は状態と履歴の関係を変えます。受け入れられた状態がジェネシスからのパスの証明を運ぶようになると、履歴実行はすべての新しいノードのハードウェア要件の一部ではなくなります。

Parano1dプロトコルは[[glossary/EVM|EVM]]の代替ではありません。意図的に制約されたUTXOモデルを使用しています。しかし、それは提案されたスタックではなく、完全に動作する成果物です。

ソース: [https://github.com/ignotusnemo/parano1d](https://github.com/ignotusnemo/parano1d)
リリース: [https://github.com/ignotusnemo/parano1d/releases/tag/v2.0.1](https://github.com/ignotusnemo/parano1d/releases/tag/v2.0.1)
ドキュメント: [https://docs.parano1d.org](https://docs.parano1d.org)
研究: [https://lab.parano1d.org](https://lab.parano1d.org)

特に、ジェネシスからのセキュリティ削減、固定[[glossary/Poseidon2b|Poseidon2b]]境界、FROST-GKR、および再帰的証明伝播のネットワークへの影響に関する技術的批判に興味があります。

*4件の投稿 - 2人の参加者*

[トピック全文を読む](https://ethresear.ch/t/ethereum-lessons-from-a-live-end-to-end-pq-proof-native-protocol/25730)
