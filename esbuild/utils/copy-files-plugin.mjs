import fs from 'fs';
import Path from 'path';

const copyFiles = (files) => {
  files?.forEach((file) => {
    const from = Path.resolve(file.from);
    const to = Path.resolve(file.to);
    const destinationPath = Path.dirname(to);

    try {
      if (!fs.existsSync(from)) {
        console.log(`File path ${from} does not exist`);
        return;
      }

      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      fs.copyFileSync(from, to);
      console.log(`${from} copied successfully!`);
    } catch (err) {
      console.error(`Error copying ${from}:`, err);
    }
  });
};

export const copyFilesPlugin = (files) => ({
  name: 'copy-files-plugin',
  setup(build) {
    build.onEnd((result) => {
      const numberOfErrors = result.errors.length;
      if (numberOfErrors > 0) {
        return;
      }

      copyFiles(files);
    });
  },
});
