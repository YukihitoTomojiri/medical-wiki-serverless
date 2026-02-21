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

## 🌟 システムアーキテクチャ (System Architecture)

### データモデル (ER Diagram)
中核となるエンティティ（ユーザー、Wiki、研修記録、ご意見箱）のリレーションシップです。

```mermaid
erDiagram
    User ||--o{ Manual : "Creates / Reads"
    User ||--o{ TrainingResponse : "Submits"
    User ||--o{ Feedback : "Posts (Conceptual)"
    
    Manual {
        Int id PK
        String title
        String content
        String category
    }
    TrainingEvent ||--o{ TrainingResponse : "Receives"
    TrainingEvent {
        Int id PK
        String title
        DateTime startTime
    }
    TrainingResponse {
        Int id PK
        Int comprehension
        Int clarity
    }
    Feedback {
        Int id PK
        String category
        String content
        String status
    }
    User {
        Int id PK
        String employeeId
        String name
        Role role
    }
```

### 通信フロー (Sequence Diagram)
職員がログインし、ダッシュボードを表示するまでの一連のシステム間通信フローです。

```mermaid
sequenceDiagram
    actor User as 職員
    participant Frontend as Frontend (Vite/React)
    participant Backend as Backend (Hono/Cloudflare)
    participant DB as Database (Supabase PostgreSQL)

    User->>Frontend: ログイン画面へアクセス
    Frontend->>Backend: POST /api/auth/login (社員番号, パスワード)
    Backend->>DB: ユーザー情報の照会
    DB-->>Backend: ユーザーデータ返却
    Backend-->>Frontend: JWTトークン発行
    Frontend->>User: 各種ダッシュボード画面へ遷移
    
    rect rgb(240, 248, 255)
        note right of User: ダッシュボード初期データ取得
        Frontend->>Backend: GET /api/users/me (JWT付与)
        Frontend->>Backend: GET /api/training/events など
        Backend->>DB: データ照会
        DB-->>Backend: 結果返却
        Backend-->>Frontend: JSONレスポンス
        Frontend-->>User: ウィジェットやグラフの描画
    end
```

## 🌟 コア機能ガイド (Core Features)

### 📊 1. 管理者ダッシュボード (Admin Dashboard)
**組織の司令塔としての価値提供**
従来の勤怠管理機能を分離し、組織の現状を俯瞰するための3タブ構成（「学習進捗」「組織統計」「現場の声」）へ進化しました。各部署の研修達成率やコンプライアンス状況をリアルタイムに可視化し、素早い意思決定を支援します。

### 📘 2. Wiki / ナレッジ共有 (Wiki & Knowledge Sharing)
**現場の暗黙知を形式知へ**
Markdownベースのドキュメント作成とタグ付けにより、日々の業務で培われたノウハウを蓄積。すべての職員が最新の業務手順やガイドラインに瞬時にアクセスできる環境を構築し、属人化を防ぎます。

### 📬 3. ご意見箱 / 現場の声 (Feedback & Suggestion Box)
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
