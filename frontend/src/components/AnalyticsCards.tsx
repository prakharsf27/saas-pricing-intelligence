import React from 'react';
import { Building2, Layers, DollarSign, CheckCircle } from 'lucide-react';

interface AnalyticsCardsProps {
  analytics: {
    totalCompanies: number;
    totalPlans: number;
    averagePrice: string;
    freeTrialPercentage: string;
  } | null;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ analytics }) => {
  if (!analytics) return null;

  const cards = [
    { name: 'Tracked Companies', value: analytics.totalCompanies, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Pricing Plans', value: analytics.totalPlans, icon: Layers, color: 'text-purple-500', bg: 'bg-purple-100' },
    { name: 'Avg. Market Price', value: `$${analytics.averagePrice}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100' },
    { name: 'Free Trial Offering', value: `${analytics.freeTrialPercentage}%`, icon: CheckCircle, color: 'text-orange-500', bg: 'bg-orange-100' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card) => (
        <div key={card.name} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                  <dd>
                    <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
