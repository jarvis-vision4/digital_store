-- AlterTable: Remove vip fields from users
ALTER TABLE `users` DROP COLUMN `vip_level`,
  DROP COLUMN `vip_name`;