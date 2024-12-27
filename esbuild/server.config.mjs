import * as esbuild from 'esbuild';

import { isProduction } from './utils/is-production.mjs';
import { rebuildNotifyPlugin } from './utils/rebuild-notify-plugin.mjs';
import { startServerPlugin } from './utils/server-plugin.mjs';
import Path from 'path';

const ctx = await esbuild.context({
  platform: 'node',
  format: 'cjs',
  entryPoints: ['./src/electron/**/*.ts'],
  outdir:'./dist/electron',
  minify: isProduction(),
  sourcemap: !isProduction(),
  plugins: [rebuildNotifyPlugin(), startServerPlugin()],
  tsconfig: Path.resolve('./src/electron/tsconfig.json')
});

ctx.watch();

console.log('Watching...');
