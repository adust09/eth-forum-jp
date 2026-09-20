---
title: 厳格なロール交代：EVMシールドプール向けリレーヤー不要の相互ブロードキャスト（仕様＋個体群シミュレーション、コードは未実装）
original_title: >-
  Strict role alternation: reciprocal broadcast without relayers for EVM
  shielded pools (spec + population simulation, no code yet)
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/strict-role-alternation-reciprocal-broadcast-without-relayers-for-evm-shielded-pools-spec-population-simulation-no-code-yet/26051
author: atoranzo
date: '2026-09-19'
category: Privacy
tags:
  - privacy
  - zk
  - evm
  - defi
  - protocol-design
  - mechanism-design
  - research
  - transaction-ordering
topic_id: '26051'
translated_at: '2026-09-20'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Strict role alternation: reciprocal broadcast without relayers for EVM shielded pools (spec + population simulation, no code yet)](https://ethresear.ch/t/strict-role-alternation-reciprocal-broadcast-without-relayers-for-evm-shielded-pools-spec-population-simulation-no-code-yet/26051) — atoranzo (2026-09-19)

[[glossary/EVM|EVM (イーサリアム仮想マシン)]]上のシールドプールは、`msg.sender`が資金提供された透明なアカウントからガスを支払う必要があるため、[[glossary/Relayer|リレーヤー]]に依存しています。2026年6月のRailgunの測定 (arXiv:2606.25926) は、この依存関係からの両方の出口を示しています。1,049件の自己ブロードキャストによる引き出しは、ガス支払い者を通じてデポジッターにリンクされており、124件のリレーヤーのようなアドレスがリレーされたボリュームの89%を処理しています。Zcashにはこの問題は一度もありませんでした。これはアカウントモデルの産物であり、[[glossary/Zero-Knowledge-Proof|ZK（ゼロ知識証明）]]の産物ではありません。

これは、[[glossary/Relayer|リレーヤー]]市場を、[[glossary/note|ノート]]自体に埋め込まれた相互性で置き換える提案です。各シールド[[glossary/note|ノート]]は、その[[glossary/commitment|コミットメント]]内に**ロコモーティブ**または**ワゴン**というロールビットを持っています。ロコモーティブを使用するには、自身の証明と見知らぬ人のワゴン証明を含む[[glossary/Bundle|バンドル]]をブロードキャストし、両方のガスを支払う必要があります。あなたの新しい[[glossary/note|ノート]]はワゴンとして生成されます。ワゴンを使用するには、自身の証明をオフチェーンで公開し、ロコモーティブを待ちます。あなたの新しい[[glossary/note|ノート]]はロコモーティブとして生成されます。恩義の台帳も、トークンも、手数料フィールドもありません。債務はビットです。形式的には、ロコモーティブ回路はΔ(#wagons) = +1を、パッセンジャー回路はΔ = -1を、2つの検証鍵の下で強制します。これにより、ロールが[[glossary/on-chain|オンチェーン]]に現れることはなく、各ロコモーティブ証明は、所有者が指定するブロードキャスター（自身、またはプロフェッショナル）にバインドされます。

個体群シミュレーション (Python stdlib、シード1、堅牢性のため5つのシード)：定常状態では、有用なトランザクションあたりのガスオーバーヘッドは1.009倍から1.012倍で、待機時間の中央値は7ブロックです。待機時間には、各ユーザーが選択する厳格な上限（p95 = 忍耐度）があり、オーバーヘッドは0.5%から2.7%です。回路が明らかにせず、ダイナミクスが明らかにする2つのこと：引き出しはロコモーティブのシンク（バルブであるドレインがなければ待機時間を無制限に駆動するラチェット：ワゴンは2倍支払い、ロコモーティブになる）であり、分散型[[glossary/Relayer|リレーヤー]]のボランティアのジレンマは消えず、ワゴンに再配置されます。そこでは、忍耐度の低い応答者の25%の少数派が全員の待機時間を短く保ちます。パッセンジャーレースは、コントラクトが証明を検証する前に[[glossary/nullifier|ナリファイア]]をチェックする場合、ガスが+1.3%増加し、最初に検証する場合は+21%増加します。

**私が主張していないこと**: 匿名性セットを拡大するものではなく、[[glossary/Block-Building|ブロックビルダー]]による検閲に耐性があるわけでもありません。そして、フォールバックは、アカウントの露出が最もコストがかかるまさにその時に作動します。プロフェッショナルがプレッシャーの下で引き出すとき、ユーザーは自身の資金提供されたアカウントからブロードキャストを引き継ぎます。トレードオフは§9に、未解決の問題は§11に記載されています。回路とコントラクトは仕様化されていますが、まだ実装されていません。

論文、先行技術付録、シミュレーター (MIT): [https://doi.org/10.5281/zenodo.22837049](https://doi.org/10.5281/zenodo.22837049)
ベースケースを再現するには: `python3 tractor_vagon.py --ticks 4000 --depositos 0.35 --f-retiro 0.10` (SHA-256 `e55249d7…ee64e47`)。

**私が最も壊してほしい3つの点**:

1.  **[[glossary/Invariant|不変条件]]。** Δ = ±1が2つの検証鍵の下で、かつ`sender_commit = H(designated_address)`である場合に、有料ブロードキャストなしでワゴンを入手したり、他人のロコモーティブ証明を提出したりする方法はありますか？§4.2–4.4に制約があります。2→2のケーステーブルに穴があるなら、そこにあると予想しています。
    
2.  **共存。** [[glossary/Bundle|バンドル]]は、2人の見知らぬ人のトランザクションを、ロールが隠された状態で同じブロックに入れます。これは、今日の[[glossary/Relayer|リレーヤー]]されたトランザクションがRailgunヒューリスティクスのもとで漏洩する情報よりも多くを漏洩しますか？私はこれを測定していませんが、問題ないと仮定するよりも、問題があると教えてもらう方が良いです。
    
3.  **フォールバックの緊張。** 指定されたブロードキャスターを使用する場合、通常時はこれはレイテンシ上限のある[[glossary/Relayer|リレーヤー]]ネットワークに過ぎません。その唯一の際立った特性は、市場の消滅を生き残ることですが、その代償として最悪の瞬間にユーザーに露出を押し付けます。プレッシャーの下でしか価値を発揮しないメカニズムは、回路や[[glossary/note|ノート]]形式にかかるコストに見合う価値があるのでしょうか？
    

修正は同じ記録の次のバージョンに組み込みます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethresear.ch/t/strict-role-alternation-reciprocal-broadcast-without-relayers-for-evm-shielded-pools-spec-population-simulation-no-code-yet/26051)
