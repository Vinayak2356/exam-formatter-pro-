import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('admin@systemdesign.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.role, data.email);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
      
      <div className="w-full max-w-md p-8 glass rounded-2xl shadow-2xl relative z-10 border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-tr from-primary to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4 transform -rotate-6">
            <Code className="h-8 w-8 text-white rotate-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Log in to manage the System Design Patterns database.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground"
                placeholder="admin@systemdesign.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
