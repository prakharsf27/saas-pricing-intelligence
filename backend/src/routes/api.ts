import { Router } from 'express';
import SaaSData from '../models/SaaSData';
import { runScraper } from '../services/scraper';

const router = Router();

// Get all pricing data with optional filters
router.get('/pricing', async (req, res) => {
  try {
    const { company, model } = req.query;
    let filter: any = {};
    
    if (company) {
      filter.companyName = { $regex: new RegExp(company as string, 'i') };
    }
    
    if (model) {
       filter.billingCycle = model;
    }

    const data = await SaaSData.find(filter).sort({ companyName: 1, price: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching pricing data' });
  }
});

// Get analytics/insights
router.get('/analytics', async (req, res) => {
  try {
    const allData = await SaaSData.find({});
    
    // Calculate simple insights
    const totalCompanies = new Set(allData.map(d => d.companyName)).size;
    const averagePrice = allData.reduce((acc, curr) => acc + (curr.price || 0), 0) / (allData.length || 1);
    const mostExpensive = allData.sort((a, b) => (b.price || 0) - (a.price || 0))[0];
    const cheapestPaid = allData.filter(d => (d.price || 0) > 0).sort((a, b) => (a.price || 0) - (b.price || 0))[0];
    
    const freeTrialCount = allData.filter(d => d.hasFreeTrial).length;

    res.json({
      totalCompanies,
      totalPlans: allData.length,
      averagePrice: averagePrice.toFixed(2),
      mostExpensive,
      cheapestPaid,
      freeTrialPercentage: totalCompanies > 0 ? ((freeTrialCount / allData.length) * 100).toFixed(1) : 0,
      insights: [
        `Analyzed ${totalCompanies} companies offering ${allData.length} distinct plans.`,
        `The average market price across tracked plans is $${averagePrice.toFixed(2)}.`,
        mostExpensive ? `The highest tier tracked is ${mostExpensive.companyName}'s ${mostExpensive.planName} at $${mostExpensive.price}.` : '',
        cheapestPaid ? `The most affordable paid entry point is ${cheapestPaid.companyName}'s ${cheapestPaid.planName} at $${cheapestPaid.price}.` : '',
        `Approximately ${((freeTrialCount / (allData.length || 1)) * 100).toFixed(0)}% of plans include a free trial or free tier.`
      ].filter(Boolean)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error generating analytics' });
  }
});

// Trigger a manual scrape via URL
router.get('/scrape-now', async (req, res) => {
  try {
    runScraper(); // Run in background
    res.json({ message: 'Scraper started! Refresh the dashboard in a few seconds.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start scraper' });
  }
});

export default router;
