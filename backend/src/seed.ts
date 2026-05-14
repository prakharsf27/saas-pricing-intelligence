import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SaaSData from './models/SaaSData';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saas-pricing-intel';

const seedData = [
  {
    companyName: 'Notion',
    planName: 'Free',
    price: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    features: ['Collaborative workspace', 'Integrate with Slack, GitHub', 'Basic page analytics', '7-day page history'],
    hasFreeTrial: true,
  },
  {
    companyName: 'Notion',
    planName: 'Plus',
    price: 8,
    currency: 'USD',
    billingCycle: 'monthly',
    features: ['Unlimited blocks for teams', 'Unlimited file uploads', '30-day page history', 'Invite 100 guests'],
    hasFreeTrial: false,
  },
  {
    companyName: 'Slack',
    planName: 'Pro',
    price: 7.25,
    currency: 'USD',
    billingCycle: 'monthly',
    features: ['Unlimited message history', 'Unlimited integrations', 'Huddles with up to 50 people'],
    hasFreeTrial: true,
  },
  {
    companyName: 'Canva',
    planName: 'Pro',
    price: 14.99,
    currency: 'USD',
    billingCycle: 'monthly',
    features: ['Premium templates', 'Brand Kit', 'Background Remover', 'Magic Resize'],
    hasFreeTrial: true,
  },
  {
    companyName: 'Zapier',
    planName: 'Starter',
    price: 19.99,
    currency: 'USD',
    billingCycle: 'monthly',
    features: ['750 tasks/mo', 'Multi-step Zaps', '3 Premium Apps', 'Filters and Formatters'],
    hasFreeTrial: true,
  },
  {
    companyName: 'Linear',
    planName: 'Standard (Annual)',
    price: 96,
    currency: 'USD',
    billingCycle: 'yearly',
    features: ['Unlimited issues', 'Unlimited file uploads', 'Advanced roadmaps'],
    hasFreeTrial: false,
  },
  {
    companyName: 'Notion',
    planName: 'Plus (Annual)',
    price: 96,
    currency: 'USD',
    billingCycle: 'yearly',
    features: ['Unlimited blocks', '30-day page history', '100 guests'],
    hasFreeTrial: false,
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding');
    await SaaSData.deleteMany({});
    console.log('Cleared existing data');
    
    for (const data of seedData) {
      await SaaSData.create(data);
    }
    
    console.log('Database seeded successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding error:', error);
    process.exit(1);
  });
