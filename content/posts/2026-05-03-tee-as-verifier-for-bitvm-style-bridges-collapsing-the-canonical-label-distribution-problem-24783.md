---
title: BitVMスタイルのブリッジにおける検証者としてのTEE：カノニカルラベル配布問題の解消
original_title: >-
  TEE-as-Verifier for BitVM-style bridges: collapsing the canonical-label
  distribution problem
source_url: >-
  https://ethresear.ch/t/tee-as-verifier-for-bitvm-style-bridges-collapsing-the-canonical-label-distribution-problem/24783
author: arturr55
date: '2026-05-03'
category: Cryptography
tags:
  - cryptography
  - bitvm
  - tee
  - bridges
  - security
topic_id: '24783'
translated_at: '2026-05-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [TEE-as-Verifier for BitVM-style bridges: collapsing the canonical-label distribution problem](https://ethresear.ch/t/tee-as-verifier-for-bitvm-style-bridges-collapsing-the-canonical-label-distribution-problem/24783) — arturr55 (2026-05-03)

BitVMスタイルのブリッジにおける検証者としてのTEE：カノニカルラベル配布問題の解消

背景。私たちはBitVMクラスのブリッジを持つBTC [[glossary/Rollup|L2（レイヤー2）]]であるStaxを構築しています。二重署名（equivocation）のみの保護は2026年4月23日からsignetで稼働しており、現在フェーズ3の固定された嘘（fixed-lie）に対する防御を設計しています。設計検討中に、あるフレームワークにたどり着きました。もしこれが精査に耐えられれば、オンチェーンの仕組み（強制開示Taprootリーフ、Σ-応答、ラベル配布チャネル）全体を不要にすることができます。コミットする前に、§6の7つの質問について暗号学者のレビューを求めています。

この投稿では、問題、フレームワークの転換、そしてセカンドオピニオンを求める7つの質問を要約します。完全な設計ドキュメントは最後にリンクされています。

