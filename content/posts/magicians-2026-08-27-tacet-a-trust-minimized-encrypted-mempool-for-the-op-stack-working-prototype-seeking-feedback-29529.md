---
title: 'Tacet: OP Stack向けトラストレス暗号化メムプール（動作プロトタイプ、フィードバック募集中）'
original_title: >-
  Tacet: a trust-minimized encrypted mempool for the OP Stack (working
  prototype, seeking feedback)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/tacet-a-trust-minimized-encrypted-mempool-for-the-op-stack-working-prototype-seeking-feedback/29529
author: mythran
date: '2026-08-27'
category: Primordial Soup
tags:
  - primordial-soup
  - mempool
  - privacy
  - security
  - rollup
  - layer2
  - cryptography
  - protocol-design
  - economics
  - eip
topic_id: '29529'
translated_at: '2026-08-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Tacet: a trust-minimized encrypted mempool for the OP Stack (working prototype, seeking feedback)](https://ethereum-magicians.org/t/tacet-a-trust-minimized-encrypted-mempool-for-the-op-stack-working-prototype-seeking-feedback/29529) — mythran (2026-08-27)

Tacetは、[[glossary/EVM|EVM]]ネイティブな[[glossary/Encrypted-Mempool|暗号化メムプール]]で、[[glossary/OP-Stack|OP Stack]]向けに開発されています。（名前は音楽用語の「タセット (tacet)」に由来します。楽譜には声部が存在するものの、合図があるまで沈黙を保つ、という意味です。これは、コミットされたブロック内で暗号化されたトランザクションがまさにそうであることに対応しています。）トランザクションは[[glossary/sequencer|シーケンサー]]に到達する前に[[glossary/Threshold-Encryption|閾値暗号化]]されます。順序付けは、誰も（[[glossary/sequencer|シーケンサー]]自身も含む）トランザクションを読み取ることができないうちにコミットされ、ブロックが確定した後にのみ、t-of-nキーパー (keyper) が復号シェアをリリースします（[[glossary/decrypt-then-execute|復号後実行 (decrypt-then-execute)]]）。これにより、[[glossary/sequencer|シーケンサー]]以外の誰もコンテンツベースのフロントランニングを行うことができなくなり、[[glossary/sequencer|シーケンサー]]自身もコミットメントを尊重する限り、それを実行できなくなります。順序が確定するまで誰もトランザクションを読み取ることができず、キーがリリースされると、コミットされたバッチは次のブロックの先頭で実行されます。**これは[[glossary/Trusted-Execution-Environment|トラステッド実行環境 (TEE)]]のような信頼できるハードウェアや、パーミッション付きバリデータセットを必要としません**。これが、現在稼働している[[glossary/Trusted-Execution-Environment|TEE]]ベースの[[glossary/Block-Building|ブロック構築]]者と、まだ数年先とされている[[glossary/Enshrinement|プロトコルへの組み込み]]型[[glossary/Layer-1|L1]][[glossary/Encrypted-Mempool|暗号化メムプール]]トラック（[[glossary/EIP|EIP]]-8105 / [[glossary/LUCID|EIP-8184 “LUCID”]]）との間のギャップです。（残りのケース、すなわちキーリリース時のネットワーク遅延競争、バックランニング、および順序付けコミットメントが[[glossary/sequencer|シーケンサー]]のローカル状態であるというフェーズ0の事実は、以下に記載されています。）このアプリケーションが最初に目指すのは、小口[[glossary/MEV|MEV（最大抽出可能価値）]]保護ではなく、規制されたオーダーフローです。機関にとって、実行前の機密性は、プライベートチェーンではなくパブリックチェーンを介してクライアントの注文をルーティングするための前提条件であり、識別され説明責任を負うキーパー (keyper) の委員会が妥協ではなく自然に適合する設定です。メカニズム自体は汎用的であり、特定の用途に限定されるものではありません。

