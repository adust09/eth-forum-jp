---
title: 'ERC-8283: ERC-7730クリア署名ディスクリプタのためのオンチェーンレジストリ'
original_title: 'ERC-8283: On-Chain Registry for ERC-7730 Clear Signing Descriptors'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8283-on-chain-registry-for-erc-7730-clear-signing-descriptors/28717
author: alex-forshtat-tbk
date: '2026-06-05'
category: ERCs
tags:
  - ercs
  - security
  - ux
  - smart-contracts
  - eip
  - protocol-design
  - decentralization
  - applications
  - identity
topic_id: '28717'
translated_at: '2026-06-06'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8283: On-Chain Registry for ERC-7730 Clear Signing Descriptors](https://ethereum-magicians.org/t/erc-8283-on-chain-registry-for-erc-7730-clear-signing-descriptors/28717) — alex-forshtat-tbk (2026-06-05)

ERC-7730は、長年適切に対処されず、イーサリアム上のスマートコントラクトとやり取りしたことのあるすべての人に多大な金銭的損失とストレスをもたらしてきた、盲目署名（blind signing）の問題についに対応する素晴らしい標準です。

しかし、ERC-7730は、イーサリアムコミュニティがクリア署名（Clear Signing）ディスクリプタのレジストリを許可不要に維持・更新し、これらのディスクリプタの作成者と消費者との間に信頼のネットワークを確立するためのメカニズムを規定しておらず、ディスクリプタデータの長期保存と取得にも対応していません。

決定的に重要なのは、ウォレットエコシステムがクリア署名を必須とし、互換性のあるウォレットでは盲目署名が非推奨またはデフォルトでブロックされる方向に動き始めるにつれて、クリア署名レジストリが、レジストリによって承認されたコントラクトのボトルネックとなるホワイトリストへと進化する重大な脅威があることです。

このERCは、ERC-7730ディスクリプタのクエリ可能なオンチェーンレジストリとして機能する比較的シンプルなスマートコントラクトを規定しており、いかなる当事者もレジストリを維持する必要がありません。レジストリ自体は誰でも書き込むことができ、実際のディスクリプタはHTTPからIPFSまで、あらゆるプロトコルを使用してURIとして提供されます。

ウォレットの信頼は、エントリがレジストリに**存在**するという事実だけではなく、ウォレットが信頼する企業（またはその他のエンティティ）によってディスクリプタに発行されたERC-8176イーサリアム[[Attestation|アテステーション]]を通じて確立されます。これは、保証（endorsement）、有効期限（expiry）、取り消し（revocation）などを処理する確立された標準であり、レジストリロジックがアテステーションの維持ロジックで煩雑になる必要がないことを意味します。

レジストリのクエリもオンチェーンで行われます。ウォレットは、その時点でクリア署名する必要がある署名リクエストに対してクエリ可能な`contextId`キーを計算し、それを使用してレジストリコントラクトに保存されているすべての潜在的なクリア署名ディスクリプタとそのアテステーションを検索できます。

このオンチェーンレジストリは、イーサリアムにおけるクリア署名のエンドツーエンドアーキテクチャを完成させるはずです。

-   [ERC-7730](https://ethereum-magicians.org/t/eip-7730-proposal-for-a-clear-signing-standard-format-for-wallets/20403) - ディスクリプタファイル形式を定義
-   [ERC-8176](https://ethereum-magicians.org/t/erc-8176-integrity-verification-for-erc-7730/27911) - [[Attestation|アテステーション]]形式を定義し、任意の第三者が公開されたクリア署名ディスクリプタの保証を発行できるようにする
-   [ERC-8265](https://ethereum-magicians.org/t/erc-8265-prepared-transaction-envelope/28557) - ウォレットのメタデータ（[[transaction-simulation|トランザクションシミュレーション]]結果、トランザクションアサーション、解決されたENS名、その他の情報など）を、解決プロセス中に署名ハードウェアに到達するまでバンドルできる「トランザクションエンベロープ」形式を定義。
    （ERC-8265がクリア署名のコンテキストで普及しない場合、代替のERCが作成される可能性があります。）
-   [EIP-7906](https://ethereum-magicians.org/t/eip-7906-transaction-assertions-via-state-diff-opcode/23130) - スマートコントラクトがcalldataによって規定された状態変更をオンチェーンで強制するメカニズムを定義
-   **ERC-8283 (新規) - クリア署名のためのオンチェーンオープンレジストリと解決メカニズムを定義**

これにより、イーサリアムは、ウォレットがユーザーにとって透過的にやり取りできるオンチェーンAPIの自己完結型および自己文書化されたレジストリへと変わります。

*また、このERCは、スマートコントラクトが独自のクリア署名記述をオンチェーンで提供することを期待する[ERC: Onchain Clear Signing](https://ethereum-magicians.org/t/erc-onchain-clear-signing/28068)に対する対案として機能します。これは私の意見では、実際には全く持続不可能です。*

[github.com/ethereum/ERCs](https://github.com/ethereum/ERCs/pull/1789)

#### [ERC: ERC-7730クリア署名ディスクリプタのためのオンチェーンレジストリを追加](https://github.com/ethereum/ERCs/pull/1789)

`master` ← `forshtat:create-erc7730-onchain-registry`

公開 09:30AM - 2026年6月3日 UTC

 ![forshtatのアバター](https://avatars.githubusercontent.com/u/40541447?v=4) forshtat

[+642 \-0](https://github.com/ethereum/ERCs/pull/1789/files)

ERC-7730「クリア署名」のディスクリプタは大きすぎてオンチェーンに保存できませんが、[…](https://github.com/ethereum/ERCs/pull/1789)だからといって、何もせずにGithubをレジストリとして使うことに逆戻りするわけではありません。「レジストリ」コントラクトは、ディスクリプタファイル用のIPFS識別子とEASアテステーションを保存できます。このアプローチはループを閉じます。* ERC-7730 - ディスクリプタファイル形式を定義 * \[ERC-8176\](https://github.com/ethereum/ERCs/pull/1576) - アテステーション形式を定義 * \[ERC-8265\](https://github.com/ethereum/ERCs/pull/1753) - 「トランザクションエンベロープ」形式を定義（[[transaction-simulation|トランザクションシミュレーション]]結果、トランザクションアサーション、解決されたENS名などのメタデータをそこにバンドルできます） * このERC - クリア署名のためのオンチェーンオープン解決メカニズムを定義 これら4つの標準が連携して、非自明な複雑さを持つイーサリアムトランザクションの署名のセキュリティに実際に対処できる完全なクリア署名エコシステムを構築します。

*1件の投稿 - 1人の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8283-on-chain-registry-for-erc-7730-clear-signing-descriptors/28717)
