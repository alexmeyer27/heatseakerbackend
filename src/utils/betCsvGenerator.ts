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

  const rows: any[][] = [];
  const eventDate = eventBetDate(); // Use the refactored eventBetDate method

  betDetailsArray.forEach((betDetail) => {
    const row: any[] = [
      8668, // Account
      5556, // Pin
      eventDate,
      betDetail.trackCode,
      betDetail.raceNumber,
      betDetail.type,
      betDetail.horseNumber,
      betDetail.betAmount ||
      betDetail?.placeBetAmount ||
      betDetail?.exactaBetAmount,
      "WHEEL",
    ];
    rows.push(row);
  });

  // Manually construct CSV content
  const csvContent = rows.map(row => row.join(",")).join("\n");

  // Define the file path
  const fileName = `./bets-${betType}-${Date.now()}.csv`;

  // Write the CSV file manually to ensure proper comma separation
  fs.writeFileSync(fileName, csvContent, { encoding: "utf-8" });

  return fileName; // Return the CSV file path
};