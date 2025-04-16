// backend/src/index.ts
import dotenv from 'dotenv';
import express, { Request, Response, Application } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import cors from "cors";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;
const PS_RESTFUL_X_API_KEY = process.env.PS_RESTFUL_X_API_KEY;

app.use(
  cors({
    origin: "http://localhost:5173", // React (Vite) frontend
  })
);

// ---------------------- 🖼️ Image Proxy Route ----------------------
app.get("/proxy-image", async (req, res) => {
  const imageUrl = req.query.url;
  if (typeof imageUrl !== "string") {
    res.status(400).send("Invalid or missing 'url' query parameter");
    return;
  }

  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    res.set("Content-Type", "image/jpeg");
    res.send(response.data);
  } catch (err) {
    console.error("❌ Image proxy failed:", err);
    res.status(500).send("Failed to fetch image");
  }
});

// ---------------------- 🧠 Promo Standards Media Route ----------------------
const mediaCache: Record<string, { data: any; expiry: number }> = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000;

app.get(
  '/supplier/:supplierCode/medias/:productId',
  async (
    req: Request<{ supplierCode: string; productId: string }, any, any, any, any>,
    res: Response
  ) => {
    const { supplierCode, productId } = req.params;
    const cacheKey = `${supplierCode}-${productId}`;

    const now = Date.now();
    if (mediaCache[cacheKey] && mediaCache[cacheKey].expiry > now) {
      res.json(mediaCache[cacheKey].data);
      return;
    }

    if (!PS_RESTFUL_X_API_KEY) {
      console.error('❌ Missing PS_RESTFUL_X_API_KEY.');
      res.status(500).json({ message: 'API key is missing' });
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

      mediaCache[cacheKey] = {
        data: response.data,
        expiry: now + CACHE_DURATION,
      };

      res.json(response.data);
    } catch (error: any) {
      console.error(`❌ Failed to fetch media:`, error.response?.data || error.message);
      res.status(500).json({
        message: 'Error fetching media content',
        reason: error.response?.data || error.message,
      });
    }
  }
);

// ---------------------- 🚀 Start Server ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
