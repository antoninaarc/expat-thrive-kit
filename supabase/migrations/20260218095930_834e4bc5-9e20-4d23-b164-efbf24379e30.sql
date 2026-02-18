
-- Add onboarding fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS country_origin text,
ADD COLUMN IF NOT EXISTS country_destination text,
ADD COLUMN IF NOT EXISTS time_abroad text,
ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

-- Create resource_type enum
DO $$ BEGIN
  CREATE TYPE public.resource_type AS ENUM ('article', 'meditation', 'audio', 'video', 'exercise');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create wellness_resources table
CREATE TABLE public.wellness_resources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en text NOT NULL DEFAULT '',
  title_es text NOT NULL DEFAULT '',
  type resource_type NOT NULL DEFAULT 'article',
  content_en text NOT NULL DEFAULT '',
  content_es text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  duration_minutes integer NOT NULL DEFAULT 5,
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wellness_resources ENABLE ROW LEVEL SECURITY;

-- Anyone can view published resources
CREATE POLICY "Anyone can view published resources"
ON public.wellness_resources
FOR SELECT
USING (published = true);

-- Admins can manage resources
CREATE POLICY "Admins can manage resources"
ON public.wellness_resources
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_wellness_resources_updated_at
BEFORE UPDATE ON public.wellness_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique constraint on daily_checkins for upsert
DO $$ BEGIN
  ALTER TABLE public.daily_checkins ADD CONSTRAINT daily_checkins_user_date_unique UNIQUE (user_id, checkin_date);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add emotion column to daily_checkins for the 6 emotion types
ALTER TABLE public.daily_checkins ADD COLUMN IF NOT EXISTS emotion text;
