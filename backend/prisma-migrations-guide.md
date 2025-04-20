# Prisma Schema & Migration Guide

This guide explains how to manage your database schema with Prisma, including creating migrations, adding/removing columns, seeding data, and more.

## 1. Starting Point

You should already have:
* `prisma/schema.prisma` defining your data models.
* A SQLite file at `dev.db` (as per your `DATABASE_URL`).
* An initial migration applied:

```bash
npx prisma migrate dev --name init 
npx prisma generate
```

* (Optional) A seed script configured in `package.json` under:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

## 2. Adding a New Column

### a) Edit your schema

```diff
model Product {
  id        Int      @id @default(autoincrement())
  productId String   @unique
+ sku       String?
  createdAt DateTime @default(now())
  images    ProductImage[]
}
```

### b) Create & apply a migration

```bash
npx prisma migrate dev --name add-sku-to-product
```

* **Under the hood:**
   1. Computes the diff between old vs. new schema.
   2. Creates a SQL file in `prisma/migrations/…/migration.sql`:

```sql
ALTER TABLE "Product" ADD COLUMN "sku" TEXT;
```

   3. Runs that SQL against `dev.db`.
   4. Updates the `_prisma_migrations` table.
   5. Auto-generates the Prisma Client.

### c) Verify
* Open Studio:

```bash
npx prisma studio
```

* Confirm the `sku` column exists.
* Use in code:

```ts
await prisma.product.create({
  data: {
    productId: "123",
    sku: "ABC-123"
  }
})
```

## 3. Removing or Renaming a Column

### a) Rename in Prisma but keep the same DB column

```diff
model Product {
  id        Int      @id @default(autoincrement())
  productId String   @unique
- sku       String?
+ stockKeepingUnit String? @map("sku")
  createdAt DateTime @default(now())
  images    ProductImage[]
}
```

### b) Run migration

```bash
npx prisma migrate dev --name rename-sku-to-stock-unit
```

* **Under the hood:**

```sql
ALTER TABLE "Product" RENAME COLUMN "sku" TO "stockKeepingUnit";
```

* Prisma Client is regenerated automatically.

### c) Dropping a column
* Remove the field line entirely, then:

```bash
npx prisma migrate dev --name drop-sku-column
```

* Prisma emits:

```sql
ALTER TABLE "Product" DROP COLUMN "sku";
```

## 4. Fast Prototyping: `db push`

If you just want to sync schema → DB without migration history:

```bash
npx prisma db push
npx prisma generate
```

* **No SQL files** are created.
* **Danger**: dropped columns/data are lost without record.
* **Use when** you're in early development and don't need versioned migrations.

## 5. Seeding Your Database

### a) Create a seed script

`prisma/seed.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      productId: "001",
      stockKeepingUnit: "SKU-001",
      images: {
        create: [{ url: "https://…" }]
      },
    },
  });
  // ...more seed data
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

### b) Run the seed

```bash
npx prisma db seed
```

* Executes the command in your `package.json` under `"prisma.seed"`.
* Inserts initial or test data into your freshly migrated DB.

## 6. Resetting Your Database

When you need a completely clean slate:

```bash
npx prisma migrate reset
```

* **Drops** all tables in `dev.db`.
* **Re-applies** every migration in order.
* **Runs** the seed script (if present).
* **Regenerates** Prisma Client.

## 7. Quick-Reference Cheat Sheet

| Goal | Command |
|------|---------|
| Apply schema change & keep history | `npx prisma migrate dev --name <descriptive-name>` |
| Push schema directly (no history) | `npx prisma db push` |
| Generate/refresh Prisma Client | `npx prisma generate` |
| Seed the database | `npx prisma db seed` |
| Reset everything & re-seed | `npx prisma migrate reset` |
| Inspect data in a web UI | `npx prisma studio` |

## 8. What Happens "Under the Hood"

1. **Read** your `schema.prisma`.
2. **Diff** it against:
   * Last migration (for `migrate dev`), or
   * Current DB schema (for `db push`).
3. **Emit DDL** (`CREATE`, `ALTER`, `DROP`) as SQL.
4. **Apply** SQL to the SQLite file.
5. **Update** the `_prisma_migrations` table (only for migrate).
6. **Regenerate** the Prisma Client.
7. **(Optional)** Run your seed script to populate initial data.