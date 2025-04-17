import express from "express";
import cors from "cors";
import { config } from "./config/env";
import mediaRoute from "./routes/media.route";
import proxyRoute from "./routes/proxy.route";

const app = express();

app.use(
  cors({
    origin: config.allowedOrigin,
  })
);

app.use(mediaRoute);
app.use(proxyRoute);

app.listen(config.port, () => {
  console.log(`🚀 Server is running on http://localhost:${config.port}`);
});
