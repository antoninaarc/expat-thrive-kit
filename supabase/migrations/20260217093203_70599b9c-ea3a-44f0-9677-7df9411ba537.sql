
-- Programs definition table
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  emoji TEXT NOT NULL DEFAULT '📘',
  duration_days INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view programs"
  ON public.programs FOR SELECT
  USING (true);

-- Program days content
CREATE TABLE public.program_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  exercise TEXT NOT NULL DEFAULT '',
  reflection_prompt TEXT NOT NULL DEFAULT '',
  UNIQUE (program_id, day_number)
);

ALTER TABLE public.program_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view program days"
  ON public.program_days FOR SELECT
  USING (true);

-- User progress tracking
CREATE TABLE public.user_program_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  current_day INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (user_id, program_id)
);

ALTER TABLE public.user_program_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON public.user_program_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_program_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_program_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Day completions log
CREATE TABLE public.user_day_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  reflection TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, program_id, day_number)
);

ALTER TABLE public.user_day_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own completions"
  ON public.user_day_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON public.user_day_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_program_days_program ON public.program_days(program_id);
CREATE INDEX idx_user_progress_user ON public.user_program_progress(user_id);
CREATE INDEX idx_user_completions_user ON public.user_day_completions(user_id, program_id);
