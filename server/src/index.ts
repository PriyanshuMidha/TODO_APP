import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { app } from "./app";

const startServer = async () => {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`FocusDock server listening on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
