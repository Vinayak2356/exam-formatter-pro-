import { useState, useEffect } from 'react';
import { fetchPatterns } from '../services/api';
import { DesignPattern } from '../types';
import { Search, Filter, ArrowUpDown, Eye, Download } from 'lucide-react';

export default function Explorer() {
  const [patterns, setPatterns] = useState<DesignPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchPatterns().then(data => {
      setPatterns(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const categories = Array.from(new Set(patterns.map(p => p.category)));

  const filteredPatterns = patterns.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const getComplexityColor = (level: string) => {
    switch(level.toLowerCase()) {
      case 'low': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'high': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Pick It When', 'Trade-Off', 'Category', 'Complexity'];
    const rows = filteredPatterns.map(p => [
      `"${p.name}"`, 
      `"${p.pickItWhen}"`, 
      `"${p.mainTradeOff}"`, 
      `"${p.category}"`, 
      `"${p.complexityLevel}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "system_design_patterns.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pattern Library</h1>
          <p className="text-muted-foreground text-sm">Explore and discover distributed systems design patterns.</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition shadow-sm border border-border">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="glass p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search patterns by name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-sm"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-sm appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden shadow-sm border border-border">
        {loading ? (
          <div className="p-12 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-accent/50 text-muted-foreground uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="px-6 py-4">Pattern Name</th>
                  <th className="px-6 py-4">Pick it when</th>
                  <th className="px-6 py-4 hidden md:table-cell">Main Trade-off</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-foreground flex items-center gap-1">Complexity <ArrowUpDown className="h-3 w-3"/></th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPatterns.length > 0 ? filteredPatterns.map((pattern) => (
                  <tr key={pattern.id} className="hover:bg-accent/20 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">{pattern.name}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{pattern.pickItWhen}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate hidden md:table-cell">{pattern.mainTradeOff}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                        {pattern.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getComplexityColor(pattern.complexityLevel)}`}>
                        {pattern.complexityLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No patterns found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
