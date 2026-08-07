import { defineConfig } from '@rsbuild/core';
import { pluginPreact } from '@rsbuild/plugin-preact';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  html: {
    template: 'public/index.html',
  },
  output: {
    assetPrefix: 'auto',
  },
  source: {
    define: {
      // @ts-expect-error - i dont wanna update @types/node every 2 seconds
      'process.env.COMMIT_HASH': JSON.stringify(process.env.COMMIT_HASH),
    },
  },
  plugins: [pluginTypeCheck(), pluginPreact()],
});
