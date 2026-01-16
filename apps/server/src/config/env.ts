import "dotenv/config";

export const env = {
  NODE_ENV: process.env["NODE_ENV"] || "development",
  PORT: parseInt(process.env["PORT"] || "3001", 10),
  DATABASE_URL:
    process.env["DATABASE_URL"] || "postgresql://postgres:postgres@localhost:5432/peronio",
  CLIENT_URL: process.env["CLIENT_URL"] || "http://localhost:5173",
  RESEND_API_KEY: process.env["RESEND_API_KEY"] || "",
  SESSION_SECRET: process.env["SESSION_SECRET"] || "dev-secret-change-in-production",
} as const;

export function validateEnv() {
  if (env.NODE_ENV === "production") {
    if (!process.env["SESSION_SECRET"]) {
      throw new Error("SESSION_SECRET is required in production");
    }
    if (!process.env["RESEND_API_KEY"]) {
      console.warn("RESEND_API_KEY not set - email functionality will be disabled");
    }
  }
}
