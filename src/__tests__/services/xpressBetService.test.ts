import axios from "axios";
import * as fs from "fs";
import { placeBet } from "../../services/xpressbetService";
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
  });

  it("should call the Xpressbet API with the correct file", async () => {
    const mockFormData = new FormData();
    mockFormData.append("file", fs.createReadStream(filePath));

    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    const result = await placeBet(filePath);

    // Validate axios.post call with FormData mock
    expect(axios.post).toHaveBeenCalledWith(
      "https://api.xpressbet.com/upload",
      expect.any(FormData), // Match any instance of FormData
      expect.objectContaining({
        headers: expect.any(Object),
      })
    );

    expect(result).toEqual({ success: true });
  });

  it("should delete the file after submission", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    await placeBet(filePath);

    // Ensure the file is deleted after the request
    expect(fs.existsSync(filePath)).toBe(false);
  });
});