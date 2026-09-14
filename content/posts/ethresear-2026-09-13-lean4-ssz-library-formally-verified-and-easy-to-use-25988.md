---
title: 'Lean4 SSZライブラリ: 形式検証済みで使いやすい'
original_title: 'Lean4 SSZ library: formally verified and easy to use'
source: ethresear
source_name: Ethereum Research
source_url: >-
  https://ethresear.ch/t/lean4-ssz-library-formally-verified-and-easy-to-use/25988
author: leolara
date: '2026-09-13'
category: Consensus
tags:
  - consensus
  - formal-verification
  - cryptography
  - protocol-design
  - research
  - tooling
  - lean4
  - ssz
topic_id: '25988'
translated_at: '2026-09-14'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Lean4 SSZ library: formally verified and easy to use](https://ethresear.ch/t/lean4-ssz-library-formally-verified-and-easy-to-use/25988) — leolara (2026-09-13)

SizzLeanは5月にはすでに稼働していましたが、現時点でほとんどの[[glossary/Formal-Verification|形式検証]]ギャップを解消したため、ここで発表します。

[![SizzLeanの漫画](https://ethresear.ch/uploads/default/optimized/3X/c/c/cc2611d82778c2d4f43c73df68d0e2433f0ac4ac_2_690x376.jpeg)](https://ethresear.ch/uploads/default/original/3X/c/c/cc2611d82778c2d4f43c73df68d0e2433f0ac4ac.jpeg "SizzLeanの漫画")

SizzLeanは、[[glossary/Consensus-Layer|コンセンサス層]]プロトコルが使用するすべての[[glossary/Simple-Serialize|SSZ]]タイプにわたって証明された、コーデックの3つの中心的な特性の機械検証済み証明を備えた、完全な[[glossary/Simple-Serialize|SSZ]]スタックのLean 4実装です。このライブラリは、完全なアップストリーム適合性コーパスをパスしています。これは独立したプロジェクトであり、EFのリリースではありません。pcaversaccioの[[glossary/Formal-Verification|形式検証]]スレッドで、以前[[glossary/Simple-Serialize|SSZ]]の証明が進行中であると報告しましたが、そのステータスは現在更新されており、特にEtheoremプロジェクトの[[glossary/Simple-Serialize|SSZ]]部分について言及しています。リポジトリ: [etheorem/packages/SizzLean at main · etheorem/etheorem · GitHub](https://github.com/etheorem/etheorem/tree/main/packages/SizzLean) (packages/SizzLean)。

## 証明

[[glossary/Simple-Serialize|SSZ]]には、バイトコーデック（シリアライズとデシリアライズ）と、値をツリーのルートにハッシュ化する[[glossary/Merkleization|マークル化]]の2つの側面があります。証明は両方をカバーしており、[[glossary/Simple-Serialize|SSZ]]タイプ言語全体に対して一度、汎用的に記述され、カバーされるセット内のすべてのタイプに対して証明されています。

コーデックの半分は3つの定理に基づいています。

*   **ラウンドトリップ (Roundtrip)**: 任意の整形式の値について、そのシリアライズをデシリアライズすると元の値が返されます。これにより、データを失ったり改変したりするコーデックが排除されます。
*   **非改ざん性 (Non-malleability)**: 異なる値がエンコーディングを共有することはありません。2つの異なる状態が同じバイトにシリアライズされることはなく、攻撃者が有効なエンコーディングの下で異なるオブジェクトを置き換える改ざん経路を閉じます。
*   **サイズ境界 (Size bound)**: エンコーディングは、スキーマが静的に計算するサイズ境界を超えることはありません。オフセット、カウント、境界は、実行時における再導出なしに信頼できます。

[[glossary/Merkleization|マークル化]]の半分は、同じレベルで独自の証明を持っています。ライブラリが速度のために使用するキャッシュされた[[glossary/Merkle-tree|マークルツリー]]は、カバーされるセット内のすべてのタイプについて、形状ごとのルート合意から新しいボックスの`hashTreeRoot`に至るまで、仕様の[[glossary/Merkleization|マークル化]]と一致することが証明されています。更新パスもその隣で証明されています。単一およびバッチでの書き込みはルートを正しく保ちます。そして、[[glossary/Light-Client-Protocol|ライトクライアント]]と[[glossary/Data-Availability|データアベイラビリティ]]側が消費するオープニングと一般化されたインデックスは、インデックス計算の証明済みモデルから導出されます。このライブラリを通じてルートと証明を計算するクライアントは、エンドツーエンドで証明されたコード上で動作します。

両方の半分でカバーされるセットは、ゼロ幅の形状のみを除外します。[[glossary/consensus-spec|コンセンサス仕様]]で使用されているその他すべてが含まれており、リポジトリ内のスクリプトは、構築されたライブラリからカバーされるタイプの数を再計算します。具体的には、このセットは8ビットから256ビットまでの6つの幅すべての`uintN`、`bool`、固定サイズと可変サイズの両方の要素タイプに対する`vector`と`list`、最終バイトに長さマーカーを持つ`bitvector`と`bitlist`、および固定フィールドのみまたは固定フィールドと可変フィールドを混在させる任意のフィールドリストに対する`container`をカバーします。

READMEのカバー率表は、タイプごとの証明技術を記録しています。整数タイプは、幅に対する帰納法によって証明されたリトルエンディアンの数字コーデックを経由します。ビットタイプは、バイトチャンクごとに単射であることが証明されたバイトパッキング逆関数に基づいています。可変サイズ形状は、uint32オフセットテーブルを通じてデコードされ、書き込まれたオフセットとスライスされたスコープから値を再構築する証明が伴います。

適合性は証明と並行して、固定されたアップストリームの`ethereum/consensus-spec-tests`コーパスに対して実行されます。両方のプリセットがクリーンにパスします。`ssz_generic`は2188/2188のワイヤーフォーマットケース、`ssz_static`は[[glossary/mainnet|メインネット]]で1585/1585、ミニマルで38991/38991、[[glossary/Phase-0|Phase 0]]から[[glossary/Fulu|Fulu]]までのすべての[[glossary/fork|フォーク]]（[[glossary/ePBS|ePBS（enshrined Proposer-Builder Separation）]]コンテナを含む）をパスしています。292のプログレッシブコンテナケースはライブラリの型言語の範囲外であり、採用された[[glossary/fork|フォーク]]ではこれらの型が使用されていないため、ハーネスはそれらを範囲外と分類しています。

このライブラリは、Lean4での[[glossary/Consensus-specs|コンセンサス仕様]]の実装で使用することによってもテストされています。同じリポジトリ内の兄弟パッケージは、Lean 4で[[glossary/Consensus-specs|コンセンサス仕様]]自体を実装しており、コンテナ、状態遷移、[[glossary/fork-upgrades|フォークアップグレード]]、および[[glossary/Fulu|Fulu]]、[[glossary/Gloas|グロアス (Gloas)]]、Hezeにおける[[glossary/fork-choice|フォーク選択]]は、すべてのシリアライズとハッシュ化にSizzLeanを直接使用して構築され、[[glossary/fork|フォーク]]ごとの[[glossary/consensus|コンセンサス]]テストベクトルに対してチェックされています。その下の[[glossary/Simple-Serialize|SSZ]]レイヤーは、仕様クライアントがそれを駆動する方法でテストされており、ワイヤーフォーマットのフィクスチャだけでなく、完全な状態スケールでの実際のコンテナが使用されています。すべての[[glossary/consensus|コンセンサス]]ベクトルテストがパスします。

リポジトリ内の証明台帳は、各定理が何を確立し、何を確立しないかを1行ずつ記録しています。

信頼基盤は小さく、チェックしやすいです。ネイティブSHA-256へのすべての依存は、`sha256Hash_eq_spec`、`sha256Combine_eq_spec`、`sha256BatchCombine_eq_spec`という3つの名前付き公理を通じて証明に入り、それぞれが高速実装が純粋な仕様と等しいことを述べています。他には何もありません。中央の定理に対して`#print axioms`を実行すると、すべてのLean定理が使用できる3つの標準カーネル公理のみが報告されます。1つのgrepコマンドで全体のインベントリをリストできます。

```
grep -rEn '^axiom |^@\[extern' packages/SizzLean --include='*.lean'
```

証明はAIの多大な支援を受けて開発されました。Leanは各証明をそのカーネルに対してチェックします。

## プロジェクトでの使用方法

1行で型を宣言します。

```
structure Validator where
  pubkey                     : Vector UInt8 48
  withdrawalCredentials      : Vector UInt8 32
  effectiveBalance           : UInt64
  slashed                    : Bool
  activationEligibilityEpoch : UInt64
  activationEpoch            : UInt64
  exitEpoch                  : UInt64
  withdrawableEpoch          : UInt64
  deriving SSZRepr
```

`deriving`ハンドラはフィールド型を検査し、[[glossary/Simple-Serialize|SSZ]]形状を構築し、インスタンスを生成します。その型に対するシリアライズ、デシリアライズ、ハッシュツリールート、および3つの中央定理がそこから導出されます。手動で証明を書く必要はなく、何も必要ありません。定理インスタンスはコーデックが使用するのと同じ形状から生成されるため、保証と実装が乖離することはありません。

あなたの型に対する関数は、バックエンドとハッシュ関数の2つの軸で抽象化されたままにできます。SizzLeanのボックスは、値とそのハッシュツリーを一緒にラップし、値側ではバックエンド、ハッシュ側ではハッシュ関数`H`として両方をパラメータとして持ちます。仕様関数はその抽象化に対して一度記述されます。

```
-- schematic; see MANUAL.md for the exact surface
def activate (box : SSZ.Box H T) (i : Nat) : SSZ.Box H T :=
  sszUpdate box validators[i].activationEpoch := CURRENT_EPOCH
```

呼び出しサイトでは、どちらかのバックエンドと、必要なハッシュ関数でボックスをインスタンス化します。キャッシュされたボックスは、実行のために関数を実行し、変更されたフィールドからルートへのパスのみを再ハッシュし、重複するパスにわたる複数フィールドの更新をバッチ処理します。純粋なボックスは、同じ定義がLeanカーネルの下で還元されることを可能にし、これが証明に必要なものです。`activate`に関する証明は純粋なインスタンスに対して記述され、両方のバックエンドが同じ抽象インターフェースを実装しているため、キャッシュされたインスタンスに対しても有効です。[[glossary/Formal-Verification|形式検証]]パスとランタイムパスの間には重複するソースコードがなく、この設計がその乖離を解消します。

ハッシュパラメータも同様に交換されます。将来のハッシュ関数が、[[glossary/Post-Quantum|ポスト量子]]研究が何に落ち着くとしても、あなたのコンテナ、仕様関数、または証明に触れることなくSHA-256を置き換えることができます。キャッシュメカニズム、`deriving`ハンドラ、および定理はすべてハッシュに対して汎用であるため、変更は呼び出しサイトでの1つのインスタンスのみです。

## 純粋なLeanによるSHA-256

上記のすべては1つのプリミティブに依存しており、ライブラリはそれ自身の実装を出荷しています。兄弟パッケージである`LeanSha256`は、完全にLeanで書かれたSHA-256であり、圧縮関数とメッセージスケジュールはFIPS 180-4仕様に対して証明されています。NIST CAVPテストベクトルをパスし（1つのコマンドで実行可能）、Leanカーネルの下で還元されるため、[[glossary/Simple-Serialize|SSZ]]の証明はハッシュ化を不透明なオラクルではなく計算可能な関数として扱うことができます。

純粋な実装は、信頼性の話の仕様側です。実行のために、ライブラリはFFIを介してネイティブSHA-256を呼び出し、上記の3つの公理は、ネイティブの結果が純粋な結果と等しいという1つのことだけを述べています。純粋な側自体が標準に対して証明され、CAVPベクトルに対してチェックされているため、公理の重みは小さく、後でネイティブ実装を置き換えたり、仮定する代わりに同等性を証明したりしても、依存するすべての定理は変更されません。

## チーム

SizzLeanは（Etheoremプロジェクトの一部として）7人のチームによって構築されており、Ethereum Protocol FellowshipとInvisible Garden Fellowshipからの貢献者がいます: [Mouzayan](https://github.com/Mouzayan)、[irajgill](https://github.com/irajgill)、[IvanAnishchuk](https://github.com/IvanAnishchuk)、[protocolwhisper](https://github.com/protocolwhisper)、[Sahilgill24](https://github.com/Sahilgill24)、[adria0](https://github.com/adria0)、および[leolara](https://github.com/leolara)。彼らの多大な努力、特に多くの[[glossary/Simple-Serialize|SSZ]]証明を書いた[irajgill](https://github.com/irajgill)に感謝します。

Invisible Gardenの哲学において、このプロジェクトの一側面は学習であり、私たちは以前専門家ではなかったにもかかわらず、実践を通じて[[glossary/Formal-Verification|形式検証]]を学んでいます。参加して一緒に学ぶことを歓迎します。レビュー、フィードバック、貢献、そしてもちろん使用も歓迎します。

フィードバックのための質問: SizzLeanで改善するために、他に何がより興味深いでしょうか？

*1 post - 1 participant*

[Read full topic](https://ethresear.ch/t/lean4-ssz-library-formally-verified-and-easy-to-use/25988)
