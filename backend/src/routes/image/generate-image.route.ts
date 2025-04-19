import { generateImageFromPrompt } from "../../services/image/generate-img-prompt.service";
import { Router } from "express";

const router = Router();

//POST /generate-image
router.post("/", async (req: any, res: any) => {
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

export default router;