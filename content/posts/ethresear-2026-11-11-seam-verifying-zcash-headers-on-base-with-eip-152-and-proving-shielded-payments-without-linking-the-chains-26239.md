---
title: 'Seam: EIP-152を用いてBase上でZcashヘッダーを検証し、チェーンをリンクせずにシールドされた支払いを証明する'
original_title: >-
  Seam: verifying Zcash headers on Base with EIP-152, and proving shielded
  payments without linking the chains
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/seam-verifying-zcash-headers-on-base-with-eip-152-and-proving-shielded-payments-without-linking-the-chains/26239
author: Himess
date: '2026-11-11'
category: Privacy
tags:
  - privacy
  - zk
  - cryptography
  - scaling
  - applications
  - interoperability
  - proof-of-work
  - eip
  - zcash
  - light-client
topic_id: '26239'
translated_at: '2026-11-13'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Seam: verifying Zcash headers on Base with EIP-152, and proving shielded payments without linking the chains](https://ethresear.ch/t/seam-verifying-zcash-headers-on-base-with-eip-152-and-proving-shielded-payments-without-linking-the-chains/26239) — Himess (2026-11-11)

## TL;DR

-   Base上のコントラクトは、Zcashの各ブロックヘッダーをZcashのコンセンサスルールに対してチェックします。具体的には、[[glossary/EIP-152|EIP-152]] BLAKE2bプリコンパイル上のEquihash (200, 9) ソリューション、難易度調整（NU7の25秒ブロックを含む）、時間ルール、累積作業量などです。これにより、コントラクトはブリッジ、委員会、またはリレーする者を信頼することなく、Zcashのベストチェーンを読み取ることができます。誰でもデータを供給できます。フィーダーはリレーを遅延させることはできますが、Zcashのルールが拒否するヘッダーを受け入れさせることはできません。
-   1つのヘッダーのコストは、トランザクション全体で平均約626kガスです。そのうちEquihashが361kを占めます。Zcashの25秒ブロックに追従する場合、1日あたり約3,456ヘッダー、約2.2 × 10⁹ガスとなり、Baseの0.005 gweiで1日あたり約0.01 ETHです。
-   2026年10月29日に[[glossary/mainnet|メインネット]]パラメータでデプロイされたリレーは、Zcash [[glossary/mainnet|メインネット]]のNU7アクティベーション（高さ3,543,405、2026年11月6日）を再デプロイなしで通過し、その後5,405ヘッダーに追従しました。
-   このリレーの上に、RISC Zero証明（[[glossary/Groth16-proof|Groth16証明]]でラップされ、Base上で検証に256,720ガス）があります。これは、アプリがコミットした受信者に対して、アプリのリファレンス名を記したメモ付きで、少なくともある金額のシールド支払いが、リレーが保持するヘッダーのZIP 221チェーン履歴内にあったことを証明します。トランザクションID、ノート、ブロック、アドレスは[[glossary/EVM|EVMチェーン]]には決して到達しません。実際の[[glossary/testnet|テストネット]]支払いは、レンタルしたRTX 4090で81秒で証明され、費用は約1セントでした。
-   [[glossary/testnet|テストネット]]のみ、監査はされていません。コード（MIT）、実際のヘッダーテストコーパス、およびすべての数値のソースはこちらです: [GitHub - Himess/seam: A Zcash light client for EVM chains: Base checks Zcash headers itself (Equihash, difficulty, most work), and ZK proofs of shielded payments against them. · GitHub](https://github.com/Himess/seam)

## 1\. なぜ

現在、[[glossary/EVM|EVMアプリケーション]]でZECを使用するということは、Zcashで何が起こったかを証明する誰か、例えばブリッジ委員会、マルチシグ、またはカストディアンを信頼することを意味します。これに代わる方法は古くからあります。BTC Relayは2016年にビットコインのSPVクライアントをイーサリアム上に置き、コントラクトが人ではなく[[glossary/proof-of-work|プルーフ・オブ・ワーク]]を信頼できるようにしました。Zcashの場合、これはEquihashによって妨げられていました。1つのソリューションを検証するには512回のBLAKE2bハッシュが必要で、プレーンな[[glossary/Solidity|Solidity]]では法外なコストでした。これが、Istanbul (2019) で追加されたBLAKE2b圧縮プリコンパイルである[[glossary/EIP-152|EIP-152]]の動機であり、BTC RelayスタイルのZcash SPVクライアントをイーサリアム上に構築することを目指していました。

現在、2つの要因がこれを実用的にしています。[[glossary/Layer-2|L2]]により、ヘッダーごとの検証コストがすべてのブロックに追従できるほど安価になりました（§4）。そして、[[glossary/zkVM|zkVM（Zero-Knowledge Virtual Machine）]]により、ブロックの内容に関する事実を公開することなく証明することが可能になりました。これは他のどのチェーンよりもZcashにとって重要です。[[glossary/EVM|EVMアカウント]]から提出されたシールド支払いのトランザクションID (txid) の[[glossary/Merkle-proof|マークル証明]]は、両者をリンクさせ、支払者が対価を払ったプライバシーを無効にしてしまいます。

## 2\. リレー

### 2.1 すべてのヘッダーが通過しなければならないもの

ルールはZebra (v7.0.0-rc.0) とZIPに従っており、各ルールはコード内でそのソースを引用しています。

1.  **フォーマットとリンケージ。** 1,487バイト（140バイトのプレフィックス、compactSize(1344)、ソリューション）、バージョン ≥ 4、既知の親、まだ既知でないこと。
2.  **時間。** 過去11ブロックの中央値よりも後であること。その中央値から最大90分以内であること。Baseの`block.timestamp`より最大2時間先行しないこと（Zebraのローカルクロックルールで、[[glossary/Layer-2|L2]]のクロックがノードのクロックの代わりとなる）。
3.  **難易度。** `nBits`は調整が必要とするものと等しくなければなりません。平均化ウィンドウ (averaging window) における平均ターゲット、ダンピングファクター (damping factor) 4、+16% / −32%の範囲、11タイムスタンプの中央値、[[glossary/proof-of-work|PoW制限]]でキャップされます。ウィンドウはNU7以前は75秒で17ブロック、NU7以降は25秒で102ブロック（ZIP 218、ZIP 259）であり、デプロイ時に固定された高さで切り替わります。[[glossary/testnet|テストネット]]の最小難易度ルール（親ブロックから450秒以上経過したブロックは`0x2007ffff`を保持しなければならない）はパラメータであり、[[glossary/mainnet|メインネット]]ネットワークIDでは拒否されます。
4.  **Equihash (200, 9)。** librustzcashの検証者 (librustzcash’s verifier) に従います。`ZcashPoW`パーソナライゼーション (ZcashPoW personalization) 付きBLAKE2b-400、512個の21ビットインデックス、9つの各レベルで20ビットの衝突、順序付け、異なるインデックス、ゼロルート。最初の128バイトのBLAKE2bブロックは一度圧縮されます。その後、各インデックスはプリコンパイル（0x09）上で1回の最終ブロック圧縮のコストがかかります。
5.  **[[glossary/proof-of-work|プルーフ・オブ・ワーク]]。** ヘッダーのSHA-256dをリトルエンディアン (little-endian) で読み取り、ターゲット (target) 以下であること。
6.  **[[glossary/fork-choice|フォーク選択]]。** ブロックがチップとなるのは、厳密に多くの累積作業量 (cumulative work) を持つ場合のみです。ここで、\\text{work} = 2^{256} / (\\text{target} + 1) であり、同点の場合は最初に見られたブロックが維持されます。任意の深さの[[glossary/reorg|リオーグ（再編成）]]が追従されます（Zebra自体は1,000ブロック以下の[[glossary/reorg|リオーグ（再編成）]]を拒否します）。

チェックされないもの: ブロックの内容。`hashMerkleRoot`と`hashBlockCommitments`は[[glossary/proof-of-work|プルーフ・オブ・ワーク]]がそれらにコミットするように保存されます。ブロックに含まれるものに関する事実は、インクルージョン証明 (inclusion proof) を必要とします（§5）。

### 2.2 フィーディング、リオーグ、フィーダーができること

`submitHeaders`はパーミッションレスであり、リレーがすでに持っているヘッダーはスキップされるため、競合するフィーダーはガスを無駄にするだけで何も壊しません。リファレンスフィーダーはZcashの[[glossary/P2P-networking|P2Pプロトコル]]を介してヘッダーを取得し、リレーのベストチェーンのブロックロケーター (block locator) を用いて[[glossary/reorg|リオーグ（再編成）]]に追従し、バッチを提出します。1バッチあたり4〜8ヘッダーが最も安価です。4ヘッダーでヘッダーあたり597kガス、16ヘッダーで645kガスとなり、メモリコストが増加します。

あるレビューの発見がストレージ設計に影響を与えました。孤立したすべての高さのベストチェーンインデックスをクリアするには、高さごとにガスがかかるため、攻撃者は古いチップ上に長く軽いブランチを構築し、正直な[[glossary/reorg|リオーグ（再編成）]]をトランザクションガス制限 (transaction gas limit) を超えさせて、リレーをフリーズさせる (freezing the relay) 可能性があります。現在、リレーは新しいブランチのエントリのみを書き換え、新しいチップより上の高さは陳腐化したエントリ (stale entries) として残し、すべてのビューがそれらを無視します（すべての読み取りはチップの高さによって制限されます）。[[glossary/reorg|リオーグ（再編成）]]のコストは、孤立したブランチに依存しなくなりました。

フィーダーはヘッダーを保留すること（遅延）はできますが、偽造することはできません。ユーザーがリレーに依存するアプリケーション（期限、保留中の決済）は、独自のフィーダーを実行するか、少なくとも監視すべきです。

### 2.3 信頼するもの

-   Zcashの[[glossary/proof-of-work|プルーフ・オブ・ワーク]]、必要な深さまで（§3）。
-   デプロイメント入力 (deployment input): [[glossary/checkpoint|チェックポイント]]（ハッシュと高さ、それに加えて、それを含む113ブロックの時間と`nBits`）とネットワークパラメータ (network parameters)。コンストラクタは矛盾するパラメータは拒否しますが、間違ったパラメータは拒否しないため、両方をノードまたはエクスプローラーと比較する必要があります。
-   誰かが供給していること（ライブネス (liveness) のみ）。
-   Baseのクロック、2時間ルールのため。OP Stackは[[glossary/Layer-2|L2]]タイムスタンプを[[glossary/Layer-1|L1]]オリジンから30分以内に保つため、歪んだクロック (skewed clock) はヘッダーを遅延させるか、わずかに早く受け入れる可能性がありますが、作業量 (work) なしに受け入れることはありません。

## 3\. ファイナリティ: ブロック数ではなく作業量を要求する

Zcash [[glossary/testnet|テストネット]]の最小難易度ルール (minimum-difficulty rule) により、タイムスタンプが親ブロックから450秒以上経過している場合、誰でも難易度1でブロックをマイニングできます。このようなブロックは32作業単位 (units of work) を追加しますが、通常のNU7後の[[glossary/testnet|テストネット]]ブロックは約380,000を追加します。マイナーはタイムスタンプを選択し（2時間以内）、平均化ウィンドウ (averaging window) が簡単なブロックを保持すると、その後のブロックも簡単になります。シミュレーションでは、300回の追加承認は正直な1ブロックの作業量の0.085のコストがかかります。そのため、リレーは`confirmationWork(h)`（ベストチェーン上の`h`に対する累積作業量 (cumulative work)）を公開し、`confirmations(h)`を便宜上のものとして文書化しますが、決してセキュリティ対策ではありません。

[[glossary/mainnet|メインネット]]では測定方法は同じですが、数値は異なります。リレーから読み取ると、3,535,181までの100ブロック（NU7以前）はブロックあたり約2.59 × 10¹²の作業量を追加しました。3,548,810までの100ブロック（NU7以後）は、2,683秒でブロックあたり約8.1 × 10¹¹の作業量を追加しました。単一のEquihash ASICはすべての[[glossary/testnet|テストネット]]マイナーを凌駕するため、[[glossary/testnet|テストネット]]リレーは何も保護しません。[[glossary/mainnet|メインネット]]では、アプリケーションは、アンカーより下のフォークポイントからプライベートでマイニングするための[[glossary/hashrate|ハッシュレート]]をレンタルするコストが、その未決済の義務 (open obligations) の合計価値を超えるのに十分な作業量を要求する必要があります。十分に深い[[glossary/reorg|リオーグ（再編成）]]は、それらのそれぞれについて支払いを偽造する可能性があります。

## 4\. 測定

ガス、`forge test --isolate`（各提出は独自のトランザクション、コールドストレージ (cold storage)）、solc 0.8.28、200回のオプティマイザー実行 (optimizer runs) の場合:

| | ガス |
| --- | --- |
| submitHeader、トランザクション全体、NU7後の[[glossary/testnet|テストネット]]（102ブロックウィンドウ）、32個の実際のヘッダー | 最小 613,810 · 平均 625,703 · 最大 664,744 |
| 同上、NU7以前の[[glossary/mainnet|メインネット]]（17ブロックウィンドウ） | 平均 579,490 |
| 1つの典型的なヘッダーの実行 | 576,543 |
| ↳ Equihash: 512インデックスデコードと513BLAKE2b圧縮（274,120）、ツリーチェック（82,843） | 361,100 |
| ↳ 時間ルールと難易度: 102ブロックにわたる平均ターゲット（56,766、主に13回のコールドリード）、2つの中央値（約15,400） | 約 76,500 |
| ↳ ストレージ（4スロットレコード、ベストチェーンインデックス、チップ）とイベント | 約 134,000 |
| デプロイメント、113のコンテキストエントリと12のパラメータを含む | 3,253,717 |

Base Sepolia上のSeamリレーへのフィーディング（2026年10月29日のレシート、ガス価格0.005〜0.006 gwei。[[glossary/Layer-1|L1]]データ手数料は各手数料の0.01%未満でした）:

| | ヘッダー数 | ヘッダーあたりのガス | ヘッダーあたりのETH |
| --- | --- | --- | --- |
| [[glossary/testnet|テストネット]]、追いつく、8バッチ | 70トランザクションで557 | 604,805 | 0.00000341 |
| [[glossary/testnet|テストネット]]、チップに追従する | 4トランザクションで15 | 600,388 | 0.00000335 |
| NU7以前の[[glossary/mainnet|メインネット]]、追いつく | 40トランザクションで315 | 578,105 | 0.00000321 |

25秒ブロックの場合、これは1日あたり3,456ヘッダー、約0.012 ETHです。Base [[glossary/mainnet|メインネット]]フォークで0.005 gweiのベースフィー (base fee) で価格設定すると、1日あたり約0.010 ETHです。

**実データに対する検証。** ルールのPythonポート (Python port) は`nBits`を再現し、4,464,800から4,488,199までの23,400個の[[glossary/testnet|テストネット]]ヘッダー（NU7以前225個、NU7以後23,174個）すべてで時間ルールをパスします。すべてのヘッダーはEquihashとPoWもパスします。ウィンドウを17に、間隔を75秒に、アクティベーション高さを1ブロック変更したり、ダンピング (damping)、その丸め (rounding)、または除算と乗算の順序を変更したりすると、実際のブロックが壊れます。[[glossary/mainnet|メインネット]]では、Zebraの[[glossary/checkpoint|チェックポイント]]リストのハッシュにSHA-256dでリンクされた1,600個の連続するヘッダー（3,497,446 .. 3,499,045）が[[glossary/mainnet|メインネット]]パラメータでパスし、Zebraの最後の[[glossary/checkpoint|チェックポイント]]からリレーの[[glossary/checkpoint|チェックポイント]]までの12,706個のヘッダーはデプロイ前にチェックされました。[[glossary/Solidity|Solidity]]のEquihash検証者 (Equihash verifier) は、Zebraが呼び出す`equihash`クレート (equihash crate) と592個のラベル付きケース (labelled cases) で一致します。80個のリレーテストは実際のヘッダーで実行されます。合成ヘッダー (synthetic headers) はテストにのみ登場し、[[glossary/testnet|テストネット]]の最小難易度で見つかった本物のEquihashソリューション (genuine Equihash solutions) を使用します。

**[[glossary/mainnet|メインネット]]上のNU7。** [[glossary/mainnet|メインネット]]リレーは2026年10月29日に[[glossary/checkpoint|チェックポイント]]3,534,866からデプロイされ、NU7は3,543,405（ZIP 259）でした。アクティベーションブロック（ヘッダータイム (header time) 2026-11-06 02:34 UTC; ウィンドウと間隔が切り替わるにつれて`nBits`が`0x1b675f5f`から`0x1c009054`に変化した）と、その後の5,405個のヘッダーを再デプロイなしで受け入れました。

## 5\. リレーに対するシールド支払いの証明

### 5.1 ステートメント

RISC Zeroゲスト (RISC Zero guest) は、プライベート証人 (private witness) を以下の条件でのみ受け入れます。

1.  **エポック。** トランザクションのコンセンサスブランチIDは、ビルドが許可するものであること。ネットワークはビルドパラメータ (build parameter) であるため、各ネットワークには独自のゲストとイメージID (image id) があります。
2.  **形状。** Ironwoodプール (NU6.3) のみに関わるv6トランザクションであること。透明な部分 (transparent part) 、Sapling、Orchardプールアクション (Orchard-pool action) がないこと。
3.  **インクルージョン。** トランザクションIDがブロックBの`hashMerkleRoot`に到達すること。BのZIP 221履歴リーフが、そのパスとピークを介して、後のヘッダーTの認証データルート (auth data root) とともに、Tの`hashBlockCommitments`（ZIP 244）に到達すること。Tは**アンカー**であり、リレーが保持するヘッダーでなければなりません。
4.  **ノート。** 証人のオープニング（受信者、値、rseed）がノートを再構築し、アクションの暗号文 (ciphertext) が正確にそのノートに復号されること。これにより、受信者のウォレットがそれを見つけて使用できます。
5.  **メモ**は`seam1:`と64桁の16進数で始まり、アプリの`paymentRef`であること。
6.  **受信者**は`receiverCommitment = keccak256(salt32 ‖ receiver43)`と一致すること。

ゲストは192バイトのジャーナル (journal) をコミットします: `(version, branchId, anchor, paymentRef, receiverCommitment, zatoshi)`。Base上の検証者は、RISC Zeroのルーター (RISC Zero’s router) を介してピン留めされたイメージID (image id) とセレクター (selector) の[[glossary/Groth16-proof|Groth16証明]]をチェックし、アンカーがリレーのベストチェーン上にあることを確認し、支払いとアンカー上の作業量を返します。これはステートレス (stateless) です。アプリケーションは各`paymentRef`を1つの義務にバインドし、一度決済します。

### 5.2 [[glossary/EVM|EVMチェーン]]に到達するもの

| オンチェーン | チェーンには決して到達しないもの |
| --- | --- |
| リレーが保持するヘッダーであるアンカーT | トランザクションID |
| アプリが選択したpaymentRef | 注文とTの間のブロックの1つである支払いのブロックB |
| receiverCommitment | ノートコミットメントとナリファイア |
| 値とブランチID | 受信者、そのアドレスとビューイングキー、ソルト (salt) |

値は公開されます。金額がプライベートに保たれる必要があるアプリケーションには、異なるステートメントが必要です。ソルト (salt) は各支払いごとに新しく秘密である必要があります。再利用されたソルト (salt) は支払いをリンクし、推測可能なソルト (salt) は誰でもコミットメントに対して候補の受信者をテストできるようにします。

### 5.3 実際の支払い1件のコスト（Zcash [[glossary/testnet|テストネット]]で0.01 TAZ、2026年10月30日）

| ステップ | 測定値 |
| --- | --- |
| ゲスト実行 (guest execution) | 21セグメントで19,918,817サイクル、0.9秒 |
| [[glossary/STARK|STARK]]レシート、RTX 4090 | 43.1秒 |
| [[glossary/Groth16-proof|Groth16証明]]ラップ (Groth16 wrap)、同マシン | 34.2秒; 260バイトのシール |
| Base Sepoliaフォーク上で、[[glossary/Groth16-proof|Groth16証明]]チェック付きで検証 | 256,720ガス |
| 証明の機械コスト (machine cost)（1時間あたり0.52ドルでレンタル） | 約0.01ドル |

[[glossary/CPU|CPU]]はまだ選択肢ではありません。同じサイズの証明は4コアサーバー (4-core server) で7時間58分かかりました。Base Sepolia上のライブ検証者 (live verifier)（[`0x1701…d5f9`](https://sepolia.basescan.org/address/0x1701e16350A3F0E29DC45E75F356eAc9dAB8d5f9#code)）は、呼び出し元にこの支払いのジャーナル (journal) を返します。

### 5.4 信頼するもの、そして重要な境界

RISC Zeroの証明システム (proof system) とその[[glossary/trusted-setup|Groth16セットアップ]]。RISC Zeroの検証者ルーター (verifier router) のガバナンス (governance)（検証者を停止させることはできますが、セレクター (selector) の背後にあるものを交換することはできません。これは安全性リスクではなく、ライブネスリスクです）。ピン留めされたイメージID (image id)（誰でもRISC ZeroのDockerビルダー (Docker builder) で再構築できます）。プレリリース版Zcashクレート (pre-release Zcash crates) と、[[glossary/zkVM|zkVM（Zero-Knowledge Virtual Machine）]]専用にコンパイルされたパッチ適用済み`pasta_curves` (patched `pasta_curves`)。

重要な境界は経済的 (economic) です。ステートメントはインクルージョンとノートをチェックしますが、ZcashのHalo 2証明 (Halo 2 proofs) や署名はチェックしません。これらはブロックがリレーが追従するチェーンにマイニングされたときにZcashコンセンサスの役割でした。攻撃者がプライベートでマイニングするチェーンは任意のトランザクションを運ぶことができるため、アプリケーションがアンカー上に要求する作業量は、その未決済の義務 (open obligations) の合計価値を上回る必要があります。十分に深い[[glossary/reorg|リオーグ（再編成）]]は、それらのそれぞれについて支払いを偽造する可能性があります。

### 5.5 チェーンを超えたプライバシー

アンカーはヘッダーを公開するため、支払いは注文後かつT前のいずれかのブロックにあることが知られています。そのセットを大きく保つために、まずアンカー高さを固定し、ランダムな遅延の後に支払いを行い、支払いとアンカーを1つのエポックに保ちます（ZIP 221ツリーは各ネットワークアップグレード (network upgrade) で再起動します）。証人を構築するには、トランザクションIDでライトウォレットサーバー (light wallet server) にトランザクションを要求するため、証明者が独自のサーバーを実行するか、Torを介してアクセスしない限り、そのサーバーは何が証明されているかを知ることになります。CLIはリモートプルーバーに証人を渡すことを拒否します。

## 6\. 制限事項

-   [[glossary/testnet|テストネット]]のみ。監査はされていない (unaudited)。
-   [[glossary/checkpoint|チェックポイント]]とネットワークパラメータ (network parameters) は信頼されたデプロイメント入力 (deployment input) です。
-   ライブネス (liveness) は、誰かがリレーに供給することに依存します。
-   これまでに証明された実際の[[glossary/testnet|テストネット]]支払いは1件のみです。[[glossary/mainnet|メインネット]]ゲストはピン留めされていますが、実際の[[glossary/mainnet|メインネット]]支払いを証明したことはありません。
-   現在、受信者（そのビューイングキー (viewing key) 付き）または`seam` CLIで支払った支払者 (payer) のみが証明できます。ほとんどのウォレットはノートのオープニングをエクスポートせず、支払者のアウトゴーイングビューイングキー (outgoing viewing key) によるリカバリーはまだ実装されていません。
-   証明には[[glossary/GPU|GPU]]が必要です。

## 7\. 関連研究

BTC Relay (2016) は、イーサリアム上でオンチェーンSPVリレー (SPV relays) を確立しました。[[glossary/EIP-152|EIP-152]]の動機は、同種のZcashリレーであり、ConsensysのProject Alchemyは、その目的のために[[glossary/Solidity|Solidity]]でBLAKE2bとEquihashを実装しました。「Bridging Sapling: Private Cross-Chain Transfers」（arXiv:2204.10611）は、Zcashと他のチェーン間のプライベート転送を研究しています。ZIP 221はFlyClientスタイルのライトクライアント (FlyClient-style light clients) のためにチェーン履歴をコミットし、「Catching the Fly」（arXiv:2604.26736）はFlyClientを実用化するために必要なことについて議論しています。

## 8\. 未解決の疑問

1.  **ヘッダーのスキップ。** ZIP 221の履歴ツリーはFlyClientのために設計されました。リレーはすべてのヘッダーではなく、多くのヘッダーにわたるサンプリングされた証明 (sampled proof) を受け入れることができますか？また、[[glossary/Layer-2|L2]]コントラクトが検証者である場合、どのサンプリング (sampling) および作業パラメータ (work parameters) が安全ですか？
2.  **ヘッダーごとのチェックまたは[[glossary/zkVM|zkVM（Zero-Knowledge Virtual Machine）]]バッチ。** 1日あたり約2.2 × 10⁹ガスという状況で、ヘッダーのバッチをオフチェーンで証明し、1つの証明を検証する場合の損益分岐点 (break-even) はどこですか？
3.  **必要とされる作業量のサイジング。** Equihashの[[glossary/hashrate|ハッシュレート]]はレンタル可能です。アプリケーションが必要とする作業量を、その未決済の総義務に対して設定する原理的な方法 (principled way) はありますか？また、リレーまたはアプリケーションがそれを強制すべきですか？
4.  **標準。** [[glossary/EVM|EVMチェーン]]上のPoWチェーンリレーのための共通リーダーインターフェースは[[glossary/ERC|ERC（Ethereum Request for Comments）]]として価値がありますか？支払いメモ形式 (memo format) とステートメントはZIPになるべきですか？

特に、コンセンサスチェック (consensus checks)、[[glossary/reorg|リオーグ（再編成）]]処理、および§5.4の経済的境界 (economic bound) についてのフィードバックを歓迎します。

**リンク**

-   リポジトリとREADME: [GitHub - Himess/seam: A Zcash light client for EVM chains: Base checks Zcash headers itself (Equihash, difficulty, most work), and ZK proofs of shielded payments against them. · GitHub](https://github.com/Himess/seam)
-   リレー設計、各ルールのソース、ガス表 (gas table): `contracts/src/relay/README.md`
-   支払い証明 (Payment proofs): `docs/PAYMENTS.md`; 統合 (integrating): `docs/INTEGRATING.md`; フィーディング (feeding): `docs/RELAYING.md`
-   Base Sepolia上のリレー: [[glossary/testnet|テストネット]] [`0x77ce…cE0c`](https://sepolia.basescan.org/address/0x77ceDADCFf8bE399C67AB579Ad739820FaC5cE0c#code)、[[glossary/mainnet|メインネット]] [`0x527B…BE48`](https://sepolia.basescan.org/address/0x527B6347d2392d17fa5Bd13DF88A43676501BE48#code)

*開示: 私はSeamを設計し、AIコーディングアシスタント (AI coding assistants) と共に構築しました。上記のすべての数値は、リポジトリ内のテスト、ファイル、またはトランザクションにリンクしています。*

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/seam-verifying-zcash-headers-on-base-with-eip-152-and-proving-shielded-payments-without-linking-the-chains/26239)
