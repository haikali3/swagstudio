import { Router } from "express";
import { fetchMedia } from "../services/media.service";
import { getCache, setCache } from "../utils/cache";
import { config } from "../config/env";
import { saveAllProductImages } from "../services/product.service";

const router = Router();

router.get(
  "/supplier/:supplierCode/medias/:productId",
  async (req: any, res: any) => {
    const { supplierCode, productId } = req.params;
    const cacheKey = `${supplierCode}-${productId}`;

    // 1) try cache
    const cachedData = getCache(cacheKey);
    if (cachedData) return res.json(cachedData);

    if (!config.psApiKey) {
      return res.status(500).json({ message: "API key is missing" });
    }

    try {
      // 2) fetch from PS
      const mediaData = await fetchMedia(supplierCode, productId);

      // 3) extract array
      const mediaArr = mediaData.MediaContentArray
        .MediaContent as Array<{
          url: string;
          ClassTypeArray: { ClassType: Array<{ classTypeName: string }> };
        }>;

      // 4) save all URLs + classTypeNames
      await saveAllProductImages(productId, mediaArr);

      // 5) cache + return
      setCache(cacheKey, mediaData);
      res.json(mediaData);
    } catch (err: any) {
      console.error("❌ Failed to fetch or save images:", err);
      res.status(500).json({
        message: "Error fetching media content",
        reason: err.response?.data || err.message || err,
      });
    }
  }
);

export default router;
