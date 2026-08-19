---
title: 'ERC-8382: プライベート参照可能NFT'
original_title: 'ERC-8382: Private Referable NFTs'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8382-private-referable-nfts/29442'
author: richard620
date: '2026-08-17'
category: ERCs
tags:
  - ercs
  - erc
  - privacy
  - zk
  - smart-contracts
  - applications
  - cryptography
  - protocol-design
topic_id: '29442'
translated_at: '2026-08-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8382: Private Referable NFTs](https://ethereum-magicians.org/t/erc-8382-private-referable-nfts/29442) — richard620 (2026-08-17)

## **概要**

この[[ERC|ERC]]は、NFT間のプライベートな参照に対する相互運用可能なコミットメントで[[ERC|ERC]]-721を拡張します。トークンは、参照されるNFT、参照ラベル、重み、または認証情報を開示することなく、1つ以上の参照コミットメントを公開できます。実装は共通の検出インターフェースを公開し、ミント時に[[Zero-Knowledge-Proof|ゼロ知識証明]]またはその他のプライバシー保護証明を要求する場合があります。また、後で個々の参照の選択的開示をサポートする場合があります。

コアインターフェースは証明システムに依存しません。Groth16、特定の楕円曲線、Poseidon、固定数の参照、または特定の認証レジストリを必要としません。オプションの拡張機能は、証明ゲート付きミント、選択的開示、登録スナップショットによる所有者認証、規範的な公開ポリシー、およびランクによって管理されるDAG挿入を標準化します。

## **動機**

[[ERC|ERC]]-721はユニークなトークンの所有権と転送を標準化していますが、トークン間の関係は標準化していません。ERC-5521は公開された参照元および参照先の関係を追加し、NFTグラフのクエリとインデックス作成を可能にします。公開参照は、来歴、リミックスの帰属、ライセンス、コラボレーション、推奨に役立ちますが、ホルダーが開示する準備ができていないうちに、商業的または社会的に機密性の高い情報を開示してしまう可能性があります。

プライベート参照は単なる不透明なハッシュであってはなりません。依存するコントラクトは、以下の証拠を必要とする場合があります。

1.  隠された親が既存の適格なNFTであること。
2.  親NFT所有者によって登録された鍵が、正確な子とエッジの意図を承認したこと。
3.  隠されたラベルと重みが公開監査可能なポリシーを満たしていること。
4.  参照がリプレイされていないこと。
5.  挿入が宣言されたグラフ順序付けルールに従っていること。
6.  コミットされた参照が後で選択的に開示され、独立してチェックできること。

既存のアプリケーションは、カスタムコントラクトでこれらのプロパティを実装できますが、カスタムイベント形式とクエリインターフェースは、ウォレット、マーケットプレイス、インデクサー、および来歴エクスプローラーがプライベート参照を一貫して検出することを妨げます。この[[ERC|ERC]]は、観測可能なライフサイクルを標準化しつつ、証明システムと暗号プロファイルを置き換え可能にしています。

プライベート参照は、下流のロイヤリティ、収益分配、ライセンス、評判、または帰属システムによっても消費される場合があります。暗号学的有効性、所有者認証、およびアプリケーション定義ポリシーへの準拠は、参照が宣言されたプロトコル条件を満たしていることを確立します。それら自体は、参照が真の創造的貢献、経済的に独立した当事者、または支払いを受ける権利を表していることを確立するものではありません。したがって、参照に経済的結果を付与するアプリケーションは、別途支払い適格性および貢献の真正性ルールを必要とします。

## **仕様**

このドキュメントにおけるキーワード「MUST」、「MUST NOT」、「REQUIRED」、「SHALL」、「SHALL NOT」、「SHOULD」、「SHOULD NOT」、「RECOMMENDED」、「MAY」、「OPTIONAL」は、RFC 2119およびRFC 8174に記述されている通りに解釈されます。

### **用語**

