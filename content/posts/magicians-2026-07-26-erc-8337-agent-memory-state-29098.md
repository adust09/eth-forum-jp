---
title: 'ERC-8337: エージェントメモリ状態'
original_title: 'ERC-8337: Agent Memory State'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8337-agent-memory-state/29098'
author: everest-an
date: '2026-07-26'
category: ERCs
tags:
  - ercs
  - applications
  - ai-agents
  - smart-contracts
  - protocol-design
  - security
  - state-management
  - cryptography
  - agent-memory
  - verifiable-state
topic_id: '29098'
translated_at: '2026-07-27'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8337: Agent Memory State](https://ethereum-magicians.org/t/erc-8337-agent-memory-state/29098) — everest-an (2026-07-26)

皆さん、

これは、**[[glossary/ERC|ERC]]-8337: エージェントメモリ状態レジストリ**に関する議論スレッドです。これは、メモリコンテンツをオンチェーンに配置することなく、自律エージェントのメモリの検証可能なバージョン管理を行うための[[glossary/Draft|ドラフト]][[glossary/ERC|ERC]]です。

> **現在のステータス**
>
> -   [[glossary/EIP|EIP]]リポジトリに[[glossary/ERC|ERC]]-8337として提出済み ([ethereum/ERCs#1910](https://github.com/ethereum/ERCs/pull/1910))。
> -   [[glossary/EIP-Editor|EIPエディター]]によるレビュー待ち。ライブCIステータスは、アップストリームのPRで追跡されています。
> -   公開[[glossary/testnet|テストネット]]であるSepoliaにデプロイ済み。詳細は以下に記載されています。

## 概要

1年間稼働しているエージェントは、単に開始時のモデルではありません。好み、洗練されたスキル、改訂されたポリシー、そして何を行い、なぜ行ったかの記録を蓄積しています。

その蓄積された状態は、急速にエージェントの最も価値のある部分になりつつあります。それはユーザーが信頼するもの、オペレーターが別のプラットフォームに移行したいと考えるかもしれないもの、最終的にライセンス供与されるかもしれないもの、そして取引相手や規制当局が監査を要求するかもしれないものです。

将来のエージェントのメモリ状態と行動記録は保存される必要があると私は考えています。エージェントがWeb3のアクティブユーザーになると、そのトランザクションとアイデンティティ以外に、何を行い、何を考えたのかは分かりません。各エージェントは、操作中に3種類のメモリを保持します。実行時に考えたこと、その背後にある推論プロセス、そして他のエージェントと集合的に考えたことです。エージェントがどのようなアクションを取り、それらのアクションがどのような影響を与えたかは、公開メタデータとしてではなく、監査のために選択的に開示可能な検証可能なコミットメントとして記録される必要があります。境界を明確にするために言えば、**チェーンは潜在空間ベクトル自体を保存または管理することはなく、その潜在状態がどのように進化したかの検証可能な履歴を管理します。ベクトルはプライベートに保たれ、その軌跡は証明可能になります。**

[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]は、アイデンティティとオンチェーンでの評判を扱います。これは「このエージェントは誰で、信頼できるのか？」という問いに答えるのに役立ちます。意図的に、メモリ、永続的な状態、またはエージェントの認知がどのように進化するかについては指定していません。

[[glossary/ERC|ERC]]-8337は、補完的な問いに答えます。

> このエージェントのメモリは、どのような順序で、誰によって承認され、何もスキップされたりロールバックされたりすることなく、現在の状態に到達したのか。そして、第三者はメモリ自体を見ることなくそれを検証できるのか？

この提案は、メモリ状態、バージョン管理、および行動軌跡を第一級の検証可能なオブジェクトとして扱います。

## 動機

ダイジェストをコミットすること自体は新しい部分ではありません。[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]、ERC-7857、ERC-8257、ERC-8273、ERC-8299、およびEASは、すでに異なるコンテキストで不透明なコミットメントをサポートしています。

欠けているプリミティブは、ある状態コミットメントを次の状態コミットメントに接続する標準ルールです。

フラットアンカーはハッシュのコレクションです。シーケンス化された状態機械は監査可能な軌跡です。[[glossary/ERC|ERC]]-8337は両方を要求します。

```
sequence == currentSequence + 1
prevStateRoot == currentStateRoot
```

これらの制約により、第三者は以下を検出できます。

1.  オペレーターが[[glossary/Memory-Space|メモリ空間]]を以前の状態に密かにロールバックし、前方へリプレイすること。
2.  一つのアイデンティティの下で、矛盾する二つの履歴が並行して成長すること。
3.  一つ以上の遷移が省略されたギャップ。
4.  リレイヤーが、署名がカバーすることを意図していたストレージロケーターを置き換えること。

既存のフラットアンカー方式では、これらのケースを通常の操作と区別できません。ハッシュ化自体ではなく、状態遷移ルールがこの提案の理由です。

## 核となる直感

最も単純なアナロジーは次のとおりです。

> エージェントメモリのためのGit、ただし情報漏洩なし。

すべてのメモリ更新は、シーケンス化され、承認されたコミットです。レジストリは追記専用履歴を維持し、各状態は暗号学的にその前身にバインドされ、`force-push`に相当するものが構造的に不可能になります。

Gitとは異なり、レジストリは基盤となるコンテンツを受け取ることはありません。固定サイズのコミットメントのみがオンチェーンに表示されます。メモリコンテンツ、埋め込み、ポリシー、ソルト、暗号化キー、およびストレージの場所は、プライベートな証人データとしてオフチェーンに残ります。

## 提案されたインターフェース

核となる遷移は次のとおりです。

```
prevStateRoot + ExperienceDelta v1
    -> transitionId
    -> authorized commit
    -> nextStateRoot
```

### ExperienceDelta v1

規範的な構造体には、7つの固定幅フィールドが含まれています。

```
struct ExperienceDelta {
    bytes32 spaceId;
    uint64  sequence;
    bytes32 prevStateRoot;
    bytes32 deltaCommitment;
    bytes32 provenanceCommitment;
    bytes32 profileId;
    bytes32 locatorCommitment;
}
```

フィールドには以下の役割があります。

-   `spaceId`は[[glossary/Memory-Space|メモリ空間]]を識別します。
-   `sequence`は`1`から始まる厳密に増加するカウンターです。
-   `prevStateRoot`は遷移前の現在の[[glossary/State-Root|ステートルート]]です。
-   `deltaCommitment`はプライベートなメモリ操作または暗号化されたデルタをバインドします。
-   `provenanceCommitment`は、オプションで入力、推論[[glossary/Attestation|アテステーション（証明）]]、またはその他の因果関係のあるマテリアルをバインドします。
-   `profileId`はオフチェーンの解釈とコミットメントプロファイルを識別します。
-   `locatorCommitment`は、オプションでプライベートなオフチェーンロケーター自体を公開することなく、それをバインドします。

### 遷移ID

`transitionId`は、一つの固定タイプ文字列を使用する[[glossary/EIP-712|EIP-712]] `hashStruct`のデルタです。

```
ExperienceDelta(bytes32 spaceId,uint64 sequence,bytes32 prevStateRoot,bytes32 deltaCommitment,bytes32 provenanceCommitment,bytes32 profileId,bytes32 locatorCommitment)
```

[[glossary/Transition-ID|遷移ID]]を導出するためのJCS、CBOR、JSON、またはアプリケーション固有の代替手段はありません。

### 次のステートルート

レジストリは次の[[glossary/State-Root|ステートルート]]を計算します。

```
nextStateRoot = keccak256(
    abi.encode(
        MEMORY_STATE_TYPEHASH,
        prevStateRoot,
        transitionId
    )
);
```

呼び出し元は`nextStateRoot`を提供できません。

遷移は次の場合にのみ受け入れられます。

```
sequence == currentSequence + 1
prevStateRoot == currentStateRoot
```

### メモリ空間識別子

[[glossary/Memory-Space|メモリ空間]]は、その初期コントローラーに暗号学的にバインドされます。

```
spaceId = keccak256(
    abi.encode(
        MEMORY_SPACE_TYPEHASH,
        initialController,
        salt
    )
);
```

これにより、無関係なアカウントが別のコントローラーによって選択された名前空間を事前に登録するのを防ぎます。

### 認証モデル

各[[glossary/Memory-Space|メモリ空間]]には以下があります。

-   コントローラー：コントローラーまたはオーソライザーをローテーションできます。
-   オーソライザー：状態遷移を承認します。
-   空間ごとの`configNonce`：認証ローテーション中のリプレイを防ぎます。

署名は`locatorCommitment`を含むすべての`ExperienceDelta`フィールドをカバーします。したがって、リレイヤーはコミットされたロケーターを置き換えることはできません。

### EIP-712ドメイン

すべての関連する署名は以下のドメインを使用します。

```
name              = "AgentMemoryState"
version           = "1"
chainId           = current chain ID
verifyingContract = registry address
```

### EOA、ERC-1271、およびEIP-7702アカウント

認証は以下をサポートします。

-   外部所有アカウント (EOA)
-   ERC-1271コントラクトアカウント
-   [[glossary/EIP-7702|EIP-7702]]委任アカウント

検証は、`code.length`のみを使用して署名スキームを選択してはなりません。[[glossary/EIP-7702|EIP-7702]]委任[[glossary/EOA|EOA]]は`0xef0100 || delegate`コードを保持しますが、多くのデリゲートは署名ポリシーを実装していません。

現在のルールは次のとおりです。

1.  アカウントにコードがある場合はERC-1271を試行します。
2.  `0x1626ba7e`マジック値を受け入れます。
3.  それ以外の場合は、正規のECDSAリカバリにフォールバックします。

生メモリ、ソルト、暗号化キー、および生ロケーターは、レジストリに決して提供してはなりません。

## なぜEASだけではだめなのか？

EASは、最初に検討すべき代替手段です。すでに以下を提供しています。

-   [[glossary/Attestation|アテステーション（証明）]]をリンクするための`refUID`
-   選択的開示のためのMerkleマルチプルーフによるプライベートデータ[[glossary/Attestation|アテステーション（証明）]]
-   カスタム検証のためのリゾルバーコントラクト

しかし、EASはプロトコル層で後続の一意性を提供しません。参照される[[glossary/Attestation|アテステーション（証明）]]は存在するだけでよく、複数の[[glossary/Attestation|アテステーション（証明）]]が同じ`refUID`を参照する可能性があります。必須のシーケンス番号、先行状態バインディング、または名前空間ごとのコントローラー/オーソライザーモデルはありません。

これらのセマンティクスはEASスキーマとカスタムリゾルバーを使用して実装できますが、それは相互運用可能な標準ではなく、アプリケーションごとの実装のままです。これは、ERC-8273がそのドメインで提起したのと同じ一般的な区別です。

## 既存のエージェントERCとの関係

この分野はますます混雑しているため、意図された境界を以下に示します。隣接する提案の著者からの修正は特に歓迎します。

| 提案 | カバーする内容 | [[glossary/ERC|ERC]]-8337が追加する内容 |
| --- | --- | --- |
| [[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]: トラストレスなエージェント | アイデンティティ、評判、および検証レジストリ | メモリ状態の進化は[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]の範囲外です |
| ERC-8181: 自己主権型エージェントNFT | オフチェーンの認知状態に対するフラットな[[glossary/State-Anchor|状態アンカー]] | シーケンス、prevStateRoot、後続の一意性、および署名付きロケーターコミットメント |
| ERC-8264: AIエージェントメモリアクセス権 | 読み取り、書き込み、削除、エクスポートなどのデータ主体権 | メモリレコード間の状態の検証可能な進化 |
| ERC-8269: ボディリースとカプセル | 一つのカプセル内のペイロードハッシュに対するパッケージングとMerkleルート | 時間を通じた承認済み遷移のチェーン |
| ERC-7857: プライベートメタデータを持つAIエージェントNFT | 封印されたキーとアクセス証明による所有権移転 | 移転の前後における状態の進化 |

これらの提案のいずれも、[[glossary/ERC|ERC]]-8337に依存することなく、[[glossary/Memory-Space|メモリ空間]]、[[glossary/Transition-ID|遷移ID]]、または[[glossary/State-Root|ステートルート]]を参照できることを意図しています。

ERC-8181、ERC-8264、またはERC-8269の著者が、これらのセマンティクスが彼らの提案に並行してではなく、その内部に属すると考える場合、ドラフトが変更に比較的費用がかからない間は、そのフィードバックは特に価値があります。

## 明示的な非主張

有効な遷移は、設定された権限が、必要なシーケンスで特定のコミットされた状態遷移を承認したことのみを証明します。

以下は証明しません。

-   コミットされたコンテンツが真実であること。
-   オフチェーンコンテンツが利用可能であること。
-   基盤となるメモリの所有権。
-   推論が正しく実行されたこと。
-   オフチェーンコンテンツの削除が行われたこと。

これらの制限は、下流のアプリケーションがレジストリが提供しない保証を推測しないように、明示的に述べられています。

## 範囲外

コアは意図的に以下を標準化しません。

-   エージェントのアイデンティティ
-   生メモリの保存または取得
-   [[glossary/Data-Availability|データアベイラビリティ]]
-   普遍的なメモリ分類体系
-   推論の検証
-   ブランチングまたはマージルール
-   削除クレーム
-   ライセンス供与
-   支払い
-   トークン化

拡張機能は、コアプロトコルの一部となることなく、[[glossary/Memory-Space|メモリ空間]]、[[glossary/Transition-ID|遷移ID]]、または[[glossary/State-Root|ステートルート]]を参照できます。

## リファレンス実装とデプロイ

### リンク

-   [[glossary/ERC|ERC]]-8337ドラフト: [https://github.com/AwareLiquid/ERC-AWAR/blob/main/erc/erc-8337.md](https://github.com/AwareLiquid/ERC-AWAR/blob/main/erc/erc-8337.md)
-   アップストリームPR: [ethereum/ERCs#1910](https://github.com/ethereum/ERCs/pull/1910)
-   ホワイトペーパー: [https://github.com/AwareLiquid/ERC-AWAR/blob/main/docs/whitepaper.md](https://github.com/AwareLiquid/ERC-AWAR/blob/main/docs/whitepaper.md)
-   ロードマップ（厳格なステータスラベル）: [https://github.com/AwareLiquid/ERC-AWAR/blob/main/docs/roadmap/README.md](https://github.com/AwareLiquid/ERC-AWAR/blob/main/docs/roadmap/README.md)
-   脅威モデル: [https://github.com/AwareLiquid/ERC-AWAR/blob/main/docs/threat-model.md](https://github.com/AwareLiquid/ERC-AWAR/blob/main/docs/threat-model.md)
-   クロス言語ゴールデンベクトル: [https://github.com/AwareLiquid/ERC-AWAR/blob/main/test-vectors/v1.json](https://github.com/AwareLiquid/ERC-AWAR/blob/main/test-vectors/v1.json)
-   リファレンスリポジトリ: [https://github.com/AwareLiquid/ERC-AWAR](https://github.com/AwareLiquid/ERC-AWAR)

リファレンスリポジトリには、Solidityレジストリと、依存関係が分離された2つのTypeScript実装が含まれています。

### Sepolia

ライブのSepoliaレジストリは次のとおりです。

```
0xDdf21937ba80b5fF973610877A0955b320C91241
```

これは正規のゴールデンベクトルを再現します。一つのタイプハッシュは以下で確認できます。

```
cast call \
  0xDdf21937ba80b5fF973610877A0955b320C91241 \
  "EXPERIENCE_DELTA_TYPEHASH()(bytes32)" \
  --rpc-url https://ethereum-sepolia-rpc.publicnode.com
```

### 正規v1タイプハッシュ

| タイプ | タイプハッシュ |
| --- | --- |
| ExperienceDelta | 0x4f020f86bc06d852f1fde17853b4d92a70214eeab8e09718028124af097d070d |
| MemoryState | 0xf3148762556cbf851baf4b9a205e18ff4e6b366a58a3a1ef58e8626ba41beadb |
| MemorySpace | 0x9ae5478f084ad3b841da58a9cb2354d153cddec59ee64d0cb741fa9d08884531 |

## 未解決の質問

1.  **線形性**
    
    ドラフトは、[[glossary/Memory-Space|メモリ空間]]ごとに厳密に線形な履歴を強制します。これにより、ギャップ、サイレントロールバック、および矛盾する並行履歴が検出可能になります。並行性は、複数の[[glossary/Memory-Space|メモリ空間]]とオフチェーンマージを使用して表現できます。これが間違った基本プリミティブとなる具体的なエージェントのワークロードはありますか？
    
2.  **ベースラインコミットメント**
    
    ドメイン分離されたソルト付きKeccakコミットメントは許容される規範的ベースラインであり、ゼロ知識スキームはオプションのプロファイルを通じて利用可能であるべきでしょうか？[[glossary/ERC|ERC]]は、低エントロピーペイロードに対して、秘密のソルトだけでなく暗号化を要求すべきでしょうか？
    
3.  **ERC-1271と[[glossary/EIP-7702|EIP-7702]]のエッジケース**
    
    「ERC-1271を試行し、その後ECDSAにフォールバックする」という順序は正しいでしょうか？[[glossary/EIP-7702|EIP-7702]]の委任は元のキーを取り消さないため、ECDSAパスは引き続き利用可能です。レジストリは、[[glossary/Memory-Space|メモリ空間]]ごとにフォールバックを無効にすることを許可すべきでしょうか？
    
4.  **`profileId`のガバナンス**
    
    レジストリはプロファイル識別子に対して何らかの慣例を定義すべきでしょうか、それとも完全にアプリケーション定義のままにすべきでしょうか？公開された語彙から選択されたソルトなしの`profileId`は、実質的に公開されます。
    
5.  **削除のセマンティクス**
    
    「明示された削除スコープを持つ[[glossary/Attestation|アテステーション（証明）]]」というフレーミングは正しいでしょうか？コアは削除[[glossary/Attestation|アテステーション（証明）]]を規範的に参照すべきでしょうか、それとも沈黙を保つべきでしょうか？
    
6.  **発見可能性の階層化**
    
    [[glossary/Memory-Space|メモリ空間]]は意図的に不透明であり、そのため潜在的なインテグレーターやライセンシーにとって発見不可能でもあります。最小限の記述的メタデータはオプションの拡張機能に存在すべきでしょうか、それともコアには発見フックが必要でしょうか？
    
7.  **命名**
    
    「エージェントメモリ状態レジストリ」は正しいタイトルでしょうか、それとも「コミットメント」を強調するためにタイトルを「コミットメント」で始めるべきでしょうか？
    

範囲のいかなる部分に関するフィードバックも歓迎します。この提案は[[glossary/Draft|ドラフト]]のままであり、規範的な変更はまだ比較的費用がかかりません。

* * *

## 更新ログ

-   2026-07-26: [[glossary/EIP|EIP]]リポジトリに[[glossary/ERC|ERC]]-8337として提出済み ([ethereum/ERCs#1910](https://github.com/ethereum/ERCs/pull/1910))。
-   2026-07-26: Sepoliaレジストリを`0xDdf21937ba80b5fF973610877A0955b320C91241`にデプロイしました。3つのタイプハッシュはすべて`test-vectors/v1.json`と一致します。
-   2026-07-24: ドラフト`1.0.0-alpha.1`で最初の議論スレッドを開始しました。

## 外部レビュー

-   [@babyblueviper1](https://ethereum-magicians.org/u/babyblueviper1)による独立した再現（[[glossary/WYRIWE|WYRIWE (What You Read Is What You Execute)]] / ERC-8299）：3つのタイプハッシュすべてとベクトルのdomainSeparatorが仕様テキストのみから再計算され、バイト単位で一致しました。最初の外部検証です。
-   [[glossary/EIP-712|EIP-712]]、ERC-1271、[[glossary/EIP-7702|EIP-7702]]、プライバシー、暗号、およびエージェントシステム分野の貢献者からのレビューを特に歓迎します。

## 未解決の問題

-   2026-07-24: 別のチームによって維持される独立した第2の実装がまだ必要です。リポジトリには2つの実装が含まれていますが、どちらも同じプロジェクトによって維持されています。
-   2026-07-24: 外部セキュリティレビューは保留中です。
-   2026-07-24: 最終的な著者リストと長期的な[[glossary/ERC|ERC]]チャンピオンは未確定です。
-   2026-07-26: Sepoliaレジストリ`0xDdf21937ba80b5fF973610877A0955b320C91241`で解決済み。

*3投稿 - 2参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8337-agent-memory-state/29098)
