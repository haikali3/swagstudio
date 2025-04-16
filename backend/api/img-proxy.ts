// server.js or /api/image-proxy.ts
import express from "express";
import axios from "axios";

const app = express();

app.get("/proxy-image", async (req, res) => {
  const imageUrl = req.query.url;
  if (typeof imageUrl !== "string") {
    res.status(400).send("Invalid or missing 'url' query parameter");
    return;
  }
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    res.set("Content-Type", "image/jpeg");
    res.send(response.data);
  } catch (err) {
    res.status(500).send("Failed to fetch image");
  }
});

app.listen(3000, () => console.log("Proxy running on :3000"));
