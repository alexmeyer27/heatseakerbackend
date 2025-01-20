import * as fs from "fs";
import FormData from "form-data";
import axios from "axios";

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
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  } finally {
    // Ensure the file is deleted in all cases
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};