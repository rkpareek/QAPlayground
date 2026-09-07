import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Rocket,
  LayoutDashboard,
  FolderGit2,
  CalendarRange,
  PlayCircle,
  Cpu,
  GitMerge,
  BarChart3,
  Bug,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { docCategories } from '../../docs/docsRegistry';

interface Props {
  currentSlug: string;
  onSelectArticle: (slug: string) => void;
  onOpenSearch: () => void;
}

export const DocsSidebar: React.FC<Props> = ({
  currentSlug,
  onSelectArticle,
  onOpenSearch,
}) => {
  // By default, open the category of the active article
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const getCategoryIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4 shrink-0' };
    switch (iconName) {
      case 'Rocket':
        return <Rocket {...props} className="w-4 h-4 text-orange-500 shrink-0" />;
      case 'LayoutDashboard':
        return <LayoutDashboard {...props} className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'FolderGit2':
        return <FolderGit2 {...props} className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'CalendarRange':
        return <CalendarRange {...props} className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'PlayCircle':
        return <PlayCircle {...props} className="w-4 h-4 text-cyan-500 shrink-0" />;
      case 'Cpu':
        return <Cpu {...props} className="w-4 h-4 text-purple-500 shrink-0" />;
      case 'GitMerge':
        return <GitMerge {...props} className="w-4 h-4 text-pink-500 shrink-0" />;
      case 'BarChart3':
        return <BarChart3 {...props} className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'Bug':
        return <Bug {...props} className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} className="w-4 h-4 text-teal-500 shrink-0" />;
      case 'Settings':
        return <Settings {...props} className="w-4 h-4 text-slate-500 shrink-0" />;
      default:
        return <BookOpen {...props} className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/30 overflow-y-auto">
      {/* Search trigger */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-400 hover:border-blue-500 hover:text-slate-600 dark:hover:text-slate-200 shadow-2xs transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span>Search docs...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Docs navigation tree */}
      <div className="flex-1 p-3 space-y-4">
        {/* Overview link */}
        <button
          onClick={() => onSelectArticle('')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
            currentSlug === ''
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Documentation Home</span>
        </button>

        {/* Category list */}
        {docCategories.map((category) => {
          const isCollapsed = collapsedCategories[category.id] ?? false;
          const hasActiveChild = category.articles.some((a) => a.slug === currentSlug);

          return (
            <div key={category.id} className="space-y-1">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category.iconName)}
                  <span className={hasActiveChild ? 'text-blue-600 dark:text-blue-400 font-extrabold' : ''}>
                    {category.title}
                  </span>
                </div>
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                )}
              </button>

              {!isCollapsed && (
                <div className="pl-3.5 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-2">
                  {category.articles.map((article) => {
                    const isActive = currentSlug === article.slug;
                    return (
                      <button
                        key={article.slug}
                        onClick={() => onSelectArticle(article.slug)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all flex items-center justify-between truncate ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-semibold border-l-2 border-blue-600 pl-2'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                        }`}
                        title={article.title}
                      >
                        <span className="truncate">{article.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
