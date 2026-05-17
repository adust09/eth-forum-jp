# ethresear-jp

[ethresear.ch](https://ethresear.ch/) (Ethereum Research) の投稿を日本語化して、Quartz のグラフビューで概念のつながりを辿れる形で公開するサイト。

## 仕組み

1. GitHub Actions が日次で `https://ethresear.ch/latest.rss` を取得
2. 新着投稿を Gemini API で日本語化（`glossary.md` をプロンプトに注入して用語のブレを防ぐ）
3. 翻訳結果を `content/posts/` に Markdown として保存し PR を作成
4. main にマージされると Cloudflare Pages が Quartz をビルドして公開

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

## ライセンス

翻訳対象の原文の著作権はそれぞれの著者に帰属します。本リポジトリで生成される翻訳は、原文の URL を `source_url` として常に表示し、Ethereum Research コミュニティへの還元を目的とした非営利の二次利用です。