暗号学的コアは動作しており、現在再現可能です。キーパー (keyper) 委員会はlibp2p上でDKG（分散鍵生成）を実行し、パイプラインの復号側（閾値シェア集約、エポックキー検証、およびコミットされたバッチに変換されたシールドエポック）はエンドツーエンドで実行されます。[[glossary/EVM|EVM]]に対する実行は、スタンドアロンのキーパー (keyper) ではなく、op-gethフォークの担当です。op-gethの統合 — ネイティブな暗号化トランザクションタイプ、暗号化サブプール、キーが存在する前に順序付けをコミットする[[glossary/sequencer|シーケンサー]]、キーパー (keyper) から[[glossary/sequencer|シーケンサー]]への検証済みエポックキーの直接配信、復号パイプライン、およびキーが到着した後に構築される最初のブロックでエポックを実行するブロックトップマイナーフック — は実装され、ユニットテストされ、ノード起動に組み込まれています。残りの作業は、スタンドアロンのキーパー (keyper) プロトタイプをカノニカルなワイヤーフォーマットに収束させ、[[glossary/devnet|開発ネットワーク (devnet)]]を立ち上げることです。これはフェーズ0のプロトタイプであり、監査はされていません。このコミュニティからのフィードバック、特にキーパー (keyper) 委員会と、これが[[glossary/Enshrinement|プロトコルへの組み込み]]トラック（[[glossary/EIP|EIP]]-8105 / [[glossary/LUCID|LUCID]]）およびShutterized [[glossary/OP-Stack|OP Stack]]とどのように関連すべきかについて、ご意見を伺いたいです。

## 動機

[[glossary/MEV|MEV]]はこれまで、ユーザーから数十億ドルを抽出してきました。特に、最近の[[glossary/Layer-1|L1]]サンドイッチングの減少は、主にフローが*信頼された*プライベートチャネルに移行していることを反映しています（EigenPhiは、[[glossary/Layer-1|L1]]サンドイッチングの収益が2025年10月までに2024年後半の約4分の1になると予測しており、arXiv 2512.17602はプライベートチャネル*内*でのサンドイッチングを文書化しています）。これは、信頼の問題を解決するのではなく、再配置しているに過ぎません。現在稼働している[[glossary/EVM|EVM]]向けの緩和策は、**[[glossary/Trusted-Execution-Environment|TEE]]ベース**（Flashbotsロールアップブーストを介したUnichain — ハードウェアの信頼。BaseはFlashblocksに同じビルダー（builder）スタックを使用）か、**プロトコル外リレー**（暗号学的保証なし）のいずれかです。[[glossary/Encrypted-Mempool|閾値暗号化メムプール]]は存在しますが（Gnosis上のShutter、トランザクションごとのIBE、2024年から稼働中。Aptos、バッチ閾値暗号化、AIP-144が承認され、2026年8月現在[[glossary/mainnet|メインネット]]展開待ち）、プロトコルネイティブな[[glossary/EVM|EVM]]実装としては存在しません。Shutter自身の[[glossary/OP-Stack|OP Stack]]バリアント（SHOP、Sepolia [[glossary/testnet|テストネット]]）は、クライアントレベルの[[glossary/Mempool|メムプール]]変更を意図的に避けています。[[glossary/ciphertext|暗号文]]は通常のトランザクションとしてインボックスコントラクトに到達し、キーのゴシップとブロックトップの強制のためにフォークされたop-node/op-gethのみを使用します。欠けているのは、[[glossary/Enshrinement|プロトコルへの組み込み]][[glossary/EIP|EIP]]が[[glossary/Layer-1|L1]]に提案する形式 — ネイティブトランザクションタイプ、プール処理、プロトコル内[[glossary/decrypt-then-execute|復号後実行]] — のオープンでトラストレスなリファレンスであり、[[glossary/OP-Stack|OP Stack]][[glossary/Rollup|ロールアップ]]が研究できるものです。この分野に関する最近のFlashbotsの体系化（eprint 2026/1643、AFT 2026）も同じスキームの系統をたどり、いずれも名前を挙げていません。彼らのフレーミングでは、「Shutterized Gnosis Chainが本番のベースラインを確立し、[[glossary/EIP|EIP]]-8105と[[glossary/LUCID|LUCID]]が最も先進的なプロトコル内提案である」とされています。Tacetはまさにそれを目指しています。

