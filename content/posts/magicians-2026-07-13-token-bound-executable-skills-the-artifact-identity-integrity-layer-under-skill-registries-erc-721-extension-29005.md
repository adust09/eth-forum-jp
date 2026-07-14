---
title: トークンに紐づく実行可能なスキル — スキルレジストリの下にあるアーティファクトの同一性および完全性レイヤー（ERC-721拡張）
original_title: >-
  Token-Bound Executable Skills — the artifact identity & integrity layer under
  skill registries (ERC-721 extension)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/token-bound-executable-skills-the-artifact-identity-integrity-layer-under-skill-registries-erc-721-extension/29005
author: garyyang-finchip
date: '2026-07-13'
category: ERCs
tags:
  - ercs
  - smart-contracts
  - applications
  - identity
  - security
  - eip
  - ai-agents
  - research
  - token-bound-skills
topic_id: '29005'
translated_at: '2026-07-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Token-Bound Executable Skills — the artifact identity & integrity layer under skill registries (ERC-721 extension)](https://ethereum-magicians.org/t/token-bound-executable-skills-the-artifact-identity-integrity-layer-under-skill-registries-erc-721-extension/29005) — garyyang-finchip (2026-07-13)

**概要**

本提案は、[[ERC-721]]の拡張を提案するもので、トークンを**実行可能なスキル**に紐付けます。実行可能なスキルとは、プライマリMarkdownドキュメントを先頭とするファイルのパッケージであり、オフチェーンランタイム（LLMエージェントランタイムを含む）がどこからでもフェッチし、オンチェーンアンカーに対してバイト単位で検証し、実行できるものです。

オンチェーンでは、各トークンは`SkillBinding`を保持します。これには`mdHash`（プレーンテキストのプライマリドキュメントのSHA-256ハッシュ — 暗号化後も存続するコミットメント）、`packageHash`（決定論的にエンコードされたコンテンツアドレス指定オブジェクトグラフ — SkillRoot — のSHA-256ハッシュで、実行が依存するすべてのファイルをカバー）、およびクローズドな`prev`チェーンを持つコントラクトでインクリメントされる`version`が含まれます。その周りには、転送手段であり信頼の対象ではない可変の`packageURI`、[[ERC-721]]所有権とは別の公開権限である**更新権限**、そして不可逆な`freezeSkill`があります。オプションのレイヤーとして、オンチェーンのプレーンテキストプライマリドキュメント（公開されると永続的）、およびパッケージ内の機密性記述子があります — 暗号化はパッケージのプロパティであり、トークンのフラグではないため、鍵がリリースされる**前**に暗号文の完全性を検証できます。

本提案は意図的に、レジストリ、ディスカバリ、インストール、[[Attestation|アテステーション]]、レピュテーション、アクセス、ライセンス、または決済を定義**しません**。

**スキルおよびツールレジストリとの関係**

[[ERC-8239]]と[[ERC-8257]]はレジストリレイヤーを構築しています。つまり、スキルやツールがどこに登録され、どのように発見、インストール、[[Attestation|アテステーション]]されるかを定義します。本提案はそのレイヤーの下に位置し、異なる問いに答えます。それは、**トークンがコミットする正確な実行可能バイト、パッケージバージョン、および公開履歴とは何か？**という問いです。

[[ERC-8239]]のSkillRegistryトークンは、同じtokenIdでこのインターフェースをオプションで実装できます。[[ERC-8257]]のツールマニフェストは、トークンに紐づくアーティファクトを外部から参照できます。これにより具体的に可能になることの一つは、使用状況やインストールのアテステーションが`packageHash + version`を固定できるため、スキルがv1からv2に移行しても、過去のアテステーションは動的なヘッドではなく、正確にv1のバイトに解決されることです。

レジストリは、スキルが**どこで**登録され、エージェントがそれとどのように関連するかを答えます。本提案は、トークンが**何を**コミットするかを答えます。

**動機**

[[AIエージェント]]はオンチェーンID（[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]）とスマートアカウント（[[Account-Abstraction|ERC-4337]]）を持ち、スキル/ツールレジストリが登場しつつあります（[[ERC-8239]]、[[ERC-8257]]） — しかし、アーティファクト自体は依然として、URIの背後にある検証不能でサイレントに可変なコンテンツとして存在しています。これがレジストリのサプライチェーン攻撃の根本原因です。同じ名前、同じエントリでありながら、異なるバイト。`tokenURI`ではこれを解決できません。これは完全性の保証がない表示ポインタに過ぎません。

2つのハッシュとURIだけでは、単なるカスタムメタデータに過ぎません。これを標準たらしめているのは、その下にある規範的なオブジェクトモデルです。これは、ファイルごとのCIDとクローズドな追記専用バージョンチェーンを持つ決定論的なDAG-CBORグラフであり、コミットメントがバイト単位で何を保護するのかを正確に定義し、独立した実装がそれらを再現できるようにします。

**これは提案書ではなく、実行中です**

