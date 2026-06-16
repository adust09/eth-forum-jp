---
title: >-
  ツインドメイン収束アイデンティティ：.com/.ethペアは新たな機関向けネームスペース標準となるのか、そしてこれはイーサリアムのコアミッションとどう関係するのか？
original_title: >-
  Twin-Domain Convergence Identity: Is the .com/.eth pair an emerging
  institutional namespace standard — and how does this relate to Ethereum's core
  mission?
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/twin-domain-convergence-identity-is-the-com-eth-pair-an-emerging-institutional-namespace-standard-and-how-does-this-relate-to-ethereums-core-mission/25196
author: PillarsX
date: '2026-06-15'
category: Economics
tags:
  - economics
  - identity
  - applications
  - governance
  - privacy
  - research
  - regulation
  - ens
topic_id: '25196'
translated_at: '2026-06-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Twin-Domain Convergence Identity: Is the .com/.eth pair an emerging institutional namespace standard — and how does this relate to Ethereum's core mission?](https://ethresear.ch/t/twin-domain-convergence-identity-is-the-com-eth-pair-an-emerging-institutional-namespace-standard-and-how-does-this-relate-to-ethereums-core-mission/25196) — PillarsX (2026-06-15)

米国のステーブルコイン規制（2025/2026年）の文脈で機関によるドメイン登録パターンを観察する中で浮上した研究課題を提起したいと思います。これは、このコミュニティにとって特に重要だと考える哲学的な緊張に触れるものです。

**背景**

GENIUS法（2025年7月）および進行中のOCC/FDIC/NCUA規則制定プロセスは、トークン化された金融インフラ（PPSI、DVP決済、RLN、DLTレポ、資産相互運用性、許可された準備金）に対する首尾一貫した規制用語を初めて確立しつつあります。同時に、機関投資家がこれらの規制上の重要用語の.comと.ethの両方のバリアントを登録し始めていることが観察されます。

**核心となる命題**

私が最近発表したワーキングペーパー（「ツインドメイン収束アイデンティティ：規制されたデジタル資産インフラにおける機関向けネームスペース標準のフレームワーク」）では、.com/.ethペアが偶然に生まれたのではなく、互換性のない2つのレール上で運用される互換性のない2つのオーディエンスに同時にサービスを提供しなければならない機関にとっての構造的必然性を反映していると主張しています。

-   **Web2オーディエンス:** コンプライアンスチーム、規制当局、法務顧問 — DNSレール上で運用し、法的に参照可能で人間が読めるアイデンティティを要求
    
-   **Web3オーディエンス:** ソフトウェアアーキテクト、プロトコルエンジニア、スマートコントラクト開発者 — ENSレール上で運用し、機械が読める、構成可能なエンドポイントを要求
    

どちらか一方のアイデンティティだけでは問題は解決しません。.ethのない.comドメインはスマートコントラクトでアドレス指定できません。.comのない.ethドメインは、規制当局への提出書類のための法的に参照可能なWeb2アイデンティティを持ちません。

![ツインドメイン収束アイデンティティ](https://ethresear.ch/uploads/default/optimized/3X/3/d/3df3d1c17bea1f03ced5573c6951afa88c24a922_2_586x500.png)

*図1：ツインドメイン収束アイデンティティフレームワーク — 機関向けデジタル資産インフラは、互換性のない2つのレール上で互換性のない2つのオーディエンスに同時にサービスを提供するため、ペアになったアイデンティティ標準として.com（DNS）と.eth（ENS）の両方を必要とする。どちらか一方だけでは二重の要件を満たせない。*

**明らかな緊張 — そしてなぜそれを無視したくないのか**

Vitalikは2026年初頭に明確に位置付けました。イーサリアムは、それ自体が機関採用のためのプラットフォームではないと。「ドル・トークン化」や機関の物語に奉仕することは、イーサリアムのコアミッションからの逸脱として明示的に説明されました。イーサリアム財団は、分散化、自己主権、プライバシー（Kohaku、[[glossary/Account-Abstraction|アカウント抽象化]]、検閲耐性）へとその使命を研ぎ澄ましました。

私はこの緊張が現実のものであり、このコミュニティのために明確にすべきだと考えています。

私の命題は、Vitalikのビジョンに**反する**形で機能する可能性のあるENSの機関利用について述べています。これは技術的に互換性がないからではなく、ENSを規制され、コンプライアンスに縛られたインフラのネームスペース層として利用するからです。規制当局、OCC検査官、法務顧問は、イーサリアム財団が積極的に追求していない文脈でENSドメインを扱うでしょう。

同時に、私はVitalikが資金提供しているKohakuやプライバシーインフラ（FHE、[[glossary/Zero-Knowledge-Proof|ゼロ知識証明]]、オンチェーンプライバシー）こそが、機関採用を**信頼できる**ものにする技術的基盤であると主張しています。イーサリアム上の機密コンピューティングは、Vitalikのコアテーマであり、機関決済のプライバシーのための技術的基盤でもあります。

したがって、問題は機関利用が存在するかどうかではありません — それは既に存在します。問題は、ENSプロトコルとイーサリアム財団がこの利用を積極的に形成したいのか、それともガバナンスフレームワークなしに有機的に出現するに任せるのか、ということです。

**3つの未解決の研究課題**

1.  **ENSプロトコルレベル:** 規制された文脈において、ENSドメインがDNSドメインと同じ機関の受け入れを達成するのを妨げる技術的障害はありますか？W3C DID互換性、法的強制力、ガバナンスリスクなど。
    
2.  **ネームスペースガバナンス:** 規制上の重要用語をENSネームスペースとして定義し、標準化するのは誰であるべきですか？イーサリアム財団、ICMA、BIS、それとも市場登録を通じて有機的に出現するのでしょうか？そして、有機的な出現はイーサリアムの分散化ミッションと整合していますか、それともガバナンスの空白ですか？
    
3.  **分散化とコンプライアンスの二重性:** ENSは、検閲耐性のある分散型インフラというVitalikのビジョンと、管理され、法的に保護されたネームスペースアイデンティティに対する規制された機関の要件を同時に満たすことができますか？それとも、これは根本的な矛盾なのでしょうか？
    

この論文はこちらで入手可能です: [https://papers.ssrn.com/abstract=6862341](https://papers.ssrn.com/abstract=6862341)

特に、このコミュニティがENSの機関利用をイーサリアムのコアバリューの豊かさと見るか、それとも矛盾と見るかについて、批判的なフィードバックをお待ちしております。

-Rolf Neumayr

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/twin-domain-convergence-identity-is-the-com-eth-pair-an-emerging-institutional-namespace-standard-and-how-does-this-relate-to-ethereums-core-mission/25196)
