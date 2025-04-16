// index.ts
import dotenv from 'dotenv';
import express, { Request, Response, Application } from 'express';
import axios, { AxiosRequestConfig } from 'axios';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const PS_RESTFUL_X_API_KEY = process.env.PS_RESTFUL_X_API_KEY;
console.log(PS_RESTFUL_X_API_KEY)

// Simple in-memory cache
const mediaCache: Record<string, { data: any; expiry: number }> = {};

// Duration to cache in ms (2 hours)
const CACHE_DURATION = 3 * 60 * 60 * 1000;

app.get(
  '/supplier/:supplierCode/medias/:productId',
  async (
    req: Request<{ supplierCode: string; productId: string }, any, any, any, any>,
    res: Response
  ): Promise<void> => {
    const { supplierCode, productId } = req.params;
    const cacheKey = `${supplierCode}-${productId}`;

    const now = Date.now();

    // Return cached version if valid
    if (mediaCache[cacheKey] && mediaCache[cacheKey].expiry > now) {
      res.json(mediaCache[cacheKey].data);
      return;
    }

    if (!PS_RESTFUL_X_API_KEY) {
      console.error('❌ Missing PS_RESTFUL_X_API_KEY environment variable.');
      res.status(500).json({ message: 'Error fetching media content: API key is missing' });
      return;
    }

    const config: AxiosRequestConfig = {
      headers: {
        'X-API-KEY': PS_RESTFUL_X_API_KEY,
      },
    };

    try {
      const response = await axios.get(
        `https://api.psrestful.com/v1.1.0/suppliers/${supplierCode}/medias/${productId}/?environment=PROD`,
        config
      );

      // Cache the response
      mediaCache[cacheKey] = {
        data: response.data,
        expiry: now + CACHE_DURATION,
      };

      res.json(response.data);
    } catch (error: any) {
      console.error(
        `❌ Failed to fetch media for ${supplierCode}-${productId}:`,
        error.response ? error.response.data : error.message
      );
      res.status(500).json({
        message: 'Error fetching media content',
        reason: error.response ? error.response.data : error.message,
      });
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