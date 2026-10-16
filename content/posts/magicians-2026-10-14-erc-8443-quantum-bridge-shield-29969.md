---
title: 'ERC-8443: 量子ブリッジシールド'
original_title: 'ERC-8443: Quantum Bridge Shield'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8443-quantum-bridge-shield/29969'
author: quantova-inc
date: '2026-10-14'
category: ERCs
tags:
  - ercs
  - cryptography
  - post-quantum
  - security
  - bridges
  - consensus
  - eip
  - protocol-design
topic_id: '29969'
translated_at: '2026-10-16'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8443: Quantum Bridge Shield](https://ethereum-magicians.org/t/erc-8443-quantum-bridge-shield/29969) — quantova-inc (2026-10-14)

Quantova Inc. は、[[glossary/ERC|ERC]]「量子ブリッジシールド」を提案する。これにより、イーサリアム (Ethereum) 上のあらゆるブリッジ (bridge) は、量子コンピュータ (quantum computer) が偽造できない[[glossary/Hash-based-signatures|ハッシュベース署名]]で委員会 (committee) がバッチに署名した場合にのみ、クロスチェーンメッセージを受け入れることができる。

### なぜ今これが重要なのか

イーサリアム (Ethereum) 上のブリッジ (bridge) は、secp256k1 [[glossary/ECDSA-signature|ECDSA署名]]または[[glossary/BLS12-Curves|BLS12 381]]で署名する委員会 (committee) によって保護されている。ショアのアルゴリズム (Shor's algorithm) は多項式時間 (polynomial time) でそれらの秘密鍵 (private keys) を回復でき、すべての委員会 (committee) の公開鍵 (public key) と署名 (signature) はすでに公開されているため、今日データを収集し、後で解読することが可能だ。NIST IR 8547 は、2030年からの量子脆弱な署名 (quantum vulnerable signatures) の非推奨化と2035年以降の禁止を提案しており、CNSA 2.0 も署名 (signing) について同じ移行期間を設定している。ブリッジ (bridge) はイーサリアム (Ethereum) 上で最大級の価値プールを保持しており、回復された鍵 (key) が盗難につながる最初の場所となる。

### 構造

各委員会 (committee) メンバーは、RFC 8554 で指定され、NIST SP 800 208 で承認され、CNSA 2.0 にリストされている[[glossary/eXtended-Merkle-Signature-Scheme|LMS鍵]]を保持する。これはSHA-256 (SHA 256) をベースとし、32バイト出力、ツリー高さ5から25、ウィンターニッツパラメータ (Winternitz parameters) 1、2、4、8を使用する。公開鍵 (public key) は56バイト、高さ10のW4署名 (W4 signature) は2,508バイトだ。セキュリティ (Security) はSHA-256 (SHA 256) とKeccak-256 (Keccak 256) のみに依存し、グローバー探索 (Grover search) に対して約128ビットの耐性を持つ。

委員会 (committee) は各メッセージバッチのMerkleルート (Merkle root) に署名する。ガード (guard) は、個別の凍結されていない鍵 (distinct unfrozen keys) の厳密な過半数によるルート (root) の承認のみを行い、使用されたすべてのリーフ (leaf) をダイジェストと署名 (signature) のハッシュ (hash) として記録し、同じリーフ (leaf) に2回署名 (sign) した鍵 (key) を凍結し、すべてのダイジェストをドメインタグ (domain tag)、チェーン識別子 (chain identifier)、ガードアドレス (guard address)、およびエポック (epoch) にバインドする。すべてのルート (root) は使用前に最低60秒間待機し、すべてのアクション (action) は完全に実行されるか、リバート (reverts) される。移行期間中はハイブリッドモード (hybrid mode) で各LMS署名 (LMS signature) をECDSAとペアリングする。

### 測定コスト

*   高さ10でのLMS W4検証 (verification) は、16署名 (signatures) で185,093から223,979[[glossary/gas|ガス]]、平均204,807ガス (gas) を要する。
*   3つのハイブリッドメンバー (hybrid members) のうち2つによる承認は549,015ガス (gas)、10のうち6つによる承認は1,686,595ガス (gas) を要する。
*   承認された256のバッチから1つのメッセージを受け入れるのに7,078ガス (gas) を要する。
*   シールド (shield) を介した[[glossary/Layer-1|LayerZero]]パケット (packet) は128,683ガス (gas) を要する。
*   ガード (guard) が受け入れる最悪の委員会 (committee) ローテーション (rotation) は12.44百万ガス (gas) を要し、[[glossary/EIP|EIP]] 7825 の上限16,777,216ガス (gas) の26パーセント未満である。

### 保証

NioLabsのセキュリティ評価 (security assessment) では、重大な問題も高深刻度の問題も発見されなかった。参照実装 (reference implementation) には、512回の[[glossary/fuzzing|ファジング]]を実行する55のコントラクトテスト (contract tests)、コントラクト (contracts) と署名者キット (signer kit) 間の24ラウンドのバイトレベルのパリティ (byte level parity)、RFC 8554 付録Fのベクトル (vectors)、48の署名者キット (signer kit) 安全性チェック (safety checks)、およびローカルのイーサリアム (Ethereum) ノード (node) での12ステップのライブ実行 (live run) が含まれており、これらすべてが継続的インテグレーション (continuous integration) で行われている。

### Quantovaについて

Quantova Inc. は、ゼロから量子耐性スタック (post quantum stack) を構築した。Quantovaネットワーク (network) 上のすべてのアカウント (account) はFIPS 204に基づく[[glossary/ML-DSA|ML-DSA]] 65またはFIPS 205に基づく[[glossary/SLH-DSA|SLH-DSA]]で署名し、バリデータ (validators) はすべてのブロック (block) とファイナリティ証明書 (finality certificate) にML-DSA 65で署名し、ノード (nodes) はFIPS 203に基づく[[glossary/ML-KEM|ML-KEM]] 768でチャネル (channels) を確立し、ハッシュ (hashing) はSHA3-256 (SHA3 256) であり、決済パス (settlement path) に楕円曲線暗号 (elliptic curve cryptography) は含まれていない。スマートコントラクト (Smart contracts) は当社独自の言語Quantaで書かれ、証明済みコンパイラ (attested compiler) によってコンパイル (compiled) され、当社独自の量子耐性仮想マシン (post quantum virtual machine) であるQVMで実行される。本番環境で量子耐性署名 (post quantum signatures) を実行した経験から、キーの状態 (key state)、リーフの再利用 (leaf reuse)、およびロールバック (rollback) が実際にどのように失敗するかを学び、この[[glossary/ERC|ERC]]の署名者キット (signer kit) は、永続的なリーフ予約 (durable leaf reservation)、単調増加するハイウォーターマーク (monotonic high water mark)、およびネットワークファイルシステム (network file systems) の拒否といった経験を活かしている。

### フィードバック歓迎

*   デフォルトのパラメータセット (parameter set)、高さ15または20のW4について
*   委員会 (committee) サイズの境界が実際のブリッジオペレーター (bridge operators) に適合するかどうか
*   ドラフト (draft) のパケット検証者バインディング (packet verifier binding) を超えるブリッジ設計 (bridge designs) のためのリーフバインディング (leaf bindings)

ドラフトのプルリクエスト (pull request) [Add ERC: Quantum Bridge Shield by quantova-inc · Pull Request #2071 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/2071)

セキュリティ評価 (security assessment)、テスト (tests)、ベンチマーク (benchmarks) を含む参照実装 (Reference implementation) [GitHub - quantova-inc/Quantova-bridge-guard: The first open source post quantum shield for bridges on Ethereum. Messages pass only with RFC 8554 LMS hash based signatures that quantum computers cannot forge. Proposed to Ethereum as the Quantum Bridge Shield ERC. Owned by Quantova Inc, MIT or Apache 2.0. www.quantova.org qstamp.org · GitHub](https://github.com/quantova-inc/Quantova-bridge-guard)

*7投稿 - 3参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8443-quantum-bridge-shield/29969)
