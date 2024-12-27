import * as esbuild from 'esbuild';

import { copyFilesPlugin } from './utils/copy-files-plugin.mjs';
import { isProduction } from './utils/is-production.mjs';
import { rebuildNotifyPlugin } from './utils/rebuild-notify-plugin.mjs';

const ctx = await esbuild.context({
  platform: 'browser',
  entryPoints: ['./src/ui/index.tsx'],
  bundle: true,
  outdir: './dist/ui',
  minify: isProduction(),
  sourcemap: !isProduction(),
  plugins: [
    copyFilesPlugin([
      {
        from: './manifest.json',
        to: './dist/ui/manifest.json',
      },
      {
        from: './icons/icon-192x192.png',
        to: './dist/ui/icons/icon-192x192.png',
      },
      {
        from: './icons/icon-512x512.png',
        to: './dist/ui/icons/icon-512x512.png',
      },
    ]),
    rebuildNotifyPlugin(),
  ],
});

ctx.watch();

console.log('Watching...');
