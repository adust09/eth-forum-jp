---
title: 'ERC: 資産強制型支出委任'
original_title: 'ERC: Asset-Enforced Spend Mandate'
source: magicians
source_name: Ethereum Magicians
source_url: 'https://ethereum-magicians.org/t/erc-asset-enforced-spend-mandate/28831'
author: VladKuzR
date: '2026-06-18'
category: ERCs
tags:
  - ercs
  - eip
  - smart-contracts
  - security
  - account-abstraction
  - ai-agents
  - tokenomics
  - protocol-design
  - access-control
topic_id: '28831'
translated_at: '2026-06-19'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC: Asset-Enforced Spend Mandate](https://ethereum-magicians.org/t/erc-asset-enforced-spend-mandate/28831) — VladKuzR (2026-06-18)

プルリクエスト (PR) を開く前に、早期フィードバックを募るためにこれを公開します。

エージェントが自律的に資金を動かし始めています。そのための安全なプリミティブは、デリゲートが費消できる範囲を資産自体が制限することです。具体的には、トランザクションごとの上限、有効期限、許可されたトークン、そしてエージェントを即座に停止させる取り消し機能です。これらはすべて、エージェントの良好な振る舞いではなく、トークンによって強制されます。エージェントの鍵やセッションが完全に掌握されたとしても、すべての転送はトランザクションごとの上限内に留まり、プリンシパル（委任元）は取り消しによってそれを停止できます。また、この制約は特定のウォレットやセッションキーに存在するのではなく、トークンと共に移動します。（一定期間の総支出を制限する機能は、以下に述べる付随的な拡張です。）部門予算を持つ財務サブアカウント、許容額ウォレット、および引き出し制限のあるカストディアルアカウントは、同じ形態をしています。

トークンはすでに転送を拒否できます。ERC-7943 と ERC-3643 は、トークン内に転送前チェックを配置し、それを強制します。それらが返すのは、単なるブーリアン値かカスタムエラーです。したがって、真のギャップは強制力ではなく、拒否に機械可読な原因が含まれていないこと、そしてポリシーが再利用可能な一箇所ではなく、各トークン内に存在することです。転送がブロックされた場合、インテグレーターは理由（委任記録なし、トランザクションごとの上限超過、期限切れ、取り消し済み、または誤った資産）を知る必要があります。なぜなら、それぞれ異なる対応が必要であり、現在では誰もが特定のトークンの内部情報に基づいてオフチェーンでそれを推測しているからです。多くの資産が共有でき、共有された機械可読な理由語彙で応答する再利用可能なゲートが不足しています。

既存のスタックに配置する方法の一つ：

```
ERC-20            what you hold
ERC-3643 / 7943   who may hold it
ERC-4337 / 7702   who may sign for it
ERC-8004          which agent is which
this proposal     what a holder may spend, enforced at the asset
```

ERC-8226 は、その最後の行に対する規制され、アイデンティティに紐づいたアプローチです。本提案は、最小限でアイデンティティに依存しないゲートです（詳細は後述）。

このインターフェースは意図的に小さく設計されています。転送適格性ゲートは、個別にデプロイ可能なコントラクトであり、2つのビューを持ちます。

```solidity
interface ISpendGate {
    // true whenever the gate holds any record for `subject` (active, lapsed,
    // revoked, or no-mandate). Sticky and constant-gas.
    function isGated(address subject) external view returns (bool);

    // side-effect-free verdict. ok == (reason == OK).
    function checkTransfer(address from, address token, uint256 amount)
        external view returns (bool ok, bytes32 reason);
}
```

2つの関数がありますが、シグネチャが提案の核心ではありません。この[[glossary/EIP|EIP（Ethereum 改善提案）]]が標準化するのは、予約済みでバイト固定された理由語彙（後述）、資産の強制義務（いつゲートを参照するか、いつ`TransferBlocked`でリバートするか、どの移動が免除されるか、`STATICCALL`とフェイルクローズ処理）、ERC-165 検出、および`IGatedAsset`インターフェースです。相互運用性（interoperability）はそこに存在し、2つのビューにはありません。

準拠するERC-20は`spendGate()`を公開し、その転送パス内で次のように動作します。`isGated(from)`が`true`の場合、`checkTransfer`を読み取り、`reason == OK`でない限り`TransferBlocked(reason)`でリバートします。`isGated(from)`が`false`の場合、転送は通常のERC-20として行われます。ミント、`address(0)`へのバーン、ゼロ値転送、自己転送は免除されます。

`reason`は、予約済みでバイト固定されたセットからの`bytes32`の短い文字列であり、以下の優先順位で評価されます。

```
OK
NO_MANDATE
REVOKED
EXPIRED
TOKEN_NOT_ALLOWED
OVER_TX_CAP
```

ゲートが独立したコントラクトであるため、1つのポリシーエンジンが多くの資産をサポートでき、コードがバイト固定されているため、独立した資産とゲートはそれらを等価性で比較できます。ゲートは独自のコードを追加できます。`OK`以外のすべてのコードは拒否（denial）を意味します。

意図的に除外されているのは、委任がどのように付与され、誰が付与するか（スコープ外）、受取人の適格性（ERC-7943側、並行してレイヤー化される）、および累積的な期間ごとの上限（共有会計状態が必要なため、付随的な拡張）です。

位置付け。ERC-7943はすでにブーリアン値の`canTransfer`と型付きエラーで強制を義務付けています。本提案は、その強制力を維持しつつ、判断を外部化し、拒否を自己記述可能にします。ERC-8226（規制されたエージェント委任）が最も近い隣接提案です。これはアイデンティティ/コンプライアンスをバンドルしており、その統合セクションを読む限り、委任レジストリはトークンの既存の転送前フックを通じて強制し、支出パスはブーリアン値（`isActiveForAmount`）として表面化されます。そのフックが本提案が埋める隙間であり、両者は連携します。つまり、8226スタイルのレジストリは、このようなゲートを通じて強制し、単なるブーリアン値ではなく、支出理由語彙を得ることができます。8226の著者たちがこれをどのように見ているか興味があります。

完全なドラフト（`IGatedAsset`を含む完全なインターフェース、正確なバイト値を持つ予約済みコード、資産義務、`STATICCALL`/フェイルクローズルール、セキュリティに関する考慮事項）は、[[glossary/PR|プルリクエスト (PR)]]と共に出します。まずはここでその概要を提示したかったのです。

フィードバックを特に歓迎するのは、理由語彙とその優先順位、および「ゲートを独立したコントラクトとする」という連携点についてです。

*3件の投稿 - 3名の参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-asset-enforced-spend-mandate/28831)
