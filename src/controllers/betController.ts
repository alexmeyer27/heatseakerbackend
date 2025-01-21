import { Request, Response } from "express";
import { createBetCsv } from "../utils/betCsvGenerator";
import { placeBet } from "../services/xpressbetService";
import { betSchema } from "./betValidator"; // Corrected path for the validator
import logger from "../config/logger";

export const handleBetRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bets, betType } = req.body;

    // Validate incoming data
    const { error } = betSchema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
      return;
    }

    if (!Array.isArray(bets) || bets.length === 0 || !betType) {
      res.status(400).json({ success: false, message: "Invalid bet data or bet type." });
      return;
    }

    // Extract details for file name generation
    const { trackCode, raceNumber } = bets[0]; // Assuming all bets are for the same track and race

    // Generate the CSV file for Xpressbet submission
    let filePath: string;
    try {
      filePath = createBetCsv(bets, betType);
    } catch (error: any) {
      logger.error(`Error generating bet file: ${error.message}`);
      res.status(500).json({ success: false, message: "Error generating bet file." });
      return;
    }

    // Submit the bet file to Xpressbet
    let result;
    try {
      result = await placeBet(trackCode, betType, raceNumber, filePath);
    } catch (error: any) {
      logger.error(`Error submitting bet file: ${error.message}`);
      res.status(500).json({ success: false, message: "Error submitting bet file to Xpressbet." });
      return;
    }

    // Successful response
    res.status(200).json({ success: true, result });
  } catch (error: any) {
    logger.error(`Error processing bet request: ${error.message}`);
    res.status(500).json({ success: false, message: "An unexpected error occurred while processing the request." });
  }
};