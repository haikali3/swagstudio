import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  psApiKey: process.env.PS_RESTFUL_X_API_KEY || "",
  allowedOrigin: "http://localhost:5173",
};
