---
title: エフェメラルアカウントの提唱と実装アプローチ
original_title: Arguments for Ephemeral Accounts and Implementation Approaches
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/arguments-for-ephemeral-accounts-and-implementation-approaches/29524
author: Helkomine
date: '2026-08-27'
category: EIPs core
tags:
  - eips-core
  - execution-layer
  - evm
  - gas
  - eip
  - protocol-design
  - smart-contracts
  - account-abstraction
  - self-destruct
topic_id: '29524'
translated_at: '2026-08-27'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Arguments for Ephemeral Accounts and Implementation Approaches](https://ethereum-magicians.org/t/arguments-for-ephemeral-accounts-and-implementation-approaches/29524) — Helkomine (2026-08-27)

## はじめに

エフェメラルアカウントは、イーサリアム上の任意の[[glossary/smart-contract|スマートコントラクト]]と同様に、実行コンテナとしてのみ機能するアカウントですが、トランザクションの終了時に削除されます。これらは、[[glossary/persistent-state|永続的ステート]]を導入することなく、プロトコルネイティブな一時的実行環境を提供します。

現在のプロトコルルールでは、このようなアカウントは、`CREATE`/`CREATE2`でコントラクトを作成し、任意の[[glossary/EVM-code|EVMコード]]を実行し、その後、同じトランザクション内で`SELFDESTRUCT`を使用して新しく作成されたアカウントを任意の時点で削除することで、[[glossary/Ethereum|イーサリアム]]上にすでに実装可能です。しかし、このアプローチには2つの大きな制限があります。

-   **[[glossary/account-creation|アカウント作成]]のコストが法外に高い。** 各[[glossary/account-creation|アカウント作成]]には[[glossary/state-creation-costs|ステート作成コスト]]がかかります。[[glossary/EIP-8037|EIP-8037]]では、[[glossary/account-creation|アカウント作成]]コストは`183600` [[glossary/gas|ガス]]です。アカウントが実行中にコードを保存する場合、作成者はさらに動的な[[glossary/code-deposit-cost|コードデポジットコスト]] `L * [[glossary/CPSB|CPSB（ステートバイトあたりのコスト）]]`を支払う必要があります。[[glossary/EIP-8038|EIP-8038]]では、作成者はメモリ拡張や初期化コードハッシュ化などの付帯コストに加えて、`CREATE_ACCESS = 12000`と`SELFDESTRUCT`の基本コスト`5000` [[glossary/gas|ガス]]も支払う必要があります。これらの付帯コストは、[[glossary/state-creation-costs|ステート作成コスト]]やステートアクセスコストに比べて比較的小さいです。結果として、単一のエフェメラルアカウント呼び出しは現在、少なくとも`200600` [[glossary/gas|ガス]]かかります。これは、[[glossary/EIP-2780|EIP-2780]]に基づく各21000[[glossary/gas|ガス]]の基本的な[[glossary/ETH-transfers|ETH転送]]9.5回分にほぼ相当するか、Uniswapでの[[glossary/token-swap|トークンスワップ]]のコストとほぼ同じです。

-   **`SELFDESTRUCT`は非推奨であり、そのセマンティクスは変更され続けています。** したがって、`SELFDESTRUCT`に依存する設計は本質的に不安定です。[[glossary/Glamsterdam|グラムステルダム]]には現在、`SELFDESTRUCT`の[[glossary/Ether-burning-behavior|Ether焼却動作]]を削除する[[glossary/EIP-8246|EIP-8246]]が含まれています。この変更により、自己破壊するアカウント自体に[[glossary/Ether|Ether]]を送っても、総供給量から[[glossary/Ether|Ether]]が削除されることはなくなります。[[glossary/Hegota|ヘゴタ]]には現在、[[glossary/EIP-6780|EIP-6780]]で指定された残りの機能を削除することを提案する[[glossary/EIP-4758|EIP-4758]]が含まれています。これにより、アカウントの全残高を任意のアドレスに転送する際に、このオペコードは[[glossary/EIP-5920|EIP-5920]]で定義された`PAY`オペコードと実質的に同等になります。

これらの制約により、エフェメラルアカウントは経済的に非効率であると同時に、安定した[[glossary/protocol-primitive|プロトコルプリミティブ]]として信頼することが困難になっています。著者は、これはプロトコルの意図された特性ではなく、ネットワーク保護措置と技術的負債の解消の偶発的な結果であり、[[glossary/Ethereum|イーサリアム]]上で有効かつますます一般的になっているユースケースを不注意にも罰していると主張します。

本ドキュメントでは、エフェメラルアカウントを正当な実行プリミティブとして認識するための議論を提示し、複雑さと効率の異なるトレードオフを持ついくつかの実装アプローチを評価します。これらのアプローチは、将来の[[glossary/hard-fork|ハードフォーク]]に含めることが検討される可能性があり、[[glossary/EIP-8037|EIP-8037]]の会計ルールに比較的わずかな修正を加えることで、早ければ[[glossary/Glamsterdam|グラムステルダム]]にも導入できるかもしれません。

## 賛成意見

エフェメラルアカウントは、そのロジックをアカウントのライフタイムに結合することなく、任意の実行ロジックを可能にします。[[glossary/state-channels|ステートチャネル]]や[[glossary/one-time-accounts|ワンタイムアカウント]]は、この設計の既存のユースケースです。エフェメラルアカウントは、例えば条件を検証したり、トランザクション固有のワークフロー調整を実行したりするための[[glossary/execution-hooks|実行フック]]として機能することで、[[glossary/Account-Abstraction|アカウント抽象化]]にも役立ちます。

エフェメラルアカウントは本質的に[[glossary/persistent-state|永続的ステート]]を作成しません。エフェメラルアカウント内での実行がそのコードを通じて追加のステートを作成する可能性はありますが、そのようなステートはエフェメラルアカウント自体の一部ではなく、[[glossary/EIP-8037|EIP-8037]]に従って課金されます。

したがって、既存の構築は技術的には可能ですが、そのコストは法外に高く、その動作は十分に安定していません。関連コストを削減し、基盤となる操作のセマンティクスをより明確に定義することで、この構築は実質的により有用になるでしょう。

もし[[glossary/EIP-8037|EIP-8037]]が追加の修正なしにデプロイされた場合、同じコスト構造が他の[[glossary/EVM-compatible-chains|EVM互換チェーン]]にも継承される可能性があり、エコシステム全体でこのユースケースがさらに実用的でなくなる可能性があります。

新しい[[glossary/TCREATE-opcode|TCREATEオペコード]]のような専用の[[glossary/protocol-primitive|プロトコルプリミティブ]]を導入することは、クリーンな実装を提供しますが、プロトコルにさらなる複雑さをもたらすでしょう。コア開発者は一般的に、既存のメカニズムを適応させることができる場合には新しい[[glossary/execution-primitive|実行プリミティブ]]を避けることを好むため、既存の`CREATE`/`SELFDESTRUCT`のセマンティクスをまず再検討すべきです。

[@chfast](https://ethereum-magicians.org/u/chfast)によって収集された同一トランザクション内での`SELFDESTRUCT`操作の[詳細な統計](https://ethereum-magicians.org/t/can-we-completely-remove-selfdestruct/28464)は、実際の使用状況をより明確に示しています。データは、10万ブロックあたり約8,000〜14,000トランザクションと、時間の経過とともに意味のある、わずかな増加傾向を示しています。もしエフェメラルアカウントがプロトコルによって明示的にサポートされれば、その使用量はさらに増加すると予想されます。

## 潜在的な異論

上記の使用統計は、プロトコルレベルの変更を正当化するには不十分に見えるかもしれません。しかし、著者は、観測された使用量が現在のプロトコルルールによって制約されていると主張します。

これは、オートバイに厳しい制限を課す都市との類推で説明できます。もしその後の調査で1日あたり200台のオートバイしか使用されていないことが判明しても、これは住民がオートバイを好まなくなったことを証明するものではありません。むしろ、ユーザーは活動に伴う利益を失うことを避けるために使用量を減らした可能性があります。

同様に、エフェメラルアカウントの現在のコストと不安定性は、このプリミティブへの需要を抑制しています。したがって、これらの制約を取り除くことで、時間の経過とともに使用量が増加し、実質的に高い定常状態レベルに達する可能性があります。

### 実装の複雑さ

実装の複雑さは正当な懸念事項です。しかし、その複雑さは、ユーザーの利益とエフェメラル実行の長期的なスケーラビリティの可能性によって正当化できます。

さらに重要なことに、提案されている実装アプローチは異なる複雑性プロファイルを持っています。より単純なアプローチは[[glossary/Glamsterdam|グラムステルダム]]で優先され、より洗練された会計メカニズムは[[glossary/Hegota|ヘゴタ]]のような将来のアップグレードに延期することができます。

### 任意のコード実行

任意のコードを実行することは正当なセキュリティ上の考慮事項を導入しますが、実行コンテキストは呼び出し元アカウント内でのコード実行とは区別されなければなりません。

アカウントが自分自身の中で任意のコードを実行する場合、信頼できない入力を受け入れると、仮想的な`RUNCODE` [プリミティブ](https://ethereum-magicians.org/t/eip-7990-runcode-opcode-execute-arbitrary-bytecode-from-memory-within-the-same-execution-context/24850)のように予期せぬ動作を引き起こす可能性があります。ここで説明するエフェメラルアカウントは、代わりに別のEVMアカウントコンテキストでコードを実行します。呼び出し元がエフェメラルアカウントに対して明示的に`DELEGATECALL`を使用しない限り、そのステート変更は隔離されます。その場合、実行は`RUNCODE`と同じセキュリティモデルに戻ります。

そうでなければ、この構築は原則としてウォレットがルーターコントラクトを呼び出すのと何ら変わりありません。

しかし、コードが固定されオンチェーンにデプロイされている場合でも、その動作が不変であるという保証はありません。一例として、[Analog Labs](https://github.com/Analog-Labs/evm-interpreter/)によって開発されたインタープリターコントラクトがあります。ここでは、呼び出し元が[[glossary/Solidity|Solidity]]からコンパイルされた[[glossary/EVM-bytecode|EVMバイトコード]]を含む[[glossary/calldata|コールデータ]]を提供し、インタープリターはまるでその[[glossary/EVM-bytecode|バイトコード]]が`CREATE`操作のコンストラクタで実行されているかのようにそれを実行します。

このようなインタープリターベースのアプローチの主な欠点は、その実行オーバーヘッドです。これはまさに、ネイティブなエフェメラル実行が、コードを[[glossary/EVM|EVM]]で直接実行させることで排除しようとしているコストです。

## 実装アプローチ

このセクションでは、いくつかの可能な実装アプローチを評価します。各アプローチは、実行効率、会計の複雑さ、および実装の複雑さの間で異なるトレードオフを表します。

### 返金をトランザクション終了時まで延期する

これは最も単純なアプローチであり、[[glossary/Glamsterdam|グラムステルダム]]の加速されたタイムラインによく適しています。

実装では、`SELFDESTRUCT`を実行し、トランザクション終了時に残りのステートがないアカウントを記録し、対応する返金を適用します。同様のメカニズムは以前のプルリクエストに存在しましたが、その後削除されました。

返金コンポーネントは、異なる優先度レベルで考慮できます。

-   **[[glossary/account-creation|アカウント作成]]（`183600` [[glossary/gas|ガス]]）：** 作成者はエフェメラルアカウントを作成する際にこのコストを回避できないため、これが最優先されるべきです。したがって、このコストを返金することは、主要な非効率性に直接対処します。

-   **[[glossary/code-deposit-cost|コードデポジットコスト]]（`L * [[glossary/CPSB|CPSB（ステートバイトあたりのコスト）]]`）：** 作成者は、コールバックの処理や、任意の[[glossary/calldata|コールデータ]]で後から呼び出せる固定コードのインストールなど、より高度な実行パターンを可能にするために、一時的にアカウントにコードをデプロイする場合があります。

-   **ストレージ（スロットあたり`97920` [[glossary/gas|ガス]]）：** ストレージは、エフェメラルアカウントのユースケースにとって明確な経済的利益はありません。しかし、ストレージの返金をサポートすることで、一時的な実行中にストレージを使用する[[glossary/smart-contract|コントラクト]]との互換性が提供されます。[[glossary/Solidity|Solidity]]はトランジェントストレージでマッピングのような高度なデータ型をサポートしていないため、通常のストレージを使用するには実質的に複雑なコードが必要になる場合があります。さらに、一部の[[glossary/EVM-compatible-chains|EVM互換ネットワーク]]は[[glossary/EIP-1153|EIP-1153]]をサポートしていません。

このアプローチの主な欠点は、トランザクション送信者がトランザクション開始時に十分な[[glossary/gas|ガス]]制限を指定し、実行全体を通じて十分な[[glossary/gas|ガス]]が利用可能であることを保証する必要があることです。これにより、そのようなトランザクションをブロックに含めることがより困難になります。

さらに、[[glossary/Monad|Monad]]のような、トランザクションが常に[[glossary/gas|ガス]]制限全体を消費する一部のブロックチェーンでは、返金は実質的な利益を提供しません。

### 作成フレームの終了時のみ課金する

作成フレームに入るときに[[glossary/account-creation|アカウント作成]]コストを課金する代わりに、フレームが終了するまでコストを延期することができます。

アカウントが空のままで、フレームが`STOP`または`RETURN`で終了する場合、[[glossary/account-creation|アカウント作成]]コストが課金されます。

フレームが`REVERT`、`SELFDESTRUCT`、またはその他の例外的な条件で終了する場合、[[glossary/account-creation|アカウント作成]]料金は適用されません。

このアプローチでは、フレームレベルの[[glossary/state-creation-costs|ステート作成コスト]]が計上される時点を変更する必要があります。また、上記で説明したより高度なユースケースはサポートしませんが、過度に大きなトランザクション[[glossary/gas|ガス]]制限を要求することを回避します。

### 同一トランザクション内の`SELFDESTRUCT`で返金する

同じトランザクション内で作成され、その後破壊されたすべてのアカウントは、[[glossary/account-creation|アカウント作成]]コストと[[glossary/code-deposit-cost|コードデポジットコスト]]をカバーすると予想される返金を受け取ります。

ネットワークが[[glossary/EIP-8246|EIP-8246]]を採用し、削除対象としてマークされたアカウントがその後[[glossary/Ether|Ether]]を受け取った場合、以前発行された[[glossary/account-creation|アカウント作成]]の返金は取り消される必要があります。

このアプローチは、関連するステート遷移を追跡するためにより複雑な内部会計を必要としますが、[[glossary/state-diff-principle|ステート差分原則]]により密接に従います。

### ネイティブエフェメラルアカウント

低コストのエフェメラルアカウントを提供する最もクリーンな方法は、[[glossary/TCREATE-opcode|TCREATEオペコード]]のような専用の[[glossary/protocol-primitive|プロトコルプリミティブ]]を導入することです。

これにより、プロトコルはエフェメラルアカウントの会計を直接定義し、既存の[[glossary/account-creation|アカウント作成]]およびアカウント削除操作のセマンティクスを再利用することを避けることができます。

しかし、このような変更には[[glossary/hard-fork|ハードフォーク]]が必要であり、プロトコルに新しい[[glossary/execution-primitive|実行プリミティブ]]を導入することになります。

## さらなる最適化

[[glossary/state-creation-costs|ステート作成コスト]]を最適化した後でも、ステートアクセスコストは依然として重要です。[[glossary/account-creation|アカウント作成]]と破壊には、少なくとも`CREATE_ACCESS`と`SELFDESTRUCT`の基本コストが必要であり、合計で最低17000 [[glossary/gas|ガス]]かかります。

著者は、アカウントが削除されたときに`ACCOUNT_WRITE = 9000`を即座に返金できるようにすることで、`CREATE_ACCESS`の削減を検討することを提案します。

さらに、[[glossary/EIP-150|EIP-150]]以来、[[glossary/denial-of-service-attacks|サービス拒否攻撃 (DoS攻撃)]]を軽減するための`SELFDESTRUCT`の高いコストの元の動機は、もはや適用されません。[[glossary/EIP-6780|EIP-6780]]以降、`SELFDESTRUCT`はもはや同じI/O集約的なステート操作を実行しません。したがって、そのコストを`CALL`の基本コストまで削減することを検討するのは合理的です。

より広範には、`SELFDESTRUCT`はオペコードをより安全にするために意図されたいくつかのセマンティックな制限を受けてきました。著者の視点から見ると、これらの変更はオペコードをより狭い操作へと段階的に縮小させ、各オペコードが単一の明確に定義された機能を提供するという原則に近づけていると見なすことができます。

歴史的に、`SELFDESTRUCT`は[[glossary/account-creation|アカウント削除]]、ステートクリーンアップ、返金、[[glossary/Ether|Ether]]焼却など、いくつかの責任を組み合わせていました。これらの動作のほとんどは現在削除されています。その残された有用な動作は、主に短命な実行中に作成されたステートのクリーンアップです。

`SELFDESTRUCT`を非推奨のオペコードとして扱い続けるのではなく、著者は[[glossary/CLEAR|CLEAR]]のような新しい、より記述的な名前を割り当て、追加機能なしに安定した[[glossary/protocol-primitive|プロトコルプリミティブ]]として開発者に提示することを提案します。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/arguments-for-ephemeral-accounts-and-implementation-approaches/29524)
