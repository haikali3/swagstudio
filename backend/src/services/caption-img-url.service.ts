import { GoogleGenAI, HarmBlockThreshold, HarmCategory, Modality } from "@google/genai";
import * as fs from "node:fs";
import axios from "axios";

// UNDERSTAND IMAGE FROM GEMINI 2.0-FLASH
export async function captionImageFromUrl(imageUrl: string, prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const base64ImageData = Buffer.from(response.data).toString("base64");

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageData,
        },
      },
      { text: prompt },
    ],
  });

  const textResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
  return textResponse;
}