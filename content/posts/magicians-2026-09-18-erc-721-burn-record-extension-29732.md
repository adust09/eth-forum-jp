---
title: ERC-721バーン記録拡張
original_title: ERC-721 Burn Record Extension
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-721-burn-record-extension/29732'
author: antferr
date: '2026-09-18'
category: ERCs
tags:
  - ercs
  - erc
  - smart-contracts
  - state-management
  - applications
  - protocol-design
  - tokenomics
  - eip
  - ux
topic_id: '29732'
translated_at: '2026-09-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-721 Burn Record Extension](https://ethereum-magicians.org/t/erc-721-burn-record-extension/29732) — antferr (2026-09-18)

特定のERC-721トークンをどのウォレットアドレスがバーンしたかを読み取る関数を追加します。

**問題点。** トランザクションの途中で何かを決定する必要があるコントラクトは、誰がトークンをバーンしたかを知ることができません。その答えは`address(0)`への`Transfer`イベントの`from`フィールドにありますが、[[EVM (イーサリアム仮想マシン)|EVM]]はログを読み取ることができないため、レンディングプロトコル、マーケットプレイス、または償還コントラクトは、まさにそれが重要となる時にその情報にアクセスできません。インデクサーはコントラクトを除くすべてのエンティティをカバーしています。私が考えているユースケースの一つは、クレームがトークンをバーンした人にのみ属する償還フローですが、バーン・トゥ・ミントフローや破棄レシートも同じ問題に直面します。

```solidity
/// @dev The ERC-165 identifier for this interface is 0x43470a89
interface IERC721BurnRecord /* is IERC721, IERC165 */ {
    /// @notice Get the address recorded as having burned a token
    /// @dev Returns address(0) when no burn record exists for `tokenId`
    /// @param tokenId The token to query
    /// @return The address that burned the token, or address(0)
    function burnedBy(uint256 tokenId) external view returns (address);
}
```

**提案されるセマンティクス。**

1.  `address(0)`は「この`tokenId`に対するバーン記録がない」ことを意味します。「バーンされていない」ことを意味するものではありません。

2.  記録されたアドレスは、バーンに対して発行された`Transfer`イベントの`from`と**必ず**一致しなければなりません。これにより、この関数を読み取るコントラクトとログを読み取るインデクサーの間で不一致が生じません。

3.  バーンされたとは、トークンが存在しなくなり、`address(0)`への`Transfer`が発行されたことを意味します。慣習的に「死んだ」アドレスによって保持されているトークンは、依然として所有者がおり、本提案のスコープ外です。

4.  トークンが存在する間、`burnedBy`は**必ず**`address(0)`を返さなければなりません。したがって、トークンIDを再ミントするコントラクトは、その最新のバーンのみを報告します。

**保証は一方向です。** これが本質です。ゼロでない答えは証明であり、ゼロの答えは何も証明しません。存在しないトークンに対してスローする`ownerOf`と組み合わせることで、呼び出し元は、存在するトークンと、バーンした人が既知のバーン済みトークンを区別でき、残るのは「一度もミントされていない」か「記録が存在する前にバーンされた」という単一の曖昧なケースのみです。

**インデックスについて。** バーンした人はもちろん`Transfer`イベントから導出できますし、オフチェーンではそれが適切なツールです。コントラクトはそれにアクセスできません。2つのファイナル[[ERC|ERC（Ethereum Request for Comments）]]-721拡張はすでに同じ呼び出しを行っています。ERC-7634は`TransferCountIncreased`を発行し、`transferCountOf`も公開しています。ERC-6672は`Redeem`を発行し、`isRedeemed`も公開しています。どちらのケースでも、同じ事実がインデクサー向けのログとコントラクト向けのゲッターに存在します。

**関連する作業。** 私が調べた限りでは、ERC-5484は誰がバーンできるかを事前に固定し、ERC-5679はバーン操作自体を標準化しています。どちらも誰が実行したかの記録は保持していません。見落としている先行技術へのポインタを歓迎します。

**インテグレーター向けの2つの注意点。** ルーターやマーケットプレイスがバーンの瞬間にトークンを所有している場合、記録にはそのコントラクト名が記載され、その背後にいる人物は記載されません。これはアプリケーションレベルの懸念であり、ここでどのようなルールを選択しても回避できません。また、この記録の強みで価値を保護するコントラクトは、呼び出しごとに参照するのではなく、バーン時に一度読み取り、その結果を保存すべきです。

**意図的に除外されたもの:** バーンの時間。同じストレージスロットに収まるため、コストは議論の対象ではなく、スコープが対象です。需要があれば、別のオプションインターフェースとして存在し得ます。

**私の質問:** この機能を使用するケースにおいて、一方向の保証で十分でしょうか、それとも消費者は「一度も存在しなかった」と「記録が存在する前にバーンされた」を区別する必要があるでしょうか？

[@jay](https://ethereum-magicians.org/u/jay)さん、これはあなたが提案した2つのスレッドのうちの1つです。お時間があるときに上記のセマンティクスについてご意見をいただければ幸いです。

もしこの形が維持されるようであれば、`ethereum/ERCs`にプルリクエストをオープンします。

*3件の投稿 - 2名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-721-burn-record-extension/29732)
