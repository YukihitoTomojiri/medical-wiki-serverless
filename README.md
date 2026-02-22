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

## 🌟 コア機能ガイド (Core Features)

### 1. 管理者ダッシュボード (Admin Dashboard)
![管理者ダッシュボードのスクリーンショット](./docs/images/admin_dashboard.png)

**組織の司令塔としての価値提供**
従来の勤怠管理機能を分離し、組織の現状を俯瞰するための3タブ構成（「学習進捗」「組織統計」「現場の声」）へ進化しました。各部署の研修達成率やコンプライアンス状況をリアルタイムに可視化し、素早い意思決定を支援します。

### 2. Wiki / ナレッジ共有 (Wiki & Knowledge Sharing)
![マニュアル参照画面のスクリーンショット](./docs/images/wiki_manuals.png)

**現場の暗黙知を形式知へ**
Markdownベースのドキュメント作成とタグ付けにより、日々の業務で培われたノウハウを蓄積。すべての職員が最新の業務手順やガイドラインに瞬時にアクセスできる環境を構築し、属人化を防ぎます。

### 3. ご意見箱 / 現場の声 (Feedback & Suggestion Box)
![ご意見箱のスクリーンショット](./docs/images/feedback_box.png)

**組織の風通しを良くする双方向コミュニケーション**
管理者ダッシュボード内の「現場の声」タブを通じて、職員からのシステム要望やマニュアル改善案を直接収集。「未確認・対応中・完了」のステータス管理により、現場の声を迅速に吸い上げ、機敏な運用改善サイクルを実現します。

## 📂 プロジェクト構成 (Directory Structure)

```text
medical-wiki-lms-serverless/
├── backend/            # Hono (Cloudflare Workers) & Prisma 構成
│   ├── prisma/         # データベーススキーマとマイグレーション
│   └── src/
│       ├── controllers/# 各種API処理エンドポイント
│       ├── core/       # エラーハンドリング・ミドルウェア
│       ├── middleware/ # 認証 (JWT) および ロールベースアクセス制御
│       └── services/   # ビジネスロジック実装
│
├── frontend/           # React + Vite 構成
│   ├── public/         # 静的アセット (ロゴ等)
│   └── src/
│       ├── api.ts      # バックエンド通信用APIクライアント
│       ├── components/ # 共通UI部品・ウィジェット
│       ├── pages/      # ページコンポーネント (Dashboard, Manuals等)
│       └── types.ts    # フロントエンド用の型定義
│
├── .dev.vars           # Cloudflare Workers用 ローカル環境変数
├── package.json        # モノレポ構成 (Frontend/Backend一括起動用)
└── README.md           # プロジェクト全体に関する説明（本ファイル）
```

## 職種マスタ管理
管理者・開発者は `/admin/professions` から職種の一覧・追加・削除が行えます。  
初期データとして以下の7職種が登録されます：理学療法士、作業療法士、言語聴覚士、看護師、介護職、事務職、その他。

新規ユーザーは初回のアカウント設定画面（パスワード設定時）にて、これらのマスタから自身の職種を選択します。

リハビリ職種（理学療法士・作業療法士・言語聴覚士）のユーザーは、Myダッシュボードにリハビリ専門リソースへのショートカットが表示されます。

## 職種プレビュー機能（管理者・開発者向け）
管理者（ADMIN）および開発者（DEVELOPER）は、Myダッシュボード上部に表示される「職種プレビュー」タブを使用して、各職種のダッシュボードビューをプレビューできます。  
対応タブ: リハビリ（理学療法士・作業療法士・言語聴覚士を統合）、看護師、介護職、その他。  
一般ユーザー（USER）にはタブは表示されず、自身の職種に応じたコンテンツのみが表示されます。
