import express from 'express';
import notesRoutes from './routes/notesRoutes.js'; // ✅ CORRECT import path
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import cors from 'cors';
import job from './cron.js';

const app = express();
const PORT = process.env.PORT || 5001;

job.start(); // Start the cron job to run every minute

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Remove trailing slash for correct matching
}));

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

connectDB(); // Connect to the database

// Route middleware
app.use('/api/notes', notesRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the NoteTaker API!');
});

// Listen on localhost:5001
app.listen(PORT, 'localhost', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
