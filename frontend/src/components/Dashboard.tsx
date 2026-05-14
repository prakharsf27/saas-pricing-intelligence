import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Cpu, Zap } from 'lucide-react';
import Navbar from './Navbar';
import AnalyticsCards from './AnalyticsCards';
import PricingTable from './PricingTable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard: React.FC = () => {
  const [data, setData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [billingFilter, setBillingFilter] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pricingRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/pricing`, {
          params: {
            company: searchTerm,
            model: billingFilter || undefined
          }
        }),
        axios.get(`${API_URL}/analytics`)
      ]);
      setData(pricingRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, billingFilter]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Market Overview</h1>
            <p className="mt-1 text-sm text-gray-500">Monitor competitor pricing strategies and changes.</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg border border-indigo-100 shadow-sm">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold">AI Insights Active</span>
          </div>
        </div>

        <AnalyticsCards analytics={analytics} />

        {analytics?.insights && analytics.insights.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-20">
              <Cpu className="h-32 w-32" />
            </div>
            <h2 className="text-xl font-bold flex items-center mb-4">
              <Cpu className="h-5 w-5 mr-2" />
              AI Pricing Analysis
            </h2>
            <ul className="space-y-2 relative z-10">
              {analytics.insights.map((insight: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-indigo-200">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <h2 className="text-lg font-semibold text-gray-900">Detailed Pricing Data</h2>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white"
                  value={billingFilter}
                  onChange={(e) => setBillingFilter(e.target.value)}
                >
                  <option value="">All Billing Cycles</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <PricingTable data={data} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
