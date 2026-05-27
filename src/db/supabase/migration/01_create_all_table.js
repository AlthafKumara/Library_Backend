import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  try {
    console.log("Menghubungkan ke database Supabase...");
    await client.connect();
    const createEnumsQuery = `
      DO $$ BEGIN
          CREATE TYPE public.role AS ENUM ('user', 'admin', 'librarian');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
          CREATE TYPE public.borrow_status AS ENUM ('pending', 'approved', 'borrowed', 'returned', 'overdue', 'lost');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
          CREATE TYPE public.notification_type AS ENUM ('system', 'borrow', 'community');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;
    await client.query(createEnumsQuery);
    console.log("✅ ENUM types berhasil diperiksa/dibuat.");

    // 2. Pembuatan Tabel (Urutan sangat krusial!)
    const createTablesQuery = `
      -- ==========================================
      -- TIER 1: Tabel Master & Independen
      -- ==========================================

      -- Tabel Profiles (Terikat ke auth.users Supabase)
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        name VARCHAR(255),
        role public.role DEFAULT 'user',
        photo_profile VARCHAR(255),
        gender VARCHAR(50),
        email TEXT UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );

      -- Tabel Book Category
      CREATE TABLE IF NOT EXISTS public.book_category (
        id BIGSERIAL PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- ==========================================
      -- TIER 2: Tabel yang bergantung pada Tier 1
      -- ==========================================

      -- Tabel Book
      CREATE TABLE IF NOT EXISTS public.book (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        description TEXT,
        stock INT4 DEFAULT 0,
        cover_url VARCHAR(255),
        category BIGINT REFERENCES public.book_category(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );

      -- Tabel FCM Tokens
      CREATE TABLE IF NOT EXISTS public.fcm_tokens (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        fcm_token TEXT UNIQUE NOT NULL,
        device_type VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- ==========================================
      -- TIER 3: Tabel Transaksi & Interaksi Utama
      -- ==========================================

      -- Tabel Borrow (Peminjaman)
      CREATE TABLE IF NOT EXISTS public.borrow (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        book_id BIGINT REFERENCES public.book(id) ON DELETE CASCADE,
        borrow_date TIMESTAMP,
        due_date TIMESTAMP,
        actual_return_date TIMESTAMP,
        fine_amount INT4 DEFAULT 0,
        qr_text VARCHAR(255),
        is_reviewed BOOLEAN DEFAULT FALSE,
        status public.borrow_status DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Tabel Saved List Book
      CREATE TABLE IF NOT EXISTS public.saved_list_book (
        id BIGSERIAL PRIMARY KEY,
        list_name TEXT,
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        book_id BIGINT REFERENCES public.book(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Tabel Community
      CREATE TABLE IF NOT EXISTS public.community (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        parent_id BIGINT REFERENCES public.community(id) ON DELETE CASCADE,
        book_id BIGINT REFERENCES public.book(id) ON DELETE CASCADE,
        message_text TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- ==========================================
      -- TIER 4: Tabel Turunan & Log
      -- ==========================================

      -- Tabel Book Review
      CREATE TABLE IF NOT EXISTS public.book_review (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        book_id BIGINT REFERENCES public.book(id) ON DELETE CASCADE,
        borrow_id BIGINT REFERENCES public.borrow(id) ON DELETE SET NULL,
        review_text TEXT,
        rating INT4 CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Tabel Notifications
      CREATE TABLE IF NOT EXISTS public.notifications (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        borrow_id BIGINT REFERENCES public.borrow(id) ON DELETE CASCADE,
        community_id BIGINT REFERENCES public.community(id) ON DELETE CASCADE,
        type public.notification_type,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    console.log("Mengeksekusi pembuatan tabel berserta relasinya...");
    await client.query(createTablesQuery);
    console.log("✅ Berhasil! Seluruh arsitektur database sudah siap.");

  } catch (error) {
    console.error("❌ Gagal mengeksekusi migration:", error.message);
  } finally {
    await client.end();
    console.log("Koneksi database ditutup.");
  }
}

runMigration();