-   **子 (Child)**: 1つ以上のプライベート参照を含む[[ERC|ERC]]-721トークン。
-   **親 (Parent)**: 参照開示情報によってアドレス指定されるトークン。
-   **参照コミットメント (Reference commitment)**: プライベート参照と、プロファイルで要求されるすべてのバインディングコンテキストに対する32バイトのコミットメント。
-   **開示情報 (Opening)**: コミットされた参照に対して開示される公開セマンティックフィールド。
-   **検証データ (Validation data)**: ナンス、キーマテリアル、証明、または認証パスなど、開示情報を検証するために必要なプロファイル固有のバイト。
-   **ポリシー識別子 (Policy identifier)**: 参照が承認されたポリシーの32バイト識別子。
-   **証明プロファイル (Proof profile)**: 完全に指定されたステートメント、エンコーディング、検証者タイプ、ハッシュスイート、およびバージョンに対する32バイト識別子。
-   **認証エポック (Authorization epoch)**: 所有者認証のスコープ設定に使用される、レジストリ定義の時間またはガバナンス間隔。
-   **ランクネームスペース (Rank namespace)**: 不変のトークンランクが比較されるドメイン。
-   **隠された状態 (Hidden state)**: セマンティック開示情報が選択的開示インターフェースを通じて公開されていない、コミットされた参照。
-   **開示された状態 (Revealed state)**: 開示情報が検証され、保存されたコミットされた参照。

### **一般要件**

準拠するコア実装は以下を満たす必要があります。

1.  [[ERC|ERC]]-721および[[ERC|ERC]]-165を実装しなければなりません (MUST)。
2.  以下の`IERCXXXXPrivateReferences`を実装しなければなりません (MUST)。
3.  各プライベート参照に、子トークンに対してローカルなゼロベースのインデックスを割り当てなければなりません (MUST)。
4.  既存の`(tokenId, index)`におけるコミットメントまたはポリシー識別子を変更してはなりません (MUST NOT)。
5.  参照が作成されたときに、`PrivateReferenceCommitted`イベントを正確に1つ発行しなければなりません (MUST)。
6.  作成時に発行されたものと同じコミットメントとポリシー識別子を`privateReference`を通じて返さなければなりません (MUST)。
7.  既存の未開示参照をステータス`0`で、開示済み参照をステータス`1`で表現しなければなりません (MUST)。
8.  インデックスが`privateReferenceCount(tokenId)`以上の場合、リバートしなければなりません (MUST)。
9.  参照が隠されたままである間、親コントラクト、親トークン識別子、ラベル、重み、秘密のナンス、所有者の公開鍵、または認証証人をコアインターフェースを通じて公開してはなりません (MUST NOT)。
10. [[ERC|ERC]]-165を通じてコアインターフェースをアドバタイズしなければなりません (MUST)。

コントラクトは、ミント中にプライベート参照を作成するか、別のアプリケーション定義ライフサイクルを通じてそれらをアタッチすることができます。実装が`IERCXXXXProofMint`をアドバタイズする場合、この[[ERC|ERC]]の証明ゲート付きミント要件に従わなければなりません (MUST)。

### **インターフェースと共通データ型**

以下のインターフェースは`IERC165`を継承しているため、サポートするコントラクトは[[ERC|ERC]]-165を通じて準拠をアドバタイズできます。コアインターフェースは必須であり、他のすべてのインターフェースはオプションの拡張機能です。

```solidity
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;
​
struct ReferenceOpening {
    address parentContract;
    uint256 parentTokenId;
    uint256 parentRank;
    uint256 label;
    uint256 weight;
}
​
struct PrivateReferenceMintRequest {
    address recipient;
    bytes32 metadataHash;
    uint256 mintNonce;
    bytes32 childCommitment;
    bytes32 policyId;
    bytes32 authorizationRoot;
    uint64 authorizationEpoch;
    bytes32 rankNamespace;
    uint256 childRank;
    bytes32 externalNullifier;
    bytes32[] referenceCommitments;
    bytes32[] referenceNullifiers;
}
```

`metadataHash`は、証明プロファイルによってバインドされるアプリケーション選択のダイジェストです。これは[[ERC|ERC]]-721の`tokenURI`セマンティクスを置き換えるものではありません。

### **コアプライベート参照インターフェース**

