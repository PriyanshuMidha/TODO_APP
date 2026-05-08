import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  mongodbUri: process.env.MONGODB_URI as string,
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  clientUrls: (process.env.CLIENT_URLS ?? process.env.CLIENT_URL ?? "http://localhost:5173")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
};
