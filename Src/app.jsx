import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, Clock, DollarSign, ShieldCheck, Users, 
  AlertTriangle, CheckCircle, TrendingUp, Filter 
} from 'lucide-react';

// --- 1. DATA GENERATOR (100+ Records) ---
const generateMockData = () => {
  const modalities = ['MRI', 'CT', 'X-Ray', 'Ultrasound', 'PET-CT'];
  const radiologists = ['Dr. Sarah Chen', 'Dr. Marcus Vane', 'Dr. Elena Rossi', 'Dr. James Wu'];
  const referralSources = ['General Practice', 'Emergency Dept', 'Oncology', 'Orthopedics'];

  return Array.from({ length: 125 }, (_, i) => {
    const waitTime = Math.floor(Math.random() * 50) + 10;
    const reportTAT = Math.floor(Math.random() * 150) + 40;
    const isFalsePositive = Math.random() < 0.03; // 3% rate
    
    return {
      id: `RAD-${2000 + i}`,
      timestamp: new Date(2025, 11, Math.floor(i / 4) + 1).toLocaleDateString(),
      modality: modalities[i % modalities.length],
      radiologist: radiologists[i % radiologists.length],
      referral: referralSources[i % referralSources.length],
      waitTime,
      reportTAT,
      rvu: parseFloat((Math.random() * 8 + 2).toFixed(2)),
      denied: Math.random() < 0.07,
      isCompliant: Math.random() > 0.1,
      qualityScore: isFalsePositive ? 'False Positive' : 'Accurate'
    };
  });
};

const mockData = generateMockData();

// --- 2. MAIN COMPONENT ---
export default function RadiologyAnalytics() {
  const [activeTab, setActiveTab] = useState('operational');

  // Aggregations for Charts
  const modalityStats = useMemo(() => {
    const stats = {};
    mockData.forEach(d => {
      stats[d.modality] = (stats[d.modality] || 0) + 1;
    });
    return Object.keys(stats).map(k => ({ name: k, count: stats[k] }));
  }, []);

  const tatTrends = mockData.slice(0, 15).map(d => ({
    date: d.timestamp,
    tat: d.reportTAT,
    wait: d.waitTime
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HealthScan AI: Radiology Analytics</h1>
          <p className="text-slate-500">System Date: Dec 24, 2025 | Data Source: Live EMR/PACS</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50">
            <Filter size={16} /> Filters
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
            Export Report
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
          {['Operational', 'Financial', 'Regulatory & Quality'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
              className={`pb-4 px-6 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.toLowerCase().split(' ')[0]
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Prescription Alerts (Prescriptive Analytics) */}
        <div className="mb-8 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Prescriptive Insights (AI Recommended)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
              <AlertTriangle className="text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>High Utilization Alert:</strong> CT scan idle time is &lt;5%. 
                <span className="block font-semibold underline cursor-pointer">Re-route 3 elective outpatients to Satellite Clinic B to prevent staff burnout.</span>
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3">
              <TrendingUp className="text-blue-600 shrink-0" />
              <p className="text-sm text-blue-800">
                <strong>Financial Opportunity:</strong> Claims denial for MRI Lumbar Spine is up 12%. 
                <span className="block font-semibold underline cursor-pointer">Automate "Prior Auth" checks for General Practice referrals.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'operational' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Avg Report TAT" value="102m" sub="Target: 90m" icon={<Clock />} trend="up" />
              <StatCard title="Tech Productivity" value="94%" sub="Studies/FTE" icon={<Users />} trend="neutral" />
              <StatCard title="Patient Wait Time" value="28m" sub="-4m vs last month" icon={<Activity />} trend="down" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer title="Efficiency Trends (Wait vs Report TAT)">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={tatTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="tat" stroke="#3b82f6" fill="#dbeafe" name="TAT (min)" />
                    <Area type="monotone" dataKey="wait" stroke="#10b981" fill="#dcfce7" name="Wait (min)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer title="Modality Utilization Volume">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={modalityStats}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}

        {/* Table View (Descriptive) */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 text-sm">Detailed Study Log (100+ Records)</h3>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-sm">
              <thead className="bg-white sticky top-0 shadow-sm">
                <tr className="text-slate-500 border-b">
                  <th className="p-4 font-semibold">Study ID</th>
                  <th className="p-4 font-semibold">Modality</th>
                  <th className="p-4 font-semibold">Radiologist</th>
                  <th className="p-4 font-semibold">Wait (m)</th>
                  <th className="p-4 font-semibold">TAT (m)</th>
                  <th className="p-4 font-semibold">RVUs</th>
                  <th className="p-4 font-semibold">Quality Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockData.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-medium text-blue-600">{row.id}</td>
                    <td className="p-4">{row.modality}</td>
                    <td className="p-4 text-slate-600">{row.radiologist}</td>
                    <td className="p-4">{row.waitTime}</td>
                    <td className="p-4">{row.reportTAT}</td>
                    <td className="p-4 font-mono">{row.rvu}</td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1 ${row.qualityScore === 'Accurate' ? 'text-green-600' : 'text-red-600 font-bold'}`}>
                        {row.qualityScore === 'Accurate' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                        {row.qualityScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function StatCard({ title, value, sub, icon, trend }) {
  const trendColor = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-slate-400';
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">{icon}</div>
        <span className={`text-xs font-bold ${trendColor}`}>{trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●'}</span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium mt-4">{title}</h3>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

function ChartContainer({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}