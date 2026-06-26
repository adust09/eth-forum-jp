---
title: 低/ゼロ/マイナス発行ポリシー下での発行オフセットとペナルティ増加の特性
original_title: >-
  Properties of issuance offsets and increased penalties under low/zero/negative
  issuance policies
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/properties-of-issuance-offsets-and-increased-penalties-under-low-zero-negative-issuance-policies/25292
author: aelowsson
date: '2026-06-24'
category: Economics
tags:
  - economics
  - consensus
  - staking
  - mechanism-design
  - security
  - issuance-offsets
  - penalties
topic_id: '25292'
translated_at: '2026-06-26'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Properties of issuance offsets and increased penalties under low/zero/negative issuance policies](https://ethresear.ch/t/properties-of-issuance-offsets-and-increased-penalties-under-low-zero-negative-issuance-policies/25292) — aelowsson (2026-06-24)

# 低/ゼロ/マイナス発行ポリシー下での発行オフセットとペナルティ増加の特性

*イーサリアムは現在、発行量削減について議論しています。これは、低発行量ポリシーがどのように促進されうるかを概説する技術的な投稿です。特定の報酬曲線は提案していません。*

## 要約

ベース報酬をインクリメントごとにゼロに近づけることで実装される低発行量体制下では、アテステーション義務 (attestation duties) を実行するインセンティブが消滅します。このインセンティブを維持するために2つの解決策が提案されています。(1) [[glossary/issuance-offsets|発行オフセット]]（以前は「手数料」と呼ばれていました）を[[glossary/epoch-processing|エポック処理]]中に適用して発行量を削減する方法、または (2) 報酬を減らすと同時に各義務に対するペナルティを増やす方法です。発行オフセットのアプローチは、仕様の簡潔さという利点があり、異なる[[glossary/Ethereum-validator|バリデータ]]の役割間の力関係を維持します。既知のペナルティ体制は、ペナルティが増加すると力関係が変化する可能性があるため、[[glossary/Minority-discouragement-attacks|少数派の意欲減退攻撃]]に関する懸念を継承します。

この投稿では、役割間の力関係を維持しつつ、少数派の意欲減退攻撃の機会を増やさないように、ペナルティを増加させる方法を概説します。次に、そのペナルティ設計を、割り当てられた義務に基づいてオフセットを変更することで、仕様の簡潔さを実現する同等の義務ごとの発行オフセット設計に変換する方法を概説します。

したがって、最終的には2つの異なる発行オフセット設計があり、ゼロ発行量で比較するのが最も容易な重要な違いがあります。すべてのアクティブなバリデータに適用されるインクリメントごとの均一な控除の下では、すべて通常の[[glossary/attestation-duties|アテステーション義務]]を実行するが、エポック中に特別な義務の割り当てがない[[glossary/solo-staker|ソロステーカー]]は、残高がマイナスになります。義務ごとの控除の下では、同じソロステーカーはそのような状況で収支が均衡しますが、提案を逃すとプロポーザー固有のオフセットが残るため、より大きな損失が生じます。

この投稿は、低水準のプラス発行量の下で許容的なフラットオフセット体制を概説することで締めくくられます。この体制では、ソロステーカーは通常の[[glossary/epoch|エポック]]で収支を均衡させるか、わずかなプラス報酬を得ることができ、提案を逃したことによるプロポーザー固有の控除を被ることはありません。

## はじめに

イーサリアムは、コンセンサス形成に参加する[[glossary/stake|ステーク]]された[[glossary/Ethereum-validator|バリデータ]]に、その義務を正しく実行するためのインセンティブとしてETHを発行します。これらの報酬による利回りは、結果としてコンセンサス形成に参加するインセンティブを生み出します。したがって、マイクロレベルでの義務実行のインセンティブと、マクロレベルでの[[glossary/stake|ステーク]]のインセンティブという[2つの特性](https://ethresear.ch/t/rainbow-roles-incentives-abps-focilr-as/21826#p-53062-h-73-unbundling-overall-yield-and-consensus-incentives-44)が関係しています。発行量が多いレベルでは、義務実行のインセンティブが損なわれないため、この区別はあまり関係ありません。

しかし、トラストレスなETH資産を維持し、ETH保有者が[[glossary/staking|ステーキング]]によって負担するコストを抑えるために、高い[[glossary/stake|ステーク]]参加レベルで実施される低発行量体制の場合を考えてみましょう。[[glossary/Ethereum-validator|バリデータ]]が多額の[[glossary/MEV|MEV（最大抽出可能価値）]]を受け取る場合、発行利回りが非常に低くても、[[glossary/MEV|MEV]]利回りが十分であれば[[glossary/stake|ステーク]]したいと考えるかもしれません。以前に[観察された](https://ethresear.ch/t/properties-of-issuance-level-consensus-incentives-and-variability-across-potential-reward-curves/18448#p-45336-h-3-consensus-incentives-11)ように、イーサリアムはインクリメントごとのベース報酬、ひいては発行利回りを、マイクロ報酬が[[glossary/MEV|MEV]]に対して取るに足らないほど低くする必要があるでしょう。その場合、[[glossary/Ethereum-validator|バリデータ]]にとって重要なのは[[glossary/MEV|MEV]]を獲得することだけであり、アテステーション義務に対する報酬は無視できるほどになり、適切にアテストするインセンティブも同様に無視できるものとなるでしょう。

これを解決するためには、アテストのインセンティブを導く報酬とペナルティをあまりにも低くすることはできません。2つの選択肢があります。(A) 各[[glossary/epoch|エポック]]で[[glossary/issuance-offsets|発行オフセット]]を適用して発行量を削減する（例えば、[1](https://ethresear.ch/t/properties-of-issuance-level-consensus-incentives-and-variability-across-potential-reward-curves/18448/11#p-45607-introduction-1)、[2](https://ethresear.ch/t/faq-ethereum-issuance-reduction/19675)、[3](https://ethresear.ch/t/the-shape-of-issuance-curves-to-come/20405#p-49913-ethereums-issuance-with-stake-burn-9)で提案されているように）、または (B) 報酬を減らすと同時に各義務に対するペナルティを増やす方法です。

## フラットな発行オフセット体制

まず、その簡潔さから、フラットな[[glossary/issuance-offsets|発行オフセット]]体制を分析します。図1に例を示しますが、同じ原則はゼロまたは[マイナス](https://ethresear.ch/t/the-shape-of-issuance-curves-to-come/20405#p-49913-ethereums-issuance-with-stake-burn-9)の発行量体制にも適用されます。[[glossary/Ethereum-validator|バリデータ]]の義務実行に対するマイクロインセンティブは赤で示されています。これは、既存の `get_base_reward_per_increment()` 関数を使用して計算され、その傾きにいくつかの潜在的な調整が加えられます。さらに、新しい関数 `get_macro_incentive_per_increment()` は、[[glossary/stake|ステーク]]するインセンティブを計算し、青で示されています。ここでは、正確な曲線方程式は指定しません。これらはこの投稿の焦点ではないためです。2つの曲線の間の[[glossary/issuance-offsets|発行オフセット]]は、[[glossary/epoch-processing|エポック処理]]中に控除されます。

```python
issuance_offset_per_increment = get_issuance_offset_per_increment(state)
for index in get_active_validator_indices(state, get_current_epoch(state)):
    decrease_balance(state, index, state.validators[index].effective_balance // EFFECTIVE_BALANCE_INCREMENT * issuance_offset_per_increment)
```

控除がなければ、完全な参加の下での発行量は上の赤の曲線に従います。控除があれば、発行量は下の青の曲線に従います。[重要な特性](https://ethresear.ch/t/properties-of-issuance-level-consensus-incentives-and-variability-across-potential-reward-curves/18448/11#p-45607-introduction-1)は、オフセットがコンセンサスメカニズム内の相対的な報酬とペナルティを変更しないことです。[[glossary/Ethereum-validator|バリデータ]]が2つのアクションを比較する場合、同じオフセットがどちらにも適用されるため、比較から相殺されます。

[![Figure 1](https://ethresear.ch/uploads/default/optimized/3X/8/8/88f7a175fac2fffb08b490a50ad11eebd315737f_2_690x438.png)](https://ethresear.ch/uploads/default/original/3X/8/8/88f7a175fac2fffb08b490a50ad11eebd315737f.png "図1")

**図1.** 赤はバリデータ義務実行に対するマイクロインセンティブ、青はステークに対するマクロインセンティブ。2つの曲線の間の発行オフセットはエポック処理中に控除される。意図された結果は、ステーカーが常に義務を正確に実行するインセンティブを持つ一方で、ステークするインセンティブは、赤の曲線が単独で許容するよりも強く抑制されることである。

## ペナルティ体制

[[glossary/issuance-offsets|発行オフセット]]体制では、アテスターとプロポーザーのバランスは同じままです。発行量が減少するにつれて恣意的にペナルティを増やすのではなく、その体制の一般原則をペナルティ体制にも引き継ぐことが望ましいです。これは、付録でさらに議論されているように、[[glossary/Minority-discouragement-attacks|少数派の意欲減退攻撃]]から[保護する](https://ethresear.ch/t/properties-of-issuance-level-consensus-incentives-and-variability-across-potential-reward-curves/18448#p-45336-h-3-consensus-incentives-11)ためです。もしプロポーザーとアテスターが、より高い発行量体制下で特定のアテステーションタイプに対して特定の相対的な報酬/ペナルティ分布を持つ場合、その相対分布はより低い体制でも維持されるべきです。このような不変条件は、直接的な分析に適しています。

これは、インセンティブ差分に導かれて、報酬とペナルティの構造を線形に変更することで達成できます。現在、成功すると報酬r、失敗するとペナルティpが与えられる義務を考えます。現在のペイオフは成功でr、失敗で-pです。ゼロ発行量ペナルティ体制では、成功時の結果を0、失敗時の結果を-(p+r)に設定します。これにより、成功と失敗の間の差が維持されます。報酬8、ペナルティ0の義務は、報酬0、ペナルティ8になります。報酬14、ペナルティ14の義務は、報酬0、ペナルティ28になります。どちらの場合も、義務を実行する限界インセンティブは変わりません。成功と失敗の差が同じであるため、マイクロインセンティブは維持されます。

次に、望ましい発行量ベースのマクロインセンティブがゼロより上にある中間点を考えます。関連する[[glossary/stake|ステーク]]レベルをDとし、有効残高インクリメントごとのマイクロインセンティブレベルをm(D)>0とし、同じ単位で測定されたインクリメントごとの望ましい発行量ベースのマクロインセンティブをy(D)とします。各報酬を変換する割合は次のようになります。

q(D)=\\frac{m(D)-y(D)}{m(D)}.

報酬r、ペナルティpの義務は、成功ペイオフr、失敗ペイオフ-pから、成功ペイオフ(1-q)r、失敗ペイオフ-(p+qr)に変更されます。差は依然としてr+pです。例えば、報酬14、ペナルティ14の義務は、(14,-14)から(13,-15)へ、次に(12,-16)へとスムーズに移行し、ゼロ発行量で(0,-28)に達します。マイナス発行量体制では、q>1となるため、成功時の結果でさえマイナスになります。その時点でも同じロジックが適用されますが、この設計は、報酬をペナルティに完全に変換する以上のオフセットまたは義務デビットとして理解する方が適切です。

プロポーザー報酬には特別な扱いが必要です。理想的には、それらはペナルティに変換されません。この理由は微妙です。アテステーションを含める報酬がない場合、プロポーザーは以前のスロットからの見逃されたアテステーションを無視する可能性があります。もしこれらのアテステーションを見逃したことに対してペナルティも課される場合、見逃されたアテステーションは連続して複数のプロポーザーにペナルティを課す可能性があります。

保持されたプロポーザー報酬は、各プロポーザークレジットrに対して、規範的な提案機会を割り当てられた[[glossary/Ethereum-validator|バリデータ]]にqrのオフセットを割り当てることで、削減された発行量と整合させることができます。割り当てられたプロポーザーがクレジットを獲得した場合、その純ペイオフは(1-q)rです。完全な相殺は、インクリメントごとのマクロインセンティブがゼロで、完全な参加下での発行量レベルがゼロに対応するq=1で発生します。もし後のプロポーザーが見逃されたアテステーションを含めることでクレジットを獲得した場合、元のプロポーザーはオフセットを保持し、後のプロポーザーは報酬を受け取ります。2人のプロポーザー全体で、総ペイオフは依然として(1-q)rであり、発行量が増加しないことを保証します。

したがって、プロポーザーペナルティは、いくつかのスロットにわたって正しい会計とインセンティブを引き継ぐために、その実装においてオフセットとして扱われます。

## 同等のペナルティと義務ごとの発行オフセット体制

ペナルティ体制とフラットな[[glossary/issuance-offsets|発行オフセット]]体制の違いは、報酬の分散と潜在的な仕様の複雑さにあります。ペナルティ体制では、完全に機能する[[glossary/Ethereum-validator|バリデータ]]は、各義務機会で指定されたマクロインセンティブに従って報酬を得ます。[[glossary/issuance-offsets|発行オフセット]]体制では、通常の[[glossary/slot|スロット]]ではわずかに少ない報酬を得て、提案などの特別な義務を実行するときにその差を回収します。これはまた、ペナルティ体制では、提案を逃すと、[[glossary/issuance-offsets|発行オフセット]]体制での提案間の基準以下のすべての収益に等しい1回限りの損失につながることを意味します。フラットな[[glossary/issuance-offsets|発行オフセット]]体制では、提案を逃すことは単なる機会費用であり、追加の提案固有のETHは控除されません。

この種のペナルティ体制を厳密に[[glossary/issuance-offsets|発行オフセット]]として実装することで、完全な等価性を見出すことはできるでしょうか？これはむしろ簡単であることが判明しました。各[[glossary/Ethereum-validator|バリデータ]]から[[glossary/staking|ステーキング]]オフセットを控除する際に、[[glossary/epoch|エポック]]中に割り当てられた義務を考慮に入れることができます。主要な関数は次のようになります。

```python
def process_issuance_offsets(state: BeaconState) -> None:
    epoch = get_current_epoch(state)
    attestation_issuance_offset_per_increment = get_attestation_issuance_offset_per_increment(state)
    prop_issuance_offset = get_proposer_issuance_offset(state, epoch)
    sync_issuance_offset = get_sync_committee_issuance_offset(state, epoch)

    for index in get_active_validator_indices(state, epoch):
        num_prop_assignments = get_num_proposer_assignments(state, index, epoch)
        num_sync_assignments = get_sync_committee_assignment_count(state, index, epoch)

        offset = state.validators[index].effective_balance // EFFECTIVE_BALANCE_INCREMENT * attestation_issuance_offset_per_increment
        if num_prop_assignments > 0:
            offset += num_prop_assignments * prop_issuance_offset
        if num_sync_assignments > 0:
            offset += num_sync_assignments * sync_issuance_offset
        decrease_balance(state, index, offset)
```

したがって、[[glossary/issuance-offsets|発行オフセット]]は役割の割り当てに基づいて配分されます。アテステーションコンポーネントはすべてのアクティブな[[glossary/Ethereum-validator|バリデータ]]に適用され、プロポーザーと[[glossary/sync-committee|同期委員会]]のコンポーネントはそれらの義務を割り当てられた[[glossary/Ethereum-validator|バリデータ]]に適用されます。成功したプロポーザーは通常のプロポーザー報酬を受け取りますが、対応するプロポーザーオフセットも適用されます。各規範的なクレジットrについて、クレジットを獲得すると純ペイオフは(1-q)rになります。したがって、q=1、つまりマクロインセンティブ/発行量レベルがゼロの場合、義務を成功裏に実行したプロポーザーは報酬とオフセットが完全に相殺されます。プロポーザーがそれを逃した場合、オフセットは残り、報酬は得られません。

これは、迷子になったアテステーションも自然に処理します。前の[[glossary/slot|スロット]]からのアテステーションを含めるプロポーザーは、依然としてプロポーザー報酬を受け取ります。対応するオフセットは、規範的な提案機会を割り当てられた[[glossary/Ethereum-validator|バリデータ]]に適用されました。元のプロポーザーがクレジットを獲得した場合、その報酬はオフセットによって(1-q)rに減額されます。クレジットを逃した場合、-qrのデビットを受け取り、後のプロポーザーはrを受け取ります。総ペイオフは依然として(1-q)rです。

結果として得られる設計は2つの方法で解釈できます。これは[[glossary/issuance-offsets|発行オフセット]]体制です。既存の報酬とペナルティのロジックはそのまま残り、オフセットは[[glossary/epoch-processing|エポック処理]]中に控除されるためです。また、ペナルティと等価でもあります。オフセットは義務機会に適用されるため、義務を怠ると、対応するペナルティ増加体制と同じデメリットが[[glossary/Ethereum-validator|バリデータ]]に残るためです。

## 低発行量下での許容的なフラット発行オフセット体制

現在のイーサリアムの仕様では、マイクロインセンティブは、プロポーザーが見逃した[[glossary/slot|スロット]]に対してペナルティを負わないように設計されています。これにより、個々の[[glossary/Ethereum-validator|バリデータ]]が一時的に誤ってオフラインになった場合でも、[[glossary/staking|ステーキング]]のダウンサイドリスクが限定されるという特性が維持されます。これは、セットアップを常に監視するリソースを持たない可能性のある[[glossary/solo-staker|ソロステーカー]]にとって有益な機能として推進されてきました。同時に、義務を完全に実行する[[glossary/solo-staker|ソロステーカー]]が、提案中に収支を均衡させるためだけに、各通常の[[glossary/epoch|エポック]]で損失を被らないようにすることも望ましいでしょう。これら2つの特性を維持しつつ、発行量を非常に低いレベルに抑えるにはどうすればよいでしょうか？

一つの方法は、ベース報酬曲線とマクロインセンティブ曲線の比率を維持しながら、フラットな[[glossary/issuance-offsets|発行オフセット]]体制を適用することです。これにより、[[glossary/solo-staker|ソロステーカー]]は各通常の[[glossary/epoch|エポック]]で損失を被ることはありません。現在のマイクロインセンティブでは、通常のアテステーションコンポーネントはベース報酬スケールの54/64です。
マクロインセンティブ曲線がベース報酬曲線の10/64である場合、共通のオフセット割合はq = 54/64となり、実行された義務に対して支払われるアテステーション報酬と等しくなります。分子8+2=10は、プロポーザー報酬の重み(8)と[[glossary/sync-committee|同期委員会]]の重み(2)に由来します。

図1のDが高く、発行量が低い端では、マクロインセンティブ曲線はこの10/64の比率に近づきます。このような条件下では、[[glossary/solo-staker|ソロステーカー]]は、完全なアテステーションと特別な義務がない[[glossary/epoch|エポック]]中に収支を均衡させると同時に、見逃された提案によるより大きなダウンサイドリスクにさらされることはありません。マクロインセンティブの割合が10/64より大きく設定されている場合、[[glossary/solo-staker|ソロステーカー]]は完全なアテステーション中に各[[glossary/epoch|エポック]]でわずかなプラス報酬を得るでしょう。したがって、16/64 = 1/4のような比率を使用することで、[[glossary/solo-staker|ソロステーカー]]にプラスの定期報酬を確保し、時間の経過とともに時折見逃された義務を相殺できる小さなバッファを提供することができます。

* * *

## 付録 – 少数派の意欲減退攻撃

[[glossary/issuance-offsets|発行オフセット]]体制では、アテスターとプロポーザーのバランスは同じままです。[[glossary/staking|ステーキング]]義務の実行に対する報酬とペナルティは、一般的に[[glossary/Minority-discouragement-attacks|少数派の意欲減退攻撃]]から保護するためにバランスが取れている必要があります。例えば、プロポーザーがビーコンブロックにアテステーションを含めるインセンティブがない一方で、アテスターはそれが含まれない場合に損失を被る場合、プロポーザーはアテステーションを省略することでアテスターに嫌がらせをすることができます。これにより、嫌がらせをする[[glossary/Ethereum-validator|バリデータ]]は、観察されたすべてのアテステーションを忠実に含める[[glossary/Ethereum-validator|バリデータ]]よりも高い利回りを得ることができます。このため、プロポーザーは含まれるすべてのアテステーションに対して報酬を得ます。

現在のコンセンサスメカニズムに対しては、いくつかの既知の[[glossary/Minority-discouragement-attacks|少数派の意欲減退攻撃]]が存在します。例えば、プロポーザーは[[glossary/sync-committee|同期委員会]]のアテステーションを選択的に検閲する可能性があります。これは「グリーフィングファクター」G=14の攻撃です。攻撃者が失うETH1単位につき、検閲された[[glossary/Ethereum-validator|バリデータ]]は14ETHを失います。これは、アテステーションが含まれない場合、アテスターがプロポーザーの7倍のETHを失い、さらにプロポーザーが失うETHの7倍のペナルティを負うためです。その結果、攻撃者は[[glossary/stake|ステーク]]のごく一部（ただし無視できない量）を保持しながら、攻撃から利益を得ることができることが判明しています。攻撃側のステーキングサービスプロバイダー (SSP) の比較的高い利回りは、デリゲーターがそれを好むようになり、検閲された一部の[[glossary/Ethereum-validator|バリデータ]]が離脱すると、持続的な検閲下で均衡利回りが上昇するでしょう。この例が示すように、マイクロ報酬のバランスを取ることは微妙な問題です。

[[glossary/Minority-discouragement-attacks|少数派の意欲減退攻撃]]の別の例は、アテスターが[[glossary/inactivity-leak|非アクティブリーク]]中にアテステーションを差し控えることで、プロポーザーがタイムリーなヘッドアテステーションに対する報酬を得るのを阻止することです。現在のコンセンサスメカニズムでは、アテスターは[[glossary/inactivity-leak|非アクティブリーク]]中に報酬を受け取らず、ソース投票に対するペナルティを避けるために、アテステーションが2〜5[[glossary/slot|スロット]]以内に含まれることだけを保証すればよいのです。この場合のグリーフィングファクターは無限になります。さらに、アテスターが2〜5[[glossary/slot|スロット]]以内にプロポーザーとして割り当てられた場合、アテステーション自体に対する報酬を受け取ることができ、したがって攻撃から直接利益を得ることになります。

この議論は、[[glossary/Minority-discouragement-attacks|少数派の意欲減退攻撃]]を考慮せずに報酬とペナルティが変更された場合に、コンセンサスメカニズムがいかに崩壊しうるかを浮き彫りにしています。このため、現在および将来のあらゆるコンセンサス設計において、全[[glossary/staking|ステーキング]]範囲で同じマイクロインセンティブバランスを維持することが望ましいと思われます。もしプロポーザーとアテスターが、より高い発行量体制下で特定のアテステーションタイプに対して特定の相対的な報酬/ペナルティ分布を持つ場合、その相対分布はより低い体制でも維持されます。もし代わりに、報酬をゼロに近づけてペナルティを増やすことで発行量を削減しようとすると、役割間のバランスを維持するのがより困難になります。見逃された提案がオフセットを発生させない場合、報酬/ペナルティ分布の再調整によって発行量を削減しようとする試みは、プロポーザーとアテスター間の力関係を覆すため、特に危険でしょう。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/properties-of-issuance-offsets-and-increased-penalties-under-low-zero-negative-issuance-policies/25292)
