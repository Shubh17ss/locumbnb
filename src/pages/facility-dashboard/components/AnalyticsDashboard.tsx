import React, { useState } from 'react';

interface MarketBenchmark {
  specialty: string;
  yourAverage: number;
  marketAverage: number;
  difference: number;
  trend: 'above' | 'below' | 'equal';
}

interface FillRate {
  specialty: string;
  posted: number;
  filled: number;
  rate: number;
}

interface TimeToFill {
  specialty: string;
  avgDays: number;
  trend: 'improving' | 'declining' | 'stable';
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '12m'>('90d');

  const marketBenchmarks: MarketBenchmark[] = [
    { specialty: 'Emergency Medicine', yourAverage: 12000, marketAverage: 11500, difference: 4.3, trend: 'above' },
    { specialty: 'Cardiology', yourAverage: 8500, marketAverage: 9200, difference: -7.6, trend: 'below' },
    { specialty: 'Internal Medicine', yourAverage: 7200, marketAverage: 7200, difference: 0, trend: 'equal' },
    { specialty: 'Radiology', yourAverage: 10500, marketAverage: 10000, difference: 5.0, trend: 'above' },
    { specialty: 'Anesthesiology', yourAverage: 9800, marketAverage: 10500, difference: -6.7, trend: 'below' }
  ];

  const fillRates: FillRate[] = [
    { specialty: 'Emergency Medicine', posted: 12, filled: 11, rate: 91.7 },
    { specialty: 'Cardiology', posted: 8, filled: 6, rate: 75.0 },
    { specialty: 'Internal Medicine', posted: 15, filled: 14, rate: 93.3 },
    { specialty: 'Radiology', posted: 6, filled: 5, rate: 83.3 },
    { specialty: 'Anesthesiology', posted: 10, filled: 8, rate: 80.0 }
  ];

  const timeToFill: TimeToFill[] = [
    { specialty: 'Emergency Medicine', avgDays: 3.2, trend: 'improving' },
    { specialty: 'Cardiology', avgDays: 5.8, trend: 'declining' },
    { specialty: 'Internal Medicine', avgDays: 2.5, trend: 'improving' },
    { specialty: 'Radiology', avgDays: 4.1, trend: 'stable' },
    { specialty: 'Anesthesiology', avgDays: 6.3, trend: 'declining' }
  ];

  const costTrends = [
    { month: 'Aug 2024', amount: 45000 },
    { month: 'Sep 2024', amount: 52000 },
    { month: 'Oct 2024', amount: 48000 },
    { month: 'Nov 2024', amount: 61000 },
    { month: 'Dec 2024', amount: 58000 },
    { month: 'Jan 2025', amount: 67000 }
  ];

