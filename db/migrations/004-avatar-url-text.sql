-- Store per-user profile pictures as data URLs.
ALTER TABLE users ALTER COLUMN avatar_url TYPE TEXT;
