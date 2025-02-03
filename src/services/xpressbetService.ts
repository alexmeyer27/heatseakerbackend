import axios from "axios";
import * as cheerio from "cheerio"
import * as fs from "fs";
import FormData from "form-data";
import logger from "../config/logger";

/**
 * Handles the submission of the Excel file to the Xpressbet API.
 */
export const submitBet = async (filePath: string): Promise<any> => {
  let response;

  try {
    if (!fs.existsSync(filePath)) {
      logger.error(`File not found: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    }

    logger.info(`Found file, preparing for submission: ${filePath}`);

    // Read file as a full buffer instead of a stream
    const fileBuffer = fs.readFileSync(filePath);

    // Create form data with proper encoding
    const formData = new FormData();
    formData.append("proc", "wagr");
    formData.append("wagr", fileBuffer, { filename: "betfile.csv", contentType: "text/csv" });

    logger.info("Submitting bet file to Xpressbet API...");

    response = await axios.post(
      "https://dfu.xb-online.com/wagerupload/betupload.aspx",
      formData,
      {
        headers: {
          ...formData.getHeaders(),  // Ensures proper multipart encoding
        },
        responseType: "text",
      }
    );

    logger.info(`Xpressbet API response received: ${response.status}`);

    // Extract error message if the response contains HTML
    if (response.data.includes("<html")) {
      const $ = cheerio.load(response.data);

      // Find the div that contains wager errors specifically
      const errorMessages: string[] = [];
      $("#inva div").each((_, element) => {
        const text = $(element).text().trim();
        if (text.length > 0) {
          errorMessages.push(text);
        }
      });

      if (errorMessages.length > 0) {
        logger.error(`Xpressbet Validation Errors:\n${errorMessages.join("\n")}`);
      } else {
        logger.info("No validation errors found in the response.");
      }
    }

    return response.data;

  } catch (error: any) {
    logger.error(`Error uploading file: ${error.message}`, {
      filePath,
      response: error.response?.data || "No response received",
    });
    throw new Error(`Bet submission failed: ${error.response?.data || error.message}`);

  }
  finally {
    // Ensure response exists before deleting the file
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
  return `${track}-${betType}-Bet-Race-${raceNumber}-${formattedDate}.csv`;
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