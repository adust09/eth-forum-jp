---
title: '暗号化されたアカウント: コントラクト内に存在するPIN'
original_title: 'Encrypted Account: a PIN that lives in the contract'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/encrypted-account-a-pin-that-lives-in-the-contract/26265
author: Himess
date: '2026-11-18'
category: Security
tags:
  - security
  - account-abstraction
  - privacy
  - cryptography
  - fully-homomorphic-encryption
  - eip
  - protocol-design
  - ux
  - smart-accounts
  - pin-security
topic_id: '26265'
translated_at: '2026-11-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Encrypted Account: a PIN that lives in the contract](https://ethresear.ch/t/encrypted-account-a-pin-that-lives-in-the-contract/26265) — Himess (2026-11-18)

## TL;DR

-   [[glossary/Encrypted-Account|暗号化されたアカウント]]は、Zamaの[[glossary/Threshold-Encryption|閾値FHE]]（完全準同型暗号）で暗号化されたPINをコントラクト内に保持する[[glossary/Smart-Account|ERC-4337スマートアカウント]]です。コントラクト自体がPINをチェックし、推測回数をカウントします。サーバーはPINも推測回数も保持しません。
-   すべての推測は、その結果が復号される前にオンチェーンでカウントされます。PINはオフラインでブルートフォース攻撃 (brute-force attack)されることはなく、オンラインでの推測は30日間で約12回に制限されます。
-   キー単独では、設定された制限内で既知のアドレスにのみ支払いが可能です。新しいアドレス、多額の送金、または任意の呼び出しにはPINと遅延が必要です。
-   所有者の第二デバイスが共同署名 (co-signed)していない推測は、不正解ごとに倍増するETHボンド (bond)を伴う必要があります。不正解の場合、ボンドはアカウントに残るため、盗まれたキーを持つ泥棒は、間違えるたびに所有者に支払うことになります。
-   エスケープ (escape)にはFHEは不要です。キー単独で開始でき、遅延後に資金は所有者が事前に選択したアドレスに送られます。
-   [[glossary/Sepolia|Sepolia]]上の研究プロトタイプであり、未監査、MITライセンスです。

## 動機

