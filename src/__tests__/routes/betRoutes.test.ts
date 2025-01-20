import request from "supertest";
import app from "../../index"; // Assuming you export `app` in `index.ts`

describe("Bet Routes", () => {
  it("should return 200 for valid bet submission", async () => {
    const response = await request(app)
      .post("/api/submit-bets")
      .send([
        { trackCode: "ABC", raceNumber: 1, horseNumber: 5, betAmount: 100, type: "Win" },
      ]);

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