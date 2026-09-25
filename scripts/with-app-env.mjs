#!/usr/bin/env node
/**
 * Minimal with-app-env: forwards argv to child process.
 * Full App Builder env injection is optional for production public desk.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("usage: with-app-env.mjs <cmd> [args...]");
  process.exit(1);
}

const child = spawn(args[0], args.slice(1), {
  stdio: "inherit",
  shell: false,
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || "production",
  },
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
