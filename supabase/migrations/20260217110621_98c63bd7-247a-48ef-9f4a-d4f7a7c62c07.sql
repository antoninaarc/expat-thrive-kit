
-- 1. Role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS: only admins can see roles, users can see their own
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. Journal prompts table
CREATE TABLE public.journal_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_index integer NOT NULL UNIQUE,
  prompt_es text NOT NULL DEFAULT '',
  prompt_en text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.journal_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active prompts"
  ON public.journal_prompts FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage prompts"
  ON public.journal_prompts FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_journal_prompts_updated_at
  BEFORE UPDATE ON public.journal_prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Daily tips table
CREATE TABLE public.daily_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_index integer NOT NULL UNIQUE,
  tip_es text NOT NULL DEFAULT '',
  tip_en text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '💡',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active tips"
  ON public.daily_tips FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage tips"
  ON public.daily_tips FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_daily_tips_updated_at
  BEFORE UPDATE ON public.daily_tips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Admin policies for existing tables
CREATE POLICY "Admins can manage articles"
  ON public.articles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage programs"
  ON public.programs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage program days"
  ON public.program_days FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
