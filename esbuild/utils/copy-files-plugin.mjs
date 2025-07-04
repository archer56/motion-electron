import fs from 'fs';
import Path from 'path';

const copy = (from, to) => {
  try {
    const stats = fs.statSync(from);

    // Ensure destination directory exists
    const destinationPath = Path.dirname(to);
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    if (stats.isDirectory()) {
      fs.cpSync(from, to, { recursive: true });
      console.log(`Directory ${from} copied to ${to}`);
    } else {
      fs.copyFileSync(from, to);
      console.log(`File ${from} copied to ${to}`);
    }
  } catch (err) {
    console.error(`Error copying ${from}:`, err);
  }
};

const copyFiles = (files) => {
  files?.forEach((file) => {
    const from = Path.resolve(file.from);
    const to = Path.resolve(file.to);

    if (!fs.existsSync(from)) {
      console.log(`Source path ${from} does not exist`);
      return;
    }

    copy(from, to);
  });
};

export const copyFilesPlugin = (files) => ({
  name: 'copy-files-plugin',
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length > 0) return;
      copyFiles(files);
    });
  },
});
