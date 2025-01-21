import * as XLSX from "xlsx";
import * as fs from "fs";

interface BetDetail {
  trackCode: string;
  raceNumber: number;
  horseNumber: number | string;
  betAmount: number;
  placeBetAmount?: number;
  exactaBetAmount?: number;
  exactaHorseNumber?: number;
  type: string; // WIN, PLACE, EXACTA
}

export const eventBetDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const createBetCsv = (betDetailsArray: BetDetail[], betType: string): string => {
  if (!Array.isArray(betDetailsArray) || betDetailsArray.length === 0) {
    throw new Error("Bet details array is empty or invalid.");
  }
  
  const headers = ["Account", "SubAccount", "Date", "Track Code", "Race Number", "Bet Type", "Horse(s)", "Wheel", "Bet Amount"];
  const rows: any[][] = [];
  const eventDate = eventBetDate(); // Use the refactored eventBetDate method

  betDetailsArray.forEach((betDetail) => {
    const row: any[] = [
      "8668", // Account
      "5556", // SubAccount
      eventDate, // Date
      betDetail.trackCode, // Track Code
      betDetail.raceNumber, // Race Number
      betDetail.type, // Bet Type
      betDetail.type === "EXACTA"
        ? `${betDetail.horseNumber}-${betDetail.exactaHorseNumber}`
        : betDetail.horseNumber, // Horse(s)
      "WHEEL", // Wheel
      betDetail.betAmount || betDetail.placeBetAmount || betDetail.exactaBetAmount, // Bet Amount
    ];
    rows.push(row);
  });

  // Generate the Excel workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  XLSX.utils.book_append_sheet(workbook, worksheet, `${betType.toUpperCase()}BETS`);
  const fileName = `./bets-${betType}-${Date.now()}.xlsx`;
  XLSX.writeFile(workbook, fileName);

  return fileName; // Return the file path
};