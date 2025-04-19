import axios from "axios";
import { GoogleGenAI, Modality } from "@google/genai";

export async function editImageWithGemini(
  imageUrl: string,
  prompt: string,
  brandImageBase64?: string
): Promise<Buffer> {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

  // fetch primary image
  const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const primaryBase64 = Buffer.from(resp.data).toString("base64");

  // Build contents: first the prompt, then the two images
  const contents: any[] = [
    { text: prompt },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: primaryBase64,
      },
    },
  ];

  // if user uploaded brand image, add it too
  if (brandImageBase64) {
    contents.push({
      inlineData: {
        mimeType: "image/png",
        data: brandImageBase64,
      },
    });
  }

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents,
    config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
  });

  const part = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!part?.inlineData?.data) throw new Error("No image generated");
  return Buffer.from(part.inlineData.data, "base64");
}
