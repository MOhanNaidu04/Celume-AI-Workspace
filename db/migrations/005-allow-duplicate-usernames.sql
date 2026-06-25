-- Registration identity is email, so usernames do not need to be unique.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key;
