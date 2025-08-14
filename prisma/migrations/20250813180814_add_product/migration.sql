/*
  Warnings:

  - Added the required column `size` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "corporateName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "ssn" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "stateRegistration" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "totalSpent" DECIMAL
);
INSERT INTO "new_Customer" ("address", "city", "corporateName", "district", "email", "id", "phone", "postcode", "ssn", "state", "stateRegistration", "totalSpent") SELECT "address", "city", "corporateName", "district", "email", "id", "phone", "postcode", "ssn", "state", "stateRegistration", "totalSpent" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "unitPrice" DECIMAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "size" TEXT NOT NULL
);
INSERT INTO "new_Product" ("description", "id", "name", "unitPrice") SELECT "description", "id", "name", "unitPrice" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
