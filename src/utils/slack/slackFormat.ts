/**
 * Formats structured data into Slack message blocks.
 * Designed for scalability: easy to add new block types in the future.
 * 
 * @param message Main text message.
 * @param data Structured data object.
 * @returns Array of Slack Block Kit objects.
 */
function formatSlackBlocks(message: string, data: Record<string, any>): any[] {
	// Format key-value pairs into Markdown
	const formattedData = Object.entries(data)
		.map(([key, value]) => `*${key}:* ${value}`)
		.join('\n');

	// Core block layout with room for expansion
	return [
		{ type: 'section', text: { type: 'mrkdwn', text: message } },
		{ type: 'section', text: { type: 'mrkdwn', text: `\`\`\`${formattedData}\`\`\`` } }
	];
}