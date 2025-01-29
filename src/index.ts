import express from "express";
import config from "./config/config"; // Import config.ts
import betRoutes from "./routes/betRoutes";
import logger from "./config/logger";

// Log environment variables (for debugging purposes only; remove in production)
console.log("Environment variables loaded:", config);

// Initialize the Express app
const app = express();
app.use(express.json());

// Add the health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Application is running smoothly!",
    timestamp: new Date().toISOString(),
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