import dotenv from 'dotenv';
import { fetchAndStoreProducts } from './services/fetchProduct';

dotenv.config();

(async () => {
  try {
    await fetchAndStoreProducts();
    console.log('🚀 Product sync complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error syncing products:', err);
    process.exit(1);
  }
})();
