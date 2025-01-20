import * as XLSX from "xlsx";

export const generateExcelSheet = (bets: any[], outputPath: string): void => {
  const headers = [["Track Code", "Race Number", "Horse Number", "Bet Amount", "Type"]];
  const data = bets.map((bet) => [
    bet.trackCode,
    bet.raceNumber,
    bet.horseNumber,
    bet.betAmount,
    bet.type,
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bets");

  XLSX.writeFile(workbook, outputPath);
};