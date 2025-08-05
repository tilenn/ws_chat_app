/*
  Warnings:

  - You are about to drop the column `likeCount` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "likeCount",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;
