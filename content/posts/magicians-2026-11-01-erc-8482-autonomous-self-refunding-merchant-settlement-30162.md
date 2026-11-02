---
title: 'ERC-8482: 自律型自己返金マーチャント決済'
original_title: 'ERC-8482: Autonomous Self-Refunding Merchant Settlement'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-8482-autonomous-self-refunding-merchant-settlement/30162
author: Lambertvs
date: '2026-11-01'
category: ERCs
tags:
  - ercs
  - payments
  - smart-contracts
  - ux
  - protocol-design
  - merchant-settlement
  - escrow
topic_id: '30162'
translated_at: '2026-11-02'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-8482: Autonomous Self-Refunding Merchant Settlement](https://ethereum-magicians.org/t/erc-8482-autonomous-self-refunding-merchant-settlement/30162) — Lambertvs (2026-11-01)

## 概要

この提案は、オープンで非カストディアルな[[glossary/merchant-settlement|マーチャント決済]]インターフェースと[[glossary/escrow|エスクロー]]アーキテクチャを規定します。現在の小売向け暗号通貨決済ゲートウェイ（例: BVNK、BitPay）は、支払者に対し、[[glossary/ERC-20|ERC-20]]/TRC-20トークンを監視されていない生の外部アドレスに直接送金するよう指示しています。少額の支払い不足や手数料不足が発生した場合、中央集権型スイーパーは資金を独自の企業マスターボルトに吸収し、バックエンドのWebhookが注文を未完了としてフラグ付けするため、プロトコルレベルでの是正措置なしに支払者の資金が捕捉されてしまいます。

この標準は、以下の特徴を持つ不変の[[glossary/escrow|エスクロー]]およびチェックアウト[[glossary/smart-contracts|スマートコントラクト]]インターフェースを規定します。

1.  請求書は、正確な支払いまたは累積支払いによってアトミックに決済されます。
2.  支払い不足の資金は、マーチャントまたはゲートウェイのカストディなしに、[[glossary/smart-contracts|スマートコントラクト]][[glossary/escrow|エスクロー]]にロックされたままになります。
3.  支払者は、有効期限が切れた際に、マーチャントの同意や仲介者の介入なしに、決定論的な返金を自律的にトリガーできます。

## 動機

小売消費者とマーチャントは現在、不透明な金融ブラックボックスとして機能する中央集権型決済プロセッサに依存せざるを得ません。

-   **不足の罠:** ネットワーク手数料の控除により、しばしば少額の支払い不足が発生します（例: 期待額64.66 USDTに対し、受領額57.33 USDT）。
-   **不当な利得:** 中央集権型ゲートウェイは、流動性を維持するために、支払い不足のトークンを数百万ドル規模のマスターボルトに吸収し、同時に注文を未完了としてフラグ付けします。
-   **サポートのたらい回し:** マーチャントは責任を否定し（「アドレスは当社が提供したものではありません」）、プロセッサは小売消費者への対応を拒否し（「当社はB2Bマーチャントのみを対象としています」）、捕捉された資金は未割り当ての企業浮動資金となります。

[[glossary/smart-contracts|スマートコントラクト]][[glossary/merchant-settlement|決済]]インターフェースを標準化することで、Web3ウォレット（例: MetaMask、Trust Wallet）は、ユーザーが生のデポジットアドレスに資金を送金することに対して警告を発し、代わりに検証可能で自己返金型の[[glossary/smart-contracts|スマートコントラクト]]チェックアウトとのやり取りを義務付けることができます。

## 仕様

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC_SovereignCheckout {
    enum InvoiceStatus { Active, Settled, Refunded, Cancelled }

    struct Invoice {
        bytes32 invoiceId;
        address merchant;
        address payer;
        address refundAddress;
        address token;
        uint256 expectedAmount;
        uint256 amountPaid;
        uint256 expiryTimestamp;
        InvoiceStatus status;
    }

    event InvoiceCreated(bytes32 indexed invoiceId, address indexed merchant, address indexed token, uint256 expectedAmount, uint256 expiryTimestamp);
    event PaymentReceived(bytes32 indexed invoiceId, address indexed payer, uint256 amount, uint256 totalPaid, uint256 remaining);
    event InvoiceSettled(bytes32 indexed invoiceId, address indexed merchant, uint256 totalAmount);
    event AutonomousRefundClaimed(bytes32 indexed invoiceId, address indexed recipient, uint256 amountRefunded);
    event InvoiceCancelled(bytes32 indexed invoiceId);

    function createInvoice(bytes32 invoiceId, address token, uint256 expectedAmount, uint256 durationSeconds) external;
    function payInvoice(bytes32 invoiceId, uint256 amount, address refundAddress) external;
    function claimRefund(bytes32 invoiceId) external;
    function merchantCancelAndRefund(bytes32 invoiceId) external;
}
```

## 理論的根拠

-   **決済前のマーチャントカストディなし:** 支払者を保護するため、[[glossary/escrow|エスクロー]]に預けられたトークンは、`amountPaid >= expectedAmount`でない限り、マーチャントによって転送可能であってはなりません。
-   **自律的な返金経路:** `claimRefund`関数は、`block.timestamp > expiryTimestamp`となった時点で、自動化されたキーパーネットワークまたは支払者がトークンを直ちに回収できるように、パーミッションレスである必要があります。

## 参照実装とリポジトリ

オープンソースの参照実装と完全な技術マニフェストはGitHubで公開されています。

[github.com](https://github.com/Lambertvs/sovereign-payer-protocol)

![](https://opengraph.githubassets.com/9429fe1766968e98907b18b138bb6ac6/Lambertvs/sovereign-payer-protocol)

### [GitHub - Lambertvs/sovereign-payer-protocol: 自律型自己返金マーチャント決済...](https://github.com/Lambertvs/sovereign-payer-protocol)

暗号通貨チェックアウトにおける支払い不足デポジットの罠を排除するための、自律型自己返金[[glossary/merchant-settlement|マーチャント決済]]標準。

イベントインデックス作成、ガス最適化、およびウォレット抽象化の統合に関するコミュニティからのフィードバックを歓迎します。

*6件の投稿 - 3名の参加者*

[トピック全体を読む](https://ethereum-magicians.org/t/erc-8482-autonomous-self-refunding-merchant-settlement/30162)
