import { Router } from "express";
import { editImageWithGemini } from "../../services/edit-img.service"

const router = Router();

// POST /edit-image
router.post("/", async (req: any, res: any) => {
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
