import { prisma } from '../db/client';

// Dummy product list
const dummyProducts = [
  {
    id: 'prod_1',
    name: 'Eco Bottle',
    description: 'Reusable eco-friendly water bottle',
    imageUrl: 'https://example.com/image1.jpg',
    imprintX: 100,
    imprintY: 150,
  },
  {
    id: 'prod_2',
    name: 'Canvas Tote',
    description: 'Stylish and durable tote bag',
    imageUrl: 'https://example.com/image2.jpg',
    imprintX: 50,
    imprintY: 75,
  },
];

export async function fetchAndStoreProducts() {
  // Call PromoStandards Product API
  // Parse name, image, imprint location
  // Save to SQLite using Prisma

  console.log('Fetching product data from PromoStandards...');

  // Simulate fetching
  for (const product of dummyProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product,
    });
  }

  console.log('✅ Products saved to SQLite database.');
}