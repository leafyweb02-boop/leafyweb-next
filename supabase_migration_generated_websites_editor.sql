-- Migration: Add optional editable fields to generated_websites for admin website editor

ALTER TABLE generated_websites
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS menu_item_1 text,
  ADD COLUMN IF NOT EXISTS menu_price_1 text,
  ADD COLUMN IF NOT EXISTS menu_item_2 text,
  ADD COLUMN IF NOT EXISTS menu_price_2 text,
  ADD COLUMN IF NOT EXISTS menu_item_3 text,
  ADD COLUMN IF NOT EXISTS menu_price_3 text,
  ADD COLUMN IF NOT EXISTS menu_item_4 text,
  ADD COLUMN IF NOT EXISTS menu_price_4 text,
  ADD COLUMN IF NOT EXISTS opening_hours_mon_thu text,
  ADD COLUMN IF NOT EXISTS opening_hours_fri_sat text,
  ADD COLUMN IF NOT EXISTS opening_hours_sun text,
  ADD COLUMN IF NOT EXISTS gallery_image_1 text,
  ADD COLUMN IF NOT EXISTS gallery_image_2 text,
  ADD COLUMN IF NOT EXISTS gallery_image_3 text,
  ADD COLUMN IF NOT EXISTS gallery_image_4 text;