```solidity
interface IERCXXXXPrivateReferences is IERC165 {
    /// status: 0 = hidden, 1 = revealed
    event PrivateReferenceCommitted(
        uint256 indexed tokenId,
        uint256 indexed index,
        bytes32 commitment,
        bytes32 indexed policyId
    );
​
    event PrivateReferenceRevealed(
        uint256 indexed tokenId,
        uint256 indexed index,
        address indexed parentContract,
        uint256 parentTokenId,
        uint256 parentRank,
        uint256 label,
        uint256 weight
    );
​
    function privateReferenceCount(uint256 tokenId)
        external
        view
        returns (uint256 count);
​
    function privateReference(uint256 tokenId, uint256 index)
        external
        view
        returns (bytes32 commitment, bytes32 policyId, uint8 status);
​
    function revealedReference(uint256 tokenId, uint256 index)
        external
        view
        returns (ReferenceOpening memory opening);
}
```

`revealedReference`は、参照が隠されている間はリバートしなければなりません (MUST)。参照が開示された後、選択的開示操作によって承認された開示情報を返さなければなりません (MUST)。

### **オプションの選択的開示拡張**

```solidity
interface IERCXXXXSelectiveReveal is IERC165 {
    function canRevealPrivateReference(
        uint256 tokenId,
        uint256 index,
        address operator
    ) external view returns (bool);
​
    function revealPrivateReference(
        uint256 tokenId,
        uint256 index,
        ReferenceOpening calldata opening,
        bytes calldata validationData
    ) external;
}
```

この拡張機能をアドバタイズする実装は以下を満たす必要があります。

1.  `opening`と`validationData`が、アクティブな証明プロファイルの下で`(tokenId, index)`における不変のコミットメントを開示することを検証しなければなりません (MUST)。
2.  同じインデックスに対する2回目の開示を拒否しなければなりません (MUST)。
3.  ゼロの`parentContract`を拒否しなければなりません (MUST)。
4.  ステータスを隠された状態から開示された状態に変更するのは、検証が成功した後のみでなければなりません (MUST)。
5.  承認された`ReferenceOpening`を保存し、`PrivateReferenceRevealed`を[[Atomic-Settlement|アトミック]]に発行しなければなりません (MUST)。
6.  開示のための認証ポリシーを定義しなければなりません (MUST)。少なくとも、アプリケーションが意図的に厳格なポリシーを使用しない限り、現在のトークン所有者および[[ERC|ERC]]-721の下で承認されたオペレーターがサポートされるべきです (SHOULD)。
7.  呼び出し元の認証を、開示情報が正しいことの証明として解釈してはなりません (MUST NOT)。認証とコミットメント検証は別々のチェックです。

`validationData`は意図的にプロファイル固有です。プロファイルは、その規範的なエンコーディングを定義しなければなりません (MUST)。例えば、エッジナンス、承認ナンス、所有者の公開鍵、所有者エポック、または開示の証明を含む場合があります。

この[[ERC|ERC]]は、隠された参照または開示された参照が下流のアプリケーションで経済的に適格になる時期を定義しません。ロイヤリティ、収益分配、ライセンスの利益、評判、またはその他の経済的効果を参照に付与するアプリケーションは、コミットメント時間、認証時間、開示時間、リスト時間、またはその他のアプリケーション定義イベントなど、どのライフサイクルイベントが適格性を制御するか、および後での開示が遡及的な経済効果を持つかどうかを定義しなければなりません (MUST)。

### **オプションの証明ゲート付きミント拡張**

```solidity
interface IERCXXXXProofMint is IERC165 {
    event PrivateReferenceMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        bytes32 childCommitment,
        bytes32 indexed policyId,
        bytes32 proofProfile
    );
​
    function proofProfile() external view returns (bytes32 profileId);
​
    function mintWithPrivateReferences(
        PrivateReferenceMintRequest calldata request,
        bytes calldata proof
    ) external returns (uint256 tokenId);
}
```

この拡張機能をアドバタイズする実装は、ミント前に以下を満たす必要があります。

