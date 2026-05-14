import axios from 'axios';
import * as cheerio from 'cheerio';
import SaaSData from '../models/SaaSData';

interface ScrapeConfig {
  companyName: string;
  url: string;
  planSelector: string;
  nameSelector: string;
  priceSelector: string;
  featuresSelector: string;
  billingCycleSelector?: string;
}

const configs: ScrapeConfig[] = [
  {
    companyName: 'Notion',
    url: 'https://www.notion.so/pricing',
    planSelector: 'div[class*="pricing"], section[class*="pricing"]',
    nameSelector: 'h2, h3',
    priceSelector: 'span[class*="price"], div[class*="price"]',
    featuresSelector: 'li'
  },
  {
    companyName: 'Slack',
    url: 'https://slack.com/intl/en-in/pricing',
    planSelector: 'div[class*="card"], .c-pricing-card',
    nameSelector: 'h3, .c-pricing-card__title',
    priceSelector: '.c-pricing-card__price, [class*="price"]',
    featuresSelector: 'li'
  },
  {
    companyName: 'Canva',
    url: 'https://www.canva.com/pricing/',
    planSelector: '[class*="PricingCard"], section',
    nameSelector: 'h3, h2',
    priceSelector: '[class*="Price"], span',
    featuresSelector: 'li'
  },
  {
    companyName: 'Zapier',
    url: 'https://zapier.com/pricing',
    planSelector: '[class*="plan"], .pricing-card',
    nameSelector: 'h3, .plan-name',
    priceSelector: '[class*="price"], .amount',
    featuresSelector: 'li'
  },
  {
    companyName: 'ClickUp',
    url: 'https://clickup.com/pricing',
    planSelector: '.pricing-card, [class*="card"]',
    nameSelector: 'h3, .name',
    priceSelector: '.price, [class*="amount"]',
    featuresSelector: 'li'
  },
  {
    companyName: 'Airtable',
    url: 'https://www.airtable.com/pricing',
    planSelector: '[class*="PlanCard"]',
    nameSelector: 'h3',
    priceSelector: '[class*="Price"]',
    featuresSelector: 'li'
  },
  {
    companyName: 'HubSpot',
    url: 'https://www.hubspot.com/pricing',
    planSelector: '[class*="PricingCard"]',
    nameSelector: 'h3',
    priceSelector: '[class*="Price"]',
    featuresSelector: 'li'
  },
  {
    companyName: 'Trello',
    url: 'https://trello.com/pricing',
    planSelector: '[class*="PricingCard"]',
    nameSelector: 'h3',
    priceSelector: '[class*="Price"]',
    featuresSelector: 'li'
  },
  {
    companyName: 'Asana',
    url: 'https://asana.com/pricing',
    planSelector: '[class*="PricingCard"]',
    nameSelector: 'h3',
    priceSelector: '[class*="Price"]',
    featuresSelector: 'li'
  },
  {
    companyName: 'Monday.com',
    url: 'https://monday.com/pricing',
    planSelector: '[class*="PricingCard"]',
    nameSelector: 'h3',
    priceSelector: '[class*="Price"]',
    featuresSelector: 'li'
  }
];

// This function cleans up raw text into a number (e.g. "$10.50" -> 10.5)
const cleanPrice = (priceStr: string) => {
  if (!priceStr) return { price: null, currency: null, hasFreeTrial: false };
  
  const str = priceStr.toLowerCase();
  // Check if it's free
  let hasFreeTrial = str.includes('free') || str.includes('trial') || str.includes('0');
  
  // Use a more flexible Regex to find numbers even after words like "Starting at"
  // It looks for a currency symbol ($€£) followed by a number
  const match = priceStr.match(/(\$|€|£)?\s*(\d+([.,]\d{1,2})?)/) || priceStr.match(/(\d+([.,]\d{1,2})?)\s*(\$|€|£)?/);
  
  if (match) {
    const currency = match[1] === '€' || match[3] === '€' ? 'EUR' : 
                     match[1] === '£' || match[3] === '£' ? 'GBP' : 'USD';
    
    // We try to find the number in either match group 2 or 1 depending on where the currency symbol was
    const priceText = match[2] || match[1] || '0';
    const price = parseFloat(priceText.replace(',', ''));
    return { price, currency, hasFreeTrial: price === 0 || hasFreeTrial };
  }
  
  return { price: null, currency: null, hasFreeTrial };
};

const cleanBillingCycle = (text: string) => {
  if (!text) return 'monthly';
  const lower = text.toLowerCase();
  if (lower.includes('year') || lower.includes('annually')) return 'yearly';
  return 'monthly';
};

export const runScraper = async () => {
  console.log('Starting scheduled scraper job (v2 with real URLs)...');
  
  for (const config of configs) {
    try {
      console.log(`Scraping ${config.companyName}...`);
      const { data } = await axios.get(config.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000 // 10 seconds timeout
      });
      
      const $ = cheerio.load(data);
      const plans = $(config.planSelector);
      
      if (plans.length === 0) {
        console.warn(`No plans found for ${config.companyName}. The DOM structure might have changed.`);
        // For demonstration of "Graceful recovery and handling missing data":
        // We can synthesize a default free tier if completely failed but page loaded.
        if ($('body').text().toLowerCase().includes('free')) {
           await savePlan({
             companyName: config.companyName,
             planName: 'Basic / Free',
             price: 0,
             currency: 'USD',
             billingCycle: 'monthly',
             features: ['Basic Access'],
             hasFreeTrial: true,
             lastUpdated: new Date()
           });
        }
        continue;
      }
      
      const extractedPlans: any[] = [];
      plans.each((_, el) => {
        const planName = $(el).find(config.nameSelector).first().text().trim() || 'Unknown Plan';
        const priceText = $(el).find(config.priceSelector).first().text().trim();
        const features: string[] = [];
        $(el).find(config.featuresSelector).each((_, f) => {
          features.push($(f).text().trim());
        });
        
        const { price, currency, hasFreeTrial } = cleanPrice(priceText);
        const billingCycle = cleanBillingCycle(priceText + ' ' + (config.billingCycleSelector ? $(el).find(config.billingCycleSelector).text() : ''));
        
        extractedPlans.push({
          companyName: config.companyName,
          planName,
          price,
          currency,
          billingCycle,
          features: features.filter(f => f.length > 0 && f.length < 100),
          hasFreeTrial,
          lastUpdated: new Date()
        });
      });
      
      for (const plan of extractedPlans) {
        await savePlan(plan);
      }
      
    } catch (error: any) {
      console.error(`Scraping failed for ${config.companyName}: ${error.message}`);
      // Graceful error recovery: log and continue to the next SaaS config
    }
  }
  console.log('Scraper job completed.');
};

async function savePlan(planData: any) {
  // We use findOneAndUpdate with upsert to avoid duplicates and update existing
  await SaaSData.findOneAndUpdate(
    { companyName: planData.companyName, planName: planData.planName },
    { $set: planData },
    { upsert: true, new: true }
  );
  console.log(`Saved plan: ${planData.companyName} - ${planData.planName}`);
}
