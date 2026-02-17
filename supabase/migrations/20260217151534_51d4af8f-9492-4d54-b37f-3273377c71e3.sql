-- Add i18n columns to articles table
ALTER TABLE public.articles
  ADD COLUMN title_en text NOT NULL DEFAULT '',
  ADD COLUMN title_es text NOT NULL DEFAULT '',
  ADD COLUMN summary_en text NOT NULL DEFAULT '',
  ADD COLUMN summary_es text NOT NULL DEFAULT '',
  ADD COLUMN content_en text NOT NULL DEFAULT '',
  ADD COLUMN content_es text NOT NULL DEFAULT '';
