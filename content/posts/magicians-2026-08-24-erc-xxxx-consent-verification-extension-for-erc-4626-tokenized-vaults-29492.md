---
title: 'ERC-XXXX: ERC-4626トークン化ボルト向け同意検証拡張'
original_title: 'ERC-XXXX: Consent Verification Extension for ERC-4626 Tokenized Vaults'
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-xxxx-consent-verification-extension-for-erc-4626-tokenized-vaults/29492
author: WeissCurry
date: '2026-08-24'
category: ERCs
tags:
  - ercs
  - erc
  - smart-contracts
  - security
  - applications
  - ux
  - protocol-design
  - erc-4626-extension
  - consent-verification
topic_id: '29492'
translated_at: '2026-08-25'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX: Consent Verification Extension for ERC-4626 Tokenized Vaults](https://ethereum-magicians.org/t/erc-xxxx-consent-verification-extension-for-erc-4626-tokenized-vaults/29492) — WeissCurry (2026-08-24)

**著者:** Maulana Asykari Muhammad ([@WeissCurry](https://ethereum-magicians.org/u/weisscurry)), Muhammad Zidan Fatonie ([@mzf11125](https://ethereum-magicians.org/u/mzf11125)), Faisal Firdani ([@zexoverz](https://ethereum-magicians.org/u/zexoverz))
**タイプ:** Standards Track
**カテゴリ:** [[glossary/ERC|ERC]]
**ステータス:** Draft

## **概要**

この[[glossary/ERC|ERC]]は、[[glossary/ERC-4626|ERC-4626]]トークン化ボルト向けのオプションの拡張インターフェースを提案します。これにより、ボルトは新しいデポジットやミント操作を受け入れる前に、特定の合意に対するユーザーの承諾を検証できるようになります。

この拡張は、標準化された同意レジストリインターフェースを導入し、ボルトが、暗号学的ハッシュによって識別される特定の合意をアドレスが承諾したかどうかを検証できるようにします。

同意記録は、ボルトの規約、リスク開示、投資条件、運用要件、またはその他のユーザーの承諾を表す場合があります。

この提案は、[[glossary/ERC-4626|ERC-4626]]の会計モデルを変更するものではありません。この拡張を実装する[[glossary/ERC-4626|ERC-4626]]ボルトは、標準の[[glossary/ERC-4626|ERC-4626]]インターフェースを引き続き公開しつつ、状態を変更するデポジット操作の前にオプションの同意検証レイヤーを追加します。

# **動機**

[[glossary/ERC-4626|ERC-4626]]は、デポジット、引き出し、シェアのミント、償還を含むトークン化ボルトの機能を標準化します。

しかし、[[glossary/ERC-4626|ERC-4626]]は、ユーザーがボルトとインタラクトする前に必要な情報を承諾したかどうかを検証するメカニズムを定義していません。

アプリケーションは、ユーザーに以下を明示的に承諾するよう要求する場合があります。

-   ボルトの規約
-   リスク開示
-   投資条件
-   法的合意
-   運用ポリシー

現在の実装は、これらの要件を個別に処理しています。これにより、プロトコル間で一貫性のない同意ストレージモデルと異なる検証アプローチが生じています。

この提案は、ボルトの会計と同意管理の分離を維持しつつ、同意対応[[glossary/ERC-4626|ERC-4626]]ボルト向けの共通インターフェースを導入します。

# **仕様**

## **同意レジストリインターフェース**

同意レジストリは同意記録を保存し、検証します。

```solidity
interface IERCXXXXConsentRegistry {

    /**
     * @notice Returns whether a user has valid consent
     * for a specific agreement.
     */
    function hasValidConsent(
        address user,
        bytes32 agreementHash
    )
        external
        view
        returns (bool);

    /**
     * @notice Returns the timestamp when consent was registered.
     */
    function consentTimestamp(
        address user,
        bytes32 agreementHash
    )
        external
        view
        returns (uint256);

    /**
     * @notice Registers consent for the caller.
     */
    function registerConsent(
        bytes32 agreementHash
    )
        external;

    event ConsentRegistered(
        address indexed user,
        bytes32 indexed agreementHash,
        uint256 timestamp
    );
}
```

実装は、署名や外部[[glossary/Attestation|アテステーション（証明）]]を含む追加の同意作成メカニズムをサポートしてもよい (MAY)。

# **ERC-4626同意拡張インターフェース**

この拡張を実装する[[glossary/ERC-4626|ERC-4626]]ボルトは、同意レジストリと必須の合意識別子を公開しなければならない (MUST)。

```solidity
interface IERC4626Consent {

    /**
     * @notice Returns the Consent Registry used by the vault.
     */
    function consentRegistry()
        external
        view
        returns(address);

    /**
     * @notice Returns the agreement hash required for interaction.
     */
    function requiredAgreementHash()
        external
        view
        returns(bytes32);
}
```

# **ERC-165インターフェース検出**

同意対応ボルトは[[glossary/ERC-165|ERC-165]]インターフェース検出をサポートすべきである (SHOULD)。

アプリケーションは、ボルトがこの拡張を実装しているかどうかを[[glossary/ERC-165|ERC-165]]を使用して判断してもよい (MAY)。

例:

```solidity
type(IERC4626Consent).interfaceId
```

# **デポジットとミントの検証**

この拡張を実装するボルトは、以下を実行する前に同意を検証しなければならない (MUST)。

`deposit()`

および:

`mint()`

検証は以下をチェックしなければならない (MUST)。

```solidity
IERCXXXXConsentRegistry(consentRegistry())
    .hasValidConsent(
        receiver,
        requiredAgreementHash()
    );
```

例:

```solidity
function deposit(
    uint256 assets,
    address receiver
)
    public
    override
    returns(uint256 shares)
{
    require(
        IERCXXXXConsentRegistry(consentRegistry())
            .hasValidConsent(
                receiver,
                requiredAgreementHash()
            ),
        "Consent required"
    );

    return super.deposit(
        assets,
        receiver
    );
}
```

# **引き出しと償還の動作**

この拡張は以下を制限してはならない (MUST NOT)。

`withdraw()`

または:

`redeem()`

ユーザーが既存の資産を引き出す能力は、将来の同意要件とは独立していなければならない (MUST)。

同意検証は、追加のエクスポージャーを生み出す新しいボルトインタラクションにのみ適用されます。

# **同意の作成**

この提案は、特定の同意作成メカニズムを要求しません。

実装は以下をサポートしてもよい (MAY)。

## **直接オンチェーン同意**

ユーザーは直接同意を登録できます。

```solidity
registerConsent(
    agreementHash
)
```

レジストリは同意記録を`msg.sender`と関連付けなければならない (MUST)。

## **EIP-712署名同意**

実装はオフチェーン署名をサポートしてもよい (MAY)。

構造の例:

```solidity
struct Consent {
    address user;
    bytes32 agreementHash;
    uint256 nonce;
    uint256 deadline;
}
```

署名ベースの実装は、[[glossary/nonce|ナンス]]保護、[[glossary/deadline|デッドライン]]検証、[[glossary/domain-separation|ドメイン分離]]、チェーン識別子を含まなければならない (MUST)。

## **外部クレデンシャルとアテステーション**

同意レジストリは外部クレデンシャルシステムを使用してもよい (MAY)。

例としては以下が含まれます。

-   [[glossary/ERC-721|ERC-721]]クレデンシャル
-   [[glossary/ERC-1155|ERC-1155]]クレデンシャル
-   譲渡不可能なトークン
-   [[glossary/Attestation|アテステーション（証明）]]プロトコル

実装は、クレデンシャルが以下に解決されることを保証しなければならない (MUST)。

1.  特定のユーザー
2.  特定の合意ハッシュ

# **合意のバージョン管理**

合意はハッシュを使用して識別されます。

例:

```solidity
agreementHash =
    keccak256(documentBytes);
```

URIはメタデータとして保存されてもよい (MAY)。

ハッシュは、ユーザーによって承諾された正確な合意バージョンを表します。

ボルトが必要な合意ハッシュを更新する場合:

```solidity
event AgreementUpdated(
    bytes32 indexed agreementHash,
    string agreementURI
);
```

以前の同意記録は、ボルトの要件を満たさなくなる可能性がある (MAY)。

ユーザーは、追加のシェアをデポジットまたはミントする前に、新しい合意バージョンに対する同意を提供しなければならない (MUST)。

# **理論的根拠**

## **責任の分離**

[[glossary/ERC-4626|ERC-4626]]ボルトは以下の責任を負います。

-   資産会計
-   シェア計算
-   デポジット
-   引き出し

同意レジストリは以下の責任を負います。

-   承諾の保存
-   同意の検証
-   同意記録の管理

この分離により、[[glossary/ERC-4626|ERC-4626]]の会計ロジックを変更することなく、異なる同意メカニズムが可能になります。

## **ERC-4626互換性**

この提案は、既存の[[glossary/ERC-4626|ERC-4626]]関数を置き換えるものではありません。

以下の関数は変更されません。

`deposit()`

`mint()`

`withdraw()`

`redeem()`

同意検証は、特定の状態変更の前に適用される追加の要件です。

## **合意の識別**

URLの代わりにハッシュを使用することで、文書の変更によって生じる曖昧さを防ぎます。

URLは更新されたコンテンツを指す可能性がありますが、暗号学的ハッシュは正確に承諾されたバージョンを識別します。

# **セキュリティに関する考慮事項**

## **署名リプレイ保護**

[[glossary/EIP-712-attestation-profile|EIP-712]]実装は、[[glossary/nonce|ナンス]]、[[glossary/deadline|デッドライン]]、[[glossary/domain-separation|ドメイン分離]]、チェーン識別子を使用してリプレイ攻撃から保護しなければならない (MUST)。

## **クレデンシャルの譲渡可能性**

同意クレデンシャルは、明示的に意図されていない限り、譲渡可能であるべきではない (SHOULD NOT)。

譲渡可能なクレデンシャルは、あるアドレスが別のアドレスによって元々提供された同意を使用することを可能にする可能性があります。

## **合意の完全性**

実装は、ボルトが必要とする正確な合意ハッシュを検証しなければならない (MUST)。

文書URL単独では同意の証明として扱われるべきではない (SHOULD NOT)。

## **同意の有効期限**

同意レジストリの実装は、有効期限ポリシーをサポートしてもよい (MAY)。

有効期限が存在する場合、`hasValidConsent()`は有効期限後に`false`を返さなければならない (MUST)。

# **後方互換性**

既存の[[glossary/ERC-4626|ERC-4626]]ボルトは影響を受けません。

同意対応ボルトとインタラクトするアプリケーションは、[[glossary/ERC-165|ERC-165]]を通じて拡張を検出し、デポジットまたはミントトランザクションを送信する前に同意を検証してもよい (MAY)。

この拡張を使用しないアプリケーションは、変更を必要としません。

# **参照実装**

![ERC-4626同意検証プロセスを示す、クリーンでプロフェッショナルなフローチャート。ステップ1：「ユーザー」ノードが「ERC-4626ボルト」を「deposit()/mint()」というラベルで指す。ステップ2：「ERC-4626ボルト」が「同意レジストリ」を「同意を検証」というラベルで指す。ステップ3：「同意レジストリ」が「ERC-4626ボルト」を「有効性を確認」というラベルで指し返す。ステップ4：「ERC-4626ボルト」が「ユーザー」を「シェアを発行」というラベルで指し返す。フローチャートは標準的な長方形のプロセスブロックと明確な方向矢印を使用している。](https://ethereum-magicians.org/uploads/default/optimized/3X/b/1/b190f3d85426b0e2c78f4d51f2e9e999e796ae29_2_444x332.jpeg)

参照実装は以下を提供すべきである (SHOULD)。

-   `IERCXXXXConsentRegistry`
-   `ConsentRegistry`
-   `IERC4626Consent`
-   `ERC4626ConsentVault`

実装は[[glossary/ERC-4626|ERC-4626]]の会計動作を維持しなければならない (MUST)。

# **未解決の質問**

1.  [[glossary/ERC-165|ERC-165]]サポートは推奨ではなく必須とすべきか？
2.  同意の有効期限ルールは標準化すべきか？
3.  合意メタデータは既存のメタデータ標準に従うべきか？
4.  同意レジストリの実装はバッチ同意検証をサポートすべきか？

# **結論**

[[glossary/ERC|ERC]]-XXXXは、[[glossary/ERC-4626|ERC-4626]]トークン化ボルト向けの標準化された同意検証レイヤーを導入します。

この拡張により、[[glossary/ERC-4626|ERC-4626]]互換性を維持しつつ、ボルトが合意に対するユーザーの承諾を要求することを可能にします。

この提案は、同意管理をボルト会計から分離し、実装が署名、クレデンシャル、または[[glossary/Attestation|アテステーション（証明）]]システムを使用できるようにします。

著作権とライセンス

著作権および関連する権利はCC0により放棄されます。

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/erc-xxxx-consent-verification-extension-for-erc-4626-tokenized-vaults/29492)
