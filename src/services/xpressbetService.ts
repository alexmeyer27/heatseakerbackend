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
    const response = await axios.post('https://dfu.xb-online.com/wagerupload/betupload.aspx', formData, {
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
      logger.info(`File deleted: ${filePath}`);
    }
  }
};

/**
 * Generate a unique file name based on date, track, bet type, and race number.
 */
export const generateFileName = (track: string, betType: string, raceNumber: number): string => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  return `${track}-${betType}-Bet-Race-${raceNumber}-${formattedDate}.xlsx`;
};

/**
 * High-level function to represent the placement of a bet.
 */
export const placeBet = async (track: string, betType: string, raceNumber: number, filePath: string): Promise<any> => {
  const fileName = generateFileName(track, betType, raceNumber);
  logger.info(`Generated file name: ${fileName}`);
  return await submitBet(filePath);
};