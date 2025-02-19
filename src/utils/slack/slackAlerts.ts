import axios from 'axios';

// Load environment variables
const SLACK_WEBHOOK_URL_ALERTS = process.env.SLACK_WEBHOOK_URL_ALERTS!;
const SLACK_WEBHOOK_URL_ERRORS = process.env.SLACK_WEBHOOK_URL_ERRORS!;

/**
 * Type definitions for Slack alert options.
 */
type SlackAlertOptions = {
	isError?: boolean;           // Choose between error or standard webhook
	threadTs?: string;           // Thread timestamp for replies
	notifyChannel?: boolean;     // Mention @channel
	mentionUser?: string;        // Mention specific user (e.g., "<@U12345>")
	formattedData?: Record<string, any>; // Optional structured data
	blocks?: any[];              // Slack Block Kit for advanced formatting (future scalability)
};

/**
 * Sends a Slack alert with core functionality and future scalability.
 * @param message The main text message.
 * @param options Additional customization options.
 * @returns The thread timestamp if the message starts a new thread.
 */
export async function sendSlackAlert(
	message: string,
	options: SlackAlertOptions = {}
): Promise<string | undefined> {
	const {
		isError = false,
		threadTs,
		notifyChannel = false,
		mentionUser,
		formattedData,
		blocks
	} = options;

	// Choose webhook based on error or alert
	const webhookUrl = isError ? SLACK_WEBHOOK_URL_ERRORS : SLACK_WEBHOOK_URL_ALERTS;

	// Construct the main message with mentions
	let finalMessage = message;
	if (isError) finalMessage = `@channel ${finalMessage}`;
	else if (notifyChannel) finalMessage = `@channel ${finalMessage}`;
	if (mentionUser) finalMessage = `${mentionUser} ${finalMessage}`;

	// Construct payload
	const payload: any = {
		text: finalMessage,
		...(threadTs && { thread_ts: threadTs }), // Only include thread_ts if replying
		...(blocks ? { blocks } : formattedData ? { blocks: formatSlackBlocks(finalMessage, formattedData) } : {})
	};

	try {
		const response = await axios.post(webhookUrl, payload);
		console.log(`✅ Slack alert sent successfully: ${response.status}`);
		return response.data.ts; // Return thread timestamp if starting a new thread
	} catch (error: any) {
		console.error(`❗ Error sending Slack alert: ${error.message}`);
		return "Error sending Slack alert";
	}
}