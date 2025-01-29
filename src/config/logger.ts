import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // ✅ Send logs to stdout (for Docker)
    new winston.transports.File({ filename: "logs/error.log", level: "error" }) // ✅ Save errors to a file
  ],
});

export default logger;