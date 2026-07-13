---
title: AUCILに対するシビル攻撃
original_title: Sybil Attacks on AUCIL
source: ethresear
source_name: Ethereum Research
source_url: 'https://ethresear.ch/t/sybil-attacks-on-aucil/25447'
author: AbhiMan1601
date: '2026-07-12'
category: Economics
tags:
  - economics
  - security
  - censorship-resistance
  - pbs
  - mev
  - protocol-design
  - inclusion-list
  - sybil-resistance
topic_id: '25447'
translated_at: '2026-07-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Sybil Attacks on AUCIL](https://ethresear.ch/t/sybil-attacks-on-aucil/25447) — AbhiMan1601 (2026-07-12)

[[glossary/Inclusion-List|インクルージョンリスト (IL)]]は、[[glossary/PBS|プロポーザー・ビルダー分離 (PBS)]]下のイーサリアムにおける検閲耐性プリミティブとして話題になっています。私の理解では、主に2つの主要な設計が開発されています。

1.  **[[glossary/FOCIL|FOCIL]]**: 固定されたスロットごとの参加者と明示的な価格設定がない基盤となるコンセンサスに依存します。
    
2.  **AUCIL**: 戦略的な参加と価格形成を伴う経済的インセンティブに依存する、オークションベースのインクルージョンリスト設計です。
    

[[glossary/EIP-7805|EIP-7805]]として提案されている[[glossary/FOCIL|FOCIL]]が、来る[[glossary/Hegot|ヘゴタ]]アップグレードの目玉となることから、IL設計の堅牢性は喫緊の課題です。どちらの設計も完全にシビル耐性があるわけでも、賄賂耐性があるわけでもないことに注意が必要です。

[[glossary/FOCIL|FOCIL]]は、委員会選定において本質的にシビル耐性がありますが、偽のトランザクションや賄賂が許容されると、その手数料メカニズムが弱まる可能性があります。幸いなことに、Stouka、Ma、Thiery \[1\] は、[[glossary/FOCIL|FOCIL]]に対する賄賂攻撃と安全なメカニズム設計について包括的な分析を提供しましたが、AUCILに対応する分析を見た記憶がありません。

このブログ記事では、2つの質問のみを問いかけます。

1.  *シビル攻撃はAUCILにどこから侵入し、その検閲保証とインセンティブをどのように変化させるのか？*
    
2.  *イーサリアム向けのシビル耐性のあるAUCILメカニズムはどのようなものか？これをどのように改善できるか？*
    

ぜひご覧ください: [Auction Based Inclusion Lists (AUCIL)におけるシビル攻撃](https://functor.network/user/3197/entry/1845)

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/sybil-attacks-on-aucil/25447)
