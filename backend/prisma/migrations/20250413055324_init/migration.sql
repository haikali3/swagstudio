/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `imprintX` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `imprintY` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - Added the required column `productId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "imprintX" INTEGER,
    "imprintY" INTEGER,
    "imprintWidth" INTEGER,
    "imprintHeight" INTEGER,
    "imageUrl" TEXT,
    "inventory" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Product" ("createdAt", "description", "id", "imageUrl", "imprintX", "imprintY", "name") SELECT "createdAt", "description", "id", "imageUrl", "imprintX", "imprintY", "name" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_productId_key" ON "Product"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
