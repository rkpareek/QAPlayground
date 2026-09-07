import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Boxes, 
  Sun, 
  Moon, 
  Search, 
  LayoutGrid, 
  CheckSquare, 
  GraduationCap, 
  ShoppingBag, 
  Send, 
  Code2, 
  Gauge, 
  Database,
  Terminal,
  ExternalLink,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { TOOLS_REGISTRY } from '../registry';

interface SharedHeaderProps {
  onOpenCommandPalette?: () => void;
}

export const SharedHeader: React.FC<SharedHeaderProps> = ({ onOpenCommandPalette }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeTool = TOOLS_REGISTRY.find(t => location.pathname.startsWith(t.path));

  const getIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'CheckSquare': return <CheckSquare className={className} />;
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'Send': return <Send className={className} />;
      case 'Code2': return <Code2 className={className} />;
      case 'Gauge': return <Gauge className={className} />;
      case 'Database': return <Database className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      default: return <LayoutGrid className={className} />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left Brand / Breadcrumb */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Boxes className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
                  QA TOOLS HUB
                </span>
                <span className="text-[10px] font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  Engineering Portal
                </span>
              </div>
            </Link>

            {activeTool && (
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium">
                  {getIcon(activeTool.icon, 'w-3.5 h-3.5')}
                  <span>{activeTool.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Center App Switcher (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              Hub Dashboard
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Tool Suite ({TOOLS_REGISTRY.length})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isToolsDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsToolsDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-20">
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      QA Applications Directory
                    </div>
                    <div className="space-y-1 mt-1">
                      {TOOLS_REGISTRY.map(tool => (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          onClick={() => setIsToolsDropdownOpen(false)}
                          className={`flex items-start gap-2.5 p-2 rounded-lg text-xs transition-colors ${
                            location.pathname.startsWith(tool.path)
                              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-0.5">
                            {getIcon(tool.icon, 'w-4 h-4')}
                          </div>
                          <div>
                            <div className="font-semibold">{tool.name}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {tool.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick search button / Command Palette */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                title="Search Tools (⌘K / Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-medium">Quick Search...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-500 dark:text-slate-300 shadow-2xs">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Hub Dashboard
            </Link>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-2">
              All Tools
            </div>
            {TOOLS_REGISTRY.map(tool => (
              <Link
                key={tool.id}
                to={tool.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {getIcon(tool.icon, 'w-4 h-4 text-indigo-500')}
                <span>{tool.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
