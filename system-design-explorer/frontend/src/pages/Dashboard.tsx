import { useEffect, useState } from 'react';
import { fetchStats } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Layers, Activity, Users, Download, ArrowUpRight } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then(data => {
      setStats(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="h-full flex items-center justify-center"><div className="animate-pulse flex gap-2"><div className="h-3 w-3 bg-primary rounded-full"></div><div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div><div className="h-3 w-3 bg-primary rounded-full"></div></div></div>;
  }

  // Mock data for charts
  const categoryData = [
    { name: 'Architecture', value: 5 },
    { name: 'Database', value: 8 },
    { name: 'Caching', value: 3 },
    { name: 'Messaging', value: 4 },
    { name: 'Resilience', value: 6 },
    { name: 'Microservices', value: 4 },
  ];

  const complexityData = [
    { name: 'Low', count: 8 },
    { name: 'Medium', count: 12 },
    { name: 'High', count: 10 },
  ];

  const trendData = [
    { name: 'Mon', views: 400 },
    { name: 'Tue', views: 300 },
    { name: 'Wed', views: 550 },
    { name: 'Thu', views: 480 },
    { name: 'Fri', views: 700 },
    { name: 'Sat', views: 250 },
    { name: 'Sun', views: 350 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your System Design Patterns repository</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Patterns', value: stats?.totalPatterns || 30, icon: Layers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Categories', value: stats?.categories || 6, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { title: 'Active Users', value: stats?.activeUsers || 1, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'Downloads', value: stats?.exportsGenerated || 42, icon: Download, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl flex items-center justify-between border-white/20">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Patterns by Category</h3>
            <div className="p-1.5 bg-accent rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors"><ArrowUpRight className="h-4 w-4" /></div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Complexity Distribution</h3>
            <div className="p-1.5 bg-accent rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors"><ArrowUpRight className="h-4 w-4" /></div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complexityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
