import dotenv from "dotenv";

dotenv.config();

export default {
  port: Number(process.env.PORT) || 8080,
  apiKey: process.env.API_KEY || "default-api-key",
};