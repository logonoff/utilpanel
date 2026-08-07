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
  plugins: [pluginTypeCheck(), pluginPreact()],
});
