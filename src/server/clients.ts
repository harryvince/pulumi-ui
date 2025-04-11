import { createLogger, format, transports } from "winston";
import { S3Helper } from "./s3";

export const logger = createLogger({
	format: format.combine(
		format.timestamp(),
		format.errors({ stack: true }),
		format.json(),
	),
	transports: [new transports.Console()],
});

export const s3 = new S3Helper(
	process.env.BUCKET as string,
	process.env.DIRECTORY,
);
