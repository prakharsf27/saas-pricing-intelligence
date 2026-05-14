import React from 'react';
import { Check, X } from 'lucide-react';

interface Plan {
  _id: string;
  companyName: string;
  planName: string;
  price: number | null;
  currency: string | null;
  billingCycle: string | null;
  features: string[];
  hasFreeTrial: boolean;
  lastUpdated: string;
}

interface PricingTableProps {
  data: Plan[];
}

const PricingTable: React.FC<PricingTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto shadow-sm ring-1 ring-black ring-opacity-5 rounded-xl">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Company
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Plan
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Price
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Billing
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Free Trial
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Top Features
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((plan) => (
            <tr key={plan._id} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {plan.companyName}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {plan.planName}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-900">
                {plan.price !== null ? (
                  plan.price === 0 ? 'Free' : `${plan.currency === 'USD' ? '$' : plan.currency === 'EUR' ? '€' : plan.currency === 'GBP' ? '£' : ''}${plan.price}`
                ) : (
                  'Custom'
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                {plan.billingCycle || 'N/A'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {plan.hasFreeTrial ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                <ul className="list-disc list-inside space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="leading-relaxed">
                      {feature}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                No pricing data available. Try adjusting filters or ensure the scraper has run.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