1.  ゼロの受信者を拒否しなければなりません (MUST)。
2.  `referenceCommitments.length`が`referenceNullifiers.length`と等しく、証明プロファイルによって許可されていることをチェックしなければなりません (MUST)。
3.  すべての参照ナリファイアが規範的で、リクエスト内でペアごとに異なり、未使用であることをチェックしなければなりません (MUST)。
4.  プロファイルが子のユニーク性を定義している場合、子コミットメントが以前に消費されていないことをチェックしなければなりません (MUST)。
5.  `block.chainid`、承認コントラクト、アクションセレクター、証明プロファイル識別子、ポリシー識別子、認証エポック、および外部ナリファイアを含む、プロファイルで要求されるすべてのコントラクトにバインドされた公開コンテキストを導出または検証しなければなりません (MUST)。
6.  リクエストエポックに対するアクティブな認証ルートとポリシーを検証しなければなりません (MUST)。
7.  要求されるランク予約とランクネームスペースを検証しなければなりません (MUST)。
8.  `proof`を`proofProfile()`によって定義された正確な規範的な公開入力エンコーディングに対して検証しなければなりません (MUST)。
9.  ナリファイアとワンタイムコミットメントを消費済みとしてマークしなければなりません (MUST)。
10. [[ERC|ERC]]-721トークンをミントし、すべての参照コミットメントとポリシー識別子を保存し、インデックスごとに1つの`PrivateReferenceCommitted`イベントを発行しなければなりません (MUST)。
11. `PrivateReferenceMinted`を発行しなければなりません (MUST)。

すべてのチェック、リプレイスステートの更新、ミント、ストレージ書き込み、およびイベントは[[Atomic-Settlement|アトミック]]でなければなりません (MUST)。失敗した操作は、ナリファイア、予約、または子コミットメントを消費してはなりません (MUST NOT)。

証明検証者は、トークンコントラクトに埋め込まれるか、別のコントラクトに委任される場合があります。`bytes proof`はこの[[ERC|ERC]]にとって不透明です。プロファイルがその形式と検証アルゴリズムを定義します。

### **証明プロファイルの要件**

プロファイル識別子は、以下を含むすべてのコンセンサス関連の証明セマンティクスをコミットまたは明確に識別しなければなりません (MUST)。

-   関係およびスキーマのバージョン。
-   証明システムと曲線（該当する場合）。
-   ハッシュまたはコミットメントスイート。
-   ドメイン分離タグ。
-   フィールドおよびバイトエンコーディング。
-   公開シグナルの名前、順序、幅、および規範的な範囲。
-   子コミットメントの導出。
-   参照コミットメントの導出。
-   ナリファイアの導出。
-   所有者認証ステートメント。
-   ポリシーエンコーディング。
-   ランクルール。
-   バッチサイズルール。
-   検証者コードまたは不変の検証者識別子。

これらの項目のいずれかを変更すると、異なるプロファイル識別子を生成しなければなりません (MUST)。実装は、あるプロファイル用に生成された証明を、別のプロファイルに属するものとして検証してはなりません (MUST NOT)。

プロファイルは、少なくとも以下を含むドメインからコミットメントとナリファイアを導出すべきです (SHOULD)。

```
(profileId, chainId, acceptingContract, actionSelector)
```

レジストリスコープの認証リーフは、レジストリアドレスと認証スキーマバージョンもバインドすべきです (SHOULD)。

### **オプションの規範的ポリシー拡張**

```solidity
interface IERCXXXXCanonicalPolicy is IERC165 {
    event CanonicalPolicyRegistered(
        bytes32 indexed policyId,
        uint64 indexed activationEpoch,
        bytes canonicalPolicy
    );
​
    function canonicalPolicy(bytes32 policyId)
        external
        view
        returns (
            bytes memory canonicalPolicy,
            uint64 activationEpoch,
            bool registered
        );
​
    function isPolicyActive(bytes32 policyId, uint64 epoch)
        external
        view
        returns (bool);
}
```

この拡張機能をアドバタイズする実装は以下を満たす必要があります。

1.  規範的なポリシー原像を公開クエリ可能にしなければなりません (MUST)。
2.  その規範的なABIエンコーディングを文書化しなければなりません (MUST)。
3.  `policyId`が返された原像のプロファイル定義ダイジェストであることを保証しなければなりません (MUST)。
4.  登録された`policyId`に関連付けられた原像を変更してはなりません (MUST NOT)。
5.  オブザーバーが指定されたエポックに対してポリシーがアクティブであったかどうかを判断するのに十分な情報を公開しなければなりません (MUST)。

