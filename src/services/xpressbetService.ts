import axios from "axios";
import * as fs from "fs";
import FormData from "form-data";
import logger from "../config/logger";
import config from "../config/config";

/**
 * Handles the submission of the Excel file to the Xpressbet API.
 */
export const submitBet = async (filePath: string): Promise<any> => {
  try {
    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Create form data
    const formData = new FormData();
    formData.append("proc", "wagr");
    formData.append("wagr", fs.createReadStream(filePath));

    // Make the API request
    const response = await axios.post(config.xpressbetApiUrl, formData, {
      headers: formData.getHeaders(),
    });

    // Return the response if successful
    return response.data;
  } catch (error: any) {
    logger.error("Error uploading file:", error.message);
    throw new Error(`Bet submission failed: ${error.response?.data || error.message}`);
  } finally {
    // Delete the file after submission
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

/**
 * High-level function to represent the placement of a bet.
 */
export const placeBet = async (filePath: string): Promise<any> => {
  // Additional logic (e.g., logging, validation) can be added here later.
  return await submitBet(filePath);
};