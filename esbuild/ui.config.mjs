import * as esbuild from 'esbuild';

import { copyFilesPlugin } from './utils/copy-files-plugin.mjs';
import { isProduction } from './utils/is-production.mjs';
import { rebuildNotifyPlugin } from './utils/rebuild-notify-plugin.mjs';
import { lessLoader } from 'esbuild-plugin-less';

const isProd = isProduction();
const isDev = !isProduction();

const ctx = await esbuild.context({
  platform: 'browser',
  entryPoints: ['./src/ui/index.tsx'],
  bundle: true,
  outdir: './dist/ui',
  minify: isProd,
  sourcemap: isDev,
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
    lessLoader(),
    ...(isDev ? [rebuildNotifyPlugin()] : []),
  ],
});

if (isDev) {
  ctx.watch();
  console.log('Watching...');
} else {
  await ctx.rebuild();
  process.exit(0);
}
