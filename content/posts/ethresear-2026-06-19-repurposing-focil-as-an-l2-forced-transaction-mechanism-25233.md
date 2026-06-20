---
title: FOCILをL2の強制トランザクションメカニズムとして再利用する
original_title: Repurposing FOCIL as an L2 forced transaction mechanism
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/repurposing-focil-as-an-l2-forced-transaction-mechanism/25233
author: donnoh
date: '2026-06-19'
category: Layer 2
tags:
  - layer2
  - consensus
  - scaling
  - rollup
  - censorship-resistance
  - protocol-design
  - eip
  - execution-layer
  - state-management
topic_id: '25233'
translated_at: '2026-06-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Repurposing FOCIL as an L2 forced transaction mechanism](https://ethresear.ch/t/repurposing-focil-as-an-l2-forced-transaction-mechanism/25233) — donnoh (2026-06-19)

*フィードバックとレビューをいただいた [Péter Garamvölgyi](https://x.com/thegaram33)、[Thomas Thiery](https://x.com/soispoke)、[Francesco Risitano](https://x.com/TauLepton_)、[Jihoon Song](https://x.com/jih2nn) に感謝いたします。*

以下の記事は、非常に異なる[[glossary/EIP|EIP]]の[インクルージョンステージ](https://eips.ethereum.org/EIPS/eip-7723)に基づいているか、関連しています。特に、[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]] (SFI)、[Optional Execution Proofs](https://forkcast.org/eips/8025) (PFI)、[[glossary/Block-level-Access-Lists|ブロックレベルアクセスリスト (BALs)]] (SFI)、[Validity-Only Partial Statelessness](https://ethresear.ch/t/a-pragmatic-path-towards-validity-only-partial-statelessness-vops/22236) (EIPなし)、[Native rollups](https://eips.ethereum.org/EIPS/eip-8079) (まだ提案されていません)。したがって、詳細は時間の経過とともに変更される可能性があります。この研究は主に、ネイティブ[[glossary/Rollup|ロールアップ]]向けのシンプルな強制トランザクションメカニズムを見つける必要性によって動機付けられていますが、その知見は既存のEVM [[glossary/Rollup|ロールアップ]]を含むすべてのEVM L2に一般的に適用できます。

# 概要

既存のソリューションとは異なり、[[glossary/State-transition-function|状態遷移関数 (STF)]]の変更や新しいトランザクションタイプを導入することなく、EVM L2の集中型シーケンサーをバイパスするために使用できる、[[glossary/FOCIL|FOCIL]]を介した強制トランザクションメカニズムの実装を提示します。

# 背景

[[glossary/FOCIL|FOCIL]]は、[[glossary/Block|ブロック]]が[[glossary/Attestation|アテステーション]]されるために満たす必要のある新しいトランザクションリスト（「[[glossary/Inclusion-List|インクルージョンリスト]]」）を追加することで、イーサリアムの[[glossary/State-transition-function|STF]]を更新します。このようなトランザクションは、[[glossary/Consensus-Layer|コンセンサス層 (CL)]]側で16の[[glossary/Ethereum-validator|イーサリアムバリデータ]]で構成される「IL委員会」によって選択され、更新された[[glossary/Engine-API|エンジンAPI]]を介して[[glossary/Execution-layer|実行レイヤー (EL)]]に渡されます。

```
def state_transition(​chain: BlockChain, ​​block: Block, ​​inclusion_list_transactions: Tuple[LegacyTransaction | Bytes, ...]​) -> None:
```

[[glossary/Inclusion-List|IL]]内のトランザクションは、以下の3つの理由により、[[glossary/Block|ブロック]]から有効に除外される可能性があります。

-   内部チェック（Intrinsic checks）の失敗：不正なトランザクション、誤ったチェーンID、ガス不足、無効な署名、範囲外のパラメータ。
    
-   ステートフルチェック（Stateful checks）の失敗：[[glossary/nonce|ナンス]]の不一致、残高不足。
    
-   [[glossary/Block|ブロック]]関連チェックの失敗：ガス不足（[[glossary/EIP|EIP]]-1559の[[glossary/base-fee|ベースフィー]]に対して）、[[glossary/Block|ブロック]]内のスペース不足。
    

[[glossary/Block-Building|ビルダー]]が「ブロックスタッフィング」によって意図的にトランザクションを除外する可能性はありますが、プロトコルは[[glossary/EIP|EIP]]-1559の[[glossary/base-fee|ベースフィー]]を増加させ、トランザクションを[[glossary/Mempool|メムプール (Mempool)]]に保持することで、攻撃者に指数関数的なコストを課し、[[glossary/Censorship-Resistance|検閲耐性]]を提供します。このトランザクションは次の[[glossary/Inclusion-List|IL]]に挿入されます。

既存のすべてのEVM L2は現在、新しいトランザクションタイプを導入し、[[glossary/State-transition-function|状態遷移関数]]を変更することで強制トランザクションを実装しています。OPスタックは「デポジットされたトランザクション」タイプを導入しています。これは[[glossary/Layer-1|レイヤー1 (L1)]]イベントから派生し、対応するL2[[glossary/Block|ブロック]]の先頭に自動的に挿入され、L2には署名がなく、[[glossary/Layer-1|L1]]で[[glossary/gas|ガス]]を支払い、L2では[[glossary/gas|ガス]]を消費しません。op-gethのgethに対するすべての変更は[こちら](https://op-geth.optimism.io/)で確認できます。Arbitrumスタックも、署名のない新しいトランザクションタイプ（実際には複数）を導入しており、そのインクルージョンはオンチェーン強制トランザクションキューによって強制されますが、L2で[[glossary/gas|ガス]]を支払います。gethに対するすべての変更は[こちら](https://github.com/OffchainLabs/nitro)で確認できます。最も重要なのは、どちらの場合も、強制的にインクルードされるトランザクションリストに入った有効なトランザクションが、[[glossary/Block|ブロック]]の満杯や[[glossary/base-fee|ベースフィー]]のために有効に除外されることはないということです。それらのためのスペースは常に予約されており、[[glossary/base-fee|ベースフィー]]は考慮されないか、リトライメカニズムが実装されています。

# メカニズム

核となる直感は、[[glossary/FOCIL|FOCIL]]の[[glossary/Consensus-Layer|CL]]と[[glossary/Mempool|メムプール (Mempool)]]ロジックが[[glossary/Layer-1|L1]]上の[[glossary/Smart-contract|スマートコントラクト]]によって完全に置き換えられ、複製できるということです。ユーザーは、従来のL2 [[glossary/Mempool|メムプール (Mempool)]]の代わりに（おそらく[[glossary/Layer-1|L1]] [[glossary/FOCIL|FOCIL]]を介して！）[[glossary/Layer-1|L1]] [[glossary/Smart-contract|スマートコントラクト]]に強制トランザクションを送信します。この[[glossary/Smart-contract|スマートコントラクト]]が[[glossary/Inclusion-List|インクルージョンリスト]]を構築し、[[glossary/Engine-API|エンジンAPI]]が[[glossary/Execution-layer|EL]]に渡すのと同様の方法で、L2 [[glossary/State-transition-function|STF]]検証者にインプットとして渡します。L2 [[glossary/State-transition-function|STF]]は、[[glossary/EIP|EIP]]-8025によって導入された[ステートレス[[glossary/State-transition-function|STF]]関数](https://github.com/ethereum/execution-specs/blob/215249bde87882dfbc8287e0c33309632fa089bb/src/ethereum/forks/amsterdam/stateless.py#L359)とまったく同じであると仮定します。8025はまだ[[glossary/Hegot|ヘゴタ (Hegotá)]]の上に構築されていないため、[[glossary/FOCIL|FOCIL]]を考慮していません。そのため、ステートレスな[[glossary/Inclusion-List|IL]]インターフェースを自由に想像します。

[![L1のFOCILチェックに関わるCLおよびELコンポーネントを「L2 FOCIL」がどのように置き換えるかを示す図。](https://ethresear.ch/uploads/default/optimized/3X/0/8/08efa2457f4eee0e860152037cb8a0e4e63cddda_2_648x500.png)](https://ethresear.ch/uploads/default/original/3X/0/8/08efa2457f4eee0e860152037cb8a0e4e63cddda.png "L1のFOCILチェックに関わるCLおよびELコンポーネントを「L2 FOCIL」がどのように置き換えるかを示す図。")

*L1の[[glossary/FOCIL|FOCIL]]チェックに関わる[[glossary/Consensus-Layer|CL]]および[[glossary/Execution-layer|EL]]コンポーネントを「L2 [[glossary/FOCIL|FOCIL]]」がどのように置き換えるかを示す図。*

[[glossary/Mempool|メムプール (Mempool)]]の動作を複製し、[[glossary/Censorship-Resistance|検閲耐性]]を保証するためには、既存の強制トランザクションメカニズムとは異なり、[[glossary/FOCIL|FOCIL]]は特定の[[glossary/Block|ブロック]]へのインクルージョンを実際に保証しないため、L2 [[glossary/Inclusion-List|IL]]に到達したトランザクションが自動的にドロップされないようにする必要があります。さらに、有効なトランザクションに対する[[glossary/DoS-attacks|DoS攻撃]]を防ぐため、無効なトランザクションは[[glossary/Inclusion-List|IL]]を可能な限り汚染しないようにし、[[glossary/prover|プルーバー]]側の無駄な計算を防ぐ必要があります。

[[glossary/Operator|オペレーター]]が投稿する各L2バッチは1つのL2[[glossary/Block|ブロック]]に対応すると仮定します。そうでない場合、[[glossary/Operator|オペレーター]]は常に空の[[glossary/Block|ブロック]]を生成して[[glossary/base-fee|ベースフィー]]を削減し、安価にブロックスタッフィング攻撃を実行できるからです。これは今日のほとんどの[[glossary/Rollup|ロールアップ]]には当てはまりませんが、[フラッシュブロック](https://docs.base.org/base-chain/flashblocks/overview)のような技術でより高速な[[glossary/Block|ブロック]]をシミュレートできます。

したがって、強制トランザクション[[glossary/Smart-contract|コントラクト]]を次のように設計します。ユーザーは、`maxFeePerGas`の降順でソートされたオンチェーンリストに署名済みトランザクションを送信します。送信時に、すべての内部チェック（すなわちステートレスチェック）が実行されます。[[glossary/Validity-Only-Partial-Statelessness|Validity-Only Partial Statelessness (VOPS)]]の研究投稿と[こちら](https://hackmd.io/PrO6DT7qQEOvsIyMSOci4g)で説明されているように、健全な[[glossary/Mempool|メムプール (Mempool)]]を維持するためには、ステートフルチェックの実行が不可欠です。L2 [[glossary/FOCIL|FOCIL]]では、送信されたトランザクションは[[glossary/Layer-1|L1]]で[[glossary/gas|ガス]]を支払いますが、非常に高い`maxFeePerGas`を持つものの、[[glossary/nonce|ナンス]]が無効であったり、残高が不足しているトランザクションでリストの先頭を埋め尽くすことは安価であり、[[glossary/Inclusion-List|IL]]に無効なトランザクションのみが含まれる原因となります。そのため、[[glossary/Validity-Only-Partial-Statelessness|VOPS]]は、ステートレスノードが[[glossary/Block-level-Access-Lists|ブロックレベルアクセスリスト (BALs)]]を介して各アカウントの残高と[[glossary/nonce|ナンス]]を維持することを提案しています。EVM L2も[[glossary/Block-level-Access-Lists|BALs]]を生成および公開できますが、[[glossary/Smart-contract|スマートコントラクト]]で残高と[[glossary/nonce|ナンス]]を維持することは非現実的です。[[glossary/Layer-1|L1]]の場合、推定ストレージはすでに約8.4GBに達しており、L2ではさらに大幅に高くなる可能性があります。したがって、ユーザーはリストに受け入れられるために、最近のL2状態に対する`eth_getProof`を介して取得された[[glossary/Account-proof|アカウント証明]]を提出する必要があります。[[glossary/FOCIL|FOCIL]]は、[[glossary/Inclusion-List|インクルージョンリスト]]内のトランザクションが含まれたかどうか、またその理由を教えてくれないため、これらのチェックの後でも[[glossary/Inclusion-List|IL]]に到達したトランザクションは自動的にドロップできません。2つのメカニズムを使用できます。

1.  パーミッションレスな`prune`関数が追加されます。これは、新しい[[glossary/Block|ブロック]]に対する[[glossary/Account-proof|アカウント証明]]が与えられた場合、[[glossary/nonce|ナンス]]が変更されたか、残高が不足になったことを証明します。[[glossary/EIP-7702|EIP-7702]]が、アカウント残高は[[glossary/nonce|ナンス]]が増加した場合にのみ減少するという不変条件を破ったため、[[glossary/nonce|ナンス]]チェックだけでは不十分であることに注意することが重要です。[[glossary/Incentive-Compatibility-condition|インセンティブ整合性条件 (IC条件)]]を達成するために、強制トランザクションの提出者には、トランザクションが無効になった場合に[[glossary/pruners|プルーナー]]に返金するための少額の[[glossary/bond|ボンド]]を提出するよう求めることができます。
    
2.  [[glossary/Operator|オペレーター]]は、決済中に[[glossary/tx-root|トランザクションルート]]に対する[[glossary/merkle-proof|マークル証明]]を提供します。[[glossary/Inclusion-List|IL]]が[[glossary/State-transition-function|STF]]によって検証される（例：[[glossary/Zero-Knowledge-Proof|ゼロ知識証明]]を介して）ことを考えると、トランザクションが含まれておらず、[[glossary/Block|ブロック]]にスペースが残っていた場合、そのトランザクションは無効であったと判断でき、ドロップできます。推定コスト：[[glossary/Inclusion-List|IL]]内のトランザクションあたり約275k [[glossary/gas|ガス]]、32トランザクションは10M [[glossary/gas|ガス]]以内であり、マルチプルーフを使用すればさらに低くなる可能性があります。[[glossary/Inclusion-List|IL]]内のトランザクションが無効であっても、[[glossary/Block|ブロック]]にスペースが残っていなかった場合、[[glossary/Block|ブロック]]満杯のケースと無効なケースを区別できないため、トランザクションはドロップされません。[[glossary/EIP|EIP]]-1559の[[glossary/base-fee|ベースフィー]]メカニズムは、十分な弾力性があることを前提として、十分なスペースを持つ[[glossary/Block|ブロック]]が最終的に生成されることを保証します。
    

L2 [[glossary/Operator|オペレーター]]は、L2[[glossary/Block|ブロック]]で[[glossary/settlement-function|決済関数]]を呼び出す際に、事前に定義された[[glossary/gas-budget|ガスバジェット]]まで、またはトランザクションが現在の[[glossary/base-fee|ベースフィー]]に対して十分な支払いをしないようになるまで、リストの先頭にあるトランザクションから現在の[[glossary/Inclusion-List|IL]]をプルします。このような[[glossary/Inclusion-List|IL]]はオンチェーン検証者への入力として強制され、その充足は有効性ルールと見なされます。[[glossary/Race-conditions|競合状態]]や[[glossary/Griefing-attacks|グリーフィング攻撃]]を防ぐため、[[glossary/Inclusion-List|IL]]は、[[glossary/prover|プルーバー]]が強制的に含めるべき正確なトランザクションを事前に知ることができるように、閾値よりも古いトランザクションのみで構築できます。L2の集中型シーケンサーが[[glossary/Block|ブロック]]の生成を完全に拒否した場合、オンチェーンでタイムアウトがトリガーされ、[[glossary/whitelist|ホワイトリスト]]が削除され、[[glossary/Censorship-Resistance|検閲耐性]]が回復されます。

具体的な実装は[こちら](https://github.com/l2beat/native-rollups/pull/4/changes#diff-4daf5023f543ed3a3651009a23d241096abec13cd4b9b1fb5471f808e31f5664R24)で確認できます。送信には約1.3M [[glossary/gas|ガス]]、プルーニングには約1.1M [[glossary/gas|ガス]]がかかると推定されており、どちらも1 gwei/[[glossary/gas|ガス]]で約0.001 ETHに相当します。

この研究投稿の範囲外ですが、強制トランザクション[[glossary/Smart-contract|コントラクト]]は、特定のL2のニーズに基づいて、受け入れられる前に追加のチェックを実行するように自然にカスタマイズできます。

# アカウントのみのノード

今日、[[glossary/Account-proof|アカウント証明]]を取得するにはフルノードに接続する必要があり、ほとんどのユーザー、特にL2ユーザーにとっては法外なコストがかかります。[[glossary/Validity-Only-Partial-Statelessness|Validity-Only Partial Statelessness (VOPS)]]の提案は、[[glossary/zkEVM|zkEVM (ゼロ知識イーサリアム仮想マシン)]]と組み合わせることで、[[glossary/attesters|アテスター]]と[[glossary/includers|インクルーダー]]の[[glossary/storage-load|ストレージ負荷]]を約233GiBから約8.4GiBに削減することを目指しています。これは、証明を使って状態を検証し、[[glossary/Block-level-Access-Lists|ブロックレベルアクセスリスト (BALs)]]を介して取得された残高と[[glossary/nonce|ナンス]]のみを保存することで健全な[[glossary/Mempool|メムプール (Mempool)]]を維持するものです。L2も証明を投稿し、[[glossary/Block-level-Access-Lists|BALs]]を投稿できるようになるため、L2ユーザー向けに同様のタイプのノードを想定できます。これにより、ユーザーは完全な状態を維持することなく、検閲が発生した場合に強制トランザクションをより簡単に送信できるようになります。残念ながら、[[glossary/Block-level-Access-Lists|BALs]]はストレージ差分のみを投稿するため、[[glossary/Account-proof|アカウント証明]]を提供するために必要な[[glossary/storage-root|ストレージルート]]を再構築するには、完全な状態を追跡する必要があります。参考までに、[[glossary/Block-level-Access-Lists|BAL]]は次のように定義されます。

```
BlockAccessList = List[AccountChanges]

AccountChanges = [
    Address,                    # address
    List[SlotChanges],          # storage_changes (slot -> [block_access_index -> new_value])
    List[StorageKey],           # storage_reads (read-only storage keys)
    List[BalanceChange],        # balance_changes ([block_access_index -> post_balance])
    List[NonceChange],          # nonce_changes ([block_access_index -> new_nonce])
    List[CodeChange]            # code_changes ([block_access_index -> new_code])
]
```

一方、[[glossary/Account|アカウント]]はトライ（trie）内で次のようにシリアライズされます。

```
def encode_account(​raw_account_data: Account, ​​storage_root: Bytes​) -> Bytes:
   """
   Encode `Account` dataclass.

   Storage is not stored in the `Account` dataclass, so `Accounts` cannot be

   encoded without providing a storage root.
   """

   return rlp.encode(
       (
           raw_account_data.nonce,
           raw_account_data.balance,
           storage_root,
           raw_account_data.code_hash,
       )
   )
```

もし[[glossary/Block-level-Access-Lists|BALs]]が[[glossary/storage-root|ストレージルート]]の変更も提供するように変更された場合（[[glossary/Block|ブロック]]の最後にある最後のものだけで十分です）、ノードは完全な状態を維持することなく[[glossary/Account-proof|アカウント証明]]を構築できるようになります。[[glossary/EIP|EIP]]-8268（参照を提供してくれた[Toni](https://x.com/nero_eth)に感謝します！）は、まさにこの変更を提案しています。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/repurposing-focil-as-an-l2-forced-transaction-mechanism/25233)
