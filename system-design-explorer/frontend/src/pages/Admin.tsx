import { useState, useEffect } from 'react';
import { fetchPatterns, createPattern, updatePattern, deletePattern } from '../services/api';
import { DesignPattern } from '../types';
import { Search, Filter, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';

export default function Admin() {
  const [patterns, setPatterns] = useState<DesignPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // CRUD Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<DesignPattern | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form inputs state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [pickItWhen, setPickItWhen] = useState('');
  const [mainTradeOff, setMainTradeOff] = useState('');
  const [complexityLevel, setComplexityLevel] = useState('Medium');
  const [realWorldExamples, setRealWorldExamples] = useState('');
  const [detailDescription, setDetailDescription] = useState('');

  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = () => {
    setLoading(true);
    fetchPatterns()
      .then(data => {
        setPatterns(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const categories = Array.from(new Set(patterns.map(p => p.category)));

  const filteredPatterns = patterns.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const getComplexityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'high': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedPattern(null);
    setName('');
    setCategory('');
    setPickItWhen('');
    setMainTradeOff('');
    setComplexityLevel('Medium');
    setRealWorldExamples('');
    setDetailDescription('');
    setError('');
    setSuccessMsg('');
    setShowFormModal(true);
  };

  const openEditModal = (pattern: DesignPattern) => {
    setIsEditMode(true);
    setSelectedPattern(pattern);
    setName(pattern.name || '');
    setCategory(pattern.category || '');
    setPickItWhen(pattern.pickItWhen || '');
    setMainTradeOff(pattern.mainTradeOff || '');
    setComplexityLevel(pattern.complexityLevel || 'Medium');
    setRealWorldExamples(pattern.realWorldExamples || '');
    setDetailDescription(pattern.detailDescription || '');
    setError('');
    setSuccessMsg('');
    setShowFormModal(true);
  };

  const openDeleteModal = (pattern: DesignPattern) => {
    setSelectedPattern(pattern);
    setError('');
    setSuccessMsg('');
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !pickItWhen || !mainTradeOff) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    const payload = {
      name,
      category,
      pickItWhen,
      mainTradeOff,
      complexityLevel,
      realWorldExamples: realWorldExamples || 'Example usages in production systems.',
      detailDescription: detailDescription || 'Detailed breakdown of the design pattern.',
    };

    try {
      if (isEditMode && selectedPattern) {
        await updatePattern(selectedPattern.id, payload);
        setSuccessMsg('Pattern updated successfully!');
      } else {
        await createPattern(payload);
        setSuccessMsg('Pattern created successfully!');
      }
      setTimeout(() => {
        setShowFormModal(false);
        loadPatterns();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPattern) return;
    setSubmitting(true);
    setError('');
    try {
      await deletePattern(selectedPattern.id);
      setSuccessMsg('Pattern deleted successfully!');
      setTimeout(() => {
        setShowDeleteModal(false);
        loadPatterns();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Workspace</h1>
          <p className="text-muted-foreground text-sm">Add, modify, or remove system design patterns from the directory.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Create Pattern
        </button>
      </div>

      {/* Filter Bar */}
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

      {/* Patterns Table */}
      <div className="glass rounded-xl overflow-hidden shadow-sm border border-border">
        {loading ? (
          <div className="p-12 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-accent/50 text-muted-foreground uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="px-6 py-4">Pattern Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Complexity</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPatterns.length > 0 ? filteredPatterns.map((pattern) => (
                  <tr key={pattern.id} className="hover:bg-accent/20 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">{pattern.name}</td>
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
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(pattern)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit Pattern"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(pattern)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete Pattern"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      No patterns found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl glass rounded-2xl shadow-2xl border border-white/20 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-accent/30">
              <h2 className="text-xl font-bold text-foreground">
                {isEditMode ? 'Edit Design Pattern' : 'Create New Design Pattern'}
              </h2>
              <button 
                onClick={() => setShowFormModal(false)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg font-medium text-center">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm rounded-lg font-medium text-center">
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Pattern Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Saga Pattern"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Category *</label>
                  <input 
                    type="text" 
                    required 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    placeholder="e.g. Architecture"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Complexity Level</label>
                  <select 
                    value={complexityLevel} 
                    onChange={(e) => setComplexityLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition appearance-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Pick It When (Scenario description) *</label>
                <textarea 
                  required 
                  value={pickItWhen} 
                  onChange={(e) => setPickItWhen(e.target.value)} 
                  placeholder="When to use this pattern..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Main Trade-Off *</label>
                <textarea 
                  required 
                  value={mainTradeOff} 
                  onChange={(e) => setMainTradeOff(e.target.value)} 
                  placeholder="Primary consequence/trade-off..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Real World Examples</label>
                <textarea 
                  value={realWorldExamples} 
                  onChange={(e) => setRealWorldExamples(e.target.value)} 
                  placeholder="Production or real-world use cases..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Detailed Description & Architecture</label>
                <textarea 
                  value={detailDescription} 
                  onChange={(e) => setDetailDescription(e.target.value)} 
                  placeholder="Comprehensive explanation and structural breakdown..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition shadow-lg shadow-primary/20 min-w-[100px]"
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPattern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md glass rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Design Pattern?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-foreground">"{selectedPattern.name}"</span>? 
                This action is permanent and cannot be undone.
              </p>
              
              {error && (
                <div className="mt-4 p-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg font-medium text-center">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="mt-4 p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm rounded-lg font-medium text-center">
                  {successMsg}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-accent/25 border-t border-border flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleDeleteConfirm}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:bg-destructive/90 transition shadow-lg shadow-destructive/20"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
