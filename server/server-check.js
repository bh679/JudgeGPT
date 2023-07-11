const { exec } = require('child_process');

const checkServer = () => {
  const command = 'pgrep -f "node server.js"';
  exec(command, (error, stdout) => {
    if (error) {
      console.error(`Error checking server process: ${error.message}`);
      return;
    }

    if (stdout.trim() === '') {
      console.log('Server is not running. Restarting...');
      startServer();
    } else {
      console.log('Server is running.');
    }
  });
};

const startServer = () => {
  const command = 'node server.js';
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting server: ${error.message}`);
      return;
    }

    console.log(`Server started. PID: ${stdout}`);
  });
};

// Check server status on script start
checkServer();

// Check server status every X seconds (e.g., every 5 seconds)
const interval = 5000;
setInterval(checkServer, interval);