**義務としての機密性、嗜好としての機密性ではない。** 規制対象の参加者にとって、エクスポージャーは経済的なものだけではありません。クライアントの注文を[[glossary/Mempool|パブリックメムプール]]を介してルーティングする機関は、その注文 — サイズ、方向、そして多くの場合、相手方を推測するのに十分な情報 — を実行前に全員に開示することになり、これは最良執行義務やクライアント機密保持義務と相容れません。これは仮説ではありません。ドイツのeWpGのような国家フレームワークの下で、規制対象の証券は既にパブリックチェーン上で発行・決済されており、そこではオーダーフローが構造的に完全に可視化されています。現在利用可能な救済策は、上記で説明した信頼の再配置と同じく、信頼されたプライベートチャネルです。範囲を正確に言うと、[[glossary/Encrypted-Mempool|暗号化メムプール]]はトランザクションが組み込まれるまで保護し、エポックキーがリリースされると、そのトランザクションは他のどのトランザクションとも同じくらい公開されます。永続的な状態機密性は、別の後続の問題（フェーズ2以降）です。この設計が取り除くのは、実行前の開示です。これこそが、これらの義務が実際に依拠する部分です。

一方、[[glossary/Layer-1|L1]]では、[[glossary/Enshrinement|プロトコルへの組み込み]]の取り組みが収束しています。[[glossary/EIP|EIP]]-8105チームは2026年2月に[[glossary/LUCID|EIP-8184 (“LUCID”)]]を承認し、Encrypt-the-Mempool連合は現在[[glossary/LUCID|LUCID]]を主要な設計として推進しています。しかし、これは構造的に[[glossary/Layer-1|L1]]メカニズムであり、[[glossary/FOCIL|FOCIL (EIP-7805)]]を必要とする[[glossary/EIP|コアEIP]]です。そして[[glossary/FOCIL|FOCIL]]自体も[[glossary/Hegota|ヘゴタ]]向けにのみ予定されており、その[[glossary/EIP|メタEIP]]（8081）はまだドラフトであり、[[glossary/LUCID|LUCID]]は予定も検討もされていません。[[glossary/Enshrinement|プロトコルへの組み込み]]は、早くてもそれ以降の[[glossary/fork|フォーク]]です。その根拠は[[glossary/Layer-2|L2]]についても議論していますが、それは範囲の逆を主張するためです。「[[glossary/Layer-2|L2]]の条件は[[glossary/LUCID|LUCID]]には当てはまらない」なぜなら、「ほとんどの[[glossary/Layer-2|L2]]設計では、IIBに匹敵するブロックレベルのクリアリングステップがない」からです。[[glossary/Rollup|ロールアップ]]にはそのクリアリングステップも[[glossary/FOCIL|FOCIL]]もありません。これこそが、[[glossary/Layer-2|L2]]上の[[glossary/MEV|シーケンサーMEV]]が[[glossary/Enshrinement|プロトコルへの組み込み]]トラックで対処されない理由です。この作業がターゲットとするのはこのギャップであり、[[glossary/EIP|EIP]]が[[glossary/Layer-1|L1]]に提案する精神と意図的に類似したアーキテクチャ、すなわちアプリケーション層の回避策ではなく、プロトコル内で処理されるネイティブな暗号化トランザクションタイプを採用しています。

## 設計

