import dotenv from 'dotenv';
import { fetchAndStoreProducts } from './services/fetchProduct';
import express from 'express';

dotenv.config();

(async () => {
  try {
    await fetchAndStoreProducts();
    console.log('🚀 Product sync complete!');
    
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Error syncing products:', err);
    process.exit(1); // it's okay to exit on error
  }
})();
