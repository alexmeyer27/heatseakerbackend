import express from "express";
import config from "./config/config";
import betRoutes from "./routes/betRoutes";
import logger from "./config/logger";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// Load package.json version dynamically
const packageJson = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf-8"));
const APP_VERSION = packageJson.version;

// Initialize the Express app
const app = express();
app.use(express.json());

// Add the health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Application is running smoothly!",
    timestamp: new Date().toISOString(),
    version: APP_VERSION,
  });
});

// Mount other routes
app.use("/api", betRoutes);

// Dynamically bind to the PORT from `config.ts`
const PORT = config.port;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app and server for testing
export { app, server };