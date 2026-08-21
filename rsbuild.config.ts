import process from 'node:process';
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
      'import.meta.COMMIT_HASH': JSON.stringify(process.env.COMMIT_HASH),
    },
  },
  plugins: [pluginTypeCheck(), pluginPreact()],
});
