import { Request, Response } from "express";
import { createBetCsv } from "../utils/betCsvGenerator";
import { placeBet } from "../services/xpressbetService";
import { betSchema } from "./betValidator";
import logger from "../config/logger";

export const handleBetRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bets, betType } = req.body;
		const { error } = betSchema.validate(req.body);

    // Validate incoming data
    if (!Array.isArray(bets) || bets.length === 0 || !betType) {
      res.status(400).json({ success: false, message: "Invalid bet data or bet type." });
      return;
    }

    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
      return;
    }

    // Generate Excel file for Xpressbet submission
    let filePath: string;
    try {
      filePath = createBetCsv(bets, betType);
    } catch (err) {
      res.status(500).json({ success: false, message: "Error generating bet file." });
      return;
    }

    // Submit to Xpressbet
    const result = await placeBet(filePath);

    res.status(200).json({ success: true, result });
  } catch (error: any) {
		logger.error(`Error processing bet request: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};