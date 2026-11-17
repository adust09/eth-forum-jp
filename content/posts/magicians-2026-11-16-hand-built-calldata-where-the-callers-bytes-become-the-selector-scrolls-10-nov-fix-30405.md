---
title: 呼び出し元のバイトがセレクターとなる手動構築されたcalldata（Scrollの11月10日の修正）
original_title: >-
  Hand-built calldata where the caller's bytes become the selector (Scroll's 10
  Nov fix)
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/hand-built-calldata-where-the-callers-bytes-become-the-selector-scrolls-10-nov-fix/30405
author: Zealynx
date: '2026-11-16'
category: Magicians
tags:
  - magicians
  - security
  - smart-contracts
  - evm
  - execution-layer
  - protocol-design
  - bug-bounty
topic_id: '30405'
translated_at: '2026-11-17'
translator: gemini-2.5-flash
---

> [!note] 原文
> [Hand-built calldata where the caller's bytes become the selector (Scroll's 10 Nov fix)](https://ethereum-magicians.org/t/hand-built-calldata-where-the-callers-bytes-become-the-selector-scrolls-10-nov-fix/30405) — Zealynx (2026-11-16)

11月10日、Scrollはバグバウンティの報告を受けて[[glossary/mainnet|メインネット]]に新しいバンドル証明検証者を登録し、翌日には報告書を公開しました（[Scroll Mainnet Emergency Upgrade on 2026-11-10](https://forum.scroll.io/t/report-scroll-mainnet-emergency-upgrade-on-2026-11-10/1586)）。証明システム自体に問題はありませんでした。バグは、あるコントラクトが別のコントラクトを呼び出す方法にあり、私はそれを読んで以来、同じようなパターンを探し続けています。

### 以前のコードの挙動

`ZkEvmVerifierPostFeynman`は、アセンブリで検証者入力を手作業で構築していました。呼び出し元 (caller) の`bundleProof`の最初の0x180バイトをメモリバッファの先頭にコピーし、その後に2つの検証者ダイジェストと公開入力ハッシュを書き込み、残りの証明を付加して、生の`staticcall`でHalo2検証者にバッファを送信していました。その後、`success`のみをチェックしていましたが、これは何かが[[glossary/Revert|リバート]]しなかったことを示すだけで、どの関数が実行されたかは示しません。

そのため、その呼び出しのバイト0から3は、呼び出し元 (caller) が選択した証明のバイト0から3でした。

以前の検証者では、それは問題ではありませんでした。snark-verifierのHalo2検証者にはディスパッチャがなく、すべての呼び出しは同じコードに到達します。OpenVM 2.0検証者は、そのコードをSolidityラッパーでラップしたものです。これは型付きの`verify(bytes,bytes,bytes32,bytes32)`（セレクター`0x24270d54`）を追加し、Halo2コードをフォールバックとして保持しています。`0x24270d54`で始まる「証明」は、代わりにラッパーの`verify`を実行し、その関数は残りのバイトにあるABIオフセットから公開値を読み取ります。これも呼び出し元 (caller) が書き込んだものです。Scrollの報告書によると、古い有効な証明が新しい公開入力に対して有効とされてしまう可能性がありました。これを悪用するには、プルーバーロールまたは強制バッチモード（[[glossary/finality|ファイナリティ]]がない状態で7日後に有効になる）が必要でした。彼らは稼働中に作成された748件すべての[[glossary/finality|ファイナリティ]]をチェックし、そのプレフィックスを持つものはなかったことを確認しました。

### ガードは別のパスに存在していた

ラッパーの作成者はこの問題を予見していました。その`verify`関数は、フォールバックに自己呼び出しする前に`bytes4(proofData[0:4]) == bytes4(0x00000000)`をアサートしており、`0x24270d54`で始まる証明が`verify`にディスパッチし直されることを説明するコメントが付いていました。有効なsnark-verifier証明はそのように始まることはありません。なぜなら、最初のワードは88ビットのアキュムレータリムであるため、最初の4バイトは常にゼロだからです。

そのアサートは`verify`内でのみ実行されます。Scrollのコントラクトはフォールバックを直接呼び出していたため、その呼び出しでは最初の4バイトは何もチェックされませんでした。

### 修正

修正（[scroll-contracts#181](https://github.com/scroll-tech/scroll-contracts/pull/181)、マージコミット8264260）では、`try/catch`内で型付きインターフェースを介してラッパーを呼び出します。コンパイラがセレクターを書き込み、コントラクトがダイジェストと公開入力ハッシュを提供します。そして、Halo2フォールバックに到達するペイロードは以前とバイト単位で同じです（彼らは10,000以上の入力で新旧のファズテストを行いました）。証明は現在、正確に1,760バイトである必要があります。以前のパスでは、末尾に余分なバイトを受け入れていました。

### 類似コードの検索

コードでは通常、`calldatacopy(p, someBytes.offset, ...)`を実行し、次に`staticcall(gas(), target, p, ...)`を実行するアセンブリブロック、またはSolidity版の`target.staticcall(abi.encodePacked(userBytes, ...))`として現れます。ZK検証者の前のアダプターが明らかな場所です。呼び出し元 (caller) のバイトを、フォールバックしか持たないと信じているコントラクトに転送するものは、すべて同じ脆弱性を抱えています。

このような呼び出し元 (caller) は何年も問題なく機能する可能性がありますが、被呼び出し元 (callee) が変更された日に悪用可能になる可能性があります。Scrollは`MultipleVersionRollupVerifier`でバッチバージョンごとに検証者を登録するため、新しいバージョンは新しいアドレスとレジストリエントリを意味し、レビューの注意は新しい検証者に向けられます。新しい被呼び出し元 (callee) のランタイムコードからセレクターをリストアップし（`cast selectors`はデプロイされたラッパーで`0x24270d54`を表示します）、各呼び出し元 (caller) が送信するレイアウトと照合することは、小さなステップです。

プラグ可能な検証者またはアダプターインターフェースを持つ[[glossary/ERC|ERC（Ethereum Request for Comments）]]を作成する人には、セキュリティに関する考慮事項に1行追加することをお勧めします。呼び出し元 (caller) はステートメントを型付き引数として渡し、フォールバックも持つ検証者は1つのエントリーポイントのみを介して呼び出されるべきです。

呼び出すコントラクトが新しいバージョンや新しいアドレスになったとき、あなたのプロセスでは、新しいコントラクトだけでなく、呼び出し元 (caller) を再確認するために誰を戻しますか？

*1投稿 - 1参加者*

[トピック全文を読む](https://ethereum-magicians.org/t/hand-built-calldata-where-the-callers-bytes-become-the-selector-scrolls-10-nov-fix/30405)
