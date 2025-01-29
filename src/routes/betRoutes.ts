import { Router } from "express";
import apiKeyAuth from "../middleware/apiKeyAuth"; // Import API key middleware
import { handleBetRequest } from "../controllers/betController";

const router = Router();

router.post("/submit-bets", apiKeyAuth, handleBetRequest);

export default router;