1.  標準的なBitVMクラスのブリッジモデルにおける問題
    標準的なBitVMスタイルの引き出しフロー：
    オペレーターは、引き出し時の[[glossary/Rollup|L2]]状態を主張するAssertTxを公開し、Lamportのプリイメージをビットごとに開示します。
    CSVタイマー。
    ウォッチタワーは、CSVウィンドウ中にDisprovalTxを公開して保証金を没収できます。ここで重要な攻撃カテゴリは2つあります。
    (a) 二重署名（equivocation） — オペレーターが同じLamport位置で矛盾するビットを持つ2つのAssertTxを公開する。
    (b) 固定された嘘（fixed-lie） — オペレーターが主張する状態がカノニカルな[[glossary/Rollup|L2]]履歴と一致しないAssertTxを1つ公開する。
    二重署名（equivocation）は単純であり、BitVM2 / Citrea / Bitlayerが今日出荷しているものです。ある位置で矛盾する2つの開示があれば、ウォッチタワーは両方のLamportプリイメージを得て、保証金を没収できます。
    固定された嘘（fixed-lie）は未解決の問題です。デプロイされているBitVMクラスのブリッジには、これに対するオンチェーンでの反証パスがありません。標準的な仮定は「オペレーターがAssertTxを1つだけ公開し、それが嘘である場合、オフチェーンの仕組み（アラート、ソーシャル）が対処する」というものです。この投稿は、そのギャップを埋めることを目的としています。素朴なデポジット時鍵ペアフローでは、以下のようになります。
    ```
    s_i^b = SHA256("op-secret" || withdrawal_id || i || b)
    ```
    つまり、オペレーターは自身のLamportプリイメージを生成します。彼らはすべてのビット位置で両方のプリイメージを知っています。したがって、彼らは真実であろうと嘘であろうと、任意のビットパターンを主張するAssertTxを構築でき、スクリプト検証者はそれを受け入れます。オンチェーンの仕組みは、カノニカルなビットが何であるべきかについて独立した参照を持っていません。
    リーフの強制に関する既存の文献（例：オペレーターを公開されたカノニカルワイヤラベルテーブルに拘束するΣプロトコルスタイルのチャレンジ・レスポンスリーフ）はすべて、カノニカルラベルがオペレーターの外部から来ると仮定しています。標準的な提案は、マルチパーティDKGセレモニーまたはトラステッドセットアップです。私たちの分析では、検討したオンチェーンでの強制バリアント（公開鍵の拡張、別のRevealTx、CSVゲート付きの反対プリイメージ）のいずれも、その外部ラベルジェネレーターなしでは問題を解決しないことがわかりました。これについては別の設計ドキュメントに記録しました。 [forcing\_mechanism\_design.md](https://github.com/staxnetwork/research/blob/main/docs/forcing_mechanism_design.md)の§10.6を参照してください。
    したがって、問題は「カノニカルラベルはどこから来るのか、そして誰がそれらを見ることができるのか？」となります。

2.  ラベルジェネレーターとしての[[glossary/TEE|TEE（Trusted Execution Environment）]]の2つのフレームワーク
    私たちは、ソロチームでの実現可能性の理由から、マルチパーティセレモニーではなく[[glossary/TEE|TEE]]（デフォルトプラットフォームはAWS Nitro Enclaves）を選択しました。一度[[glossary/TEE|TEE]]にコミットすると、2つのAPI設計が可能です。APIの選択がオンチェーンのフットプリント全体を決定します。

2.1 ガブラーとしての[[glossary/TEE|TEE]]（私たちが最初に始めたフレームワーク）
    ```
    TEE.generate_circuit(vk) → (commitment_C, label_table T = {(L_i^0, L_i^1)})
    TEE.attest() → AttestedCommitment(C, code_hash, public_seed, …)
    ```
    ラベルはどこかへ流れる必要があります。ウォッチタワーへ、そうすれば彼らは嘘のAssertTxを検出したときに強制開示Taprootリーフを使用できます。これは難しいサブ問題を引き起こします。オペレーターに漏らすことなく、どのようにラベルをウォッチタワーに配布するのでしょうか？パーミッションレスなウォッチタワーセットでは、誰でもウォッチタワーを運用できるため、誰でもラベルを保持できます。これには、ソックパペットウォッチタワーを介したオペレーターも含まれます。これに対するクリーンな答えはありません。
    ガブラーとしての[[glossary/TEE|TEE]]の下では、Taprootツリー内の強制開示リーフ、AssertTxのwitnessにおけるΣ応答生成、それらのリーフを使用するウォッチタワーの紛争コード、ビーコンの配管、そしてラベル配布チャネル自体も必要です。これは [forcing\_mechanism\_design.md](https://github.com/staxnetwork/research/blob/main/docs/forcing_mechanism_design.md)のマイルストーンBとCの大部分を占めます。

2.2 検証者としての[[glossary/TEE|TEE]]（私たちが提案しているフレームワーク）
    ```
    TEE.generate_keypair_for_withdrawal(withdrawal_id)-> Lamport pubkey (47 KB), attestation
    TEE.release_preimages(withdrawal_id, claimed_state s, claimed_proof π)
    → { s_i^{bit_i(public_inputs(s))} } if Groth16Verify(vk, ., π) is VALID
    → error “INVALID” otherwise
    ```
    [[glossary/TEE|TEE]]はガブラーでもあり検証者でもあります。オペレーターの唯一のAPIは「この証明を検証し、その公開入力のプリイメージを私に与えてください」です。
    重要な点：
    *   [[glossary/TEE|TEE]]はビット位置ごとに1つのプリイメージのみをリリースします。これは、主張された状態の公開入力のビット値と一致するものです。
    *   [[glossary/TEE|TEE]]は、いかなる位置においても**他の**プリイメージをエクスポートしません。
    *   [[glossary/TEE|TEE]]は、決してアサートされなかった状態に紐付けられたプリイメージをエクスポートしません。

    固定された嘘（fixed-lie）攻撃は以下に帰着します。

    | パス | 何が起こるか |
    | :--- | :--- |
    | A: オペレーターが (state\_lie, garbage\_proof) を提出 | [[glossary/TEE|TEE]] Groth16Verify → INVALID → 拒否 → オペレーターはプリイメージを持たない |
    | B: オペレーターが (state\_truthful, valid\_proof) を提出 | [[glossary/TEE|TEE]]が真実のプリイメージを返す → AssertTxは真実をアサートし、嘘は発生しない |
    | C: オペレーターが state\_lie のGroth16証明を偽造 | Groth16の健全性に帰着 — [[glossary/Rollup|L2]]が既に信頼しているのと同じ仮定 |

    そもそも嘘がBitcoinに到達できません。オンチェーンで強制リーフを介して捕捉し、没収するものはありません。

2.3 オンチェーンで不要になるもの

    | コンポーネント | ガブラーとしての[[glossary/TEE|TEE]] | 検証者としての[[glossary/TEE|TEE]] |
    | :--- | :--- | :--- |
    | 強制開示Taprootリーフ | 必要 | 削除 |
    | AssertTx Σ応答 | 必要 | 削除 |
    | ウォッチタワー強制開示紛争者 | 必要 | 削除 |
    | カノニカルラベル配布チャネル | 必要（未解決問題） | 削除 |
    | 我々のΣプロトコルバリアントのためのビーコン配管 | 必要 | 削除 |
    | 二重署名Lamportリーフ | 変更なし | 変更なし |
    | [[glossary/TEE|TEE]]アテステーションインフラ | 必要 | 必要 |
    | ブリッジコントラクトへのGarblerAttestation登録 | 必要 | 必要 |

    検証者としての[[glossary/TEE|TEE]]の下でのウォッチタワーは、[[glossary/TEE|TEE]]アテステーションダイジェストの一致、AssertTx検出、二重署名（equivocation）検出（既存）、および残りの[[glossary/TEE|TEE]]侵害・二重署名なしシナリオのためのオフチェーンアラートパスのみを必要とします。

3.  検証者としての[[glossary/TEE|TEE]]の下で強制開示リーフが痕跡的であると考える理由
    元のΣプロトコル設計からの強制開示リーフを保持したとしても（[phase3\_tee\_secrecy.md](https://www.staxnetwork.com/research/docs/phase3_tee_secrecy.md) §3.1参照）、[[glossary/TEE|TEE]]侵害・二重署名なしシナリオでは、ウォッチタワーはそれらを使用できません。リーフスクリプトは以下の通りです。
    ```
    OP_SHA256 <expected_hash[i]> OP_EQUALVERIFY OP_TRUE
    ```
    使用するためには、ウォッチタワーは`expected_hash[i]`のプリイメージを必要とします。[[glossary/TEE|TEE]]モデルでは、プリイメージは[[glossary/TEE|TEE]]内部にあります。ウォッチタワーはそれらを決して持っていません。リーフは、[[glossary/TEE|TEE]]と、[[glossary/TEE|TEE]]がプリイメージをリリースした相手（オペレーター）以外のいかなる当事者も使用できません。
    [forcing\_mechanism\_design.md](https://github.com/staxnetwork/research/blob/main/docs/forcing_mechanism_design.md) §10.6に記録されている延期理由と同じ結果ですが、アクターが異なります。リーフを保持するための多層防御の議論は成り立ちません。なぜなら、プリイメージを持つアクターは両方のシナリオで同じアクター（[[glossary/TEE|TEE]]に提出した者）だからです。

4.  信頼性に関する声明、正直に
    検証者としての[[glossary/TEE|TEE]]ガブラーを使用するフェーズ3のStaxブリッジは以下を信頼します。
    (a) Bitcoinの正直な多数派、(b) [[glossary/Data-Availability|Celestia DA（データアベイラビリティ）]]（オペレーターによるデータ隠蔽は2026-04-22以降閉鎖）、(c) 二重署名（equivocation）検出のための1つ以上の正直なウォッチタワー、(d) 固定された嘘（fixed-lie）防御のためのGroth16の健全性、(e) [[glossary/TEE|TEE]]ベンダーのアテステーションチェーン（デフォルトはAWS Nitro; マルチベンダー間の相互アテステーションはフェーズ3.2cに延期）。
    仮定(e)は、BitVM2のN-of-Nセレモニーよりも厳密に弱いです。私たちはソロチームでのメインネット実現可能性のためにこれを受け入れますが、セレモニーが実現可能になったメインネット後にこれを廃止する明確な意図を持っています。

5.  多層防御のフォールバック（§3に異議を唱える場合）
    もしレビュアーが「構築時における固定された嘘（fixed-lie）」が十分な防御ではないと考える場合、フォールバックとして、強制開示リーフを**保持し**、かつ、アテステーションされたサイドチャネル（ウォッチタワーごとの鍵で[[glossary/TEE|TEE]]暗号化され、[[glossary/Data-Availability|Celestia DA]]を介して公開される）を介してカノニカルラベルをウォッチタワーに配布します。
    コスト：約85 KBの公開鍵、AssertTxのwitnessにおけるΣ応答（約3-5 KB）、カットアンドチョイスチャレンジ位置ごとの追加のTaprootリーフ（望ましい健全性のためにcを選択。c=64の場合、検出されない嘘の確率は約1/2^64）、完全なΣプロトコル紛争者 + ラベル配布チャネルの実装、さらにウォッチタワー鍵レジストリ。
    私たちは、誰でもウォッチタワーを運用できるということは、誰でもラベルを保持できるということであり、それはソックパペットを介したオペレーターがラベルを所有するという問題に逆戻りするため、これはクリーンに構成されないと主張しますが、この反論に異議を唱えてほしいです。

6.  暗号学者の意見を求める未解決の質問
    これらは実装コミット前のブロッカーです。アテステーションインフラ（どちらのフレームワークでも正しい）以外のフェーズ3.2bコードはまだ着手していません。

    **Q1 — 唯一の固定された嘘（fixed-lie）防御としてのGroth16の健全性。** [[glossary/TEE|TEE]]の下での固定された嘘（fixed-lie）防御を「Groth16の健全性 + [[glossary/TEE|TEE]]アテステーションの完全性」に帰着させることは、メインネットブリッジとして許容できますか？Zcash SaplingとFilecoinはどちらも、数十億ドル規模の価値を保持する本番デプロイメントでGroth16の健全性に依存しており、この仮定は継続的な精査に耐えてきました。私たちは新しい暗号学的仮定を導入しているわけではありません。アサーションがオンチェーンのBitcoinであり、オンチェーンのEthereumではないブリッジのコンテキストで、これが確認されることを望んでいます。

    **Q2 — 二重署名（equivocation）防止のための[[glossary/TEE|TEE]]のステートフル性。** [[glossary/TEE|TEE]]は内部的に「withdrawal\_id Xに対してビットパターンPでプリイメージを既にリリースした」と追跡し、同じ引き出しに対して2番目のパターンをリリースすることを拒否すべきでしょうか？もしそうであれば、これは検出ではなく二重署名（equivocation）の防止であり、二重署名Lamportリーフは完全に非推奨にできます。これによりフェーズ3は「[[glossary/TEE|TEE]]がアテステーションする、それだけ」に集約されます。コスト：[[glossary/TEE|TEE]]は状態を永続的に保持する必要があります（Nitro [[glossary/KMS|KMS（Key Management Service）]]またはAMD SEV-SNP相当）。複数の[[glossary/TEE|TEE]]インスタンス間での競合状態の処理が必要です（Q4参照）。

    **Q3 — [[glossary/TEE|TEE]]からオペレーターへのチャネル暗号化。** [[glossary/TEE|TEE]]がプリイメージを返す際、オペレーターへのチャネルは暗号化されている必要があります（そうしないと、受動的な盗聴者がAssertTxを公開する能力を得ます）。標準的な答え：エンクレーブによってアテステーションされた[[glossary/TLS|TLS（Transport Layer Security）]] — エンクレーブ内で生成されるエフェメラル鍵ペア、アテステーションドキュメントが[[glossary/TLS|TLS]]公開鍵をcode\_hashにバインドし、オペレーターは証明を送信する前にアテステーションを認証します。BitVMコンテキストに特有の微妙な点で見落としているものはありますか？例えば、[[glossary/TEE|TEE]]再起動時のセッションリプレイ、[[glossary/TEE|TEE]]アップグレード時の鍵ローテーション、どのセッションがどのプリイメージを受け取ったかについて嘘をつくオペレーターなど。

    **Q4 — 活性のための[[glossary/TEE|TEE]]レプリケーション。** 単一の[[glossary/TEE|TEE]]はブリッジの活性にとって[[glossary/SPOF|SPOF（単一障害点）]]です。複数の[[glossary/TEE|TEE]]インスタンス（同じcode\_hash、同じmaster\_seed）は、矛盾する状態のプリイメージをリリースしないように調整プロトコルを必要とします。「N個の[[glossary/TEE|TEE]]にわたる決定論的マスターシード + インスタンスごとの状態ログ + 最初に応答したものを採用」は安全か、それとも攻撃者が悪用できる競合状態を開くか？具体的には、インスタンスAが時刻tに状態Pのプリイメージをリリースし、インスタンスBが時刻t+εに状態P’（P’ ≠ P）のプリイメージをリリースした場合、Aの状態ログが複製される前に、オペレーターは一部のビット位置で両方の半分を受け取ってしまったことになるか？

    **Q5 — アクティブなデポジットを伴う[[glossary/TEE|TEE]]アップグレード。** 新しいガブラーバイナリ（異なるcode\_hash）を出荷した場合、古い公開鍵にコミットされた既存のデポジットは、(a) 古い[[glossary/TEE|TEE]]バイナリが無期限に運用可能であり続けるか、または (b) 移行パス（例：協力的な返金フロー、その後新しいcode\_hashで再デポジット）を出荷しない限り、動かせなくなります。(a)は6〜12ヶ月のデポジットライフタイムにとって許容できますか？(b)は「所有者トリガーの移行ウィンドウ」よりもクリーンなメカニズムを持っていますか？

    **Q6 — 引き出しごと vs バッチごとのアテステーション頻度。** オンチェーンのアテステーションダイジェストは (code\_hash, public\_seed, output\_hash) をカバーします。もしoutput\_hashが1つの引き出しに対する公開鍵コミットメントである場合、すべての引き出しは独自のオンチェーンダイジェスト登録を必要とし、これは大規模になると高価になります。バッチごとだと集約されますが、粒度が失われます。エポックごとが最も安価ですが、どのアテステーションにどの引き出しが含まれるかという疑問が生じます。ここでの適切な粒度は何であり、間違った場合の障害モードは何ですか？

    **Q7 — 強制開示リーフは役に立つのか？** この投稿の§3では、ウォッチタワーがラベルを所有するということは、ソックパペットを介したオペレーターがラベルを所有するということになるため（パーミッションレスなウォッチタワーセットでは）、役に立たないと主張しています。もし、オフチェーンアラート + アテステーション失効では提供されない、強制開示リーフが非自明な多層防御を提供する脅威モデルを構築できるのであれば、ぜひお聞かせください。それは私たちを§5のフォールバックに移行させるでしょう。

7.  私たちが求めているもの
    完全な監査ではありません（それは後でTier 4の費用です）。現時点では、以下を求めています。
    *   Q1に関する現実的な確認 — §4の信頼性に関する声明は正直か、それとも何かを曖昧にしているか？
    *   Q2に関するセカンドオピニオン — [[glossary/TEE|TEE]]のステートフル性は本当に二重署名（equivocation）検出を包含するか、それとも[[glossary/TEE|TEE]]の状態破損/ロールバックというエッジケースが問題を再燃させるか？
    *   Q4 / Q5に関するAWS Nitro Enclavesの実践経験を持つ方 — 設計ドキュメントには現れないが、本番環境で問題となることは何か？

    もし回答が満場一致で「これで問題ない」と返ってきた場合、約1週間でフェーズ3.2bを出荷します。もし質問のいずれかが穴を露呈した場合、§5のフォールバックを行うか、再設計します。

8.  リンク
    この投稿が要約している完全な設計ドキュメント：[docs/phase3\_tee\_secrecy.md](https://github.com/staxnetwork/research/blob/bffcb9cf661c745f6ad15bb8a0eca923e4c7e197/docs/phase3_tee_secrecy.md)（約530行）
    関連：[docs/phase3\_tee\_design.md](https://github.com/staxnetwork/research/blob/bffcb9cf661c745f6ad15bb8a0eca923e4c7e197/docs/phase3_tee_design.md)（[[glossary/TEE|TEE]]プラットフォームの選択、脅威モデル）
    元の問題提起：[docs/forcing\_mechanism\_design.md](https://github.com/staxnetwork/research/blob/bffcb9cf661c745f6ad15bb8a0eca923e4c7e197/docs/forcing_mechanism_design.md) §10.6
    ブリッジはBitcoin signetで稼働中（2026-04-22からライブ）。[TESTNET.md](https://github.com/staxnetwork/research/blob/bffcb9cf661c745f6ad15bb8a0eca923e4c7e197/TESTNET.md)には、二重署名（equivocation）+ DisprovalTxフロー、[[glossary/Data-Availability|Celestia DA]]厳格モードの拒否、正直なデポジット/ミントが、それぞれの具体的なsignetトランザクションハッシュとともに記録されています。
    コメントやDMを歓迎します。Ethresearchスレッドが技術的な回答の公式な場所です。実質的なフィードバックは、帰属表示とともにドキュメントに反映します。

*1投稿 - 1参加者*

[トピック全体を読む](https://ethresear.ch/t/tee-as-verifier-for-bitvm-style-bridges-collapsing-the-canonical-label-distribution-problem/24783)
