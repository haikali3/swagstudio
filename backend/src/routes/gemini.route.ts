import { Router } from "express";
import { captionImageFromUrl } from "../services/caption-img-url.service";
import { generateImageFromPrompt } from "../services/gen-img-prompt.service"
import { editImageWithGemini } from "../services/edit-img.service"

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

//POST /generate-image
router.post("/generate-image", async (req: any, res: any) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Missing 'prompt' in request body" });
  }

  try {
    const result = await generateImageFromPrompt(prompt);
    res.status(200).json(result);
  } catch (err: any) {
    console.error("❌ Gemini image generation error:", err);
    res.status(500).json({ message: "Image generation failed", error: err.message });
  }
});

// POST /edit-image
router.post("/edit-image", async (req: any, res: any) => {
  const { imageUrl, prompt } = req.body;

  if (!imageUrl || !prompt) {
    return res.status(400).json({ message: "Missing 'imageUrl' or 'prompt'" });
  }

  try {
    const imageBase64 = await editImageWithGemini(imageUrl, prompt);
    res.setHeader("Content-Type", "image/png");
    res.send(imageBase64);
    //res.send(Buffer.from(imageBase64, "base64"));
  } catch (err: any) {
    console.error("❌ Image edit failed:", err);
    res.status(500).json({ message: "Image edit failed", error: err.message });
  }
});

export default router;
