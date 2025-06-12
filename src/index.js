import express from 'express';
import notesRoutes from './routes/notesRoutes.js'; // ✅ CORRECT import path
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import cors from 'cors';
import job from './cron.js'

// console.log(process.env.MONGO_URI); // Log the MongoDB URI to verify it's being read correctly

const app = express();

job.start() // Start the cron job to run every minute




const port = process.env.PORT || 5001; // Use environment variable for port or default to 5001

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
  origin: 'https://think-vault-eight.vercel.app/'}, // Allow requests from your frontend app's

))


app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next(); // Call the next middleware or route handler


})


connectDB(); // Connect to the database

// Route middleware
app.use('/api/notes', notesRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the NoteTaker API!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



// mongodb+srv://megagravity26:fstRyJJAWwDFTUZ9@cluster0.xqfke3q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0