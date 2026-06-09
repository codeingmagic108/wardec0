import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import dataRouter from './router/data.js';
import { initDatabase, sequelize } from './models/data.js';

dotenv.config();

const app = express();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await initDatabase();
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('PostgreSQL connected and schema synced successfully.');

    app.use('/api/datapath', dataRouter);

    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    console.log('Retrying database connection in 5 seconds...');
    setTimeout(startServer, 5000);
  }
};

startServer();
