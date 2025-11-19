# Setting up Supabase Database

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name your project
   - Set a database password (save this!)
   - Choose a region
   - Click "Create new project"

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll need:
   - **Project URL**: Found under "Project URL"
   - **Service Role Key**: Found under "Project API keys" → "service_role" (keep this secret!)
   - **Anon Key**: Found under "Project API keys" → "anon public" (for client-side if needed)

## Step 3: Update Your .env File

1. Open `backend/.env` file
2. Update the following variables:
   ```
   SUPABASE_URL="https://your-project-ref.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

## Step 4: Create Database Tables

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `database/schema.sql`
4. Click "Run" to execute the SQL
5. This will create all necessary tables, indexes, and triggers

Alternatively, you can run the SQL file directly:
- Copy the SQL from `database/schema.sql`
- Paste it into the Supabase SQL Editor
- Execute it

## Step 5: Install Dependencies and Start Server

```bash
cd backend
npm install
npm run dev
```

## Important Notes

- **Service Role Key**: This key bypasses Row Level Security (RLS). Keep it secure and never expose it to the client.
- **Database Schema**: The schema uses PostgreSQL with proper foreign keys, indexes, and triggers.
- **Table Names**: Tables use PascalCase (e.g., `College`, `Student`) to match the original Prisma schema.
- **Row Level Security**: You may want to set up RLS policies in Supabase for additional security, but the service role key bypasses these.

## Troubleshooting

- If you get connection errors, make sure:
  - Your Supabase project is active
  - The SUPABASE_URL is correct (should start with `https://`)
  - The SUPABASE_SERVICE_ROLE_KEY is correct
  - The database tables have been created

- If you get table not found errors:
  - Make sure you've run the SQL schema file
  - Check that table names match exactly (case-sensitive)

- To verify tables were created:
  - Go to **Table Editor** in Supabase dashboard
  - You should see: College, Student, Admin, Assessment, Question, AssessmentAttempt, Progress
