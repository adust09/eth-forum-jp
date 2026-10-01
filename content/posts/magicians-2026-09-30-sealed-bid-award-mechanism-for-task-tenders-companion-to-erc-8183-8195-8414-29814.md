---
title: タスク入札のための封印入札アワードメカニズム（ERC-8183 / 8195 / 8414のコンパニオン）
original_title: >-
  Sealed-Bid Award Mechanism for Task Tenders (companion to ERC-8183 / 8195 /
  8414)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/sealed-bid-award-mechanism-for-task-tenders-companion-to-erc-8183-8195-8414/29814
author: JCXsivan
date: '2026-09-30'
category: ERCs
tags:
  - ercs
  - economics
  - mechanism-design
  - smart-contracts
  - eip
  - applications
  - ai-agents
topic_id: '29814'
translated_at: '2026-10-01'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Sealed-Bid Award Mechanism for Task Tenders (companion to ERC-8183 / 8195 / 8414)](https://ethereum-magicians.org/t/sealed-bid-award-mechanism-for-task-tenders-companion-to-erc-8183-8195-8414/29814) — JCXsivan (2026-09-30)

## ギャップ

エージェントタスクスタック (agent task stack) には、タスクを投稿し決済するための3つの方法がある。[[ERC-8183|ERC-8183]]は単一のジョブをエスクローし、エバリュエーター (evaluator) がそれをリリースできるようにする。[[ERC-8195|ERC-8195]]は5つの調達モード (procurement modes) を定義している。[[ERC-8414|ERC-8414]]はタスク自体を、内部にボールト (vault) を持つ[[ERC-721|ERC-721]]にする。これら3つすべてが、同じ問題を標準の範囲外に残している。すなわち、複数のエージェントが1つのタスクを望む場合、誰が落札し、いくらで落札されるのか、という問題だ。

-   [[ERC-8183|ERC-8183]]はオフチェーンフックを通じて入札を実行し、`setProvider`を通じて結果を受け取るだけである（例2を参照）。
-   [[ERC-8195|ERC-8195]]のオークションモード (Auction mode) は、入札をオフチェーンで中継し、最低入札額が勝つようにハードコードされている。スレッドでは、インターフェースレベルで入札の[[Commit-and-Reveal-Scheme|コミット＆リビール方式]]構造がないことがすでに指摘されているが、その点は取り上げられなかった。
-   [[ERC-8414|ERC-8414]]は、入札が[[ERC-8414|ERC-8414]]のカーネル (kernel) ではなく、コンパニオン拡張機能であることを明言している。

そのため、各市場は独自のアワードロジックを記述し、同じエージェントが3つの互換性のないルールで入札を行い、どのインデクサー (indexer) もアワードが何を意味したのか、価格が公正だったのかを判断できない。

## 本提案の内容

この問題のみに答える小さなコンパニオン標準。以下の3点を修正する。

1.  封印入札手順 (sealed-bid procedure): コミット、リビール、アワード。リビール時に返還され、沈黙時にはスラッシュ (slashed) されるボンド (bond) を伴う。
2.  テンダーコントラクト (tender contract) がリビール完了後に一度呼び出す、ステートレスメカニズムインターフェース (stateless mechanism interface) `award(bids, reserve, units) → (winner, price)`。
3.  3つのノーマティブな価格決定ルール (normative pricing rules): ファーストプライス (first-price)、セカンドプライス (second-price)（[[Vickrey|ヴィックリー]]）、および同一ユニットに対するユニフォームプライス (uniform-price)。その他のルールは、同じインターフェースを実装するプラグイン (plugin) として提供される。

これはタスク資金を保持せず、成果物を評価せず、レピュテーションを記録しない。[[ERC-8183|ERC-8183]]のフックが`setProvider`と`setBudget`に渡せるアワード、[[ERC-8195|ERC-8195]]のオークションモードコントラクトが`selectLowestBidder`の代わりに読み取れるアワード、または[[ERC-8414|ERC-8414]]のエリジビリティプロファイル (eligibility profile) が記録上の履行者 (fulfiller) に要求できるアワードを返す。

## この形式を採用する理由

この設計は、マイアソン (Myerson) の最適オークション (optimal auction) の結果（Mathematics of Operations Research, 1981）に従っており、各エージェントのコストがプライベートタイプ (private type) である調達問題 (procurement problem) として解釈される。

-   **開示原理 (Revelation principle)。** 実行可能な任意のオークションは、直接メカニズム (direct mechanism) と同等である。すなわち、入札者 (bidders) がタイプ (type) を報告し、メカニズム (mechanism) がアロケーション (allocation) と支払い (payment) を計算する。したがって、オンチェーンインターフェース (on-chain interface) はまさにその2つの関数であるべきであり、[[Commit-and-Reveal-Scheme|コミット＆リビール方式]]が公開台帳 (public ledger) 上で封印された報告を信頼できるものにする。
-   **収益等価原理 (Revenue equivalence)。** リクエスター (requester) の期待支払い (expected payment) は、アロケーションルール (allocation rule) とリザーブ (reserve) が固定されると決まる。したがって、標準はこれら2つを固定するだけでよく、価格決定ルール (pricing rule) はプラグイン (plugin) に任せても、リクエスターが支払うと予想される金額は変わらない。
-   **リザーブ付きセカンドプライスは対称正規ケースで最適であり、その支払いルールには分布パラメータが含まれない (Second-price with a reserve is optimal in the symmetric regular case, and its payment rule contains no distributional parameters)。** これが[[Vickrey|ヴィックリー]]が推奨されるデフォルトである理由である。リクエスターの、エージェントのコストに関する信念が間違っていても、インセンティブ整合性 (incentive compatible) が維持され、異なるオペレーターの自律エージェント (autonomous agents) は、ファーストプライス (first-price) の下で入札するための共有事前分布 (shared prior) を持たないためである。
-   **最適なリザーブはリクエスターの外部価値よりも厳しく、落札なしも正当な結果である (The optimal reserve is strictly tighter than the requester’s outside value, and no-award is a legitimate outcome)。** したがって、`reserve`はフックがたまたま参照する予算ではなく、それ自身のフィールドとなる。
-   **差別的ルールと相関タイプメカニズムは意図的にスコープ外とする (Discriminating rules and correlated-type mechanisms are deliberately out of scope)。** 前者にはビッダーごとの信念 (per-bidder beliefs) が必要であり、後者にはリクエスターが敗者入札者に支払う必要があるが、これは金庫標準 (vault standards) が禁止している。どちらもプラグイン (plugin) として表現可能である。

## インターフェース

```
interface IAwardMechanism {
    struct Bid   { address bidder; uint256 amount; }   // amount = price asked
    struct Award { address winner; uint256 price;  }

    function mechanismId() external pure returns (bytes4);   // bytes4(keccak256("award.vickrey")) etc.

    /// MUST be pure. Bids arrive in commit order. Empty return = no award.
    /// No winner may have bid above reserve; no price may exceed reserve;
    /// lowering one bid must never remove that bidder from the award; ties go to the earlier commit.
    function award(Bid[] calldata bids, uint256 reserve, uint256 units)
        external pure returns (Award[] memory);
}

```

```
interface ISealedBidTender {
    enum Phase { None, Commit, Reveal, Awarded, Void }

    struct TenderTerms {
        bytes32 taskRef;         // the task in whichever escrow standard opened this tender
        address mechanism;       // IAwardMechanism
        uint256 reserve;         // > 0
        uint256 units;           // >= 1
        uint64  commitDeadline;
        uint64  revealDeadline;  // > commitDeadline
        uint256 bond;            // escrowed per commit, returned on reveal, slashed otherwise
        address bondAsset;       // address(0) = native
    }

    event TenderOpened(bytes32 indexed tenderId, bytes32 indexed taskRef, address indexed requester,
                       address mechanism, uint256 reserve, uint256 units, uint64 commitDeadline, uint64 revealDeadline);
    event BidCommitted(bytes32 indexed tenderId, address indexed bidder, bytes32 commitment);
    event BidRevealed(bytes32 indexed tenderId, address indexed bidder, uint256 amount);
    event BidSlashed(bytes32 indexed tenderId, address indexed bidder, uint256 bond);
    event TenderAwarded(bytes32 indexed tenderId, address indexed winner, uint256 price, bytes4 mechanismId);
    event TenderVoid(bytes32 indexed tenderId);

    function openTender(TenderTerms calldata terms) external returns (bytes32 tenderId);
    // commitment = keccak256(abi.encode(tenderId, msg.sender, amount, salt))
    function commitBid(bytes32 tenderId, bytes32 commitment) external payable;
    function revealBid(bytes32 tenderId, uint256 amount, bytes32 salt) external;
    function finalize(bytes32 tenderId) external returns (IAwardMechanism.Award[] memory);

    function termsOf(bytes32 tenderId) external view returns (TenderTerms memory);
    function requesterOf(bytes32 tenderId) external view returns (address);
    function phaseOf(bytes32 tenderId) external view returns (Phase);
    function awardOf(bytes32 tenderId) external view returns (IAwardMechanism.Award[] memory);
}

```

リビールされた金額をb(1) ≤ b(2) ≤ …とソートし、リザーブをrとした場合の規範的ルール：

| id | 落札者 | 価格 | 落札条件 |
| --- | --- | --- | --- |
| award.first-price | 最低価格のユニット入札 | 自身の入札額 | 入札額 ≤ r |
| award.vickrey (units = 1) | 最低価格の入札 | min(b(2), r)、単独の場合はr | b(1) ≤ r |
| award.uniform-price | 最低価格のユニット入札 | min(b(units+1), r) | 入札額 ≤ r |

ユニフォームプライス (uniform-price) は入札者あたり1ユニットにスコープされている。複数ユニットの需要にはVCGプラグイン (VCG plugin) を使用すべきである。

## フォーラムの意見を伺いたい点

1.  **ファーストクラスフィールドとしてのリザーブ (Reserve as a first-class field)。** 最適なリザーブはより厳しく、落札なしも許容されるべきであることを考えると、エスクロー標準は予算や`maxPrice`とは別にリザーブを公開すべきか？
2.  **入札者の異質性 (Bidder heterogeneity)。** [[ERC-8004|ERC-8004 (エージェントIDレジストリ)]]のレピュテーションはエージェントを非対称にし、非対称最適オークション (asymmetric optimal auctions) は差別化を行う。スコアリングルール (scoring rules) はメカニズムプラグイン (mechanism plugin) とすべきか、それとも標準から完全に除外すべきか？
3.  **ボンド (Bonds)。** リビールされないコミットメントは何らかのコストを伴うべきであり、さもなければ[[Commit-and-Reveal-Scheme|コミット＆リビール方式]]はグリーフ (grief) 行為を自由に実行できる。ドラフトされているようにカーネルフィールド (Kernel field) とすべきか、それともアドミッションフック (admission hook) とすべきか？
4.  **コンポジション (Composition)。** ステートレスな`IAwardMechanism`は、[[ERC-8183|ERC-8183]]のフック、[[ERC-8195|ERC-8195]]の`selectWorker`、および[[ERC-8414|ERC-8414]]のエリジビリティプロファイル (eligibility profile) にとって十分か、それともそれぞれにアダプター (adapter) が必要か？特に[[ERC-8183|ERC-8183]]の場合、フックがジョブに対して`setProvider`と`setBudget`を呼び出すことは許容されるか、それともクライアント (client) がそれらに署名する必要があるか？

完全なドラフトテキストは[[EIP|EIP（Ethereum 改善提案）]]テンプレートに従い、このスレッドで最初のラウンドが終了次第、ethereum/ERCsへのプルリクエスト (PR) として公開される予定である。リファレンス実装 (Reference implementation) とテストベクトル (test vectors) は後日公開される。テストベクトルは単調性条件 (monotonicity condition) を主張し、[[Vickrey|ヴィックリー]]については、正直な入札 (truthful bidding) が支配的 (dominant) であることを主張する。仕様テキスト (Spec text) は[[CC0|CC0]]である。

*2投稿 - 2参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/sealed-bid-award-mechanism-for-task-tenders-companion-to-erc-8183-8195-8414/29814)
