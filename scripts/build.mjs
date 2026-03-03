import { spawnSync } from "node:child_process";

const isCloudflarePages = Boolean(process.env.CF_PAGES);
const command = isCloudflarePages ? "npx" : "next";
const args = isCloudflarePages
  ? ["--yes", "@cloudflare/next-on-pages@1"]
  : ["build"];

const result = spawnSync(command, args, {
  env: process.env,
  shell: process.platform === "win32",
  stdio: "inherit"
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
