module.exports = {
  apps: [{
    name: 'JudgeGPT Socket Singleton',
    script: 'server.js',
    instances: '1', // or a number to specify how many instances you want
    //exec_mode: 'cluster', // optional, only needed if 'instances' is more than 1
    watch: true, // optional, if you want PM2 to automatically restart your app when files change
    max_memory_restart: '20G', // optional, restart your app if it reaches 1GB memory
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
