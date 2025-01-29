import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 8080,
  xpressbetApiUrl: process.env.XPRESSBET_API_URL || "",
};