-   **[[glossary/Threshold-Encryption|閾値暗号]]。** BLS12-381上のBoneh-Franklin IBEを使用し、Gnosis Chainデプロイメント（shcrypto/puredkg）を実行するShutterライブラリを安定した`CryptoProvider`インターフェースの背後で使用します。キーパー (keyper) 委員会は、告発/謝罪ラウンド（Shutterのpuredkg）を含むFeldman-VSS DKGを実行して、共有のイーオン公開鍵を生成します。ユーザーは（イーオン鍵、エポック識別子）に対して暗号化します。
-   **[[glossary/sequencer|シーケンサー]]前暗号化。** トランザクションの実際のペイロード（通常の署名済み[[glossary/EIP-1559|EIP-1559]] / レガシートランザクション）は暗号化されます。[[glossary/Mempool|メムプール]]では、クリアテキスト会計フィールド（チェーンID、[[glossary/nonce|ナンス]]、ガス、手数料、送信者）、ターゲット（イーオン、エポック）、および[[glossary/ciphertext|暗号文]]のみが可視であり、[[glossary/sequencer|シーケンサー]]は内容を読み取ることなく順序付けと[[glossary/nonce|ナンス]]/残高会計を行うことができます。これは、送信者、ガス、およびタイミングのメタデータがフェーズ0で可視のままであることを意味します（会計フィールドは復号前のスパム対策と手数料会計に必要であり、エポックはプールがそれによってグループ化する必要があるためです）。コンテンツは隠されますが、トランザクションのシルエット（誰が、おおよそどのガス分類で、どのブロックをターゲットにしているか）は依然として漏洩するため、情報を持った観察者は無料ではなく有料の投機的な賭けをすることができます。このメタデータチャネル（ガスバケット、リレー/メタトランザクション、k-匿名性のためのバッチ処理、またはGhostPoolスタイルのZKアドミッションプルーフ）を閉じることは、フェーズ2以降の明示的な作業であり、フェーズ0ではありません。
-   **復号前順序コミット。** [[glossary/sequencer|シーケンサー]]は、トランザクションがまだ[[glossary/ciphertext|暗号文]]である間に、トランザクションの順序（暗号化サブプールからのFIFO（先入れ先出し））を固定します。その後初めて、エポック復号鍵が参照されます。閾値に達すると、キーパー (keyper) は鍵を結合し、イーオン公開鍵に対して検証し（すべてのノードが実行できるチェック）、それを直接[[glossary/sequencer|シーケンサー]]に渡します。オンチェーンの`EpochRegistry`が意図された公開記録および第二のソースであり、[[glossary/sequencer|シーケンサー]]は、どのように到着したかにかかわらず、作用するすべての鍵に対して検証を繰り返すため、偽造された鍵は使用されずに無視されます。そのレジストリへの書き込みには、同じ鍵に対する閾値数のキーパー (keyper) [[glossary/Attestation|アテステーション]]が必要であるため、単一のパーティがエポックのスロットを占有し、それによって永久に焼却することはできません。フェーズ0の注意点：現時点では読み取り側のみが存在します。[[glossary/sequencer|シーケンサー]]はレジストリを読み取り検証しますが、キーパー (keyper) プロトタイプはまだそれに書き込んでいないため、現在では直接配信が唯一のパスです。
-   **[[glossary/decrypt-then-execute|復号後実行]]。** 検証された鍵を使用して、コミットされたバッチは固定された順序で復号され、標準[[glossary/EVM|EVM]]に供給されます。復号不能なトランザクション（誤った鍵）は破棄されます。コミットされた順序は実行まで引き継がれます。
-   **段階的な粒度。** ブロックごとのIBE（フェーズ0、最も単純）→トランザクションごとのIBE（フェーズ1、USENIX Security 2024で形式化されたブロックごとのペンディングトランザクションプライバシーギャップを解消）→バッチ閾値暗号化（フェーズ2）。安定した`CryptoProvider`インターフェースにより、各ステップはプロバイダーの交換であり、書き換えではありません。特筆すべきトレードオフの1つ：単一のブロックごとのエポックキーでは、委員会は常に全か無かでしか復号できません。個々のトランザクションを選択的に復号したり検閲したりすることはできません。トランザクションごとの粒度は、その特性とペンディングトランザクションプライバシーをトレードオフします。

## セキュリティ特性

| 保証                                     | メカニズム
