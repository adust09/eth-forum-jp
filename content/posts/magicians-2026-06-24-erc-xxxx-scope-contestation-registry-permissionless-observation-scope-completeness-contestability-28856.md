---
title: 'ERC-XXXX: スコープ異議申し立てレジストリ — パーミッションレスな観測スコープ完全性の異議申し立て可能性'
original_title: >-
  ERC-XXXX: Scope Contestation Registry — permissionless observation-scope
  completeness contestability
source: magicians
source_name: Ethereum Magicians
source_url: >-
  https://ethereum-magicians.org/t/erc-xxxx-scope-contestation-registry-permissionless-observation-scope-completeness-contestability/28856
author: Damonzwicker
date: '2026-06-24'
category: ERCs
tags:
  - ercs
  - eip
  - security
  - verification
  - protocol-design
  - decentralization
  - ai-agents
topic_id: '28856'
translated_at: '2026-06-25'
translator: gemini-2.5-flash
---

> [!note] 原文
> [ERC-XXXX: Scope Contestation Registry — permissionless observation-scope completeness contestability](https://ethereum-magicians.org/t/erc-xxxx-scope-contestation-registry-permissionless-observation-scope-completeness-contestability/28856) — Damonzwicker (2026-06-24)

## 概要

この標準は、[[glossary/Scope-Contestation-Registry|スコープ異議申し立てレジストリ]]のインターフェースを定義します。これは、アクターが観測した座標のセット（その[[glossary/Observation-scope|観測スコープ]]）を外部コミットメントにバインドしてコミットし、任意のパーティが特定の座標がそのコミットされたセットに**不在**であったことをオンチェーンで証明できる、パーミッションレスなメカニズムです。レジストリはそのような証明を永続的かつ再計算可能に記録します。それは**何も裁定しません** — 欠落した座標が重要であったかどうかを決定しません。その唯一の保証は、コミットされたスコープからの省略が構造的に不可視ではないということです。すべての省略は指名可能であり、一度指名されれば、公開データから永続的かつ検証可能になります。

## 動機

検証可能なエージェントシステムは、記録された評決が*忠実*であること、つまり、その結果が出る前にコミットされ、公開データから再計算可能であり、信頼できる当事者に依存しないことを証明できます。しかし、評決の背後にある[[glossary/Observation-scope|観測スコープ]]が*完全*であったことを証明することはできません。エージェントは、観測した内容から座標を正直に（または意図的に）省略し、完全に有効な署名済みレシートを発行し、すべてのダウンストリーム検証チェックを通過させることができます。この証明は、*記録された*観測の完全性を保証するものであり、観測セットの*完全性*を保証するものではありません。

これは構造的な盲点です。システムは提出されたものを記録し、提出されなかったものについては何も言及しません。省略された座標は痕跡を残しません。完全性は事前には証明できません。可能な座標の全空間を事前に列挙することは、まさにこの盲点が妨げることです。提供できるのは**[[glossary/Contestability|異議申し立て可能性]]**です。これは、不可視の省略を永続的で、パーミッションレスで、再計算可能な主張に変換するメカニズムです。

具体的な事例：

*   **資産回復。** 資産を回復するよう委託されたエージェントは、検索する資産セットをコミットします。もし既知の攻撃者のアドレスを省略した場合、そのアドレスを保持する誰もがそれを指名し、エージェントがそれをスコープに含めなかったという永続的なオンチェーン証明を生成できます。
*   **ガバナンス / 評価。** 不完全な観測セットに基づいて下された決定は、欠陥のある入力に基づいているにもかかわらず、すべてのレシートチェックを通過します。指名により、省略された入力は黙殺されるのではなく、異議申し立て可能になります。

完全なドラフトEIPとIScopeContestationインターフェース：

[github.com](https://github.com/damonzwicker/scope-contestation)

![damonzwicker/scope-contestation のオープングラフ画像](https://opengraph.githubassets.com/abb649afa63de0a1d0ae761bf644238b/damonzwicker/scope-contestation)

### [GitHub - damonzwicker/scope-contestation: OCP/8281の完全性異議申し立てレイヤー...](https://github.com/damonzwicker/scope-contestation)

OCP/8281エージェント経済スタックの完全性異議申し立てレイヤー。パーミッションレスなソート済みマークル非包含レジストリ — 観測スコープの省略を指名可能かつ永続的にし、不可視にしない。

参照実装（ライブのSepoliaデプロイ）：

![GitHubのファビコン](https://github.githubassets.com/favicons/favicon.svg) [github.com](https://github.com/TMerlini/hack-ens-recovery/tree/main/scope-contestation-demo)

### [hack-ens-recovery/scope-contestation-demo at main · TMerlini/hack-ens-recovery](https://github.com/TMerlini/hack-ens-recovery/tree/main/scope-contestation-demo)

GitHubでアカウントを作成して、TMerlini/hack-ens-recoveryの開発に貢献しましょう。

形式的基礎 — 認識可能性の幾何学：

[github.com](https://github.com/CreationEnterprisesGroupINC/The-Geometry-of-Knowability-Observational-Sufficiency-Across-Systems-and-Scales/blob/main/paper/geometry_of_knowability_v0.1.pdf)

[](https://github.com/CreationEnterprisesGroupINC/The-Geometry-of-Knowability-Observational-Sufficiency-Across-Systems-and-Scales/blob/main/paper/geometry_of_knowability_v0.1.pdf)

### [geometry\_of\_knowability\_v0.1.pdf](https://github.com/CreationEnterprisesGroupINC/The-Geometry-of-Knowability-Observational-Sufficiency-Across-Systems-and-Scales/blob/main/paper/geometry_of_knowability_v0.1.pdf)

*4件の投稿 - 3人の参加者*

[全トピックを読む](https://ethereum-magicians.org/t/erc-xxxx-scope-contestation-registry-permissionless-observation-scope-completeness-contestability/28856)
