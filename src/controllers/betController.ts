import { Request, Response } from "express";
import { generateExcelSheet } from "../utils/excelGenerator";
import { placeBet } from "../services/xpressbetService";

export const handleBetRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const bets = req.body;

    // Validate incoming data
    if (!Array.isArray(bets) || bets.length === 0) {
      res.status(400).json({ success: false, message: "Invalid bet data." });
      return;
    }

    // Generate Excel file for Xpressbet submission
    const filePath = `./bets-${Date.now()}.xlsx`;
    generateExcelSheet(bets, filePath);

    // Submit to Xpressbet
    const result = await placeBet(filePath);

    res.status(200).json({ success: true, result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};