盗まれたキーは、セルフカストディ (self-custody)が失敗する主な原因であり続けています。キーはマルウェア、フィッシング、侵害されたデバイスを通じて漏洩し、シードフレーズ (seed phrases)の紛失だけではありません。2025年には、Chainalysisが少なくとも80,000人の被害者を持つ158,000件の個人ウォレット侵害を数えました（[The Block](https://www.theblock.co/post/382477/crypto-hack-2025-chainalysis)）。

今日の防御策は、問題を解決するのではなく、問題を移動させているに過ぎません。共同署名サービス (Co-signer services)は、すべての支払いにサーバーまたは第二デバイスを追加し、ソーシャルリカバリー (social recovery)は時間がかかります。オンチェーン支出制限 (On-chain spending limits)は公開されているため、泥棒は何を奪えるかを正確に知っています。

コントラクト自体がチェックする第二要素 (second factor)があれば、このギャップを埋めることができます。しかし、パブリックチェーン (public chain)上の知識要素 (knowledge factor)は、通常2つの方法のいずれかで失敗します。検証するデータが公開されている場合（ハッシュ、コミットメント (commitment)、ZK検証鍵 (ZK verification key)など）、6桁のPINはオフラインブルートフォース (offline brute force)に屈します。10⁶の候補は、遅いハッシュの背後であっても少なすぎます。検証がオフチェーン (off-chain)で行われる場合（サーバー、[[glossary/Trusted-Execution-Environment|TEE（トラステッド実行環境）]]、[[glossary/MPC|MPC（マルチパーティ計算）]]委員会など）、レート制限 (rate limit)もオフチェーンに存在し、それ自身の信頼 (trust)とライブネス (liveness)の問題を抱えます。

## アイデア: まずカウントし、後で公開する

[[glossary/Fully-Homomorphic-Encryption|FHE（完全準同型暗号）]]により、コントラクトは秘密とカウンターの両方を保持できます。PINのフィンガープリントは暗号文 (ciphertext)として保存され、比較は暗号文上で実行され、結果は暗号化されたビット (encrypted bit)になります。コントラクトは、そのビットがいつ復号 (decrypted)されるかを決定するため、誰かが結果を見る前にすべての試行をカウントできます。

1.  **セットアップ (Setup)**。クライアント (client)は `h = first64(Argon2id(PIN, salt))` (64 MiB, t = 3; ソルト (salt)はチェーンとアカウントを結合します) を導出し、`Enc(h)` を保存します。PINはデバイスから離れません。
2.  **チャレンジ (Challenge)**。オペレーション (operation)を開くと、オペレーションの内容にバインドされた `c = H(tag, chainId, account, opId, opHash)` が発行されます。
3.  **推測 (Guess)**。クライアントは `Enc((h + c) mod 2^64)` を入力証明 (input proof)とともに送信します。アカウントは不正解スコア (wrong-guess score)に仮のポイント (provisional point)を追加し、FHE下で比較 (compares under FHE)し、結果ビット (result bit)のみを復号可能 (decryptable)とマークします。送金 (transfer)の場合、2番目のビットは遅延クラス (delay class)を示します。これは最初のビットでマスクされるため、不正解の場合、制限について何も知ることはできません。
4.  **確定 (Finalize)**。誰でも閾値ネットワークの署名済み結果 (threshold network’s signed result)をリレーします。正しい推測 (correct guess)は自身のポイントとボンドを返金 (refund the point and the bond)し、オペレーションの遅延を開始します。不正解の場合、両方を保持し、バックオフ (back-off)を開始します。

コントラクトは、カウントしていない推測の結果を絶対に公開しません。推測は1つのチャレンジにバインドされているため、他のオペレーションには役立ちません。

```
クライアント                               アカウント (オンチェーン)                     閾値ネットワーク
開く(op) ──────────────────────────► チャレンジ c を発行
Enc((h + c) mod 2^64) + 証明 ─────► スコア += 1, ボンドを保持
                                     ok = (Enc(h) + c == guess), FHE下で
                                     okのみ復号可能とマーク ────────────► 1ビット復号
誰でも: 確定(ok, 署名) ───► ok: ポイントとボンドを返金, 遅延を開始
                                     不正解: 両方を保持, バックオフを開始
遅延後に実行 ───────────► 送金
```

## 設計

キー単独で既知のアドレスへの少額の支払いを行うことができます。それ以外のすべて（新しい受取人、多額の送金、無制限の承認、任意の呼び出しなど）にはPINと遅延が必要であり、最悪のケースに備えてエスケープ (escape)が用意されています。所有者がセットアップ時に指定するオフチェーンサービス (off-chain service)であるウォッチタワー (watchtower)は、各チェックの第二フェーズをリレーし、所有者に警告します。ウォッチタワーはアカウントを制限し、アラームビット (alarm bits)を読み取ることしかできず、資金を保持することはありません。

[![encrypted-account-three-paths](https://ethresear.ch/uploads/default/optimized/3X/1/c/1cf8ba6aca40dab4a2b2dd8f8f07ee7a7b16349c_2_483x500.jpeg)](https://ethresear.ch/uploads/default/original/3X/1/c/1cf8ba6aca40dab4a2b2dd8f8f07ee7a7b16349c.jpeg "暗号化されたアカウントの3つの経路")

-   **2つの経路 (Two paths)**。キー（K）単独で、資産ごとの日次制限 (daily per-asset limit)まで既知の受取人 (known recipients)に支払うことができます。新しい受取人、多額の送金、無制限の承認 (unlimited approval)、任意の呼び出し (arbitrary call)など、それ以外のすべてにはK、PIN、および遅延が必要です。デフォルトでは1時間、多額の送金や任意の呼び出しには48時間です。
-   **迅速に厳格化、緩やかに緩和 (Tighten fast, loosen slow)**。既知のアドレスの削除、制限の引き下げ、アカウントの制限、リカバリーの停止など、ルールを厳格化 (tightens the rules)するだけの操作は、キー単独で行われ、すぐに適用されます。緩和 (loosening)にはPINと遅延が必要です（デフォルトで24〜72時間）。
-   **隠されたルール (Hidden rules)**。暗号化ポリシーバリアント (encrypted-policy variant)では、既知のリストと制限 (known lists and the limits)は暗号文 (ciphertexts)であり、実際のカットオフは誰も知らないランダムなトリップワイヤー (random tripwire)（所有者も含む）です。K単独の支払いがチェックに失敗した場合、どのチェックに失敗したかを告げずにPIN経路に移行します。トリップワイヤーを超えた場合、ウォッチタワーのみが読み取れるスティッキーアラーム (sticky alarm)も設定され、所有者がPINでクリア (clears it with the PIN)するまでK単独の支払いはブロックされたままになります。
-   **レート制限 (Rate limit)**。最初の2回の不正解の後には待機期間はありませんが、その後は `15分 · 4^(n−3)` となり、7日で上限に達します。スコアは7日ごとに1ポイント減衰 (decays by one point)します。正しいPINはスコアをリセットしません（以前のバージョンではリセットされ、30日間で2,307回の推測が可能でした）。コントラクトの正確なルールをシミュレーションすると、所有者が何もしない場合、30日間で最大12回の推測が可能です。
-   **ボンド (Bond)**。キー単独で行われた推測、またはリカバリートレック (recovery track)を通じて誰かが行った推測は、アカウントの残高からではなく、アカウント外からETHボンド (ETH bond)を伴う必要があります。これは0.001 ETHから始まり、そのトラックの不正解スコア (wrong-guess score)に応じて倍増します（0.002、0.004など）。正しい推測はボンドを返金されます。不正解の場合、ボンドはアカウントに残るため、間違えるたびに所有者の残高 (owner’s balance)が増加します。所有者は、PIN検証済み変更 (PIN-verified change)でキー経路のベースを最大100 ETHまで引き上げることができます。リカバリートレックはまだこれに追従していません（「制限事項」を参照）。
-   **第二デバイス (Second device)**。所有者の第二デバイス (second device)（またはリカバリーヘルパー）によって共同署名 (co-signed)された推測はボンドを伴わず、独自のバックオフ予算 (back-off budget)を持つため、キー単独の泥棒が所有者をその経路から締め出すことはできません。
-   **エスケープ (Escape)**。K単独で開始できます。これにより、保留中のオペレーション (pending operation)はすべてキャンセルされ、匿名推測トラック (anonymous guessing tracks)とK単独経路が閉じられ、エスケープアドレス (escape address)が固定されます。デフォルトでは30日後、誰でもスウィープ (sweep)を実行できますが、そのアドレスにのみ送金され、そのアドレスは自身の同意署名 (consent signature)でのみ設定できます。エスケープはFHEを使用しないため、FHEネットワークがダウンしている (FHE network is down)場合でも機能します。PINを持つ第二デバイス経路のみがこれをキャンセルできます。
-   **署名 (Signatures)**。[[glossary/ERC-1271|ERC-1271]]は、PIN検証済みオペレーションを通じて承認されたハッシュのみを受け入れるため、キー単独でフィッシングされた許可は無効 (void)です。
-   **シードレスリカバリー (Seedless recovery)**。キーを紛失した所有者は、ボンド付きリカバリートレックを通じてPIN単独で新しいキーを提案 (propose a new one with the PIN alone)できます。これは7日後に実行されます。所有者が共同署名しなかった第二デバイスを登録している場合は30日後です。所有者はエスケープを開始するか、Kと第二デバイスで拒否 (vetoing with K and the second device)することでこれを停止できます。デフォルトでオンになっており、キー単独でオフにできます。
-   **強迫PIN (Duress PIN)（オプション）**。第二のPINはチェックを通過しますが、ウォッチタワーのみが復号できるサイレントアラームビット (silent-alarm bit)を設定します。スロットは常にFHEランダム性 (FHE randomness)で埋められており、強迫PINが選択されていない場合でも、どのアカウントに強迫PINがあるかを誰も知ることはできません。オープンモード (open mode)では、これはアラームであり、ブレーキではありません。所有者から強制された送金は実行されます。

## キーを持つ泥棒ができること

シードフレーズ (seed phrase)を盗んだがPINを盗んでいない泥棒は、ほとんど何も奪えず、推測するたびに代償を払います。

-   彼は、既知のリスト (known list)にあるアドレスに、隠された日次制限 (hidden daily limit)まで支払うことができます。チェックに失敗した支払いは、どのチェックに失敗したかを告げずにPIN経路に移行し、トリップワイヤー (tripwire)を超えた支払いはサイレントアラーム (silent alarm)を発します。
-   彼はPINなしでは自分のアドレスに支払ったり、多額の送金をしたりすることはできません。キー単独で署名された許可は無効 (permit signed with the key alone is void)です。
-   彼は30日間で約12回PINを推測できますが、そのたびに倍増するボンド (doubling bond)を支払います。デフォルトのベース (default base)では合計約0.65 ETHです。不正解のたびに所有者に支払い、アラートがトリガーされ、キー経路で3回不正解するとアカウントが制限 (restricts the account)され、キー単独の支払いが停止します。
-   所有者はエスケープ (escape)で対応します。エスケープが開始されると、推測とキー単独の支払いは停止し、遅延後に資金はエスケープアドレス (escape address)に送られます。

人間が選択した6桁のPINでブロックリストがない場合、12回のスロットルされた推測 (throttled guesses)は約7%の確率で成功し、4回の推測（最初の1時間以内のエスケープ）は約2.6%の確率で成功します（[Markert et al., IEEE S&P 2020](https://arxiv.org/abs/2003.04868)）。10回未満の推測では曲線は線形補間される (interpolated linearly)ため、2番目の数値は楽観的です。アプリのジェネレーターからのランダムPIN (random PIN from the app’s generator)の場合、12回の推測が成功する確率は約0.0015%です。アプリはランダムPINを提供し、最も一般的なPINの短いリストのみを拒否し、その他の推測可能なもの (guessable ones)については警告します。

PINを見つけた泥棒も、PIN経路の遅延 (PIN-path delay)を待つ必要があり、所有者のエスケープ (owner’s escape)が保留中のオペレーションをキャンセルする (owner’s escape cancels the pending operation)ため、その操作は無効になります。

## 信頼しなければならないこと

すべての第二要素 (second factor)は信頼をどこかに移動させます。問題はどこに移動させるかです。

| 第二要素 | チェック者 | 信頼しなければならないこと |
| --- | --- | --- |
| 共同署名サービス (Co-signer service)（SMS、メール、またはアプリコード） | 企業のサーバー (company’s server) | その誠実さ (honesty)と稼働時間 (uptime)。すべての支払いを見ている。 |
| [[glossary/Trusted-Execution-Environment|TEE]]エンクレーブ | オペレーター (operator)が実行するセキュアチップ (secure chip) | チップベンダー、サイドチャネル (side channels)、およびオペレーターの稼働時間 |
| [[glossary/MPC|MPC]]キーシェア (key shares) | シェアホルダー (share holders)のグループ | 十分な数が共謀 (collude)しないこと、および彼らの稼働時間 |
| パスキーまたは指紋 | 電話のセキュアチップ (phone’s secure chip) | 電話とそのベンダー。電話のロックを解除できる人は誰でも署名できる。 |
| メールリカバリー (Email recovery) | メールプロバイダー (email provider) | プロバイダーの署名キーと受信トレイ (inbox) |
| マルチシグ (k-of-n) | チェーン | k個のキーが同時に奪われないこと。ルールは公開されている。 |
| [[glossary/Encrypted-Account|暗号化されたアカウント]] | コントラクト、[[glossary/Fully-Homomorphic-Encryption|FHE]]下で | Zamaの閾値ネットワーク (threshold network)とそのガバナンス |

最初の5行では、オフチェーンの当事者が第二要素が正しいかどうかを決定します。マルチシグ (Multisig)はオンチェーンで決定しますが、すべての支払いに複数のキーが必要であり、泥棒にそのルールを公開します。FHE PINはオンチェーンでも決定し、カウンターとルールは隠されているため、サーバーはPINを保持したり、制限を決定したりしません。残る信頼は、1つのオペレーター (operator)ではなく閾値ネットワーク (threshold network)にあり、エスケープ (escape)はそれすらにも依存しません。

**マルチシグまたはパスキーとの組み合わせ**。デザインは組み合わせる (composes)ことができます。

-   [[glossary/Encrypted-Account|暗号化されたアカウント]]は、マルチシグの1つの署名者になることができます。その[[glossary/ERC-1271|ERC-1271]]署名 (signature)は、PINと遅延で承認されたハッシュに対してのみ存在するため、その署名者の盗まれたキー (stolen key)は共同署名できません。
-   マルチシグはアカウントのキーになることができます。直接アカウントを呼び出すため、キー単独の支払いにはそのクォーラムが必要であり、それ以外のすべてには依然としてPINが必要です。
-   エスケープアドレス (escape address)はコールドマルチシグ (cold multisig)にすることができ、[[glossary/ERC-1271|ERC-1271]]署名 (signature)でその役割に同意します。
-   第二デバイス (second device)は[[glossary/ERC-1271|ERC-1271]]ラッパー (wrapper)の背後にあるパスキーにすることができ、指紋がボンド不要の推測に共同署名 (fingerprint co-signs)します。

これらの組み合わせはまだテストしていません。

## ステータスとコスト

[[glossary/Encrypted-Account|暗号化されたアカウント]]は研究プロトタイプ (research prototype)です。未監査、テストネットのみ (testnet only)、MITライセンスです。[[glossary/Sepolia|Sepolia]]上でパブリックテストネットリレーヤーとKMSを使用して測定しました。

| 内容 | 結果 |
| --- | --- |
| PINフロー、エンドツーエンド (PIN flow, end to end)（デスクトップクライアント、N = 30） | p50 24.4秒、p95 47.7秒 |
| ミッドレンジの電話での入力証明 (Input proof on a mid-range phone) | p95 13.65秒 |
| PIN検証済み送金 (PIN-verified transfer)（リクエスト、推測、確定、実行） | ≈ 2.7Mガス |
| キーのみの送金、暗号化されたリストと制限 (Key-only transfer, encrypted lists and limit) | ≈ 1.76Mガス |
| キーのみの送金、公開リストと制限 (Key-only transfer, public lists and limit) | ≈ 60kガス |

[[glossary/Sepolia|Sepolia]]は、新しいストレージスロット (storage slot)の価格を、今日の[[glossary/mainnet|メインネット]]の約5倍高く設定しており、FHEステートはストレージヘビーです。今日の[[glossary/mainnet|メインネット]]のスケジュールでは、最初の2回の送金はそれぞれ約1.8Mガスと1.1Mガスに相当します。公開リストバリアント (public-list variant)は、隠されたリスト、制限、トリップワイヤー (hidden lists, limit and tripwire)を放棄することで、キー単独の送金を約30倍安くします。

リポジトリには隠された遺言 (hidden will)（暗号化されたシェアを持つ相続人 (heirs with encrypted shares)）も含まれていますが、この投稿では省略します。

## 制限事項と未解決の疑問

他の[[glossary/Fully-Homomorphic-Encryption|FHE]]アプリケーションと同様に、この設計はZamaのネットワークの信頼の前提 (trust assumptions)を継承しており、いくつかの側面はまだ未解決です。

-   **Zamaへの信頼 (Trust in Zama)**。機密性 (Confidentiality)はZamaの閾値KMS (threshold KMS)に依存しており、13ノードのうち5ノードが共謀 (collude)すると失敗します。完全性 (Integrity)はコプロセッサの正直な多数 (honest majority of coprocessors)に依存し、両方ともZamaのガバナンスがアップグレードできる (governance can upgrade)コントラクトに依存しています。
-   **指紋の漏洩 (A leaked fingerprint)**。ネットワークが `h` を漏洩した場合、PINチェックがバイパスされ、約10⁶回のArgon2id実行 (Argon2id runs)でPIN自体が回復されます。これは1コアで約2日、大規模サーバーで約1時間かかります。シードレスリカバリー (seedless recovery)がオンになっている (seedless recovery on)場合、その漏洩と所有者からの反応がない7日間（登録された第二デバイスがある場合は30日間）でアカウントを乗っ取ることができます。暗号文はオンチェーンに残るため、後で漏洩したキーも今日の指紋を開くことができます。
-   **ボンドのサイドドア (A side door for the bond)**。リカバリートレック (recovery track)は、所有者がキー経路に設定したベースに関わらず、推測の価格を0.001 ETHから設定しており、2つのトラックは1つの共有予算 (shared budget)を共有しています。両方が所有者のベースに従うまで、引き上げられたベースがそこで回避される可能性がある (raised base can be sidestepped there)という問題があります。
-   **グリフィング (Griefing)**。同じ共有予算を通じて、見知らぬ人が約0.26 ETHのボンド (bond)で所有者のPINバックオフ (PIN back-off)を7日間に押し上げる (stranger can push the owner’s PIN back-off to 7 days)ことができます。このボンドはアカウントに残ります。第二デバイスを持つ所有者は独自の経路を維持し、キー単独の支払いとエスケープ (escape)は依然として機能します。
-   **可視性とデバイス (Visibility and devices)**。オープンモード (open mode)では、残高、金額、受取人 (balances, amounts and recipients)は公開されます。ルールのみが暗号化されます。[[glossary/ERC-7984|ERC-7984]]トークンを使用したプライベートモードが進行中です。キーとPINが同じブラウザに入力された場合、侵害されたフロントエンド (compromised front end)は両方を取得します。

**未解決の疑問 (Open questions)**

1.  [[glossary/FHEVM|FHEVM]]では、暗号文に対するすべての永続的なパーミッション (persistent permission)が新しいストレージスロット (storage slot)になります。ステート作成が高価になるにつれて、アプリはどのようなパターンを使用すべきでしょうか。一時的または永続的なパーミッション (transient or persistent permissions)、そしてオペレーションごとのレコードではなく再利用可能なレコード (reusable records)でしょうか？
2.  シードレスリカバリー (seedless recovery)はデフォルトでオンであるべきか (seedless recovery be on by default)、またどのような遅延とボンド (bond)を伴うべきでしょうか？
3.  例えば、PINゲート付きオペレーションライフサイクル (PIN-gated operation lifecycle)とエスケープセマンティクス (escape semantics)を持つ[[glossary/ERC-7579|ERC-7579]]モジュールのような標準は価値があるでしょうか？

脅威モデル (threat model)、レート制限ルール (rate-limit rules)、およびボンド (bond)に関するフィードバックを歓迎します。

## リンク

-   コード（MITライセンス）、測定方法、生データ: [github.com/Himess/encrypted-account](https://github.com/Himess/encrypted-account) (`RESULTS.md`, `results/`)
-   [[glossary/Sepolia|Sepolia]]でのライブデモ: [encrypted-account.vercel.app](https://encrypted-account.vercel.app)

*開示: 私は[[glossary/Encrypted-Account|暗号化されたアカウント]]を設計し、AIコーディングアシスタント (AI coding assistants)とともに構築しました。上記の測定値は、リポジトリ内の生データ (raw data in the repository)を指しています。*

*2投稿 - 2参加者*

[全トピックを読む](https://ethresear.ch/t/encrypted-account-a-pin-that-lives-in-the-contract/26265)
