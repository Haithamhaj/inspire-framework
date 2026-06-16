import app from "./app";
import { logger } from "./lib/logger";
import { processRetryQueue } from "./lib/ai-engine";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const host =
  process.env["HOST"] ??
  (process.env["NODE_ENV"] === "production" ? "0.0.0.0" : "127.0.0.1");

app.listen(port, host, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port, host }, "Server listening");

  // Internal retry scheduler: runs every 5 minutes to re-trigger pending_retry assessments
  const RETRY_INTERVAL_MS = 5 * 60 * 1000;
  setInterval(async () => {
    try {
      await processRetryQueue();
    } catch (schedErr) {
      logger.error({ err: schedErr }, "Retry scheduler encountered an error");
    }
  }, RETRY_INTERVAL_MS);

  logger.info({ intervalMs: RETRY_INTERVAL_MS }, "Retry scheduler started");
});