不透明な承認済みダイジェストのみを公開するだけでは、この拡張機能には不十分です。そのようなシステムは、承認されたポリシー識別子への準拠を主張できますが、既知のポリシーフィールドに対する公開監査可能な準拠を主張することはできません。

ポリシー準拠は貢献証明ではありません。規範的なポリシーは、許容されるラベル、重み範囲、ネームスペース、エポック、またはその他の機械でチェック可能なフィールドを制約する場合がありますが、範囲内またはその他のポリシー準拠の値は、その値が現実世界の創造的貢献または経済的重要性忠実に表していることを証明するものではありません。ラベルや重みを収益化する下流のアプリケーションは、そのような真正性が重要である場合、追加の証明、承認、モデレーション、紛争解決、またはその他のアプリケーション固有のメカニズムを使用すべきです (SHOULD)。

### **オプションの登録スナップショット所有者認証拡張**

```solidity
interface IERCXXXXOwnerAuthorization is IERC165 {
    event OwnerAuthorizationRegistered(
        address indexed parentContract,
        uint256 indexed parentTokenId,
        bytes32 indexed authorizationLeaf,
        bytes32 root,
        uint64 epoch,
        bytes4 keyScheme,
        bytes publicKey,
        bytes32 rankNamespace,
        uint256 parentRank
    );
​
    event OwnerAuthorizationRevoked(
        bytes32 indexed authorizationLeaf,
        uint64 indexed epoch
    );
​
    event AuthorizationEpochAdvanced(
        uint64 indexed previousEpoch,
        uint64 indexed newEpoch
    );
​
    function currentAuthorizationEpoch() external view returns (uint64);
​
    function isAuthorizationRootActive(
        bytes32 root,
        bytes32 policyId,
        uint64 epoch
    ) external view returns (bool);
​
    function registerOwnerAuthorization(
        address parentContract,
        uint256 parentTokenId,
        bytes4 keyScheme,
        bytes calldata publicKey,
        bytes32 rankNamespace
    ) external returns (bytes32 leaf, uint256 leafIndex, bytes32 newRoot);
​
    function revokeOwnerAuthorization(
        address parentContract,
        uint256 parentTokenId,
        bytes4 keyScheme,
        bytes calldata publicKey,
        bytes32 rankNamespace
    ) external returns (bytes32 leaf);
}
```

登録は、`ownerOf(parentTokenId)`を通じて現在の[[ERC|ERC]]-721所有者をチェックしなければなりません (MUST)。プロファイルは、親コントラクト、トークン識別子、公開鍵、ランク、ランクネームスペース、エポック、チェーン、およびレジストリが認証リーフにどのようにエンコードされるかを定義しなければなりません (MUST)。

ミントのために承認されたルートは、現在の認証エポックと適用可能なポリシーに対して明示的にアクティブでなければなりません (MUST)。実装は、レジストリの成長中に証明のライブネスを維持するために、1つのエポック内で複数のアクティブ化されたルートを受け入れる場合があります (MAY)。その場合、新しいルートをアクティブ化しても、そのエポック内の古いルートを黙って非アクティブ化してはなりません (MUST NOT)。古いエポックのルートは、プロファイルによって別途繰り越しまたは取り消し関係が明示的に標準化されていない限り、拒否されなければなりません (MUST)。

取り消しセマンティクスは文書化されなければなりません (MUST)。エポックロールオーバー取り消しと即時エポック内取り消しは異なります。将来の再登録のみを防止する実装は、以前にアクティブ化されたルートの即時無効化を主張してはなりません (MUST NOT)。

所有者認証は、レジストリスナップショットによって表される所有者による同意を確立します。それは、参照が経済的に独立している、非[[Sybil-attacks|Sybil]]である、または下流の報酬を受ける権利があることを確立するものではありません。特に、子と親の両方のアセットを制御するアクターは、認証を正しく満たすことができる場合があります。支払いまたはその他の希少な利益のために承認された参照を使用するアプリケーションは、認証と経済的適格性を別々の決定として扱わなければなりません (MUST)。

`keyScheme`は署名/公開鍵エンコーディングを識別します。キー構成プロファイルは、規範的な公開鍵および署名検証を定義しなければなりません (MUST)。楕円曲線プロファイルは、曲線上の点であること、非同一であること、部分群に属すること、およびスカラーの規範性要件を指定しなければなりません (MUST)。

