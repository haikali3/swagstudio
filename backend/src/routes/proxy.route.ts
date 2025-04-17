import { Router, Request, Response } from "express";
import { fetchImageBuffer } from "../services/proxy.service";

const router = Router();

router.get("/proxy-image", async (req: any, res: any) => {
  const imageUrl = req.query.url;

  if (typeof imageUrl !== "string") {
    return res.status(400).send("Invalid or missing 'url' query parameter");
  }

  try {
    const imageBuffer = await fetchImageBuffer(imageUrl);
    res.set("Content-Type", "image/jpeg");
    res.send(imageBuffer);
  } catch (error) {
    console.error("❌ Image proxy failed:", error);
    res.status(500).send("Failed to fetch image");
  }
});

export default router;
