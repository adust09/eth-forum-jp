---
title: Ethlabsのグラムステルダムに関する見解
original_title: Ethlabs’ position on Glamsterdam
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/ethlabs-position-on-glamsterdam/30518'
author: caspar
date: '2026-11-25'
category: Uncategorized
tags:
  - consensus
  - execution-layer
  - eip
  - gas
  - scaling
  - research
  - protocol-design
topic_id: '30518'
translated_at: '2026-11-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Ethlabs’ position on Glamsterdam](https://ethereum-magicians.org/t/ethlabs-position-on-glamsterdam/30518) — caspar (2026-11-25)

*過去数週間にわたり、Ethlabsは[[glossary/Glamsterdam|グラムステルダム]]の影響分析を支援してきました。これは、議論に関する私たちの最新の考え方を簡潔にまとめたものです。背景については、このトピックに関する[以前のメモ](https://ethlabs.org/writings/tracking-glamsterdam.html)をお読みください。*

**要約:**

-   **私たちは[[glossary/Glamsterdam|グラムステルダム]]を現状のまま進めることを推奨します。** これは難しいトレードオフであり、発見された問題は深刻で正当なものです。混乱の多くは、[[glossary/state-creation-costs|ステート作成コスト]]の[[glossary/repricing|再価格設定]]に起因しており、これはイーサリアムが1000倍のスケーリングを達成するための必要なステップです。これを避ける唯一の選択肢は、[[glossary/EIP|EIP]]-8037を完全に削除することですが、これでは[[glossary/Glamsterdam|グラムステルダム]]の約3倍高いガス制限を放棄することになり、問題を後のハードフォークに先送りするだけです。混乱の二次的な原因は、新しい[[glossary/reservoir|ステートガスレザバー]]メカニズムです。ここでは、[[glossary/EIP|EIP]]の変更によって一部の懸念に対処できますが、影響を受けるプロジェクトの一部に限定され、さらに数ヶ月の遅延を伴います。全体として、私たちの評価では、これらの選択肢のいずれも費用対効果のテストに合格しません。
-   **[[glossary/Glamsterdam|グラムステルダム]]からは、将来のハードフォークを改善するための重要な教訓が得られます。** 私たちは、破壊的な変更を早期に警告し、アプリ開発者を巻き込み、機密性の高い[[glossary/EIP|EIP]]に対する影響分析をより慎重に範囲設定し、アプリ開発者がどの[[glossary/Invariant|不変条件]]に依存できるかについて共通理解を確立し、[[glossary/EIP|EIP]]-8037によって導入されたものを含め、現在ギャップがある部分に新しい[[glossary/Verification-Primitive|プリミティブ]]を提供する必要があります。

## [[glossary/Glamsterdam|グラムステルダム]]の進行を推奨する理由

これは難しいトレードオフであり、提起された懸念は深刻で正当なものですが、全体として、私たちは[[glossary/Glamsterdam|グラムステルダム]]を現状のまま進めることを推奨します。議論された2つの代替案は、提起された懸念に対処するために[[glossary/EIP|EIP]]-8037を修正するか、フォークから完全に削除することです。以下の理由により、どちらもより良い選択肢ではないと考えています。

1.  **[[glossary/EIP|EIP]]-8037を削除すると、[[glossary/Layer-1|L1]]スケーリングへの道が閉ざされます。** [[glossary/Glamsterdam|グラムステルダム]]の主要テーマは[[glossary/Layer-1|L1]]スケーリングであり、[[glossary/EIP|EIP]]-8037は[[glossary/state-growth|状態成長]]のボトルネックに対処するため、必要な変更です。[[glossary/EIP|EIP]]-8037なしでハードフォークをリリースすることは、[[glossary/Glamsterdam|グラムステルダム]]の核となる部分（[[glossary/ePBS|ePBS]]や[[glossary/Runtime-block-level-access-lists|BAL]]など）が、実際にイーサリアムをスケーリングするために活用できないことを意味します。[[glossary/repricing|再価格設定]]がどのようにガス制限の引き上げを可能にするかについては、昨年の[AnsgarとCasparによるメモ](https://notes.ethereum.org/@ansgar/repricings-for-glamsterdam)を参照してください。しかしそれ以上に、[[glossary/repricing|再価格設定]]は[[glossary/zkEVM|zkEVM]]を介した1000倍スケーリングへの道のりで必要な部分です。これはイーサリアムのロードマップの主要な部分であり、ブロックされることになります。これを削除しても、後のフォークのために修正を試みる時間を稼ぐだけであり、依然として同じトレードオフに直面することになります。
2.  **[[glossary/EIP|EIP]]-8037の削除または修正は、どちらも遅延を引き起こします。** **現時点では、[[glossary/EIP|EIP]]の削除を含め、フォークへのいかなる変更も数ヶ月の遅延を招きます。** [[glossary/Sepolia|Sepoliaテストネット]]はすでに[[glossary/Glamsterdam|グラムステルダム]]の古いバージョンで[[glossary/fork|フォーク]]しており、[[glossary/Sepolia|Sepolia]]を救済するか廃止するかを判断するのは容易ではありません。
3.  **[[glossary/EIP|EIP]]-8037の修正は、問題の一部にしか対処できず、さらに長い遅延を招きます。** [[glossary/EIP|EIP]]-8037によって引き起こされる問題は、2つの異なる性質を持っています。1つ目は[[glossary/repricing|再価格設定]]自体、つまり[[glossary/state-creation-costs|ステート作成コスト]]を高くすることです。いかなる[[glossary/repricing|再価格設定]]も、ガス料金をハードコードしているコントラクトを破壊します。Vitalikが[彼の投稿](https://docs.fileverse.io/document/dUHG8ythBk3jJuQEjcE7m6#k=tVLgvLrIqyEsCh7qUmACb9ggVmybyS_aIZZsAMHDAk)で議論しているように、スケーリングを諦めない限り、[[glossary/EIP|EIP]]のいかなる修正もこれを回避することはできません。2つ目は、[[glossary/EIP|EIP]]で導入された[[glossary/reservoir|ステートガスレザバー]]メカニズムです。観測された問題の一部は、このメカニズムの具体的な内容に起因するため、[[glossary/EIP|EIP]]の変更は原則として役立つ可能性があります。しかし、そのような変更が、その[[glossary/reservoir|レザバー]]メカニズムに特有の問題を抱える影響を受けるプロジェクトの比較的小さな部分にしか役立たないこと、および追加のハードフォーク遅延という形で大きなコストがかかることを考慮すると、私たちの評価では、この選択肢も費用対効果のテストに合格しません。
4.  **損害は合理的に抑えられています。** 主な損害の種類は、[[glossary/EIP|EIP]]によって動作が影響を受ける、すでにデプロイされている[[glossary/Smart-Account|スマートコントラクト]]です。この方法で影響を受けるプロジェクトは限られており、そのほとんどが緩和策を講じることができ、すでにそうしています。また、反応する手段なしに多額の資金が危険にさらされているプロジェクトはありません。[[glossary/Glamsterdam|グラムステルダム]]の遅延は、影響を受けるプロジェクトに移行のための追加時間を与えます。2つ目の損害の種類は、[[glossary/EIP|EIP]]における[[glossary/reservoir|レザバー]]メカニズムの特定の動作によって、将来の[[glossary/Smart-Account|スマートコントラクト]]開発に課される制約です。特に、信頼できないコントラクトへの呼び出しに対するtry/catch処理に関する一部のパターンは、このメカニズムの存在下では処理がより困難になります。しかし、この2つ目の損害の種類は、メカニズムの調整とその他の明示的な新機能の両方を通じて、将来のハードフォークで緩和できます。

全体として、私たちは[[glossary/Glamsterdam|グラムステルダム]]を現状のまま進めることを推奨します。[[glossary/EIP|EIP]]-8037のいかなる修正も全体的な改善になるかは不明であり、それを削除することは[[glossary/Glamsterdam|グラムステルダム]]の主要テーマである[[glossary/Layer-1|L1]]スケーリングを放棄することになります。より根本的には、[[glossary/EIP|EIP]]-8037のような[[glossary/repricing|再価格設定]]は、[[glossary/zkEVM|zkEVM]]を介したイーサリアムの1000倍スケーリングへの道筋において必要なステップであるため、今それを削除することは、後のフォークで同じ問題に直面することを意味するだけです。[[glossary/EIP|EIP]]-8037で立ち止まるのではなく、私たちは、[[glossary/Hegota|ヘゴタ]]を皮切りに、将来のフォークで同じ過ちを繰り返さないように、私たちをここに導いた根本的な問題を解決する方が良い道だと考えています。

## [[glossary/Glamsterdam|グラムステルダム]]からの教訓

1.  **破壊的な変更を早期に警告し、コミュニティを巻き込む。**
    
    [[glossary/Glamsterdam|グラムステルダム]]における混乱は、純粋な偶然ではありません。Vitalikが[彼の最近の投稿](https://docs.fileverse.io/document/dUHG8ythBk3jJuQEjcE7m6#k=tVLgvLrIqyEsCh7qUmACb9ggVmybyS_aIZZsAMHDAk)でよく説明しているように、イーサリアムはスケーリングを望んでおり、[スケーリングには[[glossary/repricing|再価格設定]]が必要](https://notes.ethereum.org/@ansgar/repricings-for-glamsterdam)であり、いかなる[[glossary/repricing|再価格設定]]も、どのように行われても、現在のガス料金に依存する一部のコントラクトを破壊します。私たちは、1000倍スケーリングへの道（[[glossary/Glamsterdam|グラムステルダム]]のスケーリングは最初のステップに過ぎません！）を開始することは、ある程度の混乱を伴う価値があると考えています。何がアプリ開発者にとってこの混乱を意味するのかは、はるかに不明確でした。そのトレードオフは早期に提示され、アプリ開発者が最初から関与すべきでしたが、明確に説明されることはありませんでした。[Vitalikの文書](https://docs.fileverse.io/document/dUHG8ythBk3jJuQEjcE7m6#k=tVLgvLrIqyEsCh7qUmACb9ggVmybyS_aIZZsAMHDAk)は、それを提示する最初のコミュニティ向け文書です。このような文書が早期にさらに必要であり、私たちはそれが実現するように努めます！
    
    今後、私たちは潜在的に破壊的な変更をプロセスの早い段階で警告し、意思決定が行われる際にアプリ開発者とコミュニティを巻き込むように推進します。
    
2.  **影響分析パイプラインを改善する。**
    
    [[glossary/Glamsterdam|グラムステルダム]]が既存のコントラクトを混乱させる可能性を秘めていることは明らかでしたが、影響分析の範囲設定においてこれが十分に考慮されませんでした。その結果、分析は包括的であると理解されていたにもかかわらず、主要な種類の影響を受けるコントラクトを見落とし、これらは遅れて発見されました。
    
    今後、影響分析は[[glossary/EIP|EIP]]の感度に応じて範囲設定されるべきであり、慎重を期すべきです。[[glossary/auditor|監査人]]の[調査結果](https://www.chainsecurity.com/blog/glamsterdam-gas/index.html)が出た後、[[glossary/AI-agents|AIツール]]は[[glossary/Glamsterdam|グラムステルダム]]の分析において急速に非常に重要になりました。例えば、組織を横断して[[glossary/AI-agents|エージェント]]の[[glossary/Swarm|スウォーム]]を[調整する](https://ethlabs.org/updates/week-18.html)などです。私たちは、既存のフレームワークを超えて、これらを影響分析の標準的な部分とし、最終的にはすべての[[glossary/EIP|EIP]]を[[glossary/AI-agents|エージェント]]駆動型影響分析でストレステストすることを計画しています。[[glossary/Hegota|ヘゴタ]]については、特に[[glossary/Frame-Transactions|フレームトランザクション]]（[[glossary/EIP|EIP]]-8141）に関して、この作業はすでに始まっています。
    
3.  **[[glossary/Invariant|不変条件]]に関する共通理解を確立する。**
    
    [[glossary/EVM|EVM]]は時間の経過とともにゆっくりとしか進化しないため、その多くの部分は長年にわたって同じままです。これには意図的なもの、つまり依存することが意図されており、時間の経過とともに動作が変わらない[[glossary/Invariant|不変条件]]もあります。その他の部分は、長い間変更されていませんが、将来変更される可能性があり、あるいは変更せざるを得ないでしょう。この区別は明確にされておらず、一部はプロトコル開発者とアプリ開発者間のコミュニケーションギャップに起因しています。いくつかのガイダンスは存在しましたが、何に依存でき、何に依存できないかについて明示的な合意はありません。これにより、依存することが意図されていなかったものに依存するという事態が生じました。
    
    今後、私たちは明確な境界線を引く必要があります。これにより、[[glossary/EVM|EVM]]のどの部分が設計上[[glossary/Invariant|不変条件]]であるか、偶然変更されていないかについて明示的に合意し、後者のどれが今後のフォークで変更される可能性が高いかを、例えば[[glossary/Informational-ERC|情報提供EIP]]などを通じて早期に警告する必要があります。
    
4.  **ギャップがある部分に新しい[[glossary/Verification-Primitive|プリミティブ]]を提供する。**
    
    何に安全に依存でき、何に依存できないかについて合意することは役立ちますが、安全でないパターンへの依存は明確な代替手段がない場合があります。良い例は、ガス切れになるサブコールと失敗するサブコールの区別です。これは、現在のガス機構の具体的な内容に依存しない限り、今日では不可能です。同様の状況が、新しい[[glossary/reservoir|ガスレザバー]]メカニズムによって影響を受ける一部のパターンにも存在します。このような場合、最善の結果は、そのようなパターンを安全かつ長期的に信頼できる方法で可能にする明示的な新機能をリリースすることです。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/ethlabs-position-on-glamsterdam/30518)
