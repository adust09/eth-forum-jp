---
title: 'ERCのアイデア: VoiddeedsによるNFT制御型アプリケーションスペース'
original_title: 'ERC idea: NFT Controlled Application Spaces from Voiddeeds'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-idea-nft-controlled-application-spaces-from-voiddeeds/30258
author: 0xddneto
date: '2026-11-03'
category: ERCs
tags:
  - ercs
  - applications
  - protocol-design
  - eip
  - economics
  - execution-layer
  - nft
  - voiddeeds
topic_id: '30258'
translated_at: '2026-11-03'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC idea: NFT Controlled Application Spaces from Voiddeeds](https://ethereum-magicians.org/t/erc-idea-nft-controlled-application-spaces-from-voiddeeds/30258) — 0xddneto (2026-11-03)

私はVoiddeedsを構築しています。これは、[[glossary/NFT|NFT]]がブロックチェーン上の論理的なアプリケーションスペース (logical application space) の制御を表すプロトコルです。[[glossary/testnet|テストネット]]は[https://voiddeeds.xyz](https://voiddeeds.xyz)で稼働しています。これらのスペースに関するインターフェースが[[glossary/ERC|ERC]]として有用か、あるいは既存の作業の拡張としてより適しているかについて議論したいと思います。

[[glossary/NFT|NFT]]の保有者は、スペースの通行料と支払い受取人を制御します。ビルダーは、そのスペースに独立したアプリケーションを公開でき、ユーザーは[[glossary/Runtime|ランタイム]]を通じてそれらと対話します。ここでのスペースは、コントラクトによって定義される実行ドメイン (execution domain) および経済ドメイン (economic domain) です。保有者に[[glossary/Ethereum-validator|バリデータ]]、ブロック生成 (block production)、またはブロックチェーンのグローバルストレージ (global storage) の制御を与えるものではありません。

スペースの所有者、アプリのパブリッシャー、およびユーザーは異なる役割を持っています。Deedを所有することで、スペースの経済設定 (economic settings) を構成できます。これは、ビルダーのアプリケーションコード、管理権限 (admin permissions)、トークンアローワンス (token allowances)、または資産に対する制御を自動的に与えるものではありません。パブリッシャーは引き続きアプリに責任を持ち、その登録を削除できます。

現在の実装では、[[glossary/Ethereum-Sepolia|Sepolia (テストネット)]]上の[[glossary/ERC-721|ERC-721]]コレクションを使用しており、[[glossary/ERC-2981|ERC-2981]]のリセールロイヤリティ (resale royalties) 情報が含まれています。[[glossary/Sepolia|Sepolia]]、Robinhood Testnet、Base Sepolia、Ink Sepolia、Arc Testnet、およびApeChain Curtis Testnetをサポートしています。各Deedは、必要に応じて各ネットワーク上に個別の[[glossary/Runtime|ランタイム]]を取得します。複数のアプリが同じ実装を使用する場合でも、公開された各アプリは独自の[[glossary/Gateway|ゲートウェイ]]とストレージを取得します。

操作のために、ユーザーは[[glossary/Gateway|ゲートウェイ]]、[[glossary/calldata|コールデータ]]、構成リビジョン (configuration revision)、最大通行料、アプリケーション値、[[glossary/gas|ガス]]予算、および期限を提出します。[[glossary/Runtime|ランタイム]]は通行料を再度見積もり、その金額とアプリケーション値の正確な合計を要求します。ネットワーク[[glossary/gas|ガス]]は別です。アプリが失敗した場合、操作と通行料はリバートしますが、[[glossary/gas|ガス]]は消費されます。

現在の通行料は0 [[glossary/USD|USD]]から2 [[glossary/USD|USD]]の範囲で、ネットワークのネイティブアセットで決済されます。所有者への割り当ては90パーセント、トレジャリーへの割り当ては10パーセントです。所有者は、その割り当てを最大10人の受取人に分配できます。受取人が支払いを拒否した場合、その金額はトレジャリーに送られ、イベントとして記録されます。トレジャリーへの支払いが失敗した場合、操作全体がリバートします。コレクションサイズ、ミント価格、通行料上限、およびパーセンテージ分割は、この実装の選択です。これらすべてが一般的な標準の要件となる必要はありません。

[[glossary/NFT|NFT]]を転送すると、カノニカルな所有者が変更され、構成リビジョン (configuration revision) が増加し、以前の所有者のカスタム受取人がクリアされます。別のネットワークでは、新しい[[glossary/snapshot|スナップショット]]がアクティブ化されるまで、最後にアクティブ化された所有者と設定が有効なままです。現在のクロスネットワークメカニズムは、[[glossary/testnet|テストネット]]の[[glossary/attestor|アテスター (attestor)]]を信頼しています。非安定的な価格参照も[[glossary/Operator|オペレーター]]によって維持されます。このリリースは[[glossary/trustless-bridge|トラストレスなブリッジ]]でも、[[glossary/mainnet|メインネット]]の準備状況 (mainnet readiness) の主張でもなく、独立したセキュリティ監査を主張するものでもありません。

私が標準化したいのは、クライアントが[[glossary/Runtime|ランタイム]]アドレスを知った後に必要とする情報です。クライアントは、制御する[[glossary/NFT|NFT]]を識別し、有効な所有者と構成リビジョン (configuration revision) を読み取り、登録されたアプリとそのパブリッシャーを見つけ、通行料を見積もり、明示的な制限付きで操作を実行できるべきです。同じインターフェースは、[[glossary/NFT|NFT]]転送後に何が変更され、どの支払いが実際に受取人に届いたかを明確にするべきです。

私は「NFT Controlled Application Spaces」という作業名を使用してきました。最初のバージョンは単一チェーンに焦点を当てます。クロスチェーンのアクティベーションは、独自の検証および鮮度ルールを持つ別の拡張機能となる可能性があります。提案されたIDおよび構成ゲッターは、将来の実装を必要とします。現在の不変のデプロイメントは、実装されていない新しいインターフェースに準拠していると見なすべきではありません。

[[glossary/ERC-6551|ERC-6551]]は、[[glossary/NFT|NFT]]にバインドされたアカウントを定義するため、関連性があります。ここでは、独立したユーザーが、スペースの経済ポリシーの下でビルダーによって公開されたアプリを実行します。[[glossary/ERC-7656|ERC-7656]]は、サービスを[[glossary/NFT|NFT]]にリンクするための最も近い先行例です。これが別のデプロイメント標準 (deployment standard) ではなく、それらのサービスのための実行および支払いインターフェースであるべきかについてフィードバックをいただきたいです。[[glossary/ERC-7579|ERC-7579]]と[[glossary/ERC-6900|ERC-6900]]も、実行とパーミッションに関する有用な参照です。[[glossary/ERC-2981|ERC-2981]]はリセールロイヤリティ (resale royalties) をカバーしており、これらはこれらの通行料とは別です。

また、[[glossary/Creator-Fee-Rights|クリエイターフィー権]]の議論も確認しました。これはフィー・ストリーム (fee streams) と受取人権限 (recipient authority) をカバーしています。私が定義しようとしている部分には、アプリの公開、実行コンテキスト (execution context)、およびバウンドされた通行料支払い (bounded toll payments) も含まれるため、重複がどこで終わるかについてのご意見をいただければ幸いです。

これは、[[glossary/ERC-7656|ERC-7656]]で構築された特定のサービスを超えた[[glossary/interoperability-problem|相互運用性の問題]]を解決するでしょうか？[[glossary/NFT|NFT]]のID、見積もり、実行のみをカバーするより小さなインターフェースの方が有用でしょうか？公開ルールと支払いルール (payout rules) は別々の拡張機能であるべきでしょうか？また、アプリのカストディ (app custody) とパブリッシャーの権限 (publisher authority) が同時に転送されることを示唆せずに、経済的制御の転送をどのように記述すべきかについてもフィードバックをいただきたいです。

実装とその現在の制限については、こちらで説明されています。

![Voiddeedsのジェネシスコレクションアート](https://voiddeeds.xyz/collection/genesis/art.png) [Voiddeeds](https://voiddeeds.xyz/docs/whitepaper)

![Voiddeedsのジェネシスコレクションアート](https://voiddeeds.xyz/collection/genesis/art.png)

### [Voiddeeds — あなたのスペース。次に何が来るか。](https://voiddeeds.xyz/docs/whitepaper)

Deedを所有する。独立したアプリケーションを構築する。ネットワークをまたいでネイティブな支払いを受け取る。

![Voiddeedsのジェネシスコレクションアート](https://voiddeeds.xyz/collection/genesis/art.png) [Voiddeeds](https://voiddeeds.xyz/contracts)

![Voiddeedsのジェネシスコレクションアート](https://voiddeeds.xyz/collection/genesis/art.png)

### [Voiddeeds — あなたのスペース。次に何が来るか。](https://voiddeeds.xyz/contracts)

Deedを所有する。独立したアプリケーションを構築する。ネットワークをまたいでネイティブな支払いを受け取る。

[https://voiddeeds.xyz/api/release](https://voiddeeds.xyz/api/release)

[[glossary/Sepolia|Sepolia]]ファクトリーの検証済みソースには、[[glossary/Runtime|ランタイム]]と[[glossary/Gateway|ゲートウェイ]]が含まれています。

![Sourcifyのファビコン](https://repo.sourcify.dev/favicon.ico) [repo.sourcify.dev](https://repo.sourcify.dev/11155111/0x29e8a0cc039aa18e091d9b3e98a1ff846f996eed)

![SourcifyのOpenGraph画像](https://repo.sourcify.dev/11155111/0x29e8a0cc039aa18e091d9b3e98a1ff846f996eed/opengraph-image?756306722504cec4)

### [repo.sourcify.dev](https://repo.sourcify.dev/11155111/0x29e8a0cc039aa18e091d9b3e98a1ff846f996eed)

Sourcifyから検証済みスマートコントラクトの詳細、ABI、ソースコード、バイトコードを表示

関連する作業:

[Ethereum Improvement Proposals](https://ercs.ethereum.org/ERCS/erc-6551)

### [非代替性トークンバウンドアカウント | Ethereum Improvement Proposals](https://ercs.ethereum.org/ERCS/erc-6551)

[[glossary/EIP|EIP（Ethereum 改善提案）]]は、コアプロトコル仕様、クライアントAPI、コントラクト標準など、Ethereumプラットフォームの標準を記述します。

[Ethereum Improvement Proposals](https://ercs.ethereum.org/ERCS/erc-7656)

### [一般化されたコントラクトリンク型サービス | Ethereum Improvement Proposals](https://ercs.ethereum.org/ERCS/erc-7656)

[[glossary/EIP|EIP（Ethereum 改善提案）]]は、コアプロトコル仕様、クライアントAPI、コントラクト標準など、Ethereumプラットフォームの標準を記述します。

![priors-agentsのアバター](https://ethereum-magicians.org/user_avatar/ethereum-magicians.org/priors-agents/48/19056_2.png)

[[glossary/ERC-8459|ERC-8459]]: [[glossary/Creator-Fee-Rights|クリエイターフィー権]] [ERCs](https://ethereum-magicians.org/c/ercs/57)

> 各トークンローンチは[[glossary/Creator-Fee-Stream|クリエイターフィー・ストリーム]]を生成し、各ローンチパッドはそれを異なる方法でモデル化します。このドラフトは、ローンチされたトークンの[[glossary/Creator-Fee-Stream|クリエイターフィー・ストリーム]]に対する1つのインターフェースです。これには、誰がそれを受け取るか (feeRecipient)、ローンチ以来どれだけ稼いだか (accruedTotal)、請求可能な金額、誰でもトリガーできる常に受取人に支払われる請求、そして現在の受取人のみが変更できる受取人 (ERC-173のルールがトークンごとに適用される) が含まれます。管理者、アップグレード、またはローンチパッドの設定によって、ローンチされたトークンの受取人をリダイレクトすることはできません…

標準化の[[glossary/PR|PR]]をオープンする前に、技術的なフィードバックと、見落としている重複する提案がないかを探しています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-idea-nft-controlled-application-spaces-from-voiddeeds/30258)
