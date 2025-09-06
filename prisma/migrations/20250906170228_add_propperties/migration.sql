/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `user_common` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `user_common` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `user_common` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_common` ADD COLUMN `cpf` VARCHAR(14) NOT NULL,
    ADD COLUMN `password` VARCHAR(10) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_common_cpf_key` ON `user_common`(`cpf`);
