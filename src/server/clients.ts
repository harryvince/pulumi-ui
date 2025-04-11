import { createLogger, format, transports } from "winston";

export const logger = createLogger({
	format: format.combine(
		format.timestamp(),
		format.errors({ stack: true }),
		format.json(),
	),
	transports: [new transports.Console()],
});
