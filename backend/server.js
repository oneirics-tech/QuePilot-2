// backend/server.js
const http = require('http');
const app = require('./src/app');
const sequelize = require('./src/config/database');
const initializeSocket = require('./src/config/socket');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = initializeSocket(server);

// Make io available to controllers
app.set('io', io);

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established');

    // Sync database
    await sequelize.sync({ alter: true });
    console.log('Database synced');

    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
