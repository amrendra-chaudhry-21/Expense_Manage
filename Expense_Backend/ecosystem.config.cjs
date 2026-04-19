module.exports = {
  apps: [
    {
      name: "jinvani-ott-backend",
      script: "./src/index.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_staging: {
        NODE_ENV: "staging",
      },
      env_production: {
        NODE_ENV: "production",
      },
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      time: true,
    },
  ],
};