  const facilityComparison = {
    yourFacility: {
      avgPayRate: 9200,
      fillRate: 85.4,
      timeToFill: 4.2,
      physicianSatisfaction: 4.6
    },
    similarFacilities: {
      avgPayRate: 9500,
      fillRate: 82.1,
      timeToFill: 5.1,
      physicianSatisfaction: 4.3
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'above':
      case 'improving':
        return <i className="ri-arrow-up-line text-green-600"></i>;
      case 'below':
      case 'declining':
        return <i className="ri-arrow-down-line text-red-600"></i>;
      case 'equal':
      case 'stable':
        return <i className="ri-subtract-line text-gray-600"></i>;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'above':
      case 'improving':
        return 'text-green-600';
      case 'below':
      case 'declining':
        return 'text-red-600';
      case 'equal':
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const maxCost = Math.max(...costTrends.map(t => t.amount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics &amp; Insights</h2>
          <p className="text-sm text-gray-600 mt-1">Market benchmarks and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              timeRange === '30d'
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              timeRange === '90d'
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            90 Days
          </button>
          <button
            onClick={() => setTimeRange('12m')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              timeRange === '12m'
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            12 Months
          </button>
        </div>
      </div>

      {/* Market Benchmarks */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pay Rate vs Market Benchmarks</h3>
          <p className="text-sm text-gray-600 mt-1">Compare your average pay rates to similar facilities</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Your Average
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Market Average
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Difference
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {marketBenchmarks.map((benchmark) => (
                <tr key={benchmark.specialty} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {benchmark.specialty}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                    ${benchmark.yourAverage.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-600">
                    ${benchmark.marketAverage.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-medium ${getTrendColor(benchmark.trend)}`}>
                    {benchmark.difference > 0 ? '+' : ''}{benchmark.difference.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      {getTrendIcon(benchmark.trend)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <i className="ri-information-line mr-1"></i>
            Market averages are calculated from anonymized data across similar-sized facilities in your region.
          </p>
        </div>
      </div>

      {/* Fill Rates */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Posting Fill Rates</h3>
          <p className="text-sm text-gray-600 mt-1">Success rate of filled assignments by specialty</p>
        </div>
        <div className="p-6 space-y-4">
          {fillRates.map((rate) => (
            <div key={rate.specialty}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{rate.specialty}</p>
                  <p className="text-xs text-gray-600">{rate.filled} of {rate.posted} postings filled</p>
                </div>
                <span className={`text-sm font-semibold ${
                  rate.rate >= 90 ? 'text-green-600' :
                  rate.rate >= 75 ? 'text-amber-600' :
                  'text-red-600'
                }`}>
                  {rate.rate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    rate.rate >= 90 ? 'bg-green-600' :
                    rate.rate >= 75 ? 'bg-amber-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${rate.rate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time to Fill */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Average Time to Fill</h3>
          <p className="text-sm text-gray-600 mt-1">Days from posting to confirmed assignment</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeToFill.map((item) => (
              <div key={item.specialty} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">{item.specialty}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{item.avgDays}</p>
                    <p className="text-xs text-gray-600">days</p>
                  </div>
                  <div className={`flex items-center gap-1 ${getTrendColor(item.trend)}`}>
                    {getTrendIcon(item.trend)}
                    <span className="text-xs font-medium capitalize">{item.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Trends */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Cost Trends Over Time</h3>
          <p className="text-sm text-gray-600 mt-1">Total monthly spending on physician assignments</p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {costTrends.map((trend, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{trend.month}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all"
                        style={{ width: `${(trend.amount / maxCost) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        ${(trend.amount / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <i className="ri-line-chart-line text-blue-600 text-lg mt-0.5"></i>
              <div>
                <p className="text-sm text-blue-900 font-medium">Trend Analysis</p>
                <p className="text-sm text-blue-800 mt-1">
                  Your spending has increased by 48.9% over the past 6 months. Consider optimizing posting strategies or adjusting pay rates based on market benchmarks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facility Comparison */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Comparison vs Similar Facilities</h3>
          <p className="text-sm text-gray-600 mt-1">Anonymized benchmarks from facilities of similar size and region</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Average Pay Rate</p>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-teal-600">${facilityComparison.yourFacility.avgPayRate.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Your Facility</p>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-lg font-semibold text-gray-600">${facilityComparison.similarFacilities.avgPayRate.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Similar Facilities</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Fill Rate</p>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-teal-600">{facilityComparison.yourFacility.fillRate}%</p>
                  <p className="text-xs text-gray-600">Your Facility</p>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-lg font-semibold text-gray-600">{facilityComparison.similarFacilities.fillRate}%</p>
                  <p className="text-xs text-gray-600">Similar Facilities</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Avg Time to Fill</p>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-teal-600">{facilityComparison.yourFacility.timeToFill} days</p>
                  <p className="text-xs text-gray-600">Your Facility</p>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-lg font-semibold text-gray-600">{facilityComparison.similarFacilities.timeToFill} days</p>
                  <p className="text-xs text-gray-600">Similar Facilities</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Physician Rating</p>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-teal-600">{facilityComparison.yourFacility.physicianSatisfaction}</p>
                  <p className="text-xs text-gray-600">Your Facility</p>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-lg font-semibold text-gray-600">{facilityComparison.similarFacilities.physicianSatisfaction}</p>
                  <p className="text-xs text-gray-600">Similar Facilities</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <i className="ri-thumb-up-line text-green-600 text-lg mt-0.5"></i>
                <div>
                  <p className="text-sm text-green-900 font-medium">Strengths</p>
                  <ul className="text-sm text-green-800 mt-1 space-y-1">
                    <li>• Higher fill rate than average</li>
                    <li>• Better physician satisfaction scores</li>
                    <li>• Faster time to fill assignments</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <i className="ri-lightbulb-line text-amber-600 text-lg mt-0.5"></i>
                <div>
                  <p className="text-sm text-amber-900 font-medium">Opportunities</p>
                  <ul className="text-sm text-amber-800 mt-1 space-y-1">
                    <li>• Pay rates slightly below market average</li>
                    <li>• Consider competitive adjustments for Cardiology</li>
                    <li>• Optimize posting timing for better reach</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="flex items-center justify-end gap-3">
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
          <i className="ri-download-line"></i>
          Export Report (PDF)
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
          <i className="ri-file-excel-line"></i>
          Export Data (CSV)
        </button>
      </div>
    </div>
  );
}
