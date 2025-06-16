import express from 'express';
import notesRoutes from './routes/notesRoutes.js'; 
import { connectDB } from './config/db.js';
import dotenv from 'dotenv'; 
import cors from 'cors';
import job from './cron.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

job.start(); 
connectDB();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(clerkMiddleware());

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

app.use('/api/notes', notesRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the NoteTaker API!');
});

// Inngest v3+ usage:
app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
