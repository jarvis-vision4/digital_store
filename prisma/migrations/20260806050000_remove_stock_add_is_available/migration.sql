-- AlterTable
ALTER TABLE `digital_products` DROP COLUMN `stock`,
    ADD COLUMN `is_available` BOOLEAN NOT NULL DEFAULT true;
