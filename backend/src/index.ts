import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { runScraper } from './services/scraper';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saas-pricing-intel';

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for the assignment to avoid CORS issues
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('✅ Backend is LIVE!'));
app.use('/api', apiRoutes);

// 1. DATABASE CONNECTION
// We connect to MongoDB. If it fails, we log the error clearly.
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Success: Connected to MongoDB');
    
    // 2. START THE SERVER
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
    
    // 3. AUTOMATION (CRON JOB)
    // This tells the computer to run our scraper automatically every day at midnight.
    cron.schedule('0 0 * * *', () => {
      console.log('⏰ Time to update! Running the automated scraper...');
      runScraper();
    });
  })
  .catch((error) => {
    console.error('❌ Error: Could not connect to MongoDB. Make sure it is running!', error);
  });

export default app;
