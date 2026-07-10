---
title: イーサリアム向けシンプルでオープンソースな組み込みウォレットパターン
original_title: 'A Simple, Open Source Embedded Wallet Pattern for Ethereum'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/a-simple-open-source-embedded-wallet-pattern-for-ethereum/28955
author: TtheBC01
date: '2026-07-07'
category: Web
tags:
  - web
  - wallet
  - ux
  - account-abstraction
  - security
  - smart-contracts
  - applications
  - protocol-design
topic_id: '28955'
translated_at: '2026-07-10'
translator: gemini-2.5-flash
---

> [!note] 原文
> [A Simple, Open Source Embedded Wallet Pattern for Ethereum](https://ethereum-magicians.org/t/a-simple-open-source-embedded-wallet-pattern-for-ethereum/28955) — TtheBC01 (2026-07-07)

# イーサリアム向けシンプルでオープンソースな組み込みウォレットパターン

[1Shot](https://1shotapi.com/)チームは、組み込みウォレット (embedded wallets) が特に暗号資産に馴染みのないユーザーのオンボーディング成功に大きな違いをもたらすため、以前から関心を持っていました。PrivyやThirdwebのようなプロプライエタリな組み込みウォレットベンダーは多数存在しますが、これらのソリューションはユーザー層を借りているようなものであり、新しいオンチェーンプロダクトを立ち上げている場合には非常に高価になる可能性があるため、あまり「Web3的」ではありません。さらに、これらはクローズドなエコシステムであり、ソースコードを制御できず、本質的に拡張性がないため、組み込みウォレットがプロダクトのコンポーネントであることを考えると理想的ではありません。また、これらのベンダーの多くが署名ごとに手数料を課すことは言語道断だと感じています。

私たちは、[WebAuthnの擬似乱数関数 (PRF) 拡張に関するW3C提案](https://github.com/w3c/webauthn/wiki/Explainer:-PRF-extension/_history)が2023年に提案されて以来、その動向を追ってきました。現在、主要なすべてのブラウザベンダーとモバイルオペレーティングシステムで広くサポートされています。[PRF拡張](https://github.com/w3c/webauthn/blob/main/explainers/prf-extension.md)を使用すると、ブラウザ内でポータブルなネイティブイーサリアムキーを生成し、デバイス間でアクセスできるようになります。そこで、ネストされたiframeパターンを使用し、WebAuthn PRFに基づいた完全にオープンソースな組み込みウォレットを可能にするエンドツーエンドのテンプレート[リポジトリ](https://github.com/1Shot-API/prf-wallet/tree/develop)をまとめました。これにより、ブラウザ拡張ウォレットと同様に、サードパーティサイトでプロバイダーとしてウォレットを利用できるようになります。

![画像](https://ethereum-magicians.org/uploads/default/optimized/3X/3/4/34650ead8d04ffc9f5ab22d09622050909db3c4e_2_624x417.png)

主に2つのレイヤーがあります。

1.  **署名カーネル (signing kernel)** - これは、低レベル署名ユーティリティの不変な実装です。クレデンシャル作成プロセス (credential creation ceremony) と、ユーザーエージェントによって開始されたペイロードへの署名を処理します。署名カーネルは、`signer.myapp.com`のようなサブドメイン（またはルート）でアプリケーションのドメインから提供されることを意図しており、自身のTLD上の他のサブドメインからのみマウント可能でなければなりません。署名カーネルは、純粋なJavaScriptでブラウザネイティブAPIのみを使用して実装されており、外部依存関係はありません。ユーザーの秘密鍵がこのコンテキストから離れることはありません。このレイヤーは非常に小さいため、[[glossary/EIP|EIP（Ethereum 改善提案）]]-[[glossary/EIP-8244|8244]]で提案されているように、スマートコントラクトから提供することも可能です。
2.  **ブランディング層 (branding layer)** - これはウォレットのポリシー層であり、組み込みウォレットのビジネスロジックを決定し、ユーザーにインタラクティブなコンポーネントを提示する役割を担います。このコンポーネントは署名カーネルiframeをマウントする責任があり、プロダクトやdappが活用したいJSON-RPCメソッドを実装します。プロダクトオーナーによって完全にカスタマイズ可能であり、モジュールを介して完全に拡張可能です。サブドメイン（例: `wallet.myapp.com`）または適切なルートから提供されるべきです。私たちのテンプレート実装は完全なEIP-1193インターフェースを実装しているため、ブランディング層iframeは[ViemやEthersのような標準的なWeb3ライブラリからプロバイダーとして利用され、対話できます](https://github.com/1Shot-API/prf-wallet/blob/develop/examples/host/src/main.ts#L68)。自身のTLDでの利用のために、サードパーティのTLDへのマウントを防止するブランディング層実装を1つ持つことも、外部サイトでの利用に特化したビジネスロジックを持つ2つ目のブランディング層実装を持つことも可能です。

![ows-demo](https://ethereum-magicians.org/uploads/default/original/3X/d/3/d306c44a0b102b950f392284ad18f60146bf862d.gif)

このモデルの利点：

1.  **自由（言論の自由）としての無料**: EIP-1193のようなWeb3標準に準拠した完全にオープンソースな実装で、Privyのようなユーザーエクスペリエンス（はるかに高い柔軟性）が得られます。そのため、ブラウザ拡張機能で動作するすべてのツールがこれでも動作します。リポジトリをフォークし、JSON-RPCメソッドやUIコンポーネントを自由にカスタマイズして、必要なだけ洗練させることができます。
2.  **無料（タダ）としての無料**: WebAuthn PRFのおかげで、ブラウザ内でイーサリアムネイティブキーを持つことができるため、ユーザー操作や月間アクティブユーザー (MAU) の料金を支払う必要がなくなります。
3.  **ポータブル**: ViemやEthersのような標準的なWeb3ライブラリとすぐに連携します。オープン標準のウォレット実装は、ブラウザ拡張ウォレットと同様に、サードパーティアプリから簡単に呼び出すことができます。モバイルブラウザで動作し、ユーザーのデバイス間で追従できます。
4.  **拡張可能**: モジュールを使用すると、ポータブルなユーザーキーにリンクされた検証可能なクレデンシャル提示や、アカウント委任のための[[glossary/EIP|EIP]]-7715のような新しいエージェント指向標準など、カスタマイズ可能な機能を追加できます。
5.  **標準ベース**: このアプローチの暗号化は、標準のW3CブラウザAPIと純粋なJavaScriptに完全に依存しています。subtle cryptoライブラリによって実装されていないsecp256k1（イーサリアムおよびビットコイン）およびed25519（ソラナ）の署名アルゴリズムは、成熟した実装から採用されています。署名カーネルは外部依存関係をインポートしないため、サプライチェーン攻撃から保護されます。

私たちはこれを実際の製品で使用できるプロダクション品質にしたいと考えているため、[イーサリアムキー派生とiframe分離のためのWebAuthn PRFの利用](https://github.com/1Shot-API/prf-wallet/tree/develop/packages/ows-signer/src)と、ポータブルなブランディング層のアーキテクチャ設計の両方に関して、イーサリアムコミュニティからのフィードバックを求めています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/a-simple-open-source-embedded-wallet-pattern-for-ethereum/28955)
