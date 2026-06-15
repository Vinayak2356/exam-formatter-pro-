import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings, LogOut, Code, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { logout, isAuthenticated, role, email } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 glass flex flex-col justify-between hidden md:flex border-r border-border">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl text-primary">
              <Code className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-foreground">SDP Explorer</h1>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest">System Design</p>
            </div>
          </div>
          
          <nav className="px-4 py-6 space-y-2">
            <NavLink 
              to="/" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-medium text-sm">Dashboard</span>
            </NavLink>
            <NavLink 
              to="/explorer" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
            >
              <BookOpen className="h-5 w-5" />
              <span className="font-medium text-sm">Pattern Library</span>
            </NavLink>
            
            {role === 'ADMIN' && (
              <NavLink 
                to="/admin" 
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium text-sm">Admin Panel</span>
              </NavLink>
            )}
          </nav>
        </div>
        
        {isAuthenticated && (
          <div className="p-4 m-4 rounded-xl bg-accent/50 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-background rounded-full p-1 border shadow-sm">
                <UserCircle className="h-8 w-8 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-foreground">{email}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Mobile Header */}
        <header className="md:hidden glass p-4 flex items-center justify-between border-b border-border z-10">
           <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <h1 className="font-bold text-lg text-foreground">SDP Explorer</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 z-0">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
