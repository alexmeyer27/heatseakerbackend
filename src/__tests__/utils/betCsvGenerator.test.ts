import * as fs from "fs";
import * as XLSX from "xlsx";
import { createBetCsv, eventBetDate } from "../../utils/betCsvGenerator";

describe("betCsvGenerator", () => {
  const mockBets = [
		{ trackCode: "ABC", raceNumber: 1, horseNumber: "5", betAmount: 100, type: "WIN" },
		{ trackCode: "DEF", raceNumber: 2, horseNumber: "3", betAmount: 50, placeBetAmount: 50, type: "PLACE" },
		{ trackCode: "XYZ", raceNumber: 3, horseNumber: "7", betAmount: 30, exactaBetAmount: 30, exactaHorseNumber: 8, type: "EXACTA" },
	];

  describe("eventBetDate", () => {
    it("should return the date in YYYY-MM-DD format", () => {
      const date = new Date();
      const expectedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      expect(eventBetDate()).toBe(expectedDate);
    });
  });

  describe("createBetCsv", () => {
    it("should generate a valid Excel file with the correct file name", () => {
      const filePath = createBetCsv(mockBets, "bBet");

      // Ensure the file exists
      expect(fs.existsSync(filePath)).toBe(true);

      // Clean up after the test
      fs.unlinkSync(filePath);
    });

    it("should include correct headers and rows in the Excel file", () => {
      const filePath = createBetCsv(mockBets, "cBet");

      // Read the generated Excel file
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Validate headers
      expect(data[0]).toEqual([
        "Account",
        "SubAccount",
        "Date",
        "Track Code",
        "Race Number",
        "Bet Type",
        "Horse(s)",
        "Wheel",
        "Bet Amount",
      ]);

      // Validate rows
      expect(data[1]).toEqual([
        "8668",
        "5556",
        eventBetDate(), // Match the generated date
        "ABC",
        1,
        "WIN",
        "5",
        "WHEEL",
        100,
      ]);

      expect(data[2]).toEqual([
        "8668",
        "5556",
        eventBetDate(),
        "DEF",
        2,
        "PLACE",
        "3",
        "WHEEL",
        50,
      ]);

      expect(data[3]).toEqual([
        "8668",
        "5556",
        eventBetDate(),
        "XYZ",
        3,
        "EXACTA",
        "7-8",
        "WHEEL",
        30,
      ]);

      // Clean up after the test
      fs.unlinkSync(filePath);
    });

    it("should generate a file with a unique name", () => {
      const filePath1 = createBetCsv(mockBets, "dBet");
      const filePath2 = createBetCsv(mockBets, "eBet");

      expect(filePath1).not.toEqual(filePath2);

      // Clean up after the test
      fs.unlinkSync(filePath1);
      fs.unlinkSync(filePath2);
    });

    it("should throw an error if the input is invalid", () => {
      expect(() => createBetCsv([], "fBet")).toThrowError("Bet details array is empty or invalid.");
      expect(() => createBetCsv(null as any, "gBet")).toThrowError("Bet details array is empty or invalid.");
    });
  });
});