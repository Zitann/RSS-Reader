/*
  Warnings:

  - You are about to drop the column `tag_id` on the `Feed` table. All the data in the column will be lost.
  - Added the required column `tag_id` to the `UserSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "last_build_date" DATETIME,
    "ttl" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Feed" ("created_at", "description", "id", "image_url", "last_build_date", "title", "ttl", "updated_at", "url") SELECT "created_at", "description", "id", "image_url", "last_build_date", "title", "ttl", "updated_at", "url" FROM "Feed";
DROP TABLE "Feed";
ALTER TABLE "new_Feed" RENAME TO "Feed";
CREATE UNIQUE INDEX "Feed_url_key" ON "Feed"("url");
CREATE TABLE "new_UserSubscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "feed_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "tag_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "UserSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserSubscription_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "Feed" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserSubscription" ("created_at", "feed_id", "id", "is_active", "updated_at", "user_id") SELECT "created_at", "feed_id", "id", "is_active", "updated_at", "user_id" FROM "UserSubscription";
DROP TABLE "UserSubscription";
ALTER TABLE "new_UserSubscription" RENAME TO "UserSubscription";
CREATE UNIQUE INDEX "UserSubscription_user_id_feed_id_key" ON "UserSubscription"("user_id", "feed_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
