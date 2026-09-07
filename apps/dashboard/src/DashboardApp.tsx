import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckSquare, 
  GraduationCap, 
  ShoppingBag, 
  Send, 
  Code2, 
  Gauge, 
  Database,
  Terminal,
  LayoutGrid,
  CheckCircle2,
  ExternalLink,
  Tag,
  SlidersHorizontal,
  Bookmark,
  Zap,
  Info
} from 'lucide-react';
import { TOOLS_REGISTRY, CATEGORIES, ToolMetadata } from '../../../packages/registry';

interface DashboardAppProps {
  onOpenCommandPalette?: () => void;
}

export const DashboardApp: React.FC<DashboardAppProps> = ({ onOpenCommandPalette }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Tools');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedTools, setBookmarkedTools] = useState<string[]>(() => {
    const saved = localStorage.getItem('qa_hub_bookmarked_tools');
    return saved ? JSON.parse(saved) : ['tms', 'qa-studyhub', 'demo-testing'];
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedTools(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('qa_hub_bookmarked_tools', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter(tool => {
      const matchesCategory = selectedCategory === 'All Tools' || tool.category === selectedCategory;
      const matchesSearch = 
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getIcon = (iconName: string, className: string = 'w-5 h-5') => {
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

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo':
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 group-hover:border-indigo-400';
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 group-hover:border-emerald-400';
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60 group-hover:border-blue-400';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60 group-hover:border-purple-400';
      case 'cyan':
        return 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/60 group-hover:border-cyan-400';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60 group-hover:border-amber-400';
      case 'rose':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60 group-hover:border-rose-400';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-xs">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified QA Engineering Suite</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Central QA Tools Hub
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              An all-in-one testing workbench consolidating enterprise test management, comprehensive certification knowledge bases, practice e-commerce sandboxes, REST API studios, and automation generators.
            </p>

            {/* Global Search Bar */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tools by name, tag, or capability (e.g., 'API', 'Selenium', 'RTM', 'k6')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>

              {onOpenCommandPalette && (
                <button
                  onClick={onOpenCommandPalette}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Command Palette</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded">⌘K</kbd>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Launch / Bookmarked Bar */}
        {bookmarkedTools.length > 0 && searchQuery === '' && selectedCategory === 'All Tools' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Bookmark className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
              <span>Pinned Quick Launch</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TOOLS_REGISTRY.filter(t => bookmarkedTools.includes(t.id)).map(tool => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:shadow-xs transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${getColorClasses(tool.color)}`}>
                      {getIcon(tool.icon, 'w-4 h-4')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {tool.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {tool.category}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-2 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Showing {filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => {
              const isPinned = bookmarkedTools.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header: Icon, Name, Pin */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl border ${getColorClasses(tool.color)}`}>
                          {getIcon(tool.icon, 'w-5 h-5')}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {tool.category}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {tool.name}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={(e) => toggleBookmark(tool.id, e)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isPinned
                            ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={isPinned ? 'Unpin tool' : 'Pin to quick launch'}
                      >
                        <Bookmark className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Key Features */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Capabilities & Modules:
                      </div>
                      <ul className="space-y-1">
                        {tool.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tool.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Launch Action */}
                  <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      v{tool.version} • {tool.status}
                    </span>
                    <Link
                      to={tool.path}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white dark:hover:text-slate-950 transition-colors shadow-2xs group-hover:translate-x-0.5"
                    >
                      <span>Launch App</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
              <Info className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No tools found matching your criteria</h4>
              <p className="text-xs text-slate-500 mt-1">Try refining your search query or selecting a different category filter.</p>
              <button
                onClick={() => { setSelectedCategory('All Tools'); setSearchQuery(''); }}
                className="mt-4 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
