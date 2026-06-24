-- Add profile role/title to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(255);
