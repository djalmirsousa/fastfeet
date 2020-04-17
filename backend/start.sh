yarn sequelize db:migrate
pm2-runtime dist/server.js
pm2-runtime dist/queue.js
