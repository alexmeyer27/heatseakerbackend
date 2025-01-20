import { handleBetRequest } from "../../controllers/betController";
import { generateExcelSheet } from "../../utils/excelGenerator";
import { placeBet } from "../../services/xpressbetService";
import { Request, Response } from "express";

jest.mock("../../utils/excelGenerator");
jest.mock("../../services/xpressbetService");

describe("Bet Controller", () => {
  const mockRequest = (body: any): Request =>
    ({ body } as Request);
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should return 400 if the request body is invalid", async () => {
    const req = mockRequest([]);
    const res = mockResponse();

    await handleBetRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid bet data.",
    });
  });

  it("should generate an Excel file and place the bet", async () => {
    const bets = [
      { trackCode: "ABC", raceNumber: 1, horseNumber: 5, betAmount: 100, type: "Win" },
    ];
    const req = mockRequest(bets);
    const res = mockResponse();

    (placeBet as jest.Mock).mockResolvedValue({ success: true });

    await handleBetRequest(req, res);

    expect(generateExcelSheet).toHaveBeenCalledWith(bets, expect.any(String));
    expect(placeBet).toHaveBeenCalledWith(expect.any(String));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: { success: true },
    });
  });
});