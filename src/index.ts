import express from "express";
import dotenv from "dotenv";
import betRoutes from "./routes/betRoutes";
import logger from "./config/logger";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", betRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

// Export the app and server for testing
export { app, server };