-   **仕様は凍結済み**（以下の返信に完全なドラフトテキストがあります。SHA-256 `779C7F9D…D274A68D`）。
    
-   **リファレンス実装、公開およびCC0** — [リリース `v1.0.0`](https://github.com/garyyang-finchip/skill-token-standard/releases/tag/v1.0.0)：[[Solidityコントラクト]]（`ISkillToken = 0x734553a6`、`IOnchainSkillDocument = 0x7050dd2c`、コンパイラ検証済み）、決定論的エンコーディングを実装するゼロ依存のPythonパッカー/ベリファイア、JSONスキーマ、および**仕様のすべてのMUST条項が12の合格アサーションの1つである**[[Foundryスイート]]。
    
-   **6つの凍結されたテストベクトル**は、実際のプロダクションスキル（公開/機密/ライセンス暗号化/カスタムプライマリパス/コンパニオンのみの更新/キーローテーション）から構築され、パスのネガティブテストも含まれます — 5つの独立したマシンでバイト単位で再現されました。これら6つすべてにおいて、プレーンテキストの`mdHash`は一定のままです。1つのドキュメントIDが暗号化、再パッケージ化、キーローテーション後も存続します。
    
-   **[[Sepolia]]で稼働中**：[`0x12cc1a5319c6F08bFB50982e3814A376A59fE550`](https://sepolia.etherscan.io/address/0x12cc1a5319c6F08bFB50982e3814A376A59fE550)。Skill Token #1は`public-v1`の凍結されたベクトルです。その[ミントトランザクション](https://sepolia.etherscan.io/tx/0x3d4f0d6ffccc9f788cee09283d50c4e765905628b592c5b3a72081e34d599a36)（ブロック11261685）は、ジェネシスの`SkillUpdated`イベントで`mdHash ‖ packageHash ‖ version`をそのまま保持しています — スキルのフィンガープリントは公開チェーン履歴の一部です。
    
-   **`cast`以外のローカルセットアップなしで自分で検証してください**：
    

```bash
cast call 0x12cc1a5319c6F08bFB50982e3814A376A59fE550 \
  "skillOf(uint256)((bytes32,bytes32,uint64))" 1 \
  --rpc-url https://ethereum-sepolia-rpc.publicnode.com
# (mdHash, packageHash, version) が返されます — 次に、実際のパッケージをそれらと照合します:
python3 tools/skill-pack/verify.py vectors/public-v1 --mdhash <1st> --packagehash <2nd>
```

**意図的にスコープ外**

レンタル、サブスクリプション、メータリング、委任、ゲート付きアップグレード、およびライセンス発行は、コンパニオン拡張に任されています。スキルのトークン参照は単一ですが、その使用価値はスケールする必要があります — 権利契約（通常は[[ERC-1155]]）は、`SkillRef = (chainId, skillContract, skillTokenId)`を介してスキルを外部から参照します。コンパニオンのメータリングライセンス提案がこれに続きます。

**コミュニティへの未解決の質問**

1.  **レジストリの構成**: [[ERC-8239]]スタイルのレジストリの場合、`ISkillToken`の同じtokenIdでのオプション実装は適切な構成パターンでしょうか — そして、使用状況/インストールイベントは`packageHash + version`を固定し、過去のアテステーションが正確なバージョン精度を維持するようにすべきでしょうか？
    
2.  **バージョニングの形式**: クローズドなバージョンチェーンを持つスキルごとに1つのトークンとするか、バージョンごとに新しいトークンとするか — 後者は履歴を保持しますが、スキルのIDを複数のトークンに断片化します。コミュニティはどちらに落ち着くべきでしょうか？
    
3.  **権利レイヤー**: [[ERC-1155]]コンパニオン（`skillRefOf`、発行、メータリング）をドラフト中です。共同設計に興味のあるチームはいますか？
    
4.  **機密性プロファイル**: 記述子は`profile`を不透明なものとして扱います（閾値ネットワーク、[[Trusted-Execution-Environment|TEE]]カストディなど）。軽量なプロファイルレジストリは存在すべきでしょうか、そしてどこに？
    
5.  **決定論的エンコーディング**: DAG-CBOR（RFC 8949の決定論的ルール）と37バイトのIDプレフィックス付きCIDv1リンクを選択しました — [[IPLD]]実装者からのフィードバックを歓迎します。
    
6.  **オンチェーンドキュメントの永続性**: `hasOnchainSkillDocument`は単調です（一度trueになると、永久にtrue）なぜなら、チェーン履歴は開示を不可逆にするからです — インターフェースはこの現実を反映すべきでしょうか？
    

**著者**

Gary Yang (@**garyyang-finchip**)

*初期のバージョニングに関する議論をしてくれた* [@bransdotcom](https://ethereum-magicians.org/u/bransdotcom) *に感謝します。*

*3投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/token-bound-executable-skills-the-artifact-identity-integrity-layer-under-skill-registries-erc-721-extension/29005)
