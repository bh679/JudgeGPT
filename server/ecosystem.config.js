module.exports = {
  apps: [{
    name: 'JudgeGPT Socket Singleton',
    script: 'server.js',
    instances: '1', // This ensures only one instance of the app runs
    // exec_mode: 'cluster', // Not necessary since 'instances' is set to 1
    watch: ['*.js', '*.json', '!*.sqlite3-journal'], // Restart app when these files change, but ignore SQLite journal files
    max_memory_restart: '1G', // Restart your app if it reaches 1GB memory
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
