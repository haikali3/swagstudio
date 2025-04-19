import { Router } from "express";
import { captionImageFromUrl } from "../../services/caption-img-url.service";

const router = Router();

router.post("/", async (req: any, res: any) => {
  const { imageUrl, prompt } = req.body;
  if (!imageUrl || !prompt)
    return res.status(400).json({ message: "Missing imageUrl or prompt" });

  try {
    const caption = await captionImageFromUrl(imageUrl, prompt);
    res.json({ caption });
  } catch (err: any) {
    console.error("❌ Gemini captioning error:", err);
    res.status(500).json({ message: "Captioning failed", error: err.message });
  } });

export default router;
