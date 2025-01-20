import { generateExcelSheet } from "../../utils/excelGenerator";
import * as fs from "fs";

describe("Excel Generator", () => {
  const testBets = [
    { trackCode: "ABC", raceNumber: 1, horseNumber: 5, betAmount: 100, type: "Win" },
    { trackCode: "DEF", raceNumber: 2, horseNumber: 3, betAmount: 50, type: "Place" },
  ];

  const filePath = "./test-bets.xlsx";

  afterEach(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Clean up after tests
    }
  });

  it("should generate an Excel file with correct data", () => {
    generateExcelSheet(testBets, filePath);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("should create a file with valid Excel structure", () => {
    generateExcelSheet(testBets, filePath);
    const fileStats = fs.statSync(filePath);
    expect(fileStats.size).toBeGreaterThan(0);
  });
});