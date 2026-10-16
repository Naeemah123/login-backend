import mongoose from 'mongoose';
import type { Express } from 'express';
import { config } from '../config/index.js';

export const startServer = async (app: Express) => {
  try {
    await mongoose.connect(config.database.url);
    console.log(`MongoDB connected [env=${config.env}]`);

    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};
