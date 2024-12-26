import { spawn } from 'child_process';

let serverProcess = null;

const stopServer = () => {
  if (serverProcess) serverProcess.kill();
};

const startServer = () => {
  stopServer();

  serverProcess = spawn('electron', ['.'], { stdio: 'inherit' });

  serverProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Server process exited with code ${code}`);
    }
  });
};

export const startServerPlugin = () => ({
  name: 'start-server',
  setup(build) {
    build.onEnd((result) => {
      stopServer();

      if (result.errors.length === 0) {
        startServer();
      }
    });
  },
});
