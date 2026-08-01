---
title: ファンジブルエージェントトークン (FAT) — オンチェーン経済エンティティとしてのAIエージェントの最小標準
original_title: >-
  [Draft] Fungible Agent Tokens (FAT) — a minimal standard for AI agents as
  on-chain economic entities
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/draft-fungible-agent-tokens-fat-a-minimal-standard-for-ai-agents-as-on-chain-economic-entities/29220
author: Ashton
date: '2026-07-31'
category: ERCs
tags:
  - ercs
  - ai-agents
  - smart-contracts
  - economics
  - protocol-design
  - eip
  - identity
topic_id: '29220'
translated_at: '2026-08-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [[Draft] Fungible Agent Tokens (FAT) — a minimal standard for AI agents as on-chain economic entities](https://ethereum-magicians.org/t/draft-fungible-agent-tokens-fat-a-minimal-standard-for-ai-agents-as-on-chain-economic-entities/29220) — Ashton (2026-07-31)

# [[glossary/Fungible-Agent-Tokens|ファンジブルエージェントトークン (FAT)]]プロトコル

*これは可読性を高めるために要約されたプレゼンテーションです。完全な仕様テキストは [Fungible Agent Tokens (FAT) Protocol - HackMD](https://hackmd.io/@Ashton/SyTedG5SGg) にあります — 以下のセクション参照（§2、§6.2、§7など）はその番号付けを指します。*

## 概要

**[[glossary/Fungible-Agent-Tokens|FAT（ファンジブルエージェントトークン）]]** は、AIエージェントをオンチェーン経済エンティティとして定義するエクイティ標準です。[[glossary/Fungible-Agent-Tokens|FAT]]エージェントは資金を保持するコンテナではなく、自律的なアクターです。自身の経済活動におけるエクイティを表す「シェア」を**発行**し、設定された境界内で**自律的に行動**し、取るすべてのアクションに対して**改ざん防止可能な推論記録**を残します。このプロトコルは、これら3つのレイヤーを単一のインターフェースに統合します。

-   **自律実行 (Autonomous Execution)** — エージェントは[[glossary/Executor|エグゼキューター]]を通じてオンチェーンで行動し、外部プロトコルと対話し、自身の資金を展開します。
-   **エクイティ発行 (Equity Issuance)** — エージェントは、その経済的パフォーマンスに対する請求権を表すファンジブルな**シェア**を発行し、標準的な交換レートで参入および退出が可能です。
-   **推論アテステーション (Reasoning Attestation)** — オフチェーンのメタデータとアクションごとの推論記録が、エージェントのアイデンティティ、戦略、モデル、およびすべての決定の根拠をオンチェーンのアイデンティティにアンカーします。

これにより、あらゆるエージェントが独立した経済エンティティとして**誕生し、資本化され、自己運用される**ことが可能になります。これはエコシステム全体にとってコンポーザブルなオンチェーンプリミティブです。

具体的には、[[glossary/Fungible-Agent-Tokens|FAT]]エージェントは以下のスマートコントラクトです。

-   単一の**受理トークン (Accept Token)**（デプロイ時に選択され、不変の[[glossary/ERC-20|ERC-20]]）で指定された資本拠出を、二段階の「リクエスト・その後クレーム」フローを通じて受け入れ、それに対してファンジブルな**シェア**を発行します。
-   保有者が償還をリクエストし、その後エスクローされたシェアに対して受理トークンをクレームすることで退出できるようにします。シェアは決済時にバーンされます。
-   シェアと受理トークン間の規範的なオンチェーン**交換レート**を公開します。
-   オフチェーンメタデータ（名前、説明、画像など）を指す可変な**エージェントURI (Agent URI)**を保持します。
-   指定されたオフチェーンの**[[glossary/Executor|エグゼキューター]]**が、[[glossary/DELEGATECALL|DELEGATECALL]]の禁止とオーナーが設定する`isInScope`スコープゲートに従い、低レベルディスパッチプリミティブを介してエージェントに代わってサードパーティプロトコルを呼び出すことを許可します。
-   ミントと償還を**推論に基づく決済 (reasoned settlement)**（`settleMint` / `settleRedeem`）を通じて決定します。各拠出と退出の受理、価格設定、または拒否はエージェント自身の意図的な行為であり、すべてのオンチェーンエージェントアクションに**改ざん防止可能な推論記録**（`reasoningHash` + `reasoningURI`）を添付します。

ここで、**[[glossary/Fungible-Agent-Tokens|ファンジブルエージェントトークン]]**は、エージェントへの経済的参加を表すファンジブルなシェアであり、エージェントのオフチェーンのアイデンティティ、モデル、または行動ではありません。これらが標準から除外されているわけではありません。単に**ファンジブルなシェアとしては表現されない**だけです。アテステーション層は、**エージェントURI**と`reasoningHash` / `reasoningURI`を通じてそれらをオンチェーンにアンカーします。

この標準はこれらのインターフェース表面を固定しますが、実装者には意図的に以下の点を委ねています。正確なシェア価格設定式、手数料体系、シェアの譲渡可能性、所有権移転メカニズム、エージェントを一時停止できるかどうかとその方法、保有者が交換レートが反映する以上のリターンを実現できるかどうかとその方法、そして — 重要なことに — **[[glossary/Executor|エグゼキューター]]が`execute`を通じて呼び出すことができるものに対するいかなる制限**。ポリシーはインターフェースから分離されています。

## 動機

AIエージェントはオンチェーンで取引、ステーキング、貸付、資本管理など、ますます多くの行動をとっています。しかし、エージェント*自体*をオンチェーン経済エンティティにする標準は存在しません。つまり、資本化され、自己運用され、エコシステムによって構成され、その行動と推論が誰にでも読み取れるような標準です。プールされた資本をファンジブルなシェアとして表現することはすでに十分に理解されていますが、エージェントの部分 — 外部プロトコルに*どのように作用するか*、そしてそれらのアクションの背後にあるオフチェーンの推論がオンチェーンに*どのようにアンカーされるか* — には標準がありません。

[[glossary/Fungible-Agent-Tokens|FAT]]が定義するのは資金のコンテナではありません。オンチェーン経済エンティティがどのようにして誕生するかです。[[glossary/Fungible-Agent-Tokens|FAT]]エージェントは永続的なオンチェーンIDを保持し、自身の資本を指揮し、オーナーによって設定された憲法上の境界内で自律的に行動し、取るすべてのアクションに対して検証可能な記録に署名します。シェアを購入することは、あなたに代わって実行するツールを雇うことではありません。それはエージェント自身の経済活動に投資することであり、その成長に参加し、その成果を共有することです。したがって、シェアの会計処理は、エージェントの自律実行と、そのアイデンティティと推論のオフチェーンアテステーションと並んで、3つのレイヤーのうちの1つ、つまりエクイティ発行に過ぎません。この種のシステムが構成され、監査可能であるためには、行動レイヤーに標準が必要です。エージェントが選択する特定の経済モデルに関係なく、ツール、インデクサー、ウォレット、監査人が信頼できる単一のインターフェースです。

この標準は、*エージェント自体*をファーストクラスの存在にします。その**反応**（推論に基づく決済、つまりミントと償還はエージェント自身の意図的な行為であり、受動的な簿記ではない）、その**推論**（すべてのオンチェーンアクションに紐付けられた、改ざん防止可能でインデックス可能な記録）、そしてその**制限された支出**（エージェントが拡大できないオーナー設定のスコープ）は、それ自体が標準化された表面であり、エージェントが*決定すること*と*できること*が、エージェントが保持するものと同じくらい読みやすく、監査可能になります。

行動以外にも、トークン化されたエージェントには以下が必要です。

-   固定された**会計単位 (unit of account)** — デプロイ時に選択され、その後不変となる単一の**受理トークン** — これにより、シェアの価格設定と償還が曖昧でなくなります。
-   **標準的な出口パス (standard exit path)** — `requestRedeem` / `redeem`フロー — これにより、保有者はポートフォリオツールが信頼できる単一のインターフェースを通じて任意のエージェントから退出できます。
-   **発見可能なメタデータポインター (discoverable metadata pointer)** — [[glossary/ERC-721|ERC-721]]の`tokenURI`に類似した**エージェントURI** — これにより、エクスプローラーやマーケットプレイスはプロジェクトごとの統合なしにエージェントのアイデンティティをレンダリングできます。

決済は非同期である可能性があるため（ユーザーが最初にリクエストし、エージェントの準備ができたときにクレームする）、シェアは単一の同期呼び出しではなく、二段階の「リクエスト・その後クレーム」ライフサイクルを通じてミントおよび償還されます。

この仕様は、上記のすべてを最小限でコンポーザブルな標準として定義します。

## インターフェース

すべての準拠エージェントは、以下のSolidityインターフェースを実装**しなければなりません (MUST)**。関数シグネチャ、パラメータ順序、および戻り値の型は規範的です。

```solidity
// SPDX-License-Identifier: CC0-1.0
pragma solidity >=0.8.20;

interface IAgent {
    // ---------- Immutable configuration ----------

    /// @notice The single ERC-20 accepted for share purchase and paid out on redemption.
    /// @dev    MUST return the same address for the lifetime of the Agent.
    function acceptToken() external view returns (address);

    /// @notice Address of the ERC-20 Share token.
    /// @dev    MAY return `address(this)` if the Agent contract itself is the ERC-20.
    function shareToken() external view returns (address);

    // ---------- Share minting (two-phase) ----------

    /// @notice Phase 1. Deposit `amount` of the Accept Token, adding to the caller's pending mint balance.
    /// @dev    MUST pull exactly `amount` via ERC-20 `transferFrom`; MUST NOT accept native ether.
    ///         The share count is determined later, at settlement. MUST emit `MintRequested`.
    /// @param amount  The amount of Accept Token to deposit (in its smallest unit).
    function requestMint(uint256 amount) external;

    /// @notice Phase 2. Claim ALL currently-claimable shares for `user`. Permissionless: any caller MAY
    ///         trigger the claim, but the shares are always minted to `user` (the owed party), so the
    ///         caller only pays gas and gains nothing.
    /// @dev    MUST mint `user`'s entire claimable-share balance to `user`, zero that balance,
    ///         and emit `SharesMinted`. The settlement price is accepted implicitly (no slippage
    ///         guard; the share count was already fixed at settlement — see §6.3).
    /// @param  user    The owed party whose claimable shares are minted (to itself). Pass your own address to self-claim.
    /// @return shares  The number of shares minted to `user` (may be 0 if nothing is claimable).
    function mint(address user) external returns (uint256 shares);

    /// @notice Agent reaction. Settle `requester`'s pending mint request, with reasoning attached.
    /// @dev    Executor only. Settles some, all, or none of `requester`'s pendingAssets into
    ///         claimableShares; the amount/accept/price is computed by the implementation inside.
    ///         MUST emit `Settled`. `reasoningHash`/`reasoningURI` per §6.2.
    /// @param  requester      The request to settle.
    /// @param  reasoningHash  keccak256 of the bytes at `reasoningURI`; MUST be non-zero.
    /// @param  reasoningURI   Resolvable pointer to the reasoning record; MUST be non-empty.
    function settleMint(address requester, bytes32 reasoningHash, string calldata reasoningURI) external;

    /// @notice Aggregate mint status for `user`.
    /// @return pendingAssets    Accept Token deposited but not yet settled.
    /// @return claimableShares  Settled shares awaiting a `mint` claim.
    function queryMintStatus(address user)
        external
        view
        returns (uint256 pendingAssets, uint256 claimableShares);

    // ---------- Share redemption (two-phase) ----------

    /// @notice Phase 1. Escrow `shares`, adding to the caller's pending redeem balance.
    /// @dev    MUST pull (escrow) exactly `shares` of the Share token from `msg.sender`.
    ///         Settled shares are burned at settlement; payout is priced then. MUST emit `RedeemRequested`.
    /// @param shares  The number of shares to redeem.
    function requestRedeem(uint256 shares) external;

    /// @notice Phase 2. Claim ALL currently-claimable Accept Token for `user`. Permissionless: any caller
    ///         MAY trigger the claim, but the Accept Token is always paid to `user` (the owed party), so the
    ///         caller only pays gas and gains nothing.
    /// @dev    MUST transfer `user`'s entire claimable-token balance to `user`, zero that balance,
    ///         and emit `SharesRedeemed`. The settlement price is accepted implicitly (no slippage
    ///         guard; the payout was already fixed at settlement — see §6.4).
    /// @param  user    The owed party who is paid the Accept Token. Pass your own address to self-claim.
    /// @return tokens  Accept Token transferred to `user` (may be 0 if nothing is claimable).
    function redeem(address user) external returns (uint256 tokens);

    /// @notice Agent reaction. Settle `requester`'s pending redeem request, with reasoning attached.
    /// @dev    Executor only. Symmetric to `settleMint`: settles pendingShares into claimableTokens,
    ///         burning settled Shares. MUST emit `Settled`.
    function settleRedeem(address requester, bytes32 reasoningHash, string calldata reasoningURI) external;

    /// @notice Aggregate redeem status for `user`.
    /// @return pendingShares    Shares escrowed but not yet settled.
    /// @return claimableTokens  Settled Accept Token awaiting a `redeem` claim.
    function queryRedeemStatus(address user)
        external
        view
        returns (uint256 pendingShares, uint256 claimableTokens);

    // ---------- Exchange rate ----------

    /// @notice Canonical valuation rate: how many Accept Tokens one Share is worth right now, scaled by 1e18.
    /// @dev    A share-valuation / NAV reference for tooling and holdings valuation. For a fixed-price
    ///         Agent this MAY be constant; for a NAV-based Agent it varies over time. This is NOT a
    ///         predictor of mint/redeem trade outcomes — those are fixed at settlement and reported by
    ///         `queryMintStatus` / `queryRedeemStatus`.
    /// @return rate   Accept-Token base-units per 1e18 Share base-units (wei-to-wei), 18-decimal fixed point:
    ///                `x` Share base-units are worth `x * rate / 1e18` Accept-Token base-units.
    function exchangeRate() external view returns (uint256 rate);

    // ---------- Agent metadata ----------

    /// @notice URI pointing to off-chain JSON metadata describing the Agent.
    function agentURI() external view returns (string memory);

    /// @notice Set the Agent URI. Owner only. MUST emit `AgentURIUpdated`.
    function setAgentURI(string calldata uri) external;

    // ---------- Executor dispatch ----------

    /// @notice Executor dispatch, with reasoning and scope enforcement.
    /// @dev    MUST revert unless `msg.sender` is an Executor.
    ///         MUST NOT dispatch via `DELEGATECALL` (see §6.6.2).
    ///         MUST NOT be `payable`; `value` is paid from the Agent's own balance (see §6.6.4).
    ///         MUST call `isInScope(target, value, data)` and revert if it returns false (see §6.6.7).
    ///         MUST bubble the revert data unchanged on failure (and emits no event then).
    ///         MUST emit `Executed` (carrying the reasoning) on success.
    ///         `reasoningHash`/`reasoningURI` per §6.2.
    ///         Beyond the Executor check, the `DELEGATECALL` prohibition, and the `isInScope`
    ///         gate, implementers MAY layer any further policy (target allowlist, selector filter,
    ///         parameter filter, session key, signed-policy engine, rate limiter, external policy
    ///         contract, etc.) on top of this function.
    function execute(
        address target, uint256 value, bytes calldata data,
        bytes32 reasoningHash, string calldata reasoningURI
    ) external returns (bytes memory returnData);

    // ---------- Owner administration ----------

    /// @notice Enable or disable `account` as an Executor. Owner only. MUST emit `ExecutorUpdated`.
    function setExecutor(address account, bool enabled) external;

    // ---------- Views ----------

    /// @notice Address currently authorized to invoke Owner-gated functions.
    /// @dev    The mechanism by which this value changes is outside the scope of this specification.
    function owner() external view returns (address);

    function isExecutor(address account) external view returns (bool);

    /// @notice Whether an `execute` to (`target`, `value`, `data`) is within the Agent's spend scope.
    /// @dev    Implementer-defined predicate; `execute` MUST consult it (§6.6.7). The scope it reflects
    ///         is Owner-configurable only (§6.6.8). Also usable as an off-chain audit query.
    function isInScope(address target, uint256 value, bytes calldata data) external view returns (bool);
}
```

## 規範的な要点（要約）

-   **推論エンベロープ (§6.2):** すべてのエージェントアクション — `settleMint`、`settleRedeem`、`execute` — は、ゼロ以外の`reasoningHash`と、空ではなく解決可能な`reasoningURI`を**保持しなければなりません (MUST)**。ハッシュは、URIが解決するオフチェーン記録にオンチェーンでコミットします。対応関係は監査人によってオフチェーンで検証されます。
-   **二段階ミント (§6.3):** `requestMint`は預金（[[glossary/ERC-20|ERC-20]]のみ、イーサは不可）を保留残高にプルします。[[glossary/Executor|エグゼキューター]]の`settleMint`は、その一部、全部、または全くを、実装者定義の価格設定でクレーム可能なシェアに変換します。この数値はコントラクトロジックによって計算されるため、[[glossary/Executor|エグゼキューター]]は任意の量をミントすることはできません。`mint(user)`は、常に債権者に支払い、スリッページガードを持たないパーミッションレスなクレームクランクです（金額は決済時に固定されています）。
-   **二段階償還 (§6.4):** 対称的です。シェアはリクエスト時にエスクローされ、決済時にバーンされ、受理トークンの支払いはパーミッションレスにクレームされます。流動性が不足しているエージェントは、リクエストを保留のままにします。これがプロトコルの遅延流動性メカニズムです。
-   **[[glossary/Executor|エグゼキューター]]ディスパッチ (§6.6):** `execute(target, value, data, reasoningHash, reasoningURI)`は、[[glossary/Executor|エグゼキューター]]のみが呼び出し可能で**なければならず (MUST)**、[[glossary/DELEGATECALL|DELEGATECALL]]を**使用してはならず (MUST NOT)**、`payable`で**あってはならず (MUST NOT)**（値はエージェント自身の残高から支払われます）、リバートデータを変更せずにバブルアップ**しなければならず (MUST)**、オーナーが設定する`isInScope(target, value, data)`ゲートを通過**しなければなりません (MUST)**。この境界はオーナーのみが設定でき、[[glossary/Executor|エグゼキューター]]は決して拡大できません。
-   **検出:** [[glossary/ERC-165|ERC-165]]と`type(IAgent).interfaceId`を使用します。シェアトークンは[[glossary/ERC-20|ERC-20]]です（`shareToken()`はエージェントコントラクト自体である**場合があります (MAY)**）。

## プロトコルが**指定しない**こと

以下の項目は明示的にスコープ外です。実装はインターフェースと整合性のある任意の動作を選択**してもよく (MAY)**、その選択を文書化**しなければなりません (MUST)**。

-   `mint`のシェア価格設定式と、`redeem`のシェアからトークンへの変換式。
-   `mint`または`redeem`がオーナー手数料を課すかどうか、およびその金額。
-   シェアが譲渡可能かどうか。準拠エージェントは、[[glossary/ERC-20|ERC-20]]の転送をオーバーライドして、制限、一時停止、または課税**してもよい (MAY)**。そのような制限は、この標準自体が要求するライフサイクル（§6.4.1の償還エスクロープル、決済バーン、§6.3.5のクレームミント、およびエスクローされたシェアのキャンセル返還（§6.4.6））をブロック**してはなりません (MUST NOT)**。
-   **決済内部で計算される価格設定/クォータ/受理ロジック**、および[[glossary/Executor|エグゼキューター]]が決済を選択する**タイミング**。決済自体は、`settleMint` / `settleRedeem` (§6.3 / §6.4) として標準化されたエージェントアクションであるため、決済が標準操作であるか否かは固定されており、実装者定義ではありません。実装者定義のまま残るのは、その内部で計算される価格設定/クォータ/受理式（保留中の預金/エスクローされたシェアのどれだけがクレーム可能になるか、およびその価格）と、それを呼び出す[[glossary/Executor|エグゼキューター]]のタイミング — オペレーターによる履行、時間遅延、NAV/エポック終了、流動性利用可能性です。
-   **§6.2エンベロープを超える推論記録のフィールドとフォーマット** — `reasoningURI`が解決するJSON内のドメインフィールド（モデル、プロンプト、トレース、ツール呼び出し、スコアなど）。§6.2はエンベロープ（オンチェーンの`reasoningHash`バインディング、空ではない解決可能なURI、`"schema"`マーカー、および未知のフィールドの無視）のみを固定し、記録の内容は固定しません。
-   **リクエストキャンセル**および**リクエスト有効期限 / TTL**（`deadline`パラメータを含む） — リクエスターがまだ保留中の預け入れられた受理トークン / エスクローされたシェアを再請求できるかどうか、および関連するキャンセル/有効期限イベント。
-   複数のリクエストの**バッチ処理 / エポック集約型決済**。
-   **決済結果に対するスリッページ / 価格保護。** クレーム（`mint` / `redeem`）は無条件であり、決済価格を暗黙的に受け入れます。スリッページガードは持ちません。なぜなら、シェア数 / 支払いはクレームよりもずっと前の決済時に固定されており、クレーム時のガードは呼び出し者がすでに債務を負っているものを回収するのをブロックするだけであり（預金を返金することはできません）、不利な決済価格に対する保護 — 決済メカニズムによって尊重される最大価格 / 最小レート、決済前のキャンセルパスなど — は実装者定義です。
-   その他の追加の退出メカニズム — 固定償還期間、ロックアップ期間、引き出し手数料ティア、最小残高ルールなど。
-   `exchangeRate()`が一定（固定価格エージェント）であるか、時間とともに変動する（NAVベースエージェント）か。
-   保有者が交換レートがすでに反映している以上のリターンをどのように実現するか — 個別の配当 / 報酬 / 利回りクレームチャネル、定期的なMerkle配布、NFTバウチャーなど — は完全に実装者定義です。
-   **`isInScope`によって強制されるスコープポリシーの内容** — オーナーが設定するスコープがどのターゲット、関数セレクター、パラメータ、アセットごとの上限、レート制限、またはシナリオを許可するか、そしてそれがどのように表現されるか（アローリスト、セッションキー、[[glossary/EIP-712|EIP-712]]署名付き事前承認、オンチェーンポリシーコントラクト、オフチェーンポリシーエンフォーサーなど） — は実装者定義です。実装者が選択できないのは、`execute`がもはや完全に制約のないディスパッチプリミティブではないことです。この標準は`isInScope`ゲート（§6.6.7）を要求し、`execute`がそれを強制すること（`false`を返した場合にリバートすること）を義務付け、その設定がオーナーのみによって制御され、[[glossary/Executor|エグゼキューター]]が設定できないこと（§6.6.8）を要求します。ゲートの存在、強制、およびオーナーによる制御は標準によって固定されており、ゲートがエンコードするポリシーのみが実装によってレイヤー化されます。
-   エージェントが複数の[[glossary/Executor|エグゼキューター]]をサポートするか、[[glossary/Executor|エグゼキューター]]をローテーションするか、セッションキー形式の委任をサポートするか、署名ベース（メタトランザクション）の[[glossary/Executor|エグゼキューター]]呼び出しをサポートするか。
-   **リレイヤーがユーザーに代わってリクエストや[[glossary/Executor|エグゼキューター]]呼び出しを送信できるようにする、あらゆるメタトランザクション / 署名ベースのラッパー**（例: [[glossary/EIP-712|EIP-712]]署名付きインテント、[[glossary/ERC-2771|ERC-2771]]フォワーダー）。この標準は各関数の直接的な`msg.sender`セマンティクスのみを定義します。リレイヤー/フォワーダー層は追加**してもよい (MAY)**ですが、この標準の一部ではありません。
-   **エージェントがアップグレード可能かどうか** — プロキシアップグレード可能性、コントラクト移行、または完全な不変性 — は実装者定義です。アップグレード可能なエージェントは、アップグレード権限とその制約を文書化**すべきです (SHOULD)**。
-   **オーナーゲート付き関数がタイムロックまたは遅延の対象となるかどうか。** プロトコルは`setExecutor`、`setAgentURI`、またはその他の管理アクションに遅延を義務付けていません。実装は追加**してもよい (MAY)**。
-   §6.5.3の必須最小限を超えるエージェントURIメタデータスキーマ。
-   **エージェントを一時停止できるかどうかとその方法** — 関数ごとのきめ細かい一時停止、グローバル一時停止、タイムロックされた一時停止、ガーディアン制御の一時停止、または全く一時停止しないか — は完全に実装者定義です。
-   **所有権移転メカニズム** — 単一ステップ、二段階、放棄可能、ガバナンスコントラクトに紐付け、または譲渡不可 — は完全に実装者定義です。プロトコルは`owner()`が現在の管理者を報告することのみを要求します。
-   **エージェントが緊急資産救済（「スイープ」）メカニズムを公開するかどうかとその方法** — その関数シグネチャ、誰がそれを呼び出せるか（オーナーのみ、オーナー + ガーディアン、デュアルキー）、それが受理トークンまたはシェアトークンに触れることができるか、タイムロックされているかレート制限されているか、そしてどの資産を移動できるか — は完全に実装者定義です。エアドロップ、誤ったトークン送信、またはダストを蓄積するエージェントは、その回復シナリオを文書化**すべきです (SHOULD)**。完全な不変性のために設計されたエージェントは、意図的に救済パスを省略**してもよい (MAY)**。
-   **エージェントがアトミックなバッチ[[glossary/Executor|エグゼキューター]]ディスパッチ**（しばしば`executeBatch`または`multicall`と命名される）を公開するかどうかは実装者定義です。コントラクトウォレット[[glossary/Executor|エグゼキューター]]は、自身のトランザクション内で複数の`execute`呼び出しをバンドルすることで、すでにアトミック性を達成しています。バッチ処理が必要な[[glossary/EOA|EOA]] [[glossary/Executor|エグゼキューター]]は、[[glossary/Executor|エグゼキューター]]として設定された最小限のアダプターコントラクトを使用できます。独自のバッチプリミティブを追加する実装は、各サブコールが§6.6で定義された同じ`onlyExecutor`チェックと[[glossary/DELEGATECALL|DELEGATECALL]]禁止を依然として通過する限り、準拠したままです。

*2つの参照実装（不変および[[glossary/UUPS|UUPS]]、共有の[[glossary/Foundry|Foundry]]適合性スイートの下で動作は同一。未監査、[[glossary/CC0-1.0|CC0-1.0]]）が仕様に付属しており、後続の投稿でリンクされます。*

ステータス: [[glossary/Draft|ドラフト]] · [[glossary/Standards-Track|標準トラック]] ([[glossary/ERC|ERC]]) · まだ番号は要求されていません · このスレッドが仕様の`discussions-to`になります。著作権および関連する権利は[[glossary/CC0-1.0|CC0-1.0]]により放棄されています。

*5投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/draft-fungible-agent-tokens-fat-a-minimal-standard-for-ai-agents-as-on-chain-economic-entities/29220)
