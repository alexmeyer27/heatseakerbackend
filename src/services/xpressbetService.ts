import axios from "axios";
import * as fs from "fs";

export const placeBet = async (filePath: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
      "https://api.xpressbet.com/upload", // Example endpoint
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.XPRESSBET_API_KEY}`,
        },
      }
    );

    return response.data;
  } finally {
    fs.unlinkSync(filePath); // Clean up the file
  }
};