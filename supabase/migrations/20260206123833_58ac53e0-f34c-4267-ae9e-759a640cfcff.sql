-- Add unique constraint on user_id for portal_staff (needed for upsert)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'portal_staff_user_id_key'
  ) THEN
    ALTER TABLE public.portal_staff ADD CONSTRAINT portal_staff_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Add unique constraint on user_id for organization_members (needed for upsert)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'organization_members_user_id_key'
  ) THEN
    ALTER TABLE public.organization_members ADD CONSTRAINT organization_members_user_id_key UNIQUE (user_id);
  END IF;
END $$;
