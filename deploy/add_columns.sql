ALTER TABLE inventory_product ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE inventory_product ADD COLUMN IF NOT EXISTS warehouse_location VARCHAR(200);
ALTER TABLE inventory_product ADD COLUMN IF NOT EXISTS units_per_box INTEGER;
