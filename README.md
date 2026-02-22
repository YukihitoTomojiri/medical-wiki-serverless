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

## テストアカウント

| 職員番号 | パスワード | 名前 | 権限 | 職種 |
| :--- | :--- | :--- | :--- | :--- |
| `dev001` | `password123` | Developer User | DEVELOPER | — |
| `admin001` | `password123` | Admin User | ADMIN | — |
| `user001` | `password123` | 佐藤 健太 | USER | 理学療法士 |
| `user002` | `password123` | 鈴木 舞 | USER | 看護師 |

## 職種マスタ管理
管理者・開発者は `/admin/professions` から職種の一覧・追加・削除が行えます。  
初期データとして以下の7職種が登録されます：理学療法士、作業療法士、言語聴覚士、看護師、介護職、事務職、その他。

新規ユーザーは初回のアカウント設定画面（パスワード設定時）にて、これらのマスタから自身の職種を選択します。

リハビリ職種（理学療法士・作業療法士・言語聴覚士）のユーザーは、Myダッシュボードにリハビリ専門リソースへのショートカットが表示されます。
