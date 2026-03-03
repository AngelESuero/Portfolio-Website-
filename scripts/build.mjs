import { spawnSync } from "node:child_process";

const nestedPagesBuildFlag = "CLOUDFLARE_PAGES_INNER_BUILD";
const forcePagesBuild = process.argv.includes("--pages");
const isCloudflarePages = Boolean(process.env.CF_PAGES) || forcePagesBuild;
const isNestedPagesBuild = process.env[nestedPagesBuildFlag] === "1";
const shouldUsePagesAdapter = isCloudflarePages && !isNestedPagesBuild;

const command = "npx";
const args = shouldUsePagesAdapter
  ? ["--yes", "@cloudflare/next-on-pages@1"]
  : ["--no-install", "next", "build"];

const result = spawnSync(command, args, {
  env: shouldUsePagesAdapter
    ? { ...process.env, [nestedPagesBuildFlag]: "1" }
    : process.env,
  shell: process.platform === "win32",
  stdio: "inherit"
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
