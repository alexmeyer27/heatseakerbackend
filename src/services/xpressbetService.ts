import axios from "axios";
import * as fs from "fs";
import FormData from "form-data";
import logger from "../config/logger";

/**
 * Handles the submission of the Excel file to the Xpressbet API.
 */
export const submitBet = async (filePath: string): Promise<any> => {
  try {
    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
      logger.error(`File not found: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    }
    logger.info(`Found file, preparing for submission: ${filePath}`);

    // Create form data
    const formData = new FormData();
    formData.append("proc", "wagr");
    formData.append("wagr", fs.createReadStream(filePath));

    logger.info("Submitting bet file to Xpressbet API...");

    // Make the API request
    const response = await axios.post(
      "https://dfu.xb-online.com/wagerupload/betupload.aspx",
      formData,
      { headers: formData.getHeaders() }
    );

    logger.info(`Xpressbet API response received`, { status: response.status, data: response.data });

    // Return the response if successful
    return response.data;
  } catch (error: any) {
    logger.error(`Error uploading file: ${error.message}`, {
      filePath,
      response: error.response?.data,
    });
    throw new Error(`Bet submission failed: ${error.response?.data || error.message}`);
  } finally {
    // Delete the file after submission
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`File deleted after submission: ${filePath}`);
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
  logger.info(`Generated file name: ${fileName} for track ${track}, race ${raceNumber}, bet type ${betType}`);

  try {
    const response = await submitBet(filePath);
    logger.info(`Bet successfully placed: ${fileName}`);
    return response;
  } catch (error: any) {
    logger.error(`Error placing bet: ${error.message}`);
    throw error;
  }
};