### **オプションのランク付けされたDAG拡張**

```solidity
interface IERCXXXXRankedReferences is IERC165 {
    event ChildRankReserved(
        bytes32 indexed childPreCommitment,
        bytes32 indexed rankNamespace,
        uint256 childRank,
        bytes32 reservationId
    );
​
    event TokenRankAssigned(
        address indexed tokenContract,
        uint256 indexed tokenId,
        bytes32 indexed rankNamespace,
        uint256 rank
    );
​
    function rankOf(
        address tokenContract,
        uint256 tokenId,
        bytes32 rankNamespace
    ) external view returns (uint256 rank, bool assigned);
​
    function reserveChildRank(
        bytes32 childPreCommitment,
        bytes32 rankNamespace
    ) external returns (uint256 childRank, bytes32 reservationId);
​
    function rankReservation(
        bytes32 childPreCommitment,
        bytes32 rankNamespace
    ) external view returns (
        uint256 childRank,
        bytes32 reservationId,
        bool active
    );
}
```

この拡張機能をアドバタイズする実装は以下を満たす必要があります。

1.  ランクネームスペース内のアセットに、最大で1つの不変のランクを割り当てなければなりません (MUST)。
2.  予約を承認アダプター、子プレコミットメント、およびランクネームスペースにバインドしなければなりません (MUST)。
3.  呼び出し元がミント時に異なるランクを代替することを防止しなければなりません (MUST)。
4.  ミントと[[Atomic-Settlement|アトミック]]に正確な予約を消費しなければなりません (MUST)。
5.  承認されたすべてのランク付けされた参照に対して`parentRank < childRank`を強制しなければなりません (MUST)。
6.  誰がランクを割り当てることができるかを定義し、不正な事前割り当てまたはネームスペースのグリフィングを防止しなければなりません (MUST)。
7.  すべての関連トークンが同じネームスペース内に不変のランクを持たない限り、ローカルな不等式のみから任意のグローバルな動的非巡回性を主張してはなりません (MUST NOT)。

予約は、その子プレコミットメントを消費するミントに公開でリンク可能です。リレーヤーまたは[[Account-Abstraction|アカウント抽象化]]システムはウォレットIDのリンクを減らすことができますが、プロトコルレベルの予約とミントの関係を隠すことはありません。

### **ERC-165要件**

-   実装は`supportsInterface(type(IERCXXXXPrivateReferences).interfaceId)`に対して`true`を返さなければなりません (MUST)。
-   実装は、完全なセマンティクスを実装するオプションの拡張識別子に対してのみ`true`を返さなければなりません (MUST)。
-   イベントと継承された関数は、インターフェース識別子の計算には含まれません。
-   追加のインターフェースは、実装の通常の`supportsInterface`継承チェーンを通じて転送されるべきです (SHOULD)。

| インターフェース | インターフェース識別子 |
| --- | --- |
| IERCXXXXPrivateReferences | 0x9d2c065b |
| IERCXXXXSelectiveReveal | 0x15d38dfb |
| IERCXXXXProofMint | 0xa6a4cad2 |
| IERCXXXXCanonicalPolicy | 0x8f43c3aa |
| IERCXXXXOwnerAuthorization | 0x1a9dd556 |
| IERCXXXXRankedReferences | 0xce938bbe |

### **主要コンポーネント**

#### **構造体**

-   `ReferenceOpening`は、1つの参照に対して開示される親コントラクト、親トークン識別子、親ランク、ラベル、および重みを含みます。
-   `PrivateReferenceMintRequest`は、公開ミントコンテキスト、コミットメント、ナリファイア、ポリシー、認証ルートとエポック、ランクネームスペース、および子ランクを含みます。

#### **関数**

-   `privateReferenceCount`と`privateReference`は、バッチサイズに依存しない隠された参照または開示された参照の検出を提供します。
-   `revealedReference`は、開示後の不変なセマンティック開示情報を返します。
-   `revealPrivateReference`は、兄弟参照を開示することなく、1つのインデックス付き開示情報を検証します。
-   `mintWithPrivateReferences`は、プロファイル固有の証明を検証し、リプレイスステートを消費しながら子トークンを[[Atomic-Settlement|アトミック]]にミントします。
-   `canonicalPolicy`は、公開セマンティック監査に必要な不変のポリシー原像を公開します。
-   `registerOwnerAuthorization`と`revokeOwnerAuthorization`は、文書化されたエポックセマンティクスに基づいて登録スナップショット所有者キーを管理します。
-   `reserveChildRank`、`rankReservation`、および`rankOf`は、オプションのランク付けされたDAGプロファイルをサポートします。

