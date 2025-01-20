import { Request, Response } from "express";
import { generateExcelSheet } from "../utils/excelGenerator";
import { placeBet } from "../services/xpressbetService";

export const handleBetRequest = async (req: Request, res: Response) => {
  try {
    const bets = req.body; // Incoming JSON array from Google Sheets

    // Validate incoming data
    if (!Array.isArray(bets) || bets.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid bet data." });
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