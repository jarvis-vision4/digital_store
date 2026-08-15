-- DropForeignKey
ALTER TABLE `game_packages` DROP FOREIGN KEY `game_packages_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_game_id_fkey`;

-- DropIndex
DROP INDEX `orders_game_id_fkey` ON `orders`;

-- DropTable
DROP TABLE `game_packages`;

-- DropTable
DROP TABLE `games`;
