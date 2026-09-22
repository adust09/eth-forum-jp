---
title: 'Etheoremアップデート: Lean 4で書かれた完全な実行可能コンセンサス仕様'
original_title: 'Etheorem update: the complete executable consensus specs written in Lean 4'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/etheorem-update-the-complete-executable-consensus-specs-written-in-lean-4/26063
author: leolara
date: '2026-09-21'
category: Consensus
tags:
  - consensus
  - formal-verification
  - protocol-design
  - research
  - cryptography
  - verification
  - lean-4
  - ssz
topic_id: '26063'
translated_at: '2026-09-22'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Etheorem update: the complete executable consensus specs written in Lean 4](https://ethresear.ch/t/etheorem-update-the-complete-executable-consensus-specs-written-in-lean-4/26063) — leolara (2026-09-21)

今年の5月、私たちは[[Lean-4|Lean 4]]で書かれた完全な実行可能コンセンサス仕様 (executable consensus specs) であるEtheoremの開発を開始しました。

この記事は、プロジェクトの現状に関するアップデートです。[[Lean-4|Lean 4]]の仕様は、Fulu、[[glossary/Gloas|Gloas]]、[[glossary/Heze|Heze]]の3つの[[fork|フォーク]]において、[[glossary/State-transition-function|状態遷移関数]]、[[glossary/fork-choice|フォーク選択]]、および私たちがモデル化したコンテナに関するすべてのpyspecベクトルをパスしています。これには、[[glossary/mainnet|メインネット]]とミニマルの2つのプリセットが含まれます。

この記事では、スタック、フレームワーク、および仕様がどのように見えるかを説明します。また、フレームワークがどのように証明を簡単に記述できるようにするかについても示します。

[![etheorem_owl (1)](https://ethresear.ch/uploads/default/optimized/3X/b/1/b16e0b1c37ab4b0b4cc5e6db36dcece442d89146_2_690x376.jpeg)](https://ethresear.ch/uploads/default/original/3X/b/1/b16e0b1c37ab4b0b4cc5e6db36dcece442d89146.jpeg "etheorem_owl (1)")

## スタック

このプロジェクトはパッケージのモノレポ (monorepo) です。スタックとして構成されています。

```
   Fulu spec        Gloas spec       Heze spec
   Fulu proofs      Gloas proofs     Heze proofs
   ─────────────────────────────────────────────────
                    EthCLLib
            (the consensus spec framework)
   ─────────────────────────────────────────────────
                    SizzLean
            (SSZ, machine-checked proofs)
   ─────────────────────────────────────────────────
   LeanSha256 (pure) · LeanHazmat (FFI bridges: BLS, KZG, native SHA-256)
```

最上位層の各[[fork|フォーク]]には、同じレベルで2つの部分があります。仕様の実行可能な実装と、仕様に関する証明です。どちらも同じ定義から読み込みます。フレームワークパッケージはEthCLLibで、[[fork|フォーク]]本体はEthCLSpecsという兄弟パッケージに存在し、これがコードで表示される名前空間です。

## [[glossary/SizzLean|SizzLean]]: [[glossary/Simple-Serialize|SSZ]]ベース

[[glossary/SizzLean|SizzLean]]については前回の記事（[Lean4 SSZ library: formally verified and easy to use](https://ethresear.ch/t/lean4-ssz-library-formally-verified-and-easy-to-use/25988)）で説明したため、ここでは繰り返しません。要するに、私たちが知る限り、[[Lean-4|Lean 4]]で最初の[[glossary/Simple-Serialize|SSZ（シンプルシリアライズ）]]ライブラリであり、現在、[[Lean-4|Lean 4]]による[[glossary/State-transition-function|コンセンサス状態遷移関数]]と[[glossary/fork-choice|フォーク選択]]のレンダリングの下で動作する唯一の公開ライブラリです。シリアライゼーション、デシリアライゼーション、および[[glossary/Merkleization|マークル化]]は、中心的な特性の機械検証済み証明 (machine-checked proofs) を持ち、完全なアップストリームのコンフォーマンスコーパスをパスしています。上記のスタックでは最下層であり、[[glossary/State-transition-function|コンセンサス仕様]]のすべてのコンテナはこれを通じてシリアライズされ、ハッシュ化されます。

## EthCLLib: フレームワーク

EthCLLibは、フォーム、コンテナ、関数、定数/プリセット、および[[fork|フォーク]]間の継承システムを定義するためのオーサリングサーフェスを提供するため、その[[fork|フォーク]]で変更されるものだけを記述すれば済みます。

これがコードの核心です。EthCLLibと他のレイヤーとのインターフェースは慎重に手作りされており、[[glossary/AI-agents|AIエージェント]]が問題なくアーキテクチャを理解できるように、Markdownで広範に文書化されています。

これは主に3つのドキュメントにまとめられています。

-   [The Spec-Authoring Model](https://github.com/etheorem/etheorem/blob/d30e899c2dabeec84789b3b500fe44e06994cf61/packages/EthCLSpecs/docs/SPEC_AUTHORING_MODEL.md)
-   [The Framework Architecture](https://github.com/etheorem/etheorem/blob/d30e899c2dabeec84789b3b500fe44e06994cf61/packages/EthCLSpecs/docs/FRAMEWORK_ARCHITECTURE.md)
-   [The Specs Architecture](https://github.com/etheorem/etheorem/blob/d30e899c2dabeec84789b3b500fe44e06994cf61/packages/EthCLSpecs/docs/SPECS_ARCHITECTURE.md)

**コンテナの定義。** コンテナはフィールドリストであり、フィールドはプリセット定数によってサイズを決定できます。

```
forkcontainer Attestation where
  aggregationBits : Bitlist (Const.maxValidatorsPerCommittee * Const.maxCommitteesPerSlot)
  data            : AttestationData
  signature       : BLSSignature
  committeeBits   : Bitvector Const.maxCommitteesPerSlot
```

容量の境界はシンボリックであり、インスタンス化時に[[fork|フォーク]]の`Const`ティアを通じて解決されます。1つの宣言は`[Preset]`でパラメータ化された構造体に展開され、[[glossary/Simple-Serialize|SSZ]]インスタンスはプリセット（[[glossary/mainnet|メインネット]]とミニマル）ごとに導出されます。それに対する関数は一度だけ記述され、`sszGet attestation aggregationBits`として、両方のプリセットで変更なく実行されます。コンフォーマンス実行では、例えば同じ`ssz_static`コードが[[glossary/mainnet|メインネット]]とミニマルでパスすることが示されています。

**関数の定義。** すべての仕様関数は`forkdef`定義です。セクションヘッダーは汎用性のための配管を作成し、マクロによって生成されるため、作成者がこれを記述することはありません。

```
state_section

forkdef processSlashingsReset : StateTransition Unit := do
  …
```

**定数の定義。** 定数は[[fork|フォーク]]ごとの`Const`ティアに存在します。一部はプリセットから、一部は[[fork|フォーク]]独自のものです。

```
forkabbrev ptcSize : Nat := Preset.ptcSize
forkabbrev builderWithdrawalPrefix : UInt8 := 0x03
```

`ptcSize`は[[glossary/Gloas|Gloas]]プリセットを読み込むため、[[glossary/mainnet|メインネット]]とミニマルはそれぞれ独自の値を持ちます。`builderWithdrawalPrefix`は[[fork|フォーク]]の単純な定数です。

**[[fork|フォーク]]間の継承。** [[fork|フォーク]]はその継承を1行で宣言します。

```
import EthCLSpecs.Fulu

namespace EthCLSpecs.Gloas

fork Gloas from Fulu

end EthCLSpecs.Gloas
```

上記のすべてのフォームは、[[fork|フォーク]]ごとのリプレイのために宣言時にキャプチャされます。親の宣言は継承またはオーバーライドでき、新しい宣言も追加できます。継承には`inherit`マクロを使用し、同じ名前の宣言はオーバーライドとなり、新しい名前は当該[[fork|フォーク]]での新規宣言となります。これはコンテナ、関数、定数に適用されます。

```
inherit Checkpoint
inherit Attestation
inherit Validator
-- the full list is one file, Gloas/Inherited.lean
```

定数も同様に継承され、`inherit slotsPerEpoch maxCommitteesPerSlot …`のように、[[fork|フォーク]]の定数ファイルで名前ごとに明示的に1行記述されます。型語彙も同様に、型ファイルで`inherit Slot Gwei Root …`のように、この[[fork|フォーク]]独自のエイリアスとしてリプレイされます。

関数については、これを機能させる部分は遅延バインディングです。継承された本体は子名前空間で再展開されるため、内部のすべての名前は子の独自のコンテナ、定数、およびオーバーライドに解決されます。

```
-- Gloas/Transition.lean: the block steps EIP-7732 leaves unchanged
inherit processRandao
inherit processEth1Data
inherit verifyBlockSignature

-- the steps the EIP touches, overridden, callees bind to Gloas's own
forkdef processOperations (body : BeaconBlockBody) : StateTransition Unit := do
  …
```

`processRandao`は[[glossary/Gloas|Gloas]]の[[glossary/State-transition-function|状態]]を操作する形で[[glossary/Gloas|Gloas]]に到達し、それが呼び出すオーバーライドされた関数は[[glossary/Gloas|Gloas]]バージョンに解決されます。

[[fork|フォーク]]本体が継承していないコンテナを命名すると、展開に失敗します。[[fork|フォーク]]本体は自身の名前空間とフレームワークのみを命名し、親[[fork|フォーク]]への`open`はありません。関数サーフェスでは、Fulu（フェーズ0以降のすべてを含む）が158の仕様関数を宣言し、[[glossary/Gloas|Gloas]]が109の独自の関数を追加し、残りを継承を通じて再展開し、[[glossary/Heze|Heze]]が[[glossary/Gloas|Gloas]]の上に12の関数を追加しています。

**仕様が関心を持つべきでない事柄に対する汎用性。** 仕様本体は、エフェクト[[monad|モナド]]、ハッシュ関数、Merkleキャッシュ、および有限マップバックエンドに対して汎用的です。同じソースが2つの構成に展開されます。

| 軸 | 高速 (テストランナー) | 純粋 (証明) |
| --- | --- | --- |
| エフェクト[[monad|モナド]] | EStateM | StateT State (Except _) |
| ハッシャー | FFI経由のSHA-256 | 純粋[[LeanSha256|Lean SHA-256]]、[[kernel-reducible|カーネル還元可能]] |
| Merkleボックス | [[cached tree|キャッシュされたツリー]] | [[uncached|アンキャッシュ]] |
| [[glossary/fork-choice|フォーク選択]]マップ | hashMap | treeMap |
| BLS暗号 | 署名キャッシュの背後にあるFFI経由のblst | [[symbolic|シンボリック]]、署名チェックは真と仮定 |

BLSバックエンドも同様にパラメータです。証明は[[symbolic|シンボリック]]バックエンドを注入するため、[[glossary/State-transition-function|遷移定理]]はその信頼基盤に暗号を含みません。

作成者はこれらすべてに対して汎用的な仕様を記述できます。テストランナーは高速列をインスタンス化し、証明は純粋列をインスタンス化します。これは[[Lean kernel|カーネル]]で還元されるものです。ハッシュ関数もパラメータのままであるため、将来の交換があっても仕様関数と証明は維持されます。

**[[glossary/State-transition-function|状態遷移関数]]とストア遷移は[[monad|モナド]]的です。** 仕様の各ステップは`StateTransition Unit`型の値、つまり[[state monad|状態モナド]]内のプログラムです。[[monad|モナド]]は[[glossary/State-transition-function|状態]]を接続するため、ステップは一連のアクションとして読み取られ、[[glossary/State-transition-function|状態]]の受け渡しは邪魔になりません。

```
forkdef weighJustificationAndFinalization (totalActive prevTarget currTarget : Gwei) :
    StateTransition Unit := do
  let state ← get
  let prevEpoch := previousEpochOf state
  …
  modifyState fun state => …
```

同じ形式が[[glossary/fork-choice|フォーク選択]]にも当てはまります。ストアは2番目のマシン、ストア遷移であり、フレームワークは[[glossary/State-transition-function|状態遷移関数]]をその中にネストして実行します。[[glossary/State-transition-function|状態遷移関数]]の1つの定義が両方に役立ち、仕様は一度だけ記述されます。この設計は3つの点で役立ちます。

-   **エラーは[[monad|モナド]]内に存在します。** 無効な条件を見つけたステップは拒否され、[[monad|モナド]]は[[short-circuits|ショートサーキット]]します。高速列は拒否時のポスト[[glossary/State-transition-function|状態]]を運びます。これは、インプレースでミューテーションを行い、予期される例外をキャッチする[[glossary/Python|Python]]とランナーが一致する方法です。純粋な構成はエラーのみを返し、拒否された実行は途中で書き込まれた[[glossary/State-transition-function|状態]]を残さず、定理は値に関するものになります。
-   **ステップは[[monad|モナド]]に対して汎用的です**。これは上記の表の最初の行です。ステップを一度記述し、高速に実行し、純粋に証明します。
-   **ステップに関する証明は、その実行に関する方程式です。** バインドを実行することは、最初のアクションを実行し、成功した場合、それが生成した値と[[glossary/State-transition-function|状態]]から継続を実行することです。`pure`を実行することは、[[glossary/State-transition-function|状態]]が変更されずに値とペアになることです。これにより、証明の構成可能性が可能になります。

`process_epoch`は、これがどこで役立つかを示しています。[[glossary/Python|Python]]コードは次のとおりです。

```
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
    # [New in Fulu:EIP7917]
    process_proposer_lookahead(state)
```

Etheorem:

```
/-- `process_epoch` (Fulu ordering). -/
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

両方とも同じ15のサブステップを同じ順序（Fulu順序）でリストしています。違いは[[glossary/State-transition-function|状態]]です。[[glossary/Python|Python]]では、すべての行が`state`を手動で15回渡し、各サブステップがその場で[[glossary/State-transition-function|状態]]を変更するため、[[glossary/State-transition-function|状態]]の流れは読み手が頭の中で保持する慣習です。Leanでは、[[monad|モナド]]が[[glossary/State-transition-function|状態]]を運び、すべての行は単にステップであり、シーケンスは`doブロック`自体です。同じ15のステップが、高速構成を通じてランナーで実行され、純粋構成を通じて証明で実行されます。そこでは、2つの実行方程式がブロックをサブステップごとに1つの方程式のチェーンに変換します。

`process_operations`は、次のレベルで同じ点を指摘しており、ステップは[[glossary/BeaconBlockBody|ビーコンブロックボディ]]に対するハンドラーになります。[[glossary/Python|Python]]コードは次のとおりです。

```
def process_operations(state: BeaconState, body: BeaconBlockBody) -> None:
    # Disable former deposit mechanism once all prior deposits are processed
    eth1_deposit_index_limit = min(
        state.eth1_data.deposit_count, state.deposit_requests_start_index
    )
    if state.eth1_deposit_index < eth1_deposit_index_limit:
        assert len(body.deposits) == min(
            MAX_DEPOSITS, eth1_deposit_index_limit - state.eth1_deposit_index
        )
    else:
        assert len(body.deposits) == 0

    def for_ops(operations, fn) -> None:
        for operation in operations:
            fn(state, operation)

    for_ops(body.proposer_slashings, process_proposer_slashing)
    for_ops(body.attester_slashings, process_attester_slashing)
    for_ops(body.attestations, process_attestation)
    for_ops(body.deposits, process_deposit)
    for_ops(body.voluntary_exits, process_voluntary_exit)
    for_ops(body.bls_to_execution_changes, process_bls_to_execution_change)
    for_ops(body.execution_requests.deposits, process_deposit_request)
    for_ops(body.execution_requests.withdrawals, process_withdrawal_request)
    for_ops(body.execution_requests.consolidations, process_consolidation_request)
```

Etheorem:

```
forkdef processOperations (body : BeaconBlockBody) : StateTransition Unit := do
  let state ← get
  let limit := umin (sszGet state eth1Data).depositCount (sszGet state depositRequestsStartIndex)
  if (sszGet state eth1DepositIndex) < limit then
    assert (UInt64.ofNat body.deposits.size == umin (UInt64.ofNat Const.maxDeposits) (limit - (sszGet state eth1DepositIndex)))
  else
    assert (body.deposits.size == 0)

  for op in body.proposerSlashings do processProposerSlashing op
  for op in body.attesterSlashings do processAttesterSlashing op
  for op in body.attestations do processAttestation op
  for op in body.deposits do processDeposit op
  for op in body.voluntaryExits do processVoluntaryExit op
  for op in body.blsToExecutionChanges do processBlsToExecutionChange op
  for op in body.executionRequests.deposits do processDepositRequest op
  for op in body.executionRequests.withdrawals do processWithdrawalRequest op
  for op in body.executionRequests.consolidations do processConsolidationRequest op
```

デポジット条件は両方でほぼ同じように読み取れます。違いはディスパッチにあります。[[glossary/Python|Python]]では、各ハンドラーが`(state, operation)`を受け取り、その場で変更するため、ローカルの`state`を閉じて手動で渡すヘルパーが必要です。Leanでは、各ハンドラーはすでに同じ[[monad|モナド]]のステップであるため、ディスパッチャーは`for op in … do handler op`という直接的なシーケンスであり、[[glossary/State-transition-function|状態]]は[[monad|モナド]]が運ぶため表示されません。

これは証明が導入される場所でもあります。`process_epoch`はサブステップのチェーンを示し、`process_operations`はハンドラーのチェーンであり、両方とも同じ方法で還元されます。全体に対する実行方程式は、各部分に対する実行方程式の合成です。各ハンドラーは個別に特徴付けられ、その独自の命題とディスパッチャーの定理がそれらを連鎖させます。

## 仕様: Fulu、[[glossary/Gloas|Gloas]]、[[glossary/Heze|Heze]]

まず結果から。Leanの仕様は以下をパスします。

-   3つの[[fork|フォーク]]の[[glossary/State-transition-function|状態遷移]]ベクトル（[[glossary/mainnet|メインネット]]およびミニマル）
-   3つの[[fork|フォーク]]の[[glossary/fork-choice|フォーク選択]]ベクトル（両方のプリセット）
-   仕様がモデル化するすべてのコンテナに対する`ssz_static`コンテナベクトル（両方のプリセット）

これらはconsensus-spec-tests v1.7.0-alpha.11に固定されています。ライトクライアントやゴシップ集約型など、仕様がまだモデル化していないいくつかのコンテナファミリーは、範囲外としてxfail（テスト失敗）となります。私たちは沈黙のギャップよりも正直なxfailを好みます。[[glossary/Simple-Serialize|SSZ]]レイヤーでは、`ssz_generic`ワイヤーフォーマットスイートが完全な2215ケースをパスし、v1.7.0-alpha.13（これらのベクトルを搭載した最後のリリース）に固定されています。ここでのコンフォーマンスは行動的です。つまり、[[fork|フォーク]]がアップストリームのベクトルをパスした場合に正しいと見なされ、これはクライアントチームが使用するのと同じ基準です。

**可読性。** 私たちの目標は、Leanのコードが仕様にできるだけ近い形で読めるようにすることです。そのサイズのために意図的に選んだ小さな例を挙げます。`decrease_balance`の[[glossary/Python|Python]]コードです。

```
def decrease_balance(state: BeaconState, index: ValidatorIndex, delta: Gwei) -> None:
    """
    Decrease the balance of a validator or 0 Gwei floor.
    """
    balance = state.balances[index]
    state.balances[index] = balance - delta if balance >= delta else 0
```

Etheorem:

```
forkdef decreaseBalance (state : State) (i : ValidatorIndex) (delta : Gwei) : State :=
  modBalance state i (fun balance => if delta > balance then 0 else balance - delta)
```

2つの違いに注目してください。これは参照コードである[[glossary/Python|Python]]に対する批判ではありません。Leanバージョンは新しい[[glossary/State-transition-function|状態]]を返し、その場で何も変更しません。[[monad|モナド]]が[[glossary/State-transition-function|状態]]を内部で接続し、証明は[[Lean kernel|カーネル]]で還元される構成を使用します。また、フィールドパスは[[compile time|コンパイル時]]にチェックされますが、[[glossary/Python|Python]]では[[run time|実行時]]にチェックされます。

場合によっては、Leanの方が[[glossary/Python|Python]]よりも読みやすいことがあります。名前付きフィールド更新マクロは、[[checkpoint bookkeeping|チェックポイントの帳簿]]を読みやすくし、各ブランチが何を正当化し、どのビットを設定したかを示します。

```
state := sszUpdate state with
  currentJustifiedCheckpoint := { epoch := prevEpoch, root := prevRoot },
  justificationBits := bitSet (sszGet state justificationBits) 1 true
```

`process_voluntary_exit`の[[glossary/Python|Python]]も同様です。

```
def process_voluntary_exit(state: BeaconState, signed_voluntary_exit: SignedVoluntaryExit) -> None:
    voluntary_exit = signed_voluntary_exit.message
    validator = state.validators[voluntary_exit.validator_index]
    # Verify the validator is active
    assert is_active_validator(validator, get_current_epoch(state))
    # Verify exit has not been initiated
    assert validator.exit_epoch == FAR_FUTURE_EPOCH
    # Exits must specify an epoch when they become valid; they are not valid before then
    assert get_current_epoch(state) >= voluntary_exit.epoch
    # Verify the validator has been active long enough
    assert get_current_epoch(state) >= validator.activation_epoch + SHARD_COMMITTEE_PERIOD
    # [New in Electra:EIP7251]
    # Only exit validator if it has no pending withdrawals in the queue
    assert get_pending_balance_to_withdraw(state, voluntary_exit.validator_index) == 0
    # signature verification and exit initiation follow
```

Etheorem:

```
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
```

この関数は行ごとに読み取れ、各チェックは[[fork|フォーク]]の語彙の命名された述語であり、`exit_epoch == FAR_FUTURE_EPOCH`という生の比較の代わりに`hasNotInitiatedExit`が、エポック算術の代わりに`passedShardCommitteePeriod`が使用されています。また、境界に関する1つのチェック、つまりバリデータインデックスが範囲内にあるかどうかは`assertH`を使用しており、それが証明した境界を返し、次の行がそれを消費するため、インデックス付けは完全です。

「場合によっては」と言うのは、一般的なケースはまだ未解決だからです。報酬のデルタループなど、一部の箇所は現在[[glossary/Python|Python]]の方が読みやすく、Leanを一般的に読みやすくすることはプロジェクトの方向性です。パフォーマンスについては意図的にほとんど言及しません。現在、高速構成の目標は[[glossary/mainnet|メインネット]][[glossary/State-transition-function|状態]]スケールでのコンフォーマンスであり、プロジェクトの目標は証明可能な仕様であり、クライアントは別のアーティファクトです。

## 証明

仕様本体は汎用的なため、フレームワークによってそれらに関する定理を記述し、純粋な構成でインスタンス化することができます。証明は命題から始まり、私たちは命題を読みやすくすることを目指しています。例として、ビルダーがその入札をカバーできるかどうかを示す[[glossary/Gloas|Gloas]]の述語の特徴付けを挙げます。

```
@[characterizes EthCLSpecs.Gloas.canBuilderCoverBid]
theorem canBuilderCoverBid_iff [Preset] [HasherTag] :
    ∀ (state : Gloas.State) (builderIndex : BuilderIndex) (bidAmount : Gwei),
      canBuilderCoverBid state builderIndex bidAmount = true ↔
        let builderBalance := (sszGet state builders[builderIndex.toNat]!).balance
        let minBalance :=
          Gloas.Const.minDepositAmountG +
          getPendingBalanceToWithdrawForBuilder state builderIndex
        minBalance ≤ builderBalance ∧ bidAmount ≤ builderBalance - minBalance
```

段階的に、この命題は次のように述べています。

-   すべての[[glossary/State-transition-function|状態]]、ビルダーインデックス、入札額について、`∀ (state : …) …`、
-   関数が`true`を返すのは、まさに（`↔`、if-and-only-if）、
-   最小残高（デポジット額と引き出し待ちでロックされている額）がビルダー残高を超えない場合、`minBalance ≤ builderBalance`、
-   そして入札額が残りの部分に収まる場合、`bidAmount ≤ builderBalance - minBalance`。

これらの命題の証明は[[glossary/AI-agents|AIエージェント]]支援によって生成されます。しかし、[[Lean kernel|Leanカーネル]]は誰が書いたかに関係なくすべての証明を独立してチェックし、リポジトリはカバレッジテーブルと公理インベントリを公開しているため、信頼基盤は監査可能です。`#print axioms`は定理が依拠するすべてのものをリストします。

現在の状況はどうでしょうか？585の仕様関数のうち、8つが完全に特徴付けられ、さらに29が定理ステートメントに登場しています。まだ初期段階です。リポジトリはそれを[[proof ledger|証明台帳]]で追跡しています。付録Aに現在の[[consensus-specs proofs|コンセンサス仕様証明]]を、付録Bに[[glossary/Simple-Serialize|SSZ]]テーブルをリストしています。下位の[[glossary/Simple-Serialize|SSZ]]レイヤーはより進んだ状態にあります（前回の記事を参照）。

## チーム

Etheoremは7人のチームによって構築されており、EthereumプロトコルフェローシップとInvisible Gardenフェローシップからの貢献者が含まれています。[[Mouzayan|Mouzayan]]、[[irajgill|irajgill]]、[[IvanAnishchuk|IvanAnishchuk]]、[[protocolwhisper|protocolwhisper]]、[[Sahilgill24|Sahilgill24]]、[[adria0|adria0]]、そして[[leolara|leolara]]です。彼らの努力に感謝するとともに、特に[[Mouzayan|Mouzayan]]と[[IvanAnishchuk|IvanAnishchuk]]には、上記の定理を含む[[fork|フォーク]]仕様の証明のほとんどを記述してくれたことに、そして[[irajgill|irajgill]]には多くの[[glossary/Simple-Serialize|SSZ]]証明を記述してくれたことに感謝します。

Invisible Gardenの哲学において、このプロジェクトの一つの側面は学習です。私たちは以前は[[formal verification|形式検証]]の専門家ではありませんでしたが、実践を通じて学習しています。前回の記事でその経緯を述べました。参加して共に学ぶことを歓迎します。参加するための具体的な入り口があります。[[proof ledger|証明台帳]]には候補関数ごとに1行があり、まだ未解決の行もあります。どれかを選んで特徴付けたり、よく知っている仕様関数をレビューしたりしてください。あらゆるレビュー、フィードバック、貢献、そしてもちろん利用を歓迎します。

## フィードバック歓迎

リポジトリは[github.com/etheorem/etheorem](https://github.com/etheorem/etheorem)にあり、各パッケージのステータスページには何が証明され、何が証明されていないかが記録されています。

読者の皆様への質問です。どの仕様関数を最初に特徴付けたいですか？

## 付録A: [[consensus-specs proofs|コンセンサス仕様証明]]、関数別

[[proof ledger|台帳]]の証明済み行を定理ごとに示します。特に明記しない限り、すべての名前は`EthCLSpecs.Proofs.Gloas`の下にあります。すべての定理は[[Lean kernel|Leanカーネル]]によってチェックされ、セット全体の[[axiom footprint|公理フットプリント]]は3つの標準[[Lean kernel|カーネル]]公理、`propext`、`Classical.choice`、`Quot.sound`のみであり、それ以外は何もありません。暗号も、コンパイラの信頼も、還元公理もありません。[[symbolic|シンボリック]]BLSバックエンドは署名チェックを信頼基盤から除外しています。

| 仕様関数 | 定理 | 確立された内容 |
| --- | --- | --- |
| toBuilderIndex, convertBuilderIndexToValidatorIndex | toBuilderIndex_convertBuilderIndexToValidatorIndex, convertBuilderIndexToValidatorIndex_toBuilderIndex, isBuilderIndex_convertBuilderIndexToValidatorIndex | フラグの往復、両方向が同一であること、およびフラグビットが正確にビルダータグであること |
| [[glossary/canBuilderCoverBid|canBuilderCoverBid]] | [[glossary/canBuilderCoverBid|canBuilderCoverBid]]_iff, [[glossary/canBuilderCoverBid|canBuilderCoverBid]]_iff_toNat_add_le | 最小残高が収まり、入札額が残りに収まる場合にのみtrueを返すこと（UInt64形式およびNatで再記述） |
| initiateBuilderExit | initiateBuilderExit_run_eq, …_run_builders, …_run_inRange, …_run_outOfRange, …_run_inRange_no_wrap, および無条件のミニマルおよび[[glossary/mainnet|メインネット]]の系 | 正確な[[glossary/State-transition-function|全体遷移方程式]]、各インデックスでのレジストリ効果、範囲内外で決して拒否されないこと、引き出し可能エポックがラップしないこと |
| processBuilderPendingPayments | processBuilderPendingPayments_run, expectedPaymentWindow_get_lt, expectedPaymentWindow_get_upper, …_run_of_fits | 2フィールドの成功実行事後条件、ウィンドウの両半分での支払いウィンドウエントリ、容量保護された系 |
| isValidIndexedPayloadAttestation | isValidIndexedPayloadAttestation_eq_true_iff | 空でなく、隣接する非減少の、範囲内の委員会インデックスセットのみを受け入れること（バックエンド汎用） |
| updateCheckpoints | updateCheckpoints_eq, …_justifiedCheckpoint_eq_or_advances, …_finalizedCheckpoint_eq_or_advances, …_justifiedEpoch_le, …_finalizedEpoch_le | 単一レコード更新方程式、各チェックポイントが等しいか進んでいること、ストアエポックが低下しないこと |
| processOperations | processOperations_eq_seq, processOperations_nonempty_deposits_error | コーディネーター方程式、デポジット数チェック、その後6つのファミリーフォールドが順に実行されること、ブロック内の空でないデポジットはそこで拒否されること |
| initializePtcWindow | initializePtcWindow_lt, …_ge, …_lt_default | ウィンドウの領域、エントリごと、プレースホルダーのデフォルト付き（進行中） |
| getPtc | getPtcElseOffset_lt_next_slot, getPtcElseOffset_lt_same_slot | チェックされていないオフセットの前提条件がガードされた呼び出しサイトで保持されること（進行中） |

関数ごとの行に加えて:

-   `ForkChoiceRun`は、実行方程式のメカニズムを[[glossary/fork-choice|フォーク選択]]に持ち込みます。純粋なストア[[monad|モナド]]での[[glossary/fork-choice|フォーク選択]]`forkdef`は同じ種類の実行事実を満たし、[[glossary/State-transition-function|状態遷移定理]]は関数適用によって移行します。
-   フレームワーク側では、`EthCLLib.Proofs.MerkleBranch`が`isValidMerkleBranch_iff`を証明しています。ブランチチェックは正確に再構築であり、[[glossary/SizzLean|SizzLean]]ツリーの正直なオープニングはそれをパスし、ブランチフォールドはツリー自身のオープニングと等しくなります。
-   [[glossary/Heze|Heze]]には`shouldExtendPayload`と`recordPayloadInclusionListSatisfaction`という2つの進行中の行があり、これは[[glossary/FOCIL|FOCIL]]の強制チェーンです。
-   Fuluは定理ステートメントによって触れられる仕様関数が2つ、[[glossary/Heze|Heze]]は6つ、[[glossary/Gloas|Gloas]]は21つあり、合計585です。

## 付録B: [[glossary/SizzLean|SizzLean]]の証明

3つの中心的な定理は、`SSZType`ユニバースの`BasicSupported`カットにおいて、値レベルのガード`EncodedFits s x`（エンコードされたサイズが`MAX_LENGTH`未満）の下で成立します。コンストラクタごとに:

| SSZTypeコンストラクタ | decode_encode | serialize_injective | encode_size_le_max | 手法 |
| --- | --- | --- | --- | --- |
| .uintN 8 |  |  |  | 1回の展開後にrflで閉じる |
| .uintN 16 |  |  |  | [[Nat-digit codec|Nat-digitコーデック]]、Proofs/UInt.lean |
| .uintN 32 |  |  |  | [[Nat-digit codec|Nat-digitコーデック]]、Proofs/UInt.lean |
| .uintN 64 |  |  |  | [[Nat-digit codec|Nat-digitコーデック]]、Proofs/UInt.lean |
| .uintN 128 |  |  |  | .uintN 128と同じ[[little-endian codec|リトルエンディアンコーデック]]の証明 |
| .uintN 256 |  |  |  | .uintN 128と同じ[[little-endian codec|リトルエンディアンコーデック]]の証明 |
| .bool |  |  |  | 網羅的なケース + rfl |
| .vector t n, 固定サイズt |  |  |  | 要素型のウィットネスで再帰 |
| .vector t n, 可変サイズt |  |  |  | [[offset-table codec|オフセットテーブルコーデック]]、Proofs/CollectionVar.lean |
| .list t cap, 固定サイズt |  |  |  | 要素型のウィットネスで再帰 |
| .list t cap, 可変サイズt |  |  |  | [[offset-table codec|オフセットテーブルコーデック]]、空のリストは空のバッファ |
| .bitvector n |  |  |  | バイトレベル[[byte-level bit-packing inverse|ビットパッキング逆変換]]、Proofs/BitPack.lean |
| .bitlist cap |  |  |  | ビットパッキング逆変換 + [[length-marker recovery|長さマーカーリカバリ]] |
| .container fs, 全フィールド固定 |  |  |  | フィールドリストの相互再帰 |
| .container fs, 固定/可変混合 |  |  |  | [[offset-table codec|オフセットテーブルコーデック]] |

ビットアームは有限チャンク形状に対する[[kernel decide|カーネルのdecide]]によって閉じられ、標準の3つ以外の公理は追加されません。

[[glossary/Merkleization|マークル化]]については、現在証明されているのは、キャッシュされたツリーが、形状ごと、および新しいボックスの`hashTreeRoot`まで、すべての`BasicSupported`アームに対する仕様の[[glossary/Merkleization|マークル化]]と一致すること、パスビットの往復、オープニング、一般化インデックスモデル、およびブランチ完全性です。これは付録AのMerkleブランチ定理が基づいているものです。新しいボックスを超えたキャッシュされたツリー（更新パス）は、現在実行パスであり、テストスイートによってチェックされています。リポジトリ内のコヒーレンス定理とビルダー定理は、将来の同値定理の種です。行レベルのステータスは[[glossary/SizzLean|SizzLean]][[proof ledger|証明台帳]]に記載されています。

`decode_encode`と`serialize_injective`は3つの標準[[Lean kernel|カーネル]]公理のみに依拠し、`encode_size_le_max`は何も追加しません。

* * *

レオ・ララ

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/etheorem-update-the-complete-executable-consensus-specs-written-in-lean-4/26063)
