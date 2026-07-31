-- Migration: Add optional generated website relationship column to orders

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS generated_website_id bigint;
