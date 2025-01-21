import request from "supertest";
import { app, server } from "../../index";
import { createBetCsv } from "../../utils/betCsvGenerator";
import { placeBet } from "../../services/xpressbetService";

jest.mock("../../utils/betCsvGenerator");
jest.mock("../../services/xpressbetService");

describe("Bet Routes", () => {
  const mockBets = {
    bets: [
      { trackCode: "ABC", raceNumber: 1, horseNumber: 5, betAmount: 100, type: "WIN" },
    ],
    betType: "bBet",
  };

	afterAll(() => {
    server.close(); // Ensure the server is closed after all tests
  });

  it("should return 200 for valid bet submission", async () => {
    (createBetCsv as jest.Mock).mockReturnValue("./bets-bBet-12345.xlsx");
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
      .send({ bets: [], betType: "" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});