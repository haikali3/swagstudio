import { Router, Request, Response } from "express";
import { captionImageFromUrl } from "../services/gemini.service";

const router = Router();

// POST /caption-image
router.post("/caption-image", async (req: any, res: any) => {
  const { imageUrl, prompt } = req.body;

  if (!imageUrl || !prompt) {
    return res.status(400).json({ message: "Missing 'imageUrl' or 'prompt'" });
  }

  try {
    const caption = await captionImageFromUrl(imageUrl, prompt);
    res.json({ caption });
  } catch (err: any) {
    console.error("❌ Gemini captioning error:", err);
    res.status(500).json({ message: "Gemini captioning failed", error: err.message });
  }
});

export default router;
