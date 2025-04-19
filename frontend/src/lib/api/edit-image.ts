import axios from "axios";

export async function editImage({ imageUrl, prompt }: { imageUrl: string; prompt: string }): Promise<string> {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/image/edit-image`,
    {
      imageUrl,
      prompt,
    },
    { responseType: "arraybuffer" }
  );

  const blob = new Blob([response.data], { type: "image/png" });
  return URL.createObjectURL(blob); // For frontend image preview
}
