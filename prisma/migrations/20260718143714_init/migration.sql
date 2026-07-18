/*
  Warnings:

  - You are about to drop the `digital_product_keys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `digital_product_keys` DROP FOREIGN KEY `digital_product_keys_product_id_fkey`;

-- DropTable
DROP TABLE `digital_product_keys`;

-- CreateTable
CREATE TABLE `digital_orders` (
    `id` VARCHAR(100) NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `digital_product_id` BIGINT UNSIGNED NOT NULL,
    `product_name` VARCHAR(200) NOT NULL,
    `amount_mmk` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('Pending', 'Success', 'Cancelled') NOT NULL DEFAULT 'Pending',
    `delivery_content` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `digital_orders_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `digital_orders` ADD CONSTRAINT `digital_orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `digital_orders` ADD CONSTRAINT `digital_orders_digital_product_id_fkey` FOREIGN KEY (`digital_product_id`) REFERENCES `digital_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
