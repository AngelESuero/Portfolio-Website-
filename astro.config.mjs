import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const MODULE_RUNNER_TIMEOUT_MS = 5 * 60 * 1000;

const extendModuleRunnerTimeout = () => ({
  name: 'extend-module-runner-timeout',
  configureServer(server) {
    for (const environment of [server.environments?.ssr, server.environments?.client]) {
      if (!environment || typeof environment !== 'object') continue;

      try {
        const runner = environment.runner;
        if (runner?.transport && typeof runner.transport === 'object') {
          runner.transport.timeout = MODULE_RUNNER_TIMEOUT_MS;
        }
      } catch {
        // If the runner is unavailable in this environment, keep going.
      }
    }
  }
});

export default defineConfig({
  site: 'https://portfolio-website-9c9.pages.dev/',
  integrations: [mdx(), react(), sitemap()],
  vite: {
    plugins: [extendModuleRunnerTimeout()]
  },
  output: 'static'
});
