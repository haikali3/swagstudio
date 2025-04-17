import { Router, Request, Response } from "express";
import { fetchMedia } from "../services/media.service";
import { getCache, setCache } from "../utils/cache";
import { config } from "../config/env";

const router = Router();

router.get("/supplier/:supplierCode/medias/:productId", async (
req: any,
res: any,

) => {
  const { supplierCode, productId } = req.params;
  const cacheKey = `${supplierCode}-${productId}`;

  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  if (!config.psApiKey) {
    return res.status(500).json({ message: "API key is missing" });
  }

  try {
    const mediaData = await fetchMedia(supplierCode, productId);
    setCache(cacheKey, mediaData);
    res.json(mediaData);
  } catch (error: any) {
    console.error("❌ Failed to fetch media:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching media content", reason: error.response?.data || error.message });
  }
});

export default router;
