---
title: 'ERC-8412: 事前登録された受諾基準'
original_title: 'ERC-8412: Preregistered Acceptance Criteria'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8412-preregistered-acceptance-criteria/29609
author: richard7463
date: '2026-09-07'
category: ERCs
tags:
  - ercs
  - applications
  - ux
  - protocol-design
  - mechanism-design
  - smart-contracts
  - verification
  - ai-agents
  - economics
topic_id: '29609'
translated_at: '2026-09-09'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8412: Preregistered Acceptance Criteria](https://ethereum-magicians.org/t/erc-8412-preregistered-acceptance-criteria/29609) — richard7463 (2026-09-07)

トピックタイトル: [Pre-ERC 議論] 事前登録された受諾基準
カテゴリ: ERCs

* * *

[[glossary/AI-agent-verification-stack|AIエージェント検証スタック]]におけるすべての検証プリミティブは、結果を再計算し、[[glossary/digest|ダイジェスト]]を比較するという同じ形に帰着する。ERC-8274は`(inputHash, outputHash, proof)`のトリプルを検証する。ERC-8404は`REPRODUCED | DIVERGED | CANNOT_RECOMPUTE`に関するレシートを発行する。ERC-8263は[[glossary/digest|ダイジェスト]]をアンカーする。インクルージョン証明設計は、以前に行われたコミットメントを確認する。これらすべては、成果物が二度目に導出可能であることを前提としている。

エージェントがカウンターパーティに支払うもののほとんどは、二度目に導出することはできない。

温度がゼロより高いモデルによって生成された成果物は、同じバイトを二度返すことはなく、プロバイダー側のモデル改訂は、温度がゼロであっても再現性を損なう。誰かがレビューしなければならなかった文書。誰かが物理的に立ち会わなければならなかった検査。そして一般的なケースでは、「これは支払うに値するほど十分か」という問いは、再計算の問題では決してなく、標準に対する判断である。

これはERC-8404に対する不満ではない。その規範的テキスト自体が、`CANNOT_RECOMPUTE`を決済可能な評決に変換することを禁じており、これは正しく記述されたガードである。その結果、判断されたすべての結果はそのステータスに永続的に留まり、決済は記録外で行われることになる。

その境界はデジタル対物理ではない。それは**計算されたもの対判断されたもの**である。

## ドラフトの提案内容

証拠が存在する前に、支払い側は[[glossary/on-chain|オンチェーン]]で2つのものを登録する。受諾基準の[[glossary/digest|ダイジェスト]]と、タイプ付けされた証拠義務のパックされたリスト（それぞれ2ビット、必須、免除可能）。作業が戻ってきたら、検証者の[[glossary/Attestation|アテステーション（証明）]]は、その凍結されたリストに対して項目別に記録される。各義務について、MET（達成）、WAIVED（免除）、UNMET（未達成）、またはNOT\_APPLICABLE（該当なし）。

```
function preregister(
    bytes32 criteriaDigest,
    bytes32 taskRef,
    uint16  obligationCount,
    bytes calldata obligationFlags,   // 2 bits per obligation, MSB-first
    uint64  expiry
) external returns (bytes32 preregistrationId);

function attestOutcome(
    bytes32 preregistrationId,
    bytes32 bundleDigest,
    bytes32 attestationDigest,
    Verdict verdict,                   // Satisfied | NotSatisfied | Indeterminate | ...
    bytes calldata obligationOutcomes  // 2 bits per obligation, same order
) external;
```

この設計全体を支える1つのルールがある。必須の義務がUNMETと記録されているにもかかわらず、結果が満足されたと宣言する[[glossary/Attestation|アテステーション（証明）]]は、コントラクトによって拒否される。フラグ付けされたり、減点されたりするのではなく、[[glossary/Revert|リバート]]される。

コストはn個の義務に対して`ceil(2n/8)`バイトである。8個の義務は2バイト。

## 項目化が重要な理由

今日、評決は`uint8`、スコア、または`complete()`呼び出しである。その中に第三者が反論できるものは何もない。証拠よりも前に存在することが証明できる基準に対して項目化すれば、挑戦者は具体的な点を指摘できる。「義務3は未達成と記録されているのに、あなたは結果を合格とした」。

## 「しかし、成果物はすでにハッシュ化されている」

冒頭の議論は、ほとんどの作業は再計算できないというものだった。今回の議論はさらに強力で、ハッシュ化が完全に機能する場合でも当てはまる。

ほとんどの人が実際に構築したものは、返された成果物の[[glossary/digest|ダイジェスト]]が注文が受諾されたときのコミットメントと一致した場合に[[glossary/escrow|エスクロー]]を解除する。これは約束に対する支払いではなく、ハッシュに対する支払いである。これは良い構造であり、私はそれに反対するものではない。

それは*同一性*を証明する。支払われる成果物がコミットされたものであり、後で交換できないことを証明する。しかし、*適切性*については何も証明しない。[[glossary/digest|ダイジェスト]]はバイトに対して取られるものであり、要件に対して取られるものではない。要点を外した成果物のハッシュは、そうでない成果物のハッシュと全く同じように、そのコミットメントと正確に一致する。

その兆候は、これらの設計が一致後に設ける[[glossary/challenge-window|異議申し立て期間]]にある。挑戦者がそこで実際に何を提起できるか列挙してみよう。置き換え — [[glossary/digest|ダイジェスト]]によってすでに排除されている。不履行 — すでに明らかであり、コミットメントは投稿されていない。遅延 — タイムスタンプにすでに含まれている。残るのは「これは支払うに値するほど十分だったか」という、[[glossary/digest|ダイジェスト]]が決して答えなかった唯一の問いである。[[glossary/challenge-window|異議申し立て期間]]は、ハッシュの一致が問題を解決しなかったことを設計が認めていることを意味する。

そして、その期間を利用する者は何も反論していない。記録のどの部分も、成果物が何を包含すべきであったかを述べていないからだ。支払いを単に保留するのではなく、設計が[[glossary/slashed-collateral|ステークをスラッシュする]]場合は、さらに鋭い問題となる。保留は両当事者を元の状態に戻すが、スラッシュは、記録上の何ものも反論できない発見に基づいて価値を移動させる。

したがって、これは物理的な作業に関するニッチな問題ではない。純粋なバイト文字列の成果物は、正確にハッシュ化され、公開される前にコミットされ、議論の余地なくアンカーされ得るが、適切性の問題はこれら3つすべてによって手つかずのままである。成果物を凍結することと、基準を凍結することは2つの異なる行為であり、最初の行為にのみプリミティブが存在する。

## 審査員の選定は、基準の固定とは異なる問題である

私が予想するもう一つの返答は、「[[glossary/Weighted-BFT|加重検証ゲート]]を使用するか、モデルにアウトプットを評価させる」というものだ。ERC-8353は`evidenceHash`に基づいて検証者を[[glossary/stake|ステーク]]し、重み付けするが、そのハッシュのフォーマットを明示的にスコープ外としている。それは*誰が*審査し、その投票がどのように集計されるかを決定する。審査員が何をチェックするよう要求されたかは決して記録されない。未記録の基準に対する全会一致の加重評決は、依然として反証不可能である。

オフチェーン版は、ある特定の点でさらに悪い。[[glossary/prompt|プロンプト]]に保持された採点基準は、出力が手元にある後に編集される可能性があり、その編集の痕跡は記録に残らない。

医学にはそれに対する名称がある。患者の経過をリプレイできないため、研究者はデータが到着した後に良さそうに見える任意のエンドポイントを報告できた。これが[[glossary/outcome-switching|結果のすり替え (outcome switching)]]である。その解決策は[[glossary/preregistration|事前登録]]であり、[ICMJEは2005年7月1日に試験登録を出版の条件とした](https://www.icmje.org/news-and-editorials/update_2005.html)。しかし、登録だけでは解決しなかった。[CEBMオックスフォードのCOMPareプロジェクト](https://trialsjournal.biomedcentral.com/articles/10.1186/s13063-019-3173-2)は、2015年10月から2016年1月にかけて、5つの主要ジャーナルの試験を自身の登録エントリと照合し、[[glossary/outcome-switching|結果のすり替え (outcome switching)]]が依然として広範に行われていることを発見した。レジストリは計画を保存するが、それを報告書と比較することはない。比較は、論文を手作業で読むボランティアに任されていた。

その比較を機械化することが、ここでの貢献である。[[glossary/outcome-switching|結果のすり替え (outcome switching)]]は、後で誰かが気づくかもしれない不正行為ではなく、[[glossary/Revert|リバート]]となる。

## なぜこれがそもそもチェーンを必要とするのか

ここで[[glossary/consensus|コンセンサス]]を必要とする主張はただ一つ、証拠を見た後に基準が選択され得なかったということだ。これは時間的な順序付けに関する主張であり、オフチェーンのタイムスタンプは鍵を持つ者によって遡及的に変更され得る。臨床的な[[glossary/preregistration|事前登録]]は、登録者を信頼することで順序付けを保証する。エージェント、[[glossary/Operator|オペレーター]]、および検証者は登録者を共有しない。ブロックの順序付けがその代わりとなる。この設計の他のいかなる部分もチェーンを必要としない。

## これは何かではない

これはアイデンティティ（[[glossary/ERC-8004|ERC-8004 (エージェントIDレジストリ)]]）ではないし、エージェントのリスクスコアリング（ERC-8126）でもない。認証（ERC-8196）でもないし、アンカリング（ERC-8263、[[glossary/ERC-8281|ERC-8281 (Observation Commitment Protocol)]]）でもない。[[glossary/escrow|エスクロー]]（[[glossary/ERC-8183|ERC-8183 (エージェント型商取引)]]、ERC-8195）でもないし、審査員の選定（ERC-8353）でもない。これらと競合するのではなく、むしろ連携する。ERC-8353ゲートは、これらの基準に基づいて検証者を配置し、その`evidenceHash`をバンドル[[glossary/digest|ダイジェスト]]に設定できる。

三状態の評決も目新しいものではない。ERC-8126はファイナルであり、すでに`Passed`、`Failed`、`Inconclusive`を定義している。新しいのは、証拠が存在する前に凍結された基準、タイプ付けされ項目化された義務、そして不一致を単に検出可能にするのではなく、表現不可能にするコントラクトレベルのルールの組み合わせである。

## プルリクエスト (PR)をオープンする前に回答を希望する質問

1.  `Verdict`をERC-8126の`VerificationStatus`から意図的に分離した。その理由は、両者が異なる主題を持つためである。`Inconclusive`は検証層が*エージェント*について結論に達しなかったことを報告する一方、ここでの`Indeterminate`は、証拠が事前に固定された基準に対して*単一の結果*を解決しなかったことを報告する。ドラフトでは、両方向でのマッピングを禁止している。この境界は正しい場所に引かれているか、あるいは一方が他方から導出されるべきケースはあるか？
2.  義務ごとに2ビットというエンコーディングは適切か、それともフラグはオフチェーンの基準文書に完全に存在し、その[[glossary/digest|ダイジェスト]]のみが[[glossary/on-chain|オンチェーン]]にあるべきか？この設計はその選択にかかっており、どちらの方向でも議論できる。
3.  免除権限は[[glossary/on-chain|オンチェーン]]で指定されるべきか、それとも基準文書内で指定するだけで十分か？
4.  証拠が存在する*前に*受諾基準を凍結することに関して、私が見落としている先行研究はあるか？証拠が存在した後に[[glossary/Attestation|アテステーション（証明）]]することとは対照的に。

ドラフトは作成済みで、提出前である。番号はまだない — [[glossary/EIP-Editor|EIPエディター]]が[ethereum/ERCs](https://github.com/ethereum/ERCs)に対して[[glossary/PR|プルリクエスト (PR)]]時に割り当てる。もしそれがより有用であれば、完全な仕様テキストを返信にインラインで貼り付けることも可能だ。

*2件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8412-preregistered-acceptance-criteria/29609)
