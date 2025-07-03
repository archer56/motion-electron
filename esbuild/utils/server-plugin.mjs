import { spawn } from 'child_process';
import kill from 'tree-kill';

let serverProcess = null;

const stopServer = () => {
  if (!serverProcess) {
    return;
  }

  kill(serverProcess.pid, 'SIGTERM', (err) => {
    if (err) {
      console.error('Failed to kill process:', err);
    }
  });
};

const startServer = () => {
  stopServer();

  const isWindows = process.platform === 'win32';

  if (isWindows) {
    serverProcess = spawn('cmd.exe', ['/c', 'npx electron .'], {
      stdio: 'inherit',
      shell: true,
    });
  } else {
    serverProcess = spawn('npx', ['electron', '.'], { stdio: 'inherit', shell: true });
  }
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
