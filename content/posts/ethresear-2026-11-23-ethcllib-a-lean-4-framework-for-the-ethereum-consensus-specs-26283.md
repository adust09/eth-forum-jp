---
title: 'EthCLLib: Ethereumコンセンサス仕様のためのLean 4フレームワーク'
original_title: 'EthCLLib: a Lean 4 framework for the Ethereum consensus specs'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/ethcllib-a-lean-4-framework-for-the-ethereum-consensus-specs/26283
author: leolara
date: '2026-11-23'
category: Consensus
tags:
  - consensus
  - protocol-design
  - formal-verification
  - research
  - eip
  - cryptography
topic_id: '26283'
translated_at: '2026-11-24'
translator: gemini-2.5-flash
---

> [!note] 原文
> [EthCLLib: a Lean 4 framework for the Ethereum consensus specs](https://ethresear.ch/t/ethcllib-a-lean-4-framework-for-the-ethereum-consensus-specs/26283) — leolara (2026-11-23)

この投稿のインスピレーションを与えてくれた[@alexanderlhicks](https://ethresear.ch/u/alexanderlhicks)に感謝します。

[前回の更新](https://ethresear.ch/t/etheorem-update-the-complete-executable-consensus-specs-written-in-lean-4/26063)では、Lean 4で書かれたEtheoremコンセンサス仕様、Fulu、Gloas、Hezeがpyspecのテストベクトルに合格したことを示しました。私たちは2026年6月に開始した1つのパッケージ、EthCLLibで3つの[[glossary/fork|フォーク]]を記述しています。その投稿では仕様がどのように見えるかを示しました。今回の投稿では、その基盤となるフレームワークについて説明します。つまり、フォークを記述する人々に何を提供し、それについて何かを証明する人々に何を提供し、そしてどこを目指しているのか、ということです。

## EthCLLibが提供するもの

**差分としてのフォーク。** フォークは、`fork Gloas from Fulu`という1行で親を宣言し、変更点のみを記述します。`inherit`を使用すると、コンテナ、関数、定数が親から継承されます。継承された関数は子フォーク内で再解釈されるため、その呼び出しは子自身のコンテナ、定数、およびオーバーライドに解決されます。定数はフォークごとに1つの階層に存在します。1つのコンテナ宣言で、メインネットと最小限のプリセット、およびそれらのSSZインスタンスが提供されます。

```lean
-- Gloas/Fork.lean: the parent, in one line
fork Gloas from Fulu

-- Gloas/Constants.lean: constants from the parent, and one of the fork's own
inherit slotsPerEpoch slotsPerHistoricalRoot epochsPerHistoricalVector
forkabbrev ptcSize : Nat := Preset.ptcSize

-- Gloas/Transition.lean: block steps that EIP-7732 leaves unchanged
inherit processRandao
inherit processEth1Data
inherit verifyBlockSignature
```

同じ名前の宣言はオーバーライドです。Fuluはアテステーションのビットをプリセット定数でサイズ指定しますが、Gloasはプログレッシブビットリストでコンテナを書き換えます。

```lean
-- Fulu
forkcontainer Attestation where
  aggregationBits : Bitlist (Const.maxValidatorsPerCommittee * Const.maxCommitteesPerSlot)
  data            : AttestationData
  signature       : BLSSignature
  committeeBits   : Bitvector Const.maxCommitteesPerSlot

-- Gloas
forkcontainer Attestation where
  aggregationBits : ProgressiveBitlist
  data            : AttestationData
  signature       : BLSSignature
  committeeBits   : Bitvector Const.maxCommitteesPerSlot
```

Gloasが継承し、アテステーションを読み取るすべての関数は、Gloasのアテステーションを読み取ります。

**ジェネリックな仕様本体。** 仕様本体は、以下に対してジェネリックです。

-   プリセット（メインネットまたはミニマル）
-   設定値
-   ハッシュ関数
-   BLSおよびKZGバックエンド
-   状態とエラーを持つエフェクトモナド
-   状態のMerkleキャッシュ
-   [[glossary/fork-choice|フォーク選択]]ストアの有限マップ

仕様の各使用箇所は、独自のインスタンスを選択します。テストランナーと証明はこれらを選択します。

| パラメータ | テストランナー | 証明 |
| --- | --- | --- |
| エフェクトモナド | EStateM | StateT State (Except _) |
| ハッシュ関数 | FFI経由のSHA-256 | Leanカーネル内で還元可能な純粋Lean SHA-256 |
| Merkleキャッシュ | キャッシュされたツリー | キャッシュなし |
| フォーク選択マップ | hashMap | treeMap |
| BLSおよびKZG | FFI経由のblstおよびKZG | シンボリック |

証明には、Leanカーネル内で還元されるインスタンスが必要です。シンボリックバックエンドでは署名チェックが真であると仮定されるため、定理はBLSセキュリティに依存する内容を何も述べません。

著者はセクションの冒頭に一度`state_section`を記述します。このマクロはパラメータでセクションを開き、内部のすべての`forkdef`はそれらに対してジェネリックになります。

```lean
state_section
--   variable [Preset] [HasherTag]
--   variable [Config] [CryptoBackend]
--   variable {StateTransition : Type → Type}
--   variable [Monad StateTransition]
--   variable [MonadStateOf State StateTransition]
--   variable [MonadExceptOf StateTransitionError StateTransition]
```

インスタンスは単純な定義です。例えば、2つのハッシュ関数は次のようになります。

```lean
-- the runner: SHA-256 over FFI
@[reducible] def fastHasherTag : HasherTag := { H := Sha256, hasher := inferInstance }
-- the proofs: pure-Lean SHA-256, reducible in the kernel
@[reducible] def pureHasherTag : HasherTag := { H := Sha256Spec, hasher := inferInstance }
```

そして、証明のBLSバックエンドは次のようになります。

```lean
@[reducible] def symbolic : CryptoBackend where
  verify _ _ _                    := true
  fastAggregateVerify _ _ _       := true
  ethFastAggregateVerify _ _ _    := true
  aggregatePubkeys _              := ⟨Array.replicate 48 0⟩
  kzgVerifyCellProofBatch _ _ _ _ := true
```

**すべての状態遷移はモナド的です。** 状態を読み書きする仕様のすべての関数は、`StateTransition α`型のステップであり、エラーを伴うステートモナド内のプログラムです。これは最上位の`stateTransition`から各`process_*`関数まで適用されます。モナドは状態を運びます。したがって、関数はpyspecの順序でのステップのリストであり、誰も手動で状態を渡す必要はありません。pyspecの`process_epoch`は次のとおりです。

```python
def process_epoch(state: BeaconState) -> None:
    process_justification_and_finalization(state)
    process_inactivity_updates(state)
    process_rewards_and_penalties(state)
    process_registry_updates(state)
    process_slashings(state)
    process_eth1_data_reset(state)
    process_pending_deposits(state)
    process_pending_consolidations(state)
    process_effective_balance_updates(state)
    process_slashings_reset(state)
    process_randao_mixes_reset(state)
    process_historical_summaries_update(state)
    process_participation_flag_updates(state)
    process_sync_committee_updates(state)
    process_proposer_lookahead(state)
```

そしてEtheoremでは次のようになります。

```lean
forkdef processEpoch : StateTransition Unit := do
  processJustificationAndFinalization
  processInactivityUpdates
  processRewardsAndPenalties
  processRegistryUpdates
  processSlashings
  processEth1DataReset
  processPendingDeposits
  processPendingConsolidations
  processEffectiveBalanceUpdates
  processSlashingsReset
  processRandaoMixesReset
  processHistoricalSummariesUpdate
  processParticipationFlagUpdates
  processSyncCommitteeUpdates
  processProposerLookahead
```

[[glossary/fork-choice|フォーク選択]]は同じ形状を持つ2番目のマシンです。ハンドラーはストアに対する`StoreTransition α`であり、`onBlock`はその中で状態遷移全体を実行します。

```lean
forkdef onBlock (signedBlock : SignedBeaconBlock) (columns : Array DataColumnSidecar) :
    StoreTransition Unit := do
  let store ← get
  let block := signedBlock.message
  …
  assert (currentSlot ≥ block.slot)
  …
  let postState ← runNestedStateTransition parentState (stateTransition signedBlock)
  …
```

状態遷移は一度記述され、両方のマシンで機能します。`onBlock`内で拒否された場合、そのエラーは`.transition e`としてストアに到達し、ハンドラーも拒否します。

モナドは証明の形も決定します。証明では`StateT State (Except _)`であり、2つの等式があらゆる実行を記述します。

```lean
theorem run_bind (x : StateT σ (Except ε) α) (f : α → StateT σ (Except ε) β) (s : σ) :
    (x >>= f).run s = (x.run s) >>= fun p => (f p.1).run p.2 := rfl

theorem run_pure (a : α) (s : σ) :
    (pure a : StateT σ (Except ε) α).run s = .ok (a, s) := rfl
```

これらにより、`processEpoch`の15行は、サブステップごとに1つの等式からなる15の等式の連鎖となります。エポックの特性は、各サブステップの特性から構築でき、拒否はpyspecが例外を発生させる箇所で連鎖を停止させます。

**型付きエラー。** 拒否は型付きエラーとともにモナドを通過します。`assert`、`outOfBounds`、`arithmetic`、`listFull`に加え、ストア側では`missingKey`と`decodeFailure`があります。適合性ランナーはコンストラクタを読み取り、テストベクトルがその拒否を期待しているかどうかを判断します。さらに2つのコンストラクタがスコープの可視性を維持します。`todo`はまだ記述されていないブランチを示し、そこに到達したテストベクトルは実行に失敗します。`outOfScope`はモデル化しないと決定したブランチを示し、ランナーはそれをスキップとして報告します。

```lean
inductive StateTransitionError where
  | assert (descr : String)          -- a spec assertion failed
  | todo (what : String)             -- a branch not written yet, reported xfail
  | outOfScope (what : String)       -- a branch we do not model, reported skip
  | outOfBounds (idx bound : Nat)    -- an index past the end
  | arithmetic (descr : String)      -- a uint64 overflow, underflow or zero divisor
  | listFull (field : String)        -- an SSZ list over its limit
```

フォーク本体では、`assert`はpyspecのものと同様に読み取られ、`.assert`で拒否します。`assertH`はチェックした命題も返し、次の行ではそれを使用してランタイムチェックなしでインデックスを付けます。

```lean
forkdef processVoluntaryExit (sve : SignedVoluntaryExit) : StateTransition Unit := do
  let state ← get
  let ve := sve.message
  let hb ← assertH (ve.validatorIndex.toNat < (sszGet state validators).size)
  let validator := (sszGet state validators)[ve.validatorIndex.toNat]'hb.down

  assert (isActiveValidator validator (currentEpochOf state))
  assert (hasNotInitiatedExit validator)
  assert (currentEpochOf state ≥ ve.epoch)
  assert (passedShardCommitteePeriod validator (currentEpochOf state))
  assert (getPendingBalanceToWithdraw state ve.validatorIndex == 0)
  -- signature verification and exit initiation follow
```

**pyspec整数に従う算術。** pyspecには2種類の整数があります。`Uint64`とそのサブクラス（`Gwei`、`Slot`、`Epoch`など）は各演算を計算し、結果が`[0, 2^64)`の範囲外になるか、除数がゼロの場合に例外を発生させます。Pythonの`int`は`len`、`range`、またはリテラルから派生します。これは無制限で符号付きです。仕様テキストには、`uint64`がオーバーフローまたはアンダーフローする遷移は無効であると記載されています。

Leanの`UInt64`と`Nat`は設計上全域であり、モジュラーおよびフロアされた結果を返しますが、仕様は拒否を要求します。そのため、EthCLLibは各pyspecの種類を独自の型でモデル化しています。

| pyspec | EthCLLib | 挙動 |
| --- | --- | --- |
| Uint64とそのサブクラス | CLUint64 | + - * / % はChecked CLUint64を返し、範囲外またはゼロ除算でエラーとなる |
| int | CLInt | 無制限で符号付き、Pythonと同様のフロア除算、ゼロ除算でエラーとなる |
| 例外 | Checked α | 値または型付きエラー、遷移エラーに昇格される |

契約は1つのルールです。モデル化されたすべての関数とすべての入力について、Lean関数はpyspec関数が例外を発生させるときに拒否し、どちらも失敗しない場合は結果が等しくなります。フォーク本体はpyspecと同じ式を記述し、`←`は計算が失敗する可能性がある箇所を示します。

```python
reward_numerator = base_reward * weight * unslashed_participating_increments
rewards[index] += reward_numerator // (active_increments * WEIGHT_DENOMINATOR)
```

```lean
let rewardNumerator ← baseReward * weight * unslashedIncrements
let previousReward ← sszGetIdx rewards index
let rewardDelta ← rewardNumerator / (activeIncrements * Const.weightDenominator)
let updatedReward ← previousReward + rewardDelta
```

各操作はPythonと同様に個別にチェックされます。`baseReward * weight`が2^64を超えた場合、最終的な商が収まる場合でも、積は失敗します。`CLUint64`にはラッピング演算子がないため、フォーク本体はラッピング加算を記述できません。ルールのもう半分、どこにバインドするかについては、レビューと範囲の端での挙動テストで確認します。アップストリームのテストベクトルはアサーションに焦点を当てているため、これらのエッジテストは私たち独自のものとなります。

証明については、すべての演算子に法則が付属しています。いつ成功し、何を返すか、です。算術を含む関数に関する定理は、そのオーバーフロー条件を仮説として記述します。これらは仕様自体の条件です。

完全な契約は、テーブルごとに[SPEC_ARITHMETIC.md](https://github.com/etheorem/etheorem/blob/d370c426ce77ee95c9d18cdfa396c7a559ed936f/packages/EthCLSpecs/docs/SPEC_ARITHMETIC.md)に記載されています。

**各証明は関数に紐付けられています。** 定理は、フォーク自身の宣言に対して、証明インスタンスとともに記述されます。`@[characterizes ...]`タグは、それが記述する仕様関数の名前を示します。READMEのカバレッジテーブルは、これらのタグから生成されます。現在、3つのフォークの625の関数中、19の仕様関数が特徴付けられ、58が触れられています。まだ初期段階です。[証明台帳](https://github.com/etheorem/etheorem/blob/d370c426ce77ee95c9d18cdfa396c7a559ed936f/packages/EthCLSpecs/docs/PROOF_LEDGER.md)には次の候補がリストされています。私たちはAI支援を受けて証明を記述しています。Leanカーネルはすべての定理を同じ方法でチェックし、`#print axioms`は各定理が何に基づいているかをリストします。

Gloasからの例です。タグは定理を仕様関数にリンクし、ステートメントはビルダーがいつその入札をカバーできるかを述べています。

```lean
@[characterizes EthCLSpecs.Gloas.canBuilderCoverBid]
theorem canBuilderCoverBid_iff [Preset] [HasherTag] :
    ∀ (state : BeaconState) (builderIndex : BuilderIndex) (bidAmount : Gwei),
      canBuilderCoverBid (pureState state) builderIndex bidAmount = true ↔
        let builderBalance := state.builders[builderIndex.toNat]!.balance
        let minBalance :=
          Gloas.Const.minDepositAmountG +
          getPendingBalanceToWithdrawForBuilder (pureState state) builderIndex
        minBalance ≤ builderBalance ∧ bidAmount ≤ builderBalance - minBalance
```

この関数は、ビルダー残高が最低額（デポジット額と引き出し保留中の額の合計）をカバーし、かつ入札額が残りの額に収まる場合にのみ`true`を返します。

フレームワーク自体は、エラボレーターとモナドで構成されています。その正しさの主張は、それを用いて記述されたフォークがアップストリームのテストベクトルに合格することであり、フレームワーク自体は証明を運びません。

## 次に: [[glossary/EIP|EIP]]を単位として

consensus-specsは、[[glossary/EIP|EIP]]を機能として`specs/_features/`で開発しており、それぞれがスケジューリングされる前にフォークの上に記述されます。EthCLLibでは、単位はまだフォークです。GloasはFuluに[[glossary/ePBS|ePBS (enshrined Proposer-Builder Separation)]]とEIP-8282を加えたものであり、HezeはGloasに[[glossary/FOCIL|FOCIL (強制オンチェーンインクルージョンリスト)]]を加えたものである、という具合です。

私たちはLeanでも同じ単位、つまり証明が付属した単位を望んでいます。[[glossary/EIP|EIP]]は、他の[[glossary/EIP|EIP]]とは独立して、フォークの上に適用される独自のオーバーライドと新しい宣言のセットとなるでしょう。フォークは[[glossary/EIP|EIP]]のリストとなるでしょう。そうすれば、1つの[[glossary/EIP|EIP]]の特性を、それがどのフォークに含まれるかを決定する前に、単独で記述し証明することができます。

2つの問題が未解決です。1つ目は証明の転送です。EthCLLibの継承はシンボルによって機能するため、現在、関数について証明された特性は、それを再解釈する各フォークで再度証明されます。[[glossary/EIP|EIP]]がフォーク間を移動する際に、その証明も一緒に移動することを望んでいます。2つ目は合成です。同じ関数をオーバーライドする2つの[[glossary/EIP|EIP]]がいつ可換であるか、そして可換でない場合にどのように順序付けるか、です。

## フィードバック歓迎

コードは[github.com/etheorem/etheorem](https://github.com/etheorem/etheorem)にあります。フレームワークを文書化した3つのファイルがあります。[Spec-Authoring Model](https://github.com/etheorem/etheorem/blob/d370c426ce77ee95c9d18cdfa396c7a559ed936f/packages/EthCLSpecs/docs/SPEC_AUTHORING_MODEL.md)、[Framework Architecture](https://github.com/etheorem/etheorem/blob/d370c426ce77ee95c9d18cdfa396c7a559ed936f/packages/EthCLSpecs/docs/FRAMEWORK_ARCHITECTURE.md)、および[Specs Architecture](https://github.com/etheorem/etheorem/blob/d370c426ce77ee95c9d18cdfa396c7a559ed936f/packages/EthCLSpecs/docs/SPECS_ARCHITECTURE.md)です。

読者の皆様に2つの質問があります。[[glossary/EIP|EIP]]に取り組んでいる場合、どの[[glossary/EIP|EIP]]を最初に単位として記述し証明したいですか？また、仕様のバージョン間で証明を移動させることに関する先行研究をご存知でしたら、ぜひ教えてください。

Leo Lara

*2投稿 - 2参加者*

[トピック全文を読む](https://ethresear.ch/t/ethcllib-a-lean-4-framework-for-the-ethereum-consensus-specs/26283)
