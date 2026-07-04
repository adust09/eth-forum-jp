---
title: 'ERC: プライオリティ更新レジストリ (PUR)'
original_title: 'ERC: Priority Update Registry (PUR)'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-priority-update-registry-pur/28921'
author: quintus
date: '2026-07-03'
category: ERCs
tags:
  - ercs
  - eip
  - evm
  - defi
  - economics
  - mev
  - pbs
  - state-management
  - protocol-design
topic_id: '28921'
translated_at: '2026-07-04'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC: Priority Update Registry (PUR)](https://ethereum-magicians.org/t/erc-priority-update-registry-pur/28921) — quintus (2026-07-03)

皆さん、こんにちは、

[[glossary/EVM|EVM (イーサリアム仮想マシン)]]上のPropAMMs（および同様のユースケース）向けのコントラクト標準のドラフトです。[このコントラクトのインスタンス](https://etherscan.io/address/0xda7afeed01fe625cf15d187a19f94b45f00b8c5f)は、2026年5月からイーサリアムで稼働しており、複数のビルダーにわたるPropAMMのほぼすべてのボリュームを処理しています。これを[[glossary/EVM|EVM (イーサリアム仮想マシン)]]チェーン全体で標準化したいと考えています。

[PRリンク](https://github.com/ethereum/ERCs/pull/1852); [リファレンス実装](https://ethereum-magicians.org/t/erc-priority-update-registry-pur/28921)

要するに、Priority Update Registry (PUR) は、他のコントラクトが「所有」する小さな状態を保持する単一の共有コントラクトです。所有者は、一部のオフチェーンアップデーターにその状態への書き込みを許可し、所有コントラクトのみが他のトランザクション (tx) 呼び出し中にその状態を読み戻します。この状態は短命で新鮮であることが意図されており、次のブロックが構築されている間に毎ブロック更新される取引ペアの価格を想像してください。

主な動機となる問題は、PropAMMsが特定の種類のトランザクション（更新）を[[glossary/Block-Building|ブロック構築]]者に優先させることを要求/恩恵を受ける一方で、この標準がなければ、[[glossary/Block-Building|ブロック構築]]者が更新を他のことを行うトランザクションと区別することが難しいという点です。この標準は、[[glossary/Block-Building|ブロック構築]]者が実行中にトランザクショントレースを行う必要や、アップデーターと信頼関係を持つ必要をなくします。

私たちは境界線について正直であろうと努めました。この標準は実質的に2つのものです。(A) [[glossary/EVM|EVM (イーサリアム仮想マシン)]]が実際に強制するオンチェーンレジストリ、および (B) オンチェーンでは完全に強制できない[[glossary/Block-Building|ブロック構築]]者の順序付け動作です。PURは、[[glossary/Block-Building|ブロック構築]]者がその順序付けを安全に提供できるようにするだけです。また、分析もはるかに容易になります。

いくつかご意見をいただきたい点があります。

-   ブロック内の他の何にも依存してはならない更新のための「可換」ティアを形式化するかどうか（現在、1271署名が可換性を妨げています）
-   シミュレーターとRPCが保留中のトランザクションがどの更新を待っているかを判断できるように、標準が義務付けるべきエラーサーフェス（もしあれば）
-   そして、一部のメーカーが望むマルチ署名者および部分書き込みのケースにおいて、1271よりもリッチな更新インターフェースが価値があるかどうか。

これはVitaliy DroganとTymur Khrushchovとの共著です。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-priority-update-registry-pur/28921)
