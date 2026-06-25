-- Username is a display handle, not the registration identity.
-- Remove any unique constraint or unique index that still targets users.username.
DO $$
DECLARE
  constraint_record RECORD;
  index_record RECORD;
BEGIN
  FOR constraint_record IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND rel.relname = 'users'
      AND con.contype = 'u'
      AND (
        SELECT array_agg(att.attname::text ORDER BY keys.ordinality)
        FROM unnest(con.conkey) WITH ORDINALITY AS keys(attnum, ordinality)
        JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = keys.attnum
      ) = ARRAY['username']::text[]
  LOOP
    EXECUTE format('ALTER TABLE public.users DROP CONSTRAINT IF EXISTS %I', constraint_record.conname);
  END LOOP;

  FOR index_record IN
    SELECT idx.indexname
    FROM pg_indexes idx
    WHERE idx.schemaname = 'public'
      AND idx.tablename = 'users'
      AND idx.indexdef ILIKE 'CREATE UNIQUE INDEX%'
      AND idx.indexdef ILIKE '%(username)%'
  LOOP
    EXECUTE format('DROP INDEX IF EXISTS public.%I', index_record.indexname);
  END LOOP;
END $$;
