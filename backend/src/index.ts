// index.ts
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Simple in-memory cache
const mediaCache: Record<string, { data: any; expiry: number }> = {};

// Duration to cache in ms (2 hours)
const CACHE_DURATION = 2 * 60 * 60 * 1000;

app.get(
  '/supplier/:supplierCode/medias/:productId',
  async (req: Request<{ supplierCode: string; productId: string }>, res: Response) => {
    const { supplierCode, productId } = req.params;
    const cacheKey = `${supplierCode}-${productId}`;

    const now = Date.now();

    // Return cached version if valid
    if (mediaCache[cacheKey] && mediaCache[cacheKey].expiry > now) {
      return res.json(mediaCache[cacheKey].data);
    }

    try {
      const response = await axios.get(
        `https://api.psrestful.com/v1.1.0/suppliers/${supplierCode}/medias/${productId}/?environment=PROD`
      );

      // Cache the response
      mediaCache[cacheKey] = {
        data: response.data,
        expiry: now + CACHE_DURATION,
      };

      res.json(response.data);
    } catch (err: any) {
      console.error(`❌ Failed to fetch media for ${supplierCode}-${productId}:`, err);
      res.status(500).json({ message: 'Error fetching media content' });
    }
  }
);

// You can call this during startup or not, your call
(async () => {
  try {
    console.log('🚀 Server init starting...');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
})();