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

// Middleware to parse JSON bodies
app.use(express.json());

// CORS setup - make sure to adjust origin for your frontend URL
app.use(cors({
  origin: 'http://localhost:5173', // no trailing slash
}));

// Clerk middleware for authentication
app.use(clerkMiddleware());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

// Notes routes
app.use('/api/notes', notesRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the NoteTaker API!');
});

// Inngest routes - FIXED usage of serve middleware
app.use("/api/inngest", serve(inngest, { functions }));

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
