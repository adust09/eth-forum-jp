---
title: 'ハッシュのみのロールアップ: OP Stack L2アカウントをLamport型ハッシュチェーンとして利用、L2内部にECDSAなし'
original_title: >-
  A hash-only rollup: OP Stack L2 accounts as Lamport-style hash chains, no
  ECDSA inside the L2
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/a-hash-only-rollup-op-stack-l2-accounts-as-lamport-style-hash-chains-no-ecdsa-inside-the-l2/26172
author: Hadamard
date: '2026-10-24'
category: Layer 2
tags:
  - layer2
  - rollup
  - scaling
  - cryptography
  - post-quantum
  - security
  - account-abstraction
  - protocol-design
topic_id: '26172'
translated_at: '2026-10-25'
translator: gemini-2.5-flash
---

> [!note] 原文
> [A hash-only rollup: OP Stack L2 accounts as Lamport-style hash chains, no ECDSA inside the L2](https://ethresear.ch/t/a-hash-only-rollup-op-stack-l2-accounts-as-lamport-style-hash-chains-no-ecdsa-inside-the-l2/26172) — Hadamard (2026-10-24)

*開示: 私はこのチェーン上で動作する決済アプリbb84の創設者です。フィードバック、特に批判的なフィードバックは大歓迎です。*

## TL;DR

私たちはイーサリアム[[glossary/mainnet|メインネット]]上でOP Stack [[glossary/Rollup|ロールアップ]]（チェーンID 42069000、2026年9月30日より稼働中）を運用しており、L2トランザクションは**署名を一切含みません**。アカウントはKeccak-256ハッシュチェーンの先端です。支出は次のプリイメージを公開します。コミット・リビールステップは、プリイメージが公開される前に各プリイメージを1つのトランザクションにバインドします。L2内部では、唯一の暗号学的仮定はKeccak-256のプリイメージ耐性であり、これはグローバーのアルゴリズムによって約2^128の作業量に削減されます。これより優れた既知の量子アルゴリズムはありません。ECDSAは依然としてL1境界に現れ、システムには他の信頼性に関する仮定があります（下記にリスト）。

これがイーサリアムL2における[[glossary/Post-Quantum|ポスト量子]]決済のための賢明な暫定設計であるかどうか、そしてどこで破綻するかについて議論したいと思います。

## アカウント

```
s_0        = keccak256("OP_OTA_SPEND_v1" ‖ spend_sk ‖ r)      // per-account secret
s_k        = keccak256(s_{k-1})                                // k = 1..N, N = 1000 by default
C          = s_N                                               // public commitment
address    = trunc20(keccak256("OP_HASH_ADDR_v1" ‖ C))
```

プリデプロイ (`NullifierTree`、0x4200…0042) は、アドレスごとに `lastReveal` (初期値 `C`)、`chainDepth` (初期値 `N`)、および使用済み[[glossary/nullifier|ナリファイア]]のセットを保存します。アカウントはL1デポジットを通じて、または誰かが新しいワンタイムアドレスに支払う際にシステム側の`StealthPool`プリデプロイによって登録されます。

## トランザクション

op-gethに2つの新しい[[glossary/EIP|EIP-2718]]タイプが追加されました。

-   **0x7C HashCommitTx**: `(chainId, from, nonce, hashCommit, gas…, expireAfterBlocks)`
-   **0x7F HashRevealTx**: `(chainId, from, nonce, to, value, gas…, data, nullifier, preImage, viewTag, newCommitment, newChainLength)`

`from`はデポジットトランザクションのように明示的に宣言されます。送信者の*権限*は、ガス購入前に状態遷移でチェックされます。このチェックは`ecrecover`を置き換えます。

```
txDigest   = keccak256(RLP(chainId, from, nonce, to, value, gas, feeCap, tipCap, data,
                           newCommitment, newChainLength))
1. from is registered and chainDepth[from] > 0
2. keccak256(preImage) == lastReveal[from]
3. nullifier == keccak256("OP_NULLIFIER_v1" ‖ preImage ‖ nonce ‖ txDigest)
4. nullifier not spent
5. a matching commitment exists:
   keccak256("OP_COMMIT_BIND_v1" ‖ nullifier ‖ preImage ‖ txDigest ‖ nonce)
```

実行後: `lastReveal ← preImage`、`chainDepth −= 1`、そしてナリファイアは使用済みとしてマークされます。[[glossary/EVM|EVM]]コールが[[glossary/Revert|リバート]]した場合でも、認証は消費されます。Onyxハードフォーク後、状態遷移はすべてのECDSAタイプのトランザクションを即座に拒否します。`eth_call`は引き続き機能します。

**チェーン更新。** チェーンにはN回の使用回数があります。最後のステップ (`chainDepth == 1`) で、リビールは`newCommitment`/`newChainLength`を運ぶことができます。両方とも`txDigest`の一部であるため、コミットメントによってバインドされます。アカウントは同じアドレスで新しいチェーンの下で継続します。このステップを逃すと、アドレスは無効になります。したがって、残りが1つになるまですべてを使い切る際には、ウォレットが慎重に処理する必要があります。

## フロントランニング

`preImage`がブロードキャストされると、誰でもそれを読み取ることができます。保護がない場合、攻撃者は同じプリイメージを異なる`to`を持つトランザクションに入れる可能性があります。コミットステップはこれを防ぐために存在します。ユーザーはまず`hashCommit`を送信し、これにより（プリイメージ、txDigest）を公開せずにバインドし、その後（同じブロック内、または`expireAfterBlocks`、デフォルト5ブロック以内）にのみ公開します。

微妙な点は、コミット自体が認証されていないことです。署名するためのものがないのです。私たちの最初のバージョンは、アドレスのペンディング中のコミットを最新のもので単純に上書きしていました。これは壊れていました。ペンディング中のリビールからプリイメージを読み取った攻撃者が、被害者のコミットを、同じプリイメージを自身の`txDigest`にバインドするコミットに置き換えることができたためです。私たちはこの投稿を書いている最中にこれを発見し、2026年10月21日00:00 UTCに有効になったコンセンサスルールで修正しました。

-   **最初のコミットが勝つ。** 各アドレスには1つのペンディングコミットスロットがあります。アドレスに期限切れでないペンディングコミットが残っている間は、`HashCommitTx`は拒否されます。スロットは、マッチするリビールまたは期限切れ（`expireAfterBlocks`、デフォルト5）によってのみクリアされます。
-   **ウォレットは、自身のコミットがブロックに含まれた後にのみリビールする。** コミットレシートを待ってからリビールをブロードキャストします。それ以降、正直なリビールがスロットを消費するまで、そのアドレスに対する他のコミットは着地できません。
-   **[[glossary/Mempool|Txpool]] (メムプール):** 既存のペンディングコミットにバインドされたコミット/リビールペアは置き換えられません。最初のコミットが勝つルールによって拒否されるコミットは、アドミッション時に拒否されます。
-   **RPC:** パブリックエンドポイントは`eth_`、`net_`、`web3_`メソッドのみを提供し、ペンディングトランザクションフィルターがないため、プールは外部から読み取れません。

残るもの:

-   **グリーフィング（嫌がらせ）であり、盗難ではない。** 誰でもアドレスに対してジャンクコミットを投稿し、最大5ブロック間ブロックすることができます。そのようなコミットは、攻撃者が知らないプリイメージで開くことはできないため、資金を移動させることはできません。これはアドレスごとのレート制限によって制限されます。
-   **悪意のある[[glossary/sequencer|シーケンサー]]によるエッジケース:** 正直なコミットが期限切れになったり、リビールがペンディング中にリorgによって排除されたりした場合、プリイメージはプールを見た誰かに知られ、もはやバインドされなくなります。今日、プールを見ているのは私たちのシーケンサーだけであり、ウォレットは再試行する前にコミットを再確認しますが、プロトコルはそれに依存すべきではありません。
-   **よりクリーンなルール**は、ガイ・フォークス方式のようなものでしょう。コミットメントは1つのスロットに保持されるのではなく追記され、リビールは、そのプリイメージで開く*最も古い*コミットメントがその`txDigest`をバインドする場合にのみ有効です。これにより、グリーフィングベクトルと期限切れのエッジケースは解消されますが、トランザクション形式とウォレットの変更が必要です。私たちはまだこれを構築していません。

## 決済固有の追加機能

-   **ワンタイムアドレス。** 支払い側は、受取人用に新しいアカウントを派生させます。8ビットのビュータグにより、受取人は`StealthPool`アナウンスイベントを安価にスキャンできます。
-   **トークンモデル。** ブリッジされたUSDC/EURCのみが`StealthMintableERC20`インスタンス（ファクトリープリデプロイは0x4200…0045）として利用可能です。ユーザーによるネイティブETHの支出はありません。コミットおよびリビールトランザクションはユーザーにとってガスフリーです。スパムは、Txpool (メムプール) のアドレスごとのレート制限（1分あたり10トランザクション）によって制限されます。
-   **引き出し。** これらは別のメッセージパサー（0x4200…0043）と変更された`OptimismPortal`を通じて行われます。引き出しは出力ルートに対して証明されるため、L2側の認証は再びハッシュリビールとなります。

## これが提供しないもの（正直な限界）

1.  **L1は依然としてECDSAである。** デポジットはL1 [[glossary/EOA|EOA]]から行われ、引き出しはL1アドレスに支払われます。L1上の量子攻撃者はスコープ外です。
2.  **まだ[[glossary/ZK-Fraud-Proof|不正証明]]がない。** 出力ルートは、パーミッションドなプロポーザーによって、即座に解決されるカスタム紛争ゲームタイプを通じて投稿されます。証明システムがないため、L2BEATのフレームワークではステージ0にも達しません。したがって、引き出しはプロポーザーを信頼します。マーチャントの高速引き出し（7日ではなく2時間）は、さらにレジストリオペレーターを信頼します。
3.  **中央集権型[[glossary/sequencer|シーケンサー]]** であり、当社が運用しています。
4.  **160ビットアドレス。** 切り捨てにより、アドレス単独では約2^80の量子セカンドプリイメージ耐性が残ります。登録は先着順であり、攻撃者がそのようなプリイメージでできることは限られていますが、チェーン自体の2^128よりも弱いです。
5.  **[[glossary/Stateful-Keys|ステートフルキー]]。** プリイメージを再利用するユーザーは二重支払いできません。なぜなら、ナリファイアとチェーンステップがそれを防ぐからです。しかし、自身の位置を見失ったウォレットは、チェーンの状態から再同期するまでロックアウトされる可能性があります。これはプロダクション環境で実際に発生しました（アプリの状態とチェーン間の同期ずれ）。そのため、ウォレット側の再同期は必須です。

## コミュニティへの質問

-   短い期限付きの「最初のコミットが勝つ」ルールは、リオーダーまたはリorgできるシーケンサーの下で健全でしょうか？悪意のあるシーケンサーは常に検閲できますが、どのような条件下で（例えば、正直なコミットが期限切れになるのを許し、そのリビールを保留することで）*盗む*ことができるでしょうか？追記専用のガイ・フォークス方式は、余分なステートに見合う価値があるでしょうか？
-   署名なしでコミットステップを認証する、よりクリーンな方法はありますか？例えば、コミットメント専用の2番目の短いハッシュチェーンなど。
-   ハッシュチェーンアカウントは、専用チェーンとしてではなく、汎用L2上で[[glossary/EIP-7702|EIP-7702]]スタイルまたはネイティブ[[glossary/Account-Abstraction|AA]]検証モードとして意味があるでしょうか？
-   [[glossary/ZK-Fraud-Proof|不正証明]]: 状態遷移はKeccakチェックとストレージ書き込みを追加するだけなので、Cannon/asteriscを変更せずに証明可能であるはずです。`op-program`をカスタムトランザクションタイプで拡張した人はいますか？

完全な状態遷移ルールを含むより長い論文がarXivで準備中です。ここにリンクを掲載します。開発者向けドキュメントは[BB84 Developer Docs — Hash-Only L2](https://bb84.com/docs)に、アプリは[https://bb84.com](https://bb84.com)にあります。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/a-hash-only-rollup-op-stack-l2-accounts-as-lamport-style-hash-chains-no-ecdsa-inside-the-l2/26172)