#### **イベント**

-   `PrivateReferenceCommitted`は、親エンドポイントを公開することなく、新しいインデックス付きコミットメントを発表します。
-   `PrivateReferenceRevealed`は、1つのインデックスに対する検証済み開示情報を公開します。
-   `PrivateReferenceMinted`は、ミントに使用された子コミットメント、ポリシー、および証明プロファイルを記録します。
-   ポリシー、認証、エポック、およびランクイベントは、プルーバーとインデクサーが必要とするガバナンス遷移を公開します。

### **参照ライフサイクル**

証明ゲート付きランク付け実装は通常、このライフサイクルに従います。

1.  親NFT所有者が、親と現在のエポックの認証キーを登録します。
2.  ガバナンスまたは別の指定されたメカニズムが、1つ以上の認証ルートと規範的なポリシーをアクティブ化します。
3.  将来の子ミント者が子プレコミットメントを計算し、ランクを予約します。
4.  親所有者が、子コミットメント、ポリシー、エポック、および新しい承認ナンスにバインドされた正確なエッジインテントに署名します。
5.  プルーバーが、隠された親の適格性、所有者認証、ポリシー準拠、リプレイ導出、およびランク順序付けが保持されることの証明を構築します。
6.  `mintWithPrivateReferences`は、リクエストと証明を検証し、リプレイスステートと予約を消費し、子をミントし、コミットメントを保存します。
7.  ウォレットとインデクサーは、コアインターフェースとコミットメントイベントを通じて隠された参照を発見します。
8.  承認されたオペレーターが後で1つのインデックスを開示する場合があります。コントラクトは開示情報を検証し、`PrivateReferenceRevealed`を発行します。
9.  開示後、実装はERC-5521と互換性のある公開関係も公開する場合があります。

### **ERC-5521相互運用性**

開示前は、プライベート参照には公開親エンドポイントがないため、プライバシーを損なうことなくERC-5521の参照元または参照先リストにデータを入力することはできません。

開示が成功した後、ERC-5521もサポートする実装は、そのERC-5521クエリインターフェースを通じて参照を公開する場合があります。そのような公開は以下を満たす必要があります。

-   `revealPrivateReference`によって承認されたものと同じ親コントラクトとトークン識別子を使用しなければなりません (MUST)。
-   異なるセマンティックエッジを作成してはなりません (MUST NOT)。
-   ERC-5521の認証およびクロスコントラクトコールバック要件を維持しなければなりません (MUST)。
-   両方のインターフェースが同じコントラクトによって実装されている場合、開示と[[Atomic-Settlement|アトミック]]に発生すべきです (SHOULD)。

この[[ERC|ERC]]は、親における未開示の逆インデックスを要求しません。逆インデックスは隠された親を開示するか、この[[ERC|ERC]]の範囲外の追加のプライバシー保護インデックスプロトコルを必要とします。

### **規範的なエンコーディング**

すべての`bytes32`値は、コアインターフェースでは不透明ですが、プロファイル内では規範的です。プロファイルが素体要素を`bytes32`にマッピングする場合、バイト順序を指定しなければならず (MUST)、体のモジュラス以上の非規範的な値を拒否しなければなりません (MUST)。

フィールドハッシュ内で使用されるアドレスは、プロファイルが別の曖昧さのないエンコーディングを指定しない限り、符号なし160ビット値としてエンコードされなければなりません (MUST)。リムに分割された`uint256`トークン識別子は、リムの幅と順序を指定しなければなりません (MUST)。

動的配列は、曖昧さのない長さと順序付けられたインデックスでバインドされなければなりません (MUST)。プロファイルは、同じ公開ステートメントに対して2つのバイトエンコーディングを受け入れてはなりません (MUST NOT)。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8382-private-referable-nfts/29442)
