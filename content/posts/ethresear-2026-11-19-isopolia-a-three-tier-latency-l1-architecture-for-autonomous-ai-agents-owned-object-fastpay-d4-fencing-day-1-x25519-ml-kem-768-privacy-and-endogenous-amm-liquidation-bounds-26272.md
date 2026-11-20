---
title: >-
  Isopolia: 自律AIエージェントのための3層レイテンシーL1アーキテクチャ - 所有オブジェクトFastPay (D4フェンシング)、Day-1
  X25519 + ML-KEM-768プライバシー、および内生AMM清算バウンド
original_title: >-
  Isopolia: A Three-Tier Latency L1 Architecture for Autonomous AI Agents -
  Owned-Object FastPay (D4 Fencing), Day-1 X25519 + ML-KEM-768 Privacy, and
  Endogenous AMM Liquidation Bounds
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/isopolia-a-three-tier-latency-l1-architecture-for-autonomous-ai-agents-owned-object-fastpay-d4-fencing-day-1-x25519-ml-kem-768-privacy-and-endogenous-amm-liquidation-bounds/26272
author: Isopolis
date: '2026-11-19'
category: Economics
tags:
  - economics
  - ai-agents
  - protocol-design
  - security
  - privacy
  - post-quantum
  - consensus
  - scaling
  - layer1
  - isopolia
  - fastpay
topic_id: '26272'
translated_at: '2026-11-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Isopolia: A Three-Tier Latency L1 Architecture for Autonomous AI Agents - Owned-Object FastPay (D4 Fencing), Day-1 X25519 + ML-KEM-768 Privacy, and Endogenous AMM Liquidation Bounds](https://ethresear.ch/t/isopolia-a-three-tier-latency-l1-architecture-for-autonomous-ai-agents-owned-object-fastpay-d4-fencing-day-1-x25519-ml-kem-768-privacy-and-endogenous-amm-liquidation-bounds/26272) — Isopolis (2026-11-19)

## 概要: 私たちが構築しているもの

**Isopolia**は、**自律[[glossary/AI-agents|AIエージェント]]エコノミー**（MCP / [[glossary/x402|x402]] / A2Aによる機械間マイクロペイメント、検証可能な計算リース、オンチェーン[[glossary/Agent-Identity|エージェントID]] `did:isop`、分散型ガバナンス）のために特別に構築された、ソブリンな[[glossary/Layer-1|レイヤー1]]プロトコルおよび決定論的実行スタックです。

自律エージェントは、ベースレイヤー設計に対して相反する要件を課します。

1.  **50ミリ秒未満のマイクロペイメント vs. 共有状態の安全性**: ツール呼び出しやGPUストリーミングはグローバルなBFT（ビザンチンフォールトトレランス）順序付けを待つことができませんが、厳密な相互排他なしにBFTコンセンサスと並行して高速パスを実行すると、クロスドメインでの二重支払いおよび状態分岐の危険が生じます。
2.  **透過的な台帳 vs. 運用プライバシーと[[glossary/harvest-now-decrypt-later-attacks|今すぐ収集し、後で解読する攻撃]]**: [[glossary/Layer-1|L1]]を100%透過的に保つことは、総供給量の保存監査や規制上の追跡可能性（例: AMLR / MiCA）を容易にしますが、エージェントの正確なキャッシュフロー残高をオンチェーンで漏洩させ、オフチェーンのトラフィックを将来の量子復号化に晒します。
3.  **市場ストレス下での計算リース担保**: 標準的なスポット[[glossary/AMM|AMM]]清算モデル（`180%` CR）は、内生的な $x \cdot y = k$ 価格インパクトと有限のリクイデーター容量がモデル化されると、サンプル外の`-60%`から`-80%`の暴落下で破綻します。
4.  **選定の長期的[[glossary/Sybil-attacks|Sybil攻撃]]による乗っ取り**: naiveなランダム委員会選定は、複数四半期にわたって[[glossary/stake|ステーク]]/在職期間を蓄積する忍耐強い攻撃者に対して脆弱です。

