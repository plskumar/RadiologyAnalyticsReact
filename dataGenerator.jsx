import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Clock, DollarSign, ShieldCheck, Users, AlertCircle } from 'lucide-react';

// --- TEST DATA GENERATOR (100+ Records) ---
const generateData = () => {
  const modalities = ['MRI', 'CT', 'X-Ray', 'Ultrasound', 'PET'];
  const radiologists = ['Dr. Smith', 'Dr. Jones', 'Dr. Lee', 'Dr. Wong'];
  const reasons = ['Equipment Issue', 'Patient No-show', 'Staff Shortage'];
  
  return Array.from({ length: 120 }, (_, i) => ({
    id: i,
    date: `2023-${(i % 12) + 1}-01`,
    modality: modalities[Math.floor(Math.random() * modalities.length)],
    radiologist: radiologists[Math.floor(Math.random() * radiologists.length)],
    waitTime: Math.floor(Math.random() * 45) + 15, // minutes
    reportTAT: Math.floor(Math.random() * 120) + 30, // minutes
    utilization: Math.floor(Math.random() * 40) + 60, // percentage
    rvu: (Math.random() * 5 + 1).toFixed(2),
    isFalseResult: Math.random() < 0.05, // 5% error rate
    isRegulatoryCompliant: Math.random() > 0.1,
    denied: Math.random() < 0.08,
  }));
};

const data = generateData();

const RadiologyDashboard = () => {
  // Logic to aggregate data for charts
  const modalityStats = useMemo(() => {
    const counts = {};
    data.forEach(d => {
      counts[d.modality] = (counts[d.modality] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, []);

  const tatTrend = data.slice(0, 10).map((d, i) => ({ name: `Day ${i+1}`, tat: d.reportTAT, wait: d.waitTime }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Radiology Analytics Suite</h1>
        <p className="text-slate-500">Operational, Financial & Regulatory Performance</p>
      </header>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Avg Report TAT" value="84 mins" icon={<Clock className="text-blue-500" />} sub="Target: <90 mins" color="bg-blue-50" />
        <KpiCard title="Modality Utilization" value="78%" icon={<Activity className="text-green-500" />} sub="+4% from last month" color="bg-green-50" />
        <KpiCard title="Claims Denial Rate" value="6.2%" icon={<DollarSign className="text-red-500" />} sub="Industry Avg: 8%" color="bg-red-50" />
        <KpiCard title="False Result Rate" value="2.1%" icon={<ShieldCheck className="text-purple-500" />} sub="Quality Benchmark" color="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* OPERATIONAL: TAT Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock size={20} /> Operational Efficiency (TAT vs Wait Time)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tatTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tat" stroke="#3b82f6" name="Report TAT (min)" strokeWidth={2} />
                <Line type="monotone" dataKey="wait" stroke="#10b981" name="Patient Wait (min)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FINANCIAL: Modality Mix */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign size={20} /> Procedure Volume by Modality
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modalityStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* REGULATORY & EFFECTIVENESS TABLE */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle size={20} /> Regulatory Compliance & Quality Logs
          </h3>
          <button className="text-sm text-blue-600 font-medium">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4">Study ID</th>
                <th className="p-4">Modality</th>
                <th className="p-4">Radiologist</th>
                <th className="p-4">RVUs</th>
                <th className="p-4">Status</th>
                <th className="p-4">Regulatory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.slice(0, 5).map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">#RAD-{1000 + row.id}</td>
                  <td className="p-4">{row.modality}</td>
                  <td className="p-4">{row.radiologist}</td>
                  <td className="p-4">{row.rvu}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${row.denied ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {row.denied ? 'Denied' : 'Paid'}
                    </span>
                  </td>
                  <td className="p-4">
                    {row.isRegulatoryCompliant ? '✅ MIPS Compliant' : '⚠️ Review Required'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon, sub, color }) => (
  <div className={`${color} p-5 rounded-2xl border border-gray-100 shadow-sm`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>
        <p className="text-xs text-gray-500 mt-1">{sub}</p>
      </div>
      <div className="p-2 bg-white rounded-lg shadow-inner">{icon}</div>
    </div>
  </div>
);

export default RadiologyDashboard;