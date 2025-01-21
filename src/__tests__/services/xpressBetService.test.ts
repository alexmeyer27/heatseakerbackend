import axios from "axios";
import * as fs from "fs";
import { placeBet, submitBet } from "../../services/xpressbetService";
import FormData from "form-data";

jest.mock("axios");

describe("Xpressbet Service", () => {
  const filePath = "./test-bets.xlsx";

  beforeEach(() => {
    fs.writeFileSync(filePath, "dummy data");
  });

  afterEach(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    jest.clearAllMocks();
  });

  describe("submitBet", () => {
    it("should call the Xpressbet API with the correct file", async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

      const result = await submitBet(filePath);

      expect(axios.post).toHaveBeenCalledWith(
        "https://dfu.xb-online.com/wagerupload/betupload.aspx",
        expect.any(FormData), // Match any instance of FormData
        expect.objectContaining({
          headers: expect.any(Object), // Match any object for headers
        })
      );

      expect(result).toEqual({ success: true });
    });

    it("should delete the file after submission", async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

      await submitBet(filePath);

      // Ensure the file is deleted
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it("should throw an error if the file does not exist", async () => {
      fs.unlinkSync(filePath); // Remove the file

      await expect(submitBet(filePath)).rejects.toThrow(`File not found: ${filePath}`);
    });

    it("should throw an error if the API call fails", async () => {
      (axios.post as jest.Mock).mockRejectedValue({ response: { data: "API error" } });

      await expect(submitBet(filePath)).rejects.toThrow("Bet submission failed: API error");
    });
  });

  describe("placeBet", () => {
    it("should delegate to submitBet", async () => {
      const mockSubmitBet = jest.fn().mockResolvedValue({ success: true });
      jest.spyOn(require("../../services/xpressbetService"), "submitBet").mockImplementation(mockSubmitBet);

      const result = await placeBet(filePath);

      expect(mockSubmitBet).toHaveBeenCalledWith(filePath);
      expect(result).toEqual({ success: true });
    });
  });
});