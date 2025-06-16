import express from 'express';
import notesRoutes from './routes/notesRoutes.js'; 
import { connectDB } from './config/db.js';
import dotenv from 'dotenv'; 
import cors from 'cors';
import job from './cron.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();
const PORT = process.env.PORT || 5001;

dotenv.config();
job.start(); 
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Remove trailing slash for correct matching
}));

app.use(clerkMiddleware())

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

// Route middleware
app.use('/api/notes', notesRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the NoteTaker API!');
});

app.use("/api/inngest", serve({ client: inngest, functions }));

// Listen on localhost:5001
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
