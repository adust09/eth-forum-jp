---
title: 'ERC-8407: 拡張可能なコントラクトメタデータ'
original_title: 'ERC-8407: Extensible Contract Metadata'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-8407-extensible-contract-metadata/29565'
author: conner
date: '2026-09-02'
category: ERCs
tags:
  - ercs
  - erc
  - smart-contracts
  - protocol-design
  - state-management
  - ux
  - metadata
  - extensibility
topic_id: '29565'
translated_at: '2026-09-03'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8407: Extensible Contract Metadata](https://ethereum-magicians.org/t/erc-8407-extensible-contract-metadata/29565) — conner (2026-09-02)

# ERC-8407: 拡張可能なコントラクトメタデータ

`ethereum/ERCs` にプルリクエスト (PR) をオープンする前に、[[glossary/Draft|ドラフト]] [[glossary/ERC|ERC]] である「**拡張可能なコントラクトメタデータ**」についてフィードバックを募りたいと思います。

## 問題

オンチェーンメタデータは、従来、目的別に構築された関数を通じて公開されてきました。つまり、メタデータごとに1つの関数があり、それぞれが特定の値を返します。したがって、*新しい*メタデータを採用するということは、新しい関数を追加すること、すなわち**コントラクトのコードを変更すること**を意味します。すでにデプロイされているコントラクトの場合、それはアップグレードとなり、アップグレードは多くの場合非現実的です。多くのコントラクトは設計上アップグレード不可能であったり、特権的なオーナーがいなかったり、安全に移行するにはあまりにも広く統合されすぎていたりします。有用なメタデータ規約は、それらを保持するコントラクトが経済的に採用できないため、停滞してしまいます。

## アイデア

コントラクトが**一度だけ**公開する、単一の汎用的なキー・バリュー文字列インターフェースを標準化します。それ以降、新しいメタデータ規約を採用することは、新しいキーに値を書き込むだけの問題となり、新しい関数も、新しいコードも、アップグレードも不要になります。キーに意味を与える規約は、コントラクトがデプロイされた後でも独立して定義できます。

この[[glossary/ERC|ERC]]は、意図的に**トランスポート**のみを標準化しています。つまり、エントリがどのように読み取られ、書き込まれ、観測され、発見されるかです。特定のキーや、そこで期待される値は定義**しません**。目的は、後続の[[glossary/ERC|ERC]]が、特定のキーとその期待される値を組み込むことで、この[[glossary/ERC|ERC]]の上に構築されることです。これらの定義はここでは範囲外です。

## インターフェース

コンシューマーが依存する読み取りインターフェースと、オプションの書き込み可能拡張機能です。サポートはERC-165を通じて広告されます。

```solidity
interface IExtraMetadata /* is IERC165 */ {
    event ExtraMetadataUpdated(string key, string value); // empty value = removal
    function extraMetadata(string calldata key) external view returns (string memory value);
}

interface IExtraMetadataWritable /* is IExtraMetadata */ {
    function updateExtraMetadata(string calldata key, string calldata value) external;
}
```

主なルール：

- `extraMetadata(key)` は、値が設定されていない場合は空の文字列を返します。空の文字列は、唯一の正規の「未設定」状態です。空の値を設定すると、エントリが削除されます。
- `updateExtraMetadata` は、空のキーに対しては[[glossary/Revert|リバート]]し、変更があるたびに `ExtraMetadataUpdated` を発行します。書き込み権限は実装定義です（実装はそれを制限すべきです）。
- ERC-165 ID: `0x4ddf9da0` (読み取り)、`0xb2851ef5` (書き込み可能)。

このパターンは、すでにデプロイ済みのトークン実装で本番稼働しており、この[[glossary/ERC|ERC]]はそれを任意のコントラクトに一般化します。

## 意見を募りたい設計上の決定事項

1.  **読み取り/書き込みインターフェースの分離**と個別のERC-165 ID — これにより、不変の読み取り専用メタデータを持つコントラクトは、公開ライターを公開することなく完全に準拠できます。この分離は追加のIDを費やす価値があるか、それとも単一のインターフェースが望ましいか？
2.  **空の文字列 = 未設定 = 削除。** シンプルで安価ですが、キーが正当に空の値を保持することはできません。これは許容できるか、それとも削除は別の操作であるべきか？
3.  **コントラクトレベル（トークンIDなし）。** これにより普遍性が保たれます。トークンスコープのバリアントは別の[[glossary/ERC|ERC]]になるでしょう。同意するか？
4.  **キーと値に文字列を使用**（統治する規約は、文字列内でURIやJSONのようなエンコーディングを定義してもよい）。`bytes` を使用するケースはあるか？
5.  **名前空間化。** この[[glossary/ERC|ERC]]はキーの名前空間を強制せず、衝突回避は上位に構築される規約に委ねています。名前空間スキームを推奨すべきか？

完全な[[glossary/Draft|ドラフト]]（インターフェース、根拠、参照実装、セキュリティ上の考慮事項）は、このスレッドで議論が進み次第、オープンするプルリクエストに含まれます。「メタデータを採用するためにアップグレードできない」という壁にぶつかった経験のある方からのフィードバックを特に歓迎します。

著者: Conner Swenberg (@ilikesymmetry), Steve Katzman (@stevieraykatz)

*2投稿 - 2参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8407-extensible-contract-metadata/29565)
