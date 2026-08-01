---
title: オンチェーンIDの耐量子移行：アンカーされた鍵バインディングとカットオフ、再計算による検証（セカンドシグネチャではない）
original_title: >-
  Post-quantum migration for on-chain identity: an anchored key-binding + a
  cutoff, verified by recompute (not a second signature)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/post-quantum-migration-for-on-chain-identity-an-anchored-key-binding-a-cutoff-verified-by-recompute-not-a-second-signature/29225
author: TMerlini
date: '2026-07-31'
category: ERCs
tags:
  - ercs
  - cryptography
  - post-quantum
  - security
  - protocol-design
  - identity
  - signatures
  - research
topic_id: '29225'
translated_at: '2026-08-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Post-quantum migration for on-chain identity: an anchored key-binding + a cutoff, verified by recompute (not a second signature)](https://ethereum-magicians.org/t/post-quantum-migration-for-on-chain-identity-an-anchored-key-binding-a-cutoff-verified-by-recompute-not-a-second-signature/29225) — TMerlini (2026-07-31)

私たちが構築してきたアプローチを共有し、精査を求めたい。これは、オンチェーンID (on-chain identity) / エージェントID (agent-identity) の**署名層 (signature layer)** を[[glossary/Post-Quantum|ポスト量子 (PQ)]]へ移行するという、狭いながらも現実的な問題に対処することを目的としており、信頼ではなく再計算に依拠している。

**問題点。** Shorのアルゴリズムは、Web3のほとんどとほとんどのAIアテステーションID (AI-attestation identity) におけるECDSA (楕円曲線デジタル署名アルゴリズム) / Schnorr署名を破る。ハッシュは生き残る（Groverのアルゴリズムはそれらを半分にするだけだ）。通常の反射的な対応である「古典的な署名と並行して[[glossary/Post-Quantum|ポスト量子 (PQ)]]署名を追加する」だけでは、実際には問題を解決できない。古典的な鍵を導出した偽造者は、追加の署名を*省略する*だけだからだ。セカンドシグネチャは検証者側からのオプトインであり、偽造者はオプトアウトする。

**アプローチ。** 追加するのではなく、バインドする。いかなる破綻の前に、「この古典的な鍵 → この[[glossary/Post-Quantum|ポスト量子 (PQ)]]鍵」という**アンカーされた鍵バインディング (anchored key-binding)** を公開し、**消費者カットオフ (cutoff)** を強制する：

-   カットオフ (cutoff) **前にアンカーされたと証明された**アクションは、古典的署名のみを許容する（過去のカタログが遡って無効化されることはない）。
-   カットオフ (cutoff) **時または後に**アンカーされたアクションは、**そのアクションのアンカータイム (anchor time) に有効な**バインディングの下で有効な[[glossary/Post-Quantum|ポスト量子 (PQ)]]コンパニオンを携行しなければならず、そうでなければ拒否される。

偽造者の省略は、これで*閉じて失敗する*。カットオフ (cutoff) 後は、「有効なコンパニオンがない」ことは拒否であり、無視ではない。

