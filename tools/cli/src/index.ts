#!/usr/bin/env node
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const command = args.join(" ").trim();

const helpText = `
TypeScript Academy CLI

Commands:
  ts-academy create app   Start the academy vertical slice in dev mode
  ts-academy dev          Start the academy vertical slice in dev mode
`;

if (!command || command === "--help" || command === "-h") {
  console.log(helpText.trim());
  process.exit(0);
}

if (command === "create app" || command === "dev") {
  console.log("Starting TypeScript Academy...");
  console.log("API: http://localhost:3000");
  console.log("Web: http://localhost:5173");

  const child = spawn(
    "pnpm",
    ["--parallel", "--filter", "@ts-academy/api", "--filter", "@ts-academy/web", "dev"],
    {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true
    }
  );

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });

  process.on("SIGINT", () => child.kill("SIGINT"));
  process.on("SIGTERM", () => child.kill("SIGTERM"));
} else {
  console.error(`Unknown command: ${command}`);
  console.log(helpText.trim());
  process.exit(1);
}
