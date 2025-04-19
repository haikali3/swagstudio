
import { GoogleGenAI, Modality, HarmCategory, HarmBlockThreshold } from "@google/genai";
import * as fs from "fs";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// Text > Image
export async function generateImageFromPrompt(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: prompt,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
      safetySettings: safetySettings,
    },
  });

  let outputText = "";
  let imageSaved = false;

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.text) {
      outputText = part.text;
    } else if (part.inlineData?.data) {
      const buffer = Buffer.from(part.inlineData.data, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      imageSaved = true;
    }
  }

  return {
    message: "Image generated successfully",
    description: outputText,
    imagePath: imageSaved ? "gemini-native-image.png" : null,
  };
}

