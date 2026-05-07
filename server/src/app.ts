import cors from "cors";
import express from "express";
import { env } from "./config/env";
import settingsRoutes from "./routes/settingsRoutes";
import taskRoutes from "./routes/taskRoutes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tasks", taskRoutes);
app.use("/api/settings", settingsRoutes);

app.use(errorHandler);
