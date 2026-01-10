import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Zap, Users, DollarSign, Activity, ChevronRight, Bell, TrendingUp } from 'lucide-react';

// Data integrated from index1.html
const siteData = {
  all: { name: "Enterprise", vol: "4,120", tat: "42.5h", coll: "94.2%", rev: [45, 52, 48, 70, 65, 90], color: "#3b82f6" },
  north: { name: "North Clinic", vol: "1,850", tat: "38.2h", coll: "96.1%", rev: [30, 35, 32, 45, 40, 55], color: "#10b981" },
  south: { name: "South Imaging", vol: "1,240", tat: "51.8h", coll: "91.5%", rev: [20, 25, 22, 30, 28, 40], color: "#ef4444" }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentSite, setCurrentSite] = useState('all');
  const data = siteData[currentSite];

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {/* DARK GRAPHICAL SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] flex flex-col shadow-2xl z-50 text-white">
        <div className="p-8 flex items-center gap-3 border-b border-slate-800/50">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
            <Activity size={24} />
          </div>
          <h1 className="font-black text-xl tracking-tighter uppercase italic">Rad<span className="text-blue-400">Core</span></h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={18}/>} label="Executive View" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarLink icon={<Zap size={18}/>} label="Live Ops" active={activeTab === 'ops'} onClick={() => setActiveTab('ops')} />
          <SidebarLink icon={<Users size={18}/>} label="Physicians" active={activeTab === 'prod'} onClick={() => setActiveTab('prod')} />
          <SidebarLink icon={<DollarSign size={18}/>} label="Finance" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
        </nav>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">{activeTab}</h2>
          <select 
            value={currentSite} 
            onChange={(e) => setCurrentSite(e.target.value)}
            className="bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-2 text-xs font-black text-slate-700 outline-none uppercase cursor-pointer hover:border-blue-400 transition-all"
          >
            <option value="all">Enterprise (Global)</option>
            <option value="north">North Clinic</option>
            <option value="south">South Imaging</option>
          </select>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-slate-50">
          {/* GRAPHICAL KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <VisualCard label="Monthly Volume" value={data.vol} trend="+12%" icon={<TrendingUp className="text-emerald-500" />} />
            <VisualCard label="Avg Report TAT" value={data.tat} trend="-4.2h" icon={<Activity className="text-blue-500" />} />
            <VisualCard label="Collections" value={data.coll} trend="94.2%" icon={<DollarSign className="text-amber-500" />} />
            <VisualCard label="Active Alerts" value="12" trend="Alert" icon={<Bell className="text-red-500" />} />
          </div>

          {/* LARGE CHART AREA */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-10">Throughput Curve</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.rev.map((v, i) => ({ n: `W${i+1}`, v }))}>
                  <defs>
                    <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={data.color} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={data.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="n" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="v" stroke={data.color} fill="url(#colorCurve)" strokeWidth={6} dot={{ r: 6, fill: data.color, strokeWidth: 3, stroke: '#fff' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      <div className="flex items-center gap-4">{icon}<span className="text-xs font-black uppercase tracking-widest">{label}</span></div>
      {active && <ChevronRight size={14} />}
    </button>
  );
}

function VisualCard({ label, value, trend, icon }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-tighter">{trend}</span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
    </div>
  );
}