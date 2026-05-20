---
title: ネイティブ証明検証
original_title: Native proof verification
source_url: 'https://ethresear.ch/t/native-proof-verification/24798'
author: donnoh
date: '2026-05-05'
category: Sharding
tags:
  - sharding
  - ethereum
  - zk-proofs
  - rollups
topic_id: '24798'
translated_at: '2026-05-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Native proof verification](https://ethresear.ch/t/native-proof-verification/24798) — donnoh (2026-05-05)

## 概要

この提案の究極の目標は、L2ブリッジ、そしてより一般的にはZK証明を検証するあらゆるオンチェーンアプリケーションを、L1の標準プリミティブを導入することで、大幅にリスクを軽減し、簡素化することです。これにより、各プロジェクトが独自のオンチェーン検証スタックの代わりに、この標準プリミティブを採用できるようになります。これは以下の2つの変更によって達成されます。

1.  **[[EIP|EIP]]-8025の汎用化**: コンセンサス層の証明検証インフラストラクチャをプログラム非依存にし、EVM実行証明に縛られないようにします。
2.  **新しい[[EIP|EIP]]**: 証明を伴うトランザクションタイプと3つのオペコード (`PROGRAMHASH`、`PUBVALUESHASH`、`PROOFCOUNT`) を通じて、これをスマートコントラクトに公開します。

これらを組み合わせることで、あらゆるプロジェクトがL1の証明検証インフラストラクチャを直接継承できるようになり、zkVMの修正は、プロジェクトごとのガバナンスアップグレードではなく、クライアントリリースを通じて提供されます。

## 動機

現在、すべてのEthereum [[Rollup|ロールアップ]]は、独自のオンチェーン証明検証インフラストラクチャを維持しています。ZK [[Rollup|ロールアップ]]は、zkVM検証者コントラクト、アダプターコントラクト、マルチプルーフディスパッチャー、プログラムホワイトリスティングロジックを展開しています。オプティミスティック[[Rollup|ロールアップ]]は、独自のオンチェーン不正証明VM（ArbitrumのWAVM、OptimismのCannon MIPSマシン）と、それを取り巻く紛争ロジックを出荷しています。どちらの場合も、各コントラクトは、特定の証明システムまたはVMのバグに対応して、個別に維持、パッチ適用、アップグレードされ、各アップグレードはカスタムのマルチシグまたはDAOによってゲートされています。これは遅く、リスクが高く、エコシステム全体で重複しています。

[[EIP|EIP]]-8025は、Ethereumのコンセンサス層にzkVM証明検証を導入しますが、L1自身の目的、つまりステートレスかつサブリニアな検証を可能にするための実行ペイロードの検証に限定されます。[[Rollup|ロールアップ]]は依然として独自のオンチェーン検証者コントラクトを必要とします。

しかし、[[EIP|EIP]]-8025がCLにもたらすインフラストラクチャ、すなわち`ProofEngine`、証明ゴシップ、検証ロジックは、本質的にL1固有のものではありません。もしプログラム非依存に汎用化され、新しいトランザクションタイプを介してスマートコントラクトに公開されれば、非EVMの[[Rollup|ロールアップ]]でさえ、証明検証をCLにオフロードできるでしょう。zkVMの実装にパッチを適用する必要がある場合、Ethereumクライアントチームは、gethやNethermindのバグが今日修正されるのと同じ方法で、更新されたソフトウェアをリリースします。つまり、ハードフォークなしでクライアントリリースを通じて行われます。これは、[[ネイティブロールアップ|native rollups]]の背後にある原則と同じですが、より汎用化されています。ネイティブ[[Rollup|ロールアップ]]がL1の実行環境を継承するのと同様に、ネイティブ証明検証は、あらゆる[[Rollup|ロールアップ]]がL1の証明検証インフラストラクチャを継承することを可能にします。

このドキュメントでは、提案を[[Rollup|ロールアップ]]を中心に構成していますが、同じプリミティブは、オンチェーンでZK証明を検証するあらゆるコントラクト（プライバシーシステム、ZKコプロセッサ、アイデンティティ、ZK MLなど）に役立ちます。