![スクリーンショット 2026-07-31 23.54.49](https://ethereum-magicians.org/uploads/default/original/3X/b/0/b0fa6e43557072b36c3e97582d0148f326a45608.png "スクリーンショット 2026-07-31 23.54.49")

**なぜ署名時間ではなくアンカータイム (anchor time) なのか。** 権限はアクションの[[glossary/On-chain-Anchor|オンチェーンアンカー]]時間によって判断され、主張された署名がいつ作成されたかによって判断されることはない。侵害された鍵は署名を遡及して作成できるが、[[glossary/On-chain-Anchor|オンチェーンアンカー]]を遡及して作成することはできない。信頼できる量は、オペレーターが事後に変更できないものだ。

**なぜ信頼ではなく再計算なのか。** すべてのバインディングはコンテンツアドレス指定されており、**ブラウザで公開データから再導出可能**だ。古典的な所有証明は[[glossary/On-chain-Anchor|オンチェーンアンカー]]トランザクション自体（古典的な鍵によって送信される）であるため、オンチェーンレコードは証明そのものであり、偽造を回避するためのセカンドシグネチャではない。ここにはサーバーを信頼するよう求めるものは何もない。あなたはそれを再実行する。

**稼働中のもの（2つの実装、2つのNISTファミリー）。** プロファイル `pq_key_binding.v0` は、正規化のみによってバイト互換のコンテンツアドレスに収束する2つの独立した実装によってサポートされている。具体的には、**ML-DSA-65** (FIPS 204、格子) と**SLH-DSA-SHA2-192s** (FIPS 205、ハッシュベース) だ。`{algorithm}` はフィールドであり、[[glossary/fork|フォーク]]ではない。

![スクリーンショット 2026-07-31 23.55.01](https://ethereum-magicians.org/uploads/default/original/3X/f/5/f54f854cce7433942807d9ffc8c885b838cccc8c.png "スクリーンショット 2026-07-31 23.55.01")

2つのファミリーを選択するのは、回復力のためのヘッジであり、装飾ではない。2026年、Anthropicによる暗号解析 (cryptanalysis) は、HAWK-256の推定鍵回復コストを2^64から2^38に削減した。HAWK提出チームはその後、NISTの追加署名プロセスからそれを撤回した（2023年のオンランプ以来、そのプロセスにあった）。*参照：[Anthropic research](https://www.anthropic.com/research/discovering-cryptographic-weaknesses) · 撤回は[NISTのラウンド3追加署名ページ](https://csrc.nist.gov/projects/pqc-dig-sig/round-3-additional-signatures)に逐語的に記載されている（「HAWK提出チームはHAWKを撤回した…」）。*

スコープは重要であり、結果が最終化された標準に達しない2つの独立した理由から、それは**構造的**である。HAWKはFalconの系統のハッシュ・アンド・サイン方式で、**格子同型問題 (Lattice Isomorphism Problem)** に基づいて構築されており、*n*/2+1削減はそのLIP構造を具体的に通る。[[glossary/ML-DSA|ML-DSA]]は**MLWE/MSIS上のFiat-Shamir**であり、*異なる問題*と*異なる構成*である。HAWKは候補であり、どこにも展開されていなかった。最終化されたFIPS標準である**ML-KEM、[[glossary/ML-DSA|ML-DSA]]、[[glossary/SLH-DSA-SHA2-192s|SLH-DSA]]** は手つかずである。私たちが構築する教訓は構造的だ。最終化された標準と、異なる暗号学的ファミリーのセカンドスキームを組み合わせる。格子構造に特異的に依存する暗号解析 (cryptanalysis) による破綻は、ハッシュベースのレーンに直接転送されない。[[glossary/SLH-DSA-SHA2-192s|SLH-DSA]]は異なるセキュリティ仮定に基づいているため、一方のファミリーが弱体化しても他方が無効になる必要はない。独立してアンカーされた再計算記録は検証に引き続き利用可能だ。

両方のバインディングは、2つの異なる起源からブラウザ内でコールド再計算される。カットオフ (cutoff) 強制者は移行ルールを実行し、一連のピン留めされた適合性ベクトル (conformance vectors) を再現する。証拠クラスに関する正直な注記：[[glossary/ML-DSA|ML-DSA]]側は2つの独立した検証者だが、[[glossary/SLH-DSA-SHA2-192s|SLH-DSA]]側は単一の実装（両方のパネルが同じ `@noble/post-quantum` を提供する）であるため、同じコードによって2回検証される。これをグリーンに偽装するのではなく、独立したレビューアの常設 `UNVERIFIABLE` 判定により、単一実装であることが明確に保たれる。3つのパーティであり、レーンごとの独立性は正直に述べられており、4つと主張されているわけではない。エージェントごとの鍵はエポックアンカーされており、すべてのアクションでコンパニオンに署名する。アンカータイム (anchor time) カットオフ (cutoff) 強制者は現在**シャドウ (shadow)** 状態で、判定を記録するが、コンパニオンカバレッジが証明されるまではまだ拒否しない。

**リカバリー、進行中の次の層（精査歓迎）。** 成熟度については明確にする。なぜなら、2つの半分は同じ段階ではないからだ。上記の `pq_key_binding.v0` は稼働中で、マルチ実装であり、コールド検証されている。以下のリカバリー層は実行可能な参照モデルであり、適合性ベクトル (conformance vectors) を介して実行可能でブラインド差分可能だが、まだライブ接続されていない。具体的には、エージェントごとの鍵の**ローテーションと失効プリミティブは、私たちのゲートウェイにデプロイされている**（所有者承認済み、アンカータイム (anchor time) 解決済み）。その上に、監査者が*どのような種類の*トランジションが発生したかを判断できる**リカバリークラス分類**は、`agent_terminal` と `seed_epoch_rotation` の実装前段階で指定され、ベクトル化されている。これらのクラスがすでにリリースされていると読まないでほしい。

鍵バインディングスキームは、監査者がどのような種類の権限移行が発生したかを独立して判断できる場合にのみ、単一のインシデントを超えて存続できる。私たちは、サードパーティが再計算する**反証可能なクレーム**として3つのアンカーされたクラスを指定する。それぞれは宣言されたクラスに対してのみ判断され、その述語に失敗したレコードは `rejected` となり、隣接するものとして静かに再ラベル付けされることはない。

![スクリーンショット 2026-07-31 23.55.16](https://ethereum-magicians.org/uploads/default/original/3X/b/a/ba81b9c3d1d71411b271b1d9fd3da94961b0f2fd.png "スクリーンショット 2026-07-31 23.55.16")

アーティファクトを管理する鍵は、アーティファクトの**アンカータイム (anchor time)** によって解決され、同じルールがローテーションと失効を、遡及的ではなく前方的に適用する。

![スクリーンショット 2026-07-31 23.55.18](https://ethereum-magicians.org/uploads/default/original/3X/1/d/1db2bca796f27ba603961ffa81f9ba5ebf50bed6.png "スクリーンショット 2026-07-31 23.55.18")

最も困難な2つの点と、それらをどのように解決したか：

**(1) ターミナル/キルステートメントは、単に現在の不在を記述するだけでなく、*将来のバインディングを禁止*しなければならない。** したがって、ターミナル性は恒常的なバインディングパス制約（閉じて失敗する）であり、意図によって分割される。意図的なリタイアメントは絶対的であり、防御的なインシデントキルは、有効なフリートシードローテーションによってのみ解除可能であり、エージェントごとのパスによっては解除できない。さもなければ、侵害された鍵が自己を復活させる可能性がある。

![スクリーンショット 2026-07-31 23.55.44](https://ethereum-magicians.org/uploads/default/original/3X/b/6/b690a2ab37ba8853cd3a23aa501ce5d22180772e.png "スクリーンショット 2026-07-31 23.55.44")

**(2) 侵害された*ルート*シークレットを置き換える権限は、そのシークレットに還元されてはならない。** フリートシードローテーションは、古典的なデプロイヤーキー (deployer key) にアンカーされており、それ自身のトランザクション（分離可能な署名ではない）によって証明される。デプロイヤーキー (deployer key) の侵害は、明示的にスコープ外とされている。アンカータイム (anchor time) が署名時間よりも優先されるのと同じ形だ。何かを元に戻す権限は、元に戻されるものに還元されてはならない。

**正直な境界、事前に明記。** フリートシードリカバリーは、このプロファイルが完全に公開再計算可能ではない唯一の場所だ。新しい鍵は秘密のシードから派生するため、サードパーティはそれらを再導出できない。公開保証はデプロイヤー承認（[[glossary/On-chain-Anchor|オンチェーンアンカー]]トランザクションはデプロイヤーキー (deployer key) によって送信される）と、新しい鍵のアンカーされたMerkleルート (Merkle root) である。派生自体はオペレーターによってアテステーションされる。これは意図的なものであり、私たちがまだ解決していないギャップではない。コミット・アンド・リビールは適用されない（シードはすべての鍵にとって*恒常的な*秘密であるため、正直さを証明するためにそれを開示するとすべての秘密鍵が漏洩する）。したがって、正確に2つのオプションが残る。オペレーターアテステーション（v0、ここ）またはシードを明らかにしない正しい派生の[[glossary/Zero-Knowledge-Proof|ZK証明]]（v1+）。リカバリーが公開再計算可能ではないにもかかわらず、そうであると示唆するのではなく、明確に述べている。

**リンク（すべて再計算可能）：**

-   ライブのデュアルファミリーバインディング、ブラウザで再計算：[https://ai.verticecriativo.pt/quantum](https://ai.verticecriativo.pt/quantum)
-   カットオフ (cutoff) 強制者 + セルフテスト（ライブゲートウェイ）：[https://gateway.ensub.org/pq/enforce/selftest](https://gateway.ensub.org/pq/enforce/selftest)
-   適合性ベクトル (conformance vectors)（中立リポジトリ）：`pq_key_binding.v0`: [https://github.com/trustless-ai/recompute-kit/tree/main/conformance/pq-key-binding-v0](https://github.com/trustless-ai/recompute-kit/tree/main/conformance/pq-key-binding-v0) · リカバリークラス: [https://github.com/trustless-ai/recompute-kit/tree/main/conformance/pq-recovery-classes-v0](https://github.com/trustless-ai/recompute-kit/tree/main/conformance/pq-recovery-classes-v0)

「量子耐性 (quantum-proof)」を主張しているわけではない。主張は正確だ。再計算層はハッシュ（生き残るプリミティブ）に依拠しており、署名層は、あなたが自分で検証できるバインディングとカットオフ (cutoff) によって移行する。カットオフ (cutoff) のセマンティクス、アンカータイム (anchor time) の選択、特にリカバリー/権限モデルに関するフィードバックを大歓迎する。（これは、エージェントID (agent-identity) ファミリーにおける[[glossary/ERC|ERC（Ethereum Request for Comments）]]の可能性に先立つ議論として共有されており、精査とリカバリー実装が保留されているため、提出は延期されている。）

**共同執筆者**：[@TMerlini](https://ethereum-magicians.org/u/tmerlini) / vertice.eth （[[glossary/SLH-DSA-SHA2-192s|SLH-DSA]]アテスターレーン、ライブゲートウェイ強制、エージェントごと+リカバリー層、参照実装）、[@babyblueviper1](https://ethereum-magicians.org/u/babyblueviper1) （[[glossary/ML-DSA|ML-DSA]]実装+検証者、ブラインド差分）、[@pipavlo82](https://ethereum-magicians.org/u/pipavlo82) （失敗クラス+権限ドメイン設計、適合性ベクトル (conformance vectors)）、および[@blockbird](https://ethereum-magicians.org/u/blockbird) （独立検証、常設 `UNVERIFIABLE` レーン、仕様調査結果、[[glossary/On-chain-Anchor|オンチェーンアンカー]]デコード）。

*1件の投稿 - 1名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/post-quantum-migration-for-on-chain-identity-an-anchored-key-binding-a-cutoff-verified-by-recompute-not-a-second-signature/29225)
