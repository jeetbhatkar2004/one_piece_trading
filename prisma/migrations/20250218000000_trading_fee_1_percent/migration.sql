-- Update trading fee from 0.2% (20 bps) to 1% (100 bps)
ALTER TABLE "pools" ALTER COLUMN "fee_bps" SET DEFAULT 100;
UPDATE "pools" SET "fee_bps" = 100 WHERE "fee_bps" = 20;
