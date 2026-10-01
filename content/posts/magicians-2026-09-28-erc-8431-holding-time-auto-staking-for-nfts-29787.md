---
title: 'ERC-8431: NFT向け保有期間自動ステーキング'
original_title: 'ERC-8431: Holding-Time Auto Staking for NFTs'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8431-holding-time-auto-staking-for-nfts/29787
author: jeffrhie
date: '2026-09-28'
category: ERCs
tags:
  - ercs
  - applications
  - smart-contracts
  - eip
  - tokenomics
  - ux
  - nft-staking
topic_id: '29787'
translated_at: '2026-10-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8431: Holding-Time Auto Staking for NFTs](https://ethereum-magicians.org/t/erc-8431-holding-time-auto-staking-for-nfts/29787) — jeffrhie (2026-09-28)

トークンが単に保有されるだけでステーキング期間を蓄積する、ステーキングトランザクションやカストディ転送を必要としないERC-721拡張を提案します。

**問題点:**
多くのNFTプロジェクトは長期保有者に報酬を与えますが、通常のステーキングパターンでは、保有者がステーキング関数を呼び出し、トークンを別のステーキングコントラクトに移動させ、後で引き出すことを求めます。各ステップで[[glossary/gas|ガス]]代がかかり、トークンは保有者の[[glossary/wallet|ウォレット]]から離れるため（トークンゲートアクセス、プロフィール画像、その他のウォレットベースのユーティリティが機能しなくなる）、さらに別のコントラクトが独自のカストディリスクを追加します。これらのシステムが実際に測定しているのは、トークンが取引されずにどれくらいの期間保有されたかであり、トークンコントラクトは、すべての転送時にその情報を導き出すために必要なデータにすでにアクセスしています。

**メカニズム:**

- コントラクトはステーキングシーズンを定義します: `stakingId`、`stakingBegin`、`stakingEnd`、および秒単位の`breaktime`。
- すべての転送時に、コントラクトはトークンの最後のステータス変更以降に蓄積された時間を保存された合計に追加し、現在の[[glossary/timestamp|タイムスタンプ]]を記録します。
- 転送後、トークンは休憩期間に入ります: `breaktime`秒間は何も蓄積しません。これにより、1つのトークンが短期間に多くのウォレットで報酬を請求するために使用されることに対する防御策として、ロックの代わりに機能し、トークンは自由に転送可能なままです。
- 一度も転送されないトークンは保有にコストがかかりません。それらの合計はビュー関数で遅延計算されます。
- 新しいシーズン（異なる`stakingId`）は、トークンを反復処理することなく、すべてのトークンの合計をリセットします。

**[[glossary/interface|インターフェース]]:**

```
interface IERC721AutoStaking /* is IERC721 */ {
    function stakingTotal(uint256 tokenId) external view returns (uint256);
    function stakingTimestamp(uint256 tokenId) external view returns (uint256);
    function isTakingBreak(uint256 tokenId) external view returns (bool);
    function stakingBegin() external view returns (uint256);
    function stakingEnd() external view returns (uint256);
    function stakingId() external view returns (uint256);
    function stakingBreaktime() external view returns (uint256);
}
```

**背景:**
このメカニズムは、元々2022年に私たち自身のNFTプロジェクトのために開発され、その実装はオープンソースです（github: jeff-rhie/ERC721AS）。この提案は2024年にethereum/[[glossary/EIP|EIP]]s#8902として最初に公開されましたが、[[glossary/EIP-Editor|エディター]]から[[glossary/ERC|ERC]]リポジトリへの移動を求められ、このスレッドは再提出に伴うものです。

**未解決の質問:**

1.  **シーズン中のミント。** 参照実装ではミント時にステータス変更を記録しないため、シーズン途中でミントされたトークンはシーズン開始時からクレジットされます。標準はミント時の記録を要求すべきでしょうか、それともセキュリティノート付きで実装定義のままにすべきでしょうか（現在のドラフトは後者を採用しています）？
2.  **記録はトークンに追従し、オーナーには追従しない。** 買い手は売り手の累積合計を継承しますが、休憩期間により買い手はすぐに累積を開始できません。これは適切なデフォルトでしょうか、それとも標準は転送時に合計をリセットすべきでしょうか？
3.  **ポリシー変更イベント。** ドラフトではステーキングポリシーを変更するメカニズムが未指定です。インデクサーや報酬コントラクトがポリシー履歴を追跡できるように、シーズンまたは`breaktime`が変更されたときにイベントを要求すべきでしょうか？
4.  **先行技術。** 私たちは、インプレースで転送から導出されるステーキング時間を標準化する既存のERCを認識していません。関連する提案へのポインタを歓迎します。

インターフェースと休憩期間の設計に関するフィードバックを歓迎します。

*2投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-8431-holding-time-auto-staking-for-nfts/29787)