## [[Rollup|ロールアップ]]が現在どのように証明を検証しているか

各zkVMベンダーは、ユニバーサルなSolidity検証者コントラクト（通常はBN254上のGroth16またはPlonkチェック）を提供します。プログラムの識別子と公開値（回路がコミットするあらゆる入力と出力）が証明とともに渡されます。SP1の場合：

```solidity
interface ISP1Verifier {
    function verifyProof(
        bytes32 programVKey,         // program hash
        bytes calldata publicValues, // public values (inputs and/or outputs)
        bytes calldata proofBytes    // the proof
    ) external view;
}
```

**用語に関する注意。** SP1は`programVKey`を「検証キー (verification key)」と呼びますが、これはzkVM自身の回路検証キーと衝突します。このドキュメントではこれらを区別します。

-   **プログラムハッシュ (Program hash)**（SP1では`programVKey`、Risc0では`imageId`と呼ばれる）：コンパイルされたゲストプログラムを識別する`bytes32`。各zkVMは異なる方法でコンパイルされるため（例：RV32IMA vs RV64IMA）、これは`(ソース, zkVM)`のペアごとに異なります。[ERE](https://github.com/eth-act/ere)では、各バックエンドの[`zkVMVerifier::ProgramVk`](https://github.com/eth-act/ere/blob/02659ca3701f9d013ac89fded4aa250c29256fb6/crates/verifier/core/src/verifier.rs)関連型（`SP1VerifyingKey`、Risc0の`Digest`などをラップ）として表現されます。
-   **検証キー (Verification key)**：zkVMの回路VK（多項式コミットメント、ドメインパラメータ）。オンチェーン検証者では定数としてハードコードされ、zkVMのバージョンごとに1つあり、すべてのプログラムで共有されます。

### 例：Taiko（マルチ検証者）

Taikoは、[[Rollup|ロールアップ]]が複数の証明システムを使用する場合に生じる複雑さを示しています。その検証アーキテクチャは、3つの階層にわたる6つのコントラクト（2つの生検証者、2つのアダプター、1つのディスパッチャー、1つのSGX検証者）を含み、それぞれがカスタムのマルチシグを通じて個別に維持およびアップグレードされます。

**1. 生のzkVM検証者。** Taikoは、SP1 Plonk検証者（`SP1Verifier.sol`）とRisc0 Groth16検証者（`RiscZeroGroth16Verifier.sol`）の両方をデプロイしています。これらはベンダー提供のユニバーサル検証者コントラクトです。

**2. Taiko固有のアダプター。** 各生の検証者は、Taikoの`IVerifier`インターフェースを実装するアダプターコントラクトでラップされます。

```solidity
// TaikoSP1Verifier: adapter for SP1
contract TaikoSP1Verifier is IVerifier {
    address public sp1RemoteVerifier;                    // raw SP1 verifier
    mapping(bytes32 => bool) public isProgramTrusted;    // whitelisted programs

    function verifyProof(Context[] calldata _ctxs, bytes calldata _proof) external view {
        bytes32 aggregationProgram = bytes32(_proof[:32]);
        bytes32 blockProvingProgram = bytes32(_proof[32:64]);
        require(isProgramTrusted[aggregationProgram]);
        require(isProgramTrusted[blockProvingProgram]);

        bytes memory publicInputs = buildPublicInputs(_ctxs);
        ISP1Verifier(sp1RemoteVerifier).verifyProof(
            aggregationProgram, publicInputs, _proof[64:]
        );
    }
}
```

並行する`Risc0Verifier`も同じ形状で、`isImageTrusted`が`isProgramTrusted`に置き換わり、`sha256(buildPublicInputs(...))`がジャーナルダイジェストとして使用されます。

**3. マルチ検証者ディスパッチャー。** `ComposeVerifier`コントラクトは、複数の検証者を調整し、各証明を検証するのに十分なセットが検証したことを強制します。

```solidity
contract MainnetVerifier is ComposeVerifier {
    address public immutable sgxGethVerifier;    // SGX verifier (required)
    address public immutable risc0RethVerifier;  // Risc0 option
    address public immutable sp1RethVerifier;    // SP1 option

    function verifyProof(Context[] calldata _ctxs, bytes calldata _proof) external {
        SubProof[] memory subProofs = abi.decode(_proof, (SubProof[]));
        for (uint256 i = 0; i < subProofs.length; ++i) {
            IVerifier(subProofs[i].verifier).verifyProof(_ctxs, subProofs[i].proof);
        }
        require(areVerifiersSufficient(verifiers));
    }

    function areVerifiersSufficient(address[] memory _verifiers) internal view override {
        // Must have exactly 2: sgxGethVerifier + (risc0 or sp1)
    }
}
```

## [[EIP|EIP]]-8025への変更

[[EIP|EIP]]-8025は、L1ブロック検証のためのオプションの実行証明を導入します。それがコンセンサス層にもたらすインフラストラクチャ（`ProofEngine`、ゴシップ、検証ロジック）は、その型がL1固有であるためL1固有です。[`ExecutionProof.public_input`](https://github.com/ethereum/consensus-specs/blob/5e5abe333f9d03eca5bd0c756827123e61388cd6/specs/_features/eip8025/beacon-chain.md#new-publicinput)は`new_payload_request_root: Root`を運び、[`ProofType`](https://github.com/ethereum/consensus-specs/blob/5e5abe333f9d03eca5bd0c756827123e61388cd6/specs/_features/eip8025/beacon-chain.md#types)は、受け入れられる`(クライアント, zkVM)`ビルドの小さな固定セットを列挙する`uint8`です（[Lighthouseの実装](https://github.com/eth-act/lighthouse/blob/feat/eip8025/beacon_node/execution_layer/src/eip8025/types.rs)を参照）：

| ProofType | ゲストプログラム | zkVMバックエンド |
| --- | --- | --- |
| 0 | ethrex | Risc0 |
| 1 | ethrex | SP1 |
| 2 | ethrex | Zisk |
| 3 | reth | OpenVM |
| 4 | reth | Risc0 |
| 5 | reth | SP1 |
| 6 | reth | Zisk |

これは、ゲストプログラムのセットが小さく、事前にわかっている場合には機能しますが、任意の[[Rollup|ロールアップ]]プログラムに対応することはできません。

この[[EIP|EIP]]は、汎用検証プリミティブを並行して追加し、[[EIP|EIP]]-8025の既存のインターフェース（`ExecutionProof`、`ProofType`、`verify_execution_proof`、`notify_new_payload`、`notify_forkchoice_updated`、`process_execution_proof`、`request_proofs`、`ProofAttributes`）には手を加えません。この汎用化は[ERE](https://github.com/eth-act/ere)を反映しており、その[`zkVMVerifier`](https://github.com/eth-act/ere/blob/02659ca3701f9d013ac89fded4aa250c29256fb6/crates/verifier/core/src/verifier.rs)トレイトはプログラム非依存であり、特定のゲストプログラムはその上に構築されます。[`Compiler`](https://github.com/eth-act/ere/blob/02659ca3701f9d013ac89fded4aa250c29256fb6/crates/compiler/core/src/compiler.rs)と`zkVMVerifier`バックエンドが独立したトレイトであるというEREの設計に従い、新しい`Proof`コンテナは、混同されていた`ProofType`を2つの軸に分割します。1つはzkVMバックエンドのみを識別する`BackendType: uint8`、もう1つはゲストプログラムを識別する`program_hash: Bytes32`です（`(ゲストプログラム, zkVM)`のペアに固有、[用語に関する注意](https://ethresear.ch#how-rollups-verify-proofs-today)を参照）。エンジンは`backend_type`を使用して回路VKを選択します。`program_hash`は回路への公開入力であり、検証中に`public_values`とともにチェックされます。

```python
class ProofPublicInput(Container):
    program_hash: Bytes32
    public_values: ByteList[MAX_PUBLIC_VALUES_SIZE]

class Proof(Container):
    proof_data: ByteList[MAX_PROOF_SIZE]
    backend_type: BackendType
    public_input: ProofPublicInput

def verify_proof(self: ProofEngine, proof: Proof) -> bool: ...
```

[[EIP|EIP]]-8025の[`verify_execution_proof`](https://github.com/ethereum/consensus-specs/blob/5e5abe333f9d03eca5bd0c756827123e61388cd6/specs/_features/eip8025/proof-engine.md#new-verify_execution_proof)は、コード共有のために`verify_proof`の薄いラッパーとして再実装でき、ゴシップ層での目に見える変更はありません。

```python
def verify_execution_proof(self: ProofEngine, ep: ExecutionProof) -> bool:
    backend_type, program_hash = self.resolve_proof_type(ep.proof_type)
    expected_public_values = serialize_stateless_output(StatelessValidationResult(
        new_payload_request_root=ep.public_input.new_payload_request_root,
        successful_validation=True,
        chain_config=self.chain_config,
    ))
    return self.verify_proof(Proof(
        proof_data=ep.proof_data,
        backend_type=backend_type,
        public_input=ProofPublicInput(
            program_hash=program_hash,
            public_values=expected_public_values,
        ),
    ))
```

[`serialize_stateless_output`](https://github.com/ethereum/execution-specs/blob/projects/zkevm/src/ethereum/forks/amsterdam/stateless_guest.py#L19)から[`StatelessValidationResult`](https://github.com/ethereum/execution-specs/blob/projects/zkevm/src/ethereum/forks/amsterdam/stateless.py#L123)へのバイトレベルのレイアウトは、[ネイティブ[[Rollup|ロールアップ]]への影響](https://ethresear.ch#impact-on-native-rollups)に示されています。これは、ネイティブ[[Rollup|ロールアップ]]コントラクトがオンチェーンでそれを再構築するためです。ブロックの有効性は証明検証から切り離されたままです。[誠実なプロバーガイド](https://github.com/ethereum/consensus-specs/blob/5e5abe333f9d03eca5bd0c756827123e61388cd6/specs/_features/eip8025/prover.md)は変更されていません。サイドカーで到着した証明（証明を伴うトランザクション、[証明の伝播](https://ethresear.ch#proof-propagation)を参照）は、L1ラッパーなしで直接`verify_proof`を通過します。

## プログラムハッシュの安定性（オープンな問題）

ネイティブ証明検証の「修正はクライアントリリースを通じて提供され、オンチェーンでは何も変更されない」という特性は、1つの自明ではない要件に依存しています。それは、オンチェーンで固定された`program_hash`がzkVMパッチ全体で安定している必要があるということです。もしパッチによってハッシュが変更されると、古い値を固定していた[[Rollup|ロールアップ]]は、アップグレードしない限り機能しなくなり、アップグレードの仕組みはオンチェーンガバナンスに戻ってしまいます。

今日のzkVMは、これを直接提供していません。主要な候補はどちらも、回路層の修正だけでなく、通常のSDK/依存関係/ツールチェーンの変動によっても変化する成果物をフィンガープリントします。

-   **Risc0の`imageId`**は、`SystemState { pc: 0, merkle_root }`に対するSHA-256であり、`merkle_root`は初期メモリイメージのPoseidon2マークルルートです。このメモリイメージには、ユーザーELFとカーネルELFの両方が含まれます（[binfmt/src/elf.rs#L435](https://www.risc0.com/risc0/binfmt/src/elf.rs#L435)）。メモリイメージは正確なコンパイル済みバイトをキャプチャするため、依存関係の更新、ツールチェーンの更新、またはカーネルパッチはすべて、STFセマンティクスが変更されていない場合でも`imageId`を変更します。
-   **SP1の`programVKey`**は、`(preprocessed_commit, pc_start, ...)`に対するPoseidon2です（[hypercube/src/verifier/hashable\_key.rs#L107](https://github.com/succinctlabs/sp1/blob/cb9ce33390dc2ae2415390d2d98a6f14035c43f9/crates/hypercube/src/verifier/hashable_key.rs#L107)）。Risc0の`imageId`（コンパイル済みバイトの純粋なハッシュ）とは異なり、SP1のvkはELF上で回路セットアップを実行した副産物です。`preprocessed_commit`はAIRのプリプロセッシングコミットメントであり、`pc_start`はリンカーから来るため、回路の変更、SDKの更新、ツールチェーンの変更はすべて、ユーザーのゲストソースがバイト単位で同一であってもそれを変更します。

どちらかをオンチェーンの`program_hash`として直接使用すると、すべてのzkVMリリースが[[Rollup|ロールアップ]]にとって可視なイベントになります。

現実的な方法は**間接層**です。オンチェーンの`program_hash`は、安定した、[[Rollup|ロールアップ]]が選択した識別子であり、証明への公開入力です。一方、zkVM内部の識別子は秘密入力であり、クライアントによって維持され、リリースごとに自由に変化できます。証明は、安定した`program_hash`が実行された内容に真にコミットしていることを証明する必要があります。正確なメカニズムは未解決の設計問題です。

`NATIVE_PROGRAM`センチネルを使用するネイティブ[[Rollup|ロールアップ]]は、これを完全に回避します。センチネルは「L1が現在受け入れているもの」を意味するだけであり、受け入れられるセット自体は、zkVMリリースとともに更新されるクライアント側の成果物です。

## 新しい[[EIP|EIP]]：証明を伴うトランザクション

### トランザクション形式

```
TransactionType: PROOF_TX_TYPE

TransactionPayloadBody:
[chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit,
 to, value, data, access_list, max_fee_per_blob_gas,
 blob_versioned_hashes, proofs, public_values_hash,
 y_parity, r, s]
```

ここで：

-   `proofs`: `(program_hash, backend_type)`ペアのリスト。各`program_hash`は、その特定のzkVMバックエンドのゲストプログラムを識別する`bytes32`です（[用語に関する注意](https://ethresear.ch#how-rollups-verify-proofs-today)を参照）。各`backend_type`は`uint8`であり、同じバックエンドからの2つの証明はセキュリティを追加しないため、リスト内で一意でなければなりません。このリストの長さが`proof_count`を決定します。
-   `public_values_hash`: プログラムの公開出力の`bytes32`ハッシュ（すべての証明で共有されます。すべてのバックエンドが同じステートメントを証明するため）。

CLレベルの`Proof`は生の`public_values`バイトを運びます。トランザクションボディ（および`PUBVALUESHASH`オペコード）は、それらのハッシュのみを公開します。コントラクトは期待されるバイトを再構築し、ハッシュを比較します。2つの不変条件が2つのビューを結びつけます（サイドカーを処理するすべてのノードによって、メムプール伝播時と、[[ブロック構築|Builder]]がブロックを組み立てる際に再度チェックされます）。

-   `sidecar[i].public_input.program_hash == proofs[i].program_hash` および `sidecar[i].backend_type == proofs[i].backend_type`。
-   `sha256(sidecar[i].public_input.public_values) == public_values_hash`。

これらは、EVMから見える識別子（`proofs[i].program_hash`、`public_values_hash`）を、`verify_proof`に渡される基盤となる`Proof`オブジェクトにバインドします。証明が[[ブロック構築|Builder]]にどのように到達し、L1ブロック証明がそれらをどのようにカバーするかについては、[証明の伝播](https://ethresear.ch#proof-propagation)を参照してください。

### オペコード

新しいオペコードは、証明を伴うトランザクションのフィールドを読み取り、証明を伴わないトランザクションの場合はゼロを返します。

| オペコード | 入力 | 出力 | 説明 |
| --- | --- | --- | --- |
| PROGRAMHASH | index | program_hash (bytes32) | i番目の証明のプログラムハッシュ。BLOBHASHのようにインデックス付けされます。index >= PROOFCOUNT() の場合はbytes32(0)を返します。 |
| PUBVALUESHASH | none | public_values_hash (bytes32) | プログラムの公開出力のハッシュ（すべての証明で共有されます）。 |
| PROOFCOUNT | none | proof_count (uint8) | トランザクションの証明リストの長さ。 |

カスタム[[Rollup|ロールアップ]]は`PROOFCOUNT()`で反復処理を行い、各`PROGRAMHASH(i)`を自身のホワイトリストと照合します。

ネイティブ[[Rollup|ロールアップ]]の場合、i番目の証明がL1が自身のEVM実行証明のために現在受け入れているプログラムを使用している場合、`PROGRAMHASH(i)`は既知のセンチネル値（例：`bytes32(1)`）を返します。これにより、コントラクトは特定のzkVMごとのハッシュを保存することなく`PROGRAMHASH(i) == NATIVE_PROGRAM`をチェックし、クライアントリリースで提供されるL1アップグレードに自動的に従います。

### マルチプルーフ

`proofs`リストにより、各[[Rollup|ロールアップ]]は独自のセキュリティ/コストのトレードオフを選択できます。`[(hash, SP1)]`は単一の証明であり、`[(hash_sp1, SP1), (hash_risc0, Risc0)]`は、CLがトランザクションを受け入れる前に、同じステートメントが両方によって独立して証明されることを要求します。コントラクトは`PROOFCOUNT()`を読み取り、独自の最小値を強制します。

これにより、コントラクトレベルのマルチプルーフ調整（Taikoの`ComposeVerifier`がSGXとZK検証者の両方を要求するように）が、プロトコルレベルのメカニズムに置き換えられます。`proofs`は署名されたトランザクションボディにあるため、改ざんすることはできません。

### 証明の伝播

証明はメムプールを通じて[[ブロック構築|Builder]]に到達する必要がありますが、長期的な可用性は必要ありません。提案されているアプローチは、**エフェメラルサイドカー**です。証明は、[[EIP|EIP]]-4844のブロブサイドカーのように、トランザクションとともに伝播します。メムプールノードと[[ブロック構築|Builder]]は、トランザクションを転送または含める前に、各サイドカーエントリを`verify_proof`に通し（[トランザクション形式](https://ethresear.ch#transaction-format)の不変条件もチェックします）、[[ブロック構築|Builder]]はブロックに含める前にサイドカーを削除し、再帰的なL1ブロック証明に組み込み、破棄します。バリデータは、トランザクションボディ（`proofs`リストと`public_values_hash`）とL1ブロック証明のみを見ます。生の証明バイトは必要ありません。したがって、L1ブロック証明は、ブロック内のすべての証明を伴うトランザクションを再帰的にカバーします（量子耐性証明は非常に大きくなる可能性があり、L1はスロットあたり1つの証明に制限される場合があります）。

**サイズ。** [[EIP|EIP]]-8025では、証明ごとに`MAX_PROOF_SIZE = 400 KiB`が設定されています。仕様では`len(proofs)`に上限を設けていませんが、メムプールクライアントのサイズ制限により、2〜3が実用的な上限となります。

## 既存の[[Rollup|ロールアップ]]への影響

以下の表は、各プロジェクトのオンチェーンコントラクトのSolidity SLOC（空白行、コメント行を除くソースコード行数）を、「コア」[[Rollup|ロールアップ]]ロジックと、ネイティブ証明検証によって廃止される証明検証スタックに分けて報告しています。

| プロジェクト | 証明システム | コアSLOC | 廃止されるSLOC | 廃止率 |
| --- | --- | --- | --- | --- |
| Arbitrum | オプティミスティック、WASM VM | 19,034 | 8,181 | 43.0% |
| Base | オプティミスティック、MIPS VM | 17,426 | 8,907 | 51.1% |
| ZKsync Era | 有効性、EraVM | 10,823 | 2,379 | 22.0% |
| Linea | 有効性、直接EVM | 8,111 | 2,460 | 30.3% |
| Lighter | 有効性、VMなし（カスタム回路） | 5,417 | 1,699 | 31.4% |
| 合計 | | 60,811 | 23,626 | 38.9% |

これらの数値は概算です。オンチェーンのSolidityコードのみを対象とし、オフチェーンのプロバー、シーケンサー、および各`program_hash`の背後にあるゲストプログラムは除外されています。ガバナンスインターフェース（マルチシグ、タイムロック、DAOコントラクト、プロキシアドミン）、パートナー固有のブリッジ、プロキシボイラープレートは両方の列から除外されています。

Taikoの6コントラクトからなるマルチ検証者スタックは、単一のインボックスコントラクトに集約されます。

```solidity
contract TaikoInbox {
    mapping(bytes32 => bool) public isTrustedProgram;  // whitelisted per-zkVM program hashes
    uint256 public minProofCount;                       // multi-proof threshold (e.g. 2)

    function proveBatches(
        BatchMetadata[] calldata metas,
        Transition[] calldata trans
        // _proof parameter removed: verified by the CL
    ) external {
        // Verify all proofs used trusted programs.
        require(PROOFCOUNT() >= minProofCount, "insufficient proofs");
        for (uint256 i = 0; i < PROOFCOUNT(); i++) {
            require(isTrustedProgram[PROGRAMHASH(i)], "untrusted program");
        }

        bytes memory publicInputs = buildPublicInputs(metas, trans);
        require(PUBVALUESHASH() == sha256(publicInputs), "wrong public values");

        // Accept the batches.
        ...
    }
}
```

単一の`isTrustedProgram`ホワイトリストが`isProgramTrusted`（SP1）と`isImageTrusted`（Risc0）の両方を置き換え、`minProofCount`が`areVerifiersSufficient`を置き換えます。

## ネイティブ[[Rollup|ロールアップ]]への影響

[ネイティブ[[Rollup|ロールアップ]]のZK仕様](https://native-rollups.l2beat.com/execute_precompile.html#zk-specification)のNativeRollupコントラクトも同じパターンを使用します。`validation_result_root`に対する`PROOFROOT`の代わりに、`PROGRAMHASH`、`PUBVALUESHASH`、`PROOFCOUNT`をチェックします。

```solidity
bytes32 constant NATIVE_PROGRAM = bytes32(uint256(1));
uint256 public minProofCount;

function advance(BlockParams calldata params) external {
    bytes32 l1Anchor = blockhash(block.number - 1);

    bytes32 npRoot = computeNewPayloadRequestRoot(
        blockHash, params.feeRecipient, params.stateRoot,
        // ... remaining fields ...
        getVersionedHashes(params.payloadBlobCount),
        l1Anchor, bytes32(0)
    );

    // SSZ-encode the StatelessValidationResult container:
    //   new_payload_request_root (32 bytes) || successful_validation (1 byte)
    //   || chain_id (8 bytes, little-endian).
    // Must match serialize_stateless_output() in execution-specs.
    bytes memory expectedPublicValues = SSZ.encodeStatelessValidationResult(
        npRoot, true, chainId
    );
    bytes32 expectedPubValuesHash = sha256(expectedPublicValues);

    require(PROOFCOUNT() >= minProofCount, "insufficient proofs");
    for (uint256 i = 0; i < PROOFCOUNT(); i++) {
        require(PROGRAMHASH(i) == NATIVE_PROGRAM, "not a native program");
    }
    require(PUBVALUESHASH() == expectedPubValuesHash, "wrong public values");

    blockHash = params.blockHash;
    stateRoot = params.stateRoot;
    blockNumber = blockNumber + 1;
    stateRootHistory[blockNumber] = params.stateRoot;
}
```

ネイティブ[[Rollup|ロールアップ]]は、`programHash`がL1自体が受け入れるものと一致する[[Rollup|ロールアップ]]に過ぎません。L1のアップグレード（例：`verify_stateless_new_payload`を変更するフォーク）は自動的に伝播します。カスタムVMを持つ[[Rollup|ロールアップ]]は、異なる`programHash`で同じパターンを使用します。

*3投稿 - 3参加者*

[トピック全文を読む](https://ethresear.ch/t/native-proof-verification/24798)
