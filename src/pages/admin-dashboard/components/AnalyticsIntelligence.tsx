
import { useState } from 'react';

interface MetricCard {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

interface ConversionData {
  specialty: string;
  posted: number;
  filled: number;
  rate: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  fees: number;
  assignments: number;
}

interface DisputeMetric {
  type: string;
  count: number;
  avgResolutionDays: number;
  trend: 'up' | 'down' | 'neutral';
}

interface UserReliability {
  userId: string;
  name: string;
  type: 'Physician' | 'Facility';
  completionRate: number;
  cancellationRate: number;
  avgRating: number;
  totalAssignments: number;
  score: number;
}

interface PricingAnomaly {
  id: string;
  specialty: string;
  facility: string;
  amount: number;
  marketAvg: number;
  deviation: number;
  date: string;
  flagged: boolean;
}

interface SpecialtyDemand {
  specialty: string;
  activeListings: number;
  fillRate: number;
  avgPayRate: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface GeographicData {
  state: string;
  activeListings: number;
  avgPayRate: number;
  fillRate: number;
  topSpecialty: string;
}

export default function AnalyticsIntelligence() {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'disputes' | 'reliability' | 'market' | 'geographic'>('overview');
  const [dateRange, setDateRange] = useState('30');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');

  // Mock data - would come from real-time analytics system
  const keyMetrics: MetricCard[] = [
    {
      label: 'Active Listings',
      value: 247,
      change: '+12.5%',
      trend: 'up',
      icon: 'ri-file-list-3-line',
      color: 'blue'
    },
    {
      label: 'Conversion Rate',
      value: '68.3%',
      change: '+5.2%',
      trend: 'up',
      icon: 'ri-line-chart-line',
      color: 'green'
    },
    {
      label: 'Total Revenue',
      value: '$2.4M',
      change: '+18.7%',
      trend: 'up',
      icon: 'ri-money-dollar-circle-line',
      color: 'teal'
    },
    {
      label: 'Platform Fees',
      value: '$360K',
      change: '+18.7%',
      trend: 'up',
      icon: 'ri-percent-line',
      color: 'purple'
    },
    {
      label: 'Active Disputes',
      value: 8,
      change: '-25%',
      trend: 'down',
      icon: 'ri-alert-line',
      color: 'amber'
    },
    {
      label: 'Avg Resolution Time',
      value: '3.2 days',
      change: '-15%',
      trend: 'down',
      icon: 'ri-time-line',
      color: 'indigo'
    }
  ];

  const conversionData: ConversionData[] = [
    { specialty: 'Emergency Medicine', posted: 45, filled: 38, rate: 84.4 },
    { specialty: 'Anesthesiology', posted: 32, filled: 28, rate: 87.5 },
    { specialty: 'Hospitalist', posted: 58, filled: 35, rate: 60.3 },
    { specialty: 'Critical Care', posted: 28, filled: 22, rate: 78.6 },
    { specialty: 'Radiology', posted: 19, filled: 17, rate: 89.5 },
    { specialty: 'Surgery', posted: 24, filled: 18, rate: 75.0 },
    { specialty: 'Cardiology', posted: 15, filled: 13, rate: 86.7 },
    { specialty: 'Neurology', posted: 12, filled: 9, rate: 75.0 }
  ];

  const revenueData: RevenueData[] = [
    { month: 'Jan 2025', revenue: 385000, fees: 57750, assignments: 42 },
    { month: 'Feb 2025', revenue: 412000, fees: 61800, assignments: 48 },
    { month: 'Mar 2025', revenue: 458000, fees: 68700, assignments: 53 },
    { month: 'Apr 2025', revenue: 495000, fees: 74250, assignments: 58 },
    { month: 'May 2025', revenue: 523000, fees: 78450, assignments: 61 },
    { month: 'Jun 2025', revenue: 547000, fees: 82050, assignments: 64 }
  ];

  const disputeMetrics: DisputeMetric[] = [
    { type: 'Payment Dispute', count: 3, avgResolutionDays: 2.8, trend: 'down' },
    { type: 'Contract Violation', count: 2, avgResolutionDays: 4.5, trend: 'neutral' },
    { type: 'Quality Complaint', count: 2, avgResolutionDays: 3.0, trend: 'down' },
    { type: 'Cancellation Dispute', count: 1, avgResolutionDays: 2.0, trend: 'down' }
  ];

  const reliabilityScores: UserReliability[] = [
    {
      userId: 'P-1247',
      name: 'Dr. Sarah Mitchell',
      type: 'Physician',
      completionRate: 98.5,
      cancellationRate: 1.5,
      avgRating: 4.9,
      totalAssignments: 67,
      score: 97
    },
    {
      userId: 'F-0892',
      name: 'Memorial Regional Hospital',
      type: 'Facility',
      completionRate: 96.2,
      cancellationRate: 3.8,
      avgRating: 4.7,
      totalAssignments: 52,
      score: 94
    },
    {
      userId: 'P-2156',
      name: 'Dr. James Chen',
      type: 'Physician',
      completionRate: 95.8,
      cancellationRate: 4.2,
      avgRating: 4.8,
      totalAssignments: 48,
      score: 93
    },
    {
      userId: 'F-1034',
      name: 'St. Mary\'s Medical Center',
      type: 'Facility',
      completionRate: 94.5,
      cancellationRate: 5.5,
      avgRating: 4.6,
      totalAssignments: 73,
      score: 91
    },
    {
      userId: 'P-1893',
      name: 'Dr. Emily Rodriguez',
      type: 'Physician',
      completionRate: 92.3,
      cancellationRate: 7.7,
      avgRating: 4.5,
      totalAssignments: 39,
      score: 88
    }
  ];

  const pricingAnomalies: PricingAnomaly[] = [
    {
      id: 'A-1024',
      specialty: 'Emergency Medicine',
      facility: 'Riverside Medical Center',
      amount: 12500,
      marketAvg: 8200,
      deviation: 52.4,
      date: '2025-06-15',
      flagged: true
    },
    {
      id: 'A-1025',
      specialty: 'Anesthesiology',
      facility: 'County General Hospital',
      amount: 4200,
      marketAvg: 7800,
      deviation: -46.2,
      date: '2025-06-14',
      flagged: true
    },
    {
      id: 'A-1026',
      specialty: 'Critical Care',
      facility: 'Metro Health System',
      amount: 11200,
      marketAvg: 8500,
      deviation: 31.8,
      date: '2025-06-13',
      flagged: false
    }
  ];

  const specialtyDemand: SpecialtyDemand[] = [
    {
      specialty: 'Emergency Medicine',
      activeListings: 45,
      fillRate: 84.4,
      avgPayRate: 8200,
      trend: 'increasing'
    },
    {
      specialty: 'Anesthesiology',
      activeListings: 32,
      fillRate: 87.5,
      avgPayRate: 7800,
      trend: 'stable'
    },
    {
      specialty: 'Hospitalist',
      activeListings: 58,
      fillRate: 60.3,
      avgPayRate: 6500,
      trend: 'increasing'
    },
    {
      specialty: 'Critical Care',
      activeListings: 28,
      fillRate: 78.6,
      avgPayRate: 8500,
      trend: 'stable'
    },
    {
      specialty: 'Radiology',
      activeListings: 19,
      fillRate: 89.5,
      avgPayRate: 7200,
      trend: 'decreasing'
    }
  ];

  const geographicData: GeographicData[] = [
    {
      state: 'California',
      activeListings: 62,
      avgPayRate: 9200,
      fillRate: 72.5,
      topSpecialty: 'Emergency Medicine'
    },
    {
      state: 'Texas',
      activeListings: 48,
      avgPayRate: 7800,
      fillRate: 68.3,
      topSpecialty: 'Hospitalist'
    },
    {
      state: 'Florida',
      activeListings: 41,
      avgPayRate: 7500,
      fillRate: 75.2,
      topSpecialty: 'Anesthesiology'
    },
    {
      state: 'New York',
      activeListings: 35,
      avgPayRate: 9800,
      fillRate: 81.4,
      topSpecialty: 'Critical Care'
    },
    {
      state: 'Illinois',
      activeListings: 28,
      avgPayRate: 7200,
      fillRate: 64.3,
      topSpecialty: 'Emergency Medicine'
    }
  ];

  const handleExport = () => {
    console.log(`Exporting analytics report as ${exportFormat.toUpperCase()}...`);
    // In production, this would trigger actual export generation
    alert(`Analytics report exported as ${exportFormat.toUpperCase()}`);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return 'ri-arrow-up-line';
    if (trend === 'down') return 'ri-arrow-down-line';
    return 'ri-subtract-line';
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral', inverse = false) => {
    if (trend === 'neutral') return 'text-gray-500';
    if (inverse) {
      return trend === 'up' ? 'text-red-600' : 'text-green-600';
    }
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getMetricColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      teal: 'bg-teal-100 text-teal-600',
      purple: 'bg-purple-100 text-purple-600',
      amber: 'bg-amber-100 text-amber-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colors[color] || colors.blue;
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-50';
    if (score >= 90) return 'text-teal-600 bg-teal-50';
    if (score >= 85) return 'text-blue-600 bg-blue-50';
    if (score >= 80) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Intelligence</h2>
          <p className="text-sm text-gray-600 mt-1">Automated insights and market intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'csv')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="pdf">Export as PDF</option>
            <option value="csv">Export as CSV</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-download-line"></i>
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {keyMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${getMetricColor(metric.color)} flex items-center justify-center`}>
                <i className={`${metric.icon} text-lg`}></i>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor(metric.trend, metric.label.includes('Dispute') || metric.label.includes('Resolution'))}`}>
                <i className={getTrendIcon(metric.trend)}></i>
                {metric.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-xs text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
              { id: 'revenue', label: 'Revenue Tracking', icon: 'ri-money-dollar-circle-line' },
              { id: 'disputes', label: 'Dispute Metrics', icon: 'ri-alert-line' },
              { id: 'reliability', label: 'User Reliability', icon: 'ri-star-line' },
              { id: 'market', label: 'Market Insights', icon: 'ri-line-chart-line' },
              { id: 'geographic', label: 'Geographic Analysis', icon: 'ri-map-pin-line' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rates by Specialty</h3>
                <div className="space-y-3">
                  {conversionData.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-48 text-sm font-medium text-gray-700">{item.specialty}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.rate >= 85 ? 'bg-green-500' : item.rate >= 70 ? 'bg-teal-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${item.rate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right">{item.rate}%</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.filled} filled / {item.posted} posted
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-information-line text-blue-600 text-xl"></i>
                  <div>
                    <div className="font-medium text-blue-900 mb-1">Automated Analytics</div>
                    <div className="text-sm text-blue-700">
                      All metrics update automatically in real-time. No manual data entry required. Export reports for detailed analysis.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Tracking Tab */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends (Last 6 Months)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Revenue</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Platform Fees (15%)</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Assignments</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg per Assignment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.month}</td>
                          <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                            ${item.revenue.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-teal-600 font-semibold">
                            ${item.fees.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-gray-700">{item.assignments}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-700">
                            ${Math.round(item.revenue / item.assignments).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-semibold">
                        <td className="py-3 px-4 text-sm text-gray-900">Total</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">
                          ${revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-teal-600">
                          ${revenueData.reduce((sum, item) => sum + item.fees, 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">
                          {revenueData.reduce((sum, item) => sum + item.assignments, 0)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-700">—</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
                  <div className="text-sm text-teal-700 mb-1">Growth Rate</div>
                  <div className="text-2xl font-bold text-teal-900">+42.0%</div>
                  <div className="text-xs text-teal-600 mt-1">Jan to Jun 2025</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-purple-700 mb-1">Avg Assignment Value</div>
                  <div className="text-2xl font-bold text-purple-900">$8,547</div>
                  <div className="text-xs text-purple-600 mt-1">Across all specialties</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-blue-700 mb-1">Fee Collection Rate</div>
                  <div className="text-2xl font-bold text-blue-900">99.8%</div>
                  <div className="text-xs text-blue-600 mt-1">Automated collection</div>
                </div>
              </div>
            </div>
          )}

          {/* Dispute Metrics Tab */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispute Frequency & Resolution</h3>
                <div className="space-y-3">
                  {disputeMetrics.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-semibold text-gray-900">{item.type}</div>
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                            {item.count} active
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(item.trend, true)}`}>
                          <i className={getTrendIcon(item.trend)}></i>
                          {item.trend === 'up' ? 'Increasing' : item.trend === 'down' ? 'Decreasing' : 'Stable'}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <i className="ri-time-line text-gray-400"></i>
                          Avg resolution: <span className="font-medium text-gray-900">{item.avgResolutionDays} days</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-checkbox-circle-line text-green-600 text-xl"></i>
                    <div className="text-sm font-semibold text-green-900">Resolution Success Rate</div>
                  </div>
                  <div className="text-3xl font-bold text-green-900 mb-1">94.2%</div>
                  <div className="text-sm text-green-700">Disputes resolved without escalation</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-calendar-check-line text-blue-600 text-xl"></i>
                    <div className="text-sm font-semibold text-blue-900">Avg Time to Resolution</div>
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-1">3.1 days</div>
                  <div className="text-sm text-blue-700">15% improvement from last period</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-lightbulb-line text-amber-600 text-xl"></i>
                  <div>
                    <div className="font-medium text-amber-900 mb-1">Insight</div>
                    <div className="text-sm text-amber-700">
                      Dispute frequency has decreased 25% this period. Payment disputes resolve fastest (2.8 days avg). 
                      Contract violations require more time (4.5 days avg) due to documentation review.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Reliability Tab */}
          {activeTab === 'reliability' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Reliability Scores</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Score</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Completion Rate</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Cancellation Rate</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Rating</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Assignments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reliabilityScores.map((user, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.userId}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              user.type === 'Physician' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {user.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getReliabilityColor(user.score)}`}>
                              {user.score}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-gray-900">{user.completionRate}%</td>
                          <td className="py-3 px-4 text-right text-sm text-gray-900">{user.cancellationRate}%</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <i className="ri-star-fill text-amber-400 text-sm"></i>
                              <span className="text-sm font-medium text-gray-900">{user.avgRating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-gray-700">{user.totalAssignments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-information-line text-blue-600 text-xl"></i>
                  <div>
                    <div className="font-medium text-blue-900 mb-1">Reliability Score Calculation</div>
                    <div className="text-sm text-blue-700">
                      Scores are calculated automatically based on completion rate (40%), cancellation rate (30%), 
                      average rating (20%), and total assignments (10%). Updated in real-time after each assignment.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Insights Tab */}
          {activeTab === 'market' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialty Demand Trends</h3>
                <div className="space-y-3">
                  {specialtyDemand.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-semibold text-gray-900">{item.specialty}</div>
                          <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                            item.trend === 'increasing' ? 'bg-green-100 text-green-700' :
                            item.trend === 'decreasing' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            <i className={`${
                              item.trend === 'increasing' ? 'ri-arrow-up-line' :
                              item.trend === 'decreasing' ? 'ri-arrow-down-line' :
                              'ri-subtract-line'
                            }`}></i>
                            {item.trend}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Active Listings</div>
                          <div className="text-lg font-bold text-gray-900">{item.activeListings}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Fill Rate</div>
                          <div className="text-lg font-bold text-gray-900">{item.fillRate}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Avg Pay Rate</div>
                          <div className="text-lg font-bold text-gray-900">${item.avgPayRate.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Anomalies</h3>
                <div className="space-y-3">
                  {pricingAnomalies.map((anomaly) => (
                    <div key={anomaly.id} className={`rounded-lg p-4 border ${
                      anomaly.flagged ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">{anomaly.specialty}</span>
                            {anomaly.flagged && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                Flagged
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">{anomaly.facility} • {anomaly.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">${anomaly.amount.toLocaleString()}</div>
                          <div className={`text-xs font-medium ${
                            anomaly.deviation > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation.toFixed(1)}% vs market
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        Market average: ${anomaly.marketAvg.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-lightbulb-line text-purple-600 text-xl"></i>
                  <div>
                    <div className="font-medium text-purple-900 mb-1">Market Insight</div>
                    <div className="text-sm text-purple-700">
                      Emergency Medicine and Hospitalist specialties show increasing demand. Pricing anomalies 
                      exceeding ±40% are automatically flagged for review. Consider market benchmarking tools for facilities.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Geographic Analysis Tab */}
          {activeTab === 'geographic' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">State-by-State Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">State</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Active Listings</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Pay Rate</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Fill Rate</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Top Specialty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {geographicData.map((state, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{state.state}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900">{state.activeListings}</td>
                          <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                            ${state.avgPayRate.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-full rounded-full ${
                                    state.fillRate >= 75 ? 'bg-green-500' : state.fillRate >= 65 ? 'bg-teal-500' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${state.fillRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-12">{state.fillRate}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">{state.topSpecialty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-blue-700 mb-2">Highest Pay Rates</div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">New York</div>
                  <div className="text-sm text-blue-700">$9,800 average per assignment</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-700 mb-2">Highest Fill Rate</div>
                  <div className="text-2xl font-bold text-green-900 mb-1">New York</div>
                  <div className="text-sm text-green-700">81.4% of postings filled</div>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-map-pin-line text-teal-600 text-xl"></i>
                  <div>
                    <div className="font-medium text-teal-900 mb-1">Geographic Insight</div>
                    <div className="text-sm text-teal-700">
                      California leads in total listings (62) but has moderate fill rates (72.5%). New York shows 
                      highest pay rates and fill rates, indicating strong demand. Texas and Florida represent 
                      growing markets with competitive rates.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
