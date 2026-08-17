-- AlterTable: Add new columns to digital_products
ALTER TABLE `digital_products` ADD COLUMN `rating` DECIMAL(3, 1) NOT NULL DEFAULT 0,
  ADD COLUMN `sales_count` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `badge` VARCHAR(50) NULL;

-- CreateTable: digital_product_variants
CREATE TABLE `digital_product_variants` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `digital_product_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `duration_days` INTEGER NOT NULL,
    `price_mmk` DECIMAL(12, 2) NOT NULL,
    `price_usd` DECIMAL(10, 2) NULL,
    `badge` VARCHAR(50) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `digital_product_variants_digital_product_id_idx`(`digital_product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: digital_product_features
CREATE TABLE `digital_product_features` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `digital_product_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `digital_product_features_digital_product_id_idx`(`digital_product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable: Add variant reference to digital_orders
ALTER TABLE `digital_orders` ADD COLUMN `digital_product_variant_id` BIGINT UNSIGNED NULL,
  ADD COLUMN `variant_name` VARCHAR(200) NULL;

-- AddForeignKey
ALTER TABLE `digital_product_variants` ADD CONSTRAINT `digital_product_variants_digital_product_id_fkey` FOREIGN KEY (`digital_product_id`) REFERENCES `digital_products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `digital_product_features` ADD CONSTRAINT `digital_product_features_digital_product_id_fkey` FOREIGN KEY (`digital_product_id`) REFERENCES `digital_products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `digital_orders` ADD CONSTRAINT `digital_orders_digital_product_variant_id_fkey` FOREIGN KEY (`digital_product_variant_id`) REFERENCES `digital_product_variants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
