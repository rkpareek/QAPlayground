import React, { useState, useEffect } from 'react';
import { DocsSidebar } from './DocsSidebar';
import { DocsHome } from './DocsHome';
import { DocsArticleView } from './DocsArticleView';
import { DocsSearchModal } from './DocsSearchModal';
import { getArticleBySlug } from '../../docs/docsRegistry';
import {
  BookOpen,
  Search,
  Menu,
  X,
  ArrowLeft,
  FileQuestion,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  initialSlug?: string;
  onNavigateApp?: (section: string) => void;
}

export const DocumentationView: React.FC<Props> = ({ initialSlug, onNavigateApp }) => {
  const { currentProject } = useApp();
  const [currentSlug, setCurrentSlug] = useState<string>(() => {
    if (initialSlug) return initialSlug;
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/docs/') && pathname.length > 6) {
        return pathname.replace('/docs/', '');
      }
    }
    return '';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync state with browser URL if supported
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/docs/') && pathname.length > 6) {
        setCurrentSlug(pathname.replace('/docs/', ''));
      } else if (pathname === '/docs') {
        setCurrentSlug('');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update slug and browser history
  const handleNavigate = (slug: string) => {
    setCurrentSlug(slug);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const targetUrl = slug ? `/docs/${slug}` : '/docs';
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ slug }, '', targetUrl);
      }
    } catch {
      // Ignore if iframe history restrictions apply
    }
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for docs search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentArticle = currentSlug ? getArticleBySlug(currentSlug) : null;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Docs Sub-Header */}
      <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Open documentation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => handleNavigate('')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                <span>Product Documentation</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                  v1.0
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {currentProject?.name || 'Workspace Manual'}
              </div>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 font-medium transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Search...</span>
            <kbd className="hidden lg:inline-block text-[10px] font-mono px-1 py-0.2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {onNavigateApp && (
            <button
              onClick={() => onNavigateApp('repository')}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2 py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to App</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Documentation Body */}
      <div className="flex-1 flex min-h-[calc(100vh-3.5rem)]">
        {/* Desktop Left Sidebar */}
        <div className="hidden md:block">
          <DocsSidebar
            currentSlug={currentSlug}
            onSelectArticle={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        </div>

        {/* Mobile Left Sidebar Overlay Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl z-10">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Documentation
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <DocsSidebar
                  currentSlug={currentSlug}
                  onSelectArticle={handleNavigate}
                  onOpenSearch={() => {
                    setIsMobileSidebarOpen(false);
                    setIsSearchOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Center Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          {currentSlug === '' ? (
            <DocsHome
              onSelectArticle={handleNavigate}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          ) : currentArticle ? (
            <DocsArticleView
              article={currentArticle}
              onNavigate={handleNavigate}
            />
          ) : (
            /* 404 Documentation Fallback */
            <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center">
                <FileQuestion className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Documentation page not found
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                The requested documentation path <code className="font-mono text-slate-700 dark:text-slate-300">/docs/{currentSlug}</code> does not exist or has been relocated.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleNavigate('')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Back to Documentation Home
                </button>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                >
                  Search Documentation
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Documentation Search Modal */}
      <DocsSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleNavigate}
      />
    </div>
  );
};
