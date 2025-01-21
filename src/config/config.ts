import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  xpressbetApiUrl: process.env.XPRESSBET_API_URL || "",
  xpressbetApiKey: process.env.XPRESSBET_API_KEY || "",
};