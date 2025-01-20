import { Router } from "express";
import { handleBetRequest } from "../controllers/betController";

const router = Router();

router.post("/submit-bets", handleBetRequest);

export default router;