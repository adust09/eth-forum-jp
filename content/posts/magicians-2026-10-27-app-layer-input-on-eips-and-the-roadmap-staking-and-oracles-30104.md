---
title: EIPとロードマップに関するアプリケーション層からの意見：ステーキングとオラクル
original_title: 'App-layer input on EIPs and the roadmap: staking and oracles'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/app-layer-input-on-eips-and-the-roadmap-staking-and-oracles/30104
author: CPSTL
date: '2026-10-27'
category: Magicians
tags:
  - magicians
  - research
  - protocol-design
  - eip
  - staking
  - oracle
  - censorship-resistance
  - security
  - roadmap
topic_id: '30104'
translated_at: '2026-10-28'
translator: gemini-2.5-flash
---

> [!note] 原文
> [App-layer input on EIPs and the roadmap: staking and oracles](https://ethereum-magicians.org/t/app-layer-input-on-eips-and-the-roadmap-staking-and-oracles/30104) — CPSTL (2026-10-27)

過去数ヶ月にわたり、私たちはステーキングチームとオラクルチームにインタビューを行い、それらのカテゴリーが[[glossary/Censorship-Resistance|検閲耐性]]、オープンソース、[[glossary/Privacy|プライバシー]]、[[glossary/Security|セキュリティ]]を第一原理 (first principles) としてどのように設計できるかについて調査してきました。私たちは各チームに、ビジネス上の制約 (business constraints) や技術的制限 (technical limitations) なしに最初からやり直せるなら、[[glossary/CROPS-framework|CROPSフレームワーク]]の特性を最大化するために自社のカテゴリーをどのように設計するか、その設計を構築する上で何が妨げになっているか、そしてそこに到達するために最も役立つ単一の変更は何かを尋ねました。以下に挙げられている[[glossary/EIP|EIP（Ethereum 改善提案）]]は、チームが繰り返し直面する制限を取り除くのに役立つと述べた変更点から生まれました。これはコア開発者 (core devs) にも役立つと考え、アプリケーション層のチームが私たちに語った内容をテーマ別にまとめ、それぞれが指し示す[[glossary/EIP|EIP]]とともにここに示します。

全体として、いくつかの[[glossary/EIP|EIP]]は複数のアプリケーションチームから強い支持を得ており、需要が少ないものもありますが、私たちが聞いた最大のニーズにはまだ[[glossary/EIP|EIP]]が全く存在しません。

## いくつかの注意点

これは、小規模で代表的ではないサンプル (non-representative sample) からの需要側の意見であり、[[glossary/EIP|EIP]]のランキングを意図したものではありません。私たちは6つのチーム、主に創設者と主要貢献者と話しました。ステーキングからは[[glossary/Rocket-Pool|Rocket Pool]]、[[glossary/Lido|Lido]]、[[glossary/Obol|Obol]]、オラクルからは[[glossary/Chronicle|Chronicle]]、[[glossary/RedStone|RedStone]]、[[glossary/Chainlink|Chainlink]]です。これは小規模なサンプルですが、各カテゴリーで最大のプロバイダー（2026年6月30日時点で[[glossary/stake|ステーク]]されたETHの約21%を占める[[glossary/Lido|Lido]]、[[glossary/DefiLlama|DefiLlama]]上で現在最大のオラクルプロバイダーであり、2026年10月22日時点で535のプロトコルにわたる借入 (borrows) を含む約545億ドルのTVS (Total Value Secured) を確保している[[glossary/Chainlink|Chainlink]]）と、非常に異なる設計を持つチームが含まれています。

これらのチームが信頼最小化プロトコル変更 (trust-minimizing protocol changes) を求めている場合でも、それらの要望は彼ら自身の設計とビジネスモデル (business models) に沿う傾向があるため、中立的な要望リスト (neutral wishlist) として読むべきではありません。私たちはこれを2つの方法で考慮しようとしました。チームがすでに強力な設計を構築しようとしてプロトコル制限 (protocol limit) にぶつかった場合、例えば何かを構築してから棚上げした場合、私たちはそれを単に[[glossary/EIP|EIP]]を望むと述べるチームよりも強力な証拠とみなし、それが以下の表の「確信度 (Confidence)」列に反映されています。また、競合するチームが同じ結論に達した箇所も探しました。ステーキング要件は歴史的に[[glossary/Consensus-Layer|コンセンサス層]]の議論により直接的な経路を持っており、最大実効残高増加 (max effective balance increases) や統合 (consolidations) のような最近の[[glossary/fork|フォーク]]機能を通じて議論されてきました。そのため、オラクルに関する発見 (oracle findings) は、ここではあまり聞かれない意見である可能性が高いです。これらがロードマップ上の他のすべてとどのように比較されるかは、ACDの判断に委ねられます。これらのインタビューは、クライアント容量 (client capacity)、複雑性 (complexity)、または[[glossary/Security|セキュリティ]]上のトレードオフ (security tradeoffs) に関連する事項には焦点を当てていませんでした。

## 一目でわかる：チームが信頼仮定を減らすのに役立つと述べたテーマとEIP

| テーマ | EIP / ステータス | 提起者 | アプリケーションへの影響 | 確信度 |
| --- | --- | --- | --- | --- |
| [[glossary/Transaction-inclusion|トランザクションインクルージョン]] | [[glossary/FOCIL|FOCIL (EIP-7805)]]、[[glossary/Hegot|ヘゴタ (Hegotá)]]で予定 | [[glossary/Lido|Lido]]、[[glossary/Rocket-Pool|Rocket Pool]]、[[glossary/Chainlink|Chainlink]] | アプリケーションは正直なブロック生成 (honest block production) を強制し、オラクル更新 (oracle updates) が確実に着地することを期待できる | 高 |
| [[glossary/Verifiable-reward-payments|検証可能な報酬支払い]] | [[glossary/ePBS|ePBS (EIP-7732)]]、[[glossary/Glamsterdam|グラムステルダム]]で予定 | [[glossary/Lido|Lido]]、[[glossary/Rocket-Pool|Rocket Pool]]、両者とも部分的と評価 | 可視化された報酬支払いにおける不正行為 (Dishonesty) が検出可能になるが、サイドペイメント (side payments) は検出されない | 中 |
| [[glossary/Proofs-that-survive-forks|フォークに耐える証明]] | EIP-7688（[[glossary/Glamsterdam|グラムステルダム]]で予定）および関連 | [[glossary/Lido|Lido]]が要望。[[glossary/Rocket-Pool|Rocket Pool]]はビーコンステート証明 (beacon-state proofs) に依存 | 証明ベースの設計が[[glossary/fork|フォーク]]ごとに壊れることがなくなる（少なくとも加算的な変更 (additive changes) の場合） | 中、耐久性不確実 |
| [[glossary/Trust-minimized-deposits|信頼最小化されたデポジット]] | EIP-8205、[[glossary/Hegot|ヘゴタ (Hegotá)]]への組み込みを提案 | [[glossary/Lido|Lido]]（8205の作者）と[[glossary/Rocket-Pool|Rocket Pool]] | ガーディアン委員会 (guardian committees) や数ヶ月にわたる回避策 (workarounds) なしでのデポジット | 中 |
| [[glossary/Cheaper-proving-and-verifying|より安価な証明と検証]] | まだ[[glossary/EIP|EIP]]なし | [[glossary/Chronicle|Chronicle]]と[[glossary/Chainlink|Chainlink]]が要望。3つのステーキングチームすべてが証明ベースの設計を構築または棚上げ | 証明が両カテゴリーで委員会 (committees) を置き換える可能性 | 問題は深刻だが、明確な解決策はまだない |
| [[glossary/Permissionless-exits|パーミッションレスなイグジット]] | EIP-7002、[[glossary/Pectra|ペクトラ]]で実装済み | 3つのステーキングチームすべてがこれに基づいて構築 | 誰でもイグジットをトリガーする (trigger an exit) ことができる | 高 |

*確信度は、チームがその変更を必要としていることを証拠がどれだけ示しているかに関するものであり、変更の重要性に関するものではありません。高は、複数の独立したチームがそれを要求し、それが欠けていたために構築または棚上げされた作業があったことを意味し、中は、より少ないチームからの実際の需要があることを意味します。*

## テーマ別の内訳

### トランザクションインクルージョン ([[glossary/FOCIL|FOCIL]]、EIP-7805)：高

[[glossary/FOCIL|FOCIL]]はすでに[[glossary/Hegot|ヘゴタ (Hegotá)]]への組み込みが予定されているため、これはロードマップにすでに反映されているニーズであり、私たちが聞いた単一の[[glossary/EIP|EIP]]の中で、両カテゴリーにわたって最も幅広い支持を得ていました。現在、[[glossary/Layer-1|L1]]ではインクルージョンを強制するものはなく、チームはブロックが正直に構築されたことを証明できないため、除外をペナルティ化できません。[[glossary/Lido|Lido]]の貢献者は、[[glossary/Lido|Lido]]が使用するDAO統治型リレー許可リストを含む、いかなるオペレーターポリシーも「構造的な[[glossary/Censorship-Resistance|検閲耐性]]」を提供しないと指摘し、公正な執行には「タイムリーな可用性と必要なインクルージョンを証明するプロトコルコミットメントが必要である。そのメカニズムはイーサリアムに属する」と述べています。[[glossary/Rocket-Pool|Rocket Pool]]は、オンチェーンで証明可能なものに対してオペレーターのボンドをスラッシュできますが、ブロックが検閲されたことを証明する方法がないため、ここでは使用できず、「[[glossary/Inclusion-List|インクルージョンリスト]]はローカルブロック構築を義務付けるよりも望ましい」と述べています。オラクル側では、[[glossary/Chainlink|Chainlink]]が独自に[[glossary/fork-choice|フォーク選択]]強制型[[glossary/Inclusion-List|インクルージョンリスト]]を挙げました。なぜなら、ビルダーはオラクル更新を「最も重要な瞬間に、つまりビルダーがそれをドロップすることで最も利益を得る瞬間に」ドロップできるからです。

[[glossary/Obol|Obol]]はまた、共謀するアテステーション多数派 (colluding attestation majority) が特定のブロックをアテストすることを拒否した場合、ほとんどコストをかけずに[[glossary/fork-choice|フォーク選択]]に勝利し、「[[glossary/FOCIL|FOCIL]]はこれを防がない」と指摘しました。彼らの見解では、バリデータセットの分散化 (validator set decentralization) がすぐに真剣に受け止められない場合、「[[glossary/stake|ステーク]]の過半数を持つ[[glossary/Ethereum-validator|バリデータ]]は、気に入らない[[glossary/Inclusion-List|IL]]を無視するだけ」であり、イーサリアムはその後、再分散化する (re-decentralize) ことや信頼を取り戻す (regain trust) ことができないかもしれないと述べています。

### 検証可能な報酬支払い ([[glossary/ePBS|ePBS]]、EIP-7732)：中

[[glossary/ePBS|ePBS]]は[[glossary/Glamsterdam|グラムステルダム]]で予定されています。これを提起した両ステーキングチームはそれを望んでいますが、部分的であると見ています。現在、手数料受取人 (fee-recipient) と[[glossary/MEV|MEV（最大抽出可能価値）]]デリバリーは検証できないため、報酬をリダイレクトする (redirect rewards) オペレーターを確実に捕らえることはできません。[[glossary/Lido|Lido]]の貢献者は、[[glossary/ePBS|ePBS]]は価値レッグが担保裏付け (collateral-backed) でプロトコル決済 (protocol-settled) であるのに対し、実行支払いレッグ (execution payment leg) は「プロトコル強制 (protocol enforcement) の外で決済される信頼された約束 (trusted promise)」であり、「プロトコル証拠 (protocol evidence) は未公開のより高い入札 (unpublished higher bid) が存在したことを示すことができない」ため、そこまでしか及ばないと説明しました。[[glossary/Rocket-Pool|Rocket Pool]]は、[[glossary/ePBS|ePBS]]は「トラストレスな検出 (trustless detection) に役立つかもしれないが、その行為を完全に防ぐものではない」と述べています。

### フォークに耐える証明 (EIP-7688および関連)：中、耐久性不確実

ビーコンステート証明 (beacon-state proofs) を検証するコントラクトは、[[glossary/fork|フォーク]]が[[glossary/consensus-state|コンセンサス状態]]フィールドを移動させると壊れる可能性があり、これは[[glossary/fork|フォーク]]ごとに新しい回路 (new circuit) と新しい監査 (audit) を意味する場合があります。[[glossary/Lido|Lido]]は、2026年4月に稼働中のZK会計システムを一時停止しました。このシステムは[[glossary/mainnet|メインネット]]のシャドウモード (shadow mode) で[[glossary/Ethereum-validator|バリデータ]]の残高を証明し、監査 (audit) に合格していましたが、3つの理由で停止しました。[[glossary/0x02-withdrawal-credential-type|0x02バリデータ]]への移行にはチーム全体と会計モデルの書き換え (rewrites their accounting model) が必要だったこと、[[glossary/fork|フォーク]]が[[glossary/consensus-state|コンセンサス状態]]フィールドを移動させ回路を壊し続けること、そして[[glossary/ePBS|ePBS]]の下ではスロットにビーコンブロックがあっても[[glossary/payload|ペイロード]]がない場合があり、EIP-4788が一部のビーコンルートの書き込みを停止するためです。EIP-7688（コンセンサスフィールドの安定したMerkle位置）は、最後の変更の後、フィールド移動部分を修正し、[[glossary/Glamsterdam|グラムステルダム]]で予定されており、すでに[[glossary/Sepolia|Sepolia (テストネット)]]で利用可能です。[[glossary/Lido|Lido]]の貢献者がまだ必要としているのは、[[glossary/ePBS|ePBS]]の下でのオンチェーンでのギャップのないビーコンルート (gap-free beacon roots) と永続的なルート履歴 (durable root history) です（[[research post](https://research.lido.fi/t/9534)]）。[[glossary/Rocket-Pool|Rocket Pool]]のSaturn 2設計もビーコンステート証明 (beacon-state proofs) に依存しています。

[[glossary/Consensus-Layer|コンセンサス層]]の研究者は、EIP-7688は加算的な変更 (additive changes) をカバーするが、デカップルドコンセンサス (decoupled consensus) はビーコン[[glossary/consensus-state|状態]]の大部分を書き換え、今後数年間は「[[glossary/Invariant|不変条件]]についていかなる約束もすることは難しいだろう」と指摘しました。

### 信頼最小化されたデポジット (EIP-8205)：中

先着順 (first-deposit-wins) の下では、鍵保持者 (key holder) は資金提供者 (funder’s deposit) のデポジットを自身の[[glossary/withdrawal-credential|出金資格情報]]で[[glossary/Nonce-front-running|フロントラン]]することができます。チームは現在、[[glossary/Lido|Lido]]ではガーディアン委員会 (guardian committees) を、[[glossary/Rocket-Pool|Rocket Pool]]では事前デポジット (predeposit) と[[glossary/Ethereum-validator|バリデータ]]ごとの[[glossary/validator|バリデータ]]証明 (validator proof) でこれに対処しています。[[glossary/Rocket-Pool|Rocket Pool]]は、現在のフローが「非常に非効率 (inefficient)」であり、大規模なキュー (large queue) の下ではデポジットが「数ヶ月」に及ぶ可能性があるため、独自にEIP-8205を要求しました。[[glossary/Lido|Lido]]の貢献者はEIP-8205を作成したため、彼らの支持は作者としての支持であり、[[glossary/Obol|Obol]]はこれを提起しませんでした。既知の悪用事例はないため、このケースはインシデントではなくコストと複雑性に関するものです。

EIP-8205はまだ[[glossary/Hegot|ヘゴタ (Hegotá)]]への組み込みが提案されています。これとは別に、EFプロトコルクラスターは、公開された[[glossary/Hegot|ヘゴタ (Hegotá)]]ティアリストでこれをDFI (Declined For Inclusion) と評価し、主に大規模なステーキング操作に役立つものであり、必要性の基準 (necessity bar) を満たさないと主張しました。私たちがインタビューしたチーム以外では、この[[glossary/EIP|EIP]]は[[glossary/ether-fi|ether fi]]、[[glossary/Kelp|Kelp]]、FP Validated、独立監査人、および[[glossary/L2Beat|L2Beat]]からの公的な支持をリストしています（公的な[[supporters](https://eip8205.com/#supporters)]のリストを参照）。

分散型設計が同じコストを伴うという証拠があれば、それが変わる可能性があります。パーミッションレスなオペレーターセット (permissionless operator set) を運営する[[glossary/Rocket-Pool|Rocket Pool]]は、そうであると述べているため、さらなるデータを取得するために、より多くのステーキングチームに聞き取りを続けます。

### より安価な証明と検証（まだEIPなし）：問題は深刻だが、明確な解決策はまだない

これは私たちが聞いた最大のニーズであり、どのチームも特定の[[glossary/EIP|EIP]]を指摘しませんでした。証明ベースの設計は、委員会ベースのバージョンよりも数倍のコストがかかりますが、各チームで異なる理由があります。

-   **[[glossary/Chronicle|Chronicle]]**: 検証ガス（証明ベースの更新は約360kガスかかるのに対し、現在のフィードでは69kから126k）。
-   **[[glossary/Rocket-Pool|Rocket Pool]]**: 証明と証人のコスト（ZK証明 (ZK proving) はオペレーターが「ネイティブに実行するには重すぎた」）。
-   **[[glossary/Lido|Lido]]**: [[glossary/fork|フォーク]]をまたいで回路を機能させ続けることなど。
-   **[[glossary/Obol|Obol]]**: オンチェーンで検証するのではなく、証明を多用する設計を構築するコスト自体と、需要の低さ。[[glossary/Obol|Obol]]は、クラスターが信頼できないオペレーターで実行できる報酬と罰則のゲームを研究しましたが、オペレーターは信頼できる人とクラスターを運営することを好み、[[glossary/Zero-Knowledge-Proof|ZK証明]]とVDF (Verifiable Delay Functions) を使用して適切に構築するには数百万ドルかかると結論付けました。「それはすべて高価な作業であり、市場需要 (market demand) がない」と述べています。

[[glossary/Chainlink|Chainlink]]も「安価な検証」を要望の一つに挙げており、[[glossary/RedStone|RedStone]]は[[glossary/zk|ZK]]を[[glossary/Privacy|プライバシー]]ツール (privacy tool) と見なしているため、需要はオラクルカテゴリー全体ではなく、証明を必要とする設計から来ています。具体的な要望の一つとして、EF公認の検証プリコンパイル (EF-blessed verify precompile) が挙がりましたが、私たちが話したプロトコル研究者からは[[glossary/zkEVM|zkEVM (ゼロ知識イーサリアム仮想マシン)]]の方向性に反すると見なされました。代わりに、彼らはハッシュベース証明 (hash-based proving) を指摘し、当面は[[glossary/proof-aggregation|証明集約]]がギャップを埋め、[[glossary/EVM|EVM]]自体が証明可能になればネイティブ検証 (native verification) が可能になると述べました。プロトコルは[[glossary/Post-Quantum|ポスト量子]]署名集約と[[glossary/zkEVM|zkEVM]]のためにこの証明インフラ (proving infrastructure) をいずれにせよ構築しているため、アプリケーション層の証明が同じインフラを使用できるかどうかが未解決の疑問です。

私たちが検討している一つの示唆は、アプリケーション層の証明にも同様のステージングパス (staging path) が必要かどうかです。プロトコル研究者は、イーサリアムはすでに証明に依存する前にステージングを行っており、オプションの実行証明 (optional execution proofs) がまず再実行 (re-execution) と並行して実行され、これは[[glossary/Beacon-Chain|ビーコンチェーン]]が[[glossary/Merge|マージ]]前に実行されていたのとよく似ていると指摘しました。集約は、ネイティブ検証がデフォルトになる前に、アプリケーションチームが証明ベースの設計をプロダクション (production) で実行するための同様の方法を提供する可能性があります。特に、いくつかのチームがプロダクションに到達する前に設計を棚上げまたは一時停止したことを考えると、これは重要です。

### パーミッションレスなイグジット (EIP-7002、[[glossary/Pectra|ペクトラ]]で実装済み)

EIP-7002は、変更が実装された後にアプリケーション層で何が起こるかを示しています。[[glossary/Rocket-Pool|Rocket Pool]]の最終状態設計では、協力期間 (cooperative window) の後、誰でもイグジットをトリガーする (trigger an exit) ことができます。[[glossary/Lido|Lido]]のイグジットは決定論的なイグジット順序アルゴリズム (deterministic exit-order algorithm) に従い、オラクル委員会 (oracle committee) が結果を報告するだけで、誰でも`triggerExits()`を通じてイグジットを強制できます。そして[[glossary/Obol|Obol]]は、[[glossary/0x00-validator|0x00バリデータ]]互換のクレデンシャル (7002-compatible credentials) を使用すれば、オペレーターが誰も生きていない状態でも、立ち往生したクラスターの元本 (stranded cluster’s principal) を救出できることを確認しました。

## 単一チームからのシグナル

これらはそれぞれ1つのチームからのみ提起されたため、まだ結論は出していません。

-   **ネイティブ[[glossary/Ethereum-validator|バリデータ]]キーローテーション ([[glossary/Lido|Lido]])。** [[glossary/Lido|Lido]]は、自身のオラクル向けにアプリケーション層でキーローテーション (key rotation) を解決しました（[[LIP-37](https://research.lido.fi/t/lip-37-execution-delegation-framework-edf/11746)]）。しかし、[[glossary/Ethereum-validator|バリデータ]]の[[glossary/BLS-keys|BLS鍵]]は、[[glossary/stake|ステーク]]をイグジットして再入しないとローテーションできないため、侵害されたキー (compromised key) がより長く露出したままになります。[[glossary/Lido|Lido]]の貢献者は、摩擦や新しい依存関係なしにアプリケーション層でこれを行うことはできず、インフラハック (infrastructure hacks) が増加するにつれて、[[glossary/Kiln|Kiln]]や、最近では[[glossary/Consensys|Consensys]]でのインシデントを指摘し、より緊急性が高まっていると述べています。
-   **イグジット流動性価格設定 ([[glossary/Obol|Obol]])。** パニック時に数ヶ月に及ぶイグジットキュー (exit queue) に閉じ込められるリスクは、[[glossary/bank-run|取り付け騒ぎ]]の際に最初に抜け出すのが合理的であるため、常に[[glossary/stake|ステーク]]を仲介業者に押し付けます。[[glossary/Obol|Obol]]は、これを現在チェーン上で最も中央集権化を促進する力であり、非カストディアルウォレット (non-custodial wallet) にネイティブ[[glossary/stake|ステーク]]する人が少ない理由であり、代わりにカストディアン (custodian) や[[glossary/Liquid-Staking|リキッドステーキングトークン (LST)]]を通じてステーキングを行う理由であると見ています。バーン・トゥ・イグジット (burn-to-exit) のドラフトは存在しますが、まだ推進もレビューもされていません。
-   **相関ダウンタイムペナルティ ([[glossary/Obol|Obol]]、EIP-7716)。** 多くの[[glossary/Ethereum-validator|バリデータ]]が同時にオフラインになった場合に、より多くのペナルティを課すことで、大規模なオペレーターは、ネットワークの大部分を単一のスタックで実行するのではなく、マイノリティクライアント (minority clients) やより弾力的なセットアップ (resilient setups) に向かうでしょう。[[glossary/Obol|Obol]]はこれを分散化策 (decentralization measure) として提唱しています。EFプロトコルティアリストはこれをDFIと評価し、良いアイデアだがこの[[glossary/fork|フォーク]]の優先事項ではないとし、ステーカー (stakers) やエッジケース (edge cases) への影響についてさらなる研究を求めています。
-   **[[glossary/0x02-withdrawal-credential-type|0x02バリデータ]]向けのカスタムスイープ閾値 ([[glossary/Rocket-Pool|Rocket Pool]]、EIP-8148)。** [[glossary/Rocket-Pool|Rocket Pool]]は、設計で[[glossary/0x02-withdrawal-credential-type|0x02バリデータ]]を有効にするために、EIP-8205と並行してEIP-8148を要求しました。
-   **クレデンシャル強制手数料受取人 ([[glossary/Rocket-Pool|Rocket Pool]])。** 「[[glossary/withdrawal-credential|出金資格情報]]が直接手数料受取人 (fee-recipient) を強制できれば、これらのオラクルは不要になるでしょう。」
-   **ボラティリティ下の[[glossary/Blockspace-Demand|ブロック空間]] ([[glossary/Chainlink|Chainlink]])。** 2025年10月10日のボラティリティイベント中、1時間あたり3,250回のフィード更新があり、それぞれ約132ドルで、清算 (liquidations) やイグジットと競合しました。
-   **[[glossary/Privacy|プライバシー]] ([[glossary/Lido|Lido]]貢献者)。** 資本[[glossary/Privacy|プライバシー]]には「イーサリアムのシールドプール標準 (shielded-pool standard)」が必要であり、オペレーター[[glossary/Privacy|プライバシー]]は上流にある。なぜなら「ステーキングコントラクト (staking contract) はイーサリアム[[glossary/Consensus-Layer|コンセンサス層]]が公開するデータを隠すことはできない」からです。

## 次のステップ

私たちは、他の主要なアプリケーション層カテゴリー（[[glossary/wallet|ウォレット]]、オン/オフランプ (on/off ramps)、[[glossary/bridges|ブリッジ]]、支払い (payments) など）のチームと同様の対話を開始しており、ACD議論であまり代表されていないグループに重点を置いています。もし[[glossary/EIP|EIP]]に関する有用なシグナルが得られれば、それも共有します。アプリケーションチームに所属していて、[[glossary/Layer-1|L1]]に何を求めているかを共有したい場合は、ご連絡ください。より多くのカテゴリーをカバーすることで、繰り返し現れるテーマ (recurring theme) を単一チームの要望リスト (wish list) と区別しやすくなります。[[glossary/EIP|EIP]]を決定する前にアプリケーション側から回答してほしい質問があれば、例えばチームが実際に何かを使用するか、それがなければ何が壊れるかなど、私たちに送ってください。それも盛り込みます！

反論 (pushback) も大歓迎です。特に、アプリケーション層の問題を間違った[[glossary/EIP|EIP]]に結びつけている箇所があれば、ぜひご意見をお寄せください。このスレッドに返信するか、[charles@ethereum.org](mailto:charles@ethereum.org)にメールするか、X（旧Twitter）の[@CharlieStLouis](https://x.com/CharlieStLouis)までご連絡ください。

/fin

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/app-layer-input-on-eips-and-the-roadmap-staking-and-oracles/30104)
