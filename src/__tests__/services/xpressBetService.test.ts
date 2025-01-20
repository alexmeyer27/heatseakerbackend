import { placeBet } from "../../services/xpressbetService";
import axios from "axios";
import * as fs from "fs";

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
  });

  it("should call the Xpressbet API with the correct file", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    const result = await placeBet(filePath);
    expect(axios.post).toHaveBeenCalledWith(
      "https://api.xpressbet.com/upload",
      expect.any(FormData),
      expect.objectContaining({
        headers: expect.any(Object),
      })
    );

    expect(result).toEqual({ success: true });
  });

  it("should delete the file after submission", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    await placeBet(filePath);
    expect(fs.existsSync(filePath)).toBe(false);
  });
});