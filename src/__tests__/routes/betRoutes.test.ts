import request from "supertest";
import { app, server } from "../../index";
import { placeBet } from "../../services/xpressbetService";
import { generateExcelSheet } from "../../utils/excelGenerator";

jest.mock("../../services/xpressbetService");
jest.mock("../../utils/excelGenerator");

describe("Bet Routes", () => {
  const mockBets = [
    { trackCode: "ABC", raceNumber: 1, horseNumber: 5, betAmount: 100, type: "Win" },
    { trackCode: "DEF", raceNumber: 2, horseNumber: 3, betAmount: 50, type: "Place" },
  ];

  afterAll(() => {
    server.close(); // Ensure the server is closed
  });

  it("should return 200 for valid bet submission", async () => {
    (generateExcelSheet as jest.Mock).mockImplementation(() => {});
    (placeBet as jest.Mock).mockResolvedValue({ success: true });

    const response = await request(app)
      .post("/api/submit-bets")
      .send(mockBets);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should return 400 for invalid data", async () => {
    const response = await request(app)
      .post("/api/submit-bets")
      .send([]);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});