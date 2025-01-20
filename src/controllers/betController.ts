import { Request, Response } from "express";
import { createBetCsv } from "../utils/betCsvGenerator";
import { placeBet } from "../services/xpressbetService";

export const handleBetRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bets, betType } = req.body;

    // Validate incoming data
    if (!Array.isArray(bets) || bets.length === 0 || !betType) {
      res.status(400).json({ success: false, message: "Invalid bet data or bet type." });
      return;
    }

    // Validate betType
    const allowedBetTypes = ["bBet", "cBet", "dBet", "eBet", "fBet", "gBet"];
    if (!allowedBetTypes.includes(betType)) {
      res.status(400).json({ success: false, message: "Invalid bet type provided." });
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
    res.status(500).json({ success: false, message: error.message });
  }
};