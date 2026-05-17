# ethresear-jp

[ethresear.ch](https://ethresear.ch/) (Ethereum Research) の投稿を日本語化して、Quartz のグラフビューで概念のつながりを辿れる形で公開するサイト。

## 仕組み

1. GitHub Actions が日次で `https://ethresear.ch/latest.rss` を取得
2. 新着投稿を Gemini API で日本語化（`glossary.md` をプロンプトに注入して用語のブレを防ぐ）
3. 翻訳結果を `content/posts/` に Markdown として保存し PR を作成
4. main にマージされると Cloudflare Workers (Static Assets) が Quartz をビルドして公開

## ローカル開発

```sh
npm install
cp .env.example .env  # GEMINI_API_KEY を記入
npm run expand-glossary    # glossary.md → content/glossary/*.md
npm run fetch-translate    # RSS → 翻訳 → content/posts/*.md
npm run dev                # Quartz ローカルサーバー (http://localhost:8080)
```

## ディレクトリ

| Path | 役割 |
|---|---|
| `glossary.md` | 用語集の単一ソース（人間が編集） |
| `content/` | Quartz が公開する Markdown |
| `scripts/` | RSS取得・翻訳・glossary 展開 |
| `quartz/` | Quartz v4 本体 (vendored) |

## デプロイ（初回セットアップ）

### 1. GitHub Secrets

- `GEMINI_API_KEY` を Repository secrets に登録（Settings → Secrets and variables → Actions）

### 2. Cloudflare Workers (Static Assets)

Cloudflare では 2024 年以降 **Workers Builds + Static Assets** が静的サイトの推奨パスです（旧 Pages も使えますが legacy 扱い）。本リポジトリは `wrangler.jsonc` を含んでおり、`./public/` を静的アセット元として宣言しています。

#### dashboard 接続

Cloudflare ダッシュボード → Workers & Pages → Create → **Workers** → Connect to Git → `adust09/ethresear-jp`:

| 設定項目 | 値 |
|---|---|
| Production branch | `main` |
| Build command | `git fetch --unshallow \|\| true && npm ci && cd quartz && npm ci && npx quartz build --directory ../content --output ../public` |
| Deploy command | `npx wrangler deploy` |
| Root directory | (空欄 = リポジトリルート) |
| Node version (環境変数 `NODE_VERSION`) | `22` |

ポイント:
- **Build command を空にしない** — Cloudflare はビルドを skip して `wrangler deploy` を呼んでしまい、「静的ファイルが見つからない」エラーになる
- `git fetch --unshallow` は Quartz が git ベースの last-modified を正確に取得するため必要
- ルート `npm ci` で `gray-matter`/`turndown`/`@google/generative-ai` 等が入り、`cd quartz && npm ci` で Quartz 本体の依存が入る

### 3. 動作確認

- Actions タブから `Daily Translate` を `workflow_dispatch` で `limit=1` で手動実行 → PR が立つ
- PR をマージ → Cloudflare Workers がビルド・デプロイして `ethresear-jp.<account>.workers.dev` で公開
- グラフビュー・タグ・画像が本番でも動くか確認

## ライセンス

翻訳対象の原文の著作権はそれぞれの著者に帰属します。本リポジトリで生成される翻訳は、原文の URL を `source_url` として常に表示し、Ethereum Research コミュニティへの還元を目的とした非営利の二次利用です。
