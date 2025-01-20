import express from "express";
import dotenv from "dotenv";
import betRoutes from "./routes/betRoutes";

dotenv.config();

const app = express();
app.use(express.json()); // Parse incoming JSON

// Register routes
app.use("/api", betRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;