import dotenv from 'dotenv';
import app from './app.js';
import sequelize, { connectDatabase } from './config/database.js';
import './models/index.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await sequelize.close();
  process.exit(0);
});

start();
