import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import loginRouter from './routes/authRoutes.js'
import protectedRouter from './routes/protectedRoutes.js';
const app=express()
const port = 3000;

app.use(cors());
app.use(express.json());

const url = process.env.MONGODB_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(url, {
           
        });
        console.log('Database is connected');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
};

const startServer = async () => {
  await connectDB();
  
  app.use('/api', loginRouter);
  app.use('/api', protectedRouter);

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

startServer();