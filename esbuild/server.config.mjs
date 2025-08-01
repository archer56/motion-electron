import * as esbuild from 'esbuild';

import { isProduction } from './utils/is-production.mjs';
import { rebuildNotifyPlugin } from './utils/rebuild-notify-plugin.mjs';
import { startServerPlugin } from './utils/server-plugin.mjs';
import { copyFilesPlugin } from './utils/copy-files-plugin.mjs';
import { isWindows } from './utils/is-windows.mjs';
import Path from 'path';

const isProd = isProduction();
const isDev = !isProduction();

const ctx = await esbuild.context({
  platform: 'node',
  format: 'cjs',
  entryPoints: ['./src/electron/**/*.ts', './src/shared/**/*.ts'],
  outdir: './dist/electron',
  minify: isProd,
  sourcemap: isDev,
  plugins: [
    copyFilesPlugin(
      [
        isWindows()
          ? {
              from: './libvlc/plugins',
              to: './build/Release/plugins',
            }
          : null,
        {
          from: './assets',
          to: './dist/electron/assets',
        },
      ].filter((plugin) => plugin),
    ),
    ...(isDev ? [rebuildNotifyPlugin(), startServerPlugin()] : []),
  ],
  tsconfig: Path.resolve('./src/electron/tsconfig.json'),
});

if (isDev) {
  ctx.watch();
  console.log('Watching...');
} else {
  await ctx.rebuild();
  process.exit(0);
}
