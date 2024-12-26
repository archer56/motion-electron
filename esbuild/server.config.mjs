import * as esbuild from 'esbuild';

import { isProduction } from './utils/is-production.mjs';
import { rebuildNotifyPlugin } from './utils/rebuild-notify-plugin.mjs';
import { startServerPlugin } from './utils/server-plugin.mjs';
import Path from 'path';

const ctx = await esbuild.context({
  platform: 'node',
  entryPoints: ['./src/electron/main.ts'],
  bundle: true,
  outfile: './dist/electron/main.js',
  minify: isProduction(),
  sourcemap: !isProduction(),
  plugins: [rebuildNotifyPlugin(), startServerPlugin()],
  tsconfig: Path.resolve('./src/electron/tsconfig.json')
});

ctx.watch();

console.log('Watching...');
