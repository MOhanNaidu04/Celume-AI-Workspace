-- Add accentColor preference to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS accent_color VARCHAR(50) DEFAULT 'sky';
