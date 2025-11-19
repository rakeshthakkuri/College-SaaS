# Backend Setup

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```env
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
```

3. Set up Supabase database:
   - See `SUPABASE_SETUP.md` for detailed instructions
   - Run the SQL schema from `database/schema.sql` in Supabase SQL Editor

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Database Setup

This project uses Supabase (PostgreSQL) as the database. 

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and service role key from Settings → API
3. Run the SQL schema from `database/schema.sql` in the Supabase SQL Editor
4. Update your `.env` file with the Supabase credentials

See `SUPABASE_SETUP.md` for detailed setup instructions.

## API Documentation

See the main README.md for API endpoint documentation.

## Project Structure

- `routes/` - API route handlers
- `middleware/` - Authentication middleware
- `database/` - Database configuration and schema
  - `supabase.js` - Supabase client setup
  - `schema.sql` - Database schema SQL file
