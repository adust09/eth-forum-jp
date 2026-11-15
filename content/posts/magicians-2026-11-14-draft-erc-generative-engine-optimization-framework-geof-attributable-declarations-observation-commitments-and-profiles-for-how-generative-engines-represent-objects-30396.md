---
title: 'ドラフトERC: 生成エンジン最適化フレームワーク (GEOF) — 生成エンジンによるオブジェクト表現の帰属可能な宣言、観測コミットメント、プロファイル'
original_title: >-
  Draft ERC: Generative Engine Optimization Framework (GEOF) — attributable
  declarations, observation commitments and profiles for how generative engines
  represent objects
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-erc-generative-engine-optimization-framework-geof-attributable-declarations-observation-commitments-and-profiles-for-how-generative-engines-represent-objects/30396
author: garyyang-finchip
date: '2026-11-14'
category: ERCs
tags:
  - ercs
  - ai-agents
  - applications
  - protocol-design
  - verification
  - economics
  - mechanism-design
  - eip
  - research
  - generative-ai
  - measurement-framework
topic_id: '30396'
translated_at: '2026-11-15'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Draft ERC: Generative Engine Optimization Framework (GEOF) — attributable declarations, observation commitments and profiles for how generative engines represent objects](https://ethereum-magicians.org/t/draft-erc-generative-engine-optimization-framework-geof-attributable-declarations-observation-commitments-and-profiles-for-how-generative-engines-represent-objects/30396) — garyyang-finchip (2026-11-14)

## 概要

GEOFは、生成エンジン（アンサーエンジン、AI検索インターフェース、発見層を持つエージェントランタイム）がオブジェクトをどのように表現するか、その表現がどのように測定されるか、そして独立した当事者がその測定値をどのように交換し、検証するかを記録するための記述フレームワークです。

これにより、独立した当事者は、同じオブジェクトまたは情報拡散プロセスについて、何を観測したかを宣言できます。また、情報拡散の意図が宣言されている場合は、そのうちどれだけが達成され、どれだけが情報拡散に帰属できるかを宣言できます。

このフレームワークはいかなる値にも望ましさを割り当てません。しきい値、重み、ランキングアルゴリズム、エンジンポリシー、不正防止ルール、ライセンスメカニズム、および「良いGEO」の定義は含まれません。

リポジトリ: [GitHub - garyyang-finchip/geo-framework: AI Generative Engine Optimization Framework · GitHub](https://github.com/garyyang-finchip/geo-framework)
ERCプルリクエスト: [Add ERC: Generative Engine Optimization Framework by garyyang-finchip · Pull Request #2176 · ethereum/ERCs · GitHub](https://github.com/ethereum/ERCs/pull/2176)

## 目的

-   生成エンジンは情報を取得し、選択し、合成し、帰属させます。従来の検索指標（インプレッション、クリック、順位）はその一部を記述しますが、生成エンジンの周りで発展した指標（言及率、引用率、シェアオブボイス、順位調整済み単語数）は、互換性のない単位と分母で公開されています。同じ数値を持つ2つの当事者は、同じものを測定したのかどうかを判断できません。
-   受信者が[[glossary/AI-agents|AIエージェント]]であり、エンジンがエージェントランタイムである場合、「引用される」ことは「呼び出される」こと、そして「決済される」こととなります。これらの結果はすでにオンチェーンの痕跡（スキル[[glossary/Token|トークン]]呼び出し、[[glossary/Task-Tender|タスクテンダー]]決済）を残していますが、それらを引き起こした発見イベントと結びつける共通の語彙がありません。
-   エンジン[[glossary/Operator|オペレーター]]、オブジェクト保持者、および第三者パネルはそれぞれ、同じプロセスの異なる部分を観測します。どれも正準な情報源にはなり得ません。それらのステートメントは共存し、それぞれが帰属可能であり、使用されたフレーム、情報源、およびメソッドに拘束される必要があります。
-   同じ情報拡散でも、ある意図の下では成功であり、別の意図の下では失敗となります。達成または貢献に関するステートメントは、宣言された意図に対してのみ意味を持ち、観測された内容に関するステートメントとは分離されなければなりません。

## 定義内容

**8つのコンテンツアドレス型レコードタイプ**（JCS正準化 + keccak256）：オブジェクト、フレーム、ソース、メソッド、インテント、メトリック定義、観測、プロファイル。

**プロセス**：1つのフレーム、1つ以上のオブジェクト、0以上のインテント、およびオープナーが公表するソースとメソッドにバインドされた観測コンテナ。任意のアカウントが観測バッチ（Merkleルート + カウント、送信者に帰属可能）をコミットし、プロファイルを公開します。オープナーのみがバージョンを凍結するか、補遺を開きます。プロファイルは凍結されたバージョンにバインドされます。公式プロファイルを指定するものは何もない。

**5つの値の状態**：`ABSENT`（確認済み、なし）、`UNOBSERVED`（材料なし）、`NOT_APPLICABLE`（該当なし）、`UNDETERMINABLE`（材料はあるが、宣言されたメソッドでは判断に至らなかった）、または値。`UNOBSERVED`は決してゼロではありません。

**メトリック文法** `geof:<family>/<metric>/vN`（拡張 `geof:x/<publisher>/<metric>/vN`）は、エクスポージャー、プレゼンテーション、レセプション、忠実性、SEO、アクセス、ダイナミクス、エコノミクス、達成、帰属の10ファミリーにわたります。メトリック定義は、統計単位、分子、分母、適格性、重複排除、および集計を固定し、推奨される方向性を持たない。すべてのステートメントは、そのフレーム、ソース、メソッド、カウント、カバレッジ、不確実性、および人間が読める根拠を伴います。

**ステートメントの正直性を保つ3つのルール**

1.  忠実性ステートメントは、参照セット、比較対象、およびチェックされた命題を明記しなければなりません。「それは起こったか」、「忠実に伝達されたか」、「情報源の主張は裏付けられているか」、「目的は達成されたか」は、4つの質問と4つの回答です。
2.  達成および帰属ステートメントは、インテントを参照しなければなりません。基本観測はインテントなしで成立しますが、有効性の主張はそうではありません。
3.  表現は`INVOKED`（アクター名：エンジンまたは受信者）で終了します。購入、決済されたタスク、または支払いは、明示されたリンク根拠を持つフォローアップ観測であり、エンジンが「行った」ことではありません。

**最小限のレジストリ**（`IGEOFRegistry`、[[glossary/ERC-165|ERC-165]] + [[glossary/ERC-6372|ERC-6372]]）：`declare`、`declareObject`、`openProcess`、`commitObservations`、`closeProcess`、`openAddendum`、`publishProfile`、およびビュー。ハッシュ、URI、帰属、順序付けのみ。

## 2つの実例、1つのフレームワーク

| | ケースA — ウェブ訂正通知 | ケースB — エージェントスキル |
| --- | --- | --- |
| インテント | 一般検索ユーザーは条件Zを理解すべき | 3つの指定された[[glossary/AI-agents|エージェント]]が呼び出し、決済すべき |
| エクスポージャー | 回答包含率 0.74 (1066/1440) | 公開検索 0.042 (9/212); ターゲット到達 3/3 |
| 忠実性 | 言及された回答の0.23に主要命題が存在 | ディスクリプタハッシュ一致 11/11 |
| 達成 | UNOBSERVED — 受信者証拠なし | 呼び出し済み 1.0、実行済み 1.0 |
| 帰属 | 未記載 | UNDETERMINABLE、根拠は宣言済み |
| 解釈 | 広範囲、不忠実、効果不明 | 狭範囲、忠実、達成済み、貢献未証明 |

どちらのケースもスコアは付与されません。両ケースとも参照テストでオンチェーンで実行され、レコードバンドルと派生ベクトルはリポジトリにあります。

## 関連する作業との関係

情報フローパラダイムレジストリ（[[glossary/ERC-8489|ERC-8489]]）とは独立しており、かつマッピング可能です。GEOプロセスは複数の情報フローにまたがることがあり、月次プラットフォームレポートは、単一のフローが見えなくてもプロファイルをサポートします。スキル/タスク/エージェント/レジストリの種類のオブジェクトは、オンチェーンの[[glossary/Value-root|バリューレジストリ]]（[[glossary/ERC-8444|ERC-8444]]）内のレコードを参照します。スキル呼び出し（[[glossary/ERC-8338|ERC-8338]]）と[[glossary/Task-Tender|タスクテンダー]]決済（[[glossary/ERC-8414|ERC-8414]]）は、呼び出しおよびフォローアップステートメントのオンチェーンソースです。IDと信用（[[glossary/ERC-8434|ERC-8434]]、[[glossary/ERC-8419|ERC-8419]]）、安全採用（[[glossary/ERC-8468|ERC-8468]]）、および紛争解決（[[glossary/ERC-8471|ERC-8471]]）は、独自のインターフェースを通じてプロファイルを消費します。[[glossary/ERC|ERC]]テキストは[[glossary/ERC-165|ERC-165]]と[[glossary/ERC-6372|ERC-6372]]のみを要求します。

## ステータスと要望

-   50のFoundryテスト（両ケースのエンドツーエンド）、JSONスキーマ、バリデーター、ベクトルを含む参照レジストリ。次にテストネットワークでの証拠実行を予定しています。
-   以下の点についてレビューを求めています：（1）5つの状態値語彙、（2）オープンコミットメントを伴うオープナーのみのクローズ — カーネルにオブザーバーごとのクローズが必要か、それとも「同じフレームで独自のプロセスを開く」ことで十分か、（3）`UNDETERMINABLE`が忠実性、達成、帰属ファミリー以外でステートメント値として許可されるべきか、（4）メトリック識別子文法のパブリッシャーネームスペース。

*2投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/draft-erc-generative-engine-optimization-framework-geof-attributable-declarations-observation-commitments-and-profiles-for-how-generative-engines-represent-objects/30396)