これらを個別にではなく、まとめて対処するために、私たちは**ゼロ依存の純粋なRust実装**（`crates/`下の`17`個のモジュラークレート、`#![forbid(unsafe_code)]`、`#![deny(missing_docs)]`、`0`個の外部`crates.io`依存関係）を構築しています。これには、決定論的コア状態遷移、[[glossary/DAG-BFT|DAG-BFT（有向非巡回グラフビザンチンフォールトトレランス）]]コンセンサス、[[glossary/P2P-networking|P2Pネットワーキング]]、[[glossary/Ollama|Ollama]]認知レシートアンカリングを備えたフルノードバイナリ、および新しく完成した高速パスとハイブリッド[[glossary/Post-Quantum|ポスト量子 (PQ)]]レイヤーが含まれます。

リポジトリ: [https://github.com/isopolis/isopolia](https://github.com/isopolis/isopolia)

* * *

## 1. 3層レイテンシーアーキテクチャと`D4`コンポジション排他

状態は明示的に**所有オブジェクト (Owned Objects)**（単一所有者の残高、`did:isop`メタデータ、バージョン管理された`MemoryRoot`チェックポイント）と**共有オブジェクト (Shared Objects)**（オーダーブック、計算リース、共同エスクロー、ガバナンス状態）に分割されます。

| 実行層 | 暗号化 / コンセンサスメカニズム | ワークロード | 目標レイテンシー |
| --- | --- | --- | --- |
| 1. オフチェーンエクスプレスパス | 双方向ステートチャネル ([[glossary/X25519|X25519（鍵交換プロトコル）]] + [[glossary/ML-KEM-768|ML-KEM-768]] + AES-256-GCM)、15-Beat連続ストリーム、スポンサーシールドランウェイバッファ | 高頻度MCP/[[glossary/x402|x402（エックス402）]]マイクロペイメント、計算ストリーミング、[[glossary/CRDT|CRDT（競合解消型レプリカデータ型）]]共同エンジニアリングルーム | < 50 ms |
| 2. ダイレクト高速パス | 順序なしビザンチンブロードキャスト ([[glossary/FastPay|FastPay（決済プロトコル）]] [BDS20]、所有オブジェクト上) | シンプルな転送、MemoryRootアンカリング、did:isop更新 | ~250–350 ms |
| 3. ソブリンコンセンサス | マルチプロポーザー非認証[[glossary/DAG-BFT|DAG-BFT（有向非巡回グラフビザンチンフォールトトレランス）]] (標準3ラウンド vs. [[glossary/commitreveal-step|コミット・リビール方式]] / 閾値暗号化メムプール) | エスクロー、封印オークション、ガバナンス、スラッシング、共有状態 | ~0.5–0.8秒 標準 / ~1.0–1.6秒 封印 |

### FastPayとDAG-BFT間の`D4`相互排他

順序なしの*FastPay*レーンとBFT共有状態エンジンを組み合わせると、古典的なコンポジションバグが発生します。アカウントがFastPay転送とBFTエスクロー決済またはスラッシュを同時に署名すると、ステートルートが[[glossary/fork|フォーク]]する可能性があります。

`crates/isopolia-fastpath`では、**厳密な`D4`相互排他**を強制します。

-   [[glossary/DAG-BFT|DAG-BFT（有向非巡回グラフビザンチンフォールトトレランス）]]コンセンサスがアカウントを変更する前に、`suspend_for_seal(account)`はそのアカウントをFastPayデビットとFastPay転送/チャネル決済の両方からロックアウトします。
    
-   FastPay実行は`resume_after_seal_fence`を介してのみ再開できます。これには、`seal_epoch`（`old + 1`）を厳密にインクリメントし、以前のエポックで署名された進行中のトランザクションを永久に無効にする`>= 6,667 bps`の加重クォーラム[[glossary/SealFenceCertificate|SealFenceCertificate]]が必要です。
    
-   `(validator, sender, seq, seal_epoch)`に対するバリデータの単一ロックは決定論的に追跡されます。競合するトランザクションダイジェストに対する二重投票は、純粋な観測可能な[[glossary/Gasper|Gasper（ギャスパー）]]スタイルの相関スラッシング（自己申告属性ゼロ）を使用してスコアリングされる暗号学的[[glossary/ValidatorEquivocationEvidence|ValidatorEquivocationEvidence]]を生成します。
    
    \\text{slash}\_i = \\min\\left(S\_i,\\; \\left\\lfloor \\frac{3 \\cdot S\_i \\cdot F\_{\\text{window}}}{S\_{\\text{total}}} \\right\\rfloor\\right)
    

オフチェーンの双方向チャネルの場合、協調的なクローズには専用の`COOP_CLOSE`ドメインタグが必要です（紛争期間を回避するために中間`ChannelBalanceUpdate`状態のリプレイを防ぐ）。一方、一方的なクローズは、ウォッチタワー`challenge_stale_state`を介した`10,000 bps`（`100%`）の詐欺師スラッシングを伴う`>= 1,440` Beat（`24 h`）の[[glossary/mainnet|メインネット]]紛争期間を強制します。

* * *

## 2. 透過的なL1上でのDay-1ハイブリッド[[glossary/Post-Quantum|ポスト量子 (PQ)]]プライバシー

私たちは[[glossary/Layer-1|L1]]を完全に透過的に保ちます。これは、軽量な自律[[glossary/AI-agents|AIエージェント]]に対するクライアントサイド[[glossary/Zero-Knowledge-Proof|ZK（ゼロ知識証明）]]オーバーヘッドを回避し、決定論的な供給保存と資金グラフの最小カット（Min-Cut）[[glossary/Sybil-resistance|Sybil検出]]を可能にする一方で、オフチェーンの商業的機密性とエッジでの生存マージンを保護します。

1.  **ゼロ依存Day-1 [[glossary/Post-Quantum|PQ（ポスト量子）]] + AEADスタック (`crates/isopolia-fastpath`)**:
    
    -   **[[glossary/NIST-FIPS-202|NIST FIPS 202]]** (`Keccak-f[1600]`: [[glossary/SHA3-256|SHA3-256]]、[[glossary/SHA3-512|SHA3-512]]、[[glossary/SHAKE128|SHAKE128]]、[[glossary/SHAKE256|SHAKE256]])。
    -   **[[glossary/RFC-7748|RFC 7748]]** 定数時間[[glossary/X25519|X25519（鍵交換プロトコル）]]（全ゼロ共有シークレットを生成する低次数点を拒否）。
    -   **[[glossary/NIST-FIPS-203|NIST FIPS 203]] [[glossary/ML-KEM-768|ML-KEM-768]]**（最終`G(d || 0x03)`ドメイン分離、[[glossary/Number-Theoretic-Transform|NTT（数論変換）]]/[[glossary/Inverse-Number-Theoretic-Transform|INTT（逆数論変換）]]、ストリーミング`SampleNTT`、`SamplePolyCBD_2`、`ek`および`dk`に対する厳密な§7.2 `< 3329`モジュラスチェック、定数時間Barrett/`Compress_d`、および定数時間[[glossary/Fujisaki-Okamoto|Fujisaki-Okamoto]]暗黙的拒否）。
    -   **[[glossary/NIST-FIPS-197|NIST FIPS 197]] + [[glossary/SP-800-38D|SP 800-38D]] AES-256-GCM**。テーブルフリーの代数的 $\mathbb{F}_{2^8}$ S-box ($x^{254}$) とビットごとの定数時間[[glossary/GHASH|GHASH]]を使用（キャッシュタイミングS-boxルックアップを排除）。
    -   **IND-CCA2コンバイナー (IND-CCA2 Combiner) & 方向性セッション**: `ss_X25519`、`ss_MLKEM`、両方の暗号文、および両方の公開鍵を[[glossary/SHA3-256|SHA3-256]]を介してバインドし、方向性のある鍵/ソルト + 方向性のあるAAD (`0x01`/`0x02`) + 単調シーケンスカウンターを導出。
2.  **スポンサーシールドランウェイバッファ (Sponsor Shielded Runway Buffer)**:
    
    -   透過的な台帳上でエージェントの正確な生存マージンを公開すると、競合他社が資金枯渇の正確なBeatを観察し、[[glossary/MEV|MEV（最大抽出可能価値）]]またはグリフィング攻撃を仕掛けることができます。
    -   私たちのシールドされた準備金は、カーディナリティバウンドの[[glossary/SHA3-256|SHA3-256]] Merkleルート（`SHIELDED_MERKLE_ROOT_DOMAIN || tranche_count || top`）と、ロックされた総資金のみをオンチェーンに投稿します。
    -   個々のトランシェ金額、アンロックBeat、およびMerkle証明（`CVE-2012-2459`テール可変性を防ぐために正確なパスジオメトリに対して検証済み）は、オフチェーンで`HybridChannelSession`内に暗号化されて配信されます。

* * *

## 3. 内生[[glossary/AMM|AMM]]清算バウンド (`Config D` から `Config E`へ) と憲法ガバナンス

エージェントエコシステムに特有の経済的およびガバナンス攻撃に対処するために、さらに2つのメカニズムがあります。

1.  **計算ユニット担保 (`Config E`)**:  
    GPU計算リース清算を無限のOTC購入者または外生的な価格下落でモデル化すると、以前の`180%` CR `Config D`設計における壊滅的なテールリスクが隠蔽されました。シミュレーター（`sim_ucc_endogenous.py`）が、3つの連続する15分間の清算ウィンドウにわたる $x \cdot y = k$ 内生[[glossary/AMM|AMM]]価格インパクト、ストレス下での入札者容量の縮小、および`-60%` / `-80%` / ダブルディップ暴落を組み込んだところ、`Config D`は`S1–S3`で`15.62%–24.01%`のP99純損失、`-60%`で**`43.52%`**、`-80%`で**`64.28%`**、そして`100%`の突然のリース終了を被りました。  
    `Config E`はこれを以下に置き換えます。
    
    -   **15分間のローリングエポック決済**により、アクティブなエクスポージャーを**2時間のローリングバッファ（名目値の`12.5%`）**に制限します。
    -   **デュアルトランシェカバレッジ**（`75%`ステーブル + `75..105%`ネイティブトークン過剰マージン）または純粋なネイティブトークンで`>= 220%` CR。
    -   有限の入札者容量（`2.39%–8.17%`割引）と`25%`の部分[[glossary/AMM|AMM]]在庫ヘッジ（残りの内生[[glossary/AMM|AMM]]価格インパクトを`<= 3.71%`に制限）を伴う**ダッチオークション型ボルト (Dutch Vault)（`24–72 h`）清算**。
    -   **保証された45分間のグレースフルカプセルチェックポイント**により、突然のエージェント終了を`0.0%`に削減（`-60% / -80%`下で`63.6%–65.3%`中断なし、`34.7%–36.4%`クリーンチェックポイント一時停止）。
2.  **忍耐強い[[glossary/Sybil-attacks|Sybil攻撃]]耐性ガバナンス (Patient-Sybil-Resistant Governance) (`crates/isopolia-republic`)**:
    
    -   **階層化コホート選定 (Stratified Cohort Sortition)**: 4四半期未満のアカウントは`6/51`議席に制限されます。
    -   **アクティブな第三者手数料バーンクォータ**（四半期あたり`>= 15`ネイティブトークン）と資金グラフの最小カット（Min-Cut）[[glossary/Sybil-attacks|Sybilクラスタリング]]の組み合わせ。
    -   **制限された財務と退出保証**: クラス1支出は投票あたり`<= 0.25%`、`14–30日`の[[glossary/Timelock|タイムロック]]、フォークイグジット（Fork Exit）権、および憲法改正には`>= 6/11`の人間による拒否権。

* * *

## 4. 現在の実装と検証ステータス

リポジトリはすでに、`17`個のモジュラーRustクレート（`isopolia-primitives`、`isopolia-crypto`、`isopolia-vdf`、`isopolia-noyau0`、`isopolia-arbitrator`、`isopolia-vm`、`isopolia-chain`、`isopolia-storage`、`isopolia-mempool`、`isopolia-consensus`、`isopolia-ucc`、`isopolia-povs`、`isopolia-republic`、`isopolia-agent`、`isopolia-p2p`、`isopolia-node-bin`、および`isopolia-fastpath`）にわたる**フェーズI–VIステップ6.1**を実装しています。これには以下が含まれます。

-   外部`crates.io`依存関係ゼロ（CIサプライチェーンゲートで検証済み）、`#![forbid(unsafe_code)]`、`#![deny(missing_docs)]`、決定論的状態（コンセンサス/ステートクレートでの[[glossary/HashMap|HashMap]]/[[glossary/HashSet|HashSet]]/[[glossary/f32|f32]]/[[glossary/f64|f64]]は禁止）、およびソースモジュールあたり`<= 400`行の厳密な制限。
-   **[[glossary/NIST-FIPS-202|NIST FIPS 202]]**、**[[glossary/RFC-7748|RFC 7748]]**、完全な256バイト**[[glossary/NIST-FIPS-197|FIPS 197]]** S-box、**[[glossary/SP-800-38D|NIST SP 800-38D]]**テストケース13–16、およびビット単位で正確な**[[glossary/NIST-FIPS-203|NIST FIPS 203]] [[glossary/ML-KEM-768|ML-KEM-768]]**ダイジェストに対してパスする暗号学的既知応答テスト (`crates/isopolia-fastpath/tests/crypto_kat.rs`)。
-   マルチノード[[glossary/TCP|TCP]] [[glossary/Ed25519|Ed25519]] [[glossary/devnet|開発ネットワーク (devnet)]]クラスターオーケストレーション、コールド同期検証、[[glossary/Ollama|Ollama]]認知レシートポリシーダイジェスト[[glossary/Attestation|アテステーション（証明）]]、および決定論的[[glossary/fuzzing|ファジング]]（`--release`での`-C overflow-checks=on`）。

次のエンジニアリングマイルストーン（フェーズVIステップ6.2–6.5およびフェーズVII）：閾値暗号化メムプール、[[glossary/Crypte|Crypte]]暗号化エージェントストレージ、[[glossary/Thymus|Thymus]]センチネルサーキットブレーカー、[[glossary/ML-DSA|ML-DSA（格子ベース署名アルゴリズム）]] / STARKビーコン[[glossary/Post-Quantum|PQ（ポスト量子）]]アップグレードパス、および決定論的[[glossary/RV64IM|RV64IM]]サンドボックスプラグイン。

* * *

## コミュニティからのフィードバックのための未解決の質問

1.  **`D4`フェンシング (D4 Fencing) vs. 因果オブジェクトロック**: アカウントごとの明示的なクォーラム認証[[glossary/SealFenceCertificate|SealFenceCertificate]]は、[[glossary/FastPay|FastPay（決済プロトコル）]]と[[glossary/DAG-BFT|DAG-BFT（有向非巡回グラフビザンチンフォールトトレランス）]]間の最もクリーンな安全境界でしょうか、それとも専用のフェンストランザクションなしに厳密な相互排他を強制する、より軽量な因果オブジェクトバージョン管理スキーム（Sui/Mysticetiに匹敵するもの）があるでしょうか？
2.  **[[glossary/Post-Quantum|ポスト量子 (PQ)]]エポックランダム性遷移**: 軽量な標準化された[[glossary/Post-Quantum|PQ（ポスト量子）]]閾値署名 / [[glossary/DKG|DKG（分散鍵生成）]]の[[glossary/BLS-keys|BLS鍵]]代替はまだ存在しないため、フェーズ1-3エポックランダム性を[[glossary/BLS-keys|BLS鍵]]に限定し、フェーズ4で[[glossary/commitreveal-step|コミット・リビール方式]] + STARK検証済み[[glossary/Verifiable-Delay-Function|VDFビーコン]]に移行します。評価する価値のある、よりクリーンな中間構造はありますか？
3.  **ダッチオークション型ボルト (Dutch Vault) 清算人容量曲線**: $x \cdot y = k$ 部分[[glossary/AMM|AMM]]ヘッジ（`25%`）を超えて、オフチェーン清算人資本収縮に関するどのような経験的ストレス曲線が、[[glossary/Layer2|L2]]/[[glossary/defi|DeFi（分散型金融）]]シミュレーションで最も現実的であることが証明されていますか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/isopolia-a-three-tier-latency-l1-architecture-for-autonomous-ai-agents-owned-object-fastpay-d4-fencing-day-1-x25519-ml-kem-768-privacy-and-endogenous-amm-liquidation-bounds/26272)
