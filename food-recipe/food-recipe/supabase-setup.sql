-- =============================================
-- SUPABASE SETUP - Food Recipe Reviews
-- =============================================
-- Jalankan script ini di Supabase SQL Editor
-- Dashboard > SQL Editor > New Query

-- 1. Buat tabel reviews
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Buat index untuk query berdasarkan meal_id
CREATE INDEX idx_reviews_meal_id ON reviews(meal_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Semua orang bisa membaca reviews
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

-- 5. Policy: Semua orang bisa menambah review
CREATE POLICY "Anyone can insert reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- =============================================
-- OPTIONAL: Insert sample data untuk testing
-- =============================================
-- INSERT INTO reviews (meal_id, username, rating, comment)
-- VALUES 
--   ('52772', 'John Doe', 5, 'Resep yang sangat enak! Mudah diikuti dan hasilnya luar biasa.'),
--   ('52772', 'Jane Smith', 4, 'Enak, tapi perlu sedikit penyesuaian bumbu untuk lidah lokal.'),
--   ('52772', 'Ahmad', 5, 'Mantap! Keluarga saya sangat suka dengan hidangan ini.');
