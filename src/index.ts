import express from "express";
import dotenv from "dotenv";
import betRoutes from "./routes/betRoutes";
import logger from "./config/logger";

// Load environment variables from .env
dotenv.config();

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

// Dynamically bind to the PORT from environment variables or default to 8080
const PORT = Number(process.env.PORT) || 8080;
const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

// Export the app and server for testing
export { app, server };