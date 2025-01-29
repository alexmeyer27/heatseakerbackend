import { Request, Response, NextFunction } from "express";
import config from "../config/config";

/**
	•	Middleware to validate API Key in request headers
*/
const apiKeyAuth = (req: Request, res: Response, next: NextFunction): any => {
	const providedApiKey: string | undefined = req.header(`x-api-key`);

	if (!providedApiKey) {
		return res.status(403).json({ error: `Forbidden: No API key provided` });
	}

	if (providedApiKey !== config.apiKey) {
		return res.status(403).json({ error: `Forbidden: Invalid API key` });
	}

	next();
};

export default apiKeyAuth;