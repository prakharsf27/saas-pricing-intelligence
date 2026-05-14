import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { runScraper } from './services/scraper';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saas-pricing-intel';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for manual scraping...');
    await runScraper();
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });
