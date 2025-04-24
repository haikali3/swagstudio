import express from "express";
import cors from "cors";
import { config } from "./config/env";
import mediaRoute from "./routes/media.route";
import proxyRoute from "./routes/proxy.route";
import imageRoutes from "./routes/route-index";
import { ErrorRequestHandler } from "express";

const app = express();

// 1) Global middleware
app.use(cors({ origin: config.allowedOrigin }));
app.use(express.json());

// 2) Mount your routers
// leaves the media route exactly as defined: 
//   GET /supplier/:supplierCode/medias/:productId
app.use(mediaRoute);
app.use(proxyRoute);

app.get("/", (req, res) => {
  res.send("hello friend!");
});

// groups your three image routers as:
app.use("/image", imageRoutes);
//   POST /image/caption-image
//   POST /image/generate-image
//   POST /image/edit-image

// 3) Catch‑all error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
};
app.use(errorHandler);

app.listen(config.port, () =>
  console.log(`🚀 Server running on ${config.backendUrl}`)
);
