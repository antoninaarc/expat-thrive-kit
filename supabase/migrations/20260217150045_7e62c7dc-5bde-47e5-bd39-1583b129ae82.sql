-- Add i18n columns to programs table
ALTER TABLE public.programs
  ADD COLUMN title_en text NOT NULL DEFAULT '',
  ADD COLUMN title_es text NOT NULL DEFAULT '',
  ADD COLUMN description_en text NOT NULL DEFAULT '',
  ADD COLUMN description_es text NOT NULL DEFAULT '';
