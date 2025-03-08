import pino, { Logger } from "pino";
import pretty from "pino-pretty";

// Create a global logger instance
export const logger: Logger = pino(
  pretty({
    colorize: true,
  })
);
