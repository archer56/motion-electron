/* eslint-disable @typescript-eslint/no-require-imports */
// In forge.config.js (more flexible for absolute paths)

const Path = require('path');
const fs = require('fs');

console.log('--- Loading forge.config.js ---');

module.exports = {
  packagerConfig: {
    icon: './assets/icons/icon',
    asar: false,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'electron_quick_start',
        setupIcon: './assets/icons/icon.ico',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  hooks: {
    async postPackage() {
      const outputDir = Path.join(__dirname, './out');
      const outputs = fs.readdirSync(outputDir);

      const windowsFolder = outputs.find((output) => output.includes('win32'));

      if (!windowsFolder) {
        console.log('Windows output not found, not copying libvlc plugins');
        return;
      }

      const outputBuildDir = Path.join(outputDir, windowsFolder, './resources/app/build/Release/plugins');
      const pluginsDir = Path.join(__dirname, './libvlc/plugins');

      function ensureDirSync(dir) {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      }

      function copyRecursiveSync(src, dest) {
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
          ensureDirSync(dest);
          const entries = fs.readdirSync(src);
          for (const entry of entries) {
            const srcPath = Path.join(src, entry);
            const destPath = Path.join(dest, entry);
            copyRecursiveSync(srcPath, destPath);
          }
        } else {
          fs.copyFileSync(src, dest);
        }
      }
      copyRecursiveSync(pluginsDir, outputBuildDir);
    },
  },
};
