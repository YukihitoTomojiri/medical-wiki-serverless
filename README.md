# Medical Wiki LMS (Serverless)

TypeScript + Hono + Cloudflare Workers + Supabase 構成のメディカルWiki/LMSシステム。

## セットアップ手順

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.dev.vars` ファイルをルートに作成し、以下の変数を設定してください（Cloudflare Workers用）。

```toml
# .dev.vars
SUPABASE_URL="<YOUR_SUPABASE_PROJECT_URL>"
SUPABASE_ANON_KEY="<YOUR_SUPABASE_ANON_KEY>"
DATABASE_URL="<YOUR_PRISMA_ACCELERATE_OR_DIRECT_URL>"
```

### 3. Supabase設定

#### プロジェクト作成
Supabaseで新規プロジェクトを作成します。

#### Storage設定
1. Sidebarの "Storage" を開く。
2. "New Bucket" をクリック。
3. バケット名: `wiki-assets`
4. "Public bucket" をONにする。
5. 作成後、Policiesタブで "New Policy" を作成し、必要な操作（Select, Insert等）を許可する（開発中は全許可、本番は認証済みユーザーのみ等に設定）。

#### データベース設定
Prismaを使用してスキーマを適用します。

```bash
npx prisma db push
```

### 4. 開発サーバーの起動

```bash
npm run dev
```
これにより、バックエンド（Wrangler）とフロントエンド（Vite）が同時に起動します。
- Frontend: http://localhost:3000
- Backend: http://localhost:8787

## 技術スタック
- **Backend**: Hono (Cloudflare Workers)
- **Database**: Supabase (PostgreSQL) + Prisma
- **Storage**: Supabase Storage
- **Frontend**: React + Vite

## 主な機能 (Features)
- **マニュアル管理**: Markdown形式でのドキュメント作成・閲覧。タグ付けや既読プレビュー機能。
- **Myダッシュボード**: 個人の学習進捗、最新のお知らせの確認をシームレスに行う機能。
- **管理者ダッシュボード**: 
  - **学習進捗**: 組織全体のコンプライアンスや研修の進捗状況をリアルタイムで追跡。
  - **組織統計**: 各部署のパフォーマンス（Wiki閲覧率、研修達成率）をグラフ・数値で比較・分析。
  - **現場の声**: 職員からのフィードバック（マニュアル改善、システム要望等）を収集・ステータス管理するご意見箱機能。
- **組織・ユーザー管理**: 施設および部署の階層的な管理と、ロールベース（DEVELOPER, ADMIN, USER）のきめ細やかなアクセス制御。
