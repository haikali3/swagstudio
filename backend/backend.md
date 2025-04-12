# 🛍️ PromoStandards Product Sync Backend
This is a Node.js backend that fetches product data from the PromoStandards API and stores it in a local SQLite database using Prisma.

---

## ⚙️ Setup

### 1. Install Dependencies

Run the following command to install the required dependencies:

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
PROMOSTANDARDS_USERNAME=your_username
PROMOSTANDARDS_PASSWORD=your_password
```

Replace `your_username` and `your_password` with your actual credentials for PromoStandards.

### 3. Define Prisma Schema

Edit `prisma/schema.prisma` to include your models (e.g., `Product`).

### 4. Push Prisma Schema to SQLite DB

Run the following command to create the SQLite database file and apply the schema:

```bash
npx prisma db push
```

### 5. Generate Prisma Client

Run the following command to generate the Prisma client into `./node_modules/.prisma`:

```bash
npx prisma generate
```

---

## 🧪 Development

### Run the Backend Script

Run the following command to fetch product data from the PromoStandards API and store it in your local database:

```bash
pnpm tsx src/index.ts
```

### Optional: Open Prisma Studio

Run the following command to open a visual editor for your SQLite database:

```bash
npx prisma studio
```

---

## 🔄 Useful Scripts

| Command                  | Description                          |
|--------------------------|--------------------------------------|
| `pnpm install`           | Install dependencies                 |
| `npx prisma db push`     | Sync Prisma schema to SQLite DB      |
| `npx prisma generate`    | Generate Prisma client               |
| `pnpm tsx src/index.ts`  | Run the sync script                  |
| `npx prisma studio`      | Open the Prisma DB UI                |