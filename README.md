# Medical Wiki & LMS (Serverless)

This project has been migrated to a serverless architecture using **Hono**, **Cloudflare Workers**, **Prisma**, and **Supabase**.

## Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase Account
- Cloudflare Account (optional for local dev)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Configuration

1.  **Create a Supabase Project**.
2.  **Database URL**: Get the Transaction Pooler URL (port 6543) from *Project Settings > Database*.
    -   Format: `postgres://[user]:[password]@[host]:6543/postgres?pgbouncer=true`
3.  **Environment Variables**:
    Create `.env` in the root directory:
    ```
    DATABASE_URL="postgres://[user]:[password]@[host]:6543/postgres?pgbouncer=true"
    DIRECT_URL="postgres://[user]:[password]@[host]:5432/postgres"
    SUPABASE_URL="https://[project-ref].supabase.co"
    SUPABASE_ANON_KEY="[your-anon-key]"
    ```
    Also update `wrangler.toml` `[vars]` section for Cloudflare deployment.

### 3. Database Migration

Push the schema to your Supabase database:

```bash
npx prisma db push
```

### 4. Supabase Storage Setup (File Uploads)

1.  Go to **Storage** in Supabase Dashboard.
2.  Create a new bucket named **`wiki-assets`**.
3.  **Policy Configuration**:
    -   Enable **Public Access** for the bucket.
    -   Add a policy to allow upload/select/update/delete for authenticated users (or public for demo).
    -   *Recommended Policy (Public Read/Write for Dev)*:
        -   SELECT: `true`
        -   INSERT: `true`
        -   UPDATE: `true`

### 5. Running the Application

**Backend (Hono):**
```bash
npm run dev
# Runs on http://localhost:8787
```

**Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

The frontend `vite.config.ts` is configured to proxy `/api` requests to `http://localhost:8787`.

## Project Structure

-   `backend/`: Hono application source.
-   `frontend/`: React application.
-   `prisma/`: Database schema and configuration.
-   `wrangler.toml`: Cloudflare Workers ID and secrets configuration.

## API Endpoints

-   `GET /`: Health check
-   `POST /api/upload`: Upload file to Supabase Storage (multipart/form-data)
-   `GET /api/users`, `POST /api/users`: User management
-   `GET /api/facilities`: Facility management
-   ... (and other routes mirroring legacy API)
