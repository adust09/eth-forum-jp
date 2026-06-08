---
title: 'ドラフトERC: パーミッションレジストリ — カストディなしでエージェントに機能スコープの委任を'
original_title: >-
  Draft ERC: Permission Registry — function-scoped delegation for agents,
  without custody
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-erc-permission-registry-function-scoped-delegation-for-agents-without-custody/28670
author: Fran23
date: '2026-06-01'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - security
  - applications
  - ux
  - defi
  - account-abstraction
  - protocol-design
topic_id: '28670'
translated_at: '2026-06-08'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Draft ERC: Permission Registry — function-scoped delegation for agents, without custody](https://ethereum-magicians.org/t/draft-erc-permission-registry-function-scoped-delegation-for-agents-without-custody/28670) — Fran23 (2026-06-01)

皆さん、こんにちは。

現在、レジストリベースの委任承認プリミティブに関する[[glossary/ERC|Ethereum Request for Comments (ERC)]]のドラフトに取り組んでおり、[[glossary/EIP|EIP（Ethereum 改善提案）]]のプルリクエストをオープンする前にフィードバックをいただけると幸いです。

目的は、スマートコントラクトのユーザーが、自分の代わりにコントラクトの関数を呼び出すためのスコープ付きパーミッションを付与するシンプルなプリミティブを提供することです。ERC20.approveが転送に対して行うことを、この提案はコントラクトのすべての関数に対して行いたいと考えています。

-   リポジトリ: [https://github.com/yolo-maxi/erc-approval-registry](https://github.com/yolo-maxi/erc-approval-registry)
    
-   仕様: [https://github.com/yolo-maxi/erc-approval-registry/blob/master/SPEC.md](https://github.com/yolo-maxi/erc-approval-registry/blob/master/SPEC.md)
    
-   ガス分析: [https://github.com/yolo-maxi/erc-approval-registry/blob/master/Gas%20analysis.md](https://github.com/yolo-maxi/erc-approval-registry/blob/master/Gas%20analysis.md)
    

## **問題**

多くのDeFiや自動化フローでは、カストディ転送なしの委任実行が必要です。例えば、複利ボット、フォワーダー、ソーシャルトレーディングエージェント、オペレーターが特定のポジションを管理できるようにするラッパーコントラクトなどです。

現在の一般的な選択肢はあまり優れていません。

-   ERC-20承認はアセットスコープであり、アクションスコープではありません。
    
-   Vaultカストディは、資産を別のコントラクトに移動させることで承認を解決します。
    
-   プロトコルごとのオペレーターシステムは構成可能ではなく、ウォレットやインデクサーに対して一貫して可視化されません。
    
-   完全に汎用的な実行パーミッションは、安全にレンダリングするのが困難です。
    

目標は、コントラクトが1つの承認チェックで統合でき、ウォレットやインデクサーが一貫して表示できる小さなレジストリプリミティブです。

## **提案されるプリミティブ**

レジストリは `(user, operator, target)` ごとに1つの承認ブロブを保存します。

```
auth.length == 0: no approval
auth.length == 4: expiry only = full-target approval
auth.length > 4:  uint32 expiry || sorted bytes4 selectors...

```

これにより、ユーザーはオペレーターに対して、期限までターゲットに対する完全な承認を付与するか、期限まで特定のセレクターのソート済みバンドルに対する承認を付与することができます。期限は `(user, operator, target)` ごとにバンドル全体に適用されます。ブロブをコンパクトに保つため、意図的にセレクターごとではありません。

統合は1つのモディファイアで行われます。

```
modifier onlyAuthorized(address user) {
    if (msg.sender != user) {
        registry.requireAuthorizedCall(user, msg.sender, address(this), msg.sig);
    }
    _;
}
```

ターゲットコントラクトは、ユーザーがどのモードを選択したかを気にしません。単に呼び出し元が `msg.sig` に対して承認されているかどうかを尋ねるだけです。

## **なぜフルターゲット承認が第一級なのか**

以前のドラフトでは、純粋なセレクターマッピング (`user → operator → target → selector → expiry`) を使用していました。これはフラットなO(1)チェックを提供しますが、広範な委任を高価にします。すべてのセレクターが独自のストレージスロットになるためです。

信頼できるフォワーダー/ルーターの場合、広範なターゲットレベルの委任が一般的なケースです。これを期限のみの4バイトブロブとしてエンコードすることで、1つのコンパクトな承認、O(1)チェック、そしてERC-20承認とほぼ同等のガス消費を実現します。より狭いスコープが必要な場合は、セレクターバンドルが引き続き利用可能です。

## **ガス消費のトレードオフ**

参照実装、実行ガス:

|  | チェック | 付与 |
| --- | --- | --- |
| 旧セレクターマッピング (1セレクター) | ~2.1k | ~35.3k |
| パックされたフルターゲット | ~2.6k | ~35.8k |
| パックされたバンドル、2セレクター | ~3.4k | ~40.9k (マッピングでは~58.3k) |
| パックされたバンドル、6セレクター | ~4.5k | ~54.6k (マッピングでは~163k) |
| パックされたバンドル、20セレクター | ~8.5k | ~169k (マッピングでは~531k) |
| ERC-20承認参照 | ~2.9k | ~31.4k |

フルターゲット承認はERC-20承認の領域にあります。セレクターバンドルは、2セレクター以降でセレクターごとのストレージよりも優れていますが、O(n)のチェックコストを支払います。実際には、部分的な委任は「少数のセレクターか、ターゲット全体」の傾向があるため、2〜5の範囲のバンドルが想定される形です。

## **セレクターのソート**

セレクターバンドルは厳密にソートされ、一意である必要があります。レジストリはソートされていない/重複した入力を拒否し、オンチェーンでのソートは行いません。ソートはウォレット/SDKに属し、レジストリは決定論的なエンコーディングと早期終了チェックを行います。

## **有効期限 (Expiry)**

外部APIは `uint48` を使用します。

-   `0` → 取り消し済み / 未設定
    
-   `type(uint48).max` → 永続
    
-   その他 → Unixタイムスタンプ
    

参照実装は、有効期限を `uint32` としてコンパクトに保存します（永続的なセンチネル `uint32.max`、2106年まで有効な有限タイムスタンプ）。これにより、フルターゲット承認は4バイトに保たれます。

## **EIP-712 permit**

セレクタースコープの[[glossary/EIP-712-attestation-profile|EIP-712アテステーションプロファイル]] permitにより、オーナーは自分でトランザクションを送信することなく、単一のセレクターを付与または取り消しできます。permitは意図的にセレクタースコープです。フルターゲット承認は、ウォレットが適切に警告できるように、明示的なオンチェーン呼び出しを必要とすべきです。

## **フィードバックのための質問**

1.  現在のイベントモデルはインデクサーにとって十分でしょうか、それとももっと多くの状態を保持すべきでしょうか？ :white_check_mark:
    
2.  `permitPermission` はセレクタースコープのみに留めるべきでしょうか、それともフルターゲットもサポートすべきでしょうか？ :white_check_mark:
    
3.  [[glossary/Clear-Signing|クリア署名]]の最新開発状況を考慮し、ウォレットにアクションを表示するためのより良いパターンはありますか？
    

ありがとうございます。これを正式な[[glossary/EIP|EIP（Ethereum 改善提案）]]プルリクエストにする前に、設計に関するフィードバックを求めています。

編集: 以下のフィードバックに基づき、ドラフトと参照実装を更新しました。フルターゲット承認をセレクターpermitのエッジケースとして扱うのではなく、`permitFullAuthorization(...)` を介して第一級の[[glossary/EIP-712-attestation-profile|EIP-712アテステーションプロファイル]] permitパスとしました。また、ブロブ全体の承認変更のためにデコードされた `AuthorizationSet(user, operator, target, expiry, selectors)` イベントを追加し、ウォレットやインデクサーがパックされたストレージ形式をデコードすることなく状態を再構築できるようにしました。ゼロ以外の有効期限を持つ空のセレクターはフルターゲット承認を意味し、ゼロの有効期限を持つ空のセレクターは取り消し済み/承認なしを意味します。

*4投稿 - 3参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/draft-erc-permission-registry-function-scoped-delegation-for-agents-without-custody/28670)
